import express from "express";
import { createFeedback } from "../controllers/feedback.controller";
import { getFeedbacks } from "../controllers/feedback.controller";


const router = express.Router();

router.post("/", createFeedback);
router.get("/", getFeedbacks);

export default router;