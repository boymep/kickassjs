import { Box, Chip, Link,  Typography } from '@mui/material';
import Stack from './Stack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LanguageIcon from '@mui/icons-material/Language';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleIcon from '@mui/icons-material/Article';
import GavelIcon from '@mui/icons-material/Gavel';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import type { ExternalLink, LinkSource } from '../../types/lesson';

const SOURCE_LABEL: Record<LinkSource, string> = {
  mdn: 'MDN',
  'learn-js': 'learn.javascript.ru',
  'web-dev': 'web.dev',
  'nodejs-docs': 'nodejs.org',
  'v8-blog': 'v8.dev',
  spec: 'Spec',
  github: 'GitHub',
  article: 'Статья',
  other: 'Источник',
};

function sourceIcon(source: LinkSource) {
  switch (source) {
    case 'mdn':
      return <MenuBookIcon fontSize="small" />;
    case 'learn-js':
      return <MenuBookIcon fontSize="small" />;
    case 'web-dev':
      return <RocketLaunchIcon fontSize="small" />;
    case 'nodejs-docs':
      return <ArticleIcon fontSize="small" />;
    case 'v8-blog':
      return <RocketLaunchIcon fontSize="small" />;
    case 'spec':
      return <GavelIcon fontSize="small" />;
    case 'github':
      return <GitHubIcon fontSize="small" />;
    case 'article':
      return <ArticleIcon fontSize="small" />;
    default:
      return <LanguageIcon fontSize="small" />;
  }
}

interface ExternalLinkCardProps {
  link: ExternalLink;
}

export default function ExternalLinkCard({ link }: ExternalLinkCardProps) {
  return (
    <Link
      href={link.url}
      target="_blank"
      rel="noreferrer noopener"
      underline="none"
      sx={{
        display: 'block',
        p: 1.5,
        borderRadius: 1.5,
        border: 1,
        borderColor: 'divider',
        color: 'text.primary',
        transition: 'border-color 120ms, background-color 120ms',
        '&:hover': { borderColor: 'primary.main', backgroundColor: 'action.hover' },
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="flex-start">
        <Box sx={{ pt: 0.25, color: 'text.secondary' }}>{sourceIcon(link.source)}</Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ lineHeight: 1.3 }}>
            {link.title}
          </Typography>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.5, flexWrap: 'wrap' }}>
            <Typography variant="caption" color="text.secondary">
              {SOURCE_LABEL[link.source]}
            </Typography>
            <Chip
              label={link.language === 'ru' ? 'RU' : 'EN'}
              size="small"
              variant="outlined"
              sx={{ height: 18, fontSize: '0.65rem' }}
            />
          </Stack>
          {link.note && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {link.note}
            </Typography>
          )}
        </Box>
        <OpenInNewIcon fontSize="small" sx={{ color: 'text.disabled', mt: 0.25 }} />
      </Stack>
    </Link>
  );
}
