import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

interface ClientRecord {
  count: number;
  resetTime: number;
}

const clientMap = new Map<string, ClientRecord>();

// Clean up stale IP records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of clientMap.entries()) {
    if (now > record.resetTime) {
      clientMap.delete(ip);
    }
  }
}, 300000);

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    '127.0.0.1';

  const now = Date.now();
  let record = clientMap.get(ip);

  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + env.rateLimitWindowMs,
    };
    clientMap.set(ip, record);
  } else {
    record.count++;
  }

  const remaining = Math.max(0, env.rateLimitMax - record.count);
  res.setHeader('X-RateLimit-Limit', env.rateLimitMax);
  res.setHeader('X-RateLimit-Remaining', remaining);
  res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

  if (record.count > env.rateLimitMax) {
    res.status(429).json({
      success: false,
      error: 'Too many tutor requests. Take a short pause, Adventurer!',
      retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
    });
    return;
  }

  next();
}
