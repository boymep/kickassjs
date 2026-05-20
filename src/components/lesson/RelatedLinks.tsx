import { Box, Chip, Paper, Typography } from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import WarningIcon from '@mui/icons-material/Warning';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LinkIcon from '@mui/icons-material/Link';
import { Link as RouterLink } from 'react-router-dom';
import type { LessonRelated, RelatedKind } from '../../types/lesson';

interface RelatedLinksProps {
  items: LessonRelated[];
}

const KIND_PATH: Record<RelatedKind, string> = {
  'bug-hunt': '/bug-hunt',
  pitfall: '/js-pitfalls',
  pattern: '/pattern-game',
};

const KIND_LABEL: Record<RelatedKind, string> = {
  'bug-hunt': 'Найди баг',
  pitfall: 'JS-ловушки',
  pattern: 'Определи паттерн',
};

function kindIcon(kind: RelatedKind) {
  switch (kind) {
    case 'bug-hunt':
      return <BugReportIcon fontSize="small" />;
    case 'pitfall':
      return <WarningIcon fontSize="small" />;
    case 'pattern':
      return <PsychologyIcon fontSize="small" />;
  }
}

/**
 * Renders cross-links to other tools (Bug Hunt, JS Pitfalls, Pattern Game).
 * The destination pages don't yet support per-item deep linking, so the chip
 * navigates to the page itself; the label tells the reader what to look for.
 */
export default function RelatedLinks({ items }: RelatedLinksProps) {
  if (items.length === 0) return null;

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          mb: 1.25,
          color: 'text.secondary',
        }}
      >
        <LinkIcon fontSize="small" />
        <Typography variant="overline" sx={{ lineHeight: 1, m: 0, color: 'inherit' }}>
          Похожее в других разделах
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {items.map((it, i) => (
          <Chip
            key={`${it.kind}-${it.id}-${i}`}
            icon={kindIcon(it.kind)}
            label={`${KIND_LABEL[it.kind]} · ${it.label}`}
            component={RouterLink}
            to={KIND_PATH[it.kind]}
            clickable
            variant="outlined"
            sx={{ textDecoration: 'none', height: 'auto', py: 0.5, '& .MuiChip-label': { whiteSpace: 'normal' } }}
          />
        ))}
      </Box>
    </Paper>
  );
}
