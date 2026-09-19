import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai/ai.service';
import {
  HintRequest,
  ExplainRequest,
  ReviewRequest,
  ChatRequest,
} from '../services/ai/schemas';

export class AiController {
  public static async getStatus(_req: Request, res: Response): Promise<void> {
    const status = aiService.getStatus();
    res.json({
      success: true,
      data: status,
    });
  }

  public static async getHint(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hint = await aiService.getHint(req.body as HintRequest);
      res.json({
        success: true,
        data: hint,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async explainCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const explanation = await aiService.explainCode(req.body as ExplainRequest);
      res.json({
        success: true,
        data: explanation,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async reviewCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const review = await aiService.reviewCode(req.body as ReviewRequest);
      res.json({
        success: true,
        data: review,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reply = await aiService.chat(req.body as ChatRequest);
      res.json({
        success: true,
        data: reply,
      });
    } catch (err) {
      next(err);
    }
  }
}
