// src/hooks/use-streaks.ts
import { useState, useEffect } from 'react'
import { AuthService } from './useAuth'

interface Streak {
  current: number
  best: number
  lastActive: Date | null
}

interface SubjectStreak {
  subject: string
  currentStreak: number
  longestStreak: number
  lastActiveDate: Date | null
  totalDaysStudied: number
  totalHours: number
}

export function useStreaks() {
  const [globalStreak, setGlobalStreak] = useState<Streak>({ current: 0, best: 0, lastActive: null })
  const [subjectStreaks, setSubjectStreaks] = useState<SubjectStreak[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStreaks()
  }, [])

  const fetchStreaks = async () => {
    try {
      const user = AuthService.getCurrentUser()
      if (!user) return

      // Mock data
      setGlobalStreak({
        current: 7,
        best: 21,
        lastActive: new Date()
      })

      setSubjectStreaks([
        {
          subject: 'DSA',
          currentStreak: 14,
          longestStreak: 21,
          lastActiveDate: new Date(),
          totalDaysStudied: 45,
          totalHours: 120
        },
        {
          subject: 'AI/ML',
          currentStreak: 7,
          longestStreak: 15,
          lastActiveDate: new Date('2024-12-10'),
          totalDaysStudied: 20,
          totalHours: 45
        },
        {
          subject: 'Web Dev',
          currentStreak: 0,
          longestStreak: 10,
          lastActiveDate: new Date('2024-12-05'),
          totalDaysStudied: 15,
          totalHours: 35
        }
      ])
    } catch (error) {
      console.error('Error fetching streaks:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStreak = async (subject?: string) => {
    try {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      // Update global streak
      if (!globalStreak.lastActive || 
          globalStreak.lastActive.toDateString() !== today.toDateString()) {
        
        const wasActiveYesterday = globalStreak.lastActive?.toDateString() === yesterday.toDateString()
        
        const newCurrent = wasActiveYesterday ? globalStreak.current + 1 : 1
        const newBest = Math.max(globalStreak.best, newCurrent)
        
        setGlobalStreak({
          current: newCurrent,
          best: newBest,
          lastActive: today
        })

        // Save to localStorage
        AuthService.updateUserStats({
          streak: newCurrent,
          best_streak: newBest
        })
      }

      // Update subject streak if specified
      if (subject) {
        setSubjectStreaks(prev => 
          prev.map(s => 
            s.subject === subject
              ? {
                  ...s,
                  currentStreak: s.lastActiveDate?.toDateString() === yesterday.toDateString()
                    ? s.currentStreak + 1
                    : 1,
                  longestStreak: Math.max(s.longestStreak, 
                    s.lastActiveDate?.toDateString() === yesterday.toDateString()
                      ? s.currentStreak + 1
                      : 1
                  ),
                  lastActiveDate: today,
                  totalDaysStudied: s.totalDaysStudied + 1
                }
              : s
          )
        )
      }
    } catch (error) {
      console.error('Error updating streak:', error)
    }
  }

  const getSubjectStreak = (subject: string) => {
    return subjectStreaks.find(s => s.subject === subject)
  }

  const getHeatmapData = () => {
    // Generate 365 days of activity data
    const data = []
    const today = new Date()
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Mock random activity
      const activity = Math.random() > 0.3 ? Math.floor(Math.random() * 5) : 0
      
      data.push({
        date: date.toISOString().split('T')[0],
        count: activity,
        level: activity === 0 ? 0 : activity === 1 ? 1 : activity === 2 ? 2 : activity >= 3 ? 3 : 0
      })
    }
    
    return data
  }

  return {
    globalStreak,
    subjectStreaks,
    loading,
    updateStreak,
    getSubjectStreak,
    getHeatmapData
  }
}