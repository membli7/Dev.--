import { Router } from 'express';
import { AiController } from '../controllers/ai.controller';
import { validateBody } from '../middleware/validate';
import { rateLimiter } from '../middleware/rateLimiter';
import {
  HintRequestSchema,
  ExplainRequestSchema,
  ReviewRequestSchema,
  ChatRequestSchema,
} from '../services/ai/schemas';

const router = Router();

// Apply rate limiter to all AI endpoints to prevent abuse
router.use(rateLimiter);

// Provider status (safe metadata only)
router.get('/status', AiController.getStatus);

// Socratic Hints (incremental levels 1, 2, 3)
router.post('/hint', validateBody(HintRequestSchema), AiController.getHint);

// Code Explanation
router.post('/explain', validateBody(ExplainRequestSchema), AiController.explainCode);

// Code Review & Error Diagnosis
router.post('/review', validateBody(ReviewRequestSchema), AiController.reviewCode);

// Direct Interactive Chat
router.post('/chat', validateBody(ChatRequestSchema), AiController.chat);

export default router;
