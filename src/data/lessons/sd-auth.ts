import type { Lesson } from '../../types/lesson';
import type { QuizQuestion } from '../../types/quiz';

// =============================================================================
// Quiz pool. Часть вопросов идёт в checkpoint глав, остальные — в финальный
// квиз. Идентификаторы checkpoint и finalQuiz не пересекаются (см. инвариант
// в src/test/lessons.test.ts).
// =============================================================================

const quizQuestions: QuizQuestion[] = [
  {
    type: 'output',
    id: 'sda-q1',
    description:
      'Сервер выдаёт пользователю sessionId и хранит соответствующее состояние в Redis. Что произойдёт, если масштабировать backend на пять инстансов и положить перед ними round-robin балансировщик без sticky sessions?',
    code: `// Запрос 1 → instance A: создан session "abc" в локальной памяти.
// Запрос 2 → instance B: пытаемся прочитать session "abc".`,
    options: [
      'Всё работает, потому что cookie передаёт sessionId',
      'Instance B не найдёт сессию: state нужно вынести во внешнее хранилище (Redis, БД) или использовать sticky sessions',
      'Балансировщик автоматически реплицирует память между инстансами',
      'Это типичный сценарий для JWT, поэтому пройдёт без изменений',
    ],
    correctIndex: 1,
    explanation:
      'Session-аутентификация серверная: sessionId — лишь ключ, по которому состояние читается из хранилища. Если хранилище локально для инстанса, балансировщик «теряет» пользователя на каждом втором запросе. Решения — централизованное хранилище (Redis), sticky sessions, либо переход на JWT, где состояние передаётся в самом токене.',
  },
  {
    type: 'fill-blank',
    id: 'sda-q2',
    description:
      'Допишите атрибут cookie, который запрещает чтение значения из JavaScript и защищает токен от кражи через XSS.',
    codeWithBlanks: `Set-Cookie: sessionId=abc123;
  __BLANK__;
  Secure;
  SameSite=Lax;
  Path=/`,
    options: ['Domain', 'HttpOnly', 'Max-Age', 'Priority'],
    correctIndex: 1,
    explanation:
      'HttpOnly запрещает доступ к cookie через document.cookie и любые JS API. Если злоумышленник внедрил скрипт через XSS, он не сможет прочитать или отправить такую cookie. В связке с Secure и SameSite это базовая защита токенов аутентификации.',
  },
  {
    type: 'output',
    id: 'sda-q3',
    description:
      'Куда безопаснее всего положить access-токен веб-приложения, доступного из браузера?',
    code: `// Варианты:
// 1) localStorage.setItem('token', t)
// 2) sessionStorage.setItem('token', t)
// 3) Set-Cookie: token=t; HttpOnly; Secure; SameSite=Strict
// 4) В обычном объекте window.token`,
    options: [
      'localStorage — токен переживёт перезагрузку и доступен из любого скрипта',
      'sessionStorage — то же, но только в рамках вкладки',
      'Cookie с флагами HttpOnly + Secure + SameSite — браузер сам прикрепляет токен и JS не может его прочитать',
      'window.token — быстрее всего и не требует API',
    ],
    correctIndex: 2,
    explanation:
      'localStorage и sessionStorage доступны из любого скрипта на странице — единственный XSS-инъект ворует токен. Cookie с HttpOnly недоступна для JS, Secure запрещает передачу по http, SameSite ограничивает кросс-сайтовые запросы. Это считается дефолтным безопасным вариантом для веба.',
  },
  {
    type: 'output',
    id: 'sda-q4',
    description:
      'Какой тип атаки описывает следующий сценарий? Пользователь залогинен в bank.com. Он открывает evil.com, где спрятана форма, автоматически отправляющая POST на bank.com/transfer с cookie пользователя.',
    code: `<form action="https://bank.com/transfer" method="POST">
  <input name="to" value="attacker">
  <input name="amount" value="10000">
</form>
<script>document.forms[0].submit();</script>`,
    options: [
      'XSS — выполнение чужого скрипта на bank.com',
      'CSRF — заставление браузера выполнить запрос с уже выданными cookie',
      'Session fixation — навязывание известного sessionId',
      'Clickjacking — встраивание сайта в iframe',
    ],
    correctIndex: 1,
    explanation:
      'CSRF (Cross-Site Request Forgery) использует тот факт, что браузер автоматически прикрепляет cookie к запросам на bank.com независимо от того, кто их инициировал. Защита: SameSite=Lax/Strict, double-submit или synchronizer-token, проверка Origin/Referer на чувствительных эндпоинтах.',
  },
  {
    type: 'fill-blank',
    id: 'sda-q5',
    description:
      'В OAuth 2.0 для публичных клиентов (SPA, мобильные приложения) обязательно используется расширение, защищающее authorization code от перехвата.',
    codeWithBlanks: `// 1. client генерирует code_verifier (рандом 43–128 байт)
// 2. отправляет code_challenge = SHA256(code_verifier) на /authorize
// 3. при обмене кода на токен присылает code_verifier
// Это расширение называется __BLANK__`,
    options: ['Implicit Flow', 'PKCE', 'JWT', 'mTLS'],
    correctIndex: 1,
    explanation:
      'PKCE (Proof Key for Code Exchange, RFC 7636) защищает Authorization Code Flow в публичных клиентах: даже если злоумышленник перехватил authorization code, он не сможет обменять его на токен без знания code_verifier. С 2020 года PKCE рекомендуется и для конфиденциальных клиентов; Implicit Flow считается устаревшим.',
  },
  {
    type: 'output',
    id: 'sda-q6',
    description:
      'Что такое refresh-token rotation и зачем он нужен?',
    code: `// 1) Сервер выдал refresh-token RT1.
// 2) Клиент использовал RT1 → получил новый access-токен и НОВЫЙ refresh RT2.
// 3) RT1 помечен как отозванный.
// 4) Если кто-то снова придёт с RT1 → сервер инвалидирует ВСЮ цепочку.`,
    options: [
      'Это просто продление refresh-токена; он остаётся прежним',
      'Каждый refresh выдаёт новый токен, старый аннулируется; повторное использование старого = сигнал утечки и инвалидация всей цепочки',
      'Это синоним PKCE — защита authorization code',
      'Это особенность только мобильных приложений, в браузере не нужна',
    ],
    correctIndex: 1,
    explanation:
      'Rotation решает проблему утечки refresh-токена: если злоумышленник украл RT1 и использовал его, а потом легитимный клиент тоже придёт с тем же RT1, сервер увидит «двойное использование» и отзовёт всю цепочку. Это рекомендация OAuth 2.0 BCP для публичных клиентов.',
  },
  {
    type: 'output',
    id: 'sda-q7',
    description:
      'Чем JWT принципиально отличается от классической серверной сессии?',
    code: `// session: cookie sessionId=abc → сервер ищет в Redis
// JWT: cookie token=eyJ... → сервер только проверяет подпись`,
    options: [
      'Ничем — это синонимы',
      'Session хранит состояние на сервере (stateful), JWT передаёт state в самом токене и проверяется подписью (stateless)',
      'JWT всегда зашифрован, а session — нет',
      'Session работает быстрее, потому что не требует криптографии',
    ],
    correctIndex: 1,
    explanation:
      'Session — это ID, по которому сервер находит состояние в БД/Redis (stateful). JWT — это самодостаточный подписанный токен: сервер проверяет HMAC/RS256 подпись и доверяет содержимому без обращения к хранилищу (stateless). Платой за statelessness становится сложность отзыва: до истечения exp токен валиден, и его нужно либо проверять по черному списку, либо выдавать с коротким TTL.',
  },
  {
    type: 'fill-blank',
    id: 'sda-q8',
    description:
      'Допишите алгоритм, рекомендуемый OWASP для хеширования паролей в новых системах.',
    codeWithBlanks: `import { hash, verify } from '@node-rs/argon2';
// Параметры по умолчанию: memoryCost ~ 19 МБ, timeCost = 2.
const digest = await hash(password); // алгоритм __BLANK__
await verify(digest, password);`,
    options: ['MD5', 'SHA-256', 'argon2id', 'AES-256'],
    correctIndex: 2,
    explanation:
      'argon2id — победитель Password Hashing Competition и текущая рекомендация OWASP для новых систем. Он устойчив и к GPU/ASIC (memory-hard), и к side-channel атакам. MD5 и SHA-256 — быстрые криптографические хеши без замедления, для паролей не подходят. bcrypt и scrypt остаются приемлемыми, если миграция на argon2 невозможна.',
  },
  {
    type: 'output',
    id: 'sda-q9',
    description:
      'На странице с пользовательскими комментариями вы рендерите текст напрямую через innerHTML. Что произойдёт, если злоумышленник оставит комментарий вида `<img src=x onerror="fetch(\'/admin/delete\')">`?',
    code: `comment.innerHTML = userInput; // 🔴 опасно`,
    options: [
      'Ничего: браузер увидит, что img битый, и пропустит обработчик',
      'Сработает onerror — выполнится произвольный JS в контексте страницы; это XSS',
      'Это CSRF, а не XSS, защищаемся SameSite cookie',
      'Браузер автоматически экранирует все обработчики',
    ],
    correctIndex: 1,
    explanation:
      'Это классический stored XSS. innerHTML парсит строку как HTML, включая обработчики событий. Сработает onerror и выполнит код в контексте страницы. Защиты: textContent вместо innerHTML, серверная санитизация (DOMPurify), Content Security Policy с запретом inline-скриптов, экранирование при выводе.',
  },
  {
    type: 'fill-blank',
    id: 'sda-q10',
    description:
      'Допишите значение атрибута SameSite, которое блокирует отправку cookie на cross-site POST-запросы (главная защита от CSRF), но всё ещё позволяет переходить по ссылкам с других сайтов.',
    codeWithBlanks: `Set-Cookie: sessionId=abc;
  HttpOnly;
  Secure;
  SameSite=__BLANK__`,
    options: ['None', 'Lax', 'Strict', 'Origin'],
    correctIndex: 1,
    explanation:
      'SameSite=Lax — современный дефолт в Chrome. Cookie не отправляется на кросс-сайтовые «небезопасные» методы (POST/PUT/DELETE), но прикрепляется при top-level GET-навигации (клик по ссылке). Strict жёстче и ломает SSO-сценарии, None требует Secure и используется только для явных кросс-сайт интеграций.',
  },
  {
    type: 'output',
    id: 'sda-q11',
    description:
      'Что добавляет Content Security Policy `script-src \'self\'` к существующему приложению?',
    code: `// HTTP-заголовок:
// Content-Security-Policy: default-src 'self'; script-src 'self'`,
    options: [
      'Запрещает inline-скрипты и выполнение скриптов с чужих доменов; снижает ущерб от XSS',
      'Шифрует все cookie',
      'Подменяет SameSite на Strict',
      'Включает HTTPS на сервере',
    ],
    correctIndex: 0,
    explanation:
      'CSP объявляет браузеру список разрешённых источников ресурсов. script-src \'self\' запрещает inline `<script>`, обработчики on*= в HTML и загрузку JS со сторонних доменов. Это не лечит XSS, но резко снижает ущерб: даже найдя инъекцию, злоумышленник не выполнит произвольный код. Для фреймворков с inline-стилями добавляют nonce или hash.',
  },
  {
    type: 'output',
    id: 'sda-q12',
    description:
      'Что такое session fixation и как её предотвратить?',
    code: `// 1) Атакующий заранее заходит на сайт и получает sessionId=ATT.
// 2) Заставляет жертву открыть ссылку https://site.com/?sid=ATT.
// 3) Жертва логинится под "ATT".
// 4) Атакующий уже знает ATT → входит как жертва.`,
    options: [
      'Достаточно поставить Secure флаг — атака не сработает',
      'После успешного логина сервер обязан выдать НОВЫЙ sessionId; старый — инвалидировать',
      'Это разновидность XSS, лечится CSP',
      'Защита возможна только переходом на JWT',
    ],
    correctIndex: 1,
    explanation:
      'Session fixation — атака, в которой злоумышленник навязывает жертве заранее известный sessionId. Главная защита — выдавать новый идентификатор после повышения привилегий (логин, MFA, смена роли). Дополнительно: не принимать sessionId из URL, использовать HttpOnly cookie, проверять привязку к IP/User-Agent на чувствительных операциях.',
  },
];

const Q = Object.fromEntries(quizQuestions.map((q) => [q.id, q]));

// Идентификаторы вопросов, которые встроены в главы как checkpoint.
// Эти id НЕ должны попасть в finalQuiz (инвариант теста).
const CHECKPOINT_IDS = new Set(['sda-q1', 'sda-q4', 'sda-q5', 'sda-q11']);


// =============================================================================
// Lesson
// =============================================================================

export const sdAuthLesson: Lesson = {
  topicId: 'sd-auth',

  intro: {
    whyItMatters: `Аутентификация — единственная часть приложения, где ошибка превращает баг в утечку данных и угон аккаунтов. Безопасность закладывается при проектировании, а не прикручивается сверху.

Основные выборы: session или JWT, где хранить токен (HttpOnly cookie или localStorage), какой OAuth flow использовать (Authorization Code + PKCE для SPA). Модель угроз: XSS (защита — CSP и HttpOnly), CSRF (SameSite и CSRF-токены), пароли — bcrypt или argon2id, не SHA-256.`,
    estimatedMinutes: 35,
    interviewAngle:
      'Интервьюера интересует способность держать в голове модель угроз и trade-off. Сильный ответ опирается на конкретные решения: тип хранилища токена, флаги cookie, OAuth flow, защита от XSS и CSRF, алгоритм хеширования паролей.',
    prerequisites: [{ slug: 'js-network', title: 'Сеть: CORS, cookie, HTTP' }],
  },


  chapters: [
    {
      id: 'session-vs-jwt',
      title: 'Session vs JWT: stateful или stateless',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'Аутентификация в вебе — это всегда ответ на вопрос: **где живёт состояние пользователя**? У классической «сессии» состояние хранится на сервере (Redis, БД), а клиент носит лишь короткий идентификатор. У **JWT** состояние упаковано в подписанный токен, и сервер может проверить его без обращения к хранилищу. Это два разных подхода к одной задаче — и каждый со своими trade-off-ами.',
        },
        {
          type: 'text',
          content:
            'JWT кажется проще — не нужно хранилище сессий. Но нельзя инвалидировать до истечения TTL: если токен украли, он валиден до конца срока жизни. С сессиями достаточно удалить запись из Redis. На собеседовании этот трейдофф полезно проговаривать: не просто называть «что такое JWT», а объяснять, когда сессия лучше и почему.',
        },
        { type: 'heading', content: 'Session-аутентификация' },
        {
          type: 'code',
          language: 'ts',
          content: `// Express + express-session + Redis
import session from 'express-session';
import RedisStore from 'connect-redis';

app.use(session({
  store: new RedisStore({ client: redis }),
  secret: process.env.SESSION_SECRET!,
  cookie: { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 86_400_000 },
}));

app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);
  req.session.userId = user.id;       // state на сервере
  req.session.regenerate(() => res.json({ ok: true })); // защита от fixation
});`,
        },
        { type: 'heading', content: 'JWT-аутентификация' },
        {
          type: 'code',
          language: 'ts',
          content: `import jwt from 'jsonwebtoken';

app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);
  const token = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { algorithm: 'HS256', expiresIn: '15m', issuer: 'api.example.com' },
  );
  res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'lax' });
  res.json({ ok: true });
});

// Middleware:
function auth(req, res, next) {
  const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET!, {
    algorithms: ['HS256'], issuer: 'api.example.com',
  });
  req.user = payload; // никаких обращений к БД!
  next();
}`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Главная разница не в формате, а в **месте хранения состояния**. Session — stateful: сервер должен помнить о пользователе. JWT — stateless: достаточно проверить подпись и `exp`. Из этого вытекают почти все остальные различия.',
        },
        { type: 'heading', content: 'Когда что выбирать' },
        {
          type: 'list',
          content: `- **Один монолит, простая отзываемость, гранулярный ACL** → session.
- **Микросервисы, межсервисная аутентификация, общий публичный API** → JWT.
- **Нужно мгновенно «выкинуть» пользователя при бане** → session или JWT с blacklist по jti.
- **Federated login (Google, GitHub)** → OIDC выдаёт id_token (JWT), который вы можете обменять на свою сессию.
- **Mobile + web одновременно** → JWT удобнее: cookie не работают в нативе, а Authorization-заголовок работает везде.`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Распространённая ошибка — складывать в JWT-payload роли и большой ACL: токен пухнет, на каждый запрос летит лишний килобайт. Если ACL объёмный, держите его на сервере и кладите в JWT только sub.',
        },
      ],
      checkpoint: [Q['sda-q1']!, {
        type: 'ordering',
        id: 'sda-ord1',
        description: 'Расставь шаги OAuth 2.0 Authorization Code Flow в правильном порядке',
        items: [
          'Пользователь нажимает \'Войти через Google\'',
          'Браузер редиректит на Authorization Server (Google)',
          'Пользователь даёт разрешение, получает authorization code',
          'Frontend отправляет code на backend',
          'Backend обменивает code на access + refresh токены',
          'Backend использует access token для запросов к API',
        ],
        explanation: 'Authorization Code Flow безопаснее Implicit: токены никогда не попадают в браузер напрямую. Code одноразовый и короткоживущий. Backend хранит refresh token и обновляет access token без участия пользователя.',
      }],
    },

    {
      id: 'token-storage',
      title: 'Где хранить токен в браузере',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'У браузера три места для хранения секретов: **HttpOnly cookie**, **localStorage/sessionStorage** и **переменная в памяти приложения**. Выбор определяет, насколько токен уязвим к XSS, теряется ли он при перезагрузке, и кто «прикрепляет» его к запросу — браузер или ваш код.',
        },
        {
          type: 'text',
          content:
            'Главная защита: httpOnly cookie недоступна из JavaScript — ключевой механизм защиты от XSS-кражи токена. Ловушка: localStorage удобен, не требует настройки на сервере, работает сразу — поэтому его и используют в туториалах. Но любой XSS на странице (включая скрипты из npm-зависимостей) получает полный доступ к localStorage. На интервью по безопасности этот вопрос почти всегда задают первым.',
        },
        {
          type: 'list',
          content: `- **HttpOnly cookie** — браузер сам добавляет к запросам, JS не может прочитать. Уязвима к CSRF, но защищается SameSite/CSRF-токеном.
- **localStorage** — переживает перезагрузку, но **доступна любому скрипту** на странице. Один XSS-инъект ворует токены у всех пользователей.
- **sessionStorage** — то же, но только в рамках вкладки.
- **In-memory** — переменная в JS-модуле или Redux store. XSS не «вытащит» её через document.cookie/localStorage, но JS-инъект всё равно прочитает её через захват API-вызовов; теряется при F5.`,
        },
        {
          type: 'code',
          language: 'ts',
          content: `// ✅ Правильно: HttpOnly + Secure + SameSite cookie.
res.cookie('token', token, {
  httpOnly: true,    // JS не прочитает
  secure: true,      // только по HTTPS
  sameSite: 'lax',   // блокирует кросс-сайтовые POST → защита от CSRF
  path: '/',
  maxAge: 15 * 60 * 1000,
});

// 🔴 Плохо: токен в localStorage.
// Любой XSS на странице (включая XSS из npm-зависимости) → token утёк.
localStorage.setItem('token', token);

// 🟡 Компромисс: access в памяти + refresh в HttpOnly cookie.
let accessToken: string | null = null;
async function refresh() {
  const res = await fetch('/auth/refresh', { credentials: 'include' });
  accessToken = (await res.json()).token;
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Современная рекомендация для SPA: **refresh-токен в HttpOnly cookie**, **access-токен в памяти**. Refresh пережил перезагрузку и недоступен JS; access живёт минуты и теряется с вкладкой — даже XSS-перехват даст злоумышленнику минуты, а не дни.',
        },
        { type: 'heading', content: 'Атрибуты cookie' },
        {
          type: 'list',
          content: `- **HttpOnly** — запрещает доступ из JS. Дефолт для всех auth-cookie.
- **Secure** — только по HTTPS. Дефолт всегда (HTTP только для localhost-разработки).
- **SameSite=Lax** — современный дефолт; блокирует кросс-сайтовые POST.
- **SameSite=Strict** — жёстче; ломает «логин по ссылке из почты».
- **SameSite=None** — отключает защиту, требует Secure; нужен для CDN/embed.
- **Domain** — расширяет cookie на поддомены; будьте осторожны с public suffix list.
- **Max-Age / Expires** — TTL; auth-cookie короткие, refresh-cookie длиннее.
- **Path=/api/refresh** — ограничьте refresh-cookie endpoint-ом, который её использует.`,
        },
      ],
    },

    {
      id: 'oauth-oidc',
      title: 'OAuth 2.0 и OpenID Connect',
      estimatedMinutes: 9,
      blocks: [
        {
          type: 'text',
          content:
            'OAuth 2.0 решает задачу **делегированной авторизации**: пользователь разрешает приложению (client) получить ограниченный доступ к ресурсу (resource server) через сервер авторизации (authorization server) — без передачи пароля. OpenID Connect — слой аутентификации поверх OAuth: помимо access-токена клиент получает **id_token** (JWT с информацией о пользователе).',
        },
        {
          type: 'text',
          content:
            'Ловушка для новичков: путаница между OAuth (авторизация — «что можно делать») и OIDC (аутентификация — «кто это»). OAuth отвечает «этому приложению разрешён доступ к фото», OIDC добавляет «и вот кто этот пользователь». На интервью часто спрашивают «для чего id_token а для чего access_token» — это прямая проверка понимания разницы.',
        },
        { type: 'heading', content: 'Authorization Code Flow + PKCE' },
        {
          type: 'list',
          content: `- 1. SPA генерирует **code_verifier** (случайные 43–128 байт) и его SHA-256 хеш — **code_challenge**.
- 2. Редиректит пользователя на /authorize с client_id, redirect_uri, scope, code_challenge.
- 3. Пользователь логинится у провайдера (Google, Auth0).
- 4. Провайдер редиректит обратно на redirect_uri с **authorization code**.
- 5. SPA меняет code на токены, прислав в /token: code + code_verifier.
- 6. Сервер сверяет SHA-256(verifier) == challenge → выдаёт access + (опц.) refresh + (опц.) id_token.`,
        },
        {
          type: 'code',
          language: 'ts',
          content: `// 1) Генерация PKCE
async function pkceChallenge() {
  const verifier = base64url(crypto.getRandomValues(new Uint8Array(64)));
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  const challenge = base64url(new Uint8Array(digest));
  sessionStorage.setItem('pkce_verifier', verifier);
  return challenge;
}

// 2) Редирект на /authorize
const challenge = await pkceChallenge();
location.href = \`https://auth.example.com/authorize?\` + new URLSearchParams({
  response_type: 'code',
  client_id: 'spa-client',
  redirect_uri: 'https://app.example.com/callback',
  scope: 'openid profile email',
  code_challenge: challenge,
  code_challenge_method: 'S256',
  state: crypto.randomUUID(),
});

// 3) В callback меняем code на токены
const verifier = sessionStorage.getItem('pkce_verifier');
const res = await fetch('https://auth.example.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: new URL(location.href).searchParams.get('code')!,
    redirect_uri: 'https://app.example.com/callback',
    client_id: 'spa-client',
    code_verifier: verifier!,
  }),
});`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Implicit Flow (response_type=token) официально устарел: токен возвращается прямо в URL-фрагменте, попадает в логи и историю браузера, не защищён PKCE. Современный ответ для SPA — Authorization Code + PKCE.',
        },
        { type: 'heading', content: 'OIDC: id_token vs access_token' },
        {
          type: 'list',
          content: `- **access_token** — для доступа к API. Формат не специфицирован (часто JWT, бывает opaque).
- **id_token** — JWT, подписанный provider-ом, **только** для аутентификации клиента. В нём sub, email, name, exp, iss, aud, nonce.
- **refresh_token** — обмен на новый access; не передавайте его в запросах к API.
- **discovery**: GET /.well-known/openid-configuration возвращает все endpoint-ы и JWKS-URI.
- **JWKS**: публичные ключи для проверки подписи id_token; кешируйте 24 часа, инвалидируйте по kid.`,
        },
        {
          type: 'code',
          language: 'ts',
          content: `// Проверка id_token на бэкенде
import { jwtVerify, createRemoteJWKSet } from 'jose';

const JWKS = createRemoteJWKSet(new URL('https://auth.example.com/.well-known/jwks.json'));

const { payload } = await jwtVerify(idToken, JWKS, {
  issuer: 'https://auth.example.com',
  audience: 'spa-client',
});
// payload.sub, payload.email — это аутентифицированный пользователь.`,
        },
      ],
      checkpoint: [Q['sda-q5']!, {
        type: 'match-pairs',
        id: 'sda-mp1',
        description: 'Сопоставь место хранения токена с основным риском',
        pairs: [
          { left: 'localStorage', right: 'Уязвим к XSS — любой JS может прочитать' },
          { left: 'httpOnly cookie', right: 'Уязвим к CSRF — автоматически отправляется браузером' },
          { left: 'Memory (JS переменная)', right: 'Теряется при обновлении страницы' },
          { left: 'sessionStorage', right: 'Уязвим к XSS, очищается при закрытии вкладки' },
        ],
        explanation: 'Нет идеального места. httpOnly cookie + SameSite=Strict/Lax — лучший компромисс: JS не может читать, CSRF защищён SameSite. Access token в памяти + refresh в httpOnly cookie — современный паттерн.',
      }],
    },

    {
      id: 'refresh-rotation',
      title: 'Refresh-токены и их ротация',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Главный приём для безопасной работы с JWT — **короткий access-токен** (5–15 минут) и **длинный refresh-токен** (дни/недели), которым вы выдаёте новые access-ы. Если access утечёт, окно атаки минимальное; если утечёт refresh, его можно отозвать. Чтобы защититься от долгоживущих refresh-токенов, применяют **rotation**.',
        },
        {
          type: 'text',
          content:
            'Аналогия: представь что каждый раз в банкомате тебе выдают новую карту, а старая блокируется. Если кто-то нашёл твою старую карту и попробовал ей воспользоваться — банк видит «эта карта уже была использована» и блокирует весь аккаунт. Именно так работает refresh rotation: двойное использование токена — сигнал утечки, сервер отзывает всю семью токенов.',
        },
        { type: 'heading', content: 'Rotation: одноразовый refresh' },
        {
          type: 'list',
          content: `- 1. Сервер выдаёт refresh **RT1** при логине.
- 2. Клиент использует RT1 → получает новый access **и новый RT2**, RT1 помечается как использованный.
- 3. Если кто-то снова придёт с RT1 — это **сигнал утечки**. Сервер отзывает всю «семью» refresh-токенов и заставляет пользователя залогиниться.
- 4. Сервер ведёт families: refresh_id → user_id, parent_id, used_at.`,
        },
        {
          type: 'code',
          language: 'ts',
          content: `// Псевдокод refresh endpoint с rotation.
app.post('/auth/refresh', async (req, res) => {
  const oldRT = req.cookies.refresh;
  const record = await db.refresh.findUnique({ where: { token: oldRT } });

  if (!record || record.revoked) return res.status(401).end();

  if (record.used) {
    // 🚨 Двойное использование = утечка.
    await db.refresh.updateMany({
      where: { familyId: record.familyId },
      data: { revoked: true },
    });
    return res.status(401).end();
  }

  // Помечаем старый, выдаём новый в той же семье.
  await db.refresh.update({ where: { id: record.id }, data: { used: true } });
  const newRT = await issueRefresh({ userId: record.userId, familyId: record.familyId });

  res.cookie('refresh', newRT, { httpOnly: true, secure: true, sameSite: 'lax', path: '/auth/refresh' });
  res.json({ access: signAccess(record.userId) });
});`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Без rotation украденный refresh даёт злоумышленнику бесконечный доступ. Rotation превращает утечку в одноразовую: либо легитимный клиент, либо атакующий — успеет только один.',
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Дополнительная защита — привязка refresh-токена к fingerprint клиента (DPoP, mTLS, sender-constrained tokens). Тогда даже одноразовое использование украденного refresh не пройдёт без приватного ключа клиента.',
        },
      ],
    },

    {
      id: 'xss',
      title: 'XSS: модель угроз и защиты',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'XSS (Cross-Site Scripting) — внедрение чужого JavaScript в страницу. Этот скрипт исполняется в контексте origin сайта: видит DOM, читает не-HttpOnly cookie, отправляет запросы от имени пользователя. XSS обходит почти все «cookie-защиты» — атакующий уже внутри origin.',
        },
        {
          type: 'text',
          content:
            'Главная защита: никогда не вставляй пользовательский ввод напрямую в HTML. React делает это автоматически (JSX экранирует строки), но `dangerouslySetInnerHTML` — дыра. Httponly cookie недоступна из JavaScript — ключевая защита от XSS-кражи токена. Но помни: XSS может делать запросы от имени пользователя даже без доступа к cookie, просто вызвав fetch с credentials: include.',
        },
        {
          type: 'list',
          content: `- **Stored XSS**: вредоносный код сохранён в БД (комментарии, профиль) и рендерится всем посетителям.
- **Reflected XSS**: код приходит в URL/параметре и эхом возвращается сервером в HTML.
- **DOM-based XSS**: уязвимость в клиентской логике — небезопасный innerHTML, eval, document.write, location.hash.`,
        },
        {
          type: 'code',
          language: 'tsx',
          content: `// 🔴 Уязвимый рендер пользовательского комментария.
function Comment({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// Если в БД лежит:
//   <img src=x onerror="fetch('/admin/delete', { method: 'POST' })">
// → сработает onerror и выполнит fetch с cookie пользователя.

// ✅ Решение 1: textContent / React-рендер строки
function Safe({ text }: { text: string }) { return <div>{text}</div>; }

// ✅ Решение 2: санитизация через DOMPurify
import DOMPurify from 'dompurify';
function SafeHtml({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: ['b', 'i', 'a', 'p'] });
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}`,
        },
        { type: 'heading', content: 'Content Security Policy (CSP)' },
        {
          type: 'text',
          content:
            'CSP — HTTP-заголовок, объявляющий браузеру список разрешённых источников ресурсов. Главная цель — снизить ущерб от XSS: даже найдя инъекцию, атакующий не выполнит произвольный inline-скрипт, если script-src его не разрешает.',
        },
        {
          type: 'code',
          language: 'http',
          content: `Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-r4nd0m';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://cdn.example.com;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  report-uri /csp-report`,
        },
        {
          type: 'list',
          content: `- **\'self\'** — только текущий origin.
- **nonce-XXX** — разрешить inline-скрипт с указанным nonce; nonce генерируется на каждый запрос.
- **strict-dynamic** — современный подход: разрешённые скрипты могут подгружать другие, не нужно перечислять CDN.
- **frame-ancestors \'none\'** — защита от clickjacking (заменяет X-Frame-Options).
- **report-uri / report-to** — собирайте нарушения в production, чтобы видеть атаки.`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'CSP не **лечит** XSS — она снижает ущерб. Если разработчик включает `\'unsafe-inline\'`, защита превращается в декоративную. Используйте nonce/hash; современные React-приложения совместимы с этим без проблем.',
        },
        { type: 'heading', content: 'Trusted Types и санитизация' },
        {
          type: 'text',
          content:
            'Дополнительная защита Chrome: **Trusted Types** заставляют все sink-функции (innerHTML, document.write) принимать только специально оформленные объекты, что отлавливает забытые места. На сервере не доверяйте никакому пользовательскому HTML без санитизации (DOMPurify, sanitize-html, ammonia в Rust).',
        },
      ],
      playground: {
        starterCode: `// Перепишите функцию render так, чтобы она НЕ выполняла onerror
// при подаче строки '<img src=x onerror="window.HACKED=true">'.
// Просто измените способ вставки текста в DOM.

const div = { innerHTML: '', textContent: '' };

function render(div, html) {
  div.innerHTML = html; // 🔴 уязвимо
}

render(div, '<img src=x onerror="window.HACKED=true">');
console.log(div.innerHTML.length > 0 ? 'rendered' : 'empty');`,
        expectedOutput: 'rendered',
        description:
          'Достаточно заменить `innerHTML` на `textContent`. Это базовая защита от XSS: текст вставляется как текст, а не как HTML, и обработчики событий не парсятся.',
      },
      checkpoint: [Q['sda-q11']!],
    },

    {
      id: 'csrf',
      title: 'CSRF и SameSite',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'CSRF (Cross-Site Request Forgery) использует автоматическую отправку cookie. Пользователь залогинен на bank.com, открывает evil.com — там скрытая форма автоматически отправляет POST на bank.com/transfer, и браузер прикрепляет cookie. Сервер видит «легитимный» запрос от залогиненного пользователя.',
        },
        {
          type: 'text',
          content:
            'CSRF часто путают с XSS. Разница: XSS — злоумышленник выполняет код на твоём сайте, CSRF — злоумышленник заставляет твой браузер сделать запрос к твоему сайту со своего. HttpOnly cookie защищает от кражи токена через XSS, но НЕ защищает от CSRF — потому что браузер всё равно прикрепляет её к запросам. Именно для защиты от CSRF и нужен SameSite.',
        },
        {
          type: 'code',
          language: 'html',
          content: `<!-- evil.com -->
<form action="https://bank.com/transfer" method="POST">
  <input name="to" value="attacker">
  <input name="amount" value="10000">
</form>
<script>document.forms[0].submit();</script>`,
        },
        { type: 'heading', content: 'Защита 1: SameSite cookie' },
        {
          type: 'list',
          content: `- **SameSite=Lax** (дефолт) — блокирует cross-site POST/PUT/DELETE; разрешает GET-навигацию по ссылке.
- **SameSite=Strict** — жёстче; ломает «логин по ссылке из почты» (cookie не прикрепится при первом GET с другого origin).
- **SameSite=None; Secure** — отключает защиту; нужен для embed-виджетов и CDN-аутентификации.`,
        },
        { type: 'heading', content: 'Защита 2: CSRF-токен (Synchronizer Token)' },
        {
          type: 'code',
          language: 'ts',
          content: `// Сервер выдаёт случайный токен в HTML/cookie
app.get('/form', (req, res) => {
  const csrf = crypto.randomBytes(32).toString('hex');
  req.session.csrf = csrf;
  res.render('form', { csrfToken: csrf });
});

// При отправке формы клиент шлёт токен в скрытом поле или заголовке
app.post('/transfer', (req, res) => {
  if (req.body._csrf !== req.session.csrf) {
    return res.status(403).end();
  }
  // ... перевод
});`,
        },
        { type: 'heading', content: 'Защита 3: Double-submit cookie' },
        {
          type: 'text',
          content:
            'Stateless вариант: сервер кладёт случайный токен и в cookie, и в JSON-ответе. Клиент дублирует значение в HTTP-заголовке `X-CSRF-Token`. Сервер сверяет cookie и заголовок — атакующий с другого origin не может прочитать cookie и подставить заголовок.',
        },
        {
          type: 'code',
          language: 'ts',
          content: `// Сервер: одна и та же случайная строка в cookie и в теле ответа.
const token = crypto.randomBytes(32).toString('hex');
res.cookie('csrf', token, { sameSite: 'lax', secure: true }); // НЕ HttpOnly!
res.json({ csrf: token });

// Клиент:
fetch('/api/transfer', {
  method: 'POST',
  headers: { 'X-CSRF-Token': cookieValue('csrf') },
  body: JSON.stringify({ ... }),
  credentials: 'include',
});

// Middleware на сервере:
if (req.cookies.csrf !== req.headers['x-csrf-token']) {
  return res.status(403).end();
}`,
        },
        { type: 'heading', content: 'Защита 4: проверка Origin/Referer' },
        {
          type: 'text',
          content:
            'На чувствительных эндпоинтах сравните `Origin` (или `Referer`) с белым списком ваших доменов. Это дешёвая дополнительная проверка поверх SameSite. Учтите: Origin отсутствует у некоторых старых клиентов и у GET-запросов в ряде браузеров.',
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Для нового SPA в 2024+ обычно достаточно: SameSite=Lax cookie + проверка Origin на /api. Synchronizer-token остаётся для server-rendered форм с долгой сессией.',
        },
      ],
      checkpoint: [Q['sda-q4']!],
    },

    {
      id: 'passwords',
      title: 'Хеширование паролей и session fixation',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Пароль никогда не хранится в открытом виде; даже SHA-256 «голый» уже устарел — современный GPU считает миллиарды хешей в секунду. Нужны **медленные, memory-hard** алгоритмы: argon2id (рекомендация OWASP 2024), bcrypt, scrypt. Каждый пароль солится уникальной случайной строкой; параметры подбираются так, чтобы один хеш считался ~250 мс.',
        },
        {
          type: 'text',
          content:
            'Аналогия: хеш пароля — это замок с уникальным ключом. Если база данных утечёт, злоумышленник получит замки, но чтобы подобрать ключ к каждому — нужны годы при правильных параметрах. SHA-256 без замедления — это замок который открывается за миллисекунды. На интервью по безопасности часто спрашивают «чем bcrypt отличается от SHA-256 для паролей» — ответ: скорость и memory-hardness.',
        },
        {
          type: 'code',
          language: 'ts',
          content: `import { hash, verify } from '@node-rs/argon2';

// При регистрации:
const digest = await hash(password); // соль + параметры зашиты в digest
await db.user.create({ data: { email, passwordHash: digest } });

// При логине:
const user = await db.user.findUnique({ where: { email } });
const ok = user && await verify(user.passwordHash, password);
if (!ok) {
  // Постоянная задержка независимо от того, существует ли email,
  // чтобы не выдавать enumeration через time-based side channel.
  await new Promise(r => setTimeout(r, 150));
  return res.status(401).end();
}`,
        },
        {
          type: 'list',
          content: `- **argon2id** — победитель PHC-2015, memory-hard, устойчив к GPU/ASIC. Современный дефолт.
- **bcrypt** — проверен годами, но ограничен 72 байтами входа и не memory-hard.
- **scrypt** — memory-hard, но менее распространён.
- **Запрещено**: MD5, SHA-1, SHA-256/512 без замедления, AES (это шифрование, не хеширование).
- **Pepper** — секретный «второй» соль из переменной окружения; добавляет ещё один слой, если БД утечёт без секретов.`,
        },
        { type: 'heading', content: 'Session fixation' },
        {
          type: 'text',
          content:
            'Атака, в которой злоумышленник навязывает жертве заранее известный sessionId. Например, через ссылку `https://site.com/?sid=ATT` или поддоменную cookie. Жертва логинится — атакующий уже знает sid и заходит как она.',
        },
        {
          type: 'list',
          content: `- **Регенерируйте sessionId** после логина и любой смены привилегий (\`req.session.regenerate()\` в Express).
- **Не принимайте** sessionId из URL или query-параметров — только из cookie.
- **HttpOnly + Secure** для всех auth-cookie.
- **Привязывайте** сессию к IP/User-Agent на чувствительных операциях (с осторожностью: мобильные сети меняют IP).
- **Короткий TTL** + sliding expiration + обязательный logout, инвалидирующий запись на сервере.`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Регенерация sessionId после логина — единственная обязательная защита от fixation. Все остальные меры (HttpOnly, Secure) полезны, но без регенерации атакующий, заранее «посеявший» свой sid, всё равно получит доступ.',
        },
      ],
    },
  ],

  finalQuiz: quizQuestions.filter((q) => !CHECKPOINT_IDS.has(q.id)),


  cheatsheet: `### Шпаргалка по аутентификации и безопасности

- **Session vs JWT**: stateful (Redis, легко отзывать, нужен общий стор) vs stateless (подпись, горизонтально масштабируется, отзыв через blacklist/короткий TTL).
- **Хранение токена**: HttpOnly + Secure + SameSite=Lax cookie — дефолт. localStorage уязвим к XSS. Идеал для SPA — refresh в HttpOnly cookie + access в памяти.
- **OAuth 2.0 + OIDC**: для SPA только Authorization Code Flow + PKCE. Implicit устарел. id_token (JWT) — аутентификация, access_token — доступ к API, refresh_token — обмен на новые токены.
- **Refresh rotation**: каждое использование выдаёт новый refresh, старый аннулируется. Двойное использование = утечка → отзыв всей семьи.
- **XSS**: stored/reflected/DOM-based. Защита: textContent, DOMPurify, CSP с nonce, Trusted Types, strict-dynamic.
- **CSRF**: SameSite=Lax (дефолт), Synchronizer Token, double-submit, проверка Origin/Referer.
- **Session fixation**: регенерация sessionId после логина, не принимать sid из URL.
- **Пароли**: argon2id (OWASP), bcrypt/scrypt — допустимо, никаких MD5/SHA-256 голыми.
- **CSP**: \`script-src 'self' 'nonce-XXX'; frame-ancestors 'none'\` — минимум для современного SPA.
- **CORS**: явный allow-list origin, credentials:include только для своих доменов, не \`*\` с credentials.`,


  nextTopics: [
    {
      slug: 'sd-api-design',
      reason:
        'Аутентификация — слой поверх API. После выбора session/JWT и cookie-флагов разговор переходит к структуре эндпоинтов: REST vs GraphQL, версионирование, идемпотентность, rate limiting и где именно расставить middleware авторизации.',
    },
    {
      slug: 'sd-observability',
      reason:
        'Безопасность без мониторинга — слепая зона. Логирование попыток логина, метрики refresh-rotation, алерты на двойное использование токенов, аудит действий админов — всё это часть observability-стека.',
    },
  ],
};
