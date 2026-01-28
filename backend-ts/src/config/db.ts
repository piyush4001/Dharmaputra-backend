// Database configuration
import mongoose from "mongoose";
// Environment configuration
import dotenv from "dotenv";

// Load variables from .env file
dotenv.config();

// MongoDB connection string from .env
const MONGO_URI = process.env.MONGO_URI as string;

// Stop app if DB URL is missing
if (!MONGO_URI) {
  throw new Error("MONGO_URI not found in environment variables");
}

// Function to connect database
export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    //("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // stop app if DB fails
  }
};

// Log when DB disconnects
mongoose.connection.on("disconnected", () => {
  //("MongoDB disconnected");
});

// Log DB errors
mongoose.connection.on("error", (error) => {
  console.error("MongoDB error:", error);
});
