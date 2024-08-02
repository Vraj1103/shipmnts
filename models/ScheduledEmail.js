import mongoose from "mongoose";

const ScheduledEmailSchema = new mongoose.Schema({
  recipient: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  scheduleTime: { type: Date, required: true },
  recurring: {
    type: String,
    enum: ["none", "daily", "weekly", "monthly", "quarterly"],
    default: "none",
  },
  attachments: [{ filename: String, path: String }],
});

export const ScheduledEmail = mongoose.model(
  "ScheduledEmail",
  ScheduledEmailSchema
);
