import type { TopicTheory } from '../../types/topic';

export const jsEventLoopTheory: TopicTheory = {
  topicId: 'js-event-loop',
  sections: [
    {
      title: 'Как работает JavaScript: стек вызовов',
      blocks: [
        {
          type: 'text',
          content:
            'JavaScript — **однопоточный** язык. В каждый момент времени выполняется только одна операция. Для управления выполнением кода используются несколько структур данных:',
        },
        {
          type: 'list',
          content:
            '**Call Stack (стек вызовов)** — LIFO-стек. При вызове функции она добавляется в стек, при возврате — удаляется.\n**Heap (куча)** — область памяти для хранения объектов.\n**Web APIs** (в браузере) / **libuv** (в Node.js) — выполняют асинхронные операции вне стека: setTimeout, fetch, I/O.\n**Task Queue (очередь задач)** — макрозадачи ожидают выполнения.\n**Microtask Queue (очередь микрозадач)** — промисы, queueMicrotask.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `console.log('Start');    // 1. Синхронно

setTimeout(() => {
  console.log('Timeout'); // 4. Макрозадача
}, 0);

Promise.resolve().then(() => {
  console.log('Promise'); // 3. Микрозадача
});

console.log('End');       // 2. Синхронно

// Вывод: Start → End → Promise → Timeout`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Порядок выполнения: **синхронный код** → **все микрозадачи** → **одна макрозадача** → **все микрозадачи** → **следующая макрозадача** → ...',
        },
        {
          type: 'visualization',
          content: '', vizId: 'event-loop',
        },
      ],
    },
    {
      title: 'Microtask Queue vs Task Queue',
      blocks: [
        {
          type: 'text',
          content:
            '**Микрозадачи** (microtasks) имеют приоритет над макрозадачами. После выполнения каждой синхронной операции движок полностью очищает очередь микрозадач перед тем, как взять следующую макрозадачу.',
        },
        {
          type: 'list',
          content:
            '**Микрозадачи**: `Promise.then/catch/finally`, `queueMicrotask()`, `MutationObserver`.\n**Макрозадачи**: `setTimeout`, `setInterval`, `setImmediate` (Node.js), события пользователя, I/O callbacks.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Трики с вложенными промисами
Promise.resolve()
  .then(() => {
    console.log('1');
    Promise.resolve().then(() => console.log('2')); // новая микрозадача
  })
  .then(() => console.log('3'));

// Вывод: 1 → 2 → 3
// Объяснение:
// - then('1') выполняется, регистрирует then('2') и then('3') в microtask queue
// - then('2') выполняется следующей (была добавлена первой из оставшихся)
// - then('3') выполняется последней`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// async/await — синтаксический сахар над промисами
async function foo() {
  console.log('A');       // синхронно
  await Promise.resolve();
  console.log('B');       // микрозадача (после await)
}

console.log('C');         // синхронно
foo();
console.log('D');         // синхронно

// Вывод: C → A → D → B
// Объяснение:
// C — синхронно
// foo() вызвана: печатает A, встречает await, приостанавливается
// D — синхронно (foo() приостановлена, не блокирует)
// B — когда промис резолвится, продолжение foo() ставится в microtask queue`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Каждый `await` — это неявный `.then()`. `await somePromise` эквивалентно: "выполни всё до этой точки, затем поставь продолжение в очередь микрозадач, когда промис резолвится".',
        },
      ],
    },
    {
      title: 'Практические паттерны',
      blocks: [
        {
          type: 'heading',
          content: 'debounce — откладывает выполнение',
        },
        {
          type: 'text',
          content:
            'Полезен для обработки быстрых повторяющихся событий (ввод в поле поиска, ресайз окна): функция вызывается только спустя паузу после последнего события.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function debounce(fn, delay) {
  let timer = null;

  return function(...args) {
    clearTimeout(timer); // отменяем предыдущий таймер
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

const search = debounce((query) => {
  console.log('Поиск:', query);
}, 300);

// Быстрые вызовы — fn выполнится только 1 раз
search('h');
search('he');
search('hel');
search('hell');
search('hello'); // через 300ms после этого: "Поиск: hello"`,
        },
        {
          type: 'heading',
          content: 'throttle — ограничивает частоту',
        },
        {
          type: 'text',
          content:
            'Throttle гарантирует, что функция вызывается не чаще, чем раз в `delay` мс. В отличие от debounce, первый вызов выполняется немедленно.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function throttle(fn, delay) {
  let lastCall = 0;

  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

const onScroll = throttle(() => {
  console.log('scroll handler');
}, 100);

// При скролле будет вызываться не чаще 1 раза в 100ms`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            '**Когда что использовать**: debounce — когда нужен результат только последнего события (поиск, валидация). Throttle — когда нужно равномерно обрабатывать поток событий (скролл, mouse move, resize).',
        },
      ],
    },
    {
      title: 'Хитрые кейсы: что именно выполнится когда?',
      blocks: [
        {
          type: 'heading',
          content: 'Вложенные промисы и порядок микрозадач',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Сколько await создаёт микрозадач?
async function a() {
  await b(); // 1 микрозадача
  console.log('a done');
}

async function b() {
  await Promise.resolve(); // 1 микрозадача
  console.log('b done');
}

a();
console.log('sync');

// Вывод: sync → b done → a done
// Почему? a() ждёт b(). b() резолвится через одну микрозадачу.
// Как только b() завершается — a() встаёт в очередь.`,
        },
        {
          type: 'heading',
          content: 'Promise.resolve() vs new Promise(resolve => resolve())',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Разница в количестве микрозадач:
// Promise.resolve(value) — если value не thenable, резолвится СРАЗУ
// new Promise(r => r(value)) — то же самое
// НО: если value — другой промис, добавляется ЛИШНЯЯ микрозадача!

async function test1() {
  await Promise.resolve(42);
  console.log('test1');
}

async function test2() {
  await new Promise(r => r(42));
  console.log('test2');
}

async function test3() {
  // await на уже-зарезолвленный промис = 2 микрозадачи в V8
  const p = Promise.resolve(42);
  await p;
  console.log('test3');
}

test1(); test2(); test3();
console.log('sync');
// Вывод: sync → test1 → test2 → test3`,
        },
        {
          type: 'heading',
          content: 'queueMicrotask — прямое добавление в очередь',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// queueMicrotask более низкоуровневый, чем Promise.resolve().then()
// Оба дают одинаковый приоритет, но queueMicrotask не создаёт Promise-объект

queueMicrotask(() => console.log('A'));
Promise.resolve().then(() => console.log('B'));
queueMicrotask(() => console.log('C'));

// Вывод: A → B → C (в порядке регистрации)
// queueMicrotask — полезен для низкоуровневого кода,
// где не нужен overhead создания Promise`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Никогда не рассчитывайте на точный порядок между микрозадачами и макрозадачами в production-коде. Используйте явную координацию через `Promise.all` или очереди.',
        },
      ],
    },
    {
      title: 'Распространённые ловушки Event Loop',
      blocks: [
        {
          type: 'heading',
          content: 'setTimeout(fn, 0) ≠ немедленное выполнение',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// setTimeout(fn, 0) — НЕ немедленно!
// Минимальная задержка в браузере ~4ms, в Node.js — ~1ms
// Главное: это макрозадача — выполнится ПОСЛЕ всех микрозадач

console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
queueMicrotask(() => console.log('4'));
console.log('5');

// Вывод: 1 → 5 → 3 → 4 → 2
// Порядок микрозадач: then-callback и queueMicrotask —
// в порядке регистрации`,
        },
        {
          type: 'heading',
          content: 'Долгий синхронный код блокирует всё',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ Блокирует event loop — UI зависнет
function blockingLoop() {
  const start = Date.now();
  while (Date.now() - start < 3000) {
    // 3 секунды блокировки
  }
}

// ✅ Чанкованная обработка через setTimeout
function processChunked(items, chunkSize, callback) {
  let index = 0;

  function processNext() {
    const end = Math.min(index + chunkSize, items.length);
    for (; index < end; index++) {
      callback(items[index]);
    }
    if (index < items.length) {
      setTimeout(processNext, 0); // отдаём управление event loop
    }
  }

  processNext();
}`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Синхронный код — это "блокирующая операция" в JavaScript. Пока выполняется синхронный код, event loop не может обрабатывать новые события. Для тяжёлых вычислений используйте Web Workers (браузер) или Worker Threads (Node.js).',
        },
      ],
    },
  ],
};
