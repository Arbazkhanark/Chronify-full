// src/app/dashboard/timetable/builder/Part4_TimetableGrid.tsx
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { 
  Coffee, Moon, Plus, MoreVertical, Edit2, Copy, Trash2, 
  Badge, CheckCircle2, GripVertical,
  Clock
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent } from '@/components/ui/card'

interface TimeSlot {
  id: string
  title: string
  subject: string
  startTime: string
  endTime: string
  duration: number
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  color: string
  isCompleted?: boolean
  day: string
  type: string
  isFreePeriod?: boolean
  fixedCommitmentId?: string
  goalId?: string
  milestoneId?: string
  isSleepTime?: boolean
  sleepScheduleId?: string
}

interface FixedTime {
  id: string
  title: string
  days: string[]
  startTime: string
  endTime: string
  type: string
  color?: string
  freePeriods?: any[]
}

interface TimetableGridPartProps {
  timeSettings: any
  timeSlots: string[]
  days: string[]
  tasks: TimeSlot[]
  fixedTimes: FixedTime[]
  isLocked: boolean
  isExtendedTime: (time: string) => boolean
  isTimeInFixedSlot: (day: string, time: string) => FixedTime | null
  isTimeInFreePeriod: (day: string, time: string) => {fixedTime: FixedTime, freePeriod: any} | null
  getTasksForCell: (day: string, time: string) => TimeSlot[]
  shouldShowTaskInCell: (task: TimeSlot, day: string, time: string) => boolean
  getTaskSpan: (task: TimeSlot) => number
  getTimeSlotColor: (type: string) => string
  formatTimeDisplay: (time: string) => string
  getNextTimeSlot: (time: string) => string
  handleCellClick: (day: string, time: string) => void
  handleFixedTimeClick: (fixedTime: FixedTime) => void
  handleEditTask: (task: TimeSlot) => void
  handleDeleteTask: (taskId: string) => void
  handleDuplicateTask: (task: TimeSlot) => void
  setTaskCreationContext: (context: {day: string, time: string} | null) => void
  setShowTaskCreationDialog: (show: boolean) => void
  setShowSleepScheduleModal: (show: boolean) => void
  sleepSchedules?: any[]
}

export function TimetableGridPart({
  timeSettings,
  timeSlots,
  days,
  tasks,
  fixedTimes,
  isLocked,
  isExtendedTime,
  isTimeInFixedSlot,
  isTimeInFreePeriod,
  getTasksForCell,
  shouldShowTaskInCell,
  getTaskSpan,
  getTimeSlotColor,
  formatTimeDisplay,
  getNextTimeSlot,
  handleCellClick,
  handleFixedTimeClick,
  handleEditTask,
  handleDeleteTask,
  handleDuplicateTask,
  setTaskCreationContext,
  setShowTaskCreationDialog,
  setShowSleepScheduleModal,
  sleepSchedules = []
}: TimetableGridPartProps) {
  
  const TimeCell = ({ day, time }: { day: string; time: string }) => {
    const fixedTime = isTimeInFixedSlot(day, time)
    const freePeriodInfo = isTimeInFreePeriod(day, time)
    const tasksInCell = getTasksForCell(day, time)
    const primaryTask = tasksInCell.find(task => 
      convertTimeToMinutes(task.startTime) === convertTimeToMinutes(time)
    ) || tasksInCell[0]
    
    const isFreePeriod = !!freePeriodInfo
    const isSleepTime = tasksInCell.some(t => t.isSleepTime)
    const sleepTask = tasksInCell.find(t => t.isSleepTime)
    
    return (
      <div
        className={cn(
          "relative border-r border-b border-gray-200 dark:border-gray-700 group transition-all duration-150",
          fixedTime && !isFreePeriod && getTimeSlotColor(fixedTime.type),
          isFreePeriod && "bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30",
          isExtendedTime(time) && !fixedTime && !isSleepTime && "bg-yellow-50/30 dark:bg-yellow-900/10",
          isSleepTime && "bg-gray-100/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700",
          "hover:bg-gray-50 dark:hover:bg-gray-800/50"
        )}
        style={{ 
          height: `${timeSettings.cellHeight}px`,
          minWidth: '120px'
        }}
        onClick={() => handleCellClick(day, time)}
      >
        {/* Extended time indicator */}
        {isExtendedTime(time) && !fixedTime && !primaryTask && !isSleepTime && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-xs text-yellow-600 dark:text-yellow-400 opacity-30">
              Extended
            </div>
          </div>
        )}

        {/* Fixed time label (non-free period) */}
        {fixedTime && !isFreePeriod && !primaryTask && !isSleepTime && (
          <div className="absolute inset-0 flex items-center justify-center p-1 cursor-pointer" onClick={() => handleFixedTimeClick(fixedTime)}>
            <div className="text-xs font-medium text-center truncate px-1 text-gray-700 dark:text-gray-300">
              <div className="flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{fixedTime.title}</span>
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                Fixed Commitment
              </div>
            </div>
          </div>
        )}

        {/* Free period label */}
        {isFreePeriod && !primaryTask && !isSleepTime && (
          <div className="absolute inset-0 flex items-center justify-center p-1 cursor-pointer">
            <div className="text-xs font-medium text-center truncate px-1 text-green-700 dark:text-green-400">
              <div className="flex items-center justify-center gap-1">
                <Coffee className="w-3 h-3" />
                <span>Free Period</span>
              </div>
              <div className="text-[10px] text-green-600 dark:text-green-400 mt-0.5">
                Click to add tasks
              </div>
            </div>
          </div>
        )}

        {/* Sleep time label */}
        {isSleepTime && !primaryTask && sleepTask && (
          <div className="absolute inset-0 flex items-center justify-center p-1">
            <div className="text-xs font-medium text-center truncate px-1 text-gray-700 dark:text-gray-300">
              <div className="flex items-center justify-center gap-1">
                <Moon className="w-3 h-3" />
                <span>Sleep Time</span>
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                {formatTimeDisplay(sleepTask.startTime)} - {formatTimeDisplay(sleepTask.endTime)}
              </div>
            </div>
          </div>
        )}

        {/* Task content */}
        {primaryTask && shouldShowTaskInCell(primaryTask, day, time) && !primaryTask.isSleepTime && (
          <TaskComponent 
            task={primaryTask} 
            day={day}
            time={time}
            taskSpan={getTaskSpan(primaryTask)}
            timeSettings={timeSettings}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onDuplicate={handleDuplicateTask}
            isLocked={isLocked}
            formatTimeDisplay={formatTimeDisplay}
          />
        )}

        {/* Sleep task content */}
        {sleepTask && shouldShowTaskInCell(sleepTask, day, time) && sleepTask.isSleepTime && (
          <SleepTaskComponent 
            task={sleepTask}
            taskSpan={getTaskSpan(sleepTask)}
            timeSettings={timeSettings}
            sleepSchedule={sleepSchedules.find(s => s.id === sleepTask.sleepScheduleId)}
            onEdit={() => setShowSleepScheduleModal(true)}
            formatTimeDisplay={formatTimeDisplay}
          />
        )}

        {/* Multiple tasks indicator */}
        {tasksInCell.length > 1 && !primaryTask && !isSleepTime && (
          <div className="absolute bottom-1 right-1">
            <Badge variant="outline" className="text-xs px-1 py-0 dark:border-gray-600 dark:text-gray-400">
              +{tasksInCell.length - 1}
            </Badge>
          </div>
        )}

        {/* Hover overlay for adding tasks */}
        {!isLocked && !fixedTime && !primaryTask && !isSleepTime && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-gray-50/80 dark:bg-gray-800/80">
            <button
              className="p-1.5 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow"
              onClick={(e) => {
                e.stopPropagation()
                setTaskCreationContext({ day, time })
                setShowTaskCreationDialog(true)
              }}
              title="Add Task"
            >
              <Plus className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        )}

        {/* Hover overlay for adding tasks in free periods */}
        {!isLocked && isFreePeriod && !primaryTask && !isSleepTime && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-green-50/80 dark:bg-green-900/20">
            <button
              className="p-1.5 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow"
              onClick={(e) => {
                e.stopPropagation()
                setTaskCreationContext({ day, time })
                setShowTaskCreationDialog(true)
              }}
              title="Add Task in Free Period"
            >
              <Plus className="w-3 h-3 text-green-600 dark:text-green-400" />
            </button>
          </div>
        )}

        {/* Sleep time overlay - cannot add tasks */}
        {isSleepTime && timeSettings.autoLockSleep && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-gray-800/10 dark:bg-gray-900/30">
            <button
              className="p-1.5 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow"
              onClick={(e) => {
                e.stopPropagation()
                setShowSleepScheduleModal(true)
              }}
              title="Adjust Sleep Schedule"
            >
              <Moon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        )}
      </div>
    )
  }

  const renderTimetableGrid = () => {
    if (timeSettings.displayMode === 'vertical') {
      return (
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header row - Days */}
            <div className="flex border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="w-24 flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" />
              {days.map((day, index) => (
                <div
                  key={day}
                  className={cn(
                    "flex-1 p-4 text-center font-medium border-r border-gray-300 dark:border-gray-700 last:border-r-0",
                    ['Sat', 'Sun'].includes(day) ? "bg-blue-50 dark:bg-blue-900/30" : "bg-white dark:bg-gray-800"
                  )}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className={cn(
                      "font-bold text-lg",
                      ['Sat', 'Sun'].includes(day) && "text-blue-700 dark:text-blue-300"
                    )}>
                      {day}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {['Sat', 'Sun'].includes(day) ? "Weekend" : "Weekday"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Time slots grid */}
            <div className="flex">
              {/* Time column */}
              <div className="w-24 flex-shrink-0 bg-gray-50 dark:bg-gray-900 border-r-2 border-gray-300 dark:border-gray-700">
                {timeSlots.map((time, index) => (
                  <div
                    key={time}
                    className={cn(
                      "flex items-center justify-center relative group border-b border-gray-200 dark:border-gray-700",
                      isExtendedTime(time) && "bg-yellow-50 dark:bg-yellow-900/20"
                    )}
                    style={{ height: `${timeSettings.cellHeight}px` }}
                  >
                    <div className={cn(
                      "text-sm font-semibold px-2 py-1 rounded-lg shadow-sm",
                      isExtendedTime(time) 
                        ? "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100" 
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    )}>
                      <div className="flex items-center gap-1">
                        {formatTimeDisplay(time)}
                        {isExtendedTime(time) && (
                          <Badge className="ml-1 text-xs bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100">
                            Ext
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main grid - Days as columns */}
              <div className="flex-1 flex bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                {days.map(day => (
                  <div key={day} className="flex-1 flex flex-col relative">
                    {timeSlots.map((time, index) => (
                      <TimeCell key={`${day}-${time}`} day={day} time={time} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {/* Header row - Time slots */}
            <div className="flex border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="w-32 flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
                <div className="font-bold text-gray-900 dark:text-gray-100">Day / Time</div>
              </div>
              {timeSlots.map((time, index) => (
                <div
                  key={time}
                  className={cn(
                    "flex-1 p-4 text-center font-medium border-r border-gray-300 dark:border-gray-700 last:border-r-0",
                    isExtendedTime(time) ? "bg-yellow-50 dark:bg-yellow-900/20" : "bg-gray-50 dark:bg-gray-900"
                  )}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1">
                      <span className={cn(
                        "font-bold text-lg",
                        isExtendedTime(time) ? "text-yellow-800 dark:text-yellow-100" : "text-gray-900 dark:text-gray-100"
                      )}>
                        {formatTimeDisplay(time)}
                      </span>
                      {isExtendedTime(time) && (
                        <Badge className="text-xs bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100">
                          Ext
                        </Badge>
                      )}
                    </div>
                    {index < timeSlots.length - 1 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        to {formatTimeDisplay(getNextTimeSlot(time))}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Days as rows */}
            <div className="flex flex-col">
              {days.map((day, dayIndex) => (
                <div key={day} className="flex border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  {/* Day label column */}
                  <div 
                    className="w-32 flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center p-4"
                    style={{ height: `${timeSettings.cellHeight}px` }}
                  >
                    <div className="text-center">
                      <div className={cn(
                        "font-bold text-lg",
                        ['Sat', 'Sun'].includes(day) && "text-blue-700 dark:text-blue-300"
                      )}>
                        {day}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {['Sat', 'Sun'].includes(day) ? "Weekend" : "Weekday"}
                      </div>
                    </div>
                  </div>

                  {/* Time cells for this day */}
                  <div className="flex-1 flex">
                    {timeSlots.map((time, timeIndex) => (
                      <TimeCell key={`${day}-${time}`} day={day} time={time} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <Card className="overflow-hidden border-2 border-gray-200 dark:border-gray-700">
      <CardContent className="p-0">
        {renderTimetableGrid()}
      </CardContent>
    </Card>
  )
}

// Helper function
const convertTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Task Component
const TaskComponent = ({ 
  task, 
  day,
  time,
  taskSpan,
  timeSettings,
  onEdit,
  onDelete,
  onDuplicate,
  isLocked,
  formatTimeDisplay
}: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "absolute top-0.5 left-0.5 right-0.5 rounded-lg border shadow-sm z-30 overflow-hidden cursor-pointer",
        "hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all",
        task.fixedCommitmentId && "border-green-300 dark:border-green-700",
        task.milestoneId && "border-purple-300 dark:border-purple-700"
      )}
      style={{ 
        height: `${timeSettings.cellHeight - 4}px`,
        width: `calc(${taskSpan * 100}% - 4px)`,
        borderLeft: `4px solid ${task.color}`,
        backgroundColor: `${task.color}10`
      }}
      onClick={(e) => {
        e.stopPropagation()
        onEdit(task)
      }}
    >
      <div className="p-2 h-full flex flex-col">
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold truncate dark:text-gray-200">{task.title}</h4>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 truncate">{task.subject}</p>
          </div>
          
          {!isLocked && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <MoreVertical className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 dark:bg-gray-800 dark:border-gray-700">
                <DropdownMenuItem onClick={() => onEdit(task)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(task)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(task.id)}
                  className="text-red-600 focus:text-red-600 dark:text-red-400 dark:hover:bg-gray-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="mt-auto space-y-1">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-[10px] px-1 py-0 dark:border-gray-600 dark:text-gray-400">
              {task.priority}
            </Badge>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">{task.duration}m</span>
          </div>
          
          {taskSpan > 1 && (
            <div className="text-[10px] text-gray-500 dark:text-gray-400 text-center">
              {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Sleep Task Component
const SleepTaskComponent = ({ 
  task, 
  taskSpan,
  timeSettings,
  sleepSchedule,
  onEdit,
  formatTimeDisplay
}: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "absolute top-0.5 left-0.5 right-0.5 rounded-lg border shadow-sm z-30 overflow-hidden cursor-pointer",
        "hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all",
        "bg-gray-100 dark:bg-gray-800"
      )}
      style={{ 
        height: `${timeSettings.cellHeight - 4}px`,
        width: `calc(${taskSpan * 100}% - 4px)`,
        borderLeft: `4px solid ${task.color}`,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onEdit()
      }}
    >
      <div className="p-2 h-full flex flex-col">
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-0.5">
              <Moon className="w-3 h-3" />
              <h4 className="text-xs font-semibold truncate dark:text-gray-200">Sleep</h4>
            </div>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 truncate">
              {sleepSchedule?.notes || 'Rest time'}
            </p>
          </div>
        </div>
        
        <div className="mt-auto space-y-1">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-[10px] px-1 py-0 dark:border-gray-600 dark:text-gray-400">
              {Math.round(task.duration / 60)}h {task.duration % 60}m
            </Badge>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
              {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
















