import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import CodeBlock from '../theory/CodeBlock';
import { Inline } from '../../utils/renderInline';
import type { Flashcard } from '../../types/flashcard';

type Score = 'knew' | 'partial' | 'missed';

interface FlashcardDeckProps {
  cards: Flashcard[];
  /** Heading shown above the deck. */
  title?: string;
}

interface CardResult {
  card: Flashcard;
  score: Score;
}

const SCORE_LABEL: Record<Score, string> = {
  knew: 'Знал',
  partial: 'Частично',
  missed: 'Не знал',
};

const SCORE_COLOR: Record<Score, 'success' | 'warning' | 'error'> = {
  knew: 'success',
  partial: 'warning',
  missed: 'error',
};

export default function FlashcardDeck({ cards, title }: FlashcardDeckProps) {
  const [queue, setQueue] = useState<Flashcard[]>(cards);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<CardResult[]>([]);
  const [done, setDone] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  // Reset when the source deck changes (e.g. user navigates between topics).
  useEffect(() => {
    setQueue(cards);
    setIdx(0);
    setRevealed(false);
    setResults([]);
    setDone(false);
    setReviewMode(false);
  }, [cards]);

  const total = queue.length;
  const card = queue[idx];

  const handleScore = useCallback(
    (score: Score) => {
      if (!card) return;
      const newResults = [...results, { card, score }];
      setResults(newResults);

      const nextIdx = idx + 1;
      if (nextIdx >= total) {
        setDone(true);
      } else {
        setIdx(nextIdx);
        setRevealed(false);
      }
    },
    [card, idx, results, total],
  );

  const handleRestartWeak = useCallback(() => {
    const weak = results.filter((r) => r.score !== 'knew').map((r) => r.card);
    if (weak.length === 0) return;
    setQueue(weak);
    setIdx(0);
    setRevealed(false);
    setResults([]);
    setDone(false);
    setReviewMode(true);
  }, [results]);

  const handleRestartAll = useCallback(() => {
    setQueue(cards);
    setIdx(0);
    setRevealed(false);
    setResults([]);
    setDone(false);
    setReviewMode(false);
  }, [cards]);

  if (total === 0) {
    return null;
  }

  if (done) {
    const knew = results.filter((r) => r.score === 'knew').length;
    const partial = results.filter((r) => r.score === 'partial').length;
    const missed = results.filter((r) => r.score === 'missed').length;
    const weakCount = partial + missed;

    return (
      <Box>
        {title && <Typography variant="h5" sx={{ mb: 1.5 }}>{title}</Typography>}
        <Paper sx={{ p: 4, textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {reviewMode ? 'Повторение завершено' : 'Все карточки пройдены'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Результат за {total} {total === 1 ? 'карточку' : total < 5 ? 'карточки' : 'карточек'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 3 }}>
            <Stat value={knew} label="Знал" color="success.main" />
            <Stat value={partial} label="Частично" color="warning.main" />
            <Stat value={missed} label="Не знал" color="error.main" />
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            {weakCount > 0 && (
              <Button
                variant="contained"
                color="error"
                startIcon={<ReplayIcon />}
                onClick={handleRestartWeak}
                sx={{ textTransform: 'none' }}
              >
                Повторить слабые ({weakCount})
              </Button>
            )}
            <Button variant="outlined" onClick={handleRestartAll} sx={{ textTransform: 'none' }}>
              Начать заново
            </Button>
          </Box>
        </Paper>
        <Box>
          {results.map((r, i) => (
            <Box
              key={r.card.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                py: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ minWidth: 20 }}>
                {i + 1}.
              </Typography>
              <Typography variant="body2" sx={{ flex: 1 }}>
                <Inline>{r.card.question}</Inline>
              </Typography>
              <Chip
                label={SCORE_LABEL[r.score]}
                size="small"
                color={SCORE_COLOR[r.score]}
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  const progress = (idx / total) * 100;

  return (
    <Box>
      {title && <Typography variant="h5" sx={{ mb: 1.5 }}>{title}</Typography>}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {reviewMode ? 'Повторение слабых' : `Карточка ${idx + 1} из ${total}`}
        </Typography>
      </Box>
      <LinearProgress variant="determinate" value={progress} sx={{ mb: 3, borderRadius: 1 }} />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="overline" sx={{ display: 'block', color: 'text.secondary', mb: 1 }}>
          Вопрос
        </Typography>
        <Typography variant="h6" gutterBottom>
          <Inline>{card.question}</Inline>
        </Typography>

        {!revealed ? (
          <Box sx={{ pt: 1 }}>
            <Button variant="outlined" onClick={() => setRevealed(true)} sx={{ textTransform: 'none' }}>
              Показать ответ
            </Button>
          </Box>
        ) : (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="overline" sx={{ display: 'block', color: 'success.main', mb: 1 }}>
              Ответ
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.65 }}>
              <Inline>{card.answer}</Inline>
            </Typography>
            {card.keyPoints.length > 0 && (
              <Box sx={{ mb: card.code ? 2 : 0 }}>
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mb: 0.75 }}>
                  Ключевые точки:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                  {card.keyPoints.map((pt, i) => (
                    <Box component="li" key={i} sx={{ mb: 0.5 }}>
                      <Typography variant="body2"><Inline>{pt}</Inline></Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            {card.code && (
              <Box sx={{ mt: 2 }}>
                <CodeBlock code={card.code} language={card.codeLanguage ?? 'javascript'} />
              </Box>
            )}
          </>
        )}
      </Paper>

      {revealed && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, textAlign: 'center' }}>
            Насколько хорошо ты это знал?
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <ScoreButton label="Знал" sub="Уверенно" color="success" onClick={() => handleScore('knew')} />
            <ScoreButton label="Частично" sub="С подсказкой" color="warning" onClick={() => handleScore('partial')} />
            <ScoreButton label="Не знал" sub="Надо повторить" color="error" onClick={() => handleScore('missed')} />
          </Box>
        </Box>
      )}
    </Box>
  );
}

function Stat({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h3" sx={{ color }}>{value}</Typography>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
    </Box>
  );
}

function ScoreButton({
  label, sub, color, onClick,
}: { label: string; sub: string; color: 'success' | 'warning' | 'error'; onClick: () => void }) {
  return (
    <Button variant="outlined" color={color} onClick={onClick} sx={{ flex: 1, textTransform: 'none', py: 1.5 }}>
      <Box>
        <Box sx={{ fontWeight: 700 }}>{label}</Box>
        <Box sx={{ fontSize: '0.75rem', opacity: 0.8 }}>{sub}</Box>
      </Box>
    </Button>
  );
}
