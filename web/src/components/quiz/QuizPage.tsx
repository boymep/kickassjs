import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, LinearProgress, Button, Paper, Chip } from '@mui/material';
import { getQuiz } from '../../data/quizzes';
import type { QuizQuestion } from '../../types/quiz';
import FillBlankQuestion from './FillBlankQuestion';
import OutputQuestion from './OutputQuestion';
import TracingQuestion from './TracingQuestion';
import ComplexityQuestion from './ComplexityQuestion';

export default function QuizPage() {
  const { slug } = useParams<{ slug: string }>();
  const quiz = getQuiz(slug ?? '');
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  if (!quiz || quiz.questions.length === 0) {
    return <Typography>Квиз не найден</Typography>;
  }

  const question = quiz.questions[current];
  const total = quiz.questions.length;

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);
    setAnswered(true);
  };

  const handleNext = () => {
    if (current + 1 >= total) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setScore(0);
    setAnswered(false);
    setFinished(false);
  };

  if (finished) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Результат
        </Typography>
        <Typography variant="h2" color="primary" gutterBottom>
          {score} / {total}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {score === total
            ? 'Отлично! Всё правильно!'
            : score >= total * 0.7
              ? 'Хороший результат, но есть что повторить'
              : 'Стоит ещё раз пройти теорию'}
        </Typography>
        <Button variant="contained" onClick={handleRestart}>
          Пройти заново
        </Button>
      </Paper>
    );
  }

  function renderQuestion(q: QuizQuestion) {
    const props = { question: q as never, onAnswer: handleAnswer, answered };
    switch (q.type) {
      case 'fill-blank':
        return <FillBlankQuestion {...props} question={q} />;
      case 'output':
        return <OutputQuestion {...props} question={q} />;
      case 'tracing':
        return <TracingQuestion {...props} question={q} />;
      case 'complexity':
        return <ComplexityQuestion {...props} question={q} />;
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Вопрос {current + 1} из {total}
        </Typography>
        <Chip label={`Счёт: ${score}`} size="small" color="primary" />
      </Box>
      <LinearProgress variant="determinate" value={((current + 1) / total) * 100} sx={{ mb: 3, borderRadius: 1 }} />

      {renderQuestion(question)}

      {answered && (
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button variant="contained" onClick={handleNext}>
            {current + 1 >= total ? 'Результаты' : 'Далее'}
          </Button>
        </Box>
      )}
    </Box>
  );
}
