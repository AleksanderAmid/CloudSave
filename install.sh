#!/usr/bin/env bash
# CloudSave installation script for Raspberry Pi 3 (Debian-based)
set -e

# Colors for output
GREEN="\033[0;32m"
RED="\033[0;31m"
NC="\033[0m" # No Color

if [[ $EUID -ne 0 ]]; then
  echo -e "${RED}This script must be run as root (sudo).${NC}"
  exit 1
fi

printf "\n========= CloudSave Installer =========\n"
read -rp "Install directory [/opt/cloudsave]: " INSTALL_DIR
INSTALL_DIR=${INSTALL_DIR:-/opt/cloudsave}

read -rp "Admin username [admin]: " ADMIN_USER
ADMIN_USER=${ADMIN_USER:-admin}

read -srp "Admin password: " ADMIN_PASS
printf "\n"
read -srp "Confirm admin password: " ADMIN_PASS_CONFIRM
printf "\n"
if [[ "$ADMIN_PASS" != "$ADMIN_PASS_CONFIRM" ]]; then
  echo -e "${RED}Passwords do not match. Exiting.${NC}"
  exit 1
fi

read -rp "Storage directory for user files [/opt/cloudsave_files]: " FILES_ROOT
FILES_ROOT=${FILES_ROOT:-/opt/cloudsave_files}

# Create directories
mkdir -p "$INSTALL_DIR"
mkdir -p "$FILES_ROOT"

printf "\n${GREEN}Installing dependencies...${NC}\n"
# Update package list
apt-get update -y
# Install Node.js & git
apt-get install -y nodejs npm git
# Symlink node if needed
if ! command -v node >/dev/null 2>&1; then
  ln -s /usr/bin/nodejs /usr/bin/node
fi

printf "\n${GREEN}Cloning repository (if not already present)...${NC}\n"
if [[ ! -d "$INSTALL_DIR/.git" ]]; then
  git clone https://github.com/your-repo/cloudsave.git "$INSTALL_DIR"
fi
cd "$INSTALL_DIR/backend"

printf "\n${GREEN}Installing npm dependencies...${NC}\n"
npm install --production

printf "\n${GREEN}Building TypeScript project...${NC}\n"
npm run build

# Create .env file
cat > .env <<EOF
DB_PATH=$INSTALL_DIR/cloudsave.db
JWT_SECRET=$(openssl rand -hex 32)
FILES_ROOT=$FILES_ROOT
CORS_ORIGIN=
PORT=4000
EOF

# Initialize DB and create admin user
printf "\n${GREEN}Initializing database...${NC}\n"
node - <<'NODE'
const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');
const fs = require('fs');
require('dotenv').config({ path: '.env' });
const { DB_PATH } = process.env;
const db = new Database(DB_PATH);

// Migrations
db.prepare(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password_hash TEXT, role TEXT NOT NULL DEFAULT 'admin', quota_mb INTEGER NOT NULL DEFAULT 0, used_mb INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'active');`).run();

(async () => {
  const hash = await bcrypt.hash(process.env.ADMIN_PASS, 10);
  const stmt = db.prepare('INSERT OR REPLACE INTO users (id, username, password_hash, role, quota_mb) VALUES (1, ?, ?, "admin", 0)');
  stmt.run(process.env.ADMIN_USER, hash);
})();
NODE

printf "\n${GREEN}Creating systemd service...${NC}\n"
SERVICE_FILE=/etc/systemd/system/cloudsave.service
cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=CloudSave backend service
After=network.target

[Service]
Type=simple
Environment=NODE_ENV=production
WorkingDirectory=$INSTALL_DIR/backend
ExecStart=$(which node) dist/server.js
Restart=on-failure
User=root

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable cloudsave.service
systemctl restart cloudsave.service

printf "\n${GREEN}Installation complete!${NC}\n"
printf "Backend running on port 4000. Access at http://<YOUR_PI_IP>:4000 (or configure DDNS + reverse proxy for HTTPS).\n" 