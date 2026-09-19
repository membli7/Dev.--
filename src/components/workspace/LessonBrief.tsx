import React from 'react';
import { BookOpen, CheckCircle, Circle, ArrowLeft } from 'lucide-react';
import { Lesson, TestResult } from '../../types/lesson';

interface LessonBriefProps {
  lesson: Lesson;
  testResults: TestResult[] | null;
  onBackToCurriculum: () => void;
}

export const LessonBrief: React.FC<LessonBriefProps> = ({
  lesson,
  testResults,
  onBackToCurriculum,
}) => {
  return (
    <div className="quest-panel">
      <div className="quest-header">
        <button
          className="arcade-btn-ghost"
          onClick={onBackToCurriculum}
          style={{ padding: '4px 8px', fontSize: 12 }}
        >
          <ArrowLeft size={14} />
          <span>Map</span>
        </button>
        <span className="quest-tag">STAGE {lesson.order}</span>
      </div>

      <div className="quest-content">
        <div>
          <span style={{ fontSize: 11, color: 'var(--neon-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
            {lesson.trackName}
          </span>
          <h2 className="quest-title">{lesson.title}</h2>
        </div>

        {/* Story Lore */}
        <div className="story-box">
          <p>"{lesson.storyIntro}"</p>
        </div>

        {/* Concept Lesson */}
        <div className="concept-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <BookOpen size={14} color="var(--neon-cyan)" />
            <h4>Arcade Concept</h4>
          </div>
          <p style={{ color: '#cbd5e1', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
            {lesson.conceptExplanation}
          </p>
        </div>

        {/* Instructions */}
        <div className="instructions-box">
          <h4>Quest Objectives</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {lesson.instructions.map((inst, index) => (
              <div key={index} className="instruction-item">
                <span className="bullet">▶</span>
                <span>{inst}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Test Criteria */}
        <div className="test-criteria-box">
          <h4>Mission Checkpoints</h4>
          {lesson.testCases.map(tc => {
            const result = testResults?.find(r => r.id === tc.id);
            const isPassed = result ? result.passed : false;

            return (
              <div
                key={tc.id}
                className={`criteria-badge ${isPassed ? 'passed' : ''}`}
              >
                {isPassed ? (
                  <CheckCircle size={15} color="var(--neon-emerald)" />
                ) : (
                  <Circle size={15} color="var(--text-dim)" />
                )}
                <span>{tc.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
