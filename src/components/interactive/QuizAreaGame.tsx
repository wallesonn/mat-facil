"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Trophy, Zap, X, Star, CheckCircle2, XCircle, ArrowRight, Sparkles } from "lucide-react";
import { pickQuizQuestions, type QuizQuestion } from "@/data/areaQuizQuestions";
import { playCorrect, playWrong, playComplete, playTick, playStart } from "@/lib/sounds";
import { getQuizResult, saveQuizResult } from "@/services/quiz";
import { POINTS } from "@/lib/constants";

const XP_PER_QUESTION = POINTS.QUIZ_PER_QUESTION;
const TOTAL_QUESTIONS = 5;

// ─── Grid SVG ───────────────────────────────────────────────
function GridVisual({ grid }: { grid: NonNullable<QuizQuestion["grid"]> }) {
  const cellSize = 36;
  const gap = 1;
  const w = grid.cols * (cellSize + gap) + gap;
  const h = grid.rows * (cellSize + gap) + gap;

  const filledSet = new Set(grid.filled.map(([r, c]) => `${r},${c}`));
  const partialSet = new Set((grid.partial ?? []).map(([r, c]) => `${r},${c}`));

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="mx-auto my-3 max-w-full">
      {Array.from({ length: grid.rows }, (_, r) =>
        Array.from({ length: grid.cols }, (_, c) => {
          const x = gap + c * (cellSize + gap);
          const y = gap + r * (cellSize + gap);
          const key = `${r},${c}`;
          const isFilled = filledSet.has(key);
          const isPartial = partialSet.has(key);

          return (
            <g key={key}>
              <rect
                x={x} y={y}
                width={cellSize} height={cellSize}
                rx={4}
                fill={isFilled ? "#22c55e" : isPartial ? "#eab308" : "#1e293b"}
                opacity={isFilled ? 0.85 : isPartial ? 0.7 : 0.4}
                stroke="#334155"
                strokeWidth={1}
              />
              {isPartial && (
                <line
                  x1={x} y1={y + cellSize}
                  x2={x + cellSize} y2={y}
                  stroke="#334155" strokeWidth={1.5} opacity={0.5}
                />
              )}
            </g>
          );
        })
      )}
    </svg>
  );
}

// ─── Timer Bar ──────────────────────────────────────────────
function TimerBar({ timeLeft, timeLimit }: { timeLeft: number; timeLimit: number }) {
  const pct = (timeLeft / timeLimit) * 100;
  const color = pct > 50 ? "bg-green-500" : pct > 25 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
      <motion.div
        className={`h-full ${color} rounded-full`}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}

// ─── Confetti particles ─────────────────────────────────────
function Confetti() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.sin(i * 0.85) * 120 + (i % 3) * 40,
    y: -(80 + (i % 5) * 30),
    rotate: i * 47,
    color: ["#22c55e", "#eab308", "#3b82f6", "#ec4899", "#f97316"][i % 5],
    delay: (i % 6) * 0.06,
    size: 6 + (i % 3) * 3,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            left: "50%",
            top: "50%",
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: [1, 1, 0],
            rotate: p.rotate,
            scale: [0, 1.2, 0.8],
          }}
          transition={{ duration: 1.2, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────
interface QuizAreaGameProps {
  userId?: string;
  lessonId?: string;
  onComplete: (score: number, totalXP: number) => void;
}

type Phase = "intro" | "playing" | "feedback" | "results";

export default function QuizAreaGame({ userId, lessonId, onComplete }: QuizAreaGameProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [previousStars, setPreviousStars] = useState(0);
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasTickedRef = useRef(false);
  const scoreRef = useRef(0);

  // Load previous quiz result
  useEffect(() => {
    if (!userId || !lessonId) return;
    getQuizResult(userId, lessonId).then((result) => {
      if (result) setPreviousStars(result.stars);
    });
  }, [userId, lessonId]);

  // Start quiz
  const startQuiz = useCallback(() => {
    const picked = pickQuizQuestions();
    setQuestions(picked);
    setCurrent(0);
    setScore(0);
    scoreRef.current = 0;
    setSelected(null);
    setIsCorrect(null);
    setTimeLeft(picked[0].timeLimit);
    setPhase("playing");
    playStart();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up — treat as wrong
          clearInterval(timerRef.current!);
          setIsCorrect(false);
          setPhase("feedback");
          playWrong();
          return 0;
        }
        if (prev <= 4 && !hasTickedRef.current) {
          playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, current]);

  // Handle answer selection
  function handleAnswer(optionIndex: number) {
    if (selected !== null || phase !== "playing") return;
    if (timerRef.current) clearInterval(timerRef.current);

    const correct = questions[current].options[optionIndex].correct;
    setSelected(optionIndex);
    setIsCorrect(correct);

    if (correct) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      playCorrect();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1200);
    } else {
      playWrong();
    }

    setPhase("feedback");
  }

  // Next question or results
  async function handleNext() {
    const nextIdx = current + 1;
    if (nextIdx >= TOTAL_QUESTIONS) {
      const finalScore = scoreRef.current;
      const finalStars = finalScore >= 5 ? 3 : finalScore >= 3 ? 2 : finalScore >= 1 ? 1 : 0;
      playComplete();
      setPhase("results");

      // Save result and get incremental XP
      if (userId && lessonId) {
        setSaving(true);
        const result = await saveQuizResult(
          userId, lessonId, finalScore, TOTAL_QUESTIONS, finalStars, XP_PER_QUESTION
        );
        setXpAwarded(result.xpAwarded);
        setPreviousStars(Math.max(previousStars, finalStars));
        setSaving(false);
        onComplete(finalScore, result.xpAwarded);
      } else {
        onComplete(finalScore, finalScore * XP_PER_QUESTION);
      }
    } else {
      setCurrent(nextIdx);
      setSelected(null);
      setIsCorrect(null);
      hasTickedRef.current = false;
      setTimeLeft(questions[nextIdx].timeLimit);
      setPhase("playing");
    }
  }

  // Difficulty badge
  function DiffBadge({ d }: { d: string }) {
    const cfg = {
      easy: { label: "Fácil", cls: "bg-green-500/20 text-green-400" },
      medium: { label: "Médio", cls: "bg-yellow-500/20 text-yellow-400" },
      hard: { label: "Difícil", cls: "bg-red-500/20 text-red-400" },
    }[d] ?? { label: d, cls: "bg-muted text-muted-foreground" };
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.cls}`}>{cfg.label}</span>;
  }

  // ─── INTRO ────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-2xl p-6 sm:p-8 text-center space-y-5"
      >
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold font-heading text-foreground">Quiz: Área com Quadrícula</h3>

        {previousStars > 0 && (
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                className={`w-5 h-5 ${s <= previousStars ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">Seu melhor resultado</span>
          </div>
        )}

        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Responda 5 perguntas sobre cálculo de área usando o método da quadrícula.
          Cada resposta certa vale <strong className="text-yellow-400">{XP_PER_QUESTION} XP</strong>!
          {previousStars > 0 && " Conquiste mais estrelas para ganhar XP extra!"}
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Timer className="w-3.5 h-3.5" /> Tempo limitado</span>
          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400" /> Máx {TOTAL_QUESTIONS * XP_PER_QUESTION} XP</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <span className="bg-green-500/10 text-green-400 px-2.5 py-1 rounded-full">2 Fáceis (15s)</span>
          <span className="bg-yellow-500/10 text-yellow-400 px-2.5 py-1 rounded-full">2 Médias (12s)</span>
          <span className="bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full">1 Difícil (10s)</span>
        </div>
        <button
          onClick={startQuiz}
          className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-all active:scale-95"
        >
          <Zap className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          Iniciar Quiz
        </button>
      </motion.div>
    );
  }

  // ─── RESULTS ──────────────────────────────────────────────
  if (phase === "results") {
    const pct = Math.round((score / TOTAL_QUESTIONS) * 100);
    const stars = score >= 5 ? 3 : score >= 3 ? 2 : score >= 1 ? 1 : 0;
    const emoji = score === 5 ? "🏆" : score >= 3 ? "🎉" : score >= 1 ? "👍" : "😢";
    const msg = score === 5 ? "Perfeito!" : score >= 3 ? "Muito bem!" : score >= 1 ? "Continue praticando!" : "Tente novamente!";
    const displayXP = xpAwarded !== null ? xpAwarded : score * XP_PER_QUESTION;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-card border border-border rounded-2xl p-6 sm:p-8 text-center space-y-5 overflow-hidden"
      >
        <Confetti />

        <div className="text-5xl">{emoji}</div>
        <h3 className="text-2xl font-bold font-heading text-foreground">{msg}</h3>

        {/* Stars */}
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <motion.div
              key={s}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: s * 0.2, type: "spring", stiffness: 200 }}
            >
              <Star
                className={`w-10 h-10 ${s <= stars ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}`}
              />
            </motion.div>
          ))}
        </div>

        {/* Score */}
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">{score}/{TOTAL_QUESTIONS}</div>
            <div className="text-xs text-muted-foreground">Acertos</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {saving ? "..." : `+${displayXP}`}
            </div>
            <div className="text-xs text-muted-foreground">XP ganhos</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">{pct}%</div>
            <div className="text-xs text-muted-foreground">Aproveitamento</div>
          </div>
        </div>

        {xpAwarded !== null && xpAwarded === 0 && stars <= previousStars && (
          <p className="text-xs text-muted-foreground">
            Você já conquistou {previousStars} estrela{previousStars !== 1 ? "s" : ""} neste quiz. Conquiste mais para ganhar XP!
          </p>
        )}

        <button
          onClick={() => {
            setPhase("intro");
            setShowConfetti(false);
            setXpAwarded(null);
          }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          Jogar Novamente
        </button>
      </motion.div>
    );
  }

  // ─── PLAYING / FEEDBACK ───────────────────────────────────
  const q = questions[current];
  if (!q) return null;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 space-y-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {current + 1}/{TOTAL_QUESTIONS}
            </span>
            <DiffBadge d={q.difficulty} />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Timer className={`w-4 h-4 ${timeLeft <= 3 ? "text-red-400" : "text-muted-foreground"}`} />
            <span className={`font-mono font-bold ${timeLeft <= 3 ? "text-red-400" : "text-foreground"}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < current ? "bg-green-500" : i === current ? "bg-indigo-500" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <TimerBar timeLeft={timeLeft} timeLimit={q.timeLimit} />
      </div>

      {/* Question body */}
      <div className="p-5 sm:p-6 space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <h4 className="text-lg font-semibold text-foreground leading-snug">{q.question}</h4>

            {q.grid && <GridVisual grid={q.grid} />}

            {q.grid && (
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-2">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-green-500/80 inline-block" /> Inteiro
                </span>
                {q.grid.partial && q.grid.partial.length > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-yellow-500/70 inline-block" /> Parcial
                  </span>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Options */}
        <div className={`grid gap-3 ${q.type === "true_false" ? "grid-cols-2" : "grid-cols-1"}`}>
          {q.options.map((opt, i) => {
            let optCls = "bg-muted/50 border-border hover:bg-muted hover:border-indigo-500/50";
            if (phase === "feedback") {
              if (opt.correct) {
                optCls = "bg-green-500/15 border-green-500 text-green-400";
              } else if (i === selected && !opt.correct) {
                optCls = "bg-red-500/15 border-red-500 text-red-400";
              } else {
                optCls = "bg-muted/30 border-border opacity-50";
              }
            }

            return (
              <motion.button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={phase === "feedback"}
                className={`relative border rounded-xl px-4 py-3 text-left font-medium transition-all ${optCls} ${
                  phase === "playing" ? "active:scale-[0.98] cursor-pointer" : "cursor-default"
                }`}
                animate={
                  phase === "feedback" && i === selected && !isCorrect
                    ? { x: [0, -8, 8, -6, 6, 0] }
                    : {}
                }
                transition={{ duration: 0.4 }}
              >
                <span className="flex items-center gap-2">
                  {phase === "feedback" && opt.correct && (
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  )}
                  {phase === "feedback" && i === selected && !opt.correct && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                  {opt.text}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {phase === "feedback" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div
                className={`flex items-start gap-2 text-sm p-3 rounded-lg ${
                  isCorrect
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                )}
                <div>
                  <span className="font-semibold">{isCorrect ? "Correto! " : timeLeft === 0 ? "Tempo esgotado! " : "Incorreto! "}</span>
                  {q.explanation}
                </div>
              </div>

              {isCorrect && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-center gap-1 text-yellow-400 font-bold text-sm"
                >
                  <Zap className="w-4 h-4 fill-yellow-400" />
                  +{XP_PER_QUESTION} XP
                </motion.div>
              )}

              <button
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-all active:scale-[0.98]"
              >
                {current + 1 >= TOTAL_QUESTIONS ? (
                  <>
                    <Trophy className="w-4 h-4" /> Ver Resultado
                  </>
                ) : (
                  <>
                    Próxima <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {showConfetti && <Confetti />}
      </div>
    </div>
  );
}
