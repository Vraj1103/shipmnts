import express from "express";
import { connectDb } from "./utils/connectDb.js";
import { config } from "dotenv";
import emailRoutes from "./routes/emailRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

config();

const app = express();

app.use(express.json());

connectDb();

app.use("/api", emailRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
