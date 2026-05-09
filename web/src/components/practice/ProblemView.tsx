import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
  const problem = problems.find((p) => p.id === problemId);

  if (!problem) return <Typography>Задача не найдена</Typography>;

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/topic/${slug}/practice`)} sx={{ mb: 2 }}>
        Назад к списку
      </Button>
      {isImplement(problem) && <ImplementProblemView problem={problem} />}
      {isPredictOutput(problem) && <PredictOutputView problem={problem} />}
      {isFindBug(problem) && <FindBugView problem={problem} />}
      {isRefactor(problem) && <RefactorView problem={problem} />}
    </Box>
  );
}
