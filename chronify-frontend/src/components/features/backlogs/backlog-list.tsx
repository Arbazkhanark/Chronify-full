// src/components/features/backlogs/backlog-list.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bookmark, 
  Clock, 
  Calendar,
  Target,
  ArrowRight,
  Edit2,
  Trash2,
  MoreVertical,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Backlog {
  id: string
  title: string
  description?: string
  subject?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  estimatedDuration?: number
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  addedAt: Date
  targetDate?: Date
}

interface BacklogListProps {
  backlogs: Backlog[]
  onConvert: (backlog: Backlog) => void
  onEdit: (backlog: Backlog) => void
  onDelete: (id: string) => void
}

export function BacklogList({ backlogs, onConvert, onEdit, onDelete }: BacklogListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-500 text-white'
      case 'HIGH': return 'bg-orange-500 text-white'
      case 'MEDIUM': return 'bg-yellow-500 text-white'
      case 'LOW': return 'bg-blue-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500/20 text-green-500'
      case 'IN_PROGRESS': return 'bg-blue-500/20 text-blue-500'
      default: return 'bg-gray-500/20 text-gray-500'
    }
  }

  const isOverdue = (targetDate?: Date) => {
    if (!targetDate) return false
    return new Date(targetDate) < new Date()
  }

  return (
    <div className="space-y-3">
      {backlogs.map((backlog, index) => (
        <motion.div
          key={backlog.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors group"
        >
          <div className="p-4">
            <div className="flex items-start justify-between gap-4">
              {/* Left side - Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Bookmark className="w-4 h-4 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{backlog.title}</h3>
                      <span className={cn(
                        "px-2 py-0.5 text-xs font-medium rounded-full",
                        getPriorityColor(backlog.priority)
                      )}>
                        {backlog.priority}
                      </span>
                    </div>
                    
                    {backlog.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {backlog.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-wrap items-center gap-4 text-sm ml-11">
                  {backlog.subject && (
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{backlog.subject}</span>
                    </div>
                  )}
                  
                  {backlog.estimatedDuration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{backlog.estimatedDuration}m</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Added {backlog.addedAt.toLocaleDateString()}
                    </span>
                  </div>
                  
                  {backlog.targetDate && (
                    <div className={cn(
                      "flex items-center gap-1",
                      isOverdue(backlog.targetDate) && "text-red-500"
                    )}>
                      <AlertCircle className="w-3 h-3" />
                      <span>
                        Due {backlog.targetDate.toLocaleDateString()}
                        {isOverdue(backlog.targetDate) && ' (Overdue)'}
                      </span>
                    </div>
                  )}
                  
                  <div className={cn(
                    "px-2 py-0.5 text-xs font-medium rounded-full",
                    getStatusColor(backlog.status)
                  )}>
                    {backlog.status}
                  </div>
                </div>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onConvert(backlog)}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium flex items-center gap-2"
                  title="Convert to Task"
                >
                  <ArrowRight className="w-3 h-3" />
                  Convert
                </button>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(backlog)}
                    className="p-1.5 hover:bg-secondary rounded-lg"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(backlog.id)}
                    className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 hover:bg-secondary rounded-lg">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expandable content */}
            {expandedId === backlog.id && backlog.description && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-border"
              >
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {backlog.description}
                </p>
              </motion.div>
            )}
          </div>

          {/* Progress bar (for IN_PROGRESS) */}
          {backlog.status === 'IN_PROGRESS' && (
            <div className="h-1 bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '30%' }}
                className="h-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
          )}
          
          {backlog.status === 'COMPLETED' && (
            <div className="h-1 bg-green-500" />
          )}
        </motion.div>
      ))}

      {/* Empty state */}
      {backlogs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 border-2 border-dashed border-border rounded-xl"
        >
          <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No backlogs yet</h3>
          <p className="text-muted-foreground mb-4">
            Add tasks you want to do later to your backlog
          </p>
        </motion.div>
      )}
    </div>
  )
}