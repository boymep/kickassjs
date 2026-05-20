import { Paper, Typography } from '@mui/material';
import type { Chapter as ChapterType } from '../../types/lesson';
import TheoryBlocks from './TheoryBlocks';
import InlinePlayground from './InlinePlayground';
import CheckpointQuiz from './CheckpointQuiz';

interface ChapterProps {
  chapter: ChapterType;
  showCheckpoint?: boolean;
}

export default function Chapter({ chapter, showCheckpoint = true }: ChapterProps) {
  return (
    <Paper
      data-chapter-id={chapter.id}
      id={`ch-${chapter.id}`}
      sx={{ p: { xs: 2.5, md: 3 }, scrollMarginTop: 96 }}
    >
      <Typography variant="h5" sx={{ mb: 2, lineHeight: 1.3 }}>
        {chapter.title}
      </Typography>

      <TheoryBlocks blocks={chapter.blocks} />

      {chapter.playground && (
        <InlinePlayground playground={chapter.playground} />
      )}

      {showCheckpoint && chapter.checkpoint && chapter.checkpoint.length > 0 && (
        <CheckpointQuiz questions={chapter.checkpoint} />
      )}
    </Paper>
  );
}
