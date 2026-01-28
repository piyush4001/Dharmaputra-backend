import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { User } from "../../models/User.model";

export const savePushToken = async (
  req: AuthRequest,
  res: Response
) => {
  const { userId } = req.auth!;
  const { pushToken } = req.body;

  if (!pushToken) {
    return res.status(400).json({ message: "Token required" });
  }

  await User.findByIdAndUpdate(userId, {
    $addToSet: { pushTokens: pushToken },
  });

  res.json({ message: "Push token saved" });
};
