import type { TopicTheory } from '../../types/topic';

export const jsThisTheory: TopicTheory = {
  topicId: 'js-this',
  sections: [
    {
      title: '4 правила определения this',
      blocks: [
        {
          type: 'text',
          content:
            '`this` в JavaScript — это не то, к чему привязана функция, а то, **как** она была вызвана. Существуют 4 правила определения значения `this`, применяемые в порядке приоритета.',
        },
        {
          type: 'heading',
          content: '1. Default binding (по умолчанию)',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function greet() {
  console.log(this); // window (браузер) или global (Node.js)
}

greet(); // this = глобальный объект

// В strict mode:
'use strict';
function greetStrict() {
  console.log(this); // undefined
}
greetStrict();`,
        },
        {
          type: 'heading',
          content: '2. Implicit binding (неявная привязка)',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const obj = {
  name: 'Alice',
  greet() {
    console.log(this.name); // 'Alice'
  }
};

obj.greet(); // this = obj

// ПОТЕРЯ контекста:
const fn = obj.greet;
fn(); // this = undefined (strict) или window — НЕ obj!

// Частая ошибка с setTimeout:
setTimeout(obj.greet, 100); // this потеряли!`,
        },
        {
          type: 'heading',
          content: '3. Explicit binding (явная привязка)',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function greet(greeting) {
  console.log(\`\${greeting}, \${this.name}!\`);
}

const user = { name: 'Alice' };

// call: вызывает немедленно, аргументы через запятую
greet.call(user, 'Hello'); // "Hello, Alice!"

// apply: вызывает немедленно, аргументы массивом
greet.apply(user, ['Hi']); // "Hi, Alice!"

// bind: создаёт новую функцию с привязанным this
const greetAlice = greet.bind(user);
greetAlice('Hey'); // "Hey, Alice!"
greetAlice('Hello'); // "Hello, Alice!" — this всегда user`,
        },
        {
          type: 'heading',
          content: '4. new binding',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function Person(name) {
  // При вызове через new:
  // 1. Создаётся новый пустой объект
  // 2. this указывает на этот объект
  // 3. Функция выполняется
  // 4. Объект возвращается автоматически
  this.name = name;
}

const alice = new Person('Alice');
console.log(alice.name); // 'Alice'
console.log(alice instanceof Person); // true`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Приоритет правил: **new** > **explicit** (bind/call/apply) > **implicit** (obj.method()) > **default**.',
        },
      ],
    },
    {
      title: 'Стрелочные функции и this',
      blocks: [
        {
          type: 'text',
          content:
            'Стрелочные функции **не имеют собственного `this`**. Они наследуют `this` из лексического окружения — из области видимости, где они были **написаны** (не вызваны).',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `class Timer {
  constructor() {
    this.seconds = 0;
  }

  start() {
    // ❌ Обычная функция — this потеряется в setTimeout
    // setInterval(function() { this.seconds++; }, 1000);

    // ✅ Стрелочная функция — this из start() (= экземпляр Timer)
    setInterval(() => {
      this.seconds++; // this = Timer instance
      console.log(this.seconds);
    }, 1000);
  }
}

const timer = new Timer();
timer.start(); // 1, 2, 3...`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const obj = {
  name: 'obj',

  // ❌ Стрелочная функция как метод объекта
  // this здесь — глобальный (где был написан код)
  arrowMethod: () => {
    console.log(this.name); // undefined (или window.name)
  },

  // ✅ Обычная функция как метод — this = obj при вызове obj.method()
  regularMethod() {
    console.log(this.name); // 'obj'
  },
};

obj.arrowMethod();  // undefined
obj.regularMethod(); // 'obj'`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Не используйте стрелочные функции как методы объекта или в прототипах — они не получат `this` объекта. Стрелочные функции идеальны как **callback-и** внутри методов, где нужно сохранить `this` внешней функции.',
        },
      ],
    },
    {
      title: 'bind, call, apply — когда и зачем',
      blocks: [
        {
          type: 'text',
          content:
            'Три метода явной привязки `this`: `call` и `apply` вызывают функцию немедленно, `bind` возвращает новую функцию.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Практический пример: заимствование метода
const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };

// Array.from(arrayLike) — современный способ
// Или заимствовать Array.prototype.slice:
const arr = Array.prototype.slice.call(arrayLike);
console.log(arr); // ['a', 'b', 'c']

// Частичное применение с bind:
function multiply(a, b) {
  return a * b;
}
const double = multiply.bind(null, 2); // a = 2 зафиксирован
console.log(double(5));  // 10
console.log(double(10)); // 20`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Типичный паттерн с обработчиком события:
class Button {
  constructor(label) {
    this.label = label;
    // Привязываем контекст при создании
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log(\`Кликнули на: \${this.label}\`);
  }

  mount(element) {
    element.addEventListener('click', this.handleClick);
    // Работает, потому что this привязан через bind
  }
}`,
        },
      ],
    },
    {
      title: 'Современные паттерны: class fields и стрелочные методы',
      blocks: [
        {
          type: 'text',
          content:
            'С появлением **class fields** (ES2022) появился элегантный способ привязать `this` к методу без вызова `bind` в конструкторе.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `class Button {
  label = 'Click me'; // class field

  // ❌ Обычный метод — this зависит от вызова
  handleClickOld() {
    console.log(this.label); // может быть undefined
  }

  // ✅ Class field как стрелочная функция — this всегда привязан
  handleClick = () => {
    console.log(this.label); // всегда 'Click me'
  };
}

const btn = new Button();
const { handleClick } = btn; // деструктуризация
handleClick(); // ✅ 'Click me' — this не потерян

// В React это идиома: избегаем bind в конструкторе
// <button onClick={this.handleClick}>...</button>`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Class field стрелочные методы — это **синтаксический сахар**. Под капотом: каждый экземпляр получает свою копию функции (не на прототипе!). Это использует больше памяти, но гарантирует привязку `this`.',
        },
        {
          type: 'heading',
          content: 'Soft binding и частичное применение',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// bind создаёт "жёсткую" привязку — повторный bind не работает
function greet() { return this.name; }

const alice = { name: 'Alice' };
const bob = { name: 'Bob' };

const greetAlice = greet.bind(alice);
const greetBob = greetAlice.bind(bob); // НЕ работает — alice уже зафиксирован
greetBob(); // 'Alice' (не 'Bob'!)

// Частичное применение через bind:
function multiply(factor, value) {
  return factor * value;
}
const double = multiply.bind(null, 2);  // factor = 2 зафиксирован
const triple = multiply.bind(null, 3);  // factor = 3 зафиксирован
double(5); // 10
triple(5); // 15`,
        },
        {
          type: 'heading',
          content: 'this в геттерах/сеттерах и Proxy',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const obj = {
  _value: 42,
  get value() {
    return this._value; // this = объект, у которого вызвали геттер
  },
  set value(v) {
    this._value = v;
  }
};

obj.value; // 42 — this = obj
const desc = Object.getOwnPropertyDescriptor(obj, 'value');
desc.get.call({ _value: 100 }); // 100 — явный this через call`,
        },
      ],
    },
    {
      title: 'Частые ошибки с this',
      blocks: [
        {
          type: 'heading',
          content: 'Деструктуризация теряет контекст',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const obj = {
  value: 42,
  getValue() { return this.value; }
};

// ❌ Деструктуризация — это как const getValue = obj.getValue;
const { getValue } = obj;
getValue(); // undefined или ошибка — this потеряли

// ✅ Привязать:
const bound = obj.getValue.bind(obj);
bound(); // 42`,
        },
        {
          type: 'heading',
          content: 'this в callback передаётся как аргумент',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `class Processor {
  constructor(data) {
    this.data = data;
  }

  process() {
    // ❌ this внутри forEach callback — не Processor
    this.data.forEach(function(item) {
      console.log(this.prefix + item); // TypeError
    });

    // ✅ Стрелочная функция
    this.data.forEach((item) => {
      console.log(item); // this = Processor instance
    });

    // ✅ Передать this как второй аргумент forEach
    this.data.forEach(function(item) {
      console.log(item);
    }, this); // второй аргумент thisArg
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Многие методы массива (forEach, map, filter, reduce) принимают опциональный `thisArg` вторым аргументом — это позволяет передать контекст в callback без bind или стрелочных функций.',
        },
      ],
    },
  ],
};
