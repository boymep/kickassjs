import React, { useState } from 'react';
import { Button, Paper, Typography, Box } from '@mui/material';

interface Step {
  slow: number;
  fast: number;
  array: number[];
  wrote: boolean;
  description: string;
  done: boolean;
}

const initialArr = [1, 1, 2, 2, 3];

function computeSteps(): Step[] {
  const result: Step[] = [];
  const nums = [...initialArr];
  let slow = 0;

  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
      result.push({
        slow,
        fast,
        array: [...nums],
        wrote: true,
        description: `arr[${fast}] = ${nums[slow]} \u2260 arr[${slow - 1}] = ${nums[slow - 1]} \u2014 slow++, записываем ${nums[slow]} в позицию ${slow}`,
        done: false,
      });
    } else {
      result.push({
        slow,
        fast,
        array: [...nums],
        wrote: false,
        description: `arr[${fast}] = ${nums[fast]} === arr[${slow}] = ${nums[slow]} \u2014 дубликат, пропускаем`,
        done: false,
      });
    }
  }

  // Final step
  result.push({
    slow,
    fast: nums.length - 1,
    array: [...nums],
    wrote: false,
    description: `Готово! Уникальных элементов: ${slow + 1}. Результат: [${nums.slice(0, slow + 1).join(', ')}]`,
    done: true,
  });

  return result;
}

const allSteps = computeSteps();

const CELL_W = 50;
const CELL_H = 40;
const GAP = 6;
const START_X = 30;
const START_Y = 30;
const POINTER_Y = START_Y + CELL_H + 30;

const colors = {
  primary: '#007AFF',
  success: '#34C759',
  red: '#FF3B30',
  orange: '#FF9500',
  activeBg: '#E8F0FE',
  cellBorder: '#C7C7CC',
  text: '#1C1C1E',
  lightText: '#8E8E93',
};

export default function ParallelPointersViz() {
  const [currentStep, setCurrentStep] = useState(0);

  const step = currentStep > 0 ? allSteps[currentStep - 1] : null;

  const displayArr = step ? step.array : initialArr;

  const cellX = (i: number) => START_X + i * (CELL_W + GAP);
  const cellCenterX = (i: number) => cellX(i) + CELL_W / 2;

  const svgWidth = START_X * 2 + initialArr.length * (CELL_W + GAP) - GAP;
  const svgHeight = POINTER_Y + 40;

  const getCellFill = (i: number) => {
    if (!step) return '#FFFFFF';
    if (step.done && i <= step.slow) return '#34C75920';
    if (i <= step.slow) return '#E8F0FE';
    return '#FFFFFF';
  };

  const getCellStroke = (i: number) => {
    if (!step) return colors.cellBorder;
    if (step.done && i <= step.slow) return colors.success;
    if (i === step.slow) return colors.primary;
    if (i === step.fast) return colors.orange;
    return colors.cellBorder;
  };

  const getCellStrokeWidth = (i: number) => {
    if (!step) return 1.5;
    if (i === step.slow || i === step.fast) return 2.5;
    if (step.done && i <= step.slow) return 2;
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
        Параллельные указатели: удаление дубликатов
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: colors.lightText }}>
        Массив: [{initialArr.join(', ')}]
      </Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <svg
          width={svgWidth}
          height={svgHeight}
          style={{ display: 'block', margin: '0 auto' }}
        >
          {displayArr.map((val, i) => {
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

          {step && !step.done && (
            <>
              {renderPointer(step.slow, 'slow', colors.primary)}
              {renderPointer(step.fast, 'fast', colors.orange)}
            </>
          )}
          {step && step.done && (
            <>
              {renderPointer(step.slow, 'slow', colors.success)}
            </>
          )}
        </svg>
      </Box>

      {step && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          {step.done ? (
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: colors.success,
                mb: 1,
              }}
            >
              Результат: [{step.array.slice(0, step.slow + 1).join(', ')}]
            </Typography>
          ) : (
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: step.wrote ? colors.primary : colors.text,
                mb: 1,
              }}
            >
              {step.wrote ? 'Записано!' : 'Дубликат'}
            </Typography>
          )}
          <Typography
            variant="body2"
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: step.done ? '#34C75918' : '#F2F2F7',
              color: step.done ? colors.success : colors.text,
              fontWeight: step.done ? 600 : 400,
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
