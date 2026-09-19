import { useState, useEffect, useCallback } from 'react';
import { UserStats, Badge, AVAILABLE_BADGES } from '../types/game';
import { storage } from '../utils/storage';
import { soundEffects } from '../utils/soundEffects';

export function useGameState() {
  const [stats, setStats] = useState<UserStats>(() => storage.getStats());
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<Badge | null>(null);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => storage.getSoundEnabled());

  useEffect(() => {
    storage.saveStats(stats);
  }, [stats]);

  const toggleSound = useCallback(() => {
    const nextVal = !soundEnabled;
    storage.setSoundEnabled(nextVal);
    setSoundEnabledState(nextVal);
    if (nextVal) soundEffects.playClick();
  }, [soundEnabled]);

  const calculateLevel = (xp: number): number => {
    // Level scaling: Level 1 = 0-199 XP, Level 2 = 200-499, Level 3 = 500-899, etc.
    if (xp < 200) return 1;
    if (xp < 500) return 2;
    if (xp < 900) return 3;
    if (xp < 1400) return 4;
    return 5 + Math.floor((xp - 1400) / 600);
  };

  const checkBadgeUnlocks = useCallback((updatedStats: UserStats): Badge | null => {
    const existingBadgeIds = new Set(updatedStats.unlockedBadges.map(b => b.id));

    for (const badge of AVAILABLE_BADGES) {
      if (existingBadgeIds.has(badge.id)) continue;

      let shouldUnlock = false;

      if (badge.id === 'badge-first-code' && updatedStats.completedLessonIds.length >= 1) {
        shouldUnlock = true;
      } else if (
        badge.id === 'badge-grove-ranger' &&
        ['lesson-1-neon-console', 'lesson-2-variables', 'lesson-3-math-operators', 'lesson-4-arrays'].every(
          id => updatedStats.completedLessonIds.includes(id)
        )
      ) {
        shouldUnlock = true;
      } else if (
        badge.id === 'badge-logic-knight' &&
        ['lesson-5-conditionals', 'lesson-6-logical-operators', 'lesson-7-loops'].every(
          id => updatedStats.completedLessonIds.includes(id)
        )
      ) {
        shouldUnlock = true;
      } else if (
        badge.id === 'badge-arcade-champion' &&
        updatedStats.completedLessonIds.includes('lesson-10-boss-battle')
      ) {
        shouldUnlock = true;
      } else if (
        badge.id === 'badge-spellcaster' &&
        updatedStats.completedLessonIds.includes('lesson-8-functions')
      ) {
        shouldUnlock = true;
      }

      if (shouldUnlock) {
        const unlocked: Badge = { ...badge, unlockedAt: Date.now() };
        return unlocked;
      }
    }
    return null;
  }, []);

  const completeLesson = useCallback(
    (lessonId: string, xpReward: number) => {
      setStats(prev => {
        const isFirstClear = !prev.completedLessonIds.includes(lessonId);
        const earnedXp = isFirstClear ? xpReward : Math.round(xpReward * 0.2); // repeat clear gives 20% XP bonus
        const nextXp = prev.xp + earnedXp;
        const currentLevel = prev.level;
        const nextLevel = calculateLevel(nextXp);

        if (nextLevel > currentLevel) {
          soundEffects.playLevelUp();
        } else {
          soundEffects.playVictory();
        }

        const nextCompleted = isFirstClear ? [...prev.completedLessonIds, lessonId] : prev.completedLessonIds;

        const candidateStats: UserStats = {
          ...prev,
          xp: nextXp,
          level: nextLevel,
          completedLessonIds: nextCompleted,
        };

        const newBadge = checkBadgeUnlocks(candidateStats);
        if (newBadge) {
          candidateStats.unlockedBadges = [...candidateStats.unlockedBadges, newBadge];
          setNewlyUnlockedBadge(newBadge);
        }

        return candidateStats;
      });
    },
    [checkBadgeUnlocks]
  );

  const deductHeart = useCallback(() => {
    setStats(prev => {
      if (prev.hearts <= 1) {
        // regenerate hearts if 0
        return { ...prev, hearts: prev.maxHearts };
      }
      return { ...prev, hearts: prev.hearts - 1 };
    });
  }, []);

  const awardBadge = useCallback((badgeId: string) => {
    setStats(prev => {
      if (prev.unlockedBadges.some(b => b.id === badgeId)) return prev;
      const found = AVAILABLE_BADGES.find(b => b.id === badgeId);
      if (!found) return prev;
      const unlocked: Badge = { ...found, unlockedAt: Date.now() };
      setNewlyUnlockedBadge(unlocked);
      return {
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, unlocked],
      };
    });
  }, []);

  return {
    stats,
    soundEnabled,
    toggleSound,
    completeLesson,
    deductHeart,
    awardBadge,
    newlyUnlockedBadge,
    clearUnlockedBadge: () => setNewlyUnlockedBadge(null),
  };
}
