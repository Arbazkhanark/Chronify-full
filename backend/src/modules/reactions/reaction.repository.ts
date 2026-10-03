// src/modules/reaction/reaction.repository.ts
import { prisma } from '../../config/prisma';
import { ReactionKind } from './reaction.types';

export class ReactionRepository {
  // ---------- POST REACTIONS ----------
  static findPostReaction(postId: string, userId: string) {
    return prisma.reaction.findUnique({
      where: { postId_userId: { postId, userId } },
    });
  }

  static async upsertPostReaction(postId: string, userId: string, reaction: ReactionKind) {
    // Check if user already reacted
    const existing = await this.findPostReaction(postId, userId);

    if (existing) {
      // Update existing
      return prisma.reaction.update({
        where: { id: existing.id },
        data: { reaction },
      });
    }

    // Create new
    return prisma.reaction.create({
      data: { postId, userId, reaction },
    });
  }

  static deletePostReaction(postId: string, userId: string) {
    return prisma.reaction.deleteMany({
      where: { postId, userId },
    });
  }

  static getPostReactionSummary(postId: string) {
    return prisma.reaction.groupBy({
      by: ['reaction'],
      where: { postId },
      _count: { reaction: true },
    });
  }

  // ---------- COMMENT REACTIONS ----------
  static findCommentReaction(commentId: string, userId: string) {
    return prisma.reaction.findUnique({
      where: { commentId_userId: { commentId, userId } },
    });
  }

  static async upsertCommentReaction(commentId: string, userId: string, reaction: ReactionKind) {
    const existing = await this.findCommentReaction(commentId, userId);

    if (existing) {
      return prisma.reaction.update({
        where: { id: existing.id },
        data: { reaction },
      });
    }

    return prisma.reaction.create({
      data: { commentId, userId, reaction },
    });
  }

  static deleteCommentReaction(commentId: string, userId: string) {
    return prisma.reaction.deleteMany({
      where: { commentId, userId },
    });
  }

  static getCommentReactionSummary(commentId: string) {
    return prisma.reaction.groupBy({
      by: ['reaction'],
      where: { commentId },
      _count: { reaction: true },
    });
  }
}