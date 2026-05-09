import type { Problem } from '../../types/problem';

export const jsClosuresProblems: Problem[] = [
  {
    kind: 'predict-output',
    id: 'jsc-p6',
    topicId: 'js-closures',
    title: 'Угадай вывод: счётчик и независимые замыкания',
    difficulty: 'easy',
    isContextual: false,
    description: `Что выведет этот код по строкам? Введи каждую строку в отдельной строчке поля ответа.`,
    code: `function makeCounter() {
  let n = 0;
  return () => ++n;
}

const a = makeCounter();
const b = makeCounter();

console.log(a()); // ?
console.log(a()); // ?
console.log(b()); // ?
console.log(a()); // ?`,
    expected: '1\n2\n1\n3',
    hints: [
      'Каждый вызов makeCounter() создаёт свой замыкание со своей переменной n.',
      'a и b независимы. Прибавляй к каждому только то, что относится к нему.',
    ],
    solutionCode: `// a имеет свой n=0; вызовы a(): 1, 2, ..., 3.
// b имеет свой n=0; первый вызов b(): 1.
// a и b не пересекаются — это и есть смысл замыкания.`,
  },
  {
    kind: 'find-bug',
    id: 'jsc-p7',
    topicId: 'js-closures',
    title: 'Найди баг: счётчики в цикле',
    difficulty: 'easy',
    isContextual: false,
    sourceBugHuntId: 'bh-01',
    description: `Эта функция должна возвращать массив из 5 функций, где \`fns[i]() === i\`. Но что-то не так. Найди баг и почини, чтобы все 5 тестов прошли.`,
    buggyCode: `function getCounterFns() {
  const fns = [];
  for (var i = 0; i < 5; i++) {
    fns.push(function () {
      return i;
    });
  }
  return fns;
}`,
    functionName: 'jsc_p7_test',
    bugSummary:
      '`var` создаёт одну переменную на весь цикл, и все пять функций замыкаются на неё. К моменту вызова цикл завершён и `i === 5`. Решение — заменить `var` на `let`: каждая итерация получит свой binding.',
    testCases: [
      { id: 'jsc-p7-t1', inputDisplay: 'fns[0]()', inputArgs: [0], expected: 0 },
      { id: 'jsc-p7-t2', inputDisplay: 'fns[1]()', inputArgs: [1], expected: 1 },
      { id: 'jsc-p7-t3', inputDisplay: 'fns[2]()', inputArgs: [2], expected: 2 },
      { id: 'jsc-p7-t4', inputDisplay: 'fns[3]()', inputArgs: [3], expected: 3 },
      { id: 'jsc-p7-t5', inputDisplay: 'fns[4]()', inputArgs: [4], expected: 4 },
    ],
    hints: [
      'Подумай, какую область видимости создаёт `var` и какую — `let` в цикле for.',
      'Замени один символ — этого достаточно.',
    ],
    solutionCode: `function getCounterFns() {
  const fns = [];
  for (let i = 0; i < 5; i++) {
    fns.push(function () {
      return i;
    });
  }
  return fns;
}`,
    testHelperCode: `function jsc_p7_test(i) { return getCounterFns()[i](); }`,
  },
  {
    kind: 'refactor',
    id: 'jsc-p8',
    topicId: 'js-closures',
    title: 'Оптимизируй: мемоизация Фибоначчи',
    difficulty: 'medium',
    isContextual: false,
    description: `Дан наивный рекурсивный fib(n) — он работает, но при n=35 уже мучительно медленный (~10⁹ операций).

Перепиши через замыкание + кеш так, чтобы прохождение perf-теста (\`fib(35)\`) укладывалось в 100 мс. Сигнатура функции — \`fib(n)\` — должна остаться.

Tip: можно использовать вспомогательное замыкание или \`Map\`-кеш на уровне модуля.`,
    functionName: 'fib',
    starterCode: `function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}`,
    testCases: [
      { id: 'jsc-p8-t1', inputDisplay: 'fib(0)', inputArgs: [0], expected: 0 },
      { id: 'jsc-p8-t2', inputDisplay: 'fib(1)', inputArgs: [1], expected: 1 },
      { id: 'jsc-p8-t3', inputDisplay: 'fib(10)', inputArgs: [10], expected: 55 },
      { id: 'jsc-p8-t4', inputDisplay: 'fib(20)', inputArgs: [20], expected: 6765 },
    ],
    perfTest: { inputArgs: [35], maxMs: 100 },
    hints: [
      'Создай Map-кеш в замыкании. На каждый n проверяй кеш перед рекурсией.',
      'Рекурсия должна вызывать ту же мемоизированную функцию, иначе кеш не сработает.',
      'Альтернатива — итеративный вариант с двумя переменными a, b. Тоже укладывается легко.',
    ],
    solutionCode: `const fib = (() => {
  const cache = new Map([[0, 0], [1, 1]]);
  function f(n) {
    if (cache.has(n)) return cache.get(n);
    const v = f(n - 1) + f(n - 2);
    cache.set(n, v);
    return v;
  }
  return f;
})();`,
  },
  {
    id: 'jsc-p1',
    topicId: 'js-closures',
    title: 'Счётчик с замыканием',
    difficulty: 'easy',
    isContextual: false,
    description: `Напишите функцию \`createCounter()\`, которая возвращает объект с тремя методами:
- \`increment()\` — увеличивает счётчик на 1
- \`decrement()\` — уменьшает счётчик на 1
- \`getCount()\` — возвращает текущее значение счётчика

Начальное значение — 0. Состояние счётчика должно быть **приватным** (недоступным снаружи напрямую).

Примеры:
\`\`\`
const c = createCounter();
c.increment(); // count = 1
c.increment(); // count = 2
c.decrement(); // count = 1
c.getCount();  // → 1
\`\`\``,
    functionName: 'createCounter_test',
    starterCode: `function createCounter() {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsc-p1-t1',
        inputDisplay: 'c.increment() × 2, getCount()',
        inputArgs: ['increment-2'],
        expected: 2,
      },
      {
        id: 'jsc-p1-t2',
        inputDisplay: 'c.increment() × 3, decrement() × 1, getCount()',
        inputArgs: ['increment-3-decrement-1'],
        expected: 2,
      },
      {
        id: 'jsc-p1-t3',
        inputDisplay: 'c.getCount() без вызовов',
        inputArgs: ['zero'],
        expected: 0,
      },
      {
        id: 'jsc-p1-t4',
        inputDisplay: 'c.decrement() × 1, getCount()',
        inputArgs: ['decrement-1'],
        expected: -1,
      },
      {
        id: 'jsc-p1-t5',
        inputDisplay: 'два независимых счётчика не влияют друг на друга',
        inputArgs: ['independent'],
        expected: true,
      },
    ],
    hints: [
      'Объявите переменную `count` внутри функции. Методы объекта, имея доступ к этой переменной, образуют замыкание.',
      'Возвращайте объект с методами `increment`, `decrement` и `getCount`. Все они будут "видеть" одну и ту же переменную `count`.',
      'Для теста независимости создайте два счётчика и убедитесь, что их состояния не пересекаются.',
    ],
    solutionCode: `function createCounter() {
  let count = 0;

  return {
    increment() { count++; },
    decrement() { count--; },
    getCount()  { return count; },
  };
}`,
    testHelperCode: `function createCounter_test(arg) {
  const c = createCounter();
  if (arg === 'increment-2') {
    c.increment(); c.increment();
    return c.getCount();
  }
  if (arg === 'increment-3-decrement-1') {
    c.increment(); c.increment(); c.increment(); c.decrement();
    return c.getCount();
  }
  if (arg === 'zero') return c.getCount();
  if (arg === 'decrement-1') { c.decrement(); return c.getCount(); }
  if (arg === 'independent') {
    const c2 = createCounter();
    c.increment(); c.increment();
    return c.getCount() === 2 && c2.getCount() === 0;
  }
}`,
  },
  {
    id: 'jsc-p2',
    topicId: 'js-closures',
    title: 'Мемоизация функции',
    difficulty: 'easy',
    isContextual: false,
    description: `Напишите функцию \`memoize(fn)\`, которая принимает функцию \`fn\` и возвращает её мемоизированную версию.

Мемоизированная версия при вызове с одними и теми же аргументами возвращает закешированный результат, **не вызывая** оригинальную функцию повторно.

Кеш должен работать для любых примитивных аргументов.

Примеры:
\`\`\`
let callCount = 0;
const expensive = (n) => { callCount++; return n * n; };
const fast = memoize(expensive);

fast(4);  // → 16, callCount = 1
fast(4);  // → 16, callCount = 1 (из кеша)
fast(5);  // → 25, callCount = 2
fast(5);  // → 25, callCount = 2 (из кеша)
\`\`\``,
    functionName: 'memoize_test',
    starterCode: `function memoize(fn) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsc-p2-t1',
        inputDisplay: 'memoize(fn)(4) дважды — fn вызвана 1 раз',
        inputArgs: ['call-twice-same'],
        expected: 1,
      },
      {
        id: 'jsc-p2-t2',
        inputDisplay: 'memoize(fn)(4), (5) — fn вызвана 2 раза',
        inputArgs: ['call-diff'],
        expected: 2,
      },
      {
        id: 'jsc-p2-t3',
        inputDisplay: 'memoize(fn)(4) возвращает корректный результат',
        inputArgs: ['result-4'],
        expected: 16,
      },
      {
        id: 'jsc-p2-t4',
        inputDisplay: 'разные экземпляры memoize независимы',
        inputArgs: ['independent'],
        expected: true,
      },
      {
        id: 'jsc-p2-t5',
        inputDisplay: 'аргументы (1,2) и (2,1) — разные ключи кеша',
        inputArgs: ['order-matters'],
        expected: true,
      },
    ],
    hints: [
      'Создайте Map или объект внутри `memoize` для хранения кеша — это будет замыкание.',
      'Ключ кеша — сериализованные аргументы: `JSON.stringify(args)`. Это работает для примитивов и массивов.',
      'Возвращаемая функция должна: 1) проверить кеш, 2) если есть — вернуть, 3) если нет — вызвать fn, сохранить и вернуть результат.',
    ],
    solutionCode: `function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`,
    testHelperCode: `function memoize_test(arg) {
  let callCount = 0;
  const expensive = (n) => { callCount++; return n * n; };
  const fast = memoize(expensive);
  if (arg === 'call-twice-same') { fast(4); fast(4); return callCount; }
  if (arg === 'call-diff') { fast(4); fast(5); return callCount; }
  if (arg === 'result-4') return fast(4);
  if (arg === 'independent') {
    let c1 = 0, c2 = 0;
    const fn1 = memoize((n) => { c1++; return n; });
    const fn2 = memoize((n) => { c2++; return n; });
    fn1(1); fn1(1); fn2(1); fn2(1);
    return c1 === 1 && c2 === 1;
  }
  if (arg === 'order-matters') {
    const fn = memoize((a, b) => a - b);
    return fn(1, 2) !== fn(2, 1);
  }
}`,
  },
  {
    id: 'jsc-p3',
    topicId: 'js-closures',
    title: 'once — однократный вызов',
    difficulty: 'easy',
    isContextual: false,
    description: `Напишите функцию \`once(fn)\`, которая возвращает обёртку над \`fn\`.
Обёртка гарантирует, что \`fn\` будет вызвана **не более одного раза**.

При повторных вызовах обёртка возвращает результат **первого** вызова, не вызывая \`fn\` снова.

Примеры:
\`\`\`
let count = 0;
const fn = once(() => ++count);

fn(); // → 1
fn(); // → 1 (fn не вызвана снова)
fn(); // → 1
count; // → 1 — fn вызвана ровно один раз
\`\`\``,
    functionName: 'once_test',
    starterCode: `function once(fn) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsc-p3-t1',
        inputDisplay: 'fn вызвана 3 раза, оригинал выполнен 1 раз',
        inputArgs: ['call-count'],
        expected: 1,
      },
      {
        id: 'jsc-p3-t2',
        inputDisplay: 'возвращает результат первого вызова при повторных',
        inputArgs: ['return-value'],
        expected: 42,
      },
      {
        id: 'jsc-p3-t3',
        inputDisplay: 'работает с аргументами первого вызова',
        inputArgs: ['with-args'],
        expected: 10,
      },
      {
        id: 'jsc-p3-t4',
        inputDisplay: 'разные экземпляры once независимы',
        inputArgs: ['independent'],
        expected: true,
      },
      {
        id: 'jsc-p3-t5',
        inputDisplay: 'второй вызов с другими аргументами игнорирует их',
        inputArgs: ['ignore-args'],
        expected: 5,
      },
    ],
    hints: [
      'Нужно два флага: `called` (bool) и `result` — хранятся в замыкании.',
      'При первом вызове: установить `called = true`, выполнить `fn`, сохранить и вернуть результат.',
      'При повторных вызовах: `called === true` — просто вернуть `result`, не вызывая fn.',
    ],
    solutionCode: `function once(fn) {
  let called = false;
  let result;

  return function(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}`,
    testHelperCode: `function once_test(arg) {
  if (arg === 'call-count') {
    let count = 0;
    const fn = once(() => ++count);
    fn(); fn(); fn();
    return count;
  }
  if (arg === 'return-value') {
    const fn = once(() => 42);
    fn(); return fn();
  }
  if (arg === 'with-args') {
    const fn = once((x) => x * 2);
    return fn(5);
  }
  if (arg === 'independent') {
    let c1 = 0, c2 = 0;
    const fn1 = once(() => ++c1);
    const fn2 = once(() => ++c2);
    fn1(); fn1(); fn2(); fn2();
    return c1 === 1 && c2 === 1;
  }
  if (arg === 'ignore-args') {
    const fn = once((x) => x);
    fn(5); return fn(999);
  }
}`,
  },
  {
    id: 'jsc-p4',
    topicId: 'js-closures',
    title: 'makeAdder — частичное применение',
    difficulty: 'easy',
    isContextual: false,
    description: `Напишите функцию \`makeAdder(x)\`, которая возвращает функцию, прибавляющую \`x\` к своему аргументу.

Это базовый паттерн **частичного применения** (partial application) — одна из форм каррирования.

Примеры:
\`\`\`
const add5  = makeAdder(5);
const add10 = makeAdder(10);

add5(3);   // → 8
add5(7);   // → 12
add10(3);  // → 13
add10(-5); // → 5
\`\`\``,
    functionName: 'makeAdder_test',
    starterCode: `function makeAdder(x) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsc-p4-t1',
        inputDisplay: 'makeAdder(5)(3)',
        inputArgs: [5, 3],
        expected: 8,
      },
      {
        id: 'jsc-p4-t2',
        inputDisplay: 'makeAdder(10)(-5)',
        inputArgs: [10, -5],
        expected: 5,
      },
      {
        id: 'jsc-p4-t3',
        inputDisplay: 'makeAdder(0)(100)',
        inputArgs: [0, 100],
        expected: 100,
      },
      {
        id: 'jsc-p4-t4',
        inputDisplay: 'makeAdder(-3)(3)',
        inputArgs: [-3, 3],
        expected: 0,
      },
      {
        id: 'jsc-p4-t5',
        inputDisplay: 'makeAdder(7)(7)',
        inputArgs: [7, 7],
        expected: 14,
      },
    ],
    hints: [
      '`makeAdder` возвращает функцию. Внутренняя функция "видит" `x` из замыкания.',
      'Это простейшая форма каррирования: разделить функцию двух аргументов на две функции одного аргумента каждая.',
    ],
    solutionCode: `function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}`,
    testHelperCode: `function makeAdder_test(x, y) { return makeAdder(x)(y); }`,
  },
  {
    id: 'jsc-p5',
    topicId: 'js-closures',
    title: 'Исправить замыкание в цикле',
    difficulty: 'medium',
    isContextual: false,
    description: `Дана функция \`getMultipliers()\`, которая возвращает массив из 5 функций. Каждая функция должна умножать свой аргумент на свой индекс (0, 1, 2, 3, 4).

Но в текущей реализации с \`var\` все функции используют одно значение \`i\`.

**Задача**: реализуйте \`getMultipliers()\` так, чтобы функция с индексом \`i\` умножала аргумент на \`i\`.

Примеры:
\`\`\`
const fns = getMultipliers();
fns[0](10); // → 0   (10 * 0)
fns[1](10); // → 10  (10 * 1)
fns[2](10); // → 20  (10 * 2)
fns[3](10); // → 30  (10 * 3)
fns[4](10); // → 40  (10 * 4)
\`\`\``,
    functionName: 'getMultipliers_test',
    starterCode: `function getMultipliers() {
  // Сломанная версия с var:
  // const fns = [];
  // for (var i = 0; i < 5; i++) {
  //   fns.push((x) => x * i); // все замыкаются на одно i
  // }
  // return fns;

  // Ваша исправленная версия:
}`,
    testCases: [
      {
        id: 'jsc-p5-t1',
        inputDisplay: 'getMultipliers()[0](10)',
        inputArgs: [0, 10],
        expected: 0,
      },
      {
        id: 'jsc-p5-t2',
        inputDisplay: 'getMultipliers()[1](10)',
        inputArgs: [1, 10],
        expected: 10,
      },
      {
        id: 'jsc-p5-t3',
        inputDisplay: 'getMultipliers()[2](10)',
        inputArgs: [2, 10],
        expected: 20,
      },
      {
        id: 'jsc-p5-t4',
        inputDisplay: 'getMultipliers()[3](10)',
        inputArgs: [3, 10],
        expected: 30,
      },
      {
        id: 'jsc-p5-t5',
        inputDisplay: 'getMultipliers()[4](10)',
        inputArgs: [4, 10],
        expected: 40,
      },
    ],
    hints: [
      'Самый простой способ: заменить `var` на `let`. С `let` каждая итерация цикла получает свою копию переменной `i`.',
      'Альтернатива: использовать IIFE внутри цикла — `(function(j) { fns.push((x) => x * j); })(i)` — создаёт отдельную область для каждого `j`.',
      'Третий вариант: `fns.push((x) => x * i)` + `bind` или `.map` вместо цикла с `var`.',
    ],
    solutionCode: `function getMultipliers() {
  const fns = [];
  for (let i = 0; i < 5; i++) {
    fns.push((x) => x * i);
  }
  return fns;
}`,
    testHelperCode: `function getMultipliers_test(i, x) { return getMultipliers()[i](x); }`,
  },
];
