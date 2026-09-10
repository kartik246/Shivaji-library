import mongoose from "mongoose";
import dns from "node:dns";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (e) {
  // ignore
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn("⚠️ MONGO_URI is not defined in environment variables!");
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    // Auto-retry after 5 seconds instead of process.exit(1)
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;