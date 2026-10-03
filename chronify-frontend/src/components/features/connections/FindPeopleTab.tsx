'use client'

import { useEffect, useState } from 'react'
import { Search, Loader2, UserX } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ConnectionCard from './ConnectionCard'
import { ConnectionService } from '@/lib/connection-service'
import type { ConnectionUser } from '@/types/connection-types'

export default function FindPeopleTab({
  onSent,
}: {
  onSent?: (user: ConnectionUser) => void
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ConnectionUser[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim()

    if (!trimmed) {
      setResults([])
      setSearched(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    const handle = setTimeout(async () => {
      try {
        const found = await ConnectionService.search(trimmed)
        setResults(found)
        setSearched(true)
      } catch (err: any) {
        setError(err?.message || 'Search failed')
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 350)

    return () => clearTimeout(handle)
  }, [query])

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by name, username, or profession…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 h-11"
          autoFocus
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
        )}
      </div>

      {/* Hint */}
      {!query.trim() && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
          Start typing to find people on Chronify
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {searched && !loading && results.length === 0 && !error && (
        <div className="text-center py-16 px-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <UserX className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
            No users found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Try a different search term.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((user) => (
            <ConnectionCard
              key={user.id}
              user={user}
              mode="search"
              onSent={onSent}
            />
          ))}
        </div>
      )}
    </div>
  )
}