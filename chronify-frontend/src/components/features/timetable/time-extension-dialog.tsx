// // src/components/features/timetable/time-extension-dialog.tsx
// import { useState } from 'react'
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Switch } from '@/components/ui/switch'
// import { Label } from '@/components/ui/label'
// import { Badge } from '@/components/ui/badge'
// import { Clock, Sun, Moon, Star, Plus, X, AlertCircle } from 'lucide-react'

// interface ExtendedHours {
//   morning: boolean
//   evening: boolean
//   night: boolean
//   custom: string[]
// }

// interface TimeExtensionDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   extendedHours: ExtendedHours
//   onExtendTime: (type: 'morning' | 'evening' | 'night' | 'custom', customSlots?: string[]) => void
//   onAddCustomTime: (time: string) => void
//   onRemoveCustomTime: (time: string) => void
//   existingTimeSlots: string[]
// }

// export function TimeExtensionDialog({
//   open,
//   onOpenChange,
//   extendedHours,
//   onExtendTime,
//   onAddCustomTime,
//   onRemoveCustomTime,
//   existingTimeSlots
// }: TimeExtensionDialogProps) {
//   const [customTimeInput, setCustomTimeInput] = useState('')
//   const [error, setError] = useState<string>('')

//   const handleAddCustomTime = () => {
//     if (!customTimeInput) return

//     // Validate time format
//     const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/
//     if (!timeRegex.test(customTimeInput)) {
//       setError('Please enter a valid time in HH:MM format (24-hour)')
//       return
//     }

//     // Check if time already exists
//     if (existingTimeSlots.includes(customTimeInput)) {
//       setError('This time slot already exists')
//       return
//     }

//     onAddCustomTime(customTimeInput)
//     setCustomTimeInput('')
//     setError('')
//   }

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleAddCustomTime()
//     }
//   }

//   const presets = [
//     {
//       label: 'Morning (5:00 - 8:00)',
//       description: 'Early morning hours for exercise, meditation, or study',
//       type: 'morning' as const,
//       icon: Sun,
//       color: 'text-yellow-600 bg-yellow-100'
//     },
//     {
//       label: 'Evening (18:00 - 22:00)',
//       description: 'After-work hours for hobbies, family time, or projects',
//       type: 'evening' as const,
//       icon: Clock,
//       color: 'text-orange-600 bg-orange-100'
//     },
//     {
//       label: 'Night (22:00 - 00:00)',
//       description: 'Late night hours for deep work or relaxation',
//       type: 'night' as const,
//       icon: Moon,
//       color: 'text-purple-600 bg-purple-100'
//     }
//   ]

//   const quickAddTimes = ['05:00', '06:00', '07:00', '19:00', '20:00', '21:00', '22:00', '23:00']

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Extend Timetable Hours</DialogTitle>
//           <DialogDescription>
//             Add more time slots to your schedule for better planning
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-6 py-4">
//           {/* Preset Time Extensions */}
//           <div className="space-y-4">
//             <h3 className="font-medium">Preset Extensions</h3>
//             <div className="space-y-3">
//               {presets.map((preset) => (
//                 <div
//                   key={preset.type}
//                   className="p-3 rounded-lg border border-gray-200 flex items-center justify-between"
//                 >
//                   <div className="flex items-start gap-3">
//                     <div className={`p-2 rounded-lg ${preset.color}`}>
//                       <preset.icon className="w-4 h-4" />
//                     </div>
//                     <div>
//                       <div className="font-medium">{preset.label}</div>
//                       <div className="text-sm text-gray-600">{preset.description}</div>
//                     </div>
//                   </div>
//                   <Switch
//                     checked={extendedHours[preset.type]}
//                     onCheckedChange={() => onExtendTime(preset.type)}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Custom Time Slots */}
//           <div className="space-y-4">
//             <h3 className="font-medium">Custom Time Slots</h3>
            
//             <div className="space-y-3">
//               <div className="flex gap-2">
//                 <Input
//                   placeholder="HH:MM (24-hour format)"
//                   value={customTimeInput}
//                   onChange={(e) => {
//                     setCustomTimeInput(e.target.value)
//                     setError('')
//                   }}
//                   onKeyPress={handleKeyPress}
//                   className="flex-1"
//                 />
//                 <Button onClick={handleAddCustomTime}>
//                   <Plus className="w-4 h-4" />
//                 </Button>
//               </div>
              
//               {error && (
//                 <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
//                   <AlertCircle className="w-4 h-4" />
//                   {error}
//                 </div>
//               )}

//               <div>
//                 <div className="text-sm text-gray-600 mb-2">Quick add:</div>
//                 <div className="flex flex-wrap gap-2">
//                   {quickAddTimes.map((time) => (
//                     <Badge
//                       key={time}
//                       variant="outline"
//                       className="cursor-pointer hover:bg-gray-100"
//                       onClick={() => {
//                         if (!existingTimeSlots.includes(time)) {
//                           onAddCustomTime(time)
//                         }
//                       }}
//                     >
//                       {time}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>

//               {/* Existing custom slots */}
//               {extendedHours.custom.length > 0 && (
//                 <div className="mt-4">
//                   <div className="text-sm text-gray-600 mb-2">Your custom slots:</div>
//                   <div className="flex flex-wrap gap-2">
//                     {extendedHours.custom.map((time) => (
//                       <Badge
//                         key={time}
//                         variant="secondary"
//                         className="flex items-center gap-1"
//                       >
//                         <Clock className="w-3 h-3" />
//                         {time}
//                         <button
//                           onClick={() => onRemoveCustomTime(time)}
//                           className="ml-1 hover:text-red-600"
//                         >
//                           <X className="w-3 h-3" />
//                         </button>
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Current Time Range Preview */}
//           <div className="p-3 bg-gray-50 rounded-lg">
//             <h4 className="font-medium mb-2">Current Time Range</h4>
//             <div className="text-sm text-gray-600">
//               <p>From: {extendedHours.morning ? '5:00 AM' : '8:00 AM'}</p>
//               <p>To: {
//                 extendedHours.night ? '12:00 AM' :
//                 extendedHours.evening ? '10:00 PM' : '6:00 PM'
//               }</p>
//               <p className="mt-1">Total time slots: {existingTimeSlots.length}</p>
//             </div>
//           </div>
//         </div>

//         <DialogFooter>
//           <Button
//             variant="outline"
//             onClick={() => onOpenChange(false)}
//           >
//             Cancel
//           </Button>
//           <Button onClick={() => onOpenChange(false)}>
//             Apply Changes
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }