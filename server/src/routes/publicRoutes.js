import express from "express";
import { registerMember, loginMember, logout } from "../controllers/authController.js";
import { getBooks, submitContactInquiry } from "../controllers/bookController.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", loginLimiter, registerMember);
router.post("/member/login", loginLimiter, loginMember);
router.post("/member/logout", logout);
router.get("/books", getBooks);
router.post("/contact", submitContactInquiry);

export default router;
