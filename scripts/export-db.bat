@echo off
echo Exporting local database...

REM Database connection details - UPDATE THESE WITH YOUR ACTUAL VALUES
set DB_HOST=localhost
set DB_PORT=5432
set DB_NAME=pharma_db
set DB_USER=postgres

echo ================================================
echo Database Export Tool
echo ================================================
echo Host: %DB_HOST%
echo Port: %DB_PORT%
echo Database:eqpharma_db
echo User: postgres
echo ================================================

REM Create exports directory
if not exist "exports" mkdir exports

REM Export complete database
echo Exporting complete database...
pg_dump -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% --no-owner --no-privileges -f exports\database-export.sql

if exist "exports\database-export.sql" (
    echo ✅ Export completed successfully!
    echo File saved: exports\database-export.sql
    echo File size:
    dir exports\database-export.sql
) else (
    echo ❌ Export failed! Please check your database connection details.
)

echo.
echo Next steps:
echo 1. Create a cloud database (Vercel Postgres or Neon)
echo 2. Update import-to-cloud.sh with your cloud database URL
echo 3. Run the import script
echo.
pause
