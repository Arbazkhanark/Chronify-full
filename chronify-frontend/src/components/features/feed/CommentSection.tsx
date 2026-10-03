// src/components/features/feed/CommentSection.tsx
'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { toast } from 'sonner'
import { Loader2, Send, AlertTriangle, Trash2, RefreshCw, Ghost } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import UserAvatar from '@/components/shared/UserAvatar'
import ReactionPicker from './ReactionPicker'
import PostContent from './PostContent'

import { FeedService } from '@/services/feed.service'
import type { Comment, ReactionKind } from '@/types/feed'

/* ============================================================================
   HELPERS
   ============================================================================ */

function safeTimeAgo(date: string): string {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  } catch {
    return ''
  }
}

/**
 * Detects if an error means "the resource no longer exists".
 * Used to gracefully handle 404s (post/comment already deleted).
 */
function isNotFoundError(err: any, resource: 'post' | 'comment' | 'any' = 'any'): boolean {
  const msg = String(err?.message || '').toLowerCase()

  if (err?.status === 404) return true

  if (resource === 'post' || resource === 'any') {
    if (msg.includes('post not found')) return true
  }
  if (resource === 'comment' || resource === 'any') {
    if (msg.includes('comment not found')) return true
  }
  // generic
  if (msg.includes('not found')) return true

  return false
}

/* ============================================================================
   RECURSIVE TREE HELPERS
   ============================================================================ */

function updateCommentTree(
  comments: Comment[],
  id: string,
  updater: (c: Comment) => Comment,
): Comment[] {
  return comments.map((c) => {
    if (c.id === id) return updater(c)
    if (c.replies?.length) {
      return { ...c, replies: updateCommentTree(c.replies, id, updater) }
    }
    return c
  })
}

function removeCommentFromTree(comments: Comment[], id: string): Comment[] {
  return comments
    .filter((c) => c.id !== id)
    .map((c) =>
      c.replies?.length
        ? { ...c, replies: removeCommentFromTree(c.replies, id) }
        : c,
    )
}

/* ============================================================================
   MAIN COMPONENT
   ============================================================================ */

export default function CommentSection({
  postId,
  comments,
  currentUserId,
  onCommentsChange,
  onPostGone,
}: {
  postId: string
  comments: Comment[]
  currentUserId?: string
  onCommentsChange: (comments: Comment[]) => void
  /** 🆕 Notifies the parent when the post has been deleted (404 on any call) */
  onPostGone?: () => void
}) {
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 🆕 Local flag: once we see a 404, we lock the section
  const [isPostGone, setIsPostGone] = useState(false)

  // 🆕 Delete-comment confirmation state
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null)
  const [deletingComment, setDeletingComment] = useState(false)

  /* ------------------------------------------------------------------ */
  /*  HANDLE 404 FROM ANY API                                           */
  /* ------------------------------------------------------------------ */
  const handlePostGone = () => {
    if (isPostGone) return
    setIsPostGone(true)
    onPostGone?.()

    toast.error('Post no longer available', {
      description:
        'The author deleted this post. Refresh the feed to see the latest posts.',
      duration: 6000,
      action: {
        label: 'Refresh',
        onClick: () => {
          if (typeof window !== 'undefined') {
            window.location.reload()
          }
        },
      },
    })
  }

  /* ------------------------------------------------------------------ */
  /*  ADD COMMENT                                                       */
  /* ------------------------------------------------------------------ */
  const handleAddComment = async () => {
    if (!newComment.trim()) return

    if (isPostGone) {
      toast.error('This post is no longer available')
      return
    }

    setSubmitting(true)
    try {
      const c = await FeedService.addComment(postId, newComment.trim())
      onCommentsChange([c, ...comments])
      setNewComment('')
      toast.success('Comment added', {
        description: 'Your comment is now visible to everyone.',
        duration: 3000,
      })
    } catch (err: any) {
      if (isNotFoundError(err, 'post')) {
        handlePostGone()
        return
      }
      toast.error('Failed to add comment', {
        description: err?.message || 'Please try again in a moment.',
        duration: 5000,
      })
    } finally {
      setSubmitting(false)
    }
  }

  /* ------------------------------------------------------------------ */
  /*  DELETE COMMENT (with custom confirm modal)                        */
  /* ------------------------------------------------------------------ */
  const openDeleteConfirm = (comment: Comment) => {
    setCommentToDelete(comment)
  }

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return
    const id = commentToDelete.id
    setDeletingComment(true)
    try {
      await FeedService.deleteComment(id)
      onCommentsChange(removeCommentFromTree(comments, id))
      toast.success('Comment deleted', {
        description: 'Your comment has been removed.',
        duration: 3000,
      })
      setCommentToDelete(null)
    } catch (err: any) {
      // Comment already gone → treat as success (still remove locally)
      if (isNotFoundError(err, 'comment')) {
        onCommentsChange(removeCommentFromTree(comments, id))
        toast.info('Comment was already deleted', {
          description: 'Removing it from your view…',
          duration: 3000,
        })
        setCommentToDelete(null)
        return
      }
      // Post gone → close modal & notify
      if (isNotFoundError(err, 'post')) {
        setCommentToDelete(null)
        handlePostGone()
        return
      }
      toast.error('Failed to delete comment', {
        description: err?.message || 'Please try again in a moment.',
        duration: 5000,
      })
    } finally {
      setDeletingComment(false)
    }
  }

  /* ------------------------------------------------------------------ */
  /*  REACTION                                                          */
  /* ------------------------------------------------------------------ */
  const handleReaction = async (
    commentId: string,
    reaction: ReactionKind | null,
  ) => {
    if (isPostGone) return

    try {
      if (reaction) {
        await FeedService.reactToComment(commentId, reaction)
      } else {
        await FeedService.removeCommentReaction(commentId)
      }

      onCommentsChange(
        updateCommentTree(comments, commentId, (c) => {
          const otherReactions = (c.reactions ?? []).filter(
            (r) => r.userId !== currentUserId,
          )
          const nextReactions = reaction
            ? [
                ...otherReactions,
                {
                  id: `temp-${Date.now()}`,
                  userId: currentUserId ?? '',
                  commentId: c.id,
                  reaction,
                  createdAt: new Date().toISOString(),
                },
              ]
            : otherReactions

          return { ...c, reactions: nextReactions }
        }),
      )
    } catch (err: any) {
      // Comment itself gone → remove from tree
      if (isNotFoundError(err, 'comment')) {
        onCommentsChange(removeCommentFromTree(comments, commentId))
        toast.info('Comment was deleted')
        return
      }
      // Post gone → notify parent
      if (isNotFoundError(err, 'post')) {
        handlePostGone()
        return
      }
      toast.error('Failed to react', {
        description: err?.message || 'Please try again in a moment.',
      })
    }
  }

  /* ------------------------------------------------------------------ */
  /*  REPLY                                                             */
  /* ------------------------------------------------------------------ */
  const handleReply = async (parentId: string, content: string) => {
    if (isPostGone) {
      toast.error('This post is no longer available')
      throw new Error('Post gone')
    }

    try {
      const c = await FeedService.addComment(postId, content, parentId)
      onCommentsChange(
        updateCommentTree(comments, parentId, (parent) => ({
          ...parent,
          replies: [...(parent.replies ?? []), c],
        })),
      )
      toast.success('Reply added', { duration: 2500 })
    } catch (err: any) {
      if (isNotFoundError(err, 'post')) {
        handlePostGone()
        throw err
      }
      if (isNotFoundError(err, 'comment')) {
        // Parent comment no longer exists → remove from tree
        onCommentsChange(removeCommentFromTree(comments, parentId))
        toast.info('The comment you replied to was deleted')
        throw err
      }
      toast.error('Failed to add reply', {
        description: err?.message || 'Please try again in a moment.',
      })
      throw err
    }
  }

  /* ================================================================
     RENDER
     ================================================================ */

  // 🆕 Whole section replaced when post gone
  if (isPostGone) {
    return (
      <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50">
        <div className="p-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 flex-shrink-0">
          <Ghost className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
            Comments are unavailable
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
            This post has been deleted by the author.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            if (typeof window !== 'undefined') window.location.reload()
          }}
          className="flex-shrink-0 gap-1.5 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {/* ============ COMPOSE ============ */}
        <div className="flex items-start gap-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                handleAddComment()
              }
            }}
            placeholder="Write a comment... (Cmd/Ctrl + Enter to post)"
            className="resize-none min-h-[40px] text-sm dark:bg-gray-900 dark:border-gray-700"
            rows={1}
            disabled={submitting}
          />
          <Button
            size="sm"
            onClick={handleAddComment}
            disabled={submitting || !newComment.trim()}
            className="flex-shrink-0"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* ============ LIST ============ */}
        {comments.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-3">
            No comments yet — be the first!
          </p>
        ) : (
          comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              currentUserId={currentUserId}
              onDelete={openDeleteConfirm}
              onReact={handleReaction}
              onReply={handleReply}
            />
          ))
        )}
      </div>

      {/* ==================== DELETE COMMENT CONFIRM MODAL ==================== */}
      <Dialog
        open={!!commentToDelete}
        onOpenChange={(open) => {
          if (!open) setCommentToDelete(null)
        }}
      >
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-full bg-red-100 dark:bg-red-900/30 flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-base dark:text-gray-100">
                  Delete this comment?
                </DialogTitle>
                <DialogDescription className="dark:text-gray-400 mt-1.5">
                  Your comment will be permanently removed and replaced with
                  "[deleted]". This action{' '}
                  <strong className="text-gray-900 dark:text-gray-200">
                    cannot be undone
                  </strong>
                  .
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Comment preview */}
          {commentToDelete?.content && (
            <div className="mt-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {commentToDelete.content.slice(0, 120)}
                {commentToDelete.content.length > 120 ? '…' : ''}
              </p>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setCommentToDelete(null)}
              disabled={deletingComment}
              className="w-full sm:w-auto dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteComment}
              disabled={deletingComment}
              className="w-full sm:w-auto gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              {deletingComment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete comment
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ============================================================================
   COMMENT ITEM (recursive)
   ============================================================================ */

function CommentItem({
  comment,
  currentUserId,
  onDelete,
  onReact,
  onReply,
  isReply = false,
}: {
  comment: Comment
  currentUserId?: string
  onDelete: (comment: Comment) => void
  onReact: (id: string, r: ReactionKind | null) => void
  onReply: (parentId: string, content: string) => Promise<void>
  isReply?: boolean
}) {
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replying, setReplying] = useState(false)

  const isOwner = currentUserId === comment.userId
  const isDeleted = comment.isDeleted

  const myReaction =
    (currentUserId
      ? (comment.reactions ?? []).find((r) => r.userId === currentUserId)
          ?.reaction
      : null) ?? null

  const totalReactions = (comment.reactions ?? []).length

  const submitReply = async () => {
    if (!replyText.trim()) return
    setReplying(true)
    try {
      await onReply(comment.id, replyText.trim())
      setReplyText('')
      setShowReply(false)
    } catch {
      /* parent already toasted */
    } finally {
      setReplying(false)
    }
  }

  return (
    <div className={isReply ? 'ml-8 sm:ml-10' : ''}>
      <div className="flex items-start gap-2">
        <UserAvatar
          name={comment.user.name}
          avatarUrl={comment.user.profile?.avatarUrl}
          size={isReply ? 28 : 34}
        />

        <div className="flex-1 min-w-0">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-3 py-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {comment.user.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {safeTimeAgo(comment.createdAt)}
              </span>
              {comment.editedAt && (
                <span className="text-xs text-gray-400">· edited</span>
              )}
            </div>

            {isDeleted ? (
              <p className="text-sm mt-0.5 italic text-gray-400">
                {comment.content}
              </p>
            ) : (
              <PostContent
                content={comment.content}
                className="mt-0.5 !text-gray-700 dark:!text-gray-300"
              />
            )}
          </div>

          {!isDeleted && (
            <div className="flex items-center gap-2 mt-1 ml-3 flex-wrap">
              <ReactionPicker
                currentReaction={myReaction}
                onSelect={(r) => onReact(comment.id, r)}
                onRemove={() => onReact(comment.id, null)}
                compact
              />
              {totalReactions > 0 && (
                <span className="text-xs text-gray-500">
                  {totalReactions}
                </span>
              )}
              {!isReply && (
                <button
                  type="button"
                  onClick={() => setShowReply((s) => !s)}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Reply
                </button>
              )}
              {isOwner && (
                <button
                  type="button"
                  onClick={() => onDelete(comment)}
                  className="text-xs font-medium text-gray-500 hover:text-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          )}

          {showReply && (
            <div className="flex items-start gap-2 mt-2">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault()
                    submitReply()
                  }
                }}
                placeholder={`Reply to ${comment.user.name}…`}
                className="resize-none min-h-[36px] text-sm dark:bg-gray-900 dark:border-gray-700"
                rows={1}
                disabled={replying}
              />
              <Button
                size="sm"
                onClick={submitReply}
                disabled={replying || !replyText.trim()}
              >
                {replying ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
          )}

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2 space-y-2">
              {comment.replies.map((r) => (
                <CommentItem
                  key={r.id}
                  comment={r}
                  currentUserId={currentUserId}
                  onDelete={onDelete}
                  onReact={onReact}
                  onReply={onReply}
                  isReply
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}