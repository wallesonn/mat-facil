# Changelog — MAT Fácil

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

## [0.4.1] - 2026-03-25

### Added
- Bancos de perguntas para as aulas de Álgebra ainda sem quiz:
  - Introdução aos polinômios
  - Termos, coeficientes e grau
  - Exercícios e revisão
- Regras documentadas para criação de quizzes das aulas
  - 5 perguntas por sessão
  - Distribuição padrão: 2 fáceis, 2 médias e 1 difícil
  - 2 XP por resposta correta

### Changed
- Registry de quizzes passou a cobrir todas as aulas publicadas do tópico "Operações com Polinômios"
- Documentação de conteúdo interativo atualizada com o padrão de autoria dos quizzes

## [0.4.0] - 2026-03-16

### Added
- Tópicos agrupados por série na página de assuntos
  - Cada grupo exibe o nome da série como cabeçalho
  - Badge "Sua série" destaca a série do aluno logado
- Sistema de desbloqueio progressivo de conteúdo interativo
  - Série do aluno desbloqueada automaticamente se não há tópicos/aulas da série anterior na mesma matéria
  - Requer 3★ em todos os quizzes das aulas dos tópicos da série anterior (mesma matéria) para desbloquear
  - Tópicos de séries anteriores sempre acessíveis (para o aluno poder fazer os quizzes e desbloquear sua série)
  - Tópicos de séries posteriores sempre bloqueados
  - Admin vê tudo desbloqueado
- Estrelas do quiz exibidas ao lado do nome da aula na lista de aulas
- Auto-promoção de série na virada do ano letivo
  - Função SQL `promote_student_grades()` avança todos os alunos para a próxima série
  - Agendada via `pg_cron` para 1º de fevereiro às 00:00 BRT
  - Arquivo: `supabase/migrations/promote_grades.sql`

### Changed
- Tópicos: todos visíveis para todos os alunos (removido filtro por série — substituído pelo sistema de desbloqueio)
- `TopicCard`: novo visual para estado bloqueado (cadeado, opacidade reduzida, mensagem de requisito)

### Fixed
- Trigger `handle_new_user`: série (`grade`) não era salva no perfil ao cadastrar — corrigido lendo `raw_user_meta_data->>'grade'`
- `getLessonProgress`: erro 406 (Not Acceptable) ao abrir aula sem progresso anterior — corrigido usando `.maybeSingle()` em vez de `.single()`
- Lógica de desbloqueio: tópicos de séries anteriores estavam bloqueados, impedindo o aluno de fazer os quizzes necessários para desbloquear sua própria série

## [0.3.2] - 2026-03-16

### Added
- Quiz interativo estilo Duolingo na página da aula (`QuizAreaGame`)
  - Banco de 15 perguntas sobre área com quadrícula (6 fáceis, 6 médias, 3 difíceis)
  - Sorteio de 5 perguntas por sessão (2 fáceis + 2 médias + 1 difícil)
  - Timer por pergunta (15s fácil, 12s médio, 10s difícil)
  - Animações de acerto/erro, confetti e tela de resultado com estrelas
  - Sons via Web Audio API (acerto, erro, conclusão, tick)
  - Progress bar e badge de dificuldade
  - 2 XP por acerto (máx 10 XP por sessão)
  - Conclusão automática da aula ao terminar o quiz
- Persistência de resultados do quiz (`quiz_results` no Supabase)
  - Estrelas e XP salvos por aula/aluno
  - XP incremental: só ganha XP adicional ao superar recorde de estrelas
  - Tela de resultado exibe estrelas anteriores e XP ganho
- Filtro de tópicos por série do aluno
  - Aluno vê apenas tópicos da sua série ou sem série definida
  - Sem filtro para admin ou aluno sem série
- Suporte a `www.matfacil.site`: router Traefik + certificado SSL + redirect 301 para `matfacil.site`

### Changed
- Fórmula padronizada para `inteiros + parciais/2` em todo o projeto (canvas e quiz)
- Perguntas `e3`, `e4`, `e5` do quiz agora incluem quadradinhos parciais (amarelos) no grid visual

### Fixed
- `docker-compose.yml`: `certresolver` corrigido de `letsencrypt` para `lets-encrypt` (com hífen)
- Acesso pelo celular: site inacessível via `www` por falta de rota e certificado SSL
- Quiz: stale closure no `score` final — último acerto não era contabilizado no resultado
- Quiz: travamento ao navegar após concluir (`handleQuizComplete` chamava `handleComplete` repetidamente)
- Performance crítica: `createClient()` criava nova instância Supabase a cada chamada — corrigido com padrão singleton
- Performance crítica: `useAuth` era hook independente (cada componente criava seu próprio listener) — convertido para React Context Provider (`AuthProvider`) com instância única no root layout
- Tempos de resposta reduzidos de 25-75s para ~500ms após os dois fixes acima

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
