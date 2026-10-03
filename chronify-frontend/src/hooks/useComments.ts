// src/hooks/useComments.ts
'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiClient, ApiClientError } from '@/lib/api-client'
import { toast } from 'sonner'
import type { Comment } from '@/types/feed'

export function useComments(postId: string | null, autoLoad = true) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)

  const loadComments = useCallback(async () => {
    if (!postId) return
    setLoading(true)
    try {
      const res = await apiClient.get<Comment[]>(`/comments/post/${postId}`)
      setComments(res.data ?? [])
    } catch (err) {
      const message =
        err instanceof ApiClientError ? err.message : 'Failed to load comments'
      toast.error('Could not load comments', { description: message })
    } finally {
      setLoading(false)
    }
  }, [postId])

  const createComment = useCallback(
    async (content: string, parentId?: string) => {
      if (!postId) return
      try {
        const res = await apiClient.post<Comment>('/comments', {
          postId,
          content,
          parentId: parentId ?? null,
        })
        if (res.data) {
          if (parentId) {
            // Reply → push to parent's replies
            setComments((prev) =>
              prev.map((c) =>
                c.id === parentId
                  ? {
                      ...c,
                      replies: [...(c.replies ?? []), res.data!],
                    }
                  : c,
              ),
            )
          } else {
            setComments((prev) => [res.data!, ...prev])
          }
        }
        toast.success('Comment added')
        return res.data
      } catch (err) {
        const message =
          err instanceof ApiClientError ? err.message : 'Failed to comment'
        toast.error('Could not add comment', { description: message })
        throw err
      }
    },
    [postId],
  )

  const updateComment = useCallback(async (commentId: string, content: string) => {
    try {
      const res = await apiClient.put<Comment>(`/comments/${commentId}`, {
        content,
      })
      if (res.data) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? res.data! : c)),
        )
      }
      toast.success('Comment updated')
    } catch (err) {
      const message =
        err instanceof ApiClientError ? err.message : 'Failed to update'
      toast.error('Could not update comment', { description: message })
      throw err
    }
  }, [])

  const deleteComment = useCallback(async (commentId: string) => {
    try {
      await apiClient.delete(`/comments/${commentId}`)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
      toast.success('Comment deleted')
    } catch (err) {
      const message =
        err instanceof ApiClientError ? err.message : 'Failed to delete'
      toast.error('Could not delete comment', { description: message })
      throw err
    }
  }, [])

  useEffect(() => {
    if (autoLoad && postId) void loadComments()
  }, [autoLoad, postId, loadComments])

  return {
    comments,
    loading,
    reload: loadComments,
    createComment,
    updateComment,
    deleteComment,
  }
}