import type { TestCase } from './problem';

export interface BugHuntItem {
  id: string;
  title: string;
  topic: string;
  topicLabel: string;
  difficulty: 'easy' | 'medium' | 'hard';
  /** Buggy code shown to the user. */
  code: string;
  language: string;
  bugs: Bug[];

  // ─── Optional test scaffolding ──────────────────────────────────────────
  // If all four fields are present, BugHuntPage shows a code editor + runner
  // (same UX as practice find-bug). Otherwise it falls back to read-only mode.
  /** Symbol the runner calls. Often a `*_test` wrapper defined in testHelperCode. */
  functionName?: string;
  /** Test cases run against the user's edited code. */
  testCases?: TestCase[];
  /** Reference fixed code, shown after the user gives up or after success. */
  solutionCode?: string;
  /** Helper appended after user code in the sandbox (mocks, dispatchers). */
  testHelperCode?: string;
}

export interface Bug {
  description: string;
  fix: string;
  explanation: string;
}

/** A fully-runnable bug-hunt item — has test scaffolding. */
export type RunnableBugHuntItem = BugHuntItem & {
  functionName: string;
  testCases: TestCase[];
  solutionCode: string;
};

export function isRunnable(item: BugHuntItem): item is RunnableBugHuntItem {
  return Boolean(
    item.functionName &&
      item.solutionCode &&
      item.testCases &&
      item.testCases.length > 0,
  );
}
