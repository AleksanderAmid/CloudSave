# CloudSave

CloudSave is a self-hosted file storage platform designed to run on low-power devices like the Raspberry Pi 3. The project provides a React frontend and a TypeScript/Express backend with SQLite persistence.

## Features

| Feature | Admin | User | Notes |
|---------|-------|------|-------|
| File upload / download | ✅ (all files) | ✅ (own files) | Quota enforced per user |
| User management | ✅ Full control | ➖ Self profile only | Admin allocates quotas |
| Password flow | Set during install | Set on first login | Passwords hashed with bcrypt |
| Quota allocation | ✅ Adjust | View only | |
| Install script | ✅ | N/A | Interactive `install.sh` |
| DDNS / public domain | ✅ | ✅ | Works behind Nginx reverse proxy |
| Runs as service | ✅ | ✅ | Systemd service installs automatically |

---

## Quick Start (Development)

```bash
# Frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
```

The backend listens on `http://localhost:4000` and the Vite frontend on `http://localhost:5173`.

> Update `CORS_ORIGIN` in `backend/.env` to match the frontend URL when deploying.

---

## Production Install on Raspberry Pi 3

Run the installer as **root**:

```bash
sudo ./install.sh
```

The script will:

1. Ask for install directory, admin credentials, and storage path
2. Install Node.js, git, and other dependencies
3. Clone / update the CloudSave repo and build the backend
4. Create `.env`, initialise SQLite, and add the admin user
5. Register a `cloudsave.service` with systemd so the backend starts at boot

### Reverse Proxy (Nginx)

1. Install Nginx: `sudo apt-get install nginx`
2. Configure a server block (replace `cloudsave.example.com`):

```nginx
server {
  listen 80;
  server_name cloudsave.example.com;
  location / {
    proxy_pass http://localhost:4000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

3. Optionally enable HTTPS with Let's Encrypt:

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d cloudsave.example.com
```

### DDNS

If your ISP assigns dynamic IPs, use a DDNS provider (e.g., DuckDNS, No-IP) and point your domain's A record to the DDNS hostname.

Set `BASE_URL` or `CORS_ORIGIN` in `.env` to the public URL.

---

## Environment Variables (`backend/.env`)

```ini
DB_PATH=/opt/cloudsave/cloudsave.db
JWT_SECRET=change_me
FILES_ROOT=/opt/cloudsave_files
CORS_ORIGIN=http://localhost:5173
PORT=4000
```

---

## API Overview

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Log in. Returns JWT. |
| POST | `/api/auth/set-password` | First-time password set. |

### Admin (JWT admin token required)

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/api/admin/users` | `{ "username": "bob", "quota_mb": 512 }` |
| PUT | `/api/admin/users/:id/quota` | `{ "quota_mb": 1024 }` |
| PUT | `/api/admin/users/:id/reset-password` | — |
| GET | `/api/admin/users` | List users |

### Files (JWT token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/files` | List my files |
| POST | `/api/files/upload` | Upload `multipart/form-data` with `file` field |
| GET | `/api/files/download/:id` | Download file |
| DELETE | `/api/files/:id` | Delete file |
| PUT | `/api/files/:id/rename` | `{ "newName": "report.pdf" }` |
| PUT | `/api/files/:id/move` | `{ "destPath": "archives/2023" }` |

---

## Contributing

Pull requests are welcome. Please open an issue first to discuss major changes.

---

## License

MIT 