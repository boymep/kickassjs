export interface TestCase {
  id: string;
  inputDisplay: string;
  inputArgs: unknown[];
  expected: unknown;
}

export interface Problem {
  id: string;
  topicId: string;
  title: string;
  difficulty: 'easy' | 'medium';
  isContextual: boolean;
  description: string;
  functionName: string;
  starterCode: string;
  testCases: TestCase[];
  hints: string[];
  solutionCode: string;
  /** Helper code injected after user code in the sandbox (e.g. test wrapper functions). */
  testHelperCode?: string;
}

export interface TestResult {
  testCaseId: string;
  passed: boolean;
  actual: unknown;
  expected: unknown;
  error?: string;
}
