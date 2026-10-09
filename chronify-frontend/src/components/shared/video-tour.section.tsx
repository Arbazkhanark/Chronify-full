//src/components/shared/video-tour.section.tsx
'use client'

import { useState } from 'react'
import { Play, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function VideoTourSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  // 🔥 YAHAN APNI VIDEO KA URL DAALO
  // YouTube embed ke liye: "https://www.youtube.com/embed/VIDEO_ID"
  // Vimeo embed ke liye: "https://player.vimeo.com/video/VIDEO_ID"
  // Local video ke liye: "/videos/tour.mp4"
  const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ" // placeholder - apna URL daalo

  return (
    <section className="relative py-16 md:py-24 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm font-medium text-primary">Platform Tour</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            See How Chronify Works
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Watch a quick tour to understand how to plan smart, stay consistent, and boost your productivity with our platform.
          </p>
        </div>

        {/* Video Thumbnail / Player */}
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-purple-500/30 to-primary/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />

          <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/50 bg-card shadow-2xl">
            {!isVideoOpen ? (
              // Thumbnail with play button
              <button
                onClick={() => setIsVideoOpen(true)}
                className="w-full h-full flex items-center justify-center relative cursor-pointer group/play"
                aria-label="Play video tour"
              >
                {/* Thumbnail background gradient (agar custom thumbnail image nahi hai) */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-purple-500/20" />

                {/* Optional: thumbnail image */}
                {/* <img 
                  src="/images/tour-thumbnail.jpg" 
                  alt="Platform Tour" 
                  className="absolute inset-0 w-full h-full object-cover"
                /> */}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover/play:bg-black/40 transition-colors" />

                {/* Play Button */}
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/95 flex items-center justify-center shadow-2xl group-hover/play:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 md:w-10 md:h-10 text-primary fill-primary ml-1" />
                  </div>
                  <span className="text-white font-semibold text-lg md:text-xl drop-shadow-lg">
                    Watch Tour
                  </span>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-4 right-4 z-10 px-3 py-1 rounded-md bg-black/70 backdrop-blur-sm">
                  <span className="text-white text-sm font-medium">2:30</span>
                </div>
              </button>
            ) : (
              // Video iframe
              <div className="relative w-full h-full">
                <iframe
                  src={`${videoUrl}?autoplay=1&rel=0`}
                  title="Chronify Platform Tour"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                {/* Close button */}
                <button
                  onClick={() => setIsVideoOpen(false)}
                  className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-sm flex items-center justify-center transition-colors"
                  aria-label="Close video"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 md:mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Ready to get started?
          </p>
          <Button
            size="lg"
            className="rounded-full px-8"
            onClick={() => {
              window.location.href = '/auth/register'
            }}
          >
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </section>
  )
}