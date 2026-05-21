import { useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ARRAY = ['a', 'b', 'a', 'c', 'b', 'a'];

interface MapEntry {
  key: string;
  value: number;
  isNew?: boolean;
  isUpdated?: boolean;
}

interface Step {
  currentIdx: number;
  mapEntries: MapEntry[];
  description: string;
}

const steps: Step[] = [
  { currentIdx: 0, mapEntries: [{ key: 'a', value: 1, isNew: true }], description: 'i = 0, элемент "a" — ключа нет в Map, создаём a → 1' },
  { currentIdx: 1, mapEntries: [{ key: 'a', value: 1 }, { key: 'b', value: 1, isNew: true }], description: 'i = 1, элемент "b" — ключа нет, создаём b → 1' },
  { currentIdx: 2, mapEntries: [{ key: 'a', value: 2, isUpdated: true }, { key: 'b', value: 1 }], description: 'i = 2, элемент "a" — ключ есть, увеличиваем: a → 2' },
  { currentIdx: 3, mapEntries: [{ key: 'a', value: 2 }, { key: 'b', value: 1 }, { key: 'c', value: 1, isNew: true }], description: 'i = 3, элемент "c" — ключа нет, создаём c → 1' },
  { currentIdx: 4, mapEntries: [{ key: 'a', value: 2 }, { key: 'b', value: 2, isUpdated: true }, { key: 'c', value: 1 }], description: 'i = 4, элемент "b" — ключ есть, увеличиваем: b → 2' },
  { currentIdx: 5, mapEntries: [{ key: 'a', value: 3, isUpdated: true }, { key: 'b', value: 2 }, { key: 'c', value: 1 }], description: 'i = 5, элемент "a" — ключ есть, увеличиваем: a → 3' },
];

const CELL = 44;
const GAP = 6;

export default function FrequencyCountViz() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [stepIdx, setStepIdx] = useState(0);
  const step = stepIdx > 0 ? steps[stepIdx - 1]! : null;
  const isDone = stepIdx >= steps.length;

  const PALETTE = {
    cellBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)',
    cellBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
    currentBg: isDark ? 'rgba(255,149,0,0.18)' : 'rgba(255,149,0,0.14)',
    currentBorder: '#ff9500',
    seenBg: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    newBg: isDark ? 'rgba(10,132,255,0.15)' : 'rgba(10,132,255,0.10)',
    newColor: '#0a84ff',
    updatedBg: isDark ? 'rgba(255,149,0,0.20)' : 'rgba(255,149,0,0.16)',
    updatedColor: '#ff9500',
    rowBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    rowBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
  };

  const isCurrent = (i: number) => step !== null && i === step.currentIdx;
  const isSeen = (i: number) => step !== null && i < step.currentIdx;

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
        Подсчёт частот символов: ["{ARRAY.join('", "')}"]
      </Typography>

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
              const current = isCurrent(i);
              const seen = isSeen(i);
              const bg = current ? PALETTE.currentBg : seen ? PALETTE.seenBg : PALETTE.cellBg;
              const border = current ? PALETTE.currentBorder : PALETTE.cellBorder;
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
                    opacity: seen ? 0.6 : 1,
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

      <Box sx={{ mt: 2 }}>
        <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          Map (символ → частота)
        </Typography>
        <Box
          sx={{
            border: 1,
            borderColor: PALETTE.rowBorder,
            borderRadius: 1.5,
            overflow: 'hidden',
          }}
        >
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
            <Box>символ</Box>
            <Box />
            <Box>частота</Box>
            <Box />
          </Box>
          {step === null || step.mapEntries.length === 0 ? (
            <Box sx={{ px: 1.5, py: 1.5, color: 'text.disabled', fontStyle: 'italic', fontSize: '0.85rem', textAlign: 'center' }}>
              (пусто)
            </Box>
          ) : (
            step.mapEntries.map((entry, i) => {
              const isNew = !!entry.isNew;
              const isUpdated = !!entry.isUpdated;
              const bg = isNew ? PALETTE.newBg : isUpdated ? PALETTE.updatedBg : 'transparent';
              const color = isNew ? PALETTE.newColor : isUpdated ? PALETTE.updatedColor : 'text.primary';
              const badge = isNew ? 'новая' : isUpdated ? '+1' : '';
              return (
                <Box
                  key={entry.key}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 32px 1fr 100px',
                    alignItems: 'center',
                    px: 1.5,
                    py: 0.75,
                    fontSize: '0.9rem',
                    fontWeight: isNew || isUpdated ? 700 : 500,
                    bgcolor: bg,
                    color,
                    borderBottom: i < step.mapEntries.length - 1 ? 1 : 0,
                    borderColor: PALETTE.rowBorder,
                  }}
                >
                  <Box>"{entry.key}"</Box>
                  <Box sx={{ color: 'text.disabled' }}>→</Box>
                  <Box>{entry.value}</Box>
                  <Box sx={{ fontSize: '0.7rem', fontWeight: 600, color: isNew ? PALETTE.newColor : isUpdated ? PALETTE.updatedColor : 'transparent' }}>
                    {badge}
                  </Box>
                </Box>
              );
            })
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
          bgcolor: isDone
            ? (t) => (t.palette.mode === 'dark' ? 'rgba(52,199,89,0.15)' : 'rgba(52,199,89,0.12)')
            : (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
          color: isDone ? 'success.main' : 'text.secondary',
          fontWeight: isDone ? 600 : 400,
        }}
      >
        <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 'inherit' }}>
          {isDone
            ? 'Готово. Подсчёт частот завершён.'
            : step
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
