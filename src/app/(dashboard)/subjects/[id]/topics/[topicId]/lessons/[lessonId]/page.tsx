"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, Construction, Zap } from "lucide-react";
import Link from "next/link";
import { getLessonById } from "@/services/subjects";
import type { Lesson } from "@/types";

export default function LessonPage() {
  const { id, topicId, lessonId } = useParams<{ id: string; topicId: string; lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lessonId) return;
    getLessonById(lessonId).then((data) => {
      setLesson(data);
      setLoading(false);
    });
  }, [lessonId]);

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

      {/* Placeholder de conteúdo interativo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 border-2 border-dashed border-blue-500/20 rounded-3xl p-10 text-center"
      >
        {/* Ícone animado */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl shadow-blue-500/30 mb-6"
        >
          <Construction className="w-10 h-10 text-white" />
        </motion.div>

        <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">
          Conteúdo interativo em breve! 🚀
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Esta aula está sendo preparada com conteúdo interativo, exercícios e explicações passo a passo. Volte em breve!
        </p>

        {/* Features futuras */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-6">
          {[
            { emoji: "📖", label: "Explicações passo a passo" },
            { emoji: "✏️", label: "Exercícios interativos" },
            { emoji: "🤖", label: "Tutor com IA" },
          ].map((feature) => (
            <div key={feature.label} className="bg-card rounded-2xl p-3 border border-border">
              <div className="text-2xl mb-1">{feature.emoji}</div>
              <p className="text-xs text-muted-foreground font-medium">{feature.label}</p>
            </div>
          ))}
        </div>

        {/* Pontuação futura */}
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-full px-4 py-1.5 text-sm font-medium">
          <Zap className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          +10 XP ao completar esta aula
        </div>
      </motion.div>

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
