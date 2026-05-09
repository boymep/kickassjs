import { Box, Paper, Typography } from '@mui/material';
import Stack from './Stack';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import LinkIcon from '@mui/icons-material/Link';
import VideoPlayer from './VideoPlayer';
import ExternalLinkCard from './ExternalLinkCard';
import type { ExternalLink, VideoEmbed } from '../../types/lesson';

interface ResourcePanelProps {
  videos: VideoEmbed[];
  links: ExternalLink[];
}

export default function ResourcePanel({ videos, links }: ResourcePanelProps) {
  if (videos.length === 0 && links.length === 0) return null;

  const hasVideos = videos.length > 0;
  const hasLinks = links.length > 0;

  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 } }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Материалы по теме
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {hasVideos && (
          <Box>
            <SectionLabel icon={<OndemandVideoIcon fontSize="small" />} label="Видео" />
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              {videos.map((v) => (
                <VideoPlayer key={v.id} video={v} />
              ))}
            </Box>
          </Box>
        )}
        {hasLinks && (
          <Box>
            <SectionLabel icon={<LinkIcon fontSize="small" />} label="Документация и статьи" />
            <Stack spacing={1}>
              {links.map((l) => (
                <ExternalLinkCard key={l.url} link={l} />
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        mb: 1.25,
        color: 'text.secondary',
      }}
    >
      <Box sx={{ display: 'inline-flex' }}>{icon}</Box>
      <Typography
        variant="overline"
        sx={{ lineHeight: 1, m: 0, color: 'inherit' }}
      >
        {label}
      </Typography>
    </Box>
  );
}
