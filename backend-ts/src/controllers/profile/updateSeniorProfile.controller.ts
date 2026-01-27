// import { Response } from "express";
// import { AuthRequest } from "../../middlewares/auth.middleware";
// import { User } from "../../models/User.model";
// import { SeniorProfile } from "../../models/Role/SeniorProfile.model";

// export const updateSeniorProfile = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {
//     const { userId } = req.auth!;

//     const {
//       firstName,
//       lastName,
//       age,
//       address,
//       emergencyContact,
//       medicalInfo,
//     } = req.body;

//     // 1️⃣ Update name fields in User model
//     await User.findByIdAndUpdate(userId, {
//       firstName,
//       lastName,
//     });

//     // 2️⃣ Update senior profile
//     const profile = await SeniorProfile.findOneAndUpdate(
//       { user: userId },
//       {
//         age,
//         address,
//         emergencyContact,
//         medicalInfo,
//       },
//       { new: true }
//     );

//     if (!profile) {
//       return res.status(404).json({ message: "Senior profile not found" });
//     }

//     return res.status(200).json({
//       message: "Profile updated successfully",
//       profile,
//     });
//   } catch (error) {
//     console.error("updateSeniorProfile error:", error);
//     return res.status(500).json({ message: "Failed to update profile" });
//   }
// };
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { User } from "../../models/User.model";
import { SeniorProfile } from "../../models/Role/SeniorProfile.model";

export const updateSeniorProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.auth!;

    const {
      firstName,
      lastName,
      age,
      address, // structured address object
      emergencyContact,
      medicalInfo,
    } = req.body;

    /* ---------------- BASIC VALIDATION ---------------- */
    const updateUserData: any = {};
    if (firstName !== undefined) updateUserData.firstName = firstName;
    if (lastName !== undefined) updateUserData.lastName = lastName;

    // 1️⃣ Update name fields in User model (if provided)
    if (Object.keys(updateUserData).length > 0) {
      await User.findByIdAndUpdate(userId, updateUserData);
    }

    /* ---------------- SENIOR PROFILE UPDATE ---------------- */
    const updateProfileData: any = {};

    if (age !== undefined) {
      const ageNumber = Number(age);
      if (!ageNumber) {
        return res.status(400).json({
          message: "Valid age is required",
        });
      }
      updateProfileData.age = ageNumber;
    }

    if (emergencyContact !== undefined) {
      updateProfileData.emergencyContact = emergencyContact;
    }

    if (medicalInfo !== undefined) {
      updateProfileData.medicalInfo = medicalInfo;
    }

    /* ---------------- ADDRESS (MANUAL / LOCATION) ---------------- */
    if (address !== undefined) {
      updateProfileData.address = {
        fullAddress: address.fullAddress,
        houseNo: address.houseNo,
        area: address.area,
        city: address.city,
        district: address.district,
        state: address.state,
        country: address.country,
        pincode: address.pincode,
        location:
          address.latitude && address.longitude
            ? {
                type: "Point",
                coordinates: [
                  address.longitude, // lng
                  address.latitude,  // lat
                ],
              }
            : undefined,
      };
    }

    const profile = await SeniorProfile.findOneAndUpdate(
      { user: userId },
      { $set: updateProfileData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        message: "Senior profile not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("updateSeniorProfile error:", error);
    return res.status(500).json({
      message: "Failed to update profile",
    });
  }
};
