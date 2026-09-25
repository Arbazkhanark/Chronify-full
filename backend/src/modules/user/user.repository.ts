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
        password:true,
        verified:true,
        timezone: true,
        createdAt: true,
      },
    });
  }

  static getUserDetailsById(id: string) {
    return prisma.profile.findUnique({
      where: { id },
      select: {
        id: true,
        // name: true,
        // email: true,
        // verified:true,
        // timezone: true,
        createdAt: true,
        // profile: {
          // select: {
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
            socialLinks: {
              select: {
                platform: true,
                url: true
              }
            }
          }
        // }
      // },
    })
  }

  static findByIdWithoutPassword(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        password:false,
        verified:true,
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
  } = data;

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

      ...(socialLinks !== undefined && {
        socialLinks: {
          deleteMany: {},
          create: socialLinks,
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
      ...(socialLinks !== undefined && {
        socialLinks: {
          create: socialLinks,
        },
      }),
    },

    include: {
      socialLinks: true,
    },
  });
}

  static updateUser(id:string,data:any){
    return prisma.user.update({
      where:{id},
      data
    })
  }




  static async saveFcmToken(userId: string, token: string) {
  return prisma.pushSubscription.upsert({
    where: { userId },
    update: { token },
    create: {
      userId,
      token,
      platform: 'web',
    },
  });
}



}
