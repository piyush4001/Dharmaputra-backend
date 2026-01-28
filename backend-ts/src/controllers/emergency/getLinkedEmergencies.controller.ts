import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { Emergency } from "../../models/Emergency.model";
import { UserRole } from "../../models/User.model";
import { SeniorProfile } from "../../models/Role/SeniorProfile.model";

export const getLinkedEmergencies = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.auth?.userId;
    const role = req.auth?.role;

    if (!userId || !role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (role === UserRole.SENIOR) {
      return res.status(403).json({ message: "Access denied" });
    }

    /* ---------------- GET LINKED SENIORS ---------------- */
    const match: any = {};

    if (role === UserRole.FAMILY) match.familyIds = userId;
    if (role === UserRole.HELPER) match.helperIds = userId;

    const linkedSeniors = await SeniorProfile.find(match).select("user");

    const seniorUserIds = linkedSeniors.map((s) => s.user);

    if (seniorUserIds.length === 0) {
      return res.json({ emergencies: [] });
    }

    /* ---------------- AGGREGATION (CORRECT WAY) ---------------- */
    const emergencies = await Emergency.aggregate([
      {
        $match: {
          status: "ACTIVE",
          userId: { $in: seniorUserIds },
        },
      },

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
      { $unwind: "$seniorProfile" },

      // 🎯 FINAL SHAPE (IMPORTANT)
      {
        $project: {
          _id: 1,
          location: 1,
          triggeredAt: 1,
          triggerType: 1,

          senior: {
            firstName: "$seniorProfile.firstName",
            lastName: "$seniorProfile.lastName",
            phone: "$user.phone",
          },
        },
      },

      { $sort: { triggeredAt: -1 } },
    ]);

    return res.json({ emergencies });
  } catch (error) {
    console.error("❌ getLinkedEmergencies error:", error);
    return res.status(500).json({ message: "Failed to fetch emergencies" });
  }
};
