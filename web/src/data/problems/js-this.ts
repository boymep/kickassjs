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
];
