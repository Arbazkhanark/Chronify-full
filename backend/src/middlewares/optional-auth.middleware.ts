// src/middlewares/optional-auth.middleware.ts
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

/**
 * 🔓 Optional authentication middleware.
 *
 * - If a valid Bearer token is present → sets `req.user`.
 * - If token is missing/invalid → proceeds anonymously (no error).
 *
 * Use for public endpoints where "extra context if logged in" is nice
 * (e.g. public profile pages showing `isOwnProfile` / `isConnected`).
 */
export function optionalAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : undefined

  if (!token) return next()

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId?: string
      id?: string
    }
    const userId = payload.userId ?? payload.id
    if (userId) {
      req.user = { id: userId }
    }
  } catch {
    // Bad/expired token → silently treat as anonymous
  }

  return next()
}