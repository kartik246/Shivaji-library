import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";

dotenv.config();

export const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("ℹ️ Default admin account 'admin' already exists.");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("Admin@123", salt);

    const admin = await Admin.create({
      username: "admin",
      passwordHash,
      role: "owner",
      name: "Shivaji Library Owner",
      email: "admin@shivajilibrary.com",
    });

    console.log("=========================================");
    console.log("✅ Default admin created successfully!");
    console.log("   Username: admin");
    console.log("   Password: Admin@123");
    console.log("   Role: owner");
    console.log("=========================================");
  } catch (err) {
    console.error("❌ Failed to seed admin:", err.message);
  }
};

// If run directly
if (process.argv[1]?.endsWith("seedAdmin.js")) {
  seedAdmin().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}
