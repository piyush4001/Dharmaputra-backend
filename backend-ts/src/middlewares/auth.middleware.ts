import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AdminRole } from '../constants/roles';

export interface AuthPayload {
  userId: string;
  role?: string;
}

export interface AuthRequest extends Request {
  auth?: AuthPayload;
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;

    // ✅ attach to req.auth (NOT req.user)
    req.auth = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

/* =========================
   ADMIN AUTH
   ========================= */

export interface AdminJwtPayload {
  id: string;
  role: AdminRole;
}

export interface AdminAuthRequest extends Request {
  admin?: AdminJwtPayload;
}

export const requireAdminAuth = (
  req: AdminAuthRequest,
  res: Response,
  next: NextFunction,
): void | Response => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Admin authorization token missing',
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as AdminJwtPayload;

    // 🔒 Role validation
    if (!Object.values(AdminRole).includes(decoded.role)) {
      return res.status(403).json({
        message: 'Admin access required',
      });
    }

    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({
      message: 'Invalid or expired admin token',
    });
  }
};
