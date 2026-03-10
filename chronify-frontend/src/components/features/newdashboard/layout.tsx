// // src/app/dashboard/layout.tsx
// 'use client'

// import { DashboardHeader } from "./header"
// import { Sidebar } from "./sidebar"

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
//       <Sidebar />
//       <div className="lg:ml-64">
//         <DashboardHeader />
//         <main className="min-h-[calc(100vh-80px)]">
//           {children}
//         </main>
//       </div>
//     </div>
//   )
// }













// // src/app/dashboard/layout.tsx
// 'use client'

// import { useState } from 'react'
// import { cn } from '@/lib/utils'
// import { Sidebar } from './sidebar'
// import { Header } from './header'

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
//       <Sidebar 
//         collapsed={sidebarCollapsed} 
//         onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
//       />
//       <Header sidebarCollapsed={sidebarCollapsed} />
//       <main className={cn(
//         "min-h-[calc(100vh-80px)] transition-all duration-300",
//         sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
//       )}>
//         {children}
//       </main>
//     </div>
//   )
// }












// // src/app/dashboard/layout.tsx (Updated)
// 'use client'

// import { useState } from 'react'
// import { cn } from '@/lib/utils'
// import { Sidebar } from './sidebar'
// import { Header } from './header'
// import { TutorialTourProvider } from '@/contexts/tutorial-tour-context'
// import { TourLauncher } from './tour-launcher'

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

//   return (
//     <TutorialTourProvider>
//       <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
//         <Sidebar 
//           collapsed={sidebarCollapsed} 
//           onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
//         />
//         <Header sidebarCollapsed={sidebarCollapsed} />
//         <main className={cn(
//           "min-h-[calc(100vh-80px)] transition-all duration-300",
//           sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
//         )}>
//           {children}
//         </main>
//         <TourLauncher />
//       </div>
//     </TutorialTourProvider>
//   )
// }
























// // src/app/dashboard/layout.tsx (Simplified)
// 'use client'

// import { useState } from 'react'
// import { cn } from '@/lib/utils'
// import { Sidebar } from './sidebar'
// import { Header } from './header'
// import { TourLauncher } from './tour-launcher'
// // import { TourLauncher } from '@/components/features/dashboard/tour-launcher'

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
//       <Sidebar 
//         collapsed={sidebarCollapsed} 
//         onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
//       />
//       <Header sidebarCollapsed={sidebarCollapsed} />
//       <main className={cn(
//         "min-h-[calc(100vh-80px)] transition-all duration-300",
//         sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
//       )}>
//         {children}
//       </main>
//       <TourLauncher />
//     </div>
//   )
// }