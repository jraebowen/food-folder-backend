import GoogleToken from "../models/googleToken.js";
import { oauth2Client } from "../utils/googleApi.js";

//authorization url & redirect user
export const getGoogleAuth = (req, res, next) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/drive.readonly",
        "https://www.googleapis.com/auth/documents.readonly",
      ],
    });

    res.redirect(url);
  } catch (err) {
    next(err);
  }
};

//receive authorization code and exchange for tokens
export const googleCallback = async (req, res, next) => {
  try {
    const code = req.query.code;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    await GoogleToken.findOneAndUpdate({}, tokens, { upsert: true, new: true });

    res.redirect("http://localhost:3004/");
  } catch (err) {
    next({ status: 500, message: "Failed to authenticate with Google" });
  }
};
