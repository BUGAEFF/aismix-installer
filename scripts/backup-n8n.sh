#!/bin/bash
set -e

BACKUP_DIR="/opt/aismix/backups/postgres"
DATE=$(date +"%Y-%m-%d_%H-%M")

declare -A DBS=(
  ["appix1"]="aismix-appix1-db-1:n8n1"
  ["appix2"]="aismix-appix2-db-1:n8n2"
  ["appix3"]="aismix-appix3-db-1:n8n3"
  ["appix4"]="aismix-appix4-db-1:n8n4"
  ["appix5"]="aismix-appix5-db-1:n8n5"
)

mkdir -p "$BACKUP_DIR"

for NAME in "${!DBS[@]}"; do
  FILE="$BACKUP_DIR/${NAME}_${DATE}.sql"
  IFS=":" read CONTAINER DB <<< "${DBS[$NAME]}"
  docker exec "$CONTAINER" pg_dump -U n8n "$DB" > "$FILE"
done

# Delete backups older 14 days
find "$BACKUP_DIR" -type f -mtime +14 -delete
rclone copy "$BACKUP_DIR" gdrive:AISMIX-BACKUPS --max-age 1h


