// src/app/dashboard/timetable/builder/Part2_SleepSchedule.tsx
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Bed, Settings, Moon, Sunrise, MoonStar, AlarmClock, Heart } from 'lucide-react'

interface SleepSchedule {
  id: string
  day: string
  bedtime: string
  wakeTime: string
  duration: number
  isActive: boolean
  color: string
  type: 'regular' | 'power_nap' | 'recovery' | 'early' | 'late'
  notes?: string
}

interface SleepSchedulePartProps {
  timeSettings: any
  sleepSchedules: SleepSchedule[]
  sleepStats: {
    totalSleepHours: number
    avgSleepHours: number
    daysWithSleep: number
    recommendedHours: number
  }
  setTimeSettings: (settings: any) => void
  setShowSleepScheduleModal: (show: boolean) => void
  formatTimeDisplay: (time: string) => string
  getSleepTypeInfo: (type: string) => { id: string; label: string; icon: any; color: string; bgColor: string }
}

export function SleepSchedulePart({
  timeSettings,
  sleepSchedules,
  sleepStats,
  setTimeSettings,
  setShowSleepScheduleModal,
  formatTimeDisplay,
  getSleepTypeInfo
}: SleepSchedulePartProps) {
  return (
    <Card className="border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              <Bed className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Sleep Schedule</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {sleepStats.daysWithSleep} days scheduled • Avg {sleepStats.avgSleepHours.toFixed(1)}h per night
                {sleepStats.avgSleepHours < 7 && ' • Consider getting more rest'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 mr-2">
              <Switch
                checked={timeSettings.showSleepBlocks}
                onCheckedChange={(checked) => setTimeSettings({...timeSettings, showSleepBlocks: checked})}
                id="show-sleep"
              />
              <Label htmlFor="show-sleep" className="text-sm text-gray-600 dark:text-gray-400">
                Show in timetable
              </Label>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => setShowSleepScheduleModal(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Adjust Schedule
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {sleepSchedules.filter(s => s.isActive).slice(0, 4).map(schedule => {
            const sleepType = getSleepTypeInfo(schedule.type)
            const Icon = sleepType.icon
            return (
              <div key={schedule.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400" />
                  <span className="font-medium text-gray-800 dark:text-gray-300">{schedule.day}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Icon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {formatTimeDisplay(schedule.bedtime)} - {formatTimeDisplay(schedule.wakeTime)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {Math.round(schedule.duration / 60)}h {schedule.duration % 60}m • {sleepType.label}
                </div>
              </div>
            )
          })}
          {sleepSchedules.filter(s => s.isActive).length > 4 && (
            <div className="p-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                +{sleepSchedules.filter(s => s.isActive).length - 4} more days
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}