import { useState, useMemo, useCallback } from 'react';
import { Inline } from '../../utils/renderInline';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Chip,
  LinearProgress,
} from '@mui/material';

type Pattern =
  | 'binary-search'
  | 'two-pointers'
  | 'sliding-window'
  | 'hash-map'
  | 'stacks-queues'
  | 'trees';

interface Problem {
  description: string;
  correctAnswer: Pattern;
  explanation: string;
}

const PATTERN_LABELS: Record<Pattern, string> = {
  'binary-search': 'Бинарный поиск',
  'two-pointers': 'Два указателя',
  'sliding-window': 'Скользящее окно',
  'hash-map': 'Хеш-таблицы',
  'stacks-queues': 'Стеки и очереди',
  'trees': 'Обход деревьев',
};

const PROBLEMS: Problem[] = [
  {
    description:
      'Дан отсортированный массив уникальных целых чисел и целевое значение. Нужно найти индекс элемента или определить, что его нет, за время лучше O(n). Массив может содержать до 10^6 элементов.',
    correctAnswer: 'binary-search',
    explanation:
      'Массив отсортирован и нужно найти элемент быстрее O(n) — классическая задача на бинарный поиск за O(log n).',
  },
  {
    description:
      'Дан массив цен на товары в каталоге. Нужно найти две цены, сумма которых равна заданному бюджету. Массив отсортирован по возрастанию, решение должно работать за O(n) по времени и O(1) по памяти.',
    correctAnswer: 'two-pointers',
    explanation:
      'Отсортированный массив, ищем пару с заданной суммой, требование O(1) памяти — два указателя с краёв массива, сдвигая левый или правый в зависимости от суммы.',
  },
  {
    description:
      'Сервис аналитики X логирует временные метки запросов. Нужно найти максимальное количество запросов за любое непрерывное окно в K секунд. Временные метки идут в хронологическом порядке.',
    correctAnswer: 'sliding-window',
    explanation:
      'Непрерывное окно фиксированного размера K по отсортированным данным — классическое скользящее окно.',
  },
  {
    description:
      'В сервисе пользователи могут ставить теги на объявления. Дан массив строк-тегов, нужно найти первый тег, который встречается ровно один раз. Решение за один проход по массиву.',
    correctAnswer: 'hash-map',
    explanation:
      'Подсчёт частот элементов за один проход — типичная задача на хеш-таблицу для хранения счётчиков.',
  },
  {
    description:
      'Сервис валидирует шаблоны описаний объявлений. Шаблон может содержать вложенные скобки разных типов: (), [], {}. Нужно проверить, что все скобки правильно сбалансированы и вложены.',
    correctAnswer: 'stacks-queues',
    explanation:
      'Проверка баланса вложенных скобок — каноническая задача на стек: открывающую кладём в стек, при закрывающей проверяем вершину.',
  },
  {
    description:
      'Дан отсортированный массив, в котором каждый элемент встречается дважды, кроме одного. Найти уникальный элемент за O(log n) по времени. Массив может содержать до 10^5 элементов.',
    correctAnswer: 'binary-search',
    explanation:
      'Несмотря на то что можно решить через XOR или хеш-таблицу, требование O(log n) на отсортированном массиве указывает на бинарный поиск по чётности индексов пар.',
  },
  {
    description:
      'Модерация проверяет тексты объявлений. Дана строка, нужно определить, является ли она палиндромом, игнорируя пробелы и регистр. Решение должно работать за O(1) дополнительной памяти.',
    correctAnswer: 'two-pointers',
    explanation:
      'Проверка палиндрома с O(1) памяти — два указателя: один с начала, другой с конца строки, двигаются навстречу друг другу.',
  },
  {
    description:
      'В системе рекомендаций нужно найти самую длинную непрерывную подстроку без повторяющихся символов в строке запроса пользователя. Строка может содержать любые ASCII-символы.',
    correctAnswer: 'sliding-window',
    explanation:
      'Поиск максимальной подстроки без повторов — скользящее окно переменной длины с хеш-множеством для отслеживания символов в текущем окне.',
  },
  {
    description:
      'Дан массив ID объявлений и целевая сумма. Нужно найти два индекса таких, что значения по этим индексам дают целевую сумму. Массив НЕ отсортирован, каждый элемент уникален. Решение за O(n).',
    correctAnswer: 'hash-map',
    explanation:
      'Неотсортированный массив исключает два указателя. Хеш-таблица позволяет за O(n) для каждого элемента проверить, есть ли дополнение до целевой суммы.',
  },
  {
    description:
      'Сервис обрабатывает историю навигации пользователя по каталогу (вперёд/назад). При переходе вперёд текущая страница сохраняется, при переходе назад — возвращаемся к предыдущей. Нужно реализовать эффективную навигацию с поддержкой обеих операций за O(1).',
    correctAnswer: 'stacks-queues',
    explanation:
      'Навигация вперёд/назад — классическая задача на два стека: один для истории назад, другой для истории вперёд.',
  },
  {
    description:
      'Есть отсортированный по рейтингу массив продавцов. Нужно найти первого продавца, чей рейтинг больше или равен заданному порогу, чтобы показать его в топе выдачи. Массив может содержать миллионы записей.',
    correctAnswer: 'binary-search',
    explanation:
      'Поиск первого элемента >= порога в отсортированном массиве — задача на бинарный поиск левой границы (lower bound).',
  },
  {
    description:
      'Система антифрода получает поток событий. Нужно в реальном времени отслеживать медиану значений в скользящем окне последних N событий. При добавлении нового события самое старое удаляется.',
    correctAnswer: 'stacks-queues',
    explanation:
      'Поддержание медианы в потоке данных эффективно решается через две кучи (приоритетные очереди): max-heap для нижней половины и min-heap для верхней.',
  },
  {
    description:
      'Дана конфигурация в формате вложенного JSON-объекта с произвольной глубиной. У каждого узла есть поле type и необязательный массив children. Нужно собрать все узлы определённого типа в порядке следования.',
    correctAnswer: 'trees',
    explanation:
      'Вложенная структура с children и произвольная глубина — классический обход дерева (DFS). Рекурсивно проходим по всем узлам, собирая подходящие.',
  },
  {
    description:
      'В сервисе категории товаров организованы иерархически: каждая категория может содержать подкатегории. Нужно построить «хлебные крошки» (breadcrumb) — путь от корня до каждой категории. Глубина вложенности произвольная.',
    correctAnswer: 'trees',
    explanation:
      'Иерархическая структура с подкатегориями — это дерево. Для построения пути используем DFS, передавая текущий путь как параметр рекурсии.',
  },
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const PATTERN_KEYS = Object.keys(PATTERN_LABELS) as Pattern[];

export default function PatternGamePage() {
  const [questions, setQuestions] = useState(() => shuffle(PROBLEMS));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<Pattern | null>(null);
  const [finished, setFinished] = useState(false);

  const total = questions.length;
  const question = questions[current];

  const handleSelect = useCallback(
    (pattern: Pattern) => {
      if (selected !== null) return;
      setSelected(pattern);
      if (pattern === question.correctAnswer) {
        setScore((s) => s + 1);
      }
    },
    [selected, question],
  );

  const handleNext = useCallback(() => {
    if (current + 1 >= total) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  }, [current, total]);

  const handleRestart = useCallback(() => {
    setQuestions(shuffle(PROBLEMS));
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  }, []);

  const isCorrect = useMemo(
    () => selected === question?.correctAnswer,
    [selected, question],
  );

  if (finished) {
    return (
      <Paper sx={{ p: { xs: 3, md: 4 }, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Результат
        </Typography>
        <Typography variant="h2" color="primary" gutterBottom>
          {score} / {total}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {score === total
            ? 'Превосходно! Вы безошибочно определяете паттерны!'
            : score >= total * 0.8
              ? 'Отличный результат! Осталось закрепить пару нюансов.'
              : score >= total * 0.5
                ? 'Неплохо, но стоит повторить отличия паттернов.'
                : 'Рекомендуем ещё раз пройти теорию по каждому паттерну.'}
        </Typography>
        <Button variant="contained" onClick={handleRestart}>
          Пройти заново
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Вопрос {current + 1} из {total}
        </Typography>
        <Chip label={`Счёт: ${score}`} size="small" color="primary" />
      </Box>

      <LinearProgress
        variant="determinate"
        value={((current + 1) / total) * 100}
        sx={{ mb: 3, borderRadius: 1 }}
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Определите паттерн
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
          {question.description}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {PATTERN_KEYS.map((key) => {
            const isChosen = selected === key;
            const isAnswer = key === question.correctAnswer;

            let color: 'primary' | 'success' | 'error' | 'inherit' = 'primary';
            let variant: 'contained' | 'outlined' = 'outlined';

            if (selected !== null) {
              if (isAnswer) {
                color = 'success';
                variant = 'contained';
              } else if (isChosen && !isCorrect) {
                color = 'error';
                variant = 'contained';
              } else {
                color = 'inherit';
              }
            }

            return (
              <Button
                key={key}
                variant={variant}
                color={color}
                onClick={() => handleSelect(key)}
                disabled={selected !== null && !isChosen && !isAnswer}
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                {PATTERN_LABELS[key]}
              </Button>
            );
          })}
        </Box>
      </Paper>

      {selected !== null && (
        <>
          <Alert severity={isCorrect ? 'success' : 'error'} sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              {isCorrect ? 'Правильно!' : `Неправильно. Верный ответ: ${PATTERN_LABELS[question.correctAnswer]}`}
            </Typography>
            <Typography variant="body2"><Inline>{question.explanation}</Inline></Typography>
          </Alert>

          <Box sx={{ textAlign: 'right' }}>
            <Button variant="contained" onClick={handleNext}>
              {current + 1 >= total ? 'Результаты' : 'Далее'}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
