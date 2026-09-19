import { TestCase, TestResult, ExecutionResult } from '../types/lesson';

/**
 * Sandboxed In-Browser JavaScript Evaluator & Test Runner
 */
export async function runCodeInSandbox(
  userCode: string,
  testCases: TestCase[] = []
): Promise<ExecutionResult> {
  const startTime = performance.now();
  const capturedLogs: string[] = [];

  // Custom log formatter for strings, objects, numbers
  const formatLogItem = (item: unknown): string => {
    if (item === null) return 'null';
    if (item === undefined) return 'undefined';
    if (typeof item === 'object') {
      try {
        return JSON.stringify(item);
      } catch {
        return String(item);
      }
    }
    return String(item);
  };

  const fakeConsole = {
    log: (...args: unknown[]) => capturedLogs.push(args.map(formatLogItem).join(' ')),
    info: (...args: unknown[]) => capturedLogs.push(args.map(formatLogItem).join(' ')),
    warn: (...args: unknown[]) => capturedLogs.push(`[WARN] ${args.map(formatLogItem).join(' ')}`),
    error: (...args: unknown[]) => capturedLogs.push(`[ERROR] ${args.map(formatLogItem).join(' ')}`),
  };

  try {
    // Wrap code in an async or synchronous function context with hijacked console
    // We append variable exposure so test cases can evaluate variables defined in global scope
    const wrappedScript = `
      "use strict";
      const console = __fakeConsole;
      ${userCode}
      return {
        getVar: (varName) => {
          try { return eval(varName); } catch(e) { return undefined; }
        }
      };
    `;

    // Timeout race to protect beginner infinite loops
    const runPromise = new Promise<{ getVar: (name: string) => unknown }>((resolve, reject) => {
      try {
        const executor = new Function('__fakeConsole', wrappedScript);
        const scope = executor(fakeConsole);
        resolve(scope);
      } catch (err) {
        reject(err);
      }
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Execution timed out (2000ms). Check for infinite loops!')), 2000)
    );

    const scope = await Promise.race([runPromise, timeoutPromise]);

    // Now evaluate test assertions
    const testResults: TestResult[] = testCases.map(testCase => {
      try {
        // Run test function inside a context with captured logs and user scope
        const testEvaluator = new Function(
          '__logs',
          '__scope',
          `
          const __get = __scope.getVar;
          try {
            // expose variables into test function context if they exist
            ${userCode}
            return Boolean(${testCase.testFunction});
          } catch(e) {
            return false;
          }
        `
        );

        const passed = Boolean(testEvaluator(capturedLogs, scope));
        return {
          id: testCase.id,
          name: testCase.name,
          passed,
          expected: testCase.expected,
          actual: passed ? testCase.expected : (capturedLogs.slice(-1)[0] || 'Assertion not satisfied'),
        };
      } catch (err) {
        return {
          id: testCase.id,
          name: testCase.name,
          passed: false,
          expected: testCase.expected,
          error: (err as Error).message,
        };
      }
    });

    const allPassed = testResults.length === 0 || testResults.every(t => t.passed);
    const executionTimeMs = Math.round(performance.now() - startTime);

    return {
      success: allPassed,
      logs: capturedLogs,
      testResults,
      executionTimeMs,
    };
  } catch (err) {
    const executionTimeMs = Math.round(performance.now() - startTime);
    return {
      success: false,
      logs: capturedLogs,
      testResults: testCases.map(t => ({
        id: t.id,
        name: t.name,
        passed: false,
        expected: t.expected,
        error: (err as Error).message,
      })),
      error: (err as Error).message,
      executionTimeMs,
    };
  }
}
