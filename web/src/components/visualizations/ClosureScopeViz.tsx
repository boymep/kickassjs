import { useState } from 'react';
import { Button, Paper, Typography, Box, Alert, Chip } from '@mui/material';
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
    note: 'makeCounter попадает в глобальную область видимости. Никаких scope-ов ещё нет — функция только объявлена.',
    global: {},
    scope1: null,
    scope2: null,
  },
  {
    title: 'counter1 = makeCounter()',
    activeLine: 'const counter1 = makeCounter();',
    note: 'Вызов makeCounter() создаёт новый scope. В нём живёт переменная count = 0. Функции increment и getCount замыкаются на этот scope.',
    global: { counter1: true },
    scope1: { count: 0, showClosures: true },
    scope2: null,
  },
  {
    title: 'counter1.increment() × 2',
    activeLine: 'counter1.increment(); counter1.increment();',
    note: 'increment() из замыкания обращается к count в scope counter1 и увеличивает его. Сам scope не уничтожается — closure держит на него ссылку.',
    global: { counter1: true },
    scope1: { count: 2, showClosures: true },
    scope2: null,
  },
  {
    title: 'counter2 = makeCounter()',
    activeLine: 'const counter2 = makeCounter();',
    note: 'Новый вызов makeCounter() создаёт ОТДЕЛЬНЫЙ scope с собственным count = 0. Это не связано со scope counter1 — у каждого вызова свои переменные.',
    global: { counter1: true, counter2: true },
    scope1: { count: 2, showClosures: false },
    scope2: { count: 0, showClosures: true },
  },
  {
    title: 'counter2.increment()',
    activeLine: 'counter2.increment();',
    note: 'counter2.increment() меняет count только в scope counter2. Scope counter1 не затронут — counter1.getCount() по-прежнему вернёт 2.',
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
// counter2.getCount() → 1  (не 3!)`;

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

function CounterScope({
  label,
  data,
  active,
}: {
  label: string;
  data: { count: number; showClosures: boolean };
  active: boolean;
}) {
  return (
    <Box
      sx={{
        border: '1.5px solid',
        borderColor: active ? 'primary.main' : 'divider',
        borderRadius: '8px',
        p: 1.5,
        bgcolor: active ? 'action.selected' : 'action.hover',
        transition: 'all 0.2s',
        flex: 1,
        minWidth: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
        <ScopeLabel label={`${label} Scope`} active={active} color="primary.main" />
        {active && (
          <Chip label="активен" size="small" color="primary" variant="filled" sx={{ ml: 'auto', fontSize: '0.65rem', height: 20 }} />
        )}
      </Box>

      <Box sx={{ fontFamily: 'monospace', fontSize: '0.82rem', mb: data.showClosures ? 1 : 0 }}>
        <Box component="span" sx={{ color: active ? 'primary.main' : 'text.disabled' }}>count</Box>
        {' = '}
        <Box component="span" sx={{ color: 'warning.main', fontWeight: 700 }}>{data.count}</Box>
        <Box component="span" sx={{ color: 'text.disabled' }}>  {'// ← живёт здесь'}</Box>
      </Box>

      {data.showClosures && (
        <Box
          sx={{
            border: '1.5px solid',
            borderColor: 'success.main',
            borderRadius: '6px',
            p: 1,
            bgcolor: 'action.hover',
          }}
        >
          <ScopeLabel label="Замкнутые функции" active color="success.main" />
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
  const [idx, setIdx] = useState(0);
  const step = steps[idx];

  const hasScope2 = step.scope2 !== null && step.scope2 !== undefined;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Замыкание — визуализация scope chain
      </Typography>

      <CodeBlock code={CODE} />

      {/* Current line */}
      <Box
        sx={{
          px: 2, py: 1, mb: 2,
          borderLeft: '3px solid',
          borderColor: 'primary.main',
          bgcolor: 'action.hover',
          fontFamily: 'monospace',
          fontSize: '0.82rem',
        }}
      >
        {'→ '}{step.activeLine}
      </Box>

      {/* Scope diagram */}
      <Box sx={{ mb: 2 }}>
        {/* Global Scope */}
        <Box
          sx={{
            border: '1.5px solid',
            borderColor: 'divider',
            borderRadius: '10px',
            p: 2,
            bgcolor: 'background.paper',
          }}
        >
          <ScopeLabel label="Global Scope" active />

          <Box sx={{ fontFamily: 'monospace', fontSize: '0.82rem', mb: (step.scope1 || hasScope2) ? 1.5 : 0 }}>
            <Box sx={{ color: 'text.secondary' }}>
              makeCounter: <Box component="span" sx={{ color: 'primary.main' }}>function</Box>
            </Box>
            {step.global.counter1 && (
              <Box sx={{ color: 'warning.main', fontWeight: 600 }}>
                counter1: {'{ increment, getCount }'}
                <Box component="span" sx={{ color: 'text.disabled' }}>  {'// count = '}{step.scope1?.count}</Box>
              </Box>
            )}
            {step.global.counter2 && (
              <Box sx={{ color: 'warning.dark', fontWeight: 600 }}>
                counter2: {'{ increment, getCount }'}
                <Box component="span" sx={{ color: 'text.disabled' }}>  {'// count = '}{step.scope2?.count}</Box>
              </Box>
            )}
          </Box>

          {/* Scopes side by side */}
          {(step.scope1 || hasScope2) && (
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {step.scope1 && (
                <CounterScope
                  label="makeCounter() [counter1]"
                  data={step.scope1}
                  active={step.global.counter1 === true && !hasScope2 || (hasScope2 && !!(step.scope1?.showClosures))}
                />
              )}
              {hasScope2 && step.scope2 && (
                <CounterScope
                  label="makeCounter() [counter2]"
                  data={step.scope2}
                  active={step.scope2.showClosures}
                />
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
