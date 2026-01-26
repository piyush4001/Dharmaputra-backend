import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { SeniorLinkRequest } from "../../models/SeniorLinkRequest.model";

export const getFamilyAlerts = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.auth!;

    const alerts = await SeniorLinkRequest.find({
      familyId: userId,
      status: { $in: ["APPROVED", "REJECTED"] },
      isDeletedByFamily: false,
    })
      .populate("seniorId", "firstName lastName phone")
      .sort({ updatedAt: -1 });

    return res.json(alerts);
  } catch (error) {
    console.error("getFamilyAlerts error:", error);
    return res.status(500).json({
      message: "Failed to fetch family alerts",
    });
  }
};
