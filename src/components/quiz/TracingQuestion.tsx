import { useState } from 'react';
import { Paper, Typography, Button, Box, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import type { TracingQuestion as TQ } from '../../types/quiz';
import CodeBlock from '../theory/CodeBlock';
import { Inline } from '../../utils/renderInline';

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

  // Show only first ~60% of steps before answering, full table after
  const totalSteps = question.steps.length;
  const visibleCount = answered ? totalSteps : Math.max(1, Math.ceil(totalSteps * 0.6));
  const visibleSteps = question.steps.slice(0, visibleCount);
  const hiddenCount = totalSteps - visibleCount;

  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 } }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Трейсинг
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        <Inline>{question.description}</Inline>
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
              {visibleSteps.map((step, i) => (
                <TableRow key={i}>
                  <TableCell>{step.label}</TableCell>
                  {varNames.map((v) => (
                    <TableCell key={v} sx={{ fontFamily: 'monospace' }}>
                      {String(step.variables[v])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {hiddenCount > 0 && (
                <TableRow>
                  <TableCell
                    colSpan={varNames.length + 1}
                    sx={{ textAlign: 'center', color: 'text.secondary', fontStyle: 'italic', py: 1.5 }}
                  >
                    ... продолжите самостоятельно ({hiddenCount} шаг{hiddenCount === 1 ? '' : hiddenCount < 5 ? 'а' : 'ов'} скрыт{hiddenCount === 1 ? '' : 'о'})
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Typography variant="body1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
        <Inline>{question.question}</Inline>
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
          <Inline>{question.explanation}</Inline>
        </Alert>
      )}
    </Paper>
  );
}
