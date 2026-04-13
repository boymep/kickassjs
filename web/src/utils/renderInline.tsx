import { useTheme } from '@mui/material';

/**
 * Parses simple inline markdown: **bold**, `code`, -- → —
 * Returns an array of React nodes ready for rendering.
 */
export function renderInline(text: string, isDark = false): React.ReactNode[] {
  const normalized = text.replace(/ -- /g, ' — ');
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|`([^`]+?)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(normalized)) !== null) {
    if (match.index > lastIndex) {
      parts.push(normalized.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(<strong key={match.index}>{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(
        <code
          key={match.index}
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)',
            borderRadius: 4,
            padding: '1px 5px',
            fontSize: '0.88em',
            fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
          }}
        >
          {match[3]}
        </code>,
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < normalized.length) {
    parts.push(normalized.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [normalized];
}

/** Drop-in component: renders a string with inline markdown support */
export function Inline({ children }: { children: string }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return <>{renderInline(children, isDark)}</>;
}
