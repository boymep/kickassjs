import { useCallback } from 'react';
import { Box, Link, Stack, Typography } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import type { Chapter } from '../../types/lesson';
import { useLessonScrollSpy } from '../../hooks/useLessonScrollSpy';

interface TableOfContentsProps {
  chapters: Chapter[];
  /** Final-quiz / flashcard / interview-qa anchors get appended below chapters. */
  extras?: { id: string; label: string }[];
}

export default function TableOfContents({ chapters, extras = [] }: TableOfContentsProps) {
  const ids = chapters.map((c) => c.id);
  const active = useLessonScrollSpy(ids);

  const handleClick = useCallback((targetId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update the URL hash without triggering an extra scroll.
      history.replaceState(null, '', `#${targetId}`);
    }
  }, []);

  return (
    <Box
      component="nav"
      aria-label="Содержание урока"
      sx={{
        position: 'sticky',
        top: 96,
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        py: 1.5,
        pl: 2,
        borderLeft: 2,
        borderColor: 'divider',
      }}
    >
      <Typography
        variant="overline"
        sx={{ display: 'block', mb: 1, color: 'text.secondary', lineHeight: 1.4 }}
      >
        Содержание
      </Typography>
      <Stack spacing={0.25}>
        {chapters.map((c) => {
          const isActive = active === c.id;
          const targetId = `ch-${c.id}`;
          return (
            <Link
              key={c.id}
              href={`#${targetId}`}
              onClick={handleClick(targetId)}
              underline="none"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                color: isActive ? 'primary.main' : 'text.primary',
                fontWeight: isActive ? 600 : 400,
                py: 0.6,
                px: 1,
                ml: -1,
                borderRadius: 1,
                fontSize: '0.875rem',
                lineHeight: 1.3,
                backgroundColor: isActive
                  ? (t) => (t.palette.mode === 'dark' ? 'rgba(0,122,255,0.10)' : 'rgba(0,122,255,0.06)')
                  : 'transparent',
                transition: 'background-color 120ms, color 120ms',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: (t) =>
                    t.palette.mode === 'dark' ? 'rgba(0,122,255,0.12)' : 'rgba(0,122,255,0.08)',
                },
              }}
            >
              {isActive ? (
                <RadioButtonCheckedIcon sx={{ fontSize: 14, color: 'primary.main', flexShrink: 0 }} />
              ) : (
                <RadioButtonUncheckedIcon sx={{ fontSize: 14, color: 'text.disabled', flexShrink: 0 }} />
              )}
              <Box
                component="span"
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {c.title}
              </Box>
            </Link>
          );
        })}
        {extras.length > 0 && (
          <Box sx={{ mt: 1, pt: 1, borderTop: 1, borderColor: 'divider' }}>
            {extras.map((e) => (
              <Link
                key={e.id}
                href={`#${e.id}`}
                onClick={handleClick(e.id)}
                underline="none"
                sx={{
                  display: 'block',
                  py: 0.5,
                  px: 1,
                  ml: -1,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  lineHeight: 1.3,
                  color: 'text.secondary',
                  transition: 'background-color 120ms, color 120ms',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: (t) =>
                      t.palette.mode === 'dark' ? 'rgba(0,122,255,0.10)' : 'rgba(0,122,255,0.06)',
                  },
                }}
              >
                {e.label}
              </Link>
            ))}
          </Box>
        )}
      </Stack>
    </Box>
  );
}
