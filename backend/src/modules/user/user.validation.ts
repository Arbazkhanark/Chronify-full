import { z } from "zod";
import { SocialPlatform } from "../../generated/prisma/enums";

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  timezone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(8),
});

// export const updateProfileSchema = z.object({
//   fields: z.array(z.string()).min(1),
//   subField: z.array(z.string()).min(1).optional(),
//   dailyTargetMinutes: z.number().min(10).max(1440),
// });



const socialLinkSchema = z.object({
  platform: z.enum(SocialPlatform),
  url: z.string().url(),
});


export const updateProfileSchema = z.object({
  userName: z.string().min(2).max(50).optional(),
  avatarUrl: z.string().url().optional().nullable(),
  coverPhoto: z.string().url().optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  dob: z.coerce.date().optional().nullable(),
  profession: z.string().max(100).optional().nullable(),
  hobbies: z.array(z.string().min(1)).optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
});



export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;