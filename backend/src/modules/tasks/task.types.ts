// src/modules/tasks/task.types.ts
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type TaskStatus = 'PENDING' | 'ONGOING' | 'COMPLETED' | 'MISSED' | 'SKIPPED' | 'DELAYED' | 'RESCHEDULED'
export type TimeSlotType = 'TASK' | 'FIXED' | 'BREAK' | 'COMMUTE' | 'FREE' | 'CLASS' | 'STUDY' | 'HEALTH' | 'PROJECT' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT'

export type TaskCategory = 'ACADEMIC' | 'PROFESSIONAL' | 'HEALTH' | 'PERSONAL' | 'LEARNING' | 'BREAK' | 'COMMUTE' | 'PROJECT' | 'SLEEP'


export interface CreateTaskDTO {
  title: string
  subject?: string
  startTime: string
  duration: number
  priority: Priority
  color?: string
  day: string
  type: TimeSlotType

  // Optional
  note?:string
  category?:string
  
  // Optional relationships
  goalId?: string
  milestoneId?: string
  fixedTimeId?: string
  
  // Metadata
  isFreePeriod?: boolean
}

export interface UpdateTaskDTO extends Partial<CreateTaskDTO> {
  status?: TaskStatus
  isCompleted?: boolean
  completedAt?: Date
  endTime?: string
}

export interface BulkTaskDTO extends Omit<CreateTaskDTO, 'userId'> {}

export interface DragDropDTO {
  taskId: string
  day: string
  time: string
  duration: number
  fixedTimeId?: string
}

export interface TaskFilterDTO {
  day?: string
  goalId?: string
  fixedTimeId?: string
  status?: TaskStatus
  type?: TimeSlotType
  priority?: Priority
  isCompleted?: boolean
  search?: string
  fromDate?: string
  toDate?: string
  sort?: 'time' | 'priority' | 'day' | 'created'
  limit?: number
  page?: number
}

export interface TaskStats {
  total: number
  completed: number
  pending: number
  overdue: number
  totalHours: number
  completedHours: number
  completedToday: number
  upcomingTasks: number
  byPriority: Record<string, number>
  byDay: Record<string, number>
  byGoal: Record<string, number>
}