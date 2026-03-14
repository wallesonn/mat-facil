# Deploy — MAT Fácil

## Pré-requisitos

- VPS com Docker e Docker Compose instalados
- Portainer (para gerenciamento visual)
- Traefik rodando como reverse proxy com rede externa `traefik`
- Domínio `matfacil.site` apontando para o IP da VPS
- Conta no Docker Hub (`wallesonnn`)

## Fluxo de Deploy

```
[Máquina local]                    [Docker Hub]              [VPS]
     │                                  │                      │
     │  ./build.sh v1.0                 │                      │
     │──────build + push───────────────▶│                      │
     │                                  │    docker pull        │
     │                                  │◀─────────────────────│
     │                                  │                      │
     │                                  │  portainer stack up   │
     │                                  │─────────────────────▶│
     │                                  │                      │
     │                          https://matfacil.site          │
```

## 1. DNS na Hostinger

Acesse o painel da Hostinger:

1. Vá em **Domínios** → **matfacil.site** → **DNS / Nameservers**
2. Na aba **Gerenciar registros DNS**, adicione:

| Tipo | Nome | Aponta para | TTL |
|------|------|-------------|-----|
| A | @ | `IP_DA_SUA_VPS` | 14400 |
| A | www | `IP_DA_SUA_VPS` | 14400 |

3. Aguarde a propagação DNS (pode levar até 24h, mas geralmente minutos)
4. Teste com: `ping matfacil.site`

## 2. Build e Push (máquina local)

```bash
cd mat-facil

# Login no Docker Hub (uma vez)
docker login

# Build + push como latest
./build.sh

# Build + push com versão específica
./build.sh v1.0
```

O script `build.sh` faz automaticamente:
- Build da imagem com as variáveis do Supabase embutidas
- Tag com a versão informada + `latest`
- Push para `wallesonnn/mat-facil` no Docker Hub

## 3. Deploy via Portainer

1. Acesse o Portainer da sua VPS
2. Vá em **Stacks** → **Add stack**
3. Dê o nome: `mat-facil`
4. No campo **Web editor**, cole o conteúdo do `docker-compose.yml`:

```yaml
version: "3.8"

services:
  mat-facil:
    image: wallesonnn/mat-facil:${IMAGE_TAG:-latest}
    container_name: mat-facil
    restart: unless-stopped
    expose:
      - "3000"
    environment:
      - NODE_ENV=production
    networks:
      - traefik
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.mat-facil.rule=Host(`${DOMAIN:-matfacil.site}`)"
      - "traefik.http.routers.mat-facil.entrypoints=websecure"
      - "traefik.http.routers.mat-facil.tls.certresolver=letsencrypt"
      - "traefik.http.services.mat-facil.loadbalancer.server.port=3000"

networks:
  traefik:
    external: true
```

5. Na seção **Environment variables**, adicione:

| Name | Value |
|------|-------|
| IMAGE_TAG | latest |
| DOMAIN | matfacil.site |

6. Clique em **Deploy the stack**

## 4. Atualizações

Quando houver nova versão:

```bash
# Na máquina local
./build.sh v1.1

# No Portainer:
# Vá em Stacks → mat-facil → Editor
# Mude IMAGE_TAG para v1.1 (ou mantenha latest)
# Clique em "Update the stack" com "Re-pull image" marcado
```

## Rede Traefik

O compose espera uma rede externa chamada `traefik`. Se sua rede tem outro nome, edite o compose substituindo `traefik` pelo nome correto.

## Dockerfile — Detalhes

Build multi-stage com Node 20 Alpine:

1. **deps** — Instala dependências (node_modules)
2. **builder** — Executa `next build` com `output: "standalone"` e variáveis `NEXT_PUBLIC_*` embutidas
3. **runner** — Imagem final mínima (~150MB), roda como usuário não-root

## Troubleshooting

| Problema | Solução |
|----------|---------|
| Container não sobe | `docker logs mat-facil` |
| 502 Bad Gateway | Verifique se container e Traefik estão na mesma rede |
| Variáveis não aplicam | `NEXT_PUBLIC_*` são embutidas no BUILD. Rebuilde com `./build.sh` |
| SSL falha | Verifique DNS e certresolver do Traefik |
| Imagem não atualiza | No Portainer, marque "Re-pull image" ao atualizar stack |
