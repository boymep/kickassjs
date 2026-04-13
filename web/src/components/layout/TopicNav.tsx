import { Tabs, Tab, Box, Typography } from '@mui/material';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import { algorithmTopics, jsTopics, nodejsTopics } from '../../data/topics';
import { hasFlashcards } from '../../data/flashcards';

const allTopics = [...algorithmTopics, ...jsTopics, ...nodejsTopics];

export default function TopicLayout() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const topic = allTopics.find((t) => t.slug === slug);
  if (!topic) return <Typography>Тема не найдена</Typography>;

  const showFlashcards = hasFlashcards(slug ?? '');
  const tabPaths = showFlashcards
    ? (['theory', 'quiz', 'practice', 'flashcards'] as const)
    : (['theory', 'quiz', 'practice'] as const);
  const tabLabels = showFlashcards
    ? ['Теория', 'Квиз', 'Практика', 'Карточки']
    : ['Теория', 'Квиз', 'Практика'];

  const currentTab = tabPaths.findIndex((p) => location.pathname.endsWith(`/${p}`));
  const activeTab = currentTab >= 0 ? currentTab : 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {topic.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {topic.description} — {topic.complexity}
      </Typography>
      <Tabs
        value={activeTab}
        onChange={(_, v) => navigate(`/topic/${slug}/${tabPaths[v]}`)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        {tabLabels.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>
      <Outlet />
    </Box>
  );
}
