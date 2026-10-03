'use client'

import { useState } from 'react'
import { Share2, Copy, Check, Twitter, Linkedin, Globe } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function ShareButton({
  postId,
  className = '',
}: {
  postId: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const url =
    typeof window !== 'undefined'
      ? `${window.location.origin}/post/${postId}`
      : `${process.env.NEXT_PUBLIC_APP_URL || ''}/post/${postId}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copied')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy')
    }
  }

  const handleClick = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'Chronify Post', url })
        return
      } catch {
        /* cancelled */
      }
    }
    setOpen(true)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-1.5 ${className}`}
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
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
                {url}
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
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
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
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
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
                    `https://wa.me/?text=${encodeURIComponent(url)}`,
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