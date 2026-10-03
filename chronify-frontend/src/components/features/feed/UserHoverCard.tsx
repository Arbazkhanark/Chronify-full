// src/components/social/UserHoverCard.tsx
'use client'

import Link from 'next/link'
import {
  GraduationCap,
  Briefcase,
  MapPin,
  BookOpen,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { usePublicProfile } from '@/hooks/usePublicProfile'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

interface UserHoverCardProps {
  username: string
  fallbackName: string
  fallbackAvatarUrl?: string | null
  children: React.ReactNode
}

export function UserHoverCard({
  username,
  fallbackName,
  fallbackAvatarUrl,
  children,
}: UserHoverCardProps) {
  const { profile, isLoading} = usePublicProfile(username)

  const initials = (profile?.name ?? fallbackName)?.slice(0, 2).toUpperCase() ?? 'U'

  // Compute education / study info
  const currentEducation = profile?.education?.find((e) => e.isCurrent)
  const anyEducation = profile?.education?.[0]
  const primaryEducation = currentEducation ?? anyEducation
  const currentExperience = profile?.experience?.find((e) => e.isCurrent)

  const isStudent = profile?.accountType === 'STUDENT' || !!primaryEducation

  return (
    <HoverCard openDelay={250} closeDelay={150}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>

      <HoverCardContent className="w-80 p-0 overflow-hidden" align="start">
        {/* Banner */}
        <div className="h-14 bg-gradient-to-br from-primary/80 to-accent/80" />

        <div className="px-4 pb-4">
          {/* Avatar + name */}
          <div className="flex items-end justify-between -mt-8 mb-3">
            <Avatar className="w-16 h-16 border-4 border-background">
              <AvatarImage
                src={profile?.avatarUrl ?? fallbackAvatarUrl ?? undefined}
              />
              <AvatarFallback className="text-base font-semibold bg-gradient-to-br from-primary to-accent text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            <Link href={`/u/${username}`} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="h-8 gap-1.5">
                View Profile
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {/* Name + username */}
          <div className="mb-3">
            <p className="font-semibold text-sm truncate">
              {profile?.name ?? fallbackName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              @{username}
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-2.5 text-xs">
              {/* Bio */}
              {profile?.bio && (
                <p className="text-foreground/80 line-clamp-2">
                  {profile.bio}
                </p>
              )}

              {/* Student: Where + What studying */}
              {isStudent && primaryEducation && (
                <div className="flex items-start gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-foreground/90 font-medium truncate">
                      {primaryEducation.degree}
                      {primaryEducation.field && ` · ${primaryEducation.field}`}
                    </p>
                    <p className="text-muted-foreground truncate">
                      {primaryEducation.institution}
                      {primaryEducation.endYear &&
                        !primaryEducation.isCurrent &&
                        ` · ${primaryEducation.endYear}`}
                      {primaryEducation.isCurrent && ' · Currently'}
                    </p>
                  </div>
                </div>
              )}

              {/* Working professional */}
              {!isStudent && currentExperience && (
                <div className="flex items-start gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-foreground/90 font-medium truncate">
                      {currentExperience.role}
                    </p>
                    <p className="text-muted-foreground truncate">
                      {currentExperience.organization}
                    </p>
                  </div>
                </div>
              )}

              {/* Profession (fallback) */}
              {!isStudent && !currentExperience && profile?.profession && (
                <div className="flex items-start gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-foreground/90 truncate">
                    {profile.profession}
                  </p>
                </div>
              )}

              {/* Location */}
              {(profile?.city || profile?.country) && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <p className="text-muted-foreground truncate">
                    {[profile.city, profile.state, profile.country]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              )}

              {/* Interests / fields */}
              {profile?.subFields && profile.subFields.length > 0 && (
                <div className="flex items-start gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex flex-wrap gap-1">
                    {profile.subFields.slice(0, 3).map((f) => (
                      <Badge
                        key={f}
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0"
                      >
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}