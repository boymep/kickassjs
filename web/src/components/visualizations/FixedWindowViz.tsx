import React, { useState } from 'react';
import { Button, Paper, Typography, Box } from '@mui/material';

const ARRAY = [2, 1, 5, 1, 3, 2];
const K = 3;

const COLORS = {
  primary: '#007AFF',
  success: '#34C759',
  warning: '#FF9500',
  bg: '#F2F2F7',
  cellBg: '#FFFFFF',
  cellBorder: '#C7C7CC',
  text: '#1C1C1E',
  secondaryText: '#8E8E93',
  windowFill: 'rgba(0, 122, 255, 0.12)',
  windowStroke: '#007AFF',
};

interface Step {
  windowStart: number;
  windowEnd: number;
  sum: number;
  maxSum: number;
  isNewMax: boolean;
  added: number | null;
  removed: number | null;
  addedIdx: number | null;
  removedIdx: number | null;
  formula: string;
  description: string;
}

const steps: Step[] = [
  {
    windowStart: 0,
    windowEnd: 2,
    sum: 8,
    maxSum: 8,
    isNewMax: true,
    added: null,
    removed: null,
    addedIdx: null,
    removedIdx: null,
    formula: 'sum = arr[0] + arr[1] + arr[2] = 2 + 1 + 5 = 8',
    description: 'Считаем сумму первого окна [2, 1, 5] = 8',
  },
  {
    windowStart: 1,
    windowEnd: 3,
    sum: 7,
    maxSum: 8,
    isNewMax: false,
    added: 1,
    removed: 2,
    addedIdx: 3,
    removedIdx: 0,
    formula: 'sum = 8 + arr[3] − arr[0] = 8 + 1 − 2 = 7',
    description: 'Сдвиг: добавляем arr[3]=1, убираем arr[0]=2, сумма = 7',
  },
  {
    windowStart: 2,
    windowEnd: 4,
    sum: 9,
    maxSum: 9,
    isNewMax: true,
    added: 3,
    removed: 1,
    addedIdx: 4,
    removedIdx: 1,
    formula: 'sum = 7 + arr[4] − arr[1] = 7 + 3 − 1 = 9',
    description: 'Сдвиг: добавляем arr[4]=3, убираем arr[1]=1, сумма = 9 — новый максимум!',
  },
  {
    windowStart: 3,
    windowEnd: 5,
    sum: 6,
    maxSum: 9,
    isNewMax: false,
    added: 2,
    removed: 5,
    addedIdx: 5,
    removedIdx: 2,
    formula: 'sum = 9 + arr[5] − arr[2] = 9 + 2 − 5 = 6',
    description: 'Сдвиг: добавляем arr[5]=2, убираем arr[2]=5, сумма = 6. Ответ: 9',
  },
];

const CELL_W = 56;
const CELL_H = 44;
const CELL_GAP = 8;
const SVG_PADDING_X = 32;
const SVG_PADDING_TOP = 70;
const SVG_WIDTH = SVG_PADDING_X * 2 + ARRAY.length * (CELL_W + CELL_GAP) - CELL_GAP;
const SVG_HEIGHT = SVG_PADDING_TOP + CELL_H + 50;

const FixedWindowViz: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  const cellX = (i: number) => SVG_PADDING_X + i * (CELL_W + CELL_GAP);
  const cellY = SVG_PADDING_TOP;

  const windowX = cellX(step.windowStart) - 4;
  const windowWidth = K * (CELL_W + CELL_GAP) - CELL_GAP + 8;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: COLORS.bg,
        border: '1px solid #E5E5EA',
        maxWidth: 520,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.text, mb: 0.5 }}>
        Фиксированное окно
      </Typography>
      <Typography variant="body2" sx={{ color: COLORS.secondaryText, mb: 2 }}>
        Максимальная сумма подмассива длины k={K}
      </Typography>

      <svg
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        style={{ display: 'block', margin: '0 auto' }}
      >
        {/* Window overlay */}
        <rect
          x={windowX}
          y={cellY - 6}
          width={windowWidth}
          height={CELL_H + 12}
          rx={10}
          fill={COLORS.windowFill}
          stroke={COLORS.windowStroke}
          strokeWidth={2}
          strokeDasharray={step.isNewMax ? 'none' : '6 3'}
        />

        {/* Sum label above window */}
        <text
          x={windowX + windowWidth / 2}
          y={cellY - 18}
          textAnchor="middle"
          fontSize={14}
          fontWeight={700}
          fill={step.isNewMax ? COLORS.success : COLORS.primary}
        >
          sum = {step.sum}
        </text>

        {/* Max sum label */}
        <text
          x={SVG_WIDTH - SVG_PADDING_X}
          y={24}
          textAnchor="end"
          fontSize={13}
          fontWeight={600}
          fill={step.isNewMax ? COLORS.success : COLORS.secondaryText}
        >
          maxSum = {step.maxSum}
          {step.isNewMax ? ' \u2713' : ''}
        </text>

        {/* Operation labels */}
        {step.addedIdx !== null && (
          <text
            x={cellX(step.addedIdx) + CELL_W / 2}
            y={cellY - 18}
            textAnchor="middle"
            fontSize={11}
            fontWeight={600}
            fill={COLORS.success}
          >
            +{step.added}
          </text>
        )}
        {step.removedIdx !== null && (
          <text
            x={cellX(step.removedIdx) + CELL_W / 2}
            y={cellY - 18}
            textAnchor="middle"
            fontSize={11}
            fontWeight={600}
            fill="#FF3B30"
          >
            −{step.removed}
          </text>
        )}

        {/* Array cells */}
        {ARRAY.map((val, i) => {
          const x = cellX(i);
          const inWindow = i >= step.windowStart && i <= step.windowEnd;
          const isAdded = i === step.addedIdx;
          const isRemoved = i === step.removedIdx;

          let stroke = COLORS.cellBorder;
          let strokeWidth = 1;
          if (isAdded) {
            stroke = COLORS.success;
            strokeWidth = 2;
          } else if (isRemoved) {
            stroke = '#FF3B30';
            strokeWidth = 2;
          } else if (inWindow) {
            stroke = COLORS.primary;
            strokeWidth = 1.5;
          }

          return (
            <g key={i}>
              <rect
                x={x}
                y={cellY}
                width={CELL_W}
                height={CELL_H}
                rx={8}
                fill={inWindow ? '#FFFFFF' : '#F9F9FB'}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
              <text
                x={x + CELL_W / 2}
                y={cellY + CELL_H / 2 + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={16}
                fontWeight={inWindow ? 700 : 500}
                fill={inWindow ? COLORS.text : COLORS.secondaryText}
              >
                {val}
              </text>
              {/* Index below */}
              <text
                x={x + CELL_W / 2}
                y={cellY + CELL_H + 18}
                textAnchor="middle"
                fontSize={11}
                fill={COLORS.secondaryText}
              >
                [{i}]
              </text>
            </g>
          );
        })}
      </svg>

      {/* Formula */}
      <Box
        sx={{
          mt: 1.5,
          px: 2,
          py: 1,
          bgcolor: '#FFFFFF',
          borderRadius: 2,
          border: '1px solid #E5E5EA',
          fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
          fontSize: 12,
          color: COLORS.primary,
          fontWeight: 600,
        }}
      >
        {step.formula}
      </Box>

      {/* Description */}
      <Box
        sx={{
          mt: 1.5,
          px: 2,
          py: 1.2,
          bgcolor: '#FFFFFF',
          borderRadius: 2,
          border: '1px solid #E5E5EA',
          minHeight: 42,
        }}
      >
        <Typography variant="body2" sx={{ color: COLORS.text, fontWeight: 500, fontSize: 13 }}>
          Шаг {currentStep + 1}/{steps.length}: {step.description}
        </Typography>
      </Box>

      {/* Buttons */}
      <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
        <Button
          variant="contained"
          disabled={currentStep >= steps.length - 1}
          onClick={() => setCurrentStep((s) => Math.min(s + 1, steps.length - 1))}
          sx={{
            bgcolor: COLORS.primary,
            textTransform: 'none',
            borderRadius: 2,
            fontWeight: 600,
            '&:hover': { bgcolor: '#0066D6' },
          }}
        >
          Следующий шаг
        </Button>
        <Button
          variant="outlined"
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(0)}
          sx={{
            borderColor: COLORS.primary,
            color: COLORS.primary,
            textTransform: 'none',
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          Сбросить
        </Button>
      </Box>
    </Paper>
  );
};

export default FixedWindowViz;
