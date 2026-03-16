// ============================================================
// BANCO DE PERGUNTAS — Quiz de Área com Quadrícula
// 15 perguntas: 6 fáceis, 6 médias, 3 difíceis
// ============================================================

export interface QuizQuestion {
  id: string;
  difficulty: "easy" | "medium" | "hard";
  type: "true_false" | "multiple_choice";
  question: string;
  /** Grid visual: rows x cols, filled = verdes, partial = amarelos (meio quadrado) */
  grid?: {
    rows: number;
    cols: number;
    filled: [number, number][];
    partial?: [number, number][];
  };
  options: { text: string; correct: boolean }[];
  explanation: string;
  timeLimit: number;
}

export const AREA_QUIZ_QUESTIONS: QuizQuestion[] = [
  // ═══════════════════════════════════════════════════════════
  // FÁCEIS (6) — 15 segundos
  // ═══════════════════════════════════════════════════════════
  {
    id: "e1",
    difficulty: "easy",
    type: "true_false",
    question: "A área desta figura é 4 quadradinhos?",
    grid: {
      rows: 3, cols: 3,
      filled: [[0,0],[0,1],[1,0],[1,1]],
    },
    options: [
      { text: "Verdadeiro", correct: true },
      { text: "Falso", correct: false },
    ],
    explanation: "A figura tem exatamente 4 quadradinhos pintados, então a área é 4.",
    timeLimit: 15,
  },
  {
    id: "e2",
    difficulty: "easy",
    type: "true_false",
    question: "A área desta figura é 5 quadradinhos?",
    grid: {
      rows: 3, cols: 4,
      filled: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2]],
    },
    options: [
      { text: "Verdadeiro", correct: false },
      { text: "Falso", correct: true },
    ],
    explanation: "A figura tem 6 quadradinhos pintados, não 5!",
    timeLimit: 15,
  },
  {
    id: "e3",
    difficulty: "easy",
    type: "multiple_choice",
    question: "Qual é a área aproximada da figura pintada?",
    grid: {
      rows: 3, cols: 4,
      filled: [[0,1],[1,0],[1,1],[1,2]],
      partial: [[0,0],[0,2]],
    },
    options: [
      { text: "3 quadradinhos", correct: false },
      { text: "4 quadradinhos", correct: false },
      { text: "5 quadradinhos", correct: true },
      { text: "6 quadradinhos", correct: false },
    ],
    explanation: "4 inteiros (verdes) + 2 parciais (amarelos)/2 = 4 + 1 = 5 quadradinhos.",
    timeLimit: 15,
  },
  {
    id: "e4",
    difficulty: "easy",
    type: "true_false",
    question: "A área desta figura é aproximadamente 4 quadradinhos?",
    grid: {
      rows: 3, cols: 4,
      filled: [[1,1],[1,2]],
      partial: [[0,1],[0,2],[2,1],[2,2]],
    },
    options: [
      { text: "Verdadeiro", correct: true },
      { text: "Falso", correct: false },
    ],
    explanation: "2 inteiros (verdes) + 4 parciais (amarelos)/2 = 2 + 2 = 4 quadradinhos.",
    timeLimit: 15,
  },
  {
    id: "e5",
    difficulty: "easy",
    type: "multiple_choice",
    question: "Qual é a área aproximada desta figura?",
    grid: {
      rows: 4, cols: 4,
      filled: [[1,1],[1,2],[2,1],[2,2]],
      partial: [[0,2],[1,3],[3,1]],
    },
    options: [
      { text: "4 quadradinhos", correct: false },
      { text: "5 quadradinhos", correct: false },
      { text: "5,5 quadradinhos", correct: true },
      { text: "6 quadradinhos", correct: false },
    ],
    explanation: "4 inteiros (verdes) + 3 parciais (amarelos)/2 = 4 + 1,5 = 5,5 quadradinhos.",
    timeLimit: 15,
  },
  {
    id: "e6",
    difficulty: "easy",
    type: "multiple_choice",
    question: "Qual a área da parte pintada?",
    grid: {
      rows: 4, cols: 4,
      filled: [[1,1],[1,2],[2,1],[2,2]],
    },
    options: [
      { text: "2 quadradinhos", correct: false },
      { text: "3 quadradinhos", correct: false },
      { text: "4 quadradinhos", correct: true },
      { text: "6 quadradinhos", correct: false },
    ],
    explanation: "São 4 quadradinhos pintados no centro da malha, formando um quadrado 2×2.",
    timeLimit: 15,
  },

  // ═══════════════════════════════════════════════════════════
  // MÉDIAS (6) — 12 segundos
  // ═══════════════════════════════════════════════════════════
  {
    id: "m1",
    difficulty: "medium",
    type: "multiple_choice",
    question: "Uma figura tem 4 quadrados inteiros e 2 meios quadrados dentro dela. Qual a área aproximada?",
    options: [
      { text: "4 quadradinhos", correct: false },
      { text: "5 quadradinhos", correct: true },
      { text: "6 quadradinhos", correct: false },
      { text: "7 quadradinhos", correct: false },
    ],
    explanation: "Área ≈ inteiros + parciais/2 = 4 + 2/2 = 5 quadradinhos.",
    timeLimit: 12,
  },
  {
    id: "m2",
    difficulty: "medium",
    type: "true_false",
    question: "No método da quadrícula, a fórmula é: Área ≈ inteiros + parciais/2.",
    options: [
      { text: "Verdadeiro", correct: true },
      { text: "Falso", correct: false },
    ],
    explanation: "Correto! Quadrados inteiros contam 1 e parciais contam metade (÷2) cada.",
    timeLimit: 12,
  },
  {
    id: "m3",
    difficulty: "medium",
    type: "multiple_choice",
    question: "Qual é a área desta figura irregular?",
    grid: {
      rows: 4, cols: 5,
      filled: [[0,1],[0,2],[1,0],[1,1],[1,2],[1,3],[2,1],[2,2]],
      partial: [[0,0],[0,3],[2,0],[2,3]],
    },
    options: [
      { text: "8 quadradinhos", correct: false },
      { text: "10 quadradinhos", correct: true },
      { text: "12 quadradinhos", correct: false },
      { text: "9 quadradinhos", correct: false },
    ],
    explanation: "8 inteiros (verdes) + 4 parciais (amarelos)/2 = 8 + 2 = 10.",
    timeLimit: 12,
  },
  {
    id: "m4",
    difficulty: "medium",
    type: "multiple_choice",
    question: "Cada quadradinho tem lado de 2 cm. Uma figura ocupa 6 quadradinhos inteiros. Qual a área real?",
    options: [
      { text: "12 cm²", correct: false },
      { text: "6 cm²", correct: false },
      { text: "24 cm²", correct: true },
      { text: "8 cm²", correct: false },
    ],
    explanation: "Cada quadrado = 2×2 = 4 cm². Total = 6 × 4 = 24 cm².",
    timeLimit: 12,
  },
  {
    id: "m5",
    difficulty: "medium",
    type: "true_false",
    question: "Esta figura tem área ≈ 5 quadradinhos.",
    grid: {
      rows: 4, cols: 4,
      filled: [[1,1],[1,2],[2,1]],
      partial: [[0,1],[0,2],[2,2],[3,1]],
    },
    options: [
      { text: "Verdadeiro", correct: true },
      { text: "Falso", correct: false },
    ],
    explanation: "3 inteiros + 4 parciais/2 = 3 + 2 = 5 quadradinhos.",
    timeLimit: 12,
  },
  {
    id: "m6",
    difficulty: "medium",
    type: "multiple_choice",
    question: "Malha com quadrados de 1 cm de lado. Figura com 10 inteiros e 6 parciais. Área ≈ ?",
    options: [
      { text: "10 cm²", correct: false },
      { text: "16 cm²", correct: false },
      { text: "13 cm²", correct: true },
      { text: "8 cm²", correct: false },
    ],
    explanation: "10 + 6/2 = 13 quadrados × 1 cm² = 13 cm².",
    timeLimit: 12,
  },

  // ═══════════════════════════════════════════════════════════
  // DIFÍCEIS (3) — 10 segundos
  // ═══════════════════════════════════════════════════════════
  {
    id: "h1",
    difficulty: "hard",
    type: "multiple_choice",
    question: "Cada quadrado tem lado de 3 cm. Figura com 5 inteiros e 4 parciais. Área ≈ ?",
    options: [
      { text: "45 cm²", correct: false },
      { text: "54 cm²", correct: false },
      { text: "63 cm²", correct: true },
      { text: "72 cm²", correct: false },
    ],
    explanation: "5 + 4/2 = 7 quadrados. Cada = 3×3 = 9 cm². Total = 7 × 9 = 63 cm².",
    timeLimit: 10,
  },
  {
    id: "h2",
    difficulty: "hard",
    type: "multiple_choice",
    question: "Qual a área desta figura complexa?",
    grid: {
      rows: 5, cols: 6,
      filled: [[0,2],[0,3],[1,1],[1,2],[1,3],[1,4],[2,1],[2,2],[2,3],[3,2],[3,3]],
    },
    options: [
      { text: "9 quadradinhos", correct: false },
      { text: "10 quadradinhos", correct: false },
      { text: "11 quadradinhos", correct: true },
      { text: "12 quadradinhos", correct: false },
    ],
    explanation: "Contando cuidadosamente: são 11 quadradinhos pintados nesta forma de seta.",
    timeLimit: 10,
  },
  {
    id: "h3",
    difficulty: "hard",
    type: "true_false",
    question: "Quadrados de 0,5 cm de lado. 20 inteiros + 8 parciais. A área é 6 cm².",
    options: [
      { text: "Verdadeiro", correct: true },
      { text: "Falso", correct: false },
    ],
    explanation: "20 + 8/2 = 24 quadrados. Cada = 0,5 × 0,5 = 0,25 cm². Total = 24 × 0,25 = 6 cm².",
    timeLimit: 10,
  },
];

/**
 * Sorteia 5 perguntas: 2 fáceis, 2 médias, 1 difícil.
 */
export function pickQuizQuestions(): QuizQuestion[] {
  const easy = AREA_QUIZ_QUESTIONS.filter((q) => q.difficulty === "easy");
  const medium = AREA_QUIZ_QUESTIONS.filter((q) => q.difficulty === "medium");
  const hard = AREA_QUIZ_QUESTIONS.filter((q) => q.difficulty === "hard");

  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  return [
    ...shuffle(easy).slice(0, 2),
    ...shuffle(medium).slice(0, 2),
    ...shuffle(hard).slice(0, 1),
  ];
}
