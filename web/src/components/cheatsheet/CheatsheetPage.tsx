import { useState } from 'react';
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
} from '@mui/material';
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

const steps = [
  {
    label: 'Уточни условие',
    icon: <HelpIcon />,
    description:
      'Не бросайся сразу писать код. Задай вопросы интервьюеру: какие ограничения на входные данные? Могут ли быть отрицательные числа? Что возвращать, если входные данные пустые? Может ли быть несколько правильных ответов? Чем больше ты уточнишь сейчас — тем меньше сюрпризов потом.',
  },
  {
    label: 'Приведи примеры',
    icon: <VisibilityIcon />,
    description:
      'Разбери 2–3 примера вслух: обычный случай, граничный случай (пустой массив, один элемент) и случай с подвохом (все элементы одинаковые, отсортированный массив). Это покажет интервьюеру, что ты понимаешь задачу, и поможет тебе заметить паттерн.',
  },
  {
    label: 'Определи паттерн',
    icon: <AccountTreeIcon />,
    description:
      'Объясни интервьюеру, какой алгоритмический подход ты хочешь использовать и почему. Например: «Здесь нужно найти подмассив с максимальной суммой — это классическая задача на скользящее окно» или «Нам нужно проверять наличие элемента за O(1) — используем хеш-таблицу». Это показывает системное мышление.',
  },
  {
    label: 'Оцени сложность заранее',
    icon: <SpeedIcon />,
    description:
      'Прежде чем писать код, озвучь ожидаемую сложность по времени и памяти. Например: «Этот подход даст O(n) по времени и O(1) по памяти». Если интервьюер ожидает лучше — ты узнаешь об этом до того, как потратишь время на реализацию неоптимального решения.',
  },
  {
    label: 'Напиши код',
    icon: <CodeIcon />,
    description:
      'Пиши чистый, читаемый код. Давай переменным понятные имена (не i, j, temp). Комментируй ключевые моменты. Проговаривай вслух, что делаешь: «Сейчас я инициализирую два указателя...». Если не уверен в синтаксисе — скажи об этом, это нормально.',
  },
  {
    label: 'Протестируй',
    icon: <BugReportIcon />,
    description:
      'Пройдись по своему коду с конкретным примером: подставь значения и проследи выполнение шаг за шагом. Проверь граничные случаи: пустой вход, один элемент, дубликаты. Если нашёл баг — спокойно исправь и объясни, что пошло не так.',
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

export default function CheatsheetPage() {
  const [activeStep, setActiveStep] = useState(0);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Шпаргалка для собеседования
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Пошаговый план решения алгоритмической задачи на интервью
      </Typography>

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
                onClick={() => handleStepClick(index)}
                sx={{ cursor: 'pointer' }}
                StepIconProps={{
                  sx: {
                    fontSize: 28,
                    '&.Mui-active': { color: 'primary.main' },
                    '&.Mui-completed': { color: 'primary.main' },
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
          Даже если ты знаешь решение — покажи процесс мышления. Интервьюеру важно не
          только «что», но и «как» ты думаешь.
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
          Используй эти фразы, чтобы звучать уверенно и структурированно
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
  );
}
