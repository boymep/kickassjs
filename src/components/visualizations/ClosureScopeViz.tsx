import { useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeBlock from '../theory/CodeBlock';

interface Step {
  title: string;
  activeLine: string;
  note: string;
  global: { counter1?: boolean; counter2?: boolean };
  scope1?: { count: number; showClosures: boolean } | null;
  scope2?: { count: number; showClosures: boolean } | null;
}

const steps: Step[] = [
  {
    title: 'Функция определена',
    activeLine: 'function makeCounter() { ... }',
    note: 'makeCounter попадает в глобальную область. Локальных областей пока нет — функция только объявлена.',
    global: {},
    scope1: null,
    scope2: null,
  },
  {
    title: 'counter1 = makeCounter()',
    activeLine: 'const counter1 = makeCounter();',
    note: 'Вызов makeCounter создал отдельную область с переменной count = 0. Возвращённые функции increment и getCount замкнуты на эту область.',
    global: { counter1: true },
    scope1: { count: 0, showClosures: true },
    scope2: null,
  },
  {
    title: 'counter1.increment() × 2',
    activeLine: 'counter1.increment(); counter1.increment();',
    note: 'increment из замыкания обращается к count и увеличивает его. Область не уничтожается — на неё держится ссылка из возвращённых функций.',
    global: { counter1: true },
    scope1: { count: 2, showClosures: true },
    scope2: null,
  },
  {
    title: 'counter2 = makeCounter()',
    activeLine: 'const counter2 = makeCounter();',
    note: 'Новый вызов makeCounter создал отдельную область с собственным count = 0. С первой областью никак не связан.',
    global: { counter1: true, counter2: true },
    scope1: { count: 2, showClosures: false },
    scope2: { count: 0, showClosures: true },
  },
  {
    title: 'counter2.increment()',
    activeLine: 'counter2.increment();',
    note: 'increment counter2 меняет count только в своей области. counter1 не затронут — у каждого экземпляра свой count.',
    global: { counter1: true, counter2: true },
    scope1: { count: 2, showClosures: false },
    scope2: { count: 1, showClosures: true },
  },
];

const CODE = `function makeCounter() {
  let count = 0;
  return {
    increment() { count++; },
    getCount()  { return count; }
  };
}

const counter1 = makeCounter();
counter1.increment();
counter1.increment();
// counter1.getCount() → 2

const counter2 = makeCounter();
counter2.increment();
// counter2.getCount() → 1`;

function CounterScope({
  label,
  data,
  active,
  isDark,
}: {
  label: string;
  data: { count: number; showClosures: boolean };
  active: boolean;
  isDark: boolean;
}) {
  return (
    <Box
      sx={{
        border: 1.5,
        borderColor: active ? 'primary.main' : 'divider',
        borderRadius: 1.5,
        p: 1.5,
        bgcolor: active
          ? (t) => (t.palette.mode === 'dark' ? 'rgba(10,132,255,0.10)' : 'rgba(10,132,255,0.06)')
          : 'transparent',
        flex: 1,
        minWidth: 0,
      }}
    >
      <Typography variant="overline" sx={{ display: 'block', mb: 0.75, color: active ? 'primary.main' : 'text.disabled', fontSize: '0.7rem' }}>
        {label}
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.82rem', mb: data.showClosures ? 1 : 0 }}>
        <Box component="span" sx={{ color: active ? 'primary.main' : 'text.disabled' }}>count</Box>
        {' = '}
        <Box component="span" sx={{ color: 'warning.main', fontWeight: 700 }}>{data.count}</Box>
      </Box>
      {data.showClosures && (
        <Box
          sx={{
            border: 1,
            borderColor: 'success.main',
            borderRadius: 1,
            p: 1,
            bgcolor: isDark ? 'rgba(52,199,89,0.08)' : 'rgba(52,199,89,0.05)',
          }}
        >
          <Typography variant="overline" sx={{ display: 'block', mb: 0.5, color: 'success.main', fontSize: '0.65rem' }}>
            замкнутые функции
          </Typography>
          <Box sx={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>
            <Box>
              <Box component="span" sx={{ color: 'success.main' }}>increment()</Box>
              <Box component="span" sx={{ color: 'text.disabled' }}>{' { count++ }'}</Box>
            </Box>
            <Box>
              <Box component="span" sx={{ color: 'success.main' }}>getCount()</Box>
              <Box component="span" sx={{ color: 'text.disabled' }}>{' { return count }'}</Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default function ClosureScopeViz() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [idx, setIdx] = useState(0);
  const step = idx > 0 ? steps[idx - 1]! : null;
  const hasScope2 = step?.scope2 !== null && step?.scope2 !== undefined;

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
        Каждый вызов makeCounter создаёт свою область с независимым count.
      </Typography>

      <CodeBlock code={CODE} />

      {step && (
        <Box
          sx={{
            px: 2,
            py: 1,
            mt: 2,
            mb: 2,
            borderLeft: 3,
            borderColor: 'primary.main',
            bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(10,132,255,0.10)' : 'rgba(10,132,255,0.06)'),
            fontFamily: 'monospace',
            fontSize: '0.82rem',
          }}
        >
          → {step.activeLine}
        </Box>
      )}

      {step && (
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              border: 1.5,
              borderColor: 'divider',
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography variant="overline" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
              Глобальная область
            </Typography>
            <Box sx={{ fontFamily: 'monospace', fontSize: '0.82rem', mb: (step.scope1 || hasScope2) ? 1.5 : 0 }}>
              <Box sx={{ color: 'text.secondary' }}>
                makeCounter: <Box component="span" sx={{ color: 'primary.main' }}>function</Box>
              </Box>
              {step.global.counter1 && (
                <Box sx={{ color: 'warning.main', fontWeight: 600 }}>
                  counter1: {'{ increment, getCount }'}
                  <Box component="span" sx={{ color: 'text.disabled', fontWeight: 400 }}>  {'// count = '}{step.scope1?.count}</Box>
                </Box>
              )}
              {step.global.counter2 && (
                <Box sx={{ color: 'warning.main', fontWeight: 600 }}>
                  counter2: {'{ increment, getCount }'}
                  <Box component="span" sx={{ color: 'text.disabled', fontWeight: 400 }}>  {'// count = '}{step.scope2?.count}</Box>
                </Box>
              )}
            </Box>
            {(step.scope1 || hasScope2) && (
              <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
                {step.scope1 && (
                  <CounterScope
                    label="область counter1"
                    data={step.scope1}
                    active={!!step.scope1.showClosures}
                    isDark={isDark}
                  />
                )}
                {hasScope2 && step.scope2 && (
                  <CounterScope
                    label="область counter2"
                    data={step.scope2}
                    active={step.scope2.showClosures}
                    isDark={isDark}
                  />
                )}
              </Box>
            )}
          </Box>
        </Box>
      )}

      <Box
        sx={{
          mt: 2,
          px: 2,
          py: 1.25,
          borderRadius: 1.5,
          textAlign: 'center',
          bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
          color: 'text.secondary',
        }}
      >
        <Typography variant="body2" sx={{ color: 'inherit' }}>
          {step
            ? `Шаг ${idx} / ${steps.length}: ${step.note}`
            : 'Нажмите «Следующий шаг», чтобы посмотреть, как создаются и живут области видимости.'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center' }}>
        <Button
          size="small"
          variant="contained"
          disabled={idx >= steps.length}
          onClick={() => setIdx((s) => Math.min(s + 1, steps.length))}
          endIcon={<ArrowForwardIcon />}
        >
          Следующий шаг
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setIdx(0)}
          startIcon={<RestartAltIcon />}
          disabled={idx === 0}
        >
          Сбросить
        </Button>
      </Box>
    </Box>
  );
}
