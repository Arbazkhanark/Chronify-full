// // src/components/dashboard/weekly-schedule.tsx
// 'use client'

// import { motion } from 'framer-motion'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Calendar, Clock, CheckCircle } from 'lucide-react'
// import { cn } from '@/lib/utils'

// export function WeeklySchedule() {
//   const schedule = [
//     {
//       day: 'Today',
//       date: 'Dec 12',
//       tasks: [
//         { time: '9:00 AM', title: 'DSA Practice', duration: '2h', completed: true },
//         { time: '2:00 PM', title: 'Web Development', duration: '1.5h', completed: false },
//         { time: '7:00 PM', title: 'ML Course', duration: '1h', completed: false },
//       ],
//     },
//     {
//       day: 'Tomorrow',
//       date: 'Dec 13',
//       tasks: [
//         { time: '10:00 AM', title: 'Project Work', duration: '3h', completed: false },
//         { time: '3:00 PM', title: 'DSA Revision', duration: '2h', completed: false },
//       ],
//     },
//     {
//       day: 'Fri',
//       date: 'Dec 14',
//       tasks: [
//         { time: '11:00 AM', title: 'Assignment', duration: '2h', completed: false },
//         { time: '4:00 PM', title: 'Practice Problems', duration: '1.5h', completed: false },
//       ],
//     },
//   ]

//   return (
//     <Card className="border-border/50">
//       <CardHeader>
//         <div className="flex items-center gap-3">
//           <div className="p-2 rounded-lg bg-primary/10">
//             <Calendar className="w-5 h-5 text-primary" />
//           </div>
//           <div>
//             <CardTitle>Weekly Schedule</CardTitle>
//             <p className="text-sm text-muted-foreground mt-1">
//               Your upcoming study sessions
//             </p>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-6">
//           {schedule.map((day, dayIndex) => (
//             <motion.div
//               key={day.day}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: dayIndex * 0.1 }}
//             >
//               <div className="mb-4">
//                 <h3 className="font-semibold text-lg mb-2">
//                   {day.day} <span className="text-muted-foreground">• {day.date}</span>
//                 </h3>
//                 <div className="space-y-3">
//                   {day.tasks.map((task, taskIndex) => (
//                     <motion.div
//                       key={`${day.day}-${taskIndex}`}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: (dayIndex * 0.1) + (taskIndex * 0.05) }}
//                       className={cn(
//                         "p-4 rounded-xl border transition-all duration-300",
//                         task.completed
//                           ? "border-green-500/20 bg-green-500/5"
//                           : "border-border hover:border-primary/30 hover:bg-primary/5"
//                       )}
//                     >
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                           <div className={cn(
//                             "w-8 h-8 rounded-full flex items-center justify-center",
//                             task.completed 
//                               ? "bg-green-500/20" 
//                               : "bg-primary/10"
//                           )}>
//                             {task.completed ? (
//                               <CheckCircle className="w-4 h-4 text-green-500" />
//                             ) : (
//                               <Clock className="w-4 h-4 text-primary" />
//                             )}
//                           </div>
//                           <div>
//                             <div className={cn(
//                               "font-medium",
//                               task.completed && "line-through text-muted-foreground"
//                             )}>
//                               {task.title}
//                             </div>
//                             <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
//                               <span>{task.time}</span>
//                               <span>•</span>
//                               <span>{task.duration}</span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className={cn(
//                           "px-3 py-1 rounded-full text-xs font-medium",
//                           task.completed
//                             ? "bg-green-500/20 text-green-500"
//                             : "bg-secondary text-muted-foreground"
//                         )}>
//                           {task.completed ? 'Completed' : 'Upcoming'}
//                         </div>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </div>
//               {dayIndex < schedule.length - 1 && (
//                 <div className="h-px bg-border my-6" />
//               )}
//             </motion.div>
//           ))}
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="font-medium">Need to reschedule?</div>
//               <div className="text-sm text-muted-foreground">
//                 You can adjust your timetable anytime
//               </div>
//             </div>
//             <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
//               Edit Schedule
//             </button>
//           </div>
//         </motion.div>
//       </CardContent>
//     </Card>
//   )
// }

















// src/components/dashboard/schedule-view.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, CheckCircle, ChevronRight, BarChart3, Grid3x3, List } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ScheduleView() {
  const [view, setView] = useState<'today' | 'weekly'>('today')
  const [viewType, setViewType] = useState<'list' | 'grid' | 'graph'>('list')

  // Today's schedule data
  const todaySchedule = {
    date: 'Dec 12, 2024',
    day: 'Thursday',
    totalHours: 6.5,
    completedHours: 4.5,
    tasks: [
      { id: 1, time: '6:30 AM', title: 'Wake Up & Plan Day', duration: '30m', completed: true, category: 'morning', priority: 'routine' },
      { id: 2, time: '7:10 AM', title: 'Bus: DSA Audio Learning', duration: '2h', completed: true, category: 'commute', priority: 'high' },
      { id: 3, time: '9:30 AM', title: 'College Classes', duration: '3h', completed: false, category: 'college', priority: 'medium' },
      { id: 4, time: '1:00 PM', title: 'Free Period: DSA Problems', duration: '1h', completed: false, category: 'study', priority: 'high' },
      { id: 5, time: '2:00 PM', title: 'College Classes', duration: '2h', completed: false, category: 'college', priority: 'medium' },
      { id: 6, time: '4:30 PM', title: 'Break & Snack', duration: '30m', completed: false, category: 'break', priority: 'low' },
      { id: 7, time: '5:10 PM', title: 'Bus: DSA Revision', duration: '2h', completed: false, category: 'commute', priority: 'high' },
      { id: 8, time: '7:30 PM', title: 'Dinner & Break', duration: '1h', completed: false, category: 'break', priority: 'routine' },
      { id: 9, time: '8:30 PM', title: 'Project Work', duration: '1.5h', completed: false, category: 'project', priority: 'medium' },
      { id: 10, time: '10:00 PM', title: 'DSA Deep Practice', duration: '1h', completed: false, category: 'study', priority: 'high' },
    ],
  }

  // Weekly schedule data
  const weeklySchedule = [
    {
      day: 'Monday',
      date: 'Dec 9',
      tasks: [
        { time: '9:30 AM', title: 'College Classes', duration: '3h', completed: true },
        { time: '2:00 PM', title: 'DSA Practice', duration: '2h', completed: true },
        { time: '7:00 PM', title: 'Project Work', duration: '2h', completed: false },
      ],
      totalHours: 7,
      completedHours: 5,
    },
    {
      day: 'Tuesday',
      date: 'Dec 10',
      tasks: [
        { time: '9:30 AM', title: 'College Classes', duration: '3h', completed: true },
        { time: '2:00 PM', title: 'Web Development', duration: '2h', completed: true },
        { time: '7:00 PM', title: 'ML Course', duration: '1h', completed: true },
      ],
      totalHours: 6,
      completedHours: 6,
    },
    {
      day: 'Wednesday',
      date: 'Dec 11',
      tasks: [
        { time: '9:30 AM', title: 'College Classes', duration: '3h', completed: true },
        { time: '2:00 PM', title: 'DSA Revision', duration: '2h', completed: false },
        { time: '7:00 PM', title: 'Assignment', duration: '2h', completed: false },
      ],
      totalHours: 7,
      completedHours: 3,
    },
    {
      day: 'Thursday',
      date: 'Dec 12',
      tasks: [
        { time: '9:30 AM', title: 'College Classes', duration: '3h', completed: false },
        { time: '2:00 PM', title: 'Free Period: Study', duration: '1h', completed: false },
        { time: '7:00 PM', title: 'Project Work', duration: '1.5h', completed: false },
      ],
      totalHours: 5.5,
      completedHours: 0,
    },
    {
      day: 'Friday',
      date: 'Dec 13',
      tasks: [
        { time: '9:30 AM', title: 'College Classes', duration: '3h', completed: false },
        { time: '2:00 PM', title: 'Practice Problems', duration: '2h', completed: false },
        { time: '7:00 PM', title: 'DSA Practice', duration: '1.5h', completed: false },
      ],
      totalHours: 6.5,
      completedHours: 0,
    },
    {
      day: 'Saturday',
      date: 'Dec 14',
      tasks: [
        { time: '9:00 AM', title: 'DSA Deep Dive', duration: '4h', completed: false },
        { time: '2:00 PM', title: 'Project Work', duration: '3h', completed: false },
        { time: '7:00 PM', title: 'Revision', duration: '2h', completed: false },
      ],
      totalHours: 9,
      completedHours: 0,
    },
    {
      day: 'Sunday',
      date: 'Dec 15',
      tasks: [
        { time: '9:00 AM', title: 'Mock Tests', duration: '4h', completed: false },
        { time: '2:00 PM', title: 'College Studies', duration: '3h', completed: false },
        { time: '7:00 PM', title: 'AI/ML Learning', duration: '2h', completed: false },
      ],
      totalHours: 9,
      completedHours: 0,
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'morning': return 'bg-blue-500/20 text-blue-500'
      case 'commute': return 'bg-purple-500/20 text-purple-500'
      case 'college': return 'bg-green-500/20 text-green-500'
      case 'study': return 'bg-orange-500/20 text-orange-500'
      case 'project': return 'bg-pink-500/20 text-pink-500'
      case 'break': return 'bg-gray-500/20 text-gray-500'
      default: return 'bg-primary/20 text-primary'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-500'
      case 'medium': return 'bg-yellow-500/20 text-yellow-500'
      case 'low': return 'bg-blue-500/20 text-blue-500'
      default: return 'bg-gray-500/20 text-gray-500'
    }
  }

  const calculateProgress = () => {
    const completedTasks = todaySchedule.tasks.filter(t => t.completed).length
    const totalTasks = todaySchedule.tasks.length
    return Math.round((completedTasks / totalTasks) * 100)
  }

  const renderTodaySchedule = () => (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-bold">Today's Schedule</h3>
          <p className="text-muted-foreground">
            {todaySchedule.day}, {todaySchedule.date}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {todaySchedule.tasks.filter(t => t.completed).length}/{todaySchedule.tasks.length}
            </div>
            <div className="text-sm text-muted-foreground">Tasks Done</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {todaySchedule.completedHours}h/{todaySchedule.totalHours}h
            </div>
            <div className="text-sm text-muted-foreground">Hours</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span>Daily Progress</span>
          <span className="font-medium">{calculateProgress()}%</span>
        </div>
        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${calculateProgress()}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
          />
        </div>
      </div>

      {/* Schedule Timeline */}
      <div className="space-y-4">
        {todaySchedule.tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 group",
              task.completed
                ? "border-green-500/20 bg-green-500/5"
                : "border-border hover:border-primary/30 hover:bg-primary/5"
            )}
          >
            {/* Time and status */}
            <div className="flex flex-col items-center min-w-20">
              <div className="font-medium text-sm mb-1">{task.time}</div>
              <div className="text-xs text-muted-foreground">{task.duration}</div>
              <div className="mt-2">
                <button
                  onClick={() => {/* Handle complete */}}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    task.completed
                      ? "border-green-500 bg-green-500"
                      : "border-muted-foreground/30 hover:border-primary"
                  )}
                >
                  {task.completed && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Task details */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className={cn(
                      "font-medium",
                      task.completed && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                      {task.category}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{task.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{task.time}</span>
                    </div>
                  </div>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  task.completed
                    ? "bg-green-500/20 text-green-500"
                    : "bg-secondary text-muted-foreground"
                )}>
                  {task.completed ? 'Completed' : 'Pending'}
                </div>
              </div>
            </div>

            {/* Expand arrow */}
            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-secondary rounded-lg">
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderWeeklySchedule = () => (
    <div className="space-y-6">
      {/* Weekly stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Hours', value: '46h', color: 'text-blue-500' },
          { label: 'Completed', value: '14h', color: 'text-green-500' },
          { label: 'Remaining', value: '32h', color: 'text-orange-500' },
          { label: 'Completion', value: '30%', color: 'text-purple-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center p-4 rounded-xl bg-secondary/30"
          >
            <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">Weekly Hours Distribution</h4>
          <div className="text-sm text-muted-foreground">
            Total: <span className="font-bold">46 hours</span>
          </div>
        </div>
        <div className="flex items-end h-32 gap-2">
          {weeklySchedule.map((day, index) => (
            <div key={day.day} className="flex-1 flex flex-col items-center">
              <div className="relative group w-full">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.totalHours / 9) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary/60 to-primary/20 hover:from-primary hover:to-primary/40 transition-all duration-300 cursor-pointer"
                >
                  {/* Completed hours overlay */}
                  {day.completedHours > 0 && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.completedHours / day.totalHours) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-green-500/80 to-green-500/20"
                    />
                  )}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-card border border-border rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                    <div className="font-medium">{day.totalHours}h total</div>
                    <div className="text-muted-foreground">{day.completedHours}h completed</div>
                  </div>
                </motion.div>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">{day.day.slice(0, 3)}</div>
              <div className="text-xs text-muted-foreground">{day.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly day-by-day */}
      <div className="space-y-4">
        {weeklySchedule.map((day, dayIndex) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIndex * 0.1 }}
            className="p-4 rounded-xl border border-border hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium">{day.day}</h4>
                <p className="text-sm text-muted-foreground">{day.date}</p>
              </div>
              <div className="text-right">
                <div className="font-bold">{day.completedHours}/{day.totalHours}h</div>
                <div className="text-xs text-muted-foreground">
                  {Math.round((day.completedHours / day.totalHours) * 100)}% done
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {day.tasks.map((task, taskIndex) => (
                <div
                  key={`${day.day}-${taskIndex}`}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/30"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      task.completed ? "bg-green-500" : "bg-muted-foreground"
                    )} />
                    <span className={cn(
                      "text-sm",
                      task.completed && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">{task.time}</div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderGraphView = () => (
    <div className="space-y-6">
      {/* Productivity Graph */}
      <div className="mb-8">
        <h4 className="font-medium mb-4">Daily Productivity</h4>
        <div className="h-48 flex items-end gap-1">
          {Array.from({ length: 12 }).map((_, hour) => {
            const hourData = todaySchedule.tasks.filter(task => {
              const taskHour = parseInt(task.time.split(':')[0])
              const isAM = task.time.includes('AM')
              const adjustedHour = isAM ? taskHour : taskHour + 12
              return adjustedHour >= 6 && adjustedHour <= 22 && Math.abs(adjustedHour - (hour + 6)) <= 1
            })
            
            const productivity = Math.min(100, hourData.length * 30 + Math.random() * 20)
            
            return (
              <div key={hour} className="flex-1 flex flex-col items-center">
                <div className="relative group w-full">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${productivity}%` }}
                    transition={{ duration: 1, delay: hour * 0.05 }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary/60 to-primary/20"
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-card border border-border rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                      <div className="font-medium">{hour + 6}:00 - {hour + 7}:00</div>
                      <div className="text-muted-foreground">{Math.round(productivity)}% productivity</div>
                    </div>
                  </motion.div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {hour + 6}:00
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { category: 'Study', hours: '4.5h', color: 'from-orange-500 to-red-500', percent: 35 },
          { category: 'College', hours: '5h', color: 'from-green-500 to-emerald-500', percent: 40 },
          { category: 'Project', hours: '1.5h', color: 'from-pink-500 to-purple-500', percent: 12 },
          { category: 'Break', hours: '1.5h', color: 'from-gray-500 to-slate-500', percent: 12 },
        ].map((item, index) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-medium">{item.category}</div>
                <div className="text-sm text-muted-foreground">{item.hours}</div>
              </div>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                <span className="text-white text-sm">{item.percent}%</span>
              </div>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percent}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Schedule & Progress</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track your daily and weekly progress
              </p>
            </div>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-2">
            {/* Day/Week Toggle */}
            <div className="flex bg-secondary rounded-lg p-1">
              <button
                onClick={() => setView('today')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  view === 'today'
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Today
              </button>
              <button
                onClick={() => setView('weekly')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  view === 'weekly'
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Weekly
              </button>
            </div>

            {/* View Type Toggle */}
            <div className="flex bg-secondary rounded-lg p-1">
              <button
                onClick={() => setViewType('list')}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  viewType === 'list'
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewType('grid')}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  viewType === 'grid'
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Grid View"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewType('graph')}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  viewType === 'graph'
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Graph View"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {view === 'today' ? renderTodaySchedule() : renderWeeklySchedule()}
        
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {todaySchedule.tasks.filter(t => t.completed).length}
              </div>
              <div className="text-sm text-muted-foreground">Completed Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {todaySchedule.completedHours}h
              </div>
              <div className="text-sm text-muted-foreground">Focus Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                {calculateProgress()}%
              </div>
              <div className="text-sm text-muted-foreground">Daily Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {todaySchedule.tasks.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
            Mark Today Complete
          </button>
          <button className="flex-1 px-4 py-2 rounded-lg border border-input hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium">
            Adjust Schedule
          </button>
          <button className="px-4 py-2 rounded-lg border border-input hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium">
            Export
          </button>
        </div>
      </CardContent>
    </Card>
  )
}