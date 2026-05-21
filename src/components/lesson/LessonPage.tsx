import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import Stack from './Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import QuizIcon from '@mui/icons-material/Quiz';
import { getLesson } from '../../data/lessons';
import { algorithmTopics, jsTopics, nodejsTopics, systemDesignTopics } from '../../data/topics';
import Chapter from './Chapter';
import Markdown from './Markdown';
import LessonTOC from './LessonTOC';
import type { Lesson } from '../../types/lesson';

const allTopics = [...algorithmTopics, ...jsTopics, ...nodejsTopics, ...systemDesignTopics];
const titleBySlug = new Map(allTopics.map((t) => [t.slug, t.title]));

type PageKind = 'intro' | 'chapter' | 'cheatsheet' | 'done';

interface PageInfo {
  kind: PageKind;
  title: string;
  chapterIdx?: number;
}

function buildPages(lesson: Lesson): PageInfo[] {
  const pages: PageInfo[] = [];
  pages.push({ kind: 'intro', title: 'Введение' });
  lesson.chapters.forEach((c, idx) => {
    pages.push({ kind: 'chapter', title: c.title, chapterIdx: idx });
  });
  if (lesson.cheatsheet) pages.push({ kind: 'cheatsheet', title: 'Шпаргалка' });
  pages.push({ kind: 'done', title: 'Готово' });
  return pages;
}

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

  const pages = buildPages(lesson);
  const safeIdx = Math.max(0, Math.min(pageIdx, pages.length - 1));
  const page = pages[safeIdx]!;

  const learnPages = pages.filter((p) => p.kind !== 'done');
  const learnIdx = Math.min(safeIdx, learnPages.length - 1);
  const progressValue = learnPages.length > 1 ? (learnIdx / (learnPages.length - 1)) * 100 : 100;

  const goTo = (idx: number) => {
    setPageIdx(Math.max(0, Math.min(idx, pages.length - 1)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goNext = () => goTo(safeIdx + 1);
  const goPrev = () => goTo(safeIdx - 1);
  const isFirst = safeIdx === 0;
  const isLast = safeIdx === pages.length - 1;

  return (
    <Box sx={{ display: 'flex', gap: { lg: 4 }, alignItems: 'flex-start' }}>
      {/* Main content */}
      <Box sx={{ flex: 1, minWidth: 0, maxWidth: 780 }}>
        {/* Header: progress + chapter selector (mobile) */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {page.kind === 'done'
                ? 'Завершено'
                : `${learnIdx + 1} / ${learnPages.length} · ${page.title}`}
            </Typography>
            {/* Mobile chapter selector */}
            <Select
              size="small"
              value={safeIdx}
              onChange={(e) => goTo(Number(e.target.value))}
              sx={{
                display: { xs: 'inline-flex', lg: 'none' },
                minWidth: 180,
                '& .MuiSelect-select': { py: 0.5, fontSize: '0.85rem' },
              }}
            >
              {pages.map((p, i) => (
                <MenuItem key={i} value={i} sx={{ fontSize: '0.875rem' }}>
                  {p.kind === 'chapter' ? `${(p.chapterIdx ?? 0) + 1}. ${p.title}` : p.title}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <LinearProgress variant="determinate" value={progressValue} sx={{ borderRadius: 1 }} />
        </Box>

        {/* Page content */}
        {page.kind === 'intro' && <IntroPage lesson={lesson} />}
        {page.kind === 'chapter' && (
          <Chapter chapter={lesson.chapters[page.chapterIdx!]!} showCheckpoint />
        )}
        {page.kind === 'cheatsheet' && <CheatsheetPage cheatsheet={lesson.cheatsheet!} />}
        {page.kind === 'done' && (
          <DonePage slug={slug} hasCheatsheet={Boolean(lesson.cheatsheet)} onBack={goPrev} nextTopics={lesson.nextTopics} onNavigate={navigate} />
        )}

        {/* Bottom navigation */}
        {!isLast && (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            justifyContent="space-between"
            sx={{ mt: 4 }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              disabled={isFirst}
              onClick={goPrev}
              variant="outlined"
            >
              Назад
            </Button>
            <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={goNext}>
              {safeIdx + 1 === pages.length - 1 ? 'Завершить' : 'Дальше'}
            </Button>
          </Stack>
        )}
      </Box>

      {/* Sticky TOC (desktop) */}
      <Box
        component="aside"
        sx={{
          display: { xs: 'none', lg: 'block' },
          width: 240,
          flexShrink: 0,
        }}
      >
        <Box sx={{ position: 'sticky', top: 88 }}>
          <LessonTOC pages={pages} activeIdx={safeIdx} onSelect={goTo} />
        </Box>
      </Box>
    </Box>
  );
}

function IntroPage({ lesson }: { lesson: Lesson }) {
  return (
    <Paper sx={{ p: { xs: 2.5, md: 4 } }}>
      <Typography variant="h4" sx={{ mb: 2.5, lineHeight: 1.2 }}>
        Введение
      </Typography>
      <Markdown>{lesson.intro.whyItMatters}</Markdown>
      {lesson.intro.interviewAngle && (
        <Box
          sx={{
            mt: 3,
            p: 2.5,
            borderRadius: 2,
            borderLeft: 3,
            borderColor: 'primary.main',
            backgroundColor: (t) =>
              t.palette.mode === 'dark' ? 'rgba(0,122,255,0.08)' : 'rgba(0,122,255,0.05)',
          }}
        >
          <Typography variant="overline" color="primary" sx={{ display: 'block', mb: 0.5 }}>
            На собеседовании
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            {lesson.intro.interviewAngle}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

function CheatsheetPage({ cheatsheet }: { cheatsheet: string }) {
  return (
    <Paper sx={{ p: { xs: 2.5, md: 4 } }}>
      <Typography variant="h4" sx={{ mb: 2, lineHeight: 1.2 }}>
        Шпаргалка
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Краткая выжимка всего важного — пробегитесь перед собеседованием.
      </Typography>
      <Markdown>{cheatsheet}</Markdown>
    </Paper>
  );
}

interface DonePageProps {
  slug: string;
  hasCheatsheet: boolean;
  onBack: () => void;
  nextTopics?: { slug: string; reason: string }[];
  onNavigate: (path: string) => void;
}

function DonePage({ slug, onBack, nextTopics, onNavigate }: DonePageProps) {
  return (
    <Paper sx={{ p: { xs: 3, md: 5 }, textAlign: 'center' }}>
      <CheckCircleOutlineIcon sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
      <Typography variant="h4" sx={{ mb: 1.5 }}>
        Теория пройдена!
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 460, mx: 'auto' }}>
        Самое время проверить себя — пройдите квиз, чтобы закрепить материал, или беритесь за задачи.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center" sx={{ mb: nextTopics?.length ? 4 : 0 }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBack}>
          Вернуться
        </Button>
        <Button
          variant="contained"
          startIcon={<QuizIcon />}
          onClick={() => onNavigate(`/topic/${slug}/quiz`)}
        >
          Перейти к квизу
        </Button>
      </Stack>
      {nextTopics && nextTopics.length > 0 && (
        <Box sx={{ mt: 4, textAlign: 'left' }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Что изучить дальше
          </Typography>
          <Stack spacing={1.5}>
            {nextTopics.map((nt) => (
              <Box
                key={nt.slug}
                onClick={() => onNavigate(`/topic/${nt.slug}`)}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'divider',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                  '&:hover': {
                    backgroundColor: (t) =>
                      t.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                  },
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {titleBySlug.get(nt.slug) ?? nt.slug}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {nt.reason}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Paper>
  );
}
