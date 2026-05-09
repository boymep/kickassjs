import type { Lesson } from '../../types/lesson';
import { nodeNetworkQuiz } from '../quizzes/node-network';
import { nodeNetworkFlashcards } from '../flashcards/node-network';

// Index quiz questions for reuse as checkpoints.
const Q = Object.fromEntries(nodeNetworkQuiz.questions.map((q) => [q.id, q]));

// Questions used as in-chapter checkpoints (must NOT appear in finalQuiz).
const CHECKPOINT_IDS = new Set(['nodenet-q3', 'nodenet-q2', 'nodenet-q6', 'nodenet-q9']);

const extraFlashcards = [
  {
    id: 'nodenw-f6',
    question: 'Минимальный HTTP-сервер на модуле http без Express — как написать?',
    answer:
      'Импортируем http, вызываем http.createServer((req, res) => ...) и server.listen(port). req — IncomingMessage (Readable stream), res — ServerResponse (Writable stream). Тело запроса читается через req.on("data") + req.on("end"), ответ — через res.writeHead и res.end.',
    keyPoints: [
      'http.createServer возвращает экземпляр Server, унаследованный от EventEmitter',
      'req — это Readable stream: тело читается по чанкам',
      'res.writeHead(status, headers) обязателен до res.end, иначе будут дефолтные 200/text-plain',
      'Нет встроенного роутинга и парсинга JSON — это нужно писать руками',
      'Подходит для embedded-сервисов и когда хочется минимум зависимостей',
    ],
    code: `const http = require('http');
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('OK');
  }
  res.writeHead(404);
  res.end();
});
server.listen(3000);`,
  },
  {
    id: 'nodenw-f7',
    question: 'Что такое CORS и как его настроить на Node.js-сервере?',
    answer:
      'CORS — механизм безопасности браузера, ограничивающий cross-origin запросы. Сервер должен явно разрешить домен через заголовок Access-Control-Allow-Origin. Для запросов с credentials, нестандартными заголовками или методами браузер сначала шлёт preflight OPTIONS-запрос, на который тоже нужно ответить.',
    keyPoints: [
      'Access-Control-Allow-Origin: указывает разрешённый origin (или *)',
      'Preflight (OPTIONS): браузер шлёт его перед "сложными" запросами — нужно вернуть 204 с Allow-Methods/Allow-Headers',
      'credentials: при Allow-Credentials: true нельзя использовать * — только конкретный origin',
      'Allow-Origin: * не работает, если на клиенте указан credentials: "include"',
      'В Express обычно используют пакет cors; на нативном http — middleware-функция перед роутингом',
    ],
  },
  {
    id: 'nodenw-f8',
    question: 'Чем rate limiting отличается от throttling?',
    answer:
      'Rate limiting — это ограничение количества запросов за период (например, 100 RPS на пользователя), реализуется на сервере, превышение возвращает 429. Throttling — это контроль частоты вызовов на уровне клиента или внутри функции (debounce/throttle), сглаживает поток без отказа в обслуживании.',
    keyPoints: [
      'Rate limit: серверная защита, возвращает 429 Too Many Requests при превышении',
      'Throttling: клиентское/внутреннее сглаживание частоты вызовов (1 раз в N мс)',
      'Rate limit алгоритмы: fixed window, sliding window, token bucket, leaky bucket',
      'Throttle vs debounce: throttle гарантирует частоту, debounce — задержку до тишины',
      'На практике используют вместе: клиент throttle-ит UI-события, сервер rate-limit-ит API',
    ],
  },
  {
    id: 'nodenw-f9',
    question: 'Что такое HTTP Keep-Alive и зачем он нужен?',
    answer:
      'Keep-Alive — механизм HTTP/1.1, позволяющий переиспользовать одно TCP-соединение для нескольких запросов. Включён по умолчанию в HTTP/1.1. Экономит TCP-handshake (3 RTT) и TLS-handshake (1-2 RTT) на каждый последующий запрос.',
    keyPoints: [
      'TCP-handshake — 3 RTT, TLS — ещё 1-2 RTT; на каждом запросе это огромный overhead',
      'Keep-Alive переиспользует уже открытое соединение для следующих запросов',
      'Заголовок Connection: keep-alive (в HTTP/1.1 — дефолт; в HTTP/1.0 — нужно явно)',
      'В Node.js: http.Agent с keepAlive: true для исходящих запросов',
      'Серверный keep-alive timeout: server.keepAliveTimeout (по умолчанию 5 секунд)',
      'HTTP/2 идёт дальше: одно соединение + мультиплексирование запросов',
    ],
  },
];

export const nodeNetworkLesson: Lesson = {
  topicId: 'node-network',

  intro: {
    whyItMatters: `Node.js — это HTTP-сервер «из коробки»: модуль \`http\` входит в стандартную библиотеку, и для запуска сервера не нужно ни одной зависимости. Эта особенность делает Node.js де-факто стандартом для бэкенда веб-приложений и BFF-слоёв. На собеседовании в Node.js-команды почти всегда проверяют, понимаете ли вы, что происходит **под** Express: как устроены \`req\` и \`res\` (это Readable и Writable стримы), как работает middleware-цепочка (массив функций \`(req, res, next) => ...\`, выполняемых по порядку), как вручную написать роутинг (паттерн пути → обработчик), и где в этой архитектуре заканчивается зона ответственности фреймворка и начинается ваша.

Помимо архитектуры важна **безопасность**: CORS на стороне сервера (Access-Control-Allow-*, preflight OPTIONS), rate limiting (защита от brute-force и DoS), helmet для базовых HTTP-заголовков (CSP, HSTS, X-Frame-Options). Понимание этих механизмов отличает джуна от мидла: джун пишет \`app.use(cors())\` и идёт дальше, мидл объясняет, почему \`Access-Control-Allow-Origin: *\` не работает с credentials, как preflight кэшируется и почему rate limiter в multi-instance сервере должен быть на Redis, а не в памяти процесса.

В этом уроке вы научитесь читать Express-код по фазам middleware-конвейера, реализовывать минимальный роутер и rate limiter руками и грамотно отвечать на вопросы про CORS, keep-alive и HTTP/2 — те, которые часто звучат на интервью.`,
    estimatedMinutes: 35,
    interviewAngle:
      'Senior-интервьюер проверяет: умеете ли вы написать минимальный HTTP-сервер без фреймворков, понимаете ли middleware-pipeline и порядок их выполнения, можете ли объяснить CORS не на уровне «копирую middleware из примера», а как работают preflight и Access-Control-* заголовки, и знаете ли разницу между rate limiting и throttling.',
    prerequisites: [
      { slug: 'node-event-loop', title: 'Event Loop в Node.js' },
      { slug: 'node-streams', title: 'Streams в Node.js' },
    ],
  },

  resources: {
    videos: [
      {
        source: 'youtube',
        id: 'AlrsPGwq5OQ',
        title: 'CORS in 100 Seconds',
        channel: 'Fireship',
        language: 'en',
        durationSec: 2 * 60,
        description: 'Сжатое объяснение CORS: что такое origin, как работает preflight и почему серверу нужно явно разрешать домены.',
      },
      {
        source: 'youtube',
        id: 'gxm0c7H75dM',
        title: 'How HTTP/2 Works, Performance, Pros & Cons and More',
        channel: 'Hussein Nasser',
        language: 'en',
        durationSec: 18 * 60,
        description: 'Hussein Nasser про HTTP/2 и keep-alive: head-of-line blocking, мультиплексирование, server push.',
      },
    ],
    links: [
      {
        url: 'https://nodejs.org/docs/latest/api/http.html',
        title: 'HTTP — Node.js API',
        source: 'nodejs-docs',
        language: 'en',
        note: 'Каноническая документация модуля http: createServer, IncomingMessage, ServerResponse, Agent.',
      },
      {
        url: 'https://expressjs.com/en/guide/using-middleware.html',
        title: 'Using middleware — Express guide',
        source: 'article',
        language: 'en',
        note: 'Официальный гайд про middleware: типы (application/router/error-handling), порядок, next().',
      },
      {
        url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/CORS',
        title: 'CORS — MDN',
        source: 'mdn',
        language: 'ru',
        note: 'Подробный разбор: simple vs preflighted, Access-Control-* заголовки, credentials.',
      },
      {
        url: 'https://web.dev/articles/rate-limit',
        title: 'Rate limiting strategies — web.dev',
        source: 'web-dev',
        language: 'en',
        note: 'Алгоритмы (fixed window, sliding window, token bucket) с picture-объяснениями.',
      },
      {
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html',
        title: 'Node.js Security Cheat Sheet — OWASP',
        source: 'spec',
        language: 'en',
        note: 'Чек-лист безопасности: helmet, rate limiting, валидация, защита от prototype pollution.',
      },
    ],
  },

  chapters: [
    {
      id: 'http-server',
      title: 'Минимальный HTTP-сервер на модуле http',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Главная особенность Node.js — встроенный модуль `http`, через который сервер запускается без единой зависимости. На собеседовании этот пример просят написать на доске, чтобы убедиться, что кандидат понимает, как устроен HTTP-сервер до уровня Express.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const http = require('http');

const server = http.createServer((req, res) => {
  // req — IncomingMessage (Readable stream)
  // res — ServerResponse (Writable stream)
  const { method, url } = req;

  if (method === 'GET' && url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('OK');
  }

  if (method === 'POST' && url === '/api/echo') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ received: body }));
    });
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(3000, () => console.log('Server :3000'));`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            '`http.createServer` возвращает экземпляр `Server`, унаследованный от EventEmitter. Каждый запрос порождает событие `request` с парой `(req, res)`. Под капотом Node.js принимает соединения через `epoll`/`kqueue`/`IOCP` и разбирает HTTP-протокол на C-уровне.',
        },
        {
          type: 'list',
          content: `Что нужно держать в голове:
- \`req\` — это **Readable stream**: тело POST-запроса читается событиями \`data\` + \`end\`, не приходит целиком.
- \`res.writeHead(status, headers)\` обязателен **до** \`res.end\` или \`res.write\`. После любой записи заголовки уже отправлены и изменить их нельзя.
- Нет встроенного роутинга, парсинга JSON, CORS, статики — всё пишется руками.
- Если забыть \`res.end()\`, клиент будет ждать ответ до timeout-а сервера (по умолчанию 2 минуты).`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Express, Fastify и Koa — это **обёртки** над `http.createServer`. Они принимают тот же `(req, res)` и добавляют сахар: парсинг JSON, роутер, middleware-конвейер, обработку ошибок. На собеседовании знание базового http показывает, что вы понимаете, что происходит «под фреймворком».',
        },
      ],
      flashcardIds: ['nodenw-f6'],
    },

    {
      id: 'middleware',
      title: 'Middleware-цепочка: паттерн Express',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            '**Middleware** — функция вида `(req, res, next) => ...`, которая получает запрос/ответ и решает: обработать его, передать дальше через `next()` или прервать цепочку, отправив ответ. Это центральный паттерн Express и большинства Node.js-фреймворков.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const express = require('express');
const app = express();

// 1. Логирование — выполняется первым
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next(); // передаём управление дальше
});

// 2. Парсинг JSON-тела
app.use(express.json());

// 3. Аутентификация
app.use((req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  req.user = decode(token); // прокидываем данные дальше через req
  next();
});

// 4. Роуты
app.get('/me', (req, res) => res.json(req.user));

// 5. Error-handler — ВСЕГДА с 4 аргументами и в конце
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(3000);`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Если middleware **не вызовет** `next()` и не отправит ответ — запрос «зависнет» до server timeout. Это распространённый баг: забыл `next()` после `req.user = ...`.',
        },
        {
          type: 'list',
          content: `Правила middleware-конвейера:
- Middleware выполняются строго **в порядке регистрации** через \`app.use\` / \`app.get\` и т. д.
- \`next()\` без аргумента — переход к следующему middleware. \`next(err)\` — пропуск всех обычных middleware и переход к **error-handler**.
- Express определяет error-handler по **числу аргументов**: 4 → \`(err, req, res, next)\`. С 3 — обычный middleware.
- Передача данных между middleware — через \`req\` (например, \`req.user\`) или через \`res.locals\`.
- \`express.Router()\` — мини-приложение, чтобы группировать роуты с собственными middleware: \`app.use('/api', apiRouter)\`.`,
        },
        {
          type: 'text',
          content:
            'На собеседовании часто просят **реализовать middleware-pipeline руками** — это тот же паттерн, что Redux middleware и Koa: массив функций, рекурсивный диспатч.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Простейший middleware-pipeline (без http, на чистых функциях)
function createPipeline(middlewares) {
  return function run(req, res) {
    let i = 0;
    function next(err) {
      if (err) {
        // ищем первый error-handler (4 аргумента)
        while (i < middlewares.length && middlewares[i].length < 4) i++;
        if (i >= middlewares.length) throw err;
        return middlewares[i++](err, req, res, next);
      }
      if (i >= middlewares.length) return;
      const mw = middlewares[i++];
      if (mw.length >= 4) return next(); // skip error-handlers в обычном проходе
      mw(req, res, next);
    }
    next();
  };
}`,
        },
      ],
      playground: {
        starterCode: `// Реализуйте функцию runMiddleware(middlewares, req, res),
// которая последовательно выполняет middleware и собирает в req.log
// строку из имён, через которые прошёл запрос.
// Каждый middleware: (req, res, next) => { req.log += name; next(); }

function runMiddleware(middlewares, req, res) {
  // ваш код
}

const req = { log: '' };
const res = {};
const a = (req, res, next) => { req.log += 'A'; next(); };
const b = (req, res, next) => { req.log += 'B'; next(); };
const c = (req, res, next) => { req.log += 'C'; next(); };

runMiddleware([a, b, c], req, res);
console.log(req.log); // ожидаем 'ABC'`,
        expectedOutput: 'ABC',
        description:
          'Реализуйте мини-конвейер middleware. Главная идея: каждый middleware получает функцию next, при вызове которой управление переходит к следующему в массиве.',
      },
      flashcardIds: ['nodenw-f1'],
      checkpoint: [Q['nodenet-q3']!, Q['nodenet-q2']!],
    },

    {
      id: 'routing',
      title: 'Роутинг руками: путь → обработчик',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Роутер — структура, сопоставляющая `(method, path)` с обработчиком. В Express 4 это линейный поиск по массиву (`O(N)`), в Fastify — radix-дерево (`O(log N)`). На собеседовании просят реализовать минимальный роутер с поддержкой динамических сегментов вроде `/users/:id`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Минимальный роутер. Регистрация и матчинг.
class Router {
  constructor() { this.routes = []; }

  add(method, pattern, handler) {
    const paramNames = [];
    // /users/:id → ^/users/([^/]+)$
    const regex = new RegExp('^' + pattern.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    }) + '$');
    this.routes.push({ method, regex, paramNames, handler });
  }

  match(method, path) {
    for (const r of this.routes) {
      if (r.method !== method) continue;
      const m = path.match(r.regex);
      if (!m) continue;
      const params = Object.fromEntries(
        r.paramNames.map((name, i) => [name, m[i + 1]])
      );
      return { handler: r.handler, params };
    }
    return null;
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Регистрозависимость путей и trailing slash (`/users` vs `/users/`) — частый источник багов. В Express 5 trailing slash считается **разным** путём; в Fastify настраивается через `ignoreTrailingSlash`.',
        },
        {
          type: 'text',
          content:
            'Альтернатива линейному поиску — **словарь маршрутов**: для статических путей `Map<string, handler>` даёт `O(1)` lookup. Динамические сегменты по-прежнему обрабатываются перебором, но их обычно гораздо меньше:',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `class FastRouter {
  constructor() {
    this.staticRoutes = new Map(); // 'GET /users' → handler
    this.dynamicRoutes = [];       // [{ method, regex, paramNames, handler }]
  }

  add(method, pattern, handler) {
    if (!pattern.includes(':')) {
      this.staticRoutes.set(\`\${method} \${pattern}\`, handler);
      return;
    }
    // ... как раньше: regex + paramNames
  }

  match(method, path) {
    const exact = this.staticRoutes.get(\`\${method} \${path}\`);
    if (exact) return { handler: exact, params: {} };
    // fallback на динамические
    // ...
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'На вопрос «как ускорить роутинг» сильный кандидат отвечает не «O(N) → O(log N) через radix tree», а **разделить статические и динамические маршруты** — это даёт 80% выигрыша при 20% усилий.',
        },
      ],
      flashcardIds: [],
    },

    {
      id: 'cors',
      title: 'CORS на стороне сервера',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            '**CORS** (Cross-Origin Resource Sharing) — браузерный механизм, ограничивающий запросы со страницы одного origin к серверу другого origin. Это политика **браузера**, не сервера — curl и Node.js fetch не подвержены CORS. Сервер только **подсказывает** браузеру, какие origins ему разрешено принимать.',
        },
        {
          type: 'list',
          content: `Ключевые заголовки ответа сервера:
- **Access-Control-Allow-Origin** — какой origin разрешён. Можно \`*\` (любой) или конкретный домен.
- **Access-Control-Allow-Methods** — методы для preflight: \`GET, POST, PUT, DELETE\`.
- **Access-Control-Allow-Headers** — нестандартные заголовки запроса (\`Authorization\`, \`X-Custom-*\`).
- **Access-Control-Allow-Credentials** — разрешает отправку cookies. **Несовместимо с \`*\`** в Allow-Origin.
- **Access-Control-Max-Age** — сколько секунд браузер кэширует preflight.`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '«Простые» запросы (GET/POST с Content-Type: text/plain или application/x-www-form-urlencoded) идут **сразу**. «Сложные» (PUT/DELETE, Content-Type: application/json, кастомные заголовки) предваряются preflight-запросом OPTIONS, на который сервер обязан ответить с CORS-заголовками — иначе основной запрос даже не уйдёт.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// CORS-middleware вручную (без пакета cors)
function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  const allowed = ['https://app.example.com', 'http://localhost:5173'];

  if (allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  // Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 часа
    return res.status(204).end();
  }

  next();
}

app.use(corsMiddleware);`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            '`Access-Control-Allow-Origin: *` **не работает** с `credentials: "include"` на клиенте — браузер заблокирует запрос. Если нужны cookies — указывайте конкретный origin, не звёздочку. Это любимый вопрос с собеседований.',
        },
      ],
      flashcardIds: ['nodenw-f7'],
    },

    {
      id: 'security',
      title: 'Безопасность: rate limiting и helmet',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            '**Rate limiting** — ограничение количества запросов с одного источника (IP, userId, API-ключа) за период. Защищает от brute-force атак на login, scraping, DoS и просто от случайно написанного бесконечного цикла на клиенте.',
        },
        {
          type: 'list',
          content: `Алгоритмы rate limiting (от простого к точному):
- **Fixed window** — счётчик сбрасывается каждые N секунд. Просто, но допускает всплеск 2× на границе окна.
- **Sliding window log** — храним timestamp каждого запроса, считаем те, что попали в окно. Точно, но больше памяти.
- **Sliding window counter** — взвешенная комбинация двух fixed window. Компромисс точности и памяти.
- **Token bucket** — токены пополняются с фиксированной скоростью; запрос забирает токен. Допускает короткие burst-ы.
- **Leaky bucket** — очередь с фиксированным rate выхода. Сглаживает пики.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Sliding window log на чистых функциях (без http/express)
function createRateLimiter(limit, windowMs) {
  const requests = new Map(); // key → timestamps[]
  return function check(key) {
    const now = Date.now();
    const arr = (requests.get(key) ?? []).filter((t) => now - t < windowMs);
    if (arr.length >= limit) return false;
    arr.push(now);
    requests.set(key, arr);
    return true;
  };
}

// 5 запросов в минуту на пользователя
const limit = createRateLimiter(5, 60_000);
limit('user-1'); // true
// ...пять раз...
limit('user-1'); // false → сервер отвечает 429 Too Many Requests`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'In-memory rate limiter работает только в **single-instance** сервере. Для кластера или нескольких подов в Kubernetes нужно общее хранилище — обычно Redis (`INCR` + `EXPIRE` или `redis-rate-limiter`).',
        },
        {
          type: 'text',
          content:
            '**Helmet** — пакет, который устанавливает 15+ HTTP-заголовков безопасности одной строкой. Без них в default Express-приложении дыры есть просто из-за их отсутствия:',
        },
        {
          type: 'list',
          content: `Что добавляет helmet:
- **Content-Security-Policy** — какие источники скриптов/стилей разрешены (защита от XSS).
- **Strict-Transport-Security (HSTS)** — заставляет браузер использовать только HTTPS.
- **X-Frame-Options: DENY** — запрет встраивания в iframe (защита от clickjacking).
- **X-Content-Type-Options: nosniff** — браузер не «угадывает» MIME-тип.
- **Referrer-Policy** — какой Referer отправлять при переходе.
- Удаляет \`X-Powered-By: Express\` — не выдаём фреймворк атакующему.`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'На собеседовании про безопасность принято спрашивать минимум: «как защитить login от brute-force» (rate limit + блокировка после N попыток + капча) и «зачем нужен helmet» (одной строкой включает best-practice заголовки).',
        },
      ],
      flashcardIds: ['nodenw-f5', 'nodenw-f8'],
      checkpoint: [Q['nodenet-q6']!],
    },

    {
      id: 'protocols',
      title: 'HTTP/1.1, HTTP/2 и Keep-Alive',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Чтобы HTTP-сервер был быстрым, важно понимать, **что происходит на уровне TCP**. Каждое новое TCP-соединение — это 3-way handshake (3 RTT), плюс TLS-handshake (ещё 1-2 RTT для HTTPS). На latency 50 мс это уже 200-250 мс до того, как клиент отправит первый байт запроса.',
        },
        {
          type: 'text',
          content:
            '**Keep-Alive** (HTTP/1.1, по умолчанию) — после ответа TCP-соединение остаётся открытым, и следующий запрос идёт по нему же без handshake. Это в разы ускоряет загрузку страниц с десятками ассетов.',
        },
        {
          type: 'list',
          content: `Что нужно знать про keep-alive:
- В HTTP/1.1 включён по умолчанию через заголовок \`Connection: keep-alive\`.
- В Node.js для **исходящих** запросов нужно создать \`new http.Agent({ keepAlive: true })\` — без этого fetch/http.request открывает новое соединение каждый раз.
- На сервере: \`server.keepAliveTimeout\` (по умолчанию 5 секунд) — сколько держать соединение после последнего ответа.
- Ограничение HTTP/1.1: запросы по соединению идут **последовательно** (head-of-line blocking).`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Исходящие запросы с keep-alive (Node.js):
const http = require('http');
const agent = new http.Agent({ keepAlive: true, maxSockets: 50 });

http.get('http://api.example.com/data', { agent }, (res) => {
  // ...
});
// Все следующие запросы через тот же agent переиспользуют соединение`,
        },
        {
          type: 'list',
          content: `**HTTP/2** решает head-of-line blocking на уровне приложения:
- **Мультиплексирование**: много запросов параллельно по одному TCP-соединению.
- **Бинарный протокол**: парсится быстрее текстового.
- **Сжатие заголовков (HPACK)**: меньше overhead на запрос.
- **Server Push** (на практике почти не используется — заменён preload).

**HTTP/3** идёт ещё дальше: переходит с TCP на QUIC (поверх UDP), убирая head-of-line blocking уже на транспортном уровне.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'В production HTTP/2 чаще всего терминируется на NGINX/балансировщике, а Node.js-сервера говорят с балансировщиком по HTTP/1.1 keep-alive. Это работает быстрее, чем «честный» HTTP/2 в Node.js, и проще настраивается.',
        },
      ],
      flashcardIds: ['nodenw-f4', 'nodenw-f9'],
      checkpoint: [Q['nodenet-q9']!],
    },
  ],

  // Все вопросы из старого квиза, кроме тех, что ушли в checkpoint.
  finalQuiz: nodeNetworkQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  // Реюзаем существующие карточки и добавляем новые.
  flashcards: [...nodeNetworkFlashcards.cards, ...extraFlashcards],

  cheatsheet: `### Шпаргалка по Node.js Network

- **Минимальный сервер**: \`http.createServer((req, res) => ...).listen(port)\`. \`req\` — Readable stream, \`res\` — Writable.
- **Middleware** = функция \`(req, res, next)\`. Выполняются **в порядке регистрации**. Не вызвал \`next()\` — запрос завис.
- **Error-handler** определяется по **4 аргументам**: \`(err, req, res, next)\`. Регистрируется последним.
- **Роутер**: путь → regex с захватом \`:param\`. Статические маршруты быстрее через Map. Fastify использует radix tree.
- **CORS**: \`Access-Control-Allow-Origin\` указывает разрешённые origin-ы. Preflight = OPTIONS-запрос перед «сложными» запросами. \`*\` несовместим с credentials.
- **Rate limit** = серверная защита, 429 при превышении. Алгоритмы: fixed/sliding window, token/leaky bucket. В кластере — Redis.
- **Throttling** ≠ rate limit: throttling — клиентское/функциональное сглаживание частоты вызовов, без отказов.
- **Helmet**: одна строка → 15+ security-заголовков (CSP, HSTS, X-Frame-Options).
- **Keep-Alive**: переиспользует TCP-соединение → нет нового handshake. В HTTP/1.1 default. \`new http.Agent({ keepAlive: true })\` для исходящих.
- **HTTP/2**: мультиплексирование, бинарь, HPACK. На практике терминируется на NGINX.`,

  interviewQA: [
    {
      id: 'nodenw-iq1',
      question: 'Опишите минимальный HTTP-сервер на модуле http без Express.',
      shortAnswer:
        'Импортируем http, вызываем http.createServer((req, res) => ...) и server.listen(port). Внутри callback читаем req.method и req.url, для тела POST — слушаем data/end на req. Отвечаем через res.writeHead(status, headers) и res.end(body).',
      fullAnswer: `Минимальный сервер — десять строк:

\`\`\`js
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('OK');
  }
  res.writeHead(404);
  res.end('Not Found');
});

server.listen(3000);
\`\`\`

Что важно объяснить интервьюеру:

- \`http.createServer\` возвращает \`Server\`, унаследованный от EventEmitter. Каждый запрос — событие \`request\` с парой \`(req, res)\`.
- \`req\` — это **IncomingMessage**, Readable stream. Тело POST/PUT-запроса не приходит сразу — его нужно собирать через \`req.on('data', chunk => ...)\` и \`req.on('end', () => ...)\`.
- \`res\` — это **ServerResponse**, Writable stream. \`res.writeHead\` обязателен **до** \`res.end\` или \`res.write\`. После любой записи заголовки уже отправлены и изменить их нельзя.
- Если забыть \`res.end()\`, клиент будет ждать ответ до серверного timeout.
- В этом коде нет роутинга, парсинга JSON, CORS, обработки ошибок — Express, Fastify и Koa добавляют эти слои поверх \`http.createServer\`.`,
      followUps: [
        'Как обработать большое тело POST-запроса с лимитом размера?',
        'Что произойдёт, если в callback бросить исключение?',
      ],
      relatedChapterId: 'http-server',
    },
    {
      id: 'nodenw-iq2',
      question: 'Что такое middleware и в каком порядке они выполняются?',
      shortAnswer:
        'Middleware — функция (req, res, next), которая получает запрос и решает: обработать, передать дальше через next() или прервать цепочку, отправив ответ. Express выполняет их строго в порядке регистрации через app.use/app.get. Error-handler с 4 аргументами вызывается, когда middleware вызовет next(err) или бросит исключение.',
      fullAnswer: `**Middleware** — это функция вида \`(req, res, next) => ...\`. Express хранит зарегистрированные middleware в массиве и обходит его по порядку. Каждый middleware либо отправляет ответ (\`res.json(...)\`, \`res.end(...)\`), либо передаёт управление следующему через \`next()\`, либо передаёт ошибку через \`next(err)\`.

Порядок выполнения:

1. **Глобальные middleware** регистрируются через \`app.use(fn)\` без пути или с префиксом — выполняются первыми.
2. **Роуто-специфичные** через \`app.get('/path', mw1, mw2, handler)\` — после глобальных, **только** для совпавшего роута.
3. **Error-handler** \`(err, req, res, next)\` регистрируется в конце. Express определяет его **по числу аргументов** — четыре. С тремя — обычный middleware.

Типичный порядок в production-приложении:

\`\`\`js
app.use(helmet());           // безопасные заголовки
app.use(cors());             // CORS
app.use(express.json());     // парсинг тела
app.use(rateLimiter);        // rate limit
app.use(authenticate);       // jwt/session
app.use('/api', apiRouter);  // роуты
app.use(errorHandler);       // ошибки — последним
\`\`\`

Распространённые баги:
- **Забыл \`next()\`** в middleware, который не отправляет ответ — запрос виснет до timeout.
- **Зарегистрировал error-handler перед роутами** — он не сработает.
- **\`res.json\` после \`next()\`** — ошибка \`Cannot set headers after they are sent\`.`,
      followUps: [
        'Как реализовать middleware-pipeline вручную?',
        'Чем отличается app.use от app.get?',
      ],
      relatedChapterId: 'middleware',
    },
    {
      id: 'nodenw-iq3',
      question: 'Как настроить CORS на сервере? Чем отличаются простые и preflight запросы?',
      shortAnswer:
        'CORS — это политика браузера, сервер только подсказывает заголовками Access-Control-Allow-* какие origin-ы разрешены. Простые запросы (GET/POST с safe Content-Type) идут сразу. Сложные (PUT/DELETE, application/json, кастомные headers) предваряются preflight-запросом OPTIONS, на который сервер должен ответить с CORS-заголовками — иначе браузер не отправит основной запрос.',
      fullAnswer: `**CORS** (Cross-Origin Resource Sharing) — это политика **браузера**, не сервера. curl, Postman, Node.js-fetch CORS не проверяют. Сервер выдаёт заголовки, а решение «пускать или нет» принимает браузер.

**Простые запросы** идут к серверу сразу. Условия: метод GET/HEAD/POST, Content-Type из набора \`text/plain\`, \`application/x-www-form-urlencoded\`, \`multipart/form-data\`, без кастомных заголовков. Сервер отвечает на запрос; браузер смотрит \`Access-Control-Allow-Origin\` в ответе и либо отдаёт данные JS-коду, либо нет.

**Сложные запросы** (PUT/DELETE, \`application/json\`, кастомные заголовки вроде \`Authorization\`) предваряются **preflight**: браузер шлёт OPTIONS-запрос с заголовками \`Access-Control-Request-Method\` и \`Access-Control-Request-Headers\`. Сервер должен ответить:

\`\`\`
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
\`\`\`

Если ответа нет или заголовки не подходят — браузер блокирует основной запрос.

Ключевые правила:
- \`Access-Control-Allow-Origin: *\` **несовместим** с \`Access-Control-Allow-Credentials: true\`. Если нужны cookies — указывайте конкретный origin.
- Preflight кэшируется на \`Access-Control-Max-Age\` секунд (обычно 24 часа).
- Для production используйте пакет \`cors\` или middleware-функцию, которая проверяет origin по whitelist.

Распространённая ошибка: настроили CORS на API, но забыли — на статике/CDN. Картинки/шрифты не грузятся, потому что у них нет CORS-заголовков.`,
      followUps: [
        'Что произойдёт, если сервер вернёт 200 на preflight, но забудет Access-Control-Allow-Headers?',
        'Почему credentials: "include" не работает с Allow-Origin: *?',
      ],
      relatedChapterId: 'cors',
    },
    {
      id: 'nodenw-iq4',
      question: 'В чём разница между rate limiting и throttling?',
      shortAnswer:
        'Rate limiting — серверная защита, ограничение количества запросов от клиента за период (например, 100 RPS), при превышении возвращает 429. Throttling — клиентское или внутрифункциональное сглаживание частоты вызовов (вызвать функцию не чаще 1 раза в N мс), не отказывает в обслуживании.',
      fullAnswer: `Это два разных механизма с похожими названиями.

**Rate limiting** — ограничение **на сервере**: «не больше N запросов от одного клиента за окно». Превышение возвращает HTTP 429 Too Many Requests с заголовком \`Retry-After\`. Применяется для:
- защиты от brute-force атак на login (5 попыток в минуту);
- защиты от DoS и scraping;
- управления квотами в публичных API (1000 запросов в час на ключ).

Реализация — алгоритмы: fixed window, sliding window, token bucket, leaky bucket. В single-instance сервере хватает in-memory Map. В кластере или Kubernetes-deployment с N подами нужно общее хранилище — обычно Redis с \`INCR + EXPIRE\` или \`redis-rate-limiter\`.

**Throttling** — сглаживание частоты вызовов **на клиенте или внутри функции**. Например, обработчик \`scroll\` или \`resize\` запускается тысячи раз в секунду — throttle ограничивает его до одного вызова в 100 мс. Throttling не отказывает: лишние вызовы либо игнорируются, либо буферизуются.

\`\`\`js
function throttle(fn, ms) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last < ms) return;
    last = now;
    fn(...args);
  };
}
\`\`\`

Ключевая разница в **семантике отказа**: rate limit возвращает ошибку клиенту («ты прислал слишком много»), throttle тихо игнорирует или откладывает.

В одном приложении они часто работают вместе: клиент throttle-ит UI-события (поиск-инпут, подгрузка данных при скролле), сервер rate-limit-ит API. И ещё одно близкое понятие — **debounce**: вызвать функцию через N мс после **последнего** вызова. Throttle — гарантирует частоту, debounce — задержку до тишины.`,
      followUps: [
        'Как реализовать distributed rate limit в Kubernetes-кластере?',
        'Чем token bucket отличается от leaky bucket?',
      ],
      relatedChapterId: 'security',
    },
    {
      id: 'nodenw-iq5',
      question: 'Что такое HTTP Keep-Alive и зачем он нужен?',
      shortAnswer:
        'Keep-Alive — механизм HTTP/1.1, переиспользующий одно TCP-соединение для нескольких запросов. Экономит TCP-handshake (3 RTT) и TLS-handshake (1-2 RTT) на каждом последующем запросе. Включён по умолчанию в HTTP/1.1; для исходящих запросов в Node.js нужно создать http.Agent с keepAlive: true.',
      fullAnswer: `Каждое новое TCP-соединение начинается с **3-way handshake**: SYN → SYN-ACK → ACK. На latency 50 мс это уже 150 мс **до** отправки запроса. Для HTTPS добавляется TLS handshake (ещё 1-2 RTT). На страницу с 50 ассетами без keep-alive это десятки секунд лишнего ожидания.

**Keep-Alive** решает это: после ответа TCP-соединение **остаётся открытым** на N секунд. Следующий запрос уходит по нему же без handshake. Включён по умолчанию в HTTP/1.1 заголовком \`Connection: keep-alive\` (в HTTP/1.0 нужно явно).

Что важно знать на собеседовании:

- **На сервере** в Node.js: \`server.keepAliveTimeout\` (по умолчанию 5 секунд) — сколько держать соединение после последнего ответа. \`server.headersTimeout\` должен быть **больше** keepAliveTimeout, иначе возможны race conditions с балансировщиком.
- **Для исходящих запросов** Node.js по умолчанию **не** использует keep-alive. Нужно создать агент:
  \`\`\`js
  const agent = new http.Agent({ keepAlive: true, maxSockets: 50 });
  http.get(url, { agent }, ...);
  \`\`\`
  Без этого каждый \`fetch\` или \`http.request\` открывает новое соединение, и под нагрузкой сервер захлёбывается в TIME_WAIT.
- **Ограничение HTTP/1.1**: запросы по соединению идут **последовательно** (head-of-line blocking). Если первый ответ медленный — следующие ждут. Браузеры открывают 6 соединений на домен, чтобы обойти это.
- **HTTP/2** идёт дальше: одно соединение + мультиплексирование запросов, head-of-line blocking исчезает на уровне приложения.

Типичный production-сетап: NGINX между клиентом и Node.js говорит с клиентом по HTTP/2, а с Node.js — по HTTP/1.1 keep-alive. Это работает быстрее, чем «честный» HTTP/2 в Node.js, и проще настраивается.`,
      followUps: [
        'Как заметить утечку соединений в production-сервере?',
        'Что такое TIME_WAIT и почему его много при отключённом keep-alive?',
      ],
      relatedChapterId: 'protocols',
    },
    {
      id: 'nodenw-iq6',
      question: 'Зачем нужен helmet в Express-приложении?',
      shortAnswer:
        'Helmet — пакет, который одной строкой устанавливает 15+ HTTP-заголовков безопасности: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy и другие. Без них Express по умолчанию даёт «дырявый» сервер с дефолтными заголовками браузеров.',
      fullAnswer: `\`helmet\` — это набор маленьких middleware, которые ставят заголовки безопасности. По умолчанию Express ничего из этого не делает.

Что устанавливает helmet:

- **Content-Security-Policy (CSP)** — какие источники скриптов, стилей, картинок разрешены. Ключевая защита от XSS: даже если злоумышленник внедрит \`<script src="evil.com">\`, браузер откажется его загружать.
- **Strict-Transport-Security (HSTS)** — заставляет браузер использовать только HTTPS на определённый период. Защищает от downgrade-атак.
- **X-Frame-Options: DENY** — запрещает встраивание страницы в iframe. Защита от clickjacking.
- **X-Content-Type-Options: nosniff** — браузер не «угадывает» MIME-тип. Защита от MIME-sniffing атак.
- **Referrer-Policy** — какой Referer отправлять при переходе. По умолчанию helmet ставит \`no-referrer\`.
- Удаляет \`X-Powered-By: Express\` — не выдаём фреймворк атакующему (он в первую очередь будет искать exploit-ы для известных версий).

Использование:

\`\`\`js
const helmet = require('helmet');
app.use(helmet());
\`\`\`

На API-сервере (без HTML) обычно настраивают CSP отдельно, потому что дефолтные ограничения слишком строгие для интерактивных приложений. Хороший подход — \`helmet({ contentSecurityPolicy: false })\` плюс отдельный CSP с конкретными источниками.

helmet — must-have в production. Без него вы автоматически получаете низкие оценки в security-сканерах вроде Mozilla Observatory или securityheaders.com.`,
      followUps: [
        'Как настроить CSP, чтобы разрешить inline-стили только для определённых компонентов?',
        'Чем X-Frame-Options отличается от CSP frame-ancestors?',
      ],
      relatedChapterId: 'security',
    },
    {
      id: 'nodenw-iq7',
      question: 'Как реализовать минимальный роутер с поддержкой :param?',
      shortAnswer:
        'Храним массив { method, regex, paramNames, handler }. При регистрации /users/:id строим regex /^\\/users\\/([^/]+)$/ и paramNames=[\'id\']. При match итерируем массив, проверяем method и regex.test(path), извлекаем params через захватывающие группы. Для оптимизации статические маршруты выносим в Map для O(1) lookup.',
      fullAnswer: `Базовая идея роутера — сопоставить пару \`(method, path)\` с обработчиком. Простейшая реализация — массив маршрутов с regex-паттернами:

\`\`\`js
class Router {
  constructor() { this.routes = []; }

  add(method, pattern, handler) {
    const paramNames = [];
    const regex = new RegExp('^' + pattern.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    }) + '$');
    this.routes.push({ method, regex, paramNames, handler });
  }

  match(method, path) {
    for (const r of this.routes) {
      if (r.method !== method) continue;
      const m = path.match(r.regex);
      if (!m) continue;
      const params = Object.fromEntries(
        r.paramNames.map((name, i) => [name, m[i + 1]])
      );
      return { handler: r.handler, params };
    }
    return null;
  }
}
\`\`\`

Сложность матчинга — \`O(N)\` по числу зарегистрированных маршрутов. Для типичного API с десятками роутов это не проблема.

**Оптимизации, о которых стоит знать:**

1. **Map для статических маршрутов**: \`/users\`, \`/health\` без \`:param\` хранятся в \`Map<\`\${method} \${path}\`, handler>\` с \`O(1)\` lookup. Динамические остаются в массиве.

2. **Radix tree** (Fastify, Express 5): дерево, где каждый узел — общий префикс. Матчинг \`O(длина пути)\`, не зависит от числа маршрутов. Сильно выигрывает на сотнях маршрутов.

3. **Trie со wildcard**: похож на radix tree, но с поддержкой \`*\` и \`:param\` как специальных узлов.

В Express 4 — линейный поиск по массиву. В Fastify — radix tree. Для собеседования достаточно базовой реализации с regex; знание про radix tree — бонус.

Подводные камни:
- Регистр и trailing slash (\`/users\` vs \`/Users/\`) — нужно решить, нормализовать ли путь.
- Конфликт маршрутов: \`/users/:id\` и \`/users/me\` — обычно более специфичный регистрируется первым.
- Wildcard-сегменты \`*\` и опциональные \`:id?\` — расширения базовой схемы.`,
      followUps: [
        'Как разрешить конфликт между /users/:id и /users/me?',
        'Чем radix tree выигрывает у linear search в Fastify?',
      ],
      relatedChapterId: 'routing',
    },
  ],

  nextTopics: [
    { slug: 'node-streams', reason: 'req/res в Node.js — это стримы. Backpressure, pipe и обработка больших файлов невозможны без понимания streams.' },
    { slug: 'node-optimization', reason: 'После того как сервер работает корректно, следующий шаг — производительность: profiling, кэширование, кластеризация.' },
  ],

  related: [
    { kind: 'pattern', id: 'middleware-pipeline', label: 'Паттерн middleware-pipeline: Express, Koa, Redux' },
    { kind: 'pitfall', id: 'cors-credentials', label: 'CORS-ловушка: Allow-Origin * + credentials не работает' },
  ],
};
