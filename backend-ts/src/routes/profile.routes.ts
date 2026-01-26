import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

/* ================= CONTROLLERS ================= */

// Role & profile basics
import { setRole } from "../controllers/profile/setRole.controller";
import { getMyProfile } from "../controllers/profile/me.controller";

// Senior
import { setupSeniorProfile } from "../controllers/profile/setupSenior.controller";
import { updateSeniorProfile } from "../controllers/profile/updateSeniorProfile.controller";
import { getSeniorFamilyMembers } from "../controllers/profile/getSeniorFamilys.controller";

// Family
import { setupFamilyProfile } from "../controllers/profile/setupFamily.controller";
import { updateFamilyProfile } from "../controllers/profile/updateFamilyProfile.controller";
import { linkSenior } from "../controllers/profile/linkSenior.controller";
import { getFamilySeniors } from "../controllers/profile/getFamilySeniors.controller";

// Helper
import { setupHelperProfile } from "../controllers/profile/setupHelper.controller";
import { updateHelperProfile } from "../controllers/profile/updateHelper.controller";
import { getHelperLinkedSeniors } from "../controllers/profile/getHelperSeniors.controller";
import { linkSeniorByHelper } from "../controllers/profile/linkSeniorByHelper.controller";

// Common
import { unlinkSeniorFamily } from "../controllers/profile/unlinkSeniorFamily";
import { uploadIdCard } from "../controllers/profile/uploadIdCard.controller";

const router = Router();

/* ================= BASIC ================= */
router.post("/set-role", requireAuth, setRole);
router.get("/me", requireAuth, getMyProfile);

/* ================= SENIOR ================= */
// Legacy (no image)
router.post("/senior", requireAuth, setupSeniorProfile);
router.put("/senior", requireAuth, updateSeniorProfile);
router.get("/senior/family", requireAuth, getSeniorFamilyMembers);

// New (with image)
router.post(
  "/setup/senior",
  requireAuth,
  upload.single("profileImage"),
  setupSeniorProfile
);

/* ================= FAMILY ================= */
// Legacy
router.post("/family", requireAuth, setupFamilyProfile);
router.put("/family", requireAuth, updateFamilyProfile);
router.post("/family/link-senior", requireAuth, linkSenior);
router.get("/family/seniors", requireAuth, getFamilySeniors);

// New (with image)
router.post(
  "/setup/family",
  requireAuth,
  upload.single("profileImage"),
  setupFamilyProfile
);

/* ================= HELPER ================= */
// Legacy
router.post("/helper/setup", requireAuth, setupHelperProfile);
router.put("/helper", requireAuth, updateHelperProfile);
router.get("/helper/seniors", requireAuth, getHelperLinkedSeniors);
router.post("/helper/link-senior", requireAuth, linkSeniorByHelper);

// New (with image)
router.post(
  "/setup/helper",
  requireAuth,
  upload.single("profileImage"),
  setupHelperProfile
);

/* ================= COMMON ================= */
router.post("/unlink", requireAuth, unlinkSeniorFamily);
router.post(
  "/upload-id",
  requireAuth,
  upload.single("idCard"),
  uploadIdCard
);

export default router;
