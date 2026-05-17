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
      'Какая структура данных естественно отражает вложенность — «последний открытый должен закрыться первым»?',
      'Как понять, что закрывающая скобка соответствует именно той открывающей, которая стоит последней?',
      'Что нужно проверить после обхода всей строки?',
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
      'Наивное решение O(n²) работает, но медленно. Как избежать повторного просмотра элементов?',
      'Подумайте: когда именно становится известен ответ для конкретного дня?',
      'Какое свойство должен поддерживать стек при добавлении новых элементов — и зачем?',
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
      'Какая структура данных отражает идею «вернуться назад» — то есть всегда доступна последняя посещённая страница?',
      'Как при операции `back` не выйти за пределы истории?',
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
  {
    id: 'sq-p4',
    topicId: 'stacks-queues',
    title: 'Валидация вложенных тегов',
    difficulty: 'medium',
    isContextual: true,
    description:
      'В простом HTML-подобном шаблоне есть открывающие теги вида `<div>` и закрывающие `</div>`. Дана строка с тегами. Проверьте, правильно ли они вложены (каждый открывающий тег закрыт соответствующим, порядок вложенности корректен). Вернуть true/false.\n\nДопустимые теги: `div`, `span`, `a`, `b`, `p`. Атрибутов и самозакрывающихся тегов нет. Текст между тегами игнорируется.\n\nПример:\n`"<div><span></span></div>"` → true\n`"<div><span></div></span>"` → false',
    functionName: 'validateTags',
    starterCode: `function validateTags(html) {
  // ваш код
}`,
    testCases: [
      {
        id: 'sq-p4-t1',
        inputDisplay: 'validateTags("<div><span></span></div>")',
        inputArgs: ['<div><span></span></div>'],
        expected: true,
      },
      {
        id: 'sq-p4-t2',
        inputDisplay: 'validateTags("<div><span></div></span>")',
        inputArgs: ['<div><span></div></span>'],
        expected: false,
      },
      {
        id: 'sq-p4-t3',
        inputDisplay: 'validateTags("<a></a><b></b>")',
        inputArgs: ['<a></a><b></b>'],
        expected: true,
      },
      {
        id: 'sq-p4-t4',
        inputDisplay: 'validateTags("<div>")',
        inputArgs: ['<div>'],
        expected: false,
      },
      {
        id: 'sq-p4-t5',
        inputDisplay: 'validateTags("")',
        inputArgs: [''],
        expected: true,
      },
    ],
    hints: [
      'Как отличить открывающий тег от закрывающего? Какая структура данных подходит для отслеживания незакрытых тегов?',
      'Что нужно проверить при встрече закрывающего тега — и что считается ошибкой?',
    ],
    solutionCode: `function validateTags(html) {
  const stack = [];
  const regex = /<\\/?([a-z]+)>/g;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];

    if (fullTag.startsWith('</')) {
      // Закрывающий тег
      if (stack.length === 0 || stack.pop() !== tagName) {
        return false;
      }
    } else {
      // Открывающий тег
      stack.push(tagName);
    }
  }

  return stack.length === 0;
}`,
  },
  {
    id: 'sq-p5',
    topicId: 'stacks-queues',
    title: 'Отмена действий (Undo)',
    difficulty: 'easy',
    isContextual: true,
    description:
      'В текстовом редакторе пользователь выполняет действия. Каждое действие — это либо `{ type: "write", text: string }` (добавить текст в конец), либо `{ type: "undo" }` (отменить последнее write). Верните итоговую строку после выполнения всех действий.\n\nЕсли undo вызвано когда нечего отменять — игнорируется.',
    functionName: 'applyActions',
    starterCode: `function applyActions(actions) {
  // ваш код
}`,
    testCases: [
      {
        id: 'sq-p5-t1',
        inputDisplay:
          'applyActions([{type:"write",text:"hello"},{type:"write",text:" world"},{type:"undo"}])',
        inputArgs: [
          [
            { type: 'write', text: 'hello' },
            { type: 'write', text: ' world' },
            { type: 'undo' },
          ],
        ],
        expected: 'hello',
      },
      {
        id: 'sq-p5-t2',
        inputDisplay:
          'applyActions([{type:"write",text:"a"},{type:"write",text:"b"},{type:"write",text:"c"},{type:"undo"},{type:"undo"}])',
        inputArgs: [
          [
            { type: 'write', text: 'a' },
            { type: 'write', text: 'b' },
            { type: 'write', text: 'c' },
            { type: 'undo' },
            { type: 'undo' },
          ],
        ],
        expected: 'a',
      },
      {
        id: 'sq-p5-t3',
        inputDisplay: 'applyActions([{type:"undo"}])',
        inputArgs: [[{ type: 'undo' }]],
        expected: '',
      },
      {
        id: 'sq-p5-t4',
        inputDisplay: 'applyActions([{type:"write",text:"test"}])',
        inputArgs: [[{ type: 'write', text: 'test' }]],
        expected: 'test',
      },
      {
        id: 'sq-p5-t5',
        inputDisplay:
          'applyActions([{type:"write",text:"x"},{type:"undo"},{type:"undo"},{type:"write",text:"y"}])',
        inputArgs: [
          [
            { type: 'write', text: 'x' },
            { type: 'undo' },
            { type: 'undo' },
            { type: 'write', text: 'y' },
          ],
        ],
        expected: 'y',
      },
    ],
    hints: [
      'Как хранить историю изменений так, чтобы всегда можно было вернуться к предыдущему состоянию?',
      'Что нужно сохранять при каждом `write` — и что такое `undo` в терминах этой структуры?',
    ],
    solutionCode: `function applyActions(actions) {
  const stack = [""]; // начальное состояние — пустая строка

  for (const action of actions) {
    if (action.type === "write") {
      const current = stack[stack.length - 1];
      stack.push(current + action.text);
    } else if (action.type === "undo") {
      if (stack.length > 1) {
        stack.pop();
      }
    }
  }

  return stack[stack.length - 1];
}`,
  },
  {
    id: 'sq-p6',
    topicId: 'stacks-queues',
    kind: 'predict-output',
    title: 'Предскажите вывод: трассировка стека и очереди',
    difficulty: 'easy',
    isContextual: false,
    description: `Перед вами короткая программа, которая работает с массивом одновременно как со стеком (\`push\`/\`pop\`) и как с очередью (\`push\`/\`shift\`). Проследите изменение состояния и определите, что выведет финальный \`console.log\`.

Подсказка: после каждой операции мысленно запишите содержимое массива, чтобы не запутаться. Помните: \`pop\` снимает с конца, \`shift\` — с начала.`,
    code: `const buf = [];

buf.push('a');
buf.push('b');
buf.push('c');

const stackTop = buf.pop();    // снимаем с конца
buf.push('d');
const queueHead = buf.shift(); // снимаем с начала

console.log(stackTop + ',' + queueHead + ',' + buf.join(''));`,
    expected: 'c,a,bd',
    hints: [
      'После трёх push массив [a, b, c]. pop() снимает с конца — это "c".',
      'Затем push("d") → [a, b, d]. shift() снимает с начала — это "a".',
      'В массиве остаются [b, d]; join("") даст "bd".',
    ],
    solutionCode: `// push('a'), push('b'), push('c')  → buf = ['a', 'b', 'c']
// pop()                              → 'c',  buf = ['a', 'b']
// push('d')                          → buf = ['a', 'b', 'd']
// shift()                            → 'a',  buf = ['b', 'd']
//
// Итог: stackTop = 'c', queueHead = 'a', buf.join('') = 'bd'
// Вывод: "c,a,bd"`,
  },
  {
    id: 'sq-p7',
    topicId: 'stacks-queues',
    kind: 'find-bug',
    title: 'Найдите баг: проверка скобок и пустой стек',
    difficulty: 'medium',
    isContextual: false,
    description: `Перед вами реализация \`isValid\`, которая должна возвращать \`true\` для сбалансированных скобок и \`false\` иначе. Функция проходит большинство тестов, но на некоторых входах возвращает неверный результат.

Найдите баг и исправьте его. Подумайте о двух вещах: что произойдёт, если строка состоит только из закрывающих скобок, и что — если только из открывающих.`,
    functionName: 'isValid',
    buggyCode: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };

  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
    } else {
      // Снимаем верхнюю и сравниваем с парой
      const top = stack.pop();
      if (top !== pairs[ch]) return false;
    }
  }

  return true;
}`,
    bugSummary:
      'Функция возвращает true, не проверяя, что стек пуст в конце. Для строки "((" цикл проходит без срабатывания return false, и финальный return true даёт неверный ответ — на самом деле скобки не закрыты.',
    testCases: [
      {
        id: 'sq-p7-t1',
        inputDisplay: 'isValid("()")',
        inputArgs: ['()'],
        expected: true,
      },
      {
        id: 'sq-p7-t2',
        inputDisplay: 'isValid("((")',
        inputArgs: ['(('],
        expected: false,
      },
      {
        id: 'sq-p7-t3',
        inputDisplay: 'isValid("()[]{}")',
        inputArgs: ['()[]{}'],
        expected: true,
      },
      {
        id: 'sq-p7-t4',
        inputDisplay: 'isValid("([)]")',
        inputArgs: ['([)]'],
        expected: false,
      },
      {
        id: 'sq-p7-t5',
        inputDisplay: 'isValid("{[}")',
        inputArgs: ['{[}'],
        expected: false,
      },
    ],
    hints: [
      'Попробуйте запустить функцию мысленно на строке "((": что произойдёт в каждой итерации — и что вернёт функция в конце?',
      'Что означает непустой стек после обхода всей строки? Влияет ли это на результат в текущей реализации?',
    ],
    solutionCode: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };

  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
    } else {
      const top = stack.pop();
      if (top !== pairs[ch]) return false;
    }
  }

  // Все открывающие скобки должны быть закрыты — стек пуст
  return stack.length === 0;
}`,
  },
  {
    id: 'sq-p8',
    topicId: 'stacks-queues',
    kind: 'refactor',
    title: 'Рефакторинг: O(n²) Next Greater Element → O(n) монотонный стек',
    difficulty: 'medium',
    isContextual: false,
    description: `Перед вами наивная реализация задачи Next Greater Element: для каждого элемента \`nums[i]\` нужно вернуть ближайший справа элемент, который **строго больше** \`nums[i]\`. Если такого нет — вернуть \`-1\`.

Реализация работает корректно, но за O(n²) — два вложенных цикла. На массиве из 100 000 элементов она слишком медленная.

Перепишите функцию через монотонный стек, чтобы она работала за O(n). Идея: храним в стеке индексы элементов, для которых ответ ещё не найден; как только встретили больший элемент — выталкиваем все меньшие со стека и записываем им ответ.

Тест производительности: на массиве из 100 000 элементов решение должно завершаться за 50 миллисекунд.`,
    functionName: 'nextGreater',
    starterCode: `function nextGreater(nums) {
  // Наивное решение O(n²): для каждого элемента — линейный поиск вправо.
  const n = nums.length;
  const res = new Array(n).fill(-1);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[j] > nums[i]) {
        res[i] = nums[j];
        break;
      }
    }
  }
  return res;
}`,
    testCases: [
      {
        id: 'sq-p8-t1',
        inputDisplay: 'nextGreater([2, 1, 2, 4, 3])',
        inputArgs: [[2, 1, 2, 4, 3]],
        expected: [4, 2, 4, -1, -1],
      },
      {
        id: 'sq-p8-t2',
        inputDisplay: 'nextGreater([5, 4, 3, 2, 1])',
        inputArgs: [[5, 4, 3, 2, 1]],
        expected: [-1, -1, -1, -1, -1],
      },
      {
        id: 'sq-p8-t3',
        inputDisplay: 'nextGreater([1, 2, 3, 4, 5])',
        inputArgs: [[1, 2, 3, 4, 5]],
        expected: [2, 3, 4, 5, -1],
      },
      {
        id: 'sq-p8-t4',
        inputDisplay: 'nextGreater([7])',
        inputArgs: [[7]],
        expected: [-1],
      },
      {
        id: 'sq-p8-t5',
        inputDisplay: 'nextGreater([1, 1, 1, 2])',
        inputArgs: [[1, 1, 1, 2]],
        expected: [2, 2, 2, -1],
      },
    ],
    perfTest: {
      // Худший случай для O(n²): убывающий массив + один большой элемент в конце.
      // 100_000 элементов: [99_999, 99_998, ..., 1, 0, 100_001].
      inputArgs: [
        (() => {
          const a = Array.from({ length: 99_999 }, (_, i) => 99_999 - i);
          a.push(100_001);
          return a;
        })(),
      ],
      maxMs: 50,
    },
    hints: [
      'Когда именно становится известен «следующий больший» для конкретного элемента?',
      'Какое свойство поддерживает стек — и что происходит при добавлении нового элемента, который больше вершины?',
      'Почему хранить в стеке индексы удобнее, чем сами значения?',
    ],
    solutionCode: `function nextGreater(nums) {
  const n = nums.length;
  const res = new Array(n).fill(-1);
  const stack = []; // монотонно убывающий стек индексов

  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
      const j = stack.pop();
      res[j] = nums[i];
    }
    stack.push(i);
  }

  // Индексы, оставшиеся в стеке, не имеют большего справа — у них уже -1.
  return res;
}`,
  },
  {
    id: 'sq-h1',
    topicId: 'stacks-queues',
    kind: 'implement',
    title: 'Максимальный прямоугольник в гистограмме',
    difficulty: 'hard',
    isContextual: false,
    description: `Дан массив \`heights\`, где \`heights[i]\` — высота i-го столбца гистограммы (ширина каждого столбца = 1). Найдите площадь **наибольшего прямоугольника**, который можно вписать в гистограмму.

Примеры:
\`\`\`
largestRectangle([2, 1, 5, 6, 2, 3])  // → 10  (столбцы 5 и 6, высота 5)
largestRectangle([2, 4])               // → 4
largestRectangle([1])                  // → 1
largestRectangle([0])                  // → 0
\`\`\``,
    functionName: 'largestRectangle',
    starterCode: `function largestRectangle(heights) {
  // ваш код
}`,
    testCases: [
      { id: 'sq-h1-t1', inputDisplay: 'largestRectangle([2,1,5,6,2,3])', inputArgs: [[2,1,5,6,2,3]], expected: 10 },
      { id: 'sq-h1-t2', inputDisplay: 'largestRectangle([2,4])', inputArgs: [[2,4]], expected: 4 },
      { id: 'sq-h1-t3', inputDisplay: 'largestRectangle([1])', inputArgs: [[1]], expected: 1 },
      { id: 'sq-h1-t4', inputDisplay: 'largestRectangle([0])', inputArgs: [[0]], expected: 0 },
      { id: 'sq-h1-t5', inputDisplay: 'largestRectangle([6,2,5,4,5,1,6])', inputArgs: [[6,2,5,4,5,1,6]], expected: 12 },
    ],
    hints: [
      'Для каждого столбца максимальный прямоугольник с его высотой ограничен ближайшими более низкими столбцами слева и справа. Как их найти эффективно?',
      'Какое свойство стека позволяет «сигнализировать», что для вершины найдена правая граница?',
      'После обхода массива некоторые столбцы могут остаться в стеке. Что означает их присутствие — и как их обработать?',
    ],
    solutionCode: `function largestRectangle(heights) {
  const stack = []; // монотонный стек индексов (возрастающий)
  let maxArea = 0;
  const n = heights.length;

  for (let i = 0; i <= n; i++) {
    const h = i === n ? 0 : heights[i];

    while (stack.length > 0 && h < heights[stack[stack.length - 1]]) {
      const height = heights[stack.pop()];
      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, height * width);
    }

    stack.push(i);
  }

  return maxArea;
}`,
  },
  {
    id: 'sq-h2',
    topicId: 'stacks-queues',
    kind: 'implement',
    title: 'Максимум в скользящем окне (Sliding Window Maximum)',
    difficulty: 'hard',
    isContextual: false,
    description: `Дан массив \`nums\` и число \`k\` — размер скользящего окна. Верните массив максимальных значений для каждого окна.

Решение за O(n) — с помощью двусторонней очереди (deque).

Примеры:
\`\`\`
slidingWindowMax([1,3,-1,-3,5,3,6,7], 3)
// → [3, 3, 5, 5, 6, 7]

slidingWindowMax([1], 1)   // → [1]
slidingWindowMax([9,8,7,6], 2)  // → [9, 8, 7]
\`\`\``,
    functionName: 'slidingWindowMax',
    starterCode: `function slidingWindowMax(nums, k) {
  // ваш код — O(n) с deque
}`,
    testCases: [
      { id: 'sq-h2-t1', inputDisplay: 'slidingWindowMax([1,3,-1,-3,5,3,6,7], 3)', inputArgs: [[1,3,-1,-3,5,3,6,7], 3], expected: [3,3,5,5,6,7] },
      { id: 'sq-h2-t2', inputDisplay: 'slidingWindowMax([1], 1)', inputArgs: [[1], 1], expected: [1] },
      { id: 'sq-h2-t3', inputDisplay: 'slidingWindowMax([9,8,7,6], 2)', inputArgs: [[9,8,7,6], 2], expected: [9,8,7] },
      { id: 'sq-h2-t4', inputDisplay: 'slidingWindowMax([1,2,3,4,5], 3)', inputArgs: [[1,2,3,4,5], 3], expected: [3,4,5] },
      { id: 'sq-h2-t5', inputDisplay: 'slidingWindowMax([-1,-3,-5,-2,-4], 3)', inputArgs: [[-1,-3,-5,-2,-4], 3], expected: [-1,-2,-2] },
    ],
    hints: [
      'Максимум окна нужен быстро. Какую структуру данных использовать, чтобы всегда знать текущий максимум без перебора всего окна?',
      'Как гарантировать, что в структуре не окажутся элементы, которые никогда не станут максимумом?',
      'Как отслеживать, что элемент «вышел» за пределы текущего окна?',
    ],
    solutionCode: `function slidingWindowMax(nums, k) {
  const deque = []; // хранит индексы
  const result = [];

  for (let i = 0; i < nums.length; i++) {
    // Убираем элементы вне окна
    if (deque.length > 0 && deque[0] < i - k + 1) deque.shift();

    // Убираем элементы меньше текущего из хвоста
    while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop();
    }

    deque.push(i);

    // Окно полностью сформировано
    if (i >= k - 1) result.push(nums[deque[0]]);
  }

  return result;
}`,
  },
];
