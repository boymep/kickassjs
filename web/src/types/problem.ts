export interface TestCase {
  id: string;
  inputDisplay: string;
  inputArgs: unknown[];
  expected: unknown;
}

export type ProblemKind = 'implement' | 'predict-output' | 'find-bug' | 'refactor';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface BaseProblem {
  id: string;
  topicId: string;
  title: string;
  difficulty: Difficulty;
  isContextual: boolean;
  description: string;
  hints: string[];
  solutionCode: string;
  kind?: ProblemKind;
}

export interface ImplementProblem extends BaseProblem {
  kind?: 'implement';
  functionName: string;
  starterCode: string;
  testCases: TestCase[];
  /** Helper code injected after user code in the sandbox (e.g. test wrapper functions). */
  testHelperCode?: string;
}

export interface PredictOutputProblem extends BaseProblem {
  kind: 'predict-output';
  /** Code shown to the user (immutable). */
  code: string;
  /** Canonical expected stdout (after trim/normalisation). */
  expected: string;
  /** Optional alternative acceptable answers. */
  acceptable?: string[];
}

export interface FindBugProblem extends BaseProblem {
  kind: 'find-bug';
  buggyCode: string;
  functionName: string;
  testCases: TestCase[];
  /** One-sentence description of the bug, shown after the user fixes it. */
  bugSummary: string;
  /** Optional id of the originating /bug-hunt item, for traceability. */
  sourceBugHuntId?: string;
  testHelperCode?: string;
}

export interface RefactorProblem extends BaseProblem {
  kind: 'refactor';
  /** Working but suboptimal starter code (passes correctness, fails perf). */
  starterCode: string;
  functionName: string;
  testCases: TestCase[];
  /** Performance gate: a single large input that must complete under maxMs. */
  perfTest?: { inputArgs: unknown[]; maxMs: number };
  testHelperCode?: string;
}

export type Problem =
  | ImplementProblem
  | PredictOutputProblem
  | FindBugProblem
  | RefactorProblem;

export interface TestResult {
  testCaseId: string;
  passed: boolean;
  actual: unknown;
  expected: unknown;
  error?: string;
}

export function getProblemKind(problem: Problem): ProblemKind {
  return problem.kind ?? 'implement';
}
