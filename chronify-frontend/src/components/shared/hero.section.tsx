// src/components/shared/hero.section.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  ArrowRight, Sparkles, ChevronLeft, ChevronRight, Target, Brain,
  Calendar, TrendingUp, BookOpen, Grid, Columns, Layout, Timer,
  CheckSquare, PieChart, Award, School, Bus, Coffee, Moon, Sun,
  Laptop, GraduationCap, Clock,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

/* ============================================================================
   TYPES
   ============================================================================ */

interface CollegeStyleData {
  days: string[]
  periods: Array<{ time: string; period?: string; break?: string }>
  schedule: string[][]
}

interface WeeklyScheduleData {
  days: string[]
  slots: Array<{ time: string; type: string; icon: any }>
  activities: Array<Array<{ task: string; emoji: string }>>
}

interface TimeBreakdownData {
  categories: Array<{ name: string; hours: string; percentage: number; color: string; icon: any }>
  total: string
  stats: Array<{ label: string; value: string; icon: any }>
}

interface KanbanData {
  columns: Array<{
    title: string
    color: string
    tasks: Array<{
      task: string
      time: string
      priority?: string
      type?: string
      progress?: number
      completed?: boolean
    }>
  }>
}

interface PriorityMatrixData {
  quadrants: Array<{
    title: string
    color: string
    tasks: Array<{ task: string; time: string; emoji: string }>
  }>
}

interface TimeBlocksData {
  blocks: Array<{
    time: string
    activity: string
    type: string
    color: string
    duration: string
  }>
}

interface CircularWheelData {
  categories: Array<{ name: string; value: number; color: string; hours: number }>
  total: string
}

type TimetableDesign =
  | { id: 'college-style'; title: string; icon: any; color: string; borderColor: string; description: string; type: string; data: CollegeStyleData }
  | { id: 'weekly-schedule'; title: string; icon: any; color: string; borderColor: string; description: string; type: string; data: WeeklyScheduleData }
  | { id: 'time-breakdown'; title: string; icon: any; color: string; borderColor: string; description: string; type: string; data: TimeBreakdownData }
  | { id: 'kanban'; title: string; icon: any; color: string; borderColor: string; description: string; type: string; data: KanbanData }
  | { id: 'priority-matrix'; title: string; icon: any; color: string; borderColor: string; description: string; type: string; data: PriorityMatrixData }
  | { id: 'time-blocks'; title: string; icon: any; color: string; borderColor: string; description: string; type: string; data: TimeBlocksData }
  | { id: 'circular-wheel'; title: string; icon: any; color: string; borderColor: string; description: string; type: string; data: CircularWheelData }

/* ============================================================================
   DATA
   ============================================================================ */

const timetableDesigns: TimetableDesign[] = [
  {
    id: 'college-style',
    title: 'College TimeTable',
    icon: School,
    color: 'from-blue-500/20 to-indigo-500/20',
    borderColor: 'border-blue-200 dark:border-blue-700',
    description: 'Official college timetable format with subject codes',
    type: 'academic',
    data: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      periods: [
        { time: '9:30-10:25', period: '1' },
        { time: '10:25-11:20', period: '2' },
        { time: '11:20-12:15', period: '3' },
        { time: '12:15-13:10', period: '4' },
        { time: '13:10-14:00', break: 'LUNCH' },
        { time: '14:00-14:55', period: '5' },
        { time: '14:55-15:50', period: '6' },
        { time: '15:50-16:45', period: '7' },
      ],
      schedule: [
        ['CGMS LAB', 'CPUCL', 'CPUCL LAB', 'CPUCL LAB', 'DCCN Lab'],
        ['SHS', 'AN', 'AN', 'AN', 'DCCN'],
        ['ADBMS', 'CGMS', 'ADBMS', 'ADBMS', 'Foreign Language'],
        ['SP', 'ITS', 'SP', 'SP', 'MOS'],
        ['SAP', 'ANK', '', '', 'STATISTICS'],
        ['GS', 'DCCN Lab', '', '', 'Software Eng'],
        ['', 'RJT', '', '', 'Self Study'],
      ],
    },
  },
  {
    id: 'weekly-schedule',
    title: 'Weekly Routine',
    icon: Calendar,
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-200 dark:border-purple-700',
    description: 'Complete weekly plan with morning, day, evening slots',
    type: 'routine',
    data: {
      days: ['Mon-Fri', 'Saturday', 'Sunday'],
      slots: [
        { time: '6:30-7:00', type: 'morning', icon: Sun },
        { time: '7:10-9:10', type: 'travel', icon: Bus },
        { time: '9:30-4:45', type: 'college', icon: School },
        { time: '5:10-7:30', type: 'travel', icon: Bus },
        { time: '8:15-9:00', type: 'break', icon: Coffee },
        { time: '9:00-10:30', type: 'study', icon: BookOpen },
        { time: '10:30-10:45', type: 'break', icon: Coffee },
        { time: '10:45-11:45', type: 'study', icon: Laptop },
        { time: '11:45-12:00', type: 'learning', icon: Brain },
        { time: '12:00-12:30', type: 'wind-down', icon: Moon },
      ],
      activities: [
        [
          { task: 'Wake Up + Plan', emoji: '⏰' },
          { task: 'BUS: DSA Audio/Video', emoji: '🎧' },
          { task: 'COLLEGE FREE TIME = DSA', emoji: '💻' },
          { task: 'BUS: DSA Revision', emoji: '📱' },
          { task: 'DINNER & BREAK', emoji: '🍽️' },
          { task: 'DSA (Concepts + Problems)', emoji: '📚' },
          { task: 'SHORT BREAK', emoji: '☕' },
          { task: 'DSA Problems', emoji: '✅' },
          { task: 'AI-ML Learning', emoji: '🤖' },
          { task: 'WIND DOWN', emoji: '✨' },
        ],
        [
          { task: 'Wake Up + Exercise', emoji: '💪' },
          { task: '', emoji: '' },
          { task: 'DSA DEEP DIVE', emoji: '🔍' },
          { task: 'LUNCH BREAK', emoji: '🥗' },
          { task: '', emoji: '' },
          { task: 'PROJECT WORK', emoji: '🚀' },
          { task: 'DEEP DSA TIME', emoji: '⚡' },
          { task: 'DSA REVISION', emoji: '📖' },
          { task: 'PROJECT WORK', emoji: '🔧' },
          { task: 'WIND DOWN', emoji: '🌙' },
        ],
        [
          { task: 'Wake Up + Plan', emoji: '📅' },
          { task: '', emoji: '' },
          { task: 'DSA MOCK TESTS', emoji: '📝' },
          { task: 'LUNCH BREAK', emoji: '🥪' },
          { task: '', emoji: '' },
          { task: 'COLLEGE STUDIES', emoji: '🎓' },
          { task: 'PROJECT WORK', emoji: '💼' },
          { task: 'DSA New Sessions', emoji: '🆕' },
          { task: 'DSA WEAK TOPICS', emoji: '🎯' },
          { task: 'WIND DOWN', emoji: '😴' },
        ],
      ],
    },
  },
  {
    id: 'time-breakdown',
    title: 'Time Allocation',
    icon: PieChart,
    color: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-200 dark:border-green-700',
    description: 'Weekly hour distribution across categories',
    type: 'analysis',
    data: {
      categories: [
        { name: 'DSA & CODING', hours: '32-35', percentage: 55, color: 'bg-blue-500', icon: Laptop },
        { name: 'COLLEGE STUDIES', hours: '10-12', percentage: 18, color: 'bg-green-500', icon: GraduationCap },
        { name: 'PROJECTS / AI-ML', hours: '8-10', percentage: 15, color: 'bg-purple-500', icon: Brain },
        { name: 'TRAVEL LEARNING', hours: '8-10', percentage: 12, color: 'bg-orange-500', icon: Bus },
      ],
      total: '60-67 hours',
      stats: [
        { label: 'Productivity', value: '92%', icon: TrendingUp },
        { label: 'Focus Hours', value: '42h', icon: Timer },
        { label: 'Consistency', value: '7/7', icon: CheckSquare },
      ],
    },
  },
  {
    id: 'kanban',
    title: 'Kanban Board',
    icon: Columns,
    color: 'from-orange-500/20 to-red-500/20',
    borderColor: 'border-orange-200 dark:border-orange-700',
    description: 'Drag-and-drop task management',
    type: 'productivity',
    data: {
      columns: [
        {
          title: 'To Do',
          color: 'bg-blue-100 dark:bg-blue-900/30',
          tasks: [
            { task: 'DSA Tree Problems', time: '2 hrs', priority: 'High', type: 'coding' },
            { task: 'DBMS Assignment', time: '1.5 hrs', priority: 'Medium', type: 'academic' },
          ],
        },
        {
          title: 'In Progress',
          color: 'bg-yellow-100 dark:bg-yellow-900/30',
          tasks: [
            { task: 'ML Project', time: '3 hrs', progress: 60, type: 'project' },
            { task: 'System Design', time: '2 hrs', progress: 40, type: 'coding' },
          ],
        },
        {
          title: 'Review',
          color: 'bg-purple-100 dark:bg-purple-900/30',
          tasks: [{ task: 'OS Notes', time: '1 hr', progress: 100, type: 'academic' }],
        },
        {
          title: 'Done',
          color: 'bg-green-100 dark:bg-green-900/30',
          tasks: [
            { task: 'LeetCode Daily', time: '1 hr', completed: true, type: 'coding' },
            { task: 'College Lectures', time: '4 hrs', completed: true, type: 'academic' },
          ],
        },
      ],
    },
  },
  {
    id: 'priority-matrix',
    title: 'Priority Matrix',
    icon: Target,
    color: 'from-pink-500/20 to-rose-500/20',
    borderColor: 'border-pink-200 dark:border-pink-700',
    description: 'Eisenhower Matrix for task prioritization',
    type: 'planning',
    data: {
      quadrants: [
        {
          title: 'Urgent & Important',
          color: 'from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40',
          tasks: [
            { task: 'Project Deadline', time: 'Today', emoji: '🔥' },
            { task: 'DSA Assessment', time: 'Tomorrow', emoji: '⚡' },
          ],
        },
        {
          title: 'Important Not Urgent',
          color: 'from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40',
          tasks: [
            { task: 'Long-term Projects', time: 'Week', emoji: '🚀' },
            { task: 'Skill Building', time: 'Ongoing', emoji: '📈' },
          ],
        },
        {
          title: 'Urgent Not Important',
          color: 'from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40',
          tasks: [
            { task: 'Emails', time: 'Today', emoji: '📧' },
            { task: 'Meetings', time: 'Today', emoji: '👥' },
          ],
        },
        {
          title: 'Not Urgent Not Important',
          color: 'from-gray-100 to-gray-200 dark:from-gray-900/40 dark:to-gray-800/40',
          tasks: [
            { task: 'Social Media', time: 'Limit', emoji: '📱' },
            { task: 'Entertainment', time: 'Leisure', emoji: '🎬' },
          ],
        },
      ],
    },
  },
  {
    id: 'time-blocks',
    title: 'Time Blocks',
    icon: Timer,
    color: 'from-cyan-500/20 to-teal-500/20',
    borderColor: 'border-cyan-200 dark:border-cyan-700',
    description: 'Visual time blocking with hour-by-hour scheduling',
    type: 'scheduling',
    data: {
      blocks: [
        { time: '6:00-7:00', activity: 'Morning Routine', type: 'health', color: 'bg-blue-200 dark:bg-blue-800', duration: '1h' },
        { time: '7:00-9:00', activity: 'DSA Study Session', type: 'study', color: 'bg-purple-200 dark:bg-purple-800', duration: '2h' },
        { time: '9:00-12:00', activity: 'College Lectures', type: 'academic', color: 'bg-green-200 dark:bg-green-800', duration: '3h' },
        { time: '1:00-3:00', activity: 'Project Work', type: 'project', color: 'bg-orange-200 dark:bg-orange-800', duration: '2h' },
        { time: '3:00-5:00', activity: 'Skill Development', type: 'learning', color: 'bg-red-200 dark:bg-red-800', duration: '2h' },
        { time: '5:00-7:00', activity: 'Exercise & Break', type: 'health', color: 'bg-cyan-200 dark:bg-cyan-800', duration: '2h' },
        { time: '7:00-9:00', activity: 'Revision & Planning', type: 'review', color: 'bg-indigo-200 dark:bg-indigo-800', duration: '2h' },
      ],
    },
  },
  {
    id: 'circular-wheel',
    title: 'Time Wheel',
    icon: PieChart,
    color: 'from-violet-500/20 to-fuchsia-500/20',
    borderColor: 'border-violet-200 dark:border-violet-700',
    description: 'Circular visualization of time distribution',
    type: 'visualization',
    data: {
      categories: [
        { name: 'DSA Practice', value: 25, color: '#a855f7', hours: 10 },
        { name: 'College Studies', value: 30, color: '#3b82f6', hours: 12 },
        { name: 'Projects', value: 20, color: '#22c55e', hours: 8 },
        { name: 'Skill Dev', value: 15, color: '#f97316', hours: 6 },
        { name: 'Health & Breaks', value: 10, color: '#ec4899', hours: 4 },
      ],
      total: '40 hours',
    },
  },
]

/* ============================================================================
   HERO SECTION
   ============================================================================ */

export function HeroSection() {
  const [currentDesign, setCurrentDesign] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const nextDesign = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentDesign((prev) => (prev + 1) % timetableDesigns.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevDesign = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentDesign((prev) => (prev - 1 + timetableDesigns.length) % timetableDesigns.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const currentTimetable = timetableDesigns[currentDesign]

  return (
    <section className="relative overflow-hidden pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" />

      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, #8882 1px, transparent 1px),
                            linear-gradient(to bottom, #8882 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI-Powered Student Productivity
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 sm:mb-6 leading-tight"
          >
            <span className="block">Master Your Time,</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Master Your Future
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto px-2"
          >
            Chronify AI creates personalized timetables that balance DSA, college
            studies, projects, and life—helping you achieve placement goals with
            smart time management.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4 sm:px-0"
          >
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="rounded-xl px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg gap-2 group w-full sm:w-auto"
              >
                <span>Create Your Timetable</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/features" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg w-full sm:w-auto"
              >
                See How It Works
              </Button>
            </Link>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto mb-12"
          >
            {[
              { text: '7 Different View Styles', icon: Layout },
              { text: 'College Timetable Import', icon: School },
              { text: 'Smart Priority Sorting', icon: TrendingUp },
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -3 }}
                className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-left">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ============================================================
            INTERACTIVE TIMETABLE SHOWCASE
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 sm:mt-16 relative"
        >
          {/* Design selector header */}
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center px-2">
              Explore 7 Different Timetable Styles
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6 text-center max-w-2xl px-2">
              From college schedules to time wheels — find your perfect
              productivity view
            </p>

            {/* Tab selector — horizontal scroll on mobile */}
            <div className="w-full">
              {/* ---------- MOBILE: Horizontal scroll tabs ---------- */}
              <div className="md:hidden overflow-x-auto -mx-4 px-4 pb-2">
                <div className="flex gap-2 min-w-max">
                  {timetableDesigns.map((design, index) => {
                    const Icon = design.icon
                    return (
                      <button
                        key={design.id}
                        onClick={() => {
                          if (!isAnimating) {
                            setIsAnimating(true)
                            setCurrentDesign(index)
                            setTimeout(() => setIsAnimating(false), 500)
                          }
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                          index === currentDesign
                            ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20'
                            : 'bg-secondary text-foreground hover:bg-secondary/80'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{design.title}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ---------- DESKTOP: Nav arrows + wrap tabs ---------- */}
              <div className="hidden md:flex items-center gap-4 justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevDesign}
                  disabled={isAnimating}
                  className="rounded-full flex-shrink-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex flex-wrap justify-center gap-2 max-w-3xl">
                  {timetableDesigns.map((design, index) => (
                    <motion.button
                      key={design.id}
                      onClick={() => {
                        if (!isAnimating) {
                          setIsAnimating(true)
                          setCurrentDesign(index)
                          setTimeout(() => setIsAnimating(false), 500)
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                        index === currentDesign
                          ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20'
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      <design.icon className="w-4 h-4" />
                      <span className="text-sm font-medium whitespace-nowrap">
                        {design.title}
                      </span>
                    </motion.button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextDesign}
                  disabled={isAnimating}
                  className="rounded-full flex-shrink-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* ============ TIMETABLE DISPLAY ============ */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDesign}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* =========================================================
                  DESIGN 1: COLLEGE TIMETABLE
                 ========================================================= */}
              {currentTimetable.id === 'college-style' && (
                <div
                  className={`rounded-2xl overflow-hidden border-2 ${currentTimetable.borderColor} shadow-2xl shadow-primary/10`}
                >
                  <div className={`bg-gradient-to-r ${currentTimetable.color} p-3 sm:p-6`}>
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-3 sm:p-6 shadow-lg">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
                            <currentTimetable.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-base sm:text-xl truncate">
                              {currentTimetable.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                              {currentTimetable.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-xs px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 w-fit">
                          Odd Semester 2025-26
                        </div>
                      </div>

                      {/* ---------- MOBILE: Card list ---------- */}
                      <div className="md:hidden space-y-4">
                        {currentTimetable.data.days.map((day, dayIndex) => (
                          <div
                            key={day}
                            className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-primary">
                                  {day.slice(0, 3)}
                                </span>
                              </div>
                              <span className="font-semibold text-sm">{day}</span>
                            </div>

                            <div className="space-y-2">
                              {currentTimetable.data.periods.map((period, pIdx) => {
                                const subject =
                                  currentTimetable.data.schedule[pIdx]?.[dayIndex]
                                if (!subject) return null

                                return (
                                  <div
                                    key={pIdx}
                                    className={`flex items-center gap-3 p-2.5 rounded-lg ${
                                      period.break
                                        ? 'bg-red-50 dark:bg-red-900/20'
                                        : 'bg-white dark:bg-gray-900'
                                    }`}
                                  >
                                    <div className="text-[10px] font-medium text-muted-foreground w-16 flex-shrink-0">
                                      {period.time}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium truncate">
                                        {subject}
                                      </div>
                                      {period.period && (
                                        <div className="text-[10px] text-muted-foreground">
                                          Period {period.period}
                                        </div>
                                      )}
                                      {period.break && (
                                        <div className="text-[10px] text-red-500 font-medium">
                                          {period.break}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* ---------- DESKTOP: Table ---------- */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                                DAY
                              </th>
                              <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                                TIME
                              </th>
                              {currentTimetable.data.days.map((day) => (
                                <th
                                  key={day}
                                  className="p-3 text-center text-sm font-medium text-muted-foreground"
                                >
                                  {day}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {currentTimetable.data.periods.map((period, periodIndex) => (
                              <motion.tr
                                key={periodIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: periodIndex * 0.05 }}
                                className="border-b border-gray-100 dark:border-gray-800"
                              >
                                {periodIndex === 0 && (
                                  <td
                                    rowSpan={currentTimetable.data.periods.length}
                                    className="p-3 align-top"
                                  >
                                    <div className="text-center">
                                      <div className="font-bold text-lg">Week</div>
                                      <div className="text-sm text-muted-foreground">
                                        Schedule
                                      </div>
                                    </div>
                                  </td>
                                )}
                                <td className="p-3 whitespace-nowrap">
                                  <div className="text-sm font-medium">
                                    {period.time}
                                  </div>
                                  {period.period && (
                                    <div className="text-xs text-muted-foreground">
                                      Period {period.period}
                                    </div>
                                  )}
                                  {period.break && (
                                    <div className="text-xs text-red-500 font-medium">
                                      {period.break}
                                    </div>
                                  )}
                                </td>
                                {currentTimetable.data.days.map((day, dayIndex) => {
                                  const subject =
                                    currentTimetable.data.schedule[periodIndex]?.[dayIndex]
                                  return (
                                    <td key={dayIndex} className="p-3">
                                      {subject ? (
                                        <motion.div
                                          whileHover={{ scale: 1.02 }}
                                          className={`p-3 rounded-lg text-center cursor-pointer ${
                                            period.break
                                              ? 'bg-red-50 dark:bg-red-900/20'
                                              : 'bg-blue-50 dark:bg-blue-900/20'
                                          }`}
                                        >
                                          <div className="font-medium">{subject}</div>
                                        </motion.div>
                                      ) : (
                                        <div className="p-3 text-sm text-muted-foreground text-center">
                                          -
                                        </div>
                                      )}
                                    </td>
                                  )
                                })}
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Subject legend */}
                      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-xs sm:text-sm font-medium mb-3">
                          Subject Codes
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { code: 'CGMS', name: 'Computer Graphics' },
                            { code: 'ADBMS', name: 'Advanced DB' },
                            { code: 'DCCN', name: 'Data Comm & Networks' },
                            { code: 'CPUCL', name: 'C Programming' },
                          ].map((subject) => (
                            <div
                              key={subject.code}
                              className="px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs"
                            >
                              <span className="font-medium">{subject.code}</span>
                              <span className="text-muted-foreground ml-1.5 hidden sm:inline">
                                - {subject.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================
                  DESIGN 2: WEEKLY SCHEDULE
                 ========================================================= */}
              {currentTimetable.id === 'weekly-schedule' && (
                <div
                  className={`rounded-2xl overflow-hidden border-2 ${currentTimetable.borderColor} shadow-2xl shadow-primary/10`}
                >
                  <div className={`bg-gradient-to-r ${currentTimetable.color} p-3 sm:p-6`}>
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-3 sm:p-6 shadow-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
                            <currentTimetable.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-base sm:text-xl truncate">
                              {currentTimetable.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                              {currentTimetable.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-xs px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 w-fit">
                          Balanced Weekly Plan
                        </div>
                      </div>

                      {/* ---------- MOBILE: Day cards ---------- */}
                      <div className="md:hidden space-y-4">
                        {currentTimetable.data.days.map((day, dayIndex) => (
                          <div
                            key={day}
                            className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <Calendar className="w-4 h-4 text-primary" />
                              <span className="font-semibold text-sm">{day}</span>
                            </div>

                            <div className="space-y-2">
                              {currentTimetable.data.slots.map((slot, slotIndex) => {
                                const activity =
                                  currentTimetable.data.activities[dayIndex]?.[slotIndex]
                                if (!activity?.task) return null

                                const SlotIcon = slot.icon
                                return (
                                  <div
                                    key={slotIndex}
                                    className="flex items-start gap-2 p-2.5 rounded-lg bg-white dark:bg-gray-900"
                                  >
                                    <div className="text-[10px] font-medium text-muted-foreground w-14 flex-shrink-0 pt-0.5">
                                      {slot.time}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-base flex-shrink-0">
                                          {activity.emoji}
                                        </span>
                                        <span className="text-sm font-medium break-words">
                                          {activity.task}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1 mt-0.5">
                                        {SlotIcon && (
                                          <SlotIcon className="w-3 h-3 text-muted-foreground" />
                                        )}
                                        <span className="text-[10px] text-muted-foreground capitalize">
                                          {slot.type}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* ---------- DESKTOP: Table ---------- */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                                TIME
                              </th>
                              {currentTimetable.data.days.map((day) => (
                                <th
                                  key={day}
                                  className="p-3 text-center text-sm font-medium text-muted-foreground"
                                >
                                  {day}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {currentTimetable.data.slots.map((slot, slotIndex) => {
                              const SlotIcon = slot.icon
                              return (
                                <tr
                                  key={slotIndex}
                                  className="border-b border-gray-100 dark:border-gray-800"
                                >
                                  <td className="p-3">
                                    <div className="flex items-center gap-3">
                                      {SlotIcon && (
                                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                                          <SlotIcon className="w-4 h-4" />
                                        </div>
                                      )}
                                      <div>
                                        <div className="font-medium">{slot.time}</div>
                                        <div className="text-xs text-muted-foreground capitalize">
                                          {slot.type}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  {currentTimetable.data.activities.map(
                                    (dayActivities, dayIndex) => {
                                      const activity = dayActivities[slotIndex]
                                      return (
                                        <td key={dayIndex} className="p-3">
                                          {activity?.task ? (
                                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                                              <div className="flex items-start gap-2">
                                                <span className="text-xl">
                                                  {activity.emoji}
                                                </span>
                                                <div className="font-medium">
                                                  {activity.task}
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="p-3 text-sm text-muted-foreground text-center">
                                              -
                                            </div>
                                          )}
                                        </td>
                                      )
                                    },
                                  )}
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================
                  DESIGN 3: TIME BREAKDOWN
                 ========================================================= */}
              {currentTimetable.id === 'time-breakdown' && (
                <div
                  className={`rounded-2xl overflow-hidden border-2 ${currentTimetable.borderColor} shadow-2xl shadow-primary/10`}
                >
                  <div className={`bg-gradient-to-r ${currentTimetable.color} p-3 sm:p-6`}>
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-3 sm:p-6 shadow-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
                            <currentTimetable.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-base sm:text-xl">
                              {currentTimetable.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {currentTimetable.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-xs text-muted-foreground">
                            Total Weekly Hours
                          </div>
                          <div className="text-lg sm:text-2xl font-bold text-primary">
                            {currentTimetable.data.total}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
                        {/* Bar Chart */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-sm">Weekly Time Distribution</h4>
                          {currentTimetable.data.categories.map((category, index) => {
                            const CategoryIcon = category.icon
                            return (
                              <div key={category.name} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div
                                      className={`w-3 h-3 rounded-full ${category.color} flex-shrink-0`}
                                    />
                                    <CategoryIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <span className="font-medium text-sm truncate">
                                      {category.name}
                                    </span>
                                  </div>
                                  <div className="text-right flex-shrink-0 ml-2">
                                    <div className="font-bold text-sm">
                                      {category.hours} hrs
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {category.percentage}%
                                    </div>
                                  </div>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${category.percentage}%` }}
                                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                                    className={`h-full ${category.color} rounded-full`}
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {/* Stats + Priority */}
                        <div className="space-y-5">
                          <div>
                            <h4 className="font-medium text-sm mb-3">
                              Weekly Performance
                            </h4>
                            <div className="grid grid-cols-3 gap-2 sm:gap-4">
                              {currentTimetable.data.stats.map((stat) => {
                                const StatIcon = stat.icon
                                return (
                                  <div
                                    key={stat.label}
                                    className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2.5 sm:p-4 text-center"
                                  >
                                    <StatIcon className="w-4 h-4 sm:w-6 sm:h-6 text-primary mx-auto mb-1.5" />
                                    <div className="text-base sm:text-2xl font-bold">
                                      {stat.value}
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-muted-foreground">
                                      {stat.label}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-sm mb-3">Priority Order</h4>
                            <div className="space-y-2">
                              {[
                                { priority: '1', task: 'DSA (55%)', desc: 'Core for placements' },
                                { priority: '2', task: 'College Studies (18%)', desc: 'Maintain CGPA' },
                                { priority: '3', task: 'Projects / AI-ML (15%)', desc: 'Build portfolio' },
                                { priority: '4', task: 'Travel Learning (12%)', desc: 'Utilize commute' },
                              ].map((item) => (
                                <div
                                  key={item.priority}
                                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                                >
                                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                                    {item.priority}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-medium text-sm truncate">
                                      {item.task}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">
                                      {item.desc}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10">
                          <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                            <h4 className="font-medium text-sm">Key Notes</h4>
                          </div>
                          <p className="text-xs sm:text-sm">
                            "Consistency beats intensity. 1 hour DSA daily &gt; 5
                            hours in one day."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================
                  DESIGN 4: KANBAN BOARD
                 ========================================================= */}
              {currentTimetable.id === 'kanban' && (
                <div
                  className={`rounded-2xl overflow-hidden border-2 ${currentTimetable.borderColor} shadow-2xl shadow-primary/10`}
                >
                  <div className={`bg-gradient-to-r ${currentTimetable.color} p-3 sm:p-6`}>
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-3 sm:p-6 shadow-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
                            <currentTimetable.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-base sm:text-xl">
                              {currentTimetable.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {currentTimetable.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Kanban — 1 col mobile, 2 col sm, 4 col md+ */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        {currentTimetable.data.columns.map((column) => (
                          <div
                            key={column.title}
                            className={`${column.color} rounded-xl p-3 sm:p-4 min-h-[200px] md:min-h-[300px]`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-bold text-sm sm:text-base">
                                {column.title}
                              </h4>
                              <span className="text-xs bg-white/50 dark:bg-black/50 px-2 py-0.5 rounded-full">
                                {column.tasks.length}
                              </span>
                            </div>
                            <div className="space-y-2">
                              {column.tasks.map((task, taskIndex) => (
                                <div
                                  key={`${task.task}-${taskIndex}`}
                                  className="bg-white/80 dark:bg-black/50 p-2.5 sm:p-3 rounded-lg shadow-sm"
                                >
                                  <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <span className="font-medium text-sm">
                                      {task.task}
                                    </span>
                                    {task.completed && (
                                      <CheckSquare className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    )}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 text-xs">
                                    <span className="text-muted-foreground">
                                      {task.time}
                                    </span>
                                    {task.priority && (
                                      <span
                                        className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                                          task.priority === 'High'
                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        }`}
                                      >
                                        {task.priority}
                                      </span>
                                    )}
                                    {task.progress !== undefined && (
                                      <div className="flex items-center gap-1">
                                        <div className="w-10 h-1 bg-gray-200 rounded-full overflow-hidden">
                                          <div
                                            className="h-full bg-green-500 rounded-full"
                                            style={{ width: `${task.progress}%` }}
                                          />
                                        </div>
                                        <span className="text-[10px]">
                                          {task.progress}%
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  {task.type && (
                                    <div className="mt-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 w-fit">
                                      {task.type}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================
                  DESIGN 5: PRIORITY MATRIX
                 ========================================================= */}
              {currentTimetable.id === 'priority-matrix' && (
                <div
                  className={`rounded-2xl overflow-hidden border-2 ${currentTimetable.borderColor} shadow-2xl shadow-primary/10`}
                >
                  <div className={`bg-gradient-to-r ${currentTimetable.color} p-3 sm:p-6`}>
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-3 sm:p-6 shadow-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
                            <currentTimetable.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-base sm:text-xl">
                              {currentTimetable.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {currentTimetable.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Matrix — 1 col mobile, 2 col sm+ */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {currentTimetable.data.quadrants.map((quadrant) => (
                          <div
                            key={quadrant.title}
                            className={`bg-gradient-to-br ${quadrant.color} rounded-xl p-3 sm:p-5 min-h-[150px]`}
                          >
                            <h4 className="font-bold text-sm sm:text-base mb-3">
                              {quadrant.title}
                            </h4>
                            <div className="space-y-2">
                              {quadrant.tasks.map((task) => (
                                <div
                                  key={task.task}
                                  className="flex items-center justify-between gap-2 p-2 sm:p-3 bg-white/70 dark:bg-black/50 rounded-lg"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-base flex-shrink-0">
                                      {task.emoji}
                                    </span>
                                    <span className="font-medium text-xs sm:text-sm truncate">
                                      {task.task}
                                    </span>
                                  </div>
                                  <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full bg-white dark:bg-black flex-shrink-0">
                                    {task.time}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Legend */}
                      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { color: 'bg-red-500', title: 'Do First', desc: 'Urgent & important' },
                            { color: 'bg-green-500', title: 'Schedule', desc: 'Important, not urgent' },
                            { color: 'bg-yellow-500', title: 'Delegate', desc: 'Urgent, not important' },
                            { color: 'bg-gray-500', title: 'Eliminate', desc: 'Not urgent or important' },
                          ].map((item) => (
                            <div key={item.title} className="flex items-start gap-2">
                              <div
                                className={`w-3 h-3 rounded-full ${item.color} flex-shrink-0 mt-1`}
                              />
                              <div className="min-w-0">
                                <div className="font-medium text-xs">{item.title}</div>
                                <div className="text-[10px] text-muted-foreground">
                                  {item.desc}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================
                  DESIGN 6: TIME BLOCKS
                 ========================================================= */}
              {currentTimetable.id === 'time-blocks' && (
                <div
                  className={`rounded-2xl overflow-hidden border-2 ${currentTimetable.borderColor} shadow-2xl shadow-primary/10`}
                >
                  <div className={`bg-gradient-to-r ${currentTimetable.color} p-3 sm:p-6`}>
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-3 sm:p-6 shadow-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
                            <currentTimetable.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-base sm:text-xl">
                              {currentTimetable.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {currentTimetable.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-xs text-muted-foreground">
                            Daily Focus Time
                          </div>
                          <div className="text-lg sm:text-2xl font-bold text-primary">
                            8.5 hours
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        {currentTimetable.data.blocks.map((block) => (
                          <div
                            key={block.time}
                            className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
                          >
                            <div className="sm:w-24 flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0">
                              <div className="text-xs sm:text-sm font-medium">
                                {block.time}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {block.duration}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div
                                className={`${block.color} rounded-xl p-3 sm:p-4`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="min-w-0">
                                    <h4 className="font-bold text-sm sm:text-base mb-0.5 truncate">
                                      {block.activity}
                                    </h4>
                                    <span className="text-xs text-muted-foreground capitalize">
                                      {block.type}
                                    </span>
                                  </div>
                                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                          {[
                            { label: 'Study Hours', value: '6.5h', icon: BookOpen },
                            { label: 'Focus Time', value: '5.2h', icon: Timer },
                            { label: 'Breaks Taken', value: '4', icon: Coffee },
                            { label: 'Productivity', value: '92%', icon: TrendingUp },
                          ].map((stat) => {
                            const StatIcon = stat.icon
                            return (
                              <div
                                key={stat.label}
                                className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2.5 sm:p-4 text-center"
                              >
                                <StatIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1.5" />
                                <div className="text-base sm:text-xl font-bold">
                                  {stat.value}
                                </div>
                                <div className="text-[10px] sm:text-xs text-muted-foreground">
                                  {stat.label}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================
                  DESIGN 7: CIRCULAR TIME WHEEL
                 ========================================================= */}
              {currentTimetable.id === 'circular-wheel' && (
                <div
                  className={`rounded-2xl overflow-hidden border-2 ${currentTimetable.borderColor} shadow-2xl shadow-primary/10`}
                >
                  <div className={`bg-gradient-to-r ${currentTimetable.color} p-3 sm:p-6`}>
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-3 sm:p-6 shadow-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
                            <currentTimetable.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-base sm:text-xl">
                              {currentTimetable.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {currentTimetable.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-xs text-muted-foreground">
                            Weekly Total
                          </div>
                          <div className="text-lg sm:text-2xl font-bold text-primary">
                            {currentTimetable.data.total}
                          </div>
                        </div>
                      </div>

                      {/* Stacked on mobile, side-by-side on lg */}
                      <div className="flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-8">
                        {/* Pie chart */}
                        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0">
                          <svg viewBox="0 0 256 256" className="w-full h-full -rotate-90">
                            {(() => {
                              let prev = 0
                              return currentTimetable.data.categories.map(
                                (category) => {
                                  const newValue = prev + category.value
                                  const angle = (newValue / 100) * 360
                                  const prevAngle = (prev / 100) * 360
                                  const largeArc = category.value > 50 ? 1 : 0

                                  const x1 = 128 + 100 * Math.cos((prevAngle * Math.PI) / 180)
                                  const y1 = 128 + 100 * Math.sin((prevAngle * Math.PI) / 180)
                                  const x2 = 128 + 100 * Math.cos((angle * Math.PI) / 180)
                                  const y2 = 128 + 100 * Math.sin((angle * Math.PI) / 180)

                                  const path = (
                                    <path
                                      key={category.name}
                                      d={`M 128 128 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                      fill={category.color}
                                      className="opacity-80 hover:opacity-100 transition-opacity"
                                    />
                                  )

                                  prev = newValue
                                  return path
                                },
                              )
                            })()}
                            <circle cx="128" cy="128" r="50" fill="white" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center bg-white dark:bg-gray-900 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center">
                              <div className="text-sm sm:text-lg font-bold">
                                {currentTimetable.data.total}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                per week
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Category list */}
                        <div className="flex-1 w-full space-y-2 sm:space-y-4">
                          {currentTimetable.data.categories.map((category) => (
                            <div
                              key={category.name}
                              className="flex items-center justify-between p-2.5 sm:p-4 rounded-lg bg-gray-100 dark:bg-gray-800"
                            >
                              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <div
                                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: category.color }}
                                />
                                <div className="min-w-0">
                                  <div className="font-medium text-xs sm:text-sm truncate">
                                    {category.name}
                                  </div>
                                  <div className="text-[10px] sm:text-xs text-muted-foreground">
                                    {category.hours} hours/week
                                  </div>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0 ml-2">
                                <div className="text-base sm:text-xl font-bold">
                                  {category.value}%
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10">
                        <div className="flex items-center gap-3">
                          <Award className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="font-medium text-sm">
                              Optimal Balance Achieved
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Your time distribution aligns with placement
                              preparation goals
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Floating decorations */}
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -left-6 w-16 sm:w-24 h-16 sm:h-24 bg-accent/20 rounded-full blur-xl pointer-events-none"
              />
              <motion.div
                animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
                className="absolute -bottom-6 -right-6 w-20 sm:w-32 h-20 sm:h-32 bg-primary/20 rounded-full blur-xl pointer-events-none"
              />
            </motion.div>
          </AnimatePresence>

          {/* Design indicator dots */}
          <div className="flex justify-center mt-6 sm:mt-8 gap-2 flex-wrap">
            {timetableDesigns.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true)
                    setCurrentDesign(index)
                    setTimeout(() => setIsAnimating(false), 500)
                  }
                }}
                aria-label={`Go to design ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  index === currentDesign
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-gray-300 dark:bg-gray-700 hover:bg-primary/50'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 200% auto;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}