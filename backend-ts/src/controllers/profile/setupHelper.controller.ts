// // src/controllers/profile/setupHelperProfile.controller.ts
// import { Response } from "express";
// import { AuthRequest } from "../../middlewares/auth.middleware";
// import { HelperProfile } from "../../models/Role/HelperProfile.model";

// /**
//  * Create / Setup Helper Profile
//  * Role must be HELPER
//  */
// export const setupHelperProfile = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {
//     const { userId, role } = req.auth!;

//     if (role !== "HELPER") {
//       return res.status(403).json({
//         message: "Only helpers can create helper profile",
//       });
//     }

//     const {
//       firstName,
//       lastName,
//       age,
//       address,
//       education,
//       aadhaarFile,
//     } = req.body;

//     /* ---------------- BASIC VALIDATION ---------------- */
//     if (
//       !firstName ||
//       !lastName ||
//       !age ||
//       !address ||
//       !education ||
//       !aadhaarFile
//     ) {
//       return res.status(400).json({
//         message: "All required fields must be provided",
//       });
//     }

//     /* ---------------- CHECK EXISTING ---------------- */
//     const existingProfile = await HelperProfile.findOne({ user: userId });

//     if (existingProfile) {
//       return res.status(409).json({
//         message: "Helper profile already exists",
//       });
//     }

//     /* ---------------- CREATE PROFILE ---------------- */
//     const helperProfile = await HelperProfile.create({
//       user: userId,
//       firstName,
//       lastName,
//       age,
//       address, // { houseNo, area, city, state, pincode }
//       education,
//       aadhaarFile, // cloudinary url
//     });

//     return res.status(201).json({
//       message: "Helper profile created successfully",
//       helperProfile,
//     });
//   } catch (error) {
//     console.error("setupHelperProfile error:", error);
//     return res.status(500).json({
//       message: "Failed to setup helper profile",
//     });
//   }
// };
// src/controllers/profile/setupHelperProfile.controller.ts
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { HelperProfile } from "../../models/Role/HelperProfile.model";
import { User } from "../../models/User.model";

export const setupHelperProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId, role } = req.auth!;

    if (role !== "HELPER") {
      return res.status(403).json({
        message: "Only helpers can create helper profile",
      });
    }

    const {
      firstName,
      lastName,
      age,
      address,
      education,
      aadhaarFile,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !age ||
      !address ||
      !education ||
      !aadhaarFile
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    /* ---------------- FETCH USER PHONE ---------------- */
    const user = await User.findById(userId).select("phone");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    /* ---------------- CHECK EXISTING ---------------- */
    const existingProfile = await HelperProfile.findOne({ user: userId });

    if (existingProfile) {
      return res.status(409).json({
        message: "Helper profile already exists",
      });
    }

    /* ---------------- CREATE PROFILE ---------------- */
    const helperProfile = await HelperProfile.create({
      user: userId,
      phone: user.phone, // 🔥 AUTO-INJECTED
      firstName,
      lastName,
      age,
      address,
      education,
      aadhaarFile,
    });
    return res.status(201).json({
      message: "Helper profile created successfully",
      helperProfile,
    });
  } catch (error) {
    console.error("setupHelperProfile error:", error);
    return res.status(500).json({
      message: "Failed to setup helper profile",
    });
  }
};
