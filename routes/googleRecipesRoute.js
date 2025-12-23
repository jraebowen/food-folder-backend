import express from "express";
import { importFromUrl } from "../controllers/googleRecipeController.js";

const router = express.Router();

router.post("/import", importFromUrl);

export default router;
