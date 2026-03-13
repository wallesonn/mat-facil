// ============================================================
// TIPOS PRINCIPAIS DA PLATAFORMA MAT FÁCIL
// ============================================================

// ─── Usuário ────────────────────────────────────────────────
export type UserRole = "student" | "admin";

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  points: number;
  level: number;
  created_at: string;
}

// ─── Matérias ───────────────────────────────────────────────
export interface Subject {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  created_at: string;
}

// ─── Assuntos / Tópicos ─────────────────────────────────────
export type Difficulty = "easy" | "medium" | "hard";

export interface Topic {
  id: string;
  subject_id: string;
  title: string;
  description: string | null;
  difficulty: Difficulty;
  order: number;
  created_at: string;
  subject?: Subject;
}

// ─── Aulas ──────────────────────────────────────────────────
export type LessonStatus = "draft" | "published";

export interface Lesson {
  id: string;
  topic_id: string;
  title: string;
  content: LessonContent | null;
  status: LessonStatus;
  order: number;
  xp_reward: number;
  created_at: string;
  topic?: Topic;
}

// Estrutura JSON do conteúdo de uma aula (extensível futuramente)
export interface LessonContent {
  blocks: ContentBlock[];
}

export type ContentBlockType =
  | "text"
  | "math"
  | "image"
  | "video"
  | "exercise"
  | "step_by_step"
  | "quiz";

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  data: Record<string, unknown>;
}

// ─── Progresso do aluno ─────────────────────────────────────
export interface StudentProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  score: number | null;
  created_at: string;
  lesson?: Lesson;
}

// ─── Gamificação ────────────────────────────────────────────
export interface PointsHistory {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  lesson_id: string | null;
  created_at: string;
}

export interface LevelInfo {
  level: number;
  minPoints: number;
  maxPoints: number;
  label: string;
}

// ─── Formulários de autenticação ────────────────────────────
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ─── Respostas de API ───────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// ─── Painel do aluno ────────────────────────────────────────
export interface DashboardStats {
  profile: Profile;
  totalSubjects: number;
  completedLessons: number;
  totalLessons: number;
  recentProgress: StudentProgress[];
}

// ─── Admin ──────────────────────────────────────────────────
export interface CreateSubjectInput {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface CreateTopicInput {
  subject_id: string;
  title: string;
  description?: string;
  difficulty: Difficulty;
  order: number;
}

export interface CreateLessonInput {
  topic_id: string;
  title: string;
  content?: LessonContent;
  status: LessonStatus;
  order: number;
  xp_reward?: number;
}
