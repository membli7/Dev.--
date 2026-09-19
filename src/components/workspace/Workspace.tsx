import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, RotateCcw, FileCode, Sparkles } from 'lucide-react';
import { Lesson } from '../../types/lesson';
import { AiStatus } from '../../types/ai';
import { LessonBrief } from './LessonBrief';
import { CodeEditor } from './CodeEditor';
import { ConsoleOutput } from './ConsoleOutput';
import { AiTutorPanel } from '../tutor/AiTutorPanel';
import { useCodeRunner } from '../../hooks/useCodeRunner';
import { useAiTutor } from '../../hooks/useAiTutor';
import { storage } from '../../utils/storage';

interface WorkspaceProps {
  lesson: Lesson;
  aiStatus: AiStatus | null;
  onLessonComplete: (lessonId: string, xpReward: number) => void;
  onBackToCurriculum: () => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  lesson,
  aiStatus,
  onLessonComplete,
  onBackToCurriculum,
}) => {
  const [code, setCode] = useState<string>(() => {
    return storage.getSavedCode(lesson.id) || lesson.starterCode;
  });

  const { isRunning, result, execute, clearResult } = useCodeRunner();

  const tutor = useAiTutor(lesson.id);

  // When lesson changes, load saved code or starter code
  useEffect(() => {
    const saved = storage.getSavedCode(lesson.id);
    setCode(saved !== null ? saved : lesson.starterCode);
    clearResult();
  }, [lesson.id, lesson.starterCode, clearResult]);

  // Auto-save drafts
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    storage.saveDraftCode(lesson.id, newCode);
  };

  const handleResetCode = () => {
    if (window.confirm('Reset code back to the starting template?')) {
      setCode(lesson.starterCode);
      storage.saveDraftCode(lesson.id, lesson.starterCode);
      clearResult();
    }
  };

  const handleRunCode = async () => {
    await execute(code, lesson.testCases);
  };

  const handleSubmit = async () => {
    const execResult = await execute(code, lesson.testCases);
    if (execResult.success) {
      onLessonComplete(lesson.id, lesson.xp);
    }
  };

  const isReadyToSubmit = result !== null && result.success;

  return (
    <div className="workspace-container">
      {/* 1. Left Panel: Quest Brief */}
      <LessonBrief
        lesson={lesson}
        testResults={result?.testResults || null}
        onBackToCurriculum={onBackToCurriculum}
      />

      {/* 2. Middle Panel: Code Editor + Console */}
      <div className="editor-console-panel">
        {/* Editor Toolbar */}
        <div className="editor-toolbar">
          <div className="file-tab">
            <FileCode size={14} />
            <span>quest_{lesson.order}.js</span>
          </div>

          <div className="toolbar-actions">
            <button
              className="arcade-btn-ghost"
              onClick={handleResetCode}
              title="Reset starter code"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>

            <button
              className="arcade-btn-primary"
              onClick={handleRunCode}
              disabled={isRunning}
              title="Run code (Ctrl + Enter)"
            >
              <Play size={14} />
              <span>{isRunning ? 'Running...' : 'Run Code'}</span>
            </button>

            <button
              className="arcade-btn-success"
              onClick={handleSubmit}
              disabled={isRunning || !isReadyToSubmit}
              title={isReadyToSubmit ? 'Submit and claim XP' : 'Pass all checkpoints to submit'}
            >
              {isReadyToSubmit ? <Sparkles size={14} /> : <CheckCircle size={14} />}
              <span>Submit & Claim +{lesson.xp} XP</span>
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <CodeEditor
          value={code}
          onChange={handleCodeChange}
          onRun={handleRunCode}
          disabled={isRunning}
        />

        {/* Terminal Console */}
        <ConsoleOutput executionResult={result} onClear={clearResult} />
      </div>

      {/* 3. Right Panel: Integrated AI Tutor ("Pixel") */}
      <AiTutorPanel
        lesson={lesson}
        userCode={code}
        testResults={result?.testResults || null}
        errorMessage={result?.error}
        consoleLogs={result?.logs}
        aiStatus={aiStatus}
        activeHints={tutor.activeHints}
        currentHintLevel={tutor.currentHintLevel}
        explanation={tutor.explanation}
        review={tutor.review}
        chatMessages={tutor.chatMessages}
        isLoadingHint={tutor.isLoadingHint}
        isLoadingExplain={tutor.isLoadingExplain}
        isLoadingReview={tutor.isLoadingReview}
        isLoadingChat={tutor.isLoadingChat}
        tutorError={tutor.tutorError}
        onRequestHint={() =>
          tutor.requestNextHint({
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            userCode: code,
            instructions: lesson.instructions.join(' '),
            failedTest: result?.testResults?.find(t => !t.passed)?.name,
            consoleLogs: result?.logs,
          })
        }
        onRequestExplain={() =>
          tutor.requestExplanation({
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            userCode: code,
          })
        }
        onRequestReview={() =>
          tutor.requestReview({
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            userCode: code,
            instructions: lesson.instructions.join(' '),
            testResults: result?.testResults,
            errorMessage: result?.error,
          })
        }
        onSendChat={message =>
          tutor.sendChatMessage(message, {
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            userCode: code,
          })
        }
        onClearChat={tutor.clearChat}
      />
    </div>
  );
};
