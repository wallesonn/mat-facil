// ============================================================
// SERVIÇO DE GAMIFICAÇÃO — pontos, níveis e progresso
// ============================================================

import { createClient } from "@/lib/supabase/client";
import { LEVELS, POINTS, POINT_REASONS } from "@/lib/constants";
import type { LevelInfo, PointsHistory } from "@/types";

/**
 * Calcula o nível correspondente a uma quantidade de pontos.
 */
export function calculateLevel(points: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) {
      return { ...LEVELS[i], maxPoints: LEVELS[i].maxPoints as number };
    }
  }
  return { ...LEVELS[0], maxPoints: LEVELS[0].maxPoints as number };
}

/**
 * Retorna a porcentagem de progresso para o próximo nível (0–100).
 */
export function getLevelProgress(points: number): number {
  const current = calculateLevel(points);
  if (current.level === 10) return 100;

  const pointsInLevel = points - current.minPoints;
  const levelRange = current.maxPoints - current.minPoints;
  return Math.min(100, Math.round((pointsInLevel / levelRange) * 100));
}

/**
 * Retorna quantos pontos faltam para o próximo nível.
 */
export function pointsToNextLevel(points: number): number {
  const current = calculateLevel(points);
  if (current.level === 10) return 0;
  return current.maxPoints - points + 1;
}

/**
 * Adiciona pontos a um usuário, registra no histórico e atualiza o nível.
 */
export async function addPoints(
  userId: string,
  amount: number,
  reason: string
): Promise<{ success: boolean; newPoints: number; newLevel: number; leveledUp: boolean }> {
  const supabase = createClient();

  // Busca o perfil atual
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("points, level")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    console.error("Erro ao buscar perfil:", profileError);
    return { success: false, newPoints: 0, newLevel: 0, leveledUp: false };
  }

  const newPoints = profile.points + amount;
  const oldLevel = profile.level;
  const newLevel = calculateLevel(newPoints).level;
  const leveledUp = newLevel > oldLevel;

  // Registra no histórico de pontos
  await supabase.from("points_history").insert({
    user_id: userId,
    points: amount,
    reason,
  });

  // Atualiza pontos e nível no perfil
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ points: newPoints, level: newLevel })
    .eq("id", userId);

  if (updateError) {
    console.error("Erro ao atualizar pontos:", updateError);
    return { success: false, newPoints: 0, newLevel: 0, leveledUp: false };
  }

  return { success: true, newPoints, newLevel, leveledUp };
}

/**
 * Atualiza apenas o nível do usuário baseado nos pontos atuais.
 */
export async function updateUserLevel(userId: string): Promise<void> {
  const supabase = createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("points")
    .eq("id", userId)
    .single();

  if (!profile) return;

  const newLevel = calculateLevel(profile.points).level;

  await supabase
    .from("profiles")
    .update({ level: newLevel })
    .eq("id", userId);
}

/**
 * Busca o histórico de pontos de um usuário.
 */
export async function getPointsHistory(
  userId: string,
  limit = 10
): Promise<PointsHistory[]> {
  const supabase = createClient();

  const { data } = await supabase
    .from("points_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

/**
 * Marca uma aula como concluída e adiciona os pontos correspondentes.
 * Verifica se todas as aulas de um tópico foram concluídas para dar bônus.
 */
export async function completeLesson(
  userId: string,
  lessonId: string,
  topicId: string
): Promise<{ success: boolean; leveledUp: boolean; bonusEarned: boolean }> {
  const supabase = createClient();

  // Verifica se a aula já foi concluída antes de dar XP (idempotência)
  const { data: existing } = await supabase
    .from("student_progress")
    .select("completed")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  const wasAlreadyCompleted = existing?.completed === true;

  // Registra ou atualiza o progresso
  await supabase
    .from("student_progress")
    .upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" }
    );

  // Só adiciona pontos se a aula não havia sido concluída antes
  if (wasAlreadyCompleted) {
    return { success: true, leveledUp: false, bonusEarned: false };
  }

  const result = await addPoints(userId, POINTS.COMPLETE_LESSON, POINT_REASONS.COMPLETE_LESSON);

  // Verifica se todas as aulas do tópico foram concluídas para bônus
  const { data: allLessons } = await supabase
    .from("lessons")
    .select("id")
    .eq("topic_id", topicId)
    .eq("status", "published");

  const { data: completedLessons } = await supabase
    .from("student_progress")
    .select("lesson_id")
    .eq("user_id", userId)
    .eq("completed", true)
    .in("lesson_id", (allLessons ?? []).map((l) => l.id));

  const allCompleted =
    allLessons &&
    completedLessons &&
    allLessons.length > 0 &&
    allLessons.length === completedLessons.length;

  let bonusEarned = false;
  if (allCompleted) {
    await addPoints(userId, POINTS.COMPLETE_TOPIC, POINT_REASONS.COMPLETE_TOPIC);
    bonusEarned = true;
  }

  return { success: result.success, leveledUp: result.leveledUp, bonusEarned };
}
