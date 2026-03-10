// src/app/dashboard/timetable/ai-generator/page.tsx
'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  Calendar, 
  Clock, 
  Target, 
  Settings,
  Download,
  Printer,
  Copy,
  RefreshCw,
  Sparkles,
  Brain,
  FileText,
  Image as ImageIcon,
  Upload,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AITimetableGenerator } from '@/lib/ai/timetable-generator'
import { GeneratedTimetable } from '@/components/features/timetable/generated-timetable'
import { toast } from 'sonner'

export default function AITimetableGeneratorPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [generatedTimetable, setGeneratedTimetable] = useState<any>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    description: '',
    studyGoals: '',
    currentSchedule: '',
    
    // Step 2: Time Constraints
    wakeUpTime: '06:30',
    sleepTime: '23:00',
    studyHoursPerDay: 6,
    studyIntensity: 'MEDIUM' as 'LIGHT' | 'MEDIUM' | 'HARD' | 'EXTREME',
    
    // Step 3: Fixed Commitments
    hasCollege: true,
    collegeStartTime: '09:30',
    collegeEndTime: '16:45',
    collegeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    hasWeekendsOff: true,
    
    // Step 4: Preferences
    preferredStudyTime: ['Morning', 'Evening'],
    breakFrequency: 45, // minutes
    maxSessionLength: 90, // minutes
    
    // Step 5: Goals
    goals: [
      { title: 'DSA Mastery', priority: 'CRITICAL', targetDate: '2025-03-01', progress: 45 },
      { title: 'AI/ML Basics', priority: 'HIGH', targetDate: '2025-06-01', progress: 20 },
    ]
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
        toast.success('Image uploaded successfully! AI will analyze it.')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    setLoading(true)
    
    try {
      // Mock API call - in production, integrate with actual AI service
      const aiRequest = {
        goals: formData.goals.map(g => ({
          ...g,
          targetDate: new Date(g.targetDate),
          subjects: g.title.includes('DSA') ? ['DSA', 'Algorithms'] : ['AI/ML', 'Python']
        })),
        fixedBusyTimes: formData.hasCollege ? [
          {
            dayOfWeek: 1, // Monday
            startTime: formData.collegeStartTime,
            endTime: formData.collegeEndTime,
            title: 'College'
          },
          {
            dayOfWeek: 2, // Tuesday
            startTime: formData.collegeStartTime,
            endTime: formData.collegeEndTime,
            title: 'College'
          },
          {
            dayOfWeek: 3, // Wednesday
            startTime: formData.collegeStartTime,
            endTime: formData.collegeEndTime,
            title: 'College'
          },
          {
            dayOfWeek: 4, // Thursday
            startTime: formData.collegeStartTime,
            endTime: formData.collegeEndTime,
            title: 'College'
          },
          {
            dayOfWeek: 5, // Friday
            startTime: formData.collegeStartTime,
            endTime: formData.collegeEndTime,
            title: 'College'
          }
        ] : [],
        availableHoursPerDay: formData.studyHoursPerDay,
        studyIntensity: formData.studyIntensity,
        preferences: {
          preferredStudyTime: formData.preferredStudyTime,
          breakFrequency: formData.breakFrequency,
          maxSessionLength: formData.maxSessionLength
        }
      }

      const response = await AITimetableGenerator.generate(aiRequest)
      
      setGeneratedTimetable({
        ...response,
        userInput: formData.description,
        generatedAt: new Date(),
        settings: formData
      })
      
      setStep(6) // Go to results step
      toast.success('AI has generated your perfect timetable! 🎉')
    } catch (error) {
      console.error('Error generating timetable:', error)
      toast.error('Failed to generate timetable. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = () => {
    toast.success('Exporting timetable to PDF...')
    // In production: Generate and download PDF
  }

  const handleExportImage = () => {
    toast.success('Exporting timetable as image...')
    // In production: Generate and download image
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(generatedTimetable, null, 2))
    toast.success('Timetable copied to clipboard!')
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Tell AI About Your Schedule</h2>
              <p className="text-muted-foreground">
                Describe your typical day, commitments, and preferences
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="description" className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4" />
                  Describe Your Daily Schedule *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Example: I wake up at 6:30 AM, go to college from 9:30 AM to 4:45 PM, have commute time, and want to study DSA and AI/ML in the remaining time..."
                  rows={4}
                  className="resize-none"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Be as detailed as possible for better results
                </p>
              </div>

              <div>
                <Label htmlFor="studyGoals" className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4" />
                  Study Goals & Priorities
                </Label>
                <Textarea
                  id="studyGoals"
                  value={formData.studyGoals}
                  onChange={e => setFormData({...formData, studyGoals: e.target.value})}
                  placeholder="Example: I need to complete DSA in 3 months (high priority), learn AI/ML basics in 6 months (medium priority), and work on projects (low priority)..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <ImageIcon className="w-4 h-4" />
                  Upload College/School Timetable (Optional)
                </Label>
                <div 
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">
                    Upload image of your timetable for AI analysis
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports JPG, PNG, PDF formats
                  </p>
                </div>
                {uploadedImage && (
                  <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Image uploaded successfully</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-2">Time Constraints ⏰</h2>
            <p className="text-muted-foreground mb-6">
              Set your daily time boundaries
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="wakeUpTime">Wake Up Time</Label>
                <Input
                  id="wakeUpTime"
                  type="time"
                  value={formData.wakeUpTime}
                  onChange={e => setFormData({...formData, wakeUpTime: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="sleepTime">Sleep Time</Label>
                <Input
                  id="sleepTime"
                  type="time"
                  value={formData.sleepTime}
                  onChange={e => setFormData({...formData, sleepTime: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="studyHoursPerDay">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Study Hours Per Day
                  </div>
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="studyHoursPerDay"
                    type="range"
                    min="2"
                    max="10"
                    step="0.5"
                    value={formData.studyHoursPerDay}
                    onChange={e => setFormData({...formData, studyHoursPerDay: parseFloat(e.target.value)})}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold min-w-12">
                    {formData.studyHoursPerDay}h
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Light (2h)</span>
                  <span>Moderate (6h)</span>
                  <span>Intense (10h)</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="studyIntensity">Study Intensity</Label>
                <Select
                  value={formData.studyIntensity}
                  onValueChange={(value: any) => setFormData({...formData, studyIntensity: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LIGHT">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Light (~2 hours/day)
                      </div>
                    </SelectItem>
                    <SelectItem value="MEDIUM">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        Medium (~4 hours/day)
                      </div>
                    </SelectItem>
                    <SelectItem value="HARD">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        Hard (~6 hours/day)
                      </div>
                    </SelectItem>
                    <SelectItem value="EXTREME">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        Extreme (Exam mode)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-2">Fixed Commitments 🏫</h2>
            <p className="text-muted-foreground mb-6">
              Tell AI about your college, work, or other fixed commitments
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="hasCollege"
                  checked={formData.hasCollege}
                  onChange={e => setFormData({...formData, hasCollege: e.target.checked})}
                  className="w-4 h-4 rounded"
                />
                <Label htmlFor="hasCollege" className="cursor-pointer">
                  I have college/school/work during the day
                </Label>
              </div>

              {formData.hasCollege && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-secondary/30 border border-border">
                  <div className="space-y-3">
                    <Label htmlFor="collegeStartTime">Start Time</Label>
                    <Input
                      id="collegeStartTime"
                      type="time"
                      value={formData.collegeStartTime}
                      onChange={e => setFormData({...formData, collegeStartTime: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="collegeEndTime">End Time</Label>
                    <Input
                      id="collegeEndTime"
                      type="time"
                      value={formData.collegeEndTime}
                      onChange={e => setFormData({...formData, collegeEndTime: e.target.value})}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label className="mb-2 block">College Days</Label>
                    <div className="flex flex-wrap gap-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            const days = [...formData.collegeDays]
                            if (days.includes(day)) {
                              setFormData({
                                ...formData,
                                collegeDays: days.filter(d => d !== day)
                              })
                            } else {
                              setFormData({
                                ...formData,
                                collegeDays: [...days, day]
                              })
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            formData.collegeDays.includes(day)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="hasWeekendsOff"
                      checked={formData.hasWeekendsOff}
                      onChange={e => setFormData({...formData, hasWeekendsOff: e.target.checked})}
                      className="w-4 h-4 rounded"
                    />
                    <Label htmlFor="hasWeekendsOff" className="cursor-pointer">
                      Weekends off
                    </Label>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-600 mb-1">AI Tip</h4>
                    <p className="text-sm text-blue-500/80">
                      AI will automatically avoid scheduling study sessions during your fixed commitments.
                      You can also add commute times and other activities in the description.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-2">Study Preferences 📝</h2>
            <p className="text-muted-foreground mb-6">
              Customize how AI should schedule your study sessions
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Preferred Study Time</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'Morning', label: '🌅 Morning', desc: '6 AM - 12 PM' },
                    { id: 'Afternoon', label: '☀️ Afternoon', desc: '12 PM - 5 PM' },
                    { id: 'Evening', label: '🌆 Evening', desc: '5 PM - 10 PM' },
                    { id: 'Night', label: '🌙 Night', desc: '10 PM - 2 AM' },
                  ].map(time => (
                    <button
                      key={time.id}
                      type="button"
                      onClick={() => {
                        const times = [...formData.preferredStudyTime]
                        if (times.includes(time.id)) {
                          setFormData({
                            ...formData,
                            preferredStudyTime: times.filter(t => t !== time.id)
                          })
                        } else {
                          setFormData({
                            ...formData,
                            preferredStudyTime: [...times, time.id]
                          })
                        }
                      }}
                      className={`flex-1 min-w-[140px] p-3 rounded-xl border text-left transition-all ${
                        formData.preferredStudyTime.includes(time.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div className="font-medium">{time.label}</div>
                      <div className="text-xs text-muted-foreground">{time.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="breakFrequency">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Break Frequency (minutes)
                    </div>
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="breakFrequency"
                      type="range"
                      min="15"
                      max="120"
                      step="15"
                      value={formData.breakFrequency}
                      onChange={e => setFormData({...formData, breakFrequency: parseInt(e.target.value)})}
                      className="flex-1"
                    />
                    <span className="text-lg font-bold min-w-12">
                      {formData.breakFrequency}m
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Short (15m)</span>
                    <span>Optimal (45m)</span>
                    <span>Long (120m)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="maxSessionLength">
                    Maximum Study Session Length
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="maxSessionLength"
                      type="range"
                      min="30"
                      max="180"
                      step="15"
                      value={formData.maxSessionLength}
                      onChange={e => setFormData({...formData, maxSessionLength: parseInt(e.target.value)})}
                      className="flex-1"
                    />
                    <span className="text-lg font-bold min-w-12">
                      {formData.maxSessionLength}m
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Short (30m)</span>
                    <span>Optimal (90m)</span>
                    <span>Long (180m)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-border">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-600 mb-1">AI Power Features</h4>
                  <ul className="text-sm text-green-500/80 space-y-1">
                    <li>• Smart scheduling based on your energy levels</li>
                    <li>• Priority-based time allocation for goals</li>
                    <li>• Optimal break timing for maximum retention</li>
                    <li>• Subject rotation to prevent burnout</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-2">Goals Review 🎯</h2>
            <p className="text-muted-foreground mb-6">
              AI will prioritize your time based on these goals
            </p>

            <div className="space-y-4">
              {formData.goals.map((goal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        goal.priority === 'CRITICAL' ? 'bg-red-500/10' :
                        goal.priority === 'HIGH' ? 'bg-orange-500/10' :
                        goal.priority === 'MEDIUM' ? 'bg-yellow-500/10' :
                        'bg-blue-500/10'
                      }`}>
                        <Target className={`w-4 h-4 ${
                          goal.priority === 'CRITICAL' ? 'text-red-500' :
                          goal.priority === 'HIGH' ? 'text-orange-500' :
                          goal.priority === 'MEDIUM' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-medium">{goal.title}</h3>
                        <div className="text-sm text-muted-foreground">
                          Target: {new Date(goal.targetDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        goal.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-500' :
                        goal.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-500' :
                        goal.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-blue-500/20 text-blue-500'
                      }`}>
                        {goal.priority} Priority
                      </span>
                      <span className="text-lg font-bold">{goal.progress}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      className={`h-full rounded-full ${
                        goal.priority === 'CRITICAL' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                        goal.priority === 'HIGH' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                        goal.priority === 'MEDIUM' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-blue-500 to-cyan-500'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-border">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-600 mb-1">AI Allocation Strategy</h4>
                  <p className="text-sm text-purple-500/80 mb-2">
                    Based on your goals, AI will allocate time proportionally:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { subject: 'DSA', allocation: '40%', color: 'bg-red-500' },
                      { subject: 'AI/ML', allocation: '30%', color: 'bg-orange-500' },
                      { subject: 'College', allocation: '20%', color: 'bg-blue-500' },
                      { subject: 'Projects', allocation: '10%', color: 'bg-green-500' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-sm">{item.subject}</span>
                        </div>
                        <span className="font-medium">{item.allocation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Timetable Generated! 🎉</h2>
              <p className="text-muted-foreground">
                AI has created your optimized study schedule
              </p>
            </div>

            {generatedTimetable && (
              <>
                <GeneratedTimetable 
                  timetable={generatedTimetable}
                  onEdit={() => setStep(1)}
                  onRegenerate={handleGenerate}
                />

                {/* Export Options */}
                <div className="p-6 rounded-xl bg-gradient-to-b from-card to-background border border-border">
                  <h3 className="text-lg font-bold mb-4">Export & Share</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button
                      onClick={handleExportPDF}
                      variant="outline"
                      className="flex flex-col items-center justify-center h-24 gap-2"
                    >
                      <FileText className="w-6 h-6" />
                      <span>PDF</span>
                      <span className="text-xs text-muted-foreground">High Quality</span>
                    </Button>

                    <Button
                      onClick={handleExportImage}
                      variant="outline"
                      className="flex flex-col items-center justify-center h-24 gap-2"
                    >
                      <ImageIcon className="w-6 h-6" />
                      <span>Image</span>
                      <span className="text-xs text-muted-foreground">PNG/JPG</span>
                    </Button>

                    <Button
                      onClick={handleCopyToClipboard}
                      variant="outline"
                      className="flex flex-col items-center justify-center h-24 gap-2"
                    >
                      <Copy className="w-6 h-6" />
                      <span>Copy JSON</span>
                      <span className="text-xs text-muted-foreground">For apps</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="flex flex-col items-center justify-center h-24 gap-2"
                    >
                      <Printer className="w-6 h-6" />
                      <span>Print</span>
                      <span className="text-xs text-muted-foreground">A4/Letter</span>
                    </Button>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Study Hours', value: `${generatedTimetable.summary.totalStudyHours}h` },
                    { label: 'Weekly Sessions', value: generatedTimetable.slots.length },
                    { label: 'Daily Average', value: `${(generatedTimetable.summary.totalStudyHours / 7).toFixed(1)}h` },
                    { label: 'Efficiency Score', value: '92%' },
                  ].map((stat, index) => (
                    <div key={index} className="bg-card border border-border rounded-xl p-4">
                      <div className="text-2xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI Timetable Generator 🧠</h1>
              <p className="text-muted-foreground">
                Let AI create your perfect study schedule based on your goals and constraints
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5, 6].map(s => (
              <div key={s} className="flex flex-col items-center relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                  step >= s 
                    ? 'bg-gradient-to-r from-primary to-accent text-white' 
                    : 'bg-secondary text-muted-foreground'
                }`}>
                  {s === 1 && '🎯'}
                  {s === 2 && '⏰'}
                  {s === 3 && '🏫'}
                  {s === 4 && '📝'}
                  {s === 5 && '🎯'}
                  {s === 6 && '✨'}
                </div>
                <div className={`text-sm font-medium ${
                  step >= s ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {s === 1 && 'Description'}
                  {s === 2 && 'Time'}
                  {s === 3 && 'Commitments'}
                  {s === 4 && 'Preferences'}
                  {s === 5 && 'Goals'}
                  {s === 6 && 'Results'}
                </div>
                {s < 6 && (
                  <div className="absolute top-5 left-full w-16 h-0.5 -translate-x-8">
                    <div className={`h-full ${
                      step > s 
                        ? 'bg-gradient-to-r from-primary to-accent' 
                        : 'bg-secondary'
                    }`} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              Step {step} of 6
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <div>
            {step > 1 && step < 6 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                ← Back
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {step < 5 && (
              <Button
                onClick={() => setStep(step + 1)}
                className="gap-2"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}

            {step === 5 && (
              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="gap-2 bg-gradient-to-r from-primary to-accent"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AI is thinking...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Timetable
                  </>
                )}
              </Button>
            )}

            {step === 6 && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Start Over
                </Button>
                <Button
                  onClick={handleGenerate}
                  className="gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Regenerate
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <span className="text-primary text-sm">💡</span>
            </div>
            <div>
              <div className="font-medium text-sm mb-1">AI Timetable Features</div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• <strong>Smart Scheduling:</strong> AI analyzes your energy patterns and preferences</li>
                <li>• <strong>Goal Prioritization:</strong> Allocates time based on goal priority and deadlines</li>
                <li>• <strong>Image Analysis:</strong> Upload timetable images for AI to extract schedule</li>
                <li>• <strong>Export Options:</strong> Download as PDF, Image, or copy to clipboard</li>
                <li>• <strong>Real-time Adjustments:</strong> Regenerate with different parameters</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}