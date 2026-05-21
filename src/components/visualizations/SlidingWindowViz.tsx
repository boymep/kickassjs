import { useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ARRAY = [2, 1, 5, 1, 3, 2];
const K = 3;

interface Step {
  start: number;
  end: number;
  sum: number;
  maxSum: number;
  isNewMax: boolean;
  addedIdx: number | null;
  removedIdx: number | null;
  description: string;
}

const steps: Step[] = [
  { start: 0, end: 2, sum: 8, maxSum: 8, isNewMax: true,  addedIdx: null, removedIdx: null, description: 'Первое окно [2, 1, 5], сумма = 8' },
  { start: 1, end: 3, sum: 7, maxSum: 8, isNewMax: false, addedIdx: 3, removedIdx: 0,    description: 'Сдвиг: +arr[3]=1, −arr[0]=2 → сумма = 7' },
  { start: 2, end: 4, sum: 9, maxSum: 9, isNewMax: true,  addedIdx: 4, removedIdx: 1,    description: 'Сдвиг: +arr[4]=3, −arr[1]=1 → сумма = 9, новый максимум' },
  { start: 3, end: 5, sum: 6, maxSum: 9, isNewMax: false, addedIdx: 5, removedIdx: 2,    description: 'Сдвиг: +arr[5]=2, −arr[2]=5 → сумма = 6' },
];

const CELL = 48;
const GAP = 6;

export default function SlidingWindowViz() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [stepIdx, setStepIdx] = useState(0);
  const step = stepIdx > 0 ? steps[stepIdx - 1]! : null;

  const PALETTE = {
    cellBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)',
    cellBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
    windowBg: isDark ? 'rgba(10,132,255,0.15)' : 'rgba(10,132,255,0.10)',
    windowBorder: '#0a84ff',
    maxBg: isDark ? 'rgba(52,199,89,0.20)' : 'rgba(52,199,89,0.16)',
    maxBorder: '#34c759',
    addedBorder: '#34c759',
    removedBorder: '#ff3b30',
    addedColor: '#34c759',
    removedColor: '#ff3b30',
  };

  const inWindow = (i: number) => step !== null && i >= step.start && i <= step.end;

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="body2" color="text.secondary">
          Массив [{ARRAY.join(', ')}], размер окна <b>k = {K}</b>
        </Typography>
        {step && (
          <Typography variant="body2" sx={{ color: step.isNewMax ? 'success.main' : 'text.secondary', fontWeight: 600 }}>
            maxSum = {step.maxSum}
          </Typography>
        )}
      </Box>

      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Box sx={{ display: 'inline-flex', flexDirection: 'column', gap: 0.5, minWidth: '100%' }}>
          {/* +/- markers */}
          <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center', minHeight: 20 }}>
            {ARRAY.map((v, i) => (
              <Box key={i} sx={{ width: CELL, textAlign: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                {step?.addedIdx === i && <Box component="span" sx={{ color: PALETTE.addedColor }}>+{v}</Box>}
                {step?.removedIdx === i && <Box component="span" sx={{ color: PALETTE.removedColor }}>−{v}</Box>}
              </Box>
            ))}
          </Box>
          {/* Index row */}
          <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center' }}>
            {ARRAY.map((_, i) => (
              <Box key={i} sx={{ width: CELL, textAlign: 'center', fontSize: '0.7rem', color: 'text.disabled', fontFamily: 'monospace' }}>
                {i}
              </Box>
            ))}
          </Box>
          {/* Cells */}
          <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center' }}>
            {ARRAY.map((v, i) => {
              const inside = inWindow(i);
              const isAdded = step !== null && i === step.addedIdx;
              const isRemoved = step !== null && i === step.removedIdx;
              const bg = isAdded
                ? PALETTE.maxBg
                : isRemoved
                  ? 'transparent'
                  : inside
                    ? (step!.isNewMax ? PALETTE.maxBg : PALETTE.windowBg)
                    : PALETTE.cellBg;
              const border = isAdded
                ? PALETTE.addedBorder
                : isRemoved
                  ? PALETTE.removedBorder
                  : inside
                    ? (step!.isNewMax ? PALETTE.maxBorder : PALETTE.windowBorder)
                    : PALETTE.cellBorder;
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
                    fontSize: '1rem',
                    bgcolor: bg,
                    border: 1.5,
                    borderColor: border,
                    color: 'text.primary',
                    opacity: isRemoved ? 0.6 : 1,
                    transition: 'background-color 0.25s, border-color 0.25s, opacity 0.25s',
                  }}
                >
                  {v}
                </Box>
              );
            })}
          </Box>
          {/* sum label */}
          {step && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: step.isNewMax ? PALETTE.maxBg : PALETTE.windowBg,
                  color: step.isNewMax ? 'success.main' : 'primary.main',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                сумма = {step.sum}
                {step.isNewMax ? ' ← новый максимум' : ''}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          mt: 2,
          px: 2,
          py: 1.25,
          borderRadius: 1.5,
          textAlign: 'center',
          bgcolor: (t) =>
            t.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
          color: 'text.secondary',
        }}
      >
        <Typography variant="body2" sx={{ color: 'inherit' }}>
          {step
            ? `Шаг ${stepIdx} / ${steps.length}: ${step.description}`
            : 'Нажмите «Следующий шаг», чтобы начать.'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center' }}>
        <Button
          size="small"
          variant="contained"
          disabled={stepIdx >= steps.length}
          onClick={() => setStepIdx((s) => Math.min(s + 1, steps.length))}
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
