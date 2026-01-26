import { Router } from "express";
import { AdminRole } from "../constants/roles";

import { requireAdminAuth } from "../middlewares/auth.middleware";
import { requireAdminRole } from "../middlewares/role.middleware";
import { upload } from "../middlewares/upload.middleware";

/* ================= CONTROLLERS ================= */

// Auth
import { adminLogin } from "../controllers/admin/admin.controller";

// Admin management
import { createAdmin } from "../controllers/admin/createAdmin.controller";
import { listAdmins } from "../controllers/admin/listAdmins.controller";
import { toggleAdminStatus } from "../controllers/admin/toggleAdminStatus.controller";

// Dashboard
import { getDashboardStats } from "../controllers/admin/dashboardStats.controller";
import { getDashboardCharts } from "../controllers/admin/charts.controller";
import { getRecentSOS } from "../controllers/admin/recentSOS.controller";

// Users
import { getAdminUsers } from "../controllers/admin/user.controller";
import { getUserProfileByAdmin } from "../controllers/admin/getUserProfile.controller";

// Seniors
import {
  getAllSeniors,
  getSeniorById,
  getLinkedFamiliesBySenior,
  approveSenior,
} from "../controllers/admin/senior.controller";

// Families
import {
  getAllFamilies,
  getFamilyById,
  getLinkedSeniorsByFamily,
  approveFamily,
} from "../controllers/admin/family.controller";

// Linking
import {
  linkFamilyToSenior,
  unlinkFamilyFromSenior,
} from "../controllers/admin/link.controller";

// Feedbacks
import { getAllFeedbacks } from "../controllers/admin/feedback.controller";

const router = Router();

console.log("🔥 ADMIN ROUTES (TS) LOADED 🔥");

/* ================= PUBLIC ================= */
router.post("/login", adminLogin);

/* ================= SUPER ADMIN ================= */
router.post(
  "/create-admin",
  requireAdminAuth,
  requireAdminRole([AdminRole.SUPER_ADMIN]),
  createAdmin
);

router.get(
  "/admins",
  requireAdminAuth,
  requireAdminRole([AdminRole.SUPER_ADMIN]),
  listAdmins
);

router.patch(
  "/admins/:adminId/toggle-status",
  requireAdminAuth,
  requireAdminRole([AdminRole.SUPER_ADMIN]),
  toggleAdminStatus
);

/* ================= DASHBOARD ================= */
router.get(
  "/dashboard-stats",
  requireAdminAuth,
  requireAdminRole([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  getDashboardStats
);

router.get(
  "/dashboard-charts",
  requireAdminAuth,
  requireAdminRole([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  getDashboardCharts
);

router.get(
  "/recent-sos",
  requireAdminAuth,
  requireAdminRole([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  getRecentSOS
);

/* ================= USERS ================= */
router.get(
  "/users",
  requireAdminAuth,
  requireAdminRole([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  getAdminUsers
);

router.get(
  "/users/:userId/profile",
  requireAdminAuth,
  requireAdminRole([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  getUserProfileByAdmin
);

/* ================= SENIORS ================= */
router.get(
  "/seniors",
  requireAdminAuth,
  requireAdminRole([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  getAllSeniors
);

router.get(
  "/seniors/:id",
  requireAdminAuth,
  requireAdminRole([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  getSeniorById
);

router.get(
  "/seniors/:id/families",
  requireAdminAuth,
  requireAdminRole([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  getLinkedFamiliesBySenior
);

router.patch(
  "/seniors/:id/approve",
  requireAdminAuth,
  requireAdminRole([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  approveSenior
);

/* ================= FAMILIES ================= */
router.get(
  "/families",
  requireAdminAuth,
  requireAdminRole([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  getAllFamilies
);

router.get(
  "/families/:id",
  requireAdminAuth,
  requireAdminRole([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  getFamilyById
);

router.get(
  "/families/:id/seniors",
  requireAdminAuth,
  requireAdminRole([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  getLinkedSeniorsByFamily
);

router.patch(
  "/families/:id/approve",
  requireAdminAuth,
  requireAdminRole([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  approveFamily
);

/* ================= LINKING ================= */
router.post(
  "/link-family",
  requireAdminAuth,
  requireAdminRole([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  linkFamilyToSenior
);

router.post(
  "/unlink-family",
  requireAdminAuth,
  requireAdminRole([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  unlinkFamilyFromSenior
);

/* ================= FEEDBACKS ================= */
router.get(
  "/feedbacks",
  //🔐 Uncomment when admin auth is required
  requireAdminAuth,
  requireAdminRole([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  getAllFeedbacks
);

export default router;
