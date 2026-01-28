// import { Response } from "express";
// import { AuthRequest } from "../../middlewares/auth.middleware";
// import { FamilyProfile } from "../../models/Role/FamilyProfile.model";
// import { SeniorProfile } from "../../models/Role/SeniorProfile.model";
// import mongoose from "mongoose";

// export const unlinkSenior = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {
//     const { userId, role } = req.auth!;
//     const { targetUserId } = req.body;

//     console.log("---- UNLINK DEBUG START ----");
//     console.log("Auth userId:", userId);
//     console.log("Auth role:", role);
//     console.log("Target userId:", targetUserId);

//     // Validate input
//     if (!targetUserId) {
//       return res.status(400).json({ message: "targetUserId is required" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid user ID" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
//       return res.status(400).json({ message: "Invalid target user ID" });
//     }

//     const userObjectId = new mongoose.Types.ObjectId(userId);
//     const targetObjectId = new mongoose.Types.ObjectId(targetUserId);

//     let seniorRes, familyRes;

//     if (role === "SENIOR") {
//       // Senior is unlinking a family member
//       seniorRes = await SeniorProfile.updateOne(
//         { user: userObjectId },
//         { $pull: { familyIds: targetObjectId } }
//       );

//       familyRes = await FamilyProfile.updateOne(
//         { userId: targetObjectId },
//         { $pull: { seniorIds: userObjectId } }
//       );

//       console.log("Senior update result:", seniorRes);
//       console.log("Family update result:", familyRes);

//       if (seniorRes.modifiedCount === 0) {
//         console.warn("Warning: Senior profile not found or no match updated");
//       }
//       if (familyRes.modifiedCount === 0) {
//         console.warn("Warning: Family profile not found or no match updated");
//       }
//     } else if (role === "FAMILY") {
//       // Family member is unlinking a senior
//       familyRes = await FamilyProfile.updateOne(
//         { userId: userObjectId },
//         { $pull: { seniorIds: targetObjectId } }
//       );

//       seniorRes = await SeniorProfile.updateOne(
//         { user: targetObjectId },
//         { $pull: { familyIds: userObjectId } }
//       );

//       console.log("Family update result:", familyRes);
//       console.log("Senior update result:", seniorRes);

//       if (familyRes.modifiedCount === 0) {
//         console.warn("Warning: Family profile not found or no match updated");
//       }
//       if (seniorRes.modifiedCount === 0) {
//         console.warn("Warning: Senior profile not found or no match updated");
//       }
//     } else {
//       return res.status(403).json({ message: "Unauthorized role" });
//     }

//     console.log("---- UNLINK DEBUG END ----");

//     return res.json({ message: "Unlinked successfully" });
//   } catch (error) {
//     console.error("unlinkSenior error:", error);
//     return res.status(500).json({ message: "Failed to unlink" });
//   }
// };
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { FamilyProfile } from "../../models/Role/FamilyProfile.model";
import { SeniorProfile } from "../../models/Role/SeniorProfile.model";
import { HelperProfile } from "../../models/Role/HelperProfile.model";
import mongoose from "mongoose";

export const unlinkSenior = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId, role } = req.auth!;
    const { targetUserId } = req.body;

    /* ---------------- VALIDATION ---------------- */
    if (!targetUserId) {
      return res.status(400).json({ message: "targetUserId is required" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(targetUserId)
    ) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const targetObjectId = new mongoose.Types.ObjectId(targetUserId);

    /* ---------------- ROLE LOGIC ---------------- */

    // 🔹 SENIOR unlinking someone
    if (role === "SENIOR") {
      // 1️⃣ Try unlink FAMILY
      await SeniorProfile.updateOne(
        { user: userObjectId },
        { $pull: { familyIds: targetObjectId, helperIds: targetObjectId } }
      );

      // Remove senior from family
      await FamilyProfile.updateOne(
        { userId: targetObjectId },
        { $pull: { seniorIds: userObjectId } }
      );

      // Remove senior from helper
      await HelperProfile.updateOne(
        { user: targetObjectId },
        { $pull: { linkedSeniorIds: userObjectId } }
      );
    }

    // 🔹 FAMILY unlinking SENIOR (existing behavior)
    else if (role === "FAMILY") {
      await FamilyProfile.updateOne(
        { userId: userObjectId },
        { $pull: { seniorIds: targetObjectId } }
      );

      await SeniorProfile.updateOne(
        { user: targetObjectId },
        { $pull: { familyIds: userObjectId } }
      );
    }

    // 🔹 HELPER unlinking SENIOR (🆕)
    else if (role === "HELPER") {
      await HelperProfile.updateOne(
        { user: userObjectId },
        { $pull: { linkedSeniorIds: targetObjectId } }
      );

      await SeniorProfile.updateOne(
        { user: targetObjectId },
        { $pull: { helperIds: userObjectId } }
      );
    }

    else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    return res.json({ message: "Unlinked successfully" });
  } catch (error) {
    console.error("unlinkSenior error:", error);
    return res.status(500).json({ message: "Failed to unlink" });
  }
};
