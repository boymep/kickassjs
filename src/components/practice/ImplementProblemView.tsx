import { useEffect, useState } from 'react';
import { Box, Button, Collapse, Paper, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CodeEditor from './CodeEditor';
import TestResults from './TestResults';
import CodeBlock from '../theory/CodeBlock';
import { HintsButton, HintsDisplay } from './HintsPanel';
import ProblemHeader from './ProblemHeader';
import { useCodeRunner } from '../../hooks/useCodeRunner';
import { useHints } from '../../hooks/useHints';
import type { ImplementProblem } from '../../types/problem';
import { useProgress } from '../../hooks/useProgress';

interface ImplementProblemViewProps {
  problem: ImplementProblem;
}

export default function ImplementProblemView({ problem }: ImplementProblemViewProps) {
  const [code, setCode] = useState(problem.starterCode);
  const [showSolution, setShowSolution] = useState(false);
  const { results, running, run } = useCodeRunner(problem.id);
  const { markSolved } = useProgress(problem.topicId);
  const { hintIndex, showNext } = useHints(problem.id);

  useEffect(() => {
    setCode(problem.starterCode);
    setShowSolution(false);
  }, [problem.id, problem.starterCode]);

  useEffect(() => {
    if (results && results.length > 0 && results.every((r) => r.passed)) {
      markSolved(problem.id);
    }
  }, [results, markSolved, problem.id]);

  const handleRun = () => {
    run(code, problem.functionName, problem.testCases, problem.testHelperCode);
  };

  return (
    <>
      <ProblemHeader problem={problem} />
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
      <Collapse in={showSolution}>
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>Решение</Typography>
          <CodeBlock code={problem.solutionCode} />
        </Paper>
      </Collapse>
      {results && <TestResults results={results} testCases={problem.testCases} />}
    </>
  );
}
