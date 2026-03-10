// src/modules/fixed-times/fixed-time.routes.ts
import { Router } from "express"
import { FixedTimeController } from "./fixed-time.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rateLimiter } from "../../middlewares/rate.limiter"

const router = Router()

// Apply auth middleware to all routes
router.use(authMiddleware)

// Fixed Time CRUD operations
router.post("/", rateLimiter, FixedTimeController.createFixedTime)           // Create fixed time
router.get("/", rateLimiter, FixedTimeController.getFixedTimes)              // Get all fixed times
// router.get("/:fixedTimeId", rateLimiter, FixedTimeController.getFixedTime)   // Get specific fixed time
router.put("/:fixedTimeId", rateLimiter, FixedTimeController.updateFixedTime) // Update fixed time
router.delete("/:fixedTimeId", rateLimiter, FixedTimeController.deleteFixedTime) // Delete fixed time

// Free Period operations
router.post("/:fixedTimeId/free-periods", rateLimiter, FixedTimeController.addFreePeriod)     // Add free period
router.put("/:fixedTimeId/free-periods/:freePeriodId", rateLimiter, FixedTimeController.updateFreePeriod) // Update free period
router.delete("/:fixedTimeId/free-periods/:freePeriodId", rateLimiter, FixedTimeController.deleteFreePeriod) // Delete free period

// Tasks in fixed time
router.get("/:fixedTimeId/tasks", rateLimiter, FixedTimeController.getTasksInFixedTime) // Get tasks in fixed time



router.post("/bulk", rateLimiter,authMiddleware, FixedTimeController.bulkCreateFixedTimes);
router.patch("/bulk", rateLimiter,authMiddleware, FixedTimeController.bulkUpdateFixedTimes);
router.post("/bulk-delete", rateLimiter,authMiddleware, FixedTimeController.bulkDeleteFixedTimes);
// ya phir POST /bulk-delete bhi daal sakte ho agar body ke saath delete prefer karte ho



// Bulk operations for free periods
router.post("/free-periods/bulk", rateLimiter,authMiddleware, FixedTimeController.bulkAddMultipleFreePeriods); // This is for create and Update Both 
router.post("/free-periods/bulk-delete", rateLimiter,authMiddleware, FixedTimeController.bulkDeleteFreePeriods);


router.get("/get-free-periods", rateLimiter, FixedTimeController.getAllFreePeriods);

export default router