"use client";

import { useMemo, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, ChevronDown, ChevronUp, Minus, Plus, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LessonInteractiveDefinition, LessonInteractiveKey } from "@/data/lessonInteractions";

const SUPERSCRIPTS: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻",
};

function toSuperscript(value: number): string {
  return String(value).split("").map((c) => SUPERSCRIPTS[c] ?? c).join("");
}

function formatPolynomialTerm(coef: number, power: number, variable = "x", isFirst = false): string {
  if (coef === 0) return "";
  const abs = Math.abs(coef);
  const sign = coef < 0 ? (isFirst ? "-" : " - ") : isFirst ? "" : " + ";
  if (power === 0) return `${sign}${abs}`;
  const coefficientPart = abs === 1 ? "" : String(abs);
  const variablePart = `${variable}${power === 1 ? "" : toSuperscript(power)}`;
  return `${sign}${coefficientPart}${variablePart}`;
}

function formatPolynomial(coefficients: number[], variable = "x"): string {
  const terms = coefficients
    .map((coef, index) => formatPolynomialTerm(coef, coefficients.length - index - 1, variable, index === 0))
    .filter(Boolean);
  return terms.length === 0 ? "0" : terms.join("");
}

function formatMonomial(coef: number, xExp: number, yExp: number): string {
  if (coef === 0) return "0";
  const vars = [
    xExp > 0 ? `x${xExp === 1 ? "" : toSuperscript(xExp)}` : "",
    yExp > 0 ? `y${yExp === 1 ? "" : toSuperscript(yExp)}` : "",
  ].filter(Boolean);
  const abs = Math.abs(coef);
  const coefficientPart = abs === 1 && vars.length > 0 ? "" : String(abs);
  return `${coef < 0 ? "-" : ""}${coefficientPart}${vars.join("")}`;
}

function formatExpressionWithPower(coef: number, xExp: number, yExp: number, power: number): string {
  return `(${formatMonomial(coef, xExp, yExp)})${toSuperscript(power)}`;
}

function formatSignedNumber(value: number): string {
  return value >= 0 ? `+${value}` : String(value);
}

function Stepper({
  label,
  value,
  onChange,
  min,
  max,
  color = "indigo",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  color?: "indigo" | "purple" | "green" | "amber";
}) {
  const colorMap = {
    indigo: "bg-indigo-500/15 border-indigo-500/30 text-indigo-100",
    purple: "bg-purple-500/15 border-purple-500/30 text-purple-100",
    green:  "bg-green-500/15  border-green-500/30  text-green-100",
    amber:  "bg-amber-500/15  border-amber-500/30  text-amber-100",
  };
  const btnMap = {
    indigo: "hover:bg-indigo-500/20 text-indigo-400",
    purple: "hover:bg-purple-500/20 text-purple-400",
    green:  "hover:bg-green-500/20  text-green-400",
    amber:  "hover:bg-amber-500/20  text-amber-400",
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[11px] font-semibold text-muted-foreground tracking-wide uppercase">{label}</span>
      <div className={`flex flex-col items-center rounded-xl border ${colorMap[color]} overflow-hidden w-12`}>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className={`w-full flex items-center justify-center h-7 transition-colors disabled:opacity-30 ${btnMap[color]}`}
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <div className="w-full text-center text-base font-bold py-1 select-none leading-none">
          {value}
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className={`w-full flex items-center justify-center h-7 transition-colors disabled:opacity-30 ${btnMap[color]}`}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function ResultBadge({ label, value, accent = "green" }: { label: string; value: string; accent?: "green" | "indigo" | "purple" }) {
  const cls = {
    green:  "from-green-500/10  to-emerald-500/10  border-green-500/25  text-green-200",
    indigo: "from-indigo-500/10 to-violet-500/10   border-indigo-500/25 text-indigo-200",
    purple: "from-purple-500/10 to-fuchsia-500/10  border-purple-500/25 text-purple-200",
  }[accent];

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${cls} border p-4 text-center space-y-1`}>
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <AnimatePresence mode="wait">
        <motion.p
          key={value}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.18 }}
          className="text-2xl sm:text-3xl font-bold"
        >
          {value}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function CanvasShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 via-card to-card overflow-hidden shadow-lg shadow-black/10"
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-indigo-500/15 bg-indigo-500/5">
        <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0 ring-1 ring-indigo-500/30">
          <Sparkles className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{description}</p>
        </div>
        <div className="ml-auto flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-[11px] font-semibold text-indigo-400">
            <Zap className="w-3 h-3" /> Interativo
          </span>
        </div>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </motion.section>
  );
}

function SectionCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-4 space-y-3 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <p className="text-sm font-semibold text-foreground">{children}</p>;
}

function HintBox({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-1.5">
      <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wide">
        <Calculator className="w-3.5 h-3.5" /> Dica
      </div>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

function PotenciacaoCanvas() {
  const [negative, setNegative] = useState(false);
  const [coefficient, setCoefficient] = useState(3);
  const [xExp, setXExp] = useState(2);
  const [yExp, setYExp] = useState(1);
  const [power, setPower] = useState(2);

  const baseCoef = negative ? -coefficient : coefficient;
  const signFactor = baseCoef < 0 && power % 2 !== 0 ? -1 : 1;
  const resultCoef = Math.pow(Math.abs(baseCoef), power) * signFactor;
  const resultXExp = xExp * power;
  const resultYExp = yExp * power;

  const baseExpr = useMemo(() => formatExpressionWithPower(baseCoef, xExp, yExp, power), [baseCoef, xExp, yExp, power]);
  const resultExpression = useMemo(() => formatMonomial(resultCoef, resultXExp, resultYExp), [resultCoef, resultXExp, resultYExp]);

  return (
    <CanvasShell
      title="Potenciação de monômios"
      description="Ajuste a base e a potência para ver a regra em tempo real."
    >
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <SectionCard>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <SectionTitle>Configure o monômio</SectionTitle>
            <Button
              type="button"
              size="sm"
              variant={negative ? "destructive" : "outline"}
              onClick={() => setNegative((p) => !p)}
              className="gap-1.5 h-8 text-xs"
            >
              {negative ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              {negative ? "Negativo" : "Positivo"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 justify-center sm:justify-start pt-1">
            <Stepper label="Coef." value={coefficient} onChange={setCoefficient} min={1} max={9} color="indigo" />
            <Stepper label="exp. x" value={xExp} onChange={setXExp} min={0} max={5} color="indigo" />
            <Stepper label="exp. y" value={yExp} onChange={setYExp} min={0} max={5} color="indigo" />
            <Stepper label="Potência" value={power} onChange={setPower} min={1} max={5} color="amber" />
          </div>

          <HintBox>
            O coeficiente é elevado à potência e os expoentes das variáveis são <strong>multiplicados</strong> pela potência.
          </HintBox>
        </SectionCard>

        <div className="space-y-3">
          <ResultBadge label="Expressão" value={baseExpr} accent="indigo" />
          <div className="flex items-center justify-center gap-1 text-muted-foreground text-xl font-bold">=</div>
          <ResultBadge label="Resultado" value={resultExpression} accent="green" />
        </div>
      </div>
    </CanvasShell>
  );
}

function PolynomialSumOrSubtractionCanvas({ definition }: { definition: LessonInteractiveDefinition }) {
  const isSubtraction = definition.key === "subtracao-polinomios";
  const operatorLabel = isSubtraction ? "−" : "+";

  const [p2, setP2] = useState(3);
  const [p1, setP1] = useState(2);
  const [p0, setP0] = useState(-1);
  const [q2, setQ2] = useState(1);
  const [q1, setQ1] = useState(-5);
  const [q0, setQ0] = useState(4);

  const effectiveQ = isSubtraction ? [-q2, -q1, -q0] : [q2, q1, q0];
  const result = [p2 + effectiveQ[0], p1 + effectiveQ[1], p0 + effectiveQ[2]];

  const pExpr = useMemo(() => formatPolynomial([p2, p1, p0]), [p2, p1, p0]);
  const qExpr = useMemo(() => formatPolynomial([q2, q1, q0]), [q2, q1, q0]);
  const resultExpr = useMemo(() => formatPolynomial(result), [result]);
  const flippedQExpr = useMemo(() => formatPolynomial(effectiveQ), [effectiveQ]);

  const columns = [
    { label: "x²", p: p2, q: q2, r: result[0] },
    { label: "x",  p: p1, q: q1, r: result[1] },
    { label: "cte", p: p0, q: q0, r: result[2] },
  ];

  return (
    <CanvasShell title={definition.title} description={definition.description}>
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <SectionCard>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <SectionTitle>Editar os polinômios</SectionTitle>
              <span className="inline-flex items-center rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400">
                P(x) {operatorLabel} Q(x)
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-3">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">P(x)</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Stepper label="x²" value={p2} onChange={setP2} min={-9} max={9} color="indigo" />
                  <Stepper label="x"  value={p1} onChange={setP1} min={-9} max={9} color="indigo" />
                  <Stepper label="cte" value={p0} onChange={setP0} min={-9} max={9} color="indigo" />
                </div>
                <AnimatePresence mode="wait">
                  <motion.p key={pExpr} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold text-indigo-200 text-center">
                    {pExpr}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-3">
                <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide">Q(x)</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Stepper label="x²" value={q2} onChange={setQ2} min={-9} max={9} color="purple" />
                  <Stepper label="x"  value={q1} onChange={setQ1} min={-9} max={9} color="purple" />
                  <Stepper label="cte" value={q0} onChange={setQ0} min={-9} max={9} color="purple" />
                </div>
                <AnimatePresence mode="wait">
                  <motion.p key={qExpr} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold text-purple-200 text-center">
                    {qExpr}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </SectionCard>

          <HintBox>
            {isSubtraction
              ? <>Troque o sinal de todos os termos de Q(x) e some normalmente. Sinal trocado: <strong className="text-amber-200">{flippedQExpr}</strong></>
              : "Some os coeficientes dos termos semelhantes, mantendo o grau de cada variável."
            }
          </HintBox>
        </div>

        <div className="space-y-3">
          <SectionCard>
            <SectionTitle>Termos alinhados</SectionTitle>
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide px-1">
                <span>Grau</span>
                <span className="text-center text-indigo-400">P(x)</span>
                <span className="text-center text-purple-400">{isSubtraction ? "-Q(x)" : "Q(x)"}</span>
                <span className="text-center text-green-400">Soma</span>
              </div>
              {columns.map((col) => (
                <div key={col.label} className="grid grid-cols-4 gap-2 items-center">
                  <div className="text-xs font-semibold text-muted-foreground bg-muted/40 rounded-lg px-2 py-2 text-center">{col.label}</div>
                  <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 py-2 text-center text-sm font-semibold text-indigo-200">{formatSignedNumber(col.p)}</div>
                  <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 py-2 text-center text-sm font-semibold text-purple-200">{isSubtraction ? formatSignedNumber(-col.q) : formatSignedNumber(col.q)}</div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={col.r}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="rounded-lg bg-green-500/10 border border-green-500/20 py-2 text-center text-sm font-bold text-green-300"
                    >
                      {formatSignedNumber(col.r)}
                    </motion.div>
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </SectionCard>

          <ResultBadge label={`P(x) ${operatorLabel} Q(x)`} value={resultExpr} accent="green" />
        </div>
      </div>
    </CanvasShell>
  );
}

function PolynomialMultiplicationCanvas({ definition }: { definition: LessonInteractiveDefinition }) {
  const [a, setA] = useState(2);
  const [b, setB] = useState(-3);
  const [c, setC] = useState(1);
  const [d, setD] = useState(4);

  const firstTerm  = a * c;
  const middleTerm = a * d + b * c;
  const lastTerm   = b * d;

  const firstExpr  = useMemo(() => formatPolynomial([a, b]), [a, b]);
  const secondExpr = useMemo(() => formatPolynomial([c, d]), [c, d]);
  const resultExpr = useMemo(() => formatPolynomial([firstTerm, middleTerm, lastTerm]), [firstTerm, middleTerm, lastTerm]);

  const cells = [
    { label: "1º × 1º", expr: `${a >= 0 ? "" : "-"}${Math.abs(a)}x · ${c >= 0 ? "" : "-"}${Math.abs(c)}x`, result: formatPolynomialTerm(firstTerm,  2, "x", true), color: "indigo" as const },
    { label: "1º × 2º", expr: `${a >= 0 ? "" : "-"}${Math.abs(a)}x · ${d >= 0 ? "+" : ""}${d}`,          result: formatPolynomialTerm(a * d,       1, "x", true), color: "purple" as const },
    { label: "2º × 1º", expr: `${b >= 0 ? "+" : ""}${b} · ${c >= 0 ? "" : "-"}${Math.abs(c)}x`,          result: formatPolynomialTerm(b * c,       1, "x", true), color: "purple" as const },
    { label: "2º × 2º", expr: `${b >= 0 ? "+" : ""}${b} · ${d >= 0 ? "+" : ""}${d}`,                     result: formatPolynomialTerm(lastTerm,    0, "x", true), color: "green"  as const },
  ];

  const cellColors = {
    indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-200",
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-200",
    green:  "bg-green-500/10  border-green-500/20  text-green-200",
  };

  return (
    <CanvasShell title={definition.title} description={definition.description}>
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <SectionCard>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <SectionTitle>Monte os binômios</SectionTitle>
              <span className="inline-flex items-center rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">
                Distributiva
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-3">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">1º binômio</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Stepper label="a (x)" value={a} onChange={setA} min={-9} max={9} color="indigo" />
                  <Stepper label="b (cte)" value={b} onChange={setB} min={-9} max={9} color="indigo" />
                </div>
                <AnimatePresence mode="wait">
                  <motion.p key={firstExpr} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold text-indigo-200 text-center">
                    ({firstExpr})
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4 space-y-3">
                <p className="text-xs font-semibold text-green-400 uppercase tracking-wide">2º binômio</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Stepper label="c (x)" value={c} onChange={setC} min={-9} max={9} color="green" />
                  <Stepper label="d (cte)" value={d} onChange={setD} min={-9} max={9} color="green" />
                </div>
                <AnimatePresence mode="wait">
                  <motion.p key={secondExpr} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold text-green-200 text-center">
                    ({secondExpr})
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </SectionCard>

          <HintBox>
            Cada termo do 1º binômio multiplica todos os termos do 2º. Depois, some os termos semelhantes de grau 1.
          </HintBox>
        </div>

        <div className="space-y-3">
          <SectionCard>
            <SectionTitle>Quadro distributivo</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              {cells.map((cell) => (
                <div key={cell.label} className={`rounded-xl border p-3 space-y-1.5 ${cellColors[cell.color]}`}>
                  <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">{cell.label}</p>
                  <p className="text-xs">{cell.expr}</p>
                  <AnimatePresence mode="wait">
                    <motion.p key={cell.result} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-sm font-bold">
                      {cell.result}
                    </motion.p>
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </SectionCard>

          <ResultBadge label={`(${firstExpr})(${secondExpr})`} value={resultExpr} accent="green" />
        </div>
      </div>
    </CanvasShell>
  );
}

export default function LessonInteractiveCanvas({ definition }: { definition: LessonInteractiveDefinition }) {
  switch (definition.key as LessonInteractiveKey) {
    case "potenciacao-monomios":
      return <PotenciacaoCanvas />;
    case "soma-polinomios":
    case "subtracao-polinomios":
      return <PolynomialSumOrSubtractionCanvas definition={definition} />;
    case "multiplicacao-polinomios":
      return <PolynomialMultiplicationCanvas definition={definition} />;
    default:
      return null;
  }
}
