// src/components/features/dashboard/tour-completion.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Trophy, CheckCircle, Rocket } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AuthService } from '@/hooks/useAuth'

export function TourCompletionCelebration() {
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationType, setCelebrationType] = useState<'onboarding' | 'regular'>('regular')

  useEffect(() => {
    const tourCompleted = localStorage.getItem('tour_completed')
    const onboardingTourCompleted = localStorage.getItem('onboarding_tour_completed')
    const celebrationShown = localStorage.getItem('celebration_shown')
    
    // Check if this is an onboarding celebration
    const user = AuthService.getCurrentUser()
    const isNewUser = user?.onboardingStep === 4
    
    if ((tourCompleted || onboardingTourCompleted) && !celebrationShown) {
      setCelebrationType(isNewUser ? 'onboarding' : 'regular')
      setShowCelebration(true)
      localStorage.setItem('celebration_shown', 'true')
      
      // Auto hide after 6 seconds
      setTimeout(() => {
        setShowCelebration(false)
      }, 6000)
    }
  }, [])

  const getCelebrationContent = () => {
    if (celebrationType === 'onboarding') {
      return {
        title: 'Profile Complete! 🎉',
        subtitle: 'You\'re now ready to make the most of Chronify AI',
        icon: <Rocket className="w-10 h-10 text-white" />,
        gradient: 'from-green-500 to-emerald-500',
        items: [
          'Set your first goal',
          'Create tasks',
          'Build timetable',
          'Track your streak'
        ]
      }
    }
    
    return {
      title: 'Tour Complete! ✨',
      subtitle: 'You\'re now familiar with all the features',
      icon: <Trophy className="w-10 h-10 text-white" />,
      gradient: 'from-orange-500 to-yellow-500',
      items: [
        'Know your dashboard',
        'Can set goals',
        'Can create tasks',
        'Can track progress'
      ]
    }
  }

  const content = getCelebrationContent()

  return (
    <AnimatePresence>
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4 pointer-events-none"
        >
          {/* Confetti Effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: -100,
                  x: Math.random() * window.innerWidth - window.innerWidth / 2,
                  rotate: 0,
                  opacity: 1
                }}
                animate={{ 
                  y: window.innerHeight,
                  rotate: 360,
                  opacity: 0
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.05,
                  ease: "easeOut"
                }}
                className="absolute text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                }}
              >
                {i % 4 === 0 ? '🎉' : i % 4 === 1 ? '✨' : i % 4 === 2 ? '🌟' : '🎊'}
              </motion.div>
            ))}
          </div>

          {/* Celebration Modal */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="relative bg-gradient-to-br from-background to-card rounded-2xl border border-border shadow-2xl p-8 max-w-md w-full pointer-events-auto"
          >
            {/* Close button */}
            <button
              onClick={() => setShowCelebration(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent transition-colors"
            >
              <span className="text-muted-foreground">✕</span>
            </button>

            {/* Content */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${content.gradient} mb-6`}
              >
                {content.icon}
              </motion.div>

              <h2 className="text-2xl font-bold mb-3">
                {content.title}
              </h2>
              
              <p className="text-muted-foreground mb-6">
                {content.subtitle}
              </p>

              <div className="space-y-3 mb-6">
                {content.items.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3 text-left"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => setShowCelebration(false)}
                className="w-full py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                {celebrationType === 'onboarding' ? 'Start My Journey! 🚀' : 'Let\'s Get Started!'}
              </button>
              
              {celebrationType === 'onboarding' && (
                <p className="text-xs text-muted-foreground mt-4">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  You'll get personalized tips based on your profile
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}