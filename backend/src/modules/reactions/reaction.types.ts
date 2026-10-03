// src/modules/reaction/reaction.types.ts

export type ReactionKind = 'LIKE' | 'LOVE' | 'SAD' | 'ANGRY' | 'HAHA';

export interface ReactToPostDTO {
  postId: string;
  reaction: ReactionKind;
}

export interface ReactToCommentDTO {
  commentId: string;
  reaction: ReactionKind;
}