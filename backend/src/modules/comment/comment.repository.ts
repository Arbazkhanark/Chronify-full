// src/modules/comment/comment.repository.ts
import { prisma } from '../../config/prisma';
import { CreateCommentDTO, UpdateCommentDTO } from './comment.types';

const COMMENT_USER_SELECT = {
  select: {
    id: true,
    name: true,
    profile: {
      select: { userName: true, avatarUrl: true },
    },
  },
};

export class CommentRepository {
  static create(userId: string, data: CreateCommentDTO) {
    return prisma.comment.create({
      data: {
        postId: data.postId,
        userId,
        content: data.content,
        parentId: data.parentId ?? null,
      },
      include: {
        user: COMMENT_USER_SELECT,
        _count: { select: { replies: true, reactions: true } },
      },
    });
  }

  static findById(id: string) {
    return prisma.comment.findUnique({
      where: { id },
      include: {
        user: COMMENT_USER_SELECT,
        reactions: { select: { id: true, userId: true, reaction: true } },
        _count: { select: { replies: true, reactions: true } },
      },
    });
  }

  /**
   * Top-level comments for a post + nested replies (1 level deep).
   */
  static async findByPost(postId: string) {
    return prisma.comment.findMany({
      where: {
        postId,
        parentId: null, // top-level only
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: COMMENT_USER_SELECT,
        reactions: { select: { id: true, userId: true, reaction: true } },
        replies: {
          where: { isDeleted: false }, // hide deleted replies
          orderBy: { createdAt: 'asc' },
          include: {
            user: COMMENT_USER_SELECT,
            reactions: { select: { id: true, userId: true, reaction: true } },
          },
        },
        _count: { select: { replies: true, reactions: true } },
      },
    });
  }

  static findReplies(parentId: string) {
    return prisma.comment.findMany({
      where: { parentId, isDeleted: false },
      orderBy: { createdAt: 'asc' },
      include: {
        user: COMMENT_USER_SELECT,
        reactions: { select: { id: true, userId: true, reaction: true } },
      },
    });
  }

  static update(id: string, data: UpdateCommentDTO) {
    return prisma.comment.update({
      where: { id },
      data: {
        content: data.content,
        editedAt: new Date(),
      },
      include: { user: COMMENT_USER_SELECT },
    });
  }

  static softDelete(id: string) {
    return prisma.comment.update({
      where: { id },
      data: {
        isDeleted: true,
        content: '[deleted]',
      },
    });
  }

  static hardDelete(id: string) {
    // Also delete all replies + reactions first
    return prisma.$transaction([
      prisma.reaction.deleteMany({ where: { commentId: id } }),
      prisma.comment.deleteMany({ where: { parentId: id } }),
      prisma.comment.delete({ where: { id } }),
    ]);
  }
}