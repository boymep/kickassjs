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

export type QuizQuestion = FillBlankQuestion | OutputQuestion | TracingQuestion | ComplexityQuestion;

export interface TopicQuiz {
  topicId: string;
  questions: QuizQuestion[];
}
