import express from "express";
import {
  getAllRecipes,
  getSingleRecipe,
  deleteRecipe,
  updateRecipe,
  createRecipe,
} from "../controllers/recipeController.js";

const router = express.Router();

router.get("/", getAllRecipes);

router.get("/:recipeId", getSingleRecipe);

router.delete("/:recipeId", deleteRecipe);

router.put("/:recipeId", updateRecipe);

router.post("/", createRecipe);
