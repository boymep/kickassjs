import type { Problem } from '../../types/problem';

export const nodeEventLoopProblems: Problem[] = [
  {
    id: 'nodel-p1',
    topicId: 'node-event-loop',
    title: 'EventEmitter — реализация',
    difficulty: 'medium',
    isContextual: false,
    description: `Реализуйте класс \`EventEmitter\` с методами:
- \`on(event, handler)\` — подписаться на событие
- \`off(event, handler)\` — отписаться
- \`emit(event, ...args)\` — вызвать всех подписчиков
- \`once(event, handler)\` — подписаться только на первое событие

Примеры:
\`\`\`
const ee = new EventEmitter();
const fn = (x) => console.log('got:', x);
ee.on('data', fn);
ee.emit('data', 1); // 'got: 1'
ee.emit('data', 2); // 'got: 2'
ee.off('data', fn);
ee.emit('data', 3); // ничего

ee.once('end', () => console.log('end!'));
ee.emit('end'); // 'end!'
ee.emit('end'); // ничего
\`\`\``,
    functionName: 'EventEmitter',
    starterCode: `class EventEmitter {
  constructor() {
    // ваш код
  }

  on(event, handler) {
    // ваш код
  }

  off(event, handler) {
    // ваш код
  }

  emit(event, ...args) {
    // ваш код
  }

  once(event, handler) {
    // ваш код
  }
}`,
    testCases: [
      {
        id: 'nodel-p1-t1',
        inputDisplay: 'on/emit — handler вызван',
        inputArgs: ['on-emit'],
        expected: [1, 2],
      },
      {
        id: 'nodel-p1-t2',
        inputDisplay: 'off — handler больше не вызывается',
        inputArgs: ['off'],
        expected: [1],
      },
      {
        id: 'nodel-p1-t3',
        inputDisplay: 'once — вызван только один раз',
        inputArgs: ['once'],
        expected: 1,
      },
      {
        id: 'nodel-p1-t4',
        inputDisplay: 'несколько подписчиков на одно событие',
        inputArgs: ['multiple'],
        expected: 2,
      },
      {
        id: 'nodel-p1-t5',
        inputDisplay: 'emit несуществующего события — не бросает ошибку',
        inputArgs: ['no-event'],
        expected: true,
      },
    ],
    hints: [
      'Используйте Map для хранения: `this.listeners = new Map()`. Ключ — имя события, значение — Set или Array handlers.',
      'once: создайте обёртку, которая вызывает `this.off(event, wrapper)` перед вызовом оригинального handler.',
      'emit: перебирайте копию массива handlers (`[...handlers]`), чтобы избежать проблем при off внутри handler.',
    ],
    solutionCode: `class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(event, handler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(handler);
    return this;
  }

  off(event, handler) {
    if (!this.listeners.has(event)) return this;
    const handlers = this.listeners.get(event).filter((h) => h !== handler);
    this.listeners.set(event, handlers);
    return this;
  }

  emit(event, ...args) {
    if (!this.listeners.has(event)) return;
    [...this.listeners.get(event)].forEach((h) => h(...args));
  }

  once(event, handler) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      handler(...args);
    };
    return this.on(event, wrapper);
  }
}`,
  },
  {
    id: 'nodel-p2',
    topicId: 'node-event-loop',
    title: 'processChunked — обработка без блокировки',
    difficulty: 'medium',
    isContextual: true,
    description: `Реализуйте функцию \`processChunked(arr, chunkSize, processor)\`:
- Обрабатывает массив \`arr\` чанками по \`chunkSize\` элементов
- После каждого чанка отдаёт контроль event loop
- Возвращает Promise с массивом результатов
- Каждый элемент обрабатывается через \`processor(item)\`

Примеры:
\`\`\`
const result = await processChunked(
  [1, 2, 3, 4, 5],
  2,
  (x) => x * x,
);
// → [1, 4, 9, 16, 25]
// Обрабатывается: [1,2] → yield → [3,4] → yield → [5] → done
\`\`\``,
    functionName: 'processChunked',
    starterCode: `function processChunked(arr, chunkSize, processor) {
  // ваш код — используйте setTimeout для yield
}`,
    testCases: [
      {
        id: 'nodel-p2-t1',
        inputDisplay: '[1,2,3] → [1,4,9]',
        inputArgs: [[1, 2, 3], 2, 'square'],
        expected: [1, 4, 9],
      },
      {
        id: 'nodel-p2-t2',
        inputDisplay: 'пустой массив → []',
        inputArgs: [[], 5, 'identity'],
        expected: [],
      },
      {
        id: 'nodel-p2-t3',
        inputDisplay: 'chunkSize > arr.length — один чанк',
        inputArgs: [[1, 2], 100, 'double'],
        expected: [2, 4],
      },
      {
        id: 'nodel-p2-t4',
        inputDisplay: 'возвращает Promise',
        inputArgs: ['is-promise'],
        expected: true,
      },
      {
        id: 'nodel-p2-t5',
        inputDisplay: 'порядок результатов сохраняется',
        inputArgs: [[5, 4, 3, 2, 1], 2, 'identity'],
        expected: [5, 4, 3, 2, 1],
      },
    ],
    hints: [
      'Используйте `new Promise((resolve) => {...})`. Внутри объявите `index = 0` и `results = []`.',
      'Функция `processNext`: обработайте chunkSize элементов, затем `setTimeout(processNext, 0)` если ещё есть элементы, иначе `resolve(results)`.',
    ],
    solutionCode: `function processChunked(arr, chunkSize, processor) {
  return new Promise((resolve) => {
    if (arr.length === 0) { resolve([]); return; }
    let index = 0;
    const results = [];

    function processNext() {
      const end = Math.min(index + chunkSize, arr.length);
      while (index < end) {
        results.push(processor(arr[index++]));
      }
      if (index < arr.length) {
        setTimeout(processNext, 0);
      } else {
        resolve(results);
      }
    }

    processNext();
  });
}`,
  },
  {
    id: 'nodel-p3',
    topicId: 'node-event-loop',
    title: 'AsyncQueue — очередь задач с concurrency',
    difficulty: 'medium',
    isContextual: true,
    description: `Реализуйте класс \`AsyncQueue\`:
- \`constructor(concurrency)\` — максимальное количество одновременных задач
- \`push(asyncFn)\` — добавить задачу в очередь, возвращает Promise с результатом
- Задачи выполняются не более \`concurrency\` одновременно

Примеры:
\`\`\`
const queue = new AsyncQueue(2); // max 2 параллельно

const results = await Promise.all([
  queue.push(() => delay(100).then(() => 1)),
  queue.push(() => delay(100).then(() => 2)),
  queue.push(() => delay(100).then(() => 3)), // ждёт свободного слота
]);
// → [1, 2, 3]
\`\`\``,
    functionName: 'AsyncQueue',
    starterCode: `class AsyncQueue {
  constructor(concurrency) {
    // ваш код
  }

  push(asyncFn) {
    // ваш код — возвращает Promise
  }
}`,
    testCases: [
      {
        id: 'nodel-p3-t1',
        inputDisplay: '3 задачи, concurrency=2 → все выполняются',
        inputArgs: ['all-complete'],
        expected: [1, 2, 3],
      },
      {
        id: 'nodel-p3-t2',
        inputDisplay: 'push возвращает Promise',
        inputArgs: ['returns-promise'],
        expected: true,
      },
      {
        id: 'nodel-p3-t3',
        inputDisplay: 'concurrency=1 → последовательно',
        inputArgs: ['sequential'],
        expected: [1, 2, 3],
      },
      {
        id: 'nodel-p3-t4',
        inputDisplay: 'ошибка в задаче → reject промиса push',
        inputArgs: ['error'],
        expected: 'Error: task-error',
      },
      {
        id: 'nodel-p3-t5',
        inputDisplay: 'одновременно не более concurrency задач',
        inputArgs: ['max-concurrent'],
        expected: true,
      },
    ],
    hints: [
      'Храните `this.running = 0`, `this.queue = []`. При push: если running < concurrency — запускайте сразу, иначе добавляйте в queue.',
      'После завершения задачи: running--, и если queue.length > 0 — берите следующую из очереди.',
      'push возвращает Promise: передавайте resolve/reject в объект задачи и вызывайте их после выполнения asyncFn.',
    ],
    solutionCode: `class AsyncQueue {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  push(asyncFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ asyncFn, resolve, reject });
      this._run();
    });
  }

  _run() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const { asyncFn, resolve, reject } = this.queue.shift();
      this.running++;
      asyncFn()
        .then(resolve, reject)
        .finally(() => {
          this.running--;
          this._run();
        });
    }
  }
}`,
  },
  {
    id: 'nodel-p4',
    topicId: 'node-event-loop',
    title: 'PriorityQueue — очередь с приоритетами',
    difficulty: 'medium',
    isContextual: false,
    description: `Реализуйте \`PriorityQueue\`:
- \`enqueue(task, priority)\` — добавить задачу с приоритетом (меньше = важнее)
- \`dequeue()\` — извлечь задачу с наименьшим приоритетом
- \`size()\` — количество задач
- \`isEmpty()\` — пуста ли очередь

Примеры:
\`\`\`
const pq = new PriorityQueue();
pq.enqueue('low', 3);
pq.enqueue('high', 1);
pq.enqueue('medium', 2);

pq.dequeue(); // → 'high' (приоритет 1)
pq.dequeue(); // → 'medium' (приоритет 2)
pq.dequeue(); // → 'low' (приоритет 3)
\`\`\``,
    functionName: 'PriorityQueue',
    starterCode: `class PriorityQueue {
  constructor() {
    // ваш код
  }

  enqueue(task, priority) {
    // ваш код
  }

  dequeue() {
    // ваш код
  }

  size() {
    // ваш код
  }

  isEmpty() {
    // ваш код
  }
}`,
    testCases: [
      {
        id: 'nodel-p4-t1',
        inputDisplay: 'dequeue возвращает элемент с наименьшим приоритетом',
        inputArgs: ['min-priority'],
        expected: 'high',
      },
      {
        id: 'nodel-p4-t2',
        inputDisplay: 'порядок dequeue: 1,2,3',
        inputArgs: ['order'],
        expected: ['high', 'medium', 'low'],
      },
      {
        id: 'nodel-p4-t3',
        inputDisplay: 'size() после enqueue',
        inputArgs: ['size'],
        expected: 3,
      },
      {
        id: 'nodel-p4-t4',
        inputDisplay: 'isEmpty() на пустой очереди',
        inputArgs: ['empty'],
        expected: true,
      },
      {
        id: 'nodel-p4-t5',
        inputDisplay: 'dequeue из пустой → undefined',
        inputArgs: ['dequeue-empty'],
        expected: undefined,
      },
    ],
    hints: [
      'Простейшая реализация: массив `{ task, priority }`. При dequeue: найдите элемент с min priority через reduce.',
      'Более эффективная: сортируйте при вставке или используйте binary heap (но для интервью простой массив ок).',
    ],
    solutionCode: `class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(task, priority) {
    this.items.push({ task, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.items.shift()?.task;
  }

  size() {
    return this.items.length;
  }

  isEmpty() {
    return this.items.length === 0;
  }
}`,
  },
  {
    id: 'nodel-p5',
    topicId: 'node-event-loop',
    title: 'withTimeout — таймаут для промиса',
    difficulty: 'easy',
    isContextual: true,
    description: `Реализуйте функцию \`withTimeout(asyncFn, ms, fallback)\`:
- Вызывает \`asyncFn()\`
- Если промис не завершается за \`ms\` — возвращает \`fallback\` (не бросает ошибку)
- Если завершается вовремя — возвращает результат

Примеры:
\`\`\`
const slow = () => new Promise(r => setTimeout(() => r('data'), 500));

await withTimeout(slow, 100, 'default'); // → 'default' (timeout)
await withTimeout(slow, 1000, 'default'); // → 'data' (вовремя)
\`\`\``,
    functionName: 'withTimeout',
    starterCode: `async function withTimeout(asyncFn, ms, fallback) {
  // ваш код
}`,
    testCases: [
      {
        id: 'nodel-p5-t1',
        inputDisplay: 'промис вовремя → его результат',
        inputArgs: ['in-time'],
        expected: 'result',
      },
      {
        id: 'nodel-p5-t2',
        inputDisplay: 'таймаут → fallback',
        inputArgs: ['timeout'],
        expected: 'default',
      },
      {
        id: 'nodel-p5-t3',
        inputDisplay: 'fallback = null',
        inputArgs: ['null-fallback'],
        expected: null,
      },
      {
        id: 'nodel-p5-t4',
        inputDisplay: 'fallback = 0',
        inputArgs: ['zero-fallback'],
        expected: 0,
      },
      {
        id: 'nodel-p5-t5',
        inputDisplay: 'не бросает ошибку при таймауте',
        inputArgs: ['no-throw'],
        expected: true,
      },
    ],
    hints: [
      'Используйте Promise.race с двумя промисами: asyncFn() и таймер с fallback.',
      'Таймер: `new Promise(r => setTimeout(() => r(fallback), ms))` — резолвится (не реджектится!) с fallback.',
    ],
    solutionCode: `async function withTimeout(asyncFn, ms, fallback) {
  const timer = new Promise((resolve) => setTimeout(() => resolve(fallback), ms));
  return Promise.race([asyncFn(), timer]);
}`,
  },
];
