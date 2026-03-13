// ============================================================
// CONSTANTES GLOBAIS DA PLATAFORMA MAT FÁCIL
// ============================================================

// ─── Gamificação — tabela de níveis ─────────────────────────
export const LEVELS = [
  { level: 1, minPoints: 0,    maxPoints: 99,   label: "Iniciante" },
  { level: 2, minPoints: 100,  maxPoints: 249,  label: "Explorador" },
  { level: 3, minPoints: 250,  maxPoints: 499,  label: "Aprendiz" },
  { level: 4, minPoints: 500,  maxPoints: 799,  label: "Estudante" },
  { level: 5, minPoints: 800,  maxPoints: 1199, label: "Dedicado" },
  { level: 6, minPoints: 1200, maxPoints: 1699, label: "Avançado" },
  { level: 7, minPoints: 1700, maxPoints: 2299, label: "Expert" },
  { level: 8, minPoints: 2300, maxPoints: 2999, label: "Mestre" },
  { level: 9, minPoints: 3000, maxPoints: 3999, label: "Gênio" },
  { level: 10, minPoints: 4000, maxPoints: Infinity, label: "Lendário" },
] as const;

// ─── Pontuação de eventos ────────────────────────────────────
export const POINTS = {
  COMPLETE_LESSON: 10,
  COMPLETE_TOPIC: 20,
  COMPLETE_SUBJECT: 50,
} as const;

// ─── Razões de pontuação (salvo no points_history) ──────────
export const POINT_REASONS = {
  COMPLETE_LESSON: "Aula concluída",
  COMPLETE_TOPIC: "Assunto concluído (bônus)",
  COMPLETE_SUBJECT: "Matéria concluída (bônus)",
} as const;

// ─── Cores por dificuldade ────────────────────────────────────
export const DIFFICULTY_CONFIG = {
  easy:   { label: "Fácil",  color: "bg-green-500/10 text-green-400 border-green-500/20" },
  medium: { label: "Médio",  color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  hard:   { label: "Difícil", color: "bg-red-500/10 text-red-400 border-red-500/20" },
} as const;

// ─── Status de aula ───────────────────────────────────────────
export const LESSON_STATUS_CONFIG = {
  draft:     { label: "Rascunho",   color: "bg-muted text-muted-foreground" },
  published: { label: "Publicada",  color: "bg-green-500/10 text-green-400" },
} as const;

// ─── Paleta da plataforma ─────────────────────────────────────
export const BRAND_COLORS = {
  blue:   "#2563EB",
  purple: "#7C3AED",
  yellow: "#FACC15",
  green:  "#22C55E",
  orange: "#F97316",
  pink:   "#EC4899",
} as const;

// Cores aleatórias para cards de matérias
export const SUBJECT_COLOR_PALETTE = [
  { bg: "from-blue-500 to-blue-600",   icon: "bg-blue-500/10   text-blue-400"   },
  { bg: "from-purple-500 to-purple-600", icon: "bg-purple-500/10 text-purple-400" },
  { bg: "from-green-500 to-green-600",  icon: "bg-green-500/10  text-green-400"  },
  { bg: "from-orange-500 to-orange-600", icon: "bg-orange-500/10 text-orange-400" },
  { bg: "from-pink-500 to-pink-600",    icon: "bg-pink-500/10   text-pink-400"   },
  { bg: "from-indigo-500 to-indigo-600", icon: "bg-indigo-500/10 text-indigo-400" },
] as const;

// ─── Meta da aplicação ────────────────────────────────────────
export const APP_META = {
  name: "MAT Fácil",
  description: "Plataforma de aprendizado de matemática para alunos do SESI",
  version: "1.0.0",
} as const;
