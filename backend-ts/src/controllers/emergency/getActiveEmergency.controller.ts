import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { Emergency } from "../../models/Emergency.model";

export const getActiveEmergency = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const emergency = await Emergency.findOne({
      userId,
      status: "ACTIVE",
    });

    return res.status(200).json({
      emergency,
    });
  } catch (error) {
    console.error("Get emergency error:", error);
    return res.status(500).json({
      message: "Failed to fetch emergency",
    });
  }
};
