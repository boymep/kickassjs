import type { TheoryBlock } from './topic';
import type { QuizQuestion } from './quiz';
import type { Flashcard } from './flashcard';

export type Lang = 'ru' | 'en';

export interface VideoEmbed {
  source: 'youtube';
  id: string;
  title: string;
  channel?: string;
  language: Lang;
  durationSec?: number;
  startSec?: number;
  description?: string;
}

export type LinkSource =
  | 'mdn'
  | 'learn-js'
  | 'web-dev'
  | 'nodejs-docs'
  | 'v8-blog'
  | 'spec'
  | 'github'
  | 'article'
  | 'other';

export interface ExternalLink {
  url: string;
  title: string;
  source: LinkSource;
  language: Lang;
  note?: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  shortAnswer: string;
  fullAnswer: string;
  followUps?: string[];
  relatedChapterId?: string;
}

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
  video?: VideoEmbed;
  flashcardIds?: string[];
  docsLink?: { url: string; title: string };
}

export interface LessonIntro {
  whyItMatters: string;
  estimatedMinutes: number;
  prerequisites?: { slug: string; title: string }[];
  interviewAngle?: string;
}

export type RelatedKind = 'bug-hunt' | 'pitfall' | 'pattern';

export interface LessonRelated {
  kind: RelatedKind;
  id: string;
  label: string;
}

export interface Lesson {
  topicId: string;
  intro: LessonIntro;
  resources: { videos: VideoEmbed[]; links: ExternalLink[] };
  chapters: Chapter[];
  finalQuiz: QuizQuestion[];
  flashcards: Flashcard[];
  cheatsheet?: string;
  interviewQA?: InterviewQuestion[];
  nextTopics?: { slug: string; reason: string }[];
  related?: LessonRelated[];
}
