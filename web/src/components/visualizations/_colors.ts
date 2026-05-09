import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';

/**
 * Generic palette shape. Visualisations that need extra keys can intersect this type
 * with their own additions.
 */
export interface VizPalette {
  text: string;
  lightText: string;
  [key: string]: string;
}

/**
 * Wraps a base palette (light-mode tuned) with dark-mode-aware overrides for the
 * keys that would otherwise read as black text on a dark surface. Brand colors
 * (primary/success/orange/red) stay the same — they're already legible on both themes.
 */
export function useVizColors<T extends VizPalette>(base: T): T {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return useMemo<T>(() => {
    if (!isDark) return base;
    return {
      ...base,
      text: '#F2F2F7',
      lightText: '#AEAEB2',
      inactiveBg: '#2C2C2E',
      activeBg: 'rgba(10,132,255,0.20)',
      cellBorder: '#48484A',
    };
  }, [isDark, base]);
}
