# 🗄️ Hướng dẫn tạo Vercel Postgres

## Các bước tạo Vercel Postgres Database:

### 1. Đăng nhập Vercel
- Truy cập: https://vercel.com
- Đăng nhập bằng GitHub

### 2. Tạo Database
1. Vào Dashboard
2. Click "Storage" ở sidebar
3. Click "Create Database"
4. Chọn "Postgres"
5. Tên database: `pharma-production`
6. Region: chọn gần nhất (iad1 - US East)
7. Click "Create"

### 3. Lấy Connection String
1. Sau khi tạo xong, click vào database
2. Vào tab ".env.local"
3. Copy toàn bộ environment variables:
   ```
   POSTGRES_URL="postgresql://..."
   POSTGRES_PRISMA_URL="prisma://..."
   POSTGRES_URL_NO_SSL="postgresql://..."
   POSTGRES_URL_NON_POOLING="postgresql://..."
   ```

### 4. Sử dụng cho Import
- Dùng `POSTGRES_URL_NON_POOLING` để import database
- Dùng `POSTGRES_PRISMA_URL` cho production app

## ⚡ Free Tier Limits:
- 60 hours compute time/month
- 0.5 GB storage
- 1 database per project

## 🔧 Alternative: Neon.tech
Nếu muốn unlimited time:
1. Đăng ký tại neon.tech
2. Tạo project mới
3. Copy PostgreSQL connection string
