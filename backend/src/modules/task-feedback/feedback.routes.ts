// src/modules/feedback/feedback.routes.ts

// src/modules/feedback/feedback.routes.ts

import { Router } from "express"
import { FeedbackController } from "./feedback.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rateLimiter } from "../../middlewares/rate.limiter"

const router = Router()

router.use(authMiddleware)

// Submit feedback for completed task
router.post("/tasks/:taskId", rateLimiter, FeedbackController.submitTaskFeedback)

// Update existing feedback
router.put("/:feedbackId", rateLimiter, FeedbackController.updateFeedback)

// Get feedback for a task
router.get("/tasks/:taskId", rateLimiter, FeedbackController.getTaskFeedback)

// Get all feedbacks for user
router.get("/", rateLimiter, FeedbackController.getAllFeedbacks)

// Get feedback statistics
router.get("/stats", rateLimiter, FeedbackController.getFeedbackStats)

export default router