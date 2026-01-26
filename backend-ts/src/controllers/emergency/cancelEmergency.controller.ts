import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { Emergency } from "../../models/Emergency.model";
import { UserRole } from "../../models/User.model";

export const cancelEmergency = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    const role = req.auth?.role;

    if (!userId || role !== UserRole.SENIOR) {
      return res.status(403).json({
        message: "Only senior can cancel emergency",
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

    emergency.status = "CANCELLED";
    emergency.resolvedAt = new Date();
    await emergency.save();

    return res.status(200).json({
      message: "Emergency cancelled",
    });
  } catch (error) {
    console.error("Cancel emergency error:", error);
    return res.status(500).json({
      message: "Failed to cancel emergency",
    });
  }
};
