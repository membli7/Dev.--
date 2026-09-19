import React, { useState } from 'react';
import {
  Bot,
  Lightbulb,
  Sparkles,
  HelpCircle,
  MessageSquare,
  Send,
  AlertCircle,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import {
  HintResponse,
  ExplainResponse,
  ReviewResponse,
  ChatMessage,
  AiStatus,
} from '../../types/ai';
import { Lesson, TestResult } from '../../types/lesson';

interface AiTutorPanelProps {
  lesson: Lesson;
  userCode: string;
  testResults: TestResult[] | null;
  errorMessage?: string;
  consoleLogs?: string[];
  aiStatus: AiStatus | null;
  activeHints: HintResponse[];
  currentHintLevel: number;
  explanation: ExplainResponse | null;
  review: ReviewResponse | null;
  chatMessages: ChatMessage[];
  isLoadingHint: boolean;
  isLoadingExplain: boolean;
  isLoadingReview: boolean;
  isLoadingChat: boolean;
  tutorError: string | null;
  onRequestHint: () => void;
  onRequestExplain: () => void;
  onRequestReview: () => void;
  onSendChat: (message: string) => void;
  onClearChat: () => void;
}

export const AiTutorPanel: React.FC<AiTutorPanelProps> = ({
  lesson,
  userCode,
  aiStatus,
  activeHints,
  explanation,
  review,
  chatMessages,
  isLoadingHint,
  isLoadingExplain,
  isLoadingReview,
  isLoadingChat,
  tutorError,
  onRequestHint,
  onRequestExplain,
  onRequestReview,
  onSendChat,
}) => {
  const [activeTab, setActiveTab] = useState<'hints' | 'explain' | 'review' | 'chat'>('hints');
  const [chatInput, setChatInput] = useState('');

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isLoadingChat) return;
    onSendChat(chatInput);
    setChatInput('');
  };

  const handleQuickPrompt = (promptText: string) => {
    onSendChat(promptText);
  };

  return (
    <div className="tutor-panel">
      {/* Tutor Header */}
      <div className="tutor-header">
        <div className="tutor-identity">
          <div className="tutor-avatar">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="tutor-name">Pixel AI Tutor</h3>
            <span className="tutor-subtitle">
              {aiStatus?.activeProvider === 'gemini'
                ? 'Powered by Gemini 2.5'
                : aiStatus?.activeProvider === 'openai'
                ? 'Powered by OpenAI'
                : 'Pedagogical Socratic Engine'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontSize: 11,
              padding: '2px 8px',
              borderRadius: 99,
              background: 'rgba(56, 189, 248, 0.1)',
              color: 'var(--neon-cyan)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
            }}
          >
            Socratic Guide
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="tutor-nav">
        <button
          className={`tutor-tab ${activeTab === 'hints' ? 'active' : ''}`}
          onClick={() => setActiveTab('hints')}
        >
          <Lightbulb size={14} />
          <span>Hints {activeHints.length > 0 ? `(${activeHints.length}/3)` : ''}</span>
        </button>
        <button
          className={`tutor-tab ${activeTab === 'explain' ? 'active' : ''}`}
          onClick={() => setActiveTab('explain')}
        >
          <Sparkles size={14} />
          <span>Explain</span>
        </button>
        <button
          className={`tutor-tab ${activeTab === 'review' ? 'active' : ''}`}
          onClick={() => setActiveTab('review')}
        >
          <HelpCircle size={14} />
          <span>Review</span>
        </button>
        <button
          className={`tutor-tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageSquare size={14} />
          <span>Chat</span>
        </button>
      </div>

      {/* Error alert if any */}
      {tutorError && (
        <div
          style={{
            margin: '12px 18px 0',
            padding: '8px 12px',
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--neon-pink)',
            fontSize: 12,
          }}
        >
          <AlertCircle size={14} />
          <span>{tutorError}</span>
        </div>
      )}

      {/* Tab Body */}
      <div className="tutor-body">
        {/* ==================== HINTS TAB ==================== */}
        {activeTab === 'hints' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Socratic Hint Progression
                </span>
                <span style={{ fontSize: 12, color: 'var(--neon-amber)', fontWeight: 700 }}>
                  {activeHints.length}/3 Unlocked
                </span>
              </div>
              <div className="hint-level-tracker">
                <div className={`hint-pip ${activeHints.length >= 1 ? 'active' : ''}`} />
                <div className={`hint-pip ${activeHints.length >= 2 ? 'active' : ''}`} />
                <div className={`hint-pip ${activeHints.length >= 3 ? 'active' : ''}`} />
              </div>
            </div>

            {/* Hint Cards */}
            {activeHints.map(hint => (
              <div key={hint.hintLevel} className="hint-card">
                <div className="hint-card-header">
                  <span className="hint-badge">
                    Level {hint.hintLevel}: {hint.hintLevel === 1 ? 'Gentle Nudge' : hint.hintLevel === 2 ? 'Syntax Clue' : 'Structural Pattern'}
                  </span>
                  <Flame size={14} color="var(--neon-amber)" />
                </div>

                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
                  {hint.title}
                </h4>

                <p className="hint-text">{hint.nudge}</p>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 12.5,
                    color: '#e2e8f0',
                  }}
                >
                  <strong style={{ color: 'var(--neon-cyan)' }}>Socratic Question: </strong>
                  {hint.guidingQuestion}
                </div>

                {hint.funAnalogy && (
                  <div className="hint-analogy">
                    💡 <em>{hint.funAnalogy}</em>
                  </div>
                )}

                {hint.pseudocodeClue && (
                  <div className="pseudocode-block">{hint.pseudocodeClue}</div>
                )}
              </div>
            ))}

            {activeHints.length < 3 && (
              <button
                className="arcade-btn-primary"
                onClick={onRequestHint}
                disabled={isLoadingHint}
                style={{ justifyContent: 'center' }}
              >
                {isLoadingHint ? (
                  <>
                    <div className="spinner" />
                    <span>Consulting Pixel...</span>
                  </>
                ) : (
                  <>
                    <Lightbulb size={16} />
                    <span>
                      {activeHints.length === 0
                        ? 'Request Level 1 Hint (Gentle Nudge)'
                        : activeHints.length === 1
                        ? 'Request Level 2 Hint (Syntax Clue)'
                        : 'Request Level 3 Hint (Structural Pattern)'}
                    </span>
                  </>
                )}
              </button>
            )}

            {activeHints.length === 3 && (
              <div
                style={{
                  textAlign: 'center',
                  fontSize: 12,
                  color: 'var(--text-dim)',
                  padding: 8,
                }}
              >
                All 3 incremental hints unlocked! Check the pseudocode pattern above.
              </div>
            )}
          </div>
        )}

        {/* ==================== EXPLAIN TAB ==================== */}
        {activeTab === 'explain' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Pixel will break down your editor code line-by-line and translate it into
              arcade game mechanics.
            </p>

            <button
              className="arcade-btn-primary"
              onClick={onRequestExplain}
              disabled={isLoadingExplain || !userCode.trim()}
              style={{ justifyContent: 'center' }}
            >
              {isLoadingExplain ? (
                <>
                  <div className="spinner" />
                  <span>Analyzing Code Mechanics...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Explain My Code</span>
                </>
              )}
            </button>

            {explanation && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div
                  style={{
                    background: 'var(--bg-elevated)',
                    padding: 14,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <h4 style={{ fontSize: 13, color: 'var(--neon-cyan)', marginBottom: 6 }}>
                    Overview
                  </h4>
                  <p style={{ fontSize: 13, color: '#f1f5f9', lineHeight: 1.5 }}>
                    {explanation.summary}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Step-by-Step Breakdown
                  </h4>
                  {explanation.breakdown.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        background: '#090d16',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: 10,
                        fontSize: 12.5,
                      }}
                    >
                      <code
                        style={{
                          display: 'block',
                          color: 'var(--neon-cyan)',
                          fontFamily: 'var(--font-code)',
                          marginBottom: 4,
                        }}
                      >
                        {item.codeSnippet}
                      </code>
                      <p style={{ color: '#cbd5e1' }}>{item.explanation}</p>
                      {item.arcadeAnalogy && (
                        <div
                          style={{
                            marginTop: 4,
                            color: 'var(--neon-amber)',
                            fontSize: 11.5,
                            fontStyle: 'italic',
                          }}
                        >
                          🎮 {item.arcadeAnalogy}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    background: 'rgba(56, 189, 248, 0.08)',
                    borderLeft: '3px solid var(--neon-cyan)',
                    padding: 12,
                    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                    fontSize: 12.5,
                    color: '#e2e8f0',
                  }}
                >
                  <strong style={{ color: 'var(--neon-cyan)' }}>Mental Model: </strong>
                  {explanation.mentalModel}
                </div>

                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.08)',
                    borderLeft: '3px solid var(--neon-emerald)',
                    padding: 12,
                    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                    fontSize: 12.5,
                    color: '#e2e8f0',
                  }}
                >
                  <strong style={{ color: 'var(--neon-emerald)' }}>Golden Rule: </strong>
                  {explanation.keyTakeaway}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== REVIEW TAB ==================== */}
        {activeTab === 'review' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Ask Pixel to inspect your code for bugs, syntax roadblocks, and logic traps.
            </p>

            <button
              className="arcade-btn-primary"
              onClick={onRequestReview}
              disabled={isLoadingReview}
              style={{ justifyContent: 'center' }}
            >
              {isLoadingReview ? (
                <>
                  <div className="spinner" />
                  <span>Diagnosing Code Health...</span>
                </>
              ) : (
                <>
                  <HelpCircle size={16} />
                  <span>Diagnose & Review</span>
                </>
              )}
            </button>

            {review && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    padding: 14,
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 8,
                      color:
                        review.overallStatus === 'ready_to_clear'
                          ? 'var(--neon-emerald)'
                          : 'var(--neon-amber)',
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {review.overallStatus === 'ready_to_clear' ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <AlertCircle size={16} />
                    )}
                    <span>
                      {review.overallStatus === 'ready_to_clear'
                        ? 'Ready to Clear Stage!'
                        : review.overallStatus === 'needs_tweak'
                        ? 'Close! Needs Minor Tweak'
                        : 'Bug Detected - Let’s Solve It!'}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#f1f5f9' }}>{review.praise}</p>
                </div>

                {review.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#090d16',
                      border:
                        issue.severity === 'error'
                          ? '1px solid rgba(244, 63, 94, 0.4)'
                          : '1px solid rgba(251, 191, 36, 0.4)',
                      padding: 12,
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color:
                          issue.severity === 'error'
                            ? 'var(--neon-pink)'
                            : 'var(--neon-amber)',
                        marginBottom: 4,
                      }}
                    >
                      {issue.severity.toUpperCase()} {issue.lineHint ? `(${issue.lineHint})` : ''}
                    </div>
                    <p style={{ fontSize: 13, color: '#f8fafc', marginBottom: 6 }}>
                      {issue.description}
                    </p>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--neon-cyan)',
                        fontStyle: 'italic',
                      }}
                    >
                      🔍 <strong>Investigation:</strong> {issue.suggestedInvestigation}
                    </div>
                  </div>
                ))}

                <p style={{ fontSize: 12.5, color: 'var(--text-muted)', textAlign: 'center' }}>
                  {review.encouragingClosing}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ==================== CHAT TAB ==================== */}
        {activeTab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="chat-messages">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                  {msg.sender === 'tutor' && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        marginBottom: 4,
                        fontSize: 11,
                        color: 'var(--neon-cyan)',
                        fontWeight: 700,
                      }}
                    >
                      <Bot size={13} />
                      <span>PIXEL</span>
                    </div>
                  )}
                  <div>{msg.text}</div>
                </div>
              ))}

              {isLoadingChat && (
                <div className="chat-bubble tutor" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="spinner" />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Pixel is typing...</span>
                </div>
              )}
            </div>

            {/* Quick suggested questions */}
            <div className="quick-prompts">
              <button
                className="prompt-pill"
                onClick={() => handleQuickPrompt(`What is the goal of ${lesson.title}?`)}
              >
                What is the goal?
              </button>
              <button
                className="prompt-pill"
                onClick={() => handleQuickPrompt("Why do we need variables instead of raw numbers?")}
              >
                Why variables?
              </button>
              <button
                className="prompt-pill"
                onClick={() => handleQuickPrompt("Can you give me an analogy for this?")}
              >
                Give me an analogy
              </button>
            </div>

            {/* Chat Input */}
            <form className="chat-input-bar" onSubmit={handleSendChat}>
              <input
                className="chat-input"
                type="text"
                placeholder="Ask Pixel anything..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                disabled={isLoadingChat}
              />
              <button
                type="submit"
                className="arcade-btn-primary"
                disabled={!chatInput.trim() || isLoadingChat}
                style={{ padding: '8px 12px' }}
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
