import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AdminRole } from '../constants/roles';

export interface AuthPayload {
  userId: string;
  role?: string;
}

export interface AuthRequest extends Request {
  auth?: AuthPayload;
  file?: Express.Multer.File;
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authorization token missing',
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;

    // ✅ attach to req.auth (NOT req.user)
    req.auth = decoded;

    next();
    console.log('AUTH HEADER:', req.headers.authorization);
    console.log('AUTH USER:', req.auth);
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token',
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

// export const requireAdminAuth = (
//   req: AdminAuthRequest,
//   res: Response,
//   next: NextFunction,
// ): void | Response => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({
//         message: 'Admin authorization token missing',
//       });
//     }

//     const token = authHeader.split(' ')[1];

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET as string,
//     ) as AdminJwtPayload;

//     // 🔒 Role validation
//     if (!Object.values(AdminRole).includes(decoded.role)) {
//       return res.status(403).json({
//         message: 'Admin access required',
//       });
//     }

//     req.admin = decoded;
//     next();
//   } catch {
//     return res.status(401).json({
//       message: 'Invalid or expired admin token',
//     });
//   }
// };

export const requireAdminAuth = (
  req: AdminAuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log('🔐 ADMIN AUTH HEADER:', req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Missing or invalid auth header');
      return res
        .status(401)
        .json({ message: 'Admin authorization token missing' });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔑 ADMIN TOKEN:', token);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as AdminJwtPayload;

    console.log('✅ ADMIN DECODED:', decoded);

    if (!Object.values(AdminRole).includes(decoded.role)) {
      console.log('❌ ROLE CHECK FAILED:', decoded.role);
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    console.error('❌ ADMIN AUTH VERIFY FAILED:', err);
    return res.status(401).json({ message: 'Invalid or expired admin token' });
  }
};
