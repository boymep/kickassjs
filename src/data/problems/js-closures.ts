import type { Problem } from "../../types/problem";

export const jsClosuresProblems: Problem[] = [
  {
    kind: "predict-output",
    id: "jsc-p6",
    topicId: "js-closures",
    title: "Определи вывод: счётчик и независимые замыкания",
    difficulty: "easy",
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
    expected: "1\n2\n1\n3",
    hints: [
      "Каждый вызов makeCounter() порождает отдельное замыкание. Что это означает для переменной n?",
      "Следи за состоянием a и b независимо — они никогда не пересекаются.",
    ],
    solutionCode: `// a имеет свой n=0; вызовы a(): 1, 2, ..., 3.
// b имеет свой n=0; первый вызов b(): 1.
// a и b не пересекаются — это и есть смысл замыкания.`,
  },
  {
    kind: "find-bug",
    id: "jsc-p7",
    topicId: "js-closures",
    title: "Найди баг: счётчики в цикле",
    difficulty: "easy",
    isContextual: false,
    sourceBugHuntId: "bh-01",
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
    functionName: "jsc_p7_test",
    bugSummary:
      "`var` создаёт одну переменную на весь цикл, и все пять функций замыкаются на неё. К моменту вызова цикл завершён и `i === 5`. Решение — заменить `var` на `let`: каждая итерация получит свой binding.",
    testCases: [
      {
        id: "jsc-p7-t1",
        inputDisplay: "fns[0]()",
        inputArgs: [0],
        expected: 0,
      },
      {
        id: "jsc-p7-t2",
        inputDisplay: "fns[1]()",
        inputArgs: [1],
        expected: 1,
      },
      {
        id: "jsc-p7-t3",
        inputDisplay: "fns[2]()",
        inputArgs: [2],
        expected: 2,
      },
      {
        id: "jsc-p7-t4",
        inputDisplay: "fns[3]()",
        inputArgs: [3],
        expected: 3,
      },
      {
        id: "jsc-p7-t5",
        inputDisplay: "fns[4]()",
        inputArgs: [4],
        expected: 4,
      },
    ],
    hints: [
      "Подумай, какую область видимости создаёт `var` в цикле `for` и чем она отличается от блочной.",
      "В ES6 появилось ключевое слово, которое даёт переменной блочную область видимости.",
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
    kind: "refactor",
    id: "jsc-p8",
    topicId: "js-closures",
    title: "Оптимизируй: мемоизация Фибоначчи",
    difficulty: "medium",
    isContextual: false,
    description: `Дан наивный рекурсивный fib(n) — он работает, но при n=40 мучительно медленный (~165 млн рекурсивных вызовов).

Перепиши через замыкание + кеш так, чтобы \`fib(40)\` выполнялся быстрее 200 мс. Сигнатура функции — \`fib(n)\` — должна остаться.

Tip: можно использовать вспомогательное замыкание или \`Map\`-кеш на уровне модуля.`,
    functionName: "fib",
    starterCode: `function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}`,
    testCases: [
      { id: "jsc-p8-t1", inputDisplay: "fib(0)", inputArgs: [0], expected: 0 },
      { id: "jsc-p8-t2", inputDisplay: "fib(1)", inputArgs: [1], expected: 1 },
      {
        id: "jsc-p8-t3",
        inputDisplay: "fib(10)",
        inputArgs: [10],
        expected: 55,
      },
      {
        id: "jsc-p8-t4",
        inputDisplay: "fib(20)",
        inputArgs: [20],
        expected: 6765,
      },
    ],
    perfTest: { inputArgs: [40], maxMs: 200 },
    hints: [
      "Попробуй вручную посчитать, сколько раз вычисляется fib(5) при наивном fib(7). Чем больше n, тем хуже.",
      "Если кешировать уже вычисленные значения, повторный вызов превращается в простой lookup.",
      "Убедись, что внутри рекурсии вызывается именно «умная» версия функции, а не исходная.",
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
    id: "jsc-p1",
    topicId: "js-closures",
    title: "Счётчик с замыканием",
    difficulty: "easy",
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
    functionName: "createCounter_test",
    starterCode: `function createCounter() {
  // ваш код
}`,
    testCases: [
      {
        id: "jsc-p1-t1",
        inputDisplay: "c.increment() × 2, getCount()",
        inputArgs: ["increment-2"],
        expected: 2,
      },
      {
        id: "jsc-p1-t2",
        inputDisplay: "c.increment() × 3, decrement() × 1, getCount()",
        inputArgs: ["increment-3-decrement-1"],
        expected: 2,
      },
      {
        id: "jsc-p1-t3",
        inputDisplay: "c.getCount() без вызовов",
        inputArgs: ["zero"],
        expected: 0,
      },
      {
        id: "jsc-p1-t4",
        inputDisplay: "c.decrement() × 1, getCount()",
        inputArgs: ["decrement-1"],
        expected: -1,
      },
      {
        id: "jsc-p1-t5",
        inputDisplay: "два независимых счётчика не влияют друг на друга",
        inputArgs: ["independent"],
        expected: true,
      },
    ],
    hints: [
      "Как сделать переменную, которую видят все три метода, но которая недоступна снаружи функции?",
      "Функция может возвращать объект. Методы этого объекта имеют доступ к переменным, объявленным в той же функции.",
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
    id: "jsc-p2",
    topicId: "js-closures",
    title: "Мемоизация функции",
    difficulty: "easy",
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
    functionName: "memoize_test",
    starterCode: `function memoize(fn) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsc-p2-t1",
        inputDisplay: "memoize(fn)(4) дважды — fn вызвана 1 раз",
        inputArgs: ["call-twice-same"],
        expected: 1,
      },
      {
        id: "jsc-p2-t2",
        inputDisplay: "memoize(fn)(4), (5) — fn вызвана 2 раза",
        inputArgs: ["call-diff"],
        expected: 2,
      },
      {
        id: "jsc-p2-t3",
        inputDisplay: "memoize(fn)(4) возвращает корректный результат",
        inputArgs: ["result-4"],
        expected: 16,
      },
      {
        id: "jsc-p2-t4",
        inputDisplay: "разные экземпляры memoize независимы",
        inputArgs: ["independent"],
        expected: true,
      },
      {
        id: "jsc-p2-t5",
        inputDisplay: "аргументы (1,2) и (2,1) — разные ключи кеша",
        inputArgs: ["order-matters"],
        expected: true,
      },
    ],
    hints: [
      "Нужно хранить результаты предыдущих вызовов. Какая структура данных подходит для хранения пар «вход → результат»?",
      "Как превратить произвольный набор аргументов в один уникальный ключ?",
      "Порядок действий при каждом вызове: сначала проверить кеш, и только при промахе — обратиться к оригинальной функции.",
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
    id: "jsc-p3",
    topicId: "js-closures",
    title: "once — однократный вызов",
    difficulty: "easy",
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
    functionName: "once_test",
    starterCode: `function once(fn) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsc-p3-t1",
        inputDisplay: "fn вызвана 3 раза, оригинал выполнен 1 раз",
        inputArgs: ["call-count"],
        expected: 1,
      },
      {
        id: "jsc-p3-t2",
        inputDisplay: "возвращает результат первого вызова при повторных",
        inputArgs: ["return-value"],
        expected: 42,
      },
      {
        id: "jsc-p3-t3",
        inputDisplay: "работает с аргументами первого вызова",
        inputArgs: ["with-args"],
        expected: 10,
      },
      {
        id: "jsc-p3-t4",
        inputDisplay: "разные экземпляры once независимы",
        inputArgs: ["independent"],
        expected: true,
      },
      {
        id: "jsc-p3-t5",
        inputDisplay: "второй вызов с другими аргументами игнорирует их",
        inputArgs: ["ignore-args"],
        expected: 5,
      },
    ],
    hints: [
      "Функция-обёртка должна «помнить» между вызовами, выполнялась ли уже оригинальная функция.",
      "Что нужно сохранить после первого вызова, чтобы при повторных вернуть то же значение без повторного выполнения?",
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
    id: "jsc-p4",
    topicId: "js-closures",
    title: "makeAdder — частичное применение",
    difficulty: "easy",
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
    functionName: "makeAdder_test",
    starterCode: `function makeAdder(x) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsc-p4-t1",
        inputDisplay: "makeAdder(5)(3)",
        inputArgs: [5, 3],
        expected: 8,
      },
      {
        id: "jsc-p4-t2",
        inputDisplay: "makeAdder(10)(-5)",
        inputArgs: [10, -5],
        expected: 5,
      },
      {
        id: "jsc-p4-t3",
        inputDisplay: "makeAdder(0)(100)",
        inputArgs: [0, 100],
        expected: 100,
      },
      {
        id: "jsc-p4-t4",
        inputDisplay: "makeAdder(-3)(3)",
        inputArgs: [-3, 3],
        expected: 0,
      },
      {
        id: "jsc-p4-t5",
        inputDisplay: "makeAdder(7)(7)",
        inputArgs: [7, 7],
        expected: 14,
      },
    ],
    hints: [
      '`makeAdder` возвращает функцию. Внутренняя функция "видит" `x` из замыкания.',
      "Это простейшая форма каррирования: разделить функцию двух аргументов на две функции одного аргумента каждая.",
    ],
    solutionCode: `function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}`,
    testHelperCode: `function makeAdder_test(x, y) { return makeAdder(x)(y); }`,
  },
  {
    kind: "find-bug",
    id: "jsc-p5",
    topicId: "js-closures",
    title: "Найди баг: стек с общим состоянием",
    difficulty: "easy",
    isContextual: false,
    description: `Функция \`makeStack()\` должна создавать **независимые** стеки. Но сейчас все экземпляры делят одно и то же состояние — операции в одном стеке влияют на другой.

Найди причину и почини так, чтобы каждый вызов \`makeStack()\` возвращал стек с собственными данными.`,
    buggyCode: `const items = [];

function makeStack() {
  return {
    push(x)  { items.push(x); },
    pop()    { return items.pop(); },
    peek()   { return items[items.length - 1]; },
    size()   { return items.length; },
  };
}`,
    functionName: "jsc_p5_test",
    bugSummary:
      "`items` объявлен вне `makeStack` — все экземпляры разделяют один и тот же массив. Решение: перенести `const items = []` внутрь `makeStack`, чтобы каждый вызов создавал замыкание со своим массивом.",
    testCases: [
      {
        id: "jsc-p5-t1",
        inputDisplay: "push(1), push(2) → size() = 2",
        inputArgs: ["size"],
        expected: 2,
      },
      {
        id: "jsc-p5-t2",
        inputDisplay: 'push("a") → pop() = "a"',
        inputArgs: ["pop"],
        expected: "a",
      },
      {
        id: "jsc-p5-t3",
        inputDisplay: "push(42) → peek() = 42, size не изменился",
        inputArgs: ["peek"],
        expected: true,
      },
      {
        id: "jsc-p5-t4",
        inputDisplay: "два независимых стека не влияют друг на друга",
        inputArgs: ["independent"],
        expected: true,
      },
      {
        id: "jsc-p5-t5",
        inputDisplay: "пустой стек → size() = 0",
        inputArgs: ["empty"],
        expected: 0,
      },
    ],
    hints: [
      "Найди, где объявлен `items`. Какую область видимости он имеет относительно функции `makeStack`?",
      "Должно ли хранилище стека существовать до первого вызова `makeStack`, или создаваться при каждом вызове?",
    ],
    solutionCode: `function makeStack() {
  const items = [];
  return {
    push(x)  { items.push(x); },
    pop()    { return items.pop(); },
    peek()   { return items[items.length - 1]; },
    size()   { return items.length; },
  };
}`,
    testHelperCode: `function jsc_p5_test(scenario) {
  if (scenario === 'size') {
    const s = makeStack(); s.push(1); s.push(2); return s.size();
  }
  if (scenario === 'pop') {
    const s = makeStack(); s.push('a'); return s.pop();
  }
  if (scenario === 'peek') {
    const s = makeStack(); s.push(42);
    return s.peek() === 42 && s.size() === 1;
  }
  if (scenario === 'independent') {
    const s1 = makeStack(); const s2 = makeStack();
    s1.push(1); s1.push(2); s2.push(99);
    return s1.size() === 2 && s2.size() === 1;
  }
  if (scenario === 'empty') return makeStack().size();
}`,
  },
  {
    id: "jsc-h1",
    topicId: "js-closures",
    kind: "implement",
    title: "curry — вариадическое каррирование",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте функцию \`curry(fn)\`, которая возвращает каррированную версию \`fn\`.

Каррированная функция может принимать аргументы **частями**. Как только накоплено достаточно аргументов (>= fn.length), она вызывает оригинальную \`fn\`.

Примеры:
\`\`\`
const add = curry((a, b, c) => a + b + c);

add(1)(2)(3)    // → 6
add(1, 2)(3)    // → 6
add(1)(2, 3)    // → 6
add(1, 2, 3)    // → 6

const addTo10 = add(10);
addTo10(5)(2)   // → 17
\`\`\``,
    functionName: "curry_test",
    starterCode: `function curry(fn) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsc-h1-t1",
        inputDisplay: "add(1)(2)(3)",
        inputArgs: ["one-by-one"],
        expected: 6,
      },
      {
        id: "jsc-h1-t2",
        inputDisplay: "add(1,2)(3)",
        inputArgs: ["partial-2-1"],
        expected: 6,
      },
      {
        id: "jsc-h1-t3",
        inputDisplay: "add(1)(2,3)",
        inputArgs: ["partial-1-2"],
        expected: 6,
      },
      {
        id: "jsc-h1-t4",
        inputDisplay: "add(1,2,3)",
        inputArgs: ["all-at-once"],
        expected: 6,
      },
      {
        id: "jsc-h1-t5",
        inputDisplay: "частично применённая функция переиспользуется",
        inputArgs: ["reuse"],
        expected: [17, 12],
      },
    ],
    hints: [
      "Как накапливать аргументы между вызовами, не зная заранее, когда их станет достаточно?",
      "Что является критерием «достаточности» аргументов — когда пора вызывать оригинальную функцию?",
      "Если аргументов пока не хватает — что нужно вернуть, чтобы можно было передать ещё?",
    ],
    solutionCode: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}`,
    testHelperCode: `function curry_test(scenario) {
  const add = curry((a, b, c) => a + b + c);
  if (scenario === 'one-by-one')   return add(1)(2)(3);
  if (scenario === 'partial-2-1')  return add(1, 2)(3);
  if (scenario === 'partial-1-2')  return add(1)(2, 3);
  if (scenario === 'all-at-once')  return add(1, 2, 3);
  if (scenario === 'reuse') {
    const addTo10 = add(10);
    return [addTo10(5)(2), addTo10(1)(1)];
  }
}`,
  },
  {
    id: "jsc-h2",
    topicId: "js-closures",
    kind: "implement",
    title: "pipe и compose — конвейер функций",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте две функции:

1. \`pipe(...fns)\` — возвращает функцию, которая применяет \`fns\` **слева направо**:
   \`pipe(f, g, h)(x) === h(g(f(x)))\`

2. \`compose(...fns)\` — то же, но **справа налево**:
   \`compose(f, g, h)(x) === f(g(h(x)))\`

Каждая функция принимает один аргумент. Если массив функций пуст — верните \`identity\` (функцию, возвращающую аргумент как есть).

Примеры:
\`\`\`
const double = x => x * 2;
const inc    = x => x + 1;
const square = x => x * x;

pipe(double, inc, square)(3)    // → 49  ((3*2+1)² = 7² = 49)
compose(square, inc, double)(3) // → 49  (square(inc(double(3))))
pipe()(5)                       // → 5
\`\`\``,
    functionName: "pipecompose_test",
    starterCode: `function pipe(...fns) {
  // ваш код
}

function compose(...fns) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsc-h2-t1",
        inputDisplay: "pipe(double,inc,square)(3)",
        inputArgs: ["pipe-3"],
        expected: 49,
      },
      {
        id: "jsc-h2-t2",
        inputDisplay: "compose(square,inc,double)(3)",
        inputArgs: ["compose-3"],
        expected: 49,
      },
      {
        id: "jsc-h2-t3",
        inputDisplay: "pipe()(5) → identity",
        inputArgs: ["pipe-empty"],
        expected: 5,
      },
      {
        id: "jsc-h2-t4",
        inputDisplay: "compose()(5) → identity",
        inputArgs: ["compose-empty"],
        expected: 5,
      },
      {
        id: "jsc-h2-t5",
        inputDisplay: "pipe с одной функцией",
        inputArgs: ["pipe-single"],
        expected: 6,
      },
    ],
    hints: [
      "Как последовательно применить набор функций, где каждая принимает результат предыдущей?",
      "Чем compose отличается от pipe — только ли в порядке применения функций?",
      "Как обработать вызов без функций, чтобы поведение оставалось предсказуемым?",
    ],
    solutionCode: `function pipe(...fns) {
  if (fns.length === 0) return x => x;
  return (x) => fns.reduce((acc, fn) => fn(acc), x);
}

function compose(...fns) {
  if (fns.length === 0) return x => x;
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}`,
    testHelperCode: `function pipecompose_test(scenario) {
  const double = x => x * 2;
  const inc    = x => x + 1;
  const square = x => x * x;
  if (scenario === 'pipe-3')       return pipe(double, inc, square)(3);
  if (scenario === 'compose-3')    return compose(square, inc, double)(3);
  if (scenario === 'pipe-empty')   return pipe()(5);
  if (scenario === 'compose-empty') return compose()(5);
  if (scenario === 'pipe-single')  return pipe(double)(3);
}`,
  },
];
