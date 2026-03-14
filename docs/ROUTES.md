# Rotas — MAT Fácil

## Rotas Públicas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/login` | Login |
| `/register` | Cadastro (com campo de série) |
| `/forgot-password` | Recuperação de senha |

## Rotas do Aluno (protegidas)

| Rota | Descrição |
|------|-----------|
| `/dashboard` | Painel do aluno (nível, XP, progresso) |
| `/subjects` | Lista de matérias |
| `/subjects/[id]` | Assuntos de uma matéria |
| `/subjects/[id]/topics/[topicId]` | Aulas de um assunto |
| `/subjects/[id]/topics/[topicId]/lessons/[lessonId]` | Página da aula |
| `/ranking` | Ranking de alunos |
| `/profile` | Edição de perfil (nome, série, senha) |

## Rotas Admin (protegidas, role=admin)

| Rota | Descrição |
|------|-----------|
| `/admin` | Visão geral do admin |
| `/admin/subjects` | CRUD de matérias |
| `/admin/topics` | CRUD de assuntos (com filtro por série) |
| `/admin/lessons` | CRUD de aulas |
| `/admin/students` | Lista de alunos (com filtro por série) |

## Proteção de Rotas

- **Middleware (`proxy.ts`)**: verifica sessão Supabase e redireciona para `/login` se não autenticado
- **Admin Layout**: verifica `profile.role === "admin"` e redireciona para `/dashboard` se não for admin
- **RLS (Row Level Security)**: camada adicional no Supabase que impede acesso a dados de outros usuários
