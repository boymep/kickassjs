import type { TopicQuiz } from '../../types/quiz';

export const jsNetworkQuiz: TopicQuiz = {
  topicId: 'js-network',
  questions: [
    {
      type: 'output',
      id: 'jsnet-q1',
      description: 'fetch и статусы ошибок. Что выведет код?',
      code: `async function load() {
  const res = await fetch('/api/data'); // сервер вернул 404
  console.log(res.ok);
  console.log(res.status);
}
load();`,
      options: ['false и 404', 'бросит ошибку', 'true и 404', 'undefined и 404'],
      correctIndex: 0,
      explanation: 'fetch **не бросает ошибку** для HTTP-статусов 4xx/5xx! Он резолвится с объектом Response. `res.ok = false` (true только для 200-299). `res.status = 404`. Для обработки ошибок нужно проверять `if (!res.ok) throw new Error(res.status)`.',
    },
    {
      type: 'fill-blank',
      id: 'jsnet-q2',
      description: 'Заполните пропуск для CORS с credentials.',
      codeWithBlanks: `fetch('/api/profile', {
  credentials: '___BLANK___', // отправлять cookies
  headers: { 'Content-Type': 'application/json' },
});

// Сервер должен ответить:
// Access-Control-Allow-Credentials: true
// Access-Control-Allow-Origin: (конкретный origin, не *)`,
      options: ['include', 'same-origin', 'omit', 'cors'],
      correctIndex: 0,
      explanation: '`credentials: "include"` — всегда отправлять cookies/Authorization. `same-origin` (default) — только для одного origin. `omit` — никогда не отправлять. При `include` сервер не может использовать `Allow-Origin: *`.',
    },
    {
      type: 'output',
      id: 'jsnet-q3',
      description: 'Что произойдёт при CORS preflight?',
      code: `// Frontend: https://app.example.com
// Backend: https://api.example.com

fetch('https://api.example.com/users', {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer token' },
});
// Браузер автоматически...`,
      options: [
        'Отправит OPTIONS preflight, затем DELETE при успехе',
        'Сразу отправит DELETE запрос',
        'Выбросит ошибку без запроса',
        'Отправит только OPTIONS, DELETE заблокирует',
      ],
      correctIndex: 0,
      explanation: 'DELETE с заголовком Authorization — "сложный" запрос, требует preflight. Браузер автоматически отправит OPTIONS запрос с заголовками Access-Control-Request-Method и Access-Control-Request-Headers. Если сервер вернёт правильные CORS-заголовки — браузер отправит DELETE.',
    },
    {
      type: 'output',
      id: 'jsnet-q4',
      description: 'AbortController. Что выведет код?',
      code: `const controller = new AbortController();
controller.abort();

fetch('/api/data', { signal: controller.signal })
  .then(() => console.log('success'))
  .catch((err) => console.log(err.name));`,
      options: ['"AbortError"', '"NetworkError"', '"success"', '"TypeError"'],
      correctIndex: 0,
      explanation: 'AbortController.abort() можно вызвать до fetch — сигнал уже в состоянии "aborted". fetch немедленно реджектится с DOMException, у которого `name = "AbortError"`. Полезно для race conditions (ответ пришёл, но компонент уже unmounted).',
    },
    {
      type: 'fill-blank',
      id: 'jsnet-q5',
      description: 'Заполните пропуск для защиты cookies от XSS.',
      codeWithBlanks: `Set-Cookie: session=abc123;
  ___BLANK___;   // недоступен через document.cookie
  Secure;        // только HTTPS
  SameSite=Lax;`,
      options: ['HttpOnly', 'Private', 'NoScript', 'Protected'],
      correctIndex: 0,
      explanation: '`HttpOnly` — флаг, запрещающий доступ к cookie через JavaScript (`document.cookie`). Ключевая защита от XSS-атак: даже если злоумышленник внедрил скрипт, он не сможет украсть session cookie.',
    },
    {
      type: 'output',
      id: 'jsnet-q6',
      description: 'SameSite=Strict vs Lax. В каком случае cookie НЕ отправится?',
      code: `// Cookie: session=abc; SameSite=Strict

// Сценарий A: пользователь кликает ссылку на example.com с google.com
// Сценарий B: пользователь вводит example.com напрямую в адресную строку
// Сценарий C: JS делает fetch к example.com из example.com`,
      options: [
        'Только сценарий A (переход с другого сайта)',
        'Сценарии A и B',
        'Ни один (Strict всегда отправляет)',
        'Все три сценария',
      ],
      correctIndex: 0,
      explanation: 'SameSite=Strict: cookie НЕ отправляется при любых запросах с другого origin, включая переходы по ссылке. Сценарий A — кросс-сайтовый переход: cookie не отправится (защита от CSRF). Сценарии B и C — same-site: cookie отправится.',
    },
    {
      type: 'output',
      id: 'jsnet-q7',
      description: 'Статус-коды. Что означает 304 Not Modified?',
      code: `// Клиент: GET /api/data
// Заголовок: If-None-Match: "abc123"
// Сервер: 304 Not Modified (без тела)`,
      options: [
        'Данные не изменились — используйте кешированную версию',
        'Ресурс не найден',
        'Запрос выполнен, но нет данных для возврата',
        'Временно перемещён',
      ],
      correctIndex: 0,
      explanation: '304 — ответ на conditional GET. Сервер проверяет ETag/Last-Modified и отвечает 304 если данные не изменились с момента последнего запроса. Браузер использует кешированную версию. Нет тела — экономия трафика.',
    },
    {
      type: 'fill-blank',
      id: 'jsnet-q8',
      description: 'Заполните пропуск для правильного CORS-ответа с credentials.',
      codeWithBlanks: `// Сервер Node.js
res.setHeader('Access-Control-Allow-Origin', req.headers.origin); // конкретный origin
res.setHeader('Access-Control-Allow-Credentials', '___BLANK___');`,
      options: ['true', '1', 'yes', '*'],
      correctIndex: 0,
      explanation: '`Access-Control-Allow-Credentials: true` (строкой, не boolean) разрешает браузеру включать credentials (cookies, authorization) в кросс-доменные запросы. Вместе с конкретным `Allow-Origin` (не *) это безопасная конфигурация для аутентифицированных CORS-запросов.',
    },
    {
      type: 'output',
      id: 'jsnet-q9',
      description: 'Идемпотентность HTTP методов. Какой вызов НЕБЕЗОПАСЕН при повторе?',
      code: `// Повтор запроса при сбое сети:
// A: GET /api/users/1
// B: DELETE /api/users/1
// C: PUT /api/users/1 { name: "Alice" }
// D: POST /api/orders { items: [...] }`,
      options: ['D (POST)', 'A (GET)', 'B (DELETE)', 'C (PUT)'],
      correctIndex: 0,
      explanation: 'POST — не идемпотентен: повторный запрос создаст ВТОРОЙ заказ. GET, DELETE, PUT — идемпотентны: повторный вызов даёт тот же результат. DELETE второй раз вернёт 404 (уже удалено), но не создаст дублей. Поэтому retry-логика безопасна для GET/PUT/DELETE, но не для POST.',
    },
    {
      type: 'output',
      id: 'jsnet-q10',
      description: 'Парсинг ответа fetch. Что произойдёт?',
      code: `const res = await fetch('/api/data'); // Content-Type: application/json
const json1 = await res.json();
const json2 = await res.json(); // повторный вызов`,
      options: [
        'TypeError: body уже прочитан',
        'json2 === json1 (кеш)',
        'json2 === null',
        'json1 === json2 === пустой объект',
      ],
      correctIndex: 0,
      explanation: 'Тело Response — ReadableStream, его можно прочитать **только один раз**. После `res.json()` (или `res.text()`, `res.blob()`) тело считается "использованным". Повторный вызов выбросит TypeError. Для переиспользования: `const clone = res.clone(); await clone.json()`.',
    },
    {
      type: 'output',
      id: 'jsnet-q11',
      description: 'Что происходит при CORS-запросе с Access-Control-Allow-Origin: *?',
      code: `// Server ответ:
// Access-Control-Allow-Origin: *
// Access-Control-Allow-Credentials: true (попытка)

fetch('https://api.example.com/data', {
  credentials: 'include',
});`,
      options: [
        'Браузер заблокирует — * несовместим с credentials',
        'Всё сработает',
        'Только cookies не отправятся',
        'Preflight отправится, но ответ придёт',
      ],
      correctIndex: 0,
      explanation: 'Браузер заблокирует ответ с ошибкой CORS. Правило: при `credentials: "include"` сервер **обязан** указать конкретный origin (не *). Сочетание `Allow-Origin: *` + credentials — невалидная CORS-конфигурация, браузер откажет.',
    },
    {
      type: 'fill-blank',
      id: 'jsnet-q12',
      description: 'Заполните пропуск для кодирования query-параметра.',
      codeWithBlanks: `const query = 'hello world & "more"';
const url = \`/search?q=\${___BLANK___(query)}\`;
// → /search?q=hello%20world%20%26%20%22more%22`,
      options: ['encodeURIComponent', 'encodeURI', 'btoa', 'escape'],
      correctIndex: 0,
      explanation: '`encodeURIComponent` кодирует все спецсимволы включая `&`, `=`, `?`, `#`, `/`. `encodeURI` оставляет эти символы (они валидны в URI). Для параметров всегда `encodeURIComponent`, чтобы символы не ломали структуру URL. `btoa` — base64, `escape` — устарел.',
    },
  ],
};
