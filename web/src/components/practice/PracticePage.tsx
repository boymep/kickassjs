import { useParams, useNavigate } from 'react-router-dom';
import { Typography, List, ListItemButton, ListItemText, Chip, Box, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getProblems } from '../../data/problems';
import { getProblemKind, type Problem, type ProblemKind } from '../../types/problem';
import { useProgress } from '../../hooks/useProgress';

const DIFFICULTY_LABEL: Record<Problem['difficulty'], string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

const DIFFICULTY_COLOR: Record<Problem['difficulty'], 'success' | 'warning' | 'error'> = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
};

const KIND_LABEL: Record<ProblemKind, string> = {
  implement: 'Реализуй',
  'predict-output': 'Угадай вывод',
  'find-bug': 'Найди баг',
  refactor: 'Оптимизируй',
};

export default function PracticePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const problems = getProblems(slug ?? '');
  const { isSolved } = useProgress(slug ?? '');

  if (problems.length === 0) {
    return <Typography>Задачи не найдены</Typography>;
  }

  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Разные форматы: реализуй функцию, угадай вывод, найди баг, оптимизируй.
      </Typography>
      <Paper>
        <List>
          {problems.map((p) => {
            const kind = getProblemKind(p);
            const solved = isSolved(p.id);
            return (
              <ListItemButton key={p.id} onClick={() => navigate(`/topic/${slug}/practice/${p.id}`)}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1.5 }}>
                  <CheckCircleIcon
                    fontSize="small"
                    sx={{ color: solved ? 'success.main' : 'action.disabled' }}
                  />
                </Box>
                <ListItemText
                  primary={p.title}
                  secondary={p.description.slice(0, 110) + (p.description.length > 110 ? '…' : '')}
                />
                <Box sx={{ display: 'flex', gap: 1, ml: 2, flexShrink: 0, flexWrap: 'wrap' }}>
                  <Chip
                    label={DIFFICULTY_LABEL[p.difficulty]}
                    color={DIFFICULTY_COLOR[p.difficulty]}
                    size="small"
                  />
                  <Chip label={KIND_LABEL[kind]} color="primary" size="small" variant="outlined" />
                  {p.isContextual && (
                    <Chip label="Прикладная" size="small" variant="outlined" color="info" />
                  )}
                </Box>
              </ListItemButton>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}
