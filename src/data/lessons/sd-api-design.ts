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
    description: 'Какой HTTP-метод НЕ является идемпотентным по спецификации RFC 9110?',
    code: `GET    /users/42        // получить пользователя
PUT    /users/42        // полностью заменить запись
DELETE /users/42        // удалить запись
POST   /users           // создать нового пользователя`,
    options: [
      'GET — каждый запрос возвращает новые данные, значит не идемпотентен',
      'PUT — заменяет ресурс, поэтому повторный вызов «портит» состояние',
      'DELETE — после удаления повторный запрос вернёт 404, значит результат разный',
      'POST — каждое повторное выполнение создаёт новую сущность',
    ],
    correctIndex: 3,
    explanation:
      'Идемпотентность означает, что повторное выполнение приводит к тому же состоянию ресурса (но не обязательно к тому же ответу). GET, PUT, DELETE — идемпотентны. POST по умолчанию — нет: два одинаковых POST /users создадут двух пользователей. Чтобы сделать POST идемпотентным, добавляют заголовок Idempotency-Key и сервер запоминает ответ по этому ключу.',
  },
  {
    type: 'fill-blank',
    id: 'sda-q2',
    description: 'Какой подход к версионированию API описан в этом запросе?',
    codeWithBlanks: `GET /users/42 HTTP/1.1
Host: api.example.com
Accept: application/vnd.example.v2+json   // __BLANK__`,
    options: [
      'Версионирование через URL (/v2/users)',
      'Версионирование через media type в заголовке Accept',
      'Версионирование через query-параметр (?version=2)',
      'Версионирование через cookie',
    ],
    correctIndex: 1,
    explanation:
      'Это content negotiation через Accept: клиент явно просит вторую версию представления (vnd.<vendor>.v2+json). Плюс — URL остаётся стабильным, ресурс «один и тот же». Минус — сложнее тестировать в браузере и кешировать на CDN. Альтернативы: /v2/users (просто, но плодит маршруты) и ?version=2 (плохо для кеширования и безопасности).',
  },
  {
    type: 'output',
    id: 'sda-q3',
    description: 'Что вернёт сервер при cursor-pagination запросе после первой страницы?',
    code: `// 1-й запрос
GET /posts?limit=20
// Ответ:
{
  "items": [...],
  "nextCursor": "eyJpZCI6MTAyMH0="
}

// 2-й запрос
GET /posts?limit=20&cursor=eyJpZCI6MTAyMH0=`,
    options: [
      'Те же 20 записей, что и в первом запросе — курсор просто метка',
      'Следующие 20 записей, начиная с того места, где остановился предыдущий ответ',
      'Случайные 20 записей — курсор только идентификатор сессии',
      'Ошибку 400, потому что cursor нельзя комбинировать с limit',
    ],
    correctIndex: 1,
    explanation:
      'Cursor-пагинация хранит непрозрачный токен, в котором закодирована позиция (например, id или timestamp последнего элемента). Сервер расшифровывает его и продолжает выборку с этого места. В отличие от offset/limit, cursor устойчив к вставкам/удалениям между запросами и не страдает от деградации производительности на больших offset.',
  },
  {
    type: 'fill-blank',
    id: 'sda-q4',
    description: 'Какую проблему решает DataLoader в GraphQL-резолверах?',
    codeWithBlanks: `// Без DataLoader: запрос { users { id, posts { title } } }
// → 1 запрос за списком пользователей
// → N отдельных запросов за постами каждого пользователя
// Это называется __BLANK__`,
    options: ['CORS preflight', 'N+1 query problem', 'Race condition', 'Cache stampede'],
    correctIndex: 1,
    explanation:
      'N+1 — классическая проблема ORM/GraphQL: один запрос за родителями плюс N запросов за их детьми. DataLoader из библиотеки graphql/dataloader собирает все индивидуальные ключи внутри одного тика event loop в массив и делает один batch-запрос. Дополнительно он кеширует результат в рамках одного запроса (per-request cache).',
  },
  {
    type: 'output',
    id: 'sda-q5',
    description: 'Какой HTTP-статус наиболее корректен, если клиент отправил валидный JSON, но не передал обязательное поле email?',
    code: `POST /users
Content-Type: application/json

{ "name": "Alice" }   // нет email`,
    options: [
      '400 Bad Request — синтаксис ок, но поле обязательное',
      '404 Not Found — клиент пытается создать сущность без идентификатора',
      '422 Unprocessable Entity — синтаксис правильный, но семантика не пройдена (RFC 4918)',
      '500 Internal Server Error — обработка не удалась',
    ],
    correctIndex: 2,
    explanation:
      'Когда тело запроса синтаксически валидно (парсится как JSON), но не проходит бизнес-валидацию, по WebDAV-расширению (RFC 4918), GitHub и Stripe API отдают 422. 400 формально допустим и используется во многих API, но 422 точнее. 404 не подходит — это не «ресурс не найден», а ошибка ввода. 500 — индикатор бага сервера, не клиента.',
  },
  {
    type: 'fill-blank',
    id: 'sda-q6',
    description: 'Какой формат описывает RFC 7807 (Problem Details for HTTP APIs)?',
    codeWithBlanks: `HTTP/1.1 422 Unprocessable Entity
Content-Type: __BLANK__

{
  "type": "https://example.com/errors/validation",
  "title": "Validation failed",
  "status": 422,
  "detail": "email is required",
  "instance": "/users"
}`,
    options: ['application/json', 'application/problem+json', 'text/plain', 'application/error+json'],
    correctIndex: 1,
    explanation:
      'RFC 7807 определяет media type application/problem+json (и application/problem+xml). Это машинно-читаемый стандарт для ошибок: type — стабильный URI ошибки, title — краткое описание, detail — человеко-читаемый текст, instance — URI конкретной ошибки. Клиенты могут безопасно switch-ить по type, не парся текст.',
  },
  {
    type: 'output',
    id: 'sda-q7',
    description: 'Чем gRPC принципиально отличается от REST поверх HTTP/1.1?',
    code: `// .proto
service UserService {
  rpc GetUser (GetUserRequest) returns (User);
  rpc StreamUsers (Empty) returns (stream User);
}

message User {
  int64 id = 1;
  string name = 2;
}`,
    options: [
      'gRPC — это просто REST с другим именем; всё одинаково',
      'gRPC использует HTTP/2 и Protobuf: контракт строго типизирован, есть стриминг (server/client/bidirectional), сериализация бинарная',
      'gRPC работает только в браузере и не нужен бэкенду',
      'gRPC — это синоним GraphQL, только под другим лейблом',
    ],
    correctIndex: 1,
    explanation:
      'gRPC = HTTP/2 + Protocol Buffers + кодогенерация клиентов и серверов. HTTP/2 даёт мультиплексирование и server push, Protobuf — компактную бинарную сериализацию (в 3–10× меньше JSON) и строгий контракт. gRPC поддерживает четыре вида вызовов: unary, server-streaming, client-streaming, bidirectional. Хорош для межсервисного взаимодействия; в браузер «из коробки» не работает (нужен gRPC-Web).',
  },
  {
    type: 'fill-blank',
    id: 'sda-q8',
    description: 'Какое ключевое свойство tRPC отличает его от REST и GraphQL?',
    codeWithBlanks: `// server.ts
export const appRouter = t.router({
  getUser: t.procedure.input(z.object({ id: z.string() })).query(({ input }) => db.user.find(input.id)),
});
export type AppRouter = typeof appRouter;

// client.ts
import type { AppRouter } from '../server';
const user = await trpc.getUser.query({ id: '42' });
//                                     ^? тип input и output известны без кодогенерации — __BLANK__`,
    options: [
      'Ручное описание схемы в OpenAPI',
      'End-to-end типизация через TypeScript: тип сервера импортируется на клиент напрямую, без кодогенерации',
      'Совместимость с произвольными языками программирования',
      'Бинарная сериализация, как у Protobuf',
    ],
    correctIndex: 1,
    explanation:
      'tRPC использует TypeScript как язык контракта: клиент импортирует только тип роутера (`type AppRouter`) и получает строгие типы вызовов без OpenAPI/Protobuf и кодогенерации. Цена — клиент и сервер должны быть на TypeScript в одном монорепо. Хороший выбор для full-stack TS-проектов; для гетерогенных систем используют gRPC или OpenAPI.',
  },
  {
    type: 'output',
    id: 'sda-q9',
    description: 'Что НЕ является примером ломающего изменения (breaking change) в REST API?',
    code: `// V1
{ "id": 1, "name": "Alice", "email": "a@b.com" }`,
    options: [
      'Удаление поля email из ответа',
      'Переименование поля name → fullName',
      'Добавление нового опционального поля avatarUrl в ответ',
      'Изменение типа id с number на string',
    ],
    correctIndex: 2,
    explanation:
      'Добавление нового опционального поля — обратно-совместимое изменение: старые клиенты его проигнорируют, новые могут им пользоваться. Удаление и переименование полей, изменение типов и обязательности — ломающие изменения, требующие новой версии API. Правило: «add fields, never remove or rename without versioning».',
  },
  {
    type: 'fill-blank',
    id: 'sda-q10',
    description: 'Какой HTTP-метод и статус правильно описывают успешное создание ресурса?',
    codeWithBlanks: `__BLANK__ /users HTTP/1.1
Content-Type: application/json

{ "email": "a@b.com" }

→ HTTP/1.1 201 Created
   Location: /users/42`,
    options: ['GET', 'POST', 'PUT', 'PATCH'],
    correctIndex: 1,
    explanation:
      'POST — единственный безопасный способ создания, когда сервер сам выбирает идентификатор. Ответ 201 Created содержит заголовок Location с URL новой сущности. PUT тоже создаёт ресурс, но только если клиент сам задаёт его URL (например, PUT /users/alice). PATCH — частичное обновление, не создание. GET не должен создавать ресурсов вообще.',
  },
  {
    type: 'output',
    id: 'sda-q11',
    description: 'Что произойдёт, если клиент повторит POST с тем же Idempotency-Key, что и предыдущий?',
    code: `// Запрос 1
POST /payments
Idempotency-Key: abc-123
{ "amount": 100 }
→ 200 OK { "id": "pay_xxx", "amount": 100 }

// Запрос 2 (тело может быть тем же или сетевой ретрай)
POST /payments
Idempotency-Key: abc-123
{ "amount": 100 }`,
    options: [
      'Сервер создаст вторую транзакцию — Idempotency-Key игнорируется',
      'Сервер вернёт сохранённый ответ от первого запроса, не создавая новой транзакции',
      'Сервер всегда вернёт 409 Conflict',
      'Сервер вернёт 500 Internal Server Error',
    ],
    correctIndex: 1,
    explanation:
      'Idempotency-Key (используется Stripe, PayPal, AWS) — клиентский UUID, который сервер сохраняет в БД вместе с первым ответом на TTL (обычно 24 часа). Любой повтор с тем же ключом возвращает кэшированный ответ, не выполняя операцию повторно. Это спасает от двойных платежей при сетевых ретраях. Если тело отличается — сервер может вернуть 422.',
  },
  {
    type: 'fill-blank',
    id: 'sda-q12',
    description: 'Какой инструмент описывает контракт REST API машинно-читаемым способом?',
    codeWithBlanks: `# api.yaml
openapi: 3.1.0
paths:
  /users/{id}:
    get:
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
      responses:
        '200':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/User' }

# Это спецификация __BLANK__`,
    options: ['Protobuf', 'GraphQL SDL', 'OpenAPI / Swagger', 'JSON Schema Draft 4'],
    correctIndex: 2,
    explanation:
      'OpenAPI Specification (бывший Swagger) — стандарт описания REST API: эндпоинты, параметры, схемы ответов, ошибки, аутентификация. Из него генерируются клиенты на десятках языков, документация (Swagger UI, Redoc), мок-серверы и тесты. Аналоги: Protobuf для gRPC, GraphQL SDL для GraphQL, AsyncAPI для event-driven. JSON Schema используется внутри OpenAPI для валидации тел.',
  },
  {
    type: 'complexity',
    id: 'sda-q13',
    description: 'Какова производительность offset/limit пагинации на больших offset?',
    code: `SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 1000000;`,
    options: [
      'O(1) — индекс просто перематывается на нужную позицию',
      'O(log n) — бинарный поиск по индексу',
      'O(offset) — БД физически прочитывает и отбрасывает offset строк',
      'O(n²) — для каждой строки выполняется отдельный запрос',
    ],
    correctIndex: 2,
    explanation:
      'PostgreSQL и MySQL не умеют «перематывать» индекс на N-ю позицию: они читают и отбрасывают первые offset строк, потом возвращают следующие limit. На offset = 1 000 000 это становится секундами CPU. Cursor-пагинация (WHERE created_at < $cursor LIMIT 20) использует индекс напрямую и работает за O(log n) независимо от глубины.',
  },
];

const Q = Object.fromEntries(quizQuestions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set(['sda-q1', 'sda-q4', 'sda-q9', 'sda-q13']);

// =============================================================================
// Flashcards
// =============================================================================

const flashcards: Flashcard[] = [
  {
    id: 'sda-f1',
    question: 'Что такое REST и какие у него ключевые ограничения?',
    answer:
      'REST (Representational State Transfer) — архитектурный стиль Роя Филдинга. API оперирует ресурсами по URI, использует стандартные HTTP-методы (GET/POST/PUT/PATCH/DELETE) и статусы. Ключевые принципы: stateless, кешируемость, единообразный интерфейс, layered system, HATEOAS.',
    keyPoints: [
      'Ресурсы как существительные: /users, /orders/42/items',
      'Методы как глаголы: GET читает, POST создаёт, PUT/PATCH меняют, DELETE удаляет',
      'Статусы: 2xx успех, 3xx редирект, 4xx ошибка клиента, 5xx ошибка сервера',
      'Stateless: каждый запрос самодостаточен (auth в каждом заголовке)',
      'HATEOAS на практике встречается редко — большинство «REST» API на самом деле RPC over HTTP',
    ],
  },
  {
    id: 'sda-f2',
    question: 'Что такое идемпотентность и какие методы идемпотентны?',
    answer:
      'Идемпотентный метод — такой, повторное выполнение которого приводит к тому же состоянию ресурса. По RFC 9110 идемпотентны GET, HEAD, OPTIONS, PUT, DELETE. POST и PATCH — нет. Safe-методы (GET, HEAD, OPTIONS) дополнительно не меняют состояние вообще.',
    keyPoints: [
      'Идемпотентность ≠ возврат одинакового ответа (DELETE: первый — 200, второй — 404)',
      'POST идемпотентен только с Idempotency-Key',
      'PATCH технически не идемпотентен (зависит от семантики операции)',
      'Идемпотентность критична для ретраев в распределённых системах',
      'Safe ⊂ Idempotent: GET/HEAD/OPTIONS и safe, и idempotent',
    ],
  },
  {
    id: 'sda-f3',
    question: 'Что такое GraphQL и чем он отличается от REST?',
    answer:
      'GraphQL — язык запросов и runtime для API, разработанный Facebook. Клиент сам описывает, какие поля нужны, и получает ровно их в одном запросе. Один эндпоинт (POST /graphql), типизированная схема (SDL), резолверы на сервере.',
    keyPoints: [
      'Решает over-fetching и under-fetching REST',
      'Один эндпоинт вместо десятков',
      'Сильно типизированная схема — встроенная документация',
      'Минусы: сложное кеширование (нет HTTP cache), N+1 без DataLoader, риск дорогих запросов',
      'Подзапросы и фрагменты позволяют переиспользовать поля',
    ],
    code: `# schema.graphql
type User {
  id: ID!
  name: String!
  posts: [Post!]!
}
type Query {
  user(id: ID!): User
}`,
    codeLanguage: 'graphql',
  },
  {
    id: 'sda-f4',
    question: 'Что такое N+1 query problem и как с ней бороться в GraphQL?',
    answer:
      'N+1 — антипаттерн: один запрос за списком из N родителей плюс N отдельных запросов за их детьми. В GraphQL возникает в резолверах вложенных полей. Решение — DataLoader: батчит ключи внутри одного тика event loop в один запрос и кеширует результат на время запроса.',
    keyPoints: [
      'GET /users → 1 запрос за пользователями',
      'Для каждого user.posts → N запросов в БД',
      'DataLoader: new DataLoader(keys => batchFn(keys))',
      'batchFn получает массив ключей, возвращает массив результатов',
      'Per-request кеш: запрос одного и того же id дважды → один SQL',
    ],
    code: `const userLoader = new DataLoader(async (ids) => {
  const users = await db.users.where('id', 'in', ids);
  return ids.map((id) => users.find((u) => u.id === id));
});`,
    codeLanguage: 'javascript',
  },
  {
    id: 'sda-f5',
    question: 'Что такое gRPC и когда его выбирать?',
    answer:
      'gRPC — RPC-фреймворк от Google поверх HTTP/2 + Protocol Buffers. Контракт описывается в .proto-файле, из него генерируются клиенты и серверы на десятках языков. Поддерживает unary и стриминговые вызовы (server/client/bidirectional).',
    keyPoints: [
      'Бинарная сериализация Protobuf — в 3–10× компактнее JSON',
      'HTTP/2 multiplexing — много вызовов в одном TCP-соединении',
      'Кодогенерация: одинаковые типы у клиента и сервера',
      'Стриминг: подходит для real-time (logs, metrics, chat)',
      'Слабо работает в браузере — нужен gRPC-Web или прокси',
    ],
  },
  {
    id: 'sda-f6',
    question: 'Что такое tRPC и в чём его уникальность?',
    answer:
      'tRPC — RPC-библиотека для TypeScript-стека: клиент импортирует тип серверного роутера и получает полностью типизированные вызовы без OpenAPI, GraphQL SDL или кодогенерации. Работает в монорепо и в Next.js «из коробки».',
    keyPoints: [
      'End-to-end типизация: рефакторинг сервера автоматически ломает клиента',
      'Без runtime-схем (хотя обычно используется Zod для валидации input)',
      'Транспорт — обычно HTTP с JSON, есть batching и subscriptions через SSE/WebSocket',
      'Подходит только для TypeScript-стека на обоих концах',
      'Интеграция с TanStack Query (React Query) для кеширования',
    ],
  },
  {
    id: 'sda-f7',
    question: 'Чем отличаются способы версионирования API?',
    answer:
      'Три основных подхода: URL-based (/v1/users), header-based (Accept: application/vnd.example.v2+json), query-based (?version=2). У каждого свои trade-off по простоте, кешируемости и чистоте URI.',
    keyPoints: [
      'URL: проще всего отлаживать в браузере, но плодит маршруты — Stripe, Twitter использовали',
      'Header: URI стабилен, ресурс «один», но сложнее тестировать; используют GitHub, Heroku',
      'Query: легко переключать в браузере, но плохо кешируется на CDN',
      'Главное правило: добавлять новые поля без версии, удалять/переименовывать — с версией',
      'Sunset-заголовок (RFC 8594) объявляет дату вывода версии',
    ],
  },
  {
    id: 'sda-f8',
    question: 'Чем offset-пагинация отличается от cursor-пагинации?',
    answer:
      'Offset/limit (?page=10&limit=20) проста, но деградирует на больших offset (БД отбрасывает миллион строк) и «прыгает» при вставках. Cursor-пагинация (?cursor=abc) использует непрозрачный токен, кодирующий позицию (id или timestamp последнего элемента); работает за O(log n) и стабильна к вставкам.',
    keyPoints: [
      'Offset: работает плохо на > 100K элементов, прыжки страниц при вставках',
      'Cursor: используется в Twitter, Instagram, Slack, GraphQL Relay',
      'Cursor должен быть непрозрачным (base64) — клиент не должен его парсить',
      'Удобно для бесконечной прокрутки; неудобно для «перейти на страницу 15»',
      'Keyset: вариация cursor — WHERE (created_at, id) < ($cursor_ts, $cursor_id)',
    ],
  },
  {
    id: 'sda-f9',
    question: 'Какие HTTP-статусы использовать для ошибок?',
    answer:
      '4xx — ошибки клиента: 400 (плохой синтаксис), 401 (нет аутентификации), 403 (нет прав), 404 (не найдено), 409 (конфликт), 422 (валидация не прошла), 429 (rate limit). 5xx — ошибки сервера: 500 (баг), 502/503/504 (gateway/upstream).',
    keyPoints: [
      '401 vs 403: 401 = «кто ты?», 403 = «я знаю кто ты, но нельзя»',
      '404 vs 410: 404 — нет/неизвестно, 410 — было и удалено навсегда',
      '422 для бизнес-валидации, 400 для синтаксиса (но многие смешивают)',
      '429 + Retry-After: rate limiting',
      '503 + Retry-After: временная недоступность',
    ],
  },
  {
    id: 'sda-f10',
    question: 'Что такое Problem Details (RFC 7807)?',
    answer:
      'Стандарт application/problem+json для машинно-читаемых ошибок HTTP API. Поля: type (стабильный URI ошибки), title (краткое описание), status (HTTP-код), detail (текст), instance (URI конкретной ошибки). Клиенты безопасно switch-ятся по type.',
    keyPoints: [
      'Content-Type: application/problem+json',
      'type — единственное стабильное поле для логики клиента',
      'detail — для логов и UI, не парсить!',
      'Можно расширять: errors[], traceId, retryAfter',
      'Альтернативы: GraphQL errors[], JSON:API errors',
    ],
    code: `{
  "type": "https://api.example.com/errors/insufficient-funds",
  "title": "Insufficient funds",
  "status": 422,
  "detail": "Account balance is 50, requested 100",
  "instance": "/transfers/abc-123",
  "balance": 50
}`,
    codeLanguage: 'json',
  },
  {
    id: 'sda-f11',
    question: 'Что такое Idempotency-Key и зачем он нужен?',
    answer:
      'Заголовок Idempotency-Key (Stripe, PayPal, AWS) — клиентский UUID, который сервер запоминает вместе с ответом. Повторные запросы с тем же ключом возвращают сохранённый ответ, не выполняя операцию снова. Спасает от двойных платежей при сетевых ретраях.',
    keyPoints: [
      'TTL обычно 24 часа',
      'Storage: Redis или таблица idempotency_keys',
      'Если тело отличается от первого — обычно 422',
      'Клиент должен генерировать ключ ДО первой попытки (UUID v4)',
      'Применять только к не-идемпотентным методам (POST, иногда PATCH)',
    ],
  },
  {
    id: 'sda-f12',
    question: 'Что такое OpenAPI и зачем он нужен?',
    answer:
      'OpenAPI (бывший Swagger) — стандарт описания REST API в YAML/JSON: эндпоинты, параметры, схемы ответов, ошибки, схемы аутентификации. Инструменты генерируют документацию (Swagger UI, Redoc), клиенты на десятках языков, мок-серверы и контрактные тесты.',
    keyPoints: [
      'OpenAPI 3.1 совместим с JSON Schema Draft 2020-12',
      'Single source of truth: код или YAML — выбирайте одно',
      'Аналоги: Protobuf для gRPC, SDL для GraphQL, AsyncAPI для events',
      'Генерация клиентов: openapi-generator, orval, hey-api',
      'Contract testing: Pact, Schemathesis',
    ],
  },
  {
    id: 'sda-f13',
    question: 'REST vs GraphQL vs gRPC vs tRPC — когда что выбирать?',
    answer:
      'REST — публичные API с разными клиентами, простые CRUD, кеширование на CDN. GraphQL — фронтенд агрегирует данные из десятков источников, мобильные клиенты с тонким каналом. gRPC — межсервисное общение, строгий контракт, высокая нагрузка. tRPC — full-stack TypeScript-монорепо, быстрая итерация продукта.',
    keyPoints: [
      'REST: HTTP-семантика, кеши, простота, любой клиент',
      'GraphQL: гибкие запросы, схема, хорош для BFF',
      'gRPC: бинарь, стриминг, кодогенерация, плохо в браузере',
      'tRPC: только TS, нулевой контракт-overhead',
      'Реальные системы комбинируют: REST/GraphQL наружу, gRPC внутри',
    ],
  },
  {
    id: 'sda-f14',
    question: 'Какие изменения в API считаются breaking?',
    answer:
      'Ломающие: удаление поля/эндпоинта, переименование, изменение типа, ужесточение валидации (новое required-поле), изменение формата ошибок. Не ломающие: добавление опциональных полей, новых эндпоинтов, новых статус-кодов в документацию.',
    keyPoints: [
      'Postel’s law: «be conservative in what you send, liberal in what you accept»',
      'Always-additive подход — основа долгоживущих API',
      'Удаление поля → новая major-версия + Sunset-заголовок',
      'Срок депрекации: обычно 6–12 месяцев для публичного API',
      'Контрактные тесты ловят breaking change на CI до релиза',
    ],
  },
];

// =============================================================================
// Lesson
// =============================================================================

export const sdApiDesignLesson: Lesson = {
  topicId: 'sd-api-design',

  intro: {
    whyItMatters: `Дизайн API определяет, насколько долго проект сможет жить и развиваться без переписываний. Плохо спроектированный API — это «сломанный контракт»: каждое изменение ломает клиентский код, каждый ретрай создаёт дубликаты, каждый запрос с миллионом записей без пагинации кладёт базу. Хорошо спроектированный API наоборот: десятилетиями принимает новых клиентов, переживает миграции БД и смену команд.

Первое решение — **выбор стиля**. REST — для публичных HTTP-ресурсов с кешированием на CDN. GraphQL — когда фронтенд собирает данные из десятков источников и не хочет получать лишнее. gRPC — для внутреннего межсервисного общения, где важны скорость и строгие типы. tRPC — для full-stack TypeScript-проектов, где клиент и сервер в одном репозитории.

Второе решение — **механики, которые делают API надёжным**: идемпотентность (чтобы ретраи не создавали дубликаты), курсорная пагинация (чтобы offset/limit не ломался на миллионе записей), версионирование (чтобы изменения не ломали старых клиентов), понятные ошибки (чтобы клиент мог обработать их программно, а не показывать "Что-то пошло не так").

По итогам урока вы сможете обосновать выбор стиля API, объяснить разницу между идемпотентным и не-идемпотентным запросом, спроектировать пагинацию и версионирование — и не услышать от интервьюера "а почему именно так?".`,
    estimatedMinutes: 45,
    interviewAngle:
      'Интервьюер на System Design проверяет не определения, а умение делать обоснованный выбор: REST или GraphQL для нового сервиса; как версионировать публичный API; как сделать платежи идемпотентными; как пагинировать ленту с миллиардом записей; как описать ошибки так, чтобы клиент мог обрабатывать их программно. Сильный кандидат опирается на trade-off’ы и реальные кейсы (Stripe, GitHub, Slack), а не на лозунги.',
    prerequisites: [{ slug: 'js-network', title: 'Сеть: CORS, cookie, HTTP' }],
  },

  resources: {
    videos: [
      {
        source: 'youtube',
        id: '4OuaONkZw1I',
        title: 'Why Idempotency is very critical in Backend Applications',
        channel: 'Hussein Nasser',
        language: 'en',
        durationSec: 16 * 60,
        description:
          'Хуссейн Нассер на пальцах объясняет, почему ретраи без идемпотентности приводят к двойным платежам и как Idempotency-Key решает проблему. Обязателен перед собеседованием по платёжным системам.',
      },
      {
        source: 'youtube',
        id: 'yWzKJPw_VzM',
        title: 'What Is GraphQL? REST vs. GraphQL',
        channel: 'ByteByteGo',
        language: 'en',
        durationSec: 5 * 60,
        description:
          'Сжатый и наглядный сравнительный разбор от ByteByteGo: где REST выигрывает за счёт HTTP-кеша, где GraphQL — за счёт точечной выборки полей и одного запроса.',
      },
      {
        source: 'youtube',
        id: '2-407yO8nEU',
        title: 'Discussing tRPC & GraphQL with Theo Browne & Max Stoiber',
        channel: 'Real World React',
        language: 'en',
        durationSec: 60 * 60,
        description:
          'Тео Браун (создатель T3 Stack) и Макс Штойбер (один из идеологов GraphQL) обсуждают, когда tRPC уместнее GraphQL и наоборот. Лучший живой контекст для понимания современного API-стека.',
      },
    ],
    links: [
      {
        url: 'https://cloud.google.com/apis/design',
        title: 'API Design Guide — Google Cloud',
        source: 'article',
        language: 'en',
        note: 'Каноническое руководство Google по REST-дизайну: ресурсы, методы, ошибки, версии, пагинация. Источник многих решений в Stripe и GitHub API.',
      },
      {
        url: 'https://graphql.org/learn/',
        title: 'Learn GraphQL — graphql.org',
        source: 'article',
        language: 'en',
        note: 'Официальное введение в GraphQL: схемы, запросы, мутации, подписки, резолверы. Лучший старт перед DataLoader и федерацией.',
      },
      {
        url: 'https://grpc.io/docs/what-is-grpc/introduction/',
        title: 'What is gRPC? — grpc.io',
        source: 'article',
        language: 'en',
        note: 'Официальная документация gRPC: HTTP/2, Protobuf, четыре вида вызовов, кодогенерация. Достаточно прочесть Introduction и Core Concepts.',
      },
      {
        url: 'https://trpc.io/docs/concepts',
        title: 'tRPC — Concepts',
        source: 'article',
        language: 'en',
        note: 'Концепции tRPC: роутер, процедуры, контекст, мидлвары. Понимание этой страницы достаточно, чтобы ответить на вопросы про tRPC на собеседовании.',
      },
      {
        url: 'https://spec.openapis.org/oas/latest.html',
        title: 'OpenAPI Specification 3.1',
        source: 'spec',
        language: 'en',
        note: 'Официальная спецификация OpenAPI 3.1 — язык описания REST API. Обязательное знание для любого API-дизайнера.',
      },
    ],
  },

  chapters: [
    {
      id: 'styles-overview',
      title: 'Стили API: REST, GraphQL, gRPC, tRPC',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'Прежде чем писать API, нужно выбрать стиль. REST — самый популярный: URL как ресурс, HTTP методы как действия. GraphQL — клиент описывает что хочет. gRPC — бинарный протокол для микросервисов. tRPC — TypeScript-first, типобезопасность от бека до фронта.',
        },
        {
          type: 'text',
          content:
            'Прежде чем писать первую строчку API, нужно выбрать стиль — и это не технический, а продуктовый вопрос. Кто будет потребителем? Если публичный API для третьих сторон — REST, потому что понятен всем и кешируется на CDN. Если мобильное приложение, которому нужны разные данные с каждого экрана — GraphQL избавит от overfetching. Если два сервиса на разных языках общаются внутри кластера — gRPC даст бинарь и кодогенерацию. Если весь стек на TypeScript — tRPC закроет типы без OpenAPI.',
        },
        { type: 'heading', content: 'Краткий обзор' },
        {
          type: 'list',
          content: `- **REST** — ресурсы по URI, стандартные HTTP-методы, статусы. Stateless, кешируемый, любой клиент.
- **GraphQL** — один эндпоинт, типизированная схема, клиент сам описывает нужные поля. Решает over-fetching и под-fetching.
- **gRPC** — RPC поверх HTTP/2 + Protobuf. Бинарь, стриминг, кодогенерация. Плохо в браузере.
- **tRPC** — RPC для TypeScript-монорепо. End-to-end типизация без OpenAPI/SDL/Protobuf.`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'REST и GraphQL — это **протоколы поверх HTTP**. gRPC — отдельный протокол поверх HTTP/2. tRPC — это про **типы**, не про протокол: он использует обычный HTTP под капотом.',
        },
        { type: 'heading', content: 'Сравнение в одной таблице' },
        {
          type: 'code',
          language: 'text',
          content: `Свойство          | REST        | GraphQL    | gRPC          | tRPC
------------------|-------------|------------|---------------|-----------
Транспорт         | HTTP/1.1+   | HTTP        | HTTP/2        | HTTP
Сериализация      | JSON        | JSON        | Protobuf (бин)| JSON
Контракт          | OpenAPI     | SDL         | .proto        | TypeScript
Кодогенерация     | optional    | optional    | обязательна   | не нужна
Стриминг          | SSE/WS      | subscriptions| 4 вида       | через WS
Браузер «из коробки»| да         | да         | нет (gRPC-Web)| да
Кеш HTTP          | да          | плохо      | нет           | плохо
Лучший кейс       | публичный API| BFF, мобайл| микросервисы  | full-stack TS`,
        },
        {
          type: 'text',
          content:
            'На собеседовании «расскажи о своём REST API» — часто ловушка: проверяет понимаешь ли ты ограничения REST и его альтернативы, или просто знаешь слово.',
        },
        {
          type: 'text',
          content:
            'REST не является строгим стандартом — у каждой команды своя интерпретация «настоящего REST». Многие API называются RESTful, но на деле это просто HTTP с JSON. На собеседовании вопрос «расскажи о своём REST API» — часто ловушка: интервьюер проверяет, понимаешь ли ты ограничения REST и почему не везде его выбирают, или просто знаешь слово. Сильный ответ — сравнить с альтернативами и объяснить почему именно REST был правильным выбором в конкретном контексте.',
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'На собеседовании senior-уровня вопрос «REST или GraphQL?» — ловушка. Сильный ответ начинается с «зависит от: кто клиент, насколько изменчив запрос, нужен ли HTTP-кеш, сколько у нас сервисов, каков язык бэкенда». Никогда не выбирайте «лучший» стиль вне контекста.',
        },
      ],
      flashcardIds: ['sda-f1', 'sda-f3', 'sda-f5', 'sda-f6', 'sda-f13'],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/Methods', title: 'HTTP-методы — MDN (ru)' },
      video: {
        source: 'youtube',
        id: 'yWzKJPw_VzM',
        title: 'What Is GraphQL? REST vs. GraphQL',
        channel: 'ByteByteGo',
        language: 'en',
        durationSec: 5 * 60,
        description: 'Сжатый сравнительный разбор: где REST выигрывает за счёт HTTP-кеша, где GraphQL — за счёт точечной выборки.',
      },
      links: [
        {
          url: 'https://cloud.google.com/apis/design',
          title: 'API Design Guide — Google Cloud',
          source: 'article',
          language: 'en',
          note: 'Каноническое руководство Google по REST-дизайну: ресурсы, методы, ошибки, версии, пагинация.',
        },
      ],
    },

    {
      id: 'rest-resources',
      title: 'REST: ресурсы, методы, идемпотентность',
      estimatedMinutes: 8,
      blocks: [
        {
          type: 'text',
          content:
            'REST — архитектурный стиль, не протокол. Ресурсы адресуются через URL (/users/42), действия через HTTP методы (GET/POST/PUT/DELETE). Ответ — представление ресурса (обычно JSON). Stateless: каждый запрос самодостаточен.',
        },
        {
          type: 'text',
          content:
            'REST (Representational State Transfer) — это архитектурный стиль, а не протокол. Главная идея: ресурс — это вещь с адресом (URL), а HTTP-метод — действие над этой вещью. /users — это «коллекция пользователей», GET на неё — «дай мне список», POST — «создай нового». Stateless: каждый запрос должен содержать всю информацию для его обработки — сервер не помнит предыдущих запросов.',
        },
        { type: 'heading', content: 'Стандартный набор методов' },
        {
          type: 'code',
          language: 'http',
          content: `GET    /users           → список (с пагинацией)
GET    /users/42        → одна запись
POST   /users           → создание (сервер выбирает id)
PUT    /users/42        → полная замена
PATCH  /users/42        → частичное обновление
DELETE /users/42        → удаление`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'PUT обычно «идемпотентный create-or-replace»: вызов с одним и тем же телом всегда оставляет ресурс в одинаковом состоянии. POST используется, когда сервер сам генерирует id (поэтому он не идемпотентен).',
        },
        { type: 'heading', content: 'Safe и idempotent методы' },
        {
          type: 'list',
          content: `- **Safe** (не меняют состояние): GET, HEAD, OPTIONS.
- **Idempotent** (повтор → то же состояние): GET, HEAD, OPTIONS, PUT, DELETE.
- **Ни safe, ни idempotent**: POST, PATCH (без специальных усилий).`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Идемпотентность ≠ возврат одинакового ответа. DELETE /users/42: первый вызов вернёт 200, второй — 404. Но **состояние** одинаковое: пользователя нет ни после первого, ни после второго.',
        },
        {
          type: 'text',
          content:
            'Идемпотентность — ключевое свойство. GET, PUT, DELETE — идемпотентны (повторный запрос даёт тот же результат). POST — нет. Важно для retry-логики: можно безопасно повторить PUT, но не POST.',
        },
        { type: 'heading', content: 'Idempotency-Key для POST' },
        {
          type: 'text',
          content:
            'Платежи, заказы, отправка email — операции, которые **обязаны** быть идемпотентными при сетевых ретраях. Stripe, PayPal, AWS используют заголовок `Idempotency-Key`: клиент генерирует UUID до первой попытки и присылает его с каждым ретраем.',
        },
        {
          type: 'code',
          language: 'http',
          content: `POST /v1/charges HTTP/1.1
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{ "amount": 1000, "currency": "usd" }

# Сервер:
# 1. SELECT response FROM idempotency_keys WHERE key = '550e...'
# 2. Если есть — вернуть сохранённый ответ.
# 3. Если нет — выполнить операцию, сохранить (key, request_hash, response).
# 4. TTL обычно 24 часа.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Если тело запроса отличается от первого вызова с тем же ключом, Stripe возвращает 422 Unprocessable Entity. Это защищает от случайного переиспользования ключа.',
        },
        { type: 'heading', content: 'Стандартные ошибки REST' },
        {
          type: 'list',
          content: `- **400 Bad Request** — синтаксическая ошибка в запросе (битый JSON).
- **401 Unauthorized** — нет аутентификации («кто ты?»).
- **403 Forbidden** — есть аутентификация, но нет прав («знаю, но нельзя»).
- **404 Not Found** — ресурс не существует.
- **409 Conflict** — конфликт состояния (одновременная запись, дубль).
- **422 Unprocessable Entity** — синтаксис ок, но семантика не прошла (валидация).
- **429 Too Many Requests** — rate limit. Возвращайте Retry-After.
- **500/502/503/504** — ошибки сервера и upstream-зависимостей.`,
        },
      ],
      flashcardIds: ['sda-f1', 'sda-f2', 'sda-f9', 'sda-f11'],
      checkpoint: [Q['sda-q1']!, {
        type: 'match-pairs',
        id: 'sdapi-mp1',
        description: 'Сопоставь HTTP метод с его идемпотентностью',
        pairs: [
          { left: 'GET', right: 'Идемпотентный и безопасный' },
          { left: 'POST', right: 'НЕ идемпотентный' },
          { left: 'PUT', right: 'Идемпотентный' },
          { left: 'DELETE', right: 'Идемпотентный' },
        ],
        explanation: 'Идемпотентный = повторный запрос не меняет результат. PUT /users/1 с одними данными всегда даёт один результат. POST /users каждый раз создаёт нового пользователя. Это важно для retry-логики при сетевых ошибках.',
      }],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/Methods', title: 'HTTP-методы — MDN (ru)' },
      video: {
        source: 'youtube',
        id: '4OuaONkZw1I',
        title: 'Why Idempotency is very critical in Backend Applications',
        channel: 'Hussein Nasser',
        language: 'en',
        durationSec: 16 * 60,
        description: 'Hussein Nasser объясняет, почему ретраи без идемпотентности приводят к двойным платежам и как Idempotency-Key решает проблему.',
      },
      links: [
        {
          url: 'https://spec.openapis.org/oas/latest.html',
          title: 'OpenAPI Specification 3.1',
          source: 'spec',
          language: 'en',
          note: 'Официальная спецификация OpenAPI 3.1 — язык описания REST API для любого API-дизайнера.',
        },
      ],
    },

    {
      id: 'graphql',
      title: 'GraphQL: схемы, резолверы, N+1 и DataLoader',
      estimatedMinutes: 8,
      blocks: [
        {
          type: 'text',
          content:
            '**GraphQL** — язык запросов и runtime для API с **одним эндпоинтом** (обычно POST /graphql) и **типизированной схемой** на SDL. Клиент сам описывает нужные поля — сервер отдаёт ровно их. Это решает классические проблемы REST:\n- **over-fetching** — лишние поля в ответе\n- **under-fetching** — несколько запросов вместо одного',
        },
        { type: 'heading', content: 'Схема и запрос' },
        {
          type: 'code',
          language: 'graphql',
          content: `# schema.graphql
type User {
  id: ID!
  name: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  author: User!
}

type Query {
  user(id: ID!): User
  posts(limit: Int = 20, cursor: String): PostConnection!
}

# Запрос клиента
query {
  user(id: "42") {
    name
    posts {
      title
    }
  }
}`,
        },
        { type: 'heading', content: 'Резолверы' },
        {
          type: 'text',
          content:
            'Каждое поле схемы имеет резолвер — функцию `(parent, args, ctx, info) => value`. Сервер обходит запрос сверху вниз, вызывая резолверы. По умолчанию у каждого поля есть default resolver, который читает одноимённое свойство у parent.',
        },
        {
          type: 'code',
          language: 'typescript',
          content: `const resolvers = {
  Query: {
    user: (_, { id }, ctx) => ctx.db.users.findById(id),
  },
  User: {
    // Резолвер для вложенного поля posts
    posts: (user, _, ctx) => ctx.db.posts.findByAuthor(user.id),
  },
};`,
        },
        { type: 'heading', content: 'Проблема N+1' },
        {
          type: 'text',
          content:
            'Запрос `{ users { posts { title } } }` без оптимизации делает 1 запрос за пользователями + N запросов за постами каждого. На списке из 100 пользователей — 101 SQL-запрос. Это классическая «N+1 query problem».',
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'N+1 — главная причина деградации GraphQL в продакшене. На локальной машине 100 запросов выполняются за 50 мс, в проде с RTT 5 мс — 500 мс на одну страницу.',
        },
        {
          type: 'text',
          content:
            'GraphQL не серебряная пуля. Сложнее кешировать (нет стандартных HTTP кеш-заголовков для POST). N+1 проблема — klassicheskaya: 100 пользователей и для каждого отдельный SQL на посты. Решение — DataLoader.',
        },
        { type: 'heading', content: 'DataLoader' },
        {
          type: 'text',
          content:
            'DataLoader — библиотека от Facebook. Каждый резолвер кладёт ключ в очередь; в конце текущего тика event loop все ключи объединяются в один batch-запрос; результаты раздаются обратно в порядке ключей. Также делает per-request cache.',
        },
        {
          type: 'code',
          language: 'typescript',
          content: `import DataLoader from 'dataloader';

// Создаётся на каждый запрос (важно для изоляции кеша)
function createPostsByAuthorLoader(db) {
  return new DataLoader<string, Post[]>(async (authorIds) => {
    const posts = await db.posts.where('authorId', 'in', authorIds);
    // Группируем по authorId и возвращаем В ТОМ ЖЕ ПОРЯДКЕ ключей.
    return authorIds.map((id) => posts.filter((p) => p.authorId === id));
  });
}

// В резолвере
const resolvers = {
  User: {
    posts: (user, _, ctx) => ctx.loaders.postsByAuthor.load(user.id),
  },
};`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Создавайте loader на каждый HTTP-запрос (например, в context). Если loader глобальный — кеш переживёт между запросами и вы получите stale-данные.',
        },
        { type: 'heading', content: 'Минусы GraphQL' },
        {
          type: 'list',
          content: `- HTTP-кеш CDN не работает — все запросы POST на один URL.
- Сложно ограничить «дорогие» запросы (need query complexity analysis).
- Подзапросы могут быть произвольной глубины — нужен max-depth.
- Версионирование «через добавление полей и @deprecated» — нет major-версий.
- Авторизация на уровне поля сложнее, чем в REST.`,
        },
      ],
      flashcardIds: ['sda-f3', 'sda-f4'],
      checkpoint: [Q['sda-q4']!, {
        type: 'ordering',
        id: 'sdapi-ord1',
        description: 'Расставь уровни версионирования REST API от наиболее к наименее распространённым на практике',
        items: [
          'URL path: /api/v1/users',
          'Query parameter: /api/users?version=1',
          'Header: Accept: application/vnd.api+v1+json',
          'Subdomain: v1.api.example.com',
        ],
        explanation: 'URL версионирование — самое явное и простое для понимания. Header-based — \'чистый\' REST но сложнее тестировать. Query param — удобен но загрязняет URL. Главное: версионировать сразу, менять версию при breaking changes.',
      }],
      docsLink: { url: 'https://habr.com/ru/articles/326986/', title: 'Введение в GraphQL — Habr' },
      links: [
        {
          url: 'https://graphql.org/learn/',
          title: 'Learn GraphQL — graphql.org',
          source: 'article',
          language: 'en',
          note: 'Официальное введение: схемы, запросы, мутации, подписки, резолверы. Лучший старт перед DataLoader и федерацией.',
        },
      ],
    },

    {
      id: 'grpc-trpc',
      title: 'gRPC, Protobuf и tRPC',
      estimatedMinutes: 8,
      blocks: [
        {
          type: 'text',
          content:
            'gRPC и tRPC — два полюса API-дизайна для внутреннего использования. gRPC — бинарный протокол поверх HTTP/2 с Protobuf, даёт максимальную производительность и типобезопасность через кодогенерацию. tRPC — TypeScript-first подход без кодогенерации вообще: контракт это сам TypeScript тип.',
        },
        {
          type: 'text',
          content:
            'Аналогия: gRPC — это строгий контракт в PDF с нотариальным заверением, который должны подписать обе стороны до начала работы. tRPC — живое рукопожатие через общий TypeScript тип: нет .proto файлов, нет кодогенерации, просто один import. Главная ловушка с gRPC: он не работает в браузере напрямую — нужен grpc-web прокси, потому что браузер не умеет в HTTP/2 framing нужного формата. На собеседовании вопрос «когда tRPC вместо REST» — ответ прост: когда весь стек на TypeScript и не нужен публичный API — tRPC дает end-to-end типы без единой строчки схемы.',
        },
        { type: 'heading', content: 'gRPC и Protocol Buffers' },
        {
          type: 'text',
          content:
            'gRPC — RPC-фреймворк от Google: HTTP/2 как транспорт, Protocol Buffers как сериализация, кодогенерация клиентов и серверов на десятках языков. Контракт описывается в `.proto`-файле и компилируется в типы для каждого языка.',
        },
        {
          type: 'code',
          language: 'protobuf',
          content: `// user.proto
syntax = "proto3";

service UserService {
  rpc GetUser (GetUserRequest) returns (User);
  rpc ListUsers (ListUsersRequest) returns (stream User); // server streaming
  rpc UploadAvatars (stream AvatarChunk) returns (UploadStatus); // client streaming
  rpc Chat (stream Message) returns (stream Message); // bidirectional
}

message User {
  int64 id = 1;
  string name = 2;
  string email = 3;
}

message GetUserRequest {
  int64 id = 1;
}`,
        },
        {
          type: 'list',
          content: `- **HTTP/2** — мультиплексирование (много вызовов в одном TCP), header compression, server push.
- **Protobuf** — бинарь, в 3–10× компактнее JSON, обратная совместимость через номера полей.
- **4 вида вызовов**: unary, server-streaming, client-streaming, bidirectional.
- **Кодогенерация** — типы синхронизированы между клиентом и сервером.
- **Минус для веба**: браузер не умеет читать HTTP/2-trailer, нужен gRPC-Web (через прокси).`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Главная сила Protobuf — **обратная совместимость по номерам полей**. Поле `string name = 2` нельзя переименовать без проблем (это не name, а 2-е поле). Удалять поле тоже нельзя — только пометить `reserved 2`. Это спасает от breaking change на десятилетия.',
        },
        { type: 'heading', content: 'tRPC: TypeScript как контракт' },
        {
          type: 'text',
          content:
            'tRPC родился из идеи: «зачем нам OpenAPI/Protobuf/SDL, если у нас и сервер, и клиент на TypeScript в одном монорепо?». Клиент импортирует **тип** серверного роутера и получает полностью типизированные вызовы, без runtime-схемы и кодогенерации.',
        },
        {
          type: 'code',
          language: 'typescript',
          content: `// server/router.ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const appRouter = t.router({
  getUser: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => ctx.db.users.findById(input.id)),

  createUser: t.procedure
    .input(z.object({ email: z.string().email(), name: z.string() }))
    .mutation(({ input, ctx }) => ctx.db.users.create(input)),
});

// Экспортируем ТОЛЬКО ТИП (не код!)
export type AppRouter = typeof appRouter;

// client.ts
import type { AppRouter } from '../server/router';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

const trpc = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: '/api/trpc' })],
});

const user = await trpc.getUser.query({ id: '42' });
//          ^? const user: User    — типы выводятся автоматически!`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'tRPC использует Zod (или другие schema-libs) для **runtime-валидации** input. На клиенте Zod не запускается — ему достаточно типов. Если поле обязательное и не передано — сервер вернёт 400 ещё до выполнения процедуры.',
        },
        { type: 'heading', content: 'Когда что выбирать' },
        {
          type: 'list',
          content: `- **REST** — публичный API с разнообразными клиентами (мобильные, third-party, CLI).
- **GraphQL** — фронтенд, который собирает данные из десятков сервисов; мобильные с тонким каналом.
- **gRPC** — межсервисное общение в Kubernetes, высокая нагрузка, разные языки.
- **tRPC** — Next.js / SvelteKit / Remix-приложение в монорепо, full-stack TypeScript, быстрая итерация.`,
        },
      ],
      flashcardIds: ['sda-f5', 'sda-f6', 'sda-f13'],
      docsLink: { url: 'https://habr.com/ru/hub/grpc/', title: 'gRPC — Habr' },
      video: {
        source: 'youtube',
        id: '2-407yO8nEU',
        title: 'Discussing tRPC & GraphQL with Theo Browne & Max Stoiber',
        channel: 'Real World React',
        language: 'en',
        durationSec: 60 * 60,
        description: 'Тео Браун и Макс Штойбер: когда tRPC уместнее GraphQL и наоборот. Живой контекст для понимания современного API-стека.',
      },
      links: [
        {
          url: 'https://grpc.io/docs/what-is-grpc/introduction/',
          title: 'What is gRPC? — grpc.io',
          source: 'article',
          language: 'en',
          note: 'Официальная документация gRPC: HTTP/2, Protobuf, четыре вида вызовов, кодогенерация.',
        },
        {
          url: 'https://trpc.io/docs/concepts',
          title: 'tRPC — Concepts',
          source: 'article',
          language: 'en',
          note: 'Концепции tRPC: роутер, процедуры, контекст, мидлвары. Достаточно для ответа на вопросы про tRPC на собеседовании.',
        },
      ],
      playground: {
        starterCode: `// Дано: TypeScript-моно-репо с Next.js. Бэкенд и фронт на TS.
// Команда из 3 человек. Третьих сторон у API нет.
// Вопрос: какой стиль API даст быстрейшую итерацию?
//
// Допишите имя стиля строкой ('rest' | 'graphql' | 'grpc' | 'trpc').
const choice = '';

console.log(choice);`,
        expectedOutput: 'trpc',
        description:
          'Контекст: TS-моно-репо, нет внешних клиентов, маленькая команда. Здесь tRPC даёт максимум: типы синхронизируются автоматически, без OpenAPI/SDL. Если бы у API были третьи стороны — ответ был бы REST или GraphQL.',
      },
    },

    {
      id: 'versioning',
      title: 'Версионирование и обратная совместимость',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'API — это публичный контракт. Как только кто-то начал его использовать, ты не можешь просто взять и поменять структуру ответа. Версионирование — это способ эволюционировать API не ломая существующих клиентов. Три основных подхода: URL-версионирование (/v2/users), заголовки (Accept: application/vnd.v2+json), query-параметр (?version=2).',
        },
        {
          type: 'text',
          content:
            'Представь смартфон с обратной совместимостью: старые приложения работают после обновления iOS. А теперь представь ломающее обновление iOS, которое ломает все старые приложения — это и есть breaking change без версионирования. Главная ловушка — breaking change в «minor» версии: многие думают что semver 1.2.0 → 1.3.0 безопасен, но удаление поля или изменение типа — это ломающее изменение независимо от номера. На собеседовании вопрос «как deprecate API без downtime» — ответ: Sunset header с датой, параллельная поддержка старой версии, мониторинг использования старых эндпоинтов и предупреждения клиентам.',
        },
        { type: 'heading', content: 'Три способа версионирования' },
        {
          type: 'code',
          language: 'http',
          content: `# 1. URL-based (самый частый)
GET /v1/users/42

# 2. Header-based (через media type)
GET /users/42
Accept: application/vnd.example.v2+json

# 3. Query-based
GET /users/42?version=2`,
        },
        {
          type: 'list',
          content: `- **URL** — проще всего отлаживать в браузере и кешировать на CDN. Минус: плодит маршруты, /v1/ и /v2/ — это «два разных API». Используют Stripe, Twitter, Twilio.
- **Header** — URI стабильный, ресурс «один», но сложнее тестировать. Используют GitHub (Accept: application/vnd.github.v3+json), Heroku.
- **Query** — легко переключать в браузере, но плохо кешируется CDN, легко «забыть» в URL. Применяется реже.`,
        },
        { type: 'heading', content: 'Что считается breaking change' },
        {
          type: 'list',
          content: `**Ломающие изменения** (требуют новой major-версии):
- Удаление поля из ответа.
- Переименование поля.
- Изменение типа поля (number → string).
- Превращение опционального поля в обязательное во входных данных.
- Изменение формата ошибок.
- Сужение диапазона значений (enum: убрали один из вариантов).

**Не ломающие** (можно в той же версии):
- Добавление нового опционального поля в ответ.
- Добавление нового опционального поля во вход.
- Новый эндпоинт.
- Новый код ошибки (если клиент обрабатывает «неизвестные» как 5xx).`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Главное правило долгоживущего API: **always-additive**. Добавляйте поля, никогда не удаляйте и не переименовывайте. Если совсем надо — выпускайте новую major-версию.',
        },
        {
          type: 'text',
          content:
            'Ловушка: «просто добавим поле, это же не breaking change». Но удаление поля или изменение типа поля — это breaking change. На собеседовании спрашивают: «что является breaking change в REST API?» Добавление поля — нет. Удаление, переименование, изменение типа — да.',
        },
        { type: 'heading', content: 'Депрекация и Sunset' },
        {
          type: 'text',
          content:
            'Когда вы решаете убрать старую версию, нужно объявить дату вывода. RFC 8594 определяет HTTP-заголовок `Sunset` — дата, после которой эндпоинт перестанет работать. Также используется `Deprecation` (RFC 9745).',
        },
        {
          type: 'code',
          language: 'http',
          content: `HTTP/1.1 200 OK
Deprecation: Sun, 11 Nov 2025 23:59:59 GMT
Sunset: Sun, 11 Nov 2026 23:59:59 GMT
Link: <https://api.example.com/v2/users>; rel="successor-version"`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Стандартный срок депрекации публичного API — 6–12 месяцев. Меньше — и third-party интеграции не успеют мигрировать. Для внутренних API срок может быть короче, но не меньше одного спринта (2–3 недели).',
        },
      ],
      flashcardIds: ['sda-f7', 'sda-f14'],
      checkpoint: [Q['sda-q9']!],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/Headers', title: 'HTTP-заголовки — MDN (ru)' },
    },

    {
      id: 'pagination',
      title: 'Пагинация: offset vs cursor',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Пагинация — базовая механика любого API который возвращает списки. Два основных подхода: offset/limit (просто, интуитивно, но деградирует на больших данных) и cursor-пагинация (сложнее реализовать, но масштабируется). Понимание разницы — обязательный минимум для backend/API собеседования.',
        },
        {
          type: 'text',
          content:
            'Аналогия: offset — это «открой страницу 47 книги», cursor — это «открой после закладки». Если кто-то вставляет новые записи пока ты листаешь, с offset смещение «сдвигается» — ты пропустишь одни записи и увидишь другие дважды. Cursor хранит непрозрачный токен с позицией последнего элемента, поэтому вставки не влияют на твою позицию. На собеседовании вопрос «почему cursor обязателен для real-time фидов» — именно это: в Twitter или Instagram лента обновляется пока ты читаешь, и только cursor гарантирует что ты не пропустишь и не повторишь записи.',
        },
        { type: 'heading', content: 'Offset/limit' },
        {
          type: 'code',
          language: 'http',
          content: `GET /posts?page=10&limit=20
# Эквивалент SQL:
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 180;`,
        },
        {
          type: 'list',
          content: `**Плюсы:**
- Очень просто: достаточно двух чисел.
- Можно «перейти на страницу 15» — рандомный доступ.
- Знаете total — показываете «1 из 50 страниц».

**Минусы:**
- На больших offset деградирует: БД читает и отбрасывает offset строк → O(offset).
- При вставках/удалениях между запросами — «прыжки»: одна и та же запись на двух страницах или пропуск.
- Считать total на больших таблицах дорого (COUNT без условий).`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'OFFSET 1 000 000 в PostgreSQL — это секунды CPU и full index scan. Бесконечная прокрутка с offset на ленте Twitter превратилась бы в DDoS.',
        },
        {
          type: 'text',
          content:
            'Аналогия: offset — «открой книгу на 500-й странице». Книга одна, и физически нужно перелистать 499 страниц. Cursor — «начни читать после закладки». Сразу переходишь к нужному месту через индекс. Именно поэтому cursor — стандарт для продуктовых лент.',
        },
        { type: 'heading', content: 'Cursor pagination' },
        {
          type: 'text',
          content:
            'Cursor — непрозрачный токен, в котором закодирована позиция последнего элемента (id, timestamp, или их комбинация). Сервер расшифровывает его и продолжает выборку с этого места.',
        },
        {
          type: 'code',
          language: 'http',
          content: `# 1-й запрос
GET /posts?limit=20

# Ответ:
{
  "items": [...],
  "nextCursor": "eyJpZCI6MTAyMCwidHMiOjE3MDB9"
}

# Cursor расшифровывается как { id: 1020, ts: 1700 }
# 2-й запрос:
GET /posts?limit=20&cursor=eyJpZCI6MTAyMCwidHMiOjE3MDB9

# Эквивалент SQL (keyset pagination):
SELECT * FROM posts
WHERE (created_at, id) < ($cursor_ts, $cursor_id)
ORDER BY created_at DESC, id DESC
LIMIT 20;`,
        },
        {
          type: 'list',
          content: `**Плюсы:**
- O(log n) независимо от глубины (использует индекс).
- Стабильна к вставкам и удалениям.
- Используется в Twitter, Instagram, Slack, GraphQL Relay.

**Минусы:**
- Нельзя «перейти на 15-ю страницу» — только next/prev.
- Cursor должен быть непрозрачным (base64) — клиент не должен парсить.
- Сложнее реализовать (требуется составной индекс + tie-breaker по id).`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Tie-breaker по id обязателен: если у двух записей одинаковый created_at, без id вы получите бесконечный цикл «next». Поэтому cursor — это пара (timestamp, id).',
        },
        { type: 'heading', content: 'Когда что выбирать' },
        {
          type: 'list',
          content: `- **Offset** — админка, отчёты, поиск с «перейти на страницу 12». Лимит на глубину (max offset 10 000).
- **Cursor** — публичные ленты, бесконечная прокрутка, экспорт больших таблиц.
- **Гибрид**: первые 10 страниц через offset, дальше — cursor (Slack так делает).`,
        },
      ],
      flashcardIds: ['sda-f8'],
      checkpoint: [Q['sda-q13']!],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/Methods', title: 'HTTP-методы — MDN (ru)' },
    },

    {
      id: 'errors-contracts',
      title: 'Ошибки и контракты',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Ошибки в API — не исключение, а часть контракта. Хороший API возвращает понятный код статуса (4xx/5xx), машиночитаемый тип ошибки и человекочитаемое описание. Клиент должен ветвиться по типу ошибки, а не парсить текст сообщения.',
        },
        {
          type: 'text',
          content:
            'Хорошо спроектированные ошибки экономят сотни часов отладки. Плохо — добавляют их. Главное правило: ошибка должна быть **машинно-читаемой** (клиент может switch-нуться по типу) и **человеко-читаемой** (разработчик видит, что делать).',
        },
        { type: 'heading', content: 'Два подхода: HTTP-коды vs envelope' },
        {
          type: 'code',
          language: 'http',
          content: `# Подход 1: HTTP-коды + Problem Details (RFC 7807)
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/problem+json

{
  "type": "https://api.example.com/errors/validation",
  "title": "Validation failed",
  "status": 422,
  "detail": "email is required",
  "instance": "/users",
  "errors": [
    { "field": "email", "code": "required" }
  ]
}

# Подход 2: всегда 200 + envelope (как делал GraphQL)
HTTP/1.1 200 OK
Content-Type: application/json

{
  "ok": false,
  "error": { "code": "VALIDATION_FAILED", "message": "email is required" },
  "data": null
}`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'HTTP-коды лучше для REST: они работают с CDN, прокси, клиентскими retry-стратегиями (axios знает, что 5xx — ретраить, 4xx — нет). Envelope лучше для GraphQL и WebSocket, где сам транспорт всегда возвращает «успех».',
        },
        { type: 'heading', content: 'RFC 7807 Problem Details' },
        {
          type: 'list',
          content: `Стандартные поля:
- **type** — стабильный URI ошибки (только по нему клиент должен ветвиться).
- **title** — краткое человеко-читаемое описание (стабильно для одного type).
- **status** — HTTP-код (дублирует, но удобно для логов).
- **detail** — длинный текст (НЕ парсить, только для логов и UI).
- **instance** — URI конкретной ошибки (для трейсинга).

Можно расширять: errors[], traceId, retryAfter, balance — что угодно.`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Никогда не делайте логику клиента, парся `detail` или `title`. Эти поля **могут меняться** без новой версии API. Только `type` стабилен.',
        },
        {
          type: 'text',
          content:
            'Частая ошибка: «всё возвращаем 200 OK с флагом success: false в теле». Это сломало бы CDN-кеширование, retry-логику axios и мониторинг по HTTP-статусам. Правильный HTTP-код — это и есть семантика. 422 — не то же самое что 400, и это важно.',
        },
        { type: 'heading', content: 'Контракты как код' },
        {
          type: 'text',
          content:
            'Контракт API — это машинно-читаемое описание: эндпоинты, схемы, ошибки, аутентификация. Из него генерируется документация, клиенты, мок-серверы и тесты. Single source of truth для всех команд.',
        },
        {
          type: 'list',
          content: `- **OpenAPI 3.1** — для REST. Поддерживает JSON Schema 2020-12.
- **Protobuf** — для gRPC. Описывает сообщения и сервисы.
- **GraphQL SDL** — для GraphQL. Описывает типы и операции.
- **AsyncAPI** — для event-driven (Kafka, RabbitMQ).
- **TypeSpec** (Microsoft) — высокоуровневый язык, компилируется в OpenAPI/Protobuf/GraphQL.`,
        },
        {
          type: 'code',
          language: 'yaml',
          content: `# openapi.yaml
openapi: 3.1.0
info:
  title: Users API
  version: 1.0.0
paths:
  /users/{id}:
    get:
      summary: Get user by id
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
      responses:
        '200':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/User' }
        '404':
          content:
            application/problem+json:
              schema: { $ref: '#/components/schemas/Problem' }
components:
  schemas:
    User:
      type: object
      required: [id, email]
      properties:
        id: { type: integer }
        email: { type: string, format: email }
        name: { type: string }`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Контрактные тесты (Pact, Schemathesis) — лучшая защита от breaking change. CI прогоняет тесты на новой версии API против схемы старой версии и падает, если что-то изменилось несовместимо.',
        },
      ],
      flashcardIds: ['sda-f9', 'sda-f10', 'sda-f12'],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/Status', title: 'HTTP-статусы — MDN (ru)' },
    },
  ],

  finalQuiz: quizQuestions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  flashcards,

  cheatsheet: `### Шпаргалка по дизайну API

**HTTP-методы:**
- **Safe** (не меняют состояние): GET, HEAD, OPTIONS.
- **Idempotent** (повтор = то же состояние): GET, HEAD, OPTIONS, PUT, DELETE.
- **Не idempotent**: POST, PATCH → \`Idempotency-Key\` (Stripe-pattern, TTL 24ч).

**Статусы:** 200/201 (+ Location)/204; 400 (синтаксис), 401 (нет auth), 403 (нет прав), 404, 409 (конфликт), 422 (валидация), 429 (+ Retry-After); 500/502/503/504.

**Стили:**
- **REST** — публичные API, разные клиенты, HTTP-кеш на CDN.
- **GraphQL** — агрегация из многих источников; берегитесь N+1 (DataLoader).
- **gRPC** — HTTP/2 + Protobuf, стриминг, микросервисы; в браузере только через gRPC-Web.
- **tRPC** — TS-моно-репо, end-to-end типы без OpenAPI/SDL.

**Версионирование:** URL (/v2 — Stripe), header (vnd.x.v2+json — GitHub), query (?v=2). Always-additive; Sunset/Deprecation для вывода.

**Пагинация:** offset — админки; cursor (keyset) — ленты и большие таблицы, O(log n), стабильна к вставкам.

**Ошибки:** RFC 7807 application/problem+json. Только \`type\` стабилен. Контракт — OpenAPI / Protobuf / GraphQL SDL.`,

  interviewQA: [
    {
      id: 'sda-iq1',
      question: 'Что такое идемпотентность и какие HTTP-методы идемпотентны? Как сделать POST идемпотентным?',
      shortAnswer:
        'Идемпотентный метод — повторный вызов оставляет ресурс в том же состоянии. По RFC 9110: GET, HEAD, OPTIONS, PUT, DELETE. POST по умолчанию — нет; делается идемпотентным через заголовок Idempotency-Key.',
      fullAnswer: `**Идемпотентность** — свойство операции, при котором её повторное выполнение не меняет состояние ресурса по сравнению с однократным. Это **не** про равенство ответов: DELETE /users/42 первый раз вернёт 200, второй — 404, но состояние БД одно и то же (пользователя нет).

**По RFC 9110 идемпотентны**: GET, HEAD, OPTIONS, PUT, DELETE. **Не идемпотентны**: POST, PATCH. Safe-методы (GET, HEAD, OPTIONS) дополнительно не меняют состояние вообще.

Почему это важно: в распределённой системе ретраи неизбежны. Клиент отправил POST /charges, не получил ответ из-за таймаута — он не знает, прошёл платёж или нет. Если POST не идемпотентен, ретрай создаст второй платёж.

**Как сделать POST идемпотентным** — паттерн Stripe/PayPal:
1. Клиент генерирует UUID **до** первой попытки и кладёт его в заголовок \`Idempotency-Key\`.
2. Сервер на каждом запросе делает \`SELECT ... WHERE key = ?\` в Redis или таблице idempotency_keys.
3. Если ключ найден — возвращает сохранённый ответ, не выполняя операцию.
4. Если нет — выполняет, сохраняет (key, request_hash, response) с TTL 24 часа.
5. Если тело отличается от первого вызова с тем же ключом — 422 Unprocessable Entity.

Это спасает от двойных платежей при сетевых ретраях и от race condition на стороне клиента.`,
      followUps: [
        'Чем отличается safe от idempotent? Какие методы и safe, и idempotent?',
        'Как организовать хранилище для Idempotency-Key — Redis или Postgres?',
        'Что делать, если клиент отправил два разных запроса с одним ключом?',
      ],
      relatedChapterId: 'rest-resources',
    },
    {
      id: 'sda-iq2',
      question: 'Чем REST отличается от GraphQL и gRPC? Когда какой стиль выбирать?',
      shortAnswer:
        'REST — ресурсы по URI и HTTP-методы, кешируется CDN, любой клиент. GraphQL — один эндпоинт, клиент описывает поля, решает over/under-fetching. gRPC — HTTP/2 + Protobuf, бинарь, стриминг, для микросервисов.',
      fullAnswer: `**REST** — архитектурный стиль поверх HTTP. Оперирует ресурсами (URI как существительное) и стандартными методами (GET/POST/PUT/PATCH/DELETE). Плюсы: HTTP-кеш на CDN работает «из коробки», любой клиент (curl, браузер, мобайл) понимает; широкая инструментальная поддержка. Минусы: over-fetching (приходит больше данных, чем нужно фронту) и under-fetching (надо делать несколько запросов). Идеален для публичного API.

**GraphQL** — язык запросов и runtime от Facebook. Один эндпоинт (POST /graphql), типизированная схема (SDL), клиент сам описывает нужные поля. Плюсы: решает over/under-fetching, схема как документация, легко эволюционировать через @deprecated. Минусы: HTTP-кеш не работает (всё POST на один URL), N+1 без DataLoader, сложно ограничить «дорогие» запросы. Идеален для BFF и мобильных клиентов с тонким каналом.

**gRPC** — RPC поверх HTTP/2 + Protocol Buffers. Кодогенерация клиентов и серверов на десятках языков. Плюсы: бинарь в 3–10× компактнее JSON, стриминг (4 вида: unary, server, client, bidirectional), строгий контракт через .proto. Минусы: в браузере «из коробки» не работает (нужен gRPC-Web через прокси), сложнее отлаживать. Идеален для межсервисного общения в Kubernetes.

**tRPC** — RPC для TypeScript-стека: клиент импортирует тип серверного роутера, типы синхронизируются автоматически без OpenAPI/SDL/Protobuf. Идеален для full-stack TS-моно-репо.

**Когда что выбирать:**
- Публичный API с разными клиентами → **REST**.
- Фронт собирает данные из десятков сервисов → **GraphQL**.
- Высоконагруженные микросервисы с разными языками → **gRPC**.
- Next.js/Remix-приложение в монорепо на TS → **tRPC**.
- Реальные системы комбинируют: REST/GraphQL наружу, gRPC внутри.`,
      followUps: [
        'Что такое N+1 problem в GraphQL и как с ней бороться?',
        'Почему gRPC плохо работает в браузере без прокси?',
        'Когда tRPC проигрывает GraphQL в одном и том же стеке?',
      ],
      relatedChapterId: 'styles-overview',
    },
    {
      id: 'sda-iq3',
      question: 'Как версионировать публичный REST API?',
      shortAnswer:
        'Три подхода: URL (/v1/users — Stripe), header (Accept: vnd.x.v2+json — GitHub), query (?v=2). Always-additive: добавляйте поля, не удаляйте. Для вывода версии — заголовки Sunset (RFC 8594) и Deprecation.',
      fullAnswer: `Версионирование — контракт о том, **что вы можете менять, не ломая существующих клиентов**.

**Три способа:**
1. **URL-based** (\`/v1/users\`, \`/v2/users\`): просто отлаживать, легко кешировать на CDN, но плодит маршруты. Используют Stripe, Twitter, Twilio. Самый частый.
2. **Header-based** через media type (\`Accept: application/vnd.example.v2+json\`): URI стабилен, ресурс «один и тот же», но сложнее тестировать в браузере. Используют GitHub, Heroku.
3. **Query-based** (\`?version=2\`): легко переключать в URL, но плохо кешируется CDN, легко «потерять» в логах. Применяется реже.

**Always-additive подход — основа долгоживущего API:**

*Не ломающие изменения* (можно в той же версии): добавление опционального поля в ответ, добавление опционального поля во вход, новый эндпоинт, новый код ошибки.

*Ломающие* (требуют новой major-версии): удаление поля, переименование, изменение типа, превращение опционального во обязательный, изменение формата ошибок.

**Депрекация:** когда вы решаете убрать старую версию, объявите дату через заголовки RFC 8594 \`Sunset\` (когда перестанет работать) и RFC 9745 \`Deprecation\` (когда объявлено устаревшим). Стандартный срок депрекации публичного API — 6–12 месяцев.

**Контрактные тесты** на CI (Pact, Schemathesis) ловят breaking change до релиза: прогоняют тесты старой версии против новой схемы.

На собеседовании сильный ответ — не «я бы выбрал URL», а «зависит от: сколько у нас сторонних клиентов, как часто меняется API, насколько важно кеширование на CDN». Stripe-style URL почти всегда корректный дефолт.`,
      followUps: [
        'Что считается breaking change, а что нет?',
        'Как реализовать заголовок Sunset на CDN-уровне?',
        'Чем GraphQL-эволюция «через @deprecated» отличается от REST-версионирования?',
      ],
      relatedChapterId: 'versioning',
    },
    {
      id: 'sda-iq4',
      question: 'Как пагинировать ленту с миллиардом записей? Чем cursor лучше offset?',
      shortAnswer:
        'Offset/limit деградирует: БД физически отбрасывает offset строк (O(offset)). Cursor — непрозрачный токен, кодирующий позицию (id, ts); WHERE (ts, id) < cursor работает за O(log n) и стабилен к вставкам.',
      fullAnswer: `**Offset/limit** прост (\`?page=10&limit=20\`), но имеет два фундаментальных дефекта:

1. **Производительность**: \`SELECT ... LIMIT 20 OFFSET 1000000\` физически читает и отбрасывает миллион строк. Postgres и MySQL не умеют «перематывать» индекс на N-ю позицию. На больших таблицах это секунды CPU.
2. **Стабильность**: между запросом первой и второй страницы кто-то вставил запись в начало → пользователь видит дубликаты, или удалил → пропускает запись.

**Cursor pagination** (keyset) хранит непрозрачный токен с позицией последнего элемента (id, timestamp, или их пара):

\`\`\`sql
SELECT * FROM posts
WHERE (created_at, id) < ($cursor_ts, $cursor_id)
ORDER BY created_at DESC, id DESC
LIMIT 20;
\`\`\`

Это использует составной индекс \`(created_at DESC, id DESC)\` напрямую → O(log n) независимо от глубины. Стабильно к вставкам/удалениям: новые записи появляются в начале, не сдвигая позиции уже выданных.

**Tie-breaker по id обязателен**: если два поста имеют одинаковый created_at, без id вы получите бесконечный цикл «next» (cursor никогда не сдвинется). Поэтому cursor — это пара.

**Cursor должен быть непрозрачным** (base64({"id":1020,"ts":1700})). Клиент не должен парсить его, а сервер может менять формат.

**Когда что выбирать:**
- **Offset** — админка, отчёты, поиск с «перейти на страницу 12». Лимит на глубину (max 10 000).
- **Cursor** — публичные ленты, бесконечная прокрутка, экспорт. Используют Twitter, Instagram, Slack, GraphQL Relay.
- **Гибрид** — Slack: первые 10 страниц offset, дальше cursor.

Минус cursor: нельзя «перейти на страницу 15», только next/prev. Для большинства лент это не нужно.`,
      followUps: [
        'Почему составной индекс по (created_at, id) важнее, чем просто по created_at?',
        'Как реализовать cursor для двунаправленной пагинации (prev/next)?',
        'Что делать, если данные меняются между страницами в cursor-пагинации?',
      ],
      relatedChapterId: 'pagination',
    },
    {
      id: 'sda-iq5',
      question: 'Как организовать формат ошибок REST API?',
      shortAnswer:
        'Используйте HTTP-коды + RFC 7807 application/problem+json. Поля type (стабильный URI ошибки), title, status, detail, instance. Только type стабилен для логики клиента; detail — для людей.',
      fullAnswer: `Хороший формат ошибок должен быть одновременно **машинно-читаемым** (клиент может switch-нуться) и **человеко-читаемым** (разработчик видит, что делать).

**Два подхода:**

1. **HTTP-коды + envelope** (RFC 7807 Problem Details): статус выражается HTTP-кодом, тело — JSON с полями \`type\`, \`title\`, \`status\`, \`detail\`, \`instance\`. Content-Type: application/problem+json.

2. **Always-200 + envelope**: HTTP всегда 200, ошибка в теле \`{ ok: false, error: {...} }\`. Так делает GraphQL.

**HTTP-коды лучше для REST**: они работают с CDN, прокси, retry-стратегиями axios (4xx — не ретраить, 5xx — ретраить с экспоненциальным backoff). Always-200 имеет смысл только для GraphQL и WebSocket, где транспорт всегда возвращает «успех».

**RFC 7807 — стандарт:**
\`\`\`json
{
  "type": "https://api.example.com/errors/insufficient-funds",
  "title": "Insufficient funds",
  "status": 422,
  "detail": "Account balance is 50, requested 100",
  "instance": "/transfers/abc-123",
  "balance": 50
}
\`\`\`

- \`type\` — **стабильный URI**, единственное поле, по которому клиент должен ветвиться.
- \`title\` — краткое описание, стабильно для одного type, но может меняться без новой версии.
- \`detail\` — длинный текст, **никогда** не парсить.
- \`instance\` — URI конкретной ошибки для трейсинга.
- Можно расширять: \`errors[]\` для валидации, \`traceId\`, \`retryAfter\`, \`balance\`.

**Какие статусы для каких ошибок:**
- 400 — синтаксис (битый JSON).
- 401 — нет аутентификации («кто ты?»).
- 403 — есть, но нет прав («знаю, но нельзя»).
- 404 — ресурса нет.
- 409 — конфликт (одновременная запись, дубль).
- 422 — синтаксис ок, бизнес-валидация не прошла (RFC 4918).
- 429 — rate limit (+ \`Retry-After\`).
- 500/502/503/504 — ошибки сервера и upstream.

Главное правило: клиент **никогда** не парсит \`detail\` или \`title\` — только \`type\` стабилен.`,
      followUps: [
        'Чем 401 отличается от 403?',
        'Когда уместно 409, а когда 422?',
        'Как описать массив ошибок валидации в Problem Details?',
      ],
      relatedChapterId: 'errors-contracts',
    },
    {
      id: 'sda-iq6',
      question: 'Что такое N+1 problem в GraphQL и как её решает DataLoader?',
      shortAnswer:
        'N+1 — антипаттерн: 1 запрос за родителями + N запросов за их детьми. DataLoader батчит ключи внутри одного тика event loop в один запрос и кеширует результат на время одного HTTP-запроса.',
      fullAnswer: `Запрос \`{ users { posts { title } } }\` без оптимизации делает 1 SQL за списком пользователей и **N отдельных SQL** за постами каждого. На списке из 100 — 101 запрос. Это N+1 query problem, главная причина деградации GraphQL в проде.

В REST она тоже встречается, но в GraphQL — острее, потому что клиент сам решает глубину вложенности.

**DataLoader** (библиотека от Facebook) решает её через два механизма:

1. **Батчинг.** Каждый резолвер кладёт ключ в очередь loader'а. В конце текущего тика event loop (через \`process.nextTick\` или \`Promise.resolve().then\`) все ключи объединяются в один массив и передаются в \`batchFn\`. Та делает один SQL и возвращает массив результатов в порядке ключей.

2. **Per-request cache.** Запрос одного и того же id внутри одного HTTP-запроса делает один SQL. Между запросами — кеш чист (loader создаётся в context на каждый запрос).

\`\`\`typescript
const userLoader = new DataLoader<string, User>(async (ids) => {
  const users = await db.users.where('id', 'in', ids);
  return ids.map((id) => users.find((u) => u.id === id));
});

// В резолвере:
const resolvers = {
  Post: {
    author: (post, _, ctx) => ctx.loaders.user.load(post.authorId),
  },
};
\`\`\`

**Критично**: \`batchFn\` должна вернуть результаты **в том же порядке ключей**, что и пришли. Если в БД нет записи — на её месте \`null\` или \`Error\`.

**Создавать loader на каждый HTTP-запрос** (в context). Если loader глобальный — кеш переживёт между запросами разных пользователей и вы получите утечку приватных данных.

**Что ещё помогает в GraphQL:**
- Query complexity analysis: каждое поле имеет «вес», запросы с весом > N отклоняются.
- Persisted queries: клиент шлёт хэш заранее зарегистрированного запроса, не сам запрос.
- Max depth и max alias limit.
- Federation вместо одного гигантского монолита.`,
      followUps: [
        'Почему DataLoader использует именно конец тика event loop, а не setTimeout?',
        'Что произойдёт, если batchFn вернёт меньше элементов, чем ключей?',
        'Как сочетать DataLoader с Redis-кешем между запросами?',
      ],
      relatedChapterId: 'graphql',
    },
    {
      id: 'sda-iq7',
      question: 'Когда выбирать tRPC, а не REST или GraphQL?',
      shortAnswer:
        'tRPC уместен в TypeScript-моно-репо, где и сервер, и клиент пишет одна команда. End-to-end типизация без OpenAPI/SDL/Protobuf. Не подходит, если у API есть третьи стороны, мобильные клиенты не на TS, или гетерогенный бэкенд.',
      fullAnswer: `**tRPC** — RPC для TypeScript-стека. Клиент импортирует **тип** серверного роутера (\`type AppRouter = typeof appRouter\`) и получает полностью типизированные вызовы — без runtime-схемы, без кодогенерации, без OpenAPI/SDL/Protobuf.

\`\`\`typescript
// server: type AppRouter = typeof appRouter;
// client: const user = await trpc.getUser.query({ id: '42' });
//                ^? const user: User    — типы выводятся автоматически
\`\`\`

**Преимущества:**
- Рефакторинг сервера автоматически ломает компиляцию клиента — ошибки видны на этапе сборки, не в проде.
- Нулевой контракт-overhead: нет YAML, .proto или SDL.
- Интеграция с TanStack Query (React Query) для кеширования.
- Скорость итерации: добавил процедуру на сервере — клиент видит её через секунду.

**Когда tRPC — правильный выбор:**
- Next.js / Remix / SvelteKit-приложение в монорепо.
- Команда из 2–10 человек, full-stack TypeScript.
- Нет третьих сторон (только свой фронт).
- Быстрая итерация продукта важнее стандартизации.

**Когда tRPC — неправильный выбор:**
- У API есть **сторонние клиенты** (third-party, мобайл на Swift/Kotlin, CLI). Им нужна стандартная схема (OpenAPI/Protobuf), не TypeScript-импорт.
- **Гетерогенный бэкенд**: сервисы на Go, Python, Java — типы из TS-роутера им не помогут.
- **Долгоживущий публичный API**: tRPC заточен под итерацию, у него нет major-версионирования.
- **Большая организация** с separate frontend и backend командами: контракт нужен явный.

**На собеседовании** сильный ответ — не «tRPC лучше всего», а «tRPC оптимален в узком сценарии (TS-моно-репо, одна команда), и я бы выбрал REST/GraphQL для всего остального». Понимание границ применимости — то, что ищет senior-интервьюер.

**Альтернативы tRPC в TS-стеке**: Hono с RPC-builder, Effect Schema + ts-rest, ORPC. Принцип тот же — типы между клиентом и сервером без отдельного контракта.`,
      followUps: [
        'Как tRPC валидирует input, если на клиенте Zod не запускается?',
        'Чем httpBatchLink отличается от httpLink?',
        'Можно ли использовать tRPC с не-TypeScript клиентом?',
      ],
      relatedChapterId: 'grpc-trpc',
    },
  ],

  nextTopics: [
    { slug: 'sd-auth', reason: 'Как защищать API: OAuth 2.0, JWT, сессии, CSRF, rate limiting и rotation токенов.' },
    { slug: 'sd-scaling', reason: 'Как масштабировать API: горизонтальное шардирование, кеширование, очереди, идемпотентные ретраи в распределённых системах.' },
  ],
};
