# Changelog — MAT Fácil

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

## [0.3.1] - 2026-03-14

### Added
- Deploy em produção: [matfacil.site](https://matfacil.site)
- Script `build.sh` para build e push de imagem Docker para Docker Hub (`wallesonnn/mat-facil`)
- Arquivo `.env.build.example` para variáveis de build
- Variável `IMAGE_TAG` no docker-compose para controle de versão da imagem
- Domínio `matfacil.site` configurado em todos os arquivos
- Guia de configuração DNS na Hostinger

### Changed
- Docker Compose agora puxa imagem do Docker Hub (não faz build local na VPS)
- Rede Docker corrigida de `traefik` para `web` (compatível com Traefik existente na VPS)
- Documentação de deploy reescrita para fluxo Docker Hub + Portainer

### Fixed
- `build.sh`: corrigido parsing de variáveis com espaço (`MAT Fácil`) usando `source` em vez de `export+xargs`

## [0.3.0] - 2026-03-13

### Added
- Campo "Série" no cadastro do aluno (6º ano a 3º ano EM)
- Coluna `grade` na tabela `profiles` e `topics`
- Página de perfil do aluno (`/profile`) com edição de nome, série e senha
- Página admin de alunos (`/admin/students`) com filtro por série
- Filtro por série na página de assuntos do admin (`/admin/topics`)
- Link "Meu Perfil" no sidebar do dashboard
- Link "Alunos" no sidebar do admin
- Conteúdo interativo: canvas para cálculo de área de formas irregulares
  - Desenho livre com mouse/toque
  - Slider para ajustar quantidade de quadrículas
  - Campo para tamanho do lado do quadrinho (decimal)
  - Seletor de unidade (mm, cm, m)
  - Resultado da área na unidade selecionada (mm², cm², m²)
- Botão de conclusão de aula com ganho de XP
- Dockerfile multi-stage para deploy em produção
- Docker Compose com suporte a Traefik (mat-facil-docker/)
- Pasta `docs/` com documentação completa do projeto

### Changed
- Texto da landing page corrigido: não é plataforma oficial, é destinada a alunos do SESI
- Canvas interativo totalmente responsivo para celulares

## [0.2.0] - 2026-03-13

### Changed
- Dark theme aplicado em toda a aplicação (landing, dashboard, admin, ranking, cards, navbar)
- Fontes atualizadas: Inter (corpo) + Space Grotesk (headings) substituindo Geist
- Cores de badges, ícones e status adaptadas para dark mode (opacity-based)
- Scrollbar estilizada para tema escuro

### Fixed
- Hydration error na landing page (Math.random → posições determinísticas)
- Conflito middleware.ts / proxy.ts no Next.js 16
- Tipos TypeScript alinhados com schema do banco

## [0.1.0] - 2026-03-13

### Added
- Projeto inicial com Next.js 16, React 19, TailwindCSS v4, Supabase
- Autenticação completa (login, cadastro, recuperação de senha)
- Dashboard do aluno com nível e XP
- Páginas de matérias, assuntos, aulas com navegação hierárquica
- Sistema de gamificação (10 níveis, XP, histórico de pontos)
- Painel admin com CRUD (matérias, assuntos, aulas)
- Ranking de alunos
- Landing page com animações (Framer Motion)
- Schema SQL completo com RLS, triggers e índices
- Proteção de rotas por autenticação e role (student/admin)
