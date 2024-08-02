import express from "express";
import {
  scheduleEmail,
  getScheduledEmails,
  getScheduledEmailById,
  deleteScheduledEmail,
} from "../controllers/emailController.js";

const router = express.Router();

router.post("/schedule-email", scheduleEmail);
router.get("/scheduled-emails", getScheduledEmails);
router.get("/scheduled-emails/:id", getScheduledEmailById);
router.delete("/scheduled-emails/:id", deleteScheduledEmail);

export default router;
