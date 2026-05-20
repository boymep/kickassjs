export interface FillBlankQuestion {
  type: 'fill-blank';
  id: string;
  description: string;
  codeWithBlanks: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface OutputQuestion {
  type: 'output';
  id: string;
  description: string;
  code: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TracingQuestion {
  type: 'tracing';
  id: string;
  description: string;
  code: string;
  steps: { label: string; variables: Record<string, string | number> }[];
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ComplexityQuestion {
  type: 'complexity';
  id: string;
  description: string;
  code: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MultiSelectQuestion {
  type: 'multi-select';
  id: string;
  description: string;
  code?: string;
  options: string[];
  correctIndices: number[];
  explanation: string;
}

export interface OrderingQuestion {
  type: 'ordering';
  id: string;
  description: string;
  items: string[];
  explanation: string;
}

export interface MatchPairsQuestion {
  type: 'match-pairs';
  id: string;
  description: string;
  pairs: Array<{ left: string; right: string }>;
  explanation: string;
}

export type QuizQuestion =
  | FillBlankQuestion
  | OutputQuestion
  | TracingQuestion
  | ComplexityQuestion
  | MultiSelectQuestion
  | OrderingQuestion
  | MatchPairsQuestion;

export interface TopicQuiz {
  topicId: string;
  questions: QuizQuestion[];
}
