import { useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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
    foundAt: 'dog (собственное свойство)',
    note: 'Собственное свойство объекта — найдено сразу, цепочку обходить не нужно.',
    highlight: ['dog'],
  },
  {
    lookup: 'dog.bark()',
    foundAt: 'Dog.prototype',
    note: 'Метод bark не на самом dog. Движок смотрит на Dog.prototype — найден.',
    highlight: ['dog', 'Dog.prototype'],
  },
  {
    lookup: 'dog.breathe()',
    foundAt: 'Animal.prototype',
    note: 'breathe нет ни у dog, ни у Dog.prototype. Идём дальше — Animal.prototype, найдено.',
    highlight: ['dog', 'Dog.prototype', 'Animal.prototype'],
  },
  {
    lookup: 'dog.toString()',
    foundAt: 'Object.prototype',
    note: 'toString есть только у Object.prototype — он у всех объектов в основании цепочки.',
    highlight: ['dog', 'Dog.prototype', 'Animal.prototype', 'Object.prototype'],
  },
  {
    lookup: 'dog.nonExistent',
    foundAt: 'undefined',
    note: 'Свойство нигде не найдено. null — конец цепочки, возвращается undefined.',
    highlight: ['dog', 'Dog.prototype', 'Animal.prototype', 'Object.prototype', 'null'],
  },
];

const CODE = `class Animal { breathe() {} }
class Dog extends Animal { bark() {} }
const dog = new Dog('Rex');`;

function useChainItems() {
  const theme = useTheme();
  return [
    { id: 'dog', label: 'dog', sublabel: 'экземпляр Dog', props: '{ name: "Rex", age: 3 }', color: theme.palette.primary.main },
    { id: 'Dog.prototype', label: 'Dog.prototype', sublabel: 'прототип класса Dog', props: '{ bark, constructor }', color: theme.palette.secondary.main },
    { id: 'Animal.prototype', label: 'Animal.prototype', sublabel: 'прототип класса Animal', props: '{ breathe, constructor }', color: theme.palette.warning.main },
    { id: 'Object.prototype', label: 'Object.prototype', sublabel: 'базовый прототип', props: '{ toString, hasOwnProperty, valueOf, … }', color: theme.palette.success.main },
    { id: 'null', label: 'null', sublabel: 'конец цепочки', props: '— конец поиска', color: theme.palette.error.main },
  ];
}

export default function PrototypeChainViz() {
  const [idx, setIdx] = useState(0);
  const step = idx > 0 ? steps[idx - 1]! : null;
  const chainItems = useChainItems();
  const isFound = step ? !step.foundAt.startsWith('undefined') : false;

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        backgroundColor: (t) =>
          t.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Как движок ищет свойство по цепочке прототипов.
      </Typography>

      <CodeBlock code={CODE} />

      {step && (
        <Box
          sx={{
            px: 2,
            py: 1,
            mt: 2,
            mb: 2,
            borderLeft: 3,
            borderColor: isFound ? 'success.main' : 'error.main',
            bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Typography sx={{ fontFamily: 'monospace', fontSize: '0.88rem', fontWeight: 600, color: 'primary.main' }}>
            {step.lookup}
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
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, mb: 2 }}>
        {chainItems.map((item, i) => {
          const isHighlighted = step?.highlight.includes(item.id) ?? false;
          const isFoundHere = step?.foundAt.startsWith(item.id) ?? false;
          const isNullFail = item.id === 'null' && step !== null && !isFound && isHighlighted;
          return (
            <Box key={item.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'stretch',
                  gap: 1.5,
                  opacity: step === null ? 0.5 : isHighlighted ? 1 : 0.3,
                  transition: 'opacity 0.25s',
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    borderRadius: 0.5,
                    bgcolor: isHighlighted ? item.color : 'divider',
                    flexShrink: 0,
                    transition: 'background-color 0.25s',
                  }}
                />
                <Box
                  sx={{
                    flex: 1,
                    p: 1.5,
                    borderRadius: 1,
                    border: 1.5,
                    borderColor: isFoundHere ? item.color : isHighlighted ? item.color : 'divider',
                    bgcolor: isFoundHere
                      ? (t) => (t.palette.mode === 'dark' ? `${item.color}26` : `${item.color}1A`)
                      : 'transparent',
                    transition: 'all 0.25s',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25, flexWrap: 'wrap' }}>
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
                      <Box sx={{ ml: 'auto', color: '#fff', bgcolor: item.color, px: 1, py: 0.25, borderRadius: 0.5, fontWeight: 700, fontSize: '0.68rem' }}>
                        найдено
                      </Box>
                    )}
                    {isNullFail && (
                      <Box sx={{ ml: 'auto', color: '#fff', bgcolor: 'error.main', px: 1, py: 0.25, borderRadius: 0.5, fontWeight: 700, fontSize: '0.68rem' }}>
                        undefined
                      </Box>
                    )}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'monospace',
                      color: isHighlighted ? 'text.primary' : 'text.disabled',
                      display: 'block',
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
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          px: 2,
          py: 1.25,
          borderRadius: 1.5,
          textAlign: 'center',
          bgcolor: step
            ? (isFound
                ? (t) => (t.palette.mode === 'dark' ? 'rgba(52,199,89,0.15)' : 'rgba(52,199,89,0.12)')
                : (t) => (t.palette.mode === 'dark' ? 'rgba(255,59,48,0.15)' : 'rgba(255,59,48,0.10)'))
            : (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
          color: step ? (isFound ? 'success.main' : 'error.main') : 'text.secondary',
          fontWeight: step ? 500 : 400,
        }}
      >
        <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 'inherit' }}>
          {step
            ? `Шаг ${idx} / ${steps.length}: ${step.note}`
            : 'Нажмите «Следующий шаг», чтобы посмотреть, как движок ищет свойства.'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center' }}>
        <Button
          size="small"
          variant="contained"
          disabled={idx >= steps.length}
          onClick={() => setIdx((s) => Math.min(s + 1, steps.length))}
          endIcon={<ArrowForwardIcon />}
        >
          Следующий шаг
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setIdx(0)}
          startIcon={<RestartAltIcon />}
          disabled={idx === 0}
        >
          Сбросить
        </Button>
      </Box>
    </Box>
  );
}
