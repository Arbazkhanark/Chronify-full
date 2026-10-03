// src/modules/reaction/reaction.routes.ts
import { Router } from 'express';
import { ReactionController } from './reaction.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { optionalAuthMiddleware } from '../../middlewares/optional-auth.middleware';

const router = Router();

// Post reactions
router.post('/post', authMiddleware, ReactionController.reactToPost);
router.delete('/post/:postId', authMiddleware, ReactionController.removePostReaction);
router.get('/post/:postId', ReactionController.getPostReactionSummary);

// Comment reactions
router.post('/comment', authMiddleware, ReactionController.reactToComment);
router.delete('/comment/:commentId', authMiddleware, ReactionController.removeCommentReaction);
router.get('/comment/:commentId', optionalAuthMiddleware, ReactionController.getCommentReactionSummary);

export default router;