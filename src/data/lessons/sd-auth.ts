import type { Lesson } from '../../types/lesson';
import type { QuizQuestion } from '../../types/quiz';
import type { Flashcard } from '../../types/flashcard';

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
// Flashcards
// =============================================================================

const flashcards: Flashcard[] = [
  {
    id: 'sda-f1',
    question: 'Чем session-аутентификация отличается от JWT?',
    answer:
      'Session — серверный (stateful) подход: сервер хранит состояние в Redis/БД, клиент носит лишь sessionId в cookie. JWT — клиентский (stateless): подписанный токен сам несёт payload, сервер только проверяет подпись. Statelessness упрощает горизонтальное масштабирование, но усложняет отзыв.',
    keyPoints: [
      'Session: stateful, легко отзывать, но нужен общий Redis между инстансами',
      'JWT: stateless, токен валиден до exp; отзыв — через blacklist или короткий TTL',
      'Session обычно живёт в HttpOnly cookie; JWT — в cookie или в памяти приложения',
      'Размер JWT: 200–1500 байт против 32 байт sessionId — лишний трафик на каждый запрос',
      'Сложные ACL и роли удобнее держать в session-стейте, не в JWT-payload',
    ],
  },
  {
    id: 'sda-f2',
    question: 'Где безопаснее всего хранить токен в SPA?',
    answer:
      'В HttpOnly + Secure + SameSite cookie, которую браузер сам прикрепляет к запросам и не отдаёт JavaScript. localStorage и sessionStorage уязвимы к XSS: один инъект ворует токен у всех пользователей.',
    keyPoints: [
      'HttpOnly: JS не может прочитать cookie → защита от XSS',
      'Secure: cookie передаётся только по HTTPS',
      'SameSite=Lax: блокирует cookie на кросс-сайтовых POST → защита от CSRF',
      'localStorage переживает перезагрузку, но виден любому скрипту',
      'In-memory переменная безопасна от XSS exfil, но теряется при F5',
    ],
  },
  {
    id: 'sda-f3',
    question: 'Что такое OAuth 2.0?',
    answer:
      'Протокол делегированной авторизации. Пользователь разрешает приложению (client) получить ограниченный доступ к ресурсу (resource server) через провайдера (authorization server) без передачи пароля. На выходе — access-токен, иногда refresh-токен.',
    keyPoints: [
      'Роли: resource owner, client, authorization server, resource server',
      'Главный поток для веба — Authorization Code + PKCE',
      'Implicit Flow устарел, его заменил Code + PKCE для SPA',
      'Client Credentials — для server-to-server без пользователя',
      'OAuth не решает аутентификацию — для этого есть OIDC поверх него',
    ],
  },
  {
    id: 'sda-f4',
    question: 'Что такое OpenID Connect (OIDC)?',
    answer:
      'Слой аутентификации поверх OAuth 2.0. Помимо access-токена клиент получает id_token — JWT с информацией о пользователе (sub, email, name). OIDC отвечает на вопрос «кто это?», в отличие от OAuth, отвечающего на «что разрешено?».',
    keyPoints: [
      'id_token — это JWT, подписанный provider\'ом (RS256)',
      'Поля: iss, sub, aud, exp, iat, nonce + профиль пользователя',
      'discovery endpoint: /.well-known/openid-configuration',
      'JWKS endpoint выдаёт публичные ключи для проверки подписи',
      'Используется в Google Sign-In, Auth0, Keycloak, AWS Cognito',
    ],
  },
  {
    id: 'sda-f5',
    question: 'Что такое PKCE и зачем он нужен?',
    answer:
      'PKCE (Proof Key for Code Exchange) — расширение OAuth 2.0 Authorization Code Flow для публичных клиентов. Клиент генерирует code_verifier и отправляет его SHA-256-хеш как code_challenge. При обмене кода на токен присылает оригинальный verifier — без него код бесполезен.',
    keyPoints: [
      'Защищает от перехвата authorization code (например, через redirect URI на мобильном)',
      'code_verifier: 43–128 случайных байт',
      'code_challenge_method = S256 (SHA-256)',
      'С 2020 PKCE обязателен для SPA и мобильных, рекомендован для всех клиентов',
      'Полностью заменяет устаревший Implicit Flow',
    ],
  },
  {
    id: 'sda-f6',
    question: 'Что такое refresh-token rotation?',
    answer:
      'Стратегия, при которой каждое использование refresh-токена выдаёт новую пару (access + refresh) и инвалидирует старый refresh. Если кто-то повторно предъявит уже использованный refresh — это сигнал утечки, и сервер отзывает всю цепочку токенов.',
    keyPoints: [
      'Рекомендация OAuth 2.0 BCP (RFC 6819 + draft-ietf-oauth-security-topics)',
      'Refresh жив N дней, но «одноразовый» внутри этого окна',
      'Detect reuse: повторное предъявление = немедленный revoke цепочки',
      'Требует трекинга семейства refresh-токенов на сервере',
      'Без rotation украденный refresh даёт злоумышленнику бесконечный доступ',
    ],
  },
  {
    id: 'sda-f7',
    question: 'Что такое XSS и какие бывают разновидности?',
    answer:
      'XSS (Cross-Site Scripting) — внедрение злоумышленником произвольного JS, который выполняется в контексте страницы жертвы. Три типа: stored (в БД), reflected (в URL/параметре), DOM-based (через клиентскую обработку).',
    keyPoints: [
      'Stored: вредоносный код сохранён в БД и отдаётся всем посетителям',
      'Reflected: код приходит в URL и эхом возвращается сервером',
      'DOM-based: уязвимость в клиентской логике (innerHTML, eval, document.write)',
      'Защита: textContent, экранирование, DOMPurify, CSP, Trusted Types',
      'XSS обходит SameSite cookie — атакующий внутри origin',
    ],
  },
  {
    id: 'sda-f8',
    question: 'Что такое CSRF и как от неё защищаться?',
    answer:
      'CSRF — атака, в которой браузер жертвы автоматически прикрепляет cookie к запросу с чужого сайта, выполняя действие от имени пользователя без его ведома. Защиты: SameSite cookie, CSRF-токен, double-submit, проверка Origin.',
    keyPoints: [
      'SameSite=Lax (дефолт в современных браузерах) уже блокирует большинство атак',
      'Synchronizer Token: сервер выдаёт случайный токен в HTML, клиент шлёт его в заголовке',
      'Double-submit: токен в cookie + тот же токен в заголовке, сервер сверяет',
      'Проверка Origin/Referer на чувствительных эндпоинтах',
      'Для API на других origin — CORS + явный allow-list',
    ],
  },
  {
    id: 'sda-f9',
    question: 'Что такое session fixation?',
    answer:
      'Атака, в которой злоумышленник навязывает жертве заранее известный sessionId (через URL, поддоменную cookie, скрипт). После логина жертвы атакующий уже знает её идентификатор и заходит под её именем.',
    keyPoints: [
      'Главная защита — регенерация sessionId после логина и любой смены привилегий',
      'Не принимать sessionId из URL и параметров запроса',
      'HttpOnly + Secure cookie',
      'Привязывать сессию к IP/User-Agent для критичных действий',
      'Короткий TTL и обязательный logout',
    ],
  },
  {
    id: 'sda-f10',
    question: 'Что такое Content Security Policy (CSP)?',
    answer:
      'HTTP-заголовок, объявляющий браузеру список разрешённых источников ресурсов: скриптов, стилей, картинок, фреймов. Главная цель — снизить ущерб от XSS: даже найдя инъекцию, атакующий не сможет выполнить произвольный JS, если script-src не разрешает inline.',
    keyPoints: [
      'script-src \'self\' запрещает inline и сторонние скрипты',
      'nonce-XXX или sha256-... для разрешённых inline-блоков',
      'strict-dynamic + nonce — современная рекомендация',
      'report-uri / report-to для сбора нарушений',
      'CSP не лечит XSS, но превращает её из catastrophic в minor',
    ],
  },
  {
    id: 'sda-f11',
    question: 'Какой алгоритм использовать для хеширования паролей?',
    answer:
      'Современная рекомендация OWASP — argon2id (победитель PHC-2015). Допустимо bcrypt (до сих пор широко используется) и scrypt. Запрещены MD5, SHA-1, SHA-256/512 «голые» — они слишком быстры и уязвимы к brute-force на GPU.',
    keyPoints: [
      'argon2id: memory-hard, устойчив к GPU/ASIC и side-channel',
      'bcrypt: проверен временем, но ограничен 72 байтами входа',
      'scrypt: memory-hard, но менее распространён',
      'Соль (salt) обязательна и уникальна для каждого пароля',
      'Параметры подбираются так, чтобы один хеш считался ~250 мс',
    ],
  },
  {
    id: 'sda-f12',
    question: 'Что входит в JWT и как его проверить?',
    answer:
      'JWT состоит из трёх Base64URL-частей через точку: header (alg, typ), payload (claims) и signature. Сервер проверяет подпись с помощью симметричного секрета (HS256) или публичного ключа (RS256/ES256), затем валидирует exp, iss, aud.',
    keyPoints: [
      'header.payload.signature — три части через точку',
      'Стандартные claims: iss, sub, aud, exp, iat, nbf, jti',
      'HS256: общий секрет; RS256/ES256: пара ключей',
      'NEVER trust alg=none и не разрешайте смену alg клиентом',
      'Проверять exp всегда, аудиторию (aud) — почти всегда',
    ],
    code: `import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { sub: user.id, role: user.role },
  process.env.JWT_SECRET!,
  { algorithm: 'HS256', expiresIn: '15m', issuer: 'api.example.com' },
);

// На приёме:
const payload = jwt.verify(token, process.env.JWT_SECRET!, {
  algorithms: ['HS256'],
  issuer: 'api.example.com',
});`,
    codeLanguage: 'ts',
  },
  {
    id: 'sda-f13',
    question: 'Чем SameSite=Lax отличается от Strict и None?',
    answer:
      'Lax — современный дефолт: cookie не отправляется на кросс-сайтовые POST/PUT/DELETE, но прикрепляется при top-level GET-навигации (клик по ссылке). Strict жёстче — блокирует и GET-навигацию, что ломает SSO. None отключает защиту и требует Secure — нужен только для явных кросс-сайт интеграций.',
    keyPoints: [
      'Lax = дефолт Chrome с 2020',
      'Strict ломает «логин-через-ссылку»: пользователь приходит из почты — cookie не прикреплена',
      'None+Secure нужен для CDN-аутентификации и embed-виджетов',
      'SameSite не заменяет CSRF-токен полностью — есть обходные сценарии',
      'Cookie без SameSite в современных браузерах трактуется как Lax',
    ],
  },
  {
    id: 'sda-f14',
    question: 'Что произойдёт, если access-токен утечёт?',
    answer:
      'Злоумышленник получает права пользователя на всё время жизни токена (typical TTL 5–60 минут). Поэтому access-токены делают короткими; долгий доступ обеспечивает refresh-токен с rotation. После обнаружения утечки нужно отозвать сессию или весь family refresh-токенов и заставить пользователя залогиниться снова.',
    keyPoints: [
      'Короткий TTL (5–15 минут) — главный смягчающий фактор',
      'Refresh с rotation позволяет detect reuse и сразу отозвать',
      'Привязка токена к fingerprint (DPoP, mTLS) усложняет переиспользование',
      'JWT нельзя «отозвать» классически — нужен blacklist по jti или revoke endpoint',
      'Логирование IP/UA при выпуске помогает заметить аномалии',
    ],
  },
  {
    id: 'sda-f15',
    question: 'Что такое double-submit cookie против CSRF?',
    answer:
      'Стратегия защиты от CSRF без серверного состояния: сервер кладёт случайный токен и в cookie, и в DOM (или возвращает в JSON). Клиент дублирует значение в HTTP-заголовке (X-CSRF-Token); сервер сверяет cookie и заголовок. Атакующий с чужого origin не может прочитать cookie и подставить заголовок.',
    keyPoints: [
      'Не требует хранилища на сервере',
      'Cookie с токеном НЕ должна быть HttpOnly (клиенту нужно её прочитать)',
      'Подходит для SPA с собственным API',
      'Альтернатива: Synchronizer Token Pattern с серверным state',
      'В современных приложениях SameSite=Lax часто заменяет double-submit',
    ],
  },
];

// =============================================================================
// Lesson
// =============================================================================

export const sdAuthLesson: Lesson = {
  topicId: 'sd-auth',

  intro: {
    whyItMatters: `Аутентификация — единственная часть приложения, где ошибка превращает «баг» в утечку данных, угон аккаунтов и судебные иски. Именно поэтому здесь нет «сделаем потом» — безопасность закладывается при проектировании, а не прикручивается сверху.

На собеседовании этот блок — это серия обоснованных выборов. **Session или JWT?** Сессия хранится на сервере — её легко отозвать, но она не масштабируется без общего хранилища (Redis). JWT stateless — хорошо масштабируется, но отозвать досрочно сложно. **Где хранить токен?** HttpOnly cookie — скрипт на странице его не прочитает, значит XSS не страшен. localStorage — удобно, но любой JS на странице имеет доступ. **Какой OAuth flow?** Для SPA — Authorization Code + PKCE, устаревший Implicit flow небезопасен.

Второй слой — **модель угроз**: что именно атакуют и чем защищаться. XSS выполняет чужой JS в вашей странице — защита: Content Security Policy и HttpOnly cookie. CSRF заставляет браузер отправить запрос от имени пользователя на другой сайт — защита: SameSite cookie и CSRF-токены. Пароли нужно хранить через bcrypt или argon2id — не SHA-256, который взламывается за минуты на видеокарте.

По итогам урока вы сможете выбрать схему аутентификации под конкретный тип приложения, объяснить каждое решение через модель угроз и ответить на вопрос «что произойдёт, если токен утечёт?».`,
    estimatedMinutes: 45,
    interviewAngle:
      'Senior-интервьюер проверяет не определения, а способность держать в голове модель угроз и trade-off-ы. Сильный кандидат не зачитывает MDN, а формулирует: «для SPA-админки за логином — Authorization Code + PKCE, токен в HttpOnly cookie, SameSite=Lax, CSP с nonce, refresh с rotation, argon2id для паролей» — и объясняет, что произойдёт, если каждое из решений сломается.',
    prerequisites: [{ slug: 'js-network', title: 'Сеть: CORS, cookie, HTTP' }],
  },

  resources: {
    videos: [
      {
        source: 'youtube',
        id: 'UBUNrFtufWo',
        title: 'Session vs Token Authentication in 100 Seconds',
        channel: 'Fireship',
        language: 'en',
        durationSec: 2 * 60,
        description:
          'Сжатый обзор Fireship: ключевая разница между session и JWT за две минуты. Хороший «разогрев» перед глубоким погружением в OAuth и cookie-флаги.',
      },
      {
        source: 'youtube',
        id: '996OiexHze0',
        title: 'OAuth 2.0 and OpenID Connect (in plain English)',
        channel: 'OktaDev',
        language: 'en',
        durationSec: 60 * 60,
        description:
          'Лучший подробный разбор OAuth 2.0 и OIDC: роли, потоки, чем отличается access-токен от id_token, где место PKCE и refresh rotation. Ведущий — Nate Barbettini из Okta.',
      },
      {
        source: 'youtube',
        id: 'fyTxwIa-1U0',
        title: 'Session Vs JWT: The Differences You May Not Know!',
        channel: 'ByteByteGo',
        language: 'en',
        durationSec: 7 * 60,
        description:
          'ByteByteGo визуализирует ключевые различия session и JWT, обсуждает trade-off-ы при горизонтальном масштабировании и проблему отзыва токенов.',
      },
    ],
    links: [
      {
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html',
        title: 'OWASP Authentication Cheat Sheet',
        source: 'article',
        language: 'en',
        note: 'Каноническая шпаргалка OWASP: правила MFA, lockout, политики паролей, безопасное хранение, регенерация сессии.',
      },
      {
        url: 'https://oauth.net/2/',
        title: 'OAuth 2.0 — официальный портал',
        source: 'spec',
        language: 'en',
        note: 'Все RFC, диаграммы потоков, рекомендации BCP по выбору Authorization Code + PKCE и отказу от Implicit/Password.',
      },
      {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP',
        title: 'Content Security Policy — MDN',
        source: 'mdn',
        language: 'en',
        note: 'Подробный справочник по директивам CSP: script-src, nonce, hash, strict-dynamic, отчёты о нарушениях.',
      },
      {
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html',
        title: 'OWASP CSRF Prevention Cheat Sheet',
        source: 'article',
        language: 'en',
        note: 'Synchronizer Token, double-submit, SameSite, проверка Origin/Referer — со всеми нюансами по типам приложений.',
      },
      {
        url: 'https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/',
        title: 'Refresh Tokens: When to use them and how they interact with JWTs — Auth0',
        source: 'article',
        language: 'en',
        note: 'Подробный разбор refresh-token rotation, обнаружения переиспользования и тонкостей хранения refresh в SPA.',
      },
    ],
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
            'JWT кажется проще: не нужно хранилище сессий. Но нельзя инвалидировать до истечения TTL. Если токен украли — он валиден пока не истечёт. С сессиями достаточно удалить из Redis. На собеседовании этот трейдофф нужно озвучить: не просто назвать «что такое JWT», а объяснить когда сессия лучше и почему. Это отличает мидла от джуна.',
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
      flashcardIds: ['sda-f1', 'sda-f12'],
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
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/Cookies', title: 'Cookie — MDN (ru)' },
      video: {
        source: 'youtube',
        id: 'UBUNrFtufWo',
        title: 'Session vs Token Authentication in 100 Seconds',
        channel: 'Fireship',
        language: 'en',
        durationSec: 2 * 60,
        description: 'Ключевая разница между session и JWT за две минуты — хороший старт перед углублением в OAuth и cookie-флаги.',
      },
      links: [
        {
          url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html',
          title: 'OWASP Authentication Cheat Sheet',
          source: 'article',
          language: 'en',
          note: 'Каноническая шпаргалка OWASP: MFA, lockout, политики паролей, безопасное хранение, регенерация сессии.',
        },
      ],
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
      flashcardIds: ['sda-f2', 'sda-f13'],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/Cookies', title: 'Cookie — MDN (ru)' },
      video: {
        source: 'youtube',
        id: 'fyTxwIa-1U0',
        title: 'Session Vs JWT: The Differences You May Not Know!',
        channel: 'ByteByteGo',
        language: 'en',
        durationSec: 7 * 60,
        description: 'Визуализация ключевых различий session и JWT: trade-off-ы при масштабировании и проблема отзыва токенов.',
      },
      links: [
        {
          url: 'https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/',
          title: 'Refresh Tokens: When to use them — Auth0',
          source: 'article',
          language: 'en',
          note: 'Refresh-token rotation, обнаружение переиспользования и тонкости хранения refresh в SPA.',
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
      flashcardIds: ['sda-f3', 'sda-f4', 'sda-f5'],
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
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/Authentication', title: 'HTTP Авторизация — MDN (ru)' },
      video: {
        source: 'youtube',
        id: '996OiexHze0',
        title: 'OAuth 2.0 and OpenID Connect (in plain English)',
        channel: 'OktaDev',
        language: 'en',
        durationSec: 60 * 60,
        description: 'Лучший подробный разбор OAuth 2.0 и OIDC: роли, потоки, access-токен vs id_token, PKCE и refresh rotation.',
      },
      links: [
        {
          url: 'https://oauth.net/2/',
          title: 'OAuth 2.0 — официальный портал',
          source: 'spec',
          language: 'en',
          note: 'Все RFC, диаграммы потоков, рекомендации BCP по выбору Authorization Code + PKCE.',
        },
      ],
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
      flashcardIds: ['sda-f6', 'sda-f14'],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/Cookies', title: 'Cookie — MDN (ru)' },
      links: [
        {
          url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/Headers/Set-Cookie',
          title: 'Set-Cookie — MDN (ru)',
          source: 'mdn',
          language: 'ru',
          note: 'Хорошо структурированный разбор каждого флага Set-Cookie — с объяснением, что сломается, если его не указать.',
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
      flashcardIds: ['sda-f7', 'sda-f10'],
      checkpoint: [Q['sda-q11']!],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/Security/Types_of_attacks', title: 'Типы атак — MDN (ru)' },
      links: [
        {
          url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP',
          title: 'Content Security Policy — MDN',
          source: 'mdn',
          language: 'en',
          note: 'Нужно настроить CSP? Здесь все директивы с примерами — от базового script-src до strict-dynamic и nonce.',
        },
      ],
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
      flashcardIds: ['sda-f8', 'sda-f15'],
      checkpoint: [Q['sda-q4']!],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/Headers/Set-Cookie/SameSite', title: 'SameSite — MDN (ru)' },
      links: [
        {
          url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html',
          title: 'OWASP CSRF Prevention Cheat Sheet',
          source: 'article',
          language: 'en',
          note: 'Synchronizer Token, double-submit cookie, SameSite, проверка Origin/Referer — со всеми нюансами.',
        },
      ],
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
      flashcardIds: ['sda-f9', 'sda-f11'],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/Security', title: 'Безопасность веба — MDN (ru)' },
    },
  ],

  finalQuiz: quizQuestions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  flashcards,

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

  interviewQA: [
    {
      id: 'sda-iq1',
      question: 'В чём разница между JWT и серверной сессией? Когда что выбирать?',
      shortAnswer:
        'Сессия — stateful: сервер хранит state в Redis/БД, клиент носит sessionId. JWT — stateless: подписанный токен сам несёт payload, сервер проверяет подпись. Сессии удобны для гранулярного отзыва, JWT — для горизонтального масштабирования и межсервисной аутентификации.',
      fullAnswer: `Это базовый вопрос «на разогрев», но senior-уровень проверяется деталями trade-off-ов.

**Session.** Сервер генерирует короткий случайный sessionId, хранит маппинг sessionId → userId/state в Redis или БД. Клиент носит sessionId в HttpOnly cookie. Плюсы: моментальный отзыв (\`DELETE FROM sessions WHERE id = ?\`), небольшой размер cookie (~32 байта), легко добавить произвольный state. Минусы: при горизонтальном масштабировании нужен общий Redis (или sticky sessions), межсервисная аутентификация требует расшаривать стор.

**JWT.** Подписанный токен с payload. Сервер проверяет подпись (HS256/RS256/ES256) и валидирует claims (exp, iss, aud). Плюсы: stateless, идеален для микросервисов, единый формат для web/mobile, federated SSO через OIDC. Минусы: размер 200–1500 байт, отзыв до истечения exp требует blacklist по jti, легко переусложнить payload.

**Когда что.**
- Монолит + быстрый отзыв + сложный ACL → session.
- Микросервисы + межсервисный API + федерация → JWT (часто как id_token из OIDC).
- Нужны и тот и другой? Гибрид: на edge/API JWT (быстрая stateless проверка), внутри — обращение к session для актуальных прав.

**Антипаттерны.** Класть в JWT весь профиль с массивом ролей по 50 элементов; рассчитывать, что JWT можно «сразу выкинуть» при бане без revoke-механизма.`,
      followUps: [
        'Как реализовать отзыв JWT, если он stateless?',
        'Почему нельзя класть в JWT-payload секреты?',
        'Что делает алгоритм \`alg=none\` опасным и как защититься?',
      ],
      relatedChapterId: 'session-vs-jwt',
    },
    {
      id: 'sda-iq2',
      question: 'Где безопаснее всего хранить access-токен в SPA?',
      shortAnswer:
        'В HttpOnly + Secure + SameSite cookie. localStorage и sessionStorage уязвимы к XSS — один инъект ворует токены у всех пользователей. Современный паттерн: refresh в HttpOnly cookie, access — в памяти приложения.',
      fullAnswer: `У браузера три места под секрет: cookie, Web Storage, in-memory.

**HttpOnly cookie.** JS не может прочитать (\`document.cookie\` не возвращает HttpOnly), браузер сам прикрепляет к запросам на тот же origin. Единственная атака — CSRF, но она лечится SameSite=Lax + проверкой Origin или CSRF-токеном. Это дефолт.

**localStorage / sessionStorage.** Доступны любому скрипту. Один XSS-инъект (включая XSS из npm-зависимости через supply-chain) — и токены всех пользователей утекают на сервер атакующего. Никакой защиты, кроме «не допустить XSS», у localStorage нет.

**In-memory.** Переменная в JS-модуле или Redux store. XSS не вытащит её через document.cookie/localStorage, но JS-инъект всё равно может перехватить fetch и забрать токен. Зато токен теряется при F5 — это и плюс (короткое окно атаки), и минус (нужен механизм восстановления).

**Современный паттерн для SPA.**
- **Refresh-токен** → HttpOnly cookie на /auth/refresh с SameSite=Lax. Жив 7–30 дней, переживает перезагрузку, недоступен JS.
- **Access-токен** → in-memory переменная. Жив 5–15 минут. При старте приложения вызываем /auth/refresh и получаем свежий access.
- При утечке через XSS атакующий получит только access на минуты, а refresh останется недоступен.

**Антипаттерн.** Хранить и access, и refresh в localStorage «чтобы не делать запрос при F5». Это классическая ошибка из туториалов 2017 года; в 2024 — небезопасно.`,
      followUps: [
        'Как восстановить access-токен после F5, если он жил только в памяти?',
        'Почему cookie с HttpOnly не помогает против CSRF?',
        'Можно ли использовать Web Worker для изоляции токена от main thread?',
      ],
      relatedChapterId: 'token-storage',
    },
    {
      id: 'sda-iq3',
      question: 'Что такое refresh-token rotation и зачем она нужна?',
      shortAnswer:
        'Каждое использование refresh-токена выдаёт новый, старый помечается как использованный. Если кто-то предъявит уже использованный refresh — это сигнал утечки, и сервер отзывает всю «семью» refresh-токенов и заставляет пользователя залогиниться заново.',
      fullAnswer: `Refresh-токен живёт долго — недели или месяцы. Если он утечёт через XSS, supply-chain атаку или device theft, без rotation злоумышленник получает фактически бесконечный доступ к аккаунту.

**Как работает rotation.**
1. Сервер выдаёт refresh **RT1** при логине. Связывает с пользователем и идентификатором семьи (familyId).
2. Клиент использует RT1 → получает новый access **и новый RT2**, RT1 помечается как used.
3. Если кто-то снова придёт с RT1 — это **двойное использование**. Это значит, что либо RT1 был украден и злоумышленник его использовал раньше клиента, либо клиент после атакующего. В обоих случаях один из них имеет доступ к refresh.
4. Сервер отзывает **всю семью** (все refresh-токены с тем же familyId) и заставляет пользователя залогиниться заново.

**Что это даёт.**
- Утечка refresh превращается из «бесконечного доступа» в «один цикл refresh».
- Detection: легитимный клиент при попытке refresh обнаружит, что его токен уже использован → автоматический logout с алертом.
- Cовместимо с OAuth 2.0 BCP (RFC 6819 + draft-ietf-oauth-security-topics).

**Что не защищает.**
- От утечки access-токена в течение его TTL (защита — короткий TTL).
- Если злоумышленник украл и использовал RT1 раньше клиента, он получит RT2 и продолжит цепочку. Защита — DPoP/mTLS (sender-constrained tokens), привязка к fingerprint.

**Реализация.** Семьи refresh-токенов хранятся в БД: \`{ id, familyId, userId, used, revoked, createdAt }\`. На refresh: проверяем not used и not revoked, помечаем used, выдаём новый. На двойное использование: \`UPDATE refresh SET revoked=true WHERE familyId = ?\`.`,
      followUps: [
        'Как обнаружить и отреагировать на двойное использование refresh-токена?',
        'Почему привязка refresh к device fingerprint не всегда работает?',
        'Какой TTL выбрать для refresh: дни, недели, месяцы?',
      ],
      relatedChapterId: 'refresh-rotation',
    },
    {
      id: 'sda-iq4',
      question: 'Как защитить от XSS страницу с пользовательским контентом (UGC)?',
      shortAnswer:
        'Никогда не вставлять UGC через innerHTML без санитизации. Использовать textContent или React-рендер строк. Разрешённый HTML пропускать через DOMPurify. Включить Content Security Policy с nonce и запретом inline-скриптов. Дополнительно — Trusted Types в Chrome.',
      fullAnswer: `XSS на UGC — самая частая уязвимость в реальных проектах. Защита строится в несколько слоёв.

**Слой 1: безопасный рендер.**
- Текст без форматирования → \`textContent\` (DOM) или \`<div>{text}</div>\` (React). Никаких \`innerHTML\` / \`dangerouslySetInnerHTML\`.
- Разрешённый HTML (статья, форматированный комментарий) → санитизация через **DOMPurify**: \`DOMPurify.sanitize(html, { ALLOWED_TAGS: ['b', 'i', 'a', 'p', 'ul', 'li'] })\`. Whitelist подходов всегда строже blacklist.
- На сервере используйте **sanitize-html** (Node), **bleach** (Python), **ammonia** (Rust).

**Слой 2: Content Security Policy.**
- \`script-src 'self' 'nonce-XXX'\` — запрещает inline-скрипты и сторонние домены. nonce генерируется на каждый запрос и подставляется в \`<script nonce="XXX">\`.
- \`object-src 'none'\` — запрет Flash и embed.
- \`base-uri 'self'\` — защита от инъекции \`<base>\`.
- \`frame-ancestors 'none'\` — заменяет X-Frame-Options, защищает от clickjacking.
- \`report-uri /csp-report\` — собирайте нарушения в production.

**Слой 3: Trusted Types** (Chrome). Заставляют все DOM sink-функции (innerHTML, document.write, eval) принимать только специально оформленные TrustedHTML/TrustedScript. Любое нарушение — exception на этапе разработки.

**Слой 4: HTTP-заголовки.**
- \`X-Content-Type-Options: nosniff\` — запрет браузеру угадывать MIME.
- \`Referrer-Policy: strict-origin-when-cross-origin\` — не утекают полные URL.

**Слой 5: токены в HttpOnly cookie.** Даже если XSS произошёл, атакующий не сможет прочитать auth-токен. Это снижает критичность XSS с «угон аккаунта» до «действия от имени пользователя».

**Слой 6: code review и автоматика.** ESLint-плагины (eslint-plugin-react/no-danger), статический анализ (Semgrep), DAST в CI.`,
      followUps: [
        'Чем DOMPurify отличается от sanitize-html и какой выбрать?',
        'Как настроить CSP, не сломав React/Next.js?',
        'Что такое DOM-based XSS и как её обнаружить?',
      ],
      relatedChapterId: 'xss',
    },
    {
      id: 'sda-iq5',
      question: 'В чём разница между SameSite=Strict и SameSite=Lax? Когда что использовать?',
      shortAnswer:
        'Lax (современный дефолт) блокирует cookie на cross-site POST/PUT/DELETE, но прикрепляет на top-level GET-навигацию (клик по ссылке). Strict жёстче — блокирует и GET-навигацию, ломая «логин по ссылке из почты». None требует Secure и используется для embed/CDN.',
      fullAnswer: `**SameSite=Lax** — компромисс между удобством и безопасностью. Cookie не отправляется на cross-site небезопасные методы (POST, PUT, DELETE), но прикрепляется при top-level GET-навигации: пользователь кликает на ссылку в письме на ваш сайт — он залогинен. Достаточно для большинства SPA и серверных приложений. С 2020 — дефолт Chrome для cookie без явного SameSite.

**SameSite=Strict** — самый жёсткий вариант. Cookie не отправляется ни при каких cross-site запросах, **включая GET-навигацию**. Последствия:
- Пользователь приходит из почты по ссылке \`https://app.com/dashboard\` → он **не залогинен**, потому что cookie не прикрепилась к первому запросу. После одного редиректа на /login → /dashboard всё работает, но UX-ухудшение очевидно.
- SSO через redirect-цепочку требует адаптации.
- OAuth-callback может ломаться, если callback-cookie со state была Strict.

**Когда Strict оправдан.** Для cookie, доступ к которой нужен только из приложения и никогда — после внешнего перехода: API-токен админки, действия с финансами в банке, internal tools.

**SameSite=None; Secure** — отключает SameSite-защиту. Обязательно требует Secure (HTTPS). Используется только для **явных** cross-site интеграций: CDN-аутентификация, embed-виджеты (Stripe, Google Analytics), iframe-чекаут на чужом сайте. Без понимания, зачем нужен None, его ставить нельзя.

**Практический паттерн.**
- Auth-cookie SPA → Lax.
- Финансовые/админские действия → Strict + redirect через login на первой загрузке.
- Embed-виджет на чужом сайте → None + Secure + дополнительные защиты (origin allow-list, referrer проверка).`,
      followUps: [
        'Почему SameSite не полностью заменяет CSRF-токен?',
        'Как Strict ломает OAuth-флоу и как это обходят?',
        'Что произойдёт с cookie без атрибута SameSite в современных браузерах?',
      ],
      relatedChapterId: 'csrf',
    },
    {
      id: 'sda-iq6',
      question: 'Что произойдёт, если access-токен утечёт? Как минимизировать ущерб?',
      shortAnswer:
        'Атакующий получает права пользователя на оставшееся время жизни токена. Минимизация: короткий TTL (5–15 минут), refresh с rotation, привязка к fingerprint (DPoP/mTLS), мониторинг аномалий, blacklist по jti для критичных операций.',
      fullAnswer: `Утечка access-токена — реальный сценарий: XSS, перехват прокси, supply-chain атака, скомпрометированное устройство.

**Что может атакующий.** Действовать от имени пользователя на API на время, оставшееся до \`exp\`. Если токен хранил роли в payload — атакующий имеет ровно эти роли. Если права хранились на сервере — атакующий имеет права, актуальные на момент проверки.

**Слои защиты.**

1. **Короткий TTL** (5–15 минут). Главный смягчающий фактор: окно атаки минимальное. Платой служит частый refresh.
2. **Refresh-токен с rotation** (см. iq3). Если вместе с access утёк refresh — двойное использование запустит revoke семьи.
3. **Sender-constrained tokens** (DPoP, mTLS). Токен валиден только в связке с приватным ключом клиента. Утечка одного токена бесполезна без ключа.
4. **Мониторинг аномалий.** Логируйте IP, User-Agent, geo при каждом использовании токена. Внезапная смена страны → принудительный logout, MFA-челлендж.
5. **Blacklist по jti** для критичных операций. JWT редко отзывают «вообще», но для финансовых операций можно проверять blacklist при каждом запросе.
6. **Step-up authentication.** Для операций с риском (смена пароля, перевод денег) требуйте свежую аутентификацию (re-login или WebAuthn) — даже валидный токен не пройдёт.
7. **Revoke endpoint.** OIDC RFC 7009 определяет /revoke; используйте при logout, чтобы инвалидировать refresh-семью на сервере.

**Что делать пользователю при подозрении на утечку.** Logout всех сессий (нужен endpoint, который очищает Redis-сессии или revoke-ит все refresh-семьи), смена пароля, проверка журнала входов. Сильная админка должна показывать список активных сессий.

**Системно.** Метрики авторизации: соотношение refresh/access, всплески ошибок 401, gauge активных refresh-семей. Алерты на двойное использование refresh — это **inцидент**, не тривиальная ошибка.`,
      followUps: [
        'Что такое DPoP и как он привязывает токен к устройству?',
        'Чем step-up authentication отличается от обычного re-login?',
        'Как обнаружить compromise по логам и метрикам?',
      ],
      relatedChapterId: 'refresh-rotation',
    },
    {
      id: 'sda-iq7',
      question: 'Расскажите про OAuth 2.0 Authorization Code Flow с PKCE. Зачем PKCE для SPA?',
      shortAnswer:
        'Authorization Code Flow: SPA редиректит на /authorize, получает code, меняет его на токены через /token. PKCE добавляет code_verifier (случайный) и code_challenge=SHA256(verifier): даже если код перехвачен, без verifier его не обменять. Это защита публичных клиентов.',
      fullAnswer: `**Authorization Code Flow** — основной поток OAuth 2.0 для веб-приложений.

1. SPA редиректит пользователя на \`/authorize\` провайдера с client_id, redirect_uri, scope, state.
2. Пользователь логинится у провайдера и подтверждает разрешения.
3. Провайдер редиректит обратно на redirect_uri с **authorization code** — короткоживущим (~10 минут) одноразовым кодом.
4. SPA меняет code на токены через POST /token: code, redirect_uri, client_id (для конфиденциальных клиентов — client_secret).
5. Получает access_token, refresh_token (опц.), id_token (если scope=openid).

**Проблема для SPA.** SPA — публичный клиент: у него нет места хранить client_secret (всё в JS-бандле, который видит любой). Без client_secret authorization code сам по себе не защищён — если кто-то перехватит redirect (через нечистую сеть, malware, неправильно настроенный nginx), он сможет обменять код на токены.

**PKCE (Proof Key for Code Exchange, RFC 7636) — решение.**
1. Перед редиректом SPA генерирует **code_verifier** — случайные 43–128 байт. Хранит в sessionStorage.
2. Считает **code_challenge** = Base64URL(SHA256(verifier)). Шлёт challenge на /authorize.
3. После получения code SPA шлёт на /token не только code, но и оригинальный verifier.
4. Сервер сверяет SHA256(verifier) == challenge. Без знания verifier обмен кода невозможен.

**Что это даёт.**
- Перехваченный authorization code бесполезен — атакующий не знает verifier.
- Не нужен client_secret в JS-коде.
- Современный стандарт (с 2020) для всех публичных клиентов и рекомендация для всех клиентов вообще.

**Что заменяет PKCE.**
- **Implicit Flow** (response_type=token): токен возвращался в URL-фрагменте при редиректе. Уязвим (логи, история, popup-перехват). Официально устарел.
- **Resource Owner Password Credentials**: пароль шёл на client → authorization server. Устарел; нарушает делегирование.

**Тонкости.**
- state — случайная строка для защиты от CSRF на callback. Сравните с тем, что отправили.
- nonce (для OIDC) — связывает id_token с конкретной сессией браузера.
- Используйте библиотеки (oidc-client-ts, oauth4webapi), не пишите PKCE с нуля.`,
      followUps: [
        'Чем PKCE-флоу для конфиденциальных клиентов отличается от публичных?',
        'Что такое state и nonce в OAuth/OIDC и какие атаки они защищают?',
        'Можно ли использовать PKCE без редиректа (через popup или iframe)?',
      ],
      relatedChapterId: 'oauth-oidc',
    },
  ],

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
