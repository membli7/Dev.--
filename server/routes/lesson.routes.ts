import { Router } from 'express';
import { LessonController } from '../controllers/lesson.controller';

const router = Router();

// Retrieve all curriculum tracks
router.get('/tracks', LessonController.getAllTracks);

// Retrieve all lessons or filter by trackId (?trackId=...)
router.get('/', LessonController.getAllLessons);

// Retrieve specific lesson by ID
router.get('/:id', LessonController.getLessonById);

export default router;
