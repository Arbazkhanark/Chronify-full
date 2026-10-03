// src/components/features/feed/CreatePost.tsx
'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  Loader2,
  Send,
  ImageIcon,
  X,
  UploadCloud,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import UserAvatar from '@/components/shared/UserAvatar'

import {
  uploadToCloudinary,
  validateImageFile,
  compressImage,
  type UploadProgress,
} from '@/lib/cloudinary'

import type { PostType, Post } from '@/types/feed'

/* ============================================================================
   TYPES
   ---------------------------------------------------------------------------
   🔥 FLEXIBLE USER SHAPE:
      - name: string | undefined    (optional — matches useAuth output)
      - avatarUrl: string | null | undefined
      - email or userName may also exist — accepted but unused
   ============================================================================ */

export interface CreatePostUser {
  id: string
  name?: string | null
  avatarUrl?: string | null
  /** optional extras — ignored but accepted so any User shape fits */
  email?: string | null
  userName?: string | null
}

interface CreatePostProps {
  /** 🔥 Accepts ANY user shape with at least an `id` */
  user: CreatePostUser | null | undefined
  onSubmit: (payload: {
    content: string
    type: PostType
    image: string[]
  }) => Promise<Post | void>
}

const MAX_IMAGES = 10

const TYPE_OPTIONS: { value: PostType; label: string }[] = [
  { value: 'GENERAL', label: '💬 General' },
  { value: 'ACHIEVEMENT', label: '🏆 Achievement' },
  { value: 'JOURNEY', label: '🚀 Journey' },
  { value: 'MILESTONE', label: '🎯 Milestone' },
]

/* ============================================================================
   COMPONENT
   ============================================================================ */

export function CreatePost({ user, onSubmit }: CreatePostProps) {
  const [content, setContent] = useState('')
  const [type, setType] = useState<PostType>('GENERAL')
  const [images, setImages] = useState<string[]>([])
  const [expanded, setExpanded] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progressMap, setProgressMap] = useState<Record<number, number>>({})

  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ---------------------------------------------------------------- */
  /*  FILE UPLOAD                                                     */
  /* ---------------------------------------------------------------- */

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''

    if (files.length === 0) return

    const remaining = MAX_IMAGES - images.length
    if (remaining <= 0) {
      toast.error(`Max ${MAX_IMAGES} images per post`)
      return
    }

    const toUpload = files.slice(0, remaining)

    if (files.length > remaining) {
      toast.info(`Only ${remaining} more image${remaining > 1 ? 's' : ''} allowed`)
    }

    for (const file of toUpload) {
      const err = validateImageFile(file)
      if (err) {
        toast.error(err)
        return
      }
    }

    setUploading(true)
    setProgressMap({})

    const uploadedUrls: string[] = []
    let failed = 0

    for (let i = 0; i < toUpload.length; i++) {
      const file = toUpload[i]
      try {
        const compressed = await compressImage(file)

        const result = await uploadToCloudinary(compressed, {
          onProgress: (p: UploadProgress) => {
            setProgressMap((prev) => ({ ...prev, [i]: p.percent }))
          },
        })

        uploadedUrls.push(result.secureUrl ?? result.secure_url)
      } catch (err: any) {
        failed++
        console.error('[Cloudinary]', err)
        toast.error(
          `Failed to upload "${file.name}": ${err?.message || 'Unknown error'}`,
        )
      }
    }

    if (uploadedUrls.length > 0) {
      setImages((prev) => [...prev, ...uploadedUrls])
      toast.success(
        `${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''} uploaded`,
      )
    }

    if (failed > 0) {
      toast.warning(`${failed} image${failed > 1 ? 's' : ''} failed`)
    }

    setUploading(false)
    setProgressMap({})
  }

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  /* ---------------------------------------------------------------- */
  /*  SUBMIT                                                          */
  /* ---------------------------------------------------------------- */

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Write something first')
      return
    }

    if (uploading) {
      toast.error('Please wait for uploads to finish')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({
        content: content.trim(),
        type,
        image: images,
      })

      toast.success('Post published', {
        description: 'Your post is now live.',
        duration: 3000,
      })

      setContent('')
      setImages([])
      setType('GENERAL')
      setExpanded(false)
      setProgressMap({})
    } catch (err: any) {
      toast.error('Failed to publish post', {
        description: err?.message || 'Please try again in a moment.',
        duration: 5000,
      })
    } finally {
      setSubmitting(false)
    }
  }

  /* ---------------------------------------------------------------- */
  /*  RENDER                                                          */
  /* ---------------------------------------------------------------- */

  // 🔥 User must exist (just for the avatar). If not, hide the composer.
  if (!user) return null

  // 🔥 Safe display name — fallback for missing `name`
  const displayName =
    (user.name && user.name.trim()) ||
    (user.userName && user.userName.trim()) ||
    'there'

  const firstName = displayName.split(' ')[0]

  const canSubmit = content.trim().length > 0 && !uploading && !submitting

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <UserAvatar
            name={displayName}
            avatarUrl={user.avatarUrl ?? null}
            size={44}
          />

          <div className="flex-1 min-w-0">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setExpanded(true)}
              placeholder={`What's on your mind, ${firstName}?`}
              className="resize-none border-0 focus-visible:ring-0 text-base min-h-[44px] dark:bg-gray-800"
              rows={expanded ? 4 : 1}
              disabled={submitting || uploading}
            />

            {/* Image previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {images.map((url, i) => (
                  <div
                    key={`${url}-${i}`}
                    className="relative group aspect-square"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Upload ${i + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      disabled={submitting || uploading}
                      className="absolute top-1 right-1 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition"
                      aria-label={`Remove image ${i + 1}`}
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload progress */}
            {uploading && Object.keys(progressMap).length > 0 && (
              <div className="mt-3 space-y-2">
                {Object.entries(progressMap).map(([idx, percent]) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Uploading image {Number(idx) + 1}</span>
                      <span>{percent}%</span>
                    </div>
                    <Progress value={percent} className="h-1.5" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFiles}
            />

            <button
              type="button"
              onClick={openFilePicker}
              disabled={
                submitting || uploading || images.length >= MAX_IMAGES
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
              title="Add images"
            >
              {uploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ImageIcon className="w-3.5 h-3.5" />
              )}
              <span>{uploading ? 'Uploading…' : 'Image'}</span>
              {images.length > 0 && (
                <span className="text-[10px] text-gray-400">
                  {images.length}/{MAX_IMAGES}
                </span>
              )}
            </button>

            <Select
              value={type}
              onValueChange={(v) => setType(v as PostType)}
              disabled={submitting || uploading}
            >
              <SelectTrigger className="h-8 w-[140px] text-xs dark:bg-gray-800 dark:border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            {expanded && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setExpanded(false)
                  setContent('')
                  setImages([])
                  setType('GENERAL')
                }}
                disabled={submitting || uploading}
              >
                Cancel
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="gap-1.5 min-w-[100px]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Posting…
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CreatePost