import { sendOtp } from "../controllers/auth/sendOtp.controller";
import { verifyOtp } from "../controllers/auth/verifyOtp.controller";
import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../middlewares/auth.middleware";
import {User} from "../models/User.model";

const router = Router();
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/me", requireAuth, async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.auth!.userId).select("role");

  res.json({
    userId: req.auth!.userId,
    role: user?.role ?? null,
  });
});
export default router;
