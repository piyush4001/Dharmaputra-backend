import { Response } from "express";
import Feedback from "../../models/Feedback.model";
import cloudinary from "../../utils/cloudinary";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const createFeedback = async (req: AuthRequest, res: Response) => {
  try {
    // 🔐 Auth comes from requireAuth middleware
    if (!req.auth) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { type, text } = req.body;
    const { userId, role } = req.auth;

    let mediaUrl: string | undefined;
    let mediaPublicId: string | undefined;

    // 📦 Multer memoryStorage → buffer upload
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "dharmaputra/feedback",
          resource_type: type === "AUDIO" ? "video" : "auto",
        }
      );

      mediaUrl = uploadResult.secure_url;
      mediaPublicId = uploadResult.public_id;
    }

    const feedback = await Feedback.create({
      user: userId,
      role,
      type,
      text,
      mediaUrl,
      mediaPublicId,
    });

    return res.status(201).json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Create feedback error:", error);
    return res.status(500).json({
      message: "Failed to submit feedback",
    });
  }
};
