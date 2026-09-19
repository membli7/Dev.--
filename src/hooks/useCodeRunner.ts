import { useState, useCallback } from 'react';
import { TestCase, ExecutionResult } from '../types/lesson';
import { runCodeInSandbox } from '../utils/codeSandbox';
import { soundEffects } from '../utils/soundEffects';

export function useCodeRunner() {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);

  const execute = useCallback(
    async (code: string, testCases: TestCase[]): Promise<ExecutionResult> => {
      setIsRunning(true);
      try {
        const executionResult = await runCodeInSandbox(code, testCases);
        setResult(executionResult);

        if (executionResult.success) {
          soundEffects.playVictory();
        } else {
          soundEffects.playError();
        }

        return executionResult;
      } catch (err) {
        const errorResult: ExecutionResult = {
          success: false,
          logs: [],
          testResults: testCases.map(t => ({
            id: t.id,
            name: t.name,
            passed: false,
            expected: t.expected,
            error: (err as Error).message,
          })),
          error: (err as Error).message,
          executionTimeMs: 0,
        };
        setResult(errorResult);
        soundEffects.playError();
        return errorResult;
      } finally {
        setIsRunning(false);
      }
    },
    []
  );

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return {
    isRunning,
    result,
    execute,
    clearResult,
  };
}
