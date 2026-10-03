// src/modules/post/post.validation.ts
import { z } from 'zod';

export const createPostSchema = z.object({
  content: z.string().min(1, 'Content cannot be empty').max(5000),
  image: z.array(z.string().url()).max(10).optional().default([]),
  type: z.enum(['ACHIEVEMENT', 'JOURNEY', 'MILESTONE', 'GENERAL']).default('GENERAL'),
});

export const updatePostSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
  image: z.array(z.string().url()).max(10).optional(),
  type: z.enum(['ACHIEVEMENT', 'JOURNEY', 'MILESTONE', 'GENERAL']).optional(),
});

export const getFeedSchema = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
  userId: z.string().uuid().optional(),
  type: z.enum(['ACHIEVEMENT', 'JOURNEY', 'MILESTONE', 'GENERAL']).optional(),
});

export type CreatePostBody = z.infer<typeof createPostSchema>;
export type UpdatePostBody = z.infer<typeof updatePostSchema>;