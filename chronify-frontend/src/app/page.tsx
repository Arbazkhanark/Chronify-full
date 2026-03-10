'use client'

import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { HeroSection } from '@/components/shared/hero.section'
import { FeaturesSection } from '@/components/shared/features.section'
import { HowItWorks } from '@/components/shared/how.it.works'
import { HeatmapSection } from '@/components/shared/heatmap.section'
import { Testimonials } from '@/components/shared/testimonial'
import { CTASection } from '@/components/shared/cta.section'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* <Header /> */}
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <HeatmapSection />
      <Testimonials />
      <CTASection />
      {/* <Footer /> */}
    </main>
  )
}