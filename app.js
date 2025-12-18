import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

//test
app.get("/", (req, res) => {
  res.send("FoodFolder backend running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
