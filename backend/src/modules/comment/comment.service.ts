// src/modules/comment/comment.service.ts
import { CommentRepository } from './comment.repository';
import { CreateCommentDTO, UpdateCommentDTO } from './comment.types';
import { PostRepository } from '../post/post.repository';
import { AppError } from '../../utils/AppError';
import { logger } from 'patal-log';

export class CommentService {
  static async create(userId: string, data: CreateCommentDTO) {
    // Verify post exists
    const post = await PostRepository.findById(data.postId);
    if (!post) throw new AppError('Post not found', 404);

    // If replying, verify parent comment exists and belongs to same post
    if (data.parentId) {
      const parent = await CommentRepository.findById(data.parentId);
      if (!parent) throw new AppError('Parent comment not found', 404);
      if (parent.postId !== data.postId) {
        throw new AppError('Parent comment belongs to a different post', 400);
      }
      // Enforce 1-level deep replies only
      if (parent.parentId) {
        throw new AppError('Cannot reply to a reply. Reply to the top-level comment instead.', 400);
      }
    }

    logger.info('Creating comment', {
      functionName: 'CommentService.create',
      metadata: { userId, postId: data.postId },
    });

    return CommentRepository.create(userId, data);
  }

  static async findByPost(postId: string) {
    const post = await PostRepository.findById(postId);
    if (!post) throw new AppError('Post not found', 404);
    return CommentRepository.findByPost(postId);
  }

  static async findReplies(parentId: string) {
    const parent = await CommentRepository.findById(parentId);
    if (!parent) throw new AppError('Comment not found', 404);
    return CommentRepository.findReplies(parentId);
  }

  static async update(userId: string, commentId: string, data: UpdateCommentDTO) {
    const comment = await CommentRepository.findById(commentId);
    if (!comment) throw new AppError('Comment not found', 404);
    if (comment.isDeleted) throw new AppError('Cannot edit a deleted comment', 400);
    if (comment.userId !== userId) {
      throw new AppError('You can only edit your own comments', 403);
    }

    return CommentRepository.update(commentId, data);
  }

  static async delete(userId: string, commentId: string) {
    const comment = await CommentRepository.findById(commentId);
    if (!comment) throw new AppError('Comment not found', 404);
    if (comment.userId !== userId) {
      throw new AppError('You can only delete your own comments', 403);
    }

    await CommentRepository.softDelete(commentId);
    return true;
  }
}