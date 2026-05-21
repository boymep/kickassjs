import { useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface TreeNode {
  id: number;
  x: number;
  y: number;
  left?: number;
  right?: number;
}

const nodes: TreeNode[] = [
  { id: 1, x: 200, y: 40,  left: 2, right: 3 },
  { id: 2, x: 110, y: 120, left: 4, right: 5 },
  { id: 3, x: 290, y: 120, left: 6, right: 7 },
  { id: 4, x: 65,  y: 200 },
  { id: 5, x: 155, y: 200 },
  { id: 6, x: 245, y: 200 },
  { id: 7, x: 335, y: 200 },
];

const nodeById = new Map(nodes.map((n) => [n.id, n]));

interface Step {
  currentNode: number;
  visited: number[];
  result: number[];
  stack: number[];
  description: string;
  done: boolean;
}

const steps: Step[] = [
  { currentNode: 1, visited: [],                       result: [1],                       stack: [3, 2],          description: 'Кладём корень в стек, снимаем 1, посещаем. Кладём 3 и 2 (левый — наверх).', done: false },
  { currentNode: 2, visited: [1],                      result: [1, 2],                    stack: [3, 5, 4],       description: 'Снимаем 2, посещаем. Кладём 5 и 4.', done: false },
  { currentNode: 4, visited: [1, 2],                   result: [1, 2, 4],                 stack: [3, 5],          description: 'Снимаем 4 — лист.', done: false },
  { currentNode: 5, visited: [1, 2, 4],                result: [1, 2, 4, 5],              stack: [3],             description: 'Снимаем 5 — лист.', done: false },
  { currentNode: 3, visited: [1, 2, 4, 5],             result: [1, 2, 4, 5, 3],           stack: [7, 6],          description: 'Снимаем 3, посещаем. Кладём 7 и 6.', done: false },
  { currentNode: 6, visited: [1, 2, 4, 5, 3],          result: [1, 2, 4, 5, 3, 6],        stack: [7],             description: 'Снимаем 6 — лист.', done: false },
  { currentNode: 7, visited: [1, 2, 4, 5, 3, 6],       result: [1, 2, 4, 5, 3, 6, 7],     stack: [],              description: 'Снимаем 7 — лист. Стек пуст.', done: false },
  { currentNode: -1, visited: [1, 2, 4, 5, 3, 6, 7],   result: [1, 2, 4, 5, 3, 6, 7],     stack: [],              description: 'Обход завершён. Порядок: 1 → 2 → 4 → 5 → 3 → 6 → 7', done: true },
];

const NODE_R = 22;
const SVG_W = 400;
const SVG_H = 250;

export default function DfsViz() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [stepIdx, setStepIdx] = useState(0);
  const step = stepIdx > 0 ? steps[stepIdx - 1]! : null;

  const PALETTE = {
    edge: isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.20)',
    idleFill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)',
    idleStroke: isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.20)',
    currentFill: isDark ? 'rgba(255,149,0,0.30)' : 'rgba(255,149,0,0.18)',
    currentStroke: '#ff9500',
    visitedFill: isDark ? 'rgba(52,199,89,0.20)' : 'rgba(52,199,89,0.14)',
    visitedStroke: '#34c759',
    stackFill: isDark ? 'rgba(10,132,255,0.18)' : 'rgba(10,132,255,0.12)',
    stackStroke: '#0a84ff',
    text: isDark ? '#f2f2f7' : '#1c1c1e',
  };

  const nodeColors = (id: number) => {
    if (!step) return { fill: PALETTE.idleFill, stroke: PALETTE.idleStroke };
    if (step.currentNode === id) return { fill: PALETTE.currentFill, stroke: PALETTE.currentStroke };
    if (step.visited.includes(id)) return { fill: PALETTE.visitedFill, stroke: PALETTE.visitedStroke };
    if (step.stack.includes(id)) return { fill: PALETTE.stackFill, stroke: PALETTE.stackStroke };
    return { fill: PALETTE.idleFill, stroke: PALETTE.idleStroke };
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
        Итеративный DFS (pre-order) через явный стек.
      </Typography>

      <Box sx={{ overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
        <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`}>
          {nodes.map((node) => {
            const edges = [];
            if (node.left) {
              const c = nodeById.get(node.left)!;
              edges.push(<line key={`${node.id}-l`} x1={node.x} y1={node.y} x2={c.x} y2={c.y} stroke={PALETTE.edge} strokeWidth={1.5} />);
            }
            if (node.right) {
              const c = nodeById.get(node.right)!;
              edges.push(<line key={`${node.id}-r`} x1={node.x} y1={node.y} x2={c.x} y2={c.y} stroke={PALETTE.edge} strokeWidth={1.5} />);
            }
            return <g key={`edges-${node.id}`}>{edges}</g>;
          })}
          {nodes.map((node) => {
            const c = nodeColors(node.id);
            return (
              <g key={node.id}>
                <circle cx={node.x} cy={node.y} r={NODE_R} fill={c.fill} stroke={c.stroke} strokeWidth={2} />
                <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize={15} fontWeight={600} fill={PALETTE.text}>
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>
      </Box>

      {/* Stack and result */}
      <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Стек (вершина справа)
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', minHeight: 32, px: 1, py: 0.5, borderRadius: 1, bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)' }}>
            {step === null || step.stack.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                (пусто)
              </Typography>
            ) : (
              step.stack.map((id, i) => {
                const isTop = i === step.stack.length - 1;
                return (
                  <Box
                    key={i}
                    sx={{
                      px: 1,
                      py: 0.25,
                      borderRadius: 0.75,
                      bgcolor: isTop ? PALETTE.currentFill : PALETTE.stackFill,
                      border: 1,
                      borderColor: isTop ? PALETTE.currentStroke : PALETTE.stackStroke,
                      fontWeight: 600,
                      fontSize: '0.85rem',
                    }}
                  >
                    {id}
                  </Box>
                );
              })
            )}
          </Box>
        </Box>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Порядок посещения
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', minHeight: 32, px: 1, py: 0.5, borderRadius: 1, bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)' }}>
            {step === null || step.result.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                (пусто)
              </Typography>
            ) : (
              step.result.map((id, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {i > 0 && <Box sx={{ color: 'text.disabled' }}>→</Box>}
                  <Box sx={{ px: 1, py: 0.25, borderRadius: 0.75, bgcolor: PALETTE.visitedFill, border: 1, borderColor: PALETTE.visitedStroke, fontWeight: 600, fontSize: '0.85rem' }}>
                    {id}
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 2,
          px: 2,
          py: 1.25,
          borderRadius: 1.5,
          textAlign: 'center',
          bgcolor: step?.done
            ? (t) => (t.palette.mode === 'dark' ? 'rgba(52,199,89,0.15)' : 'rgba(52,199,89,0.12)')
            : (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
          color: step?.done ? 'success.main' : 'text.secondary',
          fontWeight: step?.done ? 600 : 400,
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
