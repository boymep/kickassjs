import { Box, Chip, Paper, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { Chapter as ChapterType } from '../../types/lesson';
import TheoryBlocks from './TheoryBlocks';
import InlinePlayground from './InlinePlayground';
import CheckpointQuiz from './CheckpointQuiz';
import VideoPlayer from './VideoPlayer';

interface ChapterProps {
  chapter: ChapterType;
}

export default function Chapter({ chapter }: ChapterProps) {
  return (
    <Paper
      data-chapter-id={chapter.id}
      id={`ch-${chapter.id}`}
      sx={{ p: { xs: 2.5, md: 3 }, scrollMarginTop: 96 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ m: 0, lineHeight: 1.3 }}>
          {chapter.title}
        </Typography>
        {chapter.estimatedMinutes && (
          <Chip
            icon={<AccessTimeIcon />}
            size="small"
            label={`${chapter.estimatedMinutes} мин`}
            variant="outlined"
            sx={{ flexShrink: 0 }}
          />
        )}
      </Box>
      <TheoryBlocks blocks={chapter.blocks} />
      {chapter.video && <VideoPlayer video={chapter.video} />}
      {chapter.playground && <InlinePlayground playground={chapter.playground} />}
      {chapter.checkpoint && chapter.checkpoint.length > 0 && (
        <CheckpointQuiz questions={chapter.checkpoint} />
      )}
    </Paper>
  );
}
