// src/types/connection-types.ts

export type FriendRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

export interface ConnectionUserProfile {
  userName: string
  avatarUrl: string | null
  profession?: string | null
  city?: string | null
  country?: string | null
}

export interface ConnectionUser {
  id: string
  name: string
  accountType?: 'STUDENT' | 'MENTOR'
  fields?: string[]
  subFields?: string[]
  profile?: ConnectionUserProfile | null
}

export interface FriendRequest {
  id: string
  senderId: string
  receiverId: string
  status: FriendRequestStatus
  createdAt: string
  updatedAt?: string
  /** Present on /received */
  sender?: ConnectionUser
  /** Present on /sent */
  receiver?: ConnectionUser
}

export interface ApiError {
  success: false
  message: string
  status?: number
  errors?: Record<string, string[]>
}