// // src/app/dashboard/timetable/builder/Part1_Header.tsx
// import { motion } from 'framer-motion'
// import { 
//   FileText, Download, Printer, Share2, Target, Bed, Settings, 
//   PlusCircle, EyeOff, Eye, Lock, Unlock, Grid, Rows, Moon, Sun,
//   Clock,
//   CheckCircle2,
//   Columns
// } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'

// interface HeaderProps {
//   userType: 'student' | 'professional' | 'jobseeker' | 'other'
//   isLocked: boolean
//   darkMode: boolean
//   viewMode: 'grid' | 'list' | 'pdf'
//   timeSettings: any
//   timeSlots: string[]
//   isExtendedTime: (time: string) => boolean
//   setViewMode: (mode: 'grid' | 'list' | 'pdf') => void
//   setTimeSettings: (settings: any) => void
//   setShowGoalsModal: (show: boolean) => void
//   setShowSleepScheduleModal: (show: boolean) => void
//   setShowTimeSettingsModal: (show: boolean) => void
//   setShowTimeExtensionModal: (show: boolean) => void
//   toggleWeekends: () => void
//   toggleDarkMode: () => void
//   handleLockTimetable: () => void
//   handleUnlockTimetable: () => void
//   handleExportPDF: () => void
//   handlePrint: () => void
//   handleShare: () => void
// }

// export function HeaderPart({
//   userType,
//   isLocked,
//   darkMode,
//   viewMode,
//   timeSettings,
//   timeSlots,
//   isExtendedTime,
//   setViewMode,
//   setTimeSettings,
//   setShowGoalsModal,
//   setShowSleepScheduleModal,
//   setShowTimeSettingsModal,
//   setShowTimeExtensionModal,
//   toggleWeekends,
//   toggleDarkMode,
//   handleLockTimetable,
//   handleUnlockTimetable,
//   handleExportPDF,
//   handlePrint,
//   handleShare
// }: HeaderProps) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8"
//     >
//       <div>
//         <div className="flex items-center gap-3 mb-2">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Timetable Builder</h1>
//           <Badge variant="outline" className="capitalize dark:border-gray-700 dark:text-gray-300">
//             {userType}
//           </Badge>
//           {isLocked && (
//             <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
//               <Lock className="w-3 h-3 mr-1" />
//               Locked
//             </Badge>
//           )}
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={toggleDarkMode}
//             className="h-8 w-8"
//           >
//             {darkMode ? (
//               <Sun className="h-4 w-4" />
//             ) : (
//               <Moon className="h-4 w-4" />
//             )}
//           </Button>
//         </div>
//         <p className="text-gray-600 dark:text-gray-400">
//           {timeSettings.displayMode === 'vertical' 
//             ? 'Weekdays as columns, time as rows' 
//             : 'Weekdays as rows, time as columns'}
//           {timeSlots.some(isExtendedTime) && (
//             <span className="ml-2 text-yellow-600 dark:text-yellow-400 font-medium">
//               • Extended hours enabled
//             </span>
//           )}
//           {timeSettings.showSleepBlocks && (
//             <span className="ml-2 text-gray-600 dark:text-gray-400 font-medium">
//               • Sleep schedule active
//             </span>
//           )}
//         </p>
//       </div>
      
//       <div className="flex flex-wrap gap-3">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
//               <FileText className="w-4 h-4" />
//               Export
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
//             <DropdownMenuItem onClick={() => setViewMode('pdf')} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
//               <FileText className="w-4 h-4" />
//               View as PDF
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={handleExportPDF} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
//               <Download className="w-4 h-4" />
//               Download PDF
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={handlePrint} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
//               <Printer className="w-4 h-4" />
//               Print
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={handleShare} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
//               <Share2 className="w-4 h-4" />
//               Share
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
        
//         <Button 
//           variant="outline" 
//           className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
//           onClick={() => setShowGoalsModal(true)}
//         >
//           <Target className="w-4 h-4" />
//           Schedule Goals
//         </Button>
        
//         <Button 
//           variant="outline" 
//           className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
//           onClick={() => setShowSleepScheduleModal(true)}
//         >
//           <Bed className="w-4 h-4" />
//           Sleep Schedule
//         </Button>
        
//         <Button 
//           variant="outline" 
//           className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
//           onClick={() => setShowTimeSettingsModal(true)}
//         >
//           <Settings className="w-4 h-4" />
//           Display Settings
//         </Button>
        
//         <Button 
//           variant="outline" 
//           className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
//           onClick={() => setShowTimeExtensionModal(true)}
//         >
//           <PlusCircle className="w-4 h-4" />
//           Extend Time
//         </Button>
        
//         <Button 
//           variant="outline" 
//           className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
//           onClick={toggleWeekends}
//         >
//           {timeSettings.showWeekends ? (
//             <>
//               <EyeOff className="w-4 h-4" />
//               Hide Weekends
//             </>
//           ) : (
//             <>
//               <Eye className="w-4 h-4" />
//               Show Weekends
//             </>
//           )}
//         </Button>
        
//         <Button 
//           onClick={isLocked ? handleUnlockTimetable : handleLockTimetable}
//           className={`gap-2 ${isLocked ? 'bg-green-600 hover:bg-green-700' : ''}`}
//         >
//           {isLocked ? (
//             <>
//               <Unlock className="w-4 h-4" />
//               Unlock
//             </>
//           ) : (
//             <>
//               <Lock className="w-4 h-4" />
//               Lock Timetable
//             </>
//           )}
//         </Button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 w-full mt-4">
//         {[
//           { label: 'Total Hours', value: '0.0h', icon: Clock, iconBg: 'bg-gray-100 dark:bg-gray-800', iconColor: 'text-gray-700 dark:text-gray-300' },
//           { label: 'Tasks Planned', value: '0', icon: Grid, iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400' },
//           { label: 'Goals Scheduled', value: '0/2', icon: Target, iconBg: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600 dark:text-green-400' },
//           { label: 'Milestones', value: '0/7', icon: CheckCircle2, iconBg: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400' },
//           { label: 'Sleep Hours', value: '58.0h', icon: Moon, iconBg: 'bg-gray-100 dark:bg-gray-800', iconColor: 'text-gray-700 dark:text-gray-300' },
//           { label: 'Avg Sleep', value: '8.3h', icon: Bed, iconBg: 'bg-indigo-100 dark:bg-indigo-900/30', iconColor: 'text-indigo-600 dark:text-indigo-400' },
//           { label: 'Fixed Commitments', value: '0', icon: Clock, iconBg: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400' },
//         ].map((stat, index) => (
//           <motion.div
//             key={stat.label}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//             whileHover={{ scale: 1.02 }}
//             className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
//           >
//             <div className="flex items-center gap-3">
//               <div className={`p-2 rounded-lg ${stat.iconBg}`}>
//                 <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
//               </div>
//               <div>
//                 <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
//                 <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* View Mode Tabs */}
//       <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-lg border dark:border-gray-700 w-full">
//         <div className="flex items-center gap-4">
//           <Button
//             variant={viewMode === 'grid' ? "default" : "outline"}
//             onClick={() => setViewMode('grid')}
//             className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//           >
//             <Grid className="w-4 h-4" />
//             Grid View
//           </Button>
//           <Button
//             variant={viewMode === 'pdf' ? "default" : "outline"}
//             onClick={() => setViewMode('pdf')}
//             className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//           >
//             <FileText className="w-4 h-4" />
//             PDF Preview
//           </Button>
//         </div>
        
//         <div className="flex items-center gap-3">
//           <Button
//             variant={timeSettings.displayMode === 'vertical' ? "default" : "outline"}
//             onClick={() => setTimeSettings({...timeSettings, displayMode: 'vertical'})}
//             className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//           >
//             <Columns className="w-4 h-4" />
//             Vertical
//           </Button>
//           <Button
//             variant={timeSettings.displayMode === 'horizontal' ? "default" : "outline"}
//             onClick={() => setTimeSettings({...timeSettings, displayMode: 'horizontal'})}
//             className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//           >
//             <Rows className="w-4 h-4" />
//             Horizontal
//           </Button>
//         </div>
//       </div>
//     </motion.div>
//   )
// }













// src/app/dashboard/timetable/builder/Part1_Header.tsx
import { motion } from 'framer-motion'
import { 
  FileText, Download, Printer, Share2, Target, Bed, Settings, 
  PlusCircle, EyeOff, Eye, Lock, Unlock, Grid, Rows, Moon, Sun,
  Clock,
  CheckCircle2,
  Columns
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface HeaderProps {
  userType: 'student' | 'professional' | 'jobseeker' | 'other'
  isLocked: boolean
  darkMode: boolean
  viewMode: 'grid' | 'list' | 'pdf'
  timeSettings: any
  timeSlots: string[]
  isExtendedTime: (time: string) => boolean
  setViewMode: (mode: 'grid' | 'list' | 'pdf') => void
  setTimeSettings: (settings: any) => void
  setShowGoalsModal: (show: boolean) => void
  setShowSleepScheduleModal: (show: boolean) => void
  setShowTimeSettingsModal: (show: boolean) => void
  setShowTimeExtensionModal: (show: boolean) => void
  toggleWeekends: () => void
  toggleDarkMode: () => void
  handleLockTimetable: () => void
  handleUnlockTimetable: () => void
  handleExportPDF: () => void
  handlePrint: () => void
  handleShare: () => void
  stats: {
    totalHours: string
    tasksPlanned: string
    goalsScheduled: string
    milestones: string
    sleepHours: string
    avgSleep: string
    fixedCommitments: string
  }
}

export function HeaderPart({
  userType,
  isLocked,
  darkMode,
  viewMode,
  timeSettings,
  timeSlots,
  isExtendedTime,
  setViewMode,
  setTimeSettings,
  setShowGoalsModal,
  setShowSleepScheduleModal,
  setShowTimeSettingsModal,
  setShowTimeExtensionModal,
  toggleWeekends,
  toggleDarkMode,
  handleLockTimetable,
  handleUnlockTimetable,
  handleExportPDF,
  handlePrint,
  handleShare,
  stats
}: HeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Top Row - Title and Actions */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Timetable Builder</h1>
          <Badge variant="outline" className="capitalize dark:border-gray-700 dark:text-gray-300">
            {userType}
          </Badge>
          {isLocked && (
            <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
              <Lock className="w-3 h-3 mr-1" />
              Locked
            </Badge>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            className="h-8 w-8"
          >
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                <FileText className="w-4 h-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
              <DropdownMenuItem onClick={() => setViewMode('pdf')} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
                <FileText className="w-4 h-4" />
                View as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
                <Download className="w-4 h-4" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrint} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
                <Printer className="w-4 h-4" />
                Print
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
                <Share2 className="w-4 h-4" />
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={() => setShowGoalsModal(true)}
          >
            <Target className="w-4 h-4" />
            Goals
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={() => setShowSleepScheduleModal(true)}
          >
            <Bed className="w-4 h-4" />
            Sleep
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={() => setShowTimeSettingsModal(true)}
          >
            <Settings className="w-4 h-4" />
            Display
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={() => setShowTimeExtensionModal(true)}
          >
            <PlusCircle className="w-4 h-4" />
            Extend
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={toggleWeekends}
          >
            {timeSettings.showWeekends ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide Weekend
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Show Weekend
              </>
            )}
          </Button>
          
          <Button 
            size="sm"
            onClick={isLocked ? handleUnlockTimetable : handleLockTimetable}
            className={`gap-2 ${isLocked ? 'bg-green-600 hover:bg-green-700' : ''}`}
          >
            {isLocked ? (
              <>
                <Unlock className="w-4 h-4" />
                Unlock
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Lock
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Info Bar */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          {timeSettings.displayMode === 'vertical' 
            ? '📅 Weekdays as columns, time as rows' 
            : '📅 Weekdays as rows, time as columns'}
        </p>
        {timeSlots.some(isExtendedTime) && (
          <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
            ⏰ Extended hours
          </Badge>
        )}
        {timeSettings.showSleepBlocks && (
          <Badge variant="outline" className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">
            😴 Sleep schedule active
          </Badge>
        )}
      </div>

      {/* Stats Cards - Horizontal Scroll on Mobile */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex gap-3 min-w-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 min-w-[120px]"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700">
                <Clock className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats?.totalHours}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Hours</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 min-w-[120px]"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Grid className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats?.tasksPlanned}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Tasks</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 min-w-[120px]"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats?.goalsScheduled}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Goals</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 min-w-[120px]"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats?.milestones}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Milestones</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 min-w-[120px]"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700">
                <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats?.sleepHours}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Sleep</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 min-w-[120px]"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <Bed className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats?.avgSleep}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Avg Sleep</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 min-w-[120px]"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats?.fixedCommitments}67</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Fixed</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-1 rounded-lg border dark:border-gray-700">
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === 'grid' ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="gap-2"
          >
            <Grid className="w-4 h-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'pdf' ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode('pdf')}
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            PDF
          </Button>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant={timeSettings.displayMode === 'vertical' ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeSettings({...timeSettings, displayMode: 'vertical'})}
            className="gap-2"
          >
            <Columns className="w-4 h-4" />
            Vertical
          </Button>
          <Button
            variant={timeSettings.displayMode === 'horizontal' ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeSettings({...timeSettings, displayMode: 'horizontal'})}
            className="gap-2"
          >
            <Rows className="w-4 h-4" />
            Horizontal
          </Button>
        </div>
      </div>
    </motion.div>
  )
}