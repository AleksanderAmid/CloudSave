import { Router } from "express";
import db from "../db";
import { comparePassword, generateToken, hashPassword, getUserByUsername } from "../utils/auth";

const router = Router();

// POST /login
router.post("/login", async (req: any, res: any, next: any) => {
  try {
    const { username, password } = req.body;
    const user = getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.password_hash) {
      // First-time login
      return res.status(200).json({ firstTime: true });
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({ token, role: user.role, quota_mb: user.quota_mb, used_mb: user.used_mb });
  } catch (err) {
    next(err);
  }
});

// POST /set-password
router.post("/set-password", async (req: any, res: any, next: any) => {
  try {
    const { username, password } = req.body;
    const user = getUserByUsername(username);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.password_hash) return res.status(400).json({ error: "Password already set" });

    const hashed = await hashPassword(password);
    db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashed, user.id);

    const token = generateToken({ id: user.id, username: user.username, role: user.role });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

export default router; 