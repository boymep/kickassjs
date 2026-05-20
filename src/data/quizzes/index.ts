import type { TopicQuiz } from '../../types/quiz';
import { binarySearchQuiz } from './binary-search';
import { twoPointersQuiz } from './two-pointers';
import { slidingWindowQuiz } from './sliding-window';
import { hashMapQuiz } from './hash-map';
import { stacksQueuesQuiz } from './stacks-queues';
import { treesQuiz } from './trees';
import { jsClosuresQuiz } from './js-closures';
import { jsEventLoopQuiz } from './js-event-loop';
import { jsThisQuiz } from './js-this';
import { jsAsyncQuiz } from './js-async';
import { jsPrototypesQuiz } from './js-prototypes';
import { jsDomQuiz } from './js-dom';
import { jsNetworkQuiz } from './js-network';
import { jsBrowserQuiz } from './js-browser';
import { nodeEventLoopQuiz } from './node-event-loop';
import { nodeStreamsQuiz } from './node-streams';
import { nodeNetworkQuiz } from './node-network';
import { nodeOptimizationQuiz } from './node-optimization';

const quizMap: Record<string, TopicQuiz> = {
  'binary-search': binarySearchQuiz,
  'two-pointers': twoPointersQuiz,
  'sliding-window': slidingWindowQuiz,
  'hash-map': hashMapQuiz,
  'stacks-queues': stacksQueuesQuiz,
  'trees': treesQuiz,
  'js-closures': jsClosuresQuiz,
  'js-event-loop': jsEventLoopQuiz,
  'js-this': jsThisQuiz,
  'js-async': jsAsyncQuiz,
  'js-prototypes': jsPrototypesQuiz,
  'js-dom': jsDomQuiz,
  'js-network': jsNetworkQuiz,
  'js-browser': jsBrowserQuiz,
  'node-event-loop': nodeEventLoopQuiz,
  'node-streams': nodeStreamsQuiz,
  'node-network': nodeNetworkQuiz,
  'node-optimization': nodeOptimizationQuiz,
};

export function getQuiz(slug: string): TopicQuiz | undefined {
  return quizMap[slug];
}
