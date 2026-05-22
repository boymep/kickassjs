import { useState, useCallback, useEffect } from 'react';
import { runCode } from '../utils/codeRunner';
import type { TestCase, TestResult } from '../types/problem';

export function useCodeRunner(resetKey?: string) {
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [running, setRunning] = useState(false);

  // Сбрасываем результаты при смене задачи, чтобы не показывать тесты прошлой.
  useEffect(() => {
    setResults(null);
  }, [resetKey]);

  const run = useCallback(async (code: string, functionName: string, testCases: TestCase[], testHelperCode?: string) => {
    setRunning(true);
    setResults(null);
    try {
      const res = await runCode(code, functionName, testCases, testHelperCode);
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
