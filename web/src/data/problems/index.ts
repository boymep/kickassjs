import type { Problem } from '../../types/problem';
import { binarySearchProblems } from './binary-search';
import { twoPointersProblems } from './two-pointers';
import { slidingWindowProblems } from './sliding-window';
import { hashMapProblems } from './hash-map';
import { stacksQueuesProblems } from './stacks-queues';
import { treesProblems } from './trees';

const problemsMap: Record<string, Problem[]> = {
  'binary-search': binarySearchProblems,
  'two-pointers': twoPointersProblems,
  'sliding-window': slidingWindowProblems,
  'hash-map': hashMapProblems,
  'stacks-queues': stacksQueuesProblems,
  'trees': treesProblems,
};

export function getProblems(slug: string): Problem[] {
  return problemsMap[slug] ?? [];
}
