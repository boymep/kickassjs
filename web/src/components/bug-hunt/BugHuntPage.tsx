import { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Chip,
  Paper,
  Alert,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import ReplayIcon from '@mui/icons-material/Replay';
import CodeBlock from '../theory/CodeBlock';
import { Inline } from '../../utils/renderInline';
import { bugHuntItems } from '../../data/bug-hunt';
import type { BugHuntItem } from '../../types/bughunt';

type FindResult = 'found' | 'missed';

interface ItemResult {
  item: BugHuntItem;
  result: FindResult;
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
};

const DIFFICULTY_COLOR: Record<string, 'success' | 'warning' | 'error'> = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
};

const TOPICS = [
  { value: 'all', label: 'Все темы' },
  { value: 'js-closures', label: 'Замыкания' },
  { value: 'js-event-loop', label: 'Event Loop' },
  { value: 'js-this', label: 'this' },
  { value: 'js-async', label: 'Async' },
  { value: 'js-prototypes', label: 'Прототипы' },
  { value: 'js-dom', label: 'DOM' },
  { value: 'node-event-loop', label: 'Node: Event Loop' },
  { value: 'node-streams', label: 'Node: Стримы' },
  { value: 'node-optimization', label: 'Node: Оптимизация' },
  { value: 'node-network', label: 'Node: Сеть' },
];

const DIFFICULTIES = [
  { value: 'all', label: 'Все' },
  { value: 'easy', label: 'Лёгкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'hard', label: 'Сложный' },
];

type Mode = 'filter' | 'quiz' | 'done';

export default function BugHuntPage() {
  const [mode, setMode] = useState<Mode>('filter');
  const [topicFilter, setTopicFilter] = useState('all');
  const [diffFilter, setDiffFilter] = useState('all');
  const [queue, setQueue] = useState<BugHuntItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<ItemResult[]>([]);

  const filteredItems = useMemo(() => {
    return bugHuntItems.filter((item) => {
      const topicOk = topicFilter === 'all' || item.topic === topicFilter;
      const diffOk = diffFilter === 'all' || item.difficulty === diffFilter;
      return topicOk && diffOk;
    });
  }, [topicFilter, diffFilter]);

  const handleStart = useCallback(() => {
    setQueue(filteredItems);
    setIdx(0);
    setRevealed(false);
    setResults([]);
    setMode('quiz');
  }, [filteredItems]);

  const handleReveal = useCallback(() => setRevealed(true), []);

  const handleAssess = useCallback(
    (result: FindResult) => {
      const item = queue[idx];
      const newResults = [...results, { item, result }];
      setResults(newResults);
      const nextIdx = idx + 1;
      if (nextIdx >= queue.length) {
        setMode('done');
      } else {
        setIdx(nextIdx);
        setRevealed(false);
      }
    },
    [queue, idx, results],
  );

  const handleRestart = useCallback(() => {
    setMode('filter');
    setTopicFilter('all');
    setDiffFilter('all');
    setQueue([]);
    setIdx(0);
    setRevealed(false);
    setResults([]);
  }, []);

  if (mode === 'filter') {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Смотришь на реальный код — находишь ошибку — сверяешь с объяснением.
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Тема
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {TOPICS.map((t) => (
              <Chip
                key={t.value}
                label={t.label}
                clickable
                onClick={() => setTopicFilter(t.value)}
                color={topicFilter === t.value ? 'primary' : 'default'}
                variant={topicFilter === t.value ? 'filled' : 'outlined'}
                size="small"
              />
            ))}
          </Box>

          <Typography variant="subtitle2" gutterBottom>
            Сложность
          </Typography>
          <ToggleButtonGroup
            value={diffFilter}
            exclusive
            onChange={(_, v) => { if (v) setDiffFilter(v); }}
            size="small"
          >
            {DIFFICULTIES.map((d) => (
              <ToggleButton key={d.value} value={d.value} sx={{ textTransform: 'none' }}>
                {d.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Paper>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Найдено: <strong>{filteredItems.length}</strong>{' '}
            {filteredItems.length === 1 ? 'задача' : filteredItems.length < 5 ? 'задачи' : 'задач'}
          </Typography>
          <Button
            variant="contained"
            disabled={filteredItems.length === 0}
            onClick={handleStart}
            sx={{ textTransform: 'none', ml: 'auto' }}
          >
            Начать
          </Button>
        </Box>
      </Box>
    );
  }

  if (mode === 'done') {
    const found = results.filter((r) => r.result === 'found').length;
    const missed = results.filter((r) => r.result === 'missed').length;
    const total = results.length;
    const pct = total > 0 ? Math.round((found / total) * 100) : 0;

    return (
      <Box>
        <Paper sx={{ p: 4, textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Охота завершена!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Ты нашёл {found} из {total} {total < 5 ? 'багов' : 'багов'}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="success.main">{found}</Typography>
              <Typography variant="caption" color="text.secondary">Нашёл</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="error.main">{missed}</Typography>
              <Typography variant="caption" color="text.secondary">Пропустил</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary">{pct}%</Typography>
              <Typography variant="caption" color="text.secondary">Точность</Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<ReplayIcon />}
            onClick={handleRestart}
            sx={{ textTransform: 'none' }}
          >
            Ещё раз
          </Button>
        </Paper>

        <Box>
          {results.map((r, i) => (
            <Box
              key={r.item.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                py: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ minWidth: 20 }}>
                {i + 1}.
              </Typography>
              <Typography variant="body2" sx={{ flex: 1 }}>
                {r.item.title}
              </Typography>
              <Chip
                label={r.item.topicLabel}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
              <Chip
                label={r.result === 'found' ? 'Нашёл' : 'Пропустил'}
                size="small"
                color={r.result === 'found' ? 'success' : 'error'}
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  const item = queue[idx];
  const progress = (idx / queue.length) * 100;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Баг {idx + 1} из {queue.length}
        </Typography>
        <Chip
          label={DIFFICULTY_LABEL[item.difficulty]}
          size="small"
          color={DIFFICULTY_COLOR[item.difficulty]}
        />
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ mb: 3, borderRadius: 1 }}
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
          <BugReportIcon fontSize="small" color="action" />
          <Typography variant="h6" sx={{ flex: 1 }}>
            {item.title}
          </Typography>
          <Chip label={item.topicLabel} size="small" variant="outlined" />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Найди {item.bugs.length === 1 ? 'ошибку' : `${item.bugs.length} ошибки`} в коде ниже
        </Typography>

        <CodeBlock code={item.code} language={item.language} />

        {!revealed ? (
          <Button
            variant="outlined"
            startIcon={<BugReportIcon />}
            onClick={handleReveal}
            sx={{ textTransform: 'none', mt: 1 }}
          >
            Показать ошибки
          </Button>
        ) : (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="overline" sx={{ display: 'block', color: 'error.main', mb: 1.5 }}>
              {item.bugs.length === 1 ? 'Ошибка' : `Ошибки (${item.bugs.length})`}
            </Typography>
            {item.bugs.map((bug, i) => (
              <Alert key={i} severity="error" sx={{ mb: i < item.bugs.length - 1 ? 2 : 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  <Inline>{bug.description}</Inline>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <Inline>{bug.explanation}</Inline>
                </Typography>
                <CodeBlock code={bug.fix} language={item.language} />
              </Alert>
            ))}
          </>
        )}
      </Paper>

      {revealed && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, textAlign: 'center' }}>
            Ты нашёл ошибку самостоятельно?
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              color="success"
              onClick={() => handleAssess('found')}
              sx={{ flex: 1, textTransform: 'none', py: 1.5 }}
            >
              <Box>
                <Box sx={{ fontWeight: 700 }}>Да, нашёл</Box>
                <Box sx={{ fontSize: '0.75rem', opacity: 0.8 }}>Заметил сам</Box>
              </Box>
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleAssess('missed')}
              sx={{ flex: 1, textTransform: 'none', py: 1.5 }}
            >
              <Box>
                <Box sx={{ fontWeight: 700 }}>Нет</Box>
                <Box sx={{ fontSize: '0.75rem', opacity: 0.8 }}>Не заметил</Box>
              </Box>
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
