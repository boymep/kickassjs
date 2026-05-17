import type { Lesson } from '../../types/lesson';
import { jsEventLoopQuiz } from '../quizzes/js-event-loop';
import { jsEventLoopFlashcards } from '../flashcards/js-event-loop';

// Index existing quiz questions for reuse as checkpoints.
const Q = Object.fromEntries(jsEventLoopQuiz.questions.map((q) => [q.id, q]));

// Questions used as in-chapter checkpoints (must NOT appear in finalQuiz).
const CHECKPOINT_IDS = new Set(['jsel-q1', 'jsel-q2', 'jsel-q4', 'jsel-q10']);

const extraFlashcards = [
  {
    id: 'jsel-f7',
    question: 'Как requestAnimationFrame встраивается в event loop браузера?',
    answer:
      'rAF — это специальная очередь callback-ов, которая обрабатывается между макрозадачами и шагом рендеринга. Браузер сам решает, когда сделать кадр: callback выполняется один раз перед очередным repaint, обычно с частотой экрана (60/120 Гц).',
    keyPoints: [
      'rAF callback вызывается перед repaint, после микрозадач текущего тика',
      'Не выполняется в фоновых вкладках — браузер останавливает рендер',
      'Используется для анимаций: setTimeout не синхронизирован с кадрами',
      'Внутри rAF можно читать layout (getBoundingClientRect) без force reflow',
      'Запланированный rAF выполнится строго один раз; для следующего кадра нужно перепланировать',
    ],
    code: `function animate(time) {
  // time — DOMHighResTimeStamp в мс
  element.style.transform = \`translateX(\${time / 10}px)\`;
  requestAnimationFrame(animate); // следующий кадр
}
requestAnimationFrame(animate);`,
  },
  {
    id: 'jsel-f8',
    question: 'Почему бесконечная цепочка Promise.then блокирует рендеринг?',
    answer:
      'Микрозадачи опустошаются полностью между макрозадачами и шагом рендеринга. Если каждый then создаёт новый then, очередь не пустеет — браузер не доходит до repaint и rAF, страница «замораживается».',
    keyPoints: [
      'Microtask checkpoint должен завершиться до перехода к следующему шагу',
      'Бесконечный Promise.resolve().then(() => Promise.resolve().then(...)) — типичная ловушка',
      'Симптомы: страница не реагирует на ввод, анимации останавливаются',
      'Решение: использовать setTimeout/setImmediate/queueMicrotask с условием выхода',
      'Для CPU-нагрузки — Web Worker, не микрозадачи',
    ],
  },
  {
    id: 'jsel-f9',
    question: 'Чем отличаются queueMicrotask и Promise.resolve().then()?',
    answer:
      'Оба добавляют callback в одну и ту же очередь микрозадач с одинаковым приоритетом. Разница в накладных расходах: queueMicrotask не создаёт Promise-объект и не оборачивает результат в then-цепочку. Также queueMicrotask «пробрасывает» исключения как unhandled, а Promise — превращает их в rejection.',
    keyPoints: [
      'Одна и та же очередь, одинаковый порядок (FIFO по постановке)',
      'queueMicrotask дешевле — без аллокации Promise',
      'Исключение в queueMicrotask → window.onerror / uncaughtException',
      'Исключение в then → rejection и unhandledrejection',
      'queueMicrotask — низкоуровневый API, удобен для библиотек',
    ],
    code: `queueMicrotask(() => console.log('A'));
Promise.resolve().then(() => console.log('B'));
queueMicrotask(() => console.log('C'));
// A → B → C (порядок постановки)`,
  },
];

export const jsEventLoopLesson: Lesson = {
  topicId: 'js-event-loop',

  intro: {
    whyItMatters: `JavaScript в браузере исполняется в **одном потоке**: один и тот же поток одновременно отвечает за выполнение вашего кода, обработку пользовательского ввода, вычисление макета (layout) и отрисовку кадра (paint). Если этот поток занят синхронной работой, страница перестаёт реагировать на клики, скролл «дёргается», анимации замирают — пользователь видит «фриз» или, как принято говорить, **jank**.

Чтобы при этом обслуживать сетевые запросы, таймеры и DOM-события без блокировок, движок применяет **event loop**: тяжёлые асинхронные операции (\`setTimeout\`, \`fetch\`, обработчики DOM) выполняются вне главного потока — в Web API браузера, — а их колбэки складываются в очереди. Когда стек вызовов пуст, event loop забирает по одной макрозадаче и **полностью** опустошает очередь микрозадач (Promise, queueMicrotask, MutationObserver). После этого браузер встраивает шаг рендеринга: стиль → layout → paint, причём перед самим paint вызываются колбэки \`requestAnimationFrame\`.

Понимание этого порядка критично для интервью и для практики. Без него невозможно объяснить, почему \`setTimeout(fn, 0)\` выполняется позже \`Promise.resolve().then()\`, почему \`async/await\` не делает код «синхронным», как \`requestAnimationFrame\` синхронизирует анимации с частотой экрана, и почему длинный \`for\` в обработчике клика замораживает интерфейс. В этом уроке вы научитесь предсказывать порядок вывода в любом миксе таймеров и промисов, диагностировать причины jank-а и проектировать асинхронный код, который не блокирует UI.`,
    estimatedMinutes: 35,
    interviewAngle:
      'Интервьюер проверяет три вещи: умеете ли вы предсказывать порядок вывода в коде с микс setTimeout/Promise/queueMicrotask, понимаете ли разницу между микро- и макрозадачами и моментом рендеринга, и можете ли диагностировать jank в реальном UI-коде.',
    prerequisites: [{ slug: 'js-closures', title: 'Замыкания' }],
  },

  resources: {
    videos: [
      {
        source: 'youtube',
        id: '8aGhZQkoFbQ',
        title: 'What the heck is the event loop anyway? — Philip Roberts',
        channel: 'JSConf',
        language: 'en',
        durationSec: 26 * 60,
        description: 'Каноническая лекция JSConf EU 2014. Лучшее интуитивное объяснение event loop, стека вызовов и Web APIs.',
      },
      {
        source: 'youtube',
        id: 'cCOL7MC4Pl0',
        title: 'In The Loop — Jake Archibald (JSConf.Asia)',
        channel: 'JSConf',
        language: 'en',
        durationSec: 35 * 60,
        description: 'Глубокий разбор от инженера Chrome: микрозадачи, requestAnimationFrame, render steps и тонкости спецификации HTML.',
      },
    ],
    links: [
      {
        url: 'https://developer.mozilla.org/ru/docs/Web/JavaScript/Event_loop',
        title: 'Цикл событий — MDN',
        source: 'mdn',
        language: 'ru',
        note: 'Каноническая справка MDN: стек, очередь, run-to-completion, never-blocking-model.',
      },
      {
        url: 'https://html.spec.whatwg.org/multipage/webappapis.html#event-loops',
        title: 'HTML spec — Event loops',
        source: 'spec',
        language: 'en',
        note: 'Первоисточник: точное определение task queue, microtask checkpoint и шага рендеринга.',
      },
      {
        url: 'https://learn.javascript.ru/event-loop',
        title: 'Цикл событий: микро- и макрозадачи — learn.javascript.ru',
        source: 'learn-js',
        language: 'ru',
        note: 'Глава Ильи Кантора с примерами и иллюстрациями. Лучший русскоязычный источник.',
      },
      {
        url: 'https://web.dev/articles/rendering-performance',
        title: 'Rendering Performance — web.dev',
        source: 'web-dev',
        language: 'en',
        note: 'Как длительные задачи влияют на FPS, что такое long tasks, как профилировать в DevTools.',
      },
      {
        url: 'https://developer.mozilla.org/ru/docs/Web/API/Window/requestAnimationFrame',
        title: 'requestAnimationFrame — MDN',
        source: 'mdn',
        language: 'ru',
        note: 'Когда rAF вызывается относительно микрозадач и paint, поведение в фоновых вкладках.',
      },
    ],
  },

  chapters: [
    {
      id: 'single-thread-stack',
      title: 'Однопоточность, стек вызовов и Web APIs',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'JavaScript в браузере выполняется в **одном потоке**. У этого потока есть **стек вызовов** (call stack) — работает как стопка: каждый вызов функции ложится сверху, завершённый снимается. Пока стек не пуст, браузер не может ни обработать клик, ни нарисовать новый кадр.',
        },
        {
          type: 'list',
          content: `- **Call Stack** (стек вызовов) — список активных функций. Каждый вызов добавляется сверху, завершённый удаляется.
- **Heap** (куча) — область памяти, где живут объекты и замыкания.
- **Web APIs** — таймеры, fetch, DOM-события, observers. Работают вне главного потока, внутри браузера.
- **Task Queue** (очередь задач) — макрозадачи: коллбэки таймеров, обработчики DOM-событий, сетевые ответы.
- **Microtask Queue** (очередь микрозадач) — \`Promise.then\`, \`queueMicrotask\`, \`MutationObserver\`.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `console.log('Start');           // 1. синхронно

setTimeout(() => {
  console.log('Timeout');       // 4. макрозадача
}, 0);

Promise.resolve().then(() => {
  console.log('Promise');       // 3. микрозадача
});

console.log('End');             // 2. синхронно

// Вывод: Start → End → Promise → Timeout`,
        },
        { type: 'visualization', content: '', vizId: 'event-loop' },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Работает правило **run-to-completion**: пока текущая задача не завершилась полностью, браузер не возьмёт ничего из очередей. Поэтому `setTimeout(fn, 0)` гарантированно выполнится **после** всего синхронного кода, идущего за ним.',
        },
        {
          type: 'text',
          content:
            'Web APIs не «возвращают» результат сразу: они принимают callback и регистрируют его. Когда таймер истёк или сеть пришла, браузер кладёт callback в соответствующую очередь, а event loop позже доставит его в стек.',
        },
      ],
      flashcardIds: ['jsel-f1'],
      checkpoint: [Q['jsel-q1']!],
      docsLink: { url: 'https://learn.javascript.ru/event-loop', title: 'Цикл событий — learn.javascript.ru' },
    },

    {
      id: 'micro-vs-macro',
      title: 'Микрозадачи и макрозадачи',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'Микрозадачи и макрозадачи — две разные очереди с разным приоритетом. Между взятием одной макрозадачи и следующей event loop **полностью** опустошает очередь микрозадач. Это и есть главный источник «магии» порядка вывода.',
        },
        {
          type: 'list',
          content: `**Микрозадачи** (microtasks): \`Promise.then/catch/finally\`, \`queueMicrotask()\`, \`MutationObserver\`, \`await\` (внутри async-функций).
**Макрозадачи** (tasks): \`setTimeout\`, \`setInterval\`, обработчики DOM-событий, message-event, сетевые колбэки, postMessage.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `console.log('1');

setTimeout(() => console.log('macro-1'), 0);

Promise.resolve().then(() => {
  console.log('micro-1');
  // микрозадача, добавленная в текущем чекпоинте,
  // выполнится ДО следующей макрозадачи
  Promise.resolve().then(() => console.log('micro-2'));
});

setTimeout(() => console.log('macro-2'), 0);

console.log('2');

// Вывод: 1 → 2 → micro-1 → micro-2 → macro-1 → macro-2`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Каждый `await` внутри async-функции создаёт **минимум одну** микрозадачу. Код после `await` — это уже не синхронное продолжение, а callback в microtask queue.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `async function foo() {
  console.log('A');
  await Promise.resolve();
  console.log('B'); // микрозадача
}

console.log('C');
foo();
console.log('D');

// C → A → D → B
// foo() печатает A, встречает await, ставит "B" в microtask queue,
// возвращает управление; D — синхронно; затем microtask checkpoint → B`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Бесконечная цепочка `Promise.resolve().then(...)` способна заблокировать рендер: очередь микрозадач никогда не пустеет, и браузер не доходит до отрисовки кадра. Эффект тот же, что от бесконечного синхронного цикла — страница замерзает.',
        },
      ],
      flashcardIds: ['jsel-f2', 'jsel-f3', 'jsel-f9'],
      checkpoint: [Q['jsel-q2']!, Q['jsel-q4']!],
      docsLink: { url: 'https://learn.javascript.ru/microtask-queue', title: 'Микрозадачи — learn.javascript.ru' },
    },

    {
      id: 'rendering-and-raf',
      title: 'Рендеринг и requestAnimationFrame',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'После каждой макрозадачи и опустошения микрозадач браузер **может** встроить шаг рендеринга. Полный цикл одного кадра выглядит так:',
        },
        {
          type: 'list',
          content: `1. Взять одну макрозадачу из очереди и выполнить её.
2. Опустошить очередь микрозадач (microtask checkpoint).
3. Если пора рисовать кадр — выполнить колбэки \`requestAnimationFrame\`.
4. Пересчитать стили (style), макет (layout), отрисовать пиксели (paint).
5. Передать кадр в композитор.
6. Перейти к следующей итерации.`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            '`requestAnimationFrame(callback)` запланирует callback на ближайший кадр (обычно 16.6 мс для 60 Гц). Внутри callback аргумент — `DOMHighResTimeStamp`, время начала кадра. Это лучшее место для чтения layout и обновления анимаций.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Анимация через rAF — синхронизирована с кадрами экрана.
function animate(time) {
  const x = (time / 10) % 300;
  // Запись в стиль будет применена при следующем paint.
  el.style.transform = \`translateX(\${x}px)\`;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// Сравните с setTimeout — он не синхронизирован с кадрами,
// часть кадров пропускается, появляется jank:
// setInterval(() => el.style.left = ... , 16);`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'В фоновых вкладках браузер ставит `requestAnimationFrame` на паузу — анимации останавливаются. Это сделано для экономии батареи. Если нужен фоновый таймер, используйте `setTimeout` или Web Worker.',
        },
        {
          type: 'text',
          content:
            'Длительная задача (long task) > 50 мс блокирует кадр: браузер не успевает к моменту vsync, кадр пропускается, пользователь видит «дёргание». В DevTools такие задачи помечаются красным треугольником в Performance-панели.',
        },
      ],
      flashcardIds: ['jsel-f4', 'jsel-f7'],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/API/window/requestAnimationFrame', title: 'requestAnimationFrame — MDN (ru)' },
      playground: {
        starterCode: `// Предскажите порядок вывода и запустите код.
// Подсказка: queueMicrotask и Promise.then идут в одну очередь
// и выполняются в порядке постановки.

console.log('1');

queueMicrotask(() => console.log('mt-1'));

setTimeout(() => console.log('to-1'), 0);

Promise.resolve().then(() => console.log('p-1'));

queueMicrotask(() => console.log('mt-2'));

console.log('2');`,
        expectedOutput: '1\n2\nmt-1\np-1\nmt-2\nto-1',
        noValidation: true,
        description:
          'Сначала выводится синхронный код (1, 2). Затем microtask checkpoint опустошает очередь в порядке постановки: mt-1, p-1, mt-2. Только после этого выполняется макрозадача setTimeout (to-1).',
      },
    },

    {
      id: 'async-await',
      title: 'async / await под капотом',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            '`async/await` — синтаксический сахар над промисами и микрозадачами. Каждое выражение `await expr` эквивалентно `Promise.resolve(expr).then(continuation)`, где `continuation` — весь оставшийся код функции.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// До await — синхронно. После — микрозадача.
async function load() {
  console.log('A');           // sync
  const x = await fetchData(); // ставит continuation в microtask queue
  console.log('B', x);         // микрозадача
  return x;
}

// Эквивалентно:
function loadEquivalent() {
  console.log('A');
  return Promise.resolve(fetchData()).then((x) => {
    console.log('B', x);
    return x;
  });
}`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '`await` на «уже зарезолвленном» промисе **не** возвращает управление синхронно — он всё равно ставит продолжение в microtask queue. Поэтому даже `await Promise.resolve()` создаёт микрозадачу.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Сколько микрозадач?
async function test() {
  console.log(1);
  await null;           // микрозадача 1: продолжение приостанавливается
  console.log(2);
  await null;           // микрозадача 2
  console.log(3);
}

test();
console.log(4);

// 1 → 4 → 2 → 3
// Каждый await отдаёт управление, синхронный код успевает напечатать 4
// до того, как microtask checkpoint вернёт управление в test().`,
        },
        {
          type: 'text',
          content:
            'Необработанный rejected-promise попадает в глобальный обработчик `window.onunhandledrejection`. Если вы используете `.then()` без `.catch()` или `await` без `try/catch`, ошибка может «пропасть» и проявиться лишь в консоли как UnhandledPromiseRejection.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Глобальный мониторинг забытых rejection.
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled:', event.reason);
  // event.preventDefault() — подавить дефолтный лог в консоль
});`,
        },
      ],
      flashcardIds: ['jsel-f3'],
      docsLink: { url: 'https://learn.javascript.ru/async-await', title: 'async/await — learn.javascript.ru' },
    },

    {
      id: 'jank-and-chunking',
      title: 'Jank, long tasks и батчинг',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'Если синхронный обработчик выполняется дольше ~16 мс, браузер пропускает кадр. Дольше 50 мс — это уже **long task** по терминологии Web Vitals; такие задачи ухудшают INP (Interaction to Next Paint) и видимы в Performance-панели DevTools.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ Блокирует поток на ~3 секунды — UI замёрзнет.
function blockingProcess(items) {
  for (const item of items) {
    heavyTransform(item);
  }
}`,
        },
        {
          type: 'list',
          content: `Стратегии вынести нагрузку из главного потока:
- **Батчинг через \`setTimeout\` / \`queueMicrotask\`** — разбить массив на чанки, между ними отдавать управление event loop.
- **\`requestIdleCallback\`** — браузер сам решит, когда «есть свободное время». Подходит для некритичной работы (аналитика, prefetch).
- **\`requestAnimationFrame\`** — для задач, привязанных к кадрам (анимации, пакетные DOM-чтения).
- **Web Worker** — отдельный поток без доступа к DOM. Идеально для CPU-bound вычислений (парсинг JSON > 5 МБ, шифрование, image-обработка).`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ✅ Чанкование через setTimeout — поток не блокируется.
function processInChunks(items, chunkSize, processor) {
  return new Promise((resolve) => {
    const result = [];
    let i = 0;

    function step() {
      const end = Math.min(i + chunkSize, items.length);
      while (i < end) result.push(processor(items[i++]));

      if (i < items.length) {
        setTimeout(step, 0); // отдаём управление: layout, paint, ввод
      } else {
        resolve(result);
      }
    }

    step();
  });
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Между чанками лучше использовать `setTimeout(fn, 0)`, а не `queueMicrotask`: микрозадачи выполняются **до** рендеринга, поэтому заполнение микрозадач чанками всё равно заморозит paint. Макрозадачи разрешают браузеру нарисовать кадр.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ✅ Современный API: scheduler.yield (Chrome 129+).
// Альтернатива setTimeout(fn, 0) с лучшим приоритетом.
async function processWithYield(items) {
  for (const item of items) {
    process(item);
    if (navigator.scheduler?.yield) await scheduler.yield();
  }
}`,
        },
      ],
      flashcardIds: ['jsel-f6', 'jsel-f8'],
      checkpoint: [Q['jsel-q10']!],
      docsLink: { url: 'https://learn.javascript.ru/event-loop', title: 'Цикл событий — learn.javascript.ru' },
      playground: {
        starterCode: `// Замените блокирующий цикл на чанкование через setTimeout,
// чтобы между батчами могли выполниться микрозадачи и rAF.
// Ожидаемый вывод: "tick" должен появиться МЕЖДУ батчами,
// а не в самом конце.

const result = [];
let tickShown = false;

setTimeout(() => {
  if (!tickShown) console.log('tick');
}, 0);

// Имитация тяжёлого цикла. Замените на чанкование.
for (let i = 0; i < 5; i++) {
  // блокирующий шаг
  for (let k = 0; k < 1e6; k++) {}
  result.push(i);
}
tickShown = true;
console.log('done', result.join(','));`,
        expectedOutput: 'done 0,1,2,3,4',
        description:
          'Учебная задача. Запустите как есть и убедитесь, что "tick" не успевает напечататься до завершения цикла. Затем замените блокирующий for на рекурсивный setTimeout — увидите, что "tick" появляется между шагами.',
      },
    },

    {
      id: 'practical-patterns',
      title: 'Практические паттерны: debounce, throttle, delay',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            '`debounce` и `throttle` — два паттерна для управления частотой вызова обработчиков. Оба построены на замыканиях и таймерах event loop.',
        },
        { type: 'heading', content: 'debounce — ждёт паузу' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Вызовет fn один раз через ms после ПОСЛЕДНЕГО вызова.
function debounce(fn, ms) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

const onSearch = debounce((q) => fetchResults(q), 300);
input.addEventListener('input', (e) => onSearch(e.target.value));
// Пользователь печатает быстро — fetchResults вызовется только после паузы 300мс.`,
        },
        { type: 'heading', content: 'throttle — равномерные вызовы' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Вызовет fn НЕ ЧАЩЕ одного раза в ms.
function throttle(fn, ms) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= ms) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

const onScroll = throttle(updateHeader, 100);
window.addEventListener('scroll', onScroll);
// Скролл — поток событий 60+ раз в секунду; throttle ограничит до 10/сек.`,
        },
        { type: 'heading', content: 'delay — обёртка setTimeout в Promise' },
        {
          type: 'code',
          language: 'javascript',
          content: `const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await delay(500);
console.log('после паузы');`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Эвристика выбора: **debounce** — когда важен результат только последнего события (поиск, валидация формы). **throttle** — когда нужен поток событий с гарантированным интервалом (скролл, mouse move, resize). Для критичного UI (drag-and-drop) часто используют `requestAnimationFrame` вместо throttle.',
        },
      ],
      flashcardIds: ['jsel-f5'],
      docsLink: { url: 'https://learn.javascript.ru/event-loop', title: 'Цикл событий — learn.javascript.ru' },
      playground: {
        starterCode: `// Реализуйте debounce так, чтобы тест прошёл.
// fn должна быть вызвана ровно ОДИН раз с последними аргументами.

function debounce(fn, ms) {
  // ваш код
}

let count = 0;
let lastArg;
const wrapped = debounce((x) => { count++; lastArg = x; }, 30);

wrapped('a');
wrapped('b');
wrapped('c');

setTimeout(() => {
  console.log(count, lastArg); // ожидаем: 1 c
}, 100);`,
        expectedOutput: '1 c',
        description:
          'Классическая задача с собеседований. Используйте clearTimeout перед установкой нового таймера и сохраняйте taймер в переменной через замыкание.',
      },
    },
  ],

  // Все вопросы из старого квиза, кроме тех, что ушли в checkpoint.
  finalQuiz: jsEventLoopQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  // Реюзаем существующие карточки и добавляем три новых.
  flashcards: [...jsEventLoopFlashcards.cards, ...extraFlashcards],

  cheatsheet: `### Шпаргалка по Event Loop в браузере

- JavaScript однопоточный: один call stack, один поток на JS + рендер.
- Web APIs (\`setTimeout\`, \`fetch\`, DOM) — выполняются вне стека и кладут колбэки в очереди.
- Порядок: **синхронный код → все микрозадачи → одна макрозадача → все микрозадачи → rAF → style/layout/paint → следующая итерация**.
- Микрозадачи: \`Promise.then\`, \`queueMicrotask\`, \`MutationObserver\`, \`await\`.
- Макрозадачи: \`setTimeout\`, \`setInterval\`, обработчики DOM-событий, message-event.
- \`setTimeout(fn, 0)\` — НЕ немедленно: после микрозадач + минимум ~4 мс для вложенных.
- \`requestAnimationFrame\` — между microtask checkpoint и paint, синхронизирован с vsync.
- Бесконечная цепочка микрозадач блокирует paint так же, как long task.
- Long task > 50 мс → деградация INP. Решения: батчинг через \`setTimeout\` / \`scheduler.yield\`, Web Worker.
- \`debounce\` — выполняет после паузы; \`throttle\` — не чаще раза в интервал.`,

  interviewQA: [
    {
      id: 'jsel-iq1',
      question: 'Опишите работу event loop в браузере: стек, куча, очереди, шаги рендеринга.',
      shortAnswer:
        'Event loop — алгоритм, который при пустом call stack берёт одну макрозадачу из task queue, выполняет её, опустошает microtask queue, при необходимости запускает rAF и шаг рендеринга, и переходит к следующей итерации. Web APIs выполняются вне главного потока и кладут колбэки в очереди.',
      fullAnswer: `Главный поток JavaScript состоит из нескольких структур:

- **Call Stack** (стек вызовов) — список активных функций. Пока не пуст, никакие новые задачи не берутся.
- **Heap** — куча, где живут объекты, замыкания, массивы.
- **Web APIs** — таймеры, fetch, DOM-события, observers; реализованы в C++ внутри браузера.
- **Task Queue** (она же callback queue) — макрозадачи: setTimeout, обработчики DOM, message-event, сетевые ответы.
- **Microtask Queue** — микрозадачи: Promise.then, queueMicrotask, MutationObserver.

Алгоритм event loop на каждой итерации:

1. Если call stack пуст — взять **одну** макрозадачу из task queue, положить в стек, выполнить до конца (run-to-completion).
2. Опустошить **всю** microtask queue, включая микрозадачи, добавленные во время выполнения.
3. Если пора рисовать кадр — вызвать колбэки \`requestAnimationFrame\`, пересчитать стили, layout, paint.
4. Перейти к следующей итерации.

Из этого вытекает ключевое правило порядка: после каждой макрозадачи **полностью** опустошается очередь микрозадач — поэтому \`Promise.then\` всегда выполняется раньше \`setTimeout(fn, 0)\`, даже если оба зарегистрированы рядом.`,
      followUps: [
        'Что произойдёт, если внутри обработчика setTimeout добавить ещё один setTimeout?',
        'Как event loop в Node.js отличается от браузерного?',
      ],
      relatedChapterId: 'single-thread-stack',
    },
    {
      id: 'jsel-iq2',
      question: 'Чем микрозадача отличается от макрозадачи? Назовите примеры каждой.',
      shortAnswer:
        'Микрозадачи имеют приоритет: вся очередь микрозадач опустошается между макрозадачами и шагом рендеринга. Микрозадачи — Promise.then/catch/finally, queueMicrotask, MutationObserver, продолжения после await. Макрозадачи — setTimeout, setInterval, обработчики DOM, message-event.',
      fullAnswer: `**Микрозадачи** и **макрозадачи** — две разные очереди event loop с разным приоритетом.

После каждой макрозадачи браузер выполняет **microtask checkpoint**: полностью опустошает очередь микрозадач, включая те, что добавлены в процессе. Только после этого идёт следующая макрозадача и шаг рендеринга. Это гарантирует, что цепочка \`Promise.then().then().then()\` выполнится до того, как успеет произойти \`setTimeout\` или paint.

**Микрозадачи**:
- \`Promise.prototype.then / catch / finally\`
- \`queueMicrotask(fn)\` — низкоуровневое API без аллокации Promise
- \`MutationObserver\` колбэки
- Продолжение после \`await\` в async-функциях

**Макрозадачи**:
- \`setTimeout\`, \`setInterval\`
- Обработчики DOM-событий: \`click\`, \`input\`, \`scroll\`
- \`MessageEvent\` — \`postMessage\`, \`BroadcastChannel\`, \`MessageChannel\`
- Сетевые колбэки: загрузка скриптов, \`XMLHttpRequest\`
- I/O: \`FileReader\`, \`navigator.geolocation\`

Практический вывод: если нужно «отложить до следующего тика», но сохранить приоритет над таймерами — \`queueMicrotask\` или \`Promise.resolve().then(...)\`. Если нужно отдать управление так, чтобы успел произойти paint — \`setTimeout(fn, 0)\` или \`requestAnimationFrame\`.`,
      followUps: [
        'Почему MutationObserver — микрозадача, а не макрозадача?',
        'Может ли бесконечная цепочка микрозадач полностью заморозить рендеринг?',
      ],
      relatedChapterId: 'micro-vs-macro',
    },
    {
      id: 'jsel-iq3',
      question: 'В каком порядке выполнятся setTimeout(fn, 0) и Promise.resolve().then(fn)? Объясните почему.',
      shortAnswer:
        'Promise.resolve().then() выполнится первым, setTimeout(fn, 0) — вторым. Причина: Promise.then ставит callback в microtask queue, и она опустошается сразу после текущего синхронного кода, до взятия следующей макрозадачи (которой и является setTimeout).',
      fullAnswer: `Рассмотрим код:

\`\`\`js
console.log('1');
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
console.log('2');
\`\`\`

Вывод: \`1 → 2 → promise → timeout\`.

Пошагово:
1. \`console.log('1')\` — синхронно, сразу в стек.
2. \`setTimeout(fn, 0)\` — браузер регистрирует таймер в Web API. После 0 мс callback кладётся в **task queue** (макрозадачи).
3. \`Promise.resolve().then(fn)\` — Promise уже разрешён, поэтому callback кладётся в **microtask queue** немедленно.
4. \`console.log('2')\` — синхронно.
5. Синхронный код закончился. Event loop запускает **microtask checkpoint**: опустошает microtask queue → выводит "promise".
6. Microtask queue пуста — event loop берёт следующую макрозадачу (setTimeout-callback) → выводит "timeout".

Дополнительно: \`setTimeout(fn, 0)\` имеет минимальную фактическую задержку. По спецификации HTML, для пятого и более глубокого вложенного вызова минимум составляет 4 мс. Но даже без этого ограничения порядок никогда не будет другим — микрозадачи всегда раньше макрозадач.`,
      followUps: [
        'А что выведется, если поменять порядок строк (сначала Promise, потом setTimeout)?',
        'Чем queueMicrotask отличается от Promise.resolve().then в этом примере?',
      ],
      relatedChapterId: 'micro-vs-macro',
    },
    {
      id: 'jsel-iq4',
      question: 'Что произойдёт, если внутри Promise.then бесконечно резолвить новые промисы?',
      shortAnswer:
        'Очередь микрозадач никогда не опустеет. Браузер не сможет ни взять новую макрозадачу, ни выполнить rAF, ни нарисовать кадр — страница «зависнет». Это та же проблема, что и бесконечный синхронный цикл, только в асинхронной обёртке.',
      fullAnswer: `Microtask queue опустошается **полностью** перед переходом к следующей макрозадаче и шагу рендеринга. Если каждый колбэк микрозадачи добавляет в очередь новый — она никогда не пуста.

\`\`\`js
function recursive() {
  Promise.resolve().then(recursive);
}
recursive();

// После этого:
// - setTimeout не сработает
// - DOM-события не обрабатываются
// - requestAnimationFrame не вызывается
// - paint не происходит
// Страница полностью «висит».
\`\`\`

Симптомы в реальном UI:
- кнопки перестают реагировать на клики (клики становятся макрозадачами в task queue, но к ней не доходим);
- анимации замирают;
- профайлер DevTools показывает один сплошной long task на весь главный поток.

Защитные меры:
- ограничивать глубину рекурсии счётчиком и переключаться на \`setTimeout\` или \`scheduler.yield\` после N итераций;
- мониторить INP / long-tasks через \`PerformanceObserver({ type: 'longtask' })\`;
- избегать \`forEach + async\` в коде, который может создать длинную цепочку \`await\` без выхода в макрозадачу.

Тот же эффект может вызвать и обычный синхронный долгий цикл — он держит call stack непустым и не пускает event loop к очередям. Решение и там, и там одно: разбить работу на чанки и отдавать управление через макрозадачи.`,
      followUps: [
        'Как обнаружить такую проблему в production?',
        'Чем отличается долгий цикл for от бесконечной цепочки микрозадач с точки зрения event loop?',
      ],
      relatedChapterId: 'micro-vs-macro',
    },
    {
      id: 'jsel-iq5',
      question: 'Как requestAnimationFrame встраивается в event loop?',
      shortAnswer:
        'rAF — отдельная очередь callback-ов, которая обрабатывается между microtask checkpoint и шагом paint. Браузер вызывает rAF callback один раз перед очередным repaint, обычно с частотой экрана. В фоновых вкладках rAF приостанавливается.',
      fullAnswer: `На каждой итерации event loop, **если** браузер решает нарисовать кадр (обычно при наступлении vsync, ~16.6 мс при 60 Гц), выполняется следующая последовательность:

1. Берётся одна макрозадача из task queue.
2. Опустошается microtask queue.
3. Если кадр рисуется — вызываются все запланированные \`requestAnimationFrame\` колбэки в порядке регистрации. Им передаётся \`DOMHighResTimeStamp\` — время начала кадра.
4. Пересчитывается style → layout → paint.
5. Кадр передаётся в композитор и на экран.

Особенности \`requestAnimationFrame\`:
- **Один раз**. Запланированный rAF выполнится строго один раз. Для непрерывной анимации callback должен сам себя перепланировать: \`requestAnimationFrame(animate)\`.
- **Синхронизация с экраном**. На 60 Гц мониторе rAF вызывается ~60 раз/сек, на 120 Гц — ~120 раз/сек. \`setTimeout(fn, 16)\` такой синхронизации не даёт.
- **Пауза в фоновых вкладках**. Когда вкладка не активна, браузер прекращает вызывать rAF (обычно сваливая на ~1 раз/сек) — экономит CPU и батарею.
- **Лучшее место для чтения layout**. Внутри rAF \`getBoundingClientRect()\` и подобные не вызывают force reflow, потому что layout уже актуален.
- **Запись в DOM**. Изменения стилей внутри rAF попадут в текущий paint без лишнего layout-пинга.

Антипаттерн — делать в rAF тяжёлую CPU-работу: она блокирует кадр и приводит к dropped frame. Для долгих задач — \`requestIdleCallback\` или Web Worker.`,
      followUps: [
        'Чем requestIdleCallback отличается от rAF?',
        'Почему чтение getBoundingClientRect внутри rAF дешевле, чем вне?',
      ],
      relatedChapterId: 'rendering-and-raf',
    },
    {
      id: 'jsel-iq6',
      question: 'Что такое long task, как его обнаружить и как с ним бороться?',
      shortAnswer:
        'Long task — задача длиннее 50 мс, блокирующая главный поток. Обнаруживается через PerformanceObserver({ type: "longtask" }) или Performance-панель DevTools. Решения: батчинг через setTimeout/scheduler.yield, Web Worker для CPU-bound, кэширование результата.',
      fullAnswer: `Long task — это любая работа на главном потоке, которая занимает больше 50 мс. Метрика введена в W3C Long Tasks API; она напрямую влияет на INP (Interaction to Next Paint) — один из Core Web Vitals.

Симптомы long task для пользователя:
- клик «отзывается» с задержкой;
- ввод в поле «лагает»;
- анимации пропускают кадры (jank);
- скролл «дёргается».

Как обнаружить:

\`\`\`js
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.warn('long task', entry.duration, 'ms', entry.attribution);
  }
});
observer.observe({ type: 'longtask', buffered: true });
\`\`\`

В Chrome DevTools panel Performance long-tasks подсвечиваются красным треугольником. Метрика INP видна в Lighthouse и Web Vitals.

Стратегии устранения:

1. **Батчинг через \`setTimeout(fn, 0)\`**. Разбить массив на чанки, между чанками отдавать управление event loop. Подходит для умеренной нагрузки и map/filter/reduce.
2. **\`scheduler.yield()\`** (Chrome 129+). Современная замена \`setTimeout(fn, 0)\` с правильным приоритетом — продолжение остаётся «горячим».
3. **\`requestIdleCallback\`** для некритичной работы (аналитика, prefetch).
4. **Web Worker** для CPU-bound (парсинг JSON > 5 МБ, шифрование, image-обработка). У worker нет доступа к DOM, но есть \`OffscreenCanvas\` для графики.
5. **Кэширование и мемоизация**, чтобы вообще не считать дважды.
6. **Виртуализация списков** — рендерить только видимые элементы (react-window, virtual scroll).

В критичных местах — отслеживать INP и long-tasks через RUM (Real User Monitoring) и алертить при деградации.`,
      followUps: [
        'Почему именно 50 мс выбрано порогом long task?',
        'Когда лучше использовать Web Worker, а когда хватит батчинга?',
      ],
      relatedChapterId: 'jank-and-chunking',
    },
    {
      id: 'jsel-iq7',
      question: 'Что делает await под капотом? Эквивалентен ли `await x` коду `x.then(...)`?',
      shortAnswer:
        'await — синтаксический сахар над Promise.then: он приостанавливает async-функцию, ставит её продолжение в microtask queue и возвращает управление вызывающему коду. Каждый await создаёт минимум одну микрозадачу, даже если промис уже разрешён.',
      fullAnswer: `Запись \`const x = await expr\` примерно эквивалентна:

\`\`\`js
return Promise.resolve(expr).then((value) => {
  const x = value;
  /* весь оставшийся код функции */
});
\`\`\`

Ключевые моменты:

1. **async-функция всегда возвращает Promise.** Если в теле \`return value\`, возвращается \`Promise.resolve(value)\`. Если \`throw err\` — \`Promise.reject(err)\`.

2. **await ставит продолжение в microtask queue.** Даже \`await null\` или \`await Promise.resolve()\` создаёт микрозадачу. Поэтому код после await — это уже не синхронное продолжение.

3. **Управление возвращается вызывающему коду.** На await функция «приостанавливается» и оставляет стек. Это ключевое отличие от \`Promise.resolve().then(...)\`: с \`then\` вы сами управляете цепочкой, а \`await\` делает за вас «развёртывание» в плоский синтаксис.

4. **Несколько await — несколько микрозадач.**

\`\`\`js
async function test() {
  console.log(1);
  await null;            // микрозадача 1
  console.log(2);
  await null;            // микрозадача 2
  console.log(3);
}
test();
console.log(4);
// 1 → 4 → 2 → 3
\`\`\`

5. **try/catch вокруг await эквивалентен .catch().** Любой rejection в \`await\` будет пойман окружающим try/catch.

6. **Параллельность через Promise.all.** \`await fetch(a); await fetch(b);\` — последовательно. \`await Promise.all([fetch(a), fetch(b)])\` — параллельно. Это частый источник лишней латентности на собеседованиях.

В V8 (Chrome, Node.js) с 2019 года применяется оптимизация: для \`await\` на «нативных» промисах создаётся одна микрозадача, а не две. До оптимизации каждый \`await\` стоил две микрозадачи и заметно замедлял async-цепочки.`,
      followUps: [
        'Как изменить последовательные fetch на параллельные одной строкой?',
        'Что произойдёт, если в async-функции выбросить ошибку без try/catch?',
      ],
      relatedChapterId: 'async-await',
    },
  ],

  nextTopics: [
    { slug: 'js-async', reason: 'Promise и async/await — следующий уровень: как строить асинхронные пайплайны без callback hell.' },
    { slug: 'node-event-loop', reason: 'В Node.js event loop устроен иначе — шесть фаз libuv, process.nextTick и setImmediate.' },
  ],

  related: [
    { kind: 'bug-hunt', id: 'bh-03', label: 'Bug hunt: debounce без clearTimeout' },
    { kind: 'bug-hunt', id: 'bh-04', label: 'Bug hunt: потеря this в setInterval' },
  ],
};
