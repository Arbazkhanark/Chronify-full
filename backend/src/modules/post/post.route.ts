// src/modules/post/post.routes.ts
import { Router } from 'express';
import { PostController } from './post.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { optionalAuthMiddleware } from '../../middlewares/optional-auth.middleware';

const router = Router();

// Public feed (can also be protected — your choice)
router.get('/feed', optionalAuthMiddleware, PostController.getFeed);
router.get('/me', authMiddleware, PostController.getMyPosts);
router.get('/:id', optionalAuthMiddleware, PostController.getOne);

router.post('/', authMiddleware, PostController.create);
router.put('/:id', authMiddleware, PostController.update);
router.delete('/:id', authMiddleware, PostController.delete);

export default router;