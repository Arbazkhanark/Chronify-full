// src/modules/user/user.repository.ts
import { prisma } from "../../config/prisma";
import { CreateUserDTO } from "./user.types";

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

  static updateProfile(userId: string, data: any) {
    return prisma.profile.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
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
