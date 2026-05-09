import type { Lesson } from '../../types/lesson';
import { jsClosuresLesson } from './js-closures';
import { jsThisLesson } from './js-this';
import { jsPrototypesLesson } from './js-prototypes';
import { jsEventLoopLesson } from './js-event-loop';
import { jsBrowserLesson } from './js-browser';
import { jsAsyncLesson } from './js-async';
import { jsDomLesson } from './js-dom';
import { jsNetworkLesson } from './js-network';
import { binarySearchLesson } from './binary-search';
import { twoPointersLesson } from './two-pointers';
import { slidingWindowLesson } from './sliding-window';
import { hashMapLesson } from './hash-map';
import { stacksQueuesLesson } from './stacks-queues';
import { treesLesson } from './trees';
import { nodeEventLoopLesson } from './node-event-loop';
import { nodeStreamsLesson } from './node-streams';
import { nodeNetworkLesson } from './node-network';
import { nodeOptimizationLesson } from './node-optimization';
import { sdRenderingLesson } from './sd-rendering';
import { sdCachingLesson } from './sd-caching';
import { sdAuthLesson } from './sd-auth';
import { sdPerformanceLesson } from './sd-performance';
import { sdApiDesignLesson } from './sd-api-design';
import { sdScalingLesson } from './sd-scaling';
import { sdObservabilityLesson } from './sd-observability';

/**
 * Registry of fully-authored lessons. Topics absent from this map fall back to
 * `synthesizeLesson()` which composes a Lesson on the fly from the legacy
 * theory/quiz/flashcards files. Phase D will register one entry per topic here.
 */
const lessonMap: Record<string, Lesson> = {
  'js-closures': jsClosuresLesson,
  'js-this': jsThisLesson,
  'js-prototypes': jsPrototypesLesson,
  'js-event-loop': jsEventLoopLesson,
  'js-browser': jsBrowserLesson,
  'js-async': jsAsyncLesson,
  'js-dom': jsDomLesson,
  'js-network': jsNetworkLesson,
  'binary-search': binarySearchLesson,
  'two-pointers': twoPointersLesson,
  'sliding-window': slidingWindowLesson,
  'hash-map': hashMapLesson,
  'stacks-queues': stacksQueuesLesson,
  'trees': treesLesson,
  'node-event-loop': nodeEventLoopLesson,
  'node-streams': nodeStreamsLesson,
  'node-network': nodeNetworkLesson,
  'node-optimization': nodeOptimizationLesson,
  'sd-rendering': sdRenderingLesson,
  'sd-caching': sdCachingLesson,
  'sd-auth': sdAuthLesson,
  'sd-performance': sdPerformanceLesson,
  'sd-api-design': sdApiDesignLesson,
  'sd-scaling': sdScalingLesson,
  'sd-observability': sdObservabilityLesson,
};

export function getLesson(slug: string): Lesson | undefined {
  return lessonMap[slug];
}

export function isAuthoredLesson(slug: string): boolean {
  return slug in lessonMap;
}

export function listAuthoredSlugs(): string[] {
  return Object.keys(lessonMap);
}

/** @internal — used by Phase D agents to register their lessons */
export function registerLesson(slug: string, lesson: Lesson): void {
  lessonMap[slug] = lesson;
}
