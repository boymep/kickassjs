import { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';
import { algorithmTopics, jsTopics, nodejsTopics } from '../../data/topics';
import { getLesson } from '../../data/lessons';
import LessonHero from './LessonHero';
import ResourcePanel from './ResourcePanel';
import TableOfContents from './TableOfContents';
import Chapter from './Chapter';
import InterviewQACard from './InterviewQACard';
import FinalQuiz from './FinalQuiz';
import FlashcardDeck from './FlashcardDeck';
import NextSteps from './NextSteps';
import RelatedLinks from './RelatedLinks';
import Markdown from './Markdown';

const allTopics = [...algorithmTopics, ...jsTopics, ...nodejsTopics];

const SECTION_SX = { mb: 3, scrollMarginTop: 96 } as const;

export default function LessonPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const location = useLocation();
  const topic = allTopics.find((t) => t.slug === slug);
  const lesson = useMemo(() => getLesson(slug), [slug]);

  // Scroll to a hash anchor (#final-quiz, #flashcards) after mount when redirected from legacy URLs.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
    return () => clearTimeout(t);
  }, [location.hash, slug]);

  if (!topic) return <Typography>Тема не найдена</Typography>;
  if (!lesson) return <Typography>Урок ещё не готов</Typography>;

  const tocExtras: { id: string; label: string }[] = [];
  if (lesson.interviewQA && lesson.interviewQA.length > 0) tocExtras.push({ id: 'interview-qa', label: 'Вопросы интервьюера' });
  if (lesson.finalQuiz.length > 0) tocExtras.push({ id: 'final-quiz', label: 'Финальный квиз' });
  if (lesson.flashcards.length > 0) tocExtras.push({ id: 'flashcards', label: 'Флешкарты' });

  const showTOC = lesson.chapters.length >= 3;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: showTOC ? { xs: '1fr', lg: 'minmax(0, 1fr) 240px' } : '1fr',
        gap: { xs: 0, lg: 4 },
        // intentionally NO alignItems: 'start' — sticky child needs a tall parent.
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Box sx={SECTION_SX}>
          <LessonHero
            title={topic.title}
            description={topic.description}
            intro={lesson.intro}
          />
        </Box>

        {(lesson.resources.videos.length > 0 || lesson.resources.links.length > 0) && (
          <Box sx={SECTION_SX}>
            <ResourcePanel videos={lesson.resources.videos} links={lesson.resources.links} />
          </Box>
        )}

        {lesson.chapters.map((chapter) => (
          <Box key={chapter.id} sx={SECTION_SX}>
            <Chapter chapter={chapter} />
          </Box>
        ))}

        {lesson.cheatsheet && (
          <Box id="cheatsheet" sx={SECTION_SX}>
            <Typography variant="h5" sx={{ mb: 1.5 }}>Шпаргалка</Typography>
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 2,
                backgroundColor: (t) =>
                  t.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
              }}
            >
              <Markdown>{lesson.cheatsheet}</Markdown>
            </Paper>
          </Box>
        )}

        {lesson.interviewQA && lesson.interviewQA.length > 0 && (
          <Box id="interview-qa" sx={SECTION_SX}>
            <InterviewQACard items={lesson.interviewQA} />
          </Box>
        )}

        {lesson.finalQuiz.length > 0 && (
          <Box id="final-quiz" sx={SECTION_SX}>
            <Typography variant="h5" sx={{ mb: 1.5 }}>Финальный квиз</Typography>
            <FinalQuiz questions={lesson.finalQuiz} />
          </Box>
        )}

        {lesson.flashcards.length > 0 && (
          <Box id="flashcards" sx={SECTION_SX}>
            <FlashcardDeck cards={lesson.flashcards} title="Флешкарты для повторения" />
          </Box>
        )}

        {lesson.related && lesson.related.length > 0 && (
          <Box sx={SECTION_SX}>
            <RelatedLinks items={lesson.related} />
          </Box>
        )}

        <Box sx={SECTION_SX}>
          <NextSteps slug={slug} nextTopics={lesson.nextTopics} />
        </Box>
      </Box>

      {showTOC && (
        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          <TableOfContents chapters={lesson.chapters} extras={tocExtras} />
        </Box>
      )}
    </Box>
  );
}
