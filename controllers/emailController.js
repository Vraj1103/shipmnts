import { ScheduledEmail } from "../models/ScheduledEmail.js";
import cron from "node-cron";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const formatDateForEmailController = (dateString) => {
  const date = new Date(dateString);

  if (isNaN(date)) {
    console.error("Invalid date format:", dateString);
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
};

export const scheduleEmail = async (req, res) => {
  let { recipient, subject, body, scheduleTime, recurring, attachments } =
    req.body;

  const actualScheduleTime =
    scheduleTime === "now"
      ? new Date().toISOString()
      : formatDateForEmailController(scheduleTime);
  scheduleTime = actualScheduleTime;

  const email = new ScheduledEmail({
    recipient,
    subject,
    body,
    scheduleTime,
    recurring,
    attachments,
  });

  await email.save();
  console.log("Email saved:", email);

  scheduleEmailJob(email);
  res.status(201).send(email);
  console.log("Email scheduled:", email);
  console.log("Email scheduled at time:", email.scheduleTime);
};

export const getScheduledEmails = async (req, res) => {
  const emails = await ScheduledEmail.find();
  res.send(emails);
};

export const getScheduledEmailById = async (req, res) => {
  const email = await ScheduledEmail.findById(req.params.id);
  if (!email) return res.status(404).send("Email not found");
  res.send(email);
};

export const deleteScheduledEmail = async (req, res) => {
  const email = await ScheduledEmail.findByIdAndDelete(req.params.id);
  if (!email) return res.status(404).send("Email not found");
  res.send(email);
};

const scheduleEmailJob = (email) => {
  const { scheduleTime, recurring } = email;
  const currentTime = new Date();

  console.log(
    "Scheduling email at:",
    scheduleTime,
    "Current time:",
    currentTime
  );

  if (scheduleTime === "now") {
    sendEmail(email);
  } else if (new Date(scheduleTime) > currentTime) {
    const delay = new Date(scheduleTime) - currentTime;
    console.log(`Email will be sent in ${delay} milliseconds`);
    setTimeout(() => {
      sendEmail(email);
      if (recurring !== "none") {
        rescheduleEmail(email);
      }
    }, delay);
  } else if (cron.validate(scheduleTime)) {
    console.log(`Scheduling email with cron expression: ${scheduleTime}`);
    cron.schedule(scheduleTime, () => {
      sendEmail(email);
      if (recurring !== "none") {
        rescheduleEmail(email);
      }
    });
  } else {
    console.error("Invalid cron expression or date:", scheduleTime);
  }
};

const rescheduleEmail = (email) => {
  const { recurring } = email;
  let nextScheduleTime;

  switch (recurring) {
    case "daily":
      nextScheduleTime = new Date(email.scheduleTime);
      nextScheduleTime.setDate(nextScheduleTime.getDate() + 1);
      break;
    case "weekly":
      nextScheduleTime = new Date(email.scheduleTime);
      nextScheduleTime.setDate(nextScheduleTime.getDate() + 7);
      break;
    case "monthly":
      nextScheduleTime = new Date(email.scheduleTime);
      nextScheduleTime.setMonth(nextScheduleTime.getMonth() + 1);
      break;
    default:
      console.error("Invalid recurring pattern:", recurring);
      return;
  }

  email.scheduleTime = nextScheduleTime.toISOString();
  email
    .save()
    .then(() => {
      scheduleEmailJob(email);
    })
    .catch((error) => {
      console.error("Error rescheduling email:", error);
    });
};

const sendEmail = (email) => {
  const { recipient, subject, body, attachments } = email;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject,
    text: body,
    attachments,
  };

  console.log("Sending email with options:", mailOptions);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
