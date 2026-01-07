import Recipe from "../models/recipe.js";
import { BadRequestError, ERROR_STATUS } from "../utils/errors.js";
import { NotFoundError } from "../utils/errors.js";

export const getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find();
    res.status(ERROR_STATUS.OK).json(recipes);
  } catch (err) {
    next(err);
  }
};

export const getSingleRecipe = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestError("Invalid recipe ID format");
    }

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      throw new NotFoundError("Recipe not found");
    }

    res.status(ERROR_STATUS.OK).json(recipe);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid recipe ID format"));
    }
    next(err);
  }
};

export const deleteRecipe = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestError("Invalid recipe ID format");
    }
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      throw new NotFoundError("Recipe not found");
    }
    await Recipe.findByIdAndDelete(recipeId);
    res.send({ message: "Recipe deleted" });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid recipe ID format"));
    }
    next(err);
  }
};

export const updateRecipe = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestError("Invalid recipe ID format");
    }
    const updates = req.body;
    const recipe = await Recipe.findByIdAndUpdate(recipeId, updates, {
      new: true,
      runValidators: true,
    });

    if (!recipe) {
      throw new NotFoundError("Recipe not found");
    }
    res.status(ERROR_STATUS.OK).json(recipe);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid recipe ID format"));
    }
    next(err);
  }
};

export const createRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(ERROR_STATUS.CREATED).json(recipe);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid recipe data"));
    }
    next(err);
  }
};
