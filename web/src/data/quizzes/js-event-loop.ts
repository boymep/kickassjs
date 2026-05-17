import type { TopicQuiz } from '../../types/quiz';

export const jsEventLoopQuiz: TopicQuiz = {
  topicId: 'js-event-loop',
  questions: [
    {
      type: 'output',
      id: 'jsel-q1',
      description: 'Классика Event Loop. Что выведет код?',
      code: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');`,
      options: ['1 4 3 2', '1 2 3 4', '1 4 2 3', '1 3 4 2'],
      correctIndex: 0,
      explanation:
        'Порядок: 1) синхронный код: "1", "4"; 2) очередь микрозадач: "3" (Promise.then); 3) очередь макрозадач: "2" (setTimeout). setTimeout(fn, 0) — это всё равно макрозадача, которая выполняется ПОСЛЕ всех микрозадач.',
    },
    {
      type: 'output',
      id: 'jsel-q2',
      description: 'async/await и Event Loop. Что выведет код?',
      code: `async function load() {
  console.log('a');
  await Promise.resolve();
  console.log('b');
}

console.log('1');
load();
Promise.resolve().then(() => console.log('c'));
console.log('2');`,
      options: ['1 a 2 b c', '1 a 2 c b', '1 a b 2 c', '1 2 a b c'],
      correctIndex: 0,
      explanation:
        '"1" — синхронно. load() начинается: "a" — синхронно, затем await приостанавливает load(), кладёт продолжение в microtask queue. Promise.then("c") тоже идёт в очередь. "2" — синхронно. Microtask checkpoint: сначала продолжение load ("b"), затем then ("c"). Итог: 1 → a → 2 → b → c.',
    },
    {
      type: 'output',
      id: 'jsel-q3',
      description: 'Вложенные промисы. Что выведет код?',
      code: `Promise.resolve()
  .then(() => {
    console.log('1');
    Promise.resolve().then(() => console.log('2'));
  })
  .then(() => console.log('3'));`,
      options: ['1 2 3', '1 3 2', '3 1 2', '2 1 3'],
      correctIndex: 0,
      explanation:
        'Первый .then: выводит "1", регистрирует внутренний Promise.resolve().then("2"). Следующий .then("3") ставится в очередь. Теперь в очереди: ["2", "3"]. "2" выводится первым, затем "3". Итог: 1 → 2 → 3.',
    },
    {
      type: 'output',
      id: 'jsel-q4',
      description: 'Порядок микрозадач. Что выведет код?',
      code: `queueMicrotask(() => console.log('micro-1'));
Promise.resolve().then(() => console.log('micro-2'));
setTimeout(() => console.log('macro'), 0);
queueMicrotask(() => console.log('micro-3'));`,
      options: ['micro-1 micro-2 micro-3 macro', 'micro-1 micro-3 micro-2 macro', 'macro micro-1 micro-2 micro-3', 'micro-2 micro-1 micro-3 macro'],
      correctIndex: 0,
      explanation:
        'queueMicrotask и Promise.then — оба добавляют в очередь микрозадач. Они выполняются в порядке регистрации: micro-1 (первый queueMicrotask), micro-2 (Promise.then), micro-3 (второй queueMicrotask). setTimeout — макрозадача — выполняется последним.',
    },
    {
      type: 'tracing',
      id: 'jsel-q5',
      description: 'Проследите выполнение кода с Promise chain.',
      code: `console.log('start');

setTimeout(() => console.log('timeout'), 0);

new Promise((resolve) => {
  console.log('promise executor');
  resolve();
}).then(() => console.log('then'));

console.log('end');`,
      steps: [
        { label: 'Синхронный код начинается', variables: { callStack: 'main()', output: '' } },
        { label: 'console.log("start")', variables: { output: '"start"', queues: 'пусто' } },
        { label: 'setTimeout — регистрация в Web API', variables: { output: '"start"', macroQueue: '["timeout"]' } },
        { label: 'Promise executor — синхронно!', variables: { output: '"start", "promise executor"', microQueue: '["then"]' } },
        { label: 'console.log("end")', variables: { output: '"start", "promise executor", "end"' } },
        { label: 'Микрозадачи: then', variables: { output: '... "then"', macroQueue: '["timeout"]' } },
        { label: 'Макрозадача: timeout', variables: { output: '... "timeout"' } },
      ],
      question: 'Каков финальный порядок вывода?',
      options: [
        'start, promise executor, end, then, timeout',
        'start, end, promise executor, then, timeout',
        'start, promise executor, then, end, timeout',
        'start, timeout, promise executor, then, end',
      ],
      correctIndex: 0,
      explanation:
        'Важно: executor Promise выполняется **синхронно**! resolve() лишь ставит .then в очередь микрозадач. Итог: "start" → "promise executor" (sync) → "end" (sync) → "then" (micro) → "timeout" (macro).',
    },
    {
      type: 'output',
      id: 'jsel-q6',
      description: 'await внутри async функции. Что выведет код?',
      code: `async function first() {
  console.log('first-1');
  await second();
  console.log('first-2');
}

async function second() {
  console.log('second-1');
}

first();
console.log('global');`,
      options: ['first-1 second-1 global first-2', 'first-1 second-1 first-2 global', 'global first-1 second-1 first-2', 'first-1 global second-1 first-2'],
      correctIndex: 0,
      explanation:
        '"first-1" — sync. `await second()` вызывает second(): "second-1" — sync. second() возвращает undefined (implicit). await приостанавливает first(). "global" — sync. Затем микрозадача: "first-2". Итог: first-1 → second-1 → global → first-2.',
    },
    {
      type: 'fill-blank',
      id: 'jsel-q7',
      description: 'Заполните пропуск для корректной реализации debounce.',
      codeWithBlanks: `function debounce(fn, ms) {
  let timer = null;
  return function(...args) {
    ___BLANK___(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}`,
      options: ['clearTimeout', 'clearInterval', 'cancelAnimationFrame', 'delete'],
      correctIndex: 0,
      explanation:
        '`clearTimeout(timer)` отменяет предыдущий таймер перед установкой нового. Это и есть суть debounce — каждый новый вызов отодвигает время выполнения fn. Без clearTimeout каждый вызов создавал бы новый таймер.',
    },
    {
      type: 'output',
      id: 'jsel-q8',
      description: 'Promise.all vs последовательность. Что выведет код?',
      code: `async function run() {
  const start = Date.now();

  await Promise.all([
    new Promise(r => setTimeout(() => r('a'), 100)),
    new Promise(r => setTimeout(() => r('b'), 100)),
    new Promise(r => setTimeout(() => r('c'), 100)),
  ]);

  console.log(Date.now() - start < 200 ? 'parallel' : 'sequential');
}

run();`,
      options: ['parallel', 'sequential', 'undefined', 'Error'],
      correctIndex: 0,
      explanation:
        'Promise.all запускает все промисы **параллельно**. Три промиса по 100ms выполнятся примерно за 100ms суммарно (а не 300ms). Поэтому условие `< 200` истинно и выводится "parallel".',
    },
    {
      type: 'output',
      id: 'jsel-q9',
      description: 'Обработка ошибок в async/await. Что выведет код?',
      code: `async function fetchData() {
  throw new Error('network error');
}

async function main() {
  try {
    const data = await fetchData();
    console.log('success');
  } catch (e) {
    console.log('caught:', e.message);
  }
}

main();`,
      options: ['caught: network error', 'success', 'Uncaught Error: network error', 'undefined'],
      correctIndex: 0,
      explanation:
        'async функция, бросающая ошибку, возвращает rejected Promise. `await` "разворачивает" этот rejected Promise и выбрасывает ошибку синхронно в текущем async-контексте. try/catch перехватывает её. Вывод: "caught: network error".',
    },
    {
      type: 'output',
      id: 'jsel-q10',
      description: 'await и queueMicrotask вперемешку. Что выведет код?',
      code: `async function run() {
  console.log('a');
  await null;
  console.log('b');
  await null;
  console.log('c');
}

run();
queueMicrotask(() => console.log('q'));
console.log('sync');`,
      options: ['a sync b q c', 'a sync b c q', 'a q sync b c', 'a sync q b c'],
      correctIndex: 0,
      explanation:
        '"a" — sync внутри run(), первый await кладёт продолжение в очередь. queueMicrotask("q") тоже в очередь. "sync" — sync. Microtask checkpoint: продолжение run → "b", второй await кладёт следующее продолжение в конец. Затем "q". Затем финальное продолжение run → "c". Итог: a → sync → b → q → c.',
    },
    {
      type: 'fill-blank',
      id: 'jsel-q11',
      description: 'Реализуйте функцию delay через Promise.',
      codeWithBlanks: `function delay(ms) {
  return new Promise((resolve) => ___BLANK___(resolve, ms));
}`,
      options: ['setTimeout', 'setInterval', 'requestAnimationFrame', 'queueMicrotask'],
      correctIndex: 0,
      explanation:
        '`setTimeout(resolve, ms)` — через ms миллисекунд вызывается `resolve()`, что резолвит Promise. Использование setInterval было бы некорректным (повторяющийся таймер). queueMicrotask — без задержки (микрозадача, не макро).',
    },
    {
      type: 'output',
      id: 'jsel-q12',
      description: 'Что произойдёт с rejected Promise без обработки?',
      code: `async function fail() {
  throw new Error('oops');
}

// Нет await, нет .catch
fail();

console.log('after call');`,
      options: [
        '"after call", затем UnhandledPromiseRejection',
        'Немедленный crash, "after call" не выводится',
        '"after call" и ничего больше',
        'Ошибка попадает в ближайший try/catch',
      ],
      correctIndex: 0,
      explanation:
        'async функция возвращает Promise. Без await или .catch() ошибка остаётся "необработанной". "after call" выводится синхронно. Затем Node.js/браузер выдаёт предупреждение UnhandledPromiseRejection. В Node.js это может завершить процесс.',
    },
  ],
};
