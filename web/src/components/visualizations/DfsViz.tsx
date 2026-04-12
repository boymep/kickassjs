import React, { useState } from 'react';
import { Button, Paper, Typography, Box } from '@mui/material';

const colors = {
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
  left?: number;
  right?: number;
}

const nodes: TreeNode[] = [
  { id: 1, x: 200, y: 40, left: 2, right: 3 },
  { id: 2, x: 110, y: 120, left: 4, right: 5 },
  { id: 3, x: 290, y: 120, left: 6, right: 7 },
  { id: 4, x: 65, y: 200 },
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
  {
    currentNode: 1,
    visited: [],
    result: [1],
    stack: [3, 2],
    description: 'Посещаем корень — узел 1. В стек добавляем правого (3) и левого (2) потомков',
    done: false,
  },
  {
    currentNode: 2,
    visited: [1],
    result: [1, 2],
    stack: [3, 5, 4],
    description: 'Снимаем узел 2 со стека. Добавляем его потомков: 5 и 4',
    done: false,
  },
  {
    currentNode: 4,
    visited: [1, 2],
    result: [1, 2, 4],
    stack: [3, 5],
    description: 'Снимаем узел 4 со стека — это лист, потомков нет',
    done: false,
  },
  {
    currentNode: 5,
    visited: [1, 2, 4],
    result: [1, 2, 4, 5],
    stack: [3],
    description: 'Снимаем узел 5 со стека — это лист, потомков нет',
    done: false,
  },
  {
    currentNode: 3,
    visited: [1, 2, 4, 5],
    result: [1, 2, 4, 5, 3],
    stack: [7, 6],
    description: 'Снимаем узел 3 со стека. Добавляем его потомков: 7 и 6',
    done: false,
  },
  {
    currentNode: 6,
    visited: [1, 2, 4, 5, 3],
    result: [1, 2, 4, 5, 3, 6],
    stack: [7],
    description: 'Снимаем узел 6 со стека — это лист',
    done: false,
  },
  {
    currentNode: 7,
    visited: [1, 2, 4, 5, 3, 6],
    result: [1, 2, 4, 5, 3, 6, 7],
    stack: [],
    description: 'Снимаем узел 7 со стека — это лист. Стек пуст',
    done: false,
  },
  {
    currentNode: -1,
    visited: [1, 2, 4, 5, 3, 6, 7],
    result: [1, 2, 4, 5, 3, 6, 7],
    stack: [],
    description: 'Обход завершён! Порядок: 1 → 2 → 4 → 5 → 3 → 6 → 7',
    done: true,
  },
];

const NODE_R = 22;
const RESULT_CELL = 36;
const RESULT_GAP = 5;
const STACK_CELL = 36;
const STACK_GAP = 5;

export default function DfsViz() {
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
  const svgHeight = 420;

  const stackStartY = 250;
  const resultStartY = 340;

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 0.5, color: colors.text }}>
        DFS — обход в глубину (Pre-order)
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: colors.lightText }}>
        Порядок: корень → левое поддерево → правое поддерево
      </Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <svg
          width={svgWidth}
          height={svgHeight}
          style={{ display: 'block', margin: '0 auto' }}
        >
          {/* Edges */}
          {nodes.map((node) => {
            const children = [node.left, node.right].filter(Boolean) as number[];
            return children.map((childId) => {
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
            });
          })}

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

          {/* Stack label */}
          <text
            x={20}
            y={stackStartY - 10}
            fontSize={13}
            fontWeight={600}
            fill={colors.lightText}
          >
            Стек:
          </text>

          {/* Stack cells */}
          {step &&
            step.stack
              .slice()
              .reverse()
              .map((val, i) => {
                const x = 20 + i * (STACK_CELL + STACK_GAP);
                return (
                  <g key={`stack-${i}`}>
                    <rect
                      x={x}
                      y={stackStartY}
                      width={STACK_CELL}
                      height={STACK_CELL}
                      rx={8}
                      fill={i === 0 ? '#FFF3E0' : '#FFFFFF'}
                      stroke={i === 0 ? colors.orange : colors.cellBorder}
                      strokeWidth={i === 0 ? 2 : 1.5}
                    />
                    <text
                      x={x + STACK_CELL / 2}
                      y={stackStartY + STACK_CELL / 2 + 5}
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

          {step && step.stack.length === 0 && (
            <text
              x={20}
              y={stackStartY + STACK_CELL / 2 + 5}
              fontSize={13}
              fill={colors.lightText}
            >
              {step.done ? '(пуст)' : '—'}
            </text>
          )}

          {/* Stack top indicator */}
          {step && step.stack.length > 0 && (
            <text
              x={20}
              y={stackStartY + STACK_CELL + 16}
              fontSize={11}
              fill={colors.orange}
              fontWeight={600}
            >
              ↑ вершина
            </text>
          )}

          {/* Result array label */}
          <text
            x={20}
            y={resultStartY - 10}
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
                    y={resultStartY}
                    width={RESULT_CELL}
                    height={RESULT_CELL}
                    rx={8}
                    fill={isLatest ? colors.activeBg : '#FFFFFF'}
                    stroke={isLatest ? colors.primary : colors.cellBorder}
                    strokeWidth={isLatest ? 2 : 1.5}
                  />
                  <text
                    x={x + RESULT_CELL / 2}
                    y={resultStartY + RESULT_CELL / 2 + 5}
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
