// ============================================================
// SERVIÇO DE MATÉRIAS E TÓPICOS
// ============================================================

import { createClient } from "@/lib/supabase/client";
import type { Subject, Topic, Lesson, ApiResponse, CreateSubjectInput, CreateTopicInput, CreateLessonInput } from "@/types";

// ─── Matérias ────────────────────────────────────────────────

export async function getSubjects(): Promise<Subject[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("subjects")
    .select("*")
    .order("name");
  return data ?? [];
}

export async function getSubjectById(id: string): Promise<Subject | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("subjects")
    .select("*")
    .eq("id", id)
    .single();
  return data ?? null;
}

export async function createSubject(input: CreateSubjectInput): Promise<ApiResponse<Subject>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("subjects")
    .insert(input)
    .select()
    .single();
  if (error) return { data: null, error: error.message, success: false };
  return { data, error: null, success: true };
}

export async function updateSubject(id: string, input: Partial<CreateSubjectInput>): Promise<ApiResponse<Subject>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("subjects")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) return { data: null, error: error.message, success: false };
  return { data, error: null, success: true };
}

export async function deleteSubject(id: string): Promise<ApiResponse<null>> {
  const supabase = createClient();
  const { error } = await supabase.from("subjects").delete().eq("id", id);
  if (error) return { data: null, error: error.message, success: false };
  return { data: null, error: null, success: true };
}

// ─── Tópicos ─────────────────────────────────────────────────

export async function getTopicsBySubject(subjectId: string): Promise<Topic[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("topics")
    .select("*")
    .eq("subject_id", subjectId)
    .order("order");
  return data ?? [];
}

export async function getTopicCountBySubject(subjectId: string): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("topics")
    .select("id", { count: "exact", head: true })
    .eq("subject_id", subjectId);

  if (error) return 0;
  return count ?? 0;
}

export async function getTopicById(id: string): Promise<Topic | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("topics")
    .select("*, subject:subjects(*)")
    .eq("id", id)
    .single();
  return data ?? null;
}

export async function createTopic(input: CreateTopicInput): Promise<ApiResponse<Topic>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("topics")
    .insert(input)
    .select()
    .single();
  if (error) return { data: null, error: error.message, success: false };
  return { data, error: null, success: true };
}

export async function updateTopic(id: string, input: Partial<CreateTopicInput>): Promise<ApiResponse<Topic>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("topics")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) return { data: null, error: error.message, success: false };
  return { data, error: null, success: true };
}

export async function deleteTopic(id: string): Promise<ApiResponse<null>> {
  const supabase = createClient();
  const { error } = await supabase.from("topics").delete().eq("id", id);
  if (error) return { data: null, error: error.message, success: false };
  return { data: null, error: null, success: true };
}

// ─── Aulas ───────────────────────────────────────────────────

export async function getLessonsByTopic(topicId: string, publishedOnly = true): Promise<Lesson[]> {
  const supabase = createClient();
  let query = supabase
    .from("lessons")
    .select("*")
    .eq("topic_id", topicId)
    .order("order");

  if (publishedOnly) {
    query = query.eq("status", "published");
  }

  const { data } = await query;
  return data ?? [];
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("lessons")
    .select("*, topic:topics(*, subject:subjects(*))")
    .eq("id", id)
    .single();
  return data ?? null;
}

export async function createLesson(input: CreateLessonInput): Promise<ApiResponse<Lesson>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lessons")
    .insert(input)
    .select()
    .single();
  if (error) return { data: null, error: error.message, success: false };
  return { data, error: null, success: true };
}

export async function updateLesson(id: string, input: Partial<CreateLessonInput>): Promise<ApiResponse<Lesson>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lessons")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) return { data: null, error: error.message, success: false };
  return { data, error: null, success: true };
}

export async function deleteLesson(id: string): Promise<ApiResponse<null>> {
  const supabase = createClient();
  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) return { data: null, error: error.message, success: false };
  return { data: null, error: null, success: true };
}

export async function publishLesson(id: string): Promise<ApiResponse<Lesson>> {
  return updateLesson(id, { status: "published" });
}

// ─── Progresso do aluno ───────────────────────────────────────

export async function getStudentProgress(userId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("student_progress")
    .select("*, lesson:lessons(*, topic:topics(*, subject:subjects(*)))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getLessonProgress(userId: string, lessonId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("student_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();
  return data ?? null;
}
