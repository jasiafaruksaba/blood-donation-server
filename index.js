import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Import Routes
import userRoutes from "./routes/users.js";
import donationRoutes from "./routes/donationRequests.js";
import paymentRoutes from "./routes/payments.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

// Routes
app.use("/users", userRoutes);
app.use("/donation-requests", donationRoutes);
app.use("/payments", paymentRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 LifeDrop Blood Donation Server is Running...");
});

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
};

startServer();