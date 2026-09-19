import React from 'react';
import {
  Gamepad2,
  Flame,
  Zap,
  Volume2,
  VolumeX,
  Map,
  Code2,
  Award,
  Sparkles,
} from 'lucide-react';
import { UserStats } from '../../types/game';
import { AiStatus } from '../../types/ai';

interface HeaderProps {
  stats: UserStats;
  currentView: 'curriculum' | 'workspace' | 'badges';
  onViewChange: (view: 'curriculum' | 'workspace' | 'badges') => void;
  aiStatus: AiStatus | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  currentView,
  onViewChange,
  aiStatus,
  soundEnabled,
  onToggleSound,
}) => {
  // Compute progress towards next level
  const xpThresholds = [0, 200, 500, 900, 1400, 2000, 2700];
  const currentThreshold = xpThresholds[stats.level - 1] || (stats.level - 1) * 700;
  const nextThreshold = xpThresholds[stats.level] || stats.level * 700;
  const xpInLevel = Math.max(0, stats.xp - currentThreshold);
  const xpNeeded = Math.max(1, nextThreshold - currentThreshold);
  const progressPercent = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  return (
    <header className="arcade-header">
      {/* Brand */}
      <div className="brand-section" onClick={() => onViewChange('curriculum')}>
        <div className="brand-icon">
          <Gamepad2 size={20} />
        </div>
        <div>
          <h1 className="brand-title">CODEARCADE</h1>
        </div>
      </div>

      {/* Center Nav */}
      <div className="nav-tab-bar">
        <button
          className={`nav-tab ${currentView === 'curriculum' ? 'active' : ''}`}
          onClick={() => onViewChange('curriculum')}
        >
          <Map size={15} />
          <span>Quest Map</span>
        </button>
        <button
          className={`nav-tab ${currentView === 'workspace' ? 'active' : ''}`}
          onClick={() => onViewChange('workspace')}
        >
          <Code2 size={15} />
          <span>Coding Arena</span>
        </button>
        <button
          className={`nav-tab ${currentView === 'badges' ? 'active' : ''}`}
          onClick={() => onViewChange('badges')}
        >
          <Award size={15} />
          <span>Badges ({stats.unlockedBadges.length})</span>
        </button>
      </div>

      {/* Gamification Stats */}
      <div className="header-stats">
        {/* Level & XP */}
        <div className="stat-pill level" title={`Level ${stats.level}: ${xpInLevel} / ${xpNeeded} XP to next level`}>
          <Zap size={14} />
          <span>LVL {stats.level}</span>
          <div
            style={{
              width: 48,
              height: 6,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 99,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'var(--neon-cyan)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Total XP */}
        <div className="stat-pill xp" title="Total XP Earned">
          <Sparkles size={14} />
          <span>{stats.xp} XP</span>
        </div>

        {/* Streak */}
        <div className="stat-pill streak" title="Daily Coding Streak">
          <Flame size={14} />
          <span>{stats.streakDays}d</span>
        </div>

        {/* AI Provider Status */}
        <div
          className="status-indicator"
          title={`AI Engine: ${
            aiStatus?.activeProvider === 'gemini'
              ? 'Google Gemini 2.5'
              : aiStatus?.activeProvider === 'openai'
              ? 'OpenAI'
              : 'Intelligent Pedagogical Engine (Simulated Fallback)'
          }`}
        >
          <span
            className={`pulse-dot ${
              aiStatus?.activeProvider === 'pedagogical-engine' ? 'fallback' : ''
            }`}
          />
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            AI:{' '}
            <strong style={{ color: 'var(--text-main)' }}>
              {aiStatus?.activeProvider === 'gemini'
                ? 'Gemini'
                : aiStatus?.activeProvider === 'openai'
                ? 'OpenAI'
                : 'Pixel-Sim'}
            </strong>
          </span>
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          <button
            className={`icon-btn ${soundEnabled ? 'active' : ''}`}
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute 8-Bit Audio' : 'Enable 8-Bit Audio'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
};
