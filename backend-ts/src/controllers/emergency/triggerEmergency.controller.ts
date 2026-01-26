// import { Response } from "express";
// import { AuthRequest } from "../../middlewares/auth.middleware";
// import { Emergency } from "../../models/Emergency.model";
// import { UserRole } from "../../models/User.model";
// import { sendPushNotification } from "../../utils/sendPush";
// import { FamilyProfile } from "../../models/Role/FamilyProfile.model";
// import { User } from "../../models/User.model";
// export const triggerEmergency = async (req: AuthRequest, res: Response) => {
//   try {
//     console.log("Trigger Emergency - Auth:", req.auth);
//     console.log("Trigger Emergency - Body:", req.body);
    
//     const userId = req.auth?.userId;
//     const role = req.auth?.role;
//     const { location } = req.body;

//     console.log("userId:", userId, "role:", role);

//     if (!userId || role !== UserRole.SENIOR) {
//       console.log("Authorization failed - not a senior");
//       return res.status(403).json({
//         message: "Only seniors can trigger emergency",
//       });
//     }

//     // Prevent multiple active emergencies
//     const activeEmergency = await Emergency.findOne({
//       userId,
//       status: "ACTIVE",
//     });

//     if (activeEmergency) {
//       return res.status(400).json({
//         message: "Emergency already active",
//       });
//     }

//     const emergency = await Emergency.create({
//       userId,
//       location,
//       status: "ACTIVE",
//       triggeredAt: new Date(),
//     });

//     // 🔔  notify family & helpers
//     const familyProfiles = await FamilyProfile.find({
//   seniorIds: userId,
// });

// const familyUserIds = familyProfiles.map((f) => f.userId);

// const familyUsers = await User.find({
//   _id: { $in: familyUserIds },
// });

// const tokens = familyUsers.flatMap(
//   (u) => u.pushTokens || []
// );

// await sendPushNotification(
//   tokens,
//   "🚨 EMERGENCY ALERT",
//   "A linked senior has triggered SOS. Open the app immediately."
// );

//     return res.status(201).json({
//       message: "Emergency triggered",
//       emergency,
//     });
//   } catch (error) {
//     console.error("Trigger emergency error:", error);
//     return res.status(500).json({
//       message: "Failed to trigger emergency",
//     });
//   }
// };
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { Emergency } from "../../models/Emergency.model";
import { UserRole } from "../../models/User.model";
import { sendPushNotification } from "../../utils/sendPush";
import { FamilyProfile } from "../../models/Role/FamilyProfile.model";
import { User } from "../../models/User.model";

export const triggerEmergency = async (req: AuthRequest, res: Response) => {
  try {
    console.log("🚨 Trigger Emergency");
    console.log("Auth:", req.auth);
    console.log("Body:", req.body);

    const userId = req.auth?.userId;
    const role = req.auth?.role;

    const { lat, lng } = req.body;

    // 🔐 Only seniors can trigger emergency
    if (!userId || role !== UserRole.SENIOR) {
      return res.status(403).json({
        message: "Only seniors can trigger emergency",
      });
    }

    // 📍 Validate location
    if (
      typeof lat !== "number" ||
      typeof lng !== "number"
    ) {
      return res.status(400).json({
        message: "Valid lat and lng are required",
      });
    }

    // 🚫 Prevent multiple active emergencies
    const activeEmergency = await Emergency.findOne({
      userId,
      status: "ACTIVE",
    });

    if (activeEmergency) {
      return res.status(400).json({
        message: "Emergency already active",
      });
    }

    // 🆘 Create emergency
    const emergency = await Emergency.create({
      userId,
      location: {
        lat,
        lng,
      },
      triggerType: "BUTTON",
      status: "ACTIVE",
      triggeredAt: new Date(),
    });

    // 🗺️ Google Maps navigation link
    const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    // 👨‍👩‍👧 Find linked family members
    const familyProfiles = await FamilyProfile.find({
      seniorIds: userId,
    });

    const familyUserIds = familyProfiles.map((f) => f.userId);

    const familyUsers = await User.find({
      _id: { $in: familyUserIds },
    });

    const tokens = familyUsers.flatMap(
      (u) => u.pushTokens || []
    );

    // 🔔 Send push notification with map link
    // if (tokens.length > 0) {
    //   await sendPushNotification(
    //     tokens,
    //     "🚨 EMERGENCY ALERT",
    //     "A senior has triggered SOS. Tap to navigate.",
    //     {
    //       emergencyId: emergency._id.toString(),
    //       lat: String(lat),
    //       lng: String(lng),
    //       mapsLink,
    //     }
    //   );
    // }
    
    return res.status(201).json({
      message: "Emergency triggered successfully",
      emergency,
      mapsLink,
    });
  } catch (error) {
    console.error("❌ Trigger emergency error:", error);
    return res.status(500).json({
      message: "Failed to trigger emergency",
    });
  }
};
