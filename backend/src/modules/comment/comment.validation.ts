// src/modules/comment/comment.validation.ts
import { z } from 'zod';

export const createCommentSchema = z.object({
  postId: z.string().uuid(),
  content: z.string().min(1).max(2000),
  parentId: z.string().uuid().optional().nullable(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1).max(2000),
});