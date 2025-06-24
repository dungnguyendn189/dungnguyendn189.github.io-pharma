#!/bin/bash

# Alternative solution: Use Prisma to migrate directly
echo "================================================"
echo "Database Migration via Prisma"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "../prisma/schema.prisma" ]; then
    echo "❌ Not in scripts directory or schema.prisma not found!"
    echo "Please run this from the scripts folder"
    exit 1
fi

echo "Setting up environment..."

# Create temporary .env file with production database URL
cat > ../.env.production << EOF
DATABASE_URL="postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMDFKWUZUNlE5MldOTUdGSkI2VzBHUVFYQTUiLCJ0ZW5hbnRfaWQiOiI4MzM0ZDhlMmEwMjZkYjk2MmI5ODZiNWNiOWYyOGRiZmYwNTVmYzMyOWMyOTQ4OTdhYzI2Y2Q0YWU2MGNiMTM1IiwiaW50ZXJuYWxfc2VjcmV0IjoiMGNlMjFmNDktNjUxMy00Yjc5LTk0ZDYtYzkyMzcyYzk4NmExIn0.9LuHmZEIrVNxa_MG9hTQ-HOvmVOzDMt0n78fE-HRZvk"
EOF

echo "Running Prisma migrations..."

cd ..

# Generate Prisma client
npx prisma generate --schema=prisma/schema.prisma

# Push schema to database
npx prisma db push --schema=prisma/schema.prisma --accept-data-loss

# Run seed if exists
if [ -f "prisma/seed.ts" ]; then
    echo "Running database seed..."
    npm run db:seed
fi

echo "✅ Database setup completed!"
echo "Your cloud database is now ready."

# Cleanup
rm .env.production

cd scripts
