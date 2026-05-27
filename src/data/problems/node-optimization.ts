import type { Problem } from "../../types/problem";

export const nodeOptimizationProblems: Problem[] = [
  {
    id: "nodeopt-p1",
    topicId: "node-optimization",
    title: "LRUCache — кэш с вытеснением",
    difficulty: "medium",
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
    functionName: "LRUCache",
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
        id: "nodeopt-p1-t1",
        inputDisplay: "get существующего ключа",
        inputArgs: ["basic-get"],
        expected: "a",
      },
      {
        id: "nodeopt-p1-t2",
        inputDisplay: "get несуществующего → -1",
        inputArgs: ["miss"],
        expected: -1,
      },
      {
        id: "nodeopt-p1-t3",
        inputDisplay: "вытеснение LRU элемента",
        inputArgs: ["eviction"],
        expected: -1,
      },
      {
        id: "nodeopt-p1-t4",
        inputDisplay: "get обновляет приоритет (не вытесняется)",
        inputArgs: ["priority"],
        expected: "a",
      },
      {
        id: "nodeopt-p1-t5",
        inputDisplay: "put обновляет существующий ключ",
        inputArgs: ["update"],
        expected: "new-value",
      },
    ],
    hints: [
      "Нужна структура, которая запоминает порядок обращений к ключам и позволяет за `O(1)` понять, что устарело сильнее всего.",
      "`Map` в JS сохраняет порядок вставки. Чтобы пометить ключ как недавно использованный — удалите и снова положите. Самый старый ключ всегда первый: `this.cache.keys().next().value`. На `put` при переполнении именно его и выкидывайте.",
      `Ключевое — \`Map\` в JS сохраняет порядок вставки, и это бесплатно даёт «временную ось» обращений. Если при чтении вы удаляете и снова кладёте ключ — он становится «последним» в порядке. При переполнении самый старый — это первый ключ итератора. Не забудьте, что при \`put\` существующего ключа тоже нужно удалить-положить, иначе LRU превратится в FIFO: повторное обновление не освежит ключ, и он вылетит как самый старый, хотя только что использовался.

С чего начать:
\`\`\`js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) { /* ... */ }
  put(key, value) { /* ... */ }
}
\`\`\``,
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
    id: "nodeopt-p2",
    topicId: "node-optimization",
    title: "memoizeWithTTL — кэш с истечением",
    difficulty: "medium",
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
    functionName: "nodeopt_p2_test",
    starterCode: `function memoizeWithTTL(fn, ttl) {
  // ваш код
}`,
    testCases: [
      {
        id: "nodeopt-p2-t1",
        inputDisplay: "повторный вызов — из кэша (fn не вызвана)",
        inputArgs: ["cache-hit"],
        expected: 1,
      },
      {
        id: "nodeopt-p2-t2",
        inputDisplay: "разные аргументы — разные кэши",
        inputArgs: ["diff-args"],
        expected: 2,
      },
      {
        id: "nodeopt-p2-t3",
        inputDisplay: "возвращает правильное значение",
        inputArgs: ["value"],
        expected: 10,
      },
      {
        id: "nodeopt-p2-t4",
        inputDisplay: "без аргументов — кэшируется",
        inputArgs: ["no-args"],
        expected: 1,
      },
      {
        id: "nodeopt-p2-t5",
        inputDisplay: "кэш создаётся для каждого набора args",
        inputArgs: ["multi-cache"],
        expected: [10, 20, 30],
      },
    ],
    hints: [
      "Кэш с TTL отличается от обычного тем, что каждая запись «протухает». Подумайте, что нужно сохранять помимо самого значения, чтобы при следующем обращении понять — годится оно ещё или пора пересчитать.",
      "Ключ — `JSON.stringify(args)`, значение в `Map` — объект `{ value, time }`, где `time = Date.now()` на момент записи. При вызове проверяйте `Date.now() - cached.time < ttl`; если да — возвращайте `cached.value`, иначе пересчитайте и обновите запись.",
      `TTL без вытеснения по размеру — классический источник утечек: ключи никогда не удаляются автоматически, даже когда «истекают», и \`Map\` растёт на каждый уникальный набор аргументов. На сервере с пользовательскими id это означает линейный рост памяти. В реальном кэше комбинируют TTL с лимитом (\`lru-cache\` пакет именно так и устроен) или периодически проходят и чистят протухшие записи. Ещё ловушка — \`JSON.stringify\` неравно сериализует объекты с разным порядком ключей: \`{a:1,b:2}\` и \`{b:2,a:1}\` дадут разные строки, хотя по смыслу одинаковы.

С чего начать:
\`\`\`js
function memoizeWithTTL(fn, ttl) {
  const cache = new Map();
  return function (...args) {
    // ...
  };
}
\`\`\``,
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
    id: "nodeopt-p3",
    topicId: "node-optimization",
    title: "Pool — пул ресурсов",
    difficulty: "medium",
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
    functionName: "Pool",
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
        id: "nodeopt-p3-t1",
        inputDisplay: "acquire возвращает Promise",
        inputArgs: ["returns-promise"],
        expected: true,
      },
      {
        id: "nodeopt-p3-t2",
        inputDisplay: "не более size ресурсов одновременно",
        inputArgs: ["max-size"],
        expected: 2,
      },
      {
        id: "nodeopt-p3-t3",
        inputDisplay: "release разблокирует ожидающий acquire",
        inputArgs: ["release-unblocks"],
        expected: true,
      },
      {
        id: "nodeopt-p3-t4",
        inputDisplay: "все ресурсы создаются через factory",
        inputArgs: ["factory-called"],
        expected: 2,
      },
      {
        id: "nodeopt-p3-t5",
        inputDisplay: "released ресурс переиспользуется",
        inputArgs: ["reuse"],
        expected: true,
      },
    ],
    hints: [
      "Пул хранит три «состояния»: свободные ресурсы, общее количество созданных и очередь ожидающих. Нужно понимать, в каком состоянии сейчас система при каждом `acquire`.",
      "Заведите массивы `available`, `waiting` и счётчик `total`. `acquire`: если есть `available` — `Promise.resolve(available.pop())`. Если `total < size` — `total++` и `factory()`. Иначе верните pending-промис, положив `resolve` в `waiting`. `release`: если в `waiting` кто-то есть — `waiting.shift()(resource)` напрямую, иначе `available.push(resource)`.",
      `В \`release\` важно отдавать ресурс напрямую первому из \`waiting\` в обход \`available\`. Если положить в \`available\` и надеяться, что следующий \`acquire\` его подберёт, можно получить race: между push и срабатыванием microtask-резолва другой код успеет вызвать \`acquire\`, увидит свободный ресурс и заберёт его вне очереди. Прямая передача через \`waiting.shift()(resource)\` гарантирует FIFO. Ещё момент — \`total++\` нужно делать **до** \`await factory()\`, иначе при одновременных \`acquire\` пул создаст больше ресурсов, чем разрешено.

С чего начать:
\`\`\`js
class Pool {
  constructor(factory, size) {
    this.factory = factory;
    this.size = size;
    this.available = [];
    this.waiting = [];
    this.total = 0;
  }
  acquire() { /* ... */ }
}
\`\`\``,
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
    id: "nodeopt-p4",
    topicId: "node-optimization",
    title: "batchProcessor — группировка вызовов",
    difficulty: "medium",
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
    functionName: "nodeopt_p4_test",
    starterCode: `function createBatcher(batchFn, maxSize, maxWait) {
  // ваш код — возвращает функцию add(item)
}`,
    testCases: [
      {
        id: "nodeopt-p4-t1",
        inputDisplay: "базовый батч из 3 элементов",
        inputArgs: ["basic"],
        expected: [2, 4, 6],
      },
      {
        id: "nodeopt-p4-t2",
        inputDisplay: "flush по maxSize",
        inputArgs: ["flush-size"],
        expected: true,
      },
      {
        id: "nodeopt-p4-t3",
        inputDisplay: "batchFn вызван один раз для батча",
        inputArgs: ["single-call"],
        expected: 1,
      },
      {
        id: "nodeopt-p4-t4",
        inputDisplay: "каждый item получает свой результат",
        inputArgs: ["individual"],
        expected: [10, 20, 30],
      },
      {
        id: "nodeopt-p4-t5",
        inputDisplay: "flush по maxWait (таймер)",
        inputArgs: ["flush-wait"],
        expected: true,
      },
    ],
    hints: [
      "Каждый одиночный вызов должен «припарковаться» и подождать, пока система решит запустить общий батч. Подумайте, как связать промис от вызова с конкретным элементом батча.",
      "Держите массивы `batch` и `resolvers`. На каждом `add(item)` создавайте `new Promise((resolve) => { batch.push(item); resolvers.push(resolve); })`. После пуша проверьте: если `batch.length >= maxSize` — `flush()` сразу; иначе, если таймер ещё не висит, запустите `setTimeout(flush, maxWait)`. В `flush` снимите ссылки на текущий батч, обнулите состояние, вызовите `batchFn` и разнесите результаты по соответствующим `resolvers[i]`.",
      `Самая коварная ошибка — забыть «снять» текущий батч в локальные переменные **до** вызова \`batchFn\`. Если оставить общие \`batch\`/\`resolvers\` и обнулить их только после ответа, новые \`add\` во время \`await batchFn(...)\` будут дописываться в тот же массив и получат результаты от чужого батча. Также если \`batchFn\` упадёт, нужно правильно отреджектить все накопленные \`resolvers\` — иначе вызывающие промисы зависнут навечно. И не забудьте \`clearTimeout\` при flush по размеру, иначе таймер позже вызовет \`flush\` уже пустого батча.

С чего начать:
\`\`\`js
function createBatcher(batchFn, maxSize, maxWait) {
  let batch = [];
  let resolvers = [];
  let timer = null;
  function flush() { /* ... */ }
  return function add(item) { /* ... */ };
}
\`\`\``,
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
    id: "nodeopt-p5",
    topicId: "node-optimization",
    title: "circuitBreaker — размыкатель цепи",
    difficulty: "medium",
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
    functionName: "nodeopt_p5_test",
    starterCode: `function createCircuitBreaker(fn, threshold, timeout) {
  // ваш код — возвращает обёрнутую функцию
}`,
    testCases: [
      {
        id: "nodeopt-p5-t1",
        inputDisplay: "до threshold — вызывает fn",
        inputArgs: ["below-threshold"],
        expected: true,
      },
      {
        id: "nodeopt-p5-t2",
        inputDisplay: "после threshold — Circuit open",
        inputArgs: ["circuit-open"],
        expected: "Circuit open",
      },
      {
        id: "nodeopt-p5-t3",
        inputDisplay: "fn не вызывается в OPEN состоянии",
        inputArgs: ["no-call-open"],
        expected: 0,
      },
      {
        id: "nodeopt-p5-t4",
        inputDisplay: "успешный вызов сбрасывает счётчик",
        inputArgs: ["reset"],
        expected: "success",
      },
      {
        id: "nodeopt-p5-t5",
        inputDisplay: "три состояния: CLOSED → OPEN → HALF-OPEN",
        inputArgs: ["states"],
        expected: ["CLOSED", "OPEN", "HALF-OPEN"],
      },
    ],
    hints: [
      "Circuit Breaker — это конечный автомат с тремя состояниями. Нужно понимать, какие события (успех, ошибка, истечение таймера) переключают его из одного состояния в другое.",
      "Держите `state` (`'CLOSED' | 'OPEN' | 'HALF-OPEN'`), счётчик `failures` и метку времени `nextAttempt`. Перед вызовом `fn`: если `OPEN` и `Date.now() < nextAttempt` — бросайте `Error('Circuit open')`; иначе переключайтесь в `HALF-OPEN`. На успехе сбрасывайте `failures = 0` и ставьте `CLOSED`. На ошибке `failures++`; если порог достигнут — `state = 'OPEN'`, `nextAttempt = Date.now() + timeout`. Затем перебрасывайте ошибку дальше.",
      `Главная ценность circuit breaker — не сама защита от ошибок, а отсечение нагрузки от лежащего сервиса. Без размыкателя клиент продолжает долбить упавший downstream и забивает свой пул соединений, очереди, потоки воркеров — каскадный сбой выходит за пределы одного сервиса. В HALF-OPEN важно пропускать **ровно один** пробный запрос: если пропустить N — на грани восстановления сервис снова словит шторм и опять упадёт. Production-библиотеки (opossum) считают не «N ошибок подряд», а долю ошибок за окно — это устойчивее к редким случайным сбоям.

С чего начать:
\`\`\`js
function createCircuitBreaker(fn, threshold, timeout) {
  let state = 'CLOSED';
  let failures = 0;
  let nextAttempt = 0;
  return async function (...args) { /* ... */ };
}
\`\`\``,
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
    kind: "predict-output",
    id: "no-p1",
    topicId: "node-optimization",
    title: "Определи вывод: трассировка LRU cache",
    difficulty: "medium",
    isContextual: false,
    description: `Перед вами LRU cache на 2 элемента. Запомните: при \`get\` ключ становится «свежим» (переезжает в конец), при \`put\` в полный кэш вытесняется самый старый.

Введите каждое напечатанное значение на отдельной строке.`,
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
    expected: "a\n-1\nc\n-1\nc\nd",
    hints: [
      "Главное правило: `get` и `put` существующего ключа делают его «свежим», а в полный кэш `put` нового ключа выкидывает самого старого.",
      "В этом коде `Map` хранит ключи в порядке вставки. `delete` + `set` перекладывает ключ в конец, поэтому «голова» Map — всегда самый давний. На каждом шаге трассируйте состояние Map от старого к свежему.",
      `Пошагово (Map от старого к свежему):
- put(1,'a'): [1] → put(2,'b'): [1,2].
- get(1): 'a', порядок: [2,1].
- put(3,'c'): полно → удаляем 2: [1,3].
- get(2): -1.
- get(3): 'c', порядок: [1,3].
- put(4,'d'): полно → удаляем 1: [3,4].
- get(1): -1; get(3): 'c'; get(4): 'd'.
- Итого: a, -1, c, -1, c, d.`,
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
    kind: "find-bug",
    id: "no-p2",
    topicId: "node-optimization",
    title: "Найдите баг: мемоизация без ограничения памяти",
    difficulty: "medium",
    isContextual: false,
    description: `Эта мемоизация работает, но в production «съедает» память: на множестве уникальных аргументов кэш растёт до **OOM**.

Почини так, чтобы кэш хранил **не более 100** записей: при превышении вытесняется самая старая (FIFO достаточно для прохождения тестов).`,
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
    functionName: "no_p2_test",
    bugSummary:
      "Кэш растёт без ограничений: каждый новый уникальный набор аргументов добавляет запись, старые никогда не удаляются. На сервере, где аргументы — это пользовательские id или query, heap растёт линейно с трафиком и упирается в OOM. Решение — добавить лимит размера и вытеснять самый старый ключ через `cache.delete(cache.keys().next().value)`.",
    testCases: [
      {
        id: "no-p2-t1",
        inputDisplay: "кэш-хит: f(5) дважды → fn вызвана 1 раз",
        inputArgs: ["hit"],
        expected: 1,
      },
      {
        id: "no-p2-t2",
        inputDisplay: "возвращает корректное значение",
        inputArgs: ["value"],
        expected: 25,
      },
      {
        id: "no-p2-t3",
        inputDisplay: "после 100 уникальных ключей размер кэша ≤ 100",
        inputArgs: ["size-limit"],
        expected: true,
      },
      {
        id: "no-p2-t4",
        inputDisplay: "после 200 уникальных вставок самый старый ключ вытеснен",
        inputArgs: ["evicted"],
        expected: true,
      },
      {
        id: "no-p2-t5",
        inputDisplay: "свежий ключ не вытесняется при превышении",
        inputArgs: ["fresh-survives"],
        expected: true,
      },
    ],
    hints: [
      "Сейчас новая запись добавляется в кеш всегда, без оглядки на его размер. Нужно ограничить рост и решить, какую запись выкидывать при переполнении.",
      "Перед `cache.set` проверяйте `cache.size >= MAX`. Если да — удалите самый старый ключ через `cache.delete(cache.keys().next().value)` (Map хранит порядок вставки, первый ключ — самый давний). Это FIFO-вытеснение и его достаточно для тестов.",
      "Классическая утечка памяти в Node.js: unbounded cache на горячем пути. Симптом — heap растёт линейно со временем работы процесса, GC занимает всё больше CPU, в какой-то момент срабатывает OOM-killer. Особенно опасно, когда ключи зависят от пользовательских данных (id, query, header'ы) — атакующий может намеренно «надувать» кэш уникальными ключами. Правильная стратегия — всегда ограничивать размер кэша. FIFO достаточно для защиты от роста, LRU точнее по hit-rate, но дороже в реализации.",
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
    kind: "refactor",
    id: "no-p3",
    topicId: "node-optimization",
    title: "Рефакторинг: LRU на массиве → O(1) через Map",
    difficulty: "medium",
    isContextual: false,
    description: `Дан LRU cache на массиве: \`get\` и \`put\` ищут ключ через \`findIndex\` и сдвигают массив через \`splice\` — это O(n). На 100 000 операций он не проходит по времени.

Перепишите класс через \`Map\` так, чтобы все операции работали за **O(1)**. Сигнатура должна остаться: \`new LRUCache(capacity)\`, \`get(key)\`, \`put(key, value)\`. \`get\` для отсутствующего ключа возвращает \`-1\`.

Идея: \`Map\` сохраняет порядок вставки. При \`get\` удаляйте и вставляйте ключ заново — он переедет в конец как «свежий». При \`put\` в полный кэш удаляйте \`map.keys().next().value\`.`,
    functionName: "LRUCache_test",
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
      {
        id: "no-p3-t1",
        inputDisplay: "базовый get/put",
        inputArgs: ["basic"],
        expected: "a",
      },
      {
        id: "no-p3-t2",
        inputDisplay: "get несуществующего → -1",
        inputArgs: ["miss"],
        expected: -1,
      },
      {
        id: "no-p3-t3",
        inputDisplay: "вытеснение самого старого",
        inputArgs: ["eviction"],
        expected: -1,
      },
      {
        id: "no-p3-t4",
        inputDisplay: "get обновляет «свежесть»",
        inputArgs: ["priority"],
        expected: "a",
      },
      {
        id: "no-p3-t5",
        inputDisplay: "put обновляет существующий ключ",
        inputArgs: ["update"],
        expected: "new",
      },
    ],
    perfTest: { inputArgs: ["perf"], maxMs: 50 },
    hints: [
      "Проблема — `findIndex` и `splice` ходят по массиву линейно. Нужна структура, которая и быстро ищет по ключу, и сохраняет порядок обращений.",
      "`Map` решает обе задачи: `has`/`get`/`delete`/`set` — это `O(1)`, и при этом порядок вставки сохраняется. На `get` делайте `delete` + `set`, чтобы переместить ключ в конец как «свежий». На переполнении удаляйте `cache.keys().next().value` — это самый давний.",
      "Почему два массива дают O(n), а `Map` — O(1): и `findIndex`, и `splice`, и `shift` все линейны по длине массива, потому что должны перебрать или сдвинуть элементы. `Map` под капотом — хэш-таблица: `has`/`get`/`delete`/`set` амортизированно константные. Плюс ES2015 даёт бесплатную «временную ось» — итератор по `Map` идёт в порядке вставки, поэтому `cache.keys().next().value` всегда даёт самый старый ключ без отдельной структуры. Альтернатива — двусвязный список + хэш-таблица — даёт те же O(1), но в JS это лишний код, который `Map` уже делает за вас.",
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
  {
    id: "nodeopt-easy1",
    topicId: "node-optimization",
    kind: "find-bug",
    title: "Найдите утечку памяти: растущий кеш",
    difficulty: "easy",
    isContextual: false,
    description: `В Node.js-сервисе есть кеш ответов API. Разработчик заметил, что процесс со временем потребляет всё больше памяти.

Найдите и исправьте **утечку памяти**. Кеш должен хранить **не более 1000** записей — при добавлении 1001-й удалять самую старую.`,
    functionName: "apiCache",
    buggyCode: `class ApiCache {
  constructor() {
    this.cache = {};
  }

  set(key, value) {
    this.cache[key] = value;
    // Кеш никогда не очищается — утечка памяти!
  }

  get(key) {
    return this.cache[key] ?? null;
  }
}`,
    bugSummary:
      "Кеш растёт без ограничений. Решение: ограничить размер и удалять старые записи при превышении. Для O(1) операций — использовать `Map` (сохраняет порядок вставки) и удалять первый ключ, когда размер выходит за лимит.",
    testCases: [
      {
        id: "nodeopt-easy1-t1",
        inputDisplay: "базовый get/set работает",
        inputArgs: ["basic"],
        expected: "value1",
      },
      {
        id: "nodeopt-easy1-t2",
        inputDisplay: "кеш не растёт больше 1000 записей",
        inputArgs: ["size-limit"],
        expected: true,
      },
      {
        id: "nodeopt-easy1-t3",
        inputDisplay: "старые записи вытесняются",
        inputArgs: ["eviction"],
        expected: null,
      },
    ],
    hints: [
      "Сейчас кеш растёт неограниченно: каждый новый ключ добавляется, старые никогда не удаляются. Нужна структура, которая помнит порядок добавления, чтобы выкидывать самый давний.",
      "Замените `{}` на `Map` — она сохраняет порядок вставки. В `set`: положите запись, и если `cache.size > maxSize` — удалите `cache.keys().next().value` (это первый, самый старый ключ).",
      "В реальности утечка через unbounded cache часто проявляется не сразу: первые часы heap выглядит нормально, потом начинает расти, GC поглощает всё больше CPU, latency растёт ступеньками, и в какой-то момент процесс падает. Особенно коварно, когда ключи — это пользовательские id или query: они потенциально неограниченны, и обычное load-тестирование на повторяющихся данных проблему не ловит. Замена `{}` на `Map` даёт ещё один бонус — отсутствие коллизий с `__proto__`/`constructor` и контроль порядка для LRU.",
    ],
    solutionCode: `class ApiCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 1000;
  }

  set(key, value) {
    if (this.cache.has(key)) this.cache.delete(key); // обновляем порядок
    this.cache.set(key, value);
    if (this.cache.size > this.maxSize) {
      this.cache.delete(this.cache.keys().next().value);
    }
  }

  get(key) {
    return this.cache.has(key) ? this.cache.get(key) : null;
  }
}`,
    testHelperCode: `function apiCache(scenario) {
  const cache = new ApiCache();
  if (scenario === 'basic') {
    cache.set('k1', 'value1');
    return cache.get('k1');
  }
  if (scenario === 'size-limit') {
    for (let i = 0; i < 1500; i++) cache.set('key' + i, i);
    return cache.cache.size <= 1000;
  }
  if (scenario === 'eviction') {
    for (let i = 0; i < 1001; i++) cache.set('key' + i, i);
    return cache.get('key0'); // первый должен быть вытеснен
  }
}`,
  },
  {
    id: "nodeopt-easy2",
    topicId: "node-optimization",
    kind: "refactor",
    title: "Оптимизируй: O(n²) поиск дубликатов → O(n)",
    difficulty: "easy",
    isContextual: false,
    description: `Функция находит все дублирующиеся элементы в массиве. Текущая реализация работает за **O(n²)** — на большом массиве это слишком медленно.

Перепишите через \`Set\` / \`Map\` так, чтобы алгоритм работал за **O(n)**.`,
    functionName: "findDuplicates",
    starterCode: `function findDuplicates(arr) {
  // O(n²): для каждого элемента проверяем все остальные
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates.sort((a, b) => a - b);
}`,
    testCases: [
      {
        id: "nodeopt-easy2-t1",
        inputDisplay: "findDuplicates([1,2,3,2,4,3,5])",
        inputArgs: [[1, 2, 3, 2, 4, 3, 5]],
        expected: [2, 3],
      },
      {
        id: "nodeopt-easy2-t2",
        inputDisplay: "findDuplicates([1,2,3]) → []",
        inputArgs: [[1, 2, 3]],
        expected: [],
      },
      {
        id: "nodeopt-easy2-t3",
        inputDisplay: "findDuplicates([1,1,1,1])",
        inputArgs: [[1, 1, 1, 1]],
        expected: [1],
      },
      {
        id: "nodeopt-easy2-t4",
        inputDisplay: "findDuplicates([]) → []",
        inputArgs: [[]],
        expected: [],
      },
    ],
    perfTest: {
      inputArgs: [Array.from({ length: 100000 }, (_, i) => i % 5000)],
      maxMs: 50,
    },
    hints: [
      "Сейчас алгоритм для каждого элемента смотрит на все следующие — это и даёт квадрат. Нужно за один проход запомнить, какие значения уже видели.",
      "Заведите `Set seen` и `Set duplicates`. Проход одним циклом: если элемент уже в `seen` — добавьте его в `duplicates`, иначе — в `seen`. В конце `[...duplicates].sort((a, b) => a - b)`. Операции `Set` — `O(1)`.",
    ],
    solutionCode: `function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();

  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }

  return [...duplicates].sort((a, b) => a - b);
}`,
  },
  {
    id: "nodeopt-h1",
    topicId: "node-optimization",
    kind: "implement",
    title: "Worker Thread Pool — пул воркеров для CPU-задач",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте класс \`WorkerPool\`, который управляет пулом Worker Threads для параллельного выполнения CPU-bound задач.

Методы:
- \`run(data)\` — запустить задачу, вернуть промис результата
- \`destroy()\` — завершить все воркеры

\`\`\`js
const pool = new WorkerPool('./worker.js', { poolSize: 4 });
const result = await pool.run({ numbers: [1, 2, 3] });
pool.destroy();
\`\`\`

В тестовой среде воркер эмулируется inline — используйте \`workerData\` из конструктора.`,
    functionName: "WorkerPool_test",
    starterCode: `const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

class WorkerPool {
  constructor(workerScript, { poolSize }) {
    // ваш код
  }

  run(data) {
    // ваш код — возвращает Promise
  }

  destroy() {
    // ваш код
  }
}`,
    testCases: [
      {
        id: "nodeopt-h1-t1",
        inputDisplay: "задача выполняется в воркере",
        inputArgs: ["basic"],
        expected: 42,
      },
      {
        id: "nodeopt-h1-t2",
        inputDisplay: "задачи распределяются по воркерам",
        inputArgs: ["parallel"],
        expected: true,
      },
      {
        id: "nodeopt-h1-t3",
        inputDisplay: "destroy завершает воркеры",
        inputArgs: ["destroy"],
        expected: true,
      },
    ],
    hints: [
      "Воркеров несколько, и каждый умеет принять одну задачу за раз. Нужно понять, кому отдать новую задачу прямо сейчас и куда деть её, если все заняты.",
      "Создайте `poolSize` воркеров заранее. Держите `Map<worker, { resolve, reject }>` для текущих активных задач и массив `queue` для ожидающих. В `run(data)`: найдите свободного воркера (`workers.find(w => !active.has(w))`); если есть — `postMessage(data)`; иначе кладите в очередь. На `worker.on('message')`: достаньте `resolve`, удалите воркер из active, разрулите очередь.",
      `Worker Threads нужны именно для CPU-bound задач (хэширование, сжатие, парсинг больших структур): сам main thread в Node.js однопоточный, и тяжёлая синхронная работа блокирует event loop, а с ним — все входящие запросы. Но воркеры дорогие на старт (десятки миллисекунд) и едят память — поэтому их **создают заранее пулом**, а не на каждую задачу. Также не забудьте про обработку \`error\` и \`exit\`: упавший воркер должен быть либо перезапущен, либо заменён новым, иначе пул постепенно усыхает до нуля, и \`run()\` зависает навсегда.

С чего начать:
\`\`\`js
class WorkerPool {
  constructor(workerScript, { poolSize }) {
    this.workers = [];
    this.queue = [];
    this.activeWorkers = new Map();
    // ...
  }
  run(data) { /* ... */ }
}
\`\`\``,
    ],
    solutionCode: `const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

class WorkerPool {
  constructor(workerScript, { poolSize }) {
    this.workers = [];
    this.queue = [];
    this.activeWorkers = new Map();

    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(workerScript);
      worker.on('message', (result) => {
        const { resolve } = this.activeWorkers.get(worker);
        this.activeWorkers.delete(worker);
        resolve(result);
        this._processQueue(worker);
      });
      worker.on('error', (err) => {
        const pending = this.activeWorkers.get(worker);
        if (pending) {
          pending.reject(err);
          this.activeWorkers.delete(worker);
        }
        this._processQueue(worker);
      });
      this.workers.push(worker);
    }
  }

  run(data) {
    return new Promise((resolve, reject) => {
      const freeWorker = this.workers.find(w => !this.activeWorkers.has(w));
      if (freeWorker) {
        this.activeWorkers.set(freeWorker, { resolve, reject });
        freeWorker.postMessage(data);
      } else {
        this.queue.push({ data, resolve, reject });
      }
    });
  }

  _processQueue(worker) {
    if (this.queue.length > 0) {
      const { data, resolve, reject } = this.queue.shift();
      this.activeWorkers.set(worker, { resolve, reject });
      worker.postMessage(data);
    }
  }

  async destroy() {
    await Promise.all(this.workers.map(w => w.terminate()));
    this.workers = [];
  }
}`,
    testHelperCode: `const { Worker, isMainThread, parentPort } = require('worker_threads');

async function WorkerPool_test(scenario) {
  // Эмулируем Worker без реального файла — используем inline через data URL
  // В тестовой среде создаём простой inline воркер
  const workerCode = \`
    const { parentPort } = require('worker_threads');
    parentPort.on('message', (data) => {
      parentPort.postMessage(data.value * 2);
    });
  \`;

  class TestWorkerPool {
    constructor(poolSize) {
      this.workers = [];
      this.queue = [];
      this.active = new Map();
      for (let i = 0; i < poolSize; i++) {
        const w = new Worker(workerCode, { eval: true });
        w.on('message', (res) => {
          const { resolve } = this.active.get(w);
          this.active.delete(w);
          resolve(res);
          if (this.queue.length) {
            const next = this.queue.shift();
            this.active.set(w, next);
            w.postMessage(next.data);
          }
        });
        this.workers.push(w);
      }
    }
    run(data) {
      return new Promise((resolve, reject) => {
        const free = this.workers.find(w => !this.active.has(w));
        if (free) { this.active.set(free, { resolve, reject, data }); free.postMessage(data); }
        else this.queue.push({ data, resolve, reject });
      });
    }
    async destroy() { await Promise.all(this.workers.map(w => w.terminate())); }
  }

  if (scenario === 'basic') {
    const pool = new TestWorkerPool(2);
    const result = await pool.run({ value: 21 });
    await pool.destroy();
    return result;
  }
  if (scenario === 'parallel') {
    const pool = new TestWorkerPool(3);
    const results = await Promise.all([
      pool.run({ value: 1 }),
      pool.run({ value: 2 }),
      pool.run({ value: 3 }),
    ]);
    await pool.destroy();
    return results.every((r, i) => r === (i + 1) * 2);
  }
  if (scenario === 'destroy') {
    const pool = new TestWorkerPool(2);
    await pool.destroy();
    return pool.workers.length === 0;
  }
}`,
  },
  {
    id: "nodeopt-h2",
    topicId: "node-optimization",
    kind: "implement",
    title:
      "Потоковая агрегация — без загрузки всех данных в память",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте функцию \`aggregateStream(readable, { groupBy, aggregate })\`, которая:

1. Читает JSON-объекты из Readable stream (по одному JSON на строку — NDJSON)
2. Группирует по полю \`groupBy\`
3. Применяет функцию \`aggregate(acc, item)\` к каждой группе
4. Возвращает промис с объектом \`{ [groupKey]: aggregatedValue }\`

**Ключевое**: данные не загружаются целиком в память — каждая строка обрабатывается сразу.

Пример:
\`\`\`
// NDJSON: {"dept":"eng","salary":100}\\n{"dept":"hr","salary":50}\\n{"dept":"eng","salary":80}
const result = await aggregateStream(stream, {
  groupBy: 'dept',
  aggregate: (acc, item) => (acc ?? 0) + item.salary
});
// → { eng: 180, hr: 50 }
\`\`\``,
    functionName: "aggregateStream_test",
    starterCode: `async function aggregateStream(readable, { groupBy, aggregate }) {
  // ваш код — обрабатывайте построчно, не копите всё в памяти!
}`,
    testCases: [
      {
        id: "nodeopt-h2-t1",
        inputDisplay: "суммирует salary по dept",
        inputArgs: ["sum-salary"],
        expected: { eng: 180, hr: 50 },
      },
      {
        id: "nodeopt-h2-t2",
        inputDisplay: "считает количество по категории",
        inputArgs: ["count"],
        expected: { a: 3, b: 2 },
      },
      {
        id: "nodeopt-h2-t3",
        inputDisplay: "пустой stream → {}",
        inputArgs: ["empty"],
        expected: {},
      },
    ],
    hints: [
      "Главное — не копить весь массив объектов в памяти. Каждую строку нужно сразу учесть в одном общем словаре результатов.",
      "Подпишитесь на `readable.on('data')`. Ведите `buffer`: `buffer += chunk.toString()`, потом `split('\\n')`, последний элемент возвращайте в буфер. Для каждой полной строки делайте `JSON.parse`, берите `item[groupBy]` как ключ и обновляйте `results[key] = aggregate(results[key], item)`. На `'end'` обработайте оставшийся `buffer` и `resolve(results)`.",
      `Принципиальное отличие от наивного подхода «прочитать всё → \`JSON.parse(text)\` → пройти \`reduce\`» — память O(числа уникальных групп), а не O(всех строк). На логах из миллионов записей с десятком отделов это разница между десятком килобайт и парой гигабайт. Главное правило при работе с NDJSON-чанками — после \`split('\\n')\` всегда возвращайте \`parts.pop()\` обратно в буфер: чанк почти никогда не оканчивается ровно на \`\\n\`, и без этого вы будете терять обрезанную «голову» следующей JSON-строки. И не забудьте про \`'end'\` — последняя строка в файле часто без перевода, её обработают только в финальном дренаже буфера.

С чего начать:
\`\`\`js
async function aggregateStream(readable, { groupBy, aggregate }) {
  return new Promise((resolve, reject) => {
    const results = {};
    let buffer = '';
    readable.on('data', (chunk) => { /* ... */ });
    readable.on('end', () => resolve(results));
  });
}
\`\`\``,
    ],
    solutionCode: `async function aggregateStream(readable, { groupBy, aggregate }) {
  return new Promise((resolve, reject) => {
    const results = {};
    let buffer = '';

    function processLine(line) {
      const trimmed = line.trim();
      if (!trimmed) return;
      try {
        const item = JSON.parse(trimmed);
        const key = item[groupBy];
        results[key] = aggregate(results[key], item);
      } catch (_) {}
    }

    readable.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\\n');
      buffer = lines.pop();
      lines.forEach(processLine);
    });

    readable.on('end', () => {
      if (buffer.trim()) processLine(buffer);
      resolve(results);
    });

    readable.on('error', reject);
  });
}`,
    testHelperCode: `const { Readable } = require('stream');

async function aggregateStream_test(scenario) {
  function makeStream(lines) {
    return Readable.from([lines.join('\\n')]);
  }

  if (scenario === 'sum-salary') {
    const lines = [
      '{"dept":"eng","salary":100}',
      '{"dept":"hr","salary":50}',
      '{"dept":"eng","salary":80}',
    ];
    return await aggregateStream(makeStream(lines), {
      groupBy: 'dept',
      aggregate: (acc, item) => (acc ?? 0) + item.salary,
    });
  }
  if (scenario === 'count') {
    const lines = [
      '{"cat":"a"}', '{"cat":"b"}', '{"cat":"a"}', '{"cat":"a"}', '{"cat":"b"}',
    ];
    return await aggregateStream(makeStream(lines), {
      groupBy: 'cat',
      aggregate: (acc) => (acc ?? 0) + 1,
    });
  }
  if (scenario === 'empty') {
    return await aggregateStream(Readable.from(['']), {
      groupBy: 'key',
      aggregate: (acc) => acc,
    });
  }
}`,
  },
  {
    id: "nodeopt-easy3",
    topicId: "node-optimization",
    title: "deepFlatten — рекурсивное выпрямление массива",
    difficulty: "easy",
    isContextual: false,
    description: `Реализуйте \`deepFlatten(arr)\` — функцию, которая «выпрямляет» массив **любой** глубины вложенности в плоский массив.

Условие задачи: реализуйте **сами**, без \`Array.prototype.flat(Infinity)\`.

Пример:
\`\`\`
deepFlatten([1, [2, [3, [4]], 5]])       // → [1, 2, 3, 4, 5]
deepFlatten([])                           // → []
deepFlatten([1, 2, 3])                    // → [1, 2, 3]
deepFlatten([[], [[]], [[1]]])            // → [1]
\`\`\``,
    functionName: 'deepFlatten',
    starterCode: `function deepFlatten(arr) {
  // ваш код — без flat(Infinity)
}`,
    testCases: [
      { id: 'nodeopt-easy3-t1', inputDisplay: "deepFlatten([1, [2, [3, [4]], 5]])", inputArgs: [[1, [2, [3, [4]], 5]]], expected: [1, 2, 3, 4, 5] },
      { id: 'nodeopt-easy3-t2', inputDisplay: "deepFlatten([])", inputArgs: [[]], expected: [] },
      { id: 'nodeopt-easy3-t3', inputDisplay: "deepFlatten([1, 2, 3])", inputArgs: [[1, 2, 3]], expected: [1, 2, 3] },
      { id: 'nodeopt-easy3-t4', inputDisplay: "deepFlatten([[], [[]], [[1]]])", inputArgs: [[[], [[]], [[1]]]], expected: [1] },
      { id: 'nodeopt-easy3-t5', inputDisplay: "глубокая 5-уровневая вложенность", inputArgs: [[1, [2, [3, [4, [5]]]]]], expected: [1, 2, 3, 4, 5] },
    ],
    hints: [
      "Глубина может быть любой, и заранее непонятно, сколько уровней. Решение должно работать само по себе при любой вложенности.",
      "Самый короткий вариант — рекурсия. Проходите по `arr`: если элемент — массив (`Array.isArray`), разверните его рекурсивно и `push(...deepFlatten(x))`. Иначе просто `push(x)`. Есть и итеративный вариант со стеком — он избегает глубокой рекурсии на гигантских структурах.",
    ],
    solutionCode: `function deepFlatten(arr) {
  const result = [];
  for (const x of arr) {
    if (Array.isArray(x)) {
      result.push(...deepFlatten(x));
    } else {
      result.push(x);
    }
  }
  return result;
}`,
  },
  {
    id: "nodeopt-easy4",
    topicId: "node-optimization",
    title: "uniqBy — O(n) уникализация по ключу",
    difficulty: "easy",
    isContextual: false,
    description: `Реализуйте \`uniqBy(items, keyFn)\` — функцию, которая возвращает массив элементов \`items\` без дубликатов **по значению ключа**. Ключ для каждого элемента вычисляется через \`keyFn(item)\`.

Из дубликатов сохраняется **первый** встретившийся.

**Требование:** O(n) — не используйте вложенные циклы или \`includes\`.

Пример:
\`\`\`
uniqBy([1, 2, 2, 3, 1], (x) => x)
// → [1, 2, 3]

uniqBy([{ id: 1 }, { id: 2 }, { id: 1 }], (u) => u.id)
// → [{ id: 1 }, { id: 2 }]

uniqBy(['apple', 'banana', 'apricot'], (s) => s[0])
// → ['apple', 'banana']
\`\`\``,
    functionName: 'uniqBy_test',
    starterCode: `function uniqBy(items, keyFn) {
  // ваш код — O(n)
}`,
    testCases: [
      { id: 'nodeopt-easy4-t1', inputDisplay: "uniqBy([1, 2, 2, 3, 1], x => x)", inputArgs: ['nums'], expected: [1, 2, 3] },
      { id: 'nodeopt-easy4-t2', inputDisplay: "uniqBy объектов по id", inputArgs: ['by-id'], expected: [{ id: 1 }, { id: 2 }] },
      { id: 'nodeopt-easy4-t3', inputDisplay: "uniqBy строк по первой букве", inputArgs: ['by-first-letter'], expected: ['apple', 'banana'] },
      { id: 'nodeopt-easy4-t4', inputDisplay: "пустой массив", inputArgs: ['empty'], expected: [] },
      { id: 'nodeopt-easy4-t5', inputDisplay: "все элементы одинаковые → один", inputArgs: ['all-same'], expected: [5] },
    ],
    hints: [
      "Нужно за один проход отличать «уже видели такой ключ» от «новый». Сделайте проверку за константное время — без вложенных циклов и `includes`.",
      "Заведите `Set seen`. На каждом элементе вычисляйте `key = keyFn(item)` и проверяйте `seen.has(key)`: если нет — `seen.add(key)` и `result.push(item)`. `Set.has`/`add` — это `O(1)`, итого вся функция работает за `O(n)`.",
    ],
    solutionCode: `function uniqBy(items, keyFn) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = keyFn(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}`,
    testHelperCode: `function uniqBy_test(scenario) {
  if (scenario === 'nums') return uniqBy([1, 2, 2, 3, 1], (x) => x);
  if (scenario === 'by-id') return uniqBy([{ id: 1 }, { id: 2 }, { id: 1 }], (u) => u.id);
  if (scenario === 'by-first-letter') return uniqBy(['apple', 'banana', 'apricot'], (s) => s[0]);
  if (scenario === 'empty') return uniqBy([], (x) => x);
  if (scenario === 'all-same') return uniqBy([5, 5, 5, 5], (x) => x);
}`,
  },
  {
    id: "nodeopt-h3",
    topicId: "node-optimization",
    kind: "implement",
    title: "createPriorityQueue — приоритетная очередь (binary heap)",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте \`createPriorityQueue(compare)\` — приоритетную очередь на основе **бинарной кучи** (min-heap или max-heap, в зависимости от compare).

API:
- \`.push(value)\` — добавить в очередь (O(log n)).
- \`.pop()\` — извлечь и вернуть элемент с **наивысшим приоритетом** (O(log n)). Если очередь пуста — вернуть \`undefined\`.
- \`.peek()\` — посмотреть верхний элемент без извлечения (O(1)).
- \`.size\` (геттер) — текущий размер.

\`compare(a, b)\` — функция сравнения: возвращает отрицательное, если \`a\` должен идти первым; положительное — если \`b\`; ноль — равны. Это согласуется с \`Array.sort\`.

Пример (min-heap):
\`\`\`
const pq = createPriorityQueue((a, b) => a - b);
pq.push(3); pq.push(1); pq.push(2);
pq.pop();  // → 1
pq.pop();  // → 2
pq.pop();  // → 3
\`\`\`

Это базовая алгоритмическая структура: применяется в алгоритме Дейкстры, в поиске медианы в потоке, в задачах top-K. Полезно один раз написать руками — потом она встречается во многих местах.`,
    functionName: 'pq_test',
    starterCode: `function createPriorityQueue(compare) {
  // ваш код — бинарная куча на массиве
}`,
    testCases: [
      { id: 'nodeopt-h3-t1', inputDisplay: "min-heap: push 3,1,2 → pop порядок", inputArgs: ['min-heap'], expected: [1, 2, 3] },
      { id: 'nodeopt-h3-t2', inputDisplay: "max-heap: push 1,5,3 → pop порядок", inputArgs: ['max-heap'], expected: [5, 3, 1] },
      { id: 'nodeopt-h3-t3', inputDisplay: "size отражает push/pop", inputArgs: ['size-flow'], expected: [0, 3, 2] },
      { id: 'nodeopt-h3-t4', inputDisplay: "peek не извлекает", inputArgs: ['peek'], expected: { peek: 1, size: 3 } },
      { id: 'nodeopt-h3-t5', inputDisplay: "pop пустой → undefined", inputArgs: ['empty-pop'], expected: undefined },
      { id: 'nodeopt-h3-t6', inputDisplay: "100 рандомных значений сортируются", inputArgs: ['random-many'], expected: true },
    ],
    hints: [
      "Куча — это не отдельные узлы со ссылками, а массив с особым свойством порядка: родитель «не больше» потомков (для min-heap). Операции `push`/`pop` восстанавливают это свойство локальными перестановками.",
      "Адресация в массиве: у индекса `i` потомки — `2*i+1` и `2*i+2`, родитель — `(i-1) >> 1`. `push(v)`: положите в конец, потом `siftUp` — поднимайте, пока `compare(heap[i], heap[parent]) < 0`. `pop()`: запомните корень, переставьте последний элемент в `heap[0]`, потом `siftDown` — опускайте на меньшего из потомков, пока порядок не восстановится.",
      `В \`pop()\` есть тонкий момент с пустым массивом: после извлечения последнего элемента нельзя автоматически записать \`heap[0] = last\`, потому что \`heap.pop()\` уже опустошил массив. Нужна явная проверка \`if (heap.length > 0)\` перед \`siftDown\`. Также сравнение через знак \`< 0\` (а не \`<=\`) важно — равные элементы не двигаются, и куча остаётся стабильной по второму ключу, если ваш \`compare\` это закладывает. Бинарная куча в массиве даёт идеальный cache locality — родитель и потомки лежат рядом по индексам, что на больших объёмах быстрее любой реализации со ссылками.

С чего начать:
\`\`\`js
function createPriorityQueue(compare) {
  const heap = [];
  function siftUp(i) { /* ... */ }
  function siftDown(i) { /* ... */ }
  return { push(v) {}, pop() {}, peek() {}, get size() { return heap.length; } };
}
\`\`\``,
    ],
    solutionCode: `function createPriorityQueue(compare) {
  const heap = [];

  function siftUp(i) {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (compare(heap[i], heap[parent]) < 0) {
        [heap[i], heap[parent]] = [heap[parent], heap[i]];
        i = parent;
      } else break;
    }
  }

  function siftDown(i) {
    const n = heap.length;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let smallest = i;
      if (l < n && compare(heap[l], heap[smallest]) < 0) smallest = l;
      if (r < n && compare(heap[r], heap[smallest]) < 0) smallest = r;
      if (smallest !== i) {
        [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
        i = smallest;
      } else break;
    }
  }

  return {
    push(v) {
      heap.push(v);
      siftUp(heap.length - 1);
    },
    pop() {
      if (heap.length === 0) return undefined;
      const top = heap[0];
      const last = heap.pop();
      if (heap.length > 0) {
        heap[0] = last;
        siftDown(0);
      }
      return top;
    },
    peek() {
      return heap[0];
    },
    get size() {
      return heap.length;
    },
  };
}`,
    testHelperCode: `function pq_test(scenario) {
  if (scenario === 'min-heap') {
    const pq = createPriorityQueue((a, b) => a - b);
    pq.push(3); pq.push(1); pq.push(2);
    return [pq.pop(), pq.pop(), pq.pop()];
  }
  if (scenario === 'max-heap') {
    const pq = createPriorityQueue((a, b) => b - a);
    pq.push(1); pq.push(5); pq.push(3);
    return [pq.pop(), pq.pop(), pq.pop()];
  }
  if (scenario === 'size-flow') {
    const pq = createPriorityQueue((a, b) => a - b);
    const empty = pq.size;
    pq.push(1); pq.push(2); pq.push(3);
    const full = pq.size;
    pq.pop();
    const afterPop = pq.size;
    return [empty, full, afterPop];
  }
  if (scenario === 'peek') {
    const pq = createPriorityQueue((a, b) => a - b);
    pq.push(3); pq.push(1); pq.push(2);
    return { peek: pq.peek(), size: pq.size };
  }
  if (scenario === 'empty-pop') {
    const pq = createPriorityQueue((a, b) => a - b);
    return pq.pop();
  }
  if (scenario === 'random-many') {
    const pq = createPriorityQueue((a, b) => a - b);
    const arr = [];
    let s = 12345;
    for (let i = 0; i < 100; i++) {
      s = (s * 16807) % 2147483647;
      arr.push(s);
      pq.push(s);
    }
    arr.sort((a, b) => a - b);
    const popped = [];
    while (pq.size > 0) popped.push(pq.pop());
    return JSON.stringify(popped) === JSON.stringify(arr);
  }
}`,
  },
  {
    id: "nodeopt-h4",
    topicId: "node-optimization",
    kind: "implement",
    title: "createTrie — префиксное дерево (autocomplete)",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте \`createTrie()\` — структуру данных «префиксное дерево» для быстрого поиска слов и префиксов.

API:
- \`.insert(word)\` — добавить слово (O(L), где L — длина слова).
- \`.search(word)\` — возвращает \`true\`, если **полное** слово было вставлено.
- \`.startsWith(prefix)\` — возвращает \`true\`, если есть хотя бы одно слово, начинающееся с этого префикса.

Это классическая задача **LeetCode 208** — трай (trie) часто всплывает в задачах на автодополнение, словари и поиск по префиксу.

Пример:
\`\`\`
const t = createTrie();
t.insert('apple');
t.search('apple');     // → true
t.search('app');       // → false  (не было вставлено как слово)
t.startsWith('app');   // → true
t.insert('app');
t.search('app');       // → true
\`\`\``,
    functionName: 'trie_test',
    starterCode: `function createTrie() {
  // ваш код
}`,
    testCases: [
      { id: 'nodeopt-h4-t1', inputDisplay: "стандартный сценарий из LC", inputArgs: ['classic'], expected: [true, false, true, true] },
      { id: 'nodeopt-h4-t2', inputDisplay: "поиск отсутствующего слова", inputArgs: ['miss'], expected: false },
      { id: 'nodeopt-h4-t3', inputDisplay: "startsWith пустой строки → true (есть слова)", inputArgs: ['empty-prefix'], expected: true },
      { id: 'nodeopt-h4-t4', inputDisplay: "пустой trie: search/startsWith → false", inputArgs: ['empty-trie'], expected: [false, false] },
      { id: 'nodeopt-h4-t5', inputDisplay: "перекрывающиеся слова", inputArgs: ['overlap'], expected: [true, true, false, true] },
    ],
    hints: [
      "Trie — это дерево, где каждый узел соответствует одному символу префикса. Главное — отличать «здесь заканчивается реальное слово» от «это просто префикс ещё более длинного слова».",
      "Каждый узел — объект `{ children: Map<char, node>, isEnd: boolean }`. `insert(word)`: пройдитесь посимвольно, создавая `children` при отсутствии, в финальном узле поставьте `isEnd = true`. Общий хелпер `walk(s)` идёт по символам и возвращает узел или `null`. `search(word)`: `walk(word)` + `node.isEnd`. `startsWith(prefix)`: `walk(prefix) !== null`.",
      `Ключевое различие — \`isEnd\` отличает «полное слово» от «префикс ещё более длинного». Без этого флага \`insert('apple')\` сделал бы \`search('app')\` истинным, что для словаря неверно. Также \`startsWith('')\` должен возвращать \`true\` (если в trie вообще есть слова) — \`walk('')\` корректно вернёт корневой узел, и это работает само собой. Альтернатива \`Map<char, node>\` — массив длиной 26 для строчных латинских букв: быстрее по доступу, но жрёт память на разреженных деревьях. Для Unicode (русский, эмодзи, любые языки) \`Map\` — единственно правильный выбор.

С чего начать:
\`\`\`js
function createTrie() {
  const root = { children: new Map(), isEnd: false };
  return {
    insert(word) { /* ... */ },
    search(word) { /* ... */ },
    startsWith(prefix) { /* ... */ },
  };
}
\`\`\``,
    ],
    solutionCode: `function createTrie() {
  const root = { children: new Map(), isEnd: false };

  function walk(s) {
    let node = root;
    for (const ch of s) {
      const next = node.children.get(ch);
      if (!next) return null;
      node = next;
    }
    return node;
  }

  return {
    insert(word) {
      let node = root;
      for (const ch of word) {
        if (!node.children.has(ch)) {
          node.children.set(ch, { children: new Map(), isEnd: false });
        }
        node = node.children.get(ch);
      }
      node.isEnd = true;
    },
    search(word) {
      const node = walk(word);
      return !!node && node.isEnd;
    },
    startsWith(prefix) {
      return walk(prefix) !== null;
    },
  };
}`,
    testHelperCode: `function trie_test(scenario) {
  const t = createTrie();
  if (scenario === 'classic') {
    t.insert('apple');
    const a = t.search('apple');
    const b = t.search('app');
    const c = t.startsWith('app');
    t.insert('app');
    const d = t.search('app');
    return [a, b, c, d];
  }
  if (scenario === 'miss') {
    t.insert('hello');
    return t.search('world');
  }
  if (scenario === 'empty-prefix') {
    t.insert('foo');
    return t.startsWith('');
  }
  if (scenario === 'empty-trie') {
    return [t.search('x'), t.startsWith('x')];
  }
  if (scenario === 'overlap') {
    t.insert('car');
    t.insert('card');
    const a = t.search('car');
    const b = t.search('card');
    const c = t.search('cards');
    const d = t.startsWith('car');
    return [a, b, c, d];
  }
}`,
  },
];
