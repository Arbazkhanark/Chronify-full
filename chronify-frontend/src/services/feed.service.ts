// src/lib/feed-service.ts
import { apiClient } from '@/lib/api-client';
import type {
  Post,
  Comment,
  PostType,
  ReactionKind,
  Reaction,
} from '@/types/feed'

/* ============================================================================
   HELPERS
   ============================================================================ */

function summaryFromReactions(
  reactions: Reaction[] | undefined,
  myUserId?: string,
): { summary: Record<string, number>; myReaction: ReactionKind | null; total: number } {
  const summary: Record<string, number> = {}
  let myReaction: ReactionKind | null = null

  ;(reactions ?? []).forEach((r) => {
    summary[r.reaction] = (summary[r.reaction] || 0) + 1
    if (myUserId && r.userId === myUserId) {
      myReaction = r.reaction
    }
  })

  return {
    summary,
    myReaction,
    total: (reactions ?? []).length,
  }
}

function normalizeComment(c: any): Comment {
  return {
    id: String(c?.id ?? ''),
    postId: String(c?.postId ?? ''),
    userId: String(c?.userId ?? ''),
    content: String(c?.content ?? ''),
    parentId: c?.parentId ?? null,
    isDeleted: !!c?.isDeleted,
    editedAt: c?.editedAt ?? null,
    createdAt: String(c?.createdAt ?? new Date().toISOString()),
    updatedAt: String(c?.updatedAt ?? new Date().toISOString()),
    user: c?.user,
    reactions: Array.isArray(c?.reactions) ? c.reactions : [],
    replies: Array.isArray(c?.replies) ? c.replies.map(normalizeComment) : [],
    _count: c?._count,
  }
}

function normalizePost(p: any): Post {
  return {
    id: String(p?.id ?? ''),
    userId: String(p?.userId ?? ''),
    content: String(p?.content ?? ''),
    type: (p?.type ?? 'GENERAL') as PostType,
    image: Array.isArray(p?.image) ? p.image : [],
    createdAt: String(p?.createdAt ?? new Date().toISOString()),
    updatedAt: String(p?.updatedAt ?? new Date().toISOString()),
    user: p?.user,
    reactions: Array.isArray(p?.reactions) ? p.reactions : [],
    comments: Array.isArray(p?.comments)
      ? p.comments.map(normalizeComment)
      : [],
    _count: p?._count ?? { reactions: 0, comments: 0 },
  }
}

/* ============================================================================
   FEED SERVICE
   ============================================================================ */

export const FeedService = {
  /* --------------------------------------------------------------------------
     FEED
     -------------------------------------------------------------------------- */
  async getFeed(opts: { cursor?: string; limit?: number; type?: string } = {}) {
    const q = new URLSearchParams()
    if (opts.cursor) q.set('cursor', opts.cursor)
    q.set('limit', String(opts.limit ?? 10))
    if (opts.type) q.set('type', opts.type)

    const res = await apiClient.get<Post[]>(`/posts/feed?${q.toString()}`)

    return {
      posts: (res.data ?? []).map(normalizePost),
      pagination: res.pagination ?? { hasNext: false, nextCursor: null },
    }
  },

  async getMyPosts(): Promise<Post[]> {
    const res = await apiClient.get<Post[]>(`/posts/me`)
    return (res.data ?? []).map(normalizePost)
  },

  /* --------------------------------------------------------------------------
     SINGLE POST
     -------------------------------------------------------------------------- */
  async getPost(id: string): Promise<Post> {
    const res = await apiClient.get<Post>(`/posts/${encodeURIComponent(id)}`)
    if (!res.data) throw new Error('Post not found')
    return normalizePost(res.data)
  },

  /* --------------------------------------------------------------------------
     CREATE / UPDATE / DELETE
     -------------------------------------------------------------------------- */
  async createPost(body: {
    content: string
    image?: string[]
    type?: PostType
  }): Promise<Post> {
    const res = await apiClient.post<Post>(`/posts`, body)
    if (!res.data) throw new Error('Failed to create post')
    return normalizePost(res.data)
  },

  async updatePost(
    id: string,
    body: { content?: string; image?: string[]; type?: PostType },
  ): Promise<Post> {
    const res = await apiClient.put<Post>(
      `/posts/${encodeURIComponent(id)}`,
      body,
    )
    if (!res.data) throw new Error('Failed to update post')
    return normalizePost(res.data)
  },

  async deletePost(id: string): Promise<void> {
    await apiClient.delete(`/posts/${encodeURIComponent(id)}`)
  },

  /* --------------------------------------------------------------------------
     REACTIONS — POST
     -------------------------------------------------------------------------- */
  async reactToPost(
    postId: string,
    reaction: ReactionKind,
  ): Promise<{ myReaction: ReactionKind; summary: Record<string, number> }> {
    const res = await apiClient.post<any>(`/reactions/post`, {
      postId,
      reaction,
    })

    const summary: Record<string, number> = {}
    const list = res.data?.summary ?? []
    if (Array.isArray(list)) {
      list.forEach((x: any) => {
        if (x?.reaction) summary[x.reaction] = x._count?.reaction ?? 0
      })
    }

    return { myReaction: reaction, summary }
  },

  async removePostReaction(
    postId: string,
  ): Promise<{ myReaction: null; summary: Record<string, number> }> {
    const res = await apiClient.delete<any>(
      `/reactions/post/${encodeURIComponent(postId)}`,
    )

    const summary: Record<string, number> = {}
    const list = res.data?.summary ?? []
    if (Array.isArray(list)) {
      list.forEach((x: any) => {
        if (x?.reaction) summary[x.reaction] = x._count?.reaction ?? 0
      })
    }

    return { myReaction: null, summary }
  },

  /* --------------------------------------------------------------------------
     COMMENTS
     -------------------------------------------------------------------------- */
  async getCommentsForPost(postId: string): Promise<Comment[]> {
    const res = await apiClient.get<Comment[]>(
      `/comments/post/${encodeURIComponent(postId)}`,
    )
    return (res.data ?? []).map(normalizeComment)
  },

  async addComment(
    postId: string,
    content: string,
    parentId?: string | null,
  ): Promise<Comment> {
    const res = await apiClient.post<Comment>(`/comments`, {
      postId,
      content,
      parentId: parentId ?? null,
    })
    if (!res.data) throw new Error('Failed to add comment')
    return normalizeComment(res.data)
  },

  async updateComment(id: string, content: string): Promise<Comment> {
    const res = await apiClient.put<Comment>(
      `/comments/${encodeURIComponent(id)}`,
      { content },
    )
    if (!res.data) throw new Error('Failed to update comment')
    return normalizeComment(res.data)
  },

  async deleteComment(id: string): Promise<void> {
    await apiClient.delete(`/comments/${encodeURIComponent(id)}`)
  },

  /* --------------------------------------------------------------------------
     REACTIONS — COMMENT
     -------------------------------------------------------------------------- */
  async reactToComment(
    commentId: string,
    reaction: ReactionKind,
  ): Promise<{ myReaction: ReactionKind; summary: Record<string, number> }> {
    const res = await apiClient.post<any>(`/reactions/comment`, {
      commentId,
      reaction,
    })

    const summary: Record<string, number> = {}
    const list = res.data?.summary ?? []
    if (Array.isArray(list)) {
      list.forEach((x: any) => {
        if (x?.reaction) summary[x.reaction] = x._count?.reaction ?? 0
      })
    }

    return { myReaction: reaction, summary }
  },

  async removeCommentReaction(
    commentId: string,
  ): Promise<{ myReaction: null; summary: Record<string, number> }> {
    const res = await apiClient.delete<any>(
      `/reactions/comment/${encodeURIComponent(commentId)}`,
    )

    const summary: Record<string, number> = {}
    const list = res.data?.summary ?? []
    if (Array.isArray(list)) {
      list.forEach((x: any) => {
        if (x?.reaction) summary[x.reaction] = x._count?.reaction ?? 0
      })
    }

    return { myReaction: null, summary }
  },
}

/* Re-export helper for consumers that want myReaction from a Post */
export { summaryFromReactions }