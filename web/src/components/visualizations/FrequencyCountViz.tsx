import React, { useState } from 'react';
import { Button, Paper, Typography, Box } from '@mui/material';
import { useVizColors } from './_colors';

const ARRAY = ['a', 'b', 'a', 'c', 'b', 'a'];

const COLORS = {
  primary: '#007AFF',
  success: '#34C759',
  warning: '#FF9500',
  bg: '#F2F2F7',
  cellBg: '#FFFFFF',
  cellBorder: '#C7C7CC',
  text: '#1C1C1E',
  secondaryText: '#8E8E93',
  foundBg: 'rgba(52, 199, 89, 0.12)',
};

interface MapEntry {
  key: string;
  value: number;
  isNew?: boolean;
  isUpdated?: boolean;
}

interface Step {
  currentIdx: number;
  mapEntries: MapEntry[];
  description: string;
}

const steps: Step[] = [
  {
    currentIdx: 0,
    mapEntries: [{ key: 'a', value: 1, isNew: true }],
    description: 'i=0, элемент "a" — ключа нет в Map, создаём {a: 1}',
  },
  {
    currentIdx: 1,
    mapEntries: [
      { key: 'a', value: 1 },
      { key: 'b', value: 1, isNew: true },
    ],
    description: 'i=1, элемент "b" — ключа нет в Map, создаём {b: 1}',
  },
  {
    currentIdx: 2,
    mapEntries: [
      { key: 'a', value: 2, isUpdated: true },
      { key: 'b', value: 1 },
    ],
    description: 'i=2, элемент "a" — ключ уже есть, увеличиваем: a → 2',
  },
  {
    currentIdx: 3,
    mapEntries: [
      { key: 'a', value: 2 },
      { key: 'b', value: 1 },
      { key: 'c', value: 1, isNew: true },
    ],
    description: 'i=3, элемент "c" — ключа нет в Map, создаём {c: 1}',
  },
  {
    currentIdx: 4,
    mapEntries: [
      { key: 'a', value: 2 },
      { key: 'b', value: 2, isUpdated: true },
      { key: 'c', value: 1 },
    ],
    description: 'i=4, элемент "b" — ключ уже есть, увеличиваем: b → 2',
  },
  {
    currentIdx: 5,
    mapEntries: [
      { key: 'a', value: 3, isUpdated: true },
      { key: 'b', value: 2 },
      { key: 'c', value: 1 },
    ],
    description: 'i=5, элемент "a" — ключ уже есть, увеличиваем: a → 3',
  },
];

const CELL_W = 48;
const CELL_H = 44;
const CELL_GAP = 10;
const ARR_PADDING_X = 32;
const ARR_Y = 16;

const MAP_X = ARR_PADDING_X;
const MAP_Y = ARR_Y + CELL_H + 50;
const MAP_ROW_H = 32;
const MAP_KEY_W = 60;
const MAP_VAL_W = 60;
const MAP_ARROW_W = 30;
const MAP_TOTAL_W = MAP_KEY_W + MAP_ARROW_W + MAP_VAL_W;

const SVG_WIDTH = ARR_PADDING_X * 2 + ARRAY.length * (CELL_W + CELL_GAP) - CELL_GAP + 40;
const maxMapRows = 3;
const SVG_HEIGHT = MAP_Y + (maxMapRows + 1) * MAP_ROW_H + 16;

const FrequencyCountViz: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  const cellX = (i: number) => ARR_PADDING_X + i * (CELL_W + CELL_GAP);

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
        Частотный подсчёт
      </Typography>
      <Typography variant="body2" sx={{ color: COLORS.secondaryText, mb: 2 }}>
        Массив: [{ARRAY.map((v) => `"${v}"`).join(', ')}]
      </Typography>

      <svg
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        style={{ display: 'block', margin: '0 auto' }}
      >
        {/* Array cells */}
        {ARRAY.map((val, i) => {
          const x = cellX(i);
          const isCurrent = i === step.currentIdx;
          const isProcessed = i < step.currentIdx;

          let stroke = COLORS.cellBorder;
          let strokeWidth = 1;
          let fill = COLORS.cellBg;

          if (isCurrent) {
            stroke = COLORS.warning;
            strokeWidth = 2.5;
          } else if (isProcessed) {
            fill = COLORS.foundBg;
            stroke = COLORS.success;
            strokeWidth = 1.5;
          }

          return (
            <g key={i}>
              <rect
                x={x}
                y={ARR_Y}
                width={CELL_W}
                height={CELL_H}
                rx={8}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
              <text
                x={x + CELL_W / 2}
                y={ARR_Y + CELL_H / 2 + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={16}
                fontWeight={isCurrent ? 700 : 500}
                fill={isCurrent ? COLORS.warning : isProcessed ? COLORS.success : COLORS.text}
              >
                {val}
              </text>
              <text
                x={x + CELL_W / 2}
                y={ARR_Y + CELL_H + 16}
                textAnchor="middle"
                fontSize={11}
                fill={COLORS.secondaryText}
              >
                [{i}]
              </text>
            </g>
          );
        })}

        {/* Map header */}
        <text
          x={MAP_X}
          y={MAP_Y - 6}
          fontSize={13}
          fontWeight={700}
          fill={COLORS.text}
        >
          Частотная Map
        </text>

        {/* Map table header row */}
        <rect
          x={MAP_X}
          y={MAP_Y}
          width={MAP_TOTAL_W}
          height={MAP_ROW_H}
          rx={6}
          fill="#E5E5EA"
        />
        <text
          x={MAP_X + MAP_KEY_W / 2}
          y={MAP_Y + MAP_ROW_H / 2 + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={12}
          fontWeight={700}
          fill={COLORS.secondaryText}
        >
          элемент
        </text>
        <text
          x={MAP_X + MAP_KEY_W + MAP_ARROW_W + MAP_VAL_W / 2}
          y={MAP_Y + MAP_ROW_H / 2 + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={12}
          fontWeight={700}
          fill={COLORS.secondaryText}
        >
          счётчик
        </text>

        {/* Map entries */}
        {step.mapEntries.map((entry, i) => {
          const rowY = MAP_Y + (i + 1) * MAP_ROW_H;
          const isHighlight = entry.isNew || entry.isUpdated;

          return (
            <g key={entry.key}>
              <rect
                x={MAP_X}
                y={rowY}
                width={MAP_TOTAL_W}
                height={MAP_ROW_H}
                rx={i === step.mapEntries.length - 1 ? 6 : 0}
                fill={isHighlight ? (entry.isNew ? 'rgba(0, 122, 255, 0.08)' : COLORS.foundBg) : '#FFFFFF'}
                stroke={isHighlight ? (entry.isNew ? COLORS.primary : COLORS.success) : '#E5E5EA'}
                strokeWidth={isHighlight ? 2 : 1}
              />
              {/* Key */}
              <text
                x={MAP_X + MAP_KEY_W / 2}
                y={rowY + MAP_ROW_H / 2 + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={14}
                fontWeight={isHighlight ? 700 : 500}
                fill={
                  entry.isNew
                    ? COLORS.primary
                    : entry.isUpdated
                    ? COLORS.success
                    : COLORS.text
                }
              >
                "{entry.key}"
              </text>
              {/* Arrow */}
              <text
                x={MAP_X + MAP_KEY_W + MAP_ARROW_W / 2}
                y={rowY + MAP_ROW_H / 2 + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={13}
                fill={COLORS.secondaryText}
              >
                →
              </text>
              {/* Value */}
              <text
                x={MAP_X + MAP_KEY_W + MAP_ARROW_W + MAP_VAL_W / 2}
                y={rowY + MAP_ROW_H / 2 + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={14}
                fontWeight={isHighlight ? 700 : 500}
                fill={
                  entry.isNew
                    ? COLORS.primary
                    : entry.isUpdated
                    ? COLORS.success
                    : COLORS.text
                }
              >
                {entry.value}
              </text>
              {/* Badge */}
              {entry.isNew && (
                <text
                  x={MAP_X + MAP_TOTAL_W + 10}
                  y={rowY + MAP_ROW_H / 2 + 1}
                  dominantBaseline="central"
                  fontSize={11}
                  fontWeight={600}
                  fill={COLORS.primary}
                >
                  ← новый
                </text>
              )}
              {entry.isUpdated && (
                <text
                  x={MAP_X + MAP_TOTAL_W + 10}
                  y={rowY + MAP_ROW_H / 2 + 1}
                  dominantBaseline="central"
                  fontSize={11}
                  fontWeight={600}
                  fill={COLORS.success}
                >
                  ← обновлён
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

export default FrequencyCountViz;
