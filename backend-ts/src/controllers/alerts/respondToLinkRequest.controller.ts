
// import { Response } from "express";
// import { AuthRequest } from "../../middlewares/auth.middleware";
// import {
//   SeniorLinkRequest,
//   LinkRequestStatus,
// } from "../../models/SeniorLinkRequest.model";
// import { FamilyProfile } from "../../models/Role/FamilyProfile.model";
// import { SeniorProfile } from "../../models/Role/SeniorProfile.model";

// export const respondToLinkRequest = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {
//     const { userId } = req.auth!;
//     const { requestId, action } = req.body;

//     if (!requestId || !["APPROVE", "REJECT"].includes(action)) {
//       return res.status(400).json({ message: "Invalid request" });
//     }

//     // 1️⃣ Find pending request
//     const request = await SeniorLinkRequest.findOne({
//       _id: requestId,
//       seniorId: userId,
//       status: LinkRequestStatus.PENDING,
//     });

//     if (!request) {
//       return res.status(404).json({ message: "Request not found" });
//     }

//     // 2️⃣ Reject case
//     if (action === "REJECT") {
//       request.status = LinkRequestStatus.REJECTED;
//       await request.save();

//       return res.json({ message: "Request rejected" });
//     }

//     // 3️⃣ APPROVE CASE — FIX STARTS HERE

//     const familyProfile = await FamilyProfile.findOne({
//       userId: request.familyId,
//     });

//     if (!familyProfile) {
//       return res.status(404).json({ message: "Family profile not found" });
//     }

//     if (familyProfile.seniorIds.length >= 5) {
//       return res.status(400).json({
//         message: "You can link maximum 5 seniors",
//       });
//     }

//     const seniorProfile = await SeniorProfile.findOne({
//       user: request.seniorId,
//     });

//     if (!seniorProfile) {
//       return res.status(404).json({
//         message: "Senior profile not found",
//       });
//     }

//     // 🔒 Prevent duplicates
//     if (!familyProfile.seniorIds.includes(request.seniorId)) {
//       familyProfile.seniorIds.push(request.seniorId);
//     }
//     if(request.familyId === undefined || request.familyId === null) {
//       return res.status(400).json({
//         message: "Invalid family ID in request",
//       });
//     }
//     if (!seniorProfile.familyIds.includes(request.familyId)) {
//       seniorProfile.familyIds.push(request.familyId);
//     }

//     await Promise.all([
//       familyProfile.save(),
//       seniorProfile.save(),
//     ]);

//     request.status = LinkRequestStatus.APPROVED;
//     await request.save();

//     return res.json({
//       message: "Family linked successfully",
//     });
//   } catch (error) {
//     console.error("respondToLinkRequest error:", error);
//     return res.status(500).json({
//       message: "Failed to respond to request",
//     });
//   }
// };
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  SeniorLinkRequest,
  LinkRequestStatus,
  LinkRequestType,
} from "../../models/SeniorLinkRequest.model";
import { FamilyProfile } from "../../models/Role/FamilyProfile.model";
import { HelperProfile } from "../../models/Role/HelperProfile.model";
import { SeniorProfile } from "../../models/Role/SeniorProfile.model";

export const respondToLinkRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.auth!;
    const { requestId, action } = req.body;

    if (!requestId || !["APPROVE", "REJECT"].includes(action)) {
      return res.status(400).json({ message: "Invalid request" });
    }

    /* 1️⃣ Find pending request (senior only) */
    const request = await SeniorLinkRequest.findOne({
      _id: requestId,
      seniorId: userId,
      status: LinkRequestStatus.PENDING,
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    /* 2️⃣ REJECT */
    if (action === "REJECT") {
      request.status = LinkRequestStatus.REJECTED;
      await request.save();

      return res.json({ message: "Request rejected" });
    }

    /* ===================== APPROVE ===================== */

    const seniorProfile = await SeniorProfile.findOne({
      user: request.seniorId,
    });

    if (!seniorProfile) {
      return res.status(404).json({
        message: "Senior profile not found",
      });
    }

    /* =================================================== */
    /* ================= FAMILY APPROVAL ================= */
    /* =================================================== */

    if (request.requestType === LinkRequestType.FAMILY) {
      if (!request.familyId) {
        return res.status(400).json({
          message: "Invalid family request",
        });
      }

      const familyProfile = await FamilyProfile.findOne({
        userId: request.familyId,
      });

      if (!familyProfile) {
        return res.status(404).json({
          message: "Family profile not found",
        });
      }

      // 🔒 Max 5 seniors per family
      if (familyProfile.seniorIds.length >= 5) {
        return res.status(400).json({
          message: "Family can link maximum 5 seniors",
        });
      }

      // 🔗 Link both sides
      if (!familyProfile.seniorIds.includes(request.seniorId)) {
        familyProfile.seniorIds.push(request.seniorId);
      }

      if (!seniorProfile.familyIds.includes(request.familyId)) {
        seniorProfile.familyIds.push(request.familyId);
      }

      await Promise.all([
        familyProfile.save(),
        seniorProfile.save(),
      ]);

      request.status = LinkRequestStatus.APPROVED;
      await request.save();

      return res.json({
        message: "Family linked successfully",
      });
    }

    /* =================================================== */
    /* ================= HELPER APPROVAL ================= */
    /* =================================================== */

    if (request.requestType === LinkRequestType.HELPER) {
      if (!request.helperId) {
        return res.status(400).json({
          message: "Invalid helper request",
        });
      }

      const helperProfile = await HelperProfile.findOne({
        user: request.helperId,
      });

      if (!helperProfile) {
        return res.status(404).json({
          message: "Helper profile not found",
        });
      }

      // 🔒 Optional: max seniors per helper (example: 10)
      if (helperProfile.linkedSeniorIds.length >= 10) {
        return res.status(400).json({
          message: "Helper reached maximum linked seniors",
        });
      }

      // 🔗 Link both sides
      if (!helperProfile.linkedSeniorIds.includes(request.seniorId)) {
        helperProfile.linkedSeniorIds.push(request.seniorId);
      }

      if (!seniorProfile.helperIds.includes(request.helperId)) {
        seniorProfile.helperIds.push(request.helperId);
      }

      await Promise.all([
        helperProfile.save(),
        seniorProfile.save(),
      ]);

      request.status = LinkRequestStatus.APPROVED;
      await request.save();

      return res.json({
        message: "Helper linked successfully",
      });
    }

    /* =================================================== */

    return res.status(400).json({
      message: "Unsupported request type",
    });
  } catch (error) {
    console.error("respondToLinkRequest error:", error);
    return res.status(500).json({
      message: "Failed to respond to request",
    });
  }
};
