import type { TopicTheory } from '../../types/topic';

export const jsPrototypesTheory: TopicTheory = {
  topicId: 'js-prototypes',
  sections: [
    {
      title: 'Цепочка прототипов',
      blocks: [
        {
          type: 'text',
          content:
            'В JavaScript каждый объект имеет скрытое свойство `[[Prototype]]` (доступное через `__proto__` или `Object.getPrototypeOf()`). При поиске свойства JS сначала ищет на самом объекте, затем поднимается по цепочке прототипов.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const animal = {
  breathe() { return 'breathing'; }
};

const dog = {
  bark() { return 'woof'; }
};

// Установить прототип:
Object.setPrototypeOf(dog, animal);
// Или при создании:
const dog2 = Object.create(animal);

dog.bark();    // 'woof' — собственный метод
dog.breathe(); // 'breathing' — из прототипа (animal)

// Проверка:
dog.hasOwnProperty('bark');    // true
dog.hasOwnProperty('breathe'); // false — это в прототипе`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Цепочка прототипов до Object.prototype:
const arr = [1, 2, 3];
// arr → Array.prototype → Object.prototype → null

arr.push(4);           // Array.prototype.push
arr.hasOwnProperty(0); // Object.prototype.hasOwnProperty

// Конец цепочки:
Object.getPrototypeOf(Object.prototype); // null`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Разница: `obj.__proto__` — это свойство (устаревшее, избегайте). `Object.getPrototypeOf(obj)` — стандартный метод. `Constructor.prototype` — объект, используемый как прототип для экземпляров, создаваемых через `new`.',
        },
        {
          type: 'visualization',
          content: '', vizId: 'prototype-chain',
        },
      ],
    },
    {
      title: 'Object.create и наследование без классов',
      blocks: [
        {
          type: 'code',
          language: 'javascript',
          content: `// Object.create(proto) — создаёт объект с заданным прототипом
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return \`\${this.name} издаёт звук\`;
};

function Dog(name, breed) {
  Animal.call(this, name); // вызвать конструктор родителя
  this.breed = breed;
}

// Установить прототипную цепочку:
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog; // восстановить constructor

Dog.prototype.bark = function() {
  return \`\${this.name} лает!\`;
};

const rex = new Dog('Rex', 'Husky');
rex.bark();    // 'Rex лает!'
rex.speak();   // 'Rex издаёт звук' — из Animal.prototype
rex instanceof Dog;    // true
rex instanceof Animal; // true`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'ES6 `class` — это синтаксический сахар над прототипным наследованием. `class Dog extends Animal` делает именно то, что показано выше, но читается чище.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// То же самое с class:
class Animal {
  constructor(name) { this.name = name; }
  speak() { return \`\${this.name} издаёт звук\`; }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // = Animal.call(this, name)
    this.breed = breed;
  }
  bark() { return \`\${this.name} лает!\`; }
}`,
        },
      ],
    },
    {
      title: 'instanceof и hasOwnProperty',
      blocks: [
        {
          type: 'code',
          language: 'javascript',
          content: `// instanceof проверяет цепочку прототипов
const arr = [];
arr instanceof Array;   // true
arr instanceof Object;  // true (Array.prototype → Object.prototype)
arr instanceof String;  // false

// Как работает instanceof:
function myInstanceof(obj, Constructor) {
  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {
    if (proto === Constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

myInstanceof(arr, Array);   // true
myInstanceof(arr, Object);  // true
myInstanceof(arr, String);  // false`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// hasOwnProperty — только собственные свойства
const obj = Object.create({ inherited: true });
obj.own = 1;

obj.hasOwnProperty('own');       // true
obj.hasOwnProperty('inherited'); // false — оно в прототипе
'inherited' in obj;              // true — in проверяет всю цепочку

// Безопасный перебор только собственных свойств:
for (const key in obj) {
  if (Object.hasOwn(obj, key)) { // современный способ
    console.log(key, obj[key]);
  }
}`,
        },
      ],
    },
    {
      title: 'class — синтаксический сахар над прототипами',
      blocks: [
        {
          type: 'text',
          content:
            '`class` в JS — это **синтаксический сахар** над прототипным наследованием. Под капотом всё те же функции-конструкторы и `prototype`. Важно понимать разницу.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Эти записи — идентичны под капотом:

// ES6 class:
class Animal {
  constructor(name) { this.name = name; }
  speak() { return \`\${this.name} говорит\`; }
}

// До ES6:
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return \`\${this.name} говорит\`; };

// Проверяем:
typeof Animal; // 'function' — class это всё равно функция!
Animal.prototype.speak; // функция на прототипе

// НО! class имеет важные отличия:
// 1. Нельзя вызвать без new (TypeError)
// 2. Не всплывает (hoisting) как обычные функции
// 3. Тело класса в strict mode автоматически`,
        },
        {
          type: 'heading',
          content: 'static методы и свойства',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `class MathHelper {
  static PI = 3.14159; // статическое свойство — на классе, не на экземпляре

  static square(n) { return n * n; } // статический метод

  instance() { return 'я на прототипе'; }
}

MathHelper.PI;         // 3.14159 — доступно через класс
MathHelper.square(4);  // 16 — доступно через класс

const m = new MathHelper();
m.PI;     // undefined — не наследуется экземплярами!
m.square; // undefined — тоже не наследуется

// static — это свойства самого объекта-конструктора, не прототипа:
Object.getOwnPropertyNames(MathHelper); // ['length', 'name', 'PI', 'square']`,
        },
        {
          type: 'heading',
          content: 'Приватные поля (ES2022)',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `class BankAccount {
  #balance = 0; // приватное поле — с #

  deposit(amount) {
    if (amount > 0) this.#balance += amount;
  }

  get balance() { return this.#balance; }
}

const acc = new BankAccount();
acc.deposit(100);
acc.balance;  // 100 — через геттер
acc.#balance; // SyntaxError — нет доступа снаружи!

// Отличие от замыканий: # fields живут на экземпляре,
// не в замкнутом scope. Работают с instanceof корректно.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Приватные `#field` — настоящая инкапсуляция в JS. В отличие от `_convention`, это жёсткое ограничение движка. Доступны с Node.js 12+ и в современных браузерах.',
        },
      ],
    },
    {
      title: 'Расширение встроенных объектов',
      blocks: [
        {
          type: 'text',
          content:
            'Можно добавлять методы в прототипы встроенных объектов, но делайте это осторожно — это может сломать сторонний код.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ⚠️ Расширение прототипа (осторожно в production!)
Array.prototype.sum = function() {
  return this.reduce((acc, n) => acc + n, 0);
};

[1, 2, 3, 4].sum(); // 10

// Более безопасно — через Symbol или отдельную функцию:
const sumSymbol = Symbol('sum');
Array.prototype[sumSymbol] = function() {
  return this.reduce((acc, n) => acc + n, 0);
};

// ✅ Предпочтительный паттерн — миксины:
const Serializable = {
  serialize() { return JSON.stringify(this); },
  deserialize: JSON.parse,
};

class Config {
  constructor(data) { Object.assign(this, data); }
}
Object.assign(Config.prototype, Serializable);`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Не расширяйте `Object.prototype` — это сломает `for...in` циклы по всем объектам. Расширение Array.prototype безопаснее, но может конфликтовать с будущими стандартными методами.',
        },
      ],
    },
  ],
};
