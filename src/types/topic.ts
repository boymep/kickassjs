export interface TopicMeta {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  complexity: string;
}

export type TheoryBlockType = 'text' | 'code' | 'heading' | 'list' | 'callout' | 'visualization';

export interface TheoryBlock {
  type: TheoryBlockType;
  content: string;
  language?: string;
  calloutType?: 'info' | 'warning' | 'tip';
  vizId?: string;
}

export interface TheorySection {
  title: string;
  blocks: TheoryBlock[];
}

export interface TopicTheory {
  topicId: string;
  sections: TheorySection[];
}
