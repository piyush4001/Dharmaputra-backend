import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { setRole } from "../controllers/profile/setRole.controller";
import { setupSeniorProfile } from "../controllers/profile/setupSenior.controller";
import { setupFamilyProfile } from "../controllers/profile/setupFamily.controller";
import { getMyProfile } from "../controllers/profile/me.controller";
import { linkSenior } from "../controllers/profile/linkSenior.controller";
import { getFamilySeniors } from "../controllers/profile/getFamilySeniors.controller";
import { updateSeniorProfile } from "../controllers/profile/updateSeniorProfile.controller";
import { updateFamilyProfile } from "../controllers/profile/updateFamilyProfile.controller";
const router = Router();


router.post("/set-role", requireAuth, setRole);
router.post("/senior", requireAuth, setupSeniorProfile);
router.post("/family", requireAuth, setupFamilyProfile);
router.post("/family/link-senior", requireAuth, linkSenior);
router.get("/me", requireAuth, getMyProfile);
router.put("/senior", requireAuth, updateSeniorProfile);
router.get(
  "/family/seniors",
  requireAuth,
  getFamilySeniors,
);
router.put("/family", requireAuth, updateFamilyProfile);
export default router;
