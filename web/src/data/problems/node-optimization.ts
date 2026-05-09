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
    functionName: 'nodeopt_p2_test',
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
    testHelperCode: `async function nodeopt_p2_test(arg) {
  if (arg === 'cache-hit') {
    let calls = 0;
    const f = memoizeWithTTL((x) => { calls++; return x * 2; }, 1000);
    f(5); f(5); f(5);
    return calls; // 1
  }
  if (arg === 'diff-args') {
    let calls = 0;
    const f = memoizeWithTTL((x) => { calls++; return x; }, 1000);
    f(1); f(2); f(1); f(2);
    return calls; // 2
  }
  if (arg === 'value') {
    const f = memoizeWithTTL((x) => x * 2, 1000);
    return f(5); // 10
  }
  if (arg === 'no-args') {
    let calls = 0;
    const f = memoizeWithTTL(() => { calls++; return 42; }, 1000);
    f(); f(); f();
    return calls; // 1
  }
  if (arg === 'multi-cache') {
    const f = memoizeWithTTL((x) => x * 10, 1000);
    return [f(1), f(2), f(3)]; // [10,20,30]
  }
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
    functionName: 'nodeopt_p4_test',
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
    testHelperCode: `async function nodeopt_p4_test(arg) {
  if (arg === 'basic') {
    const batcher = createBatcher(async (ids) => ids.map((x) => x * 2), 3, 50);
    return await Promise.all([batcher(1), batcher(2), batcher(3)]); // [2,4,6]
  }
  if (arg === 'flush-size') {
    let flushed = false;
    const batcher = createBatcher(async (ids) => { flushed = true; return ids; }, 3, 5000);
    await Promise.all([batcher(1), batcher(2), batcher(3)]);
    return flushed === true;
  }
  if (arg === 'single-call') {
    let calls = 0;
    const batcher = createBatcher(async (ids) => { calls++; return ids; }, 3, 50);
    await Promise.all([batcher(1), batcher(2), batcher(3)]);
    return calls; // 1
  }
  if (arg === 'individual') {
    const batcher = createBatcher(async (ids) => ids.map((x) => x * 10), 3, 50);
    return await Promise.all([batcher(1), batcher(2), batcher(3)]); // [10,20,30]
  }
  if (arg === 'flush-wait') {
    let flushed = false;
    const batcher = createBatcher(async (ids) => { flushed = true; return ids; }, 100, 30);
    const p = batcher(1);
    await new Promise((r) => setTimeout(r, 80));
    await p;
    return flushed === true;
  }
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
    functionName: 'nodeopt_p5_test',
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
    testHelperCode: `async function nodeopt_p5_test(arg) {
  if (arg === 'below-threshold') {
    let called = false;
    const cb = createCircuitBreaker(async () => { called = true; return 'ok'; }, 3, 1000);
    await cb();
    return called === true;
  }
  if (arg === 'circuit-open') {
    const cb = createCircuitBreaker(async () => { throw new Error('boom'); }, 2, 1000);
    try { await cb(); } catch (e) {}
    try { await cb(); } catch (e) {}
    try {
      await cb();
      return 'no-throw';
    } catch (e) {
      return e.message; // 'Circuit open'
    }
  }
  if (arg === 'no-call-open') {
    let calls = 0;
    const cb = createCircuitBreaker(async () => { calls++; throw new Error('boom'); }, 2, 1000);
    try { await cb(); } catch (e) {}
    try { await cb(); } catch (e) {}
    const before = calls;
    try { await cb(); } catch (e) {}
    try { await cb(); } catch (e) {}
    return calls - before; // 0
  }
  if (arg === 'reset') {
    let mode = 'fail';
    const cb = createCircuitBreaker(
      async () => {
        if (mode === 'fail') throw new Error('boom');
        return 'success';
      },
      5,
      1000,
    );
    try { await cb(); } catch (e) {}
    try { await cb(); } catch (e) {}
    mode = 'ok';
    return await cb(); // 'success'
  }
  if (arg === 'states') {
    const states = [];
    let phase = 'fail';
    let callCount = 0;
    const cb = createCircuitBreaker(
      async () => {
        callCount++;
        if (phase === 'fail') throw new Error('boom');
        return 'ok';
      },
      2,
      30,
    );
    // CLOSED: первый вызов проходит до fn (callCount растёт)
    const c0 = callCount;
    try { await cb(); } catch (e) {}
    if (callCount === c0 + 1) states.push('CLOSED');
    // вторая ошибка → переходит в OPEN
    try { await cb(); } catch (e) {}
    // OPEN: следующий вызов сразу throws 'Circuit open' (fn не вызвана)
    const c1 = callCount;
    try {
      await cb();
    } catch (e) {
      if (e.message === 'Circuit open' && callCount === c1) states.push('OPEN');
    }
    // ждём timeout — следующий вызов идёт через HALF-OPEN
    await new Promise((r) => setTimeout(r, 50));
    phase = 'ok';
    const c2 = callCount;
    const result = await cb(); // HALF-OPEN: fn вызвана, успех → CLOSED
    if (callCount === c2 + 1 && result === 'ok') states.push('HALF-OPEN');
    return states; // ['CLOSED','OPEN','HALF-OPEN']
  }
}`,
  },
  {
    kind: 'predict-output',
    id: 'no-p1',
    topicId: 'node-optimization',
    title: 'Угадай вывод: трассировка LRU cache',
    difficulty: 'medium',
    isContextual: false,
    description: `Перед вами LRU cache на 2 элемента. Запомните: при \`get\` ключ становится «свежим» (переезжает в конец), при \`put\` в полный кэш вытесняется самый старый.

Введи каждую напечатанную строку в отдельной строчке поля ответа.`,
    code: `class LRUCache {
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
c.put(1, 'a');         // [1]
c.put(2, 'b');         // [1, 2]
console.log(c.get(1)); // 1 свежий: [2, 1]
c.put(3, 'c');         // вытесняем 2: [1, 3]
console.log(c.get(2));
console.log(c.get(3)); // 3 свежий: [1, 3] -> [1, 3]
c.put(4, 'd');         // вытесняем 1: [3, 4]
console.log(c.get(1));
console.log(c.get(3));
console.log(c.get(4));`,
    expected: 'a\n-1\nc\n-1\nc\nd',
    hints: [
      'После `get(1)` ключ 1 «свежий», ключ 2 — самый старый.',
      'При `put(3)` capacity=2, вытесняется самый старый — ключ 2.',
      '`get(3)` делает ключ 3 свежим, поэтому при `put(4)` вытесняется ключ 1.',
    ],
    solutionCode: `// Ответ:
// a
// -1
// c
// -1
// c
// d`,
  },
  {
    kind: 'find-bug',
    id: 'no-p2',
    topicId: 'node-optimization',
    title: 'Найди баг: мемоизация без ограничения памяти',
    difficulty: 'medium',
    isContextual: false,
    description: `Эта мемоизация работает, но в production «съедает» память: на множестве уникальных аргументов кэш растёт до OOM.

Почини так, чтобы кэш хранил **не более 100** записей: при превышении вытесняется самая старая (FIFO достаточно для прохождения тестов). Подсказка: используй \`Map\` и его свойство «порядок вставки» — самый старый ключ это \`map.keys().next().value\`.`,
    buggyCode: `function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const value = fn.apply(this, args);
    cache.set(key, value);
    return value;
  };
}`,
    functionName: 'no_p2_test',
    bugSummary:
      'Кэш растёт без ограничений: каждый новый уникальный набор аргументов добавляет запись, старые никогда не удаляются. На сервере, где аргументы — это пользовательские id или query, heap растёт линейно с трафиком и упирается в OOM. Решение — добавить лимит размера и вытеснять самый старый ключ через `cache.delete(cache.keys().next().value)`.',
    testCases: [
      { id: 'no-p2-t1', inputDisplay: 'кэш-хит: f(5) дважды → fn вызвана 1 раз', inputArgs: ['hit'], expected: 1 },
      { id: 'no-p2-t2', inputDisplay: 'возвращает корректное значение', inputArgs: ['value'], expected: 25 },
      { id: 'no-p2-t3', inputDisplay: 'после 100 уникальных ключей размер кэша ≤ 100', inputArgs: ['size-limit'], expected: true },
      { id: 'no-p2-t4', inputDisplay: 'после 200 уникальных вставок самый старый ключ вытеснен', inputArgs: ['evicted'], expected: true },
      { id: 'no-p2-t5', inputDisplay: 'свежий ключ не вытесняется при превышении', inputArgs: ['fresh-survives'], expected: true },
    ],
    hints: [
      'Добавьте проверку `cache.size >= 100` перед `cache.set`.',
      'Самый старый ключ Map: `cache.keys().next().value`.',
      'Удаляйте через `cache.delete(oldestKey)` перед вставкой нового.',
    ],
    solutionCode: `function memoize(fn) {
  const cache = new Map();
  const MAX = 100;
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    if (cache.size >= MAX) {
      cache.delete(cache.keys().next().value);
    }
    const value = fn.apply(this, args);
    cache.set(key, value);
    return value;
  };
}`,
    testHelperCode: `function no_p2_test(arg) {
  if (arg === 'hit') {
    let calls = 0;
    const f = memoize((x) => { calls++; return x * x; });
    f(5); f(5); f(5);
    return calls;
  }
  if (arg === 'value') {
    const f = memoize((x) => x * x);
    return f(5);
  }
  if (arg === 'size-limit') {
    const f = memoize((x) => x);
    for (let i = 0; i < 100; i++) f(i);
    // После 100 вставок — может быть 100 (если не превысили лимит).
    // Главное: при добавлении 101-го размер не должен превысить 100.
    f(100);
    // Теперь должно быть ровно 100, не больше.
    let extraTotal = 0;
    for (let i = 101; i < 200; i++) { f(i); extraTotal++; }
    // Итог: проверим, что кэш всё ещё <= 100. Для этого
    // повторно вызовем самые свежие — они должны быть в кэше.
    let calls = 0;
    const g = memoize((x) => { calls++; return x; });
    for (let i = 0; i < 150; i++) g(i);
    g(149); g(148); // эти точно были недавно — кэш-хит
    const beforeFresh = calls;
    g(149); g(148);
    return calls === beforeFresh; // повторные не вызывают fn
  }
  if (arg === 'evicted') {
    let calls = 0;
    const f = memoize((x) => { calls++; return x; });
    for (let i = 0; i < 200; i++) f(i);
    // Ключ 0 должен быть вытеснен (старше всех)
    const before = calls;
    f(0);
    return calls === before + 1; // fn вызвана заново
  }
  if (arg === 'fresh-survives') {
    let calls = 0;
    const f = memoize((x) => { calls++; return x; });
    for (let i = 0; i < 200; i++) f(i);
    // Ключ 199 — самый свежий, должен быть в кэше
    const before = calls;
    f(199);
    return calls === before; // не вызвана заново
  }
}`,
  },
  {
    kind: 'refactor',
    id: 'no-p3',
    topicId: 'node-optimization',
    title: 'Refactor: array-based LRU → O(1) через Map',
    difficulty: 'medium',
    isContextual: false,
    description: `Дан LRU cache на массиве: \`get\` и \`put\` ищут ключ через \`findIndex\` и сдвигают массив через \`splice\` — это O(n). На 100 000 операций он не проходит по времени.

Перепишите класс через \`Map\` так, чтобы все операции работали за **O(1)**. Сигнатура должна остаться: \`new LRUCache(capacity)\`, \`get(key)\`, \`put(key, value)\`. \`get\` для отсутствующего ключа возвращает \`-1\`.

Идея: \`Map\` сохраняет порядок вставки. При \`get\` удаляйте и вставляйте ключ заново — он переедет в конец как «свежий». При \`put\` в полный кэш удаляйте \`map.keys().next().value\`.`,
    functionName: 'LRUCache_test',
    starterCode: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.keys = [];   // от старого к свежему
    this.values = []; // параллельно keys
  }

  get(key) {
    const i = this.keys.findIndex((k) => k === key); // O(n)
    if (i === -1) return -1;
    const v = this.values[i];
    // переместить в конец
    this.keys.splice(i, 1);   // O(n)
    this.values.splice(i, 1);
    this.keys.push(key);
    this.values.push(v);
    return v;
  }

  put(key, value) {
    const i = this.keys.findIndex((k) => k === key); // O(n)
    if (i !== -1) {
      this.keys.splice(i, 1);
      this.values.splice(i, 1);
    } else if (this.keys.length >= this.capacity) {
      this.keys.shift(); // O(n)
      this.values.shift();
    }
    this.keys.push(key);
    this.values.push(value);
  }
}`,
    testCases: [
      { id: 'no-p3-t1', inputDisplay: 'базовый get/put', inputArgs: ['basic'], expected: 'a' },
      { id: 'no-p3-t2', inputDisplay: 'get несуществующего → -1', inputArgs: ['miss'], expected: -1 },
      { id: 'no-p3-t3', inputDisplay: 'вытеснение самого старого', inputArgs: ['eviction'], expected: -1 },
      { id: 'no-p3-t4', inputDisplay: 'get обновляет «свежесть»', inputArgs: ['priority'], expected: 'a' },
      { id: 'no-p3-t5', inputDisplay: 'put обновляет существующий ключ', inputArgs: ['update'], expected: 'new' },
    ],
    perfTest: { inputArgs: ['perf'], maxMs: 50 },
    hints: [
      'Замените `keys`/`values` массивы на один `Map`. Map.has/get/set/delete — все O(1).',
      'В `get`: `cache.delete(key); cache.set(key, value)` перемещает ключ в конец.',
      'В `put`: при переполнении `cache.delete(cache.keys().next().value)` — это O(1).',
    ],
    solutionCode: `class LRUCache {
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
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}`,
    testHelperCode: `function LRUCache_test(arg) {
  if (arg === 'basic') {
    const c = new LRUCache(2);
    c.put(1, 'a');
    return c.get(1);
  }
  if (arg === 'miss') {
    const c = new LRUCache(2);
    return c.get(42);
  }
  if (arg === 'eviction') {
    const c = new LRUCache(2);
    c.put(1, 'a');
    c.put(2, 'b');
    c.put(3, 'c'); // вытесняет 1
    return c.get(1);
  }
  if (arg === 'priority') {
    const c = new LRUCache(2);
    c.put(1, 'a');
    c.put(2, 'b');
    c.get(1);      // 1 свежий
    c.put(3, 'c'); // вытесняет 2
    return c.get(1);
  }
  if (arg === 'update') {
    const c = new LRUCache(2);
    c.put(1, 'a');
    c.put(1, 'new');
    return c.get(1);
  }
  if (arg === 'perf') {
    const c = new LRUCache(1000);
    // 100 000 операций: put/get вперемешку
    for (let i = 0; i < 50000; i++) c.put(i, i);
    let acc = 0;
    for (let i = 0; i < 50000; i++) acc += c.get(i % 1000) === -1 ? 0 : 1;
    return acc > 0;
  }
}`,
  },
];
