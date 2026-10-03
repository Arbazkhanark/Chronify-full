// src/modules/comment/comment.controller.ts
import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { CommentService } from './comment.service';
import { createCommentSchema, updateCommentSchema } from './comment.validation';
import { AppError } from '../../utils/AppError';
import { pickString } from '../user/user.controller';

function handleZodError(err: unknown, res: Response): boolean {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.flatten().fieldErrors,
    });
    return true;
  }
  return false;
}


/**
 * 🔥 Safely extract a route param that Express 5 types as `string | string[]`.
 * - Takes the first value if it's an array
 * - Returns '' if param is missing
 */
function getParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] ?? '';
  return param ?? '';
}

export class CommentController {
  static async create(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const data = createCommentSchema.parse(req.body);

      const comment = await CommentService.create(userId, data);

      return res.status(201).json({
        success: true,
        message: 'Comment created successfully',
        data: comment,
      });
    } catch (err: any) {
      if (handleZodError(err, res)) return;
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async getForPost(req: Request, res: Response) {
    try {
    //   const { id } = req.params;
    //   const postId = getParam(id);
      const fromQuery = pickString(req.query.postId).trim()
      const fromParams = pickString((req.params as any).postId).trim()
      const postId = fromQuery || fromParams
    
          // Viewer context (optional — set by optionalAuthMiddleware)
      const viewerId = (req as any).user?.id as string | undefined
      console.log(`[CommentController] getForPost for postId: ${postId}`);
      const comments = await CommentService.findByPost(postId);
      return res.status(200).json({ success: true, data: comments });
    } catch (err: any) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async getReplies(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const commentId = getParam(id);
      const replies = await CommentService.findReplies(commentId);
      return res.status(200).json({ success: true, data: replies });
    } catch (err: any) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const commentId = getParam(id);
      const data = updateCommentSchema.parse(req.body);

      const comment = await CommentService.update(userId, commentId, data);

      return res.status(200).json({
        success: true,
        message: 'Comment updated successfully',
        data: comment,
      });
    } catch (err: any) {
      if (handleZodError(err, res)) return;
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const commentId = getParam(id);
      await CommentService.delete(userId, commentId);

      return res.status(200).json({
        success: true,
        message: 'Comment deleted successfully',
      });
    } catch (err: any) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}