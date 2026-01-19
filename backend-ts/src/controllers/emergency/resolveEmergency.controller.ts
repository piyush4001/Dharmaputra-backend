import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { Emergency } from "../../models/Emergency.model";
import { UserRole } from "../../models/User.model";

export const resolveEmergency = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    const role = req.auth?.role;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (![UserRole.SENIOR, UserRole.HELPER].includes(role as UserRole)) {
      return res.status(403).json({
        message: "Not allowed to resolve emergency",
      });
    }

    const emergency = await Emergency.findOne({
      userId,
      status: "ACTIVE",
    });

    if (!emergency) {
      return res.status(404).json({
        message: "No active emergency",
      });
    }

    emergency.status = "RESOLVED";
    emergency.resolvedAt = new Date();
    await emergency.save();

    return res.status(200).json({
      message: "Emergency resolved",
    });
  } catch (error) {
    console.error("Resolve emergency error:", error);
    return res.status(500).json({
      message: "Failed to resolve emergency",
    });
  }
};
