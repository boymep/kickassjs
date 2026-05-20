import { describe, it, expect } from 'vitest';
import type { TestCase, TestResult } from '../types/problem';

// Note: runCode uses iframe.sandbox which jsdom doesn't support.
// These tests verify the data contract and types instead.
// Full integration testing should be done in the browser.

describe('Code Runner types', () => {
  it('TestCase has correct shape', () => {
    const tc: TestCase = {
      id: 'tc1',
      inputDisplay: 'add(1, 2)',
      inputArgs: [1, 2],
      expected: 3,
    };
    expect(tc.id).toBe('tc1');
    expect(tc.inputArgs).toEqual([1, 2]);
    expect(tc.expected).toBe(3);
  });

  it('TestResult has correct shape', () => {
    const result: TestResult = {
      testCaseId: 'tc1',
      passed: true,
      actual: 3,
      expected: 3,
    };
    expect(result.passed).toBe(true);
    expect(result.actual).toBe(result.expected);
  });

  it('TestResult can have error', () => {
    const result: TestResult = {
      testCaseId: 'tc1',
      passed: false,
      actual: null,
      expected: 3,
      error: 'ReferenceError: x is not defined',
    };
    expect(result.passed).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
