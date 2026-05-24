import { Box, Paper, Typography } from '@mui/material';
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
      sx={{ p: { xs: 2.5, md: 4 }, scrollMarginTop: 96 }}
    >
      <Typography variant="h4" sx={{ mb: 3, lineHeight: 1.2 }}>
        {chapter.title}
      </Typography>

      <Box sx={{ '& > *:first-of-type': { mt: 0 } }}>
        <TheoryBlocks blocks={chapter.blocks} />
      </Box>

      {chapter.playground && <InlinePlayground playground={chapter.playground} />}

      {showCheckpoint && chapter.checkpoint && chapter.checkpoint.length > 0 && (
        <CheckpointQuiz questions={chapter.checkpoint} />
      )}
    </Paper>
  );
}
