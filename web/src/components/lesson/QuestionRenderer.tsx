import type { QuizQuestion } from '../../types/quiz';
import FillBlankQuestion from '../quiz/FillBlankQuestion';
import OutputQuestion from '../quiz/OutputQuestion';
import TracingQuestion from '../quiz/TracingQuestion';
import ComplexityQuestion from '../quiz/ComplexityQuestion';

interface QuestionRendererProps {
  question: QuizQuestion;
  answered: boolean;
  onAnswer: (correct: boolean) => void;
}

/** Dispatches a QuizQuestion to its specialised renderer. */
export default function QuestionRenderer({ question, answered, onAnswer }: QuestionRendererProps) {
  switch (question.type) {
    case 'fill-blank':
      return <FillBlankQuestion question={question} answered={answered} onAnswer={onAnswer} />;
    case 'output':
      return <OutputQuestion question={question} answered={answered} onAnswer={onAnswer} />;
    case 'tracing':
      return <TracingQuestion question={question} answered={answered} onAnswer={onAnswer} />;
    case 'complexity':
      return <ComplexityQuestion question={question} answered={answered} onAnswer={onAnswer} />;
  }
}

/**
 * Fisher–Yates shuffle of question options that keeps `correctIndex` consistent.
 * Returns a new question instance; does not mutate input.
 */
export function shuffleOptions<T extends { options: string[]; correctIndex: number }>(q: T): T {
  const indices = q.options.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    ...q,
    options: indices.map((i) => q.options[i]),
    correctIndex: indices.indexOf(q.correctIndex),
  };
}
