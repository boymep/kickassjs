import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

interface PageInfo {
  kind: 'intro' | 'chapter' | 'cheatsheet' | 'done';
  title: string;
  chapterIdx?: number;
}

interface Props {
  pages: PageInfo[];
  activeIdx: number;
  onSelect: (idx: number) => void;
}

export default function LessonTOC({ pages, activeIdx, onSelect }: Props) {
  return (
    <Box
      component="nav"
      aria-label="Содержание урока"
      sx={{
        borderLeft: 2,
        borderColor: 'divider',
        pl: 2,
      }}
    >
      <Typography
        variant="overline"
        sx={{ display: 'block', color: 'text.secondary', mb: 1.5, letterSpacing: '0.06em' }}
      >
        Содержание
      </Typography>
      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
        {pages.map((p, i) => {
          if (p.kind === 'done') return null;
          const isActive = i === activeIdx;
          const isCompleted = i < activeIdx;
          return (
            <Box
              key={i}
              component="li"
              onClick={() => onSelect(i)}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                py: 0.75,
                cursor: 'pointer',
                color: isActive ? 'primary.main' : 'text.primary',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.875rem',
                lineHeight: 1.4,
                transition: 'color 0.15s',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <Box sx={{ flexShrink: 0, mt: '2px', color: isActive ? 'primary.main' : isCompleted ? 'success.main' : 'text.disabled' }}>
                {isCompleted ? (
                  <CheckCircleIcon sx={{ fontSize: 16 }} />
                ) : isActive ? (
                  <RadioButtonCheckedIcon sx={{ fontSize: 16 }} />
                ) : (
                  <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                {p.kind === 'chapter' ? `${(p.chapterIdx ?? 0) + 1}. ${p.title}` : p.title}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
