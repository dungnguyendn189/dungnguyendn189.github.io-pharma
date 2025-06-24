#!/bin/bash

# Cloud database connection details - UPDATE WITH YOUR VERCEL DATABASE_URL
# Get this from: Vercel Dashboard > Storage > Your DB > Quickstart > Show secret
# Use the DATABASE_URL (starts with postgresql://)
CLOUD_DB_URL="postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMDFKWUZUNlE5MldOTUdGSkI2VzBHUVFYQTUiLCJ0ZW5hbnRfaWQiOiI4MzM0ZDhlMmEwMjZkYjk2MmI5ODZiNWNiOWYyOGRiZmYwNTVmYzMyOWMyOTQ4OTdhYzI2Y2Q0YWU2MGNiMTM1IiwiaW50ZXJuYWxfc2VjcmV0IjoiMGNlMjFmNDktNjUxMy00Yjc5LTk0ZDYtYzkyMzcyYzk4NmExIn0.9LuHmZEIrVNxa_MG9hTQ-HOvmVOzDMt0n78fE-HRZvk"

echo "================================================"
echo "Database Import Tool"
echo "================================================"
echo "Target: $CLOUD_DB_URL"
echo "================================================"

if [ "$CLOUD_DB_URL" = "paste_your_database_url_here" ] || [ "$CLOUD_DB_URL" = "your_postgres_url_here" ] || [ "$CLOUD_DB_URL" = "your_cloud_database_url_here" ]; then
    echo "❌ Please update CLOUD_DB_URL in this script first!"
    echo "Get your database URL from:"
    echo "- Vercel Postgres: Dashboard > Storage > Your DB > .env.local"
    echo "- Neon: Dashboard > Connection Details"
    exit 1
fi

if [ ! -f "exports/database-export.sql" ]; then
    echo "❌ Database export file not found!"
    echo "Please run export-db.bat first to create the export."
    exit 1
fi

echo "Importing database to cloud..."

# Import to cloud database
psql "$CLOUD_DB_URL" -f exports/database-export.sql

if [ $? -eq 0 ]; then
    echo "✅ Database imported successfully!"
    echo "Your cloud database is now ready for production."
else
    echo "❌ Import failed! Please check your connection URL and try again."
fi
