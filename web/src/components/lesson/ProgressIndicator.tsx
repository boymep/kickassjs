import { Box, CircularProgress, Typography } from '@mui/material';

interface ProgressIndicatorProps {
  /** Completion fraction in [0, 1]. */
  pct: number;
  /** Diameter in px. */
  size?: number;
  /** Show numeric percentage in the centre. */
  showLabel?: boolean;
  /** Override colour for the determinate stroke; defaults to MUI primary. */
  color?: 'primary' | 'success' | 'warning';
}

/** Circular progress ring, used in LessonHero and ProgressDashboard cards. */
export default function ProgressIndicator({
  pct,
  size = 56,
  showLabel = true,
  color = 'primary',
}: ProgressIndicatorProps) {
  const clamped = Math.max(0, Math.min(1, pct));
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        sx={{ color: 'action.disabledBackground' }}
      />
      <CircularProgress
        variant="determinate"
        value={clamped * 100}
        size={size}
        color={color}
        sx={{ position: 'absolute', left: 0 }}
      />
      {showLabel && (
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            {Math.round(clamped * 100)}%
          </Typography>
        </Box>
      )}
    </Box>
  );
}
