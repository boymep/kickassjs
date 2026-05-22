import type { Problem } from '../../types/problem';
import { binarySearchProblems } from './binary-search';
import { twoPointersProblems } from './two-pointers';
import { slidingWindowProblems } from './sliding-window';
import { hashMapProblems } from './hash-map';
import { stacksQueuesProblems } from './stacks-queues';
import { treesProblems } from './trees';
import { jsClosuresProblems } from './js-closures';
import { jsEventLoopProblems } from './js-event-loop';
import { jsThisProblems } from './js-this';
import { jsAsyncProblems } from './js-async';
import { jsPrototypesProblems } from './js-prototypes';
import { jsDomProblems } from './js-dom';
import { jsNetworkProblems } from './js-network';
import { jsBrowserProblems } from './js-browser';
import { nodeEventLoopProblems } from './node-event-loop';
import { nodeStreamsProblems } from './node-streams';
import { nodeNetworkProblems } from './node-network';
import { nodeOptimizationProblems } from './node-optimization';

const problemsMap: Record<string, Problem[]> = {
  'binary-search': binarySearchProblems,
  'two-pointers': twoPointersProblems,
  'sliding-window': slidingWindowProblems,
  'hash-map': hashMapProblems,
  'stacks-queues': stacksQueuesProblems,
  'trees': treesProblems,
  'js-closures': jsClosuresProblems,
  'js-event-loop': jsEventLoopProblems,
  'js-this': jsThisProblems,
  'js-async': jsAsyncProblems,
  'js-prototypes': jsPrototypesProblems,
  'js-dom': jsDomProblems,
  'js-network': jsNetworkProblems,
  'js-browser': jsBrowserProblems,
  'node-event-loop': nodeEventLoopProblems,
  'node-streams': nodeStreamsProblems,
  'node-network': nodeNetworkProblems,
  'node-optimization': nodeOptimizationProblems,
};

const DIFFICULTY_RANK: Record<Problem['difficulty'], number> = {
  easy: 0,
  medium: 1,
  hard: 2,
};

export function getProblems(slug: string): Problem[] {
  const list = problemsMap[slug];
  if (!list) return [];
  return [...list].sort(
    (a, b) => DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty],
  );
}
