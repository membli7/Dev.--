import React from 'react';
import { Award, Zap, Shield, Wand2, Trophy, Bot, Radio, Lock } from 'lucide-react';
import { AVAILABLE_BADGES, UserStats } from '../../types/game';

interface BadgesViewProps {
  stats: UserStats;
  onBackToCurriculum: () => void;
}

export const BadgesView: React.FC<BadgesViewProps> = ({ stats, onBackToCurriculum }) => {
  const unlockedIds = new Set(stats.unlockedBadges.map(b => b.id));

  const renderBadgeIcon = (icon: string) => {
    switch (icon) {
      case 'Radio':
        return <Radio size={28} />;
      case 'Zap':
        return <Zap size={28} />;
      case 'Shield':
        return <Shield size={28} />;
      case 'Wand2':
        return <Wand2 size={28} />;
      case 'Trophy':
        return <Trophy size={28} />;
      case 'Bot':
        return <Bot size={28} />;
      default:
        return <Award size={28} />;
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
            background: 'rgba(251, 191, 36, 0.12)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            color: 'var(--neon-amber)',
            fontSize: 12,
            fontFamily: 'var(--font-arcade)',
            marginBottom: 16,
          }}
        >
          <span>TROPHY ROOM</span>
        </div>
        <h1>Arcade Achievements</h1>
        <p>
          Earn prestigious badges as you progress through beginner programming tracks and
          collaborate with Pixel!
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20,
        }}
      >
        {AVAILABLE_BADGES.map(badge => {
          const isUnlocked = unlockedIds.has(badge.id);
          const unlockedBadge = stats.unlockedBadges.find(b => b.id === badge.id);

          return (
            <div
              key={badge.id}
              style={{
                background: isUnlocked ? 'var(--bg-surface)' : 'rgba(14, 21, 36, 0.4)',
                border: isUnlocked
                  ? '1px solid rgba(251, 191, 36, 0.4)'
                  : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: 24,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                boxShadow: isUnlocked ? '0 0 20px rgba(251, 191, 36, 0.15)' : 'none',
                opacity: isUnlocked ? 1 : 0.65,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 'var(--radius-md)',
                  background: isUnlocked
                    ? 'linear-gradient(135deg, #f59e0b, #fbbf24)'
                    : 'var(--bg-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isUnlocked ? '#070a12' : 'var(--text-dim)',
                  flexShrink: 0,
                  boxShadow: isUnlocked ? '0 0 16px rgba(251, 191, 36, 0.4)' : 'none',
                }}
              >
                {isUnlocked ? renderBadgeIcon(badge.icon) : <Lock size={24} />}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>
                    {badge.name}
                  </h3>
                  {isUnlocked && (
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: 'var(--font-arcade)',
                        color: 'var(--neon-amber)',
                      }}
                    >
                      ★ UNLOCKED
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {badge.description}
                </p>
                {unlockedBadge?.unlockedAt && (
                  <div style={{ fontSize: 11, color: 'var(--neon-cyan)', marginTop: 8 }}>
                    Unlocked on {new Date(unlockedBadge.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <button className="arcade-btn-primary" onClick={onBackToCurriculum}>
          Back to Quest Map
        </button>
      </div>
    </div>
  );
};
