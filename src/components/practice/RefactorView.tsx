import { useEffect, useState } from 'react';
import { Alert, Box, Button, Collapse, Paper, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SpeedIcon from '@mui/icons-material/Speed';
import CodeEditor from './CodeEditor';
import TestResults from './TestResults';
import CodeBlock from '../theory/CodeBlock';
import { HintsButton, HintsDisplay } from './HintsPanel';
import ProblemHeader from './ProblemHeader';
import { useCodeRunner } from '../../hooks/useCodeRunner';
import { useHints } from '../../hooks/useHints';
import type { RefactorProblem, TestCase } from '../../types/problem';
import { useProgress } from '../../hooks/useProgress';

interface RefactorViewProps {
  problem: RefactorProblem;
}

export default function RefactorView({ problem }: RefactorViewProps) {
  const [code, setCode] = useState(problem.starterCode);
  const [showSolution, setShowSolution] = useState(false);
  const { results, running, run } = useCodeRunner();
  const { markSolved } = useProgress(problem.topicId);
  const { hintIndex, showNext } = useHints(problem.id);

  const allTestCases: TestCase[] = [
    ...problem.testCases,
    ...(problem.perfTest
      ? [{
          id: `${problem.id}-perf`,
          inputDisplay: `Замер скорости (лимит: ${problem.perfTest.maxMs}мс)`,
          inputArgs: problem.perfTest.inputArgs,
          expected: problem.perfTest.maxMs,
          maxMs: problem.perfTest.maxMs,
        }]
      : []),
  ];

  useEffect(() => {
    setCode(problem.starterCode);
    setShowSolution(false);
  }, [problem.id, problem.starterCode]);

  const fullyPassed = results !== null && results.length > 0 && results.every((r) => r.passed);

  useEffect(() => {
    if (fullyPassed) markSolved(problem.id);
  }, [fullyPassed, markSolved, problem.id]);

  const handleRun = () => {
    run(code, problem.functionName, allTestCases, problem.testHelperCode);
  };

  return (
    <>
      <ProblemHeader problem={problem} />
      <Alert severity="info" sx={{ mb: 2 }}>
        Стартовый код корректен, но медленный. Сделай его быстрее, не ломая правильность.
        {problem.perfTest && (
          <Box sx={{ mt: 0.5, fontSize: '0.85em' }}>
            <SpeedIcon fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Цель — уложиться в {problem.perfTest.maxMs}мс на большом входе.
          </Box>
        )}
      </Alert>
      <CodeEditor value={code} onChange={setCode} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap', mt: 2 }}>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={handleRun} disabled={running}>
            {running ? 'Выполняется...' : 'Запустить'}
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <HintsButton hints={problem.hints} hintIndex={hintIndex} onNext={() => showNext(problem.hints.length)} />
          <Button variant="outlined" color="secondary" startIcon={<VisibilityIcon />} onClick={() => setShowSolution((s) => !s)}>
            {showSolution ? 'Скрыть решение' : 'Показать решение'}
          </Button>
        </Box>
      </Box>
      <HintsDisplay hints={problem.hints} hintIndex={hintIndex} />
      {results && <TestResults results={results} testCases={allTestCases} />}
      <Collapse in={showSolution}>
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>Эффективное решение</Typography>
          <CodeBlock code={problem.solutionCode} />
        </Paper>
      </Collapse>
    </>
  );
}
