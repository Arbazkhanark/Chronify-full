// // src/components/features/timetable/drag-drop-grid.tsx
// 'use client'

// import { useState, useRef } from 'react'
// import { motion } from 'framer-motion'
// import { 
//   Clock, 
//   GripVertical,
//   MoreVertical,
//   CheckCircle,
//   Lock,
//   AlertCircle,
//   Edit2,
//   X,
//   Coffee,
//   Wind,
//   Plus,
//   Trash2
// } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import { Button } from '@/components/ui/button'

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

// interface DragDropGridProps {
//   days: string[]
//   timeSlots: string[]
//   tasks: TimeSlot[]
//   fixedTimes: FixedTime[]
//   onDragEnd: (result: any) => void
//   isLocked: boolean
//   onEditFixedTime: (fixedTime: FixedTime) => void
//   userType: 'student' | 'professional' | 'jobseeker' | 'other'
//   displayMode: 'vertical' | 'horizontal'
//   timeInterval: number
//   cellHeight: number
//   compactMode: boolean
//   onCellClick: (day: string, time: string) => void
//   onDeleteTask: (taskId: string) => void
// }

// export function DragDropGrid({ 
//   days, 
//   timeSlots, 
//   tasks, 
//   fixedTimes, 
//   onDragEnd, 
//   isLocked,
//   onEditFixedTime,
//   userType,
//   displayMode,
//   timeInterval,
//   cellHeight,
//   compactMode,
//   onCellClick,
//   onDeleteTask
// }: DragDropGridProps) {
//   const [draggingItem, setDraggingItem] = useState<string | null>(null)
//   const [dropTarget, setDropTarget] = useState<string | null>(null)
//   const [showEditPrompt, setShowEditPrompt] = useState(false)
//   const [editPromptData, setEditPromptData] = useState<{
//     day: string
//     time: string
//     fixedTime?: FixedTime
//   } | null>(null)
  
//   const dragRef = useRef<HTMLDivElement>(null)

//   const isTimeInFixedSlot = (day: string, time: string) => {
//     const timeInMinutes = convertTimeToMinutes(time)
    
//     for (const ft of fixedTimes) {
//       if (!ft.days.includes(day)) continue
      
//       const startMinutes = convertTimeToMinutes(ft.startTime)
//       const endMinutes = convertTimeToMinutes(ft.endTime)
      
//       if (timeInMinutes >= startMinutes && timeInMinutes < endMinutes) {
//         return ft
//       }
//     }
//     return null
//   }

//   const convertTimeToMinutes = (time: string): number => {
//     const [hours, minutes] = time.split(':').map(Number)
//     return hours * 60 + minutes
//   }

//   const formatTimeDisplay = (time: string): string => {
//     const [hours, minutes] = time.split(':').map(Number)
//     const period = hours >= 12 ? 'PM' : 'AM'
//     const displayHours = hours % 12 || 12
//     return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
//   }

//   const getTimeSlotColor = (type: string, isFreePeriod?: boolean) => {
//     if (isFreePeriod) return 'bg-green-50 border-green-200 hover:border-green-300'
    
//     switch(type) {
//       case 'college': return 'bg-red-50 border-red-200 hover:border-red-300'
//       case 'office': return 'bg-blue-50 border-blue-200 hover:border-blue-300'
//       case 'school': return 'bg-purple-50 border-purple-200 hover:border-purple-300'
//       case 'commute': return 'bg-orange-50 border-orange-200 hover:border-orange-300'
//       case 'free': return 'bg-green-50 border-green-200 hover:border-green-300'
//       default: return 'bg-gray-50 border-gray-200 hover:border-gray-300'
//     }
//   }

//   const getPriorityColor = (priority: string) => {
//     switch(priority) {
//       case 'CRITICAL': return 'border-l-red-500'
//       case 'HIGH': return 'border-l-orange-500'
//       case 'MEDIUM': return 'border-l-yellow-500'
//       case 'LOW': return 'border-l-blue-500'
//       default: return 'border-l-gray-500'
//     }
//   }

//   const getTasksForSlot = (day: string, time: string) => {
//     const timeInMinutes = convertTimeToMinutes(time)
//     return tasks.filter(task => {
//       if (task.day !== day) return false
      
//       const taskStart = convertTimeToMinutes(task.startTime)
//       const taskEnd = convertTimeToMinutes(task.endTime)
      
//       return timeInMinutes >= taskStart && timeInMinutes < taskEnd
//     })
//   }

//   const handleDragStart = (e: React.DragEvent, taskId: string, duration?: number) => {
//     if (isLocked) return
    
//     e.dataTransfer.setData('text/plain', taskId)
//     if (duration) {
//       e.dataTransfer.setData('duration', duration.toString())
//     }
//     setDraggingItem(taskId)
//   }

//   const handleDragOver = (e: React.DragEvent, day: string, time: string) => {
//     e.preventDefault()
//     if (isLocked) return
    
//     const cellId = `${day}-${time}`
//     setDropTarget(cellId)
//   }

//   const handleDrop = (e: React.DragEvent, day: string, time: string) => {
//     e.preventDefault()
//     if (isLocked) return
    
//     const fixedTime = isTimeInFixedSlot(day, time)
//     if (fixedTime && !fixedTime.isFreePeriod) {
//       setEditPromptData({ day, time, fixedTime })
//       setShowEditPrompt(true)
//       setDraggingItem(null)
//       setDropTarget(null)
//       return
//     }
    
//     const taskId = e.dataTransfer.getData('text/plain')
//     const duration = e.dataTransfer.getData('duration') 
//       ? parseInt(e.dataTransfer.getData('duration'))
//       : timeInterval
    
//     onDragEnd({
//       taskId,
//       day,
//       time,
//       duration
//     })
    
//     setDraggingItem(null)
//     setDropTarget(null)
//   }

//   const handleEditPromptConfirm = () => {
//     if (editPromptData) {
//       const taskId = draggingItem || `task-${Date.now()}`
//       onDragEnd({
//         taskId,
//         day: editPromptData.day,
//         time: editPromptData.time,
//         duration: timeInterval,
//         overrideFixed: true
//       })
//     }
//     setShowEditPrompt(false)
//     setEditPromptData(null)
//     setDraggingItem(null)
//   }

//   const calculateCellHeight = () => {
//     if (compactMode) {
//       return cellHeight * 0.8
//     }
//     return cellHeight
//   }

//   const TimeCell = ({ day, time }: { day: string; time: string }) => {
//     const cellId = `${day}-${time}`
//     const isDropTarget = dropTarget === cellId
//     const fixedTime = isTimeInFixedSlot(day, time)
//     const slotTasks = getTasksForSlot(day, time)
//     const currentCellHeight = calculateCellHeight()
    
//     return (
//       <div
//         className={cn(
//           "relative group transition-all duration-150",
//           fixedTime && getTimeSlotColor(fixedTime.type, fixedTime.isFreePeriod),
//           isDropTarget && "bg-blue-100 ring-2 ring-blue-500 ring-inset",
//           !compactMode && "hover:bg-gray-50",
//           !isLocked && "cursor-pointer"
//         )}
//         style={{ height: `${currentCellHeight}px` }}
//         onDragOver={(e) => handleDragOver(e, day, time)}
//         onDrop={(e) => handleDrop(e, day, time)}
//         onClick={() => !isLocked && onCellClick(day, time)}
//       >
//         {/* Time slot border */}
//         <div className={cn(
//           "absolute inset-0 border-r border-b border-gray-200",
//           fixedTime && "border-transparent"
//         )} />
        
//         {/* Fixed time background */}
//         {fixedTime && (
//           <div className="absolute inset-0 p-1">
//             <div className={cn(
//               "h-full rounded flex flex-col items-center justify-center transition-all p-2",
//               fixedTime.isFreePeriod ? "bg-green-100/40" : 
//               fixedTime.isEditable ? "opacity-40" : "opacity-30",
//               compactMode && "p-1"
//             )}>
//               <div className={cn(
//                 "text-center font-medium",
//                 compactMode ? "text-xs" : "text-sm",
//                 timeInterval >= 120 && "text-base"
//               )}>
//                 <div className="truncate flex items-center justify-center gap-1">
//                   {fixedTime.isFreePeriod && <Wind className="w-3 h-3" />}
//                   <span>{fixedTime.title}</span>
//                 </div>
//                 {timeInterval >= 120 && (
//                   <div className="text-xs opacity-70 mt-1">
//                     {formatTimeDisplay(fixedTime.startTime)} - {formatTimeDisplay(fixedTime.endTime)}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
        
//         {/* Drop zone indicator */}
//         {isDropTarget && (
//           <div className="absolute inset-1 border-2 border-dashed border-blue-500 rounded-lg z-10 bg-blue-50/50" />
//         )}
        
//         {/* Task content */}
//         <div className="relative z-20 p-1 h-full overflow-y-auto">
//           {slotTasks.map((task, index) => (
//             <motion.div
//               key={`${task.id}-${index}`}
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               drag={!isLocked}
//               dragConstraints={dragRef}
//               dragElastic={0.1}
//               onDragStart={(e: any) => handleDragStart(e, task.id, task.duration)}
//               onDragEnd={() => setDraggingItem(null)}
//               className={cn(
//                 "mb-1 p-2 rounded border cursor-move relative group/task hover:shadow-sm",
//                 task.isCompleted 
//                   ? "border-green-500/30 bg-green-500/10" 
//                   : "border-gray-200 bg-white/90 hover:border-blue-500 hover:bg-white",
//                 getPriorityColor(task.priority),
//                 compactMode && "p-1.5 mb-0.5",
//                 timeInterval >= 120 && "p-3"
//               )}
//               style={{ 
//                 borderLeftWidth: '4px',
//                 minHeight: compactMode ? '32px' : '48px'
//               }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Drag handle */}
//               {!isLocked && (
//                 <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover/task:opacity-100 transition-opacity">
//                   <GripVertical className="w-3 h-3 text-gray-500" />
//                 </div>
//               )}
              
//               <div className="flex items-start justify-between h-full">
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-1 mb-0.5">
//                     <div className={cn(
//                       "font-medium truncate",
//                       compactMode ? "text-xs" : "text-sm",
//                       timeInterval >= 120 && "text-base"
//                     )}>
//                       {task.title}
//                     </div>
//                     {task.isCompleted && (
//                       <CheckCircle className={cn(
//                         "flex-shrink-0 text-green-500",
//                         compactMode ? "w-2 h-2" : "w-3 h-3"
//                       )} />
//                     )}
//                   </div>
//                   <div className={cn(
//                     "flex items-center gap-2 text-gray-600",
//                     compactMode ? "text-[10px]" : "text-xs",
//                     timeInterval >= 120 && "text-sm"
//                   )}>
//                     <span className="truncate">{task.subject}</span>
//                     <span>•</span>
//                     <span>{task.duration}m</span>
//                   </div>
//                 </div>
                
//                 {!isLocked && (
//                   <div className="flex items-center gap-1">
//                     <button 
//                       className="opacity-0 group-hover/task:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
//                       onClick={() => onDeleteTask(task.id)}
//                     >
//                       <Trash2 className="w-3 h-3 text-red-500" />
//                     </button>
//                     {timeInterval >= 90 && (
//                       <button className="opacity-0 group-hover/task:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
//                         <MoreVertical className="w-3 h-3" />
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           ))}
//         </div>
        
//         {/* Edit fixed time button */}
//         {fixedTime && fixedTime.isEditable && !isLocked && timeInterval >= 90 && (
//           <button
//             className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/80 rounded z-30"
//             onClick={(e) => {
//               e.stopPropagation()
//               onEditFixedTime(fixedTime)
//             }}
//           >
//             <Edit2 className="w-3 h-3 text-gray-500" />
//           </button>
//         )}
        
//         {/* Add task button (only when empty and not fixed time or free period) */}
//         {slotTasks.length === 0 && !fixedTime && !isLocked && (
//           <button
//             className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
//             onClick={(e) => {
//               e.stopPropagation()
//               onCellClick(day, time)
//             }}
//           >
//             <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-dashed border-blue-500/30 flex items-center justify-center">
//               <Plus className="w-4 h-4 text-blue-500" />
//             </div>
//           </button>
//         )}
        
//         {/* Free period indicator */}
//         {fixedTime?.isFreePeriod && timeInterval >= 90 && (
//           <div className="absolute bottom-1 right-1">
//             <Coffee className="w-3 h-3 text-green-500" />
//           </div>
//         )}
        
//         {/* Time label for first column in horizontal mode */}
//         {displayMode === 'horizontal' && time === timeSlots[0] && (
//           <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-600 w-14 text-right pr-2">
//             {formatTimeDisplay(time)}
//           </div>
//         )}
//       </div>
//     )
//   }

//   // Vertical layout (Weekdays as columns - default)
//   if (displayMode === 'vertical') {
//     return (
//       <>
//         <div className="overflow-x-auto">
//           <div className="min-w-[800px]" ref={dragRef}>
//             {/* Header row - Days */}
//             <div className="flex border-b-2 border-gray-300 bg-white">
//               <div className="w-24 flex-shrink-0 border-r border-gray-300 bg-gray-50" />
//               {days.map((day, index) => (
//                 <motion.div
//                   key={day}
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.05 }}
//                   className={cn(
//                     "flex-1 p-4 text-center font-medium border-r border-gray-300 last:border-r-0",
//                     ['Sat', 'Sun'].includes(day) ? "bg-blue-50" : "bg-white"
//                   )}
//                 >
//                   <div className="flex flex-col items-center gap-1">
//                     <span className={cn(
//                       "font-bold text-lg",
//                       ['Sat', 'Sun'].includes(day) && "text-blue-700"
//                     )}>
//                       {day}
//                     </span>
//                     <span className="text-sm text-gray-500">
//                       {['Sat', 'Sun'].includes(day) ? "Weekend" : "Weekday"}
//                     </span>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Time slots grid */}
//             <div className="flex">
//               {/* Time column */}
//               <div className="w-24 flex-shrink-0 bg-gray-50 border-r-2 border-gray-300">
//                 {timeSlots.map((time, index) => (
//                   <div
//                     key={time}
//                     className="flex items-center justify-center relative group border-b border-gray-200"
//                     style={{ height: `${calculateCellHeight()}px` }}
//                   >
//                     <div className="text-sm font-semibold text-gray-700 bg-white px-2 py-1 rounded-lg shadow-sm">
//                       {formatTimeDisplay(time)}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Main grid */}
//               <div className="flex-1 flex bg-white border-l border-gray-200">
//                 {days.map(day => (
//                   <div key={day} className="flex-1 flex flex-col relative">
//                     {/* Day label for mobile */}
//                     <div className="md:hidden absolute top-2 left-2 z-10">
//                       <div className={cn(
//                         "px-2 py-1 rounded text-xs font-semibold",
//                         ['Sat', 'Sun'].includes(day) ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
//                       )}>
//                         {day}
//                       </div>
//                     </div>
                    
//                     {timeSlots.map(time => (
//                       <TimeCell key={`${day}-${time}`} day={day} time={time} />
//                     ))}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Edit Prompt Modal */}
//         {showEditPrompt && editPromptData?.fixedTime && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="bg-white rounded-xl max-w-md w-full p-6"
//             >
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-2 rounded-lg bg-yellow-100">
//                   <AlertCircle className="w-5 h-5 text-yellow-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">Edit Fixed Time?</h3>
//                   <p className="text-sm text-gray-600">
//                     This time slot is reserved for:
//                   </p>
//                 </div>
//               </div>
              
//               <div className="p-4 bg-gray-50 rounded-lg mb-4">
//                 <div className="font-medium">{editPromptData.fixedTime.title}</div>
//                 <div className="text-sm text-gray-600">
//                   {editPromptData.fixedTime.days.join(', ')} • 
//                   {formatTimeDisplay(editPromptData.fixedTime.startTime)} - 
//                   {formatTimeDisplay(editPromptData.fixedTime.endTime)}
//                 </div>
//                 {editPromptData.fixedTime.description && (
//                   <div className="text-sm text-gray-500 mt-1">
//                     {editPromptData.fixedTime.description}
//                   </div>
//                 )}
//               </div>
              
//               <p className="text-sm text-gray-600 mb-6">
//                 Are you sure you want to schedule a task during this fixed time? 
//                 This is typically reserved for {editPromptData.fixedTime.type === 'college' ? 'college' : 'work'} hours.
//               </p>
              
//               <div className="flex gap-3">
//                 <Button
//                   variant="outline"
//                   className="flex-1"
//                   onClick={() => setShowEditPrompt(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="default"
//                   className="flex-1"
//                   onClick={handleEditPromptConfirm}
//                 >
//                   Schedule Anyway
//                 </Button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </>
//     )
//   }

//   // Horizontal layout (Time slots as rows - alternative)
//   return (
//     <div className="overflow-x-auto" ref={dragRef}>
//       <div className="min-w-[1000px]">
//         {/* Header row - Days */}
//         <div className="flex border-b-2 border-gray-300 bg-white">
//           <div className="w-24 flex-shrink-0 border-r-2 border-gray-300 bg-gray-50 p-4" />
//           {days.map((day, index) => (
//             <div
//               key={day}
//               className={cn(
//                 "flex-1 p-4 text-center font-medium border-r border-gray-300 last:border-r-0",
//                 ['Sat', 'Sun'].includes(day) ? "bg-blue-50" : "bg-white"
//               )}
//             >
//               <div className="flex flex-col items-center gap-1">
//                 <span className={cn(
//                   "font-bold text-lg",
//                   ['Sat', 'Sun'].includes(day) && "text-blue-700"
//                 )}>
//                   {day}
//                 </span>
//                 <span className="text-sm text-gray-500">
//                   {['Sat', 'Sun'].includes(day) ? "Weekend" : "Weekday"}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Time slots as rows */}
//         <div className="flex flex-col">
//           {timeSlots.map((time, timeIndex) => (
//             <div key={time} className="flex border-b border-gray-200 last:border-b-0">
//               {/* Time label column */}
//               <div 
//                 className="w-24 flex-shrink-0 border-r-2 border-gray-300 bg-gray-50 flex items-center justify-center"
//                 style={{ height: `${calculateCellHeight()}px` }}
//               >
//                 <div className="text-sm font-semibold text-gray-700 bg-white px-2 py-1 rounded-lg shadow-sm">
//                   {formatTimeDisplay(time)}
//                 </div>
//               </div>

//               {/* Day cells for this time slot */}
//               <div className="flex-1 flex">
//                 {days.map(day => (
//                   <TimeCell key={`${day}-${time}`} day={day} time={time} />
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }