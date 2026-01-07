import { google } from "googleapis";
import GoogleToken from "../models/googleToken.js";
import { BadRequestError } from "../utils/errors.js";

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.on("tokens", async (tokens) => {
  if (tokens.access_token) {
    await GoogleToken.findOneAndUpdate({}, tokens, { upsert: true, new: true });
  }
});

//get token
export const loadStoredGoogleToken = async (oauth2Client) => {
  const token = await GoogleToken.findOne();

  if (!token) {
    throw new BadRequestError("Google account not verified");
  }

  oauth2Client.setCredentials({
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    expiry_date: token.expiry_date,
  });
  return oauth2Client;
};

const folderFileType = "application/vnd.google-apps.folder";
const docFileType = "application/vnd.google-apps.document";

//get file ID
export const getFileId = (url) => {
  if (!url) return null;
  const match = url.match(/[-\w]{25,}/);
  return match ? match[0] : null;
};

//check if folder or doc
export const checkFileType = async (auth, fileId) => {
  const drive = google.drive({ version: "v3", auth });

  const res = await drive.files.get({
    fileId,
    fields: "id, name, mimeType",
  });
  return res.data;
};

//get docs in folder
export const getDocInFolder = async (auth, folderId, pageToken = null) => {
  const drive = google.drive({ version: "v3", auth });

  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false`,
    fields: "nextPageToken, files(id, name, mimeType)",
    pageSize: 100,
    pageToken,
  });

  let results = [];
  for (const file of res.data.files) {
    if (file.mimeType === docFileType) {
      results.push({ id: file.id, name: file.name });
    } else if (file.mimeType === folderFileType) {
      const subDocs = await getDocInFolder(auth, file.id);
      results = results.concat(subDocs);
    }
  }
  if (res.data.nextPageToken) {
    const nextPageDocs = await getDocInFolder(
      auth,
      folderId,
      res.data.nextPageToken
    );
    results = results.concat(nextPageDocs);
  }
  return results;
};

export const getDocContent = async (auth, documentId) => {
  const docs = google.docs({ version: "v1", auth });

  const res = await docs.documents.get({
    documentId,
  });

  return res.data;
};

//get text from docs
export const parseRecipeTextFromGoogleDoc = (text) => {
  if (!text) return null;

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  let title = "";
  let servings = "";
  const ingredients = [];
  const directions = [];

  let section = ""; // tracks which part we're in

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect the title (first non-empty line)
    if (i === 0) {
      title = line;
      continue;
    }

    // Detect servings (looks like it contains "servings")
    if (!servings && /servings?/i.test(line)) {
      servings = line;
      continue;
    }

    // Detect sections
    if (/^ingredients:/i.test(line)) {
      section = "ingredients";
      continue;
    } else if (/^directions:/i.test(line)) {
      section = "directions";
      continue;
    }

    // Add lines to current section
    if (section === "ingredients") {
      ingredients.push(line);
    } else if (section === "directions") {
      directions.push(line);
    }
  }

  return {
    title,
    servings,
    ingredients,
    directions,
  };
};
