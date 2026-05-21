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
    whyItMatters: `Когда Node-сервер начинает медленно отвечать, причина почти всегда в чём-то конкретном: повторные одинаковые запросы в БД, неограниченный пул подключений, не закрываемый сторонний API. Несколько прикладных приёмов — LRU-кеш, батчинг, circuit breaker, пул ресурсов, мемоизация — закрывают большую часть таких проблем.

На собеседовании просят рассказать, как ускорить тяжёлый эндпойнт, как защититься от каскадных сбоев в зависимостях, как реализовать кеш с TTL, и когда выносить вычисления в Worker.`,
    estimatedMinutes: 26,
    interviewAngle:
      'Интервьюера интересует, как кандидат рассуждает: измеряет ли сначала (профилирование), думает ли об инвалидации кеша, понимает ли разницу между memoize и LRU, знает ли паттерн circuit breaker.',
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
            'Любая оптимизация начинается с замеров. Без них есть риск ускорить участок, который не на критическом пути. Профилирование в Node.js делается тремя инструментами.',
        },
        {
          type: 'list',
          content: `**clinic.js** — набор инструментов: \`doctor\` (диагностика), \`flame\` (CPU flame graph), \`bubbleprof\` (асинхронная активность).
**0x** — flame graph, простой и быстрый.
**\`--inspect\`** + Chrome DevTools — встроенный профайлер CPU и памяти.
**\`perf_hooks.monitorEventLoopDelay\`** — измерение задержки event loop в продакшене.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Перед оптимизацией стоит зафиксировать текущие числа (p50, p95 латенси, CPU, RAM). Иначе после изменений сложно понять, стало ли лучше. Бенчмарки делаются под нагрузкой, близкой к реальной — \`autocannon\`, \`k6\` или \`wrk\`.',
        },
      ],
      checkpoint: [Q['nodeopt-q1']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'lru-cache',
      title: 'LRU-кеш и мемоизация',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            '**LRU** (Least Recently Used) — кеш с ограниченным размером, который вытесняет самые давно неиспользованные элементы. Идеален для горячих данных: ответы API, результаты вычислений, пререндеренные шаблоны.',
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
          content: `**TTL** — самый простой способ. Подходит, если допустимо некоторое отставание от источника.
**Cache-aside + явная инвалидация**: при изменении данных вызывать \`cache.delete(id)\`.
**Stale-while-revalidate**: возвращать старое значение и параллельно обновлять.
**Кеширование на уровне HTTP-заголовков** (\`ETag\`, \`Cache-Control\`) для клиентского и CDN-кеша.`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Главная сложность кеша — инвалидация. Старая фраза «two hard things: cache invalidation and naming things». Если данных меняются часто, лучше короткий TTL, чем хитрые механизмы инвалидации, в которых легко ошибиться.',
        },
        { type: 'heading', content: 'Memoize и его границы' },
        {
          type: 'text',
          content:
            '\`memoize\` хорош для чистых функций с одинаковыми входами. Но если вход — объект или большой массив, ключ становится дорогим в вычислении. И если функция имеет побочные эффекты или зависит от внешнего состояния — мемоизация ломает корректность.',
        },
      ],
      checkpoint: [Q['nodeopt-q3']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'memoization-pitfalls',
      title: 'Memoize: подводные камни',
      estimatedMinutes: 4,
      blocks: [
        { type: 'heading', content: 'Утечки памяти без ограничения размера' },
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
// Через час работы Map содержит миллион записей, RAM съедена`,
        },
        {
          type: 'text',
          content:
            'Решение — LRU-cache с фиксированным \`max\` либо TTL. Простой \`Map\` без ограничения — почти всегда утечка.',
        },
        { type: 'heading', content: 'Ключ — не объект' },
        {
          type: 'text',
          content:
            'Если ключ — объект, \`Map\` сравнивает по ссылке. Два литерала \`{ id: 1 }\` дадут разные ключи. Решение — сериализовать ключ (\`JSON.stringify\`) или использовать примитив (\`id\` вместо всего объекта).',
        },
        { type: 'heading', content: 'Мемоизация при race condition' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Антипаттерн: при одновременных запросах fetch выполнится N раз
async function loadUser(id) {
  const cached = cache.get(id);
  if (cached) return cached;
  const user = await db.users.findOne({ id }); // долго
  cache.set(id, user);
  return user;
}

// Корректно: кешировать промис, а не результат
async function loadUserCorrect(id) {
  let promise = pendingCache.get(id);
  if (!promise) {
    promise = db.users.findOne({ id });
    pendingCache.set(id, promise);
    promise.finally(() => {
      // Сохраняем результат, удаляем in-flight промис
    });
  }
  return promise;
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Это паттерн **single-flight**: если несколько одновременных запросов ждут один и тот же ресурс, реальное действие выполняется один раз. Используется в распределённых кешах и часто комбинируется с LRU.',
        },
      ],
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
            'Если на одну страницу нужно загрузить десятки записей по разным ID, отдельные запросы съедают сеть и нагрузку БД. **Батчинг** собирает запросы в коротком окне (обычно 10–50 мс) и отправляет одним вызовом. Классическая реализация — \`DataLoader\` из Facebook (используется в GraphQL).',
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

// 10 параллельных вызовов превратятся в один запрос к БД
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
            'Каждое подключение к БД дорого: TCP-handshake, аутентификация. Пул переиспользует подключения. Без пула под нагрузкой быстро заканчиваются доступные соединения, а сервер БД отвергает новые.',
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
            'Размер пула должен соответствовать возможностям БД. Если PostgreSQL настроен на 100 одновременных соединений, а приложение реплицировано на 10 инстансов с пулом по 20 — получится 200 соединений, БД упадёт. Формула: \`max_connections / replicas ≈ max_pool_size\`.',
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
            '**Circuit breaker** — паттерн защиты от каскадных сбоев. Если сторонний API падает, повторные запросы превращают одну ошибку в лавину обращений, под которой ложится сервис. Circuit breaker «открывается» после N подряд ошибок и быстро отвечает ошибкой без обращения к API. Через таймаут пробует один тестовый запрос («half-open»). Если он успешен — закрывается обратно.',
        },
        {
          type: 'list',
          content: `**closed** — нормальная работа, все запросы идут.
**open** — после порога ошибок, все запросы отвергаются мгновенно.
**half-open** — после таймаута, одна проба; успех → closed, ошибка → open.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const CircuitBreaker = require('opossum');

const breaker = new CircuitBreaker(
  () => fetch('https://external-api.example.com/data'),
  {
    timeout: 3000,            // считать ошибкой запрос дольше 3 с
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
            'Простой retry на ошибке приводит к лавине запросов. Правильный подход — экспоненциальная задержка с jitter (случайной добавкой), чтобы клиенты не синхронизировались.',
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
      id: 'workers',
      title: 'Worker threads и cluster',
      estimatedMinutes: 4,
      blocks: [
        { type: 'heading', content: 'worker_threads — для CPU-bound' },
        {
          type: 'text',
          content:
            'JSON-парсинг мегабайт, хеширование, обработка изображений — это CPU-bound. На главном потоке такая задача блокирует event loop и резко увеличивает задержку всех ответов. \`worker_threads\` создаёт отдельный поток внутри процесса.',
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
        { type: 'heading', content: 'cluster и PM2' },
        {
          type: 'text',
          content:
            'Чтобы использовать все ядра CPU, запускают N инстансов приложения. Встроенный модуль \`cluster\` или менеджер \`pm2\` распределяют запросы между ними. На современных Linux есть \`SO_REUSEPORT\` — ОС сама балансирует TCP-соединения, без мастер-процесса.',
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'В Kubernetes и других оркестраторах кластеризация обычно не нужна — оркестратор запускает несколько подов, каждый с одним Node-процессом. Это даёт изоляцию и упрощает горизонтальное масштабирование.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'memory',
      title: 'Управление памятью',
      estimatedMinutes: 4,
      blocks: [
        { type: 'heading', content: '--max-old-space-size' },
        {
          type: 'text',
          content:
            'По умолчанию V8 ограничивает heap примерно 1.5–4 GB (в зависимости от версии). Для больших процессов это поднимается флагом \`--max-old-space-size=4096\`. Превышение лимита даёт \`Allocation failed - JavaScript heap out of memory\`.',
        },
        { type: 'heading', content: 'Heap snapshot для поиска утечек' },
        {
          type: 'text',
          content:
            'Если расход памяти растёт со временем — поможет heap snapshot через Chrome DevTools (Node инспектируется при запуске с \`--inspect\`). Снимок до и после нагрузочного теста показывает, какие объекты остаются в памяти. Retainer tree указывает, кто их удерживает.',
        },
        { type: 'heading', content: 'Типичные источники утечек' },
        {
          type: 'list',
          content: `Listener на \`EventEmitter\`, добавляемый в цикле без \`removeListener\`.
Замкнутые на большие данные коллбэки, удерживаемые долгоживущим обработчиком.
Глобальный \`Map\` без ограничения размера.
Незакрытые сокеты, файловые дескрипторы (\`EMFILE: too many open files\`).
Циклические таймеры без \`clearInterval\` при завершении процесса.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Метрика \`heapUsed\` (\`process.memoryUsage().heapUsed\`) — основной показатель. Экспортируйте её в Prometheus или другой мониторинг. Постепенный рост — признак утечки, который сложно увидеть в краткосрочных нагрузочных тестах.',
        },
      ],
      checkpoint: [Q['nodeopt-q12']!],
    },
  ],

  finalQuiz: nodeOptimizationQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  cheatsheet: `### Шпаргалка по оптимизации Node.js

**Профилирование**
- \`clinic.js\`, \`0x\` — flame graph
- \`--inspect\` + Chrome DevTools
- \`perf_hooks.monitorEventLoopDelay\` — лаг loop в продакшене
- Бенчмарки: \`autocannon\`, \`k6\`, \`wrk\`

**Кеширование**
- LRU-кеш с \`max\` и \`ttl\` (lru-cache)
- Инвалидация: TTL, cache-aside, stale-while-revalidate
- HTTP-кеш: \`ETag\`, \`Cache-Control\`

**Мемоизация**
- Чистые функции, простые ключи
- Map без ограничения → утечка памяти
- Single-flight: кешировать промис, не результат

**Батчинг**
- \`DataLoader\` для группировки одинаковых запросов
- Окно 10–50 мс собирает запросы из одного тика

**Пул соединений**
- max = max_connections в БД / число реплик
- \`idleTimeout\`, \`connectionTimeout\`
- Без пула под нагрузкой соединения заканчиваются

**Circuit breaker**
- closed → open → half-open → closed
- \`opossum\`: \`errorThresholdPercentage\`, \`resetTimeout\`, \`fallback\`
- Retry с exponential backoff + jitter

**worker_threads**
- CPU-bound: JSON, crypto, изображения
- I/O-bound — не нужен, event loop справится
- Передача данных через \`postMessage\` или \`SharedArrayBuffer\`

**Память**
- \`--max-old-space-size=4096\` для больших процессов
- Heap snapshot для поиска утечек
- \`process.memoryUsage().heapUsed\` — метрика для мониторинга

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
