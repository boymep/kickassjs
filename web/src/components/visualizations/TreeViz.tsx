import React, { useState } from 'react';
import { Button, Paper, Typography, Box } from '@mui/material';
import { useVizColors } from './_colors';

const baseColors = {
  primary: '#007AFF',
  success: '#34C759',
  orange: '#FF9500',
  red: '#FF3B30',
  activeBg: '#E8F0FE',
  inactiveBg: '#E5E5EA',
  cellBorder: '#C7C7CC',
  text: '#1C1C1E',
  lightText: '#8E8E93',
  visited: '#D1D1D6',
};

interface TreeNode {
  id: number;
  x: number;
  y: number;
  children: number[];
}

const nodes: TreeNode[] = [
  { id: 1, x: 200, y: 40, children: [2, 3, 4] },
  { id: 2, x: 80, y: 120, children: [5, 6] },
  { id: 3, x: 200, y: 120, children: [] },
  { id: 4, x: 320, y: 120, children: [7] },
  { id: 5, x: 40, y: 200, children: [] },
  { id: 6, x: 120, y: 200, children: [] },
  { id: 7, x: 320, y: 200, children: [] },
];

const nodeById = new Map(nodes.map((n) => [n.id, n]));

interface Step {
  currentNode: number;
  visited: number[];
  result: number[];
  description: string;
  done: boolean;
}

const steps: Step[] = [
  {
    currentNode: 1,
    visited: [],
    result: [1],
    description: 'Посещаем корень — узел 1',
    done: false,
  },
  {
    currentNode: 2,
    visited: [1],
    result: [1, 2],
    description: 'Идём в первого потомка узла 1 — узел 2',
    done: false,
  },
  {
    currentNode: 5,
    visited: [1, 2],
    result: [1, 2, 5],
    description: 'Идём в первого потомка узла 2 — узел 5 (лист)',
    done: false,
  },
  {
    currentNode: 6,
    visited: [1, 2, 5],
    result: [1, 2, 5, 6],
    description: 'Возвращаемся, идём во второго потомка узла 2 — узел 6 (лист)',
    done: false,
  },
  {
    currentNode: 3,
    visited: [1, 2, 5, 6],
    result: [1, 2, 5, 6, 3],
    description: 'Возвращаемся к узлу 1, идём в узел 3 (лист)',
    done: false,
  },
  {
    currentNode: 4,
    visited: [1, 2, 5, 6, 3],
    result: [1, 2, 5, 6, 3, 4],
    description: 'Идём в третьего потомка узла 1 — узел 4',
    done: false,
  },
  {
    currentNode: 7,
    visited: [1, 2, 5, 6, 3, 4],
    result: [1, 2, 5, 6, 3, 4, 7],
    description: 'Идём в потомка узла 4 — узел 7 (лист)',
    done: false,
  },
  {
    currentNode: -1,
    visited: [1, 2, 5, 6, 3, 4, 7],
    result: [1, 2, 5, 6, 3, 4, 7],
    description: 'Обход завершён!',
    done: true,
  },
];

const NODE_R = 22;
const RESULT_CELL = 40;
const RESULT_GAP = 6;
const RESULT_Y = 260;

export default function TreeViz() {
  const colors = useVizColors(baseColors);
  const [currentStep, setCurrentStep] = useState(0);

  const step = currentStep > 0 ? steps[currentStep - 1] : null;

  const getNodeFill = (id: number) => {
    if (!step) return '#FFFFFF';
    if (step.currentNode === id) return colors.primary;
    if (step.visited.includes(id)) return colors.visited;
    return '#FFFFFF';
  };

  const getNodeTextFill = (id: number) => {
    if (!step) return colors.text;
    if (step.currentNode === id) return '#FFFFFF';
    return colors.text;
  };

  const getNodeStroke = (id: number) => {
    if (!step) return colors.cellBorder;
    if (step.currentNode === id) return colors.primary;
    if (step.visited.includes(id)) return colors.visited;
    return colors.cellBorder;
  };

  const svgWidth = 400;
  const svgHeight = 320;

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 0.5, color: colors.text }}>
        Обход дерева в глубину (DFS)
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: colors.lightText }}>
        Прямой обход (pre-order) дерева
      </Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <svg
          width={svgWidth}
          height={svgHeight}
          style={{ display: 'block', margin: '0 auto' }}
        >
          {/* Edges */}
          {nodes.map((node) =>
            node.children.map((childId) => {
              const child = nodeById.get(childId)!;
              return (
                <line
                  key={`${node.id}-${childId}`}
                  x1={node.x}
                  y1={node.y}
                  x2={child.x}
                  y2={child.y}
                  stroke={colors.cellBorder}
                  strokeWidth={1.5}
                />
              );
            }),
          )}

          {/* Nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={NODE_R}
                fill={getNodeFill(node.id)}
                stroke={getNodeStroke(node.id)}
                strokeWidth={2}
              />
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                fontSize={15}
                fontWeight={600}
                fill={getNodeTextFill(node.id)}
              >
                {node.id}
              </text>
              {/* Visited checkmark */}
              {step && step.visited.includes(node.id) && step.currentNode !== node.id && (
                <text
                  x={node.x + NODE_R - 2}
                  y={node.y - NODE_R + 6}
                  fontSize={12}
                  fill={colors.success}
                  fontWeight={700}
                >
                  ✓
                </text>
              )}
            </g>
          ))}

          {/* Result array label */}
          <text
            x={20}
            y={RESULT_Y - 10}
            fontSize={13}
            fontWeight={600}
            fill={colors.lightText}
          >
            Результат:
          </text>

          {/* Result array cells */}
          {step &&
            step.result.map((val, i) => {
              const x = 20 + i * (RESULT_CELL + RESULT_GAP);
              const isLatest = i === step.result.length - 1 && !step.done;
              return (
                <g key={`result-${i}`}>
                  <rect
                    x={x}
                    y={RESULT_Y}
                    width={RESULT_CELL}
                    height={RESULT_CELL}
                    rx={8}
                    fill={isLatest ? colors.activeBg : '#FFFFFF'}
                    stroke={isLatest ? colors.primary : colors.cellBorder}
                    strokeWidth={isLatest ? 2 : 1.5}
                  />
                  <text
                    x={x + RESULT_CELL / 2}
                    y={RESULT_Y + RESULT_CELL / 2 + 5}
                    textAnchor="middle"
                    fontSize={15}
                    fontWeight={500}
                    fill={colors.text}
                  >
                    {val}
                  </text>
                </g>
              );
            })}
        </svg>
      </Box>

      {step && (
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 2,
            bgcolor: step.done ? '#34C75918' : '#F2F2F7',
            color: step.done ? colors.success : colors.text,
            fontWeight: step.done ? 600 : 400,
            textAlign: 'center',
          }}
        >
          Шаг {currentStep}: {step.description}
        </Typography>
      )}

      {!step && (
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 2,
            bgcolor: '#F2F2F7',
            textAlign: 'center',
            color: colors.lightText,
          }}
        >
          Нажмите &laquo;Следующий шаг&raquo; для начала
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
        <Button
          variant="contained"
          disabled={currentStep >= steps.length}
          onClick={() => setCurrentStep((s) => s + 1)}
          sx={{
            bgcolor: colors.primary,
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': { bgcolor: '#005EC4' },
          }}
        >
          Следующий шаг
        </Button>
        <Button
          variant="outlined"
          onClick={() => setCurrentStep(0)}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            borderColor: colors.primary,
            color: colors.primary,
          }}
        >
          Сбросить
        </Button>
      </Box>
    </Paper>
  );
}
