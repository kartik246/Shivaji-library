import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "shivaji_library_fallback_secret_key_2026";
const JWT_EXPIRES_IN = "7d";

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const sendTokenResponse = (res, user, role, statusCode = 200, message = "Success") => {
  const payload = {
    id: user._id,
    role: role,
    email: user.email || user.username,
  };

  const token = generateToken(payload);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  // Set httpOnly cookie
  res.cookie("token", token, cookieOptions);

  // Return clean sanitized user data (no passwordHash)
  const userData = user.toObject ? user.toObject() : { ...user };
  delete userData.passwordHash;

  return res.status(statusCode).json({
    success: true,
    message,
    token, // Also provided in JSON for clients that want dual-mode header storage
    role,
    user: userData,
  });
};
