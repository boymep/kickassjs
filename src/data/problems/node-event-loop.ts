import type { Problem } from "../../types/problem";

export const nodeEventLoopProblems: Problem[] = [
  {
    id: "nodel-p1",
    topicId: "node-event-loop",
    title: "EventEmitter — реализация",
    difficulty: "medium",
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
    functionName: "EventEmitter",
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
        id: "nodel-p1-t1",
        inputDisplay: "on/emit — handler вызван",
        inputArgs: ["on-emit"],
        expected: [1, 2],
      },
      {
        id: "nodel-p1-t2",
        inputDisplay: "off — handler больше не вызывается",
        inputArgs: ["off"],
        expected: [1],
      },
      {
        id: "nodel-p1-t3",
        inputDisplay: "once — вызван только один раз",
        inputArgs: ["once"],
        expected: 1,
      },
      {
        id: "nodel-p1-t4",
        inputDisplay: "несколько подписчиков на одно событие",
        inputArgs: ["multiple"],
        expected: 2,
      },
      {
        id: "nodel-p1-t5",
        inputDisplay: "emit несуществующего события — не бросает ошибку",
        inputArgs: ["no-event"],
        expected: true,
      },
    ],
    hints: [
      "Подумайте, как сопоставить каждому имени события свой набор обработчиков и быстро добавлять, удалять и перебирать их.",
      "Удобно держать `Map` (или объект) вида `event → handler[]`. Для `once` оберните обработчик в функцию-обёртку, которая первым делом снимает подписку, а затем зовёт оригинал. В `emit` итерируйтесь по копии массива — иначе `off` внутри обработчика поломает обход.",
      `Тонкий момент — \`emit\` должен итерироваться по **копии** массива подписчиков. Иначе если внутри обработчика кто-то вызовет \`off\` (или сработает \`once\`, который снимает сам себя) — реальный массив изменится в середине обхода, индексы поплывут, и часть подписчиков будет пропущена. Для \`once\` важно зарегистрировать именно обёртку через \`on\`, а не оригинал — иначе её не получится отписать после первого вызова.

С чего начать:
\`\`\`js
class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }
  on(event, handler) { /* ... */ }
  emit(event, ...args) { /* ... */ }
}
\`\`\``,
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
    id: "nodel-p2",
    topicId: "node-event-loop",
    title: "processChunked — обработка без блокировки",
    difficulty: "medium",
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
\`\`\`

В тестах \`processChunked\` вызывается через хелпер \`nodel_p2_test\`.`,
    functionName: "nodel_p2_test",
    starterCode: `function processChunked(arr, chunkSize, processor) {
  // ваш код — используйте setTimeout для yield
}`,
    testCases: [
      {
        id: "nodel-p2-t1",
        inputDisplay: "[1,2,3] → [1,4,9]",
        inputArgs: [[1, 2, 3], 2, "square"],
        expected: [1, 4, 9],
      },
      {
        id: "nodel-p2-t2",
        inputDisplay: "пустой массив → []",
        inputArgs: [[], 5, "identity"],
        expected: [],
      },
      {
        id: "nodel-p2-t3",
        inputDisplay: "chunkSize > arr.length — один чанк",
        inputArgs: [[1, 2], 100, "double"],
        expected: [2, 4],
      },
      {
        id: "nodel-p2-t4",
        inputDisplay: "возвращает Promise",
        inputArgs: ["is-promise"],
        expected: true,
      },
      {
        id: "nodel-p2-t5",
        inputDisplay: "порядок результатов сохраняется",
        inputArgs: [[5, 4, 3, 2, 1], 2, "identity"],
        expected: [5, 4, 3, 2, 1],
      },
    ],
    hints: [
      "Обработка одной большой пачкой блокирует поток. Поделите работу на маленькие порции и между ними отдавайте управление планировщику.",
      "Заверните всё в `new Promise`. Внутри функции `processNext` обработайте один чанк, затем — если массив не закончился — поставьте следующий шаг через `setTimeout(processNext, 0)`. Когда дошли до конца — вызовите `resolve(results)`.",
      `\`setTimeout(fn, 0)\` — это макрозадача, и между двумя её вызовами event loop успевает прогнать всю очередь микрозадач и обработать I/O. То есть пока вы режете большой массив на чанки, входящие HTTP-запросы и таймеры не голодают. Если же использовать \`queueMicrotask\` или \`process.nextTick\` — это будет работать как обычный цикл: микрозадачи опустошатся целиком перед любой I/O, и блокировка вернётся.

С чего начать:
\`\`\`js
function processChunked(arr, chunkSize, processor) {
  return new Promise((resolve) => {
    const results = [];
    let index = 0;
    function processNext() { /* ... */ }
    processNext();
  });
}
\`\`\``,
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
    testHelperCode: `async function nodel_p2_test(arr, chunkSize, kind) {
  if (arr === 'is-promise') {
    const r = processChunked([1, 2, 3], 2, (x) => x);
    return r && typeof r.then === 'function';
  }
  const procs = {
    square: (x) => x * x,
    identity: (x) => x,
    double: (x) => x * 2,
  };
  const fn = procs[kind] || ((x) => x);
  return await processChunked(arr, chunkSize, fn);
}`,
  },
  {
    id: "nodel-p4",
    topicId: "node-event-loop",
    title: "PriorityQueue — очередь с приоритетами",
    difficulty: "medium",
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
    functionName: "PriorityQueue",
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
        id: "nodel-p4-t1",
        inputDisplay: "dequeue возвращает элемент с наименьшим приоритетом",
        inputArgs: ["min-priority"],
        expected: "high",
      },
      {
        id: "nodel-p4-t2",
        inputDisplay: "порядок dequeue: 1,2,3",
        inputArgs: ["order"],
        expected: ["high", "medium", "low"],
      },
      {
        id: "nodel-p4-t3",
        inputDisplay: "size() после enqueue",
        inputArgs: ["size"],
        expected: 3,
      },
      {
        id: "nodel-p4-t4",
        inputDisplay: "isEmpty() на пустой очереди",
        inputArgs: ["empty"],
        expected: true,
      },
      {
        id: "nodel-p4-t5",
        inputDisplay: "dequeue из пустой → undefined",
        inputArgs: ["dequeue-empty"],
        expected: undefined,
      },
    ],
    hints: [
      "Нужно хранить задачи вместе с их приоритетом так, чтобы можно было быстро находить самую приоритетную.",
      "Простой вариант для собеседования: массив объектов `{ task, priority }`, после каждого `enqueue` — сортировка по `priority`. Это `O(n log n)` на вставку, зато `dequeue` — это `shift()` с минимальным приоритетом в начале. Для production обычно берут бинарную кучу с `O(log n)`.",
      `Граничный случай — задачи с одинаковым приоритетом. Стабильность \`Array.prototype.sort\` гарантирована стандартом только с ES2019; в более старых движках при равных приоритетах порядок мог меняться, и FIFO внутри одного приоритета ломался. Если стабильность важна — храните счётчик вставки и сортируйте по паре \`(priority, seq)\`. В кучной реализации это решается ровно так же — секцией сравнения.

С чего начать:
\`\`\`js
class PriorityQueue {
  constructor() {
    this.items = [];
  }
  enqueue(task, priority) { /* ... */ }
  dequeue() { /* ... */ }
}
\`\`\``,
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
    kind: "predict-output",
    id: "nodel-p6",
    topicId: "node-event-loop",
    title: "Определи вывод: микрозадачи и таймер",
    difficulty: "medium",
    isContextual: false,
    description: `Что выведет этот код в среде, где доступны \`queueMicrotask\`, \`Promise\` и \`setTimeout\`? Запишите каждое значение на отдельной строке в порядке вывода.`,
    code: `console.log('A');

setTimeout(() => console.log('B'), 0);

queueMicrotask(() => {
  console.log('C');
  queueMicrotask(() => console.log('D'));
});

Promise.resolve().then(() => console.log('E'));

console.log('F');`,
    expected: "A\nF\nC\nE\nD\nB",
    hints: [
      "Прежде всего вспомните общий порядок: текущий синхронный код выполняется до конца, и только после этого начинают разбираться отложенные обработчики разных типов.",
      "Очерёдность такая: весь синхронный код → полностью опустошается очередь микрозадач (`queueMicrotask`, `Promise.then`) → одна макрозадача (`setTimeout`). Микрозадача, добавленная изнутри микрозадачи, обрабатывается в той же пачке — макрозадача ждёт.",
      `Пошагово:
- стек: \`'A'\`, ставим setTimeout (макро), ставим микро-1 (печатает 'C' и ставит микро-3), ставим микро-2 (печатает 'E'), \`'F'\`.
- очередь микро: [C, E]. Запускаем C → печатает 'C', добавляет в очередь микро D. Запускаем E → печатает 'E'. Запускаем D → 'D'. Микроочередь пуста.
- макроочередь: [B]. Запускаем → 'B'.
- Итого: A, F, C, E, D, B.`,
    ],
    solutionCode: `// Порядок:
// 1. 'A'  — синхронный console.log.
// 2. 'F'  — синхронный console.log в конце.
// 3. 'C'  — первая микрозадача из queueMicrotask.
// 4. 'E'  — Promise.resolve().then — следующая микрозадача в очереди.
// 5. 'D'  — микрозадача, добавленная внутри 'C'; обрабатывается в той же пачке.
// 6. 'B'  — макрозадача setTimeout, выполняется после того, как очередь микрозадач опустеет.`,
  },
  {
    kind: "find-bug",
    id: "nodel-p7",
    topicId: "node-event-loop",
    title: "Найдите баг: очередь задач не завершается",
    difficulty: "medium",
    isContextual: true,
    description: `Функция \`runWithDelay(initialQueue, work)\` должна:
1. Выполнить \`work(item)\` для каждого элемента из \`initialQueue\` через очередь микрозадач (имитация \`process.nextTick\`).
2. После полной обработки очереди — вернуть промис с массивом результатов.
3. Не блокировать event loop — \`setTimeout\` с задержкой 0 должен успеть выполниться до резолва промиса.

Но с пустой очередью что-то идёт не так. Найдите и исправьте.

В тестах \`runWithDelay\` вызывается через хелпер \`nodel_p7_test\`.`,
    buggyCode: `function runWithDelay(initialQueue, work) {
  const queue = [...initialQueue];
  const results = [];

  return new Promise((resolve) => {
    function step() {
      if (queue.length === 0) {
        queueMicrotask(step);
        return;
      }
      const item = queue.shift();
      results.push(work(item));
      queueMicrotask(step);
    }
    queueMicrotask(step);
  });
}`,
    functionName: "nodel_p7_test",
    bugSummary:
      "При пустой очереди функция бесконечно перепланировала саму себя через `queueMicrotask` — очередь микрозадач никогда не опустошалась, и event loop не мог дойти до таймеров. Правильное поведение — резолвить промис, как только очередь опустела.",
    testCases: [
      {
        id: "nodel-p7-t1",
        inputDisplay: "пустая очередь резолвится []",
        inputArgs: ["empty"],
        expected: "[]",
      },
      {
        id: "nodel-p7-t2",
        inputDisplay: "очередь [1,2,3] и x*2 → [2,4,6]",
        inputArgs: ["simple"],
        expected: "[2,4,6]",
      },
      {
        id: "nodel-p7-t3",
        inputDisplay: "таймер успевает выполниться, потом промис резолвится",
        inputArgs: ["timer-not-starved"],
        expected: "timer-first",
      },
      {
        id: "nodel-p7-t4",
        inputDisplay: "очередь [10] резолвится [10]",
        inputArgs: ["single"],
        expected: "[10]",
      },
    ],
    hints: [
      "Посмотрите, что происходит, когда обрабатывать уже нечего. Функция должна сигнализировать «всё готово», а не зацикливаться.",
      "В ветке `queue.length === 0` сейчас стоит `queueMicrotask(step)` — это бесконечная самопланировка, которая никогда не уступает место таймерам. Здесь нужен `resolve(results)`.",
      "Это классическая «голодовка» (starvation) event loop: микрозадачи имеют приоритет над таймерами и I/O, и пока их очередь не опустеет, фаза `timers` не получит управления. Бесконечная самоподписка через `queueMicrotask` (или `process.nextTick`) создаёт ровно такую ситуацию — процесс выглядит «живым», но не отвечает на сеть и не двигает таймеры. Поэтому базовое правило: микрозадача должна либо сделать конечный шаг, либо передать управление макрозадаче.",
    ],
    solutionCode: `function runWithDelay(initialQueue, work) {
  const queue = [...initialQueue];
  const results = [];

  return new Promise((resolve) => {
    function step() {
      if (queue.length === 0) {
        resolve(results);
        return;
      }
      const item = queue.shift();
      results.push(work(item));
      queueMicrotask(step);
    }
    queueMicrotask(step);
  });
}`,
    testHelperCode: `async function nodel_p7_test(arg) {
  if (arg === 'empty') {
    const r = await runWithDelay([], (x) => x);
    return JSON.stringify(r);
  }
  if (arg === 'simple') {
    const r = await runWithDelay([1, 2, 3], (x) => x * 2);
    return JSON.stringify(r);
  }
  if (arg === 'single') {
    const r = await runWithDelay([10], (x) => x);
    return JSON.stringify(r);
  }
  if (arg === 'timer-not-starved') {
    let timerFired = false;
    setTimeout(() => { timerFired = true; }, 0);
    await runWithDelay([1, 2], (x) => x);
    // дождёмся таймера
    await new Promise((r) => setTimeout(r, 10));
    return timerFired ? 'timer-first' : 'timer-blocked';
  }
}`,
  },
  {
    kind: "refactor",
    id: "nodel-p8",
    topicId: "node-event-loop",
    title: "Оптимизируй: батчинг тяжёлой обработки массива",
    difficulty: "medium",
    isContextual: true,
    description: `Функция \`sumOfSquares(arr)\` корректна, но в текущем виде содержит вложенный цикл O(n²) и при больших массивах блокирует event loop на сотни миллисекунд.

Перепишите функцию так, чтобы:
1. Сложность стала линейной — O(n).
2. Сигнатура осталась прежней: \`sumOfSquares(arr)\` возвращает число.
3. Тест на производительность для массива из 50 000 элементов укладывался в **200 мс**.

Это типовая задача для Node.js-сервера: один такой запрос на горячем пути в исходном виде задержит обработку всех остальных соединений.`,
    functionName: "sumOfSquares",
    starterCode: `function sumOfSquares(arr) {
  // Корректно, но O(n²): для каждого элемента заново суммируем префикс.
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    let prefix = 0;
    for (let j = 0; j <= i; j++) {
      prefix += arr[j];
    }
    total += arr[i] * arr[i];
    // prefix используется только чтобы «затормозить» —
    // в исходной задаче он не нужен.
    if (prefix < 0) total = -total;
  }
  return total;
}`,
    testCases: [
      {
        id: "nodel-p8-t1",
        inputDisplay: "sumOfSquares([])",
        inputArgs: [[]],
        expected: 0,
      },
      {
        id: "nodel-p8-t2",
        inputDisplay: "sumOfSquares([1,2,3])",
        inputArgs: [[1, 2, 3]],
        expected: 14,
      },
      {
        id: "nodel-p8-t3",
        inputDisplay: "sumOfSquares([5])",
        inputArgs: [[5]],
        expected: 25,
      },
      {
        id: "nodel-p8-t4",
        inputDisplay: "sumOfSquares([1,1,1,1,1])",
        inputArgs: [[1, 1, 1, 1, 1]],
        expected: 5,
      },
      {
        id: "nodel-p8-t5",
        inputDisplay: "sumOfSquares([10, -10])",
        inputArgs: [[10, -10]],
        expected: 200,
      },
    ],
    perfTest: {
      inputArgs: [Array.from({ length: 50000 }, (_, i) => i + 1)],
      maxMs: 200,
    },
    hints: [
      "Внимательно прочитайте код и подумайте, какая часть работы делается без пользы для итогового результата.",
      "Внутренний цикл по `j` копит `prefix`, но `prefix` влияет на ответ только тестом `if (prefix < 0)`. Для положительных чисел префикс никогда не отрицательный — этот блок можно убрать. Остаётся обычная линейная сумма квадратов.",
      "Это типовой паттерн «лишний труд внутри горячего цикла»: код вычисляет величину, которая на ответ не влияет. На 50 000 элементов внутренний цикл делает порядка 1.25 миллиарда сложений — Node блокируется на сотни миллисекунд, и все остальные клиенты ждут. После того как вы выкинете мёртвую ветку, V8 ещё и хорошо инлайнит простой проход — никаких `reduce` с замыканием для производительности здесь не нужно, обычный `for` быстрее.",
    ],
    solutionCode: `function sumOfSquares(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i] * arr[i];
  }
  return total;
}`,
  },
  {
    id: "nodel-easy1",
    topicId: "node-event-loop",
    kind: "predict-output",
    title: "Что выведет код: process.nextTick vs setImmediate vs setTimeout",
    difficulty: "easy",
    isContextual: false,
    description: `Базовый вопрос на приоритеты в event loop Node.js. Что выведет этот код?

Введите каждое значение на отдельной строке поля ответа.`,
    code: `setTimeout(() => console.log(1), 0);
setImmediate(() => console.log(2));
process.nextTick(() => console.log(3));
console.log(4);`,
    expected: "4\n3\n1\n2",
    hints: [
      "Сначала прокручивается весь синхронный код, потом начинают разбираться отложенные задачи разных приоритетов.",
      "В Node.js приоритет такой: синхронно → очередь `process.nextTick` (выше остальных) → таймеры (`setTimeout`) → фаза check (`setImmediate`). При вызове из основного модуля порядок `setTimeout(0)` и `setImmediate` не строго детерминирован, но чаще всего таймер успевает первым.",
      `Пошагово:
- Синхронно: \`console.log(4)\` → '4'.
- nextTick-очередь до I/O: '3'.
- Фаза timers: '1'.
- Фаза check: '2'.
- Итого: 4, 3, 1, 2.`,
    ],
    solutionCode: `// 1. Синхронно: console.log(4) → "4"
// 2. nextTick очередь (приоритет выше timers): → "3"
// 3. Timers фаза (setTimeout 0): → "1"
// 4. Check фаза (setImmediate): → "2"`,
    acceptable: ["4\n3\n2\n1"],
  },
  {
    id: "nodel-h1",
    topicId: "node-event-loop",
    kind: "predict-output",
    title: "Что выведет код: вложенные nextTick и Promise в Node.js",
    difficulty: "hard",
    isContextual: false,
    description: `Внимательно проследите порядок: вложенный \`process.nextTick\`, промис и \`setImmediate\` в Node.js.

Что выведет код? Введите каждое значение на отдельной строке.`,
    code: `Promise.resolve().then(() => {
  console.log(1);
  process.nextTick(() => console.log(2));
});

process.nextTick(() => {
  console.log(3);
  process.nextTick(() => console.log(4));
});

setImmediate(() => console.log(5));

console.log(6);`,
    expected: "6\n3\n4\n1\n2\n5",
    hints: [
      "Здесь две очереди отложенных задач разного приоритета и одна макрозадача. Сначала вспомните общий порядок: синхронно, потом особые очереди Node.js, потом макрозадачи.",
      "В Node.js приоритет такой: синхронно → `process.nextTick` (отдельная очередь, опустошается полностью) → микрозадачи (`Promise.then`) → `setImmediate` (фаза check). Если `nextTick` запланирован изнутри микрозадачи или другого `nextTick`, он добавляется в ту же `nextTick`-очередь и обрабатывается до следующей микрозадачи.",
      "Между microtask-фазами Node.js снова заглядывает в `nextTick`-очередь — поэтому `nextTick`, запланированный внутри `.then`, выполняется ДО того, как Node перейдёт к `setImmediate`.",
      `Пошагово:
- Синхронно: '6'.
- nextTick-очередь: '3', вложенный nextTick(4) попадает в конец → '4'.
- Microtasks: '1'; внутри неё запланирован nextTick(2) — он встаёт в nextTick-очередь.
- Дренаж nextTick перед следующей фазой: '2'.
- Фаза check: '5'.
- Итого: 6, 3, 4, 1, 2, 5.`,
    ],
    solutionCode: `// 1. Синхронно: "6"
// 2. nextTick очередь (приоритет выше Promise): "3"
//    → добавляет вложенный nextTick(4) в конец очереди
// 3. Продолжаем nextTick очередь: "4"
// 4. Microtask очередь (Promise.then): "1"
//    → добавляет nextTick(2), который выполнится до следующей microtask
// 5. nextTick(2) выполняется: "2"
// 6. check фаза (setImmediate): "5"`,
  },
  {
    id: "nodel-h2",
    topicId: "node-event-loop",
    kind: "implement",
    title: "AsyncQueue — очередь с ограничением параллелизма",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте класс \`AsyncQueue\`, который обрабатывает задачи с ограниченным параллелизмом, используя механику event loop Node.js.

Методы:
- \`push(task)\` — добавить задачу (async функцию), вернуть промис результата
- \`pause()\` — приостановить обработку (новые задачи не стартуют)
- \`resume()\` — возобновить

В конструктор передаётся \`concurrency\` — максимальное число одновременно выполняемых задач.

\`\`\`js
const q = new AsyncQueue(2);
q.push(async () => 'result'); // вернёт Promise<'result'>
\`\`\``,
    functionName: "AsyncQueue_test",
    starterCode: `class AsyncQueue {
  constructor(concurrency) {
    // ваш код
  }

  push(task) {
    // ваш код
  }

  pause() {
    // ваш код
  }

  resume() {
    // ваш код
  }
}`,
    testCases: [
      {
        id: "nodel-h2-t1",
        inputDisplay: "задача выполняется и возвращает результат",
        inputArgs: ["basic"],
        expected: "hello",
      },
      {
        id: "nodel-h2-t2",
        inputDisplay: "параллелизм ограничен",
        inputArgs: ["concurrency"],
        expected: true,
      },
      {
        id: "nodel-h2-t3",
        inputDisplay: "pause/resume работают",
        inputArgs: ["pause-resume"],
        expected: true,
      },
      {
        id: "nodel-h2-t4",
        inputDisplay: "результаты возвращаются в промисах",
        inputArgs: ["multi-results"],
        expected: [1, 2, 3],
      },
    ],
    hints: [
      "Очередь должна решать: сейчас можно ли запустить новую задачу? На это влияет и текущий уровень параллелизма, и состояние «на паузе или нет».",
      "Держите поля `active`, `concurrency`, `queue` и булев флаг `paused`. Метод `push` ставит `{ task, resolve, reject }` в очередь и зовёт диспетчер `_tick`. `_tick` запускает столько задач, сколько позволяет лимит и при `paused === false`. `resume()` снимает флаг и снова дёргает `_tick`, чтобы накопившиеся задачи стартовали.",
      `Главный подвох — где именно учитывать \`paused\`. Логика должна быть «не стартуем новые», а не «не пушим в очередь»: \`push\` во время паузы должен корректно класть задачу и возвращать ждущий промис, иначе вызывающий код потеряет результат. Также не забудьте про \`_tick\` внутри \`.finally\` — без него после завершения одной задачи следующая не возьмётся из очереди, даже если есть свободные слоты.

С чего начать:
\`\`\`js
class AsyncQueue {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.queue = [];
    this.paused = false;
  }
  push(task) { /* ... */ }
}
\`\`\``,
    ],
    solutionCode: `class AsyncQueue {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.active = 0;
    this.queue = [];
    this.paused = false;
  }

  push(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this._tick();
    });
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
    this._tick();
  }

  _tick() {
    while (!this.paused && this.active < this.concurrency && this.queue.length > 0) {
      const { task, resolve, reject } = this.queue.shift();
      this.active++;
      task()
        .then(resolve, reject)
        .finally(() => {
          this.active--;
          this._tick();
        });
    }
  }
}`,
    testHelperCode: `async function AsyncQueue_test(scenario) {
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  if (scenario === 'basic') {
    const q = new AsyncQueue(1);
    return await q.push(async () => 'hello');
  }

  if (scenario === 'concurrency') {
    let maxActive = 0, active = 0;
    const q = new AsyncQueue(2);
    const task = () => async () => {
      active++;
      maxActive = Math.max(maxActive, active);
      await delay(20);
      active--;
    };
    await Promise.all([q.push(task()), q.push(task()), q.push(task()), q.push(task())]);
    return maxActive <= 2;
  }

  if (scenario === 'pause-resume') {
    const q = new AsyncQueue(2);
    const order = [];
    q.pause();
    q.push(async () => { order.push('a'); });
    q.push(async () => { order.push('b'); });
    await delay(10);
    const beforeResume = order.length === 0;
    q.resume();
    await delay(30);
    return beforeResume && order.length === 2;
  }

  if (scenario === 'multi-results') {
    const q = new AsyncQueue(3);
    return await Promise.all([
      q.push(async () => 1),
      q.push(async () => 2),
      q.push(async () => 3),
    ]);
  }
}`,
  },
  {
    id: "nodel-e2",
    topicId: "node-event-loop",
    title: "deferred — Promise с внешним resolve/reject",
    difficulty: "easy",
    isContextual: false,
    description: `Реализуйте \`deferred()\` — функцию, возвращающую объект \`{ promise, resolve, reject }\`, где:
- \`promise\` — Promise, состояние которого можно резолвить **снаружи**;
- \`resolve(value)\` — резолвит этот promise;
- \`reject(reason)\` — реджектит этот promise.

Этот «выделенный» паттерн часто нужен, когда промис надо разрешать из другого места кода (например, из колбэка библиотеки).

Пример:
\`\`\`
const d = deferred();
setTimeout(() => d.resolve('done'), 50);
const result = await d.promise;
// result === 'done'
\`\`\``,
    functionName: 'deferred_test',
    starterCode: `function deferred() {
  // ваш код
}`,
    testCases: [
      { id: 'nodel-e2-t1', inputDisplay: "resolve работает", inputArgs: ['resolve'], expected: 'ok' },
      { id: 'nodel-e2-t2', inputDisplay: "reject работает", inputArgs: ['reject'], expected: 'Error: bad' },
      { id: 'nodel-e2-t3', inputDisplay: "resolve вызывается асинхронно — promise ждёт", inputArgs: ['async-resolve'], expected: 42 },
      { id: 'nodel-e2-t4', inputDisplay: "повторный resolve игнорируется", inputArgs: ['double-resolve'], expected: 'first' },
    ],
    hints: [
      "Промис «живёт» внутри своего executor, и наружу обычно ничего не торчит. Подумайте, как «вытащить» внутренние функции наружу, чтобы вызывать их откуда угодно.",
      "Объявите `let resolve, reject` снаружи, создайте `new Promise((res, rej) => { resolve = res; reject = rej; })` и верните `{ promise, resolve, reject }`. Повторный вызов `resolve` промис автоматически игнорирует — это поведение самого промиса, дополнительной защиты не нужно.",
    ],
    solutionCode: `function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}`,
    testHelperCode: `async function deferred_test(scenario) {
  if (scenario === 'resolve') {
    const d = deferred();
    d.resolve('ok');
    return await d.promise;
  }
  if (scenario === 'reject') {
    const d = deferred();
    d.reject(new Error('bad'));
    try { await d.promise; return 'no-throw'; }
    catch (e) { return 'Error: ' + e.message; }
  }
  if (scenario === 'async-resolve') {
    const d = deferred();
    setTimeout(() => d.resolve(42), 30);
    return await d.promise;
  }
  if (scenario === 'double-resolve') {
    const d = deferred();
    d.resolve('first');
    d.resolve('second');
    return await d.promise;
  }
}`,
  },
  {
    id: "nodel-e3",
    topicId: "node-event-loop",
    kind: "predict-output",
    title: "Что выведет код: микрозадачи между sync и setTimeout",
    difficulty: "easy",
    isContextual: false,
    description: `Перед вами фрагмент с тремя источниками логов: синхронные \`console.log\`, два \`queueMicrotask\`, один \`Promise.resolve().then\` и один \`setTimeout(..., 0)\`.

Какой будет порядок вывода?`,
    code: `console.log('start');

setTimeout(() => console.log('timeout'), 0);
queueMicrotask(() => console.log('micro1'));
Promise.resolve().then(() => console.log('promise'));
queueMicrotask(() => console.log('micro2'));

console.log('end');`,
    expected: 'start\nend\nmicro1\npromise\nmicro2\ntimeout',
    hints: [
      "Сначала выполняется весь синхронный код, и только потом движок разбирается с отложенными задачами.",
      "`queueMicrotask` и `Promise.resolve().then` попадают в одну общую очередь микрозадач и выполняются строго в порядке регистрации. `setTimeout` — макрозадача, ждёт пока вся очередь микрозадач не опустеет.",
      `Пошагово:
- Синхронно: 'start' → 'end'.
- Очередь микро в порядке регистрации: 'micro1' → 'promise' → 'micro2'.
- Макрозадача: 'timeout'.
- Итого: start, end, micro1, promise, micro2, timeout.`,
    ],
    solutionCode: `// 1. 'start'    — синхронно.
// 2. setTimeout, queueMicrotask×2, Promise.then — все запланированы.
// 3. 'end'      — синхронно.
// 4. Очередь микрозадач (в порядке регистрации): 'micro1' → 'promise' → 'micro2'.
// 5. Макрозадача: 'timeout'.`,
  },
  {
    id: "nodel-h3",
    topicId: "node-event-loop",
    kind: "implement",
    title: "runInWaterfall — последовательный конвейер задач",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте \`runInWaterfall(tasks, initialValue)\` — функцию, которая выполняет массив **асинхронных** задач **последовательно**, передавая результат каждой как аргумент следующей.

- \`tasks\` — массив функций \`(prev) => Promise<next>\`.
- \`initialValue\` — значение, передаваемое первой задаче.
- Возвращает Promise, резолвящийся **результатом последней** задачи.
- Если **любая** задача упадёт — Promise сразу реджектится, и следующие задачи **не запускаются**.
- Если \`tasks\` пуст — Promise резолвится \`initialValue\`.

Это паттерн «pipeline» — обычная сценарная задача для бэкенда: пропустить значение через цепочку преобразований, где каждое следующее зависит от результата предыдущего.

Пример:
\`\`\`
runInWaterfall([
  async (x) => x + 1,
  async (x) => x * 2,
  async (x) => x.toString(),
], 5);
// 5 → 6 → 12 → '12'   итоговый Promise резолвится '12'
\`\`\``,
    functionName: 'waterfall_test',
    starterCode: `async function runInWaterfall(tasks, initialValue) {
  // ваш код
}`,
    testCases: [
      { id: 'nodel-h3-t1', inputDisplay: "три последовательные задачи", inputArgs: ['three-tasks'], expected: '12' },
      { id: 'nodel-h3-t2', inputDisplay: "пустой массив → initialValue", inputArgs: ['empty'], expected: 7 },
      { id: 'nodel-h3-t3', inputDisplay: "упавшая задача останавливает конвейер", inputArgs: ['fails-midway'], expected: { error: 'mid', remaining: 0 } },
      { id: 'nodel-h3-t4', inputDisplay: "одна задача", inputArgs: ['one-task'], expected: 10 },
      { id: 'nodel-h3-t5', inputDisplay: "результат предыдущей доступен", inputArgs: ['accumulate'], expected: [1, 2, 3] },
    ],
    hints: [
      "Конвейер — это передача значения от шага к шагу. Главное — не запустить шаги параллельно, а дождаться предыдущего, прежде чем брать следующий.",
      "Перебирайте `tasks` через `for...of` и на каждой итерации делайте `value = await task(value)`. Если задача упадёт — `await` сам бросит, а async-функция вернёт реджектнутый промис, и следующие задачи не запустятся.",
      `Соблазнительно собрать это через \`tasks.reduce((p, t) => p.then(t), Promise.resolve(initialValue))\` — и это сработает, но потеряет stack-trace при ошибке и хуже читается в отладчике. \`for...of\` с \`await\` в async-функции даёт прозрачный async stack: при падении посередине вы увидите номер шага. Параллельный вариант через \`Promise.all(tasks.map(...))\` здесь категорически не подходит — нарушается зависимость «следующий шаг получает результат предыдущего».

С чего начать:
\`\`\`js
async function runInWaterfall(tasks, initialValue) {
  let value = initialValue;
  for (const task of tasks) {
    // ...
  }
  return value;
}
\`\`\``,
    ],
    solutionCode: `async function runInWaterfall(tasks, initialValue) {
  let value = initialValue;
  for (const task of tasks) {
    value = await task(value);
  }
  return value;
}`,
    testHelperCode: `async function waterfall_test(scenario) {
  if (scenario === 'three-tasks') {
    return await runInWaterfall([
      async (x) => x + 1,
      async (x) => x * 2,
      async (x) => x.toString(),
    ], 5);
  }
  if (scenario === 'empty') {
    return await runInWaterfall([], 7);
  }
  if (scenario === 'fails-midway') {
    let remaining = 2;
    try {
      await runInWaterfall([
        async (x) => { remaining--; return x + 1; },
        async () => { throw new Error('mid'); },
        async (x) => { remaining--; return x * 100; },
      ], 0);
      return { error: 'no-throw', remaining };
    } catch (e) {
      return { error: e.message, remaining };
    }
  }
  if (scenario === 'one-task') {
    return await runInWaterfall([async (x) => x * 2], 5);
  }
  if (scenario === 'accumulate') {
    return await runInWaterfall([
      async (a) => [...a, 1],
      async (a) => [...a, 2],
      async (a) => [...a, 3],
    ], []);
  }
}`,
  },
  {
    id: "nodel-h4",
    topicId: "node-event-loop",
    kind: "implement",
    title: "createMutex — взаимное исключение для async-кода",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте \`createMutex()\` — мьютекс (mutual exclusion), который позволяет **сериализовать** доступ к критической секции для async-кода.

API:
\`\`\`
const mutex = createMutex();

async function critical() {
  const release = await mutex.acquire();
  try {
    // ... критическая секция (только один acquire активен одновременно)
  } finally {
    release();
  }
}
\`\`\`

Поведение:
- \`acquire()\` возвращает Promise, который резолвится **функцией release**.
- Если мьютекс свободен — Promise резолвится **немедленно**.
- Если занят — Promise ждёт, пока предыдущий release не освободит его.
- Несколько acquire поступают в очередь и обрабатываются в порядке вызова (FIFO).

Хорошая задача на понимание промисов и управления потоком выполнения в async-коде.`,
    functionName: 'mutex_test',
    starterCode: `function createMutex() {
  // ваш код
}`,
    testCases: [
      { id: 'nodel-h4-t1', inputDisplay: "две критические секции выполняются по очереди", inputArgs: ['sequential'], expected: 1 },
      { id: 'nodel-h4-t2', inputDisplay: "порядок входа — FIFO", inputArgs: ['fifo'], expected: ['a', 'b', 'c'] },
      { id: 'nodel-h4-t3', inputDisplay: "release освобождает следующего сразу", inputArgs: ['release-passes-on'], expected: 'second-ran' },
      { id: 'nodel-h4-t4', inputDisplay: "свободный mutex даёт acquire без ожидания", inputArgs: ['immediate'], expected: true },
    ],
    hints: [
      "Мьютекс — это «один пропуск» на критическую секцию. Нужно понимать, занят ли он сейчас, и уметь поставить желающих в очередь.",
      "Держите флаг `locked` и массив `queue` функций-резолверов. `acquire`: если не залочено — лочим и возвращаем `Promise.resolve(release)`. Иначе кладём `resolve` в очередь и возвращаем pending-промис. `release`: если в очереди есть ждущий — извлекаем и зовём его, передав ему ту же функцию `release` (чтобы он, закончив, мог разблокировать следующего). Если очередь пуста — снимаем `locked`.",
      `Самая частая ошибка — не передавать \`release\` в очередь, а сбрасывать \`locked = false\` и надеяться, что следующий \`acquire\` сам себя залочит. Тогда между \`locked = false\` и моментом, когда ждущий промис проснётся (микрозадача!), может проскочить новый \`acquire\` из синхронного кода и нарушить FIFO. Безопаснее держать «эстафетную палочку»: \`release\` либо разбудит первого ждущего, отдав ему свою же функцию \`release\`, либо снимет лок. Так инвариант «лок занят, пока живёт цепочка release» не нарушается.

С чего начать:
\`\`\`js
function createMutex() {
  let locked = false;
  const queue = [];
  function release() { /* ... */ }
  function acquire() { /* ... */ }
  return { acquire };
}
\`\`\``,
    ],
    solutionCode: `function createMutex() {
  let locked = false;
  const queue = [];

  function release() {
    if (queue.length > 0) {
      const next = queue.shift();
      next(release); // следующий acquire получит свой release
    } else {
      locked = false;
    }
  }

  function acquire() {
    if (!locked) {
      locked = true;
      return Promise.resolve(release);
    }
    return new Promise((resolve) => {
      queue.push(resolve);
    });
  }

  return { acquire };
}`,
    testHelperCode: `async function mutex_test(scenario) {
  if (scenario === 'sequential') {
    const mutex = createMutex();
    let active = 0;
    let maxActive = 0;
    async function critical(ms) {
      const release = await mutex.acquire();
      active++;
      if (active > maxActive) maxActive = active;
      await new Promise((r) => setTimeout(r, ms));
      active--;
      release();
    }
    await Promise.all([critical(30), critical(30), critical(30)]);
    return maxActive;
  }
  if (scenario === 'fifo') {
    const mutex = createMutex();
    const order = [];
    async function task(label) {
      const release = await mutex.acquire();
      order.push(label);
      await new Promise((r) => setTimeout(r, 10));
      release();
    }
    await Promise.all([task('a'), task('b'), task('c')]);
    return order;
  }
  if (scenario === 'release-passes-on') {
    const mutex = createMutex();
    let secondRan = false;
    const releaseFirst = await mutex.acquire();
    const p = mutex.acquire().then((release) => {
      secondRan = true;
      release();
    });
    releaseFirst();
    await p;
    return secondRan ? 'second-ran' : 'no';
  }
  if (scenario === 'immediate') {
    const mutex = createMutex();
    const start = Date.now();
    const release = await mutex.acquire();
    const elapsed = Date.now() - start;
    release();
    return elapsed < 20;
  }
}`,
  },
];
