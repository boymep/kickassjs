import type { Lesson } from '../../types/lesson';
import { jsAsyncQuiz } from '../quizzes/js-async';

const Q = Object.fromEntries(jsAsyncQuiz.questions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set(['jsa-q1', 'jsa-q2', 'jsa-q3', 'jsa-q9', 'jsa-q12']);

export const jsAsyncLesson: Lesson = {
  topicId: 'js-async',

  intro: {
    whyItMatters: `Промисы и \`async\` / \`await\` — стандартный способ работать с асинхронностью в JavaScript. На них построены \`fetch\`, обработка ошибок в HTTP-клиентах и все паттерны конкурентности.

На собеседовании проверяют не определение промиса, а понимание модели: три состояния, цепочки \`.then\`, отличия \`Promise.all\` / \`allSettled\` / \`race\` / \`any\`, поведение при unhandled rejection и при забытом \`await\`.`,
    estimatedMinutes: 28,
    interviewAngle:
      'Типичные вопросы: модель промиса (pending → fulfilled / rejected), пять статических методов и их различия, порядок выполнения кода с \`async\` / \`await\`, обработка ошибок и unhandled rejection. Отдельно проверяют знание антипаттернов: promise constructor antipattern, забытый \`await\`, попытка «отменить» промис через \`race\`.',
    prerequisites: [{ slug: 'js-event-loop', title: 'Event Loop' }],
  },

  chapters: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'promise-basics',
      title: 'Promise: состояния и цепочки',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'До промисов асинхронность в JavaScript строилась на коллбэках, и при последовательных операциях быстро превращалась в «callback hell» — глубоко вложенные функции, общая обработка ошибок в которых требовала ручного прокидывания через все уровни. Промис — объект, представляющий результат асинхронной операции, который будет известен в будущем. Он позволяет «выпрямить» цепочки и обработать ошибки в одном месте.',
        },
        {
          type: 'text',
          content:
            'У промиса три состояния: pending — операция ещё идёт, fulfilled — завершилась успешно, rejected — завершилась с ошибкой. Переход в терминальное состояние (fulfilled или rejected) происходит ровно один раз; после этого состояние и значение зафиксированы.',
        },
        { type: 'heading', content: 'Executor — что внутри new Promise' },
        {
          type: 'text',
          content:
            'Функция, переданная в конструктор \`new Promise(executor)\`, называется executor. Она вызывается синхронно немедленно при создании промиса; через её аргументы \`resolve\` и \`reject\` промис переводится в терминальное состояние. Если в executor выбрасывается исключение, промис автоматически отвергается этой ошибкой.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (Math.random() > 0.5) resolve('успех');
    else reject(new Error('сбой'));
  }, 1000);
});

promise
  .then((value)  => console.log(value))
  .catch((error) => console.error(error.message));`,
        },
        { type: 'heading', content: 'Цепочки и трансформация значений' },
        {
          type: 'text',
          content:
            '\`.then(onFulfilled)\` возвращает новый промис. Поведение зависит от того, что вернул коллбэк:',
        },
        {
          type: 'list',
          content: `Если возвращено обычное значение — следующий \`.then\` получит его в качестве аргумента.
Если возвращён другой промис — следующий \`.then\` дождётся его завершения и получит его значение.
Если коллбэк выбросил исключение или вернул rejected-промис — управление передаётся ближайшему \`.catch\`. Ошибка пробрасывается по цепочке до первого обработчика.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `fetch('/api/user/1')
  .then((res)   => res.json())
  .then((user)  => fetch('/api/posts/' + user.id))
  .then((res)   => res.json())
  .then((posts) => render(posts))
  .catch((err)  => showError(err));`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            '\`.catch(fn)\` — синоним \`.then(undefined, fn)\`. \`.finally(fn)\` вызывается и при fulfilled, и при rejected; возвращаемое значение \`fn\` игнорируется, но выброшенная в \`fn\` ошибка отвергает результирующий промис.',
        },
        { type: 'heading', content: 'Преобразование значения в промис' },
        {
          type: 'code',
          language: 'javascript',
          content: `Promise.resolve(42);            // уже fulfilled со значением 42
Promise.reject(new Error('x'));  // уже rejected с ошибкой

// «Заглушка» для тестов:
const fakeFetch = () => Promise.resolve({ id: 1, name: 'Alice' });`,
        },
        { type: 'heading', content: 'Thenable: что считается промисом' },
        {
          type: 'text',
          content:
            'Любой объект с методом \`then(resolve, reject)\` называется thenable. \`await\` и \`Promise.resolve\` принимают thenable и работают с ним как с промисом. Это позволяет, например, библиотеке вернуть свой собственный объект, совместимый с промисами.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const thenable = {
  then(resolve) { resolve(42); },
};

await thenable;                  // 42
Promise.resolve(thenable);       // станет fulfilled со значением 42`,
        },
      ],
      checkpoint: [Q['jsa-q1']!, Q['jsa-q3']!, {
        type: 'ordering',
        id: 'jsa-ord1',
        description: 'Расставьте этапы жизненного цикла промиса в правильном порядке',
        items: [
          'Промис создан, состояние pending',
          'В executor вызывается resolve(value) или reject(error)',
          'Состояние переходит в fulfilled или rejected (один раз)',
          'Зарегистрированные .then / .catch ставятся в microtask queue',
          'Микрозадачи выполняются после текущего синхронного кода',
        ],
        explanation:
          'Промис фиксируется в одно из терминальных состояний один раз. Все коллбэки выполняются как микрозадачи — даже если промис уже fulfilled на момент регистрации.',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'async-await',
      title: 'async / await — сахар над Promise',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            '\`async\`-функция всегда возвращает промис. \`await\` приостанавливает выполнение функции до резолва указанного промиса и возвращает его значение; rejected-промис превращается в выброшенное исключение в точке \`await\`.',
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'До первого \`await\` тело \`async\`-функции выполняется синхронно. Сам \`await\` ставит продолжение в очередь микрозадач (microtask queue), даже если ожидаемый промис уже резолвлен. Поэтому код после \`await\` всегда выполняется не раньше, чем закончится текущий синхронный участок.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `async function loadUser(id) {
  const res  = await fetch('/api/user/' + id);
  const user = await res.json();
  return user;
}

// Эквивалент через .then:
function loadUserEquivalent(id) {
  return fetch('/api/user/' + id)
    .then((res)  => res.json())
    .then((user) => user);
}`,
        },
        { type: 'heading', content: 'Обработка ошибок' },
        {
          type: 'text',
          content:
            'Внутри \`async\`-функции ошибки ловятся обычным \`try / catch\`. Если ошибку не поймать, она превратится в rejected-промис, возвращаемый функцией.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `async function loadUser(id) {
  try {
    const res = await fetch('/api/user/' + id);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch (err) {
    console.error('Не удалось загрузить пользователя:', err);
    return null;
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Подробнее о поведении \`fetch\` на ответах 4xx и 5xx — в разделе «Подводные камни».',
        },
        { type: 'heading', content: 'Параллельное выполнение' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Последовательно — оба запроса выполняются один за другим
async function slow() {
  const a = await fetchA(); // 1 секунда
  const b = await fetchB(); // ещё 1 секунда
  return [a, b];
}

// Параллельно — оба стартуют сразу
async function fast() {
  const [a, b] = await Promise.all([fetchA(), fetchB()]); // 1 секунда
  return [a, b];
}`,
        },
        {
          type: 'text',
          content:
            '\`Promise.all\` подробно разобран в следующей главе. Важно лишь правило: если запросы независимы и могут идти параллельно, последовательный \`await\` без необходимости умножает время ожидания.',
        },
      ],
      checkpoint: [Q['jsa-q2']!, Q['jsa-q9']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'static-methods',
      title: 'Promise.all, allSettled, race, any',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'list',
          content: `\`Promise.all(iterable)\` — fulfilled, когда все промисы fulfilled. Rejected при первой же ошибке. Возвращает массив значений в порядке входных промисов, а не в порядке резолва.
\`Promise.allSettled(iterable)\` — ждёт завершения всех, не отвергается при ошибках. Возвращает массив \`{ status, value | reason }\`.
\`Promise.race(iterable)\` — fulfilled или rejected по первому завершившемуся промису (включая случай, когда первым завершился rejected).
\`Promise.any(iterable)\` — fulfilled по первому fulfilled. Если все промисы rejected, отвергается \`AggregateError\` со списком всех ошибок.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Promise.all: останавливается на первой ошибке.
// Остальные промисы при этом продолжают выполняться,
// но их результаты игнорируются.
try {
  const [a, b, c] = await Promise.all([fetchA(), fetchB(), fetchC()]);
} catch (err) {
  // одна ошибка ломает всё
}

// Promise.allSettled: получаем результаты всех
const results = await Promise.allSettled([fetchA(), fetchB(), fetchC()]);
for (const r of results) {
  if (r.status === 'fulfilled') console.log(r.value);
  else console.error(r.reason);
}

// Promise.race: первый ответ — таймаут или данные
const result = await Promise.race([
  fetchData(),
  new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000)),
]);

// Promise.any: первый успешный — например, fallback CDN
const data = await Promise.any([
  fetch('https://cdn1.example.com'),
  fetch('https://cdn2.example.com'),
]);`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Когда нужны все результаты и единичный сбой не должен прерывать остальные — \`Promise.allSettled\`. Когда важен первый завершившийся (включая ошибку) — \`Promise.race\`. Когда достаточно первого успешного — \`Promise.any\`.',
        },
        { type: 'heading', content: 'Promise.withResolvers (ES2024)' },
        {
          type: 'text',
          content:
            'Современный способ создать промис, к которому есть внешний доступ к \`resolve\` и \`reject\`. Раньше для этого писали так называемый «deferred»-паттерн вручную; теперь это стандарт.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { promise, resolve, reject } = Promise.withResolvers();

setTimeout(() => resolve('готово'), 1000);
await promise; // 'готово'`,
        },
      ],
      checkpoint: [Q['jsa-q12']!, {
        type: 'multi-select',
        id: 'jsa-ms1',
        description: 'Какие утверждения о методах Promise верны?',
        options: [
          '\`Promise.all\` отвергается при первой же ошибке',
          '\`Promise.allSettled\` всегда fulfilled',
          '\`Promise.race\` ждёт все промисы',
          '\`Promise.any\` бросает \`AggregateError\`, если все промисы rejected',
          '\`Promise.all\` пропускает ошибки и возвращает остальные значения',
        ],
        correctIndices: [0, 1, 3],
        explanation:
          '\`Promise.all\` падает на первой ошибке. \`Promise.allSettled\` всегда успешен — ошибки попадают в массив с \`status: rejected\`. \`Promise.race\` ждёт только первое завершение. \`Promise.any\` — только первый успех.',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'cancellation',
      title: 'Отмена запросов: AbortController',
      estimatedMinutes: 4,
      blocks: [
        {
          type: 'text',
          content:
            'Промис нельзя «отменить» — после старта операции снаружи на неё повлиять невозможно. \`Promise.race\` с таймаутом резолвит ожидание, но реальный запрос (например, \`fetch\`) продолжает работать в фоне. Чтобы прервать саму операцию, нужен другой механизм — \`AbortController\`.',
        },
        {
          type: 'text',
          content:
            '\`AbortController\` создаёт пару из контроллера и \`signal\`. Сигнал передаётся в API, поддерживающее отмену (\`fetch\`, ряд стандартных функций Node.js, многие библиотеки). Вызов \`controller.abort()\` переводит сигнал в состояние aborted и отвергает связанный промис ошибкой \`AbortError\`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const controller = new AbortController();

setTimeout(() => controller.abort(), 3000);

try {
  const res = await fetch('/api/slow', { signal: controller.signal });
  const data = await res.json();
} catch (err) {
  if (err.name === 'AbortError') {
    console.log('Запрос отменён по таймауту');
  } else {
    throw err;
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'В современных рантаймах есть готовая обёртка \`AbortSignal.timeout(ms)\`: \`fetch(url, { signal: AbortSignal.timeout(3000) })\` сам отменит запрос через указанное время.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'pitfalls',
      title: 'Подводные камни и антипаттерны',
      estimatedMinutes: 6,
      blocks: [
        { type: 'heading', content: 'Promise constructor antipattern' },
        {
          type: 'text',
          content:
            'Если функция, к которой обращаются, уже возвращает промис, заворачивать её в \`new Promise\` избыточно и опасно: легко потерять ошибку или не пробросить значение. Возвращайте имеющийся промис напрямую.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// АНТИПАТТЕРН
function loadUser(id) {
  return new Promise((resolve, reject) => {
    fetch('/api/user/' + id).then(resolve);
    // ошибки не обрабатываются, .catch не пробрасывается
  });
}

// КОРРЕКТНО
function loadUserOk(id) {
  return fetch('/api/user/' + id);
}`,
        },
        { type: 'heading', content: 'Забытый await' },
        {
          type: 'code',
          language: 'javascript',
          content: `async function save(data) {
  // Забыли await — промис улетел, ошибки не пойманы
  fetch('/api/save', { method: 'POST', body: JSON.stringify(data) });
  return true;
}

// Корректно:
async function saveCorrect(data) {
  const res = await fetch('/api/save', { method: 'POST', body: JSON.stringify(data) });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return true;
}`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Без \`await\` функция возвращает значение до завершения запроса. Если промис отвергнется, его никто не обработает — возникнет unhandled rejection. Линтеры (\`@typescript-eslint/no-floating-promises\`) помогают отлавливать такие случаи.',
        },
        { type: 'heading', content: 'for...of с await — последовательное выполнение' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Последовательно: каждая итерация ждёт предыдущую
for (const id of ids) {
  const user = await fetchUser(id); // n запросов подряд
  users.push(user);
}

// Параллельно через Promise.all
const users = await Promise.all(ids.map(fetchUser));`,
        },
        { type: 'heading', content: 'fetch не отвергается на 4xx / 5xx' },
        {
          type: 'text',
          content:
            '\`fetch\` считает успехом любой HTTP-ответ — даже 404 или 500. Промис отвергается только при сетевой ошибке (нет соединения, CORS, отмена). Поэтому проверка \`res.ok\` или \`res.status\` обязательна перед чтением тела.',
        },
        { type: 'heading', content: 'finally может изменить результат' },
        {
          type: 'text',
          content:
            'Возвращаемое значение коллбэка \`.finally\` обычно игнорируется. Но если внутри \`finally\` выбрасывается исключение или возвращается rejected-промис, результирующий промис будет отвергнут именно этой ошибкой — даже если исходный был fulfilled.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `Promise.resolve(1)
  .finally(() => { throw new Error('oops'); })
  .then((v)   => console.log('value', v))
  .catch((e)  => console.error('caught', e.message));
// caught oops`,
        },
        { type: 'heading', content: 'Unhandled rejection' },
        {
          type: 'text',
          content:
            'Если rejected-промис не пойман через \`.catch\` или \`try / catch\`, происходит событие \`unhandledrejection\`. В Node.js 15+ необработанный rejection по умолчанию приводит к аварийному завершению процесса (если не задан обработчик \`process.on(\'unhandledRejection\')\`). Поведение настраивается флагом \`--unhandled-rejections=warn|strict|throw\`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Глобальный мониторинг забытых rejection в браузере
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled:', event.reason);
  // event.preventDefault() — подавить дефолтный лог в консоль
});

// В Node.js
process.on('unhandledRejection', (reason) => {
  // отправка в систему мониторинга
});`,
        },
        { type: 'heading', content: 'Микрозадачи и порядок выполнения' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Что выведется?
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');

// 1 → 4 → 3 → 2
// Сначала синхронный код, потом микрозадачи, потом макрозадача setTimeout.`,
        },
      ],
      playground: {
        starterCode: `// Реализуйте sleep(ms) — промис, который резолвится через ms миллисекунд.
// Ожидаемый вывод: "start", через секунду "end".

function sleep(ms) {
  // ваш код
}

async function main() {
  console.log('start');
  await sleep(1000);
  console.log('end');
}

main();`,
        expectedOutput: 'start\nend',
        description:
          'Стандартный паттерн: \`return new Promise((resolve) => setTimeout(resolve, ms))\`. Удобно для пауз в тестах и для имитации задержек.',
      },
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'practical-patterns',
      title: 'Практические паттерны',
      estimatedMinutes: 5,
      blocks: [
        { type: 'heading', content: 'Retry с экспоненциальной задержкой' },
        {
          type: 'text',
          content:
            'Сетевые запросы периодически падают по временным причинам (5xx, обрыв соединения). Повтор с растущей задержкой даёт системе шанс восстановиться, не создавая лавину запросов.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `async function retry(fn, { attempts = 3, baseDelay = 200 } = {}) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, baseDelay * 2 ** i));
      }
    }
  }
  throw lastError;
}

const data = await retry(() => fetch('/api/flaky').then((r) => r.json()));`,
        },
        { type: 'heading', content: 'Таймаут запроса' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Современный способ — через AbortSignal
const res = await fetch('/api/slow', {
  signal: AbortSignal.timeout(5000),
});

// До появления AbortSignal.timeout — связка race + AbortController
function withTimeout(promise, ms, controller) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => {
      controller?.abort();
      reject(new Error('timeout'));
    }, ms),
  );
  return Promise.race([promise, timeout]);
}`,
        },
        { type: 'heading', content: 'for await...of для асинхронной итерации' },
        {
          type: 'text',
          content:
            '\`for await...of\` обходит асинхронный итератор — например, поток данных в Node.js или ответ Server-Sent Events. На каждой итерации внешний код ждёт следующего значения, не блокируя event loop.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Чтение тела ответа кусками по мере прихода
const res = await fetch('/api/stream');
for await (const chunk of res.body) {
  processChunk(chunk);
}`,
        },
        { type: 'heading', content: 'Top-level await в модулях' },
        {
          type: 'text',
          content:
            'В ES-модулях разрешён \`await\` на верхнем уровне без оборачивания в \`async\`-функцию. Модуль становится «асинхронным»: импортирующие модули ждут его инициализации перед выполнением своего кода.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// config.mjs
const config = await fetch('/config.json').then((r) => r.json());
export default config;

// app.mjs — импорт дождётся загрузки config
import config from './config.mjs';`,
        },
      ],
    },
  ],

  finalQuiz: jsAsyncQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  cheatsheet: `### Шпаргалка по Promise и async / await

**Жизненный цикл промиса**
- Состояния: pending → fulfilled или rejected
- Состояние меняется один раз и больше не меняется
- Коллбэки \`.then\` / \`.catch\` всегда выполняются как микрозадачи

**Базовые операции**
\`\`\`js
new Promise((resolve, reject) => { /* executor */ });
Promise.resolve(value);
Promise.reject(error);
Promise.withResolvers(); // { promise, resolve, reject } — ES2024

promise.then(onFulfilled, onRejected);
promise.catch(onRejected);
promise.finally(onFinally);
\`\`\`

**async / await**
- \`async\`-функция всегда возвращает промис
- \`await\` приостанавливает выполнение до резолва
- До первого \`await\` тело выполняется синхронно
- Каждый \`await\` создаёт минимум одну микрозадачу
- Ошибки ловятся обычным \`try / catch\`

**Статические методы**
- \`Promise.all\` — все или ошибка
- \`Promise.allSettled\` — массив \`{ status, value | reason }\`
- \`Promise.race\` — первый завершившийся (включая rejected)
- \`Promise.any\` — первый fulfilled, иначе \`AggregateError\`

**Параллельность**
\`\`\`js
// Последовательно
const a = await fetchA();
const b = await fetchB();

// Параллельно
const [a, b] = await Promise.all([fetchA(), fetchB()]);
\`\`\`

**Отмена через AbortController**
\`\`\`js
const controller = new AbortController();
fetch(url, { signal: controller.signal });
controller.abort(); // → AbortError в catch

// или
fetch(url, { signal: AbortSignal.timeout(3000) });
\`\`\`

**Антипаттерны**
- Promise constructor antipattern: \`new Promise((r) => fetch().then(r))\` вместо \`return fetch()\`
- Забытый \`await\` → unhandled rejection при ошибке
- \`for...of\` с \`await\` → последовательно, не параллельно
- \`fetch\` не отвергается на 4xx / 5xx — проверка \`res.ok\` обязательна
- Race с таймаутом не отменяет реальный запрос — нужен AbortController

**Промис как пауза**
\`\`\`js
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await sleep(500);
\`\`\``,

  nextTopics: [
    {
      slug: 'js-event-loop',
      reason:
        'Промисы — главный источник микрозадач в event loop. После \`async\` / \`await\` полезно ещё раз увидеть порядок их выполнения.',
    },
    {
      slug: 'js-network',
      reason:
        '\`fetch\` — основной источник промисов на фронте. Логичное продолжение — разобрать HTTP, CORS, cookies и AbortController.',
    },
  ],
};
