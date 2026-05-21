import { useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ARRAY = [3, 2, 4];
const TARGET = 6;

interface MapEntry {
  key: number;
  value: number;
  isNew?: boolean;
}

interface Step {
  currentIdx: number;
  num: number;
  complement: number;
  found: boolean;
  resultIndices: [number, number] | null;
  mapEntries: MapEntry[];
  description: string;
}

const steps: Step[] = [
  {
    currentIdx: 0,
    num: 3,
    complement: 3,
    found: false,
    resultIndices: null,
    mapEntries: [{ key: 3, value: 0, isNew: true }],
    description: 'i = 0, num = 3, complement = 3. Map пуст → записываем 3 → 0',
  },
  {
    currentIdx: 1,
    num: 2,
    complement: 4,
    found: false,
    resultIndices: null,
    mapEntries: [
      { key: 3, value: 0 },
      { key: 2, value: 1, isNew: true },
    ],
    description: 'i = 1, num = 2, complement = 4. Map.has(4) = false → записываем 2 → 1',
  },
  {
    currentIdx: 2,
    num: 4,
    complement: 2,
    found: true,
    resultIndices: [1, 2],
    mapEntries: [
      { key: 3, value: 0 },
      { key: 2, value: 1 },
    ],
    description: 'i = 2, num = 4, complement = 2. Map.has(2) = true → пара найдена: [1, 2]',
  },
];

const CELL = 48;
const GAP = 8;

export default function HashMapViz() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [stepIdx, setStepIdx] = useState(0);
  const step = stepIdx > 0 ? steps[stepIdx - 1]! : null;

  const PALETTE = {
    cellBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)',
    cellBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
    currentBg: isDark ? 'rgba(255,149,0,0.18)' : 'rgba(255,149,0,0.14)',
    currentBorder: '#ff9500',
    foundBg: isDark ? 'rgba(52,199,89,0.20)' : 'rgba(52,199,89,0.16)',
    foundBorder: '#34c759',
    newBg: isDark ? 'rgba(10,132,255,0.15)' : 'rgba(10,132,255,0.10)',
    newBorder: '#0a84ff',
    rowBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    rowBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    newColor: '#0a84ff',
    foundColor: '#34c759',
    currentColor: '#ff9500',
  };

  const isCurrent = (i: number) => step !== null && i === step.currentIdx && !step.found;
  const isResult = (i: number) =>
    step !== null && step.found && step.resultIndices !== null && step.resultIndices.includes(i);

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
        Задача Two Sum: массив [{ARRAY.join(', ')}], target = <b>{TARGET}</b>
      </Typography>

      {/* Array */}
      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Box sx={{ display: 'inline-flex', flexDirection: 'column', gap: 0.5, minWidth: '100%' }}>
          <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center' }}>
            {ARRAY.map((_, i) => (
              <Box key={i} sx={{ width: CELL, textAlign: 'center', fontSize: '0.7rem', color: 'text.disabled', fontFamily: 'monospace' }}>
                {i}
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center' }}>
            {ARRAY.map((v, i) => {
              const result = isResult(i);
              const current = isCurrent(i);
              const bg = result ? PALETTE.foundBg : current ? PALETTE.currentBg : PALETTE.cellBg;
              const border = result ? PALETTE.foundBorder : current ? PALETTE.currentBorder : PALETTE.cellBorder;
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
                    transition: 'background-color 0.25s, border-color 0.25s',
                  }}
                >
                  {v}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Complement */}
      {step && !step.found && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.8rem',
              fontWeight: 600,
              color: PALETTE.currentColor,
              border: 1,
              borderColor: PALETTE.currentColor,
            }}
          >
            complement = target − {step.num} = {step.complement}
          </Box>
        </Box>
      )}

      {/* Map table */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          Map (значение → индекс)
        </Typography>
        <Box
          sx={{
            border: 1,
            borderColor: PALETTE.rowBorder,
            borderRadius: 1.5,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 32px 1fr 100px',
              alignItems: 'center',
              px: 1.5,
              py: 0.75,
              bgcolor: PALETTE.rowBg,
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'text.secondary',
              borderBottom: 1,
              borderColor: PALETTE.rowBorder,
            }}
          >
            <Box>ключ</Box>
            <Box />
            <Box>значение</Box>
            <Box />
          </Box>
          {/* Rows */}
          {step === null || step.mapEntries.length === 0 ? (
            <Box sx={{ px: 1.5, py: 1.5, color: 'text.disabled', fontStyle: 'italic', fontSize: '0.85rem', textAlign: 'center' }}>
              (пусто)
            </Box>
          ) : (
            step.mapEntries.map((entry, i) => {
              const highlight = step.found && entry.key === step.complement;
              const isNew = !!entry.isNew;
              const bg = highlight ? PALETTE.foundBg : isNew ? PALETTE.newBg : 'transparent';
              const color = highlight ? PALETTE.foundColor : isNew ? PALETTE.newColor : 'text.primary';
              return (
                <Box
                  key={`${entry.key}-${entry.value}`}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 32px 1fr 100px',
                    alignItems: 'center',
                    px: 1.5,
                    py: 0.75,
                    fontSize: '0.9rem',
                    fontWeight: highlight || isNew ? 700 : 500,
                    bgcolor: bg,
                    color,
                    borderBottom: i < step.mapEntries.length - 1 ? 1 : 0,
                    borderColor: PALETTE.rowBorder,
                  }}
                >
                  <Box>{entry.key}</Box>
                  <Box sx={{ color: 'text.disabled' }}>→</Box>
                  <Box>{entry.value}</Box>
                  <Box sx={{ fontSize: '0.7rem', color: isNew ? PALETTE.newColor : 'transparent', fontWeight: 600 }}>
                    {isNew ? 'новая' : ''}
                  </Box>
                </Box>
              );
            })
          )}
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
