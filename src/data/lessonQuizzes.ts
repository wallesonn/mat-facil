import type { Lesson } from "@/types";
import { AREA_QUIZ_QUESTIONS, type QuizQuestion } from "@/data/areaQuizQuestions";
import {
  MULTIPLICACAO_POLINOMIOS_QUESTIONS,
  SOMA_POLINOMIOS_QUESTIONS,
  SUBTRACAO_POLINOMIOS_QUESTIONS,
} from "@/data/polynomialQuizQuestions";

export type QuizKey =
  | "area-formas-irregulares"
  | "potenciacao-monomios"
  | "soma-polinomios"
  | "subtracao-polinomios"
  | "multiplicacao-polinomios";

export interface LessonQuizDefinition {
  title: string;
  description: string;
  questionBank: QuizQuestion[];
}

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function selectQuizQuestions(questionBank: QuizQuestion[]): QuizQuestion[] {
  const easy = questionBank.filter((q) => q.difficulty === "easy");
  const medium = questionBank.filter((q) => q.difficulty === "medium");
  const hard = questionBank.filter((q) => q.difficulty === "hard");

  const shuffle = <T,>(arr: T[]): T[] => {
    const items = [...arr];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  };

  return [
    ...shuffle(easy).slice(0, 2),
    ...shuffle(medium).slice(0, 2),
    ...shuffle(hard).slice(0, 1),
  ];
}

const POTENCIACAO_MONOMIOS_QUESTIONS: QuizQuestion[] = [
  // ═══════════════════════════════════════════════════════════
  // FÁCEIS (6) — 15 segundos
  // ═══════════════════════════════════════════════════════════
  {
    id: "e1",
    difficulty: "easy",
    type: "true_false",
    question: "(2x)^2 = 4x².",
    options: [
      { text: "Verdadeiro", correct: true },
      { text: "Falso", correct: false },
    ],
    explanation: "Ao elevar um monômio ao quadrado, elevamos o coeficiente e a variável: (2x)² = 2²x² = 4x².",
    timeLimit: 15,
  },
  {
    id: "e2",
    difficulty: "easy",
    type: "multiple_choice",
    question: "Qual é o resultado de (3a)¹?",
    options: [
      { text: "3", correct: false },
      { text: "a", correct: false },
      { text: "3a", correct: true },
      { text: "3a²", correct: false },
    ],
    explanation: "Qualquer monômio elevado à potência 1 permanece igual.",
    timeLimit: 15,
  },
  {
    id: "e3",
    difficulty: "easy",
    type: "multiple_choice",
    question: "Quanto vale (4m)²?",
    options: [
      { text: "8m²", correct: false },
      { text: "16m²", correct: true },
      { text: "4m²", correct: false },
      { text: "8m", correct: false },
    ],
    explanation: "(4m)² = 4² · m² = 16m².",
    timeLimit: 15,
  },
  {
    id: "e4",
    difficulty: "easy",
    type: "true_false",
    question: "5x⁰ = 5.",
    options: [
      { text: "Verdadeiro", correct: true },
      { text: "Falso", correct: false },
    ],
    explanation: "Todo número ou variável diferente de zero elevada a 0 vale 1; então 5x⁰ = 5·1 = 5.",
    timeLimit: 15,
  },
  {
    id: "e5",
    difficulty: "easy",
    type: "multiple_choice",
    question: "Qual é o resultado de (-2y)²?",
    options: [
      { text: "-4y²", correct: false },
      { text: "4y²", correct: true },
      { text: "-2y²", correct: false },
      { text: "2y²", correct: false },
    ],
    explanation: "O sinal negativo desaparece porque o expoente é par: (-2)² = 4.",
    timeLimit: 15,
  },
  {
    id: "e6",
    difficulty: "easy",
    type: "true_false",
    question: "(5p)² = 25p².",
    options: [
      { text: "Verdadeiro", correct: true },
      { text: "Falso", correct: false },
    ],
    explanation: "Elevamos o coeficiente e a variável ao quadrado: 5²p² = 25p².",
    timeLimit: 15,
  },

  // ═══════════════════════════════════════════════════════════
  // MÉDIAS (6) — 12 segundos
  // ═══════════════════════════════════════════════════════════
  {
    id: "m1",
    difficulty: "medium",
    type: "multiple_choice",
    question: "(2x³)² é igual a:",
    options: [
      { text: "4x⁶", correct: true },
      { text: "4x⁵", correct: false },
      { text: "2x⁶", correct: false },
      { text: "8x⁶", correct: false },
    ],
    explanation: "(2x³)² = 2² · (x³)² = 4x⁶.",
    timeLimit: 12,
  },
  {
    id: "m2",
    difficulty: "medium",
    type: "multiple_choice",
    question: "(3ab)² é igual a:",
    options: [
      { text: "6a²b²", correct: false },
      { text: "9ab²", correct: false },
      { text: "9a²b²", correct: true },
      { text: "3a²b²", correct: false },
    ],
    explanation: "(3ab)² = 3² · a² · b² = 9a²b².",
    timeLimit: 12,
  },
  {
    id: "m3",
    difficulty: "medium",
    type: "true_false",
    question: "(-x)³ = -x³.",
    options: [
      { text: "Verdadeiro", correct: true },
      { text: "Falso", correct: false },
    ],
    explanation: "Como o expoente é ímpar, o sinal negativo permanece.",
    timeLimit: 12,
  },
  {
    id: "m4",
    difficulty: "medium",
    type: "multiple_choice",
    question: "[(2a²)³] é igual a:",
    options: [
      { text: "6a⁶", correct: false },
      { text: "8a⁶", correct: true },
      { text: "8a⁵", correct: false },
      { text: "12a⁶", correct: false },
    ],
    explanation: "(2a²)³ = 2³ · a^(2·3) = 8a⁶.",
    timeLimit: 12,
  },
  {
    id: "m5",
    difficulty: "medium",
    type: "multiple_choice",
    question: "(5m²n)² é igual a:",
    options: [
      { text: "25m⁴n²", correct: true },
      { text: "10m⁴n²", correct: false },
      { text: "25m²n²", correct: false },
      { text: "5m⁴n²", correct: false },
    ],
    explanation: "(5m²n)² = 5² · (m²)² · n² = 25m⁴n².",
    timeLimit: 12,
  },
  {
    id: "m6",
    difficulty: "medium",
    type: "true_false",
    question: "(-3x²y)² = 9x⁴y².",
    options: [
      { text: "Verdadeiro", correct: true },
      { text: "Falso", correct: false },
    ],
    explanation: "O quadrado elimina o sinal negativo e dobra os expoentes das variáveis.",
    timeLimit: 12,
  },

  // ═══════════════════════════════════════════════════════════
  // DIFÍCEIS (3) — 10 segundos
  // ═══════════════════════════════════════════════════════════
  {
    id: "h1",
    difficulty: "hard",
    type: "multiple_choice",
    question: "(-2x²y)³ é igual a:",
    options: [
      { text: "-8x⁶y³", correct: true },
      { text: "8x⁶y³", correct: false },
      { text: "-6x⁵y³", correct: false },
      { text: "-8x⁵y²", correct: false },
    ],
    explanation: "Elevamos o coeficiente ao cubo e multiplicamos os expoentes: (-2)³ = -8, (x²)³ = x⁶ e y³ = y³.",
    timeLimit: 10,
  },
  {
    id: "h2",
    difficulty: "hard",
    type: "multiple_choice",
    question: "(3ab²)⁴ é igual a:",
    options: [
      { text: "81a⁴b⁸", correct: true },
      { text: "12a⁴b⁸", correct: false },
      { text: "81a⁴b⁶", correct: false },
      { text: "27a⁴b⁸", correct: false },
    ],
    explanation: "(3ab²)⁴ = 3⁴ · a⁴ · (b²)⁴ = 81a⁴b⁸.",
    timeLimit: 10,
  },
  {
    id: "h3",
    difficulty: "hard",
    type: "true_false",
    question: "(2x²y)³ = 8x⁶y³.",
    options: [
      { text: "Verdadeiro", correct: true },
      { text: "Falso", correct: false },
    ],
    explanation: "Sim. (2x²y)³ = 2³ · x⁶ · y³ = 8x⁶y³.",
    timeLimit: 10,
  },
];

export const LESSON_QUIZZES: Record<QuizKey, LessonQuizDefinition> = {
  "area-formas-irregulares": {
    title: "Quiz: Área com Quadrícula",
    description: "Responda 5 perguntas sobre cálculo de área usando o método da quadrícula. Cada resposta certa vale 2 XP!",
    questionBank: AREA_QUIZ_QUESTIONS,
  },
  "potenciacao-monomios": {
    title: "Quiz: Potenciação de Monômios",
    description: "Responda 5 perguntas sobre expoentes, sinais e regras de potenciação em monômios. Cada resposta certa vale 2 XP!",
    questionBank: POTENCIACAO_MONOMIOS_QUESTIONS,
  },
  "soma-polinomios": {
    title: "Quiz: Soma de Polinômios",
    description: "Responda 5 perguntas sobre soma de termos semelhantes. Cada resposta certa vale 2 XP!",
    questionBank: SOMA_POLINOMIOS_QUESTIONS,
  },
  "subtracao-polinomios": {
    title: "Quiz: Subtração de Polinômios",
    description: "Responda 5 perguntas sobre subtração e troca de sinais. Cada resposta certa vale 2 XP!",
    questionBank: SUBTRACAO_POLINOMIOS_QUESTIONS,
  },
  "multiplicacao-polinomios": {
    title: "Quiz: Multiplicação de Polinômios",
    description: "Responda 5 perguntas sobre distributiva e produtos de polinômios. Cada resposta certa vale 2 XP!",
    questionBank: MULTIPLICACAO_POLINOMIOS_QUESTIONS,
  },
};

export function getQuizKeyForLesson(lesson: Lesson): QuizKey | null {
  const title = normalizeText(lesson.title);
  const topicTitle = normalizeText(lesson.topic?.title ?? "");

  if (
    title.includes("quadricula") ||
    title.includes("malha") ||
    topicTitle.includes("area de formas irregulares")
  ) {
    return "area-formas-irregulares";
  }

  if (title.includes("potenciacao de monomios") || title.includes("monomios")) {
    return "potenciacao-monomios";
  }

  if (title.includes("soma de polinomios") || topicTitle.includes("soma de polinomios")) {
    return "soma-polinomios";
  }

  if (title.includes("subtracao de polinomios") || topicTitle.includes("subtracao de polinomios")) {
    return "subtracao-polinomios";
  }

  if (title.includes("multiplicacao de polinomios") || topicTitle.includes("multiplicacao de polinomios")) {
    return "multiplicacao-polinomios";
  }

  return null;
}

export function getQuizDefinitionForLesson(lesson: Lesson): LessonQuizDefinition | null {
  const key = getQuizKeyForLesson(lesson);
  if (!key) return null;
  return LESSON_QUIZZES[key];
}

export function shouldShowGridCanvasForLesson(lesson: Lesson): boolean {
  return getQuizKeyForLesson(lesson) === "area-formas-irregulares";
}

export function pickQuizQuestions(questionBank: QuizQuestion[]): QuizQuestion[] {
  return selectQuizQuestions(questionBank);
}
