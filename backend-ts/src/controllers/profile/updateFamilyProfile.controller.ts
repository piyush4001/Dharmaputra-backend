import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { FamilyProfile } from "../../models/Role/FamilyProfile.model";

export const updateFamilyProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.auth!;
    const { firstName, lastName, address } = req.body;

    const profile = await FamilyProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Family profile not found" });
    }

    if (firstName !== undefined) profile.firstName = firstName;
    if (lastName !== undefined) profile.lastName = lastName;
    if (address !== undefined) profile.address = address;

    await profile.save();

    return res.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("updateFamilyProfile error:", error);
    return res.status(500).json({
      message: "Failed to update profile",
    });
  }
};
