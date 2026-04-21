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
];
