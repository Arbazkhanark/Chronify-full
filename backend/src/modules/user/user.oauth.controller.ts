// src/modules/user/user.oauth.controller.ts
import { Request, Response } from 'express'
import { UserOAuthService } from './user.oauth.service'
import { logger } from 'patal-log'
import jwt from 'jsonwebtoken'

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

export class UserOAuthController {
  /**
   * GET /auth/google/callback
   * Passport already verified the user in the strategy.
   * req.user contains the DB user.
   */
  static googleCallback(req: Request, res: Response) {
    return UserOAuthController.handleCallback(req, res, 'google')
  }

  static githubCallback(req: Request, res: Response) {
    return UserOAuthController.handleCallback(req, res, 'github')
  }

  private static handleCallback(req: Request, res: Response, provider: string) {
    try {
      const user = req.user as
        | { id: string; email: string; name: string; verified: boolean }
        | undefined

      if (!user) {
        logger.warn('OAuth callback without user', {
          functionName: `UserOAuthController.${provider}Callback`,
        })
        return res.redirect(
          `${FRONTEND_URL}/auth/login?error=oauth_failed`,
        )
      }

      // Generate app JWT tokens
      const { accessToken, refreshToken } =
        UserOAuthService.generateTokens(user.id)

      logger.info('OAuth callback success', {
        functionName: `UserOAuthController.${provider}Callback`,
        metadata: { userId: user.id, provider },
      })

      // Redirect to frontend with tokens in the query string.
      // The frontend `/auth/callback` page will read them, store
      // in localStorage, then redirect to /dashboard.
      const params = new URLSearchParams({
        access_token: accessToken,
        refresh_token: refreshToken,
      })

      return res.redirect(
        `${FRONTEND_URL}/auth/callback?${params.toString()}`,
      )
    } catch (err: any) {
      logger.error('OAuth callback failed', {
        functionName: `UserOAuthController.${provider}Callback`,
        error: err.message,
      })
      return res.redirect(
        `${FRONTEND_URL}/auth/login?error=oauth_failed`,
      )
    }
  }
}