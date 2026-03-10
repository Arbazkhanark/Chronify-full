// // src/components/features/timetable/goal-tracker.tsx
// 'use client'

// import { motion } from 'framer-motion'
// import { Target, TrendingUp, Clock, Book } from 'lucide-react'
// import { Progress } from '@/components/ui/progress'
// import { Card, CardContent } from '@/components/ui/card'

// interface Goal {
//   id: string
//   title: string
//   description: string
//   totalHours: number
//   completedHours: number
//   subject: string
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
//   deadline?: Date
//   tasks: string[]
// }

// interface GoalTrackerProps {
//   goals: Goal[]
//   scheduledHours: Record<string, number>
// }

// export function GoalTracker({ goals, scheduledHours }: GoalTrackerProps) {
//   const getProgressColor = (progress: number) => {
//     if (progress >= 80) return 'bg-green-500'
//     if (progress >= 50) return 'bg-blue-500'
//     if (progress >= 25) return 'bg-yellow-500'
//     return 'bg-red-500'
//   }

//   const getPriorityColor = (priority: string) => {
//     switch(priority) {
//       case 'CRITICAL': return 'text-red-600 bg-red-50'
//       case 'HIGH': return 'text-orange-600 bg-orange-50'
//       case 'MEDIUM': return 'text-yellow-600 bg-yellow-50'
//       case 'LOW': return 'text-blue-600 bg-blue-50'
//       default: return 'text-gray-600 bg-gray-50'
//     }
//   }

//   return (
//     <Card>
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <Target className="w-5 h-5 text-gray-700" />
//             <h3 className="font-medium text-gray-900">Goals Progress</h3>
//           </div>
//           <div className="text-sm text-gray-600">
//             Total: {goals.length} goals
//           </div>
//         </div>

//         <div className="space-y-6">
//           {goals.map((goal, index) => {
//             const progress = (goal.completedHours / goal.totalHours) * 100
//             const scheduledForSubject = scheduledHours[goal.subject] || 0
//             const hoursRemaining = goal.totalHours - goal.completedHours
            
//             return (
//               <motion.div
//                 key={goal.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className="space-y-3"
//               >
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <div className="flex items-center gap-2 mb-1">
//                       <h4 className="font-medium text-gray-900">{goal.title}</h4>
//                       <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(goal.priority)}`}>
//                         {goal.priority}
//                       </span>
//                     </div>
//                     <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
//                     <div className="flex items-center gap-4 text-sm text-gray-500">
//                       <div className="flex items-center gap-1">
//                         <Book className="w-4 h-4" />
//                         <span>{goal.subject}</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Clock className="w-4 h-4" />
//                         <span>{goal.completedHours.toFixed(1)} / {goal.totalHours}h</span>
//                       </div>
//                       {goal.deadline && (
//                         <div className="flex items-center gap-1">
//                           <TrendingUp className="w-4 h-4" />
//                           <span>Due: {goal.deadline.toLocaleDateString()}</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-2xl font-bold text-gray-900 mb-1">
//                       {progress.toFixed(0)}%
//                     </div>
//                     <div className="text-sm text-gray-600">
//                       {hoursRemaining.toFixed(1)}h remaining
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="space-y-2">
//                   <Progress 
//                     value={progress} 
//                     className={`h-2 ${getProgressColor(progress)}`}
//                   />
//                   <div className="flex justify-between text-xs text-gray-500">
//                     <span>Scheduled: {scheduledForSubject.toFixed(1)}h</span>
//                     <span>Goal: {goal.totalHours}h</span>
//                   </div>
//                 </div>
                
//                 <div className="p-3 bg-blue-50 rounded-lg">
//                   <div className="text-sm text-gray-700">
//                     <span className="font-medium">Tip:</span> Schedule{' '}
//                     <span className="text-blue-600 font-medium">
//                       {hoursRemaining.toFixed(1)} more hours
//                     </span>{' '}
//                     of {goal.subject} in your timetable to reach your goal.
//                   </div>
//                 </div>
//               </motion.div>
//             )
//           })}
          
//           {goals.length === 0 && (
//             <div className="text-center py-8">
//               <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//               <h4 className="font-medium text-gray-700 mb-2">No goals set yet</h4>
//               <p className="text-sm text-gray-500">
//                 Set goals to track your progress and get recommendations
//               </p>
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }