import { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import Stack from "./Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ReplayIcon from "@mui/icons-material/Replay";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import type { QuizQuestion } from "../../types/quiz";
import QuestionRenderer, { shuffleOptions } from "./QuestionRenderer";

interface FinalQuizProps {
  questions: QuizQuestion[];
}

type AnswerState = "correct" | "wrong" | undefined;

export default function FinalQuiz({ questions }: FinalQuizProps) {
  const [current, setCurrent] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<AnswerState[]>(() =>
    Array(questions.length).fill(undefined),
  );
  const [done, setDone] = useState(false);
  const [weakOnly, setWeakOnly] = useState(false);
  const [weakIds, setWeakIds] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const activeSet = useMemo(() => {
    if (!weakOnly) return questions;
    return questions.filter((q) => weakIds.has(q.id));
  }, [questions, weakOnly, weakIds]);

  const shuffled = useMemo(() => activeSet.map(shuffleOptions), [activeSet]);

  const scrollToQuiz = () => {
    if (!containerRef.current) return;
    const top =
      containerRef.current.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const total = shuffled.length;
  if (total === 0) return null;

  if (done) {
    const correctCount = results.filter((r) => r === "correct").length;
    const answeredCount = results.filter((r) => r !== undefined).length;
    const wrongCount = answeredCount - correctCount;
    const percent =
      answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    const isPerfect = wrongCount === 0 && answeredCount > 0;
    const resultColor = isPerfect
      ? "success"
      : percent >= 70
        ? "warning"
        : "error";
    const resultLabel = isPerfect
      ? "Идеальный результат!"
      : percent >= 70
        ? "Хороший результат"
        : "Есть куда расти";

    return (
      <Paper sx={{ p: { xs: 3, sm: 5 }, textAlign: "center" }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: `${resultColor}.main`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2.5,
          }}
        >
          <EmojiEventsIcon sx={{ fontSize: 44, color: "white" }} />
        </Box>

        <Typography variant='h5' sx={{ fontWeight: 600 }} gutterBottom>
          {resultLabel}
        </Typography>

        <Typography
          variant='h2'
          sx={{ fontWeight: 700, lineHeight: 1.1 }}
          color={`${resultColor}.main`}
        >
          {correctCount}/{answeredCount}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          правильных ответов
        </Typography>

        <Box sx={{ maxWidth: 240, mx: "auto", mb: 4 }}>
          <LinearProgress
            variant='determinate'
            value={percent}
            color={resultColor}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Stack direction='row' spacing={2} justifyContent='center'>
          {wrongCount > 0 && (
            <Button
              variant='contained'
              color='error'
              startIcon={<ReplayIcon />}
              onClick={() => {
                const wrongIds = new Set<string>();
                shuffled.forEach((q, i) => {
                  if (results[i] === "wrong") wrongIds.add(q.id);
                });
                setWeakIds(wrongIds);
                setWeakOnly(true);
                setCurrent(0);
                setAnswered(false);
                setResults(Array(wrongIds.size).fill(undefined));
                setDone(false);
              }}
            >
              Повторить слабые ({wrongCount})
            </Button>
          )}
          <Button
            variant='outlined'
            startIcon={<ReplayIcon />}
            onClick={() => {
              setWeakOnly(false);
              setCurrent(0);
              setAnswered(false);
              setResults(Array(questions.length).fill(undefined));
              setDone(false);
            }}
          >
            Начать заново
          </Button>
        </Stack>
      </Paper>
    );
  }

  const question = shuffled[current];
  if (!question) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant='h6' gutterBottom>
          Все вопросы решены верно
        </Typography>
        <Button
          variant='outlined'
          onClick={() => {
            setWeakOnly(false);
            setResults(Array(questions.length).fill(undefined));
            setCurrent(0);
          }}
        >
          Начать заново
        </Button>
      </Paper>
    );
  }

  const handleAnswer = (correct: boolean) => {
    setAnswered(true);
    setResults((prev) => {
      const copy = [...prev];
      copy[current] = correct ? "correct" : "wrong";
      return copy;
    });
  };

  const goTo = (idx: number) => {
    if (idx < 0 || idx >= total) return;
    setCurrent(idx);
    setAnswered(results[idx] !== undefined);
    scrollToQuiz();
  };

  const handleNext = () => {
    if (current + 1 >= total) {
      setDone(true);
      scrollToQuiz();
      return;
    }
    goTo(current + 1);
  };

  const handlePrev = () => goTo(current - 1);

  const answeredCount = results.filter((r) => r !== undefined).length;
  const allAnswered = answeredCount === total;

  return (
    <Box ref={containerRef}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant='body2' color='text.secondary'>
            {weakOnly
              ? "Повторение слабых"
              : `Вопрос ${current + 1} из ${total}`}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Правильно: {answeredCount} / {total}
          </Typography>
        </Box>
        <LinearProgress
          variant='determinate'
          value={(answeredCount / total) * 100}
          sx={{ borderRadius: 1 }}
        />
      </Box>

      {/* Jump strip */}
      <Box
        sx={{
          display: "flex",
          gap: 0.75,
          flexWrap: "wrap",
          mb: 3,
          p: 1.25,
          borderRadius: 2,
          backgroundColor: (t) =>
            t.palette.mode === "dark"
              ? "rgba(255,255,255,0.03)"
              : "rgba(0,0,0,0.025)",
        }}
      >
        {shuffled.map((q, i) => {
          const r = results[i];
          const isActive = i === current;
          const bg =
            r === "correct"
              ? "success.main"
              : r === "wrong"
                ? "error.main"
                : isActive
                  ? "primary.main"
                  : "transparent";
          const color =
            r !== undefined || isActive ? "white" : "text.secondary";
          const border =
            isActive && r === undefined ? "2px solid" : "1px solid";
          const borderColor =
            r !== undefined ? bg : isActive ? "primary.main" : "divider";
          return (
            <Tooltip
              key={q.id}
              title={
                r === "correct"
                  ? "Верно"
                  : r === "wrong"
                    ? "Неверно"
                    : `Вопрос ${i + 1}`
              }
              arrow
              disableInteractive
            >
              <Box
                onClick={() => goTo(i)}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  bgcolor: bg,
                  color,
                  border,
                  borderColor,
                  transition: "transform 0.1s",
                  "&:hover": { transform: "scale(1.1)" },
                }}
              >
                {r === "correct" ? (
                  <CheckIcon sx={{ fontSize: 18 }} />
                ) : r === "wrong" ? (
                  <CloseIcon sx={{ fontSize: 18 }} />
                ) : (
                  i + 1
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      <QuestionRenderer
        question={question}
        answered={answered}
        onAnswer={handleAnswer}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1.5,
          mt: 3,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          disabled={current === 0}
          onClick={handlePrev}
          variant='outlined'
        >
          Назад
        </Button>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          {allAnswered && (
            <Button
              variant='contained'
              color='success'
              onClick={() => {
                setDone(true);
                scrollToQuiz();
              }}
            >
              Завершить
            </Button>
          )}
          {!allAnswered && answered && (
            <Button
              variant='contained'
              endIcon={<ArrowForwardIcon />}
              onClick={handleNext}
            >
              {current + 1 === total ? "Завершить" : "Следующий"}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
