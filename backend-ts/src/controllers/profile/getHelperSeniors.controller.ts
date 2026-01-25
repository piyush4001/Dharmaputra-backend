// src/controllers/profile/getHelperSeniors.controller.ts
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { HelperProfile } from "../../models/Role/HelperProfile.model";
import { SeniorProfile } from "../../models/Role/SeniorProfile.model";

export const getHelperLinkedSeniors = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.auth!;
    console.log("AUTH HELPER USER ID:", userId);

    // 1️⃣ Find helper profile
    const profile = await HelperProfile.findOne({ userId }).populate(
      "linkedSeniorIds",
      "phone"
    );

    console.log("HELPER PROFILE:", profile);

    if (!profile) {
      return res.status(404).json({
        message: "Helper profile not found",
      });
    }

    // 2️⃣ Fetch senior profile data (same pattern as family)
    const seniors = await Promise.all(
      profile.linkedSeniorIds.map(async (seniorUser: any) => {
        console.log(
          "Looking up SeniorProfile for user:",
          seniorUser._id
        );

        const seniorProfile = await SeniorProfile.findOne({
          user: seniorUser._id,
        });

        console.log("SeniorProfile found:", seniorProfile);

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

    console.log("POPULATED HELPER SENIORS:", seniors);

    return res.json(seniors);
  } catch (error) {
    console.error("getHelperLinkedSeniors error:", error);
    return res.status(500).json({
      message: "Failed to fetch linked seniors",
    });
  }
};
