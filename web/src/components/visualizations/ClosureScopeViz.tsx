import { useState } from 'react';
import { Button, Paper, Typography, Box, Alert, Chip } from '@mui/material';
import CodeBlock from '../theory/CodeBlock';

interface Step {
  phase: 'define' | 'call' | 'return' | 'closureAlive' | 'reuse';
  title: string;
  note: string;
  highlight: {
    outer?: boolean;
    inner?: boolean;
    globalRef?: boolean;
    counterRef?: boolean;
  };
  outerAlive: boolean;
  count?: number;
}

const steps: Step[] = [
  {
    phase: 'define',
    title: 'Определение makeCounter()',
    note: 'Функция makeCounter определена в глобальной области. Пока ничего не выполнялось — только создана ссылка.',
    highlight: { globalRef: true },
    outerAlive: false,
  },
  {
    phase: 'call',
    title: 'makeCounter() вызвана',
    note: 'Создаётся новый scope для makeCounter. Переменная count = 0 живёт в этом scope.',
    highlight: { outer: true },
    outerAlive: true,
    count: 0,
  },
  {
    phase: 'return',
    title: 'makeCounter() вернула объект',
    note: 'makeCounter завершилась, но её scope НЕ уничтожен! Возвращённые функции держат ссылки на count.',
    highlight: { outer: true, inner: true, counterRef: true },
    outerAlive: true,
    count: 0,
  },
  {
    phase: 'closureAlive',
    title: 'counter.increment() — замыкание в действии',
    note: 'increment() обращается к count из замкнутого scope makeCounter. GC не удалит этот scope, пока counter существует.',
    highlight: { inner: true, counterRef: true },
    outerAlive: true,
    count: 2,
  },
  {
    phase: 'reuse',
    title: 'Каждый вызов makeCounter() — отдельное замыкание',
    note: 'counter1 и counter2 имеют РАЗНЫЕ экземпляры переменной count. Замыкания изолированы.',
    highlight: { globalRef: true },
    outerAlive: false,
    count: 0,
  },
];

const CODE = `function makeCounter() {
  let count = 0;
  return {
    increment() { count++; },
    getCount() { return count; }
  };
}`;

function ScopeLabel({ label, active, color }: { label: string; active: boolean; color?: string }) {
  return (
    <Typography
      variant="caption"
      sx={{
        display: 'block',
        fontWeight: 700,
        fontSize: '0.72rem',
        color: active ? (color ?? 'text.secondary') : 'text.disabled',
        mb: 0.75,
        letterSpacing: 0.3,
      }}
    >
      {label}
    </Typography>
  );
}

export default function ClosureScopeViz() {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];

  const outerActive = !!step.highlight.outer;
  const innerActive = !!step.highlight.inner;
  const globalActive = !!step.highlight.globalRef;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Замыкание — визуализация scope chain
      </Typography>

      <CodeBlock code={CODE} />

      {/* Step title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Chip
          label={`Шаг ${idx + 1}`}
          size="small"
          color="primary"
          variant="outlined"
        />
        <Typography variant="subtitle2">{step.title}</Typography>
      </Box>

      {/* Scope diagram */}
      <Box sx={{ mb: 2 }}>

        {/* Global Scope */}
        <Box
          sx={{
            border: '1.5px solid',
            borderColor: globalActive ? 'text.secondary' : 'divider',
            borderRadius: '10px',
            p: 2,
            bgcolor: 'background.paper',
            transition: 'border-color 0.2s',
          }}
        >
          <ScopeLabel label="Global Scope" active={globalActive} />

          <Box sx={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
            <Box sx={{ color: globalActive ? 'text.primary' : 'text.disabled' }}>
              makeCounter:{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>function</Box>
            </Box>

            {step.highlight.counterRef && (
              <Box sx={{ color: 'warning.main', fontWeight: 600 }}>
                counter: {'{ increment, getCount }'}
                {step.count !== undefined && (
                  <Box component="span" sx={{ color: 'text.disabled' }}>{'  // count = '}{step.count}</Box>
                )}
              </Box>
            )}

            {step.phase === 'reuse' && (
              <>
                <Box sx={{ color: 'warning.main' }}>
                  counter1: {'{ increment, getCount }'}
                  <Box component="span" sx={{ color: 'text.disabled' }}>{'  // count = 2'}</Box>
                </Box>
                <Box sx={{ color: 'warning.dark' }}>
                  counter2: {'{ increment, getCount }'}
                  <Box component="span" sx={{ color: 'text.disabled' }}>{'  // count = 0'}</Box>
                </Box>
              </>
            )}
          </Box>

          {/* makeCounter Scope */}
          {step.outerAlive && (
            <Box
              sx={{
                mt: 1.5,
                border: '1.5px solid',
                borderColor: outerActive ? 'primary.main' : 'divider',
                borderRadius: '8px',
                p: 1.5,
                bgcolor: outerActive ? 'action.selected' : 'action.hover',
                transition: 'all 0.2s',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                <ScopeLabel label="makeCounter() Scope" active={outerActive} color="primary.main" />
                <Chip
                  label={step.phase === 'call' ? 'выполняется' : 'замкнуто ↗'}
                  size="small"
                  color={outerActive ? 'primary' : 'default'}
                  variant={outerActive ? 'filled' : 'outlined'}
                  sx={{ ml: 'auto', fontSize: '0.65rem', height: 20 }}
                />
              </Box>

              <Box sx={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
                <Box component="span" sx={{ color: outerActive ? 'primary.main' : 'text.disabled' }}>count</Box>
                {' = '}
                <Box component="span" sx={{ color: 'warning.main', fontWeight: 700 }}>{step.count ?? 0}</Box>
                <Box component="span" sx={{ color: 'text.disabled' }}>{'  // ← живёт здесь'}</Box>
              </Box>

              {/* Closures Scope */}
              {innerActive && (
                <Box
                  sx={{
                    mt: 1,
                    border: '1.5px solid',
                    borderColor: 'success.main',
                    borderRadius: '6px',
                    p: 1.5,
                    bgcolor: 'action.hover',
                    transition: 'all 0.2s',
                  }}
                >
                  <ScopeLabel label="Замкнутые функции (closures)" active color="success.main" />
                  <Box sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    <Box>
                      <Box component="span" sx={{ color: 'success.main' }}>increment()</Box>
                      {' { count++ }  '}
                      <Box component="span" sx={{ color: 'text.disabled' }}>// видит count ↑</Box>
                    </Box>
                    <Box>
                      <Box component="span" sx={{ color: 'success.main' }}>getCount()</Box>
                      {' { return count }  '}
                      <Box component="span" sx={{ color: 'text.disabled' }}>// видит count ↑</Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">{step.note}</Typography>
      </Alert>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button variant="outlined" disabled={idx === 0} onClick={() => setIdx((s) => s - 1)}>
          ← Назад
        </Button>
        <Button variant="contained" disabled={idx >= steps.length - 1} onClick={() => setIdx((s) => s + 1)}>
          Следующий шаг →
        </Button>
        <Button variant="outlined" onClick={() => setIdx(0)} sx={{ ml: 'auto' }}>
          Сбросить
        </Button>
      </Box>
    </Paper>
  );
}
