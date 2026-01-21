import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { triggerEmergency } from "../controllers/emergency/triggerEmergency.controller";
import { getActiveEmergency } from "../controllers/emergency/getActiveEmergency.controller";
import { resolveEmergency } from "../controllers/emergency/resolveEmergency.controller";
import { cancelEmergency } from "../controllers/emergency/cancelEmergency.controller";
import { getFamilySOSAlerts } from "../controllers/emergency/getFamilySOS.contoller";
import { respondEmergency } from "../controllers/emergency/respondEmergency.controller";
const router = Router();

router.post("/sos", requireAuth, triggerEmergency);
router.get("/active", requireAuth, getActiveEmergency);
router.post("/resolve", requireAuth, resolveEmergency);
router.post("/cancel", requireAuth, cancelEmergency);
router.post("/respond", requireAuth, respondEmergency);
router.get(
  "/family/sos",
  requireAuth,
  getFamilySOSAlerts
);
router.get("/test", (_req, res) => {
  res.json({ ok: true });
});

export default router;
