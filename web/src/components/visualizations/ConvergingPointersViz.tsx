import React, { useState } from 'react';
import { Button, Paper, Typography, Box } from '@mui/material';
import { useVizColors } from './_colors';

interface Step {
  left: number;
  right: number;
  sum: number;
  found: boolean;
  description: string;
}

const arr = [1, 3, 5, 7, 9, 11];
const target = 12;

function computeSteps(): Step[] {
  const result: Step[] = [];
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) {
      result.push({
        left,
        right,
        sum,
        found: true,
        description: `${arr[left]} + ${arr[right]} = ${sum} === ${target} — Пара найдена!`,
      });
      break;
    } else if (sum < target) {
      result.push({
        left,
        right,
        sum,
        found: false,
        description: `${arr[left]} + ${arr[right]} = ${sum} < ${target} — сдвигаем left вправо`,
      });
      left++;
    } else {
      result.push({
        left,
        right,
        sum,
        found: false,
        description: `${arr[left]} + ${arr[right]} = ${sum} > ${target} — сдвигаем right влево`,
      });
      right--;
    }
  }

  return result;
}

const allSteps = computeSteps();

const CELL_W = 50;
const CELL_H = 40;
const GAP = 6;
const START_X = 30;
const START_Y = 30;
const POINTER_Y = START_Y + CELL_H + 30;

const baseColors = {
  primary: '#007AFF',
  success: '#34C759',
  red: '#FF3B30',
  activeBg: '#E8F0FE',
  cellBorder: '#C7C7CC',
  text: '#1C1C1E',
  lightText: '#8E8E93',
};

export default function ConvergingPointersViz() {
  const colors = useVizColors(baseColors);
  const [currentStep, setCurrentStep] = useState(0);

  const step = currentStep > 0 ? allSteps[currentStep - 1] : null;

  const cellX = (i: number) => START_X + i * (CELL_W + GAP);
  const cellCenterX = (i: number) => cellX(i) + CELL_W / 2;

  const svgWidth = START_X * 2 + arr.length * (CELL_W + GAP) - GAP;
  const svgHeight = POINTER_Y + 40;

  const getCellFill = (i: number) => {
    if (!step) return '#FFFFFF';
    if (step.found && (i === step.left || i === step.right)) return '#34C75920';
    return '#FFFFFF';
  };

  const getCellStroke = (i: number) => {
    if (!step) return colors.cellBorder;
    if (step.found && (i === step.left || i === step.right)) return colors.success;
    if (i === step.left) return colors.primary;
    if (i === step.right) return colors.red;
    return colors.cellBorder;
  };

  const getCellStrokeWidth = (i: number) => {
    if (!step) return 1.5;
    if (i === step.left || i === step.right) return 2.5;
    return 1.5;
  };

  const renderPointer = (index: number, label: string, color: string) => {
    const cx = cellCenterX(index);
    const ty = POINTER_Y;
    return (
      <g key={label}>
        <polygon
          points={`${cx},${ty - 10} ${cx - 7},${ty + 2} ${cx + 7},${ty + 2}`}
          fill={color}
        />
        <text
          x={cx}
          y={ty + 18}
          textAnchor="middle"
          fontSize={12}
          fontWeight={600}
          fill={color}
        >
          {label}
        </text>
      </g>
    );
  };

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 0.5, color: colors.text }}>
        Сходящиеся указатели
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: colors.lightText }}>
        Массив: [{arr.join(', ')}], цель: {target}
      </Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <svg
          width={svgWidth}
          height={svgHeight}
          style={{ display: 'block', margin: '0 auto' }}
        >
          {arr.map((val, i) => {
            const x = cellX(i);
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={START_Y}
                  width={CELL_W}
                  height={CELL_H}
                  rx={6}
                  fill={getCellFill(i)}
                  stroke={getCellStroke(i)}
                  strokeWidth={getCellStrokeWidth(i)}
                />
                <text
                  x={x + CELL_W / 2}
                  y={START_Y + CELL_H / 2 + 5}
                  textAnchor="middle"
                  fontSize={16}
                  fontWeight={500}
                  fill={colors.text}
                >
                  {val}
                </text>
                <text
                  x={x + CELL_W / 2}
                  y={START_Y - 8}
                  textAnchor="middle"
                  fontSize={11}
                  fill={colors.lightText}
                >
                  {i}
                </text>
              </g>
            );
          })}

          {step && (
            <>
              {renderPointer(step.left, 'left', step.found ? colors.success : colors.primary)}
              {renderPointer(step.right, 'right', step.found ? colors.success : colors.red)}
            </>
          )}
        </svg>
      </Box>

      {step && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: step.found ? colors.success : colors.text,
              mb: 1,
            }}
          >
            Сумма: {step.sum}
            {step.found ? ' = ' : ' \u2260 '}
            {target}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: step.found ? '#34C75918' : '#F2F2F7',
              color: step.found ? colors.success : colors.text,
              fontWeight: step.found ? 600 : 400,
            }}
          >
            Шаг {currentStep}: {step.description}
          </Typography>
        </Box>
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
          disabled={currentStep >= allSteps.length}
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
