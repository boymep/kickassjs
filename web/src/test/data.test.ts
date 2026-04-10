import { describe, it, expect } from 'vitest';
import { topics } from '../data/topics';
import { getTheory } from '../data/theory';
import { getQuiz } from '../data/quizzes';
import { getProblems } from '../data/problems';

describe('Data integrity', () => {
  it('has 6 topics', () => {
    expect(topics).toHaveLength(6);
  });

  it('each topic has required fields', () => {
    for (const t of topics) {
      expect(t.id).toBeTruthy();
      expect(t.slug).toBeTruthy();
      expect(t.title).toBeTruthy();
      expect(t.description).toBeTruthy();
    }
  });

  it('every topic has theory', () => {
    for (const t of topics) {
      const theory = getTheory(t.slug);
      expect(theory).toBeDefined();
      expect(theory!.sections.length).toBeGreaterThan(0);
    }
  });

  it('every theory section has blocks', () => {
    for (const t of topics) {
      const theory = getTheory(t.slug)!;
      for (const section of theory.sections) {
        expect(section.title).toBeTruthy();
        expect(section.blocks.length).toBeGreaterThan(0);
      }
    }
  });

  it('every topic has a quiz with questions', () => {
    for (const t of topics) {
      const quiz = getQuiz(t.slug);
      expect(quiz).toBeDefined();
      expect(quiz!.questions.length).toBeGreaterThanOrEqual(5);
    }
  });

  it('every quiz question has required fields', () => {
    for (const t of topics) {
      const quiz = getQuiz(t.slug)!;
      for (const q of quiz.questions) {
        expect(q.id).toBeTruthy();
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.length);
        expect(q.explanation).toBeTruthy();
      }
    }
  });

  it('every topic has practice problems', () => {
    for (const t of topics) {
      const problems = getProblems(t.slug);
      expect(problems.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('every problem has test cases and solution', () => {
    for (const t of topics) {
      const problems = getProblems(t.slug);
      for (const p of problems) {
        expect(p.id).toBeTruthy();
        expect(p.title).toBeTruthy();
        expect(p.functionName).toBeTruthy();
        expect(p.starterCode).toBeTruthy();
        expect(p.solutionCode).toBeTruthy();
        expect(p.testCases.length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it('every problem has at least one contextual and one algorithmic problem per topic', () => {
    for (const t of topics) {
      const problems = getProblems(t.slug);
      const hasContextual = problems.some((p) => p.isContextual);
      const hasAlgorithmic = problems.some((p) => !p.isContextual);
      expect(hasContextual).toBe(true);
      expect(hasAlgorithmic).toBe(true);
    }
  });

  it('returns undefined for unknown topic', () => {
    expect(getTheory('nonexistent')).toBeUndefined();
    expect(getQuiz('nonexistent')).toBeUndefined();
    expect(getProblems('nonexistent')).toEqual([]);
  });
});
