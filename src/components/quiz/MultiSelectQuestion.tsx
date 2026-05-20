import { useState } from 'react';
import { Alert, Box, Button, Checkbox, FormControlLabel, Paper, Typography } from '@mui/material';
import type { MultiSelectQuestion as MSQ } from '../../types/quiz';
import CodeBlock from '../theory/CodeBlock';
import { Inline } from '../../utils/renderInline';

interface Props {
  question: MSQ;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export default function MultiSelectQuestion({ question, onAnswer, answered }: Props) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggle = (idx: number) => {
    if (answered) return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const handleCheck = () => {
    if (answered) return;
    const correct = new Set(question.correctIndices);
    const isCorrect =
      selected.size === correct.size && [...selected].every((i) => correct.has(i));
    onAnswer(isCorrect);
  };

  const correct = new Set(question.correctIndices);

  const getColor = (idx: number): 'success' | 'error' | 'default' => {
    if (!answered) return 'default';
    if (correct.has(idx)) return 'success';
    if (selected.has(idx)) return 'error';
    return 'default';
  };

  const isCorrect =
    answered &&
    selected.size === correct.size &&
    [...selected].every((i) => correct.has(i));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Выберите все правильные
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        <Inline>{question.description}</Inline>
      </Typography>
      {question.code && <CodeBlock code={question.code} />}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: question.code ? 2 : 0 }}>
        {question.options.map((opt, i) => {
          const color = getColor(i);
          return (
            <FormControlLabel
              key={i}
              control={
                <Checkbox
                  checked={selected.has(i)}
                  onChange={() => toggle(i)}
                  disabled={answered}
                  color={color === 'default' ? 'primary' : color}
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    color: answered
                      ? color === 'success'
                        ? 'success.main'
                        : color === 'error'
                          ? 'error.main'
                          : 'text.secondary'
                      : 'text.primary',
                  }}
                >
                  {opt}
                </Typography>
              }
            />
          );
        })}
      </Box>
      {!answered && (
        <Button
          variant="contained"
          onClick={handleCheck}
          disabled={selected.size === 0}
          sx={{ mt: 2 }}
        >
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
