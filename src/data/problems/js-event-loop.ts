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
      "Нужно вернуть объект, на который можно поставить `then`, и который «созреет» через `ms` миллисекунд. Какие два API соединить, чтобы это получилось?",
      "Создайте новый `Promise` и в его исполнителе запустите `setTimeout`, который через `ms` мс вызовет `resolve` без аргумента.",
      `Ключевой момент — \`setTimeout\` сам по себе не возвращает промис. Чтобы получить «ожидаемую паузу», его нужно **обернуть** в \`new Promise\`: исполнитель синхронно ставит таймер, а сам резолвится только когда таймер сработает. Тонкий нюанс: \`setTimeout\` обращается с \`resolve\` как с обычной функцией — \`resolve\` сам поглощает «лишние» аргументы вроде \`0\`, которые в браузере не передаются, но в Node могут быть. Поэтому промис разрешается с \`undefined\`, и \`await delay(ms)\` отдаёт именно \`undefined\`.

С чего начать:
\`\`\`js
function delay(ms) {
  return new Promise((resolve) => {
    // ...
  });
}
\`\`\``,
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
      "По смыслу — это «гонка» между исходным промисом и таймером: кто завершится первым, тот и определит результат. Какой инструмент Promise реализует именно такую гонку?",
      "Создайте «таймаут-промис» через `new Promise`, который через `ms` вызывает `reject(new Error('timeout'))`. Затем верните `Promise.race([promise, timeout])` — исходный реджект исходным промисом тоже пробросится.",
      `Идея — запустить два промиса в гонку: исходный и таймер. Тот, что разрешится первым, определит судьбу обёртки. Таймер должен **режектить** с ошибкой, а не просто резолвить — иначе семантика «таймаута» теряется и вызывающий код примет «истёкшее время» за нормальный ответ. Важный нюанс: исходный промис продолжает выполняться даже после того, как «выиграл» таймер — \`Promise.race\` не отменяет проигравших, он лишь игнорирует их дальнейшую судьбу.

С чего начать:
\`\`\`js
function promiseTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => {
    // ...
  });
  return Promise.race([promise, timeout]);
}
\`\`\``,
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
    kind: "predict-output",
    id: "jsel-p6",
    topicId: "js-event-loop",
    title: "Определи вывод: async/await и Promise.then вместе",
    difficulty: "medium",
    isContextual: false,
    description: `Перед вами async-функция рядом с обычным \`Promise.then\`. Введите каждую напечатанную строку на отдельной строке поля ответа.`,
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
      "Шаг 1: выпишите, что печатается синхронно — до того, как движок начнёт разбирать очередь микрозадач. Это `console.log('1')`, тело `run()` до первого `await` (выведет `A`) и `console.log('3')`.",
      "Шаг 2: каждый `await null` ставит «продолжение» функции в конец очереди микрозадач. После синхронной части в очереди уже лежит продолжение `run` (печать `B`), потом подписка `Promise.resolve().then` (печать `2`). Движок их выполнит по очереди.",
      "Шаг 3: продолжение `run` после `B` встречает второй `await`, поэтому печать `C` уходит в конец очереди — после `2`. Итого: `1`, `A`, `3`, `B`, `2`, `C`.",
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
      "Тест требует, чтобы оба элемента были строками — а возвращается что-то другое. Что попадает в переменную, если в выражении нет `await`?",
      "Без `await` `fetchValue('b')` возвращает **сам промис**, и в массиве оказывается `Promise<string>`, а не строка. Добавьте `await` перед вторым вызовом — как уже сделано перед первым.",
      "Главный урок: `async`-функция автоматически оборачивает результат в промис, но **не** автоматически разворачивает промисы внутри. Если переменной присвоить промис без `await`, она и будет хранить промис, а не значение. Это тихий баг — тесты типа «длина массива = 2» проходят, а вот «оба элемента строки» — нет. Хорошая привычка — давать промис-переменным суффикс `Promise` (`const bPromise = ...`), чтобы потеря `await` бросалась в глаза при ревью.",
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
      "Чтобы браузер успевал рисовать кадры и обрабатывать ввод, после порции элементов нужно вернуть управление event loop — а потом продолжить с того места, на котором остановились.",
      "Заверните всё в `new Promise((resolve) => ...)`. Заведите функцию `step()`, которая обрабатывает не больше `chunkSize` элементов и затем либо планирует следующий шаг через `setTimeout(step, 0)` (что даёт возможность рендеру случиться), либо резолвит итоговый массив. `queueMicrotask` тут не подойдёт — микрозадачи опустошаются до рендера, и страница всё равно будет висеть.",
      `Главный нюанс — **выбор очереди**. \`queueMicrotask\` или \`Promise.resolve().then\` тут не помогут: микрозадачи опустошаются **до** рендера и до пользовательского ввода, поэтому страница всё равно будет висеть, пока массив не закончится. Нужна именно **макрозадача** — \`setTimeout(fn, 0)\`. Между двумя макрозадачами браузер успевает обработать пользовательский ввод, отрисовать кадр и затем вернуться к нашему \`step\`. Размер чанка — компромисс: чем меньше, тем плавнее UI, но тем больше накладных расходов на переключение.

С чего начать:
\`\`\`js
function processAllChunked(items, transform, chunkSize) {
  return new Promise((resolve) => {
    const result = [];
    let i = 0;
    function step() {
      // ...
    }
    step();
  });
}
\`\`\``,
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
      "Шаг 1: выпишите синхронную часть. Это `start`, тело `first()` до первого `await` (печать `f1`), тело `second()` до первого `await` (печать `s1`), и `end`. До разбора очередей будет напечатано: `start`, `f1`, `s1`, `end`.",
      "Шаг 2: продолжения двух async-функций попадают в очередь микрозадач в порядке `await` — сначала продолжение `first` (печать `f2`), потом продолжение `second` (печать `s2`). `queueMicrotask(...)` добавлен ПОСЛЕ обоих `await`, поэтому печать `micro` стоит в очереди после них.",
      "Шаг 3: `setTimeout` — это макрозадача и выполнится в следующей итерации event loop, после полного опустошения микроочереди. Итог: `start`, `f1`, `s1`, `end`, `f2`, `s2`, `micro`, `timeout`.",
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
    id: "jsel-e2",
    topicId: "js-event-loop",
    kind: "predict-output",
    title: "Что выведет код: setTimeout 0 vs Promise vs sync",
    difficulty: "easy",
    isContextual: false,
    description: `Перед вами короткий фрагмент с тремя источниками логов: \`setTimeout(..., 0)\`, синхронный \`console.log\` и \`Promise.resolve().then(...)\`.

В каком порядке строки появятся в выводе?`,
    code: `console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve().then(() => console.log('C'));

console.log('D');`,
    expected: 'A\nD\nC\nB',
    hints: [
      "Шаг 1: пройдитесь по коду сверху вниз и отделите чисто синхронные строки от тех, что только «планируют» что-то. Синхронно печатается `A`, потом `D`.",
      "Шаг 2: `Promise.resolve().then(...)` ставит задачу в очередь **микрозадач**, а `setTimeout(..., 0)` — в очередь **макрозадач**. Микроочередь полностью опустошается перед следующей макрозадачей.",
      "Шаг 3: после синхронной части движок выполняет микрозадачу — печать `C`. Затем берёт следующую макрозадачу — печать `B`. Итог: `A`, `D`, `C`, `B`.",
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
      "Нужно отложить вызов так, чтобы он сработал **после** текущего синхронного кода, но **раньше** любого `setTimeout(..., 0)`. В какую из очередей event loop это попадает?",
      "Это очередь микрозадач. Самые прямые способы туда что-то положить — `queueMicrotask(fn)` или `Promise.resolve().then(fn)`. Любой из вариантов даёт нужное поведение.",
      `Ключевая разница — между **микрозадачами** и **макрозадачами**. Микроочередь полностью опустошается перед каждой следующей макрозадачей и перед рендером, поэтому \`nextTick\` через \`queueMicrotask\` гарантированно выполнится раньше любого \`setTimeout(..., 0)\`. Обратная сторона медали: если в микрозадаче бесконечно ставить новую микрозадачу, очередь никогда не опустеет — браузер не нарисует кадр и не обработает ввод. \`setTimeout\` в этом смысле «вежливее» к UI.

С чего начать:
\`\`\`js
function nextTick(fn) {
  // ...
}
\`\`\``,
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
];
