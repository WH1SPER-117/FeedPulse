import { Request, Response } from "express";
import Feedback from "../models/feedback.model";
import { analyzeFeedback } from "../services/gemini.service";

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { title, description, category, submitterName, submitterEmail } = req.body;

    // Validation
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    if (description.length < 20) {
      return res.status(400).json({
        success: false,
        message: "Description must be at least 20 characters",
      });
    }

    const feedback = await Feedback.create({
      title,
      description,
      category,
      submitterName,
      submitterEmail,
    });

    // 🔥 Trigger AI (non-blocking)
    analyzeAndUpdate(feedback._id.toString(), title, description);

    return res.status(201).json({
      success: true,
      data: feedback,
      message: "Feedback submitted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const analyzeAndUpdate = async (
  id: string,
  title: string,
  description: string
) => {
  try {
    const ai = await analyzeFeedback(title, description);

    if (!ai) return;

    await Feedback.findByIdAndUpdate(id, {
      ai_category: ai.category,
      ai_sentiment: ai.sentiment,
      ai_priority: ai.priority_score,
      ai_summary: ai.summary,
      ai_tags: ai.tags,
      ai_processed: true,
    });
  } catch (err) {
    console.error("AI update failed:", err);
  }
};