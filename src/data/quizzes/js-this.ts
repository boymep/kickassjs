import type { TopicQuiz } from '../../types/quiz';

export const jsThisQuiz: TopicQuiz = {
  topicId: 'js-this',
  questions: [
    {
      type: 'output',
      id: 'jst-q1',
      description: 'Потеря контекста. Что выведет код?',
      code: `const obj = {
  name: 'Alice',
  greet() {
    console.log(this.name);
  }
};

const fn = obj.greet;
fn();`,
      options: ['Alice', 'undefined', 'ReferenceError', 'null'],
      correctIndex: 1,
      explanation:
        'При присвоении `const fn = obj.greet` происходит "потеря контекста". Теперь `fn` — это просто ссылка на функцию без привязки к `obj`. При вызове `fn()` применяется default binding: в strict mode `this = undefined`, в non-strict `this = window`. `window.name` — пустая строка или undefined.',
    },
    {
      type: 'output',
      id: 'jst-q2',
      description: 'Стрелочная функция как метод объекта. Что выведет код?',
      code: `const obj = {
  name: 'Alice',
  greet: () => {
    console.log(this.name);
  }
};

obj.greet();`,
      options: ['Alice', 'undefined', 'ReferenceError', 'obj'],
      correctIndex: 1,
      explanation:
        'Стрелочная функция **не имеет собственного `this`**. Она захватывает `this` из лексического контекста — из того места, где она **написана**. В данном случае это глобальный контекст (или undefined в strict mode), а не `obj`. Вывод: undefined (или window.name).',
    },
    {
      type: 'output',
      id: 'jst-q3',
      description: 'call и this. Что выведет код?',
      code: `function sayAge() {
  console.log(this.age);
}

const person1 = { age: 25 };
const person2 = { age: 30 };

sayAge.call(person1);
sayAge.call(person2);`,
      options: ['25 и 30', 'undefined и undefined', '25 и 25', 'ReferenceError'],
      correctIndex: 0,
      explanation:
        '`call` явно устанавливает `this`. `sayAge.call(person1)` → `this = person1` → `this.age = 25`. `sayAge.call(person2)` → `this = person2` → `this.age = 30`.',
    },
    {
      type: 'fill-blank',
      id: 'jst-q4',
      description: 'Исправьте потерю контекста в обработчике события.',
      codeWithBlanks: `class Counter {
  constructor() {
    this.count = 0;
    this.increment = this.increment.___BLANK___(this);
  }
  increment() { this.count++; }
}`,
      options: ['bind', 'call', 'apply', 'connect'],
      correctIndex: 0,
      explanation:
        '`bind(this)` создаёт новую функцию с жёстко привязанным `this`. Теперь `this.increment` — всегда вызывает оригинальный `increment` с `this = экземпляр Counter`. Это стандартный паттерн React-компонентов до появления стрелочных функций-полей класса.',
    },
    {
      type: 'output',
      id: 'jst-q5',
      description: 'this внутри forEach. Что выведет код?',
      code: `'use strict';

const obj = {
  values: [1, 2, 3],
  sum: 0,
  calculate() {
    this.values.forEach(function(v) {
      this.sum += v;
    });
    return this.sum;
  }
};

console.log(obj.calculate());`,
      options: ['6', '0', 'NaN', 'TypeError'],
      correctIndex: 3,
      explanation:
        'В strict mode `this` внутри обычной функции-callback — `undefined`, поэтому обращение к `this.sum` бросает TypeError. В non-strict mode было бы `NaN` (`this` стало бы `window`). Решение: стрелочная функция, `thisArg` как второй аргумент forEach, или `const self = this`.',
    },
    {
      type: 'output',
      id: 'jst-q6',
      description: 'bind и приоритет. Что выведет код?',
      code: `function greet() {
  return this.name;
}

const alice = greet.bind({ name: 'Alice' });
const bob = alice.bind({ name: 'Bob' }); // bind уже забинденной функции

console.log(alice());
console.log(bob());`,
      options: ['Alice и Bob', 'Alice и Alice', 'Bob и Bob', 'undefined и undefined'],
      correctIndex: 1,
      explanation:
        'Повторный `bind` на уже забинденную функцию **не меняет** `this`. `bind` создаёт функцию, у которой `this` зафиксирован навсегда. `bob` всё равно будет вызывать функцию с `this = { name: "Alice" }`. Оба вызова возвращают "Alice".',
    },
    {
      type: 'tracing',
      id: 'jst-q7',
      description: 'Проследите значение this при разных вызовах.',
      code: `function show() {
  return this.x;
}

const a = { x: 1, show };
const b = { x: 2, show };
const c = { x: 3 };

a.show();          // call 1
b.show();          // call 2
show.call(c);      // call 3
show.bind(a)();    // call 4`,
      steps: [
        { label: 'a.show() — implicit binding', variables: { this: 'a', 'this.x': 1 } },
        { label: 'b.show() — implicit binding', variables: { this: 'b', 'this.x': 2 } },
        { label: 'show.call(c) — explicit binding', variables: { this: 'c', 'this.x': 3 } },
        { label: 'show.bind(a)() — explicit binding', variables: { this: 'a (bind)', 'this.x': 1 } },
      ],
      question: 'Каков порядок возвращаемых значений?',
      options: ['1, 2, 3, 1', '1, 2, 3, 3', '2, 1, 3, 2', '1, 1, 1, 1'],
      correctIndex: 0,
      explanation:
        'a.show() → this=a → 1. b.show() → this=b → 2. show.call(c) → this=c → 3. show.bind(a)() → this=a (bind зафиксировал) → 1. Итог: 1, 2, 3, 1.',
    },
    {
      type: 'output',
      id: 'jst-q8',
      description: 'new vs явная привязка. Что выведет код?',
      code: `function Person(name) {
  this.name = name;
}

const alice = new Person('Alice');
const bob = Person.call({ name: 'exists' }, 'Bob');

console.log(alice.name);
console.log(bob);`,
      options: ['Alice и undefined', 'Alice и {name: "Bob"}', 'Bob и Alice', 'undefined и undefined'],
      correctIndex: 0,
      explanation:
        '`new Person("Alice")` → создаётся новый объект, `this.name = "Alice"`, функция возвращает объект. `alice.name = "Alice"`. `Person.call({}, "Bob")` → this = переданный объект, `this.name = "Bob"`, но функция не возвращает объект явно → `bob = undefined`. Переданный объект модифицирован, но `bob` не содержит его.',
    },
    {
      type: 'output',
      id: 'jst-q9',
      description: 'Стрелочная функция в методе. Что выведет код?',
      code: `const obj = {
  name: 'obj',
  regular() {
    const arrow = () => this.name;
    return arrow();
  },
  outer: function() {
    const arrow = () => this.name;
    return arrow();
  }
};

console.log(obj.regular());
console.log(obj.outer());`,
      options: ['obj и obj', 'undefined и undefined', 'obj и undefined', 'undefined и obj'],
      correctIndex: 0,
      explanation:
        'В обоих случаях стрелочная функция захватывает `this` из **окружающей функции** (лексический this). И `regular`, и `outer` вызываются как методы `obj`, поэтому внутри них `this = obj`. Стрелочные `arrow` наследуют этот `this`. Оба вернут "obj".',
    },
    {
      type: 'fill-blank',
      id: 'jst-q10',
      description: 'Заполните пропуск для реализации myNew.',
      codeWithBlanks: `function myNew(Constructor, ...args) {
  const obj = Object.create(___BLANK___);
  const result = Constructor.apply(obj, args);
  return (result && typeof result === 'object') ? result : obj;
}`,
      options: ['Constructor.prototype', 'Constructor', 'Object.prototype', 'null'],
      correctIndex: 0,
      explanation:
        '`Object.create(Constructor.prototype)` создаёт объект, чья цепочка прототипов ведёт к `Constructor.prototype`. Это воспроизводит поведение `new` — созданный объект "является" экземпляром Constructor (instanceof вернёт true).',
    },
    {
      type: 'output',
      id: 'jst-q11',
      description: 'apply с массивом аргументов. Что выведет код?',
      code: `function sum(...nums) {
  return nums.reduce((acc, n) => acc + this.start + n, 0);
}

const config = { start: 10 };
const numbers = [1, 2, 3];

console.log(sum.apply(config, numbers));`,
      options: ['36', '6', '16', 'NaN'],
      correctIndex: 0,
      explanation:
        '`apply(config, [1,2,3])` → this = config, аргументы = 1, 2, 3. reduce: acc=0, 0 + 10 + 1 = 11; acc=11, 11 + 10 + 2 = 23; acc=23, 23 + 10 + 3 = 36. Итого: 36.',
    },
    {
      type: 'output',
      id: 'jst-q12',
      description: 'Цепочка вызовов и this. Что выведет код?',
      code: `class Builder {
  constructor() { this.parts = []; }
  add(part) { this.parts.push(part); return this; }
  build() { return this.parts.join('-'); }
}

const result = new Builder()
  .add('a')
  .add('b')
  .add('c')
  .build();

console.log(result);`,
      options: ['a-b-c', 'abc', '[a,b,c]', 'undefined'],
      correctIndex: 0,
      explanation:
        'Каждый метод `add` возвращает `this` — экземпляр Builder. Это позволяет цепочку вызовов. Последовательно добавляются "a", "b", "c" в массив `parts`. `build()` возвращает `["a","b","c"].join("-")` = "a-b-c".',
    },
  ],
};
