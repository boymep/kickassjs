import { useMemo } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import { algorithmTopics, jsTopics, nodejsTopics, systemDesignTopics } from '../../data/topics';
import { getProblems } from '../../data/problems';
import { getLesson } from '../../data/lessons';

const allTopics = [...algorithmTopics, ...jsTopics, ...nodejsTopics, ...systemDesignTopics];

export default function TopicLayout() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const topic = allTopics.find((t) => t.slug === slug);
  const lesson = useMemo(() => getLesson(slug ?? ''), [slug]);

  if (!topic) return <Typography>Тема не найдена</Typography>;

  const hasQuiz = lesson
    ? lesson.finalQuiz.length > 0 ||
      lesson.chapters.some((c) => (c.checkpoint?.length ?? 0) > 0)
    : false;
  const hasPractice = getProblems(slug ?? '').length > 0;

  const tabs: { path: string; label: string }[] = [
    { path: '', label: 'Теория' },
    ...(hasQuiz ? [{ path: 'quiz', label: 'Квиз' }] : []),
    ...(hasPractice ? [{ path: 'practice', label: 'Практика' }] : []),
  ];

  const currentPath = location.pathname;
  const currentTab = (() => {
    if (currentPath.includes('/practice')) return tabs.findIndex((t) => t.path === 'practice');
    if (currentPath.endsWith('/quiz')) return tabs.findIndex((t) => t.path === 'quiz');
    return 0;
  })();

  return (
    <Box>
      <Tabs
        value={Math.max(0, Math.min(currentTab, tabs.length - 1))}
        onChange={(_, v) => {
          const target = tabs[v]?.path ?? '';
          navigate(`/topic/${slug}${target ? `/${target}` : ''}`);
        }}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        {tabs.map((t) => (
          <Tab key={t.path} label={t.label} />
        ))}
      </Tabs>
      <Outlet />
    </Box>
  );
}
