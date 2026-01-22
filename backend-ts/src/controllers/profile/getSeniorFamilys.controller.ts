import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { SeniorProfile } from "../../models/Role/SeniorProfile.model";
import { User } from "../../models/User.model";

export const getSeniorFamilyMembers = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.auth!;

    console.log(`[getSeniorFamilyMembers] Fetching family for user: ${userId}`);

    // 1. Find senior profile
    const seniorProfile = await SeniorProfile.findOne({ user: userId });

    if (!seniorProfile) {
      console.log(`[getSeniorFamilyMembers] No senior profile found for user: ${userId}`);
      return res.status(404).json({
        message: "Senior profile not found. Please complete senior setup first.",
      });
    }

    if (!seniorProfile.familyIds?.length) {
      console.log(`[getSeniorFamilyMembers] No family linked for senior: ${userId}`);
      return res.json([]); // no family linked yet
    }

    console.log(`[getSeniorFamilyMembers] Found ${seniorProfile.familyIds.length} family members`);

    // 2. Fetch family user details
    const familyMembers = await User.find(
      { _id: { $in: seniorProfile.familyIds } },
      "firstName surname phone"
    );

    console.log(`[getSeniorFamilyMembers] Returning ${familyMembers.length} family members`);
    return res.json(familyMembers);
  } catch (error) {
    console.error("getSeniorFamilyMembers error:", error);
    return res.status(500).json({
      message: "Failed to fetch family members",
      error: process.env.NODE_ENV === "development" ? String(error) : undefined,
    });
  }
};
