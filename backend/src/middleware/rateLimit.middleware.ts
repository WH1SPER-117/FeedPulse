import rateLimit from "express-rate-limit";

export const feedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    success: false,
    message: "Too many feedback submissions. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});