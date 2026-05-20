import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import ReplayIcon from '@mui/icons-material/Replay';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeBlock from '../theory/CodeBlock';
import CodeEditor from '../practice/CodeEditor';
import TestResults from '../practice/TestResults';
import { Inline } from '../../utils/renderInline';
import { useCodeRunner } from '../../hooks/useCodeRunner';
import { bugHuntItems } from '../../data/bug-hunt';
import { isRunnable, type BugHuntItem } from '../../types/bughunt';

type FindResult = 'found' | 'missed';

interface ItemResult {
  item: BugHuntItem;
  result: FindResult;
}

const DIFFICULTY_LABEL: Record<BugHuntItem['difficulty'], string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
};

const DIFFICULTY_COLOR: Record<BugHuntItem['difficulty'], 'success' | 'warning' | 'error'> = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
};

const DIFFICULTY_ORDER: Record<BugHuntItem['difficulty'], number> = {
  easy: 0,
  medium: 1,
  hard: 2,
};

const ORDERED_ITEMS: BugHuntItem[] = [...bugHuntItems].sort(
  (a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty],
);

export default function BugHuntPage() {
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<ItemResult[]>([]);
  const [done, setDone] = useState(false);

  const total = ORDERED_ITEMS.length;
  const item = ORDERED_ITEMS[idx];

  const advance = useCallback(
    (result: FindResult) => {
      if (!item) return;
      const newResults = [...results, { item, result }];
      setResults(newResults);
      const nextIdx = idx + 1;
      if (nextIdx >= total) setDone(true);
      else setIdx(nextIdx);
    },
    [item, idx, results, total],
  );

  const handleRestart = useCallback(() => {
    setIdx(0);
    setResults([]);
    setDone(false);
  }, []);

  const found = useMemo(() => results.filter((r) => r.result === 'found').length, [results]);
  const missed = results.length - found;

  if (done) {
    return (
      <FinalScreen total={total} found={found} results={results} onRestart={handleRestart} />
    );
  }

  if (!item) return null;
  const progress = ((idx + 1) / total) * 100;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
        <Typography variant="body2" color="text.secondary">
          Баг {idx + 1} из {total}
        </Typography>
        <Chip
          label={`Найдено: ${found}`}
          size="small"
          color="success"
          variant="outlined"
          icon={<CheckCircleIcon />}
        />
        {missed > 0 && (
          <Chip
            label={`Пропущено: ${missed}`}
            size="small"
            color="error"
            variant="outlined"
            icon={<HighlightOffIcon />}
          />
        )}
      </Box>
      <LinearProgress variant="determinate" value={progress} sx={{ mb: 3, borderRadius: 1 }} />

      {isRunnable(item) ? (
        <RunnableItem
          key={item.id}
          item={item}
          onAdvance={advance}
        />
      ) : (
        <ReadOnlyItem
          key={item.id}
          item={item}
          onAdvance={advance}
        />
      )}
    </Box>
  );
}

// ─── Final screen ────────────────────────────────────────────────────────────

function FinalScreen({
  total,
  found,
  results,
  onRestart,
}: {
  total: number;
  found: number;
  results: ItemResult[];
  onRestart: () => void;
}) {
  return (
    <Box>
      <Paper sx={{ p: 4, textAlign: 'center', mb: 3 }}>
        <BugReportIcon color="primary" sx={{ fontSize: 56, mb: 1 }} />
        <Typography variant="h4" gutterBottom>
          Все баги пройдены
        </Typography>
        <Typography variant="h2" color="primary" sx={{ mb: 1 }}>
          {found} / {total}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {found === total
            ? 'Идеально — глаз-алмаз: ни один баг не прошёл мимо.'
            : found >= total * 0.8
              ? 'Отличный результат. Пара пропусков — обычная история на интервью.'
              : found >= total * 0.5
                ? 'Половину поймали. Просмотрите пропущенные — они покрывают типичные паттерны.'
                : 'Большая часть багов уехала мимо. Имеет смысл повторить теорию и пройти тренажёр заново.'}
        </Typography>
        <Button variant="contained" startIcon={<ReplayIcon />} onClick={onRestart}>
          Пройти заново
        </Button>
      </Paper>

      <Typography variant="h6" sx={{ mb: 1.5 }}>
        Разбор по итогам
      </Typography>
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
            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 24 }}>
              {i + 1}.
            </Typography>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                {r.item.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {r.item.topicLabel} · {DIFFICULTY_LABEL[r.item.difficulty]}
              </Typography>
            </Box>
            <Chip
              size="small"
              variant="outlined"
              color={r.result === 'found' ? 'success' : 'error'}
              icon={r.result === 'found' ? <CheckCircleIcon /> : <HighlightOffIcon />}
              label={r.result === 'found' ? 'Решил' : 'Не решил'}
              sx={{ fontSize: '0.7rem' }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ─── Item header ─────────────────────────────────────────────────────────────

function ItemHeader({ item }: { item: BugHuntItem }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
      <Typography variant="h5" sx={{ m: 0, lineHeight: 1.3, mr: 0.5 }}>
        {item.title}
      </Typography>
      <Chip
        label={DIFFICULTY_LABEL[item.difficulty]}
        size="small"
        color={DIFFICULTY_COLOR[item.difficulty]}
      />
      <Chip label={item.topicLabel} size="small" variant="outlined" color="primary" />
    </Box>
  );
}

// ─── Runnable item with code editor and test runner ──────────────────────────

interface RunnableItemProps {
  item: BugHuntItem & { functionName: string; solutionCode: string };
  onAdvance: (result: FindResult) => void;
}

function RunnableItem({ item, onAdvance }: RunnableItemProps) {
  const [code, setCode] = useState(item.code);
  const [revealed, setRevealed] = useState(false);
  const [hintIndex, setHintIndex] = useState(-1);
  const { results, running, run, reset } = useCodeRunner();

  // Reset editor state when the item changes.
  useEffect(() => {
    setCode(item.code);
    setRevealed(false);
    setHintIndex(-1);
    reset();
  }, [item.id, item.code, reset]);

  const allPassed =
    results !== null && results.length > 0 && results.every((r) => r.passed);

  const handleRun = useCallback(() => {
    run(code, item.functionName, item.testCases ?? [], item.testHelperCode);
  }, [run, code, item]);

  const handleResetCode = useCallback(() => {
    setCode(item.code);
    reset();
  }, [item.code, reset]);

  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 }, mb: 2 }}>
      <ItemHeader item={item} />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        В коде ниже спрятан баг — почините его и запустите тесты. Если запутались — откройте подсказку или разбор.
      </Typography>

      <CodeEditor value={code} onChange={setCode} />

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Button
          variant="contained"
          startIcon={<PlayArrowIcon />}
          onClick={handleRun}
          disabled={running}
        >
          {running ? 'Выполняется…' : 'Запустить тесты'}
        </Button>
        <Button startIcon={<RestartAltIcon />} onClick={handleResetCode}>
          Вернуть исходный
        </Button>
        {item.bugs.length > 0 && (
          <Button
            variant="outlined"
            startIcon={<LightbulbIcon />}
            onClick={() => setHintIndex((i) => Math.min(i + 1, item.bugs.length - 1))}
            disabled={hintIndex >= item.bugs.length - 1}
          >
            Подсказка {hintIndex >= 0 ? `(${hintIndex + 1}/${item.bugs.length})` : ''}
          </Button>
        )}
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<VisibilityIcon />}
          onClick={() => setRevealed(true)}
          disabled={revealed}
        >
          Показать разбор
        </Button>
      </Box>

      {hintIndex >= 0 && (
        <Box sx={{ mt: 2 }}>
          {item.bugs.slice(0, hintIndex + 1).map((b, i) => (
            <Alert key={i} severity="info" sx={{ mb: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Подсказка {i + 1}: где искать
              </Typography>
              <Typography variant="body2">
                <Inline>{b.description}</Inline>
              </Typography>
            </Alert>
          ))}
        </Box>
      )}

      {results && (
        <TestResults results={results} testCases={item.testCases ?? []} />
      )}

      {allPassed && (
        <Alert severity="success" sx={{ mt: 2 }} icon={<CheckCircleIcon />}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Тесты пройдены — баг устранён
          </Typography>
          {item.bugs.map((b, i) => (
            <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>
              <Inline>{b.fix}</Inline>
            </Typography>
          ))}
        </Alert>
      )}

      {revealed && (
        <Box sx={{ mt: 2 }}>
          {item.bugs.map((bug, i) => (
            <Box key={i} sx={{ mb: 1 }}>
              <Alert severity="error" icon={<BugReportIcon />}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Баг {item.bugs.length > 1 ? `${i + 1} ` : ''}
                </Typography>
                <Typography variant="body2">
                  <Inline>{bug.description}</Inline>
                </Typography>
              </Alert>
              <Alert severity="info" sx={{ mt: 0.5 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Что под капотом
                </Typography>
                <Typography variant="body2">
                  <Inline>{bug.explanation}</Inline>
                </Typography>
              </Alert>
            </Box>
          ))}
          <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Эталонная починенная версия
            </Typography>
            <CodeBlock code={item.solutionCode} language={item.language} />
          </Paper>
        </Box>
      )}

      {(allPassed || revealed) && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => onAdvance(allPassed && !revealed ? 'found' : 'missed')}
          >
            Дальше
          </Button>
        </Box>
      )}
    </Paper>
  );
}

// ─── Read-only fallback item (when no test scaffolding) ──────────────────────

function ReadOnlyItem({
  item,
  onAdvance,
}: {
  item: BugHuntItem;
  onAdvance: (result: FindResult) => void;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 }, mb: 2 }}>
      <ItemHeader item={item} />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Прочитайте код. Найдите баг или ошибку. Сверьтесь с разбором — затем отметьте, нашли ли его сами.
      </Typography>

      <CodeBlock code={item.code} language={item.language} />

      {!revealed ? (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => setRevealed(true)}
            size="large"
          >
            Показать баг
          </Button>
        </Box>
      ) : (
        <>
          {item.bugs.map((bug, i) => (
            <Box key={i} sx={{ mt: 2 }}>
              <Alert severity="error" icon={<BugReportIcon />}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Баг {item.bugs.length > 1 ? `${i + 1} ` : ''}
                </Typography>
                <Typography variant="body2"><Inline>{bug.description}</Inline></Typography>
              </Alert>
              <Alert severity="success" sx={{ mt: 1 }} icon={<CheckCircleIcon />}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Как починить
                </Typography>
                <Typography variant="body2"><Inline>{bug.fix}</Inline></Typography>
              </Alert>
              <Alert severity="info" sx={{ mt: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Что под капотом
                </Typography>
                <Typography variant="body2"><Inline>{bug.explanation}</Inline></Typography>
              </Alert>
            </Box>
          ))}
        </>
      )}

      {revealed && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, textAlign: 'center' }}>
            Вы нашли баг до того, как раскрыли разбор?
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => onAdvance('found')}
              sx={{ flex: 1, textTransform: 'none', py: 1.5, minWidth: 200 }}
            >
              <Box>
                <Box sx={{ fontWeight: 700 }}>Нашёл сам</Box>
                <Box sx={{ fontSize: '0.75rem', opacity: 0.8 }}>До разбора</Box>
              </Box>
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<HighlightOffIcon />}
              onClick={() => onAdvance('missed')}
              sx={{ flex: 1, textTransform: 'none', py: 1.5, minWidth: 200 }}
            >
              <Box>
                <Box sx={{ fontWeight: 700 }}>Пропустил</Box>
                <Box sx={{ fontSize: '0.75rem', opacity: 0.8 }}>Узнал из разбора</Box>
              </Box>
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
