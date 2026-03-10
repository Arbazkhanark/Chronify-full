// src/modules/timetable/timetable.service.ts

import { TimetableRepository } from './timetable.repository'
import {
  GetTimetableDTO,
  GetTimetableResponse,
  TimetableTask,
  SmartDelayRequestDTO,
  SmartDelayResponseDTO,
  SmartDelayOption,
  ApplySmartDelayDTO,
  TaskFeedbackDTO,
  TaskFeedbackResponse,
  UpdateTaskStatusDTO,
  SimpleDelayDTO,
  RescheduleToFreePeriodDTO,
  BulkCompleteDTO,
  BulkDelayDTO,
  TimetableStats,
  BedtimeInfo,
  GracePeriodTask,
} from './timetable.types'
import { AppError } from '../../utils/AppError'
import { logger } from 'patal-log'
import { DayOfWeek } from './timetable.types'
import { TaskRepository } from '../tasks/task.repository'
import { SleepScheduleRepository } from '../sleep-schedule/sleep-schedule.repository'
import { FixedTimeRepository } from '../fixed-times/fixed-time.repository'
import { GoalRepository } from '../goals/goal.repository'
import { TaskStatus } from '../../utils/enums'
import z from 'zod'
import { lockTimetableSchema, timetableFilterSchema } from './timetable.validation'




  // src/modules/timetable/timetable.service.ts

// Add this interface at the top
interface TimeSlot {
  startTime: string;
  endTime: string;
  type: "SLEEP" | "FIXED" | "FREE" | "TASK" | "BREAK" | "OTHER";
  title: string;
  description?: string | null;
  fixedTimeId?: string;
  freePeriodId?: string;
  taskId?: string;
  sleepScheduleId?: string;
  color?: string;
  status?: string;
  priority?: string;
  category?: string;
  subject?: string | null;
  duration?: number;
}

interface DayTimetable {
  day: string;
  date: string;
  slots: TimeSlot[];
}



type TimetableFilter = z.infer<typeof timetableFilterSchema>;

interface TimeSlot {
  startTime: string;
  endTime: string;
  type: "SLEEP" | "FIXED" | "FREE" | "TASK" | "BREAK" | "OTHER";
  title: string;
  description?: string;
  fixedTimeId?: string;
  freePeriodId?: string;
  taskId?: string;
  sleepScheduleId?: string;
}

interface DayTimetable {
  day: string;
  slots: TimeSlot[];
}


interface ResetTimetableResult {
  deletedTasks: number;
  deletedFixedTimes: number;
  deletedSleepSchedules: number;
  deletedFreePeriods: number;
}

export class TimetableService {
  
  // ==================== 📅 TIMETABLE VIEWS ====================
  
  /**
   * Get timetable for today or specific day
   */
  static async getTimetable(
    userId: string,
    query: GetTimetableDTO
  ): Promise<GetTimetableResponse[]> {
    logger.info('Getting timetable', {
      functionName: 'TimetableService.getTimetable',
      metadata: { userId, day: query.day || 'today' }
    })

    // Determine which days to fetch
    let days: DayOfWeek[] = []
    if (query.day) {
      days = [query.day as DayOfWeek]
    } else {
      // Get today and maybe weekdays/weekends based on showWeekends
      const today = this.getTodayDay()
      if (query.showWeekends) {
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      } else {
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      }
      // Move today to front
      days = [today, ...days.filter(d => d !== today)]
    }

    // Get bedtime for today
    const todayBedtime = await this.getTodayBedtime(userId)

    // Fetch tasks for each day
    const timetable: GetTimetableResponse[] = []
    
    for (const day of days) {
      const tasks = await TimetableRepository.getTasksByDay(userId, day, {
        timeRangeStart: query.timeRangeStart,
        timeRangeEnd: query.timeRangeEnd,
      })

      // Transform tasks to TimetableTask format
      const transformedTasks = await Promise.all(
        tasks.map(task => this.transformToTimetableTask(task, todayBedtime))
      )

      // Calculate stats for this day
      const stats = this.calculateDayStats(transformedTasks)

      timetable.push({
        day,
        date: this.getDateForDay(day).toISOString(),
        isToday: day === this.getTodayDay(),
        tasks: transformedTasks,
        stats
      })
    }

    logger.info('Timetable fetched successfully', {
      functionName: 'TimetableService.getTimetable',
      metadata: { userId, daysCount: timetable.length }
    })

    return timetable
  }








// Add this method to the TimetableService class
/**
 * Get full timetable with all slots (sleep, fixed, free, tasks)
 */
static async getFullTimetable(
  userId: string, 
  filters: { day?: string }
): Promise<DayTimetable[]> {
  logger.info("Fetching full timetable", {
    functionName: "TimetableService.getFullTimetable",
    metadata: { userId, filters }
  });

  // Define all days of the week
  const allDays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  
  // If specific day is requested, use only that day
  const days = filters.day ? [filters.day] : allDays;

  const timetable: DayTimetable[] = [];

  // Fetch all data in parallel
  const [fixedTimes, sleepSchedules, tasks] = await Promise.all([
    TimetableRepository.getFixedTimes(userId),
    TimetableRepository.getSleepSchedules(userId),
    TimetableRepository.getAllTasks(userId)
  ]);

  logger.debug("Fetched data for full timetable", {
    functionName: "TimetableService.getFullTimetable",
    metadata: { 
      fixedTimesCount: fixedTimes.length,
      sleepSchedulesCount: sleepSchedules.length,
      tasksCount: tasks.length
    }
  });

  // Process each day
  for (const day of days) {
    const daySlots: TimeSlot[] = [];
    const today = new Date();
    const dayDate = new Date(today);
    
    // Calculate date for this day of week
    const dayIndex = allDays.indexOf(day);
    const todayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, ...
    const adjustedTodayIndex = todayIndex === 0 ? 6 : todayIndex - 1; // Convert to Monday=0, Sunday=6
    
    let diff = dayIndex - adjustedTodayIndex;
    if (diff < 0) diff += 7;
    dayDate.setDate(today.getDate() + diff);

    // 1. Add sleep schedule
    const daySleep = sleepSchedules.find(s => s.day === day);
    if (daySleep) {
      daySlots.push({
        startTime: daySleep.bedtime,
        endTime: daySleep.wakeTime,
        type: "SLEEP",
        title: `${daySleep.type} Sleep`,
        description: daySleep.notes,
        sleepScheduleId: daySleep.id,
        color: daySleep.color,
        duration: daySleep.duration
      });
    }

    // 2. Add fixed times + free periods
    const dayFixedTimes = fixedTimes.filter(ft => ft.days.includes(day));
    for (const ft of dayFixedTimes) {
      // Add the fixed time block
      daySlots.push({
        startTime: ft.startTime,
        endTime: ft.endTime,
        type: "FIXED",
        title: ft.title,
        description: ft.description,
        fixedTimeId: ft.id,
        color: ft.color
      });

      // Add free periods within fixed time
      const dayFreePeriods = ft.freePeriods?.filter((fp: any) => fp.day === day) || [];
      for (const fp of dayFreePeriods) {
        daySlots.push({
          startTime: fp.startTime,
          endTime: fp.endTime,
          type: "FREE",
          title: fp.title || "Free Period",
          fixedTimeId: ft.id,
          freePeriodId: fp.id,
          color: "#10B981" // Green for free periods
        });
      }
    }

    // 3. Add tasks (excluding sleep tasks as they're handled separately)
    const dayTasks = tasks.filter(t => t.day === day && t.type !== "SLEEP");
    for (const task of dayTasks) {
      daySlots.push({
        startTime: task.startTime,
        endTime: task.endTime,
        type: task.type as any,
        title: task.title,
        description: task.notes,
        taskId: task.id,
        color: task.color,
        status: task.status,
        priority: task.priority,
        category: task.category,
        subject: task.subject,
        duration: task.duration
      });
    }

    // 4. Sort slots by startTime
    daySlots.sort((a, b) => this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime));

    // 5. Fill gaps with "OTHER" or "BREAK"
    const fullDaySlots = this.fillGapsWithOther(daySlots);

    timetable.push({ 
      day, 
      date: dayDate.toISOString().split('T')[0],
      slots: fullDaySlots 
    });
  }

  logger.info("Full timetable generated successfully", {
    functionName: "TimetableService.getFullTimetable",
    metadata: { userId, daysProcessed: days.length }
  });

  return timetable;
}

/**
 * Fill gaps between slots with "OTHER" type
 */
private static fillGapsWithOther(slots: TimeSlot[]): TimeSlot[] {
  if (slots.length === 0) {
    return [{
      startTime: "00:00",
      endTime: "24:00",
      type: "OTHER",
      title: "Unscheduled Time",
      color: "#9CA3AF" // Gray for unscheduled
    }];
  }

  const fullSlots: TimeSlot[] = [];
  let currentTime = "00:00";

  for (const slot of slots) {
    // If there's a gap between current time and this slot's start
    if (currentTime !== slot.startTime) {
      const gapStart = currentTime;
      const gapEnd = slot.startTime;
      
      // Only add gap if it's at least 15 minutes
      const gapDuration = this.timeToMinutes(gapEnd) - this.timeToMinutes(gapStart);
      if (gapDuration >= 15) {
        fullSlots.push({
          startTime: gapStart,
          endTime: gapEnd,
          type: "OTHER",
          title: "Free Time",
          color: "#9CA3AF"
        });
      }
    }
    
    fullSlots.push(slot);
    currentTime = slot.endTime;
  }

  // Add gap after last slot until midnight
  if (currentTime !== "24:00") {
    const gapDuration = this.timeToMinutes("24:00") - this.timeToMinutes(currentTime);
    if (gapDuration >= 15) {
      fullSlots.push({
        startTime: currentTime,
        endTime: "24:00",
        type: "OTHER",
        title: "Free Time",
        color: "#9CA3AF"
      });
    }
  }

  return fullSlots;
}



    static async getFullTimetable1(userId: string, filters: TimetableFilter) {
      logger.info("Fetching full timetable", {
        functionName: "TimetableService.getFullTimetable",
        metadata: { userId, filters }
      });
  
      // Default to full week if no day filter
      const days = filters.day ? [filters.day] : ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  
      const timetable: DayTimetable[] = [];
  
      // Fetch all data in parallel
      const [fixedTimes, sleepSchedules, tasks] = await Promise.all([
        FixedTimeRepository.findAll(userId),
        SleepScheduleRepository.findAll(userId, { isActive: true }),
        TaskRepository.findAll(userId, { day: { in: days } })  // Filter tasks by days
      ]);

      console.log(fixedTimes,"Fixed -- Times");
      console.log(sleepSchedules,"Sleep--Schedules");
      console.log(tasks,"Tasks")
  
      for (const day of days) {
        const daySlots: TimeSlot[] = [];
  
        // 1. Add sleep schedule
        const daySleep = sleepSchedules.find(s => s.day === day);
        if (daySleep) {
          daySlots.push({
            startTime: daySleep.bedtime,
            endTime: daySleep.wakeTime,
            type: "SLEEP",
            title: `${daySleep.type} Sleep`,
            description: daySleep.notes,
            sleepScheduleId: daySleep.id
          });
        }
  
        // 2. Add fixed times + free periods
        const dayFixedTimes = fixedTimes.filter(ft => ft.days.includes(day));
        for (const ft of dayFixedTimes) {
          daySlots.push({
            startTime: ft.startTime,
            endTime: ft.endTime,
            type: "FIXED",
            title: ft.title,
            description: ft.description,
            fixedTimeId: ft.id
          });
  
          // Add free periods within fixed time
          const dayFreePeriods = ft.freePeriods.filter(fp => fp.day === day);
          for (const fp of dayFreePeriods) {
            daySlots.push({
              startTime: fp.startTime,
              endTime: fp.endTime,
              type: "FREE",
              title: fp.title,
              fixedTimeId: ft.id,
              freePeriodId: fp.id
            });
          }
        }
  

        // 3. Add tasks (including breaks, commute, etc.)
        const dayTasks = tasks.tasks.filter(t => t.day === day);
        for (const task of dayTasks) {
          daySlots.push({
            startTime: task.startTime,
            endTime: task.endTime,
            type: "TASK",
            title: task.title,
            description: task.notes,
            taskId: task.id
          });
        }
  
        // 4. Sort slots by startTime
        daySlots.sort((a, b) => this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime));
  
        // 5. Fill gaps with "OTHER" or "BREAK" if needed (simple 24-hour flow)
        const fullDaySlots = this.fillGapsWithOther(daySlots);
  
        timetable.push({ day, slots: fullDaySlots });
      }
  
      logger.info("Full timetable generated successfully", {
        functionName: "TimetableService.getFullTimetable",
        metadata: { userId, daysProcessed: days.length }
      });
  
      return timetable;
    }



    private static timeToMinutes1(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  private static fillGapsWithOther(slots: TimeSlot[]): TimeSlot[] {
    if (slots.length === 0) {
      return [{
        startTime: "00:00",
        endTime: "24:00",
        type: "OTHER",
        title: "Unscheduled Time"
      }];
    }

    const fullSlots: TimeSlot[] = [];
    let currentTime = "00:00";

    for (const slot of slots) {
      if (currentTime !== slot.startTime) {
        fullSlots.push({
          startTime: currentTime,
          endTime: slot.startTime,
          type: "OTHER",
          title: "Unscheduled Time"
        });
      }
      fullSlots.push(slot);
      currentTime = slot.endTime;
    }

    if (currentTime !== "24:00") {
      fullSlots.push({
        startTime: currentTime,
        endTime: "24:00",
        type: "OTHER",
        title: "Unscheduled Time"
      });
    }

    return fullSlots;
  }

  /**
   * Get tasks for a specific day
   */
  static async getTasksByDay(userId: string, day: string): Promise<TimetableTask[]> {
    logger.info('Getting tasks by day', {
      functionName: 'TimetableService.getTasksByDay',
      metadata: { userId, day }
    })

    const normalizedDay = this.normalizeDay(day)
    const tasks = await TimetableRepository.getTasksByDay(userId, normalizedDay)
    const todayBedtime = await this.getTodayBedtime(userId)

    const transformedTasks = await Promise.all(
      tasks.map(task => this.transformToTimetableTask(task, todayBedtime))
    )

    return transformedTasks
  }

  /**
   * Get active tasks (currently running)
   */
  static async getActiveTasks(userId: string): Promise<TimetableTask[]> {
    logger.info('Getting active tasks', {
      functionName: 'TimetableService.getActiveTasks',
      metadata: { userId }
    })

    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    const today = this.getTodayDay()

    const tasks = await TimetableRepository.getActiveTasks(userId, today, currentTime)
    const todayBedtime = await this.getTodayBedtime(userId)

    const transformedTasks = await Promise.all(
      tasks.map(task => this.transformToTimetableTask(task, todayBedtime))
    )

    return transformedTasks
  }

  /**
   * Get upcoming tasks
   */
  static async getUpcomingTasks(userId: string, limit: number = 10): Promise<TimetableTask[]> {
    logger.info('Getting upcoming tasks', {
      functionName: 'TimetableService.getUpcomingTasks',
      metadata: { userId, limit }
    })

    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    const today = this.getTodayDay()

    const tasks = await TimetableRepository.getUpcomingTasks(userId, today, currentTime, limit)
    console.log('Upcoming tasks fetched:', tasks)
    const todayBedtime = await this.getTodayBedtime(userId)
    console.log('Today bedtime:', todayBedtime)

    const transformedTasks = await Promise.all(
      tasks.map(task => this.transformToTimetableTask(task, todayBedtime))
    )

    return transformedTasks
  }

  /**
   * Get today's bedtime from sleep schedule
   */
  static async getTodayBedtime(userId: string): Promise<BedtimeInfo | null> {
    logger.info('Getting today bedtime', {
      functionName: 'TimetableService.getTodayBedtime',
      metadata: { userId }
    })

    const today = this.getTodayDay()
    const sleepDay = this.convertToSleepDay(today)
    
    const schedules = await SleepScheduleRepository.findByDay(userId, sleepDay)
    
    // Get REGULAR sleep schedule (not power naps)
    const regularSleep = schedules.find(s => 
      s.type === 'REGULAR' || s.type === 'EARLY' || s.type === 'LATE'
    )

    if (!regularSleep) {
      return null
    }

    return {
      userId,
      day: sleepDay as any,
      bedtime: regularSleep.bedtime,
      wakeTime: regularSleep.wakeTime,
      duration: regularSleep.duration,
      isActive: regularSleep.isActive
    }
  }

  // ==================== ⏰ TASK ACTIONS ====================

  /**
   * Start a task
   */
  static async startTask(userId: string, taskId: string): Promise<TimetableTask> {
    logger.info('Starting task', {
      functionName: 'TimetableService.startTask',
      metadata: { userId, taskId }
    })

    const task = await TaskRepository.findById(taskId, userId)
    if (!task) {
      throw new AppError('Task not found', 404)
    }

    if (task.status === 'COMPLETED') {
      throw new AppError('Cannot start a completed task', 400)
    }

    if (task.status === 'ONGOING') {
      throw new AppError('Task is already in progress', 400)
    }

    // Check if task can be started (not too early)
    const now = new Date()
    const [startHour, startMinute] = task.startTime.split(':').map(Number)
    const taskStart = new Date(now)
    taskStart.setHours(startHour, startMinute, 0, 0)

    // Allow starting 5 minutes before scheduled time
    const fiveMinutesBefore = new Date(taskStart)
    fiveMinutesBefore.setMinutes(fiveMinutesBefore.getMinutes() - 5)

    if (now < fiveMinutesBefore) {
      throw new AppError('Cannot start task more than 5 minutes before scheduled time', 400)
    }

    const updatedTask = await TaskRepository.update(taskId, userId, {
      status: 'ONGOING',
      startedAt: new Date(),
    })

    const todayBedtime = await this.getTodayBedtime(userId)
    return this.transformToTimetableTask(updatedTask, todayBedtime)
  }

  /**
   * Complete a task with feedback
   */
  static async completeTask(
    userId: string,
    feedback: TaskFeedbackDTO
  ): Promise<{ task: TimetableTask; feedback: TaskFeedbackResponse }> {
    logger.info('Completing task', {
      functionName: 'TimetableService.completeTask',
      metadata: { userId, taskId: feedback.taskId, focusLevel: feedback.focusLevel }
    })

    const task = await TaskRepository.findById(feedback.taskId, userId)
    if (!task) {
      throw new AppError('Task not found', 404)
    }

    if (task.status === 'COMPLETED') {
      throw new AppError('Task is already completed', 400)
    }

    const now = new Date()
    const [endHour, endMinute] = task.endTime.split(':').map(Number)
    const taskEnd = new Date(now)
    taskEnd.setHours(endHour, endMinute, 0, 0)

    // Calculate actual duration
    let actualDuration: number | null = null
    if (task.startedAt) {
      actualDuration = Math.round((now.getTime() - task.startedAt.getTime()) / 60000)
    }

    // Check if completed before bedtime
    const bedtime = await this.getTodayBedtime(userId)
    let completedBeforeBedtime = true
    if (bedtime) {
      const [bedtimeHour, bedtimeMinute] = bedtime.bedtime.split(':').map(Number)
      const bedtimeTime = new Date(now)
      bedtimeTime.setHours(bedtimeHour, bedtimeMinute, 0, 0)
      completedBeforeBedtime = now <= bedtimeTime
    }

    // Update task
    const updatedTask = await TaskRepository.update(feedback.taskId, userId, {
      status: 'COMPLETED',
      isCompleted: true,
      completedAt: now,
      actualDuration,
    })

    // Create feedback
    const taskFeedback = await TimetableRepository.createTaskFeedback(userId, {
      taskId: feedback.taskId,
      focusLevel: feedback.focusLevel,
      completedWell: feedback.completedWell,
      notes: feedback.notes,
    })

    // Update goal progress if task is linked to a goal
    if (task.goalId) {
      await this.updateGoalProgress(task.goalId, task.duration)
    }

    const todayBedtime = await this.getTodayBedtime(userId)
    const transformedTask = await this.transformToTimetableTask(updatedTask, todayBedtime)

    return {
      task: transformedTask,
      feedback: taskFeedback
    }
  }

  /**
   * Skip a task
   */
  static async skipTask(userId: string, taskId: string, notes?: string): Promise<TimetableTask> {
    logger.info('Skipping task', {
      functionName: 'TimetableService.skipTask',
      metadata: { userId, taskId }
    })

    const task = await TaskRepository.findById(taskId, userId)
    if (!task) {
      throw new AppError('Task not found', 404)
    }

    const updatedTask = await TaskRepository.update(taskId, userId, {
      status: TaskStatus.SKIPPED,
      isCompleted: false,
      notes: notes ? `${task.note || ''}\nSkipped: ${notes}`.trim() : (task.note || 'Skipped by user')
    })

    const todayBedtime = await this.getTodayBedtime(userId)
    return this.transformToTimetableTask(updatedTask, todayBedtime)
  }

  /**
   * Mark task as missed
   */
  static async markAsMissed(userId: string, taskId: string, notes?: string): Promise<TimetableTask> {
    logger.info('Marking task as missed', {
      functionName: 'TimetableService.markAsMissed',
      metadata: { userId, taskId }
    })

    const task = await TaskRepository.findById(taskId, userId)
    if (!task) {
      throw new AppError('Task not found', 404)
    }

    const updatedTask = await TaskRepository.update(taskId, userId, {
      status: 'MISSED',
      isCompleted: false,
      notes: notes ? `${task.note || ''}\nMissed: ${notes}`.trim() : (task.note || 'Task was missed')
    })

    const todayBedtime = await this.getTodayBedtime(userId)
    return this.transformToTimetableTask(updatedTask, todayBedtime)
  }

  /**
   * Update task status (generic)
   */
  static async updateTaskStatus(
    userId: string,
    payload: UpdateTaskStatusDTO
  ): Promise<TimetableTask> {
    logger.info('Updating task status', {
      functionName: 'TimetableService.updateTaskStatus',
      metadata: { userId, taskId: payload.taskId, newStatus: payload.status }
    })

    const task = await TaskRepository.findById(payload.taskId, userId)
    if (!task) {
      throw new AppError('Task not found', 404)
    }

    const updateData: any = {
      status: payload.status,
      lastStatusUpdateAt: new Date()
    }

    // Handle special cases
    if (payload.status === 'COMPLETED') {
      updateData.isCompleted = true
      updateData.completedAt = new Date()
    } else if (payload.status === 'ONGOING') {
      updateData.startedAt = new Date()
    }

    if (payload.notes) {
      updateData.notes = `${task.note || ''}\nStatus update: ${payload.notes}`.trim()
    }

    const updatedTask = await TaskRepository.update(payload.taskId, userId, updateData)

    // Update goal progress if task is completed and linked to a goal
    if (payload.status === 'COMPLETED' && task.goalId) {
      await this.updateGoalProgress(task.goalId, task.duration)
    }

    const todayBedtime = await this.getTodayBedtime(userId)
    return this.transformToTimetableTask(updatedTask, todayBedtime)
  }

  // ==================== 🎯 SMART DELAY ====================

  /**
   * Get smart delay options for a task
   */
  static async getSmartDelayOptions(
    userId: string,
    request: SmartDelayRequestDTO
  ): Promise<SmartDelayResponseDTO> {
    logger.info('Getting smart delay options', {
      functionName: 'TimetableService.getSmartDelayOptions',
      metadata: { userId, taskId: request.taskId }
    })

    const task = await TaskRepository.findById(request.taskId, userId)
    if (!task) {
      throw new AppError('Task not found', 404)
    }

    if (task.status === 'COMPLETED') {
      throw new AppError('Cannot delay a completed task', 400)
    }

    if (task.isRescheduled) {
      throw new AppError('Task has already been rescheduled once. Cannot delay again.', 400)
    }

    // Get bedtime for today
    const bedtime = await this.getTodayBedtime(userId)
    const bedtimeTime = bedtime?.bedtime || '23:00'

    // Get available slots
    const availableSlots = await this.findAvailableSlots(
      userId,
      task,
      request.preferredDelay || 30,
      bedtimeTime
    )

    // Check if can extend before bedtime
    const canExtend = await this.canExtendTask(userId, task, bedtimeTime)
    const maxExtensionMinutes = canExtend ? await this.getMaxExtensionMinutes(userId, task, bedtimeTime) : 0

    // Generate suggestion
    const suggestion = this.generateDelaySuggestion(availableSlots, canExtend, maxExtensionMinutes, bedtimeTime)

    return {
      taskId: task.id,
      taskTitle: task.title,
      currentDay: task.day as DayOfWeek,
      currentStartTime: task.startTime,
      currentEndTime: task.endTime,
      duration: task.duration,
      options: availableSlots,
      canExtend,
      maxExtensionMinutes,
      bedtime: bedtimeTime,
      suggestion
    }
  }

  /**
   * Apply smart delay
   */
  static async applySmartDelay(
    userId: string,
    payload: ApplySmartDelayDTO
  ): Promise<TimetableTask> {
    logger.info('Applying smart delay', {
      functionName: 'TimetableService.applySmartDelay',
      metadata: { userId, taskId: payload.taskId, day: payload.day, time: payload.startTime }
    })

    const task = await TaskRepository.findById(payload.taskId, userId)
    if (!task) {
      throw new AppError('Task not found', 404)
    }

    if (task.isRescheduled) {
      throw new AppError('Task has already been rescheduled once. Cannot delay again.', 400)
    }

    // Check if new time slot is available
    const isAvailable = await this.isTimeSlotAvailable(
      userId,
      payload.day,
      payload.startTime,
      payload.endTime,
      payload.taskId
    )

    if (!isAvailable) {
      throw new AppError('Selected time slot is no longer available', 409)
    }

    // Update task
    const updatedTask = await TaskRepository.update(payload.taskId, userId, {
      day: payload.day,
      startTime: payload.startTime,
      endTime: payload.endTime,
      status: TaskStatus.RESCHEDULED,
      isRescheduled: true,
      originalStartTime: task.startTime,
      originalEndTime: task.endTime,
      originalDay: task.day,
      notes: `${task.notes || ''}\nRescheduled to ${payload.day} at ${payload.startTime} via smart delay`.trim()
    })

    const todayBedtime = await this.getTodayBedtime(userId)
    return this.transformToTimetableTask(updatedTask, todayBedtime)
  }

  /**
   * Simple delay (backward compatibility)
   */
  static async simpleDelay(
    userId: string,
    payload: SimpleDelayDTO
  ): Promise<TimetableTask> {
    logger.info('Applying simple delay', {
      functionName: 'TimetableService.simpleDelay',
      metadata: { userId, taskId: payload.taskId, minutes: payload.minutes }
    })

    const task = await TaskRepository.findById(payload.taskId, userId)
    if (!task) {
      throw new AppError('Task not found', 404)
    }

    if (task.isRescheduled) {
      throw new AppError('Task has already been rescheduled once. Cannot delay again.', 400)
    }

    // Calculate new times
    const [startHours, startMinutes] = task.startTime.split(':').map(Number)
    const newStartMinutes = startHours * 60 + startMinutes + payload.minutes
    const newStartHour = Math.floor(newStartMinutes / 60)
    const newStartMinute = newStartMinutes % 60
    
    const newEndMinutes = newStartMinutes + task.duration
    const newEndHour = Math.floor(newEndMinutes / 60)
    const newEndMinute = newEndMinutes % 60
    
    const newStartTime = `${newStartHour.toString().padStart(2, '0')}:${newStartMinute.toString().padStart(2, '0')}`
    const newEndTime = `${newEndHour.toString().padStart(2, '0')}:${newEndMinute.toString().padStart(2, '0')}`

    // Check bedtime
    const bedtime = await this.getTodayBedtime(userId)
    if (bedtime) {
      const [bedtimeHour, bedtimeMinute] = bedtime.bedtime.split(':').map(Number)
      const bedtimeMinutes = bedtimeHour * 60 + bedtimeMinute
      
      if (newEndMinutes > bedtimeMinutes) {
        throw new AppError(`Cannot delay past bedtime (${bedtime.bedtime})`, 400)
      }
    }

    // Check if new slot is available
    const isAvailable = await this.isTimeSlotAvailable(
      userId,
      task.day,
      newStartTime,
      newEndTime,
      payload.taskId
    )

    if (!isAvailable) {
      throw new AppError('Time slot not available - another task is scheduled at that time', 409)
    }

    // Update task
    const updatedTask = await TaskRepository.update(payload.taskId, userId, {
      startTime: newStartTime,
      endTime: newEndTime,
      status: 'DELAYED',
      isRescheduled: true,
      originalStartTime: task.startTime,
      originalEndTime: task.endTime,
      notes: `${task.note || ''}\nDelayed by ${payload.minutes} minutes`.trim()
    })

    const todayBedtime = await this.getTodayBedtime(userId)
    return this.transformToTimetableTask(updatedTask, todayBedtime)
  }

  /**
   * Reschedule missed task to free period
   */
  static async rescheduleToFreePeriod(
    userId: string,
    payload: RescheduleToFreePeriodDTO
  ): Promise<TimetableTask> {
    logger.info('Rescheduling to free period', {
      functionName: 'TimetableService.rescheduleToFreePeriod',
      metadata: { userId, taskId: payload.taskId }
    })

    const task = await TaskRepository.findById(payload.taskId, userId)
    if (!task) {
      throw new AppError('Task not found', 404)
    }

    if (task.isRescheduled) {
      throw new AppError('Task has already been rescheduled once. Cannot reschedule again.', 400)
    }

    // Find available free period
    let freePeriod = null
    let fixedTime = null

    if (payload.fixedTimeId && payload.freePeriodId) {
      // Specific free period
      fixedTime = await FixedTimeRepository.findById(payload.fixedTimeId, userId)
      if (!fixedTime) {
        throw new AppError('Fixed time not found', 404)
      }
      
      freePeriod = fixedTime.freePeriods?.find(fp => fp.id === payload.freePeriodId)
      if (!freePeriod) {
        throw new AppError('Free period not found', 404)
      }
    } else {
      // Find best free period
      const result = await this.findBestFreePeriod(userId, task)
      fixedTime = result.fixedTime
      freePeriod = result.freePeriod
    }

    if (!freePeriod || !fixedTime) {
      throw new AppError('No suitable free period found', 404)
    }

    // Check if free period can accommodate the task
    if (freePeriod.duration < task.duration) {
      throw new AppError(`Free period is only ${freePeriod.duration} minutes but task needs ${task.duration} minutes`, 400)
    }

    // Calculate new times (use start of free period)
    const newStartTime = freePeriod.startTime
    const newEndTime = this.calculateEndTime(newStartTime, task.duration)

    // Check if new slot is available
    const isAvailable = await this.isTimeSlotAvailable(
      userId,
      freePeriod.day,
      newStartTime,
      newEndTime,
      payload.taskId
    )

    if (!isAvailable) {
      throw new AppError('Time slot not available - another task is scheduled at that time', 409)
    }

    // Update task
    const updatedTask = await TaskRepository.update(payload.taskId, userId, {
      day: freePeriod.day,
      startTime: newStartTime,
      endTime: newEndTime,
      fixedTimeId: fixedTime.id,
      status: TaskStatus.RESCHEDULED,
      isRescheduled: true,
      originalStartTime: task.startTime,
      originalEndTime: task.endTime,
      originalDay: task.day,
      notes: `${task.notes || ''}\nRescheduled to free period on ${freePeriod.day} at ${newStartTime}`.trim()
    })

    const todayBedtime = await this.getTodayBedtime(userId)
    return this.transformToTimetableTask(updatedTask, todayBedtime)
  }

  // ==================== 📝 TASK FEEDBACK ====================

  /**
   * Submit task feedback
   */
  static async submitTaskFeedback(
    userId: string,
    payload: TaskFeedbackDTO
  ): Promise<TaskFeedbackResponse> {
    logger.info('Submitting task feedback', {
      functionName: 'TimetableService.submitTaskFeedback',
      metadata: { userId, taskId: payload.taskId }
    })

    const task = await TaskRepository.findById(payload.taskId, userId)
    if (!task) {
      throw new AppError('Task not found', 404)
    }

    // Check if feedback already exists
    const existingFeedback = await TimetableRepository.getTaskFeedback(payload.taskId)
    if (existingFeedback) {
      throw new AppError('Feedback already submitted for this task', 400)
    }

    const feedback = await TimetableRepository.createTaskFeedback(userId, payload)

    return feedback
  }

  /**
   * Get task feedback
   */
  static async getTaskFeedback(
    userId: string,
    taskId: string
  ): Promise<TaskFeedbackResponse | null> {
    logger.info('Getting task feedback', {
      functionName: 'TimetableService.getTaskFeedback',
      metadata: { userId, taskId }
    })

    const task = await TaskRepository.findById(taskId, userId)
    if (!task) {
      throw new AppError('Task not found', 404)
    }

    const feedback = await TimetableRepository.getTaskFeedback(taskId)

    return feedback
  }

  // ==================== ⚡ GRACE PERIOD ====================

  /**
   * Get tasks in grace period (ended within last 1 hour)
   */
  static async getGracePeriodTasks(userId: string): Promise<GracePeriodTask[]> {
    logger.info('Getting grace period tasks', {
      functionName: 'TimetableService.getGracePeriodTasks',
      metadata: { userId }
    })

    const now = new Date()
    const today = this.getTodayDay()
    const gracePeriodMinutes = 60 // 1 hour

    const tasks = await TimetableRepository.getTasksByDay(userId, today)
    
    const gracePeriodTasks: GracePeriodTask[] = []

    for (const task of tasks) {
      if (task.status !== 'PENDING' && task.status !== 'ONGOING') {
        continue
      }

      const [endHour, endMinute] = task.endTime.split(':').map(Number)
      const taskEnd = new Date(now)
      taskEnd.setHours(endHour, endMinute, 0, 0)

      const timeSinceEnd = Math.floor((now.getTime() - taskEnd.getTime()) / 60000)
      
      if (timeSinceEnd > 0 && timeSinceEnd <= gracePeriodMinutes) {
        gracePeriodTasks.push({
          taskId: task.id,
          taskTitle: task.title,
          endTime: task.endTime,
          timeSinceEnd,
          timeRemaining: gracePeriodMinutes - timeSinceEnd,
          status: task.status
        })
      }
    }

    return gracePeriodTasks
  }

  /**
   * Get missed tasks (can still complete today)
   */
  static async getMissedTasks(userId: string): Promise<TimetableTask[]> {
    logger.info('Getting missed tasks', {
      functionName: 'TimetableService.getMissedTasks',
      metadata: { userId }
    })

    const now = new Date()
    const today = this.getTodayDay()
    const gracePeriodMinutes = 60

    const tasks = await TimetableRepository.getTasksByDay(userId, today)
    const bedtime = await this.getTodayBedtime(userId)
    const bedtimeTime = bedtime?.bedtime || '23:00'
    const [bedtimeHour, bedtimeMinute] = bedtimeTime.split(':').map(Number)
    const bedtimeMinutes = bedtimeHour * 60 + bedtimeMinute
    const nowMinutes = now.getHours() * 60 + now.getMinutes()

    const missedTasks: any[] = []

    for (const task of tasks) {
      if (task.status === 'COMPLETED' || task.status === TaskStatus.SKIPPED) {
        continue
      }

      const [endHour, endMinute] = task.endTime.split(':').map(Number)
      const taskEndMinutes = endHour * 60 + endMinute
      const timeSinceEnd = nowMinutes - taskEndMinutes

      // Task is missed if:
      // 1. It's past the grace period (> 1 hour after end time)
      // 2. OR it's marked as missed
      if (task.status === TaskStatus.MISSED || (timeSinceEnd > gracePeriodMinutes && task.status !== TaskStatus.COMPLETED)) {
        // Check if can still complete before bedtime
        const timeUntilBedtime = bedtimeMinutes - nowMinutes
        const canCompleteBeforeBedtime = timeUntilBedtime >= task.duration

        const transformedTask = await this.transformToTimetableTask(task, bedtime)
        missedTasks.push({
          ...transformedTask,
          canCompleteBeforeBedtime
        })
      }
    }

    return missedTasks
  }

  // ==================== 📊 STATISTICS ====================

  /**
   * Get timetable statistics
   */
  static async getStatistics(
    userId: string,
    query: { weeks?: number; fromDate?: string; toDate?: string }
  ): Promise<TimetableStats> {
    logger.info('Getting timetable statistics', {
      functionName: 'TimetableService.getStatistics',
      metadata: { userId, weeks: query.weeks }
    })

    const weeks = query.weeks || 4
    const endDate = query.toDate ? new Date(query.toDate) : new Date()
    const startDate = query.fromDate 
      ? new Date(query.fromDate) 
      : new Date(endDate.getTime() - weeks * 7 * 24 * 60 * 60 * 1000)

    // Get all tasks in date range
    const tasks = await TimetableRepository.getTasksInDateRange(userId, startDate, endDate)
    
    // Get today's tasks
    const today = this.getTodayDay()
    const todayTasks = await TimetableRepository.getTasksByDay(userId, today)
    
    // Get bedtime
    const bedtime = await this.getTodayBedtime(userId)
    const bedtimeTime = bedtime?.bedtime || '23:00'
    const [bedtimeHour, bedtimeMinute] = bedtimeTime.split(':').map(Number)
    const bedtimeMinutes = bedtimeHour * 60 + bedtimeMinute

    // Today's stats
    const todayStats = this.calculateDayStats(
      await Promise.all(todayTasks.map(t => this.transformToTimetableTask(t, bedtime)))
    )

    // Week stats
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const weekTasks = await Promise.all(
      weekDays.map(day => 
        TimetableRepository.getTasksByDay(userId, day as DayOfWeek)
      )
    )
    const flatWeekTasks = weekTasks.flat()
    
    const weekTotalTasks = flatWeekTasks.length
    const weekCompletedTasks = flatWeekTasks.filter(t => t.status === 'COMPLETED').length
    const weekCompletionRate = weekTotalTasks > 0 ? (weekCompletedTasks / weekTotalTasks) * 100 : 0
    
    const weekTotalHours = flatWeekTasks.reduce((sum, t) => sum + (t.duration / 60), 0)
    const weekCompletedHours = flatWeekTasks
      .filter(t => t.status === 'COMPLETED')
      .reduce((sum, t) => sum + ((t.actualDuration || t.duration) / 60), 0)

    const byDay: Record<DayOfWeek, number> = {} as Record<DayOfWeek, number>
    weekDays.forEach((day, index) => {
      byDay[day as DayOfWeek] = weekTasks[index].length
    })

    // Productivity stats
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED')
    const onTimeTasks = completedTasks.filter(t => 
      !t.notes?.includes('Rescheduled') && !t.notes?.includes('Delayed')
    )
    
    const averageFocusScore = completedTasks.length > 0
      ? completedTasks.reduce((sum, t) => {
          const feedback = t.feedback
          return sum + (feedback?.focusLevel || 0)
        }, 0) / completedTasks.length
      : 0

    // Find most productive day
    const tasksByDay: Record<string, number> = {}
    completedTasks.forEach(t => {
      if (t.completedAt) {
        const day = this.getDayOfWeek(t.completedAt)
        tasksByDay[day] = (tasksByDay[day] || 0) + 1
      }
    })
    
    let mostProductiveDay: DayOfWeek | null = null
    let maxTasks = 0
    Object.entries(tasksByDay).forEach(([day, count]) => {
      if (count > maxTasks) {
        maxTasks = count
        mostProductiveDay = day as DayOfWeek
      }
    })

    // Find most productive time
    const tasksByHour: Record<number, number> = {}
    completedTasks.forEach(t => {
      const [hour] = t.startTime.split(':').map(Number)
      tasksByHour[hour] = (tasksByHour[hour] || 0) + 1
    })
    
    let mostProductiveHour = 9 // default
    let maxHourTasks = 0
    Object.entries(tasksByHour).forEach(([hour, count]) => {
      if (count > maxHourTasks) {
        maxHourTasks = count
        mostProductiveHour = parseInt(hour)
      }
    })
    
    const mostProductiveTime = `${mostProductiveHour.toString().padStart(2, '0')}:00-${(mostProductiveHour + 2).toString().padStart(2, '0')}:00`

    // Bedtime stats
    const tasksCompletedBeforeBedtime = todayTasks.filter(t => {
      if (t.status !== 'COMPLETED' || !t.completedAt) return false
      const [hour, minute] = t.endTime.split(':').map(Number)
      const taskEndMinutes = hour * 60 + minute
      return taskEndMinutes <= bedtimeMinutes
    }).length

    const tasksCompletedAfterBedtime = todayTasks.filter(t => {
      if (t.status !== 'COMPLETED' || !t.completedAt) return false
      const [hour, minute] = t.endTime.split(':').map(Number)
      const taskEndMinutes = hour * 60 + minute
      return taskEndMinutes > bedtimeMinutes
    }).length

    const totalCompletedToday = tasksCompletedBeforeBedtime + tasksCompletedAfterBedtime
    const bedtimeCompletionRate = totalCompletedToday > 0
      ? (tasksCompletedBeforeBedtime / totalCompletedToday) * 100
      : 0

    return {
      today: {
        date: new Date().toISOString(),
        day: today,
        totalTasks: todayStats.total,
        completedTasks: todayStats.completed,
        pendingTasks: todayStats.pending,
        inProgressTasks: todayStats.inProgress,
        missedTasks: todayStats.missed,
        completionRate: todayStats.completionRate,
        totalHours: todayStats.totalHours,
        completedHours: todayStats.completedHours
      },
      week: {
        totalTasks: weekTotalTasks,
        completedTasks: weekCompletedTasks,
        pendingTasks: flatWeekTasks.filter(t => t.status === 'PENDING').length,
        missedTasks: flatWeekTasks.filter(t => t.status === 'MISSED').length,
        completionRate: weekCompletionRate,
        totalHours: weekTotalHours,
        completedHours: weekCompletedHours,
        byDay
      },
      productivity: {
        averageFocusScore: Math.round(averageFocusScore * 10) / 10,
        onTimeRate: completedTasks.length > 0 ? (onTimeTasks.length / completedTasks.length) * 100 : 0,
        rescheduledCount: flatWeekTasks.filter(t => t.status === 'RESCHEDULED').length,
        skippedCount: flatWeekTasks.filter(t => t.status === 'SKIPPED').length,
        mostProductiveDay,
        mostProductiveTime
      },
      bedtime: {
        bedtime: bedtimeTime,
        tasksCompletedBeforeBedtime,
        tasksCompletedAfterBedtime,
        completionRate: bedtimeCompletionRate
      }
    }
  }

  // ==================== 📦 BULK OPERATIONS ====================

  /**
   * Complete multiple tasks at once
   */
  static async bulkCompleteTasks(
    userId: string,
    payload: BulkCompleteDTO
  ): Promise<{ completed: number; failed: string[]; tasks: TimetableTask[] }> {
    logger.info('Bulk completing tasks', {
      functionName: 'TimetableService.bulkCompleteTasks',
      metadata: { userId, count: payload.taskIds.length }
    })

    const completed: string[] = []
    const failed: string[] = []
    const tasks: TimetableTask[] = []
    const completedAt = payload.completedAt ? new Date(payload.completedAt) : new Date()
    const bedtime = await this.getTodayBedtime(userId)

    for (const taskId of payload.taskIds) {
      try {
        const task = await TaskRepository.findById(taskId, userId)
        if (!task) {
          failed.push(`${taskId}: Task not found`)
          continue
        }

        if (task.status === 'COMPLETED') {
          failed.push(`${task.title}: Already completed`)
          continue
        }

        const updatedTask = await TaskRepository.update(taskId, userId, {
          status: 'COMPLETED',
          isCompleted: true,
          completedAt,
          actualDuration: task.duration // Assume full duration if not tracked
        })

        const transformedTask = await this.transformToTimetableTask(updatedTask, bedtime)
        tasks.push(transformedTask)
        completed.push(taskId)

        // Update goal progress
        if (task.goalId) {
          await this.updateGoalProgress(task.goalId, task.duration)
        }
      } catch (error: any) {
        failed.push(`${taskId}: ${error.message}`)
      }
    }

    return {
      completed: completed.length,
      failed,
      tasks
    }
  }

  /**
   * Delay multiple tasks at once
   */
  static async bulkDelayTasks(
    userId: string,
    payload: BulkDelayDTO
  ): Promise<{ delayed: number; failed: string[]; tasks: TimetableTask[] }> {
    logger.info('Bulk delaying tasks', {
      functionName: 'TimetableService.bulkDelayTasks',
      metadata: { userId, count: payload.taskIds.length, minutes: payload.minutes }
    })

    const delayed: string[] = []
    const failed: string[] = []
    const tasks: TimetableTask[] = []
    const bedtime = await this.getTodayBedtime(userId)

    for (const taskId of payload.taskIds) {
      try {
        const task = await TaskRepository.findById(taskId, userId)
        if (!task) {
          failed.push(`${taskId}: Task not found`)
          continue
        }

        if (task.status === 'COMPLETED') {
          failed.push(`${task.title}: Cannot delay completed task`)
          continue
        }

        if (task.isRescheduled) {
          failed.push(`${task.title}: Already rescheduled once`)
          continue
        }

        // Calculate new times
        const [startHours, startMinutes] = task.startTime.split(':').map(Number)
        const newStartMinutes = startHours * 60 + startMinutes + payload.minutes
        const newStartHour = Math.floor(newStartMinutes / 60)
        const newStartMinute = newStartMinutes % 60
        
        const newEndMinutes = newStartMinutes + task.duration
        const newEndHour = Math.floor(newEndMinutes / 60)
        const newEndMinute = newEndMinutes % 60
        
        const newStartTime = `${newStartHour.toString().padStart(2, '0')}:${newStartMinute.toString().padStart(2, '0')}`
        const newEndTime = `${newEndHour.toString().padStart(2, '0')}:${newEndMinute.toString().padStart(2, '0')}`

        // Check bedtime
        if (bedtime) {
          const [bedtimeHour, bedtimeMinute] = bedtime.bedtime.split(':').map(Number)
          const bedtimeMinutes = bedtimeHour * 60 + bedtimeMinute
          
          if (newEndMinutes > bedtimeMinutes) {
            failed.push(`${task.title}: Would exceed bedtime`)
            continue
          }
        }

        // Check if new slot is available
        const isAvailable = await this.isTimeSlotAvailable(
          userId,
          task.day,
          newStartTime,
          newEndTime,
          taskId
        )

        if (!isAvailable) {
          failed.push(`${task.title}: Time slot not available`)
          continue
        }

        const updatedTask = await TaskRepository.update(taskId, userId, {
          startTime: newStartTime,
          endTime: newEndTime,
          status: 'DELAYED',
          isRescheduled: true,
          originalStartTime: task.startTime,
          originalEndTime: task.endTime,
          notes: `${task.note || ''}\nDelayed by ${payload.minutes} minutes (bulk)`.trim()
        })

        const transformedTask = await this.transformToTimetableTask(updatedTask, bedtime)
        tasks.push(transformedTask)
        delayed.push(taskId)
      } catch (error: any) {
        failed.push(`${taskId}: ${error.message}`)
      }
    }

    return {
      delayed: delayed.length,
      failed,
      tasks
    }
  }

  // ==================== 🔧 PRIVATE HELPER METHODS ====================

  /**
   * Transform database task to TimetableTask
   */
  private static async transformToTimetableTask(
    task: any,
    bedtime: BedtimeInfo | null
  ): Promise<TimetableTask> {
    const isInGracePeriod = this.isInGracePeriod(task)
    const gracePeriodEndsAt = this.calculateGracePeriodEnd(task)

    return {
      id: task.id,
      title: task.title,
      subject: task.subject || null,
      startTime: task.startTime,
      endTime: task.endTime,
      duration: task.duration,
      priority: task.priority,
      color: task.color,
      day: task.day,
      type: task.type,
      category: task.category,
      icon: task.icon || null,
      status: task.status,
      isCompleted: task.isCompleted,
      completedAt: task.completedAt || null,
      startedAt: task.startedAt || null,
      actualDuration: task.actualDuration || null,
      isRescheduled: task.isRescheduled || false,
      originalStartTime: task.originalStartTime || null,
      originalEndTime: task.originalEndTime || null,
      originalDay: task.originalDay || null,
      goalId: task.goalId || null,
      goalTitle: task.goal?.title || null,
      milestoneId: task.milestoneId || null,
      fixedTimeId: task.fixedTimeId || null,
      fixedTimeTitle: task.fixedTime?.title || null,
      notes: task.note || null,
      tags: task.tags || [],
      location: task.location || null,
      gracePeriodEndsAt,
      lastStatusUpdateAt: task.lastStatusUpdateAt || null,
      focusScore: task.feedback?.focusLevel || null,
      feedbackNotes: task.feedback?.notes || null
    }
  }

  /**
   * Calculate stats for a day
   */
  private static calculateDayStats(tasks: TimetableTask[]): any {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'COMPLETED').length
    const inProgress = tasks.filter(t => t.status === 'ONGOING').length
    const pending = tasks.filter(t => t.status === 'PENDING').length
    const missed = tasks.filter(t => t.status === 'MISSED').length
    
    const totalHours = tasks.reduce((sum, t) => sum + (t.duration / 60), 0)
    const completedHours = tasks
      .filter(t => t.status === 'COMPLETED')
      .reduce((sum, t) => sum + ((t.actualDuration || t.duration) / 60), 0)
    
    const completionRate = total > 0 ? (completed / total) * 100 : 0

    return {
      total,
      completed,
      pending,
      inProgress,
      missed,
      totalHours,
      completedHours,
      completionRate
    }
  }

  /**
   * Check if task is in grace period
   */
  private static isInGracePeriod(task: any): boolean {
    if (task.status !== 'PENDING' && task.status !== 'ONGOING') {
      return false
    }

    const now = new Date()
    const [endHour, endMinute] = task.endTime.split(':').map(Number)
    const taskEnd = new Date(now)
    taskEnd.setHours(endHour, endMinute, 0, 0)

    const timeSinceEnd = (now.getTime() - taskEnd.getTime()) / 60000
    return timeSinceEnd > 0 && timeSinceEnd <= 60
  }

  /**
   * Calculate grace period end time
   */
  private static calculateGracePeriodEnd(task: any): Date | null {
    if (task.status !== 'PENDING' && task.status !== 'ONGOING') {
      return null
    }

    const [endHour, endMinute] = task.endTime.split(':').map(Number)
    const taskEnd = new Date()
    taskEnd.setHours(endHour, endMinute, 0, 0)
    
    const gracePeriodEnd = new Date(taskEnd)
    gracePeriodEnd.setHours(gracePeriodEnd.getHours() + 1)
    
    return gracePeriodEnd
  }

  /**
   * Find available time slots for smart delay
   */
  private static async findAvailableSlots(
    userId: string,
    task: any,
    preferredDelay: number,
    bedtime: string
  ): Promise<SmartDelayOption[]> {
    const options: SmartDelayOption[] = []
    const currentTimeMinutes = this.timeToMinutes(task.endTime)
    const bedtimeMinutes = this.timeToMinutes(bedtime)
    const taskDuration = task.duration

    // Get all tasks for the current day
    const currentDayTasks = await TimetableRepository.getTasksByDay(userId, task.day)
    
    // Filter out sleep tasks
    const nonSleepTasks = currentDayTasks.filter(t => t.type !== 'SLEEP')
    
    // Sort by start time
    nonSleepTasks.sort((a, b) => 
      this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime)
    )

    // Find gaps between tasks on the same day
    for (let i = 0; i < nonSleepTasks.length - 1; i++) {
      const currentTaskEnd = this.timeToMinutes(nonSleepTasks[i].endTime)
      const nextTaskStart = this.timeToMinutes(nonSleepTasks[i + 1].startTime)
      
      if (currentTaskEnd >= currentTimeMinutes && nextTaskStart - currentTaskEnd >= taskDuration) {
        const slotType = currentTaskEnd === currentTimeMinutes ? 'immediate' : 'free-period'
        const startTime = this.minutesToTime(currentTaskEnd)
        const endTime = this.minutesToTime(currentTaskEnd + taskDuration)
        
        options.push({
          id: `slot-${options.length + 1}`,
          type: slotType,
          day: task.day,
          startTime,
          endTime,
          duration: taskDuration,
          description: slotType === 'immediate' 
            ? `Immediate: Start now at ${startTime}` 
            : `Free period: ${startTime} - ${endTime}`,
          isAvailable: await this.isTimeSlotAvailable(userId, task.day, startTime, endTime, task.id)
        })
      }
    }

    // Check if can schedule before bedtime
    const lastTask = nonSleepTasks[nonSleepTasks.length - 1]
    const lastTaskEnd = lastTask ? this.timeToMinutes(lastTask.endTime) : currentTimeMinutes
    
    if (bedtimeMinutes - lastTaskEnd >= taskDuration) {
      const startTime = this.minutesToTime(lastTaskEnd)
      const endTime = this.minutesToTime(lastTaskEnd + taskDuration)
      
      options.push({
        id: `slot-${options.length + 1}`,
        type: 'evening',
        day: task.day,
        startTime,
        endTime,
        duration: taskDuration,
        description: `Evening: Complete before bedtime at ${startTime} - ${endTime}`,
        isAvailable: await this.isTimeSlotAvailable(userId, task.day, startTime, endTime, task.id)
      })
    }

    // Check next day morning
    const nextDay = this.getNextDay(task.day)
    const nextDayTasks = await TimetableRepository.getTasksByDay(userId, nextDay)
    const nextDayMorningStart = this.timeToMinutes('06:00')
    
    if (nextDayTasks.length > 0) {
      const firstTaskStart = this.timeToMinutes(nextDayTasks[0].startTime)
      if (firstTaskStart - nextDayMorningStart >= taskDuration) {
        const startTime = '06:00'
        const endTime = this.minutesToTime(nextDayMorningStart + taskDuration)
        
        options.push({
          id: `slot-${options.length + 1}`,
          type: 'next-day',
          day: nextDay,
          startTime,
          endTime,
          duration: taskDuration,
          description: `Tomorrow morning: ${startTime} - ${endTime}`,
          isAvailable: await this.isTimeSlotAvailable(userId, nextDay, startTime, endTime, task.id)
        })
      }
    }

    return options.filter(o => o.isAvailable).slice(0, 5) // Return top 5 options
  }

  /**
   * Check if task can be extended before bedtime
   */
  private static async canExtendTask(
    userId: string,
    task: any,
    bedtime: string
  ): Promise<boolean> {
    const now = new Date()
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes()
    const bedtimeMinutes = this.timeToMinutes(bedtime)
    const taskEndMinutes = this.timeToMinutes(task.endTime)
    
    return bedtimeMinutes - currentTimeMinutes >= task.duration && 
           currentTimeMinutes > taskEndMinutes
  }

  /**
   * Get max extension minutes before bedtime
   */
  private static async getMaxExtensionMinutes(
    userId: string,
    task: any,
    bedtime: string
  ): Promise<number> {
    const now = new Date()
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes()
    const bedtimeMinutes = this.timeToMinutes(bedtime)
    
    return Math.max(0, bedtimeMinutes - currentTimeMinutes - task.duration)
  }

  /**
   * Generate delay suggestion
   */
  private static generateDelaySuggestion(
    options: SmartDelayOption[],
    canExtend: boolean,
    maxExtension: number,
    bedtime: string
  ): string {
    if (options.length > 0) {
      const immediateSlot = options.find(o => o.type === 'immediate')
      if (immediateSlot) {
        return `Move to immediate free slot at ${immediateSlot.startTime}`
      }
      const bestSlot = options[0]
      return `Reschedule to ${bestSlot.startTime} on ${bestSlot.day}`
    } else if (canExtend) {
      return `Extend current slot by ${maxExtension} minutes (complete before ${bedtime})`
    } else {
      return 'No available slots today. Consider reducing task duration or rescheduling for tomorrow.'
    }
  }

  /**
   * Check if time slot is available
   */
  private static async isTimeSlotAvailable(
    userId: string,
    day: string,
    startTime: string,
    endTime: string,
    excludeTaskId?: string
  ): Promise<boolean> {
    const tasks = await TimetableRepository.getTasksByDay(userId, day as DayOfWeek)
    const startMinutes = this.timeToMinutes(startTime)
    const endMinutes = this.timeToMinutes(endTime)
    
    for (const task of tasks) {
      if (task.id === excludeTaskId) continue
      if (task.type === 'SLEEP') continue // Sleep is fixed, but we shouldn't overlap with sleep
      
      const taskStart = this.timeToMinutes(task.startTime)
      const taskEnd = this.timeToMinutes(task.endTime)
      
      // Check for overlap
      if (startMinutes < taskEnd && endMinutes > taskStart) {
        return false
      }
    }
    
    return true
  }

  /**
   * Find best free period for a task
   */
  private static async findBestFreePeriod(
    userId: string,
    task: any
  ): Promise<{ fixedTime: any; freePeriod: any }> {
    const fixedTimes = await FixedTimeRepository.findAll(userId)
    
    for (const fixedTime of fixedTimes) {
      for (const freePeriod of fixedTime.freePeriods || []) {
        // Check if free period can accommodate the task
        if (freePeriod.duration >= task.duration) {
          // Check if time slot is available
          const endTime = this.calculateEndTime(freePeriod.startTime, task.duration)
          const isAvailable = await this.isTimeSlotAvailable(
            userId,
            freePeriod.day,
            freePeriod.startTime,
            endTime
          )
          
          if (isAvailable) {
            return { fixedTime, freePeriod }
          }
        }
      }
    }
    
    throw new AppError('No suitable free period found', 404)
  }

  /**
   * Update goal progress when task is completed
   */
  private static async updateGoalProgress(goalId: string, taskDuration: number): Promise<void> {
    try {
      const goal = await GoalRepository.findById(goalId, 'system')
      if (!goal) return

      const hours = taskDuration / 60
      const newCompletedHours = Math.min(goal.totalHours, goal.completedHours + hours)
      const progress = goal.totalHours > 0 ? (newCompletedHours / goal.totalHours) * 100 : 0

      await GoalRepository.update(goalId, goal.userId, {
        completedHours: newCompletedHours,
        progress: Math.round(progress),
        ...(progress >= 100 && { status: 'COMPLETED', completedAt: new Date() })
      })
    } catch (error) {
      logger.error('Failed to update goal progress', {
        functionName: 'TimetableService.updateGoalProgress',
        error: error instanceof Error ? error.message : 'Unknown error',
        goalId
      })
    }
  }











  /**
   * Lock the user's timetable with week-lock mechanism
   */
  static async lockTimetable(
    userId: string, 
    payload: z.infer<typeof lockTimetableSchema>
  ) {
    logger.info("Locking user timetable", {
      functionName: "TimetableService.lockTimetable",
      metadata: { 
        userId, 
        fixedTimes: payload.fixedTimes.length, 
        tasks: payload.tasks.length,
        sleepSchedules: payload.sleepSchedules.length
      }
    });

    // Validate that tasks don't overlap with each other
    this.validateNoTaskOverlaps(payload.tasks);

    // Validate tasks don't conflict with fixed times
    this.validateTasksWithFixedTimes(payload.tasks, payload.fixedTimes);

    // Validate sleep schedules don't conflict
    this.validateSleepSchedules(payload.sleepSchedules);

    const result = await TimetableRepository.lockUserTimetable(userId, payload);

    logger.info("Timetable locked successfully", {
      functionName: "TimetableService.lockTimetable",
      metadata: { 
        userId, 
        created: result.created,
        updated: result.updated,
        skipped: result.skipped,
        total: result.fixedTimes.length + result.sleepSchedules.length + result.tasks.length
      }
    });

    return {
      ...result,
      message: this.generateLockMessage(result)
    };
  }

  /**
   * Validate that tasks don't overlap with each other on same day
   */
  private static validateNoTaskOverlaps(tasks: any[]) {
    const tasksByDay: Record<string, any[]> = {};
    
    // Group tasks by day
    tasks.forEach(task => {
      if (!tasksByDay[task.day]) {
        tasksByDay[task.day] = [];
      }
      tasksByDay[task.day].push(task);
    });

    // Check for overlaps within each day
    for (const [day, dayTasks] of Object.entries(tasksByDay)) {
      // Sort by start time
      dayTasks.sort((a, b) => this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime));

      for (let i = 0; i < dayTasks.length - 1; i++) {
        const current = dayTasks[i];
        const next = dayTasks[i + 1];
        
        const currentEnd = this.timeToMinutes(current.endTime || this.calculateEndTime(current.startTime, current.duration));
        const nextStart = this.timeToMinutes(next.startTime);

        if (currentEnd > nextStart) {
          throw new AppError(
            `Tasks overlap on ${day}: "${current.title}" (${current.startTime}-${current.endTime}) and "${next.title}" (${next.startTime}-${next.endTime})`,
            400
          );
        }
      }
    }
  }

  /**
   * Validate tasks don't conflict with fixed times
   */
  private static validateTasksWithFixedTimes(tasks: any[], fixedTimes: any[]) {
    for (const task of tasks) {
      const taskStart = this.timeToMinutes(task.startTime);
      const taskEnd = this.timeToMinutes(task.endTime || this.calculateEndTime(task.startTime, task.duration));

      // Find fixed times that include this day
      const relevantFixedTimes = fixedTimes.filter(ft => 
        ft.days.includes(task.day)
      );

      for (const ft of relevantFixedTimes) {
        const ftStart = this.timeToMinutes(ft.startTime);
        const ftEnd = this.timeToMinutes(ft.endTime);

        // Check if task overlaps with fixed time
        if (taskStart < ftEnd && taskEnd > ftStart) {
          // Check if it's during a free period
          const isInFreePeriod = ft.freePeriods?.some((fp: any) => 
            fp.day === task.day &&
            this.timeToMinutes(fp.startTime) <= taskStart &&
            this.timeToMinutes(fp.endTime) >= taskEnd
          );

          if (!isInFreePeriod) {
            throw new AppError(
              `Task "${task.title}" conflicts with fixed time "${ft.title}" on ${task.day} (${ft.startTime}-${ft.endTime})`,
              400
            );
          }
        }
      }
    }
  }

  /**
   * Validate sleep schedules don't conflict
   */
  private static validateSleepSchedules(sleepSchedules: any[]) {
    const daysWithSleep = new Set();
    
    for (const schedule of sleepSchedules) {
      if (daysWithSleep.has(schedule.day)) {
        throw new AppError(`Multiple sleep schedules for ${schedule.day}`, 400);
      }
      daysWithSleep.add(schedule.day);

      // Validate bedtime and wake time are valid
      const bedtime = this.timeToMinutes(schedule.bedtime);
      const wakeTime = this.timeToMinutes(schedule.wakeTime);
      
      // Allow next day wake times
      const duration = wakeTime < bedtime ? wakeTime + (24 * 60) - bedtime : wakeTime - bedtime;
      
      if (duration < 60) {
        throw new AppError(`Sleep duration on ${schedule.day} is too short (minimum 1 hour)`, 400);
      }
      
      if (duration > 12 * 60) {
        throw new AppError(`Sleep duration on ${schedule.day} is too long (maximum 12 hours)`, 400);
      }
    }
  }

  /**
   * Generate user-friendly message about lock results
   */
  private static generateLockMessage(result: any): string {
    const totalCreated = result.created.fixedTimes + result.created.sleepSchedules + result.created.tasks;
    const totalUpdated = result.updated.fixedTimes + result.updated.sleepSchedules + result.updated.tasks;
    const totalSkipped = result.skipped.fixedTimes + result.skipped.sleepSchedules + result.skipped.tasks;

    if (totalCreated === 0 && totalUpdated === 0) {
      return "Timetable already locked. No changes detected.";
    }

    const parts = [];
    if (totalCreated > 0) parts.push(`${totalCreated} new items created`);
    if (totalUpdated > 0) parts.push(`${totalUpdated} items updated`);
    if (totalSkipped > 0) parts.push(`${totalSkipped} items unchanged`);

    return `Timetable locked successfully: ${parts.join(', ')}.`;
  }

  // ==================== UTILITY FUNCTIONS ====================

  private static timeToMinutes3(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private static calculateEndTime2(startTime: string, duration: number): string {
    const [sh, sm] = startTime.split(':').map(Number);
    let totalMin = sh * 60 + sm + duration;
    const eh = Math.floor(totalMin / 60) % 24;
    const em = totalMin % 60;
    return `${eh.toString().padStart(2, '0')}:${em.toString().padStart(2, '0')}`;
  }


// ==================== 🗑️ RESET TIMETABLE ====================

/**
 * Reset/clear user timetable data
 */
static async resetTimetable(
  userId: string,
  options: {
    resetTasks: boolean;
    resetFixedTimes: boolean;
    resetSleepSchedules: boolean;
  }
): Promise<ResetTimetableResult> {
  logger.warn("Resetting user timetable - DANGEROUS OPERATION", {
    functionName: "TimetableService.resetTimetable",
    metadata: { 
      userId, 
      resetTasks: options.resetTasks,
      resetFixedTimes: options.resetFixedTimes,
      resetSleepSchedules: options.resetSleepSchedules
    }
  });

  return await TimetableRepository.resetUserTimetable(userId, options);
}





  // ==================== 🛠️ UTILITY HELPERS ====================

  /**
   * Get today's day name
   */
  private static getTodayDay(): DayOfWeek {
    const days: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[new Date().getDay()] as DayOfWeek
  }

  /**
   * Get date for a given day (next occurrence)
   */
  private static getDateForDay(day: DayOfWeek): Date {
    const today = new Date()
    const todayDay = today.getDay()
    const targetDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(day)
    
    let diff = targetDay - todayDay
    if (diff < 0) diff += 7
    
    const date = new Date(today)
    date.setDate(today.getDate() + diff)
    date.setHours(0, 0, 0, 0)
    
    return date
  }

  /**
   * Get day of week from date
   */
  private static getDayOfWeek(date: Date): DayOfWeek {
    const days: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[date.getDay()] as DayOfWeek
  }

  /**
   * Normalize day string
   */
  private static normalizeDay(day: string): DayOfWeek {
    const dayMap: Record<string, DayOfWeek> = {
      'mon': 'Mon', 'monday': 'Mon', 'Mon': 'Mon', 'MONDAY': 'Mon',
      'tue': 'Tue', 'tuesday': 'Tue', 'Tue': 'Tue', 'TUESDAY': 'Tue',
      'wed': 'Wed', 'wednesday': 'Wed', 'Wed': 'Wed', 'WEDNESDAY': 'Wed',
      'thu': 'Thu', 'thursday': 'Thu', 'Thu': 'Thu', 'THURSDAY': 'Thu',
      'fri': 'Fri', 'friday': 'Fri', 'Fri': 'Fri', 'FRIDAY': 'Fri',
      'sat': 'Sat', 'saturday': 'Sat', 'Sat': 'Sat', 'SATURDAY': 'Sat',
      'sun': 'Sun', 'sunday': 'Sun', 'Sun': 'Sun', 'SUNDAY': 'Sun'
    }
    
    const normalized = dayMap[day.toLowerCase()]
    if (!normalized) {
      throw new Error(`Invalid day: ${day}`)
    }
    return normalized
  }

  /**
   * Convert to sleep day enum
   */
  private static convertToSleepDay(day: DayOfWeek): string {
    const map: Record<DayOfWeek, string> = {
      'Mon': 'MONDAY',
      'Tue': 'TUESDAY',
      'Wed': 'WEDNESDAY',
      'Thu': 'THURSDAY',
      'Fri': 'FRIDAY',
      'Sat': 'SATURDAY',
      'Sun': 'SUNDAY'
    }
    return map[day]
  }

  /**
   * Get next day
   */
  private static getNextDay(currentDay: string): DayOfWeek {
    const days: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const currentIndex = days.indexOf(currentDay as DayOfWeek)
    return days[(currentIndex + 1) % days.length]
  }

  /**
   * Convert time string to minutes
   */
  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  /**
   * Convert minutes to time string
   */
  private static minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  /**
   * Calculate end time from start time and duration
   */
  private static calculateEndTime(startTime: string, duration: number): string {
    const [hours, minutes] = startTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + duration
    const endHours = Math.floor(totalMinutes / 60)
    const endMinutes = totalMinutes % 60
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
  }
}