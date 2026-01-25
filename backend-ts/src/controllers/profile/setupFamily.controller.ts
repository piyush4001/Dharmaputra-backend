import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { FamilyProfile } from "../../models/Role/FamilyProfile.model";
import { User } from "../../models/User.model";

export const setupFamilyProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.auth!;
    const { firstName, lastName, address } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({
        message: "First name and last name are required",
      });
    }

    // 1️⃣ Check if family profile already exists
    const existingProfile = await FamilyProfile.findOne({ userId });
    if (existingProfile) {
      return res.status(409).json({
        message: "Family profile already exists",
      });
    }

    // 2️⃣ Get phone number from User (OTP login)
    const user = await User.findById(userId).select("phone");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3️⃣ Create family profile
    const profile = await FamilyProfile.create({
      userId,
      firstName,
      lastName,
      address,
      phone: user.phone,
      seniorIds: [],
    });

    return res.status(201).json({
      message: "Family profile created successfully",
      profile,
    });
  } catch (error) {
    console.error("setupFamilyProfile error:", error);
    return res.status(500).json({
      message: "Failed to setup family profile",
    });
  }
};
