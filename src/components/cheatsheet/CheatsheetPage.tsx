import { useMemo, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import HelpIcon from '@mui/icons-material/Help';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SpeedIcon from '@mui/icons-material/Speed';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  algorithmTopics,
  jsTopics,
  nodejsTopics,
  systemDesignTopics,
} from '../../data/topics';
import type { TopicMeta } from '../../types/topic';
import { getLesson } from '../../data/lessons';
import Markdown from '../lesson/Markdown';

const steps = [
  {
    label: 'Уточните условие',
    icon: <HelpIcon />,
    description:
      'Не бросайся сразу писать код. Задай вопросы интервьюеру: какие ограничения на входные данные? Могут ли быть отрицательные числа? Что возвращать, если входные данные пустые? Может ли быть несколько правильных ответов? Чем больше вы уточните сейчас — тем меньше сюрпризов потом.',
  },
  {
    label: 'Приведи примеры',
    icon: <VisibilityIcon />,
    description:
      'Разберите 2–3 примера вслух: обычный случай, граничный случай (пустой массив, один элемент) и случай с подвохом (все элементы одинаковые, отсортированный массив). Это покажет интервьюеру, что вы понимаете задачу, и поможет вам заметить паттерн.',
  },
  {
    label: 'Определи паттерн',
    icon: <AccountTreeIcon />,
    description:
      'Объясните интервьюеру, какой алгоритмический подход вы хотите использовать и почему. Например: «Здесь нужно найти подмассив с максимальной суммой — это классическая задача на скользящее окно» или «Нам нужно проверять наличие элемента за O(1) — используем хеш-таблицу». Это показывает системное мышление.',
  },
  {
    label: 'Оцени сложность заранее',
    icon: <SpeedIcon />,
    description:
      'Прежде чем писать код, озвучь ожидаемую сложность по времени и памяти. Например: «Этот подход даст O(n) по времени и O(1) по памяти». Если интервьюер ожидает лучше — вы узнаете об этом до того, как потратите время на реализацию неоптимального решения.',
  },
  {
    label: 'Напишите код',
    icon: <CodeIcon />,
    description:
      'Пиши чистый, читаемый код. Давай переменным понятные имена (не i, j, temp). Комментируй ключевые моменты. Проговаривай вслух, что делаете: «Сейчас я инициализирую два указателя...». Если не уверен в синтаксисе — скажи об этом, это нормально.',
  },
  {
    label: 'Протестируй',
    icon: <BugReportIcon />,
    description:
      'Пройдитесь по своему коду с конкретным примером: подставьте значения и проследите выполнение шаг за шагом. Проверьте граничные случаи: пустой вход, один элемент, дубликаты. Если нашёл баг — спокойно исправьте и объясните, что пошло не так.',
  },
];

const edgeCases = [
  'Пустой массив / пустая строка',
  'Один элемент',
  'Все элементы одинаковые',
  'Уже отсортировано / отсортировано в обратном порядке',
  'Отрицательные числа',
  'Очень большой вход (думай про переполнение)',
  'Дубликаты',
];

const redFlags = [
  'Сразу бросаться писать код, не подумав',
  'Не задавать уточняющих вопросов',
  'Игнорировать граничные случаи',
  'Не объяснять свой подход',
  'Не оценивать сложность решения',
];

const helpfulPhrases = [
  'Давайте я сначала уточню условие...',
  'Мне кажется, здесь подойдёт паттерн X, потому что...',
  'Сложность будет O(n), потому что...',
  'Давайте проверим на примере...',
  'А если входной массив пустой?',
];

const SECTIONS: { title: string; topics: TopicMeta[] }[] = [
  { title: 'Алгоритмы', topics: algorithmTopics },
  { title: 'JavaScript', topics: jsTopics },
  { title: 'Node.js', topics: nodejsTopics },
  { title: 'System Design', topics: systemDesignTopics },
];

interface CheatsheetEntry {
  topic: TopicMeta;
  cheatsheet: string;
}

function collectCheatsheets(): { title: string; entries: CheatsheetEntry[] }[] {
  return SECTIONS.map(({ title, topics }) => ({
    title,
    entries: topics
      .map((t) => {
        const lesson = getLesson(t.slug);
        if (!lesson || !lesson.cheatsheet || lesson.cheatsheet.trim() === '') return null;
        return { topic: t, cheatsheet: lesson.cheatsheet } as CheatsheetEntry;
      })
      .filter((e): e is CheatsheetEntry => e !== null),
  })).filter((s) => s.entries.length > 0);
}

export default function CheatsheetPage() {
  const [tab, setTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const sections = useMemo(() => collectCheatsheets(), []);
  const totalEntries = sections.reduce((sum, s) => sum + s.entries.length, 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Шпаргалка для собеседования
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Краткие выжимки по всем темам и универсальный алгоритм решения задач
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label={`Шпаргалки по темам (${totalEntries})`} />
        <Tab label="Алгоритм решения задачи" />
      </Tabs>

      {tab === 0 && (
        <Box>
          {sections.map((section) => (
            <Box key={section.title} sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {section.title}{' '}
                <Typography component="span" variant="body2" color="text.secondary">
                  · {section.entries.length} тем
                </Typography>
              </Typography>
              {section.entries.map((entry) => (
                <Accordion
                  key={entry.topic.slug}
                  disableGutters
                  square={false}
                  sx={{
                    mb: 1,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 2,
                    '&:before': { display: 'none' },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                        {entry.topic.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {entry.topic.description}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box
                      sx={{
                        backgroundColor: (t) =>
                          t.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                        borderRadius: 1.5,
                        p: 2,
                        mb: 2,
                      }}
                    >
                      <Markdown>{entry.cheatsheet}</Markdown>
                    </Box>
                    <Button
                      component={RouterLink}
                      to={`/topic/${entry.topic.slug}`}
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ textTransform: 'none' }}
                    >
                      Открыть полный урок
                    </Button>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ))}
        </Box>
      )}

      {tab === 1 && (
        <Box>
          {/* Секция 1: Stepper */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Как решать задачу на собеседовании
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Нажимай на шаг, чтобы увидеть подробности
            </Typography>

            <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
              {steps.map((step, index) => (
                <Step key={step.label} active={activeStep === index}>
                  <StepLabel
                    onClick={() => setActiveStep(index)}
                    sx={{ cursor: 'pointer' }}
                    slotProps={{
                      stepIcon: {
                        sx: {
                          fontSize: 28,
                          '&.Mui-active': { color: 'primary.main' },
                          '&.Mui-completed': { color: 'primary.main' },
                        },
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {step.icon}
                      <Typography variant="h6" sx={{ fontSize: '1.05rem' }}>
                        {step.label}
                      </Typography>
                    </Box>
                  </StepLabel>
                  <StepContent>
                    <Typography
                      variant="body1"
                      sx={{ py: 1, pl: 1, lineHeight: 1.8, color: 'text.secondary' }}
                    >
                      {step.description}
                    </Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Paper>

          {/* Секция 2: Edge cases */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Чеклист edge cases
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Всегда проверяй эти случаи перед тем, как сказать «готово»
            </Typography>

            <List dense>
              {edgeCases.map((item) => (
                <ListItem key={item}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Секция 3: Красные флаги */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Красные флаги
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Что интервьюеры замечают и оценивают негативно
            </Typography>

            <List dense>
              {redFlags.map((item) => (
                <ListItem key={item}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ErrorIcon color="error" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>

            <Alert severity="warning" sx={{ mt: 2 }}>
              Даже если вы знаете решение — покажите процесс мышления. Интервьюеру важно не только «что», но и «как» вы думаете.
            </Alert>
          </Paper>

          <Divider sx={{ my: 4 }} />

          {/* Секция 4: Полезные фразы */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LightbulbIcon color="primary" />
              <Typography variant="h5">Полезные фразы</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Используйте эти фразы, чтобы звучать уверенно и структурированно
            </Typography>

            <List>
              {helpfulPhrases.map((phrase) => (
                <ListItem key={phrase} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <FormatQuoteIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Chip
                        label={`«${phrase}»`}
                        variant="outlined"
                        color="primary"
                        sx={{ height: 'auto', py: 0.5, '& .MuiChip-label': { whiteSpace: 'normal' } }}
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
