import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { ConnectionService } from './connection.service';
import { sendRequestSchema, respondRequestSchema } from './connection.validation';
import { AppError } from '../../utils/AppError';

function handleZodError(err: unknown, res: Response): boolean {
  if (err instanceof ZodError) {
    res.status(400).json({ success: false, message: 'Validation failed', errors: err.flatten().fieldErrors });
    return true;
  }
  return false;
}

function getParam(p: string | string[] | undefined): string {
  if (Array.isArray(p)) return p[0] ?? '';
  return p ?? '';
}

export class ConnectionController {
  static async sendRequest(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { receiverId } = sendRequestSchema.parse(req.body);
      const result = await ConnectionService.sendRequest(userId, receiverId);
      return res.status(201).json({ success: true, message: 'Request sent', data: result });
    } catch (err: any) {
      if (handleZodError(err, res)) return;
      if (err instanceof AppError) return res.status(err.statusCode).json({ success: false, message: err.message });
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async respond(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const requestId = getParam(req.params.id);
      const { action } = respondRequestSchema.parse(req.body);
      const result = await ConnectionService.respondToRequest(userId, requestId, action);
      return res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      if (handleZodError(err, res)) return;
      if (err instanceof AppError) return res.status(err.statusCode).json({ success: false, message: err.message });
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async sent(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const data = await ConnectionService.getSentRequests(userId);
      return res.json({ success: true, data });
    } catch {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async received(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const data = await ConnectionService.getReceivedRequests(userId);
      return res.json({ success: true, data });
    } catch {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async friends(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const data = await ConnectionService.getFriends(userId);
      return res.json({ success: true, data });
    } catch {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async search(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const q = (req.query.q as string) || '';
      const data = await ConnectionService.searchUsers(userId, q);
      return res.json({ success: true, data });
    } catch {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}