export interface BugHuntItem {
  id: string;
  title: string;
  topic: string;
  topicLabel: string;
  difficulty: 'easy' | 'medium' | 'hard';
  code: string;
  language: string;
  bugs: Bug[];
}

export interface Bug {
  description: string;
  fix: string;
  explanation: string;
}
