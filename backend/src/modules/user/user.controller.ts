// import { Request, Response } from "express";
// import { UserService } from "./user.service";
// import { getLiveTraceId, logger } from "patal-log";
// import { AppError } from "../../utils/AppError";

// export class UserController {
//   static async signup(req: Request, res: Response) {
    
//     try {
//       logger.info("Signup API called", {
//         functionName: "UserController.signup",
//         metadata: { email: req.body?.email },
//       });

//       const user = await UserService.signup(req.body);

//       logger.info("User signup successful", {
//         functionName: "UserController.signup",
//         metadata: { userId: user.id },
//       });

//       res.status(201).json({ success: true, user });
//     } catch (err: any) {
//       logger.error(`Signup failed cause ${err.message}`, {
//         functionName: "UserController.signup",
//         error: err?.message,
//         metadata: { email: req.body?.email },
//       });
//       res.status(400).json({ success: false, message: err.message });
//     }
//   }

//   static async login(req: Request, res: Response) {
    
//     try {
//       logger.info("Login API called", {
//         functionName: "UserController.login",
//         metadata: { email: req.body?.email },
//       });

//       const user = await UserService.login(req.body);

//       logger.info("User login successful", {
//         functionName: "UserController.login",
//         metadata: { userId: user.id },
//       });

//       return res.status(200).json({
//         success: true,
//         message: "Login successful",
//         data: user,
//       });
//     } catch (err: any) {
//       logger.error(`Login failed cause ${err.message}`, {
//         functionName: "UserController.login",
//         error: err?.message,
//         metadata: { email: req.body?.email },
//       });

//       if (err instanceof AppError) {
//         return res.status(err.statusCode).json({
//           success: false,
//           message: err.message,
//           code: err.code,
//         });
//       }

//       return res.status(500).json({
//         success: false,
//         message: "Internal server error",
//       });
//     }
//   }

//   static async profile(req: Request, res: Response) {
    
//     try {
//       const userId = req.headers["x-user-id"] as string;

//       logger.info("Profile API called", {
//         functionName: "UserController.profile",
//         metadata: { userId },
//       });

//       const user = await UserService.getProfile(userId);

//       logger.info("Profile fetch successful", {
//         functionName: "UserController.profile",
//         metadata: { userId },
//       });

//       res.json({ success: true, user });
//     } catch (err: any) {
//       logger.error(`Profile fetch failed cause ${err.message}`, {
//         functionName: "UserController.profile",
//         error: err?.message,
//       });
//       res.status(404).json({ success: false, message: err.message });
//     }
//   }
// }





// import { Request, Response } from "express";
// import { UserService } from "./user.service";
// import { signupSchema, loginSchema } from "./user.validation";
// import { AuthRequest } from "../../middlewares/auth.middleware";
// import { logger } from "patal-log";

// export class UserController {
//   static async signup(req: Request, res: Response) {
//     const payload = signupSchema.parse(req.body);
//     const user = await UserService.signup(payload);

//     res.status(201).json({
//       success: true,
//       message: "Signup successful",
//       data: user,
//     });
//   }

//   static async login(req: Request, res: Response) {
//     const payload = loginSchema.parse(req.body);
//     const result = await UserService.login(payload);

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       data: result,
//     });
//   }

//   static async profile(req: AuthRequest, res: Response) {
//     const user = await UserService.getProfile(req.user!.id);

//     res.status(200).json({
//       success: true,
//       data: user,
//     });
//   }
// }














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
import { AuthRequest } from "../../middlewares/auth.middleware";
import { AppError } from "../../utils/AppError";
import { logger } from "patal-log";

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
        metadata: {  },
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












  static async changePassword(req: AuthRequest, res: Response) {
    try {

      const { oldPassword, newPassword } =
      changePasswordSchema.parse(req.body);

      logger.info("Change password API called", {
        functionName: "UserController.changePassword",
        metadata: { userId: req.user!.id },
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

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const data = updateProfileSchema.parse(req.body);

      logger.info("Update profile API called", {
        functionName: "UserController.updateProfile",
        metadata: { userId: req.user!.id },
      });

      const profile = await UserService.updateProfile(req.user!.id, data);

      res.json({
        success: true,
        data: profile,
      });
    } catch (err: any) {
      logger.error(`Update profile failed: ${err.message}`, {
        functionName: "UserController.updateProfile",
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

  static async profile(req: AuthRequest, res: Response) {
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
}
