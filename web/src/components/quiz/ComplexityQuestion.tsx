import { useState } from 'react';
import { Paper, Typography, Button, Box, Alert } from '@mui/material';
import type { ComplexityQuestion as CQ } from '../../types/quiz';
import CodeBlock from '../theory/CodeBlock';

interface Props {
  question: CQ;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export default function ComplexityQuestion({ question, onAnswer, answered }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    onAnswer(idx === question.correctIndex);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Оценка сложности
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {question.description}
      </Typography>
      <CodeBlock code={question.code} />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
        {question.options.map((opt, i) => (
          <Button
            key={i}
            variant={selected === i ? 'contained' : 'outlined'}
            color={
              answered
                ? i === question.correctIndex
                  ? 'success'
                  : selected === i
                    ? 'error'
                    : 'inherit'
                : 'primary'
            }
            onClick={() => handleSelect(i)}
            disabled={answered}
            sx={{ fontFamily: 'monospace', textTransform: 'none' }}
          >
            {opt}
          </Button>
        ))}
      </Box>
      {answered && (
        <Alert severity={selected === question.correctIndex ? 'success' : 'error'} sx={{ mt: 2 }}>
          {question.explanation}
        </Alert>
      )}
    </Paper>
  );
}
