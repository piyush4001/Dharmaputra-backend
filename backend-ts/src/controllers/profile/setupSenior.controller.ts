import { Response } from "express";
import fs from "fs";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { SeniorProfile } from "../../models/Role/SeniorProfile.model";
import { User } from "../../models/User.model";
import { uploadImage } from "../../utils/cloudinary";

export const setupSeniorProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId, role } = req.auth!;

    // 🔐 Only seniors can create/update profile
    if (role !== "SENIOR") {
      return res.status(403).json({
        message: "Only seniors can create senior profile",
      });
    }

    const {
      firstName,
      lastName,
      age,
      address,
      emergencyContact,
      medicalInfo,
    } = req.body;

    const ageNumber = Number(age);

    if (!ageNumber || !address || String(address).trim() === "") {
      return res.status(400).json({
        message: "Age and address are required",
      });
    }

    // 📞 Get phone number from User (OTP source of truth)
    const user = await User.findById(userId).select("phone");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ☁️ Optional profile image upload
    let profileImage: string | undefined;
    if (req.file) {
      const uploaded = await uploadImage(req.file.path);
      fs.unlinkSync(req.file.path); // cleanup temp file
      profileImage = uploaded.secure_url;
    }

    // 🔁 Upsert senior profile
    const profile = await SeniorProfile.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        firstName,
        lastName,
        age: ageNumber,
        address,
        emergencyContact,
        medicalInfo,
        phone: user.phone, // ✅ injected automatically
        ...(profileImage && { profileImage }),
      },
      { upsert: true, new: true }
    );

    return res.json({
      message: "Senior profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error("setupSeniorProfile error:", error);
    return res.status(500).json({
      message: "Failed to setup senior profile",
    });
  }
};
