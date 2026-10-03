// src/hooks/usePosts.ts
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { FeedService } from '@/services/feed.service'
import type { Post, PostType } from '@/types/feed'

interface UsePostsOptions {
  limit?: number
  autoLoad?: boolean
}

interface CreatePostPayload {
  content: string
  type: PostType
  image: string[]
}

export function usePosts({ limit = 10, autoLoad = true }: UsePostsOptions = {}) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasNext, setHasNext] = useState(false)
  const [cursor, setCursor] = useState<string | null>(null)

  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  /* ---------------------------------------------------------------- */
  /*  LOAD INITIAL                                                     */
  /* ---------------------------------------------------------------- */
  const loadInitial = useCallback(async () => {
    setLoading(true)
    try {
      const { posts: list, pagination } = await FeedService.getFeed({ limit })
      if (!mountedRef.current) return
      setPosts(list)
      setHasNext(pagination.hasNext)
      setCursor(pagination.nextCursor)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load feed')
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    if (autoLoad) void loadInitial()
  }, [autoLoad, loadInitial])

  /* ---------------------------------------------------------------- */
  /*  LOAD MORE                                                        */
  /* ---------------------------------------------------------------- */
  const loadMore = useCallback(async () => {
    if (!hasNext || loadingMore || !cursor) return
    setLoadingMore(true)
    try {
      const { posts: more, pagination } = await FeedService.getFeed({
        limit,
        cursor,
      })
      if (!mountedRef.current) return
      setPosts((prev) => [...prev, ...more])
      setHasNext(pagination.hasNext)
      setCursor(pagination.nextCursor)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load more')
    } finally {
      if (mountedRef.current) setLoadingMore(false)
    }
  }, [cursor, hasNext, limit, loadingMore])

  /* ---------------------------------------------------------------- */
  /*  CREATE POST                                                      */
  /* ---------------------------------------------------------------- */
  const createPost = useCallback(async (payload: CreatePostPayload) => {
    // 🔥 FIX: Payload is already shaped correctly.
    //    Do NOT wrap it in another { content: ... }.
    const newPost = await FeedService.createPost({
      content: payload.content,
      type: payload.type,
      image: payload.image ?? [],
    })

    if (mountedRef.current) {
      setPosts((prev) => [newPost, ...prev])
    }
    return newPost
  }, [])

  /* ---------------------------------------------------------------- */
  /*  UPDATE POST (optimistic)                                         */
  /* ---------------------------------------------------------------- */
  const updatePost = useCallback((updated: Post) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  }, [])

  /* ---------------------------------------------------------------- */
  /*  DELETE POST (optimistic)                                         */
  /* ---------------------------------------------------------------- */
  const deletePost = useCallback(async (postId: string) => {
    // Optimistic remove
    setPosts((prev) => prev.filter((p) => p.id !== postId))
    try {
      await FeedService.deletePost(postId)
    } catch (err: any) {
      // If delete failed, reload to reconcile
      toast.error(err?.message || 'Failed to delete post')
      void loadInitial()
      throw err
    }
  }, [loadInitial])

  return {
    posts,
    loading,
    loadingMore,
    hasNext,
    loadMore,
    loadInitial,
    createPost,
    updatePost,
    deletePost,
  }
}