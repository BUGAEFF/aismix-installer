#!/bin/bash

echo "=== Updating system ==="
apt update && apt upgrade -y

echo "=== Installing base packages ==="
apt install ufw fail2ban nginx git curl -y

echo "=== Installing Docker ==="
curl -fsSL https://get.docker.com | sh

echo "=== Pulling installer repo ==="
git clone https://github.com/BUGAEFF/aismix-installer /opt/aismix

cd /opt/aismix

echo "=== Preparing environment ==="
cp .env.example .env

echo "=== Enabling firewall ==="
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw --force enable

echo "=== Starting Docker Compose ==="
docker compose up -d

echo "=== INSTALLATION COMPLETE! ==="
