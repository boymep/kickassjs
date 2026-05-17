import { List, ListItem, ListItemIcon, ListItemText, Typography, Paper, Chip, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import type { TestResult, TestCase } from '../../types/problem';

interface Props {
  results: TestResult[];
  testCases: TestCase[];
}

export default function TestResults({ results, testCases }: Props) {
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="h6">Результаты</Typography>
        <Chip
          label={`${passed}/${total}`}
          color={passed === total ? 'success' : 'error'}
          size="small"
        />
      </Box>
      <List dense>
        {results.map((r) => {
          const tc = testCases.find((t) => t.id === r.testCaseId);
          return (
            <ListItem key={r.testCaseId}>
              <ListItemIcon>
                {r.passed ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CancelIcon color="error" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={tc?.inputDisplay ?? r.testCaseId}
                secondary={
                  r.error
                    ? `Ошибка: ${r.error}`
                    : tc?.maxMs !== undefined
                      ? r.passed
                        ? `→ ${r.actual}мс (лимит: ${r.expected}мс)`
                        : `${r.actual}мс — превышает лимит ${r.expected}мс`
                      : r.passed
                        ? `→ ${JSON.stringify(r.actual)}`
                        : `Ожидалось: ${JSON.stringify(r.expected)}, получено: ${JSON.stringify(r.actual)}`
                }
                slotProps={{ secondary: { sx: { fontFamily: 'monospace', fontSize: '12px' } } }}
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}
