import express from "express";
import { connectDb } from "./utils/connectDb.js";
import { config } from "dotenv";
import emailRoutes from "./routes/emailRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cors from "cors";

config();
const app = express();

app.use(express.json());

connectDb();
// app.get("/", (req, res) => {
//   res.send("Email Schdeuler by Vraj!");
// });
app.use("/api", emailRoutes);
app.get("/", (req, res) => {
  res.send("Email Schdeuler by Vraj!");
});
app.use(cors());

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
