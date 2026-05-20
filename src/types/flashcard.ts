export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  keyPoints: string[];
  code?: string;
  codeLanguage?: string;
}

export interface TopicFlashcards {
  topicId: string;
  cards: Flashcard[];
}
