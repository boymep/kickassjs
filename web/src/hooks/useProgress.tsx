import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { ProgressState } from '../types/progress';
import { PROGRESS_STORAGE_KEY } from '../types/progress';
import {
  getTopicProgress,
  markProblemSolved,
  readProgress,
  writeProgress,
} from '../utils/progress';

interface ProgressContextValue {
  state: ProgressState;
  setState: (updater: (prev: ProgressState) => ProgressState) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

const PERSIST_DEBOUNCE_MS = 250;

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setRawState] = useState<ProgressState>(() => readProgress());
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const setState = useCallback((updater: (prev: ProgressState) => ProgressState) => {
    setRawState((prev) => {
      const next = updater(prev);
      if (next === prev) return prev;
      if (persistTimer.current) clearTimeout(persistTimer.current);
      persistTimer.current = setTimeout(() => {
        writeProgress(stateRef.current);
      }, PERSIST_DEBOUNCE_MS);
      return next;
    });
  }, []);

  // Cross-tab sync via the storage event.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== PROGRESS_STORAGE_KEY) return;
      setRawState(readProgress());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Flush pending writes on unmount.
  useEffect(() => {
    return () => {
      if (persistTimer.current) {
        clearTimeout(persistTimer.current);
        writeProgress(stateRef.current);
      }
    };
  }, []);

  const value = useMemo(() => ({ state, setState }), [state, setState]);
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

function useProgressContext(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return ctx;
}

export interface UseProgressApi {
  /** IDs of practice problems the user has fully solved within this topic. */
  solved: string[];
  /** Mark a problem as solved. Idempotent. */
  markSolved: (problemId: string) => void;
  /** Whether the given problem is in the solved set. */
  isSolved: (problemId: string) => boolean;
}

export function useProgress(topicId: string): UseProgressApi {
  const { state, setState } = useProgressContext();
  const topicState = getTopicProgress(state, topicId);

  const markSolved = useCallback(
    (problemId: string) => setState((s) => markProblemSolved(s, topicId, problemId)),
    [setState, topicId],
  );
  const isSolved = useCallback(
    (problemId: string) => topicState.problemsSolved.includes(problemId),
    [topicState.problemsSolved],
  );

  return {
    solved: topicState.problemsSolved,
    markSolved,
    isSolved,
  };
}
