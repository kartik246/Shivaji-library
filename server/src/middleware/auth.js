import jwt from "jsonwebtoken";
import Member from "../models/Member.js";
import Admin from "../models/Admin.js";

const JWT_SECRET = process.env.JWT_SECRET || "shivaji_library_fallback_secret_key_2026";

export const verifyToken = async (req, res, next) => {
  let token = null;

  // 1. Check httpOnly cookie first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Fallback to Authorization Header
  else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Authentication token required.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role === "member") {
      const member = await Member.findById(decoded.id).select("-passwordHash");
      if (!member) {
        return res.status(401).json({ success: false, message: "Member account not found or deactivated." });
      }
      req.user = {
        id: member._id,
        role: "member",
        data: member,
      };
    } else if (decoded.role === "admin") {
      const admin = await Admin.findById(decoded.id).select("-passwordHash");
      if (!admin) {
        return res.status(401).json({ success: false, message: "Admin account not found or deactivated." });
      }
      req.user = {
        id: admin._id,
        role: "admin",
        data: admin,
      };
    } else {
      return res.status(403).json({ success: false, message: "Invalid user role." });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid token. Please log in again.",
      error: err.message,
    });
  }
};

export const isMember = (req, res, next) => {
  if (!req.user || req.user.role !== "member") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Member access required.",
    });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Admin access required.",
    });
  }
  next();
};
