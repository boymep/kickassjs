import type { Problem } from "../../types/problem";

export const jsPrototypesProblems: Problem[] = [
  {
    kind: "predict-output",
    id: "jsp-p6",
    topicId: "js-prototypes",
    title: "Определи вывод: переопределение метода в цепочке",
    difficulty: "easy",
    isContextual: false,
    description: `Что выведет этот код по строкам? Введите ответ построчно — по одному значению на строку.`,
    code: `class Animal {
  speak() { return 'generic'; }
}
class Dog extends Animal {
  speak() { return super.speak() + ' → woof'; }
}
class Poodle extends Dog {}

const a = new Animal();
const d = new Dog();
const p = new Poodle();

console.log(a.speak());
console.log(d.speak());
console.log(p.speak());
console.log(p instanceof Animal);`,
    expected: "generic\ngeneric → woof\ngeneric → woof\ntrue",
    hints: [
      "Шаг 1: при вызове `obj.speak()` JavaScript ищет метод сначала на самом объекте, потом поднимается вверх — куда именно?",
      "Шаг 2: цепочка прототипов здесь такая — `p → Poodle.prototype → Dog.prototype → Animal.prototype → Object.prototype`. `instanceof X` отвечает `true`, если `X.prototype` встречается где-то в этой цепочке.",
      "Шаг 3: `a.speak()` находит метод на `Animal.prototype` → `'generic'`. `d.speak()` берёт `Dog.prototype.speak`, внутри `super.speak()` поднимается до `Animal.prototype.speak` → `'generic → woof'`. `p.speak()` — у `Poodle.prototype` своего метода нет, поэтому используется тот же `Dog.prototype.speak` → `'generic → woof'`. `p instanceof Animal` → `true`, потому что `Animal.prototype` лежит выше по цепочке.",
    ],
    solutionCode: `// a.speak(): найдено на Animal.prototype → 'generic'.
// d.speak(): найдено на Dog.prototype, super.speak() = 'generic' → 'generic → woof'.
// p.speak(): Poodle.prototype не имеет speak, поднимаемся в Dog.prototype, далее всё как у d → 'generic → woof'.
// p instanceof Animal: цепочка Poodle.prototype → Dog.prototype → Animal.prototype → true.`,
  },
  {
    kind: "find-bug",
    id: "jsp-p7",
    topicId: "js-prototypes",
    title: "Найдите баг: constructor после наследования через прототип",
    difficulty: "medium",
    isContextual: false,
    description: `Класс Dog наследует от Animal через ручную сборку прототипа. Но что-то не так: после создания экземпляра \`new Dog('Rex').constructor\` указывает не на Dog. Найдите и почини баг, чтобы все тесты прошли.`,
    buggyCode: `function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return this.name + ' издаёт звук';
};

function Dog(name) {
  Animal.call(this, name);
}
Dog.prototype = Object.create(Animal.prototype);

Dog.prototype.bark = function () {
  return this.name + ' лает!';
};`,
    functionName: "jsp_p7_test",
    bugSummary:
      "После `Dog.prototype = Object.create(Animal.prototype)` свойство `constructor` стало наследоваться от Animal.prototype и указывает на Animal. Это ломает фабричные паттерны вида `new this.constructor()`. Лечится одной строкой: `Dog.prototype.constructor = Dog`.",
    testCases: [
      {
        id: "jsp-p7-t1",
        inputDisplay: 'new Dog("Rex").bark()',
        inputArgs: ["bark"],
        expected: "Rex лает!",
      },
      {
        id: "jsp-p7-t2",
        inputDisplay: 'new Dog("Rex").speak()',
        inputArgs: ["speak"],
        expected: "Rex издаёт звук",
      },
      {
        id: "jsp-p7-t3",
        inputDisplay: 'new Dog("Rex").constructor === Dog',
        inputArgs: ["ctor-dog"],
        expected: true,
      },
      {
        id: "jsp-p7-t4",
        inputDisplay: 'new Dog("Rex") instanceof Dog',
        inputArgs: ["inst-dog"],
        expected: true,
      },
      {
        id: "jsp-p7-t5",
        inputDisplay: 'new Dog("Rex") instanceof Animal',
        inputArgs: ["inst-animal"],
        expected: true,
      },
    ],
    hints: [
      "По умолчанию у любой функции `F` объект `F.prototype` содержит автоматически созданное свойство, которое ссылается обратно на саму функцию. Что произойдёт с этой ссылкой, если вы целиком замените `Dog.prototype` другим объектом?",
      "Это поле называется `constructor`. После `Dog.prototype = Object.create(Animal.prototype)` оно начинает приходить из `Animal.prototype` и указывает на `Animal`, а не на `Dog`. Из-за этого `new Dog(...).constructor === Dog` ломается.",
      "Тонкость: `instanceof` смотрит на цепочку прототипов и продолжит работать корректно — её мы не ломаем. Ломается только `.constructor`, потому что в JS это обычное перезаписываемое свойство, а не магическая связь. Поэтому достаточно вручную вернуть `Dog.prototype.constructor` на `Dog` сразу после переназначения прототипа — одна строка решает проблему.",
    ],
    solutionCode: `function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return this.name + ' издаёт звук';
};

function Dog(name) {
  Animal.call(this, name);
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function () {
  return this.name + ' лает!';
};`,
    testHelperCode: `function jsp_p7_test(arg) {
  if (arg === 'bark') return new Dog('Rex').bark();
  if (arg === 'speak') return new Dog('Rex').speak();
  if (arg === 'ctor-dog') return new Dog('Rex').constructor === Dog;
  if (arg === 'inst-dog') return new Dog('Rex') instanceof Dog;
  if (arg === 'inst-animal') return new Dog('Rex') instanceof Animal;
}`,
  },
  {
    kind: "refactor",
    id: "jsp-p8",
    topicId: "js-prototypes",
    title: "Перепишите: прототипное наследование → ES2015 class",
    difficulty: "medium",
    isContextual: false,
    description: `Дан рабочий код с ручным прототипным наследованием в стиле ES5. Перепишите его на современный синтаксис \`class\` / \`extends\` / \`super\`.

Поведение должно остаться идентичным:
- \`new Square(3).area()\` → \`9\`
- \`new Square(3).describe()\` → \`'Фигура: square, площадь 9'\`
- \`new Square(3) instanceof Shape\` → \`true\``,
    functionName: "jsp_p8_test",
    starterCode: `function Shape(kind) {
  this.kind = kind;
}
Shape.prototype.describe = function () {
  return 'Фигура: ' + this.kind + ', площадь ' + this.area();
};
Shape.prototype.area = function () {
  return 0;
};

function Square(side) {
  Shape.call(this, 'square');
  this.side = side;
}
Square.prototype = Object.create(Shape.prototype);
Square.prototype.constructor = Square;
Square.prototype.area = function () {
  return this.side * this.side;
};`,
    testCases: [
      {
        id: "jsp-p8-t1",
        inputDisplay: "new Square(3).area()",
        inputArgs: ["area"],
        expected: 9,
      },
      {
        id: "jsp-p8-t2",
        inputDisplay: "new Square(4).area()",
        inputArgs: ["area4"],
        expected: 16,
      },
      {
        id: "jsp-p8-t3",
        inputDisplay: "new Square(3).describe()",
        inputArgs: ["describe"],
        expected: "Фигура: square, площадь 9",
      },
      {
        id: "jsp-p8-t4",
        inputDisplay: "new Square(3) instanceof Shape",
        inputArgs: ["inst-shape"],
        expected: true,
      },
      {
        id: "jsp-p8-t5",
        inputDisplay: "new Square(3) instanceof Square",
        inputArgs: ["inst-square"],
        expected: true,
      },
    ],
    hints: [
      "Перенесите функции-конструкторы и их прототипные методы в формат, где конструктор и методы описаны вместе как единое определение типа.",
      "Используйте `class`, `extends` и `super(...)`: вызов родительского конструктора через `super` должен идти первой строкой конструктора дочернего класса, до любого обращения к `this`. Методы пишутся сразу в теле класса, без `prototype`.",
      `Главная ловушка перехода — порядок в дочернем конструкторе: до вызова \`super(...)\` обращение к \`this\` бросит \`ReferenceError\`. Поэтому \`super('square')\` обязательно идёт первой строкой, и только после него можно записывать \`this.side\`. Все методы в теле класса автоматически попадают на \`prototype\`, так что \`Square.prototype.area\` создавать руками уже не надо.

С чего начать:
\`\`\`js
class Shape {
  constructor(kind) { /* ... */ }
}
class Square extends Shape {
  constructor(side) {
    super('square');
    // ...
  }
}
\`\`\``,
    ],
    solutionCode: `class Shape {
  constructor(kind) {
    this.kind = kind;
  }
  describe() {
    return 'Фигура: ' + this.kind + ', площадь ' + this.area();
  }
  area() {
    return 0;
  }
}

class Square extends Shape {
  constructor(side) {
    super('square');
    this.side = side;
  }
  area() {
    return this.side * this.side;
  }
}`,
    testHelperCode: `function jsp_p8_test(arg) {
  if (arg === 'area') return new Square(3).area();
  if (arg === 'area4') return new Square(4).area();
  if (arg === 'describe') return new Square(3).describe();
  if (arg === 'inst-shape') return new Square(3) instanceof Shape;
  if (arg === 'inst-square') return new Square(3) instanceof Square;
}`,
  },
  {
    id: "jsp-p1",
    topicId: "js-prototypes",
    title: "myInstanceof — реализовать instanceof",
    difficulty: "medium",
    isContextual: false,
    description: `Реализуйте функцию \`myInstanceof(obj, Constructor)\` без использования оператора \`instanceof\`.

Функция должна проверять, присутствует ли \`Constructor.prototype\` в цепочке прототипов \`obj\`.

Примеры:
\`\`\`
myInstanceof([], Array);      // → true
myInstanceof([], Object);     // → true (Array → Object)
myInstanceof([], String);     // → false
myInstanceof({}, Object);     // → true
myInstanceof(null, Object);   // → false
\`\`\``,
    functionName: "myInstanceof_test",
    starterCode: `function myInstanceof(obj, Constructor) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsp-p1-t1",
        inputDisplay: "myInstanceof([], Array)",
        inputArgs: [[], "Array"],
        expected: true,
      },
      {
        id: "jsp-p1-t2",
        inputDisplay: "myInstanceof([], Object)",
        inputArgs: [[], "Object"],
        expected: true,
      },
      {
        id: "jsp-p1-t3",
        inputDisplay: "myInstanceof([], String)",
        inputArgs: [[], "String"],
        expected: false,
      },
      {
        id: "jsp-p1-t4",
        inputDisplay: "myInstanceof(null, Object)",
        inputArgs: [null, "Object"],
        expected: false,
      },
      {
        id: "jsp-p1-t5",
        inputDisplay: "myInstanceof(new Date(), Date)",
        inputArgs: ["date", "Date"],
        expected: true,
      },
    ],
    hints: [
      "У каждого объекта есть «родительский» объект, у того — свой и так далее, пока цепочка не упрётся в `null`. `instanceof` отвечает «да», если где-то в этой цепочке встречается определённый объект — какой именно?",
      "`instanceof` проверяет, есть ли `Constructor.prototype` в цепочке прототипов `obj`. Двигаться по цепочке можно через `Object.getPrototypeOf(obj)`. Не забудьте отдельно обработать `null`/`undefined` — у них нет прототипа.",
      `Ключевая идея: \`instanceof\` — это не проверка типа, а именно поиск конкретного объекта (\`Constructor.prototype\`) в цепочке прототипов экземпляра. Поэтому \`[] instanceof Object\` истинно — \`Object.prototype\` лежит выше по цепочке. Граничный случай — \`null\`/\`undefined\`: у них нет прототипа, любая попытка \`Object.getPrototypeOf(null)\` бросит ошибку, поэтому проверку нужно сделать до цикла.

С чего начать:
\`\`\`js
function myInstanceof(obj, Constructor) {
  if (obj == null) return false;
  let proto = Object.getPrototypeOf(obj);
  // ...
}
\`\`\``,
    ],
    solutionCode: `function myInstanceof(obj, Constructor) {
  if (obj === null || obj === undefined) return false;
  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {
    if (proto === Constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}`,
    testHelperCode: `function myInstanceof_test(obj, ctorName) {
  const ctors = { Array, Object, String, Date };
  const actual = obj === 'date' ? new Date() : obj;
  return myInstanceof(actual, ctors[ctorName]);
}`,
  },
  {
    id: "jsp-p2",
    topicId: "js-prototypes",
    title: "Array.prototype.myMap",
    difficulty: "easy",
    isContextual: false,
    description: `Реализуйте свой метод \`Array.prototype.myMap\`, аналог встроенного \`Array.prototype.map\`.

Метод должен:
- Принимать callback вида \`(element, index, array) => newValue\`
- Возвращать новый массив с результатами callback для каждого элемента
- Не изменять оригинальный массив
- Пропускать «дырки» в разреженных массивах — пустые ячейки между индексами, например \`[1, , 3]\`

Примеры:
\`\`\`
[1, 2, 3].myMap(x => x * 2);  // → [2, 4, 6]
[1, 2, 3].myMap((x, i) => x + i); // → [1, 3, 5]
\`\`\``,
    functionName: "myMap_test",
    starterCode: `Array.prototype.myMap = function(callback) {
  // ваш код
};`,
    testCases: [
      {
        id: "jsp-p2-t1",
        inputDisplay: "[1,2,3].myMap(x => x * 2)",
        inputArgs: [[1, 2, 3], "double"],
        expected: [2, 4, 6],
      },
      {
        id: "jsp-p2-t2",
        inputDisplay: "[].myMap(x => x) → []",
        inputArgs: [[], "identity"],
        expected: [],
      },
      {
        id: "jsp-p2-t3",
        inputDisplay: "callback получает (element, index, array)",
        inputArgs: [[10, 20], "index"],
        expected: [10, 21],
      },
      {
        id: "jsp-p2-t4",
        inputDisplay: "не изменяет оригинальный массив",
        inputArgs: [[1, 2, 3], "immutable"],
        expected: true,
      },
      {
        id: "jsp-p2-t5",
        inputDisplay: "['a','b','c'].myMap(x => x.toUpperCase())",
        inputArgs: [["a", "b", "c"], "upper"],
        expected: ["A", "B", "C"],
      },
    ],
    hints: [
      "Метод вызывается как `arr.myMap(fn)` — внутри обычной (не стрелочной) функции есть ссылка на исходный массив. Через что? И помните: callback `map` получает не только элемент.",
      "Внутри метода `this` указывает на массив. У стандартного `map` callback принимает три аргумента: `(element, index, array)`. Для разреженного массива «дырки» нужно пропускать — проверяйте `Object.hasOwn(this, i)`.",
      `Тонкий момент — разреженные массивы вроде \`[1, , 3]\`: у них \`length\` равен 3, но индекс \`1\` физически не существует. Нативный \`map\` такие «дырки» пропускает, не вызывая колбэк, и сохраняет дырку в результате. Если просто пройтись \`for\` по \`length\` и читать \`this[i]\`, в дырке вы получите \`undefined\` и зря вызовете колбэк — поэтому нужна явная проверка существования индекса.

С чего начать:
\`\`\`js
Array.prototype.myMap = function (callback) {
  const result = new Array(this.length);
  // ...
  return result;
};
\`\`\``,
    ],
    solutionCode: `Array.prototype.myMap = function(callback) {
  const result = new Array(this.length);
  for (let i = 0; i < this.length; i++) {
    if (Object.hasOwn(this, i)) {
      result[i] = callback(this[i], i, this);
    }
  }
  return result;
};`,
    testHelperCode: `function myMap_test(arr, op) {
  if (op === 'double') return arr.myMap(x => x * 2);
  if (op === 'identity') return arr.myMap(x => x);
  if (op === 'index') return arr.myMap((x, i) => x + i);
  if (op === 'immutable') {
    const orig = arr.slice();
    arr.myMap(x => x * 2);
    return JSON.stringify(arr) === JSON.stringify(orig);
  }
  if (op === 'upper') return arr.myMap(x => x.toUpperCase());
}`,
  },
  {
    id: "jsp-p3",
    topicId: "js-prototypes",
    title: "Наследование без class",
    difficulty: "medium",
    isContextual: false,
    description: `Реализуйте прототипное наследование без использования ключевого слова \`class\`:

1. Функция-конструктор \`Animal(name)\` с методом \`speak()\` → \`"\${name} издаёт звук"\`
2. Функция-конструктор \`Dog(name)\`, наследующая от \`Animal\`, с методом \`bark()\` → \`"\${name} лает!"\`

\`Dog\` должен:
- Иметь собственные методы (\`bark\`)
- Наследовать методы \`Animal\` (\`speak\`)
- Правильно работать с \`instanceof\`

Примеры:
\`\`\`
const rex = new Dog('Rex');
rex.bark();               // → 'Rex лает!'
rex.speak();              // → 'Rex издаёт звук'
rex instanceof Dog;       // → true
rex instanceof Animal;    // → true
\`\`\``,
    functionName: "Dog_test",
    starterCode: `function Animal(name) {
  // ваш код
}
// добавьте Animal.prototype.speak

function Dog(name) {
  // ваш код — вызовите конструктор Animal
}
// настройте цепочку прототипов
// добавьте Dog.prototype.bark`,
    testCases: [
      {
        id: "jsp-p3-t1",
        inputDisplay: 'new Dog("Rex").bark()',
        inputArgs: ["bark"],
        expected: "Rex лает!",
      },
      {
        id: "jsp-p3-t2",
        inputDisplay: 'new Dog("Rex").speak()',
        inputArgs: ["speak"],
        expected: "Rex издаёт звук",
      },
      {
        id: "jsp-p3-t3",
        inputDisplay: "rex instanceof Dog",
        inputArgs: ["instanceof-dog"],
        expected: true,
      },
      {
        id: "jsp-p3-t4",
        inputDisplay: "rex instanceof Animal",
        inputArgs: ["instanceof-animal"],
        expected: true,
      },
      {
        id: "jsp-p3-t5",
        inputDisplay: "dog.name установлен через Animal",
        inputArgs: ["name"],
        expected: "Rex",
      },
    ],
    hints: [
      "Чтобы дочерний конструктор повторно использовал инициализацию родителя, нужно вызвать функцию-родитель так, чтобы `this` внутри неё указывал на уже создаваемый дочерний объект. Какой метод функции позволяет задать `this` явно?",
      "Используйте `Parent.call(this, ...)` внутри дочернего конструктора. Для наследования методов настройте цепочку через `Object.create(Parent.prototype)`. После этого восстановите `Dog.prototype.constructor = Dog` — иначе ссылка на конструктор будет указывать на Animal.",
      `Здесь два независимых механизма наследования, и оба нужны. \`Parent.call(this, ...)\` отвечает за **собственные** поля экземпляра (например, \`this.name\`) — без него у \`Dog\` просто не появится имени. А \`Object.create(Parent.prototype)\` строит цепочку прототипов для **методов** и для \`instanceof\`. Распространённая ошибка — присваивать \`Dog.prototype = Animal.prototype\` напрямую: тогда новые методы \`Dog\` потекут в \`Animal\` и сломают родителя.

С чего начать:
\`\`\`js
function Animal(name) { /* ... */ }
function Dog(name) {
  Animal.call(this, name);
}
Dog.prototype = Object.create(Animal.prototype);
// ...
\`\`\``,
    ],
    solutionCode: `function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return \`\${this.name} издаёт звук\`;
};

function Dog(name) {
  Animal.call(this, name);
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.bark = function() {
  return \`\${this.name} лает!\`;
};`,
    testHelperCode: `function Dog_test(arg) {
  if (arg === 'bark') return new Dog('Rex').bark();
  if (arg === 'speak') return new Dog('Rex').speak();
  if (arg === 'instanceof-dog') return new Dog('Rex') instanceof Dog;
  if (arg === 'instanceof-animal') return new Dog('Rex') instanceof Animal;
  if (arg === 'name') return new Dog('Rex').name;
}`,
  },
  {
    id: "jsp-p4",
    topicId: "js-prototypes",
    title: "deepFreeze — глубокая заморозка",
    difficulty: "medium",
    isContextual: false,
    description: `Напишите функцию \`deepFreeze(obj)\`, которая рекурсивно замораживает объект и все вложенные объекты через \`Object.freeze\`.

После \`deepFreeze\` нельзя изменить ни одно свойство — ни на верхнем уровне, ни в вложенных объектах.

Примеры:
\`\`\`
const config = deepFreeze({
  db: { host: 'localhost', port: 5432 },
  app: { name: 'myapp' },
});

config.db.port = 9999; // молча игнорируется (strict mode → TypeError)
config.db.port; // → 5432 — не изменилось
Object.isFrozen(config.db); // → true
\`\`\``,
    functionName: "deepFreeze_test",
    starterCode: `function deepFreeze(obj) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsp-p4-t1",
        inputDisplay: "верхний уровень заморожен",
        inputArgs: ["top-frozen"],
        expected: true,
      },
      {
        id: "jsp-p4-t2",
        inputDisplay: "вложенный объект заморожен",
        inputArgs: ["nested-frozen"],
        expected: true,
      },
      {
        id: "jsp-p4-t3",
        inputDisplay: "значение не изменяется после заморозки",
        inputArgs: ["no-change"],
        expected: 5432,
      },
      {
        id: "jsp-p4-t4",
        inputDisplay: "работает с массивами внутри",
        inputArgs: ["array-frozen"],
        expected: true,
      },
      {
        id: "jsp-p4-t5",
        inputDisplay: "возвращает тот же объект",
        inputArgs: ["same-ref"],
        expected: true,
      },
    ],
    hints: [
      "Стандартный «замораживатель» объектов работает только на верхнем уровне: вложенные объекты остаются изменяемыми. Как распространить заморозку вглубь?",
      "После `Object.freeze(obj)` пройдитесь по `Object.getOwnPropertyNames(obj)`. Для каждого значения-объекта рекурсивно вызовите `deepFreeze`. Чтобы не зациклиться на циклических ссылках — пропускайте уже замороженные объекты через `Object.isFrozen`.",
      `Главная ловушка — циклические ссылки: если \`a.self = a\`, наивная рекурсия зациклится и упадёт по стеку. Проверка \`Object.isFrozen\` спасает именно от этого: уже посещённый объект мы заморозили на входе, и при повторной встрече просто пропускаем. Ещё один нюанс — \`Object.freeze\` действует только в strict mode шумно (бросает \`TypeError\`), в нестрогом — молча игнорирует записи. Тесты должны это учитывать.

С чего начать:
\`\`\`js
function deepFreeze(obj) {
  Object.freeze(obj);
  // ...
  return obj;
}
\`\`\``,
    ],
    solutionCode: `function deepFreeze(obj) {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((key) => {
    const val = obj[key];
    if (val && typeof val === 'object' && !Object.isFrozen(val)) {
      deepFreeze(val);
    }
  });
  return obj;
}`,
    testHelperCode: `function deepFreeze_test(arg) {
  if (arg === 'top-frozen') {
    return Object.isFrozen(deepFreeze({ a: 1 }));
  }
  if (arg === 'nested-frozen') {
    return Object.isFrozen(deepFreeze({ db: { host: 'localhost' } }).db);
  }
  if (arg === 'no-change') {
    const obj = deepFreeze({ db: { port: 5432 } });
    try { obj.db.port = 9999; } catch(e) {}
    return obj.db.port;
  }
  if (arg === 'array-frozen') {
    return Object.isFrozen(deepFreeze({ items: [1, 2, 3] }).items);
  }
  if (arg === 'same-ref') {
    const original = { a: 1 };
    return deepFreeze(original) === original;
  }
}`,
  },
  {
    id: "jsp-p5",
    topicId: "js-prototypes",
    title: "myObjectCreate — реализовать Object.create",
    difficulty: "easy",
    isContextual: false,
    description: `Реализуйте функцию \`myObjectCreate(proto)\`, аналог \`Object.create\`:
- Создаёт новый объект с заданным прототипом
- Созданный объект наследует все свойства и методы из \`proto\`
- \`proto === null\` → объект без прототипа

Примеры:
\`\`\`
const base = { greet() { return 'hello'; } };
const child = myObjectCreate(base);
child.greet(); // → 'hello'
Object.getPrototypeOf(child) === base; // → true

const noProto = myObjectCreate(null);
Object.getPrototypeOf(noProto); // → null
\`\`\``,
    functionName: "myObjectCreate_test",
    starterCode: `function myObjectCreate(proto) {
  // ваш код — нельзя использовать Object.create!
}`,
    testCases: [
      {
        id: "jsp-p5-t1",
        inputDisplay: "наследует методы из прототипа",
        inputArgs: ["method"],
        expected: "hello",
      },
      {
        id: "jsp-p5-t2",
        inputDisplay: "Object.getPrototypeOf(child) === proto",
        inputArgs: ["prototype"],
        expected: true,
      },
      {
        id: "jsp-p5-t3",
        inputDisplay: "myObjectCreate(null) → нет прототипа",
        inputArgs: ["null-proto"],
        expected: null,
      },
      {
        id: "jsp-p5-t4",
        inputDisplay: "у объекта нет собственных свойств",
        inputArgs: ["no-own"],
        expected: 0,
      },
      {
        id: "jsp-p5-t5",
        inputDisplay: "изменение прото после создания видно в child",
        inputArgs: ["live-ref"],
        expected: "world",
      },
    ],
    hints: [
      "Когда вы пишете `new F()`, новый объект получает в качестве прототипа значение `F.prototype`. Как использовать это, чтобы «привязать» любой нужный прототип к свежему объекту?",
      "Создайте пустую функцию-конструктор, присвойте её `prototype` нужное значение и сделайте `new`. Для случая `proto === null` создайте объект буквально без прототипа — например, через литерал `{ __proto__: null }`.",
      `Идея решения опирается на устройство \`new\`: оператор всегда создаёт объект, чей прототип равен \`F.prototype\` в момент вызова. Подставив нужный объект в \`F.prototype\`, мы получаем «настраиваемый» прототип. Отдельная ветка нужна для \`null\` — у объекта без прототипа нет даже \`toString\` и \`hasOwnProperty\`, поэтому такие словари обычно используют как чистые карты ключ-значение, без риска коллизий с методами \`Object.prototype\`.

С чего начать:
\`\`\`js
function myObjectCreate(proto) {
  if (proto === null) return { __proto__: null };
  function F() {}
  // ...
}
\`\`\``,
    ],
    solutionCode: `function myObjectCreate(proto) {
  if (proto === null) {
    return { __proto__: null };
  }
  function F() {}
  F.prototype = proto;
  return new F();
}`,
    testHelperCode: `function myObjectCreate_test(arg) {
  const base = { greet() { return 'hello'; } };
  if (arg === 'method') return myObjectCreate(base).greet();
  if (arg === 'prototype') return Object.getPrototypeOf(myObjectCreate(base)) === base;
  if (arg === 'null-proto') return Object.getPrototypeOf(myObjectCreate(null));
  if (arg === 'no-own') return Object.keys(myObjectCreate(base)).length;
  if (arg === 'live-ref') {
    const proto = { val: 'hello' };
    const child = myObjectCreate(proto);
    proto.val = 'world';
    return child.val;
  }
}`,
  },
  {
    id: "jsp-h1",
    topicId: "js-prototypes",
    kind: "implement",
    title: "Реализуйте оператор new как функцию",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте функцию \`myNew(Constructor, ...args)\`, которая воспроизводит поведение оператора \`new\`:

1. Создаёт новый объект с прототипом \`Constructor.prototype\`
2. Вызывает \`Constructor\` с этим объектом в качестве \`this\`
3. Если конструктор вернул объект — возвращает его; иначе возвращает новый объект

Примеры:
\`\`\`
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.greet = function() {
  return 'Hi, ' + this.name;
};

const p = myNew(Person, 'Alice', 30);
p.name       // → 'Alice'
p.greet()    // → 'Hi, Alice'
p instanceof Person  // → true
\`\`\``,
    functionName: "myNew_test",
    starterCode: `function myNew(Constructor, ...args) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsp-h1-t1",
        inputDisplay: "own свойства задаются через this",
        inputArgs: ["own-props"],
        expected: "Alice",
      },
      {
        id: "jsp-h1-t2",
        inputDisplay: "методы прототипа доступны",
        inputArgs: ["proto-method"],
        expected: "Hi, Alice",
      },
      {
        id: "jsp-h1-t3",
        inputDisplay: "instanceof работает",
        inputArgs: ["instanceof"],
        expected: true,
      },
      {
        id: "jsp-h1-t4",
        inputDisplay: "конструктор возвращает объект — используется он",
        inputArgs: ["return-obj"],
        expected: "custom",
      },
      {
        id: "jsp-h1-t5",
        inputDisplay: "конструктор возвращает примитив — игнорируется",
        inputArgs: ["return-prim"],
        expected: 42,
      },
    ],
    hints: [
      "Под капотом `new Constructor(args)` выполняет три действия: создаёт новый объект с правильным прототипом, вызывает функцию с этим объектом в роли `this` и решает, что именно отдать наружу.",
      "Создайте новый объект через `Object.create(Constructor.prototype)`, затем вызовите конструктор через `Constructor.apply(obj, args)`. Если результат вызова — объект, верните его; иначе верните созданный `obj`.",
      `Самый неочевидный шаг — последний: спецификация \`new\` говорит, что если конструктор явно вернул **объект** (включая массив или функцию), наружу уходит именно он, и созданный с правильным прототипом \`obj\` отбрасывается. Если же возвращён примитив (число, строка, \`null\`, \`undefined\`) — он игнорируется, и наружу уходит \`obj\`. Именно поэтому \`null\` обрабатывается отдельно: у него \`typeof === 'object'\`, но по правилам \`new\` он считается «не объектом».

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
    testHelperCode: `function myNew_test(scenario) {
  function Person(name, age) { this.name = name; this.age = age; }
  Person.prototype.greet = function() { return 'Hi, ' + this.name; };

  if (scenario === 'own-props') return myNew(Person, 'Alice', 30).name;
  if (scenario === 'proto-method') return myNew(Person, 'Alice', 30).greet();
  if (scenario === 'instanceof') return myNew(Person, 'Alice', 30) instanceof Person;
  if (scenario === 'return-obj') {
    function Weird() { return { kind: 'custom' }; }
    return myNew(Weird).kind;
  }
  if (scenario === 'return-prim') {
    function WithNum() { this.val = 42; return 100; } // возвращает примитив
    return myNew(WithNum).val;
  }
}`,
  },
  {
    id: "jsp-h2",
    topicId: "js-prototypes",
    kind: "implement",
    title: "Mixin — множественное наследование через примеси",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте функцию \`applyMixins(Base, ...mixins)\`, которая создаёт новый класс, унаследованный от \`Base\` и включающий все методы из миксинов. Каждый миксин — это **объект с методами**, передаваемый отдельным аргументом.

Если один и тот же метод определён в нескольких миксинах — более поздний перекрывает более ранний.

Примеры:
\`\`\`
class Animal {
  constructor(name) { this.name = name; }
  speak() { return this.name + ' speaks'; }
}

const Swimmer = { swim() { return this.name + ' swims'; } };
const Flyer   = { fly() { return this.name + ' flies'; } };

const Duck = applyMixins(Animal, Swimmer, Flyer);
const d = new Duck('Donald');

d.speak()  // → 'Donald speaks'
d.swim()   // → 'Donald swims'
d.fly()    // → 'Donald flies'
d instanceof Animal  // → true
\`\`\``,
    functionName: "applyMixins_test",
    starterCode: `function applyMixins(Base, ...mixins) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsp-h2-t1",
        inputDisplay: "методы Base сохраняются",
        inputArgs: ["base-method"],
        expected: "Donald speaks",
      },
      {
        id: "jsp-h2-t2",
        inputDisplay: "методы миксинов доступны",
        inputArgs: ["mixin-methods"],
        expected: ["Donald swims", "Donald flies"],
      },
      {
        id: "jsp-h2-t3",
        inputDisplay: "instanceof Base работает",
        inputArgs: ["instanceof"],
        expected: true,
      },
      {
        id: "jsp-h2-t4",
        inputDisplay: "поздний миксин перекрывает ранний",
        inputArgs: ["override"],
        expected: "v2",
      },
    ],
      hints: [
      "JS не поддерживает множественное наследование классов. Но можно создать пустой подкласс `Base`, а затем «подмешать» в его прототип методы из произвольного количества объектов-источников.",
      "Используйте `Object.assign(Mixed.prototype, mixin)` для каждого миксина. Так как `Object.assign` перезаписывает свойства слева направо, более поздний миксин естественно перекроет более ранний.",
      `Важно понимать ограничения такой «множественности». Цепочка прототипов остаётся **линейной**: \`instanceof\` работает только для \`Base\`, но не для миксинов — они не классы и в цепочке не лежат. Конфликты имён разрешаются «последний победил» — это упрощает поведение, но требует осознанного порядка аргументов. И ещё нюанс: миксины обычно содержат только методы; если положить туда поля (через \`this.something = ...\`), их придётся инициализировать вручную где-то ещё.

С чего начать:
\`\`\`js
function applyMixins(Base, ...mixins) {
  class Mixed extends Base {}
  // ...
  return Mixed;
}
\`\`\``,
    ],
    solutionCode: `function applyMixins(Base, ...mixins) {
  class Mixed extends Base {}
  for (const mixin of mixins) {
    Object.assign(Mixed.prototype, mixin);
  }
  return Mixed;
}`,
    testHelperCode: `function applyMixins_test(scenario) {
  class Animal {
    constructor(name) { this.name = name; }
    speak() { return this.name + ' speaks'; }
  }
  const Swimmer = { swim() { return this.name + ' swims'; } };
  const Flyer   = { fly()  { return this.name + ' flies'; } };

  if (scenario === 'base-method') {
    const Duck = applyMixins(Animal, Swimmer, Flyer);
    return new Duck('Donald').speak();
  }
  if (scenario === 'mixin-methods') {
    const Duck = applyMixins(Animal, Swimmer, Flyer);
    const d = new Duck('Donald');
    return [d.swim(), d.fly()];
  }
  if (scenario === 'instanceof') {
    const Duck = applyMixins(Animal, Swimmer, Flyer);
    return new Duck('Donald') instanceof Animal;
  }
  if (scenario === 'override') {
    const M1 = { tag() { return 'v1'; } };
    const M2 = { tag() { return 'v2'; } };
    const C = applyMixins(Animal, M1, M2);
    return new C('x').tag();
  }
}`,
  },
  {
    id: "jsp-e2",
    topicId: "js-prototypes",
    kind: "predict-output",
    title: "Что выведет код: hasOwnProperty vs in",
    difficulty: "easy",
    isContextual: false,
    description: `Объект \`child\` создан через \`Object.create(parent)\` — поэтому \`parent\` оказывается в его цепочке прототипов. У \`child\` есть собственное свойство \`own\`, у \`parent\` — свойство \`inherited\`.

Что выведется?`,
    code: `const parent = { inherited: 1 };
const child = Object.create(parent);
child.own = 2;

console.log('own' in child);
console.log('inherited' in child);
console.log(child.hasOwnProperty('own'));
console.log(child.hasOwnProperty('inherited'));`,
    expected: 'true\ntrue\ntrue\nfalse',
    hints: [
      "Шаг 1: оператор `in` отвечает на вопрос «доступно ли это свойство через объект?» — он смотрит и на сам объект, и вверх по цепочке прототипов. `hasOwnProperty` отвечает только на «лежит ли это свойство непосредственно на объекте?» — без подъёма по цепочке.",
      "Шаг 2: `own` лежит прямо на `child` (`child.own = 2`), а `inherited` — на `parent`. `child` через `Object.create(parent)` имеет `parent` в цепочке прототипов.",
      "Шаг 3: `'own' in child` → `true` (своё). `'inherited' in child` → `true` (`in` поднимается до `parent`). `child.hasOwnProperty('own')` → `true` (своё). `child.hasOwnProperty('inherited')` → `false` (свойство есть только у `parent`).",
    ],
    solutionCode: `// 'own' in child              → true  (собственное свойство)
// 'inherited' in child        → true  (in проверяет всю цепочку прототипов)
// hasOwnProperty('own')       → true  (собственное свойство)
// hasOwnProperty('inherited') → false (не своё — унаследованное)`,
  },
  {
    id: "jsp-h3",
    topicId: "js-prototypes",
    kind: "implement",
    title: "deepClone — глубокое клонирование с сохранением прототипа",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте \`deepClone(value)\` — глубокое клонирование значения.

Требования:

- Объекты и массивы клонируются рекурсивно.
- **Прототип объекта сохраняется**: \`Object.getPrototypeOf(clone) === Object.getPrototypeOf(original)\`.
- Поддерживаются **циклические ссылки** — здесь поможет \`Map<original, clone>\`.
- Примитивы возвращаются как есть.
- \`Date\` клонируется как новая \`Date\` с тем же временем.
- \`null\` остаётся \`null\`.
- Функции и \`Symbol\` можно не поддерживать — это выходит за рамки задачи.

Хорошее упражнение на знание прототипного наследования и обхода объектов с циклами.`,
    functionName: 'deepClone_test',
    starterCode: `function deepClone(value) {
  // ваш код
}`,
    testCases: [
      { id: 'jsp-h3-t1', inputDisplay: "плоский объект → равен исходному", inputArgs: ['flat'], expected: true },
      { id: 'jsp-h3-t2', inputDisplay: "вложенный объект — клон независим", inputArgs: ['nested-independent'], expected: true },
      { id: 'jsp-h3-t3', inputDisplay: "массив + объекты внутри", inputArgs: ['array'], expected: true },
      { id: 'jsp-h3-t4', inputDisplay: "циклическая ссылка не вызывает переполнение стека", inputArgs: ['circular'], expected: 'cycle-handled' },
      { id: 'jsp-h3-t5', inputDisplay: "прототип сохраняется", inputArgs: ['preserve-proto'], expected: true },
      { id: 'jsp-h3-t6', inputDisplay: "Date клонируется", inputArgs: ['date'], expected: true },
      { id: 'jsp-h3-t7', inputDisplay: "примитивы возвращаются как есть", inputArgs: ['primitives'], expected: [42, 'hi', null, true] },
    ],
    hints: [
      "Простой рекурсивный обход застрянет на циклической ссылке и потеряет тип объекта. Нужно: запомнить, что уже клонировали, создавать клон того же «вида», что и оригинал, и отдельно обработать примитивы и специальные типы.",
      "Используйте `Map<original, clone>` для дедупликации и обработки циклов. Прототип сохраняйте через `Object.create(Object.getPrototypeOf(value))`. Для `Date` — `new Date(value.getTime())`, для массивов — `[]`. `null` отделите отдельной проверкой — у него `typeof === 'object'`.",
      `Ключевой приём — занести клон в \`Map\` **до** того, как обходить вложенные ключи. Если сделать наоборот, рекурсия по циклической ссылке снова попадёт в тот же объект, увидит, что его в \`seen\` нет, и зациклится. Отдельная ловушка — \`Object.assign({}, original)\`: он теряет прототип (всегда даёт обычный \`Object\`) и не копирует не-перечисляемые свойства, поэтому для сохранения класса экземпляра без \`Object.create(proto)\` не обойтись.

С чего начать:
\`\`\`js
function deepClone(value, seen = new Map()) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);
  // ...
}
\`\`\``,
    ],
    solutionCode: `function deepClone(value, seen = new Map()) {
  if (value === null || typeof value !== 'object') return value;
  if (value instanceof Date) return new Date(value.getTime());
  if (seen.has(value)) return seen.get(value);

  const proto = Object.getPrototypeOf(value);
  const clone = Array.isArray(value) ? [] : Object.create(proto);
  seen.set(value, clone);

  for (const key of Object.keys(value)) {
    clone[key] = deepClone(value[key], seen);
  }
  return clone;
}`,
    testHelperCode: `function deepClone_test(scenario) {
  if (scenario === 'flat') {
    const o = { a: 1, b: 'x' };
    const c = deepClone(o);
    return c !== o && c.a === 1 && c.b === 'x';
  }
  if (scenario === 'nested-independent') {
    const o = { inner: { v: 1 } };
    const c = deepClone(o);
    c.inner.v = 2;
    return o.inner.v === 1 && c.inner.v === 2;
  }
  if (scenario === 'array') {
    const o = [{ x: 1 }, { x: 2 }];
    const c = deepClone(o);
    c[0].x = 99;
    return Array.isArray(c) && o[0].x === 1 && c[0].x === 99;
  }
  if (scenario === 'circular') {
    const o = { name: 'root' };
    o.self = o;
    const c = deepClone(o);
    return c !== o && c.name === 'root' && c.self === c ? 'cycle-handled' : 'failed';
  }
  if (scenario === 'preserve-proto') {
    class Animal { speak() { return 'sound'; } }
    const a = new Animal();
    a.name = 'Rex';
    const c = deepClone(a);
    return c instanceof Animal && c.speak() === 'sound' && c.name === 'Rex';
  }
  if (scenario === 'date') {
    const d = new Date(2024, 0, 1);
    const c = deepClone(d);
    return c instanceof Date && c !== d && c.getTime() === d.getTime();
  }
  if (scenario === 'primitives') {
    return [deepClone(42), deepClone('hi'), deepClone(null), deepClone(true)];
  }
}`,
  },
  {
    id: "jsp-h4",
    topicId: "js-prototypes",
    kind: "implement",
    title: "inherit — ES5-наследование двух конструкторов",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте функцию \`inherit(Child, Parent)\`, которая настраивает **цепочку прототипов** так, чтобы:

1. \`Child.prototype\` наследовал все методы \`Parent.prototype\`.
2. \`new Child(...)\` был \`instanceof\` и для \`Child\`, и для \`Parent\`.
3. \`Child.prototype.constructor === Child\` (а не \`Parent\`).

Использовать \`class extends\` или \`Object.setPrototypeOf\` **нельзя**. Решение строится на \`Object.create\` и точечной правке \`constructor\`.

До ES2015 наследование в JS делалось именно так — полезное упражнение, чтобы понимать, что класс на самом деле делает под капотом.

Пример:
\`\`\`
function Animal(name) { this.name = name; }
Animal.prototype.greet = function () { return 'Hi, ' + this.name; };

function Dog(name, breed) {
  Animal.call(this, name);  // super-конструктор
  this.breed = breed;
}
inherit(Dog, Animal);

const d = new Dog('Rex', 'Lab');
d.greet();           // → 'Hi, Rex'
d instanceof Dog;    // → true
d instanceof Animal; // → true
\`\`\``,
    functionName: 'inherit_test',
    starterCode: `function inherit(Child, Parent) {
  // ваш код — без class extends и Object.setPrototypeOf
}`,
    testCases: [
      { id: 'jsp-h4-t1', inputDisplay: "методы родителя доступны через child", inputArgs: ['method-access'], expected: 'Hi, Rex' },
      { id: 'jsp-h4-t2', inputDisplay: "child instanceof child и parent", inputArgs: ['instanceof'], expected: [true, true] },
      { id: 'jsp-h4-t3', inputDisplay: "constructor правильный", inputArgs: ['constructor'], expected: true },
      { id: 'jsp-h4-t4', inputDisplay: "переопределение метода у child работает", inputArgs: ['override'], expected: 'Bark!' },
      { id: 'jsp-h4-t5', inputDisplay: "новые методы child не текут в parent", inputArgs: ['no-leak'], expected: true },
      { id: 'jsp-h4-t6', inputDisplay: "двойное наследование A → B → C работает", inputArgs: ['triple-chain'], expected: 'A.greet' },
    ],
    hints: [
      "Нужен новый объект для `Child.prototype`, который не равен `Parent.prototype`, но имеет `Parent.prototype` в своей цепочке прототипов. Так методы родителя будут доступны, но добавление методов в Child не повлияет на Parent.",
      "Используйте `Object.create(Parent.prototype)` — он возвращает новый объект, унаследованный от `Parent.prototype`. После присваивания не забудьте восстановить `Child.prototype.constructor = Child` — без этой строки `new Child().constructor` будет указывать на `Parent`.",
      `Почему именно \`Object.create(Parent.prototype)\`, а не \`Child.prototype = Parent.prototype\`? При прямом присваивании оба класса начинают делить **один и тот же** объект — добавление метода в \`Child.prototype\` тут же протекает в \`Parent.prototype\` и портит родителя. \`Object.create\` создаёт **новый** объект, у которого \`Parent.prototype\` находится выше по цепочке, — методы родителя доступны через делегирование, но не смешиваются. И, как и в более ранней задаче с constructor, при замене прототипа теряется ссылка на конструктор — её нужно восстановить вручную.

С чего начать:
\`\`\`js
function inherit(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  // ...
}
\`\`\``,
    ],
    solutionCode: `function inherit(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
}`,
    testHelperCode: `function inherit_test(scenario) {
  function Animal(name) { this.name = name; }
  Animal.prototype.greet = function () { return 'Hi, ' + this.name; };

  function Dog(name, breed) {
    Animal.call(this, name);
    this.breed = breed;
  }
  inherit(Dog, Animal);

  if (scenario === 'method-access') {
    return new Dog('Rex', 'Lab').greet();
  }
  if (scenario === 'instanceof') {
    const d = new Dog('Rex', 'Lab');
    return [d instanceof Dog, d instanceof Animal];
  }
  if (scenario === 'constructor') {
    const d = new Dog('Rex', 'Lab');
    return d.constructor === Dog;
  }
  if (scenario === 'override') {
    Dog.prototype.greet = function () { return 'Bark!'; };
    return new Dog('Rex', 'Lab').greet();
  }
  if (scenario === 'no-leak') {
    Dog.prototype.bark = function () { return 'woof'; };
    const a = new Animal('plain');
    return a.bark === undefined;
  }
  if (scenario === 'triple-chain') {
    function A() {}
    A.prototype.greet = function () { return 'A.greet'; };
    function B() {}
    inherit(B, A);
    function C() {}
    inherit(C, B);
    return new C().greet();
  }
}`,
  },
];
