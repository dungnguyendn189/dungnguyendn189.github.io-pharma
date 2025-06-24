#!/bin/bash

# Database connection details - UPDATE THESE
DB_HOST="localhost"
DB_PORT="5432" 
DB_NAME="pharma_db"
DB_USER="postgres"

echo "Exporting database..."

# Export schema and data
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME --no-owner --no-privileges -f database-export.sql

echo "Database exported to database-export.sql"
