// import { Response } from "express";
// import { AuthRequest } from "../../middlewares/auth.middleware";
// import { SeniorProfile } from "../../models/Role/SeniorProfile.model";

// export const setupSeniorProfile = async (
//   req: AuthRequest,
//   res: Response,
// ) => {
//   const { userId } = req.auth!;
//   const { firstName,lastName,age, address, emergencyContact, medicalInfo } = req.body;

//   if (!age || !address) {
//     return res
//       .status(400)
//       .json({ message: "Required fields missing" });
//   }

//   await SeniorProfile.findOneAndUpdate(
//     { user: userId },
//     {
//       user: userId,
//       firstName,
//       lastName,
//       age,
//       address,
//       emergencyContact,
//       medicalInfo,
//     },
//     { upsert: true, new: true },
//   );

//   res.json({ message: "Senior profile saved" });
// };
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { SeniorProfile } from "../../models/Role/SeniorProfile.model";
import { User } from "../../models/User.model";

export const setupSeniorProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId, role } = req.auth!;

    if (role !== "SENIOR") {
      return res.status(403).json({
        message: "Only seniors can create senior profile",
      });
    }

    const {
      firstName,
      lastName,
      age,
      address,
      emergencyContact,
      medicalInfo,
    } = req.body;

    if (!age || !address) {
      return res.status(400).json({
        message: "Age and address are required",
      });
    }

    // 🔑 Get phone number from User (OTP login source)
    const user = await User.findById(userId).select("phone");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔁 Upsert senior profile (same behavior as before)
    const profile = await SeniorProfile.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        firstName,
        lastName,
        age,
        address,
        emergencyContact,
        medicalInfo,
        phone: user.phone, // ✅ injected automatically
      },
      { upsert: true, new: true }
    );

    return res.json({
      message: "Senior profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error("setupSeniorProfile error:", error);
    return res.status(500).json({
      message: "Failed to setup senior profile",
    });
  }
};
