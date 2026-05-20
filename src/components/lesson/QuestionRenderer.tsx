import type { QuizQuestion } from '../../types/quiz';
import FillBlankQuestion from '../quiz/FillBlankQuestion';
import OutputQuestion from '../quiz/OutputQuestion';
import TracingQuestion from '../quiz/TracingQuestion';
import ComplexityQuestion from '../quiz/ComplexityQuestion';
import MultiSelectQuestion from '../quiz/MultiSelectQuestion';
import OrderingQuestion from '../quiz/OrderingQuestion';
import MatchPairsQuestion from '../quiz/MatchPairsQuestion';

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
    case 'multi-select':
      return <MultiSelectQuestion question={question} answered={answered} onAnswer={onAnswer} />;
    case 'ordering':
      return <OrderingQuestion question={question} answered={answered} onAnswer={onAnswer} />;
    case 'match-pairs':
      return <MatchPairsQuestion question={question} answered={answered} onAnswer={onAnswer} />;
  }
}

/**
 * Fisher–Yates shuffle of question options that keeps `correctIndex` consistent.
 * Only applies to question types that have a single `options` + `correctIndex` shape.
 * Returns the question unchanged for ordering/match-pairs/multi-select (they shuffle internally).
 */
export function shuffleOptions(q: QuizQuestion): QuizQuestion {
  if (!('options' in q) || !('correctIndex' in q)) return q;
  const typed = q as QuizQuestion & { options: string[]; correctIndex: number };
  const indices = typed.options.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    ...typed,
    options: indices.map((i) => typed.options[i]),
    correctIndex: indices.indexOf(typed.correctIndex),
  } as QuizQuestion;
}
