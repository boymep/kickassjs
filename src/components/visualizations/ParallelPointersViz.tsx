import { useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Step {
  slow: number;
  fast: number;
  array: number[];
  wrote: boolean;
  description: string;
  done: boolean;
}

const initialArr = [1, 1, 2, 2, 3];

function computeSteps(): Step[] {
  const result: Step[] = [];
  const nums = [...initialArr];
  let slow = 0;

  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast]!;
      result.push({
        slow,
        fast,
        array: [...nums],
        wrote: true,
        description: `nums[${fast}] = ${nums[slow]} ≠ nums[${slow - 1}] = ${nums[slow - 1]} — slow++, записываем ${nums[slow]} в позицию ${slow}`,
        done: false,
      });
    } else {
      result.push({
        slow,
        fast,
        array: [...nums],
        wrote: false,
        description: `nums[${fast}] = ${nums[fast]} === nums[${slow}] = ${nums[slow]} — дубликат, пропускаем`,
        done: false,
      });
    }
  }

  result.push({
    slow,
    fast: nums.length - 1,
    array: [...nums],
    wrote: false,
    description: `Готово. Уникальных элементов: ${slow + 1}, результат: [${nums.slice(0, slow + 1).join(', ')}]`,
    done: true,
  });

  return result;
}

const allSteps = computeSteps();
const CELL = 44;
const GAP = 6;

export default function ParallelPointersViz() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [stepIdx, setStepIdx] = useState(0);
  const step = stepIdx > 0 ? allSteps[stepIdx - 1] : null;
  const displayArr = step ? step.array : initialArr;

  const PALETTE = {
    cellBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)',
    cellBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
    keepBg: isDark ? 'rgba(10,132,255,0.12)' : 'rgba(10,132,255,0.08)',
    keepBorder: isDark ? 'rgba(10,132,255,0.35)' : 'rgba(10,132,255,0.3)',
    slowBg: isDark ? 'rgba(10,132,255,0.20)' : 'rgba(10,132,255,0.15)',
    slowBorder: '#0a84ff',
    fastBg: isDark ? 'rgba(255,149,0,0.22)' : 'rgba(255,149,0,0.18)',
    fastBorder: '#ff9500',
    doneBg: isDark ? 'rgba(52,199,89,0.20)' : 'rgba(52,199,89,0.18)',
    doneBorder: '#34c759',
    slowColor: '#0a84ff',
    fastColor: '#ff9500',
    doneColor: '#34c759',
  };

  type CellState = 'idle' | 'keep' | 'slow' | 'fast' | 'done';
  const cellState = (i: number): CellState => {
    if (!step) return 'idle';
    if (step.done) {
      if (i <= step.slow) return 'done';
      return 'idle';
    }
    if (i === step.slow && i === step.fast) return 'slow';
    if (i === step.slow) return 'slow';
    if (i === step.fast) return 'fast';
    if (i < step.slow) return 'keep';
    return 'idle';
  };

  const cellStyle = (s: CellState) => {
    switch (s) {
      case 'done':
        return { bg: PALETTE.doneBg, border: PALETTE.doneBorder };
      case 'slow':
        return { bg: PALETTE.slowBg, border: PALETTE.slowBorder };
      case 'fast':
        return { bg: PALETTE.fastBg, border: PALETTE.fastBorder };
      case 'keep':
        return { bg: PALETTE.keepBg, border: PALETTE.keepBorder };
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
        Удаление дубликатов in-place. Исходный массив: [{initialArr.join(', ')}]
      </Typography>

      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Box sx={{ display: 'inline-flex', flexDirection: 'column', gap: 0.5, minWidth: '100%' }}>
          <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center' }}>
            {displayArr.map((_, i) => (
              <Box key={i} sx={{ width: CELL, textAlign: 'center', fontSize: '0.7rem', color: 'text.disabled', fontFamily: 'monospace' }}>
                {i}
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center' }}>
            {displayArr.map((v, i) => {
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
          <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center', minHeight: 24, mt: 0.5 }}>
            {displayArr.map((_, i) => {
              if (!step) return <Box key={i} sx={{ width: CELL }} />;
              const tags: { label: string; color: string }[] = [];
              if (!step.done) {
                if (i === step.slow) tags.push({ label: 'S', color: PALETTE.slowColor });
                if (i === step.fast && step.fast !== step.slow) tags.push({ label: 'F', color: PALETTE.fastColor });
              } else if (i === step.slow) {
                tags.push({ label: 'end', color: PALETTE.doneColor });
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

      <Box
        sx={{
          mt: 2,
          px: 2,
          py: 1.25,
          borderRadius: 1.5,
          textAlign: 'center',
          bgcolor: step?.done
            ? (t) => (t.palette.mode === 'dark' ? 'rgba(52,199,89,0.15)' : 'rgba(52,199,89,0.12)')
            : (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
          color: step?.done ? 'success.main' : 'text.secondary',
          fontWeight: step?.done ? 600 : 400,
        }}
      >
        <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 'inherit' }}>
          {step
            ? `Шаг ${stepIdx}: ${step.description}`
            : 'Нажмите «Следующий шаг», чтобы начать. S — slow (позиция для записи), F — fast (читает массив).'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center' }}>
        <Button
          size="small"
          variant="contained"
          disabled={stepIdx >= allSteps.length}
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
