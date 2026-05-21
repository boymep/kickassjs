import { useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Step {
  left: number;
  right: number;
  sum: number;
  found: boolean;
  description: string;
}

const arr = [1, 2, 4, 6, 8, 11];
const target = 10;

const steps: Step[] = [
  { left: 0, right: 5, sum: 12, found: false, description: '1 + 11 = 12 > 10 — сдвигаем right влево' },
  { left: 0, right: 4, sum: 9,  found: false, description: '1 + 8 = 9 < 10 — сдвигаем left вправо' },
  { left: 1, right: 4, sum: 10, found: true,  description: '2 + 8 = 10 — пара найдена!' },
];

const CELL = 44;
const GAP = 6;

export default function TwoPointersViz() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [stepIdx, setStepIdx] = useState(0);
  const step = stepIdx > 0 ? steps[stepIdx - 1] : null;

  const PALETTE = {
    cellBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)',
    cellBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
    foundBg: isDark ? 'rgba(52,199,89,0.20)' : 'rgba(52,199,89,0.18)',
    foundBorder: '#34c759',
    leftBg: isDark ? 'rgba(10,132,255,0.18)' : 'rgba(10,132,255,0.12)',
    leftBorder: '#0a84ff',
    rightBg: isDark ? 'rgba(255,59,48,0.18)' : 'rgba(255,59,48,0.12)',
    rightBorder: '#ff3b30',
    leftColor: '#0a84ff',
    rightColor: '#ff3b30',
  };

  type CellState = 'idle' | 'left' | 'right' | 'found';
  const cellState = (i: number): CellState => {
    if (!step) return 'idle';
    if (step.found && (i === step.left || i === step.right)) return 'found';
    if (i === step.left) return 'left';
    if (i === step.right) return 'right';
    return 'idle';
  };

  const cellStyle = (s: CellState) => {
    switch (s) {
      case 'found':
        return { bg: PALETTE.foundBg, border: PALETTE.foundBorder };
      case 'left':
        return { bg: PALETTE.leftBg, border: PALETTE.leftBorder };
      case 'right':
        return { bg: PALETTE.rightBg, border: PALETTE.rightBorder };
      default:
        return { bg: PALETTE.cellBg, border: PALETTE.cellBorder };
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        backgroundColor: (t) =>
          t.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Массив: [{arr.join(', ')}] · цель: <b>{target}</b>
      </Typography>

      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Box sx={{ display: 'inline-flex', flexDirection: 'column', gap: 0.5, minWidth: '100%' }}>
          {/* Index row */}
          <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center' }}>
            {arr.map((_, i) => (
              <Box key={i} sx={{ width: CELL, textAlign: 'center', fontSize: '0.7rem', color: 'text.disabled', fontFamily: 'monospace' }}>
                {i}
              </Box>
            ))}
          </Box>
          {/* Cells */}
          <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center' }}>
            {arr.map((v, i) => {
              const cs = cellStyle(cellState(i));
              return (
                <Box
                  key={i}
                  sx={{
                    width: CELL,
                    height: CELL,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    bgcolor: cs.bg,
                    border: 1.5,
                    borderColor: cs.border,
                    color: 'text.primary',
                    transition: 'background-color 0.25s, border-color 0.25s',
                  }}
                >
                  {v}
                </Box>
              );
            })}
          </Box>
          {/* Pointer labels */}
          <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center', minHeight: 24, mt: 0.5 }}>
            {arr.map((_, i) => {
              if (!step) return <Box key={i} sx={{ width: CELL }} />;
              const tags: { label: string; color: string }[] = [];
              if (i === step.left) tags.push({ label: 'L', color: PALETTE.leftColor });
              if (i === step.right) tags.push({ label: 'R', color: PALETTE.rightColor });
              return (
                <Box key={i} sx={{ width: CELL, display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                  {tags.map((t) => (
                    <Box
                      key={t.label}
                      sx={{
                        px: 0.6,
                        borderRadius: 0.5,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: 'white',
                        bgcolor: t.color,
                        minWidth: 14,
                        textAlign: 'center',
                        lineHeight: 1.4,
                      }}
                    >
                      {t.label}
                    </Box>
                  ))}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Status */}
      <Box
        sx={{
          mt: 2,
          px: 2,
          py: 1.25,
          borderRadius: 1.5,
          textAlign: 'center',
          bgcolor: step?.found
            ? (t) => (t.palette.mode === 'dark' ? 'rgba(52,199,89,0.15)' : 'rgba(52,199,89,0.12)')
            : (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
          color: step?.found ? 'success.main' : 'text.secondary',
          fontWeight: step?.found ? 600 : 400,
        }}
      >
        <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 'inherit' }}>
          {step
            ? `Шаг ${stepIdx}: сумма = ${step.sum}${step.found ? ' = ' : ' ≠ '}${target}. ${step.description}`
            : 'Нажмите «Следующий шаг», чтобы начать'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center' }}>
        <Button
          size="small"
          variant="contained"
          disabled={stepIdx >= steps.length}
          onClick={() => setStepIdx((s) => s + 1)}
          endIcon={<ArrowForwardIcon />}
        >
          Следующий шаг
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setStepIdx(0)}
          startIcon={<RestartAltIcon />}
          disabled={stepIdx === 0}
        >
          Сбросить
        </Button>
      </Box>
    </Box>
  );
}
