// // src/app/dashboard/timetable/builder/Part5_TaskPoolGoals.tsx
// import { motion } from 'framer-motion'
// import { 
//   Plus, PlusCircle, Target, Bed, ArrowRight, CheckCircle2, Calendar,
//   Moon, AlarmClock, Zap, School, Briefcase, Heart, User, Award,
//   TrendingUp, Users, Music, Clock
// } from 'lucide-react'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// interface Goal {
//   id: string
//   title: string
//   subject: string
//   progress: number
//   completedHours: number
//   totalHours: number
//   color: string
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
//   milestones: Milestone[]
//   tasks: string[]
//   category: string
//   targetDate: Date
// }

// interface Milestone {
//   id: string
//   title: string
//   description: string
//   completed: boolean
//   progress: number
//   scheduledHours: number
//   completedHours: number
//   targetDate: Date
// }

// interface TaskPool {
//   id: string
//   title: string
//   subject: string
//   duration: number
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
//   color: string
// }

// interface TaskPoolGoalsPartProps {
//   goals: Goal[]
//   tasks: any[]
//   isLocked: boolean
//   setShowTaskCreationDialog: (show: boolean) => void
//   setTaskCreationContext: (context: {day: string, time: string} | null) => void
//   setShowTimeExtensionModal: (show: boolean) => void
//   setShowGoalsModal: (show: boolean) => void
//   setShowSleepScheduleModal: (show: boolean) => void
//   getTaskPool: () => TaskPool[]
//   getPriorityColor: (priority: Goal['priority']) => string
//   handleScheduleMilestone: (goal: Goal, milestone: Milestone) => void
// }

// export function TaskPoolGoalsPart({
//   goals,
//   tasks,
//   isLocked,
//   setShowTaskCreationDialog,
//   setTaskCreationContext,
//   setShowTimeExtensionModal,
//   setShowGoalsModal,
//   setShowSleepScheduleModal,
//   getTaskPool,
//   getPriorityColor,
//   handleScheduleMilestone
// }: TaskPoolGoalsPartProps) {
//   return (
//     <Card className="dark:bg-gray-800 dark:border-gray-700">
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h3 className="font-medium text-gray-900 dark:text-gray-200 mb-1">Task Pool & Goals</h3>
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               Drag tasks or goals to schedule them in your timetable
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button 
//               onClick={() => {
//                 setShowTaskCreationDialog(true)
//                 setTaskCreationContext({ day: 'Mon', time: '09:00' })
//               }}
//               className="gap-2"
//             >
//               <Plus className="w-4 h-4" />
//               Add Task
//             </Button>
//             <Button 
//               variant="outline"
//               onClick={() => setShowTimeExtensionModal(true)}
//               className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//             >
//               <PlusCircle className="w-4 h-4" />
//               Add Time Slots
//             </Button>
//             <Button 
//               variant="outline"
//               onClick={() => setShowGoalsModal(true)}
//               className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//             >
//               <Target className="w-4 h-4" />
//               Schedule Goals
//             </Button>
//             <Button 
//               variant="outline"
//               onClick={() => setShowSleepScheduleModal(true)}
//               className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//             >
//               <Bed className="w-4 h-4" />
//               Sleep
//             </Button>
//           </div>
//         </div>

//         <Tabs defaultValue="goals" className="mb-6">
//           <TabsList className="dark:bg-gray-800 dark:border-gray-700">
//             <TabsTrigger value="goals" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
//               Goals & Milestones
//             </TabsTrigger>
//             <TabsTrigger value="tasks" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
//               Quick Tasks
//             </TabsTrigger>
//             <TabsTrigger value="sleep" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
//               Sleep Tips
//             </TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="goals" className="mt-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//               {goals.map(goal => (
//                 <div key={goal.id} className="space-y-2">
//                   {/* Goal Card */}
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-move hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-sm transition-all"
//                     draggable={!isLocked}
//                     onDragStart={(e) => {
//                       e.dataTransfer.setData('text/plain', goal.id)
//                       e.dataTransfer.setData('type', 'goal')
//                       e.dataTransfer.effectAllowed = 'move'
//                     }}
//                   >
//                     <div className="flex items-start justify-between mb-2">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 mb-1">
//                           <div 
//                             className="w-2 h-2 rounded-full"
//                             style={{ backgroundColor: goal.color }}
//                           />
//                           <h4 className="font-medium text-sm dark:text-gray-200">{goal.title}</h4>
//                         </div>
//                         <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
//                           Progress: {goal.progress}% • {goal.completedHours.toFixed(1)}/{goal.totalHours}h
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <Badge className={getPriorityColor(goal.priority)}>
//                             {goal.priority}
//                           </Badge>
//                           <span className="text-xs text-gray-500 dark:text-gray-400">
//                             {goal.milestones.length} milestones
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
                  
//                   {/* Milestones */}
//                   <div className="space-y-1 ml-4">
//                     {goal.milestones.map(milestone => (
//                       <motion.div
//                         key={milestone.id}
//                         initial={{ opacity: 0, x: -10 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 cursor-move hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-sm transition-all"
//                         draggable={!isLocked}
//                         onDragStart={(e) => {
//                           e.dataTransfer.setData('text/plain', milestone.id)
//                           e.dataTransfer.setData('goalId', goal.id)
//                           e.dataTransfer.setData('type', 'milestone')
//                           e.dataTransfer.effectAllowed = 'move'
//                         }}
//                       >
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-2">
//                             <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
//                             <span className="text-xs font-medium dark:text-gray-300 truncate flex-1">
//                               {milestone.title}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <span className="text-xs text-gray-500 dark:text-gray-400">
//                               {milestone.progress}%
//                             </span>
//                             <button
//                               onClick={() => handleScheduleMilestone(goal, milestone)}
//                               className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
//                               title="Schedule this milestone"
//                             >
//                               <ArrowRight className="w-3 h-3 text-gray-500 dark:text-gray-400" />
//                             </button>
//                           </div>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </TabsContent>
          
//           <TabsContent value="tasks" className="mt-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//               {getTaskPool().map((task, index) => (
//                 <motion.div
//                   key={task.id}
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: index * 0.1 }}
//                   className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-move hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-sm transition-all"
//                   draggable={!isLocked}
//                   onDragStart={(e) => {
//                     e.dataTransfer.setData('text/plain', task.id)
//                     e.dataTransfer.setData('duration', task.duration.toString())
//                     e.dataTransfer.effectAllowed = 'move'
//                   }}
//                 >
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="font-medium text-sm dark:text-gray-200">{task.title}</div>
//                     <div 
//                       className="w-3 h-3 rounded-full"
//                       style={{ backgroundColor: task.color }}
//                     />
//                   </div>
//                   <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
//                     <span>{task.subject}</span>
//                     <span>{task.duration} minutes</span>
//                   </div>
//                   <div className="mt-2">
//                     <Badge 
//                       className={
//                         task.priority === 'CRITICAL' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
//                         task.priority === 'HIGH' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
//                         task.priority === 'MEDIUM' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
//                         'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
//                       }
//                     >
//                       {task.priority}
//                     </Badge>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </TabsContent>
          
//           <TabsContent value="sleep" className="mt-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//               <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
//                 <div className="flex items-center gap-3 mb-2">
//                   <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
//                     <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                   </div>
//                   <div>
//                     <h4 className="font-medium dark:text-gray-200">7-9 Hours</h4>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">Recommended for adults</p>
//                   </div>
//                 </div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                   Most adults need 7-9 hours of sleep per night for optimal health and cognitive function.
//                 </p>
//               </div>
              
//               <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
//                 <div className="flex items-center gap-3 mb-2">
//                   <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
//                     <AlarmClock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
//                   </div>
//                   <div>
//                     <h4 className="font-medium dark:text-gray-200">Consistent Schedule</h4>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">Even on weekends</p>
//                   </div>
//                 </div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                   Going to bed and waking up at the same time helps regulate your body's internal clock.
//                 </p>
//               </div>
              
//               <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
//                 <div className="flex items-center gap-3 mb-2">
//                   <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
//                     <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
//                   </div>
//                   <div>
//                     <h4 className="font-medium dark:text-gray-200">Power Naps</h4>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">15-20 minutes</p>
//                   </div>
//                 </div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                   Short naps can boost alertness and performance without interfering with nighttime sleep.
//                 </p>
//               </div>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </CardContent>
//     </Card>
//   )
// }
























// src/components/features/timetable/builder/Part5_TaskPoolGoals.tsx
import { motion } from 'framer-motion'
import { 
  Plus, PlusCircle, Target, Bed, ArrowRight, CheckCircle2, Calendar,
  Moon, AlarmClock, Zap, School, Briefcase, Heart, User, Award,
  TrendingUp, Users, Music, Clock, CheckCircle
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

interface Goal {
  id: string
  title: string
  subject: string
  progress: number
  completedHours: number
  totalHours: number
  color: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  milestones: Milestone[]
  tasks: string[]
  category: string
  targetDate: Date
}

interface Milestone {
  id: string
  title: string
  description: string
  completed: boolean
  progress: number
  scheduledHours: number
  completedHours: number
  targetDate: Date
}

interface TaskPool {
  id: string
  title: string
  subject: string
  duration: number
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  color: string
}

interface TaskPoolGoalsPartProps {
  goals: Goal[]
  tasks: any[]
  isLocked: boolean
  setShowTaskCreationDialog: (show: boolean) => void
  setTaskCreationContext: (context: {day: string, time: string} | null) => void
  setShowTimeExtensionModal: (show: boolean) => void
  setShowGoalsModal: (show: boolean) => void
  setShowSleepScheduleModal: (show: boolean) => void
  getTaskPool: () => TaskPool[]
  getPriorityColor: (priority: Goal['priority']) => string
  handleScheduleMilestone: (goal: Goal, milestone: Milestone) => void
  onMarkTaskComplete?: (taskId: string) => void
}

export function TaskPoolGoalsPart({
  goals,
  tasks,
  isLocked,
  setShowTaskCreationDialog,
  setTaskCreationContext,
  setShowTimeExtensionModal,
  setShowGoalsModal,
  setShowSleepScheduleModal,
  getTaskPool,
  getPriorityColor,
  handleScheduleMilestone,
  onMarkTaskComplete
}: TaskPoolGoalsPartProps) {
  const handleDragStart = (e: React.DragEvent, type: string, data: any) => {
    if (isLocked) {
      e.preventDefault()
      toast.error('Timetable is locked', {
        description: 'Unlock the timetable to drag and drop tasks.'
      })
      return
    }

    if (type === 'task') {
      e.dataTransfer.setData('text/plain', data.id)
      e.dataTransfer.setData('duration', data.duration.toString())
      e.dataTransfer.setData('type', 'pool-task')
      e.dataTransfer.effectAllowed = 'move'
    } else if (type === 'goal') {
      e.dataTransfer.setData('text/plain', data.id)
      e.dataTransfer.setData('type', 'goal')
      e.dataTransfer.effectAllowed = 'move'
    } else if (type === 'milestone') {
      e.dataTransfer.setData('text/plain', data.milestoneId)
      e.dataTransfer.setData('goalId', data.goalId)
      e.dataTransfer.setData('type', 'milestone')
      e.dataTransfer.effectAllowed = 'move'
    }
  }

  const handleQuickSchedule = (task: TaskPool) => {
    setTaskCreationContext({ day: 'Mon', time: '09:00' })
    setShowTaskCreationDialog(true)
  }

  console.log('Rendering TaskPoolGoalsPart with goals:', goals, 'and tasks:', getTaskPool())
  console.log(tasks, 'tasks from props')

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-200 mb-1">Task Pool & Goals</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Drag tasks or goals to schedule them in your timetable
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => {
                setShowTaskCreationDialog(true)
                setTaskCreationContext({ day: 'Mon', time: '09:00' })
              }}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowTimeExtensionModal(true)}
              className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <PlusCircle className="w-4 h-4" />
              Add Time Slots
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowGoalsModal(true)}
              className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Target className="w-4 h-4" />
              Schedule Goals
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowSleepScheduleModal(true)}
              className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Bed className="w-4 h-4" />
              Sleep
            </Button>
          </div>
        </div>

        <Tabs defaultValue="goals" className="mb-6">
          <TabsList className="dark:bg-gray-800 dark:border-gray-700">
            <TabsTrigger value="goals" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
              Goals & Milestones
            </TabsTrigger>
            <TabsTrigger value="tasks" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
              Quick Tasks
            </TabsTrigger>
            <TabsTrigger value="sleep" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
              Sleep Tips
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="goals" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {goals.map(goal => (
                <div key={goal.id} className="space-y-2">
                  {/* Goal Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-move hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-sm transition-all"
                    draggable={!isLocked}
                    onDragStart={(e) => handleDragStart(e, 'goal', goal)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: goal.color }}
                          />
                          <h4 className="font-medium text-sm dark:text-gray-200">{goal.title}</h4>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          Progress: {goal.progress}% • {goal.completedHours.toFixed(1)}/{goal.totalHours}h
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className={getPriorityColor(goal.priority)}>
                            {goal.priority}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {goal.milestones.length} milestones
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Milestones */}
                  <div className="space-y-1 ml-4">
                    {goal.milestones.map(milestone => (
                      <motion.div
                        key={milestone.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 cursor-move hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-sm transition-all"
                        draggable={!isLocked && !milestone.completed}
                        onDragStart={(e) => handleDragStart(e, 'milestone', { milestoneId: milestone.id, goalId: goal.id })}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                            <span className="text-xs font-medium dark:text-gray-300 truncate flex-1">
                              {milestone.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {milestone.progress}%
                            </span>
                            <button
                              onClick={() => handleScheduleMilestone(goal, milestone)}
                              className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                              title="Schedule this milestone"
                            >
                              <ArrowRight className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {getTaskPool().map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-sm transition-all"
                  draggable={!isLocked}
                  onDragStart={(e) => handleDragStart(e, 'task', task)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium text-sm dark:text-gray-200">{task.title}</div>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: task.color }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                    <span>{task.subject}</span>
                    <span>{task.duration} minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge 
                      className={
                        task.priority === 'CRITICAL' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        task.priority === 'HIGH' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                        task.priority === 'MEDIUM' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      }
                    >
                      {task.priority}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-xs"
                      onClick={() => handleQuickSchedule(task)}
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="sleep" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium dark:text-gray-200">7-9 Hours</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Recommended for adults</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Most adults need 7-9 hours of sleep per night for optimal health and cognitive function.
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <AlarmClock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium dark:text-gray-200">Consistent Schedule</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Even on weekends</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Going to bed and waking up at the same time helps regulate your body's internal clock.
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium dark:text-gray-200">Power Naps</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">15-20 minutes</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Short naps can boost alertness and performance without interfering with nighttime sleep.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Completed Tasks Summary */}
        {tasks.filter(t => t.isCompleted).length > 0 && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {tasks.filter(t => t.isCompleted).length} tasks completed today
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}