import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Chip,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getProblems } from "../../data/problems";
import {
  getProblemKind,
  type Problem,
  type ProblemKind,
} from "../../types/problem";
import { useProgress } from "../../hooks/useProgress";

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

const KIND_LABEL: Record<ProblemKind, string> = {
  implement: "Реализовать",
  "predict-output": "Определить вывод",
  "find-bug": "Найти баг",
  refactor: "Оптимизировать",
};

const DIFFICULTY_ORDER: Problem["difficulty"][] = ["easy", "medium", "hard"];

export default function PracticePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const problems = getProblems(slug ?? "");
  const { isSolved } = useProgress(slug ?? "");

  if (problems.length === 0) {
    return <Typography>Задачи не найдены</Typography>;
  }

  const groups = DIFFICULTY_ORDER.map((diff) => ({
    difficulty: diff,
    problems: problems.filter((p) => p.difficulty === diff),
  })).filter((g) => g.problems.length > 0);

  const renderProblemRow = (p: Problem) => {
    const kind = getProblemKind(p);
    const solved = isSolved(p.id);
    return (
      <ListItemButton
        key={p.id}
        onClick={() => navigate(`/topic/${slug}/practice/${p.id}`)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 1.5 }}>
          <CheckCircleIcon
            fontSize="small"
            sx={{ color: solved ? "success.main" : "action.disabled" }}
          />
        </Box>
        <ListItemText
          primary={p.title}
          secondary={
            p.description.slice(0, 110) +
            (p.description.length > 110 ? "…" : "")
          }
        />
        <Box sx={{ display: "flex", gap: 1, ml: 2, flexShrink: 0, flexWrap: "wrap" }}>
          {kind !== "implement" && (
            <Chip label={KIND_LABEL[kind]} color="primary" size="small" variant="outlined" />
          )}
          {p.isContextual && (
            <Chip label="Прикладная" size="small" variant="outlined" color="info" />
          )}
        </Box>
      </ListItemButton>
    );
  };

  return (
    <Box sx={{ pb: 4 }}>
      {groups.map((group, gi) => (
        <Box key={group.difficulty} sx={{ mb: gi < groups.length - 1 ? 3 : 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
            <Chip
              label={DIFFICULTY_LABEL[group.difficulty]}
              color={DIFFICULTY_COLOR[group.difficulty]}
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              {group.problems.length} {group.problems.length === 1 ? "задача" : "задач"}
            </Typography>
          </Box>
          <Paper>
            <List disablePadding>
              {group.problems.map((p, idx) => (
                <Box key={p.id}>
                  {idx > 0 && <Divider component="li" />}
                  {renderProblemRow(p)}
                </Box>
              ))}
            </List>
          </Paper>
        </Box>
      ))}
    </Box>
  );
}
