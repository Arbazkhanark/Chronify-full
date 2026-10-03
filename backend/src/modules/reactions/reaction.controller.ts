// src/modules/reaction/reaction.controller.ts
import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { ReactionService } from './reaction.service';
import { reactToPostSchema, reactToCommentSchema } from './reaction.validation';
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

export class ReactionController {
  // ---------- POST ----------
  static async reactToPost(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { postId, reaction } = reactToPostSchema.parse(req.body);

      const result = await ReactionService.reactToPost(userId, postId, reaction);

      return res.status(200).json({
        success: true,
        message: 'Reaction saved',
        data: result,
      });
    } catch (err: any) {
      if (handleZodError(err, res)) return;
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async removePostReaction(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const postId = getParam(id);

      const result = await ReactionService.removePostReaction(userId, postId);

      return res.status(200).json({
        success: true,
        message: 'Reaction removed',
        data: result,
      });
    } catch (err: any) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async getPostReactionSummary(req: Request, res: Response) {
    try {
      const fromQuery = pickString(req.query.postId).trim()
      const fromParams = pickString((req.params as any).postId).trim()
      const postId = fromQuery || fromParams
    
      const summary = await ReactionService.getPostReactionSummary(postId);
      return res.status(200).json({ success: true, data: summary });
    } catch (err: any) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // ---------- COMMENT ----------
  static async reactToComment(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { commentId, reaction } = reactToCommentSchema.parse(req.body);

      const result = await ReactionService.reactToComment(userId, commentId, reaction);

      return res.status(200).json({
        success: true,
        message: 'Reaction saved',
        data: result,
      });
    } catch (err: any) {
      if (handleZodError(err, res)) return;
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async removeCommentReaction(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const commentId = getParam(id);

      const result = await ReactionService.removeCommentReaction(userId, commentId);

      return res.status(200).json({
        success: true,
        message: 'Reaction removed',
        data: result,
      });
    } catch (err: any) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async getCommentReactionSummary(req: Request, res: Response) {
    try {
    //   const { id } = req.params;
    //   const commentId = getParam(id);
      const fromQuery = pickString(req.query.commentId).trim()
      const fromParams = pickString((req.params as any).commentId).trim()
      const commentId = fromQuery || fromParams
      
      // Viewer context (optional — set by optionalAuthMiddleware)
      const viewerId = (req as any).user?.id as string | undefined
      const summary = await ReactionService.getCommentReactionSummary(commentId);
      return res.status(200).json({ success: true, data: summary });
    } catch (err: any) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}