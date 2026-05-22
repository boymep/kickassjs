import type { Problem } from "../../types/problem";
import { VIRTUAL_TIME_PRELUDE } from "./_virtualTime";

export const jsEventLoopProblems: Problem[] = [
  {
    id: "jsel-p1",
    topicId: "js-event-loop",
    title: "delay — промис-пауза",
    difficulty: "easy",
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
    functionName: "delay_test",
    starterCode: `function delay(ms) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsel-p1-t1",
        inputDisplay: "delay(0) резолвится (возвращает Promise)",
        inputArgs: ["resolves"],
        expected: true,
      },
      {
        id: "jsel-p1-t2",
        inputDisplay: "delay(10) резолвится примерно через 10ms",
        inputArgs: ["timing"],
        expected: true,
      },
      {
        id: "jsel-p1-t3",
        inputDisplay: "delay возвращает Promise",
        inputArgs: ["is-promise"],
        expected: true,
      },
      {
        id: "jsel-p1-t4",
        inputDisplay: "два delay выполняются последовательно",
        inputArgs: ["sequential"],
        expected: true,
      },
      {
        id: "jsel-p1-t5",
        inputDisplay: "delay резолвится с undefined",
        inputArgs: ["resolves-undefined"],
        expected: true,
      },
    ],
    hints: [
      "Есть Promise-конструктор и механизм отложенного вызова. Как связать их так, чтобы промис выполнился через ms миллисекунд?",
      "Promise должен резолвиться сам по себе — без передачи какого-либо значения.",
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
    id: "jsel-p2",
    topicId: "js-event-loop",
    title: "promiseTimeout — обернуть промис в таймаут",
    difficulty: "medium",
    isContextual: false,
    description: `Реализуйте функцию \`promiseTimeout(promise, ms)\`.

Она возвращает **новый** промис, который:

- резолвится тем же значением, что и исходный \`promise\` — если он успел разрешиться за \`ms\` миллисекунд;
- режектится с \`new Error('timeout')\` — если исходный промис не успел;
- режектится исходной причиной — если \`promise\` сам зареджектился до таймаута.

Это типичный паттерн для сетевых запросов: «не ждём ответа дольше N секунд».

Подсказка по архитектуре: внутри запускаете гонку между исходным промисом и таймером \`setTimeout\`. Кто первый — тот и решает судьбу обёртки.

Примеры:
\`\`\`
await promiseTimeout(fetch('/api'), 5000);
// → ответ от сервера, если успел за 5 сек
// → иначе Error('timeout')
\`\`\``,
    functionName: "promiseTimeout_test",
    starterCode: `function promiseTimeout(promise, ms) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsel-p2-t1",
        inputDisplay: "промис резолвится до таймаута → возвращает значение",
        inputArgs: ["resolves-in-time"],
        expected: "ok",
      },
      {
        id: "jsel-p2-t2",
        inputDisplay: "промис не успел → reject с 'timeout'",
        inputArgs: ["times-out"],
        expected: "timeout",
      },
      {
        id: "jsel-p2-t3",
        inputDisplay: "исходный промис зареджектился → причина пробрасывается",
        inputArgs: ["rejects-in-time"],
        expected: "boom",
      },
      {
        id: "jsel-p2-t4",
        inputDisplay: "promiseTimeout возвращает Promise",
        inputArgs: ["returns-promise"],
        expected: true,
      },
      {
        id: "jsel-p2-t5",
        inputDisplay: "уже зарезолвленный промис → значение возвращается мгновенно",
        inputArgs: ["already-resolved"],
        expected: 42,
      },
    ],
    hints: [
      "Какой статичный метод Promise позволяет дождаться того, что произошло первым — резолв или таймер?",
      "Таймер должен сам режектить промис ошибкой 'timeout'. Создай отдельный 'таймаут-промис' через `new Promise`.",
    ],
    solutionCode: `function promiseTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('timeout')), ms);
  });
  return Promise.race([promise, timeout]);
}`,
    testHelperCode: `${VIRTUAL_TIME_PRELUDE}
async function promiseTimeout_test(scenario) {
  resetVirtualTime();

  const slowResolve = (value, ms) => new Promise((res) => setTimeout(() => res(value), ms));
  const slowReject = (reason, ms) => new Promise((_, rej) => setTimeout(() => rej(new Error(reason)), ms));

  if (scenario === 'resolves-in-time') {
    const r = await settle(promiseTimeout(slowResolve('ok', 30), 100), 500);
    return r.ok ? r.value : 'reject:' + r.reason;
  }
  if (scenario === 'times-out') {
    const r = await settle(promiseTimeout(slowResolve('late', 200), 50), 500);
    return r.ok ? 'unexpected-resolve' : r.reason;
  }
  if (scenario === 'rejects-in-time') {
    const r = await settle(promiseTimeout(slowReject('boom', 30), 100), 500);
    return r.ok ? 'unexpected-resolve' : r.reason;
  }
  if (scenario === 'returns-promise') {
    return promiseTimeout(Promise.resolve(1), 100) instanceof Promise;
  }
  if (scenario === 'already-resolved') {
    const r = await settle(promiseTimeout(Promise.resolve(42), 100), 500);
    return r.ok ? r.value : 'reject:' + r.reason;
  }
}`,
  },
  {
    id: "jsel-p3",
    topicId: "js-event-loop",
    title: "throttle",
    difficulty: "medium",
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
    functionName: "throttle_test",
    starterCode: `function throttle(fn, ms) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsel-p3-t1",
        inputDisplay: "5 немедленных вызовов → fn вызвана 1 раз",
        inputArgs: ["burst-5"],
        expected: 1,
      },
      {
        id: "jsel-p3-t2",
        inputDisplay: "первый вызов выполняется немедленно",
        inputArgs: ["first-immediate"],
        expected: true,
      },
      {
        id: "jsel-p3-t3",
        inputDisplay: "throttle возвращает функцию",
        inputArgs: ["returns-function"],
        expected: true,
      },
      {
        id: "jsel-p3-t4",
        inputDisplay: "fn передаются правильные аргументы",
        inputArgs: ["correct-args"],
        expected: 42,
      },
      {
        id: "jsel-p3-t5",
        inputDisplay: "2 вызова с паузой > ms → fn вызвана 2 раза",
        inputArgs: ["two-windows"],
        expected: 2,
      },
    ],
    hints: [
      "Как понять, прошло ли достаточно времени с последнего реального вызова функции?",
      "Что нужно сохранять между вызовами, чтобы принять решение: выполнить или проигнорировать?",
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
    id: "jsel-p4",
    topicId: "js-event-loop",
    title: "runSequentially — последовательные промисы",
    difficulty: "medium",
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
    functionName: "runSequentially_test",
    starterCode: `async function runSequentially(asyncFns) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsel-p4-t1",
        inputDisplay: "[() => 1, () => 2, () => 3] → [1, 2, 3]",
        inputArgs: ["simple-3"],
        expected: [1, 2, 3],
      },
      {
        id: "jsel-p4-t2",
        inputDisplay: "пустой массив → []",
        inputArgs: ["empty"],
        expected: [],
      },
      {
        id: "jsel-p4-t3",
        inputDisplay: "выполняются строго последовательно (порядок сохранён)",
        inputArgs: ["order"],
        expected: ["a", "b", "c"],
      },
      {
        id: "jsel-p4-t4",
        inputDisplay: "[() => 42] → [42]",
        inputArgs: ["single"],
        expected: [42],
      },
      {
        id: "jsel-p4-t5",
        inputDisplay: "промисы с разными задержками — порядок не нарушается",
        inputArgs: ["async-order"],
        expected: [1, 2, 3],
      },
    ],
    hints: [
      "Как дождаться результата одной async-операции, прежде чем запустить следующую?",
      "Чем этот подход принципиально отличается от Promise.all?",
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
    kind: "predict-output",
    id: "jsel-p6",
    topicId: "js-event-loop",
    title: "Определи вывод: async/await и Promise.then вместе",
    difficulty: "medium",
    isContextual: false,
    description: `Перед вами async-функция рядом с обычным \`Promise.then\`. Введите каждую напечатанную строку на отдельной строке поля ответа.

**Подсказка:** каждый \`await\` ставит продолжение функции в очередь микрозадач и возвращает управление вызывающему коду.`,
    code: `async function run() {
  console.log('A');
  await null;
  console.log('B');
  await null;
  console.log('C');
}

console.log('1');
run();
Promise.resolve().then(() => console.log('2'));
console.log('3');`,
    expected: "1\nA\n3\nB\n2\nC",
    hints: [
      "Разделите вывод на части: что успевает выполниться синхронно, а что — когда движок дойдёт до очереди микрозадач?",
      "Каждый `await` ставит продолжение функции в очередь микрозадач. В каком порядке туда попадают продолжения двух функций и `Promise.then`?",
    ],
    solutionCode: `// 1  — синхронно
// A  — синхронно внутри run()
// 3  — синхронно (run() приостановлена на await)
// --- движок разбирает очередь микрозадач ---
// B  — продолжение run() после первого await; ставит второе продолжение в очередь
// 2  — Promise.then (стоял в очереди раньше второго продолжения run)
// C  — продолжение run() после второго await`,
  },
  {
    kind: "find-bug",
    id: "jsel-p7",
    topicId: "js-event-loop",
    title: "Найдите баг: последовательная загрузка двух значений",
    difficulty: "easy",
    isContextual: false,
    description: `Функция \`loadBoth()\` должна последовательно загрузить два значения и вернуть их в массиве. Оба элемента должны быть строками. Что-то пошло не так — найдите и исправьте.`,
    buggyCode: `async function loadBoth() {
  const a = fetchValue('a');
  const b = fetchValue('b');
  return [a, b];
}

function fetchValue(label) {
  return new Promise((resolve) =>
    setTimeout(() => resolve('value-' + label), 5),
  );
}`,
    functionName: "jsel_p7_test",
    bugSummary:
      'Забыт `await` перед вторым `fetchValue`. В результате `b` — это `Promise`, а не разрешённое значение. Решение — добавить `await`: `const b = await fetchValue("b")`.',
    testCases: [
      {
        id: "jsel-p7-t1",
        inputDisplay: "оба элемента имеют тип string",
        inputArgs: ["types"],
        expected: "string,string",
      },
      {
        id: "jsel-p7-t2",
        inputDisplay: 'первый элемент = "value-a"',
        inputArgs: ["first"],
        expected: "value-a",
      },
      {
        id: "jsel-p7-t3",
        inputDisplay: 'второй элемент = "value-b"',
        inputArgs: ["second"],
        expected: "value-b",
      },
      {
        id: "jsel-p7-t4",
        inputDisplay: "длина массива = 2",
        inputArgs: ["length"],
        expected: 2,
      },
    ],
    hints: [
      "Сравните объявления `a` и `b`. Есть ли разница в том, как они получают значение?",
      "Что окажется в переменной, если не дождаться промиса?",
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
    testHelperCode: `function fetchValue(label) {
  return Promise.resolve('value-' + label);
}
async function jsel_p7_test(arg) {
  const result = await loadBoth();
  if (arg === 'types') return result.map((x) => typeof x).join(',');
  if (arg === 'first') return String(result[0]);
  if (arg === 'second') return String(result[1]);
  if (arg === 'length') return result.length;
}`,
  },
  {
    kind: "refactor",
    id: "jsel-p8",
    topicId: "js-event-loop",
    title: "Оптимизируй: блокирующий цикл → батчинг через setTimeout",
    difficulty: "medium",
    isContextual: false,
    description: `Функция \`processAllChunked(items, transform, chunkSize)\` обрабатывает каждый элемент и возвращает массив результатов. Текущая реализация делает всё в одном синхронном цикле — это блокирует event loop, и страница «зависает», пока работа идёт.

Перепишите функцию так, чтобы она возвращала **Promise** с тем же массивом результатов, но при этом разбивала работу на чанки по \`chunkSize\` элементов и отдавала управление event loop через \`setTimeout(fn, 0)\` между чанками. Это позволит браузеру обрабатывать ввод и рисовать кадры, пока идёт обработка.

Корректность: результат должен совпадать с прежним по элементам и порядку. Сигнатура функции остаётся \`processAllChunked(items, transform, chunkSize)\` и должна возвращать Promise.`,
    functionName: "processAllChunked_test",
    starterCode: `function processAllChunked(items, transform, chunkSize) {
  // Текущая реализация — синхронный блокирующий цикл.
  // Перепишите её через рекурсивный setTimeout с чанкованием
  // и верни Promise.
  const result = [];
  for (const item of items) {
    result.push(transform(item));
  }
  return Promise.resolve(result);
}`,
    testCases: [
      {
        id: "jsel-p8-t1",
        inputDisplay: "processAllChunked([1,2,3], x => x * 2, 100) → [2, 4, 6]",
        inputArgs: [[1, 2, 3], "double", 100],
        expected: [2, 4, 6],
      },
      {
        id: "jsel-p8-t2",
        inputDisplay: "пустой массив → []",
        inputArgs: [[], "double", 100],
        expected: [],
      },
      {
        id: "jsel-p8-t3",
        inputDisplay: "один элемент с маленьким chunk → [identity]",
        inputArgs: [[42], "double", 1],
        expected: [84],
      },
      {
        id: "jsel-p8-t4",
        inputDisplay: "результат — Promise",
        inputArgs: [[1, 2, 3], "is-promise", 2],
        expected: true,
      },
      {
        id: "jsel-p8-t5",
        inputDisplay: "300 элементов с chunkSize=50 → корректная сумма",
        inputArgs: [Array.from({ length: 300 }, (_, i) => i), "sum", 50],
        expected: (300 * 299) / 2,
      },
      {
        id: "jsel-p8-t6",
        inputDisplay:
          "порядок элементов сохранён при chunkSize=3 на массиве из 10",
        inputArgs: [Array.from({ length: 10 }, (_, i) => i), "double", 3],
        expected: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18],
      },
    ],
    hints: [
      "Как разбить синхронный цикл на части, отдавая управление event loop между ними?",
      "Какой механизм позволяет «поставить в очередь» следующий шаг, не блокируя текущий поток?",
      "Чем setTimeout отличается от queueMicrotask с точки зрения возможности рендеринга между шагами?",
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
    id: "jsel-p5",
    topicId: "js-event-loop",
    title: "retryWithDelay — повтор с паузой",
    difficulty: "medium",
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
    functionName: "retryWithDelay_test",
    starterCode: `async function retryWithDelay(fn, retries, ms) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsel-p5-t1",
        inputDisplay: 'fn падает 2 раза, 3-я успешна → "success"',
        inputArgs: ["fail-2-then-ok"],
        expected: "success",
      },
      {
        id: "jsel-p5-t2",
        inputDisplay: "fn всегда успешна → 1 попытка",
        inputArgs: ["always-ok"],
        expected: 42,
      },
      {
        id: "jsel-p5-t3",
        inputDisplay: "fn всегда падает → throws после retries попыток",
        inputArgs: ["always-fail"],
        expected: "Error: always-fail",
      },
      {
        id: "jsel-p5-t4",
        inputDisplay: "retries=1: одна попытка, при ошибке бросает",
        inputArgs: ["retries-1"],
        expected: "Error",
      },
      {
        id: "jsel-p5-t5",
        inputDisplay: "количество попыток ≤ retries",
        inputArgs: ["attempt-count"],
        expected: true,
      },
    ],
    hints: [
      "Как поймать ошибку и продолжить попытки, не прерывая выполнение?",
      "Что делать, если попытки ещё есть — подождать и попробовать снова. А если исчерпаны?",
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
  {
    id: "jsel-h1",
    topicId: "js-event-loop",
    kind: "predict-output",
    title: "Что выведет код: две async-функции и queueMicrotask",
    difficulty: "hard",
    isContextual: false,
    description: `Два async-вызова запускаются подряд. В каком порядке окажутся строки в выводе?

Введите каждое значение на отдельной строке поля ответа.`,
    code: `async function first() {
  console.log('f1');
  await null;
  console.log('f2');
}

async function second() {
  console.log('s1');
  await null;
  console.log('s2');
}

console.log('start');
first();
second();
setTimeout(() => console.log('timeout'), 0);
queueMicrotask(() => console.log('micro'));
console.log('end');`,
    expected: "start\nf1\ns1\nend\nf2\ns2\nmicro\ntimeout",
    hints: [
      "Сколько синхронных шагов выполнится до того, как движок начнёт разбирать очередь микрозадач?",
      "В каком порядке продолжения двух async-функций попадают в очередь микрозадач? А когда туда попадает `queueMicrotask`?",
    ],
    solutionCode: `// start — синхронно
// f1   — синхронно внутри first(), до первого await
// s1   — синхронно внутри second(), до первого await
// end  — синхронно
// --- движок разбирает очередь микрозадач ---
// f2   — продолжение first() после await
// s2   — продолжение second() после await
// micro — queueMicrotask (поставлен в очередь после обоих await)
// --- следующая итерация event loop, макрозадачи ---
// timeout — setTimeout`,
  },
  {
    id: "jsel-h2",
    topicId: "js-event-loop",
    kind: "implement",
    title: "Планировщик задач с ограничением параллелизма",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте класс \`Scheduler\` с методом \`add(task)\`, который принимает асинхронную задачу и возвращает промис её результата.

Планировщик гарантирует, что одновременно выполняется **не более concurrency задач** (задаётся в конструкторе).

Примеры:
\`\`\`
const scheduler = new Scheduler(2);

const t = (delay, val) => () =>
  new Promise(res => setTimeout(() => res(val), delay));

scheduler.add(t(300, 'a')); // запускается сразу (слот 1)
scheduler.add(t(200, 'b')); // запускается сразу (слот 2)
scheduler.add(t(100, 'c')); // ждёт освобождения слота
scheduler.add(t(100, 'd')); // ждёт освобождения слота

// Порядок завершения: b, a, c, d
\`\`\``,
    functionName: "Scheduler_test",
    starterCode: `class Scheduler {
  constructor(concurrency) {
    // ваш код
  }

  add(task) {
    // ваш код — возвращает Promise
  }
}`,
    testCases: [
      {
        id: "jsel-h2-t1",
        inputDisplay: "все задачи выполняются и возвращают результат",
        inputArgs: ["all-complete"],
        expected: ["a", "b", "c"],
      },
      {
        id: "jsel-h2-t2",
        inputDisplay: "одновременно не более N задач",
        inputArgs: ["concurrency-limit"],
        expected: true,
      },
      {
        id: "jsel-h2-t3",
        inputDisplay: "задачи из очереди стартуют после освобождения слота",
        inputArgs: ["queue-order"],
        expected: true,
      },
    ],
    hints: [
      "Что нужно знать планировщику, чтобы решить — запустить задачу сразу или поставить в очередь?",
      "Что происходит, когда задача завершается? Кто должен запустить следующую из очереди?",
    ],
    solutionCode: `class Scheduler {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.active = 0;
    this.queue = [];
  }

  add(task) {
    return new Promise((resolve, reject) => {
      const run = () => {
        this.active++;
        task()
          .then(resolve, reject)
          .finally(() => {
            this.active--;
            if (this.queue.length > 0) this.queue.shift()();
          });
      };

      if (this.active < this.concurrency) {
        run();
      } else {
        this.queue.push(run);
      }
    });
  }
}`,
    testHelperCode: `async function Scheduler_test(scenario) {
  if (scenario === 'all-complete') {
    const s = new Scheduler(2);
    const delay = (ms, val) => () => new Promise(res => setTimeout(() => res(val), ms));
    const results = await Promise.all([
      s.add(delay(10, 'a')),
      s.add(delay(5, 'b')),
      s.add(delay(1, 'c')),
    ]);
    return results;
  }
  if (scenario === 'concurrency-limit') {
    let maxActive = 0, current = 0;
    const s = new Scheduler(2);
    const task = () => new Promise(res => {
      current++;
      maxActive = Math.max(maxActive, current);
      setTimeout(() => { current--; res(); }, 20);
    });
    await Promise.all([s.add(task), s.add(task), s.add(task), s.add(task)]);
    return maxActive <= 2;
  }
  if (scenario === 'queue-order') {
    const order = [];
    const s = new Scheduler(1);
    const task = (id, ms) => () => new Promise(res => setTimeout(() => { order.push(id); res(); }, ms));
    await Promise.all([s.add(task(1, 10)), s.add(task(2, 1)), s.add(task(3, 1))]);
    return order[0] === 1; // 1 стартует первым
  }
}`,
  },
  {
    id: "jsel-e2",
    topicId: "js-event-loop",
    kind: "predict-output",
    title: "Что выведет код: setTimeout 0 vs Promise vs sync",
    difficulty: "easy",
    isContextual: false,
    description: `Перед вами короткий фрагмент с тремя источниками логов: \`setTimeout(..., 0)\`, синхронный \`console.log\` и \`Promise.resolve().then(...)\`.

В каком порядке строки появятся в выводе?

**Подсказка:** очередь микрозадач (\`Promise.then\`) опустошается полностью — **до** того, как event loop возьмёт следующую макрозадачу (например, очередной \`setTimeout\`).`,
    code: `console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve().then(() => console.log('C'));

console.log('D');`,
    expected: 'A\nD\nC\nB',
    hints: [
      'Сначала выполняется весь синхронный код.',
      'Затем — все микрозадачи (продолжения промисов), которые были запланированы за это время.',
      'И только потом — следующая макрозадача (`setTimeout`).',
    ],
    solutionCode: `// 1. 'A' — синхронный console.log.
// 2. setTimeout планирует макрозадачу — она выполнится на следующей итерации event loop.
// 3. Promise.resolve().then() планирует микрозадачу.
// 4. 'D' — синхронный console.log.
// 5. Стек пуст → движок опустошает очередь микрозадач → 'C'.
// 6. Следующая итерация event loop → берётся макрозадача → 'B'.`,
  },
  {
    id: "jsel-e3",
    topicId: "js-event-loop",
    title: "nextTick — отложить на следующий микротик",
    difficulty: "easy",
    isContextual: false,
    description: `Реализуйте функцию \`nextTick(fn)\`, которая откладывает вызов \`fn\` на **ближайший микротик** (microtask), то есть гарантированно после текущего синхронного кода, но **раньше** любого \`setTimeout\`.

Используйте \`queueMicrotask\` или \`Promise.resolve().then(...)\`.

Функция должна возвращать \`undefined\` сразу.

Пример:
\`\`\`
const log = [];
log.push(1);
nextTick(() => log.push(2));
log.push(3);
// сразу после: log === [1, 3]
// после микротиков: log === [1, 3, 2]
\`\`\``,
    functionName: 'nextTick_test',
    starterCode: `function nextTick(fn) {
  // ваш код
}`,
    testCases: [
      { id: "jsel-e3-t1", inputDisplay: "fn вызывается после синхронного кода", inputArgs: ['sync-after'], expected: [1, 3, 2] },
      { id: "jsel-e3-t2", inputDisplay: "nextTick раньше setTimeout(0)", inputArgs: ['before-setTimeout'], expected: ['micro', 'macro'] },
      { id: "jsel-e3-t3", inputDisplay: "вложенные nextTick сохраняют порядок", inputArgs: ['nested'], expected: ['outer', 'inner'] },
      { id: "jsel-e3-t4", inputDisplay: "nextTick возвращает undefined", inputArgs: ['returns-undefined'], expected: true },
    ],
    hints: [
      'Что добавляет задачу именно в очередь микротасков? `queueMicrotask` или `Promise.resolve().then`.',
      'Помните: микротики опустошаются до следующего рендеринга и до следующего setTimeout.',
    ],
    solutionCode: `function nextTick(fn) {
  queueMicrotask(fn);
}`,
    testHelperCode: `async function nextTick_test(scenario) {
  if (scenario === 'sync-after') {
    const log = [];
    log.push(1);
    nextTick(() => log.push(2));
    log.push(3);
    await Promise.resolve();
    return log;
  }
  if (scenario === 'before-setTimeout') {
    const log = [];
    setTimeout(() => log.push('macro'), 0);
    nextTick(() => log.push('micro'));
    await new Promise((r) => setTimeout(r, 50));
    return log;
  }
  if (scenario === 'nested') {
    const log = [];
    nextTick(() => {
      log.push('outer');
      nextTick(() => log.push('inner'));
    });
    await Promise.resolve();
    await Promise.resolve();
    return log;
  }
  if (scenario === 'returns-undefined') {
    const result = nextTick(() => {});
    await Promise.resolve();
    return result === undefined;
  }
}`,
  },
  {
    id: "jsel-h3",
    topicId: "js-event-loop",
    kind: "implement",
    title: "Реализуйте Promise.race",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте функцию \`myRace(promises)\`, которая ведёт себя как \`Promise.race\`:
- возвращает Promise, который **разрешается или отклоняется** значением/ошибкой **первого** завершившегося промиса из массива.
- если массив пуст — возвращённый промис **никогда не разрешается** (это поведение стандартного \`Promise.race\` — тестируем только содержательные случаи).
- значения в массиве могут быть не только промисами, но и обычными значениями — их следует трактовать как уже разрешённые промисы.

Запрещено использовать \`Promise.race\` или \`Promise.any\` внутри решения.

Хорошее упражнение на понимание того, как работают подписки на промисы и event loop.`,
    functionName: 'myRace_test',
    starterCode: `function myRace(promises) {
  // ваш код
}`,
    testCases: [
      { id: "jsel-h3-t1", inputDisplay: "первый resolve выигрывает", inputArgs: ['resolve-first'], expected: 'A' },
      { id: "jsel-h3-t2", inputDisplay: "первый reject отбрасывает", inputArgs: ['reject-first'], expected: 'Error: BOOM' },
      { id: "jsel-h3-t3", inputDisplay: "не-промис трактуется как resolved", inputArgs: ['non-promise'], expected: 42 },
      { id: "jsel-h3-t4", inputDisplay: "поздний reject не перебивает ранний resolve", inputArgs: ['late-reject'], expected: 'fast' },
      { id: "jsel-h3-t5", inputDisplay: "несколько resolve — выигрывает самый ранний", inputArgs: ['multiple-resolves'], expected: 'first' },
    ],
    hints: [
      'Создайте новый промис через `new Promise((resolve, reject) => ...)`. В колбэке подпишитесь на каждый элемент через `Promise.resolve(p).then(resolve, reject)`.',
      'Promise.resolve работает и для не-промисов: оборачивает их в уже-resolved промис.',
      'Не забывайте: после первого resolve/reject — последующие вызовы resolve/reject игнорируются.',
    ],
    solutionCode: `function myRace(promises) {
  return new Promise((resolve, reject) => {
    for (const p of promises) {
      Promise.resolve(p).then(resolve, reject);
    }
  });
}`,
    testHelperCode: `async function myRace_test(scenario) {
  const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
  const fail = (ms, msg) => new Promise((_, rj) => setTimeout(() => rj(new Error(msg)), ms));

  if (scenario === 'resolve-first') {
    return myRace([wait(50, 'A'), wait(200, 'B')]);
  }
  if (scenario === 'reject-first') {
    try {
      await myRace([fail(50, 'BOOM'), wait(200, 'B')]);
      return 'no-throw';
    } catch (e) {
      return 'Error: ' + e.message;
    }
  }
  if (scenario === 'non-promise') {
    return myRace([42, wait(100, 'late')]);
  }
  if (scenario === 'late-reject') {
    return myRace([wait(50, 'fast'), fail(200, 'late')]);
  }
  if (scenario === 'multiple-resolves') {
    return myRace([wait(50, 'first'), wait(100, 'second'), wait(150, 'third')]);
  }
}`,
  },
  {
    id: "jsel-h4",
    topicId: "js-event-loop",
    kind: "implement",
    title: "asyncRetry — повтор с экспоненциальной задержкой",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте \`asyncRetry(fn, { retries, delay, factor })\` — обёртку, которая вызывает асинхронную функцию \`fn()\` и при отказе **повторяет** её с экспоненциальной задержкой:
- \`retries\` — максимальное количество повторных попыток после первого вызова (например, retries=3 ⇒ всего 4 попытки).
- \`delay\` — начальная задержка между попытками (мс).
- \`factor\` — множитель задержки между попытками (например, factor=2 ⇒ \`delay\`, \`delay*2\`, \`delay*4\`, ...).

Если \`fn()\` в итоге успешна — резолвится её результатом. Если все попытки исчерпаны — реджектится **последней** ошибкой.

Классический сценарий для сетевых запросов: при сбое не «долбить» сервер с одинаковой паузой, а растягивать интервалы между попытками — это и называют **экспоненциальной задержкой** (exponential backoff).`,
    functionName: 'asyncRetry_test',
    starterCode: `function asyncRetry(fn, { retries, delay, factor }) {
  // ваш код
}`,
    testCases: [
      { id: "jsel-h4-t1", inputDisplay: "fn успешна с первого раза → 1 вызов", inputArgs: ['success-first'], expected: { result: 'ok', calls: 1 } },
      { id: "jsel-h4-t2", inputDisplay: "fn успешна со 2-й попытки → 2 вызова", inputArgs: ['success-second'], expected: { result: 'ok', calls: 2 } },
      { id: "jsel-h4-t3", inputDisplay: "fn падает все retries+1 раз → последняя ошибка", inputArgs: ['always-fail'], expected: 'Error: fail-3' },
      { id: "jsel-h4-t4", inputDisplay: "retries=0 → ровно 1 попытка", inputArgs: ['no-retries'], expected: 'Error: only-once' },
      { id: "jsel-h4-t5", inputDisplay: "задержки следуют delay * factor^i", inputArgs: ['exp-delay'], expected: true },
    ],
    hints: [
      'Сделайте рекурсию или цикл, увеличивая текущую задержку в `factor` раз после каждой неудачной попытки.',
      'Между попытками используйте `await new Promise(r => setTimeout(r, currentDelay))`.',
      'Не забудьте: общее количество попыток = `retries + 1`. Когда исчерпали — пробрасывайте последнюю ошибку.',
    ],
    solutionCode: `async function asyncRetry(fn, { retries, delay, factor }) {
  let current = delay;
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (attempt === retries) break;
      await new Promise((r) => setTimeout(r, current));
      current *= factor;
    }
  }
  throw lastErr;
}`,
    testHelperCode: `${VIRTUAL_TIME_PRELUDE}
async function asyncRetry_test(scenario) {
  resetVirtualTime();

  if (scenario === 'success-first') {
    let calls = 0;
    const fn = async () => { calls++; return 'ok'; };
    const r = await settle(asyncRetry(fn, { retries: 3, delay: 10, factor: 2 }));
    return { result: r.value, calls };
  }
  if (scenario === 'success-second') {
    let calls = 0;
    const fn = async () => {
      calls++;
      if (calls < 2) throw new Error('first-fail');
      return 'ok';
    };
    const r = await settle(asyncRetry(fn, { retries: 3, delay: 10, factor: 2 }));
    return { result: r.value, calls };
  }
  if (scenario === 'always-fail') {
    let calls = 0;
    const fn = async () => { calls++; throw new Error('fail-' + calls); };
    const r = await settle(asyncRetry(fn, { retries: 2, delay: 10, factor: 2 }));
    return r.ok ? 'no-throw' : 'Error: ' + r.reason;
  }
  if (scenario === 'no-retries') {
    let calls = 0;
    const fn = async () => { calls++; throw new Error('only-once'); };
    const r = await settle(asyncRetry(fn, { retries: 0, delay: 10, factor: 2 }));
    return r.ok ? 'no-throw' : 'Error: ' + r.reason;
  }
  if (scenario === 'exp-delay') {
    const stamps = [];
    let calls = 0;
    const fn = async () => {
      calls++;
      stamps.push(getNow());
      if (calls < 4) throw new Error('retry');
      return 'ok';
    };
    await settle(asyncRetry(fn, { retries: 3, delay: 50, factor: 2 }));
    return stamps.length === 4
      && stamps[0] === 0
      && stamps[1] === 50
      && stamps[2] === 150
      && stamps[3] === 350;
  }
}`,
  },
];
