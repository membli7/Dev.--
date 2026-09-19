import { Router, Request, Response } from 'express';
import { env, getAiProviderStatus } from '../config/env';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'CodeArcade',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
    aiProvider: getAiProviderStatus(),
  });
});

export default router;
