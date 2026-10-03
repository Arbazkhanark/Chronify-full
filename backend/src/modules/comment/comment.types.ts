// src/modules/comment/comment.types.ts

export interface CreateCommentDTO {
  postId: string;
  content: string;
  parentId?: string | null;
}

export interface UpdateCommentDTO {
  content: string;
}