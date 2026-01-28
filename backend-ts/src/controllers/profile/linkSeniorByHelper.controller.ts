import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { User } from "../../models/User.model";
import { HelperProfile } from "../../models/Role/HelperProfile.model";
import { SeniorLinkRequest } from "../../models/SeniorLinkRequest.model";

export const linkSeniorByHelper = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.auth!;
    const { seniorPhone } = req.body;

    if (!seniorPhone) {
      return res.status(400).json({
        message: "Senior phone is required",
      });
    }

    /* 1️⃣ Find senior */
    const senior = await User.findOne({
      phone: seniorPhone,
      role: "SENIOR",
    });

    if (!senior) {
      return res.status(404).json({
        message: "Senior not found",
      });
    }

    /* 2️⃣ Find helper USER (🔥 source of truth) */
    const helperUser = await User.findById(userId).select("phone");

    if (!helperUser || !helperUser.phone) {
      return res.status(400).json({
        message: "Helper phone not found",
      });
    }

    /* 3️⃣ Get helper profile (for name only) */
    const helperProfile = await HelperProfile.findOne({
      user: userId,
    });

    if (!helperProfile) {
      return res.status(400).json({
        message: "Helper profile not found",
      });
    }

    /* 4️⃣ Prevent duplicate request */
    const existingRequest = await SeniorLinkRequest.findOne({
      seniorId: senior._id,
      helperId: userId,
      status: "PENDING",
      requestType: "HELPER",
    });

    if (existingRequest) {
      return res.status(409).json({
        message: "Request already sent",
      });
    }

    /* 5️⃣ CREATE LINK REQUEST (✅ GUARANTEED PHONE) */
    await SeniorLinkRequest.create({
      seniorId: senior._id,

      helperId: userId,
      helperName: `${helperProfile.firstName} ${helperProfile.lastName}`,
      helperPhone: helperUser.phone, // ✅ FIXED

      requestType: "HELPER",
    });

    return res.status(200).json({
      message: "Request sent. Waiting for senior approval.",
    });
  } catch (error) {
    console.error("linkSeniorByHelper error:", error);
    return res.status(500).json({
      message: "Failed to send request",
    });
  }
};
