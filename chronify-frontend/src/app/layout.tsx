// src/app/layout.tsx
import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'
import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"
import { TutorialTourProvider } from '@/contexts/tutorial-tour-context'
import FCMProvider from "@/components/shared/FCMProvider"
import { MobileBottomNav } from "@/components/shared/MobileBottomNav"

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Chronify AI - AI-Powered Student Productivity',
  description: 'Plan smart, study consistent, and succeed faster with AI-powered time management for students.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.className} antialiased bg-background text-foreground`}>
        {/* <TutorialTourProvider> */}
          <ThemeProvider 
            attribute="class" 
            defaultTheme="dark" 
            enableSystem 
            disableTransitionOnChange
            storageKey="studyflow-theme"
          >
            <Header />

            {/* <FCMProvider /> */}

            {/*
              🔥 MOBILE BOTTOM NAV KE LIYE:
              - `pb-16` → mobile pe 64px bottom padding (nav = 56px + buffer)
              - `md:pb-0` → desktop pe padding hatao (nav hidden hai wahan)

              Ye padding ZAROORI hai, warna bottom nav content ko dhak legi.
              Ise ek wrapper me daala hai taaki Footer bhi affected ho.
            */}
            <div className="pb-16 md:pb-0">
              {children}
              <Footer />
            </div>

            {/* 🔥 Mobile bottom navigation — sirf mobile pe, sirf logged-in users ke liye */}
            <MobileBottomNav />
          </ThemeProvider>
        {/* </TutorialTourProvider> */}
      </body>
    </html>
  )
}