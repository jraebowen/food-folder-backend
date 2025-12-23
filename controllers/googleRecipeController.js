import {
  oauth2Client,
  getFileId,
  checkFileType,
  getDocInFolder,
  getDocContent,
  loadStoredGoogleToken,
} from "../utils/googleApi.js";

import { ERROR_STATUS, BadRequestError } from "../utils/errors.js";

export const importFromUrl = async (req, res, next) => {
  try {
    await loadStoredGoogleToken(oauth2Client);

    const url = req.body.url;
    if (!url) {
      throw new BadRequestError("No URL provided");
    }
    const id = getFileId(url);
    if (!id) {
      throw new BadRequestError("Invalid URL");
    }
    const fileData = await checkFileType(oauth2Client, id);

    let docs = [];

    if (fileData.mimeType === "application/vnd.google-apps.folder") {
      docs = await getDocInFolder(oauth2Client, id);
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
      const content = await getDocContent(oauth2Client, doc.id);
      recipes.push({ title: doc.name, content });
    }

    res.status(ERROR_STATUS.OK).json({ count: recipes.length, recipes });
  } catch (err) {
    next(err);
  }
};
