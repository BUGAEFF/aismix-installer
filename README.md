aismix-installer

Automated deployment of a secure environment on Ubuntu:
Traefik + Docker + NGINX + multiple isolated n8n containers.

This repository installs a complete production-ready server with:

Reverse proxy (Traefik) with automatic SSL

NGINX static site

Multiple isolated n8n instances (each with its own database)

Docker + Docker Compose

Firewall + basic security hardening

Automatic startup on boot

🚀 Quick Install

Run on a clean Ubuntu server:

curl -s https://raw.githubusercontent.com/BUGAEFF/aismix-installer/main/install.sh | bash

🔧 Configuration

Copy .env.example to .env:

cp .env.example .env
nano .env


You can configure:

Basic auth credentials

Database passwords

Domain and email for HTTPS certificates

📂 Folder Structure
.
├── install.sh
├── docker-compose.yml
├── .env.example
├── traefik/
│   ├── traefik.yml
│   └── acme.json
└── nginx/
    ├── default.conf
    └── html/
        └── index.html

🔒 Security

HTTPS enabled automatically

Each n8n instance uses separate database/storage

UFW firewall enabled

Fail2ban installed

Sensitive data stored only in .env (not committed)

Minimal exposed ports

📝 License

MIT License
© BUGAEFF
