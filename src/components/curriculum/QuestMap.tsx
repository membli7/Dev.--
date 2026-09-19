import React from 'react';
import {
  Zap,
  ShieldAlert,
  Trophy,
  Terminal,
  Package,
  Users,
  Flame,
  RotateCw,
  Wand2,
  Gift,
  CheckCircle2,
  Play,
  Sparkles,
} from 'lucide-react';
import { Lesson, Track } from '../../types/lesson';
import { UserStats } from '../../types/game';

interface QuestMapProps {
  tracks: Track[];
  lessons: Lesson[];
  stats: UserStats;
  currentLessonId: string;
  onSelectLesson: (lessonId: string) => void;
}

export const QuestMap: React.FC<QuestMapProps> = ({
  tracks,
  lessons,
  stats,
  currentLessonId,
  onSelectLesson,
}) => {
  const getTrackIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap size={22} />;
      case 'ShieldAlert':
        return <ShieldAlert size={22} />;
      case 'Trophy':
        return <Trophy size={22} />;
      default:
        return <Sparkles size={22} />;
    }
  };

  const getLessonIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal':
        return <Terminal size={18} />;
      case 'Package':
        return <Package size={18} />;
      case 'Zap':
        return <Zap size={18} />;
      case 'Users':
        return <Users size={18} />;
      case 'ShieldAlert':
        return <ShieldAlert size={18} />;
      case 'Flame':
        return <Flame size={18} />;
      case 'RotateCw':
        return <RotateCw size={18} />;
      case 'Wand2':
        return <Wand2 size={18} />;
      case 'Gift':
        return <Gift size={18} />;
      case 'Trophy':
        return <Trophy size={18} />;
      default:
        return <Play size={18} />;
    }
  };

  return (
    <div className="curriculum-view">
      <div className="curriculum-hero">
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 12px',
            borderRadius: 99,
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            color: 'var(--neon-cyan)',
            fontSize: 12,
            fontFamily: 'var(--font-arcade)',
            marginBottom: 16,
          }}
        >
          <span>SELECT YOUR QUEST</span>
        </div>
        <h1>Arcade Learning Realms</h1>
        <p>
          Master JavaScript from absolute zero. Level up through interactive coding quests,
          earn XP, and unlock arcade badges alongside Pixel, your AI companion.
        </p>
      </div>

      <div className="tracks-grid">
        {tracks.map(track => {
          const trackLessons = lessons.filter(l => l.trackId === track.id);
          const completedCount = trackLessons.filter(l =>
            stats.completedLessonIds.includes(l.id)
          ).length;
          const isTrackFinished =
            trackLessons.length > 0 && completedCount === trackLessons.length;

          return (
            <div key={track.id} className="track-card">
              <div className="track-header">
                <div className="track-meta">
                  <div className="track-icon-wrapper">{getTrackIcon(track.badgeIcon)}</div>
                  <div>
                    <h2 className="track-title">{track.title}</h2>
                    <p className="track-desc">{track.description}</p>
                  </div>
                </div>

                <div className="track-progress-badge">
                  {isTrackFinished ? '★ COMPLETED' : `${completedCount} / ${trackLessons.length} CLEARED`}
                </div>
              </div>

              <div className="lessons-list">
                {trackLessons.map(lesson => {
                  const isCompleted = stats.completedLessonIds.includes(lesson.id);
                  const isCurrent = currentLessonId === lesson.id;

                  return (
                    <div
                      key={lesson.id}
                      className={`lesson-card ${isCompleted ? 'completed' : ''}`}
                      onClick={() => onSelectLesson(lesson.id)}
                      style={{
                        borderColor: isCurrent ? 'var(--neon-cyan)' : undefined,
                        boxShadow: isCurrent ? '0 0 16px var(--neon-cyan-glow)' : undefined,
                      }}
                    >
                      <div className="lesson-top">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="lesson-number">STAGE {lesson.order}</span>
                          {isCompleted && (
                            <span style={{ color: 'var(--neon-emerald)', display: 'flex', alignItems: 'center' }}>
                              <CheckCircle2 size={14} />
                            </span>
                          )}
                        </div>
                        <div className="lesson-xp">
                          <Sparkles size={13} />
                          <span>+{lesson.xp} XP</span>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ color: 'var(--neon-cyan)' }}>{getLessonIcon(lesson.icon)}</span>
                          <h3 className="lesson-name">{lesson.title}</h3>
                        </div>
                        <span className="lesson-difficulty">{lesson.difficulty}</span>
                      </div>

                      <div
                        style={{
                          marginTop: 14,
                          paddingTop: 10,
                          borderTop: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: 12,
                          color: isCurrent ? 'var(--neon-cyan)' : 'var(--text-muted)',
                          fontWeight: 600,
                        }}
                      >
                        <span>{isCompleted ? 'Replay Quest' : isCurrent ? 'Current Quest' : 'Start Quest'}</span>
                        <Play size={12} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
