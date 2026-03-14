# Arquitetura do MAT Fácil

## Visão Geral

MAT Fácil é uma plataforma de aprendizado de matemática destinada a alunos do SESI. A aplicação segue uma arquitetura moderna baseada em Next.js com backend Supabase.

## Diagrama de Alto Nível

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser    │────▶│  Next.js 16  │────▶│   Supabase   │
│  (React 19) │◀────│  App Router  │◀────│  PostgreSQL  │
└─────────────┘     └──────────────┘     └──────────────┘
                           │                     │
                    ┌──────┴──────┐        ┌─────┴─────┐
                    │  Standalone │        │  Auth      │
                    │  Docker     │        │  Storage   │
                    └─────────────┘        │  Realtime  │
                                           └───────────┘
```

## Stack Tecnológico

| Camada       | Tecnologia                        |
|--------------|-----------------------------------|
| Framework    | Next.js 16 (App Router)           |
| UI Library   | React 19                          |
| Linguagem    | TypeScript 5                      |
| Estilos      | TailwindCSS v4, tw-animate-css    |
| Componentes  | Shadcn UI (Radix UI primitives)   |
| Animações    | Framer Motion                     |
| Fontes       | Inter (corpo), Space Grotesk (headings) |
| Ícones       | Lucide React                      |
| Backend      | Supabase (Auth + PostgreSQL)      |
| Deploy       | Docker + Traefik (VPS)            |

## Estrutura de Pastas

```
mat-facil/
├── src/
│   ├── app/
│   │   ├── (auth)/           # Rotas públicas: login, register, forgot-password
│   │   ├── (dashboard)/      # Rotas protegidas: dashboard, subjects, ranking, profile
│   │   ├── (admin)/          # Rotas admin: CRUD matérias, assuntos, aulas, alunos
│   │   ├── api/              # Route handlers
│   │   ├── layout.tsx        # Root layout (fonts, theme provider)
│   │   └── page.tsx          # Landing page
│   ├── components/
│   │   ├── shared/           # Navbar, Sidebar, SubjectCard, TopicCard, LessonCard
│   │   ├── gamification/     # XPGainToast, LevelUpModal
│   │   ├── interactive/      # GridAreaCanvas (conteúdo interativo)
│   │   └── ui/               # Shadcn components + custom
│   ├── hooks/                # useAuth, useGamification
│   ├── lib/
│   │   ├── supabase/         # client.ts, server.ts, middleware.ts
│   │   ├── constants.ts      # APP_META, LEVELS, DIFFICULTY_CONFIG
│   │   └── utils.ts          # cn(), helpers
│   ├── services/             # auth.ts, gamification.ts, subjects.ts
│   └── types/                # index.ts (todas as interfaces)
├── docs/                     # Documentação do projeto
├── supabase/
│   └── schema.sql            # Schema completo do banco
├── Dockerfile                # Build multi-stage para produção
└── docker-compose.yml        # Em mat-facil-docker/
```

## Padrões de Código

### Route Groups
Usamos route groups do Next.js (`(auth)`, `(dashboard)`, `(admin)`) para compartilhar layouts sem afetar a URL.

### Services Layer
Toda comunicação com Supabase passa pela camada `services/`. Componentes nunca chamam o Supabase diretamente.

### Auth Flow
1. Login/Register via `services/auth.ts` → Supabase Auth
2. Middleware (`proxy.ts`) verifica sessão e redireciona
3. `useAuth` hook fornece `profile` e `loading` para componentes
4. Rotas admin verificam `profile.role === "admin"`

### Gamificação
- Cada aula concluída gera XP via `services/gamification.ts`
- O nível é calculado com base nos pontos acumulados (10 níveis)
- Bônus por completar tópicos e matérias inteiras
