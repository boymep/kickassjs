import { Tabs, Tab, Box, Typography } from '@mui/material';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import { algorithmTopics, jsTopics, nodejsTopics, systemDesignTopics } from '../../data/topics';
import { getProblems } from '../../data/problems';

const allTopics = [...algorithmTopics, ...jsTopics, ...nodejsTopics, ...systemDesignTopics];

export default function TopicLayout() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const topic = allTopics.find((t) => t.slug === slug);
  if (!topic) return <Typography>Тема не найдена</Typography>;

  const hasPractice = getProblems(slug ?? '').length > 0;

  const tabs: { path: string; label: string }[] = hasPractice
    ? [
        { path: '', label: 'Теория' },
        { path: 'practice', label: 'Практика' },
      ]
    : [{ path: '', label: 'Теория' }];

  const currentTab = location.pathname.includes('/practice') ? 1 : 0;

  return (
    <Box>
      <Tabs
        value={Math.min(currentTab, tabs.length - 1)}
        onChange={(_, v) => {
          const target = tabs[v]?.path ?? '';
          navigate(`/topic/${slug}${target ? `/${target}` : ''}`);
        }}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        {tabs.map((t) => (
          <Tab key={t.label} label={t.label} />
        ))}
      </Tabs>
      <Outlet />
    </Box>
  );
}
