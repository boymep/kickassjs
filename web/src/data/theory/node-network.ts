import type { TopicTheory } from '../../types/topic';

export const nodeNetworkTheory: TopicTheory = {
  topicId: 'node-network',
  sections: [
    {
      title: 'HTTP-сервер в Node.js',
      blocks: [
        {
          type: 'text',
          content:
            'Node.js имеет встроенный модуль `http`/`https`. Большинство production-серверов используют **Express** или **Fastify** поверх него. Понимание нативного http важно для собеседований.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const http = require('http');

const server = http.createServer((req, res) => {
  // req — IncomingMessage (Readable stream)
  // res — ServerResponse (Writable stream)

  const { method, url, headers } = req;

  // Чтение тела POST-запроса:
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', () => {
    if (method === 'POST' && url === '/api/data') {
      const data = JSON.parse(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ received: data }));
    } else if (method === 'GET' && url === '/health') {
      res.writeHead(200);
      res.end('OK');
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });
});

server.listen(3000, () => console.log('Server on :3000'));`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Запросы к одному серверу HTTP/1.1 используют **Keep-Alive** (persistent connections) — несколько запросов по одному TCP-соединению. HTTP/2 добавляет мультиплексирование: несколько запросов параллельно по одному соединению без блокировки head-of-line.',
        },
      ],
    },
    {
      title: 'Express: middleware и routing',
      blocks: [
        {
          type: 'code',
          language: 'javascript',
          content: `const express = require('express');
const app = express();

// Middleware — функция (req, res, next):
app.use(express.json()); // парсинг JSON body
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next(); // передать управление следующему middleware
});

// Routing:
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await db.findUser(id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

app.post('/users', async (req, res) => {
  const user = await db.createUser(req.body);
  res.status(201).json(user);
});

// Error handling middleware (4 аргумента!):
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(3000);`,
        },
        {
          type: 'list',
          content:
            '**Порядок middleware важен**: `app.use()` регистрирует в порядке добавления.\n**next(err)**: передаёт ошибку в error-handling middleware.\n**res.locals**: передавать данные между middleware без изменения req.\n**Router**: `express.Router()` для группировки роутов.',
        },
      ],
    },
    {
      title: 'WebSockets и SSE',
      blocks: [
        {
          type: 'code',
          language: 'javascript',
          content: `// WebSocket через ws библиотеку:
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws, req) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    // Broadcast всем клиентам:
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => console.log('Client disconnected'));
  ws.on('error', console.error);

  ws.send('Welcome!');
});

// Server-Sent Events (SSE) — однонаправленный поток сервер→клиент:
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const interval = setInterval(() => {
    res.write(\`data: \${JSON.stringify({ time: Date.now() })}\\n\\n\`);
  }, 1000);

  req.on('close', () => clearInterval(interval));
});`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            '**WebSocket vs SSE**: WebSocket — двунаправленный (full-duplex), SSE — только сервер→клиент. SSE проще (HTTP, автопереподключение), WebSocket — для чатов, игр. Long polling — устаревший паттерн: клиент держит запрос открытым до события.',
        },
      ],
    },
    {
      title: 'Паттерны: rate limiting, circuit breaker, retry',
      blocks: [
        {
          type: 'code',
          language: 'javascript',
          content: `// Rate Limiting с sliding window:
class RateLimiter {
  constructor(limit, windowMs) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.requests = new Map(); // userId → timestamps[]
  }

  check(userId) {
    const now = Date.now();
    const timestamps = this.requests.get(userId) ?? [];
    // Убрать старые запросы за пределами окна:
    const recent = timestamps.filter(t => now - t < this.windowMs);
    if (recent.length >= this.limit) return false;
    recent.push(now);
    this.requests.set(userId, recent);
    return true;
  }
}

// Circuit Breaker:
class CircuitBreaker {
  constructor(fn, threshold = 5, timeout = 60000) {
    this.fn = fn;
    this.threshold = threshold;
    this.timeout = timeout;
    this.failures = 0;
    this.state = 'CLOSED'; // CLOSED | OPEN | HALF-OPEN
    this.nextAttempt = null;
  }

  async call(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit OPEN');
      }
      this.state = 'HALF-OPEN';
    }
    try {
      const result = await this.fn(...args);
      this.failures = 0;
      this.state = 'CLOSED';
      return result;
    } catch (err) {
      this.failures++;
      if (this.failures >= this.threshold) {
        this.state = 'OPEN';
        this.nextAttempt = Date.now() + this.timeout;
      }
      throw err;
    }
  }
}`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Retry с exponential backoff:
async function withRetry(fn, retries = 3, baseDelay = 100) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      // Exponential backoff: 100ms, 200ms, 400ms...
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

// Использование:
const data = await withRetry(
  () => fetch('https://api.example.com/data').then(r => r.json()),
  3, // 3 попытки
  100 // базовая задержка 100ms
);`,
        },
      ],
    },
    {
      title: 'Хитрые кейсы и production-нюансы',
      blocks: [
        {
          type: 'heading',
          content: 'WebSocket vs Server-Sent Events vs Long Polling',
        },
        {
          type: 'list',
          content: `**WebSocket** — полнодуплексное соединение (двусторонняя связь). Используется: чат, игры, real-time коллаборация. Протокол: ws:// / wss://. Требует: поддержка на сервере (ws библиотека, Socket.io).
**Server-Sent Events (SSE)** — однонаправленный стрим от сервера к клиенту. Используется: уведомления, live feed, прогресс операций. Преимущество: нативный HTTP, автоматическое переподключение, работает через proxy.
**Long Polling** — клиент делает запрос, сервер держит его открытым до появления данных. Совместимость: работает везде. Недостаток: высокий overhead на создание соединений.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Server-Sent Events на Node.js:
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Отправка события:
  const sendEvent = (data) => {
    res.write(\`data: \${JSON.stringify(data)}\\n\\n\`);
  };

  const interval = setInterval(() => {
    sendEvent({ time: Date.now(), status: 'alive' });
  }, 1000);

  // Клиент отключился:
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

// На клиенте:
const es = new EventSource('/events');
es.onmessage = (e) => console.log(JSON.parse(e.data));`,
        },
        {
          type: 'heading',
          content: 'HTTP/2 и разница с HTTP/1.1',
        },
        {
          type: 'list',
          content: `**HTTP/1.1**: 1 запрос = 1 соединение (или Keep-Alive). Head-of-line blocking: следующий запрос ждёт ответа на предыдущий. Ограничение: 6 параллельных соединений в браузере на домен.
**HTTP/2**: мультиплексирование — много запросов по одному соединению. Server Push — сервер отправляет ресурсы до запроса клиента. Бинарный протокол (быстрее парсится). Header compression (HPACK).
**HTTP/3**: на базе QUIC (UDP). Нет head-of-line blocking на уровне транспорта. Быстрое переподключение (0-RTT).`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'В production обычно используется NGINX/балансировщик, который говорит HTTP/2 с клиентом и HTTP/1.1 с Node.js серверами. Node.js поддерживает HTTP/2 нативно (`http2` модуль), но большинство фреймворков (Express) ещё не оптимизированы для него — используйте Fastify или голый `http2`.',
        },
      ],
    },
  ],
};
