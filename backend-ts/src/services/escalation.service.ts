// // Escalation service
// import { Types } from "mongoose";
// import { Panic, PanicStatus } from "../models/Emergency.model";
// import { User } from "../models/User.model";
// import { sendSMS } from "./sms.service";

// // Escalate panic if unresolved
// export const escalatePanic = async (
//   panicId: Types.ObjectId,
//   delayMinutes = 5,
// ) => {
//   // Wait before escalation
//   setTimeout(
//     async () => {
//       const panic = await Panic.findById(panicId);

//       // Stop if already resolved
//       if (!panic || panic.status !== PanicStatus.ACTIVE) {
//         return;
//       }

//       panic.status = PanicStatus.ESCALATED;
//       await panic.save();

//       const user = await User.findById(panic.userId).populate(
//         "emergencyContacts",
//       );

//       if (!user) return;

//       // Send SMS to all emergency contacts
//       for (const contact of user.emergencyContacts as any[]) {
//         await sendSMS(
//           contact.phone,
//           "Emergency not acknowledged. Immediate help needed.",
//         );
//       }
//     },
//     delayMinutes * 60 * 1000,
//   );
// };

