// src/modules/post/post.service.ts
import { PostRepository } from './post.repository';
import { AppError } from '../../utils/AppError';
import { logger } from 'patal-log';
import { CreatePostDTO, UpdatePostDTO } from './post.type';

export class PostService {
  static async createPost(userId: string, data: CreatePostDTO) {
    logger.info('Creating post', {
      functionName: 'PostService.createPost',
      metadata: { userId, type: data.type },
    });

    const post = await PostRepository.create(userId, data);

    logger.info('Post created', {
      functionName: 'PostService.createPost',
      metadata: { postId: post.id },
    });

    return post;
  }

  static async getFeed(opts: {
    cursor?: string;
    limit: number;
    userId?: string;
    type?: string;
    viewerId?: string;
  }) {
    return PostRepository.getFeed(opts);
  }

  /* ------------------------------------------------------------------ */
  /*  🔥 UPDATED: getPost — now accepts id OR slug                       */
  /* ------------------------------------------------------------------ */
  static async getPost(idOrSlug: string) {
    logger.info('Fetching post', {
      functionName: 'PostService.getPost',
      metadata: { idOrSlug },
    });

    const post = await PostRepository.findByIdOrSlug(idOrSlug);
    logger.info('Post fetched', {
      functionName: 'PostService.getPost',
      metadata: { postId: post?.id },
    });
    if (!post) throw new AppError('Post not found', 404);
    return post;
  }

  static async updatePost(userId: string, postId: string, data: UpdatePostDTO) {
    // For update, we still need the actual UUID
    const post = await PostRepository.findByIdOrSlug(postId);
    if (!post) throw new AppError('Post not found', 404);
    if (post.user.id !== userId) {
      throw new AppError('You can only edit your own posts', 403);
    }
    return PostRepository.update(post.id, data);
  }

  static async deletePost(userId: string, postId: string) {
    const post = await PostRepository.findByIdOrSlug(postId);
    if (!post) throw new AppError('Post not found', 404);
    if (post.user.id !== userId) {
      throw new AppError('You can only delete your own posts', 403);
    }
    await PostRepository.delete(post.id);
    return true;
  }

  static async getMyPosts(userId: string) {
    return PostRepository.findByUser(userId);
  }
}