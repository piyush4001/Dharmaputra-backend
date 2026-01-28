import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { SeniorProfile } from "../../models/Role/SeniorProfile.model";
import { FamilyProfile } from "../../models/Role/FamilyProfile.model";
import { HelperProfile } from "../../models/Role/HelperProfile.model";

export const getSeniorLinkedMembers = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.auth!;

    // 1️⃣ Find senior profile
    const seniorProfile = await SeniorProfile.findOne({ user: userId });

    if (!seniorProfile) {
      return res.status(404).json({
        message: "Senior profile not found. Please complete senior setup first.",
      });
    }

    const familyIds = seniorProfile.familyIds || [];
    const helperIds = seniorProfile.helperIds || [];
    console.log(helperIds);
    if (familyIds.length === 0 && helperIds.length === 0) {
      return res.json([]);
    }

    // 2️⃣ Fetch family & helper profiles in parallel
    const [familyProfiles, helperProfiles] = await Promise.all([
      familyIds.length
        ? FamilyProfile.find({ userId: { $in: familyIds } }).lean()
        : [],
      helperIds.length
        ? HelperProfile.find({ user: { $in: helperIds } }).lean()
        : [],
    ]);

    console.log(helperProfiles);

    // 3️⃣ Normalize response
    const familyMembers = familyProfiles.map((f) => ({
      _id: f.userId,
      firstName: f.firstName,
      lastName: f.lastName,
      phone: f.phone || "",
      role: "FAMILY",
    }));

    const helpers = helperProfiles.map((h) => ({
      _id: h.user,
      firstName: h.firstName,
      lastName: h.lastName,
      phone: h.phone || "",
      role: "HELPER",
    }));

    const linkedUsers = [...familyMembers, ...helpers];

    console.log("Linked members found:", linkedUsers);

    return res.json(linkedUsers);
  } catch (error) {
    console.error("getSeniorLinkedMembers error:", error);
    return res.status(500).json({
      message: "Failed to fetch linked members",
    });
  }
};
