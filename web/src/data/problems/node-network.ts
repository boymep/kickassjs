import type { Problem } from '../../types/problem';

export const nodeNetworkProblems: Problem[] = [
  {
    id: 'nodenet-p1',
    topicId: 'node-network',
    title: 'parseURL — разбор URL',
    difficulty: 'easy',
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
    functionName: 'parseURL',
    starterCode: `function parseURL(url) {
  // ваш код
}`,
    testCases: [
      {
        id: 'nodenet-p1-t1',
        inputDisplay: 'https://example.com/users?id=1&role=admin',
        inputArgs: ['https://example.com/users?id=1&role=admin'],
        expected: { protocol: 'https', host: 'example.com', pathname: '/users', searchParams: { id: '1', role: 'admin' } },
      },
      {
        id: 'nodenet-p1-t2',
        inputDisplay: 'http://localhost:3000/api — нет параметров',
        inputArgs: ['http://localhost:3000/api'],
        expected: { protocol: 'http', host: 'localhost:3000', pathname: '/api', searchParams: {} },
      },
      {
        id: 'nodenet-p1-t3',
        inputDisplay: 'корень пути /',
        inputArgs: ['https://example.com/'],
        expected: { protocol: 'https', host: 'example.com', pathname: '/', searchParams: {} },
      },
      {
        id: 'nodenet-p1-t4',
        inputDisplay: 'один параметр',
        inputArgs: ['https://api.io/search?q=hello'],
        expected: { protocol: 'https', host: 'api.io', pathname: '/search', searchParams: { q: 'hello' } },
      },
      {
        id: 'nodenet-p1-t5',
        inputDisplay: 'URL с портом',
        inputArgs: ['http://localhost:8080/health'],
        expected: { protocol: 'http', host: 'localhost:8080', pathname: '/health', searchParams: {} },
      },
    ],
    hints: [
      'Используйте встроенный браузерный `URL` класс: `new URL(url)`. Он имеет свойства `protocol`, `host`, `pathname`, `searchParams`.',
      'Для searchParams: `Object.fromEntries(new URL(url).searchParams)` конвертирует URLSearchParams в обычный объект.',
      'protocol из URL включает двоеточие ("https:") — уберите его через `.slice(0, -1)` или `.replace(":", "")`.',
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
    id: 'nodenet-p2',
    topicId: 'node-network',
    title: 'buildQueryString — сборка query строки',
    difficulty: 'easy',
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
    functionName: 'buildQueryString',
    starterCode: `function buildQueryString(params) {
  // ваш код
}`,
    testCases: [
      {
        id: 'nodenet-p2-t1',
        inputDisplay: '{ id: 1, name: "John Doe" }',
        inputArgs: [{ id: 1, name: 'John Doe' }],
        expected: 'id=1&name=John%20Doe',
      },
      {
        id: 'nodenet-p2-t2',
        inputDisplay: 'null значения пропускаются',
        inputArgs: [{ q: 'hello', page: 2, limit: null }],
        expected: 'q=hello&page=2',
      },
      {
        id: 'nodenet-p2-t3',
        inputDisplay: 'пустой объект → ""',
        inputArgs: [{}],
        expected: '',
      },
      {
        id: 'nodenet-p2-t4',
        inputDisplay: 'спецсимволы кодируются',
        inputArgs: [{ url: 'https://a.com?x=1' }],
        expected: 'url=https%3A%2F%2Fa.com%3Fx%3D1',
      },
      {
        id: 'nodenet-p2-t5',
        inputDisplay: 'undefined значения пропускаются',
        inputArgs: [{ a: 'x', b: undefined, c: 'y' }],
        expected: 'a=x&c=y',
      },
    ],
    hints: [
      '`Object.entries(params)` — получить пары [key, value]. Отфильтровать `null`/`undefined`. Применить `encodeURIComponent` к значениям. Соединить через `&`.',
    ],
    solutionCode: `function buildQueryString(params) {
  return Object.entries(params)
    .filter(([, v]) => v != null)
    .map(([k, v]) => \`\${encodeURIComponent(k)}=\${encodeURIComponent(v)}\`)
    .join('&');
}`,
  },
  {
    id: 'nodenet-p3',
    topicId: 'node-network',
    title: 'createRateLimiter — ограничитель запросов',
    difficulty: 'medium',
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
    functionName: 'createRateLimiter',
    starterCode: `function createRateLimiter(limit, windowMs) {
  // ваш код — возвращает объект с методом check
}`,
    testCases: [
      {
        id: 'nodenet-p3-t1',
        inputDisplay: '3 запроса в лимит → все true',
        inputArgs: ['within-limit'],
        expected: [true, true, true],
      },
      {
        id: 'nodenet-p3-t2',
        inputDisplay: '4-й запрос → false',
        inputArgs: ['exceed'],
        expected: false,
      },
      {
        id: 'nodenet-p3-t3',
        inputDisplay: 'разные пользователи независимы',
        inputArgs: ['different-users'],
        expected: true,
      },
      {
        id: 'nodenet-p3-t4',
        inputDisplay: 'check возвращает boolean',
        inputArgs: ['returns-bool'],
        expected: true,
      },
      {
        id: 'nodenet-p3-t5',
        inputDisplay: 'первый запрос всегда разрешён',
        inputArgs: ['first-request'],
        expected: true,
      },
    ],
    hints: [
      'Храните Map: `userId → timestamps[]`. В `check`: фильтруйте старые метки (`Date.now() - t < windowMs`), проверяйте длину, добавляйте новую.',
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
    id: 'nodenet-p4',
    topicId: 'node-network',
    title: 'Router — простой HTTP-роутер',
    difficulty: 'medium',
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
    functionName: 'Router',
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
        id: 'nodenet-p4-t1',
        inputDisplay: 'точное совпадение GET /users',
        inputArgs: ['exact'],
        expected: true,
      },
      {
        id: 'nodenet-p4-t2',
        inputDisplay: 'динамический параметр :id',
        inputArgs: ['dynamic'],
        expected: { id: '42' },
      },
      {
        id: 'nodenet-p4-t3',
        inputDisplay: 'нет совпадения → null',
        inputArgs: ['no-match'],
        expected: null,
      },
      {
        id: 'nodenet-p4-t4',
        inputDisplay: 'метод POST',
        inputArgs: ['post-method'],
        expected: true,
      },
      {
        id: 'nodenet-p4-t5',
        inputDisplay: 'несколько параметров',
        inputArgs: ['multi-params'],
        expected: { userId: '1', postId: '2' },
      },
    ],
    hints: [
      'Храните роуты как `{ method, pattern, paramNames, handler }`. `pattern` — RegExp из пути: `/users/:id` → `/users/([^/]+)`.',
      'В `match`: итерируйте роуты, проверяйте метод и pattern.test(path), извлекайте params через захватывающие группы.',
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
    id: 'nodenet-p5',
    topicId: 'node-network',
    title: 'fetchWithRetry — повторные запросы',
    difficulty: 'medium',
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
    functionName: 'fetchWithRetry',
    starterCode: `async function fetchWithRetry(fetchFn, retries, baseDelay = 100) {
  // ваш код
}`,
    testCases: [
      {
        id: 'nodenet-p5-t1',
        inputDisplay: 'успех с первой попытки',
        inputArgs: ['success-first'],
        expected: { ok: true },
      },
      {
        id: 'nodenet-p5-t2',
        inputDisplay: '2 ошибки затем успех',
        inputArgs: ['success-third'],
        expected: { ok: true },
      },
      {
        id: 'nodenet-p5-t3',
        inputDisplay: 'все попытки провалились → throws',
        inputArgs: ['all-fail'],
        expected: 'Error: network error',
      },
      {
        id: 'nodenet-p5-t4',
        inputDisplay: 'retries=0 — одна попытка',
        inputArgs: ['no-retry'],
        expected: true,
      },
      {
        id: 'nodenet-p5-t5',
        inputDisplay: 'пауза между попытками',
        inputArgs: ['delay-check'],
        expected: true,
      },
    ],
    hints: [
      'Цикл `for (let i = 0; i <= retries; i++)`. Внутри try/catch: при ошибке — если `i < retries`, ждём `baseDelay * (i + 1)` мс, иначе throw.',
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
    kind: 'predict-output',
    id: 'nn-p6',
    topicId: 'node-network',
    title: 'Угадай вывод: middleware-цепочка Express',
    difficulty: 'medium',
    isContextual: false,
    description: `Перед вами middleware-цепочка в стиле Express: каждый middleware печатает строку до next() и опционально после. Введите каждую напечатанную строку в отдельной строчке поля ответа.

Подсказка: middleware выполняются строго в порядке регистрации. \`next()\` синхронно вызывает следующий middleware, а после его возврата управление возвращается обратно — поэтому строки «после next()» печатаются в обратном порядке.`,
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
    expected: 'A in\nB in\nC handler\nB out\nA out',
    hints: [
      'next() — синхронный вызов следующего middleware. Управление возвращается обратно после его завершения.',
      'Сначала идём «вглубь»: A in → B in → C handler.',
      'Затем «всплываем» обратно: B out → A out (LIFO).',
      'Это тот же порядок, что у вложенных функций — каждый next() как обычный синхронный вызов.',
    ],
    solutionCode: `// A in   — middleware A напечатал и вызвал next()
// B in   — middleware B напечатал и вызвал next()
// C handler — последний middleware (next() не вызвал)
// B out  — управление вернулось к B после next()
// A out  — управление вернулось к A после next()
// Итог: A in, B in, C handler, B out, A out`,
  },
  {
    kind: 'find-bug',
    id: 'nn-p7',
    topicId: 'node-network',
    title: 'Найди баг: middleware не вызывает next()',
    difficulty: 'easy',
    isContextual: false,
    description: `Функция \`runPipeline(middlewares, req)\` имитирует Express-конвейер: запускает middleware по очереди, и каждый из них дописывает свой идентификатор в \`req.trace\`. Тесты ожидают, что после прогона цепочки \`req.trace === 'AUTH|LOG|HANDLER'\`.

В коде есть распространённый production-баг: один из middleware **забывает** вызвать \`next()\` после своей работы. Из-за этого цепочка обрывается, последующие middleware не выполняются, и в реальном Express-сервере запрос «зависнет» до server-timeout.

Найдите и почините.`,
    buggyCode: `function authMw(req, res, next) {
  req.trace = (req.trace ?? '') + 'AUTH';
  // Забыли вызвать next() — цепочка обрывается!
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
    functionName: 'nn_p7_test',
    bugSummary:
      'authMw не вызывает next(), поэтому конвейер обрывается на первом же middleware. logMw и handlerMw никогда не выполняются. В реальном Express-сервере это приводит к зависанию запроса до server timeout.',
    testCases: [
      {
        id: 'nn-p7-t1',
        inputDisplay: 'все три middleware выполнились → AUTH|LOG|HANDLER',
        inputArgs: ['all'],
        expected: 'AUTH|LOG|HANDLER',
      },
      {
        id: 'nn-p7-t2',
        inputDisplay: 'authMw в одиночку → AUTH',
        inputArgs: ['auth-only'],
        expected: 'AUTH',
      },
      {
        id: 'nn-p7-t3',
        inputDisplay: 'auth+log выполнились → AUTH|LOG',
        inputArgs: ['auth+log'],
        expected: 'AUTH|LOG',
      },
    ],
    hints: [
      'Запустите код мысленно: authMw добавил "AUTH", и… что дальше? Цепочка управления должна перейти к следующему middleware, но как?',
      'В middleware-pipeline следующий middleware вызывается через next(). Если его не вызвать — конвейер заморожен.',
      'Допишите next() в конце authMw.',
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
    kind: 'refactor',
    id: 'nn-p8',
    topicId: 'node-network',
    title: 'Оптимизируй: цепочка if-ов → словарь маршрутов',
    difficulty: 'easy',
    isContextual: false,
    description: `Функция \`route(method, path)\` — наивный роутер на цепочке \`if/else if\`. С каждым новым маршрутом конструкция растёт линейно и плохо читается. Перепишите функцию так, чтобы маршруты хранились в **словаре** (\`Map\` или объекте) с ключом \`\`\${method} \${path}\`\`, а \`route\` делал \`O(1)\` lookup.

Сигнатура остаётся: \`route(method, path)\` возвращает строку — имя обработчика — или \`'404'\`, если маршрут не зарегистрирован. Корректность: результат должен совпадать со starter-кодом для всех тест-кейсов.`,
    functionName: 'route',
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
        id: 'nn-p8-t1',
        inputDisplay: 'GET /users → getAllUsers',
        inputArgs: ['GET', '/users'],
        expected: 'getAllUsers',
      },
      {
        id: 'nn-p8-t2',
        inputDisplay: 'POST /posts → createPost',
        inputArgs: ['POST', '/posts'],
        expected: 'createPost',
      },
      {
        id: 'nn-p8-t3',
        inputDisplay: 'DELETE /cache → clearCache',
        inputArgs: ['DELETE', '/cache'],
        expected: 'clearCache',
      },
      {
        id: 'nn-p8-t4',
        inputDisplay: 'GET /unknown → 404',
        inputArgs: ['GET', '/unknown'],
        expected: '404',
      },
      {
        id: 'nn-p8-t5',
        inputDisplay: 'PUT /users → 404 (метод не зарегистрирован)',
        inputArgs: ['PUT', '/users'],
        expected: '404',
      },
    ],
    hints: [
      'Создайте `Map` (или обычный объект) один раз вне функции `route`. Ключ — `` `${method} ${path}` ``, значение — имя обработчика.',
      'Внутри `route` соберите тот же ключ и сделайте `routes.get(key) ?? "404"`.',
      'Если используете обычный объект — `routes[key]` тоже работает, но Map предпочтительнее: ключи изолированы от прототипа.',
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
    id: 'nodn-h1',
    topicId: 'node-network',
    kind: 'implement',
    title: 'Rate Limiter — ограничение запросов по IP',
    difficulty: 'hard',
    isContextual: false,
    description: `Реализуйте функцию \`createRateLimiter({ windowMs, maxRequests })\`, которая возвращает middleware-функцию \`(req, res, next)\` для Express-подобного сервера.

Middleware:
- Считает количество запросов с каждого IP за скользящее окно \`windowMs\` мс
- Если превышен лимит \`maxRequests\` — возвращает ответ 429 с телом \`{ error: 'Too Many Requests' }\`
- Иначе — вызывает \`next()\`

Используйте скользящее окно (sliding window log) — точный алгоритм на основе временных меток.`,
    functionName: 'createRateLimiter_test',
    starterCode: `function createRateLimiter({ windowMs, maxRequests }) {
  // ваш код
  return function(req, res, next) {
    // ваш код
  };
}`,
    testCases: [
      { id: 'nodn-h1-t1', inputDisplay: 'запросы в пределах лимита проходят', inputArgs: ['within-limit'], expected: 'next-called' },
      { id: 'nodn-h1-t2', inputDisplay: 'превышение лимита → 429', inputArgs: ['over-limit'], expected: 429 },
      { id: 'nodn-h1-t3', inputDisplay: 'разные IP — независимые счётчики', inputArgs: ['diff-ip'], expected: 'next-called' },
      { id: 'nodn-h1-t4', inputDisplay: 'старые запросы выходят из окна', inputArgs: ['window-slide'], expected: 'next-called' },
    ],
    hints: [
      'Храните Map<ip, number[]> — список timestamp запросов для каждого IP.',
      'При каждом запросе: удалите из массива timestamps старше Date.now() - windowMs.',
      'Если timestamps.length >= maxRequests — отправьте 429. Иначе — добавьте timestamp и вызовите next().',
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
    id: 'nodn-h2',
    topicId: 'node-network',
    kind: 'implement',
    title: 'Connection Pool — пул TCP/HTTP соединений',
    difficulty: 'hard',
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
    functionName: 'ConnectionPool_test',
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
      { id: 'nodn-h2-t1', inputDisplay: 'acquire возвращает соединение', inputArgs: ['basic'], expected: true },
      { id: 'nodn-h2-t2', inputDisplay: 'release возвращает соединение в пул', inputArgs: ['reuse'], expected: true },
      { id: 'nodn-h2-t3', inputDisplay: 'ожидание при заполненном пуле', inputArgs: ['wait'], expected: true },
      { id: 'nodn-h2-t4', inputDisplay: 'destroy закрывает все соединения', inputArgs: ['destroy'], expected: true },
    ],
    hints: [
      'Храните: массив idle соединений, счётчик total (всего создано), очередь waiters (resolve-функции).',
      'acquire(): если есть idle — вернуть. Если total < maxSize — создать новое. Иначе — вернуть new Promise(resolve => waiters.push(resolve)).',
      'release(conn): если есть waiters — передать им conn напрямую. Иначе — добавить в idle.',
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
];
