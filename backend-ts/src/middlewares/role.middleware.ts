import { Response, NextFunction } from "express";
import { AuthRequest, AdminAuthRequest } from "./auth.middleware";
import { AdminRole } from "../constants/roles";

/* =====================================================
   APP USER ROLE CHECK
   Uses: req.auth.role
   ===================================================== */

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.role || "")) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};

/* =====================================================
   ADMIN ROLE CHECK
   Uses: req.admin.role
   ===================================================== */

export const requireAdminRole = (roles: AdminRole[]) => {
  return (req: AdminAuthRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({
        message: "Admin authentication required",
      });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        message: "Admin access denied",
      });
    }

    next();
  };
};
