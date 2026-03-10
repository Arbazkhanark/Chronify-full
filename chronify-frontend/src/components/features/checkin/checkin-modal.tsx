// src/components/features/daily-checkin/checkin-modal.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  X, 
  Calendar, 
  Clock, 
  Star, 
  TrendingUp,
  Smile,
  Meh,
  Frown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'

interface DailyCheckinModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  timeSlots: any[]
}

export function DailyCheckinModal({ isOpen, onClose, onSubmit, timeSlots }: DailyCheckinModalProps) {
  const [completedSlots, setCompletedSlots] = useState<string[]>([])
  const [mood, setMood] = useState<string>('')
  const [productivity, setProductivity] = useState(7)
  const [notes, setNotes] = useState('')

  const moods = [
    { id: 'HAPPY', icon: Smile, label: 'Happy', color: 'text-green-500' },
    { id: 'NEUTRAL', icon: Meh, label: 'Neutral', color: 'text-yellow-500' },
    { id: 'STRESSED', icon: Frown, label: 'Stressed', color: 'text-red-500' },
  ]

  const handleSubmit = () => {
    onSubmit({
      completedSlots,
      mood,
      productivity,
      notes,
      date: new Date(),
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Daily Check-in 📝</h2>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Time Slots Checkboxes */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-primary" />
              <h3 className="font-medium">Today's Schedule</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                {completedSlots.length}/{timeSlots.length} completed
              </span>
            </div>
            
            <div className="space-y-3">
              {timeSlots.map((slot, index) => (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl border border-border hover:border-primary/30 transition-colors"
                >
                  <button
                    onClick={() => {
                      if (completedSlots.includes(slot.id)) {
                        setCompletedSlots(completedSlots.filter(id => id !== slot.id))
                      } else {
                        setCompletedSlots([...completedSlots, slot.id])
                      }
                    }}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      completedSlots.includes(slot.id)
                        ? 'border-green-500 bg-green-500'
                        : 'border-muted-foreground/30 hover:border-primary'
                    }`}
                  >
                    {completedSlots.includes(slot.id) && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{slot.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {slot.startTime} - {slot.endTime} • {slot.subject}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        slot.priority === 'HIGH' 
                          ? 'bg-red-500/20 text-red-500'
                          : slot.priority === 'MEDIUM'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-blue-500/20 text-blue-500'
                      }`}>
                        {slot.priority}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mood Selector */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Smile className="w-4 h-4 text-primary" />
              <h3 className="font-medium">How are you feeling today?</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {moods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMood(m.id)}
                  className={`p-4 rounded-xl border transition-all ${
                    mood === m.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <m.icon className={`w-8 h-8 ${m.color}`} />
                    <div className="font-medium">{m.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Productivity Slider */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h3 className="font-medium">Productivity Score</h3>
              </div>
              <div className="text-2xl font-bold text-primary">
                {productivity}/10
              </div>
            </div>
            
            <Slider
              value={[productivity]}
              onValueChange={([value]) => setProductivity(value)}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Low Energy</span>
              <span>Perfect Day!</span>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-primary" />
              <h3 className="font-medium">Today's Notes</h3>
            </div>
            
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="What did you learn today? Any challenges? Tomorrow's plan..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Skip for Today
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 gap-2"
              disabled={completedSlots.length === 0}
            >
              <CheckCircle className="w-4 h-4" />
              Submit Check-in
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}