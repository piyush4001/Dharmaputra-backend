import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { Emergency } from "../../models/Emergency.model";
import { HelperProfile } from "../../models/Role/HelperProfile.model";

export const getActiveEmergency = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔍 Find the senior's active emergency and populate who responded
    const emergencyDoc = await Emergency.findOne({
      userId,
      status: "ACTIVE",
    })
      .populate("respondedBy")
      .lean();

    // No active emergency – keep existing response contract
    if (!emergencyDoc) {
      return res.status(200).json({ emergency: null });
    }

    // Build responders array (currently max 1 helper)
    const responders: {
      _id: string;
      name: string;
      phone: string;
      profileImage?: string | null;
      role: string;
    }[] = [];

    const respondedBy: any = emergencyDoc.respondedBy;

    if (respondedBy && respondedBy._id) {
      // Try to enrich from HelperProfile
      const helperProfile = await HelperProfile.findOne({
        user: respondedBy._id,
      }).lean();

      responders.push({
        _id: String(respondedBy._id),
        name: helperProfile
          ? `${helperProfile.firstName} ${helperProfile.lastName}`
          : respondedBy.name || "Helper",
        phone: helperProfile?.phone || respondedBy.phone,
        profileImage: helperProfile?.profileImage ?? null,
        role: respondedBy.role || "HELPER",
      });
    }

    // Attach responders so frontend can render who responded
    return res.status(200).json({
      emergency: {
        ...emergencyDoc,
        responders,
      },
    });
  } catch (error) {
    console.error("Get emergency error:", error);
    return res.status(500).json({
      message: "Failed to fetch emergency",
    });
  }
};

// import { AuthRequest } from "../../middlewares/auth.middleware";
// import { Emergency } from "../../models/Emergency.model";
// import { Types } from "mongoose";

// export const getFamilyActiveEmergencies = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {
//     const { userId } = req.auth!;

//     const emergencies = await Emergency.aggregate([
//       {
//         $match: {
//           status: "ACTIVE",
//         },
//       },

//       // 🔗 join User
//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       { $unwind: "$user" },

//       // 🔗 join SeniorProfile using user._id
//       {
//         $lookup: {
//           from: "seniorprofiles",
//           localField: "user._id",
//           foreignField: "user",
//           as: "seniorProfile",
//         },
//       },
//       {
//         $unwind: {
//           path: "$seniorProfile",
//           preserveNullAndEmptyArrays: true,
//         },
//       },

//       // 🎯 shape response
//       {
//         $project: {
//           _id: 1,
//           status: 1,
//           triggerType: 1,
//           createdAt: 1,
//           "user.phone": 1,
//           "seniorProfile.firstName": 1,
//           "seniorProfile.lastName": 1,
//         },
//       },
//     ]);
//     //(emergencies);

//     return res.json(emergencies);
//   } catch (error) {
//     console.error("getFamilyActiveEmergencies error:", error);
//     return res.status(500).json({
//       message: "Failed to fetch emergencies",
//     });
//   }
// };

