# Segurança — MAT Fácil

## Autenticação

- Gerenciada pelo **Supabase Auth** (JWT-based)
- Senhas armazenadas com bcrypt pelo Supabase
- Tokens JWT incluídos automaticamente em cada requisição
- Sessão persistida via cookies httpOnly (Supabase SSR)

## Autorização

### Row Level Security (RLS)
Todas as tabelas do banco possuem RLS habilitado:

- **profiles**: usuário lê/atualiza apenas seu próprio perfil; admin lê todos
- **subjects, topics, lessons**: leitura pública; escrita restrita a admin
- **student_progress**: leitura/escrita apenas do próprio usuário
- **points_history**: leitura apenas do próprio usuário

### Roles
| Role | Permissões |
|------|------------|
| `student` | Acessar dashboard, matérias, aulas, ranking, perfil |
| `admin` | Tudo do student + painel admin (CRUD matérias/assuntos/aulas/alunos) |

### Middleware
- `proxy.ts` verifica sessão em rotas protegidas
- Admin layout verifica `profile.role === "admin"` no cliente

## Variáveis de Ambiente

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: chave pública, segura para expor no cliente
- `SUPABASE_SERVICE_ROLE_KEY`: **nunca expor no cliente**, usar apenas server-side
- Arquivos `.env.local` e `.env` estão no `.gitignore`

## Docker

- Imagem de produção roda como usuário não-root (`nextjs:1001`)
- Variáveis sensíveis injetadas via build args ou `.env` (não incluídas na imagem)

## Boas Práticas

- Nunca hardcodar chaves no código-fonte
- Sempre usar RLS no Supabase — nunca desabilitar
- Validar inputs no cliente E no servidor (RLS)
- Manter dependências atualizadas (`npm audit`)
