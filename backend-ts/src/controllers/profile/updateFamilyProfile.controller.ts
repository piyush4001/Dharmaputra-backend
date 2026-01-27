// import { Response } from "express";
// import { AuthRequest } from "../../middlewares/auth.middleware";
// import {
//   FamilyProfile,
// } from "../../models/Role/FamilyProfile.model";

// export const updateFamilyProfile = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {
//     const { userId } = req.auth!;
//     const {
//       firstName,
//       lastName,
//       address,
//       phone,
//       // customRelation,
//       isPrimaryContact,
//     } = req.body;

//     const profile = await FamilyProfile.findOne({ userId });

//     if (!profile) {
//       return res.status(404).json({
//         message: "Family profile not found",
//       });
//     }

//     /* -------- BASIC FIELDS -------- */
//     if (firstName !== undefined) profile.firstName = firstName;
//     if (lastName !== undefined) profile.lastName = lastName;
//     if (address !== undefined) profile.address = address;
//     if (phone !== undefined) profile.phone = phone;

 
//    /* -------- PRIMARY CONTACT -------- */
//     if (isPrimaryContact !== undefined) {
//       profile.isPrimaryContact = Boolean(isPrimaryContact);
//     }

//     await profile.save();

//     return res.json({
//       message: "Profile updated successfully",
//       profile,
//     });
//   } catch (error) {
//     console.error("updateFamilyProfile error:", error);
//     return res.status(500).json({
//       message: "Failed to update profile",
//     });
//   }
// };
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { FamilyProfile } from "../../models/Role/FamilyProfile.model";

export const updateFamilyProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.auth!;

    const {
      firstName,
      lastName,
      address, // structured address object
      phone,
      isPrimaryContact,
    } = req.body;

    const profile = await FamilyProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        message: "Family profile not found",
      });
    }

    /* -------- BASIC FIELDS -------- */
    if (firstName !== undefined) profile.firstName = firstName;
    if (lastName !== undefined) profile.lastName = lastName;
    if (phone !== undefined) profile.phone = phone;

    /* -------- ADDRESS (CURRENT LOCATION / MANUAL) -------- */
    if (address !== undefined) {
      profile.address = {
        fullAddress: address.fullAddress,
        city: address.city,
        district: address.district,
        state: address.state,
        country: address.country,
        postalCode: address.postalCode,
        location:
          address.latitude && address.longitude
            ? {
                type: "Point",
                coordinates: [
                  address.longitude, // lng first
                  address.latitude,  // lat second
                ],
              }
            : undefined,
      };
    }

    /* -------- PRIMARY CONTACT -------- */
    if (isPrimaryContact !== undefined) {
      profile.isPrimaryContact = Boolean(isPrimaryContact);
    }

    await profile.save();

    return res.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("updateFamilyProfile error:", error);
    return res.status(500).json({
      message: "Failed to update profile",
    });
  }
};
