import type { Lesson } from '../../types/lesson';
import type { Flashcard } from '../../types/flashcard';
import { jsAsyncQuiz } from '../quizzes/js-async';
import { jsAsyncFlashcards } from '../flashcards/js-async';

// Index existing quiz questions for reuse as checkpoints.
const Q = Object.fromEntries(jsAsyncQuiz.questions.map((q) => [q.id, q]));

// Questions used as in-chapter checkpoints (must NOT appear in finalQuiz).
const CHECKPOINT_IDS = new Set(['jsa-q3', 'jsa-q1', 'jsa-q12', 'jsa-q2', 'jsa-q9']);

// Дополнительные карточки специально для урока: четыре статических метода
// Promise (all/allSettled/race/any) на одной карточке-таблице, а также
// тонкости await и unhandled rejection.
const extraFlashcards: Flashcard[] = [
  {
    id: 'jsa-f7',
    question: 'Promise.all vs allSettled vs race vs any — сравните за 30 секунд.',
    answer:
      'Все четыре принимают итерируемое промисов и возвращают новый Promise. Различаются условием резолва и поведением при ошибках: all — нужен каждый успех, allSettled — нужны итоги всех (никогда не реджектится), race — первый завершившийся в любом исходе, any — первый успешный.',
    keyPoints: [
      'Promise.all: rejected при первом reject; результат — массив значений в порядке входа',
      'Promise.allSettled (ES2020): всегда fulfilled; массив { status, value | reason }',
      'Promise.race: завершается с первым исходом — успехом или ошибкой',
      'Promise.any (ES2021): первый fulfilled; AggregateError, если все rejected',
      'all/allSettled запускают промисы параллельно — функции должны быть уже вызваны',
    ],
    code: `// Шпаргалка
await Promise.all([p1, p2]);          // все или ошибка
await Promise.allSettled([p1, p2]);   // все исходы
await Promise.race([p1, timeout]);    // паттерн timeout
await Promise.any([cdn1, cdn2, cdn3]);// fallback CDN`,
  },
  {
    id: 'jsa-f8',
    question: 'Чем отличается `await fn()` от `fn().then(...)`?',
    answer:
      'Семантически оба ставят продолжение в очередь микрозадач. Разница в синтаксисе и в том, какой код считается «продолжением». await оставляет линейную форму try/catch и локальные переменные, then требует callback и возвращает новый Promise — удобно для трансформации значений.',
    keyPoints: [
      'await может быть только внутри async-функции (или в top-level модуле)',
      'try/catch вокруг await эквивалентен .catch() в цепочке',
      'await сохраняет переменные scope; .then создаёт новую функцию-callback',
      '.then удобно для composable-цепочек, await — для условной логики и циклов',
      'оба создают как минимум одну микрозадачу даже на уже разрешённом промисе',
    ],
  },
  {
    id: 'jsa-f9',
    question: 'Что произойдёт, если не обработать reject в Promise?',
    answer:
      'Промис останется в состоянии rejected, и движок зафиксирует unhandled rejection. В браузере срабатывает событие `unhandledrejection` на window; в Node.js 15+ процесс завершается с ненулевым кодом по умолчанию.',
    keyPoints: [
      'Браузер: window.addEventListener("unhandledrejection", handler)',
      'Node.js 15+: process exit; раньше — только warning',
      'Достаточно одного .catch в конце цепочки или try/catch вокруг await',
      'await без try/catch внутри async-функции делает её Promise отклонённым',
      'Promise.allSettled — способ гарантированно избежать unhandled rejection',
    ],
    code: `window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled:', e.reason);
  e.preventDefault(); // подавить дефолтный лог
});`,
  },
];

export const jsAsyncLesson: Lesson = {
  topicId: 'js-async',

  intro: {
    whyItMatters: `Асинхронность — фундамент любого веб-приложения. На ней построены сетевые запросы (\`fetch\`), работа с файловой системой (\`fs.promises\`), таймеры, операции с IndexedDB, чтение файлов через \`FileReader\` и десятки других API. Без понимания асинхронной модели невозможно ни оптимизировать загрузку страницы, ни корректно обработать ошибки сети, ни написать стабильный обработчик пользовательского ввода.

История API эволюционировала в три этапа. Сначала был **callback-стиль**: \`fs.readFile(path, (err, data) => {...})\`. Он прост, но плохо масштабируется — при последовательных операциях код превращается в «callback hell» с глубокой вложенностью и дублирующейся обработкой ошибок. В ES2015 пришли **Promise** — объект-обёртка над будущим результатом, поддерживающая цепочки и единый \`.catch\` на всю цепочку. В ES2017 появился **async/await** — синтаксический сахар над промисами, превращающий асинхронный код в плоский, похожий на синхронный. Под капотом \`await\` по-прежнему ставит продолжение в очередь микрозадач — это важно понимать (см. урок про event loop).

На собеседовании асинхронность проверяют через **последствия**: что выведет код с миксом \`await\` и \`Promise.then\`, чем отличаются четыре статических метода Promise, как сделать N параллельных запросов с лимитом, как реализовать timeout, что произойдёт с забытым \`await\` или необработанным \`reject\`. Сильный кандидат отличает последовательное выполнение от параллельного и замечает лишний \`await\` в цикле как явный признак проблемы.

В этом уроке вы научитесь читать асинхронный код одинаково уверенно в обоих стилях, выбирать между \`Promise.all\` и \`Promise.allSettled\`, писать timeout и retry, реализовывать ограниченный параллелизм и диагностировать классические баги — забытый \`await\`, race condition, проглоченный rejected.`,
    estimatedMinutes: 35,
    interviewAngle:
      'Интервьюер проверяет понимание трёх состояний Promise и однократности перехода между ними, разницу четырёх статических методов, поведение await как микрозадачи, умение отличать последовательное выполнение от параллельного, реализацию timeout/retry/ограниченного параллелизма и диагностику забытого await или необработанного reject.',
    prerequisites: [{ slug: 'js-event-loop', title: 'Event Loop' }],
  },

  resources: {
    videos: [
      {
        source: 'youtube',
        id: 'cCOL7MC4Pl0',
        title: 'In The Loop — Jake Archibald (JSConf.Asia)',
        channel: 'JSConf',
        language: 'en',
        durationSec: 35 * 60,
        description:
          'Лекция инженера Chrome — как промисы и микрозадачи встроены в event loop. Полезно перед изучением await под капотом.',
      },
      {
        source: 'youtube',
        id: 'PoRJizFvM7s',
        title: 'Promises, Async/Await — Namaste JavaScript Season 2',
        channel: 'Akshay Saini',
        language: 'en',
        durationSec: 58 * 60,
        description:
          'Подробный разбор Promise, цепочек и async/await с дебаггингом в DevTools. Хороший вход в тему на английском.',
      },
    ],
    links: [
      {
        url: 'https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise',
        title: 'Promise — MDN',
        source: 'mdn',
        language: 'ru',
        note: 'Каноническая справка: состояния, статические методы, прототипные методы, обработка ошибок.',
      },
      {
        url: 'https://learn.javascript.ru/promise-basics',
        title: 'Промисы, async/await — учебник learn.javascript.ru',
        source: 'learn-js',
        language: 'ru',
        note: 'Разделы Ильи Кантора с пошаговыми примерами от callback-ада до async/await и параллельных запросов.',
      },
      {
        url: 'https://2ality.com/2017/05/util-promisify.html',
        title: 'ES2017: util.promisify and async functions — 2ality',
        source: 'article',
        language: 'en',
        note: 'Аксель Раушмайер о семантике async/await и преобразовании callback-API в промисы.',
      },
      {
        url: 'https://web.dev/articles/promises',
        title: 'JavaScript Promises: an introduction — web.dev',
        source: 'web-dev',
        language: 'en',
        note: 'Классический материал Jake Archibald о промисах с практическими паттернами и подводными камнями.',
      },
      {
        url: 'https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/async_function',
        title: 'async function — MDN',
        source: 'mdn',
        language: 'ru',
        note: 'Точная семантика async-функций: возврат промиса, поведение при throw, взаимодействие с try/catch.',
      },
    ],
  },

  chapters: [
    {
      id: 'promise-basics',
      title: 'Promise: состояния, цепочки, обработка ошибок',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'Promise — это объект-обёртка над **будущим** результатом асинхронной операции. У него три состояния: **pending** (ожидание), **fulfilled** (успех со значением), **rejected** (ошибка с причиной). Переход из pending — однократный и необратимый: промис «оседает» (settles) ровно один раз.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Тело executor выполняется СИНХРОННО прямо при создании промиса.
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (Math.random() > 0.5) resolve('data');
    else reject(new Error('failed'));
  }, 100);
});

promise
  .then((data) => console.log('OK:', data))
  .catch((err) => console.log('Err:', err.message))
  .finally(() => console.log('Готово'));`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Каждый `.then()` возвращает **новый** промис. Если callback вернул значение — промис разрешается этим значением. Если вернул промис — следующий `.then` ждёт его. Если callback бросил исключение — промис в цепочке становится rejected.',
        },
        { type: 'heading', content: 'Цепочки и обработка ошибок' },
        {
          type: 'code',
          language: 'javascript',
          content: `fetch('/api/user')
  .then((res) => res.json())                  // 1. парсим JSON
  .then((user) => fetch(\`/api/posts/\${user.id}\`)) // 2. ждём вложенный промис
  .then((res) => res.json())                  // 3. парсим JSON постов
  .catch((err) => {
    // ловит ошибку из ЛЮБОГО предыдущего звена
    console.error(err);
    return [];                                // fallback продолжает цепочку
  })
  .finally(() => hideSpinner());              // выполнится в любом случае`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            '`finally` не получает значение и не меняет результат — возвращаемое из неё значение игнорируется. Используется для cleanup: скрыть спиннер, закрыть соединение, освободить ресурс.',
        },
        {
          type: 'list',
          content: `Три источника rejected-промиса:
- явный вызов \`reject(reason)\` в executor;
- \`throw\` внутри executor или внутри callback \`.then\`;
- возврат уже отклонённого промиса из callback.`,
        },
      ],
      flashcardIds: ['jsa-f1'],
      checkpoint: [Q['jsa-q3']!, Q['jsa-q1']!],
      docsLink: { url: 'https://learn.javascript.ru/promise-basics', title: 'Промисы — learn.javascript.ru' },
    },

    {
      id: 'async-await',
      title: 'async/await — синтаксический сахар над Promise',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            '`async/await` не добавляет новых возможностей — это синтаксический сахар над промисами. Любая `async` функция всегда возвращает Promise: значение через `return` оборачивается в `Promise.resolve`, исключение через `throw` — в `Promise.reject`. Выражение `await expr` приостанавливает функцию, ставит её продолжение в очередь микрозадач (см. урок js-event-loop) и возвращает разрешённое значение, когда промис оседает.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Promise-стиль:
function loadUser(id) {
  return fetch(\`/api/user/\${id}\`)
    .then((res) => res.json())
    .then((user) => fetch(\`/api/posts/\${user.id}\`))
    .then((res) => res.json());
}

// Эквивалент в async/await — плоский линейный код:
async function loadUser(id) {
  const userRes = await fetch(\`/api/user/\${id}\`);
  const user = await userRes.json();
  const postsRes = await fetch(\`/api/posts/\${user.id}\`);
  return postsRes.json();
}`,
        },
        { type: 'heading', content: 'try / catch для ошибок' },
        {
          type: 'code',
          language: 'javascript',
          content: `async function safeLoad() {
  try {
    const data = await riskyOperation();
    return data;
  } catch (err) {
    console.error('Ошибка:', err);
    return null;
  } finally {
    hideSpinner();
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '`try/catch` ловит ошибку только если `await` находится **внутри** блока try. Ошибка в обычном callback (например, в `setTimeout`) не будет поймана внешним try/catch — её нужно обернуть в Promise или обработать локально.',
        },
        { type: 'heading', content: 'Ловушка sequential vs parallel' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Последовательно — медленно (сумма всех задержек):
async function slow() {
  const a = await fetch('/a'); // 100 мс
  const b = await fetch('/b'); // ещё 100 мс
  return [a, b];               // итого ~200 мс
}

// Параллельно — быстро (max задержки):
async function fast() {
  const [a, b] = await Promise.all([
    fetch('/a'),
    fetch('/b'),
  ]);
  return [a, b];               // итого ~100 мс
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Правило: если результаты независимы — запускайте параллельно через `Promise.all`. Если результат запроса B зависит от ответа A — последовательность неизбежна. Лишний `await` внутри цикла, когда запросы можно было запустить одновременно, — самая частая причина медленных страниц.',
        },
      ],
      flashcardIds: ['jsa-f8'],
      docsLink: { url: 'https://learn.javascript.ru/async-await', title: 'async/await — learn.javascript.ru' },
      playground: {
        starterCode: `// В коде ниже два независимых запроса выполняются последовательно.
// Перепишите функцию так, чтобы они шли параллельно через Promise.all.
// Корректный вывод: "ab" (порядок входа сохраняется).

const a = () => new Promise((r) => setTimeout(() => r('a'), 30));
const b = () => new Promise((r) => setTimeout(() => r('b'), 30));

async function load() {
  const x = await a();
  const y = await b();
  return x + y;
}

load().then(console.log);`,
        expectedOutput: 'ab',
        description:
          'Замените два последовательных await на одно ожидание Promise.all([a(), b()]). Это базовый паттерн ускорения независимых запросов.',
      },
      checkpoint: [Q['jsa-q12']!],
    },

    {
      id: 'static-methods',
      title: 'Promise.all, allSettled, race, any',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'Четыре статических метода Promise помогают комбинировать несколько асинхронных операций. Все принимают итерируемое и возвращают новый Promise. Различаются условием резолва и поведением при ошибках.',
        },
        { type: 'heading', content: 'Promise.all — нужны все' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Резолвится массивом значений в порядке входа.
// Реджектится при первом rejection — остальные результаты теряются.
const [users, posts, tags] = await Promise.all([
  fetch('/users').then((r) => r.json()),
  fetch('/posts').then((r) => r.json()),
  fetch('/tags').then((r) => r.json()),
]);`,
        },
        { type: 'heading', content: 'Promise.allSettled — все исходы' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Никогда не реджектится. Возвращает массив объектов:
//   { status: 'fulfilled', value }  или  { status: 'rejected', reason }
const results = await Promise.allSettled(urls.map((u) => fetch(u)));

const ok = results
  .filter((r) => r.status === 'fulfilled')
  .map((r) => r.value);

const failed = results
  .filter((r) => r.status === 'rejected')
  .map((r) => r.reason);`,
        },
        { type: 'heading', content: 'Promise.race — кто быстрее' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Резолвится/реджектится первым завершившимся промисом — любым исходом.
// Классический способ реализации timeout:
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms),
  );
  return Promise.race([promise, timeout]);
}

await withTimeout(fetch('/slow'), 5000);`,
        },
        { type: 'heading', content: 'Promise.any — первый успех' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Резолвится при ПЕРВОМ fulfilled, игнорируя rejected.
// Если все упали — AggregateError со списком reasons.
try {
  const fastest = await Promise.any([
    fetch('https://cdn1.example.com/data'),
    fetch('https://cdn2.example.com/data'),
    fetch('https://cdn3.example.com/data'),
  ]);
} catch (err) {
  // err instanceof AggregateError
  console.log(err.errors); // массив reasons всех rejected
}`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Эвристика выбора: **all** — нужны все результаты, ошибка одного отменяет всё. **allSettled** — нужно увидеть итоги всех (batch-операции, отчёты). **race** — нужен первый ответ или timeout. **any** — fallback по нескольким источникам.',
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Все четыре метода **не запускают** промисы — они только наблюдают. Если передать массив функций, ничего не произойдёт: нужно вызвать каждую (`fns.map((fn) => fn())`).',
        },
      ],
      flashcardIds: ['jsa-f2', 'jsa-f7'],
      checkpoint: [Q['jsa-q2']!, Q['jsa-q9']!],
      docsLink: { url: 'https://learn.javascript.ru/promise-api', title: 'Promise API — learn.javascript.ru' },
    },

    {
      id: 'pitfalls',
      title: 'Типичные ошибки в асинхронном коде',
      estimatedMinutes: 7,
      blocks: [
        { type: 'heading', content: 'Забытый await в цикле' },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ Без await — функция возвращает Promise, но не ждёт его.
async function process(items) {
  for (const item of items) {
    handleAsync(item); // Promise создан, но не ожидается
  }
  console.log('done'); // напечатается СРАЗУ
}

// ✅ Последовательно:
for (const item of items) await handleAsync(item);

// ✅ Параллельно с ожиданием всех:
await Promise.all(items.map((item) => handleAsync(item)));`,
        },
        { type: 'heading', content: 'async внутри forEach не работает' },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ forEach игнорирует возвращаемый Promise.
items.forEach(async (item) => {
  await process(item); // запускаются все параллельно, без ожидания
});
console.log('done'); // СРАЗУ — forEach не дождался ничего

// ✅ Последовательно — for...of:
for (const item of items) await process(item);

// ✅ Параллельно с ожиданием — Promise.all + map:
await Promise.all(items.map((item) => process(item)));`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            '`forEach`, `map`, `filter` не «знают» про async — они вызывают callback и игнорируют Promise. Для ожидания используйте `for...of` (последовательно) или `Promise.all` поверх `map` (параллельно).',
        },
        { type: 'heading', content: 'Проглоченный rejected Promise' },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ Промис создан, но не возвращён и не обработан.
async function save(items) {
  items.forEach((item) => {
    fetch('/save', { method: 'POST', body: JSON.stringify(item) });
    // если запрос упал — unhandledrejection
  });
}

// ✅ Возвращаем и ждём:
async function save(items) {
  await Promise.all(
    items.map((item) =>
      fetch('/save', { method: 'POST', body: JSON.stringify(item) }),
    ),
  );
}`,
        },
        { type: 'heading', content: 'try/catch не ловит ошибку в callback' },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ Ошибка внутри setTimeout НЕ попадает в catch снаружи.
async function broken() {
  try {
    setTimeout(() => {
      throw new Error('boom'); // unhandledrejection
    }, 0);
  } catch (e) {
    // никогда не выполнится
  }
}

// ✅ Оборачиваем в промис, awaитим:
async function fixed() {
  await new Promise((_, reject) => {
    setTimeout(() => reject(new Error('boom')), 0);
  });
}`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Золотое правило: `try/catch` ловит ошибку в `await` только если сам `await` стоит внутри блока `try`. Ошибки в синхронных callback-ах таймеров и подписок нужно обрабатывать внутри них самих или оборачивать в Promise.',
        },
      ],
      flashcardIds: ['jsa-f3', 'jsa-f4', 'jsa-f9'],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise', title: 'Promise — MDN (ru)' },
    },

    {
      id: 'advanced-patterns',
      title: 'Практические паттерны: timeout, retry, limit',
      estimatedMinutes: 8,
      blocks: [
        { type: 'heading', content: 'Timeout через Promise.race' },
        {
          type: 'code',
          language: 'javascript',
          content: `function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Timeout')), ms);
  });
  return Promise.race([promise, timeout])
    .finally(() => clearTimeout(timer)); // не держим таймер зря
}

// Использование:
const data = await withTimeout(fetch('/slow'), 5000);`,
        },
        { type: 'heading', content: 'Retry с экспоненциальной задержкой' },
        {
          type: 'code',
          language: 'javascript',
          content: `const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function retry(fn, { attempts = 3, baseMs = 100 } = {}) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) await delay(baseMs * 2 ** i); // 100, 200, 400...
    }
  }
  throw lastError;
}

await retry(() => fetch('/flaky'), { attempts: 5 });`,
        },
        { type: 'heading', content: 'Ограниченный параллелизм' },
        {
          type: 'text',
          content:
            'Запуск тысячи запросов одновременно перегрузит сервер или упрётся в rate limit. Паттерн «pool из N задач» позволяет иметь не более `limit` одновременно выполняющихся промисов: при освобождении слота берём следующую задачу.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `async function limitConcurrency(fns, limit) {
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
}

// Запустить 100 загрузок, не более 5 одновременно:
const data = await limitConcurrency(
  urls.map((u) => () => fetch(u).then((r) => r.json())),
  5,
);`,
        },
        { type: 'heading', content: 'promisify — мост к callback-API' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Конвертация err-first callback в Promise.
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
}

// Использование (любой Node.js API в стиле callback):
const readFileAsync = promisify(fs.readFile);
const content = await readFileAsync('file.txt', 'utf8');`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'В реальных проектах для этих паттернов берут готовые библиотеки: `p-limit` для ограниченного параллелизма, `p-retry` для retry, `AbortController` + сигнал — для отмены fetch вместо timeout.',
        },
      ],
      flashcardIds: ['jsa-f5', 'jsa-f6'],
      docsLink: { url: 'https://learn.javascript.ru/async-await', title: 'async/await — learn.javascript.ru' },
      playground: {
        starterCode: `// Реализуйте retry: повторите fn до attempts раз, верните первый успешный результат.
// Если все попытки упали — пробросьте последнюю ошибку.
// Тестовый код ниже должен напечатать "ok 3" (успех на третьей попытке).

async function retry(fn, attempts) {
  // ваш код
}

let calls = 0;
const flaky = async () => {
  calls++;
  if (calls < 3) throw new Error('fail-' + calls);
  return 'ok ' + calls;
};

retry(flaky, 5).then(console.log).catch((e) => console.log('err', e.message));`,
        expectedOutput: 'ok 3',
        description:
          'Цикл for от 0 до attempts-1, в try { return await fn(); } в catch — сохранить ошибку. После цикла бросить последнюю.',
      },
    },
  ],

  // Все вопросы из старого квиза, кроме тех, что ушли в checkpoint.
  finalQuiz: jsAsyncQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  // Реюзаем существующие карточки и добавляем три новых.
  flashcards: [...jsAsyncFlashcards.cards, ...extraFlashcards],

  cheatsheet: `### Шпаргалка по Promise и async/await

- **Promise** — объект с тремя состояниями: pending (ожидание) → fulfilled (успех) или rejected (ошибка). Переход однократный и необратимый.
- Цепочка \`.then\` — каждый вызов возвращает новый Promise; \`.catch\` ловит ошибку из любого звена; \`.finally\` — для завершающей очистки.
- **async**-функция всегда возвращает Promise; \`return v\` → \`Promise.resolve(v)\`, \`throw\` → \`Promise.reject\`.
- **await** ставит продолжение в очередь микрозадач; \`try/catch\` вокруг \`await\` равнозначен \`.catch\`.
- **Promise.all** — все или ошибка; **allSettled** — все исходы без исключений; **race** — первый завершившийся; **any** — первый успешный.
- Последовательно: \`for...of\` + await; параллельно: \`Promise.all(items.map(...))\`. \`forEach\` с async не ждёт результатов.
- Timeout: \`Promise.race([request, delay(ms).then(() => { throw new Error() })])\`. Retry: цикл try/catch с задержкой.
- Не обработанный rejected Promise → событие unhandledrejection (Node.js 15+ завершает процесс с ошибкой).`,

  interviewQA: [
    {
      id: 'jsa-iq1',
      question: 'Объясните микрозадачи на примере Promise.then. Почему Promise.then выполняется раньше setTimeout(fn, 0)?',
      shortAnswer:
        'Promise.then ставит callback в очередь микрозадач, setTimeout — макрозадач. Между макрозадачами event loop полностью опустошает очередь микрозадач, поэтому Promise всегда выполняется раньше setTimeout(fn, 0), даже если оба зарегистрированы рядом.',
      fullAnswer: `Event loop в браузере поддерживает две независимые очереди: **task queue** для макрозадач (\`setTimeout\`, обработчики DOM, message-event) и **microtask queue** для микрозадач (\`Promise.then/catch/finally\`, \`queueMicrotask\`, \`MutationObserver\`).

Алгоритм каждой итерации event loop:
1. Если call stack пуст — взять одну макрозадачу из task queue, выполнить до конца.
2. **Полностью опустошить** microtask queue, включая микрозадачи, добавленные во время выполнения.
3. При необходимости — выполнить rAF и шаг рендеринга.

Из шага 2 следует ключевое правило: между двумя макрозадачами всегда выполняются **все** накопившиеся микрозадачи. Поэтому в коде

\`\`\`js
setTimeout(() => console.log('macro'), 0);
Promise.resolve().then(() => console.log('micro'));
console.log('sync');
\`\`\`

вывод будет \`sync → micro → macro\`. Сначала отрабатывает синхронный код, затем microtask checkpoint выводит \`micro\`, и только потом event loop берёт макрозадачу таймера.

Каждый \`await\` тоже создаёт микрозадачу — продолжение функции после await ставится в microtask queue, даже если промис уже разрешён. Подробности — в уроке про event loop.`,
      followUps: [
        'Что произойдёт, если внутри Promise.then запланировать ещё один Promise.then?',
        'Чем queueMicrotask отличается от Promise.resolve().then?',
      ],
      relatedChapterId: 'async-await',
    },
    {
      id: 'jsa-iq2',
      question: 'Чем Promise.all отличается от Promise.allSettled? Когда какой выбрать?',
      shortAnswer:
        'Promise.all реджектится при первом rejection, теряя остальные результаты — выбирают, когда нужны все успехи или нужно отменить операцию при ошибке. Promise.allSettled никогда не реджектится, возвращает итоги всех — выбирают для batch-операций, где частичный успех допустим.',
      fullAnswer: `Оба метода ждут завершения всех переданных промисов и сохраняют порядок результатов. Различие — в реакции на ошибку.

**Promise.all** реджектится **немедленно** при первом rejection. Резолв-значения уже завершившихся промисов теряются для caller-а (хотя сами операции продолжаются — отменить их через all нельзя). Семантика «всё или ничего» удобна, когда дальнейшая работа без всех результатов невозможна — например, страница не может рендериться без user и settings одновременно.

\`\`\`js
const [user, settings] = await Promise.all([
  fetch('/user').then((r) => r.json()),
  fetch('/settings').then((r) => r.json()),
]);
\`\`\`

**Promise.allSettled** (ES2020) **никогда** не реджектится. Возвращает массив \`{ status, value | reason }\` для каждого промиса. Подходит для batch-операций, где частичный успех — нормальная ситуация: сохранить 100 файлов, отчитаться о результате каждого.

\`\`\`js
const results = await Promise.allSettled(files.map(uploadFile));
const ok = results.filter((r) => r.status === 'fulfilled').length;
console.log(\`Загружено \${ok} из \${files.length}\`);
\`\`\`

Эвристика: если ошибка одного делает результат бесполезным — \`Promise.all\`. Если каждый результат самостоятелен и ошибки нужно собрать — \`Promise.allSettled\`.`,
      followUps: [
        'Можно ли отменить ещё не завершившиеся промисы при первом rejection в Promise.all?',
        'Чем Promise.any отличается от Promise.allSettled с фильтром fulfilled?',
      ],
      relatedChapterId: 'static-methods',
    },
    {
      id: 'jsa-iq3',
      question: 'Что произойдёт, если не обработать reject в Promise?',
      shortAnswer:
        'Промис останется в состоянии rejected, и движок зафиксирует unhandled rejection. В браузере срабатывает событие unhandledrejection на window. В Node.js 15+ процесс завершается с ненулевым кодом по умолчанию. Достаточно одного .catch в конце цепочки или try/catch вокруг await.',
      fullAnswer: `Если промис стал rejected, но в его цепочке нет ни одного \`.catch\` (или эквивалентного try/catch вокруг \`await\`), движок считает rejection необработанным.

**В браузере** срабатывает глобальное событие \`unhandledrejection\`:

\`\`\`js
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled:', event.reason);
  event.preventDefault(); // подавить дефолтный лог в консоль
});
\`\`\`

Это удобно для отправки ошибок в Sentry или другую систему мониторинга.

**В Node.js** до версии 15 unhandled rejection приводил только к warning. Начиная с Node.js 15 поведение по умолчанию — **завершение процесса** с ненулевым кодом, как при необработанном исключении. Поведение управляется флагом \`--unhandled-rejections=warn|throw|strict\`.

Типичные источники проблемы:
- async-функция вызвана без \`await\` и без \`.catch\`;
- промис создан, но не возвращён из обёртывающей функции;
- ошибка проброшена через несколько \`.then\` без \`.catch\` в конце цепочки;
- \`Promise.all\` упал, а вызывающий код не обработал общий reject.

Защитные меры: всегда либо \`await\` внутри try/catch, либо \`.catch\` в конце цепочки, либо использование \`Promise.allSettled\` там, где частичный успех допустим. На уровне приложения — обязательный обработчик \`unhandledrejection\`.`,
      followUps: [
        'Что выведется при `Promise.reject(1); Promise.reject(2)` без обработчиков?',
        'Может ли rejection стать обработанным «задним числом»?',
      ],
      relatedChapterId: 'pitfalls',
    },
    {
      id: 'jsa-iq4',
      question: 'Как сделать N параллельных запросов с лимитом одновременно выполняющихся?',
      shortAnswer:
        'Поддерживать Set из выполняющихся промисов. Перед запуском следующего, если размер Set достиг лимита — Promise.race(executing) дождётся освобождения слота. После завершения промис удаляет себя из Set через .finally.',
      fullAnswer: `Запуск тысячи промисов одновременно через \`Promise.all\` перегрузит сервер или упрётся в rate limit. Решение — пул из N задач: запускаем не более \`limit\` промисов параллельно, а при освобождении слота берём следующую задачу.

\`\`\`js
async function limitConcurrency(fns, limit) {
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
}
\`\`\`

Ключевые детали реализации:
- \`fns\` — массив **функций**, не промисов. Промис нужно создавать только в момент запуска, иначе все они стартанут сразу.
- Результаты сохраняются по индексу, чтобы порядок совпадал с порядком \`fns\`.
- \`Promise.race(executing)\` ждёт **любого** завершения — освобождения слота. Не reject-аем здесь общий промис: ошибки обрабатывает сам callback.
- \`p.finally\` снимает завершённый промис из Set, освобождая слот для следующей задачи.

В production обычно используют готовые решения: \`p-limit\`, \`bottleneck\`. Они дополнительно поддерживают приоритеты, динамическое изменение лимита, отмену через \`AbortSignal\`.`,
      followUps: [
        'Как добавить отмену через AbortController в эту реализацию?',
        'Чем такой пул отличается от Promise.all с предварительным разбиением на чанки?',
      ],
      relatedChapterId: 'advanced-patterns',
    },
    {
      id: 'jsa-iq5',
      question: 'В чём разница между `await fn()` и `fn().then(...)`?',
      shortAnswer:
        'Семантически оба ставят продолжение в microtask queue. Разница в форме: await оставляет линейный код с переменными и try/catch, then требует callback и возвращает новый Promise — удобно для composable-цепочек.',
      fullAnswer: `На уровне семантики event loop \`await fn()\` примерно эквивалентен \`fn().then(continuation)\`, где \`continuation\` — это весь оставшийся код async-функции. Оба варианта ставят продолжение в очередь микрозадач даже на уже разрешённом промисе.

Различия в практике:

1. **Форма кода.** \`await\` сохраняет плоскую структуру с локальными переменными и обычными конструкциями языка — \`if\`, \`for\`, \`try/catch\`. \`.then\` требует выносить продолжение в callback и часто приводит к «лестнице» из then-ов или потере контекста.

2. **Обработка ошибок.** Вокруг \`await\` ставится \`try/catch\`, как для синхронного кода. \`.then\` ловит ошибки через \`.catch\` в конце цепочки.

3. **Composable-операции.** \`.then\` удобно цеплять через map/filter/reduce, передавать как функцию-трансформер. \`await\` локален к телу async-функции.

4. **Условная асинхронность.** Внутри async-функции легко написать \`if (cond) await x;\` — соответствующий код через .then требует возврата либо промиса, либо обычного значения и менее очевиден.

5. **Производительность.** До оптимизаций V8 (2019) каждый \`await\` стоил две микрозадачи против одной у \`.then\`. С тех пор разница нивелирована для нативных промисов.

Один важный нюанс: \`await\` работает только внутри \`async\` функции (или на верхнем уровне ES-модуля). В обычной функции придётся использовать \`.then\` или сделать функцию async.`,
      followUps: [
        'Сколько микрозадач создаст `await Promise.resolve()` в современном V8?',
        'Когда стоит вернуться к .then в async-функции?',
      ],
      relatedChapterId: 'async-await',
    },
    {
      id: 'jsa-iq6',
      question: 'Как реализовать timeout для Promise? Чем отличается от AbortController?',
      shortAnswer:
        'Через Promise.race промиса и таймера, который реджектится через ms. Минус: исходная операция продолжает выполняться, ресурсы не освобождаются. AbortController даёт настоящую отмену для fetch и других API, поддерживающих AbortSignal.',
      fullAnswer: `Базовая реализация timeout — гонка через Promise.race:

\`\`\`js
function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Timeout')), ms);
  });
  return Promise.race([promise, timeout])
    .finally(() => clearTimeout(timer));
}
\`\`\`

Детали реализации:
- \`finally\` снимает таймер, чтобы он не «висел» после успешного резолва.
- Race игнорирует промис, который завершился позже — но **не отменяет** его. Если это был \`fetch\`, запрос всё равно отправится и ответ всё равно придёт, просто его никто не прочитает.

**AbortController** даёт настоящую отмену: при вызове \`controller.abort()\` сетевой запрос разрывается, ресурсы освобождаются, в обработчике \`fetch\` поднимается \`AbortError\`.

\`\`\`js
function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal })
    .finally(() => clearTimeout(timer));
}

// Современный сахар (Node.js 17+, Chrome 103+):
fetch(url, { signal: AbortSignal.timeout(ms) });
\`\`\`

Эвристика выбора:
- Для **fetch** и других API с поддержкой AbortSignal — всегда AbortController. Это освобождает соединение, экономит трафик и не оставляет «зомби»-запросов.
- Для **произвольной промисной операции** без поддержки отмены — Promise.race. Нужно понимать, что операция продолжит выполняться в фоне.
- В библиотеках лучше принимать опциональный \`signal\` вместо собственного timeout — это даёт пользователю композировать отмену с другими источниками.`,
      followUps: [
        'Как пробросить AbortSignal через несколько уровней async-функций?',
        'Можно ли отменить уже стартовавший Promise без AbortController?',
      ],
      relatedChapterId: 'advanced-patterns',
    },
    {
      id: 'jsa-iq7',
      question: 'Почему async-функция в forEach не работает как ожидается?',
      shortAnswer:
        'forEach игнорирует возвращаемый Promise — он принимает только синхронный callback. Все async-итерации запускаются параллельно, а forEach мгновенно возвращает undefined. Для последовательного выполнения нужен for...of, для параллельного с ожиданием — Promise.all + map.',
      fullAnswer: `Метод \`Array.prototype.forEach\` устроен так: он синхронно вызывает callback для каждого элемента и **игнорирует** возвращаемое значение. Если callback асинхронный и возвращает Promise, forEach об этом не знает — Promise попадает «в никуда».

\`\`\`js
const items = [1, 2, 3];

items.forEach(async (item) => {
  await delay(100);
  console.log(item);
});
console.log('done');
// Вывод: done → 1 → 2 → 3 (в любом порядке)
// "done" печатается СРАЗУ — forEach не дождался ничего.
\`\`\`

Дополнительная проблема: если callback бросит ошибку (или промис будет rejected), это превратится в unhandled rejection — \`forEach\` не пробросит ошибку наружу.

**Правильные альтернативы.**

1. Последовательное выполнение — \`for...of\`:

\`\`\`js
for (const item of items) {
  await process(item);
}
\`\`\`

2. Параллельное выполнение с ожиданием — \`Promise.all\` поверх \`map\`:

\`\`\`js
await Promise.all(items.map((item) => process(item)));
\`\`\`

3. Параллельное с собранными результатами — то же \`Promise.all\` + \`map\`, но возврат значений:

\`\`\`js
const results = await Promise.all(items.map(process));
\`\`\`

Та же логика применима к \`map\`, \`filter\`, \`reduce\` — они не async-aware. Если в них передан async callback, нужно явно работать с возвращаемыми промисами.

Эта тема — один из самых частых вопросов на JS-собеседовании, потому что код «выглядит правильно», но даёт неожиданное поведение в продакшене.`,
      followUps: [
        'Можно ли использовать reduce с async-аккумулятором?',
        'Есть ли в стандартной библиотеке встроенный аналог forEach с поддержкой await?',
      ],
      relatedChapterId: 'pitfalls',
    },
  ],

  nextTopics: [
    {
      slug: 'js-network',
      reason: 'fetch, AbortController и обработка сетевых ошибок — прямое продолжение темы async/await на практике.',
    },
    {
      slug: 'node-streams',
      reason: 'Node-streams — следующий уровень асинхронности: backpressure, pipeline, AsyncIterable.',
    },
  ],

  related: [
    { kind: 'bug-hunt', id: 'bh-07', label: 'Bug hunt: async внутри forEach' },
    { kind: 'bug-hunt', id: 'bh-08', label: 'Bug hunt: проглоченный rejected Promise' },
    { kind: 'bug-hunt', id: 'bh-09', label: 'Bug hunt: race condition в async-коде' },
  ],
};
