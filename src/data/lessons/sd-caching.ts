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
// Flashcards
// =============================================================================

const flashcards: Flashcard[] = [
  {
    id: 'sdc-f1',
    question: 'Какие уровни кеша существуют в типичном веб-стеке?',
    answer:
      'От пользователя к origin: browser cache (HTTP + Service Worker), CDN edge, reverse proxy (Varnish, Nginx), application cache (in-memory LRU, Redis, Memcached), database cache (буферный пул, query cache). Каждый уровень — компромисс между близостью к пользователю и охватом.',
    keyPoints: [
      'Browser: 0 RTT, изолирован на одного пользователя',
      'CDN edge: 30–50 мс, общий на регион',
      'Reverse proxy: рядом с origin, общий на дата-центр',
      'App in-memory: микросекунды, локально на инстанс',
      'Distributed cache (Redis): миллисекунды, общий на кластер',
    ],
  },
  {
    id: 'sdc-f2',
    question: 'Что делает заголовок Cache-Control и какие у него ключевые директивы?',
    answer:
      'Cache-Control управляет поведением всех кешей в цепочке. Основные директивы: max-age (свежесть для браузера), s-maxage (для shared-кешей), public/private (можно ли кешировать в shared-кешах), no-store (не кешировать вообще), no-cache (кешировать, но всегда ревалидировать), must-revalidate, immutable, stale-while-revalidate.',
    keyPoints: [
      'max-age — TTL в секундах для приватного кеша',
      's-maxage — TTL для shared-кешей (CDN, proxy), переопределяет max-age',
      'public — разрешено кешировать всем; private — только браузеру',
      'no-store — категорический запрет на сохранение',
      'immutable — ответ не изменится, можно не ревалидировать',
    ],
    code: `// Статика с хешем в имени
Cache-Control: public, max-age=31536000, immutable

// HTML с возможным обновлением
Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=86400

// Авторизованная страница
Cache-Control: private, max-age=0, must-revalidate`,
    codeLanguage: 'http',
  },
  {
    id: 'sdc-f3',
    question: 'Чем ETag отличается от Last-Modified?',
    answer:
      'Оба — механизмы условных запросов (304 Not Modified), но ETag — это хеш/версия содержимого, а Last-Modified — таймстамп. ETag точнее (распознаёт изменения внутри секунды и нерелевантные правки mtime), Last-Modified проще и не требует расчёта хеша.',
    keyPoints: [
      'ETag → If-None-Match',
      'Last-Modified → If-Modified-Since',
      'ETag может быть strong ("abc") или weak (W/"abc")',
      'Last-Modified имеет точность 1 секунда',
      'CDN и edge-функции часто работают по ETag',
    ],
    code: `// Первый ответ
ETag: "v3-abc123"
Last-Modified: Tue, 09 Apr 2024 10:00:00 GMT

// Условный запрос
If-None-Match: "v3-abc123"
If-Modified-Since: Tue, 09 Apr 2024 10:00:00 GMT

// Если не изменилось:
HTTP/1.1 304 Not Modified`,
    codeLanguage: 'http',
  },
  {
    id: 'sdc-f4',
    question: 'Что такое stale-while-revalidate?',
    answer:
      'Расширение Cache-Control (RFC 5861), которое позволяет отдавать «слегка протухший» ответ из кеша и параллельно асинхронно его обновлять. Пользователь получает мгновенный ответ, фоновый fetch обновляет кеш для следующих запросов. Идеально против thundering herd и ради низкой латентности.',
    keyPoints: [
      'max-age=10, stale-while-revalidate=60 → 10 с fresh, 60 с stale-but-usable',
      'Поддерживается браузерами, Cloudflare, Fastly, Vercel, Next.js',
      'Снижает p99 латентности и нагрузку на origin',
      'Не подходит для финансовых данных, где stale недопустим',
      'Парный заголовок stale-if-error — отдавать stale при ошибке origin',
    ],
  },
  {
    id: 'sdc-f5',
    question: 'Что такое CDN и как он кеширует контент?',
    answer:
      'Content Delivery Network — сеть PoP-узлов по всему миру, которые кешируют ответы origin и отдают их ближайшим пользователям. CDN читает Cache-Control (особенно s-maxage), хранит ответ в памяти/диске узла и при следующем запросе с того же региона отвечает напрямую. TTFB сокращается с сотен миллисекунд до десятков.',
    keyPoints: [
      'PoP — Point of Presence, узел CDN в конкретном регионе',
      'Cache key = метод + URL + Vary-заголовки',
      'Cache hit ratio — главная метрика; цель >95%',
      'Инвалидация: purge by URL, by tag, full purge',
      'Edge-функции (Workers) расширяют CDN до программируемого слоя',
    ],
  },
  {
    id: 'sdc-f6',
    question: 'Как работает Service Worker как программируемый прокси?',
    answer:
      'Service Worker регистрируется в браузере и перехватывает все fetch-запросы со страницы. Внутри обработчика fetch вы программируете стратегию: cache-first, network-first, stale-while-revalidate, network-only. Это даёт офлайн-режим, кеш в Cache Storage и тонкий контроль над политикой кеширования.',
    keyPoints: [
      'Регистрация: navigator.serviceWorker.register("/sw.js")',
      'Cache Storage — отдельное хранилище, не browser HTTP cache',
      'Стратегии: cache-first, network-first, stale-while-revalidate, network-only, cache-only',
      'Workbox — библиотека от Google с готовыми рецептами',
      'Применяется в PWA, офлайн-приложениях, агрессивном кешировании ассетов',
    ],
    code: `self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const network = fetch(e.request).then((res) => {
        caches.open('v1').then((c) => c.put(e.request, res.clone()));
        return res;
      });
      return cached || network; // stale-while-revalidate
    })
  );
});`,
    codeLanguage: 'javascript',
  },
  {
    id: 'sdc-f7',
    question: 'Что такое cache-aside (lazy loading)?',
    answer:
      'Приложение явно управляет кешем: при чтении сначала смотрит кеш, при промахе идёт в БД и кладёт результат в кеш. Записи идут только в БД, кеш либо протухает по TTL, либо инвалидируется явным вызовом. Самый популярный паттерн в production.',
    keyPoints: [
      'БД — источник истины, кеш — оптимизация',
      'Первый запрос всегда промах (cold cache)',
      'Простая реализация, понятная отладка',
      'Риск рассинхронизации при гонках чтения и записи',
      'Часто используется с Redis/Memcached',
    ],
  },
  {
    id: 'sdc-f8',
    question: 'Что такое write-through и write-behind?',
    answer:
      'Стратегии записи в кеш + БД. Write-through пишет синхронно сразу в оба места — гарантированная консистентность, но повышенная латентность. Write-behind пишет в кеш сразу, в БД асинхронно через очередь — высокая пропускная способность, но риск потери при падении.',
    keyPoints: [
      'Write-through: durable + slow writes',
      'Write-behind (write-back): fast writes + risk of data loss',
      'Write-around: пишем мимо кеша прямо в БД (для редко читаемых данных)',
      'Используются вместе с read-through для замкнутого кеширования',
      'Trade-off: durability ↔ throughput',
    ],
  },
  {
    id: 'sdc-f9',
    question: 'Что такое LRU и почему это дефолт для in-memory кешей?',
    answer:
      'Least Recently Used — политика вытеснения, при которой выбрасывается элемент, к которому давно не обращались. Реализуется на Map + двусвязном списке за O(1) на операцию. Хорошо работает для нагрузок с временной локальностью (горячие ключи) и просто реализуется.',
    keyPoints: [
      'Map(key → node) + doubly linked list',
      'get: лукап в Map → перенос узла в head, O(1)',
      'set: новый узел в head; при переполнении выбрасываем tail, O(1)',
      'Альтернативы: LFU, ARC, 2Q, W-TinyLFU (Caffeine)',
      'Node lru-cache — каноническая реализация в npm',
    ],
    code: `class LRU {
  constructor(max) { this.max = max; this.map = new Map(); }
  get(k) {
    if (!this.map.has(k)) return undefined;
    const v = this.map.get(k);
    this.map.delete(k); this.map.set(k, v); // move to tail (newest)
    return v;
  }
  set(k, v) {
    if (this.map.has(k)) this.map.delete(k);
    else if (this.map.size >= this.max) {
      this.map.delete(this.map.keys().next().value); // evict oldest
    }
    this.map.set(k, v);
  }
}`,
    codeLanguage: 'javascript',
  },
  {
    id: 'sdc-f10',
    question: 'Что такое thundering herd / cache stampede?',
    answer:
      'Лавина запросов в origin, возникающая когда популярный ключ протухает и тысячи параллельных запросов одновременно идут пересчитывать его. Может уронить БД даже у работающего кеша. Решения: stale-while-revalidate, single-flight (request coalescing), TTL jitter, refresh-ahead.',
    keyPoints: [
      'SWR — отдаём stale, пока один фоновый запрос обновляет',
      'Single-flight — все одновременные промахи ждут один rebuild',
      'Jitter — добавляем случайность к TTL, чтобы ключи не протухали разом',
      'Refresh-ahead — обновляем кеш заранее, до истечения',
      'Probabilistic early expiration (XFetch) — научный паттерн',
    ],
  },
  {
    id: 'sdc-f11',
    question: 'Как инвалидировать CDN-кеш?',
    answer:
      'Три способа: TTL (естественное протухание), purge by URL/tag (явная очистка), versioned URLs (изменение имени файла → новый ключ кеша). На production принято комбинировать: статика — versioned URLs + immutable, HTML — короткий s-maxage + purge by tag из webhook CMS.',
    keyPoints: [
      'Versioned URLs: /app.abc123.js — самый надёжный',
      'Cache tags (Vercel, Fastly, Cloudflare) — purge группой',
      'Surrogate-Key — заголовок для тегирования ответа',
      'Full purge — медленно, дорого, использовать редко',
      'next/cache: revalidatePath, revalidateTag — управление ISR',
    ],
  },
  {
    id: 'sdc-f12',
    question: 'Когда нужно НЕ кешировать?',
    answer:
      'Когда стоимость stale-данных выше выгоды от скорости: финансовые транзакции, операции с балансом, страницы checkout, ответы с конфиденциальными данными. Также избегайте кешировать ответы с динамическими токенами/CSRF и пути, где persona-разница критична.',
    keyPoints: [
      'Cache-Control: no-store — никогда не сохранять',
      'Set-Cookie с auth-токеном → private или no-store',
      'Денежные операции, банкинг, checkout — без кеша',
      'Vary: Authorization для авторизованных эндпоинтов',
      'Health-checks и админские мутации — мимо кеша',
    ],
  },
  {
    id: 'sdc-f13',
    question: 'Как работает HTTP-кеш браузера и какие у него фазы?',
    answer:
      'Браузер хранит ответы по URL+Vary в Disk Cache (или Memory Cache). При запросе: если ответ свежий (max-age не истёк) — отдаётся из кеша без сети (200 from cache). Если устарел, но есть ETag/Last-Modified — отправляется условный запрос; при 304 берётся локальная копия. Если no-store — не сохраняется.',
    keyPoints: [
      'Memory Cache — на время жизни вкладки',
      'Disk Cache — между сессиями',
      'Status в DevTools: 200 (from disk cache), 200 (from memory cache), 304',
      'Back/Forward Cache — отдельный механизм для навигации',
      'Vary заголовок управляет вариативностью ключа кеша',
    ],
  },
  {
    id: 'sdc-f14',
    question: 'Что такое Vary и зачем он нужен?',
    answer:
      'Заголовок Vary говорит кешу: «один и тот же URL может возвращать разные ответы в зависимости от перечисленных заголовков запроса». Без Vary все пользователи получат один кешированный ответ; с Vary: Accept-Encoding кеш хранит отдельные копии для gzip/br/identity.',
    keyPoints: [
      'Vary: Accept-Encoding — gzip vs brotli vs identity',
      'Vary: Accept-Language — локализация',
      'Vary: User-Agent — РИСКОВАННО, размывает кеш',
      'Vary: Cookie — почти всегда означает «не кешировать в shared»',
      'CDN часто игнорирует Vary, используя свой механизм cache key',
    ],
  },
];

// =============================================================================
// Lesson
// =============================================================================

export const sdCachingLesson: Lesson = {
  topicId: 'sd-caching',

  intro: {
    whyItMatters: `Кеширование — самый дешёвый способ ускорить систему: правильно настроенный кеш сокращает p99 латентности с сотен миллисекунд до десятков и снимает 90%+ нагрузки с origin. В типичном веб-стеке кеш существует на пяти уровнях: браузер (HTTP-кеш и Service Worker Cache Storage), CDN edge (Cloudflare, Fastly, Vercel), reverse proxy (Varnish, Nginx) рядом с origin, application cache (in-memory LRU и распределённые Redis/Memcached) и database cache (буферный пул, query cache). Каждый уровень — компромисс между близостью к пользователю, охватом, стоимостью и сложностью инвалидации.

Главный язык кеширования — HTTP-заголовки: Cache-Control (max-age, s-maxage, public/private, no-store, immutable, stale-while-revalidate), ETag/If-None-Match для условных запросов, Last-Modified, Vary для вариативности ключа. Понимание этих заголовков отделяет инженера, который «вроде что-то слышал», от того, кто умеет настроить кеш под продукт. Service Worker превращает браузер в программируемый прокси: вы пишете обработчик fetch и сами выбираете стратегию (cache-first, network-first, stale-while-revalidate). Это основа PWA и офлайн-режима.

В application-слое типовые паттерны — cache-aside (lazy loading), write-through, write-behind, read-through; политики вытеснения — LRU, LFU, ARC. Каждая политика реализуется за O(1) на правильных структурах данных и обслуживает свой профиль нагрузки. Самая болезненная часть — инвалидация: «There are only two hard things in Computer Science: cache invalidation and naming things» (Phil Karlton). Решения варьируются от TTL до versioned URLs, cache tags и сложных протоколов согласованности. На senior-собеседованиях по System Design кеширование — обязательный блок: вас попросят построить иерархию кешей для социальной сети, обсудить thundering herd, рассчитать hit ratio и объяснить, когда не кешировать вообще.`,
    estimatedMinutes: 45,
    interviewAngle:
      'Senior-интервьюер проверяет не определения заголовков, а понимание trade-off-ов: где какой уровень кеша уместен, как инвалидировать без простоя, как защититься от thundering herd, и когда кеширование принесёт больше вреда, чем пользы.',
    prerequisites: [],
  },

  resources: {
    videos: [
      {
        source: 'youtube',
        id: 'HiBDZgTNpXY',
        title: 'Everything you need to know about HTTP Caching',
        channel: 'roadmap.sh',
        language: 'en',
        durationSec: 14 * 60,
        description:
          'Концентрированный обзор HTTP-кеша: Cache-Control, ETag, Last-Modified, conditional requests, разница между browser и shared-кешами. Хороший старт перед углублением в RFC.',
      },
      {
        source: 'youtube',
        id: 'dGAgxozNWFE',
        title: 'Cache Systems Every Developer Should Know',
        channel: 'ByteByteGo',
        language: 'en',
        durationSec: 8 * 60,
        description:
          'Карта всех слоёв кеширования в современной архитектуре: client, CDN, load balancer, application, database. Полезно перед system-design-собеседованием.',
      },
      {
        source: 'youtube',
        id: 'RI9np1LWzqw',
        title: 'What Is A CDN? How Does It Work?',
        channel: 'ByteByteGo',
        language: 'en',
        durationSec: 6 * 60,
        description:
          'Базовое объяснение CDN: PoP-узлы, cache hit ratio, инвалидация, как Cache-Control влияет на edge. Без воды, с диаграммами.',
      },
    ],
    links: [
      {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching',
        title: 'HTTP caching — MDN',
        source: 'mdn',
        language: 'en',
        note: 'Канонический справочник: все директивы Cache-Control, ETag, Vary, conditional requests с примерами заголовков.',
      },
      {
        url: 'https://web.dev/articles/http-cache',
        title: 'Prevent unnecessary network requests with the HTTP Cache — web.dev',
        source: 'web-dev',
        language: 'en',
        note: 'Практическое руководство Jeff Posnick по настройке HTTP-кеша для production. Образцовые рецепты для статики и HTML.',
      },
      {
        url: 'https://datatracker.ietf.org/doc/html/rfc7234',
        title: 'RFC 7234 — HTTP/1.1 Caching',
        source: 'spec',
        language: 'en',
        note: 'Официальная спецификация HTTP-кеширования. Читать выборочно, но обязательно для глубокого понимания.',
      },
      {
        url: 'https://blog.cloudflare.com/origin-cache-control/',
        title: 'Origin Cache-Control — Cloudflare blog',
        source: 'article',
        language: 'en',
        note: 'Как Cloudflare интерпретирует s-maxage, stale-while-revalidate, Cache-Tag и Surrogate-Key. Практика edge-кеширования.',
      },
      {
        url: 'https://vercel.com/docs/edge-network/caching',
        title: 'Caching — Vercel docs',
        source: 'article',
        language: 'en',
        note: 'Edge-кеш Vercel, ISR, on-demand revalidation, cache tags. Канонические примеры для Next.js App Router.',
      },
    ],
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
            'Аналогия: ты помнишь часто используемые номера наизусть (браузер-кеш), другие — в телефоне (CDN), редкие — в записной книжке (база). Запрос останавливается при первом попадании в кеш. На System Design интервью кеш — одна из первых вещей которую стоит упомянуть при оптимизации. Правило большого пальца: кешируй на самом верхнем безопасном уровне.',
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
      flashcardIds: ['sdc-f1'],
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
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/Caching', title: 'Кеширование HTTP — MDN (ru)' },
      video: {
        source: 'youtube',
        id: 'dGAgxozNWFE',
        title: 'Cache Systems Every Developer Should Know',
        channel: 'ByteByteGo',
        language: 'en',
        durationSec: 8 * 60,
        description: 'Карта всех слоёв кеширования: client, CDN, load balancer, application, database. Хороший обзор перед system-design-собеседованием.',
      },
      links: [
        {
          url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching',
          title: 'HTTP caching — MDN',
          source: 'mdn',
          language: 'en',
          note: 'Канонический справочник: все директивы Cache-Control, ETag, Vary, conditional requests с примерами заголовков.',
        },
      ],
    },

    {
      id: 'http-headers',
      title: 'HTTP-заголовки: Cache-Control, ETag, Vary',
      estimatedMinutes: 9,
      blocks: [
        {
          type: 'text',
          content:
            'HTTP-заголовки — это язык, на котором сервер говорит браузеру и CDN: «этот ответ можно кешировать на год» или «никогда не сохраняй это». Без правильных заголовков браузер не знает что и как долго держать в кеше, и либо кеширует слишком агрессивно, либо не кеширует вообще. Это та тема, где знание деталей отличает джуна от мидла.',
        },
        {
          type: 'text',
          content:
            'Самая частая ловушка: разработчик добавляет `Cache-Control: no-cache` думая что это «никогда не кешировать». На самом деле no-cache означает «кешируй, но всегда ревалидируй». Никогда не кешировать — это `no-store`. На интервью по кешированию этот вопрос задают почти всегда — он отличает тех, кто читал MDN, от тех, кто только copy-paste.',
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
      flashcardIds: ['sdc-f2', 'sdc-f3', 'sdc-f13', 'sdc-f14'],
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
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/Caching', title: 'Кеширование HTTP — MDN (ru)' },
      video: {
        source: 'youtube',
        id: 'HiBDZgTNpXY',
        title: 'Everything you need to know about HTTP Caching',
        channel: 'roadmap.sh',
        language: 'en',
        durationSec: 14 * 60,
        description: 'Cache-Control, ETag, Last-Modified, conditional requests, разница между browser и shared-кешами.',
      },
      links: [
        {
          url: 'https://web.dev/articles/http-cache',
          title: 'Prevent unnecessary network requests with the HTTP Cache — web.dev',
          source: 'web-dev',
          language: 'en',
          note: 'Практическое руководство по настройке HTTP-кеша для production: образцовые рецепты для статики и HTML.',
        },
      ],
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
      flashcardIds: ['sdc-f5', 'sdc-f11'],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/Caching', title: 'Кеширование HTTP — MDN (ru)' },
      video: {
        source: 'youtube',
        id: 'RI9np1LWzqw',
        title: 'What Is A CDN? How Does It Work?',
        channel: 'ByteByteGo',
        language: 'en',
        durationSec: 6 * 60,
        description: 'CDN: PoP-узлы, cache hit ratio, инвалидация, как Cache-Control влияет на edge. Без воды, с диаграммами.',
      },
      links: [
        {
          url: 'https://blog.cloudflare.com/origin-cache-control/',
          title: 'Origin Cache-Control — Cloudflare blog',
          source: 'article',
          language: 'en',
          note: 'Как Cloudflare интерпретирует s-maxage, stale-while-revalidate, Cache-Tag и Surrogate-Key.',
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
      flashcardIds: ['sdc-f6'],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/API/Service_Worker_API', title: 'Service Worker API — MDN (ru)' },
      links: [
        {
          url: 'https://developer.mozilla.org/ru/docs/Web/API/Cache',
          title: 'Cache API — MDN (ru)',
          source: 'mdn',
          language: 'ru',
          note: 'Как работать с Cache Storage в Service Worker: как сохранять, искать и удалять ответы.',
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
            'Частая ловушка при масштабировании: in-memory LRU кеш в Node.js виден только одному инстансу. При запуске двух подов каждый держит свой кеш — инвалидация в одном не затрагивает другой. Данные рассинхронизируются. Если у тебя несколько инстансов — нужен Redis. На интервью этот нюанс проверяют: «что произойдёт с кешем если ты запустишь приложение на трёх серверах?»',
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
      flashcardIds: ['sdc-f9'],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/Caching', title: 'Кеширование HTTP — MDN (ru)' },
      links: [
        {
          url: 'https://vercel.com/docs/edge-network/caching',
          title: 'Caching — Vercel docs',
          source: 'article',
          language: 'en',
          note: 'Edge-кеш Vercel, ISR, on-demand revalidation, cache tags. Канонические примеры для Next.js App Router.',
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
      flashcardIds: ['sdc-f4', 'sdc-f7', 'sdc-f8', 'sdc-f10'],
      checkpoint: [Q['sdc-q5']!, Q['sdc-q9']!],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/Caching', title: 'Кеширование HTTP — MDN (ru)' },
      links: [
        {
          url: 'https://datatracker.ietf.org/doc/html/rfc7234',
          title: 'RFC 7234 — HTTP/1.1 Caching',
          source: 'spec',
          language: 'en',
          note: 'Официальная спецификация HTTP-кеширования. Читать выборочно: секции про Cache-Control, conditional requests.',
        },
      ],
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
      flashcardIds: ['sdc-f12'],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/Caching', title: 'Кеширование HTTP — MDN (ru)' },
    },
  ],

  finalQuiz: quizQuestions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  flashcards,

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

  interviewQA: [
    {
      id: 'sdc-iq1',
      question: 'Объясните паттерн cache-aside и его компромиссы.',
      shortAnswer:
        'Cache-aside (lazy loading) — приложение читает из кеша, при промахе идёт в БД и кладёт результат в кеш. Записи — только в БД, кеш либо протухает по TTL, либо инвалидируется явным del. БД — источник истины.',
      fullAnswer: `Cache-aside — самая популярная стратегия в production. Логика:

\`\`\`ts
async function get(id) {
  let v = await cache.get(id);
  if (v) return v;             // hit
  v = await db.findById(id);    // miss
  await cache.set(id, v, ttl);
  return v;
}

async function update(id, patch) {
  const v = await db.update(id, patch);
  await cache.del(id);          // инвалидация
  return v;
}
\`\`\`

**Плюсы:**
- БД — единственный источник истины; падение кеша не теряет данные.
- Простая модель: явный код для чтения и записи.
- Подходит для read-heavy нагрузок с разнообразным паттерном чтения.

**Минусы:**
- **Cold cache:** первый запрос всегда промах. Решение — warm-up при деплое.
- **Race condition при апдейте:** возможен сценарий, когда стейл-чтение успевает положить устаревшее значение в кеш ПОСЛЕ del. Решения: версионирование ключей, lock на запись, write-through.
- **TTL компромисс:** низкий → больше промахов; высокий → дольше живут устаревшие данные.

В System Design на собеседовании обычно сравнивают cache-aside vs write-through: первый проще и устойчивее к ошибкам кеша, второй даёт сильную консистентность ценой латентности.`,
      followUps: [
        'Как именно может произойти race condition при cache-aside и как её предотвратить?',
        'Что делать с cold cache при деплое нового инстанса?',
        'Когда write-through лучше cache-aside?',
      ],
      relatedChapterId: 'invalidation',
    },
    {
      id: 'sdc-iq2',
      question: 'В чём разница между ETag и Last-Modified?',
      shortAnswer:
        'Оба — механизмы условных запросов для 304 Not Modified. ETag — хеш/версия содержимого, точнее, распознаёт изменения внутри секунды. Last-Modified — таймстамп с точностью до секунды, проще в вычислении.',
      fullAnswer: `Оба заголовка обеспечивают **conditional GET** — оптимизацию, при которой клиент не скачивает тело, если ресурс не изменился.

**Last-Modified / If-Modified-Since.**
Сервер в первом ответе кладёт \`Last-Modified: Tue, 09 Apr 2024 10:00:00 GMT\`. Клиент при ревалидации отправляет \`If-Modified-Since: <та же дата>\`. Сервер сравнивает с актуальным mtime и возвращает либо новое тело (200), либо 304 без тела.

Минусы:
- Точность 1 секунда: если файл правят чаще, изменения теряются.
- Зависит от mtime файла: \`touch\` или \`rsync\` могут сломать сравнение.
- Не работает для динамически вычисляемых ответов без явного timestamp.

**ETag / If-None-Match.**
Сервер кладёт \`ETag: "v3-abc123"\` — обычно хеш содержимого или версию. Клиент отправляет \`If-None-Match: "v3-abc123"\`. Сервер сравнивает с актуальным хешем и решает.

Преимущества:
- Точность произвольная: распознаёт любые изменения.
- Не зависит от mtime, работает для динамики.
- Может быть \`strong\` (\`"abc"\`) или \`weak\` (\`W/"abc"\`) — последний допускает семантическую эквивалентность с разной байтовой формой.

**На практике:**
- Статика: ETag из хеша содержимого + длинный max-age + immutable. Пользователь получает 304 при ревалидации, не качает байты.
- Динамика: оба заголовка одновременно — большинство клиентов и CDN отправят и If-None-Match, и If-Modified-Since.
- CDN типа Cloudflare и edge-функции работают по ETag нативно.

**Подводный камень.** За nginx/CloudFront ETag по умолчанию вычисляется с включённым размером + mtime. После rsync на новый инстанс ETag меняется → CDN получает «новую версию» → cache miss. Решение — детерминированный ETag из хеша содержимого.`,
      followUps: [
        'Чем strong ETag отличается от weak ETag и когда нужен каждый?',
        'Что произойдёт, если сервер вернёт ETag без Cache-Control?',
        'Почему 304 не должен содержать тело и как это связано с экономией трафика?',
      ],
      relatedChapterId: 'http-headers',
    },
    {
      id: 'sdc-iq3',
      question: 'Что такое stale-while-revalidate и какую проблему он решает?',
      shortAnswer:
        'SWR (RFC 5861) разрешает отдать «слегка устаревший» ответ из кеша и параллельно асинхронно его обновлять. Пользователь получает мгновенный ответ; фоновый fetch обновляет кеш для следующих. Решает проблему thundering herd и низкой латентности.',
      fullAnswer: `Заголовок \`Cache-Control: max-age=10, stale-while-revalidate=60\` делит жизнь ответа на три фазы:

1. **Fresh (0–10 с):** ответ свежий, отдаётся из кеша мгновенно.
2. **Stale-but-usable (10–70 с):** ответ устарел, но кеш всё равно отдаёт его; параллельно делает фоновый fetch к origin для обновления.
3. **Expired (>70 с):** ответ нельзя использовать, нужен синхронный fetch.

**Какие проблемы решает:**

**1. Latency tail.** Без SWR пользователь, попавший в момент истечения TTL, ждёт полного round-trip к origin. С SWR p99 латентности падает с сотен миллисекунд до десятков — пользователь всегда получает ответ из кеша.

**2. Thundering herd.** Если популярный ключ протухает в кеше, без SWR тысячи параллельных запросов разом идут в origin. С SWR все эти запросы получают stale-ответ из кеша; фоновых запросов к origin — один или несколько.

**3. Партнёрская доступность.** Если origin временно недоступен, кеш всё ещё отдаёт stale-ответ. Парный заголовок \`stale-if-error\` явно разрешает это поведение.

**Реализация:**
- Браузеры (Chrome, Firefox) поддерживают SWR в HTTP-кеше нативно.
- Cloudflare, Fastly, Vercel, Next.js (\`revalidate\` в App Router) реализуют SWR на edge.
- В Service Worker SWR пишется руками: вернуть cached, fetch в фоне, put в cache.

**Когда не подходит:**
- Финансовые данные, баланс — stale недопустим.
- Аутентификация — stale-токен может быть скомпрометирован.
- Контент с строгими SLA на свежесть.

**Числовые подсказки.** Для контентного сайта типичные значения: \`max-age=60, stale-while-revalidate=86400\` — минута свежести, сутки stale. Для лент: \`max-age=10, stale-while-revalidate=300\`.`,
      followUps: [
        'Как именно браузер делает фоновый запрос при SWR — в каком потоке?',
        'Чем SWR отличается от no-cache + must-revalidate?',
        'Когда SWR может привести к проблемам с консистентностью?',
      ],
      relatedChapterId: 'invalidation',
    },
    {
      id: 'sdc-iq4',
      question: 'Как инвалидировать CDN-кеш в production?',
      shortAnswer:
        'Три подхода: TTL (естественное протухание), purge by URL/tag (явная очистка), versioned URLs (новое имя файла = новый ключ). На production комбинируют: статика — versioned + immutable; HTML — короткий s-maxage + cache tags из вебхука CMS.',
      fullAnswer: `«There are only two hard things in Computer Science: cache invalidation and naming things» — Phil Karlton. На CDN это особенно болезненно, потому что вы не контролируете напрямую распределённое состояние сотен PoP-узлов.

**Подход 1: TTL.** Самое простое — каждый ответ живёт ограниченное время (\`s-maxage\`). После истечения CDN сам сходит в origin за новой версией. Плюсы: ноль кода. Минусы: либо короткий TTL (низкий hit ratio), либо долгий (устаревшие данные).

**Подход 2: Purge by URL/tag.**
- **Purge by URL:** \`POST /purge {urls: ['/post/123']}\`. Точечно, быстро.
- **Purge by tag:** ответы тегируются (Cloudflare \`Cache-Tag: post, post-123\`, Vercel cache tags), purge инвалидирует группу. Незаменимо, когда один апдейт в БД должен очистить десятки страниц.
- **Full purge:** очистить весь кеш зоны. Дорого, медленно, вызывает thundering herd на origin. Только в авариях.

\`\`\`ts
// Vercel / Next.js
import { revalidateTag } from 'next/cache';
revalidateTag('posts');     // очищает все страницы с тегом 'posts'
revalidatePath('/post/123');// очищает конкретный путь

// Cloudflare API
fetch('https://api.cloudflare.com/.../purge_cache', {
  method: 'POST',
  body: JSON.stringify({ tags: ['post-123'] }),
});
\`\`\`

**Подход 3: Versioned URLs.** Самый надёжный для статики. Имя файла включает хеш содержимого: \`/app.abc123.js\`. При новой сборке имя меняется на \`/app.def456.js\`. Старая версия остаётся в кеше навсегда (с \`Cache-Control: max-age=31536000, immutable\`), новая — это новый ключ кеша. Никаких purge не нужно.

**Production-паттерн:**
- Статика (JS, CSS, картинки): versioned URLs + immutable. Никогда не инвалидируется явно.
- HTML: короткий s-maxage (60–300 с) + cache tags. CMS-вебхук → \`revalidateTag\`.
- API JSON: SWR + явный del в Redis при апдейте + cache-aside в приложении.

**Подводные камни:**
- Eventual consistency между PoP: после purge один регион может ещё минуту отдавать старый ответ. Учитывайте при критичных апдейтах.
- Cache stampede после full purge: спрячьтесь за origin shield или сделайте rolling purge по регионам.
- Нагрузка на API инвалидации: Cloudflare ограничивает до 30k purge/сутки на бесплатном плане.`,
      followUps: [
        'Что произойдёт с кешем PoP после revalidateTag — мгновенно ли обновляется все узлы?',
        'Чем versioned URLs предпочтительнее TTL для статических ассетов?',
        'Когда нужен origin shield и как он спасает от thundering herd?',
      ],
      relatedChapterId: 'cdn-edge',
    },
    {
      id: 'sdc-iq5',
      question: 'Когда выбрать Service Worker, а когда хватит обычного HTTP-кеша?',
      shortAnswer:
        'HTTP-кеша достаточно для большинства публичных сайтов: его задают заголовками. Service Worker нужен, когда требуется офлайн, тонкая программируемая стратегия, push-уведомления, или фоновая синхронизация — то есть для PWA.',
      fullAnswer: `**Обычный HTTP-кеш** конфигурируется только заголовками \`Cache-Control\`, \`ETag\`, \`Vary\` и автоматически работает в браузере и CDN. Это правильный выбор по умолчанию: ноль JS, нет рисков сломать страницу багом в SW, инвалидация очевидна.

HTTP-кеша достаточно, если:
- Сайт публичный, контент один для всех.
- Ассеты собираются с хешем в имени.
- Не нужен офлайн.
- Нет push-уведомлений и background sync.

**Service Worker** добавляет программируемый прокси между страницей и сетью. Нужен, когда:

**1. Офлайн-режим.** PWA должны работать без сети. SW при install предзагружает оболочку приложения в Cache Storage, при fetch отдаёт её из кеша.

**2. Тонкая стратегия.** \`Cache-Control\` ограничен предопределёнными директивами. SW позволяет писать произвольную логику: «сначала кеш с таймаутом 200 мс, потом сеть», «сеть, при ошибке кеш, при отсутствии того и другого — fallback».

**3. Кросс-страничный кеш.** SW виден всем вкладкам сайта. Можно агрессивно кешировать ассеты так, что они работают между сессиями без обращения к серверу.

**4. Push-уведомления и background sync.** SW — единственный способ принимать push, когда вкладка закрыта, и выполнять отложенные операции (отправить форму, когда сеть восстановится).

**Цена SW:**
- Сложная отладка: lifecycle (install/activate/update), eventual consistency обновления.
- Риск «застрявшего» SW: старая версия может не обновиться, пользователь видит устаревший сайт.
- Нужно явно заботиться о сценариях обновления (\`skipWaiting\`, \`clients.claim\`).
- Тестирование в HTTPS only (или localhost).

**Workbox** от Google — стандартная обёртка, которая решает большинство проблем. На production почти никто не пишет SW с нуля.

**Простая эвристика:** если перед вами лендинг или информационный сайт — обходитесь HTTP-кешем. Если PWA, e-commerce с офлайн-каталогом, мобильное web-приложение — берите Workbox.`,
      followUps: [
        'Как заставить пользователей получить новую версию SW без перезагрузки?',
        'Что такое skipWaiting и clients.claim?',
        'Чем Cache Storage отличается от обычного HTTP-кеша браузера?',
      ],
      relatedChapterId: 'service-worker',
    },
    {
      id: 'sdc-iq6',
      question: 'Как кешировать авторизованный (персонализированный) контент?',
      shortAnswer:
        'Используйте Cache-Control: private — кешируется только в браузере конкретного пользователя, shared-кеши его не сохраняют. Для shared-кеширования — Vary по Authorization (опасно для hit ratio) или per-user keys на edge (Cloudflare Workers KV). Для критичных данных — no-store.',
      fullAnswer: `Авторизованный контент содержит индивидуальные данные: имя пользователя, корзина, баланс, лимиты. Кешировать его в shared-кеше (CDN, корпоративный proxy) опасно: один пользователь может получить чужой ответ.

**Подход 1: Cache-Control: private.**
\`\`\`http
Cache-Control: private, max-age=300
\`\`\`
Браузер кеширует ответ для текущего пользователя, shared-кеши обязаны не сохранять. Подходит, когда повторное посещение этой же страницы пользователем — частый сценарий (личный кабинет, дашборд).

**Подход 2: Vary: Authorization / Cookie.**
\`\`\`http
Cache-Control: public, max-age=300
Vary: Authorization
\`\`\`
CDN хранит отдельную копию для каждого значения заголовка Authorization. На практике это значит «копия для каждого пользователя» — hit ratio близок к нулю. Используйте только если: (а) cache key реально включает заголовок (некоторые CDN игнорируют Vary) и (б) пользователей мало или один пользователь часто возвращается.

**Подход 3: Per-user edge cache.**
Cloudflare Workers KV, Vercel Edge Config, или собственная схема: ключ кеша = \`page:userId\`. SW или edge-функция читает токен, конструирует уникальный ключ, делает lookup в edge-store. Хороший компромисс между скоростью CDN и приватностью.

**Подход 4: Раскрашивание страницы.**
Вернуть HTML с плейсхолдерами для динамики, заполнить их клиентским JS-запросом. Статический шаблон кешируется на CDN как public; персонализация — отдельный API-запрос с Cache-Control: private. Это паттерн «public shell + private data».

**Подход 5: no-store для критичных данных.**
\`\`\`http
Cache-Control: no-store
\`\`\`
Платежи, баланс, конфиденциальные данные — не кешировать вообще. Не путайте с no-cache (тот разрешает сохранение и требует ревалидации).

**Когда что выбрать:**
- Личный кабинет пользователя: \`Cache-Control: private, max-age=60\` + ETag.
- Каталог с пометкой «в наличии для вашего региона»: статический shell + динамическая полоска через клиентский fetch.
- Корзина / чекаут: \`Cache-Control: no-store\`.
- Глобальная лента с персональным ranking: edge с per-user ключом или вынос на клиент через SWR-библиотеку.

**Подводные камни.**
- Если на странице есть Set-Cookie, многие CDN автоматически переключают её в private/no-cache режим — проверьте поведение вашего провайдера.
- Cookie-based auth + кеш = риск отдать чужую сессию. Всегда тестируйте с двумя разными аккаунтами в incognito.`,
      followUps: [
        'Чем Cache-Control: private отличается от no-cache?',
        'Что произойдёт, если на странице с Cache-Control: public вернуть Set-Cookie?',
        'Как Cloudflare Workers KV помогает кешировать персонализированный контент на edge?',
      ],
      relatedChapterId: 'when-not-to-cache',
    },
    {
      id: 'sdc-iq7',
      question: 'Что такое thundering herd и какие приёмы защищают от него?',
      shortAnswer:
        'Лавина параллельных запросов в origin при истечении TTL популярного ключа — может уронить БД даже при работающем кеше. Защита: stale-while-revalidate, single-flight (request coalescing), TTL jitter, refresh-ahead, probabilistic early expiration (XFetch).',
      fullAnswer: `**Сценарий.** Популярная страница (главная новостного портала) кешируется в Redis с TTL=60 с. В момент истечения TTL приходят 10 000 параллельных запросов. Все они получают cache miss и одновременно идут в БД пересчитывать страницу. БД захлёбывается, ответы тормозят, пользователи видят 504.

Это **cache stampede / thundering herd / dogpile effect**. Решения:

**1. Stale-while-revalidate.**
\`\`\`http
Cache-Control: max-age=60, stale-while-revalidate=600
\`\`\`
Кеш отдаёт stale-ответ всем 10 000 запросам мгновенно; в фоне делает один fetch к origin для обновления. Стандарт для CDN.

**2. Single-flight (request coalescing).**
\`\`\`ts
const inFlight = new Map<string, Promise<any>>();
async function get(id: string) {
  const cached = await cache.get(id);
  if (cached) return cached;
  let p = inFlight.get(id);
  if (!p) {
    p = db.find(id).then(async (v) => {
      await cache.set(id, v, 60);
      inFlight.delete(id);
      return v;
    });
    inFlight.set(id, p);
  }
  return p; // все одновременные промахи ждут одну сборку
}
\`\`\`
В Go это \`sync/singleflight\`, в Node — \`p-throttle\` или своя Map. Все параллельные промахи по одному ключу ждут одну Promise.

**3. TTL jitter.**
\`\`\`ts
const ttl = 60 + Math.random() * 12; // ±10%
await cache.set(key, value, ttl);
\`\`\`
Если 10 000 ключей закешированы одновременно (например, после деплоя), они протухнут не разом, а размазанно. Простой и эффективный приём.

**4. Refresh-ahead.**
Обновляем кеш заранее, до истечения TTL. Cron-задача каждую минуту прогревает топ-100 ключей; при запросе пользователь почти всегда получает hit.

**5. Probabilistic early expiration (XFetch).**
Каждый запрос вычисляет вероятность \`p = exp((-time_to_expire) * fetch_duration * beta)\` и принимает решение пересчитать заранее. Чем ближе к истечению, тем выше вероятность раннего обновления одним из параллельных запросов. Научная статья Vladimir Vlasov — стоит почитать.

**Production-паттерн.** Для CDN: SWR. Для Redis-кеша: single-flight + jitter + refresh-ahead для топ-N. Для БД-уровня: connection pool + circuit breaker, чтобы при срыве кеша приложение не положило БД.

**Метрика для мониторинга.** Cache miss rate per second. Резкие пики при истечении TTL популярного ключа — сигнал, что нужна одна из защит.`,
      followUps: [
        'Чем XFetch (probabilistic early expiration) отличается от refresh-ahead?',
        'Как реализовать single-flight в распределённом окружении (несколько инстансов)?',
        'Почему TTL jitter работает и какие у него границы применимости?',
      ],
      relatedChapterId: 'invalidation',
    },
    {
      id: 'sdc-iq8',
      question: 'Сравните LRU, LFU и FIFO. Когда какую политику выбрать?',
      shortAnswer:
        'LRU — дефолт, выбрасывает давно не использованные, O(1) на Map+linked list. LFU — выбрасывает редко используемые, лучше для повторяющихся горячих ключей. FIFO — самые старые, простой, но плохо реагирует на горячие ключи. На production обычно LRU или его улучшения (W-TinyLFU).',
      fullAnswer: `**LRU (Least Recently Used).**
Выбрасываем элемент, к которому давно не обращались. Реализация: Map(key → node) + двусвязный список. Get: лукап в Map → перенос узла в head. Set: новый узел в head; при переполнении выбрасываем tail. Все операции O(1).

Когда хорош:
- Временная локальность нагрузки (горячие ключи остаются горячими в окне).
- Reverse proxy для веб-страниц.
- БД-буферный пул (PostgreSQL использует усложнённый LRU).

Когда плох:
- Сканирующий паттерн (один раз пробежать по большому датасету). LRU вытесняет горячие ключи в пользу одноразовых.

**LFU (Least Frequently Used).**
Выбрасываем элемент с наименьшим числом обращений. Реализация: счётчик попаданий + min-heap или multi-level LRU. Лучше LRU при стабильно горячих ключах: «топ-100 товаров» останутся в кеше даже при пиках одноразовых запросов.

Минусы:
- Старые горячие ключи не вытесняются, даже если давно не нужны (cache pollution).
- Реализация сложнее, чаще O(log n) или O(1) с amortized вытеснением.

**FIFO (First In First Out).**
Выбрасываем самый старый по времени вставки, без учёта обращений. Простая очередь.

Когда хорош:
- Очень редко: только если все элементы равноценны, и нет горячих.
- Иногда в специализированных кешах (например, кеш писем).

Когда плох:
- Если есть горячие ключи — они вытесняются с той же скоростью, что и редкие.

**W-TinyLFU (Caffeine, Java).**
Гибрид: probabilistic counters + window LRU + main cache. Защищает от sequential pollution и пиков одноразовых запросов, при этом учитывает частоту. Современный дефолт для серьёзных in-memory кешей.

**ARC (Adaptive Replacement Cache).**
Автоматически адаптируется между LRU и LFU. Используется в IBM, ZFS.

**Random.**
Redis с \`maxmemory-policy allkeys-random\` выбрасывает случайный ключ. Простой, неожиданно неплохо работает на однородных нагрузках. Используется при отсутствии данных о паттерне доступа.

**Эвристика выбора.**
- Дефолт: LRU.
- Стабильно горячий топ: LFU или W-TinyLFU.
- Большой датасет с одноразовыми сканами: 2Q или ARC.
- Redis: allkeys-lru или volatile-lru (наиболее часто).`,
      followUps: [
        'Как именно реализовать LRU за O(1) на Map + linked list?',
        'Что такое cache pollution и как против неё защищаются 2Q и W-TinyLFU?',
        'Какая политика вытеснения лучше для буферного пула БД и почему?',
      ],
      relatedChapterId: 'app-cache',
    },
  ],

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
