import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { Emergency } from "../../models/Emergency.model";

export const getFamilyActiveEmergencies = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const emergencies = await Emergency.aggregate([
      { $match: { status: "ACTIVE" } },

      // 🔗 User (phone)
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      // 🔗 SeniorProfile (name)
      {
        $lookup: {
          from: "seniorprofiles",
          localField: "user._id",
          foreignField: "user",
          as: "seniorProfile",
        },
      },
      {
        $unwind: {
          path: "$seniorProfile",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 🎯 Final response shape
      {
        $project: {
          _id: 1,
          triggerType: 1,
          status: 1,
          triggeredAt: 1,
          "user.phone": 1,
          "seniorProfile.firstName": 1,
          "seniorProfile.lastName": 1,
        },
      },
    ]);

    return res.json(emergencies);
  } catch (error) {
    console.error("getFamilySOS error:", error);
    return res.status(500).json({ message: "Failed to fetch SOS" });
  }
};
