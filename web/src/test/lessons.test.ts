import { describe, it, expect } from 'vitest';
import { jsClosuresLesson } from '../data/lessons/js-closures';
import { jsThisLesson } from '../data/lessons/js-this';
import { jsPrototypesLesson } from '../data/lessons/js-prototypes';
import { jsEventLoopLesson } from '../data/lessons/js-event-loop';
import { jsAsyncLesson } from '../data/lessons/js-async';
import { jsDomLesson } from '../data/lessons/js-dom';
import { jsNetworkLesson } from '../data/lessons/js-network';
import { jsBrowserLesson } from '../data/lessons/js-browser';
import { binarySearchLesson } from '../data/lessons/binary-search';
import { twoPointersLesson } from '../data/lessons/two-pointers';
import { slidingWindowLesson } from '../data/lessons/sliding-window';
import { hashMapLesson } from '../data/lessons/hash-map';
import { stacksQueuesLesson } from '../data/lessons/stacks-queues';
import { treesLesson } from '../data/lessons/trees';
import { nodeEventLoopLesson } from '../data/lessons/node-event-loop';
import { nodeStreamsLesson } from '../data/lessons/node-streams';
import { nodeNetworkLesson } from '../data/lessons/node-network';
import { nodeOptimizationLesson } from '../data/lessons/node-optimization';
import { sdRenderingLesson } from '../data/lessons/sd-rendering';
import { sdCachingLesson } from '../data/lessons/sd-caching';
import { sdAuthLesson } from '../data/lessons/sd-auth';
import { sdPerformanceLesson } from '../data/lessons/sd-performance';
import { sdApiDesignLesson } from '../data/lessons/sd-api-design';
import { sdScalingLesson } from '../data/lessons/sd-scaling';
import { sdObservabilityLesson } from '../data/lessons/sd-observability';
import { isValidYouTubeId } from '../utils/youtube';
import type { Lesson } from '../types/lesson';

const authoredLessons: Lesson[] = [
  jsClosuresLesson,
  jsThisLesson,
  jsPrototypesLesson,
  jsEventLoopLesson,
  jsAsyncLesson,
  jsDomLesson,
  jsNetworkLesson,
  jsBrowserLesson,
  binarySearchLesson,
  twoPointersLesson,
  slidingWindowLesson,
  hashMapLesson,
  stacksQueuesLesson,
  treesLesson,
  nodeEventLoopLesson,
  nodeStreamsLesson,
  nodeNetworkLesson,
  nodeOptimizationLesson,
  sdRenderingLesson,
  sdCachingLesson,
  sdAuthLesson,
  sdPerformanceLesson,
  sdApiDesignLesson,
  sdScalingLesson,
  sdObservabilityLesson,
];

describe('Authored lessons — content invariants', () => {
  it('every video has a syntactically valid YouTube id', () => {
    for (const lesson of authoredLessons) {
      for (const v of lesson.resources.videos) {
        expect(isValidYouTubeId(v.id), `Lesson ${lesson.topicId}: invalid id "${v.id}"`).toBe(true);
      }
      for (const c of lesson.chapters) {
        if (c.video) {
          expect(isValidYouTubeId(c.video.id), `Lesson ${lesson.topicId}/${c.id}: invalid id "${c.video.id}"`).toBe(true);
        }
      }
    }
  });

  it('all external links are https', () => {
    for (const lesson of authoredLessons) {
      for (const link of lesson.resources.links) {
        expect(link.url.startsWith('https://'), `Lesson ${lesson.topicId}: non-https url ${link.url}`).toBe(true);
      }
    }
  });

  it('chapter ids are unique within a lesson', () => {
    for (const lesson of authoredLessons) {
      const ids = lesson.chapters.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('checkpoint and finalQuiz question ids do not overlap', () => {
    for (const lesson of authoredLessons) {
      const checkpointIds = new Set<string>();
      for (const c of lesson.chapters) {
        for (const q of c.checkpoint ?? []) checkpointIds.add(q.id);
      }
      const finalIds = lesson.finalQuiz.map((q) => q.id);
      for (const fid of finalIds) {
        expect(checkpointIds.has(fid), `Lesson ${lesson.topicId}: question ${fid} appears in both checkpoint and finalQuiz`).toBe(false);
      }
    }
  });

  it('intro.whyItMatters is at least 80 characters', () => {
    for (const lesson of authoredLessons) {
      expect(lesson.intro.whyItMatters.length).toBeGreaterThanOrEqual(80);
    }
  });
});
