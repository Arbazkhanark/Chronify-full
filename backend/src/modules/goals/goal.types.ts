// src/modules/goals/goal.types.ts
export type GoalPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type GoalStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'
export type GoalCategory = 'ACADEMIC' | 'PROFESSIONAL' | 'HEALTH' | 'PERSONAL' | 'SKILL_DEVELOPMENT' | 'FINANCIAL' | 'SOCIAL' | 'CREATIVE'
export type GoalType = 'SHORT_TERM' | 'LONG_TERM'

export interface CreateGoalDTO {
  title: string
  description?: string
  category: GoalCategory
  priority: GoalPriority
  type: GoalType
  targetDate?: string
  totalHours?: number
  weeklyTarget?: number
  color?: string
  tags?: string[]
  isPublic?: boolean
}

export interface UpdateGoalDTO extends Partial<CreateGoalDTO> {
  status?: GoalStatus
  progress?: number
  completedHours?: number
  streak?: number
}

export interface CreateMilestoneDTO {
  title: string
  description?: string
  targetDate?: string
}

export interface UpdateMilestoneDTO extends Partial<CreateMilestoneDTO> {
  completed?: boolean
  progress?: number
}

export interface ProgressUpdateDTO {
  hours: number
}

export interface GoalFilterDTO {
  filter?: 'all' | 'active' | 'completed' | 'delayed' | 'not_started' | 'short' | 'long'
  search?: string
  sort?: 'priority' | 'progress' | 'deadline' | 'created' | 'title'
  category?: GoalCategory
  status?: GoalStatus
  type?: GoalType
  limit?: number
  page?: number
}

export interface GoalStats {
  total: number
  active: number
  completed: number
  delayed: number
  notStarted: number
  totalHours: number
  completedHours: number
  averageProgress: number
  upcomingDeadlines: number
  highPriority: number
  streaks: {
    current: number
    longest: number
    totalActiveDays: number
  }
  categoryDistribution: Record<string, number>
}