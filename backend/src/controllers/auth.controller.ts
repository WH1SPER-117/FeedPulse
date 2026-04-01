import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const ADMIN_EMAIL = "admin@feedpulse.com";
const ADMIN_PASSWORD = "feedadmin";

export const login = (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};