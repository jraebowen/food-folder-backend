import { Joi, celebrate, Segments } from "celebrate";

export const validateId = celebrate({
  params: Joi.object().keys({
    recipeId: Joi.string().alphanum().length(24),
  }),
});

export const createRecipeValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(2).required(),
    source: Joi.string().allow(""),
    sourceUrl: Joi.string().uri().allow(""),
    textContent: Joi.string().allow(""),
    servings: Joi.string().required(),
    ingredients: Joi.array().items(Joi.string()).required(),
    directions: Joi.array().items(Joi.string()).required(),
  }),
});

export const updateRecipeValidation = celebrate({
  [Segments.BODY]: Joi.object()
    .keys({
      title: Joi.string().min(2).required(),
      source: Joi.string(),
      sourceUrl: Joi.string().uri(),
      textContent: Joi.string(),
      servings: Joi.string().min(1),
      ingredients: Joi.array().items(Joi.string()),
      directions: Joi.array().items(Joi.string()),
    })
    .min(1),
});
