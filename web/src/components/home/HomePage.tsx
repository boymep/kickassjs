import { Grid, Card, CardContent, CardActionArea, Typography, Chip, Box, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import TagIcon from '@mui/icons-material/Tag';
import LayersIcon from '@mui/icons-material/Layers';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PsychologyIcon from '@mui/icons-material/Psychology';
import DescriptionIcon from '@mui/icons-material/Description';
import WarningIcon from '@mui/icons-material/Warning';
import { topics } from '../../data/topics';

const iconMap: Record<string, React.ReactElement> = {
  Search: <SearchIcon sx={{ fontSize: 40 }} />,
  CompareArrows: <CompareArrowsIcon sx={{ fontSize: 40 }} />,
  ViewColumn: <ViewColumnIcon sx={{ fontSize: 40 }} />,
  Tag: <TagIcon sx={{ fontSize: 40 }} />,
  Layers: <LayersIcon sx={{ fontSize: 40 }} />,
  AccountTree: <AccountTreeIcon sx={{ fontSize: 40 }} />,
};

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Подготовка к алгоритмической секции
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        6 ключевых паттернов + практические задачи
      </Typography>

      <Grid container spacing={3}>
        {topics.map((t) => (
          <Grid key={t.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea onClick={() => navigate(`/topic/${t.slug}/theory`)} sx={{ p: 2, height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    {iconMap[t.icon]}
                    <Typography variant="h6">{t.title}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {t.description}
                  </Typography>
                  <Chip label={t.complexity} size="small" color="primary" variant="outlined" />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" gutterBottom>
        Дополнительные инструменты
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardActionArea onClick={() => navigate('/pattern-game')} sx={{ p: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <PsychologyIcon sx={{ fontSize: 32 }} />
                  <Typography variant="h6">Определи паттерн</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Читаешь условие задачи — выбираешь алгоритм
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardActionArea onClick={() => navigate('/cheatsheet')} sx={{ p: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <DescriptionIcon sx={{ fontSize: 32 }} />
                  <Typography variant="h6">Шпаргалка для собеса</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Чеклист: как решать задачу на интервью
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardActionArea onClick={() => navigate('/js-pitfalls')} sx={{ p: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <WarningIcon sx={{ fontSize: 32 }} />
                  <Typography variant="h6">JS-ловушки</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Подводные камни JavaScript при работе с алгоритмами
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
