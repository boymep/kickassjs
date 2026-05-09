import React, { useState } from 'react';
import { Button, Paper, Typography, Box } from '@mui/material';
import { useVizColors } from './_colors';

const ARRAY = [3, 2, 4];
const TARGET = 6;

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
  key: number;
  value: number;
  isNew?: boolean;
}

interface Step {
  currentIdx: number;
  num: number;
  complement: number;
  found: boolean;
  resultIndices: [number, number] | null;
  mapEntries: MapEntry[];
  description: string;
}

const steps: Step[] = [
  {
    currentIdx: 0,
    num: 3,
    complement: 3,
    found: false,
    resultIndices: null,
    mapEntries: [{ key: 3, value: 0, isNew: true }],
    description: 'i=0, num=3, complement=3, Map пуст → добавляем {3: 0}',
  },
  {
    currentIdx: 1,
    num: 2,
    complement: 4,
    found: false,
    resultIndices: null,
    mapEntries: [
      { key: 3, value: 0 },
      { key: 2, value: 1, isNew: true },
    ],
    description: 'i=1, num=2, complement=4, Map.has(4) = false → добавляем {2: 1}',
  },
  {
    currentIdx: 2,
    num: 4,
    complement: 2,
    found: true,
    resultIndices: [1, 2],
    mapEntries: [
      { key: 3, value: 0 },
      { key: 2, value: 1 },
    ],
    description: 'i=2, num=4, complement=2, Map.has(2) = true → Найдено! [1, 2]',
  },
];

const CELL_W = 56;
const CELL_H = 44;
const CELL_GAP = 12;
const ARR_PADDING_X = 32;
const ARR_Y = 16;

const MAP_X = ARR_PADDING_X;
const MAP_Y = ARR_Y + CELL_H + 50;
const MAP_ROW_H = 32;
const MAP_KEY_W = 60;
const MAP_VAL_W = 60;
const MAP_ARROW_W = 30;
const MAP_TOTAL_W = MAP_KEY_W + MAP_ARROW_W + MAP_VAL_W;

const SVG_WIDTH = ARR_PADDING_X * 2 + ARRAY.length * (CELL_W + CELL_GAP) - CELL_GAP + 80;
const maxMapRows = 3;
const SVG_HEIGHT = MAP_Y + (maxMapRows + 1) * MAP_ROW_H + 16;

const HashMapViz: React.FC = () => {
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
        Two Sum — хеш-таблица
      </Typography>
      <Typography variant="body2" sx={{ color: COLORS.secondaryText, mb: 2 }}>
        Массив: [{ARRAY.join(', ')}], target = {TARGET}
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
          const isResult =
            step.found && step.resultIndices !== null && step.resultIndices.includes(i);

          let stroke = COLORS.cellBorder;
          let strokeWidth = 1;
          let fill = COLORS.cellBg;

          if (isResult) {
            stroke = COLORS.success;
            strokeWidth = 2.5;
            fill = COLORS.foundBg;
          } else if (isCurrent) {
            stroke = COLORS.warning;
            strokeWidth = 2.5;
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
                fontWeight={isCurrent || isResult ? 700 : 500}
                fill={isResult ? COLORS.success : isCurrent ? COLORS.warning : COLORS.text}
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

        {/* Complement label */}
        <text
          x={cellX(ARRAY.length - 1) + CELL_W + 24}
          y={ARR_Y + CELL_H / 2 + 1}
          dominantBaseline="central"
          fontSize={12}
          fontWeight={600}
          fill={step.found ? COLORS.success : COLORS.secondaryText}
        >
          complement = {step.complement}
        </text>

        {/* Map header */}
        <text
          x={MAP_X}
          y={MAP_Y - 6}
          fontSize={13}
          fontWeight={700}
          fill={COLORS.text}
        >
          HashMap
        </text>

        {/* Map table */}
        {/* Header row */}
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
          key
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
          value
        </text>

        {/* Map entries */}
        {step.mapEntries.map((entry, i) => {
          const rowY = MAP_Y + (i + 1) * MAP_ROW_H;
          const isHighlight =
            step.found && entry.key === step.complement;

          return (
            <g key={`${entry.key}-${entry.value}`}>
              <rect
                x={MAP_X}
                y={rowY}
                width={MAP_TOTAL_W}
                height={MAP_ROW_H}
                rx={i === step.mapEntries.length - 1 ? 6 : 0}
                fill={isHighlight ? COLORS.foundBg : '#FFFFFF'}
                stroke={isHighlight ? COLORS.success : '#E5E5EA'}
                strokeWidth={isHighlight ? 2 : 1}
              />
              {/* Key */}
              <text
                x={MAP_X + MAP_KEY_W / 2}
                y={rowY + MAP_ROW_H / 2 + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={14}
                fontWeight={entry.isNew || isHighlight ? 700 : 500}
                fill={
                  isHighlight
                    ? COLORS.success
                    : entry.isNew
                    ? COLORS.primary
                    : COLORS.text
                }
              >
                {entry.key}
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
                fontWeight={entry.isNew || isHighlight ? 700 : 500}
                fill={
                  isHighlight
                    ? COLORS.success
                    : entry.isNew
                    ? COLORS.primary
                    : COLORS.text
                }
              >
                {entry.value}
              </text>
              {/* "new" badge */}
              {entry.isNew && (
                <text
                  x={MAP_X + MAP_TOTAL_W + 10}
                  y={rowY + MAP_ROW_H / 2 + 1}
                  dominantBaseline="central"
                  fontSize={11}
                  fontWeight={600}
                  fill={COLORS.primary}
                >
                  ← новая
                </text>
              )}
            </g>
          );
        })}

        {/* Empty map indicator */}
        {step.mapEntries.length === 0 && (
          <text
            x={MAP_X + MAP_TOTAL_W / 2}
            y={MAP_Y + MAP_ROW_H + MAP_ROW_H / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
            fill={COLORS.secondaryText}
            fontStyle="italic"
          >
            (пусто)
          </text>
        )}

        {/* Result badge */}
        {step.found && step.resultIndices && (
          <g>
            <rect
              x={MAP_X + MAP_TOTAL_W + 30}
              y={MAP_Y + MAP_ROW_H}
              width={120}
              height={34}
              rx={10}
              fill={COLORS.success}
            />
            <text
              x={MAP_X + MAP_TOTAL_W + 90}
              y={MAP_Y + MAP_ROW_H + 18}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={13}
              fontWeight={700}
              fill="#FFFFFF"
            >
              Ответ: [{step.resultIndices.join(', ')}]
            </text>
          </g>
        )}
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

export default HashMapViz;
