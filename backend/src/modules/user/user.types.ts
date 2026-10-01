// src/modules/user/user.types.ts

export interface CreateUserDTO {
  name: string;
  email: string;
  password?: string;    // 🔥 optional (OAuth users ke liye)
  verified?: boolean;
  timezone?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface OAuthUserInput {
  provider: 'GOOGLE' | 'GITHUB';
  providerId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}