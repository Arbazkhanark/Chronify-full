// // src/contexts/tutorial-tour-context.tsx
// 'use client'

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'

// interface TutorialStep {
//   id: string
//   title: string
//   description: string
//   selector: string
//   position: 'top' | 'bottom' | 'left' | 'right'
//   action?: () => void
// }

// interface TutorialTourContextType {
//   isTourActive: boolean
//   currentStep: number
//   totalSteps: number
//   startTour: () => void
//   nextStep: () => void
//   prevStep: () => void
//   skipTour: () => void
//   completeTour: () => void
//   getCurrentStep: () => TutorialStep | null
// }

// const TutorialTourContext = createContext<TutorialTourContextType | undefined>(undefined)

// const tutorialSteps: TutorialStep[] = [
//   {
//     id: 'welcome',
//     title: '🎯 Welcome to Chronify AI!',
//     description: 'Let me give you a quick tour of your dashboard to help you get started.',
//     selector: '.dashboard-hero',
//     position: 'bottom'
//   },
//   {
//     id: 'stats-overview',
//     title: '📊 Your Performance Stats',
//     description: 'Here you can see your streak, focus time, task completion rate, and consistency score at a glance.',
//     selector: '.stats-overview-section',
//     position: 'top',
//     action: () => {
//       const element = document.querySelector('.stats-overview-section')
//       element?.classList.add('highlight-pulse')
//       setTimeout(() => element?.classList.remove('highlight-pulse'), 2000)
//     }
//   },
//   {
//     id: 'goals',
//     title: '🎯 Set & Manage Goals',
//     description: 'Click here to add and manage your goals. Start by setting your first goal!',
//     selector: 'a[href*="goals"], .goals-button',
//     position: 'left',
//     action: () => {
//       const goalsButton = document.querySelector('a[href*="goals"], .goals-button')
//       goalsButton?.classList.add('highlight-button')
//       setTimeout(() => goalsButton?.classList.remove('highlight-button'), 2000)
//     }
//   },
//   {
//     id: 'tasks',
//     title: '✅ Create Tasks',
//     description: 'After setting goals, create tasks here to break them into actionable steps.',
//     selector: '.task-manager-section',
//     position: 'top',
//     action: () => {
//       const element = document.querySelector('.task-manager-section')
//       element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
//       element?.classList.add('highlight-pulse')
//       setTimeout(() => element?.classList.remove('highlight-pulse'), 2000)
//     }
//   },
//   {
//     id: 'timetable',
//     title: '📅 Build Your Timetable',
//     description: 'Create your weekly schedule here. Plan your study sessions, classes, and breaks.',
//     selector: '.schedule-view-section',
//     position: 'top',
//     action: () => {
//       const element = document.querySelector('.schedule-view-section')
//       element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
//       element?.classList.add('highlight-pulse')
//       setTimeout(() => element?.classList.remove('highlight-pulse'), 2000)
//     }
//   },
//   {
//     id: 'streaks',
//     title: '🔥 Track Your Streak',
//     description: 'Watch your consistency grow here! Your streak motivates you to keep going every day.',
//     selector: '.motivation-board-section',
//     position: 'right',
//     action: () => {
//       const element = document.querySelector('.motivation-board-section')
//       element?.classList.add('highlight-pulse')
//       setTimeout(() => element?.classList.remove('highlight-pulse'), 2000)
//     }
//   },
//   {
//     id: 'quick-access',
//     title: '⚡ Quick Actions',
//     description: 'Quickly add tasks, start timers, or access any feature from here.',
//     selector: '.quick-access-section',
//     position: 'left'
//   },
//   {
//     id: 'progress',
//     title: '📈 Monitor Progress',
//     description: 'Track your weekly progress and see how you\'re improving over time.',
//     selector: '.progress-insights-section',
//     position: 'bottom'
//   },
//   {
//     id: 'complete',
//     title: '🚀 You\'re All Set!',
//     description: 'Start by setting your first goal and building your timetable. Remember, consistency is key!',
//     selector: '.dashboard-hero',
//     position: 'bottom'
//   }
// ]

// export function TutorialTourProvider({ children }: { children: ReactNode }) {
//   const [isTourActive, setIsTourActive] = useState(false)
//   const [currentStep, setCurrentStep] = useState(0)
//   const [hasCompletedTour, setHasCompletedTour] = useState(false)

//   // Check if user is new or returning after 1 week
//   useEffect(() => {
//     const checkTourStatus = () => {
//       const lastLogin = localStorage.getItem('last_login')
//       const tourCompleted = localStorage.getItem('tour_completed')
//       const isNewUser = !lastLogin
      
//       if (isNewUser) {
//         // New user - show tour after 2 seconds
//         setTimeout(() => {
//           startTour()
//         }, 2000)
//       } else if (lastLogin) {
//         // Check if it's been more than 1 week
//         const lastLoginDate = new Date(lastLogin)
//         const oneWeekAgo = new Date()
//         oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        
//         if (lastLoginDate < oneWeekAgo && !tourCompleted) {
//           setTimeout(() => {
//             startTour()
//           }, 3000)
//         }
//       }
      
//       // Update last login
//       localStorage.setItem('last_login', new Date().toISOString())
//     }

//     checkTourStatus()
//   }, [])

//   const startTour = () => {
//     setIsTourActive(true)
//     setCurrentStep(0)
//     document.body.style.overflow = 'hidden'
//   }

//   const nextStep = () => {
//     if (currentStep < tutorialSteps.length - 1) {
//       setCurrentStep(prev => prev + 1)
//     } else {
//       completeTour()
//     }
//   }

//   const prevStep = () => {
//     if (currentStep > 0) {
//       setCurrentStep(prev => prev - 1)
//     }
//   }

//   const skipTour = () => {
//     setIsTourActive(false)
//     document.body.style.overflow = 'auto'
//   }

//   const completeTour = () => {
//     setIsTourActive(false)
//     setHasCompletedTour(true)
//     localStorage.setItem('tour_completed', 'true')
//     document.body.style.overflow = 'auto'
//   }

//   const getCurrentStep = () => {
//     return tutorialSteps[currentStep] || null
//   }

//   return (
//     <TutorialTourContext.Provider
//       value={{
//         isTourActive,
//         currentStep,
//         totalSteps: tutorialSteps.length,
//         startTour,
//         nextStep,
//         prevStep,
//         skipTour,
//         completeTour,
//         getCurrentStep
//       }}
//     >
//       {children}
//       <AnimatePresence>
//         {isTourActive && (
//           <TutorialTourOverlay 
//             step={tutorialSteps[currentStep]}
//             currentStep={currentStep}
//             totalSteps={tutorialSteps.length}
//             onNext={nextStep}
//             onPrev={prevStep}
//             onSkip={skipTour}
//           />
//         )}
//       </AnimatePresence>
//     </TutorialTourContext.Provider>
//   )
// }

// export const useTutorialTour = () => {
//   const context = useContext(TutorialTourContext)
//   if (!context) {
//     throw new Error('useTutorialTour must be used within TutorialTourProvider')
//   }
//   return context
// }

// // Overlay Component
// function TutorialTourOverlay({ 
//   step, 
//   currentStep, 
//   totalSteps,
//   onNext,
//   onPrev,
//   onSkip 
// }: { 
//   step: TutorialStep
//   currentStep: number
//   totalSteps: number
//   onNext: () => void
//   onPrev: () => void
//   onSkip: () => void
// }) {
//   const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })

//   useEffect(() => {
//     const updatePosition = () => {
//       const element = document.querySelector(step.selector)
//       if (element) {
//         const rect = element.getBoundingClientRect()
//         setPosition({
//           top: rect.top + window.scrollY,
//           left: rect.left + window.scrollX,
//           width: rect.width,
//           height: rect.height
//         })

//         // Scroll element into view
//         element.scrollIntoView({ 
//           behavior: 'smooth', 
//           block: 'center',
//           inline: 'center'
//         })

//         // Execute action if defined
//         if (step.action) {
//           step.action()
//         }
//       }
//     }

//     updatePosition()
//     window.addEventListener('resize', updatePosition)
//     return () => window.removeEventListener('resize', updatePosition)
//   }, [step])

//   // Calculate tooltip position
//   const getTooltipPosition = () => {
//     const gap = 20
//     switch (step.position) {
//       case 'top':
//         return { 
//           top: position.top - gap,
//           left: position.left + position.width / 2,
//           transform: 'translate(-50%, -100%)'
//         }
//       case 'bottom':
//         return { 
//           top: position.top + position.height + gap,
//           left: position.left + position.width / 2,
//           transform: 'translate(-50%, 0)'
//         }
//       case 'left':
//         return { 
//           top: position.top + position.height / 2,
//           left: position.left - gap,
//           transform: 'translate(-100%, -50%)'
//         }
//       case 'right':
//         return { 
//           top: position.top + position.height / 2,
//           left: position.left + position.width + gap,
//           transform: 'translate(0, -50%)'
//         }
//       default:
//         return { top: 0, left: 0 }
//     }
//   }

//   const tooltipPosition = getTooltipPosition()

//   return (
//     <>
//       {/* Overlay */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
//       />

//       {/* Highlight Box */}
//       <motion.div
//         initial={{ 
//           scale: 0.8,
//           opacity: 0 
//         }}
//         animate={{ 
//           scale: 1,
//           opacity: 1,
//           borderColor: 'rgba(59, 130, 246, 0.5)'
//         }}
//         className="fixed z-[9999] rounded-xl border-2 border-primary shadow-lg shadow-primary/20"
//         style={{
//           top: position.top - 8,
//           left: position.left - 8,
//           width: position.width + 16,
//           height: position.height + 16,
//         }}
//       />

//       {/* Tooltip */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: 20 }}
//         className="fixed z-[10000] bg-gradient-to-b from-card to-background rounded-xl shadow-2xl border border-border max-w-sm w-full"
//         style={{
//           top: tooltipPosition.top,
//           left: tooltipPosition.left,
//           transform: tooltipPosition.transform
//         }}
//       >
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="text-lg font-bold">{step.title}</h3>
//             <span className="text-sm text-muted-foreground">
//               {currentStep + 1}/{totalSteps}
//             </span>
//           </div>
          
//           <p className="text-muted-foreground mb-6">
//             {step.description}
//           </p>

//           <div className="flex items-center justify-between gap-3">
//             <div className="flex gap-2">
//               <button
//                 onClick={onPrev}
//                 disabled={currentStep === 0}
//                 className="px-4 py-2 rounded-lg border border-input hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
//               >
//                 ← Back
//               </button>
//               <button
//                 onClick={onSkip}
//                 className="px-4 py-2 rounded-lg border border-input hover:bg-accent text-sm"
//               >
//                 Skip Tour
//               </button>
//             </div>
            
//             <button
//               onClick={onNext}
//               className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm"
//             >
//               {currentStep === totalSteps - 1 ? 'Get Started!' : 'Next →'}
//             </button>
//           </div>
//         </div>

//         {/* Arrow */}
//         <div className={`absolute w-4 h-4 bg-card border-b border-r border-border transform rotate-45 ${
//           step.position === 'top' ? 'bottom-[-8px] left-1/2 -translate-x-1/2' :
//           step.position === 'bottom' ? 'top-[-8px] left-1/2 -translate-x-1/2 border-t border-l border-b-0 border-r-0' :
//           step.position === 'left' ? 'right-[-8px] top-1/2 -translate-y-1/2 border-t border-r border-b-0 border-l-0' :
//           'left-[-8px] top-1/2 -translate-y-1/2 border-b border-l border-t-0 border-r-0'
//         }`} />
//       </motion.div>
//     </>
//   )
// }




















// // src/contexts/tutorial-tour-context.tsx (Updated)
// 'use client'

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'

// interface TutorialStep {
//   id: string
//   title: string
//   description: string
//   selector: string
//   position: 'top' | 'bottom' | 'left' | 'right'
//   action?: () => void
// }

// interface TutorialTourContextType {
//   isTourActive: boolean
//   currentStep: number
//   totalSteps: number
//   startTour: () => void
//   nextStep: () => void
//   prevStep: () => void
//   skipTour: () => void
//   completeTour: () => void
//   getCurrentStep: () => TutorialStep | null
// }

// const TutorialTourContext = createContext<TutorialTourContextType | undefined>(undefined)

// const tutorialSteps: TutorialStep[] = [
//   {
//     id: 'welcome',
//     title: '🎯 Welcome to Chronify AI!',
//     description: 'Let me give you a quick tour of your dashboard to help you get started.',
//     selector: '.dashboard-hero',
//     position: 'bottom'
//   },
//   {
//     id: 'stats-overview',
//     title: '📊 Your Performance Stats',
//     description: 'Here you can see your streak, focus time, task completion rate, and consistency score at a glance.',
//     selector: '.stats-overview-section',
//     position: 'top',
//     action: () => {
//       setTimeout(() => {
//         const element = document.querySelector('.stats-overview-section')
//         element?.classList.add('highlight-pulse')
//         setTimeout(() => element?.classList.remove('highlight-pulse'), 2000)
//       }, 100)
//     }
//   },
//   {
//     id: 'goals',
//     title: '🎯 Set & Manage Goals',
//     description: 'Click here to add and manage your goals. Start by setting your first goal!',
//     selector: '.goals-button',
//     position: 'left',
//     action: () => {
//       setTimeout(() => {
//         const goalsButton = document.querySelector('.goals-button')
//         goalsButton?.classList.add('highlight-button')
//         setTimeout(() => goalsButton?.classList.remove('highlight-button'), 2000)
//       }, 100)
//     }
//   },
//   {
//     id: 'tasks',
//     title: '✅ Create Tasks',
//     description: 'After setting goals, create tasks here to break them into actionable steps.',
//     selector: '.task-manager-section',
//     position: 'top',
//     action: () => {
//       setTimeout(() => {
//         const element = document.querySelector('.task-manager-section')
//         element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
//         element?.classList.add('highlight-pulse')
//         setTimeout(() => element?.classList.remove('highlight-pulse'), 2000)
//       }, 100)
//     }
//   },
//   {
//     id: 'timetable',
//     title: '📅 Build Your Timetable',
//     description: 'Create your weekly schedule here. Plan your study sessions, classes, and breaks.',
//     selector: '.schedule-view-section',
//     position: 'top',
//     action: () => {
//       setTimeout(() => {
//         const element = document.querySelector('.schedule-view-section')
//         element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
//         element?.classList.add('highlight-pulse')
//         setTimeout(() => element?.classList.remove('highlight-pulse'), 2000)
//       }, 100)
//     }
//   },
//   {
//     id: 'streaks',
//     title: '🔥 Track Your Streak',
//     description: 'Watch your consistency grow here! Your streak motivates you to keep going every day.',
//     selector: '.motivation-board-section',
//     position: 'right',
//     action: () => {
//       setTimeout(() => {
//         const element = document.querySelector('.motivation-board-section')
//         element?.classList.add('highlight-pulse')
//         setTimeout(() => element?.classList.remove('highlight-pulse'), 2000)
//       }, 100)
//     }
//   },
//   {
//     id: 'quick-access',
//     title: '⚡ Quick Actions',
//     description: 'Quickly add tasks, start timers, or access any feature from here.',
//     selector: '.quick-access-section',
//     position: 'left'
//   },
//   {
//     id: 'progress',
//     title: '📈 Monitor Progress',
//     description: 'Track your weekly progress and see how you\'re improving over time.',
//     selector: '.progress-insights-section',
//     position: 'bottom'
//   },
//   {
//     id: 'complete',
//     title: '🚀 You\'re All Set!',
//     description: 'Start by setting your first goal and building your timetable. Remember, consistency is key!',
//     selector: '.dashboard-hero',
//     position: 'bottom'
//   }
// ]

// export function TutorialTourProvider({ children }: { children: ReactNode }) {
//   const [isTourActive, setIsTourActive] = useState(false)
//   const [currentStep, setCurrentStep] = useState(0)
//   const [hasCompletedTour, setHasCompletedTour] = useState(false)
//   const [isClient, setIsClient] = useState(false)

//   useEffect(() => {
//     setIsClient(true)
//   }, [])

//   useEffect(() => {
//     if (!isClient) return

//     const checkTourStatus = () => {
//       try {
//         const lastLogin = localStorage.getItem('last_login')
//         const tourCompleted = localStorage.getItem('tour_completed')
//         const isNewUser = !lastLogin
        
//         if (isNewUser) {
//           // New user - show tour after 2 seconds
//           setTimeout(() => {
//             startTour()
//           }, 2000)
//         } else if (lastLogin) {
//           // Check if it's been more than 1 week
//           const lastLoginDate = new Date(lastLogin)
//           const oneWeekAgo = new Date()
//           oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
          
//           if (lastLoginDate < oneWeekAgo && !tourCompleted) {
//             setTimeout(() => {
//               startTour()
//             }, 3000)
//           }
//         }
        
//         // Update last login
//         localStorage.setItem('last_login', new Date().toISOString())
//       } catch (error) {
//         console.error('Error checking tour status:', error)
//       }
//     }

//     checkTourStatus()
//   }, [isClient])

//   const startTour = () => {
//     setIsTourActive(true)
//     setCurrentStep(0)
//     document.body.style.overflow = 'hidden'
//   }

//   const nextStep = () => {
//     if (currentStep < tutorialSteps.length - 1) {
//       setCurrentStep(prev => prev + 1)
//     } else {
//       completeTour()
//     }
//   }

//   const prevStep = () => {
//     if (currentStep > 0) {
//       setCurrentStep(prev => prev - 1)
//     }
//   }

//   const skipTour = () => {
//     setIsTourActive(false)
//     document.body.style.overflow = 'auto'
//   }

//   const completeTour = () => {
//     setIsTourActive(false)
//     setHasCompletedTour(true)
//     localStorage.setItem('tour_completed', 'true')
//     document.body.style.overflow = 'auto'
//   }

//   const getCurrentStep = () => {
//     return tutorialSteps[currentStep] || null
//   }

//   return (
//     <TutorialTourContext.Provider
//       value={{
//         isTourActive,
//         currentStep,
//         totalSteps: tutorialSteps.length,
//         startTour,
//         nextStep,
//         prevStep,
//         skipTour,
//         completeTour,
//         getCurrentStep
//       }}
//     >
//       {children}
//       {isClient && isTourActive && (
//         <TutorialTourOverlay 
//           step={tutorialSteps[currentStep]}
//           currentStep={currentStep}
//           totalSteps={tutorialSteps.length}
//           onNext={nextStep}
//           onPrev={prevStep}
//           onSkip={skipTour}
//         />
//       )}
//     </TutorialTourContext.Provider>
//   )
// }

// function TutorialTourOverlay({ 
//   step, 
//   currentStep, 
//   totalSteps,
//   onNext,
//   onPrev,
//   onSkip 
// }: { 
//   step: TutorialStep
//   currentStep: number
//   totalSteps: number
//   onNext: () => void
//   onPrev: () => void
//   onSkip: () => void
// }) {
//   const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })
//   const [isVisible, setIsVisible] = useState(false)

//   useEffect(() => {
//     setIsVisible(true)
    
//     const updatePosition = () => {
//       setTimeout(() => {
//         const element = document.querySelector(step.selector)
//         if (element) {
//           const rect = element.getBoundingClientRect()
//           setPosition({
//             top: rect.top + window.scrollY,
//             left: rect.left + window.scrollX,
//             width: rect.width,
//             height: rect.height
//           })

//           // Scroll element into view
//           element.scrollIntoView({ 
//             behavior: 'smooth', 
//             block: 'center',
//           })

//           // Execute action if defined
//           if (step.action) {
//             step.action()
//           }
//         }
//       }, 100)
//     }

//     updatePosition()
//     window.addEventListener('resize', updatePosition)
//     return () => window.removeEventListener('resize', updatePosition)
//   }, [step])

//   const getTooltipPosition = () => {
//     const gap = 20
//     const viewportWidth = window.innerWidth
//     const viewportHeight = window.innerHeight
    
//     let calculatedPosition = step.position
    
//     // Adjust position if tooltip would go out of viewport
//     switch (step.position) {
//       case 'top':
//         if (position.top < 300) calculatedPosition = 'bottom'
//         break
//       case 'bottom':
//         if (position.top + position.height > viewportHeight - 300) calculatedPosition = 'top'
//         break
//       case 'left':
//         if (position.left < 300) calculatedPosition = 'right'
//         break
//       case 'right':
//         if (position.left + position.width > viewportWidth - 300) calculatedPosition = 'left'
//         break
//     }
    
//     switch (calculatedPosition) {
//       case 'top':
//         return { 
//           top: Math.max(20, position.top - gap),
//           left: position.left + position.width / 2,
//           transform: 'translate(-50%, -100%)'
//         }
//       case 'bottom':
//         return { 
//           top: Math.min(viewportHeight - 300, position.top + position.height + gap),
//           left: position.left + position.width / 2,
//           transform: 'translate(-50%, 0)'
//         }
//       case 'left':
//         return { 
//           top: position.top + position.height / 2,
//           left: Math.max(20, position.left - gap),
//           transform: 'translate(-100%, -50%)'
//         }
//       case 'right':
//         return { 
//           top: position.top + position.height / 2,
//           left: Math.min(viewportWidth - 400, position.left + position.width + gap),
//           transform: 'translate(0, -50%)'
//         }
//       default:
//         return { top: 0, left: 0 }
//     }
//   }

//   const tooltipPosition = getTooltipPosition()

//   if (!isVisible) return null

//   return (
//     <>
//       {/* Overlay */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
//       />

//       {/* Highlight Box */}
//       <motion.div
//         initial={{ 
//           scale: 0.8,
//           opacity: 0 
//         }}
//         animate={{ 
//           scale: 1,
//           opacity: 1,
//         }}
//         className="fixed z-[9999] rounded-xl border-4 border-primary/70 shadow-2xl shadow-primary/30 bg-primary/10"
//         style={{
//           top: Math.max(10, position.top - 8),
//           left: Math.max(10, position.left - 8),
//           width: Math.min(window.innerWidth - 20, position.width + 16),
//           height: Math.min(window.innerHeight - 20, position.height + 16),
//         }}
//       />

//       {/* Tooltip */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: 20 }}
//         className="fixed z-[10000] bg-gradient-to-b from-background to-card rounded-2xl shadow-2xl border border-border max-w-sm w-full"
//         style={{
//           top: tooltipPosition.top,
//           left: tooltipPosition.left,
//           transform: tooltipPosition.transform
//         }}
//       >
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="text-lg font-bold">{step.title}</h3>
//             <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-md">
//               {currentStep + 1}/{totalSteps}
//             </span>
//           </div>
          
//           <p className="text-muted-foreground mb-6 text-sm">
//             {step.description}
//           </p>

//           <div className="flex items-center justify-between gap-3">
//             <div className="flex gap-2">
//               <button
//                 onClick={onPrev}
//                 disabled={currentStep === 0}
//                 className="px-3 py-1.5 rounded-lg border border-input hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-xs"
//               >
//                 ← Back
//               </button>
//               <button
//                 onClick={onSkip}
//                 className="px-3 py-1.5 rounded-lg border border-input hover:bg-accent text-xs"
//               >
//                 Skip
//               </button>
//             </div>
            
//             <button
//               onClick={onNext}
//               className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 font-medium text-sm"
//             >
//               {currentStep === totalSteps - 1 ? 'Start Journey!' : 'Next →'}
//             </button>
//           </div>
//         </div>

//         {/* Arrow */}
//         <div className={`absolute w-4 h-4 bg-background border-b border-r border-border transform rotate-45 ${
//           step.position === 'top' ? 'bottom-[-8px] left-1/2 -translate-x-1/2' :
//           step.position === 'bottom' ? 'top-[-8px] left-1/2 -translate-x-1/2 border-t border-l border-b-0 border-r-0' :
//           step.position === 'left' ? 'right-[-8px] top-1/2 -translate-y-1/2 border-t border-r border-b-0 border-l-0' :
//           'left-[-8px] top-1/2 -translate-y-1/2 border-b border-l border-t-0 border-r-0'
//         }`} />
//       </motion.div>
//     </>
//   )
// }

// export const useTutorialTour = () => {
//   const context = useContext(TutorialTourContext)
//   if (!context) {
//     throw new Error('useTutorialTour must be used within TutorialTourProvider')
//   }
//   return context
// }

















// src/contexts/tutorial-tour-context.tsx (Updated with Auth Integration)
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthService, User } from '@/hooks/useAuth'

interface TutorialStep {
  id: string
  title: string
  description: string
  selector: string
  position: 'top' | 'bottom' | 'left' | 'right'
  action?: () => void
}

interface TutorialTourContextType {
  isTourActive: boolean
  currentStep: number
  totalSteps: number
  startTour: () => void
  nextStep: () => void
  prevStep: () => void
  skipTour: () => void
  completeTour: () => void
  getCurrentStep: () => TutorialStep | null
  showOnboardingTour: (user: User) => void
}

const TutorialTourContext = createContext<TutorialTourContextType | undefined>(undefined)

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: '🎯 Welcome to Chronify AI!',
    description: 'Let me give you a quick tour of your dashboard to help you get started.',
    selector: '.dashboard-hero',
    position: 'bottom'
  },
  {
    id: 'stats-overview',
    title: '📊 Your Performance Stats',
    description: 'Here you can see your streak, focus time, task completion rate, and consistency score at a glance.',
    selector: '.stats-overview-section',
    position: 'top',
    action: () => {
      setTimeout(() => {
        const element = document.querySelector('.stats-overview-section')
        element?.classList.add('highlight-pulse')
        setTimeout(() => element?.classList.remove('highlight-pulse'), 2000)
      }, 100)
    }
  },
  {
    id: 'goals',
    title: '🎯 Set & Manage Goals',
    description: 'Click here to add and manage your goals. Start by setting your first goal!',
    selector: '.goals-button',
    position: 'left',
    action: () => {
      setTimeout(() => {
        const goalsButton = document.querySelector('.goals-button')
        goalsButton?.classList.add('highlight-button')
        setTimeout(() => goalsButton?.classList.remove('highlight-button'), 2000)
      }, 100)
    }
  },
  {
    id: 'tasks',
    title: '✅ Create Tasks',
    description: 'After setting goals, create tasks here to break them into actionable steps.',
    selector: '.task-manager-section',
    position: 'top',
    action: () => {
      setTimeout(() => {
        const element = document.querySelector('.task-manager-section')
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element?.classList.add('highlight-pulse')
        setTimeout(() => element?.classList.remove('highlight-pulse'), 2000)
      }, 100)
    }
  },
  {
    id: 'timetable',
    title: '📅 Build Your Timetable',
    description: 'Create your weekly schedule here. Plan your study sessions, classes, and breaks.',
    selector: '.schedule-view-section',
    position: 'top',
    action: () => {
      setTimeout(() => {
        const element = document.querySelector('.schedule-view-section')
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element?.classList.add('highlight-pulse')
        setTimeout(() => element?.classList.remove('highlight-pulse'), 2000)
      }, 100)
    }
  },
  {
    id: 'streaks',
    title: '🔥 Track Your Streak',
    description: 'Watch your consistency grow here! Your streak motivates you to keep going every day.',
    selector: '.motivation-board-section',
    position: 'right',
    action: () => {
      setTimeout(() => {
        const element = document.querySelector('.motivation-board-section')
        element?.classList.add('highlight-pulse')
        setTimeout(() => element?.classList.remove('highlight-pulse'), 2000)
      }, 100)
    }
  },
  {
    id: 'quick-access',
    title: '⚡ Quick Actions',
    description: 'Quickly add tasks, start timers, or access any feature from here.',
    selector: '.quick-access-section',
    position: 'left'
  },
  {
    id: 'progress',
    title: '📈 Monitor Progress',
    description: 'Track your weekly progress and see how you\'re improving over time.',
    selector: '.progress-insights-section',
    position: 'bottom'
  },
  {
    id: 'complete',
    title: '🚀 You\'re All Set!',
    description: 'Start by setting your first goal and building your timetable. Remember, consistency is key!',
    selector: '.dashboard-hero',
    position: 'bottom'
  }
]

const onboardingSteps: TutorialStep[] = [
  {
    id: 'onboarding-welcome',
    title: '🎯 Welcome to Chronify AI!',
    description: 'Congratulations on completing your profile! Let me show you around your new dashboard.',
    selector: '.dashboard-hero',
    position: 'bottom'
  },
  {
    id: 'onboarding-goals',
    title: '🎯 Step 1: Set Your Goals',
    description: 'Start by setting your academic and personal goals. Click the "Goals" button in sidebar to begin.',
    selector: '.goals-button',
    position: 'left',
    action: () => {
      setTimeout(() => {
        const goalsButton = document.querySelector('.goals-button')
        goalsButton?.classList.add('highlight-button')
        setTimeout(() => goalsButton?.classList.remove('highlight-button'), 2000)
      }, 100)
    }
  },
  {
    id: 'onboarding-tasks',
    title: '✅ Step 2: Break into Tasks',
    description: 'After setting goals, create daily/weekly tasks to make them achievable.',
    selector: '.task-manager-section',
    position: 'top',
    action: () => {
      setTimeout(() => {
        const element = document.querySelector('.task-manager-section')
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element?.classList.add('highlight-pulse')
        setTimeout(() => element?.classList.remove('highlight-pulse'), 2000)
      }, 100)
    }
  },
  {
    id: 'onboarding-timetable',
    title: '📅 Step 3: Build Timetable',
    description: 'Plan your week with our timetable builder. Allocate time for each task and goal.',
    selector: '.schedule-view-section',
    position: 'top',
    action: () => {
      setTimeout(() => {
        const element = document.querySelector('.schedule-view-section')
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element?.classList.add('highlight-pulse')
        setTimeout(() => element?.classList.remove('highlight-pulse'), 2000)
      }, 100)
    }
  },
  {
    id: 'onboarding-streak',
    title: '🔥 Step 4: Track Consistency',
    description: 'Watch your streak grow as you complete tasks daily. Stay motivated!',
    selector: '.motivation-board-section',
    position: 'right',
    action: () => {
      setTimeout(() => {
        const element = document.querySelector('.motivation-board-section')
        element?.classList.add('highlight-pulse')
        setTimeout(() => element?.classList.remove('highlight-pulse'), 2000)
      }, 100)
    }
  },
  {
    id: 'onboarding-complete',
    title: '🚀 Ready to Begin!',
    description: 'You\'re all set! Start by setting your first goal. Remember, consistency beats intensity!',
    selector: '.dashboard-hero',
    position: 'bottom'
  }
]

export function TutorialTourProvider({ children }: { children: ReactNode }) {
  const [isTourActive, setIsTourActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [tourType, setTourType] = useState<'regular' | 'onboarding'>('regular')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const checkTourStatus = () => {
      try {
        const user = AuthService.getCurrentUser()
        const lastLogin = localStorage.getItem('last_login')
        const tourCompleted = localStorage.getItem('tour_completed')
        const onboardingTourCompleted = localStorage.getItem('onboarding_tour_completed')
        
        // Check if user just completed profile (onboardingStep 4)
        if (user?.onboardingStep === 4 && !onboardingTourCompleted) {
          // Show onboarding tour for new users who just completed profile
          setTimeout(() => {
            showOnboardingTour(user)
          }, 1000)
          localStorage.setItem('onboarding_tour_completed', 'true')
        } else if (!lastLogin) {
          // New user without profile completion
          setTimeout(() => {
            startTour()
          }, 2000)
        } else if (lastLogin) {
          // Check if it's been more than 1 week
          const lastLoginDate = new Date(lastLogin)
          const oneWeekAgo = new Date()
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
          
          if (lastLoginDate < oneWeekAgo && !tourCompleted) {
            setTimeout(() => {
              startTour()
            }, 3000)
          }
        }
        
        // Update last login
        localStorage.setItem('last_login', new Date().toISOString())
      } catch (error) {
        console.error('Error checking tour status:', error)
      }
    }

    checkTourStatus()
  }, [isClient])

  const startTour = () => {
    setIsTourActive(true)
    setCurrentStep(0)
    setTourType('regular')
    document.body.style.overflow = 'hidden'
  }

  const showOnboardingTour = (user: User) => {
    setIsTourActive(true)
    setCurrentStep(0)
    setTourType('onboarding')
    document.body.style.overflow = 'hidden'
  }

  const nextStep = () => {
    const steps = tourType === 'onboarding' ? onboardingSteps : tutorialSteps
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      completeTour()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const skipTour = () => {
    setIsTourActive(false)
    document.body.style.overflow = 'auto'
    
    if (tourType === 'regular') {
      localStorage.setItem('tour_completed', 'true')
    }
  }

  const completeTour = () => {
    setIsTourActive(false)
    
    if (tourType === 'regular') {
      localStorage.setItem('tour_completed', 'true')
      
      // Update user stats
      const stats = {
        streak: 1,
        totalHours: 0,
        completedTasks: 0,
        consistency: 85
      }
      AuthService.updateUserStats(stats)
    }
    
    document.body.style.overflow = 'auto'
  }

  const getCurrentStep = () => {
    const steps = tourType === 'onboarding' ? onboardingSteps : tutorialSteps
    return steps[currentStep] || null
  }

  const getTotalSteps = () => {
    return tourType === 'onboarding' ? onboardingSteps.length : tutorialSteps.length
  }

  return (
    <TutorialTourContext.Provider
      value={{
        isTourActive,
        currentStep,
        totalSteps: getTotalSteps(),
        startTour,
        nextStep,
        prevStep,
        skipTour,
        completeTour,
        getCurrentStep,
        showOnboardingTour
      }}
    >
      {children}
      {isClient && isTourActive && (
        <TutorialTourOverlay 
          step={getCurrentStep()!}
          currentStep={currentStep}
          totalSteps={getTotalSteps()}
          tourType={tourType}
          onNext={nextStep}
          onPrev={prevStep}
          onSkip={skipTour}
        />
      )}
    </TutorialTourContext.Provider>
  )
}

function TutorialTourOverlay({ 
  step, 
  currentStep, 
  totalSteps,
  tourType,
  onNext,
  onPrev,
  onSkip 
}: { 
  step: TutorialStep
  currentStep: number
  totalSteps: number
  tourType: 'regular' | 'onboarding'
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
}) {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    const updatePosition = () => {
      setTimeout(() => {
        const element = document.querySelector(step.selector)
        if (element) {
          const rect = element.getBoundingClientRect()
          setPosition({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
          })

          // Scroll element into view
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
          })

          // Execute action if defined
          if (step.action) {
            step.action()
          }
        }
      }, 100)
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [step])

  const getTooltipPosition = () => {
    const gap = 20
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    let calculatedPosition = step.position
    
    // Adjust position if tooltip would go out of viewport
    switch (step.position) {
      case 'top':
        if (position.top < 300) calculatedPosition = 'bottom'
        break
      case 'bottom':
        if (position.top + position.height > viewportHeight - 300) calculatedPosition = 'top'
        break
      case 'left':
        if (position.left < 300) calculatedPosition = 'right'
        break
      case 'right':
        if (position.left + position.width > viewportWidth - 300) calculatedPosition = 'left'
        break
    }
    
    switch (calculatedPosition) {
      case 'top':
        return { 
          top: Math.max(20, position.top - gap),
          left: position.left + position.width / 2,
          transform: 'translate(-50%, -100%)'
        }
      case 'bottom':
        return { 
          top: Math.min(viewportHeight - 300, position.top + position.height + gap),
          left: position.left + position.width / 2,
          transform: 'translate(-50%, 0)'
        }
      case 'left':
        return { 
          top: position.top + position.height / 2,
          left: Math.max(20, position.left - gap),
          transform: 'translate(-100%, -50%)'
        }
      case 'right':
        return { 
          top: position.top + position.height / 2,
          left: Math.min(viewportWidth - 400, position.left + position.width + gap),
          transform: 'translate(0, -50%)'
        }
      default:
        return { top: 0, left: 0 }
    }
  }

  const tooltipPosition = getTooltipPosition()

  if (!isVisible) return null

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
      />

      {/* Highlight Box */}
      <motion.div
        initial={{ 
          scale: 0.8,
          opacity: 0 
        }}
        animate={{ 
          scale: 1,
          opacity: 1,
        }}
        className="fixed z-[9999] rounded-xl border-4 border-primary/70 shadow-2xl shadow-primary/30 bg-primary/10"
        style={{
          top: Math.max(10, position.top - 8),
          left: Math.max(10, position.left - 8),
          width: Math.min(window.innerWidth - 20, position.width + 16),
          height: Math.min(window.innerHeight - 20, position.height + 16),
        }}
      />

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed z-[10000] bg-gradient-to-b from-background to-card rounded-2xl shadow-2xl border border-border max-w-sm w-full"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: tooltipPosition.transform
        }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold">{step.title}</h3>
            <div className="flex items-center gap-2">
              {tourType === 'onboarding' && (
                <span className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded">
                  Onboarding
                </span>
              )}
              <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                {currentStep + 1}/{totalSteps}
              </span>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-6 text-sm">
            {step.description}
          </p>

          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                onClick={onPrev}
                disabled={currentStep === 0}
                className="px-3 py-1.5 rounded-lg border border-input hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              >
                ← Back
              </button>
              <button
                onClick={onSkip}
                className="px-3 py-1.5 rounded-lg border border-input hover:bg-accent text-xs"
              >
                Skip
              </button>
            </div>
            
            <button
              onClick={onNext}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 font-medium text-sm"
            >
              {currentStep === totalSteps - 1 
                ? (tourType === 'onboarding' ? 'Start Journey! 🚀' : 'Get Started!') 
                : 'Next →'}
            </button>
          </div>
        </div>

        {/* Arrow */}
        <div className={`absolute w-4 h-4 bg-background border-b border-r border-border transform rotate-45 ${
          step.position === 'top' ? 'bottom-[-8px] left-1/2 -translate-x-1/2' :
          step.position === 'bottom' ? 'top-[-8px] left-1/2 -translate-x-1/2 border-t border-l border-b-0 border-r-0' :
          step.position === 'left' ? 'right-[-8px] top-1/2 -translate-y-1/2 border-t border-r border-b-0 border-l-0' :
          'left-[-8px] top-1/2 -translate-y-1/2 border-b border-l border-t-0 border-r-0'
        }`} />
      </motion.div>
    </>
  )
}

export const useTutorialTour = () => {
  const context = useContext(TutorialTourContext)
  if (!context) {
    throw new Error('useTutorialTour must be used within TutorialTourProvider')
  }
  return context
}

