import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/googleAuthRoute.js";
import { errorHandler } from "./middlewares/error-handler.js";

const app = express();

const PORT = process.env.PORT || 3005;
const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.use(errorHandler); // centralized error handler

//test
app.get("/", (req, res) => {
  res.send("FoodFolder backend running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
