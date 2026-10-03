// src/hooks/useReactions.ts
'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiClient, ApiClientError } from '@/lib/api-client'
import { toast } from 'sonner'
import type { ReactionSummary, ReactionKind } from '@/types/feed'

type ReactionTarget = 'post' | 'comment'

export function useReactions(
  target: ReactionTarget,
  targetId: string | null,
  autoLoad = true,
) {
  const [summary, setSummary] = useState<ReactionSummary | null>(null)
  const [loading, setLoading] = useState(false)

  const loadSummary = useCallback(async () => {
    if (!targetId) return
    setLoading(true)
    try {
      const res = await apiClient.get<ReactionSummary>(
        `/reactions/${target}/${targetId}`,
      )
      setSummary(res.data ?? null)
    } catch (err) {
      console.error('Failed to load reactions', err)
    } finally {
      setLoading(false)
    }
  }, [target, targetId])

  const react = useCallback(
    async (kind: ReactionKind) => {
      if (!targetId) return
      try {
        const body =
          target === 'post'
            ? { postId: targetId, reaction: kind }
            : { commentId: targetId, reaction: kind }

        await apiClient.post(`/reactions/${target}`, body)
        await loadSummary()
      } catch (err) {
        const message =
          err instanceof ApiClientError ? err.message : 'Failed to react'
        toast.error('Could not save reaction', { description: message })
        throw err
      }
    },
    [target, targetId, loadSummary],
  )

  const removeReaction = useCallback(async () => {
    if (!targetId) return
    try {
      await apiClient.delete(`/reactions/${target}/${targetId}`)
      await loadSummary()
    } catch (err) {
      const message =
        err instanceof ApiClientError ? err.message : 'Failed to remove'
      toast.error('Could not remove reaction', { description: message })
      throw err
    }
  }, [target, targetId, loadSummary])

  useEffect(() => {
    if (autoLoad && targetId) void loadSummary()
  }, [autoLoad, targetId, loadSummary])

  return {
    summary,
    loading,
    reload: loadSummary,
    react,
    removeReaction,
  }
}