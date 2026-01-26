// Error handling middleware
import { Request, Response, NextFunction } from "express";

// Global error handler
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error (can be replaced with logger later)
  console.error(err);

  // Default values
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};
