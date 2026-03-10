'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Briefcase, UserSearch, Users, ArrowRight, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { AuthService } from '@/hooks/useAuth'

export default function RoleSelectionPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'School, College, or University student',
      icon: GraduationCap,
      gradient: 'from-blue-500 to-cyan-500',
      details: 'Tell us about your studies and goals'
    },
    {
      id: 'employed',
      title: 'Employed Professional',
      description: 'Working full-time or part-time',
      icon: Briefcase,
      gradient: 'from-purple-500 to-pink-500',
      details: 'Share your profession and work schedule'
    },
    {
      id: 'unemployed',
      title: 'Currently Unemployed',
      description: 'Seeking job, internship, or skill development',
      icon: UserSearch,
      gradient: 'from-orange-500 to-red-500',
      details: 'Tell us about your career goals'
    },
    {
      id: 'other',
      title: 'Other',
      description: 'Freelancer, entrepreneur, or pursuing passion',
      icon: Users,
      gradient: 'from-green-500 to-emerald-500',
      details: 'Share what you\'re working on'
    },
  ]

  const handleContinue = async () => {
    if (!selectedRole) {
      toast.error('Please select your role')
      return
    }

    setIsLoading(true)
    try {
      AuthService.saveRole(selectedRole)
      toast.success('Great! Now tell us more about yourself')
      router.push(`/onboarding/details?role=${selectedRole}`)
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    router.push('/dashboard')
    toast.success('You can update this later')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-accent/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl relative"
      >
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold">1</span>
            </div>
            <span className="font-medium">Tell Us About You</span>
          </div>
          <div className="w-12 h-1 bg-border rounded-full" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center">
              <span className="text-muted-foreground">2</span>
            </div>
            <span className="text-muted-foreground">More Details</span>
          </div>
          <div className="w-12 h-1 bg-border rounded-full" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center">
              <span className="text-muted-foreground">3</span>
            </div>
            <span className="text-muted-foreground">Profile Setup</span>
          </div>
        </div>

        <Card className="border-border/50 shadow-2xl backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <div className="flex flex-col items-center space-y-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
              <CardTitle className="text-3xl text-center font-bold">
                Tell Us About Yourself
              </CardTitle>
              <CardDescription className="text-center text-lg">
                This helps us personalize your Chronify AI experience
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {roles.map((role, index) => {
                    const Icon = role.icon
                    return (
                      <motion.div
                        key={role.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          onClick={() => setSelectedRole(role.id)}
                          className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                            selectedRole === role.id
                              ? 'border-primary bg-primary/5 shadow-lg'
                              : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold mb-1">{role.title}</h3>
                              <p className="text-muted-foreground mb-2">{role.description}</p>
                              <p className="text-sm text-primary font-medium">{role.details}</p>
                            </div>
                            {selectedRole === role.id && (
                              <div className="ml-auto w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <span className="text-white text-sm">✓</span>
                              </div>
                            )}
                          </div>
                        </button>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-border"
              >
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  className="w-full sm:w-auto"
                >
                  Skip for now
                </Button>
                
                <Button
                  onClick={handleContinue}
                  disabled={!selectedRole || isLoading}
                  className="w-full sm:w-auto h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg font-medium gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Continuing...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}