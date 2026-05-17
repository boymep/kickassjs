import type { Lesson } from '../../types/lesson';
import type { Flashcard } from '../../types/flashcard';
import { jsPrototypesQuiz } from '../quizzes/js-prototypes';
import { jsPrototypesFlashcards } from '../flashcards/js-prototypes';

// Index existing quiz questions for reuse as checkpoints.
const Q = Object.fromEntries(jsPrototypesQuiz.questions.map((q) => [q.id, q]));

// Questions used as in-chapter checkpoints (must NOT appear in finalQuiz).
const CHECKPOINT_IDS = new Set(['jsp-q1', 'jsp-q5', 'jsp-q4', 'jsp-q11', 'jsp-q7', 'jsp-q10']);

// Дополнительные карточки в дополнение к legacy-набору.
const extraFlashcards: Flashcard[] = [
  {
    id: 'jspr-f7',
    question: 'Что такое Object.create и чем он отличается от литерала {}?',
    answer:
      'Object.create(proto) создаёт новый объект и явно задаёт ему [[Prototype]] = proto. Литерал {} всегда наследует от Object.prototype. Object.create(null) даёт «чистый» объект без прототипа — без toString, hasOwnProperty и т.п.',
    keyPoints: [
      'Object.create(proto, descriptors) поддерживает property descriptors вторым аргументом',
      'Object.create(null) — идеальная map-структура без коллизий с методами Object.prototype',
      'Внутри полифилла new: Object.create(Constructor.prototype) воспроизводит шаг установки [[Prototype]]',
      'В отличие от Object.setPrototypeOf, не «перенастраивает» уже существующий объект',
    ],
    code: `const animal = { breathe() { return 'breathe'; } };

const dog = Object.create(animal);
dog.bark = () => 'woof';

dog.bark();    // 'woof'
dog.breathe(); // 'breathe' — из прототипа

// Чистый словарь без Object.prototype:
const map = Object.create(null);
map.toString = 42;     // безопасно: нет коллизии
map.hasOwnProperty;    // undefined`,
  },
  {
    id: 'jspr-f8',
    question: 'Чем отличаются __proto__, prototype и Object.getPrototypeOf?',
    answer:
      '__proto__ — устаревший геттер/сеттер на Object.prototype, обращающийся к [[Prototype]] объекта. prototype — это свойство функций-конструкторов: объект, который станет [[Prototype]] для будущих экземпляров. Object.getPrototypeOf(obj) — стандартный способ прочитать [[Prototype]].',
    keyPoints: [
      '__proto__ есть у любого объекта (через Object.prototype), prototype — только у функций',
      'new Foo(): движок устанавливает экземпляр.[[Prototype]] = Foo.prototype',
      'Object.getPrototypeOf(new Foo()) === Foo.prototype',
      'В современном коде используйте Object.getPrototypeOf / Object.setPrototypeOf, а не __proto__',
    ],
    code: `function Foo() {}
const f = new Foo();

f.__proto__ === Foo.prototype;            // true
Object.getPrototypeOf(f) === Foo.prototype; // true
Foo.prototype.constructor === Foo;          // true

// prototype есть только у функций:
({}).prototype;            // undefined
(function(){}).prototype;  // {} — пустой объект-прототип`,
  },
  {
    id: 'jspr-f9',
    question: 'Как работает super в методах класса? На какой объект он указывает?',
    answer:
      'super в методе ссылается на [[HomeObject]].[[Prototype]] — то есть на прототип того объекта, в котором метод определён. Это разрешается статически в момент компиляции, поэтому super не меняется при копировании метода в другой объект.',
    keyPoints: [
      'super.method() вызывается с текущим this, но ищется на прототипе HomeObject',
      'HomeObject — скрытое поле, фиксируется при создании метода через method() {}',
      'Стрелочные функции и функции, объявленные через присваивание, не имеют HomeObject — super в них недоступен',
      'super(...) в конструкторе подкласса вызывает родительский конструктор и обязателен до использования this',
    ],
    code: `class Animal {
  describe() { return 'animal'; }
}
class Dog extends Animal {
  describe() {
    return super.describe() + ' → dog';
  }
}

new Dog().describe(); // 'animal → dog'

// HomeObject зафиксирован: копирование метода не ломает super
const d = new Dog();
const fn = d.describe;
fn.call({});  // super всё ещё указывает на Animal.prototype`,
  },
  {
    id: 'jspr-f10',
    question: 'Что делает Symbol.toPrimitive и зачем он нужен на прототипе?',
    answer:
      'Symbol.toPrimitive — это метод, вызываемый движком при приведении объекта к примитиву (число, строка, default). Если он определён на прототипе, экземпляры наследуют поведение конвертации.',
    keyPoints: [
      'Принимает hint: "number", "string" или "default"',
      'Имеет приоритет над valueOf и toString',
      'Часто используется в библиотеках: Date, BigNumber, классы единиц измерения',
      'Метод должен возвращать примитив, иначе TypeError',
    ],
    code: `class Money {
  constructor(amount) { this.amount = amount; }
  [Symbol.toPrimitive](hint) {
    if (hint === 'string') return this.amount + ' ₽';
    if (hint === 'number') return this.amount;
    return this.amount + ' ₽';
  }
}

const m = new Money(100);
+m;          // 100 (hint = 'number')
\`\${m}\`;     // '100 ₽' (hint = 'string')
m + 50;      // 150 (hint = 'default' → number)`,
  },
];

export const jsPrototypesLesson: Lesson = {
  topicId: 'js-prototypes',

  intro: {
    whyItMatters: `Прототипы — это фундамент объектной модели JavaScript. Любой объект — массив, функция, экземпляр класса, даже литерал \`{}\` — имеет скрытую ссылку \`[[Prototype]]\` на другой объект. Когда вы пишете \`arr.map(...)\` или \`'hello'.toUpperCase()\`, движок не находит метод на самом значении: он поднимается по цепочке прототипов до \`Array.prototype\` или \`String.prototype\` и выполняет там.

Эта же модель работает и для пользовательского кода. Ключевое слово \`class\`, появившееся в ES2015, — синтаксический сахар над функциями-конструкторами и \`prototype\`. \`class Dog extends Animal\` под капотом устанавливает \`Dog.prototype.[[Prototype]] = Animal.prototype\` и вызывает \`Animal.call(this, ...)\` в конструкторе. Понимание этого превращает «магию» классов в простую цепочку ссылок.

Отличие от классических ООП-языков (Java, C++): в JavaScript нет «отдельных» классов, существующих рядом с экземплярами. Класс — это объект-прототип. Можно изменить \`Array.prototype\` в рантайме — и все массивы в программе мгновенно увидят новый метод. Это даёт огромную гибкость, но и создаёт риски: добавление методов в чужие прототипы (это называют **monkey-patching**) может конфликтовать с будущими версиями стандарта или другими библиотеками, а изменения в \`Object.prototype\` затрагивают буквально каждый объект.

В этом уроке вы научитесь читать прототипную цепочку как сам движок: понимать, где живут методы массивов, чем \`__proto__\` отличается от \`prototype\`, как реализовать наследование без \`class\` через \`Object.create\`, и почему \`f.constructor === Foo\` иногда возвращает \`false\`. По итогам урока вы сможете уверенно отвечать на классические вопросы интервью про \`instanceof\`, \`hasOwnProperty\`, \`super\` и приватные поля.`,
    estimatedMinutes: 35,
    interviewAngle:
      'Интервьюер проверяет понимание цепочки прототипов на конкретных примерах: где живёт Array.prototype.map, что делает new под капотом, чем class отличается от function-конструктора, как работает instanceof. Сильный кандидат пишет наследование без class за минуту и объясняет ловушки constructor и __proto__.',
    prerequisites: [
      { slug: 'js-this', title: 'this и контекст' },
    ],
  },

  resources: {
    videos: [
      {
        source: 'youtube',
        id: 'wstwjQ1yqWQ',
        title: 'Prototype in JavaScript — Akshay Saini',
        channel: 'Akshay Saini',
        language: 'en',
        durationSec: 21 * 60,
        description: 'Подробный разбор цепочки прототипов и __proto__ с живой демонстрацией в DevTools.',
      },
      {
        source: 'youtube',
        id: 'XskMWBXNbp0',
        title: 'JavaScript Visualized: Prototypal Inheritance',
        channel: 'Lydia Hallie',
        language: 'en',
        durationSec: 6 * 60,
        description: 'Лучшая визуализация цепочки прототипов — как движок ищет свойство.',
      },
    ],
    links: [
      {
        url: 'https://developer.mozilla.org/ru/docs/Web/JavaScript/Inheritance_and_the_prototype_chain',
        title: 'Наследование и цепочка прототипов — MDN',
        source: 'mdn',
        language: 'ru',
        note: 'Канонический разбор от Mozilla: [[Prototype]], prototype, поиск свойств, performance-следствия.',
      },
      {
        url: 'https://learn.javascript.ru/prototypes',
        title: 'Прототипы, наследование — учебник learn.javascript.ru',
        source: 'learn-js',
        language: 'ru',
        note: 'Глава Ильи Кантора: F.prototype, нативные прототипы, методы получения и установки прототипа.',
      },
      {
        url: 'https://learn.javascript.ru/classes',
        title: 'Классы — учебник learn.javascript.ru',
        source: 'learn-js',
        language: 'ru',
        note: 'Class под капотом, наследование, super, статические методы, приватные поля.',
      },
      {
        url: 'https://2ality.com/2015/02/es6-classes-final.html',
        title: 'Classes in ES6 — 2ality',
        source: 'article',
        language: 'en',
        note: 'Аксель Раушмайер: подробный разбор того, как class транслируется в прототипы.',
      },
      {
        url: 'https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/create',
        title: 'Object.create — MDN',
        source: 'mdn',
        language: 'ru',
        note: 'Спецификация Object.create, включая поведение с null-прототипом и property descriptors.',
      },
    ],
  },

  chapters: [
    {
      id: 'prototype-chain',
      title: 'Цепочка прототипов: что такое [[Prototype]]',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'У каждого объекта в JavaScript есть скрытая ссылка `[[Prototype]]` — другой объект, на который JS «откатится» при поиске свойства, если оно не найдено локально. Эта ссылка называется **прототипом**, а последовательность таких ссылок — **цепочкой прототипов** (prototype chain).',
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
Object.getPrototypeOf(dog) === animal;             // true
Object.getPrototypeOf(animal) === Object.prototype; // true
Object.getPrototypeOf(Object.prototype) === null;   // true`,
        },
        { type: 'visualization', content: '', vizId: 'prototype-chain' },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Ключевая идея: прототип — **живая ссылка**, а не копия. Если вы добавите свойство в `animal` после создания `dog`, оно мгновенно станет видно через `dog.<имя>`.',
        },
        { type: 'heading', content: 'Почему это важно для встроенных типов' },
        {
          type: 'code',
          language: 'javascript',
          content: `const arr = [1, 2, 3];

// arr → Array.prototype → Object.prototype → null
arr.push(4);              // метод живёт на Array.prototype
arr.hasOwnProperty(0);    // метод живёт на Object.prototype
arr.toString();           // тоже Object.prototype (Array.prototype переопределяет)

// Array.prototype.map не существует на самом массиве:
arr.hasOwnProperty('map'); // false
'map' in arr;              // true — оператор in идёт по цепочке`,
        },
        {
          type: 'text',
          content:
            'Это объясняет «магию» массивов и строк в JavaScript: методы не дублируются в каждый экземпляр, а живут централизованно на `Array.prototype` и `String.prototype`. Поэтому `arr.map(fn)` и `[].map.call(arrayLike, fn)` — это вызов одной и той же функции с разным `this`.',
        },
      ],
      flashcardIds: ['jspr-f1'],
      checkpoint: [Q['jsp-q1']!, Q['jsp-q5']!],
      docsLink: { url: 'https://learn.javascript.ru/prototype-inheritance', title: 'Прототипное наследование — learn.javascript.ru' },
    },

    {
      id: 'object-create-and-inheritance',
      title: 'Object.create и наследование без class',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            '`Object.create(proto)` — самый прямой способ создать объект с заданным прототипом. До появления `class` в ES2015 наследование строилось именно через эту функцию.',
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
  Animal.call(this, name); // вызвать конструктор родителя с this = новый Dog
  this.breed = breed;
}

// Установить прототипную цепочку: Dog.prototype → Animal.prototype
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog; // восстановить ссылку на конструктор

Dog.prototype.bark = function () {
  return \`\${this.name} лает!\`;
};

const rex = new Dog('Rex', 'Husky');
rex.bark();             // 'Rex лает!'
rex.speak();            // 'Rex издаёт звук' — из Animal.prototype
rex instanceof Dog;     // true
rex instanceof Animal;  // true`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Три обязательных шага наследования без class: (1) `Parent.call(this, ...)` в конструкторе ребёнка, (2) `Child.prototype = Object.create(Parent.prototype)`, (3) `Child.prototype.constructor = Child`. Пропуск любого шага ломает либо `instanceof`, либо инициализацию полей, либо `f.constructor`.',
        },
        { type: 'heading', content: 'Object.create(null) — словарь без прототипа' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Чистый объект без Object.prototype — идеален для словарей.
const dict = Object.create(null);

dict.toString = 'строка'; // безопасно: нет коллизии с Object.prototype.toString
dict.hasOwnProperty;       // undefined — метода нет

// Сравните с обычным {}:
const normal = {};
normal.toString;           // [Function: toString] — унаследован
'toString' in normal;      // true

// При итерации не нужно фильтровать прототипные ключи:
for (const key in dict) {
  // только собственные ключи, без сюрпризов
}`,
        },
        {
          type: 'text',
          content:
            'Шаблон `Object.create(null)` часто используют в библиотеках для безопасного хранения произвольных пользовательских ключей: например, в маршрутизаторах, кеш-таблицах, парсерах JSON. Это исключает класс уязвимостей prototype pollution.',
        },
      ],
      flashcardIds: ['jspr-f7'],
      docsLink: { url: 'https://learn.javascript.ru/prototypes', title: 'Прототипы — learn.javascript.ru' },
      playground: {
        starterCode: `// Реализуйте прототипное наследование БЕЗ ключевого слова class.
// rex.bark() должен вернуть 'Rex лает!', а rex.speak() — 'Rex издаёт звук'.

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
        expectedOutput: 'Rex лает!\nRex издаёт звук',
        description:
          'Классическая задача с собеседования. Используйте Animal.call(this, name), Object.create(Animal.prototype) и не забудьте восстановить constructor.',
      },
      checkpoint: [Q['jsp-q4']!],
    },

    {
      id: 'class-as-sugar',
      title: 'class как синтаксический сахар',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Синтаксис `class`, появившийся в ES2015, — **синтаксический сахар** над прототипным наследованием. Под капотом `class` — это всё та же функция-конструктор плюс объект `prototype`. `typeof MyClass` вернёт `"function"`, а методы класса попадут на `MyClass.prototype`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Эти две записи почти эквивалентны:

// ES2015 class
class Animal {
  constructor(name) { this.name = name; }
  speak() { return \`\${this.name} говорит\`; }
}

// Эквивалент через function
function AnimalLegacy(name) { this.name = name; }
AnimalLegacy.prototype.speak = function () {
  return \`\${this.name} говорит\`;
};

typeof Animal;             // 'function' — class это функция
Animal.prototype.speak;    // [Function: speak] — на прототипе
new Animal('Кот').speak(); // 'Кот говорит'`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Различия class и function-конструктора: (1) class **нельзя вызвать без new** — `Animal()` бросит TypeError; (2) class **не всплывает** (no hoisting) — обращение к нему до объявления даст ReferenceError; (3) тело class всегда выполняется в **strict mode**; (4) методы класса не enumerable, а методы прототипа function-конструктора — да.',
        },
        { type: 'heading', content: 'extends — что это в терминах прототипов' },
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
// 1) Dog.prototype.[[Prototype]] = Animal.prototype  → наследование методов экземпляра
// 2) Dog.[[Prototype]] = Animal                       → наследование static методов
Object.getPrototypeOf(Dog.prototype) === Animal.prototype; // true
Object.getPrototypeOf(Dog) === Animal;                     // true

new Dog().speak();         // 'generic → woof'
new Dog() instanceof Dog;  // true
new Dog() instanceof Animal; // true`,
        },
        { type: 'heading', content: 'static, приватные #поля и super' },
        {
          type: 'code',
          language: 'javascript',
          content: `class BankAccount {
  #balance = 0;          // приватное поле (ES2022)
  static MAX = 1_000_000; // static — на самом классе, не на прототипе

  deposit(amount) {
    if (amount > 0 && this.#balance + amount <= BankAccount.MAX) {
      this.#balance += amount;
    }
  }
  get balance() { return this.#balance; }
}

const acc = new BankAccount();
acc.deposit(100);
acc.balance;     // 100
// acc.#balance; // SyntaxError — приватное поле недоступно снаружи
BankAccount.MAX; // 1000000 — static свойство класса
new BankAccount().MAX; // undefined — static не наследуется экземплярами`,
        },
      ],
      flashcardIds: ['jspr-f2', 'jspr-f4', 'jspr-f5', 'jspr-f9'],
      checkpoint: [Q['jsp-q7']!, Q['jsp-q10']!],
      docsLink: { url: 'https://learn.javascript.ru/class', title: 'Классы — learn.javascript.ru' },
    },

    {
      id: 'instanceof-and-checks',
      title: 'instanceof, hasOwnProperty, in',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            '`instanceof` проверяет **наличие `Constructor.prototype` в цепочке прототипов** объекта. Сам объект-конструктор не проверяется. Из этого вытекают как полезные свойства, так и подводные камни.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Реализация instanceof в пользовательском коде:
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
            '`instanceof` ломается между разными realm (iframe, worker, vm-контекст в Node.js): у каждого realm свой `Array.prototype`. Поэтому массив из iframe не будет `instanceof Array` для родительского окна. Решение — `Array.isArray()` или проверка через `Object.prototype.toString.call(value)`.',
        },
        { type: 'heading', content: 'hasOwnProperty vs in vs Object.hasOwn' },
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

// Зачем Object.hasOwn?
// hasOwnProperty можно «затереть» собственным свойством:
const evil = { hasOwnProperty: () => true };
evil.hasOwnProperty('foo');        // true — но 'foo' не существует!
Object.hasOwn(evil, 'foo');        // false — корректно`,
        },
        {
          type: 'list',
          content: `- Используйте \`Object.hasOwn(obj, key)\` для проверки собственных свойств в новом коде.
- Используйте \`'key' in obj\`, когда нужно проверить наличие свойства **с учётом** цепочки прототипов.
- Используйте \`Object.keys(obj)\` для получения списка собственных enumerable-свойств.
- \`for...in\` перебирает все enumerable свойства, **включая** прототипные — фильтруйте через \`Object.hasOwn\`.`,
        },
      ],
      flashcardIds: ['jspr-f3', 'jspr-f6', 'jspr-f8'],
      checkpoint: [Q['jsp-q11']!],
      docsLink: { url: 'https://learn.javascript.ru/instanceof', title: 'instanceof — learn.javascript.ru' },
    },

    {
      id: 'pitfalls',
      title: 'Типичные ошибки и подводные камни',
      estimatedMinutes: 6,
      blocks: [
        { type: 'heading', content: 'Потеря constructor при замене prototype' },
        {
          type: 'code',
          language: 'javascript',
          content: `function Foo() {}
// Полная замена прототипа стирает связь с Foo:
Foo.prototype = { bar: 1 };

const f = new Foo();
f.constructor === Foo;     // false — связь потеряна
f.constructor === Object;  // true  — наследуется от Object.prototype

// Правильно: добавлять методы, а не заменять весь объект:
Foo.prototype.bar = 1;     // ✅ constructor сохранён

// Или явно восстановить:
Foo.prototype = { bar: 1, constructor: Foo };`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Это классический баг при ручной реализации наследования. Если вы делаете `Child.prototype = Object.create(Parent.prototype)` и забываете `Child.prototype.constructor = Child`, то `new Child().constructor` начнёт указывать на `Parent`. На это завязаны фабричные методы и логи.',
        },
        { type: 'heading', content: 'Расширение нативных прототипов' },
        {
          type: 'code',
          language: 'javascript',
          content: `// 🔴 Антипаттерн: monkey-patching Array.prototype
Array.prototype.last = function () {
  return this[this.length - 1];
};

[1, 2, 3].last(); // 3 — работает...

// ...но создаёт несколько проблем:
// 1) Поле появится в for...in циклах по массивам (если enumerable)
// 2) Конфликт с будущими стандартными методами (Array.prototype.at появился в ES2022)
// 3) Конфликт с другими библиотеками
// 4) Невозможно сделать tree-shaking

// ✅ Альтернативы:
const last = (arr) => arr[arr.length - 1];   // утилита-функция
last([1, 2, 3]);                             // 3

// Или Symbol-ключ — не виден извне:
const LAST = Symbol('last');
Array.prototype[LAST] = function () { /* ... */ };`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '**Никогда** не расширяйте `Object.prototype`: добавленное свойство станет видно во всех объектах программы и в каждом цикле `for...in`. Это сломает любой код, не использующий `Object.hasOwn` для фильтрации.',
        },
        { type: 'heading', content: 'Стрелочные функции на прототипе' },
        {
          type: 'code',
          language: 'javascript',
          content: `class Foo {
  // ❌ Стрелочная функция как class field — НЕ метод прототипа.
  arrow = () => 'arrow';

  // ✅ Обычный метод — попадает на Foo.prototype.
  normal() { return 'normal'; }
}

const f = new Foo();
Object.getPrototypeOf(f).normal; // [Function: normal] — есть на прототипе
Object.getPrototypeOf(f).arrow;  // undefined — arrow создан на экземпляре

// Каждый экземпляр получает свою копию arrow → выше расход памяти.
// Зато this всегда привязан к экземпляру лексически (полезно для callback).`,
        },
      ],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/JavaScript/Inheritance_and_the_prototype_chain', title: 'Прототипная цепочка — MDN (ru)' },
    },

    {
      id: 'engine-perspective',
      title: 'Прототипы глазами движка',
      estimatedMinutes: 4,
      blocks: [
        {
          type: 'text',
          content:
            'Движок V8 активно оптимизирует поиск по прототипам. Объекты с одинаковой «формой» — одинаковые ключи в одинаковом порядке — делят внутреннюю структуру (в V8 её называют скрытым классом), и доступ к их свойствам становится практически бесплатным: движок знает заранее, где искать нужное значение.',
        },
        {
          type: 'list',
          content: `- Изменение прототипа существующего объекта через \`Object.setPrototypeOf\` или \`obj.__proto__ = ...\` — дорогая операция: движок теряет накопленную информацию о структуре объекта и начинает работать с ним медленнее. MDN явно рекомендует **создавать объект сразу с нужным прототипом** через \`Object.create\` или литерал.
- Глубокая цепочка прототипов (5+ уровней) замедляет поиск пропущенных свойств: движок вынужден пройти всю цепочку, чтобы убедиться в отсутствии ключа.
- Расширение \`Object.prototype\` или \`Array.prototype\` ломает оптимизации inline-кеша: горячие участки кода, опиравшиеся на «знание» о неизменности прототипа, перекомпилируются.
- \`class\` и \`extends\` транслируются движком в стандартизированную форму, и V8 их оптимизирует лучше, чем ручную сборку наследования через \`Object.create\` плюс присваивания.`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Практическое следствие: для горячего кода и долгоживущих объектов предпочтительнее `class` или `Object.create(proto)` в момент создания, а не последующий `Object.setPrototypeOf`. Разница в скорости легко достигает порядка.',
        },
      ],
      docsLink: { url: 'https://learn.javascript.ru/prototypes', title: 'Прототипы — learn.javascript.ru' },
    },
  ],

  // Все вопросы из старого квиза, кроме тех, что ушли в checkpoint.
  finalQuiz: jsPrototypesQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  // Реюзаем существующие карточки + добавляем новые.
  flashcards: [...jsPrototypesFlashcards.cards, ...extraFlashcards],

  cheatsheet: `### Шпаргалка по прототипам

- Каждый объект имеет \`[[Prototype]]\` — ссылку на родителя. Поиск свойства идёт по цепочке до \`null\`.
- \`__proto__\` — устаревший геттер; \`Object.getPrototypeOf(obj)\` — стандарт; \`Constructor.prototype\` — будущий прототип экземпляров.
- \`class\` — синтаксический сахар над функцией-конструктором и \`prototype\`. Отличия: обязательный \`new\`, нет hoisting, strict mode, методы non-enumerable.
- \`extends\` устанавливает \`Child.prototype.[[Prototype]] = Parent.prototype\` и \`Child.[[Prototype]] = Parent\` (для static).
- Наследование без \`class\`: \`Parent.call(this, ...)\` + \`Child.prototype = Object.create(Parent.prototype)\` + \`Child.prototype.constructor = Child\`.
- \`instanceof\` ищет \`Constructor.prototype\` в цепочке. Между realm не работает — используйте \`Array.isArray\` и т.п.
- \`hasOwnProperty\` / \`Object.hasOwn\` — только собственные; оператор \`in\` — вся цепочка.
- \`Object.create(null)\` — словарь без \`Object.prototype\`, без коллизий с \`toString\`/\`hasOwnProperty\`.
- Не расширяйте \`Object.prototype\`. Расширение \`Array.prototype\` тоже опасно (конфликты со стандартом).`,

  interviewQA: [
    {
      id: 'jspr-iq1',
      question: 'Объясните цепочку прототипов на примере массива. Где живут map, push, hasOwnProperty?',
      shortAnswer:
        'Массив — это объект с прототипом Array.prototype, у которого прототип Object.prototype, у которого прототип null. map и push живут на Array.prototype, hasOwnProperty — на Object.prototype. Поиск свойства идёт снизу вверх до первого совпадения.',
      fullAnswer: `Любой массив \`arr = [1, 2, 3]\` — это объект, у которого \`[[Prototype]]\` указывает на \`Array.prototype\`. У \`Array.prototype\`, в свою очередь, \`[[Prototype]]\` указывает на \`Object.prototype\`. У \`Object.prototype\` прототип \`null\` — это конец цепочки.

Когда вы пишете \`arr.map(fn)\`, движок выполняет:

1. Проверяет, есть ли у \`arr\` собственное свойство \`map\`. Нет.
2. Берёт прототип \`arr\` — \`Array.prototype\`. Ищет \`map\` там. **Находит** и вызывает с \`this = arr\`.

\`arr.hasOwnProperty(0)\` работает так же, но поиск идёт глубже:

1. \`arr\` — нет.
2. \`Array.prototype\` — нет (Array.prototype не переопределяет hasOwnProperty).
3. \`Object.prototype\` — есть. Вызывается с \`this = arr\`.

Проверить структуру можно так:

\`\`\`js
arr.hasOwnProperty('map');                     // false
Array.prototype.hasOwnProperty('map');         // true
Object.getPrototypeOf(arr) === Array.prototype; // true
Object.getPrototypeOf(Array.prototype) === Object.prototype; // true
\`\`\`

Эта модель — основа экономии памяти: тысячи массивов в программе делят один \`Array.prototype\`. Метод \`map\` не дублируется в каждый массив.`,
      followUps: [
        'Что произойдёт, если переопределить Array.prototype.map? Затронет ли это все массивы?',
        'Почему Array.isArray надёжнее, чем `arr instanceof Array`?',
      ],
      relatedChapterId: 'prototype-chain',
    },
    {
      id: 'jspr-iq2',
      question: 'Чем class в JavaScript отличается от function-конструктора под капотом?',
      shortAnswer:
        'Под капотом class — это функция-конструктор плюс объект prototype с методами. Различия: class требует new, не всплывает, выполняется в strict mode, методы класса non-enumerable. Также class поддерживает приватные #поля, static и super.',
      fullAnswer: `\`class\` — синтаксический сахар. \`typeof MyClass\` возвращает \`"function"\`. Метод \`speak()\`, объявленный в теле класса, фактически попадает на \`MyClass.prototype.speak\`. Но семантически отличий хватает.

**Различия в поведении:**

1. **Обязательный \`new\`.** Вызов \`Animal()\` без \`new\` бросит \`TypeError: Class constructor cannot be invoked without 'new'\`. Function-конструктор такого ограничения не имеет — придётся проверять \`new.target\` вручную.
2. **Нет hoisting.** \`new Animal()\` до объявления \`class Animal\` бросит \`ReferenceError\` (TDZ). \`function Animal\` всплывает целиком.
3. **Strict mode.** Тело класса всегда строгое, даже если файл — нет.
4. **Методы non-enumerable.** \`Object.keys(Animal.prototype)\` пустой, тогда как у function-конструктора методы по умолчанию enumerable и попадают в \`for...in\`.
5. **\`extends\`, \`super\`, \`static\`, приватные \`#поля\`.** Класс поддерживает их декларативно.

**Под капотом transpiled-код class** (Babel в режиме legacy) выглядит примерно так:

\`\`\`js
function Animal(name) {
  if (!(this instanceof Animal)) throw new TypeError("...");
  this.name = name;
}
Object.defineProperty(Animal.prototype, 'speak', {
  value: function () { return this.name; },
  enumerable: false,
  writable: true,
  configurable: true,
});
\`\`\`

Современные движки выполняют class напрямую без транспиляции и оптимизируют его лучше, чем эквивалентную ручную сборку.`,
      followUps: [
        'Можно ли вызвать метод class без new, передав «фейковый» this через call?',
        'Как ведёт себя static наследование при extends?',
      ],
      relatedChapterId: 'class-as-sugar',
    },
    {
      id: 'jspr-iq3',
      question: 'Что произойдёт, если изменить Array.prototype в работающем приложении?',
      shortAnswer:
        'Изменения мгновенно видны для всех массивов программы — текущих и будущих. Это создаёт три класса проблем: конфликты с другими библиотеками, конфликты с будущими стандартами (например, Array.prototype.at появился в 2022), деоптимизации движка из-за инвалидации inline-кешей.',
      fullAnswer: `\`Array.prototype\` — единый объект на realm. Все массивы делят его как прототип. Поэтому добавление метода:

\`\`\`js
Array.prototype.last = function () { return this[this.length - 1]; };
\`\`\`

мгновенно делает \`last\` доступным на любом массиве в текущем окне или Node.js-процессе. Это создаёт несколько проблем.

**1) Конфликты с другими библиотеками и со стандартом.** Если две библиотеки определяют \`Array.prototype.last\` по-разному, последний победит. \`Array.prototype.flat\` (ES2019), \`Array.prototype.at\` (ES2022), \`Array.prototype.findLast\` (ES2023) сначала отсутствовали в стандарте — их активно полифилили под собственные имена, и при появлении в стандарте код многих библиотек сломался.

**2) \`for...in\`.** По умолчанию свойство, добавленное присваиванием, enumerable. Оно появится в \`for...in\` циклах по массивам (хотя по массивам \`for...in\` использовать и так не рекомендуется). Решается через \`Object.defineProperty(Array.prototype, 'last', { value: fn })\` — там по умолчанию enumerable: false.

**3) Деоптимизации в V8.** Движок строит inline-кеши, основываясь на «стабильности» прототипа. Изменение \`Array.prototype\` инвалидирует кеши, и горячие участки кода перекомпилируются. На больших приложениях это заметно.

**Безопасные альтернативы:**
- Утилита-функция: \`function last(arr) { return arr[arr.length - 1]; }\`.
- Symbol-ключ: \`Array.prototype[MY_SYMBOL] = ...\` — не виден в \`for...in\` и не конфликтует с именами.
- Класс-обёртка или прокси.

Расширение \`Object.prototype\` ещё хуже: добавленное свойство видно во **всех** объектах, включая результат \`JSON.parse\`.`,
      followUps: [
        'Почему Array.prototype.at в ES2022 ломал библиотеки?',
        'Как Object.defineProperty помогает безопасно расширять прототип?',
      ],
      relatedChapterId: 'pitfalls',
    },
    {
      id: 'jspr-iq4',
      question: 'В чём разница между __proto__, prototype и Object.getPrototypeOf?',
      shortAnswer:
        '__proto__ — устаревший геттер/сеттер на Object.prototype, обращающийся к [[Prototype]] объекта. prototype — свойство функций-конструкторов, объект, который станет [[Prototype]] для будущих экземпляров через new. Object.getPrototypeOf — стандартный метод чтения [[Prototype]] любого объекта.',
      fullAnswer: `Это три разных понятия, которые часто путают.

**\`[[Prototype]]\`** — внутренний слот объекта, ссылка на прототип. Не доступен напрямую, читается через \`Object.getPrototypeOf(obj)\`.

**\`obj.__proto__\`** — устаревший аксессор, определённый на \`Object.prototype\`. Геттер возвращает \`[[Prototype]]\`, сеттер устанавливает его. Существует у любого объекта, наследующего от \`Object.prototype\`. В современном коде использовать не рекомендуется: \`__proto__\` теряется у объекта, созданного через \`Object.create(null)\`, и плохо оптимизируется движком при изменении.

**\`Foo.prototype\`** — обычное свойство **функции** \`Foo\`. Это объект, который JS установит как \`[[Prototype]]\` для нового экземпляра, созданного через \`new Foo()\`. У обычных объектов и стрелочных функций свойства \`prototype\` нет.

\`\`\`js
function Foo() {}
const f = new Foo();

// Связь между prototype и [[Prototype]]:
Object.getPrototypeOf(f) === Foo.prototype; // true — задано оператором new
f.__proto__ === Foo.prototype;              // true — то же самое, через __proto__
Foo.prototype.constructor === Foo;          // true — обратная ссылка

// Только функции имеют prototype:
({}).prototype;                  // undefined
(() => {}).prototype;            // undefined — у стрелочных функций нет
(function () {}).prototype;      // {} — у обычных функций есть
\`\`\`

**Стандартные API для работы с прототипом:**
- Чтение: \`Object.getPrototypeOf(obj)\` — всегда работает.
- Установка при создании: \`Object.create(proto)\` — рекомендуемый способ.
- Установка после создания: \`Object.setPrototypeOf(obj, proto)\` — допустимо, но дорого по производительности.

Использовать \`__proto__\` стоит только при отладке в DevTools, в продакшен-коде — \`Object.getPrototypeOf\`.`,
      followUps: [
        'Что вернёт Object.create(null).__proto__?',
        'Почему изменение __proto__ существующего объекта замедляет код?',
      ],
      relatedChapterId: 'instanceof-and-checks',
    },
    {
      id: 'jspr-iq5',
      question: 'Как реализовать наследование между двумя сущностями через Object.create без class?',
      shortAnswer:
        'Три шага: (1) в конструкторе ребёнка вызвать конструктор родителя через Parent.call(this, ...args); (2) установить Child.prototype = Object.create(Parent.prototype); (3) восстановить Child.prototype.constructor = Child. Только тогда экземпляр получит и собственные поля, и прототипные методы, и корректный instanceof.',
      fullAnswer: `Без \`class\` наследование строится вручную из трёх шагов. Покажем на примере \`Animal\` → \`Dog\`.

\`\`\`js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return \`\${this.name} говорит\`;
};

function Dog(name, breed) {
  Animal.call(this, name);   // (1) инициализация полей родителя
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype); // (2) цепочка прототипов
Dog.prototype.constructor = Dog;                 // (3) восстановление constructor

Dog.prototype.bark = function () {
  return \`\${this.name} лает!\`;
};

const rex = new Dog('Рекс', 'хаски');
rex.speak();             // 'Рекс говорит'  — из Animal.prototype
rex.bark();              // 'Рекс лает!'    — из Dog.prototype
rex instanceof Dog;      // true
rex instanceof Animal;   // true
rex.constructor === Dog; // true            — благодаря шагу 3
\`\`\`

**Почему важен каждый шаг:**

1. **\`Animal.call(this, name)\`** запускает тело конструктора \`Animal\` с \`this\` = новый Dog-объект. Без этого шага \`rex.name\` останется \`undefined\` — поля родителя не инициализируются автоматически.
2. **\`Dog.prototype = Object.create(Animal.prototype)\`** создаёт новый объект, у которого \`[[Prototype]]\` = \`Animal.prototype\`. Это и есть «класс наследует от класса». Без этого \`rex.speak()\` бросит \`TypeError\`.
3. **\`Dog.prototype.constructor = Dog\`** восстанавливает обратную ссылку. Шаг 2 заменил весь \`Dog.prototype\`, и \`Dog.prototype.constructor\` теперь указывает на \`Animal\`. Это ломает фабричные паттерны вида \`new this.constructor()\` и логирование.

**Антипаттерны, ломающие схему:**
- \`Dog.prototype = Animal.prototype\` — теперь любой метод, добавленный в \`Dog.prototype\`, появится и в \`Animal.prototype\`: они один объект.
- \`Dog.prototype = new Animal()\` — старый стиль, имеет тот же эффект, но дополнительно вызывает конструктор Animal без аргументов и оставляет лишние поля.

ES2015 \`class Dog extends Animal\` делает все три шага автоматически и плюс настраивает \`Dog.[[Prototype]] = Animal\` для наследования static-методов.`,
      followUps: [
        'Что вернёт rex.constructor, если забыть шаг 3?',
        'Чем Dog.prototype = Object.create(Animal.prototype) лучше, чем Dog.prototype = new Animal()?',
      ],
      relatedChapterId: 'object-create-and-inheritance',
    },
    {
      id: 'jspr-iq6',
      question: 'Что делает оператор new под капотом и почему его поведение завязано на prototype?',
      shortAnswer:
        'new создаёт пустой объект, устанавливает его [[Prototype]] = Constructor.prototype, вызывает Constructor с this = новый объект и возвращает его. Если конструктор явно вернул другой объект — возвращается он. Привязка [[Prototype]] к Constructor.prototype — это и есть «связь экземпляр → класс».',
      fullAnswer: `Оператор \`new Constructor(...args)\` выполняет четыре шага:

1. Создаёт новый пустой объект \`obj\`.
2. Устанавливает \`Object.getPrototypeOf(obj) = Constructor.prototype\`.
3. Вызывает \`Constructor.apply(obj, args)\`.
4. Если шаг 3 вернул объект — возвращает его, иначе возвращает \`obj\`.

Реализация вручную:

\`\`\`js
function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype); // шаги 1–2
  const result = Constructor.apply(obj, args);      // шаг 3
  return (result !== null && typeof result === 'object') ? result : obj; // шаг 4
}
\`\`\`

Из этой логики напрямую следуют ответы на смежные вопросы:

- **Почему \`new Foo() instanceof Foo\`?** \`instanceof\` проверяет цепочку прототипов на наличие \`Foo.prototype\`. На шаге 2 движок именно его туда и положил.
- **Почему \`new\` имеет высший приоритет над \`bind\`?** Привязка \`[[Prototype]]\` происходит на шаге 2 безусловно, независимо от привязанного через \`bind\` контекста. На шаге 3 \`Constructor.apply(obj, args)\` фактически игнорирует hard binding, если функция вызвана через \`new\`.
- **Зачем шаг 4 «если конструктор вернул объект»?** Это используется в фабриках и singleton-паттерне: конструктор может вернуть кеш-объект вместо нового.
- **Что произойдёт со стрелочной функцией?** Стрелочные функции не имеют \`prototype\` и в спецификации помечены как «не-конструируемые» — \`new (() => {})()\` сразу бросит \`TypeError\`.

Понимание этих шагов — must-have для собеседования: на нём базируются вопросы про \`Object.create\` (это шаг 1+2), про \`instanceof\` (использует шаг 2), про hard binding и про реализацию своих фабрик.`,
      followUps: [
        'Что вернёт `new Constructor()`, если конструктор вернёт примитив?',
        'Почему стрелочную функцию нельзя вызвать через new?',
      ],
      relatedChapterId: 'class-as-sugar',
    },
    {
      id: 'jspr-iq7',
      question: 'В чём разница между приватными #полями и приватностью через замыкание или WeakMap?',
      shortAnswer:
        '#field — синтаксическая приватность: обращение снаружи класса — SyntaxError на этапе парсинга. Замыкание изолирует переменную через scope: тоже приватно, но переменная отвязана от объекта. WeakMap — старый паттерн, ассоциирует приватные данные с экземпляром через слабую ссылку.',
      fullAnswer: `В JavaScript есть три устоявшихся способа сделать приватные данные.

**1) Приватные \`#field\` (ES2022).** Поле объявляется с префиксом \`#\` в теле класса. Обращение к нему вне кода класса — синтаксическая ошибка на этапе парсинга, не runtime-ошибка. Поля корректно работают с \`instanceof\`, наследованием и приватны от подклассов.

\`\`\`js
class Account {
  #balance = 0;
  deposit(n) { this.#balance += n; }
  get balance() { return this.#balance; }
}
new Account().#balance; // SyntaxError
\`\`\`

**2) Приватность через замыкание.** Переменная объявляется в области видимости фабричной функции; методы замкнуты на неё.

\`\`\`js
function makeAccount() {
  let balance = 0;
  return {
    deposit(n) { balance += n; },
    get balance() { return balance; },
  };
}
\`\`\`

Минусы: переменные не привязаны к объекту — они живут в scope. На больших коллекциях экземпляров расход памяти выше: каждое \`makeAccount()\` создаёт свой набор функций, методы не разделяются через прототип.

**3) WeakMap (старый трюк до ES2022).** В модуле объявляется \`const _balance = new WeakMap()\`, методы класса пишут в \`_balance.set(this, value)\` и читают \`_balance.get(this)\`.

\`\`\`js
const _balance = new WeakMap();
class Account {
  constructor() { _balance.set(this, 0); }
  deposit(n) { _balance.set(this, _balance.get(this) + n); }
  get balance() { return _balance.get(this); }
}
\`\`\`

Минусы: многословно, методы загромождены вызовами \`get\`/\`set\`. Плюс: при потере ссылки на экземпляр данные автоматически собираются GC.

**Сравнение:**

| Аспект | \`#field\` | Замыкание | WeakMap |
|---|---|---|---|
| Поддержка | ES2022, Node 12+ | везде | ES2015 |
| Где живут данные | на экземпляре | в scope | в WeakMap |
| Методы общие через прототип | да | нет | да |
| Защита | синтаксис | scope | модульная инкапсуляция |
| Расход памяти | низкий | выше | низкий |

**Рекомендация.** В новом коде — \`#field\`. WeakMap уместен в библиотеках, поддерживающих старые рантаймы. Замыкание — для функционального стиля без классов.`,
      followUps: [
        'Можно ли получить доступ к #field через Reflect или Proxy?',
        'Что произойдёт, если унаследовать класс с #field и обратиться к нему в подклассе?',
      ],
      relatedChapterId: 'class-as-sugar',
    },
  ],

  nextTopics: [
    {
      slug: 'js-async',
      reason: 'Promise — это объект с цепочкой прототипов; async-функции возвращают экземпляры Promise.',
    },
    {
      slug: 'js-dom',
      reason: 'Все DOM-узлы выстроены в прототипную иерархию (Node → Element → HTMLElement → HTMLButtonElement).',
    },
  ],

  related: [
    { kind: 'pitfall', id: 'prototype-mutation', label: 'JS-ловушки: расширение Array.prototype в production' },
    { kind: 'pattern', id: 'object-create-null', label: 'Паттерн: Object.create(null) как безопасный словарь' },
  ],
};
