import React, { useState } from 'react';
import { Button, Paper, Typography, Box } from '@mui/material';

const input = '({[]})';

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
};

const bracketColor: Record<string, string> = {
  '(': colors.primary,
  ')': colors.primary,
  '{': colors.success,
  '}': colors.success,
  '[': colors.orange,
  ']': colors.orange,
};

interface Step {
  charIndex: number;
  stack: string[];
  action: 'push' | 'pop' | 'done';
  description: string;
}

const steps: Step[] = [
  {
    charIndex: 0,
    stack: ['('],
    action: 'push',
    description: "Читаем '(' — кладём в стек",
  },
  {
    charIndex: 1,
    stack: ['(', '{'],
    action: 'push',
    description: "Читаем '{' — кладём в стек",
  },
  {
    charIndex: 2,
    stack: ['(', '{', '['],
    action: 'push',
    description: "Читаем '[' — кладём в стек",
  },
  {
    charIndex: 3,
    stack: ['(', '{'],
    action: 'pop',
    description: "Читаем ']' — совпадает с '[' на вершине → извлекаем!",
  },
  {
    charIndex: 4,
    stack: ['('],
    action: 'pop',
    description: "Читаем '}' — совпадает с '{' на вершине → извлекаем!",
  },
  {
    charIndex: 5,
    stack: [],
    action: 'pop',
    description: "Читаем ')' — совпадает с '(' на вершине → извлекаем!",
  },
  {
    charIndex: -1,
    stack: [],
    action: 'done',
    description: 'Стек пуст → Валидно!',
  },
];

const CHAR_CELL = 44;
const CHAR_GAP = 6;
const CHAR_H = 40;
const CHAR_START_X = 30;
const CHAR_Y = 20;

const STACK_CELL_W = 56;
const STACK_CELL_H = 36;
const STACK_BASE_Y = 260;
const STACK_X = 160;
const STACK_GAP = 6;

export default function StackViz() {
  const [currentStep, setCurrentStep] = useState(0);

  const step = currentStep > 0 ? steps[currentStep - 1] : null;

  const svgWidth = Math.max(
    CHAR_START_X * 2 + input.length * (CHAR_CELL + CHAR_GAP),
    400,
  );
  const svgHeight = 290;

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 0.5, color: colors.text }}>
        Валидация скобок (стек)
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: colors.lightText }}>
        Строка: &quot;{input}&quot;
      </Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <svg
          width={svgWidth}
          height={svgHeight}
          style={{ display: 'block', margin: '0 auto' }}
        >
          {/* Input string cells */}
          {input.split('').map((ch, i) => {
            const x = CHAR_START_X + i * (CHAR_CELL + CHAR_GAP);
            const isCurrent = step && step.charIndex === i;
            const isProcessed = step && step.charIndex > i;
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={CHAR_Y}
                  width={CHAR_CELL}
                  height={CHAR_H}
                  rx={8}
                  fill={isCurrent ? colors.activeBg : isProcessed ? '#F2F2F7' : '#FFFFFF'}
                  stroke={isCurrent ? colors.primary : colors.cellBorder}
                  strokeWidth={isCurrent ? 2.5 : 1.5}
                />
                <text
                  x={x + CHAR_CELL / 2}
                  y={CHAR_Y + CHAR_H / 2 + 6}
                  textAnchor="middle"
                  fontSize={18}
                  fontWeight={600}
                  fill={isCurrent ? colors.primary : isProcessed ? colors.lightText : colors.text}
                >
                  {ch}
                </text>
              </g>
            );
          })}

          {/* Label */}
          <text
            x={CHAR_START_X}
            y={CHAR_Y + CHAR_H + 30}
            fontSize={13}
            fontWeight={600}
            fill={colors.lightText}
          >
            Стек:
          </text>

          {/* Stack visualization — vertical, growing upward */}
          {step &&
            step.stack.map((ch, i) => {
              const y = STACK_BASE_Y - (i + 1) * (STACK_CELL_H + STACK_GAP);
              const color = bracketColor[ch] || colors.primary;
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
                    strokeWidth={2}
                  />
                  <text
                    x={STACK_X + STACK_CELL_W / 2}
                    y={y + STACK_CELL_H / 2 + 6}
                    textAnchor="middle"
                    fontSize={18}
                    fontWeight={600}
                    fill={color}
                  >
                    {ch}
                  </text>
                  {/* Arrow indicating top */}
                  {i === step.stack.length - 1 && (
                    <>
                      <text
                        x={STACK_X + STACK_CELL_W + 14}
                        y={y + STACK_CELL_H / 2 + 5}
                        fontSize={12}
                        fontWeight={600}
                        fill={colors.primary}
                      >
                        ← вершина
                      </text>
                    </>
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

          {/* Pop checkmark */}
          {step && step.action === 'pop' && (
            <g>
              <circle
                cx={STACK_X + STACK_CELL_W + 80}
                cy={STACK_BASE_Y - (step.stack.length + 1) * (STACK_CELL_H + STACK_GAP) + STACK_CELL_H / 2}
                r={14}
                fill={colors.success + '20'}
                stroke={colors.success}
                strokeWidth={1.5}
              />
              <text
                x={STACK_X + STACK_CELL_W + 80}
                y={STACK_BASE_Y - (step.stack.length + 1) * (STACK_CELL_H + STACK_GAP) + STACK_CELL_H / 2 + 5}
                textAnchor="middle"
                fontSize={16}
                fill={colors.success}
              >
                ✓
              </text>
            </g>
          )}

          {/* Done — valid */}
          {step && step.action === 'done' && (
            <text
              x={STACK_X + STACK_CELL_W / 2}
              y={STACK_BASE_Y - 20}
              textAnchor="middle"
              fontSize={18}
              fontWeight={700}
              fill={colors.success}
            >
              Валидно!
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
            bgcolor: step.action === 'done' ? '#34C75918' : step.action === 'pop' ? '#34C75910' : '#F2F2F7',
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
