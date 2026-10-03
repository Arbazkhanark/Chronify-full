// src/modules/reaction/reaction.validation.ts
import { z } from 'zod';

export const reactionKindSchema = z.enum(['LIKE', 'LOVE', 'SAD', 'ANGRY', 'HAHA']);

export const reactToPostSchema = z.object({
  postId: z.string().uuid(),
  reaction: reactionKindSchema,
});

export const reactToCommentSchema = z.object({
  commentId: z.string().uuid(),
  reaction: reactionKindSchema,
});