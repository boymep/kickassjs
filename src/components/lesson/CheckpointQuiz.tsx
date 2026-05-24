import { useMemo, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Stack from './Stack';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import type { QuizQuestion } from '../../types/quiz';
import QuestionRenderer, { shuffleOptions } from './QuestionRenderer';

interface CheckpointQuizProps {
  /** 1–3 questions; rendered sequentially with next-button advance. */
  questions: QuizQuestion[];
}

/**
 * Inline mini-quiz between theory chunks. Always visible — the user can answer
 * or simply scroll past. Answers are not persisted (no progress tracking).
 */
export default function CheckpointQuiz({ questions }: CheckpointQuizProps) {
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(false);
  const shuffled = useMemo(() => questions.map(shuffleOptions), [questions]);

  if (questions.length === 0) return null;

  const current = shuffled[idx];
  const isLast = idx >= questions.length - 1;

  return (
    <Box
      sx={{
        my: 3,
        p: { xs: 2, md: 2.5 },
        borderRadius: 2,
        border: 1,
        borderColor: 'primary.light',
        backgroundColor: (t) =>
          t.palette.mode === 'dark' ? 'rgba(0,122,255,0.05)' : 'rgba(0,122,255,0.04)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'primary.main' }}>
        <LightbulbIcon fontSize="small" />
        <Typography variant="subtitle2" sx={{ lineHeight: 1.3, m: 0, color: 'inherit' }}>
          Проверьте себя
          {questions.length > 1 ? ` · вопрос ${idx + 1} из ${questions.length}` : ''}
        </Typography>
      </Box>
      <QuestionRenderer question={current} answered={answered} onAnswer={() => setAnswered(true)} />
      {answered && !isLast && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              setIdx((i) => i + 1);
              setAnswered(false);
            }}
          >
            Следующий вопрос
          </Button>
        </Box>
      )}
    </Box>
  );
}
