import type { Problem } from '../../types/problem';

export const jsThisProblems: Problem[] = [
  {
    id: 'jst-p1',
    topicId: 'js-this',
    title: 'myBind — реализовать Function.prototype.bind',
    difficulty: 'medium',
    isContextual: false,
    description: `Реализуйте функцию \`myBind(fn, ctx, ...partialArgs)\`, которая работает как \`Function.prototype.bind\`:
- Возвращает новую функцию с привязанным контекстом \`ctx\`
- Поддерживает частичное применение аргументов (\`partialArgs\`)
- Аргументы вызова добавляются после \`partialArgs\`

Примеры:
\`\`\`
function greet(greeting, punct) {
  return \`\${greeting}, \${this.name}\${punct}\`;
}
const user = { name: 'Alice' };

const boundFn = myBind(greet, user, 'Hello');
boundFn('!');  // → "Hello, Alice!"
boundFn('?');  // → "Hello, Alice?"
\`\`\``,
    functionName: 'myBind_test',
    starterCode: `function myBind(fn, ctx, ...partialArgs) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jst-p1-t1',
        inputDisplay: 'myBind(greet, {name: "Alice"})() → правильный this',
        inputArgs: ['basic-this'],
        expected: 'Hello, Alice',
      },
      {
        id: 'jst-p1-t2',
        inputDisplay: 'myBind с частичными аргументами',
        inputArgs: ['partial-args'],
        expected: 'Hi, Bob!',
      },
      {
        id: 'jst-p1-t3',
        inputDisplay: 'возвращает функцию',
        inputArgs: ['returns-function'],
        expected: true,
      },
      {
        id: 'jst-p1-t4',
        inputDisplay: 'аргументы вызова добавляются после partial',
        inputArgs: ['combined-args'],
        expected: 10,
      },
      {
        id: 'jst-p1-t5',
        inputDisplay: 'this не меняется при повторных привязках',
        inputArgs: ['fixed-this'],
        expected: 'Alice',
      },
    ],
    hints: [
      'Верните функцию, которая вызывает `fn.apply(ctx, [...partialArgs, ...callArgs])`.',
      'Для частичного применения: объедините `partialArgs` (из myBind) с аргументами нового вызова через spread.',
      'Если нужно поддержать `new`, нужна более сложная реализация. Для базового случая — apply достаточно.',
    ],
    solutionCode: `function myBind(fn, ctx, ...partialArgs) {
  return function(...callArgs) {
    return fn.apply(ctx, [...partialArgs, ...callArgs]);
  };
}`,
    testHelperCode: `function myBind_test(arg) {
  function greet(greeting, punct) {
    return greeting + ', ' + this.name + (punct || '');
  }
  const alice = { name: 'Alice' };
  const bob = { name: 'Bob' };
  if (arg === 'basic-this') {
    return myBind(greet, alice)('Hello');
  }
  if (arg === 'partial-args') {
    return myBind(greet, bob, 'Hi')('!');
  }
  if (arg === 'returns-function') {
    return typeof myBind(greet, alice) === 'function';
  }
  if (arg === 'combined-args') {
    function add(a, b, c) { return a + b + c; }
    return myBind(add, null, 3)(3, 4);
  }
  if (arg === 'fixed-this') {
    function getName() { return this.name; }
    return myBind(getName, alice)();
  }
}`,
  },
  {
    id: 'jst-p2',
    topicId: 'js-this',
    title: 'myNew — реализовать оператор new',
    difficulty: 'medium',
    isContextual: false,
    description: `Реализуйте функцию \`myNew(Constructor, ...args)\`, которая эмулирует оператор \`new\`:

1. Создаёт новый пустой объект
2. Устанавливает прототип объекта — \`Constructor.prototype\`
3. Вызывает \`Constructor\` с этим объектом как \`this\`
4. Возвращает объект (или результат Constructor, если он вернул объект)

Примеры:
\`\`\`
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.greet = function() {
  return \`Hi, I'm \${this.name}\`;
};

const alice = myNew(Person, 'Alice', 30);
alice.name;   // → 'Alice'
alice.age;    // → 30
alice.greet(); // → "Hi, I'm Alice"
alice instanceof Person; // → true
\`\`\``,
    functionName: 'myNew_test',
    starterCode: `function myNew(Constructor, ...args) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jst-p2-t1',
        inputDisplay: 'созданный объект имеет правильные свойства',
        inputArgs: ['properties'],
        expected: 'Alice',
      },
      {
        id: 'jst-p2-t2',
        inputDisplay: 'объект наследует от Constructor.prototype',
        inputArgs: ['prototype'],
        expected: true,
      },
      {
        id: 'jst-p2-t3',
        inputDisplay: 'метод из прототипа работает',
        inputArgs: ['proto-method'],
        expected: "Hi, I'm Alice",
      },
      {
        id: 'jst-p2-t4',
        inputDisplay: 'если Constructor возвращает объект — использовать его',
        inputArgs: ['return-object'],
        expected: true,
      },
      {
        id: 'jst-p2-t5',
        inputDisplay: 'если Constructor возвращает примитив — игнорировать',
        inputArgs: ['return-primitive'],
        expected: 'Alice',
      },
    ],
    hints: [
      'Шаг 1: создайте объект с нужным прототипом: `Object.create(Constructor.prototype)`.',
      'Шаг 2: вызовите Constructor с этим объектом как this: `Constructor.apply(obj, args)`. Сохраните результат.',
      'Шаг 3: если результат — объект (и не null), верните его. Иначе верните `obj`. Проверка: `result !== null && typeof result === "object"`.',
    ],
    solutionCode: `function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return (result !== null && typeof result === 'object') ? result : obj;
}`,
    testHelperCode: `function myNew_test(arg) {
  function Person(name, age) {
    this.name = name;
    this.age = age;
  }
  Person.prototype.greet = function() { return "Hi, I'm " + this.name; };
  if (arg === 'properties') return myNew(Person, 'Alice', 30).name;
  if (arg === 'prototype') return myNew(Person, 'Alice') instanceof Person;
  if (arg === 'proto-method') return myNew(Person, 'Alice').greet();
  if (arg === 'return-object') {
    function Special(name) { this.name = name; return { special: true }; }
    return myNew(Special, 'Bob').special === true;
  }
  if (arg === 'return-primitive') {
    function Weird(name) { this.name = name; return 42; }
    return myNew(Weird, 'Alice').name;
  }
}`,
  },
  {
    id: 'jst-p3',
    topicId: 'js-this',
    title: 'Цепочка методов (method chaining)',
    difficulty: 'easy',
    isContextual: false,
    description: `Реализуйте класс \`Calculator\` с поддержкой цепочки вызовов (fluent interface):
- \`add(n)\` — прибавить n к текущему значению, вернуть \`this\`
- \`subtract(n)\` — вычесть n, вернуть \`this\`
- \`multiply(n)\` — умножить на n, вернуть \`this\`
- \`getValue()\` — вернуть текущее значение

Начальное значение: 0 (или передаётся в конструктор).

Примеры:
\`\`\`
new Calculator()
  .add(10)
  .multiply(2)
  .subtract(5)
  .getValue(); // → 15
\`\`\``,
    functionName: 'Calculator_test',
    starterCode: `class Calculator {
  constructor(initial = 0) {
    // ваш код
  }

  add(n) {
    // ваш код
  }

  subtract(n) {
    // ваш код
  }

  multiply(n) {
    // ваш код
  }

  getValue() {
    // ваш код
  }
}`,
    testCases: [
      {
        id: 'jst-p3-t1',
        inputDisplay: 'new Calculator().add(10).multiply(2).subtract(5).getValue()',
        inputArgs: ['chain-1'],
        expected: 15,
      },
      {
        id: 'jst-p3-t2',
        inputDisplay: 'new Calculator(5).add(5).getValue()',
        inputArgs: ['with-initial'],
        expected: 10,
      },
      {
        id: 'jst-p3-t3',
        inputDisplay: 'new Calculator().getValue()',
        inputArgs: ['zero'],
        expected: 0,
      },
      {
        id: 'jst-p3-t4',
        inputDisplay: 'методы возвращают this (для chaining)',
        inputArgs: ['returns-this'],
        expected: true,
      },
      {
        id: 'jst-p3-t5',
        inputDisplay: 'new Calculator().add(3).add(3).add(3).getValue()',
        inputArgs: ['triple-add'],
        expected: 9,
      },
    ],
    hints: [
      'Каждый метод должен возвращать `this` — это и есть суть fluent interface.',
      'Сохраняйте текущее значение в `this.value`. Каждая операция изменяет `this.value` и возвращает `this`.',
    ],
    solutionCode: `class Calculator {
  constructor(initial = 0) {
    this.value = initial;
  }

  add(n) {
    this.value += n;
    return this;
  }

  subtract(n) {
    this.value -= n;
    return this;
  }

  multiply(n) {
    this.value *= n;
    return this;
  }

  getValue() {
    return this.value;
  }
}`,
    testHelperCode: `function Calculator_test(arg) {
  if (arg === 'chain-1') return new Calculator().add(10).multiply(2).subtract(5).getValue();
  if (arg === 'with-initial') return new Calculator(5).add(5).getValue();
  if (arg === 'zero') return new Calculator().getValue();
  if (arg === 'returns-this') { const c = new Calculator(); return c.add(1) === c; }
  if (arg === 'triple-add') return new Calculator().add(3).add(3).add(3).getValue();
}`,
  },
  {
    id: 'jst-p4',
    topicId: 'js-this',
    title: 'myCall — реализовать Function.prototype.call',
    difficulty: 'medium',
    isContextual: false,
    description: `Реализуйте функцию \`myCall(fn, ctx, ...args)\` без использования \`call\`, \`apply\` или \`bind\`.

Функция должна вызвать \`fn\` с контекстом \`ctx\` и аргументами \`args\`.

Трюк: временно добавить fn как метод объекта ctx, вызвать, удалить.

Примеры:
\`\`\`
function greet() {
  return this.name;
}

myCall(greet, { name: 'Alice' }); // → 'Alice'
myCall(greet, { name: 'Bob' });   // → 'Bob'
\`\`\``,
    functionName: 'myCall_test',
    starterCode: `function myCall(fn, ctx, ...args) {
  // ваш код — нельзя использовать call/apply/bind!
}`,
    testCases: [
      {
        id: 'jst-p4-t1',
        inputDisplay: 'myCall(greet, {name: "Alice"}) → "Alice"',
        inputArgs: ['basic'],
        expected: 'Alice',
      },
      {
        id: 'jst-p4-t2',
        inputDisplay: 'передача аргументов',
        inputArgs: ['with-args'],
        expected: 10,
      },
      {
        id: 'jst-p4-t3',
        inputDisplay: 'ctx = null → this = глобальный объект',
        inputArgs: ['null-ctx'],
        expected: true,
      },
      {
        id: 'jst-p4-t4',
        inputDisplay: 'не оставляет временного свойства на ctx',
        inputArgs: ['no-pollution'],
        expected: true,
      },
      {
        id: 'jst-p4-t5',
        inputDisplay: 'возвращает результат fn',
        inputArgs: ['return-value'],
        expected: 42,
      },
    ],
    hints: [
      'Идея: присвоить `ctx[tempKey] = fn`, вызвать `ctx[tempKey](...args)`, удалить `delete ctx[tempKey]`, вернуть результат.',
      'Для уникального ключа используйте Symbol: `const key = Symbol()` — гарантирует отсутствие коллизий.',
      'Если ctx = null или undefined, используйте globalThis вместо него.',
    ],
    solutionCode: `function myCall(fn, ctx, ...args) {
  const context = ctx ?? globalThis;
  const key = Symbol('myCall');
  context[key] = fn;
  const result = context[key](...args);
  delete context[key];
  return result;
}`,
    testHelperCode: `function myCall_test(arg) {
  function greet() { return this.name; }
  if (arg === 'basic') return myCall(greet, { name: 'Alice' });
  if (arg === 'with-args') {
    function sum(a, b, c) { return a + b + c; }
    return myCall(sum, null, 3, 3, 4);
  }
  if (arg === 'null-ctx') {
    function checkGlobal() { return this === globalThis; }
    return myCall(checkGlobal, null);
  }
  if (arg === 'no-pollution') {
    const obj = { name: 'test' };
    myCall(greet, obj);
    return Object.keys(obj).length === 1;
  }
  if (arg === 'return-value') return myCall(() => 42, null);
}`,
  },
  {
    id: 'jst-p5',
    topicId: 'js-this',
    title: 'Правильный this в классе с событиями',
    difficulty: 'easy',
    isContextual: true,
    description: `Дан класс \`EventButton\`. Метод \`handleClick\` теряет контекст, когда передаётся как callback.

Ваша задача: реализовать класс так, чтобы \`handleClick\` всегда имел правильный \`this\` (экземпляр класса), независимо от способа вызова.

Примеры:
\`\`\`
const btn = new EventButton('Купить');
const handler = btn.handleClick; // извлечение метода
handler(); // должно вернуть 'Clicked: Купить' — НЕ ошибку
\`\`\``,
    functionName: 'EventButton_test',
    starterCode: `class EventButton {
  constructor(label) {
    this.label = label;
    // ваш код — убедитесь что handleClick всегда имеет правильный this
  }

  handleClick() {
    return \`Clicked: \${this.label}\`;
  }
}`,
    testCases: [
      {
        id: 'jst-p5-t1',
        inputDisplay: 'btn.handleClick() — прямой вызов',
        inputArgs: ['direct'],
        expected: 'Clicked: Купить',
      },
      {
        id: 'jst-p5-t2',
        inputDisplay: 'const h = btn.handleClick; h() — вызов без контекста',
        inputArgs: ['detached'],
        expected: 'Clicked: Купить',
      },
      {
        id: 'jst-p5-t3',
        inputDisplay: 'setTimeout(btn.handleClick, 0) — callback',
        inputArgs: ['callback'],
        expected: 'Clicked: Купить',
      },
      {
        id: 'jst-p5-t4',
        inputDisplay: 'два экземпляра — независимые контексты',
        inputArgs: ['independent'],
        expected: true,
      },
      {
        id: 'jst-p5-t5',
        inputDisplay: 'this.label доступен',
        inputArgs: ['label'],
        expected: 'Купить',
      },
    ],
    hints: [
      'Привяжите метод в конструкторе: `this.handleClick = this.handleClick.bind(this)`. После этого даже при извлечении метода из объекта `this` будет корректным.',
      'Альтернатива: использовать стрелочную функцию как свойство класса: `handleClick = () => { ... }`. Стрелочные функции лексически захватывают `this`.',
    ],
    solutionCode: `class EventButton {
  constructor(label) {
    this.label = label;
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    return \`Clicked: \${this.label}\`;
  }
}`,
    testHelperCode: `function EventButton_test(arg) {
  if (arg === 'direct') {
    const btn = new EventButton('Купить');
    return btn.handleClick();
  }
  if (arg === 'detached') {
    const btn = new EventButton('Купить');
    const h = btn.handleClick;
    return h();
  }
  if (arg === 'callback') {
    const btn = new EventButton('Купить');
    const h = btn.handleClick;
    return h();
  }
  if (arg === 'independent') {
    const btn1 = new EventButton('Купить');
    const btn2 = new EventButton('Продать');
    return btn1.handleClick() === 'Clicked: Купить' && btn2.handleClick() === 'Clicked: Продать';
  }
  if (arg === 'label') {
    return new EventButton('Купить').label;
  }
}`,
  },
  {
    id: 'jst-p6',
    topicId: 'js-this',
    kind: 'predict-output',
    title: 'Потеря this в setTimeout',
    difficulty: 'easy',
    isContextual: false,
    description: `Что выведет код в консоль? Будьте внимательны: метод \`tick\` передаётся в \`setTimeout\` без привязки контекста. В сравнении показано, что произойдёт со стрелочной обёрткой.`,
    code: `const counter = {
  value: 7,
  tick() {
    console.log(this && this.value);
  },
};

// 1) метод передан напрямую — implicit binding потерян
setTimeout(counter.tick, 0);

// 2) стрелочная обёртка сохраняет contextual вызов
setTimeout(() => counter.tick(), 0);`,
    expected: 'undefined\n7',
    acceptable: ['undefined\n7'],
    hints: [
      'При передаче `counter.tick` в `setTimeout` теряется связь с объектом — функция вызывается без implicit binding.',
      'В strict mode default binding даёт `this = undefined`, поэтому `this && this.value` короткозамкнётся в `undefined`.',
      'Стрелочная функция-обёртка не наследует this от counter — она просто делает обычный вызов counter.tick(), сохраняющий implicit binding.',
    ],
    solutionCode: `// Первый setTimeout получает голую ссылку на функцию tick.
// При вызове в очереди задач срабатывает default binding:
// в strict mode this = undefined, поэтому this && this.value === undefined.
//
// Второй setTimeout получает стрелочную функцию, внутри которой явно
// вызывается counter.tick() — это implicit binding, this = counter,
// console.log выведет 7.
//
// Итог: "undefined", затем "7".`,
  },
  {
    id: 'jst-p7',
    topicId: 'js-this',
    kind: 'find-bug',
    title: 'Стрелочная функция как метод класса прототипа',
    difficulty: 'medium',
    isContextual: false,
    description: `Класс \`Counter\` должен инкрементировать внутренний счётчик и возвращать новое значение. Однако автор задал метод \`increment\` как **стрелочную функцию на прототипе** — а это меняет поведение \`this\`. Найдите ошибку и перепишите метод как обычный, чтобы тесты прошли.

Подсказка: стрелочная функция не имеет собственного \`this\`, а значит, при её вызове как метода \`counter.increment()\` она не получит \`this = counter\`.`,
    functionName: 'Counter_test',
    buggyCode: `class Counter {
  constructor() {
    this.value = 0;
  }
}

// Метод добавлен на прототип как стрелочная функция.
// Из-за этого this не привязывается к экземпляру.
Counter.prototype.increment = () => {
  this.value = (this.value || 0) + 1;
  return this.value;
};`,
    bugSummary:
      'Метод increment объявлен как стрелочная функция на прототипе. Стрелочная функция захватывает this лексически (из глобальной области), а не получает this = экземпляр при вызове counter.increment(). Метод должен быть обычной функцией.',
    testCases: [
      {
        id: 'jst-p7-t1',
        inputDisplay: 'new Counter().increment() → 1',
        inputArgs: ['first-call'],
        expected: 1,
      },
      {
        id: 'jst-p7-t2',
        inputDisplay: 'три вызова increment подряд → 3',
        inputArgs: ['three-calls'],
        expected: 3,
      },
      {
        id: 'jst-p7-t3',
        inputDisplay: 'два экземпляра имеют независимое value',
        inputArgs: ['independent'],
        expected: true,
      },
      {
        id: 'jst-p7-t4',
        inputDisplay: 'после increment значение хранится на экземпляре',
        inputArgs: ['stored'],
        expected: 1,
      },
    ],
    hints: [
      'Стрелочная функция не имеет собственного this — call/apply/bind на неё не влияют, и она не получает this = экземпляр при вызове через точку.',
      'Замените стрелочную функцию на обычную: `Counter.prototype.increment = function () { ... }` или объявите метод внутри класса: `increment() { ... }`.',
      'После исправления `this` внутри метода будет указывать на экземпляр, и `this.value++` сохранит счётчик в нужном месте.',
    ],
    solutionCode: `class Counter {
  constructor() {
    this.value = 0;
  }
  increment() {
    this.value += 1;
    return this.value;
  }
}`,
    testHelperCode: `function Counter_test(arg) {
  if (arg === 'first-call') {
    return new Counter().increment();
  }
  if (arg === 'three-calls') {
    const c = new Counter();
    c.increment();
    c.increment();
    return c.increment();
  }
  if (arg === 'independent') {
    const a = new Counter();
    const b = new Counter();
    a.increment();
    a.increment();
    b.increment();
    return a.value === 2 && b.value === 1;
  }
  if (arg === 'stored') {
    const c = new Counter();
    c.increment();
    return c.value;
  }
}`,
  },
  {
    id: 'jst-p8',
    topicId: 'js-this',
    kind: 'refactor',
    title: 'Рефакторинг that = this и bind на стрелочные функции',
    difficulty: 'medium',
    isContextual: false,
    description: `Класс \`Tracker\` написан в старом стиле: используется идиома \`var that = this\` и \`bind\` в конструкторе для каждого метода. Перепишите класс на современный синтаксис ES2022:

- Используйте class fields со стрелочными функциями вместо \`bind\` в конструкторе.
- Замените \`that = this\` внутри методов на стрелочные функции — они захватят \`this\` лексически.
- Сохраните публичный API: методы \`add(item)\`, \`countAll()\`, \`reset()\`, поле \`items\`.

Тесты проверяют корректность работы при потере контекста (метод вытащен в переменную или передан как callback). Дополнительный perf-тест проверяет, что массовое создание экземпляров укладывается в бюджет времени.`,
    functionName: 'Tracker_test',
    starterCode: `class Tracker {
  constructor() {
    this.items = [];
    this.add = this.add.bind(this);
    this.countAll = this.countAll.bind(this);
    this.reset = this.reset.bind(this);
  }

  add(item) {
    var that = this;
    [item].forEach(function (x) {
      that.items.push(x);
    });
    return that.items.length;
  }

  countAll() {
    var that = this;
    return that.items.reduce(function (acc, _) {
      return acc + 1;
    }, 0);
  }

  reset() {
    this.items = [];
  }
}`,
    testCases: [
      {
        id: 'jst-p8-t1',
        inputDisplay: 'add возвращает новую длину items',
        inputArgs: ['add-returns-length'],
        expected: 3,
      },
      {
        id: 'jst-p8-t2',
        inputDisplay: 'countAll возвращает количество элементов',
        inputArgs: ['count'],
        expected: 2,
      },
      {
        id: 'jst-p8-t3',
        inputDisplay: 'add работает после извлечения метода (потеря контекста)',
        inputArgs: ['detached-add'],
        expected: 1,
      },
      {
        id: 'jst-p8-t4',
        inputDisplay: 'reset очищает items',
        inputArgs: ['reset'],
        expected: 0,
      },
      {
        id: 'jst-p8-t5',
        inputDisplay: 'два экземпляра независимы',
        inputArgs: ['independent'],
        expected: true,
      },
    ],
    perfTest: {
      inputArgs: ['perf-mass-create'],
      maxMs: 250,
    },
    hints: [
      'Объявите методы как class fields со стрелочными функциями: `add = (item) => { ... }`. Они захватят this лексически и не потеряются как callback.',
      'Внутри методов замените `var that = this` на стрелочные функции в callback-ах forEach/reduce — они увидят this метода.',
      'После рефакторинга bind в конструкторе становится не нужен, а код методов короче и читаемее.',
    ],
    solutionCode: `class Tracker {
  items = [];

  add = (item) => {
    [item].forEach((x) => {
      this.items.push(x);
    });
    return this.items.length;
  };

  countAll = () => {
    return this.items.reduce((acc) => acc + 1, 0);
  };

  reset = () => {
    this.items = [];
  };
}`,
    testHelperCode: `function Tracker_test(arg) {
  if (arg === 'add-returns-length') {
    const t = new Tracker();
    t.add('a');
    t.add('b');
    return t.add('c');
  }
  if (arg === 'count') {
    const t = new Tracker();
    t.add('x');
    t.add('y');
    return t.countAll();
  }
  if (arg === 'detached-add') {
    const t = new Tracker();
    const add = t.add;
    return add('detached');
  }
  if (arg === 'reset') {
    const t = new Tracker();
    t.add('a');
    t.add('b');
    t.reset();
    return t.items.length;
  }
  if (arg === 'independent') {
    const a = new Tracker();
    const b = new Tracker();
    a.add('x');
    a.add('y');
    b.add('z');
    return a.items.length === 2 && b.items.length === 1;
  }
  if (arg === 'perf-mass-create') {
    const trackers = [];
    for (let i = 0; i < 5000; i++) {
      const t = new Tracker();
      t.add(i);
      trackers.push(t);
    }
    return trackers.length;
  }
}`,
  },
  {
    id: 'jst-h1',
    topicId: 'js-this',
    kind: 'implement',
    title: 'Реализуй Function.prototype.myBind',
    difficulty: 'hard',
    isContextual: false,
    description: `Реализуйте метод \`Function.prototype.myBind(thisArg, ...partialArgs)\`, аналог нативного \`bind\`.

Метод должен:
- Фиксировать \`this\` в возвращаемой функции
- Поддерживать **частичное применение** аргументов
- Возвращать функцию, которую можно вызвать с дополнительными аргументами
- При вызове через \`new\` — \`this\` должен быть новым объектом (как у нативного \`bind\`)

Примеры:
\`\`\`
function greet(greeting, name) {
  return \`\${greeting}, \${name}! I am \${this.title}\`;
}

const obj = { title: 'Dr.' };
const boundGreet = greet.myBind(obj, 'Hello');
boundGreet('Alice')  // → "Hello, Alice! I am Dr."
\`\`\``,
    functionName: 'myBind_test',
    starterCode: `Function.prototype.myBind = function(thisArg, ...partialArgs) {
  // ваш код
};`,
    testCases: [
      { id: 'jst-h1-t1', inputDisplay: 'фиксирует this', inputArgs: ['bind-this'], expected: 'Hello, Alice! I am Dr.' },
      { id: 'jst-h1-t2', inputDisplay: 'частичное применение аргументов', inputArgs: ['partial-args'], expected: 15 },
      { id: 'jst-h1-t3', inputDisplay: 'дополнительные аргументы при вызове', inputArgs: ['extra-args'], expected: 'AB' },
      { id: 'jst-h1-t4', inputDisplay: 'this игнорируется при new', inputArgs: ['new-call'], expected: true },
    ],
    hints: [
      'Сохраните оригинальную функцию в переменную: `const fn = this`. Верните новую функцию с нужным this.',
      'Объедините partialArgs и аргументы нового вызова: `fn.apply(thisArg, [...partialArgs, ...args])`.',
      'Для поддержки `new`: проверьте `this instanceof bound` внутри возвращаемой функции. Если true — используйте текущий `this` вместо thisArg.',
    ],
    solutionCode: `Function.prototype.myBind = function(thisArg, ...partialArgs) {
  const fn = this;

  function bound(...args) {
    // При вызове через new this является новым объектом — используем его
    const context = this instanceof bound ? this : thisArg;
    return fn.apply(context, [...partialArgs, ...args]);
  }

  // Наследование прототипа для корректной работы instanceof
  if (fn.prototype) {
    bound.prototype = Object.create(fn.prototype);
  }

  return bound;
};`,
    testHelperCode: `function myBind_test(scenario) {
  if (scenario === 'bind-this') {
    function greet(greeting, name) {
      return greeting + ', ' + name + '! I am ' + this.title;
    }
    const obj = { title: 'Dr.' };
    return greet.myBind(obj, 'Hello')('Alice');
  }
  if (scenario === 'partial-args') {
    function add(a, b, c) { return a + b + c; }
    return add.myBind(null, 5, 4)(6);
  }
  if (scenario === 'extra-args') {
    function concat(a, b) { return a + b; }
    const f = concat.myBind(null, 'A');
    return f('B');
  }
  if (scenario === 'new-call') {
    function Counter(start) { this.count = start; }
    const BoundCounter = Counter.myBind({}, 10);
    const c = new BoundCounter();
    return c instanceof Counter;
  }
}`,
  },
  {
    id: 'jst-h2',
    topicId: 'js-this',
    kind: 'predict-output',
    title: 'Предскажи вывод: классы, стрелки и потеря контекста',
    difficulty: 'hard',
    isContextual: false,
    description: `Внимательно проследите, какой \`this\` у каждого вызова: класс, стрелочная функция, деструктуризация метода.

Что выведет код? Введите строки через перенос строки.`,
    code: `class Timer {
  constructor(name) {
    this.name = name;
    this.ticks = 0;
  }

  tick() {
    this.ticks++;
    return this.name;
  }

  start() {
    const fn = this.tick;
    const arrow = () => this.tick();

    console.log(fn.call({ name: 'override', ticks: 0 }));
    console.log(arrow());
    console.log(this.ticks);
  }
}

const t = new Timer('T');
t.start();`,
    expected: 'override\nT\n1',
    hints: [
      '`fn.call({ name: "override" })` — this внутри tick это { name: "override" }, возвращает "override".',
      '`arrow()` — стрелка захватывает this из start, то есть экземпляр t. tick() вызывается как t.tick(), ticks становится 1, возвращает "T".',
      '`this.ticks` — после двух вызовов: первый через call изменил ticks у временного объекта (не у t), второй через arrow вызвал t.tick() и увеличил t.ticks до 1.',
    ],
    solutionCode: `// fn.call({ name: 'override', ticks: 0 }):
//   this = { name: 'override', ticks: 0 }
//   this.ticks++ → 1
//   return 'override' → выводит "override"
//
// arrow(): стрелка захватила this = t (экземпляр Timer)
//   вызывает t.tick() → t.ticks++ = 1, return 'T'
//   выводит "T"
//
// console.log(this.ticks): t.ticks === 1 (увеличен стрелкой)
//   выводит "1"`,
  },
];
