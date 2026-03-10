'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Briefcase, Search, ArrowLeft, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { AuthService } from '@/hooks/useAuth'

export default function DetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'student'
  
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    // Initialize form based on role
    if (role === 'student') {
      setFormData({
        educationLevel: '',
        field: '',
        institution: '',
        graduationYear: '',
      })
    } else if (role === 'employed') {
      setFormData({
        profession: '',
        company: '',
        experience: '',
        field: '',
      })
    } else if (role === 'unemployed') {
      setFormData({
        seeking: '',
        field: '',
        lastWorked: '',
      })
    } else {
      setFormData({
        description: '',
      })
    }
  }, [role])

  const getRoleConfig = () => {
    switch (role) {
      case 'student':
        return {
          icon: GraduationCap,
          title: 'Student Details',
          description: 'Tell us about your studies',
          color: 'from-blue-500 to-cyan-500'
        }
      case 'employed':
        return {
          icon: Briefcase,
          title: 'Professional Details',
          description: 'Tell us about your work',
          color: 'from-purple-500 to-pink-500'
        }
      case 'unemployed':
        return {
          icon: Search,
          title: 'Career Details',
          description: 'Tell us about your goals',
          color: 'from-orange-500 to-red-500'
        }
      default:
        return {
          icon: GraduationCap,
          title: 'Your Details',
          description: 'Tell us about yourself',
          color: 'from-green-500 to-emerald-500'
        }
    }
  }

  const config = getRoleConfig()
  const Icon = config.icon

  const handleSubmit = async () => {
    // Basic validation
    let isValid = true
    let errorMessage = ''

    if (role === 'student') {
      if (!formData.educationLevel || !formData.field || !formData.institution) {
        isValid = false
        errorMessage = 'Please fill all required fields'
      }
    } else if (role === 'employed') {
      if (!formData.profession || !formData.company || !formData.experience || !formData.field) {
        isValid = false
        errorMessage = 'Please fill all required fields'
      }
    } else if (role === 'unemployed') {
      if (!formData.seeking || !formData.field) {
        isValid = false
        errorMessage = 'Please fill what you\'re seeking and your field'
      }
    }

    if (!isValid) {
      toast.error(errorMessage)
      return
    }

    setIsLoading(true)
    try {
      AuthService.saveDetails({ ...formData, role })
      toast.success('Details saved successfully!')
      router.push('/onboarding/profile')
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStudentForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Education Level *</label>
        <select
          value={formData.educationLevel || ''}
          onChange={(e) => setFormData({...formData, educationLevel: e.target.value})}
          className="w-full h-12 rounded-xl border-2 border-input bg-background/50 px-4 focus:border-primary/50 focus:outline-none"
        >
          <option value="">Select level</option>
          <option value="school">School</option>
          <option value="undergraduate">Undergraduate</option>
          <option value="graduate">Graduate</option>
          <option value="phd">PhD</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Field of Study *</label>
        <Input
          placeholder="e.g., Computer Science, Business, Medicine"
          value={formData.field || ''}
          onChange={(e) => setFormData({...formData, field: e.target.value})}
          className="h-12 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Institution Name *</label>
        <Input
          placeholder="e.g., Amity University, Delhi University"
          value={formData.institution || ''}
          onChange={(e) => setFormData({...formData, institution: e.target.value})}
          className="h-12 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Expected Graduation Year</label>
        <Input
          type="number"
          placeholder="e.g., 2025"
          value={formData.graduationYear || ''}
          onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
          className="h-12 rounded-xl"
          min={2024}
          max={2030}
        />
      </div>
    </div>
  )

  const renderEmployedForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Profession *</label>
        <Input
          placeholder="e.g., Software Engineer, Marketing Manager"
          value={formData.profession || ''}
          onChange={(e) => setFormData({...formData, profession: e.target.value})}
          className="h-12 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Company Name *</label>
        <Input
          placeholder="e.g., Google, Amazon, Startup XYZ"
          value={formData.company || ''}
          onChange={(e) => setFormData({...formData, company: e.target.value})}
          className="h-12 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Years of Experience *</label>
        <select
          value={formData.experience || ''}
          onChange={(e) => setFormData({...formData, experience: e.target.value})}
          className="w-full h-12 rounded-xl border-2 border-input bg-background/50 px-4 focus:border-primary/50 focus:outline-none"
        >
          <option value="">Select experience</option>
          <option value="0-1">0-1 years</option>
          <option value="1-3">1-3 years</option>
          <option value="3-5">3-5 years</option>
          <option value="5+">5+ years</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Industry/Field *</label>
        <Input
          placeholder="e.g., Technology, Finance, Healthcare"
          value={formData.field || ''}
          onChange={(e) => setFormData({...formData, field: e.target.value})}
          className="h-12 rounded-xl"
        />
      </div>
    </div>
  )

  const renderUnemployedForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">What are you seeking? *</label>
        <select
          value={formData.seeking || ''}
          onChange={(e) => setFormData({...formData, seeking: e.target.value})}
          className="w-full h-12 rounded-xl border-2 border-input bg-background/50 px-4 focus:border-primary/50 focus:outline-none"
        >
          <option value="">Select option</option>
          <option value="job">Full-time Job</option>
          <option value="internship">Internship</option>
          <option value="freelance">Freelance Work</option>
          <option value="learning">Learning/Skill Development</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Field of Interest *</label>
        <Input
          placeholder="e.g., Web Development, Data Science, Design"
          value={formData.field || ''}
          onChange={(e) => setFormData({...formData, field: e.target.value})}
          className="h-12 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Last Worked/Studied</label>
        <Input
          placeholder="e.g., 2023, or 'Recently graduated'"
          value={formData.lastWorked || ''}
          onChange={(e) => setFormData({...formData, lastWorked: e.target.value})}
          className="h-12 rounded-xl"
        />
      </div>
    </div>
  )

  const renderOtherForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">What are you currently doing?</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Tell us about your current activities, projects, or goals..."
          className="w-full min-h-[120px] rounded-xl border-2 border-input bg-background/50 p-4 focus:border-primary/50 focus:outline-none resize-none"
        />
      </div>
    </div>
  )

  const handleBack = () => {
    router.push('/onboarding/role')
  }

  const handleSkip = () => {
    router.push('/onboarding/profile')
    toast.success('You can add details later')
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
        className="w-full max-w-2xl relative"
      >
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold">1</span>
            </div>
            <span className="font-medium">Tell Us About You</span>
          </div>
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold">2</span>
            </div>
            <span className="font-medium">More Details</span>
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
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center`}
              >
                <Icon className="w-10 h-10 text-white" />
              </motion.div>
              <CardTitle className="text-3xl text-center font-bold">
                {config.title}
              </CardTitle>
              <CardDescription className="text-center text-lg">
                {config.description}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {role === 'student' && renderStudentForm()}
                {role === 'employed' && renderEmployedForm()}
                {role === 'unemployed' && renderUnemployedForm()}
                {role === 'other' && renderOtherForm()}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-border"
              >
                <div className="flex gap-4 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                  >
                    Skip for now
                  </Button>
                </div>
                
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full sm:w-auto h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg font-medium gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
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