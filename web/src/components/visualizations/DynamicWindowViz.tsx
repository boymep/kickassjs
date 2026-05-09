import React, { useState } from 'react';
import { Button, Paper, Typography, Box } from '@mui/material';
import { useVizColors } from './_colors';

const ARRAY = [2, 3, 1, 2, 4, 3];
const TARGET = 7;

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
  left: number;
  right: number;
  sum: number;
  minLen: number;
  action: 'expand' | 'shrink';
  conditionMet: boolean;
  isNewMin: boolean;
  description: string;
}

// Simulate: minSubarrayLen(7, [2, 3, 1, 2, 4, 3])
const steps: Step[] = [
  {
    left: 0,
    right: 0,
    sum: 2,
    minLen: Infinity,
    action: 'expand',
    conditionMet: false,
    isNewMin: false,
    description: 'Расширяем: right=0, добавляем 2, sum=2 < 7',
  },
  {
    left: 0,
    right: 1,
    sum: 5,
    minLen: Infinity,
    action: 'expand',
    conditionMet: false,
    isNewMin: false,
    description: 'Расширяем: right=1, добавляем 3, sum=5 < 7',
  },
  {
    left: 0,
    right: 2,
    sum: 6,
    minLen: Infinity,
    action: 'expand',
    conditionMet: false,
    isNewMin: false,
    description: 'Расширяем: right=2, добавляем 1, sum=6 < 7',
  },
  {
    left: 0,
    right: 3,
    sum: 8,
    minLen: 4,
    action: 'expand',
    conditionMet: true,
    isNewMin: true,
    description: 'Расширяем: right=3, добавляем 2, sum=8 >= 7, длина=4, minLen=4',
  },
  {
    left: 1,
    right: 3,
    sum: 6,
    minLen: 4,
    action: 'shrink',
    conditionMet: false,
    isNewMin: false,
    description: 'Сужаем: убираем arr[0]=2, sum=6 < 7',
  },
  {
    left: 1,
    right: 4,
    sum: 10,
    minLen: 4,
    action: 'expand',
    conditionMet: true,
    isNewMin: false,
    description: 'Расширяем: right=4, добавляем 4, sum=10 >= 7, длина=4',
  },
  {
    left: 2,
    right: 4,
    sum: 7,
    minLen: 3,
    action: 'shrink',
    conditionMet: true,
    isNewMin: true,
    description: 'Сужаем: убираем arr[1]=3, sum=7 >= 7, длина=3, minLen=3',
  },
  {
    left: 3,
    right: 4,
    sum: 6,
    minLen: 3,
    action: 'shrink',
    conditionMet: false,
    isNewMin: false,
    description: 'Сужаем: убираем arr[2]=1, sum=6 < 7',
  },
  {
    left: 3,
    right: 5,
    sum: 9,
    minLen: 3,
    action: 'expand',
    conditionMet: true,
    isNewMin: false,
    description: 'Расширяем: right=5, добавляем 3, sum=9 >= 7, длина=3',
  },
  {
    left: 4,
    right: 5,
    sum: 7,
    minLen: 2,
    action: 'shrink',
    conditionMet: true,
    isNewMin: true,
    description: 'Сужаем: убираем arr[3]=2, sum=7 >= 7, длина=2, minLen=2 — новый минимум!',
  },
  {
    left: 5,
    right: 5,
    sum: 3,
    minLen: 2,
    action: 'shrink',
    conditionMet: false,
    isNewMin: false,
    description: 'Сужаем: убираем arr[4]=4, sum=3 < 7. Ответ: 2',
  },
];

const CELL_W = 56;
const CELL_H = 44;
const CELL_GAP = 8;
const SVG_PADDING_X = 32;
const SVG_PADDING_TOP = 70;
const SVG_WIDTH = SVG_PADDING_X * 2 + ARRAY.length * (CELL_W + CELL_GAP) - CELL_GAP;
const SVG_HEIGHT = SVG_PADDING_TOP + CELL_H + 60;

const DynamicWindowViz: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  const cellX = (i: number) => SVG_PADDING_X + i * (CELL_W + CELL_GAP);
  const cellY = SVG_PADDING_TOP;

  const windowCells = step.right - step.left + 1;
  const windowX = cellX(step.left) - 4;
  const windowWidth = windowCells * (CELL_W + CELL_GAP) - CELL_GAP + 8;

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
        Динамическое окно
      </Typography>
      <Typography variant="body2" sx={{ color: COLORS.secondaryText, mb: 2 }}>
        {'Минимальный подмассив с суммой >= '}{TARGET}
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
          fill={step.conditionMet ? 'rgba(52, 199, 89, 0.12)' : COLORS.windowFill}
          stroke={step.conditionMet ? COLORS.success : COLORS.windowStroke}
          strokeWidth={2}
          strokeDasharray={step.conditionMet ? 'none' : '6 3'}
        />

        {/* Sum label above window */}
        <text
          x={windowX + windowWidth / 2}
          y={cellY - 18}
          textAnchor="middle"
          fontSize={14}
          fontWeight={700}
          fill={step.conditionMet ? COLORS.success : COLORS.primary}
        >
          sum = {step.sum}
          {step.conditionMet ? ' >= ' + TARGET : ' < ' + TARGET}
        </text>

        {/* Stats in top right */}
        <text
          x={SVG_WIDTH - SVG_PADDING_X}
          y={16}
          textAnchor="end"
          fontSize={12}
          fontWeight={600}
          fill={step.isNewMin ? COLORS.success : COLORS.secondaryText}
        >
          minLen = {step.minLen === Infinity ? '\u221E' : step.minLen}
          {step.isNewMin ? ' \u2713' : ''}
        </text>
        <text
          x={SVG_WIDTH - SVG_PADDING_X}
          y={32}
          textAnchor="end"
          fontSize={12}
          fontWeight={600}
          fill={COLORS.secondaryText}
        >
          длина = {windowCells}
        </text>

        {/* Action indicator */}
        <text
          x={SVG_PADDING_X}
          y={24}
          textAnchor="start"
          fontSize={12}
          fontWeight={700}
          fill={step.action === 'expand' ? COLORS.primary : COLORS.warning}
        >
          {step.action === 'expand' ? '\u2192 Расширяем' : '\u2190 Сужаем'}
        </text>

        {/* Array cells */}
        {ARRAY.map((val, i) => {
          const x = cellX(i);
          const inWindow = i >= step.left && i <= step.right;
          const isLeft = i === step.left;
          const isRight = i === step.right;

          let stroke = COLORS.cellBorder;
          let strokeWidth = 1;
          if (inWindow && step.conditionMet) {
            stroke = COLORS.success;
            strokeWidth = 1.5;
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
              {/* Left/Right pointer labels */}
              {isLeft && (
                <text
                  x={x + CELL_W / 2}
                  y={cellY + CELL_H + 34}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill={COLORS.warning}
                >
                  L
                </text>
              )}
              {isRight && (
                <text
                  x={x + CELL_W / 2}
                  y={cellY + CELL_H + 34}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill={COLORS.primary}
                >
                  R
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Description */}
      <Box
        sx={{
          mt: 2,
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

export default DynamicWindowViz;
