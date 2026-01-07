import express from "express";
import {
  validateId,
  createRecipeValidation,
  updateRecipeValidation,
} from "../middlewares/validation.js";
import {
  getAllRecipes,
  getSingleRecipe,
  deleteRecipe,
  updateRecipe,
  createRecipe,
} from "../controllers/recipeController.js";

const router = express.Router();

router.get("/", getAllRecipes);

router.get("/:recipeId", validateId, getSingleRecipe);

router.delete("/:recipeId", validateId, deleteRecipe);

router.patch("/:recipeId", updateRecipeValidation, updateRecipe);

router.post("/", createRecipeValidation, createRecipe);

export default router;
