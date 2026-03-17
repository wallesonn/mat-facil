"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, BookMarked } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LessonCard } from "@/components/shared/LessonCard";
import { getTopicById, getLessonsByTopic } from "@/services/subjects";
import { DIFFICULTY_CONFIG } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import type { Topic, Lesson } from "@/types";

export default function TopicPage() {
  const { id, topicId } = useParams<{ id: string; topicId: string }>();
  const { profile } = useAuth();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [starsMap, setStarsMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!topicId || profile === undefined) return;

    async function load() {
      const [t, l] = await Promise.all([getTopicById(topicId), getLessonsByTopic(topicId)]);
      setTopic(t);
      setLessons(l);

      if (profile?.id && l.length > 0) {
        const supabase = createClient();
        const lessonIds = l.map((lesson) => lesson.id);
        const { data } = await supabase
          .from("quiz_results")
          .select("lesson_id, stars")
          .eq("user_id", profile.id)
          .in("lesson_id", lessonIds);
        if (data) {
          setStarsMap(Object.fromEntries(data.map((r) => [r.lesson_id, r.stars])));
        }
      }

      setLoading(false);
    }

    load();
  }, [topicId, profile]);

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <div className="h-8 w-56 bg-muted rounded animate-pulse" />
        <div className="h-28 bg-muted rounded-2xl animate-pulse" />
        {[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-muted rounded-xl animate-pulse" />)}
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="p-6 text-center py-20">
        <p className="text-muted-foreground">Assunto não encontrado.</p>
        <Link href={`/subjects/${id}`} className="text-primary hover:underline mt-2 inline-block">Voltar à matéria</Link>
      </div>
    );
  }

  const diffConfig = DIFFICULTY_CONFIG[topic.difficulty];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
        <Link href="/subjects" className="hover:text-primary transition-colors">Matérias</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/subjects/${id}`} className="hover:text-primary transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> {topic.subject?.name ?? "Matéria"}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium">{topic.title}</span>
      </nav>

      {/* Header do tópico */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-3xl border border-border p-6 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
            <BookMarked className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl font-bold text-foreground font-heading">{topic.title}</h1>
              <Badge variant="outline" className={diffConfig.color}>{diffConfig.label}</Badge>
            </div>
            {topic.description && <p className="text-muted-foreground text-sm">{topic.description}</p>}
            <p className="text-xs text-muted-foreground mt-2">{lessons.length} {lessons.length === 1 ? "aula" : "aulas"}</p>
          </div>
        </div>
      </motion.div>

      {/* Lista de aulas */}
      <div>
        <h2 className="text-lg font-bold text-foreground font-heading mb-3">Aulas</h2>
        {lessons.length === 0 ? (
          <div className="text-center py-14 bg-card rounded-2xl border border-border">
            <BookMarked className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">Nenhuma aula disponível ainda.</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Em breve novos conteúdos serão publicados!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {lessons.map((lesson, i) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                subjectId={id}
                topicId={topicId}
                index={i}
                stars={starsMap[lesson.id] ?? 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
