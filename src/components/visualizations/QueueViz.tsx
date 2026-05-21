import { useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Step {
  queue: string[];
  action: 'enqueue' | 'dequeue' | 'done';
  element: string;
  description: string;
  dequeued: string[];
}

const steps: Step[] = [
  { queue: ['A'],             action: 'enqueue', element: 'A', description: "enqueue('A') — добавляем в конец", dequeued: [] },
  { queue: ['A', 'B'],        action: 'enqueue', element: 'B', description: "enqueue('B') — добавляем в конец", dequeued: [] },
  { queue: ['A', 'B', 'C'],   action: 'enqueue', element: 'C', description: "enqueue('C') — добавляем в конец", dequeued: [] },
  { queue: ['A', 'B', 'C', 'D'], action: 'enqueue', element: 'D', description: "enqueue('D') — добавляем в конец", dequeued: [] },
  { queue: ['B', 'C', 'D'],   action: 'dequeue', element: 'A', description: "dequeue() — снимаем 'A' с головы. FIFO: первый пришёл — первый ушёл", dequeued: ['A'] },
  { queue: ['C', 'D'],        action: 'dequeue', element: 'B', description: "dequeue() — снимаем 'B' с головы", dequeued: ['A', 'B'] },
  { queue: ['D'],             action: 'dequeue', element: 'C', description: "dequeue() — снимаем 'C' с головы", dequeued: ['A', 'B', 'C'] },
  { queue: [],                action: 'dequeue', element: 'D', description: "dequeue() — снимаем 'D' с головы", dequeued: ['A', 'B', 'C', 'D'] },
  { queue: [],                action: 'done',    element: '',  description: 'Очередь пуста. Порядок извлечения: A → B → C → D', dequeued: ['A', 'B', 'C', 'D'] },
];

const CELL = 44;
const GAP = 6;

export default function QueueViz() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [stepIdx, setStepIdx] = useState(0);
  const step = stepIdx > 0 ? steps[stepIdx - 1]! : null;

  const PALETTE = {
    cellBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)',
    cellBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
    enqueueBg: isDark ? 'rgba(10,132,255,0.18)' : 'rgba(10,132,255,0.12)',
    enqueueBorder: '#0a84ff',
    dequeueBg: isDark ? 'rgba(255,149,0,0.22)' : 'rgba(255,149,0,0.16)',
    dequeueBorder: '#ff9500',
    doneBg: isDark ? 'rgba(52,199,89,0.20)' : 'rgba(52,199,89,0.16)',
  };

  const tail = step ? step.queue[step.queue.length - 1] : null;
  const head = step ? step.queue[0] : null;

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
        Очередь FIFO. Голова слева, хвост справа.
      </Typography>

      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center', minWidth: 'min-content' }}>
          {/* Head label */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60 }}>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700 }}>
              ← голова
            </Typography>
            <Typography variant="caption" color="text.disabled">
              dequeue
            </Typography>
          </Box>

          {/* Queue cells */}
          <Box
            sx={{
              display: 'flex',
              gap: `${GAP}px`,
              alignItems: 'center',
              minHeight: CELL + 4,
              px: 1,
              py: 0.5,
              borderRadius: 1.5,
              border: 1,
              borderColor: 'divider',
              minWidth: 4 * (CELL + GAP) + 16,
              justifyContent: 'flex-start',
            }}
          >
            {step === null || step.queue.length === 0 ? (
              <Box sx={{ color: 'text.disabled', fontStyle: 'italic', fontSize: '0.85rem', mx: 'auto' }}>
                (пусто)
              </Box>
            ) : (
              step.queue.map((ch, i) => {
                const isHead = i === 0 && step.action === 'dequeue';
                const isTail = i === step.queue.length - 1 && step.action === 'enqueue';
                const bg = isHead ? PALETTE.dequeueBg : isTail ? PALETTE.enqueueBg : PALETTE.cellBg;
                const border = isHead ? PALETTE.dequeueBorder : isTail ? PALETTE.enqueueBorder : PALETTE.cellBorder;
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
                      bgcolor: bg,
                      border: 1.5,
                      borderColor: border,
                      color: 'text.primary',
                      transition: 'background-color 0.25s, border-color 0.25s',
                    }}
                  >
                    {ch}
                  </Box>
                );
              })
            )}
          </Box>

          {/* Tail label */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60 }}>
            <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 700 }}>
              хвост →
            </Typography>
            <Typography variant="caption" color="text.disabled">
              enqueue
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Dequeued */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          Порядок извлечения
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 0.5,
            minHeight: 32,
            alignItems: 'center',
            px: 1,
            py: 0.5,
            borderRadius: 1.5,
            bgcolor: (t) =>
              t.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)',
          }}
        >
          {step === null || step.dequeued.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
              (пока ничего не извлечено)
            </Typography>
          ) : (
            step.dequeued.map((ch, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {i > 0 && <Box sx={{ color: 'text.disabled' }}>→</Box>}
                <Box
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: 0.75,
                    bgcolor: PALETTE.dequeueBg,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                  }}
                >
                  {ch}
                </Box>
              </Box>
            ))
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
