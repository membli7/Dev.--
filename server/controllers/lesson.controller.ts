import { Request, Response } from 'express';
import { LessonService } from '../services/lesson.service';

export class LessonController {
  public static getAllTracks(_req: Request, res: Response): void {
    const tracks = LessonService.getAllTracks();
    res.json({
      success: true,
      data: tracks,
    });
  }

  public static getAllLessons(req: Request, res: Response): void {
    const trackId = req.query.trackId as string | undefined;
    const lessons = trackId
      ? LessonService.getLessonsByTrack(trackId)
      : LessonService.getAllLessons();

    res.json({
      success: true,
      data: lessons,
    });
  }

  public static getLessonById(req: Request, res: Response): void {
    const { id } = req.params;
    const lesson = LessonService.getLessonById(id);

    if (!lesson) {
      res.status(404).json({
        success: false,
        error: `Lesson with id "${id}" not found`,
      });
      return;
    }

    res.json({
      success: true,
      data: lesson,
    });
  }
}
