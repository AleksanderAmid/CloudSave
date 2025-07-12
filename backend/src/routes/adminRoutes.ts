import { Router } from "express";
import db from "../db";
import { authenticate, requireAdmin, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// Middleware chain: authenticate first, then requireAdmin
router.use(authenticate, requireAdmin);

// POST /users - create new user with quota_mb in body
router.post("/users", (req: AuthRequest, res) => {
  const { username, quota_mb } = req.body;
  if (!username || typeof quota_mb !== "number") {
    return res.status(400).json({ error: "username and quota_mb required" });
  }
  try {
    const stmt = db.prepare("INSERT INTO users (username, quota_mb, role) VALUES (?, ?, 'user')");
    stmt.run(username, quota_mb);
    res.status(201).json({ message: "User created" });
  } catch (err: any) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ error: "Username already exists" });
    }
    throw err;
  }
});

// PUT /users/:id/quota - adjust quota
router.put("/users/:id/quota", (req: AuthRequest, res) => {
  const { id } = req.params;
  const { quota_mb } = req.body;
  const stmt = db.prepare("UPDATE users SET quota_mb = ? WHERE id = ?");
  stmt.run(quota_mb, id);
  res.json({ message: "Quota updated" });
});

// PUT /users/:id/reset-password - reset password (sets password_hash to NULL)
router.put("/users/:id/reset-password", (req: AuthRequest, res) => {
  const { id } = req.params;
  db.prepare("UPDATE users SET password_hash = NULL WHERE id = ?").run(id);
  res.json({ message: "Password reset" });
});

// GET /users - list users
router.get("/users", (_req, res) => {
  const users = db.prepare("SELECT id, username, quota_mb, used_mb, role, status FROM users").all();
  res.json(users);
});

export default router; 