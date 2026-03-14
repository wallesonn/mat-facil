# Guia do Admin — MAT Fácil

## Acesso ao Painel Admin

1. Crie uma conta normalmente em `/register`
2. No Supabase SQL Editor, promova seu perfil para admin:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'seu@email.com';
```

3. Acesse `/admin` após login

## Funcionalidades do Admin

### Matérias (`/admin/subjects`)
- Criar, editar e excluir matérias
- Campos: nome, descrição, ícone, cor

### Assuntos (`/admin/topics`)
- Criar, editar e excluir assuntos dentro de uma matéria
- Campos: matéria, título, descrição, dificuldade, **série**, ordem
- Filtro por matéria e por série
- A série associada ajuda a organizar conteúdo por ano escolar

### Aulas (`/admin/lessons`)
- Criar, editar e excluir aulas dentro de um assunto
- Campos: assunto, título, conteúdo (JSON), status (rascunho/publicado), ordem, XP
- O conteúdo suporta blocos: text, math, image, video, exercise, step_by_step, quiz

### Alunos (`/admin/students`)
- Visualizar todos os alunos cadastrados
- Cards com contagem por série
- Filtrar por série ou buscar por nome/email
- Exibe nível e XP de cada aluno

## Adicionando Conteúdo via SQL

Para inserir conteúdo estruturado diretamente no banco:

```sql
UPDATE lessons
SET content = '{
  "blocks": [
    { "type": "text", "content": "Texto explicativo aqui..." },
    { "type": "math", "content": "A = \\pi r^2" },
    { "type": "image", "url": "https://...", "alt": "Descrição" }
  ]
}'::jsonb
WHERE id = 'uuid-da-aula';
```

## Boas Práticas

- Organize assuntos em ordem crescente de dificuldade
- Associe cada assunto à série correta para facilitar filtragem
- Mantenha aulas curtas e focadas (um conceito por aula)
- Use `xp_reward` maior para aulas mais difíceis (ex: 15-20 XP)
- Publique aulas apenas quando estiverem completas (`status: 'published'`)
