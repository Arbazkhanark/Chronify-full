// src/modules/goals/goal.routes.ts
import { Router } from "express"
import { GoalController } from "./goal.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rateLimiter } from "../../middlewares/rate.limiter"

const router = Router()

// Apply auth middleware to all routes
router.use(authMiddleware)

// Goal CRUD operations
router.post("/", rateLimiter , GoalController.createGoal)                     // Create goal  TESTED
router.get("/", rateLimiter, GoalController.getGoals)                        // Get all goals with filters
router.get("/stats", rateLimiter, GoalController.getStatistics)              // Get goal statistics
router.get("/:goalId", rateLimiter, GoalController.getGoal)                  // Get specific goal  TESTED
router.put("/:goalId", rateLimiter, GoalController.updateGoal)               // Update goal
router.delete("/:goalId", rateLimiter, GoalController.deleteGoal)            // Delete goal

// Goal progress
router.post("/:goalId/progress", rateLimiter, GoalController.updateProgress) // Update goal progress

// Milestone operations
router.post("/:goalId/milestones", rateLimiter, GoalController.addMilestone)        // Add milestone
router.put("/:goalId/milestones/:milestoneId", rateLimiter, GoalController.updateMilestone) // Update milestone
router.delete("/:goalId/milestones/:milestoneId", rateLimiter, GoalController.deleteMilestone) // Delete milestone

export default router