import express from "express";
import { createFeedback } from "../controllers/feedback.controller";
import { getFeedbacks } from "../controllers/feedback.controller";
import { getFeedbackById } from "../controllers/feedback.controller";
import { updateFeedbackStatus } from "../controllers/feedback.controller";
import { deleteFeedback } from "../controllers/feedback.controller";
import { getFeedbackSummary } from "../controllers/feedback.controller";
import { protect } from "../middleware/auth.middleware";
import { regenerateAI } from "../controllers/feedback.controller";
import { feedbackLimiter } from "../middleware/rateLimit.middleware";


const router = express.Router();

router.post("/", feedbackLimiter, createFeedback);
router.get("/", getFeedbacks);
router.get("/summary", getFeedbackSummary);
router.get("/:id", getFeedbackById);
router.patch("/:id/status", protect, updateFeedbackStatus);
router.delete("/:id", protect, deleteFeedback);
router.post("/:id/regenerate-ai", protect, regenerateAI);

export default router;