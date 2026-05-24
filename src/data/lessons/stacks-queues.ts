import type { Lesson } from '../../types/lesson';
import { stacksQueuesQuiz } from '../quizzes/stacks-queues';

const Q = Object.fromEntries(stacksQueuesQuiz.questions.map((q) => [q.id, q]));

// Вопросы из квиза, идущие как чекпоинты. Не должны дублироваться в finalQuiz.
const CHECKPOINT_IDS = new Set(['sq-q1', 'sq-q3', 'sq-q6', 'sq-q11', 'sq-q12']);

export const stacksQueuesLesson: Lesson = {
  topicId: 'stacks-queues',

  intro: {
    whyItMatters: `Стек и очередь — две базовые структуры данных, на которых стоит половина алгоритмов. Стек работает по принципу LIFO (последний пришёл — первый ушёл), очередь — FIFO (первый пришёл — первый ушёл).

В JavaScript обычный \`Array\` уже является стеком: \`push\` и \`pop\` работают за O(1). С очередью сложнее: \`Array.shift\` стоит O(n), потому что сдвигает все элементы влево. На собеседовании проверяют не столько знание API, сколько умение распознать, что в задаче спрятан стек (валидные скобки, монотонный стек, итеративный DFS), и трюки, позволяющие сделать FIFO за O(1).`,
    estimatedMinutes: 28,
    interviewAngle:
      'Интервьюера интересуют три вещи: что \`Array.shift\` стоит O(n) и как обойти это ограничение; в каких задачах применим монотонный стек и почему он даёт O(n); когда рекурсию имеет смысл переписать на итерацию через явный стек, чтобы не упереться в лимит call stack.',
    prerequisites: [],
  },

  chapters: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'stack-basics',
      title: 'Стек: LIFO и операции за O(1)',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Стек — структура по принципу LIFO: последний добавленный элемент извлекается первым. Аналогия — стопка тарелок: класть и брать можно только сверху.',
        },
        {
          type: 'visualization',
          content: '',
          vizId: 'stacks-queues',
        },
        { type: 'heading', content: 'Базовый API' },
        {
          type: 'list',
          content: `\`push(x)\` — положить элемент на вершину, O(1).
\`pop()\` — снять и вернуть верхний элемент, O(1).
\`peek()\` (или \`top\`) — посмотреть на вершину без удаления.
\`isEmpty()\` — проверка пустоты.`,
        },
        {
          type: 'text',
          content:
            'В JavaScript для стека отдельный класс не нужен — массив с \`push\` и \`pop\` уже даёт всё необходимое. V8 хранит массив в растущем буфере, поэтому \`push\` амортизированно O(1): иногда буфер удваивается за O(n), но в среднем по серии операций цена константная.',
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
          type: 'text',
          content:
            'Стек незаметно прячется во многих местах разработки. Call stack движка — буквально стек вызовов. История переходов в браузере — стек, кнопка «назад» делает pop. Undo/Redo в редакторе — два стека: один для отката, второй для повтора. Задачи «валидные скобки», «упрощение пути», «декодирование строки» — все сводятся к паттерну push / pop.',
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '\`stack.pop()\` на пустом массиве возвращает \`undefined\`, а не бросает ошибку. Это самый частый источник тихих багов в задачах со скобками и парсерами. Защита — проверка \`stack.length > 0\` перед \`pop\` или финальная проверка \`stack.length === 0\` после цикла.',
        },
      ],
      checkpoint: [Q['sq-q1']!, Q['sq-q6']!, {
        type: 'ordering',
        id: 'sq-ord1',
        description: 'Расставьте операции: после трёх push(1), push(2), push(3) — что вернут два pop()?',
        items: [
          'push(1) → стек: [1]',
          'push(2) → стек: [1, 2]',
          'push(3) → стек: [1, 2, 3]',
          'pop() возвращает 3, стек: [1, 2]',
          'pop() возвращает 2, стек: [1]',
        ],
        explanation:
          'Стек работает по LIFO: последний добавленный извлекается первым. В JavaScript массив: \`push\` добавляет в конец, \`pop\` берёт из конца.',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'queue-basics',
      title: 'Очередь: FIFO и проблема shift',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Очередь — структура FIFO: первый пришедший уходит первым. В алгоритмах это главная структура для обхода в ширину (BFS): порядок обработки гарантирует кратчайший путь в невзвешенном графе.',
        },
        {
          type: 'visualization',
          content: '',
          vizId: 'queue',
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
            '\`Array.shift\` сдвигает все оставшиеся элементы на одну позицию влево, поэтому стоит O(n). На очереди из миллиона элементов цикл с \`shift\` превращается в O(n²). Это тихо превращает линейный BFS в квадратичный, и на больших тестах он улетает в таймаут.',
        },
        { type: 'heading', content: 'Очередь за O(1) через указатель головы' },
        {
          type: 'text',
          content:
            'Простой и достаточный для большинства задач трюк — не сдвигать массив физически, а двигать указатель головы. Память не освобождается мгновенно, но \`enqueue\` и \`dequeue\` работают за константу.',
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
    this.data.push(x);                  // O(1) амортизированно
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
            'Альтернативы — двусвязный список и кольцевой буфер. В Node.js пакет \`denque\` реализует двустороннюю очередь на массиве массивов и работает с O(1) на оба конца.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'classic-patterns',
      title: 'Классические задачи на стек',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Базовый паттерн: проходим коллекцию слева направо, кладём элемент на стек, при встрече «закрывающего» — снимаем с вершины и проверяем. По этому шаблону решаются десятки задач: валидные скобки, упрощение пути, декодирование строки, RPN.',
        },
        { type: 'heading', content: 'Сбалансированные скобки' },
        {
          type: 'text',
          content:
            'Открывающую скобку кладём на стек, закрывающую — извлекаем верхнюю и проверяем, что они парные. В конце стек должен быть пуст.',
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
            '\`stack.pop()\` на пустом стеке возвращает \`undefined\` — это значение не равно ни одной открывающей скобке, поэтому отдельная проверка пустоты не нужна. Финальное \`return stack.length === 0\` обрабатывает случай «слишком много открывающих».',
        },
        { type: 'heading', content: 'Постфиксная нотация (RPN)' },
        {
          type: 'text',
          content:
            'Калькулятор обратной польской записи — пример «вычисления» стеком. Числа кладём на стек; встретив оператор, снимаем два операнда, применяем операцию, кладём результат обратно.',
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
            'Идея — параллельно с основным стеком вести вспомогательный, на вершине которого всегда лежит минимум текущего состояния. При \`push\` сравниваем новый элемент с вершиной \`minStack\` и кладём минимум; при \`pop\` снимаем с обоих стеков синхронно.',
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
      checkpoint: [Q['sq-q3']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'monotonic-stack',
      title: 'Монотонный стек',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Монотонный стек — обычный стек с одним правилом: перед тем как положить новый элемент, выталкиваются все, нарушающие нужный порядок (убывающий или возрастающий). Это позволяет решать за O(n) задачи, наивная сложность которых O(n²).',
        },
        {
          type: 'visualization',
          content: '',
          vizId: 'monotonic-stack',
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
            'Несмотря на вложенный \`while\` внутри \`for\`, сложность — O(n). Каждый индекс кладётся в стек ровно один раз и извлекается максимум один раз — итого ≤ 2n операций.',
        },
        { type: 'heading', content: 'Daily Temperatures (LeetCode 739): пошагово' },
        {
          type: 'text',
          content:
            'Для массива \`[73, 74, 75, 71, 69, 72, 76, 73]\` нужно определить, через сколько дней станет теплее. Ниже — трассировка стека индексов:',
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
          content: `Daily Temperatures (LeetCode 739).
Next Greater Element I / II (LeetCode 496 / 503) — во второй задаче массив циклический.
Largest Rectangle in Histogram (LeetCode 84) — основа для Maximal Rectangle.
Stock Span Problem — биржевые задачи.
Trapping Rain Water (один из подходов).`,
        },
      ],
      playground: {
        starterCode: `// Реализуйте «следующий меньший элемент» через монотонный стек.
// Для каждого nums[i] верните ближайший справа элемент,
// строго меньший nums[i]. Если такого нет — −1.
//
// Подсказка: стек должен быть монотонно возрастающим по значениям.

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
          'Симметричный шаблон: меняется только знак сравнения с \`>\` на \`<\`. Тот же стек ищет ближайший меньший элемент справа.',
      },
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'queue-tricks',
      title: 'Очередь на двух стеках и deque',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Распространённый собеседовательный вопрос — реализовать очередь через два стека. \`inStack\` принимает новые элементы, \`outStack\` отдаёт старые. Когда \`outStack\` пустеет, элементы перекладываются из \`inStack\` — порядок зеркалится и получается FIFO.',
        },
        { type: 'heading', content: 'FIFO на двух стеках за амортизированное O(1)' },
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
          calloutType: 'warning',
          content:
            'Перекладывать нужно только когда \`outStack\` пуст. Если делать это при каждом \`dequeue\`, уже правильный порядок в \`outStack\` сломается, и FIFO перестанет работать. Это типичный уточняющий вопрос на собеседовании.',
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Амортизированная сложность \`dequeue\` — O(1): каждый элемент перекладывается из \`in\` в \`out\` ровно один раз за всю свою жизнь. В худшем случае одно конкретное \`dequeue\` стоит O(n), но средняя стоимость на длинной серии — константа.',
        },
        { type: 'heading', content: 'Двусторонняя очередь и максимум в скользящем окне' },
        {
          type: 'text',
          content:
            'Deque (двусторонняя очередь) — структура с \`push\` и \`pop\` на обоих концах за O(1). Основное применение в алгоритмах — поиск максимума в скользящем окне за O(n). Идея: поддерживаем дек индексов так, чтобы соответствующие значения шли по убыванию. Голова дека — индекс текущего максимума.',
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
          'После первого \`dequeue\` \`out = [3, 2]\` (вершина — 2). Новый \`enqueue(4)\` идёт в \`in\`, а не в \`out\`. Второй \`dequeue\` берёт элемент из \`out\` и возвращает 2.',
      },
      checkpoint: [Q['sq-q11']!, Q['sq-q12']!, {
        type: 'match-pairs',
        id: 'sq-mp1',
        description: 'Сопоставьте структуру данных с паттерном применения',
        pairs: [
          { left: 'Стек', right: 'Undo / Redo, обход DFS, парные скобки' },
          { left: 'Очередь', right: 'Обход BFS, очередь задач, буфер событий' },
          { left: 'Монотонный стек', right: 'Поиск следующего большего или меньшего элемента' },
          { left: 'Двусторонняя очередь', right: 'Максимум в скользящем окне, проверка палиндрома' },
        ],
        explanation:
          'Стек (LIFO) удобен, когда нужно «вернуться назад». Очередь (FIFO) — для обработки в порядке поступления. Монотонный стек — специализированная структура для задач «следующий больший / меньший».',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'pitfalls',
      title: 'Подводные камни',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Ошибки в задачах на стеки и очереди обычно не алгоритмические, а связаны с деталями: забытая проверка пустого стека, перепутанные \`pop\` и \`shift\`, отсутствующее финальное условие \`stack.length === 0\`.',
        },
        { type: 'heading', content: 'Array.shift в горячем цикле' },
        {
          type: 'text',
          content:
            'Самая частая ошибка в BFS-задачах — использовать \`Array.shift\` для очереди. На малых входах работает, на 10⁶ элементах превращает линейный алгоритм в O(n²). Решение — указатель головы, библиотека \`denque\` или двусвязный список.',
        },
        { type: 'heading', content: 'pop из пустого стека' },
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

// Для "((" функция вернёт true,
// хотя в стеке остались две незакрытые скобки.`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Финальная проверка \`stack.length === 0\` обязательна для алгоритмов, требующих полного «закрытия». \`pop\` на пустом стеке возвращает \`undefined\`, а не бросает ошибку — это и помогает, и подводит.',
        },
        { type: 'heading', content: 'Путаница LIFO и FIFO' },
        {
          type: 'text',
          content:
            'В реализации BFS нужна очередь (\`shift\`), в DFS — стек (\`pop\`). Перепутав методы, можно получить алгоритм с обходом «не того» порядка. На графе кратчайших путей это даёт неверные расстояния, а в игровом дереве — неверные ходы.',
        },
        { type: 'heading', content: 'Глубокая рекурсия и переполнение стека вызовов' },
        {
          type: 'text',
          content:
            'JavaScript-движки ограничивают глубину рекурсии (~10⁴ вызовов). При обходе глубокого дерева JSON или DOM рекурсивная функция упадёт с \`RangeError: Maximum call stack size exceeded\`. Решение — переписать обход через явный стек: память выделяется в куче и лимита нет.',
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
    },
  ],

  finalQuiz: stacksQueuesQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  cheatsheet: `### Шпаргалка по стекам и очередям

**Когда применять**
- Стек: парные скобки, RPN, undo / redo, итеративный DFS, монотонный стек
- Очередь: BFS, обработка задач в порядке поступления, level-order обход дерева
- Deque: максимум в скользящем окне, проверка палиндрома

**Сложность**
- Стек: \`push\` и \`pop\` — O(1)
- Очередь наивно: \`push\` — O(1), \`shift\` — O(n)
- Очередь с указателем головы: оба за O(1)
- Монотонный стек: O(n) амортизированно

**Стек на массиве**
\`\`\`js
const stack = [];
stack.push(x);
const top = stack.pop();
const peek = stack[stack.length - 1];
\`\`\`

**Очередь с указателем головы**
\`\`\`js
class Queue {
  constructor() { this.data = []; this.head = 0; }
  enqueue(x) { this.data.push(x); }
  dequeue() { return this.data[this.head++]; }
}
\`\`\`

**Монотонный стек (Next Greater Element)**
\`\`\`js
const stack = [];
for (let i = 0; i < nums.length; i++) {
  while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
    const j = stack.pop();
    res[j] = nums[i];
  }
  stack.push(i);
}
\`\`\`
- Стек хранит индексы, не значения
- Каждый индекс входит и выходит максимум один раз → O(n)

**Очередь на двух стеках**
\`\`\`js
enqueue(x) { this.in.push(x); }
dequeue() {
  if (this.out.length === 0) {
    while (this.in.length) this.out.push(this.in.pop());
  }
  return this.out.pop();
}
\`\`\`
- Перекладывать только когда \`out\` пуст
- Амортизированно O(1)

**Подводные камни**
- \`Array.shift\` стоит O(n) — на больших данных алгоритм деградирует
- \`pop\` на пустом стеке возвращает \`undefined\`, не бросает ошибку
- Финальная проверка \`stack.length === 0\` обязательна для парных структур
- Глубокая рекурсия → переполнение call stack, переписывать на итерацию с явным стеком`,

  nextTopics: [
    {
      slug: 'trees',
      reason:
        'BFS-обход дерева — главное применение очереди, итеративный DFS строится на явном стеке. Стеки и очереди — фундамент для обходов деревьев и графов.',
    },
    {
      slug: 'hash-map',
      reason:
        'Многие задачи на стеки (Next Greater Element II, RPN с переменными) комбинируются с хеш-таблицами для индексации.',
    },
  ],
};
