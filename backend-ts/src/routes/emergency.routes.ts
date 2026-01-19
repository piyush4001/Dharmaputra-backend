import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { triggerEmergency } from "../controllers/emergency/triggerEmergency.controller";
import { getActiveEmergency } from "../controllers/emergency/getActiveEmergency.controller";
import { resolveEmergency } from "../controllers/emergency/resolveEmergency.controller";
import { cancelEmergency } from "../controllers/emergency/cancelEmergency.controller";

const router = Router();

router.post("/trigger", requireAuth, triggerEmergency);
router.get("/active", requireAuth, getActiveEmergency);
router.post("/resolve", requireAuth, resolveEmergency);
router.post("/cancel", requireAuth, cancelEmergency);

export default router;
