import { useEffect, useState } from 'react';

/**
 * Track which chapter anchor is currently most-visible in the viewport.
 * Returns the active chapter id, or null if none of the targets are mounted.
 */
export function useLessonScrollSpy(chapterIds: string[]): string | null {
  const [active, setActive] = useState<string | null>(chapterIds[0] ?? null);

  useEffect(() => {
    if (chapterIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const id = (visible[0].target as HTMLElement).dataset.chapterId;
          if (id) setActive(id);
        }
      },
      {
        // Activate when chapter top is roughly at 1/3 of the viewport.
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    const targets = chapterIds
      .map((id) => document.querySelector(`[data-chapter-id="${id}"]`))
      .filter((el): el is HTMLElement => el !== null);
    targets.forEach((t) => observer.observe(t));

    return () => observer.disconnect();
  }, [chapterIds]);

  return active;
}
