import { useState, useEffect } from 'react';
import './App.css';
import { Header } from './components/common/Header';
import { BadgeModal } from './components/common/BadgeModal';
import { QuestMap } from './components/curriculum/QuestMap';
import { BadgesView } from './components/curriculum/BadgesView';
import { Workspace } from './components/workspace/Workspace';
import { useGameState } from './hooks/useGameState';
import { lessonApi } from './api/lesson.api';
import { aiApi } from './api/ai.api';
import { Lesson, Track } from './types/lesson';
import { AiStatus } from './types/ai';

export function App() {
  const [currentView, setCurrentView] = useState<'curriculum' | 'workspace' | 'badges'>('workspace');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState<string>('lesson-1-neon-console');
  const [aiStatus, setAiStatus] = useState<AiStatus | null>(null);
  const [isLoadingCurriculum, setIsLoadingCurriculum] = useState<boolean>(true);

  const {
    stats,
    soundEnabled,
    toggleSound,
    completeLesson,
    newlyUnlockedBadge,
    clearUnlockedBadge,
  } = useGameState();

  // Load tracks and lessons from API on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedTracks, loadedLessons, loadedAiStatus] = await Promise.all([
          lessonApi.getTracks(),
          lessonApi.getLessons(),
          aiApi.getStatus().catch(() => null),
        ]);

        setTracks(loadedTracks);
        setLessons(loadedLessons);
        if (loadedAiStatus) {
          setAiStatus(loadedAiStatus);
        }
      } catch (err) {
        console.error('Failed to load initial curriculum from API:', err);
      } finally {
        setIsLoadingCurriculum(false);
      }
    }

    loadData();
  }, []);

  const handleSelectLesson = (lessonId: string) => {
    setCurrentLessonId(lessonId);
    setCurrentView('workspace');
  };

  const currentLesson = lessons.find(l => l.id === currentLessonId) || lessons[0];

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        stats={stats}
        currentView={currentView}
        onViewChange={setCurrentView}
        aiStatus={aiStatus}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* Main Content Area */}
      {isLoadingCurriculum && !currentLesson ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100vh - 64px)',
            gap: 16,
          }}
        >
          <div className="spinner" style={{ width: 32, height: 32 }} />
          <p style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-arcade)', fontSize: 12 }}>
            BOOTING CODEARCADE ENGINE...
          </p>
        </div>
      ) : (
        <>
          {currentView === 'curriculum' && (
            <QuestMap
              tracks={tracks}
              lessons={lessons}
              stats={stats}
              currentLessonId={currentLessonId}
              onSelectLesson={handleSelectLesson}
            />
          )}

          {currentView === 'workspace' && currentLesson && (
            <Workspace
              lesson={currentLesson}
              aiStatus={aiStatus}
              onLessonComplete={completeLesson}
              onBackToCurriculum={() => setCurrentView('curriculum')}
            />
          )}

          {currentView === 'badges' && (
            <BadgesView
              stats={stats}
              onBackToCurriculum={() => setCurrentView('curriculum')}
            />
          )}
        </>
      )}

      {/* Achievement Unlocked Modal */}
      <BadgeModal badge={newlyUnlockedBadge} onClose={clearUnlockedBadge} />
    </div>
  );
}

export default App;
