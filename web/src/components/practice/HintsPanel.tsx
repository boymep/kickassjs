import { useState } from 'react';
import { Alert, Box, Button } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

interface HintsPanelProps {
  hints: string[];
}

/** Progressive hint reveal — reused across problem kinds. */
export default function HintsPanel({ hints }: HintsPanelProps) {
  const [hintIndex, setHintIndex] = useState(-1);
  if (hints.length === 0) return null;

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<LightbulbIcon />}
        onClick={() => setHintIndex((i) => Math.min(i + 1, hints.length - 1))}
        disabled={hintIndex >= hints.length - 1}
        sx={{ mr: 2 }}
      >
        Подсказка {hintIndex >= 0 ? `(${hintIndex + 1}/${hints.length})` : ''}
      </Button>
      {hintIndex >= 0 && (
        <Box sx={{ mt: 2, width: '100%' }}>
          {hints.slice(0, hintIndex + 1).map((hint, i) => (
            <Alert key={i} severity="info" sx={{ mb: 1 }}>
              Подсказка {i + 1}: {hint}
            </Alert>
          ))}
        </Box>
      )}
    </>
  );
}
