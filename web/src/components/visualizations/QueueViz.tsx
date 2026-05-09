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
};

const elementColors = [baseColors.primary, baseColors.success, baseColors.orange, baseColors.red];

interface Step {
  queue: string[];
  action: 'enqueue' | 'dequeue' | 'done';
  element: string;
  description: string;
  dequeued: string[];
}

const steps: Step[] = [
  {
    queue: ['A'],
    action: 'enqueue',
    element: 'A',
    description: "Добавляем 'A' в конец очереди (enqueue)",
    dequeued: [],
  },
  {
    queue: ['A', 'B'],
    action: 'enqueue',
    element: 'B',
    description: "Добавляем 'B' в конец очереди (enqueue)",
    dequeued: [],
  },
  {
    queue: ['A', 'B', 'C'],
    action: 'enqueue',
    element: 'C',
    description: "Добавляем 'C' в конец очереди (enqueue)",
    dequeued: [],
  },
  {
    queue: ['A', 'B', 'C', 'D'],
    action: 'enqueue',
    element: 'D',
    description: "Добавляем 'D' в конец очереди (enqueue)",
    dequeued: [],
  },
  {
    queue: ['B', 'C', 'D'],
    action: 'dequeue',
    element: 'A',
    description: "Извлекаем 'A' из начала очереди (dequeue) — первый пришёл, первый вышел!",
    dequeued: ['A'],
  },
  {
    queue: ['C', 'D'],
    action: 'dequeue',
    element: 'B',
    description: "Извлекаем 'B' из начала очереди (dequeue)",
    dequeued: ['A', 'B'],
  },
  {
    queue: ['D'],
    action: 'dequeue',
    element: 'C',
    description: "Извлекаем 'C' из начала очереди (dequeue)",
    dequeued: ['A', 'B', 'C'],
  },
  {
    queue: [],
    action: 'dequeue',
    element: 'D',
    description: "Извлекаем 'D' из начала очереди (dequeue)",
    dequeued: ['A', 'B', 'C', 'D'],
  },
  {
    queue: [],
    action: 'done',
    element: '',
    description: 'Очередь пуста. Порядок извлечения: A → B → C → D — это и есть FIFO!',
    dequeued: ['A', 'B', 'C', 'D'],
  },
];

const CELL_W = 56;
const CELL_H = 44;
const CELL_GAP = 8;
const QUEUE_Y = 80;
const QUEUE_START_X = 80;

const colorForElement = (el: string): string => {
  const idx = 'ABCD'.indexOf(el);
  return idx >= 0 ? elementColors[idx] : baseColors.primary;
};

export default function QueueViz() {
  const colors = useVizColors(baseColors);
  const [currentStep, setCurrentStep] = useState(0);

  const step = currentStep > 0 ? steps[currentStep - 1] : null;

  const svgWidth = 460;
  const svgHeight = 200;

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 0.5, color: colors.text }}>
        Очередь: FIFO (First In, First Out)
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: colors.lightText }}>
        Добавляем элементы [A, B, C, D], затем извлекаем их
      </Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <svg
          width={svgWidth}
          height={svgHeight}
          style={{ display: 'block', margin: '0 auto' }}
        >
          {/* Labels */}
          <text
            x={QUEUE_START_X}
            y={QUEUE_Y - 16}
            fontSize={13}
            fontWeight={600}
            fill={colors.lightText}
          >
            Очередь:
          </text>

          {/* Front label */}
          {step && step.queue.length > 0 && (
            <text
              x={QUEUE_START_X + CELL_W / 2}
              y={QUEUE_Y + CELL_H + 22}
              textAnchor="middle"
              fontSize={11}
              fontWeight={600}
              fill={colors.primary}
            >
              ↑ начало
            </text>
          )}

          {/* Back label */}
          {step && step.queue.length > 0 && (
            <text
              x={QUEUE_START_X + (step.queue.length - 1) * (CELL_W + CELL_GAP) + CELL_W / 2}
              y={QUEUE_Y + CELL_H + 22}
              textAnchor="middle"
              fontSize={11}
              fontWeight={600}
              fill={colors.orange}
            >
              ↑ конец
            </text>
          )}

          {/* Queue elements */}
          {step &&
            step.queue.map((el, i) => {
              const x = QUEUE_START_X + i * (CELL_W + CELL_GAP);
              const color = colorForElement(el);
              const isFirst = i === 0;
              const isLast = i === step.queue.length - 1;
              return (
                <g key={`q-${i}`}>
                  <rect
                    x={x}
                    y={QUEUE_Y}
                    width={CELL_W}
                    height={CELL_H}
                    rx={8}
                    fill={color + '20'}
                    stroke={color}
                    strokeWidth={isFirst || isLast ? 2.5 : 1.5}
                  />
                  <text
                    x={x + CELL_W / 2}
                    y={QUEUE_Y + CELL_H / 2 + 6}
                    textAnchor="middle"
                    fontSize={18}
                    fontWeight={600}
                    fill={color}
                  >
                    {el}
                  </text>
                </g>
              );
            })}

          {/* Dequeue arrow */}
          {step && step.action === 'dequeue' && (
            <g>
              <line
                x1={QUEUE_START_X - 10}
                y1={QUEUE_Y + CELL_H / 2}
                x2={QUEUE_START_X - 36}
                y2={QUEUE_Y + CELL_H / 2}
                stroke={colors.red}
                strokeWidth={2}
                markerEnd="url(#arrowLeft)"
              />
              <defs>
                <marker
                  id="arrowLeft"
                  viewBox="0 0 10 10"
                  refX="10"
                  refY="5"
                  markerWidth={8}
                  markerHeight={8}
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={colors.red} />
                </marker>
              </defs>
            </g>
          )}

          {/* Enqueue arrow */}
          {step && step.action === 'enqueue' && (
            <g>
              {(() => {
                const lastX = QUEUE_START_X + (step.queue.length - 1) * (CELL_W + CELL_GAP);
                return (
                  <line
                    x1={lastX + CELL_W + 36}
                    y1={QUEUE_Y + CELL_H / 2}
                    x2={lastX + CELL_W + 10}
                    y2={QUEUE_Y + CELL_H / 2}
                    stroke={colors.success}
                    strokeWidth={2}
                    markerEnd="url(#arrowRight)"
                  />
                );
              })()}
              <defs>
                <marker
                  id="arrowRight"
                  viewBox="0 0 10 10"
                  refX="0"
                  refY="5"
                  markerWidth={8}
                  markerHeight={8}
                  orient="auto-start-reverse"
                >
                  <path d="M 10 0 L 0 5 L 10 10 z" fill={colors.success} />
                </marker>
              </defs>
            </g>
          )}

          {/* Empty queue message */}
          {step && step.queue.length === 0 && (
            <text
              x={QUEUE_START_X + 60}
              y={QUEUE_Y + CELL_H / 2 + 5}
              textAnchor="middle"
              fontSize={14}
              fontWeight={500}
              fill={colors.lightText}
            >
              (пусто)
            </text>
          )}

          {/* Dequeued elements */}
          {step && step.dequeued.length > 0 && (
            <>
              <text
                x={QUEUE_START_X}
                y={QUEUE_Y + CELL_H + 54}
                fontSize={13}
                fontWeight={600}
                fill={colors.lightText}
              >
                Извлечено:
              </text>
              {step.dequeued.map((el, i) => {
                const x = QUEUE_START_X + 90 + i * (36 + 6);
                const color = colorForElement(el);
                return (
                  <g key={`dq-${i}`}>
                    <rect
                      x={x}
                      y={QUEUE_Y + CELL_H + 38}
                      width={36}
                      height={28}
                      rx={6}
                      fill={color + '15'}
                      stroke={color}
                      strokeWidth={1.5}
                    />
                    <text
                      x={x + 18}
                      y={QUEUE_Y + CELL_H + 57}
                      textAnchor="middle"
                      fontSize={14}
                      fontWeight={600}
                      fill={color}
                    >
                      {el}
                    </text>
                  </g>
                );
              })}
            </>
          )}

          {/* Done message */}
          {step && step.action === 'done' && (
            <text
              x={svgWidth / 2}
              y={QUEUE_Y + CELL_H / 2 + 5}
              textAnchor="middle"
              fontSize={16}
              fontWeight={700}
              fill={colors.success}
            >
              FIFO — порядок сохранён!
            </text>
          )}
        </svg>
      </Box>

      {step && (
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 2,
            bgcolor:
              step.action === 'done'
                ? '#34C75918'
                : step.action === 'dequeue'
                  ? '#FF3B3010'
                  : '#34C75910',
            color: step.action === 'done' ? colors.success : colors.text,
            fontWeight: step.action === 'done' ? 600 : 400,
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
