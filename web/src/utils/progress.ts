import type { ProgressState, TopicProgress } from '../types/progress';
import {
  emptyProgressState,
  emptyTopicProgress,
  PROGRESS_STORAGE_KEY,
  PROGRESS_VERSION,
} from '../types/progress';

export function readProgress(): ProgressState {
  if (typeof localStorage === 'undefined') return emptyProgressState();
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return emptyProgressState();
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    if (!parsed || parsed.version !== PROGRESS_VERSION || typeof parsed.topics !== 'object') {
      return emptyProgressState();
    }
    return { version: PROGRESS_VERSION, topics: parsed.topics ?? {} };
  } catch {
    return emptyProgressState();
  }
}

export function writeProgress(state: ProgressState): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded or storage disabled — silent
  }
}

export function getTopicProgress(state: ProgressState, topicId: string): TopicProgress {
  return state.topics[topicId] ?? emptyTopicProgress();
}

export function markProblemSolved(
  state: ProgressState,
  topicId: string,
  problemId: string,
): ProgressState {
  const tp = state.topics[topicId] ?? emptyTopicProgress();
  if (tp.problemsSolved.includes(problemId)) return state;
  return {
    ...state,
    topics: {
      ...state.topics,
      [topicId]: { ...tp, problemsSolved: [...tp.problemsSolved, problemId] },
    },
  };
}
