// Environment configuration
import dotenv from "dotenv";

// Load variables from .env file
dotenv.config();

// Environment variables object
export const env = {
  PORT: process.env.PORT || "5000",

  MONGO_URI: process.env.MONGO_URI as string,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  JWT_ACCESS_EXPIRATION_MINUTES:
    process.env.JWT_ACCESS_EXPIRATION_MINUTES || "15",
  JWT_REFRESH_EXPIRATION_DAYS: process.env.JWT_REFRESH_EXPIRATION_DAYS || "30",
  NODE_ENV: process.env.NODE_ENV || "development",
};

// Validate required variables
const requiredVars = ["MONGO_URI", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];

requiredVars.forEach((key) => {
  if (!env[key as keyof typeof env]) {
    throw new Error(`Environment variable ${key} is missing`);
  }
});
