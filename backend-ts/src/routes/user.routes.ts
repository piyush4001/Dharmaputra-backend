import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
// import { setUserRole } from "../controllers/user/setRole.controller";

const router = Router();

// // Set role for logged-in user
// router.post("/role", requireAuth, setUserRole);

export default router;
