// src/modules/user/user.validation.ts
import { z } from "zod";
import { SocialPlatform } from "../../generated/prisma/enums";

/* ============================================================================
   AUTH SCHEMAS (unchanged)
   ============================================================================ */

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

/* ============================================================================
   🔥 NEW: EDUCATION SCHEMA
   ============================================================================ */

export const educationSchema = z.object({
  id: z.string().uuid().optional(),
  institution: z.string().min(1).max(200),
  degree: z.string().min(1).max(200),
  field: z.string().max(200).optional().nullable(),
  grade: z.string().max(50).optional().nullable(),
  startYear: z.string().max(20).optional().nullable(),
  endYear: z.string().max(20).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  activities: z.string().max(500).optional().nullable(),
  isCurrent: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

/* ============================================================================
   🔥 NEW: EXPERIENCE SCHEMA
   ============================================================================ */

export const employmentTypeSchema = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "SELF_EMPLOYED",
  "FREELANCE",
  "CONTRACT",
  "INTERNSHIP",
  "APPRENTICESHIP",
  "SEASONAL",
]);

export const locationTypeSchema = z.enum(["ON_SITE", "REMOTE", "HYBRID"]);

export const experienceSchema = z.object({
  id: z.string().uuid().optional(),
  role: z.string().min(1).max(200),
  organization: z.string().min(1).max(200),
  employmentType: employmentTypeSchema.optional(),
  locationType: locationTypeSchema.optional(),
  startDate: z.string().max(50).optional().nullable(),
  endDate: z.string().max(50).optional().nullable(),
  isCurrent: z.boolean().optional(),
  location: z.string().max(200).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  skills: z.array(z.string().min(1).max(50)).optional(),
  companyUrl: z.string().url().optional().nullable().or(z.literal("")),
  companyLogo: z.string().url().optional().nullable().or(z.literal("")),
  order: z.number().int().min(0).optional(),
});

/* ============================================================================
   UPDATE PROFILE SCHEMA
   (avoids breaking change by allowing "" for URLs — frontend sometimes sends "")
   ============================================================================ */

const socialLinkSchema = z.object({
  platform: z.enum(SocialPlatform),
  url: z.string().url(),
});

export const updateProfileSchema = z.object({
  userName: z.string().min(2).max(50).optional(),
  avatarUrl: z.string().url().optional().nullable().or(z.literal("")),
  coverPhoto: z.string().url().optional().nullable().or(z.literal("")),
  bio: z.string().max(500).optional().nullable(),
  dob: z.coerce.date().optional().nullable(),
  profession: z.string().max(100).optional().nullable(),
  hobbies: z.array(z.string().min(1)).optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  // 🔥 ADD THESE — warna Zod in fields ko strip kar dega
  fields: z.array(z.string().min(1)).optional(),
  subFields: z.array(z.string().min(1)).optional(),

  // 🔥 NEW: Education + Experience
  education: z.array(educationSchema).optional(),
  experience: z.array(experienceSchema).optional(),
});

export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;