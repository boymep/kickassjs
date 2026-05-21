import { useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Step {
  left: number;
  right: number;
  mid: number;
  found: boolean;
  description: string;
}

const arr = [1, 3, 5, 7, 9, 11, 13];
const target = 9;

const steps: Step[] = [
  { left: 0, right: 6, mid: 3, found: false, description: 'arr[3] = 7 < 9 — ищем в правой половине' },
  { left: 4, right: 6, mid: 5, found: false, description: 'arr[5] = 11 > 9 — ищем в левой половине' },
  { left: 4, right: 4, mid: 4, found: true,  description: 'arr[4] = 9 — элемент найден!' },
];

const CELL = 44;
const GAP = 6;

export default function BinarySearchViz() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [stepIdx, setStepIdx] = useState(0);
  const step = stepIdx > 0 ? steps[stepIdx - 1] : null;

  const PALETTE = {
    cellBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)',
    cellBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
    activeBg: isDark ? 'rgba(10,132,255,0.15)' : 'rgba(10,132,255,0.10)',
    activeBorder: isDark ? 'rgba(10,132,255,0.45)' : 'rgba(10,132,255,0.4)',
    midBg: isDark ? 'rgba(255,149,0,0.20)' : 'rgba(255,149,0,0.18)',
    midBorder: '#ff9500',
    foundBg: isDark ? 'rgba(52,199,89,0.25)' : 'rgba(52,199,89,0.20)',
    foundBorder: '#34c759',
    leftColor: '#0a84ff',
    midColor: '#ff9500',
    rightColor: '#ff3b30',
  };

  const cellState = (i: number): 'idle' | 'active' | 'mid' | 'found' => {
    if (!step) return 'idle';
    if (step.found && i === step.mid) return 'found';
    if (i === step.mid) return 'mid';
    if (i >= step.left && i <= step.right) return 'active';
    return 'idle';
  };

  const cellStyle = (s: ReturnType<typeof cellState>) => {
    switch (s) {
      case 'found':
        return { bg: PALETTE.foundBg, border: PALETTE.foundBorder, textColor: 'text.primary' };
      case 'mid':
        return { bg: PALETTE.midBg, border: PALETTE.midBorder, textColor: 'text.primary' };
      case 'active':
        return { bg: PALETTE.activeBg, border: PALETTE.activeBorder, textColor: 'text.primary' };
      default:
        return { bg: PALETTE.cellBg, border: PALETTE.cellBorder, textColor: 'text.disabled' };
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

      {/* Cells row */}
      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Box
          sx={{
            display: 'inline-flex',
            flexDirection: 'column',
            gap: 0.5,
            minWidth: '100%',
            justifyContent: 'center',
          }}
        >
          {/* Index row */}
          <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center' }}>
            {arr.map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: CELL,
                  textAlign: 'center',
                  fontSize: '0.7rem',
                  color: 'text.disabled',
                  fontFamily: 'monospace',
                }}
              >
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
                    color: cs.textColor,
                    transition: 'background-color 0.25s, border-color 0.25s',
                  }}
                >
                  {v}
                </Box>
              );
            })}
          </Box>

          {/* Pointers */}
          <Box
            sx={{
              display: 'flex',
              gap: `${GAP}px`,
              justifyContent: 'center',
              minHeight: 36,
              mt: 0.5,
            }}
          >
            {arr.map((_, i) => {
              if (!step) return <Box key={i} sx={{ width: CELL }} />;
              const tags: { label: string; color: string }[] = [];
              if (i === step.left) tags.push({ label: 'L', color: PALETTE.leftColor });
              if (i === step.mid) tags.push({ label: 'M', color: PALETTE.midColor });
              if (i === step.right) tags.push({ label: 'R', color: PALETTE.rightColor });
              return (
                <Box
                  key={i}
                  sx={{
                    width: CELL,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.25,
                  }}
                >
                  {tags.length > 0 && (
                    <>
                      <Box
                        sx={{
                          width: 0,
                          height: 0,
                          borderLeft: '5px solid transparent',
                          borderRight: '5px solid transparent',
                          borderBottom: `6px solid ${tags[0]!.color}`,
                          opacity: 0,
                          display: 'none',
                        }}
                      />
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
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
                    </>
                  )}
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
          minHeight: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
            ? `Шаг ${stepIdx}: ${step.description}`
            : 'Нажмите «Следующий шаг», чтобы начать'}
        </Typography>
      </Box>

      {/* Controls */}
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
