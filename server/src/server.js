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

// Initialize cron jobs for automated renewal reminders
initCronJobs();

const app = express();

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching whitelist
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev for local network testing
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root & Health check
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
    error: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Shivaji Library Server listening on http://localhost:${PORT}`);
  console.log(`📍 Library Location: Shivaji Enclave, Tagore Garden Extension, New Delhi 110027`);
});
