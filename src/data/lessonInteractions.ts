import type { Lesson } from "@/types";

export type LessonInteractiveKey =
  | "potenciacao-monomios"
  | "soma-polinomios"
  | "subtracao-polinomios"
  | "multiplicacao-polinomios";

export interface LessonInteractiveDefinition {
  key: LessonInteractiveKey;
  title: string;
  description: string;
}

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const INTERACTIVE_CANVASES: Record<LessonInteractiveKey, Omit<LessonInteractiveDefinition, "key">> = {
  "potenciacao-monomios": {
    title: "Canvas interativo: Potenciação de monômios",
    description: "Ajuste coeficiente, expoentes e potência para ver como a regra se aplica em tempo real.",
  },
  "soma-polinomios": {
    title: "Canvas interativo: Soma de polinômios",
    description: "Alinhe os termos semelhantes e observe a soma dos coeficientes acontecendo ao vivo.",
  },
  "subtracao-polinomios": {
    title: "Canvas interativo: Subtração de polinômios",
    description: "Veja o segundo polinômio trocando de sinal antes da redução dos termos semelhantes.",
  },
  "multiplicacao-polinomios": {
    title: "Canvas interativo: Multiplicação de polinômios",
    description: "Observe a distributiva em ação com um quadro 2x2 de produtos parciais.",
  },
};

export function getInteractiveKeyForLesson(lesson: Lesson): LessonInteractiveKey | null {
  const title = normalizeText(lesson.title);
  const topicTitle = normalizeText(lesson.topic?.title ?? "");

  if (title.includes("potenciacao de monomios") || topicTitle.includes("potenciacao de monomios")) {
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

export function getInteractiveDefinitionForLesson(lesson: Lesson): LessonInteractiveDefinition | null {
  const key = getInteractiveKeyForLesson(lesson);
  if (!key) return null;
  return { key, ...INTERACTIVE_CANVASES[key] };
}

export function shouldShowInteractiveCanvasForLesson(lesson: Lesson): boolean {
  return getInteractiveKeyForLesson(lesson) !== null;
}
