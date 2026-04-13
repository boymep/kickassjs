import type { TopicTheory } from '../../types/topic';

export const nodeOptimizationTheory: TopicTheory = {
  topicId: 'node-optimization',
  sections: [
    {
      title: 'Профилирование и узкие места',
      blocks: [
        {
          type: 'text',
          content:
            'Оптимизация Node.js начинается с **измерения**. Преждевременная оптимизация — корень всех зол. Сначала профилируйте, затем оптимизируйте узкие места.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Встроенный профайлер:
// node --prof app.js
// node --prof-process isolate-*.log > processed.txt

// Clinicjs (популярный инструмент):
// clinic doctor -- node app.js

// Измерение времени в коде:
const start = process.hrtime.bigint(); // nanoseconds!
doHeavyWork();
const end = process.hrtime.bigint();
console.log(\`Took: \${(end - start) / 1_000_000n}ms\`);

// Performance API:
const { performance } = require('perf_hooks');
performance.mark('start');
doWork();
performance.mark('end');
performance.measure('doWork', 'start', 'end');
const [measure] = performance.getEntriesByName('doWork');
console.log(measure.duration, 'ms');`,
        },
        {
          type: 'list',
          content:
            '**Частые узкие места в Node.js:**\n- CPU-intensive операции на главном потоке (RegExp, JSON.parse больших данных, crypto)\n- Синхронные файловые операции (fs.readFileSync)\n- Memory leaks (забытые EventEmitter подписчики, closures, глобальные коллекции)\n- Неэффективные алгоритмы в hot path\n- N+1 запросов к базе данных',
        },
      ],
    },
    {
      title: 'Кэширование: стратегии и структуры данных',
      blocks: [
        {
          type: 'code',
          language: 'javascript',
          content: `// LRU Cache — Least Recently Used:
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Map сохраняет порядок вставки!
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    // Переместить в конец (недавно использован):
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity) {
      // Удалить первый (давно не использовавшийся):
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}

// Мемоизация с TTL:
function memoizeWithTTL(fn, ttl) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    if (cached && Date.now() - cached.time < ttl) {
      return cached.value;
    }
    const value = fn.apply(this, args);
    cache.set(key, { value, time: Date.now() });
    return value;
  };
}`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            '**Map vs Object для кэша**: `Map` предпочтительнее для кэша: поддерживает любые ключи, не путается со свойствами прототипа, имеет `size` и порядок вставки (нужен для LRU). Производительность схожа, но Map явно выигрывает для частых операций вставки/удаления.',
        },
      ],
    },
    {
      title: 'Worker Threads и CPU-интенсивные задачи',
      blocks: [
        {
          type: 'code',
          language: 'javascript',
          content: `// worker.js — тяжёлые вычисления в отдельном потоке:
const { parentPort, workerData } = require('worker_threads');

function heavyComputation(data) {
  // Считает долго, не блокирует главный поток
  let result = 0;
  for (let i = 0; i < data.length; i++) {
    result += Math.sqrt(data[i]);
  }
  return result;
}

parentPort.postMessage(heavyComputation(workerData));

// main.js — пул воркеров:
const { Worker } = require('worker_threads');

class WorkerPool {
  constructor(size, workerFile) {
    this.pool = Array.from(
      { length: size },
      () => ({ worker: new Worker(workerFile), busy: false })
    );
    this.queue = [];
  }

  run(data) {
    return new Promise((resolve, reject) => {
      const free = this.pool.find((w) => !w.busy);
      if (free) {
        this._execute(free, data, resolve, reject);
      } else {
        this.queue.push({ data, resolve, reject });
      }
    });
  }

  _execute(slot, data, resolve, reject) {
    slot.busy = true;
    slot.worker.once('message', (result) => {
      slot.busy = false;
      resolve(result);
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        this._execute(slot, next.data, next.resolve, next.reject);
      }
    });
    slot.worker.postMessage(data);
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Создание Worker дорого (~5-10ms). Создавайте пул при старте, не на каждый запрос. SharedArrayBuffer позволяет разделять память между воркерами без копирования (zero-copy). Для I/O-задач воркеры не нужны — libuv уже обрабатывает I/O асинхронно в thread pool.',
        },
      ],
    },
    {
      title: 'Батчинг и пулы ресурсов',
      blocks: [
        {
          type: 'code',
          language: 'javascript',
          content: `// Batch processor — группировать N вызовов в один:
function createBatchProcessor(processFn, maxBatch = 100, maxWait = 10) {
  let batch = [];
  let timer = null;
  const resolvers = [];

  function flush() {
    const currentBatch = batch;
    const currentResolvers = resolvers.splice(0);
    batch = [];
    timer = null;

    processFn(currentBatch).then((results) => {
      results.forEach((result, i) => currentResolvers[i](result));
    });
  }

  return function add(item) {
    return new Promise((resolve) => {
      batch.push(item);
      resolvers.push(resolve);

      if (batch.length >= maxBatch) {
        clearTimeout(timer);
        flush();
      } else if (!timer) {
        timer = setTimeout(flush, maxWait);
      }
    });
  };
}

// Пример: DataLoader паттерн (N+1 решение):
const loadUser = createBatchProcessor(
  async (ids) => db.query('SELECT * FROM users WHERE id IN (?)', ids),
  50,  // максимум 50 ID в одном запросе
  5    // ждём 5ms чтобы собрать батч
);

// Вместо N запросов к БД — один батчевый:
const [user1, user2] = await Promise.all([
  loadUser(1),
  loadUser(2),
]); // SELECT * FROM users WHERE id IN (1, 2)`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Connection Pool — пул соединений с БД:
// (Node.js ORM/drivers делают это автоматически)
// pg, mysql2, mongoose — все имеют встроенный pooling

const { Pool } = require('pg');
const pool = new Pool({
  max: 20,        // максимум 20 соединений
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Использование:
const client = await pool.connect();
try {
  const result = await client.query('SELECT * FROM users');
  return result.rows;
} finally {
  client.release(); // ВАЖНО: вернуть в пул!
}

// Или shorthand (автоматически release):
const result = await pool.query('SELECT * FROM users');`,
        },
      ],
    },
    {
      title: 'V8 память и GC — что важно знать',
      blocks: [
        {
          type: 'text',
          content:
            'V8 использует **поколенческую сборку мусора** (generational GC). Понимание этого помогает писать memory-efficient код.',
        },
        {
          type: 'list',
          content: `**Young Generation (New Space)** — новые объекты. Маленький (~1-8MB). Minor GC (Scavenge) — быстрый, частый. Выжившие объекты перемещаются в Old Space.
**Old Generation (Old Space)** — долгоживущие объекты. Больший (~64MB–1.5GB). Major GC (Mark-Sweep-Compact) — медленный, редкий. Вызывает паузы.
**Large Object Space** — объекты > 512KB. Никогда не перемещаются.
**Code Space** — скомпилированный JIT-код.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Мониторинг памяти в Node.js:
const used = process.memoryUsage();
console.log({
  heapUsed:  (used.heapUsed  / 1024 / 1024).toFixed(1) + ' MB',
  heapTotal: (used.heapTotal / 1024 / 1024).toFixed(1) + ' MB',
  rss:       (used.rss       / 1024 / 1024).toFixed(1) + ' MB', // resident set
  external:  (used.external  / 1024 / 1024).toFixed(1) + ' MB', // C++ объекты
});

// Установить лимит V8 heap:
// node --max-old-space-size=4096 app.js   (4GB)

// Принудительный GC для тестов (только с --expose-gc):
// node --expose-gc -e "global.gc(); console.log(process.memoryUsage())"`,
        },
        {
          type: 'heading',
          content: 'Распространённые утечки памяти',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// 1. Глобальные переменные накапливают данные:
const cache = {}; // ❌ растёт бесконечно
cache[Date.now()] = fetchData(); // никогда не чистится

// ✅ Используйте LRU с ограниченным размером или TTL

// 2. Забытые подписки на EventEmitter:
function setupListener(emitter) {
  emitter.on('data', handler); // ❌ handler никогда не удаляется
}
// ✅ Всегда снимайте подписки:
emitter.once('data', handler);        // автоматически
emitter.on('data', handler);
emitter.on('end', () => emitter.off('data', handler));

// 3. Замыкания в циклах, держащие большие объекты:
function processRequests(requests) {
  return requests.map((req) => {
    const bigBuffer = Buffer.allocUnsafe(10 * 1024 * 1024); // 10MB
    return () => processWithBuffer(req, bigBuffer);
    // ❌ bigBuffer будет держаться в памяти пока существует массив функций
  });
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Инструменты диагностики: `clinic heapprofiler`, Chrome DevTools → Memory (attach к Node.js через `--inspect`), `heapdump` npm пакет. Паттерн: снять heap snapshot до и после операции, найти что не было GC-собрано.',
        },
      ],
    },
  ],
};
