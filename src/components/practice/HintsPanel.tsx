import { Alert, AlertTitle, Box, Button } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import Markdown from '../lesson/Markdown';

interface HintsButtonProps {
  hints: string[];
  hintIndex: number;
  onNext: () => void;
}

export function HintsButton({ hints, hintIndex, onNext }: HintsButtonProps) {
  if (hints.length === 0) return null;
  return (
    <Button
      variant="outlined"
      startIcon={<LightbulbIcon />}
      onClick={onNext}
      disabled={hintIndex >= hints.length - 1}
    >
      Подсказка {hintIndex >= 0 ? `(${hintIndex + 1}/${hints.length})` : ''}
    </Button>
  );
}

interface HintsDisplayProps {
  hints: string[];
  hintIndex: number;
}

export function HintsDisplay({ hints, hintIndex }: HintsDisplayProps) {
  if (hintIndex < 0 || hints.length === 0) return null;
  return (
    <Box sx={{ mb: 3 }}>
      {hints.slice(0, hintIndex + 1).map((hint, i) => (
        <Alert key={i} severity="info" sx={{ mb: 1, '&:last-child': { mb: 0 } }}>
          <AlertTitle>Подсказка {i + 1}</AlertTitle>
          <Markdown compact>{hint}</Markdown>
        </Alert>
      ))}
    </Box>
  );
}
