import type { Lesson } from '../../types/lesson';
import { nodeEventLoopQuiz } from '../quizzes/node-event-loop';

const Q = Object.fromEntries(nodeEventLoopQuiz.questions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set(['nodel-q1', 'nodel-q4', 'nodel-q6', 'nodel-q9']);

export const nodeEventLoopLesson: Lesson = {
  topicId: 'node-event-loop',

  intro: {
    whyItMatters: `Node.js — однопоточная среда, которая при этом обслуживает тысячи одновременных соединений. Эта модель построена на event loop, реализованном в библиотеке libuv. В отличие от браузера, где спецификация HTML описывает абстрактные task и microtask, в Node.js цикл разделён на шесть явных фаз: timers, pending callbacks, idle/prepare, poll, check, close.

Между каждой фазой движок проверяет две дополнительные очереди — \`process.nextTick\` и Promise microtasks. На собеседовании на позиции, связанные с Node.js, тема встречается регулярно: вопросы о порядке вывода кода со смесью таймеров и промисов, о роли \`setImmediate\` отдельно от \`setTimeout(0)\`, о подходах к CPU-bound задачам.`,
    estimatedMinutes: 30,
    interviewAngle:
      'Основные блоки вопросов: шесть фаз libuv и порядок очередей между ними; разница между \`process.nextTick\`, \`queueMicrotask\` и \`setImmediate\`; диагностика starvation event loop на конкретных примерах; механизм graceful shutdown по сигналам SIGTERM/SIGINT.',
    prerequisites: [{ slug: 'js-event-loop', title: 'Event Loop в браузере' }],
  },

  chapters: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'phases',
      title: 'Шесть фаз libuv',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Каждая итерация event loop в Node.js проходит шесть фаз. На каждой обрабатывается своя очередь коллбэков. Между фазами полностью опустошаются микрозадачи и \`process.nextTick\`.',
        },
        {
          type: 'list',
          content: `timers — коллбэки \`setTimeout\` и \`setInterval\`, у которых наступило время.
pending callbacks — отложенные системные коллбэки (ошибки сокетов от ОС вроде ECONNREFUSED, доставленные после завершения предыдущей итерации).
idle / prepare — внутренние нужды libuv.
poll — основная фаза: I/O-коллбэки (чтение файла, ответ от сети, обработчики соединений). Может блокироваться, ожидая новых событий.
check — коллбэки \`setImmediate\`.
close callbacks — события \`close\` для сокетов и хендлов.`,
        },
        {
          type: 'visualization',
          content: '',
          vizId: 'node-event-loop',
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Между каждой фазой полностью опустошаются две очереди: \`process.nextTick\` и Promise microtasks. \`nextTick\` имеет приоритет над промисами — это особенность Node.js, не описанная в спецификации языка. Начиная с Node 11, обе очереди опустошаются также после каждого отдельного коллбэка внутри фаз timers, check и I/O — поэтому код выводит «one tick → one micro → two tick → two micro», а не «one tick → two tick → one micro → two micro», как было в Node 10.',
        },
        { type: 'heading', content: 'Сравнение с браузерным event loop' },
        {
          type: 'list',
          content: `В браузере одна общая очередь macrotask и одна microtask; в Node.js — шесть фаз libuv плюс две очереди микрозадач между ними.
\`process.nextTick\` существует только в Node.js; в браузере его нет.
\`setImmediate\` существует только в Node.js (в браузерах был удалён из стандарта).
\`requestAnimationFrame\` существует только в браузере — он привязан к циклу рендеринга.
\`queueMicrotask\` доступен в обеих средах одинаково.`,
        },
        { type: 'heading', content: 'setImmediate против setTimeout(0)' },
        {
          type: 'text',
          content:
            'Главная разница: \`setImmediate\` всегда выполняется в фазе check, \`setTimeout(fn, 0)\` — в фазе timers. Если вызвать оба вне I/O-коллбэка, порядок может быть любым (зависит от точности измерения времени libuv). Но если оба запланированы изнутри I/O-коллбэка, \`setImmediate\` гарантированно сработает раньше: фаза check идёт сразу после poll, а timers — на следующей итерации.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Внутри I/O-коллбэка setImmediate всегда раньше setTimeout(0)
const fs = require('node:fs');

fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
});
// Вывод: immediate → timeout`,
        },
      ],
      checkpoint: [Q['nodel-q1']!, {
        type: 'ordering',
        id: 'nel-ord1',
        description: 'Расставьте фазы event loop в Node.js в правильном порядке',
        items: [
          'timers — setTimeout / setInterval',
          'pending callbacks — отложенные системные',
          'idle / prepare — внутренние',
          'poll — I/O',
          'check — setImmediate',
          'close callbacks — события close',
        ],
        explanation:
          'Шесть фаз libuv идут в фиксированном порядке. Между каждой фазой полностью опустошаются \`process.nextTick\` и Promise microtasks.',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'nexttick-vs-microtask',
      title: 'process.nextTick, microtasks, setImmediate',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'В Node.js три разных способа отложить функцию, и у них разный приоритет. Различие между ними часто становится источником неочевидных багов при последовательности вывода.',
        },
        {
          type: 'list',
          content: `\`process.nextTick(fn)\` — отложить до конца текущей операции, но до микрозадач. Очередь \`nextTick\` опустошается полностью между любыми двумя фазами.
\`queueMicrotask(fn)\` и \`Promise.then(fn)\` — микрозадачи, опустошаются после \`nextTick\`, между фазами.
\`setImmediate(fn)\` — макрозадача, фаза check. Выполнится на следующей итерации event loop.
\`setTimeout(fn, 0)\` — макрозадача, фаза timers. Минимальная задержка — 1 мс (значение округляется в libuv).`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `console.log('sync');
process.nextTick(() => console.log('nextTick'));
queueMicrotask(() => console.log('microtask'));
Promise.resolve().then(() => console.log('promise'));
setImmediate(() => console.log('immediate'));
setTimeout(() => console.log('timeout 0'), 0);

// sync
// nextTick
// microtask
// promise
// timeout 0  (или immediate — порядок не гарантирован вне I/O)
// immediate`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '\`process.nextTick\` имеет приоритет над промисами. Рекурсивный \`process.nextTick\` способен полностью заблокировать переход к следующей фазе и заморозить I/O — это и есть starvation. Тонкость: исключение в коллбэке \`queueMicrotask\` поднимается как \`uncaughtException\`, тогда как исключение в \`.then\` превращается в rejection.',
        },
      ],
      checkpoint: [Q['nodel-q4']!, {
        type: 'multi-select',
        id: 'nel-ms1',
        description: 'Какие утверждения верны?',
        options: [
          '\`process.nextTick\` выполняется до Promise microtasks',
          '\`setImmediate\` гарантированно выполняется до \`setTimeout(0)\` внутри I/O-коллбэка',
          '\`setTimeout(fn, 0)\` имеет минимальную задержку 0 мс',
          '\`queueMicrotask\` и \`Promise.then\` идут в одну очередь',
          '\`process.nextTick\` относится к фазе timers',
        ],
        correctIndices: [0, 1, 3],
        explanation:
          '\`nextTick\` имеет приоритет над промисами и не относится к фазам — он опустошается между ними. \`setTimeout(0)\` имеет минимальную задержку 1 мс. \`queueMicrotask\` и \`Promise.then\` действительно идут в одну очередь.',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'starvation',
      title: 'Starvation: блокировка event loop',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Starvation (буквально «голодание» — ситуация, когда одна очередь не даёт другим получить процессорное время) возникает, когда event loop не может перейти к следующей фазе, потому что текущая очередь постоянно пополняется. Чаще всего это происходит с \`process.nextTick\` или с микрозадачами.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// АНТИПАТТЕРН: рекурсивный nextTick блокирует I/O
function endlessTick() {
  process.nextTick(endlessTick);
}
endlessTick();

// HTTP-сервер в этом процессе перестанет отвечать —
// поскольку очередь nextTick опустошается перед фазой poll,
// I/O-коллбэки никогда не запустятся.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Для разделения длительной синхронной работы на части без блокировки event loop используется \`setImmediate\`, а не \`process.nextTick\` или \`queueMicrotask\`. \`setImmediate\` отдаёт управление libuv на одну итерацию, и I/O успевает обработаться.',
        },
        { type: 'heading', content: 'Чанкование тяжёлой работы' },
        {
          type: 'code',
          language: 'javascript',
          content: `function processInChunks(items, chunkSize, processor) {
  return new Promise((resolve) => {
    const result = [];
    let i = 0;

    function step() {
      const end = Math.min(i + chunkSize, items.length);
      while (i < end) result.push(processor(items[i++]));

      if (i < items.length) {
        setImmediate(step); // отдаём управление event loop
      } else {
        resolve(result);
      }
    }

    step();
  });
}`,
        },
        { type: 'heading', content: 'Профилирование event loop delay' },
        {
          type: 'text',
          content:
            'Задержку event loop можно измерять через \`monitorEventLoopDelay\` (Node.js Perf Hooks). Если задержка превышает 100 мс, на нагруженном сервере это приводит к заметному росту времени ответа. В продакшене этот показатель отслеживают как метрику инфраструктуры наряду с CPU и памятью.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { monitorEventLoopDelay } = require('node:perf_hooks');

const histogram = monitorEventLoopDelay({ resolution: 20 });
histogram.enable();

setInterval(() => {
  console.log('p50:', histogram.percentile(50), 'p99:', histogram.percentile(99));
  histogram.reset();
}, 1000);`,
        },
      ],
      checkpoint: [Q['nodel-q6']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'cpu-bound',
      title: 'CPU-bound задачи, libuv thread pool и worker threads',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Event loop хорошо обслуживает I/O — сеть, файлы, очереди. CPU-bound задачи (парсинг больших JSON, хеширование, обработка изображений, сжатие) блокируют главный поток и резко увеличивают задержку для всех клиентов.',
        },
        { type: 'heading', content: 'Thread pool libuv' },
        {
          type: 'text',
          content:
            'Часть API Node.js не работает в главном потоке: она использует пул libuv размером 4 потока по умолчанию. В этот пул попадают операции \`fs.*\` (кроме fs-watcher), \`dns.lookup\`, \`crypto.pbkdf2\`, \`crypto.scrypt\`, \`crypto.randomBytes\` в асинхронном виде, а также \`zlib.*\`. Если все 4 потока заняты, новые операции встают в очередь — это видно как рост задержки в чтении файлов или DNS-резолве на нагруженном сервере. Размер пула настраивается переменной окружения \`UV_THREADPOOL_SIZE\` (до 1024).',
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Метод \`dns.lookup\` использует libuv thread pool через системный getaddrinfo. На нагруженном сервисе он может оказаться узким местом. Альтернатива — \`dns.resolve\` (поверх c-ares, не использует thread pool) или собственный DNS-кеш в Agent.',
        },
        { type: 'heading', content: 'Worker threads и cluster' },
        {
          type: 'list',
          content: `\`worker_threads\` — отдельный поток внутри одного процесса, с собственным V8 isolate. Передача данных через \`postMessage\` (структурное клонирование — копирование данных по спецификации HTML) или \`SharedArrayBuffer\` для нулевого копирования (вместе с \`Atomics\` для синхронизации). Опция \`transferList\` позволяет передать ArrayBuffer без копирования.
\`child_process\` — отдельный процесс. Дороже worker_threads (отдельная инициализация V8), зато сбой не приводит к падению главного процесса.
\`cluster\` — N процессов того же приложения, балансировка соединений на уровне ОС. В современных деплоях вместо cluster обычно запускают N контейнеров под управлением Kubernetes.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// worker.js
const { parentPort } = require('node:worker_threads');

parentPort.on('message', (data) => {
  const result = heavyCompute(data);
  parentPort.postMessage(result);
});

// main.js
const { Worker } = require('node:worker_threads');

const worker = new Worker('./worker.js');
worker.postMessage(largeInput);
worker.on('message', (result) => console.log('done:', result));`,
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'shutdown-and-context',
      title: 'Graceful shutdown и AsyncLocalStorage',
      estimatedMinutes: 5,
      blocks: [
        { type: 'heading', content: 'Обработка сигналов и graceful shutdown' },
        {
          type: 'text',
          content:
            'В контейнерных средах (Docker, Kubernetes) orchestration отправляет приложению сигнал \`SIGTERM\` перед остановкой и через grace-период — \`SIGKILL\`. Правильная реакция на \`SIGTERM\` — прекратить принимать новые соединения, дождаться завершения текущих и закрыть ресурсы (БД, очереди).',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const server = app.listen(port);

function shutdown(signal) {
  console.log(\`Received \${signal}, shutting down...\`);
  server.close(async () => {
    await db.close();
    process.exit(0);
  });
  // Если соединения зависли — выйти принудительно через 10 секунд
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));`,
        },
        { type: 'heading', content: 'AsyncLocalStorage — контекст запроса' },
        {
          type: 'text',
          content:
            '\`AsyncLocalStorage\` из модуля \`node:async_hooks\` позволяет хранить данные, привязанные к асинхронной цепочке вызовов, — например, идентификатор запроса или пользователя. Контекст автоматически прокидывается через \`await\`, \`setTimeout\` и коллбэки, не требуя передачи параметром.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { AsyncLocalStorage } = require('node:async_hooks');
const requestContext = new AsyncLocalStorage();

app.use((req, _res, next) => {
  requestContext.run({ requestId: req.headers['x-request-id'] }, next);
});

function logger(message) {
  const ctx = requestContext.getStore();
  console.log(\`[\${ctx?.requestId}] \${message}\`);
}`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            '\`AsyncLocalStorage\` особенно полезен для логирования и трейсинга: один раз сохранив \`requestId\` в начале обработки запроса, можно получать его в любой функции, вызванной по цепочке, без явной передачи.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'error-handling',
      title: 'Unhandled rejections и AbortController',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'В Node.js 15+ необработанный rejected-промис по умолчанию завершает процесс с ненулевым кодом. Это поведение защищает от незаметного накопления необработанных ошибок, но требует дисциплины — каждый промис нужно обрабатывать.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Глобальный обработчик
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', { reason, promise });
  // process.exit(1); — рекомендуется завершить процесс
});

process.on('uncaughtException', (err, origin) => {
  logger.error('Uncaught exception', { err, origin });
  process.exit(1);
});`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'После \`uncaughtException\` процесс находится в неопределённом состоянии — продолжать работу опасно. Обычная практика: залогировать и сделать \`process.exit(1)\`, а менеджер процессов (systemd, pm2, Kubernetes) перезапустит.',
        },
        { type: 'heading', content: 'AbortController в Node.js' },
        {
          type: 'text',
          content:
            'AbortController работает в \`fetch\`, \`fs.promises\`, \`http.request\`, таймерах \`setTimeout\` и \`setImmediate\` (Node 17+). Это стандартный способ отменять долгие операции и реализовывать таймауты.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Таймаут с AbortController
async function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);

  try {
    const res = await fetch(url, { signal: controller.signal });
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}`,
        },
      ],
      checkpoint: [Q['nodel-q9']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'pitfalls',
      title: 'Подводные камни',
      estimatedMinutes: 4,
      blocks: [
        { type: 'heading', content: 'Долгий синхронный код в обработчике' },
        {
          type: 'text',
          content:
            'JSON.parse на мегабайтах, регулярное выражение с экспоненциальным backtracking, плотный цикл — всё это блокирует event loop. Задержки сервера сразу растут, healthcheck начинает падать. Для диагностики применяются \`clinic.js\` и \`0x\` (генератор flame graph из stack-sampling).',
        },
        { type: 'heading', content: 'Listener leak в EventEmitter' },
        {
          type: 'text',
          content:
            'По умолчанию \`EventEmitter\` предупреждает при добавлении более 10 listener на одно событие. Если тысяча обработчиков добавляется в цикле и не снимается, расход памяти растёт. Решения: \`emitter.removeListener\`, \`once\` вместо \`on\`, \`emitter.setMaxListeners(n)\`, если действительно нужно много.',
        },
        { type: 'heading', content: 'setInterval с дрифтом времени' },
        {
          type: 'text',
          content:
            '\`setInterval\` не учитывает время выполнения коллбэка — если внутри тяжёлая операция, следующий тик сдвигается. Для регулярных задач лучше \`setTimeout\` с рекурсивным вызовом изнутри коллбэка.',
        },
        { type: 'heading', content: 'Утечки через циклические таймеры' },
        {
          type: 'text',
          content:
            '\`setInterval\` удерживает event loop активным, пока его не отменить через \`clearInterval\`. Если приложение завершается, но интервал висит, процесс не выйдет. Метод \`timer.unref()\` снимает интервал с подсчёта активных дескрипторов.',
        },
      ],
    },
  ],

  finalQuiz: nodeEventLoopQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  cheatsheet: `### Шпаргалка по Event Loop в Node.js

**Шесть фаз libuv**
1. timers — \`setTimeout\` / \`setInterval\`
2. pending callbacks — отложенные системные
3. idle / prepare — внутренние
4. poll — I/O
5. check — \`setImmediate\`
6. close callbacks — события close

**Между фазами**
- Очередь \`process.nextTick\` (приоритет над промисами)
- Очередь microtasks (\`queueMicrotask\`, \`Promise.then\`)

**Приоритет**
sync → \`process.nextTick\` → microtasks → следующая фаза

**setImmediate vs setTimeout(0)**
- Внутри I/O-коллбэка \`setImmediate\` всегда раньше
- Вне I/O — порядок не гарантирован
- \`setTimeout(fn, 0)\` имеет минимальную задержку 1 мс

**Starvation**
- Рекурсивный \`process.nextTick\` блокирует I/O
- Бесконечная цепочка \`Promise.then\` блокирует фазу poll
- Чанкование тяжёлой работы — через \`setImmediate\`

**libuv thread pool**
- Размер по умолчанию 4, настраивается \`UV_THREADPOOL_SIZE\` (до 1024)
- Используется: \`fs.*\`, \`dns.lookup\`, \`crypto.pbkdf2\` / \`scrypt\` / \`randomBytes\`, \`zlib.*\`
- \`dns.resolve\` (через c-ares) не использует thread pool

**CPU-bound**
- \`worker_threads\` для параллельных вычислений
- \`SharedArrayBuffer\` + \`Atomics\` для нулевого копирования
- \`transferList\` для передачи ArrayBuffer без копирования
- \`cluster\` — отдельные процессы; в k8s обычно вместо него — несколько подов

**Графefully shutdown**
- Слушать \`SIGTERM\` (k8s) и \`SIGINT\` (Ctrl+C)
- \`server.close()\` + закрытие БД и очередей
- Принудительный exit по таймауту (\`unref\`-ed setTimeout)

**Профилирование**
- \`perf_hooks.monitorEventLoopDelay\` — задержка loop
- \`clinic.js\`, \`0x\` — flame graph
- \`AsyncLocalStorage\` — контекст запроса для логирования

**Обработка ошибок**
- \`process.on('unhandledRejection')\` — обязательно
- \`process.on('uncaughtException')\` — лог и exit(1)
- AbortController для таймаутов и отмены`,

  nextTopics: [
    {
      slug: 'node-streams',
      reason:
        'Стримы — основной API для работы с большими объёмами данных в Node. Понимание event loop помогает разобраться с backpressure и эффективностью pipe.',
    },
    {
      slug: 'node-optimization',
      reason:
        'После event loop логично разобрать прикладные приёмы оптимизации: LRU-кеш, батчинг, circuit breaker, worker_threads.',
    },
  ],
};
