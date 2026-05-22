import type { Problem } from "../../types/problem";

export const nodeNetworkProblems: Problem[] = [
  {
    id: "nodenet-p1",
    topicId: "node-network",
    title: "parseURL — разбор URL",
    difficulty: "easy",
    isContextual: false,
    description: `Реализуйте функцию \`parseURL(url)\`:
- Разбирает URL на компоненты
- Возвращает объект \`{ protocol, host, pathname, searchParams }\`
- \`searchParams\` — объект с параметрами запроса

Примеры:
\`\`\`
parseURL('https://example.com/users?id=1&role=admin');
// → {
//     protocol: 'https',
//     host: 'example.com',
//     pathname: '/users',
//     searchParams: { id: '1', role: 'admin' }
//   }

parseURL('http://localhost:3000/api');
// → { protocol: 'http', host: 'localhost:3000', pathname: '/api', searchParams: {} }
\`\`\``,
    functionName: "parseURL",
    starterCode: `function parseURL(url) {
  // ваш код
}`,
    testCases: [
      {
        id: "nodenet-p1-t1",
        inputDisplay: "https://example.com/users?id=1&role=admin",
        inputArgs: ["https://example.com/users?id=1&role=admin"],
        expected: {
          protocol: "https",
          host: "example.com",
          pathname: "/users",
          searchParams: { id: "1", role: "admin" },
        },
      },
      {
        id: "nodenet-p1-t2",
        inputDisplay: "http://localhost:3000/api — нет параметров",
        inputArgs: ["http://localhost:3000/api"],
        expected: {
          protocol: "http",
          host: "localhost:3000",
          pathname: "/api",
          searchParams: {},
        },
      },
      {
        id: "nodenet-p1-t3",
        inputDisplay: "корень пути /",
        inputArgs: ["https://example.com/"],
        expected: {
          protocol: "https",
          host: "example.com",
          pathname: "/",
          searchParams: {},
        },
      },
      {
        id: "nodenet-p1-t4",
        inputDisplay: "один параметр",
        inputArgs: ["https://api.io/search?q=hello"],
        expected: {
          protocol: "https",
          host: "api.io",
          pathname: "/search",
          searchParams: { q: "hello" },
        },
      },
      {
        id: "nodenet-p1-t5",
        inputDisplay: "URL с портом",
        inputArgs: ["http://localhost:8080/health"],
        expected: {
          protocol: "http",
          host: "localhost:8080",
          pathname: "/health",
          searchParams: {},
        },
      },
    ],
    hints: [
      "В JavaScript есть встроенный класс для разбора URL. Он предоставляет все нужные части как свойства.",
      "searchParams — это специальный объект. Как преобразовать его в обычный JS-объект с парами ключ-значение?",
      "protocol в стандарте включает символ-разделитель. Нужно ли его возвращать в результате?",
    ],
    solutionCode: `function parseURL(url) {
  const u = new URL(url);
  return {
    protocol: u.protocol.replace(':', ''),
    host: u.host,
    pathname: u.pathname,
    searchParams: Object.fromEntries(u.searchParams),
  };
}`,
  },
  {
    id: "nodenet-p2",
    topicId: "node-network",
    title: "buildQueryString — сборка query строки",
    difficulty: "easy",
    isContextual: false,
    description: `Реализуйте функцию \`buildQueryString(params)\`:
- Принимает объект параметров
- Возвращает строку запроса (без ведущего \`?\`)
- Значения должны быть URL-encoded (\`encodeURIComponent\`)
- Пустые/null/undefined значения пропускаются

Примеры:
\`\`\`
buildQueryString({ id: 1, name: 'John Doe' });
// → 'id=1&name=John%20Doe'

buildQueryString({ q: 'hello world', page: 2, limit: null });
// → 'q=hello%20world&page=2'

buildQueryString({});
// → ''
\`\`\``,
    functionName: "buildQueryString",
    starterCode: `function buildQueryString(params) {
  // ваш код
}`,
    testCases: [
      {
        id: "nodenet-p2-t1",
        inputDisplay: '{ id: 1, name: "John Doe" }',
        inputArgs: [{ id: 1, name: "John Doe" }],
        expected: "id=1&name=John%20Doe",
      },
      {
        id: "nodenet-p2-t2",
        inputDisplay: "null значения пропускаются",
        inputArgs: [{ q: "hello", page: 2, limit: null }],
        expected: "q=hello&page=2",
      },
      {
        id: "nodenet-p2-t3",
        inputDisplay: 'пустой объект → ""',
        inputArgs: [{}],
        expected: "",
      },
      {
        id: "nodenet-p2-t4",
        inputDisplay: "спецсимволы кодируются",
        inputArgs: [{ url: "https://a.com?x=1" }],
        expected: "url=https%3A%2F%2Fa.com%3Fx%3D1",
      },
      {
        id: "nodenet-p2-t5",
        inputDisplay: "undefined значения пропускаются",
        inputArgs: [{ a: "x", b: undefined, c: "y" }],
        expected: "a=x&c=y",
      },
    ],
    hints: [
      "Как перебрать все ключи объекта и построить строку вида `key=value&key2=value2`?",
      "Значения нужно закодировать для безопасной передачи в URL. Какая стандартная функция это делает?",
    ],
    solutionCode: `function buildQueryString(params) {
  return Object.entries(params)
    .filter(([, v]) => v != null)
    .map(([k, v]) => \`\${encodeURIComponent(k)}=\${encodeURIComponent(v)}\`)
    .join('&');
}`,
  },
  {
    id: "nodenet-p3",
    topicId: "node-network",
    title: "createRateLimiter — ограничитель запросов",
    difficulty: "medium",
    isContextual: false,
    description: `Реализуйте функцию \`createRateLimiter(limit, windowMs)\`:
- Возвращает функцию \`check(userId)\`
- \`check\` возвращает \`true\` если запрос разрешён, \`false\` если лимит превышен
- Реализует sliding window: считает запросы в последние \`windowMs\` миллисекунд
- Каждый пользователь имеет свой независимый счётчик

Примеры:
\`\`\`
const limiter = createRateLimiter(3, 1000); // 3 запроса в секунду

limiter.check('user1'); // true (1/3)
limiter.check('user1'); // true (2/3)
limiter.check('user1'); // true (3/3)
limiter.check('user1'); // false (превышен!)
limiter.check('user2'); // true (другой пользователь)
\`\`\``,
    functionName: "createRateLimiter",
    starterCode: `function createRateLimiter(limit, windowMs) {
  // ваш код — возвращает объект с методом check
}`,
    testCases: [
      {
        id: "nodenet-p3-t1",
        inputDisplay: "3 запроса в лимит → все true",
        inputArgs: ["within-limit"],
        expected: [true, true, true],
      },
      {
        id: "nodenet-p3-t2",
        inputDisplay: "4-й запрос → false",
        inputArgs: ["exceed"],
        expected: false,
      },
      {
        id: "nodenet-p3-t3",
        inputDisplay: "разные пользователи независимы",
        inputArgs: ["different-users"],
        expected: true,
      },
      {
        id: "nodenet-p3-t4",
        inputDisplay: "check возвращает boolean",
        inputArgs: ["returns-bool"],
        expected: true,
      },
      {
        id: "nodenet-p3-t5",
        inputDisplay: "первый запрос всегда разрешён",
        inputArgs: ["first-request"],
        expected: true,
      },
    ],
    hints: [
      "Нужно отслеживать время каждого запроса по пользователю. Какую структуру данных удобно использовать для хранения истории по ключу?",
      "«Окно» — это временной диапазон. Как определить, какие запросы устарели и уже не считаются?",
    ],
    solutionCode: `function createRateLimiter(limit, windowMs) {
  const requests = new Map();

  return {
    check(userId) {
      const now = Date.now();
      const timestamps = requests.get(userId) ?? [];
      const recent = timestamps.filter((t) => now - t < windowMs);
      if (recent.length >= limit) return false;
      recent.push(now);
      requests.set(userId, recent);
      return true;
    },
  };
}`,
    testHelperCode: `// Wraps the user's createRateLimiter and dispatches by scenario token.
// We reassign the same identifier (function decls are mutable bindings inside the IIFE).
const __createRateLimiter = createRateLimiter;
createRateLimiter = function (arg) {
  if (arg === 'within-limit') {
    const limiter = __createRateLimiter(3, 1000);
    return [limiter.check('user1'), limiter.check('user1'), limiter.check('user1')];
  }
  if (arg === 'exceed') {
    const limiter = __createRateLimiter(3, 1000);
    limiter.check('u'); limiter.check('u'); limiter.check('u');
    return limiter.check('u');
  }
  if (arg === 'different-users') {
    const limiter = __createRateLimiter(2, 1000);
    limiter.check('a'); limiter.check('a');
    // user 'a' exhausted, but user 'b' must still be allowed
    return limiter.check('b') === true && limiter.check('a') === false;
  }
  if (arg === 'returns-bool') {
    const limiter = __createRateLimiter(1, 1000);
    const r = limiter.check('x');
    return typeof r === 'boolean';
  }
  if (arg === 'first-request') {
    const limiter = __createRateLimiter(5, 1000);
    return limiter.check('first') === true;
  }
  return null;
};`,
  },
  {
    id: "nodenet-p4",
    topicId: "node-network",
    title: "Router — простой HTTP-роутер",
    difficulty: "medium",
    isContextual: false,
    description: `Реализуйте класс \`Router\`:
- \`get(path, handler)\` и \`post(path, handler)\` — регистрация маршрутов
- \`match(method, path)\` — возвращает \`{ handler, params }\` или \`null\`
- Поддержка динамических сегментов \`:param\`

Примеры:
\`\`\`
const router = new Router();
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.post('/users', createUser);

router.match('GET', '/users');
// → { handler: getAllUsers, params: {} }

router.match('GET', '/users/42');
// → { handler: getUser, params: { id: '42' } }

router.match('DELETE', '/users');
// → null (метод не зарегистрирован)
\`\`\``,
    functionName: "Router",
    starterCode: `class Router {
  constructor() {
    // ваш код
  }

  get(path, handler) {
    // ваш код
  }

  post(path, handler) {
    // ваш код
  }

  match(method, path) {
    // ваш код — возвращает { handler, params } или null
  }
}`,
    testCases: [
      {
        id: "nodenet-p4-t1",
        inputDisplay: "точное совпадение GET /users",
        inputArgs: ["exact"],
        expected: true,
      },
      {
        id: "nodenet-p4-t2",
        inputDisplay: "динамический параметр :id",
        inputArgs: ["dynamic"],
        expected: { id: "42" },
      },
      {
        id: "nodenet-p4-t3",
        inputDisplay: "нет совпадения → null",
        inputArgs: ["no-match"],
        expected: null,
      },
      {
        id: "nodenet-p4-t4",
        inputDisplay: "метод POST",
        inputArgs: ["post-method"],
        expected: true,
      },
      {
        id: "nodenet-p4-t5",
        inputDisplay: "несколько параметров",
        inputArgs: ["multi-params"],
        expected: { userId: "1", postId: "2" },
      },
    ],
    hints: [
      "Как превратить путь вида `/users/:id` в паттерн, который будет совпадать с конкретными URL и извлекать значения параметров?",
      "Как при совпадении маршрута восстановить значения именованных параметров из URL?",
    ],
    solutionCode: `class Router {
  constructor() {
    this.routes = [];
  }

  _add(method, path, handler) {
    const paramNames = [];
    const pattern = path.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    this.routes.push({
      method: method.toUpperCase(),
      regex: new RegExp(\`^\${pattern}$\`),
      paramNames,
      handler,
    });
  }

  get(path, handler) { this._add('GET', path, handler); }
  post(path, handler) { this._add('POST', path, handler); }

  match(method, path) {
    for (const route of this.routes) {
      if (route.method !== method.toUpperCase()) continue;
      const m = path.match(route.regex);
      if (!m) continue;
      const params = {};
      route.paramNames.forEach((name, i) => {
        params[name] = m[i + 1];
      });
      return { handler: route.handler, params };
    }
    return null;
  }
}`,
  },
  {
    id: "nodenet-p5",
    topicId: "node-network",
    title: "fetchWithRetry — повторные запросы",
    difficulty: "medium",
    isContextual: true,
    description: `Реализуйте функцию \`fetchWithRetry(url, options, retries)\`:
- Выполняет запрос через переданную функцию \`fetch\` (или симуляцию)
- При ошибке повторяет запрос \`retries\` раз
- Между попытками пауза: **100ms × попытка** (100ms, 200ms, 300ms...)
- Если все попытки провалились — бросает последнюю ошибку

Примеры:
\`\`\`
// fetch падает 2 раза, потом успешен:
const result = await fetchWithRetry(mockFetch, 3);
// 1-я попытка → Error
// 100ms пауза → 2-я попытка → Error
// 200ms пауза → 3-я попытка → { ok: true }
// → { ok: true }

// Все попытки провалились:
await fetchWithRetry(alwaysFails, 2);
// → throws Error
\`\`\``,
    functionName: "fetchWithRetry",
    starterCode: `async function fetchWithRetry(fetchFn, retries, baseDelay = 100) {
  // ваш код
}`,
    testCases: [
      {
        id: "nodenet-p5-t1",
        inputDisplay: "успех с первой попытки",
        inputArgs: ["success-first"],
        expected: { ok: true },
      },
      {
        id: "nodenet-p5-t2",
        inputDisplay: "2 ошибки затем успех",
        inputArgs: ["success-third"],
        expected: { ok: true },
      },
      {
        id: "nodenet-p5-t3",
        inputDisplay: "все попытки провалились → throws",
        inputArgs: ["all-fail"],
        expected: "Error: network error",
      },
      {
        id: "nodenet-p5-t4",
        inputDisplay: "retries=0 — одна попытка",
        inputArgs: ["no-retry"],
        expected: true,
      },
      {
        id: "nodenet-p5-t5",
        inputDisplay: "пауза между попытками",
        inputArgs: ["delay-check"],
        expected: true,
      },
    ],
    hints: [
      "Как повторять попытки при ошибке, не прерывая выполнение? Что делать с ошибкой, если попытки ещё есть — и что, если они исчерпаны?",
      "Задержка должна расти с каждой попыткой. Как связать её размер с номером попытки?",
    ],
    solutionCode: `async function fetchWithRetry(fetchFn, retries, baseDelay = 100) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetchFn();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, baseDelay * (attempt + 1)));
      }
    }
  }
  throw lastError;
}`,
    testHelperCode: `// Wraps the user's fetchWithRetry and dispatches by scenario token.
const __fetchWithRetry = fetchWithRetry;
fetchWithRetry = async function (arg) {
  // Use small baseDelay (1ms) so tests run fast.
  if (arg === 'success-first') {
    const fetchFn = async () => ({ ok: true });
    return await __fetchWithRetry(fetchFn, 3, 1);
  }
  if (arg === 'success-third') {
    let attempts = 0;
    const fetchFn = async () => {
      attempts++;
      if (attempts < 3) throw new Error('network error');
      return { ok: true };
    };
    return await __fetchWithRetry(fetchFn, 3, 1);
  }
  if (arg === 'all-fail') {
    const fetchFn = async () => { throw new Error('network error'); };
    try {
      await __fetchWithRetry(fetchFn, 2, 1);
      return null;
    } catch (e) {
      return 'Error: ' + (e && e.message ? e.message : String(e));
    }
  }
  if (arg === 'no-retry') {
    let attempts = 0;
    const fetchFn = async () => { attempts++; throw new Error('fail'); };
    try {
      await __fetchWithRetry(fetchFn, 0, 1);
    } catch {}
    return attempts === 1;
  }
  if (arg === 'delay-check') {
    let attempts = 0;
    const times = [];
    const fetchFn = async () => {
      times.push(Date.now());
      attempts++;
      if (attempts < 3) throw new Error('boom');
      return { ok: true };
    };
    const start = Date.now();
    const result = await __fetchWithRetry(fetchFn, 3, 50);
    const elapsed = Date.now() - start;
    // Expected delays: 50ms after 1st fail, 100ms after 2nd fail = ~150ms minimum.
    return result && result.ok === true && attempts === 3 && elapsed >= 140;
  }
  return null;
};`,
  },
  {
    kind: "predict-output",
    id: "nn-p6",
    topicId: "node-network",
    title: "Определи вывод: middleware-цепочка Express",
    difficulty: "medium",
    isContextual: false,
    description: `Перед тобой middleware-цепочка в стиле Express: каждый middleware печатает строку до \`next()\` и (опционально) после. Введи каждую напечатанную строку на отдельной строке поля ответа.

**Подсказка:** middleware выполняются строго в порядке регистрации. \`next()\` синхронно вызывает следующий middleware, а после его возврата управление возвращается обратно — поэтому строки «после \`next()\`» печатаются в обратном порядке.`,
    code: `function runPipeline(middlewares, req, res) {
  let i = 0;
  function next() {
    if (i >= middlewares.length) return;
    const mw = middlewares[i++];
    mw(req, res, next);
  }
  next();
}

const a = (req, res, next) => {
  console.log('A in');
  next();
  console.log('A out');
};
const b = (req, res, next) => {
  console.log('B in');
  next();
  console.log('B out');
};
const c = (req, res, next) => {
  console.log('C handler');
};

runPipeline([a, b, c], {}, {});`,
    expected: "A in\nB in\nC handler\nB out\nA out",
    hints: [
      "next() — синхронный вызов следующего middleware. Управление возвращается обратно после его завершения.",
      "Сначала идём «вглубь»: A in → B in → C handler.",
      "Затем «всплываем» обратно: B out → A out (LIFO).",
      "Это тот же порядок, что у вложенных функций — каждый next() как обычный синхронный вызов.",
    ],
    solutionCode: `// A in   — middleware A напечатал и вызвал next()
// B in   — middleware B напечатал и вызвал next()
// C handler — последний middleware (next() не вызвал)
// B out  — управление вернулось к B после next()
// A out  — управление вернулось к A после next()
// Итог: A in, B in, C handler, B out, A out`,
  },
  {
    kind: "find-bug",
    id: "nn-p7",
    topicId: "node-network",
    title: "Найди баг: конвейер middleware обрывается",
    difficulty: "easy",
    isContextual: false,
    description: `Функция \`runPipeline(middlewares, req)\` имитирует Express-конвейер: запускает middleware по очереди, и каждый из них дописывает свой идентификатор в \`req.trace\`. Тесты ожидают, что после прогона цепочки \`req.trace === 'AUTH|LOG|HANDLER'\`.

Но что-то мешает цепочке отработать полностью. Найдите и исправьте.`,
    buggyCode: `function authMw(req, res, next) {
  req.trace = (req.trace ?? '') + 'AUTH';
}

function logMw(req, res, next) {
  req.trace += '|LOG';
  next();
}

function handlerMw(req, res, next) {
  req.trace += '|HANDLER';
}

function runPipeline(middlewares, req) {
  let i = 0;
  function next() {
    if (i >= middlewares.length) return;
    const mw = middlewares[i++];
    mw(req, {}, next);
  }
  next();
  return req;
}

function nn_p7_test(arg) {
  const req = {};
  if (arg === 'all') {
    runPipeline([authMw, logMw, handlerMw], req);
    return req.trace;
  }
  if (arg === 'auth-only') {
    runPipeline([authMw], req);
    return req.trace;
  }
  if (arg === 'auth+log') {
    runPipeline([authMw, logMw], req);
    return req.trace;
  }
}`,
    functionName: "nn_p7_test",
    bugSummary:
      "authMw не вызывает next(), поэтому конвейер обрывается на первом же middleware. logMw и handlerMw никогда не выполняются. В реальном Express-сервере это приводит к зависанию запроса до server timeout.",
    testCases: [
      {
        id: "nn-p7-t1",
        inputDisplay: "все три middleware выполнились → AUTH|LOG|HANDLER",
        inputArgs: ["all"],
        expected: "AUTH|LOG|HANDLER",
      },
      {
        id: "nn-p7-t2",
        inputDisplay: "authMw в одиночку → AUTH",
        inputArgs: ["auth-only"],
        expected: "AUTH",
      },
      {
        id: "nn-p7-t3",
        inputDisplay: "auth+log выполнились → AUTH|LOG",
        inputArgs: ["auth+log"],
        expected: "AUTH|LOG",
      },
    ],
    hints: [
      'Пройди по коду мысленно: что происходит после того, как authMw выполнил свою работу? Управление должно перейти дальше — что для этого нужно вызвать?',
      'Сравни authMw с logMw. Что делает logMw, чего нет в authMw?',
    ],
    solutionCode: `function authMw(req, res, next) {
  req.trace = (req.trace ?? '') + 'AUTH';
  next();
}

function logMw(req, res, next) {
  req.trace += '|LOG';
  next();
}

function handlerMw(req, res, next) {
  req.trace += '|HANDLER';
}

function runPipeline(middlewares, req) {
  let i = 0;
  function next() {
    if (i >= middlewares.length) return;
    const mw = middlewares[i++];
    mw(req, {}, next);
  }
  next();
  return req;
}

function nn_p7_test(arg) {
  const req = {};
  if (arg === 'all') {
    runPipeline([authMw, logMw, handlerMw], req);
    return req.trace;
  }
  if (arg === 'auth-only') {
    runPipeline([authMw], req);
    return req.trace;
  }
  if (arg === 'auth+log') {
    runPipeline([authMw, logMw], req);
    return req.trace;
  }
}`,
  },
  {
    kind: "refactor",
    id: "nn-p8",
    topicId: "node-network",
    title: "Оптимизируй: цепочка if-ов → словарь маршрутов",
    difficulty: "easy",
    isContextual: false,
    description: `Функция \`route(method, path)\` — наивный роутер на цепочке \`if/else if\`. С каждым новым маршрутом конструкция растёт линейно и плохо читается. Перепишите функцию так, чтобы маршруты хранились в **словаре** (\`Map\` или объекте) с ключом \`\`\${method} \${path}\`\`, а \`route\` делал поиск за \`O(1)\`.

Сигнатура остаётся: \`route(method, path)\` возвращает строку — имя обработчика — или \`'404'\`, если маршрут не зарегистрирован. Корректность: результат должен совпадать со стартовым кодом для всех тест-кейсов.`,
    functionName: "route",
    starterCode: `function route(method, path) {
  if (method === 'GET' && path === '/users') return 'getAllUsers';
  if (method === 'POST' && path === '/users') return 'createUser';
  if (method === 'GET' && path === '/posts') return 'getAllPosts';
  if (method === 'POST' && path === '/posts') return 'createPost';
  if (method === 'GET' && path === '/health') return 'healthCheck';
  if (method === 'GET' && path === '/metrics') return 'getMetrics';
  if (method === 'DELETE' && path === '/cache') return 'clearCache';
  return '404';
}`,
    testCases: [
      {
        id: "nn-p8-t1",
        inputDisplay: "GET /users → getAllUsers",
        inputArgs: ["GET", "/users"],
        expected: "getAllUsers",
      },
      {
        id: "nn-p8-t2",
        inputDisplay: "POST /posts → createPost",
        inputArgs: ["POST", "/posts"],
        expected: "createPost",
      },
      {
        id: "nn-p8-t3",
        inputDisplay: "DELETE /cache → clearCache",
        inputArgs: ["DELETE", "/cache"],
        expected: "clearCache",
      },
      {
        id: "nn-p8-t4",
        inputDisplay: "GET /unknown → 404",
        inputArgs: ["GET", "/unknown"],
        expected: "404",
      },
      {
        id: "nn-p8-t5",
        inputDisplay: "PUT /users → 404 (метод не зарегистрирован)",
        inputArgs: ["PUT", "/users"],
        expected: "404",
      },
    ],
    hints: [
      "Маршруты нужно зарегистрировать один раз и искать по запросу. Как уникально идентифицировать маршрут по методу и пути?",
      "Поиск по комбинированному ключу — распространённый паттерн. Какая структура данных даёт быстрый поиск по произвольному ключу?",
    ],
    solutionCode: `const routes = new Map([
  ['GET /users', 'getAllUsers'],
  ['POST /users', 'createUser'],
  ['GET /posts', 'getAllPosts'],
  ['POST /posts', 'createPost'],
  ['GET /health', 'healthCheck'],
  ['GET /metrics', 'getMetrics'],
  ['DELETE /cache', 'clearCache'],
]);

function route(method, path) {
  return routes.get(\`\${method} \${path}\`) ?? '404';
}`,
  },
  {
    id: "nodn-h1",
    topicId: "node-network",
    kind: "implement",
    title: "Rate Limiter — ограничение запросов по IP",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте функцию \`createRateLimiter({ windowMs, maxRequests })\`, которая возвращает middleware-функцию \`(req, res, next)\` для Express-подобного сервера.

Middleware:
- Считает количество запросов с каждого IP за скользящее окно \`windowMs\` мс
- Если превышен лимит \`maxRequests\` — возвращает ответ 429 с телом \`{ error: 'Too Many Requests' }\`
- Иначе — вызывает \`next()\`

Используйте скользящее окно (sliding window log) — точный алгоритм на основе временных меток.`,
    functionName: "createRateLimiter_test",
    starterCode: `function createRateLimiter({ windowMs, maxRequests }) {
  // ваш код
  return function(req, res, next) {
    // ваш код
  };
}`,
    testCases: [
      {
        id: "nodn-h1-t1",
        inputDisplay: "запросы в пределах лимита проходят",
        inputArgs: ["within-limit"],
        expected: "next-called",
      },
      {
        id: "nodn-h1-t2",
        inputDisplay: "превышение лимита → 429",
        inputArgs: ["over-limit"],
        expected: 429,
      },
      {
        id: "nodn-h1-t3",
        inputDisplay: "разные IP — независимые счётчики",
        inputArgs: ["diff-ip"],
        expected: "next-called",
      },
      {
        id: "nodn-h1-t4",
        inputDisplay: "старые запросы выходят из окна",
        inputArgs: ["window-slide"],
        expected: "next-called",
      },
    ],
    hints: [
      "Нужно помнить историю запросов каждого IP. Как хранить список временных меток по ключу?",
      "«Скользящее окно» означает, что старые запросы перестают считаться. Как отсечь устаревшие отметки?",
    ],
    solutionCode: `function createRateLimiter({ windowMs, maxRequests }) {
  const requests = new Map(); // ip → timestamps[]

  return function(req, res, next) {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();

    if (!requests.has(ip)) requests.set(ip, []);
    const timestamps = requests.get(ip);

    // Удаляем устаревшие
    while (timestamps.length > 0 && timestamps[0] <= now - windowMs) {
      timestamps.shift();
    }

    if (timestamps.length >= maxRequests) {
      res.status(429).json({ error: 'Too Many Requests' });
      return;
    }

    timestamps.push(now);
    next();
  };
}`,
    testHelperCode: `function createRateLimiter_test(scenario) {
  const makeReq = (ip) => ({ ip });
  const makeRes = () => {
    const r = { _status: 200, _body: null };
    r.status = (code) => { r._status = code; return r; };
    r.json = (body) => { r._body = body; };
    return r;
  };

  if (scenario === 'within-limit') {
    const limiter = createRateLimiter({ windowMs: 1000, maxRequests: 3 });
    const req = makeReq('1.1.1.1');
    let called = false;
    limiter(req, makeRes(), () => { called = true; });
    limiter(req, makeRes(), () => { called = true; });
    const res = makeRes();
    limiter(req, res, () => { called = true; });
    return called ? 'next-called' : 'blocked';
  }
  if (scenario === 'over-limit') {
    const limiter = createRateLimiter({ windowMs: 1000, maxRequests: 2 });
    const req = makeReq('2.2.2.2');
    limiter(req, makeRes(), () => {});
    limiter(req, makeRes(), () => {});
    const res = makeRes();
    limiter(req, res, () => {});
    return res._status;
  }
  if (scenario === 'diff-ip') {
    const limiter = createRateLimiter({ windowMs: 1000, maxRequests: 1 });
    limiter(makeReq('3.3.3.3'), makeRes(), () => {});
    let called = false;
    const res = makeRes();
    limiter(makeReq('4.4.4.4'), res, () => { called = true; });
    return called ? 'next-called' : 'blocked';
  }
  if (scenario === 'window-slide') {
    // Используем фиктивные временные метки
    const requests = new Map();
    const windowMs = 100;
    const maxRequests = 2;
    // Эмулируем: IP уже делал 2 запроса 200 мс назад (вне окна)
    requests.set('5.5.5.5', [Date.now() - 200, Date.now() - 150]);
    const limiter = createRateLimiter({ windowMs, maxRequests });
    // Подменяем внутренний кеш не можем, поэтому ждём
    // Просто проверим что свежий IP проходит после лимита
    const limiter2 = createRateLimiter({ windowMs: 50, maxRequests: 1 });
    const req = makeReq('6.6.6.6');
    limiter2(req, makeRes(), () => {});
    return new Promise(res => setTimeout(() => {
      let called = false;
      limiter2(req, makeRes(), () => { called = true; });
      res(called ? 'next-called' : 'blocked');
    }, 60));
  }
}`,
  },
  {
    id: "nodn-h2",
    topicId: "node-network",
    kind: "implement",
    title: "Connection Pool — пул TCP/HTTP соединений",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте класс \`ConnectionPool\`, который управляет пулом переиспользуемых соединений.

Методы:
- \`acquire()\` — получить соединение из пула (возвращает промис). Если пул пуст — создаёт новое, если достигнут maxSize — ожидает освобождения.
- \`release(conn)\` — вернуть соединение в пул
- \`destroy()\` — закрыть все соединения

\`\`\`js
const pool = new ConnectionPool({
  create: async () => ({ id: Math.random() }),
  destroy: async (conn) => { conn.closed = true; },
  maxSize: 3,
});
\`\`\``,
    functionName: "ConnectionPool_test",
    starterCode: `class ConnectionPool {
  constructor({ create, destroy, maxSize }) {
    // ваш код
  }

  async acquire() {
    // ваш код
  }

  release(conn) {
    // ваш код
  }

  async destroy() {
    // ваш код
  }
}`,
    testCases: [
      {
        id: "nodn-h2-t1",
        inputDisplay: "acquire возвращает соединение",
        inputArgs: ["basic"],
        expected: true,
      },
      {
        id: "nodn-h2-t2",
        inputDisplay: "release возвращает соединение в пул",
        inputArgs: ["reuse"],
        expected: true,
      },
      {
        id: "nodn-h2-t3",
        inputDisplay: "ожидание при заполненном пуле",
        inputArgs: ["wait"],
        expected: true,
      },
      {
        id: "nodn-h2-t4",
        inputDisplay: "destroy закрывает все соединения",
        inputArgs: ["destroy"],
        expected: true,
      },
    ],
    hints: [
      "Пул управляет тремя вещами: свободными соединениями, общим количеством и ожидающими запросами. Что нужно знать, чтобы решить — выдать соединение сразу или поставить в очередь?",
      "Когда соединение возвращается — его нужно или отдать ожидающему, или вернуть в пул. Как проверить, есть ли кто-то в очереди?",
    ],
    solutionCode: `class ConnectionPool {
  constructor({ create, destroy: destroyFn, maxSize }) {
    this._create = create;
    this._destroyFn = destroyFn;
    this.maxSize = maxSize;
    this.idle = [];
    this.total = 0;
    this.waiters = [];
    this.allConns = [];
  }

  async acquire() {
    if (this.idle.length > 0) {
      return this.idle.pop();
    }

    if (this.total < this.maxSize) {
      this.total++;
      const conn = await this._create();
      this.allConns.push(conn);
      return conn;
    }

    return new Promise((resolve) => this.waiters.push(resolve));
  }

  release(conn) {
    if (this.waiters.length > 0) {
      const waiter = this.waiters.shift();
      waiter(conn);
    } else {
      this.idle.push(conn);
    }
  }

  async destroy() {
    const toDestroy = [...this.allConns];
    this.idle = [];
    this.allConns = [];
    this.total = 0;
    await Promise.all(toDestroy.map(c => this._destroyFn(c)));
  }
}`,
    testHelperCode: `async function ConnectionPool_test(scenario) {
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  if (scenario === 'basic') {
    const pool = new ConnectionPool({
      create: async () => ({ id: 1, closed: false }),
      destroy: async (c) => { c.closed = true; },
      maxSize: 2,
    });
    const conn = await pool.acquire();
    return conn !== null && conn !== undefined;
  }

  if (scenario === 'reuse') {
    let created = 0;
    const pool = new ConnectionPool({
      create: async () => ({ id: ++created }),
      destroy: async () => {},
      maxSize: 2,
    });
    const c1 = await pool.acquire();
    pool.release(c1);
    const c2 = await pool.acquire();
    return c1 === c2; // одно и то же соединение
  }

  if (scenario === 'wait') {
    const pool = new ConnectionPool({
      create: async () => ({}),
      destroy: async () => {},
      maxSize: 1,
    });
    const c1 = await pool.acquire();
    let c2resolved = false;
    const p2 = pool.acquire().then(c => { c2resolved = true; return c; });
    await delay(10);
    const beforeRelease = !c2resolved;
    pool.release(c1);
    await p2;
    return beforeRelease && c2resolved;
  }

  if (scenario === 'destroy') {
    const closed = [];
    const pool = new ConnectionPool({
      create: async () => ({ closed: false }),
      destroy: async (c) => { c.closed = true; closed.push(true); },
      maxSize: 2,
    });
    const c1 = await pool.acquire();
    const c2 = await pool.acquire();
    pool.release(c1);
    pool.release(c2);
    await pool.destroy();
    return closed.length === 2;
  }
}`,
  },
  {
    id: "nodn-h3",
    topicId: "node-network",
    kind: "implement",
    title: "Middleware chain — конвейер обработчиков (Koa-style)",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте функцию \`compose(middlewares)\`, которая принимает массив middleware-функций и возвращает одну композитную функцию.

Каждый middleware имеет сигнатуру \`(ctx, next) => Promise | void\`:
- \`ctx\` — общий объект-контекст, который передаётся через всю цепочку.
- \`next\` — функция, возвращающая Promise; её вызов запускает **следующий** middleware.

Возвращаемая \`compose(...)\` функция вызывается так: \`compose(mws)(ctx)\` — и обрабатывает middleware **снизу вверх**, в стиле Koa.

Хорошая задача на понимание async-композиции и того, как один middleware «оборачивает» следующий.

Пример:
\`\`\`
const stack = [
  async (ctx, next) => { ctx.order.push('a-in'); await next(); ctx.order.push('a-out'); },
  async (ctx, next) => { ctx.order.push('b-in'); await next(); ctx.order.push('b-out'); },
  async (ctx) =>       { ctx.order.push('c'); },
];

const ctx = { order: [] };
await compose(stack)(ctx);
// ctx.order === ['a-in', 'b-in', 'c', 'b-out', 'a-out']
\`\`\``,
    functionName: 'compose_test',
    starterCode: `function compose(middlewares) {
  // ваш код
}`,
    testCases: [
      { id: 'nodn-h3-t1', inputDisplay: "порядок in/out у трёх middleware", inputArgs: ['order'], expected: ['a-in', 'b-in', 'c', 'b-out', 'a-out'] },
      { id: 'nodn-h3-t2', inputDisplay: "ctx общий для всех", inputArgs: ['shared-ctx'], expected: { a: 1, b: 2, c: 3 } },
      { id: 'nodn-h3-t3', inputDisplay: "пустой массив middleware — no-op", inputArgs: ['empty'], expected: 'no-error' },
      { id: 'nodn-h3-t4', inputDisplay: "middleware не вызвавший next прерывает цепочку", inputArgs: ['no-next'], expected: ['a', 'b'] },
      { id: 'nodn-h3-t5', inputDisplay: "ошибка в middleware ловится через await", inputArgs: ['error'], expected: 'caught: oops' },
    ],
    hints: [
      'Рекурсивный диспатчер: функция `dispatch(i)` запускает i-й middleware и передаёт ему `() => dispatch(i+1)` как next.',
      'Защита от двойного вызова next в одной middleware: можно проверить флаг и бросить ошибку.',
      'Базовый случай: i === middlewares.length → вернуть Promise.resolve().',
    ],
    solutionCode: `function compose(middlewares) {
  return function (ctx) {
    function dispatch(i) {
      if (i >= middlewares.length) return Promise.resolve();
      const mw = middlewares[i];
      try {
        return Promise.resolve(mw(ctx, () => dispatch(i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return dispatch(0);
  };
}`,
    testHelperCode: `async function compose_test(scenario) {
  if (scenario === 'order') {
    const ctx = { order: [] };
    const stack = [
      async (ctx, next) => { ctx.order.push('a-in'); await next(); ctx.order.push('a-out'); },
      async (ctx, next) => { ctx.order.push('b-in'); await next(); ctx.order.push('b-out'); },
      async (ctx) =>       { ctx.order.push('c'); },
    ];
    await compose(stack)(ctx);
    return ctx.order;
  }
  if (scenario === 'shared-ctx') {
    const ctx = {};
    await compose([
      async (c, next) => { c.a = 1; await next(); },
      async (c, next) => { c.b = 2; await next(); },
      async (c)       => { c.c = 3; },
    ])(ctx);
    return ctx;
  }
  if (scenario === 'empty') {
    try {
      await compose([])({});
      return 'no-error';
    } catch (e) {
      return 'error';
    }
  }
  if (scenario === 'no-next') {
    const ctx = { order: [] };
    await compose([
      async (ctx, next) => { ctx.order.push('a'); await next(); },
      async (ctx) =>       { ctx.order.push('b'); /* без next */ },
      async (ctx) =>       { ctx.order.push('c'); },
    ])(ctx);
    return ctx.order;
  }
  if (scenario === 'error') {
    const stack = [
      async (ctx, next) => {
        try { await next(); }
        catch (e) { ctx.caught = 'caught: ' + e.message; }
      },
      async () => { throw new Error('oops'); },
    ];
    const ctx = {};
    await compose(stack)(ctx);
    return ctx.caught;
  }
}`,
  },
  {
    id: "nodn-h4",
    topicId: "node-network",
    kind: "implement",
    title: "parseHTTPRequest — парсер сырого HTTP-запроса",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте \`parseHTTPRequest(raw)\` — функцию, которая принимает строку с **сырым HTTP-запросом** и возвращает объект \`{ method, path, query, headers, body }\`.

Формат входа:
\`\`\`
METHOD PATH?QUERY HTTP/1.1\\r\\n
Header-Name: value\\r\\n
Header-Name-2: value\\r\\n
\\r\\n
[body]
\`\`\`

Требования:
- \`method\` — в верхнем регистре.
- \`path\` — без query.
- \`query\` — объект декодированных параметров (значения через \`decodeURIComponent\`). Если query нет — \`{}\`.
- \`headers\` — объект с **именами в lower-case**. Значения нужно обрезать от пробелов в начале и в конце (\`trim\`) — так требует спецификация HTTP.
- \`body\` — всё, что после пустой строки. Если тела нет — пустая строка.

Задача проф-уровня: проверяет знание HTTP, парсинга и обработку угловых случаев.

Пример:
\`\`\`
parseHTTPRequest(
  'POST /api/users?role=admin HTTP/1.1\\r\\n' +
  'Host: api.com\\r\\n' +
  'Content-Type: application/json\\r\\n' +
  '\\r\\n' +
  '{"name":"Alice"}'
)
// → {
//   method: 'POST',
//   path: '/api/users',
//   query: { role: 'admin' },
//   headers: { host: 'api.com', 'content-type': 'application/json' },
//   body: '{"name":"Alice"}'
// }
\`\`\``,
    functionName: 'parseHTTPRequest',
    starterCode: `function parseHTTPRequest(raw) {
  // ваш код
}`,
    testCases: [
      {
        id: 'nodn-h4-t1',
        inputDisplay: "POST с JSON-телом",
        inputArgs: ['POST /api/users?role=admin HTTP/1.1\r\nHost: api.com\r\nContent-Type: application/json\r\n\r\n{"name":"Alice"}'],
        expected: {
          method: 'POST',
          path: '/api/users',
          query: { role: 'admin' },
          headers: { host: 'api.com', 'content-type': 'application/json' },
          body: '{"name":"Alice"}',
        },
      },
      {
        id: 'nodn-h4-t2',
        inputDisplay: "GET без query и тела",
        inputArgs: ['GET /about HTTP/1.1\r\nHost: example.com\r\n\r\n'],
        expected: {
          method: 'GET',
          path: '/about',
          query: {},
          headers: { host: 'example.com' },
          body: '',
        },
      },
      {
        id: 'nodn-h4-t3',
        inputDisplay: "несколько query-параметров с URI-кодированием",
        inputArgs: ['GET /search?q=hello%20world&page=2 HTTP/1.1\r\nHost: x\r\n\r\n'],
        expected: {
          method: 'GET',
          path: '/search',
          query: { q: 'hello world', page: '2' },
          headers: { host: 'x' },
          body: '',
        },
      },
      {
        id: 'nodn-h4-t4',
        inputDisplay: "заголовки приходят к lower-case",
        inputArgs: ['GET / HTTP/1.1\r\nAuthorization: Bearer xyz\r\nX-Custom: 42\r\n\r\n'],
        expected: {
          method: 'GET',
          path: '/',
          query: {},
          headers: { authorization: 'Bearer xyz', 'x-custom': '42' },
          body: '',
        },
      },
      {
        id: 'nodn-h4-t5',
        inputDisplay: "method в верхнем регистре",
        inputArgs: ['delete /x HTTP/1.1\r\nHost: y\r\n\r\n'],
        expected: {
          method: 'DELETE',
          path: '/x',
          query: {},
          headers: { host: 'y' },
          body: '',
        },
      },
    ],
    hints: [
      'Разделите сначала по `\\r\\n\\r\\n` — на «голову» и «тело».',
      'Голова: первая строка — request-line (METHOD URL HTTP/version), остальные — headers (Name: Value).',
      'URL разделите по `?` на path и querystring. querystring → разбейте по `&`, каждый — по `=`, значения через `decodeURIComponent`.',
    ],
    solutionCode: `function parseHTTPRequest(raw) {
  const headerBodySplit = raw.indexOf('\\r\\n\\r\\n');
  const headPart = headerBodySplit === -1 ? raw : raw.slice(0, headerBodySplit);
  const body = headerBodySplit === -1 ? '' : raw.slice(headerBodySplit + 4);

  const lines = headPart.split('\\r\\n');
  const requestLine = lines[0];
  const [methodRaw, urlRaw] = requestLine.split(' ');
  const method = methodRaw.toUpperCase();

  let path = urlRaw;
  const query = {};
  const qIdx = urlRaw.indexOf('?');
  if (qIdx !== -1) {
    path = urlRaw.slice(0, qIdx);
    const qs = urlRaw.slice(qIdx + 1);
    for (const pair of qs.split('&')) {
      if (!pair) continue;
      const eq = pair.indexOf('=');
      const k = eq === -1 ? pair : pair.slice(0, eq);
      const v = eq === -1 ? '' : pair.slice(eq + 1);
      query[decodeURIComponent(k)] = decodeURIComponent(v);
    }
  }

  const headers = {};
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const name = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    headers[name] = value;
  }

  return { method, path, query, headers, body };
}`,
  },
];
