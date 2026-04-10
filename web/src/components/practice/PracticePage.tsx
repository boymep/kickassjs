import { useParams, useNavigate } from 'react-router-dom';
import { Typography, List, ListItemButton, ListItemText, Chip, Box, Paper } from '@mui/material';
import { getProblems } from '../../data/problems';

export default function PracticePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const problems = getProblems(slug ?? '');

  if (problems.length === 0) {
    return <Typography>Задачи не найдены</Typography>;
  }

  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Решай задачи, проверяй тестами. Начни с простых и двигайся к средним.
      </Typography>
      <Paper>
        <List>
          {problems.map((p) => (
            <ListItemButton key={p.id} onClick={() => navigate(`/topic/${slug}/practice/${p.id}`)}>
              <ListItemText
                primary={p.title}
                secondary={p.description.slice(0, 100) + '...'}
              />
              <Box sx={{ display: 'flex', gap: 1, ml: 2, flexShrink: 0 }}>
                <Chip
                  label={p.difficulty === 'easy' ? 'Easy' : 'Medium'}
                  color={p.difficulty === 'easy' ? 'success' : 'warning'}
                  size="small"
                />
                {p.isContextual && (
                  <Chip label="Прикладная" size="small" variant="outlined" color="info" />
                )}
              </Box>
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
