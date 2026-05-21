import { useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const input = '({[]})';

interface Step {
  charIndex: number;
  stack: string[];
  action: 'push' | 'pop' | 'done';
  description: string;
}

const steps: Step[] = [
  { charIndex: 0, stack: ['('],                action: 'push', description: "Читаем '(' — кладём в стек" },
  { charIndex: 1, stack: ['(', '{'],           action: 'push', description: "Читаем '{' — кладём в стек" },
  { charIndex: 2, stack: ['(', '{', '['],      action: 'push', description: "Читаем '[' — кладём в стек" },
  { charIndex: 3, stack: ['(', '{'],           action: 'pop',  description: "Читаем ']' — совпадает с '[' на вершине, извлекаем" },
  { charIndex: 4, stack: ['('],                action: 'pop',  description: "Читаем '}' — совпадает с '{' на вершине, извлекаем" },
  { charIndex: 5, stack: [],                   action: 'pop',  description: "Читаем ')' — совпадает с '(' на вершине, извлекаем" },
  { charIndex: -1, stack: [],                  action: 'done', description: 'Стек пуст. Строка валидна.' },
];

const CELL = 44;
const GAP = 6;

const bracketColor: Record<string, string> = {
  '(': '#0a84ff',
  ')': '#0a84ff',
  '{': '#34c759',
  '}': '#34c759',
  '[': '#ff9500',
  ']': '#ff9500',
};

export default function StackViz() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [stepIdx, setStepIdx] = useState(0);
  const step = stepIdx > 0 ? steps[stepIdx - 1]! : null;

  const PALETTE = {
    cellBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)',
    cellBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
    activeBg: isDark ? 'rgba(255,149,0,0.18)' : 'rgba(255,149,0,0.14)',
    activeBorder: '#ff9500',
    doneBg: isDark ? 'rgba(52,199,89,0.20)' : 'rgba(52,199,89,0.16)',
    doneColor: '#34c759',
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
        Проверка сбалансированности скобок: <code>{input}</code>
      </Typography>

      {/* String chars */}
      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center' }}>
          {[...input].map((ch, i) => {
            const isCurrent = step !== null && step.charIndex === i;
            const isPast = step !== null && step.charIndex !== -1 && i < step.charIndex;
            const color = bracketColor[ch] ?? 'text.primary';
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
                  fontFamily: 'monospace',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  bgcolor: isCurrent ? PALETTE.activeBg : PALETTE.cellBg,
                  border: 1.5,
                  borderColor: isCurrent ? PALETTE.activeBorder : PALETTE.cellBorder,
                  color,
                  opacity: isPast ? 0.5 : 1,
                  transition: 'background-color 0.25s, border-color 0.25s, opacity 0.25s',
                }}
              >
                {ch}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Stack — visually grows upward */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1, textAlign: 'center' }}>
          Стек (вершина сверху)
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column-reverse',
            alignItems: 'center',
            gap: `${GAP}px`,
            minHeight: 3 * (CELL + GAP),
            justifyContent: 'flex-start',
          }}
        >
          {step === null || step.stack.length === 0 ? (
            <Box sx={{ color: 'text.disabled', fontStyle: 'italic', fontSize: '0.85rem' }}>
              (пусто)
            </Box>
          ) : (
            step.stack.map((ch, i) => {
              const isTop = i === step.stack.length - 1;
              return (
                <Box
                  key={i}
                  sx={{
                    width: CELL * 1.5,
                    height: CELL,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'monospace',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    bgcolor: isTop && step.action !== 'done' ? PALETTE.activeBg : PALETTE.cellBg,
                    border: 1.5,
                    borderColor: isTop && step.action !== 'done' ? PALETTE.activeBorder : PALETTE.cellBorder,
                    color: bracketColor[ch] ?? 'text.primary',
                  }}
                >
                  {ch}
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
          bgcolor: step?.action === 'done'
            ? PALETTE.doneBg
            : (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
          color: step?.action === 'done' ? 'success.main' : 'text.secondary',
          fontWeight: step?.action === 'done' ? 600 : 400,
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
