# Conteúdo Interativo — MAT Fácil

## Visão Geral

A plataforma suporta conteúdo interativo dentro das aulas. Os componentes interativos ficam em `src/components/interactive/`.

## Componentes Disponíveis

### GridAreaCanvas

**Arquivo**: `src/components/interactive/GridAreaCanvas.tsx`

Componente para cálculo de área de formas irregulares usando o método da quadrícula.

#### Funcionalidades
- Desenho livre com mouse ou toque (mobile)
- Fechamento automático da forma (conecta último ponto ao primeiro)
- Slider para ajustar quantidade de quadrículas (3×3 até 30×30)
- Campo para definir o tamanho do lado do quadrinho (número decimal)
- Seletor de unidade: mm, cm, m
- Classificação visual dos quadrados:
  - **Verde**: totalmente dentro da forma
  - **Amarelo**: parcialmente dentro da forma
- Cálculo da área real na unidade selecionada (mm², cm², m²)
- Fórmula: `Área ≈ (inteiros + parciais × 0,5) × lado²`
- Dica educativa exibida automaticamente
- Totalmente responsivo para celulares

#### Uso na Aula

O componente é renderizado automaticamente na página da aula quando o conteúdo inclui interatividade:

```tsx
import GridAreaCanvas from "@/components/interactive/GridAreaCanvas";

<GridAreaCanvas />
```

#### Algoritmos Utilizados

- **Ray-casting**: determina se um ponto está dentro do polígono
- **Segment intersection**: detecta se uma aresta do polígono cruza um quadrado da malha
- **Classificação de células**: inside (todos os cantos dentro), partial (intersecção com aresta), outside

## Tipos de Blocos de Conteúdo

As aulas suportam blocos de conteúdo estruturado via JSON:

| Tipo | Descrição |
|------|-----------|
| `text` | Texto explicativo |
| `math` | Fórmula matemática (KaTeX) |
| `image` | Imagem ilustrativa |
| `video` | Vídeo incorporado |
| `exercise` | Exercício com resposta |
| `step_by_step` | Explicação passo a passo |
| `quiz` | Quiz com alternativas |

## Regras para Criação de Quizzes das Aulas

Os quizzes das aulas seguem um padrão pedagógico e de consistência visual:

- **Banco por aula**
  - Cada aula com quiz deve ter seu próprio banco de perguntas
  - As perguntas precisam ficar alinhadas ao conteúdo específico da aula

- **Estrutura mínima do banco**
  - 2 perguntas fáceis
  - 2 perguntas médias
  - 1 pergunta difícil
  - Total mínimo recomendado: 5 perguntas por aula

- **Seleção da sessão**
  - A cada tentativa, o sistema monta um quiz com 5 perguntas
  - Distribuição fixa: 2 fáceis + 2 médias + 1 difícil

- **Pontuação e tempo**
  - Cada acerto vale 2 XP
  - Perguntas fáceis: 15s
  - Perguntas médias: 12s
  - Perguntas difíceis: 10s

- **Campos obrigatórios em cada pergunta**
  - `id`
  - `difficulty`
  - `type`
  - `question`
  - `options`
  - `explanation`
  - `timeLimit`

- **Qualidade pedagógica**
  - Enunciado curto e direto
  - Apenas uma resposta correta
  - Distratores plausíveis
  - Explicação curta mostrando o raciocínio correto

## Bancos de Quiz por Aula

Os bancos atuais cobrem as aulas de:

- `Potenciação de monômios`
- `Introdução aos polinômios`
- `Termos, coeficientes e grau`
- `Exercícios e revisão`
- `Soma de polinômios`
- `Subtração de polinômios`
- `Multiplicação de polinômios`

Cada banco é registrado em `src/data/polynomialQuizQuestions.ts` e ligado ao registry central em `src/data/lessonQuizzes.ts`.

## Criando Novos Componentes Interativos

1. Crie o componente em `src/components/interactive/`
2. Use `"use client"` no topo
3. Garanta responsividade (use `width: 100%` e breakpoints `sm:`)
4. Integre na página da aula em `src/app/(dashboard)/subjects/[id]/topics/[topicId]/lessons/[lessonId]/page.tsx`

## Futuro

- 🔜 Gráfico interativo de funções
- 🔜 Calculadora de frações visual
- 🔜 Geometria interativa (ângulos, triângulos)
- 🔜 Quiz interativo com feedback imediato
