# Variáveis de Ambiente — MAT Fácil

## Arquivo `.env.local`

Este arquivo contém as variáveis de ambiente necessárias para rodar a aplicação localmente. Nunca commitar este arquivo.

## Variáveis Obrigatórias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública (anon) do Supabase | `eyJhbGci...` |

## Variáveis Opcionais

| Variável | Descrição | Default |
|----------|-----------|---------|
| `NEXT_PUBLIC_APP_URL` | URL da aplicação | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | Nome exibido na UI | `MAT Fácil` |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço (server-side only) | — |

## Docker / Produção

As variáveis `NEXT_PUBLIC_*` são embutidas no **build** da imagem Docker pelo script `build.sh`. Não precisam ser configuradas na VPS.

No Portainer (ou `mat-facil-docker/.env`), as únicas variáveis são:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `IMAGE_TAG` | Tag da imagem no Docker Hub | `latest`, `v1.0` |
| `DOMAIN` | Domínio para o Traefik | `matfacil.site` |

## Setup Rápido (desenvolvimento)

```bash
cp env.example .env.local
# Edite com seus valores reais
```
