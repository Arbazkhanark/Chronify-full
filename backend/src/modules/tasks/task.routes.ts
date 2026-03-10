//src/modules/tasks/task.routes.ts
import { Router } from "express"
import { TaskController } from "./task.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rateLimiter } from "../../middlewares/rate.limiter"

const router = Router()

// Apply auth middleware to all routes
router.use(authMiddleware)

// Task CRUD operations
router.post("/", rateLimiter, TaskController.createTask)                    // Create task
router.get("/", rateLimiter, TaskController.getTasks)                       // Get all tasks with filters
router.get("/stats", rateLimiter, TaskController.getStatistics)             // Get task statistics
router.get("/:taskId", rateLimiter, TaskController.getTask)                 // Get specific task
router.put("/:taskId", rateLimiter, TaskController.updateTask)              // Update task
router.delete("/:taskId", rateLimiter, TaskController.deleteTask)           // Delete task
router.post("/:taskId/complete", rateLimiter, TaskController.completeTask)  // Mark task as complete

// Bulk operations
router.post("/bulk", rateLimiter, TaskController.bulkCreateTasks)           // Bulk create tasks
router.patch('/bulk-update',rateLimiter, TaskController.bulkUpdateTasks)
router.post('/bulk-delete',rateLimiter, authMiddleware, TaskController.bulkDeleteTasks);
router.post("/drag-drop", rateLimiter, TaskController.handleDragDrop)       // Handle drag and drop

// Filtered endpoints
router.get("/day/:day", rateLimiter, TaskController.getTasksByDay)          // Get tasks by day
router.get("/goal/:goalId", rateLimiter, TaskController.getTasksByGoal)     // Get tasks by goal

export default router