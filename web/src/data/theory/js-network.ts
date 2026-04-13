import type { TopicTheory } from '../../types/topic';

export const jsNetworkTheory: TopicTheory = {
  topicId: 'js-network',
  sections: [
    {
      title: 'HTTP — основы',
      blocks: [
        {
          type: 'text',
          content:
            'HTTP (Hypertext Transfer Protocol) — протокол клиент-серверного взаимодействия. Клиент отправляет **запрос**, сервер возвращает **ответ**. Каждый запрос состоит из метода, URL, заголовков и (опционально) тела.',
        },
        {
          type: 'list',
          content:
            '**GET** — получить ресурс. Без тела. Кешируется. Идемпотентен.\n**POST** — создать ресурс. Тело — данные. Не идемпотентен.\n**PUT** — полностью заменить ресурс. Идемпотентен.\n**PATCH** — частично обновить ресурс.\n**DELETE** — удалить ресурс. Идемпотентен.\n**OPTIONS** — узнать поддерживаемые методы (preflight CORS).',
        },
        {
          type: 'list',
          content:
            '**2xx**: успех (200 OK, 201 Created, 204 No Content).\n**3xx**: редиректы (301 Moved, 302 Found, 304 Not Modified).\n**4xx**: ошибка клиента (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests).\n**5xx**: ошибка сервера (500 Internal Error, 502 Bad Gateway, 503 Service Unavailable).',
        },
      ],
    },
    {
      title: 'CORS — Cross-Origin Resource Sharing',
      blocks: [
        {
          type: 'text',
          content:
            'CORS — механизм безопасности браузера. Политика **Same-Origin** запрещает JavaScript обращаться к ресурсам на другом origin (протокол + домен + порт). CORS позволяет серверу явно разрешить кросс-доменные запросы.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Простые запросы (Simple Requests) — без preflight:
// - метод: GET, POST, HEAD
// - заголовки: Content-Type: text/plain, multipart/form-data, application/x-www-form-urlencoded

// Preflight (предварительный запрос OPTIONS) — для:
// - DELETE, PUT, PATCH
// - Content-Type: application/json
// - Кастомные заголовки (Authorization, X-Custom-Header)

// Браузер отправляет:
OPTIONS /api/data HTTP/1.1
Origin: https://frontend.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization

// Сервер отвечает:
Access-Control-Allow-Origin: https://frontend.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400 // кешировать preflight на 1 день`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '`Access-Control-Allow-Origin: *` — разрешает все origins, но **не работает с credentials** (cookies, Authorization). Для запросов с credentials нужно указать конкретный origin и `Access-Control-Allow-Credentials: true`.',
        },
      ],
    },
    {
      title: 'Cookies — хранение сессии',
      blocks: [
        {
          type: 'text',
          content:
            'Cookie — небольшие данные, сохраняемые браузером и автоматически отправляемые с каждым запросом к домену. Используются для сессий, аутентификации, персонализации.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Установка cookie сервером:
Set-Cookie: session=abc123;
  HttpOnly;           // недоступен через document.cookie (защита от XSS)
  Secure;             // только HTTPS
  SameSite=Strict;    // не отправлять при кросс-доменных запросах (защита от CSRF)
  Max-Age=3600;       // истекает через 1 час
  Path=/;             // доступен для всех путей
  Domain=.example.com // доступен для поддоменов

// Чтение в JS (только без HttpOnly):
document.cookie; // "session=abc123; lang=ru"

// Установка в JS:
document.cookie = "lang=ru; Path=/; Max-Age=86400";`,
        },
        {
          type: 'list',
          content:
            '**HttpOnly** — нельзя читать через JS (защита от XSS-кражи сессии).\n**Secure** — только HTTPS (защита от перехвата).\n**SameSite=Strict** — не отправляется при переходах с других сайтов (защита от CSRF).\n**SameSite=Lax** — отправляется при GET-запросах при переходах (баланс).\n**SameSite=None** — отправляется всегда (нужен Secure).',
        },
      ],
    },
    {
      title: 'fetch API и AbortController',
      blocks: [
        {
          type: 'code',
          language: 'javascript',
          content: `// Базовый fetch
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice' }),
  credentials: 'include', // отправлять cookies
});

if (!response.ok) {
  throw new Error(\`HTTP error: \${response.status}\`);
}

const data = await response.json();`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'fetch **не бросает ошибку** при HTTP-статусах 4xx/5xx! Нужно явно проверять `response.ok` (true для 200-299). Ошибку fetch бросает только при сетевых проблемах (нет интернета, DNS ошибка).',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// AbortController — отмена запроса
const controller = new AbortController();

// Отменить запрос через 5 секунд:
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const res = await fetch('/api/data', {
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  return await res.json();
} catch (err) {
  if (err.name === 'AbortError') {
    console.log('Запрос отменён');
  } else {
    throw err;
  }
}

// Отмена при unmount компонента (React):
useEffect(() => {
  const controller = new AbortController();
  fetch('/api/data', { signal: controller.signal })
    .then(r => r.json())
    .then(setData)
    .catch(err => { if (err.name !== 'AbortError') throw err; });

  return () => controller.abort(); // cleanup
}, []);`,
        },
      ],
    },
  ],
};
