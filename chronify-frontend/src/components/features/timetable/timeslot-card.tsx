// // src/components/features/timetable/time-slot-manager.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { Clock, Plus, Trash2, Save, X, AlertCircle } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

// interface TimeSlotManagerProps {
//   isOpen: boolean
//   onClose: () => void
//   currentTimeSlots: string[]
//   onSave: (timeSlots: string[]) => void
// }

// export function TimeSlotManager({ isOpen, onClose, currentTimeSlots, onSave }: TimeSlotManagerProps) {
//   const [timeSlots, setTimeSlots] = useState<string[]>(currentTimeSlots)
//   const [newTime, setNewTime] = useState('09:00')
//   const [error, setError] = useState('')

//   useEffect(() => {
//     setTimeSlots(currentTimeSlots)
//   }, [currentTimeSlots])

//   const addTimeSlot = () => {
//     if (!newTime) {
//       setError('Please enter a time')
//       return
//     }

//     // Validate time format
//     const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/
//     if (!timeRegex.test(newTime)) {
//       setError('Please enter a valid time in HH:MM format')
//       return
//     }

//     // Check for duplicate
//     if (timeSlots.includes(newTime)) {
//       setError('This time slot already exists')
//       return
//     }

//     // Add and sort
//     const newSlots = [...timeSlots, newTime].sort((a, b) => {
//       const [aHours, aMinutes] = a.split(':').map(Number)
//       const [bHours, bMinutes] = b.split(':').map(Number)
//       return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes)
//     })

//     setTimeSlots(newSlots)
//     setNewTime('')
//     setError('')
//   }

//   const removeTimeSlot = (time: string) => {
//     setTimeSlots(timeSlots.filter(t => t !== time))
//   }

//   const handleSave = () => {
//     if (timeSlots.length === 0) {
//       setError('Please add at least one time slot')
//       return
//     }
//     onSave(timeSlots)
//   }

//   const quickAddSlots = (type: 'standard' | 'halfHour' | 'hourly' | 'custom') => {
//     let newSlots: string[] = []
    
//     switch(type) {
//       case 'standard':
//         // Standard college hours (9 AM to 5 PM hourly)
//         newSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
//         break
//       case 'halfHour':
//         // Every 30 minutes from 8 AM to 10 PM
//         newSlots = []
//         for (let hour = 8; hour <= 22; hour++) {
//           newSlots.push(`${hour.toString().padStart(2, '0')}:00`)
//           newSlots.push(`${hour.toString().padStart(2, '0')}:30`)
//         }
//         break
//       case 'hourly':
//         // Every hour from 6 AM to 11 PM
//         newSlots = []
//         for (let hour = 6; hour <= 23; hour++) {
//           newSlots.push(`${hour.toString().padStart(2, '0')}:00`)
//         }
//         break
//       case 'custom':
//         // Custom: 10-minute intervals for specific hours
//         newSlots = []
//         for (let hour = 9; hour <= 17; hour++) {
//           for (let minute = 0; minute < 60; minute += 10) {
//             newSlots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`)
//           }
//         }
//         break
//     }
    
//     setTimeSlots([...new Set([...timeSlots, ...newSlots])].sort((a, b) => {
//       const [aHours, aMinutes] = a.split(':').map(Number)
//       const [bHours, bMinutes] = b.split(':').map(Number)
//       return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes)
//     }))
//   }

//   const formatTimeDisplay = (time: string): string => {
//     const [hours, minutes] = time.split(':').map(Number)
//     const period = hours >= 12 ? 'PM' : 'AM'
//     const displayHours = hours % 12 || 12
//     return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-lg">
//         <DialogHeader>
//           <DialogTitle>Manage Time Slots</DialogTitle>
//           <DialogDescription>
//             Customize your timetable time slots. You can add any time interval you want.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4 py-4">
//           {/* Quick Add Buttons */}
//           <div>
//             <label className="text-sm font-medium mb-2 block">Quick Add Presets</label>
//             <div className="grid grid-cols-2 gap-2">
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={() => quickAddSlots('standard')}
//                 className="gap-2"
//               >
//                 <Clock className="w-4 h-4" />
//                 Standard (9 AM - 5 PM)
//               </Button>
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={() => quickAddSlots('halfHour')}
//                 className="gap-2"
//               >
//                 <Clock className="w-4 h-4" />
//                 Half Hourly
//               </Button>
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={() => quickAddSlots('hourly')}
//                 className="gap-2"
//               >
//                 <Clock className="w-4 h-4" />
//                 Hourly (6 AM - 11 PM)
//               </Button>
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={() => quickAddSlots('custom')}
//                 className="gap-2"
//               >
//                 <Clock className="w-4 h-4" />
//                 10-min Intervals
//               </Button>
//             </div>
//           </div>

//           {/* Add Time Slot */}
//           <div>
//             <label className="text-sm font-medium mb-2 block">Add Custom Time Slot</label>
//             <div className="flex gap-2">
//               <Input
//                 type="time"
//                 value={newTime}
//                 onChange={(e) => {
//                   setNewTime(e.target.value)
//                   setError('')
//                 }}
//                 className="flex-1"
//               />
//               <Button
//                 type="button"
//                 onClick={addTimeSlot}
//                 className="gap-2"
//               >
//                 <Plus className="w-4 h-4" />
//                 Add
//               </Button>
//             </div>
//             {error && (
//               <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
//                 <AlertCircle className="w-4 h-4" />
//                 {error}
//               </p>
//             )}
//           </div>

//           {/* Current Time Slots */}
//           <div>
//             <div className="flex items-center justify-between mb-2">
//               <label className="text-sm font-medium">Current Time Slots</label>
//               <span className="text-sm text-gray-500">{timeSlots.length} slots</span>
//             </div>
            
//             {timeSlots.length === 0 ? (
//               <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
//                 <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
//                 <p className="text-gray-500">No time slots added yet</p>
//               </div>
//             ) : (
//               <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3">
//                   {timeSlots.map((time, index) => (
//                     <motion.div
//                       key={time}
//                       initial={{ opacity: 0, scale: 0.9 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       transition={{ delay: index * 0.02 }}
//                       className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//                     >
//                       <div className="flex items-center gap-2">
//                         <Clock className="w-4 h-4 text-gray-600" />
//                         <span className="font-medium">{formatTimeDisplay(time)}</span>
//                       </div>
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => removeTimeSlot(time)}
//                         className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
//                       >
//                         <Trash2 className="w-3 h-3" />
//                       </Button>
//                     </motion.div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Tips */}
//           <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
//             <div className="flex items-start gap-2">
//               <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
//               <div className="text-sm text-blue-700">
//                 <p className="font-medium mb-1">💡 Time Slot Tips:</p>
//                 <ul className="space-y-1">
//                   <li>• Add time slots that match your schedule (e.g., 10:15, 11:30)</li>
//                   <li>• Use half-hour or 15-minute intervals for more precise scheduling</li>
//                   <li>• Remove unnecessary slots to keep your timetable clean</li>
//                   <li>• You can always come back and adjust these later</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-3">
//           <Button
//             variant="outline"
//             onClick={onClose}
//             className="flex-1"
//           >
//             <X className="w-4 h-4 mr-2" />
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSave}
//             className="flex-1"
//           >
//             <Save className="w-4 h-4 mr-2" />
//             Save Time Slots
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }