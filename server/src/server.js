import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { initCronJobs } from "./services/cronService.js";

// Routes
import publicRoutes from "./routes/publicRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize cron jobs
initCronJobs();

const app = express();

// Trust reverse proxy (important for Render/Heroku/Vercel)
app.set("trust proxy", 1);

app.use(
  cors({
    origin: true, // Allow all origins in production, credentials included
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root & Health check endpoints
app.get("/", (req, res) => {
  res.json({
    status: "Shivaji Library REST API is active",
    version: "1.0.0",
    library: "Shivaji Library, Tagore Garden Extension, New Delhi",
    endpoints: {
      public: "/api",
      member: "/api/member",
      admin: "/api/admin",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Shivaji Library API",
    time: new Date().toISOString(),
  });
});

// Mount Routes
app.use("/api", publicRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/admin", adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Shivaji Library Server listening on 0.0.0.0:${PORT}`);
});