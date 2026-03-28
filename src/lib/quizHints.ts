import type { QuizQuestion } from "@/data/areaQuizQuestions";

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatHint(main: string, example: string): string {
  return `Dica: ${main} Exemplo parecido: ${example}`;
}

function areaHint(question: QuizQuestion): string {
  const isHard = question.difficulty === "hard";

  if (isHard) {
    return formatHint(
      "conte os quadrados inteiros primeiro, transforme os parciais em metades e só no fim converta para a unidade pedida.",
      "Se uma malha tiver 5 inteiros e 4 parciais, você soma 5 + 2 antes de passar para cm² quando o lado de cada quadrado for 3 cm."
    );
  }

  if (question.type === "true_false") {
    return formatHint(
      "verifique se os quadrados pintados fecham a mesma contagem que o enunciado afirma, lembrando que cada parcial vale meio.",
      "Se a figura tiver 6 inteiros e 2 parciais, a leitura correta é 7 quadradinhos ao todo."
    );
  }

  return formatHint(
    "some os quadrados inteiros com a metade dos quadrados parciais antes de comparar com as alternativas.",
    "Uma figura com 8 inteiros e 4 parciais vira 10 quadradinhos no total."
  );
}

function introHint(question: QuizQuestion): string {
  const text = normalizeText(question.question);

  if (text.includes("nao e um polinomio") || text.includes("não é um polinômio")) {
    return formatHint(
      "procure sinais de que a expressão quebra a regra do polinômio, como variável no denominador, expoente negativo ou raiz.",
      "Uma expressão como 3/x + 2 também não seria polinômio porque a letra aparece no denominador."
    );
  }

  if (text.includes("como se classifica") || text.includes("quantos termos")) {
    return formatHint(
      "separe a expressão pelos sinais de + e - para contar quantas parcelas ela tem.",
      "Em 2x³ - x + 4, você conta 3 termos: 2x³, -x e 4."
    );
  }

  if (text.includes("grau")) {
    return formatHint(
      "observe o maior expoente de cada termo e, se houver mais de uma letra, some os expoentes dentro do mesmo termo.",
      "No termo 4a²b, você soma 2 + 1 para achar o grau desse termo."
    );
  }

  if (text.includes("termo independente")) {
    return formatHint(
      "procure a parcela que não tem nenhuma letra.",
      "Em 5a² - 2a + 9, a parte sem variável é o termo independente."
    );
  }

  if (text.includes("como pode ser descrito") || text.includes("é um polinômio")) {
    return formatHint(
      "lembre que um polinômio é uma soma algébrica de termos com expoentes inteiros não negativos.",
      "Uma expressão como x² - 3x + 5 segue esse padrão porque usa soma de termos com expoentes válidos."
    );
  }

  return formatHint(
    "veja quantas parcelas aparecem e qual é a maior potência antes de marcar a resposta.",
    "Em 7x⁴ - 2x² + x - 9, conte as parcelas e compare os expoentes com calma."
  );
}

function termsCoefficientDegreeHint(question: QuizQuestion): string {
  const text = normalizeText(question.question);

  if (text.includes("coeficiente")) {
    return formatHint(
      "localize a parte literal e leia só o número que a acompanha.",
      "No termo -7m²n, o coeficiente é o número que vem antes da letra."
    );
  }

  if (text.includes("termo independente")) {
    return formatHint(
      "procure o termo que não carrega letras, porque ele é o que sobra sozinho na expressão.",
      "Em 6a² + 3a - 5, a parte sem variável é o termo independente."
    );
  }

  if (text.includes("grau") || text.includes("maior grau")) {
    return formatHint(
      "some os expoentes de cada termo e compare qual deles entrega o maior total.",
      "Em 5x³y², o grau vem de 3 + 2, porque os expoentes da mesma parcela se somam."
    );
  }

  if (text.includes("quantos termos")) {
    return formatHint(
      "conte as parcelas separadas por + e - sem juntar termos parecidos.",
      "Se a expressão for 7x³ - x² + 4x - 1, você encontra 4 termos distintos."
    );
  }

  return formatHint(
    "compare a parte literal com atenção e decida se a pergunta quer coeficiente, termo independente ou grau.",
    "Em 4x² - 3x + 8, é útil olhar primeiro se a pergunta está pedindo número, letra ou potência."
  );
}

function additionHint(question: QuizQuestion): string {
  const text = normalizeText(question.question);

  if (text.includes("p(x)") || text.includes("q(x)") || text.includes("r(x)")) {
    return formatHint(
      "junte primeiro os termos da mesma potência, depois os termos com a mesma letra e por fim as constantes.",
      "Exemplo parecido: (2x² + x - 1) + (x² - 3x + 4)."
    );
  }

  if (text.includes("-4a + 6a") || text.includes("3x + x") || text.includes("2a² + 3a²")) {
    return formatHint(
      "como a parte literal é igual, você só precisa somar os coeficientes.",
      "Exemplo parecido: -3a + 8a vira um único termo com a mesma letra."
    );
  }

  return formatHint(
    "procure termos semelhantes e faça a soma sem misturar letras diferentes.",
    "Exemplo parecido: 2x² + 5x² = 7x²."
  );
}

function subtractionHint(question: QuizQuestion): string {
  const text = normalizeText(question.question);

  if (text.includes("p(x)") || text.includes("q(x)") || text.includes("r(x)")) {
    return formatHint(
      "troque os sinais do segundo polinômio antes de reduzir os termos semelhantes.",
      "Exemplo parecido: (4x² + 3x) - (x² - 5x) vira somar o oposto do segundo grupo."
    );
  }

  return formatHint(
    "transforme a subtração em soma do oposto e só depois agrupe os termos iguais.",
    "Exemplo parecido: (5a + 3) - (2a + 1) fica com os sinais do segundo grupo invertidos."
  );
}

function multiplicationHint(question: QuizQuestion): string {
  const text = normalizeText(question.question);

  if (text.includes("soma pela diferenca") || text.includes("soma pela diferença")) {
    return formatHint(
      "reconheça a identidade da soma pela diferença, porque os termos do meio se cancelam.",
      "Exemplo parecido: (x + 3)(x - 3) sempre deixa apenas o quadrado da letra e o número ao final."
    );
  }

  if (text.includes("quadrado") || text.includes("²")) {
    return formatHint(
      "multiplique cada termo pelo outro e depois reúna os termos semelhantes que aparecerem.",
      "Exemplo parecido: (2x - 1)² pede distribuir o mesmo binômio duas vezes."
    );
  }

  return formatHint(
    "aplique a distributiva em todos os termos do primeiro parêntese sobre todos os do segundo.",
    "Exemplo parecido: (x + 2)(x + 1) vira x·x, x·1, 2·x e 2·1."
  );
}

function reviewHint(question: QuizQuestion): string {
  const text = normalizeText(question.question);

  if (text.includes("- (" ) || text.includes("subtra")) {
    return subtractionHint(question);
  }

  if (text.includes(")(" ) || text.includes("multiplica") || text.includes("produto")) {
    return multiplicationHint(question);
  }

  if (text.includes("+")) {
    return additionHint(question);
  }

  return formatHint(
    "identifique se a pergunta pede soma, subtração, multiplicação ou apenas leitura dos termos.",
    "Exemplo parecido: primeiro veja o tipo de operação; depois confira as parcelas semelhantes antes de marcar."
  );
}

export function getQuizHint(question: QuizQuestion): string {
  if (question.grid) {
    return areaHint(question);
  }

  if (question.id.startsWith("sp-")) {
    return additionHint(question);
  }

  if (question.id.startsWith("sb-")) {
    return subtractionHint(question);
  }

  if (question.id.startsWith("mp-")) {
    return multiplicationHint(question);
  }

  if (question.id.startsWith("ip-")) {
    return introHint(question);
  }

  if (question.id.startsWith("tcg-")) {
    return termsCoefficientDegreeHint(question);
  }

  if (question.id.startsWith("er-")) {
    return reviewHint(question);
  }

  return formatHint(
    "leia o enunciado com atenção e compare a estrutura da expressão com a operação pedida.",
    "Exemplo parecido: antes de responder, localize se você está contando termos, somando coeficientes ou aplicando distributiva."
  );
}
