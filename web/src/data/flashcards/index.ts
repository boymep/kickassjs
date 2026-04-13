import type { TopicFlashcards } from '../../types/flashcard';
import { jsClosuresFlashcards } from './js-closures';
import { jsEventLoopFlashcards } from './js-event-loop';
import { jsThisFlashcards } from './js-this';
import { jsAsyncFlashcards } from './js-async';
import { jsPrototypesFlashcards } from './js-prototypes';
import { jsDomFlashcards } from './js-dom';
import { jsNetworkFlashcards } from './js-network';
import { jsBrowserFlashcards } from './js-browser';
import { nodeEventLoopFlashcards } from './node-event-loop';
import { nodeStreamsFlashcards } from './node-streams';
import { nodeNetworkFlashcards } from './node-network';
import { nodeOptimizationFlashcards } from './node-optimization';

const flashcardsMap: Record<string, TopicFlashcards> = {
  'js-closures': jsClosuresFlashcards,
  'js-event-loop': jsEventLoopFlashcards,
  'js-this': jsThisFlashcards,
  'js-async': jsAsyncFlashcards,
  'js-prototypes': jsPrototypesFlashcards,
  'js-dom': jsDomFlashcards,
  'js-network': jsNetworkFlashcards,
  'js-browser': jsBrowserFlashcards,
  'node-event-loop': nodeEventLoopFlashcards,
  'node-streams': nodeStreamsFlashcards,
  'node-network': nodeNetworkFlashcards,
  'node-optimization': nodeOptimizationFlashcards,
};

export function getFlashcards(slug: string): TopicFlashcards | undefined {
  return flashcardsMap[slug];
}

export function hasFlashcards(slug: string): boolean {
  return slug in flashcardsMap;
}
