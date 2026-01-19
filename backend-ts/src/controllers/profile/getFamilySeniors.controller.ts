import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { FamilyProfile } from "../../models/Role/FamilyProfile.model";

export const getFamilySeniors = async (
  req: AuthRequest,
  res: Response
) => {
  const { userId } = req.auth!;

  const profile = await FamilyProfile.findOne({ userId }).populate(
    "seniorIds",
    "firstName surname phone"
  );

  if (!profile) {
    return res.status(404).json({
      message: "Family profile not found",
    });
  }

  return res.json(profile.seniorIds);
};
