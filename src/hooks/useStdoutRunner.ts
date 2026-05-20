import { useCallback, useState } from 'react';
import { runStdoutCode, type StdoutRunResult } from '../utils/stdoutRunner';

export function useStdoutRunner() {
  const [result, setResult] = useState<StdoutRunResult | null>(null);
  const [running, setRunning] = useState(false);

  const run = useCallback(async (code: string) => {
    setRunning(true);
    setResult(null);
    try {
      const r = await runStdoutCode(code);
      setResult(r);
      return r;
    } finally {
      setRunning(false);
    }
  }, []);

  const reset = useCallback(() => setResult(null), []);

  return { result, running, run, reset };
}
