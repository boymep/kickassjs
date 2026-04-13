import type { TopicQuiz } from '../../types/quiz';

export const jsClosuresQuiz: TopicQuiz = {
  topicId: 'js-closures',
  questions: [
    {
      type: 'output',
      id: 'jsc-q1',
      description: 'Классика: var в цикле. Что выведет код?',
      code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
      options: ['0 1 2', '3 3 3', '0 0 0', 'undefined undefined undefined'],
      correctIndex: 1,
      explanation:
        'С `var` все три callback-функции замыкаются на **одну** переменную `i`. К моменту выполнения setTimeout цикл уже завершился и `i === 3`. Поэтому все три выведут 3. Для получения 0 1 2 нужно использовать `let` (свой `i` на каждую итерацию) или IIFE.',
    },
    {
      type: 'output',
      id: 'jsc-q2',
      description: 'А теперь с let. Что выведет код?',
      code: `for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
      options: ['3 3 3', '0 0 0', '0 1 2', '1 2 3'],
      correctIndex: 2,
      explanation:
        'С `let` каждая итерация цикла создаёт **новую привязку** переменной `i`. Каждый callback замыкается на свою копию `i` (0, 1, 2). Поэтому вывод: 0 1 2.',
    },
    {
      type: 'output',
      id: 'jsc-q3',
      description: 'Замыкание и изменение переменной. Что вернёт func()?',
      code: `function makeFunc() {
  let value = 1;
  function func() { return value; }
  value = 2;
  return func;
}

const f = makeFunc();
console.log(f());`,
      options: ['1', '2', 'undefined', 'ReferenceError'],
      correctIndex: 1,
      explanation:
        'Замыкание хранит **ссылку** на переменную `value`, а не её значение в момент создания. К моменту вызова `f()` переменная `value` уже равна 2. Поэтому результат — 2.',
    },
    {
      type: 'fill-blank',
      id: 'jsc-q4',
      description: 'Заполните пропуск, чтобы функция memoize корректно кешировала результаты.',
      codeWithBlanks: `function memoize(fn) {
  const cache = ___BLANK___;
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`,
      options: ['new Map()', '{}', 'new Set()', '[]'],
      correctIndex: 0,
      explanation:
        'Map — оптимальный выбор для кеша: позволяет использовать любые значения как ключи, имеет методы `has`, `get`, `set`. Обычный объект `{}` тоже работает, но менее безопасен (ключи типа `__proto__` могут конфликтовать).',
    },
    {
      type: 'output',
      id: 'jsc-q5',
      description: 'Счётчик с замыканием. Что выведет код?',
      code: `function makeCounter() {
  let n = 0;
  return () => ++n;
}

const a = makeCounter();
const b = makeCounter();

a(); a(); a();
b();
console.log(a()); // ?
console.log(b()); // ?`,
      options: ['4 и 2', '3 и 1', '3 и 2', '1 и 1'],
      correctIndex: 0,
      explanation:
        'Каждый вызов `makeCounter()` создаёт **новое замыкание** с собственной переменной `n`. `a` и `b` — независимые счётчики. `a()` вызвана 4 раза → 4, `b()` вызвана 2 раза → 2.',
    },
    {
      type: 'output',
      id: 'jsc-q6',
      description: 'IIFE и область видимости. Что выведет код?',
      code: `const result = (function() {
  const x = 10;
  return x * 2;
})();

console.log(result);
console.log(typeof x);`,
      options: ['20 и "number"', '20 и "undefined"', 'undefined и "undefined"', 'ReferenceError'],
      correctIndex: 1,
      explanation:
        'IIFE немедленно вызывается и возвращает `20`. Переменная `x` объявлена внутри IIFE — она недоступна снаружи. `typeof x` в глобальной области не выбросит ошибку (в отличие от прямого обращения к `x`), а вернёт `"undefined"`.',
    },
    {
      type: 'tracing',
      id: 'jsc-q7',
      description: 'Проследите выполнение функции once.',
      code: `function once(fn) {
  let called = false;
  let result;
  return function(...args) {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

const f = once((x) => x * 10);
f(5);
f(8);
f(3);`,
      steps: [
        { label: 'f(5) — первый вызов', variables: { called: 'false → true', result: 'undefined → 50', 'fn вызвана': 'да' } },
        { label: 'f(8) — второй вызов', variables: { called: 'true', result: '50', 'fn вызвана': 'нет' } },
        { label: 'f(3) — третий вызов', variables: { called: 'true', result: '50', 'fn вызвана': 'нет' } },
      ],
      question: 'Сколько раз будет вызвана оригинальная fn?',
      options: ['3 раза', '1 раз', '2 раза', '0 раз'],
      correctIndex: 1,
      explanation:
        'Функция `once` использует флаг `called` для предотвращения повторных вызовов. При первом вызове `f(5)` флаг устанавливается в `true` и `fn` выполняется. При последующих вызовах флаг уже `true` — `fn` не вызывается, возвращается сохранённый `result = 50`.',
    },
    {
      type: 'output',
      id: 'jsc-q8',
      description: 'Частичное применение. Что вернёт вызов?',
      code: `function multiply(a, b) {
  return a * b;
}

function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

const double = partial(multiply, 2);
const triple = partial(multiply, 3);

console.log(double(5));
console.log(triple(5));`,
      options: ['10 и 15', '5 и 5', '10 и 5', '25 и 25'],
      correctIndex: 0,
      explanation:
        '`partial(multiply, 2)` создаёт функцию, которая при вызове передаёт `2` как первый аргумент в `multiply`. `double(5)` → `multiply(2, 5)` → 10. `triple(5)` → `multiply(3, 5)` → 15.',
    },
    {
      type: 'output',
      id: 'jsc-q9',
      description: 'Область видимости let vs var. Что выведет код?',
      code: `function test() {
  console.log(a); // line 1
  // console.log(b); // выбросит ReferenceError
  var a = 1;
  let b = 2;
  console.log(a); // line 2
  console.log(b); // line 3
}
test();`,
      options: ['undefined, 1, 2', '1, 1, 2', 'ReferenceError', 'undefined, undefined, 2'],
      correctIndex: 0,
      explanation:
        '`var a` всплывает (hoisting) в начало функции со значением `undefined`. Поэтому line 1 выводит `undefined`. После присваивания `a = 1` — line 2 выводит `1`. `let b` тоже всплывает, но находится в "мёртвой зоне" (TDZ) до строки объявления — обращение до объявления выбросит ReferenceError. Line 3 выводит `2`.',
    },
    {
      type: 'fill-blank',
      id: 'jsc-q10',
      description: 'Заполните пропуск, чтобы каждая итерация цикла создавала свою область видимости.',
      codeWithBlanks: `const fns = [];
for (___BLANK___ i = 0; i < 3; i++) {
  fns.push(() => i);
}
// fns[0]() === 0, fns[1]() === 1, fns[2]() === 2`,
      options: ['let', 'var', 'const', 'function'],
      correctIndex: 0,
      explanation:
        '`let` создаёт новую привязку переменной `i` для каждой итерации цикла. Каждая функция в массиве замыкается на свою копию `i`. С `var` все функции разделяли бы одну переменную и вернули бы 3.',
    },
    {
      type: 'output',
      id: 'jsc-q11',
      description: 'Замыкание в объекте. Что выведет console.log?',
      code: `function createPerson(name) {
  let age = 0;
  return {
    birthday() { age++; },
    getInfo() { return \`\${name}, \${age}\`; },
  };
}

const alice = createPerson('Alice');
alice.birthday();
alice.birthday();
console.log(alice.getInfo());`,
      options: ['"Alice, 0"', '"Alice, 2"', '"Alice, undefined"', 'ReferenceError'],
      correctIndex: 1,
      explanation:
        'Методы объекта `birthday` и `getInfo` замыкаются на переменные `name` и `age` из внешней функции `createPerson`. Каждый вызов `birthday()` инкрементирует `age`. После двух вызовов `age === 2`. `name` — аргумент функции, тоже хранится в замыкании.',
    },
    {
      type: 'complexity',
      id: 'jsc-q12',
      description: 'Какова сложность по памяти функции memoize при n уникальных вызовах?',
      code: `function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}`,
      options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'],
      correctIndex: 1,
      explanation:
        'При n уникальных наборах аргументов в кеш записывается n записей. Память растёт линейно: O(n). Это компромисс мемоизации: экономим время (O(1) повторный вызов) за счёт памяти (O(n) для кеша).',
    },
  ],
};
