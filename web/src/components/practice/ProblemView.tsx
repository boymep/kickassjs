import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Chip, Collapse, Alert, IconButton } from '@mui/material';
import Markdown from 'react-markdown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CodeEditor from './CodeEditor';
import TestResults from './TestResults';
import CodeBlock from '../theory/CodeBlock';
import { useCodeRunner } from '../../hooks/useCodeRunner';
import { getProblems } from '../../data/problems';

export default function ProblemView() {
  const { slug, problemId } = useParams<{ slug: string; problemId: string }>();
  const navigate = useNavigate();
  const problems = getProblems(slug ?? '');
  const problem = problems.find((p) => p.id === problemId);

  const [code, setCode] = useState(problem?.starterCode ?? '');
  const [hintIndex, setHintIndex] = useState(-1);
  const [showSolution, setShowSolution] = useState(false);
  const { results, running, run } = useCodeRunner();

  if (!problem) return <Typography>Задача не найдена</Typography>;

  const handleRun = () => {
    run(code, problem.functionName, problem.testCases);
  };

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/topic/${slug}/practice`)} sx={{ mb: 2 }}>
        Назад к списку
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h5">{problem.title}</Typography>
          <Chip
            label={problem.difficulty === 'easy' ? 'Easy' : 'Medium'}
            color={problem.difficulty === 'easy' ? 'success' : 'warning'}
            size="small"
          />
          {problem.isContextual && (
            <Chip label="Прикладная" color="info" size="small" variant="outlined" />
          )}
        </Box>
        <Box sx={{ '& p': { mt: 0, mb: 1 }, '& code': { backgroundColor: 'action.hover', px: 0.5, borderRadius: 0.5, fontFamily: 'monospace', fontSize: '0.9em' } }}>
          <Markdown>{problem.description.replace(/ -- /g, ' — ')}</Markdown>
        </Box>
      </Paper>

      <CodeEditor value={code} onChange={setCode} />

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<PlayArrowIcon />}
          onClick={handleRun}
          disabled={running}
        >
          {running ? 'Выполняется...' : 'Запустить'}
        </Button>
        {problem.hints.length > 0 && (
          <Button
            variant="outlined"
            startIcon={<LightbulbIcon />}
            onClick={() => setHintIndex((i) => Math.min(i + 1, problem.hints.length - 1))}
            disabled={hintIndex >= problem.hints.length - 1}
          >
            Подсказка {hintIndex >= 0 ? `(${hintIndex + 1}/${problem.hints.length})` : ''}
          </Button>
        )}
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<VisibilityIcon />}
          onClick={() => setShowSolution(!showSolution)}
        >
          {showSolution ? 'Скрыть решение' : 'Показать решение'}
        </Button>
      </Box>

      {hintIndex >= 0 && (
        <Box sx={{ mt: 2 }}>
          {problem.hints.slice(0, hintIndex + 1).map((hint, i) => (
            <Alert key={i} severity="info" sx={{ mb: 1 }}>
              Подсказка {i + 1}: {hint}
            </Alert>
          ))}
        </Box>
      )}

      <Collapse in={showSolution}>
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Решение
          </Typography>
          <CodeBlock code={problem.solutionCode} />
        </Paper>
      </Collapse>

      {results && <TestResults results={results} testCases={problem.testCases} />}
    </Box>
  );
}
