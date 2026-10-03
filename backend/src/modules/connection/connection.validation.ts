import { z } from 'zod';

export const sendRequestSchema = z.object({
  receiverId: z.string().uuid(),
});

export const respondRequestSchema = z.object({
  action: z.enum(['ACCEPT', 'REJECT', 'PENDING']),
});