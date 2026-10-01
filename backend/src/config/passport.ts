// src/config/passport.ts
import passport from 'passport'
import { Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyCallback } from 'passport-google-oauth20'
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2'
import { UserOAuthService } from '../modules/user/user.oauth.service'
import { logger } from 'patal-log'

/* ============================================================================
   GOOGLE STRATEGY
   ============================================================================ */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['profile', 'email'],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: VerifyCallback,
    ) => {
      try {
        logger.info('Google OAuth callback received', {
          functionName: 'GoogleStrategy.verify',
          metadata: { googleId: profile.id },
        })

        const email = profile.emails?.[0]?.value
        if (!email) {
          return done(new Error('No email returned from Google'), undefined)
        }

        const user = await UserOAuthService.findOrCreateOAuthUser({
          provider: 'GOOGLE',
          providerId: profile.id,
          email,
          name: profile.displayName || profile.username || email.split('@')[0],
          avatarUrl: profile.photos?.[0]?.value ?? null,
        })

        return done(null, user)
      } catch (err) {
        logger.error('Google OAuth verify failed', {
          functionName: 'GoogleStrategy.verify',
          metadata: { error: (err as Error).message },
        })
        return done(err as Error, undefined)
      }
    },
  ),
)

/* ============================================================================
   GITHUB STRATEGY
   ============================================================================ */

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
      scope: ['user:email'],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: VerifyCallback,
    ) => {
      try {
        logger.info('GitHub OAuth callback received', {
          functionName: 'GitHubStrategy.verify',
          metadata: { githubId: profile.id },
        })

        // GitHub may hide email; use primary email from profile or fall back
        let email = profile.emails?.[0]?.value

        if (!email) {
          // Try to fetch emails via GitHub API
          const res = await fetch('https://api.github.com/user/emails', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/vnd.github+json',
            },
          })
          if (res.ok) {
            const emails = (await res.json()) as Array<{
              email: string
              primary: boolean
              verified: boolean
            }>
            const primary = emails.find((e) => e.primary && e.verified)
            email = primary?.email ?? emails[0]?.email
          }
        }

        if (!email) {
          return done(new Error('No email returned from GitHub'), undefined)
        }

        const user = await UserOAuthService.findOrCreateOAuthUser({
          provider: 'GITHUB',
          providerId: profile.id,
          email,
          name: profile.displayName || profile.username || email.split('@')[0],
          avatarUrl: profile.photos?.[0]?.value ?? null,
        })

        return done(null, user)
      } catch (err) {
        logger.error('GitHub OAuth verify failed', {
          functionName: 'GitHubStrategy.verify',
          metadata: { error: (err as Error).message },
        })
        return done(err as Error, undefined)
      }
    },
  ),
)

export default passport