# Instructions for Database Setup

## Current Issue:
Your Vercel Postgres Accelerate URL cannot be used for database operations like `prisma db push` and seeding.

## Solution: Use Neon Database (Free)

### Step 1: Create Neon Database
1. Go to https://neon.tech
2. Sign up for free
3. Create new project: "pharma-production"
4. Copy the connection string (starts with postgresql://)

### Step 2: Update .env file
Replace the DATABASE_URL in .env with your Neon connection string:

```
# Replace this line in .env:
DATABASE_URL="postgres://accelerate.prisma-data.net/?api_key=..."

# With your Neon URL:
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### Step 3: Setup Database
After updating .env, run:
```bash
npx prisma db push
npm run db:seed
```

### Step 4: Update Vercel Environment Variables
In Vercel Dashboard > Settings > Environment Variables:
- Update DATABASE_URL with your Neon connection string
- Redeploy the application

## Alternative: Use Vercel Postgres Direct URL
If you have access to Vercel Postgres direct URL (not Accelerate), you can use that instead.
Look for POSTGRES_URL_NON_POOLING in your Vercel dashboard.
