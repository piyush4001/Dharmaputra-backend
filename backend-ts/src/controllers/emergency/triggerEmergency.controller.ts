import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { Emergency } from "../../models/Emergency.model";
import { UserRole } from "../../models/User.model";

export const triggerEmergency = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    const role = req.auth?.role;
    const { location } = req.body;

    if (!userId || role !== UserRole.SENIOR) {
      return res.status(403).json({
        message: "Only seniors can trigger emergency",
      });
    }

    // Prevent multiple active emergencies
    const activeEmergency = await Emergency.findOne({
      userId,
      status: "ACTIVE",
    });

    if (activeEmergency) {
      return res.status(400).json({
        message: "Emergency already active",
      });
    }

    const emergency = await Emergency.create({
      userId,
      location,
      status: "ACTIVE",
      triggeredAt: new Date(),
    });

    // 🔔 Later: notify family & helpers

    return res.status(201).json({
      message: "Emergency triggered",
      emergency,
    });
  } catch (error) {
    console.error("Trigger emergency error:", error);
    return res.status(500).json({
      message: "Failed to trigger emergency",
    });
  }
};
