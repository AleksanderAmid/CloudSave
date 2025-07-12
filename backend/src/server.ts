import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { runMigrations } from "./db";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import fileRoutes from "./routes/fileRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./utils/errorHandler";

const app = express();

// Basic security
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// Run DB migrations at startup
runMigrations();

// Routes
app.get("/api/health", (_, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/user", userRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`CloudSave backend running on port ${PORT}`);
}); 