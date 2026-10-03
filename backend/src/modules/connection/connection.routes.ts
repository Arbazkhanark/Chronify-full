import { Router } from 'express';
import { ConnectionController } from './connection.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/request', authMiddleware, ConnectionController.sendRequest);
router.put('/request/:id', authMiddleware, ConnectionController.respond);
router.get('/requests/sent', authMiddleware, ConnectionController.sent);
router.get('/requests/received', authMiddleware, ConnectionController.received);
router.get('/friends', authMiddleware, ConnectionController.friends);
router.get('/search', authMiddleware, ConnectionController.search);

export default router;