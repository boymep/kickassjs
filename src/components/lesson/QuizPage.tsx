import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import { getLesson } from '../../data/lessons';
import FinalQuiz from './FinalQuiz';
import type { QuizQuestion } from '../../types/quiz';

export default function QuizPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const lesson = useMemo(() => getLesson(slug), [slug]);

  const questions = useMemo<QuizQuestion[]>(() => {
    if (!lesson) return [];
    const seen = new Set<string>();
    const result: QuizQuestion[] = [];
    const add = (q: QuizQuestion) => {
      if (!seen.has(q.id)) {
        seen.add(q.id);
        result.push(q);
      }
    };
    for (const chapter of lesson.chapters) {
      for (const q of chapter.checkpoint ?? []) add(q);
    }
    for (const q of lesson.finalQuiz) add(q);
    return result;
  }, [lesson]);

  if (!lesson) return <Typography>Урок ещё не готов</Typography>;
  if (questions.length === 0) return <Typography>Квиз пока не готов</Typography>;

  return <FinalQuiz questions={questions} />;
}
