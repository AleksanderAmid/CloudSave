import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import db from "../db";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";

const router = Router();
router.use(authenticate);

const FILES_ROOT = process.env.FILES_ROOT || path.join(process.cwd(), "user_files");
fs.mkdirSync(FILES_ROOT, { recursive: true });

const storage = multer.diskStorage({
  destination: (req: any, _file, cb) => {
    const userDir = path.join(FILES_ROOT, req.user.username);
    fs.mkdirSync(userDir, { recursive: true });
    cb(null, userDir);
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// GET / - list user's files
router.get("/", (req: AuthRequest, res) => {
  const files = db.prepare("SELECT * FROM files WHERE owner_id = ?").all(req.user.id);
  res.json(files);
});

// POST /upload - upload single file
router.post("/upload", upload.single("file"), (req: AuthRequest, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });
  const { filename, path: filePath, size } = req.file as any;

  // Check quota
  const newUsed = req.user.used_mb + size / (1024 * 1024);
  if (newUsed > req.user.quota_mb) {
    // delete file
    fs.unlinkSync(filePath);
    return res.status(403).json({ error: "Quota exceeded" });
  }

  // Insert metadata
  db.prepare(
    "INSERT INTO files (owner_id, file_path, original_name, size_bytes) VALUES (?, ?, ?, ?)"
  ).run(req.user.id, filePath, filename, size);

  // Update used_mb
  db.prepare("UPDATE users SET used_mb = used_mb + ? WHERE id = ?").run(
    size / (1024 * 1024),
    req.user.id
  );

  res.status(201).json({ message: "File uploaded" });
});

// GET /download/:id - download file
router.get("/download/:id", (req: AuthRequest, res) => {
  const { id } = req.params;
  const file = db.prepare("SELECT * FROM files WHERE id = ? AND owner_id = ?").get(id, req.user.id);
  if (!file) return res.status(404).json({ error: "File not found" });
  res.download(file.file_path, file.original_name);
});

// DELETE /:id - delete file
router.delete("/:id", (req: AuthRequest, res) => {
  const { id } = req.params;
  const file = db.prepare("SELECT * FROM files WHERE id = ? AND owner_id = ?").get(id, req.user.id);
  if (!file) return res.status(404).json({ error: "File not found" });

  // Delete file on disk
  fs.unlinkSync(file.file_path);

  // Remove from db
  db.prepare("DELETE FROM files WHERE id = ?").run(id);

  // Update user usage
  db.prepare("UPDATE users SET used_mb = used_mb - ? WHERE id = ?").run(
    file.size_bytes / (1024 * 1024),
    req.user.id
  );

  res.json({ message: "File deleted" });
});

// PUT /:id/rename - rename file
router.put("/:id/rename", (req: AuthRequest, res) => {
  const { id } = req.params;
  const { newName } = req.body;
  if (!newName) return res.status(400).json({ error: "newName required" });
  const file = db.prepare("SELECT * FROM files WHERE id = ? AND owner_id = ?").get(id, req.user.id);
  if (!file) return res.status(404).json({ error: "File not found" });

  const newPath = path.join(path.dirname(file.file_path), newName);
  fs.renameSync(file.file_path, newPath);
  db.prepare("UPDATE files SET file_path = ?, original_name = ? WHERE id = ?").run(newPath, newName, id);
  res.json({ message: "Renamed" });
});

// PUT /:id/move - move file to a subdirectory
router.put("/:id/move", (req: AuthRequest, res) => {
  const { id } = req.params;
  const { destPath } = req.body; // relative path inside user's directory
  if (!destPath) return res.status(400).json({ error: "destPath required" });

  const file = db.prepare("SELECT * FROM files WHERE id = ? AND owner_id = ?").get(id, req.user.id);
  if (!file) return res.status(404).json({ error: "File not found" });

  const userDir = path.join(FILES_ROOT, req.user.username);
  const targetDir = path.join(userDir, destPath);
  fs.mkdirSync(targetDir, { recursive: true });
  const newPath = path.join(targetDir, path.basename(file.file_path));
  fs.renameSync(file.file_path, newPath);
  db.prepare("UPDATE files SET file_path = ? WHERE id = ?").run(newPath, id);
  res.json({ message: "Moved" });
});

export default router; 