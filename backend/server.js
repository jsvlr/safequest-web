import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, "../frontend/public")));

// Basic test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

// Auth routes (simplified for now)
app.post("/api/auth/verify", (req, res) => {
  // Temporary mock response
  res.json({
    success: true,
    message: "Auth verification endpoint",
  });
});

// API routes
app.get("/api/data", (req, res) => {
  res.json({
    data: "Sample data from Express server",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    "Environment loaded:",
    process.env.FIREBASE_PROJECT_ID
      ? "Firebase config found"
      : "No Firebase config"
  );
});
