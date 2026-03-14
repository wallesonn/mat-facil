# Gamificação — MAT Fácil

## Sistema de Níveis

A plataforma utiliza um sistema de 10 níveis baseado em XP acumulado.

| Nível | Label      | XP mínimo | Cor         |
|-------|------------|-----------|-------------|
| 1     | Iniciante  | 0         | gray-400    |
| 2     | Explorador | 100       | blue-400    |
| 3     | Aprendiz   | 250       | blue-500    |
| 4     | Estudante  | 500       | green-400   |
| 5     | Dedicado   | 800       | green-500   |
| 6     | Avançado   | 1200      | purple-400  |
| 7     | Expert     | 1700      | purple-500  |
| 8     | Mestre     | 2300      | yellow-400  |
| 9     | Gênio      | 3000      | yellow-500  |
| 10    | Lendário   | 4000      | orange-500  |

## Fontes de XP

| Evento | XP |
|--------|----|
| Concluir uma aula | +10 XP (configurável por aula via `xp_reward`) |
| Completar todos os assuntos de um tópico | +20 XP (bônus) |
| Completar todos os tópicos de uma matéria | +50 XP (bônus) |

## Fluxo de Conclusão de Aula

1. Aluno interage com o conteúdo da aula
2. Clica em "Concluir aula e ganhar XP"
3. `completeLesson()` é chamado:
   - Verifica se a aula já foi concluída (evita duplicatas)
   - Cria registro em `student_progress`
   - Adiciona pontos em `points_history`
   - Atualiza `profiles.points` e recalcula `profiles.level`
   - Verifica bônus de tópico/matéria completos
4. Toast de XP ganho aparece na tela
5. Se subiu de nível, modal de level up é exibido

## Barra de Progresso (XP)

O componente `XPProgressBar` exibe:
- Nível atual e próximo nível
- Barra de progresso com percentual
- Total de XP acumulado
- Label do nível (ex: "Aprendiz")

## Ranking

Disponível em `/ranking`, exibe os 50 melhores alunos ordenados por XP.

## Futuro

- 🔜 Badges e conquistas
- 🔜 Streak diário
- 🔜 Desafios semanais
