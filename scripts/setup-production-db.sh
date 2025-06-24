#!/bin/bash

echo "🗄️ Database Setup for Production"
echo "================================="

# Check current DATABASE_URL
echo "Current DATABASE_URL in .env:"
grep "DATABASE_URL" .env

echo ""
echo "Setting up production database..."

# Push schema to production database
echo "📤 Pushing Prisma schema to production database..."
npx prisma db push --accept-data-loss

echo ""
echo "🌱 Seeding production database..."
npm run db:seed

echo ""
echo "✅ Production database setup complete!"
echo ""
echo "🔧 To view your database:"
echo "npx prisma studio"
