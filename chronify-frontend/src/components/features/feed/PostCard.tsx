// src/components/features/feed/PostCard.tsx
'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import {
  MessageCircle,
  Share2,
  MoreHorizontal,
  Trash2,
  Loader2,
  Globe,
  Copy,
  Check,
  Twitter,
  Linkedin,
  MapPin,
  CheckCircle2,
  Briefcase,
  AlertTriangle,
  X,
  RefreshCw,
  Ghost,
  Pencil,
  UploadCloud,
  Save,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { Post, Comment, ReactionKind, PostType } from '@/types/feed'
import { FeedService } from '@/services/feed.service'
import ReactionPicker, { getTopReactions } from './ReactionPicker'
import UserAvatar from '@/components/shared/UserAvatar'
import CommentSection from './CommentSection'
import PostContent from './PostContent'

import { getPostPublicUrl } from '@/lib/post-url'
import {
  uploadToCloudinary,
  validateImageFile,
  compressImage,
  type UploadProgress,
} from '@/lib/cloudinary'

/* ============================================================================
   CONSTANTS
   ============================================================================ */

const TYPE_BADGE: Record<
  PostType,
  { label: string; className: string } | null
> = {
  ACHIEVEMENT: {
    label: '🏆 Achievement',
    className:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-0',
  },
  JOURNEY: {
    label: '🚀 Journey',
    className:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-0',
  },
  MILESTONE: {
    label: '🎯 Milestone',
    className:
      'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-0',
  },
  GENERAL: null,
}

const MAX_IMAGES = 10

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

function isPostGoneError(err: any): boolean {
  const msg = String(err?.message || '').toLowerCase()
  return (
    msg.includes('post not found') ||
    msg.includes('not found') ||
    err?.status === 404
  )
}

function sanitizeImageUrls(urls: (string | null | undefined)[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const u of urls) {
    if (typeof u !== 'string') continue
    const trimmed = u.trim()
    if (!trimmed) continue
    if (!/^https?:\/\//i.test(trimmed)) continue
    if (seen.has(trimmed)) continue
    seen.add(trimmed)
    out.push(trimmed)
  }
  return out
}

/* ============================================================================
   PROPS
   ---------------------------------------------------------------------------
   🔥 Accepts BOTH `onDelete` (imperative) AND `onDeleted` (past-tense).
   Whichever the parent passes, `confirmDelete` will invoke only one.
   ============================================================================ */

export interface PostCardProps {
  post: Post
  currentUserId?: string
  onUpdated?: (post: Post) => void
  /** Called after a successful delete — imperative naming */
  onDelete?: (id: string) => void | Promise<void>
  /** Called after a successful delete — past-tense naming (alias) */
  onDeleted?: (id: string) => void | Promise<void>
  onEdited?: (post: Post) => void
  compact?: boolean
}

/* ============================================================================
   COMPONENT
   ============================================================================ */

export default function PostCard({
  post,
  currentUserId,
  onUpdated,
  onDelete,
  onDeleted,
  onEdited,
  compact = false,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>(post?.comments ?? [])
  const [loadingComments, setLoadingComments] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  /* ============ EDIT STATE ============ */
  const [showEdit, setShowEdit] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [editType, setEditType] = useState<PostType>('GENERAL')
  const [editImages, setEditImages] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  /* ============ UPLOAD STATE ============ */
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({})
  const [hasUnsavedUploads, setHasUnsavedUploads] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isPostGone, setIsPostGone] = useState(false)

  /* ================================================================
     🛡️ GUARD
     ================================================================ */
  if (!post || !post.id) {
    return null
  }

  const safePost = post
  const safeUser = safePost.user
  const safeProfile = safeUser?.profile ?? null

  const isOwner = !!currentUserId && currentUserId === safePost.userId

  /* ------------------------------------------------------------------ */
  /*  POST GONE                                                          */
  /* ------------------------------------------------------------------ */

  const handlePostGone = (source: 'comment' | 'react' | 'delete' | 'edit') => {
    setIsPostGone(true)
    setShowComments(false)

    const messages: Record<string, string> = {
      comment:
        'The post was deleted by the author before your comment could be added.',
      react:
        'The post was deleted by the author before your reaction could be saved.',
      delete: 'This post was already deleted.',
      edit: 'This post was deleted before your edits could be saved.',
    }

    toast.error('Post no longer available', {
      description: `${messages[source]} Refresh the feed to see the latest posts.`,
      duration: 6000,
      action: {
        label: 'Refresh',
        onClick: () => {
          if (typeof window !== 'undefined') window.location.reload()
        },
      },
    })
  }

  /* ------------------------------------------------------------------ */
  /*  REACTIONS                                                          */
  /* ------------------------------------------------------------------ */

  const handleReaction = async (reaction: ReactionKind | null) => {
    if (isPostGone) {
      toast.error('This post is no longer available')
      return
    }

    try {
      if (reaction) {
        await FeedService.reactToPost(safePost.id, reaction)
      } else {
        await FeedService.removePostReaction(safePost.id)
      }

      const withoutMe = (safePost.reactions ?? []).filter(
        (r) => r.userId !== currentUserId,
      )
      const nextReactions = reaction
        ? [
            ...withoutMe,
            {
              id: `temp-${Date.now()}`,
              userId: currentUserId ?? '',
              postId: safePost.id,
              reaction,
              createdAt: new Date().toISOString(),
            },
          ]
        : withoutMe

      onUpdated?.({
        ...safePost,
        reactions: nextReactions,
      })
    } catch (err: any) {
      if (isPostGoneError(err)) {
        handlePostGone('react')
        return
      }
      toast.error(err?.message || 'Failed to react')
    }
  }

  /* ------------------------------------------------------------------ */
  /*  COMMENTS                                                           */
  /* ------------------------------------------------------------------ */

  const toggleComments = async () => {
    if (isPostGone) {
      toast.error('This post is no longer available')
      return
    }

    if (!showComments && comments.length === 0) {
      setLoadingComments(true)
      try {
        const list = await FeedService.getCommentsForPost(safePost.id)
        setComments(list)
      } catch (err: any) {
        if (isPostGoneError(err)) {
          handlePostGone('comment')
          return
        }
        toast.error(err?.message || 'Failed to load comments')
      } finally {
        setLoadingComments(false)
      }
    }
    setShowComments((s) => !s)
  }

  /* ------------------------------------------------------------------ */
  /*  EDIT POST                                                          */
  /* ------------------------------------------------------------------ */

  const openEditModal = () => {
    setEditContent(safePost.content ?? '')
    setEditType(safePost.type ?? 'GENERAL')
    setEditImages(sanitizeImageUrls(safePost.image ?? []))
    setUploadProgress({})
    setHasUnsavedUploads(false)
    setShowEdit(true)
  }

  const handleCloseEdit = (open: boolean) => {
    if (saving || uploading) return

    if (!open && hasUnsavedUploads) {
      const proceed = window.confirm(
        "You uploaded images but haven't saved yet. Close anyway? Your images will be lost.",
      )
      if (!proceed) return
    }

    setShowEdit(open)
    if (!open) {
      setHasUnsavedUploads(false)
      setUploadProgress({})
    }
  }

  const handlePickFiles = () => {
    fileInputRef.current?.click()
  }

  const handleFilesSelected = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''

    if (files.length === 0) return

    const remainingSlots = MAX_IMAGES - editImages.length
    if (remainingSlots <= 0) {
      toast.error(`You can only have ${MAX_IMAGES} images per post`)
      return
    }

    const toUpload = files.slice(0, remainingSlots)

    if (files.length > remainingSlots) {
      toast.info(
        `Only ${remainingSlots} more image${remainingSlots > 1 ? 's' : ''} allowed — some files were skipped.`,
      )
    }

    for (const file of toUpload) {
      const err = validateImageFile(file)
      if (err) {
        toast.error(err)
        return
      }
    }

    setUploading(true)
    setUploadProgress({})

    const uploadedUrls: string[] = []
    let failed = 0

    for (let i = 0; i < toUpload.length; i++) {
      const file = toUpload[i]
      try {
        const compressed = await compressImage(file)

        const result = await uploadToCloudinary(compressed, {
          onProgress: (p: UploadProgress) => {
            setUploadProgress((prev) => ({ ...prev, [i]: p.percent }))
          },
        })

        if (result.secureUrl) {
          uploadedUrls.push(result.secureUrl)
        } else if (result.secure_url) {
          uploadedUrls.push(result.secure_url)
        }
      } catch (err: any) {
        failed++
        console.error('[Cloudinary] upload failed:', err)
        toast.error(
          `Failed to upload "${file.name}": ${err?.message || 'Unknown error'}`,
        )
      }
    }

    if (uploadedUrls.length > 0) {
      setEditImages((prev) => sanitizeImageUrls([...prev, ...uploadedUrls]))
      setHasUnsavedUploads(true)
      toast.success(
        `${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''} uploaded — don't forget to save!`,
      )
    }

    if (failed > 0) {
      toast.warning(`${failed} image${failed > 1 ? 's' : ''} failed to upload`)
    }

    setUploading(false)
    setUploadProgress({})
  }

  const handleRemoveEditImage = (index: number) => {
    setEditImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSaveEdit = async () => {
    const trimmed = editContent.trim()

    if (!trimmed) {
      toast.error('Post content cannot be empty')
      return
    }

    if (uploading) {
      toast.error('Please wait for uploads to finish')
      return
    }

    const cleanImages = sanitizeImageUrls(editImages)
    const originalImages = sanitizeImageUrls(safePost.image ?? [])
    const contentChanged = trimmed !== (safePost.content ?? '').trim()
    const typeChanged = editType !== safePost.type
    const imagesChanged =
      JSON.stringify(cleanImages) !== JSON.stringify(originalImages)

    if (!contentChanged && !typeChanged && !imagesChanged) {
      toast.info('No changes to save', { duration: 2500 })
      setShowEdit(false)
      setHasUnsavedUploads(false)
      return
    }

    setSaving(true)
    try {
      const updated = await FeedService.updatePost(safePost.id, {
        content: trimmed,
        type: editType,
        image: cleanImages,
      })

      toast.success('Post updated', {
        description: 'Your changes are now live.',
        duration: 3000,
      })

      setShowEdit(false)
      setHasUnsavedUploads(false)
      onUpdated?.(updated)
      onEdited?.(updated)
    } catch (err: any) {
      if (isPostGoneError(err)) {
        setShowEdit(false)
        handlePostGone('edit')
        return
      }
      toast.error('Failed to update post', {
        description: err?.message || 'Please try again in a moment.',
        duration: 5000,
      })
    } finally {
      setSaving(false)
    }
  }

  /* ------------------------------------------------------------------ */
  /*  DELETE                                                             */
  /* ------------------------------------------------------------------ */

  const openDeleteConfirm = () => {
    setShowDeleteConfirm(true)
  }

  // 🔥 Invokes ONLY ONE callback — prefers `onDeleted`, falls back to `onDelete`
  const invokeDeleteCallback = async (id: string) => {
    const cb = onDeleted ?? onDelete
    if (!cb) return
    try {
      await cb(id)
    } catch (err: any) {
      console.error('[PostCard] delete callback failed:', err)
    }
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await FeedService.deletePost(safePost.id)

      toast.success('Post deleted', {
        description: 'Your post has been permanently removed.',
        duration: 4000,
      })

      setShowDeleteConfirm(false)
      await invokeDeleteCallback(safePost.id)
    } catch (err: any) {
      if (isPostGoneError(err)) {
        toast.info('This post was already deleted', {
          description: 'Removing it from your feed…',
          duration: 4000,
        })
        setShowDeleteConfirm(false)
        await invokeDeleteCallback(safePost.id)
        return
      }
      toast.error('Failed to delete post', {
        description: err?.message || 'Please try again in a moment.',
        duration: 5000,
      })
    } finally {
      setDeleting(false)
    }
  }

  /* ------------------------------------------------------------------ */
  /*  SHARE                                                              */
  /* ------------------------------------------------------------------ */

  const postUrl = getPostPublicUrl(safePost)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl)
      setCopied(true)
      toast.success('Link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy link')
    }
  }

  const handleNativeShare = async () => {
    const shareTitle = safeUser?.name
      ? `${safeUser.name} on Chronify`
      : 'Chronify Post'
    const shareText = (safePost.content ?? '').slice(0, 100)

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: postUrl,
        })
        return
      } catch {
        /* cancelled */
      }
    }
    setShowShare(true)
  }

  /* ------------------------------------------------------------------ */
  /*  DERIVED                                                            */
  /* ------------------------------------------------------------------ */

  const topReactions = getTopReactions(
    (safePost.reactions ?? []).reduce<Record<string, number>>((acc, r) => {
      acc[r.reaction] = (acc[r.reaction] || 0) + 1
      return acc
    }, {}),
  )

  const totalReactions = (safePost.reactions ?? []).length
  const totalComments = safePost._count?.comments ?? comments.length ?? 0

  const myReaction =
    (currentUserId
      ? (safePost.reactions ?? []).find((r) => r.userId === currentUserId)
          ?.reaction
      : null) ?? null

  const badge = TYPE_BADGE[safePost.type] ?? null

  const profession = safeProfile?.profession ?? null
  const city = safeProfile?.city ?? null
  const country = safeProfile?.country ?? null
  const location = [city, country].filter(Boolean).join(', ')

  const authorName = safeUser?.name || 'Unknown user'
  const authorAvatar = safeProfile?.avatarUrl ?? null
  const authorHandle = safeProfile?.userName ?? null

  const wasEdited = (() => {
    try {
      const created = new Date(safePost.createdAt).getTime()
      const updated = new Date(safePost.updatedAt).getTime()
      return updated - created > 1000
    } catch {
      return false
    }
  })()

  const cleanEditImages = sanitizeImageUrls(editImages)
  const originalCleanImages = sanitizeImageUrls(safePost.image ?? [])

  const editHasChanges =
    editContent.trim() !== (safePost.content ?? '').trim() ||
    editType !== safePost.type ||
    JSON.stringify(cleanEditImages) !== JSON.stringify(originalCleanImages)

  const canSave =
    editHasChanges && editContent.trim().length > 0 && !uploading && !saving

  /* ------------------------------------------------------------------ */
  /*  RENDER                                                             */
  /* ------------------------------------------------------------------ */

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
      >
        {/* ============ POST GONE BANNER ============ */}
        {isPostGone && (
          <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800/50">
            <div className="p-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 flex-shrink-0">
              <Ghost className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                This post is no longer available
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                It was deleted by the author. Refresh the feed to see the latest
                posts.
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
        )}

        {/* ============ HEADER ============ */}
        <header className="flex items-start gap-3 p-4 pb-3">
          <Link
            href={authorHandle ? `/u/${encodeURIComponent(authorHandle)}` : '#'}
            className="flex-shrink-0"
          >
            <UserAvatar name={authorName} avatarUrl={authorAvatar} size={48} />
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                href={
                  authorHandle ? `/u/${encodeURIComponent(authorHandle)}` : '#'
                }
                className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:underline truncate"
              >
                {authorName}
              </Link>

              {(safeUser as any)?.verified && (
                <CheckCircle2
                  className="w-3.5 h-3.5 text-blue-500 flex-shrink-0"
                  aria-label="Verified"
                />
              )}

              {badge && (
                <Badge
                  className={`text-[10px] px-1.5 py-0 ml-1 ${badge.className}`}
                >
                  {badge.label}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {authorHandle && <span className="truncate">@{authorHandle}</span>}

              {profession && (
                <>
                  <span className="hidden sm:inline">·</span>
                  <span className="flex items-center gap-1 truncate">
                    <Briefcase className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{profession}</span>
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {location && (
                <>
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{location}</span>
                  </span>
                  <span>·</span>
                </>
              )}
              <span>{safeTimeAgo(safePost.createdAt)}</span>
              {wasEdited && (
                <>
                  <span>·</span>
                  <span className="italic text-gray-400 dark:text-gray-500">
                    edited
                  </span>
                </>
              )}
            </div>
          </div>

          {isOwner && !isPostGone && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                  aria-label="Post menu"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="dark:bg-gray-800 dark:border-gray-700"
              >
                <DropdownMenuItem
                  onClick={openEditModal}
                  className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Pencil className="w-4 h-4" />
                  Edit post
                </DropdownMenuItem>

                <DropdownMenuSeparator className="dark:bg-gray-700" />

                <DropdownMenuItem
                  onClick={openDeleteConfirm}
                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </header>

        {/* ============ CONTENT ============ */}
        <div className="px-4 pb-3">
          <PostContent content={safePost.content ?? ''} />

          {safePost.image && safePost.image.length > 0 && (
            <div
              className={`grid gap-2 mt-3 ${
                safePost.image.length === 1
                  ? 'grid-cols-1'
                  : safePost.image.length === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-3'
              }`}
            >
              {safePost.image.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt={`Post image ${i + 1}`}
                  className={`w-full object-cover rounded-lg ${
                    safePost.image!.length === 1 ? 'max-h-96' : 'aspect-square'
                  }`}
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>

        {/* ============ REACTION SUMMARY ============ */}
        {(totalReactions > 0 || totalComments > 0) && (
          <div className="flex items-center justify-between px-4 pb-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              {topReactions.length > 0 && (
                <div className="flex -space-x-1">
                  {topReactions.map((r, i) => (
                    <span
                      key={i}
                      className="w-5 h-5 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full text-sm ring-1 ring-gray-100 dark:ring-gray-700"
                      title={`${r.count} reaction${r.count > 1 ? 's' : ''}`}
                    >
                      {r.emoji}
                    </span>
                  ))}
                </div>
              )}
              {totalReactions > 0 && (
                <span className="font-medium">{totalReactions}</span>
              )}
            </div>

            {totalComments > 0 && !isPostGone && (
              <button
                onClick={toggleComments}
                className="hover:underline"
                type="button"
              >
                {totalComments} comment{totalComments > 1 ? 's' : ''}
              </button>
            )}
          </div>
        )}

        {/* ============ ACTION BAR ============ */}
        <div className="flex items-center gap-1 px-2 py-1 border-t border-gray-100 dark:border-gray-700">
          {isPostGone ? (
            <div className="flex items-center gap-2 w-full px-2 py-1.5 text-xs text-gray-400 dark:text-gray-500">
              <Ghost className="w-4 h-4" />
              <span>Interactions are disabled — this post has been deleted.</span>
            </div>
          ) : (
            <>
              <ReactionPicker
                currentReaction={myReaction}
                onSelect={(r) => handleReaction(r)}
                onRemove={() => handleReaction(null)}
              />

              <button
                type="button"
                onClick={toggleComments}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                Comment
              </button>

              <button
                type="button"
                onClick={handleNativeShare}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </>
          )}
        </div>

        {/* ============ COMMENTS ============ */}
        {showComments && !isPostGone && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/40 dark:bg-gray-900/20">
            {loadingComments ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <CommentSection
                postId={safePost.id}
                comments={comments}
                currentUserId={currentUserId}
                onCommentsChange={setComments}
                onPostGone={() => handlePostGone('comment')}
              />
            )}
          </div>
        )}
      </motion.article>

      {/* ==================== EDIT POST DIALOG ==================== */}
      <Dialog open={showEdit} onOpenChange={handleCloseEdit}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800 w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 dark:text-gray-100">
              <Pencil className="w-5 h-5" /> Edit post
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Update your content, type or images. Changes go live immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">
                Content
              </label>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="What's on your mind?"
                className="resize-none min-h-[120px] text-sm dark:bg-gray-900 dark:border-gray-700"
                rows={5}
                disabled={saving || uploading}
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {editContent.length}/5000 characters
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">
                Post type
              </label>
              <Select
                value={editType}
                onValueChange={(v) => setEditType(v as PostType)}
                disabled={saving || uploading}
              >
                <SelectTrigger className="dark:bg-gray-900 dark:border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="GENERAL">💬 General</SelectItem>
                  <SelectItem value="ACHIEVEMENT">🏆 Achievement</SelectItem>
                  <SelectItem value="JOURNEY">🚀 Journey</SelectItem>
                  <SelectItem value="MILESTONE">🎯 Milestone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">
                Images ({cleanEditImages.length}/{MAX_IMAGES})
              </label>

              {cleanEditImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {cleanEditImages.map((url, i) => (
                    <div
                      key={`${url}-${i}`}
                      className="relative group aspect-square"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Post image ${i + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveEditImage(i)}
                        disabled={saving || uploading}
                        className="absolute top-1 right-1 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition disabled:opacity-40"
                        aria-label={`Remove image ${i + 1}`}
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleFilesSelected}
              />

              <button
                type="button"
                onClick={handlePickFiles}
                disabled={
                  saving || uploading || cleanEditImages.length >= MAX_IMAGES
                }
                className="w-full flex flex-col items-center justify-center gap-2 py-6 px-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                ) : (
                  <UploadCloud className="w-6 h-6 text-gray-400" />
                )}
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {uploading ? 'Uploading…' : 'Click to upload images'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    JPG, PNG, WebP, GIF · max 5 MB each · auto-compressed
                  </p>
                </div>
              </button>

              {uploading && Object.keys(uploadProgress).length > 0 && (
                <div className="mt-3 space-y-2">
                  {Object.entries(uploadProgress).map(([idx, percent]) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Image {Number(idx) + 1}</span>
                        <span>{percent}%</span>
                      </div>
                      <Progress value={percent} className="h-1.5" />
                    </div>
                  ))}
                </div>
              )}

              {cleanEditImages.length >= MAX_IMAGES && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                  Maximum of {MAX_IMAGES} images reached
                </p>
              )}

              {hasUnsavedUploads && !uploading && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3" />
                  Don't forget to save — uploaded images will be lost otherwise
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {uploading ? (
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Uploading images…
                </span>
              ) : saving ? (
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Saving changes…
                </span>
              ) : hasUnsavedUploads ? (
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  ● Unsaved images
                </span>
              ) : editHasChanges ? (
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  ● Unsaved changes
                </span>
              ) : (
                <span className="text-gray-400 dark:text-gray-500">
                  No changes yet
                </span>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => handleCloseEdit(false)}
                disabled={saving || uploading}
                className="w-full sm:w-auto dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={!canSave}
                className="w-full sm:w-auto gap-2 min-w-[140px]"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ==================== DELETE CONFIRM DIALOG ==================== */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-full bg-red-100 dark:bg-red-900/30 flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-base dark:text-gray-100">
                  Delete this post?
                </DialogTitle>
                <DialogDescription className="dark:text-gray-400 mt-1.5">
                  This will permanently delete the post, along with all its
                  reactions and comments. This action{' '}
                  <strong className="text-gray-900 dark:text-gray-200">
                    cannot be undone
                  </strong>
                  .
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {safePost.content && (
            <div className="mt-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {safePost.content.slice(0, 120)}
                {safePost.content.length > 120 ? '…' : ''}
              </p>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleting}
              className="w-full sm:w-auto dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleting}
              className="w-full sm:w-auto gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete post
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ==================== SHARE DIALOG ==================== */}
      <Dialog open={showShare} onOpenChange={setShowShare}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 dark:text-gray-100">
              <Share2 className="w-5 h-5" /> Share this post
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Anyone with this link can view this post.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="flex flex-col gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-700 dark:text-gray-300 truncate flex-1">
                  {postUrl}
                </span>
              </div>
              <Button
                size="sm"
                variant={copied ? 'default' : 'outline'}
                onClick={handleCopyLink}
                className="w-full gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Link Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Link
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="flex-col h-auto py-3 gap-1.5 text-xs"
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent((safePost.content ?? '').slice(0, 100))}`,
                    '_blank',
                  )
                }
              >
                <Twitter className="w-4 h-4" />
                <span>Twitter</span>
              </Button>

              <Button
                variant="outline"
                className="flex-col h-auto py-3 gap-1.5 text-xs"
                onClick={() =>
                  window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
                    '_blank',
                  )
                }
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </Button>

              <Button
                variant="outline"
                className="flex-col h-auto py-3 gap-1.5 text-xs"
                onClick={() =>
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(`Check out this post: ${postUrl}`)}`,
                    '_blank',
                  )
                }
              >
                <Globe className="w-4 h-4" />
                <span>WhatsApp</span>
              </Button>
            </div>
          </div>

          <div className="mt-2">
            <Button
              variant="ghost"
              onClick={() => setShowShare(false)}
              className="w-full gap-1.5"
            >
              <X className="w-4 h-4" /> Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}