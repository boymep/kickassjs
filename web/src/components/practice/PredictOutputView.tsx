import { useEffect, useState } from 'react';
import { Alert, Box, Button, Collapse, Paper, TextField, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CodeBlock from '../theory/CodeBlock';
import HintsPanel from './HintsPanel';
import ProblemHeader from './ProblemHeader';
import { useStdoutRunner } from '../../hooks/useStdoutRunner';
import { normalizeOutput } from '../../utils/stdoutRunner';
import type { PredictOutputProblem } from '../../types/problem';
import { useProgress } from '../../hooks/useProgress';

interface PredictOutputViewProps {
  problem: PredictOutputProblem;
}

function matches(answer: string, expected: string, acceptable?: string[]): boolean {
  const a = normalizeOutput(answer);
  if (a === normalizeOutput(expected)) return true;
  return (acceptable ?? []).some((alt) => a === normalizeOutput(alt));
}

export default function PredictOutputView({ problem }: PredictOutputViewProps) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [actualRun, setActualRun] = useState<string | null>(null);
  const { result, running, run } = useStdoutRunner();
  const { markSolved } = useProgress(problem.topicId);

  useEffect(() => {
    setAnswer('');
    setSubmitted(false);
    setShowSolution(false);
    setActualRun(null);
  }, [problem.id]);

  const isCorrect = submitted && matches(answer, problem.expected, problem.acceptable);

  useEffect(() => {
    if (isCorrect) markSolved(problem.id);
  }, [isCorrect, markSolved, problem.id]);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleRunActual = async () => {
    const r = await run(problem.code);
    setActualRun(r.output);
  };

  return (
    <>
      <ProblemHeader problem={problem} />
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="overline" color="text.secondary">Код</Typography>
        <CodeBlock code={problem.code} />
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Что выведет console.log?
        </Typography>
        <TextField
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          multiline
          minRows={3}
          fullWidth
          placeholder="Введи ожидаемый вывод по строкам, как в консоли"
          slotProps={{ htmlInput: { spellCheck: false, style: { fontFamily: '"Fira Code", "SF Mono", Consolas, monospace', fontSize: 13 } } }}
          disabled={submitted && isCorrect}
        />
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Button
          variant="contained"
          startIcon={<CheckCircleIcon />}
          onClick={handleSubmit}
          disabled={!answer.trim()}
        >
          Проверить
        </Button>
        <Button
          variant="outlined"
          startIcon={<PlayArrowIcon />}
          onClick={handleRunActual}
          disabled={running}
        >
          {running ? 'Запускается…' : 'Запустить реально'}
        </Button>
        <HintsPanel hints={problem.hints} />
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<VisibilityIcon />}
          onClick={() => setShowSolution((s) => !s)}
        >
          {showSolution ? 'Скрыть разбор' : 'Показать разбор'}
        </Button>
      </Box>

      {submitted && (
        <Box sx={{ mt: 2 }}>
          {isCorrect ? (
            <Alert severity="success" icon={<CheckCircleIcon />}>
              Верно. Это и есть фактический вывод.
            </Alert>
          ) : (
            <Alert severity="warning" icon={<HighlightOffIcon />}>
              Не совпадает. Обрати внимание на пробелы, переводы строк и порядок вывода.
            </Alert>
          )}
        </Box>
      )}

      {actualRun !== null && (
        <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Фактический вывод
          </Typography>
          {result?.error ? (
            <Alert severity="error">{result.error}</Alert>
          ) : (
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 1.5,
                borderRadius: 1.5,
                backgroundColor: (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                fontFamily: '"Fira Code", "SF Mono", Consolas, monospace',
                fontSize: 13,
                whiteSpace: 'pre-wrap',
              }}
            >
              {actualRun || <Box component="span" sx={{ opacity: 0.6 }}>(пусто)</Box>}
            </Box>
          )}
        </Paper>
      )}

      <Collapse in={showSolution}>
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>Эталонный вывод</Typography>
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 1.5,
              borderRadius: 1.5,
              backgroundColor: (t) => (t.palette.mode === 'dark' ? 'rgba(76,175,80,0.08)' : 'rgba(76,175,80,0.08)'),
              fontFamily: '"Fira Code", "SF Mono", Consolas, monospace',
              fontSize: 13,
              whiteSpace: 'pre-wrap',
            }}
          >
            {problem.expected}
          </Box>
          <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>Разбор</Typography>
          <CodeBlock code={problem.solutionCode} />
        </Paper>
      </Collapse>
    </>
  );
}
