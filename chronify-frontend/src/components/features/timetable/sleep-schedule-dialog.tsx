// // src/components/features/timetable/sleep-schedule-dialog.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { 
//   Moon, 
//   Sun, 
//   Bed, 
//   Clock, 
//   AlarmClock, 
//   MoonStar, 
//   Sunrise,
//   Sunset,
//   Heart,
//   Zap,
//   X,
//   Plus,
//   Check,
//   AlertCircle,
//   Info
// } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Badge } from '@/components/ui/badge'
// import { Card, CardContent } from '@/components/ui/card'
// import { 
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from '@/components/ui/dialog'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { Switch } from '@/components/ui/switch'
// import { Label } from '@/components/ui/label'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// // Sleep Types
// const SLEEP_TYPES = [
//   { id: 'regular', label: 'Regular Sleep', icon: Moon, color: '#4B5563', bgColor: 'bg-gray-100 dark:bg-gray-800', description: 'Standard nightly sleep schedule' },
//   { id: 'power_nap', label: 'Power Nap', icon: AlarmClock, color: '#8B5CF6', bgColor: 'bg-purple-100 dark:bg-purple-900/30', description: 'Short 15-30 min nap for quick energy boost' },
//   { id: 'recovery', label: 'Recovery Sleep', icon: Heart, color: '#EC4899', bgColor: 'bg-pink-100 dark:bg-pink-900/30', description: 'Extra sleep for recovery after intense activity' },
//   { id: 'early', label: 'Early Bird', icon: Sunrise, color: '#F59E0B', bgColor: 'bg-orange-100 dark:bg-orange-900/30', description: 'Early to bed, early to rise' },
//   { id: 'late', label: 'Night Owl', icon: MoonStar, color: '#3B82F6', bgColor: 'bg-blue-100 dark:bg-blue-900/30', description: 'Late night schedule' }
// ]

// interface SleepSchedule {
//   id: string
//   day: string
//   bedtime: string
//   wakeTime: string
//   duration: number
//   isActive: boolean
//   color: string
//   type: 'regular' | 'power_nap' | 'recovery' | 'early' | 'late'
//   notes?: string
// }

// interface SleepScheduleDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   sleepSchedules: SleepSchedule[]
//   days: string[]
//   onSave: (schedule: SleepSchedule) => void
//   onDelete: (id: string) => void
//   editingSchedule?: SleepSchedule | null
//   darkMode: boolean
//   autoLockSleep: boolean
//   onToggleAutoLock: (checked: boolean) => void
// }

// export function SleepScheduleDialog({
//   open,
//   onOpenChange,
//   sleepSchedules,
//   days,
//   onSave,
//   onDelete,
//   editingSchedule,
//   darkMode,
//   autoLockSleep,
//   onToggleAutoLock
// }: SleepScheduleDialogProps) {
//   const [selectedDay, setSelectedDay] = useState<string>('Mon')
//   const [bedtime, setBedtime] = useState<string>('23:00')
//   const [wakeTime, setWakeTime] = useState<string>('07:00')
//   const [sleepType, setSleepType] = useState<'regular' | 'power_nap' | 'recovery' | 'early' | 'late'>('regular')
//   const [isActive, setIsActive] = useState<boolean>(true)
//   const [notes, setNotes] = useState<string>('')
//   const [editId, setEditId] = useState<string | null>(null)
  
//   // Load schedule if editing
//   useEffect(() => {
//     if (editingSchedule) {
//       setSelectedDay(editingSchedule.day)
//       setBedtime(editingSchedule.bedtime)
//       setWakeTime(editingSchedule.wakeTime)
//       setSleepType(editingSchedule.type)
//       setIsActive(editingSchedule.isActive)
//       setNotes(editingSchedule.notes || '')
//       setEditId(editingSchedule.id)
//     } else {
//       resetForm()
//     }
//   }, [editingSchedule])

//   const resetForm = () => {
//     setSelectedDay('Mon')
//     setBedtime('23:00')
//     setWakeTime('07:00')
//     setSleepType('regular')
//     setIsActive(true)
//     setNotes('')
//     setEditId(null)
//   }

//   // Calculate duration in minutes
//   const calculateDuration = (bed: string, wake: string): number => {
//     const bedMinutes = convertTimeToMinutes(bed)
//     const wakeMinutes = convertTimeToMinutes(wake)
    
//     if (wakeMinutes < bedMinutes) {
//       // Sleep spans across midnight
//       const midnight = convertTimeToMinutes('24:00')
//       return (midnight - bedMinutes) + wakeMinutes
//     }
//     return wakeMinutes - bedMinutes
//   }

//   // Convert time to minutes
//   const convertTimeToMinutes = (time: string): number => {
//     const [hours, minutes] = time.split(':').map(Number)
//     return hours * 60 + minutes
//   }

//   // Format time for display
//   const formatTimeDisplay = (time: string): string => {
//     const [hours, minutes] = time.split(':').map(Number)
//     const period = hours >= 12 ? 'PM' : 'AM'
//     const displayHours = hours % 12 || 12
//     return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
//   }

//   // Get sleep duration in hours and minutes
//   const getDurationText = (minutes: number): string => {
//     const hours = Math.floor(minutes / 60)
//     const mins = minutes % 60
//     return `${hours}h ${mins > 0 ? `${mins}m` : ''}`
//   }

//   // Handle save
//   const handleSave = () => {
//     const duration = calculateDuration(bedtime, wakeTime)
//     const sleepTypeInfo = SLEEP_TYPES.find(t => t.id === sleepType) || SLEEP_TYPES[0]
    
//     const schedule: SleepSchedule = {
//       id: editId || `sleep-${selectedDay}-${Date.now()}`,
//       day: selectedDay,
//       bedtime,
//       wakeTime,
//       duration,
//       isActive,
//       color: sleepTypeInfo.color,
//       type: sleepType,
//       notes: notes.trim() || undefined
//     }
    
//     onSave(schedule)
//     resetForm()
//   }

//   // Handle delete
//   const handleDelete = () => {
//     if (editId) {
//       onDelete(editId)
//       resetForm()
//     }
//   }

//   // Handle apply to all days
//   const handleApplyToAll = () => {
//     days.forEach(day => {
//       const existingSchedule = sleepSchedules.find(s => s.day === day)
//       const duration = calculateDuration(bedtime, wakeTime)
//       const sleepTypeInfo = SLEEP_TYPES.find(t => t.id === sleepType) || SLEEP_TYPES[0]
      
//       const schedule: SleepSchedule = {
//         id: existingSchedule?.id || `sleep-${day}-${Date.now()}`,
//         day,
//         bedtime,
//         wakeTime,
//         duration,
//         isActive: existingSchedule?.isActive ?? true,
//         color: sleepTypeInfo.color,
//         type: sleepType,
//         notes: existingSchedule?.notes || notes || undefined
//       }
      
//       onSave(schedule)
//     })
    
//     resetForm()
//     onOpenChange(false)
//   }

//   // Get sleep statistics
//   const getSleepStats = () => {
//     const activeSchedules = sleepSchedules.filter(s => s.isActive)
//     const totalSleepHours = activeSchedules.reduce((sum, s) => sum + (s.duration / 60), 0)
//     const avgSleepHours = activeSchedules.length > 0 ? totalSleepHours / activeSchedules.length : 0
    
//     return {
//       totalSleepHours,
//       avgSleepHours,
//       daysWithSleep: activeSchedules.length,
//       recommendedHours: 8
//     }
//   }

//   const stats = getSleepStats()
//   const currentDuration = calculateDuration(bedtime, wakeTime)
//   const durationText = getDurationText(currentDuration)
//   const sleepTypeInfo = SLEEP_TYPES.find(t => t.id === sleepType) || SLEEP_TYPES[0]
//   const SleepIcon = sleepTypeInfo.icon

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-2xl bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
//         <DialogHeader className="flex-shrink-0">
//           <DialogTitle className="flex items-center gap-2 dark:text-gray-100">
//             <Bed className="w-5 h-5" />
//             Sleep Schedule
//           </DialogTitle>
//           <DialogDescription className="dark:text-gray-400">
//             Set your sleep schedule for each day of the week
//           </DialogDescription>
//         </DialogHeader>
        
//         <div className="flex-1 overflow-y-auto pr-4 py-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
//           <Tabs defaultValue="edit" className="w-full">
//             <TabsList className="grid w-full grid-cols-2 mb-6 dark:bg-gray-800 dark:border-gray-700">
//               <TabsTrigger value="edit" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
//                 Edit Schedule
//               </TabsTrigger>
//               <TabsTrigger value="overview" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
//                 Overview
//               </TabsTrigger>
//             </TabsList>
            
//             <TabsContent value="edit" className="space-y-6">
//               {/* Day Selection */}
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Select Day</label>
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {days.map(day => {
//                     const existingSchedule = sleepSchedules.find(s => s.day === day)
//                     const isSelected = selectedDay === day
//                     const isActive = existingSchedule?.isActive ?? true
                    
//                     return (
//                       <button
//                         key={day}
//                         onClick={() => {
//                           setSelectedDay(day)
//                           // Load existing schedule for this day if available
//                           const schedule = sleepSchedules.find(s => s.day === day)
//                           if (schedule) {
//                             setBedtime(schedule.bedtime)
//                             setWakeTime(schedule.wakeTime)
//                             setSleepType(schedule.type)
//                             setIsActive(schedule.isActive)
//                             setNotes(schedule.notes || '')
//                             setEditId(schedule.id)
//                           } else {
//                             // Reset to defaults
//                             setBedtime('23:00')
//                             setWakeTime('07:00')
//                             setSleepType('regular')
//                             setIsActive(true)
//                             setNotes('')
//                             setEditId(null)
//                           }
//                         }}
//                         className={cn(
//                           "px-4 py-2 rounded-lg text-sm font-medium transition-all",
//                           isSelected 
//                             ? "bg-blue-500 text-white" 
//                             : existingSchedule
//                               ? isActive
//                                 ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700"
//                                 : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 opacity-50"
//                               : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
//                         )}
//                       >
//                         {day}
//                         {existingSchedule?.isActive && (
//                           <span className="ml-1 text-xs">✓</span>
//                         )}
//                       </button>
//                     )
//                   })}
//                 </div>
//               </div>

//               {/* Sleep Type Selection */}
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Sleep Type</label>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                   {SLEEP_TYPES.map((type) => {
//                     const Icon = type.icon
//                     const isSelected = sleepType === type.id
                    
//                     return (
//                       <button
//                         key={type.id}
//                         type="button"
//                         onClick={() => setSleepType(type.id as any)}
//                         className={cn(
//                           "flex flex-col items-center p-3 rounded-lg border transition-all",
//                           isSelected 
//                             ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500" 
//                             : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
//                         )}
//                       >
//                         <div 
//                           className="p-2 rounded-lg mb-2"
//                           style={{ backgroundColor: `${type.color}20` }}
//                         >
//                           <Icon className="w-5 h-5" style={{ color: type.color }} />
//                         </div>
//                         <span className="text-xs font-medium dark:text-gray-300">{type.label}</span>
//                       </button>
//                     )
//                   })}
//                 </div>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
//                   {sleepTypeInfo.description}
//                 </p>
//               </div>

//               {/* Time Selection */}
//               <div className="grid grid-cols-2 gap-6">
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">Bedtime</label>
//                   <div className="relative">
//                     <Moon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
//                     <Input
//                       type="time"
//                       value={bedtime}
//                       onChange={(e) => setBedtime(e.target.value)}
//                       className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">Wake Time</label>
//                   <div className="relative">
//                     <Sun className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
//                     <Input
//                       type="time"
//                       value={wakeTime}
//                       onChange={(e) => setWakeTime(e.target.value)}
//                       className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Duration Preview */}
//               <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600">
//                       <Clock className="w-5 h-5 text-gray-700 dark:text-gray-300" />
//                     </div>
//                     <div>
//                       <div className="text-sm font-medium dark:text-gray-300">Sleep Duration</div>
//                       <div className="text-xs text-gray-500 dark:text-gray-400">
//                         {formatTimeDisplay(bedtime)} → {formatTimeDisplay(wakeTime)}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//                       {durationText}
//                     </div>
//                     <div className="text-xs text-gray-500 dark:text-gray-400">
//                       {currentDuration} minutes
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Notes */}
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Notes (Optional)</label>
//                 <Textarea
//                   placeholder="e.g., Need to wake up early for meeting, Weekend sleep in, etc."
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                   rows={2}
//                 />
//               </div>

//               {/* Active Toggle */}
//               <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
//                 <div className="flex items-center gap-3">
//                   <div className={cn(
//                     "w-2 h-2 rounded-full",
//                     isActive ? "bg-green-500" : "bg-gray-400"
//                   )} />
//                   <div>
//                     <div className="font-medium dark:text-gray-300">Active Schedule</div>
//                     <div className="text-xs text-gray-500 dark:text-gray-400">
//                       {isActive 
//                         ? "This sleep schedule will be shown in your timetable" 
//                         : "This sleep schedule is disabled"}
//                     </div>
//                   </div>
//                 </div>
//                 <Switch
//                   checked={isActive}
//                   onCheckedChange={setIsActive}
//                 />
//               </div>

//               {/* Health Tips */}
//               <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800/30">
//                 <div className="flex items-start gap-3">
//                   <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
//                   <div>
//                     <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Sleep Health Tips</h4>
//                     <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1 list-disc list-inside">
//                       <li>Aim for 7-9 hours of sleep for optimal health</li>
//                       <li>Consistent sleep schedule improves sleep quality</li>
//                       <li>Avoid screens 1 hour before bedtime</li>
//                       <li>Power naps (15-20 min) can boost afternoon energy</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>
            
//             <TabsContent value="overview" className="space-y-6">
//               {/* Sleep Statistics */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
//                   <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Sleep</div>
//                   <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//                     {stats.totalSleepHours.toFixed(1)}h
//                   </div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                     per week
//                   </div>
//                 </div>
                
//                 <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
//                   <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Daily Average</div>
//                   <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//                     {stats.avgSleepHours.toFixed(1)}h
//                   </div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                     {stats.avgSleepHours < 7 ? '⬆️ Need more rest' : stats.avgSleepHours > 9 ? '⬇️ Maybe too much' : '✅ Optimal range'}
//                   </div>
//                 </div>
//               </div>
              
//               {/* Weekly Schedule Overview */}
//               <div>
//                 <h4 className="font-medium dark:text-gray-200 mb-3">Weekly Sleep Schedule</h4>
//                 <div className="space-y-3">
//                   {days.map(day => {
//                     const schedule = sleepSchedules.find(s => s.day === day)
//                     const sleepTypeInfo = schedule ? SLEEP_TYPES.find(t => t.id === schedule.type) : SLEEP_TYPES[0]
//                     const Icon = sleepTypeInfo?.icon || Moon
                    
//                     return (
//                       <div key={day} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
//                         <div className="flex items-center gap-3">
//                           <div className={cn(
//                             "w-2 h-2 rounded-full",
//                             schedule?.isActive ? "bg-green-500" : "bg-gray-400"
//                           )} />
//                           <span className="font-medium w-12 dark:text-gray-300">{day}</span>
//                           {schedule ? (
//                             <div className="flex items-center gap-2">
//                               <Icon className="w-4 h-4" style={{ color: sleepTypeInfo?.color }} />
//                               <span className="text-sm dark:text-gray-300">
//                                 {formatTimeDisplay(schedule.bedtime)} - {formatTimeDisplay(schedule.wakeTime)}
//                               </span>
//                               <Badge 
//                                 className="text-xs"
//                                 style={{ 
//                                   backgroundColor: `${sleepTypeInfo?.color}20`,
//                                   color: sleepTypeInfo?.color
//                                 }}
//                               >
//                                 {getDurationText(schedule.duration)}
//                               </Badge>
//                             </div>
//                           ) : (
//                             <span className="text-sm text-gray-500 dark:text-gray-400">Not set</span>
//                           )}
//                         </div>
                        
//                         {schedule && !schedule.isActive && (
//                           <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-400">
//                             Disabled
//                           </Badge>
//                         )}
//                       </div>
//                     )
//                   })}
//                 </div>
//               </div>
              
//               {/* Auto-Lock Setting */}
//               <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
//                 <div>
//                   <div className="font-medium dark:text-gray-300">Auto-Lock Sleep Hours</div>
//                   <div className="text-sm text-gray-500 dark:text-gray-400">
//                     Prevent scheduling tasks during sleep time
//                   </div>
//                 </div>
//                 <Switch
//                   checked={autoLockSleep}
//                   onCheckedChange={onToggleAutoLock}
//                 />
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
        
//         <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3">
//           <div className="flex flex-1 gap-2">
//             {editId && (
//               <Button
//                 variant="destructive"
//                 onClick={handleDelete}
//                 className="gap-2"
//               >
//                 <X className="w-4 h-4" />
//                 Delete
//               </Button>
//             )}
//             <Button
//               variant="outline"
//               onClick={() => {
//                 resetForm()
//                 onOpenChange(false)
//               }}
//               className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//             >
//               Cancel
//             </Button>
//           </div>
          
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               onClick={handleApplyToAll}
//               className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//             >
//               Apply to All Days
//             </Button>
//             <Button onClick={handleSave} className="gap-2">
//               <Bed className="w-4 h-4" />
//               {editId ? 'Update Schedule' : 'Save Schedule'}
//             </Button>
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

// function cn(...classes: (string | boolean | undefined)[]) {
//   return classes.filter(Boolean).join(' ')
// }