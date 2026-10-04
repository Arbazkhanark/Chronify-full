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
            <Header/>
            {/* <FCMProvider /> */}
            {children}
            <Footer/>
          </ThemeProvider>
        {/* </TutorialTourProvider> */}
      </body>
    </html>
  )
}