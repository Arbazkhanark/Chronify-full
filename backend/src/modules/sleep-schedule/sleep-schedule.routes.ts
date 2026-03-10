// src/modules/sleep-schedule/sleep-schedule.routes.ts

import { Router } from "express"
import { SleepScheduleController } from "./sleep-schedule.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rateLimiter } from "../../middlewares/rate.limiter"

const router = Router()

// Apply auth middleware to all routes
router.use(authMiddleware)

// CRUD operations
router.post("/", rateLimiter, SleepScheduleController.createSleepSchedule)                    // Create schedule
router.post("/bulk", rateLimiter, SleepScheduleController.bulkCreateSleepSchedules)          // Bulk create/update
router.patch("/bulk", rateLimiter, SleepScheduleController.bulkUpdateSleepSchedules);
router.post("/bulk-delete", rateLimiter, SleepScheduleController.bulkDeleteSleepSchedules);

router.get("/", rateLimiter, SleepScheduleController.getSleepSchedules)                      // Get all schedules
router.get("/stats", rateLimiter, SleepScheduleController.getSleepStatistics)                // Get sleep statistics
router.get("/day/:day", rateLimiter, SleepScheduleController.getSleepScheduleByDay)          // Get schedule by day
router.get("/:scheduleId", rateLimiter, SleepScheduleController.getSleepSchedule)            // Get schedule by ID

// Update operations
router.put("/:scheduleId", rateLimiter, SleepScheduleController.updateSleepSchedule)         // Update schedule
router.put("/day/:day", rateLimiter, SleepScheduleController.updateSleepScheduleByDay)       // Update schedule by day
router.patch("/:scheduleId/toggle", rateLimiter, SleepScheduleController.toggleSleepSchedule) // Toggle active status

// Special operations
router.post("/apply-to-all", rateLimiter, SleepScheduleController.applyToAllDays)            // Apply to all days
router.post("/regenerate-tasks", rateLimiter, SleepScheduleController.regenerateSleepTasks)  // Regenerate sleep tasks

// Delete operations
router.delete("/:scheduleId", rateLimiter, SleepScheduleController.deleteSleepSchedule)      // Delete schedule
router.delete("/day/:day", rateLimiter, SleepScheduleController.deleteSleepScheduleByDay)    // Delete schedule by day

export default router