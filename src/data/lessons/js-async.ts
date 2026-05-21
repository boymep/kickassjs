import type { Lesson } from '../../types/lesson';
import { jsAsyncQuiz } from '../quizzes/js-async';

const Q = Object.fromEntries(jsAsyncQuiz.questions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set(['jsa-q1', 'jsa-q2', 'jsa-q3', 'jsa-q9', 'jsa-q12']);

export const jsAsyncLesson: Lesson = {
  topicId: 'js-async',

  intro: {
    whyItMatters: `Промисы и \`async\` / \`await\` — стандартный способ работать с асинхронностью в JavaScript. На них построены \`fetch\`, обработка ошибок в HTTP-клиентах, паттерны конкурентности.

На собеседовании проверяют не определение промиса, а понимание модели: три состояния, цепочки \`.then\`, разница между \`Promise.all\` / \`allSettled\` / \`race\` / \`any\`, типичные ловушки с unhandled rejection и забытым \`await\`.`,
    estimatedMinutes: 28,
    interviewAngle:
      'Интервьюера интересуют: модель промиса (pending → fulfilled / rejected), пять статических методов и их разница, порядок выполнения в коде с \`async\` / \`await\`, обработка ошибок и unhandled rejection.',
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
            '\`Promise\` — объект, представляющий результат асинхронной операции в будущем. У него три состояния: **pending** (в работе), **fulfilled** (успешно завершён) и **rejected** (с ошибкой). Состояние меняется ровно один раз и больше не меняется — это инвариант промиса.',
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
            '\`.then(onFulfilled)\` возвращает новый промис. Если коллбэк возвращает значение — следующий \`.then\` получит это значение. Если возвращает промис — следующий \`.then\` ждёт его. Если бросает исключение или возвращается rejected-промис — управление передаётся ближайшему \`.catch\`.',
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
            '\`.then\` всегда возвращает новый промис — это позволяет строить цепочки. \`.catch(fn)\` — синоним \`.then(undefined, fn)\`. \`.finally(fn)\` выполняется в обоих случаях и не меняет значение.',
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
            '\`async\` / \`await\` — синтаксис, позволяющий писать асинхронный код в стиле синхронного. \`async\`-функция всегда возвращает промис. \`await\` приостанавливает выполнение до резолва промиса и достаёт его значение.',
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
            '\`fetch\` отвергает промис только при сетевой ошибке (нет соединения, CORS). Ответы 4xx и 5xx — это успешный промис с \`res.ok === false\`. Проверка \`res.ok\` обязательна.',
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
          content: `**Promise.all(iterable)** — fulfilled, когда все промисы fulfilled. Rejected при первой ошибке. Возвращает массив значений.
**Promise.allSettled(iterable)** — ждёт завершения всех, не отвергается при ошибках. Возвращает массив \`{ status, value | reason }\`.
**Promise.race(iterable)** — fulfilled или rejected по первому завершившемуся промису.
**Promise.any(iterable)** — fulfilled по первому fulfilled. Если все rejected — \`AggregateError\`.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Promise.all: останавливается на первой ошибке
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
            'Если хочется параллельных запросов и один сбой не должен ломать всё — \`Promise.allSettled\`. Если важен только первый ответ — \`Promise.race\`. Если нужно «хоть один успешный» — \`Promise.any\`.',
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
      id: 'pitfalls',
      title: 'Подводные камни',
      estimatedMinutes: 5,
      blocks: [
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
            'Без \`await\` функция возвращает результат до завершения запроса. Если запрос упадёт, ошибка станет unhandled rejection. Линтеры (\`@typescript-eslint/no-floating-promises\`) помогают отлавливать такие случаи.',
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
        { type: 'heading', content: 'Unhandled rejection' },
        {
          type: 'text',
          content:
            'Если rejected-промис не пойман через \`.catch\` или \`try / catch\`, он выбрасывает событие \`unhandledrejection\`. В Node 15+ процесс по умолчанию завершается. В браузере ошибка попадает в консоль и в глобальный обработчик.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Глобальный мониторинг забытых rejection
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled:', event.reason);
  // event.preventDefault() — подавить дефолтный лог в консоль
});`,
        },
        { type: 'heading', content: 'fetch не отвергается на 4xx / 5xx' },
        {
          type: 'text',
          content:
            '\`fetch\` считает успехом любой HTTP-ответ — даже 404 или 500. Промис отвергается только при сетевой ошибке (нет соединения, CORS-ошибка). Поэтому проверка \`res.ok\` или \`res.status\` обязательна перед чтением тела.',
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

promise.then(onFulfilled, onRejected);
promise.catch(onRejected);
promise.finally(onFinally);
\`\`\`

**async / await**
- \`async\`-функция всегда возвращает промис
- \`await\` приостанавливает выполнение до резолва
- Ошибки ловятся обычным \`try / catch\`
- До первого \`await\` функция выполняется синхронно

**Статические методы**
- \`Promise.all\` — все или ошибка
- \`Promise.allSettled\` — массив \`{ status, value | reason }\`
- \`Promise.race\` — первый завершившийся
- \`Promise.any\` — первый fulfilled, иначе \`AggregateError\`

**Параллельность**
\`\`\`js
// Последовательно
const a = await fetchA();
const b = await fetchB();

// Параллельно
const [a, b] = await Promise.all([fetchA(), fetchB()]);
\`\`\`

**Подводные камни**
- Забытый \`await\` → unhandled rejection при ошибке
- \`for...of\` с \`await\` → последовательно, не параллельно
- \`fetch\` не отвергается на 4xx / 5xx — проверка \`res.ok\`
- Промис в цикле без \`Promise.all\` теряет параллельность

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
