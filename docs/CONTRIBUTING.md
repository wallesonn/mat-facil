# Contribuindo — MAT Fácil

## Pré-requisitos

- Node.js 20+
- npm ou pnpm
- Conta no Supabase (para desenvolvimento)

## Setup de Desenvolvimento

```bash
# 1. Clone o repositório
git clone <repo>
cd mat-facil

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp env.example .env.local
# Edite .env.local com suas credenciais do Supabase

# 4. Rode o servidor de desenvolvimento
npm run dev
```

## Padrões de Código

### Geral
- TypeScript strict em todos os arquivos
- Componentes sempre em `"use client"` quando usam hooks/estado
- Imports organizados: React → Next → libs → componentes → services → types

### Estilo
- TailwindCSS v4 com classes semânticas de dark theme
- Usar `text-foreground`, `bg-card`, `border-border` ao invés de cores hardcoded
- Responsividade mobile-first

### Commits
Usar mensagens descritivas em português:
```
feat: adiciona campo série ao cadastro do aluno
fix: corrige responsividade do canvas interativo
docs: atualiza documentação de deploy
```

### Estrutura de Arquivos
- Páginas em `src/app/` seguindo App Router do Next.js
- Componentes reutilizáveis em `src/components/`
- Lógica de negócio em `src/services/`
- Tipos centralizados em `src/types/index.ts`

## Branches

| Branch | Descrição |
|--------|-----------|
| `main` | Produção estável |
| `develop` | Desenvolvimento ativo |
| `feature/*` | Novas funcionalidades |
| `fix/*` | Correções de bugs |

## Criando Conteúdo (Admin)

1. Acesse `/admin` com uma conta admin
2. Crie matérias em `/admin/subjects`
3. Crie assuntos em `/admin/topics` (com série associada)
4. Crie aulas em `/admin/lessons`

Para conteúdo interativo, veja `docs/INTERACTIVE_CONTENT.md`.
