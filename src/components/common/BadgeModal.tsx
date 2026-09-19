import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Zap, Shield, Wand2, Trophy, Bot, Radio, X } from 'lucide-react';
import { Badge } from '../../types/game';

interface BadgeModalProps {
  badge: Badge | null;
  onClose: () => void;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({ badge, onClose }) => {
  useEffect(() => {
    if (badge) {
      // Fire confetti burst!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#fbbf24', '#f43f5e', '#10b981', '#818cf8'],
      });
    }
  }, [badge]);

  if (!badge) return null;

  const renderIcon = () => {
    switch (badge.icon) {
      case 'Zap':
        return <Zap size={36} />;
      case 'Shield':
        return <Shield size={36} />;
      case 'Wand2':
        return <Wand2 size={36} />;
      case 'Trophy':
        return <Trophy size={36} />;
      case 'Bot':
        return <Bot size={36} />;
      case 'Radio':
        return <Radio size={36} />;
      default:
        return <Award size={36} />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="badge-modal-card" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            className="icon-btn"
            style={{ width: 28, height: 28 }}
          >
            <X size={14} />
          </button>
        </div>

        <div className="badge-modal-icon">{renderIcon()}</div>

        <div style={{ fontFamily: 'var(--font-arcade)', fontSize: 11, color: 'var(--neon-amber)', marginBottom: 8 }}>
          ★ TROPHY UNLOCKED ★
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, color: '#fff' }}>
          {badge.name}
        </h2>

        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
          {badge.description}
        </p>

        <button className="arcade-btn-primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
          Claim Achievement & Keep Coding!
        </button>
      </div>
    </div>
  );
};
