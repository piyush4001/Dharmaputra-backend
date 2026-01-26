import { Request, Response } from 'express';
import { Otp } from '../../models/Otp.model';
import { generateOtp, hashOtp } from '../../utils/otp';
import { sendOtpSms } from '../../utils/sendOtpSms';

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    // ⏳ Rate limit OTP per phone (3 in 10 minutes)
    const recentOtps = await Otp.countDocuments({
      phone,
      createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
    });

    if (recentOtps >= 3) {
      return res.status(429).json({
        message: 'Too many OTP requests. Try later.',
      });
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    await Otp.deleteMany({ phone });

    await Otp.create({
      phone,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // 🚀 Send OTP (real or dev mode)
    await sendOtpSms(phone, otp);

    // 🔒 Show OTP only in dev
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🔐 OTP for ${phone}: ${otp}`);
    }

    return res.status(200).json({
      message: 'OTP sent successfully',
      ...(process.env.NODE_ENV !== 'production' && { otp }), // optional for frontend testing
    });
  } catch (err) {
    console.error('sendOtp error:', err);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
};
