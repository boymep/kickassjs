import { useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeBlock from '../theory/CodeBlock';

interface LoopStep {
  line: string;
  callStack: string[];
  microtasks: string[];
  tasks: string[];
  output: string[];
  note: string;
  activeQueue?: 'microtask' | 'task' | 'stack';
}

const steps: LoopStep[] = [
  {
    line: 'console.log("Start")',
    callStack: ['console.log("Start")'],
    microtasks: [],
    tasks: [],
    output: ['Start'],
    note: 'Синхронный вызов выполняется немедленно, попадает в вывод.',
    activeQueue: 'stack',
  },
  {
    line: 'setTimeout(cb, 0)',
    callStack: ['setTimeout(cb, 0)'],
    microtasks: [],
    tasks: ['cb → "Timeout"'],
    output: ['Start'],
    note: 'setTimeout регистрирует callback в task queue (макрозадача).',
    activeQueue: 'task',
  },
  {
    line: 'Promise.resolve().then(cb)',
    callStack: ['Promise.resolve().then(cb)'],
    microtasks: ['cb → "Promise"'],
    tasks: ['cb → "Timeout"'],
    output: ['Start'],
    note: 'Promise.then добавляет callback в microtask queue.',
    activeQueue: 'microtask',
  },
  {
    line: 'console.log("End")',
    callStack: ['console.log("End")'],
    microtasks: ['cb → "Promise"'],
    tasks: ['cb → "Timeout"'],
    output: ['Start', 'End'],
    note: 'Синхронный код завершён, стек сейчас опустеет.',
    activeQueue: 'stack',
  },
  {
    line: 'синхронный код завершён, стек пуст',
    callStack: [],
    microtasks: ['cb → "Promise"'],
    tasks: ['cb → "Timeout"'],
    output: ['Start', 'End'],
    note: 'Event loop: стек пуст — сначала опустошаются все микрозадачи.',
    activeQueue: 'microtask',
  },
  {
    line: 'event loop берёт из microtask queue',
    callStack: ['Promise cb'],
    microtasks: [],
    tasks: ['cb → "Timeout"'],
    output: ['Start', 'End', 'Promise'],
    note: 'Все микрозадачи выполнены. Теперь — макрозадача.',
    activeQueue: 'microtask',
  },
  {
    line: 'event loop берёт из task queue',
    callStack: ['Timeout cb'],
    microtasks: [],
    tasks: [],
    output: ['Start', 'End', 'Promise', 'Timeout'],
    note: 'Макрозадача выполнена. Цикл: снова микрозадачи → следующая макрозадача.',
    activeQueue: 'task',
  },
];

const CODE = `console.log('Start');
setTimeout(cb, 0);
Promise.resolve().then(cb);
console.log('End');`;

function QueueBox({
  label,
  sublabel,
  items,
  activeColor,
  active,
}: {
  label: string;
  sublabel?: string;
  items: string[];
  activeColor: string;
  active?: boolean;
}) {
  const theme = useTheme();
  return (
    <Box>
      <Typography
        variant="overline"
        sx={{
          fontWeight: 700,
          color: active ? activeColor : 'text.disabled',
          display: 'block',
          mb: 0.25,
          fontSize: '0.7rem',
          letterSpacing: 0.5,
        }}
      >
        {label}
        {active && ' ←'}
      </Typography>
      {sublabel && (
        <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 0.5, fontSize: '0.65rem' }}>
          {sublabel}
        </Typography>
      )}
      <Box
        sx={{
          minHeight: 70,
          border: 1.5,
          borderColor: active ? activeColor : 'divider',
          borderRadius: 1,
          p: 1,
          bgcolor: active
            ? (t) => (t.palette.mode === 'dark' ? `${activeColor}1F` : `${activeColor}12`)
            : 'transparent',
          transition: 'all 0.2s',
        }}
      >
        {items.length === 0 ? (
          <Typography variant="caption" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
            пусто
          </Typography>
        ) : (
          [...items].reverse().map((item, i) => (
            <Box
              key={i}
              sx={{
                px: 1,
                py: 0.5,
                mb: 0.5,
                borderRadius: 0.5,
                bgcolor: `${activeColor}1A`,
                border: 1,
                borderColor: `${activeColor}55`,
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                color: theme.palette.text.primary,
                lineHeight: 1.4,
              }}
            >
              {item}
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}

export default function EventLoopViz() {
  const theme = useTheme();
  const [idx, setIdx] = useState(0);
  const step = idx > 0 ? steps[idx - 1]! : null;

  const QUEUE_COLORS = {
    stack: theme.palette.primary.main,
    microtask: theme.palette.success.main,
    task: theme.palette.warning.main,
    output: theme.palette.text.secondary,
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
        Пошаговая работа event loop на простом коде.
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
            borderColor: QUEUE_COLORS[step.activeQueue ?? 'stack'],
            bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
            fontFamily: 'monospace',
            fontSize: '0.82rem',
          }}
        >
          → {step.line}
        </Box>
      )}

      {step && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1.1fr 1.1fr 0.9fr' }, gap: 1.5, mb: 2 }}>
          <QueueBox
            label="Call stack"
            sublabel="LIFO"
            items={step.callStack}
            activeColor={QUEUE_COLORS.stack}
            active={step.activeQueue === 'stack'}
          />
          <QueueBox
            label="Microtasks"
            sublabel="Promise, queueMicrotask"
            items={step.microtasks}
            activeColor={QUEUE_COLORS.microtask}
            active={step.activeQueue === 'microtask'}
          />
          <QueueBox
            label="Tasks"
            sublabel="setTimeout, setInterval, события"
            items={step.tasks}
            activeColor={QUEUE_COLORS.task}
            active={step.activeQueue === 'task'}
          />
          <QueueBox
            label="Вывод"
            items={step.output}
            activeColor={QUEUE_COLORS.output}
          />
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
            : 'Нажмите «Следующий шаг», чтобы посмотреть, как event loop обрабатывает этот код.'}
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
