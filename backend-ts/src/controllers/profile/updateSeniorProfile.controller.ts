import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { User } from "../../models/User.model";
import { SeniorProfile } from "../../models/Role/SeniorProfile.model";

export const updateSeniorProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.auth!;

    const {
      firstName,
      lastName,
      age,
      address,
      emergencyContact,
      medicalInfo,
    } = req.body;

    // 1️⃣ Update name fields in User model
    await User.findByIdAndUpdate(userId, {
      firstName,
      lastName,
    });

    // 2️⃣ Update senior profile
    const profile = await SeniorProfile.findOneAndUpdate(
      { user: userId },
      {
        age,
        address,
        emergencyContact,
        medicalInfo,
      },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Senior profile not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("updateSeniorProfile error:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};
