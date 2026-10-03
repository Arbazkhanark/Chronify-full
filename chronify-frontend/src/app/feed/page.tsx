// src/app/feed/page.tsx
'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { usePosts } from '@/hooks/usePosts'
import { CreatePost } from '@/components/features/feed/CreatePost'
import PostCard from '@/components/features/feed/PostCard'

export default function FeedPage() {
  const { user } = useAuth()
  const {
    posts,
    loading,
    loadingMore,
    hasNext,
    loadMore,
    createPost,
    updatePost,
    deletePost,
  } = usePosts({ limit: 10 })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Feed</h1>
          <p className="text-sm text-muted-foreground">
            See what your connections are up to
          </p>
        </div>

        {/* Create post — 🔥 pass createPost DIRECTLY */}
        <CreatePost user={user} onSubmit={createPost} />

        {/* Posts list */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No posts yet. Be the first to share!
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user?.id}
                onDelete={deletePost}
                onUpdated={updatePost}
              />
            ))}
          </div>
        )}

        {/* Load more */}
        {hasNext && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => void loadMore()}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load more'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}