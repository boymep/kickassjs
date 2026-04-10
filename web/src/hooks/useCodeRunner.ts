import { useState, useCallback } from 'react';
import { runCode } from '../utils/codeRunner';
import type { TestCase, TestResult } from '../types/problem';

export function useCodeRunner() {
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [running, setRunning] = useState(false);

  const run = useCallback(async (code: string, functionName: string, testCases: TestCase[]) => {
    setRunning(true);
    setResults(null);
    try {
      const res = await runCode(code, functionName, testCases);
      setResults(res);
    } finally {
      setRunning(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResults(null);
  }, []);

  return { results, running, run, reset };
}
