import type { TopicFlashcards } from '../../types/flashcard';

export const jsNetworkFlashcards: TopicFlashcards = {
  topicId: 'js-network',
  cards: [
    {
      id: 'jsnw-f1',
      question: 'Что такое CORS? Почему браузер его блокирует и как это исправить?',
      answer:
        'CORS (Cross-Origin Resource Sharing) — механизм браузера, запрещающий запросы с одного origin на другой без явного разрешения сервера. Сервер указывает разрешённые origins через заголовок Access-Control-Allow-Origin.',
      keyPoints: [
        'Блокирует только браузер — серверные запросы (curl, node) не ограничены',
        'Origin = protocol + host + port',
        'Простые запросы: GET/HEAD/POST с простыми заголовками — без preflight',
        'Сложные запросы: PUT/DELETE/кастомные заголовки — браузер шлёт OPTIONS preflight',
      ],
      code: `// Сервер Node.js:
res.setHeader('Access-Control-Allow-Origin', 'https://myapp.com');
res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

// Для credentials:
res.setHeader('Access-Control-Allow-Credentials', 'true');
// Access-Control-Allow-Origin не может быть * при credentials!`,
    },
    {
      id: 'jsnw-f2',
      question: 'Что такое preflight-запрос? Когда браузер его отправляет?',
      answer:
        'Preflight — предварительный OPTIONS-запрос, который браузер отправляет перед «сложным» запросом, чтобы проверить разрешения сервера. Сервер должен ответить нужными CORS-заголовками.',
      keyPoints: [
        'Простые методы: GET, HEAD, POST (только с простыми заголовками) — без preflight',
        'PUT, DELETE, PATCH, custom headers — вызывают preflight',
        'Preflight кешируется через Access-Control-Max-Age',
        'Проблема: каждый новый тип запроса добавляет latency на preflight',
      ],
    },
    {
      id: 'jsnw-f3',
      question: 'Что такое атрибуты cookies: SameSite, HttpOnly, Secure? Зачем они нужны?',
      answer:
        'Атрибуты защищают cookies от атак. HttpOnly — нет доступа через JS. Secure — только HTTPS. SameSite — контроль отправки при кросс-сайтовых запросах (защита от CSRF).',
      keyPoints: [
        'HttpOnly: защита от XSS — document.cookie не прочитает',
        'Secure: cookie передаётся только по HTTPS',
        'SameSite=Strict: cookie не отправляется вообще при кросс-сайтовых запросах',
        'SameSite=Lax (дефолт): отправляется только при навигации (GET), не при fetch',
        'SameSite=None; Secure: разрешить кросс-сайт (для embedded виджетов)',
      ],
    },
    {
      id: 'jsnw-f4',
      question: 'Как работает AbortController? Как отменить fetch-запрос?',
      answer:
        'AbortController предоставляет signal, который передаётся в fetch. При вызове controller.abort() — сигнал отменяет запрос и fetch выбрасывает AbortError.',
      keyPoints: [
        'Важно для: отмена при unmount компонента (React), смена поискового запроса',
        'AbortError нужно явно обрабатывать отдельно от сетевых ошибок',
        'Один controller можно использовать для нескольких fetch',
        'abort(reason) — передать причину (доступна в signal.reason)',
      ],
      code: `const controller = new AbortController();

fetch('/api/data', { signal: controller.signal })
  .then(r => r.json())
  .catch(err => {
    if (err.name === 'AbortError') return; // отменено — не ошибка
    throw err;
  });

// Отмена (напр. при unmount):
controller.abort();`,
    },
    {
      id: 'jsnw-f5',
      question: 'Что такое HTTP-кеширование? Cache-Control, ETag, Last-Modified.',
      answer:
        'Кеширование позволяет браузеру и proxy хранить ответы и не делать повторные запросы. Cache-Control управляет сроком жизни. ETag/Last-Modified — условные запросы для проверки актуальности.',
      keyPoints: [
        'Cache-Control: max-age=3600 — кешировать 1 час',
        'Cache-Control: no-cache — всегда проверять актуальность (If-None-Match)',
        'Cache-Control: no-store — не кешировать вообще',
        'ETag: хеш содержимого. If-None-Match → 304 Not Modified если не изменилось',
        'Immutable + длинный max-age для versioned assets (hash в имени файла)',
      ],
    },
    {
      id: 'jsnw-f6',
      question: 'Чем отличаются GET, POST, PUT, PATCH, DELETE? Что значит идемпотентность?',
      answer:
        'HTTP-методы имеют семантику. Идемпотентные методы при повторном вызове дают тот же результат. GET, PUT, DELETE — идемпотентны. POST, PATCH — нет.',
      keyPoints: [
        'GET: получить данные. Безопасный + идемпотентный. Нет тела.',
        'POST: создать ресурс. Не идемпотентный (повторный POST создаст ещё один)',
        'PUT: заменить ресурс целиком. Идемпотентный.',
        'PATCH: частично обновить. Не обязательно идемпотентный.',
        'DELETE: удалить. Идемпотентный (повторный DELETE → 404, но состояние то же)',
      ],
    },
  ],
};
