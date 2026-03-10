import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

export const roleSelectionSchema = z.object({
  role: z.enum(['student', 'employed', 'unemployed', 'other']),
})

export const studentDetailsSchema = z.object({
  educationLevel: z.enum(['school', 'undergraduate', 'graduate', 'phd']),
  field: z.string().min(1, 'Field is required'),
  institution: z.string().min(1, 'Institution name is required'),
  graduationYear: z.string().optional(),
})

export const employedDetailsSchema = z.object({
  profession: z.string().min(1, 'Profession is required'),
  company: z.string().min(1, 'Company name is required'),
  experience: z.string().min(1, 'Experience is required'),
  field: z.string().min(1, 'Field is required'),
})

export const unemployedDetailsSchema = z.object({
  seeking: z.enum(['job', 'internship', 'freelance', 'learning']),
  field: z.string().min(1, 'Field is required'),
  lastWorked: z.string().optional(),
})

export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dob: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
  accountType: z.enum(['public', 'private']),
  phoneNumber: z.string().optional(),
  hobbies: z.array(z.string()).optional(),
})

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type RoleSelectionData = z.infer<typeof roleSelectionSchema>
export type StudentDetailsData = z.infer<typeof studentDetailsSchema>
export type EmployedDetailsData = z.infer<typeof employedDetailsSchema>
export type UnemployedDetailsData = z.infer<typeof unemployedDetailsSchema>
export type ProfileData = z.infer<typeof profileSchema>