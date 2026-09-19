import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Server Error Handler]:', err);

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: 'Validation failed on request payload',
      details: err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
  const statusCode = (err as { status?: number }).status || 500;

  res.status(statusCode).json({
    success: false,
    error: errorMessage,
    ...(env.nodeEnv === 'development' && err instanceof Error ? { stack: err.stack } : {}),
  });
}
