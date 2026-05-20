import { useState } from 'react';
import { Box, Chip, IconButton,  Typography } from '@mui/material';
import Stack from './Stack';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { VideoEmbed } from '../../types/lesson';
import { buildYouTubeEmbedUrl, buildYouTubeThumbnailUrl, buildYouTubeWatchUrl } from '../../utils/youtube';

interface VideoPlayerProps {
  video: VideoEmbed;
}

function formatDuration(sec?: number): string | null {
  if (!sec || sec <= 0) return null;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Lazy-loading YouTube embed: shows a thumbnail with a play button until the user clicks,
 * at which point it swaps in the youtube-nocookie iframe. This keeps the page light and
 * avoids loading YouTube's tracker scripts on every lesson visit.
 */
export default function VideoPlayer({ video }: VideoPlayerProps) {
  const [loaded, setLoaded] = useState(false);
  const duration = formatDuration(video.durationSec);
  const watchUrl = buildYouTubeWatchUrl(video.id, video.startSec);

  return (
    <Box
      sx={{
        width: 360,
        maxWidth: '100%',
        flexShrink: 0,
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          backgroundColor: 'black',
        }}
      >
        {loaded ? (
          <iframe
            src={buildYouTubeEmbedUrl(video.id, video.startSec) + '&autoplay=1'}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              border: 0,
            }}
          />
        ) : (
          <Box
            role="button"
            tabIndex={0}
            onClick={() => setLoaded(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setLoaded(true);
              }
            }}
            aria-label={`Воспроизвести: ${video.title}`}
            sx={{
              position: 'absolute',
              inset: 0,
              cursor: 'pointer',
              backgroundImage: `url(${buildYouTubeThumbnailUrl(video.id)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'filter 150ms',
              '&:hover': { filter: 'brightness(0.85)' },
              '&:focus-visible': { outline: '3px solid #007AFF', outlineOffset: -3 },
            }}
          >
            <PlayCircleIcon sx={{ fontSize: 72, color: 'white', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }} />
          </Box>
        )}
      </Box>
      <Box sx={{ p: 1.5, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{ lineHeight: 1.3, mb: 0.5 }}
              title={video.title}
            >
              {video.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
              {video.channel && (
                <Typography variant="caption" color="text.secondary">
                  {video.channel}
                </Typography>
              )}
              {duration && (
                <Typography variant="caption" color="text.secondary">
                  · {duration}
                </Typography>
              )}
              <Chip
                label={video.language === 'ru' ? 'RU' : 'EN'}
                size="small"
                variant="outlined"
                sx={{ height: 18, fontSize: '0.65rem' }}
              />
            </Box>
          </Box>
          <IconButton
            size="small"
            component="a"
            href={watchUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Открыть на YouTube"
            sx={{ flexShrink: 0, mt: -0.5 }}
          >
            <OpenInNewIcon fontSize="small" />
          </IconButton>
        </Box>
        {video.description && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 0.75, lineHeight: 1.5 }}
          >
            {video.description}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
