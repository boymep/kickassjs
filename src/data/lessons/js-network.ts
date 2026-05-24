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
    whyItMatters: `Сетевой слой во фронтенде — это HTTP-запросы, CORS, cookies, кеширование и AbortController. Практически любое веб-приложение выполняет сетевые операции, и понимание браузерной модели определяет производительность и безопасность.

На собеседовании проверяют HTTP-методы и их идемпотентность, как работает CORS и в каком случае нужен preflight, разницу между cookies и \`localStorage\`, поведение \`fetch\` при ошибках, отмену запроса через \`AbortController\`, а также realtime-каналы — WebSocket, SSE, long polling.`,
    estimatedMinutes: 30,
    interviewAngle:
      'Интервьюера интересует понимание модели, а не конкретного API: семантика HTTP-методов, зачем preflight, почему \`fetch\` не отвергается на 4xx, как отменить запрос, как работает HTTP-кеширование, когда выбирать WebSocket, SSE или long polling.',
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
        { type: 'heading', content: 'Идемпотентность' },
        {
          type: 'text',
          content:
            'Идемпотентный метод — метод, повторный вызов которого с теми же параметрами не меняет результат. Это критично для retry-логики: GET, PUT и DELETE можно безопасно повторять; POST нельзя без идемпотентного ключа.',
        },
        { type: 'heading', content: 'Методы' },
        {
          type: 'list',
          content: `GET — получить данные. Безопасный (не меняет состояние) и идемпотентный.
POST — создать ресурс. Не идемпотентный: повторный вызов создаёт ещё один.
PUT — заменить ресурс целиком. Идемпотентный.
PATCH — частичное изменение ресурса. Обычно идемпотентный (если правит абсолютные значения, а не относительные).
DELETE — удалить ресурс. Идемпотентный.
HEAD и OPTIONS — служебные: метаданные и информация о поддерживаемых методах.`,
        },
        { type: 'heading', content: 'Статусы' },
        {
          type: 'list',
          content: `2xx — успех. \`200 OK\`, \`201 Created\`, \`204 No Content\`.
3xx — перенаправление. \`301 Moved Permanently\`, \`302 Found\`, \`304 Not Modified\` (используется при условных запросах для кеша).
4xx — ошибка клиента. \`400 Bad Request\`, \`401 Unauthorized\`, \`403 Forbidden\`, \`404 Not Found\`, \`429 Too Many Requests\`.
5xx — ошибка сервера. \`500 Internal Server Error\`, \`502 Bad Gateway\`, \`503 Service Unavailable\`.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Разница между \`401\` и \`403\`: \`401\` означает, что клиент не авторизован (нет токена или он невалиден); \`403\` — клиент авторизован, но прав недостаточно. \`429\` приходит вместе с заголовком \`Retry-After\` — он указывает, через сколько повторить запрос.',
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
      id: 'http-caching',
      title: 'HTTP-кеширование',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Кеширование HTTP-ответов снижает нагрузку на сервер и ускоряет повторные загрузки. Управляется заголовками ответа и условными заголовками следующего запроса.',
        },
        { type: 'heading', content: 'Cache-Control' },
        {
          type: 'list',
          content: `\`Cache-Control: max-age=3600\` — ответ считается свежим в течение 3600 секунд. Браузер использует его без обращения к серверу.
\`Cache-Control: no-cache\` — кеш разрешён, но перед использованием обязательна валидация с сервером (через ETag или Last-Modified).
\`Cache-Control: no-store\` — не кешировать вообще, ни на клиенте, ни на промежуточных прокси.
\`Cache-Control: private\` — только в браузере пользователя, не в общих кешах (CDN, прокси).
\`Cache-Control: public\` — допустимо кешировать в общих кешах.
\`Cache-Control: immutable\` — ресурс не изменится за время своей свежести; браузер не будет проверять его даже при принудительном обновлении.`,
        },
        { type: 'heading', content: 'ETag и условные запросы' },
        {
          type: 'text',
          content:
            'ETag — идентификатор версии ресурса, который сервер отдаёт в заголовке ответа. При следующем запросе браузер отправляет \`If-None-Match: <etag>\`. Если на сервере версия не изменилась, он возвращает \`304 Not Modified\` без тела — это экономит трафик. Аналогичная связка для дат: \`Last-Modified\` ⇄ \`If-Modified-Since\`.',
        },
        {
          type: 'code',
          language: 'http',
          content: `# Первый ответ
HTTP/1.1 200 OK
Cache-Control: max-age=3600
ETag: "v123"

# Спустя час браузер шлёт условный запрос
GET /api/user/1 HTTP/1.1
If-None-Match: "v123"

# Если не изменилось — пустой ответ 304
HTTP/1.1 304 Not Modified`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Состояние ответа в терминах кеша: fresh — свежий, можно использовать без вопросов; stale — устарел, нужна валидация. На статике обычно ставят длинный \`max-age\` и хеш в имени файла (\`app.a3b5c.js\`) — при изменении контента меняется и URL.',
        },
      ],
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
            'Same-origin policy — базовое правило безопасности браузера: страница может читать ответ только с того же origin (схема + хост + порт). Все остальные запросы — cross-origin, и их регулирует CORS.',
        },
        {
          type: 'text',
          content:
            'CORS — это договор между браузером и сервером. Браузер всегда отправляет cross-origin запрос, но скрипт получит ответ только если сервер в ответе указал заголовок \`Access-Control-Allow-Origin\`, разрешающий текущий origin.',
        },
        { type: 'heading', content: 'Simple-запросы и preflight' },
        {
          type: 'text',
          content:
            'Simple-запрос — это \`GET\`, \`HEAD\` или \`POST\`, не содержащий кастомных заголовков, с одним из CORS-safelisted Content-Type: \`text/plain\`, \`application/x-www-form-urlencoded\`, \`multipart/form-data\`. Такой запрос отправляется без предварительного preflight.',
        },
        {
          type: 'text',
          content:
            'Запрос становится не-simple, если в нём есть кастомный заголовок (например, \`Authorization\`, \`X-Request-Id\`), \`Content-Type: application/json\` или метод вроде \`PUT\` или \`DELETE\`. Перед таким запросом браузер шлёт preflight — \`OPTIONS\` с заголовками \`Access-Control-Request-Method\` и \`Access-Control-Request-Headers\`. Только после успешного preflight идёт настоящий запрос.',
        },
        {
          type: 'text',
          content:
            'Credentials: чтобы cross-origin запрос отправил cookies, нужны \`credentials: \'include\'\` на клиенте и заголовки \`Access-Control-Allow-Credentials: true\` плюс конкретный origin (не \`*\`) на сервере.',
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
Access-Control-Max-Age: 7200`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '\`Access-Control-Allow-Origin: *\` несовместим с \`credentials: include\`. Если cookies нужны, сервер должен возвращать конкретный origin и \`Access-Control-Allow-Credentials: true\`. Также \`FormData\` с файлами часто формально соответствует simple-запросу, но дополнительные заголовки (например, кастомный CSRF-токен) приводят к preflight.',
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Заголовок \`Access-Control-Max-Age\` указывает, сколько секунд браузер кеширует результат preflight. Верхний предел зависит от браузера: Chrome принимает максимум 7200 секунд (два часа), Firefox — 86400 (сутки). Без этого заголовка preflight происходит почти перед каждым запросом и заметно увеличивает задержку.',
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
            'Cookies — небольшие пары ключ-значение, которые браузер автоматически прикладывает к каждому запросу на тот же домен. Используются для сессий, аутентификации, аналитики.',
        },
        {
          type: 'list',
          content: `\`HttpOnly\` — cookie недоступна из JavaScript, защита от XSS-кражи токена.
\`Secure\` — отправляется только по HTTPS.
\`SameSite=Strict\` — cookie не отправляется ни с какого cross-site контекста.
\`SameSite=Lax\` — отправляется при top-level GET-навигации (клик по ссылке), но не при cross-site POST, iframe или XHR. С 2020 года это значение по умолчанию в Chrome.
\`SameSite=None\` — отправляется всегда; требует обязательного \`Secure\`.
\`Domain\` и \`Path\` — на какие хосты и пути cookie отправляется.
\`Max-Age\` или \`Expires\` — TTL cookie.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Типовой безопасный набор для токена сессии — \`HttpOnly; Secure; SameSite=Lax\`. JavaScript не может прочитать токен, что защищает от его кражи через XSS; запросы по HTTP отбрасываются; cross-site POST не получает cookie, что осложняет CSRF.',
        },
        { type: 'heading', content: 'localStorage и sessionStorage' },
        {
          type: 'list',
          content: `\`localStorage\` — хранит данные постоянно (до явного удаления). Общий для всех вкладок одного origin.
\`sessionStorage\` — живёт пока открыта вкладка. Отдельный для каждой вкладки.
Оба синхронные, до ~5–10 МБ на origin, доступны из JavaScript, не отправляются на сервер автоматически.`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Токены аутентификации не следует хранить в \`localStorage\` — они доступны любому скрипту и могут быть украдены при XSS. Сессионный токен — в HttpOnly-cookie, в \`localStorage\` — UI-настройки и кеш данных.',
        },
        { type: 'heading', content: 'IndexedDB и Cache API' },
        {
          type: 'text',
          content:
            '\`IndexedDB\` — асинхронное объектное key-value хранилище с поддержкой индексов и транзакций. Подходит для больших объёмов (сотни МБ) и сложных запросов. Cache API — отдельное хранилище, в котором живут пары \`Request → Response\`, оно используется в Service Worker для оффлайн-режима. На клиенте они применяются обычно через обёртки — \`idb\`, \`workbox\`.',
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
            '\`fetch\` отвергает промис только при сетевой ошибке (нет соединения, CORS-блокировка, отмена через \`AbortController\`) или при \`redirect: \'error\'\`. Ответы 4xx и 5xx считаются успешными — нужно проверять \`res.ok\` перед чтением тела.',
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
        { type: 'heading', content: 'Redirect-режимы' },
        {
          type: 'text',
          content:
            'Опция \`redirect\` управляет тем, как \`fetch\` обрабатывает 3xx-ответы:',
        },
        {
          type: 'list',
          content: `\`'follow'\` (по умолчанию) — браузер автоматически следует за редиректами и возвращает финальный ответ; \`response.redirected\` равно \`true\`, если редирект был.
\`'manual'\` — \`fetch\` не следует за редиректом; ответ имеет \`type: 'opaqueredirect'\`, его содержимое недоступно скрипту.
\`'error'\` — любой редирект приводит к отвергнутому промису с сетевой ошибкой.`,
        },
        { type: 'heading', content: 'Потоковое чтение' },
        {
          type: 'text',
          content:
            '\`response.body\` — это \`ReadableStream\`, по которому можно итерироваться через \`for await...of\` или читать вручную. Полезно для больших ответов и для прогресс-баров при загрузке.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const res = await fetch('/api/big');
let received = 0;
const total = Number(res.headers.get('Content-Length'));

for await (const chunk of res.body) {
  received += chunk.length;
  setProgress(received / total);
}`,
        },
      ],
      checkpoint: [Q['jsnet-q4']!, Q['jsnet-q6']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'realtime',
      title: 'Realtime: WebSocket, SSE, long polling',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Когда нужно получать данные с сервера в реальном времени (чат, push-уведомления, обновление котировок), обычного HTTP-запроса по требованию недостаточно. Существует три основных подхода.',
        },
        { type: 'heading', content: 'WebSocket' },
        {
          type: 'text',
          content:
            'Двунаправленный канал поверх одного TCP-соединения. Клиент и сервер могут посылать сообщения в любой момент. Подходит для чатов, многопользовательских игр, совместного редактирования. Требует поддержки на стороне сервера и не кешируется промежуточными прокси.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const ws = new WebSocket('wss://example.com/chat');

ws.addEventListener('open',    () => ws.send('hello'));
ws.addEventListener('message', (e) => console.log(e.data));
ws.addEventListener('close',   () => reconnectLater());
ws.addEventListener('error',   (e) => console.error(e));`,
        },
        { type: 'heading', content: 'Server-Sent Events (SSE)' },
        {
          type: 'text',
          content:
            'Однонаправленный канал «сервер → клиент» поверх HTTP. Сервер держит соединение открытым и время от времени отправляет события в формате \`text/event-stream\`. Браузер сам обрабатывает разрывы и переподключения. Подходит для лент новостей, уведомлений, биржевых тикеров.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const events = new EventSource('/api/updates');

events.onmessage = (e) => console.log(e.data);
events.addEventListener('order:new', (e) => addOrder(JSON.parse(e.data)));
events.onerror = () => console.warn('SSE disconnected');`,
        },
        { type: 'heading', content: 'Long polling' },
        {
          type: 'text',
          content:
            'Клиент отправляет обычный HTTP-запрос; сервер не отвечает сразу, а ждёт появления новых данных (или таймаута), затем возвращает ответ. Клиент тут же отправляет следующий запрос. Подходит для совместимости со старыми инфраструктурами, где WebSocket недоступен. Минусы — высокая задержка по сравнению с WebSocket и нагрузка от частых HTTP-соединений.',
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Выбор между подходами: WebSocket — когда нужен двунаправленный поток (чат, игры). SSE — когда поток идёт только с сервера и важна простота (уведомления, ленты). Long polling — как fallback или для совместимости. SSE — единственный из трёх, который кеширует Service Worker, поддерживает HTTP-аутентификацию и не требует отдельного сервера.',
        },
      ],
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
        {
          type: 'callout',
          calloutType: 'info',
          content:
            '\`AbortSignal.any([s1, s2, ...])\` создаёт сигнал, отменяющийся при срабатывании любого из переданных. Это удобно, когда нужно объединить пользовательскую отмену с таймаутом: \`AbortSignal.any([user.signal, AbortSignal.timeout(5000)])\`.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'pitfalls',
      title: 'Подводные камни',
      estimatedMinutes: 4,
      blocks: [
        { type: 'heading', content: 'Парсинг тела без проверки res.ok' },
        {
          type: 'text',
          content:
            'Типичная ошибка — не проверить \`res.ok\` и вызвать \`res.json()\` сразу. На 404 это даёт \`SyntaxError\` при попытке распарсить HTML-страницу как JSON.',
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
        { type: 'heading', content: 'CORS-preflight на каждый запрос' },
        {
          type: 'text',
          content:
            'Без заголовка \`Access-Control-Max-Age\` браузер шлёт preflight перед каждым нестандартным запросом, что приводит к дополнительной задержке round-trip. Установка кеша на минуты или часы устраняет эту проблему.',
        },
        { type: 'heading', content: 'CSRF при использовании cookies' },
        {
          type: 'text',
          content:
            'Если cookies отправляются автоматически, любая сторонняя страница может инициировать запрос от имени пользователя — это CSRF. Защита: \`SameSite=Lax\` или \`Strict\` на cookie, CSRF-токен в форме, проверка заголовка \`Origin\` на сервере.',
        },
        { type: 'heading', content: 'fetch vs XMLHttpRequest' },
        {
          type: 'text',
          content:
            '\`fetch\` — современный, основанный на промисах, поддерживает потоковое чтение и AbortController. \`XMLHttpRequest\` остаётся востребованным там, где нужны события прогресса загрузки (\`upload.onprogress\`), синхронный режим (только для legacy-кода) или \`responseType: \'document\'\` для HTML-документов. В новом коде используется \`fetch\`, в legacy и в библиотеках с прогресс-индикатором — XHR.',
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
- PATCH — частичное изменение (обычно идемпотентный)
- DELETE — удаление, идемпотентный

**Коды статусов**
- 2xx — успех (200, 201, 204)
- 3xx — перенаправление (301, 302, 304)
- 4xx — ошибка клиента (400, 401, 403, 404, 429)
- 5xx — ошибка сервера (500, 502, 503)

**HTTP-кеширование**
- \`Cache-Control: max-age=N\` — сколько секунд ответ свежий
- \`Cache-Control: no-cache\` — кеш разрешён, но всегда валидируется
- \`Cache-Control: no-store\` — не кешировать вообще
- \`Cache-Control: immutable\` — ресурс не изменится в течение TTL
- \`ETag\` ⇄ \`If-None-Match\`, \`Last-Modified\` ⇄ \`If-Modified-Since\`
- 304 Not Modified — пустой ответ, экономит трафик

**CORS**
- Simple: GET / HEAD / POST с CORS-safelisted Content-Type и без кастомных заголовков
- Preflight (OPTIONS) для всего остального
- Сервер: \`Access-Control-Allow-Origin\`, \`Allow-Methods\`, \`Allow-Headers\`
- Credentials: include + конкретный origin (не \`*\`)
- \`Access-Control-Max-Age\` — кеш preflight (Chrome до 7200 с)

**Cookies**
- HttpOnly — недоступна из JS (защита от XSS)
- Secure — только HTTPS
- SameSite: Strict / Lax / None
- Сессионные токены — в HttpOnly cookie, не в localStorage

**fetch**
\`\`\`js
const res = await fetch(url, {
  method, headers, body,
  credentials, signal,
  redirect: 'follow' | 'manual' | 'error',
});
if (!res.ok) throw new Error('HTTP ' + res.status);
return res.json();
\`\`\`

**Realtime**
- WebSocket — двунаправленный поток (чат, игры)
- SSE — однонаправленный сервер → клиент (уведомления, ленты)
- Long polling — fallback, когда WebSocket недоступен

**AbortController**
\`\`\`js
const controller = new AbortController();
fetch(url, { signal: controller.signal });
controller.abort();

AbortSignal.timeout(5000);
AbortSignal.any([signalA, signalB]);
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
