# MAT Fácil 🧮

Plataforma de aprendizado de matemática para alunos do SESI. Aprenda de forma divertida e interativa com gamificação, níveis e XP.

## Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Estilo**: TailwindCSS v4, Shadcn UI (base-ui), Framer Motion
- **Fontes**: Inter (corpo), Space Grotesk (headings)
- **Tema**: Dark mode nativo
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **Ícones**: Lucide React

## Funcionalidades

- ✅ Autenticação (login, cadastro, recuperação de senha)
- ✅ Perfis de usuário (aluno e admin)
- ✅ Dashboard personalizado com nível e XP
- ✅ Matérias, assuntos e aulas organizadas
- ✅ Sistema de gamificação (XP, 10 níveis, histórico de pontos)
- ✅ Painel admin com CRUD completo (matérias, assuntos, aulas)
- ✅ Ranking de alunos
- ✅ Proteção de rotas por autenticação e role
- ✅ Campo série no cadastro (6º ano a 3º ano EM)
- ✅ Página de perfil do aluno
- ✅ Página admin de alunos (filtro por série)
- ✅ Conteúdo interativo (canvas de cálculo de área)
- ✅ Deploy via Docker Hub + Portainer + Traefik
- 🔜 Exercícios interativos
- 🔜 Tutor com IA
- 🔜 Badges e conquistas

## Configuração

### 1. Clonar e instalar dependências

```bash
git clone <repo>
cd mat-facil
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp env.example .env.local
```

Edite `.env.local` com suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 3. Configurar o banco de dados Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor**
3. Execute o conteúdo de `supabase/schema.sql`

O schema cria automaticamente:
- Tabelas: `profiles`, `subjects`, `topics`, `lessons`, `student_progress`, `points_history`
- Trigger para criar perfil ao registrar usuário
- Políticas RLS (Row Level Security)
- Índices de performance

### 4. Criar usuário admin

Após criar sua conta pela plataforma, execute no SQL Editor:

```sql
update public.profiles
set role = 'admin'
where email = 'seu@email.com';
```

### 5. Rodar o projeto

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## Deploy (Produção)

**URL**: [https://matfacil.site](https://matfacil.site)

```bash
# Build e push para Docker Hub
./build.sh v1.0.0

# No Portainer da VPS: criar stack com mat-facil-docker/docker-compose.yml
# Variáveis: IMAGE_TAG=latest, DOMAIN=matfacil.site
```

Veja instruções completas em [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Estrutura de pastas

```
src/
├── app/
│   ├── (auth)/          # Login, Register, Forgot Password
│   ├── (dashboard)/     # Dashboard, Subjects, Topics, Lessons, Ranking
│   ├── (admin)/         # Admin panel (CRUD)
│   └── api/             # Route handlers
├── components/
│   ├── shared/          # Navbar, Sidebar, SubjectCard, TopicCard, LessonCard
│   ├── gamification/    # XPGainToast, LevelUpModal
│   └── ui/              # Shadcn components + custom (XPProgressBar, AnimatedButton)
├── hooks/               # useAuth, useGamification
├── lib/                 # Supabase clients, constants, utils
├── services/            # auth, gamification, subjects
└── types/               # TypeScript interfaces
supabase/
└── schema.sql           # Schema completo do banco
```

## Gamificação

| Nível | Label      | XP mínimo |
|-------|------------|-----------|
| 1     | Iniciante  | 0         |
| 2     | Explorador | 100       |
| 3     | Aprendiz   | 250       |
| 4     | Estudante  | 500       |
| 5     | Dedicado   | 800       |
| 6     | Avançado   | 1200      |
| 7     | Expert     | 1700      |
| 8     | Mestre     | 2300      |
| 9     | Gênio      | 3000      |
| 10    | Lendário   | 4000      |

**Pontos por evento:**
- +10 XP ao concluir uma aula
- +20 XP ao completar todos os assuntos de um tópico
- +50 XP ao completar todos os tópicos de uma matéria

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/login` | Login |
| `/register` | Cadastro |
| `/forgot-password` | Recuperação de senha |
| `/dashboard` | Painel do aluno |
| `/subjects` | Lista de matérias |
| `/subjects/[id]` | Assuntos de uma matéria |
| `/subjects/[id]/topics/[topicId]` | Aulas de um assunto |
| `/subjects/[id]/topics/[topicId]/lessons/[lessonId]` | Aula |
| `/ranking` | Ranking de alunos |
| `/admin` | Painel admin |
| `/admin/subjects` | CRUD matérias |
| `/admin/topics` | CRUD assuntos |
| `/admin/lessons` | CRUD aulas |
| `/admin/students` | Lista de alunos |
| `/profile` | Edição de perfil |

## Changelog

### [0.1.0] - 2026-03-13
#### Added
- Projeto inicial com Next.js 15, React 19, TailwindCSS v4, Supabase
- Autenticação completa (login, cadastro, recuperação de senha)
- Dashboard do aluno com nível e XP
- Páginas de matérias, assuntos, aulas com navegação hierárquica
- Sistema de gamificação (10 níveis, XP, histórico de pontos)
- Painel admin com CRUD (matérias, assuntos, aulas)
- Ranking de alunos
- Landing page com animações (Framer Motion)
- Schema SQL completo com RLS, triggers e índices
- API routes para subjects e gamificação
- Proteção de rotas por autenticação e role (student/admin)

### [0.3.1] - 2026-03-14
#### Added
- Deploy em produção: [matfacil.site](https://matfacil.site)
- Script `build.sh` para build e push no Docker Hub (`wallesonnn/mat-facil`)
- Variável `IMAGE_TAG` no docker-compose
- Rede Docker corrigida para `web` (compatível com Traefik existente)

### [0.3.0] - 2026-03-13
#### Added
- Campo série no cadastro e perfil do aluno
- Página de perfil (`/profile`)
- Página admin de alunos (`/admin/students`) com filtro por série
- Canvas interativo para cálculo de área com quadrícula
- Dockerfile, Docker Compose, documentação completa (`docs/`)

### [0.2.0] - 2026-03-13
#### Changed
- Dark theme aplicado em toda a aplicação
- Fontes atualizadas: Inter + Space Grotesk

#### Fixed
- Hydration error na landing page
- Conflito middleware.ts / proxy.ts no Next.js 16
