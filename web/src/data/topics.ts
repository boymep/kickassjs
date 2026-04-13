import type { TopicMeta } from '../types/topic';

export const algorithmTopics: TopicMeta[] = [
  {
    id: 'binary-search',
    slug: 'binary-search',
    title: 'Бинарный поиск',
    description: 'Поиск в отсортированном массиве за O(log n)',
    icon: 'Search',
    complexity: 'O(log n)',
  },
  {
    id: 'two-pointers',
    slug: 'two-pointers',
    title: 'Два указателя',
    description: 'Два указателя навстречу или в одном направлении',
    icon: 'CompareArrows',
    complexity: 'O(n)',
  },
  {
    id: 'sliding-window',
    slug: 'sliding-window',
    title: 'Скользящее окно',
    description: 'Оптимизация работы с подмассивами и подстроками',
    icon: 'ViewColumn',
    complexity: 'O(n)',
  },
  {
    id: 'hash-map',
    slug: 'hash-map',
    title: 'Хеш-таблицы',
    description: 'Быстрый поиск, подсчёт частот, группировка',
    icon: 'Tag',
    complexity: 'O(1) lookup',
  },
  {
    id: 'stacks-queues',
    slug: 'stacks-queues',
    title: 'Стеки и очереди',
    description: 'LIFO/FIFO структуры для обработки последовательностей',
    icon: 'Layers',
    complexity: 'O(n)',
  },
  {
    id: 'trees',
    slug: 'trees',
    title: 'Обход деревьев',
    description: 'DFS/BFS, рекурсия, работа с вложенными структурами',
    icon: 'AccountTree',
    complexity: 'O(n)',
  },
];

export const jsTopics: TopicMeta[] = [
  {
    id: 'js-closures',
    slug: 'js-closures',
    title: 'Замыкания',
    description: 'Лексическая область видимости, замыкания, IIFE, типичные ловушки',
    icon: 'Lock',
    complexity: 'Важно',
  },
  {
    id: 'js-event-loop',
    slug: 'js-event-loop',
    title: 'Event Loop',
    description: 'Стек вызовов, микро- и макрозадачи, порядок выполнения',
    icon: 'Loop',
    complexity: 'Важно',
  },
  {
    id: 'js-this',
    slug: 'js-this',
    title: 'this и контекст',
    description: '4 правила определения this, bind/call/apply, стрелочные функции',
    icon: 'Fingerprint',
    complexity: 'Важно',
  },
  {
    id: 'js-async',
    slug: 'js-async',
    title: 'Async / Промисы',
    description: 'Promise, цепочки, async/await, Promise.all, обработка ошибок',
    icon: 'HourglassEmpty',
    complexity: 'Базовый',
  },
  {
    id: 'js-prototypes',
    slug: 'js-prototypes',
    title: 'Прототипы и ООП',
    description: 'Цепочка прототипов, Object.create, классы, наследование',
    icon: 'Extension',
    complexity: 'Базовый',
  },
  {
    id: 'js-dom',
    slug: 'js-dom',
    title: 'DOM и события',
    description: 'Работа с DOM, делегирование событий, всплытие, нативный JS',
    icon: 'DomainVerification',
    complexity: 'Важно',
  },
  {
    id: 'js-network',
    slug: 'js-network',
    title: 'Сеть: CORS, cookie, HTTP',
    description: 'HTTP методы, CORS preflight, cookies, fetch API, AbortController',
    icon: 'CloudDone',
    complexity: 'Базовый',
  },
  {
    id: 'js-browser',
    slug: 'js-browser',
    title: 'Работа браузера',
    description: 'Critical Rendering Path, reflow/repaint, оптимизация изображений',
    icon: 'Web',
    complexity: 'Базовый',
  },
];

export const nodejsTopics: TopicMeta[] = [
  {
    id: 'node-event-loop',
    slug: 'node-event-loop',
    title: 'Event Loop в Node.js',
    description: 'Фазы event loop, process.nextTick, setImmediate, libuv',
    icon: 'Autorenew',
    complexity: 'Важно',
  },
  {
    id: 'node-streams',
    slug: 'node-streams',
    title: 'Стримы',
    description: 'Readable, Writable, Transform, backpressure, pipe/pipeline',
    icon: 'Water',
    complexity: 'Важно',
  },
  {
    id: 'node-network',
    slug: 'node-network',
    title: 'Сеть / HTTP',
    description: 'HTTP сервер, роутинг, CORS, middleware, rate limiting',
    icon: 'Router',
    complexity: 'Базовый',
  },
  {
    id: 'node-optimization',
    slug: 'node-optimization',
    title: 'Оптимизация',
    description: 'LRU cache, батчинг, circuit breaker, пул ресурсов, мемоизация',
    icon: 'Speed',
    complexity: 'Важно',
  },
];

// Backward compatibility — used by HomePage
export const topics = algorithmTopics;
