import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import Stack from './Stack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import Markdown from './Markdown';
import { Inline } from '../../utils/renderInline';
import type { InterviewQuestion } from '../../types/lesson';

interface InterviewQACardProps {
  items: InterviewQuestion[];
}

/**
 * Accordion of "typical interviewer questions" with short and full answers.
 * The full answer is rendered with Markdown to allow rich formatting (lists, code, links).
 */
export default function InterviewQACard({ items }: InterviewQACardProps) {
  if (items.length === 0) return null;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <QuestionAnswerIcon color="primary" />
        <Typography variant="h5" sx={{ lineHeight: 1.3, m: 0 }}>
          Типичные вопросы на собеседовании
        </Typography>
      </Box>
      <Stack spacing={1.5}>
        {items.map((q) => (
          <Accordion
            key={q.id}
            disableGutters
            square={false}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  <Inline>{q.question}</Inline>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  <Inline>{q.shortAnswer}</Inline>
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Markdown>{q.fullAnswer}</Markdown>
              {q.followUps && q.followUps.length > 0 && (
                <Box sx={{ mt: 2, pl: 2, borderLeft: 3, borderColor: 'primary.light' }}>
                  <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Возможные follow-up
                  </Typography>
                  <Box component="ul" sx={{ pl: 2.5, m: 0 }}>
                    {q.followUps.map((fu, i) => (
                      <Box component="li" key={i} sx={{ mb: 0.25 }}>
                        <Typography variant="body2" component="span">
                          <Inline>{fu}</Inline>
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Box>
  );
}
