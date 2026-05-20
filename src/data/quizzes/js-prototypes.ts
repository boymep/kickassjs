import type { TopicQuiz } from '../../types/quiz';

export const jsPrototypesQuiz: TopicQuiz = {
  topicId: 'js-prototypes',
  questions: [
    {
      type: 'output',
      id: 'jsp-q1',
      description: 'Поиск свойства по цепочке прототипов. Что выведет код?',
      code: `const base = { type: 'base', greet() { return 'hello'; } };
const child = Object.create(base);
child.name = 'child';

console.log(child.name);
console.log(child.type);
console.log(child.greet());
console.log(child.hasOwnProperty('type'));`,
      options: ['"child", "base", "hello", false', '"child", "base", "hello", true', '"child", undefined, "hello", false', '"child", "child", "hello", false'],
      correctIndex: 0,
      explanation: 'child.name — собственное свойство: "child". child.type — ищется в прототипе (base): "base". child.greet() — ищется в прототипе: "hello". child.hasOwnProperty("type") — "type" не собственное свойство child: false.',
    },
    {
      type: 'output',
      id: 'jsp-q2',
      description: 'instanceof и цепочка. Что выведет код?',
      code: `class A {}
class B extends A {}
class C extends B {}

const c = new C();
console.log(c instanceof C);
console.log(c instanceof B);
console.log(c instanceof A);
console.log(c instanceof Object);`,
      options: ['true, true, true, true', 'true, false, false, true', 'true, true, false, true', 'true, true, true, false'],
      correctIndex: 0,
      explanation: 'instanceof проверяет всю цепочку прототипов. C extends B extends A extends Object. Экземпляр C является одновременно instanceof C, B, A и Object.',
    },
    {
      type: 'fill-blank',
      id: 'jsp-q3',
      description: 'Заполните пропуск для правильного наследования.',
      codeWithBlanks: `function Animal(name) { this.name = name; }
function Dog(name) { Animal.___BLANK___(this, name); }
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;`,
      options: ['call', 'apply', 'bind', 'prototype'],
      correctIndex: 0,
      explanation: '`Animal.call(this, name)` вызывает конструктор Animal с контекстом текущего создаваемого Dog-объекта. Это инициализирует свойства Animal (в данном случае `this.name`) в новом Dog-объекте.',
    },
    {
      type: 'output',
      id: 'jsp-q4',
      description: 'hasOwnProperty vs in. Что выведет код?',
      code: `const proto = { inherited: 42 };
const obj = Object.create(proto);
obj.own = 1;

console.log('own' in obj);
console.log('inherited' in obj);
console.log(obj.hasOwnProperty('own'));
console.log(obj.hasOwnProperty('inherited'));`,
      options: ['true, true, true, false', 'true, false, true, false', 'true, true, true, true', 'false, true, true, false'],
      correctIndex: 0,
      explanation: '`in` проверяет всю цепочку: "own" in obj = true (собственное), "inherited" in obj = true (в прото). `hasOwnProperty` только собственные: "own" = true, "inherited" = false (оно в прототипе).',
    },
    {
      type: 'output',
      id: 'jsp-q5',
      description: 'Мутация прототипа. Что выведет код?',
      code: `const proto = { x: 1 };
const obj = Object.create(proto);

proto.y = 2;
console.log(obj.y);

obj.x = 99;
console.log(obj.x);
console.log(proto.x);`,
      options: ['2, 99, 1', 'undefined, 99, 1', '2, 99, 99', 'undefined, undefined, 1'],
      correctIndex: 0,
      explanation: 'Прото — живая ссылка: добавление `proto.y = 2` после создания obj видно через obj.y = 2. Запись `obj.x = 99` создаёт **собственное** свойство x на obj, не изменяя прото. proto.x остаётся 1.',
    },
    {
      type: 'tracing',
      id: 'jsp-q6',
      description: 'Проследите поиск метода speak().',
      code: `function Animal() {}
Animal.prototype.speak = function() { return 'generic'; };

function Dog() {}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.speak = function() { return 'woof'; };

function Poodle() {}
Poodle.prototype = Object.create(Dog.prototype);

const p = new Poodle();
p.speak();`,
      steps: [
        { label: 'Ищем speak на экземпляре p', variables: { собственное: 'нет', 'p.__proto__': 'Poodle.prototype' } },
        { label: 'Ищем на Poodle.prototype', variables: { собственное: 'нет (только Object.create(Dog.proto))', следующий: 'Dog.prototype' } },
        { label: 'Ищем на Dog.prototype', variables: { найдено: 'speak = function() { return "woof"; }' } },
      ],
      question: 'Что вернёт p.speak()?',
      options: ['"woof"', '"generic"', '"Poodle"', 'undefined'],
      correctIndex: 0,
      explanation: 'Поиск по цепочке: p (нет) → Poodle.prototype (нет) → Dog.prototype (НАЙДЕНО: speak = "woof"). Animal.prototype.speak не используется, т.к. нашли раньше в Dog.prototype.',
    },
    {
      type: 'output',
      id: 'jsp-q7',
      description: 'class и прототипы. Что выведет код?',
      code: `class Animal {
  speak() { return 'generic'; }
}
class Dog extends Animal {
  speak() { return 'woof'; }
}

const dog = new Dog();
console.log(dog.speak());
console.log(dog instanceof Dog);
console.log(dog instanceof Animal);
console.log(typeof Dog);`,
      options: ['"woof", true, true, "function"', '"woof", true, false, "class"', '"generic", true, true, "function"', '"woof", true, true, "object"'],
      correctIndex: 0,
      explanation: 'class — синтаксический сахар. Dog — это функция (typeof Dog = "function"). dog.speak() = "woof" (собственный метод в Dog.prototype). dog instanceof Dog = true, instanceof Animal = true (через цепочку).',
    },
    {
      type: 'fill-blank',
      id: 'jsp-q8',
      description: 'Заполните пропуск для безопасной итерации собственных свойств.',
      codeWithBlanks: `const obj = Object.create({ inherited: true });
obj.a = 1;
obj.b = 2;

for (const key in obj) {
  if (Object.___BLANK___(obj, key)) {
    console.log(key);
  }
}
// Выведет только 'a' и 'b'`,
      options: ['hasOwn', 'hasOwnProperty', 'getOwnProperty', 'isOwn'],
      correctIndex: 0,
      explanation: '`Object.hasOwn(obj, key)` — современный способ (ES2022), аналог `obj.hasOwnProperty(key)`. Оба проверяют, является ли свойство собственным (не унаследованным). `Object.hasOwn` предпочтительнее, так как работает даже если hasOwnProperty переопределён.',
    },
    {
      type: 'output',
      id: 'jsp-q9',
      description: 'Object.create(null). Что выведет код?',
      code: `const obj = Object.create(null);
obj.x = 1;

console.log(obj.x);
console.log(Object.getPrototypeOf(obj));
console.log(typeof obj.toString);`,
      options: ['1, null, "undefined"', '1, null, "function"', 'undefined, null, "undefined"', '1, Object.prototype, "function"'],
      correctIndex: 0,
      explanation: '`Object.create(null)` создаёт объект **без прототипа**. Нет ни hasOwnProperty, ни toString, ни других методов Object.prototype. `Object.getPrototypeOf(obj) === null`. `typeof obj.toString === "undefined"` (метода нет).',
    },
    {
      type: 'output',
      id: 'jsp-q10',
      description: 'super в наследовании. Что выведет код?',
      code: `class Shape {
  constructor(color) { this.color = color; }
  describe() { return \`\${this.color} shape\`; }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }
  describe() {
    return \`\${super.describe()} with radius \${this.radius}\`;
  }
}

console.log(new Circle('red', 5).describe());`,
      options: ['"red shape with radius 5"', '"red shape"', '"shape with radius 5"', 'TypeError'],
      correctIndex: 0,
      explanation: '`super(color)` вызывает конструктор Shape, устанавливает `this.color`. `super.describe()` вызывает `Shape.prototype.describe()` с текущим `this`. Результат: "red shape". Затем добавляется " with radius 5". Итого: "red shape with radius 5".',
    },
    {
      type: 'output',
      id: 'jsp-q11',
      description: 'constructor после изменения prototype. Что выведет код?',
      code: `function Foo() {}
Foo.prototype = { bar: 1 };

const f = new Foo();
console.log(f.constructor === Foo);
console.log(f.constructor === Object);`,
      options: ['false и true', 'true и false', 'true и true', 'false и false'],
      correctIndex: 0,
      explanation: 'При замене `Foo.prototype` на новый объект, новый объект наследует `constructor` от `Object.prototype` (которое указывает на `Object`). Связь `Foo.prototype.constructor → Foo` потеряна. Нужно явно восстановить: `Foo.prototype.constructor = Foo`.',
    },
    {
      type: 'complexity',
      id: 'jsp-q12',
      description: 'Какова сложность myInstanceof?',
      code: `function myInstanceof(obj, Constructor) {
  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {
    if (proto === Constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}`,
      options: ['O(d) где d — глубина цепочки прототипов', 'O(1)', 'O(n) где n — количество свойств', 'O(log n)'],
      correctIndex: 0,
      explanation: 'Сложность зависит от глубины цепочки прототипов (d). В среднем d ≈ 3-5 (объект → прото → Object.prototype → null). На практике это O(1), но формально O(d).',
    },
  ],
};
