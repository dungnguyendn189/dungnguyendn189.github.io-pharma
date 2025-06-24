# Vercel Postgres Setup

## Tạo Database trên Vercel:

1. Đăng nhập vào vercel.com
2. Vào Dashboard → Storage → Create Database
3. Chọn "Postgres" → Chọn region gần nhất
4. Tên database: `pharma-db` (hoặc tên bạn muốn)
5. Copy connection string từ .env.local tab

## Environment Variables cho Vercel:

```bash
# Database
DATABASE_URL="postgres://username:password@host:port/database?sslmode=require"

# Email (nếu cần)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Application
NODE_ENV=production
```

## Lệnh migration sau khi deploy:

```bash
# Trong Vercel Functions hoặc local với production DB
npx prisma migrate deploy
npx prisma db seed
```
