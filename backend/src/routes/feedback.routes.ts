import express from "express";
import { createFeedback } from "../controllers/feedback.controller";
import { getFeedbacks } from "../controllers/feedback.controller";
import { getFeedbackById } from "../controllers/feedback.controller";
import { updateFeedbackStatus } from "../controllers/feedback.controller";
import { deleteFeedback } from "../controllers/feedback.controller";
import { getFeedbackSummary } from "../controllers/feedback.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", createFeedback);
router.get("/", getFeedbacks);
router.get("/summary", getFeedbackSummary);
router.get("/:id", getFeedbackById);
router.patch("/:id/status", protect, updateFeedbackStatus);
router.delete("/:id", protect, deleteFeedback);


export default router;