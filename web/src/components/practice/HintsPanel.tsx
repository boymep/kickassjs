import { Alert, Box, Button } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

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
    <Box sx={{ mt: 2 }}>
      {hints.slice(0, hintIndex + 1).map((hint, i) => (
        <Alert key={i} severity="info" sx={{ mb: 1 }}>
          Подсказка {i + 1}: {hint}
        </Alert>
      ))}
    </Box>
  );
}
