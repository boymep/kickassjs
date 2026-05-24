import { Box, Chip, Paper, Typography } from "@mui/material";
import Markdown from "react-markdown";
import type { Problem } from "../../types/problem";
import { getProblemKind } from "../../types/problem";

const KIND_LABEL: Record<NonNullable<Problem["kind"]>, string> = {
  implement: "Реализовать",
  "predict-output": "Что выведет код?",
  "find-bug": "Найти баг",
  refactor: "Оптимизировать",
};

const DIFFICULTY_LABEL: Record<Problem["difficulty"], string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

const DIFFICULTY_COLOR: Record<
  Problem["difficulty"],
  "success" | "warning" | "error"
> = {
  easy: "success",
  medium: "warning",
  hard: "error",
};

interface ProblemHeaderProps {
  problem: Problem;
}

/** Shared title/description block reused by all four practice view kinds. */
export default function ProblemHeader({ problem }: ProblemHeaderProps) {
  const kind = getProblemKind(problem);
  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 }, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant='h5' sx={{ mr: 1 }}>
          {problem.title}
        </Typography>
        <Chip
          label={DIFFICULTY_LABEL[problem.difficulty]}
          color={DIFFICULTY_COLOR[problem.difficulty]}
          size='small'
        />
        <Chip
          label={KIND_LABEL[kind]}
          size='small'
          color='primary'
          variant='outlined'
        />
        {problem.isContextual && (
          <Chip
            label='Прикладная'
            color='info'
            size='small'
            variant='outlined'
          />
        )}
      </Box>
      <Box
        sx={{
          "& p": { mt: 0, mb: 1.5, '&:last-child': { mb: 0 } },
          "& code": {
            backgroundColor: "action.hover",
            px: 0.5,
            borderRadius: 0.5,
            fontFamily: "monospace",
            fontSize: "0.9em",
          },
        }}
      >
        <Markdown>{problem.description.replace(/ -- /g, " — ")}</Markdown>
      </Box>
    </Paper>
  );
}
