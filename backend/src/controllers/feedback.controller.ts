import { Request, Response } from "express";
import Feedback from "../models/feedback.model";
import { analyzeFeedback } from "../services/gemini.service";
import mongoose from "mongoose";


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

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "10", category, status, sentiment } = req.query;

    const query: any = {};

    // Filters
    if (category) query.category = category;
    if (status) query.status = status;
    if (sentiment) query.ai_sentiment = sentiment;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 }) // newest first
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Feedback.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: feedbacks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
      error: error.message,
    });
  }
};

import { Request, Response } from "express";
import mongoose from "mongoose";
import Feedback from "../models/feedback.model";

export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid feedback ID",
      });
    }

    // 2. Fetch feedback
    const feedback = await Feedback.findById(id);

    // 3. Not found case
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    // 4. Success
    return res.status(200).json({
      success: true,
      data: feedback,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
      error: error.message,
    });
  }
};


export const updateFeedbackStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["New", "In Review", "Resolved"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid feedback ID",
      });
    }

    const existing = await Feedback.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    if (existing.status === status) {
      return res.status(400).json({
        success: false,
        message: "Status already set",
      });
    }

    existing.status = status;
    await existing.save();

    return res.status(200).json({
      success: true,
      data: existing,
      message: "Status updated successfully",
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};


export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete feedback",
      error: error.message,
    });
  }
};

export const getFeedbackSummary = async (req: Request, res: Response) => {
  try {
    // Total count
    const total = await Feedback.countDocuments();

    // Category aggregation
    const byCategoryRaw = await Feedback.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    const byCategory: any = {};
    byCategoryRaw.forEach((item) => {
      byCategory[item._id] = item.count;
    });

    // Sentiment aggregation
    const bySentimentRaw = await Feedback.aggregate([
      { $group: { _id: "$ai_sentiment", count: { $sum: 1 } } }
    ]);

    const bySentiment: any = {};
    bySentimentRaw.forEach((item) => {
      bySentiment[item._id] = item.count;
    });

    // Average priority
    const avgPriorityRaw = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avg: { $avg: "$ai_priority" }
        }
      }
    ]);

    const avgPriority = avgPriorityRaw[0]?.avg || 0;

    return res.status(200).json({
      success: true,
      data: {
        total,
        byCategory,
        bySentiment,
        avgPriority,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate summary",
      error: error.message,
    });
  }
};