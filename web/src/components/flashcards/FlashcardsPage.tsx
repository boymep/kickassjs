import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import CodeBlock from '../theory/CodeBlock';
import { Inline } from '../../utils/renderInline';
import { getFlashcards } from '../../data/flashcards';
import type { Flashcard } from '../../types/flashcard';

type Score = 'knew' | 'partial' | 'missed';

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

export default function FlashcardsPage() {
  const { slug } = useParams<{ slug: string }>();
  const data = getFlashcards(slug ?? '');

  const [queue, setQueue] = useState<Flashcard[]>(() => data?.cards ?? []);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<CardResult[]>([]);
  const [done, setDone] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  const total = queue.length;
  const card = queue[idx];

  const handleReveal = useCallback(() => setRevealed(true), []);

  const handleScore = useCallback(
    (score: Score) => {
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
    setQueue(weak);
    setIdx(0);
    setRevealed(false);
    setResults([]);
    setDone(false);
    setReviewMode(true);
  }, [results]);

  const handleRestartAll = useCallback(() => {
    setQueue(data?.cards ?? []);
    setIdx(0);
    setRevealed(false);
    setResults([]);
    setDone(false);
    setReviewMode(false);
  }, [data]);

  if (!data || total === 0) {
    return <Typography>Карточки не найдены</Typography>;
  }

  if (done) {
    const knew = results.filter((r) => r.score === 'knew').length;
    const partial = results.filter((r) => r.score === 'partial').length;
    const missed = results.filter((r) => r.score === 'missed').length;
    const weakCount = partial + missed;

    return (
      <Box>
        <Paper sx={{ p: 4, textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {reviewMode ? 'Повторение завершено!' : 'Все карточки пройдены!'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Результаты за {total} {total === 1 ? 'карточку' : total < 5 ? 'карточки' : 'карточек'}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="success.main">{knew}</Typography>
              <Typography variant="caption" color="text.secondary">Знал</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="warning.main">{partial}</Typography>
              <Typography variant="caption" color="text.secondary">Частично</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="error.main">{missed}</Typography>
              <Typography variant="caption" color="text.secondary">Не знал</Typography>
            </Box>
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
            <Button
              variant="outlined"
              onClick={handleRestartAll}
              sx={{ textTransform: 'none' }}
            >
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {reviewMode ? 'Повторение слабых' : `Карточка ${idx + 1} из ${total}`}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ mb: 3, borderRadius: 1 }}
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="overline" sx={{ display: 'block', color: 'text.secondary', mb: 1 }}>
          Вопрос
        </Typography>
        <Typography variant="h6" gutterBottom>
          <Inline>{card.question}</Inline>
        </Typography>

        {!revealed ? (
          <Box sx={{ pt: 1 }}>
            <Button
              variant="outlined"
              onClick={handleReveal}
              sx={{ textTransform: 'none' }}
            >
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
            <Button
              variant="outlined"
              color="success"
              onClick={() => handleScore('knew')}
              sx={{ flex: 1, textTransform: 'none', py: 1.5 }}
            >
              <Box>
                <Box sx={{ fontWeight: 700 }}>Знал</Box>
                <Box sx={{ fontSize: '0.75rem', opacity: 0.8 }}>Уверенно</Box>
              </Box>
            </Button>
            <Button
              variant="outlined"
              color="warning"
              onClick={() => handleScore('partial')}
              sx={{ flex: 1, textTransform: 'none', py: 1.5 }}
            >
              <Box>
                <Box sx={{ fontWeight: 700 }}>Частично</Box>
                <Box sx={{ fontSize: '0.75rem', opacity: 0.8 }}>С подсказкой</Box>
              </Box>
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleScore('missed')}
              sx={{ flex: 1, textTransform: 'none', py: 1.5 }}
            >
              <Box>
                <Box sx={{ fontWeight: 700 }}>Не знал</Box>
                <Box sx={{ fontSize: '0.75rem', opacity: 0.8 }}>Надо повторить</Box>
              </Box>
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
