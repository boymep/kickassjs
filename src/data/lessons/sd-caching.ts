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
    id: 'sdc-q1',
    description:
      'На каком уровне ниже всего расположен кеш и какой компромисс он даёт?',
    code: `// Цепочка запроса:
// Browser → Service Worker → CDN edge → Reverse proxy → App → DB
//   ↑ ближе к пользователю              дальше от пользователя ↓`,
    options: [
      'Browser cache — самый медленный, потому что лежит на диске пользователя',
      'Browser cache — самый быстрый и дешёвый: 0 RTT, но изолирован для одного пользователя',
      'CDN edge ближе к пользователю, чем browser cache',
      'DB cache (буферный пул) лежит ближе к пользователю, чем reverse proxy',
    ],
    correctIndex: 1,
    explanation:
      'Browser cache (HTTP-кеш и Service Worker Cache Storage) — самый «дешёвый» уровень: 0 RTT, никаких сетевых запросов. Платой служит изоляция: попадание в кеш получает только тот же пользователь на том же устройстве. CDN расширяет охват на всех пользователей региона, но добавляет один сетевой хоп.',
  },
  {
    type: 'fill-blank',
    id: 'sdc-q2',
    description:
      'Допишите директиву Cache-Control, которая говорит CDN кешировать ответ на год, а браузеру — обновлять при каждом запросе.',
    codeWithBlanks: `Cache-Control: __BLANK__, max-age=0, s-maxage=31536000, immutable`,
    options: ['public', 'private', 'no-store', 'must-revalidate'],
    correctIndex: 0,
    explanation:
      'public разрешает shared-кешам (CDN, reverse proxy) сохранять ответ. max-age=0 означает «браузер должен ревалидировать при каждом запросе», а s-maxage=31536000 — «CDN кеширует на год». Это типовой паттерн для статики с хешами в имени.',
  },
  {
    type: 'output',
    id: 'sdc-q3',
    description: 'Что произойдёт при таком обмене заголовками?',
    code: `// Запрос:
GET /avatar.png HTTP/1.1
If-None-Match: "v3-abc123"

// Ответ сервера:
HTTP/1.1 304 Not Modified
ETag: "v3-abc123"
Cache-Control: max-age=0, must-revalidate`,
    options: [
      'Сервер вернул новое тело файла, кеш браузера обновился',
      'Сервер подтвердил, что версия в кеше актуальна, тело не передавалось — браузер использует локальную копию',
      'Браузер удалил локальную копию, потому что ETag не совпал',
      'Это ошибка протокола: 304 не должен содержать ETag',
    ],
    correctIndex: 1,
    explanation:
      '304 Not Modified — это conditional GET с попаданием. Сервер не передаёт тело (экономия трафика), а браузер достаёт сохранённую версию из кеша. ETag в ответе разрешён и используется для следующей ревалидации.',
  },
  {
    type: 'output',
    id: 'sdc-q4',
    description: 'Что делает заголовок stale-while-revalidate=60 в этом ответе?',
    code: `Cache-Control: max-age=10, stale-while-revalidate=60`,
    options: [
      'Запрещает использовать устаревший ответ; через 10 секунд кеш должен быть очищен',
      'В первые 10 секунд ответ считается свежим; следующие 60 секунд — устаревший ответ отдаётся мгновенно, а в фоне идёт ревалидация',
      'Ответ кешируется ровно на 60 секунд, max-age игнорируется',
      'stale-while-revalidate работает только в Service Worker и игнорируется браузером',
    ],
    correctIndex: 1,
    explanation:
      'SWR (RFC 5861) разделяет жизнь ответа на три фазы: fresh (max-age) → stale-but-usable (window stale-while-revalidate) → expired. В stale-фазе браузер/CDN мгновенно отдаёт старый ответ и параллельно делает фоновый запрос за свежим. Идеально для контента, где «немного устаревшее» допустимо.',
  },
  {
    type: 'fill-blank',
    id: 'sdc-q5',
    description:
      'Какая стратегия описана: приложение читает из кеша, при промахе идёт в БД, кладёт результат в кеш и возвращает его.',
    codeWithBlanks: `async function get(id) {
  let v = await cache.get(id);
  if (v) return v;             // hit
  v = await db.findById(id);    // miss
  await cache.set(id, v, 60);
  return v;
}
// Это паттерн: __BLANK__`,
    options: ['write-through', 'write-behind', 'cache-aside (lazy loading)', 'read-through proxy'],
    correctIndex: 2,
    explanation:
      'Cache-aside (он же lazy loading) — самая популярная стратегия: приложение явно управляет кешем, БД остаётся источником истины. Записи идут в БД, кеш либо протухает по TTL, либо инвалидируется явно. Минусы: первый запрос всегда промах, возможна рассинхронизация при гонках.',
  },
  {
    type: 'output',
    id: 'sdc-q6',
    description: 'В чём разница между write-through и write-behind?',
    code: `// write-through:
async function set(k, v) {
  await cache.set(k, v);
  await db.set(k, v);   // синхронно
}

// write-behind (write-back):
async function set(k, v) {
  await cache.set(k, v);
  queue.push({ k, v }); // в БД позже, асинхронно
}`,
    options: [
      'Это синонимы: одна и та же стратегия с разными названиями',
      'write-through синхронно пишет в БД (надёжно, но медленнее), write-behind откладывает запись (быстрее, но риск потери)',
      'write-through пишет только в кеш, БД не обновляется',
      'write-behind работает только с Redis, write-through — с Memcached',
    ],
    correctIndex: 1,
    explanation:
      'write-through: запись в кеш и БД одной транзакцией — гарантированная консистентность ценой латентности. write-behind: запись в кеш сразу, в БД через очередь/буфер — высокая пропускная способность, но при падении узла можно потерять последние изменения. Выбор зависит от требований к durability.',
  },
  {
    type: 'fill-blank',
    id: 'sdc-q7',
    description:
      'Какую структуру данных и политику вытеснения часто используют для in-memory кеша с ограниченным размером?',
    codeWithBlanks: `// Map + двусвязный список → O(1) get/set, при переполнении вытесняем
// тот элемент, к которому давно не обращались. Это политика __BLANK__.`,
    options: ['FIFO', 'LRU (Least Recently Used)', 'LFU (Least Frequently Used)', 'random'],
    correctIndex: 1,
    explanation:
      'LRU — стандарт для горячих in-memory кешей: при доступе элемент перемещается в head, при переполнении выбрасывается tail. Реализуется на Map + двусвязном списке за O(1). LFU вытесняет редко используемые, FIFO — самые старые, у каждой стратегии свои плюсы.',
  },
  {
    type: 'output',
    id: 'sdc-q8',
    description: 'Что произойдёт при запросе авторизованной страницы с таким ответом?',
    code: `Cache-Control: private, max-age=300
Set-Cookie: session=...; HttpOnly`,
    options: [
      'CDN закеширует ответ и отдаст его всем пользователям с одинаковой сессией',
      'Браузер закеширует ответ для текущего пользователя, CDN/proxy кешировать НЕ будут',
      'Ответ нельзя кешировать вообще из-за Set-Cookie',
      'private игнорируется, если установлен Set-Cookie',
    ],
    correctIndex: 1,
    explanation:
      'private говорит shared-кешам (CDN, корпоративный proxy) НЕ хранить ответ; кешировать может только браузер конкретного пользователя. Это правильный режим для персонализированного контента. Если бы стояло public — CDN мог бы отдать чужую сессию другому пользователю.',
  },
  {
    type: 'output',
    id: 'sdc-q9',
    description: 'Что такое thundering herd и как с ним борется stale-while-revalidate?',
    code: `// 10 000 одновременных запросов попадают в момент,
// когда популярная страница только что протухла в кеше.
// Все они идут в origin одновременно.`,
    options: [
      'Это нормальная работа кеша, никаких проблем',
      'Лавина запросов в origin при истечении TTL популярного ключа; SWR смягчает её, отдавая stale-ответ всем, пока один фоновый запрос обновляет кеш',
      'Это ошибка только в Redis, не во всех кешах',
      'Решается единственным способом — отключением кеша',
    ],
    correctIndex: 1,
    explanation:
      'Thundering herd (он же cache stampede) — основной источник падений origin при горячем кеше. Решения: stale-while-revalidate, single-flight (request coalescing), random TTL jitter, заблаговременная фоновая ревалидация (refresh-ahead).',
  },
  {
    type: 'complexity',
    id: 'sdc-q10',
    description: 'Какова сложность операций в правильно реализованном LRU-кеше на Map + двусвязном списке?',
    code: `cache.get(key)   // лукап + перемещение в head
cache.set(key, v) // вставка/обновление + возможное вытеснение tail`,
    options: [
      'O(log n) get и O(log n) set',
      'O(1) get и O(1) set — все операции с указателями списка и хеш-таблицей',
      'O(n) для get, O(1) для set',
      'O(1) get, но O(n) для set из-за линейного поиска свободного места',
    ],
    correctIndex: 1,
    explanation:
      'Каждый узел списка хранится в Map по ключу — лукап O(1). Перемещение узла в head — это четыре операции с указателями, O(1). Вставка нового — O(1), при переполнении выбрасывается tail (тоже O(1)). Это даёт LRU свою репутацию «дефолтной» политики.',
  },
];

const Q = Object.fromEntries(quizQuestions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set(['sdc-q1', 'sdc-q3', 'sdc-q5', 'sdc-q9']);


// =============================================================================
// Lesson
// =============================================================================

export const sdCachingLesson: Lesson = {
  topicId: 'sd-caching',

  intro: {
    whyItMatters: `Кеширование — один из самых дешёвых способов ускорить систему. Правильно настроенный кеш сокращает p99 латентности на порядок и снимает большую часть нагрузки с origin. В веб-стеке кеш живёт на пяти уровнях: браузер, CDN edge, reverse proxy, application cache (LRU, Redis), database cache.

Главный язык кеширования — HTTP-заголовки \`Cache-Control\`, \`ETag\`, \`Last-Modified\`, \`Vary\`. На сервере и в приложениях работают паттерны cache-aside, write-through, stale-while-revalidate. Самое сложное — инвалидация: на собеседовании по System Design проверяют понимание trade-off между свежестью данных, нагрузкой и сложностью инвалидации.`,
    estimatedMinutes: 35,
    interviewAngle:
      'Интервьюера интересует понимание trade-off: где уместен каждый уровень кеша, как инвалидировать без простоя, как защититься от thundering herd, и когда кеширование принесёт больше вреда, чем пользы.',
    prerequisites: [],
  },


  chapters: [
    {
      id: 'cache-layers',
      title: 'Уровни кеша в веб-стеке',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'Кеш — это не одна сущность, а целая иерархия слоёв, расположенных между пользователем и базой данных. Чем ближе слой к пользователю, тем дешевле и быстрее ответ, но тем уже его охват — каждый уровень обслуживает разное число клиентов и имеет разную стоимость инвалидации.',
        },
        {
          type: 'text',
          content:
            'Аналогия: вы помните часто используемые номера наизусть (браузер-кеш), другие — в телефоне (CDN), редкие — в записной книжке (база). Запрос останавливается при первом попадании в кеш. На System Design интервью кеш — одна из первых вещей которую стоит упомянуть при оптимизации. Правило большого пальца: кешируй на самом верхнем безопасном уровне.',
        },
        {
          type: 'list',
          content: `- **Browser cache** — HTTP-кеш и Service Worker Cache Storage. 0 RTT, изолирован на одного пользователя.
- **CDN edge** — PoP-узлы по всему миру (Cloudflare, Fastly, Vercel). 30–80 мс TTFB, общий на регион.
- **Reverse proxy** — Varnish, Nginx, HAProxy перед origin. Снимает нагрузку с приложения.
- **Application cache** — in-memory LRU в процессе или распределённый Redis/Memcached.
- **Database cache** — буферный пул PostgreSQL/InnoDB, query cache, materialized views.`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Правило большого пальца: всегда кешируйте на самом верхнем (ближайшем к пользователю) уровне, на котором это безопасно. Запрос, обработанный CDN, дешевле, чем запрос в Redis; запрос в Redis дешевле, чем в БД.',
        },
        { type: 'heading', content: 'Стоимость промаха на каждом уровне' },
        {
          type: 'code',
          language: 'text',
          content: `Browser cache hit       :   0 ms      (нет сетевого запроса)
CDN edge hit            :  30–80 ms  (RTT до ближайшего PoP)
Reverse proxy hit       : 50–150 ms  (RTT до DC + memory lookup)
App in-memory hit       : 50–200 ms  (RTT до DC + микросекунды на lookup)
Redis hit               : 50–200 ms  (RTT до DC + 1 ms на network в DC)
Database (cold)         : 100–500+ ms (зависит от запроса и индексов)
Origin recompute        :  секунды   (полный SSR + БД)`,
        },
        { type: 'heading', content: 'Coverage vs proximity' },
        {
          type: 'text',
          content:
            'Browser cache мгновенный, но обслуживает только одного пользователя. CDN покрывает весь регион, но добавляет сетевой хоп. Application cache виден только инстансу приложения; Redis расширяет его до кластера. На дизайне выбирайте уровень исходя из того, кому одинаковый ответ полезен — одному пользователю, всему региону или всем сразу.',
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Антипаттерн: кешировать «на всякий случай везде». Каждый уровень добавляет ещё один источник stale-данных и точку отказа при инвалидации. Сначала спросите себя, нужен ли кеш на этом уровне; затем рассчитайте hit ratio.',
        },
      ],
      checkpoint: [Q['sdc-q1']!, {
        type: 'ordering',
        id: 'sdc-ord1',
        description: 'Расставь уровни кеш-иерархии от ближайшего к пользователю к самому удалённому',
        items: [
          'Browser cache (localStorage, Memory cache)',
          'Service Worker cache',
          'CDN / Edge cache',
          'Reverse proxy cache (Nginx, Varnish)',
          'Application cache (Redis, Memcached)',
          'Database query cache',
          'Origin server (источник данных)',
        ],
        explanation: 'Чем ближе кеш к пользователю — тем меньше latency. Browser cache — самый быстрый (0 сетевых запросов). CDN — кеш на ближайшем к пользователю PoP. Redis — кеш на уровне приложения перед БД.',
      }],
    },

    {
      id: 'http-headers',
      title: 'HTTP-заголовки: Cache-Control, ETag, Vary',
      estimatedMinutes: 9,
      blocks: [
        {
          type: 'text',
          content:
            'HTTP-заголовки — это язык, на котором сервер говорит браузеру и CDN: «этот ответ можно кешировать на год» или «никогда не сохраняй это». Без правильных заголовков браузер не знает, что и как долго держать в кеше, и либо кеширует слишком агрессивно, либо не кеширует вообще. Знание деталей этих заголовков напрямую влияет на производительность и стоимость инфраструктуры.',
        },
        {
          type: 'text',
          content:
            'Частая ловушка: разработчик добавляет `Cache-Control: no-cache`, считая это командой «никогда не кешировать». На самом деле `no-cache` означает «кешируй, но всегда ревалидируй». Полный запрет на кеширование — это `no-store`. Этот вопрос на собеседовании по кешированию задают часто — он показывает, действительно ли кандидат разбирался со спецификацией.',
        },
        { type: 'heading', content: 'Cache-Control — главный заголовок' },
        {
          type: 'text',
          content:
            'Cache-Control управляет поведением всех кешей в цепочке: браузера, CDN, reverse proxy. Его директивы делятся на три группы: про **свежесть** (max-age, s-maxage), про **разрешения** (public, private, no-store), про **ревалидацию** (no-cache, must-revalidate, immutable, stale-while-revalidate).',
        },
        {
          type: 'code',
          language: 'http',
          content: `// Статика с хешем в имени файла (app.abc123.js)
Cache-Control: public, max-age=31536000, immutable
// public — можно всем кешам; max-age — год; immutable — не ревалидировать.

// HTML главной страницы
Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=86400
// max-age=0 — браузер всегда ревалидирует
// s-maxage=60 — CDN кеширует на 60 с
// stale-while-revalidate=86400 — сутки можно отдавать stale + фоновый refresh

// Авторизованная страница
Cache-Control: private, max-age=0, must-revalidate
// private — только браузеру пользователя; must-revalidate — обязательно проверить.

// Категорический запрет
Cache-Control: no-store
// Не сохранять нигде. Используется для платежей и секретных данных.`,
        },
        { type: 'heading', content: 'ETag и Last-Modified — условные запросы' },
        {
          type: 'text',
          content:
            'Когда max-age истекает, браузер не обязательно скачивает ответ заново. Он отправляет **условный запрос** с заголовком If-None-Match (по ETag) или If-Modified-Since (по Last-Modified). Если ничего не изменилось, сервер отвечает `304 Not Modified` без тела, и браузер использует свою копию.',
        },
        {
          type: 'code',
          language: 'http',
          content: `// Первичный ответ:
HTTP/1.1 200 OK
ETag: "v3-abc123"
Last-Modified: Tue, 09 Apr 2024 10:00:00 GMT
Cache-Control: max-age=0, must-revalidate

// Через час браузер делает условный запрос:
GET /avatar.png HTTP/1.1
If-None-Match: "v3-abc123"

// Сервер видит совпадение и отвечает:
HTTP/1.1 304 Not Modified
ETag: "v3-abc123"
// Тело не передаётся — экономия трафика.`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'ETag точнее Last-Modified: распознаёт изменения внутри секунды, не зависит от touch/rsync. Last-Modified проще: его можно вычислить из mtime файла без хеширования. На статике используют ETag из хеша содержимого, на динамике — комбинацию обоих.',
        },
        { type: 'heading', content: 'Vary — вариативность кеша' },
        {
          type: 'text',
          content:
            'Заголовок Vary говорит кешу, что один URL может возвращать разные ответы в зависимости от заголовков запроса. Например, `Vary: Accept-Encoding` означает «храни отдельные копии для gzip, brotli и identity». Без Vary кеш отдаст всем пользователям одну версию, что особенно опасно при `Vary: Cookie` или языковой локализации.',
        },
        {
          type: 'code',
          language: 'http',
          content: `Vary: Accept-Encoding, Accept-Language
// CDN хранит до 9 копий: 3 кодировки × 3 локали.

// 🔴 Антипаттерн:
Vary: User-Agent
// Размывает кеш до бесполезного: каждое устройство — свой ключ.

// 🔴 Опасно:
Vary: Cookie
// Каждая сессия → свой ключ. Эффективный hit ratio ≈ 0.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'CDN-провайдеры часто игнорируют Vary и используют собственный механизм cache key (например, явное перечисление заголовков в правилах). Перед продакшеном обязательно проверьте, как ваш CDN интерпретирует Vary.',
        },
      ],
      checkpoint: [Q['sdc-q3']!, {
        type: 'match-pairs',
        id: 'sdc-mp1',
        description: 'Сопоставь HTTP заголовок с его поведением',
        pairs: [
          { left: 'Cache-Control: no-store', right: 'Не кешировать вообще, каждый раз запрос к серверу' },
          { left: 'Cache-Control: max-age=3600', right: 'Кешировать на 1 час без проверки сервера' },
          { left: 'ETag', right: 'Fingerprint ресурса для conditional requests' },
          { left: 'Cache-Control: stale-while-revalidate', right: 'Отдать кеш, фоном обновить' },
        ],
        explanation: 'ETag + If-None-Match — conditional request: сервер вернёт 304 Not Modified если ресурс не изменился, экономя трафик. stale-while-revalidate — современный паттерн: пользователь не ждёт, кеш обновляется в фоне.',
      }],
    },

    {
      id: 'cdn-edge',
      title: 'CDN и edge-кеш',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'CDN — это распределённая сеть PoP-узлов (Points of Presence) по всему миру, которые кешируют ответы origin и отдают их ближайшим пользователям. Запрос из Сингапура попадает в сингапурский PoP, не в франкфуртский origin — TTFB сокращается с сотен миллисекунд до десятков.',
        },
        {
          type: 'text',
          content:
            'Главный вопрос про CDN на интервью: как инвалидировать кеш? Три подхода: ждать истечения TTL (простой, но данные могут устареть), явный purge через API (быстрый, но дорогой при full purge), versioned URLs с immutable (надёжный — старый URL никуда не девается, новый получает новый контент). На production обычно комбинируют: статика — versioned URLs, HTML — короткий s-maxage плюс purge по тегу из вебхука.',
        },
        {
          type: 'list',
          content: `- **Cache key** = метод запроса + URL + перечисленные Vary-заголовки.
- **TTL** управляется s-maxage или собственными правилами CDN (Page Rules, Cache Rules).
- **Cache hit ratio** — главная метрика. Цель: >95% для статики, 70–90% для HTML.
- **Origin shield** — промежуточный слой, который агрегирует промахи всех PoP в один запрос к origin.
- **Edge functions** (Cloudflare Workers, Vercel Edge) превращают PoP в программируемый прокси.`,
        },
        { type: 'heading', content: 'Инвалидация CDN' },
        {
          type: 'text',
          content:
            'Главная боль CDN — инвалидация. Три способа: естественное протухание по TTL, явный purge (по URL, по тегу, full purge), versioned URLs (новое имя файла = новый ключ кеша). На практике комбинируют: статика — versioned URLs + immutable (никогда не инвалидируется), HTML — короткий s-maxage + purge по тегу из webhook.',
        },
        {
          type: 'code',
          language: 'typescript',
          content: `// Cache tags на Vercel: тегируем ответ при выдаче
fetch('https://api.com/posts', { next: { tags: ['posts'] } });

// При обновлении CMS вызываем webhook → Next.js API:
import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  const { tag, secret } = await req.json();
  if (secret !== process.env.SECRET) return new Response('Unauthorized', { status: 401 });
  revalidateTag(tag); // инвалидация по тегу за миллисекунды
  return Response.json({ ok: true });
}

// Cloudflare: то же самое через Cache-Tag заголовок
// Origin-ответ:
//   Cache-Tag: posts, post-123
// Purge:
//   curl -X POST .../purge_cache -d '{"tags":["posts"]}'`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Full purge — последняя надежда: дорого, медленно (минуты), вызывает thundering herd на origin. На production используется только в авариях. Грамотная архитектура — versioned URLs + cache tags.',
        },
        { type: 'heading', content: 'Когда CDN не помогает' },
        {
          type: 'list',
          content: `- Авторизованный контент с **Cache-Control: private** — CDN его не сохраняет.
- Запросы с заголовком **Authorization** — большинство CDN автоматически их пропускают.
- POST/PUT/DELETE — не кешируются по умолчанию.
- Динамические ответы с уникальным контентом для каждого пользователя.
- Чекаут, личный кабинет, приватные данные.`,
        },
      ],
    },

    {
      id: 'service-worker',
      title: 'Service Worker как программируемый прокси',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'Service Worker — отдельный JS-поток в браузере, который перехватывает все fetch-запросы со страницы. Внутри обработчика fetch вы пишете произвольную логику: посмотреть в Cache Storage, сходить в сеть, скомбинировать оба источника, вернуть offline-fallback. Это даёт офлайн-режим (PWA), агрессивное кеширование ассетов и тонкий контроль над политикой.',
        },
        {
          type: 'text',
          content:
            'Важный нюанс: Cache Storage в Service Worker — это отдельное хранилище от обычного HTTP-кеша браузера. Они не пересекаются. Это значит SW может кешировать что угодно по своей логике, игнорируя Cache-Control сервера. Ловушка для новичков: SW не работает без HTTPS (кроме localhost). И ещё — обновление SW файла требует явной стратегии: старый воркер продолжает работать до закрытия всех вкладок.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Регистрация SW
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// sw.js — стратегия cache-first для статики
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('v1').then((c) =>
      c.addAll(['/', '/app.js', '/styles.css', '/offline.html'])
    )
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});`,
        },
        { type: 'heading', content: 'Стратегии кеширования' },
        {
          type: 'list',
          content: `- **cache-first** — сначала кеш, при промахе сеть. Для статики и шрифтов.
- **network-first** — сначала сеть, при ошибке кеш. Для часто меняющегося HTML.
- **stale-while-revalidate** — отдаём кеш мгновенно, в фоне обновляем. Для лент и фидов.
- **network-only** — только сеть. Для платежей и приватных данных.
- **cache-only** — только кеш. Для офлайн-приложений с заранее загруженным контентом.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// stale-while-revalidate в Service Worker
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.open('v1').then(async (cache) => {
      const cached = await cache.match(e.request);
      const networkPromise = fetch(e.request).then((res) => {
        cache.put(e.request, res.clone());
        return res;
      });
      return cached || networkPromise;
      // Если кеш есть — мгновенный ответ; в фоне сеть обновит кеш.
    })
  );
});`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Cache Storage в Service Worker — отдельное хранилище от обычного HTTP-кеша браузера. Они не пересекаются: SW сохраняет ответ в свой Cache Storage, HTTP-кеш браузера — в свою область. Это позволяет SW реализовать любую стратегию независимо от Cache-Control сервера.',
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Workbox от Google — стандартная библиотека-обёртка над Service Worker API. Она даёт декларативные роуты, готовые стратегии и удобную инвалидацию. На production почти никто не пишет SW с нуля — все используют Workbox.',
        },
      ],
      playground: {
        starterCode: `// Реализуйте простой stale-while-revalidate.
// При hit возвращаем cached сразу; при miss — fetch.
// В обоих случаях обновляем кеш свежим ответом.
async function swr(cache, request) {
  const cached = /* достать из cache */ null;
  const network = /* fetch + put в cache */ null;
  return /* что вернуть пользователю */ null;
}

console.log('SWR реализован: ' + (typeof swr === 'function'));`,
        expectedOutput: 'SWR реализован: true',
        description:
          'Простая проверка, что функция объявлена. Реальный SWR — это короткий, но коварный фрагмент: важно вернуть cached, не дожидаясь network, но всё равно запустить fetch для обновления.',
      },
    },

    {
      id: 'app-cache',
      title: 'Application cache: in-memory LRU и Redis',
      estimatedMinutes: 8,
      blocks: [
        {
          type: 'text',
          content:
            'Application-уровень — самый гибкий: вы сами решаете, что кешировать, как ключевать, когда инвалидировать. Два основных формата: in-process LRU (внутри Node.js, быстрый, но локальный для инстанса) и распределённый кеш (Redis, Memcached) — общий на весь кластер, чуть медленнее, но консистентный.',
        },
        {
          type: 'text',
          content:
            'Частая ловушка при масштабировании: in-memory LRU кеш в Node.js виден только одному инстансу. При запуске двух подов каждый держит свой кеш — инвалидация в одном не затрагивает другой. Данные рассинхронизируются. Если у вас несколько инстансов — нужен Redis. На интервью этот нюанс проверяют: «что произойдёт с кешем если вы запустите приложение на трёх серверах?»',
        },
        { type: 'heading', content: 'In-memory LRU' },
        {
          type: 'code',
          language: 'typescript',
          content: `// node lru-cache — каноническая реализация
import { LRUCache } from 'lru-cache';

const cache = new LRUCache<string, User>({
  max: 10_000,           // максимум ключей
  ttl: 1000 * 60 * 5,    // 5 минут
  updateAgeOnGet: false, // refresh TTL при каждом get? обычно false
});

async function getUser(id: string) {
  const cached = cache.get(id);
  if (cached) return cached;
  const user = await db.users.findById(id);
  cache.set(id, user);
  return user;
}`,
        },
        { type: 'heading', content: 'Политики вытеснения' },
        {
          type: 'list',
          content: `- **LRU (Least Recently Used)** — выбрасываем элемент, к которому давно не обращались. Дефолт.
- **LFU (Least Frequently Used)** — выбрасываем элемент с наименьшим числом обращений.
- **FIFO** — самый старый по времени вставки. Простой, но плохо для горячих ключей.
- **Random** — случайный. Используется в Redis с maxmemory-policy allkeys-random.
- **W-TinyLFU (Caffeine)** — современный гибрид LRU + LFU с probabilistic counters.`,
        },
        { type: 'heading', content: 'Распределённый кеш (Redis)' },
        {
          type: 'text',
          content:
            'Redis — стандарт для shared-кеша между несколькими инстансами приложения. Преимущества: TTL на каждый ключ, атомарные операции, pub/sub для инвалидации, persistence на диск. Цена: сетевой хоп (1–5 мс) и стоимость инфраструктуры.',
        },
        {
          type: 'code',
          language: 'typescript',
          content: `import Redis from 'ioredis';
const redis = new Redis();

async function getUser(id: string): Promise<User> {
  const key = \`user:\${id}\`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const user = await db.users.findById(id);
  await redis.set(key, JSON.stringify(user), 'EX', 300); // TTL 5 минут
  return user;
}

// Инвалидация при апдейте
async function updateUser(id: string, patch: Partial<User>) {
  const updated = await db.users.update(id, patch);
  await redis.del(\`user:\${id}\`); // явная инвалидация
  return updated;
}`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Гибридная архитектура L1+L2: in-process LRU как L1 (микросекунды) + Redis как L2 (миллисекунды) + БД как источник истины. Промах L1 → проверка L2; промах L2 → запрос к БД. Каждый уровень снимает 90%+ нагрузки со следующего.',
        },
      ],
    },

    {
      id: 'invalidation',
      title: 'Стратегии записи и инвалидации',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'Самая сложная задача с кешированием — не кешировать, а правильно инвалидировать. Когда данные изменились — нужно очистить кеш, обновить или подождать истечения TTL. У каждого подхода свои компромиссы. Не зря есть знаменитая цитата: «Есть только две сложные вещи: инвалидация кеша и именование вещей».',
        },
        {
          type: 'text',
          content:
            'На интервью по кешированию обязательно спросят про стратегии инвалидации. Нет универсального ответа — нужно знать TTL (простой, но данные устаревают), event-driven (точный, но сложнее), versioned URLs (надёжный для статики). Хороший кандидат называет трейдофф каждого подхода, а не просто перечисляет их.',
        },
        { type: 'heading', content: 'Cache-aside (lazy loading)' },
        {
          type: 'text',
          content:
            'Самый популярный паттерн в production. Приложение явно управляет кешем: при чтении сначала смотрит кеш, при промахе идёт в БД и кладёт результат. Записи идут только в БД; кеш протухает по TTL или инвалидируется явным вызовом del. БД — источник истины, кеш — оптимизация.',
        },
        {
          type: 'code',
          language: 'typescript',
          content: `// Read
async function get(id: string) {
  const cached = await cache.get(id);
  if (cached) return cached;       // hit
  const fresh = await db.find(id); // miss
  await cache.set(id, fresh, 60);
  return fresh;
}

// Write
async function update(id: string, patch: any) {
  const updated = await db.update(id, patch);
  await cache.del(id);             // явная инвалидация
  return updated;
}`,
        },
        { type: 'heading', content: 'Write-through и write-behind' },
        {
          type: 'list',
          content: `- **Write-through** — синхронная запись в кеш и в БД одновременно. Сильная консистентность, но повышенная латентность записи.
- **Write-behind (write-back)** — запись в кеш сразу, в БД асинхронно через очередь. Высокая пропускная способность, но риск потери последних изменений при падении.
- **Write-around** — запись прямо в БД, минуя кеш. Подходит для редко читаемых данных, где prefetch в кеш бесполезен.`,
        },
        {
          type: 'code',
          language: 'typescript',
          content: `// write-through
async function set(k, v) {
  await Promise.all([cache.set(k, v), db.set(k, v)]);
}

// write-behind
async function set(k, v) {
  await cache.set(k, v);
  queue.push({ k, v }); // worker позже запишет в БД
}`,
        },
        { type: 'heading', content: 'Инвалидация: четыре подхода' },
        {
          type: 'list',
          content: `- **TTL** — каждый ключ живёт ограниченное время. Простота, но устаревшие данные.
- **Explicit invalidation** — del/purge при апдейте. Точность, но нужно помнить везде.
- **Versioned keys** — \`user:123:v5\` → при апдейте инкрементим версию, старые ключи протухают по TTL.
- **Cache tags** — тегируем ответы, инвалидируем группой по тегу (Vercel, Fastly, Cloudflare).`,
        },
        { type: 'heading', content: 'Thundering herd / cache stampede' },
        {
          type: 'text',
          content:
            'Когда популярный ключ протухает, тысячи параллельных запросов разом идут в origin — БД может упасть даже при работающем кеше. Это классическая проблема, и решений несколько: stale-while-revalidate, single-flight (request coalescing), TTL jitter, refresh-ahead.',
        },
        {
          type: 'code',
          language: 'typescript',
          content: `// Single-flight: все одновременные промахи ждут один rebuild
const inFlight = new Map<string, Promise<any>>();

async function get(id: string) {
  const cached = await cache.get(id);
  if (cached) return cached;

  let promise = inFlight.get(id);
  if (!promise) {
    promise = db.find(id).then(async (v) => {
      await cache.set(id, v, 60);
      inFlight.delete(id);
      return v;
    });
    inFlight.set(id, promise);
  }
  return promise; // все ждут одну сборку
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'TTL jitter — добавьте к TTL случайные ±10%, чтобы 10 000 ключей не протухли в одну секунду. Простой приём, который заметно сглаживает нагрузку на origin.',
        },
      ],
      checkpoint: [Q['sdc-q5']!, Q['sdc-q9']!],
    },

    {
      id: 'when-not-to-cache',
      title: 'Когда НЕ кешировать',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Кеш — мощный инструмент, но он создаёт риск stale-данных и точку отказа при инвалидации. Иногда правильный ответ — не кешировать вообще. Это зависит от стоимости устаревания, частоты обновлений и требований к консистентности.',
        },
        {
          type: 'text',
          content:
            'Типичная ошибка: добавить кеш везде «потому что оптимизация». Если данные меняются каждые 5 секунд, кеш на 60 секунд — это источник стейл-данных, а не оптимизация. На интервью по System Design умение сказать «здесь я бы не кешировал» производит не меньшее впечатление, чем умение добавить кеш. Это признак понимания трейдоффов.',
        },
        {
          type: 'list',
          content: `- **Финансовые транзакции** — баланс, платежи, лимиты. Stale-данные приводят к овердрафтам и претензиям.
- **Чекаут и корзина** — цены и наличие должны быть актуальны на момент оплаты.
- **Аутентификация** — кешировать токены опасно, легко отдать чужую сессию.
- **Health-check эндпоинты** — должны бить в реальный сервис, иначе мониторинг бесполезен.
- **Админские мутации** — POST/PUT/DELETE по умолчанию не кешируются, но иногда люди кешируют их ответы — не делайте так.`,
        },
        {
          type: 'code',
          language: 'http',
          content: `// Категорический запрет на кеширование
Cache-Control: no-store

// Чуть мягче: можно сохранить, но всегда ревалидировать
Cache-Control: no-cache, must-revalidate

// Для авторизованного контента: только браузеру пользователя
Cache-Control: private, max-age=0, must-revalidate
Vary: Authorization`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Отличайте no-store от no-cache. no-store запрещает сохранять ответ вообще; no-cache разрешает сохранять, но требует ревалидации перед каждым использованием. Для платёжных страниц правильно no-store.',
        },
        { type: 'heading', content: 'Кеширование авторизованного контента' },
        {
          type: 'text',
          content:
            'Если ответ персонализирован (показывает имя пользователя, корзину, лимиты), CDN не должен его кешировать как public. Используйте `Cache-Control: private` (только браузер) или `Vary: Authorization`/`Vary: Cookie` (но осторожно — это размывает hit ratio в shared-кешах). Для приватного контента предпочтителен per-user edge cache (Cloudflare Workers KV с user-scoped ключами) или вообще no-cache.',
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Перед добавлением кеша задайте три вопроса: 1) сколько времени stale-ответ безопасен? 2) как я инвалидирую кеш при апдейте? 3) что произойдёт при падении кеш-узла? Если на эти вопросы нет внятных ответов — кеш добавит проблем больше, чем решит.',
        },
      ],
    },
  ],

  finalQuiz: quizQuestions.filter((q) => !CHECKPOINT_IDS.has(q.id)),


  cheatsheet: `### Шпаргалка по кешированию

- **Уровни:** browser → Service Worker → CDN edge → reverse proxy → app (in-memory/Redis) → DB. Кешируйте на самом верхнем безопасном уровне.
- **Cache-Control:** \`max-age\` (browser), \`s-maxage\` (CDN), \`public\`/\`private\`, \`no-store\` (никогда), \`immutable\` (не ревалидировать), \`stale-while-revalidate\` (отдать stale + фоновый refresh).
- **ETag** — хеш содержимого, точнее \`Last-Modified\`; используется в \`If-None-Match\` → ответ \`304 Not Modified\` без тела.
- **Vary** — вариативность кеша по заголовкам (\`Accept-Encoding\`, \`Accept-Language\`); \`Vary: User-Agent\`/\`Cookie\` — антипаттерн.
- **CDN-инвалидация:** versioned URLs (immutable) + cache tags (\`revalidateTag\`/\`Cache-Tag\`); full purge — авария.
- **Service Worker** — программируемый прокси: cache-first / network-first / stale-while-revalidate / network-only.
- **Стратегии записи:** cache-aside (популярная), write-through (durable), write-behind (быстрая, рискованная).
- **Политики вытеснения:** LRU (дефолт, O(1) на Map+linked list), LFU, FIFO, W-TinyLFU.
- **Thundering herd** → SWR + single-flight + TTL jitter.
- **Не кешируйте:** платежи, чекаут, токены, health-checks. Используйте \`Cache-Control: no-store\`.`,


  nextTopics: [
    {
      slug: 'sd-performance',
      reason:
        'Кеширование — главный рычаг для оптимизации p99 латентности и Core Web Vitals. После настройки кеша разговор переходит к бюджету бандла, lazy-загрузке и оптимизации картинок.',
    },
    {
      slug: 'sd-api-design',
      reason:
        'Грамотный API-дизайн напрямую влияет на кешируемость: idempotent GET, ETag, версионирование URL, ясная семантика мутаций. Без согласованности между этими слоями кеш работать не будет.',
    },
  ],
};
