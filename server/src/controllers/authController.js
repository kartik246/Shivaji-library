import bcrypt from "bcryptjs";
import Member from "../models/Member.js";
import Admin from "../models/Admin.js";
import { PLAN_CONFIG, getPlanDurationDays } from "../config/plans.js";
import { sendTokenResponse } from "../utils/token.js";
import { sendRegistrationEmail } from "../utils/emailService.js";

// POST /api/register
export const registerMember = async (req, res) => {
  try {
    const { name, email, phone, address, password, plan } = req.body;

    // Server-side input validation
    if (!name || !email || !phone || !address || !password || !plan) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields (name, email, phone, address, password, plan).",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const cleanPlan = plan.toLowerCase().trim();
    if (!PLAN_CONFIG[cleanPlan]) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan selected. Choose monthly, quarterly, or yearly.",
      });
    }

    // Check email uniqueness
    const existingMember = await Member.findOne({ email: email.toLowerCase().trim() });
    if (existingMember) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please log in instead.",
      });
    }

    // Password hashing
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const feeAmount = PLAN_CONFIG[cleanPlan].price;
    const durationDays = getPlanDurationDays(cleanPlan);
    const joinDate = new Date();
    const membershipEndDate = new Date(joinDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const member = await Member.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      address: address.trim(),
      passwordHash,
      plan: cleanPlan,
      feeAmount,
      joinDate,
      membershipEndDate,
      status: "pending", // Status is pending until first payment is confirmed
    });

    // Send registration welcome email
    sendRegistrationEmail(member).catch((err) =>
      console.warn("Could not dispatch welcome email:", err.message)
    );

    return sendTokenResponse(
      res,
      member,
      "member",
      201,
      "Registration successful! Your account is created with pending status until your initial payment."
    );
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during registration.",
      error: err.message,
    });
  }
};

// POST /api/member/login
export const loginMember = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    const member = await Member.findOne({ email: email.toLowerCase().trim() });
    if (!member) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, member.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (member.status === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Your membership account has been suspended. Please contact library administration.",
      });
    }

    return sendTokenResponse(res, member, "member", 200, "Welcome back to Shivaji Library!");
  } catch (err) {
    console.error("Member login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during member login.",
      error: err.message,
    });
  }
};

// POST /api/admin/login
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both username and password.",
      });
    }

    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    return sendTokenResponse(res, admin, "admin", 200, "Admin login authorized.");
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during admin login.",
      error: err.message,
    });
  }
};

// POST /api/member/logout or /api/admin/logout
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

// GET /api/member/me or /api/admin/me
export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    role: req.user.role,
    user: req.user.data,
  });
};
