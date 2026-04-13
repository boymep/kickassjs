import type { TopicTheory } from '../../types/topic';
import { binarySearchTheory } from './binary-search';
import { twoPointersTheory } from './two-pointers';
import { slidingWindowTheory } from './sliding-window';
import { hashMapTheory } from './hash-map';
import { stacksQueuesTheory } from './stacks-queues';
import { treesTheory } from './trees';
import { jsClosuresTheory } from './js-closures';
import { jsEventLoopTheory } from './js-event-loop';
import { jsThisTheory } from './js-this';
import { jsAsyncTheory } from './js-async';
import { jsPrototypesTheory } from './js-prototypes';
import { jsDomTheory } from './js-dom';
import { jsNetworkTheory } from './js-network';
import { jsBrowserTheory } from './js-browser';
import { nodeEventLoopTheory } from './node-event-loop';
import { nodeStreamsTheory } from './node-streams';
import { nodeNetworkTheory } from './node-network';
import { nodeOptimizationTheory } from './node-optimization';

const theoryMap: Record<string, TopicTheory> = {
  'binary-search': binarySearchTheory,
  'two-pointers': twoPointersTheory,
  'sliding-window': slidingWindowTheory,
  'hash-map': hashMapTheory,
  'stacks-queues': stacksQueuesTheory,
  'trees': treesTheory,
  'js-closures': jsClosuresTheory,
  'js-event-loop': jsEventLoopTheory,
  'js-this': jsThisTheory,
  'js-async': jsAsyncTheory,
  'js-prototypes': jsPrototypesTheory,
  'js-dom': jsDomTheory,
  'js-network': jsNetworkTheory,
  'js-browser': jsBrowserTheory,
  'node-event-loop': nodeEventLoopTheory,
  'node-streams': nodeStreamsTheory,
  'node-network': nodeNetworkTheory,
  'node-optimization': nodeOptimizationTheory,
};

export function getTheory(slug: string): TopicTheory | undefined {
  return theoryMap[slug];
}
