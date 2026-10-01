// src/modules/user/user.repository.ts
import { prisma } from "../../config/prisma";
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

  static async updateProfile(
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

    // ============================================================
    // 🔥 STEP 1: Update User table (fields + subFields)
    //     These columns live on User, not Profile.
    // ============================================================
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
        userName: username,
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



}