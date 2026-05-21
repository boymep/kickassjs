import { useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Step {
  left: number;
  right: number;
  mid: number;
  hours: number;
  fits: boolean;
  result: number | null;
  description: string;
  calcDetail: string;
}

const orders = [3, 6, 7, 11];
const maxHours = 8;

function calcHours(speed: number): { total: number; detail: string } {
  const parts = orders.map((o) => Math.ceil(o / speed));
  const total = parts.reduce((a, b) => a + b, 0);
  const detail = orders.map((o, i) => `⌈${o}/${speed}⌉=${parts[i]}`).join(' + ');
  return { total, detail };
}

function buildSteps(): Step[] {
  const result: Step[] = [];
  let left = 1;
  let right = 11;
  let best: number | null = null;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const { total, detail } = calcHours(mid);
    const fits = total <= maxHours;
    if (fits) best = mid;
    result.push({
      left,
      right,
      mid,
      hours: total,
      fits,
      result: fits ? mid : best,
      description: fits
        ? `speed=${mid}: ${total} ≤ ${maxHours} — подходит, сужаем right=${mid - 1}`
        : `speed=${mid}: ${total} > ${maxHours} — не подходит, сужаем left=${mid + 1}`,
      calcDetail: `${detail} = ${total}`,
    });
    if (fits) right = mid - 1;
    else left = mid + 1;
  }
  return result;
}

const steps = buildSteps();
const searchSpace = Array.from({ length: 11 }, (_, i) => i + 1);

const CELL = 40;
const GAP = 5;

export default function BinarySearchAnswerViz() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [stepIdx, setStepIdx] = useState(0);
  const step = stepIdx > 0 ? steps[stepIdx - 1] : null;
  const isFinished = stepIdx >= steps.length;
  const finalResult = isFinished ? steps[steps.length - 1]!.result : null;

  const PALETTE = {
    cellBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)',
    cellBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
    activeBg: isDark ? 'rgba(10,132,255,0.15)' : 'rgba(10,132,255,0.10)',
    activeBorder: isDark ? 'rgba(10,132,255,0.45)' : 'rgba(10,132,255,0.4)',
    okBg: isDark ? 'rgba(52,199,89,0.22)' : 'rgba(52,199,89,0.18)',
    okBorder: '#34c759',
    badBg: isDark ? 'rgba(255,59,48,0.20)' : 'rgba(255,59,48,0.15)',
    badBorder: '#ff3b30',
    leftColor: '#0a84ff',
    midColor: '#ff9500',
    rightColor: '#ff3b30',
  };

  type CellState = 'idle' | 'active' | 'midOk' | 'midBad';
  const cellState = (val: number): CellState => {
    if (!step) return 'idle';
    if (val === step.mid) return step.fits ? 'midOk' : 'midBad';
    if (val >= step.left && val <= step.right) return 'active';
    return 'idle';
  };

  const cellStyle = (s: CellState) => {
    switch (s) {
      case 'midOk':
        return { bg: PALETTE.okBg, border: PALETTE.okBorder };
      case 'midBad':
        return { bg: PALETTE.badBg, border: PALETTE.badBorder };
      case 'active':
        return { bg: PALETTE.activeBg, border: PALETTE.activeBorder };
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
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>
        Задача: orders = [{orders.join(', ')}], hours = <b>{maxHours}</b>
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Ищем минимальную скорость доставки. Пространство ответов: speed от 1 до {Math.max(...orders)}.
      </Typography>

      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Box sx={{ display: 'inline-flex', flexDirection: 'column', gap: 0.5, minWidth: '100%' }}>
          {/* "speed" label row */}
          <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center' }}>
            {searchSpace.map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: CELL,
                  textAlign: 'center',
                  fontSize: '0.65rem',
                  color: 'text.disabled',
                }}
              >
                {i === 0 ? 'speed' : ''}
              </Box>
            ))}
          </Box>
          {/* Cells */}
          <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center' }}>
            {searchSpace.map((v) => {
              const cs = cellStyle(cellState(v));
              return (
                <Box
                  key={v}
                  sx={{
                    width: CELL,
                    height: CELL,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '0.9rem',
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
          {/* Pointers */}
          <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center', minHeight: 24, mt: 0.5 }}>
            {searchSpace.map((v) => {
              if (!step) return <Box key={v} sx={{ width: CELL }} />;
              const tags: { label: string; color: string }[] = [];
              if (v === step.left) tags.push({ label: 'L', color: PALETTE.leftColor });
              if (v === step.mid) tags.push({ label: 'M', color: PALETTE.midColor });
              if (v === step.right) tags.push({ label: 'R', color: PALETTE.rightColor });
              return (
                <Box key={v} sx={{ width: CELL, display: 'flex', justifyContent: 'center', gap: 0.5 }}>
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

      {/* Calc + status */}
      {step && (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box
            sx={{
              px: 1.5,
              py: 1,
              borderRadius: 1.5,
              fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
              fontSize: '0.8rem',
              bgcolor: (t) =>
                t.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              color: 'text.secondary',
            }}
          >
            часов = {step.calcDetail}
          </Box>
          <Box
            sx={{
              px: 2,
              py: 1.25,
              borderRadius: 1.5,
              textAlign: 'center',
              bgcolor: step.fits
                ? (t) => (t.palette.mode === 'dark' ? 'rgba(52,199,89,0.15)' : 'rgba(52,199,89,0.12)')
                : (t) => (t.palette.mode === 'dark' ? 'rgba(255,59,48,0.15)' : 'rgba(255,59,48,0.10)'),
              color: step.fits ? 'success.main' : 'error.main',
              fontWeight: 500,
            }}
          >
            <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 'inherit' }}>
              Шаг {stepIdx}: {step.description}
            </Typography>
          </Box>
        </Box>
      )}

      {!step && !isFinished && (
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
          <Typography variant="body2">Нажмите «Следующий шаг», чтобы начать</Typography>
        </Box>
      )}

      {isFinished && (
        <Box
          sx={{
            mt: 2,
            px: 2,
            py: 1.5,
            borderRadius: 1.5,
            textAlign: 'center',
            bgcolor: (t) =>
              t.palette.mode === 'dark' ? 'rgba(52,199,89,0.15)' : 'rgba(52,199,89,0.12)',
            color: 'success.main',
            fontWeight: 600,
          }}
        >
          <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 'inherit' }}>
            Минимальная скорость = {finalResult}. Искали не в массиве, а в пространстве ответов.
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center' }}>
        <Button
          size="small"
          variant="contained"
          disabled={isFinished}
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
