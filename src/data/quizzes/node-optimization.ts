import type { TopicQuiz } from '../../types/quiz';

export const nodeOptimizationQuiz: TopicQuiz = {
  topicId: 'node-optimization',
  questions: [
    {
      type: 'output',
      id: 'nodeopt-q1',
      description: 'LRU Cache. Что вернёт get(2) после следующих операций?',
      code: `const cache = new LRUCache(2);
cache.put(1, 'a');
cache.put(2, 'b');
cache.get(1);       // обращение к ключу 1
cache.put(3, 'c');  // кэш полный — вытесняем LRU
cache.get(2);       // ?`,
      options: ['-1 (ключ 2 вытеснен)', '"b" (ключ 2 остался)', '"c"', 'undefined'],
      correctIndex: 0,
      explanation: 'После `get(1)` — ключ 1 стал "свежим", ключ 2 стал самым давним. При `put(3)` кэш полный (capacity=2) — вытесняется LRU элемент: ключ 2. `get(2)` → -1. LRU = Least Recently Used: вытесняется тот, к которому дольше всего не обращались.',
    },
    {
      type: 'fill-blank',
      id: 'nodeopt-q2',
      description: 'Заполните пропуск для O(1) LRU через Map.',
      codeWithBlanks: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new ___BLANK___(); // сохраняет порядок вставки
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value); // перемещаем в конец
    return value;
  }
}`,
      options: ['Map', 'Object', 'Set', 'WeakMap'],
      correctIndex: 0,
      explanation: '`Map` — единственная стандартная структура JS, которая сохраняет порядок вставки и позволяет удалять/переставлять элементы за O(1). `map.keys().next().value` — первый (самый старый) элемент. Object тоже хранит порядок, но не гарантирует его по спецификации для числовых ключей.',
    },
    {
      type: 'output',
      id: 'nodeopt-q3',
      description: 'Мемоизация. Что выведет код?',
      code: `let calls = 0;
function expensive(x) {
  calls++;
  return x * x;
}

const memo = memoize(expensive);

console.log(memo(5));  // ?
console.log(memo(5));  // ?
console.log(memo(6));  // ?
console.log('calls:', calls); // ?`,
      options: ['25, 25, 36, calls: 2', '25, 25, 36, calls: 3', '25, 0, 36, calls: 2', '25, 25, 25, calls: 1'],
      correctIndex: 0,
      explanation: 'Мемоизация кэширует по аргументам: memo(5) первый раз вызывает expensive(5) → calls=1. memo(5) второй раз — из кэша, calls не растёт. memo(6) — новый аргумент, calls=2. Итого: calls=2. Классический паттерн для дорогих чистых функций.',
    },
    {
      type: 'output',
      id: 'nodeopt-q4',
      description: 'Для чего нужен Worker Threads?',
      code: `// Сервер без воркеров:
app.get('/compute', (req, res) => {
  const result = heavyMathComputation(); // 2 секунды CPU!
  res.json(result);
});
// Что происходит во время вычислений?`,
      options: [
        'Event Loop заблокирован — другие запросы не обрабатываются 2 сек',
        'Node.js автоматически создаёт поток для CPU-операций',
        'libuv обрабатывает это в thread pool',
        'Запрос выполняется параллельно без блокировки',
      ],
      correctIndex: 0,
      explanation: 'CPU-intensive код на главном потоке блокирует Event Loop. Пока heavyMathComputation работает 2 секунды — ни один другой HTTP-запрос, WebSocket событие или таймер не обрабатывается. Worker Threads решают это: выполняют тяжёлые вычисления в отдельном потоке, не трогая Event Loop.',
    },
    {
      type: 'fill-blank',
      id: 'nodeopt-q5',
      description: 'Заполните пропуск для передачи данных в Worker.',
      codeWithBlanks: `const { Worker } = require('worker_threads');

const worker = new Worker('./worker.js', {
  ___BLANK___: { numbers: [1, 2, 3, 4, 5] },
});

worker.on('message', (result) => console.log(result));`,
      options: ['workerData', 'data', 'payload', 'input'],
      correctIndex: 0,
      explanation: '`workerData` — способ передать начальные данные в Worker при создании. Данные клонируются через structured clone algorithm. В worker.js: `const { workerData } = require("worker_threads")`. Для двусторонней связи используют `parentPort.postMessage()` и `worker.on("message")`.',
    },
    {
      type: 'output',
      id: 'nodeopt-q6',
      description: 'Батчинг запросов. Зачем нужен DataLoader паттерн?',
      code: `// БЕЗ батчинга (N+1 проблема):
const users = await Promise.all(
  postIds.map(id => db.query('SELECT * FROM users WHERE id=?', id))
); // 100 отдельных запросов!

// С батчингом (DataLoader):
const users = await Promise.all(
  postIds.map(id => userLoader.load(id))
); // 1 запрос: SELECT * FROM users WHERE id IN (...)`,
      options: [
        '100x меньше запросов к БД — критично для производительности',
        'Запросы выполняются параллельно',
        'Снижает потребление памяти',
        'Нужен только для GraphQL',
      ],
      correctIndex: 0,
      explanation: 'N+1 — классическая проблема: для N записей делается N+1 запросов к БД (1 на список + N на связанные данные). DataLoader собирает индивидуальные запросы в батч и выполняет один запрос `WHERE id IN (...)`. Снижение: 100 запросов → 1. Паттерн пришёл из GraphQL но применим везде.',
    },
    {
      type: 'output',
      id: 'nodeopt-q7',
      description: 'Circuit Breaker. В каком состоянии cb окажется после N ошибок подряд, и что произойдёт при следующем вызове?',
      code: `// Состояния:
// CLOSED   — работает нормально, ошибки считаются
// OPEN     — сразу отклоняет без вызова сервиса
// HALF-OPEN — пробует один вызов после timeout

// После N ошибок подряд — порог достигнут:
const result = await cb.call(arg); // ???`,
      options: [
        'OPEN: throws Error("Circuit open") без вызова реального сервиса',
        'HALF-OPEN: один пробный вызов к сервису',
        'CLOSED: продолжает вызывать сервис',
        'Ждёт восстановления сервиса (suspend)',
      ],
      correctIndex: 0,
      explanation: 'После N ошибок — переход в OPEN. В состоянии OPEN throws Error("Circuit open") немедленно, **не обращаясь к сервису**. Это fail-fast: клиент получает ошибку за микросекунды вместо ожидания таймаута ответа. Защищает перегруженный сервис от лавины запросов. Через timeout переходит в HALF-OPEN — одна попытка.',
    },
    {
      type: 'tracing',
      id: 'nodeopt-q8',
      description: 'Проследите жизненный цикл Circuit Breaker.',
      code: `const cb = createCircuitBreaker(flakeyService, 3, 5000);
// threshold=3 ошибки, timeout=5s

await cb(); // → Error
await cb(); // → Error
await cb(); // → Error — ПОРОГ ДОСТИГНУТ
await cb(); // → ???
// ... 5 секунд ...
await cb(); // → ???
// flakeyService восстановился`,
      steps: [
        { label: '3 ошибки подряд', variables: { state: 'CLOSED', failures: 3 } },
        { label: 'Переход в OPEN', variables: { state: 'OPEN', nextAttempt: 'now + 5s' } },
        { label: 'Вызов в OPEN: throw без вызова сервиса', variables: { state: 'OPEN' } },
        { label: 'Через 5s: переход в HALF-OPEN', variables: { state: 'HALF-OPEN' } },
        { label: 'Успешный вызов: переход в CLOSED', variables: { state: 'CLOSED', failures: 0 } },
      ],
      question: 'Что происходит при вызове в OPEN состоянии?',
      options: ['Немедленный throw без вызова сервиса', 'Вызов сервиса с retry', 'Ожидание timeout', 'Переход в HALF-OPEN'],
      correctIndex: 0,
      explanation: 'OPEN = разомкнутый. Без обращения к сервису — немедленный throw Error("Circuit open"). Это защищает перегруженный сервис от лавины запросов и снижает latency для клиентов (fail fast). После timeout одна попытка (HALF-OPEN) чтобы проверить, восстановился ли сервис.',
    },
    {
      type: 'output',
      id: 'nodeopt-q9',
      description: 'Connection Pool. Почему не создавать соединение на каждый запрос?',
      code: `// Вариант A: соединение на запрос
app.get('/data', async (req, res) => {
  const conn = await createConnection(); // 50-100ms!
  const data = await conn.query('...');
  await conn.close();
  res.json(data);
});

// Вариант B: пул соединений
const pool = new Pool({ max: 10 });
app.get('/data', async (req, res) => {
  const data = await pool.query('...');
  res.json(data);
});`,
      options: [
        'A: 50-100ms overhead на TCP handshake + auth при каждом запросе',
        'A лучше: соединения не держатся зря',
        'Одинаково — БД оптимизирует',
        'B хуже: соединения могут протухнуть',
      ],
      correctIndex: 0,
      explanation: 'Создание TCP-соединения + аутентификация в БД занимает 50-100ms. При 1000 RPS это критично. Пул держит N открытых соединений, запросы берут свободное (< 1ms overhead). Размер пула: обычно CPU × 2-4. Слишком большой пул нагружает сервер БД. Слишком маленький — очереди.',
    },
    {
      type: 'output',
      id: 'nodeopt-q10',
      description: 'process.hrtime.bigint() vs Date.now(). В чём разница?',
      code: `const start1 = Date.now();          // 1704067200000 (ms)
const start2 = process.hrtime.bigint(); // 123456789012345n (ns)

doWork();

const elapsed1 = Date.now() - start1;          // ms
const elapsed2 = process.hrtime.bigint() - start2; // ns`,
      options: [
        'hrtime: наносекундная точность, монотонные часы. Date.now: миллисекунды, может прыгнуть',
        'Date.now точнее hrtime',
        'hrtime медленнее Date.now',
        'Одинаковая точность',
      ],
      correctIndex: 0,
      explanation: '`process.hrtime.bigint()` — монотонные часы с наносекундной точностью (BigInt). Не прыгает при изменении системного времени. Идеален для измерения производительности. `Date.now()` — время с эпохи Unix в мс, может "прыгнуть" при синхронизации NTP. Для профилирования всегда используйте hrtime.',
    },
    {
      type: 'output',
      id: 'nodeopt-q11',
      description: 'Memory Leak в Node.js. Что не так с кодом?',
      code: `const EventEmitter = require('events');
const ee = new EventEmitter();

function processRequest(data) {
  // Каждый запрос добавляет слушателя:
  ee.on('data', (chunk) => {
    doSomething(data, chunk);
  });
}

// Вызывается при каждом HTTP-запросе`,
      options: [
        'Утечка памяти: каждый запрос добавляет слушателя, они накапливаются',
        'Ошибка: EventEmitter нельзя использовать в запросах',
        'Всё в порядке — GC очистит',
        'Слушатели перезаписываются',
      ],
      correctIndex: 0,
      explanation: 'Каждый вызов `ee.on()` добавляет нового слушателя. При 1000 запросов — 1000 слушателей, держащих ссылки на `data` из каждого запроса. GC не может освободить память — ссылки живы. Node.js предупреждает при > 10 слушателях на событие (MaxListenersExceededWarning). Исправление: `ee.once()` или `ee.off()` после использования.',
    },
    {
      type: 'complexity',
      id: 'nodeopt-q12',
      description: 'Какова сложность put() в LRU Cache через Map?',
      code: `put(key, value) {
  if (this.cache.has(key)) this.cache.delete(key);
  else if (this.cache.size >= this.capacity) {
    this.cache.delete(this.cache.keys().next().value); // первый элемент
  }
  this.cache.set(key, value);
}`,
      options: ['O(1) — все операции Map за константное время', 'O(N)', 'O(log N)', 'O(N²)'],
      correctIndex: 0,
      explanation: '`Map.has()`, `Map.delete()`, `Map.set()` — все O(1) (хэш-таблица). `map.keys().next().value` — O(1) (итератор Map даёт первый элемент без перебора). Вся операция put() — O(1). Это и есть преимущество Map-based LRU перед наивным решением через Array (O(N) при поиске и удалении).',
    },
  ],
};
