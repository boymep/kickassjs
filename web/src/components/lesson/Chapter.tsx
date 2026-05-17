import { Box, Chip, Link, Paper, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
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
      {chapter.docsLink && (
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">Подробнее:</Typography>
          <Link
            href={chapter.docsLink.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="body2"
            underline="hover"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
          >
            {chapter.docsLink.title}
            <OpenInNewIcon sx={{ fontSize: 14 }} />
          </Link>
        </Box>
      )}
      {chapter.video && <VideoPlayer video={chapter.video} />}
      {chapter.playground && <InlinePlayground playground={chapter.playground} />}
      {chapter.checkpoint && chapter.checkpoint.length > 0 && (
        <CheckpointQuiz questions={chapter.checkpoint} />
      )}
    </Paper>
  );
}
