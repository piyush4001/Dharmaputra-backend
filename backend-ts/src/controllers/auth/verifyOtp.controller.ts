// import { Request, Response } from "express";
// import { Otp } from "../../models/Otp.model";
// import { User } from "../../models/User.model";
// import { hashOtp } from "../../utils/otp";
// import jwt from "jsonwebtoken";

// export const verifyOtp = async (req: Request, res: Response) => {
//   try {
//     const { phone, otp } = req.body;

//     if (!phone || !otp) {
//       return res.status(400).json({ message: "Phone & OTP required" });
//     }

//     const otpRecord = await Otp.findOne({ phone });

//     if (!otpRecord) {
//       return res.status(400).json({ message: "OTP expired or invalid" });
//     }

//     // 🔒 Max attempts
//     if (otpRecord.attempts >= 3) {
//       await Otp.deleteOne({ _id: otpRecord._id });
//       return res.status(429).json({ message: "Too many attempts" });
//     }

//     // Verify OTP
//     if (hashOtp(otp) !== otpRecord.otpHash) {
//       otpRecord.attempts += 1;
//       await otpRecord.save();
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     // OTP valid → remove
//     await Otp.deleteOne({ _id: otpRecord._id });

//     // Find or create user
//     let user = await User.findOne({ phone });

//     if (!user) {
//       user = await User.create({ phone });
//     }

//     user.lastLogin = new Date();
//     await user.save();

//     // Issue JWT
//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET!,
//       { expiresIn: "7d" },
//     );

//     return res.status(200).json({
//       token,
//       role: user.role,
//     });
//   } catch (err) {
//     console.error("verifyOtp error:", err);
//     return res.status(500).json({ message: "OTP verification failed" });
//   }
// };
import { Request, Response } from "express";
import { Otp } from "../../models/Otp.model";
import { User } from "../../models/User.model";
import { hashOtp } from "../../utils/otp";
import jwt from "jsonwebtoken";

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone & OTP required" });
    }

    // =========================
    // 🔓 MASTER OTP (DEV ONLY)
    // =========================
    const isDev = process.env.NODE_ENV === "development";
    const masterOtp = process.env.MASTER_OTP;

    if (isDev && masterOtp && otp === masterOtp) {
      // Find or create user directly
      let user = await User.findOne({ phone });

      if (!user) {
        user = await User.create({ phone });
      }

      user.lastLogin = new Date();
      await user.save();

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        token,
        role: user.role,
        devBypass: true,
      });
    }

    // =========================
    // 🔐 NORMAL OTP FLOW
    // =========================
    const otpRecord = await Otp.findOne({ phone });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    // Max attempts
    if (otpRecord.attempts >= 3) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({ message: "Too many attempts" });
    }

    // Verify OTP
    if (hashOtp(otp) !== otpRecord.otpHash) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP valid → remove
    await Otp.deleteOne({ _id: otpRecord._id });

    // Find or create user
    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({ phone });
    }

    user.lastLogin = new Date();
    await user.save();

    // Issue JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token,
      role: user.role,
    });
  } catch (err) {
    console.error("verifyOtp error:", err);
    return res.status(500).json({ message: "OTP verification failed" });
  }
};
