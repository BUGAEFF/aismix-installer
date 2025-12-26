#!/bin/bash
set -e

BACKUP_DIR="/opt/aismix/backups/postgres"
DATE=$(date +"%Y-%m-%d_%H-%M")

declare -A DBS=(
  ["appix1"]="aismix-appix1-db-1"
  ["appix2"]="aismix-appix2-db-1"
  ["appix3"]="aismix-appix3-db-1"
  ["appix4"]="aismix-appix4-db-1"
  ["appix5"]="aismix-appix5-db-1"
)

mkdir -p "$BACKUP_DIR"

for NAME in "${!DBS[@]}"; do
  CONTAINER="${DBS[$NAME]}"
  FILE="$BACKUP_DIR/${NAME}_${DATE}.sql"
  docker exec "$CONTAINER" pg_dump -U n8n n8n > "$FILE"
done

# удалить бэкапы старше 14 дней
find "$BACKUP_DIR" -type f -mtime +14 -delete

