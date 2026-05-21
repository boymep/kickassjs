import { useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const input = [2, 1, 4, 3, 5];

interface Step {
  currentIndex: number;
  stack: number[]; // индексы из input
  result: (number | null)[];
  poppedIndices: number[];
  action: 'push' | 'pop-then-push' | 'done';
  description: string;
}

function buildSteps(): Step[] {
  const result: Step[] = [];
  const stack: number[] = [];
  const res: (number | null)[] = new Array(input.length).fill(null);

  for (let i = 0; i < input.length; i++) {
    const popped: number[] = [];
    while (stack.length > 0 && input[i]! > input[stack[stack.length - 1]!]!) {
      const idx = stack.pop()!;
      res[idx] = input[i]!;
      popped.push(idx);
    }
    if (popped.length > 0) {
      stack.push(i);
      result.push({
        currentIndex: i,
        stack: [...stack],
        result: [...res],
        poppedIndices: popped,
        action: 'pop-then-push',
        description: `Элемент ${input[i]} больше вершины стека — извлекаем ${popped.map((p) => input[p]).join(', ')} (для них ответ = ${input[i]}), кладём ${input[i]}`,
      });
    } else {
      stack.push(i);
      result.push({
        currentIndex: i,
        stack: [...stack],
        result: [...res],
        poppedIndices: [],
        action: 'push',
        description:
          stack.length === 1
            ? `Элемент ${input[i]}: стек пуст, кладём ${input[i]}`
            : `Элемент ${input[i]} не больше вершины стека (${input[stack[stack.length - 2]!]}), просто кладём ${input[i]}`,
      });
    }
  }
  const finalRes = [...res];
  const remaining = [...stack];
  for (const idx of remaining) {
    if (finalRes[idx] === null) finalRes[idx] = -1;
  }
  result.push({
    currentIndex: -1,
    stack: [...stack],
    result: finalRes,
    poppedIndices: [],
    action: 'done',
    description:
      'Обход завершён. Оставшиеся в стеке элементы не имеют следующего большего → −1',
  });
  return result;
}

const steps = buildSteps();

const CELL = 44;
const GAP = 6;

export default function MonotonicStackViz() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [stepIdx, setStepIdx] = useState(0);
  const step = stepIdx > 0 ? steps[stepIdx - 1]! : null;

  const PALETTE = {
    cellBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)',
    cellBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
    currentBg: isDark ? 'rgba(255,149,0,0.20)' : 'rgba(255,149,0,0.14)',
    currentBorder: '#ff9500',
    poppedBg: isDark ? 'rgba(255,59,48,0.20)' : 'rgba(255,59,48,0.14)',
    poppedBorder: '#ff3b30',
    stackBg: isDark ? 'rgba(10,132,255,0.18)' : 'rgba(10,132,255,0.12)',
    stackBorder: '#0a84ff',
    answerBg: isDark ? 'rgba(52,199,89,0.20)' : 'rgba(52,199,89,0.14)',
    answerColor: '#34c759',
    doneColor: '#34c759',
  };

  const isCurrent = (i: number) => step !== null && i === step.currentIndex;
  const isPopped = (i: number) => step !== null && step.poppedIndices.includes(i);
  const inStack = (i: number) => step !== null && step.stack.includes(i);

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
        Next Greater Element для [{input.join(', ')}]
      </Typography>

      {/* Array */}
      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Box sx={{ display: 'inline-flex', flexDirection: 'column', gap: 0.5, minWidth: '100%' }}>
          <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center' }}>
            {input.map((_, i) => (
              <Box key={i} sx={{ width: CELL, textAlign: 'center', fontSize: '0.7rem', color: 'text.disabled', fontFamily: 'monospace' }}>
                {i}
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center' }}>
            {input.map((v, i) => {
              const popped = isPopped(i);
              const current = isCurrent(i);
              const onStack = inStack(i) && !current;
              const bg = current
                ? PALETTE.currentBg
                : popped
                  ? PALETTE.poppedBg
                  : onStack
                    ? PALETTE.stackBg
                    : PALETTE.cellBg;
              const border = current
                ? PALETTE.currentBorder
                : popped
                  ? PALETTE.poppedBorder
                  : onStack
                    ? PALETTE.stackBorder
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
        </Box>
      </Box>

      {/* Stack */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5, textAlign: 'center' }}>
          Стек (хранит индексы, значения подписаны)
        </Typography>
        <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center', minHeight: CELL + 20 }}>
          {step === null || step.stack.length === 0 ? (
            <Box sx={{ color: 'text.disabled', fontStyle: 'italic', fontSize: '0.85rem' }}>
              (пусто)
            </Box>
          ) : (
            step.stack.map((idx, i) => {
              const isTop = i === step.stack.length - 1;
              return (
                <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25 }}>
                  <Box
                    sx={{
                      width: CELL,
                      height: CELL,
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '1rem',
                      bgcolor: isTop ? PALETTE.currentBg : PALETTE.stackBg,
                      border: 1.5,
                      borderColor: isTop ? PALETTE.currentBorder : PALETTE.stackBorder,
                      color: 'text.primary',
                    }}
                  >
                    {input[idx]}
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace' }}>
                    [{idx}]
                  </Typography>
                </Box>
              );
            })
          )}
        </Box>
      </Box>

      {/* Result */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          Результат (следующий больший)
        </Typography>
        <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center' }}>
          {input.map((_, i) => {
            const r = step?.result[i] ?? null;
            const filled = r !== null;
            return (
              <Box
                key={i}
                sx={{
                  width: CELL,
                  height: CELL * 0.85,
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  bgcolor: filled ? PALETTE.answerBg : PALETTE.cellBg,
                  border: 1.5,
                  borderColor: filled ? PALETTE.answerColor : PALETTE.cellBorder,
                  color: filled ? PALETTE.answerColor : 'text.disabled',
                  transition: 'background-color 0.25s, border-color 0.25s, color 0.25s',
                }}
              >
                {filled ? r : '?'}
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box
        sx={{
          mt: 2,
          px: 2,
          py: 1.25,
          borderRadius: 1.5,
          textAlign: 'center',
          bgcolor: step?.action === 'done'
            ? (t) => (t.palette.mode === 'dark' ? 'rgba(52,199,89,0.15)' : 'rgba(52,199,89,0.12)')
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
