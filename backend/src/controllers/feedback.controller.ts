import { Request, Response } from "express";
import Feedback from "../models/feedback.model";

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