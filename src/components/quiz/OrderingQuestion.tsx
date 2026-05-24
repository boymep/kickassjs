import { useState } from 'react';
import { Alert, Box, Button, Paper, Typography } from '@mui/material';
import type { OrderingQuestion as OQ } from '../../types/quiz';
import { Inline } from '../../utils/renderInline';

interface Props {
  question: OQ;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function OrderingQuestion({ question, onAnswer, answered }: Props) {
  const [shuffled] = useState<string[]>(() => fisherYates(question.items));
  // clicks[i] = порядковый номер (1-based) назначенный shuffled[i], null = не выбран
  const [clicks, setClicks] = useState<(number | null)[]>(() =>
    Array(question.items.length).fill(null)
  );

  const nextNumber = clicks.filter((c) => c !== null).length + 1;
  const allAssigned = clicks.every((c) => c !== null);

  const handleClick = (idx: number) => {
    if (answered) return;
    setClicks((prev) => {
      const next = [...prev];
      if (next[idx] !== null) {
        // Снять номер и сдвинуть все последующие
        const removed = next[idx]!;
        next[idx] = null;
        return next.map((c) => (c !== null && c > removed ? c - 1 : c));
      } else {
        next[idx] = nextNumber;
        return next;
      }
    });
  };

  const handleCheck = () => {
    if (!allAssigned || answered) return;
    // Строим массив: какой shuffled-индекс стоит на позиции 1, 2, 3...
    const userOrder = Array(shuffled.length).fill(0);
    clicks.forEach((num, shuffledIdx) => {
      if (num !== null) userOrder[num - 1] = shuffledIdx;
    });
    // Правильный порядок — это question.items в оригинальном порядке
    // shuffled[userOrder[pos]] должен === question.items[pos]
    const isCorrect = userOrder.every(
      (shuffledIdx, pos) => shuffled[shuffledIdx] === question.items[pos]
    );
    onAnswer(isCorrect);
  };

  const getItemColor = (idx: number): string => {
    if (!answered || clicks[idx] === null) return 'inherit';
    const assignedPos = clicks[idx]! - 1; // 0-based
    const correctItem = question.items[assignedPos];
    return shuffled[idx] === correctItem ? 'success.main' : 'error.main';
  };

  const isCorrect =
    answered &&
    clicks.every((num, shuffledIdx) => {
      if (num === null) return false;
      return shuffled[shuffledIdx] === question.items[num - 1];
    });

  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 } }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Расставь по порядку
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        <Inline>{question.description}</Inline>
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {shuffled.map((item, idx) => {
          const num = clicks[idx];
          const color = answered ? getItemColor(idx) : 'text.primary';
          return (
            <Box
              key={idx}
              onClick={() => handleClick(idx)}
              sx={{
                position: 'relative',
                px: 2,
                py: 1,
                borderRadius: 1,
                border: '1px solid',
                borderColor: answered
                  ? getItemColor(idx) === 'success.main'
                    ? 'success.main'
                    : getItemColor(idx) === 'error.main'
                      ? 'error.main'
                      : 'divider'
                  : num !== null
                    ? 'primary.main'
                    : 'divider',
                cursor: answered ? 'default' : 'pointer',
                userSelect: 'none',
                color,
                '&:hover': answered ? {} : { borderColor: 'primary.main', bgcolor: 'action.hover' },
              }}
            >
              {num !== null && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -8,
                    left: -8,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: answered
                      ? getItemColor(idx) === 'success.main'
                        ? 'success.main'
                        : 'error.main'
                      : 'primary.main',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {num}
                </Box>
              )}
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                {item}
              </Typography>
            </Box>
          );
        })}
      </Box>
      {!answered && (
        <Button variant="contained" onClick={handleCheck} disabled={!allAssigned} sx={{ mt: 1 }}>
          Проверить
        </Button>
      )}
      {answered && (
        <Alert severity={isCorrect ? 'success' : 'error'} sx={{ mt: 2 }}>
          <Inline>{question.explanation}</Inline>
        </Alert>
      )}
    </Paper>
  );
}
