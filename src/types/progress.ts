export interface TopicProgress {
  /** IDs of practice problems the user has fully solved (all tests + perf-gate passed). */
  problemsSolved: string[];
}

export interface ProgressState {
  version: 2;
  topics: Record<string, TopicProgress>;
}

export const PROGRESS_STORAGE_KEY = 'interview-progress:v2';
export const PROGRESS_VERSION = 2 as const;

export function emptyTopicProgress(): TopicProgress {
  return { problemsSolved: [] };
}

export function emptyProgressState(): ProgressState {
  return { version: PROGRESS_VERSION, topics: {} };
}
