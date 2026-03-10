// // src/components/features/timetable/pdf-view.tsx
// 'use client'

// import { useState } from 'react'
// import { motion } from 'framer-motion'
// import { 
//   ArrowLeft,
//   Download,
//   Printer,
//   Share2,
//   Clock,
//   Calendar,
//   Target,
//   Book,
//   GraduationCap,
//   Briefcase,
//   Coffee,
//   Wind,
//   CheckCircle,
//   AlertCircle,
//   FileText,
//   Users,
//   TrendingUp,
//   BarChart3
// } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Label } from '@/components/ui/label'

// interface TimeSlot {
//   id: string
//   title: string
//   subject: string
//   startTime: string
//   endTime: string
//   duration: number
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
//   color: string
//   isCompleted?: boolean
//   isFixed?: boolean
//   day: string
//   type: 'task' | 'fixed' | 'break' | 'commute' | 'free'
//   isFreePeriod?: boolean
// }

// interface FixedTime {
//   id: string
//   title: string
//   description?: string
//   days: string[] // ['Mon', 'Tue', ...]
//   startTime: string
//   endTime: string
//   type: 'college' | 'office' | 'school' | 'commitment' | 'other' | 'free'
//   isEditable: boolean
//   isFreePeriod?: boolean
// }

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

// interface PDFViewProps {
//   tasks: TimeSlot[]
//   fixedTimes: FixedTime[]
//   goals: Goal[]
//   userType: string
//   scheduledHours: Record<string, number>
//   pdfData: {
//     title: string
//     studentName: string
//     weekRange: string
//     notes: string
//   }
//   onBack: () => void
// }

// export function PDFView({ 
//   tasks, 
//   fixedTimes, 
//   goals, 
//   userType, 
//   scheduledHours, 
//   pdfData,
//   onBack 
// }: PDFViewProps) {
//   const [customData, setCustomData] = useState(pdfData)
//   const [isEditing, setIsEditing] = useState(false)

//   const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
//   // Group tasks by day
//   const tasksByDay = days.reduce((acc, day) => {
//     acc[day] = tasks.filter(task => task.day === day)
//     return acc
//   }, {} as Record<string, TimeSlot[]>)

//   // Calculate total hours by category
//   const getTotalHoursByCategory = () => {
//     const categories: Record<string, number> = {
//       'DSA & CODING': 0,
//       'College Studies': 0,
//       'Projects / AI-ML': 0,
//       'Travel Learning': 0,
//       'Other': 0
//     }

//     tasks.forEach(task => {
//       const subject = task.subject.toLowerCase()
//       if (subject.includes('dsa') || subject.includes('coding')) {
//         categories['DSA & CODING'] += task.duration / 60
//       } else if (subject.includes('college') || subject.includes('study')) {
//         categories['College Studies'] += task.duration / 60
//       } else if (subject.includes('project') || subject.includes('ai') || subject.includes('ml')) {
//         categories['Projects / AI-ML'] += task.duration / 60
//       } else if (subject.includes('travel') || subject.includes('commute')) {
//         categories['Travel Learning'] += task.duration / 60
//       } else {
//         categories['Other'] += task.duration / 60
//       }
//     })

//     // Add fixed times
//     fixedTimes.forEach(ft => {
//       if (ft.type === 'commute') {
//         const duration = (parseInt(ft.endTime.split(':')[0]) * 60 + parseInt(ft.endTime.split(':')[1])) - 
//                          (parseInt(ft.startTime.split(':')[0]) * 60 + parseInt(ft.startTime.split(':')[1]))
//         categories['Travel Learning'] += duration / 60 * ft.days.length
//       }
//     })

//     return categories
//   }

//   const categories = getTotalHoursByCategory()
//   const totalHours = Object.values(categories).reduce((sum, hours) => sum + hours, 0)

//   const formatTime = (time: string) => {
//     const [hours, minutes] = time.split(':').map(Number)
//     const period = hours >= 12 ? 'PM' : 'AM'
//     const displayHours = hours % 12 || 12
//     return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
//   }

//   const getPriorityBadge = (priority: string) => {
//     const colors = {
//       'CRITICAL': 'bg-red-100 text-red-800',
//       'HIGH': 'bg-orange-100 text-orange-800',
//       'MEDIUM': 'bg-yellow-100 text-yellow-800',
//       'LOW': 'bg-blue-100 text-blue-800'
//     }
//     return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'
//   }

//   const handlePrint = () => {
//     window.print()
//   }

//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: customData.title,
//         text: `Check out my weekly schedule: ${customData.weekRange}`,
//         url: window.location.href,
//       })
//     } else {
//       navigator.clipboard.writeText(window.location.href)
//       alert('Link copied to clipboard!')
//     }
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="space-y-6"
//     >
//       {/* PDF Header */}
//       <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
//         <CardContent className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-4">
//               <Button
//                 variant="outline"
//                 onClick={onBack}
//                 className="gap-2"
//               >
//                 <ArrowLeft className="w-4 h-4" />
//                 Back to Editor
//               </Button>
//               <Badge variant="secondary" className="text-lg px-3 py-1">
//                 <FileText className="w-4 h-4 mr-2" />
//                 PDF Preview
//               </Badge>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 onClick={() => setIsEditing(!isEditing)}
//                 className="gap-2"
//               >
//                 {isEditing ? 'Preview' : 'Edit'}
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={handlePrint}
//                 className="gap-2"
//               >
//                 <Printer className="w-4 h-4" />
//                 Print
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={handleShare}
//                 className="gap-2"
//               >
//                 <Share2 className="w-4 h-4" />
//                 Share
//               </Button>
//             </div>
//           </div>

//           {isEditing ? (
//             <div className="space-y-4 bg-white p-4 rounded-lg">
//               <div>
//                 <Label>Schedule Title</Label>
//                 <Input
//                   value={customData.title}
//                   onChange={(e) => setCustomData({...customData, title: e.target.value})}
//                   placeholder="e.g., My Weekly Schedule"
//                 />
//               </div>
//               <div>
//                 <Label>Student Name</Label>
//                 <Input
//                   value={customData.studentName}
//                   onChange={(e) => setCustomData({...customData, studentName: e.target.value})}
//                   placeholder="e.g., Arba MCA Student"
//                 />
//               </div>
//               <div>
//                 <Label>Week Range</Label>
//                 <Input
//                   value={customData.weekRange}
//                   onChange={(e) => setCustomData({...customData, weekRange: e.target.value})}
//                   placeholder="e.g., Week of Feb 3 - Feb 9, 2025"
//                 />
//               </div>
//               <div>
//                 <Label>Notes</Label>
//                 <Textarea
//                   value={customData.notes}
//                   onChange={(e) => setCustomData({...customData, notes: e.target.value})}
//                   placeholder="Add your notes here..."
//                   rows={3}
//                 />
//               </div>
//             </div>
//           ) : (
//             <div className="text-center">
//               <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
//                 {customData.title}
//               </h1>
//               <p className="text-xl text-gray-600 mb-4">
//                 {customData.studentName} • {customData.weekRange}
//               </p>
//               <p className="text-gray-700 max-w-3xl mx-auto">
//                 This is a balanced and focused weekly plan made for {userType === 'student' ? 'students' : 'professionals'} 
//                 who want to master skills while maintaining good productivity.
//               </p>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Weekly Routine Table */}
//       <Card className="border-2 border-gray-300">
//         <CardContent className="p-0">
//           <div className="bg-gray-800 text-white p-4 rounded-t-lg">
//             <div className="flex items-center gap-3">
//               <Calendar className="w-5 h-5" />
//               <h2 className="text-xl font-bold">Weekly Routine</h2>
//             </div>
//             <p className="text-gray-300 text-sm mt-1">
//               This is your complete weekly schedule. Follow it consistently for best results.
//             </p>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-gray-50 border-b-2 border-gray-200">
//                   <th className="p-4 text-left font-semibold text-gray-700 border-r border-gray-200">
//                     Time
//                   </th>
//                   {days.map(day => (
//                     <th 
//                       key={day} 
//                       className={`p-4 text-center font-semibold border-r border-gray-200 last:border-r-0 ${
//                         ['Sat', 'Sun'].includes(day) ? 'bg-blue-50 text-blue-700' : 'bg-white text-gray-700'
//                       }`}
//                     >
//                       <div>{day}</div>
//                       <div className="text-xs font-normal text-gray-500 mt-1">
//                         {['Sat', 'Sun'].includes(day) ? 'Weekend' : 'Weekday'}
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {/* Time slots from 6:00 to 23:00 */}
//                 {Array.from({ length: 18 }, (_, i) => i + 6).map(hour => {
//                   const time = `${hour.toString().padStart(2, '0')}:00`
//                   const nextHour = `${(hour + 1).toString().padStart(2, '0')}:00`
                  
//                   return (
//                     <tr key={time} className="border-b border-gray-100 hover:bg-gray-50">
//                       <td className="p-3 border-r border-gray-200 bg-gray-50">
//                         <div className="font-semibold text-gray-700 text-sm">
//                           {formatTime(time)} - {formatTime(nextHour)}
//                         </div>
//                       </td>
                      
//                       {days.map(day => {
//                         // Find tasks for this time slot and day
//                         const tasksInSlot = tasksByDay[day].filter(task => {
//                           const taskHour = parseInt(task.startTime.split(':')[0])
//                           return taskHour >= hour && taskHour < hour + 1
//                         })
                        
//                         // Find fixed times for this time slot and day
//                         const fixedInSlot = fixedTimes.filter(ft => 
//                           ft.days.includes(day) && (() => {
//                             const ftStart = parseInt(ft.startTime.split(':')[0])
//                             const ftEnd = parseInt(ft.endTime.split(':')[0])
//                             return ftStart >= hour && ftStart < hour + 1
//                           })()
//                         )

//                         return (
//                           <td key={`${day}-${time}`} className="p-2 border-r border-gray-200 last:border-r-0">
//                             <div className="space-y-1 min-h-[60px]">
//                               {fixedInSlot.map(ft => (
//                                 <div
//                                   key={ft.id}
//                                   className={`text-xs p-1.5 rounded border ${
//                                     ft.type === 'college' ? 'bg-red-50 border-red-200' :
//                                     ft.type === 'office' ? 'bg-blue-50 border-blue-200' :
//                                     ft.type === 'commute' ? 'bg-orange-50 border-orange-200' :
//                                     ft.isFreePeriod ? 'bg-green-50 border-green-200' :
//                                     'bg-gray-50 border-gray-200'
//                                   }`}
//                                 >
//                                   <div className="font-medium">{ft.title}</div>
//                                   <div className="text-gray-600">
//                                     {formatTime(ft.startTime)} - {formatTime(ft.endTime)}
//                                   </div>
//                                 </div>
//                               ))}
                              
//                               {tasksInSlot.map(task => (
//                                 <div
//                                   key={task.id}
//                                   className={`text-xs p-1.5 rounded border ${
//                                     task.priority === 'CRITICAL' ? 'border-l-4 border-l-red-500' :
//                                     task.priority === 'HIGH' ? 'border-l-4 border-l-orange-500' :
//                                     task.priority === 'MEDIUM' ? 'border-l-4 border-l-yellow-500' :
//                                     'border-l-4 border-l-blue-500'
//                                   } bg-white shadow-sm`}
//                                 >
//                                   <div className="font-medium flex items-center justify-between">
//                                     <span>{task.title}</span>
//                                     {task.isCompleted && (
//                                       <CheckCircle className="w-3 h-3 text-green-500" />
//                                     )}
//                                   </div>
//                                   <div className="text-gray-600 flex items-center justify-between mt-1">
//                                     <span>{task.subject}</span>
//                                     <span className="font-medium">{task.duration}m</span>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </td>
//                         )
//                       })}
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Stats and Breakdown */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Time Breakdown */}
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center gap-3 mb-6">
//               <BarChart3 className="w-5 h-5 text-gray-700" />
//               <h3 className="font-bold text-lg text-gray-900">Weekly Time Breakdown</h3>
//             </div>
            
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b-2 border-gray-200">
//                   <th className="p-3 text-left font-semibold text-gray-700">Category</th>
//                   <th className="p-3 text-center font-semibold text-gray-700">Hours/Week</th>
//                   <th className="p-3 text-center font-semibold text-gray-700">%</th>
//                   <th className="p-3 text-center font-semibold text-gray-700">Progress</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Object.entries(categories).map(([category, hours]) => (
//                   <tr key={category} className="border-b border-gray-100 hover:bg-gray-50">
//                     <td className="p-3">
//                       <div className="flex items-center gap-2">
//                         {category === 'DSA & CODING' && <Target className="w-4 h-4 text-green-600" />}
//                         {category === 'College Studies' && <GraduationCap className="w-4 h-4 text-blue-600" />}
//                         {category === 'Projects / AI-ML' && <Book className="w-4 h-4 text-purple-600" />}
//                         {category === 'Travel Learning' && <Briefcase className="w-4 h-4 text-orange-600" />}
//                         {category === 'Other' && <Coffee className="w-4 h-4 text-gray-600" />}
//                         <span className="font-medium">{category}</span>
//                       </div>
//                     </td>
//                     <td className="p-3 text-center font-medium">{hours.toFixed(1)} hrs</td>
//                     <td className="p-3 text-center font-bold">
//                       {totalHours > 0 ? ((hours / totalHours) * 100).toFixed(0) : 0}%
//                     </td>
//                     <td className="p-3">
//                       <div className="flex items-center justify-center">
//                         <div className="w-full bg-gray-200 rounded-full h-2.5">
//                           <div 
//                             className={`h-2.5 rounded-full ${
//                               category === 'DSA & CODING' ? 'bg-green-500' :
//                               category === 'College Studies' ? 'bg-blue-500' :
//                               category === 'Projects / AI-ML' ? 'bg-purple-500' :
//                               category === 'Travel Learning' ? 'bg-orange-500' :
//                               'bg-gray-500'
//                             }`}
//                             style={{ width: `${Math.min(100, (hours / Math.max(...Object.values(categories))) * 100)}%` }}
//                           />
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//                 <tr className="bg-gray-50 font-bold">
//                   <td className="p-3">TOTAL</td>
//                   <td className="p-3 text-center">{totalHours.toFixed(1)} hrs</td>
//                   <td className="p-3 text-center">100%</td>
//                   <td className="p-3 text-center">
//                     <Badge variant="outline" className="bg-green-50 text-green-700">
//                       Complete Schedule
//                     </Badge>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </CardContent>
//         </Card>

//         {/* Priority Order and Notes */}
//         <div className="space-y-6">
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center gap-3 mb-6">
//                 <TrendingUp className="w-5 h-5 text-gray-700" />
//                 <h3 className="font-bold text-lg text-gray-900">Priority Order</h3>
//               </div>
              
//               <div className="space-y-4">
//                 {Object.entries(categories)
//                   .sort(([, a], [, b]) => b - a)
//                   .filter(([, hours]) => hours > 0)
//                   .map(([category, hours], index) => (
//                     <div key={category} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
//                       <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">
//                         {index + 1}
//                       </div>
//                       <div className="flex-1">
//                         <div className="font-medium">{category}</div>
//                         <div className="text-sm text-gray-600">
//                           {hours.toFixed(1)} hours • {((hours / totalHours) * 100).toFixed(0)}% of schedule
//                         </div>
//                       </div>
//                       <Badge 
//                         className={
//                           index === 0 ? 'bg-red-100 text-red-700' :
//                           index === 1 ? 'bg-orange-100 text-orange-700' :
//                           'bg-blue-100 text-blue-700'
//                         }
//                       >
//                         {index === 0 ? 'Highest Priority' : 
//                          index === 1 ? 'High Priority' : 'Medium Priority'}
//                       </Badge>
//                     </div>
//                   ))}
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center gap-3 mb-6">
//                 <AlertCircle className="w-5 h-5 text-gray-700" />
//                 <h3 className="font-bold text-lg text-gray-900">Important Notes</h3>
//               </div>
              
//               <div className="space-y-4">
//                 <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                   <p className="text-gray-700 font-medium mb-2">📝 Key Principle:</p>
//                   <p className="text-gray-600">{customData.notes}</p>
//                 </div>
                
//                 <div className="space-y-3">
//                   <div className="flex items-start gap-2">
//                     <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
//                     <span className="text-gray-700">Be consistent – 1 hour daily is better than 5 hours in one day.</span>
//                   </div>
//                   <div className="flex items-start gap-2">
//                     <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
//                     <span className="text-gray-700">Revise weekly and note weak topics for focused improvement.</span>
//                   </div>
//                   <div className="flex items-start gap-2">
//                     <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
//                     <span className="text-gray-700">Update your GitHub/LeetCode profile regularly to track progress.</span>
//                   </div>
//                   <div className="flex items-start gap-2">
//                     <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
//                     <span className="text-gray-700 font-bold">"Consistency beats intensity." – Stick to the schedule!</span>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Goals Progress */}
//       <Card>
//         <CardContent className="p-6">
//           <div className="flex items-center gap-3 mb-6">
//             <Target className="w-5 h-5 text-gray-700" />
//             <h3 className="font-bold text-lg text-gray-900">Goals Progress</h3>
//           </div>
          
//           <div className="space-y-6">
//             {goals.map((goal, index) => {
//               const progress = (goal.completedHours / goal.totalHours) * 100
//               const scheduledForSubject = scheduledHours[goal.subject] || 0
              
//               return (
//                 <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
//                   <div className="flex items-start justify-between mb-3">
//                     <div>
//                       <div className="flex items-center gap-2 mb-1">
//                         <h4 className="font-bold text-gray-900">{goal.title}</h4>
//                         <Badge className={`px-2 py-0.5 text-xs ${getPriorityBadge(goal.priority)}`}>
//                           {goal.priority}
//                         </Badge>
//                       </div>
//                       <p className="text-gray-600 mb-2">{goal.description}</p>
//                       <div className="flex items-center gap-4 text-sm text-gray-500">
//                         <div className="flex items-center gap-1">
//                           <Book className="w-4 h-4" />
//                           <span>{goal.subject}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Clock className="w-4 h-4" />
//                           <span>{goal.completedHours.toFixed(1)} / {goal.totalHours}h</span>
//                         </div>
//                         {goal.deadline && (
//                           <div className="flex items-center gap-1">
//                             <Calendar className="w-4 h-4" />
//                             <span>Due: {goal.deadline.toLocaleDateString()}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-2xl font-bold text-gray-900 mb-1">
//                         {progress.toFixed(0)}%
//                       </div>
//                       <div className="text-sm text-gray-600">
//                         {scheduledForSubject.toFixed(1)}h scheduled
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <div className="w-full bg-gray-200 rounded-full h-3">
//                       <div 
//                         className={`h-3 rounded-full ${
//                           progress >= 80 ? 'bg-green-500' :
//                           progress >= 50 ? 'bg-blue-500' :
//                           progress >= 25 ? 'bg-yellow-500' :
//                           'bg-red-500'
//                         }`}
//                         style={{ width: `${Math.min(100, progress)}%` }}
//                       />
//                     </div>
//                     <div className="flex justify-between text-xs text-gray-500">
//                       <span>Scheduled: {scheduledForSubject.toFixed(1)}h</span>
//                       <span>Goal: {goal.totalHours}h</span>
//                     </div>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Footer */}
//       <Card className="bg-gray-800 text-white border-0">
//         <CardContent className="p-6">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//             <div>
//               <h3 className="font-bold text-xl mb-2">Ready to Export?</h3>
//               <p className="text-gray-300">
//                 Download this schedule as PDF or print it for your wall. Stay disciplined!
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               <Button
//                 variant="outline"
//                 className="bg-white text-gray-800 hover:bg-gray-100 border-white"
//                 onClick={onBack}
//               >
//                 <ArrowLeft className="w-4 h-4 mr-2" />
//                 Edit Schedule
//               </Button>
//               <Button
//                 className="bg-green-500 hover:bg-green-600"
//                 onClick={handlePrint}
//               >
//                 <Printer className="w-4 h-4 mr-2" />
//                 Print Schedule
//               </Button>
//             </div>
//           </div>
          
//           <div className="mt-6 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
//             <p>Generated by Timetable Builder • {new Date().toLocaleDateString()}</p>
//             <p className="mt-1">"Success is the sum of small efforts, repeated day in and day out." – Robert Collier</p>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Print Styles */}
//       <style jsx global>{`
//         @media print {
//           body * {
//             visibility: hidden;
//           }
//           .pdf-view, .pdf-view * {
//             visibility: visible;
//           }
//           .pdf-view {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100%;
//             padding: 0;
//             margin: 0;
//           }
//           button, .no-print {
//             display: none !important;
//           }
//           .break-before {
//             page-break-before: always;
//           }
//           .break-after {
//             page-break-after: always;
//           }
//           .avoid-break {
//             page-break-inside: avoid;
//           }
//         }
//       `}</style>
//     </motion.div>
//   )
// }