import { useEffect, useState } from 'react';
import { Alert, Box, Button, Chip, Collapse, Paper, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SpeedIcon from '@mui/icons-material/Speed';
import CodeEditor from './CodeEditor';
import TestResults from './TestResults';
import CodeBlock from '../theory/CodeBlock';
import HintsPanel from './HintsPanel';
import ProblemHeader from './ProblemHeader';
import { useCodeRunner } from '../../hooks/useCodeRunner';
import { runCode } from '../../utils/codeRunner';
import type { RefactorProblem } from '../../types/problem';
import { useProgress } from '../../hooks/useProgress';

interface RefactorViewProps {
  problem: RefactorProblem;
}

interface PerfReport {
  passed: boolean;
  ms: number;
  maxMs: number;
  error?: string;
}

export default function RefactorView({ problem }: RefactorViewProps) {
  const [code, setCode] = useState(problem.starterCode);
  const [showSolution, setShowSolution] = useState(false);
  const [perf, setPerf] = useState<PerfReport | null>(null);
  const [perfRunning, setPerfRunning] = useState(false);
  const { results, running, run } = useCodeRunner();
  const { markSolved } = useProgress(problem.topicId);

  useEffect(() => {
    setCode(problem.starterCode);
    setShowSolution(false);
    setPerf(null);
  }, [problem.id, problem.starterCode]);

  const correctnessPassed = results !== null && results.length > 0 && results.every((r) => r.passed);
  const perfPassed = problem.perfTest ? perf?.passed === true : true;
  const fullyPassed = correctnessPassed && perfPassed;

  useEffect(() => {
    if (fullyPassed) markSolved(problem.id);
  }, [fullyPassed, markSolved, problem.id]);

  const handleRun = () => {
    run(code, problem.functionName, problem.testCases, problem.testHelperCode);
  };

  const handlePerf = async () => {
    if (!problem.perfTest) return;
    setPerfRunning(true);
    setPerf(null);
    const tc = {
      id: 'perf',
      inputDisplay: 'perf input',
      inputArgs: problem.perfTest.inputArgs,
      expected: '__skip__',
    };
    const t0 = performance.now();
    try {
      const r = await runCode(code, problem.functionName, [tc], problem.testHelperCode);
      const ms = Math.round(performance.now() - t0);
      const error = r[0]?.error;
      setPerf({
        passed: !error && ms <= problem.perfTest.maxMs,
        ms,
        maxMs: problem.perfTest.maxMs,
        error,
      });
    } finally {
      setPerfRunning(false);
    }
  };

  return (
    <>
      <ProblemHeader problem={problem} />
      <Alert severity="info" sx={{ mb: 2 }}>
        Стартовый код корректен, но медленный. Сделай его быстрее, не ломая правильность.
        {problem.perfTest && (
          <Box sx={{ mt: 0.5, fontSize: '0.85em' }}>
            <SpeedIcon fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Цель — уложиться в {problem.perfTest.maxMs} мс на большом входе.
          </Box>
        )}
      </Alert>
      <CodeEditor value={code} onChange={setCode} />
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={handleRun} disabled={running}>
          {running ? 'Выполняется...' : 'Прогнать тесты'}
        </Button>
        {problem.perfTest && (
          <Button
            variant="outlined"
            color="warning"
            startIcon={<SpeedIcon />}
            onClick={handlePerf}
            disabled={perfRunning || !correctnessPassed}
          >
            {perfRunning ? 'Замер…' : 'Замер скорости'}
          </Button>
        )}
        <HintsPanel hints={problem.hints} />
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<VisibilityIcon />}
          onClick={() => setShowSolution((s) => !s)}
        >
          {showSolution ? 'Скрыть решение' : 'Показать решение'}
        </Button>
      </Box>
      {results && <TestResults results={results} testCases={problem.testCases} />}
      {perf && (
        <Alert severity={perf.passed ? 'success' : 'warning'} sx={{ mt: 2 }} icon={<SpeedIcon />}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip
              label={perf.passed ? 'В лимите' : 'Медленно'}
              color={perf.passed ? 'success' : 'warning'}
              size="small"
            />
            <Typography variant="body2">
              {perf.error
                ? `Ошибка: ${perf.error}`
                : `Время: ${perf.ms} мс из ${perf.maxMs} мс`}
            </Typography>
          </Box>
        </Alert>
      )}
      <Collapse in={showSolution}>
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>Эффективное решение</Typography>
          <CodeBlock code={problem.solutionCode} />
        </Paper>
      </Collapse>
    </>
  );
}
