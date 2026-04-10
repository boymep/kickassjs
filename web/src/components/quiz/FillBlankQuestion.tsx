import { useState } from 'react';
import { Paper, Typography, Button, Box, Alert } from '@mui/material';
import type { FillBlankQuestion as FBQ } from '../../types/quiz';
import CodeBlock from '../theory/CodeBlock';

interface Props {
  question: FBQ;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export default function FillBlankQuestion({ question, onAnswer, answered }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    onAnswer(idx === question.correctIndex);
  };

  const codeDisplay = selected !== null
    ? question.codeWithBlanks.replace('___BLANK___', `/* ${question.options[selected]} */`)
    : question.codeWithBlanks;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Заполни пропуск
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {question.description}
      </Typography>
      <CodeBlock code={codeDisplay} />
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
