// src/modules/timetable/timetable.validation.ts

import { z } from 'zod'

// Time format regex (HH:MM, 24-hour)
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

// Day enum for validation
export const DayEnum = z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'])

// Priority enum
const PriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])

// Task status enum
const TaskStatusEnum = z.enum(['PENDING', 'ONGOING', 'COMPLETED', 'MISSED', 'SKIPPED', 'DELAYED', 'RESCHEDULED'])

// Time slot type enum
const TimeSlotTypeEnum = z.enum([
  'TASK', 'FIXED', 'BREAK', 'COMMUTE', 'FREE', 'CLASS', 'STUDY', 
  'HEALTH', 'PROJECT', 'MEETING', 'WORKOUT', 'MEAL', 'ENTERTAINMENT', 'SLEEP'
])

// Task category enum
const TaskCategoryEnum = z.enum([
  'ACADEMIC', 'PROFESSIONAL', 'HEALTH', 'PERSONAL', 'LEARNING', 
  'BREAK', 'COMMUTE', 'PROJECT', 'SLEEP', 'OTHER'
])

// Fixed time type enum
const FixedTimeTypeEnum = z.enum([
  'COLLEGE', 'OFFICE', 'SCHOOL', 'COMMUTE', 'MEETING', 'WORKOUT', 
  'MEAL', 'ENTERTAINMENT', 'FREE', 'FAMILY', 'HEALTH', 'OTHER'
])

// Sleep type enum
const SleepTypeEnum = z.enum(['REGULAR', 'POWER_NAP', 'RECOVERY', 'EARLY', 'LATE'])

// ==================== FREE PERIOD SCHEMA ====================
const freePeriodSchema = z.object({
  title: z.string().optional().default('Free Period'),
  startTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  day: DayEnum,
}).refine(data => {
  const start = data.startTime.split(':').map(Number);
  const end = data.endTime.split(':').map(Number);
  const startMinutes = start[0] * 60 + start[1];
  const endMinutes = end[0] * 60 + end[1];
  return endMinutes > startMinutes;
}, {
  message: 'End time must be after start time',
  path: ['endTime']
});

// ==================== FIXED TIME SCHEMA ====================
export const createFixedTimeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  days: z.array(DayEnum).min(1, 'At least one day required'),
  startTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  type: FixedTimeTypeEnum.default('OTHER'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').optional().default('#6B7280'),
  isEditable: z.boolean().optional().default(false),
  freePeriods: z.array(freePeriodSchema).optional().default([]),
}).refine(data => {
  const start = data.startTime.split(':').map(Number);
  const end = data.endTime.split(':').map(Number);
  const startMinutes = start[0] * 60 + start[1];
  const endMinutes = end[0] * 60 + end[1];
  return endMinutes > startMinutes;
}, {
  message: 'End time must be after start time',
  path: ['endTime']
});

// ==================== SLEEP SCHEDULE SCHEMA ====================
export const createSleepScheduleSchema = z.object({
  day: DayEnum,
  bedtime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  wakeTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  duration: z.number().int().positive().optional(),
  isActive: z.boolean().optional().default(true),
  type: SleepTypeEnum.default('REGULAR'),
  notes: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').optional().default('#4B5563'),
});

// ==================== TASK SCHEMA ====================
export const createTaskSchema1 = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  subject: z.string().optional(),
  note: z.string().optional(),
  startTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)').optional(),
  duration: z.number().int().positive('Duration must be positive'),
  priority: PriorityEnum.optional().default('MEDIUM'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').optional().default('#3B82F6'),
  day: DayEnum,
  type: TimeSlotTypeEnum.default('TASK'),
  category: TaskCategoryEnum.default('ACADEMIC'),
  icon: z.string().optional(),
  goalId: z.string().uuid('Invalid goal ID').optional().nullable(),
  milestoneId: z.string().uuid('Invalid milestone ID').optional().nullable(),
  fixedTimeId: z.string().uuid('Invalid fixed time ID').optional().nullable(),
  status: TaskStatusEnum.optional().default('PENDING'),
  isCompleted: z.boolean().optional().default(false),
  completedAt: z.string().datetime().optional().nullable(),
}).refine(data => {
  if (data.endTime) {
    const start = data.startTime.split(':').map(Number);
    const end = data.endTime.split(':').map(Number);
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];
    return endMinutes > startMinutes;
  }
  return true;
}, {
  message: 'End time must be after start time',
  path: ['endTime']
});


// src/modules/timetable/timetable.validation.ts

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  subject: z.string().optional(),
  note: z.string().optional(),
  startTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)').optional(),
  duration: z.number().int().positive('Duration must be positive'),
  priority: PriorityEnum.optional().default('MEDIUM'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').optional().default('#3B82F6'),
  day: DayEnum,
  type: TimeSlotTypeEnum.default('TASK'),
  category: TaskCategoryEnum.default('ACADEMIC'),
  icon: z.string().optional(),
  goalId: z.string().uuid('Invalid goal ID').optional().nullable(),
  milestoneId: z.string().uuid('Invalid milestone ID').optional().nullable(),
  fixedTimeId: z.string().uuid('Invalid fixed time ID').optional().nullable(),
  status: TaskStatusEnum.optional().default('PENDING'),
  isCompleted: z.boolean().optional().default(false),
  completedAt: z.string().datetime().optional().nullable(),
}).superRefine((data, ctx) => {
  // Validate time format first
  if (!data.startTime || !data.endTime) return;
  
  // Parse times
  const [startHour, startMin] = data.startTime.split(':').map(Number);
  const [endHour, endMin] = data.endTime.split(':').map(Number);
  
  // Convert to minutes
  const startMinutes = startHour * 60 + startMin;
  let endMinutes = endHour * 60 + endMin;
  
  // Handle midnight crossing: if end time is less than start time,
  // it means the task goes into the next day
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60; // Add 24 hours
  }
  
  // Check if end time is after start time
  if (endMinutes <= startMinutes) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'End time must be after start time',
      path: ['endTime']
    });
  }
  
  // Validate that startTime is valid (not 24:00)
  if (startHour > 23 || startMin > 59) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid start time - hours must be 00-23',
      path: ['startTime']
    });
  }
  
  // Validate that endTime is valid (not 24:00)
  if (endHour > 23 || endMin > 59) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid end time - hours must be 00-23',
      path: ['endTime']
    });
  }
});






// ==================== GET TIMETABLE SCHEMA ====================
export const getTimetableSchema = z.object({
  day: z.string().optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  showWeekends: z.coerce.boolean().default(true),
  timeRangeStart: z.coerce.number().int().min(0).max(23).default(6),
  timeRangeEnd: z.coerce.number().int().min(0).max(23).default(23),
  compact: z.coerce.boolean().default(false),
});

// ==================== TIMETABLE FILTER SCHEMA ====================
export const timetableFilterSchema = z.object({
  day: DayEnum.optional(),
});

// ==================== SMART DELAY SCHEMAS ====================
export const smartDelayRequestSchema = z.object({
  taskId: z.string().uuid('Invalid task ID'),
  preferredDelay: z.coerce.number().int().min(15).max(180).default(30),
});

export const applySmartDelaySchema = z.object({
  taskId: z.string().uuid('Invalid task ID'),
  optionId: z.string(),
  day: DayEnum,
  startTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  type: z.enum(['immediate', 'free-period', 'evening', 'next-day']),
});

// ==================== TASK FEEDBACK SCHEMA ====================
export const taskFeedbackSchema = z.object({
  taskId: z.string().uuid('Invalid task ID'),
  focusLevel: z.coerce.number().int().min(1).max(10),
  completedWell: z.boolean(),
  notes: z.string().max(500, 'Notes too long').optional(),
});

// ==================== TASK STATUS UPDATE SCHEMA ====================
export const updateTaskStatusSchema = z.object({
  taskId: z.string().uuid('Invalid task ID'),
  status: z.enum(['PENDING', 'ONGOING', 'COMPLETED', 'MISSED', 'SKIPPED', 'DELAYED', 'RESCHEDULED']),
  notes: z.string().max(500).optional(),
});

// ==================== SIMPLE DELAY SCHEMA ====================
export const simpleDelaySchema = z.object({
  taskId: z.string().uuid('Invalid task ID'),
  minutes: z.coerce.number().int().min(5).max(180),
});

// ==================== RESCHEDULE TO FREE PERIOD SCHEMA ====================
export const rescheduleToFreePeriodSchema = z.object({
  taskId: z.string().uuid('Invalid task ID'),
  fixedTimeId: z.string().uuid('Invalid fixed time ID').optional(),
  freePeriodId: z.string().uuid('Invalid free period ID').optional(),
});

// ==================== BULK OPERATIONS SCHEMA ====================
export const bulkCompleteTasksSchema = z.object({
  taskIds: z.array(z.string().uuid()).min(1).max(50),
  completedAt: z.string().datetime().optional(),
});

export const bulkDelayTasksSchema = z.object({
  taskIds: z.array(z.string().uuid()).min(1).max(50),
  minutes: z.coerce.number().int().min(15).max(180),
});

// ==================== STATISTICS SCHEMA ====================
export const timetableStatsSchema = z.object({
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  weeks: z.coerce.number().int().min(1).max(12).default(4),
});

// ==================== LOCK TIMETABLE SCHEMA ====================
export const lockTimetableSchema = z.object({
  fixedTimes: z.array(createFixedTimeSchema).optional().default([]),
  sleepSchedules: z.array(createSleepScheduleSchema).optional().default([]),
  tasks: z.array(createTaskSchema).optional().default([]),
}).refine(data => {
  return data.fixedTimes.length > 0 || data.sleepSchedules.length > 0 || data.tasks.length > 0;
}, {
  message: 'At least one of fixedTimes, sleepSchedules, or tasks must be provided',
});

// ==================== RESET TIMETABLE SCHEMA ====================
export const resetTimetableSchema = z.object({
  confirm: z.boolean().optional().default(false),
  resetTasks: z.boolean().optional().default(true),
  resetFixedTimes: z.boolean().optional().default(true),
  resetSleepSchedules: z.boolean().optional().default(true),
});