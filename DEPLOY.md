# Pharma App

Ứng dụng quản lý dược phẩm được xây dựng với Next.js, Prisma và PostgreSQL.

## 🚀 Deploy Guide

### Deploy lên Vercel (Khuyến nghị)

1. **Tạo tài khoản Vercel**: https://vercel.com
2. **Connect GitHub**: Liên kết repo GitHub của bạn
3. **Cấu hình Database**:
   - Dùng Vercel Postgres (miễn phí): https://vercel.com/docs/storage/vercel-postgres
   - Hoặc dùng Neon (PostgreSQL miễn phí): https://neon.tech
4. **Environment Variables** cần thiết:
   ```
   DATABASE_URL=your_postgres_connection_string
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email
   EMAIL_PASS=your_app_password
   ```

### Deploy lên Railway

1. **Tạo tài khoản**: https://railway.app
2. **Connect GitHub repo**
3. **Thêm PostgreSQL service** 
4. **Deploy** - Railway sẽ tự động detect Next.js

### Deploy lên Render

1. **Tạo tài khoản**: https://render.com
2. **Connect GitHub**
3. **Tạo PostgreSQL database** (free tier)
4. **Deploy web service**

## 🔧 Cấu hình Database

### Tạo database và chạy migrations:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database (optional)
npm run db:seed
```

## 📝 Environment Variables

Copy `.env.example` thành `.env` và điền thông tin:

```bash
cp .env.example .env
```

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

## 📦 Build và Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📊 Database Management

- **Prisma Studio**: `npx prisma studio`
- **View database**: http://localhost:5555
