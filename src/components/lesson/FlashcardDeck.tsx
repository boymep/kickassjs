import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReplayIcon from '@mui/icons-material/Replay';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CodeBlock from '../theory/CodeBlock';
import { Inline } from '../../utils/renderInline';
import type { Flashcard } from '../../types/flashcard';

interface FlashcardDeckProps {
  cards: Flashcard[];
  title?: string;
}

export default function FlashcardDeck({ cards, title }: FlashcardDeckProps) {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setIdx(0);
    setRevealed(false);
    setDone(false);
  }, [cards]);

  const total = cards.length;
  const card = cards[idx];

  const handleNext = useCallback(() => {
    if (idx + 1 >= total) {
      setDone(true);
    } else {
      setIdx((i) => i + 1);
      setRevealed(false);
    }
  }, [idx, total]);

  const handlePrev = useCallback(() => {
    if (idx === 0) return;
    setIdx((i) => i - 1);
    setRevealed(false);
  }, [idx]);

  const handleRestart = useCallback(() => {
    setIdx(0);
    setRevealed(false);
    setDone(false);
  }, []);

  if (total === 0) return null;

  if (done) {
    return (
      <Box>
        {title && <Typography variant="h5" sx={{ mb: 1.5 }}>{title}</Typography>}
        <Paper sx={{ p: 5, textAlign: 'center' }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: 'success.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2.5,
            }}
          >
            <DoneAllIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
            Все карточки пройдены
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {total} {total === 1 ? 'карточка' : total < 5 ? 'карточки' : 'карточек'} изучено
          </Typography>
          <Button variant="outlined" startIcon={<ReplayIcon />} onClick={handleRestart}>
            Пройти ещё раз
          </Button>
        </Paper>
      </Box>
    );
  }

  const progress = (idx / total) * 100;

  return (
    <Box>
      {title && <Typography variant="h5" sx={{ mb: 1.5 }}>{title}</Typography>}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Карточка {idx + 1} из {total}
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          disabled={idx === 0}
          onClick={handlePrev}
          size="small"
        >
          Назад
        </Button>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={revealed ? handleNext : () => setRevealed(true)}
        >
          {!revealed ? 'Показать ответ' : idx + 1 >= total ? 'Завершить' : 'Далее'}
        </Button>
      </Box>
    </Box>
  );
}
