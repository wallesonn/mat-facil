# Banco de Dados — MAT Fácil

## Provedor

Supabase (PostgreSQL gerenciado)

- **Project ID**: `yjvtmrolmjfuslruqanm`
- **Region**: (configurada no Supabase Dashboard)

## Tabelas

### `profiles`
Perfil do usuário, criado automaticamente ao registrar via Auth.

| Coluna       | Tipo      | Default    | Descrição                          |
|--------------|-----------|------------|------------------------------------|
| id           | uuid (PK) | auth.uid() | ID do usuário (FK para auth.users) |
| name         | text      | —          | Nome completo                      |
| email        | text      | —          | Email                              |
| role         | text      | 'student'  | 'student' ou 'admin'               |
| avatar_url   | text      | null       | URL do avatar                      |
| grade        | text      | null       | Série do aluno (ex: 6º ano)        |
| points       | integer   | 0          | XP acumulado                       |
| level        | integer   | 1          | Nível atual (1-10)                 |
| created_at   | timestamp | now()      | Data de criação                    |

### `subjects`
Matérias (ex: Matemática, Geometria).

| Coluna      | Tipo      | Default | Descrição        |
|-------------|-----------|---------|------------------|
| id          | uuid (PK) | gen()   | ID               |
| name        | text      | —       | Nome da matéria  |
| description | text      | null    | Descrição        |
| icon        | text      | null    | Nome do ícone    |
| color       | text      | null    | Cor (hex/class)  |
| created_at  | timestamp | now()   | Data de criação  |

### `topics`
Assuntos dentro de uma matéria, agora com série associada.

| Coluna      | Tipo      | Default | Descrição                  |
|-------------|-----------|---------|----------------------------|
| id          | uuid (PK) | gen()   | ID                         |
| subject_id  | uuid (FK) | —       | FK para subjects           |
| title       | text      | —       | Título do assunto          |
| description | text      | null    | Descrição                  |
| difficulty  | text      | 'easy'  | 'easy', 'medium', 'hard'   |
| grade       | text      | null    | Série (ex: 9º ano)         |
| order       | integer   | —       | Ordem de exibição          |
| created_at  | timestamp | now()   | Data de criação            |

### `lessons`
Aulas dentro de um assunto.

| Coluna    | Tipo      | Default   | Descrição                    |
|-----------|-----------|-----------|------------------------------|
| id        | uuid (PK) | gen()     | ID                           |
| topic_id  | uuid (FK) | —         | FK para topics               |
| title     | text      | —         | Título da aula               |
| content   | jsonb     | null      | Conteúdo estruturado (blocos)|
| status    | text      | 'draft'   | 'draft' ou 'published'       |
| order     | integer   | —         | Ordem de exibição            |
| xp_reward | integer   | 10        | XP ao completar              |
| created_at| timestamp | now()     | Data de criação              |

### `student_progress`
Progresso do aluno nas aulas.

| Coluna       | Tipo      | Default | Descrição               |
|--------------|-----------|---------|-------------------------|
| id           | uuid (PK) | gen()   | ID                      |
| user_id      | uuid (FK) | —       | FK para profiles        |
| lesson_id    | uuid (FK) | —       | FK para lessons         |
| completed    | boolean   | false   | Se a aula foi concluída |
| completed_at | timestamp | null    | Data de conclusão       |
| created_at   | timestamp | now()   | Data de criação         |

### `points_history`
Histórico de pontos ganhos pelo aluno.

| Coluna     | Tipo      | Default | Descrição                     |
|------------|-----------|---------|-------------------------------|
| id         | uuid (PK) | gen()   | ID                            |
| user_id    | uuid (FK) | —       | FK para profiles              |
| points     | integer   | —       | Quantidade de pontos ganhos   |
| reason     | text      | —       | Motivo (ex: lesson_completed) |
| created_at | timestamp | now()   | Data do evento                |

## Políticas RLS

Todas as tabelas possuem Row Level Security habilitado:
- **profiles**: usuário lê/atualiza seu próprio perfil; admin lê todos
- **subjects, topics, lessons**: leitura pública; escrita apenas admin
- **student_progress**: usuário lê/escreve seu próprio progresso
- **points_history**: usuário lê seu próprio histórico

## Migrations

As migrations são gerenciadas via Supabase MCP e ficam registradas no dashboard do projeto.

Para listar migrations aplicadas:
- Acesse o Supabase Dashboard → SQL Editor
- Ou use a ferramenta MCP `list_migrations`
