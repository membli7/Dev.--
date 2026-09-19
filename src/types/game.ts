export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  trackId?: string;
}

export interface UserStats {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  hearts: number;
  maxHearts: number;
  completedLessonIds: string[];
  unlockedBadges: Badge[];
}

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'badge-first-code',
    name: 'First Transmission',
    description: 'Broadcasted your first message to the CodeArcade console',
    icon: 'Radio',
  },
  {
    id: 'badge-grove-ranger',
    name: 'Grove Ranger',
    description: 'Mastered all JavaScript Fundamentals in Track 1',
    icon: 'Zap',
    trackId: 'fundamentals',
  },
  {
    id: 'badge-logic-knight',
    name: 'Logic Knight',
    description: 'Conquered the branching paths of the Cyber Dungeon',
    icon: 'Shield',
    trackId: 'logic',
  },
  {
    id: 'badge-spellcaster',
    name: 'Spellcaster Apprentice',
    description: 'Inscribed your first reusable function spell',
    icon: 'Wand2',
  },
  {
    id: 'badge-arcade-champion',
    name: 'Arcade Grandmaster',
    description: 'Defeated the corrupted GLITCH boss in Track 3',
    icon: 'Trophy',
    trackId: 'functions',
  },
  {
    id: 'badge-inquisitive',
    name: 'Curious Adventurer',
    description: 'Consulted Pixel for Socratic hints and code explanations',
    icon: 'Bot',
  },
];
