import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ImplementProblemView from './ImplementProblemView';
import PredictOutputView from './PredictOutputView';
import FindBugView from './FindBugView';
import RefactorView from './RefactorView';
import { getProblems } from '../../data/problems';
import type {
  FindBugProblem,
  ImplementProblem,
  PredictOutputProblem,
  Problem,
  RefactorProblem,
} from '../../types/problem';

function isImplement(p: Problem): p is ImplementProblem {
  return p.kind === undefined || p.kind === 'implement';
}
function isPredictOutput(p: Problem): p is PredictOutputProblem {
  return p.kind === 'predict-output';
}
function isFindBug(p: Problem): p is FindBugProblem {
  return p.kind === 'find-bug';
}
function isRefactor(p: Problem): p is RefactorProblem {
  return p.kind === 'refactor';
}

export default function ProblemView() {
  const { slug, problemId } = useParams<{ slug: string; problemId: string }>();
  const navigate = useNavigate();
  const problems = getProblems(slug ?? '');
  const idx = problems.findIndex((p) => p.id === problemId);
  const problem = idx >= 0 ? problems[idx] : undefined;
  const prev = idx > 0 ? problems[idx - 1] : null;
  const next = idx >= 0 && idx < problems.length - 1 ? problems[idx + 1] : null;

  if (!problem) return <Typography>Задача не найдена</Typography>;

  const goTo = (id: string) => navigate(`/topic/${slug}/practice/${id}`);

  const navBar = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/topic/${slug}/practice`)}
      >
        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>К списку</Box>
      </Button>
      <Box sx={{ flex: 1 }} />
      <Button
        startIcon={<ArrowBackIosNewIcon />}
        disabled={!prev}
        onClick={() => prev && goTo(prev.id)}
        size="small"
      >
        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Предыдущая</Box>
      </Button>
      <Typography variant="body2" color="text.secondary" sx={{ px: 0.5 }}>
        {idx + 1} / {problems.length}
      </Typography>
      <Button
        endIcon={<ArrowForwardIosIcon />}
        disabled={!next}
        onClick={() => next && goTo(next.id)}
        size="small"
      >
        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Следующая</Box>
      </Button>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ mb: 3 }}>{navBar}</Box>
      {isImplement(problem) && <ImplementProblemView problem={problem} />}
      {isPredictOutput(problem) && <PredictOutputView problem={problem} />}
      {isFindBug(problem) && <FindBugView problem={problem} />}
      {isRefactor(problem) && <RefactorView problem={problem} />}
    </Box>
  );
}
