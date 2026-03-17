// ============================================================
// SERVIÇO DE QUIZ — salvar/buscar resultados e XP incremental
// ============================================================

import { createClient } from "@/lib/supabase/client";
import { addPoints } from "@/services/gamification";
import { GRADES } from "@/types";

/**
 * Retorna a série anterior na ordem de GRADES.
 * Ex: "7º ano" → "6º ano", "1º ano EM" → "9º ano", "6º ano" → null
 */
export function getPreviousGrade(grade: string): string | null {
  const idx = GRADES.indexOf(grade as typeof GRADES[number]);
  if (idx <= 0) return null;
  return GRADES[idx - 1];
}

/**
 * Verifica se o conteúdo interativo de uma série está desbloqueado para o aluno.
 *
 * Regras:
 * - Só desbloqueia tópicos da série do aluno
 * - Precisa de 3 estrelas em TODOS os quizzes das aulas dos tópicos da série anterior (mesma matéria)
 * - Se não existir tópico da série anterior na mesma matéria → desbloqueia automaticamente
 * - Se não existir aula publicada nos tópicos da série anterior → desbloqueia automaticamente
 */
export async function checkGradeUnlocked(
  userId: string,
  subjectId: string,
  studentGrade: string
): Promise<boolean> {
  const prevGrade = getPreviousGrade(studentGrade);

  // Primeira série (6º ano) ou sem série anterior → desbloqueado
  if (!prevGrade) return true;

  const supabase = createClient();

  // Busca tópicos da série anterior nesta matéria
  const { data: prevTopics } = await supabase
    .from("topics")
    .select("id")
    .eq("subject_id", subjectId)
    .eq("grade", prevGrade);

  // Sem tópicos da série anterior nesta matéria → desbloqueia automaticamente
  if (!prevTopics || prevTopics.length === 0) return true;

  const topicIds = prevTopics.map((t) => t.id);

  // Busca todas as aulas publicadas desses tópicos
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id")
    .in("topic_id", topicIds)
    .eq("status", "published");

  // Sem aulas publicadas na série anterior → desbloqueia
  if (!lessons || lessons.length === 0) return true;

  const lessonIds = lessons.map((l) => l.id);

  // Busca resultados do quiz do aluno para essas aulas
  const { data: results } = await supabase
    .from("quiz_results")
    .select("lesson_id, stars")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds);

  // Precisa ter resultado para TODAS as aulas e TODAS com 3 estrelas
  if (!results || results.length < lessonIds.length) return false;

  const resultsMap = new Map(results.map((r) => [r.lesson_id, r.stars]));
  return lessonIds.every((id) => (resultsMap.get(id) ?? 0) >= 3);
}

export interface QuizResult {
  id: string;
  user_id: string;
  lesson_id: string;
  score: number;
  total_questions: number;
  stars: number;
  xp_earned: number;
  completed_at: string;
}

/**
 * Busca o resultado do quiz de um aluno para uma aula.
 * Retorna null se nunca fez o quiz.
 */
export async function getQuizResult(
  userId: string,
  lessonId: string
): Promise<QuizResult | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("quiz_results")
    .select("*")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  return data ?? null;
}

/**
 * Salva o resultado do quiz.
 * - Se é a primeira vez: insere e dá XP total.
 * - Se já fez: só atualiza se conquistou MAIS estrelas.
 *   Nesse caso, dá apenas o XP incremental (diferença).
 *
 * Retorna { saved: boolean, xpAwarded: number, previousStars: number }
 */
export async function saveQuizResult(
  userId: string,
  lessonId: string,
  score: number,
  totalQuestions: number,
  stars: number,
  xpPerQuestion: number
): Promise<{ saved: boolean; xpAwarded: number; previousStars: number }> {
  const supabase = createClient();
  const totalXP = score * xpPerQuestion;

  // Check existing result
  const existing = await getQuizResult(userId, lessonId);

  if (!existing) {
    // First time — insert and award full XP
    const { error } = await supabase.from("quiz_results").insert({
      user_id: userId,
      lesson_id: lessonId,
      score,
      total_questions: totalQuestions,
      stars,
      xp_earned: totalXP,
    });

    if (error) {
      console.error("Error saving quiz result:", error);
      return { saved: false, xpAwarded: 0, previousStars: 0 };
    }

    // Award XP
    if (totalXP > 0) {
      await addPoints(userId, totalXP, "quiz_completion");
    }

    return { saved: true, xpAwarded: totalXP, previousStars: 0 };
  }

  // Already played before
  const previousStars = existing.stars;

  if (stars > previousStars) {
    // Beat previous record — award incremental XP
    const previousXP = existing.xp_earned;
    const incrementalXP = Math.max(0, totalXP - previousXP);

    const { error } = await supabase
      .from("quiz_results")
      .update({
        score,
        stars,
        xp_earned: totalXP,
        completed_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("lesson_id", lessonId);

    if (error) {
      console.error("Error updating quiz result:", error);
      return { saved: false, xpAwarded: 0, previousStars };
    }

    // Award only the difference
    if (incrementalXP > 0) {
      await addPoints(userId, incrementalXP, "quiz_completion");
    }

    return { saved: true, xpAwarded: incrementalXP, previousStars };
  }

  // Same or fewer stars — no update, no XP
  return { saved: true, xpAwarded: 0, previousStars };
}
