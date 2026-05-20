import type { Lesson } from '../../types/lesson';
import { nodeEventLoopQuiz } from '../quizzes/node-event-loop';
import { nodeEventLoopFlashcards } from '../flashcards/node-event-loop';

// Index quiz questions for reuse as checkpoints.
const Q = Object.fromEntries(nodeEventLoopQuiz.questions.map((q) => [q.id, q]));

// Questions used as in-chapter checkpoints (must NOT appear in finalQuiz).
const CHECKPOINT_IDS = new Set(['nodel-q1', 'nodel-q4', 'nodel-q6', 'nodel-q9']);

const extraFlashcards = [
  {
    id: 'nodel-f7',
    question: 'Что такое UV_THREADPOOL_SIZE и какие операции его используют?',
    answer:
      'UV_THREADPOOL_SIZE — переменная окружения, задающая размер пула потоков libuv. По умолчанию равна 4. В этом пуле выполняются операции, которые ОС не умеет делать асинхронно: файловая система (большинство fs.*), DNS-резолвинг через getaddrinfo, crypto.pbkdf2, zlib.',
    keyPoints: [
      'Пул по умолчанию: 4 потока, максимум 1024',
      'Используется для: fs (кроме watch/FSEvents), dns.lookup, crypto.pbkdf2/scrypt, zlib',
      'Сетевые операции (TCP/UDP/HTTP) не используют пул — они работают через epoll/kqueue/IOCP',
      'Под нагрузкой узкое место: тяжёлый crypto или fs может «съесть» все 4 потока, и остальные операции встают в очередь',
      'Увеличение: UV_THREADPOOL_SIZE=16 node app.js',
    ],
  },
  {
    id: 'nodel-f8',
    question: 'EventEmitter.emit — синхронный или асинхронный? Какие из этого следуют практические выводы?',
    answer:
      'emit полностью синхронный: на стек кладётся вызов emit, далее последовательно выполняются все обработчики, и только после этого управление возвращается в место вызова. Асинхронной семантики у EventEmitter нет.',
    keyPoints: [
      'Все обработчики выполняются в текущем call stack — исключение в одном из них прерывает остальных',
      'Если эмитировать событие из конструктора, подписчики, добавленные снаружи, ещё не успеют подписаться',
      'Для отложенного emit используют queueMicrotask или setImmediate внутри обработчика',
      'Событие "error" без подписчика выбрасывает throw — крашит процесс',
    ],
  },
  {
    id: 'nodel-f10',
    question: 'Чем поведение setTimeout(fn, 0) и setImmediate(fn) различается внутри I/O callback?',
    answer:
      'Внутри I/O callback (poll-фаза) setImmediate всегда выполняется раньше setTimeout(fn, 0). Это потому, что check-фаза идёт сразу за poll, а timers — только в следующей итерации цикла. Вне I/O порядок не гарантирован и зависит от планировщика ОС.',
    keyPoints: [
      'Poll → check → close → (next loop) timers',
      'Внутри fs/net/http callback: setImmediate всегда первый',
      'Вне I/O (на старте процесса) — порядок плавающий',
      'Если порядок важен, используйте setImmediate в коде, который точно вызывается из I/O',
    ],
    code: `fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
  // immediate → timeout (всегда)
});`,
  },
  {
    id: 'nodel-f9',
    question: 'Как корректно отменять долгую асинхронную операцию через AbortController?',
    answer:
      'AbortController создаёт сигнал, который можно передать в fetch, fs.promises, setTimeout (Node 17+) и пользовательские функции. Вызов controller.abort() триггерит событие "abort" на сигнале и отменяет операцию с DOMException AbortError.',
    keyPoints: [
      'controller.signal передаётся вторым аргументом в API',
      'Поддерживается в fetch, fs.promises.readFile, http.request, setTimeout/setImmediate (Node 17+)',
      'Внутри пользовательской функции: signal.addEventListener("abort", cleanup) или signal.throwIfAborted()',
      'AbortError — это DOMException, проверка: err.name === "AbortError"',
      'Полезно для таймаутов, отмены пользовательских действий, кооперативной отмены пайплайнов',
    ],
    code: `const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 5000);

try {
  const res = await fetch(url, { signal: controller.signal });
  clearTimeout(timer);
  return await res.json();
} catch (err) {
  if (err.name === 'AbortError') return null;
  throw err;
}`,
  },
];

export const nodeEventLoopLesson: Lesson = {
  topicId: 'node-event-loop',

  intro: {
    whyItMatters: `Node.js — однопоточная среда исполнения JavaScript, которая при этом обслуживает тысячи одновременных соединений. Этот парадокс держится на одном механизме — event loop, реализованном в библиотеке **libuv**. В отличие от браузера, где спецификация HTML описывает абстрактные «task» и «microtask», в Node.js цикл разделён на **шесть явных фаз** с собственными очередями: timers, pending callbacks, idle/prepare, poll, check, close. Между каждой фазой движок проверяет две дополнительные очереди — \`process.nextTick\` и Promise microtasks, причём nextTick имеет приоритет даже над промисами. Понимание этого порядка критично для серверов: одна тяжёлая синхронная операция блокирует всё, рекурсивный nextTick «замораживает» I/O, неправильный setImmediate ломает backpressure стрима. На собеседовании в Node.js-команды эту тему задают почти всегда: «что выведет код с миксом таймеров и промисов», «зачем нужен setImmediate, если есть setTimeout(0)», «как обработать CPU-bound задачу». В этом уроке вы научитесь читать асинхронный код Node.js по фазам цикла, видеть, где образуется starvation, и проектировать серверы, которые не блокируются под нагрузкой.`,
    estimatedMinutes: 40,
    interviewAngle:
      'Senior-интервьюер проверяет три вещи: знаете ли вы шесть фаз libuv и порядок очередей между ними, понимаете ли разницу между process.nextTick, queueMicrotask и setImmediate, и умеете ли диагностировать starvation event loop на конкретных примерах кода.',
    prerequisites: [{ slug: 'js-event-loop', title: 'Event Loop в браузере' }],
  },

  resources: {
    videos: [
      {
        source: 'youtube',
        id: 'PNa9OMajw9w',
        title: 'Everything You Need to Know About Node.js Event Loop — Bert Belder',
        channel: 'node.js',
        language: 'en',
        durationSec: 30 * 60,
        description: 'Каноническая лекция мейнтейнера libuv. Подробно разбирает фазы цикла, ловушки nextTick и backpressure.',
      },
      {
        source: 'youtube',
        id: 'P9csgxBgaZ8',
        title: 'Node\'s Event Loop From the Inside Out — Sam Roberts',
        channel: 'node.js',
        language: 'en',
        durationSec: 35 * 60,
        description: 'Взгляд изнутри libuv: thread pool, poll-фаза, как проектируется сервер, который не блокируется.',
      },
    ],
    links: [
      {
        url: 'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/',
        title: 'The Node.js Event Loop, Timers, and process.nextTick()',
        source: 'nodejs-docs',
        language: 'en',
        note: 'Официальное руководство Node.js. Минимум, который должен прочитать каждый бэкенд-разработчик.',
      },
      {
        url: 'https://docs.libuv.org/en/v1.x/design.html',
        title: 'libuv — Design overview',
        source: 'spec',
        language: 'en',
        note: 'Архитектура самой библиотеки: фазы цикла, thread pool, абстракции poll/timer/idle.',
      },
      {
        url: 'https://nodejs.org/api/worker_threads.html',
        title: 'Worker Threads — официальная документация',
        source: 'nodejs-docs',
        language: 'en',
        note: 'Когда применять worker_threads и как делиться памятью через SharedArrayBuffer.',
      },
      {
        url: 'https://habr.com/ru/companies/ruvds/articles/452200/',
        title: 'Event Loop в Node.js простыми словами — Habr',
        source: 'article',
        language: 'ru',
        note: 'Русскоязычный разбор фаз цикла с диаграммами. Подходит для повторения перед собеседованием.',
      },
      {
        url: 'https://blog.platformatic.dev/the-nodejs-event-loop',
        title: 'The Node.js Event Loop — Platformatic blog',
        source: 'article',
        language: 'en',
        note: 'Современное (2023+) объяснение: что изменилось в обработке timers и microtasks в новых версиях.',
      },
    ],
  },

  chapters: [
    {
      id: 'phases',
      title: 'Шесть фаз libuv',
      estimatedMinutes: 8,
      blocks: [
        {
          type: 'text',
          content:
            'Node.js — однопоточный, но обрабатывает тысячи одновременных запросов за счёт **неблокирующего I/O**. Event loop в Node.js управляется библиотекой **libuv** и состоит из **6 фаз** — в отличие от браузерного event loop. У каждой фазы своя очередь, порядок фиксирован.',
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            '**На собеседовании** обязательно спросят порядок `process.nextTick`, `Promise.then` и `setImmediate` — он неочевидный и часто удивляет.',
        },
        {
          type: 'list',
          content: `1. **timers** — выполняет callback-и, у которых истёк \`setTimeout\`/\`setInterval\`.
2. **pending callbacks** — отложенные системные callback-и (например, ошибки TCP).
3. **idle, prepare** — внутренние нужды libuv, прикладной код сюда не попадает.
4. **poll** — забирает новые I/O события из ядра ОС и выполняет их callback-и. В этой фазе цикл может «уснуть» в ожидании I/O.
5. **check** — выполняет callback-и, запланированные через \`setImmediate\`.
6. **close callbacks** — события закрытия: \`socket.on('close', ...)\`, \`stream.on('close', ...)\`.`,
        },
        { type: 'visualization', content: '', vizId: 'node-event-loop' },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Между **каждой** фазой Node.js полностью опустошает две очереди: сначала `process.nextTick`, затем Promise microtasks. Это значит, что микрозадачи выполняются 6 раз за итерацию цикла, а не один.',
        },
        {
          type: 'text',
          content:
            'Главное практическое следствие: фазы выполняются строго в порядке от 1 до 6. Если вы запланировали `setImmediate` в timers-фазе, он выполнится в этой же итерации (на check-фазе). Если запланировали `setTimeout(fn, 0)` в poll-фазе — он выполнится **в следующей** итерации, потому что timers уже прошла.',
        },
      ],
      flashcardIds: ['nodel-f1'],
      checkpoint: [
        Q['nodel-q1']!,
        Q['nodel-q6']!,
        {
          type: 'ordering',
          id: 'nel-ord1',
          description: 'Расставь фазы event loop Node.js (libuv) в правильном порядке',
          items: [
            'timers: выполняет setTimeout/setInterval callbacks',
            'pending callbacks: I/O ошибки предыдущего цикла',
            'idle/prepare: внутреннее использование libuv',
            'poll: ждёт новые I/O события, выполняет их callbacks',
            'check: выполняет setImmediate() callbacks',
            'close callbacks: \'close\' события сокетов и т.д.',
          ],
          explanation:
            'После каждой фазы проверяется microtask queue (Promise.then, queueMicrotask, process.nextTick). process.nextTick имеет НАИВЫСШИЙ приоритет — выполняется перед другими microtask.',
        },
      ],
      docsLink: { url: 'https://metanit.com/web/nodejs/1.4.php', title: 'Node.js Event Loop — metanit.com' },
      video: {
        source: 'youtube',
        id: 'PNa9OMajw9w',
        title: 'Everything You Need to Know About Node.js Event Loop — Bert Belder',
        channel: 'node.js',
        language: 'en',
        durationSec: 30 * 60,
        description: 'Каноническая лекция мейнтейнера libuv: фазы цикла, ловушки nextTick и backpressure.',
      },
      links: [
        {
          url: 'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/',
          title: 'The Node.js Event Loop, Timers, and process.nextTick()',
          source: 'nodejs-docs',
          language: 'en',
          note: 'Официальное руководство Node.js — минимум, который должен знать каждый Node.js разработчик.',
        },
      ],
    },

    {
      id: 'nexttick-vs-microtask',
      title: 'process.nextTick, microtasks и setImmediate',
      estimatedMinutes: 8,
      blocks: [
        {
          type: 'text',
          content:
            'У Node.js две очереди микрозадач, которых нет в браузере на таком уровне детализации:',
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Если вызывать `process.nextTick()` рекурсивно — event loop никогда не перейдёт к следующей фазе. I/O-события не обработаются. Используй `nextTick` только когда действительно нужен максимальный приоритет, а не для всего подряд.',
        },
        {
          type: 'list',
          content: `- **\`process.nextTick(fn)\`** — выполняется сразу после текущей синхронной операции, **перед любой другой очередью**, включая Promise microtasks. Технически это не часть libuv, а отдельная очередь Node.js, которую интерпретатор опустошает между шагами.
- **Promise microtasks** (\`Promise.then\`, \`queueMicrotask\`, \`await\`) — стандартные ECMAScript-микрозадачи. Опустошаются после nextTick на том же чекпоинте.
- **\`setImmediate(fn)\`** — макрозадача фазы **check**. Выполняется один раз за итерацию цикла, после I/O.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `console.log('1');                                       // sync
process.nextTick(() => console.log('2'));               // nextTick
Promise.resolve().then(() => console.log('3'));         // microtask
setImmediate(() => console.log('4'));                   // check
setTimeout(() => console.log('5'), 0);                  // timers
console.log('6');                                       // sync

// 1 → 6 → 2 → 3 → 5 → 4
// (вариация порядка 5/4 возможна вне I/O — см. ниже)`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Вне I/O-callback порядок `setTimeout(fn, 0)` и `setImmediate(fn)` **не гарантирован** и зависит от того, попал ли cycle в timers-фазу до или после поднятия таймера. Внутри I/O-callback (poll-фаза) `setImmediate` всегда раньше `setTimeout(0)`, потому что check идёт сразу за poll, а timers — только в следующей итерации.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
  // Внутри I/O callback: immediate → timeout (всегда)
});`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Правило выбора: если нужно отложить выполнение «после текущего стека, но до I/O» — используйте `process.nextTick`. Если «после текущей итерации цикла» — `setImmediate`. Если «через N миллисекунд» — `setTimeout`. Они не взаимозаменяемы.',
        },
      ],
      flashcardIds: ['nodel-f2'],
      checkpoint: [
        Q['nodel-q9']!,
        {
          type: 'multi-select',
          id: 'nel-ms1',
          description: 'Что выполняется в microtask queue в Node.js?',
          options: [
            'process.nextTick() callback',
            'Promise.then() callback',
            'setTimeout() callback',
            'queueMicrotask() callback',
            'setImmediate() callback',
          ],
          correctIndices: [0, 1, 3],
          explanation:
            'В Node.js microtask queue: process.nextTick (высший приоритет), Promise callbacks, queueMicrotask. setTimeout и setImmediate — macrotask (фазы timers и check соответственно).',
        },
      ],
      docsLink: { url: 'https://metanit.com/web/nodejs/1.4.php', title: 'Node.js Event Loop — metanit.com' },
      links: [
        {
          url: 'https://habr.com/ru/companies/ruvds/articles/452200/',
          title: 'Event Loop в Node.js простыми словами — Habr',
          source: 'article',
          language: 'ru',
          note: 'Русскоязычный разбор фаз цикла с диаграммами, включая разницу nextTick/setImmediate.',
        },
        {
          url: 'https://blog.platformatic.dev/the-nodejs-event-loop',
          title: 'The Node.js Event Loop — Platformatic blog',
          source: 'article',
          language: 'en',
          note: 'Современное объяснение: как изменилась обработка microtasks в новых версиях Node.js.',
        },
      ],
    },

    {
      id: 'starvation',
      title: 'Starvation: как «заморозить» event loop',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            '**Starvation** — ситуация, когда одна очередь не даёт циклу перейти к следующим фазам. Самый частый случай — рекурсивный `process.nextTick`. I/O, таймеры, входящие запросы — ничего не обрабатывается. Сервер жив, но не отвечает.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Очередь nextTick опустошается ДО перехода к следующей фазе.
// Если она не опустошается — фазы не наступают, I/O не обрабатывается.

function recursive() {
  process.nextTick(recursive); // никогда не вернётся к poll-фазе
}
recursive();

setImmediate(() => console.log('никогда не выведется'));
fs.readFile('a.txt', () => {/* никогда не вызовется */});`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'То же самое верно и для Promise microtasks: бесконечная цепочка `Promise.resolve().then(...)` блокирует переход к timers-фазе, потому что microtask checkpoint не завершается.',
        },
        {
          type: 'text',
          content:
            'Безопасная альтернатива — `setImmediate`. Он попадает в check-фазу, и между итерациями цикла обязательно проходит poll-фаза, в которой обрабатывается I/O.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ✅ Не блокирует I/O: между итерациями есть poll-фаза.
function safeRecursion() {
  setImmediate(safeRecursion);
}
safeRecursion();

// fs.readFile, входящие HTTP-запросы и таймеры будут отрабатывать.`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'На собеседовании вопрос «как сделать рекурсивную фоновую задачу, не блокирующую сервер» — это проверка на знание разницы nextTick/setImmediate. Правильный ответ — `setImmediate`, потому что он уступает место I/O.',
        },
      ],
      playground: {
        starterCode: `// В браузерном sandbox process.nextTick недоступен,
// но идея та же: микрозадачи опустошаются перед макрозадачами.
// Предскажите, в каком порядке выведется код, и проверьте.

console.log('1');

queueMicrotask(() => console.log('2'));
Promise.resolve().then(() => console.log('3'));
setTimeout(() => console.log('4'), 0);

console.log('5');`,
        expectedOutput: '1\n5\n2\n3\n4',
        description:
          'Запустите код и убедитесь, что весь синхронный код печатается первым, затем все микрозадачи в порядке постановки, и только потом макрозадача setTimeout. В Node.js перед строкой "2" выполнились бы ещё все process.nextTick.',
      },
      flashcardIds: ['nodel-f3'],
      docsLink: { url: 'https://metanit.com/web/nodejs/1.4.php', title: 'Node.js Event Loop — metanit.com' },
      links: [
        {
          url: 'https://docs.libuv.org/en/v1.x/design.html',
          title: 'libuv — Design overview',
          source: 'spec',
          language: 'en',
          note: 'Архитектура libuv: как устроены фазы и почему nextTick имеет приоритет перед всеми остальными очередями.',
        },
      ],
    },

    {
      id: 'cpu-bound',
      title: 'CPU-bound задачи и worker threads',
      estimatedMinutes: 8,
      blocks: [
        {
          type: 'text',
          content:
            'Главное правило Node.js-сервера: **не блокировать event loop**. Пока один callback выполняет тяжёлый цикл — никакие другие соединения не обрабатываются: HTTP-запросы стоят в очереди ОС, таймеры опаздывают, health-check падает.',
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Эвристика для интервью: < 10 мс — оставляй в основном потоке. 10–100 мс — батчинг через `setImmediate`. > 100 мс — `worker_threads`. Интервьюер спросит именно эту границу.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ Синхронный CPU-bound код блокирует все соединения сервера.
app.get('/hash', (req, res) => {
  let result = 0;
  for (let i = 0; i < 1e9; i++) result += Math.sqrt(i);
  res.json({ result });
});`,
        },
        {
          type: 'list',
          content: `Стратегии вынести нагрузку из event loop:
- **Батчинг**: разбить большой массив на чанки и между ними вызвать \`setImmediate\` — цикл успеет обработать I/O.
- **\`worker_threads\`**: вынести вычисление в отдельный поток. Один процесс, разделяемая память через \`SharedArrayBuffer\`.
- **\`cluster\`**: запустить N процессов-воркеров по числу ядер. Балансировка через master-процесс. Подходит для горизонтального масштабирования HTTP-сервера.
- **Внешний сервис**: вынести вычисление в отдельный микросервис на языке, лучше подходящем для CPU-нагрузки (Rust, Go).`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ✅ Батчинг через setImmediate (в браузере — через setTimeout).
function processInChunks(arr, chunkSize, processor) {
  return new Promise((resolve) => {
    const result = [];
    let i = 0;
    function step() {
      const end = Math.min(i + chunkSize, arr.length);
      while (i < end) result.push(processor(arr[i++]));
      if (i < arr.length) setImmediate(step); // отдаём управление event loop
      else resolve(result);
    }
    step();
  });
}`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ✅ Worker Threads для тяжёлых вычислений.
// main.js
const { Worker } = require('worker_threads');

app.get('/hash', (req, res) => {
  const worker = new Worker('./hash-worker.js', { workerData: req.query });
  worker.once('message', (result) => res.json(result));
  worker.once('error', (err) => res.status(500).json({ error: err.message }));
});

// hash-worker.js
const { parentPort, workerData } = require('worker_threads');
let hash = 0;
for (let i = 0; i < 1e9; i++) hash = (hash + i) % 1e9;
parentPort.postMessage({ hash });`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Эвристика: если вычисление занимает менее 10 мс — можно оставить в основном потоке. От 10 до 100 мс — батчинг через `setImmediate`. Свыше 100 мс или регулярная нагрузка — `worker_threads`.',
        },
      ],
      flashcardIds: ['nodel-f4', 'nodel-f7'],
      checkpoint: [Q['nodel-q4']!],
      docsLink: { url: 'https://metanit.com/web/nodejs/17.1.php', title: 'Worker Threads — metanit.com' },
      video: {
        source: 'youtube',
        id: 'P9csgxBgaZ8',
        title: "Node's Event Loop From the Inside Out — Sam Roberts",
        channel: 'node.js',
        language: 'en',
        durationSec: 35 * 60,
        description: 'Взгляд изнутри libuv: thread pool, poll-фаза, как проектировать сервер, который не блокируется под нагрузкой.',
      },
      links: [
        {
          url: 'https://nodejs.org/api/worker_threads.html',
          title: 'Worker Threads — официальная документация',
          source: 'nodejs-docs',
          language: 'en',
          note: 'Когда применять worker_threads, как делиться памятью через SharedArrayBuffer и как строить пул воркеров.',
        },
      ],
    },

    {
      id: 'event-emitter',
      title: 'EventEmitter и обработка ошибок',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            '**EventEmitter** — базовый класс модуля `events`. На нём построены HTTP-сервер, стримы, child_process, кластер.',
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Главная ловушка: **`emit` — синхронный**. Многие думают он «отправляет» и обработчик вызовется «когда-нибудь». Нет — `emit` блокирует выполнение пока все обработчики не отработают. Если обработчик бросит исключение — оно выбросится прямо в вызывающий код.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { EventEmitter } = require('events');
const ee = new EventEmitter();

ee.on('test', () => console.log('B'));
console.log('A');
ee.emit('test'); // emit СИНХРОННЫЙ
console.log('C');

// Вывод: A → B → C`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '`emit` выполняется **синхронно**: на стек кладётся вызов emit, далее последовательно вызываются все подписчики, и только потом возвращается управление. Если один подписчик бросит исключение, остальные не выполнятся.',
        },
        {
          type: 'text',
          content:
            'Особое поведение события `error`: если на это событие нет подписчика, EventEmitter **выбрасывает** ошибку как throw. В production это означает падение процесса. Поэтому на каждый emitter, который может эмитить ошибку (стрим, http.request, child_process), всегда подписывайтесь на `error`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const stream = fs.createReadStream('missing.txt');
stream.on('data', () => {});
// 🔴 Без подписчика на 'error' Node.js выбросит ошибку и завершит процесс:
stream.on('error', (err) => console.error(err));`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Ещё одна типовая ошибка — утечка памяти через подписки. По умолчанию при > 10 подписчиках на одно событие Node.js выводит `MaxListenersExceededWarning`. Это сигнал, что вы забываете снимать обработчики через `off()` или `removeListener()`.',
        },
      ],
      flashcardIds: ['nodel-f5', 'nodel-f8'],
      docsLink: { url: 'https://metanit.com/web/nodejs/2.6.php', title: 'EventEmitter — metanit.com' },
      links: [
        {
          url: 'https://nodejs.org/api/events.html',
          title: 'Events — Node.js официальная документация',
          source: 'nodejs-docs',
          language: 'en',
          note: 'Если хотите разобраться с once, removeListener и лимитом подписчиков — здесь полная документация с примерами.',
        },
      ],
    },

    {
      id: 'promises-abort',
      title: 'Unhandled rejections и AbortController',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'С Node.js 15+ необработанный rejected promise завершает процесс с exit 1 (`--unhandled-rejections=strict`). До этого такие ошибки молча проглатывались. Теперь **любой забытый `.catch()`** может уронить сервер в проде.',
        },
        {
          type: 'text',
          content:
            '**AbortController** — стандартный способ отменить асинхронную операцию. Передаёшь `signal` в `fetch` или `fs.promises`, вызываешь `controller.abort()` — операция прекращается с `AbortError`. Один контроллер можно передать в несколько операций и отменить все разом.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// 🔴 Любой throw в async-функции без catch — потенциальный crash.
async function loadConfig() {
  throw new Error('config not found');
}
loadConfig(); // unhandledRejection → exit 1 в Node 15+

// ✅ Глобальный обработчик для логирования и graceful shutdown.
process.on('unhandledRejection', (reason) => {
  logger.fatal({ err: reason }, 'unhandled rejection');
  // graceful shutdown: закрыть соединения, дождаться очереди, exit
  shutdown(1);
});`,
        },
        {
          type: 'text',
          content:
            '**AbortController** — стандартный способ кооперативной отмены асинхронных операций. Поддерживается в `fetch`, `fs.promises.*`, `setTimeout` (Node 17+) и большинстве свежих API. Аналогичен сигналу cancel из других платформ.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Таймаут запроса через AbortController.
async function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') return null;
    throw err;
  } finally {
    clearTimeout(timer);
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Один `AbortController` можно передавать в несколько API одновременно — все они отменятся одним вызовом `controller.abort()`. Это удобный паттерн для отмены пайплайна (несколько fetch + чтение файла).',
        },
      ],
      flashcardIds: ['nodel-f9'],
      docsLink: { url: 'https://metanit.com/web/nodejs/1.4.php', title: 'Node.js Event Loop — metanit.com' },
      links: [
        {
          url: 'https://nodejs.org/api/globals.html#abortsignal',
          title: 'AbortSignal — Node.js документация',
          source: 'nodejs-docs',
          language: 'en',
          note: 'Всё об AbortController: как подключить сигнал к своей функции, использовать AbortSignal.timeout() и правильно проверять AbortError.',
        },
      ],
    },
  ],

  // Все вопросы из старого квиза, кроме тех, что ушли в checkpoint.
  finalQuiz: nodeEventLoopQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  // Реюзаем все существующие карточки и добавляем три новые.
  flashcards: [...nodeEventLoopFlashcards.cards, ...extraFlashcards],

  cheatsheet: `### Шпаргалка по Node.js Event Loop

- 6 фаз libuv: **timers → pending → idle/prepare → poll → check → close**.
- Между каждой фазой: **process.nextTick → Promise microtasks** (nextTick раньше).
- \`setImmediate\` = check-фаза. \`setTimeout(fn, 0)\` = timers-фаза.
- Внутри I/O callback **immediate всегда раньше timeout**, вне I/O — порядок не гарантирован.
- Рекурсивный \`process.nextTick\` = starvation: I/O не обрабатывается. Решение — \`setImmediate\`.
- CPU-bound: батчинг через \`setImmediate\`, тяжёлые задачи — \`worker_threads\`. Масштабирование HTTP — \`cluster\`.
- libuv thread pool: 4 потока по умолчанию, для fs/dns/crypto. Увеличение: \`UV_THREADPOOL_SIZE=16\`.
- \`EventEmitter.emit\` синхронный. Событие \`error\` без подписчика крашит процесс.
- Unhandled rejection в Node 15+ завершает процесс с exit 1.`,

  interviewQA: [
    {
      id: 'nodel-iq1',
      question: 'Перечислите фазы event loop в Node.js. Что выполняется в каждой?',
      shortAnswer:
        'Шесть фаз libuv: timers, pending callbacks, idle/prepare, poll, check, close. Между ними — очереди process.nextTick и Promise microtasks. В timers выполняются callback-и истёкших таймеров, в poll — I/O события, в check — setImmediate, в close — события закрытия.',
      fullAnswer: `Event loop в Node.js — это бесконечный цикл, который libuv проходит итерацию за итерацией. На каждой итерации выполняются шесть фаз, каждая со своей очередью callback-ов:

1. **timers** — callback-и \`setTimeout\` и \`setInterval\`, у которых истёк таймаут.
2. **pending callbacks** — отложенные системные callback-и (например, ошибка TCP-соединения).
3. **idle, prepare** — внутренние нужды libuv. В прикладном коде сюда не попасть.
4. **poll** — самая важная фаза. Здесь забираются новые I/O события из ядра ОС: входящие HTTP-запросы, готовые чтения файлов, сетевые пакеты. Если в poll очереди пусто и таймеров на ближайшее время нет, цикл может уснуть в \`epoll_wait\` (Linux), \`kqueue\` (macOS) или \`IOCP\` (Windows).
5. **check** — callback-и \`setImmediate\`. Идёт сразу после poll, поэтому immediate всегда отрабатывает в той же итерации, что породившее его I/O.
6. **close callbacks** — события закрытия: \`socket.on('close')\`, \`stream.on('close')\`.

**Между каждой** фазой Node.js полностью опустошает две вспомогательные очереди: сначала \`process.nextTick\` (приоритетнее), затем Promise microtasks. Это значит, что микрозадачи выполняются до 7 раз за итерацию (после каждой фазы и при первом входе в цикл).`,
      followUps: [
        'В каких фазах может уснуть event loop, и от чего зависит длительность сна?',
        'Что произойдёт, если в poll-фазе очередь пустая, но таймер должен сработать через 50 мс?',
      ],
      relatedChapterId: 'phases',
    },
    {
      id: 'nodel-iq2',
      question: 'Чем process.nextTick отличается от setImmediate и Promise.resolve().then()?',
      shortAnswer:
        'process.nextTick выполняется сразу после текущей операции, перед любыми другими очередями. Promise microtasks — следующая по приоритету очередь, выполняется после nextTick. setImmediate — макрозадача check-фазы event loop, выполняется один раз за итерацию.',
      fullAnswer: `Это три разных уровня отложенного выполнения:

- **\`process.nextTick(fn)\`** — это **не** часть libuv. Это отдельная очередь Node.js, которую интерпретатор опустошает между шагами. Имеет наивысший приоритет: nextTick выполняется до Promise microtasks, до любой фазы event loop.

- **\`Promise.resolve().then(fn)\`** / \`queueMicrotask(fn)\` — стандартные ECMAScript-микрозадачи. Очередь опустошается после nextTick на том же чекпоинте между фазами.

- **\`setImmediate(fn)\`** — макрозадача фазы **check**. Выполняется один раз за итерацию цикла, всегда после poll-фазы.

Практический пример:

\`\`\`js
process.nextTick(() => console.log('A'));
Promise.resolve().then(() => console.log('B'));
setImmediate(() => console.log('C'));
console.log('D');
// D → A → B → C
\`\`\`

Когда что использовать:
- \`process.nextTick\` — если нужно отложить вычисление до завершения текущего стека, но **перед** I/O. Типовой случай — асинхронный API, который должен «казаться синхронным».
- \`queueMicrotask\` — стандартная альтернатива nextTick для микрозадач без приоритета над промисами. Работает и в браузере.
- \`setImmediate\` — если нужно «отдать управление» event loop перед следующим шагом тяжёлого вычисления.`,
      followUps: [
        'Почему process.nextTick существует в Node.js и не существует в браузере?',
        'Что произойдёт, если внутри Promise.then вызвать process.nextTick?',
      ],
      relatedChapterId: 'nexttick-vs-microtask',
    },
    {
      id: 'nodel-iq3',
      question: 'Что такое starvation в event loop и как его избежать?',
      shortAnswer:
        'Starvation — ситуация, когда одна очередь не даёт циклу перейти к следующим фазам. Чаще всего возникает из-за рекурсивного process.nextTick или бесконечной цепочки Promise.then. Решение — использовать setImmediate, который попадает в check-фазу и пропускает между итерациями poll.',
      fullAnswer: `Очередь \`process.nextTick\` опустошается **полностью** перед переходом к следующей фазе. То же верно для microtask checkpoint. Если эти очереди пополняются быстрее, чем опустошаются, event loop никогда не попадёт в poll-фазу — а значит, не обработает I/O.

Типичный пример:

\`\`\`js
function tick() {
  process.nextTick(tick); // очередь nextTick никогда не пуста
}
tick();

setImmediate(() => console.log('никогда'));
http.createServer((req, res) => res.end('ok')).listen(3000);
// Сервер не отвечает: входящие запросы стоят в очереди ОС.
\`\`\`

То же самое происходит с бесконечной цепочкой \`Promise.resolve().then(() => promise.then(...))\` — microtask checkpoint не завершается.

Как избежать:
- Для рекурсивных фоновых задач используйте \`setImmediate\` — между итерациями обязательно проходит poll-фаза.
- Если нужно много раз вызвать nextTick (например, эмулировать асинхронный API), ограничьте глубину цепочки явным счётчиком.
- Мониторьте задержку event loop через \`perf_hooks.monitorEventLoopDelay()\` или метрику \`event_loop_lag\` в библиотеках типа \`prom-client\`.`,
      followUps: [
        'Какую метрику снимает monitorEventLoopDelay и как её интерпретировать?',
        'Как Promise.resolve().then(...) внутри обработчика микрозадачи влияет на checkpoint?',
      ],
      relatedChapterId: 'starvation',
    },
    {
      id: 'nodel-iq4',
      question: 'Как Node.js обрабатывает CPU-bound задачи? Когда стоит выносить их в worker_threads?',
      shortAnswer:
        'Любой синхронный CPU-bound код блокирует event loop. Стратегии: батчинг через setImmediate (для умеренной нагрузки), worker_threads (для тяжёлых вычислений), cluster (для масштабирования HTTP). Эвристика: до 10 мс — основной поток, 10–100 мс — батчинг, свыше 100 мс — worker_threads.',
      fullAnswer: `Event loop в Node.js однопоточный: пока один callback выполняется, никакие другие не обрабатываются. Тяжёлый цикл в обработчике HTTP-запроса замораживает весь сервер.

Стратегии вынести нагрузку:

1. **Батчинг через \`setImmediate\`.** Разбиваем массив на чанки и обрабатываем их по одному, между чанками вызываем \`setImmediate\` — цикл успевает обработать I/O. Подходит для умеренной нагрузки и операций, которые легко делятся (map/filter/reduce).

2. **\`worker_threads\`.** Запускает JavaScript в отдельном V8-инстансе, в отдельном потоке. Один процесс, можно делиться памятью через \`SharedArrayBuffer\` и \`Atomics\`. Подходит для криптографии, парсинга, ML-инференса. Накладные расходы на создание worker заметные, поэтому держат пул воркеров через \`piscina\` или вручную.

3. **\`cluster\`.** Несколько процессов-воркеров слушают один порт, master распределяет соединения. Это горизонтальное масштабирование: каждый процесс занимает своё ядро. Не помогает с одной тяжёлой задачей, но удваивает RPS на многоядерной машине.

4. **Внешний сервис.** Если задача регулярно занимает > 1 секунды, вынесите её в отдельный микросервис на языке, лучше подходящем для CPU-нагрузки (Rust, Go), и общайтесь через HTTP/gRPC/очередь.

Когда выбирать worker_threads vs cluster: worker_threads — если задача **изолированная** (хешировать массив, сжать буфер). Cluster — если нужно повысить пропускную способность всего сервера.`,
      followUps: [
        'Чем накладные расходы worker_threads отличаются от child_process?',
        'Как реализовать пул воркеров без сторонних библиотек?',
      ],
      relatedChapterId: 'cpu-bound',
    },
    {
      id: 'nodel-iq5',
      question: 'Что произойдёт, если в callback таймера вызвать тяжёлую синхронную операцию?',
      shortAnswer:
        'Эта операция выполнится в timers-фазе и заблокирует event loop на всё время своего выполнения. Все остальные таймеры, I/O события и микрозадачи, накопившиеся за это время, будут отложены. Под нагрузкой это приводит к рассинхронизации таймеров и таймаутам HTTP-запросов.',
      fullAnswer: `Допустим, у вас два таймера: один на 100 мс, второй на 110 мс. Callback первого выполняет тяжёлый \`for (let i = 0; i < 1e9; i++)\`, который занимает 200 мс.

Что произойдёт:
- В 100 мс цикл попадёт в timers-фазу и начнёт выполнять первый callback.
- 200 мс event loop полностью заморожен. Никакие новые соединения не обрабатываются, microtask checkpoint не наступает.
- Когда первый callback завершится, цикл проверит следующие таймеры. Второй таймер уже «опаздывает» — он должен был сработать на 110 мс, а сейчас 300 мс. Он выполнится сразу.
- Все I/O события, накопившиеся за 200 мс, перейдут в poll-фазу пакетом и могут вызвать всплеск нагрузки.

На практике это проявляется как:
- HTTP-запросы получают таймауты (клиенты не дожидаются ответа).
- \`setInterval\` теряет «такт» — несколько вызовов сливаются в один.
- В метриках event loop lag (через \`perf_hooks\`) виден пик в 200 мс.

Решение: вынести тяжёлую операцию в \`worker_threads\`, разбить через \`setImmediate\`, или кэшировать результат, чтобы не вычислять каждый раз.`,
      followUps: [
        'Как метрика event loop lag используется в SLO production-сервисов?',
        'Что возвращает console.time(), если внутри замера таймер был «отложен» циклом?',
      ],
      relatedChapterId: 'cpu-bound',
    },
    {
      id: 'nodel-iq6',
      question: 'Почему обработка ошибок EventEmitter — частый источник падений в production?',
      shortAnswer:
        'EventEmitter имеет специальное поведение для события "error": если нет подписчика, ошибка выбрасывается как throw и при отсутствии глобального обработчика крашит процесс. Многие забывают подписаться на error в стримах и http.request, и редкая ошибка валит сервер.',
      fullAnswer: `EventEmitter — основа для большинства Node.js API: HTTP-сервер, стримы, child_process, кластер. У него есть специальное правило для события \`error\`: если эмитится \`'error'\` и на это событие нет подписчика, EventEmitter вызывает \`throw\`. В асинхронном контексте это означает unhandled exception на уровне процесса.

Типичные сценарии падения:

\`\`\`js
// 🔴 Забытая подписка на ошибку стрима
const stream = fs.createReadStream(filename);
stream.pipe(res);
// если файл не существует — крах процесса

// ✅ Корректно
stream.on('error', (err) => res.status(500).end(err.message));
stream.pipe(res);
\`\`\`

\`\`\`js
// 🔴 http.request без обработчика error
const req = http.request(opts);
req.write(body);
req.end();
// если соединение оборвалось — крах

// ✅
req.on('error', (err) => logger.error({ err }, 'request failed'));
\`\`\`

Защитные меры:
- \`process.on('uncaughtException', ...)\` — последний рубеж, после которого нужно сделать graceful shutdown.
- \`process.on('unhandledRejection', ...)\` — для забытых \`.catch()\`.
- В Node.js 15+ unhandled rejection по умолчанию завершает процесс — это сделано специально, чтобы баги не накапливались тихо.

В production важно подписываться на error на каждом emitter, который может его эмитить, и иметь глобальные обработчики как safety net, а не как штатную логику.`,
      followUps: [
        'Чем uncaughtException отличается от unhandledRejection и почему обработка обоих важна?',
        'Как graceful shutdown связан с этими обработчиками?',
      ],
      relatedChapterId: 'event-emitter',
    },
    {
      id: 'nodel-iq7',
      question: 'Что такое libuv thread pool, и какие операции он используется?',
      shortAnswer:
        'libuv thread pool — пул потоков по умолчанию из 4 рабочих потоков, в которых выполняются операции, которые ОС не умеет делать асинхронно: большинство fs.*, dns.lookup, crypto.pbkdf2/scrypt, zlib. Сетевые операции (TCP/UDP) пул не используют — они работают через epoll/kqueue/IOCP.',
      fullAnswer: `Главный миф — что Node.js полностью однопоточный. На самом деле однопоточен только JavaScript-runtime; libuv держит **пул C-потоков** для операций, которые на уровне ОС не имеют асинхронного API.

Что использует пул:
- **Файловая система** — большинство методов \`fs.*\` (за исключением fs.watch на платформах, где есть FSEvents/inotify).
- **DNS** — \`dns.lookup\` (он использует \`getaddrinfo\`, а не настоящий неблокирующий резолвер).
- **Криптография** — \`crypto.pbkdf2\`, \`crypto.scrypt\`, RSA-операции, генерация ключей.
- **Сжатие** — \`zlib.deflate\`, \`zlib.gunzip\` и пр.

Что **не** использует пул:
- TCP, UDP, TLS — они работают через нативные неблокирующие API ОС (\`epoll\` на Linux, \`kqueue\` на macOS/BSD, \`IOCP\` на Windows).
- HTTP — поверх TCP, тоже не использует пул.

Размер пула — 4 потока по умолчанию. Меняется через \`UV_THREADPOOL_SIZE=16 node app.js\` (максимум 1024). Узкое место под нагрузкой: тяжёлый \`crypto.pbkdf2\` или \`fs.readFile\` могут занять все 4 потока, и остальные операции этого типа встанут в очередь, увеличивая latency.

В production-приложениях с активной криптографией пул увеличивают до числа ядер CPU.`,
      followUps: [
        'Почему dns.lookup использует пул, а dns.resolve — нет?',
        'Как диагностировать ситуацию, что приложение упёрлось в размер thread pool?',
      ],
      relatedChapterId: 'cpu-bound',
    },
  ],

  nextTopics: [
    { slug: 'node-streams', reason: 'Стримы — следующий уровень понимания: они построены на EventEmitter и зависят от поведения poll-фазы.' },
    { slug: 'node-network', reason: 'HTTP-сервер использует event loop напрямую — backpressure и graceful shutdown без знания фаз не построить.' },
  ],
};
