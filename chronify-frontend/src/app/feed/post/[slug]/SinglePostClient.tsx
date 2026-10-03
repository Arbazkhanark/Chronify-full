// src/app/feed/post/[slug]/SinglePostClient.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Toaster, toast } from 'sonner'
import {
  ArrowLeft,
  Share2,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Twitter,
  Linkedin,
  Globe,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { FeedService } from '@/services/feed.service'
import type { Post } from '@/types/feed'
import { getPostPublicUrl } from '@/lib/post-url'
import PostCard from '@/components/features/feed/PostCard'

export default function SinglePostClient({ postId }: { postId: string }) {
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)

  const currentUserId = useMemo<string | undefined>(() => {
    if (typeof window === 'undefined') return undefined
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return undefined
      const payload = JSON.parse(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')),
      )
      return payload.userId ?? payload.sub ?? undefined
    } catch {
      return undefined
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const p = await FeedService.getPost(postId)
        if (!cancelled) setPost(p)
      } catch (err: any) {
        if (!cancelled) setError(err?.message || 'Failed to load post')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [postId])

  const publicUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return `${process.env.NEXT_PUBLIC_APP_URL || ''}/posts/${postId}`
    }
    if (!post) {
      return `${window.location.origin}/posts/${postId}`
    }
    return getPostPublicUrl(post)
  }, [post, postId])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      toast.success('Link copied')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy')
    }
  }

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: post ? `${post.user.name} on Chronify` : 'Chronify Post',
          text: post?.content?.slice(0, 120) ?? 'Check out this post',
          url: publicUrl,
        })
        return
      } catch {
        /* cancelled */
      }
    }
    setShowShare(true)
  }

  /* ============================ LOADING ============================ */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    )
  }

  /* ============================ ERROR ============================ */
  if (error || !post) {
    return (
      <>
        <Toaster position="top-right" richColors closeButton />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <Card className="max-w-md w-full dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Post not found
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {error || 'This post may have been deleted.'}
              </p>
              <Button onClick={() => router.push('/feed')}>Go to Feed</Button>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  /* ============================ MAIN ============================ */
  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/feed"
              className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <ArrowLeft className="w-4 h-4" /> Back to feed
            </Link>

            <button
              onClick={handleNativeShare}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Share post"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <PostCard
            post={post}
            currentUserId={currentUserId}
            onUpdated={(updated) => setPost(updated)}
            onDeleted={() => {
              toast.success('Post deleted')
              router.push('/feed')
            }}
          />
        </div>
      </div>

      {/* Share dialog */}
      <Dialog open={showShare} onOpenChange={setShowShare}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 dark:text-gray-100">
              <Share2 className="w-5 h-5" /> Share this post
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Anyone with this link can view this post.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
              <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-700 dark:text-gray-300 truncate flex-1">
                {publicUrl}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="flex-shrink-0 gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(post.content.slice(0, 100))}`,
                    '_blank',
                  )
                }
              >
                <Twitter className="w-4 h-4" /> Twitter
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() =>
                  window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`,
                    '_blank',
                  )
                }
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() =>
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(`Check out this post: ${publicUrl}`)}`,
                    '_blank',
                  )
                }
              >
                <Globe className="w-4 h-4" /> WhatsApp
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}