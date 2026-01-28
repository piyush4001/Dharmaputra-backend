import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../../models/admin.model';

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find admin in DB
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // 2️⃣ Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({
        message: 'Admin account is deactivated',
      });
    }

    // 3️⃣ Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // 4️⃣ Sign JWT using ROLE FROM DATABASE
    const token = jwt.sign(
      {
        id: admin._id.toString(),
        role: admin.role, // ✅ CRITICAL FIX
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' },
    );

    // 5️⃣ Respond
    return res.status(200).json({
      token,
      role: admin.role, // ✅ CRITICAL FIX
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
