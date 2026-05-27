import { useState } from 'react';
import { Alert, Box, Button, Paper, Typography } from '@mui/material';
import type { MatchPairsQuestion as MPQ } from '../../types/quiz';
import { Inline } from '../../utils/renderInline';

interface Props {
  question: MPQ;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const PAIR_COLORS = ['#1976d2', '#9c27b0', '#ed6c02', '#2e7d32', '#c62828'];

export default function MatchPairsQuestion({ question, onAnswer, answered }: Props) {
  // shuffledRightIndices[i] = original pair index for right column position i
  const [shuffledRight] = useState<number[]>(() =>
    fisherYates(question.pairs.map((_, i) => i))
  );
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  // matches: leftIndex → rightShuffledPosition
  const [matches, setMatches] = useState<Map<number, number>>(new Map());

  const allMatched = matches.size === question.pairs.length;

  // reverse lookup: rightShuffledPos → leftIndex
  const rightToLeft = new Map<number, number>();
  matches.forEach((rightPos, leftIdx) => rightToLeft.set(rightPos, leftIdx));

  const handleLeftClick = (leftIdx: number) => {
    if (answered) return;
    if (selectedLeft === leftIdx) {
      setSelectedLeft(null);
      return;
    }
    setSelectedLeft(leftIdx);
  };

  const handleRightClick = (rightPos: number) => {
    if (answered) return;
    if (selectedLeft === null) {
      // Если правый уже связан — разрываем пару при клике без выбранного левого
      if (rightToLeft.has(rightPos)) {
        const leftIdx = rightToLeft.get(rightPos)!;
        setMatches((prev) => {
          const next = new Map(prev);
          next.delete(leftIdx);
          return next;
        });
      }
      return;
    }
    setMatches((prev) => {
      const next = new Map(prev);
      // Убрать предыдущую пару этого левого
      next.delete(selectedLeft);
      // Убрать предыдущую пару правого если была
      rightToLeft.forEach((li, rp) => {
        if (rp === rightPos) next.delete(li);
      });
      next.set(selectedLeft, rightPos);
      return next;
    });
    setSelectedLeft(null);
  };

  const handleCheck = () => {
    if (!allMatched || answered) return;
    const isCorrect = [...matches.entries()].every(([leftIdx, rightPos]) => {
      return shuffledRight[rightPos] === leftIdx;
    });
    onAnswer(isCorrect);
  };

  const getLeftColor = (leftIdx: number): string | null => {
    const rightPos = matches.get(leftIdx);
    if (rightPos === undefined) return null;
    return PAIR_COLORS[leftIdx % PAIR_COLORS.length];
  };

  const getRightColor = (rightPos: number): string | null => {
    const leftIdx = rightToLeft.get(rightPos);
    if (leftIdx === undefined) return null;
    return PAIR_COLORS[leftIdx % PAIR_COLORS.length];
  };

  const isCorrect =
    answered &&
    [...matches.entries()].every(([leftIdx, rightPos]) => shuffledRight[rightPos] === leftIdx);

  const getResultColor = (isRight: boolean) =>
    isRight ? 'success.main' : 'error.main';

  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 } }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Сопоставь
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        <Inline>{question.description}</Inline>
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {question.pairs.map((pair, leftIdx) => {
              const color = getLeftColor(leftIdx);
              const isSelected = selectedLeft === leftIdx;
              const rightPos = matches.get(leftIdx);
              const isMatchCorrect =
                answered && rightPos !== undefined && shuffledRight[rightPos] === leftIdx;
              const isMatchWrong =
                answered && rightPos !== undefined && shuffledRight[rightPos] !== leftIdx;

              return (
                <Box
                  key={leftIdx}
                  onClick={() => handleLeftClick(leftIdx)}
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 1,
                    border: '2px solid',
                    borderColor: answered
                      ? isMatchCorrect
                        ? getResultColor(true)
                        : isMatchWrong
                          ? getResultColor(false)
                          : 'divider'
                      : isSelected
                        ? 'primary.main'
                        : color || 'divider',
                    bgcolor: answered
                      ? 'transparent'
                      : isSelected
                        ? 'primary.50'
                        : 'transparent',
                    cursor: answered ? 'default' : 'pointer',
                    '&:hover': answered ? {} : { borderColor: 'primary.main' },
                    transition: 'border-color 150ms',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: color ? 600 : 400 }}>
                    {pair.left}
                  </Typography>
                </Box>
              );
            })}
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {shuffledRight.map((origIdx, rightPos) => {
              const color = getRightColor(rightPos);
              const leftIdx = rightToLeft.get(rightPos);
              const isMatchCorrect =
                answered && leftIdx !== undefined && shuffledRight[rightPos] === leftIdx;
              const isMatchWrong =
                answered && leftIdx !== undefined && shuffledRight[rightPos] !== leftIdx;

              return (
                <Box
                  key={rightPos}
                  onClick={() => handleRightClick(rightPos)}
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 1,
                    border: '2px solid',
                    borderColor: answered
                      ? isMatchCorrect
                        ? getResultColor(true)
                        : isMatchWrong
                          ? getResultColor(false)
                          : 'divider'
                      : color || 'divider',
                    cursor: answered ? 'default' : 'pointer',
                    '&:hover': answered ? {} : { borderColor: 'primary.main' },
                    transition: 'border-color 150ms',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: color ? 600 : 400 }}>
                    {question.pairs[origIdx].right}
                  </Typography>
                </Box>
              );
            })}
        </Box>
      </Box>
      {!answered && (
        <Button variant="contained" onClick={handleCheck} disabled={!allMatched} sx={{ mt: 2 }}>
          Проверить
        </Button>
      )}
      {answered && (
        <Alert severity={isCorrect ? 'success' : 'error'} sx={{ mt: 2 }}>
          <Inline>{question.explanation}</Inline>
        </Alert>
      )}
    </Paper>
  );
}
