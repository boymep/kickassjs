import type { Problem } from '../../types/problem';

export const jsPrototypesProblems: Problem[] = [
  {
    id: 'jsp-p1',
    topicId: 'js-prototypes',
    title: 'myInstanceof — реализовать instanceof',
    difficulty: 'medium',
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
    functionName: 'myInstanceof_test',
    starterCode: `function myInstanceof(obj, Constructor) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsp-p1-t1',
        inputDisplay: 'myInstanceof([], Array)',
        inputArgs: [[], 'Array'],
        expected: true,
      },
      {
        id: 'jsp-p1-t2',
        inputDisplay: 'myInstanceof([], Object)',
        inputArgs: [[], 'Object'],
        expected: true,
      },
      {
        id: 'jsp-p1-t3',
        inputDisplay: 'myInstanceof([], String)',
        inputArgs: [[], 'String'],
        expected: false,
      },
      {
        id: 'jsp-p1-t4',
        inputDisplay: 'myInstanceof(null, Object)',
        inputArgs: [null, 'Object'],
        expected: false,
      },
      {
        id: 'jsp-p1-t5',
        inputDisplay: 'myInstanceof(new Date(), Date)',
        inputArgs: ['date', 'Date'],
        expected: true,
      },
    ],
    hints: [
      'Начните с получения прототипа объекта: `let proto = Object.getPrototypeOf(obj)`.',
      'В цикле while: если `proto === Constructor.prototype` → return true. Иначе: `proto = Object.getPrototypeOf(proto)`.',
      'Цикл заканчивается когда `proto === null` (достигли конца цепочки) → return false.',
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
    id: 'jsp-p2',
    topicId: 'js-prototypes',
    title: 'Array.prototype.myMap',
    difficulty: 'easy',
    isContextual: false,
    description: `Реализуйте свой метод \`Array.prototype.myMap\`, аналог встроенного \`Array.prototype.map\`.

Метод должен:
- Принимать callback \`(element, index, array) => newValue\`
- Возвращать новый массив с результатами callback для каждого элемента
- Не изменять оригинальный массив
- Пропускать "дырки" (sparse arrays)

Примеры:
\`\`\`
[1, 2, 3].myMap(x => x * 2);  // → [2, 4, 6]
[1, 2, 3].myMap((x, i) => x + i); // → [1, 3, 5]
\`\`\``,
    functionName: 'myMap_test',
    starterCode: `Array.prototype.myMap = function(callback) {
  // ваш код
};`,
    testCases: [
      {
        id: 'jsp-p2-t1',
        inputDisplay: '[1,2,3].myMap(x => x * 2)',
        inputArgs: [[1, 2, 3], 'double'],
        expected: [2, 4, 6],
      },
      {
        id: 'jsp-p2-t2',
        inputDisplay: '[].myMap(x => x) → []',
        inputArgs: [[], 'identity'],
        expected: [],
      },
      {
        id: 'jsp-p2-t3',
        inputDisplay: 'callback получает (element, index, array)',
        inputArgs: [[10, 20], 'index'],
        expected: [10, 21],
      },
      {
        id: 'jsp-p2-t4',
        inputDisplay: 'не изменяет оригинальный массив',
        inputArgs: [[1, 2, 3], 'immutable'],
        expected: true,
      },
      {
        id: 'jsp-p2-t5',
        inputDisplay: "['a','b','c'].myMap(x => x.toUpperCase())",
        inputArgs: [['a', 'b', 'c'], 'upper'],
        expected: ['A', 'B', 'C'],
      },
    ],
    hints: [
      'Создайте новый массив `result = []`. Итерируйте по `this` с помощью for-цикла.',
      'Проверяйте `hasOwnProperty(i)` для пропуска "дырок" в sparse arrays.',
      'Вызывайте `callback(this[i], i, this)` для каждого элемента.',
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
    id: 'jsp-p3',
    topicId: 'js-prototypes',
    title: 'Наследование без class',
    difficulty: 'medium',
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
    functionName: 'Dog_test',
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
        id: 'jsp-p3-t1',
        inputDisplay: 'new Dog("Rex").bark()',
        inputArgs: ['bark'],
        expected: 'Rex лает!',
      },
      {
        id: 'jsp-p3-t2',
        inputDisplay: 'new Dog("Rex").speak()',
        inputArgs: ['speak'],
        expected: 'Rex издаёт звук',
      },
      {
        id: 'jsp-p3-t3',
        inputDisplay: 'rex instanceof Dog',
        inputArgs: ['instanceof-dog'],
        expected: true,
      },
      {
        id: 'jsp-p3-t4',
        inputDisplay: 'rex instanceof Animal',
        inputArgs: ['instanceof-animal'],
        expected: true,
      },
      {
        id: 'jsp-p3-t5',
        inputDisplay: 'dog.name установлен через Animal',
        inputArgs: ['name'],
        expected: 'Rex',
      },
    ],
    hints: [
      'В конструкторе Dog: `Animal.call(this, name)` — вызывает Animal как функцию с контекстом нового объекта.',
      'Настройка цепочки: `Dog.prototype = Object.create(Animal.prototype)` — Dog.prototype наследует от Animal.prototype.',
      'После этого нужно восстановить конструктор: `Dog.prototype.constructor = Dog`.',
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
    id: 'jsp-p4',
    topicId: 'js-prototypes',
    title: 'deepFreeze — глубокая заморозка',
    difficulty: 'medium',
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
    functionName: 'deepFreeze_test',
    starterCode: `function deepFreeze(obj) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsp-p4-t1',
        inputDisplay: 'верхний уровень заморожен',
        inputArgs: ['top-frozen'],
        expected: true,
      },
      {
        id: 'jsp-p4-t2',
        inputDisplay: 'вложенный объект заморожен',
        inputArgs: ['nested-frozen'],
        expected: true,
      },
      {
        id: 'jsp-p4-t3',
        inputDisplay: 'значение не изменяется после заморозки',
        inputArgs: ['no-change'],
        expected: 5432,
      },
      {
        id: 'jsp-p4-t4',
        inputDisplay: 'работает с массивами внутри',
        inputArgs: ['array-frozen'],
        expected: true,
      },
      {
        id: 'jsp-p4-t5',
        inputDisplay: 'возвращает тот же объект',
        inputArgs: ['same-ref'],
        expected: true,
      },
    ],
    hints: [
      'Сначала заморозьте объект: `Object.freeze(obj)`.',
      'Затем рекурсивно обойдите все свойства. Для каждого значения-объекта (не null, typeof === "object") вызовите deepFreeze.',
      'Проверяйте `!Object.isFrozen(val)` перед рекурсией, чтобы не попасть в бесконечный цикл с циклическими ссылками.',
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
    id: 'jsp-p5',
    topicId: 'js-prototypes',
    title: 'myObjectCreate — реализовать Object.create',
    difficulty: 'easy',
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
    functionName: 'myObjectCreate_test',
    starterCode: `function myObjectCreate(proto) {
  // ваш код — нельзя использовать Object.create!
}`,
    testCases: [
      {
        id: 'jsp-p5-t1',
        inputDisplay: 'наследует методы из прототипа',
        inputArgs: ['method'],
        expected: 'hello',
      },
      {
        id: 'jsp-p5-t2',
        inputDisplay: 'Object.getPrototypeOf(child) === proto',
        inputArgs: ['prototype'],
        expected: true,
      },
      {
        id: 'jsp-p5-t3',
        inputDisplay: 'myObjectCreate(null) → нет прототипа',
        inputArgs: ['null-proto'],
        expected: null,
      },
      {
        id: 'jsp-p5-t4',
        inputDisplay: 'у объекта нет собственных свойств',
        inputArgs: ['no-own'],
        expected: 0,
      },
      {
        id: 'jsp-p5-t5',
        inputDisplay: 'изменение прото после создания видно в child',
        inputArgs: ['live-ref'],
        expected: 'world',
      },
    ],
    hints: [
      'Используйте конструктор-заглушку: `function F() {}; F.prototype = proto; return new F()`.',
      'Это классическая реализация до появления стандартного Object.create.',
      'Для null-прототипа: у объектов, созданных через `new F()`, прототип будет `F.prototype`. Если `proto === null`, то `F.prototype = null` — так и создаётся объект без прототипа.',
    ],
    solutionCode: `function myObjectCreate(proto) {
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
];
