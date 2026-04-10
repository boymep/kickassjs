import { Tabs, Tab, Box, Typography } from '@mui/material';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import { topics } from '../../data/topics';

const tabPaths = ['theory', 'quiz', 'practice'] as const;
const tabLabels = ['Теория', 'Квиз', 'Практика'];

export default function TopicLayout() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const topic = topics.find((t) => t.slug === slug);
  if (!topic) return <Typography>Тема не найдена</Typography>;

  const currentTab = tabPaths.findIndex((p) => location.pathname.includes(`/${p}`));
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
