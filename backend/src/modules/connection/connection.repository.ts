import { prisma } from '../../config/prisma';

const USER_SELECT = {
  select: {
    id: true,
    name: true,
    profile: {
      select: { userName: true, avatarUrl: true, profession: true },
    },
  },
} as const;

export class ConnectionRepository {
  // ---------- FRIEND REQUESTS ----------
  static createRequest(senderId: string, receiverId: string) {
    return prisma.friendRequest.create({
      data: { senderId, receiverId, status: 'PENDING' },
      include: {
        sender: USER_SELECT,
        receiver: USER_SELECT,
      },
    });
  }

  static findRequest(senderId: string, receiverId: string) {
    return prisma.friendRequest.findUnique({
      where: { senderId_receiverId: { senderId, receiverId } },
    });
  }

  static findRequestById(id: string) {
    return prisma.friendRequest.findUnique({ where: { id } });
  }

  static updateRequestStatus(id: string, status: 'ACCEPTED' | 'REJECTED' | 'PENDING') {
    return prisma.friendRequest.update({
      where: { id },
      data: { status },
    });
  }

  static getSentRequests(userId: string) {
    return prisma.friendRequest.findMany({
      where: { senderId: userId },
      orderBy: { createdAt: 'desc' },
      include: { receiver: USER_SELECT },
    });
  }

  static getReceivedRequests(userId: string) {
    return prisma.friendRequest.findMany({
      where: { receiverId: userId },
      orderBy: { createdAt: 'desc' },
      include: { sender: USER_SELECT },
    });
  }

  // ---------- FRIENDS ----------
  static async createFriendship(userId: string, friendId: string) {
    // Bi-directional rows — easy to query both directions
    return prisma.$transaction([
      prisma.friend.upsert({
        where: { userId_friendId: { userId, friendId } },
        update: { status: 'ACTIVE' },
        create: { userId, friendId, status: 'ACTIVE' },
      }),
      prisma.friend.upsert({
        where: { userId_friendId: { userId: friendId, friendId: userId } },
        update: { status: 'ACTIVE' },
        create: { userId: friendId, friendId: userId, status: 'ACTIVE' },
      }),
    ]);
  }

  static getFriends(userId: string) {
    return prisma.friend.findMany({
      where: { userId, status: 'ACTIVE' },
      include: { friend: USER_SELECT },
    });
  }

  static isFriend(userId: string, friendId: string) {
    return prisma.friend.findUnique({
      where: { userId_friendId: { userId, friendId } },
    });
  }

  // ---------- USER SEARCH ----------
  static searchUsers(query: string, excludeId: string) {
    return prisma.user.findMany({
      where: {
        id: { not: excludeId },
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { profile: { userName: { contains: query, mode: 'insensitive' } } },
          { profile: { profession: { contains: query, mode: 'insensitive' } } },
        ],
      },
      take: 20,
      select: {
        id: true,
        name: true,
        accountType: true,
        fields: true,
        subFields: true,
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
    });
  }
}