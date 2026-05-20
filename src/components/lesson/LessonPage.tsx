import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, LinearProgress, Paper, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import QuizIcon from '@mui/icons-material/Quiz';
import { getLesson } from '../../data/lessons';
import Chapter from './Chapter';
import Markdown from './Markdown';

export default function LessonPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const lesson = useMemo(() => getLesson(slug), [slug]);

  const storageKey = `theory-progress-${slug}`;

  const [pageIdx, setPageIdx] = useState(() => {
    const saved = localStorage.getItem(`theory-progress-${slug}`);
    return saved !== null ? Math.max(0, parseInt(saved, 10)) : 0;
  });

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    setPageIdx(saved !== null ? Math.max(0, parseInt(saved, 10)) : 0);
  }, [slug, storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, String(pageIdx));
  }, [pageIdx, storageKey]);

  if (!lesson) return <Typography>Урок ещё не готов</Typography>;

  const hasCheatsheet = Boolean(lesson.cheatsheet);
  const chaptersCount = lesson.chapters.length;
  const totalPages = chaptersCount + (hasCheatsheet ? 1 : 0);
  const isDone = pageIdx >= totalPages;
  const isCheatsheet = !isDone && pageIdx === chaptersCount && hasCheatsheet;
  const chapter = !isCheatsheet && !isDone ? lesson.chapters[pageIdx] ?? null : null;

  const goTo = (idx: number) => {
    setPageIdx(Math.max(0, Math.min(idx, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const progressLabel = isDone
    ? 'Завершено'
    : isCheatsheet
    ? 'Шпаргалка'
    : `Глава ${pageIdx + 1} из ${chaptersCount}`;

  const progressValue = totalPages > 0 ? (pageIdx / totalPages) * 100 : 0;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {progressLabel}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={{ borderRadius: 1, height: 6 }}
        />
      </Box>

      {isDone ? (
        <Paper sx={{ p: { xs: 3, sm: 5 }, textAlign: 'center' }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Теория пройдена!
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Перейди в Квиз, чтобы проверить понимание кода.
          </Typography>
          <Button
            variant="contained"
            startIcon={<QuizIcon />}
            onClick={() => navigate(`/topic/${slug}/quiz`)}
          >
            Перейти к Квизу
          </Button>
        </Paper>
      ) : isCheatsheet ? (
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 2,
            backgroundColor: (t) =>
              t.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          }}
        >
          <Typography variant="h5" sx={{ mb: 1.5 }}>
            Шпаргалка
          </Typography>
          <Markdown>{lesson.cheatsheet!}</Markdown>
        </Paper>
      ) : chapter ? (
        <Chapter chapter={chapter} showCheckpoint={false} />
      ) : null}

      {!isDone && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            disabled={pageIdx === 0}
            onClick={() => goTo(pageIdx - 1)}
          >
            Назад
          </Button>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => goTo(pageIdx + 1)}
          >
            {pageIdx + 1 >= totalPages ? 'Завершить' : 'Следующая глава'}
          </Button>
        </Box>
      )}

      {isDone && (
        <Box sx={{ mt: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => goTo(totalPages - 1)}
          >
            {hasCheatsheet ? 'Назад к шпаргалке' : 'Назад к главам'}
          </Button>
        </Box>
      )}
    </Box>
  );
}
