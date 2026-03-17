"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, ArrowLeft, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import { TopicCard } from "@/components/shared/TopicCard";
import { getSubjectById, getTopicsBySubject } from "@/services/subjects";
import { checkGradeUnlocked } from "@/services/quiz";
import { useAuth } from "@/hooks/useAuth";
import { GRADES } from "@/types";
import type { Subject, Topic } from "@/types";

// Ordem das séries para agrupamento
const GRADE_ORDER = GRADES as readonly string[];

export default function SubjectPage() {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [unlockedGrades, setUnlockedGrades] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || profile === undefined) return;

    async function load() {
      const [sub, tops] = await Promise.all([getSubjectById(id), getTopicsBySubject(id)]);
      setSubject(sub);
      setTopics(tops);

      // Verifica desbloqueio para a série do aluno
      if (profile?.id && profile?.grade) {
        const unlocked = await checkGradeUnlocked(profile.id, id, profile.grade);
        if (unlocked) {
          setUnlockedGrades(new Set([profile.grade]));
        }
      }

      setLoading(false);
    }

    load();
  }, [id, profile]);

  // Agrupa tópicos por série
  const groupedTopics = (() => {
    const groups: { grade: string; topics: Topic[] }[] = [];
    const byGrade = new Map<string, Topic[]>();

    for (const topic of topics) {
      const grade = topic.grade || "Sem série";
      if (!byGrade.has(grade)) byGrade.set(grade, []);
      byGrade.get(grade)!.push(topic);
    }

    // Ordena pela ordem de GRADES
    const sortedGrades = [...byGrade.keys()].sort((a, b) => {
      const ai = GRADE_ORDER.indexOf(a);
      const bi = GRADE_ORDER.indexOf(b);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });

    for (const grade of sortedGrades) {
      groups.push({ grade, topics: byGrade.get(grade)! });
    }

    return groups;
  })();

  // Verifica se um tópico está bloqueado para o aluno
  function isTopicLocked(topic: Topic): boolean {
    if (!profile || profile.role === "admin") return false;
    if (!topic.grade) return false; // Tópicos sem série → sempre acessível
    if (!profile.grade) return true; // Aluno sem série → tudo bloqueado

    const topicGradeIdx = GRADE_ORDER.indexOf(topic.grade);
    const studentGradeIdx = GRADE_ORDER.indexOf(profile.grade);

    // Séries anteriores → acessíveis (aluno precisa delas para desbloquear a sua)
    if (topicGradeIdx < studentGradeIdx) return false;

    // Séries posteriores à do aluno → sempre bloqueadas
    if (topicGradeIdx > studentGradeIdx) return true;

    // Série do aluno: depende do desbloqueio (3★ na série anterior)
    return !unlockedGrades.has(topic.grade);
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-32 bg-muted rounded-2xl animate-pulse" />
        {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="p-6 text-center py-20">
        <p className="text-muted-foreground">Matéria não encontrada.</p>
        <Link href="/subjects" className="text-primary hover:underline mt-2 inline-block">Voltar às matérias</Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/subjects" className="hover:text-primary transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Matérias
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium">{subject.name}</span>
      </nav>

      {/* Header da matéria */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{subject.name}</h1>
            {subject.description && <p className="text-white/70 mt-1 text-sm">{subject.description}</p>}
            <p className="text-white/60 text-xs mt-2">{topics.length} {topics.length === 1 ? "assunto" : "assuntos"}</p>
          </div>
        </div>
      </motion.div>

      {/* Lista de tópicos agrupados por série */}
      <div className="space-y-6">
        {groupedTopics.length === 0 ? (
          <div className="text-center py-14 bg-card rounded-2xl border border-border">
            <BookOpen className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">Nenhum assunto disponível ainda.</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Em breve novos conteúdos serão adicionados!</p>
          </div>
        ) : (
          groupedTopics.map(({ grade, topics: gradeTopics }) => {
            const isStudentGrade = profile?.grade === grade;
            const allLocked = gradeTopics.every((t) => isTopicLocked(t));

            return (
              <div key={grade}>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-lg font-bold text-foreground font-heading">{grade}</h2>
                  {isStudentGrade && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                      Sua série
                    </span>
                  )}
                  {allLocked && (
                    <Lock className="w-3.5 h-3.5 text-muted-foreground/50" />
                  )}
                </div>
                <div className="space-y-2">
                  {gradeTopics.map((topic, i) => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      subjectId={id}
                      index={i}
                      locked={isTopicLocked(topic)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
