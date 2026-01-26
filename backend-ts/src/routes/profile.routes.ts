import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { setRole } from '../controllers/profile/setRole.controller';
import { setupSeniorProfile } from '../controllers/profile/setupSenior.controller';
import { setupFamilyProfile } from '../controllers/profile/setupFamily.controller';
import { getMyProfile } from '../controllers/profile/me.controller';
import { linkSenior } from '../controllers/profile/linkSenior.controller';
import { getFamilySeniors } from '../controllers/profile/getFamilySeniors.controller';
import { updateSeniorProfile } from '../controllers/profile/updateSeniorProfile.controller';
import { updateFamilyProfile } from '../controllers/profile/updateFamilyProfile.controller';
import { getSeniorFamilyMembers } from '../controllers/profile/getSeniorFamilys.controller';
import { setupHelperProfile } from '../controllers/profile/setupHelper.controller';
import { unlinkSeniorFamily } from '../controllers/profile/unlinkSeniorFamily';
import { getHelperLinkedSeniors } from '../controllers/profile/getHelperSeniors.controller';
import { linkSeniorByHelper } from '../controllers/profile/linkSeniorByHelper.controller';
import { updateHelperProfile } from '../controllers/profile/updateHelper.controller';
import { upload } from '../middlewares/upload.middleware';
const router = Router();
import { uploadIdCard } from '../controllers/profile/uploadIdCard.controller';

router.post('/set-role', requireAuth, setRole);
// router.post('/senior', requireAuth, setupSeniorProfile);
// router.post('/family', requireAuth, setupFamilyProfile);
router.post('/family/link-senior', requireAuth, linkSenior);
router.get('/me', requireAuth, getMyProfile);
router.put('/senior', requireAuth, updateSeniorProfile);
router.get('/family/seniors', requireAuth, getFamilySeniors);
router.get('/senior/family', requireAuth, getSeniorFamilyMembers);

router.put('/family', requireAuth, updateFamilyProfile);
router.post('/unlink', requireAuth, unlinkSeniorFamily);
router.post('/helper/setup', requireAuth, setupHelperProfile);
router.get('/helper/seniors', requireAuth, getHelperLinkedSeniors);
router.post('/helper/link-senior', requireAuth, linkSeniorByHelper);
router.put('/helper', requireAuth, updateHelperProfile);
// router.get("/helper", (req, res) => {
//   res.json({ ok: true, method: "GET" });
// });

router.post(
  '/setup/senior',
  requireAuth,
  upload.single('profileImage'),
  setupSeniorProfile,
);

router.post(
  '/setup/family',
  requireAuth,
  upload.single('profileImage'),
  setupFamilyProfile,
);

router.post(
  '/setup/helper',
  requireAuth,
  upload.single('profileImage'),
  setupHelperProfile,
);
router.post('/upload-id', requireAuth, upload.single('idCard'), uploadIdCard);

export default router;
