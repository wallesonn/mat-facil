"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getLessonById, getLessonProgress } from "@/services/subjects";
import { completeLesson } from "@/services/gamification";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import GridAreaCanvas from "@/components/interactive/GridAreaCanvas";
import QuizAreaGame from "@/components/interactive/QuizAreaGame";
import type { Lesson } from "@/types";

export default function LessonPage() {
  const { id, topicId, lessonId } = useParams<{ id: string; topicId: string; lessonId: string }>();
  const { profile } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [quizXP, setQuizXP] = useState<number | null>(null);

  useEffect(() => {
    if (!lessonId) return;
    getLessonById(lessonId).then((data) => {
      setLesson(data);
      setLoading(false);
    });
    // Check if already completed
    if (profile?.id) {
      getLessonProgress(profile.id, lessonId).then((progress) => {
        if (progress?.completed) setCompleted(true);
      });
    }
  }, [lessonId, profile?.id]);

  async function handleComplete() {
    if (!profile?.id || !lessonId || !topicId || completed) return;
    setCompleting(true);
    const result = await completeLesson(profile.id, lessonId, topicId);
    if (result.success) setCompleted(true);
    setCompleting(false);
  }

  function handleQuizComplete(score: number, totalXP: number) {
    setQuizXP(totalXP);
    if (!completed && profile?.id && lessonId && topicId) {
      handleComplete();
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="h-96 bg-muted rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="p-6 text-center py-20">
        <p className="text-muted-foreground">Aula não encontrada.</p>
        <Link href={`/subjects/${id}/topics/${topicId}`} className="text-primary hover:underline mt-2 inline-block">
          Voltar ao assunto
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
        <Link href="/subjects" className="hover:text-primary transition-colors">Matérias</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/subjects/${id}`} className="hover:text-primary transition-colors">
          {lesson.topic?.subject?.name ?? "Matéria"}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/subjects/${id}/topics/${topicId}`} className="hover:text-primary transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> {lesson.topic?.title ?? "Assunto"}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium truncate max-w-[160px]">{lesson.title}</span>
      </nav>

      {/* Título da aula */}
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">{lesson.title}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {lesson.topic?.subject?.name} · {lesson.topic?.title}
        </p>
      </div>

      {/* Conteúdo interativo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GridAreaCanvas />
      </motion.div>

      {/* Quiz */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <QuizAreaGame onComplete={handleQuizComplete} />
      </motion.div>

      {/* Status de conclusão */}
      <div className="flex items-center gap-4 flex-wrap">
        {completed && (
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full px-5 py-2.5 text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            Aula concluída! +{lesson.xp_reward} XP
          </div>
        )}
      </div>

      {/* Navegação */}
      <div className="flex justify-start">
        <Link
          href={`/subjects/${id}/topics/${topicId}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar à lista de aulas
        </Link>
      </div>
    </div>
  );
}
