import { getSeniorLinkRequests } from "../controllers/alerts/getSeniorLinkRequests.controller";
import { Router } from "express";
import { requireAuth} from "../middlewares/auth.middleware";
import { respondToLinkRequest } from "../controllers/alerts/respondToLinkRequest.controller";
import { getFamilyAlerts } from "../controllers/alerts/getFamilyAlerts.controller";
import { deleteFamilyAlert } from "../controllers/alerts/deleteFamilyAlert.controller"
const router = Router();

router.post(
  "/senior/link-requests/respond",
  requireAuth,
  respondToLinkRequest
);
router.get(
  "/senior/link-requests",
  requireAuth,
  getSeniorLinkRequests
);


router.get(
  "/family",
  requireAuth,
  getFamilyAlerts
);
router.delete("/alerts/:alertId", requireAuth, deleteFamilyAlert);

export default router;