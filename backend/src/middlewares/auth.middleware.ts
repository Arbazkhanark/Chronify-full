// // src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("[AUTH] token received (first 40):", token?.slice(0, 40));

  if (!token) {
    console.log("[AUTH] ❌ No token");
    throw new AppError("Unauthorized", 401);
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      userId: string;
    };

    console.log("[AUTH] ✅ Verified userId:", payload.userId);

    req.user = {
      id: payload.userId,
    };

    next();
  } catch (err) {
    console.log("[AUTH] ❌ Verify failed:", err);
    console.log("[AUTH] JWT_SECRET (first 8):", process.env.JWT_SECRET?.slice(0, 8));
    throw new AppError("Invalid token", 401);
  }
};