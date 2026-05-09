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

const input = [2, 1, 4, 3, 5];

interface Step {
  currentIndex: number;
  stack: number[]; // indices into input
  result: (number | null)[];
  poppedIndices: number[];
  action: 'push' | 'pop-then-push' | 'done';
  description: string;
}

// Build steps: for each element, pop everything smaller, then push.
// We show intermediate states.
const buildSteps = (): Step[] => {
  const result: Step[] = [];
  const stack: number[] = [];
  const res: (number | null)[] = new Array(input.length).fill(null);

  for (let i = 0; i < input.length; i++) {
    const popped: number[] = [];
    while (stack.length > 0 && input[i] > input[stack[stack.length - 1]]) {
      const idx = stack.pop()!;
      res[idx] = input[i];
      popped.push(idx);
    }

    if (popped.length > 0) {
      // Show pops + push as one step
      stack.push(i);
      result.push({
        currentIndex: i,
        stack: [...stack],
        result: [...res],
        poppedIndices: popped,
        action: 'pop-then-push',
        description: `Элемент ${input[i]}: больше вершины стека → извлекаем ${popped.map((p) => input[p]).join(', ')} (нашли для них ответ = ${input[i]}), кладём ${input[i]}`,
      });
    } else {
      stack.push(i);
      result.push({
        currentIndex: i,
        stack: [...stack],
        result: [...res],
        poppedIndices: [],
        action: 'push',
        description:
          stack.length === 1
            ? `Элемент ${input[i]}: стек пуст → кладём ${input[i]}`
            : `Элемент ${input[i]}: не больше вершины стека (${input[stack[stack.length - 2]]}) → просто кладём ${input[i]}`,
      });
    }
  }

  // Mark remaining as -1
  const finalRes = [...res];
  const remaining = [...stack];
  for (const idx of remaining) {
    if (finalRes[idx] === null) finalRes[idx] = -1;
  }

  result.push({
    currentIndex: -1,
    stack: [...stack],
    result: finalRes,
    poppedIndices: [],
    action: 'done',
    description:
      'Обход завершён. Оставшиеся в стеке элементы не имеют следующего большего → -1',
  });

  return result;
};

const steps = buildSteps();

const CELL_W = 50;
const CELL_H = 40;
const CELL_GAP = 8;
const ARRAY_Y = 20;
const ARRAY_START_X = 90;

const STACK_CELL_W = 50;
const STACK_CELL_H = 36;
const STACK_GAP = 6;
const STACK_BASE_Y = 235;
const STACK_X = 30;

const RESULT_Y = 280;
const RESULT_START_X = 90;

export default function MonotonicStackViz() {
  const colors = useVizColors(baseColors);
  const [currentStep, setCurrentStep] = useState(0);

  const step = currentStep > 0 ? steps[currentStep - 1] : null;

  const svgWidth = Math.max(
    ARRAY_START_X + input.length * (CELL_W + CELL_GAP) + 40,
    420,
  );
  const svgHeight = 340;

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 0.5, color: colors.text }}>
        Монотонный стек: следующий больший элемент
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: colors.lightText }}>
        Массив: [{input.join(', ')}]
      </Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <svg
          width={svgWidth}
          height={svgHeight}
          style={{ display: 'block', margin: '0 auto' }}
        >
          {/* Array label */}
          <text
            x={14}
            y={ARRAY_Y + CELL_H / 2 + 5}
            fontSize={13}
            fontWeight={600}
            fill={colors.lightText}
          >
            Массив:
          </text>

          {/* Array cells */}
          {input.map((val, i) => {
            const x = ARRAY_START_X + i * (CELL_W + CELL_GAP);
            const isCurrent = step && step.currentIndex === i;
            const isProcessed = step && step.currentIndex > i;
            const wasPopped = step && step.poppedIndices.includes(i);
            return (
              <g key={`arr-${i}`}>
                <rect
                  x={x}
                  y={ARRAY_Y}
                  width={CELL_W}
                  height={CELL_H}
                  rx={8}
                  fill={
                    isCurrent
                      ? colors.activeBg
                      : wasPopped
                        ? colors.success + '20'
                        : isProcessed
                          ? '#F2F2F7'
                          : '#FFFFFF'
                  }
                  stroke={
                    isCurrent
                      ? colors.primary
                      : wasPopped
                        ? colors.success
                        : colors.cellBorder
                  }
                  strokeWidth={isCurrent || wasPopped ? 2.5 : 1.5}
                />
                <text
                  x={x + CELL_W / 2}
                  y={ARRAY_Y + CELL_H / 2 + 6}
                  textAnchor="middle"
                  fontSize={18}
                  fontWeight={600}
                  fill={
                    isCurrent
                      ? colors.primary
                      : wasPopped
                        ? colors.success
                        : isProcessed
                          ? colors.lightText
                          : colors.text
                  }
                >
                  {val}
                </text>
                {/* Index label */}
                <text
                  x={x + CELL_W / 2}
                  y={ARRAY_Y - 6}
                  textAnchor="middle"
                  fontSize={10}
                  fill={colors.lightText}
                >
                  i={i}
                </text>
              </g>
            );
          })}

          {/* Stack label */}
          <text
            x={STACK_X}
            y={ARRAY_Y + CELL_H + 28}
            fontSize={13}
            fontWeight={600}
            fill={colors.lightText}
          >
            Стек (убывающий):
          </text>

          {/* Stack visualization — vertical, growing upward */}
          {step &&
            step.stack.map((arrIdx, i) => {
              const y = STACK_BASE_Y - (i + 1) * (STACK_CELL_H + STACK_GAP);
              const isTop = i === step.stack.length - 1;
              const color = isTop ? colors.primary : colors.orange;
              return (
                <g key={`stack-${i}`}>
                  <rect
                    x={STACK_X}
                    y={y}
                    width={STACK_CELL_W}
                    height={STACK_CELL_H}
                    rx={8}
                    fill={color + '20'}
                    stroke={color}
                    strokeWidth={isTop ? 2.5 : 1.5}
                  />
                  <text
                    x={STACK_X + STACK_CELL_W / 2}
                    y={y + STACK_CELL_H / 2 + 6}
                    textAnchor="middle"
                    fontSize={18}
                    fontWeight={600}
                    fill={color}
                  >
                    {input[arrIdx]}
                  </text>
                  {isTop && (
                    <text
                      x={STACK_X + STACK_CELL_W + 10}
                      y={y + STACK_CELL_H / 2 + 5}
                      fontSize={11}
                      fontWeight={600}
                      fill={colors.primary}
                    >
                      ← вершина
                    </text>
                  )}
                </g>
              );
            })}

          {/* Stack base line */}
          <line
            x1={STACK_X - 10}
            y1={STACK_BASE_Y + 4}
            x2={STACK_X + STACK_CELL_W + 10}
            y2={STACK_BASE_Y + 4}
            stroke={colors.cellBorder}
            strokeWidth={2}
            strokeLinecap="round"
          />

          {/* Result label */}
          <text
            x={14}
            y={RESULT_Y + CELL_H / 2 + 5}
            fontSize={13}
            fontWeight={600}
            fill={colors.lightText}
          >
            Ответ:
          </text>

          {/* Result array */}
          {input.map((_, i) => {
            const x = RESULT_START_X + i * (CELL_W + CELL_GAP);
            const val = step ? step.result[i] : null;
            const isFilled = val !== null;
            const fillColor = isFilled
              ? val === -1
                ? colors.red
                : colors.success
              : colors.cellBorder;
            return (
              <g key={`res-${i}`}>
                <rect
                  x={x}
                  y={RESULT_Y}
                  width={CELL_W}
                  height={CELL_H}
                  rx={8}
                  fill={isFilled ? fillColor + '15' : '#FFFFFF'}
                  stroke={isFilled ? fillColor : colors.cellBorder}
                  strokeWidth={isFilled ? 2 : 1.5}
                  strokeDasharray={isFilled ? undefined : '4 3'}
                />
                <text
                  x={x + CELL_W / 2}
                  y={RESULT_Y + CELL_H / 2 + 6}
                  textAnchor="middle"
                  fontSize={isFilled ? 18 : 13}
                  fontWeight={isFilled ? 600 : 400}
                  fill={isFilled ? fillColor : colors.lightText}
                >
                  {isFilled ? val : '?'}
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
            bgcolor:
              step.action === 'done'
                ? '#007AFF18'
                : step.action === 'pop-then-push'
                  ? '#34C75910'
                  : '#F2F2F7',
            color: step.action === 'done' ? colors.primary : colors.text,
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
