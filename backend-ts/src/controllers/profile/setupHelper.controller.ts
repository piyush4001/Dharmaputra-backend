
// // src/controllers/profile/setupHelperProfile.controller.ts
// import { Response } from "express";
// import fs from "fs";
// import { AuthRequest } from "../../middlewares/auth.middleware";
// import { HelperProfile } from "../../models/Role/HelperProfile.model";
// import { User } from "../../models/User.model";
// import { uploadImage } from "../../utils/cloudinary";

// export const setupHelperProfile = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {
//     const { userId, role } = req.auth!;

//     // 🔐 Only helpers can create profile
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
//     } = req.body;

//     if (
//       !firstName ||
//       !lastName ||
//       !age ||
//       !address ||
//       !education 
//     ) {
//       return res.status(400).json({
//         message: "All required fields must be provided",
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({
//         message: "Profile image is required",
//       });
//     }

//     // 🚫 Prevent duplicate profile
//     const existingProfile = await HelperProfile.findOne({ user: userId });
//     if (existingProfile) {
//       return res.status(409).json({
//         message: "Helper profile already exists",
//       });
//     }

//     // 📞 Fetch phone from User (OTP source of truth)
//     const user = await User.findById(userId).select("phone");
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     // ☁️ Upload profile image
//     const uploaded = await uploadImage(req.file.path);
//     fs.unlinkSync(req.file.path); // cleanup temp file

//     // 🏠 Parse address (may come as string)
//     let parsedAddress: any;
//     try {
//       parsedAddress =
//         typeof address === "string" ? JSON.parse(address) : address;
//     } catch {
//       return res.status(400).json({
//         message: "Invalid address format",
//       });
//     }

//     /* ---------------- CREATE PROFILE ---------------- */
//     const helperProfile = await HelperProfile.create({
//       user: userId,
//       phone: user.phone, // 🔥 auto-injected
//       firstName,
//       lastName,
//       age,
//       address: {
//         houseNo: parsedAddress.houseNo || "",
//         area: parsedAddress.area,
//         city: parsedAddress.city,
//         state: parsedAddress.state,
//         pincode: parsedAddress.pincode,
//       },
//       education,
//       profileImage: uploaded.secure_url,
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
import { Response } from "express";
import fs from "fs";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { HelperProfile } from "../../models/Role/HelperProfile.model";
import { User } from "../../models/User.model";
import { uploadImage } from "../../utils/cloudinary";

export const setupHelperProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId, role } = req.auth!;

    // 🔐 Only helpers can create profile
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
    } = req.body;

    if (!firstName || !lastName || !age || !education) {
      return res.status(400).json({
        message: "First name, last name, age and education are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Profile image is required",
      });
    }

    // 🚫 Prevent duplicate profile
    const existingProfile = await HelperProfile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(409).json({
        message: "Helper profile already exists",
      });
    }

    // 📞 Fetch phone from User (OTP source of truth)
    const user = await User.findById(userId).select("phone");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ☁️ Upload profile image
    const uploaded = await uploadImage(req.file.path);
    fs.unlinkSync(req.file.path); // cleanup temp file

    /* ---------------- ADDRESS (OPTIONAL & STRUCTURED) ---------------- */
    let formattedAddress: any = undefined;

    if (address) {
      let parsedAddress: any;

      try {
        parsedAddress =
          typeof address === "string" ? JSON.parse(address) : address;
      } catch {
        return res.status(400).json({
          message: "Invalid address format",
        });
      }

      formattedAddress = {
        fullAddress: parsedAddress.fullAddress,
        houseNo: parsedAddress.houseNo,
        area: parsedAddress.area,
        city: parsedAddress.city,
        district: parsedAddress.district,
        state: parsedAddress.state,
        country: parsedAddress.country,
        pincode: parsedAddress.pincode,
        location:
          parsedAddress.latitude && parsedAddress.longitude
            ? {
                type: "Point",
                coordinates: [
                  parsedAddress.longitude, // lng
                  parsedAddress.latitude,  // lat
                ],
              }
            : undefined,
      };
    }

    /* ---------------- CREATE PROFILE ---------------- */
    const helperProfile = await HelperProfile.create({
      user: userId,
      phone: user.phone, // 🔥 single source of truth
      firstName,
      lastName,
      age,
      address: formattedAddress,
      education,
      profileImage: uploaded.secure_url,
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
