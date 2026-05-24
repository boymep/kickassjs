import type { Lesson } from '../../types/lesson';
import { nodeOptimizationQuiz } from '../quizzes/node-optimization';

const Q = Object.fromEntries(nodeOptimizationQuiz.questions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set([
  'nodeopt-q1',
  'nodeopt-q3',
  'nodeopt-q4',
  'nodeopt-q5',
  'nodeopt-q7',
  'nodeopt-q11',
  'nodeopt-q12',
]);

export const nodeOptimizationLesson: Lesson = {
  topicId: 'node-optimization',

  intro: {
    whyItMatters: `Когда Node-сервер начинает медленно отвечать, причина почти всегда в чём-то конкретном: повторные одинаковые запросы в БД, неограниченный пул подключений, не закрываемый сторонний API, неоптимальные структуры данных. Несколько прикладных приёмов — профилирование, LRU-кеш, батчинг, circuit breaker, пул ресурсов, мемоизация, корректная работа с памятью и V8 — закрывают большую часть таких проблем.

На собеседовании задают сценарные вопросы: как ускорить тяжёлый эндпойнт, как защититься от каскадных сбоев в зависимостях, как реализовать кеш с TTL, когда выносить вычисления в Worker, как искать утечку памяти. Сильный ответ начинается с измерений, а не с гипотез.`,
    estimatedMinutes: 30,
    interviewAngle:
      'Типичные вопросы: профилирование (\`clinic.js\`, \`0x\`, flame graphs, \`monitorEventLoopDelay\`); LRU vs memoize; single-flight для гонок; пул соединений и его размерность; circuit breaker и retry с jitter; cluster vs worker_threads vs контейнеры; настройки V8 и GC; работа libuv thread pool. Сильный кандидат сначала измеряет, потом оптимизирует.',
    prerequisites: [{ slug: 'node-event-loop', title: 'Event loop в Node.js' }],
  },

  chapters: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'profiling',
      title: 'Сначала — измерить',
      estimatedMinutes: 4,
      blocks: [
        {
          type: 'text',
          content:
            'Любая оптимизация начинается с замеров. Без них есть риск ускорить участок, который не на критическом пути. Профилирование в Node.js делается несколькими инструментами.',
        },
        {
          type: 'list',
          content: `\`clinic.js\` — набор инструментов: \`doctor\` (диагностика), \`flame\` (CPU flame graph), \`bubbleprof\` (асинхронная активность).
\`0x\` — генерирует flame graph из stack-sampling.
\`--inspect\` + Chrome DevTools — встроенный профайлер CPU и памяти.
\`perf_hooks.monitorEventLoopDelay\` — измерение задержки event loop в продакшене.
\`process.memoryUsage()\` — \`rss\`, \`heapUsed\`, \`heapTotal\`, \`external\` для диагностики памяти.`,
        },
        {
          type: 'text',
          content:
            'Flame graph — визуализация стека вызовов, в которой ширина прямоугольника пропорциональна времени, проведённому в функции. По нему сразу видно, какие участки кода занимают непропорционально много CPU.',
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Перед оптимизацией стоит зафиксировать текущие числа (p50, p95 латенси, CPU, RAM). Иначе после изменений сложно понять, стало ли лучше. Бенчмарки делаются под нагрузкой, близкой к реальной — \`autocannon\`, \`k6\` или \`wrk\`.',
        },
        { type: 'heading', content: 'Наблюдаемость в продакшене' },
        {
          type: 'list',
          content: `\`prom-client\` экспортирует метрики в формате Prometheus: HTTP-латенси, размер очереди, \`heapUsed\`, \`eventLoopDelay\`.
OpenTelemetry собирает distributed-трейсы и метрики, передаёт их в Jaeger, Tempo, Honeycomb.
RED-метрики (Rate, Errors, Duration) и USE-метрики (Utilization, Saturation, Errors) — два стандартных набора для веб-сервисов и инфраструктуры.
\`--enable-source-maps\` подключает source maps в проде: стек-трейсы указывают на исходные файлы, а не на скомпилированные.`,
        },
      ],
      checkpoint: [Q['nodeopt-q1']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'lru-cache',
      title: 'LRU-кеш, мемоизация и single-flight',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'LRU (Least Recently Used) — кеш с ограниченным размером, вытесняющий самые давно неиспользованные элементы. Подходит для часто запрашиваемых данных с допустимой устареваемостью: ответы API, результаты вычислений, пререндеренные шаблоны.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { LRUCache } = require('lru-cache');

const cache = new LRUCache({
  max: 1000,                  // максимум 1000 ключей
  ttl: 60 * 1000,             // 60 секунд
  updateAgeOnGet: true,       // TTL продлевается при чтении
});

async function fetchUser(id) {
  const cached = cache.get(id);
  if (cached) return cached;

  const user = await db.users.findOne({ id });
  cache.set(id, user);
  return user;
}`,
        },
        { type: 'heading', content: 'Инвалидация кеша' },
        {
          type: 'list',
          content: `TTL — самый простой способ. Подходит, если допустимо некоторое отставание от источника.
Cache-aside и явная инвалидация: при изменении данных вызывать \`cache.delete(id)\`.
Stale-while-revalidate: возвращать старое значение и параллельно обновлять.
Кеширование на уровне HTTP-заголовков (\`ETag\`, \`Cache-Control\`) для клиентского и CDN-кеша.`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Инвалидация кеша — известная сложная задача. Если данные меняются часто, короткий TTL проще и надёжнее, чем сложные механизмы согласованности — в них легко ошибиться и получить рассинхронизацию между кешем и источником.',
        },
        { type: 'heading', content: 'Memoize и его границы' },
        {
          type: 'text',
          content:
            '\`memoize\` хорош для чистых функций с дешёвыми ключами. Но если вход — большой объект, ключ становится дорогим в вычислении. И если функция имеет побочные эффекты или зависит от внешнего состояния, мемоизация ломает корректность.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Антипаттерн: кеш растёт без ограничения
const cache = new Map();
function memoize(fn) {
  return (key) => {
    if (cache.has(key)) return cache.get(key);
    const result = fn(key);
    cache.set(key, result);
    return result;
  };
}
// За продолжительное время Map накапливает миллионы записей,
// процесс упирается в --max-old-space-size.`,
        },
        {
          type: 'text',
          content:
            'Решение — LRU с фиксированным \`max\` либо явный TTL. Простой \`Map\` без ограничения — почти всегда утечка.',
        },
        { type: 'heading', content: 'Single-flight: дедупликация одновременных запросов' },
        {
          type: 'text',
          content:
            'Если на один и тот же ресурс одновременно приходит несколько запросов, мемоизация значения не помогает: пока первый поход в БД не завершился, остальные не находят кеш и тоже запускают запрос. Решение — кешировать промис: следующие вызовы дожидаются того же in-flight промиса, и реальная операция выполняется один раз. Этот паттерн называется single-flight.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const pending = new Map();
const cache   = new Map();

async function loadUser(id) {
  if (cache.has(id)) return cache.get(id);

  let promise = pending.get(id);
  if (!promise) {
    promise = db.users.findOne({ id }).then((user) => {
      cache.set(id, user);
      pending.delete(id);
      return user;
    }).catch((err) => {
      pending.delete(id); // важно очистить даже при ошибке
      throw err;
    });
    pending.set(id, promise);
  }
  return promise;
}`,
        },
      ],
      checkpoint: [Q['nodeopt-q3']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'batching-pools',
      title: 'Батчинг и пул ресурсов',
      estimatedMinutes: 5,
      blocks: [
        { type: 'heading', content: 'Батчинг запросов' },
        {
          type: 'text',
          content:
            'Если на одну страницу нужно загрузить десятки записей по разным ID, отдельные запросы съедают сеть и нагрузку БД. Батчинг собирает запросы в коротком окне (обычно один тик event loop, реализуется через \`process.nextTick\` или \`setImmediate\`) и отправляет одним вызовом. Классическая реализация — \`DataLoader\` из Facebook (используется в GraphQL).',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const DataLoader = require('dataloader');

const userLoader = new DataLoader(async (ids) => {
  const users = await db.users.find({ id: { $in: ids } });
  // Должен вернуть массив в порядке ids
  const byId = new Map(users.map((u) => [u.id, u]));
  return ids.map((id) => byId.get(id) ?? null);
});

// Все вызовы userLoader.load в пределах одного тика event loop
// группируются в один запрос к БД.
const [a, b, c] = await Promise.all([
  userLoader.load(1),
  userLoader.load(2),
  userLoader.load(3),
]);`,
        },
        { type: 'heading', content: 'Пул подключений' },
        {
          type: 'text',
          content:
            'Каждое подключение к БД дорого: TCP-handshake, аутентификация. Пул переиспользует подключения. Без пула под нагрузкой быстро заканчиваются доступные соединения, а сервер БД начинает отвергать новые.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { Pool } = require('pg');

const pool = new Pool({
  max: 20,                      // максимум 20 соединений
  idleTimeoutMillis: 30000,     // закрыть неактивное через 30 с
  connectionTimeoutMillis: 2000, // ждать соединения максимум 2 с
});

const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Размер пула должен соответствовать возможностям БД. Если PostgreSQL настроен на 100 одновременных соединений, а приложение реплицировано на 10 инстансов с пулом по 20, получится 200 соединений — БД исчерпает лимит и начнёт отвергать новые. Грубая оценка: \`max_pool_size ≈ max_connections / число реплик\`.',
        },
      ],
      checkpoint: [Q['nodeopt-q4']!, Q['nodeopt-q11']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'circuit-breaker',
      title: 'Circuit breaker и retry',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Circuit breaker — паттерн защиты от каскадных сбоев. Если сторонний API падает, повторные запросы превращают одну ошибку в лавину обращений, под которой ложится собственный сервис. Circuit breaker «открывается» после порога ошибок и быстро отвечает ошибкой без обращения к API. Через таймаут пробует один тестовый запрос (состояние half-open). Если он успешен — возвращается в closed.',
        },
        {
          type: 'list',
          content: `closed — нормальная работа, все запросы идут.
open — после порога ошибок, все запросы отвергаются мгновенно.
half-open — после таймаута, одна проба; успех → closed, ошибка → open.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const CircuitBreaker = require('opossum');

const breaker = new CircuitBreaker(
  () => fetch('https://external-api.example.com/data'),
  {
    timeout: 3000,            // запросы дольше 3 с засчитываются как ошибки
    errorThresholdPercentage: 50, // open после 50% ошибок
    resetTimeout: 30000,      // через 30 с — half-open
  },
);

breaker.fallback(() => ({ status: 'degraded' }));

const data = await breaker.fire();`,
        },
        { type: 'heading', content: 'Retry с exponential backoff' },
        {
          type: 'text',
          content:
            'Простой retry на ошибке приводит к лавине запросов. Корректный подход — экспоненциальная задержка с jitter (случайной добавкой), чтобы клиенты не синхронизировались.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `async function retryWithBackoff(fn, { maxAttempts = 5, baseMs = 100 } = {}) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      const delay = baseMs * Math.pow(2, attempt - 1) + Math.random() * baseMs;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}`,
        },
      ],
      checkpoint: [Q['nodeopt-q5']!, Q['nodeopt-q7']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'workers-and-cluster',
      title: 'Worker threads, cluster и контейнеры',
      estimatedMinutes: 6,
      blocks: [
        { type: 'heading', content: 'CPU-bound vs I/O-bound' },
        {
          type: 'text',
          content:
            'CPU-bound задача (JSON-парсинг мегабайт, хеширование, обработка изображений) занимает поток непрерывной вычислительной работой. I/O-bound задача (запрос к БД, HTTP-вызов, чтение файла) проводит большую часть времени в ожидании. Главный поток Node хорошо обслуживает I/O, но CPU-bound на нём блокирует event loop и резко увеличивает задержку для всех клиентов.',
        },
        { type: 'heading', content: 'worker_threads — поток внутри процесса' },
        {
          type: 'text',
          content:
            '\`worker_threads\` создаёт отдельный поток с собственным V8 isolate в том же процессе. Передача данных — через \`postMessage\` (структурное клонирование) или \`SharedArrayBuffer\` с \`Atomics\` для нулевого копирования. Подходит для CPU-bound кода без обращения к глобальным переменным главного потока.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { Worker } = require('node:worker_threads');

function runHeavy(input) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', { workerData: input });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error('Worker stopped: ' + code));
    });
  });
}`,
        },
        { type: 'heading', content: 'cluster — отдельные процессы' },
        {
          type: 'text',
          content:
            'Модуль \`cluster\` форкает текущее приложение в N отдельных процессов и распределяет входящие соединения между ними (\`SCHED_RR\` или ОС-уровень с \`SO_REUSEPORT\`). Каждый worker в cluster — это отдельный процесс с собственным V8, собственным heap и без общей памяти, кроме IPC через \`process.send\`. Применяется, чтобы задействовать все ядра CPU на одной машине.',
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Различие коротко: \`worker_threads\` — поток в одном процессе (один V8 на процесс, общая память через SharedArrayBuffer). \`cluster\` — отдельные процессы (каждый со своим V8 и heap, IPC через сериализацию). В Kubernetes и других оркестраторах вместо \`cluster\` обычно запускают несколько подов, по одному Node-процессу в каждом — это даёт изоляцию и упрощает горизонтальное масштабирование.',
        },
        { type: 'heading', content: 'libuv thread pool — отдельная история' },
        {
          type: 'text',
          content:
            'Помимо main thread, Node использует libuv thread pool (по умолчанию 4 потока) для \`fs.*\`, \`dns.lookup\`, \`crypto.pbkdf2\`/\`scrypt\`/\`randomBytes\`, \`zlib\`. Если эти операции массовые и все потоки заняты, новые встают в очередь, и I/O-задержка растёт даже без признаков CPU-нагрузки. Размер настраивается переменной \`UV_THREADPOOL_SIZE\` (от 1 до 1024). Для веб-сервиса с активным сжатием и DNS-резолвом увеличение пула до 8–16 потоков часто заметно снижает p99-латенси.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'v8-and-gc',
      title: 'V8 и сборщик мусора',
      estimatedMinutes: 5,
      blocks: [
        { type: 'heading', content: 'Hidden classes и inline caching' },
        {
          type: 'text',
          content:
            'V8 оптимизирует доступ к свойствам через hidden classes: при создании объекта движок присваивает ему скрытую структуру; объекты с одинаковым набором свойств получают одну и ту же структуру и одинаковый быстрый путь чтения. Inline caching кеширует тип объекта в месте обращения и ускоряет последующие операции. Когда код работает с объектами одной формы (мономорфно), путь быстрый; когда форм много (полиморфизм или мегаморфизм), V8 деоптимизирует и переходит на медленный путь.',
        },
        {
          type: 'list',
          content: `Объявлять все поля в конструкторе и не добавлять их после создания — это сохраняет стабильную форму.
Избегать удаления свойств (\`delete obj.prop\`) и присвоения \`undefined\` — оба ломают hidden class.
Не менять тип поля (число → строка) — это меняет форму и провоцирует деоптимизацию.
Использовать массивы единообразных типов (только числа, только строки) — V8 применяет к ним SMI- или packed-оптимизации.`,
        },
        { type: 'heading', content: 'Сборщик мусора V8' },
        {
          type: 'text',
          content:
            'V8 использует generational GC: heap делится на молодое (new space) и старое (old space) поколения. Большинство объектов короткоживущие — они выделяются в new space и собираются быстрым алгоритмом scavenger (несколько миллисекунд). Объекты, дожившие до второго цикла, перемещаются в old space, где работает более тяжёлый major GC по схеме mark-and-sweep с компакцией. Major GC может приводить к паузам в десятки миллисекунд на больших heap.',
        },
        { type: 'heading', content: '--max-old-space-size' },
        {
          type: 'text',
          content:
            'Лимит heap по умолчанию не фиксирован — V8 рассчитывает его исходя из объёма RAM на машине. При нехватке памяти возникает ошибка \`Allocation failed - JavaScript heap out of memory\`. Лимит явно задаётся флагом \`--max-old-space-size=4096\` (в МБ). Для диагностики причин полезен флаг \`--trace-gc\` — он печатает каждую паузу GC и помогает увидеть, как давление на память растёт во времени.',
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Buffer-объекты обычно живут вне V8 heap (в нативной памяти), но учитываются в \`process.memoryUsage().external\` и \`rss\`. Для тяжёлых бинарных операций используется пул \`Buffer.allocUnsafe(size)\` — он быстрее, чем \`Buffer.alloc\`, но не обнуляет память, поэтому подходит только когда содержимое будет полностью перезаписано.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'memory',
      title: 'Управление памятью и поиск утечек',
      estimatedMinutes: 4,
      blocks: [
        { type: 'heading', content: 'Heap snapshot для поиска утечек' },
        {
          type: 'text',
          content:
            'Если расход памяти растёт со временем, помогает heap snapshot через Chrome DevTools (Node инспектируется при запуске с \`--inspect\`). Снимок до и после нагрузочного теста показывает, какие объекты остаются в памяти. Retainer tree указывает, кто их удерживает. Снимок можно сделать программно через \`v8.writeHeapSnapshot(path)\` — удобно по сигналу.',
        },
        { type: 'heading', content: 'Типичные источники утечек' },
        {
          type: 'list',
          content: `Listener на \`EventEmitter\`, добавляемый в цикле без \`removeListener\`.
Замкнутые на большие данные коллбэки, удерживаемые долгоживущим обработчиком.
Глобальный \`Map\` или \`Object\` без ограничения размера.
Незакрытые сокеты или файловые дескрипторы (\`EMFILE: too many open files\`).
Циклические таймеры без \`clearInterval\` при завершении процесса.
Кеши промисов без удаления записей после resolve/reject.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Метрики \`process.memoryUsage().heapUsed\` и \`rss\` экспортируются в Prometheus или другой мониторинг как ключевые показатели. Постепенный рост — признак утечки, который сложно увидеть в краткосрочных нагрузочных тестах.',
        },
      ],
      checkpoint: [Q['nodeopt-q12']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'checklist',
      title: 'Чек-лист: с чего начать оптимизацию',
      estimatedMinutes: 3,
      blocks: [
        {
          type: 'text',
          content:
            'Если эндпойнт работает медленно, последовательность действий обычно одна и та же. Перепрыгивать через шаги — наиболее частая причина потерянного времени.',
        },
        {
          type: 'list',
          content: `Зафиксировать текущие метрики: p50, p95, p99 латенси, RPS, CPU, RAM, eventLoopDelay.
Воспроизвести нагрузку под профилировщиком: \`clinic.js doctor\` или \`0x\` под \`autocannon\`/\`k6\`.
Найти горячую точку по flame graph: какие функции занимают больше всего CPU.
Проверить N+1-запросы: подсчитать, сколько вызовов БД на один запрос; внедрить \`DataLoader\` при необходимости.
Проверить размеры тел: чтение мегабайтных JSON блокирует event loop — заменить на стриминговый парсер.
Проверить пул соединений и таймауты: исчерпание пула выглядит как «упёрлись в latency».
Добавить LRU-кеш на тяжёлые чистые операции; вынести CPU-bound в \`worker_threads\`.
Защитить зависимости circuit breaker и retry с jitter.
Повторить замеры и сравнить с базой.`,
        },
      ],
    },
  ],

  finalQuiz: nodeOptimizationQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  cheatsheet: `### Шпаргалка по оптимизации Node.js

**Профилирование**
- \`clinic.js\`, \`0x\` — flame graph
- \`--inspect\` + Chrome DevTools
- \`perf_hooks.monitorEventLoopDelay\` — задержка loop в проде
- \`process.memoryUsage()\` — heap, rss, external
- Бенчмарки: \`autocannon\`, \`k6\`, \`wrk\`
- \`prom-client\`, OpenTelemetry для метрик и трейсов
- \`--enable-source-maps\` для боевых стек-трейсов

**Кеширование**
- LRU-кеш с \`max\` и \`ttl\` (lru-cache)
- Инвалидация: TTL, cache-aside, stale-while-revalidate
- HTTP-кеш: \`ETag\`, \`Cache-Control\`

**Мемоизация и single-flight**
- Чистые функции, простые ключи
- Map без ограничения → утечка памяти
- Single-flight: кешировать промис, не результат

**Батчинг**
- \`DataLoader\` для группировки одинаковых запросов
- Группирует все вызовы в пределах одного тика event loop

**Пул соединений**
- \`max ≈ max_connections / число реплик\`
- \`idleTimeout\`, \`connectionTimeout\`
- Без пула под нагрузкой соединения заканчиваются

**Circuit breaker**
- closed → open → half-open → closed
- \`opossum\`: \`errorThresholdPercentage\`, \`resetTimeout\`, \`fallback\`
- Retry с exponential backoff + jitter

**worker_threads vs cluster**
- \`worker_threads\` — поток в процессе, общая память через SharedArrayBuffer (CPU-bound)
- \`cluster\` — отдельные процессы, IPC через сериализацию
- В k8s обычно вместо cluster — несколько подов
- \`UV_THREADPOOL_SIZE\` для fs/dns/crypto/zlib

**V8 и GC**
- Hidden classes: стабильная форма объектов, не менять типы полей
- Generational GC: new space (scavenger) → old space (mark-and-sweep)
- \`--max-old-space-size=4096\`, \`--trace-gc\` для диагностики
- \`Buffer.allocUnsafe\` для быстрых аллокаций (с осторожностью)

**Память**
- Heap snapshot для поиска утечек
- \`process.memoryUsage().heapUsed\` — метрика для мониторинга
- Типичные утечки: listeners, кеши без TTL, неснятые таймеры

**Подводные камни**
- Кеш без лимита размера → утечка
- Retry без backoff → лавина запросов
- Пул больше \`max_connections\` БД → отказ БД
- Мемоизация функции с побочными эффектами → битый кеш`,

  nextTopics: [
    {
      slug: 'sd-caching',
      reason:
        'Углублённое продолжение: HTTP-кеш, CDN, service worker, многослойное кеширование и инвалидация на уровне архитектуры.',
    },
    {
      slug: 'sd-scaling',
      reason:
        'После прикладных оптимизаций — масштабирование: горизонтальное и вертикальное, edge functions, CDN-распределение.',
    },
  ],
};
