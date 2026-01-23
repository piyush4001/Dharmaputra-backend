import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const getMe = (req: AuthRequest, res: Response) => {
  res.json({
    userId: req.auth!.userId,
    role: req.auth!.role,
  });
};
