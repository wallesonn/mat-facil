// ============================================================
// SERVIÇO DE QUIZ — salvar/buscar resultados e XP incremental
// ============================================================

import { createClient } from "@/lib/supabase/client";
import { addPoints } from "@/services/gamification";

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
  const { data, error } = await supabase
    .from("quiz_results")
    .select("*")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .single();

  if (error || !data) return null;
  return data as QuizResult;
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
