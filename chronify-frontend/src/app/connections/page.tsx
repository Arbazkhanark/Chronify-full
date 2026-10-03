// // src/app/connections/page.tsx
// 'use client'

// import { useState } from 'react'
// import { Search, Loader2, Users } from 'lucide-react'
// import { Input } from '@/components/ui/input'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Badge } from '@/components/ui/badge'
// import { useAuth } from '@/hooks/useAuth'
// import { useConnections } from '@/hooks/useConnections'
// import type { ConnectionUser } from '@/types/feed'
// import { UserCard } from '@/components/features/feed/UserCard'

// export default function ConnectionsPage() {
//   const { user } = useAuth()
//   const {
//     friends,
//     sentRequests,
//     receivedRequests,
//     loading,
//     sendRequest,
//     respondToRequest,
//     searchUsers,
//   } = useConnections()

//   const [query, setQuery] = useState('')
//   const [results, setResults] = useState<ConnectionUser[]>([])
//   const [searching, setSearching] = useState(false)
//   const [busyId, setBusyId] = useState<string | null>(null)

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!query.trim()) {
//       setResults([])
//       return
//     }
//     setSearching(true)
//     const data = await searchUsers(query.trim())
//     setResults(data)
//     setSearching(false)
//   }

//   const handleAdd = async (id: string) => {
//     setBusyId(id)
//     try {
//       await sendRequest(id)
//       setResults((prev) => prev.filter((u) => u.id !== id))
//     } finally {
//       setBusyId(null)
//     }
//   }

//   const handleAccept = async (requestId: string) => {
//     setBusyId(requestId)
//     try {
//       await respondToRequest(requestId, 'ACCEPT')
//     } finally {
//       setBusyId(null)
//     }
//   }

//   const handleReject = async (requestId: string) => {
//     setBusyId(requestId)
//     try {
//       await respondToRequest(requestId, 'REJECT')
//     } finally {
//       setBusyId(null)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
//         {/* Header */}
//         <div>
//           <h1 className="text-2xl font-bold">Connections</h1>
//           <p className="text-sm text-muted-foreground">
//             Connect, search, and grow your network
//           </p>
//         </div>

//         {/* Search */}
//         <form onSubmit={handleSearch} className="flex gap-2">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//             <Input
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Search users by name or username..."
//               className="pl-9"
//             />
//           </div>
//           <button
//             type="submit"
//             className="px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
//           >
//             {searching ? (
//               <Loader2 className="w-4 h-4 animate-spin" />
//             ) : (
//               'Search'
//             )}
//           </button>
//         </form>

//         {/* Search results */}
//         {results.length > 0 && (
//           <div>
//             <h2 className="text-sm font-semibold mb-3">
//               Search results
//             </h2>
//             <div className="space-y-2">
//               {results.map((u) => (
//                 <UserCard
//                   key={u.id}
//                   user={u}
//                   action="add"
//                   onAdd={() => void handleAdd(u.id)}
//                   busy={busyId === u.id}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Tabs */}
//         <Tabs defaultValue="friends" className="w-full">
//           <TabsList className="grid grid-cols-3 w-full">
//             <TabsTrigger value="friends">
//               Friends
//               {friends.length > 0 && (
//                 <Badge variant="secondary" className="ml-2">
//                   {friends.length}
//                 </Badge>
//               )}
//             </TabsTrigger>
//             <TabsTrigger value="received">
//               Requests
//               {receivedRequests.length > 0 && (
//                 <Badge variant="default" className="ml-2">
//                   {receivedRequests.length}
//                 </Badge>
//               )}
//             </TabsTrigger>
//             <TabsTrigger value="sent">
//               Sent
//               {sentRequests.length > 0 && (
//                 <Badge variant="secondary" className="ml-2">
//                   {sentRequests.length}
//                 </Badge>
//               )}
//             </TabsTrigger>
//           </TabsList>

//           {/* Friends */}
//           <TabsContent value="friends" className="space-y-2 mt-4">
//             {loading ? (
//               <Loader2 className="w-5 h-5 animate-spin mx-auto mt-6 text-muted-foreground" />
//             ) : friends.length === 0 ? (
//               <EmptyState
//                 icon={<Users className="w-8 h-8" />}
//                 message="No friends yet. Search for people to connect!"
//               />
//             ) : (
//               friends.map((f) => (
//                 <UserCard key={f.id} user={f.friend} action="none" />
//               ))
//             )}
//           </TabsContent>

//           {/* Received */}
//           <TabsContent value="received" className="space-y-2 mt-4">
//             {receivedRequests.length === 0 ? (
//               <EmptyState
//                 icon={<Users className="w-8 h-8" />}
//                 message="No pending requests"
//               />
//             ) : (
//               receivedRequests.map((r) => (
//                 <UserCard
//                   key={r.id}
//                   user={r.sender!}
//                   action="accept-reject"
//                   onAccept={() => void handleAccept(r.id)}
//                   onReject={() => void handleReject(r.id)}
//                   busy={busyId === r.id}
//                 />
//               ))
//             )}
//           </TabsContent>

//           {/* Sent */}
//           <TabsContent value="sent" className="space-y-2 mt-4">
//             {sentRequests.length === 0 ? (
//               <EmptyState
//                 icon={<Users className="w-8 h-8" />}
//                 message="No sent requests"
//               />
//             ) : (
//               sentRequests.map((r) => (
//                 <UserCard
//                   key={r.id}
//                   user={r.receiver!}
//                   action="none"
//                 />
//               ))
//             )}
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }

// function EmptyState({
//   icon,
//   message,
// }: {
//   icon: React.ReactNode
//   message: string
// }) {
//   return (
//     <div className="text-center py-12 text-muted-foreground">
//       <div className="flex justify-center mb-3 opacity-40">{icon}</div>
//       <p className="text-sm">{message}</p>
//     </div>
//   )
// }















// src/app/dashboard/connections/page.tsx
'use client'

import { useState } from 'react'
import { Toaster } from 'sonner'
import { Users, Inbox, Send, Search, Loader2, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'

import { useConnections } from '@/hooks/useConnections'
import RequestsTab from '@/components/features/connections/RequestsTab'
import SentTab from '@/components/features/connections/SentTab'
import FriendsTab from '@/components/features/connections/FriendsTab'
import FindPeopleTab from '@/components/features/connections/FindPeopleTab'

export default function ConnectionsPage() {
  const {
    friends,
    received,
    sent,
    loading,
    error,
    refresh,
    acceptRequest,
    rejectRequest,
  } = useConnections()

  const [activeTab, setActiveTab] = useState('received')

  const pendingReceived = received.filter((r) => r.status === 'PENDING').length
  const pendingSent = sent.filter((r) => r.status === 'PENDING').length

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Connections
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Grow your network on Chronify
              </p>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={refresh}
              disabled={loading}
              title="Refresh"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              />
            </Button>
          </div>

          {/* Error banner */}
          {error && (
            <Card className="mb-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <p className="text-sm text-red-700 dark:text-red-400">
                  {error}
                </p>
                <Button size="sm" variant="outline" onClick={refresh}>
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full flex flex-wrap h-auto mb-4 dark:bg-gray-800 dark:border-gray-700">
              <TabsTrigger value="received" className="flex-1 gap-2">
                <Inbox className="w-4 h-4" />
                Requests
                {pendingReceived > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-1 h-5 px-1.5 text-[10px]"
                  >
                    {pendingReceived}
                  </Badge>
                )}
              </TabsTrigger>

              <TabsTrigger value="sent" className="flex-1 gap-2">
                <Send className="w-4 h-4" />
                Sent
                {pendingSent > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                    {pendingSent}
                  </Badge>
                )}
              </TabsTrigger>

              <TabsTrigger value="friends" className="flex-1 gap-2">
                <Users className="w-4 h-4" />
                Friends
                {friends.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                    {friends.length}
                  </Badge>
                )}
              </TabsTrigger>

              <TabsTrigger value="find" className="flex-1 gap-2">
                <Search className="w-4 h-4" />
                Find People
              </TabsTrigger>
            </TabsList>

            {loading ? (
              <div className="py-20 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loading connections…
                  </p>
                </div>
              </div>
            ) : (
              <>
                <TabsContent value="received" className="mt-0">
                  <RequestsTab
                    requests={received}
                    onAccept={acceptRequest}
                    onReject={rejectRequest}
                  />
                </TabsContent>

                <TabsContent value="sent" className="mt-0">
                  <SentTab requests={sent} />
                </TabsContent>

                <TabsContent value="friends" className="mt-0">
                  <FriendsTab friends={friends} />
                </TabsContent>

                <TabsContent value="find" className="mt-0">
                  <FindPeopleTab onSent={refresh} />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </>
  )
}