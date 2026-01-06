import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    source: {
      type: String,
    },
    sourceUrl: {
      type: String,
    },
    textContent: {
      type: String,
    },
    servings: {
      type: String,
    },
    ingredients: {
      type: [String],
      default: [],
    },

    directions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema);
