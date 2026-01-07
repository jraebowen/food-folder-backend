import {
  oauth2Client,
  getFileId,
  checkFileType,
  getDocInFolder,
  getDocContent,
  loadStoredGoogleToken,
  parseRecipeTextFromGoogleDoc,
} from "../utils/googleApi.js";

import { ERROR_STATUS, BadRequestError } from "../utils/errors.js";

export const importFromGoogleUrl = async (req, res, next) => {
  try {
    // Load stored Google OAuth token
    await loadStoredGoogleToken(oauth2Client);

    const { url } = req.body;
    if (!url) throw new BadRequestError("No URL provided");

    const fileId = getFileId(url);
    if (!fileId) throw new BadRequestError("Invalid URL");

    const fileData = await checkFileType(oauth2Client, fileId);

    let docs = [];

    if (fileData.mimeType === "application/vnd.google-apps.folder") {
      docs = await getDocInFolder(oauth2Client, fileId);
    } else if (fileData.mimeType === "application/vnd.google-apps.document") {
      docs = [{ id: fileData.id, name: fileData.name }];
    } else {
      throw new BadRequestError("URL must be a Google Doc or Folder");
    }

    if (docs.length === 0) {
      throw new BadRequestError("No Google Docs found in this folder");
    }

    const recipes = [];

    for (const doc of docs) {
      const docData = await getDocContent(oauth2Client, doc.id);
      // Assuming docData has a `body` with `content` array
      const text =
        docData.body?.content
          .map(
            (c) =>
              c.paragraph?.elements?.map((e) => e.textRun?.content).join("") ||
              ""
          )
          .join("\n") || "";

      const parsedRecipe = parseRecipeTextFromGoogleDoc(text);
      recipes.push(parsedRecipe);

      // Save to DB
      await Recipe.create(parsedRecipe);
    }

    res.status(ERROR_STATUS.OK).json({ count: recipes.length, recipes });
  } catch (err) {
    next(err);
  }
};
