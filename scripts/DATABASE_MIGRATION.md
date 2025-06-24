# 🗄️ Database Migration Guide

Hướng dẫn chuyển database từ local lên cloud để deploy

## 📋 Các Bước Thực Hiện

### 1. Chuẩn Bị Database Local

Đảm bảo bạn có:
- ✅ PostgreSQL đã cài đặt và đang chạy
- ✅ Database local đã có data
- ✅ Biết thông tin kết nối (tên DB, user, password)

### 2. Export Database Local

**Trên Windows:**
```bash
# Mở Command Prompt trong thư mục scripts
cd scripts
export-db.bat
```

**Cần cập nhật thông tin trong export-db.bat:**
```bat
set DB_HOST=localhost
set DB_PORT=5432
set DB_NAME=tên_database_của_bạn
set DB_USER=postgres
```

### 3. Tạo Cloud Database

**Option A: Vercel Postgres (Khuyến nghị)**
1. Đăng nhập vercel.com
2. Dashboard → Storage → Create Database → Postgres
3. Copy connection string từ `.env.local` tab

**Option B: Neon.tech (Miễn phí)**
1. Đăng ký tại neon.tech
2. Create project → Create database
3. Copy connection string

### 4. Import Database lên Cloud

**Cập nhật connection string trong import-to-cloud.sh:**
```bash
CLOUD_DB_URL="postgresql://username:password@host:port/database?sslmode=require"
```

**Chạy import:**
```bash
# Trong Git Bash hoặc WSL
chmod +x scripts/import-to-cloud.sh
./scripts/import-to-cloud.sh
```

### 5. Verify Database

```bash
# Connect to cloud database
psql "your_cloud_database_url" -c "\dt"  # List tables
psql "your_cloud_database_url" -c "SELECT COUNT(*) FROM admin;"  # Check data
```

## 🔧 Troubleshooting

**Lỗi permission denied:**
```bash
chmod +x scripts/*.sh
```

**Lỗi pg_dump not found:**
- Thêm PostgreSQL vào PATH
- Hoặc dùng đường dẫn đầy đủ: `"C:\Program Files\PostgreSQL\16\bin\pg_dump.exe"`

**Lỗi authentication failed:**
- Kiểm tra username/password PostgreSQL
- Thử với user 'postgres' và password của bạn

## 📁 File Structure Sau Khi Export

```
scripts/
├── export-db.bat          # Export script cho Windows
├── import-to-cloud.sh     # Import script cho cloud
├── exports/               # Folder chứa file export
│   └── database-export.sql
└── DATABASE_MIGRATION.md  # File này
```
