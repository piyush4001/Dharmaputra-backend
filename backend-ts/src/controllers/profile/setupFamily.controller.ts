import { Response } from "express";
import fs from "fs";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { FamilyProfile } from "../../models/Role/FamilyProfile.model";
import { User } from "../../models/User.model";
import { uploadImage } from "../../utils/cloudinary";

export const setupFamilyProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId, role } = req.auth!;

    // 🔐 Only family users can create profile
    // if (role !== "FAMILY" && role !== "family" ) {
    //   return res.status(403).json({
    //     message: "Only family users can create family profile",
    //   });
    // }
     if (role?.toLowerCase() !== "family") {
      return res.status(403).json({
        message: "Only family users can create family profile",
      });
    }


    const {
      firstName,
      lastName,
      address, // structured address object from frontend
    } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({
        message: "First name and last name are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Profile image is required",
      });
    }

    // 🚫 Prevent duplicate profile setup
    const existingProfile = await FamilyProfile.findOne({ userId });
    if (existingProfile) {
      return res.status(409).json({
        message: "Family profile already exists",
      });
    }

    // 📞 Phone from User (OTP source of truth)
    const user = await User.findById(userId).select("phone");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ☁️ Upload profile image
 let uploaded;
try {
  uploaded = await uploadImage(req.file.path);
} finally {
  if (req.file?.path && fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path);
  }
}



    /**
     * Address is OPTIONAL
     * Can come from:
     * - current location (lat/lng + reverse geocode)
     * - manual user input
     */
    const formattedAddress = address
  ? {
      fullAddress: address.fullAddress,
      city: address.city,
      district: address.district,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      ...(address.latitude != null &&
        address.longitude != null && {
          location: {
            type: "Point",
            coordinates: [address.longitude, address.latitude],
          },
        }),
    }
  : undefined;


    // ✅ Create family profile
    const profile = await FamilyProfile.create({
      userId,
      firstName,
      lastName,
      address: formattedAddress,
      phone: user.phone,
      profileImage: uploaded.secure_url,
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
