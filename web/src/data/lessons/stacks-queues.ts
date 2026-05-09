import type { Lesson } from '../../types/lesson';
import { stacksQueuesQuiz } from '../quizzes/stacks-queues';

// Index existing quiz questions for reuse as checkpoints.
const Q = Object.fromEntries(stacksQueuesQuiz.questions.map((q) => [q.id, q]));

// Questions used as in-chapter checkpoints (must NOT appear in finalQuiz).
const CHECKPOINT_IDS = new Set(['sq-q1', 'sq-q6', 'sq-q3', 'sq-q11', 'sq-q12']);

export const stacksQueuesLesson: Lesson = {
  topicId: 'stacks-queues',

  intro: {
    whyItMatters: `Стек и очередь — это две самые «приземлённые» структуры данных в практике фронтенд- и бэкенд-разработчика. Стек незаметно работает в каждом браузере: история переходов в \`window.history\`, undo/redo в текстовом редакторе, стек вызовов JavaScript-движка, рекурсивный обход DOM при server-side rendering — всё это LIFO-структуры. Очередь не менее вездесуща: task queue и microtask queue в event loop, очередь сообщений в Web Worker, scheduler в React Fiber, процессы BFS-обхода графа социальной сети, очередь setInterval-таймеров.

В JavaScript обычный \`Array\` уже является полноценным стеком: \`push\` и \`pop\` работают за O(1) благодаря амортизации growable-буфера в V8. Это объясняет, почему в фронтенд-собеседованиях задача про «валидные скобки» решается двумя строками кода. С очередью сложнее: \`Array.shift\` смещает все элементы влево и стоит O(n) — на массиве из миллиона элементов это превращает линейный алгоритм в квадратичный. В продакшен-коде используют либо двусвязный список, либо круговой буфер (deque), либо двух-стековый трюк, при котором push идёт в один стек, а pop — из другого.

Разница между LIFO и FIFO — это не академическая формальность, а граница между правильным и сломанным алгоритмом. Перепутать \`shift\` и \`pop\` в реализации обхода в ширину — значит превратить BFS в DFS и получить неверный кратчайший путь. На собеседовании интервьюер проверяет, понимаете ли вы, какие задачи попадают в шаблон «монотонный стек» (Daily Temperatures, Next Greater Element, Largest Rectangle in Histogram), и умеете ли распознать рекурсию, которую следует переписать итеративно через явный стек, чтобы не упереться в \`RangeError: Maximum call stack size exceeded\`.`,
    estimatedMinutes: 30,
    interviewAngle:
      'Стеки и очереди спрашивают на любом алгоритмическом собеседовании — от FAANG до продуктовых компаний. Сильный кандидат не просто знает API \`push\`/\`pop\`/\`shift\`, а умеет аргументировать выбор: почему \`shift\` стоит O(n), как сделать FIFO за O(1) на двух стеках, в каких задачах применяется монотонный стек и как доказать его O(n)-сложность через amortized analysis.',
    prerequisites: [],
  },

  resources: {
    videos: [
      {
        source: 'youtube',
        id: 'WTzjTskDFMg',
        title: 'Valid Parentheses — Stack — Leetcode 20',
        channel: 'NeetCode',
        language: 'en',
        durationSec: 8 * 60,
        description: 'Каноничный разбор задачи про сбалансированные скобки — образцовый пример применения стека на собеседовании.',
      },
      {
        source: 'youtube',
        id: 'L3ud3rXpIxA',
        title: 'Stack Introduction',
        channel: 'WilliamFiset',
        language: 'en',
        durationSec: 6 * 60,
        description: 'Аккуратное введение в стек как абстрактный тип данных от автора популярного курса по структурам данных.',
      },
    ],
    links: [
      {
        url: 'https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array',
        title: 'Array — MDN',
        source: 'mdn',
        language: 'ru',
        note: 'Справочник по push/pop/shift/unshift и их сложности — фундамент для реализации стека и очереди в JS.',
      },
      {
        url: 'https://learn.javascript.ru/array-methods',
        title: 'Методы массивов — learn.javascript.ru',
        source: 'learn-js',
        language: 'ru',
        note: 'Глава Ильи Кантора, в которой подробно объясняется, почему shift() работает за O(n).',
      },
      {
        url: 'https://cp-algorithms.com/data_structures/stack_queue_modification.html',
        title: 'Stack and queue modification — cp-algorithms',
        source: 'article',
        language: 'en',
        note: 'Каноническая статья e-maxx про стек/очередь с минимумом и приёмы реализации деки на двух стеках.',
      },
      {
        url: 'https://leetcode.com/explore/learn/card/queue-stack/',
        title: 'Queue & Stack — LeetCode Explore',
        source: 'article',
        language: 'en',
        note: 'Структурированный курс с задачами и пошаговыми объяснениями всех ключевых паттернов.',
      },
      {
        url: 'https://en.wikipedia.org/wiki/Monotonic_stack',
        title: 'Monotonic stack — Wikipedia',
        source: 'article',
        language: 'en',
        note: 'Краткое определение монотонного стека и список задач, которые с его помощью решаются за O(n).',
      },
    ],
  },

  chapters: [
    {
      id: 'stack-basics',
      title: 'Стек: LIFO и операции за O(1)',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            '**Стек** — это структура данных, работающая по принципу LIFO (Last In, First Out): элемент, добавленный последним, извлекается первым. Бытовая аналогия — стопка тарелок: положить можно только сверху, взять — тоже только верхнюю.',
        },
        {
          type: 'visualization',
          content: '',
          vizId: 'stacks-queues',
        },
        { type: 'heading', content: 'Базовый API' },
        {
          type: 'list',
          content: `- \`push(x)\` — положить элемент на вершину. Сложность O(1).
- \`pop()\` — снять и вернуть верхний элемент. Сложность O(1).
- \`peek()\` (или \`top()\`) — посмотреть на вершину без удаления.
- \`isEmpty()\` — проверка пустоты.`,
        },
        {
          type: 'text',
          content:
            'В JavaScript отдельный класс не нужен: обычный массив с методами \`push\` и \`pop\` уже даёт полноценный стек. V8 хранит массивы как growable-буфер, поэтому амортизированная сложность \`push\` — O(1).',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const stack = [];

stack.push(1);  // [1]
stack.push(2);  // [1, 2]
stack.push(3);  // [1, 2, 3]

stack.pop();    // 3 → [1, 2]
const top = stack[stack.length - 1]; // 2 (peek)
const isEmpty = stack.length === 0;  // false`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Всегда проверяйте \`stack.length > 0\` перед \`pop()\`. На пустом массиве \`pop()\` молча возвращает \`undefined\` — это самый частый источник багов в задачах со скобками и парсерами.',
        },
      ],
      flashcardIds: ['sq-f1', 'sq-f2'],
      checkpoint: [Q['sq-q1']!, Q['sq-q6']!],
    },

    {
      id: 'queue-basics',
      title: 'Очередь: FIFO и проблема shift',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'visualization',
          content: '',
          vizId: 'queue',
        },
        {
          type: 'text',
          content:
            '**Очередь** — структура FIFO (First In, First Out): первый пришедший элемент уходит первым. Аналогия — очередь в магазине: кто встал раньше, того и обслужат раньше.',
        },
        { type: 'heading', content: 'Наивная реализация на массиве' },
        {
          type: 'code',
          language: 'javascript',
          content: `const queue = [];

queue.push(1);    // [1]
queue.push(2);    // [1, 2]
queue.push(3);    // [1, 2, 3]

queue.shift();    // 1 → [2, 3]
queue.shift();    // 2 → [3]`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '\`Array.shift\` смещает **все** оставшиеся элементы на одну позицию влево, поэтому его сложность — O(n). На очереди из миллиона элементов цикл с \`shift\` стоит O(n²) — тот самый случай, когда BFS «вдруг» начинает работать секунды вместо миллисекунд.',
        },
        { type: 'heading', content: 'Очередь за O(1) через два указателя' },
        {
          type: 'text',
          content:
            'Простой и достаточный для большинства задач трюк — не сдвигать массив, а двигать указатель головы. Память не освобождается мгновенно, но операции работают за константу.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `class FastQueue {
  constructor() {
    this.data = [];
    this.head = 0;
  }
  enqueue(x) {
    this.data.push(x);          // O(1) амортизированно
  }
  dequeue() {
    if (this.head >= this.data.length) return undefined;
    const x = this.data[this.head];
    this.data[this.head++] = undefined; // помогаем GC
    return x;
  }
  get size() {
    return this.data.length - this.head;
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Альтернатива — двусвязный список или кольцевой буфер. Для собеседования достаточно знать про указатель головы и упомянуть, что в Node.js популярный пакет \`denque\` реализует деку на массиве массивов.',
        },
      ],
      flashcardIds: ['sq-f3', 'sq-f4'],
    },

    {
      id: 'classic-patterns',
      title: 'Классические задачи на стек',
      estimatedMinutes: 6,
      blocks: [
        { type: 'heading', content: 'Сбалансированные скобки' },
        {
          type: 'text',
          content:
            'Задача-визитка стека. Идея: при открывающей скобке кладём её на стек, при закрывающей — извлекаем верхнюю и проверяем, что они парные. В конце стек должен быть пуст.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };

  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
    } else {
      // закрывающая: стек не должен быть пуст и вершина должна совпасть
      if (stack.pop() !== pairs[ch]) return false;
    }
  }

  return stack.length === 0;
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Тонкость: \`stack.pop()\` на пустом стеке вернёт \`undefined\`, что не равно ни одной открывающей скобке — поэтому отдельная проверка пустоты не нужна. Этот трюк часто упускают на собеседовании.',
        },
        { type: 'heading', content: 'Постфиксная нотация (RPN)' },
        {
          type: 'text',
          content:
            'Калькулятор обратной польской записи — каноничный пример «вычисления» стеком. Числа кладём на стек; встретив оператор, снимаем два операнда, применяем операцию, кладём результат обратно.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function evalRPN(tokens) {
  const stack = [];
  for (const t of tokens) {
    if ('+-*/'.includes(t)) {
      const b = stack.pop();
      const a = stack.pop();
      stack.push(
        t === '+' ? a + b :
        t === '-' ? a - b :
        t === '*' ? a * b :
        Math.trunc(a / b)
      );
    } else {
      stack.push(Number(t));
    }
  }
  return stack[0];
}`,
        },
        { type: 'heading', content: 'Min-стек: минимум за O(1)' },
        {
          type: 'text',
          content:
            'Идея — параллельно с основным стеком вести вспомогательный, на вершине которого всегда лежит минимум всего «текущего» состояния. При \`push\` сравниваем новый элемент с вершиной \`minStack\` и кладём минимум; при \`pop\` снимаем с обоих стеков синхронно.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `class MinStack {
  constructor() { this.s = []; this.m = []; }
  push(x) {
    this.s.push(x);
    this.m.push(this.m.length ? Math.min(x, this.m[this.m.length - 1]) : x);
  }
  pop()    { this.m.pop(); return this.s.pop(); }
  top()    { return this.s[this.s.length - 1]; }
  getMin() { return this.m[this.m.length - 1]; }
}`,
        },
      ],
      flashcardIds: ['sq-f5', 'sq-f6', 'sq-f7'],
      checkpoint: [Q['sq-q3']!],
    },

    {
      id: 'monotonic-stack',
      title: 'Монотонный стек',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'visualization',
          content: '',
          vizId: 'monotonic-stack',
        },
        {
          type: 'text',
          content:
            '**Монотонный стек** — стек, в котором элементы (или индексы) поддерживаются в строго убывающем или строго возрастающем порядке. Когда новый элемент нарушает порядок, мы выталкиваем все «нарушающие» элементы и обрабатываем их. Это ключевой паттерн для задач семейства «следующий больший/меньший элемент».',
        },
        { type: 'heading', content: 'Шаблон: Next Greater Element' },
        {
          type: 'code',
          language: 'javascript',
          content: `function nextGreater(nums) {
  const res = new Array(nums.length).fill(-1);
  const stack = []; // монотонно убывающий стек ИНДЕКСОВ

  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      const j = stack.pop();
      res[j] = nums[i];   // нашли следующий больший для индекса j
    }
    stack.push(i);
  }
  return res;
}`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Несмотря на вложенный \`while\` внутри \`for\`, суммарная сложность — O(n). Доказательство (amortized analysis): каждый индекс попадает в стек ровно один раз и извлекается максимум один раз, итого ≤ 2n операций.',
        },
        { type: 'heading', content: 'Daily Temperatures — пошагово' },
        {
          type: 'text',
          content:
            'Для \`[73, 74, 75, 71, 69, 72, 76, 73]\` отслеживаем, через сколько дней станет теплее. Ниже — трассировка стека индексов:',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// i=0 (73): stack=[]      → push 0           stack=[0]
// i=1 (74): 74 > 73       → pop 0, res[0]=1   stack=[1]
// i=2 (75): 75 > 74       → pop 1, res[1]=1   stack=[2]
// i=3 (71): 71 < 75       → push 3            stack=[2,3]
// i=4 (69): 69 < 71       → push 4            stack=[2,3,4]
// i=5 (72): 72>69→pop4,res[4]=1; 72>71→pop3,res[3]=2; push 5  stack=[2,5]
// i=6 (76): 76>72→pop5,res[5]=1; 76>75→pop2,res[2]=4; push 6  stack=[6]
// i=7 (73): 73 < 76       → push 7            stack=[6,7]
// res = [1, 1, 4, 2, 1, 1, 0, 0]`,
        },
        { type: 'heading', content: 'Где встречается на практике' },
        {
          type: 'list',
          content: `- Daily Temperatures (LeetCode 739).
- Next Greater Element I/II (LeetCode 496/503) — циклический массив.
- Largest Rectangle in Histogram (LeetCode 84) — основа для Maximal Rectangle.
- Stock Span Problem — биржевые задачи.
- Trapping Rain Water (один из подходов).`,
        },
      ],
      playground: {
        starterCode: `// Реализуйте «следующий меньший элемент» через монотонный стек.
// Для каждого элемента nums[i] верните ближайший справа элемент,
// который СТРОГО МЕНЬШЕ nums[i]. Если такого нет — -1.
//
// Подсказка: стек должен быть монотонно ВОЗРАСТАЮЩИМ по значениям.

function nextSmaller(nums) {
  const res = new Array(nums.length).fill(-1);
  const stack = [];
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[i] < nums[stack[stack.length - 1]]) {
      const j = stack.pop();
      res[j] = nums[i];
    }
    stack.push(i);
  }
  return res;
}

console.log(JSON.stringify(nextSmaller([4, 5, 2, 10, 8])));`,
        expectedOutput: '[2,2,-1,8,-1]',
        description:
          'Симметричный шаблон: меняем знак сравнения с \`>\` на \`<\` — и тот же монотонный стек ищет ближайший меньший элемент справа. Запустите код и проверьте, что результат совпадает с ожидаемым.',
      },
      flashcardIds: ['sq-f8', 'sq-f9'],
    },

    {
      id: 'queue-tricks',
      title: 'Очередь на двух стеках и deque',
      estimatedMinutes: 5,
      blocks: [
        { type: 'heading', content: 'FIFO на двух стеках за amortized O(1)' },
        {
          type: 'text',
          content:
            'Классический алгоритмический трюк, который часто спрашивают на собеседовании. Используем два стека: \`inStack\` для входящих элементов и \`outStack\` для исходящих. Когда \`outStack\` пуст, перекладываем в него все элементы из \`inStack\` — порядок автоматически разворачивается.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `class MyQueue {
  constructor() { this.in = []; this.out = []; }
  enqueue(x) { this.in.push(x); }
  dequeue() {
    this._shift();
    return this.out.pop();
  }
  peek() {
    this._shift();
    return this.out[this.out.length - 1];
  }
  _shift() {
    if (this.out.length === 0) {
      while (this.in.length) this.out.push(this.in.pop());
    }
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Amortized-сложность \`dequeue\` — O(1): каждый элемент перекладывается из \`in\` в \`out\` ровно один раз за всю свою жизнь. В худшем случае одно конкретное \`dequeue\` стоит O(n), но средняя стоимость на длинной серии — константа.',
        },
        { type: 'heading', content: 'Deque и Sliding Window Maximum' },
        {
          type: 'text',
          content:
            '**Deque** (double-ended queue) — структура с операциями \`push\`/\`pop\` с обоих концов за O(1). Главное применение в алгоритмах — поиск максимума в скользящем окне за O(n). Идея: поддерживаем дек индексов так, чтобы соответствующие значения шли по убыванию. Голова дека — индекс текущего максимума.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function maxSlidingWindow(nums, k) {
  const dq = []; // индексы, значения убывают
  const res = [];

  for (let i = 0; i < nums.length; i++) {
    // выкидываем хвост, если он не больше текущего
    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
    dq.push(i);
    // выкидываем голову, если она вышла за окно
    if (dq[0] <= i - k) dq.shift();
    if (i >= k - 1) res.push(nums[dq[0]]);
  }
  return res;
}`,
        },
      ],
      playground: {
        starterCode: `// Проследите выполнение MyQueue: enqueue 1, 2, 3, dequeue, enqueue 4, dequeue.
// Какое значение вернёт второй dequeue?

class MyQueue {
  constructor() { this.in = []; this.out = []; }
  enqueue(x) { this.in.push(x); }
  dequeue() {
    if (this.out.length === 0) {
      while (this.in.length) this.out.push(this.in.pop());
    }
    return this.out.pop();
  }
}

const q = new MyQueue();
q.enqueue(1);
q.enqueue(2);
q.enqueue(3);
q.dequeue();        // 1
q.enqueue(4);
console.log(q.dequeue()); // ?`,
        expectedOutput: '2',
        description:
          'Ключевой момент: после первого \`dequeue\` \`out=[3,2]\` (вершина — 2). Новый \`enqueue(4)\` идёт в \`in\`, а не в \`out\`. Поэтому второй \`dequeue\` берёт элемент из \`out\` и возвращает 2. Если бы перекладка происходила каждый раз — мы бы потеряли FIFO-порядок.',
      },
      flashcardIds: ['sq-f10', 'sq-f11'],
      checkpoint: [Q['sq-q11']!],
    },

    {
      id: 'pitfalls',
      title: 'Типичные ошибки и сложности',
      estimatedMinutes: 4,
      blocks: [
        { type: 'heading', content: '1. shift() вместо deque' },
        {
          type: 'text',
          content:
            'Самая частая ошибка в задачах на BFS: использовать \`Array.shift\` для очереди и не задумываться о сложности. На входе из 10⁵ элементов алгоритм работает приемлемо, на 10⁶ — секунды или TLE на LeetCode. Решения: указатель головы, библиотека \`denque\`, реализация на двусвязном списке.',
        },
        { type: 'heading', content: '2. pop() из пустого стека' },
        {
          type: 'code',
          language: 'javascript',
          content: `// АНТИПАТТЕРН
function isValid(s) {
  const stack = [];
  for (const ch of s) {
    if ('([{'.includes(ch)) stack.push(ch);
    else {
      const top = stack.pop();          // ← undefined на пустом стеке
      if (top !== matching(ch)) return false;
    }
  }
  return true;                          // ← забыли проверить, что стек пуст
}

// Если на вход придёт "((", функция вернёт true,
// хотя стек содержит две незакрытые скобки.`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Правило: всегда возвращайте \`stack.length === 0\` (или эквивалентное) в финале и не забывайте, что \`pop()\` на пустом стеке возвращает \`undefined\`, а не бросает ошибку.',
        },
        { type: 'heading', content: '3. Путаница LIFO/FIFO' },
        {
          type: 'text',
          content:
            'В реализации BFS обхода графа нужна очередь (\`shift\`), а в DFS — стек (\`pop\`). Перепутав методы, вы получите алгоритм с обходом «не того» порядка. На графе кратчайших путей это даёт неверные расстояния, а в игровом дереве — неверные ходы.',
        },
        { type: 'heading', content: '4. Глубокая рекурсия → стек' },
        {
          type: 'text',
          content:
            'JavaScript-движки ограничивают глубину рекурсии (~10⁴ вызовов). При обходе глубокого дерева JSON или DOM рекурсивная функция упадёт с \`RangeError: Maximum call stack size exceeded\`. Решение — переписать обход через явный стек: память выделяется в куче, лимита нет.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Итеративный DFS вместо рекурсивного
function dfsIterative(root) {
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    visit(node);
    for (let i = node.children.length - 1; i >= 0; i--) {
      stack.push(node.children[i]);   // в обратном порядке для left-to-right
    }
  }
}`,
        },
      ],
      flashcardIds: ['sq-f12'],
    },
  ],

  // Все вопросы из старого квиза, кроме тех, что ушли в checkpoint.
  finalQuiz: stacksQueuesQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  flashcards: [
    {
      id: 'sq-f1',
      question: 'Что такое стек и какой принцип у него в основе?',
      answer:
        'Стек — структура данных, работающая по принципу LIFO (Last In, First Out): элемент, добавленный последним, извлекается первым. Базовые операции — push (положить на вершину) и pop (снять верхний).',
      keyPoints: [
        'LIFO — последним вошёл, первым вышел',
        'Аналогия — стопка тарелок',
        'Все базовые операции — O(1)',
      ],
    },
    {
      id: 'sq-f2',
      question: 'Почему обычный массив в JavaScript — это уже стек?',
      answer:
        'Методы Array.push и Array.pop работают с концом массива за амортизированное O(1). Никаких сдвигов памяти не нужно: V8 хранит массив в growable-буфере и при необходимости удваивает его размер.',
      keyPoints: [
        '`push` и `pop` — амортизированно O(1)',
        '`stack[stack.length - 1]` — peek без удаления',
        '`pop()` на пустом массиве возвращает `undefined`, не кидает ошибку',
      ],
      code: `const stack = [];
stack.push(1);
stack.push(2);
stack.pop();              // 2
stack[stack.length - 1];  // 1 (peek)`,
      codeLanguage: 'javascript',
    },
    {
      id: 'sq-f3',
      question: 'Что такое очередь и чем она отличается от стека?',
      answer:
        'Очередь — структура FIFO (First In, First Out): первый пришедший элемент уходит первым. Отличие от стека (LIFO) — направление извлечения: с другого конца, чем добавление.',
      keyPoints: [
        'FIFO — первым вошёл, первым вышел',
        'Аналогия — очередь в магазине',
        'enqueue в конец, dequeue из начала',
      ],
    },
    {
      id: 'sq-f4',
      question: 'Почему Array.shift() стоит O(n) и как сделать очередь за O(1)?',
      answer:
        'shift() удаляет первый элемент и сдвигает все остальные на одну позицию влево — это O(n). Чтобы получить O(1) на dequeue, держат указатель головы (head++) и не сдвигают массив, либо используют двусвязный список.',
      keyPoints: [
        '`shift` = удаление первого + сдвиг всех остальных = O(n)',
        'Альтернатива — указатель головы: data[head++], data.push(x)',
        'Промышленные решения: двусвязный список, denque, кольцевой буфер',
      ],
      code: `class Queue {
  constructor() { this.data = []; this.head = 0; }
  enqueue(x) { this.data.push(x); }
  dequeue() { return this.data[this.head++]; }
}`,
      codeLanguage: 'javascript',
    },
    {
      id: 'sq-f5',
      question: 'Как стеком проверить сбалансированность скобок?',
      answer:
        'Проходим строку: открывающую скобку кладём на стек, закрывающую — сравниваем с верхней (после pop). Если не совпадают или стек пуст — невалидно. В конце стек должен быть пуст.',
      keyPoints: [
        'Открывающая → push',
        'Закрывающая → pop и сравнить с парой',
        'Финал: stack.length === 0',
        '`pop()` на пустом возвращает `undefined`, что не равно ни одной скобке',
      ],
    },
    {
      id: 'sq-f6',
      question: 'Как работает калькулятор обратной польской записи (RPN)?',
      answer:
        'Числа кладём на стек. Встретив оператор, снимаем два операнда (b сверху, a под ним), применяем операцию, кладём результат обратно. После обработки всех токенов на стеке остаётся ответ.',
      keyPoints: [
        'Числа → push',
        'Оператор → pop b, pop a, push result',
        'Порядок важен: a — верхний оператор, b — следующий за ним',
        'Целочисленное деление в JS: Math.trunc(a / b)',
      ],
    },
    {
      id: 'sq-f7',
      question: 'Как реализовать стек с минимумом за O(1)?',
      answer:
        'Завести вспомогательный стек minStack. При push в основной стек, в minStack кладём min(новый_элемент, текущая_вершина_minStack). При pop — снимаем с обоих синхронно. getMin = вершина minStack.',
      keyPoints: [
        'Каждому элементу основного стека сопоставляется минимум на момент его добавления',
        'Push, pop, getMin — все O(1)',
        'Память — O(n) дополнительно; есть и O(1)-память версия с трюком',
      ],
    },
    {
      id: 'sq-f8',
      question: 'Что такое монотонный стек и в каких задачах применяется?',
      answer:
        'Стек, в котором элементы поддерживаются в строго убывающем (или возрастающем) порядке. Применяется для задач «следующий больший/меньший элемент»: Daily Temperatures, Next Greater Element, Largest Rectangle in Histogram, Stock Span.',
      keyPoints: [
        'При нарушении порядка — pop в цикле и обработка',
        'Каждый элемент входит и выходит максимум один раз → O(n)',
        'Часто хранит индексы, а не значения',
      ],
    },
    {
      id: 'sq-f9',
      question: 'Почему монотонный стек работает за O(n), несмотря на вложенный while?',
      answer:
        'Amortized analysis: каждый индекс пушится в стек ровно один раз и поппится максимум один раз. Суммарное число операций push+pop за весь алгоритм ≤ 2n, поэтому общая сложность — O(n), а не O(n²).',
      keyPoints: [
        'Не считаем итерации while локально, а смотрим на общее количество pop',
        'Аналогичный приём в анализе слайдинг-окна',
        'На собеседовании это объяснение часто хотят услышать явно',
      ],
    },
    {
      id: 'sq-f10',
      question: 'Как реализовать очередь через два стека?',
      answer:
        'Используем inStack и outStack. enqueue — push в inStack. dequeue — если outStack пуст, перекладываем все элементы из inStack в outStack (порядок развернётся), затем pop из outStack. Amortized O(1) на операцию.',
      keyPoints: [
        'enqueue — всегда O(1)',
        'dequeue — амортизированно O(1), в худшем случае O(n)',
        'Каждый элемент перекладывается ровно один раз',
        'Перекладывать только когда outStack пуст',
      ],
      code: `class MyQueue {
  constructor() { this.in = []; this.out = []; }
  enqueue(x) { this.in.push(x); }
  dequeue() {
    if (!this.out.length)
      while (this.in.length) this.out.push(this.in.pop());
    return this.out.pop();
  }
}`,
      codeLanguage: 'javascript',
    },
    {
      id: 'sq-f11',
      question: 'Что такое deque и зачем он нужен в Sliding Window Maximum?',
      answer:
        'Deque — двусторонняя очередь с push/pop с обоих концов за O(1). В задаче «максимум в окне размера k» дек индексов поддерживается так, что значения идут по убыванию: голова дека — индекс максимума окна. Каждый индекс входит и выходит максимум один раз → O(n).',
      keyPoints: [
        'Хранит индексы, не значения',
        'С хвоста выкидываем меньше или равные текущему',
        'С головы — индексы, вышедшие из окна',
        'Голова — текущий максимум окна',
      ],
    },
    {
      id: 'sq-f12',
      question: 'Когда стоит переписать рекурсию на итерацию со стеком?',
      answer:
        'Когда возможна большая глубина рекурсии (обход глубокого дерева JSON, DOM, графа). JavaScript-движки ограничивают call stack ~10⁴ кадрами; явный стек живёт в куче и не имеет такого лимита. Также — для микрооптимизаций hot path и ленивых обходов.',
      keyPoints: [
        'RangeError: Maximum call stack size exceeded — сигнал к переписи',
        'Иммутабельный стек = воспроизводимый порядок обхода',
        'Дети пушатся в обратном порядке для left-to-right DFS',
      ],
    },
  ],

  cheatsheet: `### Шпаргалка по стекам и очередям

- **Стек (LIFO)**: \`Array.push\` / \`Array.pop\` — оба O(1).
- **Очередь (FIFO) наивно**: \`push\` + \`shift\`. \`shift\` — O(n)! Только для маленьких данных.
- **Очередь O(1)**: указатель головы \`data[head++]\`, либо двусвязный список, либо два стека.
- **Peek**: \`stack[stack.length - 1]\`. На пустом — \`undefined\`.
- **Монотонный стек**: хранит индексы, поддерживает порядок; pop в цикле при нарушении. Сложность O(n) через amortized analysis.
- **Применения стека**: скобки, RPN, undo/redo, simplify path, decode string, asteroid collision, итеративный DFS, парсеры.
- **Применения очереди**: BFS, scheduler, поток событий, level-order обход дерева.
- **Deque**: Sliding Window Maximum, монотонная дека.
- **Граничные случаи**: пустой стек/очередь, один элемент, незакрытые скобки в конце.`,

  interviewQA: [
    {
      id: 'sq-iq1',
      question: 'В чём разница между стеком и очередью? Приведите пример задачи для каждого.',
      shortAnswer:
        'Стек работает по LIFO — последний вошёл, первый вышел; пример — проверка скобок, undo/redo. Очередь работает по FIFO — первый вошёл, первый вышел; пример — BFS, обработка задач планировщика.',
      fullAnswer: `**Стек (LIFO)** добавляет и извлекает элементы с одного и того же конца. Это даёт «обратный» порядок обхода относительно порядка вставки. Типичные применения:

- Проверка вложенных структур: скобки, HTML-теги, JSON.
- Undo/redo в редакторе: стек предыдущих состояний.
- Итеративный обход в глубину (DFS) — явный стек заменяет рекурсию.
- Калькулятор RPN, монотонные стеки (Daily Temperatures, гистограмма).

**Очередь (FIFO)** добавляет с одного конца, извлекает — с другого. Это сохраняет порядок поступления. Применения:

- Обход в ширину (BFS) — гарантирует кратчайший путь в невзвешенном графе.
- Планировщик задач: process scheduler в ОС, task queue в event loop.
- Буферизация потока событий, message queue.
- Level-order traversal двоичного дерева.

**Ключевая практическая разница в JS.** Стек — это просто \`Array\` с \`push/pop\`. Очередь на массиве с \`shift\` стоит O(n) на dequeue, и на больших данных это превращает линейный алгоритм в квадратичный. Поэтому в продакшен-коде для FIFO используют двусвязный список, кольцевой буфер или указатель головы.`,
      followUps: [
        'Что выберете для реализации BFS на 10⁶ узлов и почему?',
        'Можно ли обойтись одним стеком в реализации очереди? Чем это плохо?',
      ],
      relatedChapterId: 'queue-basics',
    },
    {
      id: 'sq-iq2',
      question: 'Почему Array.shift стоит O(n) и какие есть способы получить очередь за O(1)?',
      shortAnswer:
        'shift удаляет первый элемент и сдвигает все оставшиеся на одну позицию влево — отсюда O(n). Способы O(1): указатель головы, двусвязный список, кольцевой буфер, две связки стеков.',
      fullAnswer: `\`Array.shift\` спецификацией обязан перенумеровать все индексы: после удаления нулевого элемента arr[1] становится arr[0], arr[2] — arr[1] и так далее. Для массива длины n это n-1 присваиваний — O(n). \`unshift\` симметрично стоит O(n) по той же причине.

**Решения за O(1).**

1. **Указатель головы.** Не сдвигаем массив физически: \`enqueue\` — \`data.push(x)\`, \`dequeue\` — \`data[head++]\`. Память не освобождается мгновенно, но операции работают за константу. Минус — массив монотонно растёт; периодически имеет смысл перепаковывать.
2. **Двусвязный список.** Узлы ссылаются на соседей; \`enqueue\`/\`dequeue\` — переписывание двух указателей. O(1) гарантированно, но больше памяти на узел и хуже cache-locality.
3. **Кольцевой буфер.** Массив фиксированного размера + два указателя head/tail по модулю N. Идеален, если максимальный размер очереди известен заранее. Используется в реализации высокопроизводительных очередей в Node.js.
4. **Две связки стеков.** \`enqueue\` пушит в \`inStack\`, \`dequeue\` снимает из \`outStack\` (перекладывая при необходимости). Amortized O(1) — каждый элемент перекладывается ровно один раз.

**Готовые библиотеки.** В npm пакет \`denque\` — двунаправленная очередь на массиве массивов; используется в популярных библиотеках вроде \`mongodb\` и \`redis\`. В стандартной библиотеке таких структур нет.`,
      followUps: [
        'Какова практическая разница между двусвязным списком и кольцевым буфером?',
        'Почему именно «амортизированное» O(1) для очереди на двух стеках, а не «гарантированное»?',
      ],
      relatedChapterId: 'queue-basics',
    },
    {
      id: 'sq-iq3',
      question: 'Что такое монотонный стек и в каких задачах применяется?',
      shortAnswer:
        'Стек, в котором элементы (или индексы) поддерживаются в строго убывающем или возрастающем порядке. При нарушении порядка — pop в цикле и обработка. Применяется для семейства задач «следующий больший/меньший элемент» за O(n).',
      fullAnswer: `Монотонный стек — это инвариант: на любой итерации значения в стеке упорядочены. Алгоритм: при добавлении нового элемента \`x\` снимаем со стека все элементы, нарушающие монотонность (например, все, кто ≤ x при убывающем стеке), и обрабатываем их — мы только что нашли для каждого «следующий больший». После очистки кладём \`x\`.

**Каноничные задачи.**

- **Daily Temperatures (LeetCode 739)**: для каждого дня — через сколько дней станет теплее.
- **Next Greater Element I/II (496/503)**: ближайший справа больший элемент; во второй версии массив циклический и его проходят дважды.
- **Largest Rectangle in Histogram (84)**: максимальный прямоугольник из соседних столбцов. На основе этой задачи решается Maximal Rectangle (85) и Sub-matrix problems.
- **Stock Span Problem**: для каждого дня — сколько подряд идущих предыдущих дней цена была не выше.
- **Trapping Rain Water (42)**: один из подходов через монотонно убывающий стек границ.

**Доказательство O(n).** В наивном решении на каждом \`x\` мы потенциально обходим весь стек — кажется, что O(n²). Но amortized analysis говорит другое: каждый индекс пушится **ровно один раз** за всю жизнь алгоритма, и поппится максимум **один раз**. Итого: ≤ 2n операций push+pop, общая сложность — O(n).

**Подсказка для распознавания паттерна.** Если задача звучит как «для каждого элемента найдите ближайший больший/меньший слева/справа» — это почти всегда монотонный стек. Если ответ зависит от порядка пар (i, j) с i<j и нужна O(n) — попробуйте монотонный стек или дек.`,
      followUps: [
        'Чем отличается монотонная дека от монотонного стека?',
        'Как доказать сложность через метод потенциалов?',
      ],
      relatedChapterId: 'monotonic-stack',
    },
    {
      id: 'sq-iq4',
      question: 'Опишите алгоритм проверки сбалансированности скобок и его граничные случаи.',
      shortAnswer:
        'Идём по строке: открывающую скобку кладём на стек, закрывающую — сравниваем с верхней через pop. В конце стек должен быть пуст. Сложность — O(n) по времени и памяти.',
      fullAnswer: `**Базовый алгоритм.**

\`\`\`js
function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };

  for (const ch of s) {
    if ('([{'.includes(ch)) stack.push(ch);
    else if (stack.pop() !== pairs[ch]) return false;
  }

  return stack.length === 0;
}
\`\`\`

**Почему это работает.** Скобки требуют, чтобы каждой закрывающей соответствовала ближайшая нерасспаренная открывающая того же типа. Стек естественным образом моделирует «ближайшую открывающую»: верхушка — это самая «свежая» открытая, ещё не закрытая скобка.

**Граничные случаи.**

1. **Пустая строка** — валидна (стек пуст).
2. **Строка из одних открывающих** — \`"(((\`. После цикла стек не пуст → невалидно. Поэтому нельзя просто \`return true\` в конце.
3. **Строка из одних закрывающих** — \`")))\`. На первой же итерации \`stack.pop()\` вернёт \`undefined\`, что не равно ни одной скобке → false.
4. **Перекрытие** — \`"([)]\`. После трёх итераций стек = ['(', '['], пришла \`)\`, pop вернёт \`[\`, а ожидалась \`(\` → false.
5. **Длинная корректная вложенность** — \`"((((((((((()))))))))))\`. Работает за O(n), память тоже O(n).
6. **Не-скобочные символы.** Если в строке могут быть буквы, добавьте \`else\` для пропуска.

**Сложность.** Время O(n) — один проход. Память O(n) в худшем случае — все символы открывающие.

**Распространённые ошибки.**

- Забыть финальную проверку \`stack.length === 0\` — функция вернёт true для \`"((\`.
- Сравнивать символы по индексу, а не по парам — \`pairs[ch]\` обязательно.
- Использовать \`indexOf\` вместо \`includes\` — то же самое, но \`includes\` читается лучше.`,
      followUps: [
        'Как обобщить алгоритм на произвольный набор пар (например, тэги <div></div>)?',
        'Как вернуть индекс первой ошибочной скобки, а не просто true/false?',
      ],
      relatedChapterId: 'classic-patterns',
    },
    {
      id: 'sq-iq5',
      question: 'Как реализовать очередь через два стека? Почему amortized O(1)?',
      shortAnswer:
        'Два стека: in для входящих, out для исходящих. enqueue — push в in. dequeue — если out пуст, перекладываем все элементы из in в out (порядок развернётся), затем pop из out. Каждый элемент перекладывается ровно один раз → amortized O(1).',
      fullAnswer: `**Алгоритм.**

\`\`\`js
class MyQueue {
  constructor() { this.in = []; this.out = []; }

  enqueue(x) {
    this.in.push(x);                    // O(1)
  }

  dequeue() {
    if (this.out.length === 0) {        // перекладываем только когда out пуст
      while (this.in.length) {
        this.out.push(this.in.pop());
      }
    }
    return this.out.pop();              // O(1)
  }
}
\`\`\`

**Почему это FIFO.** При перекладке из \`in\` в \`out\` порядок зеркалится: первым в \`in\` лежит самый старый элемент (он на дне), а после перекладки он окажется на вершине \`out\` — то есть его и снимет следующий \`pop\`. Идеально соответствует FIFO.

**Анализ сложности.** В худшем случае одно конкретное \`dequeue\` стоит O(n) — когда \`out\` пуст и нужно перелить весь \`in\`. Но **каждый элемент** перекладывается из \`in\` в \`out\` **ровно один раз** за всю свою жизнь в очереди. Получаем: 2n операций push+pop на n элементов → amortized O(1) на операцию.

**Метод банкира.** Можно представить, что при \`enqueue\` мы платим 3 «токена»: 1 за саму операцию, 1 за будущий \`pop\` из in, 1 за \`push\` в out. Тогда у каждого \`dequeue\` есть оплаченные операции, и средняя стоимость — константа.

**Когда это полезно.** Классический интервью-вопрос. На практике в JavaScript обычно дешевле взять очередь с указателем головы или двусвязный список. Двух-стековая реализация эффектна на собеседованиях и в задачах, где нет произвольного доступа (например, реализация очереди только через стек-API).

**Симметричная задача.** «Стек на двух очередях» решается симметрично, но с худшей оценкой: одна из операций будет O(n) даже в среднем (push или pop, в зависимости от выбранной стратегии). На собеседовании уточните, какую операцию делать дешёвой.`,
      followUps: [
        'Как реализовать стек на двух очередях? В каком случае это бессмысленно?',
        'Почему перекладывать нужно только когда out пуст, а не при каждом dequeue?',
      ],
      relatedChapterId: 'queue-tricks',
    },
    {
      id: 'sq-iq6',
      question: 'Что произойдёт при pop() на пустом стеке в JavaScript? Как защититься от этого?',
      shortAnswer:
        'Array.pop на пустом массиве возвращает undefined и не бросает ошибку. Это типичный источник тихих багов. Защита — проверять stack.length перед pop или явно сравнивать результат с ожидаемым значением.',
      fullAnswer: `\`Array.pop\` определён в ECMAScript так: если длина массива равна нулю, возвращается \`undefined\`, длина не меняется. Никаких исключений не выбрасывается. Это удобно для лаконичного кода, но опасно для логики.

**Антипаттерн.**

\`\`\`js
function process(actions) {
  const stack = [];
  for (const a of actions) {
    if (a === 'undo') stack.pop();         // молча возвращает undefined
    else stack.push(a);
  }
  return stack[stack.length - 1];
}
\`\`\`

Здесь \`undo\` без предшествующего \`push\` ничего не сделает, что может быть и не тем, чего хочет бизнес-логика. Хуже, когда мы используем результат:

\`\`\`js
function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  for (const ch of s) {
    if ('([{'.includes(ch)) stack.push(ch);
    else if (stack.pop() !== pairs[ch]) return false;
  }
  return true;          // ← баг: вернёт true для "((", потому что цикл прошёл без pop
}
\`\`\`

**Защита.**

1. Финальная проверка \`stack.length === 0\` для алгоритмов, требующих полного «закрытия».
2. Явная проверка перед pop: \`if (stack.length === 0) return false;\`.
3. Использовать \`undefined\` как заведомо несовпадающее значение — приём из примера с \`pairs[ch]\` работает именно так: \`undefined !== '('\` всегда даёт \`true\`, а это и есть «несбалансированно».
4. В продакшен-коде с TypeScript — обернуть стек в класс с типом \`pop(): T | undefined\` и заставить компилятор требовать narrowing.

**Полезное наблюдение.** Идиоматичный код вроде \`stack.pop() !== pairs[ch]\` использует тот факт, что pop на пустом → undefined, а \`pairs[ch]\` — строка → они не равны. Это сжатый, но требует комментария: код читается «либо стек пуст, либо вершина не соответствует» в одном выражении.`,
      followUps: [
        'Почему Array.pop не бросает RangeError, как, например, Array.from на отрицательной длине?',
        'Как написать стек, в котором pop на пустом всегда бросает исключение?',
      ],
      relatedChapterId: 'pitfalls',
    },
  ],

  nextTopics: [
    {
      slug: 'trees',
      reason:
        'BFS-обход дерева — главное применение очереди, а итеративный DFS строится на явном стеке. Стеки и очереди — необходимый фундамент перед обходами деревьев и графов.',
    },
    {
      slug: 'hash-map',
      reason:
        'Многие задачи на стеки (Next Greater Element II, RPN с переменными) комбинируются с хеш-таблицами для индексации. После стеков логично перейти к hash-map.',
    },
  ],

  related: [
    {
      kind: 'pattern',
      id: 'monotonic-stack',
      label: 'Паттерн: монотонный стек',
    },
    {
      kind: 'pitfall',
      id: 'shift-on-large-array',
      label: 'Подводный камень: Array.shift на больших данных',
    },
  ],
};
