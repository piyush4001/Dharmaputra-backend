import { Request, Response } from "express";
import admin from "../../config/firebaseAdmin";
import { User } from "../../models/User.model";
import { generateAccessToken } from "../../utils/jwt";

/**
 * POST /auth/firebase-login
 * Body: { idToken }
 */
export const firebaseLogin = async (
  req: Request,
  res: Response
) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        message: "Firebase token is required",
      });
    }

    // 🔐 Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(idToken);

    const phone = decoded.phone_number;

    if (!phone) {
      return res.status(400).json({
        message: "Phone number not found in token",
      });
    }

    // 🔍 Find or create user
    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        phone,
        role: null, // role will be selected later
      });
    }

    // 🎟️ Issue access token (existing logic)
    const token = generateAccessToken(user._id.toString());

    return res.json({
      token,
    });
  } catch (error) {
    console.error("firebaseLogin error:", error);
    return res.status(401).json({
      message: "Invalid Firebase token",
    });
  }
};
