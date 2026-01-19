// JWT utilities
import jwt from "jsonwebtoken";
import { env } from "../config/env";

// Generate access token
export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
};

// Generate refresh token
export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};
