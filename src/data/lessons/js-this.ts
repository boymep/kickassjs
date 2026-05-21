import type { Lesson } from '../../types/lesson';
import { jsThisQuiz } from '../quizzes/js-this';

const Q = Object.fromEntries(jsThisQuiz.questions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set(['jst-q1', 'jst-q2', 'jst-q5', 'jst-q6', 'jst-q9']);

export const jsThisLesson: Lesson = {
  topicId: 'js-this',

  intro: {
    whyItMatters: `\`this\` в JavaScript определяется в момент вызова функции, а не в момент её написания. Этим JavaScript отличается от большинства языков, где \`this\` жёстко привязан к объекту. Из этой особенности вытекают типичные баги: метод теряет контекст при передаче как коллбэк, стрелочная функция не подходит как метод объекта, \`this\` внутри \`forEach\` указывает не туда.

На собеседовании \`this\` спрашивают регулярно: четыре правила определения, разницу между стрелочной и обычной функцией, методы \`call\` / \`apply\` / \`bind\`, поведение в классах и при наследовании.`,
    estimatedMinutes: 30,
    interviewAngle:
      'Интервьюера интересуют четыре правила определения \`this\`, их приоритет, разница между стрелочной и обычной функцией в контексте \`this\`, и типичные сценарии потери контекста при передаче метода как коллбэка.',
    prerequisites: [{ slug: 'js-closures', title: 'Замыкания' }],
  },

  chapters: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'four-rules',
      title: 'Четыре правила определения this',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'В JavaScript \`this\` определяется в момент вызова функции, а не в месте её объявления. Четыре правила применяются по приоритету: **new** > **call / apply / bind** > **obj.method()** > **обычный вызов**.',
        },
        { type: 'heading', content: '1. Привязка по умолчанию — вызов без контекста' },
        {
          type: 'code',
          language: 'javascript',
          content: `function show() {
  console.log(this);
}

show(); // в браузере non-strict: window
        // в strict mode: undefined
        // в ES-модуле: undefined`,
        },
        { type: 'heading', content: '2. Неявная привязка — вызов как метода' },
        {
          type: 'code',
          language: 'javascript',
          content: `const user = {
  name: 'Алиса',
  greet() {
    console.log(this.name); // 'Алиса' — this = user
  },
};

user.greet();

// Потеря контекста при извлечении метода:
const fn = user.greet;
fn(); // undefined — default binding`,
        },
        { type: 'heading', content: '3. Явная привязка — call, apply, bind' },
        {
          type: 'code',
          language: 'javascript',
          content: `function greet(greeting) {
  return \`\${greeting}, \${this.name}!\`;
}

const user = { name: 'Алиса' };

greet.call(user, 'Привет');          // 'Привет, Алиса!'
greet.apply(user, ['Здравствуйте']); // 'Здравствуйте, Алиса!'

const greetUser = greet.bind(user);  // новая функция
greetUser('Хей');                    // 'Хей, Алиса!'`,
        },
        { type: 'heading', content: '4. Привязка через new' },
        {
          type: 'code',
          language: 'javascript',
          content: `function Person(name) {
  // new создаёт новый объект, this = он, объект возвращается автоматически.
  this.name = name;
}

const alice = new Person('Алиса');
console.log(alice.name); // 'Алиса'`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Приоритет связываний: \`new\` > explicit > implicit > default. Если функция вызвана через \`new\`, никакой предыдущий \`bind\` это не отменит — \`this\` будет указывать на новый объект.',
        },
      ],
      checkpoint: [Q['jst-q1']!, {
        type: 'ordering',
        id: 'jst-ord1',
        description: 'Расставьте правила определения \`this\` от наивысшего приоритета к низшему',
        items: [
          'new — создаётся новый объект, this = новый объект',
          'bind / call / apply — явная привязка, this = переданный объект',
          'Метод объекта — неявная привязка, this = объект перед точкой',
          'Обычный вызов функции — this = undefined (strict) или global',
        ],
        explanation:
          'Приоритет: new > явная привязка > неявная > дефолтная. Стрелочные функции вне этой иерархии — они берут \`this\` из лексического окружения в момент определения.',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'arrow-functions',
      title: 'Стрелочные функции и лексический this',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Стрелочные функции **не имеют собственного \`this\`** — они захватывают его из места, где написаны (лексически), а не откуда вызваны. Это нельзя переопределить через \`call\`, \`apply\` или \`bind\`. Из-за этого стрелки удобны для коллбэков внутри методов и не подходят как сами методы объекта.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `class Timer {
  constructor() {
    this.seconds = 0;
  }

  start() {
    // Стрелка наследует this из start()
    setInterval(() => {
      this.seconds++; // this = экземпляр Timer
    }, 1000);
  }
}

new Timer().start();`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Стрелочная функция как метод объекта — классическая ошибка. При вызове \`obj.method()\` \`this\` не станет \`obj\` — он останется тем, что был во внешней области.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const obj = {
  name: 'obj',

  // Так делать не нужно: this не равен obj
  arrowMethod: () => {
    console.log(this.name);
  },

  // Корректный метод объекта
  regularMethod() {
    console.log(this.name); // 'obj'
  },
};

obj.arrowMethod();   // undefined
obj.regularMethod(); // 'obj'`,
        },
        {
          type: 'list',
          content: `У стрелочной функции нет собственных \`this\`, \`arguments\`, \`super\`, \`new.target\`.
Стрелочную функцию нельзя вызвать через \`new\`.
Идиома: использовать стрелку как коллбэк внутри метода, чтобы сохранить \`this\` метода.
Не использовать стрелку как метод объекта или прототипа.`,
        },
      ],
      checkpoint: [Q['jst-q2']!, Q['jst-q9']!, {
        type: 'match-pairs',
        id: 'jst-mp1',
        description: 'Сопоставьте контекст вызова со значением \`this\`',
        pairs: [
          { left: 'const fn = obj.method; fn()', right: 'undefined (strict) или window' },
          { left: 'obj.method()', right: 'obj' },
          { left: 'new Constructor()', right: 'Новый экземпляр' },
          { left: 'fn.call(ctx)', right: 'ctx' },
        ],
        explanation:
          '\`this\` определяется в момент вызова, а не объявления. Метод, извлечённый в переменную, теряет контекст. \`new\` всегда создаёт новый объект.',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'bind-call-apply',
      title: 'bind, call, apply — явное связывание',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Три метода \`Function.prototype\` для явного задания \`this\`:\n- **\`call(ctx, a, b)\`** — вызывает функцию немедленно, аргументы через запятую.\n- **\`apply(ctx, [a, b])\`** — то же, но аргументы массивом.\n- **\`bind(ctx, ...args)\`** — возвращает новую функцию с зафиксированным \`this\` и предзаполненными аргументами.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function describe(greeting, punct) {
  return \`\${greeting}, \${this.name}\${punct}\`;
}

const user = { name: 'Алиса' };

describe.call(user, 'Привет', '!');         // 'Привет, Алиса!'
describe.apply(user, ['Здравствуйте', '.']); // 'Здравствуйте, Алиса.'

const sayHi = describe.bind(user, 'Хей');
sayHi('?'); // 'Хей, Алиса?'`,
        },
        { type: 'heading', content: 'Жёсткая привязка — повторный bind не отменяется' },
        {
          type: 'code',
          language: 'javascript',
          content: `function getName() {
  return this.name;
}

const alice = { name: 'Алиса' };
const bob = { name: 'Боб' };

const boundToAlice = getName.bind(alice);
const tryRebind = boundToAlice.bind(bob); // не работает

console.log(boundToAlice()); // 'Алиса'
console.log(tryRebind());    // 'Алиса' — повторный bind проигнорирован

// Снять hard binding можно только через new — у него высший приоритет.`,
        },
        { type: 'heading', content: 'Заимствование методов и частичное применение' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Заимствование метода у Array.prototype
function toArray() {
  return Array.prototype.slice.call(arguments);
}

// Частичное применение через bind
function multiply(a, b) {
  return a * b;
}
const double = multiply.bind(null, 2);
double(5);  // 10
double(10); // 20`,
        },
      ],
      playground: {
        starterCode: `// Метод user.greet теряет контекст при передаче как callback.
// Исправьте одной строкой так, чтобы вывод был "Привет, Алиса!".

const user = {
  name: 'Алиса',
  greet(greeting) {
    return \`\${greeting}, \${this.name}!\`;
  },
};

const fn = user.greet; // здесь нужно зафиксировать this
console.log(fn('Привет'));`,
        expectedOutput: 'Привет, Алиса!',
        description:
          'Используйте \`bind\`, чтобы создать функцию с привязанным контекстом. Базовый приём, спасающий от потери \`this\` в callback-API.',
      },
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'pitfalls',
      title: 'Подводные камни: потеря this',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Потеря \`this\` — самая частая ошибка с этой темой. Метод объекта — это обычная функция, и как только она оторвана от объекта, \`this\` исчезает. Три типичных сценария: вытащили метод в переменную, передали как коллбэк, написали обычную функцию внутри \`forEach\`.',
        },
        { type: 'heading', content: 'Метод в переменной — контекст потерян' },
        {
          type: 'code',
          language: 'javascript',
          content: `const counter = {
  count: 0,
  inc() { this.count++; return this.count; },
};

counter.inc();           // 1 — implicit binding
const inc = counter.inc; // ссылка на функцию без объекта
inc();                   // TypeError: cannot read 'count' of undefined

// Решения:
const incBound = counter.inc.bind(counter);
incBound(); // работает

counter.inc(); // implicit binding сохраняется`,
        },
        { type: 'heading', content: 'Метод как callback в setTimeout' },
        {
          type: 'code',
          language: 'javascript',
          content: `class Logger {
  constructor() {
    this.prefix = '[LOG]';
  }
  log(msg) {
    console.log(\`\${this.prefix} \${msg}\`);
  }
}

const logger = new Logger();

// Не сработает — потеря контекста
setTimeout(logger.log, 100, 'привет');

// Сработает
setTimeout(() => logger.log('привет'), 100);

// Сработает
setTimeout(logger.log.bind(logger), 100, 'привет');`,
        },
        { type: 'heading', content: 'this внутри callback массива' },
        {
          type: 'code',
          language: 'javascript',
          content: `class Sum {
  constructor(values) {
    this.values = values;
    this.total = 0;
  }

  calculate() {
    // Не работает: this внутри обычной функции — undefined
    // this.values.forEach(function (v) { this.total += v; });

    // Работает: стрелка захватывает this лексически
    this.values.forEach((v) => { this.total += v; });

    // Работает: forEach принимает thisArg вторым параметром
    this.values.forEach(function (v) { this.total += v; }, this);

    return this.total;
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Методы массива \`forEach\`, \`map\`, \`filter\`, \`some\`, \`every\` принимают вторым параметром \`thisArg\` — это позволяет передать контекст в коллбэк без \`bind\` и без стрелочной функции.',
        },
      ],
      playground: {
        starterCode: `// Класс ниже теряет this в обработчике forEach.
// Исправьте processAll, чтобы вывод был "[CTX] a", "[CTX] b", "[CTX] c".

class Printer {
  constructor() {
    this.prefix = '[CTX]';
  }
  processAll(items) {
    items.forEach(function (item) {
      console.log(\`\${this.prefix} \${item}\`);
    });
  }
}

new Printer().processAll(['a', 'b', 'c']);`,
        expectedOutput: '[CTX] a\n[CTX] b\n[CTX] c',
        description:
          'Замените обычную функцию на стрелочную или передайте \`this\` вторым аргументом \`forEach\`. Оба решения корректны.',
      },
      checkpoint: [Q['jst-q5']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'class-fields',
      title: 'Поля класса и привязка методов',
      estimatedMinutes: 4,
      blocks: [
        {
          type: 'text',
          content:
            'Поля класса (class fields, ES2022) — декларативный способ привязать \`this\` к методу без вызова \`bind\` в конструкторе. Если объявить метод как стрелочную функцию-поле, \`this\` всегда будет привязан к экземпляру — даже когда метод передан как коллбэк.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `class Button {
  label = 'OK';

  // Стрелочный метод как class field — this всегда привязан
  handleClick = () => {
    console.log(this.label);
  };
}

const btn = new Button();
const { handleClick } = btn;
handleClick(); // 'OK' — контекст не потерян

// Старый эквивалент — bind в конструкторе:
class ButtonOld {
  constructor() {
    this.label = 'OK';
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log(this.label);
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'У стрелочного поля есть цена. Обычный метод живёт на прототипе — одна функция на класс. Поле создаётся в каждом экземпляре. На больших коллекциях это увеличивает расход памяти и не позволяет переопределить метод через \`super\` в подклассе.',
        },
        {
          type: 'list',
          content: `Обычный метод на прототипе: одна функция на класс, \`this\` зависит от способа вызова.
Стрелочный метод-поле: функция на каждом экземпляре, \`this\` зафиксирован лексически.
Преимущество поля: не нужен \`bind\` в конструкторе, контекст безопасен при передаче как коллбэк.
Минус поля: нельзя переопределить через \`super\`, расход памяти выше.`,
        },
      ],
      checkpoint: [Q['jst-q6']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'new-and-classes',
      title: 'this в new и классах',
      estimatedMinutes: 4,
      blocks: [
        {
          type: 'text',
          content:
            'Оператор \`new\` запускает специальную последовательность: создаётся новый объект, его внутренний прототип устанавливается равным \`Constructor.prototype\`, конструктор вызывается с \`this\` = новый объект, и объект возвращается автоматически — если конструктор не вернул другой объект явно.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function Person(name) {
  this.name = name;
  // Если вернуть объект — он заменит созданный.
  // Если вернуть примитив — он игнорируется.
}

const alice = new Person('Алиса');
console.log(alice instanceof Person); // true

// new имеет высший приоритет: hard binding не работает.
const Bound = Person.bind({ name: 'fixed' });
const bob = new Bound('Боб');
console.log(bob.name); // 'Боб' — new создал новый объект`,
        },
        { type: 'heading', content: 'this в классе и super' },
        {
          type: 'code',
          language: 'javascript',
          content: `class Animal {
  constructor(name) {
    this.name = name;
  }
  describe() {
    return \`Я \${this.name}\`;
  }
}

class Dog extends Animal {
  describe() {
    // super.describe() вызывается с this = текущий экземпляр Dog
    return super.describe() + ', и я собака';
  }
}

new Dog('Рекс').describe(); // 'Я Рекс, и я собака'`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'В strict mode (а классы всегда выполняются в strict mode) default binding даёт \`this = undefined\`, а не глобальный объект. Это убирает случайные записи в \`window\` через \`this\`.',
        },
      ],
    },
  ],

  finalQuiz: jsThisQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  cheatsheet: `### Шпаргалка по this

**Четыре правила в порядке приоритета**
- \`new\` — \`this\` = новый объект
- \`call\` / \`apply\` / \`bind\` — \`this\` = переданный объект
- \`obj.method()\` — \`this\` = объект перед точкой
- Обычный вызов — \`this\` = \`undefined\` (strict) или глобальный объект

**Привязка по умолчанию**
- \`globalThis\` в non-strict
- \`undefined\` в strict mode, в классах, в модулях ES

**Стрелочная функция**
- Своего \`this\` нет, наследует лексически
- \`call\` / \`apply\` / \`bind\` не действуют
- Нельзя вызвать через \`new\`
- Подходит как коллбэк внутри метода, не подходит как метод объекта

**call vs apply vs bind**
- \`call(ctx, a, b)\` — вызов с аргументами через запятую
- \`apply(ctx, [a, b])\` — вызов с аргументами массивом
- \`bind(ctx, ...args)\` — новая функция с зафиксированным \`this\`
- Жёсткая привязка после \`bind\` снимается только через \`new\`

**Типичные потери контекста**
- Деструктуризация / присваивание метода в переменную
- Передача метода как коллбэка в \`setTimeout\`, \`addEventListener\`
- Обычная функция внутри \`forEach\` / \`map\`

**Решения**
- \`bind\` в конструкторе или при передаче
- Стрелочная функция-обёртка
- Class field со стрелочной функцией
- \`thisArg\` вторым параметром у методов массива`,

  nextTopics: [
    {
      slug: 'js-prototypes',
      reason:
        'Прототипы и классы — естественное продолжение темы про \`this\`. После четырёх правил полезно увидеть, как \`new\` строит цепочку прототипов.',
    },
    {
      slug: 'js-async',
      reason:
        'Async / await часто комбинируются с методами классов — потеря \`this\` встречается и в асинхронном коде.',
    },
  ],
};
