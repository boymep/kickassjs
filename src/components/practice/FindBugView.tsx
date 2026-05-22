import { useEffect, useState } from 'react';
import { Alert, Box, Button, Collapse, Paper, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CodeEditor from './CodeEditor';
import TestResults from './TestResults';
import CodeBlock from '../theory/CodeBlock';
import { HintsButton, HintsDisplay } from './HintsPanel';
import ProblemHeader from './ProblemHeader';
import { useCodeRunner } from '../../hooks/useCodeRunner';
import { useHints } from '../../hooks/useHints';
import type { FindBugProblem } from '../../types/problem';
import { useProgress } from '../../hooks/useProgress';

interface FindBugViewProps {
  problem: FindBugProblem;
}

export default function FindBugView({ problem }: FindBugViewProps) {
  const [code, setCode] = useState(problem.buggyCode);
  const [showSolution, setShowSolution] = useState(false);
  const { results, running, run } = useCodeRunner(problem.id);
  const { markSolved } = useProgress(problem.topicId);
  const { hintIndex, showNext } = useHints(problem.id);

  useEffect(() => {
    setCode(problem.buggyCode);
    setShowSolution(false);
  }, [problem.id, problem.buggyCode]);

  const allPassed = results !== null && results.length > 0 && results.every((r) => r.passed);

  useEffect(() => {
    if (allPassed) markSolved(problem.id);
  }, [allPassed, markSolved, problem.id]);

  const handleRun = () => {
    run(code, problem.functionName, problem.testCases, problem.testHelperCode);
  };

  return (
    <>
      <ProblemHeader problem={problem} />
      <Alert severity="warning" sx={{ mb: 2 }}>
        В коде ниже спрятан баг — код пройдёт лишь часть тестов. Найдите и почини.
      </Alert>
      <CodeEditor value={code} onChange={setCode} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap', mt: 2 }}>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={handleRun} disabled={running}>
            {running ? 'Выполняется...' : 'Запустить'}
          </Button>
          <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={() => setCode(problem.buggyCode)}>
            Сбросить
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <HintsButton hints={problem.hints} hintIndex={hintIndex} onNext={() => showNext(problem.hints.length)} />
          <Button variant="outlined" color="secondary" startIcon={<VisibilityIcon />} onClick={() => setShowSolution((s) => !s)}>
            {showSolution ? 'Скрыть разбор' : 'Показать разбор'}
          </Button>
        </Box>
      </Box>
      <HintsDisplay hints={problem.hints} hintIndex={hintIndex} />
      {results && <TestResults results={results} testCases={problem.testCases} />}
      {allPassed && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <strong>Готово.</strong> {problem.bugSummary}
        </Alert>
      )}
      <Collapse in={showSolution}>
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>Что было не так</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>{problem.bugSummary}</Typography>
          <Typography variant="h6" gutterBottom>Чистая версия</Typography>
          <CodeBlock code={problem.solutionCode} />
        </Paper>
      </Collapse>
    </>
  );
}
