import { useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeBlock from '../theory/CodeBlock';

const phases = [
  { id: 'timers',  label: 'timers',           sublabel: 'setTimeout, setInterval',          colorKey: 'primary' },
  { id: 'pending', label: 'pending callbacks', sublabel: 'отложенные системные',             colorKey: 'secondary' },
  { id: 'idle',    label: 'idle / prepare',   sublabel: 'внутренние libuv',                 colorKey: 'text' },
  { id: 'poll',    label: 'poll',             sublabel: 'I/O коллбэки',                     colorKey: 'warning' },
  { id: 'check',   label: 'check',            sublabel: 'setImmediate',                     colorKey: 'success' },
  { id: 'close',   label: 'close callbacks',  sublabel: 'события close',                    colorKey: 'error' },
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
    note: 'Сначала выполняется весь синхронный код. Event loop ещё не начал перебирать фазы.',
    code: `console.log('sync');`,
  },
  {
    activePhase: 'microtick',
    microtickActive: true,
    title: 'Микрозадачи между фазами',
    note: '\`process.nextTick\` и Promise.then опустошаются между каждой фазой. \`nextTick\` имеет приоритет над промисами.',
    code: `process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));`,
  },
  {
    activePhase: 'timers',
    microtickActive: false,
    title: 'Фаза timers',
    note: 'Выполняются коллбэки \`setTimeout\` и \`setInterval\`, у которых наступило время.',
    code: `setTimeout(() => console.log('timer'), 0);`,
  },
  {
    activePhase: 'poll',
    microtickActive: false,
    title: 'Фаза poll',
    note: 'Главная фаза: выполняются I/O-коллбэки. Если очередь пуста и нет таймеров — фаза блокируется в ожидании новых событий.',
    code: `fs.readFile('data.txt', (err, data) => {
  // этот коллбэк выполняется в фазе poll
  console.log(data);
});`,
  },
  {
    activePhase: 'check',
    microtickActive: false,
    title: 'Фаза check (setImmediate)',
    note: 'Коллбэки \`setImmediate\` выполняются сразу после фазы poll. Внутри I/O-коллбэка \`setImmediate\` гарантированно раньше \`setTimeout(0)\`.',
    code: `fs.readFile('file', () => {
  setImmediate(() => console.log('immediate'));
  setTimeout(() => console.log('timeout'), 0);
  // immediate всегда раньше timeout
});`,
  },
  {
    activePhase: 'microtick',
    microtickActive: true,
    title: 'И снова микрозадачи',
    note: 'После каждой фазы — снова \`nextTick\` и promises. Рекурсивный \`process.nextTick\` способен заблокировать переход к poll и заморозить I/O.',
    code: `// Антипаттерн — заблокирует poll
function bad() { process.nextTick(bad); }

// Корректное чанкование — отдаёт управление libuv
function good() { setImmediate(good); }`,
  },
];

const CX = 200;
const CY = 140;
const RX = 130;
const RY = 100;
const BOX_W = 90;
const BOX_H = 42;

function phasePos(index: number, total: number) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  return { x: CX + RX * Math.cos(angle), y: CY + RY * Math.sin(angle) };
}

export default function NodeEventLoopViz() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [idx, setIdx] = useState(0);
  const step = idx > 0 ? steps[idx - 1]! : null;

  const phaseColors: Record<string, string> = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    text: theme.palette.text.secondary,
    warning: theme.palette.warning.main,
    success: theme.palette.success.main,
    error: theme.palette.error.main,
  };

  const microtickColor = '#FF6B00';
  const inactiveFill = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const inactiveStroke = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
  const inactiveText = isDark ? '#8E8E93' : '#6C6C70';
  const ellipseStroke = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';

  const activePhase = step?.activePhase ?? null;
  const microtickActive = step?.microtickActive ?? false;

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
        Шесть фаз libuv. Между каждой фазой опустошаются \`nextTick\` и Promise microtasks.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Box sx={{ flex: '0 0 auto', mx: 'auto' }}>
          <svg width={400} height={285} viewBox="0 0 400 285" style={{ display: 'block' }}>
            <ellipse
              cx={CX} cy={CY} rx={RX} ry={RY}
              fill="none" stroke={ellipseStroke} strokeWidth={2} strokeDasharray="6 4"
            />
            {microtickActive && (
              <ellipse
                cx={CX} cy={CY} rx={RX + 18} ry={RY + 18}
                fill="none" stroke={microtickColor} strokeOpacity={0.4} strokeWidth={2} strokeDasharray="4 3"
              />
            )}

            {phases.map((phase, i) => {
              const pos = phasePos(i, phases.length);
              const isActive = activePhase === phase.id;
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
                    x={pos.x} y={by + 16}
                    textAnchor="middle" fontSize={10} fontWeight={isActive ? 700 : 500}
                    fill={isActive ? '#fff' : inactiveText}
                  >
                    {phase.label}
                  </text>
                  <text
                    x={pos.x} y={by + 30}
                    textAnchor="middle" fontSize={8}
                    fill={isActive ? 'rgba(255,255,255,0.85)' : inactiveText}
                  >
                    {phase.sublabel}
                  </text>
                </g>
              );
            })}

            <rect
              x={CX - 70} y={CY - 22} width={140} height={44} rx={8}
              fill={microtickActive ? microtickColor : inactiveFill}
              fillOpacity={microtickActive ? 0.18 : 1}
              stroke={microtickActive ? microtickColor : ellipseStroke}
              strokeWidth={microtickActive ? 2 : 1}
              style={{ transition: 'all 0.2s' }}
            />
            <text x={CX} y={CY - 4} textAnchor="middle" fontSize={9} fontWeight={700}
              fill={microtickActive ? microtickColor : inactiveText}>
              process.nextTick
            </text>
            <text x={CX} y={CY + 9} textAnchor="middle" fontSize={9}
              fill={microtickActive ? microtickColor : inactiveText}>
              Promise microtasks
            </text>
            <text x={CX} y={CY + 22} textAnchor="middle" fontSize={8}
              fill={microtickActive ? microtickColor : inactiveText} opacity={microtickActive ? 0.9 : 1}>
              между каждой фазой
            </text>
          </svg>
        </Box>

        <Box sx={{ flex: 1, minWidth: 220 }}>
          {step ? (
            <>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                {step.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.6 }}>
                {step.note}
              </Typography>
              {step.code && <CodeBlock code={step.code} />}
            </>
          ) : (
            <Typography variant="body2" color="text.disabled">
              Нажмите «Следующий шаг», чтобы пройти по фазам event loop.
            </Typography>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          mt: 2,
          px: 2,
          py: 1,
          borderRadius: 1.5,
          textAlign: 'center',
          bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
          color: 'text.secondary',
        }}
      >
        <Typography variant="caption">
          {step ? `Шаг ${idx} / ${steps.length}` : '—'}
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
