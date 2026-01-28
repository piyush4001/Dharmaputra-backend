import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { SeniorLinkRequest } from "../../models/SeniorLinkRequest.model";

export const getSeniorLinkRequests = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.auth!;

    const requests = await SeniorLinkRequest.find({
      seniorId: userId,
      status: "PENDING",
    }).sort({ createdAt: -1 });

    return res.json(requests);
  } catch (error) {
    console.error("getSeniorLinkRequests error:", error);
    return res.status(500).json({
      message: "Failed to fetch requests",
    });
  }
};
