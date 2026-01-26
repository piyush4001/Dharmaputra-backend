import { Router } from "express";
import { createFeedback } from "../controllers/feedback/createFeedback.controller";
import {requireAuth} from "../middlewares/auth.middleware";
import upload from ".././middlewares/multer.middleware"

const router = Router();

router.post(
  "/",
  requireAuth,
  upload.single("media"),
  createFeedback
);

export default router;
