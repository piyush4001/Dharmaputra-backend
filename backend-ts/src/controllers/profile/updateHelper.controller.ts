// // controllers/helper/updateHelperProfile.controller.ts
// import { Request, Response } from "express";
// import { HelperProfile } from "../../models/Role/HelperProfile.model";
// import { AuthRequest } from "../../middlewares/auth.middleware";

// export const updateHelperProfile = async (req: AuthRequest, res: Response) => {
//   try {
//      const { userId } = req.auth!;
//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const {
//       firstName,
//       lastName,
//       age,
//       phone,
//       education,
//       availability,
//       isActive,
//       address,
//     } = req.body;

//     // Build update object dynamically (partial updates allowed)
//     const updateData: any = {};

//     if (firstName) updateData.firstName = firstName;
//     if (lastName) updateData.lastName = lastName;
//     if (age) updateData.age = age;
//     if (phone) updateData.phone = phone;
//     if (education) updateData.education = education;
//     if (availability) updateData.availability = availability;
//     if (typeof isActive === "boolean") updateData.isActive = isActive;
//     // Nested address update
//     if (address) {
//       for (const key of ["houseNo", "area", "city", "state", "pincode"]) {
//         if (address[key]) {
//           updateData[`address.${key}`] = address[key];
//         }
//       }
//     }

//     const updatedProfile = await HelperProfile.findOneAndUpdate(
//       { user : userId },
//       { $set: updateData },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!updatedProfile) {
//       return res.status(404).json({
//         success: false,
//         message: "Helper profile not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Helper profile updated successfully",
//       data: updatedProfile,
//     });
//   } catch (error: any) {
//     console.error("Update Helper Profile Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };
import { Response } from "express";
import { HelperProfile } from "../../models/Role/HelperProfile.model";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const updateHelperProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.auth!;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      firstName,
      lastName,
      age,
      phone,
      education,
      availability,
      isActive,
      address, // structured address object
    } = req.body;

    const updateData: any = {};

    /* ---------------- BASIC FIELDS ---------------- */
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (age !== undefined) updateData.age = age;
    if (phone !== undefined) updateData.phone = phone;
    if (education !== undefined) updateData.education = education;
    if (availability !== undefined) updateData.availability = availability;
    if (typeof isActive === "boolean") updateData.isActive = isActive;

    /* ---------------- ADDRESS (MANUAL / LOCATION) ---------------- */
    if (address !== undefined) {
      updateData.address = {
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

    const updatedProfile = await HelperProfile.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "Helper profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Helper profile updated successfully",
      data: updatedProfile,
    });
  } catch (error: any) {
    console.error("Update Helper Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
