// src/modules/reaction/reaction.service.ts
import { ReactionRepository } from './reaction.repository';
import { PostRepository } from '../post/post.repository';
import { CommentRepository } from '../comment/comment.repository';
import { ReactionKind } from './reaction.types';
import { AppError } from '../../utils/AppError';
import { logger } from 'patal-log';

export class ReactionService {
  // ---------- POST ----------
  static async reactToPost(userId: string, postId: string, reaction: ReactionKind) {
    const post = await PostRepository.findById(postId);
    if (!post) throw new AppError('Post not found', 404);

    logger.info('Reacting to post', {
      functionName: 'ReactionService.reactToPost',
      metadata: { userId, postId, reaction },
    });

    const result = await ReactionRepository.upsertPostReaction(postId, userId, reaction);
    const summary = await ReactionRepository.getPostReactionSummary(postId);

    return { reaction: result, summary };
  }

  static async removePostReaction(userId: string, postId: string) {
    const post = await PostRepository.findById(postId);
    if (!post) throw new AppError('Post not found', 404);

    await ReactionRepository.deletePostReaction(postId, userId);
    const summary = await ReactionRepository.getPostReactionSummary(postId);

    return { summary };
  }

  static async getPostReactionSummary(postId: string) {
    const post = await PostRepository.findById(postId);
    if (!post) throw new AppError('Post not found', 404);
    return ReactionRepository.getPostReactionSummary(postId);
  }

  // ---------- COMMENT ----------
  static async reactToComment(userId: string, commentId: string, reaction: ReactionKind) {
    const comment = await CommentRepository.findById(commentId);
    if (!comment) throw new AppError('Comment not found', 404);

    const result = await ReactionRepository.upsertCommentReaction(commentId, userId, reaction);
    const summary = await ReactionRepository.getCommentReactionSummary(commentId);

    return { reaction: result, summary };
  }

  static async removeCommentReaction(userId: string, commentId: string) {
    const comment = await CommentRepository.findById(commentId);
    if (!comment) throw new AppError('Comment not found', 404);

    await ReactionRepository.deleteCommentReaction(commentId, userId);
    const summary = await ReactionRepository.getCommentReactionSummary(commentId);

    return { summary };
  }

  static async getCommentReactionSummary(commentId: string) {
    const comment = await CommentRepository.findById(commentId);
    if (!comment) throw new AppError('Comment not found', 404);
    return ReactionRepository.getCommentReactionSummary(commentId);
  }
}