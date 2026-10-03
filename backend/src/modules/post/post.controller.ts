// src/modules/post/post.controller.ts
import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { PostService } from './post.service';
import {
  createPostSchema,
  updatePostSchema,
  getFeedSchema,
} from './post.validation';
import { AppError } from '../../utils/AppError';
import { logger } from 'patal-log';

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
 * Safely extract a route param that Express 5 types as
 * `string | string[] | undefined`.
 */
function getParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] ?? '';
  return param ?? '';
}

export class PostController {
  static async create(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const data = createPostSchema.parse(req.body);

      const post = await PostService.createPost(userId, data);

      return res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: post,
      });
    } catch (err: any) {
      logger.error(`Create post failed: ${err.message}`, {
        functionName: 'PostController.create',
      });
      if (handleZodError(err, res)) return;
      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message });
      }
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  static async getFeed(req: Request, res: Response) {
    try {
      const opts = getFeedSchema.parse(req.query);
      const viewerId = (req as any).user?.id;
      const result = await PostService.getFeed({ ...opts, viewerId });

      return res.status(200).json({
        success: true,
        data: result.posts,
        pagination: {
          hasNext: result.hasNext,
          nextCursor: result.nextCursor,
        },
      });
    } catch (err: any) {
      logger.error(`Get feed failed: ${err.message}`, {
        functionName: 'PostController.getFeed',
      });
      if (handleZodError(err, res)) return;
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  /* ------------------------------------------------------------------ */
  /*  🔥 UPDATED: getOne — accepts id OR slug                            */
  /* ------------------------------------------------------------------ */
  static async getOne(req: Request, res: Response) {
    try {
      const idOrSlug = getParam(req.params.id);

      logger.info('Fetching post', {
        functionName: 'PostController.getOne',
        metadata: { idOrSlug },
      });

      const post = await PostService.getPost(idOrSlug);

      return res.status(200).json({ success: true, data: post });
    } catch (err: any) {
      logger.error(`Get post failed: ${err.message}`, {
        functionName: 'PostController.getOne',
      });
      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message });
      }
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const postId = getParam(req.params.id);
      const data = updatePostSchema.parse(req.body);

      const post = await PostService.updatePost(userId, postId, data);

      return res.status(200).json({
        success: true,
        message: 'Post updated successfully',
        data: post,
      });
    } catch (err: any) {
      if (handleZodError(err, res)) return;
      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message });
      }
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const postId = getParam(req.params.id);

      await PostService.deletePost(userId, postId);

      return res.status(200).json({
        success: true,
        message: 'Post deleted successfully',
      });
    } catch (err: any) {
      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message });
      }
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  static async getMyPosts(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const posts = await PostService.getMyPosts(userId);
      return res.status(200).json({ success: true, data: posts });
    } catch (err: any) {
      logger.error(`Get my posts failed: ${err.message}`, {
        functionName: 'PostController.getMyPosts',
      });
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }
}