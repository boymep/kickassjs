import type { Problem } from '../../types/problem';

export const nodeOptimizationProblems: Problem[] = [
  {
    id: 'nodeopt-p1',
    topicId: 'node-optimization',
    title: 'LRUCache — кэш с вытеснением',
    difficulty: 'medium',
    isContextual: false,
    description: `Реализуйте класс \`LRUCache(capacity)\`:
- \`get(key)\` — вернуть значение или \`-1\` если не найдено
- \`put(key, value)\` — добавить/обновить. Если кэш полный — вытеснить давно не используемый элемент
- Обе операции за **O(1)**

Примеры:
\`\`\`
const cache = new LRUCache(2);
cache.put(1, 'a');  // кэш: {1:'a'}
cache.put(2, 'b');  // кэш: {1:'a', 2:'b'}
cache.get(1);       // 'a' — 1 теперь "свежий"
cache.put(3, 'c');  // вытесняет 2 (давно не использован)
cache.get(2);       // -1 (вытеснен)
cache.get(3);       // 'c'
\`\`\``,
    functionName: 'LRUCache',
    starterCode: `class LRUCache {
  constructor(capacity) {
    // ваш код
  }

  get(key) {
    // ваш код
  }

  put(key, value) {
    // ваш код
  }
}`,
    testCases: [
      {
        id: 'nodeopt-p1-t1',
        inputDisplay: 'get существующего ключа',
        inputArgs: ['basic-get'],
        expected: 'a',
      },
      {
        id: 'nodeopt-p1-t2',
        inputDisplay: 'get несуществующего → -1',
        inputArgs: ['miss'],
        expected: -1,
      },
      {
        id: 'nodeopt-p1-t3',
        inputDisplay: 'вытеснение LRU элемента',
        inputArgs: ['eviction'],
        expected: -1,
      },
      {
        id: 'nodeopt-p1-t4',
        inputDisplay: 'get обновляет приоритет (не вытесняется)',
        inputArgs: ['priority'],
        expected: 'a',
      },
      {
        id: 'nodeopt-p1-t5',
        inputDisplay: 'put обновляет существующий ключ',
        inputArgs: ['update'],
        expected: 'new-value',
      },
    ],
    hints: [
      '`Map` в JS сохраняет **порядок вставки**. Используйте это: самый старый элемент — `map.keys().next().value`.',
      'При `get`: удалите и заново вставьте ключ (это делает его "свежим" — перемещает в конец).',
      'При `put`: если ключ существует — удалите сначала. Если полный — удалите первый (`map.keys().next().value`).',
    ],
    solutionCode: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}`,
  },
  {
    id: 'nodeopt-p2',
    topicId: 'node-optimization',
    title: 'memoizeWithTTL — кэш с истечением',
    difficulty: 'medium',
    isContextual: true,
    description: `Реализуйте функцию \`memoizeWithTTL(fn, ttl)\`:
- Кэширует результат функции по аргументам
- Через \`ttl\` миллисекунд кэш для этого вызова истекает
- Если кэш истёк — вызывает функцию заново
- Ключ кэша — строка из аргументов

Примеры:
\`\`\`
let calls = 0;
const expensive = memoizeWithTTL((x) => {
  calls++;
  return x * 2;
}, 100); // TTL = 100ms

expensive(5); // → 10, calls = 1
expensive(5); // → 10, calls = 1 (из кэша)
// ... 150ms спустя ...
expensive(5); // → 10, calls = 2 (TTL истёк)
\`\`\``,
    functionName: 'memoizeWithTTL',
    starterCode: `function memoizeWithTTL(fn, ttl) {
  // ваш код
}`,
    testCases: [
      {
        id: 'nodeopt-p2-t1',
        inputDisplay: 'повторный вызов — из кэша (fn не вызвана)',
        inputArgs: ['cache-hit'],
        expected: 1,
      },
      {
        id: 'nodeopt-p2-t2',
        inputDisplay: 'разные аргументы — разные кэши',
        inputArgs: ['diff-args'],
        expected: 2,
      },
      {
        id: 'nodeopt-p2-t3',
        inputDisplay: 'возвращает правильное значение',
        inputArgs: ['value'],
        expected: 10,
      },
      {
        id: 'nodeopt-p2-t4',
        inputDisplay: 'без аргументов — кэшируется',
        inputArgs: ['no-args'],
        expected: 1,
      },
      {
        id: 'nodeopt-p2-t5',
        inputDisplay: 'кэш создаётся для каждого набора args',
        inputArgs: ['multi-cache'],
        expected: [10, 20, 30],
      },
    ],
    hints: [
      'Ключ: `JSON.stringify(args)`. Cache: `Map<string, { value, time }>`.',
      'При вызове: проверьте `Date.now() - cached.time < ttl`. Если нет — вызовите fn и обновите кэш.',
    ],
    solutionCode: `function memoizeWithTTL(fn, ttl) {
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
}`,
  },
  {
    id: 'nodeopt-p3',
    topicId: 'node-optimization',
    title: 'Pool — пул ресурсов',
    difficulty: 'medium',
    isContextual: true,
    description: `Реализуйте класс \`Pool(factory, size)\`:
- \`constructor(factory, size)\` — \`factory()\` создаёт ресурс (Promise); \`size\` — размер пула
- \`acquire()\` — возвращает Promise с ресурсом; если все заняты — ждёт освобождения
- \`release(resource)\` — возвращает ресурс в пул
- Одновременно не более \`size\` ресурсов

Примеры:
\`\`\`
const pool = new Pool(() => createConnection(), 2);

const conn1 = await pool.acquire(); // создан сразу
const conn2 = await pool.acquire(); // создан сразу
// pool заполнен (size=2)

const conn3Promise = pool.acquire(); // ждёт...
pool.release(conn1);                 // conn3Promise резолвится!
const conn3 = await conn3Promise;
\`\`\``,
    functionName: 'Pool',
    starterCode: `class Pool {
  constructor(factory, size) {
    // ваш код
  }

  acquire() {
    // ваш код — возвращает Promise
  }

  release(resource) {
    // ваш код
  }
}`,
    testCases: [
      {
        id: 'nodeopt-p3-t1',
        inputDisplay: 'acquire возвращает Promise',
        inputArgs: ['returns-promise'],
        expected: true,
      },
      {
        id: 'nodeopt-p3-t2',
        inputDisplay: 'не более size ресурсов одновременно',
        inputArgs: ['max-size'],
        expected: 2,
      },
      {
        id: 'nodeopt-p3-t3',
        inputDisplay: 'release разблокирует ожидающий acquire',
        inputArgs: ['release-unblocks'],
        expected: true,
      },
      {
        id: 'nodeopt-p3-t4',
        inputDisplay: 'все ресурсы создаются через factory',
        inputArgs: ['factory-called'],
        expected: 2,
      },
      {
        id: 'nodeopt-p3-t5',
        inputDisplay: 'released ресурс переиспользуется',
        inputArgs: ['reuse'],
        expected: true,
      },
    ],
    hints: [
      'Храните `this.available = []` (свободные ресурсы), `this.waiting = []` (очередь resolve-функций), `this.active = 0`.',
      'В `acquire`: если `available.length > 0` — взять из available. Иначе если `active < size` — создать через factory. Иначе — добавить resolve в waiting.',
      'В `release`: если `waiting.length > 0` — взять первый из waiting и отдать ему ресурс. Иначе — вернуть в available.',
    ],
    solutionCode: `class Pool {
  constructor(factory, size) {
    this.factory = factory;
    this.size = size;
    this.available = [];  // созданные, свободные ресурсы
    this.waiting = [];    // очередь ожидающих resolve
    this.total = 0;       // всего создано ресурсов
  }

  acquire() {
    if (this.available.length > 0) {
      return Promise.resolve(this.available.pop());
    }
    if (this.total < this.size) {
      this.total++;
      return this.factory();
    }
    // Пул заполнен — встать в очередь
    return new Promise((resolve) => {
      this.waiting.push(resolve);
    });
  }

  release(resource) {
    if (this.waiting.length > 0) {
      // Сразу отдать ожидающему
      this.waiting.shift()(resource);
    } else {
      this.available.push(resource);
    }
  }
}`,
  },
  {
    id: 'nodeopt-p4',
    topicId: 'node-optimization',
    title: 'batchProcessor — группировка вызовов',
    difficulty: 'medium',
    isContextual: true,
    description: `Реализуйте функцию \`createBatcher(batchFn, maxSize, maxWait)\`:
- Группирует одиночные вызовы в батч
- Сбрасывает батч когда: достигнут \`maxSize\` **или** прошло \`maxWait\` мс
- Каждый вызов возвращает Promise с индивидуальным результатом
- \`batchFn(items[]) → results[]\` — обрабатывает батч

Примеры:
\`\`\`
const batcher = createBatcher(
  async (ids) => ids.map(id => id * 2), // fn
  3,   // maxSize
  50,  // maxWait ms
);

// Все три резолвятся вместе (один batchFn вызов):
const [r1, r2, r3] = await Promise.all([
  batcher(1), // → 2
  batcher(2), // → 4
  batcher(3), // → 6 (достигнут maxSize=3, flush!)
]);
\`\`\``,
    functionName: 'createBatcher',
    starterCode: `function createBatcher(batchFn, maxSize, maxWait) {
  // ваш код — возвращает функцию add(item)
}`,
    testCases: [
      {
        id: 'nodeopt-p4-t1',
        inputDisplay: 'базовый батч из 3 элементов',
        inputArgs: ['basic'],
        expected: [2, 4, 6],
      },
      {
        id: 'nodeopt-p4-t2',
        inputDisplay: 'flush по maxSize',
        inputArgs: ['flush-size'],
        expected: true,
      },
      {
        id: 'nodeopt-p4-t3',
        inputDisplay: 'batchFn вызван один раз для батча',
        inputArgs: ['single-call'],
        expected: 1,
      },
      {
        id: 'nodeopt-p4-t4',
        inputDisplay: 'каждый item получает свой результат',
        inputArgs: ['individual'],
        expected: [10, 20, 30],
      },
      {
        id: 'nodeopt-p4-t5',
        inputDisplay: 'flush по maxWait (таймер)',
        inputArgs: ['flush-wait'],
        expected: true,
      },
    ],
    hints: [
      'Храните `batch = []`, `resolvers = []`, `timer = null`.',
      'В `flush`: скопируйте и очистите batch/resolvers, вызовите `batchFn(batch)`, раздайте результаты через resolvers.',
      'В `add`: добавьте item и resolve. Если `batch.length >= maxSize` — flush немедленно. Иначе — запустите таймер если не запущен.',
    ],
    solutionCode: `function createBatcher(batchFn, maxSize, maxWait) {
  let batch = [];
  let resolvers = [];
  let timer = null;

  function flush() {
    const currentBatch = batch;
    const currentResolvers = resolvers;
    batch = [];
    resolvers = [];
    clearTimeout(timer);
    timer = null;

    Promise.resolve(batchFn(currentBatch)).then((results) => {
      currentResolvers.forEach((resolve, i) => resolve(results[i]));
    });
  }

  return function add(item) {
    return new Promise((resolve) => {
      batch.push(item);
      resolvers.push(resolve);

      if (batch.length >= maxSize) {
        flush();
      } else if (!timer) {
        timer = setTimeout(flush, maxWait);
      }
    });
  };
}`,
  },
  {
    id: 'nodeopt-p5',
    topicId: 'node-optimization',
    title: 'circuitBreaker — размыкатель цепи',
    difficulty: 'medium',
    isContextual: true,
    description: `Реализуйте функцию \`createCircuitBreaker(fn, threshold, timeout)\`:
- После \`threshold\` ошибок подряд — **размыкает** цепь (состояние OPEN)
- В состоянии OPEN: сразу throws \`Error('Circuit open')\` без вызова fn
- Через \`timeout\` мс переходит в HALF-OPEN: пробует один вызов
  - Успех → CLOSED (сброс счётчика)
  - Ошибка → снова OPEN

Примеры:
\`\`\`
const cb = createCircuitBreaker(unstableFn, 2, 100);

await cb(); // Error → failures=1
await cb(); // Error → failures=2 → OPEN!
await cb(); // throws 'Circuit open' (fn не вызвана)
// ... 100ms ...
await cb(); // HALF-OPEN: вызывает fn, если успех → CLOSED
\`\`\``,
    functionName: 'createCircuitBreaker',
    starterCode: `function createCircuitBreaker(fn, threshold, timeout) {
  // ваш код — возвращает обёрнутую функцию
}`,
    testCases: [
      {
        id: 'nodeopt-p5-t1',
        inputDisplay: 'до threshold — вызывает fn',
        inputArgs: ['below-threshold'],
        expected: true,
      },
      {
        id: 'nodeopt-p5-t2',
        inputDisplay: 'после threshold — Circuit open',
        inputArgs: ['circuit-open'],
        expected: 'Circuit open',
      },
      {
        id: 'nodeopt-p5-t3',
        inputDisplay: 'fn не вызывается в OPEN состоянии',
        inputArgs: ['no-call-open'],
        expected: 0,
      },
      {
        id: 'nodeopt-p5-t4',
        inputDisplay: 'успешный вызов сбрасывает счётчик',
        inputArgs: ['reset'],
        expected: 'success',
      },
      {
        id: 'nodeopt-p5-t5',
        inputDisplay: 'три состояния: CLOSED → OPEN → HALF-OPEN',
        inputArgs: ['states'],
        expected: ['CLOSED', 'OPEN', 'HALF-OPEN'],
      },
    ],
    hints: [
      'Храните `state = "CLOSED"`, `failures = 0`, `nextAttempt = 0`.',
      'В OPEN: если `Date.now() < nextAttempt` — throw. Иначе `state = "HALF-OPEN"`.',
      'При успехе: `failures = 0`, `state = "CLOSED"`. При ошибке: `failures++`, если `>= threshold` → `state = "OPEN"`, `nextAttempt = Date.now() + timeout`.',
    ],
    solutionCode: `function createCircuitBreaker(fn, threshold, timeout) {
  let state = 'CLOSED';
  let failures = 0;
  let nextAttempt = 0;

  return async function (...args) {
    if (state === 'OPEN') {
      if (Date.now() < nextAttempt) {
        throw new Error('Circuit open');
      }
      state = 'HALF-OPEN';
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
}`,
  },
];
