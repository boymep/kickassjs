import type { Lesson } from '../../types/lesson';
import { jsPrototypesQuiz } from '../quizzes/js-prototypes';

const Q = Object.fromEntries(jsPrototypesQuiz.questions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set(['jsp-q1', 'jsp-q4', 'jsp-q5', 'jsp-q7', 'jsp-q10', 'jsp-q11']);

export const jsPrototypesLesson: Lesson = {
  topicId: 'js-prototypes',

  intro: {
    whyItMatters: `Прототипы — основа объектной модели JavaScript. У каждого объекта есть скрытая ссылка \`[[Prototype]]\` на другой объект. Когда выполняется \`arr.map(...)\` или \`'hello'.toUpperCase()\`, движок не находит метод на самом значении: он поднимается по цепочке прототипов до \`Array.prototype\` или \`String.prototype\`.

Ключевое слово \`class\` (ES2015) — синтаксический сахар над функциями-конструкторами и \`prototype\`. \`class Dog extends Animal\` под капотом устанавливает \`Dog.prototype.[[Prototype]] = Animal.prototype\`. Понимание этого превращает «магию» классов в простую цепочку ссылок.`,
    estimatedMinutes: 30,
    interviewAngle:
      'Интервьюера интересуют конкретные вещи: как работает поиск свойства, что делает \`new\` под капотом, чем \`class\` отличается от function-конструктора, как реализовать наследование без \`class\` и как работает \`instanceof\`.',
    prerequisites: [{ slug: 'js-this', title: 'this и контекст' }],
  },

  chapters: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'prototype-chain',
      title: 'Цепочка прототипов',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'У каждого объекта в JavaScript есть скрытая ссылка \`[[Prototype]]\` на другой объект. При обращении к свойству движок ищет его сначала на самом объекте, затем на \`[[Prototype]]\`, затем на прототипе прототипа — вплоть до \`null\`. Это и есть **цепочка прототипов** — фундамент всей объектной модели JS.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const animal = {
  breathe() { return 'дышу'; },
};

const dog = Object.create(animal);
dog.bark = () => 'гав';

dog.bark();    // 'гав' — собственный метод
dog.breathe(); // 'дышу' — найден в прототипе animal

// Цепочка: dog → animal → Object.prototype → null
Object.getPrototypeOf(dog) === animal;              // true
Object.getPrototypeOf(animal) === Object.prototype; // true
Object.getPrototypeOf(Object.prototype) === null;   // true`,
        },
        {
          type: 'visualization',
          content: '',
          vizId: 'prototype-chain',
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Прототип — живая ссылка, а не копия. Если добавить свойство в \`animal\` после создания \`dog\`, оно мгновенно станет видно через \`dog\`.',
        },
        { type: 'heading', content: 'Почему это важно для встроенных типов' },
        {
          type: 'code',
          language: 'javascript',
          content: `const arr = [1, 2, 3];

// arr → Array.prototype → Object.prototype → null
arr.push(4);              // метод живёт на Array.prototype
arr.hasOwnProperty(0);    // метод живёт на Object.prototype
arr.toString();           // Array.prototype переопределяет Object.prototype.toString

// Метод map не существует на самом массиве:
arr.hasOwnProperty('map'); // false
'map' in arr;              // true — оператор in идёт по цепочке`,
        },
        {
          type: 'text',
          content:
            'Это объясняет «магию» массивов и строк: методы не дублируются в каждом экземпляре, а живут централизованно на \`Array.prototype\` и \`String.prototype\`. Поэтому \`arr.map(fn)\` и \`[].map.call(arrayLike, fn)\` — это вызов одной и той же функции с разным \`this\`.',
        },
      ],
      checkpoint: [Q['jsp-q1']!, Q['jsp-q5']!, {
        type: 'ordering',
        id: 'jsp-ord1',
        description: 'Расставьте шаги поиска свойства по цепочке прототипов',
        items: [
          'Проверить собственные свойства объекта',
          'Перейти к [[Prototype]] объекта',
          'Повторять, пока не найдено или [[Prototype]] === null',
          'Вернуть undefined, если не нашли',
        ],
        explanation:
          'JavaScript ищет свойство сначала на самом объекте, затем поднимается по цепочке прототипов через \`[[Prototype]]\`. Цепочка заканчивается на \`Object.prototype\` — у него \`[[Prototype]] === null\`.',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'object-create-and-inheritance',
      title: 'Object.create и наследование без class',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            '\`Object.create(proto)\` — самый прямой способ создать объект с заданным прототипом. До появления \`class\` в ES2015 всё наследование строилось именно так. На собеседовании могут попросить реализовать наследование без \`class\` — это проверяет понимание прототипов под капотом.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return \`\${this.name} издаёт звук\`;
};

function Dog(name, breed) {
  Animal.call(this, name); // вызвать конструктор родителя
  this.breed = breed;
}

// Установить прототипную цепочку
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog; // восстановить ссылку на конструктор

Dog.prototype.bark = function () {
  return \`\${this.name} лает\`;
};

const rex = new Dog('Rex', 'Husky');
rex.bark();             // 'Rex лает'
rex.speak();            // 'Rex издаёт звук'
rex instanceof Dog;     // true
rex instanceof Animal;  // true`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Три обязательных шага наследования без \`class\`: (1) \`Parent.call(this, ...)\` в конструкторе ребёнка; (2) \`Child.prototype = Object.create(Parent.prototype)\`; (3) \`Child.prototype.constructor = Child\`. Пропуск любого шага ломает либо инициализацию полей, либо \`instanceof\`, либо \`f.constructor\`.',
        },
        { type: 'heading', content: 'Object.create(null) — словарь без прототипа' },
        {
          type: 'code',
          language: 'javascript',
          content: `const dict = Object.create(null);

dict.toString = 'строка'; // безопасно: нет коллизии с Object.prototype.toString
dict.hasOwnProperty;       // undefined — метода нет

// Сравните с обычным {}
const normal = {};
normal.toString;           // [Function: toString] — унаследован
'toString' in normal;      // true

// При итерации можно не фильтровать прототипные ключи
for (const key in dict) {
  // только собственные ключи
}`,
        },
        {
          type: 'text',
          content:
            'Шаблон \`Object.create(null)\` часто используют в библиотеках для безопасного хранения произвольных ключей: маршрутизаторы, кеши, парсеры JSON. Это исключает класс уязвимостей prototype pollution.',
        },
      ],
      playground: {
        starterCode: `// Реализуйте прототипное наследование без class.
// rex.bark() должен вернуть 'Rex лает', а rex.speak() — 'Rex издаёт звук'.

function Animal(name) {
  this.name = name;
}
// добавьте Animal.prototype.speak

function Dog(name) {
  // вызовите конструктор Animal
}
// настройте Dog.prototype через Object.create
// добавьте Dog.prototype.bark

const rex = new Dog('Rex');
console.log(rex.bark());
console.log(rex.speak());`,
        expectedOutput: 'Rex лает\nRex издаёт звук',
        description:
          'Используйте \`Animal.call(this, name)\`, \`Object.create(Animal.prototype)\` и восстановите \`constructor\`.',
      },
      checkpoint: [Q['jsp-q4']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'class-as-sugar',
      title: 'class как синтаксический сахар',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Синтаксис \`class\` появился в ES2015 — это синтаксический сахар над прототипным наследованием. \`typeof MyClass\` возвращает \`"function"\`, а методы класса попадают на \`MyClass.prototype\`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ES2015 class
class Animal {
  constructor(name) { this.name = name; }
  speak() { return \`\${this.name} говорит\`; }
}

// Эквивалент через function
function AnimalLegacy(name) { this.name = name; }
AnimalLegacy.prototype.speak = function () {
  return \`\${this.name} говорит\`;
};

typeof Animal;             // 'function'
Animal.prototype.speak;    // [Function: speak]
new Animal('Кот').speak(); // 'Кот говорит'`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Различия \`class\` и function-конструктора: (1) \`class\` нельзя вызвать без \`new\` — \`Animal()\` бросит TypeError; (2) \`class\` не всплывает — обращение до объявления даст ReferenceError; (3) тело \`class\` выполняется в strict mode; (4) методы класса non-enumerable.',
        },
        { type: 'heading', content: 'extends в терминах прототипов' },
        {
          type: 'code',
          language: 'javascript',
          content: `class Animal {
  speak() { return 'generic'; }
}
class Dog extends Animal {
  speak() {
    return super.speak() + ' → woof';
  }
}

// Под капотом extends делает:
// 1) Dog.prototype.[[Prototype]] = Animal.prototype   — наследование методов экземпляра
// 2) Dog.[[Prototype]] = Animal                        — наследование статических методов
Object.getPrototypeOf(Dog.prototype) === Animal.prototype; // true
Object.getPrototypeOf(Dog) === Animal;                     // true`,
        },
        { type: 'heading', content: 'Приватные поля и static' },
        {
          type: 'code',
          language: 'javascript',
          content: `class BankAccount {
  #balance = 0;            // приватное поле (ES2022)
  static MAX = 1_000_000;  // static — на самом классе, не на прототипе

  deposit(amount) {
    if (amount > 0 && this.#balance + amount <= BankAccount.MAX) {
      this.#balance += amount;
    }
  }
  get balance() { return this.#balance; }
}

const acc = new BankAccount();
acc.deposit(100);
acc.balance;            // 100
BankAccount.MAX;        // 1000000
new BankAccount().MAX;  // undefined — static не наследуется экземплярами`,
        },
      ],
      checkpoint: [Q['jsp-q7']!, Q['jsp-q10']!, {
        type: 'match-pairs',
        id: 'jsp-mp1',
        description: 'Сопоставьте метод с его действием',
        pairs: [
          { left: 'Object.create(proto)', right: 'Создаёт объект с заданным прототипом' },
          { left: 'Object.assign(target, src)', right: 'Копирует собственные перечисляемые свойства' },
          { left: 'Object.hasOwn(obj, key)', right: 'Проверяет, что свойство принадлежит самому объекту' },
          { left: 'Object.getPrototypeOf(obj)', right: 'Возвращает [[Prototype]] объекта' },
        ],
        explanation:
          'Это основной инструментарий для работы с цепочкой прототипов. \`Object.create\` — единственный способ явно задать прототип при создании. \`hasOwn\` критичен при итерации, чтобы не захватить унаследованные свойства.',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'instanceof-and-checks',
      title: 'instanceof, hasOwn, in',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            '\`instanceof\` проверяет наличие \`Constructor.prototype\` в цепочке прототипов объекта. Сам объект-конструктор не проверяется.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Реализация instanceof в пользовательском коде
function myInstanceof(obj, Constructor) {
  if (obj === null || obj === undefined) return false;
  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {
    if (proto === Constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

myInstanceof([], Array);   // true
myInstanceof([], Object);  // true — Array.prototype → Object.prototype
myInstanceof([], String);  // false`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '\`instanceof\` ломается между разными realm (iframe, worker): у каждого realm свой \`Array.prototype\`. Массив из iframe не будет \`instanceof Array\` для родительского окна. Решение — \`Array.isArray()\` или \`Object.prototype.toString.call(value)\`.',
        },
        { type: 'heading', content: 'hasOwn vs hasOwnProperty vs in' },
        {
          type: 'code',
          language: 'javascript',
          content: `const proto = { inherited: 1 };
const obj = Object.create(proto);
obj.own = 2;

obj.hasOwnProperty('own');         // true  — собственное
obj.hasOwnProperty('inherited');   // false — в прототипе
'own' in obj;                      // true
'inherited' in obj;                // true  — in идёт по цепочке

// ES2022: безопасный современный аналог
Object.hasOwn(obj, 'own');         // true
Object.hasOwn(obj, 'inherited');   // false

// hasOwnProperty можно «затереть»:
const evil = { hasOwnProperty: () => true };
evil.hasOwnProperty('foo');        // true — но 'foo' не существует
Object.hasOwn(evil, 'foo');        // false — корректно`,
        },
        {
          type: 'list',
          content: `\`Object.hasOwn(obj, key)\` — современный безопасный способ проверки собственного свойства.
\`'key' in obj\` — проверка наличия с учётом цепочки прототипов.
\`Object.keys(obj)\` — список собственных enumerable-свойств.
\`for...in\` перебирает все enumerable, включая прототипные — фильтровать через \`Object.hasOwn\`.`,
        },
      ],
      checkpoint: [Q['jsp-q11']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'pitfalls',
      title: 'Подводные камни',
      estimatedMinutes: 5,
      blocks: [
        { type: 'heading', content: 'Потеря constructor при замене prototype' },
        {
          type: 'code',
          language: 'javascript',
          content: `function Foo() {}
// Полная замена прототипа стирает связь с Foo
Foo.prototype = { bar: 1 };

const f = new Foo();
f.constructor === Foo;     // false
f.constructor === Object;  // true — наследуется от Object.prototype

// Правильно: добавлять методы, а не заменять весь объект
Foo.prototype.bar = 1;

// Или явно восстановить:
Foo.prototype = { bar: 1, constructor: Foo };`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'При ручной реализации наследования через \`Object.create(Parent.prototype)\` нужно восстанавливать \`Child.prototype.constructor = Child\`, иначе \`new Child().constructor\` будет указывать на \`Parent\`.',
        },
        { type: 'heading', content: 'Расширение нативных прототипов' },
        {
          type: 'code',
          language: 'javascript',
          content: `// АНТИПАТТЕРН: monkey-patching Array.prototype
Array.prototype.last = function () {
  return this[this.length - 1];
};

[1, 2, 3].last(); // 3 — работает...

// ...но создаёт проблемы:
// 1) Поле попадает в for...in циклах по массивам (если enumerable)
// 2) Конфликт с будущими стандартными методами (.at появился в ES2022)
// 3) Конфликт с другими библиотеками

// Альтернативы:
const last = (arr) => arr[arr.length - 1]; // утилита
last([1, 2, 3]);`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '\`Object.prototype\` расширять не следует: добавленное свойство станет видно во всех объектах программы и в каждом цикле \`for...in\`. Это ломает любой код, который не фильтрует через \`Object.hasOwn\`.',
        },
        { type: 'heading', content: 'Стрелочные функции как поле класса' },
        {
          type: 'code',
          language: 'javascript',
          content: `class Foo {
  // Стрелочная функция как поле класса — НЕ метод прототипа
  arrow = () => 'arrow';

  // Обычный метод — попадает на Foo.prototype
  normal() { return 'normal'; }
}

const f = new Foo();
Object.getPrototypeOf(f).normal; // [Function: normal] — на прототипе
Object.getPrototypeOf(f).arrow;  // undefined — arrow создан на экземпляре

// Каждый экземпляр получает свою копию arrow → больше памяти.
// Зато this всегда привязан к экземпляру лексически.`,
        },
      ],
    },
  ],

  finalQuiz: jsPrototypesQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  cheatsheet: `### Шпаргалка по прототипам

**Цепочка прототипов**
- У каждого объекта есть скрытая ссылка \`[[Prototype]]\` на другой объект
- Поиск свойства идёт: собственные → \`[[Prototype]]\` → \`[[Prototype]]\` прототипа → \`null\`
- \`Array.prototype.map\` живёт на \`Array.prototype\`, а не на каждом массиве

**Object.create**
\`\`\`js
const child = Object.create(parent);
// child.[[Prototype]] === parent

const dict = Object.create(null);
// безопасный словарь без Object.prototype
\`\`\`

**Наследование без class**
\`\`\`js
function Child(...args) {
  Parent.call(this, ...args);
}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
\`\`\`

**class — это сахар**
- \`typeof MyClass === 'function'\`
- Методы попадают на \`MyClass.prototype\`
- \`extends\` устанавливает прототипы и для методов экземпляра, и для статических
- \`super.method()\` вызывается с \`this\` = экземпляр подкласса
- Тело класса всегда в strict mode

**Проверки**
- \`Object.hasOwn(obj, key)\` — собственное свойство (ES2022)
- \`'key' in obj\` — с учётом прототипов
- \`obj instanceof Constructor\` — \`Constructor.prototype\` в цепочке
- \`Array.isArray(value)\` — надёжнее \`instanceof Array\` между realm

**Подводные камни**
- Замена \`prototype\` целиком стирает \`constructor\` — нужно восстанавливать
- Расширение \`Array.prototype\` / \`Object.prototype\` конфликтует с библиотеками и будущими стандартами
- Стрелочная функция как поле класса не попадает на прототип — копия в каждом экземпляре
- \`instanceof\` ломается между iframe / worker — используйте \`isArray\` или \`toString.call\``,

  nextTopics: [
    {
      slug: 'js-this',
      reason:
        '\`this\` и прототипы — связанные темы. \`new\` устанавливает \`this\` = новый объект и привязывает \`[[Prototype]]\` к \`Constructor.prototype\`.',
    },
    {
      slug: 'js-dom',
      reason:
        'DOM-объекты построены на прототипной цепочке: \`HTMLDivElement\` → \`HTMLElement\` → \`Element\` → \`Node\` → \`EventTarget\`. Понимание прототипов помогает разобраться, где живут методы.',
    },
  ],
};
