// src/lib/ai/timetable-generator.ts

// ==================== TYPES ====================

interface AIGoal {
  title: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  targetDate: Date
  progress: number
  subjects: string[]
}

interface AIFixedBusyTime {
  dayOfWeek: number
  startTime: string
  endTime: string
  title: string
}

interface AITimetablePreferences {
  preferredStudyTime: string[]
  breakFrequency: number
  maxSessionLength: number
}

interface AITimetableRequest {
  goals: AIGoal[]
  fixedBusyTimes: AIFixedBusyTime[]
  availableHoursPerDay: number
  studyIntensity: 'LIGHT' | 'MEDIUM' | 'HARD' | 'EXTREME'
  preferences: AITimetablePreferences
}

interface AITimetableSlot {
  dayOfWeek: number
  startTime: string
  endTime: string
  title: string
  subject: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description?: string
  isBreak?: boolean
  duration: number
  isAISuggested: boolean
  aiConfidence?: number
}

interface AITimetableSummary {
  totalStudyHours: number
  distribution: Record<string, number>
  completionTimeline: string
  recommendations: string[]
}

interface AITimetableResponse {
  slots: AITimetableSlot[]
  summary: AITimetableSummary
}

// ==================== GENERATOR ====================

export class AITimetableGenerator {
  static async generate(
    request: AITimetableRequest,
  ): Promise<AITimetableResponse> {
    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1500),
    )

    const days = [1, 2, 3, 4, 5, 6, 0] // Monday to Sunday
    const slots: AITimetableSlot[] = []

    // Calculate intensity multipliers
    const intensityMultiplier: Record<
      AITimetableRequest['studyIntensity'],
      number
    > = {
      LIGHT: 0.8,
      MEDIUM: 1.0,
      HARD: 1.2,
      EXTREME: 1.5,
    }

    const multiplier =
      intensityMultiplier[request.studyIntensity]

    // Generate for each day
    days.forEach((day) => {
      const dayBusyTimes =
        request.fixedBusyTimes.filter(
          (t) => t.dayOfWeek === day,
        )

      // Start from 6 AM
      let currentTime = 6 * 60 // in minutes from midnight
      const endOfDay = 22 * 60 // 10 PM

      const studySessions: AITimetableSlot[] = []

      while (currentTime < endOfDay) {
        // Check if this time is busy
        const isBusy = dayBusyTimes.some((busy) => {
          const busyStart = this.timeToMinutes(
            busy.startTime,
          )
          const busyEnd = this.timeToMinutes(
            busy.endTime,
          )
          return (
            currentTime >= busyStart &&
            currentTime < busyEnd
          )
        })

        if (!isBusy) {
          // Determine session length based on preferences
          let sessionLength = Math.min(
            request.preferences.maxSessionLength,
            Math.floor(Math.random() * 60) + 45, // 45-105 minutes
            endOfDay - currentTime,
          )

          // Adjust based on preferred time
          const hour = Math.floor(currentTime / 60)
          const isPreferredTime =
            (request.preferences.preferredStudyTime.includes(
              'Morning',
            ) &&
              hour >= 6 &&
              hour < 12) ||
            (request.preferences.preferredStudyTime.includes(
              'Afternoon',
            ) &&
              hour >= 12 &&
              hour < 17) ||
            (request.preferences.preferredStudyTime.includes(
              'Evening',
            ) &&
              hour >= 17 &&
              hour < 22) ||
            (request.preferences.preferredStudyTime.includes(
              'Night',
            ) &&
              hour >= 22)

          if (isPreferredTime) {
            sessionLength = Math.min(
              sessionLength * 1.2,
              request.preferences.maxSessionLength,
            )
          }

          if (sessionLength >= 30) {
            const subject = this.getNextSubject(
              request.goals,
              studySessions,
            )
            const priority = this.getSubjectPriority(
              request.goals,
              subject,
            )

            studySessions.push({
              dayOfWeek: day,
              startTime: this.minutesToTime(currentTime),
              endTime: this.minutesToTime(
                currentTime + sessionLength,
              ),
              title: this.getSessionTitle(
                subject,
                priority,
              ),
              subject,
              priority,
              duration: sessionLength,
              isAISuggested: true,
              aiConfidence:
                Math.floor(Math.random() * 20) + 75, // 75-95%
              description: this.getSessionDescription(
                subject,
                priority,
              ),
            })

            currentTime += sessionLength

            // Add break
            if (currentTime < endOfDay) {
              const breakLength = Math.min(
                request.preferences.breakFrequency,
                endOfDay - currentTime,
              )
              if (breakLength >= 10) {
                studySessions.push({
                  dayOfWeek: day,
                  startTime: this.minutesToTime(
                    currentTime,
                  ),
                  endTime: this.minutesToTime(
                    currentTime + breakLength,
                  ),
                  title: 'Short Break',
                  subject: 'Break',
                  priority: 'LOW',
                  duration: breakLength,
                  isBreak: true,
                  isAISuggested: true,
                })
                currentTime += breakLength
              }
            }
          } else {
            currentTime += 30
          }
        } else {
          // Skip busy time
          const busy = dayBusyTimes.find((b) => {
            const busyStart = this.timeToMinutes(
              b.startTime,
            )
            const busyEnd = this.timeToMinutes(
              b.endTime,
            )
            return (
              currentTime >= busyStart &&
              currentTime < busyEnd
            )
          })

          if (busy) {
            currentTime = this.timeToMinutes(
              busy.endTime,
            )
          } else {
            currentTime += 60
          }
        }
      }

      slots.push(...studySessions)
    })

    // Calculate statistics
    const subjectHours: Record<string, number> = {}
    slots.forEach((slot) => {
      if (!slot.isBreak) {
        subjectHours[slot.subject] =
          (subjectHours[slot.subject] || 0) +
          slot.duration / 60
      }
    })

    const totalStudyHours = Object.values(
      subjectHours,
    ).reduce((a, b) => a + b, 0)

    // Generate recommendations
    const recommendations = [
      'Schedule difficult subjects during your peak productivity hours',
      'Take a 5-minute break every 45-60 minutes to maintain focus',
      "Review previous day's topics for 15 minutes each morning",
      'Use weekends for longer study sessions and revision',
      'Adjust schedule based on actual progress and energy levels',
    ]

    // Add personalized recommendations
    if (request.studyIntensity === 'EXTREME') {
      recommendations.push(
        'Consider including short exercise breaks to maintain energy',
      )
    }

    if (
      request.preferences.preferredStudyTime.includes('Night')
    ) {
      recommendations.push(
        'Ensure adequate sleep when studying late at night',
      )
    }

    return {
      slots,
      summary: {
        totalStudyHours: parseFloat(
          totalStudyHours.toFixed(1),
        ),
        distribution: subjectHours,
        completionTimeline: this.calculateTimeline(
          request.goals,
          totalStudyHours,
        ),
        recommendations,
      },
    }
  }

  // ==================== HELPERS ====================

  private static timeToMinutes(time: string): number {
    const [hourStr, minuteStr] = time.split(':')
    let hour = parseInt(hourStr)
    const minute = parseInt(minuteStr)

    // Handle 24-hour format
    if (time.includes('PM') && hour !== 12) hour += 12
    if (time.includes('AM') && hour === 12) hour = 0

    return hour * 60 + minute
  }

  private static minutesToTime(minutes: number): string {
    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minute
      .toString()
      .padStart(2, '0')} ${period}`
  }

  private static getNextSubject(
    goals: AIGoal[],
    existingSessions: AITimetableSlot[],
  ): string {
    const allSubjects = goals.flatMap((g) => g.subjects)
    const uniqueSubjects = [...new Set(allSubjects)]

    if (uniqueSubjects.length === 0) return 'General Study'

    // Weight subjects by priority
    const subjectWeights: Record<string, number> = {}
    goals.forEach((goal) => {
      goal.subjects.forEach((subject) => {
        const weight =
          goal.priority === 'CRITICAL'
            ? 4
            : goal.priority === 'HIGH'
            ? 3
            : goal.priority === 'MEDIUM'
            ? 2
            : 1
        subjectWeights[subject] =
          (subjectWeights[subject] || 0) + weight
      })
    })

    // Count existing sessions
    const sessionCounts: Record<string, number> = {}
    existingSessions.forEach((session) => {
      if (!session.isBreak) {
        sessionCounts[session.subject] =
          (sessionCounts[session.subject] || 0) + 1
      }
    })

    // Find subject with highest weight and lowest count
    let bestSubject = uniqueSubjects[0]
    let bestScore = -Infinity

    uniqueSubjects.forEach((subject) => {
      const weight = subjectWeights[subject] || 1
      const count = sessionCounts[subject] || 0
      const score = weight / (count + 1) // +1 to avoid division by zero

      if (score > bestScore) {
        bestScore = score
        bestSubject = subject
      }
    })

    return bestSubject
  }

  private static getSubjectPriority(
    goals: AIGoal[],
    subject: string,
  ): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    for (const goal of goals) {
      if (goal.subjects.includes(subject)) {
        return goal.priority
      }
    }
    return 'MEDIUM'
  }

  private static getSessionTitle(
    subject: string,
    priority: string,
  ): string {
    const activities: Record<string, string[]> = {
      DSA: [
        'Problem Solving',
        'Algorithm Study',
        'Coding Practice',
        'Concept Revision',
      ],
      'AI/ML': [
        'Theory Study',
        'Model Building',
        'Practice Problems',
        'Project Work',
      ],
      'Web Dev': [
        'Frontend Practice',
        'Backend Coding',
        'Project Development',
        'Framework Learning',
      ],
      College: [
        'Lecture Review',
        'Assignment Work',
        'Exam Preparation',
        'Group Study',
      ],
      Projects: [
        'Feature Implementation',
        'Bug Fixing',
        'Code Review',
        'Documentation',
      ],
    }

    const subjectActivities = activities[subject] || [
      'Focused Study',
      'Concept Learning',
      'Practice Session',
    ]
    const activity =
      subjectActivities[
        Math.floor(
          Math.random() * subjectActivities.length,
        )
      ]

    return `${subject} - ${activity}`
  }

  private static getSessionDescription(
    subject: string,
    priority: string,
  ): string {
    const descriptions: Record<string, string> = {
      DSA: `Focus on ${
        priority === 'CRITICAL'
          ? 'mastering core concepts and solving complex problems'
          : 'understanding fundamentals and practicing basic problems'
      }`,
      'AI/ML': `Study ${
        priority === 'HIGH'
          ? 'advanced concepts and implement algorithms'
          : 'basic principles and work through examples'
      }`,
      'Web Dev': `Work on ${
        priority === 'MEDIUM'
          ? 'building features and improving skills'
          : 'learning new technologies and practicing'
      }`,
      College: `Complete ${
        priority === 'HIGH'
          ? 'important assignments and prepare for exams'
          : 'regular coursework and review notes'
      }`,
      Projects: `${
        priority === 'HIGH'
          ? 'Implement key features and fix critical bugs'
          : 'Work on improvements and add new functionality'
      }`,
    }

    return (
      descriptions[subject] ||
      'Focused study session to improve knowledge and skills'
    )
  }

  private static calculateTimeline(
    goals: AIGoal[],
    weeklyHours: number,
  ): string {
    // Calculate total estimated hours needed
    let totalHoursNeeded = 0

    goals.forEach((goal) => {
      const daysRemaining = Math.ceil(
        (goal.targetDate.getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      )
      const weeksRemaining = Math.max(
        1,
        Math.ceil(daysRemaining / 7),
      )

      let hoursNeeded = 0
      switch (goal.priority) {
        case 'CRITICAL':
          hoursNeeded = weeksRemaining * 20
          break
        case 'HIGH':
          hoursNeeded = weeksRemaining * 15
          break
        case 'MEDIUM':
          hoursNeeded = weeksRemaining * 10
          break
        case 'LOW':
          hoursNeeded = weeksRemaining * 5
          break
      }

      // Adjust based on progress
      hoursNeeded = hoursNeeded * ((100 - goal.progress) / 100)
      totalHoursNeeded += hoursNeeded
    })

    const weeksToComplete = Math.ceil(
      totalHoursNeeded / weeklyHours,
    )

    if (weeksToComplete <= 2) return 'Within 2 weeks'
    if (weeksToComplete <= 4) return 'Within 1 month'
    if (weeksToComplete <= 8) return 'Within 2 months'
    if (weeksToComplete <= 12) return 'Within 3 months'
    if (weeksToComplete <= 24) return 'Within 6 months'
    return 'Long-term plan'
  }
}