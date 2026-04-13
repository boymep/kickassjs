import type { TopicQuiz } from '../../types/quiz';

export const nodeNetworkQuiz: TopicQuiz = {
  topicId: 'node-network',
  questions: [
    {
      type: 'output',
      id: 'nodenet-q1',
      description: 'HTTP статус коды. Что означает 201?',
      code: `app.post('/users', async (req, res) => {
  const user = await db.createUser(req.body);
  res.status(201).json(user);
});`,
      options: ['Created — ресурс успешно создан', 'OK — успешный запрос', 'Accepted — запрос принят, обработка позже', 'No Content — успех, без тела'],
      correctIndex: 0,
      explanation: '201 Created — ресурс успешно создан (POST). 200 OK — общий успех. 202 Accepted — запрос принят но ещё обрабатывается (async jobs). 204 No Content — успех без тела ответа (DELETE, PUT без возврата). Правильный статус-код делает API самодокументируемым.',
    },
    {
      type: 'fill-blank',
      id: 'nodenet-q2',
      description: 'Заполните пропуск для error-handling middleware в Express.',
      codeWithBlanks: `// Error handler должен иметь ЧЕТЫРЕ аргумента:
app.use((___BLANK___, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});`,
      options: ['err', 'error', 'e', 'exception'],
      correctIndex: 0,
      explanation: 'Express определяет error-handling middleware по количеству параметров: если у функции 4 аргумента `(err, req, res, next)` — это error handler. При `next(err)` или необработанном throw Express пропускает обычные middleware и ищет error handler.',
    },
    {
      type: 'output',
      id: 'nodenet-q3',
      description: 'Middleware порядок. Что выведет код?',
      code: `app.use((req, res, next) => {
  console.log('A');
  next();
});

app.get('/', (req, res, next) => {
  console.log('B');
  next();
});

app.use((req, res, next) => {
  console.log('C');
  res.send('OK');
});

// GET /`,
      options: ['A, B, C', 'A, C, B', 'B, A, C', 'C, B, A'],
      correctIndex: 0,
      explanation: 'Express выполняет middleware в порядке регистрации. `app.use` без пути — для всех запросов. `next()` передаёт управление следующему. A (use) → B (get /) → C (use). Если не вызвать `next()` — цепочка прерывается.',
    },
    {
      type: 'output',
      id: 'nodenet-q4',
      description: 'WebSocket vs HTTP Long Polling. Что предпочтительнее для чата?',
      code: `// Long Polling (устаревший паттерн):
// GET /messages?after=123 — держать соединение открытым
// При новом сообщении — ответить и закрыть
// Клиент сразу открывает новый запрос

// WebSocket:
// ws.on('message', handler)
// ws.send('message')`,
      options: [
        'WebSocket: одно постоянное соединение, двунаправленное, меньше overhead',
        'Long Polling: проще, лучше поддержка браузеров',
        'Одинаково подходят',
        'SSE лучше обоих для чата',
      ],
      correctIndex: 0,
      explanation: 'WebSocket устанавливает одно постоянное соединение с минимальным overhead (2-10 байт на фрейм vs HTTP-заголовки ~500+ байт). Long polling создаёт новый HTTP-запрос на каждое событие. Для чата реального времени WebSocket — стандарт. SSE — только сервер→клиент, не подходит для чата.',
    },
    {
      type: 'fill-blank',
      id: 'nodenet-q5',
      description: 'Заполните пропуск для чтения JSON тела запроса в Express.',
      codeWithBlanks: `const express = require('express');
const app = express();

// Middleware для парсинга JSON body:
app.use(express.___BLANK___());

app.post('/data', (req, res) => {
  console.log(req.body); // { key: 'value' }
});`,
      options: ['json', 'parseJson', 'bodyParser', 'parse'],
      correctIndex: 0,
      explanation: '`express.json()` — встроенный middleware для парсинга `Content-Type: application/json`. Без него `req.body` будет undefined. Раньше требовался отдельный пакет `body-parser`, в Express 4.16+ он встроен. Для form-urlencoded: `express.urlencoded({ extended: true })`.',
    },
    {
      type: 'output',
      id: 'nodenet-q6',
      description: 'Rate Limiting. Зачем нужен?',
      code: `// Без rate limiting:
app.post('/login', async (req, res) => {
  const user = await checkPassword(req.body);
  res.json(user);
});

// Что произойдёт при brute force атаке?`,
      options: [
        'Атакующий перебирает пароли — 10000 попыток в секунду',
        'Node.js автоматически ограничивает запросы',
        'HTTP/2 предотвращает это',
        'CORS блокирует такие запросы',
      ],
      correctIndex: 0,
      explanation: 'Без rate limiting атакующий может делать тысячи запросов в секунду для перебора паролей или DoS. Rate limiting ограничивает N запросов с одного IP/пользователя за период. Для login особенно важно: после 5-10 неудачных — блокировка на минуты. Библиотеки: `express-rate-limit`, `rate-limiter-flexible`.',
    },
    {
      type: 'output',
      id: 'nodenet-q7',
      description: 'Circuit Breaker. Что делает паттерн?',
      code: `class CircuitBreaker {
  // CLOSED → (N ошибок) → OPEN → (timeout) → HALF-OPEN
  // HALF-OPEN: одна попытка
  //   → успех: CLOSED
  //   → ошибка: OPEN снова
}`,
      options: [
        'Прекращает вызовы к упавшему сервису и автоматически восстанавливается',
        'Ограничивает количество одновременных запросов',
        'Добавляет retry логику',
        'Балансирует нагрузку между серверами',
      ],
      correctIndex: 0,
      explanation: 'Circuit Breaker — паттерн устойчивости: после N ошибок "размыкает" цепь (OPEN) — запросы сразу отклоняются без обращения к сервису. Через timeout переходит в HALF-OPEN — пропускает один запрос. Успех → CLOSED, ошибка → OPEN снова. Предотвращает каскадные сбои в микросервисах.',
    },
    {
      type: 'output',
      id: 'nodenet-q8',
      description: 'SSE (Server-Sent Events). Какой Content-Type нужен?',
      code: `app.get('/events', (req, res) => {
  res.setHeader('Content-Type', '???');
  res.setHeader('Cache-Control', 'no-cache');

  setInterval(() => {
    res.write('data: hello\\n\\n');
  }, 1000);
});`,
      options: ['text/event-stream', 'application/stream', 'text/plain', 'application/json'],
      correctIndex: 0,
      explanation: '`text/event-stream` — специальный MIME-тип для SSE. Браузер при получении этого типа держит соединение открытым и парсит события формата `data: ...\\n\\n`. Формат события: `event:` (имя), `data:` (данные), `id:` (ID для retry), `retry:` (задержка переподключения).',
    },
    {
      type: 'tracing',
      id: 'nodenet-q9',
      description: 'HTTP/1.1 Keep-Alive. Как работает?',
      code: `// Клиент делает 3 запроса к одному серверу:
// GET /page
// GET /style.css
// GET /script.js`,
      steps: [
        { label: 'Первый запрос: TCP handshake + HTTP GET /page', variables: { соединение: 'новое' } },
        { label: 'Ответ: Connection: keep-alive', variables: { TCP: 'остаётся открытым' } },
        { label: 'Второй запрос: HTTP GET /style.css (без нового TCP)', variables: { TCP: 'то же соединение' } },
        { label: 'Третий запрос: HTTP GET /script.js', variables: { TCP: 'то же соединение' } },
        { label: 'Timeout простоя: TCP закрывается', variables: { соединение: 'закрыто' } },
      ],
      question: 'Сколько TCP handshake происходит?',
      options: ['1 (Keep-Alive переиспользует соединение)', '3 (на каждый запрос)', '2', '0'],
      correctIndex: 0,
      explanation: 'Keep-Alive (HTTP/1.1 по умолчанию) переиспользует TCP-соединение для нескольких запросов. Без него: 3 × (SYN+SYN-ACK+ACK) overhead. HTTP/2 идёт дальше: мультиплексирует все запросы по одному соединению параллельно, без head-of-line blocking.',
    },
    {
      type: 'output',
      id: 'nodenet-q10',
      description: 'Exponential backoff. Зачем нужна возрастающая задержка?',
      code: `// Вариант A: фиксированная задержка
async function retryFixed(fn, n) {
  for (let i = 0; i < n; i++) {
    try { return await fn(); } catch {}
    await sleep(100); // всегда 100ms
  }
}

// Вариант B: exponential backoff
async function retryExp(fn, n) {
  for (let i = 0; i < n; i++) {
    try { return await fn(); } catch {}
    await sleep(100 * Math.pow(2, i)); // 100, 200, 400...
  }
}`,
      options: [
        'B лучше: даёт серверу время восстановиться, снижает нагрузку',
        'A лучше: быстрее при восстановлении сервера',
        'Одинаково для production',
        'A лучше: предсказуемое время ожидания',
      ],
      correctIndex: 0,
      explanation: 'Если сервер перегружен и все клиенты ретраят каждые 100ms — они создают thundering herd (стадо), усугубляя проблему. Exponential backoff даёт серверу время восстановиться. Часто добавляют jitter (±random) чтобы клиенты не синхронизировались. Стандарт для production retry-логики.',
    },
    {
      type: 'output',
      id: 'nodenet-q11',
      description: 'req.params vs req.query vs req.body. В чём разница?',
      code: `// Route: POST /users/:id/posts?page=2
// Body: { "title": "Hello" }

app.post('/users/:id/posts', (req, res) => {
  console.log(req.params); // ???
  console.log(req.query);  // ???
  console.log(req.body);   // ???
});`,
      options: [
        'params: {id:"X"}, query: {page:"2"}, body: {title:"Hello"}',
        'params: {}, query: {id:"X",page:"2"}, body: {}',
        'params: {id:"X",page:"2"}, query: {}, body: {title:"Hello"}',
        'params: {id:"X"}, query: {}, body: {title:"Hello",page:"2"}',
      ],
      correctIndex: 0,
      explanation: '`req.params` — динамические сегменты URL (`:id`). `req.query` — строка запроса (`?page=2`). `req.body` — тело запроса (JSON, form data). Все три — разные источники данных. Никогда не доверяйте им без валидации — всё приходит от клиента.',
    },
    {
      type: 'complexity',
      id: 'nodenet-q12',
      description: 'Сложность поиска роута в Router с N зарегистрированными маршрутами?',
      code: `// Простая реализация: линейный поиск
match(method, path) {
  for (const route of this.routes) { // N итераций
    if (route.regex.test(path)) return route;
  }
}

// Оптимизация: радиксное дерево (Fastify, Express 5)`,
      options: ['O(N) — проверяем каждый роут по очереди', 'O(1)', 'O(log N)', 'O(N²)'],
      correctIndex: 0,
      explanation: 'Линейный поиск по роутам — O(N). Для большинства приложений (десятки роутов) это нормально. Fastify использует radix tree (radix/тернарное дерево) для O(log N) матчинга. Express 4 — линейный поиск. При тысячах роутов (динамические CMS) разница ощутима.',
    },
  ],
};
