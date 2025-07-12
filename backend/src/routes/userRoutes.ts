import { Router } from "express";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";
import db from "../db";

const router = Router();
router.use(authenticate);

router.get("/me", (req: AuthRequest, res) => {
  const user = db.prepare("SELECT id, username, role, quota_mb, used_mb FROM users WHERE id = ?").get(req.user.id);
  res.json(user);
});

export default router; 