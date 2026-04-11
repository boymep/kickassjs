import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, LinearProgress, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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
  const [answered, setAnswered] = useState(false);

  if (!quiz || quiz.questions.length === 0) {
    return <Typography>Квиз не найден</Typography>;
  }

  const question = quiz.questions[current];
  const total = quiz.questions.length;

  const handleAnswer = () => {
    setAnswered(true);
  };

  const handleNext = () => {
    if (current + 1 < total) {
      setCurrent((c) => c + 1);
      setAnswered(false);
    }
  };

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
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Вопрос {current + 1} из {total}
      </Typography>
      <LinearProgress variant="determinate" value={((current + 1) / total) * 100} sx={{ mb: 3, borderRadius: 1 }} />

      {renderQuestion(question)}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            startIcon={<ArrowBackIcon />}
            disabled={current === 0}
            onClick={() => { setCurrent((c) => c - 1); setAnswered(false); }}
          >
            Предыдущий
          </Button>
          <Button
            size="small"
            endIcon={<ArrowForwardIcon />}
            disabled={current + 1 >= total}
            onClick={() => { setCurrent((c) => c + 1); setAnswered(false); }}
          >
            Следующий
          </Button>
        </Box>
        {answered && current + 1 < total && (
          <Button variant="contained" onClick={handleNext}>
            Далее
          </Button>
        )}
      </Box>
    </Box>
  );
}
