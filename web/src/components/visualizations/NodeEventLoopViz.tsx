import { useState } from 'react';
import { Button, Paper, Typography, Box, Alert, useTheme } from '@mui/material';
import CodeBlock from '../theory/CodeBlock';

const phases = [
  { id: 'timers', label: 'timers', sublabel: 'setTimeout\nsetInterval', colorKey: 'primary' },
  { id: 'pending', label: 'pending callbacks', sublabel: 'I/O ошибки\nпредыдущего цикла', colorKey: 'secondary' },
  { id: 'idle', label: 'idle / prepare', sublabel: 'внутренние\nlibuv операции', colorKey: 'text' },
  { id: 'poll', label: 'poll', sublabel: 'ожидание I/O\nвыполнение I/O cb', colorKey: 'warning' },
  { id: 'check', label: 'check', sublabel: 'setImmediate\ncallbacks', colorKey: 'success' },
  { id: 'close', label: 'close callbacks', sublabel: 'socket.on("close")\nпрочие close', colorKey: 'error' },
] as const;

interface Step {
  activePhase: string | null;
  microtickActive: boolean;
  title: string;
  note: string;
  code?: string;
}

const steps: Step[] = [
  {
    activePhase: null,
    microtickActive: false,
    title: 'Синхронный код',
    note: 'Сначала выполняется весь синхронный код. Event Loop ещё не запущен.',
    code: `console.log('sync'); // выполняется сразу`,
  },
  {
    activePhase: 'microtick',
    microtickActive: true,
    title: 'Микрозадачи (между фазами)',
    note: 'process.nextTick и Promise.then выполняются МЕЖДУ каждой фазой. process.nextTick — раньше Promise.',
    code: `process.nextTick(() => console.log('nextTick')); // приоритет 1
Promise.resolve().then(() => console.log('promise')); // приоритет 2`,
  },
  {
    activePhase: 'timers',
    microtickActive: false,
    title: 'Фаза: timers',
    note: 'Выполняются callback-и setTimeout и setInterval, чьё время истекло.',
    code: `setTimeout(() => console.log('timer'), 0);
// ⚠ Минимальный порог ~1ms. Порядок с setImmediate вне I/O — непредсказуем!`,
  },
  {
    activePhase: 'poll',
    microtickActive: false,
    title: 'Фаза: poll',
    note: 'Самая важная фаза. Node.js ждёт I/O событий и выполняет их callback-и. Если нет таймеров — может блокироваться здесь.',
    code: `fs.readFile('data.txt', (err, data) => {
  // Этот callback выполняется в фазе poll
  console.log(data);
});`,
  },
  {
    activePhase: 'check',
    microtickActive: false,
    title: 'Фаза: check (setImmediate)',
    note: 'setImmediate выполняется после фазы poll. Внутри I/O callback — всегда раньше setTimeout.',
    code: `fs.readFile('file', () => {
  setImmediate(() => console.log('immediate')); // check фаза
  setTimeout(() => console.log('timeout'), 0);  // следующая timers фаза
  // Вывод: immediate ВСЕГДА раньше timeout здесь
});`,
  },
  {
    activePhase: 'microtick',
    microtickActive: true,
    title: 'Снова микрозадачи — после каждой фазы',
    note: 'После каждой фазы — снова проверяются nextTick и Promise. Рекурсивные nextTick могут заблокировать I/O!',
    code: `// ❌ Бесконечный nextTick — заблокирует poll фазу!
function bad() { process.nextTick(bad); }

// ✅ setImmediate — безопасная рекурсия
function good() { setImmediate(good); }`,
  },
];

const CX = 200;
const CY = 140;
const RX = 130;
const RY = 100;
const BOX_W = 90;
const BOX_H = 42;

function getPhasePos(index: number, total: number) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  return {
    x: CX + RX * Math.cos(angle),
    y: CY + RY * Math.sin(angle),
  };
}

export default function NodeEventLoopViz() {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const phaseColors: Record<string, string> = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    text: theme.palette.text.secondary,
    warning: theme.palette.warning.main,
    success: theme.palette.success.main,
    error: theme.palette.error.main,
  };

  const microtickColor = '#FF6B00';
  const svgBg = theme.palette.background.paper;
  const inactiveFill = isDark ? '#3A3A3C' : '#F2F2F7';
  const inactiveStroke = isDark ? '#48484A' : '#C7C7CC';
  const inactiveText = isDark ? '#636366' : '#8E8E93';
  const activeText = '#fff';
  const arrowColor = isDark ? '#48484A' : '#C7C7CC';
  const ellipseStroke = isDark ? '#3A3A3C' : '#E5E5EA';

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Node.js Event Loop — фазы
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Каждый «тик» проходит через все фазы по кругу
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {/* SVG Diagram */}
        <Box sx={{ flex: '0 0 auto' }}>
          <svg
            width={400}
            height={285}
            style={{ display: 'block' }}
            viewBox="0 0 400 285"
          >
            <rect width={400} height={285} fill={svgBg} />

            <ellipse
              cx={CX} cy={CY} rx={RX} ry={RY}
              fill="none" stroke={ellipseStroke} strokeWidth={2} strokeDasharray="6 4"
            />

            {step.microtickActive && (
              <ellipse
                cx={CX} cy={CY} rx={RX + 18} ry={RY + 18}
                fill="none" stroke={microtickColor + '60'} strokeWidth={2} strokeDasharray="4 3"
              />
            )}

            {phases.map((phase, i) => {
              const pos = getPhasePos(i, phases.length);
              const isActive = step.activePhase === phase.id;
              const color = phaseColors[phase.colorKey];
              const bx = pos.x - BOX_W / 2;
              const by = pos.y - BOX_H / 2;

              return (
                <g key={phase.id}>
                  <rect
                    x={bx} y={by} width={BOX_W} height={BOX_H} rx={6}
                    fill={isActive ? color : inactiveFill}
                    stroke={isActive ? color : inactiveStroke}
                    strokeWidth={isActive ? 2 : 1}
                    style={{ transition: 'all 0.2s' }}
                  />
                  <text
                    x={pos.x} y={by + 15}
                    textAnchor="middle" fontSize={10}
                    fontWeight={isActive ? 700 : 500}
                    fill={isActive ? activeText : inactiveText}
                  >
                    {phase.label}
                  </text>
                  {phase.sublabel.split('\n').map((line, li) => (
                    <text
                      key={li} x={pos.x} y={by + 27 + li * 12}
                      textAnchor="middle" fontSize={8}
                      fill={isActive ? '#ffffff90' : inactiveText}
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}

            {/* Center: microtask indicator */}
            <rect
              x={CX - 60} y={CY - 22} width={120} height={44} rx={8}
              fill={step.microtickActive ? microtickColor + '18' : inactiveFill}
              stroke={step.microtickActive ? microtickColor : ellipseStroke}
              strokeWidth={step.microtickActive ? 2 : 1}
              style={{ transition: 'all 0.2s' }}
            />
            <text x={CX} y={CY - 6} textAnchor="middle" fontSize={9} fontWeight={700}
              fill={step.microtickActive ? microtickColor : inactiveText}>
              process.nextTick
            </text>
            <text x={CX} y={CY + 7} textAnchor="middle" fontSize={9}
              fill={step.microtickActive ? microtickColor : inactiveText}>
              Promise microtasks
            </text>
            <text x={CX} y={CY + 19} textAnchor="middle" fontSize={8}
              fill={step.microtickActive ? microtickColor + 'CC' : inactiveText}>
              (между каждой фазой)
            </text>

            <text x={CX + RX + 22} y={CY + 5} textAnchor="middle" fontSize={16} fill={arrowColor}>↻</text>
          </svg>
        </Box>

        {/* Step info */}
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            {step.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.6 }}>
            {step.note}
          </Typography>
          {step.code && <CodeBlock code={step.code} />}
        </Box>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1.5, mb: 1.5 }}>
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
