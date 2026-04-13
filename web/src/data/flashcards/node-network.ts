import type { TopicFlashcards } from '../../types/flashcard';

export const nodeNetworkFlashcards: TopicFlashcards = {
  topicId: 'node-network',
  cards: [
    {
      id: 'nodenw-f1',
      question: 'Как устроена middleware-цепочка в Express? Что если не вызвать next()?',
      answer:
        'Middleware — функции (req, res, next). Express вызывает их по порядку регистрации. Если не вызвать next() — цепочка останавливается, запрос зависает навсегда (или до таймаута).',
      keyPoints: [
        'next() — передать управление следующей middleware',
        'next(err) — передать ошибку в error handler',
        'Error handler: (err, req, res, next) — 4 аргумента',
        'Порядок регистрации важен: app.use() в коде = порядок выполнения',
      ],
      code: `// Middleware порядок критичен:
app.use(logger);     // 1. логируем
app.use(auth);       // 2. проверяем токен
app.use(rateLimit);  // 3. ограничиваем
app.get('/data', handler); // 4. обрабатываем

// Error handler — последним:
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});`,
    },
    {
      id: 'nodenw-f2',
      question: 'WebSocket vs SSE vs Long Polling — когда что использовать?',
      answer:
        'WebSocket — полнодуплексный канал (чат, игры). SSE — однонаправленный серверный поток (уведомления, прогресс). Long Polling — устаревший, но совместимый способ для любых браузеров.',
      keyPoints: [
        'WebSocket: двусторонняя связь, ws://, требует поддержки на сервере',
        'SSE: только сервер→клиент, нативный HTTP, автопереподключение',
        'SSE преимущество: работает через HTTP/2, proxy, без доп. протокола',
        'Long Polling: сервер держит открытый запрос, high overhead на соединение',
      ],
    },
    {
      id: 'nodenw-f3',
      question: 'Что такое Circuit Breaker? Три состояния и как они работают.',
      answer:
        'Circuit Breaker защищает от каскадных отказов: после N ошибок "размыкается" и быстро отклоняет запросы без обращения к сервису. Через timeout переходит в HALF-OPEN для проверки.',
      keyPoints: [
        'CLOSED: нормальная работа, ошибки считаются',
        'OPEN: немедленный throw без вызова сервиса (fail-fast)',
        'HALF-OPEN: одна пробная попытка — успех→CLOSED, ошибка→OPEN',
        'Защищает перегруженный сервис от лавины запросов',
      ],
    },
    {
      id: 'nodenw-f4',
      question: 'Чем HTTP/2 лучше HTTP/1.1? Когда это важно?',
      answer:
        'HTTP/2 решает Head-of-line blocking через мультиплексирование — много запросов параллельно по одному соединению. Также: бинарный протокол, сжатие заголовков (HPACK), Server Push.',
      keyPoints: [
        'HTTP/1.1: 1 запрос на соединение (или ждёт). Браузер открывает 6 соединений на домен',
        'HTTP/2: N запросов по одному соединению одновременно',
        'Практически: меньше RTT, важно для SPA с множеством API-вызовов',
        'Node.js http2 модуль, или через NGINX перед Node.js серверами',
      ],
    },
    {
      id: 'nodenw-f5',
      question: 'Как реализовать rate limiting в Node.js? Какие алгоритмы существуют?',
      answer:
        'Rate limiting ограничивает частоту запросов. Основные алгоритмы: Fixed Window (счётчик на период), Sliding Window (скользящее окно), Token Bucket (пополняемые токены).',
      keyPoints: [
        'Fixed Window: просто, но всплески на границе окна',
        'Sliding Window: точнее, но больше памяти (log каждого запроса)',
        'Token Bucket: позволяет краткие burst в пределах накопленных токенов',
        'В production: redis-based (многосерверная среда) или express-rate-limit',
      ],
    },
  ],
};
