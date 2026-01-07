import { Joi, celebrate, Segments } from "celebrate";

export const validateId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    recipeId: Joi.string().alphanum().length(24).required().messages({
      "string.base": "Recipe ID must be a string",
      "string.empty": "Recipe ID is required",
      "string.alphanum": "Recipe ID must only contain alphanumeric characters",
      "string.length": "Recipe ID must be exactly 24 characters",
      "any.required": "Recipe ID is required",
    }),
  }),
});

export const createRecipeValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(2).required().messages({
      "string.base": "Title must be a string",
      "string.empty": "Title is required",
      "string.min": "Title must be at least 2 characters",
      "any.required": "Title is required",
    }),
    source: Joi.string().allow("").messages({
      "string.base": "Source must be a string",
    }),
    sourceUrl: Joi.string().uri().allow("").messages({
      "string.uri": "Source URL must be a valid URL",
      "string.base": "Source URL must be a string",
    }),
    textContent: Joi.string().allow("").messages({
      "string.base": "Text content must be a string",
    }),
    servings: Joi.number().min(1).required().messages({
      "number.base": "Servings must be a number",
      "number.min": "Servings must be at least 1",
      "any.required": "Servings is required",
    }),
    ingredients: Joi.array().items(Joi.string()).required().messages({
      "array.base": "Ingredients must be an array",
      "any.required": "Ingredients are required",
    }),
    directions: Joi.array().items(Joi.string()).required().messages({
      "array.base": "Directions must be an array",
      "any.required": "Directions are required",
    }),
  }),
});

export const updateRecipeValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(2).messages({
      "string.base": "Title must be a string",
      "string.min": "Title must be at least 2 characters",
    }),
    source: Joi.string().messages({
      "string.base": "Source must be a string",
    }),
    sourceUrl: Joi.string().uri().messages({
      "string.uri": "Source URL must be a valid URL",
      "string.base": "Source URL must be a string",
    }),
    textContent: Joi.string().messages({
      "string.base": "Text content must be a string",
    }),
    servings: Joi.number().min(1).messages({
      "number.base": "Servings must be a number",
      "number.min": "Servings must be at least 1",
    }),
    ingredients: Joi.array().items(Joi.string()).messages({
      "array.base": "Ingredients must be an array of strings",
    }),
    directions: Joi.array().items(Joi.string()).messages({
      "array.base": "Directions must be an array of strings",
    }),
  }),
});

export const importFromGoogleValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    url: Joi.string().uri().required().messages({
      "string.empty": "URL is required",
      "string.uri": "URL must be a valid URI",
    }),
    sourceType: Joi.string().valid("google").required().messages({
      "any.only": "sourceType must be 'google'",
      "string.empty": "sourceType is required",
    }),
  }),
});
