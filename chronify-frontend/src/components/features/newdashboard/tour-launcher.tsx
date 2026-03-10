// // src/components/features/dashboard/tour-launcher.tsx
// 'use client'

// import { useTutorialTour } from '@/contexts/tutorial-tour-context'
// import { Sparkles, X } from 'lucide-react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { useEffect, useState } from 'react'

// export function TourLauncher() {
//   const { startTour, isTourActive } = useTutorialTour()
//   const [showLauncher, setShowLauncher] = useState(false)

//   useEffect(() => {
//     // Show launcher after 5 seconds if tour not active
//     const timer = setTimeout(() => {
//       const hasSeenTour = localStorage.getItem('tour_seen')
//       if (!hasSeenTour && !isTourActive) {
//         setShowLauncher(true)
//       }
//     }, 5000)

//     return () => clearTimeout(timer)
//   }, [isTourActive])

//   const handleStartTour = () => {
//     setShowLauncher(false)
//     localStorage.setItem('tour_seen', 'true')
//     startTour()
//   }

//   const handleClose = () => {
//     setShowLauncher(false)
//     localStorage.setItem('tour_seen', 'true')
//   }

//   return (
//     <AnimatePresence>
//       {showLauncher && (
//         <motion.div
//           initial={{ opacity: 0, y: 50, scale: 0.9 }}
//           animate={{ opacity: 1, y: 0, scale: 1 }}
//           exit={{ opacity: 0, y: 50, scale: 0.9 }}
//           className="fixed bottom-6 right-6 z-40"
//         >
//           <div className="relative">
//             {/* Floating Launcher */}
//             <div className="bg-gradient-to-br from-primary/20 via-background to-background border border-primary/20 rounded-2xl shadow-2xl p-6 max-w-sm backdrop-blur-sm">
//               <button
//                 onClick={handleClose}
//                 className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-accent transition-colors"
//               >
//                 <X className="w-4 h-4 text-muted-foreground" />
//               </button>

//               <div className="flex items-start gap-3 mb-4">
//                 <div className="p-2 rounded-full bg-gradient-to-br from-primary to-accent">
//                   <Sparkles className="w-5 h-5 text-primary-foreground" />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-lg mb-1">Welcome to Chronify! 👋</h3>
//                   <p className="text-sm text-muted-foreground">
//                     Take a quick tour to learn how to make the most of your dashboard.
//                   </p>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <button
//                   onClick={handleStartTour}
//                   className="w-full py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
//                 >
//                   Start Guided Tour
//                 </button>
//                 <button
//                   onClick={handleClose}
//                   className="w-full py-3 border border-input rounded-lg font-medium hover:bg-accent transition-colors"
//                 >
//                   Maybe Later
//                 </button>
//               </div>
//             </div>

//             {/* Connector Line */}
//             <div className="absolute -top-4 right-12 w-0.5 h-4 bg-gradient-to-b from-transparent to-primary/50" />
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   )
// }























// src/components/features/dashboard/tour-launcher.tsx (Simplified)
'use client'

import { useTutorialTour } from '@/contexts/tutorial-tour-context'
import { Sparkles, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export function TourLauncher() {
  const { startTour, isTourActive } = useTutorialTour()
  const [showLauncher, setShowLauncher] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || isTourActive) return

    const timer = setTimeout(() => {
      const hasSeenTour = localStorage.getItem('tour_seen')
      const tourCompleted = localStorage.getItem('tour_completed')
      
      if (!hasSeenTour && !tourCompleted) {
        setShowLauncher(true)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [isTourActive])

  const handleStartTour = () => {
    setShowLauncher(false)
    localStorage.setItem('tour_seen', 'true')
    startTour()
  }

  const handleClose = () => {
    setShowLauncher(false)
    localStorage.setItem('tour_seen', 'true')
  }

  if (showLauncher) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <div className="relative">
          <div className="bg-gradient-to-br from-background via-card to-card border border-border/50 rounded-2xl shadow-2xl p-6 max-w-sm backdrop-blur-sm">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-accent transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-full bg-gradient-to-br from-primary to-accent">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Welcome to Chronify! 👋</h3>
                <p className="text-sm text-muted-foreground">
                  Take a 2-minute tour to learn how to make the most of your dashboard.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleStartTour}
                className="w-full py-2.5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
              >
                Start Guided Tour
              </button>
              <button
                onClick={handleClose}
                className="w-full py-2.5 border border-input rounded-lg font-medium hover:bg-accent transition-colors text-sm"
              >
                Explore on My Own
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return null
}