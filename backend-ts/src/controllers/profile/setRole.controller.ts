import { Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { User, UserRole } from "../../models/User.model";

export const setRole = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    const { userId } = req.auth!;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const normalizedRole = role.toUpperCase();

    // ✅ Whitelist roles
    if (!Object.values(UserRole).includes(normalizedRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: normalizedRole },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Setting role for user:", userId, normalizedRole);

    // Generate new token with updated role
    const newToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    return res.json({
      message: "Role updated",
      role: user.role,
      token: newToken,
    });
  } catch (error) {
    console.error("setRole error:", error);
    return res.status(500).json({ message: "Failed to set role" });
  }
};
