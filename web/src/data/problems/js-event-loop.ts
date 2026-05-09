import type { Problem } from '../../types/problem';

export const jsEventLoopProblems: Problem[] = [
  {
    id: 'jsel-p1',
    topicId: 'js-event-loop',
    title: 'delay — промис-пауза',
    difficulty: 'easy',
    isContextual: false,
    description: `Напишите функцию \`delay(ms)\`, которая возвращает Promise, который резолвится через \`ms\` миллисекунд.

Это базовый строительный блок для любой async-логики с паузами.

Примеры:
\`\`\`
await delay(100); // пауза 100ms
console.log('после паузы');

// Последовательные паузы:
await delay(50);
await delay(50);
// итого ~100ms
\`\`\``,
    functionName: 'delay_test',
    starterCode: `function delay(ms) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsel-p1-t1',
        inputDisplay: 'delay(0) резолвится (возвращает Promise)',
        inputArgs: ['resolves'],
        expected: true,
      },
      {
        id: 'jsel-p1-t2',
        inputDisplay: 'delay(10) резолвится примерно через 10ms',
        inputArgs: ['timing'],
        expected: true,
      },
      {
        id: 'jsel-p1-t3',
        inputDisplay: 'delay возвращает Promise',
        inputArgs: ['is-promise'],
        expected: true,
      },
      {
        id: 'jsel-p1-t4',
        inputDisplay: 'два delay выполняются последовательно',
        inputArgs: ['sequential'],
        expected: true,
      },
      {
        id: 'jsel-p1-t5',
        inputDisplay: 'delay резолвится с undefined',
        inputArgs: ['resolves-undefined'],
        expected: true,
      },
    ],
    hints: [
      '`delay` — обёртка над `setTimeout` в Promise. Внутри `new Promise((resolve) => setTimeout(resolve, ms))`.',
      'Promise не принимает значение — просто резолвится без аргументов (или с `undefined`).',
    ],
    solutionCode: `function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}`,
    testHelperCode: `async function delay_test(arg) {
  if (arg === 'resolves') { await delay(0); return true; }
  if (arg === 'timing') {
    const start = Date.now();
    await delay(10);
    return Date.now() - start >= 8;
  }
  if (arg === 'is-promise') return delay(0) instanceof Promise;
  if (arg === 'sequential') { await delay(5); await delay(5); return true; }
  if (arg === 'resolves-undefined') return (await delay(0)) === undefined;
}`,
  },
  {
    id: 'jsel-p2',
    topicId: 'js-event-loop',
    title: 'debounce',
    difficulty: 'medium',
    isContextual: false,
    description: `Реализуйте функцию \`debounce(fn, ms)\`.

Возвращаемая функция откладывает вызов \`fn\` на \`ms\` миллисекунд после последнего вызова. Если функция вызывается снова до истечения таймера — таймер сбрасывается.

Это ключевой паттерн для оптимизации: поиск при вводе, обработка ресайза окна.

Примеры:
\`\`\`
const debouncedSearch = debounce(search, 300);
debouncedSearch('h');
debouncedSearch('he');
debouncedSearch('hel'); // только этот вызов выполнится через 300ms
\`\`\``,
    functionName: 'debounce_test',
    starterCode: `function debounce(fn, ms) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsel-p2-t1',
        inputDisplay: '3 быстрых вызова → fn вызвана 1 раз',
        inputArgs: ['call-count-3'],
        expected: 1,
      },
      {
        id: 'jsel-p2-t2',
        inputDisplay: 'fn вызвана с последними аргументами',
        inputArgs: ['last-args'],
        expected: 'hello',
      },
      {
        id: 'jsel-p2-t3',
        inputDisplay: 'два вызова с паузой > ms → fn вызвана 2 раза',
        inputArgs: ['two-separate-calls'],
        expected: 2,
      },
      {
        id: 'jsel-p2-t4',
        inputDisplay: 'debounce возвращает функцию',
        inputArgs: ['returns-function'],
        expected: true,
      },
      {
        id: 'jsel-p2-t5',
        inputDisplay: 'один вызов → fn вызвана ровно 1 раз через ms',
        inputArgs: ['single-call'],
        expected: 1,
      },
    ],
    hints: [
      'Внутри debounce объявите переменную `timer`. Возвращаемая функция должна: сначала `clearTimeout(timer)`, затем `timer = setTimeout(() => fn(...args), ms)`.',
      'Используйте замыкание — `timer` живёт между вызовами благодаря замыканию на внешний scope функции debounce.',
      'Для передачи контекста: `fn.apply(this, args)` вместо `fn(...args)`, если нужно сохранить `this`.',
    ],
    solutionCode: `function debounce(fn, ms) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, ms);
  };
}`,
    testHelperCode: `async function debounce_test(arg) {
  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  if (arg === 'call-count-3') {
    let count = 0;
    const fn = debounce(() => count++, 30);
    fn(); fn(); fn();
    await wait(100);
    return count;
  }
  if (arg === 'last-args') {
    let lastArg;
    const fn = debounce((x) => { lastArg = x; }, 30);
    fn('a'); fn('b'); fn('hello');
    await wait(100);
    return lastArg;
  }
  if (arg === 'two-separate-calls') {
    let count = 0;
    const fn = debounce(() => count++, 30);
    fn();
    await wait(100);
    fn();
    await wait(100);
    return count;
  }
  if (arg === 'returns-function') return typeof debounce(() => {}, 30) === 'function';
  if (arg === 'single-call') {
    let count = 0;
    const fn = debounce(() => count++, 30);
    fn();
    await wait(100);
    return count;
  }
}`,
  },
  {
    id: 'jsel-p3',
    topicId: 'js-event-loop',
    title: 'throttle',
    difficulty: 'medium',
    isContextual: false,
    description: `Реализуйте функцию \`throttle(fn, ms)\`.

Возвращаемая функция вызывает \`fn\` **не чаще одного раза** за период \`ms\`. Первый вызов выполняется немедленно. Последующие вызовы в течение паузы игнорируются.

Примеры:
\`\`\`
const throttled = throttle(handler, 100);
throttled(); // выполнится немедленно
throttled(); // игнорируется (< 100ms)
throttled(); // игнорируется
// ... через 100ms ...
throttled(); // выполнится снова
\`\`\``,
    functionName: 'throttle_test',
    starterCode: `function throttle(fn, ms) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsel-p3-t1',
        inputDisplay: '5 немедленных вызовов → fn вызвана 1 раз',
        inputArgs: ['burst-5'],
        expected: 1,
      },
      {
        id: 'jsel-p3-t2',
        inputDisplay: 'первый вызов выполняется немедленно',
        inputArgs: ['first-immediate'],
        expected: true,
      },
      {
        id: 'jsel-p3-t3',
        inputDisplay: 'throttle возвращает функцию',
        inputArgs: ['returns-function'],
        expected: true,
      },
      {
        id: 'jsel-p3-t4',
        inputDisplay: 'fn передаются правильные аргументы',
        inputArgs: ['correct-args'],
        expected: 42,
      },
      {
        id: 'jsel-p3-t5',
        inputDisplay: '2 вызова с паузой > ms → fn вызвана 2 раза',
        inputArgs: ['two-windows'],
        expected: 2,
      },
    ],
    hints: [
      'Сохраните время последнего вызова: `let lastCall = 0`. При каждом вызове сравнивайте `Date.now() - lastCall` с `ms`.',
      'Если прошло достаточно времени — обновить `lastCall = Date.now()` и вызвать `fn`.',
    ],
    solutionCode: `function throttle(fn, ms) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= ms) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}`,
    testHelperCode: `async function throttle_test(arg) {
  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  if (arg === 'burst-5') {
    let count = 0;
    const fn = throttle(() => count++, 100);
    fn(); fn(); fn(); fn(); fn();
    return count;
  }
  if (arg === 'first-immediate') {
    let executed = false;
    const fn = throttle(() => { executed = true; }, 100);
    fn();
    return executed;
  }
  if (arg === 'returns-function') return typeof throttle(() => {}, 100) === 'function';
  if (arg === 'correct-args') {
    let received;
    const fn = throttle((x) => { received = x; }, 100);
    fn(42);
    return received;
  }
  if (arg === 'two-windows') {
    let count = 0;
    const fn = throttle(() => count++, 30);
    fn();
    await wait(100);
    fn();
    return count;
  }
}`,
  },
  {
    id: 'jsel-p4',
    topicId: 'js-event-loop',
    title: 'runSequentially — последовательные промисы',
    difficulty: 'medium',
    isContextual: false,
    description: `Напишите функцию \`runSequentially(asyncFns)\`, которая принимает массив функций, каждая из которых возвращает Promise, и выполняет их **строго по очереди** — следующая запускается только после завершения предыдущей.

Функция возвращает Promise с массивом результатов (в том же порядке, что и входной массив).

Примеры:
\`\`\`
const delay = (ms) => new Promise(r => setTimeout(r, ms));
const fns = [
  () => delay(10).then(() => 1),
  () => delay(10).then(() => 2),
  () => delay(10).then(() => 3),
];
await runSequentially(fns); // → [1, 2, 3]
// Общее время: ~30ms (последовательно, не параллельно)
\`\`\``,
    functionName: 'runSequentially_test',
    starterCode: `async function runSequentially(asyncFns) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsel-p4-t1',
        inputDisplay: '[() => 1, () => 2, () => 3] → [1, 2, 3]',
        inputArgs: ['simple-3'],
        expected: [1, 2, 3],
      },
      {
        id: 'jsel-p4-t2',
        inputDisplay: 'пустой массив → []',
        inputArgs: ['empty'],
        expected: [],
      },
      {
        id: 'jsel-p4-t3',
        inputDisplay: 'выполняются строго последовательно (порядок сохранён)',
        inputArgs: ['order'],
        expected: ['a', 'b', 'c'],
      },
      {
        id: 'jsel-p4-t4',
        inputDisplay: '[() => 42] → [42]',
        inputArgs: ['single'],
        expected: [42],
      },
      {
        id: 'jsel-p4-t5',
        inputDisplay: 'промисы с разными задержками — порядок не нарушается',
        inputArgs: ['async-order'],
        expected: [1, 2, 3],
      },
    ],
    hints: [
      'Используйте цикл `for...of` с `await`: `for (const fn of asyncFns) { results.push(await fn()); }`',
      'Альтернатива через `reduce`: `asyncFns.reduce(async (prev, fn) => [...(await prev), await fn()], Promise.resolve([]))`',
      'В отличие от `Promise.all` — здесь строго по одному. `Promise.all` запускает все параллельно.',
    ],
    solutionCode: `async function runSequentially(asyncFns) {
  const results = [];
  for (const fn of asyncFns) {
    results.push(await fn());
  }
  return results;
}`,
    testHelperCode: `async function runSequentially_test(arg) {
  const delay = (ms) => new Promise(r => setTimeout(r, ms));
  if (arg === 'simple-3') return runSequentially([() => 1, () => 2, () => 3]);
  if (arg === 'empty') return runSequentially([]);
  if (arg === 'order') return runSequentially([
    () => Promise.resolve('a'),
    () => Promise.resolve('b'),
    () => Promise.resolve('c'),
  ]);
  if (arg === 'single') return runSequentially([() => 42]);
  if (arg === 'async-order') return runSequentially([
    () => delay(30).then(() => 1),
    () => delay(10).then(() => 2),
    () => delay(20).then(() => 3),
  ]);
}`,
  },
  {
    kind: 'predict-output',
    id: 'jsel-p6',
    topicId: 'js-event-loop',
    title: 'Угадай вывод: setTimeout, Promise и queueMicrotask',
    difficulty: 'medium',
    isContextual: false,
    description: `Перед вами классический микс синхронного кода, макро- и микрозадач. Введи каждую напечатанную строку в отдельной строчке поля ответа.

Подсказка: помни порядок — сначала весь синхронный код, затем microtask checkpoint опустошает очередь микрозадач, и только потом event loop берёт макрозадачу.`,
    code: `console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => {
  console.log('3');
  queueMicrotask(() => console.log('4'));
});

queueMicrotask(() => console.log('5'));

console.log('6');`,
    expected: '1\n6\n3\n5\n4',
    hints: [
      'Синхронный код в порядке появления: 1 и 6.',
      'queueMicrotask и Promise.then идут в одну и ту же очередь и выполняются в порядке постановки: сначала Promise.then (3), потом второй queueMicrotask (5).',
      'Микрозадача внутри микрозадачи (4) добавляется в текущий checkpoint и тоже выполняется до setTimeout.',
    ],
    solutionCode: `// 1 — sync
// 6 — sync
// 3 — Promise.then (первая микрозадача)
//   внутри неё ставится новая микрозадача (4)
// 5 — queueMicrotask (поставлена раньше, чем 4)
// 4 — микрозадача, добавленная во время чекпоинта; чекпоинт продолжается
// 2 — setTimeout (макрозадача) — последний`,
  },
  {
    kind: 'find-bug',
    id: 'jsel-p7',
    topicId: 'js-event-loop',
    title: 'Найди баг: забытый await в последовательной загрузке',
    difficulty: 'easy',
    isContextual: false,
    description: `Функция должна загрузить два значения **последовательно** и вернуть массив \`[первое, второе]\`. Тесты проверяют, что результат — реальные значения, а не \`Promise\`-объекты.

В коде есть распространённая ошибка: забыт \`await\`, из-за чего в массив попадают непрорезолвенные промисы. Найди баг и почини.`,
    buggyCode: `async function loadBoth() {
  const a = await fetchValue('a');
  const b = fetchValue('b'); // <-- баг здесь
  return [a, b];
}

function fetchValue(label) {
  return new Promise((resolve) =>
    setTimeout(() => resolve('value-' + label), 5),
  );
}`,
    functionName: 'jsel_p7_test',
    bugSummary:
      'Забыт `await` перед вторым `fetchValue`. В результате `b` — это `Promise`, а не разрешённое значение. Решение — добавить `await`: `const b = await fetchValue("b")`.',
    testCases: [
      {
        id: 'jsel-p7-t1',
        inputDisplay: 'loadBoth() возвращает массив строк, не промисов',
        inputArgs: ['types'],
        expected: 'string,string',
      },
      {
        id: 'jsel-p7-t2',
        inputDisplay: 'первый элемент = "value-a"',
        inputArgs: ['first'],
        expected: 'value-a',
      },
      {
        id: 'jsel-p7-t3',
        inputDisplay: 'второй элемент = "value-b" (а не [object Promise])',
        inputArgs: ['second'],
        expected: 'value-b',
      },
      {
        id: 'jsel-p7-t4',
        inputDisplay: 'длина массива = 2',
        inputArgs: ['length'],
        expected: 2,
      },
    ],
    hints: [
      'Сравни строки `const a = ...` и `const b = ...`. Что-то отличается между ними.',
      'Async-функция возвращает Promise. Чтобы получить значение, нужен `await`.',
      'Если в массиве оказался непрорезолвенный Promise, типичный признак — `typeof b === "object"` и `b instanceof Promise`.',
    ],
    solutionCode: `async function loadBoth() {
  const a = await fetchValue('a');
  const b = await fetchValue('b');
  return [a, b];
}

function fetchValue(label) {
  return new Promise((resolve) =>
    setTimeout(() => resolve('value-' + label), 5),
  );
}`,
    testHelperCode: `async function jsel_p7_test(arg) {
  const result = await loadBoth();
  if (arg === 'types') return result.map((x) => typeof x).join(',');
  if (arg === 'first') return result[0];
  if (arg === 'second') return result[1];
  if (arg === 'length') return result.length;
}`,
  },
  {
    kind: 'refactor',
    id: 'jsel-p8',
    topicId: 'js-event-loop',
    title: 'Оптимизируй: блокирующий цикл → батчинг через setTimeout',
    difficulty: 'medium',
    isContextual: false,
    description: `Функция \`processAllChunked(items, transform, chunkSize)\` обрабатывает каждый элемент и возвращает массив результатов. Текущая реализация делает всё в одном синхронном цикле — это блокирует event loop, и страница «зависает», пока работа идёт.

Перепиши функцию так, чтобы она возвращала **Promise** с тем же массивом результатов, но при этом разбивала работу на чанки по \`chunkSize\` элементов и отдавала управление event loop через \`setTimeout(fn, 0)\` между чанками. Это позволит браузеру обрабатывать ввод и рисовать кадры, пока идёт обработка.

Корректность: результат должен совпадать с прежним по элементам и порядку. Сигнатура функции остаётся \`processAllChunked(items, transform, chunkSize)\` и должна возвращать Promise.`,
    functionName: 'processAllChunked_test',
    starterCode: `function processAllChunked(items, transform, chunkSize) {
  // Текущая реализация — синхронный блокирующий цикл.
  // Перепиши её через рекурсивный setTimeout с чанкованием
  // и верни Promise.
  const result = [];
  for (const item of items) {
    result.push(transform(item));
  }
  return Promise.resolve(result);
}`,
    testCases: [
      {
        id: 'jsel-p8-t1',
        inputDisplay: 'processAllChunked([1,2,3], x => x * 2, 100) → [2, 4, 6]',
        inputArgs: [[1, 2, 3], 'double', 100],
        expected: [2, 4, 6],
      },
      {
        id: 'jsel-p8-t2',
        inputDisplay: 'пустой массив → []',
        inputArgs: [[], 'double', 100],
        expected: [],
      },
      {
        id: 'jsel-p8-t3',
        inputDisplay: 'один элемент с маленьким chunk → [identity]',
        inputArgs: [[42], 'double', 1],
        expected: [84],
      },
      {
        id: 'jsel-p8-t4',
        inputDisplay: 'результат — Promise',
        inputArgs: [[1, 2, 3], 'is-promise', 2],
        expected: true,
      },
      {
        id: 'jsel-p8-t5',
        inputDisplay: '300 элементов с chunkSize=50 → корректная сумма',
        inputArgs: [Array.from({ length: 300 }, (_, i) => i), 'sum', 50],
        expected: (300 * 299) / 2,
      },
      {
        id: 'jsel-p8-t6',
        inputDisplay: 'порядок элементов сохранён при chunkSize=3 на массиве из 10',
        inputArgs: [Array.from({ length: 10 }, (_, i) => i), 'double', 3],
        expected: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18],
      },
    ],
    hints: [
      'Верни `new Promise((resolve) => { ... })`. Внутри объяви функцию `step()`, которая обрабатывает один чанк размера `chunkSize` и через `setTimeout(step, 0)` запускает следующий.',
      'Когда обработаны все элементы — вызови `resolve(result)`.',
      'Чтобы убедиться, что управление действительно отдано event loop — между чанками должен успеть выполниться внешний `setTimeout(fn, 0)`, заведённый снаружи.',
      'Помни, что `setTimeout` — макрозадача. Если использовать `queueMicrotask`, paint всё равно будет заблокирован, потому что microtask checkpoint не завершается.',
    ],
    solutionCode: `function processAllChunked(items, transform, chunkSize) {
  return new Promise((resolve) => {
    const result = [];
    let i = 0;

    function step() {
      const end = Math.min(i + chunkSize, items.length);
      while (i < end) result.push(transform(items[i++]));
      if (i < items.length) {
        setTimeout(step, 0); // отдаём управление event loop
      } else {
        resolve(result);
      }
    }

    if (items.length === 0) resolve(result);
    else step();
  });
}`,
    testHelperCode: `// Адаптер: рантайм вызывает processAllChunked_test(items, mode, chunkSize),
// а тот, в зависимости от mode, вызывает написанную пользователем processAllChunked.
async function processAllChunked_test(items, mode, chunkSize) {
  const double = (x) => x * 2;
  const identity = (x) => x;
  if (mode === 'double') return await processAllChunked(items, double, chunkSize);
  if (mode === 'is-promise') {
    const p = processAllChunked(items, double, chunkSize);
    return p instanceof Promise;
  }
  if (mode === 'sum') {
    const arr = await processAllChunked(items, identity, chunkSize);
    return arr.reduce((a, b) => a + b, 0);
  }
}`,
  },
  {
    id: 'jsel-p5',
    topicId: 'js-event-loop',
    title: 'retryWithDelay — повтор с паузой',
    difficulty: 'medium',
    isContextual: true,
    description: `В продакшн-коде часто нужно повторить запрос при ошибке. Реализуйте функцию \`retryWithDelay(fn, retries, ms)\`:
- Вызывает \`fn()\` (асинхронная функция, возвращает Promise)
- При ошибке ждёт \`ms\` миллисекунд и повторяет
- Если \`retries\` попыток исчерпаны — бросает последнюю ошибку
- При успехе — возвращает результат

Примеры:
\`\`\`
let attempt = 0;
const unstable = () => {
  attempt++;
  if (attempt < 3) throw new Error('fail');
  return 'success';
};

await retryWithDelay(unstable, 3, 0); // → 'success'
// attempt = 3 (два провала, третья — успех)
\`\`\``,
    functionName: 'retryWithDelay_test',
    starterCode: `async function retryWithDelay(fn, retries, ms) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsel-p5-t1',
        inputDisplay: 'fn падает 2 раза, 3-я успешна → "success"',
        inputArgs: ['fail-2-then-ok'],
        expected: 'success',
      },
      {
        id: 'jsel-p5-t2',
        inputDisplay: 'fn всегда успешна → 1 попытка',
        inputArgs: ['always-ok'],
        expected: 42,
      },
      {
        id: 'jsel-p5-t3',
        inputDisplay: 'fn всегда падает → throws после retries попыток',
        inputArgs: ['always-fail'],
        expected: 'Error: always-fail',
      },
      {
        id: 'jsel-p5-t4',
        inputDisplay: 'retries=1: одна попытка, при ошибке бросает',
        inputArgs: ['retries-1'],
        expected: 'Error',
      },
      {
        id: 'jsel-p5-t5',
        inputDisplay: 'количество попыток ≤ retries',
        inputArgs: ['attempt-count'],
        expected: true,
      },
    ],
    hints: [
      'Используйте цикл `for` от 0 до retries. Оберните вызов fn в try/catch. Если это не последняя попытка — делайте `await delay(ms)` и продолжайте.',
      'После цикла бросайте последнюю пойманную ошибку: сохраните её в переменной `lastError` и бросьте `throw lastError` после цикла.',
      'Паузу реализуйте через `await new Promise(r => setTimeout(r, ms))`.',
    ],
    solutionCode: `async function retryWithDelay(fn, retries, ms) {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < retries - 1) {
        await new Promise((r) => setTimeout(r, ms));
      }
    }
  }
  throw lastError;
}`,
    testHelperCode: `async function retryWithDelay_test(arg) {
  if (arg === 'fail-2-then-ok') {
    let attempt = 0;
    const fn = async () => { attempt++; if (attempt < 3) throw new Error('fail'); return 'success'; };
    return retryWithDelay(fn, 3, 0);
  }
  if (arg === 'always-ok') return retryWithDelay(async () => 42, 3, 0);
  if (arg === 'always-fail') {
    try { await retryWithDelay(async () => { throw new Error('always-fail'); }, 3, 0); }
    catch (e) { return 'Error: ' + e.message; }
  }
  if (arg === 'retries-1') {
    try { await retryWithDelay(async () => { throw new Error('fail'); }, 1, 0); }
    catch (e) { return 'Error'; }
  }
  if (arg === 'attempt-count') {
    let attempts = 0;
    try { await retryWithDelay(async () => { attempts++; throw new Error('x'); }, 3, 0); } catch(e) {}
    return attempts <= 3;
  }
}`,
  },
];
