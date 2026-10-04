// src/modules/user/user.repository.ts
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { CreateUserDTO } from "./user.types";
import { UpdateProfileDTO } from "./user.validation";

export class UserRepository {
  static findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  static findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        verified: true,
        timezone: true,
        createdAt: true,
      },
    });
  }

  static async getFullDetailedProfileById(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        // =========================
        // USER TABLE
        // =========================

        id: true,
        name: true,
        email: true,
        verified: true,
        timezone: true,
        accountType: true,

        fields: true,
        subFields: true,

        createdAt: true,
        updatedAt: true,

        lastLogin: true,
        isOnline: true,

        profileVisibility: true,

        phoneNumber: true,
        twoFactorEnabled: true,

        lastTimetableLockAt: true,

        playSound: true,
        gracePeriod: true,

        notifyBeforeTask: true,
        notifyAtTaskStart: true,
        notifyAtTaskEnd: true,
        snoozeUntil: true,

        // =========================
        // PROFILE TABLE
        // =========================

        profile: {
          select: {
            id: true,
            userId: true,

            userName: true,
            avatarUrl: true,
            coverPhoto: true,

            bio: true,
            dob: true,
            profession: true,
            hobbies: true,

            city: true,
            state: true,
            country: true,

            createdAt: true,
            updatedAt: true,

            // =========================
            // SOCIAL LINKS
            // =========================
            socialLinks: {
              select: {
                id: true,
                platform: true,
                url: true,
                createdAt: true,
                updatedAt: true,
              },
            },

            // =========================
            // 🔥 NEW: EDUCATION
            // =========================
            education: {
              orderBy: { order: "asc" },
            },

            // =========================
            // 🔥 NEW: EXPERIENCE
            // =========================
            experience: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });
  }

  static findByIdWithoutPassword(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        verified: true,
        timezone: true,
        createdAt: true,
      },
    });
  }

  static create(data: CreateUserDTO & { password: string }) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        timezone: true,
        createdAt: true,
      },
    });
  }

  static updatePassword(id: string, password: string) {
    return prisma.user.update({
      where: { id },
      data: { password },
    });
  }

  static async updateProfile1(
    userId: string,
    data: UpdateProfileDTO
  ) {
    const {
      userName,
      avatarUrl,
      coverPhoto,
      bio,
      dob,
      profession,
      hobbies,
      socialLinks,
      city,
      state,
      country,
      fields,       // 🔥 NEW — User table field
      subFields,    // 🔥 NEW — User table field
      education,
      experience,
    } = data;

    console.log("Updating profile for Social Links:", data.socialLinks);
    console.log("Updating profile for Education:", data);
    console.log("Updating profile for fields:", fields);
    console.log("Updating profile for subFields:", subFields);

    /* ============================================================
       STEP 0: USERNAME COLLISION CHECK
       ------------------------------------------------------------
       Rules:
         a) userName undefined           → no change
         b) userName = current, unchanged → skip write (no self-collision)
         c) userName taken by ANOTHER    → throw 409
         d) userName free                → allow write
       Case-insensitive comparison.
       ============================================================ */
       let userNameToWrite: string | undefined = undefined;


    if (fields !== undefined || subFields !== undefined) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          ...(fields !== undefined && { fields }),
          ...(subFields !== undefined && { subFields }),
        },
      });
    }

    // ============================================================
    // 🔥 STEP 2: Update Profile table (everything else)
    // ============================================================
    return prisma.profile.upsert({
      where: {
        userId,
      },

      update: {
        ...(userName !== undefined && {
          userName,
        }),

        ...(avatarUrl !== undefined && {
          avatarUrl,
        }),

        ...(coverPhoto !== undefined && {
          coverPhoto,
        }),

        ...(bio !== undefined && {
          bio,
        }),

        ...(dob !== undefined && {
          dob,
        }),

        ...(profession !== undefined && {
          profession,
        }),

        ...(hobbies !== undefined && {
          hobbies,
        }),

        ...(city !== undefined && {
          city,
        }),

        ...(state !== undefined && {
          state,
        }),

        ...(country !== undefined && {
          country,
        }),

        // ---------- SOCIAL LINKS ----------
        ...(socialLinks !== undefined && {
          socialLinks: {
            deleteMany: {},
            create: socialLinks.map((link) => ({
              platform: link.platform,
              url: link.url,
            })),
          },
        }),

        // ---------- 🔥 EDUCATION ----------
        ...(education !== undefined && {
          education: {
            deleteMany: {},
            create: education.map((edu, idx) => ({
              institution: edu.institution,
              degree: edu.degree,
              field: edu.field ?? null,
              grade: edu.grade ?? null,
              startYear: edu.startYear ?? null,
              endYear: edu.endYear ?? null,
              description: edu.description ?? null,
              location: edu.location ?? null,
              activities: edu.activities ?? null,
              isCurrent: edu.isCurrent ?? false,
              order: edu.order ?? idx,
            })),
          },
        }),

        // ---------- 🔥 EXPERIENCE ----------
        ...(experience !== undefined && {
          experience: {
            deleteMany: {},
            create: experience.map((exp, idx) => ({
              role: exp.role,
              organization: exp.organization,
              employmentType: exp.employmentType ?? "FULL_TIME",
              locationType: exp.locationType ?? "ON_SITE",
              startDate: exp.startDate ?? null,
              endDate: exp.endDate ?? null,
              isCurrent: exp.isCurrent ?? false,
              location: exp.location ?? null,
              description: exp.description ?? null,
              skills: exp.skills ?? [],
              companyUrl: exp.companyUrl || null,
              companyLogo: exp.companyLogo || null,
              order: exp.order ?? idx,
            })),
          },
        }),
      },

      create: {
        userId,
        userName: userName ?? `user_${userId.slice(0, 8)}`,
        avatarUrl: avatarUrl ?? null,
        coverPhoto: coverPhoto ?? null,
        bio: bio ?? null,
        dob: dob ?? null,
        profession: profession ?? null,
        hobbies: hobbies ?? [],
        city: city ?? null,
        state: state ?? null,
        country: country ?? null,

        // ---------- SOCIAL LINKS ----------
        ...(socialLinks !== undefined && {
          socialLinks: {
            create: socialLinks.map((link) => ({
              platform: link.platform,
              url: link.url,
            })),
          },
        }),

        // ---------- 🔥 EDUCATION ----------
        ...(education !== undefined && {
          education: {
            create: education.map((edu, idx) => ({
              institution: edu.institution,
              degree: edu.degree,
              field: edu.field ?? null,
              grade: edu.grade ?? null,
              startYear: edu.startYear ?? null,
              endYear: edu.endYear ?? null,
              description: edu.description ?? null,
              location: edu.location ?? null,
              activities: edu.activities ?? null,
              isCurrent: edu.isCurrent ?? false,
              order: edu.order ?? idx,
            })),
          },
        }),

        // ---------- 🔥 EXPERIENCE ----------
        ...(experience !== undefined && {
          experience: {
            create: experience.map((exp, idx) => ({
              role: exp.role,
              organization: exp.organization,
              employmentType: exp.employmentType ?? "FULL_TIME",
              locationType: exp.locationType ?? "ON_SITE",
              startDate: exp.startDate ?? null,
              endDate: exp.endDate ?? null,
              isCurrent: exp.isCurrent ?? false,
              location: exp.location ?? null,
              description: exp.description ?? null,
              skills: exp.skills ?? [],
              companyUrl: exp.companyUrl || null,
              companyLogo: exp.companyLogo || null,
              order: exp.order ?? idx,
            })),
          },
        }),
      },

      include: {
        socialLinks: true,
        education: {
          orderBy: { order: "asc" },
        },
        experience: {
          orderBy: { order: "asc" },
        },
      },
    });
  }


    /* ==========================================================================
     🔥 UPDATE PROFILE (FIXED)
     --------------------------------------------------------------------------
     Fixes:
       1. Pre-check username ownership before writing (avoid self-collision)
       2. Case-insensitive comparison
       3. Skip write if username unchanged
       4. Throw friendly 409 if taken by ANOTHER user
     ========================================================================== */
  static async updateProfile(userId: string, data: UpdateProfileDTO) {
    const {
      userName,
      fullName,
      accountType,
      profileVisibility,
      avatarUrl,
      coverPhoto,
      bio,
      dob,
      profession,
      hobbies,
      socialLinks,
      city,
      state,
      country,
      fields,
      subFields,
      education,
      experience,
    } = data;

    console.log("Updating profile for Social Links:", data.socialLinks);
    console.log("Updating profile for Education:", data);
    console.log("Updating profile for fields:", fields);
    console.log("Updating profile for subFields:", subFields);

    /* ============================================================
       STEP 0: USERNAME COLLISION CHECK
       ------------------------------------------------------------
       Rules:
         a) userName undefined           → no change
         b) userName = current, unchanged → skip write (no self-collision)
         c) userName taken by ANOTHER    → throw 409
         d) userName free                → allow write
       Case-insensitive comparison.
       ============================================================ */
    let userNameToWrite: string | undefined = undefined;

    if (userName !== undefined) {
      const trimmed = String(userName).trim();

      if (trimmed.length > 0) {
        const currentProfile = await prisma.profile.findUnique({
          where: { userId },
          select: { userName: true },
        });

        const currentUserName = currentProfile?.userName ?? null;

        const unchanged =
          currentUserName !== null &&
          currentUserName.toLowerCase() === trimmed.toLowerCase();

        if (!unchanged) {
          // Check if taken by ANOTHER user (case-insensitive)
          const existing = await prisma.profile.findFirst({
            where: {
              userName: {
                equals: trimmed,
                mode: "insensitive",
              },
              NOT: { userId }, // exclude self
            },
            select: { userId: true },
          });

          if (existing) {
            throw new AppError(
              `Username "${trimmed}" is already taken. Please choose a different one.`,
              409
            );
          }

          userNameToWrite = trimmed;
        }
        // else: unchanged → skip write
      }
      // else: empty string → skip
    }

    /* ============================================================
       STEP 1: Update User table (fields + subFields)
       ============================================================ */
    const hasUserTableUpdates =
      fullName !== undefined ||
      accountType !== undefined ||
      profileVisibility !== undefined ||
      fields !== undefined ||
      subFields !== undefined;

    if (hasUserTableUpdates) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          ...(fullName !== undefined && { name: fullName }),
          ...(accountType !== undefined && {
            accountType: accountType as any,
          }),
          ...(profileVisibility !== undefined && {
            profileVisibility: profileVisibility as any,
          }),
          ...(fields !== undefined && { fields }),
          ...(subFields !== undefined && { subFields }),
        },
      });
    }

    /* ============================================================
       STEP 2: Upsert Profile
       ============================================================ */
    return prisma.profile.upsert({
      where: { userId },

      update: {
        // 🔥 Only write userName if it actually changed
        ...(userNameToWrite !== undefined && { userName: userNameToWrite }),

        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(coverPhoto !== undefined && { coverPhoto }),
        ...(bio !== undefined && { bio }),
        ...(dob !== undefined && { dob }),
        ...(profession !== undefined && { profession }),
        ...(hobbies !== undefined && { hobbies }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(country !== undefined && { country }),

        // SOCIAL LINKS
        ...(socialLinks !== undefined && {
          socialLinks: {
            deleteMany: {},
            create: socialLinks.map((link) => ({
              platform: link.platform,
              url: link.url,
            })),
          },
        }),

        // EDUCATION
        ...(education !== undefined && {
          education: {
            deleteMany: {},
            create: education.map((edu, idx) => ({
              institution: edu.institution,
              degree: edu.degree,
              field: edu.field ?? null,
              grade: edu.grade ?? null,
              startYear: edu.startYear ?? null,
              endYear: edu.endYear ?? null,
              description: edu.description ?? null,
              location: edu.location ?? null,
              activities: edu.activities ?? null,
              isCurrent: edu.isCurrent ?? false,
              order: edu.order ?? idx,
            })),
          },
        }),

        // EXPERIENCE
        ...(experience !== undefined && {
          experience: {
            deleteMany: {},
            create: experience.map((exp, idx) => ({
              role: exp.role,
              organization: exp.organization,
              employmentType: exp.employmentType ?? "FULL_TIME",
              locationType: exp.locationType ?? "ON_SITE",
              startDate: exp.startDate ?? null,
              endDate: exp.endDate ?? null,
              isCurrent: exp.isCurrent ?? false,
              location: exp.location ?? null,
              description: exp.description ?? null,
              skills: exp.skills ?? [],
              companyUrl: exp.companyUrl || null,
              companyLogo: exp.companyLogo || null,
              order: exp.order ?? idx,
            })),
          },
        }),
      },

      create: {
        userId,
        userName: userNameToWrite ?? `user_${userId.slice(0, 8)}`,
        avatarUrl: avatarUrl ?? null,
        coverPhoto: coverPhoto ?? null,
        bio: bio ?? null,
        dob: dob ?? null,
        profession: profession ?? null,
        hobbies: hobbies ?? [],
        city: city ?? null,
        state: state ?? null,
        country: country ?? null,

        ...(socialLinks !== undefined && {
          socialLinks: {
            create: socialLinks.map((link) => ({
              platform: link.platform,
              url: link.url,
            })),
          },
        }),

        ...(education !== undefined && {
          education: {
            create: education.map((edu, idx) => ({
              institution: edu.institution,
              degree: edu.degree,
              field: edu.field ?? null,
              grade: edu.grade ?? null,
              startYear: edu.startYear ?? null,
              endYear: edu.endYear ?? null,
              description: edu.description ?? null,
              location: edu.location ?? null,
              activities: edu.activities ?? null,
              isCurrent: edu.isCurrent ?? false,
              order: edu.order ?? idx,
            })),
          },
        }),

        ...(experience !== undefined && {
          experience: {
            create: experience.map((exp, idx) => ({
              role: exp.role,
              organization: exp.organization,
              employmentType: exp.employmentType ?? "FULL_TIME",
              locationType: exp.locationType ?? "ON_SITE",
              startDate: exp.startDate ?? null,
              endDate: exp.endDate ?? null,
              isCurrent: exp.isCurrent ?? false,
              location: exp.location ?? null,
              description: exp.description ?? null,
              skills: exp.skills ?? [],
              companyUrl: exp.companyUrl || null,
              companyLogo: exp.companyLogo || null,
              order: exp.order ?? idx,
            })),
          },
        }),
      },

      include: {
        socialLinks: true,
        education: {
          orderBy: { order: "asc" },
        },
        experience: {
          orderBy: { order: "asc" },
        },
      },
    });
  }

  static updateUser(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  static async saveFcmToken(userId: string, token: string) {
    return prisma.pushSubscription.upsert({
      where: { userId },
      update: { token },
      create: {
        userId,
        token,
        platform: "web",
      },
    });
  }


  // src/modules/user/user.repository.ts — add this method

static findByUsername(username: string) {
  return prisma.user.findFirst({
    where: {
      profile: {
          userName: {
            equals: username,
            mode: 'insensitive', // 🔥 case-insensitive
          },
      },
    },
    select: {
      id: true,
      name: true,
      email: false,     // 🔒 never expose
      verified: true,
      accountType: true,
      fields: true,
      subFields: true,
      createdAt: true,
      profileVisibility: true,
      // showStatsPublicly: true,
      profile: {
        select: {
          userName: true,
          avatarUrl: true,
          coverPhoto: true,
          bio: true,
          profession: true,
          hobbies: true,
          city: true,
          state: true,
          country: true,
          socialLinks: true,
          education: { orderBy: { order: 'asc' } },
          experience: { orderBy: { order: 'asc' } },
        },
      },
    },
  })
}


// src/modules/user/user.repository.ts — add this method inside UserRepository class

static findOAuthAccount(provider: 'GOOGLE' | 'GITHUB', providerId: string) {
  return prisma.oAuthAccount.findUnique({
    where: {
      provider_providerId: { provider, providerId },
    },
    include: { user: true },
  })
}





  /* ==========================================================================
     🔥 SUGGESTIONS — DATA FETCHING
     ========================================================================== */

  /**
   * Fetch the "viewer" (logged-in user) with all data needed for scoring:
   * fields, subFields, profile (education, experience, location, profession).
   */
  static async getViewerForSuggestions(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        accountType: true,
        fields: true,
        subFields: true,
        profile: {
          select: {
            profession: true,
            city: true,
            state: true,
            country: true,
            education: { select: { institution: true } },
            experience: { select: { organization: true } },
          },
        },
      },
    })
  }

  /**
   * Get IDs of everyone the viewer should NOT be suggested:
   *   - Self
   *   - Existing friends (both directions)
   *   - Pending / accepted / rejected friend requests (both directions)
   *
   * We keep rejected too, to avoid re-suggesting someone the user
   * already declined. (Remove if you want rejected ones back.)
   */
  static async getExcludedUserIds(userId: string): Promise<Set<string>> {
    const excluded = new Set<string>([userId])

    // Friends (both directions)
    const friends = await prisma.friend.findMany({
      where: {
        OR: [{ userId }, { friendId: userId }],
      },
      select: { userId: true, friendId: true },
    })

    for (const f of friends) {
      excluded.add(f.userId)
      excluded.add(f.friendId)
    }

    // Friend requests (both directions, any status)
    const requests = await prisma.friendRequest.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      select: { senderId: true, receiverId: true, status: true },
    })

    for (const r of requests) {
      // Keep PENDING + ACCEPTED excluded.
      // Also exclude REJECTED (don't re-suggest). Remove this check
      // if you want rejected users to be re-suggested.
      excluded.add(r.senderId)
      excluded.add(r.receiverId)
    }

    return excluded
  }

  /**
   * Fetch candidate users (everyone except excluded) with the data
   * needed for scoring.
   *
   * We cap at `take` for performance. If your user base is huge,
   * consider a two-pass approach: first cheap filter, then detailed fetch.
   */
  static async getSuggestionCandidates(
    excludedIds: string[],
    take: number = 200,
  ) {
    return prisma.user.findMany({
      where: {
        id: { notIn: excludedIds },
        // Only suggest verified users (optional — remove if you want all)
        verified: true,
      },
      take,
      orderBy: {
        // Prefer recently active users
        lastLogin: 'desc',
      },
      select: {
        id: true,
        name: true,
        accountType: true,
        fields: true,
        subFields: true,
        profileVisibility: true,
        profile: {
          select: {
            userName: true,
            avatarUrl: true,
            bio: true,
            profession: true,
            city: true,
            state: true,
            country: true,
            education: { select: { institution: true } },
            experience: { select: { organization: true } },
          },
        },
      },
    })
  }

  /**
   * Count mutual connections between viewer and a set of candidate IDs.
   *
   * Returns a Map<candidateId, mutualCount>.
   *
   * A "mutual connection" = someone who is a friend of the viewer
   * AND a friend of the candidate.
   */
  static async getMutualCounts(
    viewerId: string,
    candidateIds: string[],
  ): Promise<Map<string, number>> {
    const result = new Map<string, number>()

    if (candidateIds.length === 0) return result

    // 1. Get viewer's friends
    const viewerFriends = await prisma.friend.findMany({
      where: {
        OR: [{ userId: viewerId }, { friendId: viewerId }],
        status: 'ACTIVE',
      },
      select: { userId: true, friendId: true },
    })

    const viewerFriendIds = new Set<string>()
    for (const f of viewerFriends) {
      viewerFriendIds.add(f.userId === viewerId ? f.friendId : f.userId)
    }

    if (viewerFriendIds.size === 0) {
      // No friends → no mutuals possible
      for (const id of candidateIds) result.set(id, 0)
      return result
    }

    // 2. Get friends of all candidates in one query
    const candidateFriends = await prisma.friend.findMany({
      where: {
        OR: [
          { userId: { in: candidateIds } },
          { friendId: { in: candidateIds } },
        ],
        status: 'ACTIVE',
      },
      select: { userId: true, friendId: true },
    })

    // 3. Build mutual counts
    const counts = new Map<string, number>()
    for (const id of candidateIds) counts.set(id, 0)

    for (const f of candidateFriends) {
      // Determine which side is the candidate
      let candidateId: string | null = null
      let friendId: string | null = null

      if (candidateIds.includes(f.userId)) {
        candidateId = f.userId
        friendId = f.friendId
      } else if (candidateIds.includes(f.friendId)) {
        candidateId = f.friendId
        friendId = f.userId
      }

      if (!candidateId || !friendId) continue

      // Is this friend also a friend of the viewer?
      if (viewerFriendIds.has(friendId)) {
        counts.set(candidateId, (counts.get(candidateId) ?? 0) + 1)
      }
    }

    return counts
  }


}