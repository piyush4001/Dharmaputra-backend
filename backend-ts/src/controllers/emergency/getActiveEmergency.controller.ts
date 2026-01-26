import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { Emergency } from "../../models/Emergency.model";

export const getActiveEmergency = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const emergency = await Emergency.findOne({
      userId,
      status: "ACTIVE",
    });

    return res.status(200).json({
      emergency,
    });
  } catch (error) {
    console.error("Get emergency error:", error);
    return res.status(500).json({
      message: "Failed to fetch emergency",
    });
  }
};

// import { Response } from "express";
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
//     console.log(emergencies);

//     return res.json(emergencies);
//   } catch (error) {
//     console.error("getFamilyActiveEmergencies error:", error);
//     return res.status(500).json({
//       message: "Failed to fetch emergencies",
//     });
//   }
// };

