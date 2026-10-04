// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server'

/* ============================================================================
   PUBLIC ROUTES — accessible without login
   ============================================================================ */
const PUBLIC_PATHS = [
  '/',              // landing
  '/feed',          // 🔥 public feed (read-only for guests)
  '/explore',
  '/about',
  '/pricing',
  '/contact',
  '/privacy',
  '/terms',
]

const PUBLIC_PREFIXES = [
  '/auth',          // /auth/login, /auth/signup, /auth/verify-email, etc.
  '/u/',            // /u/:username — public profile page
  '/posts/',        // /posts/:id — public post page (if any)
  '/_next',         // Next.js internals (safety net — usually excluded by matcher)
  '/api',           // API routes (handled separately by their own auth)
  '/static',
  '/images',
  '/fonts',
]

/* ============================================================================
   PROTECTED ROUTES — require login
   ============================================================================ */
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/timetable',
  '/goals',
  '/tasks',
  '/sleep-schedule',
  '/fixed-times',
  '/analytics',
  '/notifications',
  '/admin',
]

/* ============================================================================
   HELPERS
   ============================================================================ */
function isPublicPath(pathname: string): boolean {
  // exact match
  if (PUBLIC_PATHS.includes(pathname)) return true

  // prefix match (e.g. /u/arbaaz, /auth/login, /posts/abc123)
  for (const prefix of PUBLIC_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix)) return true
  }
  return false
}

function isProtectedPath(pathname: string): boolean {
  for (const prefix of PROTECTED_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) return true
  }
  return false
}

function hasAuthToken(req: NextRequest): boolean {
  // 🔥 Adjust this to match how you actually store the token.
  // Common patterns:
  //   - localStorage  → NOT visible to middleware (browser-only). If you use localStorage,
  //                     middleware CANNOT see it, and you must use a cookie instead.
  //   - cookie        → req.cookies.get('access_token')?.value
  //
  // Below handles the cookie case, which is what middleware must rely on:
  const cookieToken =
    req.cookies.get('access_token')?.value ||
    req.cookies.get('token')?.value ||
    req.cookies.get('auth_token')?.value

  return Boolean(cookieToken)
}

/* ============================================================================
   MIDDLEWARE
   ============================================================================ */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  // 1) Always allow public paths — no auth check, no redirect.
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // 2) Only enforce auth on protected paths.
  if (isProtectedPath(pathname)) {
    if (!hasAuthToken(req)) {
      const loginUrl = new URL('/auth/login', req.url)
      loginUrl.searchParams.set('redirect', pathname + search)
      return NextResponse.redirect(loginUrl)
    }
  }

  // 3) Everything else → allow.
  return NextResponse.next()
}

/* ============================================================================
   MATCHER
   ----------------------------------------------------------------------------
   Exclude static assets and Next internals for performance.
   Note: this matcher runs middleware on ALL app routes, but the function
   itself decides whether to redirect.
   ============================================================================ */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     *   - _next/static (static files)
     *   - _next/image  (image optimization)
     *   - favicon.ico
     *   - public assets with a file extension
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}