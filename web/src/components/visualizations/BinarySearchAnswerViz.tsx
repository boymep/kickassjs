import React, { useState } from 'react';
import { Button, Paper, Typography, Box } from '@mui/material';
import { useVizColors } from './_colors';

interface Step {
  left: number;
  right: number;
  mid: number;
  hours: number;
  fits: boolean;
  result: number | null;
  description: string;
  calcDetail: string;
}

const orders = [3, 6, 7, 11];
const maxHours = 8;

function calcHours(speed: number): { total: number; detail: string } {
  const parts = orders.map((o) => Math.ceil(o / speed));
  const total = parts.reduce((a, b) => a + b, 0);
  const detail = orders
    .map((o, i) => `⌈${o}/${speed}⌉=${parts[i]}`)
    .join(' + ');
  return { total, detail };
}

// Pre-compute all steps
function buildSteps(): Step[] {
  const result: Step[] = [];
  let left = 1;
  let right = 11;
  let best: number | null = null;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const { total, detail } = calcHours(mid);
    const fits = total <= maxHours;
    if (fits) {
      best = mid;
    }

    result.push({
      left,
      right,
      mid,
      hours: total,
      fits,
      result: fits ? mid : best,
      description: fits
        ? `speed=${mid}: ${total} ≤ ${maxHours} — подходит! result=${mid}, сужаем right=${mid - 1}`
        : `speed=${mid}: ${total} > ${maxHours} — не подходит, сужаем left=${mid + 1}`,
      calcDetail: `${detail} = ${total}`,
    });

    if (fits) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return result;
}

const steps = buildSteps();

const CELL_W = 44;
const CELL_H = 36;
const GAP = 4;
const START_X = 20;
const START_Y = 30;
const POINTER_Y = START_Y + CELL_H + 28;

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

const searchSpace = Array.from({ length: 11 }, (_, i) => i + 1);

export default function BinarySearchAnswerViz() {
  const colors = useVizColors(baseColors);
  const [currentStep, setCurrentStep] = useState(0);

  const step = currentStep > 0 ? steps[currentStep - 1] : null;

  const cellX = (i: number) => START_X + i * (CELL_W + GAP);
  const cellCenterX = (i: number) => cellX(i) + CELL_W / 2;

  const svgWidth = START_X * 2 + searchSpace.length * (CELL_W + GAP) - GAP;
  const svgHeight = POINTER_Y + 40;

  const getCellFill = (value: number) => {
    if (!step) return '#FFFFFF';
    if (step.fits && value === step.mid) return colors.success + '40';
    if (!step.fits && value === step.mid) return colors.red + '25';
    if (value >= step.left && value <= step.right) return colors.activeBg;
    return colors.inactiveBg;
  };

  const getCellStroke = (value: number) => {
    if (!step) return colors.cellBorder;
    if (value === step.mid) return step.fits ? colors.success : colors.red;
    if (value >= step.left && value <= step.right) return colors.primary;
    return colors.cellBorder;
  };

  const renderPointer = (value: number, label: string, color: string) => {
    const idx = value - 1;
    const cx = cellCenterX(idx);
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

  const isFinished = currentStep >= steps.length;
  const finalResult = isFinished ? steps[steps.length - 1].result : null;

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 0.5, color: colors.text }}>
        Бинарный поиск по ответу
      </Typography>
      <Typography variant="body2" sx={{ mb: 0.5, color: colors.lightText }}>
        Задача: orders = [{orders.join(', ')}], hours = {maxHours}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: colors.lightText }}>
        Найти минимальную скорость доставки. Пространство поиска: speed от 1 до{' '}
        {Math.max(...orders)}
      </Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <svg
          width={svgWidth}
          height={svgHeight}
          style={{ display: 'block', margin: '0 auto' }}
        >
          {searchSpace.map((val, i) => {
            const x = cellX(i);
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={START_Y}
                  width={CELL_W}
                  height={CELL_H}
                  rx={6}
                  fill={getCellFill(val)}
                  stroke={getCellStroke(val)}
                  strokeWidth={1.5}
                />
                <text
                  x={x + CELL_W / 2}
                  y={START_Y + CELL_H / 2 + 5}
                  textAnchor="middle"
                  fontSize={15}
                  fontWeight={500}
                  fill={colors.text}
                >
                  {val}
                </text>
                <text
                  x={x + CELL_W / 2}
                  y={START_Y - 8}
                  textAnchor="middle"
                  fontSize={10}
                  fill={colors.lightText}
                >
                  speed
                </text>
              </g>
            );
          })}

          {step && (
            <>
              {renderPointer(step.left, 'left', colors.primary)}
              {renderPointer(step.mid, 'mid', colors.orange)}
              {renderPointer(step.right, 'right', colors.red)}
            </>
          )}
        </svg>
      </Box>

      {step && (
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="body2"
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: '#F2F2F7',
              color: colors.lightText,
              fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
              fontSize: '0.82rem',
              mb: 1,
            }}
          >
            Часы = {step.calcDetail}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: step.fits ? '#34C75918' : '#FF3B3018',
              color: step.fits ? colors.success : colors.red,
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            Шаг {currentStep}: {step.description}
          </Typography>
        </Box>
      )}

      {!step && !isFinished && (
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

      {isFinished && (
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 2,
            bgcolor: '#34C75918',
            color: colors.success,
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          Ответ: минимальная скорость = {finalResult}. Мы искали не по массиву, а
          по пространству ответов!
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
        <Button
          variant="contained"
          disabled={isFinished}
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
