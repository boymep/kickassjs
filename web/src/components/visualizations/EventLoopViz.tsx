import { useState } from 'react';
import { Button, Paper, Typography, Box, Alert, useTheme } from '@mui/material';
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
    line: 'console.log("Start")  ← выполняется',
    callStack: ['console.log("Start")'],
    microtasks: [],
    tasks: [],
    output: ['Start'],
    note: 'Синхронный вызов — выполняется немедленно, попадает в вывод',
    activeQueue: 'stack',
  },
  {
    line: 'setTimeout(cb, 0)  ← выполняется',
    callStack: ['setTimeout(cb, 0)'],
    microtasks: [],
    tasks: ['cb → "Timeout"'],
    output: ['Start'],
    note: 'setTimeout регистрирует callback в Task Queue (макрозадача)',
    activeQueue: 'task',
  },
  {
    line: 'Promise.resolve().then(cb)  ← выполняется',
    callStack: ['Promise.resolve().then(cb)'],
    microtasks: ['cb → "Promise"'],
    tasks: ['cb → "Timeout"'],
    output: ['Start'],
    note: 'Promise.then добавляет callback в Microtask Queue (микрозадача)',
    activeQueue: 'microtask',
  },
  {
    line: 'console.log("End")  ← выполняется',
    callStack: ['console.log("End")'],
    microtasks: ['cb → "Promise"'],
    tasks: ['cb → "Timeout"'],
    output: ['Start', 'End'],
    note: 'Синхронный код завершён. Стек скоро опустеет.',
    activeQueue: 'stack',
  },
  {
    line: '← синхронный код завершён, стек пуст',
    callStack: [],
    microtasks: ['cb → "Promise"'],
    tasks: ['cb → "Timeout"'],
    output: ['Start', 'End'],
    note: 'Event Loop: стек пуст → сначала очищаем ВСЕ микрозадачи',
    activeQueue: 'microtask',
  },
  {
    line: '← Event Loop берёт из Microtask Queue',
    callStack: ['Promise cb'],
    microtasks: [],
    tasks: ['cb → "Timeout"'],
    output: ['Start', 'End', 'Promise'],
    note: 'Все микрозадачи выполнены. Только теперь — макрозадача.',
    activeQueue: 'microtask',
  },
  {
    line: '← Event Loop берёт из Task Queue',
    callStack: ['Timeout cb'],
    microtasks: [],
    tasks: [],
    output: ['Start', 'End', 'Promise', 'Timeout'],
    note: 'Макрозадача выполнена. Цикл: снова проверяем микрозадачи → следующая макрозадача.',
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
        variant="caption"
        sx={{
          fontWeight: 700,
          color: active ? activeColor : 'text.disabled',
          display: 'block',
          mb: 0.25,
          textTransform: 'uppercase',
          fontSize: '0.7rem',
          letterSpacing: 0.5,
        }}
      >
        {label}{active && ' ←'}
      </Typography>
      {sublabel && (
        <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 0.5, fontSize: '0.65rem' }}>
          {sublabel}
        </Typography>
      )}
      <Box
        sx={{
          minHeight: 70,
          border: '1.5px solid',
          borderColor: active ? activeColor : activeColor + '30',
          borderRadius: 1,
          p: 1,
          bgcolor: active ? activeColor + '12' : 'background.default',
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
                bgcolor: activeColor + '18',
                border: '1px solid',
                borderColor: activeColor + '40',
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
  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  const theme = useTheme();

  const QUEUE_COLORS = {
    stack: theme.palette.primary.main,
    microtask: theme.palette.success.main,
    task: theme.palette.warning.main,
    output: theme.palette.text.secondary,
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Browser Event Loop — пошаговая визуализация
      </Typography>

      <CodeBlock code={CODE} />

      {/* Current line */}
      <Box
        sx={{
          px: 2,
          py: 1,
          mb: 2,
          borderLeft: '3px solid',
          borderColor: QUEUE_COLORS[step.activeQueue ?? 'stack'],
          bgcolor: 'action.hover',
          fontFamily: 'monospace',
          fontSize: '0.82rem',
        }}
      >
        {step.line}
      </Box>

      {/* Queues */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr 1.1fr 0.9fr', gap: 1.5, mb: 2 }}>
        <QueueBox
          label="Call Stack"
          sublabel="LIFO"
          items={step.callStack}
          activeColor={QUEUE_COLORS.stack}
          active={step.activeQueue === 'stack'}
        />
        <QueueBox
          label="Microtask Queue"
          sublabel="Promise, queueMicrotask"
          items={step.microtasks}
          activeColor={QUEUE_COLORS.microtask}
          active={step.activeQueue === 'microtask'}
        />
        <QueueBox
          label="Task Queue"
          sublabel="setTimeout, setInterval"
          items={step.tasks}
          activeColor={QUEUE_COLORS.task}
          active={step.activeQueue === 'task'}
        />
        <QueueBox
          label="Output"
          items={step.output}
          activeColor={QUEUE_COLORS.output}
        />
      </Box>

      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">{step.note}</Typography>
      </Alert>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mb: 1.5 }}>
        Шаг {idx + 1} / {steps.length}
      </Typography>

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
