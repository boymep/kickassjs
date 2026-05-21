import { useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ARRAY = [2, 3, 1, 2, 4, 3];
const TARGET = 7;

interface Step {
  left: number;
  right: number;
  sum: number;
  minLen: number;
  action: 'expand' | 'shrink';
  conditionMet: boolean;
  isNewMin: boolean;
  description: string;
}

const steps: Step[] = [
  { left: 0, right: 0, sum: 2,  minLen: Infinity, action: 'expand', conditionMet: false, isNewMin: false, description: 'Расширяем: +2, сумма = 2 < 7' },
  { left: 0, right: 1, sum: 5,  minLen: Infinity, action: 'expand', conditionMet: false, isNewMin: false, description: 'Расширяем: +3, сумма = 5 < 7' },
  { left: 0, right: 2, sum: 6,  minLen: Infinity, action: 'expand', conditionMet: false, isNewMin: false, description: 'Расширяем: +1, сумма = 6 < 7' },
  { left: 0, right: 3, sum: 8,  minLen: 4,        action: 'expand', conditionMet: true,  isNewMin: true,  description: 'Расширяем: +2, сумма = 8 ≥ 7 → длина = 4, minLen = 4' },
  { left: 1, right: 3, sum: 6,  minLen: 4,        action: 'shrink', conditionMet: false, isNewMin: false, description: 'Сжимаем: −arr[0]=2, сумма = 6 < 7' },
  { left: 1, right: 4, sum: 10, minLen: 4,        action: 'expand', conditionMet: true,  isNewMin: false, description: 'Расширяем: +4, сумма = 10 ≥ 7 → длина = 4' },
  { left: 2, right: 4, sum: 7,  minLen: 3,        action: 'shrink', conditionMet: true,  isNewMin: true,  description: 'Сжимаем: −arr[1]=3, сумма = 7 ≥ 7 → длина = 3, minLen = 3' },
  { left: 3, right: 4, sum: 6,  minLen: 3,        action: 'shrink', conditionMet: false, isNewMin: false, description: 'Сжимаем: −arr[2]=1, сумма = 6 < 7' },
  { left: 3, right: 5, sum: 9,  minLen: 3,        action: 'expand', conditionMet: true,  isNewMin: false, description: 'Расширяем: +3, сумма = 9 ≥ 7 → длина = 3' },
  { left: 4, right: 5, sum: 7,  minLen: 2,        action: 'shrink', conditionMet: true,  isNewMin: true,  description: 'Сжимаем: −arr[3]=2, сумма = 7 ≥ 7 → длина = 2, minLen = 2' },
  { left: 5, right: 5, sum: 3,  minLen: 2,        action: 'shrink', conditionMet: false, isNewMin: false, description: 'Сжимаем: −arr[4]=4, сумма = 3 < 7. Финальный ответ: 2' },
];

const CELL = 48;
const GAP = 6;

export default function DynamicWindowViz() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [stepIdx, setStepIdx] = useState(0);
  const step = stepIdx > 0 ? steps[stepIdx - 1]! : null;
  const windowLen = step ? step.right - step.left + 1 : 0;

  const PALETTE = {
    cellBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)',
    cellBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
    expandBg: isDark ? 'rgba(10,132,255,0.15)' : 'rgba(10,132,255,0.10)',
    expandBorder: '#0a84ff',
    validBg: isDark ? 'rgba(52,199,89,0.18)' : 'rgba(52,199,89,0.14)',
    validBorder: '#34c759',
    expandColor: '#0a84ff',
    shrinkColor: '#ff9500',
    leftColor: '#0a84ff',
    rightColor: '#ff9500',
  };

  const inWindow = (i: number) => step !== null && i >= step.left && i <= step.right;

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
          Кратчайший подмассив с суммой ≥ <b>{TARGET}</b>. Массив [{ARRAY.join(', ')}]
        </Typography>
        {step && (
          <Typography
            variant="body2"
            sx={{ color: step.isNewMin ? 'success.main' : 'text.secondary', fontWeight: 600 }}
          >
            minLen = {step.minLen === Infinity ? '∞' : step.minLen}
          </Typography>
        )}
      </Box>

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
              const inside = inWindow(i);
              const bg = inside
                ? (step!.conditionMet ? PALETTE.validBg : PALETTE.expandBg)
                : PALETTE.cellBg;
              const border = inside
                ? (step!.conditionMet ? PALETTE.validBorder : PALETTE.expandBorder)
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
                    transition: 'background-color 0.25s, border-color 0.25s',
                  }}
                >
                  {v}
                </Box>
              );
            })}
          </Box>
          {/* Pointer pills */}
          <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center', minHeight: 24, mt: 0.5 }}>
            {ARRAY.map((_, i) => {
              const tags: { label: string; color: string }[] = [];
              if (step) {
                if (i === step.left) tags.push({ label: 'L', color: PALETTE.leftColor });
                if (i === step.right && step.right !== step.left) tags.push({ label: 'R', color: PALETTE.rightColor });
              }
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

      {step && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, gap: 2, flexWrap: 'wrap' }}>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.8rem',
              fontWeight: 700,
              color: step.action === 'expand' ? PALETTE.expandColor : PALETTE.shrinkColor,
              border: 1,
              borderColor: step.action === 'expand' ? PALETTE.expandColor : PALETTE.shrinkColor,
            }}
          >
            {step.action === 'expand' ? '→ расширение' : '← сжатие'}
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: step.conditionMet ? 'success.main' : 'text.secondary' }}>
            сумма = {step.sum} {step.conditionMet ? `≥ ${TARGET}` : `< ${TARGET}`} · длина = {windowLen}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          mt: 2,
          px: 2,
          py: 1.25,
          borderRadius: 1.5,
          textAlign: 'center',
          bgcolor: step?.isNewMin
            ? (t) => (t.palette.mode === 'dark' ? 'rgba(52,199,89,0.15)' : 'rgba(52,199,89,0.12)')
            : (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
          color: step?.isNewMin ? 'success.main' : 'text.secondary',
          fontWeight: step?.isNewMin ? 600 : 400,
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
