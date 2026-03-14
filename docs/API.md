# API — MAT Fácil

## Visão Geral

A aplicação utiliza Supabase como backend, acessado diretamente pelo cliente via `@supabase/supabase-js`. Não há API REST customizada — toda comunicação passa pela camada de serviços (`src/services/`).

## Serviços

### `services/auth.ts`

| Função | Descrição | Parâmetros |
|--------|-----------|------------|
| `signIn(data)` | Login com email/senha | `LoginFormData` |
| `signUp(data)` | Cadastro com nome, email, senha, série | `RegisterFormData` |
| `signOut()` | Logout | — |
| `resetPassword(email)` | Envia email de recuperação | `string` |
| `getCurrentProfile()` | Retorna perfil do usuário autenticado | — |
| `updateProfile(userId, updates)` | Atualiza nome, avatar, série | `string`, `Partial<Profile>` |

### `services/subjects.ts`

| Função | Descrição |
|--------|-----------|
| `getSubjects()` | Lista todas as matérias |
| `getSubjectById(id)` | Busca matéria por ID |
| `getTopicsBySubject(subjectId)` | Lista assuntos de uma matéria |
| `getTopicById(id)` | Busca assunto por ID |
| `getLessonsByTopic(topicId)` | Lista aulas de um assunto |
| `getLessonById(id)` | Busca aula por ID |
| `createSubject(data)` | Cria matéria (admin) |
| `updateSubject(id, data)` | Atualiza matéria (admin) |
| `deleteSubject(id)` | Exclui matéria (admin) |
| `createTopic(data)` | Cria assunto (admin) |
| `updateTopic(id, data)` | Atualiza assunto (admin) |
| `deleteTopic(id)` | Exclui assunto (admin) |
| `createLesson(data)` | Cria aula (admin) |
| `updateLesson(id, data)` | Atualiza aula (admin) |
| `deleteLesson(id)` | Exclui aula (admin) |

### `services/gamification.ts`

| Função | Descrição |
|--------|-----------|
| `completeLesson(userId, lessonId)` | Marca aula como concluída e ganha XP |
| `getUserProgress(userId)` | Retorna progresso do aluno |
| `getPointsHistory(userId)` | Retorna histórico de pontos |
| `getRanking(limit?)` | Retorna ranking de alunos |
| `checkLessonCompleted(userId, lessonId)` | Verifica se aula já foi concluída |

## Autenticação

Todas as requisições ao Supabase incluem automaticamente o token JWT do usuário logado. O Supabase aplica as políticas RLS (Row Level Security) para garantir que cada usuário só acesse seus próprios dados.

## Tipos de Resposta

```typescript
interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  success: boolean;
}
```
