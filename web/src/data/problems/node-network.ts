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
  },
];
