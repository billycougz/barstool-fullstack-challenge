import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDb } from "./db.js";
import getData from "./controller.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use("/api/v1/boxscore", getData);
app.use("*", (req, res) => res.status(404).json({ error: "Not found" }));

connectToDb(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});

export default app;
