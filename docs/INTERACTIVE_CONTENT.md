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
