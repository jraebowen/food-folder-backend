import express from "express";
import {
  getGoogleAuth,
  googleCallback,
} from "../controllers/googleAuthController.js";

const router = express.Router();

router.get("/google", getGoogleAuth);
router.get("/google/callback", googleCallback);

export default router;
