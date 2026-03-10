// src/modules/fixed-times/fixed-time.types.ts
export type FixedTimeType = 'COLLEGE' | 'OFFICE' | 'SCHOOL' | 'COMMUTE' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'FREE' | 'FAMILY' | 'HEALTH' | 'OTHER'

export interface CreateFixedTimeDTO {
  title: string
  description?: string
  days: string[] // ['Mon', 'Tue', ...]
  startTime: string
  endTime: string
  type: FixedTimeType
  color?: string
  isEditable?: boolean
  freePeriods?: CreateFreePeriodDTO[]
}

export interface UpdateFixedTimeDTO extends Partial<CreateFixedTimeDTO> {}

export interface CreateFreePeriodDTO {
  title?: string
  startTime: string
  endTime: string
  day: string
}

export interface UpdateFreePeriodDTO extends Partial<CreateFreePeriodDTO> {}