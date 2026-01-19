import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  SeniorLinkRequest,
  LinkRequestStatus,
} from "../../models/SeniorLinkRequest.model";
import { FamilyProfile } from "../../models/Role/FamilyProfile.model";

export const respondToLinkRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.auth!;
    const { requestId, action } = req.body;

    if (!requestId || !["APPROVE", "REJECT"].includes(action)) {
      return res.status(400).json({
        message: "Invalid request",
      });
    }

    // 1️⃣ Find request
    const request = await SeniorLinkRequest.findOne({
      _id: requestId,
      seniorId: userId,
      status: LinkRequestStatus.PENDING,
    });

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    // 2️⃣ Reject case
    if (action === "REJECT") {
      request.status = LinkRequestStatus.REJECTED;
      await request.save();

      return res.json({
        message: "Request rejected",
      });
    }

    // 3️⃣ Approve case
   const familyProfile = await FamilyProfile.findOne({
  userId: request.familyId,
});

if (!familyProfile) {
  return res.status(404).json({ message: "Family profile not found" });
}

if (familyProfile.seniorIds.length >= 5) {
  return res.status(400).json({
    message: "You can link maximum 5 seniors",
  });
}

familyProfile.seniorIds.push(request.seniorId);
await familyProfile.save();


    request.status = LinkRequestStatus.APPROVED;
    await request.save();

    return res.json({
      message: "Senior linked successfully",
    });
  } catch (error) {
    console.error("respondToLinkRequest error:", error);
    return res.status(500).json({
      message: "Failed to respond to request",
    });
  }
};
