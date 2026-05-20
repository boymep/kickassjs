import { describe, it, expect } from 'vitest';
import { algorithmTopics, jsTopics, nodejsTopics, systemDesignTopics } from '../data/topics';
import { getQuiz } from '../data/quizzes';
import { getProblems } from '../data/problems';
import { getLesson } from '../data/lessons';
import { getProblemKind } from '../types/problem';

const codeTopics = [...algorithmTopics, ...jsTopics, ...nodejsTopics];
const allTopics = [...codeTopics, ...systemDesignTopics];

describe('Data integrity', () => {
  it('topic counts match expected sections', () => {
    expect(algorithmTopics).toHaveLength(6);
    expect(jsTopics).toHaveLength(8);
    expect(nodejsTopics).toHaveLength(4);
    expect(systemDesignTopics).toHaveLength(7);
  });

  it('each topic has required fields', () => {
    for (const t of allTopics) {
      expect(t.id).toBeTruthy();
      expect(t.slug).toBeTruthy();
      expect(t.title).toBeTruthy();
      expect(t.description).toBeTruthy();
    }
  });

  it('every topic has an authored lesson', () => {
    for (const t of allTopics) {
      const lesson = getLesson(t.slug);
      expect(lesson, `missing lesson for ${t.slug}`).toBeDefined();
      expect(lesson!.chapters.length).toBeGreaterThan(0);
    }
  });

  it('every code topic has a quiz with questions', () => {
    for (const t of codeTopics) {
      const quiz = getQuiz(t.slug);
      expect(quiz).toBeDefined();
      expect(quiz!.questions.length).toBeGreaterThanOrEqual(5);
    }
  });

  it('every quiz question has required fields', () => {
    for (const t of codeTopics) {
      const quiz = getQuiz(t.slug)!;
      for (const q of quiz.questions) {
        expect(q.id).toBeTruthy();
        expect(q.explanation).toBeTruthy();
        if ('options' in q && 'correctIndex' in q) {
          expect((q as { options: unknown[] }).options.length).toBeGreaterThanOrEqual(2);
          expect((q as { correctIndex: number }).correctIndex).toBeGreaterThanOrEqual(0);
          expect((q as { correctIndex: number }).correctIndex).toBeLessThan(
            (q as { options: unknown[] }).options.length
          );
        }
      }
    }
  });

  it('every code topic has practice problems', () => {
    for (const t of codeTopics) {
      const problems = getProblems(t.slug);
      expect(problems.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('every problem has test cases and solution', () => {
    for (const t of codeTopics) {
      const problems = getProblems(t.slug);
      for (const p of problems) {
        expect(p.id).toBeTruthy();
        expect(p.title).toBeTruthy();
        expect(p.solutionCode).toBeTruthy();
        const kind = getProblemKind(p);
        if (kind === 'implement' || kind === 'find-bug' || kind === 'refactor') {
          expect((p as { functionName: string }).functionName).toBeTruthy();
          // implement/find-bug need a meaningful test set; refactor may rely on perfTest as primary gate.
          const minCases = kind === 'refactor' ? 1 : 3;
          expect((p as { testCases: unknown[] }).testCases.length).toBeGreaterThanOrEqual(minCases);
        }
        if (kind === 'implement' || kind === 'refactor') {
          expect((p as { starterCode: string }).starterCode).toBeTruthy();
        }
      }
    }
  });

  it('returns undefined / empty for unknown topic', () => {
    expect(getLesson('nonexistent')).toBeUndefined();
    expect(getQuiz('nonexistent')).toBeUndefined();
    expect(getProblems('nonexistent')).toEqual([]);
  });
});
