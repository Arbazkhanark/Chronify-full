'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Camera, Globe, Lock, Phone, MapPin, Calendar, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { AuthService } from '@/hooks/useAuth'

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    bio: '',
    city: '',
    state: '',
    country: '',
    timezone: 'Asia/Kolkata',
    accountType: 'public',
    phoneNumber: '',
    hobbies: '',
    socialLinks: '',
  })

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName) {
      toast.error('Please enter your name')
      return
    }

    setIsLoading(true)
    try {
      const profileData = {
        ...formData,
        avatarUrl,
        hobbies: formData.hobbies.split(',').map(h => h.trim()).filter(h => h),
        socialLinks: formData.socialLinks.split(',').map(l => l.trim()).filter(l => l),
      }
      
      AuthService.saveProfile(profileData)
      toast.success('Profile completed successfully! 🎉')
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    router.push('/dashboard')
    toast.success('You can complete your profile later')
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
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold">3</span>
            </div>
            <span className="font-medium">Profile Setup</span>
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
                <User className="w-10 h-10 text-white" />
              </motion.div>
              <CardTitle className="text-3xl text-center font-bold">
                Complete Your Profile
              </CardTitle>
              <CardDescription className="text-center text-lg">
                Personalize your Chronify AI experience
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-8">
              {/* Avatar Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden border-4 border-background shadow-lg">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload a profile picture (optional)
                </p>
              </motion.div>

              {/* Basic Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    First Name *
                  </label>
                  <Input
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name *</label>
                  <Input
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="h-12 rounded-xl"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <textarea
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full min-h-[100px] rounded-xl border-2 border-input bg-background/50 p-4 focus:border-primary/50 focus:outline-none resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              </motion.div>

              {/* Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    City
                  </label>
                  <Input
                    placeholder="New Delhi"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">State</label>
                  <Input
                    placeholder="Delhi"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Country</label>
                  <Input
                    placeholder="India"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="h-12 rounded-xl"
                  />
                </div>
              </motion.div>

              {/* Account Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Account Privacy
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, accountType: 'public'})}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.accountType === 'public'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium">Public</div>
                          <div className="text-xs text-muted-foreground">Visible to everyone</div>
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, accountType: 'private'})}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.accountType === 'private'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium">Private</div>
                          <div className="text-xs text-muted-foreground">Only visible to you</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className="h-12 rounded-xl"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional - For important notifications
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Hobbies & Interests
                  </label>
                  <Input
                    placeholder="Reading, Coding, Sports, Music (comma separated)"
                    value={formData.hobbies}
                    onChange={(e) => setFormData({...formData, hobbies: e.target.value})}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Social Links</label>
                  <Input
                    placeholder="https://github.com/username, https://linkedin.com/in/username"
                    value={formData.socialLinks}
                    onChange={(e) => setFormData({...formData, socialLinks: e.target.value})}
                    className="h-12 rounded-xl"
                  />
                  <p className="text-xs text-muted-foreground">
                    Add links separated by commas
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
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
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full sm:w-auto h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg font-medium"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Completing...
                    </>
                  ) : (
                    'Complete Setup'
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