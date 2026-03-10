// // src/components/dashboard/header.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { Bell, Search, Sun, Moon, Sparkles, User } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { useTheme } from 'next-themes'
// import { AuthService } from '@/hooks/useAuth'

// interface HeaderProps {
//   sidebarCollapsed: boolean
// }

// export function Header({ sidebarCollapsed }: HeaderProps) {
//   const [mounted, setMounted] = useState(false)
//   const { theme, setTheme } = useTheme()
//   const [notifications, setNotifications] = useState(3)
//   const user = AuthService.getCurrentUser()

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   const greeting = () => {
//     const hour = new Date().getHours()
//     if (hour < 12) return 'Good Morning'
//     if (hour < 17) return 'Good Afternoon'
//     return 'Good Evening'
//   }

//   const motivationalQuotes = [
//     "Consistency is the key to mastery.",
//     "Small steps every day lead to big results.",
//     "Your future self will thank you.",
//     "Stay focused, stay consistent.",
//     "Progress, not perfection.",
//   ]

//   const [quote, setQuote] = useState('')

//   useEffect(() => {
//     const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
//     setQuote(randomQuote)
//   }, [])

//   if (!mounted) return null

//   return (
//     <motion.header
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className={cn(
//         "sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 transition-all duration-300",
//         sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
//       )}
//     >
//       <div className="px-6 py-4">
//         <div className="flex items-center justify-between">
//           {/* Left Side - Search */}
//           <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//               <input
//                 type="text"
//                 placeholder="Search tasks, goals, or schedule..."
//                 className="w-full pl-10 pr-4 py-2 rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm"
//               />
//             </div>
//           </div>

//           {/* Center - Welcome & Quote */}
//           <div className="flex-1 md:text-center px-4">
//             <motion.div
//               key={quote}
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="hidden md:block"
//             >
//               <div className="flex items-center justify-center gap-2">
//                 <Sparkles className="w-4 h-4 text-yellow-500" />
//                 <p className="text-sm text-muted-foreground truncate max-w-md">{quote}</p>
//               </div>
//             </motion.div>
//           </div>

//           {/* Right Side */}
//           <div className="flex items-center gap-3">
//             {/* Mobile Search */}
//             <button className="md:hidden p-2 hover:bg-secondary rounded-lg">
//               <Search className="w-5 h-5" />
//             </button>

//             {/* Theme Toggle */}
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//               className="rounded-xl"
//             >
//               {theme === 'dark' ? (
//                 <Sun className="w-5 h-5" />
//               ) : (
//                 <Moon className="w-5 h-5" />
//               )}
//             </Button>

//             {/* Notifications */}
//             <div className="relative">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="rounded-xl relative"
//               >
//                 <Bell className="w-5 h-5" />
//                 {notifications > 0 && (
//                   <motion.span
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
//                   >
//                     {notifications}
//                   </motion.span>
//                 )}
//               </Button>
//             </div>

//             {/* User Profile */}
//             <div className="flex items-center gap-3 pl-3 border-l border-border">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden">
//                 {user?.avatarUrl ? (
//                   <img src={user.avatarUrl} alt={user.firstName} className="w-full h-full object-cover" />
//                 ) : (
//                   <User className="w-5 h-5 text-white" />
//                 )}
//               </div>
//               <div className="hidden md:block">
//                 <p className="text-sm font-medium">
//                   {greeting()}, {user?.firstName}
//                 </p>
//                 <p className="text-xs text-muted-foreground">{user?.role || 'Member'}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.header>
//   )
// }

// function cn(...classes: string[]) {
//   return classes.filter(Boolean).join(' ')
// }