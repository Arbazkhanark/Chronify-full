// src/app/dashboard/timetable/builder/Part3_FixedCommitments.tsx
import { motion } from 'framer-motion'
import { Clock, Coffee, MoreVertical, Edit2, Trash2, Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface FixedTime {
  id: string
  title: string
  description?: string
  days: string[]
  startTime: string
  endTime: string
  type: 'college' | 'office' | 'school' | 'commute' | 'free' | 'meeting' | 'workout' | 'meal' | 'entertainment' | 'family' | 'other' | 'sleep'
  color?: string
  freePeriods?: {
    id: string
    title: string
    startTime: string
    endTime: string
    duration: number
    day: string
  }[]
}

interface FixedCommitmentsPartProps {
  fixedTimes: FixedTime[]
  setShowAddFixedTimeModal: (show: boolean) => void
  handleFixedTimeClick: (fixedTime: FixedTime) => void
  handleEditFixedTime: (fixedTime: FixedTime) => void
  handleDeleteFixedTime: (id: string) => void
  setSelectedFixedTimeForFreePeriod: (fixedTime: FixedTime | null) => void
  setNewFreePeriod: (period: any) => void
  setShowAddFreePeriodModal: (show: boolean) => void
  getTimeSlotColor: (type: string) => string
  getIconByType: (type: string) => JSX.Element
  formatTimeDisplay: (time: string) => string
}

export function FixedCommitmentsPart({
  fixedTimes,
  setShowAddFixedTimeModal,
  handleFixedTimeClick,
  handleEditFixedTime,
  handleDeleteFixedTime,
  setSelectedFixedTimeForFreePeriod,
  setNewFreePeriod,
  setShowAddFreePeriodModal,
  getTimeSlotColor,
  getIconByType,
  formatTimeDisplay
}: FixedCommitmentsPartProps) {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-200 mb-2">Fixed Commitments</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add your regular commitments (college, office, gym, etc.) to mark them as unavailable. 
              You can add free periods within these commitments for scheduling tasks.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
              {fixedTimes.length} commitments
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAddFixedTimeModal(true)}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Fixed Commitment
            </Button>
          </div>
        </div>
        
        {fixedTimes.length === 0 ? (
          <div className="text-center py-12 px-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-2">No Fixed Commitments Added</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Add your regular schedule items like college hours, office time, gym sessions, etc. 
              These will be marked as unavailable for scheduling tasks.
            </p>
            <Button 
              onClick={() => setShowAddFixedTimeModal(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Your First Fixed Commitment
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {fixedTimes.map((ft, index) => (
              <motion.div
                key={ft.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border ${getTimeSlotColor(ft.type)} cursor-pointer hover:shadow-md transition-shadow`}
                onClick={() => handleFixedTimeClick(ft)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${ft.color}20` }}
                    >
                      {getIconByType(ft.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium dark:text-gray-200 mb-1">{ft.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {ft.days.join(', ')} • {formatTimeDisplay(ft.startTime)} - {formatTimeDisplay(ft.endTime)}
                      </div>
                      {ft.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{ft.description}</p>
                      )}
                      {(ft.freePeriods && ft.freePeriods.length > 0) && (
                        <div className="mt-2">
                          <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/30 text-xs">
                            <Coffee className="w-2.5 h-2.5 mr-1" />
                            {ft.freePeriods.length} free period{ft.freePeriods.length > 1 ? 's' : ''}
                          </Badge>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Days: {[...new Set(ft.freePeriods.map(fp => fp.day))].join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 dark:bg-gray-800 dark:border-gray-700">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedFixedTimeForFreePeriod(ft)
                          setNewFreePeriod({
                            title: 'Free Period',
                            startTime: '14:00',
                            endTime: '15:00',
                            duration: 60,
                            day: ft.days[0] || 'Mon'
                          })
                          setShowAddFreePeriodModal(true)
                        }}
                        className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <Coffee className="w-4 h-4" />
                        Add Free Period
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditFixedTime(ft)
                        }}
                        className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Commitment
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="dark:bg-gray-700" />
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteFixedTime(ft.id)
                        }}
                        className="gap-2 text-red-600 focus:text-red-600 dark:text-red-400 dark:hover:bg-gray-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
            
            {/* Add Fixed Commitment Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: fixedTimes.length * 0.1 }}
              className="p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
              onClick={() => setShowAddFixedTimeModal(true)}
            >
              <div className="flex flex-col items-center justify-center h-full py-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                  <Plus className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-1">Add Fixed Commitment</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Add college hours, office time, gym sessions, etc.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}