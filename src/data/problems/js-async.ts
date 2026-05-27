import type { Problem } from "../../types/problem";
import { VIRTUAL_TIME_PRELUDE } from "./_virtualTime";

export const jsAsyncProblems: Problem[] = [
  {
    id: "jsa-p1",
    topicId: "js-async",
    title: "myPromiseAll — реализовать Promise.all",
    difficulty: "medium",
    isContextual: false,
    description: `Реализуйте функцию \`myPromiseAll(promises)\`, аналог \`Promise.all\`:
- Принимает массив промисов (или значений)
- Возвращает Promise, который резолвится массивом результатов в том же порядке
- Если хоть один промис реджектится — весь результат реджектится с этой ошибкой
- Все промисы запускаются параллельно

Примеры:
\`\`\`
await myPromiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3),
]); // → [1, 2, 3]

await myPromiseAll([
  Promise.resolve(1),
  Promise.reject(new Error('oops')),
]); // → reject 'oops'
\`\`\``,
    functionName: "myPromiseAll_test",
    starterCode: `function myPromiseAll(promises) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsa-p1-t1",
        inputDisplay: "[resolve(1), resolve(2), resolve(3)] → [1,2,3]",
        inputArgs: ["all-resolve"],
        expected: [1, 2, 3],
      },
      {
        id: "jsa-p1-t2",
        inputDisplay: "пустой массив → []",
        inputArgs: ["empty"],
        expected: [],
      },
      {
        id: "jsa-p1-t3",
        inputDisplay: "один reject → reject",
        inputArgs: ["one-reject"],
        expected: "Error: oops",
      },
      {
        id: "jsa-p1-t4",
        inputDisplay: "порядок результатов совпадает с порядком ввода",
        inputArgs: ["order"],
        expected: [1, 2, 3],
      },
      {
        id: "jsa-p1-t5",
        inputDisplay: "не-промисные значения обрабатываются",
        inputArgs: ["non-promise"],
        expected: [1, "hello", true],
      },
    ],
    hints: [
      "Все промисы должны стартовать сразу, но итоговый результат собрать строго в порядке входа. Какое состояние нужно вести, чтобы понять, что все завершились?",
      "Создайте новый промис, заранее заведите массив результатов и счётчик `completed`. Для каждого входного промиса подпишитесь и кладите значение по индексу `i`; когда счётчик достиг `promises.length` — резолвите. Любой реджект пробрасывайте в общий `reject` сразу.",
      `Главное — **порядок результатов и быстрый провал**. Порядок гарантируется тем, что каждый результат пишется в \`results[i]\` по своему индексу, а не пушится в произвольном порядке завершения. Быстрый провал: любой первый \`reject\` сразу прокидывает ошибку наружу, не дожидаясь остальных — это семантика «всё или ничего». При этом остальные промисы продолжают выполняться, просто их результаты уже никого не интересуют — отменить уже запущенные промисы нативно нельзя.

С чего начать:
\`\`\`js
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = new Array(promises.length);
    let completed = 0;
    // ...
  });
}
\`\`\``,
    ],
    solutionCode: `function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) { resolve([]); return; }

    const results = new Array(promises.length);
    let completed = 0;

    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then((val) => {
          results[i] = val;
          if (++completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}`,
    testHelperCode: `async function myPromiseAll_test(arg) {
  const delay = (ms, val) => new Promise(r => setTimeout(() => r(val), ms));
  if (arg === 'all-resolve') return myPromiseAll([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]);
  if (arg === 'empty') return myPromiseAll([]);
  if (arg === 'one-reject') {
    try { await myPromiseAll([Promise.resolve(1), Promise.reject(new Error('oops'))]); }
    catch (e) { return 'Error: ' + e.message; }
  }
  if (arg === 'order') {
    return myPromiseAll([delay(30, 1), delay(10, 2), delay(20, 3)]);
  }
  if (arg === 'non-promise') return myPromiseAll([1, 'hello', true]);
}`,
  },
  {
    id: "jsa-p2",
    topicId: "js-async",
    title: "myPromiseRace — реализовать Promise.race",
    difficulty: "easy",
    isContextual: false,
    description: `Реализуйте функцию \`myPromiseRace(promises)\`, аналог \`Promise.race\`:
- Возвращает Promise, который резолвится/реджектится с результатом **первого** завершившегося промиса
- Остальные промисы игнорируются (но продолжают выполняться)

Примеры:
\`\`\`
const fast = new Promise(r => setTimeout(() => r('fast'), 50));
const slow = new Promise(r => setTimeout(() => r('slow'), 200));

await myPromiseRace([fast, slow]); // → 'fast'
\`\`\``,
    functionName: "myPromiseRace_test",
    starterCode: `function myPromiseRace(promises) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsa-p2-t1",
        inputDisplay: "быстрый resolve побеждает",
        inputArgs: ["fast-resolve"],
        expected: "fast",
      },
      {
        id: "jsa-p2-t2",
        inputDisplay: "быстрый reject побеждает",
        inputArgs: ["fast-reject"],
        expected: "Error: fast-error",
      },
      {
        id: "jsa-p2-t3",
        inputDisplay: "resolve(1) vs reject — кто быстрее",
        inputArgs: ["mixed"],
        expected: 1,
      },
      {
        id: "jsa-p2-t4",
        inputDisplay: "один промис в массиве",
        inputArgs: ["single"],
        expected: 42,
      },
      {
        id: "jsa-p2-t5",
        inputDisplay: "возвращает Promise",
        inputArgs: ["is-promise"],
        expected: true,
      },
    ],
    hints: [
      "Создайте один общий промис и подпишитесь на все входные. Кто-нибудь завершится — мгновенно прокидываете его результат наружу. Что произойдёт с теми, кто завершится позже?",
      "Внутри `new Promise((resolve, reject) => ...)` пройдитесь по `promises` и сделайте `Promise.resolve(p).then(resolve, reject)`. Все последующие вызовы `resolve`/`reject` после первого молча игнорируются — это и даёт семантику гонки.",
      `Семантика гонки опирается на свойство промисов: **первый \`resolve\`/\`reject\` фиксирует состояние, все остальные молча игнорируются**. Поэтому даже не нужно явно отписываться или вести флаг «кто-то уже победил» — JS сам обработает повторные срабатывания как no-op. \`Promise.resolve(p)\` нужен, чтобы корректно работать с не-промисными значениями: число \`42\` в массиве должно вести себя как мгновенно зарезолвленный промис, а не падать с ошибкой.

С чего начать:
\`\`\`js
function myPromiseRace(promises) {
  return new Promise((resolve, reject) => {
    // ...
  });
}
\`\`\``,
    ],
    solutionCode: `function myPromiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((p) => {
      Promise.resolve(p).then(resolve).catch(reject);
    });
  });
}`,
    testHelperCode: `async function myPromiseRace_test(arg) {
  const delay = (ms, val) => new Promise(r => setTimeout(() => r(val), ms));
  if (arg === 'fast-resolve') return myPromiseRace([delay(50, 'fast'), delay(300, 'slow')]);
  if (arg === 'fast-reject') {
    try {
      await myPromiseRace([
        new Promise((_, r) => setTimeout(() => r(new Error('fast-error')), 10)),
        delay(300, 'slow'),
      ]);
    } catch (e) { return 'Error: ' + e.message; }
  }
  if (arg === 'mixed') return myPromiseRace([Promise.resolve(1), Promise.reject(new Error('fail'))]);
  if (arg === 'single') return myPromiseRace([Promise.resolve(42)]);
  if (arg === 'is-promise') return myPromiseRace([Promise.resolve(1)]) instanceof Promise;
}`,
  },
  {
    id: "jsa-p3",
    topicId: "js-async",
    title: "fetchWithTimeout — промис с таймаутом",
    difficulty: "easy",
    isContextual: true,
    description: `Напишите функцию \`fetchWithTimeout(promise, ms)\`, которая:
- Возвращает результат \`promise\`, если он завершается за \`ms\` миллисекунд
- Иначе реджектится с \`Error('Timeout')\`

Это частый паттерн при работе с сетевыми запросами.

Примеры:
\`\`\`
const slow = new Promise(r => setTimeout(() => r('data'), 500));
await fetchWithTimeout(slow, 100); // → Error: Timeout
await fetchWithTimeout(slow, 1000); // → 'data'
\`\`\``,
    functionName: "fetchWithTimeout_test",
    starterCode: `function fetchWithTimeout(promise, ms) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsa-p3-t1",
        inputDisplay: "промис завершается вовремя → его значение",
        inputArgs: ["in-time"],
        expected: "result",
      },
      {
        id: "jsa-p3-t2",
        inputDisplay: "промис слишком медленный → Error: Timeout",
        inputArgs: ["timeout"],
        expected: "Error: Timeout",
      },
      {
        id: "jsa-p3-t3",
        inputDisplay: "reject быстрее таймаута → оригинальный reject",
        inputArgs: ["reject-first"],
        expected: "Error: original",
      },
      {
        id: "jsa-p3-t4",
        inputDisplay: "ms = 0 — немедленный таймаут",
        inputArgs: ["zero-timeout"],
        expected: "Error: Timeout",
      },
      {
        id: "jsa-p3-t5",
        inputDisplay: "возвращает Promise",
        inputArgs: ["is-promise"],
        expected: true,
      },
    ],
    hints: [
      "Это гонка: либо запрос успеет, либо «звонит будильник» с ошибкой. Какой инструмент Promise разрешает такой сценарий — кто первый, тот и определяет результат?",
      "Создайте «таймаут-промис» через `new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))` и верните `Promise.race([promise, timeout])`. Если исходный реджектится раньше — его причина пробросится сама.",
      `Это паттерн «гонка с будильником». Таймер обязан **режектить**, а не резолвить — иначе истёкшее время не отличить от валидного ответа. Важно понимать: исходный промис не отменяется, даже если таймаут сработал первым — в нативном \`fetch\` для настоящей отмены нужен \`AbortController\`, передаваемый в запрос отдельно. Здесь мы лишь перестаём ждать ответ, а сам HTTP-запрос продолжает уходить и тратить ресурсы клиента и сервера.

С чего начать:
\`\`\`js
function fetchWithTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => {
    // ...
  });
  return Promise.race([promise, timeout]);
}
\`\`\``,
    ],
    solutionCode: `function fetchWithTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
  return Promise.race([promise, timeout]);
}`,
    testHelperCode: `async function fetchWithTimeout_test(arg) {
  const delay = (ms) => new Promise(r => setTimeout(r, ms));
  if (arg === 'in-time') return fetchWithTimeout(Promise.resolve('result'), 1000);
  if (arg === 'timeout') {
    try { await fetchWithTimeout(delay(500).then(() => 'data'), 10); }
    catch (e) { return 'Error: ' + e.message; }
  }
  if (arg === 'reject-first') {
    try { await fetchWithTimeout(Promise.reject(new Error('original')), 1000); }
    catch (e) { return 'Error: ' + e.message; }
  }
  if (arg === 'zero-timeout') {
    try { await fetchWithTimeout(delay(100).then(() => 'data'), 0); }
    catch (e) { return 'Error: ' + e.message; }
  }
  if (arg === 'is-promise') return fetchWithTimeout(Promise.resolve(1), 1000) instanceof Promise;
}`,
  },
  {
    id: "jsa-p4",
    topicId: "js-async",
    title: "promisify — конвертация callback в Promise",
    difficulty: "easy",
    isContextual: false,
    description: `Напишите функцию \`promisify(fn)\`, которая конвертирует функцию в Node.js callback-стиле в функцию, возвращающую Promise.

Node.js callback-стиль: последний аргумент — callback вида \`(err, result) => void\`.

Примеры:
\`\`\`
function readFile(path, callback) {
  setTimeout(() => {
    if (path === 'good.txt') callback(null, 'file content');
    else callback(new Error('not found'));
  }, 10);
}

const readAsync = promisify(readFile);
await readAsync('good.txt');  // → 'file content'
await readAsync('bad.txt');   // → reject Error: not found
\`\`\``,
    functionName: "promisify_test",
    starterCode: `function promisify(fn) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsa-p4-t1",
        inputDisplay: "успешный callback → resolve с результатом",
        inputArgs: ["success"],
        expected: "file content",
      },
      {
        id: "jsa-p4-t2",
        inputDisplay: "callback с ошибкой → reject",
        inputArgs: ["error"],
        expected: "Error: not found",
      },
      {
        id: "jsa-p4-t3",
        inputDisplay: "возвращает функцию",
        inputArgs: ["returns-function"],
        expected: true,
      },
      {
        id: "jsa-p4-t4",
        inputDisplay: "результирующая функция возвращает Promise",
        inputArgs: ["returns-promise"],
        expected: true,
      },
      {
        id: "jsa-p4-t5",
        inputDisplay: "аргументы передаются в оригинальную функцию",
        inputArgs: ["passes-args"],
        expected: "content-42",
      },
    ],
    hints: [
      "Нужно вернуть функцию, которая принимает любые аргументы пользователя, добавляет к ним свой колбэк-«мост» и превращает его срабатывание в исход промиса. Как такой «мост» соотносится с `resolve`/`reject`?",
      "Возвращаемая функция собирает аргументы через rest и оборачивает вызов в `new Promise`. В исполнителе вызовите `fn(...args, (err, result) => err ? reject(err) : resolve(result))`.",
      `Главный момент — **колбэк добавляется в конец списка аргументов**. Это конвенция Node.js error-first: \`(err, result) => ...\`. Наша задача — превратить эти два пути (\`err\` или \`result\`) в \`reject\`/\`resolve\`. Тонкость: если оригинальная функция вызывает колбэк **синхронно** (что иногда бывает), исполнитель промиса успеет вызвать \`resolve\` ещё до возврата \`new Promise\` — это нормально и безопасно. А вот если функция использует не error-first соглашение, придётся писать собственную обёртку — универсального \`promisify\` для всех колбэк-стилей не бывает.

С чего начать:
\`\`\`js
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      // ...
    });
  };
}
\`\`\``,
    ],
    solutionCode: `function promisify(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
}`,
    testHelperCode: `async function promisify_test(arg) {
  function readFile(path, callback) {
    setTimeout(() => {
      if (path === 'good.txt') callback(null, 'file content');
      else callback(new Error('not found'));
    }, 0);
  }
  function nodeStyleFn(a, b, callback) {
    setTimeout(() => callback(null, a + '-' + b), 0);
  }
  if (arg === 'success') return promisify(readFile)('good.txt');
  if (arg === 'error') {
    try { await promisify(readFile)('bad.txt'); }
    catch (e) { return 'Error: ' + e.message; }
  }
  if (arg === 'returns-function') return typeof promisify(readFile) === 'function';
  if (arg === 'returns-promise') return promisify(readFile)('good.txt') instanceof Promise;
  if (arg === 'passes-args') return promisify(nodeStyleFn)('content', '42');
}`,
  },
  {
    id: "jsa-p5",
    topicId: "js-async",
    title: "limitConcurrency — ограниченный параллелизм",
    difficulty: "medium",
    isContextual: true,
    description: `Реализуйте функцию \`limitConcurrency(fns, limit)\`:
- \`fns\` — массив функций, каждая возвращает Promise
- \`limit\` — максимальное количество одновременно выполняющихся промисов
- Возвращает Promise с массивом всех результатов в исходном порядке

Это критично для API с rate-limit — не более N запросов одновременно.

Примеры:
\`\`\`
// Выполнить 10 задач, не более 3 одновременно:
await limitConcurrency(tasks, 3);
\`\`\``,
    functionName: "limitConcurrency_test",
    starterCode: `async function limitConcurrency(fns, limit) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsa-p5-t1",
        inputDisplay: "[fn1, fn2, fn3], limit=10 → все выполняются",
        inputArgs: ["all-complete"],
        expected: [1, 2, 3],
      },
      {
        id: "jsa-p5-t2",
        inputDisplay: "пустой массив → []",
        inputArgs: ["empty"],
        expected: [],
      },
      {
        id: "jsa-p5-t3",
        inputDisplay: "порядок результатов совпадает с порядком задач",
        inputArgs: ["order"],
        expected: [1, 2, 3, 4, 5],
      },
      {
        id: "jsa-p5-t4",
        inputDisplay: "limit=1 → последовательное выполнение",
        inputArgs: ["sequential"],
        expected: [1, 2, 3],
      },
      {
        id: "jsa-p5-t5",
        inputDisplay: "одновременно не более limit задач",
        inputArgs: ["concurrency-check"],
        expected: true,
      },
    ],
    hints: [
      "Запускайте задачи по одной, но не ждите завершения каждой — добавляйте её в «пул активных» и, когда пул дорастает до `limit`, делайте паузу до момента, пока хоть одна не завершится. Какая операция Promise позволяет дождаться «любого первого»?",
      "Заведите `Set` активных промисов. Для каждой задачи: запустите её, кладите результат в `results[i]`, после завершения удаляйте сама себя из множества. Если `size >= limit` — `await Promise.race(executing)`. После цикла — `await Promise.all(executing)`.",
      `Ключевая тонкость — **самоудаление из пула**. Каждая активная задача должна сама вычеркнуться из \`executing\` по завершении, иначе \`Promise.race\` будет вечно возвращать уже завершённые промисы и цикл не двинется. Поэтому оборачиваем промис в \`.finally(() => executing.delete(...))\` и кладём в множество **именно эту обёртку**, а не оригинал. Ещё один момент: индекс \`i\` фиксируется в замыкании при запуске задачи, поэтому результат всегда ложится в правильную позицию, независимо от порядка завершения.

С чего начать:
\`\`\`js
async function limitConcurrency(fns, limit) {
  const results = new Array(fns.length);
  const executing = new Set();
  // ...
  return results;
}
\`\`\``,
    ],
    solutionCode: `async function limitConcurrency(fns, limit) {
  const results = new Array(fns.length);
  const executing = new Set();

  for (let i = 0; i < fns.length; i++) {
    const p = (async (index) => {
      results[index] = await fns[index]();
    })(i);

    const cleanup = p.finally(() => executing.delete(cleanup));
    executing.add(cleanup);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}`,
    testHelperCode: `async function limitConcurrency_test(arg) {
  const delay = (ms) => new Promise(r => setTimeout(r, ms));
  if (arg === 'all-complete') {
    return limitConcurrency([() => Promise.resolve(1), () => Promise.resolve(2), () => Promise.resolve(3)], 10);
  }
  if (arg === 'empty') return limitConcurrency([], 3);
  if (arg === 'order') {
    return limitConcurrency([1,2,3,4,5].map(i => () => Promise.resolve(i)), 2);
  }
  if (arg === 'sequential') {
    return limitConcurrency([1,2,3].map(i => () => Promise.resolve(i)), 1);
  }
  if (arg === 'concurrency-check') {
    let running = 0, maxRunning = 0;
    const fns = Array(6).fill(null).map(() => async () => {
      running++;
      maxRunning = Math.max(maxRunning, running);
      await delay(10);
      running--;
      return 1;
    });
    await limitConcurrency(fns, 2);
    return maxRunning <= 2;
  }
}`,
  },
  {
    kind: "predict-output",
    id: "jsa-p6",
    topicId: "js-async",
    title: "Определи вывод: await, Promise.then и queueMicrotask",
    difficulty: "medium",
    isContextual: false,
    description: `Перед вами смесь синхронного кода, \`async\`/\`await\`, \`Promise.then\` и \`queueMicrotask\`. Введите каждую напечатанную строку на отдельной строке поля ответа.`,
    code: `async function run() {
  console.log('A');
  await Promise.resolve();
  console.log('B');
  await Promise.resolve();
  console.log('C');
}

console.log('1');
run();
queueMicrotask(() => console.log('Q'));
Promise.resolve().then(() => console.log('T'));
console.log('2');`,
    expected: "1\nA\n2\nB\nQ\nT\nC",
    hints: [
      "Шаг 1: синхронно выполнится `1`, начало `run()` до первого `await` (печатается `A`) и затем `2`. Первый `await` ставит «продолжение №1» (печать `B`) в очередь микрозадач.",
      "Шаг 2: после `1`, `A`, `2` в очереди лежат: продолжение №1 (B), затем `queueMicrotask` (Q), затем `then` (T). Движок выполняет их по порядку. Когда печатается `B`, встречается второй `await` — он ставит «продолжение №2» (печать `C`) в конец очереди.",
      "Шаг 3: после `B` очередь: Q, T, продолжение №2. Выполняются по порядку — печатается `Q`, `T`, `C`. Итог: `1`, `A`, `2`, `B`, `Q`, `T`, `C`.",
    ],
    solutionCode: `// 1 — синхронно
// run() начинает выполняться: A — тоже синхронно, до первого await
// первый await ставит продолжение №1 (печать B) в очередь микрозадач
// queueMicrotask(Q) — добавлена в очередь микрозадач ПОСЛЕ продолжения №1
// Promise.resolve().then(T) — добавлена в очередь после Q
// 2 — синхронно
// Дальше движок разбирает очередь микрозадач по порядку (FIFO):
//   продолжение №1: печатает B, ставит продолжение №2 (печать C) в очередь
//   Q
//   T
//   продолжение №2: печатает C
// Итог: 1, A, 2, B, Q, T, C`,
  },
  {
    kind: "find-bug",
    id: "jsa-p7",
    topicId: "js-async",
    title: "Найдите баг: параллельный запуск задач",
    difficulty: "easy",
    isContextual: false,
    description: `Функция \`runAll(fns)\` получает массив async-функций и должна вернуть массив их результатов в исходном порядке. Что-то пошло не так — результаты не те, что ожидаются. Найдите и исправьте.`,
    buggyCode: `async function runAll(fns) {
  return await Promise.all(fns);
}`,
    functionName: "jsa_p7_test",
    bugSummary:
      "Promise.all принимает итерируемое промисов (или значений), а не функций. Чтобы запустить функции, их нужно вызвать: `Promise.all(fns.map((fn) => fn()))`. Без этого Promise.all резолвится массивом самих функций как обычных значений.",
    testCases: [
      {
        id: "jsa-p7-t1",
        inputDisplay: "все async-функции выполнены → массив значений",
        inputArgs: ["basic"],
        expected: [1, 2, 3],
      },
      {
        id: "jsa-p7-t2",
        inputDisplay: "элементы — числа, не функции",
        inputArgs: ["types"],
        expected: "number,number,number",
      },
      {
        id: "jsa-p7-t3",
        inputDisplay: "порядок результатов соответствует порядку входа",
        inputArgs: ["order"],
        expected: [10, 20, 30],
      },
      {
        id: "jsa-p7-t4",
        inputDisplay: "пустой массив → []",
        inputArgs: ["empty"],
        expected: [],
      },
    ],
    hints: [
      "Тест ожидает массив чисел, а возвращается что-то другое. Посмотрите, что вообще лежит в `fns` — это уже промисы или ещё нет?",
      "В массиве лежат **функции**, которые надо вызвать, чтобы получить промисы. `Promise.all(fns)` просто пропускает функции как обычные значения. Преобразуйте сначала: `fns.map((fn) => fn())`.",
      "Главный урок — `Promise.all` ждёт **итерируемое промисов (или значений)**, но **не функций**. Функция сама по себе — обычное значение, и `Promise.all` спокойно возвращает её как есть, не вызывая. Это типичный баг, когда смешивают «массив тасков» (функций, которые ещё не запущены) и «массив промисов» (уже запущенных операций). Разница принципиальная: функции запускаются явно, промисы — уже выполняются. Чтобы перейти от первого ко второму, нужен `.map(fn => fn())`.",
    ],
    solutionCode: `async function runAll(fns) {
  return await Promise.all(fns.map((fn) => fn()));
}`,
    testHelperCode: `async function jsa_p7_test(arg) {
  const delay = (ms, val) => new Promise((r) => setTimeout(() => r(val), ms));
  if (arg === 'basic') {
    return await runAll([
      () => Promise.resolve(1),
      () => Promise.resolve(2),
      () => Promise.resolve(3),
    ]);
  }
  if (arg === 'types') {
    const result = await runAll([
      () => Promise.resolve(1),
      () => Promise.resolve(2),
      () => Promise.resolve(3),
    ]);
    return result.map((x) => typeof x).join(',');
  }
  if (arg === 'order') {
    return await runAll([
      () => delay(20, 10),
      () => delay(5, 20),
      () => delay(10, 30),
    ]);
  }
  if (arg === 'empty') {
    return await runAll([]);
  }
}`,
  },
  {
    kind: "refactor",
    id: "jsa-p8",
    topicId: "js-async",
    title: "Оптимизируй: sequential await → parallel Promise.all",
    difficulty: "easy",
    isContextual: false,
    description: `Функция \`fetchAllParallel(urls, fetcher)\` загружает данные по списку URL и возвращает массив результатов в исходном порядке. Текущая реализация выполняет загрузку **последовательно** через \`for...of\` + \`await\` — это медленно, так как сумма всех задержек складывается.

Перепишите функцию так, чтобы она запускала все загрузки **параллельно** через \`Promise.all\`, сохраняя порядок результатов. Корректность: результат должен совпадать с прежним элемент-в-элемент.

Сигнатура остаётся: \`fetchAllParallel(urls, fetcher)\` принимает массив строк и async-функцию \`fetcher(url)\`, возвращает Promise с массивом результатов.`,
    functionName: "fetchAllParallel_test",
    starterCode: `async function fetchAllParallel(urls, fetcher) {
  // Текущая реализация — последовательная.
  // Перепишите через Promise.all + map, чтобы запросы шли параллельно.
  const results = [];
  for (const url of urls) {
    results.push(await fetcher(url));
  }
  return results;
}`,
    testCases: [
      {
        id: "jsa-p8-t1",
        inputDisplay: "3 URL → массив результатов в исходном порядке",
        inputArgs: ["order"],
        expected: ["data:a", "data:b", "data:c"],
      },
      {
        id: "jsa-p8-t2",
        inputDisplay: "пустой массив → []",
        inputArgs: ["empty"],
        expected: [],
      },
      {
        id: "jsa-p8-t3",
        inputDisplay: "результат — массив значений (не промисов)",
        inputArgs: ["types"],
        expected: "string,string,string",
      },
      {
        id: "jsa-p8-t4",
        inputDisplay: "порядок сохраняется при разных задержках",
        inputArgs: ["varied-delays"],
        expected: [1, 2, 3],
      },
      {
        id: "jsa-p8-t5",
        inputDisplay: "параллельность: все запросы стартуют одновременно",
        inputArgs: ["parallel-check"],
        expected: true,
      },
    ],
    hints: [
      "`for...of` с `await` тормозит на каждой итерации. Нужно сначала превратить все URL в массив уже запущенных промисов, и только потом дожидаться их всех вместе.",
      "Используйте `urls.map((url) => fetcher(url))` — это сразу стартует все запросы и даёт массив промисов с сохранённым порядком. Затем `await Promise.all(...)` соберёт результаты в том же порядке.",
      `Главное — понять, **в какой момент стартуют запросы**. \`urls.map(url => fetcher(url))\` синхронно вызывает все \`fetcher\`-ы, и каждый возвращает уже запущенный промис: к моменту, когда \`map\` завершится, все HTTP-запросы уже в полёте. \`await Promise.all(...)\` лишь дожидается их завершения. В версии с \`for...of + await\` запрос \`n+1\` физически не начинается, пока не завершился \`n\` — отсюда суммарная задержка вместо максимальной. Минус параллельной версии — нельзя ограничить одновременную нагрузку, нужны другие паттерны (\`asyncPool\`, очередь).

С чего начать:
\`\`\`js
async function fetchAllParallel(urls, fetcher) {
  // ...
}
\`\`\``,
    ],
    solutionCode: `async function fetchAllParallel(urls, fetcher) {
  return await Promise.all(urls.map((url) => fetcher(url)));
}`,
    testHelperCode: `async function fetchAllParallel_test(arg) {
  const delay = (ms, val) => new Promise((r) => setTimeout(() => r(val), ms));
  const fetcher = (url) => delay(5, 'data:' + url);
  if (arg === 'order') {
    return await fetchAllParallel(['a', 'b', 'c'], fetcher);
  }
  if (arg === 'empty') {
    return await fetchAllParallel([], fetcher);
  }
  if (arg === 'types') {
    const result = await fetchAllParallel(['a', 'b', 'c'], fetcher);
    return result.map((x) => typeof x).join(',');
  }
  if (arg === 'varied-delays') {
    const variedFetcher = (n) => delay(n === 1 ? 30 : n === 2 ? 10 : 20, n);
    return await fetchAllParallel([1, 2, 3], variedFetcher);
  }
  if (arg === 'parallel-check') {
    let started = 0, maxStarted = 0;
    const trackingFetcher = async (url) => {
      started++;
      maxStarted = Math.max(maxStarted, started);
      await delay(15, null);
      started--;
      return url;
    };
    await fetchAllParallel(['a', 'b', 'c'], trackingFetcher);
    // Если parallel — все 3 стартуют одновременно (maxStarted === 3).
    // Если sequential — maxStarted === 1.
    return maxStarted === 3;
  }
}`,
  },
  {
    id: "jsa-h1",
    topicId: "js-async",
    kind: "implement",
    title: "myPromiseAny — реализовать Promise.any",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте \`myPromiseAny(promises)\` — аналог \`Promise.any\`:
- Резолвится **первым успешным** результатом из массива
- Если **все** промисы реджектятся — реджектится с \`AggregateError\` (массив всех ошибок)
- Пустой массив → сразу реджектится с \`AggregateError([])\`

Примеры:
\`\`\`
await myPromiseAny([
  Promise.reject('a'),
  Promise.resolve('b'),
  Promise.resolve('c'),
]); // → 'b'  (первый успешный)

await myPromiseAny([
  Promise.reject('x'),
  Promise.reject('y'),
]); // → AggregateError(['x', 'y'])
\`\`\``,
    functionName: "myPromiseAny_test",
    starterCode: `function myPromiseAny(promises) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsa-h1-t1",
        inputDisplay: "первый успешный resolve",
        inputArgs: ["first-resolve"],
        expected: "b",
      },
      {
        id: "jsa-h1-t2",
        inputDisplay: "все reject → AggregateError",
        inputArgs: ["all-reject"],
        expected: "AggregateError",
      },
      {
        id: "jsa-h1-t3",
        inputDisplay: "пустой массив → AggregateError",
        inputArgs: ["empty"],
        expected: "AggregateError",
      },
      {
        id: "jsa-h1-t4",
        inputDisplay: "победитель — быстрейший resolve",
        inputArgs: ["fastest"],
        expected: "fast",
      },
      {
        id: "jsa-h1-t5",
        inputDisplay: "все resolve → берётся первый",
        inputArgs: ["all-resolve"],
        expected: 1,
      },
    ],
    hints: [
      "Зеркально к `Promise.race`: успех — первый, кто разрешился; провал — только если ВСЕ отклонились. Что нужно вести, чтобы понять, что все провалились?",
      "Заведите массив `errors` той же длины, что и `promises`, и счётчик `rejectedCount`. На каждом fulfilled — сразу `resolve(val)`. На rejected — пишите ошибку по индексу `i`; когда счётчик достиг длины массива — `reject(new AggregateError(errors, '...'))`. Пустой массив — реджектите сразу с `AggregateError([], ...)`.",
      `\`Promise.any\` — это **зеркало** \`Promise.all\`. У \`all\` любая ошибка моментально валит весь результат, у \`any\` любой успех моментально его фиксирует; провал у \`any\` происходит только когда **все** упали. Ошибки собираются по индексам в массив, чтобы порядок в \`AggregateError.errors\` соответствовал порядку входа. Граничный случай — пустой массив: формально «все провалились» истинно по vacuous truth, поэтому реджектим сразу с \`AggregateError([])\`. Это редко полезно на практике, но соответствует поведению нативного \`Promise.any\`.

С чего начать:
\`\`\`js
function myPromiseAny(promises) {
  return new Promise((resolve, reject) => {
    const errors = new Array(promises.length);
    let rejectedCount = 0;
    // ...
  });
}
\`\`\``,
    ],
    solutionCode: `function myPromiseAny(promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      reject(new AggregateError([], 'All promises were rejected'));
      return;
    }

    const errors = new Array(promises.length);
    let rejectedCount = 0;

    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        (val) => resolve(val),
        (err) => {
          errors[i] = err;
          if (++rejectedCount === promises.length) {
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        }
      );
    });
  });
}`,
    testHelperCode: `async function myPromiseAny_test(scenario) {
  if (scenario === 'first-resolve') {
    return await myPromiseAny([Promise.reject('a'), Promise.resolve('b'), Promise.resolve('c')]);
  }
  if (scenario === 'all-reject') {
    try { await myPromiseAny([Promise.reject('x'), Promise.reject('y')]); }
    catch (e) { return e instanceof AggregateError ? 'AggregateError' : 'other'; }
  }
  if (scenario === 'empty') {
    try { await myPromiseAny([]); }
    catch (e) { return e instanceof AggregateError ? 'AggregateError' : 'other'; }
  }
  if (scenario === 'fastest') {
    const slow = new Promise(res => setTimeout(() => res('slow'), 100));
    const fast = new Promise(res => setTimeout(() => res('fast'), 10));
    return await myPromiseAny([slow, fast]);
  }
  if (scenario === 'all-resolve') {
    return await myPromiseAny([Promise.resolve(1), Promise.resolve(2)]);
  }
}`,
  },
  {
    id: "jsa-h2",
    topicId: "js-async",
    kind: "implement",
    title: "Async pool — параллельный перебор с ограничением",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте функцию \`asyncPool(concurrency, items, fn)\`:
- Применяет асинхронную функцию \`fn\` ко всем элементам \`items\`
- Одновременно выполняется не более \`concurrency\` задач
- Возвращает промис массива результатов **в том же порядке**, что и items

Отличие от обычного \`Promise.all\`: тот стартует все задачи разом, а здесь у нас есть **потолок параллелизма**.

Примеры:
\`\`\`
const delay = (ms) => new Promise(res => setTimeout(res, ms));

const results = await asyncPool(2, [1, 2, 3, 4, 5],
  async (n) => { await delay(n * 10); return n * 2; }
);
// → [2, 4, 6, 8, 10]  (порядок сохранён)
\`\`\``,
    functionName: "asyncPool_test",
    starterCode: `async function asyncPool(concurrency, items, fn) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsa-h2-t1",
        inputDisplay: "результаты в исходном порядке",
        inputArgs: ["order"],
        expected: [2, 4, 6, 8, 10],
      },
      {
        id: "jsa-h2-t2",
        inputDisplay: "не более concurrency параллельных задач",
        inputArgs: ["concurrency"],
        expected: true,
      },
      {
        id: "jsa-h2-t3",
        inputDisplay: "пустой массив → []",
        inputArgs: ["empty"],
        expected: [],
      },
    ],
    hints: [
      "Идите по `items` в цикле и сразу запускайте задачу — но кладите её в `Set` активных. Как только их становится `>= concurrency`, дождитесь, пока любая завершится, и только потом стартуйте следующую.",
      "Используйте `Set<Promise>` + `Promise.race(running)` для ожидания свободного слота. Чтобы порядок результатов совпадал с `items`, в обёртке записывайте `results[i] = await fn(items[i], i)`. После цикла дождитесь оставшихся через `Promise.all(running)`.",
      `Главная ловушка — **порядок результатов** при произвольном порядке завершения. Если просто пушить в массив по мере готовности, порядок выхода будет соответствовать скорости задач, а не их месту во входном массиве. Решается фиксацией индекса при запуске: \`results[i] = await fn(items[i], i)\` — \`i\` захватывается замыканием. Ещё нюанс: после цикла обязательно \`await Promise.all(running)\` — иначе функция вернётся, пока последняя порция задач ещё в воздухе, и \`results\` будет неполным.

С чего начать:
\`\`\`js
async function asyncPool(concurrency, items, fn) {
  const results = new Array(items.length);
  const running = new Set();
  // ...
  return results;
}
\`\`\``,
    ],
    solutionCode: `async function asyncPool(concurrency, items, fn) {
  const results = new Array(items.length);
  const running = new Set();

  for (let i = 0; i < items.length; i++) {
    const promise = fn(items[i], i).then((val) => {
      results[i] = val;
    });
    const wrapped = promise.then(() => running.delete(wrapped));
    running.add(wrapped);

    if (running.size >= concurrency) {
      await Promise.race(running);
    }
  }

  await Promise.all(running);
  return results;
}`,
    testHelperCode: `async function asyncPool_test(scenario) {
  const delay = (ms) => new Promise(res => setTimeout(res, ms));
  if (scenario === 'order') {
    return await asyncPool(2, [1,2,3,4,5], async (n) => { await delay(n * 5); return n * 2; });
  }
  if (scenario === 'concurrency') {
    let active = 0, maxActive = 0;
    await asyncPool(2, [1,2,3,4], async () => {
      active++;
      maxActive = Math.max(maxActive, active);
      await delay(20);
      active--;
    });
    return maxActive <= 2;
  }
  if (scenario === 'empty') {
    return await asyncPool(3, [], async (x) => x);
  }
}`,
  },
  {
    id: "jsa-m1",
    topicId: "js-async",
    title: "poll — повторять проверку до успеха или таймаута",
    difficulty: "medium",
    isContextual: false,
    description: `Реализуйте \`poll(check, intervalMs, timeoutMs)\` — функцию, которая **повторно** вызывает \`check()\` каждые \`intervalMs\` мс, пока:
- \`check()\` не вернёт **truthy** значение (синхронно или через промис) — тогда промис резолвится этим значением;
- либо не истечёт \`timeoutMs\` — тогда промис **реджектится** с \`new Error('Timeout')\`.

Первый вызов \`check()\` происходит **сразу** (без задержки).

Это классический паттерн ожидания готовности (например, появление элемента на странице, готовность бэкенд-задачи).

Пример:
\`\`\`
let n = 0;
const value = await poll(() => (++n >= 3 ? 'done' : null), 50, 1000);
// value === 'done'    n === 3
\`\`\``,
    functionName: 'poll_test',
    starterCode: `async function poll(check, intervalMs, timeoutMs) {
  // ваш код
}`,
    testCases: [
      { id: 'jsa-m1-t1', inputDisplay: "check сразу truthy → 1 вызов", inputArgs: ['immediate'], expected: { result: 'ready', calls: 1 } },
      { id: 'jsa-m1-t2', inputDisplay: "check truthy на 3-й попытке", inputArgs: ['third-try'], expected: { result: 'done', calls: 3 } },
      { id: 'jsa-m1-t3', inputDisplay: "check никогда не truthy → Timeout", inputArgs: ['timeout'], expected: 'Error: Timeout' },
      { id: 'jsa-m1-t4', inputDisplay: "async check тоже работает", inputArgs: ['async-check'], expected: 'async-ok' },
    ],
    hints: [
      "Опрос — это цикл «проверил → если не вышло, подождал → снова проверил». Первая попытка должна быть мгновенной, а общую длительность нужно ограничить. Какие два состояния нужно вести?",
      "Запомните `start = Date.now()`. В бесконечном цикле: `val = await check()`, если truthy — `return val`. Если истекло время с момента старта (`Date.now() - start >= timeoutMs`) — бросьте `new Error('Timeout')`. Иначе подождите `intervalMs` через `await new Promise(r => setTimeout(r, intervalMs))`.",
      `Главное — **первый вызов должен быть мгновенным**, а не через \`intervalMs\`. Часто полезное условие уже выполнено к моменту запуска (например, элемент уже на странице), и заставлять пользователя ждать первую паузу зря. Поэтому проверка делается **до** сна, а не после. Ещё один нюанс — \`await check()\` корректно работает и с синхронными, и с асинхронными \`check\`: если \`check\` вернула обычное значение, \`await\` просто прокидывает его дальше, оборачивая в промис. Также важно: \`timeoutMs\` отсчитывается от **начала** функции, а не от последней проверки — иначе при \`check\`, выполняющейся долго, общее время может неограниченно расти.

С чего начать:
\`\`\`js
async function poll(check, intervalMs, timeoutMs) {
  const start = Date.now();
  while (true) {
    // ...
  }
}
\`\`\``,
    ],
    solutionCode: `async function poll(check, intervalMs, timeoutMs) {
  const start = Date.now();
  while (true) {
    const val = await check();
    if (val) return val;
    if (Date.now() - start >= timeoutMs) throw new Error('Timeout');
    await new Promise((r) => setTimeout(r, intervalMs));
  }
}`,
    testHelperCode: `async function poll_test(scenario) {
  if (scenario === 'immediate') {
    let calls = 0;
    const result = await poll(() => { calls++; return 'ready'; }, 50, 1000);
    return { result, calls };
  }
  if (scenario === 'third-try') {
    let calls = 0;
    const result = await poll(() => { calls++; return calls >= 3 ? 'done' : null; }, 30, 1000);
    return { result, calls };
  }
  if (scenario === 'timeout') {
    try {
      await poll(() => null, 30, 100);
      return 'no-throw';
    } catch (e) {
      return 'Error: ' + e.message;
    }
  }
  if (scenario === 'async-check') {
    let n = 0;
    return await poll(async () => {
      await new Promise((r) => setTimeout(r, 10));
      return ++n >= 2 ? 'async-ok' : null;
    }, 30, 1000);
  }
}`,
  },
  {
    id: "jsa-h3",
    topicId: "js-async",
    kind: "implement",
    title: "myPromiseAllSettled — реализовать Promise.allSettled",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте \`myPromiseAllSettled(promises)\` — аналог \`Promise.allSettled\`:
- возвращает Promise, который **резолвится** после того, как **все** входные промисы завершились (успешно или с ошибкой).
- никогда не реджектится.
- результирующий массив имеет **тот же порядок**, что и входной, и состоит из объектов:
  - \`{ status: 'fulfilled', value }\` — если промис выполнен;
  - \`{ status: 'rejected', reason }\` — если промис отклонён.
- значения не-промисы трактуются как уже выполненные промисы.

**Запрещено** использовать \`Promise.allSettled\` внутри.

Хорошая задача на понимание того, как работают коллбэки \`.then(onFulfilled, onRejected)\` и как аккуратно собрать результаты в правильном порядке.`,
    functionName: 'myAllSettled_test',
    starterCode: `function myPromiseAllSettled(promises) {
  // ваш код
}`,
    testCases: [
      { id: 'jsa-h3-t1', inputDisplay: "все fulfilled", inputArgs: ['all-fulfilled'], expected: [{ status: 'fulfilled', value: 1 }, { status: 'fulfilled', value: 2 }, { status: 'fulfilled', value: 3 }] },
      { id: 'jsa-h3-t2', inputDisplay: "все rejected", inputArgs: ['all-rejected'], expected: [{ status: 'rejected', reason: 'a' }, { status: 'rejected', reason: 'b' }] },
      { id: 'jsa-h3-t3', inputDisplay: "смешанные fulfilled/rejected", inputArgs: ['mixed'], expected: [{ status: 'fulfilled', value: 1 }, { status: 'rejected', reason: 'boom' }, { status: 'fulfilled', value: 3 }] },
      { id: 'jsa-h3-t4', inputDisplay: "пустой массив → []", inputArgs: ['empty'], expected: [] },
      { id: 'jsa-h3-t5', inputDisplay: "не-промисы в массиве как fulfilled", inputArgs: ['non-promises'], expected: [{ status: 'fulfilled', value: 42 }, { status: 'fulfilled', value: 'hi' }] },
    ],
    hints: [
      "В отличие от `Promise.all`, этот вариант **никогда не реджектится**: и успех, и ошибку каждого промиса нужно обернуть в объект-описатель и положить в массив на правильное место.",
      "Используйте `Promise.resolve(p).then(onFulfilled, onRejected)` — два колбэка позволяют обработать оба исхода. В `onFulfilled` пишите `{ status: 'fulfilled', value }`, в `onRejected` — `{ status: 'rejected', reason }`. Считайте `done`; когда он равен длине массива — `resolve(results)`.",
      `Главное отличие от \`Promise.all\` — \`allSettled\` **никогда не реджектится**. Ошибка любого промиса не «выпрыгивает» наружу, а оборачивается в дескриптор \`{ status: 'rejected', reason }\` и кладётся на своё место в массиве. Поэтому исполнителю не нужен параметр \`reject\` — он принципиально не используется. Тонкость: важно подписываться через **двухаргументный** \`.then(onFulfilled, onRejected)\`, а не через \`.then(...).catch(...)\` — в цепочке \`then().catch()\` ошибка из \`onFulfilled\` (например, при записи в \`results[i]\`) попадёт в \`catch\` и спутает учёт.

С чего начать:
\`\`\`js
function myPromiseAllSettled(promises) {
  return new Promise((resolve) => {
    const results = new Array(promises.length);
    let done = 0;
    // ...
  });
}
\`\`\``,
    ],
    solutionCode: `function myPromiseAllSettled(promises) {
  return new Promise((resolve) => {
    const results = new Array(promises.length);
    if (promises.length === 0) {
      resolve(results);
      return;
    }
    let done = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        (value) => {
          results[i] = { status: 'fulfilled', value };
          if (++done === promises.length) resolve(results);
        },
        (reason) => {
          results[i] = { status: 'rejected', reason };
          if (++done === promises.length) resolve(results);
        }
      );
    });
  });
}`,
    testHelperCode: `async function myAllSettled_test(scenario) {
  const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
  const fail = (ms, msg) => new Promise((_, rj) => setTimeout(() => rj(msg), ms));

  if (scenario === 'all-fulfilled') {
    return await myPromiseAllSettled([wait(50, 1), wait(30, 2), wait(10, 3)]);
  }
  if (scenario === 'all-rejected') {
    return await myPromiseAllSettled([fail(20, 'a'), fail(10, 'b')]);
  }
  if (scenario === 'mixed') {
    return await myPromiseAllSettled([wait(10, 1), fail(20, 'boom'), wait(30, 3)]);
  }
  if (scenario === 'empty') {
    return await myPromiseAllSettled([]);
  }
  if (scenario === 'non-promises') {
    return await myPromiseAllSettled([42, 'hi']);
  }
}`,
  },
  {
    id: "jsa-h4",
    topicId: "js-async",
    kind: "implement",
    title: "createAsyncQueue — последовательное выполнение задач",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте \`createAsyncQueue()\` — фабрику очередей, в которые можно добавлять асинхронные задачи. Очередь выполняет их **строго последовательно**: следующая задача стартует только после того, как предыдущая завершится (успехом или ошибкой).

API:
- \`q.add(taskFn)\` — taskFn это функция, возвращающая Promise. Метод возвращает Promise, который резолвится результатом задачи (или реджектится её ошибкой).
- \`q.size\` (геттер) — количество **ожидающих** + текущая выполняющаяся задач.

Поведение:
- Если задача упала, очередь **продолжает** выполнение следующих.
- Порядок результатов = порядок добавления.

Это частый вопрос на бэкенд-интервью (Node.js): построение последовательного процессора фоновых задач.`,
    functionName: 'queue_test',
    starterCode: `function createAsyncQueue() {
  // ваш код
}`,
    testCases: [
      { id: 'jsa-h4-t1', inputDisplay: "две задачи выполняются по очереди", inputArgs: ['sequential'], expected: { results: ['a', 'b'], maxConcurrent: 1 } },
      { id: 'jsa-h4-t2', inputDisplay: "пять задач сохраняют порядок", inputArgs: ['five-order'], expected: ['t1', 't2', 't3', 't4', 't5'] },
      { id: 'jsa-h4-t3', inputDisplay: "упавшая задача не ломает очередь", inputArgs: ['fail-then-ok'], expected: { caught: 'boom', after: 'ok' } },
      { id: 'jsa-h4-t4', inputDisplay: "size отражает оставшиеся задачи", inputArgs: ['size-shrinks'], expected: true },
    ],
    hints: [
      "Главная идея — поддерживать одну общую «цепочку», к которой подвешиваются новые задачи. Тогда любая следующая задача стартует, только когда предыдущая в цепочке завершилась. Какое состояние и какие методы Promise тут пригодятся?",
      "Заведите `let chain = Promise.resolve()`. В `add(taskFn)` подвесьте задачу через **оба** обработчика: `chain.then(taskFn, taskFn)` — так упавшая задача не сломает следующую. Возвращайте именно этот промис задачи, а в новую `chain` запишите обёртку, которая ловит и успех, и ошибку (иначе на цепочке появится «грязный» reject).",
      `Самый тонкий момент — **разделение двух промисов**: того, что отдаётся вызывающему коду, и того, что становится новой «головой» цепочки. Если возвращать ту же цепочку, что и сохраняется в \`chain\`, то ошибка задачи моментально превратит всю очередь в реджектнутый промис, и следующие задачи в неё уже не подвесятся корректно. Решение — подвешивать \`taskFn\` через \`.then(taskFn, taskFn)\` (оба обработчика), чтобы предыдущая ошибка не блокировала запуск следующей. А во внутренней \`chain\` обязательно «съесть» возможный reject, иначе появятся unhandled rejection и цепочка отравится.

С чего начать:
\`\`\`js
function createAsyncQueue() {
  let chain = Promise.resolve();
  return {
    add(taskFn) {
      // ...
    },
  };
}
\`\`\``,
    ],
    solutionCode: `function createAsyncQueue() {
  let chain = Promise.resolve();
  let pending = 0;

  return {
    add(taskFn) {
      pending++;
      const runPromise = chain.then(
        () => taskFn(),
        () => taskFn() // ошибка предыдущей задачи не отменяет следующую
      );
      // chain должна "дождаться" завершения этой задачи (успех или ошибка)
      chain = runPromise.then(
        () => { pending--; },
        () => { pending--; }
      );
      return runPromise;
    },
    get size() {
      return pending;
    },
  };
}`,
    testHelperCode: `async function queue_test(scenario) {
  if (scenario === 'sequential') {
    let active = 0;
    let maxConcurrent = 0;
    const make = (label, ms) => async () => {
      active++;
      if (active > maxConcurrent) maxConcurrent = active;
      await new Promise((r) => setTimeout(r, ms));
      active--;
      return label;
    };
    const q = createAsyncQueue();
    const r1 = q.add(make('a', 50));
    const r2 = q.add(make('b', 30));
    const results = await Promise.all([r1, r2]);
    return { results, maxConcurrent };
  }
  if (scenario === 'five-order') {
    const order = [];
    const q = createAsyncQueue();
    const ps = [];
    for (let i = 1; i <= 5; i++) {
      ps.push(q.add(async () => {
        await new Promise((r) => setTimeout(r, 5));
        order.push('t' + i);
        return 't' + i;
      }));
    }
    await Promise.all(ps);
    return order;
  }
  if (scenario === 'fail-then-ok') {
    const q = createAsyncQueue();
    let caught;
    const p1 = q.add(async () => { throw new Error('boom'); }).catch((e) => { caught = e.message; });
    const p2 = q.add(async () => 'ok');
    await p1;
    const after = await p2;
    return { caught, after };
  }
  if (scenario === 'size-shrinks') {
    const q = createAsyncQueue();
    const p1 = q.add(async () => { await new Promise((r) => setTimeout(r, 30)); });
    const p2 = q.add(async () => { await new Promise((r) => setTimeout(r, 30)); });
    const afterAdd = q.size; // 2
    await Promise.all([p1, p2]);
    const afterDone = q.size; // 0
    return afterAdd === 2 && afterDone === 0;
  }
}`,
  },
  {
    id: "jsa-m2",
    topicId: "js-async",
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
        id: "jsa-m2-t1",
        inputDisplay: 'fn падает 2 раза, 3-я успешна → "success"',
        inputArgs: ["fail-2-then-ok"],
        expected: "success",
      },
      {
        id: "jsa-m2-t2",
        inputDisplay: "fn всегда успешна → 1 попытка",
        inputArgs: ["always-ok"],
        expected: 42,
      },
      {
        id: "jsa-m2-t3",
        inputDisplay: "fn всегда падает → throws после retries попыток",
        inputArgs: ["always-fail"],
        expected: "Error: always-fail",
      },
      {
        id: "jsa-m2-t4",
        inputDisplay: "retries=1: одна попытка, при ошибке бросает",
        inputArgs: ["retries-1"],
        expected: "Error",
      },
      {
        id: "jsa-m2-t5",
        inputDisplay: "количество попыток ≤ retries",
        inputArgs: ["attempt-count"],
        expected: true,
      },
    ],
    hints: [
      "Логика типа «попробовал, не вышло — подождал, попробовал ещё раз, и так до тех пор, пока попытки не кончатся». Какие конструкции потребуются: чтобы ловить ошибку, чтобы повторять и чтобы делать паузу?",
      "Цикл `for` от 0 до `retries`. Внутри — `try { return await fn(); } catch (err) { lastError = err; ... }`. На последней итерации не спите — просто выпадите из цикла и бросьте `lastError`. Между попытками — `await new Promise(r => setTimeout(r, ms))`.",
      `Главный нюанс — не спать **после** последней попытки. Если поставить \`await sleep(ms)\` безусловно, после исчерпания попыток функция бессмысленно повисит на \`ms\` миллисекунд перед тем, как бросить ошибку. Проверка \`if (i < retries - 1)\` решает это. Ещё один частый промах — путаница «попыток» и «повторов»: при \`retries = 3\` функция делает **три** попытки всего, а не одну плюс три повтора. Документируйте семантику, чтобы вызывающий код не ошибся.

С чего начать:
\`\`\`js
async function retryWithDelay(fn, retries, ms) {
  let lastError;
  for (let i = 0; i < retries; i++) {
    // ...
  }
  throw lastError;
}
\`\`\``,
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
    id: "jsa-m3",
    topicId: "js-async",
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
      { id: "jsa-m3-t1", inputDisplay: "fn успешна с первого раза → 1 вызов", inputArgs: ['success-first'], expected: { result: 'ok', calls: 1 } },
      { id: "jsa-m3-t2", inputDisplay: "fn успешна со 2-й попытки → 2 вызова", inputArgs: ['success-second'], expected: { result: 'ok', calls: 2 } },
      { id: "jsa-m3-t3", inputDisplay: "fn падает все retries+1 раз → последняя ошибка", inputArgs: ['always-fail'], expected: 'Error: fail-3' },
      { id: "jsa-m3-t4", inputDisplay: "retries=0 → ровно 1 попытка", inputArgs: ['no-retries'], expected: 'Error: only-once' },
      { id: "jsa-m3-t5", inputDisplay: "задержки следуют delay * factor^i", inputArgs: ['exp-delay'], expected: true },
    ],
    hints: [
      "Главное здесь — растущая пауза. Между попытками держите текущую задержку и после каждого провала умножайте её на `factor`. Сколько всего может быть попыток?",
      "Цикл `for (attempt = 0; attempt <= retries; attempt++)` — итого `retries + 1` попыток. Внутри: `try { return await fn(); } catch (e) { lastErr = e; if (attempt === retries) break; await sleep(current); current *= factor; }`. После цикла — `throw lastErr`.",
      `Главный смысл экспоненциальной задержки — **не положить сервер**: при массовом сбое тысячи клиентов, которые ретраятся через одинаковую паузу, бьют по сервису синхронно и не дают ему восстановиться. Растущие интервалы дают сервису пространство для дыхания. На практике к формуле часто добавляют **jitter** — случайный сдвиг в пределах интервала, чтобы клиенты не синхронизировались по фазе. В этой задаче jitter не требуется, но в продакшен-коде он почти всегда нужен.

С чего начать:
\`\`\`js
async function asyncRetry(fn, { retries, delay, factor }) {
  let current = delay;
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    // ...
  }
  throw lastErr;
}
\`\`\``,
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
  {
    id: "jsa-m4",
    topicId: "js-async",
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
        id: "jsa-m4-t1",
        inputDisplay: "[() => 1, () => 2, () => 3] → [1, 2, 3]",
        inputArgs: ["simple-3"],
        expected: [1, 2, 3],
      },
      {
        id: "jsa-m4-t2",
        inputDisplay: "пустой массив → []",
        inputArgs: ["empty"],
        expected: [],
      },
      {
        id: "jsa-m4-t3",
        inputDisplay: "выполняются строго последовательно (порядок сохранён)",
        inputArgs: ["order"],
        expected: ["a", "b", "c"],
      },
      {
        id: "jsa-m4-t4",
        inputDisplay: "[() => 42] → [42]",
        inputArgs: ["single"],
        expected: [42],
      },
      {
        id: "jsa-m4-t5",
        inputDisplay: "промисы с разными задержками — порядок не нарушается",
        inputArgs: ["async-order"],
        expected: [1, 2, 3],
      },
    ],
    hints: [
      "Главное отличие от `Promise.all` — следующая задача не должна стартовать, пока не закончилась предыдущая. Какая конструкция в async-функции обеспечивает такой шаг-за-шагом обход?",
      "Объявите функцию `async`, идите по массиву обычным `for...of` и на каждой итерации делайте `await fn()`, кладя результат в массив. `for...of` сохраняет порядок, а `await` тормозит цикл.",
      `Главная ловушка — случайно превратить последовательный обход в параллельный. Если использовать \`asyncFns.map(fn => fn())\` или \`forEach\` с \`async\`-колбэком, все промисы стартуют **одновременно**, и весь смысл «по очереди» теряется. \`for...of\` с \`await\` единственный из встроенных циклов, который реально приостанавливает обход на каждой итерации. Также важно: следующая \`fn\` вообще не запустится, если предыдущая зареджектится — это часто желаемое поведение, но если нужно «продолжать после ошибок», его придётся реализовать через \`try/catch\` внутри цикла.

С чего начать:
\`\`\`js
async function runSequentially(asyncFns) {
  const results = [];
  for (const fn of asyncFns) {
    // ...
  }
  return results;
}
\`\`\``,
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
];
