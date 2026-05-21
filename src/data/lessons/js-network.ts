import type { Lesson } from '../../types/lesson';
import { jsNetworkQuiz } from '../quizzes/js-network';

const Q = Object.fromEntries(jsNetworkQuiz.questions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set([
  'jsnet-q1',
  'jsnet-q3',
  'jsnet-q4',
  'jsnet-q5',
  'jsnet-q6',
  'jsnet-q9',
  'jsnet-q11',
]);

export const jsNetworkLesson: Lesson = {
  topicId: 'js-network',

  intro: {
    whyItMatters: `Сетевой слой во фронтенде — это HTTP-запросы, CORS, cookies, AbortController. Любое приложение что-то загружает или отправляет, и понимание модели браузера здесь напрямую влияет на скорость и безопасность.

На собеседовании проверяют HTTP-методы и их идемпотентность, как работает CORS и в каком случае нужен preflight, разницу между \`Cookie\` и \`localStorage\`, поведение \`fetch\` при ошибках, и как отменить запрос через \`AbortController\`.`,
    estimatedMinutes: 28,
    interviewAngle:
      'Интервьюера интересует понимание модели, а не конкретного API. Что отличает GET от POST на уровне семантики, зачем preflight, почему \`fetch\` не отвергается на 4xx, как отменить запрос — типичный набор вопросов.',
    prerequisites: [{ slug: 'js-async', title: 'Async и Promise' }],
  },

  chapters: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'http-basics',
      title: 'HTTP: методы, статусы, заголовки',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'HTTP — текстовый протокол поверх TCP (или QUIC в HTTP/3). Запрос состоит из метода, URL, заголовков и тела. Ответ — статус-кода, заголовков и тела.',
        },
        { type: 'heading', content: 'Методы' },
        {
          type: 'list',
          content: `**GET** — получить данные. Безопасный (не меняет состояние) и идемпотентный.
**POST** — создать ресурс. Не идемпотентный: повторный вызов создаёт ещё один.
**PUT** — заменить ресурс целиком. Идемпотентный.
**PATCH** — частичное изменение ресурса. Обычно идемпотентный.
**DELETE** — удалить ресурс. Идемпотентный.
**HEAD** / **OPTIONS** — служебные: метаданные и информация о поддерживаемых методах.`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            '**Идемпотентный** — повторный вызов с теми же параметрами не меняет результат. Это важно для retry-логики: GET / PUT / DELETE можно безопасно повторять, POST — нельзя без идемпотентного ключа.',
        },
        { type: 'heading', content: 'Статусы' },
        {
          type: 'list',
          content: `**2xx** — успех. \`200 OK\`, \`201 Created\`, \`204 No Content\`.
**3xx** — перенаправление. \`301 Moved Permanently\`, \`302 Found\`, \`304 Not Modified\` (для кеша).
**4xx** — ошибка клиента. \`400 Bad Request\`, \`401 Unauthorized\`, \`403 Forbidden\`, \`404 Not Found\`, \`429 Too Many Requests\`.
**5xx** — ошибка сервера. \`500 Internal Server Error\`, \`502 Bad Gateway\`, \`503 Service Unavailable\`.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Разница между \`401\` и \`403\`: \`401\` — клиент не авторизован (нет токена или он невалиден), \`403\` — авторизован, но прав недостаточно. \`429\` приходит вместе с заголовком \`Retry-After\` — он указывает, через сколько повторить запрос.',
        },
        { type: 'heading', content: 'Заголовки и тело' },
        {
          type: 'code',
          language: 'http',
          content: `POST /api/users HTTP/1.1
Host: example.com
Content-Type: application/json
Authorization: Bearer eyJhbGc...
Accept: application/json

{ "name": "Alice", "email": "a@example.com" }`,
        },
      ],
      checkpoint: [Q['jsnet-q1']!, Q['jsnet-q9']!, {
        type: 'ordering',
        id: 'jsnet-ord1',
        description: 'Какие из HTTP-методов идемпотентны? Расположите от безопасного к деструктивному',
        items: [
          'GET — только чтение, идемпотентный',
          'PUT — полная замена, идемпотентный',
          'PATCH — частичное изменение, обычно идемпотентный',
          'DELETE — удаление, идемпотентный',
          'POST — создание, не идемпотентный',
        ],
        explanation:
          'POST — единственный «классический» не идемпотентный метод. Остальные четыре можно безопасно повторять. На практике PATCH иногда теряет идемпотентность, если правит относительные значения (\`count += 1\`).',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'cors',
      title: 'CORS: same-origin, preflight, credentials',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            '**Same-origin policy** — базовое правило безопасности браузера: страница может читать ответ только с того же origin (схема + хост + порт). Все остальные запросы — cross-origin, и их регулирует **CORS**.',
        },
        {
          type: 'text',
          content:
            'CORS — это договор между браузером и сервером. Браузер всегда отправляет cross-origin запрос, но скрипт получит ответ только если сервер в ответе указал заголовок \`Access-Control-Allow-Origin\`, разрешающий текущий origin.',
        },
        {
          type: 'list',
          content: `**Simple-запрос**: \`GET\` / \`HEAD\` / \`POST\` с безопасным \`Content-Type\` (\`text/plain\`, \`application/x-www-form-urlencoded\`, \`multipart/form-data\`). Идёт сразу.
**Preflight-запрос**: всё остальное (\`Content-Type: application/json\`, кастомные заголовки, \`PUT\` / \`DELETE\`). Браузер сначала шлёт \`OPTIONS\` с описанием будущего запроса и ждёт от сервера \`Access-Control-Allow-Methods\`, \`Access-Control-Allow-Headers\`. Только после успешного preflight идёт настоящий запрос.
**Credentials**: чтобы cross-origin запрос отправил cookies, нужны \`credentials: 'include'\` на клиенте и заголовки \`Access-Control-Allow-Credentials: true\` + конкретный origin (не \`*\`) на сервере.`,
        },
        {
          type: 'code',
          language: 'http',
          content: `# Preflight (OPTIONS), который браузер отправляет автоматически
OPTIONS /api/users HTTP/1.1
Origin: https://app.example.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: content-type, authorization

# Ответ сервера, разрешающий preflight
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: content-type, authorization
Access-Control-Max-Age: 600`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '\`Access-Control-Allow-Origin: *\` несовместим с \`credentials: include\`. Если cookies нужны — сервер должен возвращать конкретный origin, и \`Access-Control-Allow-Credentials: true\`.',
        },
      ],
      checkpoint: [Q['jsnet-q3']!, Q['jsnet-q5']!, {
        type: 'match-pairs',
        id: 'jsnet-mp1',
        description: 'Сопоставьте сценарий CORS с тем, что произойдёт',
        pairs: [
          { left: 'fetch(otherOrigin) без Origin в whitelist', right: 'Браузер блокирует чтение ответа' },
          { left: 'POST с application/json на другой origin', right: 'Сначала preflight OPTIONS' },
          { left: 'GET с simple Content-Type', right: 'Запрос отправляется без preflight' },
          { left: 'Allow-Origin: * + credentials: include', right: 'Браузер блокирует — несовместимая комбинация' },
        ],
        explanation:
          'CORS — это правила браузера. Запрос всегда уходит на сервер, но ответ скрипту виден только при правильных заголовках. Preflight нужен, когда запрос «небезопасный» (нестандартный метод, нестандартный Content-Type, кастомные заголовки).',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'cookies-storage',
      title: 'Cookies, localStorage, sessionStorage',
      estimatedMinutes: 5,
      blocks: [
        { type: 'heading', content: 'Cookies' },
        {
          type: 'text',
          content:
            '**Cookies** — небольшие пары ключ-значение, которые браузер автоматически прикладывает к каждому запросу на тот же домен. Используются для сессий, аутентификации, аналитики.',
        },
        {
          type: 'list',
          content: `**HttpOnly** — недоступна из JavaScript, защита от XSS-кражи токена.
**Secure** — отправляется только по HTTPS.
**SameSite** — управляет отправкой при cross-origin запросах: \`Strict\` (никогда), \`Lax\` (только на top-level навигацию), \`None\` (всегда, требует \`Secure\`).
**Domain** и **Path** — на какие хосты и пути cookie отправляется.
**Max-Age** или **Expires** — TTL.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Безопасный сетап для токена сессии: \`HttpOnly; Secure; SameSite=Lax\`. JavaScript не может прочитать токен (защита от XSS), запросы по HTTP отбрасываются, CSRF осложнён за счёт \`Lax\`.',
        },
        { type: 'heading', content: 'localStorage и sessionStorage' },
        {
          type: 'list',
          content: `**localStorage** — хранит данные постоянно (до явного удаления). Доступен всем вкладкам одного origin.
**sessionStorage** — живёт пока открыта вкладка. Отдельный для каждой вкладки.
Оба синхронные, до ~5–10 МБ на origin, доступны из JavaScript, не отправляются на сервер автоматически.`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Не хранить токены аутентификации в \`localStorage\` — они доступны любому скрипту и легко крадутся при XSS. Сессионный токен — в \`HttpOnly\`-cookie, в \`localStorage\` — UI-настройки и кеш данных.',
        },
        { type: 'heading', content: 'IndexedDB и Cache' },
        {
          type: 'text',
          content:
            'Для больших объёмов или асинхронного доступа есть \`IndexedDB\` (документная БД до сотен МБ) и Cache API (для service worker, кеш сетевых ответов). На фронте они используются редко напрямую — поверх есть библиотеки вроде \`idb\` и \`workbox\`.',
        },
      ],
      checkpoint: [Q['jsnet-q11']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'fetch-api',
      title: 'fetch: запросы, ошибки, заголовки',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            '\`fetch\` — современный API для HTTP-запросов. Возвращает промис, который резолвится в объект \`Response\`. Тело ответа читается отдельным промисом: \`res.json()\`, \`res.text()\`, \`res.blob()\`, \`res.arrayBuffer()\`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `async function loadUser(id) {
  const res = await fetch('/api/user/' + id, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    credentials: 'include', // отправлять cookies
  });

  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '\`fetch\` отвергает промис только при сетевой ошибке (нет соединения, CORS-блокировка). Ответы 4xx / 5xx считаются успешными — нужно проверять \`res.ok\` перед чтением тела.',
        },
        { type: 'heading', content: 'POST с JSON' },
        {
          type: 'code',
          language: 'javascript',
          content: `await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice' }),
});`,
        },
        { type: 'heading', content: 'FormData и upload' },
        {
          type: 'code',
          language: 'javascript',
          content: `// FormData — multipart/form-data, удобно для загрузки файлов
const form = new FormData();
form.append('name', 'Alice');
form.append('avatar', fileInput.files[0]);

await fetch('/api/upload', {
  method: 'POST',
  body: form, // Content-Type браузер выставит сам с правильным boundary
});`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'При отправке \`FormData\` не нужно выставлять \`Content-Type\` вручную — браузер сам добавит \`multipart/form-data\` с правильным разделителем. Указание \`Content-Type\` вручную ломает запрос.',
        },
      ],
      checkpoint: [Q['jsnet-q4']!, Q['jsnet-q6']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'abort-controller',
      title: 'AbortController: отмена запросов',
      estimatedMinutes: 4,
      blocks: [
        {
          type: 'text',
          content:
            '\`AbortController\` — стандартный способ отменить асинхронную операцию. Используется с \`fetch\`, обработчиками событий, \`setTimeout\` (через \`AbortSignal.timeout\`). Главные сценарии: поиск с автодополнением, отмена при размонтировании компонента, таймауты.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Отмена при размонтировании компонента
const controller = new AbortController();

fetch('/api/search?q=' + query, { signal: controller.signal })
  .then((res) => res.json())
  .then(render)
  .catch((err) => {
    if (err.name === 'AbortError') return; // запрос отменён — нормально
    showError(err);
  });

// Где-то при размонтировании:
controller.abort();`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Таймаут — отменить запрос через 5 секунд
const signal = AbortSignal.timeout(5000);

try {
  const res = await fetch('/api/slow', { signal });
  return await res.json();
} catch (err) {
  if (err.name === 'TimeoutError') console.warn('Таймаут');
  else throw err;
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Один \`AbortController\` можно использовать для нескольких операций: передать \`signal\` в \`fetch\` и в \`addEventListener\`. \`controller.abort()\` отменит всё разом — удобный паттерн для cleanup в React и Vue.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'pitfalls',
      title: 'Подводные камни',
      estimatedMinutes: 4,
      blocks: [
        { type: 'heading', content: 'fetch и 4xx / 5xx' },
        {
          type: 'text',
          content:
            'Самая частая ошибка — забыть проверить \`res.ok\` и вызвать \`res.json()\` сразу. На 404 это даст \`SyntaxError\` при парсинге HTML-страницы как JSON.',
        },
        { type: 'heading', content: 'Race condition при автодополнении' },
        {
          type: 'text',
          content:
            'Если пользователь печатает быстро, запросы запускаются один за другим. Из-за разной скорости сервера ответ на старый запрос может прийти после нового — и старый результат перезапишет новый. Решение — \`AbortController\` или счётчик последнего запроса.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `let currentController = null;

async function search(query) {
  currentController?.abort();
  currentController = new AbortController();
  try {
    const res = await fetch('/api/search?q=' + query, { signal: currentController.signal });
    render(await res.json());
  } catch (e) {
    if (e.name !== 'AbortError') showError(e);
  }
}`,
        },
        { type: 'heading', content: 'CORS и preflight на каждый запрос' },
        {
          type: 'text',
          content:
            'Сервер может кешировать preflight ответ через заголовок \`Access-Control-Max-Age\` (по умолчанию около 5 секунд, можно увеличить до часов). Без этого браузер шлёт preflight перед каждым нестандартным запросом — лишняя задержка.',
        },
        { type: 'heading', content: 'CSRF при использовании cookies' },
        {
          type: 'text',
          content:
            'Если cookies отправляются автоматически, любая страница может инициировать запрос от имени пользователя — это CSRF. Защита: \`SameSite=Lax\` или \`Strict\` на cookie, CSRF-токен в форме, проверка заголовка \`Origin\` на сервере.',
        },
      ],
    },
  ],

  finalQuiz: jsNetworkQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  cheatsheet: `### Шпаргалка по сети

**HTTP-методы**
- GET — чтение, идемпотентный, безопасный
- POST — создание, **не** идемпотентный
- PUT — полная замена, идемпотентный
- PATCH — частичное изменение
- DELETE — удаление, идемпотентный

**Коды статусов**
- 2xx — успех (200 OK, 201 Created, 204 No Content)
- 3xx — перенаправление (301, 302, 304)
- 4xx — ошибка клиента (400, 401, 403, 404, 429)
- 5xx — ошибка сервера (500, 502, 503)

**CORS**
- Simple-запрос: GET / HEAD / POST с безопасным Content-Type
- Preflight (OPTIONS) для всего остального
- Сервер: \`Access-Control-Allow-Origin\`, \`Allow-Methods\`, \`Allow-Headers\`
- Credentials: include + конкретный origin (не \`*\`)

**Cookies**
- HttpOnly — недоступна из JS (защита от XSS)
- Secure — только HTTPS
- SameSite: Strict / Lax / None
- Сессионные токены — в HttpOnly cookie, не в localStorage

**fetch**
\`\`\`js
const res = await fetch(url, { method, headers, body, credentials, signal });
if (!res.ok) throw new Error('HTTP ' + res.status);
return res.json();
\`\`\`

**AbortController**
\`\`\`js
const controller = new AbortController();
fetch(url, { signal: controller.signal });
controller.abort(); // отменить

AbortSignal.timeout(5000); // готовый таймаут
\`\`\`

**Подводные камни**
- \`fetch\` не отвергается на 4xx / 5xx — проверка \`res.ok\`
- Race condition в автодополнении → \`AbortController\`
- CORS preflight на каждый запрос → \`Access-Control-Max-Age\`
- CSRF при cookies → SameSite + CSRF-токен
- Токены аутентификации — в HttpOnly cookie, не в localStorage`,

  nextTopics: [
    {
      slug: 'js-browser',
      reason:
        'После сети логично разобрать рендеринг: как браузер парсит ответ, как HTML превращается в DOM и пиксели на экране.',
    },
    {
      slug: 'sd-auth',
      reason:
        'Углублённое продолжение: как реализовать аутентификацию на проде — JWT vs session, OAuth, защита от XSS и CSRF на уровне архитектуры.',
    },
  ],
};
