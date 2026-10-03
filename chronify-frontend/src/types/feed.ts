// src/types/feed.ts

/* ============================================================
   POSTS
   ============================================================ */

export type PostType =
  | 'ACHIEVEMENT'
  | 'JOURNEY'
  | 'MILESTONE'
  | 'GENERAL'

export type ReactionKind =
  | 'LIKE'
  | 'LOVE'
  | 'SAD'
  | 'ANGRY'
  | 'HAHA'

// export interface PostAuthor {
//   id: string
//   name: string
//   profile?: {
//     userName?: string
//     avatarUrl?: string | null
//   } | null
// }



// src/types/feed.ts
export interface PostAuthor {
  id: string
  name: string
  /** Optional — safe to leave undefined */
  verified?: boolean
  accountType?: string
  fields?: string[]
  subFields?: string[]
  profile?: {
    userName?: string
    avatarUrl?: string | null
    /** 🔥 Add these so PostCard can render them */
    profession?: string | null
    city?: string | null
    country?: string | null
  } | null
}



export interface Reaction {
  id: string
  postId?: string | null
  commentId?: string | null
  userId: string
  reaction: ReactionKind
  createdAt: string
  user?: {
    id: string
    name: string
    profile?: { avatarUrl?: string | null } | null
  }
}

export interface Comment {
  id: string
  postId: string
  userId: string
  content: string
  parentId?: string | null
  isDeleted: boolean
  editedAt?: string | null
  createdAt: string
  updatedAt: string
  user: PostAuthor
  reactions?: Reaction[]
  replies?: Comment[]
  _count?: {
    reactions: number
    replies: number
  }
}

export interface Post {
  id: string
  userId: string
  content: string
  type: PostType
  /** Array of image URLs from Cloudinary */
  image?: string[] | null
  createdAt: string
  updatedAt: string
  user: PostAuthor
  reactions?: Reaction[]
  comments?: Comment[]
  _count?: {
    reactions: number
    comments: number
  }
}

/* ============================================================
   REACTIONS
   ============================================================ */

export interface ReactionSummary {
  counts: Record<ReactionKind, number>
  total: number
  myReaction: ReactionKind | null
  reactions?: Reaction[]
}

/* ============================================================
   CONNECTIONS
   ============================================================ */

export type FriendRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'
export type FriendStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED'

export interface ConnectionUser {
  id: string
  name: string
  email?: string
  userName?: string
  avatarUrl?: string | null
  bio?: string | null
  profession?: string | null
  verified?: boolean
}

export interface FriendRequest {
  id: string
  senderId: string
  receiverId: string
  status: FriendRequestStatus
  createdAt: string
  updatedAt: string
  sender?: ConnectionUser
  receiver?: ConnectionUser
}

export interface Friend {
  id: string
  userId: string
  friendId: string
  status: FriendStatus
  createdAt: string
  updatedAt: string
  friend: ConnectionUser
  user?: ConnectionUser
}