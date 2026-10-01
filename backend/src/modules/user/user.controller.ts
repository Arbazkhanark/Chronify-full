// src/modules/user/user.controller.ts
import { Request, Response } from "express";
import { UserService } from "./user.service";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
} from "./user.validation";
import { AppError } from "../../utils/AppError";
import { logger } from "patal-log";
import { UserRepository } from "./user.repository";
import { ZodError } from "zod";

/* ============================================================================
   🔥 HELPER: Handle Zod validation errors properly
   ============================================================================ */
function handleZodError(err: unknown, res: Response): boolean {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.flatten().fieldErrors,
    });
    return true; // handled
  }
  return false; // not a Zod error
}

export class UserController {
  static async signup(req: Request, res: Response) {
    try {
      const payload = signupSchema.parse(req.body);

      logger.info("Signup API called", {
        functionName: "UserController.signup",
        metadata: { email: payload.email },
      });

      const user = await UserService.signup(payload);

      logger.info("Signup API success", {
        functionName: "UserController.signup",
        metadata: { userId: user.id },
      });

      res.status(201).json({
        success: true,
        message: "Signup successful",
        data: user,
      });
    } catch (err: any) {
      logger.error(`Signup failed: ${err.message}`, {
        functionName: "UserController.signup",
        error: err.message,
      });

      if (handleZodError(err, res)) return;

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async verify(req: Request, res: Response) {
    try {
      const { token } = req.query;

      logger.info("Verification API called", {
        functionName: "UserController.verification",
        metadata: {},
      });

      const user = await UserService.verifyEmail(token as string);

      logger.info("Verification API success", {
        functionName: "UserController.verification",
        metadata: { userId: user },
      });

      res.status(201).json({
        success: true,
        message: "User verification successful",
        data: user,
      });
    } catch (err: any) {
      logger.error(`Verification failed: ${err.message}`, {
        functionName: "UserController.verification",
        error: err.message,
      });

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async resendVerificationLink(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email || typeof email !== "string") {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      logger.info("Resend verification link API called", {
        functionName: "UserController.resendVerificationLink",
        metadata: { email },
      });

      await UserService.resendVerificationLink(email);

      logger.info("Resend verification link API success", {
        functionName: "UserController.resendVerificationLink",
        metadata: { email },
      });

      // 🔐 Security best-practice: same response whether email exists or not
      return res.status(200).json({
        success: true,
        message:
          "If the email is registered and unverified, a new verification link has been sent.",
      });
    } catch (err: any) {
      logger.error(`Resend verification failed: ${err.message}`, {
        functionName: "UserController.resendVerificationLink",
        error: err.message,
      });

      if (handleZodError(err, res)) return;

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const payload = loginSchema.parse(req.body);

      logger.info("Login API called", {
        functionName: "UserController.login",
        metadata: { email: payload.email },
      });

      const result = await UserService.login(payload);

      logger.info("Login API success", {
        functionName: "UserController.login",
        metadata: { userId: result.user.id },
      });

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (err: any) {
      logger.error(`Login failed: ${err.message}`, {
        functionName: "UserController.login",
        error: err.message,
      });

      if (handleZodError(err, res)) return;

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);

      logger.info("Forgot password API called", {
        functionName: "UserController.forgotPassword",
        metadata: { email },
      });

      await UserService.forgotPassword(email);

      res.json({
        success: true,
        message: "If the email exists, a reset link has been sent",
      });
    } catch (err: any) {
      logger.error(`Forgot password failed: ${err.message}`, {
        functionName: "UserController.forgotPassword",
        error: err.message,
      });

      if (handleZodError(err, res)) return;

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = resetPasswordSchema.parse(req.body);

      logger.info("Reset password API called", {
        functionName: "UserController.resetPassword",
      });

      await UserService.resetPassword(token, newPassword);

      res.json({
        success: true,
        message: "Password reset successful",
      });
    } catch (err: any) {
      logger.error(`Reset password failed: ${err.message}`, {
        functionName: "UserController.resetPassword",
        error: err.message,
      });

      if (handleZodError(err, res)) return;

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);

      logger.info("Change password API called", {
        functionName: "UserController.changePassword",
        metadata: { userId: req.user },
      });

      await UserService.changePassword(
        req.user!.id,
        oldPassword,
        newPassword
      );

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (err: any) {
      logger.error(`Change password failed: ${err.message}`, {
        functionName: "UserController.changePassword",
        error: err.message,
      });

      if (handleZodError(err, res)) return;

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const data = updateProfileSchema.parse(req.body);
      console.log(data, "Updated Data")

      logger.info("Update profile API called", {
        functionName: "UserController.updateProfile",
        metadata: {
          userId: req.user!.id,
        },
      });

      const profile = await UserService.updateProfile(
        req.user!.id,
        data
      );

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: profile,
      });
    } catch (err: any) {
      logger.error(`Update profile failed: ${err.message}`, {
        functionName: "UserController.updateProfile",
        error: err.message,
      });

      if (handleZodError(err, res)) return;

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async profile(req: Request, res: Response) {
    try {
      logger.info("Profile API called", {
        functionName: "UserController.profile",
        metadata: { userId: req.user!.id },
      });

      const user = await UserService.getProfile(req.user!.id);

      res.json({
        success: true,
        data: user,
      });
    } catch (err: any) {
      logger.error(`Profile fetch failed: ${err.message}`, {
        functionName: "UserController.profile",
        error: err.message,
      });

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }



  static async getPublicProfile(req: Request, res: Response) {
    try {
      const usernameParam = req.params.username;
      const username = Array.isArray(usernameParam)
        ? usernameParam[0]
        : usernameParam;
      const viewerId = (req).user?.id; // optional

      logger.info("Get public profile API called", {
        functionName: "UserController.getPublicProfile",
        metadata: { username, viewerId },
      });

      const profile = await UserService.getPublicProfile(username, viewerId);

      return res.status(200).json({
        success: true,
        message: "Public profile fetched successfully",
        data: profile,
      });
    } catch (err: any) {
      logger.error(`Get public profile failed: ${err.message}`, {
        functionName: 'UserController.getPublicProfile',
        error: err.message,
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        })
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      logger.info("Logout API called", {
        functionName: "UserController.logout",
        metadata: { userId },
      });

      await UserService.logout(userId);

      return res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (err: any) {
      logger.error(`Logout failed: ${err.message}`, {
        functionName: "UserController.logout",
        error: err.message,
      });

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async getFullDetailedProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      logger.info("Get full detailed profile API called", {
        functionName: "UserController.getFullDetailedProfile",
        metadata: { userId },
      });

      const profile = await UserService.getFullDetailedProfile(userId);

      return res.status(200).json({
        success: true,
        message: "Full profile fetched successfully",
        data: profile,
      });
    } catch (err: any) {
      logger.error(
        `Get full detailed profile failed: ${err.message}`,
        {
          functionName: "UserController.getFullDetailedProfile",
          error: err.message,
        }
      );

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async saveFcmToken(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const userId = req.user!.id;

      if (!token) {
        throw new AppError("FCM token is required", 400);
      }

      logger.info("Saving FCM token", {
        functionName: "UserController.saveFcmToken",
        metadata: { userId },
      });

      await UserService.saveFcmToken(userId, token);

      res.json({
        success: true,
        message: "FCM token saved successfully",
      });
    } catch (err: any) {
      logger.error("Save FCM token failed", {
        functionName: "UserController.saveFcmToken",
        error: err.message,
      });

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}