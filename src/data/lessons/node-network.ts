import type { Lesson } from '../../types/lesson';
import { nodeNetworkQuiz } from '../quizzes/node-network';

const Q = Object.fromEntries(nodeNetworkQuiz.questions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set(['nodenet-q2', 'nodenet-q3', 'nodenet-q6', 'nodenet-q9']);

export const nodeNetworkLesson: Lesson = {
  topicId: 'node-network',

  intro: {
    whyItMatters: `Node.js используется преимущественно для сетевых сервисов: REST API, backend for frontend, gateway, прокси. Знание модели запрос — ответ, middleware, маршрутизации, обработки ошибок, CORS, rate limiting, а также клиентского слоя (\`http.Agent\`, \`fetch\`, \`undici\`) и корректного graceful shutdown — необходимый минимум для серверной разработки.

На собеседовании проверяют устройство HTTP-сервера на стандартном модуле \`http\`, middleware-pipeline в Express, обработку ошибок и защиту от типовых атак (CORS, CSRF, NoSQL-инъекции, brute-force), а также понимание HTTP/2, WebSocket, SSE и приёмы переиспользования соединений на клиенте.`,
    estimatedMinutes: 30,
    interviewAngle:
      'Ключевые темы: внутреннее устройство сервера на \`node:http\` (поверх \`net.Server\`); middleware и порядок выполнения; CORS на сервере; rate limiting и общая безопасность; протоколы HTTP/2, WebSocket, SSE; клиентский слой \`http.Agent\` с keep-alive, undici/fetch; DNS и таймауты; graceful shutdown по SIGTERM.',
    prerequisites: [{ slug: 'node-event-loop', title: 'Event loop в Node.js' }],
  },

  chapters: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'http-server',
      title: 'HTTP-сервер на чистом Node.js',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Стандартный модуль \`node:http\` позволяет поднять сервер без зависимостей. \`http.createServer\` возвращает экземпляр класса \`http.Server\`, унаследованный от \`net.Server\` из модуля \`node:net\` — то есть HTTP в Node.js построен поверх обычного TCP-сервера. Знакомство со стандартным модулем помогает понять внутреннее устройство Express и Fastify — оба построены на нём.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const http = require('node:http');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  res.writeHead(404);
  res.end('Not Found');
});

server.listen(3000, () => console.log('listening on 3000'));`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Объекты \`req\` и \`res\` — это стримы. \`req\` — Readable, \`res\` — Writable. Большие тела запросов читаются через \`for await\` или \`req.pipe(dest)\`. Большие ответы тоже стримятся — это удобно для отдачи файлов и проксирования.',
        },
        { type: 'heading', content: 'Чтение тела запроса' },
        {
          type: 'code',
          language: 'javascript',
          content: `async function readBody(req, limit = 1024 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new Error('Body too large');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Чтение тела без лимита размера — типичный вектор DoS. Если клиент отправит запрос со сколь угодно большим телом, процесс израсходует всю память. В \`express.json({ limit: \'1mb\' })\` лимит задаётся явно; при чтении вручную нужно проверять размер.',
        },
        { type: 'heading', content: 'Таймауты сервера' },
        {
          type: 'text',
          content:
            'У \`http.Server\` несколько свойств таймаутов: \`headersTimeout\` — сколько ждать поступления заголовков (защита от Slowloris); \`requestTimeout\` — общий таймаут запроса; \`keepAliveTimeout\` — сколько держать соединение в keep-alive после ответа. Значения по умолчанию изменились в Node 18, поэтому при работе за reverse-proxy их часто настраивают согласованно с upstream.',
        },
      ],
      checkpoint: [Q['nodenet-q3']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'middleware',
      title: 'Middleware и порядок выполнения',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Middleware — функция \`(req, res, next)\`, которая вызывается на каждый запрос до основного обработчика. Модель \`(req, res, next)\` лежит в основе Express и большинства Node.js-фреймворков. Middleware могут читать и менять \`req\` и \`res\`, выполнять логирование, аутентификацию, парсинг тела, обрабатывать ошибки.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const express = require('express');
const app = express();

// Логирование на каждый запрос
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Парсинг JSON-тела с явным лимитом
app.use(express.json({ limit: '1mb' }));

// Аутентификация
app.use((req, res, next) => {
  const token = req.headers.authorization;
  if (!verifyToken(token)) return res.status(401).end();
  req.user = decodeUser(token);
  next();
});

// Основной обработчик
app.get('/api/me', (req, res) => res.json(req.user));

// Обработчик ошибок (4 аргумента) — всегда последний
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'internal' });
});`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Express определяет middleware-обработчик ошибок по количеству аргументов: четыре параметра \`(err, req, res, next)\`. Если из обычного middleware не передать ошибку через \`next(err)\`, обработчик ошибок не вызовется и запрос не завершится — клиент получит таймаут.',
        },
        { type: 'heading', content: 'Порядок имеет значение' },
        {
          type: 'list',
          content: `Helmet и логирование — в самом начале, чтобы security-заголовки и записи покрывали все запросы.
CORS — до маршрутов и аутентификации, иначе preflight попадёт в auth-middleware.
Rate limiting — после CORS, обычно отдельно для чувствительных эндпойнтов (\`/login\`, \`/register\`).
Парсинг тела — до маршрутов, чтобы \`req.body\` был доступен.
Аутентификация — после публичных эндпойнтов или с явной проверкой пути.
Маршруты — основная бизнес-логика.
Обработчик ошибок — последний.`,
        },
      ],
      checkpoint: [Q['nodenet-q2']!, Q['nodenet-q9']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'routing',
      title: 'Маршрутизация',
      estimatedMinutes: 4,
      blocks: [
        {
          type: 'text',
          content:
            'Маршрутизация сопоставляет URL и метод с обработчиком. В Express используется набор зарегистрированных шаблонов, в Fastify — radix-tree (структура данных для быстрого поиска по префиксам строк), Hono и Koa-router предлагают близкий синтаксис.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Express
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  res.json({ id });
});

app.post('/users', (req, res) => {
  const user = createUser(req.body);
  res.status(201).json(user);
});

// Группировка маршрутов
const router = express.Router();
router.get('/', listPosts);
router.get('/:id', getPost);
router.post('/', createPost);
app.use('/api/posts', router);`,
        },
        { type: 'heading', content: 'Валидация на входе' },
        {
          type: 'text',
          content:
            'Перед бизнес-логикой выполняется проверка тела запроса. Стандартный подход — схема валидации (zod, joi, ajv). Это позволяет отвечать 400 с понятной ошибкой и одновременно защищает от инъекций.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { z } = require('zod');

const CreateUserSchema = z.object({
  name: z.string().min(1).max(64),
  email: z.string().email(),
  age: z.number().int().min(0).optional(),
});

app.post('/users', (req, res) => {
  const result = CreateUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const user = createUser(result.data);
  res.status(201).json(user);
});`,
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'cors',
      title: 'CORS на сервере',
      estimatedMinutes: 4,
      blocks: [
        {
          type: 'text',
          content:
            'Если фронтенд и API живут на разных origin, браузер применяет CORS. Сервер должен возвращать заголовки \`Access-Control-Allow-*\`. В Express для этого используется middleware \`cors\`, но понимание модели необходимо: неполная конфигурация приводит к ошибкам в обработке preflight или credentials.',
        },
        {
          type: 'text',
          content:
            'Preflight — это автоматический \`OPTIONS\`-запрос, который браузер отправляет перед нестандартными запросами (нестандартный метод, \`Content-Type: application/json\`, кастомные заголовки). Сервер должен ответить заголовками \`Access-Control-Allow-Origin\`, \`Access-Control-Allow-Methods\`, \`Access-Control-Allow-Headers\`; их кеширование задаётся \`Access-Control-Max-Age\`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const cors = require('cors');

app.use(cors({
  origin: ['https://app.example.com', 'https://admin.example.com'],
  credentials: true,                // отправлять cookies в cross-origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600,                      // кеш preflight на 10 минут
}));`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '\`origin: "*"\` несовместим с \`credentials: true\`. Если cookies или \`Authorization\`-заголовок отправляются, в \`origin\` должен возвращаться конкретный домен. Иначе браузер заблокирует ответ.',
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Middleware \`cors\` обрабатывает preflight автоматически, но только если зарегистрирован до маршрутов. При работе за reverse-proxy не забывайте включить \`app.set(\'trust proxy\', true)\` — иначе \`req.ip\` будет содержать адрес прокси, а не клиента, что ломает rate limiting.',
        },
      ],
      checkpoint: [Q['nodenet-q6']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'security',
      title: 'Rate limiting и базовая безопасность',
      estimatedMinutes: 5,
      blocks: [
        { type: 'heading', content: 'Rate limiting' },
        {
          type: 'text',
          content:
            'Без ограничения частоты запросов любой эндпойнт уязвим к brute-force и DDoS. Простое in-memory ограничение работает для одного инстанса. Для нескольких реплик нужен распределённый счётчик в Redis.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const rateLimit = require('express-rate-limit');

app.use('/api/login', rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 минут
  max: 5,                     // не более 5 попыток
  message: 'Слишком много попыток входа, попробуйте позже',
  standardHeaders: true,       // возвращать RateLimit-* заголовки
}));`,
        },
        { type: 'heading', content: 'Helmet и заголовки безопасности' },
        {
          type: 'text',
          content:
            '\`helmet\` — middleware, добавляющий набор security-заголовков: \`Content-Security-Policy\`, \`X-Content-Type-Options\`, \`Strict-Transport-Security\`, \`X-Frame-Options\`. Базовая защита от XSS, clickjacking, MIME-sniffing.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://cdn.example.com'],
    },
  },
}));`,
        },
        { type: 'heading', content: 'Базовая защита' },
        {
          type: 'list',
          content: `Валидация всех входных полей выполняется через схему (zod, joi, ajv).
NoSQL и SQL инъекции предотвращаются параметризованными запросами и проверкой типов.
XSS закрывается экранированием вывода в HTML и заголовком \`Content-Security-Policy\`.
CSRF снижается атрибутом \`SameSite=Lax\` (или \`Strict\` для критичных операций) и явным CSRF-токеном в формах.
В логи не записываются \`Authorization\`-заголовки, токены и пароли.
В продакшене используется HTTPS, \`Strict-Transport-Security\` принуждает браузер использовать HTTPS при последующих запросах.`,
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'protocols',
      title: 'HTTP/2, WebSocket, SSE',
      estimatedMinutes: 4,
      blocks: [
        { type: 'heading', content: 'HTTP/2' },
        {
          type: 'text',
          content:
            'HTTP/2 поддерживает мультиплексирование: множество запросов параллельно идут в одном TCP-соединении, что снижает накладные расходы на handshake и убирает head-of-line blocking уровня HTTP. В Node.js поддержка реализована в модуле \`node:http2\` через \`http2.createSecureServer\`; в production HTTP/2 чаще терминируется на reverse-proxy (nginx, Cloudflare) — это удобнее для TLS, метрик и операций, а сам Node принимает HTTP/1.1. HTTP/3 (поверх QUIC) пока экспериментален в Node; в проде доступен в основном через прокси.',
        },
        { type: 'heading', content: 'WebSocket' },
        {
          type: 'text',
          content:
            'WebSocket — полнодуплексный канал поверх TCP, устанавливаемый через HTTP Upgrade (RFC 6455). Подходит для чата, realtime-обновлений, многопользовательских игр. В Node популярны библиотеки \`ws\` (низкоуровневая) и \`socket.io\` (с автореконнектом, room-ами, fallback на long-polling).',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    ws.send('echo: ' + data);
  });
});`,
        },
        { type: 'heading', content: 'Server-Sent Events (SSE)' },
        {
          type: 'text',
          content:
            'SSE — однонаправленный поток сервер → клиент. Реализуется как обычный HTTP-ответ с \`Content-Type: text/event-stream\`. Браузер автоматически переподключается при разрывах. Подходит для уведомлений, прогресс-баров, мониторинга.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `app.get('/events', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  const timer = setInterval(() => {
    res.write(\`data: \${JSON.stringify({ time: Date.now() })}\\n\\n\`);
  }, 1000);
  req.on('close', () => clearInterval(timer));
});`,
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'http-client',
      title: 'HTTP-клиент: fetch, undici, http.Agent',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Node.js используется не только как сервер, но и как клиент: проксирование запросов, обращение к внешним API, межсервисные вызовы. С версии 18 встроенный \`fetch\` доступен глобально; под капотом он работает на библиотеке \`undici\` — современной реализации HTTP/1.1 поверх \`node:net\`.',
        },
        { type: 'heading', content: 'fetch в Node.js' },
        {
          type: 'code',
          language: 'javascript',
          content: `const res = await fetch('https://api.example.com/users/1', {
  headers: { Accept: 'application/json' },
  signal: AbortSignal.timeout(5000),
});
if (!res.ok) throw new Error('HTTP ' + res.status);
const user = await res.json();`,
        },
        { type: 'heading', content: 'http.Agent и keep-alive' },
        {
          type: 'text',
          content:
            'Каждый \`fetch\` или \`http.request\` без явного агента открывает новое TCP-соединение и закрывает его после ответа. При интенсивных вызовах одного и того же API это создаёт сотни ненужных handshake. \`http.Agent\` с \`keepAlive: true\` переиспользует соединения и держит их в пуле до \`keepAliveTimeout\`. У глобального fetch это настраивается через объект \`undici.Agent\` (или пул \`undici.Pool\` для одного хоста).',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const http = require('node:http');

const agent = new http.Agent({
  keepAlive: true,
  maxSockets: 100,      // не более 100 одновременных соединений
  maxFreeSockets: 10,   // и не более 10 «свободных» в пуле
  keepAliveMsecs: 1000, // частота TCP keepalive-проб
});

http.request({ host: 'api.example.com', path: '/users', agent });

// Для глобального fetch (через undici)
const { Agent, setGlobalDispatcher } = require('undici');
setGlobalDispatcher(new Agent({ keepAliveTimeout: 30_000, connections: 100 }));`,
        },
        { type: 'heading', content: 'DNS и thread pool' },
        {
          type: 'text',
          content:
            'По умолчанию HTTP-клиент Node резолвит DNS через \`dns.lookup\`, который использует системный \`getaddrinfo\` и работает в libuv thread pool (размером 4 потока по умолчанию). При высоком количестве уникальных хостов этот пул становится узким местом. Альтернативы: \`dns.resolve\` через c-ares (не использует thread pool, но требует ручного управления кешем) и собственный lookup в Agent с кешированием.',
        },
        { type: 'heading', content: 'Типичные ошибки сокетов' },
        {
          type: 'list',
          content: `\`ECONNRESET\` — соединение разорвано удалённой стороной. Часто возникает, когда upstream закрыл keep-alive по таймауту раньше клиента.
\`ETIMEDOUT\` — TCP-таймаут. Управляется \`socket.setTimeout\` и опциями Agent.
\`EAI_AGAIN\` — временная ошибка DNS. Обычно обрабатывается retry с backoff.
\`EPIPE\` — попытка записи в уже закрытый сокет.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'На клиенте всегда задаётся таймаут (\`AbortSignal.timeout\` или \`request.setTimeout\`) и retry-стратегия с экспоненциальной задержкой — без них единственный «висящий» upstream способен исчерпать пул сокетов и заблокировать весь сервис.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'graceful-shutdown',
      title: 'Graceful shutdown и trust proxy',
      estimatedMinutes: 4,
      blocks: [
        {
          type: 'text',
          content:
            'В контейнерных средах оркестратор отправляет приложению \`SIGTERM\` перед остановкой; через grace-период следует \`SIGKILL\`. Корректное поведение — прекратить принимать новые соединения, дать текущим запросам завершиться, закрыть БД и очереди, и только после этого завершить процесс. Без \`server.close()\` соединения обрываются, текущие запросы получают \`ECONNRESET\`, а пользователи — 502 от балансировщика.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const server = app.listen(port);

function shutdown(signal) {
  console.log(\`Received \${signal}, shutting down...\`);
  server.close(async () => {
    await db.close();
    await queue.disconnect();
    process.exit(0);
  });
  // Принудительный выход, если соединения зависли
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Keep-alive соединения мешают \`server.close()\` завершиться: TCP-сокеты остаются открытыми и метод не вызовет коллбэк, пока все клиенты не закроют соединения. Решение — на \`SIGTERM\` явно отправлять заголовок \`Connection: close\` в новых ответах и/или вызывать \`server.closeAllConnections()\` (Node 18.2+) после некоторого таймаута.',
        },
        {
          type: 'text',
          content:
            'Когда сервер работает за reverse-proxy, балансировщиком или CDN, в заголовках приходят \`X-Forwarded-For\`, \`X-Forwarded-Proto\`, \`X-Forwarded-Host\` — реальный IP и схема клиента. Express должен быть переведён в режим \`app.set(\'trust proxy\', true)\` (или конкретный список адресов), иначе \`req.ip\` будет содержать адрес прокси, а \`req.secure\` — \`false\` даже на HTTPS.',
        },
      ],
    },
  ],

  finalQuiz: nodeNetworkQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  cheatsheet: `### Шпаргалка по сети в Node.js

**HTTP-сервер**
- \`http.createServer((req, res) => ...)\` (поверх \`net.Server\`)
- \`req\` — Readable, \`res\` — Writable
- Тело: \`for await\` / \`req.pipe\` с явным лимитом размера
- Таймауты: \`headersTimeout\`, \`requestTimeout\`, \`keepAliveTimeout\`

**Middleware (Express)**
- \`(req, res, next)\` — обычный middleware
- \`(err, req, res, next)\` — обработчик ошибок (4 аргумента)
- Порядок: helmet → log → CORS → rate limit → body parser → auth → routes → errors

**Маршруты**
- \`app.get(path, handler)\`, \`app.post(path, handler)\`
- \`req.params\` — параметры URL, \`req.query\` — query string
- Валидация входа через zod / joi / ajv

**CORS**
- Конкретный origin + \`credentials: true\` (не \`*\`)
- \`maxAge\` для кеширования preflight
- \`cors\` middleware обрабатывает OPTIONS автоматически
- За reverse-proxy: \`app.set('trust proxy', true)\`

**Rate limiting**
- \`express-rate-limit\` для in-memory
- Redis-backed для нескольких реплик
- Особенно важен на \`/login\`, \`/register\`, \`/forgot-password\`

**Безопасность**
- \`helmet\` для security-заголовков
- Параметризованные запросы (защита от инъекций)
- \`SameSite=Lax\`/\`Strict\` на cookies (защита от CSRF)
- HTTPS, \`Strict-Transport-Security\`
- Не логировать токены и пароли

**Протоколы**
- HTTP/1.1 — основной, обычно за nginx
- HTTP/2 — мультиплексирование, в Node через \`node:http2\`
- HTTP/3 (QUIC) — пока экспериментален, в проде через прокси
- WebSocket — \`ws\`, \`socket.io\`; HTTP Upgrade поверх TCP
- SSE — однонаправленное от сервера, проще WebSocket

**HTTP-клиент**
- Глобальный \`fetch\` поверх undici (Node 18+)
- \`http.Agent({ keepAlive: true, maxSockets, maxFreeSockets })\` для переиспользования соединений
- \`undici.Agent\` / \`undici.Pool\` для глобального fetch
- Таймауты: \`AbortSignal.timeout(ms)\` обязательны
- DNS: \`dns.lookup\` идёт через libuv thread pool, \`dns.resolve\` — через c-ares

**Graceful shutdown**
- \`SIGTERM\` (k8s) / \`SIGINT\` (Ctrl+C)
- \`server.close()\` + \`closeAllConnections()\` для keep-alive
- Принудительный exit по таймауту (\`unref\`-ed setTimeout)`,

  nextTopics: [
    {
      slug: 'node-optimization',
      reason:
        'После базового сервера логично разобрать оптимизации: LRU-кеш, батчинг запросов, circuit breaker, мемоизация.',
    },
    {
      slug: 'sd-auth',
      reason:
        'Аутентификация на проде — следующий шаг по безопасности: JWT vs session, OAuth, защита токенов.',
    },
  ],
};
