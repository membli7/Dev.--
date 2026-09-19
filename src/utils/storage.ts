import { UserStats } from '../types/game';

const STATS_KEY = 'codearcade_user_stats';
const CODE_DRAFTS_KEY = 'codearcade_code_drafts';
const SOUND_KEY = 'codearcade_sound_enabled';

const DEFAULT_STATS: UserStats = {
  xp: 0,
  level: 1,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  hearts: 5,
  maxHearts: 5,
  completedLessonIds: [],
  unlockedBadges: [],
};

export const storage = {
  getStats: (): UserStats => {
    try {
      const saved = localStorage.getItem(STATS_KEY);
      if (!saved) return DEFAULT_STATS;
      return { ...DEFAULT_STATS, ...JSON.parse(saved) };
    } catch {
      return DEFAULT_STATS;
    }
  },

  saveStats: (stats: UserStats): void => {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {
      // Ignore quota errors in restricted environments
    }
  },

  getSavedCode: (lessonId: string): string | null => {
    try {
      const drafts = JSON.parse(localStorage.getItem(CODE_DRAFTS_KEY) || '{}');
      return drafts[lessonId] || null;
    } catch {
      return null;
    }
  },

  saveDraftCode: (lessonId: string, code: string): void => {
    try {
      const drafts = JSON.parse(localStorage.getItem(CODE_DRAFTS_KEY) || '{}');
      drafts[lessonId] = code;
      localStorage.setItem(CODE_DRAFTS_KEY, JSON.stringify(drafts));
    } catch {
      // Ignore
    }
  },

  getSoundEnabled: (): boolean => {
    try {
      const val = localStorage.getItem(SOUND_KEY);
      return val !== null ? val === 'true' : true;
    } catch {
      return true;
    }
  },

  setSoundEnabled: (enabled: boolean): void => {
    try {
      localStorage.setItem(SOUND_KEY, String(enabled));
    } catch {
      // Ignore
    }
  },
};
