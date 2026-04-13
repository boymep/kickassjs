import type { TopicTheory } from '../../types/topic';

export const nodeEventLoopTheory: TopicTheory = {
  topicId: 'node-event-loop',
  sections: [
    {
      title: 'Архитектура Node.js Event Loop',
      blocks: [
        {
          type: 'text',
          content:
            'Node.js — однопоточный, но асинхронный. Event Loop реализован через **libuv** — кроссплатформенную библиотеку асинхронного I/O. В отличие от браузерного Event Loop, у Node.js есть **фазы** с чёткими приоритетами.',
        },
        {
          type: 'list',
          content:
            '**1. timers** — callbacks от setTimeout и setInterval (истёкшие таймеры).\n**2. pending callbacks** — I/O callbacks отложенные до следующей итерации.\n**3. idle, prepare** — внутреннее использование libuv.\n**4. poll** — ожидание новых I/O событий, выполнение I/O callbacks.\n**5. check** — callbacks от setImmediate.\n**6. close callbacks** — close события (socket.on("close")).',
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            '**Между каждой фазой** Node.js проверяет очередь микрозадач: сначала `process.nextTick`, затем `Promise microtasks`. Они имеют наивысший приоритет.',
        },
        {
          type: 'visualization',
          content: '', vizId: 'node-event-loop',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Порядок выполнения:
console.log('1'); // sync

process.nextTick(() => console.log('2')); // nextTick — перед фазами
Promise.resolve().then(() => console.log('3')); // Promise microtask

setImmediate(() => console.log('4')); // check фаза
setTimeout(() => console.log('5'), 0); // timers фаза

console.log('6'); // sync

// Вывод: 1 → 6 → 2 → 3 → 5 → 4
// НО: setTimeout vs setImmediate порядок за пределами I/O непредсказуем!`,
        },
      ],
    },
    {
      title: 'process.nextTick vs setImmediate vs setTimeout',
      blocks: [
        {
          type: 'code',
          language: 'javascript',
          content: `// process.nextTick — выполняется СРАЗУ после текущей операции,
// перед любой следующей фазой event loop
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
setImmediate(() => console.log('immediate'));
setTimeout(() => console.log('timeout'), 0);
console.log('sync');

// Вывод: sync → nextTick → promise → timeout/immediate (порядок не гарантирован)

// В I/O callback контексте setImmediate всегда раньше setTimeout:
const fs = require('fs');
fs.readFile(__filename, () => {
  setImmediate(() => console.log('immediate')); // CHECK фаза
  setTimeout(() => console.log('timeout'), 0);  // TIMERS фаза (следующий круг)
  // immediate ВСЕГДА раньше timeout здесь
});`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Не злоупотребляйте `process.nextTick` — рекурсивные вызовы могут "заморозить" Event Loop, не давая ему перейти к следующей фазе (I/O будет заблокирован). Node.js выдаёт предупреждение при переполнении nextTick.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ Рекурсивный nextTick блокирует I/O
function recursiveNextTick() {
  process.nextTick(recursiveNextTick); // НИКОГДА не переходит дальше!
}

// ✅ Рекурсивный setImmediate не блокирует I/O
function recursiveImmediate() {
  setImmediate(recursiveImmediate); // Переходит через фазу poll каждый раз
}`,
        },
      ],
    },
    {
      title: 'Блокирующий vs неблокирующий код',
      blocks: [
        {
          type: 'text',
          content:
            'Главное правило: **не блокировать Event Loop**. Синхронные CPU-intensive операции блокируют весь сервер — во время их выполнения не обрабатываются новые запросы.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ Блокирующие операции:
const data = fs.readFileSync('big-file.txt'); // блокирует
JSON.parse(hugeJson);  // синхронный CPU-intensive
while (condition) {}   // синхронный цикл

// ✅ Неблокирующие альтернативы:
const data = await fs.promises.readFile('big-file.txt'); // async
// Для тяжёлых вычислений — Worker Threads:
const { Worker } = require('worker_threads');
const worker = new Worker('./heavy-task.js', { workerData: input });
worker.on('message', (result) => console.log(result));`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Обработка большого массива без блокировки:
function processChunked(arr, chunkSize, processor) {
  return new Promise((resolve) => {
    let index = 0;
    const results = [];

    function processNext() {
      const end = Math.min(index + chunkSize, arr.length);
      while (index < end) {
        results.push(processor(arr[index++]));
      }
      if (index < arr.length) {
        setImmediate(processNext); // отдаём контроль event loop
      } else {
        resolve(results);
      }
    }

    processNext();
  });
}`,
        },
      ],
    },
    {
      title: 'Хитрые кейсы и практические нюансы',
      blocks: [
        {
          type: 'heading',
          content: 'setTimeout(0) vs setImmediate — непредсказуемый порядок вне I/O',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Вне I/O callback — порядок НЕПРЕДСКАЗУЕМ:
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
// Иногда: timeout → immediate
// Иногда: immediate → timeout
// Зависит от времени запуска процесса и системного планировщика

// Внутри I/O callback — setImmediate ВСЕГДА первый:
const fs = require('fs');
fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0);   // TIMERS фаза
  setImmediate(() => console.log('immediate'));   // CHECK фаза (раньше!)
  // immediate → timeout ВСЕГДА
});`,
        },
        {
          type: 'heading',
          content: 'process.nextTick накапливается — может заморозить I/O',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Рекурсивный nextTick блокирует все I/O операции:
let i = 0;
function tick() {
  if (i++ < 1000000) process.nextTick(tick); // Миллион итераций!
}
tick(); // fs.readFile не выполнится, пока не закончится цикл!

// Правило: если нужно отложить выполнение без блокировки I/O
// — используйте setImmediate
function safeRecursion() {
  setImmediate(safeRecursion); // I/O проходит между итерациями
}`,
        },
        {
          type: 'heading',
          content: 'Promise rejection в Node.js — unhandledRejection',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// С Node.js 15+ необработанный rejected Promise завершает процесс!
async function fetchData() {
  throw new Error('network error');
}
fetchData(); // ❌ В Node 15+ это UnhandledPromiseRejection → exit code 1

// ✅ Всегда обрабатывайте rejection:
fetchData().catch(err => console.error(err));

// ✅ Или глобальный обработчик:
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1); // явно завершаем
});`,
        },
        {
          type: 'heading',
          content: 'Cluster и Worker Threads: когда что использовать',
        },
        {
          type: 'list',
          content: `**Worker Threads** — тяжёлые CPU вычисления (криптография, парсинг, ML). Один процесс, несколько потоков, разделяемая память через SharedArrayBuffer.
**Cluster** — горизонтальное масштабирование HTTP-сервера. Несколько процессов-«воркеров», каждый слушает один порт. Балансировка через master.
**Child Process** — запуск внешних программ (ffmpeg, Python-скрипты). Изолированный процесс, общение через IPC или stdio.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'На собеседовании: Worker Threads = для CPU, Cluster = для масштабирования I/O сервера. Оба решают разные задачи.',
        },
      ],
    },
    {
      title: 'EventEmitter — основа Node.js',
      blocks: [
        {
          type: 'text',
          content:
            'EventEmitter — базовый класс для большинства Node.js API. HTTP-сервер, стримы, child_process — все наследуют от EventEmitter. Паттерн: emit событие → все подписчики вызываются синхронно.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { EventEmitter } = require('events');

const emitter = new EventEmitter();

// Подписка:
emitter.on('data', (chunk) => console.log('got:', chunk));
emitter.once('end', () => console.log('finished')); // только один раз

// Генерация события:
emitter.emit('data', 'chunk1');
emitter.emit('data', 'chunk2');
emitter.emit('end');
emitter.emit('end'); // 'once' — не вызовется снова

// Отписка:
const handler = () => {};
emitter.on('event', handler);
emitter.off('event', handler); // = removeListener

// Лимит подписчиков (предупреждение при > 10):
emitter.setMaxListeners(20);`,
        },
      ],
    },
  ],
};
