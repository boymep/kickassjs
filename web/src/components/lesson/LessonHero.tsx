import { Box, Chip, Paper, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import { Link as RouterLink } from 'react-router-dom';
import type { LessonIntro } from '../../types/lesson';
import Markdown from './Markdown';

interface LessonHeroProps {
  title: string;
  description?: string;
  intro: LessonIntro;
}

export default function LessonHero({ title, description, intro }: LessonHeroProps) {
  const hasPrereqs = intro.prerequisites && intro.prerequisites.length > 0;
  return (
    <Paper sx={{ p: { xs: 2.5, md: 4 } }}>
      <Typography variant="h4" sx={{ mb: 1 }}>{title}</Typography>
      {description && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Chip
          icon={<AccessTimeIcon />}
          size="small"
          label={`≈ ${intro.estimatedMinutes} мин`}
          variant="outlined"
        />
      </Box>

      {hasPrereqs && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'text.secondary',
            }}
          >
            <SchoolIcon fontSize="small" />
            <Typography variant="caption" sx={{ lineHeight: 1, fontWeight: 600 }}>
              Перед этим:
            </Typography>
          </Box>
          {intro.prerequisites!.map((p) => (
            <Chip
              key={p.slug}
              size="small"
              variant="outlined"
              color="primary"
              label={p.title}
              component={RouterLink}
              to={`/topic/${p.slug}`}
              clickable
              sx={{ textDecoration: 'none' }}
            />
          ))}
        </Box>
      )}

      {intro.interviewAngle && (
        <Box
          sx={{
            p: { xs: 1.5, md: 2 },
            mb: 2,
            borderRadius: 1.5,
            backgroundColor: (t) => (t.palette.mode === 'dark' ? 'rgba(255,193,7,0.08)' : 'rgba(255,193,7,0.10)'),
            borderLeft: 4,
            borderColor: 'warning.main',
          }}
        >
          <Typography
            variant="overline"
            color="warning.main"
            sx={{ display: 'block', mb: 0.5, lineHeight: 1.4 }}
          >
            На что обращают внимание на собеседовании
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            {intro.interviewAngle}
          </Typography>
        </Box>
      )}
      <Box sx={{ '& > :first-of-type': { mt: 0 } }}>
        <Markdown>{intro.whyItMatters}</Markdown>
      </Box>
    </Paper>
  );
}
