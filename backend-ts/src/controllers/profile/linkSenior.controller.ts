import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { FamilyProfile } from "../../models/Role/FamilyProfile.model";
import { User } from "../../models/User.model";
import { SeniorLinkRequest } from "../../models/SeniorLinkRequest.model";

export const linkSenior = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.auth!;
    const { seniorPhone, relation } = req.body;

    if (!seniorPhone || !relation) {
      return res.status(400).json({
        message: "Senior phone and relation are required",
      });
    }

    // 1️⃣ Find senior
    const senior = await User.findOne({
      phone: seniorPhone,
      role: "SENIOR",
    });

    if (!senior) {
      return res.status(404).json({
        message: "Senior not found",
      });
    }

    // 2️⃣ Get family profile
    const familyProfile = await FamilyProfile.findOne({
      userId,
    });

    if (!familyProfile) {
      return res.status(400).json({
        message: "Family profile not found",
      });
    }

    // 3️⃣ Prevent duplicate requests
    const existingRequest = await SeniorLinkRequest.findOne({
      seniorId: senior._id,
      familyId: userId,
      status: "PENDING",
    });

    if (existingRequest) {
      return res.status(409).json({
        message: "Request already sent",
      });
    }

    // 4️⃣ Create request
    await SeniorLinkRequest.create({
      seniorId: senior._id,
      familyId: userId,
      familyName: `${familyProfile.firstName} ${familyProfile.lastName}`,
      familyPhone: familyProfile.phone,
      relation,
    });

    // 🔔 Notification logic will plug here later

    return res.status(200).json({
      message: "Request sent. Wait for senior approval.",
    });
  } catch (error) {
    console.error("linkSenior error:", error);
    return res.status(500).json({
      message: "Failed to send request",
    });
  }
};
