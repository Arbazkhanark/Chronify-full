// src/modules/user/user.routes.ts
import { Router } from 'express'
import passport from 'passport'
import { UserController } from './user.controller'
import { UserOAuthController } from './user.oauth.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { rateLimiter } from '../../middlewares/rate.limiter'
import { optionalAuthMiddleware } from '../../middlewares/optional-auth.middleware'

const router = Router()

/* ============================================================================
   AUTH — EMAIL / PASSWORD
   ============================================================================ */

router.post('/signup', rateLimiter, UserController.signup)
router.get('/verify', rateLimiter, UserController.verify)
router.post('/resend-verification-link', UserController.resendVerificationLink)
router.post('/login', UserController.login)
router.post('/forgot-password', rateLimiter, UserController.forgotPassword)
router.post('/reset-password', UserController.resetPassword)

/* ============================================================================
   AUTH — OAUTH (GOOGLE + GITHUB)
   ============================================================================ */

// --- Google ---
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  }),
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/auth/login?error=oauth_failed`,
  }),
  UserOAuthController.googleCallback,
)

// --- GitHub ---
router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email'],
    session: false,
  }),
)

router.get(
  '/github/callback',
  passport.authenticate('github', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/auth/login?error=oauth_failed`,
  }),
  UserOAuthController.githubCallback,
)

/* ============================================================================
   AUTH — PROTECTED
   ============================================================================ */

router.post('/change-password', authMiddleware, UserController.changePassword)
router.put('/profile', authMiddleware, UserController.updateProfile)
router.get('/full-profile', optionalAuthMiddleware, UserController.getFullDetailedProfile) // New route to get full profile
router.get('/me', authMiddleware, UserController.profile)
router.get('/get-profile-by-username', optionalAuthMiddleware, UserController.getPublicProfile)
router.post('/save-fcm-token', authMiddleware, UserController.saveFcmToken)
// User suggestions ("People you may know")
router.get('/suggestions', authMiddleware, UserController.getSuggestions)


export default router