import type { TopicQuiz } from '../../types/quiz';

export const stacksQueuesQuiz: TopicQuiz = {
  topicId: 'stacks-queues',
  questions: [
    // ===== EASY (1–6): базовые операции со стеком и очередью =====
    {
      type: 'fill-blank',
      id: 'sq-q1',
      description:
        'Заполните пропуск в функции проверки валидных скобок. Когда встречаем закрывающую скобку, нужно достать последнюю открывающую из стека.',
      codeWithBlanks: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };

  for (const ch of s) {
    if ('({['.includes(ch)) {
      stack.push(ch);
    } else {
      const last = stack.___();
      if (last !== pairs[ch]) return false;
    }
  }

  return stack.length === 0;
}`,
      options: ['push', 'pop', 'shift', 'peek'],
      correctIndex: 1,
      explanation:
        'Нужен метод pop() — он извлекает и возвращает последний элемент стека (вершину). push() добавляет элемент, shift() извлекает первый (это для очереди), а peek() не существует у массивов в JS.',
    },
    {
      type: 'output',
      id: 'sq-q2',
      description: 'Что вернёт вызов isValid("([)]")?',
      code: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };

  for (const ch of s) {
    if ('({['.includes(ch)) {
      stack.push(ch);
    } else {
      if (stack.length === 0) return false;
      const last = stack.pop();
      if (last !== pairs[ch]) return false;
    }
  }

  return stack.length === 0;
}

console.log(isValid("([)]"));`,
      options: ['true', 'false', 'Error', 'undefined'],
      correctIndex: 1,
      explanation:
        'Разбираем "([)]": ( — push, [ — push, ) — pop получаем "[", но pairs[")"] = "(", "[" !== "(" — возвращаем false. Скобки вложены неправильно: правильно было бы "([])\" или "([])".',
    },
    {
      type: 'fill-blank',
      id: 'sq-q3',
      description:
        'Заполните условие в цикле while для монотонного стека в задаче Daily Temperatures. Нужно извлекать из стека дни, для которых текущий день теплее.',
      codeWithBlanks: `function dailyTemperatures(temps) {
  const result = new Array(temps.length).fill(0);
  const stack = [];

  for (let i = 0; i < temps.length; i++) {
    while (stack.length > 0 && ___) {
      const prev = stack.pop();
      result[prev] = i - prev;
    }
    stack.push(i);
  }

  return result;
}`,
      options: [
        'temps[i] < temps[stack[stack.length - 1]]',
        'temps[i] > temps[stack[stack.length - 1]]',
        'temps[i] === temps[stack[stack.length - 1]]',
        'i > stack[stack.length - 1]',
      ],
      correctIndex: 1,
      explanation:
        'Мы ищем «следующий более тёплый день». Когда текущая температура temps[i] больше температуры дня на вершине стека temps[stack[stack.length - 1]], значит мы нашли ответ для того дня — извлекаем его и записываем разницу индексов.',
    },
    {
      type: 'tracing',
      id: 'sq-q4',
      description:
        'Проследите выполнение isValid("({[]})") шаг за шагом. Является ли строка валидной?',
      code: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };

  for (const ch of s) {
    if ('({['.includes(ch)) {
      stack.push(ch);
    } else {
      if (stack.length === 0) return false;
      const last = stack.pop();
      if (last !== pairs[ch]) return false;
    }
  }

  return stack.length === 0;
}`,
      steps: [
        { label: 'ch="("', variables: { stack: '["("]', action: 'push' } },
        { label: 'ch="{"', variables: { stack: '["(", "{"]', action: 'push' } },
        { label: 'ch="["', variables: { stack: '["(", "{", "["]', action: 'push' } },
        { label: 'ch="]"', variables: { stack: '["(", "{"]', last: '[', match: 'true' } },
        { label: 'ch="}"', variables: { stack: '["("]', last: '{', match: 'true' } },
        { label: 'ch=")"', variables: { stack: '[]', last: '(', match: 'true' } },
      ],
      question: 'Является ли строка "({[]})" валидной?',
      options: ['true', 'false'],
      correctIndex: 0,
      explanation:
        'Каждая закрывающая скобка совпала с соответствующей открывающей: ] → [, } → {, ) → (. В конце стек пуст, значит строка валидна — возвращаем true.',
    },
    {
      type: 'output',
      id: 'sq-q5',
      description: 'Что вернёт вызов evalRPN(["2", "1", "+", "3", "*"])?',
      code: `function evalRPN(tokens) {
  const stack = [];

  for (const token of tokens) {
    if (['+', '-', '*', '/'].includes(token)) {
      const b = stack.pop();
      const a = stack.pop();
      switch (token) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/': stack.push(Math.trunc(a / b)); break;
      }
    } else {
      stack.push(Number(token));
    }
  }

  return stack[0];
}

console.log(evalRPN(["2", "1", "+", "3", "*"]));`,
      options: ['6', '7', '9', '3'],
      correctIndex: 2,
      explanation:
        'Разбираем пошагово: "2" → push 2, "1" → push 1, "+" → pop 1 и 2, push 2+1=3, "3" → push 3, "*" → pop 3 и 3, push 3*3=9. Результат: 9. Выражение эквивалентно (2 + 1) * 3 = 9.',
    },
    {
      type: 'complexity',
      id: 'sq-q6',
      description:
        'Какова временная сложность проверки сбалансированных скобок для строки длины n?',
      code: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };

  for (const ch of s) {
    if ('({['.includes(ch)) {
      stack.push(ch);
    } else {
      if (stack.length === 0) return false;
      const last = stack.pop();
      if (last !== pairs[ch]) return false;
    }
  }

  return stack.length === 0;
}`,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctIndex: 2,
      explanation:
        'Мы проходим строку один раз — цикл выполняется n итераций. На каждой итерации операции push(), pop() и проверка в includes() выполняются за O(1) (строка "({[" фиксированной длины 3). Итого: O(n) по времени и O(n) по памяти (в худшем случае все символы — открывающие скобки).',
    },

    // ===== INTERMEDIATE (7–11): MinStack, RPN детали, монотонный стек, очередь на двух стеках =====
    {
      type: 'fill-blank',
      id: 'sq-q7',
      description:
        'Заполните пропуск в методе getMin() класса MinStack. Нужно вернуть минимальный элемент за O(1), используя вспомогательный стек.',
      codeWithBlanks: `class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }

  push(val) {
    this.stack.push(val);
    const min = this.minStack.length === 0
      ? val
      : Math.min(val, this.minStack[this.minStack.length - 1]);
    this.minStack.push(min);
  }

  pop() {
    this.stack.pop();
    this.minStack.pop();
  }

  top() {
    return this.stack[this.stack.length - 1];
  }

  getMin() {
    return this.___[this.___.length - 1];
  }
}`,
      options: ['stack', 'minStack', 'min', 'queue'],
      correctIndex: 1,
      explanation:
        'getMin() должен возвращать верхний элемент вспомогательного стека minStack — на его вершине всегда хранится текущий минимум. Каждый push() записывает в minStack минимум между новым значением и предыдущим минимумом, а pop() синхронно удаляет элемент из обоих стеков.',
    },
    {
      type: 'tracing',
      id: 'sq-q8',
      description:
        'Проследите работу MinStack: push(-2), push(0), push(-3), getMin(), pop(), top(), getMin(). Что вернут вызовы getMin() и top()?',
      code: `class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }
  push(val) {
    this.stack.push(val);
    const min = this.minStack.length === 0
      ? val
      : Math.min(val, this.minStack[this.minStack.length - 1]);
    this.minStack.push(min);
  }
  pop() { this.stack.pop(); this.minStack.pop(); }
  top() { return this.stack[this.stack.length - 1]; }
  getMin() { return this.minStack[this.minStack.length - 1]; }
}

const ms = new MinStack();
ms.push(-2); ms.push(0); ms.push(-3);
console.log(ms.getMin()); // ?
ms.pop();
console.log(ms.top());    // ?
console.log(ms.getMin()); // ?`,
      steps: [
        { label: 'push(-2)', variables: { stack: '[-2]', minStack: '[-2]' } },
        { label: 'push(0)', variables: { stack: '[-2, 0]', minStack: '[-2, -2]' } },
        { label: 'push(-3)', variables: { stack: '[-2, 0, -3]', minStack: '[-2, -2, -3]' } },
        { label: 'getMin()', variables: { result: -3 } },
        { label: 'pop()', variables: { stack: '[-2, 0]', minStack: '[-2, -2]' } },
        { label: 'top()', variables: { result: 0 } },
        { label: 'getMin()', variables: { result: -2 } },
      ],
      question: 'Какие значения выведут три console.log подряд?',
      options: ['-3, 0, -2', '-3, -2, -2', '-2, 0, -3', '-3, 0, -3'],
      correctIndex: 0,
      explanation:
        'После трёх push: minStack = [-2, -2, -3]. Первый getMin() → -3 (вершина minStack). После pop(): стеки теряют последний элемент. top() → 0 (вершина stack). Второй getMin() → -2 (вершина minStack). Итого: -3, 0, -2.',
    },
    {
      type: 'output',
      id: 'sq-q9',
      description:
        'Что вернёт вызов evalRPN(["4", "13", "5", "/", "+"])? Обратите внимание на целочисленное деление (Math.trunc).',
      code: `function evalRPN(tokens) {
  const stack = [];

  for (const token of tokens) {
    if (['+', '-', '*', '/'].includes(token)) {
      const b = stack.pop();
      const a = stack.pop();
      switch (token) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/': stack.push(Math.trunc(a / b)); break;
      }
    } else {
      stack.push(Number(token));
    }
  }

  return stack[0];
}

console.log(evalRPN(["4", "13", "5", "/", "+"]));`,
      options: ['4', '6', '7', '5'],
      correctIndex: 1,
      explanation:
        'Пошагово: "4" → push 4, "13" → push 13, "5" → push 5, "/" → pop 5 и 13, push Math.trunc(13/5) = Math.trunc(2.6) = 2, "+" → pop 2 и 4, push 4+2 = 6. Результат: 6. Ключевой момент — Math.trunc отбрасывает дробную часть в сторону нуля.',
    },
    {
      type: 'fill-blank',
      id: 'sq-q10',
      description:
        'Заполните пропуск в функции nextGreaterElement, использующей монотонный стек. Нужно записать результат для элемента, для которого мы нашли «следующий больший».',
      codeWithBlanks: `function nextGreaterElement(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = []; // хранит индексы

  for (let i = 0; i < nums.length; i++) {
    while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
      const idx = stack.pop();
      result[idx] = ___;
    }
    stack.push(i);
  }

  return result;
}

// nextGreaterElement([2, 1, 2, 4, 3]) → [4, 2, 4, -1, -1]`,
      options: ['nums[idx]', 'nums[i]', 'i - idx', 'nums[stack[stack.length - 1]]'],
      correctIndex: 1,
      explanation:
        'Когда nums[i] > nums[stack.top], мы нашли «следующий больший элемент» для nums[idx]. Результат — значение текущего элемента nums[i], а не разница индексов (как в Daily Temperatures). Задача просит само значение следующего большего элемента.',
    },
    {
      type: 'tracing',
      id: 'sq-q11',
      description:
        'Проследите реализацию очереди на двух стеках. Какой элемент вернёт последний peek()?',
      code: `class MyQueue {
  constructor() {
    this.inStack = [];
    this.outStack = [];
  }
  push(x) { this.inStack.push(x); }
  _move() {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop());
      }
    }
  }
  pop() { this._move(); return this.outStack.pop(); }
  peek() { this._move(); return this.outStack[this.outStack.length - 1]; }
}

const q = new MyQueue();
q.push(1); q.push(2); q.push(3);
console.log(q.pop());   // ?
q.push(4);
console.log(q.peek());  // ?`,
      steps: [
        { label: 'push(1)', variables: { inStack: '[1]', outStack: '[]' } },
        { label: 'push(2)', variables: { inStack: '[1, 2]', outStack: '[]' } },
        { label: 'push(3)', variables: { inStack: '[1, 2, 3]', outStack: '[]' } },
        { label: 'pop() → _move()', variables: { inStack: '[]', outStack: '[3, 2, 1]' } },
        { label: 'pop() → return', variables: { inStack: '[]', outStack: '[3, 2]', result: 1 } },
        { label: 'push(4)', variables: { inStack: '[4]', outStack: '[3, 2]' } },
        { label: 'peek() → _move() пропущен (outStack не пуст)', variables: { inStack: '[4]', outStack: '[3, 2]', result: 2 } },
      ],
      question: 'Какие значения выведут pop() и peek()?',
      options: ['1, 2', '1, 4', '3, 2', '3, 4'],
      correctIndex: 0,
      explanation:
        'При pop() outStack пуст — перекладываем все из inStack: [3,2,1]. pop() возвращает 1 (вершина outStack). Затем push(4) идёт в inStack. При peek() outStack НЕ пуст ([3,2]) — перекладки не происходит, возвращаем вершину outStack = 2. Именно поэтому очередь сохраняет порядок FIFO.',
    },

    // ===== HARDER MIDDLE (12–16): гистограмма, simplify path, decode string, asteroid collision, sliding window max =====
    {
      type: 'complexity',
      id: 'sq-q12',
      description:
        'Какова временная сложность алгоритма нахождения площади наибольшего прямоугольника в гистограмме с использованием монотонного стека?',
      code: `function largestRectangleArea(heights) {
  const stack = []; // хранит индексы столбцов
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
      options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(n · h), где h — макс. высота'],
      correctIndex: 2,
      explanation:
        'Каждый столбец добавляется в стек ровно один раз и извлекается из него максимум один раз. Хотя внутри for есть while, суммарное количество операций pop() за весь алгоритм не превышает n. Поэтому общая сложность — O(n), а не O(n²). Это ключевое преимущество монотонного стека.',
    },
    {
      type: 'output',
      id: 'sq-q13',
      description:
        'Что вернёт вызов simplifyPath("/a/./b/../../c/")? Стек используется для обработки компонентов пути.',
      code: `function simplifyPath(path) {
  const stack = [];
  const parts = path.split('/');

  for (const part of parts) {
    if (part === '' || part === '.') {
      continue;
    } else if (part === '..') {
      stack.pop();
    } else {
      stack.push(part);
    }
  }

  return '/' + stack.join('/');
}

console.log(simplifyPath("/a/./b/../../c/"));`,
      options: ['/a/b/c', '/c', '/a/c', '/a/b/../c'],
      correctIndex: 1,
      explanation:
        'Разбиваем путь: ["", "a", ".", "b", "..", "..", "c", ""]. Пропускаем "" и ".". "a" → push "a". "b" → push "b". Первый ".." → pop "b". Второй ".." → pop "a". "c" → push "c". Стек: ["c"]. Результат: "/c". Символ ".." поднимает на уровень выше, как cd .. в терминале.',
    },
    {
      type: 'tracing',
      id: 'sq-q14',
      description:
        'Проследите выполнение decodeString("3[a2[c]]"). Стек используется для обработки вложенных скобок.',
      code: `function decodeString(s) {
  const countStack = [];
  const strStack = [];
  let currentStr = '';
  let k = 0;

  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      k = k * 10 + Number(ch);
    } else if (ch === '[') {
      countStack.push(k);
      strStack.push(currentStr);
      currentStr = '';
      k = 0;
    } else if (ch === ']') {
      const repeatCount = countStack.pop();
      const prevStr = strStack.pop();
      currentStr = prevStr + currentStr.repeat(repeatCount);
    } else {
      currentStr += ch;
    }
  }

  return currentStr;
}

console.log(decodeString("3[a2[c]]"));`,
      steps: [
        { label: 'ch="3"', variables: { k: 3, currentStr: '', countStack: '[]', strStack: '[]' } },
        { label: 'ch="["', variables: { k: 0, currentStr: '', countStack: '[3]', strStack: '[""]' } },
        { label: 'ch="a"', variables: { k: 0, currentStr: 'a', countStack: '[3]', strStack: '[""]' } },
        { label: 'ch="2"', variables: { k: 2, currentStr: 'a', countStack: '[3]', strStack: '[""]' } },
        { label: 'ch="["', variables: { k: 0, currentStr: '', countStack: '[3, 2]', strStack: '["", "a"]' } },
        { label: 'ch="c"', variables: { k: 0, currentStr: 'c', countStack: '[3, 2]', strStack: '["", "a"]' } },
        { label: 'ch="]" (внутренний)', variables: { k: 0, currentStr: 'acc', countStack: '[3]', strStack: '[""]' } },
        { label: 'ch="]" (внешний)', variables: { k: 0, currentStr: 'accaccacc', countStack: '[]', strStack: '[]' } },
      ],
      question: 'Какой результат вернёт decodeString("3[a2[c]]")?',
      options: ['accaccacc', 'aaccaacc', '3a2c', 'acacacac'],
      correctIndex: 0,
      explanation:
        'Сначала раскрываем внутренние скобки: 2[c] → "cc". Подставляем: "a" + "cc" = "acc". Затем раскрываем внешние: 3["acc"] → "accaccacc". Два стека работают синхронно: countStack хранит множители, strStack — накопленные строки до открывающей скобки.',
    },
    {
      type: 'output',
      id: 'sq-q15',
      description:
        'Что вернёт asteroidCollision([5, 10, -5])? Стек моделирует столкновения астероидов (положительные летят вправо, отрицательные — влево).',
      code: `function asteroidCollision(asteroids) {
  const stack = [];

  for (const ast of asteroids) {
    let alive = true;

    while (alive && ast < 0 && stack.length > 0 && stack[stack.length - 1] > 0) {
      const top = stack[stack.length - 1];
      if (top < -ast) {
        stack.pop();       // верхний взрывается
      } else if (top === -ast) {
        stack.pop();       // оба взрываются
        alive = false;
      } else {
        alive = false;     // текущий взрывается
      }
    }

    if (alive) stack.push(ast);
  }

  return stack;
}

console.log(asteroidCollision([5, 10, -5]));`,
      options: ['[5, 10]', '[5, 10, -5]', '[5]', '[10]'],
      correctIndex: 0,
      explanation:
        'Астероид 5 → push. Астероид 10 → push (оба летят вправо, не сталкиваются). Астероид -5 → летит влево, сталкивается с 10 (вершина стека). |10| > |-5| — астероид -5 взрывается, 10 остаётся. Стек: [5, 10].',
    },
    {
      type: 'fill-blank',
      id: 'sq-q16',
      description:
        'Заполните пропуск в алгоритме Sliding Window Maximum. Дек (deque) хранит индексы элементов в убывающем порядке значений. Нужно удалить из конца дека элементы, меньшие текущего.',
      codeWithBlanks: `function maxSlidingWindow(nums, k) {
  const result = [];
  const deque = []; // хранит индексы

  for (let i = 0; i < nums.length; i++) {
    // удаляем индексы, вышедшие за окно
    if (deque.length > 0 && deque[0] <= i - k) {
      deque.shift();
    }

    // удаляем из конца все индексы, чьи значения ≤ текущего
    while (deque.length > 0 && ___) {
      deque.pop();
    }

    deque.push(i);

    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }

  return result;
}

// maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3) → [3,3,5,5,6,7]`,
      options: [
        'nums[deque[0]] <= nums[i]',
        'nums[deque[deque.length - 1]] <= nums[i]',
        'nums[deque[deque.length - 1]] >= nums[i]',
        'deque[deque.length - 1] <= i',
      ],
      correctIndex: 1,
      explanation:
        'Мы поддерживаем дек в порядке убывания значений. Если значение элемента на конце дека (nums[deque[deque.length - 1]]) меньше или равно текущему (nums[i]), он никогда не станет максимумом окна — удаляем его. Так голова дека (deque[0]) всегда содержит индекс максимального элемента в текущем окне.',
    },
  ],
};
