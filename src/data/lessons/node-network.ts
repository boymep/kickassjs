import type { Lesson } from '../../types/lesson';
import { nodeNetworkQuiz } from '../quizzes/node-network';

const Q = Object.fromEntries(nodeNetworkQuiz.questions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set(['nodenet-q2', 'nodenet-q3', 'nodenet-q6', 'nodenet-q9']);

export const nodeNetworkLesson: Lesson = {
  topicId: 'node-network',

  intro: {
    whyItMatters: `Node.js часто используется для HTTP-серверов: REST API, BFF (backend for frontend), gateway, прокси. Понимание модели запрос — ответ, middleware, маршрутизации, обработки ошибок, CORS, rate limiting — одна из базовых тем для Node-разработчика.

На собеседовании проверяют, как устроен HTTP-сервер на стандартном модуле \`http\`, как работает middleware-pipeline в Express, как корректно обрабатывать ошибки и как защититься от типовых атак (CORS, CSRF, NoSQL-инъекций, brute-force).`,
    estimatedMinutes: 26,
    interviewAngle:
      'Интервьюера интересуют разбор middleware, обработка ошибок, CORS на сервере, защита от brute-force и rate-limiting, а также понимание разницы между HTTP/1.1, HTTP/2 и WebSocket.',
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
            'Стандартный модуль \`node:http\` позволяет поднять сервер без зависимостей. Это полезно, чтобы понимать, что делает Express или Fastify под капотом — на этих модулях они и построены.',
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
            'Объекты \`req\` и \`res\` — это стримы. \`req\` — Readable, \`res\` — Writable. Большие тела запросов читаются через \`for await\` или \`req.pipe(dest)\`. Большие ответы тоже стримятся — это удобно для отдачи файлов и proxy.',
        },
        { type: 'heading', content: 'Чтение тела запроса' },
        {
          type: 'code',
          language: 'javascript',
          content: `async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

const body = await readBody(req);
const data = JSON.parse(body);`,
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
            '**Middleware** — функция \`(req, res, next)\`, которая вызывается на каждый запрос до основного обработчика. Это базовая модель Express и большинства Node.js-фреймворков. Middleware могут читать и менять \`req\` и \`res\`, делать логирование, аутентификацию, парсинг тела, обрабатывать ошибки.',
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

// Парсинг JSON-тела
app.use(express.json());

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
            'Express определяет middleware-обработчик ошибок по количеству аргументов: четыре параметра \`(err, req, res, next)\`. Если забыть передать \`next(err)\` из обычного middleware при ошибке — обработчик ошибок не вызовется, запрос «зависнет».',
        },
        { type: 'heading', content: 'Порядок имеет значение' },
        {
          type: 'list',
          content: `Логирование — в самом начале, чтобы видеть все запросы.
Парсинг тела — до маршрутов, чтобы \`req.body\` был доступен.
Аутентификация — после публичных эндпойнтов или с явной проверкой пути.
CORS — до маршрутов и аутентификации, иначе preflight попадёт в auth-middleware.
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
            'Маршрутизация — сопоставление URL и метода с обработчиком. Express использует префиксы и параметры в URL, Fastify — внутренний быстрый радикс-роутер, Hono / Koa-router — близкий синтаксис.',
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
        { type: 'heading', content: 'Validation на входе' },
        {
          type: 'text',
          content:
            'Перед бизнес-логикой нужно проверить тело запроса. Стандартный подход — схема валидации (zod, joi, ajv). Это позволяет отвечать 400 с понятной ошибкой и защищает от инъекций.',
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
            'Если фронтенд и API на разных origin, браузер применяет CORS. Сервер должен возвращать правильные заголовки. В Express это middleware \`cors\`, но понимать модель нужно — конфигурации часто ломают preflight или credentials.',
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
            '\`origin: "*"\` несовместим с \`credentials: true\`. Если cookies или \`Authorization\`-заголовок отправляются — origin должен быть конкретный. Иначе браузер заблокирует ответ.',
        },
        { type: 'heading', content: 'Preflight' },
        {
          type: 'text',
          content:
            'Для нестандартных запросов (нестандартный метод, нестандартный \`Content-Type\`, кастомные заголовки) браузер шлёт \`OPTIONS\`-запрос. Сервер должен ответить заголовками \`Access-Control-Allow-*\`. \`cors\`-middleware обрабатывает это автоматически.',
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
  standardHeaders: true,       // Возвращать RateLimit-* заголовки
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
          content: `Не доверять входу: валидация всех полей через схему.
NoSQL / SQL инъекции: использовать параметризованные запросы, валидировать типы.
XSS: экранировать вывод в HTML, использовать \`Content-Security-Policy\`.
CSRF: \`SameSite=Lax\` на cookies, CSRF-токен в формах.
Логи без секретов: ни в коем случае не логировать \`Authorization\`, токены, пароли.
HTTPS обязателен в продакшене: \`Strict-Transport-Security\` принуждает браузер использовать HTTPS.`,
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
            'HTTP/2 — мультиплексирование: множество запросов параллельно в одном TCP-соединении. На стороне Node — модуль \`node:http2\`. Чаще всего HTTP/2 терминирует reverse-proxy (nginx, Cloudflare), а Node принимает HTTP/1.1 за ним.',
        },
        { type: 'heading', content: 'WebSocket' },
        {
          type: 'text',
          content:
            'Полнодуплексное двустороннее соединение поверх TCP. Подходит для чата, realtime-обновлений, многопользовательских игр. В Node популярны библиотеки \`ws\` (низкоуровневая) и \`socket.io\` (с автореконнектом, room-ами, fallback на long-polling).',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    // ws.send отправит ответ конкретному клиенту
    ws.send('echo: ' + data);
  });
});`,
        },
        { type: 'heading', content: 'Server-Sent Events (SSE)' },
        {
          type: 'text',
          content:
            'SSE — один направление, сервер → клиент. Проще, чем WebSocket: обычный HTTP-ответ с \`Content-Type: text/event-stream\`. Браузер сам пересоединяется при разрывах. Подходит для уведомлений, прогресс-баров, мониторинга.',
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
  ],

  finalQuiz: nodeNetworkQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  cheatsheet: `### Шпаргалка по сети в Node.js

**HTTP-сервер**
- \`http.createServer((req, res) => ...)\`
- \`req\` — Readable, \`res\` — Writable
- Тело читается стрим / \`for await\` / \`req.pipe\`

**Middleware (Express)**
- \`(req, res, next)\` — обычный middleware
- \`(err, req, res, next)\` — обработчик ошибок (4 аргумента)
- Порядок: log → CORS → body parser → auth → routes → errors

**Маршруты**
- \`app.get(path, handler)\`, \`app.post(path, handler)\`
- \`req.params\` — параметры URL, \`req.query\` — query string
- Валидация входа через zod / joi / ajv

**CORS**
- Конкретный origin + \`credentials: true\` (не \`*\`)
- \`maxAge\` для кеширования preflight
- \`cors\` middleware обрабатывает OPTIONS автоматически

**Rate limiting**
- \`express-rate-limit\` для in-memory
- Redis-backed для нескольких реплик
- Особенно важен на \`/login\`, \`/register\`, \`/forgot-password\`

**Безопасность**
- \`helmet\` для security-заголовков
- Параметризованные запросы (защита от инъекций)
- \`SameSite=Lax\` на cookies (защита от CSRF)
- HTTPS обязателен, \`Strict-Transport-Security\`
- Никогда не логировать токены и пароли

**Протоколы**
- HTTP/1.1 — основной, обычно за nginx
- HTTP/2 — мультиплексирование, терминируется на reverse-proxy
- WebSocket — двунаправленное, библиотеки \`ws\`, \`socket.io\`
- SSE — однонаправленное от сервера, проще WebSocket`,

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
