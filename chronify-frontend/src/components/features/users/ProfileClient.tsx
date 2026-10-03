// app/profile/ProfileClient.tsx
'use client'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import Link from 'next/link'
import { Toaster, toast } from 'sonner'
import {
  ArrowLeft,
  Calendar,
  Target,
  TrendingUp,
  Trophy,
  Edit,
  CheckCircle2,
  Users,
  BarChart3,
  Moon,
  Sun,
  Sparkles,
  Settings,
  LogOut,
  Share2,
  Download,
  Mail,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Loader2,
  Sunrise,
  Briefcase,
  Flame,
  Brain,
  Rocket,
  Medal,
  CalendarDays,
  Star,
  ThumbsUp,
  Plus,
  X,
  Link as LinkIcon,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  UserCircle2,
  Upload,
  Image as ImageIcon,
  Trash2,
  ZoomIn,
  GraduationCap,
  Building2,
  Award,
  MapPinned,
  Copy,
  Check,
  MessageCircle,
  Eye,
  EyeOff,
  Lock,
  Crown,
  Clock,
  Filter,
  ChevronRight,
  Search,
  UserPlus,
  UserCheck,
  UserX,
  Send,
  MoreHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  FullProfileApiError,
  getFullProfile,
  getFullProfileWithCache,
  createOrUpdateProfile,
  buildDefaultProfilePayload,
  mapApiToUi,
  ProfileVisibility,
  SocialPlatform,
  type ApiFullProfile,
  type UiProfileData,
  type UiEducationEntry,
  type UiExperienceEntry,
  type EmploymentType,
  type LocationType,
  type EducationPayload,
  type ExperiencePayload,
} from '@/lib/full-profile'
import {
  readProfileCache,
  writeProfileCache,
  clearProfileCache,
} from '@/lib/profile-cache'
import { AuthService } from '@/hooks/useAuth'
import { useVerification } from '@/hooks/useVerification'
import {
  compressImage,
  uploadToCloudinary,
  validateImageFile,
} from '@/lib/cloudinary'

/* ============================================================================
   TYPES
   ============================================================================ */

interface SocialLinkData {
  id: string
  platform: SocialPlatform
  url: string
}

type ProfileData = UiProfileData

interface ProfileFormData {
  name: string
  userName: string
  bio: string
  profession: string
  dob: string
  city: string
  state: string
  country: string
  hobbies: string
  fields: string
  subFields: string
  avatarUrl: string
  coverPhoto: string
  profileVisibility: ProfileVisibility
}

interface PendingUpload {
  file: File
  previewUrl: string
}

type EducationEntry = UiEducationEntry
type ExperienceEntry = UiExperienceEntry

interface SubjectStreak {
  subject: string
  currentStreak: number
  bestStreak: number
  hoursLogged: number
  color: string
}

type PostType = 'ACHIEVEMENT' | 'JOURNEY' | 'MILESTONE' | 'GENERAL'

interface PostImage {
  id: string
  url: string
  publicId?: string
}

interface ProfilePost {
  id: string
  type: PostType
  content: string
  createdAt: string
  reactionsCount: number
  commentsCount: number
  images: PostImage[]
}

type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'
type AchievementCategory = 'streak' | 'dsa' | 'productivity' | 'early' | 'project'

interface Achievement {
  id: number
  title: string
  description: string
  icon: any
  unlocked: boolean
  progress?: number
  category: AchievementCategory
  rarity: AchievementRarity
}

/* 🔥 Profile Viewer types */
interface ProfileViewer {
  id: string
  name: string
  userName: string
  headline: string
  company?: string
  location?: string
  avatarUrl?: string
  viewedAt: string // ISO string
  viewCount: number
  isConnection: boolean
  isVerified: boolean
}

type ViewerFilter = 'ALL' | 'TODAY' | 'WEEK' | 'MONTH'

/* 🔥 NEW: Connection types */
type ConnectionStatus = 'CONNECTED' | 'PENDING_INCOMING' | 'PENDING_OUTGOING'

interface ConnectionUser {
  id: string
  name: string
  userName: string
  headline: string
  company?: string
  location?: string
  avatarUrl?: string
  isVerified: boolean
  mutualConnections: number
  connectedAt: string // ISO — for CONNECTED
  requestedAt: string // ISO — for PENDING_*
  status: ConnectionStatus
  message?: string // Optional note with request
}

type ConnectionsTab = 'CONNECTED' | 'REQUESTS' | 'SENT'

/* ============================================================================
   CONSTANTS
   ============================================================================ */

const SUBJECT_STREAKS: SubjectStreak[] = [
  { subject: 'DSA', currentStreak: 21, bestStreak: 34, hoursLogged: 74, color: '#3B82F6' },
  { subject: 'System Design', currentStreak: 9, bestStreak: 15, hoursLogged: 22, color: '#8B5CF6' },
  { subject: 'Full-Stack Dev', currentStreak: 14, bestStreak: 28, hoursLogged: 56, color: '#10B981' },
  { subject: 'Fitness', currentStreak: 6, bestStreak: 19, hoursLogged: 12, color: '#EC4899' },
]

const INITIAL_POSTS: ProfilePost[] = [
  { id: 'p1', type: 'ACHIEVEMENT', content: 'Just crossed 150 DSA problems solved! Graphs and DP are finally clicking.', createdAt: '2026-09-20T10:00:00Z', reactionsCount: 34, commentsCount: 6, images: [] },
  { id: 'p2', type: 'MILESTONE', content: 'Shipped the authentication flow for my side project MVP, end to end.', createdAt: '2026-09-17T18:30:00Z', reactionsCount: 21, commentsCount: 3, images: [] },
  { id: 'p3', type: 'JOURNEY', content: 'Day 21 of my consistency streak. Some days are harder than others, but showing up matters more than motivation.', createdAt: '2026-09-14T08:15:00Z', reactionsCount: 52, commentsCount: 11, images: [] },
  { id: 'p4', type: 'GENERAL', content: 'Anyone else prepping for placements this semester? Looking for an accountability partner for daily DSA practice.', createdAt: '2026-09-10T20:00:00Z', reactionsCount: 15, commentsCount: 8, images: [] },
]

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 1, title: '7-Day Streak', description: '7 consecutive days of following your schedule', icon: Flame, unlocked: true, category: 'streak', rarity: 'common' },
  { id: 2, title: 'DSA Master', description: 'Completed 100 DSA problems', icon: Brain, unlocked: true, category: 'dsa', rarity: 'rare' },
  { id: 3, title: 'Early Bird', description: 'Started study sessions before 7 AM for 10 days', icon: Sunrise, unlocked: false, progress: 7, category: 'early', rarity: 'epic' },
  { id: 4, title: 'Weekend Warrior', description: 'Maintained schedule on weekends for 4 weeks', icon: CalendarDays, unlocked: true, category: 'streak', rarity: 'rare' },
  { id: 5, title: 'Consistency King', description: '30-day perfect consistency streak', icon: TrendingUp, unlocked: false, progress: 21, category: 'streak', rarity: 'legendary' },
  { id: 6, title: 'Productivity Pro', description: 'Maintained 90%+ productivity for 2 weeks', icon: Star, unlocked: false, progress: 12, category: 'productivity', rarity: 'epic' },
  { id: 7, title: 'Project Pioneer', description: 'Completed your first major project', icon: Rocket, unlocked: true, category: 'project', rarity: 'rare' },
  { id: 8, title: 'Century Club', description: 'Logged 100+ hours of study', icon: Medal, unlocked: true, category: 'productivity', rarity: 'epic' },
]

const CONNECTION_PREVIEWS = ['Riya Sharma', 'Karan Mehta', 'Ananya Gupta', 'Dev Patel']
const CONSISTENCY_SCORE = 87

/* 🔥 Profile views constants */
const TOTAL_PROFILE_VIEWS = 1284
const WEEKLY_PROFILE_VIEWS = 96
const VIEWS_GROWTH_PERCENT = 23
const FREE_VIEWER_LIMIT = 5

const VIEWER_NAMES = [
  'Aarav Kapoor', 'Ishita Nair', 'Rohan Deshmukh', 'Sanya Verma', 'Vikram Reddy',
  'Priya Iyer', 'Arjun Singh', 'Meera Joshi', 'Kabir Khanna', 'Tara Bhatt',
  'Aditya Rao', 'Nisha Pillai', 'Siddharth Menon', 'Ananya Bose', 'Rahul Tiwari',
  'Diya Chatterjee', 'Karan Malhotra', 'Pooja Shetty', 'Varun Gupta', 'Neha Saxena',
]

const VIEWER_HEADLINES = [
  'Full-Stack Developer @ Razorpay',
  'SDE Intern @ Google',
  'Frontend Engineer @ Flipkart',
  'MCA Student @ Amity University',
  'Product Engineer @ Zoho',
  'Data Analyst @ Swiggy',
  'Backend Developer @ CRED',
  'UI/UX Designer @ Freshworks',
  'DevOps Engineer @ Atlassian',
  'Final Year CSE @ IIT Delhi',
  'Software Engineer @ Microsoft',
  'Growth Engineer @ Notion',
  'React Developer @ Paytm',
  'ML Engineer @ Fractal',
  'SDE-1 @ Amazon',
  'Engineering Student @ BITS',
  'Freelance Developer',
  'Tech Lead @ Postman',
  'Founder @ Stealth Startup',
  'Campus Ambassador @ GitHub',
]

const VIEWER_COMPANIES = [
  'Razorpay', 'Google', 'Flipkart', 'Amity University', 'Zoho',
  'Swiggy', 'CRED', 'Freshworks', 'Atlassian', 'IIT Delhi',
  'Microsoft', 'Notion', 'Paytm', 'Fractal', 'Amazon',
  'BITS Pilani', 'Freelance', 'Postman', 'Stealth', 'GitHub',
]

const VIEWER_LOCATIONS = [
  'Bengaluru, India', 'Hyderabad, India', 'Mumbai, India', 'Delhi, India',
  'Pune, India', 'Chennai, India', 'Gurgaon, India', 'Noida, India',
  'Kolkata, India', 'Remote', 'Singapore', 'San Francisco, USA',
]

/* 🔥 NEW: Connection mock data pools */
const CONNECTION_NAMES = [
  // Connected (accepted)
  'Riya Sharma', 'Karan Mehta', 'Ananya Gupta', 'Dev Patel', 'Sneha Kulkarni',
  'Rohit Bansal', 'Aisha Khan', 'Manish Chauhan', 'Divya Menon', 'Nikhil Jain',
  'Shreya Reddy', 'Aman Verma', 'Pallavi Nair', 'Yash Thakur', 'Ritika Bose',
  'Harsh Vardhan', 'Tanvi Desai', 'Kunal Shah', 'Ira Malhotra', 'Samar Ali',
  'Naina Kapoor', 'Rajat Khanna', 'Prerna Joshi', 'Vivek Rana', 'Aditi Saxena',
  'Saurabh Pillai', 'Kirti Rao', 'Dhruv Bhatt', 'Megha Iyer', 'Arnav Sinha',
  // Incoming requests
  'Farhan Sheikh', 'Ishani Roy', 'Kartik Nambiar', 'Lavanya Krishnan', 'Mohit Arora',
  // Outgoing requests (pending)
  'Nandini Chawla', 'Ojas Trivedi', 'Priti Ganguly', 'Rehan Qureshi', 'Sonal Bhatia',
]

const CONNECTION_HEADLINES = [
  'Full-Stack Developer @ Razorpay',
  'SDE Intern @ Google',
  'Frontend Engineer @ Flipkart',
  'MCA Student @ Amity University',
  'Product Engineer @ Zoho',
  'Data Analyst @ Swiggy',
  'Backend Developer @ CRED',
  'UI/UX Designer @ Freshworks',
  'DevOps Engineer @ Atlassian',
  'Final Year CSE @ IIT Delhi',
  'Software Engineer @ Microsoft',
  'Growth Engineer @ Notion',
  'React Developer @ Paytm',
  'ML Engineer @ Fractal',
  'SDE-1 @ Amazon',
  'Engineering Student @ BITS',
  'Freelance Developer',
  'Tech Lead @ Postman',
  'Founder @ Stealth Startup',
  'Campus Ambassador @ GitHub',
]

const CONNECTION_COMPANIES = [
  'Razorpay', 'Google', 'Flipkart', 'Amity University', 'Zoho',
  'Swiggy', 'CRED', 'Freshworks', 'Atlassian', 'IIT Delhi',
  'Microsoft', 'Notion', 'Paytm', 'Fractal', 'Amazon',
  'BITS Pilani', 'Freelance', 'Postman', 'Stealth', 'GitHub',
]

const CONNECTION_LOCATIONS = [
  'Bengaluru, India', 'Hyderabad, India', 'Mumbai, India', 'Delhi, India',
  'Pune, India', 'Chennai, India', 'Gurgaon, India', 'Noida, India',
  'Kolkata, India', 'Remote', 'Singapore', 'San Francisco, USA',
]

const REQUEST_MESSAGES = [
  'Hi! Would love to connect and learn from your journey.',
  'Saw your DSA progress — inspiring! Let\'s connect.',
  'We\'re in the same field. Would be great to stay in touch.',
  'Hey! Loved your recent post. Let\'s connect.',
  'Fellow developer here — would love to connect!',
]

/* ============================================================================
   STYLE / ICON MAPS
   ============================================================================ */

const HEATMAP_COLORS = [
  'bg-gray-100 dark:bg-gray-800',
  'bg-blue-200 dark:bg-blue-900/40',
  'bg-blue-400 dark:bg-blue-700/60',
  'bg-blue-600 dark:bg-blue-600',
  'bg-blue-800 dark:bg-blue-500',
]

const POST_TYPE_META: Record<PostType, { label: string; badge: string; icon: any }> = {
  ACHIEVEMENT: { label: 'Achievement', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Trophy },
  MILESTONE: { label: 'Milestone', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Target },
  JOURNEY: { label: 'Journey', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: Flame },
  GENERAL: { label: 'Update', badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400', icon: Sparkles },
}

const SOCIAL_PLATFORM_META: Record<SocialPlatform, { label: string; icon: any }> = {
  GITHUB: { label: 'GitHub', icon: Github },
  LINKEDIN: { label: 'LinkedIn', icon: Linkedin },
  TWITTER: { label: 'Twitter', icon: Twitter },
  FACEBOOK: { label: 'Facebook', icon: Globe },
  INSTAGRAM: { label: 'Instagram', icon: Globe },
  YOUTUBE: { label: 'YouTube', icon: Globe },
  TIKTOK: { label: 'TikTok', icon: Globe },
  OTHER: { label: 'Website', icon: Globe },
}

const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  SELF_EMPLOYED: 'Self-employed',
  FREELANCE: 'Freelance',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  APPRENTICESHIP: 'Apprenticeship',
  SEASONAL: 'Seasonal',
}

const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  ON_SITE: 'On-site',
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
}

const getRarityColor = (rarity: AchievementRarity): string => {
  switch (rarity) {
    case 'common': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'
    case 'rare': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
    case 'epic': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800'
    case 'legendary': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800'
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
  }
}

/* ============================================================================
   HELPERS
   ============================================================================ */

const getInitials = (name: string): string => {
  if (!name || !name.trim()) return 'U'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '—'
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const timeAgo = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays > 0) return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`
  if (diffHours > 0) return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
  if (diffMins > 0) return diffMins === 1 ? '1 minute ago' : `${diffMins} minutes ago`
  return 'Just now'
}

const generateHeatmapData = (): { date: string; intensity: number }[] => {
  const days: { date: string; intensity: number }[] = []
  const totalDays = 12 * 7
  const today = new Date()
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const seed = (i * 7 + d.getDate() * 3) % 11
    const intensity = seed < 3 ? 0 : seed < 5 ? 1 : seed < 7 ? 2 : seed < 9 ? 3 : 4
    days.push({ date: d.toISOString().split('T')[0], intensity })
  }
  return days
}

const toFormData = (p: ProfileData): ProfileFormData => ({
  name: p.name ?? '',
  userName: p.userName ?? '',
  bio: p.bio ?? '',
  profession: p.profession ?? '',
  dob: p.dob ?? '',
  city: p.city ?? '',
  state: p.state ?? '',
  country: p.country ?? '',
  hobbies: (p.hobbies ?? []).join(', '),
  fields: (p.fields ?? []).join(', '),
  subFields: (p.subFields ?? []).join(', '),
  avatarUrl: p.avatarUrl ?? '',
  coverPhoto: p.coverPhoto ?? '',
  profileVisibility: p.profileVisibility ?? 'PUBLIC',
})

const splitCsv = (value: string): string[] =>
  (value ?? '').split(',').map(v => v.trim()).filter(Boolean)

const EMPTY_EDUCATION_FORM = {
  institution: '',
  degree: '',
  field: '',
  grade: '',
  startYear: '',
  endYear: '',
  description: '',
  location: '',
  activities: '',
  isCurrent: false,
}

const EMPTY_EXPERIENCE_FORM = {
  role: '',
  organization: '',
  employmentType: 'FULL_TIME' as EmploymentType,
  locationType: 'ON_SITE' as LocationType,
  startDate: '',
  endDate: '',
  isCurrent: false,
  location: '',
  description: '',
  skills: '',
  companyUrl: '',
  companyLogo: '',
}

/* 🔥 Generate deterministic mock profile viewers */
const generateProfileViewers = (): ProfileViewer[] => {
  const now = Date.now()
  const viewers: ProfileViewer[] = []

  const timeOffsets = [
    2 * 60 * 1000,
    18 * 60 * 1000,
    47 * 60 * 1000,
    2 * 60 * 60 * 1000,
    5 * 60 * 60 * 1000,
    9 * 60 * 60 * 1000,
    22 * 60 * 60 * 1000,
    1.5 * 24 * 60 * 60 * 1000,
    3 * 24 * 60 * 60 * 1000,
    5 * 24 * 60 * 60 * 1000,
    8 * 24 * 60 * 60 * 1000,
    12 * 24 * 60 * 60 * 1000,
    18 * 24 * 60 * 60 * 1000,
    24 * 24 * 60 * 60 * 1000,
    35 * 24 * 60 * 60 * 1000,
    48 * 24 * 60 * 60 * 1000,
    62 * 24 * 60 * 60 * 1000,
    80 * 24 * 60 * 60 * 1000,
    95 * 24 * 60 * 60 * 1000,
    110 * 24 * 60 * 60 * 1000,
  ]

  for (let i = 0; i < VIEWER_NAMES.length; i++) {
    const name = VIEWER_NAMES[i]
    const userName = name.toLowerCase().replace(/\s+/g, '_')
    viewers.push({
      id: `viewer-${i + 1}`,
      name,
      userName,
      headline: VIEWER_HEADLINES[i % VIEWER_HEADLINES.length],
      company: VIEWER_COMPANIES[i % VIEWER_COMPANIES.length],
      location: VIEWER_LOCATIONS[i % VIEWER_LOCATIONS.length],
      avatarUrl: undefined,
      viewedAt: new Date(now - timeOffsets[i]).toISOString(),
      viewCount: 1 + ((i * 3) % 5),
      isConnection: i % 3 === 0,
      isVerified: i % 4 === 0,
    })
  }

  return viewers.sort(
    (a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
  )
}

/* 🔥 NEW: Generate deterministic mock connections */
const generateConnections = (): ConnectionUser[] => {
  const now = Date.now()
  const DAY = 24 * 60 * 60 * 1000
  const connections: ConnectionUser[] = []

  // First 30 = CONNECTED
  for (let i = 0; i < 30; i++) {
    const name = CONNECTION_NAMES[i]
    const userName = name.toLowerCase().replace(/\s+/g, '_')
    connections.push({
      id: `conn-${i + 1}`,
      name,
      userName,
      headline: CONNECTION_HEADLINES[i % CONNECTION_HEADLINES.length],
      company: CONNECTION_COMPANIES[i % CONNECTION_COMPANIES.length],
      location: CONNECTION_LOCATIONS[i % CONNECTION_LOCATIONS.length],
      avatarUrl: undefined,
      isVerified: i % 4 === 0,
      mutualConnections: 3 + ((i * 7) % 42),
      connectedAt: new Date(now - (5 + i * 3) * DAY).toISOString(),
      requestedAt: new Date(now - (5 + i * 3) * DAY).toISOString(),
      status: 'CONNECTED',
    })
  }

  // Next 5 = INCOMING REQUESTS
  for (let i = 30; i < 35; i++) {
    const name = CONNECTION_NAMES[i]
    const userName = name.toLowerCase().replace(/\s+/g, '_')
    connections.push({
      id: `conn-${i + 1}`,
      name,
      userName,
      headline: CONNECTION_HEADLINES[i % CONNECTION_HEADLINES.length],
      company: CONNECTION_COMPANIES[i % CONNECTION_COMPANIES.length],
      location: CONNECTION_LOCATIONS[i % CONNECTION_LOCATIONS.length],
      avatarUrl: undefined,
      isVerified: i % 4 === 0,
      mutualConnections: 2 + ((i * 5) % 18),
      connectedAt: new Date(now - (i - 29) * DAY * 0.3).toISOString(),
      requestedAt: new Date(now - (i - 29) * DAY * 0.5).toISOString(),
      status: 'PENDING_INCOMING',
      message: REQUEST_MESSAGES[i % REQUEST_MESSAGES.length],
    })
  }

  // Last 5 = OUTGOING REQUESTS
  for (let i = 35; i < 40; i++) {
    const name = CONNECTION_NAMES[i]
    const userName = name.toLowerCase().replace(/\s+/g, '_')
    connections.push({
      id: `conn-${i + 1}`,
      name,
      userName,
      headline: CONNECTION_HEADLINES[i % CONNECTION_HEADLINES.length],
      company: CONNECTION_COMPANIES[i % CONNECTION_COMPANIES.length],
      location: CONNECTION_LOCATIONS[i % CONNECTION_LOCATIONS.length],
      avatarUrl: undefined,
      isVerified: i % 4 === 0,
      mutualConnections: 1 + ((i * 3) % 12),
      connectedAt: new Date(now - (i - 34) * DAY).toISOString(),
      requestedAt: new Date(now - (i - 34) * DAY).toISOString(),
      status: 'PENDING_OUTGOING',
    })
  }

  return connections
}

/* ============================================================================
   COMPONENT
   ============================================================================ */

export default function ProfileClient() {
  const [darkMode, setDarkMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [autoCreatingProfile, setAutoCreatingProfile] = useState(false)

  const [posts, setPosts] = useState<ProfilePost[]>(INITIAL_POSTS)
  const [achievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS)
  const [subjectStreaks] = useState<SubjectStreak[]>(SUBJECT_STREAKS)
  const [heatmap] = useState(() => generateHeatmapData())

  const [newPostContent, setNewPostContent] = useState('')
  const [newPostType, setNewPostType] = useState<PostType>('GENERAL')
  const [newPostImages, setNewPostImages] = useState<PostImage[]>([])
  const [uploadingPostImage, setUploadingPostImage] = useState(false)
  const [postUploadProgress, setPostUploadProgress] = useState(0)
  const postImageInputRef = useRef<HTMLInputElement | null>(null)

  const [showEditProfile, setShowEditProfile] = useState(false)
  const [editForm, setEditForm] = useState<ProfileFormData | null>(null)
  const [editSocialLinks, setEditSocialLinks] = useState<SocialLinkData[]>([])
  const [editEducation, setEditEducation] = useState<EducationEntry[]>([])
  const [editExperience, setEditExperience] = useState<ExperienceEntry[]>([])

  // 🔥 NEW: username edit toggle
  const [isUserNameEditable, setIsUserNameEditable] = useState(false)
  // Store original username to detect changes / revert on cancel
  const originalUserNameRef = useRef<string>('')

  const [pendingAvatar, setPendingAvatar] = useState<PendingUpload | null>(null)
  const [pendingCover, setPendingCover] = useState<PendingUpload | null>(null)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)

  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)

  const [showAddEducationForm, setShowAddEducationForm] = useState(false)
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null)
  const [educationForm, setEducationForm] = useState(EMPTY_EDUCATION_FORM)

  const [showAddExperienceForm, setShowAddExperienceForm] = useState(false)
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null)
  const [experienceForm, setExperienceForm] = useState(EMPTY_EXPERIENCE_FORM)

  const [showAchievementDetails, setShowAchievementDetails] = useState<Achievement | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)

  // 🔥 Share state
  const [copiedProfileLink, setCopiedProfileLink] = useState(false)

  /* 🔥 Profile Views state */
  const [profileViewers] = useState<ProfileViewer[]>(() => generateProfileViewers())
  const [showViewersModal, setShowViewersModal] = useState(false)
  const [viewerFilter, setViewerFilter] = useState<ViewerFilter>('ALL')
  const [viewersPrivateMode, setViewersPrivateMode] = useState(false)

  /* 🔥 NEW: Connections state */
  const [connections, setConnections] = useState<ConnectionUser[]>(() => generateConnections())
  const [showConnectionsModal, setShowConnectionsModal] = useState(false)
  const [connectionsTab, setConnectionsTab] = useState<ConnectionsTab>('CONNECTED')
  const [connectionsSearch, setConnectionsSearch] = useState('')

  /* ================================================================
     🔥 VERIFICATION HOOK
  */
  const {
    isVerified,
    isSending: isResendingVerification,
    sendVerificationEmail,
  } = useVerification({
    email: profile?.email,
    onVerified: (ui) => {
      setProfile(ui)
      setEditForm(toFormData(ui))
      setEditSocialLinks(ui.socialLinks ?? [])
      setEditEducation(ui.education ?? [])
      setEditExperience(ui.experience ?? [])
    },
  })

  const bestCurrentStreak = useMemo(
    () => (subjectStreaks.length ? Math.max(...subjectStreaks.map(s => s.currentStreak)) : 0),
    [subjectStreaks]
  )

  /* 🔥 Filtered viewers based on selected filter */
  const filteredViewers = useMemo(() => {
    const now = Date.now()
    const DAY = 24 * 60 * 60 * 1000

    return profileViewers.filter((v) => {
      const age = now - new Date(v.viewedAt).getTime()
      switch (viewerFilter) {
        case 'TODAY':
          return age <= DAY
        case 'WEEK':
          return age <= 7 * DAY
        case 'MONTH':
          return age <= 30 * DAY
        case 'ALL':
        default:
          return true
      }
    })
  }, [profileViewers, viewerFilter])

  const visibleViewers = useMemo(() => {
    if (viewersPrivateMode) return filteredViewers.slice(0, FREE_VIEWER_LIMIT)
    return filteredViewers
  }, [filteredViewers, viewersPrivateMode])

  const viewerStats = useMemo(() => {
    const now = Date.now()
    const DAY = 24 * 60 * 60 * 1000
    const today = profileViewers.filter(
      (v) => now - new Date(v.viewedAt).getTime() <= DAY
    ).length
    const week = profileViewers.filter(
      (v) => now - new Date(v.viewedAt).getTime() <= 7 * DAY
    ).length
    const month = profileViewers.filter(
      (v) => now - new Date(v.viewedAt).getTime() <= 30 * DAY
    ).length
    return { today, week, month, total: profileViewers.length }
  }, [profileViewers])

  /* 🔥 NEW: Connection derived data */
  const connectedUsers = useMemo(
    () => connections.filter((c) => c.status === 'CONNECTED'),
    [connections]
  )
  const incomingRequests = useMemo(
    () => connections.filter((c) => c.status === 'PENDING_INCOMING'),
    [connections]
  )
  const outgoingRequests = useMemo(
    () => connections.filter((c) => c.status === 'PENDING_OUTGOING'),
    [connections]
  )

  const connectionStats = useMemo(
    () => ({
      connected: connectedUsers.length,
      incoming: incomingRequests.length,
      outgoing: outgoingRequests.length,
    }),
    [connectedUsers, incomingRequests, outgoingRequests]
  )

  const filteredConnectionList = useMemo(() => {
    const source =
      connectionsTab === 'CONNECTED'
        ? connectedUsers
        : connectionsTab === 'REQUESTS'
          ? incomingRequests
          : outgoingRequests

    const q = connectionsSearch.trim().toLowerCase()
    if (!q) return source

    return source.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        (c.company ?? '').toLowerCase().includes(q) ||
        (c.location ?? '').toLowerCase().includes(q)
      )
    })
  }, [connectionsTab, connectedUsers, incomingRequests, outgoingRequests, connectionsSearch])

  /* ================================================================
     🔥 PUBLIC PROFILE URL
  */
  const publicProfileUrl = useMemo(() => {
    if (!profile?.userName) return ''
    if (typeof window === 'undefined') return ''
    return `${window.location.origin}/u/${profile.userName}`
  }, [profile?.userName])

  /* ================================================================
     FETCH FULL PROFILE — stale-while-revalidate with cache
  */
  useEffect(() => {
    let cancelled = false
    const abort = new AbortController()

    const autoCreateProfile = async (apiProfile: ApiFullProfile) => {
      setAutoCreatingProfile(true)
      try {
        const defaultPayload = buildDefaultProfilePayload(apiProfile)
        const created = await createOrUpdateProfile(defaultPayload)
        if (cancelled) return

        const merged: ApiFullProfile = { ...apiProfile, profile: created }
        const mapped = mapApiToUi(merged) as ProfileData

        writeProfileCache({ apiProfile: merged, uiProfile: mapped })

        setProfile(mapped)
        setEditForm(toFormData(mapped))
        setEditSocialLinks(mapped.socialLinks ?? [])

        toast.success('Profile created', {
          description: 'We set up a starter profile for you. Feel free to customize it!',
          duration: 5000,
        })
      } catch (createErr: any) {
        if (cancelled) return
        console.warn('[Profile] Auto-create failed:', createErr)
        const mapped = mapApiToUi(apiProfile) as ProfileData
        writeProfileCache({ apiProfile, uiProfile: mapped })
        setProfile(mapped)
        setEditForm(toFormData(mapped))
        setEditSocialLinks(mapped.socialLinks ?? [])
        toast.info('Complete your profile', {
          description: 'Add a username, bio, and photos so others can find you.',
          duration: 6000,
        })
      } finally {
        if (!cancelled) setAutoCreatingProfile(false)
      }
    }

    const loadProfile = async () => {
      const cached = readProfileCache()
      if (cached && !cancelled) {
        setProfile(cached.uiProfile)
        setEditForm(toFormData(cached.uiProfile))
        setEditSocialLinks(cached.uiProfile.socialLinks ?? [])
        setIsLoadingProfile(false)
      } else {
        setIsLoadingProfile(true)
      }

      setProfileError(null)

      try {
        const { cached: cachedEntry, fresh } = await getFullProfileWithCache({
          signal: abort.signal,
          forceRefresh: !cached,
        })

        if (cancelled) return

        if (!fresh && cachedEntry) {
          if (cachedEntry.apiProfile.profile === null) {
            await autoCreateProfile(cachedEntry.apiProfile)
          }
          return
        }

        if (fresh) {
          if (fresh.profile === null) {
            await autoCreateProfile(fresh)
          } else {
            const mapped = mapApiToUi(fresh) as ProfileData
            setProfile(mapped)
            setEditForm(toFormData(mapped))
            setEditSocialLinks(mapped.socialLinks ?? [])
          }
        }
      } catch (err: any) {
        if (cancelled) return
        const message =
          (err as FullProfileApiError)?.message ??
          (typeof err?.message === 'string' ? err.message : 'Failed to load profile')
        console.error('Failed to load profile:', err)

        if (!readProfileCache()) {
          setProfileError(message)
          toast.error('Could not load profile', { description: message })
        }
      } finally {
        if (!cancelled) setIsLoadingProfile(false)
      }
    }

    loadProfile()
    return () => {
      cancelled = true
      abort.abort()
    }
  }, [])

  /* ---------------- Dark mode ---------------- */
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode')
    const isDark = savedMode
      ? savedMode === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggleDarkMode = () => {
    const next = !darkMode
    setDarkMode(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('darkMode', String(next))
  }

  /* ---------------- Verification ---------------- */
  const handleVerifyEmail = async () => {
    await sendVerificationEmail()
  }

  /* ================================================================
     🔥 SHARE HANDLERS
  */
  const handleOpenShareModal = () => {
    if (!profile?.userName) {
      toast.error('Set a username first', {
        description: 'You need a username before your profile can be shared.',
      })
      handleOpenEditProfile()
      return
    }
    setShowShareModal(true)
  }

  const handleCopyProfileLink = async () => {
    if (!publicProfileUrl) {
      toast.error('Username not set')
      return
    }
    try {
      await navigator.clipboard.writeText(publicProfileUrl)
      setCopiedProfileLink(true)
      toast.success('Link copied!', {
        description: 'Share it anywhere — anyone can view your profile.',
      })
      setTimeout(() => setCopiedProfileLink(false), 2000)
    } catch {
      toast.error('Could not copy link')
    }
  }

  const handleNativeShare = async () => {
    if (!publicProfileUrl) return
    if (typeof navigator === 'undefined' || !navigator.share) {
      setShowShareModal(true)
      return
    }
    try {
      await navigator.share({
        title: `${profile?.name || 'My'} · Chronify`,
        text: `Check out my Chronify profile`,
        url: publicProfileUrl,
      })
    } catch {
      /* user cancelled */
    }
  }

  const handleShareToTwitter = () => {
    if (!publicProfileUrl) return
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(publicProfileUrl)}&text=${encodeURIComponent('Check out my Chronify profile!')}`,
      '_blank',
      'noopener,noreferrer'
    )
    setShowShareModal(false)
  }

  const handleShareToLinkedIn = () => {
    if (!publicProfileUrl) return
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicProfileUrl)}`,
      '_blank',
      'noopener,noreferrer'
    )
    setShowShareModal(false)
  }

  const handleShareToWhatsApp = () => {
    if (!publicProfileUrl) return
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`Check out my Chronify profile: ${publicProfileUrl}`)}`,
      '_blank',
      'noopener,noreferrer'
    )
    setShowShareModal(false)
  }

  /* ================================================================
     PENDING IMAGE PICKERS
  */
  const revokePreview = (url: string | null | undefined) => {
    if (url && url.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(url)
      } catch {
        /* ignore */
      }
    }
  }

  const handleAvatarPick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    const err = validateImageFile(file)
    if (err) {
      toast.error('Invalid image', { description: err })
      return
    }

    revokePreview(pendingAvatar?.previewUrl)

    const previewUrl = URL.createObjectURL(file)
    setPendingAvatar({ file, previewUrl })

    setEditForm((prev) => (prev ? { ...prev, avatarUrl: previewUrl } : prev))
  }

  const handleCoverPick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    const err = validateImageFile(file)
    if (err) {
      toast.error('Invalid image', { description: err })
      return
    }

    revokePreview(pendingCover?.previewUrl)

    const previewUrl = URL.createObjectURL(file)
    setPendingCover({ file, previewUrl })

    setEditForm((prev) => (prev ? { ...prev, coverPhoto: previewUrl } : prev))
  }

  const handleRemovePendingAvatar = () => {
    revokePreview(pendingAvatar?.previewUrl)
    setPendingAvatar(null)
    setEditForm((prev) => (prev ? { ...prev, avatarUrl: '' } : prev))
  }

  const handleRemovePendingCover = () => {
    revokePreview(pendingCover?.previewUrl)
    setPendingCover(null)
    setEditForm((prev) => (prev ? { ...prev, coverPhoto: '' } : prev))
  }

  /* ---------------- Post images ---------------- */
  const handlePostImagePick = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (!files.length) return

    if (newPostImages.length + files.length > 5) {
      toast.error('Max 5 images per post')
      return
    }

    setUploadingPostImage(true)
    setPostUploadProgress(0)

    try {
      const uploaded: PostImage[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        const validationError = validateImageFile(file)
        if (validationError) {
          toast.error(`Skipped ${file.name}`, { description: validationError })
          continue
        }

        const compressed = await compressImage(file, 1600, 0.85)

        const result = await uploadToCloudinary(compressed, {
          folder: 'chronify/posts',
          onProgress: (percent) => {
            const progress = Number(percent) || 0
            const overall = Math.round(((i + progress / 100) / files.length) * 100)
            setPostUploadProgress(overall)
          },
        })

        uploaded.push({
          id: `img-${Date.now()}-${i}`,
          url: result.secureUrl,
          publicId: result.publicId,
        })
      }

      if (uploaded.length > 0) {
        setNewPostImages((prev) => [...prev, ...uploaded])
        toast.success(
          uploaded.length === 1
            ? 'Image uploaded'
            : `${uploaded.length} images uploaded`
        )
      }
    } catch (err: any) {
      console.error('Post image upload failed:', err)
      toast.error('Image upload failed', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    } finally {
      setUploadingPostImage(false)
      setPostUploadProgress(0)
    }
  }

  const handleRemovePostImage = (id: string) => {
    setNewPostImages((prev) => prev.filter((img) => img.id !== id))
  }

  /* ---------------- Edit Profile ---------------- */
  const handleOpenEditProfile = () => {
    if (!profile) return

    revokePreview(pendingAvatar?.previewUrl)
    revokePreview(pendingCover?.previewUrl)
    setPendingAvatar(null)
    setPendingCover(null)

    setShowAddEducationForm(false)
    setEditingEducationId(null)
    setEducationForm(EMPTY_EDUCATION_FORM)
    setShowAddExperienceForm(false)
    setEditingExperienceId(null)
    setExperienceForm(EMPTY_EXPERIENCE_FORM)

    setEditForm(toFormData(profile))
    setEditSocialLinks(Array.isArray(profile.socialLinks) ? profile.socialLinks : [])
    setEditEducation(Array.isArray(profile.education) ? [...profile.education] : [])
    setEditExperience(Array.isArray(profile.experience) ? [...profile.experience] : [])

    // 🔥 Reset username edit toggle & store original
    setIsUserNameEditable(false)
    originalUserNameRef.current = profile.userName ?? ''

    setShowEditProfile(true)
  }

  const handleCloseEditProfile = () => {
    revokePreview(pendingAvatar?.previewUrl)
    revokePreview(pendingCover?.previewUrl)
    setPendingAvatar(null)
    setPendingCover(null)
    setShowEditProfile(false)
    setIsUserNameEditable(false)
  }

  /* ---------------- Social links ---------------- */
  const handleAddSocialLink = () => {
    setEditSocialLinks((prev) => [
      ...prev,
      {
        id: `sl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        platform: 'OTHER',
        url: '',
      },
    ])
  }

  const handleUpdateSocialLink = (id: string, patch: Partial<SocialLinkData>) => {
    setEditSocialLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)))
  }

  const handleRemoveSocialLink = (id: string) => {
    setEditSocialLinks((prev) => prev.filter((l) => l.id !== id))
  }

  /* ================================================================
     EDUCATION CRUD
  */

  const handleStartAddEducation = () => {
    setEditingEducationId(null)
    setEducationForm(EMPTY_EDUCATION_FORM)
    setShowAddEducationForm(true)
  }

  const handleStartEditEducation = (edu: EducationEntry) => {
    setEditingEducationId(edu.id)
    setEducationForm({
      institution: edu.institution ?? '',
      degree: edu.degree ?? '',
      field: edu.field ?? '',
      grade: edu.grade ?? '',
      startYear: edu.startYear ?? '',
      endYear: edu.endYear ?? '',
      description: edu.description ?? '',
      location: edu.location ?? '',
      activities: edu.activities ?? '',
      isCurrent: edu.isCurrent ?? false,
    })
    setShowAddEducationForm(true)
  }

  const handleCancelEducationForm = () => {
    setShowAddEducationForm(false)
    setEditingEducationId(null)
    setEducationForm(EMPTY_EDUCATION_FORM)
  }

  const handleCommitEducationForm = () => {
    if (!educationForm.institution.trim() || !educationForm.degree.trim()) {
      toast.error('Institution and degree are required')
      return
    }

    if (editingEducationId) {
      setEditEducation((prev) =>
        prev.map((e) =>
          e.id === editingEducationId
            ? {
                ...e,
                institution: educationForm.institution.trim(),
                degree: educationForm.degree.trim(),
                field: educationForm.field.trim(),
                grade: educationForm.grade.trim(),
                startYear: educationForm.startYear.trim(),
                endYear: educationForm.isCurrent ? 'Present' : educationForm.endYear.trim(),
                description: educationForm.description.trim(),
                location: educationForm.location.trim(),
                activities: educationForm.activities.trim(),
                isCurrent: educationForm.isCurrent,
              }
            : e
        )
      )
      toast.success('Education updated')
    } else {
      const newEdu: EducationEntry = {
        id: `edu-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        institution: educationForm.institution.trim(),
        degree: educationForm.degree.trim(),
        field: educationForm.field.trim(),
        grade: educationForm.grade.trim(),
        startYear: educationForm.startYear.trim(),
        endYear: educationForm.isCurrent ? 'Present' : educationForm.endYear.trim(),
        description: educationForm.description.trim(),
        location: educationForm.location.trim(),
        activities: educationForm.activities.trim(),
        isCurrent: educationForm.isCurrent,
        order: editEducation.length,
      }
      setEditEducation((prev) => [...prev, newEdu])
      toast.success('Education added')
    }

    handleCancelEducationForm()
  }

  const handleRemoveEducation = (id: string) => {
    setEditEducation((prev) => prev.filter((e) => e.id !== id))
    toast.success('Education removed')
  }

  /* ================================================================
     EXPERIENCE CRUD
  */

  const handleStartAddExperience = () => {
    setEditingExperienceId(null)
    setExperienceForm(EMPTY_EXPERIENCE_FORM)
    setShowAddExperienceForm(true)
  }

  const handleStartEditExperience = (exp: ExperienceEntry) => {
    setEditingExperienceId(exp.id)
    setExperienceForm({
      role: exp.role ?? '',
      organization: exp.organization ?? '',
      employmentType: exp.employmentType ?? 'FULL_TIME',
      locationType: exp.locationType ?? 'ON_SITE',
      startDate: exp.startDate ?? '',
      endDate: exp.endDate ?? '',
      isCurrent: exp.isCurrent ?? false,
      location: exp.location ?? '',
      description: exp.description ?? '',
      skills: (exp.skills ?? []).join(', '),
      companyUrl: exp.companyUrl ?? '',
      companyLogo: exp.companyLogo ?? '',
    })
    setShowAddExperienceForm(true)
  }

  const handleCancelExperienceForm = () => {
    setShowAddExperienceForm(false)
    setEditingExperienceId(null)
    setExperienceForm(EMPTY_EXPERIENCE_FORM)
  }

  const handleCommitExperienceForm = () => {
    if (!experienceForm.role.trim() || !experienceForm.organization.trim()) {
      toast.error('Role and organization are required')
      return
    }

    const skillsArray = splitCsv(experienceForm.skills)

    if (editingExperienceId) {
      setEditExperience((prev) =>
        prev.map((e) =>
          e.id === editingExperienceId
            ? {
                ...e,
                role: experienceForm.role.trim(),
                organization: experienceForm.organization.trim(),
                employmentType: experienceForm.employmentType,
                locationType: experienceForm.locationType,
                startDate: experienceForm.startDate.trim(),
                endDate: experienceForm.isCurrent ? 'Present' : experienceForm.endDate.trim(),
                isCurrent: experienceForm.isCurrent,
                location: experienceForm.location.trim(),
                description: experienceForm.description.trim(),
                skills: skillsArray,
                companyUrl: experienceForm.companyUrl.trim(),
                companyLogo: experienceForm.companyLogo.trim(),
              }
            : e
        )
      )
      toast.success('Experience updated')
    } else {
      const newExp: ExperienceEntry = {
        id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role: experienceForm.role.trim(),
        organization: experienceForm.organization.trim(),
        employmentType: experienceForm.employmentType,
        locationType: experienceForm.locationType,
        startDate: experienceForm.startDate.trim(),
        endDate: experienceForm.isCurrent ? 'Present' : experienceForm.endDate.trim(),
        isCurrent: experienceForm.isCurrent,
        location: experienceForm.location.trim(),
        description: experienceForm.description.trim(),
        skills: skillsArray,
        companyUrl: experienceForm.companyUrl.trim(),
        companyLogo: experienceForm.companyLogo.trim(),
        order: editExperience.length,
      }
      setEditExperience((prev) => [...prev, newExp])
      toast.success('Experience added')
    }

    handleCancelExperienceForm()
  }

  const handleRemoveExperience = (id: string) => {
    setEditExperience((prev) => prev.filter((e) => e.id !== id))
    toast.success('Experience removed')
  }

  /* ================================================================
     SAVE PROFILE
  */
  const handleSaveProfile = async () => {
    if (!editForm) return
    if (!editForm.name.trim()) {
      toast.error('Name cannot be empty')
      return
    }

    setIsSaving(true)

    try {
      let finalAvatarUrl = editForm.avatarUrl || ''
      let finalCoverUrl = editForm.coverPhoto || ''

      const isBlobUrl = (u: string) => u.startsWith('blob:')

      const cloudinaryConfigured =
        !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
        !!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

      if (pendingAvatar) {
        if (!cloudinaryConfigured) {
          toast.error('Image upload unavailable', {
            description:
              'Cloudinary is not configured. Paste an image URL instead, or contact admin.',
            duration: 6000,
          })
          finalAvatarUrl = isBlobUrl(finalAvatarUrl) ? '' : finalAvatarUrl
        } else {
          try {
            const compressed = await compressImage(pendingAvatar.file, 1200, 0.85)
            const result = await uploadToCloudinary(compressed, {
              folder: 'chronify/avatars',
            })
            finalAvatarUrl = result.secureUrl
          } catch (err: any) {
            console.error('[Save] Avatar upload failed:', err)
            toast.error('Avatar upload failed', {
              description: err instanceof Error ? err.message : 'Please try again.',
            })
            finalAvatarUrl = isBlobUrl(finalAvatarUrl) ? '' : finalAvatarUrl
          }
        }
      } else if (isBlobUrl(finalAvatarUrl)) {
        finalAvatarUrl = ''
      }

      if (pendingCover) {
        if (!cloudinaryConfigured) {
          toast.error('Image upload unavailable', {
            description:
              'Cloudinary is not configured. Paste an image URL instead, or contact admin.',
            duration: 6000,
          })
          finalCoverUrl = isBlobUrl(finalCoverUrl) ? '' : finalCoverUrl
        } else {
          try {
            const compressed = await compressImage(pendingCover.file, 1920, 0.85)
            const result = await uploadToCloudinary(compressed, {
              folder: 'chronify/covers',
            })
            finalCoverUrl = result.secureUrl
          } catch (err: any) {
            console.error('[Save] Cover upload failed:', err)
            toast.error('Cover upload failed', {
              description: err instanceof Error ? err.message : 'Please try again.',
            })
            finalCoverUrl = isBlobUrl(finalCoverUrl) ? '' : finalCoverUrl
          }
        }
      } else if (isBlobUrl(finalCoverUrl)) {
        finalCoverUrl = ''
      }

      const cleanedSocialLinks = editSocialLinks
        .filter((l) => l.url.trim().length > 0)
        .map((l) => ({
          platform: l.platform,
          url: l.url.trim(),
        }))

      const educationPayload: EducationPayload[] = editEducation.map((e, idx) => ({
        ...(e.id && !e.id.startsWith('edu-') ? { id: e.id } : {}),
        institution: e.institution,
        degree: e.degree,
        field: e.field || null,
        grade: e.grade || null,
        startYear: e.startYear || null,
        endYear: e.endYear || null,
        description: e.description || null,
        location: e.location || null,
        activities: e.activities || null,
        isCurrent: e.isCurrent,
        order: idx,
      }))

      const experiencePayload: ExperiencePayload[] = editExperience.map((e, idx) => ({
        ...(e.id && !e.id.startsWith('exp-') ? { id: e.id } : {}),
        role: e.role,
        organization: e.organization,
        employmentType: e.employmentType,
        locationType: e.locationType,
        startDate: e.startDate || null,
        endDate: e.endDate || null,
        isCurrent: e.isCurrent,
        location: e.location || null,
        description: e.description || null,
        skills: e.skills ?? [],
        companyUrl: e.companyUrl || null,
        companyLogo: e.companyLogo || null,
        order: idx,
      }))

      const localFields = splitCsv(editForm.fields)
      const localSubFields = splitCsv(editForm.subFields)

      // 🔥 Only send userName if it has been changed & user enabled editing
      const userNameChanged =
        isUserNameEditable && editForm.userName.trim() !== originalUserNameRef.current
      const payloadUserName = userNameChanged ? editForm.userName.trim() : undefined

      // 🔥 FIX: Always send fullName so the name gets updated on the backend
      const payloadFullName = editForm.name.trim()

      const updated = await createOrUpdateProfile({
        // 🔥 FIX: fullName is now included in the payload
        fullName: payloadFullName,
        ...(payloadUserName !== undefined ? { userName: payloadUserName } : {}),
        bio: editForm.bio,
        profession: editForm.profession,
        dob: editForm.dob || null,
        city: editForm.city,
        state: editForm.state,
        country: editForm.country,
        hobbies: splitCsv(editForm.hobbies),
        avatarUrl: finalAvatarUrl || null,
        coverPhoto: finalCoverUrl || null,
        fields: localFields,
        subFields: localSubFields,
        profileVisibility: editForm.profileVisibility,
        socialLinks: cleanedSocialLinks,
        education: educationPayload,
        experience: experiencePayload,
      })

      const refreshed = await getFullProfile().catch(() => null)

      if (refreshed) {
        const mapped = mapApiToUi(refreshed) as ProfileData

        const serverFields =
          Array.isArray(mapped.fields) && mapped.fields.length > 0
            ? mapped.fields
            : localFields

        const serverSubFields =
          Array.isArray(mapped.subFields) && mapped.subFields.length > 0
            ? mapped.subFields
            : localSubFields

        const finalProfile: ProfileData = {
          ...mapped,
          fields: serverFields,
          subFields: serverSubFields,
        }

        writeProfileCache({ apiProfile: refreshed, uiProfile: finalProfile })

        setProfile(finalProfile)
        setEditForm(toFormData(finalProfile))
        setEditSocialLinks(finalProfile.socialLinks ?? [])
        setEditEducation(finalProfile.education ?? [])
        setEditExperience(finalProfile.experience ?? [])
      } else {
        setProfile((prev) => {
          if (!prev) return prev
          const updatedProfile: ProfileData = {
            ...prev,
            // 🔥 FIX: also update name locally from editForm
            name: editForm.name,
            userName: updated.userName ?? editForm.userName,
            bio: updated.bio ?? editForm.bio,
            profession: updated.profession ?? editForm.profession,
            dob: updated.dob ? updated.dob.split('T')[0] : editForm.dob,
            city: updated.city ?? editForm.city,
            state: updated.state ?? editForm.state,
            country: updated.country ?? editForm.country,
            hobbies: updated.hobbies ?? splitCsv(editForm.hobbies),
            fields: localFields,
            subFields: localSubFields,
            avatarUrl: updated.avatarUrl ?? finalAvatarUrl,
            coverPhoto: updated.coverPhoto ?? finalCoverUrl,
            profileVisibility: editForm.profileVisibility,
            socialLinks: Array.isArray(updated.socialLinks)
              ? updated.socialLinks
              : cleanedSocialLinks.map((l, i) => ({
                  id: `temp-${i}`,
                  platform: l.platform,
                  url: l.url,
                })),
            education: editEducation,
            experience: editExperience,
            isProfileIncomplete: false,
          }

          const cached = readProfileCache()
          if (cached) {
            const syntheticApi: ApiFullProfile = {
              ...cached.apiProfile,
              // 🔥 FIX: also update name in synthetic API cache
              name: editForm.name,
              fields: localFields,
              subFields: localSubFields,
              profileVisibility: editForm.profileVisibility,
              profile: updated,
            }
            writeProfileCache({ apiProfile: syntheticApi, uiProfile: updatedProfile })
          }

          return updatedProfile
        })
      }

      revokePreview(pendingAvatar?.previewUrl)
      revokePreview(pendingCover?.previewUrl)
      setPendingAvatar(null)
      setPendingCover(null)

      setShowEditProfile(false)
      setIsUserNameEditable(false)
      toast.success('Profile updated', {
        description: 'Your changes have been saved.',
      })
    } catch (err: any) {
      const message =
        (err as FullProfileApiError)?.message ??
        (err instanceof Error ? err.message : 'Failed to save profile')
      console.error('Failed to save profile:', err)
      toast.error('Could not save profile', { description: message })
    } finally {
      setIsSaving(false)
    }
  }

  /* ---------------- Posts ---------------- */
  const handleCreatePost = () => {
    if (!newPostContent.trim() && newPostImages.length === 0) return

    const post: ProfilePost = {
      id: `post-${Date.now()}`,
      type: newPostType,
      content: newPostContent.trim(),
      createdAt: new Date().toISOString(),
      reactionsCount: 0,
      commentsCount: 0,
      images: [...newPostImages],
    }

    setPosts(prev => [post, ...prev])
    setNewPostContent('')
    setNewPostImages([])
    setNewPostType('GENERAL')
    toast.success('Posted to your profile')
  }

  const handleDeletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  const handleReactToPost = (id: string) => {
    setPosts(prev =>
      prev.map(p => (p.id === id ? { ...p, reactionsCount: p.reactionsCount + 1 } : p))
    )
  }

  /* ---------------- Misc ---------------- */
  const handleExportData = () => {
    toast.success('Data export started', { description: 'Your data will be downloaded shortly.' })
  }

  const handleLogout = async () => {
    try {
      clearProfileCache()
      await AuthService.logout()
    } catch {
      toast.info('Logging out...')
    }
  }

  /* 🔥 Profile viewers helpers */
  const handleOpenViewersModal = (filter: ViewerFilter = 'ALL') => {
    setViewerFilter(filter)
    setShowViewersModal(true)
  }

  const handleToggleViewersPrivacy = () => {
    const next = !viewersPrivateMode
    setViewersPrivateMode(next)
    toast.success(
      next
        ? 'Private view mode enabled'
        : 'Full viewer list visible',
      {
        description: next
          ? `Only showing the most recent ${FREE_VIEWER_LIMIT} viewers.`
          : 'Showing all profile viewers.',
      }
    )
  }

  /* 🔥 NEW: Connections helpers */
  const handleOpenConnectionsModal = (tab: ConnectionsTab = 'CONNECTED') => {
    setConnectionsTab(tab)
    setConnectionsSearch('')
    setShowConnectionsModal(true)
  }

  const handleAcceptConnection = (id: string) => {
    let acceptedName = ''
    setConnections((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c
        acceptedName = c.name
        return {
          ...c,
          status: 'CONNECTED',
          connectedAt: new Date().toISOString(),
        }
      })
    )
    if (acceptedName) {
      toast.success(`You're now connected with ${acceptedName}`, {
        description: 'You can now message each other.',
      })
    }
  }

  const handleDeclineConnection = (id: string) => {
    let declinedName = ''
    setConnections((prev) =>
      prev.filter((c) => {
        if (c.id === id) {
          declinedName = c.name
          return false
        }
        return true
      })
    )
    if (declinedName) {
      toast.info(`Request from ${declinedName} declined`)
    }
  }

  const handleWithdrawRequest = (id: string) => {
    let withdrawnName = ''
    setConnections((prev) =>
      prev.filter((c) => {
        if (c.id === id) {
          withdrawnName = c.name
          return false
        }
        return true
      })
    )
    if (withdrawnName) {
      toast.success(`Request to ${withdrawnName} withdrawn`)
    }
  }

  const handleRemoveConnection = (id: string) => {
    let removedName = ''
    setConnections((prev) =>
      prev.filter((c) => {
        if (c.id === id) {
          removedName = c.name
          return false
        }
        return true
      })
    )
    if (removedName) {
      toast.info(`Removed connection with ${removedName}`)
    }
  }

  const handleMessageConnection = (name: string) => {
    toast.success(`Opening chat with ${name}`, {
      description: 'Messaging will be available in the full release.',
    })
  }

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme={darkMode ? 'dark' : 'light'}
        toastOptions={{
          style: {
            background: darkMode ? '#1f2937' : '#ffffff',
            color: darkMode ? '#f3f4f6' : '#111827',
            border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
          },
        }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12 transition-colors duration-200">
        {/* COVER */}
        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
          {profile?.coverPhoto ? (
            <button
              type="button"
              onClick={() => setLightboxUrl(profile.coverPhoto)}
              className="absolute inset-0 w-full h-full cursor-zoom-in group"
              aria-label="View cover photo"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.coverPhoto}
                alt="Cover"
                className="absolute inset-0 w-full h-full object-cover object-center select-none"
                draggable={false}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs">
                  <ZoomIn className="w-3.5 h-3.5" />
                  Click to view
                </div>
              </div>
            </button>
          ) : (
            <div className="absolute inset-0" />
          )}

          <div className="absolute top-0 inset-x-0 z-20 px-4 sm:px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 text-sm text-white/90 hover:text-white bg-black/20 hover:bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
                </Link>
              </div>

              <div className="flex-1 min-w-0 flex justify-center">
                {!isLoadingProfile && profile && !isVerified && (
                  <div className="flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-lg border border-amber-300/70 dark:border-amber-500/40 bg-amber-50/95 dark:bg-amber-950/85 backdrop-blur-md shadow-md max-w-full">
                    <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-amber-900 dark:text-amber-100 font-medium">
                      Your account isn&apos;t verified yet — verify{' '}
                      <span className="hidden sm:inline">{profile.email} </span>
                      to unlock messaging, connections &amp; full profile visibility.
                    </span>
                    <Button
                      size="sm"
                      onClick={handleVerifyEmail}
                      disabled={isResendingVerification}
                      className="bg-amber-600 hover:bg-amber-700 text-white h-7 px-2.5 text-xs flex-shrink-0"
                    >
                      {isResendingVerification ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Verify Now
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {isLoadingProfile && <ProfileSkeleton />}

          {autoCreatingProfile && (
            <div className="py-20 flex flex-col items-center text-center">
              <div className="relative inline-flex mb-4">
                <div className="absolute inset-0 rounded-full bg-blue-200/40 animate-ping" />
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Setting up your profile
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                Just a moment while we create your starter profile...
              </p>
            </div>
          )}

          {!isLoadingProfile && profileError && !profile && (
            <div className="py-20 flex flex-col items-center text-center">
              <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Couldn&apos;t load your profile
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                {profileError}
              </p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Try again
              </Button>
            </div>
          )}

          {!isLoadingProfile && !autoCreatingProfile && profile && (
            <>
              {profile.isProfileIncomplete && (
                <div className="relative -mt-14 sm:-mt-16 mb-4 pt-14 sm:pt-16">
                  <div className="rounded-xl border border-blue-300/70 dark:border-blue-500/40 bg-blue-50/95 dark:bg-blue-950/50 p-4 flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                        <UserCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                          Complete your profile
                        </p>
                        <p className="text-xs text-blue-800 dark:text-blue-200/90 mt-0.5">
                          Add your username, bio, and photos so others can discover you.
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleOpenEditProfile}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
                    >
                      <Edit className="w-3.5 h-3.5 mr-1.5" />
                      Set Up Profile
                    </Button>
                  </div>
                </div>
              )}

              <div
                className={
                  profile.isProfileIncomplete
                    ? 'relative mb-6'
                    : 'relative -mt-16 sm:-mt-20 mb-6'
                }
              >
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
                  <button
                    type="button"
                    onClick={() => {
                      if (profile.avatarUrl) setLightboxUrl(profile.avatarUrl)
                    }}
                    className="relative flex-shrink-0 rounded-full ring-4 ring-white dark:ring-gray-900 shadow-lg overflow-hidden group w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500 to-purple-500 cursor-zoom-in"
                    aria-label="View profile picture"
                  >
                    {profile.avatarUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={profile.avatarUrl}
                          alt={profile.name || 'Profile picture'}
                          className="absolute inset-0 w-full h-full object-cover object-center select-none"
                          draggable={false}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ZoomIn className="w-6 h-6 text-white drop-shadow" />
                        </div>
                      </>
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-3xl font-semibold text-white">
                        {getInitials(profile.name)}
                      </span>
                    )}
                  </button>

                  <div className="flex-1 bg-white dark:bg-gray-800 sm:bg-transparent sm:dark:bg-transparent rounded-xl sm:rounded-none p-4 sm:p-0 shadow-sm sm:shadow-none sm:pb-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {profile.name || 'Unnamed User'}
                          </h1>

                          {isVerified ? (
                            <CheckCircle2
                              className="w-5 h-5 text-blue-500 flex-shrink-0"
                              aria-label="Verified"
                            />
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[10px] gap-1 border-amber-300 text-amber-700 dark:border-amber-700/60 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
                              title="Verify your email to unlock more features"
                            >
                              <ShieldAlert className="w-3 h-3" /> Unverified
                            </Badge>
                          )}

                          <Badge variant="outline" className="text-xs">
                            {profile.accountType === 'STUDENT' ? 'Student' : 'Mentor'}
                          </Badge>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          @{profile.userName || 'user'}
                        </p>
                        {profile.profession && (
                          <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                            {profile.profession}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={handleOpenShareModal}
                          className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          aria-label="Share profile"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              aria-label="More options"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 w-52"
                          >
                            <DropdownMenuItem asChild>
                              <Link
                                href="/dashboard/settings"
                                className="flex items-center gap-2 cursor-pointer w-full"
                              >
                                <Settings className="w-4 h-4" />
                                Settings
                              </Link>
                            </DropdownMenuItem>

                            {profile.userName && (
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/u/${profile.userName}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 cursor-pointer w-full"
                                >
                                  <UserCircle2 className="w-4 h-4" />
                                  View Public Profile
                                </Link>
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem onClick={handleExportData}>
                              <Download className="w-4 h-4 mr-2" /> Export Data
                            </DropdownMenuItem>

                            {!isVerified && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleVerifyEmail}>
                                  <ShieldCheck className="w-4 h-4 mr-2" /> Verify Email
                                </DropdownMenuItem>
                              </>
                            )}

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={handleLogout}
                              className="text-red-600 focus:text-red-600"
                            >
                              <LogOut className="w-4 h-4 mr-2" /> Logout
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <button
                          onClick={handleOpenEditProfile}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm"
                        >
                          <Edit className="w-4 h-4" /> Edit Profile
                        </button>
                      </div>
                    </div>

                    {profile.bio && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 max-w-2xl">
                        {profile.bio}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mt-3">
                      {(profile.city || profile.country) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {[profile.city, profile.country].filter(Boolean).join(', ')}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Joined {formatDate(profile.memberSince)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {profile.email}
                        {!isVerified && (
                          <span className="ml-1 text-amber-600 dark:text-amber-400 font-medium">
                            · Unverified
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats row — 🔥 Updated: Profile Views + Connections clickable */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                {[
                  {
                    label: 'Connections',
                    value: String(connectionStats.connected),
                    icon: Users,
                    onClick: () => handleOpenConnectionsModal('CONNECTED'),
                  },
                  { label: 'Posts', value: String(posts.length), href: '#posts', icon: Sparkles },
                  { label: 'Profile Views', value: String(TOTAL_PROFILE_VIEWS), href: '#profile-views', icon: Eye, onClick: () => handleOpenViewersModal('ALL') },
                  { label: 'Best Streak', value: `${bestCurrentStreak}d`, href: '#streaks', icon: Flame },
                  { label: 'Consistency', value: `${CONSISTENCY_SCORE}/100`, href: '#activity', icon: TrendingUp },
                ].map(stat => {
                  const inner = (
                    <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors h-full">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                          <stat.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                            {stat.value}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {stat.label}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )

                  if (stat.onClick) {
                    return (
                      <button
                        key={stat.label}
                        type="button"
                        onClick={stat.onClick}
                        className="block text-left w-full"
                      >
                        {inner}
                      </button>
                    )
                  }

                  return (
                    <a key={stat.label} href={stat.href} className="block">
                      {inner}
                    </a>
                  )
                })}
              </div>

              {/* Main grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left sidebar */}
                <div className="space-y-6">
                  {/* 🔥 Profile Views Card */}
                  <Card
                    id="profile-views"
                    className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 scroll-mt-4 overflow-hidden"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base dark:text-gray-200 flex items-center gap-2">
                          <Eye className="w-4 h-4 text-blue-500" /> Profile Views
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="text-[10px] gap-1 border-green-300 text-green-700 dark:border-green-800 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                        >
                          <TrendingUp className="w-3 h-3" />
                          +{VIEWS_GROWTH_PERCENT}%
                        </Badge>
                      </div>
                      <CardDescription className="dark:text-gray-400">
                        {TOTAL_PROFILE_VIEWS.toLocaleString()} total views ·{' '}
                        {WEEKLY_PROFILE_VIEWS} this week
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {profileViewers.slice(0, 5).map((viewer) => (
                            <div
                              key={viewer.id}
                              className="relative w-9 h-9 rounded-full ring-2 ring-white dark:ring-gray-800 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold"
                              title={viewer.name}
                            >
                              {viewer.avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={viewer.avatarUrl}
                                  alt={viewer.name}
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              ) : (
                                getInitials(viewer.name)
                              )}
                            </div>
                          ))}
                          {profileViewers.length > 5 && (
                            <div className="w-9 h-9 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-semibold text-gray-600 dark:text-gray-300">
                              +{profileViewers.length - 5}
                            </div>
                          )}
                        </div>
                      </div>

                      {profileViewers[0] && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {profileViewers[0].name}
                          </span>
                          <span>viewed your profile</span>
                          <span className="text-gray-400 dark:text-gray-500">
                            · {timeAgo(profileViewers[0].viewedAt)}
                          </span>
                        </div>
                      )}

                      <div className="pt-2">
                        <div className="flex items-end gap-1 h-10">
                          {[38, 52, 44, 68, 96, 74, 60].map((v, i) => {
                            const pct = (v / 100) * 100
                            return (
                              <div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-500 rounded-sm transition-all hover:opacity-80"
                                style={{ height: `${pct}%` }}
                                title={`${v} views`}
                              />
                            )
                          })}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                          <span>Mon</span>
                          <span>Sun</span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenViewersModal('ALL')}
                        className="w-full gap-1.5 mt-1"
                      >
                        See who viewed
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base dark:text-gray-200">About</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <p className="text-gray-600 dark:text-gray-400">
                        {profile.bio || 'No bio added yet.'}
                      </p>
                      {(profile.hobbies?.length ?? 0) > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            Interests
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {(profile.hobbies ?? []).map(h => (
                              <Badge key={h} variant="outline" className="text-xs font-normal">
                                {h}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base dark:text-gray-200">
                        Skills & Focus Areas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {(profile.fields?.length ?? 0) > 0 ? (
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            Fields
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {(profile.fields ?? []).map(f => (
                              <Badge
                                key={f}
                                className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-0"
                              >
                                {f}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          No fields added yet.
                        </p>
                      )}
                      {(profile.subFields?.length ?? 0) > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            Specializations
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {(profile.subFields ?? []).map(f => (
                              <Badge key={f} variant="outline" className="text-xs font-normal">
                                {f}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* EDUCATION DISPLAY */}
                  <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-base dark:text-gray-200 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-400" /> Education
                      </CardTitle>
                      <button
                        onClick={handleOpenEditProfile}
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                        aria-label="Edit education"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {(!profile.education || profile.education.length === 0) && (
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          No education added yet.
                        </p>
                      )}
                      {(profile.education ?? []).map((edu) => (
                        <div
                          key={edu.id}
                          className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white flex-shrink-0">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {edu.degree}
                              {edu.field ? ` · ${edu.field}` : ''}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3" />
                              {edu.institution}
                            </p>
                            {(edu.startYear || edu.endYear) && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {edu.startYear || '—'} – {edu.isCurrent ? 'Present' : edu.endYear || '—'}
                              </p>
                            )}
                            {edu.grade && (
                              <Badge variant="outline" className="text-[10px] mt-1.5">
                                <Award className="w-3 h-3 mr-1" /> {edu.grade}
                              </Badge>
                            )}
                            {edu.location && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                <MapPinned className="w-3 h-3" /> {edu.location}
                              </p>
                            )}
                            {edu.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                                {edu.description}
                              </p>
                            )}
                            {edu.activities && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                                Activities: {edu.activities}
                              </p>
                            )}
                          </div>
                          {edu.isCurrent && (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] shrink-0">
                              Current
                            </Badge>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* EXPERIENCE DISPLAY */}
                  <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-base dark:text-gray-200 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-400" /> Experience
                      </CardTitle>
                      <button
                        onClick={handleOpenEditProfile}
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                        aria-label="Edit experience"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {(!profile.experience || profile.experience.length === 0) && (
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          No experience added yet.
                        </p>
                      )}
                      {(profile.experience ?? []).map((exp) => (
                        <div
                          key={exp.id}
                          className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white flex-shrink-0 overflow-hidden">
                            {exp.companyLogo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={exp.companyLogo}
                                alt={exp.organization}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Briefcase className="w-5 h-5" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {exp.role}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3" />
                              {exp.organization}
                              {exp.companyUrl && (
                                <a
                                  href={exp.companyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                                >
                                  visit
                                </a>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {EMPLOYMENT_TYPE_LABELS[exp.employmentType]} · {LOCATION_TYPE_LABELS[exp.locationType]}
                            </p>
                            {(exp.startDate || exp.endDate) && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {exp.startDate || '—'} – {exp.isCurrent ? 'Present' : exp.endDate || '—'}
                              </p>
                            )}
                            {exp.location && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                <MapPinned className="w-3 h-3" /> {exp.location}
                              </p>
                            )}
                            {exp.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed whitespace-pre-line">
                                {exp.description}
                              </p>
                            )}
                            {exp.skills && exp.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {exp.skills.map((skill) => (
                                  <Badge
                                    key={skill}
                                    variant="outline"
                                    className="text-[10px] font-normal"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          {exp.isCurrent && (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] shrink-0">
                              Current
                            </Badge>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base dark:text-gray-200">Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {(profile.socialLinks?.length ?? 0) === 0 && (
                        <p className="text-sm text-gray-400 dark:text-gray-500">No links added.</p>
                      )}
                      {(profile.socialLinks ?? []).map(link => {
                        const meta = SOCIAL_PLATFORM_META[link.platform] ?? SOCIAL_PLATFORM_META.OTHER
                        const Icon = meta.icon
                        return (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <Icon className="w-4 h-4" /> {meta.label}
                          </a>
                        )
                      })}
                    </CardContent>
                  </Card>

                  {/* 🔥 NEW: Connections Card (dynamic) */}
                  <Card
                    id="connections"
                    className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 scroll-mt-4"
                  >
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-base dark:text-gray-200 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" /> Connections
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenConnectionsModal('CONNECTED')}
                        className="h-7 text-xs gap-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                      >
                        View all
                        <ChevronRight className="w-3 h-3" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {connectedUsers.length > 0 ? (
                        <div className="flex -space-x-2 mb-3">
                          {connectedUsers.slice(0, 4).map((c) => (
                            <Avatar
                              key={c.id}
                              className="h-8 w-8 border-2 border-white dark:border-gray-800"
                            >
                              <AvatarFallback className="text-xs bg-gradient-to-br from-gray-400 to-gray-500 text-white">
                                {getInitials(c.name)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {connectedUsers.length > 4 && (
                            <div className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-semibold text-gray-600 dark:text-gray-300">
                              +{connectedUsers.length - 4}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-500 dark:text-gray-400">
                          <Users className="w-4 h-4" /> No connections yet
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenConnectionsModal('CONNECTED')}
                        className="text-sm text-gray-900 dark:text-gray-100 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                      >
                        {connectionStats.connected} connections
                      </button>

                      {connectionStats.incoming > 0 && (
                        <button
                          type="button"
                          onClick={() => handleOpenConnectionsModal('REQUESTS')}
                          className="mt-1.5 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
                        >
                          <UserPlus className="w-3 h-3" />
                          {connectionStats.incoming} pending request
                          {connectionStats.incoming === 1 ? '' : 's'}
                        </button>
                      )}

                      {connectionStats.outgoing > 0 && (
                        <button
                          type="button"
                          onClick={() => handleOpenConnectionsModal('SENT')}
                          className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:underline"
                        >
                          <Send className="w-3 h-3" />
                          {connectionStats.outgoing} sent request
                          {connectionStats.outgoing === 1 ? '' : 's'} pending
                        </button>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Main column */}
                <div className="lg:col-span-2 space-y-6">
                  <Card id="streaks" className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 scroll-mt-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base dark:text-gray-200 flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500" /> Subject Streaks
                      </CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        Consistency tracked per subject and goal
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {subjectStreaks.map(s => (
                          <div
                            key={s.subject}
                            className="p-3 rounded-lg border border-gray-100 dark:border-gray-700"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {s.subject}
                              </span>
                              <span
                                className="flex items-center gap-1 text-sm font-semibold"
                                style={{ color: s.color }}
                              >
                                <Flame className="w-3.5 h-3.5" /> {s.currentStreak}d
                              </span>
                            </div>
                            <Progress
                              value={Math.min((s.currentStreak / s.bestStreak) * 100, 100)}
                              className="h-1.5 mb-2"
                            />
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>Best: {s.bestStreak}d</span>
                              <span>{s.hoursLogged}h logged</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card id="activity" className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 scroll-mt-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base dark:text-gray-200 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-gray-400" /> Activity
                      </CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        Last 12 weeks of study activity
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <div className="grid grid-flow-col grid-rows-7 gap-1 w-max">
                          {heatmap.map(day => (
                            <div
                              key={day.date}
                              className={`w-3 h-3 rounded-sm ${HEATMAP_COLORS[day.intensity]}`}
                              title={day.date}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-1.5 mt-3 text-xs text-gray-400 dark:text-gray-500">
                        <span>Less</span>
                        {HEATMAP_COLORS.map((c, i) => (
                          <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
                        ))}
                        <span>More</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card id="achievements" className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 scroll-mt-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base dark:text-gray-200 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500" /> Achievements
                      </CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        {achievements.filter(a => a.unlocked).length} of {achievements.length}{' '}
                        unlocked
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {achievements.map(a => {
                          const Icon = a.icon
                          return (
                            <button
                              key={a.id}
                              onClick={() => setShowAchievementDetails(a)}
                              className={`text-left p-3 rounded-lg border transition-all ${
                                a.unlocked
                                  ? 'border-blue-200 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-900/10 hover:shadow-md'
                                  : 'border-gray-100 dark:border-gray-700 opacity-60 hover:opacity-90'
                              }`}
                            >
                              <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${
                                  a.unlocked
                                    ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                                    : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                              >
                                <Icon
                                  className={`w-4 h-4 ${
                                    a.unlocked ? 'text-white' : 'text-gray-400 dark:text-gray-500'
                                  }`}
                                />
                              </div>
                              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                                {a.title}
                              </p>
                              <Badge
                                className={`${getRarityColor(a.rarity)} text-[10px] px-1.5 py-0 mt-1`}
                              >
                                {a.rarity}
                              </Badge>
                            </button>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card id="posts" className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 scroll-mt-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base dark:text-gray-200">Posts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-700 space-y-3">
                        <Textarea
                          placeholder="Share an update, milestone, or achievement..."
                          value={newPostContent}
                          onChange={e => setNewPostContent(e.target.value)}
                          className="dark:bg-gray-700 dark:border-gray-600 resize-none"
                          rows={2}
                        />

                        {newPostImages.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {newPostImages.map(img => (
                              <div
                                key={img.id}
                                className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={img.url}
                                  alt="Post attachment"
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemovePostImage(img.id)}
                                  className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                  aria-label="Remove image"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {uploadingPostImage && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1.5">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Uploading images...
                              </span>
                              <span>{postUploadProgress}%</span>
                            </div>
                            <Progress value={postUploadProgress} className="h-1.5" />
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Select
                              value={newPostType}
                              onValueChange={(v: any) => setNewPostType(v)}
                            >
                              <SelectTrigger className="w-40 h-8 text-xs dark:bg-gray-700 dark:border-gray-600">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                                <SelectItem value="GENERAL">General Update</SelectItem>
                                <SelectItem value="ACHIEVEMENT">Achievement</SelectItem>
                                <SelectItem value="MILESTONE">Milestone</SelectItem>
                                <SelectItem value="JOURNEY">Journey</SelectItem>
                              </SelectContent>
                            </Select>

                            <input
                              ref={postImageInputRef}
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={handlePostImagePick}
                            />

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => postImageInputRef.current?.click()}
                              disabled={uploadingPostImage || newPostImages.length >= 5}
                              className="h-8 gap-1.5 text-xs"
                            >
                              {uploadingPostImage ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <ImageIcon className="w-3.5 h-3.5" />
                              )}
                              Photo
                              {newPostImages.length > 0 && (
                                <span className="text-muted-foreground">
                                  ({newPostImages.length}/5)
                                </span>
                              )}
                            </Button>
                          </div>

                          <Button
                            size="sm"
                            onClick={handleCreatePost}
                            disabled={
                              uploadingPostImage ||
                              (!newPostContent.trim() && newPostImages.length === 0)
                            }
                          >
                            Post
                          </Button>
                        </div>
                      </div>

                      {posts.map(post => {
                        const meta = POST_TYPE_META[post.type]
                        const Icon = meta.icon
                        return (
                          <div
                            key={post.id}
                            className="group p-4 rounded-lg border border-gray-100 dark:border-gray-700"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (profile.avatarUrl) setLightboxUrl(profile.avatarUrl)
                                  }}
                                  className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-500 cursor-zoom-in"
                                  aria-label="View profile picture"
                                >
                                  {profile.avatarUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={profile.avatarUrl}
                                      alt={profile.name || 'User'}
                                      className="absolute inset-0 w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white">
                                      {getInitials(profile.name)}
                                    </span>
                                  )}
                                </button>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {profile.name || 'User'}
                                  </p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500">
                                    {timeAgo(post.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={`${meta.badge} text-[10px] gap-1`}>
                                  <Icon className="w-3 h-3" /> {meta.label}
                                </Badge>
                                <button
                                  onClick={() => handleDeletePost(post.id)}
                                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                                  aria-label="Delete post"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {post.content && (
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {post.content}
                              </p>
                            )}

                            {post.images?.length > 0 && (
                              <div
                                className={`mt-3 grid gap-1 rounded-lg overflow-hidden ${
                                  post.images.length === 1
                                    ? 'grid-cols-1'
                                    : post.images.length === 2
                                      ? 'grid-cols-2'
                                      : 'grid-cols-2 sm:grid-cols-3'
                                }`}
                              >
                                {post.images.map((img) => (
                                  <button
                                    type="button"
                                    key={img.id}
                                    onClick={() => setLightboxUrl(img.url)}
                                    className={`relative bg-gray-100 dark:bg-gray-700 overflow-hidden cursor-zoom-in ${
                                      post.images.length === 1
                                        ? 'aspect-[4/3]'
                                        : 'aspect-square'
                                    }`}
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={img.url}
                                      alt="Post attachment"
                                      loading="lazy"
                                      className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                    />
                                  </button>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                              <button
                                onClick={() => handleReactToPost(post.id)}
                                className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              >
                                <ThumbsUp className="w-3.5 h-3.5" /> {post.reactionsCount}
                              </button>
                              <span>{post.commentsCount} comments</span>
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ==================== Edit Profile Dialog ==================== */}
      <Dialog
        open={showEditProfile}
        onOpenChange={(open) => {
          if (!open) handleCloseEditProfile()
        }}
      >
        <DialogContent className="sm:max-w-3xl bg-white dark:bg-gray-800 max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2 dark:text-gray-200">
              <Edit className="w-5 h-5" /> Edit Profile
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Update your personal info, photos, education, experience and links
            </DialogDescription>
          </DialogHeader>

          {editForm && (
            <div className="flex-1 overflow-y-auto space-y-6 py-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {/* ============ PHOTOS ============ */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Photos
                  </h3>
                  {(pendingAvatar || pendingCover) && (
                    <Badge
                      variant="outline"
                      className="text-[10px] border-amber-300 text-amber-700 dark:border-amber-700/60 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
                    >
                      Uploads on save
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Photos are uploaded when you click <strong>Save Changes</strong>.
                  Until then, you can preview and change them freely.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label>Avatar</Label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-500">
                        {editForm.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={editForm.avatarUrl}
                            alt="Avatar preview"
                            className="absolute inset-0 w-full h-full object-cover object-center"
                          />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-white font-semibold">
                            {getInitials(editForm.name || 'User')}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarPick}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => avatarInputRef.current?.click()}
                          className="gap-2"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          {pendingAvatar ? 'Change Avatar' : 'Choose Avatar'}
                        </Button>

                        {editForm.avatarUrl && (
                          <button
                            type="button"
                            onClick={handleRemovePendingAvatar}
                            className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Cover Photo</Label>
                    <div className="relative w-full h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-500 to-purple-500">
                      {editForm.coverPhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={editForm.coverPhoto}
                          alt="Cover preview"
                          className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white/80 text-xs">
                          No cover photo
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverPick}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => coverInputRef.current?.click()}
                        className="gap-2"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        {pendingCover ? 'Change Cover' : 'Choose Cover'}
                      </Button>

                      {editForm.coverPhoto && (
                        <button
                          type="button"
                          onClick={handleRemovePendingCover}
                          className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <details className="mt-4">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                    Or paste image URLs directly
                  </summary>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="avatarUrl" className="text-xs">
                        Avatar URL
                      </Label>
                      <Input
                        id="avatarUrl"
                        placeholder="https://..."
                        value={
                          editForm.avatarUrl.startsWith('blob:') ? '' : editForm.avatarUrl
                        }
                        onChange={e => setEditForm({ ...editForm, avatarUrl: e.target.value })}
                        className="dark:bg-gray-700 dark:border-gray-600 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="coverPhoto" className="text-xs">
                        Cover Photo URL
                      </Label>
                      <Input
                        id="coverPhoto"
                        placeholder="https://..."
                        value={
                          editForm.coverPhoto.startsWith('blob:') ? '' : editForm.coverPhoto
                        }
                        onChange={e => setEditForm({ ...editForm, coverPhoto: e.target.value })}
                        className="dark:bg-gray-700 dark:border-gray-600 text-xs"
                      />
                    </div>
                  </div>
                </details>
              </div>

              {/* ============ Basic Info ============ */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Basic Info
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        className="dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="userName">Username</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="userName"
                          value={editForm.userName}
                          readOnly={!isUserNameEditable}
                          onChange={e => setEditForm({ ...editForm, userName: e.target.value })}
                          className={`dark:bg-gray-700 dark:border-gray-600 ${!isUserNameEditable ? 'bg-gray-50 dark:bg-gray-800 text-gray-500 cursor-not-allowed' : ''}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (isUserNameEditable) {
                              // revert on cancel
                              setEditForm(prev => prev ? { ...prev, userName: originalUserNameRef.current } : prev)
                            }
                            setIsUserNameEditable(prev => !prev)
                          }}
                          className="flex-shrink-0 h-9 px-3 text-xs gap-1.5"
                        >
                          {isUserNameEditable ? (
                            <>
                              <X className="w-3.5 h-3.5" />
                              Cancel
                            </>
                          ) : (
                            <>
                              <Edit className="w-3.5 h-3.5" />
                              Change
                            </>
                          )}
                        </Button>
                      </div>
                      {!isUserNameEditable && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Click <strong>Change</strong> to edit your username
                        </p>
                      )}
                      {isUserNameEditable && (
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          ⚠️ Changing your username will update your public profile URL
                        </p>
                      )}
                      {editForm.userName && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Your profile will be at{' '}
                          <span className="font-mono">
                            /u/{editForm.userName}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      rows={3}
                      value={editForm.bio}
                      onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="profession">Profession</Label>
                      <Input
                        id="profession"
                        value={editForm.profession}
                        onChange={e => setEditForm({ ...editForm, profession: e.target.value })}
                        className="dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={editForm.dob}
                        onChange={e => setEditForm({ ...editForm, dob: e.target.value })}
                        className="dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ============ Location ============ */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Location
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={editForm.city}
                      onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={editForm.state}
                      onChange={e => setEditForm({ ...editForm, state: e.target.value })}
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={editForm.country}
                      onChange={e => setEditForm({ ...editForm, country: e.target.value })}
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* ============ Skills ============ */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Skills & Interests
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fields">
                      Fields <span className="text-gray-400 font-normal">(comma-separated)</span>
                    </Label>
                    <Input
                      id="fields"
                      value={editForm.fields}
                      onChange={e => setEditForm({ ...editForm, fields: e.target.value })}
                      placeholder="e.g. Software Development, AI"
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="subFields">
                      Specializations{' '}
                      <span className="text-gray-400 font-normal">(comma-separated)</span>
                    </Label>
                    <Input
                      id="subFields"
                      value={editForm.subFields}
                      onChange={e => setEditForm({ ...editForm, subFields: e.target.value })}
                      placeholder="e.g. Backend Development, DSA"
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="hobbies">
                      Interests / Hobbies{' '}
                      <span className="text-gray-400 font-normal">(comma-separated)</span>
                    </Label>
                    <Input
                      id="hobbies"
                      value={editForm.hobbies}
                      onChange={e => setEditForm({ ...editForm, hobbies: e.target.value })}
                      placeholder="e.g. Chess, Blogging"
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* ============ EDUCATION ============ */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Education
                    </h3>
                    {editEducation.length > 0 && (
                      <Badge variant="outline" className="text-[10px]">
                        {editEducation.length}
                      </Badge>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleStartAddEducation}
                    className="h-8 text-xs gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Education
                  </Button>
                </div>

                {editEducation.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {editEducation.map((edu) => (
                      <div
                        key={edu.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white flex-shrink-0">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {edu.degree}
                            {edu.field ? ` · ${edu.field}` : ''}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {edu.institution}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {edu.startYear || '—'} – {edu.isCurrent ? 'Present' : edu.endYear || '—'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditEducation(edu)}
                            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-md transition-colors"
                            aria-label="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveEducation(edu.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
                            aria-label="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {editEducation.length === 0 && !showAddEducationForm && (
                  <div className="text-center py-4 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No education added yet
                    </p>
                  </div>
                )}

                {showAddEducationForm && (
                  <div className="rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                        {editingEducationId ? 'Edit Education' : 'New Education'}
                      </p>
                      <button
                        type="button"
                        onClick={handleCancelEducationForm}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label className="text-xs">Institution *</Label>
                        <Input
                          placeholder="e.g. Amity University"
                          value={educationForm.institution}
                          onChange={(e) =>
                            setEducationForm({ ...educationForm, institution: e.target.value })
                          }
                          className="h-9 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Degree *</Label>
                        <Input
                          placeholder="e.g. MCA"
                          value={educationForm.degree}
                          onChange={(e) =>
                            setEducationForm({ ...educationForm, degree: e.target.value })
                          }
                          className="h-9 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Field of Study</Label>
                        <Input
                          placeholder="e.g. Computer Applications"
                          value={educationForm.field}
                          onChange={(e) =>
                            setEducationForm({ ...educationForm, field: e.target.value })
                          }
                          className="h-9 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Grade</Label>
                        <Input
                          placeholder="e.g. 8.7 CGPA"
                          value={educationForm.grade}
                          onChange={(e) =>
                            setEducationForm({ ...educationForm, grade: e.target.value })
                          }
                          className="h-9 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Location</Label>
                        <Input
                          placeholder="e.g. Mumbai, India"
                          value={educationForm.location}
                          onChange={(e) =>
                            setEducationForm({ ...educationForm, location: e.target.value })
                          }
                          className="h-9 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Start Year</Label>
                        <Input
                          placeholder="2023"
                          value={educationForm.startYear}
                          onChange={(e) =>
                            setEducationForm({ ...educationForm, startYear: e.target.value })
                          }
                          className="h-9 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">End Year</Label>
                        <Input
                          placeholder="2025"
                          value={educationForm.endYear}
                          onChange={(e) =>
                            setEducationForm({ ...educationForm, endYear: e.target.value })
                          }
                          disabled={educationForm.isCurrent}
                          className="h-9 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                        />
                      </div>
                      <div className="sm:col-span-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="edu-is-current"
                          checked={educationForm.isCurrent}
                          onChange={(e) =>
                            setEducationForm({ ...educationForm, isCurrent: e.target.checked })
                          }
                          className="w-4 h-4 rounded"
                        />
                        <Label htmlFor="edu-is-current" className="text-xs cursor-pointer">
                          I&apos;m currently studying here
                        </Label>
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label className="text-xs">Description</Label>
                        <Textarea
                          rows={2}
                          placeholder="Specialized in AI, distributed systems..."
                          value={educationForm.description}
                          onChange={(e) =>
                            setEducationForm({ ...educationForm, description: e.target.value })
                          }
                          className="dark:bg-gray-700 dark:border-gray-600 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label className="text-xs">Activities & Societies</Label>
                        <Input
                          placeholder="Coding Club, Robotics Society..."
                          value={educationForm.activities}
                          onChange={(e) =>
                            setEducationForm({ ...educationForm, activities: e.target.value })
                          }
                          className="h-9 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEducationForm}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleCommitEducationForm}
                      >
                        {editingEducationId ? 'Update' : 'Add'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* ============ EXPERIENCE ============ */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Experience
                    </h3>
                    {editExperience.length > 0 && (
                      <Badge variant="outline" className="text-[10px]">
                        {editExperience.length}
                      </Badge>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleStartAddExperience}
                    className="h-8 text-xs gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Experience
                  </Button>
                </div>

                {editExperience.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {editExperience.map((exp) => (
                      <div
                        key={exp.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white flex-shrink-0">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {exp.role}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {exp.organization}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {exp.startDate || '—'} – {exp.isCurrent ? 'Present' : exp.endDate || '—'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditExperience(exp)}
                            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-md transition-colors"
                            aria-label="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveExperience(exp.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
                            aria-label="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {editExperience.length === 0 && !showAddExperienceForm && (
                  <div className="text-center py-4 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No experience added yet
                    </p>
                  </div>
                )}

                {showAddExperienceForm && (
                  <div className="rounded-lg border-2 border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-950/20 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-purple-900 dark:text-purple-100">
                        {editingExperienceId ? 'Edit Experience' : 'New Experience'}
                      </p>
                      <button
                        type="button"
                        onClick={handleCancelExperienceForm}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Role *</Label>
                        <Input
                          placeholder="e.g. Software Development Intern"
                          value={experienceForm.role}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, role: e.target.value })
                          }
                          className="h-9 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Organization *</Label>
                        <Input
                          placeholder="e.g. TechStart Solutions"
                          value={experienceForm.organization}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, organization: e.target.value })
                          }
                          className="h-9 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Employment Type</Label>
                        <Select
                          value={experienceForm.employmentType}
                          onValueChange={(v: any) =>
                            setExperienceForm({ ...experienceForm, employmentType: v })
                          }
                        >
                          <SelectTrigger className="h-9 dark:bg-gray-700 dark:border-gray-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                            {(Object.keys(EMPLOYMENT_TYPE_LABELS) as EmploymentType[]).map((t) => (
                              <SelectItem key={t} value={t}>
                                {EMPLOYMENT_TYPE_LABELS[t]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Location Type</Label>
                        <Select
                          value={experienceForm.locationType}
                          onValueChange={(v: any) =>
                            setExperienceForm({ ...experienceForm, locationType: v })
                          }
                        >
                          <SelectTrigger className="h-9 dark:bg-gray-700 dark:border-gray-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                            {(Object.keys(LOCATION_TYPE_LABELS) as LocationType[]).map((t) => (
                              <SelectItem key={t} value={t}>
                                {LOCATION_TYPE_LABELS[t]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Start Date</Label>
                        <Input
                          placeholder="Jun 2025"
                          value={experienceForm.startDate}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, startDate: e.target.value })
                          }
                          className="h-9 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">End Date</Label>
                        <Input
                          placeholder="Aug 2025"
                          value={experienceForm.endDate}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, endDate: e.target.value })
                          }
                          disabled={experienceForm.isCurrent}
                          className="h-9 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                        />
                      </div>
                      <div className="sm:col-span-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="exp-is-current"
                          checked={experienceForm.isCurrent}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, isCurrent: e.target.checked })
                          }
                          className="w-4 h-4 rounded"
                        />
                        <Label htmlFor="exp-is-current" className="text-xs cursor-pointer">
                          I currently work here
                        </Label>
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label className="text-xs">Location</Label>
                        <Input
                          placeholder="e.g. Mumbai, India"
                          value={experienceForm.location}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, location: e.target.value })
                          }
                          className="h-9 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label className="text-xs">Description</Label>
                        <Textarea
                          rows={3}
                          placeholder="Built internal tooling with Next.js and Node.js..."
                          value={experienceForm.description}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, description: e.target.value })
                          }
                          className="dark:bg-gray-700 dark:border-gray-600 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label className="text-xs">
                          Skills{' '}
                          <span className="text-gray-400 font-normal">(comma-separated)</span>
                        </Label>
                        <Input
                          placeholder="React, Node.js, PostgreSQL"
                          value={experienceForm.skills}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, skills: e.target.value })
                          }
                          className="h-9 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Company URL</Label>
                        <Input
                          placeholder="https://..."
                          value={experienceForm.companyUrl}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, companyUrl: e.target.value })
                          }
                          className="h-9 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Company Logo URL</Label>
                        <Input
                          placeholder="https://..."
                          value={experienceForm.companyLogo}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, companyLogo: e.target.value })
                          }
                          className="h-9 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCancelExperienceForm}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleCommitExperienceForm}
                      >
                        {editingExperienceId ? 'Update' : 'Add'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* ============ Social Links ============ */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Social Links
                    </h3>
                    {editSocialLinks.length > 0 && (
                      <Badge variant="outline" className="text-[10px]">
                        {editSocialLinks.length}
                      </Badge>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSocialLink}
                    className="h-8 text-xs gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Link
                  </Button>
                </div>

                {editSocialLinks.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <LinkIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      No links added yet
                    </p>
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={handleAddSocialLink}
                      className="gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add your first link
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {editSocialLinks.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-900/40"
                      >
                        <Select
                          value={link.platform}
                          onValueChange={(v: any) =>
                            handleUpdateSocialLink(link.id, { platform: v })
                          }
                        >
                          <SelectTrigger className="w-32 flex-shrink-0 h-9 dark:bg-gray-700 dark:border-gray-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                            {(Object.keys(SOCIAL_PLATFORM_META) as SocialPlatform[]).map((p) => (
                              <SelectItem key={p} value={p}>
                                {SOCIAL_PLATFORM_META[p].label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          value={link.url}
                          onChange={(e) =>
                            handleUpdateSocialLink(link.id, { url: e.target.value })
                          }
                          placeholder="https://..."
                          className="flex-1 h-9 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSocialLink(link.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors flex-shrink-0"
                          aria-label="Remove link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleAddSocialLink}
                      className="w-full mt-2 gap-1.5 border border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-600 text-gray-600 dark:text-gray-400"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add another link
                    </Button>
                  </div>
                )}
              </div>

              {/* ============ Privacy ============ */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Privacy
                </h3>
                <div className="space-y-1.5">
                  <Label htmlFor="visibility">Profile Visibility</Label>
                  <Select
                    value={editForm.profileVisibility}
                    onValueChange={(v: any) =>
                      setEditForm({ ...editForm, profileVisibility: v })
                    }
                  >
                    <SelectTrigger id="visibility" className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="PUBLIC">Public — anyone can view</SelectItem>
                      <SelectItem value="FRIENDS_ONLY">Connections only</SelectItem>
                      <SelectItem value="PRIVATE">Private — only you</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={handleCloseEditProfile}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== 🔥 NEW: Connections Dialog ==================== */}
      <Dialog
        open={showConnectionsModal}
        onOpenChange={(open) => {
          if (!open) setShowConnectionsModal(false)
        }}
      >
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-gray-800 max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2 dark:text-gray-200">
              <Users className="w-5 h-5 text-blue-500" />
              Connections
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Manage your network — connections, incoming requests, and pending invites
            </DialogDescription>
          </DialogHeader>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 dark:border-gray-700">
            {[
              { label: 'Connections', value: connectionStats.connected, icon: UserCheck, color: 'text-green-600 dark:text-green-400' },
              { label: 'Requests', value: connectionStats.incoming, icon: UserPlus, color: 'text-blue-600 dark:text-blue-400' },
              { label: 'Sent', value: connectionStats.outgoing, icon: Send, color: 'text-amber-600 dark:text-amber-400' },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center py-2 rounded-lg bg-gray-50 dark:bg-gray-900/40"
              >
                <s.icon className={`w-4 h-4 mb-1 ${s.color}`} />
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {s.value}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-900/60 flex-shrink-0">
            {([
              { key: 'CONNECTED' as ConnectionsTab, label: 'My Connections', icon: UserCheck, count: connectionStats.connected },
              { key: 'REQUESTS' as ConnectionsTab, label: 'Requests', icon: UserPlus, count: connectionStats.incoming },
              { key: 'SENT' as ConnectionsTab, label: 'Sent', icon: Send, count: connectionStats.outgoing },
            ]).map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setConnectionsTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  connectionsTab === t.key
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.label.split(' ')[0]}</span>
                {t.count > 0 && (
                  <Badge
                    variant="outline"
                    className={`text-[9px] px-1 py-0 ${
                      connectionsTab === t.key
                        ? 'border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-400'
                        : ''
                    }`}
                  >
                    {t.count}
                  </Badge>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <Input
              value={connectionsSearch}
              onChange={(e) => setConnectionsSearch(e.target.value)}
              placeholder="Search by name, role, company..."
              className="pl-9 h-9 text-sm dark:bg-gray-700 dark:border-gray-600"
            />
            {connectionsSearch && (
              <button
                type="button"
                onClick={() => setConnectionsSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Clear search"
              >
                <X className="w-3 h-3 text-gray-400" />
              </button>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto -mx-1 px-1 space-y-2">
            {filteredConnectionList.length === 0 && (
              <div className="py-12 flex flex-col items-center text-center">
                {connectionsTab === 'CONNECTED' && (
                  <>
                    <Users className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {connectionsSearch ? 'No connections match your search' : 'No connections yet'}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {connectionsSearch
                        ? 'Try a different search term.'
                        : 'Start connecting with people to grow your network.'}
                    </p>
                  </>
                )}
                {connectionsTab === 'REQUESTS' && (
                  <>
                    <UserPlus className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {connectionsSearch ? 'No requests match your search' : 'No pending requests'}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {connectionsSearch
                        ? 'Try a different search term.'
                        : 'When someone sends you a request, it will appear here.'}
                    </p>
                  </>
                )}
                {connectionsTab === 'SENT' && (
                  <>
                    <Send className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {connectionsSearch ? 'No sent requests match your search' : 'No pending sent requests'}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {connectionsSearch
                        ? 'Try a different search term.'
                        : 'Requests you send will appear here until accepted.'}
                    </p>
                  </>
                )}
              </div>
            )}

            {filteredConnectionList.map((c) => (
              <div
                key={c.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 transition-colors"
              >
                <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                  {c.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.avatarUrl}
                      alt={c.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(c.name)
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {c.name}
                    </p>
                    {c.isVerified && (
                      <CheckCircle2
                        className="w-3.5 h-3.5 text-blue-500 flex-shrink-0"
                        aria-label="Verified"
                      />
                    )}
                    {connectionsTab === 'SENT' && (
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1.5 py-0 border-amber-300 text-amber-700 dark:border-amber-800 dark:text-amber-400"
                      >
                        <Clock className="w-2.5 h-2.5 mr-0.5" />
                        Pending
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 truncate">
                    {c.headline}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 dark:text-gray-500 flex-wrap">
                    {c.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        {c.location}
                      </span>
                    )}
                    {c.mutualConnections > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="w-2.5 h-2.5" />
                        {c.mutualConnections} mutual
                      </span>
                    )}
                  </div>

                  {connectionsTab === 'REQUESTS' && c.message && (
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 italic line-clamp-2 bg-gray-50 dark:bg-gray-900/40 rounded px-2 py-1">
                      &ldquo;{c.message}&rdquo;
                    </p>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 mt-2">
                    {connectionsTab === 'CONNECTED' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMessageConnection(c.name)}
                          className="h-7 text-xs gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          Message
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              aria-label="More options"
                            >
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                          >
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/u/${c.userName}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <UserCircle2 className="w-3.5 h-3.5" />
                                View Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleRemoveConnection(c.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <UserX className="w-3.5 h-3.5 mr-2" />
                              Remove Connection
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}

                    {connectionsTab === 'REQUESTS' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleAcceptConnection(c.id)}
                          className="h-7 text-xs gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <UserCheck className="w-3 h-3" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeclineConnection(c.id)}
                          className="h-7 text-xs gap-1"
                        >
                          <UserX className="w-3 h-3" />
                          Decline
                        </Button>
                      </>
                    )}

                    {connectionsTab === 'SENT' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWithdrawRequest(c.id)}
                          className="h-7 text-xs gap-1 text-red-600 hover:text-red-700 dark:text-red-400"
                        >
                          <X className="w-3 h-3" />
                          Withdraw
                        </Button>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                          Sent {timeAgo(c.requestedAt)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="flex-shrink-0 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
              <Lock className="w-3 h-3" />
              Your connection activity is private
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowConnectionsModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== Who Viewed Your Profile Dialog ==================== */}
      <Dialog
        open={showViewersModal}
        onOpenChange={(open) => {
          if (!open) setShowViewersModal(false)
        }}
      >
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-gray-800 max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2 dark:text-gray-200">
              <Eye className="w-5 h-5 text-blue-500" />
              Who Viewed Your Profile
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              {TOTAL_PROFILE_VIEWS.toLocaleString()} total views · {WEEKLY_PROFILE_VIEWS} this week ·{' '}
              <span className="text-green-600 dark:text-green-400 font-medium">
                +{VIEWS_GROWTH_PERCENT}% vs last week
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 dark:border-gray-700">
            {[
              { label: 'Today', value: viewerStats.today, icon: Clock },
              { label: 'This Week', value: viewerStats.week, icon: CalendarDays },
              { label: 'This Month', value: viewerStats.month, icon: TrendingUp },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center py-2 rounded-lg bg-gray-50 dark:bg-gray-900/40"
              >
                <s.icon className="w-4 h-4 text-gray-400 mb-1" />
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {s.value}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 py-2 flex-shrink-0">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-900/60">
              {(['ALL', 'TODAY', 'WEEK', 'MONTH'] as ViewerFilter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setViewerFilter(f)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    viewerFilter === f
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {f === 'ALL' ? 'All' : f === 'TODAY' ? 'Today' : f === 'WEEK' ? 'Week' : 'Month'}
                </button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleViewersPrivacy}
              className="gap-1.5 text-xs"
              title={viewersPrivateMode ? 'Show all viewers' : 'Enable private view mode'}
            >
              {viewersPrivateMode ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" /> Private
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" /> All
                </>
              )}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto -mx-1 px-1 space-y-2">
            {visibleViewers.length === 0 && (
              <div className="py-12 flex flex-col items-center text-center">
                <EyeOff className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  No viewers in this range
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Check back later or try a different filter.
                </p>
              </div>
            )}

            {visibleViewers.map((viewer) => (
              <div
                key={viewer.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 transition-colors"
              >
                <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                  {viewer.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={viewer.avatarUrl}
                      alt={viewer.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(viewer.name)
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {viewer.name}
                    </p>
                    {viewer.isVerified && (
                      <CheckCircle2
                        className="w-3.5 h-3.5 text-blue-500 flex-shrink-0"
                        aria-label="Verified"
                      />
                    )}
                    {viewer.isConnection && (
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1.5 py-0 border-green-300 text-green-700 dark:border-green-800 dark:text-green-400"
                      >
                        <Users className="w-2.5 h-2.5 mr-0.5" />
                        1st
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 truncate">
                    {viewer.headline}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 dark:text-gray-500">
                    {viewer.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        {viewer.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                    {timeAgo(viewer.viewedAt)}
                  </span>
                  {viewer.viewCount > 1 && (
                    <Badge
                      variant="outline"
                      className="text-[9px] px-1.5 py-0 text-gray-500 dark:text-gray-400"
                    >
                      Viewed {viewer.viewCount}×
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {viewersPrivateMode && filteredViewers.length > FREE_VIEWER_LIMIT && (
            <div className="flex-shrink-0 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="rounded-lg border border-amber-200 dark:border-amber-800/60 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 p-3 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <Crown className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                    See all {filteredViewers.length} viewers
                  </p>
                  <p className="text-xs text-amber-800/80 dark:text-amber-200/80 mt-0.5">
                    You&apos;re viewing the latest {FREE_VIEWER_LIMIT}. Toggle to{' '}
                    <button
                      type="button"
                      onClick={handleToggleViewersPrivacy}
                      className="underline font-medium hover:no-underline"
                    >
                      All
                    </button>{' '}
                    to see everyone.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={handleToggleViewersPrivacy}
                  className="bg-amber-600 hover:bg-amber-700 text-white flex-shrink-0 h-8 text-xs"
                >
                  Unlock
                </Button>
              </div>
            </div>
          )}

          <DialogFooter className="flex-shrink-0 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
              <Lock className="w-3 h-3" />
              Your viewers are only visible to you
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowViewersModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== Achievement Details Dialog ==================== */}
      <Dialog
        open={!!showAchievementDetails}
        onOpenChange={() => setShowAchievementDetails(null)}
      >
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          {showAchievementDetails &&
            (() => {
              const details = showAchievementDetails
              const Icon = details.icon
              return (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 dark:text-gray-200">
                      <Icon className="w-5 h-5" /> {details.title}
                    </DialogTitle>
                    <DialogDescription className="dark:text-gray-400">
                      {details.description}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <span className="text-sm font-medium dark:text-gray-300">Status</span>
                      <Badge
                        className={
                          details.unlocked
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }
                      >
                        {details.unlocked ? 'Unlocked' : 'Locked'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <span className="text-sm font-medium dark:text-gray-300">Rarity</span>
                      <Badge className={getRarityColor(details.rarity)}>{details.rarity}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <span className="text-sm font-medium dark:text-gray-300">Category</span>
                      <Badge variant="outline">{details.category}</Badge>
                    </div>
                    {details.progress !== undefined && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium dark:text-gray-300">Progress</span>
                          <span>{details.progress}/10</span>
                        </div>
                        <Progress value={(details.progress / 10) * 100} className="h-2" />
                      </div>
                    )}
                  </div>
                </>
              )
            })()}
        </DialogContent>
      </Dialog>

      {/* ==================== Share Modal ==================== */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 dark:text-gray-200">
              <Share2 className="w-5 h-5" /> Share Your Profile
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Anyone with this link can view your public profile
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
              <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-700 dark:text-gray-300 truncate flex-1 font-mono">
                {publicProfileUrl || 'No username set'}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyProfileLink}
                disabled={!publicProfileUrl}
                className="flex-shrink-0 gap-1.5"
              >
                {copiedProfileLink ? (
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

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button
                variant="outline"
                onClick={handleNativeShare}
                className="w-full justify-start gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share via device
              </Button>
            )}

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={handleShareToTwitter}
                disabled={!publicProfileUrl}
                className="gap-2 justify-center"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={handleShareToLinkedIn}
                disabled={!publicProfileUrl}
                className="gap-2 justify-center"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                onClick={handleShareToWhatsApp}
                disabled={!publicProfileUrl}
                className="gap-2 justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
            </div>

            {publicProfileUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  window.open(publicProfileUrl, '_blank', 'noopener,noreferrer')
                  setShowShareModal(false)
                }}
                className="w-full text-xs gap-1.5 text-blue-600 dark:text-blue-400"
              >
                Preview public profile
                <ArrowLeft className="w-3 h-3 rotate-180" />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ==================== Lightbox ==================== */}
      <Dialog
        open={!!lightboxUrl}
        onOpenChange={(open) => {
          if (!open) setLightboxUrl(null)
        }}
      >
        <DialogContent className="max-w-4xl w-[92vw] bg-black/95 border-none p-2 sm:p-4">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          <DialogDescription className="sr-only">
            Full size preview of the selected image.
          </DialogDescription>

          {lightboxUrl && (
            <div className="relative w-full h-[80vh] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxUrl}
                alt="Preview"
                className="max-w-full max-h-full object-contain select-none"
                draggable={false}
              />
              <button
                type="button"
                onClick={() => setLightboxUrl(null)}
                className="absolute top-2 right-2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ============================================================================
   SKELETON
   ============================================================================ */

function ProfileSkeleton() {
  return (
    <div className="relative -mt-14 sm:-mt-16 mb-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
        <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-900 flex-shrink-0" />
        <div className="flex-1 space-y-3 pb-2">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="h-16 rounded-xl bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
    </div>
  )
}