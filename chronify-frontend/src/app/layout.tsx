// src/app/layout.tsx
import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'
import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"
import FCMProvider from "@/components/shared/FCMProvider"
import { MobileBottomNav } from "@/components/shared/MobileBottomNav"

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Chronify - Student Productivity',
  description: 'Plan smart, study consistent, and succeed faster with time management for students.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.className} antialiased bg-background text-foreground`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem 
          disableTransitionOnChange
          storageKey="studyflow-theme"
        >
          <Header />

          <div className="pb-16 md:pb-0">
            {children}
            {/* Hide footer on mobile, show on md and up */}
            <div className="hidden md:block">
              <Footer />
            </div>
          </div>

          <MobileBottomNav />
        </ThemeProvider>
      </body>
    </html>
  )
}