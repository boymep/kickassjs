import { useState, useEffect } from 'react';

export function useHints(problemId: string) {
  const [hintIndex, setHintIndex] = useState(-1);
  useEffect(() => { setHintIndex(-1); }, [problemId]);
  const showNext = (total: number) => setHintIndex((i) => Math.min(i + 1, total - 1));
  return { hintIndex, showNext };
}
