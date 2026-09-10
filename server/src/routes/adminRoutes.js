import express from "express";
import { loginAdmin, logout, getCurrentUser } from "../controllers/authController.js";
import {
  getDashboardStats,
  getMembers,
  getMemberById,
  recordMemberPayment,
  updateMemberStatus,
  exportMembersCSV,
  triggerReminders,
} from "../controllers/adminController.js";
import { addBook, deleteBook } from "../controllers/bookController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Public admin login
router.post("/login", loginLimiter, loginAdmin);

// Protected admin routes
router.use(verifyToken, isAdmin);

router.post("/logout", logout);
router.get("/me", getCurrentUser);
router.get("/dashboard/stats", getDashboardStats);
router.get("/members", getMembers);
router.get("/members/export", exportMembersCSV);
router.get("/members/:id", getMemberById);
router.post("/members/:id/payment", recordMemberPayment);
router.patch("/members/:id/status", updateMemberStatus);
router.post("/trigger-reminders", triggerReminders);
router.post("/books", addBook);
router.delete("/books/:id", deleteBook);

export default router;
