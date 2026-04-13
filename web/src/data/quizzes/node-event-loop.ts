import type { TopicQuiz } from '../../types/quiz';

export const nodeEventLoopQuiz: TopicQuiz = {
  topicId: 'node-event-loop',
  questions: [
    {
      type: 'output',
      id: 'nodel-q1',
      description: 'Node.js Event Loop. Что выведет код?',
      code: `process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
setImmediate(() => console.log('immediate'));
setTimeout(() => console.log('timeout'), 0);
console.log('sync');`,
      options: ['sync, nextTick, promise, timeout/immediate', 'sync, timeout, nextTick, promise, immediate', 'timeout, sync, nextTick, promise', 'sync, promise, nextTick, timeout'],
      correctIndex: 0,
      explanation: '"sync" — синхронно. process.nextTick — самый высокий приоритет среди async (перед Promise microtasks). Promise — microtask. setTimeout и setImmediate — очереди макрозадач (порядок между ними непредсказуем вне I/O callback).',
    },
    {
      type: 'output',
      id: 'nodel-q2',
      description: 'setImmediate vs setTimeout в I/O callback. Что выведет код?',
      code: `const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
});`,
      options: ['"immediate" всегда раньше "timeout"', '"timeout" всегда раньше "immediate"', 'порядок непредсказуем', 'Оба выводятся одновременно'],
      correctIndex: 0,
      explanation: 'Внутри I/O callback (poll фаза): setImmediate выполняется в **check** фазе (следующей после poll). setTimeout(fn, 0) в **timers** фазе (следующий круг). Поэтому setImmediate **всегда** раньше setTimeout внутри I/O callback. В обычном коде — порядок непредсказуем.',
    },
    {
      type: 'fill-blank',
      id: 'nodel-q3',
      description: 'Заполните пропуск для высокоприоритетной задачи.',
      codeWithBlanks: `// Нужно выполниться ПЕРЕД следующей фазой event loop,
// но ПОСЛЕ текущей синхронной операции:
function scheduleNow(fn) {
  process.___BLANK___(fn);
}`,
      options: ['nextTick', 'setImmediate', 'setTimeout', 'emit'],
      correctIndex: 0,
      explanation: '`process.nextTick(fn)` — выполняется после текущей синхронной операции, перед любой следующей фазой event loop и даже перед Promise microtasks. Используется для: defer callback после возврата из функции, но до I/O.',
    },
    {
      type: 'output',
      id: 'nodel-q4',
      description: 'Рекурсивный nextTick. Что произойдёт?',
      code: `let count = 0;
function recursive() {
  if (count++ < 5) {
    process.nextTick(recursive);
  } else {
    console.log('done', count);
  }
}
recursive();
setImmediate(() => console.log('immediate'));`,
      options: ['"done 6" затем "immediate"', '"immediate" затем "done 6"', 'Бесконечный цикл', '"done 6" и "immediate" одновременно'],
      correctIndex: 0,
      explanation: 'process.nextTick создаёт цепочку: recursive() → nextTick → recursive() → ... до count=5. Все nextTick выполняются до перехода к следующей фазе. setImmediate (check фаза) ждёт завершения цепочки nextTick. "done 6" → "immediate".',
    },
    {
      type: 'output',
      id: 'nodel-q5',
      description: 'EventEmitter: emit синхронный или асинхронный?',
      code: `const { EventEmitter } = require('events');
const ee = new EventEmitter();

ee.on('test', () => console.log('B'));
console.log('A');
ee.emit('test');
console.log('C');`,
      options: ['A, B, C', 'A, C, B', 'B, A, C', 'A, B (C не дожидается)'],
      correctIndex: 0,
      explanation: '`emit` в Node.js EventEmitter — **синхронный**. При вызове emit все подписчики вызываются немедленно в текущем call stack. Порядок: "A" → emit → "B" (sync внутри emit) → "C".',
    },
    {
      type: 'tracing',
      id: 'nodel-q6',
      description: 'Фазы Event Loop. Проследите порядок выполнения.',
      code: `// Код выполняется в I/O callback контексте
setImmediate(() => console.log('immediate')); // check фаза
setTimeout(() => console.log('timeout'), 0);   // timers фаза (след. итерация)
process.nextTick(() => console.log('tick'));   // после текущей операции
Promise.resolve().then(() => console.log('promise')); // microtask`,
      steps: [
        { label: 'Текущая операция завершена', variables: { фаза: 'poll' } },
        { label: 'process.nextTick очередь', variables: { вывод: '"tick"' } },
        { label: 'Promise microtasks', variables: { вывод: '"promise"' } },
        { label: 'check фаза', variables: { вывод: '"immediate"' } },
        { label: 'timers фаза (след. итерация)', variables: { вывод: '"timeout"' } },
      ],
      question: 'Каков порядок вывода?',
      options: ['tick, promise, immediate, timeout', 'immediate, timeout, tick, promise', 'tick, immediate, promise, timeout', 'timeout, immediate, promise, tick'],
      correctIndex: 0,
      explanation: 'Порядок: nextTick (наивысший приоритет) → Promise microtasks → check фаза (setImmediate) → следующая timers фаза (setTimeout). Это специфика Node.js в отличие от браузера.',
    },
    {
      type: 'output',
      id: 'nodel-q7',
      description: 'Worker Threads. Что правильно?',
      code: `// worker.js:
const { parentPort, workerData } = require('worker_threads');
const result = workerData.map(x => x * 2);
parentPort.postMessage(result);

// main.js:
const { Worker } = require('worker_threads');
const worker = new Worker('./worker.js', {
  workerData: [1, 2, 3],
});
worker.on('message', (data) => console.log(data));`,
      options: ['[2, 4, 6]', '[1, 2, 3]', 'TypeError', '[undefined, undefined, undefined]'],
      correctIndex: 0,
      explanation: 'Worker получает данные через workerData, умножает каждый на 2, отправляет результат через postMessage. Main thread получает через worker.on("message"). Результат: [2, 4, 6].',
    },
    {
      type: 'fill-blank',
      id: 'nodel-q8',
      description: 'Заполните пропуск для неблокирующего чтения файла.',
      codeWithBlanks: `const fs = require('fs');

// Неблокирующее чтение:
fs.promises.___BLANK___('file.txt', 'utf8')
  .then((content) => console.log(content))
  .catch(console.error);

// Или с async/await:
const content = await fs.promises.readFile('file.txt', 'utf8');`,
      options: ['readFile', 'readFileSync', 'open', 'createReadStream'],
      correctIndex: 0,
      explanation: '`fs.promises.readFile` — Promise-based API. Неблокирующий: не занимает event loop пока файл читается. `readFileSync` — синхронный, блокирует event loop. `createReadStream` — для больших файлов (поток).',
    },
    {
      type: 'output',
      id: 'nodel-q9',
      description: 'Что произойдёт при переполнении nextTick?',
      code: `function flood() {
  process.nextTick(flood); // бесконечная рекурсия
}
flood();
setImmediate(() => console.log('never?'));`,
      options: ['"never?" никогда не выведется (event loop заблокирован)', '"never?" выведется через время', 'Process.nextTick auto-ограничивает глубину', 'Будет RangeError: Maximum call stack exceeded'],
      correctIndex: 0,
      explanation: 'Бесконечная рекурсия через nextTick: каждый вызов добавляет новый nextTick перед переходом к следующей фазе. setImmediate в check фазе **никогда** не дождётся своей очереди. Node.js заблокирован на nextTick queue. В реальности Node.js может выдать предупреждение, но не ограничит автоматически.',
    },
    {
      type: 'output',
      id: 'nodel-q10',
      description: 'EventEmitter и обработка ошибок. Что произойдёт?',
      code: `const { EventEmitter } = require('events');
const ee = new EventEmitter();

ee.emit('error', new Error('oops'));`,
      options: [
        'Uncaught Error: oops (крашит процесс)',
        'Ошибка игнорируется',
        'Node.js автоматически обрабатывает',
        'emit возвращает false',
      ],
      correctIndex: 0,
      explanation: 'EventEmitter имеет специальное поведение для события "error": если нет подписчика — ошибка **выбрасывается** (throw) и крашит Node.js процесс. Всегда добавляйте `ee.on("error", handler)` для production-кода.',
    },
    {
      type: 'output',
      id: 'nodel-q11',
      description: 'Cluster module. Для чего используется?',
      code: `const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  const cpuCount = os.cpus().length;
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }
} else {
  // Worker process
  require('./server.js');
}`,
      options: [
        'Запустить N worker-процессов для использования всех ядер CPU',
        'Запустить несколько серверов на разных портах',
        'Создать thread pool для I/O',
        'Балансировать нагрузку между серверами',
      ],
      correctIndex: 0,
      explanation: 'Node.js однопоточный — один CPU. Cluster.fork() создаёт дочерние процессы, каждый запускает свою копию приложения. Все слушают один порт (OS балансирует). Это позволяет использовать все ядра CPU. Для CPU-intensive: Worker Threads. Для I/O: один процесс часто достаточен.',
    },
    {
      type: 'complexity',
      id: 'nodel-q12',
      description: 'Какова сложность EventEmitter.emit при N подписчиках?',
      code: `emit(event, ...args) {
  const handlers = this.listeners.get(event) ?? [];
  handlers.forEach((h) => h(...args));
}`,
      options: ['O(N) — вызов каждого подписчика', 'O(1)', 'O(log N)', 'O(N²)'],
      correctIndex: 0,
      explanation: 'emit перебирает все N подписчиков на событие и вызывает каждый. O(N) по числу подписчиков. Это нормально: обычно подписчиков немного. Но при сотнях подписчиков на горячее событие это может стать узким местом.',
    },
  ],
};
