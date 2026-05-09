/**
 * Build a privacy-enhanced YouTube embed URL.
 * Uses youtube-nocookie.com so the iframe doesn't set tracking cookies until playback starts.
 */
export function buildYouTubeEmbedUrl(id: string, startSec?: number): string {
  const start = startSec && startSec > 0 ? `&start=${Math.floor(startSec)}` : '';
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0&modestbranding=1${start}`;
}

/**
 * Pick the highest-quality thumbnail that's reasonably likely to exist.
 * `hqdefault.jpg` is guaranteed for every public video; `maxresdefault.jpg` exists for most modern uploads
 * but not all, so prefer `hqdefault` for reliable rendering without onError fallbacks.
 */
export function buildYouTubeThumbnailUrl(id: string): string {
  return `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`;
}

const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;

export function isValidYouTubeId(id: string): boolean {
  return YOUTUBE_ID_RE.test(id);
}

export function buildYouTubeWatchUrl(id: string, startSec?: number): string {
  const t = startSec && startSec > 0 ? `&t=${Math.floor(startSec)}s` : '';
  return `https://www.youtube.com/watch?v=${encodeURIComponent(id)}${t}`;
}
