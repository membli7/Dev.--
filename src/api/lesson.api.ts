import { apiClient } from './client';
import { Lesson, Track } from '../types/lesson';

export const lessonApi = {
  getTracks: () => apiClient<Track[]>('/api/lessons/tracks'),
  getLessons: (trackId?: string) =>
    apiClient<Lesson[]>(trackId ? `/api/lessons?trackId=${encodeURIComponent(trackId)}` : '/api/lessons'),
  getLessonById: (id: string) => apiClient<Lesson>(`/api/lessons/${encodeURIComponent(id)}`),
};
