// src/modules/post/post.types.ts

export interface CreatePostDTO {
  content: string;
  image?: string[];
  type: 'ACHIEVEMENT' | 'JOURNEY' | 'MILESTONE' | 'GENERAL';
}

export interface UpdatePostDTO {
  content?: string;
  image?: string[];
  type?: 'ACHIEVEMENT' | 'JOURNEY' | 'MILESTONE' | 'GENERAL';
}

export interface GetFeedDTO {
  cursor?: string;   // post id
  limit?: number;    // default 10
  userId?: string;   // filter by user
  type?: string;     // filter by type
}