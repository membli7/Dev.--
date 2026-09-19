import React from 'react';
import { Terminal, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { ExecutionResult } from '../../types/lesson';

interface ConsoleOutputProps {
  executionResult: ExecutionResult | null;
  onClear: () => void;
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  executionResult,
  onClear,
}) => {
  return (
    <div className="console-panel">
      <div className="console-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Terminal size={14} color="var(--neon-cyan)" />
          <span>TERMINAL OUTPUT</span>
          {executionResult && (
            <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>
              ({executionResult.executionTimeMs}ms)
            </span>
          )}
        </div>
        <button
          className="icon-btn"
          style={{ width: 24, height: 24 }}
          onClick={onClear}
          title="Clear Terminal"
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div className="console-body">
        {!executionResult ? (
          <div style={{ color: 'var(--text-dim)', fontStyle: 'italic', padding: 8 }}>
            // Click "Run Code" or press Ctrl+Enter to test your script.
          </div>
        ) : (
          <>
            {/* Captured Console Logs */}
            {executionResult.logs.length === 0 && !executionResult.error && (
              <div style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>
                // Program completed (No console.log outputs generated)
              </div>
            )}

            {executionResult.logs.map((log, index) => (
              <div key={index} className="console-line">
                <span className="console-prefix">&gt;</span>
                <span>{log}</span>
              </div>
            ))}

            {/* Error Message */}
            {executionResult.error && (
              <div className="console-line error">
                <span className="console-prefix">!</span>
                <span>[ERROR] {executionResult.error}</span>
              </div>
            )}

            {/* Test Assertions Summary */}
            {executionResult.testResults.length > 0 && (
              <div
                style={{
                  marginTop: 8,
                  paddingTop: 8,
                  borderTop: '1px dashed var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                {executionResult.testResults.map(tr => (
                  <div
                    key={tr.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      color: tr.passed ? 'var(--neon-emerald)' : 'var(--neon-pink)',
                    }}
                  >
                    {tr.passed ? <CheckCircle size={13} /> : <XCircle size={13} />}
                    <span>{tr.name}</span>
                    {!tr.passed && tr.expected && (
                      <span style={{ color: 'var(--text-dim)', marginLeft: 4 }}>
                        (Expected: {tr.expected})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
