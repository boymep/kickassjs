import { useState } from 'react';
import { Paper, Typography, Button, Box, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import type { TracingQuestion as TQ } from '../../types/quiz';
import CodeBlock from '../theory/CodeBlock';

interface Props {
  question: TQ;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export default function TracingQuestion({ question, onAnswer, answered }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    onAnswer(idx === question.correctIndex);
  };

  const varNames = question.steps.length > 0 ? Object.keys(question.steps[0].variables) : [];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Трейсинг
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {question.description}
      </Typography>
      <CodeBlock code={question.code} />

      {question.steps.length > 0 && (
        <TableContainer sx={{ my: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Шаг</TableCell>
                {varNames.map((v) => (
                  <TableCell key={v} sx={{ fontFamily: 'monospace' }}>{v}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {question.steps.map((step, i) => (
                <TableRow key={i}>
                  <TableCell>{step.label}</TableCell>
                  {varNames.map((v) => (
                    <TableCell key={v} sx={{ fontFamily: 'monospace' }}>
                      {String(step.variables[v])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Typography variant="body1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
        {question.question}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
