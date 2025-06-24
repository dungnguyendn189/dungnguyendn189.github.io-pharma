#!/bin/bash

echo "🚀 Starting Vercel build process..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Run database migrations if in production
if [ "$VERCEL_ENV" = "production" ] || [ "$VERCEL_ENV" = "preview" ]; then
  echo "🗄️ Running database migrations..."
  npx prisma migrate deploy
fi

# Build the application
echo "🏗️ Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"
