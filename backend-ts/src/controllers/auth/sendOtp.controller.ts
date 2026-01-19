import { Request, Response } from "express";
import { Otp } from "../../models/Otp.model";
import { generateOtp, hashOtp } from "../../utils/otp";

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    // 1️⃣ Validate phone
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    // 2️⃣ Rate limit (max 3 OTPs in 10 min)
    const recentOtps = await Otp.countDocuments({
      phone,
      createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
    });

    if (recentOtps >= 3) {
      return res.status(429).json({
        message: "Too many OTP requests. Try later.",
      });
    }

    // 3️⃣ Generate & hash OTP
    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    // 4️⃣ Delete old OTPs
    await Otp.deleteMany({ phone });

    // 5️⃣ Save OTP
    await Otp.create({
      phone,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // 6️⃣ Send SMS (TEMP: console log)
    console.log(`OTP for ${phone}: ${otp}`);

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("sendOtp error:", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};
