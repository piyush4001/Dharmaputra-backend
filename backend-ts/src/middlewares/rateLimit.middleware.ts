// Rate limiting middleware
import rateLimit from "express-rate-limit";

// General rate limiter
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests per IP
  message: {
    message: "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for sensitive routes (auth, panic)
export const strictRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // fewer requests allowed
  message: {
    message: "Too many attempts, please wait",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
