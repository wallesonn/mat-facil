-- ============================================================
-- MAT FÁCIL — Schema do banco de dados (Supabase / PostgreSQL)
-- Execute este arquivo no SQL Editor do seu projeto Supabase
-- ============================================================

-- Habilita extensão para UUIDs
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- TABELA: profiles
-- Estende auth.users com informações do perfil do aluno/admin
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid        primary key references auth.users (id) on delete cascade,
  name        text        not null,
  email       text        not null,
  avatar_url  text,
  role        text        not null default 'student' check (role in ('student', 'admin')),
  points      integer     not null default 0 check (points >= 0),
  level       integer     not null default 1 check (level between 1 and 10),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'Perfis de usuários da plataforma MAT Fácil';

-- ─────────────────────────────────────────────────────────────
-- TABELA: subjects  (matérias)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.subjects (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  description text,
  icon        text,
  color       text,
  order_index integer     not null default 0,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.subjects is 'Matérias disponíveis na plataforma';

-- ─────────────────────────────────────────────────────────────
-- TABELA: topics  (assuntos dentro de uma matéria)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.topics (
  id          uuid        primary key default gen_random_uuid(),
  subject_id  uuid        not null references public.subjects (id) on delete cascade,
  title       text        not null,
  description text,
  difficulty  text        not null default 'easy' check (difficulty in ('easy', 'medium', 'hard')),
  "order"     integer     not null default 0,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.topics is 'Assuntos/tópicos de cada matéria';

-- ─────────────────────────────────────────────────────────────
-- TABELA: lessons  (aulas dentro de um assunto)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.lessons (
  id          uuid        primary key default gen_random_uuid(),
  topic_id    uuid        not null references public.topics (id) on delete cascade,
  title       text        not null,
  content     jsonb,
  status      text        not null default 'draft' check (status in ('draft', 'published', 'archived')),
  "order"     integer     not null default 0,
  xp_reward   integer     not null default 10,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.lessons is 'Aulas de cada assunto';

-- ─────────────────────────────────────────────────────────────
-- TABELA: student_progress  (progresso por aula)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.student_progress (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references public.profiles (id) on delete cascade,
  lesson_id     uuid        not null references public.lessons (id) on delete cascade,
  completed     boolean     not null default false,
  completed_at  timestamptz,
  score         integer,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id, lesson_id)
);

comment on table public.student_progress is 'Progresso de cada aluno por aula';

-- ─────────────────────────────────────────────────────────────
-- TABELA: points_history  (histórico de XP ganho)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.points_history (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.profiles (id) on delete cascade,
  amount      integer     not null,
  reason      text        not null,
  lesson_id   uuid        references public.lessons (id) on delete set null,
  created_at  timestamptz not null default now()
);

comment on table public.points_history is 'Histórico de pontos XP ganhos por aluno';

-- ─────────────────────────────────────────────────────────────
-- TRIGGER: atualiza updated_at automaticamente
-- ─────────────────────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create or replace trigger subjects_updated_at
  before update on public.subjects
  for each row execute procedure public.handle_updated_at();

create or replace trigger topics_updated_at
  before update on public.topics
  for each row execute procedure public.handle_updated_at();

create or replace trigger lessons_updated_at
  before update on public.lessons
  for each row execute procedure public.handle_updated_at();

create or replace trigger student_progress_updated_at
  before update on public.student_progress
  for each row execute procedure public.handle_updated_at();

-- ─────────────────────────────────────────────────────────────
-- TRIGGER: cria perfil automaticamente ao registrar usuário
-- ─────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role, points, level)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'student',
    0,
    1
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- RLS — Row Level Security
-- ─────────────────────────────────────────────────────────────
alter table public.profiles        enable row level security;
alter table public.subjects        enable row level security;
alter table public.topics          enable row level security;
alter table public.lessons         enable row level security;
alter table public.student_progress enable row level security;
alter table public.points_history  enable row level security;

-- profiles: usuário vê/edita apenas o próprio perfil; admin vê todos
create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- subjects: todos os autenticados leem; admin escreve
create policy "subjects: authenticated read" on public.subjects
  for select to authenticated using (true);

create policy "subjects: admin write" on public.subjects
  for all to authenticated using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- topics: todos os autenticados leem; admin escreve
create policy "topics: authenticated read" on public.topics
  for select to authenticated using (true);

create policy "topics: admin write" on public.topics
  for all to authenticated using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- lessons: alunos veem publicadas; admin vê tudo e escreve
create policy "lessons: student read published" on public.lessons
  for select to authenticated using (
    status = 'published'
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "lessons: admin write" on public.lessons
  for all to authenticated using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- student_progress: usuário vê/gerencia apenas o próprio progresso
create policy "student_progress: own" on public.student_progress
  for all to authenticated using (auth.uid() = user_id);

-- points_history: usuário vê apenas o próprio histórico
create policy "points_history: own read" on public.points_history
  for select to authenticated using (auth.uid() = user_id);

create policy "points_history: insert own" on public.points_history
  for insert to authenticated with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- ÍNDICES para performance
-- ─────────────────────────────────────────────────────────────
create index if not exists idx_topics_subject_id     on public.topics (subject_id);
create index if not exists idx_lessons_topic_id      on public.lessons (topic_id);
create index if not exists idx_progress_user_id      on public.student_progress (user_id);
create index if not exists idx_progress_lesson_id    on public.student_progress (lesson_id);
create index if not exists idx_points_history_user   on public.points_history (user_id);
create index if not exists idx_profiles_role         on public.profiles (role);
