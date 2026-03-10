// // src/components/features/timetable/generated-timetable.tsx
// 'use client'

// import { useState } from 'react'
// import { motion } from 'framer-motion'
// import { 
//   Calendar, 
//   Clock, 
//   CheckCircle,
//   AlertCircle,
//   TrendingUp,
//   BarChart3,
//   Download,
//   Edit2,
//   ThumbsUp,
//   ThumbsDown,
//   Share2,
//   Lock,
//   Unlock
// } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { cn } from '@/lib/utils'

// interface GeneratedTimetableProps {
//   timetable: any
//   onEdit: () => void
//   onRegenerate: () => void
// }

// export function GeneratedTimetable({ timetable, onEdit, onRegenerate }: GeneratedTimetableProps) {
//   const [selectedDay, setSelectedDay] = useState<number>(1) // Monday
//   const [isLocked, setIsLocked] = useState(false)

//   const days = [
//     { id: 1, name: 'Monday', short: 'Mon' },
//     { id: 2, name: 'Tuesday', short: 'Tue' },
//     { id: 3, name: 'Wednesday', short: 'Wed' },
//     { id: 4, name: 'Thursday', short: 'Thu' },
//     { id: 5, name: 'Friday', short: 'Fri' },
//     { id: 6, name: 'Saturday', short: 'Sat' },
//     { id: 0, name: 'Sunday', short: 'Sun' },
//   ]

//   const daySlots = timetable.slots.filter((slot: any) => slot.dayOfWeek === selectedDay)

//   const getSlotColor = (subject: string) => {
//     const colors: Record<string, string> = {
//       'DSA': 'bg-purple-500',
//       'AI/ML': 'bg-blue-500',
//       'Web Dev': 'bg-green-500',
//       'College': 'bg-red-500',
//       'Projects': 'bg-orange-500',
//       'Break': 'bg-gray-500',
//       'Exercise': 'bg-pink-500',
//       'Revision': 'bg-yellow-500',
//     }
//     return colors[subject] || 'bg-primary'
//   }

//   const formatTime = (time: string) => {
//     const [hour, minute] = time.split(':')
//     const hourNum = parseInt(hour)
//     const period = hourNum >= 12 ? 'PM' : 'AM'
//     const displayHour = hourNum % 12 || 12
//     return `${displayHour}:${minute} ${period}`
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
//         <div>
//           <h3 className="text-xl font-bold mb-2">Your AI-Generated Timetable</h3>
//           <div className="flex items-center gap-2 text-sm text-muted-foreground">
//             <Calendar className="w-4 h-4" />
//             <span>Generated {timetable.generatedAt.toLocaleDateString()}</span>
//             <span>•</span>
//             <Clock className="w-4 h-4" />
//             <span>{timetable.slots.length} time slots</span>
//           </div>
//         </div>
        
//         <div className="flex items-center gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={onEdit}
//             className="gap-2"
//           >
//             <Edit2 className="w-4 h-4" />
//             Edit Inputs
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={onRegenerate}
//             className="gap-2"
//           >
//             <TrendingUp className="w-4 h-4" />
//             Regenerate
//           </Button>
//           <Button
//             size="sm"
//             onClick={() => setIsLocked(!isLocked)}
//             className="gap-2"
//           >
//             {isLocked ? (
//               <>
//                 <Unlock className="w-4 h-4" />
//                 Unlock
//               </>
//             ) : (
//               <>
//                 <Lock className="w-4 h-4" />
//                 Lock & Use
//               </>
//             )}
//           </Button>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {[
//           { 
//             label: 'Total Study Hours', 
//             value: `${timetable.summary.totalStudyHours}h`, 
//             icon: Clock,
//             color: 'text-blue-500'
//           },
//           { 
//             label: 'Completion Timeline', 
//             value: timetable.summary.completionTimeline, 
//             icon: Calendar,
//             color: 'text-green-500'
//           },
//           { 
//             label: 'Efficiency Score', 
//             value: '92%', 
//             icon: TrendingUp,
//             color: 'text-purple-500'
//           },
//           { 
//             label: 'Focus Sessions', 
//             value: daySlots.length, 
//             icon: BarChart3,
//             color: 'text-orange-500'
//           },
//         ].map((stat, index) => (
//           <motion.div
//             key={stat.label}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//             className="bg-card border border-border rounded-xl p-4"
//           >
//             <div className="flex items-center gap-3">
//               <div className={`p-2 rounded-lg ${stat.color.replace('text', 'bg')}/10`}>
//                 <stat.icon className={`w-5 h-5 ${stat.color}`} />
//               </div>
//               <div>
//                 <div className="text-2xl font-bold">{stat.value}</div>
//                 <div className="text-sm text-muted-foreground">{stat.label}</div>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Day Selector */}
//       <div className="flex gap-2 overflow-x-auto pb-2">
//         {days.map(day => (
//           <button
//             key={day.id}
//             onClick={() => setSelectedDay(day.id)}
//             className={cn(
//               "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all min-w-[100px]",
//               selectedDay === day.id
//                 ? "bg-primary text-primary-foreground"
//                 : "bg-secondary text-muted-foreground hover:bg-secondary/80"
//             )}
//           >
//             {day.name}
//           </button>
//         ))}
//       </div>

//       {/* Timetable View */}
//       <div className="bg-card border border-border rounded-xl overflow-hidden">
//         <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="p-2 rounded-lg bg-primary/10">
//                 <Calendar className="w-5 h-5 text-primary" />
//               </div>
//               <div>
//                 <h4 className="font-bold">
//                   {days.find(d => d.id === selectedDay)?.name}'s Schedule
//                 </h4>
//                 <p className="text-sm text-muted-foreground">
//                   {daySlots.length} study sessions planned
//                 </p>
//               </div>
//             </div>
//             <div className="text-sm text-muted-foreground">
//               Total: {daySlots.reduce((sum: number, slot: any) => sum + slot.duration, 0) / 60}h
//             </div>
//           </div>
//         </div>

//         <div className="divide-y divide-border">
//           {daySlots.length > 0 ? (
//             daySlots.map((slot: any, index: number) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: index * 0.05 }}
//                 className={cn(
//                   "p-4 flex items-start gap-4",
//                   slot.isBreak && "bg-gray-500/5"
//                 )}
//               >
//                 {/* Time */}
//                 <div className="w-24 flex-shrink-0">
//                   <div className="font-medium">{formatTime(slot.startTime)}</div>
//                   <div className="text-sm text-muted-foreground">
//                     {slot.duration} min
//                   </div>
//                 </div>

//                 {/* Separator */}
//                 <div className="relative flex flex-col items-center">
//                   <div className={`w-3 h-3 rounded-full ${getSlotColor(slot.subject)}`} />
//                   <div className="w-0.5 h-full bg-border absolute top-4" />
//                 </div>

//                 {/* Content */}
//                 <div className="flex-1">
//                   <div className="flex items-start justify-between mb-2">
//                     <div>
//                       <h5 className="font-medium">{slot.title}</h5>
//                       <div className="flex items-center gap-2 mt-1">
//                         <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
//                           slot.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-500' :
//                           slot.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-500' :
//                           slot.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-500' :
//                           'bg-blue-500/20 text-blue-500'
//                         }`}>
//                           {slot.priority}
//                         </span>
//                         <span className="text-sm text-muted-foreground">
//                           {slot.subject}
//                         </span>
//                         {slot.isBreak && (
//                           <span className="text-xs px-2 py-0.5 bg-gray-500/20 text-gray-500 rounded-full">
//                             Break
//                           </span>
//                         )}
//                         {slot.isAISuggested && (
//                           <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
//                             AI Suggested
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     {slot.aiConfidence && (
//                       <div className="text-right">
//                         <div className="text-sm font-medium">{slot.aiConfidence}%</div>
//                         <div className="text-xs text-muted-foreground">AI Confidence</div>
//                       </div>
//                     )}
//                   </div>
                  
//                   {slot.description && (
//                     <p className="text-sm text-muted-foreground">
//                       {slot.description}
//                     </p>
//                   )}
//                 </div>
//               </motion.div>
//             ))
//           ) : (
//             <div className="p-8 text-center">
//               <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
//               <h4 className="font-medium mb-2">No sessions scheduled</h4>
//               <p className="text-muted-foreground">
//                 {selectedDay === 6 || selectedDay === 0
//                   ? 'Weekend - Focus on rest and revision'
//                   : 'This day is fully booked with fixed commitments'}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Subject Distribution */}
//       <div className="p-6 rounded-xl bg-gradient-to-r from-secondary/30 to-transparent border border-border">
//         <h4 className="font-bold mb-4">Subject Time Distribution</h4>
//         <div className="space-y-4">
//           {Object.entries(timetable.summary.distribution).map(([subject, hours]: [string, any], index) => (
//             <div key={subject} className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div className={`w-3 h-3 rounded-full ${getSlotColor(subject)}`} />
//                   <span className="font-medium">{subject}</span>
//                 </div>
//                 <div className="text-sm">
//                   <span className="font-bold">{hours}h</span>
//                   <span className="text-muted-foreground ml-2">
//                     ({Math.round((hours / timetable.summary.totalStudyHours) * 100)}%)
//                   </span>
//                 </div>
//               </div>
//               <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
//                 <motion.div
//                   initial={{ width: 0 }}
//                   animate={{ width: `${(hours / timetable.summary.totalStudyHours) * 100}%` }}
//                   transition={{ delay: index * 0.1 }}
//                   className={`h-full rounded-full ${getSlotColor(subject)}`}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* AI Recommendations */}
//       <div className="p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
//         <div className="flex items-start gap-3 mb-4">
//           <div className="p-2 rounded-lg bg-green-500/20">
//             <TrendingUp className="w-5 h-5 text-green-500" />
//           </div>
//           <div>
//             <h4 className="font-bold text-green-600">AI Recommendations</h4>
//             <p className="text-sm text-green-500/80">
//               Based on your schedule and goals
//             </p>
//           </div>
//         </div>
        
//         <div className="space-y-3">
//           {timetable.summary.recommendations.map((rec: string, index: number) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: index * 0.1 }}
//               className="flex items-start gap-3"
//             >
//               <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
//               <p className="text-sm">{rec}</p>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex flex-wrap gap-3">
//         <Button className="gap-2">
//           <Download className="w-4 h-4" />
//           Export as PDF
//         </Button>
//         <Button variant="outline" className="gap-2">
//           <Share2 className="w-4 h-4" />
//           Share Schedule
//         </Button>
//         <Button variant="outline" className="gap-2">
//           <ThumbsUp className="w-4 h-4" />
//           Good Schedule
//         </Button>
//         <Button variant="outline" className="gap-2">
//           <ThumbsDown className="w-4 h-4" />
//           Needs Improvement
//         </Button>
//       </div>

//       {/* Lock Message */}
//       {isLocked && (
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
//         >
//           <div className="flex items-center gap-3">
//             <Lock className="w-5 h-5 text-green-500 flex-shrink-0" />
//             <div>
//               <h4 className="font-medium text-green-600">Timetable Locked 🔒</h4>
//               <p className="text-sm text-green-500/80">
//                 This AI-generated timetable is now active. You can track progress in your dashboard.
//               </p>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   )
// }