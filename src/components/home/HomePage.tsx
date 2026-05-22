import {
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Algorithm icons
import SearchIcon from '@mui/icons-material/Search';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import TagIcon from '@mui/icons-material/Tag';
import LayersIcon from '@mui/icons-material/Layers';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

// JS icons
import LockIcon from '@mui/icons-material/Lock';
import LoopIcon from '@mui/icons-material/Loop';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ExtensionIcon from '@mui/icons-material/Extension';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import WebIcon from '@mui/icons-material/Web';

// Node.js icons
import AutorenewIcon from '@mui/icons-material/Autorenew';
import WaterIcon from '@mui/icons-material/Water';
import RouterIcon from '@mui/icons-material/Router';
import SpeedIcon from '@mui/icons-material/Speed';

// System Design icons
import ArchitectureIcon from '@mui/icons-material/Architecture';
import StorageIcon from '@mui/icons-material/Storage';
import ShieldIcon from '@mui/icons-material/Shield';
import BoltIcon from '@mui/icons-material/Bolt';
import ApiIcon from '@mui/icons-material/Api';
import HubIcon from '@mui/icons-material/Hub';
import AnalyticsIcon from '@mui/icons-material/Analytics';

// Tool icons
import PsychologyIcon from '@mui/icons-material/Psychology';
import DescriptionIcon from '@mui/icons-material/Description';
import WarningIcon from '@mui/icons-material/Warning';
import BugReportIcon from '@mui/icons-material/BugReport';

import { algorithmTopics, jsTopics, nodejsTopics, systemDesignTopics } from '../../data/topics';
import type { TopicMeta } from '../../types/topic';

const iconMap: Record<string, React.ReactElement> = {
  Search: <SearchIcon sx={{ fontSize: 36 }} />,
  CompareArrows: <CompareArrowsIcon sx={{ fontSize: 36 }} />,
  ViewColumn: <ViewColumnIcon sx={{ fontSize: 36 }} />,
  Tag: <TagIcon sx={{ fontSize: 36 }} />,
  Layers: <LayersIcon sx={{ fontSize: 36 }} />,
  AccountTree: <AccountTreeIcon sx={{ fontSize: 36 }} />,
  Lock: <LockIcon sx={{ fontSize: 36 }} />,
  Loop: <LoopIcon sx={{ fontSize: 36 }} />,
  Fingerprint: <FingerprintIcon sx={{ fontSize: 36 }} />,
  HourglassEmpty: <HourglassEmptyIcon sx={{ fontSize: 36 }} />,
  Extension: <ExtensionIcon sx={{ fontSize: 36 }} />,
  DomainVerification: <DomainVerificationIcon sx={{ fontSize: 36 }} />,
  CloudDone: <CloudDoneIcon sx={{ fontSize: 36 }} />,
  Web: <WebIcon sx={{ fontSize: 36 }} />,
  Autorenew: <AutorenewIcon sx={{ fontSize: 36 }} />,
  Water: <WaterIcon sx={{ fontSize: 36 }} />,
  Router: <RouterIcon sx={{ fontSize: 36 }} />,
  Speed: <SpeedIcon sx={{ fontSize: 36 }} />,
  Architecture: <ArchitectureIcon sx={{ fontSize: 36 }} />,
  Storage: <StorageIcon sx={{ fontSize: 36 }} />,
  Shield: <ShieldIcon sx={{ fontSize: 36 }} />,
  Bolt: <BoltIcon sx={{ fontSize: 36 }} />,
  Api: <ApiIcon sx={{ fontSize: 36 }} />,
  Hub: <HubIcon sx={{ fontSize: 36 }} />,
  Monitoring: <AnalyticsIcon sx={{ fontSize: 36 }} />,
};

const complexityColor: Record<string, 'error' | 'warning' | 'default'> = {
  'Важно': 'warning',
  'Senior': 'error',
};

function TopicGrid({ topics }: { topics: TopicMeta[] }) {
  const navigate = useNavigate();
  return (
    <Grid container spacing={2}>
      {topics.map((t) => (
        <Grid key={t.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardActionArea
              onClick={() => navigate(`/topic/${t.slug}`)}
              sx={{ p: 1.5, height: '100%', alignItems: 'flex-start' }}
            >
              <CardContent sx={{ p: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  {iconMap[t.icon]}
                  <Typography variant="h6" sx={{ fontSize: '1rem', lineHeight: 1.3 }}>
                    {t.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.8rem' }}>
                  {t.description}
                </Typography>
                <Chip
                  label={t.complexity}
                  size="small"
                  color={complexityColor[t.complexity] ?? 'default'}
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Подготовка к собеседованию
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Алгоритмы · JavaScript · Node.js — теория, квизы и практика в одном месте
        </Typography>
      </Box>

      {/* Algorithms */}
      <SectionHeader
        title="Алгоритмы"
        subtitle="6 ключевых паттернов для алгоритмической секции"
      />
      <TopicGrid topics={algorithmTopics} />

      <Divider sx={{ my: 4 }} />

      {/* JavaScript */}
      <SectionHeader
        title="JavaScript"
        subtitle="8 тем: от замыканий и Event Loop до работы браузера"
      />
      <TopicGrid topics={jsTopics} />

      <Divider sx={{ my: 4 }} />

      {/* Node.js */}
      <SectionHeader
        title="Node.js"
        subtitle="4 темы: event loop, стримы, HTTP, оптимизация"
      />
      <TopicGrid topics={nodejsTopics} />

      <Divider sx={{ my: 4 }} />

      {/* System Design */}
      <SectionHeader
        title="System Design"
        subtitle="7 тем для senior-собеседования: рендеринг, кеширование, безопасность, перформанс, API, масштабирование, observability"
      />
      <TopicGrid topics={systemDesignTopics} />

      <Divider sx={{ my: 4 }} />

      {/* Extra tools */}
      <SectionHeader
        title="Инструменты"
        subtitle="Дополнительные материалы для подготовки"
      />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardActionArea onClick={() => navigate('/pattern-game')} sx={{ p: 1.5, height: '100%', alignItems: 'flex-start' }}>
              <CardContent sx={{ p: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <PsychologyIcon sx={{ fontSize: 32 }} />
                  <Typography variant="h6" sx={{ fontSize: '1rem' }}>Определи паттерн</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Читаете условие задачи — выбираете алгоритм
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardActionArea onClick={() => navigate('/cheatsheet')} sx={{ p: 1.5, height: '100%', alignItems: 'flex-start' }}>
              <CardContent sx={{ p: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <DescriptionIcon sx={{ fontSize: 32 }} />
                  <Typography variant="h6" sx={{ fontSize: '1rem' }}>Шпаргалка для собеса</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Чеклист: как решать задачу на интервью
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardActionArea onClick={() => navigate('/js-pitfalls')} sx={{ p: 1.5, height: '100%', alignItems: 'flex-start' }}>
              <CardContent sx={{ p: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <WarningIcon sx={{ fontSize: 32 }} />
                  <Typography variant="h6" sx={{ fontSize: '1rem' }}>JS-ловушки</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Подводные камни JavaScript при работе с алгоритмами
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardActionArea onClick={() => navigate('/bug-hunt')} sx={{ p: 1.5, height: '100%', alignItems: 'flex-start' }}>
              <CardContent sx={{ p: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <BugReportIcon sx={{ fontSize: 32 }} />
                  <Typography variant="h6" sx={{ fontSize: '1rem' }}>Найдите баг</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  20 реальных ошибок из кода JS / Node.js — найдите и объясните
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
