// src/components/features/feed/FeedRightSidebar.tsx
'use client'

import Link from 'next/link'
import { TrendingUp, UserPlus, Hash, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function FeedRightSidebar() {
  return (
    <>
      {/* ============ TRENDING / SUGGESTIONS CARD ============ */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            For you
          </h3>
        </div>

        <ul className="space-y-2 text-sm">
          <li>
            <Link
              href="/explore"
              className="flex items-start gap-2 p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
            >
              <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  Trending topics
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  See what's popular today
                </p>
              </div>
            </Link>
          </li>

          <li>
            <Link
              href="/goals"
              className="flex items-start gap-2 p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
            >
              <Hash className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  Goal challenges
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Join a challenge, build a streak
                </p>
              </div>
            </Link>
          </li>
        </ul>
      </div>

      {/* ============ PEOPLE TO FOLLOW ============ */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <UserPlus className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            People to follow
          </h3>
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  Suggested user {i}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  @user{i}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs flex-shrink-0"
              >
                Follow
              </Button>
            </div>
          ))}
        </div>

        <Link
          href="/explore"
          className="block mt-3 text-xs text-primary hover:underline"
        >
          Show more
        </Link>
      </div>

      {/* ============ FOOTER LINKS ============ */}
      <div className="px-2 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-x-2 gap-y-1">
        <Link href="/about" className="hover:underline">About</Link>
        <Link href="/privacy" className="hover:underline">Privacy</Link>
        <Link href="/terms" className="hover:underline">Terms</Link>
        <Link href="/contact" className="hover:underline">Contact</Link>
      </div>
    </>
  )
}