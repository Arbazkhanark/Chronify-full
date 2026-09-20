'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, Sparkles, Calendar, Clock, TrendingUp, Target, Zap, Users, Award, Star } from 'lucide-react'
import { motion, useAnimation } from 'framer-motion'
import Link from 'next/link'

export function CTASection() {
  const controls = useAnimation()
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  const features = [
    { text: 'AI-generated timetable in 2 minutes', icon: Calendar, color: 'text-blue-600' },
    { text: 'Priority-based task scheduling', icon: Target, color: 'text-green-600' },
    { text: 'Progress tracking with analytics', icon: TrendingUp, color: 'text-purple-600' },
    { text: 'Time optimization for maximum efficiency', icon: Clock, color: 'text-orange-600' },
  ]

  const timetableItems = [
    { time: '6:30 AM', task: 'Wake up + Plan day', type: 'personal', color: 'bg-gray-400' },
    { time: '7:10 AM', task: 'Commute: DSA Audio Learning', type: 'learning', color: 'bg-blue-500' },
    { time: '9:30 AM', task: 'College Classes', type: 'academic', color: 'bg-green-500' },
    { time: '2:00 PM', task: 'DSA Practice Session', type: 'learning', color: 'bg-blue-500' },
    { time: '5:10 PM', task: 'Commute: Revision', type: 'learning', color: 'bg-blue-500' },
    { time: '8:00 PM', task: 'Project Work', type: 'project', color: 'bg-purple-500' },
    { time: '10:30 PM', task: 'DSA Deep Dive', type: 'learning', color: 'bg-blue-500' },
  ]

  const timeDistribution = [
    { label: 'DSA Practice', percentage: 55, hours: '32-35 hrs', color: 'bg-blue-600' },
    { label: 'College Studies', percentage: 18, hours: '10-12 hrs', color: 'bg-green-600' },
    { label: 'Project Work', percentage: 15, hours: '8-10 hrs', color: 'bg-purple-600' },
    { label: 'Commute Learning', percentage: 12, hours: '8-10 hrs', color: 'bg-gray-600' },
  ]

  const stats = [
    { value: '10K+', label: 'Active Students', icon: Users },
    { value: '95%', label: 'Satisfaction Rate', icon: Star },
    { value: '180+', label: 'DSA Questions Solved', icon: Target },
    { value: '40%', label: 'Productivity Gain', icon: TrendingUp },
  ]

  useEffect(() => {
    const sequence = async () => {
      await controls.start({ opacity: 1, y: 0, transition: { duration: 0.6 } })
    }
    sequence()
  }, [controls])

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto">
        {/* Main CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
        >
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-50" />
          
          <div className="relative p-8 md:p-12 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-blue-500/30 mb-8"
                >
                  <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Limited Time Offer
                  </span>
                </motion.div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                  <span className="block text-gray-900 dark:text-gray-100">Master Your Time,</span>
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%] animate-gradient">
                    Master Your Future
                  </span>
                </h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl leading-relaxed"
                >
                  Join thousands of students who transformed their academic journey with AI-powered scheduling. 
                  Achieve placement success while maintaining academic excellence.
                </motion.p>

                {/* Features List */}
                <div className="space-y-4 mb-10">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onMouseEnter={() => setHoveredItem(index)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <motion.div
                        animate={hoveredItem === index ? { rotate: 10, scale: 1.1 } : { rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`flex-shrink-0 w-12 h-12 rounded-lg ${feature.color.replace('text', 'bg')}/10 flex items-center justify-center`}
                      >
                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                      </motion.div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 mb-8"
                >
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto rounded-xl px-10 py-7 text-base font-semibold gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
                    >
                      <span>Start Free Trial</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/demo" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto rounded-xl px-10 py-7 text-base font-semibold border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-300"
                    >
                      Watch Live Demo
                    </Button>
                  </Link>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No credit card required • 14-day free trial • Cancel anytime</span>
                </motion.p>
              </motion.div>

              {/* Right Content - Interactive Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 2, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"
                />
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                    rotate: [0, -2, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl"
                />

                {/* Preview Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-2xl">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                          <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Smart Timetable</h3>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-500">AI-generated schedule for MCA students</p>
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 rounded-full border-2 border-dashed border-blue-500/30 flex items-center justify-center"
                    >
                      <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                  </div>

                  {/* Timetable Items */}
                  <div className="space-y-4 mb-10">
                    {timetableItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ x: 5, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4 min-w-28">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.time}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-gray-100">{item.task}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-500 capitalize mt-1">{item.type}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-6">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Weekly Time Allocation</h4>
                    <div className="space-y-4">
                      {timeDistribution.map((item, index) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{item.hours}</span>
                          </div>
                          <div className="h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.percentage}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                              className={`h-full ${item.color} rounded-full relative`}
                            >
                              <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                              />
                            </motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats Footer */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {stats.map((stat, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                          whileHover={{ scale: 1.05 }}
                          className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                        >
                          <stat.icon className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <div className="max-w-3xl mx-auto p-12 rounded-2xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 border border-blue-500/20 dark:border-blue-500/30 backdrop-blur-sm">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6"
            >
              Ready to Transform Your Academic Journey?
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto"
            >
              Join 10,000+ students who have improved their academic performance and placement success.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/signup">
                <Button size="lg" className="rounded-xl px-12 py-7 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started Now
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="rounded-xl px-12 py-7 text-base font-semibold border-2">
                  View All Plans
                </Button>
              </Link>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm text-gray-500 dark:text-gray-500 mt-6"
            >
              All features included in free trial • Cancel anytime • 24/7 support
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* CSS Animation */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 200% auto;
        }
      `}</style>
    </section>
  )
}