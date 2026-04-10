import type { TopicTheory } from '../../types/topic';
import { binarySearchTheory } from './binary-search';
import { twoPointersTheory } from './two-pointers';
import { slidingWindowTheory } from './sliding-window';
import { hashMapTheory } from './hash-map';
import { stacksQueuesTheory } from './stacks-queues';
import { treesTheory } from './trees';

const theoryMap: Record<string, TopicTheory> = {
  'binary-search': binarySearchTheory,
  'two-pointers': twoPointersTheory,
  'sliding-window': slidingWindowTheory,
  'hash-map': hashMapTheory,
  'stacks-queues': stacksQueuesTheory,
  'trees': treesTheory,
};

export function getTheory(slug: string): TopicTheory | undefined {
  return theoryMap[slug];
}
