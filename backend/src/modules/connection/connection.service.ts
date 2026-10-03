import { ConnectionRepository } from './connection.repository';
import { AppError } from '../../utils/AppError';
import { logger } from 'patal-log';

export class ConnectionService {
  static async sendRequest(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new AppError('Cannot send request to yourself', 400);
    }

    // Check if already friends
    const existingFriend = await ConnectionRepository.isFriend(senderId, receiverId);
    if (existingFriend) throw new AppError('Already connected', 400);

    // Check for existing request (either direction)
    const forward = await ConnectionRepository.findRequest(senderId, receiverId);
    if (forward) {
      if (forward.status === 'PENDING') throw new AppError('Request already sent', 400);
      if (forward.status === 'ACCEPTED') throw new AppError('Already connected', 400);
      // REJECTED → allow resend
      await ConnectionRepository.updateRequestStatus(forward.id, 'PENDING');
      return forward;
    }

    const reverse = await ConnectionRepository.findRequest(receiverId, senderId);
    if (reverse && reverse.status === 'PENDING') {
      // They already sent us a request → auto-accept
      await ConnectionRepository.updateRequestStatus(reverse.id, 'ACCEPTED');
      await ConnectionRepository.createFriendship(senderId, receiverId);
      return reverse;
    }

    logger.info('Sending friend request', {
      functionName: 'ConnectionService.sendRequest',
      metadata: { senderId, receiverId },
    });

    return ConnectionRepository.createRequest(senderId, receiverId);
  }

  static async respondToRequest(
    userId: string,
    requestId: string,
    action: 'ACCEPT' | 'REJECT' | 'PENDING',
  ) {
    const request = await ConnectionRepository.findRequestById(requestId);
    if (!request) throw new AppError('Request not found', 404);
    if (request.receiverId !== userId) throw new AppError('Not authorized', 403);
    if (request.status !== 'PENDING') throw new AppError('Request already handled', 400);

    if (action === 'ACCEPT') {
      await ConnectionRepository.updateRequestStatus(requestId, 'ACCEPTED');
      await ConnectionRepository.createFriendship(request.senderId, request.receiverId);
      return { status: 'ACCEPTED' };
    } else {
      await ConnectionRepository.updateRequestStatus(requestId, 'REJECTED');
      return { status: 'REJECTED' };
    }
  }

  static async getSentRequests(userId: string) {
    return ConnectionRepository.getSentRequests(userId);
  }

  static async getReceivedRequests(userId: string) {
    return ConnectionRepository.getReceivedRequests(userId);
  }

  static async getFriends(userId: string) {
    const rows = await ConnectionRepository.getFriends(userId);
    return rows.map((r) => r.friend);
  }

  static async searchUsers(userId: string, query: string) {
    if (!query.trim()) return [];
    return ConnectionRepository.searchUsers(query.trim(), userId);
  }
}