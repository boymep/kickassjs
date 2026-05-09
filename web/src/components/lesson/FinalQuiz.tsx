import { useMemo, useState } from 'react';
import { Box, Button, LinearProgress, Paper,  Typography } from '@mui/material';
import Stack from './Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReplayIcon from '@mui/icons-material/Replay';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import type { QuizQuestion } from '../../types/quiz';
import QuestionRenderer, { shuffleOptions } from './QuestionRenderer';

interface FinalQuizProps {
  questions: QuizQuestion[];
}

interface AnswerLog {
  id: string;
  correct: boolean;
}

/**
 * End-of-lesson quiz. Linear navigation, immediate feedback, summary screen with
 * "Repeat weak" CTA. Each question shuffles its options once per session.
 * Results are session-only — no persistence.
 */
export default function FinalQuiz({ questions }: FinalQuizProps) {
  const [current, setCurrent] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [log, setLog] = useState<AnswerLog[]>([]);
  const [done, setDone] = useState(false);
  const [weakOnly, setWeakOnly] = useState(false);

  const total = questions.length;
  const activeSet = useMemo(() => {
    if (!weakOnly) return questions;
    const wrong = new Set(log.filter((l) => !l.correct).map((l) => l.id));
    return questions.filter((q) => wrong.has(q.id));
  }, [questions, weakOnly, log]);

  const shuffled = useMemo(() => activeSet.map(shuffleOptions), [activeSet]);
  const question = shuffled[current];

  if (total === 0) return null;

  if (done) {
    const correctCount = log.filter((l) => l.correct).length;
    const wrongCount = log.length - correctCount;

    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <EmojiEventsIcon color="warning" />
          <Typography variant="h5">Финальный квиз пройден</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Правильно {correctCount} из {log.length}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          {wrongCount > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<ReplayIcon />}
              onClick={() => {
                setWeakOnly(true);
                setCurrent(0);
                setAnswered(false);
                setLog([]);
                setDone(false);
              }}
            >
              Повторить слабые ({wrongCount})
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={() => {
              setWeakOnly(false);
              setCurrent(0);
              setAnswered(false);
              setLog([]);
              setDone(false);
            }}
          >
            Начать заново
          </Button>
        </Stack>
      </Paper>
    );
  }

  if (!question) {
    // Edge case: weak filter left zero questions.
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>Все вопросы решены верно</Typography>
        <Button variant="outlined" onClick={() => { setWeakOnly(false); setLog([]); setCurrent(0); }}>
          Начать заново
        </Button>
      </Paper>
    );
  }

  const handleAnswer = (correct: boolean) => {
    setAnswered(true);
    setLog((prev) => [...prev, { id: questions[current]?.id ?? '', correct }]);
  };

  const handleNext = () => {
    const isLast = current + 1 >= shuffled.length;
    if (isLast) {
      setDone(true);
      return;
    }
    setCurrent((c) => c + 1);
    setAnswered(false);
  };

  const handlePrev = () => {
    if (current === 0) return;
    setCurrent((c) => c - 1);
    setAnswered(false);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {weakOnly ? 'Повторение слабых' : `Вопрос ${current + 1} из ${shuffled.length}`}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={((current + 1) / shuffled.length) * 100}
        sx={{ mb: 3, borderRadius: 1 }}
      />
      <QuestionRenderer question={question} answered={answered} onAnswer={handleAnswer} />
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
        <Button size="small" startIcon={<ArrowBackIcon />} disabled={current === 0} onClick={handlePrev}>
          Предыдущий
        </Button>
        {answered && (
          <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={handleNext}>
            {current + 1 >= shuffled.length ? 'Завершить' : 'Следующий'}
          </Button>
        )}
      </Stack>
    </Box>
  );
}
