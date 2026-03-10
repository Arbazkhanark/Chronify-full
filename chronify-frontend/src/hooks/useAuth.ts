// // // Mock authentication functions - Replace with real API calls

// import { useEffect, useState } from "react"

// // Mock authentication for development
// export interface User {
//   id: string
//   email: string
//   isVerified: boolean
//   onboardingStep: number
//   role?: string
//   details?: any
//   profile?: any
// }

// export class AuthService {
//   private static users: User[] = []

//   static async register(email: string, password: string): Promise<User> {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const user: User = {
//           id: `user_${Date.now()}`,
//           email,
//           isVerified: false,
//           onboardingStep: 0,
//         }
//         this.users.push(user)
//         localStorage.setItem('currentUser', JSON.stringify(user))
//         localStorage.setItem('auth_token', 'mock_token')
//         resolve(user)
//       }, 1000)
//     })
//   }

//   static async verifyEmail(token: string): Promise<boolean> {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const user = this.getCurrentUser()
//         if (user) {
//           user.isVerified = true
//           user.onboardingStep = 1
//           localStorage.setItem('currentUser', JSON.stringify(user))
//           resolve(true)
//         }
//         resolve(false)
//       }, 1000)
//     })
//   }

//   static async login(email: string, password: string): Promise<User | null> {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const user = this.users.find(u => u.email === email) || this.getCurrentUser()
//         if (user) {
//           localStorage.setItem('currentUser', JSON.stringify(user))
//           localStorage.setItem('auth_token', 'mock_token')
//           resolve(user)
//         }
//         resolve(null)
//       }, 1000)
//     })
//   }

//   static getCurrentUser(): User | null {
//     if (typeof window === 'undefined') return null
//     const userStr = localStorage.getItem('currentUser')
//     return userStr ? JSON.parse(userStr) : null
//   }

//   static updateOnboardingStep(step: number): void {
//     const user = this.getCurrentUser()
//     if (user) {
//       user.onboardingStep = step
//       localStorage.setItem('currentUser', JSON.stringify(user))
//     }
//   }

//   static saveRole(role: string): void {
//     const user = this.getCurrentUser()
//     if (user) {
//       user.role = role
//       user.onboardingStep = 2
//       localStorage.setItem('currentUser', JSON.stringify(user))
//     }
//   }

//   static saveDetails(details: any): void {
//     const user = this.getCurrentUser()
//     if (user) {
//       user.details = details
//       user.onboardingStep = 3
//       localStorage.setItem('currentUser', JSON.stringify(user))
//     }
//   }

//   static saveProfile(profile: any): void {
//     const user = this.getCurrentUser()
//     if (user) {
//       user.profile = profile
//       user.onboardingStep = 4
//       localStorage.setItem('currentUser', JSON.stringify(user))
//     }
//   }

//   static logout(): void {
//     localStorage.removeItem('currentUser')
//     localStorage.removeItem('auth_token')
//   }
























//   //////////////.  NEW METHODS FOR USER STATS (MOCK)  //////////////

//   static getUserStats() {
//     return {
//       streak: localStorage.getItem('user_streak') || 0,
//       totalHours: localStorage.getItem('total_hours') || 0,
//       completedTasks: localStorage.getItem('completed_tasks') || 0,
//       consistency: localStorage.getItem('consistency_score') || 0,
//     }
//   }

//   static updateUserStats(stats: any) {
//     Object.keys(stats).forEach(key => {
//       localStorage.setItem(`user_${key}`, stats[key])
//     })
//   }


//   // In your AuthService class, add these methods:

// static async forgotPassword(email: string): Promise<boolean> {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const user = this.users.find(u => u.email === email)
//       if (user) {
//         // Generate reset token and store it
//         const resetToken = `reset_${Date.now()}`
//         localStorage.setItem(`reset_token_${user.id}`, resetToken)
//         localStorage.setItem('reset_email', email)
//         console.log(`Reset token for ${email}: ${resetToken}`) // In production, send via email
//         resolve(true)
//       }
//       resolve(false)
//     }, 1000)
//   })
// }

// static async resetPassword(token: string, newPassword: string): Promise<boolean> {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const email = localStorage.getItem('reset_email')
//       const user = this.users.find(u => u.email === email)
      
//       if (user) {
//         const storedToken = localStorage.getItem(`reset_token_${user.id}`)
//         if (storedToken === token) {
//           // Password updated successfully
//           localStorage.removeItem(`reset_token_${user.id}`)
//           localStorage.removeItem('reset_email')
//           resolve(true)
//         }
//       }
//       resolve(false)
//     }, 1000)
//   })
// }

// static async changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const user = this.getCurrentUser()
//       if (user) {
//         // In real app, verify old password
//         resolve(true)
//       }
//       resolve(false)
//     }, 1000)
//   })
// }




// }

// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const currentUser = AuthService.getCurrentUser()
//     setUser(currentUser)
//     setLoading(false)
//   }, [])

//   return { user, loading }


// }
























// // hooks/useAuth.ts
// import { useEffect, useState } from 'react';
// import { toast } from 'sonner';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8181/v0/api';

// export interface User {
//   id: string;
//   email: string;
//   name?: string;
//   timezone?: string;
//   verified: boolean;
//   createdAt?: string;
//   onboardingStep?: number;
//   role?: string;
//   details?: any;
//   profile?: any;
// }

// export interface LoginResponse {
//   success: boolean;
//   message: string;
//   data: {
//     accessToken: string;
//     refreshToken: string;
//     user: {
//       id: string;
//       name: string;
//       email: string;
//       timezone: string;
//     };
//   };
// }

// export interface RegisterResponse {
//   success: boolean;
//   message: string;
//   data: {
//     id: string;
//     name: string;
//     email: string;
//     timezone: string;
//     createdAt: string;
//   };
// }

// export interface UserResponse {
//   success: boolean;
//   data: User;
// }

// export interface ApiError {
//   success: false;
//   message: string;
//   errors?: Record<string, string[]>;
// }

// class AuthServiceClass {
//   private static instance: AuthServiceClass;
//   private accessToken: string | null = null;
//   private refreshToken: string | null = null;

//   private constructor() {
//     if (typeof window !== 'undefined') {
//       this.accessToken = localStorage.getItem('access_token');
//       this.refreshToken = localStorage.getItem('refresh_token');
//     }
//   }

//   static getInstance(): AuthServiceClass {
//     if (!AuthServiceClass.instance) {
//       AuthServiceClass.instance = new AuthServiceClass();
//     }
//     return AuthServiceClass.instance;
//   }

//   private setTokens(accessToken: string, refreshToken: string) {
//     this.accessToken = accessToken;
//     this.refreshToken = refreshToken;
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('access_token', accessToken);
//       localStorage.setItem('refresh_token', refreshToken);
//     }
//   }

//   getAccessToken(): string | null {
//     return this.accessToken;
//   }

//   private async handleRequest<T>(
//     url: string,
//     options: RequestInit = {}
//   ): Promise<T> {
//     const headers: HeadersInit = {
//       'Content-Type': 'application/json',
//       ...options.headers,
//     };

//     if (this.accessToken) {
//       headers['Authorization'] = `Bearer ${this.accessToken}`;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}${url}`, {
//         ...options,
//         headers,
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw {
//           success: false,
//           message: data.message || 'An error occurred',
//           errors: data.errors,
//         };
//       }

//       return data;
//     } catch (error) {
//       if (error instanceof Error) {
//         throw {
//           success: false,
//           message: error.message || 'Network error occurred',
//         };
//       }
//       throw error;
//     }
//   }

//   async register(email: string, password: string, name?: string, timezone?: string): Promise<RegisterResponse> {
//     try {
//       const response = await this.handleRequest<RegisterResponse>('/users/signup', {
//         method: 'POST',
//         body: JSON.stringify({
//           email,
//           password,
//           name: name || email.split('@')[0],
//           timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
//         }),
//       });

//       if (response.success) {
//         const user: User = {
//           ...response.data,
//           verified: false,
//           onboardingStep: 0,
//         };
//         localStorage.setItem('current_user', JSON.stringify(user));
        
//         toast.success('🎉 Registration successful!', {
//           description: 'Please check your email to verify your account.',
//           duration: 5000,
//         });
//       }

//       return response;
//     } catch (error: any) {
//       if (error.message?.includes('already registered')) {
//         toast.error('Account already exists', {
//           description: 'This email is already registered. Please login instead.',
//           duration: 5000,
//         });
//       } else {
//         toast.error('Registration failed', {
//           description: error.message || 'Please try again with different credentials.',
//           duration: 5000,
//         });
//       }
//       throw error;
//     }
//   }

//   async verifyEmail(token: string): Promise<boolean> {
//     try {
//       const response = await this.handleRequest<{ success: boolean; message: string }>(
//         `/users/verify?token=${encodeURIComponent(token)}`,
//         { method: 'GET' }
//       );

//       if (response.success) {
//         const userStr = localStorage.getItem('current_user');
//         if (userStr) {
//           const user = JSON.parse(userStr);
//           user.verified = true;
//           user.onboardingStep = 1;
//           localStorage.setItem('current_user', JSON.stringify(user));
//         }

//         toast.success('✅ Email verified successfully!', {
//           description: 'Your account is now active. You can now login.',
//           duration: 5000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error: any) {
//       toast.error('Verification failed', {
//         description: error.message || 'The verification link may be expired or invalid.',
//         duration: 5000,
//       });
//       return false;
//     }
//   }

//   async login(email: string, password: string): Promise<LoginResponse['data']> {
//     try {
//       const response = await this.handleRequest<LoginResponse>('/users/login', {
//         method: 'POST',
//         body: JSON.stringify({ email, password }),
//       });

//       if (response.success) {
//         this.setTokens(response.data.accessToken, response.data.refreshToken);
        
//         const user: User = {
//           ...response.data.user,
//           verified: false, // Will be updated by /me endpoint
//           onboardingStep: 0,
//         };
//         localStorage.setItem('current_user', JSON.stringify(user));

//         // Fetch complete user details
//         await this.getCurrentUser();

//         toast.success('👋 Welcome back!', {
//           description: `Logged in as ${response.data.user.name || response.data.user.email}`,
//           duration: 3000,
//         });

//         return response.data;
//       }
//       throw new Error('Login failed');
//     } catch (error: any) {
//       if (error.message?.includes('Invalid credentials')) {
//         toast.error('Invalid email or password', {
//           description: 'Please check your credentials and try again.',
//           duration: 5000,
//         });
//       } else {
//         toast.error('Login failed', {
//           description: error.message || 'Unable to login at this time.',
//           duration: 5000,
//         });
//       }
//       throw error;
//     }
//   }

//   async getCurrentUser(): Promise<User | null> {
//     try {
//       const response = await this.handleRequest<UserResponse>('/users/me', {
//         method: 'GET',
//       });

//       if (response.success) {
//         const existingUserStr = localStorage.getItem('current_user');
//         const existingUser = existingUserStr ? JSON.parse(existingUserStr) : {};
        
//         const user: User = {
//           ...response.data,
//           onboardingStep: existingUser.onboardingStep || 0,
//           role: existingUser.role,
//           details: existingUser.details,
//           profile: existingUser.profile,
//         };
        
//         localStorage.setItem('current_user', JSON.stringify(user));
//         return user;
//       }
//       return null;
//     } catch (error) {
//       console.error('Failed to fetch current user:', error);
//       return null;
//     }
//   }

//   async changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
//     try {
//       const response = await this.handleRequest<{ success: boolean; message: string }>(
//         '/users/change-password',
//         {
//           method: 'POST',
//           body: JSON.stringify({ oldPassword, newPassword }),
//         }
//       );

//       if (response.success) {
//         toast.success('🔐 Password updated successfully!', {
//           description: 'Your password has been changed. Please use your new password next time.',
//           duration: 5000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error: any) {
//       if (error.message?.includes('Current password is incorrect')) {
//         toast.error('Current password is incorrect', {
//           description: 'Please enter your current password correctly.',
//           duration: 5000,
//         });
//       } else {
//         toast.error('Password change failed', {
//           description: error.message || 'Unable to change password at this time.',
//           duration: 5000,
//         });
//       }
//       return false;
//     }
//   }

//   async forgotPassword(email: string): Promise<boolean> {
//     try {
//       const response = await this.handleRequest<{ success: boolean; message: string }>(
//         '/users/forgot-password',
//         {
//           method: 'POST',
//           body: JSON.stringify({ email }),
//         }
//       );

//       if (response.success) {
//         toast.success('📧 Reset link sent!', {
//           description: `We've sent a password reset link to ${email}. Please check your inbox.`,
//           duration: 6000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error: any) {
//       if (error.message?.includes('Email not found')) {
//         toast.error('Email not registered', {
//           description: 'No account found with this email address.',
//           duration: 5000,
//         });
//       } else {
//         toast.error('Failed to send reset link', {
//           description: error.message || 'Please try again later.',
//           duration: 5000,
//         });
//       }
//       return false;
//     }
//   }

//   async resetPassword(token: string, newPassword: string): Promise<boolean> {
//     try {
//       const response = await this.handleRequest<{ success: boolean; message: string }>(
//         '/users/reset-password',
//         {
//           method: 'POST',
//           body: JSON.stringify({ token, newPassword }),
//         }
//       );

//       if (response.success) {
//         toast.success('✅ Password reset successful!', {
//           description: 'Your password has been updated. You can now login with your new password.',
//           duration: 5000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error: any) {
//       if (error.message?.includes('Invalid or expired token')) {
//         toast.error('Reset link expired', {
//           description: 'This password reset link has expired. Please request a new one.',
//           duration: 5000,
//         });
//       } else {
//         toast.error('Password reset failed', {
//           description: error.message || 'Unable to reset password at this time.',
//           duration: 5000,
//         });
//       }
//       return false;
//     }
//   }

//   async resendVerification(email: string): Promise<boolean> {
//     try {
//       const response = await this.handleRequest<{ success: boolean; message: string }>(
//         '/users/resend-verification',
//         {
//           method: 'POST',
//           body: JSON.stringify({ email }),
//         }
//       );

//       if (response.success) {
//         toast.success('📧 Verification email resent!', {
//           description: `Please check your inbox at ${email}`,
//           duration: 5000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error: any) {
//       toast.error('Failed to resend verification', {
//         description: error.message || 'Please try again later.',
//         duration: 5000,
//       });
//       return false;
//     }
//   }

//   async logout(): Promise<void> {
//     this.accessToken = null;
//     this.refreshToken = null;
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('refresh_token');
//       localStorage.removeItem('current_user');
//     }
//     toast.success('👋 Logged out successfully', {
//       description: 'Come back soon!',
//       duration: 3000,
//     });
//   }

//   getCurrentUserFromStorage(): User | null {
//     if (typeof window === 'undefined') return null;
//     const userStr = localStorage.getItem('current_user');
//     return userStr ? JSON.parse(userStr) : null;
//   }

//   updateOnboardingStep(step: number): void {
//     const user = this.getCurrentUserFromStorage();
//     if (user) {
//       user.onboardingStep = step;
//       localStorage.setItem('current_user', JSON.stringify(user));
//     }
//   }

//   saveRole(role: string): void {
//     const user = this.getCurrentUserFromStorage();
//     if (user) {
//       user.role = role;
//       user.onboardingStep = 2;
//       localStorage.setItem('current_user', JSON.stringify(user));
//     }
//   }

//   saveDetails(details: any): void {
//     const user = this.getCurrentUserFromStorage();
//     if (user) {
//       user.details = details;
//       user.onboardingStep = 3;
//       localStorage.setItem('current_user', JSON.stringify(user));
//     }
//   }

//   saveProfile(profile: any): void {
//     const user = this.getCurrentUserFromStorage();
//     if (user) {
//       user.profile = profile;
//       user.onboardingStep = 4;
//       localStorage.setItem('current_user', JSON.stringify(user));
//     }
//   }
// }

// export const AuthService = AuthServiceClass.getInstance();

// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const token = AuthService.getAccessToken();
//         if (token) {
//           const user = await AuthService.getCurrentUser();
//           setUser(user);
//         } else {
//           const storedUser = AuthService.getCurrentUserFromStorage();
//           setUser(storedUser);
//         }
//       } catch (error) {
//         console.error('Failed to load user:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUser();
//   }, []);

//   return { user, loading, isAuthenticated: !!user, AuthService };
// }










































// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8181/v0/api';

export interface User {
  id: string;
  email: string;
  name?: string;
  timezone?: string;
  verified: boolean;
  createdAt?: string;
  onboardingStep?: number;
  role?: string;
  details?: any;
  profile?: any;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      timezone: string;
    };
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    timezone: string;
    createdAt: string;
  };
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export class AuthServiceClass {
  private static instance: AuthServiceClass;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
      this.refreshToken = localStorage.getItem('refresh_token');
    }
  }

  static getInstance(): AuthServiceClass {
    if (!AuthServiceClass.instance) {
      AuthServiceClass.instance = new AuthServiceClass();
    }
    return AuthServiceClass.instance;
  }

  private setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  // For testing purposes - remove in production
  setTestToken() {
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjZjA5NjU5Mi1mMTllLTQ0NmYtYmNkZC05ZTQ2Mzc0ZWI3MmUiLCJpYXQiOjE3NzA3NDY2ODIsImV4cCI6MTc3MDgzMzA4Mn0.vB-wW4qME8p3gOg6b57omMri_obz0nZZSDZFCIrUf-Y';
    this.accessToken = testToken;
    localStorage.setItem('access_token', testToken);
  }

  private async handleRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'An error occurred',
          errors: data.errors,
          status: response.status,
        };
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw {
          success: false,
          message: error.message || 'Network error occurred',
        };
      }
      throw error;
    }
  }

  async register(email: string, password: string, name?: string, timezone?: string): Promise<RegisterResponse> {
    try {
      const response = await this.handleRequest<RegisterResponse>('/users/signup', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          name: name || email.split('@')[0],
          timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      if (response.success) {
        const user: User = {
          ...response.data,
          verified: false,
          onboardingStep: 0,
        };
        localStorage.setItem('current_user', JSON.stringify(user));
        
        toast.success('🎉 Registration successful!', {
          description: 'Please check your email to verify your account.',
          duration: 5000,
        });
      }

      return response;
    } catch (error: any) {
      if (error.message?.includes('already registered')) {
        toast.error('Account already exists', {
          description: 'This email is already registered. Please login instead.',
          duration: 5000,
        });
      } else {
        toast.error('Registration failed', {
          description: error.message || 'Please try again with different credentials.',
          duration: 5000,
        });
      }
      throw error;
    }
  }

  async login(email: string, password: string): Promise<LoginResponse['data']> {
    try {
      const response = await this.handleRequest<LoginResponse>('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.success) {
        this.setTokens(response.data.accessToken, response.data.refreshToken);
        
        const user: User = {
          ...response.data.user,
          verified: false,
          onboardingStep: 0,
        };
        localStorage.setItem('current_user', JSON.stringify(user));

        await this.getCurrentUser();

        toast.success('👋 Welcome back!', {
          description: `Logged in as ${response.data.user.name || response.data.user.email}`,
          duration: 3000,
        });

        return response.data;
      }
      throw new Error('Login failed');
    } catch (error: any) {
      if (error.message?.includes('Invalid credentials')) {
        toast.error('Invalid email or password', {
          description: 'Please check your credentials and try again.',
          duration: 5000,
        });
      } else {
        toast.error('Login failed', {
          description: error.message || 'Unable to login at this time.',
          duration: 5000,
        });
      }
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.handleRequest<UserResponse>('/users/me', {
        method: 'GET',
      });

      if (response.success) {
        const existingUserStr = localStorage.getItem('current_user');
        const existingUser = existingUserStr ? JSON.parse(existingUserStr) : {};
        
        const user: User = {
          ...response.data,
          onboardingStep: existingUser.onboardingStep || 0,
          role: existingUser.role,
          details: existingUser.details,
          profile: existingUser.profile,
        };
        
        localStorage.setItem('current_user', JSON.stringify(user));
        return user;
      }
      return null;
    } catch (error) {
      console.log('Failed to fetch current user:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('current_user');
    }
    toast.success('👋 Logged out successfully', {
      description: 'Come back soon!',
      duration: 3000,
    });
  }

  getCurrentUserFromStorage(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export const AuthService = AuthServiceClass.getInstance();

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = AuthService.getAccessToken();
        if (token) {
          const user = await AuthService.getCurrentUser();
          setUser(user);
        } else {
          const storedUser = AuthService.getCurrentUserFromStorage();
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, loading, isAuthenticated: !!user, AuthService };
}