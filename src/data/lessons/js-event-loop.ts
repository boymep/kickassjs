import type { Lesson } from '../../types/lesson';
import { jsEventLoopQuiz } from '../quizzes/js-event-loop';

const Q = Object.fromEntries(jsEventLoopQuiz.questions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set(['jsel-q1', 'jsel-q2', 'jsel-q4', 'jsel-q10']);

export const jsEventLoopLesson: Lesson = {
  topicId: 'js-event-loop',

  intro: {
    whyItMatters: `JavaScript в браузере выполняется в одном потоке: тот же поток отвечает за код, обработку ввода, расчёт макета и отрисовку кадра. Если поток занят синхронной работой, страница перестаёт реагировать — пользователь видит «зависание» (jank).

Event loop — алгоритм, который позволяет работать с асинхронностью без блокировок: тяжёлые операции (\`setTimeout\`, \`fetch\`, обработчики DOM) выполняются вне главного потока, а их коллбэки складываются в очереди. Понимание порядка выполнения позволяет предсказывать, когда сработает \`Promise.then\`, почему \`setTimeout(fn, 0)\` не означает «немедленно» и почему длинный цикл замораживает интерфейс. Без этого знания поведение асинхронного кода в JS выглядит непредсказуемым.`,
    estimatedMinutes: 32,
    interviewAngle:
      'На собеседовании спрашивают про три вещи. Первое — порядок вывода в коде с миксом \`setTimeout\` / \`Promise\` / \`queueMicrotask\`. Второе — разница между микро- и макрозадачами и тем, когда происходит рендер. Третье — умение объяснить причины jank в реальном UI-коде. Эти три блока — обязательный минимум для middle-уровня.',
    prerequisites: [{ slug: 'js-closures', title: 'Замыкания' }],
  },

  chapters: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'single-thread-stack',
      title: 'Однопоточность, стек вызовов и Web APIs',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'JavaScript выполняется в одном потоке — в каждый момент времени работает ровно одна функция. Но браузер не зависает, пока ждёт ответ сервера или таймер. Это обеспечивает event loop: тяжёлые операции уходят в Web APIs, их коллбэки кладутся в очередь, а когда стек вызовов пуст, event loop достаёт следующий коллбэк.',
        },
        {
          type: 'list',
          content: `Call Stack — список активных функций. Каждый вызов добавляется сверху, завершённый удаляется.
Heap — куча, где живут объекты, замыкания, массивы.
Web APIs — таймеры, \`fetch\`, DOM-события, observers. Реализованы в C++ внутри браузера.
Task Queue (макрозадачи) — коллбэки таймеров, обработчиков DOM, сетевых ответов.
Microtask Queue (микрозадачи) — \`Promise.then\`, \`queueMicrotask\`, \`MutationObserver\`.`,
        },
        {
          type: 'visualization',
          content: '',
          vizId: 'event-loop',
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

// Start → End → Promise → Timeout`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Действует правило run-to-completion: пока текущая задача не завершилась полностью, браузер не возьмёт ничего из очередей. \`setTimeout(fn, 0)\` гарантированно выполнится после всего синхронного кода, идущего за ним.',
        },
        {
          type: 'text',
          content:
            '\`setTimeout(fn, 0)\` не означает «немедленно». Браузер регистрирует таймер в Web APIs, после 0 миллисекунд кладёт коллбэк в очередь макрозадач, и event loop возьмёт его только после очистки стека и опустошения очереди микрозадач. Таким образом, таймер с нулевой задержкой означает «как только поток освободится», а не «выполнить прямо сейчас».',
        },
      ],
      checkpoint: [Q['jsel-q1']!, {
        type: 'ordering',
        id: 'jsel-ord1',
        description: 'Расставьте фазы одной итерации event loop в правильном порядке',
        items: [
          'Call stack выполняет синхронный код',
          'Опустошается microtask queue: Promise.then, queueMicrotask',
          'Шаг рендеринга: rAF, style, layout, paint',
          'Из macrotask queue берётся одна задача (setTimeout, событие DOM)',
        ],
        explanation:
          'Сначала весь синхронный код. Затем — все микрозадачи, включая добавленные во время выполнения. Затем — один шаг рендеринга. Затем — одна макрозадача, и цикл повторяется.',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'micro-vs-macro',
      title: 'Микрозадачи и макрозадачи',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'У микро- и макрозадач разный приоритет. После каждой макрозадачи браузер выполняет microtask checkpoint — полностью опустошает очередь микрозадач, включая те, что были добавлены во время её выполнения. Только потом идёт следующая макрозадача и шаг рендеринга.',
        },
        {
          type: 'list',
          content: `Микрозадачи: \`Promise.then\` / \`catch\` / \`finally\`, \`queueMicrotask\`, \`MutationObserver\`, продолжение после \`await\` в async-функциях.
Макрозадачи: \`setTimeout\`, \`setInterval\`, обработчики DOM-событий, \`message\`-event, сетевые коллбэки, \`postMessage\`.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `console.log('1');

setTimeout(() => console.log('macro-1'), 0);

Promise.resolve().then(() => {
  console.log('micro-1');
  // микрозадача, добавленная сейчас,
  // выполнится ДО следующей макрозадачи
  Promise.resolve().then(() => console.log('micro-2'));
});

setTimeout(() => console.log('macro-2'), 0);

console.log('2');

// 1 → 2 → micro-1 → micro-2 → macro-1 → macro-2`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Каждый \`await\` внутри async-функции создаёт минимум одну микрозадачу. Код после \`await\` — это уже не синхронное продолжение, а коллбэк в microtask queue.',
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

// C → A → D → B`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Бесконечная цепочка \`Promise.resolve().then(...)\` способна заблокировать рендер: очередь микрозадач никогда не пустеет, и браузер не доходит до отрисовки кадра. Эффект тот же, что от бесконечного синхронного цикла.',
        },
      ],
      checkpoint: [Q['jsel-q2']!, Q['jsel-q4']!, {
        type: 'multi-select',
        id: 'jsel-ms1',
        description: 'Что попадает в microtask queue?',
        options: [
          'Promise.then() callback',
          'setTimeout() callback',
          'queueMicrotask() callback',
          'MutationObserver callback',
          'setInterval() callback',
        ],
        correctIndices: [0, 2, 3],
        explanation:
          'В microtask queue: Promise.then / catch / finally, queueMicrotask, MutationObserver. В macrotask: setTimeout, setInterval, I/O, обработчики DOM-событий.',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'rendering-and-raf',
      title: 'Рендеринг и requestAnimationFrame',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            '\`requestAnimationFrame\` встраивается в цикл рендеринга: на 60 Гц мониторе коллбэк выполняется перед каждой отрисовкой, то есть примерно раз в 16.6 мс. \`setTimeout(fn, 16)\` такой гарантии не даёт — может сработать рассинхронизированно с экраном, и анимация будет дёргаться.',
        },
        {
          type: 'list',
          content: `Цикл одного кадра в браузере:
1. Взять одну макрозадачу из очереди и выполнить её.
2. Опустошить очередь микрозадач (microtask checkpoint).
3. Если пора рисовать кадр — выполнить коллбэки \`requestAnimationFrame\`.
4. Пересчитать стили, макет (layout), отрисовать пиксели (paint).
5. Передать кадр в композитор.
6. Перейти к следующей итерации.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Анимация через rAF — синхронизирована с кадрами экрана.
function animate(time) {
  const x = (time / 10) % 300;
  el.style.transform = \`translateX(\${x}px)\`;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'В фоновых вкладках браузер ставит \`requestAnimationFrame\` на паузу — анимации останавливаются. Это нужно для экономии батареи. Для фонового таймера используется \`setTimeout\` или Web Worker.',
        },
        {
          type: 'text',
          content:
            'Задача дольше 50 мс блокирует кадр: браузер не успевает к моменту vsync, кадр пропускается, появляется заметное «дёргание». В DevTools такие задачи помечаются в Performance-панели — это первое место для диагностики проблем с производительностью UI.',
        },
      ],
      playground: {
        starterCode: `// Предскажите порядок вывода и запустите код.

console.log('1');

queueMicrotask(() => console.log('mt-1'));

setTimeout(() => console.log('to-1'), 0);

Promise.resolve().then(() => console.log('p-1'));

queueMicrotask(() => console.log('mt-2'));

console.log('2');`,
        expectedOutput: '1\n2\nmt-1\np-1\nmt-2\nto-1',
        noValidation: true,
        description:
          'Сначала синхронный код (1, 2). Затем microtask checkpoint опустошает очередь в порядке постановки: mt-1, p-1, mt-2. Только после этого — макрозадача setTimeout (to-1).',
      },
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'async-await',
      title: 'async / await под капотом',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            '\`async\` / \`await\` — синтаксический сахар над промисами и микрозадачами. Каждый \`await expr\` эквивалентен \`Promise.resolve(expr).then(continuation)\`. Функция «засыпает» в точке \`await\`, возвращая управление event loop, а продолжение ставится в очередь микрозадач.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `async function load() {
  console.log('A');              // sync
  const x = await fetchData();   // continuation → microtask
  console.log('B', x);           // микрозадача
  return x;
}

// Эквивалент:
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
            '\`await\` на уже разрешённом промисе не возвращает управление синхронно — он всё равно ставит продолжение в microtask queue. Даже \`await Promise.resolve()\` создаёт микрозадачу.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `async function test() {
  console.log(1);
  await null;           // микрозадача 1
  console.log(2);
  await null;           // микрозадача 2
  console.log(3);
}

test();
console.log(4);

// 1 → 4 → 2 → 3`,
        },
        {
          type: 'text',
          content:
            'Необработанный rejected-promise попадает в глобальный обработчик \`unhandledrejection\`. Если используется \`.then\` без \`.catch\` или \`await\` без \`try/catch\`, ошибка может «пропасть» и проявиться только в консоли как UnhandledPromiseRejection. В Node.js до 15-й версии такие отказы только логировались и не останавливали процесс — отсюда и репутация «исчезающих» ошибок в промисах.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'jank-and-chunking',
      title: 'Подвисания, long tasks и батчинг',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Jank — видимые заминки интерфейса. Причина одна: главный поток занят слишком долго. На 60 Гц мониторе на каждый кадр приходится 16.6 мс. Задача дольше 50 мс — это long task по Web Vitals: ухудшает INP и видна в Performance-панели DevTools.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Блокирует поток на ~3 секунды — UI замёрзнет.
function blockingProcess(items) {
  for (const item of items) {
    heavyTransform(item);
  }
}`,
        },
        {
          type: 'list',
          content: `Способы вынести нагрузку из главного потока:
Чанкование через \`setTimeout\` или \`scheduler.yield\` — разбить массив на части, между ними отдавать управление event loop.
\`requestIdleCallback\` — браузер сам решит, когда есть свободное время. Подходит для некритичной работы (аналитика, prefetch).
\`requestAnimationFrame\` — для задач, привязанных к кадрам (анимации, пакетные DOM-чтения).
Web Worker — отдельный поток без доступа к DOM. Подходит для CPU-bound вычислений (парсинг больших JSON, шифрование, обработка изображений).`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Чанкование через setTimeout — поток не блокируется.
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
            'Между чанками лучше \`setTimeout(fn, 0)\`, а не \`queueMicrotask\`: микрозадачи выполняются до рендеринга, поэтому чанкование через них всё равно заморозит paint. Макрозадачи разрешают браузеру нарисовать кадр.',
        },
      ],
      checkpoint: [Q['jsel-q10']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'practical-patterns',
      title: 'Практические паттерны: debounce, throttle',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            '\`debounce\` и \`throttle\` — два паттерна для контроля частоты вызова функций. Оба построены на замыканиях и таймерах event loop. На собеседовании часто просят реализовать их с нуля — это показывает понимание замыканий и асинхронности в одной задаче.',
        },
        { type: 'heading', content: 'debounce — ждёт паузу' },
        {
          type: 'text',
          content:
            '\`debounce(fn, ms)\` вызывает \`fn\` только если после последнего вызова прошло хотя бы \`ms\` миллисекунд тишины. Подходит для поиска и валидации — где важен результат только последнего ввода.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function debounce(fn, ms) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

const onSearch = debounce((q) => fetchResults(q), 300);
input.addEventListener('input', (e) => onSearch(e.target.value));`,
        },
        { type: 'heading', content: 'throttle — равномерные вызовы' },
        {
          type: 'text',
          content:
            '\`throttle(fn, ms)\` вызывает \`fn\` не чаще одного раза в \`ms\` миллисекунд. Подходит для скролла и resize — где нужен поток событий с гарантированным интервалом.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function throttle(fn, ms) {
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
window.addEventListener('scroll', onScroll);`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Выбор: \`debounce\` — когда важен результат только последнего события. \`throttle\` — когда нужен поток событий с гарантированным интервалом. Для критичного UI (drag-and-drop) часто используют \`requestAnimationFrame\` вместо \`throttle\`.',
        },
        { type: 'heading', content: 'delay — пауза через промис' },
        {
          type: 'code',
          language: 'javascript',
          content: `const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await delay(500);
console.log('после паузы');`,
        },
      ],
      playground: {
        starterCode: `// Реализуйте debounce так, чтобы тест прошёл.
// fn должна быть вызвана ровно один раз с последними аргументами.

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
          'Перед каждым новым вызовом сбрасывайте предыдущий таймер через \`clearTimeout\`, новый таймер храните в замыкании.',
      },
    },
  ],

  finalQuiz: jsEventLoopQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  cheatsheet: `### Шпаргалка по Event Loop в браузере

**Главное правило порядка**
- Синхронный код → все микрозадачи → одна макрозадача → все микрозадачи → rAF → style / layout / paint → следующая итерация
- Микрозадачи опустошаются полностью, включая добавленные во время выполнения
- Макрозадача берётся ровно одна за итерацию

**Что куда попадает**
- Микрозадачи: \`Promise.then\` / \`catch\` / \`finally\`, \`queueMicrotask\`, \`MutationObserver\`, продолжение после \`await\`
- Макрозадачи: \`setTimeout\`, \`setInterval\`, обработчики DOM-событий, message-event, сетевые коллбэки

**setTimeout(fn, 0)**
- Не значит «немедленно» — это макрозадача
- Минимальная задержка для пятого вложенного вызова — 4 мс по спецификации HTML

**requestAnimationFrame**
- Выполняется между microtask checkpoint и paint
- Синхронизирован с vsync (обычно 60 Гц)
- В фоновых вкладках поставлен на паузу

**async / await**
- До первого \`await\` функция выполняется синхронно
- Каждый \`await\` создаёт минимум одну микрозадачу
- \`await Promise.resolve()\` тоже создаёт микрозадачу

**Long tasks и jank**
- Задача дольше 50 мс — long task, ухудшает INP
- Чанкование через \`setTimeout\` или \`scheduler.yield\`
- CPU-bound — в Web Worker
- \`queueMicrotask\` для чанкования **не подходит** — paint между чанками не произойдёт

**debounce vs throttle**
- \`debounce\` — выполняет после паузы (поиск, валидация)
- \`throttle\` — не чаще раза в интервал (скролл, mouse move)`,

  nextTopics: [
    {
      slug: 'js-async',
      reason:
        'После event loop логично разобрать промисы и async / await подробнее: \`Promise.all\`, обработку ошибок, паттерны конкурентности.',
    },
    {
      slug: 'js-dom',
      reason:
        'Большинство макрозадач в браузере — это обработчики DOM-событий. После event loop полезно увидеть, как браузер передаёт события в коллбэки.',
    },
  ],
};
