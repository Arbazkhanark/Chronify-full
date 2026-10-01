// src/modules/user/user.oauth.service.ts
import { prisma } from '../../config/prisma'
import jwt from 'jsonwebtoken'
import { logger } from 'patal-log'

interface OAuthUserInput {
  provider: 'GOOGLE' | 'GITHUB'
  providerId: string
  email: string
  name: string
  avatarUrl: string | null
}

export class UserOAuthService {
  /**
   * Find an existing user by OAuth account, or by email.
   * If not found, create a new user + linked OAuthAccount.
   *
   * Also returns JWT tokens for the frontend.
   */
  static async findOrCreateOAuthUser(input: OAuthUserInput) {
    const { provider, providerId, email, name, avatarUrl } = input

    // 1️⃣ Try to find an existing OAuthAccount
    const existingOAuth = await prisma.oAuthAccount.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
      include: { user: true },
    })

    if (existingOAuth) {
      logger.info('OAuth login: existing OAuth account', {
        functionName: 'UserOAuthService.findOrCreateOAuthUser',
        metadata: { userId: existingOAuth.userId, provider },
      })

      // Update lastLogin
      await prisma.user.update({
        where: { id: existingOAuth.userId },
        data: { lastLogin: new Date(), isOnline: true },
      })

      return existingOAuth.user
    }

    // 2️⃣ No OAuthAccount → check if a user with this email exists
    let user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      logger.info('OAuth login: linking to existing email user', {
        functionName: 'UserOAuthService.findOrCreateOAuthUser',
        metadata: { userId: user.id, provider },
      })

      // Link this OAuth account to the existing user
      await prisma.oAuthAccount.create({
        data: {
          userId: user.id,
          provider,
          providerId,
          email,
          name,
          avatarUrl,
        },
      })

      // If existing user wasn't verified, mark them verified (OAuth
      // providers already verify the email)
      if (!user.verified) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            verified: true,
            lastLogin: new Date(),
            isOnline: true,
          },
        })
      } else {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date(), isOnline: true },
        })
      }

      return user
    }

    // 3️⃣ Completely new user → create user + OAuthAccount + Profile
    logger.info('OAuth signup: creating new user', {
      functionName: 'UserOAuthService.findOrCreateOAuthUser',
      metadata: { email, provider },
    })

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password:'', //
        // password is null for OAuth users — they can set it later
        verified: true, // OAuth provider already verified the email
        timezone: 'Asia/Kolkata',
        lastLogin: new Date(),
        isOnline: true,
        profile: {
          create: {
            userName: `user_${Math.random().toString(36).slice(2, 10)}`,
            avatarUrl,
          },
        },
        oauthAccounts: {
          create: {
            provider,
            providerId,
            email,
            name,
            avatarUrl,
          },
        },
      },
    })

    logger.info('OAuth signup: user created', {
      functionName: 'UserOAuthService.findOrCreateOAuthUser',
      metadata: { userId: newUser.id },
    })

    return newUser
  }

  /**
   * Generate JWT tokens for a logged-in user.
   * Same format as email/password login.
   */
  static generateTokens(userId: string) {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' },
    )

    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' },
    )

    return { accessToken, refreshToken }
  }
}