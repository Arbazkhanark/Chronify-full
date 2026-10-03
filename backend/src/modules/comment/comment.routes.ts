// src/modules/comment/comment.routes.ts
import { Router } from 'express';
import { CommentController } from './comment.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, CommentController.create);
router.get('/post/:postId', CommentController.getForPost);
router.get('/:commentId/replies', authMiddleware, CommentController.getReplies);
router.put('/:id', authMiddleware, CommentController.update);
router.delete('/:id', authMiddleware, CommentController.delete);

export default router;