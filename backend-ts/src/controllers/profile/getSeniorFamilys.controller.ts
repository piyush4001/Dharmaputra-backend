import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { SeniorProfile } from "../../models/Role/SeniorProfile.model";
import { FamilyProfile } from "../../models/Role/FamilyProfile.model";

export const getSeniorFamilyMembers = async (
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

    if (!seniorProfile.familyIds || seniorProfile.familyIds.length === 0) {
      return res.json([]);
    }

    // 2️⃣ Fetch family profiles (NOT User)
    const familyProfiles = await FamilyProfile.find({
      userId: { $in: seniorProfile.familyIds },
    }).lean();

    // 3️⃣ Normalize response for frontend
    const familyMembers = familyProfiles.map((f) => ({
      _id: f.userId,
      firstName: f.firstName,
      lastName: f.lastName,
      phone: f.phone || "",
    }));
    console.log("Family members found:", familyMembers);
    return res.json(familyMembers);
  } catch (error) {
    console.error("getSeniorFamilyMembers error:", error);
    return res.status(500).json({
      message: "Failed to fetch family members",
    });
  }
};
// import { Response } from "express";
// import { AuthRequest } from "../../middlewares/auth.middleware";
// import { SeniorProfile } from "../../models/Role/SeniorProfile.model";
// import { FamilyProfile } from "../../models/Role/FamilyProfile.model";

// export const getSeniorFamilyMembers = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {
//     const { userId } = req.auth!;

//     const seniorProfile = await SeniorProfile.findOne({ user: userId });

//     if (!seniorProfile) {
//       return res.status(404).json({
//         message: "Senior profile not found",
//       });
//     }

//     if (!seniorProfile.familyIds.length) {
//       return res.json([]);
//     }

//     const familyProfiles = await FamilyProfile.find(
//       { userId: { $in: seniorProfile.familyIds } },
//       "firstName lastName phone userId"
//     );

//     const formatted = familyProfiles.map((f) => ({
//       _id: f.userId,
//       firstName: f.firstName,
//       lastName: f.lastName,
//       phone: f.phone,
//     }));

//     return res.json(formatted);
//   } catch (error) {
//     console.error("getSeniorFamilyMembers error:", error);
//     return res.status(500).json({ message: "Failed to fetch family" });
//   }
// };
