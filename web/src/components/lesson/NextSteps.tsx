import { Box, Button, Paper,  Typography } from '@mui/material';
import Stack from './Stack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { Link as RouterLink } from 'react-router-dom';
import type { Lesson } from '../../types/lesson';
import { algorithmTopics, jsTopics, nodejsTopics } from '../../data/topics';

const allTopics = [...algorithmTopics, ...jsTopics, ...nodejsTopics];

function lookupTitle(slug: string): string {
  return allTopics.find((t) => t.slug === slug)?.title ?? slug;
}

interface NextStepsProps {
  slug: string;
  nextTopics?: Lesson['nextTopics'];
}

export default function NextSteps({ slug, nextTopics }: NextStepsProps) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Что дальше</Typography>
      <Stack spacing={2}>
        <Button
          component={RouterLink}
          to={`/topic/${slug}/practice`}
          variant="contained"
          size="large"
          startIcon={<FitnessCenterIcon />}
          endIcon={<ArrowForwardIcon />}
          sx={{ alignSelf: 'flex-start' }}
        >
          Перейти к практике
        </Button>
        {nextTopics && nextTopics.length > 0 && (
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Рекомендованные следующие темы
            </Typography>
            <Stack spacing={1}>
              {nextTopics.map((nt) => (
                <Button
                  key={nt.slug}
                  component={RouterLink}
                  to={`/topic/${nt.slug}`}
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ justifyContent: 'space-between', textTransform: 'none', textAlign: 'left' }}
                >
                  <Box>
                    <Box sx={{ fontWeight: 600 }}>{lookupTitle(nt.slug)}</Box>
                    <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 400 }}>{nt.reason}</Box>
                  </Box>
                </Button>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
