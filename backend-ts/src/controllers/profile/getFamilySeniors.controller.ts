import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { FamilyProfile } from "../../models/Role/FamilyProfile.model";
import { SeniorProfile } from "../../models/Role/SeniorProfile.model";

export const getFamilySeniors = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.auth!;
    console.log("AUTH USER ID:", userId);

    const profile = await FamilyProfile.findOne({ userId }).populate(
      "seniorIds",
      "phone"
    );

    console.log("FAMILY PROFILE:", profile);

    if (!profile) {
      return res.status(404).json({
        message: "Family profile not found",
      });
    }

    // Get senior profile details for each linked senior
    const seniors = await Promise.all(
      profile.seniorIds.map(async (seniorUserId: any) => {
        console.log("Looking up SeniorProfile for user:", seniorUserId._id);
        const seniorProfile = await SeniorProfile.findOne({
          user: seniorUserId._id,
        });
        console.log("SeniorProfile found:", seniorProfile);
        return {
          _id: seniorUserId._id,
          phone: seniorUserId.phone,
          firstName: seniorProfile?.firstName || "Senior",
          lastName: seniorProfile?.lastName || "",
          age: seniorProfile?.age,
          address: seniorProfile?.address,
          medicalInfo: seniorProfile?.medicalInfo,
        };
      })
    );

    console.log("POPULATED SENIORS:", seniors);

    return res.json(seniors);
  } catch (error) {
    console.error("getFamilySeniors error:", error);
    return res.status(500).json({
      message: "Failed to fetch seniors",
    });
  }
};
