import type { Lesson } from '../../types/lesson';
import { jsClosuresQuiz } from '../quizzes/js-closures';
import { jsClosuresFlashcards } from '../flashcards/js-closures';

// Index existing quiz questions for reuse as checkpoints.
const Q = Object.fromEntries(jsClosuresQuiz.questions.map((q) => [q.id, q]));

// Questions used as in-chapter checkpoints (must NOT appear in finalQuiz).
const CHECKPOINT_IDS = new Set(['jsc-q3', 'jsc-q11', 'jsc-q4', 'jsc-q8', 'jsc-q9']);

export const jsClosuresLesson: Lesson = {
  topicId: 'js-closures',

  intro: {
    whyItMatters: `Замыкание — фундаментальный механизм JavaScript. На нём построены ключевые инструменты экосистемы: хуки React (\`useState\`, \`useEffect\`), мидлвары Express, обработчики событий, паттерны мемоизации, debounce и throttle, реализация модулей и приватных полей до появления синтаксиса \`#field\` в ES2022.

На собеседовании замыкания проверяют не вопросом «что это такое» — определение умеет произнести почти каждый. Кандидата проверяют через **последствия**: что выведет код с \`var\` в цикле, как замыкание влияет на сборку мусора, чем приватность через замыкание отличается от приватных полей класса, как реализовать \`once\` или \`memoize\` без библиотек.

В этом уроке вы научитесь читать код с замыканиями так же, как это делает движок JavaScript: видеть, где создаётся новая область видимости, какие переменные удерживаются в памяти и какие из этого вытекают типичные баги. По итогам урока вы сможете объяснить классические ловушки и реализовать \`memoize\` без подсказок.`,
    estimatedMinutes: 35,
    interviewAngle:
      'Замыкания спрашивают почти на каждом JS-собеседовании. Сильный кандидат не пересказывает MDN, а объясняет последствия: как замыкание влияет на память и какие баги порождает в реальном коде.',
    prerequisites: [],
  },

  resources: {
    videos: [
      {
        source: 'youtube',
        id: 'vKJpN5FAeF4',
        title: 'JavaScript Visualized: Scope (Chain)',
        channel: 'Lydia Hallie',
        language: 'en',
        durationSec: 8 * 60,
        description: 'Лучшая визуализация цепочки областей видимости — must-watch перед погружением.',
      },
      {
        source: 'youtube',
        id: 'qikxEIxsXco',
        title: 'Closures in JS — Namaste JavaScript Episode 10',
        channel: 'Akshay Saini',
        language: 'en',
        durationSec: 17 * 60,
        description:
          'Акшай Саини шаг за шагом показывает в DevTools, как замыкание захватывает лексическое окружение и почему функция «помнит» переменные после возврата. Сильное дополнение к визуализации Lydia.',
      },
    ],
    links: [
      {
        url: 'https://developer.mozilla.org/ru/docs/Web/JavaScript/Closures',
        title: 'Замыкания — MDN',
        source: 'mdn',
        language: 'ru',
        note: 'Канонический разбор от Mozilla с примерами и подводными камнями.',
      },
      {
        url: 'https://learn.javascript.ru/closure',
        title: 'Замыкание — учебник learn.javascript.ru',
        source: 'learn-js',
        language: 'ru',
        note: 'Глава Ильи Кантора с пошаговым выводом, как движок строит лексическое окружение.',
      },
      {
        url: 'https://2ality.com/2014/01/eval-variables.html',
        title: 'Variables and scoping in ES6 — 2ality',
        source: 'article',
        language: 'en',
        note: 'Аксель Раушмайер про разницу var/let/const на уровне спецификации.',
      },
      {
        url: 'https://v8.dev/blog/scope-optimizations',
        title: 'Faster scope optimizations — V8 blog',
        source: 'v8-blog',
        language: 'en',
        note: 'Что V8 делает с замыканиями под капотом — почему они «дешёвые», но не бесплатные.',
      },
    ],
  },

  chapters: [
    {
      id: 'lexical-scope',
      title: 'Лексическая область видимости',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'В JavaScript область видимости переменных определяется в момент **написания** кода, а не в момент его выполнения — это называется **лексической областью видимости** (lexical scope). Функция «запоминает» окружение, в котором была создана.',
        },
        {
          type: 'text',
          content:
            'Цепочка областей видимости (scope chain): когда движок ищет переменную, он сначала проверяет локальную область, затем внешнюю, затем внешнюю внешней — вплоть до глобальной.',
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
            'Области видимости в JS: **global** → **module** → **function** → **block** (let/const). Переменные `var` игнорируют блочную область — они «всплывают» до ближайшей функции.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function example() {
  if (true) {
    var x = 1;  // видна во всей функции
    let y = 2;  // видна только в блоке
  }
  console.log(x); // 1 ✓
  console.log(y); // ReferenceError ✗
}`,
        },
      ],
    },

    {
      id: 'what-is-closure',
      title: 'Что такое замыкание',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            '**Замыкание** — это функция, которая сохраняет ссылку на переменные из своей внешней области видимости даже после того, как внешняя функция завершила выполнение. Переменные не уничтожаются, пока на них есть хотя бы одна ссылка.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function makeCounter() {
  let count = 0; // эта переменная "закрыта" в замыкании

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
        { type: 'visualization', content: '', vizId: 'closure-scope' },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Замыкания — это не **копия** значений, а **живые ссылки** на переменные. Если переменная изменится, замыкание увидит новое значение.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function makeAdder(x) {
  return function (y) {
    return x + y; // x "заперт" из внешней области
  };
}

const add5 = makeAdder(5);
const add10 = makeAdder(10);

console.log(add5(3));   // 8
console.log(add10(3));  // 13
console.log(add5(10));  // 15`,
        },
      ],
      flashcardIds: ['jsc-f1'],
      checkpoint: [Q['jsc-q3']!, Q['jsc-q11']!],
    },

    {
      id: 'patterns',
      title: 'Практические паттерны замыканий',
      estimatedMinutes: 8,
      blocks: [
        { type: 'heading', content: 'Мемоизация' },
        {
          type: 'text',
          content:
            'Мемоизация — кеширование результата функции по аргументам. Замыкание хранит кеш между вызовами:',
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
fastSquare(4); // из кеша → 16 (fn не вызывается)`,
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
    return result; // повторные вызовы вернут первый результат
  };
}

const init = once(() => {
  console.log('Инициализация!');
  return 42;
});

init(); // 'Инициализация!' → 42
init(); // (ничего не выводит) → 42`,
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
      ],
      playground: {
        starterCode: `// Реализуйте makeAdder через замыкание.
// Ожидаемый вывод: 8 и 13.
function makeAdder(x) {
  // ваш код
}

console.log(makeAdder(5)(3));
console.log(makeAdder(10)(3));`,
        expectedOutput: '8\n13',
        description:
          'Допишите функцию так, чтобы вывод совпал с ожидаемым. Это базовая задача на частичное применение через замыкание.',
      },
      checkpoint: [Q['jsc-q4']!, Q['jsc-q8']!],
      flashcardIds: ['jsc-f4', 'jsc-f6'],
    },

    {
      id: 'pitfalls',
      title: 'Типичные ловушки',
      estimatedMinutes: 9,
      blocks: [
        { type: 'heading', content: 'Классика: var в цикле + setTimeout' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Проблема: все callback'и видят одно и то же i = 3
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Выводит: 3  3  3

// Решение 1: let создаёт новую переменную на каждую итерацию
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Выводит: 0  1  2

// Решение 2: IIFE создаёт отдельную область видимости
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(() => console.log(j), 0);
  })(i);
}
// Выводит: 0  1  2`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'С `var` все функции в цикле разделяют **одну** переменную `i`. К моменту выполнения setTimeout цикл уже завершился и `i === 3`. С `let` каждая итерация получает **свою копию** `i`.',
        },
        { type: 'heading', content: 'Утечка памяти через замыкание' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Замыкание держит весь scope — включая то, что вам не нужно
function attachHandler(element) {
  const bigData = new Array(100000).fill('data'); // 🔴 утечка!

  element.addEventListener('click', function () {
    console.log('clicked'); // bigData не используется,
    // но замыкание держит весь scope → bigData не удаляется GC
  });
}

// Исправление: явно освобождаем данные или выносим handler наружу
function attachHandlerFixed(element) {
  const bigData = new Array(100000).fill('data');
  const processed = transform(bigData); // только результат

  element.addEventListener('click', function () {
    console.log(processed);
  });
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'На собеседовании этот случай формулируют так: «Приведите пример, как замыкание мешает работе сборщика мусора». Ключевая мысль ответа — **замыкание удерживает всю область видимости целиком**, а не только переменные, которые используются в теле функции явно.',
        },
        { type: 'heading', content: 'Hoisting и TDZ' },
        {
          type: 'code',
          language: 'javascript',
          content: `function test() {
  console.log(a); // undefined — var всплыл
  // console.log(b); // ReferenceError — let в TDZ
  var a = 1;
  let b = 2;
}`,
        },
      ],
      playground: {
        starterCode: `// Замените var на let так, чтобы код вывел 0, 1, 2 по одной цифре в строке.
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
        expectedOutput: '0\n1\n2',
        description:
          'Достаточно изменить одно слово в объявлении переменной. Это классическая задача с собеседований, проверяющая понимание области видимости и замыканий.',
      },
      checkpoint: [Q['jsc-q9']!],
      flashcardIds: ['jsc-f2', 'jsc-f5'],
    },

    {
      id: 'engine-perspective',
      title: 'Замыкания глазами движка',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Когда V8 встречает внутреннюю функцию, использующую переменную внешней области, он **не копирует** значение, а создаёт привязку (binding) в специальном объекте окружения. Этот объект живёт на куче столько, сколько существует хотя бы одна ссылка на замкнутую функцию.',
        },
        {
          type: 'list',
          content: `- Каждое **выполнение** внешней функции создаёт **новое** окружение — поэтому два счётчика \`makeCounter()\` независимы.
- Движок умеет «поднимать» переменные, которые не используются снаружи, в регистры — этот этап оптимизации называется **scope analysis**.
- Если функция \`() => outer\` опирается только на \`outer\`, V8 удерживает только эту переменную и освобождает остальные.
- Конструкции **\`eval\`** и **\`with\`** ломают эту оптимизацию: движок вынужден сохранять всю область видимости целиком.`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Рекомендация «не используйте eval и with» связана не со стилем кода, а с потерей оптимизаций: при их наличии движок не может применить scope analysis к замыканиям.',
        },
        {
          type: 'text',
          content:
            'В обычном коде замыкания практически бесплатны по производительности. Заметные накладные расходы возникают только в горячих участках кода — например, когда на каждый элемент длинного списка создаётся отдельный обработчик. В таких случаях используют делегирование событий.',
        },
      ],
      flashcardIds: ['jsc-f3'],
    },
  ],

  // Все вопросы из старого квиза, кроме тех, что ушли в checkpoint.
  finalQuiz: jsClosuresQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  // Реюзаем существующие карточки — они уже хорошего качества.
  flashcards: jsClosuresFlashcards.cards,

  cheatsheet: `### Шпаргалка по замыканиям

- **Замыкание** = функция + ссылки на переменные внешнего scope.
- Лексический scope: правило **где написано**, не где вызвано.
- \`var\` → область функции; \`let\`/\`const\` → область блока.
- В цикле с \`var\` все callback-и видят **одну** \`i\`. С \`let\` — свою.
- Замыкание держит **весь** scope, не только используемые переменные → возможна утечка памяти.
- Идиомы: \`memoize\`, \`once\`, IIFE, makeCounter, частичное применение.
- Приватность через замыкание ≈ \`#field\` класса; разница — модель и инструменты дебага.`,

  interviewQA: [
    {
      id: 'jsc-iq1',
      question: 'Объясните, что такое замыкание, и приведите пример из реального кода.',
      shortAnswer:
        'Замыкание — это функция, сохраняющая доступ к переменным внешней области видимости. Типичные примеры: обработчик события с предзаполненным идентификатором, реализация useState в React.',
      fullAnswer: `Замыкание — это функция, которая удерживает переменные из области видимости, где она была определена, и сохраняет к ним доступ после завершения внешнего кода.

Пример из практики: обработчик клика на строке таблицы, который должен знать идентификатор пользователя. Без замыкания пришлось бы хранить id в data-атрибуте DOM-узла и читать его оттуда. С замыканием это записывается так:

\`\`\`js
row.addEventListener('click', () => deleteUser(user.id));
\`\`\`

Здесь переменная \`user.id\` сохраняется в замыкании — обработчик «помнит» нужное значение и не обращается к DOM.

Другой пример — хук \`useState\` в React. При вызове \`const [count, setCount] = useState(0)\` библиотека возвращает пару значений, где \`setCount\` — функция, замкнутая на конкретный слот в массиве хуков текущего компонента. Благодаря этому каждый экземпляр компонента имеет независимое состояние.`,
      followUps: [
        'Чем замыкание отличается от объекта с методами?',
        'Что произойдёт с замыканием, если внешняя функция выбросит исключение до возврата значения?',
      ],
      relatedChapterId: 'what-is-closure',
    },
    {
      id: 'jsc-iq2',
      question: 'Что выведет цикл с var и setTimeout? Почему именно так? Назовите три способа исправить поведение.',
      shortAnswer:
        'Будет напечатано три раза значение 3: все коллбэки замкнуты на одну и ту же переменную. Исправить можно заменой var на let, использованием IIFE или метода forEach.',
      fullAnswer: `Рассмотрим код:

\`\`\`js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
\`\`\`

Будет выведено **3, 3, 3**. Причина: \`var\` создаёт одну переменную \`i\` на всю функцию. Все три arrow-функции замкнуты на эту переменную. К моменту, когда отрабатывает таймер, цикл уже завершён и \`i\` равно \`3\`.

Корректное поведение можно получить тремя способами:

1. **Заменить var на let.** В цикле \`for\` объявление \`let\` создаёт отдельную привязку переменной для каждой итерации (это поведение зафиксировано в спецификации ES2015).
2. **Использовать IIFE.** Конструкция \`(function (j) { setTimeout(() => console.log(j), 0); })(i)\` создаёт локальную область видимости с собственной переменной \`j\` на каждой итерации.
3. **Использовать forEach или map.** Каждая итерация — это отдельный вызов функции, поэтому переменная цикла оказывается локальной.`,
      followUps: [
        'Как изменится поведение, если внутри цикла используется async/await?',
        'Почему \`let\` решает проблему, а \`const\` в этом сценарии не подходит?',
      ],
      relatedChapterId: 'pitfalls',
    },
    {
      id: 'jsc-iq3',
      question: 'Как замыкание может привести к утечке памяти? Как обнаружить такую утечку?',
      shortAnswer:
        'Замыкание удерживает всю область видимости целиком. Если в этой области находится большой объект, а ссылка на функцию остаётся живой (например, не снят addEventListener), сборщик мусора не освободит память.',
      fullAnswer: `Утечка возникает, когда замкнутая функция привязана к долгоживущему объекту — DOM-узлу, глобальному стору, шине событий — и в её области видимости находится большой объект, который больше не используется.

\`\`\`js
function attach(el) {
  const huge = new Array(1_000_000).fill(0);
  el.addEventListener('click', () => console.log('clicked'));
  // huge не используется в обработчике, но область видимости
  // замыкания включает его. Пока el жив — huge тоже жив.
}
\`\`\`

**Как обнаружить.** В Chrome DevTools перейдите во вкладку Memory и сделайте Heap snapshot до и после действия, которое подозревается в утечке. В retainer-tree будет видна цепочка \`Closure → context → huge\`.

**Как исправить.**
- Явно обнуляйте ссылку на крупные данные: \`huge = null\` после того, как они стали не нужны.
- Снимайте обработчики событий: \`el.removeEventListener('click', handler)\`.
- Используйте \`WeakMap\` или \`WeakRef\` для ассоциаций «объект → метаданные».`,
      followUps: [
        'Может ли V8 оптимизировать ситуацию, когда переменная не используется в теле обработчика?',
        'В каких случаях помогает WeakRef и какие у него ограничения?',
      ],
      relatedChapterId: 'pitfalls',
    },
    {
      id: 'jsc-iq4',
      question: 'Чем приватность через замыкание отличается от приватных полей класса (#field)?',
      shortAnswer:
        'Замыкание обеспечивает приватность через изоляцию области видимости. Приватное поле существует на самом объекте, но недоступно за пределами кода класса; обращение к нему снаружи — синтаксическая ошибка.',
      fullAnswer: `**Замыкание.** Переменная объявлена в области видимости функции. У неё нет имени, по которому можно обратиться извне, поэтому она полностью изолирована. Минусы: переменные хуже инспектируются в DevTools, а каждое создание объекта аллоцирует собственную область видимости.

**Приватное поле \`#field\` (ES2022).** Поле существует на самом объекте, но его имя начинается со знака \`#\` и доступно только в коде класса. Любая попытка обратиться извне — синтаксическая ошибка на этапе парсинга. Поля видны в DevTools и естественно работают с наследованием через классы.

Дополнительные различия:
- Замыкание применимо в любой функции, не только в классе.
- Приватное поле невозможно «забыть» инициализировать: JavaScript выбросит ошибку при попытке прочитать неинициализированное поле.
- Ни замыкание, ни \`#field\` не сериализуются в JSON напрямую; для сериализации требуется явный геттер.
- Расход памяти у класса с приватными полями немного ниже на больших коллекциях, поскольку методы хранятся на прототипе, а не дублируются в каждом экземпляре.`,
      followUps: [
        'Что предпочтительнее использовать в библиотеке, поддерживающей старые браузеры?',
        'Как тестировать приватные методы и нужно ли их публиковать?',
      ],
      relatedChapterId: 'patterns',
    },
    {
      id: 'jsc-iq5',
      question: 'Зачем нужны IIFE в эпоху ES-модулей?',
      shortAnswer:
        'В современном коде потребность в IIFE минимальна. Они остаются удобны для разовой инициализации значения и для эмуляции top-level await в окружениях, где он не поддерживается.',
      fullAnswer: `До появления ES-модулей IIFE были основным способом избежать загрязнения глобальной области видимости. Сейчас каждый файл с расширением \`.mjs\` уже имеет собственную область видимости, поэтому изоляция «бесплатна».

IIFE остаются полезны в нескольких сценариях:

- **Разовая инициализация значения.** Запись \`const config = (() => { ... })();\` позволяет вычислить значение и сразу освободить промежуточные переменные. Альтернатива — выносить вычисления в отдельный файл, что не всегда оправдано.
- **Эмуляция top-level await.** В средах без поддержки top-level \`await\` используется конструкция \`(async () => { await init(); })();\`.
- **Минимизация бандла.** Сборщики оборачивают модули в IIFE, чтобы передать параметры окружения (UMD-обёртка).
- **Изоляция кода в \`<script>\` без \`type="module"\`.** Встречается в legacy-интеграциях.

В новом коде вместо IIFE применяют ES-модули или блочную область видимости \`{ const x = ...; }\` — \`let\` и \`const\` обеспечивают изоляцию переменных на уровне блока.`,
      followUps: [
        'Почему историческая запись IIFE — \`(function(){})()\`, а не \`function(){}()\`?',
        'Чем IIFE отличается от немедленно вызванной async-функции?',
      ],
      relatedChapterId: 'patterns',
    },
    {
      id: 'jsc-iq6',
      question: 'Как замыкания связаны с хуками React?',
      shortAnswer:
        'Хуки — это функции, замкнутые на конкретный слот в очереди хуков текущего компонента. Поэтому корректная работа хуков требует стабильного порядка вызовов.',
      fullAnswer: `React хранит для каждого компонента упорядоченный список слотов: состояния, эффекты, мемоизированные значения. При вызове \`useState(0)\` библиотека возвращает пару \`[value, setValue]\`, где \`setValue\` — функция, замкнутая на индекс этого слота для текущего компонента.

Из этой архитектуры вытекают два правила использования хуков:

1. Хуки должны вызываться в одном и том же порядке между рендерами. Иначе индексы слотов сместятся, и \`setValue\` будет писать в чужой слот.
2. Хуки нельзя вызывать в условиях и циклах — по той же причине.

Замыкание становится источником распространённой ошибки stale closure:

\`\`\`jsx
const [count, setCount] = useState(0);

useEffect(() => {
  const id = setInterval(() => {
    console.log(count); // всегда выводит 0
  }, 1000);
  return () => clearInterval(id);
}, []);
\`\`\`

Переменная \`count\` замкнута на момент создания эффекта. Чтобы видеть актуальное значение, используйте функциональное обновление \`setCount(c => c + 1)\` или добавьте \`count\` в массив зависимостей.`,
      followUps: [
        'Как React сопоставляет хуки между рендерами компонента?',
        'Почему useRef помогает решать проблему stale closure?',
      ],
      relatedChapterId: 'engine-perspective',
    },
  ],

  nextTopics: [
    { slug: 'js-this', reason: 'Замыкания и this — два механизма, определяющих, какие данные доступны функции в момент вызова.' },
    { slug: 'js-async', reason: 'Promise и async/await опираются на замыкания внутри функции-исполнителя.' },
  ],

  related: [
    { kind: 'bug-hunt', id: 'bh-01', label: 'Найдите баг: var в цикле — задача с собеседования' },
    { kind: 'pitfall', id: 'tdz', label: 'JS-ловушки: временная мёртвая зона и поднятие let/const' },
  ],
};
