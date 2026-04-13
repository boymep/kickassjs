import { useState } from 'react';
import { Button, Paper, Typography, Box, Alert, useTheme } from '@mui/material';
import CodeBlock from '../theory/CodeBlock';

interface Step {
  lookup: string;
  foundAt: string;
  note: string;
  highlight: string[];
}

const steps: Step[] = [
  {
    lookup: 'dog.name',
    foundAt: 'dog (own property)',
    note: 'Собственное свойство объекта — найдено сразу, цепочку не обходим.',
    highlight: ['dog'],
  },
  {
    lookup: 'dog.bark()',
    foundAt: 'Dog.prototype',
    note: 'Метод bark() не является собственным свойством dog. Движок смотрит на Dog.prototype — нашёл!',
    highlight: ['dog', 'Dog.prototype'],
  },
  {
    lookup: 'dog.breathe()',
    foundAt: 'Animal.prototype',
    note: 'breathe() нет у dog и нет у Dog.prototype. Идём дальше — Animal.prototype. Нашли!',
    highlight: ['dog', 'Dog.prototype', 'Animal.prototype'],
  },
  {
    lookup: 'dog.toString()',
    foundAt: 'Object.prototype',
    note: 'toString() нет в dog, Dog.prototype, Animal.prototype. Object.prototype — нашли! Он есть у всех объектов.',
    highlight: ['dog', 'Dog.prototype', 'Animal.prototype', 'Object.prototype'],
  },
  {
    lookup: 'dog.nonExistent',
    foundAt: 'undefined (не найдено)',
    note: 'Свойство не найдено нигде в цепочке. null — конец прототипной цепочки. Возвращается undefined.',
    highlight: ['dog', 'Dog.prototype', 'Animal.prototype', 'Object.prototype', 'null'],
  },
];

const CODE = `class Animal { breathe() {} }
class Dog extends Animal { bark() {} }
const dog = new Dog('Rex');`;

function useChainColors() {
  const theme = useTheme();
  return [
    { id: 'dog', label: 'dog', sublabel: 'Экземпляр Dog', props: '{ name: "Rex", age: 3 }', color: theme.palette.primary.main },
    { id: 'Dog.prototype', label: 'Dog.prototype', sublabel: 'Прототип класса Dog', props: '{ bark(), constructor }', color: theme.palette.secondary.main },
    { id: 'Animal.prototype', label: 'Animal.prototype', sublabel: 'Прототип класса Animal', props: '{ breathe(), constructor }', color: theme.palette.warning.main },
    { id: 'Object.prototype', label: 'Object.prototype', sublabel: 'Базовый прототип', props: '{ toString(), hasOwnProperty(),\n  valueOf(), ... }', color: theme.palette.success.main },
    { id: 'null', label: 'null', sublabel: 'Конец цепочки', props: '— конец поиска', color: theme.palette.error.main },
  ];
}

export default function PrototypeChainViz() {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  const chainItems = useChainColors();
  const isFound = !step.foundAt.includes('не найдено');

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Прототипная цепочка
      </Typography>

      <CodeBlock code={CODE} />

      {/* Search query */}
      <Box
        sx={{
          px: 2,
          py: 1,
          mb: 2,
          borderLeft: '3px solid',
          borderColor: isFound ? 'success.main' : 'error.main',
          bgcolor: 'action.hover',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Typography sx={{ fontFamily: 'monospace', fontSize: '0.88rem', fontWeight: 600, color: 'primary.main' }}>
          🔍 {step.lookup}
        </Typography>
        <Typography
          sx={{
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            color: isFound ? 'success.main' : 'error.main',
            fontWeight: 600,
          }}
        >
          → {step.foundAt}
        </Typography>
      </Box>

      {/* Chain */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, mb: 2 }}>
        {chainItems.map((item, i) => {
          const isHighlighted = step.highlight.includes(item.id);
          const isFoundHere = step.foundAt.startsWith(item.id);

          return (
            <div key={item.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'stretch',
                  gap: 1.5,
                  opacity: isHighlighted ? 1 : 0.3,
                  transition: 'opacity 0.25s',
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    borderRadius: 0.5,
                    bgcolor: isHighlighted ? item.color : 'divider',
                    flexShrink: 0,
                    transition: 'background 0.25s',
                  }}
                />
                <Box
                  sx={{
                    flex: 1,
                    p: 1.5,
                    border: '1.5px solid',
                    borderColor: isFoundHere ? item.color : isHighlighted ? item.color + '50' : 'divider',
                    bgcolor: isFoundHere ? item.color + '10' : 'transparent',
                    transition: 'all 0.25s',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        color: isHighlighted ? item.color : 'text.disabled',
                        fontSize: '0.85rem',
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      — {item.sublabel}
                    </Typography>
                    {isFoundHere && (
                      <Box
                        sx={{
                          ml: 'auto',
                          color: '#fff',
                          bgcolor: item.color,
                          px: 1,
                          py: 0.25,
                          borderRadius: 0.5,
                          fontWeight: 700,
                          fontSize: '0.68rem',
                          fontFamily: 'sans-serif',
                        }}
                      >
                        ✓ НАЙДЕНО
                      </Box>
                    )}
                    {item.id === 'null' && !isFound && isHighlighted && (
                      <Box
                        sx={{
                          ml: 'auto',
                          color: '#fff',
                          bgcolor: 'error.main',
                          px: 1,
                          py: 0.25,
                          borderRadius: 0.5,
                          fontWeight: 700,
                          fontSize: '0.68rem',
                          fontFamily: 'sans-serif',
                        }}
                      >
                        ✗ undefined
                      </Box>
                    )}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'monospace',
                      color: isHighlighted ? 'text.primary' : 'text.disabled',
                      display: 'block',
                      whiteSpace: 'pre',
                    }}
                  >
                    {item.props}
                  </Typography>
                </Box>
              </Box>

              {i < chainItems.length - 1 && (
                <Box sx={{ pl: '20px', py: 0.25 }}>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.disabled' }}>
                    [[Prototype]] ↓
                  </Typography>
                </Box>
              )}
            </div>
          );
        })}
      </Box>

      <Alert severity={isFound ? 'success' : 'warning'} sx={{ mb: 2 }}>
        <Typography variant="body2">{step.note}</Typography>
      </Alert>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mb: 1.5 }}>
        Шаг {idx + 1} / {steps.length}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button variant="outlined" disabled={idx === 0} onClick={() => setIdx((s) => s - 1)}>
          ← Назад
        </Button>
        <Button variant="contained" disabled={idx >= steps.length - 1} onClick={() => setIdx((s) => s + 1)}>
          Следующий шаг →
        </Button>
        <Button variant="outlined" onClick={() => setIdx(0)} sx={{ ml: 'auto' }}>
          Сбросить
        </Button>
      </Box>
    </Paper>
  );
}
