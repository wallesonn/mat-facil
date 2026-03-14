#!/bin/bash
# Build e push da imagem MAT Fácil para o Docker Hub
# Uso: ./build.sh v1.0.0
# Requer: .env.build com as variáveis de build (copie de .env.build.example)
set -e

VERSION=${1:-v1.0.0}

if [ -f .env.build ]; then
  set -a
  source .env.build
  set +a
else
  echo "❌ Arquivo .env.build não encontrado."
  echo "   Copie .env.build.example para .env.build e preencha os valores."
  exit 1
fi

echo "🔨 Building: wallesonnn/mat-facil:$VERSION (linux/amd64)"
docker buildx build --platform linux/amd64 --no-cache \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
  --build-arg NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
  --build-arg NEXT_PUBLIC_APP_NAME="$NEXT_PUBLIC_APP_NAME" \
  -t wallesonnn/mat-facil:$VERSION \
  --push \
  .

echo "🏷️  Tagging latest..."
docker buildx imagetools create --tag wallesonnn/mat-facil:latest wallesonnn/mat-facil:$VERSION

echo "✅ Done! Image published: wallesonnn/mat-facil:$VERSION + latest (linux/amd64)"
