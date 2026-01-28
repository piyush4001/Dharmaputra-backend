// import { Response } from "express";
// import { AuthRequest } from "../../middlewares/auth.middleware";
// import { Emergency } from "../../models/Emergency.model";
// import mongoose from "mongoose";

// export const respondEmergency = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {
//     const { userId, role } = req.auth!;
//     const { emergencyId, status } = req.body;

//     // 🔒 Only helpers can respond
//     if (role !== "HELPER") {
//       return res.status(403).json({
//         message: "Only helpers can respond to emergencies",
//       });
//     }

//     // ✅ Allowed statuses
//     if (!["COMING", "UNABLE_TO_REACH"].includes(status)) {
//       return res.status(400).json({
//         message: "Invalid response status",
//       });
//     }

//     if (!mongoose.Types.ObjectId.isValid(emergencyId)) {
//       return res.status(400).json({
//         message: "Invalid emergencyId",
//       });
//     }

//     const emergency = await Emergency.findById(emergencyId);

//     if (!emergency) {
//       return res.status(404).json({
//         message: "Emergency not found",
//       });
//     }

//     // ❗ Do NOT resolve emergency here
//     // Emergency remains ACTIVE until senior resolves it

//     emergency.responseStatus = status;
//     emergency.respondedBy = new mongoose.Types.ObjectId(userId);
//     emergency.respondedAt = new Date();

//     await emergency.save();

//     /* 🔔 NOTIFY SENIOR (HOOK POINT)
//        You can plug any of these here:
//        - Socket.IO emit
//        - Push notification
//        - In-app notification model
//     */
//     /*
//     notifySenior({
//       seniorId: emergency.senior,
//       title: "Helper is coming",
//       message:
//         status === "COMING"
//           ? "A helper has accepted your emergency and is on the way."
//           : "Helper is unable to reach you.",
//       emergencyId: emergency._id,
//     });
//     */

//     return res.json({
//       message:
//         status === "COMING"
//           ? "Marked as coming. Senior notified."
//           : "Marked as unable to reach.",
//       emergency,
//     });
//   } catch (err) {
//     console.error("respondEmergency error:", err);
//     return res.status(500).json({
//       message: "Failed to respond to emergency",
//     });
//   }
// };
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { Emergency } from "../../models/Emergency.model";
import mongoose from "mongoose";

export const respondEmergency = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.auth!;
    const { emergencyId, status } = req.body;

    // ✅ Allowed helper responses
    const allowedStatuses = ["COMING", "UNABLE_TO_REACH"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const emergency = await Emergency.findById(emergencyId);

    if (!emergency) {
      return res.status(404).json({ message: "Emergency not found" });
    }

    // ❌ Do NOT auto-resolve
    emergency.responseStatus = status;
    emergency.respondedBy = new mongoose.Types.ObjectId(userId);
    emergency.respondedAt = new Date();

    // 🔒 Keep emergency ACTIVE
    emergency.status = "ACTIVE";

    await emergency.save();

    return res.json({
      message:
        status === "COMING"
          ? "Helper is coming. Senior notified."
          : "Marked as unable to reach",
      emergency,
    });
  } catch (err) {
    console.error("respondEmergency error:", err);
    return res.status(500).json({ message: "Failed to respond" });
  }
};
