import type { Lesson } from '../../types/lesson';
import { jsPrototypesQuiz } from '../quizzes/js-prototypes';

const Q = Object.fromEntries(jsPrototypesQuiz.questions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set(['jsp-q1', 'jsp-q4', 'jsp-q5', 'jsp-q7', 'jsp-q10', 'jsp-q11']);

export const jsPrototypesLesson: Lesson = {
  topicId: 'js-prototypes',

  intro: {
    whyItMatters: `Прототипы — основа объектной модели JavaScript. У каждого объекта есть скрытая ссылка \`[[Prototype]]\` на другой объект. Когда выполняется \`arr.map(...)\` или \`'hello'.toUpperCase()\`, движок не находит метод на самом значении: он поднимается по цепочке прототипов до \`Array.prototype\` или \`String.prototype\`.

Ключевое слово \`class\` (ES2015) — синтаксический сахар над функциями-конструкторами и \`prototype\`. \`class Dog extends Animal\` устанавливает \`Dog.prototype.[[Prototype]] = Animal.prototype\`. Без понимания цепочки прототипов поведение классов и встроенных типов воспринимается как набор разрозненных правил.`,
    estimatedMinutes: 30,
    interviewAngle:
      'Типичные вопросы: как работает поиск свойства, какие шаги выполняет \`new\`, чем \`class\` отличается от function-конструктора, как реализовать наследование без \`class\`, как работает \`instanceof\`, что такое prototype pollution и shadowing.',
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
            'У каждого объекта в JavaScript есть скрытая ссылка \`[[Prototype]]\` на другой объект. Двойные квадратные скобки в названии — общепринятая нотация для внутренних слотов (internal slot), доступных только через специальные функции, а не напрямую. Прочитать значение \`[[Prototype]]\` можно через \`Object.getPrototypeOf(obj)\` или (устаревший аксессор) \`obj.__proto__\`. При обращении к свойству движок ищет его сначала на самом объекте, затем на \`[[Prototype]]\`, затем на прототипе прототипа — вплоть до \`null\`. Эта последовательность ссылок называется цепочкой прототипов.',
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
            'Поэтому методы массивов и строк не дублируются в каждом экземпляре, а хранятся на \`Array.prototype\` и \`String.prototype\`. \`arr.map(fn)\` и \`[].map.call(arrayLike, fn)\` — это вызов одной и той же функции с разным \`this\`.',
        },
        { type: 'heading', content: 'Shadowing — теневое перекрытие' },
        {
          type: 'text',
          content:
            'Если присвоить объекту свойство с тем же именем, что и у прототипа, создаётся собственное свойство — оно «затеняет» прототипное. Операция присваивания всегда создаёт собственное свойство (за исключением сеттеров), даже если в прототипе уже есть свойство с таким именем.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const parent = { greeting: 'Привет' };
const child  = Object.create(parent);

child.greeting;            // 'Привет' — найдено в прототипе
child.greeting = 'Hi';     // создаётся собственное свойство
child.greeting;            // 'Hi'
parent.greeting;           // 'Привет' — прототип не изменился

delete child.greeting;
child.greeting;            // 'Привет' — снова из прототипа`,
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
      id: 'new-and-prototypes',
      title: 'Как работает new',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Оператор \`new\` выполняет фиксированную последовательность шагов:',
        },
        {
          type: 'list',
          content: `Создаётся новый пустой объект.
Его внутренний прототип \`[[Prototype]]\` устанавливается равным \`Constructor.prototype\`.
Конструктор вызывается с \`this\` = новый объект.
Если конструктор вернул объект, возвращается именно он; иначе возвращается созданный на первом шаге объект.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Реализация new в пользовательском коде
function myNew(Ctor, ...args) {
  const obj = Object.create(Ctor.prototype);   // шаги 1-2
  const result = Ctor.apply(obj, args);         // шаг 3
  return (result && typeof result === 'object') // шаг 4
    ? result
    : obj;
}

function Person(name) { this.name = name; }
const alice = myNew(Person, 'Алиса');
alice instanceof Person; // true`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Тонкость: на четвёртом шаге заменителем считается только объект. Возврат примитива (числа, строки, \`null\`) игнорируется. Это используется в паттерне «фабрика на конструкторе», где функция-конструктор может вернуть \`Proxy\` или экземпляр другого класса.',
        },
        { type: 'heading', content: '__proto__ и Object.setPrototypeOf' },
        {
          type: 'text',
          content:
            '\`__proto__\` — устаревший аксессор, оставленный в стандарте для совместимости. В современном коде вместо чтения и записи используются \`Object.getPrototypeOf\` и \`Object.setPrototypeOf\`. Изменение прототипа уже существующего объекта через \`setPrototypeOf\` поддерживается всеми движками, но крайне нежелательно: оптимизатор V8 «деоптимизирует» все объекты той же скрытой структуры, и работа с ними становится в разы медленнее.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const proto = { greet() { return 'hi'; } };

// Запись прототипа при создании — это нормально
const a = Object.create(proto);

// Запись прототипа уже существующего объекта — антипаттерн по перфу
const b = {};
Object.setPrototypeOf(b, proto);   // работает, но дорого`,
        },
      ],
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
            '\`Object.create(proto)\` создаёт новый объект с указанным прототипом. До появления \`class\` в ES2015 всё наследование строилось именно так. Реализация наследования без \`class\` — типовая задача на собеседовании.',
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
            'Три обязательных шага наследования без \`class\`: (1) \`Parent.call(this, ...)\` в конструкторе ребёнка; (2) \`Child.prototype = Object.create(Parent.prototype)\`; (3) \`Child.prototype.constructor = Child\`. Без первого шага не инициализируются поля родителя; без второго не работает \`instanceof Parent\`; без третьего \`instance.constructor\` указывает на \`Parent\`.',
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
            '\`Object.create(null)\` применяется, когда объект используется как словарь с произвольными ключами от пользователя и нужно исключить коллизии с методами \`Object.prototype\`, а также класс уязвимостей prototype pollution.',
        },
        { type: 'heading', content: 'Prototype pollution' },
        {
          type: 'text',
          content:
            'Если код «глубокого слияния» (\`deepMerge\`) не проверяет ключи, в \`Object.prototype\` можно записать произвольное свойство — оно мгновенно станет видно во всех объектах программы. Через JSON-вход вида \`{"__proto__": {"isAdmin": true}}\` атакующий может изменить поведение чужого кода.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Уязвимый deepMerge
function deepMerge(dst, src) {
  for (const key in src) {                  // нет фильтрации
    if (typeof src[key] === 'object') {
      dst[key] = dst[key] || {};
      deepMerge(dst[key], src[key]);
    } else {
      dst[key] = src[key];
    }
  }
}

const userInput = JSON.parse('{"__proto__":{"isAdmin":true}}');
deepMerge({}, userInput);
({}).isAdmin;   // true — загрязнили Object.prototype

// Защита: пропускать __proto__, constructor, prototype;
// или использовать Object.create(null) как dst.`,
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
            'Различия \`class\` и function-конструктора: (1) \`class\` нельзя вызвать без \`new\` — \`Animal()\` бросит TypeError; (2) объявления \`class\` не поднимаются (hoisting): обращение к классу до его объявления вызовет ReferenceError; (3) тело \`class\` всегда выполняется в strict mode (это режим JavaScript с более строгими правилами: \`this\` в обычной функции — \`undefined\`, нельзя присваивать необъявленные переменные); (4) методы класса non-enumerable — не попадают в \`for...in\` и \`Object.keys\`.',
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

// extends устанавливает две связи прототипов:
// 1) Dog.prototype.[[Prototype]] = Animal.prototype   — для методов экземпляра
// 2) Dog.[[Prototype]] = Animal                        — для статических методов
Object.getPrototypeOf(Dog.prototype) === Animal.prototype; // true
Object.getPrototypeOf(Dog) === Animal;                     // true`,
        },
        {
          type: 'text',
          content:
            '\`super.method()\` — особый синтаксис: метод ищется в прототипе родителя, но вызывается с \`this\` текущего экземпляра. Это позволяет переопределённому методу расширять поведение родительского, оставаясь полиморфным.',
        },
        { type: 'heading', content: 'Поля экземпляра и static' },
        {
          type: 'text',
          content:
            'Поля экземпляра (\`#balance = 0\`, \`label = \'\'\`, стрелочные поля) создаются для каждого экземпляра как собственные writable enumerable configurable свойства. Методы прототипа, напротив, non-enumerable. Из-за этого поля видны в \`Object.keys\` и \`for...in\`, а методы — нет.',
        },
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
        { type: 'heading', content: 'Наследование от встроенных классов' },
        {
          type: 'text',
          content:
            'Подкласс \`Error\` — стандартный паттерн для собственных типов исключений. При наследовании от \`Error\` важно вызвать \`super(message)\`, иначе свойство \`message\` не установится. В старых рантаймах с транспиляцией в ES5 \`instanceof\` для подклассов Error мог работать некорректно — при необходимости приходится восстанавливать прототип вручную через \`Object.setPrototypeOf(this, new.target.prototype)\`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `class NotFoundError extends Error {
  constructor(resource) {
    super(\`Not found: \${resource}\`);
    this.name = 'NotFoundError';
    this.resource = resource;
  }
}

try {
  throw new NotFoundError('/users/42');
} catch (err) {
  err instanceof NotFoundError; // true
  err instanceof Error;          // true
}`,
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
            '\`instanceof\` даёт неверный результат при работе с объектами из другого realm (iframe, worker, vm-контекст Node.js): у каждого realm свой \`Array.prototype\`. Массив из iframe не будет \`instanceof Array\` для родительского окна. Решение — \`Array.isArray()\` или \`Object.prototype.toString.call(value)\`.',
        },
        { type: 'heading', content: 'Symbol.hasInstance — настройка instanceof' },
        {
          type: 'text',
          content:
            'Точный механизм \`obj instanceof Constructor\` — вызов \`Constructor[Symbol.hasInstance](obj)\`. По умолчанию этот метод реализует подъём по цепочке прототипов, но его можно переопределить и сделать кастомную проверку.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `class Even {
  static [Symbol.hasInstance](value) {
    return typeof value === 'number' && value % 2 === 0;
  }
}

4 instanceof Even;  // true
5 instanceof Even;  // false`,
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
        { type: 'heading', content: 'enumerable: что видно при переборе' },
        {
          type: 'text',
          content:
            'У каждого свойства есть дескрипторы: \`writable\`, \`enumerable\`, \`configurable\`. \`enumerable: true\` означает, что свойство будет показано в \`for...in\` и \`Object.keys\`. Методы прототипа классов и встроенные методы типа \`Array.prototype.map\` объявлены non-enumerable — поэтому при итерации по объекту вы видите только данные, а не методы.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const obj = { visible: 1 };
Object.defineProperty(obj, 'hidden', {
  value: 2,
  enumerable: false,
});

Object.keys(obj);              // ['visible']
for (const k in obj) console.log(k); // visible

// Но свойство существует и доступно
obj.hidden;                    // 2
Object.hasOwn(obj, 'hidden');  // true`,
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
        {
          type: 'text',
          content:
            'Ниже собраны типичные ошибки при работе с прототипами: потеря \`constructor\`, расширение нативных объектов, неосторожная работа с \`Object.assign\` и спред-оператором, использование стрелочных функций в полях класса.',
        },
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
        { type: 'heading', content: 'Object.assign и спред теряют прототип' },
        {
          type: 'text',
          content:
            '\`Object.assign({}, instance)\` и \`{ ...instance }\` копируют только собственные перечисляемые свойства, прототип получателя — \`Object.prototype\`. Это часто приводит к неожиданному поведению: методы класса исчезают, \`instanceof\` ломается.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `class User {
  constructor(name) { this.name = name; }
  greet() { return \`Hi, \${this.name}\`; }
}

const user = new User('Алиса');
user.greet();                // 'Hi, Алиса'

const copy = { ...user };
copy.name;                   // 'Алиса'
copy.greet;                  // undefined — метода нет, прототип теряется
copy instanceof User;         // false`,
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
// При этом this внутри стрелочной функции лексически привязан к экземпляру.`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Из-за того, что стрелочное поле создаётся на экземпляре, а не на прототипе, его невозможно переопределить через \`super\` в подклассе и непросто замокать в тестах через \`ClassName.prototype.method = jest.fn()\`. Если эти сценарии важны — оставляйте обычный метод и используйте \`bind\` в конструкторе.',
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
- Присваивание создаёт собственное свойство (shadowing), не меняя прототип

**new — четыре шага**
1. Создать пустой объект
2. obj.[[Prototype]] = Constructor.prototype
3. Вызвать Constructor с this = obj
4. Вернуть результат (объект из Constructor) или obj

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
- Методы попадают на \`MyClass.prototype\` (non-enumerable)
- Поля экземпляра — собственные enumerable-свойства
- \`extends\` устанавливает прототипы и для методов экземпляра, и для статических
- \`super.method()\` вызывается с \`this\` = экземпляр подкласса
- Тело класса всегда в strict mode

**Проверки**
- \`Object.hasOwn(obj, key)\` — собственное свойство (ES2022)
- \`'key' in obj\` — с учётом прототипов
- \`obj instanceof Constructor\` — \`Constructor.prototype\` в цепочке (можно переопределить через \`Symbol.hasInstance\`)
- \`Array.isArray(value)\` — надёжнее \`instanceof Array\` между realm

**Подводные камни**
- Замена \`prototype\` целиком стирает \`constructor\` — нужно восстанавливать
- Расширение \`Array.prototype\` / \`Object.prototype\` конфликтует с библиотеками и будущими стандартами
- Prototype pollution: незащищённый \`deepMerge\` через \`__proto__\` позволяет записать в \`Object.prototype\`
- \`Object.assign\` и спред теряют прототип — методы и \`instanceof\` ломаются
- Стрелочная функция как поле класса не попадает на прототип — копия в каждом экземпляре
- \`instanceof\` ломается между iframe / worker — используйте \`isArray\` или \`toString.call\`
- \`Object.setPrototypeOf\` деоптимизирует объект в V8 — задавайте прототип при создании`,

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
