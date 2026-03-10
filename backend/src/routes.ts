// src/routes.ts
import { Router } from "express";
import userRoutes from "./modules/user/user.routes";
import healthRouter from './db.routes/health'
import goalRoutes from "./modules/goals/goal.routes";
import taskRoutes from "./modules/tasks/task.routes";
import fixedTimeRoutes from "./modules/fixed-times/fixed-time.routes";
import sleepScheduleRoutes from "./modules/sleep-schedule/sleep-schedule.routes";
import timetableRoutes from "./modules/timetable/timetable.routes";


const router = Router();

router.use("/users", userRoutes);
router.use("/goals", goalRoutes);
router.use("/tasks", taskRoutes);
router.use("/fixed-times", fixedTimeRoutes); // Import fixed time routes
router.use("/sleep-schedules", sleepScheduleRoutes); // Import sleep schedule routes
router.use("/time-table", timetableRoutes); // Import timetable routes
// ✅ Add health routes
router.use('/health', healthRouter);

export default router;









