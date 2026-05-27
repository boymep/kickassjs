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
      "Нужно вернуть новую функцию, которая при вызове выполнит исходную, но с заранее зафиксированным контекстом и склеенным набором аргументов. Какие два инструмента позволяют вызвать функцию с явно заданным `this`?",
      "В замыкании уже есть `fn`, `ctx`, `partialArgs`. Верните `function (...callArgs)` и в её теле вызовите `fn.apply(ctx, [...partialArgs, ...callArgs])` — сначала зафиксированные, потом аргументы текущего вызова.",
      `\`this\` в JS определяется в момент вызова, а не объявления. \`bind\` создаёт обёртку, которая при любом будущем вызове подменяет \`this\` на захваченный. Учтите, что аргументы из \`bind(ctx, ...)\` склеиваются с аргументами вызова — это **частичное применение**: сначала идут зафиксированные, потом «свежие». И ещё нюанс: нативный \`bind\` ещё и игнорирует \`this\` при вызове через \`new\`, но в этой задаче этого не требуется — учебная версия проще.

С чего начать:
\`\`\`js
function myBind(fn, ctx, ...partialArgs) {
  return function (...callArgs) {
    // ...
  };
}
\`\`\``,
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
      "Оператор `new` делает четыре вещи: создаёт пустой объект, выставляет ему правильный прототип, вызывает конструктор с `this = этот объект`, возвращает либо результат конструктора (если это объект), либо сам объект.",
      "Создайте пустой объект с правильным прототипом через `Object.create(Constructor.prototype)`. Затем вызовите `Constructor.apply(obj, args)`. Если результат — объект (не `null`), верните его; иначе верните `obj`.",
      `Главная ловушка — последний шаг с возвратом. Если конструктор **явно вернул объект**, нативный \`new\` отдаёт именно его, а не созданный нами \`obj\`. Если же вернул примитив (число, строку, \`null\`, \`undefined\`) — возврат игнорируется, и приходит наш \`obj\`. Это и есть редкоиспользуемый, но реально существующий механизм «возврата другого объекта из конструктора». И обязательно \`Object.create(Constructor.prototype)\`, а не \`{}\` — иначе цепочка прототипов оборвётся, и \`instanceof\` даст \`false\`, а методы из прототипа окажутся недоступны.

С чего начать:
\`\`\`js
function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  // ...
}
\`\`\``,
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
    title: 'Цепочка вызовов методов',
    difficulty: 'easy',
    isContextual: false,
    description: `Реализуйте класс \`Calculator\` с поддержкой **цепочки вызовов** (fluent-интерфейс):

- \`add(n)\` — прибавить \`n\` к текущему значению, вернуть \`this\`
- \`subtract(n)\` — вычесть \`n\`, вернуть \`this\`
- \`multiply(n)\` — умножить на \`n\`, вернуть \`this\`
- \`getValue()\` — вернуть текущее значение

Начальное значение — \`0\` (или передаётся в конструктор).

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
        inputDisplay: 'методы возвращают this (для цепочки)',
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
      "Цепочка `calc.add(1).multiply(2)` работает только если `add(1)` возвращает объект, у которого снова есть `.multiply`. Что это за объект?",
      "Храните текущее значение в поле экземпляра — `this.value`. Каждый из `add`/`subtract`/`multiply` модифицирует `this.value` и `return this`. Метод `getValue` возвращает `this.value`.",
      `Суть fluent-API — каждая операция возвращает тот же объект, чтобы следующий вызов снова попал в его методы. В классе для этого достаточно \`return this\`. Тонкость: \`this\` тут — экземпляр класса, и определяется он способом вызова (\`new Calculator().add(...)\`), поэтому привязка не теряется, пока методы вызываются «через точку». Если же вытащить метод в переменную (\`const f = calc.add; f(1)\`), \`this\` пропадёт — это уже совсем другой паттерн, и его лечат либо \`bind\`, либо классовыми полями со стрелочными функциями.

С чего начать:
\`\`\`js
class Calculator {
  constructor(initial = 0) {
    this.value = initial;
  }
  add(n) {
    // ...
    return this;
  }
}
\`\`\``,
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
    description: `Реализуйте функцию \`myCall(fn, ctx, ...args)\` — без использования \`call\`, \`apply\` или \`bind\`.

Функция должна вызвать \`fn\` с контекстом \`ctx\` и аргументами \`args\`.

**Идея решения:** временно положить \`fn\` свойством на объект \`ctx\`, вызвать через точку — тогда \`this\` внутри будет равен \`ctx\` — и сразу удалить временное свойство.

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
      "Привязка `this` определяется тем, как вызвана функция. Если вызвать `obj.method()`, то внутри `method` будет `this === obj`. Как можно временно сделать `fn` методом `ctx`, чтобы воспользоваться этим правилом?",
      "Положите `fn` как свойство `ctx` под уникальным ключом — `Symbol()` гарантированно не пересечётся с уже существующими ключами. Вызовите через точку, сохраните результат, удалите ключ. Если `ctx` равен `null`/`undefined` — подставьте `globalThis`.",
      `Главная идея — **\`this\` определяется тем, как функция вызвана, а не тем, как объявлена**. Вызов через точку (\`obj.fn()\`) автоматически делает \`this === obj\`. Поэтому, чтобы «вручную» подсунуть нужный контекст без \`call\`/\`apply\`/\`bind\`, достаточно временно сделать \`fn\` методом этого объекта. \`Symbol\` гарантирует, что ключ не пересечётся с уже существующими свойствами \`ctx\`. Не забудьте \`delete\` после вызова — иначе обёртка засорит чужой объект, и поведение \`Object.keys(ctx)\` изменится после якобы безобидного вызова.

С чего начать:
\`\`\`js
function myCall(fn, ctx, ...args) {
  const context = ctx ?? globalThis;
  const key = Symbol('myCall');
  // ...
}
\`\`\``,
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
      "`this` определяется тем, как функция вызвана. Когда обработчик передан как ссылка и потом вызван «голым» (`h()`), привязки к экземпляру нет. Что нужно сделать с методом, чтобы его `this` оставался прежним при любом способе вызова?",
      "Два подхода: либо в конструкторе сделать `this.handleClick = this.handleClick.bind(this)`, либо объявить метод как **class field со стрелочной функцией** (`handleClick = () => { ... }`) — стрелочная функция лексически захватит `this` экземпляра.",
      `Разница между двумя подходами не косметическая. \`bind\` в конструкторе создаёт **новую функцию-обёртку на каждом экземпляре** — это та же память, что и классовые поля со стрелочными функциями. А вот обычный метод класса живёт **на прототипе** — один на всех, но теряет \`this\` при вытаскивании. Выбор зависит от сценария: если метод никогда не передаётся как колбэк — оставьте на прототипе ради памяти; если передаётся часто (обработчики событий, таймеры) — поле со стрелочной функцией или \`bind\` в конструкторе.

С чего начать:
\`\`\`js
class EventButton {
  constructor(label) {
    this.label = label;
    // ...
  }
}
\`\`\``,
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
    description: `Что выведет код в консоль? Будь внимателен: метод \`tick\` передаётся в \`setTimeout\` **без привязки контекста**. Во второй строке для сравнения показано, что произойдёт со стрелочной обёрткой.`,
    code: `const counter = {
  value: 7,
  tick() {
    console.log(this && this.value);
  },
};

// 1) метод передан напрямую — неявная привязка потеряна
setTimeout(counter.tick, 0);

// 2) стрелочная обёртка вызывает метод через точку — контекст сохраняется
setTimeout(() => counter.tick(), 0);`,
    expected: 'undefined\n7',
    acceptable: ['undefined\n7'],
    hints: [
      "Шаг 1: `setTimeout(counter.tick, 0)` получает ссылку на функцию `tick` без объекта-владельца. Когда таймер срабатывает, она вызывается как обычная функция — без `counter.` слева от точки.",
      "Шаг 2: внутри `tick` это означает `this === undefined` (в strict mode, который используют модули). Тогда `this && this.value` — это `undefined && ...`, то есть `undefined`.",
      "Шаг 3: во второй раз внутри стрелочной обёртки явно стоит `counter.tick()` — вызов через точку, поэтому `this === counter` и `this.value === 7`. Итог: `undefined`, `7`.",
    ],
    solutionCode: `// Первый setTimeout получает «голую» ссылку на функцию tick.
// Когда таймер срабатывает, функция вызывается сама по себе — без объекта слева от точки.
// В strict mode это значит this = undefined, поэтому this && this.value === undefined.
//
// Второй setTimeout получает стрелочную функцию. Внутри неё вызов идёт
// явно через точку — counter.tick() — то есть this = counter, и выведется 7.
//
// Итог: "undefined", затем "7".`,
  },
  {
    id: 'jst-p7',
    topicId: 'js-this',
    kind: 'find-bug',
    title: 'Стрелочная функция как метод на прототипе',
    difficulty: 'medium',
    isContextual: false,
    description: `Класс \`Counter\` должен увеличивать внутренний счётчик и возвращать новое значение. Но автор задал метод \`increment\` как **стрелочную функцию на прототипе** — а это ломает поведение \`this\`. Найдите ошибку и перепишите метод как обычный, чтобы тесты прошли.`,
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
      'Метод `increment` объявлен как стрелочная функция на прототипе. Стрелочная функция захватывает `this` лексически (из глобальной области), и при вызове `counter.increment()` не получает `this` = экземпляр. Чтобы привязка работала, метод должен быть обычной функцией.',
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
      "Стрелочная функция захватывает `this` в момент объявления (лексически) и игнорирует, как её вызвали. Здесь стрелочная функция объявлена в модульной/глобальной области, поэтому `this` внутри неё — не экземпляр. Нужен метод, у которого `this` определяется способом вызова.",
      "Обычные методы класса (или функции в `prototype`) получают `this` от вызывающего объекта. Уберите стрелочную функцию и объявите `increment()` как обычный метод внутри `class Counter`.",
      "Главный урок — **стрелочные функции и методы решают разные задачи**. Стрелочная функция хороша, когда нужно «приклеить» `this` к месту объявления (типичный пример — колбэки внутри методов класса). Но в роли самого метода она категорически не работает: её `this` определяется в момент создания функции, а не в момент вызова `counter.increment()`. Тут хочется именно «контекстного» `this` — поэтому метод должен быть обычной функцией, и место ему — внутри `class`, а не на прототипе через присваивание.",
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
    title: 'Рефакторинг: that = this и bind → стрелочные функции',
    difficulty: 'medium',
    isContextual: false,
    description: `Класс \`Tracker\` написан в старом стиле: используется идиома \`var that = this\` и \`.bind(this)\` в конструкторе для каждого метода. Перепишите класс на современный синтаксис **ES2022**:

- Используйте **поля класса** (class fields) со стрелочными функциями — вместо ручного \`bind\` в конструкторе.
- Замените \`that = this\` внутри методов на стрелочные функции — они захватят \`this\` лексически.
- Сохраните публичный API: методы \`add(item)\`, \`countAll()\`, \`reset()\` и поле \`items\`.

Тесты проверяют, что методы продолжают работать даже при потере контекста — если метод вытащен в отдельную переменную или передан как колбэк. Отдельный тест на производительность проверяет, что массовое создание экземпляров укладывается в отведённое время.`,
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
      "Идиомы `var that = this` и `.bind(this)` появились до стрелочных функций — обе нужны были, чтобы пробросить `this` во вложенный колбэк. Какая современная конструкция захватывает `this` лексически и убирает обе проблемы разом?",
      "Объявите `add`, `countAll`, `reset` как **поля класса со стрелочными функциями** — они автоматически связаны с экземпляром и переживают вытаскивание в переменную. Внутри методов любые внутренние колбэки в `forEach`/`reduce` тоже делайте стрелочными.",
      `Тут важна цена решения. **Классовые поля со стрелочными функциями** дают «бесплатную» привязку \`this\` — методы переживают вытаскивание в переменную и передачу как колбэк. Но каждый экземпляр получает **свой собственный** комплект функций, а не одну общую копию на прототипе. Для нескольких десятков экземпляров это незаметно, а вот при создании тысяч объектов (как в perf-тесте) разница в памяти и времени конструирования становится заметной. Современный движок справляется хорошо, но это не «бесплатно» — выбор «поле со стрелочной функцией vs метод на прототипе» всегда компромисс.

С чего начать:
\`\`\`js
class Tracker {
  items = [];
  add = (item) => {
    // ...
  };
}
\`\`\``,
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
    title: 'Реализуйте Function.prototype.myBind',
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
      "Метод объявлен на `Function.prototype` — значит, внутри него `this` это сама функция, которую байндят. Сохраните её в переменную замыкания, чтобы пользоваться при отложенном вызове.",
      "Верните функцию `bound`, которая внутри сама решает контекст: при вызове через `new` `this instanceof bound`, и тогда `thisArg` должен игнорироваться. Иначе — используйте `thisArg`. Не забудьте установить `bound.prototype = Object.create(fn.prototype)`, чтобы `instanceof` работал.",
      `Тонкая часть — поведение при вызове через \`new\`. Когда говорят \`new BoundFn(...)\`, движок создаёт новый объект и подсовывает его как \`this\` внутрь \`bound\`. В этом случае \`thisArg\`, переданный в \`bind\`, **должен игнорироваться** — иначе \`new\` будет ломаться. Распознать ситуацию помогает проверка \`this instanceof bound\`: при обычном вызове \`this\` равен либо \`undefined\`, либо глобальному объекту, и проверка возвращает \`false\`. Цепочка \`bound.prototype = Object.create(fn.prototype)\` нужна, чтобы \`instanceof\` для созданного через \`new BoundFn\` объекта корректно возвращал \`true\` относительно оригинального конструктора.

С чего начать:
\`\`\`js
Function.prototype.myBind = function (thisArg, ...partialArgs) {
  const fn = this;
  function bound(...args) {
    // ...
  }
  return bound;
};
\`\`\``,
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
    title: 'Что выведет код: классы, стрелочные функции и потеря контекста',
    difficulty: 'hard',
    isContextual: false,
    description: `Внимательно проследите, какой \`this\` у каждого вызова: класс, стрелочная функция, метод, извлечённый в переменную.

Что выведет код? Введите каждое значение на отдельной строке.`,
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
      "Шаг 1: первая строка вывода — `fn.call({ name: 'override', ticks: 0 })`. Это **явная** привязка: внутри `tick` `this` равен переданному литералу, увеличивает его `ticks` до 1 и возвращает `'override'`. Печатается `override`. Состояние `t` при этом не трогается.",
      "Шаг 2: вторая строка — `arrow()`. Стрелочная функция захватила `this` лексически в `start()`, значит `this === t`. Она вызывает `t.tick()` — теперь уже `t.ticks` становится 1 и возвращается `'T'`. Печатается `T`.",
      "Шаг 3: третья строка — `this.ticks`, где `this === t` (мы внутри метода `start`, вызванного через точку). После предыдущего шага `t.ticks === 1`. Итог: `override`, `T`, `1`.",
    ],
    solutionCode: `// fn.call({ name: 'override', ticks: 0 }):
//   явная привязка — this = { name: 'override', ticks: 0 }
//   this.ticks++ → 1
//   return 'override' → выводит "override"
//
// arrow(): стрелочная функция лексически захватила this = t (экземпляр Timer).
//   Вызывает t.tick() → t.ticks стало 1, return 'T' → выводит "T".
//
// console.log(this.ticks): t.ticks === 1 (увеличен через стрелочную функцию)
//   → выводит "1".`,
  },
  {
    id: 'jst-e2',
    topicId: 'js-this',
    kind: 'predict-output',
    title: 'Что выведет код: this в методе vs в распакованной функции',
    difficulty: 'easy',
    isContextual: false,
    description: `Один и тот же метод вызывается двумя способами: как метод объекта (\`obj.greet()\`) и как «свободная» функция, извлечённая из объекта (\`const f = obj.greet; f()\`).

Что выведется?

(Считаем, что код выполняется в strict mode внутри модуля — в нём \`this\` свободной функции равен \`undefined\`, и обращение к \`this.name\` бросает ошибку. В выводе обозначим это как \`TypeError\`.)`,
    code: `'use strict';

const obj = {
  name: 'Alice',
  greet() {
    return 'Hi, ' + this.name;
  },
};

console.log(obj.greet());

const f = obj.greet;
try {
  console.log(f());
} catch (e) {
  console.log('TypeError');
}`,
    expected: 'Hi, Alice\nTypeError',
    hints: [
      "Шаг 1: первый вызов — `obj.greet()`. Это **неявная** привязка через точку: `this === obj`, выражение `'Hi, ' + this.name` даёт `'Hi, Alice'`.",
      "Шаг 2: второй вызов — `f()`, где `f` — голая ссылка на ту же функцию. В strict mode у такой функции `this === undefined`, поэтому `undefined.name` бросает `TypeError`.",
      "Шаг 3: ошибка ловится в `catch` и печатается строка `'TypeError'`. Итог: `Hi, Alice`, затем `TypeError`.",
    ],
    solutionCode: `// obj.greet(): this = obj, выводит "Hi, Alice".
// f = obj.greet; f(): this в strict mode === undefined.
//   undefined.name → TypeError → "TypeError".`,
  },
  {
    id: 'jst-h3',
    topicId: 'js-this',
    kind: 'implement',
    title: 'autoBind — привязать все методы объекта к нему самому',
    difficulty: 'hard',
    isContextual: false,
    description: `Реализуйте \`autoBind(obj)\` — функцию, которая **привязывает (\`.bind\`) все собственные методы объекта \`obj\` к самому \`obj\`**, заменяя их на привязанные версии. Возвращает тот же объект (мутирует его), чтобы вызовы можно было выстраивать в цепочку.

- Привязываются **только функции-методы** (свойства типа \`function\`).
- Свойства-данные (числа, строки и т. п.) не трогаются.
- Методы из прототипа не трогаются — обрабатываются только **собственные** свойства.

Зачем это нужно: такой приём часто используют в классах, чтобы методы можно было передавать как колбэки (в обработчики событий, таймеры и т. п.) без потери \`this\`.

Пример:
\`\`\`
const counter = {
  count: 0,
  inc() { this.count++; },
  dec() { this.count--; },
};
autoBind(counter);
const f = counter.inc;
f();
counter.count;  // → 1 (контекст сохранён)
\`\`\``,
    functionName: 'autoBind_test',
    starterCode: `function autoBind(obj) {
  // ваш код
}`,
    testCases: [
      { id: 'jst-h3-t1', inputDisplay: "извлечённый метод сохраняет контекст", inputArgs: ['extract-method'], expected: 1 },
      { id: 'jst-h3-t2', inputDisplay: "несколько вызовов аккумулируют состояние", inputArgs: ['multi-call'], expected: 3 },
      { id: 'jst-h3-t3', inputDisplay: "не-функции остаются как есть", inputArgs: ['keep-data'], expected: { name: 'Alice', age: 30 } },
      { id: 'jst-h3-t4', inputDisplay: "autoBind возвращает тот же объект", inputArgs: ['returns-self'], expected: true },
      { id: 'jst-h3-t5', inputDisplay: "не трогает методы прототипа", inputArgs: ['skip-proto'], expected: 'proto-untouched' },
    ],
    hints: [
      "Нужно пройтись только по **собственным** свойствам объекта и среди них найти функции, заменив их версией с прибитым контекстом. Какие методы перечисляют именно собственные ключи и не лезут в прототип?",
      "Используйте `Object.getOwnPropertyNames(obj)`. Для каждого ключа проверьте `typeof obj[key] === 'function'` и присвойте `obj[key] = obj[key].bind(obj)`. В конце верните сам `obj`.",
      `Ключевой момент — **только собственные свойства**. \`for...in\` или \`Object.keys\` тоже про собственные, но \`Object.getOwnPropertyNames\` дополнительно ловит **неперечисляемые**. Главное — не трогать прототип: если пройтись по всем ключам в \`for...in\` без фильтра, можно случайно затронуть методы родительского класса, и побочные эффекты разойдутся по всем экземплярам. Также важно: \`bind\` заменяет функцию на новую обёртку, и старая ссылка перестаёт быть равной новой — это может сломать код, который сравнивает методы по ссылке.

С чего начать:
\`\`\`js
function autoBind(obj) {
  for (const key of Object.getOwnPropertyNames(obj)) {
    // ...
  }
  return obj;
}
\`\`\``,
    ],
    solutionCode: `function autoBind(obj) {
  for (const key of Object.getOwnPropertyNames(obj)) {
    if (typeof obj[key] === 'function') {
      obj[key] = obj[key].bind(obj);
    }
  }
  return obj;
}`,
    testHelperCode: `function autoBind_test(scenario) {
  if (scenario === 'extract-method') {
    const counter = { count: 0, inc() { this.count++; } };
    autoBind(counter);
    const f = counter.inc;
    f();
    return counter.count;
  }
  if (scenario === 'multi-call') {
    const counter = { count: 0, inc() { this.count++; }, dec() { this.count--; } };
    autoBind(counter);
    const inc = counter.inc;
    const dec = counter.dec;
    inc(); inc(); inc(); inc(); dec();
    return counter.count;
  }
  if (scenario === 'keep-data') {
    const obj = { name: 'Alice', age: 30, greet() { return 'hi'; } };
    autoBind(obj);
    return { name: obj.name, age: obj.age };
  }
  if (scenario === 'returns-self') {
    const obj = { fn() {} };
    return autoBind(obj) === obj;
  }
  if (scenario === 'skip-proto') {
    class Base { protoMethod() { return 'proto-untouched'; } }
    const child = new Base();
    child.ownMethod = function () { return 'own'; };
    const before = Base.prototype.protoMethod;
    autoBind(child);
    const after = Base.prototype.protoMethod;
    if (before !== after) return 'proto-modified';
    const m = child.protoMethod;
    return m.call(child);
  }
}`,
  },
  {
    id: 'jst-h4',
    topicId: 'js-this',
    kind: 'implement',
    title: 'Function.prototype.myApply — реализовать apply',
    difficulty: 'hard',
    isContextual: false,
    description: `Реализуйте метод \`Function.prototype.myApply(ctx, argsArray)\`, который ведёт себя как нативный \`Function.prototype.apply\`:

- вызывает функцию с \`this === ctx\` и аргументами из массива \`argsArray\`;
- возвращает результат вызова;
- если \`ctx\` равен \`null\` или \`undefined\` — в нестрогом режиме \`this\` стал бы глобальным объектом; для простоты считаем \`ctx = globalThis\`;
- если \`argsArray\` равен \`null\` или \`undefined\` — вызываем функцию без аргументов.

**Запрещено** использовать \`apply\`, \`call\` или \`bind\` внутри решения. Идея: временно положить функцию свойством на объект-контекст и вызвать через точку.

Хорошая задача на понимание того, что \`this\` определяется именно **способом вызова**, а не местом объявления функции.`,
    functionName: 'myApply_test',
    starterCode: `Function.prototype.myApply = function (ctx, argsArray) {
  // ваш код — без apply/call/bind
};`,
    testCases: [
      { id: 'jst-h4-t1', inputDisplay: "fn.myApply({name:'Alice'}, ['Hi']) → 'Hi, Alice'", inputArgs: ['basic'], expected: 'Hi, Alice' },
      { id: 'jst-h4-t2', inputDisplay: "argsArray undefined → вызов без аргументов", inputArgs: ['no-args'], expected: 'hello-undefined' },
      { id: 'jst-h4-t3', inputDisplay: "Math.max.myApply(null, [1,5,3]) → 5", inputArgs: ['math-max'], expected: 5 },
      { id: 'jst-h4-t4', inputDisplay: "результат возвращается", inputArgs: ['return-value'], expected: 42 },
      { id: 'jst-h4-t5', inputDisplay: "не оставляет следов в ctx (нет 'мусорного' свойства)", inputArgs: ['clean-ctx'], expected: true },
    ],
    hints: [
      "Без `call`/`apply` единственный способ получить нужный `this` — сделать функцию **методом** объекта-контекста, потому что вызов через точку устанавливает `this = объект слева`. Это надо сделать временно, чтобы не мусорить в `ctx`.",
      "Подготовьте target: если `ctx` это `null`/`undefined` — берите `globalThis`, иначе `Object(ctx)`. Положите `this` под уникальным ключом `Symbol()`. Вызовите `target[key](...(argsArray ?? []))`, сохраните результат, удалите ключ, верните результат.",
      `Главная идея — \`this\` устанавливается **способом вызова**. Вызов через точку даёт \`this = объект слева от точки\`, и это единственный способ «вручную» подсунуть контекст, когда \`call\`/\`apply\`/\`bind\` под запретом. Тонкость: \`ctx\` может оказаться примитивом (числом, строкой) — нативный \`apply\` оборачивает примитив через \`Object(ctx)\`, чтобы на нём можно было поставить временное свойство. Не забудьте \`delete\` после вызова, иначе \`ctx\` останется «загрязнённым» нашим символом — даже если этот ключ невидим в \`Object.keys\`, он всё равно мусор.

С чего начать:
\`\`\`js
Function.prototype.myApply = function (ctx, argsArray) {
  const target = (ctx === null || ctx === undefined) ? globalThis : Object(ctx);
  const key = Symbol('myApply');
  // ...
};
\`\`\``,
    ],
    solutionCode: `Function.prototype.myApply = function (ctx, argsArray) {
  const target = (ctx === null || ctx === undefined) ? globalThis : Object(ctx);
  const key = Symbol('myApply');
  target[key] = this;
  const args = argsArray ?? [];
  const result = target[key](...args);
  delete target[key];
  return result;
};`,
    testHelperCode: `function myApply_test(scenario) {
  if (scenario === 'basic') {
    function greet(g) { return g + ', ' + this.name; }
    return greet.myApply({ name: 'Alice' }, ['Hi']);
  }
  if (scenario === 'no-args') {
    function f() { return 'hello-' + (arguments[0] === undefined ? 'undefined' : 'defined'); }
    return f.myApply(null);
  }
  if (scenario === 'math-max') {
    return Math.max.myApply(null, [1, 5, 3]);
  }
  if (scenario === 'return-value') {
    return (function () { return 42; }).myApply(null);
  }
  if (scenario === 'clean-ctx') {
    const ctx = { name: 'X' };
    const before = Object.getOwnPropertyNames(ctx).length;
    (function () { return this.name; }).myApply(ctx, []);
    const after = Object.getOwnPropertyNames(ctx).length;
    return before === after;
  }
}`,
  },
];
