// // src/modules/user/user.routes.ts
// import { Router } from "express";
// import { UserController } from "./user.controller";
// import { authMiddleware } from "../../middlewares/auth.middleware";
// import { rateLimiter } from "../../middlewares/rate.limiter";


// const router = Router();

// router.post("/signup",rateLimiter, UserController.signup);                         //Tested
// router.get("/verify", rateLimiter, UserController.verify);                          //Tested
// router.post('/resend-verification-link',UserController.resendVerificationLink);
// router.post("/login", UserController.login);                           //Tested
// router.post("/forgot-password", rateLimiter, UserController.forgotPassword);        //Tested
// router.post("/reset-password", UserController.resetPassword);                       //Tested

// router.post("/change-password", authMiddleware, UserController.changePassword);     //Tested
// router.put("/profile", authMiddleware, UserController.updateProfile);
// router.get("/me", authMiddleware, UserController.profile);                          //Tested
// router.get('/get-profile-by-username',UserController.getPublicProfile)

// router.post("/save-fcm-token", authMiddleware, UserController.saveFcmToken);

// export default router;













// src/modules/user/user.routes.ts
import { Router } from 'express'
import passport from 'passport'
import { UserController } from './user.controller'
import { UserOAuthController } from './user.oauth.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { rateLimiter } from '../../middlewares/rate.limiter'

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
router.get('/me', authMiddleware, UserController.profile)
router.get('/get-profile-by-username', UserController.getPublicProfile)
router.post('/save-fcm-token', authMiddleware, UserController.saveFcmToken)

export default router