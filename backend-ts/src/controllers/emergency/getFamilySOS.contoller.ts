import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { Emergency } from "../../models/Emergency.model";
import { FamilyProfile } from "../../models/Role/FamilyProfile.model";

export const getFamilySOSAlerts = async (
  req: AuthRequest,
  res: Response
) => {
  const { userId } = req.auth!;

  const familyProfile = await FamilyProfile.findOne({ userId });

  if (!familyProfile || !familyProfile.seniorIds.length) {
    return res.json([]);
  }

  const sosList = await Emergency.find({
    userId: { $in: familyProfile.seniorIds },
    status: "ACTIVE",
  })
    .populate("userId", "firstName surname phone")
    .sort({ createdAt: -1 });

  res.json(sosList);
};
