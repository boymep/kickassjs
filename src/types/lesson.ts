import type { TheoryBlock } from './topic';
import type { QuizQuestion } from './quiz';

export interface Playground {
  starterCode: string;
  expectedOutput?: string;
  description?: string;
  language?: 'javascript';
  asserts?: { code: string; label: string }[];
  noValidation?: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  estimatedMinutes?: number;
  blocks: TheoryBlock[];
  checkpoint?: QuizQuestion[];
  playground?: Playground;
  /** @deprecated legacy field — no longer rendered. Will be removed when each lesson is refreshed. */
  video?: unknown;
  /** @deprecated legacy field — no longer rendered. */
  links?: unknown;
  /** @deprecated legacy field — no longer rendered. */
  flashcardIds?: unknown;
  /** @deprecated legacy field — no longer rendered. */
  docsLink?: unknown;
}

export interface LessonIntro {
  whyItMatters: string;
  estimatedMinutes: number;
  prerequisites?: { slug: string; title: string }[];
  interviewAngle?: string;
}

export interface Lesson {
  topicId: string;
  intro: LessonIntro;
  chapters: Chapter[];
  finalQuiz: QuizQuestion[];
  cheatsheet?: string;
  nextTopics?: { slug: string; reason: string }[];
  /** @deprecated legacy field — no longer rendered. */
  resources?: unknown;
  /** @deprecated legacy field — no longer rendered. */
  flashcards?: unknown;
  /** @deprecated legacy field — no longer rendered. */
  interviewQA?: unknown;
  /** @deprecated legacy field — no longer rendered. */
  related?: unknown;
}
