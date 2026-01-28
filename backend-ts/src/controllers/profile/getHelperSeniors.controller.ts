// src/controllers/profile/getHelperSeniors.controller.ts
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { HelperProfile } from "../../models/Role/HelperProfile.model";
import { SeniorProfile } from "../../models/Role/SeniorProfile.model";
import { Types } from "mongoose";

export const getHelperLinkedSeniors = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.auth!;
    //("AUTH HELPER USER ID:", userId);

    // ✅ FIX: use `user`, not `userId`
    const profile = await HelperProfile.findOne({
      user: new Types.ObjectId(userId),
    }).populate("linkedSeniorIds", "phone");

    //("HELPER PROFILE:", profile);

    if (!profile) {
      return res.status(404).json({
        message: "Helper profile not found",
      });
    }

    const seniors = await Promise.all(
      profile.linkedSeniorIds.map(async (seniorUser: any) => {
        const seniorProfile = await SeniorProfile.findOne({
          user: seniorUser._id,
        });

        return {
          _id: seniorUser._id,
          phone: seniorUser.phone,
          firstName: seniorProfile?.firstName || "Senior",
          lastName: seniorProfile?.lastName || "",
          age: seniorProfile?.age,
          address: seniorProfile?.address,
          medicalInfo: seniorProfile?.medicalInfo,
        };
      })
    );

    return res.json(seniors);
  } catch (error) {
    console.error("getHelperLinkedSeniors error:", error);
    return res.status(500).json({
      message: "Failed to fetch linked seniors",
    });
  }
};
