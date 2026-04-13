import type { TopicFlashcards } from '../../types/flashcard';

export const nodeEventLoopFlashcards: TopicFlashcards = {
  topicId: 'node-event-loop',
  cards: [
    {
      id: 'nodel-f1',
      question: 'Чем Event Loop в Node.js отличается от браузерного?',
      answer:
        'Node.js использует libuv с явными фазами цикла. В браузере фазы не стандартизированы. Главное отличие: в Node.js есть process.nextTick (выполняется раньше Promise microtasks) и setImmediate (после poll фазы).',
      keyPoints: [
        'Node.js: 6 фаз — timers, pending callbacks, idle/prepare, poll, check, close',
        'process.nextTick — особая очередь, выполняется между каждой фазой',
        'setImmediate — check фаза, после poll',
        'Браузер: нет явных фаз, нет process.nextTick/setImmediate',
      ],
    },
    {
      id: 'nodel-f2',
      question: 'Каков порядок выполнения: process.nextTick, Promise.then, setImmediate, setTimeout?',
      answer:
        'process.nextTick → Promise microtasks → setTimeout/setImmediate (порядок зависит от контекста). nextTick всегда перед Promise, оба перед макрозадачами.',
      keyPoints: [
        '1. process.nextTick (наивысший приоритет среди микрозадач)',
        '2. Promise.then / queueMicrotask',
        '3. setTimeout (timers фаза)',
        '4. setImmediate (check фаза)',
        'setImmediate vs setTimeout(0) вне I/O: порядок непредсказуем',
        'setImmediate vs setTimeout(0) внутри I/O callback: setImmediate ВСЕГДА первый',
      ],
      code: `// Вне I/O (порядок 3/4 непредсказуем):
process.nextTick(() => console.log('1. nextTick'));
Promise.resolve().then(() => console.log('2. promise'));
setTimeout(() => console.log('3. timeout'), 0);
setImmediate(() => console.log('4. immediate'));
console.log('0. sync');
// 0.sync → 1.nextTick → 2.promise → 3 или 4 (нестабильно)`,
    },
    {
      id: 'nodel-f3',
      question: 'Почему рекурсивный process.nextTick опасен? Как это исправить?',
      answer:
        'Рекурсивный nextTick заполняет очередь быстрее, чем она опустошается — Event Loop никогда не переходит к следующей фазе, I/O callbacks не вызываются. Исправление: использовать setImmediate для рекурсии.',
      keyPoints: [
        'nextTick очередь полностью очищается до следующей фазы',
        'Бесконечный nextTick = блокировка I/O событий',
        'setImmediate выполняется в check фазе — I/O проходит в poll между итерациями',
        'Node.js выдаёт MaxCallStackSize, но не предупреждает о nextTick злоупотреблении',
      ],
      code: `// ❌ Блокирует I/O:
function bad() { process.nextTick(bad); }

// ✅ Безопасная рекурсия:
function good() { setImmediate(good); }`,
    },
    {
      id: 'nodel-f4',
      question: 'Worker Threads, Cluster, Child Process — в чём разница? Когда что использовать?',
      answer:
        'Worker Threads — потоки в одном процессе для CPU задач. Cluster — несколько процессов для масштабирования HTTP-сервера. Child Process — запуск внешних программ.',
      keyPoints: [
        'Worker Threads: CPU-intensive (crypto, ML), разделяемая память через SharedArrayBuffer',
        'Cluster: горизонтальное масштабирование, каждый процесс слушает один порт через master',
        'Child Process: запуск ffmpeg, Python-скриптов, изолированный процесс',
        'Для I/O (HTTP, DB) — libuv уже неблокирующий, дополнительные потоки не нужны',
      ],
    },
    {
      id: 'nodel-f5',
      question: 'Что делает EventEmitter? Как правильно снимать подписки?',
      answer:
        'EventEmitter — паттерн publish/subscribe. Позволяет emit события и подписываться на них. Ключевое правило: всегда снимать подписки чтобы избежать утечек памяти.',
      keyPoints: [
        'on() — постоянная подписка, once() — одноразовая',
        'off()/removeListener() — снятие подписки',
        'Предупреждение MaxListenersExceededWarning при > 10 подписчиках на событие',
        'setMaxListeners() — изменить лимит',
        'Подписки в on() + забытый off() = утечка памяти',
      ],
      code: `const ee = new EventEmitter();

const handler = (data) => process(data);
ee.on('message', handler);

// Не забыть снять:
ee.off('message', handler); // или removeListener
// Или использовать once для одноразового:
ee.once('connect', () => console.log('connected'));`,
    },
    {
      id: 'nodel-f6',
      question: 'Что такое libuv и какую роль он играет в Node.js?',
      answer:
        'libuv — кроссплатформенная C-библиотека асинхронного I/O, на которой построен Node.js Event Loop. Предоставляет thread pool для I/O операций (file system, DNS), которые нельзя сделать асинхронно на уровне ОС.',
      keyPoints: [
        'Thread pool по умолчанию: 4 потока (UV_THREADPOOL_SIZE)',
        'Thread pool используется для: fs (кроме watch), DNS resolve, crypto, zlib',
        'Сетевые операции (TCP/UDP) — нативно асинхронны через epoll/kqueue',
        'Увеличить: UV_THREADPOOL_SIZE=16 node app.js',
      ],
    },
  ],
};
