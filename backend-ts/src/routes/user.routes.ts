import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
// import { setUserRole } from "../controllers/user/setRole.controller";
import { savePushToken } from "../controllers/user/savePushToken.controller";
const router = Router();

// // Set role for logged-in user
// router.post("/role", requireAuth, setUserRole);
router.post(
  "/push-token",
  requireAuth,
  savePushToken
);

export default router;
