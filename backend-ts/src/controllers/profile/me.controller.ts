import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { User } from "../../models/User.model";
import { SeniorProfile } from "../../models/Role/SeniorProfile.model";
import { FamilyProfile } from "../../models/Role/FamilyProfile.model";
import { HelperProfile } from "../../models/Role/HelperProfile.model";

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    console.log("AUTH OBJECT:", req.auth);
    console.log("USER ID:", req.auth?.userId);

    const { userId } = req.auth!;

    const user = await User.findById(userId).select("role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let profile = null;

    if (user.role === "SENIOR") {
      profile = await SeniorProfile.findOne({ user: userId });
    } else if (user.role === "FAMILY") {
      profile = await FamilyProfile.findOne({ user: userId });
    } else if (user.role === "HELPER") {
      profile = await HelperProfile.findOne({ user: userId });
    }
    if (!profile) {
      return res.status(200).json({
        role : user.role,
        message: "Profile not set up yet",
      });
    }
    return res.status(200).json(profile);
  } catch (error) {
    console.error("getMyProfile error:", error);
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
};
