import type { Lesson } from '../../types/lesson';
import { jsThisQuiz } from '../quizzes/js-this';
import { jsThisFlashcards } from '../flashcards/js-this';

// Index existing quiz questions for reuse as checkpoints.
const Q = Object.fromEntries(jsThisQuiz.questions.map((q) => [q.id, q]));

// Questions used as in-chapter checkpoints (must NOT appear in finalQuiz).
const CHECKPOINT_IDS = new Set(['jst-q1', 'jst-q2', 'jst-q5', 'jst-q6', 'jst-q9']);

export const jsThisLesson: Lesson = {
  topicId: 'js-this',

  intro: {
    whyItMatters: `Ключевое слово \`this\` — главный источник так называемой «магии» JavaScript. Его значение определяется не местом, где функция объявлена, а тем, **как** она вызвана. Из-за этого один и тот же метод может вести себя по-разному в зависимости от способа вызова: как метод объекта, как обработчик события, как callback в \`setTimeout\` или как аргумент \`Array.prototype.forEach\`.

\`this\` встречается практически во всех частях экосистемы: в методах объектов и классов, в обработчиках DOM-событий, в callback-API таймеров и сети, в библиотеках вроде React — где привязка контекста долгое время решалась через \`bind\` в конструкторе, а затем через class fields со стрелочными функциями. Связь с замыканиями возникает там, где стрелочная функция захватывает \`this\` из внешней области видимости лексически — этот трюк закрывает большинство случаев потери контекста.

Неправильное понимание \`this\` приводит к самым распространённым багам JavaScript: метод, переданный как callback, вдруг возвращает \`undefined\`; обработчик \`addEventListener\` пишет в неправильный объект; стрелочная функция, использованная как метод, не видит свойств объекта.

В этом уроке вы научитесь применять четыре правила определения \`this\` в нужном порядке приоритета, отличать поведение стрелочной функции от обычной, осознанно выбирать между \`bind\`, \`call\` и \`apply\`, а также диагностировать классические ловушки потери контекста.`,
    estimatedMinutes: 30,
    interviewAngle:
      'Интервьюер проверяет понимание четырёх правил определения this и их приоритета, разницу call/apply/bind, поведение стрелочной функции в качестве метода и callback, а также способность диагностировать потерю контекста в коде.',
    prerequisites: [{ slug: 'js-closures', title: 'Замыкания' }],
  },

  resources: {
    videos: [
      {
        source: 'youtube',
        id: '9T4z98JcHR0',
        title: 'this keyword in JavaScript — Namaste JavaScript Season 2, Ep. 6',
        channel: 'Akshay Saini',
        language: 'en',
        durationSec: 24 * 60,
        description: 'Подробный разбор всех режимов this с примерами в браузере, Node.js, классах и стрелочных функциях.',
      },
      {
        source: 'youtube',
        id: 'fVXp7ZWjlO4',
        title: 'What is THIS keyword in JavaScript? — Tutorial for beginners',
        channel: 'ColorCode',
        language: 'en',
        durationSec: 11 * 60,
        description: 'Краткое визуальное объяснение четырёх правил this и типичных потерь контекста.',
      },
    ],
    links: [
      {
        url: 'https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/this',
        title: 'this — MDN',
        source: 'mdn',
        language: 'ru',
        note: 'Каноническая справка с описанием всех режимов: глобальный, функция, метод, конструктор, стрелочная функция.',
      },
      {
        url: 'https://learn.javascript.ru/object-methods',
        title: 'Методы объекта, «this» — учебник learn.javascript.ru',
        source: 'learn-js',
        language: 'ru',
        note: 'Глава Ильи Кантора о методах и связывании контекста при вызове.',
      },
      {
        url: 'https://learn.javascript.ru/bind',
        title: 'Привязка контекста — bind — учебник learn.javascript.ru',
        source: 'learn-js',
        language: 'ru',
        note: 'Подробно о потере this и трёх способах её избежать: обёртка, bind, частичное применение.',
      },
      {
        url: 'https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Function/bind',
        title: 'Function.prototype.bind — MDN',
        source: 'mdn',
        language: 'ru',
        note: 'Спецификация поведения bind, включая жёсткую привязку и частичное применение.',
      },
      {
        url: 'https://2ality.com/2017/12/alternate-this.html',
        title: 'ECMAScript proposal: alternate this — 2ality',
        source: 'article',
        language: 'en',
        note: 'Аксель Раушмайер о тонкостях this в стрелочных функциях, классах и модулях.',
      },
    ],
  },

  chapters: [
    {
      id: 'four-rules',
      title: 'Четыре правила определения this',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'Значение `this` в JavaScript определяется не местом написания функции, а способом её **вызова**. Существует четыре правила связывания, применяемых в порядке приоритета: **new** > **explicit** (call/apply/bind) > **implicit** (obj.method()) > **default**.',
        },
        { type: 'heading', content: '1. Default binding — вызов без контекста' },
        {
          type: 'code',
          language: 'javascript',
          content: `function show() {
  console.log(this);
}

show(); // в browser non-strict: window
        // в strict mode: undefined
        // в модуле ES (.mjs): undefined`,
        },
        { type: 'heading', content: '2. Implicit binding — вызов как метода' },
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
        { type: 'heading', content: '3. Explicit binding — call, apply, bind' },
        {
          type: 'code',
          language: 'javascript',
          content: `function greet(greeting) {
  return \`\${greeting}, \${this.name}!\`;
}

const user = { name: 'Алиса' };

greet.call(user, 'Привет');         // 'Привет, Алиса!'
greet.apply(user, ['Здравствуйте']); // 'Здравствуйте, Алиса!'

const greetUser = greet.bind(user); // новая функция
greetUser('Хей');                   // 'Хей, Алиса!'`,
        },
        { type: 'heading', content: '4. new binding — вызов через new' },
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
            'Приоритет связываний: **new** > **explicit** > **implicit** > **default**. Если функция вызвана через `new`, никакие предыдущие `bind` не отменят это правило: `this` будет указывать на новый объект.',
        },
      ],
      flashcardIds: ['jsth-f1'],
      checkpoint: [Q['jst-q1']!],
      docsLink: { url: 'https://learn.javascript.ru/object-methods', title: 'Методы объекта и this — learn.javascript.ru' },
    },

    {
      id: 'arrow-functions',
      title: 'Стрелочные функции и лексический this',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Стрелочные функции **не имеют собственного `this`**. Они захватывают `this` из лексической области видимости — из того места, где они **написаны**, а не вызваны. Это поведение нельзя переопределить через `call`, `apply` или `bind`: переданный контекст просто игнорируется.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `class Timer {
  constructor() {
    this.seconds = 0;
  }

  start() {
    // Стрелочная функция наследует this из start().
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
            'Стрелочную функцию не следует использовать как метод объекта или как метод на прототипе. Она не получит `this` объекта при вызове `obj.method()` — `this` останется тем, что был во внешнем коде.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const obj = {
  name: 'obj',

  // Не делайте так: this — глобальный, а не obj.
  arrowMethod: () => {
    console.log(this.name);
  },

  // Корректный метод объекта.
  regularMethod() {
    console.log(this.name); // 'obj'
  },
};

obj.arrowMethod();   // undefined
obj.regularMethod(); // 'obj'`,
        },
        {
          type: 'list',
          content: `- У стрелочной функции нет собственных \`this\`, \`arguments\`, \`super\`, \`new.target\`.
- Стрелочную функцию нельзя вызвать через \`new\`.
- Идиома: использовать стрелочную функцию как **callback** внутри метода, чтобы сохранить \`this\` метода.
- Не использовать стрелочную функцию как метод объекта или прототипа.`,
        },
      ],
      flashcardIds: ['jsth-f3'],
      checkpoint: [Q['jst-q2']!, Q['jst-q9']!],
      docsLink: { url: 'https://learn.javascript.ru/arrow-functions', title: 'Стрелочные функции — learn.javascript.ru' },
    },

    {
      id: 'bind-call-apply',
      title: 'bind, call, apply — явное связывание',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Три метода прототипа `Function.prototype` позволяют явно задать `this` при вызове. Различие: `call` и `apply` вызывают функцию **немедленно**, `bind` возвращает **новую функцию** с зафиксированным `this`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function describe(greeting, punct) {
  return \`\${greeting}, \${this.name}\${punct}\`;
}

const user = { name: 'Алиса' };

// call — аргументы перечислением
describe.call(user, 'Привет', '!');

// apply — аргументы массивом
describe.apply(user, ['Здравствуйте', '.']);

// bind — новая функция с зафиксированным this и предзаполненными аргументами
const sayHi = describe.bind(user, 'Хей');
sayHi('?'); // 'Хей, Алиса?'`,
        },
        { type: 'heading', content: 'Hard binding — повторный bind не отменяется' },
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

// Снять hard binding можно только через new:
function Foo() { return this.name; }
const Bound = Foo.bind({ name: 'Алиса' });
new Bound(); // this = новый объект, не привязанный — правило new имеет высший приоритет`,
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
const double = multiply.bind(null, 2); // a = 2 зафиксирован
double(5);  // 10
double(10); // 20`,
        },
      ],
      flashcardIds: ['jsth-f6'],
      docsLink: { url: 'https://learn.javascript.ru/bind', title: 'bind, call, apply — learn.javascript.ru' },
      playground: {
        starterCode: `// Метод user.greet теряет контекст при передаче как callback.
// Исправьте код одной строкой так, чтобы вывод был "Привет, Алиса!".

const user = {
  name: 'Алиса',
  greet(greeting) {
    return \`\${greeting}, \${this.name}!\`;
  },
};

const fn = user.greet; // <-- здесь нужно зафиксировать this
console.log(fn('Привет'));`,
        expectedOutput: 'Привет, Алиса!',
        description:
          'Используйте `bind`, чтобы создать функцию с привязанным контекстом. Это базовый приём, спасающий от потери this в callback-API.',
      },
    },

    {
      id: 'pitfalls',
      title: 'Типичные ошибки с this',
      estimatedMinutes: 7,
      blocks: [
        { type: 'heading', content: 'Деструктуризация и присваивание метода в переменную' },
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

// Или вызывать через объект:
counter.inc(); // implicit binding сохраняется`,
        },
        { type: 'heading', content: 'Передача метода как callback' },
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

// Не сработает — потеря контекста.
setTimeout(logger.log, 100, 'привет');

// Сработает.
setTimeout(() => logger.log('привет'), 100);

// Сработает.
setTimeout(logger.log.bind(logger), 100, 'привет');`,
        },
        { type: 'heading', content: 'this внутри callback методов массива' },
        {
          type: 'code',
          language: 'javascript',
          content: `class Sum {
  constructor(values) {
    this.values = values;
    this.total = 0;
  }

  calculate() {
    // Не работает: this внутри обычной функции — undefined / window.
    // this.values.forEach(function (v) { this.total += v; });

    // Работает: стрелочная функция захватывает this лексически.
    this.values.forEach((v) => { this.total += v; });

    // Работает: forEach принимает thisArg вторым параметром.
    this.values.forEach(function (v) { this.total += v; }, this);

    return this.total;
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Многие методы массива (`forEach`, `map`, `filter`, `some`, `every`) принимают второй параметр — `thisArg`. Он позволяет передать контекст в callback без `bind` и без стрелочной функции.',
        },
      ],
      flashcardIds: ['jsth-f2'],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/this', title: 'this — MDN (ru)' },
      playground: {
        starterCode: `// Класс ниже теряет this в обработчике forEach.
// Исправьте метод processAll, чтобы вывод был "[CTX] a", "[CTX] b", "[CTX] c".

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
          'Замените обычную функцию на стрелочную или передайте `this` вторым аргументом forEach. Оба решения корректны.',
      },
      checkpoint: [Q['jst-q5']!],
    },

    {
      id: 'class-fields',
      title: 'Class fields и современные паттерны',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'С появлением class fields (ES2022) появился декларативный способ привязать `this` к методу без вызова `bind` в конструкторе. Поле, инициализированное стрелочной функцией, создаётся на каждом экземпляре и автоматически захватывает `this` экземпляра.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `class Button {
  label = 'OK';

  // Стрелочный метод как class field — this всегда привязан.
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
            'Стрелочные методы-поля — синтаксический сахар. Под капотом каждый экземпляр получает собственную копию функции, а не общий метод на прототипе. На больших коллекциях экземпляров это увеличивает расход памяти.',
        },
        {
          type: 'list',
          content: `- Обычный метод на прототипе: одна функция на класс, \`this\` зависит от способа вызова.
- Стрелочный метод-поле: функция на каждом экземпляре, \`this\` зафиксирован лексически.
- Преимущество поля: не нужен \`bind\` в конструкторе и не теряется контекст при передаче как callback.
- Минус поля: нельзя переопределить через \`super\` в подклассе и расход памяти выше.`,
        },
      ],
      flashcardIds: ['jsth-f5'],
      checkpoint: [Q['jst-q6']!],
      docsLink: { url: 'https://learn.javascript.ru/class', title: 'Классы — learn.javascript.ru' },
    },

    {
      id: 'new-and-classes',
      title: 'this в new, классах и наследовании',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Оператор `new` запускает специальную последовательность: создаётся новый объект, его внутренний прототип устанавливается равным `Constructor.prototype`, конструктор вызывается с `this` = новый объект, и объект возвращается автоматически (если конструктор не вернул другой объект явно).',
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
            'В strict mode (а классы всегда выполняются в strict mode) default binding даёт `this = undefined`, а не глобальный объект. Это устраняет класс ошибок «случайной» записи в `window`.',
        },
      ],
      flashcardIds: ['jsth-f4'],
      docsLink: { url: 'https://learn.javascript.ru/constructor-new', title: 'Конструкторы и new — learn.javascript.ru' },
    },
  ],

  // Все вопросы из старого квиза, кроме тех, что ушли в checkpoint.
  finalQuiz: jsThisQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  flashcards: jsThisFlashcards.cards,

  cheatsheet: `### Шпаргалка по this

- **4 правила** в порядке приоритета: \`new\` > \`call/apply/bind\` > \`obj.method()\` > вызов «голой» функции.
- Default binding: \`this = globalThis\` в non-strict, \`undefined\` в strict, в классах и в модулях ES.
- Стрелочная функция: своего \`this\` нет — наследует лексически. \`call/apply/bind\` на ней не работают.
- \`call(ctx, ...args)\` и \`apply(ctx, [args])\` — вызывают сразу. \`bind(ctx, ...args)\` — возвращает новую функцию.
- Hard binding после \`bind\` снимается только через \`new\`.
- Типичные потери контекста: деструктуризация, присваивание метода в переменную, callback в \`setTimeout\` / \`addEventListener\`, обычная функция внутри \`forEach\`.
- Решения: \`bind\` в конструкторе, стрелочная функция-обёртка, class field со стрелкой, \`thisArg\` у методов массива.`,

  interviewQA: [
    {
      id: 'jsth-iq1',
      question: 'Объясните четыре правила определения this и их приоритет.',
      shortAnswer:
        'Значение this определяется способом вызова функции. По убыванию приоритета: new, явное связывание (call/apply/bind), неявное связывание (obj.method()), default. Default в strict mode — undefined, иначе — глобальный объект.',
      fullAnswer: `В JavaScript значение \`this\` определяется не местом, где функция объявлена, а тем, **как** она вызвана. Применяются четыре правила:

1. **new binding.** Если функция вызвана через \`new\`, JavaScript создаёт новый объект, устанавливает его прототип равным \`Constructor.prototype\` и привязывает \`this\` к этому объекту.
2. **Explicit binding.** Если функция вызвана через \`call\`, \`apply\` или предварительно «забиндена» через \`bind\`, контекст задаётся явно.
3. **Implicit binding.** Если функция вызвана как метод объекта (\`obj.method()\`), \`this\` равен объекту слева от точки.
4. **Default binding.** Если применимо ничего из вышеперечисленного, в strict mode \`this = undefined\`, иначе \`this\` указывает на глобальный объект (\`window\` в браузере, \`global\` в Node.js).

Правила применяются в порядке убывания приоритета. Например, если \`bind\` зафиксировал контекст, а функция затем вызвана через \`new\`, победит \`new\` — это поведение зафиксировано в спецификации и используется в полифилле \`bind\`.`,
      followUps: [
        'Что вернёт `this` в обычной функции, объявленной в модуле ES?',
        'Что произойдёт, если конструктор вернёт примитив? А если объект?',
      ],
      relatedChapterId: 'four-rules',
    },
    {
      id: 'jsth-iq2',
      question: 'Чем стрелочная функция отличается от обычной в контексте this?',
      shortAnswer:
        'У стрелочной функции нет собственного this — она захватывает его лексически из окружающей области видимости. Поэтому call, apply и bind на неё не влияют. Стрелочную функцию нельзя использовать как конструктор и как метод объекта.',
      fullAnswer: `Обычная функция получает \`this\` по правилам default/implicit/explicit/new в момент вызова. Стрелочная функция не имеет собственного \`this\` — она захватывает значение из лексической области видимости, где была написана.

Из этого следуют важные практические следствия:

- Передача стрелочной функции в \`call\`, \`apply\` или \`bind\` не меняет её \`this\`. Контекст просто игнорируется.
- Стрелочную функцию нельзя вызвать через \`new\` — её нельзя использовать как конструктор.
- У стрелочной функции нет собственных \`arguments\`, \`super\` и \`new.target\`.

Идиоматическое применение — callback внутри метода. Например, в обработчике \`setInterval\` стрелочная функция «вспомнит» \`this\` метода, в котором она написана:

\`\`\`js
class Timer {
  start() {
    setInterval(() => this.tick(), 1000);
  }
}
\`\`\`

Антипаттерн — стрелочная функция как метод объекта. При вызове \`obj.arrowMethod()\` контекст не станет \`obj\` — он будет тем, что был во внешней области.`,
      followUps: [
        'Почему стрелочную функцию нельзя использовать в качестве метода прототипа?',
        'Что произойдёт, если применить bind к стрелочной функции?',
      ],
      relatedChapterId: 'arrow-functions',
    },
    {
      id: 'jsth-iq3',
      question: 'В чём разница между call, apply и bind?',
      shortAnswer:
        'call и apply вызывают функцию немедленно, отличаются способом передачи аргументов: call — перечислением, apply — массивом. bind возвращает новую функцию с зафиксированным this и опционально предзаполненными аргументами; функция при этом не вызывается.',
      fullAnswer: `Все три метода прототипа \`Function.prototype\` позволяют явно задать \`this\` при вызове функции, но различаются по способу вызова и форме аргументов.

- \`fn.call(ctx, a, b, c)\` вызывает функцию немедленно. Аргументы передаются перечислением.
- \`fn.apply(ctx, [a, b, c])\` вызывает функцию немедленно. Аргументы передаются массивом или массивоподобным объектом. Удобно, когда аргументы уже собраны в массив.
- \`fn.bind(ctx, a)\` не вызывает функцию. Возвращает **новую** функцию, у которой \`this\` зафиксирован равным \`ctx\`, а первый аргумент уже подставлен.

Особенность \`bind\` — привязка **жёсткая**: повторный \`bind\` на уже привязанную функцию не меняет \`this\`. Снять её можно только через \`new\`, потому что правило \`new\` имеет высший приоритет.

Практические применения \`bind\`: фиксация \`this\` в конструкторе класса, частичное применение аргументов, передача метода как callback без потери контекста. Применения \`call\`/\`apply\`: заимствование методов (\`Array.prototype.slice.call(arguments)\`), вызов функций со «спред»-аргументами в средах без \`...\`.`,
      followUps: [
        'Можно ли реализовать bind через call?',
        'Что произойдёт при `fn.call(null)` в strict mode?',
      ],
      relatedChapterId: 'bind-call-apply',
    },
    {
      id: 'jsth-iq4',
      question: 'Что такое hard binding и можно ли его «снять»?',
      shortAnswer:
        'Hard binding — это фиксация this через bind. Повторный bind на уже привязанную функцию игнорируется. Снять привязку можно только вызовом через new: правило new имеет наивысший приоритет.',
      fullAnswer: `\`Function.prototype.bind\` создаёт функцию с **жёстко зафиксированным** \`this\`. Это поведение называется hard binding. Спецификация требует, чтобы повторный \`bind\` на уже привязанной функции не перезаписывал контекст:

\`\`\`js
function f() { return this.name; }
const a = f.bind({ name: 'A' });
const b = a.bind({ name: 'B' });
b(); // 'A'
\`\`\`

Аналогично, \`call\` и \`apply\` на привязанной функции не меняют контекст — этот аспект был источником множества ошибок в ранних реализациях \`bind\` через замыкание.

Единственный способ «обойти» hard binding — вызвать привязанную функцию через \`new\`. По спецификации, правило \`new\` имеет высший приоритет: создаётся новый объект, который и становится \`this\`, а зафиксированный через \`bind\` контекст игнорируется. Это поведение полезно при наследовании от привязанных конструкторов.

Стрелочные функции технически не подвержены ни \`bind\`, ни \`call\`, ни \`apply\` — у них нет собственного \`this\`. Поэтому к ним hard binding неприменим в принципе.`,
      followUps: [
        'Зачем поведение «new побеждает bind» зафиксировано в спецификации?',
        'Как реализовать собственный bind, чтобы он корректно работал с new?',
      ],
      relatedChapterId: 'bind-call-apply',
    },
    {
      id: 'jsth-iq5',
      question: 'Как this ведёт себя в strict mode и почему так сделано?',
      shortAnswer:
        'В strict mode default binding даёт this = undefined вместо глобального объекта. Это устраняет класс ошибок, когда метод вызывается без контекста и случайно записывает данные в window.',
      fullAnswer: `В non-strict коде функция, вызванная без контекста, получает \`this\`, равный глобальному объекту: \`window\` в браузере или \`global\` в Node.js. Это поведение опасно: если внутри метода случайно потерян контекст и метод пишет в \`this.someField\`, поле создаётся в глобальном объекте и виден весь рантайм.

В strict mode (\`'use strict'\`) default binding даёт \`this = undefined\`. Любое обращение \`this.someField\` сразу выбросит \`TypeError\`, и ошибка проявится в момент возникновения, а не в неожиданном месте позже.

Strict mode включается:
- Явно директивой \`'use strict'\` в начале файла или функции.
- **Неявно** в любом ES-модуле (\`type="module"\` или \`.mjs\`).
- **Неявно** в теле любого \`class\`.

Поэтому в современном проекте практически весь код выполняется в strict mode. Это меняет поведение и других механизмов: запрещает дублирование параметров, автоматическое создание глобальных переменных при присваивании необъявленным идентификаторам, делает \`delete\` на простых переменных синтаксической ошибкой.

В контексте \`this\` важно помнить: если код выполняется в strict mode, защититься от потери контекста нужно явно — через \`bind\`, стрелочную функцию или class field.`,
      followUps: [
        'Что вернёт `(function(){ return this; })()` в браузере, в Node.js, в модуле?',
        'Чем отличается `this` в обычной функции от `this` в IIFE в strict mode?',
      ],
      relatedChapterId: 'four-rules',
    },
    {
      id: 'jsth-iq6',
      question: 'Как избежать потери this в обработчике события или в callback таймера?',
      shortAnswer:
        'Привязать метод через bind в конструкторе, использовать стрелочную функцию-обёртку в месте передачи, или объявить метод как стрелочный class field. В методах массива можно передать thisArg вторым аргументом.',
      fullAnswer: `Потеря контекста происходит, когда метод передаётся как callback и вызывается без объекта-владельца — \`addEventListener\`, \`setTimeout\`, \`Promise.then\` и т.п. Существуют четыре общепринятых подхода.

1. **bind в конструкторе.** Классическая практика React-компонентов до 2019 года:
   \`\`\`js
   class Btn {
     constructor() { this.handleClick = this.handleClick.bind(this); }
     handleClick() { /* ... */ }
   }
   \`\`\`
   Минус — шаблонный код.

2. **Стрелочная обёртка в месте передачи.**
   \`\`\`js
   element.addEventListener('click', () => btn.handleClick());
   \`\`\`
   Минус — придётся хранить функцию-обёртку отдельно, чтобы потом передать её в \`removeEventListener\`.

3. **Class field как стрелочная функция (ES2022).**
   \`\`\`js
   class Btn {
     handleClick = () => { /* this всегда экземпляр */ };
   }
   \`\`\`
   Самый удобный современный вариант. Минус — каждый экземпляр получает свою копию функции.

4. **thisArg у методов массива.** \`forEach\`, \`map\`, \`filter\`, \`some\`, \`every\` принимают второй параметр-контекст. Это нишевый, но рабочий способ внутри обработки массивов.

Выбор зависит от контекста: для класса с долгоживущими экземплярами и небольшим количеством обработчиков подходит class field; для одноразовых обработчиков — стрелочная обёртка; для удаления подписки нужна именованная функция, которую сохраняют в поле и передают и в \`addEventListener\`, и в \`removeEventListener\`.`,
      followUps: [
        'Почему передача `setTimeout(obj.method, 100)` теряет контекст?',
        'Как корректно отписать обработчик, привязанный через стрелочную обёртку?',
      ],
      relatedChapterId: 'pitfalls',
    },
    {
      id: 'jsth-iq7',
      question: 'Опишите, что делает оператор new под капотом.',
      shortAnswer:
        'new создаёт новый объект, устанавливает его прототип равным Constructor.prototype, вызывает конструктор с this = новый объект и возвращает его. Если конструктор явно вернул объект — возвращается он, примитивные значения игнорируются.',
      fullAnswer: `Оператор \`new\` выполняет четыре шага:

1. Создаёт новый пустой объект.
2. Устанавливает его внутренний прототип (\`[[Prototype]]\`) равным \`Constructor.prototype\`.
3. Вызывает функцию-конструктор с \`this\` = новый объект и переданными аргументами.
4. Возвращает результат: если конструктор явно вернул объект (или функцию) — возвращается он, иначе возвращается созданный объект.

Эту логику легко воспроизвести вручную:

\`\`\`js
function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return (result !== null && typeof result === 'object') ? result : obj;
}
\`\`\`

Понимание шагов помогает в собеседовании при ответах на смежные вопросы: почему \`instanceof\` работает (проверяется наличие \`Constructor.prototype\` в цепочке прототипов созданного объекта), почему \`new\` имеет приоритет над \`bind\` (на шаге 3 \`this\` всегда равен новому объекту, а не привязанному), почему конструктор может вернуть другой объект (используется в реализации singleton и фабрик).`,
      followUps: [
        'Как реализовать new без Object.create?',
        'Что произойдёт, если вызвать стрелочную функцию через new?',
      ],
      relatedChapterId: 'new-and-classes',
    },
  ],

  nextTopics: [
    {
      slug: 'js-prototypes',
      reason: 'Поведение `new` напрямую опирается на цепочку прототипов и Constructor.prototype.',
    },
    {
      slug: 'js-async',
      reason: 'Promise и async-функции — частый источник потери контекста в обработчиках then/catch.',
    },
  ],

  related: [
    { kind: 'bug-hunt', id: 'bh-this-1', label: 'Bug hunt: метод теряет this в setTimeout' },
    { kind: 'pitfall', id: 'arrow-as-method', label: 'JS-ловушки: стрелочная функция как метод объекта' },
  ],
};
