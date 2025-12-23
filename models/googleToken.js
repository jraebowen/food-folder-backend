import mongoose from "mongoose";

const googleTokenSchema = new mongoose.Schema(
  {
    //hidden until I add login details
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    //   unique: true,
    // },

    access_token: {
      type: String,
      required: true,
    },

    refresh_token: {
      type: String,
      required: true,
    },

    scope: {
      type: String,
    },

    token_type: {
      type: String,
    },

    expiry_date: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("GoogleToken", googleTokenSchema);
