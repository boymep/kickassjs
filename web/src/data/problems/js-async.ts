import type { Problem } from '../../types/problem';

export const jsAsyncProblems: Problem[] = [
  {
    id: 'jsa-p1',
    topicId: 'js-async',
    title: 'myPromiseAll — реализовать Promise.all',
    difficulty: 'medium',
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
    functionName: 'myPromiseAll_test',
    starterCode: `function myPromiseAll(promises) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsa-p1-t1',
        inputDisplay: '[resolve(1), resolve(2), resolve(3)] → [1,2,3]',
        inputArgs: ['all-resolve'],
        expected: [1, 2, 3],
      },
      {
        id: 'jsa-p1-t2',
        inputDisplay: 'пустой массив → []',
        inputArgs: ['empty'],
        expected: [],
      },
      {
        id: 'jsa-p1-t3',
        inputDisplay: 'один reject → reject',
        inputArgs: ['one-reject'],
        expected: 'Error: oops',
      },
      {
        id: 'jsa-p1-t4',
        inputDisplay: 'порядок результатов совпадает с порядком ввода',
        inputArgs: ['order'],
        expected: [1, 2, 3],
      },
      {
        id: 'jsa-p1-t5',
        inputDisplay: 'не-промисные значения обрабатываются',
        inputArgs: ['non-promise'],
        expected: [1, 'hello', true],
      },
    ],
    hints: [
      'Создайте `new Promise((resolve, reject) => {...})`. Внутри: массив `results`, счётчик `completed`.',
      'Для каждого промиса: `Promise.resolve(promises[i]).then(val => { results[i] = val; if (++completed === promises.length) resolve(results); }).catch(reject)`.',
      'Сохраняйте результат по **индексу** (не push) — иначе порядок будет нарушен при разных скоростях выполнения.',
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
    id: 'jsa-p2',
    topicId: 'js-async',
    title: 'myPromiseRace — реализовать Promise.race',
    difficulty: 'easy',
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
    functionName: 'myPromiseRace_test',
    starterCode: `function myPromiseRace(promises) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsa-p2-t1',
        inputDisplay: 'быстрый resolve побеждает',
        inputArgs: ['fast-resolve'],
        expected: 'fast',
      },
      {
        id: 'jsa-p2-t2',
        inputDisplay: 'быстрый reject побеждает',
        inputArgs: ['fast-reject'],
        expected: 'Error: fast-error',
      },
      {
        id: 'jsa-p2-t3',
        inputDisplay: 'resolve(1) vs reject — кто быстрее',
        inputArgs: ['mixed'],
        expected: 1,
      },
      {
        id: 'jsa-p2-t4',
        inputDisplay: 'один промис в массиве',
        inputArgs: ['single'],
        expected: 42,
      },
      {
        id: 'jsa-p2-t5',
        inputDisplay: 'возвращает Promise',
        inputArgs: ['is-promise'],
        expected: true,
      },
    ],
    hints: [
      'Реализация простая: `return new Promise((resolve, reject) => { promises.forEach(p => Promise.resolve(p).then(resolve).catch(reject)); })`.',
      'Первый вызов `resolve` или `reject` определяет результат. Последующие вызовы `resolve`/`reject` на уже осевшем промисе — игнорируются автоматически.',
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
    id: 'jsa-p3',
    topicId: 'js-async',
    title: 'fetchWithTimeout — промис с таймаутом',
    difficulty: 'easy',
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
    functionName: 'fetchWithTimeout_test',
    starterCode: `function fetchWithTimeout(promise, ms) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsa-p3-t1',
        inputDisplay: 'промис завершается вовремя → его значение',
        inputArgs: ['in-time'],
        expected: 'result',
      },
      {
        id: 'jsa-p3-t2',
        inputDisplay: 'промис слишком медленный → Error: Timeout',
        inputArgs: ['timeout'],
        expected: 'Error: Timeout',
      },
      {
        id: 'jsa-p3-t3',
        inputDisplay: 'reject быстрее таймаута → оригинальный reject',
        inputArgs: ['reject-first'],
        expected: 'Error: original',
      },
      {
        id: 'jsa-p3-t4',
        inputDisplay: 'ms = 0 — немедленный таймаут',
        inputArgs: ['zero-timeout'],
        expected: 'Error: Timeout',
      },
      {
        id: 'jsa-p3-t5',
        inputDisplay: 'возвращает Promise',
        inputArgs: ['is-promise'],
        expected: true,
      },
    ],
    hints: [
      'Используйте `Promise.race` с двумя промисами: оригинальным и таймером.',
      'Таймер: `new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))`.',
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
    id: 'jsa-p4',
    topicId: 'js-async',
    title: 'promisify — конвертация callback в Promise',
    difficulty: 'easy',
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
    functionName: 'promisify_test',
    starterCode: `function promisify(fn) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsa-p4-t1',
        inputDisplay: 'успешный callback → resolve с результатом',
        inputArgs: ['success'],
        expected: 'file content',
      },
      {
        id: 'jsa-p4-t2',
        inputDisplay: 'callback с ошибкой → reject',
        inputArgs: ['error'],
        expected: 'Error: not found',
      },
      {
        id: 'jsa-p4-t3',
        inputDisplay: 'возвращает функцию',
        inputArgs: ['returns-function'],
        expected: true,
      },
      {
        id: 'jsa-p4-t4',
        inputDisplay: 'результирующая функция возвращает Promise',
        inputArgs: ['returns-promise'],
        expected: true,
      },
      {
        id: 'jsa-p4-t5',
        inputDisplay: 'аргументы передаются в оригинальную функцию',
        inputArgs: ['passes-args'],
        expected: 'content-42',
      },
    ],
    hints: [
      'Возвращаемая функция принимает аргументы и возвращает `new Promise`.',
      'Внутри Promise вызовите `fn(...args, (err, result) => { if (err) reject(err); else resolve(result); })`.',
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
    id: 'jsa-p5',
    topicId: 'js-async',
    title: 'limitConcurrency — ограниченный параллелизм',
    difficulty: 'medium',
    isContextual: true,
    description: `Реализуйте функцию \`limitConcurrency(fns, limit)\`:
- \`fns\` — массив функций, каждая возвращает Promise
- \`limit\` — максимальное количество одновременно выполняющихся промисов
- Возвращает Promise с массивом всех результатов в исходном порядке

Это критично для API, у которых есть rate-limit (не более N запросов одновременно).

Примеры:
\`\`\`
// Выполнить 10 задач, не более 3 одновременно:
await limitConcurrency(tasks, 3);
\`\`\``,
    functionName: 'limitConcurrency_test',
    starterCode: `async function limitConcurrency(fns, limit) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsa-p5-t1',
        inputDisplay: '[fn1, fn2, fn3], limit=10 → все выполняются',
        inputArgs: ['all-complete'],
        expected: [1, 2, 3],
      },
      {
        id: 'jsa-p5-t2',
        inputDisplay: 'пустой массив → []',
        inputArgs: ['empty'],
        expected: [],
      },
      {
        id: 'jsa-p5-t3',
        inputDisplay: 'порядок результатов совпадает с порядком задач',
        inputArgs: ['order'],
        expected: [1, 2, 3, 4, 5],
      },
      {
        id: 'jsa-p5-t4',
        inputDisplay: 'limit=1 → последовательное выполнение',
        inputArgs: ['sequential'],
        expected: [1, 2, 3],
      },
      {
        id: 'jsa-p5-t5',
        inputDisplay: 'одновременно не более limit задач',
        inputArgs: ['concurrency-check'],
        expected: true,
      },
    ],
    hints: [
      'Используйте очередь: запускайте limit задач одновременно. Когда одна завершается — запускайте следующую из очереди.',
      'Паттерн с `executing` Set: `const executing = new Set(); for (const fn of fns) { const p = fn().then(result => { executing.delete(p); ... }); executing.add(p); if (executing.size >= limit) await Promise.race(executing); }`',
      'Результаты сохраняйте по индексу через `results[i] = result`.',
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
    kind: 'predict-output',
    id: 'jsa-p6',
    topicId: 'js-async',
    title: 'Угадай вывод: await, Promise.then и queueMicrotask',
    difficulty: 'medium',
    isContextual: false,
    description: `Перед вами микс синхронного кода, async/await, Promise.then и queueMicrotask. Введи каждую напечатанную строку в отдельной строчке поля ответа.

Подсказка: \`await\` — синтаксический сахар над \`Promise.then\`. Каждый \`await\` ставит продолжение в очередь микрозадач. \`queueMicrotask\` и \`Promise.resolve().then\` идут в **одну и ту же** очередь и выполняются в порядке постановки.`,
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
    expected: '1\nA\n2\nB\nQ\nT\nC',
    hints: [
      'Синхронный код в порядке появления: 1, затем A (до первого await в run), затем 2.',
      'После синхронного кода microtask checkpoint опустошает очередь в порядке постановки.',
      'Первая микрозадача в очереди — продолжение run после первого await: печатает B и регистрирует следующее продолжение для C.',
      'Затем выполняются queueMicrotask (Q) и Promise.then (T), которые были поставлены в очередь раньше, чем continuation-C.',
      'Последним выполняется continuation-C, поставленный после Q и T. Итог: 1, A, 2, B, Q, T, C.',
    ],
    solutionCode: `// 1 — sync
// run() начинает выполняться: A — sync (до первого await)
// первый await ставит continuation-1 (печать B) в microtask queue
// queueMicrotask(Q) — добавлена в microtask queue ПОСЛЕ continuation-1
// Promise.resolve().then(T) — добавлена в microtask queue после Q
// 2 — sync
// microtask checkpoint (FIFO):
//   continuation-1: печатает B, ставит continuation-2 (печать C) в очередь
//   Q
//   T
//   continuation-2: печатает C
// Итог: 1, A, 2, B, Q, T, C`,
  },
  {
    kind: 'find-bug',
    id: 'jsa-p7',
    topicId: 'js-async',
    title: 'Найди баг: Promise.all передан массив функций',
    difficulty: 'easy',
    isContextual: false,
    description: `Функция \`runAll(fns)\` должна параллельно вызвать каждую функцию из массива и вернуть массив результатов в исходном порядке. Тесты проверяют, что результат — реальные значения, а не функции или сами Promise.

В коде есть распространённая ошибка: в \`Promise.all\` передан массив **функций**, а не массив промисов — функции не были вызваны. Найди баг и почини.`,
    buggyCode: `async function runAll(fns) {
  // Передаём массив функций вместо вызовов.
  // Promise.all не «знает» про функции — он ждёт промисы.
  return await Promise.all(fns);
}`,
    functionName: 'jsa_p7_test',
    bugSummary:
      'Promise.all принимает итерируемое промисов (или значений), а не функций. Чтобы запустить функции, их нужно вызвать: `Promise.all(fns.map((fn) => fn()))`. Без этого Promise.all резолвится массивом самих функций как обычных значений.',
    testCases: [
      {
        id: 'jsa-p7-t1',
        inputDisplay: 'все async-функции выполнены → массив значений',
        inputArgs: ['basic'],
        expected: [1, 2, 3],
      },
      {
        id: 'jsa-p7-t2',
        inputDisplay: 'элементы — числа, не функции',
        inputArgs: ['types'],
        expected: 'number,number,number',
      },
      {
        id: 'jsa-p7-t3',
        inputDisplay: 'порядок результатов соответствует порядку входа',
        inputArgs: ['order'],
        expected: [10, 20, 30],
      },
      {
        id: 'jsa-p7-t4',
        inputDisplay: 'пустой массив → []',
        inputArgs: ['empty'],
        expected: [],
      },
    ],
    hints: [
      'Что находится в массиве `fns`? Это функции, возвращающие Promise, — а не сами Promise.',
      'Promise.all ждёт promise-like значения. Нужно сначала вызвать каждую функцию, чтобы получить промис.',
      'Достаточно одной строки: `fns.map((fn) => fn())` перед передачей в Promise.all.',
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
    kind: 'refactor',
    id: 'jsa-p8',
    topicId: 'js-async',
    title: 'Оптимизируй: sequential await → parallel Promise.all',
    difficulty: 'easy',
    isContextual: false,
    description: `Функция \`fetchAllParallel(urls, fetcher)\` загружает данные по списку URL и возвращает массив результатов в исходном порядке. Текущая реализация выполняет загрузку **последовательно** через \`for...of\` + \`await\` — это медленно, так как сумма всех задержек складывается.

Перепиши функцию так, чтобы она запускала все загрузки **параллельно** через \`Promise.all\`, сохраняя порядок результатов. Корректность: результат должен совпадать с прежним элемент-в-элемент.

Сигнатура остаётся: \`fetchAllParallel(urls, fetcher)\` принимает массив строк и async-функцию \`fetcher(url)\`, возвращает Promise с массивом результатов.`,
    functionName: 'fetchAllParallel_test',
    starterCode: `async function fetchAllParallel(urls, fetcher) {
  // Текущая реализация — последовательная.
  // Перепиши через Promise.all + map, чтобы запросы шли параллельно.
  const results = [];
  for (const url of urls) {
    results.push(await fetcher(url));
  }
  return results;
}`,
    testCases: [
      {
        id: 'jsa-p8-t1',
        inputDisplay: '3 URL → массив результатов в исходном порядке',
        inputArgs: ['order'],
        expected: ['data:a', 'data:b', 'data:c'],
      },
      {
        id: 'jsa-p8-t2',
        inputDisplay: 'пустой массив → []',
        inputArgs: ['empty'],
        expected: [],
      },
      {
        id: 'jsa-p8-t3',
        inputDisplay: 'результат — массив значений (не промисов)',
        inputArgs: ['types'],
        expected: 'string,string,string',
      },
      {
        id: 'jsa-p8-t4',
        inputDisplay: 'порядок сохраняется при разных задержках',
        inputArgs: ['varied-delays'],
        expected: [1, 2, 3],
      },
      {
        id: 'jsa-p8-t5',
        inputDisplay: 'параллельность: все запросы стартуют одновременно',
        inputArgs: ['parallel-check'],
        expected: true,
      },
    ],
    hints: [
      'Используй `urls.map((url) => fetcher(url))` — это создаст массив промисов, запущенных одновременно.',
      'Затем оберни в `await Promise.all(...)`, чтобы дождаться всех и получить массив значений.',
      'Promise.all сохраняет порядок результатов независимо от того, какой промис завершился раньше — индексация по входу.',
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
    id: 'jsa-h1',
    topicId: 'js-async',
    kind: 'implement',
    title: 'myPromiseAny — реализовать Promise.any',
    difficulty: 'hard',
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
    functionName: 'myPromiseAny_test',
    starterCode: `function myPromiseAny(promises) {
  // ваш код
}`,
    testCases: [
      { id: 'jsa-h1-t1', inputDisplay: 'первый успешный resolve', inputArgs: ['first-resolve'], expected: 'b' },
      { id: 'jsa-h1-t2', inputDisplay: 'все reject → AggregateError', inputArgs: ['all-reject'], expected: 'AggregateError' },
      { id: 'jsa-h1-t3', inputDisplay: 'пустой массив → AggregateError', inputArgs: ['empty'], expected: 'AggregateError' },
      { id: 'jsa-h1-t4', inputDisplay: 'победитель — быстрейший resolve', inputArgs: ['fastest'], expected: 'fast' },
      { id: 'jsa-h1-t5', inputDisplay: 'все resolve → берётся первый', inputArgs: ['all-resolve'], expected: 1 },
    ],
    hints: [
      'Создайте `new Promise`. Внутри: массив errors, счётчик rejections.',
      'Для каждого промиса: при resolve — сразу resolve всего (первый выигрывает). При reject — сохраните ошибку по индексу.',
      'Когда rejections === promises.length — reject с new AggregateError(errors).',
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
    id: 'jsa-h2',
    topicId: 'js-async',
    kind: 'implement',
    title: 'Async pool — параллельный перебор с ограничением',
    difficulty: 'hard',
    isContextual: false,
    description: `Реализуйте функцию \`asyncPool(concurrency, items, fn)\`:
- Применяет асинхронную функцию \`fn\` ко всем элементам \`items\`
- Одновременно выполняется не более \`concurrency\` задач
- Возвращает промис массива результатов **в том же порядке**, что и items

Это мощнее, чем простой \`Promise.all\` — он ограничивает параллелизм.

Примеры:
\`\`\`
const delay = (ms) => new Promise(res => setTimeout(res, ms));

const results = await asyncPool(2, [1, 2, 3, 4, 5],
  async (n) => { await delay(n * 10); return n * 2; }
);
// → [2, 4, 6, 8, 10]  (порядок сохранён)
\`\`\``,
    functionName: 'asyncPool_test',
    starterCode: `async function asyncPool(concurrency, items, fn) {
  // ваш код
}`,
    testCases: [
      { id: 'jsa-h2-t1', inputDisplay: 'результаты в исходном порядке', inputArgs: ['order'], expected: [2,4,6,8,10] },
      { id: 'jsa-h2-t2', inputDisplay: 'не более concurrency параллельных задач', inputArgs: ['concurrency'], expected: true },
      { id: 'jsa-h2-t3', inputDisplay: 'пустой массив → []', inputArgs: ['empty'], expected: [] },
    ],
    hints: [
      'Начните первые `concurrency` задач. По мере завершения каждой — стартуйте следующую из очереди.',
      'Один из способов: используйте Set "running". При добавлении задачи добавьте в Set и при завершении — удалите. Если размер Set >= concurrency — await любой задачи из Set.',
      'Для сохранения порядка: заранее создайте массив results[items.length] и записывайте результат по индексу.',
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
];
