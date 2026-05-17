import type { Lesson } from '../../types/lesson';
import { nodeOptimizationQuiz } from '../quizzes/node-optimization';
import { nodeOptimizationFlashcards } from '../flashcards/node-optimization';

// Index quiz questions for reuse as checkpoints.
const Q = Object.fromEntries(nodeOptimizationQuiz.questions.map((q) => [q.id, q]));

// Questions used as in-chapter checkpoints (must NOT appear in finalQuiz).
const CHECKPOINT_IDS = new Set([
  'nodeopt-q1',
  'nodeopt-q3',
  'nodeopt-q4',
  'nodeopt-q5',
  'nodeopt-q7',
  'nodeopt-q11',
  'nodeopt-q12',
]);

const extraFlashcards = [
  {
    id: 'nodeop-f7',
    question: 'Чем отличается worker_threads от cluster в Node.js?',
    answer:
      'worker_threads запускает отдельный V8-инстанс в одном процессе и подходит для CPU-bound задач с возможностью разделять память через SharedArrayBuffer. cluster форкает несколько процессов Node.js, каждый со своим event loop, и масштабирует HTTP-сервер по ядрам через балансировку соединений.',
    keyPoints: [
      'worker_threads — потоки внутри одного процесса, общая память возможна',
      'cluster — отдельные процессы, общей памяти нет, общение через IPC',
      'worker_threads: для изолированных CPU-вычислений (хеши, парсинг, сжатие)',
      'cluster: для горизонтального масштабирования HTTP/gRPC по ядрам CPU',
      'Накладные расходы worker_threads ~5–10 мс, cluster — десятки мс',
    ],
  },
  {
    id: 'nodeop-f8',
    question: 'Чем мемоизация отличается от кэширования (caching)?',
    answer:
      'Мемоизация — частный случай кэширования: автоматическое запоминание результата чистой функции по её аргументам, обычно живёт в памяти процесса. Кэширование — более широкий термин: любое хранение результата с отдельной политикой инвалидации, TTL, размещением (Redis, CDN, диск).',
    keyPoints: [
      'Мемоизация: ключ = аргументы, значение = результат, чистая функция',
      'Кэширование: ключ может быть любым, политика TTL/LRU/инвалидация по событию',
      'Мемоизация обычно in-process; кэширование может быть распределённым (Redis)',
      'Мемоизация без ограничения размера → утечка памяти на бесконечном множестве аргументов',
    ],
  },
  {
    id: 'nodeop-f9',
    question: 'Почему наивная мемоизация может «съесть» память сервера?',
    answer:
      'Наивная мемоизация хранит результаты в обычном Map без ограничения размера и без TTL. На сервере, где аргументы — это пользовательские данные (id, query-параметры), множество ключей растёт неограниченно. Map удерживает значения, GC не может их освободить, heap растёт, пока процесс не упадёт с ошибкой «Out of Memory» (нехватка памяти).',
    keyPoints: [
      'На сервере аргументы редко из малого фиксированного множества',
      'Map не очищается сам — нужны LRU-вытеснение или TTL',
      'Симптом: heapUsed растёт линейно с числом уникальных вызовов',
      'Решение: LRU-cache, lru-cache npm, ограничение по размеру или времени',
    ],
  },
];

export const nodeOptimizationLesson: Lesson = {
  topicId: 'node-optimization',

  intro: {
    whyItMatters: `Node.js-серверы редко падают из-за «медленного JS» — они падают из-за неправильно построенного слоя оптимизаций. Под нагрузкой профиль типичного бэкенда складывается из четырёх повторяющихся вычислений, каждое из которых нужно ускорить отдельным паттерном. **LRU-cache** хранит горячие данные с ограниченным размером и вытесняет давно не использованные ключи: реализуется через \`Map\` за O(1) на операцию благодаря порядку вставки. **Мемоизация** — частный случай кэширования для чистых функций, но наивная версия без ограничения размера на сервере неизбежно ломает память: ключи — это пользовательские id и query-параметры, множество которых растёт линейно с трафиком, и heap растёт до OOM. **Батчинг I/O** (паттерн DataLoader) превращает N+1 запросов в один \`SELECT ... WHERE id IN (...)\` — на REST-эндпоинте с 100 связанными сущностями это даёт x100 ускорение и снимает нагрузку с БД. **Connection pool** избавляет от 50–100 мс TCP-handshake и аутентификации на каждый запрос: пул держит N открытых соединений, запрос берёт свободное за <1 мс. **Circuit breaker** защищает от каскадных отказов: после порога ошибок переключается из CLOSED в OPEN и моментально бросает \`Error('Circuit open')\` без сетевого вызова, через timeout пробует один запрос в HALF-OPEN — успех возвращает в CLOSED, ошибка снова в OPEN. **worker_threads** применяют только когда вычисление на основном потоке регулярно превышает 100 мс: создание воркера дорого (~5–10 мс), поэтому держат пул через \`piscina\`. На собеседовании эту тему разбирают через реальные ситуации: «как бы вы починили memory leak в LRU», «нарисуйте диаграмму состояний circuit breaker», «когда worker_threads, а когда cluster».`,
    estimatedMinutes: 35,
    interviewAngle:
      'Senior-интервьюер проверяет связку из пяти паттернов: LRU за O(1), мемоизация с TTL/ограничением, батчинг (DataLoader), connection pool, circuit breaker. Бонус — умение объяснить разницу worker_threads vs cluster и показать, как профилировать узкое место через perf_hooks и clinic.',
    prerequisites: [{ slug: 'node-event-loop', title: 'Event Loop в Node.js' }],
  },

  resources: {
    videos: [
      {
        source: 'youtube',
        id: 'G9Vkpe55Gu8',
        title: 'My Node.js Process Is On Fire — Matteo Collina (JSConf.Asia 2018)',
        channel: 'JSConf',
        language: 'en',
        durationSec: 30 * 60,
        description:
          'Маттео Коллина проходит сценарий «приложение легло под нагрузкой» и шаг за шагом показывает, как находить и устранять узкие места: clinic, autocannon, flame graphs, профайлинг event loop.',
      },
      {
        source: 'youtube',
        id: '81AqwvXqgG0',
        title: 'Do Not Thrash the Node.js Event Loop — Matteo Collina',
        channel: 'NearForm',
        language: 'en',
        durationSec: 25 * 60,
        description:
          'Глубокий разбор того, как тяжёлая синхронная работа и большие JSON-объекты «забивают» event loop, как это измерить через perf_hooks и какие паттерны (батчинг, потоковый JSON, worker_threads) спасают latency.',
      },
    ],
    links: [
      {
        url: 'https://nodejs.org/api/worker_threads.html',
        title: 'Worker Threads — официальная документация Node.js',
        source: 'nodejs-docs',
        language: 'en',
        note: 'Когда применять worker_threads, как обмениваться сообщениями и делиться памятью через SharedArrayBuffer.',
      },
      {
        url: 'https://netflixtechblog.com/making-the-netflix-api-more-resilient-a8ec62159c2d',
        title: 'Making the Netflix API More Resilient — Netflix Tech Blog',
        source: 'article',
        language: 'en',
        note: 'Классический пост про circuit breaker в production: как Netflix защитил API от каскадных отказов через Hystrix.',
      },
      {
        url: 'https://github.com/isaacs/node-lru-cache',
        title: 'node-lru-cache — реализация LRU от автора npm',
        source: 'github',
        language: 'en',
        note: 'Production-grade LRU с TTL, max-size, размером в байтах и весом записей. Эталон для собственной реализации.',
      },
      {
        url: 'https://github.com/graphql/dataloader',
        title: 'DataLoader — паттерн батчинга от Facebook',
        source: 'github',
        language: 'en',
        note: 'Эталонная реализация батчинга и кэширования за один тик event loop. Используется почти во всех GraphQL-серверах.',
      },
      {
        url: 'https://blog.platformatic.dev/the-fastest-nodejs-orm',
        title: 'Production caching patterns — Platformatic',
        source: 'article',
        language: 'en',
        note: 'Современный (2024+) разбор кэширования в Node.js: in-process LRU, Redis, инвалидация по событию.',
      },
    ],
  },

  chapters: [
    {
      id: 'profiling',
      title: 'Профилирование: измеряем перед тем, как оптимизировать',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Главное правило оптимизации Node.js — **не угадывать, а измерять**. Преждевременная оптимизация ломает читаемость кода и часто промахивается мимо настоящего узкого места. Сначала находим bottleneck профайлером, потом применяем подходящий паттерн.',
        },
        {
          type: 'list',
          content: `Инструменты для production-Node:
- **\`process.hrtime.bigint()\`** — монотонные часы с наносекундной точностью. Не «прыгает» при NTP-синхронизации, в отличие от \`Date.now()\`.
- **\`perf_hooks.performance\`** — стандартный Performance API: \`mark\`/\`measure\`, \`monitorEventLoopDelay()\` для метрики event loop lag.
- **\`node --prof app.js\`** — встроенный профайлер V8. Результат обрабатывается через \`node --prof-process isolate-*.log\`.
- **\`clinic\`** — три инструмента в одном: \`clinic doctor\` (общая диагностика), \`clinic flame\` (flame graph), \`clinic heapprofiler\` (память).
- **Chrome DevTools** — запускаем процесс через \`node --inspect\` и подключаемся вкладкой \`chrome://inspect\` для CPU/heap-снапшотов.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { performance, monitorEventLoopDelay } = require('perf_hooks');

// 1. Измерение длительности конкретного участка кода.
performance.mark('handleRequest:start');
await handleRequest(req);
performance.mark('handleRequest:end');
performance.measure('handleRequest', 'handleRequest:start', 'handleRequest:end');
const [m] = performance.getEntriesByName('handleRequest');
metrics.histogram('request_ms', m.duration);

// 2. Метрика event loop lag — главный индикатор здоровья сервера.
const histogram = monitorEventLoopDelay({ resolution: 20 });
histogram.enable();
setInterval(() => {
  console.log('p99 lag:', (histogram.percentile(99) / 1e6).toFixed(1), 'ms');
  histogram.reset();
}, 10_000);`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Если event loop lag p99 > 100 мс — на сервере есть синхронная блокировка. Это первое, что нужно искать перед тем, как добавлять кэши и пулы.',
        },
      ],
      docsLink: { url: 'https://metanit.com/web/nodejs/5.1.php', title: 'Отладка Node.js — metanit.com' },
    },

    {
      id: 'lru-cache',
      title: 'LRU Cache: O(1) через Map',
      estimatedMinutes: 8,
      blocks: [
        {
          type: 'text',
          content:
            '**LRU (Least Recently Used)** — стратегия вытеснения, при которой из кэша удаляется элемент, к которому дольше всего не обращались. На сервере это самый частый выбор: горячие пользователи остаются, давно не активные вытесняются автоматически.',
        },
        {
          type: 'text',
          content:
            'Ключевая идея реализации в JavaScript — `Map` сохраняет порядок вставки. Самый старый элемент — первый в `map.keys()`. При обращении к ключу мы удаляем его и вставляем заново — он становится «свежим» и перемещается в конец. Все операции — O(1).',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);   // удаляем со старой позиции
    this.cache.set(key, value); // вставляем в конец (самый свежий)
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // вытесняем самый старый — первый ключ итератора
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Альтернатива — двусвязный список + HashMap. Идея та же (за O(1) перемещаем узлы в голову списка), но в JS реализация через `Map` короче и быстрее, потому что движок V8 уже оптимизировал её под сценарий «вставка/удаление + сохранение порядка».',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Демонстрация порядка вытеснения.
const cache = new LRUCache(2);
cache.put(1, 'a');     // [1]
cache.put(2, 'b');     // [1, 2]
cache.get(1);          // 'a' — 1 теперь свежий: [2, 1]
cache.put(3, 'c');     // capacity=2 → вытесняем самый старый (2): [1, 3]
console.log(cache.get(2)); // -1`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Самая частая ошибка реализации — забыть `delete` перед `set` в `get`. Без этого ключ остаётся на старой позиции, и LRU превращается в FIFO. На собеседовании это проверяют трассировкой 4–5 операций.',
        },
      ],
      flashcardIds: ['nodeop-f1'],
      checkpoint: [Q['nodeopt-q1']!, Q['nodeopt-q12']!],
      docsLink: { url: 'https://learn.javascript.ru/map-set', title: 'Map и Set — learn.javascript.ru' },
      playground: {
        starterCode: `// Реализуйте LRU Cache на 2 элемента и предскажите вывод.
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const v = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, v);
    return v;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity)
      this.cache.delete(this.cache.keys().next().value);
    this.cache.set(key, value);
  }
}

const c = new LRUCache(2);
c.put(1, 'a');
c.put(2, 'b');
c.get(1);
c.put(3, 'c');
console.log(c.get(2));
console.log(c.get(1));
console.log(c.get(3));`,
        expectedOutput: '-1\na\nc',
        description:
          'Запустите код и убедитесь, что после `get(1)` ключ 1 стал свежим, поэтому при добавлении ключа 3 вытесняется именно 2.',
      },
    },

    {
      id: 'memoization-pitfalls',
      title: 'Мемоизация: чем отличается от кэша и где ломает память',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            '**Мемоизация** — частный случай кэширования: автоматическое запоминание результата **чистой** функции по её аргументам. **Кэширование** — более широкий термин: любое хранение результата с собственной политикой инвалидации, TTL, размещением (Redis, CDN, диск).',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Наивная мемоизация — БЕЗ ограничения размера.
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const value = fn.apply(this, args);
    cache.set(key, value);
    return value;
  };
}

// 🔴 На сервере: ключ = userId или query.search
// → множество ключей растёт неограниченно → heap → OOM
const getUser = memoize((id) => db.users.findById(id));`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'На сервере наивная мемоизация почти всегда ошибка: аргументы — это пользовательские данные. Map не очищается сам, GC не может освободить значения, heap растёт, пока процесс не упадёт с ошибкой «Out of Memory» (нехватка памяти). Производственное правило: **любая** мемоизация на сервере должна иметь ограничение по размеру (LRU) или TTL.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ✅ Мемоизация с TTL — кэш истекает через ttl мс.
function memoizeWithTTL(fn, ttl) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    if (cached && Date.now() - cached.time < ttl) {
      return cached.value;
    }
    const value = fn.apply(this, args);
    cache.set(key, { value, time: Date.now() });
    return value;
  };
}

// ✅ Мемоизация поверх LRU — ограничение по размеру.
function memoizeLRU(fn, capacity) {
  const cache = new LRUCache(capacity);
  return function (...args) {
    const key = JSON.stringify(args);
    const hit = cache.get(key);
    if (hit !== -1) return hit;
    const value = fn.apply(this, args);
    cache.put(key, value);
    return value;
  };
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Эвристика выбора: малое фиксированное множество аргументов (числа, флаги) — обычная мемоизация. Пользовательские id — мемоизация поверх LRU. Регулярно меняющиеся данные — мемоизация с TTL или внешний кэш (Redis) с инвалидацией по событию.',
        },
      ],
      flashcardIds: ['nodeop-f2', 'nodeop-f8', 'nodeop-f9'],
      checkpoint: [Q['nodeopt-q3']!, Q['nodeopt-q11']!],
      docsLink: { url: 'https://learn.javascript.ru/closure', title: 'Замыкания — learn.javascript.ru' },
    },

    {
      id: 'batching-pools',
      title: 'Батчинг I/O и пулы соединений',
      estimatedMinutes: 7,
      blocks: [
        { type: 'heading', content: 'DataLoader: лекарство от N+1' },
        {
          type: 'text',
          content:
            '**N+1** — классическая проблема: для N записей делается N+1 запросов к БД (1 на список + N на связанные данные). Паттерн **DataLoader** собирает индивидуальные `load(id)` за один тик event loop в один батчевый `SELECT ... WHERE id IN (...)`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function createBatcher(batchFn, maxSize, maxWait) {
  let batch = [];
  let resolvers = [];
  let timer = null;

  function flush() {
    const items = batch;
    const rs = resolvers;
    batch = [];
    resolvers = [];
    clearTimeout(timer);
    timer = null;
    Promise.resolve(batchFn(items)).then((results) => {
      rs.forEach((resolve, i) => resolve(results[i]));
    });
  }

  return function add(item) {
    return new Promise((resolve) => {
      batch.push(item);
      resolvers.push(resolve);
      if (batch.length >= maxSize) flush();
      else if (!timer) timer = setTimeout(flush, maxWait);
    });
  };
}

const loadUser = createBatcher(
  async (ids) => db.query('SELECT * FROM users WHERE id IN (?)', ids),
  50, 5,
);

// 100 параллельных вызовов → 1 SQL-запрос:
await Promise.all(postIds.map((id) => loadUser(id)));`,
        },
        { type: 'heading', content: 'Connection pool: убираем TCP-handshake' },
        {
          type: 'text',
          content:
            'Создание соединения с БД — это TCP-handshake (1 RTT) + TLS (1–2 RTT) + аутентификация. На локальной сети это 50–100 мс, через интернет — 200+ мс. На сервере с 1000 RPS открывать соединение на каждый запрос невозможно физически.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { Pool } = require('pg');

const pool = new Pool({
  max: 20,                    // максимум 20 соединений
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
});

// shorthand: pool.query сам берёт соединение и освобождает
const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

// Транзакция: явно занять и освободить соединение в finally.
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [100, 1]);
  await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [100, 2]);
  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release(); // ВСЕГДА — иначе пул протечёт
}`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Размер пула — обычно `CPU_count × 2..4`. Слишком большой пул нагружает БД (там тоже свой лимит соединений). Слишком маленький — запросы встают в очередь и latency растёт. Метрика для мониторинга: `pool.totalCount`, `pool.waitingCount`.',
        },
      ],
      flashcardIds: ['nodeop-f3', 'nodeop-f4'],
      docsLink: { url: 'https://metanit.com/web/nodejs/4.1.php', title: 'HTTP-сервер — metanit.com' },
    },

    {
      id: 'circuit-breaker',
      title: 'Circuit Breaker: защита от каскадных отказов',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'Когда внешний сервис деградирует (отвечает за 30 секунд вместо 100 мс), на нашем сервере мгновенно копятся подвисшие запросы: каждый из них держит соединение, поток в thread pool, память. Через минуту event loop забит, сервер «лежит», хотя основной код работает корректно. **Circuit breaker** — паттерн, который размыкает цепь и моментально возвращает ошибку без сетевого вызова.',
        },
        {
          type: 'list',
          content: `Три состояния:
- **CLOSED** — нормальная работа. Все вызовы проходят к реальному сервису, ошибки считаются.
- **OPEN** — после порога ошибок цепь разомкнута. Любой вызов мгновенно бросает \`Error('Circuit open')\` без сетевого запроса. Это **fail-fast**: клиент получает ошибку за микросекунды вместо ожидания таймаута.
- **HALF-OPEN** — через timeout пробуем один запрос. Успех → CLOSED (счётчик ошибок сбрасывается). Ошибка → обратно в OPEN.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function createCircuitBreaker(fn, threshold, timeout) {
  let state = 'CLOSED';
  let failures = 0;
  let nextAttempt = 0;

  return async function (...args) {
    if (state === 'OPEN') {
      if (Date.now() < nextAttempt) {
        throw new Error('Circuit open');
      }
      state = 'HALF-OPEN'; // время вышло — пробуем один запрос
    }

    try {
      const result = await fn(...args);
      failures = 0;
      state = 'CLOSED';
      return result;
    } catch (err) {
      failures++;
      if (failures >= threshold) {
        state = 'OPEN';
        nextAttempt = Date.now() + timeout;
      }
      throw err;
    }
  };
}

const safeCall = createCircuitBreaker(unstableApi, 5, 30_000);
// 5 ошибок подряд → OPEN на 30 секунд → HALF-OPEN → проба`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Production-готовые библиотеки: `opossum` (порт Hystrix на Node.js) добавляет метрики, fallback-функцию, статистику в реальном времени. На паре сервисов можно обойтись своей реализацией — но как только их > 10, переходите на opossum.',
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Без circuit breaker один медленный downstream-сервис кладёт весь сервер: пул соединений к нему забивается, event loop забит подвисшими промисами. Это и называется «каскадный отказ» — ошибка одного компонента валит остальные.',
        },
      ],
      flashcardIds: ['nodeop-f6'],
      checkpoint: [Q['nodeopt-q7']!],
      docsLink: { url: 'https://metanit.com/web/nodejs/4.1.php', title: 'HTTP-сервер — metanit.com' },
    },

    {
      id: 'workers',
      title: 'Worker Threads vs Cluster: когда что',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Любая синхронная операция дольше ~10 мс на основном потоке мешает event loop. Если регулярно встречается тяжёлое CPU-вычисление (хеширование пароля, парсинг большого JSON, ML-инференс), его выносят в отдельный поток или процесс.',
        },
        {
          type: 'list',
          content: `Сравнение:
- **\`worker_threads\`** — отдельный V8-инстанс в **том же процессе**. Один поток на каждый воркер. Можно делиться памятью через \`SharedArrayBuffer\` и \`Atomics\` — это **zero-copy**. Накладные расходы создания ~5–10 мс, поэтому держат пул через \`piscina\`. Подходит для **изолированных CPU-задач**: hash, parse, compress.
- **\`cluster\`** — несколько **процессов** Node.js на одном порту, master распределяет соединения. У каждого процесса свой event loop, своя память. Общение через IPC (медленнее SharedArrayBuffer на порядок). Подходит для **горизонтального масштабирования HTTP** по числу ядер.
- **Внешний микросервис** — если задача регулярно > 1 секунды или нужна другая платформа (Rust для криптографии, Go для хеширования). Общение через HTTP/gRPC/очередь.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// main.js — пул worker_threads.
const { Worker } = require('worker_threads');

class WorkerPool {
  constructor(size, file) {
    this.workers = Array.from({ length: size }, () => ({
      worker: new Worker(file),
      busy: false,
    }));
    this.queue = [];
  }

  run(data) {
    return new Promise((resolve, reject) => {
      const slot = this.workers.find((w) => !w.busy);
      if (slot) this._exec(slot, data, resolve, reject);
      else this.queue.push({ data, resolve, reject });
    });
  }

  _exec(slot, data, resolve, reject) {
    slot.busy = true;
    slot.worker.once('message', (result) => {
      slot.busy = false;
      resolve(result);
      const next = this.queue.shift();
      if (next) this._exec(slot, next.data, next.resolve, next.reject);
    });
    slot.worker.once('error', reject);
    slot.worker.postMessage(data);
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Эвристика: < 10 мс — основной поток. 10–100 мс — батчинг через `setImmediate` (см. урок про event loop). > 100 мс или регулярная нагрузка — `worker_threads` с пулом. Несколько ядер CPU и обычный HTTP — добавьте `cluster` поверх (или используйте PM2 в `cluster mode`).',
        },
      ],
      flashcardIds: ['nodeop-f7'],
      checkpoint: [Q['nodeopt-q4']!, Q['nodeopt-q5']!],
      docsLink: { url: 'https://metanit.com/web/nodejs/17.1.php', title: 'Worker Threads — metanit.com' },
    },

    {
      id: 'memory',
      title: 'Память V8 и утечки',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'V8 использует **поколенческую сборку мусора**. Знание архитектуры памяти помогает писать код, дружественный к GC, и быстро находить утечки.',
        },
        {
          type: 'list',
          content: `- **Young Generation (New Space)** — новые объекты, ~1–8 МБ. Minor GC (Scavenge) — быстрый, частый. Выжившие переезжают в Old Space.
- **Old Generation (Old Space)** — долгоживущие объекты, ~64 МБ–1.5 ГБ. Major GC (Mark-Sweep-Compact) — медленный, вызывает паузы 10–100 мс.
- **Large Object Space** — объекты > 512 КБ, не перемещаются.
- **Code Space** — скомпилированный JIT-код.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Мониторинг heap.
setInterval(() => {
  const m = process.memoryUsage();
  console.log({
    heapUsed: (m.heapUsed / 1024 / 1024).toFixed(1) + ' MB',
    heapTotal: (m.heapTotal / 1024 / 1024).toFixed(1) + ' MB',
    rss: (m.rss / 1024 / 1024).toFixed(1) + ' MB',
    external: (m.external / 1024 / 1024).toFixed(1) + ' MB',
  });
}, 5_000);

// Лимит V8 heap (по умолчанию ~1.5 ГБ на 64-битной системе).
// node --max-old-space-size=4096 app.js`,
        },
        {
          type: 'list',
          content: `Три самых частых источника утечек:
- **Глобальные коллекции без TTL/LRU** — кэши, мапы запросов, истории вызовов. Решение: ограничивайте размер.
- **Забытые подписчики EventEmitter** — \`emitter.on('data', handler)\` без \`off()\`. Симптом: \`MaxListenersExceededWarning\`. Решение: \`once()\` или явный \`removeListener\`.
- **Замыкания, удерживающие большие буферы** — обработчик хранит ссылку на 10 МБ Buffer, который ему не нужен. Решение: вынести handler наружу или явно \`bigBuffer = null\` после использования.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Алгоритм поиска утечки: 1) график `heapUsed` за час — если линейно растёт, утечка есть; 2) сделайте два heap snapshot через `node --inspect` — до и после нагрузки; 3) во вкладке Comparison ищите классы с большим `Δ Retained Size`; 4) в retainer tree смотрите, кто держит ссылки.',
        },
      ],
      flashcardIds: ['nodeop-f5'],
      docsLink: { url: 'https://metanit.com/web/nodejs/5.1.php', title: 'Отладка Node.js — metanit.com' },
    },
  ],

  // Все вопросы из старого квиза, кроме тех, что ушли в checkpoint.
  finalQuiz: nodeOptimizationQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  // Реюзаем существующие карточки и добавляем новые.
  flashcards: [...nodeOptimizationFlashcards.cards, ...extraFlashcards],

  cheatsheet: `### Шпаргалка по оптимизации Node.js

- **LRU через Map**: \`get\` = delete + set, \`put\` = удалить старый ключ \`map.keys().next().value\`. Все операции O(1).
- **Мемоизация на сервере** ВСЕГДА с лимитом: LRU или TTL. Иначе память заканчивается и процесс падает.
- **Кэш vs мемоизация**: мемоизация — частный случай кэша для чистых функций по аргументам.
- **Батчинг (DataLoader)**: N+1 → 1 запрос \`WHERE id IN (...)\`. Сбор за один тик event loop.
- **Connection pool**: TCP-handshake 50–100 мс на запрос → пул из \`CPU × 2..4\` соединений. Всегда \`release()\` в \`finally\`.
- **Circuit breaker**: CLOSED → (N ошибок) → OPEN (моментальный throw без вызова) → (timeout) → HALF-OPEN → CLOSED при успехе. Защищает от каскадных отказов.
- **worker_threads**: для CPU-bound > 100 мс. Пул через \`piscina\`. \`SharedArrayBuffer\` для zero-copy.
- **cluster**: горизонтальное масштабирование HTTP по ядрам, отдельные процессы.
- **Метрики**: event loop lag p99, heapUsed, pool.waitingCount, RPS.`,

  interviewQA: [
    {
      id: 'nodeopt-iq1',
      question: 'Опишите алгоритм LRU cache. Как добиться O(1) для get и put?',
      shortAnswer:
        'LRU вытесняет элемент, к которому дольше всего не обращались. В JS реализуется через Map: при get удаляем и заново вставляем ключ (он переезжает в конец как «свежий»), при put — удаляем самый старый через map.keys().next().value. Все операции O(1).',
      fullAnswer: `LRU (Least Recently Used) — стратегия вытеснения, при которой при переполнении кэша удаляется элемент, к которому дольше всего не обращались.

Классическая академическая реализация — двусвязный список + HashMap. HashMap даёт O(1) поиск узла по ключу, двусвязный список позволяет за O(1) перенести узел в голову (свежий) и удалить хвост (самый старый).

В JavaScript есть короткий путь: \`Map\` уже сохраняет порядок вставки. Самый старый элемент — первый по \`map.keys()\`.

\`\`\`js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const v = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, v);
    return v;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity)
      this.cache.delete(this.cache.keys().next().value);
    this.cache.set(key, value);
  }
}
\`\`\`

Все операции \`Map.has\`, \`Map.delete\`, \`Map.set\`, \`Map.keys().next().value\` — O(1) в V8 (хеш-таблица + связный список итерации). Отсюда O(1) на каждую публичную операцию.

Самая частая ошибка — забыть \`delete\` перед \`set\` в \`get\`. Без этого LRU превращается в FIFO: элемент остаётся на старой позиции и вытесняется не по «свежести», а по моменту вставки.`,
      followUps: [
        'Чем LRU отличается от LFU и когда выбирать каждый?',
        'Как реализовать LRU с TTL — двойное вытеснение по времени и по размеру?',
      ],
      relatedChapterId: 'lru-cache',
    },
    {
      id: 'nodeopt-iq2',
      question: 'Что такое circuit breaker и в каких состояниях он бывает?',
      shortAnswer:
        'Circuit breaker размыкает вызовы к деградирующему сервису после порога ошибок и моментально возвращает ошибку без сетевого запроса. Три состояния: CLOSED (всё проходит), OPEN (мгновенный throw без вызова), HALF-OPEN (через timeout — пробный вызов, успех → CLOSED, ошибка → OPEN).',
      fullAnswer: `Circuit breaker — паттерн отказоустойчивости из распределённых систем. Решает проблему каскадных отказов: когда внешний сервис отвечает медленно (или вообще не отвечает), на нашем сервере копятся подвисшие запросы — каждый держит соединение, поток thread pool, память. Через минуту event loop забит, сервер «лежит».

Решение: оборачиваем вызов в state machine с тремя состояниями.

- **CLOSED** — нормальная работа. Все вызовы идут к реальному сервису. Если успех — счётчик ошибок сбрасывается. Если ошибка — счётчик растёт. По достижении порога переходим в OPEN.
- **OPEN** — цепь разомкнута. Любой вызов **немедленно** бросает \`Error('Circuit open')\`, без сетевого запроса. Это fail-fast: клиент получает ошибку за микросекунды вместо ожидания таймаута. Запоминается \`nextAttempt = Date.now() + timeout\`.
- **HALF-OPEN** — после \`timeout\` пробуем один вызов. Если успех — переходим в CLOSED, обнуляем счётчик. Если ошибка — снова OPEN с новым \`nextAttempt\`.

Польза:
- Снижает latency для клиентов (не ждут таймаута).
- Разгружает деградирующий сервис: вместо лавины retry-запросов он получает только пробные вызовы из HALF-OPEN.
- Изолирует наш сервер от cascade failure.

В production обычно используют библиотеку \`opossum\` (порт Netflix Hystrix): добавляет метрики, fallback-функцию, percentile-based threshold.`,
      followUps: [
        'Чем threshold по числу ошибок отличается от threshold по проценту ошибок?',
        'Как circuit breaker сочетается с retry и timeout?',
      ],
      relatedChapterId: 'circuit-breaker',
    },
    {
      id: 'nodeopt-iq3',
      question: 'Чем мемоизация отличается от кэширования?',
      shortAnswer:
        'Мемоизация — частный случай кэширования: автоматическое запоминание результата чистой функции по её аргументам, обычно in-process. Кэширование — более широкий термин: любое хранение результата с собственной политикой инвалидации, TTL, размещением (Redis, CDN, диск).',
      fullAnswer: `**Мемоизация** — это технический приём: оборачиваем функцию декоратором, который запоминает пары \`(args → result)\` в \`Map\`. Ключевые признаки: автоматичность (программист не пишет логику кэша), привязка к чистой функции (для одних и тех же аргументов всегда один результат), in-process хранение.

**Кэширование** — широкая концепция: любое хранение результата для повторного использования. У кэша есть отдельные характеристики:
- **Размещение**: in-process (Map), shared (Redis, Memcached), edge (CDN).
- **Политика вытеснения**: LRU, LFU, FIFO, размер в байтах, TTL.
- **Инвалидация**: по событию (когда данные изменились), по времени (TTL), вручную.
- **Уровень**: HTTP-cache (заголовки), application-cache, database query-cache.

Мемоизация умещается в одну строчку \`memoize(fn)\`. Кэширование — это архитектурное решение, требующее проектирования инвалидации и согласованности.

Где это важно на практике:
- Если функция чистая и ключевое множество ограничено (числа, флаги) — мемоизация без TTL подходит.
- Если ключи это пользовательские данные — наивная мемоизация **сломает память**, нужно ограничение (LRU или TTL).
- Если данные регулярно обновляются и их видят несколько процессов — нужен распределённый кэш с инвалидацией по событию (Redis pub/sub).

На собеседовании частый подвох: «можно ли мемоизировать \`fetchUser(id)\`?» Правильный ответ — только с LRU или TTL и с пониманием семантики (что считается «свежими» данными).`,
      followUps: [
        'Какая политика инвалидации сложнее всего реализуется и почему?',
        'Что такое stale-while-revalidate и в каких слоях кэша применяется?',
      ],
      relatedChapterId: 'memoization-pitfalls',
    },
    {
      id: 'nodeopt-iq4',
      question: 'Когда использовать worker_threads, а когда cluster?',
      shortAnswer:
        'worker_threads — для изолированных CPU-bound задач внутри одного процесса с возможностью разделять память через SharedArrayBuffer. cluster — для горизонтального масштабирования HTTP-сервера: несколько процессов слушают один порт, балансировка по соединениям.',
      fullAnswer: `Это два разных уровня параллелизма в Node.js:

**worker_threads** — потоки внутри одного процесса. Каждый воркер — отдельный V8-инстанс со своим event loop. Преимущества:
- Можно делиться памятью через \`SharedArrayBuffer\` и \`Atomics\` (zero-copy). Это критично для тяжёлых данных вроде больших Buffer или ML-тензоров.
- Создание дешевле, чем \`child_process\`: ~5–10 мс.
- Один процесс — общий пул соединений, общая инициализация.

Когда использовать: **изолированная CPU-bound задача**, которая регулярно занимает > 100 мс. Хеширование паролей (bcrypt), парсинг большого JSON, сжатие, ML-инференс. На каждый запрос воркер создавать дорого — используют пул через \`piscina\`.

**cluster** — несколько **процессов** Node.js, каждый со своим event loop и памятью. Master-процесс слушает порт и распределяет соединения по воркерам. Преимущества:
- Линейное масштабирование HTTP по числу ядер CPU: 8 ядер ≈ 8× RPS.
- Изоляция: падение одного процесса не валит остальных.
- Совместимо с PM2 / Kubernetes, любым process manager.

Когда использовать: **общее увеличение пропускной способности HTTP-сервера**. Каждый процесс делает то же самое, что один процесс — обрабатывает запросы.

Принципиальное правило: если **одна задача** медленная — \`worker_threads\`. Если **сервер в целом** упирается в одно ядро при множестве независимых запросов — \`cluster\`. На больших проектах применяют оба: \`cluster\` поверх, в каждом процессе пул \`worker_threads\` для тяжёлых вычислений.`,
      followUps: [
        'Как cluster распределяет соединения — round-robin или по нагрузке?',
        'В чём разница SharedArrayBuffer и MessageChannel.postMessage?',
      ],
      relatedChapterId: 'workers',
    },
    {
      id: 'nodeopt-iq5',
      question: 'Что такое connection pool и зачем он нужен?',
      shortAnswer:
        'Connection pool — пул заранее созданных соединений с БД. Запрос берёт свободное соединение за <1 мс вместо 50–100 мс на TCP-handshake + аутентификацию. Под нагрузкой это разница между сервером, который держит 1000 RPS, и тем, который ложится при 100.',
      fullAnswer: `Каждое новое соединение с БД — это полноценный TCP-handshake (1 RTT), TLS-handshake (1–2 RTT) и аутентификация (отправка credentials, проверка). Суммарно на локальной сети 50–100 мс, через интернет — 200+ мс.

Без пула на каждый HTTP-запрос:
\`\`\`
[HTTP request] → connect() 80ms → query 10ms → close() → [response]
\`\`\`
80 мс из 90 — это overhead, который не приносит пользы. На 1000 RPS это физически невозможно: \`open\`/\`close\` исчерпают tcp-сокеты системы.

Пул держит \`max\` соединений готовыми. Запрос:
\`\`\`
[HTTP request] → pool.acquire() 0.5ms → query 10ms → pool.release() → [response]
\`\`\`

Размер пула — компромисс:
- Слишком **большой** пул нагружает БД (у PostgreSQL по умолчанию max_connections=100; кластер из 50 инстансов с пулом 20 даст 1000 — БД упадёт).
- Слишком **маленький** — запросы встают в очередь, latency растёт.

Эвристика: \`CPU_count × 2..4\` на инстанс. Дополнительно мониторят:
- \`pool.totalCount\` — сколько всего соединений
- \`pool.idleCount\` — свободных
- \`pool.waitingCount\` — клиентов в очереди (если > 0 — увеличить пул или БД-машину)

Критическое правило: **всегда** освобождайте соединение в \`finally\`. Иначе пул протекает: clients берут соединение, не возвращают, новые запросы зависают навсегда.

Похожий паттерн применяется не только к БД: HTTP keep-alive (\`http.Agent\`), Redis-клиент, gRPC-каналы — все они под капотом держат пул.`,
      followUps: [
        'Чем pgbouncer-style pooling отличается от пула на стороне приложения?',
        'Как мониторить leak соединений и graceful shutdown пула?',
      ],
      relatedChapterId: 'batching-pools',
    },
    {
      id: 'nodeopt-iq6',
      question: 'Как найти memory leak в production Node.js приложении?',
      shortAnswer:
        'Сначала смотрят график heapUsed: линейный рост = утечка. Затем делают два heap snapshot через node --inspect — до и после нагрузки. В Comparison-вкладке Chrome DevTools ищут классы с большим Δ Retained Size, в retainer tree находят, кто держит ссылки.',
      fullAnswer: `Алгоритм диагностики:

1. **Подтвердить утечку**. Метрика \`process.memoryUsage().heapUsed\` за час нагрузки. Если она линейно растёт и не падает после major GC — это утечка. Если растёт и стабилизируется — это просто прогрев кэшей.

2. **Снять heap snapshot до и после**. Запускаем процесс с \`node --inspect\`, в Chrome открываем \`chrome://inspect\`, вкладка Memory → Take heap snapshot. Делаем первый снимок в холодном состоянии, прогоняем нагрузку (100–1000 типичных запросов), делаем второй снимок.

3. **Compare snapshots**. В режиме Comparison сортируем по \`Δ Retained Size\`. Сверху будут классы, чьи объекты не освободились: \`Closure\`, \`Array\`, \`Object\`, ваши доменные сущности.

4. **Retainer tree**. Кликаем на подозрительный объект, открываем нижнюю панель Retainers. Это цепочка: «этот объект жив, потому что его держит вот этот, а его держит вот этот». Дойдя до корня, находим причину — обычно это глобальная Map, EventEmitter или замыкание.

5. **Проверка гипотезы**. Исправляем код, запускаем нагрузочный тест, смотрим — стал ли heapUsed стабильным.

Три самых частых причины утечек в Node.js:
- **Глобальный кэш без TTL/LRU** — \`const cache = {}; cache[req.userId] = data;\` Решение: ограничение размера.
- **Забытые подписчики EventEmitter** — \`emitter.on('data', handler)\` без \`off()\`. Симптом: \`MaxListenersExceededWarning\`. Решение: \`once()\` или \`removeListener\`.
- **Замыкание удерживает большой объект** — обработчик не использует \`bigBuffer\`, но замыкание держит весь scope. Решение: вынести handler наружу или \`bigBuffer = null\` после использования.

Инструменты помимо DevTools: \`clinic heapprofiler\`, npm-пакет \`heapdump\` (для production без \`--inspect\`).`,
      followUps: [
        'Чем WeakMap помогает избежать утечек?',
        'Как graceful shutdown связан с диагностикой утечек?',
      ],
      relatedChapterId: 'memory',
    },
    {
      id: 'nodeopt-iq7',
      question: 'Как профилировать Node.js-сервер и какие метрики смотреть в первую очередь?',
      shortAnswer:
        'Главные метрики: event loop lag p99, RPS, latency p50/p99, heapUsed, pool.waitingCount. Инструменты: perf_hooks.monitorEventLoopDelay, clinic doctor/flame, Chrome DevTools через --inspect, prom-client + Grafana.',
      fullAnswer: `Профилирование начинается с метрик, а не с инструментов.

**Базовый набор метрик production-сервера**:
- **Event loop lag p99**. Если > 100 мс — есть синхронная блокировка на главном потоке. Снимается через \`perf_hooks.monitorEventLoopDelay({ resolution: 20 })\`.
- **RPS и latency p50/p99**. Latency p99 растёт раньше, чем RPS падает — это первый сигнал перегрузки.
- **\`process.memoryUsage()\`** — heapUsed, heapTotal, rss, external. Линейный рост heapUsed = утечка.
- **\`pool.waitingCount\`** для каждого пула (БД, Redis). > 0 означает, что запросы стоят в очереди — узкое место в пуле.
- **CPU usage**. Если близко к 100% — пора в \`worker_threads\` или \`cluster\`.

**Инструменты глубокой диагностики**:
- **\`clinic doctor\`** — быстрая общая диагностика: показывает event loop lag, CPU, память, выдаёт рекомендации.
- **\`clinic flame\`** — flame graph: где горячая точка по CPU. Первое, что смотрят при проблемах с latency.
- **\`clinic heapprofiler\`** — heap-снапшоты, поиск утечек.
- **\`node --prof app.js\`** + \`node --prof-process\` — встроенный V8-профайлер. Менее удобен, но работает без зависимостей.
- **\`node --inspect\` + Chrome DevTools** — интерактивный CPU-профайлинг и heap-снапшоты в боевой среде.
- **\`prom-client\`** — экспорт метрик в Prometheus. Стандарт de facto для production-мониторинга.

**Алгоритм**: метрики → определяем тип проблемы (CPU / память / I/O) → нужный инструмент → исправляем → повторяем замер. Не оптимизируем без измерения — почти всегда промахиваешься.`,
      followUps: [
        'Что такое \`async_hooks\` и какие задачи они решают в профилировании?',
        'Как настроить tracing запросов через OpenTelemetry в Node.js?',
      ],
      relatedChapterId: 'profiling',
    },
  ],

  nextTopics: [
    { slug: 'node-streams', reason: 'Стримы — следующий слой оптимизации I/O: backpressure и pipeline без копирования данных в память.' },
    { slug: 'node-network', reason: 'Сеть и HTTP — где живут пулы соединений, keep-alive и rate limiting на практике.' },
  ],

  related: [
    { kind: 'pattern', id: 'lru', label: 'Паттерн: LRU-кэш через Map за O(1)' },
    { kind: 'pattern', id: 'circuit-breaker', label: 'Паттерн: circuit breaker — защита от каскадных отказов' },
  ],
};
