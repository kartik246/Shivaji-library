import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";
import Member from "../models/Member.js";
import Payment from "../models/Payment.js";
import Book from "../models/Book.js";

dotenv.config();

const sampleBooks = [
  {
    title: "Indian Polity (7th Edition)",
    author: "M. Laxmikanth",
    genre: "UPSC / Civil Services",
    coverImageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80",
    available: true,
    isbn: "978-9355325853",
    description: "The must-read standard reference bible for Indian Constitution and Governance.",
  },
  {
    title: "India's Ancient Past",
    author: "R.S. Sharma",
    genre: "History & Culture",
    coverImageUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=400&q=80",
    available: true,
    isbn: "978-0195687859",
    description: "A comprehensive exploration of ancient Indian history and societal evolutions.",
  },
  {
    title: "Concepts of Physics (Vol 1 & 2)",
    author: "Dr. H.C. Verma",
    genre: "Engineering / JEE",
    coverImageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80",
    available: true,
    isbn: "978-8177091878",
    description: "Foundational conceptual physics for high school and competitive engineering aspirants.",
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    genre: "Science & Cosmology",
    coverImageUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80",
    available: true,
    isbn: "978-0553380163",
    description: "From the Big Bang to black holes, exploring space, time, and gravity.",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help & Productivity",
    coverImageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
    available: true,
    isbn: "978-0735211292",
    description: "An easy and proven way to build good habits, break bad ones, and achieve your goals.",
  },
  {
    title: "Wings of Fire",
    author: "Dr. A.P.J. Abdul Kalam",
    genre: "Biography",
    coverImageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80",
    available: true,
    isbn: "978-8173711463",
    description: "Inspirational autobiography of India's Missile Man and visionary President.",
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    genre: "Finance & Economics",
    coverImageUrl: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=400&q=80",
    available: true,
    isbn: "978-9390166268",
    description: "Timeless lessons on wealth, greed, and happiness for students and professionals.",
  },
  {
    title: "Quantitative Aptitude for Competitive Examinations",
    author: "Dr. R.S. Aggarwal",
    genre: "Competitive Exams / SSC / Banking",
    coverImageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=400&q=80",
    available: true,
    isbn: "978-9352534029",
    description: "Essential guide for mathematical problem solving and aptitude tests.",
  },
];

export const seedAllData = async () => {
  try {
    await connectDB();
    console.log("🌱 Starting database seeding...");

    // 1. Seed Admin
    const existingAdmin = await Admin.findOne({ username: "admin" });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash("Admin@123", salt);
      await Admin.create({
        username: "admin",
        passwordHash,
        role: "owner",
        name: "Chief Librarian",
        email: "admin@shivajilibrary.com",
      });
      console.log("✅ Admin account created: admin / Admin@123");
    }

    // 2. Seed Books
    const bookCount = await Book.countDocuments();
    if (bookCount === 0) {
      await Book.insertMany(sampleBooks);
      console.log(`✅ Seeded ${sampleBooks.length} books in catalog.`);
    }

    // 3. Seed Sample Members if empty
    const memberCount = await Member.countDocuments();
    if (memberCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const memberPassword = await bcrypt.hash("Member@123", salt);

      const now = new Date();

      const membersData = [
        {
          name: "Rohan Sharma",
          email: "rohan@example.com",
          phone: "+91 98765 43210",
          address: "Block FC-12, Shivaji Enclave, New Delhi",
          passwordHash: memberPassword,
          plan: "monthly",
          feeAmount: 800,
          joinDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
          membershipEndDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // active
          status: "active",
        },
        {
          name: "Pooja Verma",
          email: "pooja@example.com",
          phone: "+91 98111 22334",
          address: "Tagore Garden Ext, New Delhi 110027",
          passwordHash: memberPassword,
          plan: "quarterly",
          feeAmount: 2200,
          joinDate: new Date(now.getTime() - 86 * 24 * 60 * 60 * 1000),
          membershipEndDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), // expiring in 4 days!
          status: "expiring",
        },
        {
          name: "Amanpreet Singh",
          email: "aman@example.com",
          phone: "+91 99998 87766",
          address: "Near Gurudwara Mehta Chowk, New Delhi",
          passwordHash: memberPassword,
          plan: "monthly",
          feeAmount: 800,
          joinDate: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
          membershipEndDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // expired 5 days ago
          status: "expired",
        },
        {
          name: "Simran Kaur",
          email: "simran@example.com",
          phone: "+91 97112 34567",
          address: "Plot 42, Rajouri Garden, New Delhi",
          passwordHash: memberPassword,
          plan: "yearly",
          feeAmount: 8000,
          joinDate: now,
          membershipEndDate: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
          status: "pending", // pending initial payment
        },
      ];

      const createdMembers = await Member.insertMany(membersData);
      console.log(`✅ Seeded ${createdMembers.length} sample members.`);

      // Seed payments for Rohan and Pooja
      await Payment.create({
        memberId: createdMembers[0]._id,
        amount: 800,
        paidOn: createdMembers[0].joinDate,
        method: "online",
        periodStart: createdMembers[0].joinDate,
        periodEnd: createdMembers[0].membershipEndDate,
        transactionId: "TXN-DEMO-ROHAN01",
        notes: "Online UPI payment on registration",
      });

      await Payment.create({
        memberId: createdMembers[1]._id,
        amount: 2200,
        paidOn: createdMembers[1].joinDate,
        method: "cash",
        periodStart: createdMembers[1].joinDate,
        periodEnd: createdMembers[1].membershipEndDate,
        transactionId: "REC-CASH-POOJA",
        notes: "Paid cash at library reception desk",
      });

      console.log("✅ Seeded initial payment logs.");
    }

    console.log("🎉 All sample data seeded successfully!");
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  }
};

if (process.argv[1]?.endsWith("seedData.js")) {
  seedAllData().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}
