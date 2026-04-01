import express from "express";
import { createFeedback } from "../controllers/feedback.controller";
import { getFeedbacks } from "../controllers/feedback.controller";
import { getFeedbackById } from "../controllers/feedback.controller";
import { updateFeedbackStatus } from "../controllers/feedback.controller";
import { deleteFeedback } from "../controllers/feedback.controller";
import { getFeedbackSummary } from "../controllers/feedback.controller";

const router = express.Router();

router.post("/", createFeedback);
router.get("/", getFeedbacks);
router.get("/summary", getFeedbackSummary);
router.get("/:id", getFeedbackById);
router.patch("/:id/status", updateFeedbackStatus);
router.delete("/:id", deleteFeedback);


export default router;