import type { Problem } from '../../types/problem';

export const stacksQueuesProblems: Problem[] = [
  {
    id: 'sq-p1',
    topicId: 'stacks-queues',
    title: 'Валидные скобки',
    difficulty: 'easy',
    isContextual: false,
    description:
      'Дана строка `s`, содержащая только символы `(`, `)`, `{`, `}`, `[` и `]`. Определите, является ли строка валидной.\n\nСтрока валидна, если:\n- Каждая открывающая скобка имеет соответствующую закрывающую того же типа.\n- Скобки закрываются в правильном порядке.\n- Каждой закрывающей скобке соответствует открывающая того же типа.\n\nПустая строка считается валидной.',
    functionName: 'isValid',
    starterCode: `function isValid(s) {
  // Ваш код здесь
}`,
    testCases: [
      {
        id: 'sq-p1-t1',
        inputDisplay: 'isValid("()")',
        inputArgs: ['()'],
        expected: true,
      },
      {
        id: 'sq-p1-t2',
        inputDisplay: 'isValid("()[]{}")',
        inputArgs: ['()[]{}'],
        expected: true,
      },
      {
        id: 'sq-p1-t3',
        inputDisplay: 'isValid("(]")',
        inputArgs: ['(]'],
        expected: false,
      },
      {
        id: 'sq-p1-t4',
        inputDisplay: 'isValid("([)]")',
        inputArgs: ['([)]'],
        expected: false,
      },
      {
        id: 'sq-p1-t5',
        inputDisplay: 'isValid("{[]}")',
        inputArgs: ['{[]}'],
        expected: true,
      },
      {
        id: 'sq-p1-t6',
        inputDisplay: 'isValid("")',
        inputArgs: [''],
        expected: true,
      },
    ],
    hints: [
      'Используйте стек: при встрече открывающей скобки — кладите в стек, при закрывающей — извлекайте и сравнивайте.',
      'Создайте Map или объект для сопоставления закрывающих скобок с открывающими: ) → (, ] → [, } → {.',
      'Не забудьте проверить, что стек пуст в конце — иначе есть незакрытые скобки.',
    ],
    solutionCode: `function isValid(s) {
  const stack = [];
  const pairs = new Map([
    [')', '('],
    [']', '['],
    ['}', '{'],
  ]);

  for (const ch of s) {
    if (!pairs.has(ch)) {
      // Открывающая скобка — кладём в стек
      stack.push(ch);
    } else {
      // Закрывающая скобка — проверяем вершину стека
      if (stack.length === 0 || stack.pop() !== pairs.get(ch)) {
        return false;
      }
    }
  }

  return stack.length === 0;
}`,
  },
  {
    id: 'sq-p2',
    topicId: 'stacks-queues',
    title: 'Ежедневная температура',
    difficulty: 'medium',
    isContextual: false,
    description:
      'Дан массив целых чисел `temperatures`, где `temperatures[i]` — температура в i-й день. Верните массив `result`, где `result[i]` — количество дней, которое нужно подождать после i-го дня, чтобы наступил более тёплый день.\n\nЕсли нет будущего дня с более высокой температурой, `result[i] = 0`.',
    functionName: 'dailyTemperatures',
    starterCode: `function dailyTemperatures(temperatures) {
  // Ваш код здесь
}`,
    testCases: [
      {
        id: 'sq-p2-t1',
        inputDisplay: 'dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])',
        inputArgs: [[73, 74, 75, 71, 69, 72, 76, 73]],
        expected: [1, 1, 4, 2, 1, 1, 0, 0],
      },
      {
        id: 'sq-p2-t2',
        inputDisplay: 'dailyTemperatures([30, 40, 50, 60])',
        inputArgs: [[30, 40, 50, 60]],
        expected: [1, 1, 1, 0],
      },
      {
        id: 'sq-p2-t3',
        inputDisplay: 'dailyTemperatures([60, 50, 40, 30])',
        inputArgs: [[60, 50, 40, 30]],
        expected: [0, 0, 0, 0],
      },
      {
        id: 'sq-p2-t4',
        inputDisplay: 'dailyTemperatures([30, 30, 30])',
        inputArgs: [[30, 30, 30]],
        expected: [0, 0, 0],
      },
      {
        id: 'sq-p2-t5',
        inputDisplay: 'dailyTemperatures([50])',
        inputArgs: [[50]],
        expected: [0],
      },
    ],
    hints: [
      'Наивное решение O(n²): для каждого дня ищем ближайший более тёплый. Можно лучше.',
      'Используйте монотонный стек, хранящий индексы дней с убывающими температурами.',
      'Когда текущая температура выше, чем у дня на вершине стека — мы нашли ответ для того дня.',
      'Каждый индекс добавляется и извлекается из стека максимум один раз — сложность O(n).',
    ],
    solutionCode: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const result = new Array(n).fill(0);
  const stack = []; // монотонный стек индексов

  for (let i = 0; i < n; i++) {
    // Пока текущая температура выше, чем у дня на вершине стека
    while (
      stack.length > 0 &&
      temperatures[i] > temperatures[stack[stack.length - 1]]
    ) {
      const prevIndex = stack.pop();
      result[prevIndex] = i - prevIndex;
    }
    stack.push(i);
  }

  return result;
}`,
  },
  {
    id: 'sq-p3',
    topicId: 'stacks-queues',
    title: 'История просмотров объявлений',
    difficulty: 'medium',
    isContextual: true,
    description:
      'Пользователь просматривает объявления. Он начинает на главной странице (id = 0). Каждое действие — это либо переход на страницу объявления (`{ type: "visit", id: <число> }`), либо нажатие кнопки «Назад» (`{ type: "back" }`).\n\nНапишите функцию, которая принимает массив действий пользователя и возвращает id страницы, на которой пользователь окажется в итоге.\n\nПравила:\n- Начальная страница имеет id = 0.\n- `visit` — переход на новую страницу (кладёт её в историю).\n- `back` — возврат на предыдущую страницу (если история не пуста). Если возвращаться некуда (пользователь на главной), действие `back` игнорируется.\n\nВерните id текущей страницы после выполнения всех действий.',
    functionName: 'getCurrentPage',
    starterCode: `function getCurrentPage(actions) {
  // Ваш код здесь
}`,
    testCases: [
      {
        id: 'sq-p3-t1',
        inputDisplay:
          'getCurrentPage([{ type: "visit", id: 10 }, { type: "visit", id: 20 }])',
        inputArgs: [
          [
            { type: 'visit', id: 10 },
            { type: 'visit', id: 20 },
          ],
        ],
        expected: 20,
      },
      {
        id: 'sq-p3-t2',
        inputDisplay:
          'getCurrentPage([{ type: "visit", id: 10 }, { type: "visit", id: 20 }, { type: "back" }])',
        inputArgs: [
          [
            { type: 'visit', id: 10 },
            { type: 'visit', id: 20 },
            { type: 'back' },
          ],
        ],
        expected: 10,
      },
      {
        id: 'sq-p3-t3',
        inputDisplay:
          'getCurrentPage([{ type: "visit", id: 5 }, { type: "back" }, { type: "back" }])',
        inputArgs: [
          [
            { type: 'visit', id: 5 },
            { type: 'back' },
            { type: 'back' },
          ],
        ],
        expected: 0,
      },
      {
        id: 'sq-p3-t4',
        inputDisplay: 'getCurrentPage([{ type: "back" }, { type: "back" }])',
        inputArgs: [[{ type: 'back' }, { type: 'back' }]],
        expected: 0,
      },
      {
        id: 'sq-p3-t5',
        inputDisplay:
          'getCurrentPage([{ type: "visit", id: 1 }, { type: "visit", id: 2 }, { type: "visit", id: 3 }, { type: "back" }, { type: "back" }, { type: "visit", id: 4 }])',
        inputArgs: [
          [
            { type: 'visit', id: 1 },
            { type: 'visit', id: 2 },
            { type: 'visit', id: 3 },
            { type: 'back' },
            { type: 'back' },
            { type: 'visit', id: 4 },
          ],
        ],
        expected: 4,
      },
    ],
    hints: [
      'Используйте стек для хранения истории страниц. Начните со стека, содержащего только 0 (главная страница).',
      'При visit — кладём id новой страницы на вершину стека.',
      'При back — извлекаем верхний элемент стека, но только если в стеке больше одного элемента (нельзя уйти «дальше» главной).',
      'Текущая страница — это всегда вершина стека.',
    ],
    solutionCode: `function getCurrentPage(actions) {
  const stack = [0]; // начинаем на главной странице

  for (const action of actions) {
    if (action.type === 'visit') {
      stack.push(action.id);
    } else if (action.type === 'back') {
      // Возвращаемся, только если есть куда
      if (stack.length > 1) {
        stack.pop();
      }
    }
  }

  // Текущая страница — вершина стека
  return stack[stack.length - 1];
}`,
  },
];
