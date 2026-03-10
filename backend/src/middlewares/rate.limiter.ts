// src/middlewares/rate.limiter.ts
import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

/**
 * Rate limiter for auth routes
 * Protects against brute force attacks
 */
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // max 10 requests per IP per window
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,

  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  },
});
