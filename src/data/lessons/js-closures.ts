import type { Lesson } from '../../types/lesson';
import { jsClosuresQuiz } from '../quizzes/js-closures';

const Q = Object.fromEntries(jsClosuresQuiz.questions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set(['jsc-q3', 'jsc-q4', 'jsc-q8', 'jsc-q9', 'jsc-q11']);

export const jsClosuresLesson: Lesson = {
  topicId: 'js-closures',

  intro: {
    whyItMatters: `Замыкание — функция, которая сохраняет доступ к переменным области, где она была создана, даже после того как внешняя функция завершилась. На замыканиях держится много кода в экосистеме JS: хуки React, обработчики событий, мемоизация, debounce, реализация приватного состояния.

На собеседовании проверяют не определение, а последствия. Что выведет код с \`var\` в цикле, как замыкание удерживает объекты в памяти, чем приватность через замыкание отличается от приватных полей класса, как написать \`memoize\` или \`once\` с нуля.`,
    estimatedMinutes: 30,
    interviewAngle:
      'Интервьюера интересует не определение замыкания, а его последствия: жизненный цикл захваченных переменных, влияние на сборку мусора, разница между \`var\` и \`let\` в цикле, реализация классических паттернов без библиотек.',
    prerequisites: [],
  },

  chapters: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'lexical-scope',
      title: 'Лексическая область видимости',
      estimatedMinutes: 4,
      blocks: [
        {
          type: 'text',
          content:
            '**Лексическая область видимости** означает, что доступность переменных определяется в момент написания кода, а не вызова. Функция, объявленная внутри другой, автоматически видит переменные внешней.',
        },
        {
          type: 'text',
          content:
            '**Цепочка областей видимости**: при поиске переменной движок сначала проверяет локальную область, затем внешнюю, затем глобальную. Важно: имеет значение место объявления функции, а не место её вызова.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const x = 'global';

function outer() {
  const x = 'outer';

  function inner() {
    const x = 'inner';
    console.log(x); // 'inner' — локальная переменная
  }

  function middle() {
    console.log(x); // 'outer' — берёт из внешней области
  }

  inner();  // 'inner'
  middle(); // 'outer'
}

outer();
console.log(x); // 'global'`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Уровни областей видимости: global → module → function → block (let / const). \`var\` игнорирует блочную область — переменные «всплывают» до ближайшей функции.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function example() {
  if (true) {
    var x = 1;  // видна во всей функции
    let y = 2;  // видна только в блоке
  }
  console.log(x); // 1
  console.log(y); // ReferenceError
}`,
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'what-is-closure',
      title: 'Что такое замыкание',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            '**Замыкание** — функция, которая помнит переменные из области, где была создана, даже после завершения внешней функции. Захват идёт по ссылке, а не по значению: если переменная изменится, замыкание увидит новое значение.',
        },
        {
          type: 'visualization',
          content: '',
          vizId: 'closure-scope',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function makeCounter() {
  let count = 0; // переменная захвачена в замыкании

  return {
    increment() { count++; },
    decrement() { count--; },
    getCount()  { return count; },
  };
}

const counter = makeCounter();
counter.increment();
counter.increment();
counter.increment();
counter.decrement();
console.log(counter.getCount()); // 2

// count недоступен снаружи — это приватное состояние
console.log(counter.count); // undefined`,
        },
        {
          type: 'text',
          content:
            'Каждый вызов \`makeCounter\` создаёт **отдельное** окружение. Два счётчика, созданные подряд, не делят состояние. Это и делает замыкание удобным способом инкапсуляции.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function makeAdder(x) {
  return function (y) {
    return x + y; // x захвачен из внешней области
  };
}

const add5  = makeAdder(5);
const add10 = makeAdder(10);

console.log(add5(3));   // 8
console.log(add10(3));  // 13
console.log(add5(10));  // 15`,
        },
      ],
      checkpoint: [Q['jsc-q3']!, Q['jsc-q11']!, {
        type: 'match-pairs',
        id: 'jsc-mp1',
        description: 'Сопоставьте паттерн с применением',
        pairs: [
          { left: 'IIFE', right: 'Изоляция переменных от глобальной области' },
          { left: 'Замыкание-счётчик', right: 'Инкапсуляция приватного состояния' },
          { left: 'Фабричная функция', right: 'Параметризованные коллбэки с захваченными аргументами' },
          { left: 'Каррирование', right: 'Частичное применение функции через цепочку замыканий' },
        ],
        explanation:
          'Все четыре паттерна используют одно свойство: переменная, объявленная внутри функции, остаётся доступной для внутренней функции даже после возврата из внешней.',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'patterns',
      title: 'Практические паттерны',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Три паттерна, которые встречаются в любом реальном проекте: \`memoize\`, \`once\`, IIFE. Все используют одно свойство — захваченная переменная (\`cache\`, \`called\`) живёт столько же, сколько возвращённая функция.',
        },
        { type: 'heading', content: 'Мемоизация' },
        {
          type: 'text',
          content:
            'Кеширование результата по аргументам. Замыкание хранит \`cache\` между вызовами.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function memoize(fn) {
  const cache = new Map(); // кеш живёт в замыкании

  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const slowSquare = (n) => n * n;
const fastSquare = memoize(slowSquare);
fastSquare(4); // вычисляет → 16
fastSquare(4); // из кеша → 16`,
        },
        { type: 'heading', content: 'Функция once' },
        {
          type: 'code',
          language: 'javascript',
          content: `function once(fn) {
  let called = false;
  let result;

  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

const init = once(() => {
  console.log('Инициализация');
  return 42;
});

init(); // 'Инициализация' → 42
init(); // → 42 (fn не вызывается повторно)`,
        },
        { type: 'heading', content: 'IIFE — немедленно вызываемая функция' },
        {
          type: 'code',
          language: 'javascript',
          content: `const counter = (function () {
  let count = 0;
  return {
    inc: () => ++count,
    get: () => count,
  };
})();

counter.inc();
counter.inc();
console.log(counter.get()); // 2`,
        },
        {
          type: 'text',
          content:
            'В эпоху ES-модулей потребность в IIFE меньше — каждый модуль и так имеет собственную область видимости. IIFE остаются удобны для разовой инициализации значения и для эмуляции top-level await там, где он не поддерживается.',
        },
      ],
      playground: {
        starterCode: `// Реализуйте makeAdder через замыкание. Ожидаемый вывод: 8 и 13.

function makeAdder(x) {
  // ваш код
}

console.log(makeAdder(5)(3));
console.log(makeAdder(10)(3));`,
        expectedOutput: '8\n13',
        description:
          'Базовая задача на частичное применение: внешняя функция принимает x, внутренняя — y, возвращает их сумму.',
      },
      checkpoint: [Q['jsc-q4']!, Q['jsc-q8']!, {
        type: 'multi-select',
        id: 'jsc-ms1',
        description: 'Что замыкание захватывает из внешней функции?',
        options: [
          'Переменные из внешней области видимости',
          'Ссылку на \`this\` внешней функции',
          'Аргументы внешней функции',
          'Прототип внешней функции',
        ],
        correctIndices: [0, 2],
        explanation:
          'Замыкание захватывает лексическое окружение: переменные и параметры внешней функции. \`this\` в обычных функциях не часть лексического окружения — он определяется в момент вызова. Прототип не связан с замыканием.',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'pitfalls',
      title: 'Подводные камни',
      estimatedMinutes: 6,
      blocks: [
        { type: 'heading', content: 'var в цикле и асинхронные коллбэки' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Проблема: все коллбэки видят одну и ту же i
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Выведет: 3  3  3

// Решение 1: let создаёт отдельную переменную на каждой итерации
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Выведет: 0  1  2

// Решение 2: IIFE создаёт отдельную область видимости
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(() => console.log(j), 0);
  })(i);
}
// Выведет: 0  1  2`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'С \`var\` все коллбэки замкнуты на одну переменную \`i\`. К моменту срабатывания таймера цикл уже завершился и \`i === 3\`. С \`let\` каждая итерация получает собственную переменную — поведение \`for\`-цикла зафиксировано в ES2015.',
        },
        { type: 'heading', content: 'Утечка памяти через замыкание' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Замыкание удерживает всю область видимости целиком
function attachHandler(element) {
  const bigData = new Array(100000).fill('data');

  element.addEventListener('click', function () {
    console.log('clicked'); // bigData не используется,
    // но замыкание держит весь scope → bigData не освобождается
  });
}

// Исправление: оставляем только то, что нужно
function attachHandlerFixed(element) {
  const bigData = new Array(100000).fill('data');
  const processed = transform(bigData);

  element.addEventListener('click', function () {
    console.log(processed);
  });
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Замыкание удерживает всю область видимости, а не только переменные, явно использованные в теле. Защита — не объявлять большие данные в области, которую захватывает долгоживущий обработчик, и снимать обработчики через \`removeEventListener\`.',
        },
        { type: 'heading', content: 'Hoisting и временная мёртвая зона' },
        {
          type: 'text',
          content:
            '**Hoisting** — движок обрабатывает объявления переменных и функций до выполнения. У \`var\` поднимается и объявление, и инициализация \`undefined\`. У \`let\` и \`const\` имя резервируется, но обращение до строки объявления выбрасывает \`ReferenceError\` — это **временная мёртвая зона** (TDZ).',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function test() {
  console.log(a); // undefined — var поднят со значением undefined
  // console.log(b); // ReferenceError — b в TDZ
  var a = 1;
  let b = 2; // здесь TDZ для b заканчивается
}`,
        },
      ],
      playground: {
        starterCode: `// Замените var на let так, чтобы код вывел 0, 1, 2.

for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
        expectedOutput: '0\n1\n2',
        description:
          'Достаточно изменить одно слово в объявлении. Это классический тест на понимание области видимости и замыканий.',
      },
      checkpoint: [Q['jsc-q9']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'engine-perspective',
      title: 'Замыкание в памяти движка',
      estimatedMinutes: 4,
      blocks: [
        {
          type: 'text',
          content:
            'Когда функция обращается к переменной из внешней области, движок не копирует значение. Вместо этого создаётся объект окружения — структура на куче, которая хранит эти переменные. Объект живёт, пока существует хотя бы одна функция, ссылающаяся на него.',
        },
        {
          type: 'list',
          content: `Каждый вызов внешней функции создаёт отдельный объект окружения — поэтому два счётчика, созданных подряд, независимы.
Если замыкание использует только одну переменную, движок может удержать только её — остальные собираются GC.
Конструкции \`eval\` и \`with\` отключают эту оптимизацию: движок не может статически определить, какие переменные понадобятся, и удерживает окружение целиком.`,
        },
        {
          type: 'text',
          content:
            'На практике замыкания дешёвы, но не бесплатны. Заметная цена возникает, когда на каждый элемент большого списка создаётся отдельный обработчик — тогда в памяти оказываются тысячи объектов окружения. Решение — делегирование событий: один обработчик на родительском элементе вместо множества дочерних.',
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Совет «избегайте \`eval\` и \`with\`» — не только про стиль. Их присутствие отключает оптимизации движка: окружение приходится удерживать полностью, и память расходуется заметно больше.',
        },
      ],
    },
  ],

  finalQuiz: jsClosuresQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  cheatsheet: `### Шпаргалка по замыканиям

**Что это**
- Функция, помнящая переменные области, где была создана, после её завершения
- Захват идёт по ссылке, а не по копии значения

**Область видимости**
- Определяется в момент написания кода, а не вызова
- Уровни: global → module → function → block (let / const)
- \`var\` — функциональная область, \`let\` и \`const\` — блочная

**Классические паттерны**
\`\`\`js
// memoize — кеш в замыкании
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const r = fn.apply(this, args);
    cache.set(key, r);
    return r;
  };
}

// once — выполняется не более одного раза
function once(fn) {
  let called = false, result;
  return (...args) => {
    if (!called) { called = true; result = fn.apply(this, args); }
    return result;
  };
}
\`\`\`

**var vs let в цикле**
- \`var\` создаёт одну переменную на всю функцию — асинхронные коллбэки видят финальное значение
- \`let\` создаёт отдельную переменную на каждой итерации цикла \`for\`

**Подводные камни**
- Замыкание удерживает всю область видимости, не только используемые переменные
- Долгоживущие обработчики на DOM могут держать большие данные → утечка памяти
- TDZ: обращение к \`let\` / \`const\` до объявления → \`ReferenceError\`, не \`undefined\`

**Замыкание в памяти**
- Каждый вызов внешней функции создаёт отдельное окружение
- \`eval\` и \`with\` отключают оптимизации окружения
- Тысячи обработчиков → тысячи окружений → делегирование событий`,

  nextTopics: [
    {
      slug: 'js-this',
      reason:
        '\`this\` и замыкания — две темы, которые часто путают. После замыканий логично разобрать правила определения \`this\` и стрелочные функции.',
    },
    {
      slug: 'js-event-loop',
      reason:
        'Замыкания часто живут внутри асинхронных коллбэков и обработчиков. После замыканий полезно понять порядок их выполнения через event loop.',
    },
  ],
};
