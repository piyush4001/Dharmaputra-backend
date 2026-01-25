// import { Response } from "express";
// import { AuthRequest } from "../../middlewares/auth.middleware";
// import { FamilyProfile } from "../../models/Role/FamilyProfile.model";

// export const updateFamilyProfile = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {
//     const { userId } = req.auth!;
//     const { firstName, lastName, address } = req.body;

//     const profile = await FamilyProfile.findOne({ userId });

//     if (!profile) {
//       return res.status(404).json({ message: "Family profile not found" });
//     }

//     if (firstName !== undefined) profile.firstName = firstName;
//     if (lastName !== undefined) profile.lastName = lastName;
//     if (address !== undefined) profile.address = address;

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
import {
  FamilyProfile,
  FamilyRelation,
} from "../../models/Role/FamilyProfile.model";

export const updateFamilyProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.auth!;
    const {
      firstName,
      lastName,
      address,
      phone,
      relation,
    //  customRelation,
      isPrimaryContact,
    } = req.body;

    const profile = await FamilyProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Family profile not found" });
    }

    /* -------- BASIC FIELDS -------- */
    if (firstName !== undefined) profile.firstName = firstName;
    if (lastName !== undefined) profile.lastName = lastName;
    if (address !== undefined) profile.address = address;
    if (phone !== undefined) profile.phone = phone;

    /* -------- RELATION -------- */
    if (relation !== undefined) {
      // Validate enum
      if (
        relation !== null &&
        !Object.values(FamilyRelation).includes(relation)
      ) {
        return res.status(400).json({
          message: "Invalid relation value",
        });
      }

      profile.relation = relation;
      // profile.customRelation =
      //   relation === FamilyRelation.OTHER
      //     ? customRelation || ""
      //     : undefined;
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

