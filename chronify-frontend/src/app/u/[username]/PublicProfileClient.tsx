// src/app/u/[username]/PublicProfileClient.tsx
'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast, Toaster } from 'sonner'
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Calendar,
  Building2,
  GraduationCap,
  Briefcase,
  Award,
  MapPinned,
  Link as LinkIcon,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Lock,
  Flame,
  TrendingUp,
  Target,
  Loader2,
  UserPlus,
  MessageSquare,
  Share2,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { usePublicProfile } from '@/hooks/usePublicProfile'
import { cn } from '@/lib/utils'
import { ConnectionService } from '@/lib/connection-service'

/* ============================================================================
   CONSTANTS
   ============================================================================ */

const SOCIAL_ICONS: Record<string, any> = {
  GITHUB: Github,
  LINKEDIN: Linkedin,
  TWITTER: Twitter,
  FACEBOOK: Globe,
  INSTAGRAM: Globe,
  YOUTUBE: Globe,
  TIKTOK: Globe,
  OTHER: Globe,
}

const SOCIAL_LABELS: Record<string, string> = {
  GITHUB: 'GitHub',
  LINKEDIN: 'LinkedIn',
  TWITTER: 'Twitter',
  FACEBOOK: 'Facebook',
  INSTAGRAM: 'Instagram',
  YOUTUBE: 'YouTube',
  TIKTOK: 'TikTok',
  OTHER: 'Website',
}

const EMPLOYMENT_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  SELF_EMPLOYED: 'Self-employed',
  FREELANCE: 'Freelance',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  APPRENTICESHIP: 'Apprenticeship',
  SEASONAL: 'Seasonal',
}

const LOCATION_LABELS: Record<string, string> = {
  ON_SITE: 'On-site',
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
}

/* ============================================================================
   HELPERS
   ============================================================================ */

const getInitials = (name: string): string => {
  if (!name || !name.trim()) return 'U'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const formatMemberSince = (dateString: string): string => {
  if (!dateString) return '—'
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

/* ============================================================================
   COMPONENT
   ============================================================================ */

export default function PublicProfileClient({
  username,
}: {
  username: string
}) {
  const router = useRouter()
  const { profile, isLoading, error, refetch } = usePublicProfile(username)

  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [sendingRequest, setSendingRequest] = useState(false)

  const publicUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return `${process.env.NEXT_PUBLIC_APP_URL || ''}/u/${username}`
    }
    return `${window.location.origin}/u/${username}`
  }, [username])

  /* ---------------- Share ---------------- */
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      toast.success('Link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy link')
    }
  }

  const handleNativeShare = async () => {
    if (typeof navigator === 'undefined' || !navigator.share) {
      setShowShareModal(true)
      return
    }
    try {
      await navigator.share({
        title: `${profile?.name || username} · Chronify`,
        text: `Check out ${profile?.name || username}'s profile on Chronify`,
        url: publicUrl,
      })
    } catch {
      /* user cancelled */
    }
  }

  /* ---------------- Connect ---------------- */
  const handleConnect = async () => {
    if (!profile) return
    if (profile.isConnected) {
      toast.info('Already connected')
      return
    }
    if (profile.isPending) {
      toast.info('Request already pending')
      return
    }

    setSendingRequest(true)
    try {
      await ConnectionService.sendRequest(profile.id)
      toast.success('Connection request sent!')
      await refetch()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send request')
    } finally {
      setSendingRequest(false)
    }
  }

  /* ============================================================
     LOADING
     ============================================================ */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading profile…
          </p>
        </div>
      </div>
    )
  }

  /* ============================================================
     ERROR STATES
     ============================================================ */
  if (error || !profile) {
    const isPrivate = error?.reason === 'PRIVATE'
    const isFriendsOnly = error?.reason === 'FRIENDS_ONLY'
    const isNotFound = error?.reason === 'NOT_FOUND'

    return (
      <>
        <Toaster position="top-right" richColors closeButton />

        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <CardContent className="p-8 text-center">
              <div
                className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
                  isPrivate || isFriendsOnly
                    ? 'bg-amber-100 dark:bg-amber-900/30'
                    : 'bg-red-100 dark:bg-red-900/30'
                )}
              >
                {isPrivate || isFriendsOnly ? (
                  <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                )}
              </div>

              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {isNotFound && 'Profile not found'}
                {isPrivate && 'This profile is private'}
                {isFriendsOnly && 'Connections only'}
                {!isNotFound && !isPrivate && !isFriendsOnly &&
                  'Could not load profile'}
              </h1>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {isNotFound &&
                  `We couldn't find a user with the username "${username}".`}
                {isPrivate &&
                  'This user has set their profile to private. Only they can see it.'}
                {isFriendsOnly &&
                  'This user shares their profile only with connections. Send a connection request to view it.'}
                {!isNotFound && !isPrivate && !isFriendsOnly &&
                  (error?.message || 'Please try again in a moment.')}
              </p>

              <div className="flex flex-col gap-2">
                <Button onClick={() => router.push('/dashboard')}>
                  Go to Dashboard
                </Button>
                {!isNotFound && !isPrivate && (
                  <Button variant="outline" onClick={refetch}>
                    Try again
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  /* ============================================================
     RENDER — FULL PROFILE
     ============================================================ */
  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
        {/* ==================== COVER ==================== */}
        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
          {profile.coverPhoto ? (
            <button
              type="button"
              onClick={() => setLightboxUrl(profile.coverPhoto!)}
              className="absolute inset-0 w-full h-full cursor-zoom-in group"
              aria-label="View cover photo"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.coverPhoto}
                alt={`${profile.name}'s cover`}
                className="absolute inset-0 w-full h-full object-cover object-center select-none"
                draggable={false}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </button>
          ) : (
            <div className="absolute inset-0" />
          )}

          {/* Top bar */}
          <div className="absolute top-0 inset-x-0 z-20 px-4 sm:px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm text-white/90 hover:text-white bg-black/20 hover:bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </Link>

              <button
                onClick={handleNativeShare}
                className="p-2 rounded-lg bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white transition-colors"
                aria-label="Share profile"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* ==================== HERO ==================== */}
          <div className="relative -mt-16 sm:-mt-20 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
              {/* Avatar */}
              <button
                type="button"
                onClick={() => {
                  if (profile.avatarUrl) setLightboxUrl(profile.avatarUrl)
                }}
                className="relative flex-shrink-0 rounded-full ring-4 ring-white dark:ring-gray-900 shadow-lg overflow-hidden group w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500 to-purple-500 cursor-zoom-in"
                aria-label="View profile picture"
              >
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-3xl font-semibold text-white">
                    {getInitials(profile.name)}
                  </span>
                )}
              </button>

              {/* Name + actions */}
              <div className="flex-1 bg-white dark:bg-gray-800 sm:bg-transparent sm:dark:bg-transparent rounded-xl sm:rounded-none p-4 sm:p-0 shadow-sm sm:shadow-none sm:pb-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {profile.name || `@${profile.userName}`}
                      </h1>

                      {profile.verified && (
                        <CheckCircle2
                          className="w-5 h-5 text-blue-500 flex-shrink-0"
                          aria-label="Verified"
                        />
                      )}

                      <Badge variant="outline" className="text-xs">
                        {profile.accountType === 'STUDENT'
                          ? 'Student'
                          : 'Mentor'}
                      </Badge>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      @{profile.userName}
                    </p>

                    {profile.profession && (
                      <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                        {profile.profession}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {profile.isOwnProfile ? (
                      <Link href="/dashboard/profile">
                        <Button size="sm" className="gap-2">
                          <ArrowLeft className="w-4 h-4" />
                          Go to Edit
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant={profile.isConnected ? 'outline' : 'default'}
                          onClick={handleConnect}
                          disabled={sendingRequest}
                          className="gap-2"
                        >
                          {sendingRequest ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Sending…
                            </>
                          ) : profile.isConnected ? (
                            <>
                              <Check className="w-4 h-4" />
                              Connected
                            </>
                          ) : profile.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4" />
                              Pending
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4" />
                              Connect
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toast.info('Messaging coming soon')}
                          className="gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Message
                        </Button>
                      </>
                    )}

                    <button
                      onClick={() => setShowShareModal(true)}
                      className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Share profile"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {profile.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 max-w-2xl">
                    {profile.bio}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mt-3">
                  {(profile.city || profile.country) && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {[profile.city, profile.country]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined {formatMemberSince(profile.memberSince)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== STATS ==================== */}
          {profile.stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                {
                  label: 'Goals',
                  value: `${profile.stats.completedGoals}/${profile.stats.totalGoals}`,
                  icon: Target,
                },
                {
                  label: 'Current Streak',
                  value: `${profile.stats.currentStreak}d`,
                  icon: Flame,
                },
                {
                  label: 'Hours Logged',
                  value: `${profile.stats.totalHours.toFixed(0)}h`,
                  icon: TrendingUp,
                },
                {
                  label: 'Tasks Done',
                  value: `${profile.stats.completedTasks}`,
                  icon: CheckCircle2,
                },
              ].map((stat) => (
                <Card
                  key={stat.label}
                  className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 h-full"
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                      <stat.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {stat.label}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* ==================== MAIN GRID ==================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT */}
            <div className="space-y-6">
              {/* About */}
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base dark:text-gray-200">
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    {profile.bio || 'No bio added yet.'}
                  </p>
                  {(profile.hobbies?.length ?? 0) > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                        Interests
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.hobbies.map((h) => (
                          <Badge
                            key={h}
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {h}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base dark:text-gray-200">
                    Skills & Focus Areas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(profile.fields?.length ?? 0) > 0 ? (
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                        Fields
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.fields.map((f) => (
                          <Badge
                            key={f}
                            className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-0"
                          >
                            {f}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      No fields added yet.
                    </p>
                  )}

                  {(profile.subFields?.length ?? 0) > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                        Specializations
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.subFields.map((f) => (
                          <Badge
                            key={f}
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {f}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Links */}
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base dark:text-gray-200">
                    Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(profile.socialLinks?.length ?? 0) === 0 && (
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      No links added.
                    </p>
                  )}
                  {profile.socialLinks.map((link) => {
                    const Icon = SOCIAL_ICONS[link.platform] ?? Globe
                    const label = SOCIAL_LABELS[link.platform] ?? 'Link'
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Icon className="w-4 h-4" /> {label}
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    )
                  })}
                </CardContent>
              </Card>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-2 space-y-6">
              {/* Education */}
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base dark:text-gray-200 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-gray-400" /> Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(profile.education?.length ?? 0) === 0 && (
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      No education added yet.
                    </p>
                  )}
                  {profile.education.map((edu) => (
                    <div
                      key={edu.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white flex-shrink-0">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {edu.degree}
                          {edu.field ? ` · ${edu.field}` : ''}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3" />
                          {edu.institution}
                        </p>
                        {(edu.startYear || edu.endYear) && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {edu.startYear || '—'} –{' '}
                            {edu.isCurrent ? 'Present' : edu.endYear || '—'}
                          </p>
                        )}
                        {edu.grade && (
                          <Badge
                            variant="outline"
                            className="text-[10px] mt-1.5"
                          >
                            <Award className="w-3 h-3 mr-1" /> {edu.grade}
                          </Badge>
                        )}
                        {edu.location && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                            <MapPinned className="w-3 h-3" /> {edu.location}
                          </p>
                        )}
                        {edu.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                            {edu.description}
                          </p>
                        )}
                        {edu.activities && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                            Activities: {edu.activities}
                          </p>
                        )}
                      </div>
                      {edu.isCurrent && (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] shrink-0">
                          Current
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Experience */}
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base dark:text-gray-200 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" /> Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(profile.experience?.length ?? 0) === 0 && (
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      No experience added yet.
                    </p>
                  )}
                  {profile.experience.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white flex-shrink-0 overflow-hidden">
                        {exp.companyLogo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={exp.companyLogo}
                            alt={exp.organization}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Briefcase className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {exp.role}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3" />
                          {exp.organization}
                          {exp.companyUrl && (
                            <a
                              href={exp.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                            >
                              visit
                            </a>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {EMPLOYMENT_LABELS[exp.employmentType] ||
                            exp.employmentType}{' '}
                          ·{' '}
                          {LOCATION_LABELS[exp.locationType] ||
                            exp.locationType}
                        </p>
                        {(exp.startDate || exp.endDate) && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {exp.startDate || '—'} –{' '}
                            {exp.isCurrent ? 'Present' : exp.endDate || '—'}
                          </p>
                        )}
                        {exp.location && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                            <MapPinned className="w-3 h-3" /> {exp.location}
                          </p>
                        )}
                        {exp.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed whitespace-pre-line">
                            {exp.description}
                          </p>
                        )}
                        {exp.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {exp.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                                className="text-[10px] font-normal"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      {exp.isCurrent && (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] shrink-0">
                          Current
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== SHARE MODAL ==================== */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 dark:text-gray-100">
              <Share2 className="w-5 h-5" /> Share this profile
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Anyone with this link can view {profile.name}&apos;s profile.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
              <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-700 dark:text-gray-300 truncate flex-1">
                {publicUrl}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyLink}
                className="flex-shrink-0 gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(`Check out ${profile.name}'s profile on Chronify`)}`,
                    '_blank'
                  )
                }}
              >
                <Twitter className="w-4 h-4" /> Twitter
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`,
                    '_blank'
                  )
                }}
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(`Check out ${profile.name}'s profile: ${publicUrl}`)}`,
                    '_blank'
                  )
                }}
              >
                <Globe className="w-4 h-4" /> WhatsApp
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ==================== LIGHTBOX ==================== */}
      <Dialog
        open={!!lightboxUrl}
        onOpenChange={(open) => !open && setLightboxUrl(null)}
      >
        <DialogContent className="max-w-4xl w-[92vw] bg-black/95 border-none p-2 sm:p-4">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          <DialogDescription className="sr-only">
            Full size preview
          </DialogDescription>

          {lightboxUrl && (
            <div className="relative w-full h-[80vh] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxUrl}
                alt="Preview"
                className="max-w-full max-h-full object-contain select-none"
                draggable={false}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}




