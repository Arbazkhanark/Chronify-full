// src/modules/post/post.repository.ts
import { prisma } from '../../config/prisma';
import { CreatePostDTO, UpdatePostDTO } from './post.type';

/* ============================================================================
   SHARED INCLUDE
   ---------------------------------------------------------------------------
   Used by both `findById` and `findByIdOrSlug` so the response shape is
   identical whether you fetch by UUID or by slug.
   ============================================================================ */
const POST_INCLUDE = {
  user: {
    select: {
      id: true,
      name: true,
      verified: true,
      accountType: true,
      profile: {
        select: {
          userName: true,
          avatarUrl: true,
          profession: true,
          city: true,
          country: true,
        },
      },
    },
  },
  reactions: {
    select: {
      id: true,
      userId: true,
      reaction: true,
    },
  },
  comments: {
    where: { parentId: null, isDeleted: false },
    take: 3,
    orderBy: { createdAt: 'desc' as const },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profile: { select: { userName: true, avatarUrl: true } },
        },
      },
      reactions: {
        select: { id: true, userId: true, reaction: true },
      },
      _count: { select: { replies: true, reactions: true } },
    },
  },
  _count: {
    select: {
      reactions: true,
      comments: true,
    },
  },
} as const;

/* ============================================================================
   REPOSITORY
   ============================================================================ */

export class PostRepository {
  static create(userId: string, data: CreatePostDTO) {
    return prisma.post.create({
      data: {
        userId,
        content: data.content,
        image: data.image ?? [],
        type: data.type,
      },
    });
  }

  /* ------------------------------------------------------------------ */
  /*  findById — exact UUID lookup                                       */
  /* ------------------------------------------------------------------ */
  static findById(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: POST_INCLUDE,
    });
  }

  /* ------------------------------------------------------------------ */
  /*  🔥 NEW: findByIdOrSlug                                             */
  /* ------------------------------------------------------------------ */
  /**
   * Accepts:
   *   - A full UUID                → exact match
   *   - A slug ending in short-id  → match by id prefix
   *
   * Slug examples that work:
   *   arbaazkhan23-finished-my-dsa-course-edfc3500
   *   john-doe-my-first-post-7a9c42ce  (uses ONLY last 8 chars)
   *
   * ⚠️ Always tries exact UUID first (fast path), then falls back
   *     to prefix match on the trailing 6-12 hex characters.
   */
  static async findByIdOrSlug(idOrSlug: string) {
    const raw = String(idOrSlug || '').trim();
    if (!raw) return null;

    // 1️⃣ Full UUID? → exact lookup
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (uuidRegex.test(raw)) {
      return prisma.post.findUnique({
        where: { id: raw },
        include: POST_INCLUDE,
      });
    }

    // 2️⃣ Slug form → extract trailing short id
    //    Examples:
    //      arbaazkhan23-finished-my-dsa-course-edfc3500
    //      john_doe-my-post-7a9c42ce
    //    We split on "-" and take the LAST segment
    const segments = raw.split('-');
    const shortId = segments[segments.length - 1] || '';

    if (shortId.length < 6) {
      // Too short to be a meaningful short-id, bail early
      return null;
    }

    // 3️⃣ Prefix match on the UUID — UUIDs are hex-only
    const normalizedShort = shortId.toLowerCase().replace(/[^0-9a-f]/g, '');

    if (normalizedShort.length < 6) return null;

    const candidates = await prisma.post.findMany({
      where: {
        id: { startsWith: normalizedShort },
      },
      take: 2,
      include: POST_INCLUDE,
    });

    // Handle ambiguity — if more than one matches, prefer the newest
    if (candidates.length === 0) return null;
    if (candidates.length === 1) return candidates[0];

    // Sort by createdAt desc as a tie-breaker
    candidates.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return candidates[0];
  }

  /* ------------------------------------------------------------------ */
  /*  getFeed — unchanged                                                */
  /* ------------------------------------------------------------------ */
  static async getFeed(opts: {
    cursor?: string;
    limit: number;
    userId?: string;
    type?: string;
    viewerId?: string;
  }) {
    const { cursor, limit, userId, type } = opts;

    const posts = await prisma.post.findMany({
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      where: {
        ...(userId && { userId }),
        ...(type && { type: type as any }),
      },
      orderBy: { createdAt: 'desc' },
      include: POST_INCLUDE,
    });

    let hasNext = false;
    let nextCursor: string | null = null;

    if (posts.length > limit) {
      hasNext = true;
      const next = posts.pop()!;
      nextCursor = next.id;
    }

    return { posts, hasNext, nextCursor };
  }

  static update(id: string, data: UpdatePostDTO) {
    return prisma.post.update({
      where: { id },
      data,
    });
  }

  static delete(id: string) {
    return prisma.$transaction([
      prisma.reaction.deleteMany({ where: { postId: id } }),
      prisma.comment.deleteMany({ where: { postId: id } }),
      prisma.post.delete({ where: { id } }),
    ]);
  }

  static findByUser(userId: string) {
    return prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { reactions: true, comments: true } },
      },
    });
  }
}