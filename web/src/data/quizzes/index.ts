import type { TopicQuiz } from '../../types/quiz';
import { binarySearchQuiz } from './binary-search';
import { twoPointersQuiz } from './two-pointers';
import { slidingWindowQuiz } from './sliding-window';
import { hashMapQuiz } from './hash-map';
import { stacksQueuesQuiz } from './stacks-queues';
import { treesQuiz } from './trees';

const quizMap: Record<string, TopicQuiz> = {
  'binary-search': binarySearchQuiz,
  'two-pointers': twoPointersQuiz,
  'sliding-window': slidingWindowQuiz,
  'hash-map': hashMapQuiz,
  'stacks-queues': stacksQueuesQuiz,
  'trees': treesQuiz,
};

export function getQuiz(slug: string): TopicQuiz | undefined {
  return quizMap[slug];
}
