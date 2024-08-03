import express from "express";
import { connectDb } from "./utils/connectDb.js";
import { config } from "dotenv";
import emailRoutes from "./routes/emailRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import nodemailer from "nodemailer";

config();
const app = express();

app.use(express.json());

connectDb();
// app.get("/", (req, res) => {
//   res.send("Email Schdeuler by Vraj!");
// });
app.use("/api", emailRoutes);

// export const sendEmail = async (to, subject, text) => {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });

//   await transporter.sendMail({
//     // Add the 'from' address
//     to,
//     subject,
//     text,
//   });
// };
app.get("/", async (req, res) => {
  res.send("Email Scheduler by Vraj");
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
