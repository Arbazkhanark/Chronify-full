// import bcrypt from "bcrypt";
// import { UserRepository } from "./user.repository";
// import { CreateUserDTO, LoginDTO } from "./user.types";
// import { AppError } from "../../utils/AppError";
// import { getLiveTraceId, logger } from "patal-log";

// export class UserService {
//   static async signup(data: CreateUserDTO) {
//     logger.info("Processing signup request", {
//       functionName: "UserService.signup",
//       metadata: { email: data.email },
//     });

//     const existing = await UserRepository.findByEmail(data.email);
//     if (existing) {
//       logger.warn("Signup failed - email already registered", {
//         functionName: "UserService.signup",
//         metadata: { email: data.email },
//       });
//       throw new AppError("Email already registered", 400);
//     }

//     const hashedPassword = await bcrypt.hash(data.password, 10);

//     const user = await UserRepository.create({
//       ...data,
//       password: hashedPassword,
//       timezone: data.timezone ?? "Asia/Kolkata",
//     });

//     logger.info("User created successfully", {
//       functionName: "UserService.signup",
//       metadata: { userId: user.id },
//     });

//     return user;
//   }

//   static async login(data: LoginDTO) {

//     logger.info("Processing login request", {
//       functionName: "UserService.login",
//       metadata: { email: data.email },
//     });

//     const user = await UserRepository.findByEmail(data.email);

//     if (!user) {
//       logger.warn("Login failed - user not found", {
//         functionName: "UserService.login",
//         metadata: { email: data.email },
//       });
//       throw new AppError("Invalid email or password", 401);
//     }

//     const isValid = await bcrypt.compare(data.password, user.password);

//     if (!isValid) {
//       logger.warn("Login failed - password mismatch", {
//         functionName: "UserService.login",
//         metadata: { userId: user.id },
//       });
//       throw new AppError("Invalid email or password", 401);
//     }

//     logger.info("Login validation passed", {
//       functionName: "UserService.login",
//       metadata: { userId: user.id },
//     });

//     return {
//       id: user.id,
//       email: user.email,
//       name: user.name,
//       timezone: user.timezone,
//     };
//   }

//   static async getProfile(userId: string) {
//     const traceId = getLiveTraceId();
//     logger.info("Fetching user profile", {
//       functionName: "UserService.getProfile",
//       metadata: { userId },
//     });

//     const user = await UserRepository.findById(userId);
//     if (!user) {
//       logger.warn("User profile not found", {
//         functionName: "UserService.getProfile",
//         metadata: { userId },
//       });
//       throw new AppError("User not found", 404);
//     }

//     logger.info("User profile fetched successfully", {
//       functionName: "UserService.getProfile",
//       metadata: { userId },
//     });

//     return user;
//   }
// }




// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { UserRepository } from "./user.repository";
// import { CreateUserDTO, LoginDTO } from "./user.types";
// import { AppError } from "../../utils/AppError";
// import { logger } from "patal-log";

// export class UserService {
//   static async signup(data: CreateUserDTO) {
//     logger.info("Processing signup request", {
//       functionName: "UserService.signup",
//       metadata: { email: data.email },
//     });

//     const exists = await UserRepository.findByEmail(data.email);
//     if (exists) throw new AppError("Email already registered", 400);

//     const hashedPassword = await bcrypt.hash(data.password, 12);

//     const user = await UserRepository.create({
//       ...data,
//       password: hashedPassword,
//       timezone: data.timezone ?? "Asia/Kolkata",
//     });

//     return user;
//   }

//   static async login(data: LoginDTO) {
//     logger.info("Processing login request", {
//       functionName: "UserService.login",
//       metadata: { email: data.email },
//     });

//     const user = await UserRepository.findByEmail(data.email);
//     if (!user) throw new AppError("Invalid email or password", 401);

//     const isValid = await bcrypt.compare(data.password, user.password);
//     if (!isValid) throw new AppError("Invalid email or password", 401);

//     const token = jwt.sign(
//       { userId: user.id },
//       process.env.JWT_SECRET!,
//       { expiresIn: "15m" }
//     );

//     return {
//       accessToken: token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         timezone: user.timezone,
//       },
//     };
//   }

//   static async getProfile(userId: string) {
//     const user = await UserRepository.findById(userId);
//     if (!user) throw new AppError("User not found", 404);
//     return user;
//   }
// }











// src/modules/user/user.service.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { UserRepository } from "./user.repository";
import { CreateUserDTO, LoginDTO } from "./user.types";
import { AppError } from "../../utils/AppError";
import { logger } from "patal-log";
import { emailTemplates } from "../email/email.template";
import { sendResetPasswordEmail, sendVerificationEmail } from "../email/email.helper";

export class UserService {
  static async signup(data: CreateUserDTO) {
  logger.info("Processing signup request", {
    functionName: "UserService.signup",
    metadata: { email: data.email },
  });

  const existingUser = await UserRepository.findByEmail(data.email);
  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await UserRepository.create({
    ...data,
    password: hashedPassword,
    timezone: data.timezone ?? "Asia/Kolkata",
    verified: false,
  });

  // 🔑 Email verification token
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      purpose: "email-verification",
    },
    process.env.SECRET_KEY!,
    { expiresIn: "15m" }
  );

  const verifyLink = `https://yourfrontendapp.com/verify-email?token=${token}`;

  await sendVerificationEmail(user.email, verifyLink);

  logger.info("Verification email sent", {
    functionName: "UserService.signup",
    metadata: { userId: user.id },
  });

  return user;
}




static async verifyEmail(token: string) {
  logger.info("Email verification attempt", {
    functionName: "UserService.verifyEmail",
  });

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.SECRET_KEY!);
  } catch (error: any) {
    logger.warn("Email verification failed - invalid token", {
      functionName: "UserService.verifyEmail",
      error: error.message,
    });
    throw new AppError("Invalid or expired verification link", 400);
  }

  if (decoded.purpose !== "email-verification") {
    throw new AppError("Invalid token purpose", 400);
  }

  const user = await UserRepository.findById(decoded.userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.verified) {
    return; // already verified → silent success
  }

  await UserRepository.updateUser(user.id, {
    verified: true,
  });

  logger.info("Email verified successfully", {
    functionName: "UserService.verifyEmail",
    metadata: { userId: user.id },
  });
}


  static async login(data: LoginDTO) {
    logger.info("Processing login request", {
      functionName: "UserService.login",
      metadata: { email: data.email },
    });

    const user = await UserRepository.findByEmail(data.email);
    if (!user) {
      logger.warn("Login failed - user not found", {
        functionName: "UserService.login",
        metadata: { email: data.email },
      });
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      logger.warn("Login failed - password mismatch", {
        functionName: "UserService.login",
        metadata: { userId: user.id },
      });
      throw new AppError("Invalid email or password", 401);
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    logger.info("Login successful, tokens issued", {
      functionName: "UserService.login",
      metadata: { userId: user.id },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        timezone: user.timezone,
      },
    };
  }



static async forgotPassword(email: string) {
  logger.info("Forgot password request received", {
    functionName: "UserService.forgotPassword",
    metadata: { email },
  });

  // Find user by email
  const user = await UserRepository.findByEmail(email);

  // 🔐 Security best-practice: Always return same response for security purposes
  if (!user) {
    logger.warn("Forgot password - User not found", {
      functionName: "UserService.forgotPassword",
      metadata: { email },
    });
    return; // Do not leak information about whether the user exists or not
  }

    logger.info("Token generating for preparing forgot password link", {
    functionName: "UserService.forgotPassword",
    metadata: { email },
  });

  // 🔑 Generate password reset token with user details and expiry (15 minutes)
  const token = jwt.sign(
    { userId: user.id, email: user.email },  // User details in the payload
    process.env.SECRET_KEY || 'huyhiuhh87uhewgyugw98uy783',                             // Secret key for signing the token
    { expiresIn: '15m' }                    // Token expiry set to 15 minutes
  );

  logger.info("Token generated for preparing forgot password link", {
    functionName: "UserService.forgotPassword",
    metadata: { email },
  });

  // 📧 Send password reset email (Frontend will generate the link with the token)
  const resetLink = `https://yourfrontendapp.com/reset-password?token=${token}`;
  await sendResetPasswordEmail(user.email, resetLink);

  logger.info("Password reset email sent", {
    functionName: "UserService.forgotPassword",
    metadata: { userId: user.id },
  });
}

    static async resetPassword(token: string, newPassword: string) {
    logger.info("Reset password attempt", {
      functionName: "UserService.resetPassword",
    });

    let decoded: any;
    try {
      // Verify the JWT token and check expiry automatically
      decoded = jwt.verify(token, process.env.SECRET_KEY || 'huyhiuhh87uhewgyugw98uy783');
    } catch (error: any) {
      logger.warn("Reset password failed - invalid or expired token", {
        functionName: "UserService.resetPassword",
        error: error.message,
      });
      throw new AppError("Invalid or expired token", 400);
    }

    // Get user from decoded token payload
    const user = await UserRepository.findById(decoded.userId);
    if (!user) {
      logger.warn("Reset password failed - user not found", {
        functionName: "UserService.resetPassword",
        metadata: { userId: decoded.userId },
      });
      throw new AppError("User not found", 404);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user's password in DB
    await UserRepository.updatePassword(user.id, hashedPassword);

    logger.info("Password reset successful", {
      functionName: "UserService.resetPassword",
      metadata: { userId: user.id },
    });
  }






  static async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    logger.info("Change password initiated", {
      functionName: "UserService.changePassword",
      metadata: { userId },
    });

    const user = await UserRepository.findById(userId);
    if (!user) {
      logger.warn("Change password failed - user not found", {
        functionName: "UserService.changePassword",
        metadata: { userId },
      });
      throw new AppError("User not found", 404);
    }

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      logger.warn("Change password failed - old password incorrect", {
        functionName: "UserService.changePassword",
        metadata: { userId },
      });
      throw new AppError("Old password is incorrect", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await UserRepository.updatePassword(userId, hashedPassword);

    logger.info("Password changed successfully", {
      functionName: "UserService.changePassword",
      metadata: { userId },
    });
  }

  static async updateProfile(userId: string, data: any) {
    logger.info("Updating user profile", {
      functionName: "UserService.updateProfile",
      metadata: { userId },
    });

    const profile = await UserRepository.updateProfile(userId, data);

    logger.info("User profile updated", {
      functionName: "UserService.updateProfile",
      metadata: { userId },
    });

    return profile;
  }

  static async getProfile(userId: string) {
    logger.info("Fetching user profile", {
      functionName: "UserService.getProfile",
      metadata: { userId },
    });

    const user = await UserRepository.findByIdWithoutPassword(userId);
    if (!user) {
      logger.warn("Profile fetch failed - user not found", {
        functionName: "UserService.getProfile",
        metadata: { userId },
      });
      throw new AppError("User not found", 404);
    }

    logger.info("Profile fetched successfully", {
      functionName: "UserService.getProfile",
      metadata: { userId },
    });

    return user;
  }



  static async saveFcmToken(userId: string, token: string) {
  logger.info("Saving FCM token to DB", {
    functionName: "UserService.saveFcmToken",
    metadata: { userId },
  });

  await UserRepository.saveFcmToken(userId, token);
}


}
