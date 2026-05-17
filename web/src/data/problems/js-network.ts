import type { Problem } from '../../types/problem';

export const jsNetworkProblems: Problem[] = [
  {
    id: 'jsnet-p1',
    topicId: 'js-network',
    title: 'parseHeaders — парсинг HTTP-заголовков',
    difficulty: 'easy',
    isContextual: false,
    description: `Напишите функцию \`parseHeaders(rawHeaders)\`, которая парсит строку HTTP-заголовков в объект.

Формат входных данных: строка с заголовками, разделёнными \`\\r\\n\` или \`\\n\`. Каждая строка: \`Name: Value\`.

Примеры:
\`\`\`
parseHeaders('Content-Type: application/json\\r\\nX-Auth: token123');
// → { 'content-type': 'application/json', 'x-auth': 'token123' }

parseHeaders('Cache-Control: max-age=3600, no-cache');
// → { 'cache-control': 'max-age=3600, no-cache' }
\`\`\``,
    functionName: 'parseHeaders',
    starterCode: `function parseHeaders(rawHeaders) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsnet-p1-t1',
        inputDisplay: 'Content-Type: application/json',
        inputArgs: ['Content-Type: application/json'],
        expected: { 'content-type': 'application/json' },
      },
      {
        id: 'jsnet-p1-t2',
        inputDisplay: 'два заголовка через \\r\\n',
        inputArgs: ['Content-Type: text/html\r\nX-Auth: abc'],
        expected: { 'content-type': 'text/html', 'x-auth': 'abc' },
      },
      {
        id: 'jsnet-p1-t3',
        inputDisplay: 'пустая строка → {}',
        inputArgs: [''],
        expected: {},
      },
      {
        id: 'jsnet-p1-t4',
        inputDisplay: 'имена заголовков приводятся к нижнему регистру',
        inputArgs: ['CONTENT-TYPE: text/plain'],
        expected: { 'content-type': 'text/plain' },
      },
      {
        id: 'jsnet-p1-t5',
        inputDisplay: 'значение с двоеточием не обрезается',
        inputArgs: ['Date: Mon, 01 Jan 2024 00:00:00 GMT'],
        expected: { 'date': 'Mon, 01 Jan 2024 00:00:00 GMT' },
      },
    ],
    hints: [
      'Разбейте строку по `\\r\\n` или `\\n`: `rawHeaders.split(/\\r?\\n/)`. Отфильтруйте пустые строки.',
      'Для каждой строки: найдите первое двоеточие (`indexOf(":")`), левая часть — имя, правая — значение.',
      'Имя заголовка нужно привести к нижнему регистру. Значение — обрезать пробелы (`trim()`).',
    ],
    solutionCode: `function parseHeaders(rawHeaders) {
  const result = {};
  if (!rawHeaders) return result;

  const lines = rawHeaders.split(/\\r?\\n/).filter(Boolean);
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const name = line.slice(0, colonIdx).trim().toLowerCase();
    const value = line.slice(colonIdx + 1).trim();
    result[name] = value;
  }
  return result;
}`,
  },
  {
    id: 'jsnet-p2',
    topicId: 'js-network',
    title: 'parseCookieString — парсинг cookies',
    difficulty: 'easy',
    isContextual: false,
    description: `Напишите функцию \`parseCookieString(cookieStr)\`, которая парсит строку заголовка \`Cookie\` (браузерный формат) в объект \`{ name: value }\`.

Примеры:
\`\`\`
parseCookieString('session=abc; lang=ru; theme=dark');
// → { session: 'abc', lang: 'ru', theme: 'dark' }

parseCookieString('');
// → {}
\`\`\``,
    functionName: 'parseCookieString',
    starterCode: `function parseCookieString(cookieStr) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsnet-p2-t1',
        inputDisplay: 'session=abc → { session: "abc" }',
        inputArgs: ['session=abc'],
        expected: { session: 'abc' },
      },
      {
        id: 'jsnet-p2-t2',
        inputDisplay: 'три кuki через "; "',
        inputArgs: ['a=1; b=2; c=3'],
        expected: { a: '1', b: '2', c: '3' },
      },
      {
        id: 'jsnet-p2-t3',
        inputDisplay: 'пустая строка → {}',
        inputArgs: [''],
        expected: {},
      },
      {
        id: 'jsnet-p2-t4',
        inputDisplay: 'пробелы вокруг значений обрезаются',
        inputArgs: [' name = Alice '],
        expected: { name: 'Alice' },
      },
      {
        id: 'jsnet-p2-t5',
        inputDisplay: 'значение с = внутри',
        inputArgs: ['token=abc=def'],
        expected: { token: 'abc=def' },
      },
    ],
    hints: [
      'Разбейте по `"; "` или `";"`. Для каждого кусочка найдите первое `=` через `indexOf("=")`.',
      'Левая часть от `=` — имя, правая — значение. `trim()` обе части.',
      'Для значения с `=` внутри: используйте `indexOf("=")`, а не `split("=")`, иначе `abc=def` разобьётся на `["abc", "def"]`.',
    ],
    solutionCode: `function parseCookieString(cookieStr) {
  const result = {};
  if (!cookieStr.trim()) return result;

  cookieStr.split(';').forEach((pair) => {
    const eqIdx = pair.indexOf('=');
    if (eqIdx === -1) return;
    const name = pair.slice(0, eqIdx).trim();
    const value = pair.slice(eqIdx + 1).trim();
    result[name] = value;
  });
  return result;
}`,
  },
  {
    id: 'jsnet-p3',
    topicId: 'js-network',
    title: 'buildQueryString — сборка query string',
    difficulty: 'easy',
    isContextual: false,
    description: `Напишите функцию \`buildQueryString(params)\`, которая конвертирует объект параметров в строку запроса URL.

Требования:
- Специальные символы в значениях должны быть закодированы
- Параметры разделены \`&\`
- Порядок — как в объекте (Object.entries)

Примеры:
\`\`\`
buildQueryString({ q: 'hello world', page: 1 });
// → 'q=hello%20world&page=1'

buildQueryString({ name: 'Alice & Bob', tag: 'c++' });
// → 'name=Alice%20%26%20Bob&tag=c%2B%2B'
\`\`\``,
    functionName: 'buildQueryString',
    starterCode: `function buildQueryString(params) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsnet-p3-t1',
        inputDisplay: '{ q: "hello world" } → "q=hello%20world"',
        inputArgs: [{ q: 'hello world' }],
        expected: 'q=hello%20world',
      },
      {
        id: 'jsnet-p3-t2',
        inputDisplay: '{ a: 1, b: 2 } → "a=1&b=2"',
        inputArgs: [{ a: 1, b: 2 }],
        expected: 'a=1&b=2',
      },
      {
        id: 'jsnet-p3-t3',
        inputDisplay: '{} → ""',
        inputArgs: [{}],
        expected: '',
      },
      {
        id: 'jsnet-p3-t4',
        inputDisplay: 'спецсимволы & + кодируются',
        inputArgs: [{ tag: 'c++' }],
        expected: 'tag=c%2B%2B',
      },
      {
        id: 'jsnet-p3-t5',
        inputDisplay: '{ page: 1, size: 20 }',
        inputArgs: [{ page: 1, size: 20 }],
        expected: 'page=1&size=20',
      },
    ],
    hints: [
      'Используйте `encodeURIComponent(value)` для кодирования значений. Он кодирует все спецсимволы кроме `- _ . ! ~ * \' ( )`.',
      'Соберите пары: `Object.entries(params).map(([k, v]) => \`\${k}=\${encodeURIComponent(v)}\`).join("&")`.',
    ],
    solutionCode: `function buildQueryString(params) {
  return Object.entries(params)
    .map(([key, val]) => \`\${encodeURIComponent(key)}=\${encodeURIComponent(val)}\`)
    .join('&');
}`,
  },
  {
    id: 'jsnet-p4',
    topicId: 'js-network',
    title: 'rateLimiter — ограничение запросов',
    difficulty: 'medium',
    isContextual: true,
    description: `Реализуйте функцию \`createRateLimiter(limit, windowMs)\`, которая возвращает функцию \`check(userId)\`:
- \`check(userId)\` возвращает \`true\`, если пользователь не превысил лимит
- \`check(userId)\` возвращает \`false\`, если лимит превышен
- Каждый пользователь имеет свой счётчик
- Счётчик сбрасывается каждые \`windowMs\` миллисекунд

Примеры:
\`\`\`
const limiter = createRateLimiter(3, 1000); // 3 запроса в секунду
limiter('user1'); // true
limiter('user1'); // true
limiter('user1'); // true
limiter('user1'); // false (превышен)
limiter('user2'); // true (другой пользователь)
\`\`\``,
    functionName: 'createRateLimiter_test',
    starterCode: `function createRateLimiter(limit, windowMs) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsnet-p4-t1',
        inputDisplay: '3 запроса в рамках лимита → все true',
        inputArgs: ['within-limit'],
        expected: [true, true, true],
      },
      {
        id: 'jsnet-p4-t2',
        inputDisplay: '4-й запрос превышает лимит → false',
        inputArgs: ['exceeds'],
        expected: false,
      },
      {
        id: 'jsnet-p4-t3',
        inputDisplay: 'разные пользователи — независимые счётчики',
        inputArgs: ['independent'],
        expected: true,
      },
      {
        id: 'jsnet-p4-t4',
        inputDisplay: 'возвращает функцию',
        inputArgs: ['returns-function'],
        expected: true,
      },
      {
        id: 'jsnet-p4-t5',
        inputDisplay: 'limit=1: первый true, второй false',
        inputArgs: ['limit-1'],
        expected: [true, false],
      },
    ],
    hints: [
      'Используйте `Map` для хранения данных о каждом пользователе: `{ count, resetAt }`.',
      'При каждом вызове: проверьте, не истёк ли window (`Date.now() > resetAt`). Если истёк — сбросьте count.',
      'Если count < limit — инкрементируйте и верните true. Иначе — false.',
    ],
    solutionCode: `function createRateLimiter(limit, windowMs) {
  const clients = new Map();

  return function check(userId) {
    const now = Date.now();
    let data = clients.get(userId);

    if (!data || now > data.resetAt) {
      data = { count: 0, resetAt: now + windowMs };
      clients.set(userId, data);
    }

    if (data.count < limit) {
      data.count++;
      return true;
    }
    return false;
  };
}`,
    testHelperCode: `function createRateLimiter_test(arg) {
  if (arg === 'within-limit') {
    const lim = createRateLimiter(3, 1000);
    return [lim('u1'), lim('u1'), lim('u1')];
  }
  if (arg === 'exceeds') {
    const lim = createRateLimiter(3, 1000);
    lim('u1'); lim('u1'); lim('u1');
    return lim('u1');
  }
  if (arg === 'independent') {
    const lim = createRateLimiter(1, 1000);
    return lim('user1') === true && lim('user2') === true;
  }
  if (arg === 'returns-function') return typeof createRateLimiter(3, 1000) === 'function';
  if (arg === 'limit-1') {
    const lim = createRateLimiter(1, 1000);
    return [lim('u1'), lim('u1')];
  }
}`,
  },
  {
    id: 'jsn-p1',
    topicId: 'js-network',
    title: 'fetch и статусы — что выведет код?',
    difficulty: 'easy',
    isContextual: false,
    kind: 'predict-output',
    description: `Перед вами код, который использует **мок-функцию** \`mockFetch\` вместо настоящего \`fetch\` (в sandbox реальная сеть недоступна). Мок возвращает Response-подобный объект с заданным статусом.

Внимательно прочитайте код и предскажите, что окажется в \`stdout\`.

\`\`\`js
function mockFetch(status) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve({ data: 'payload' }),
  });
}

async function load(status) {
  try {
    const res = await mockFetch(status);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const body = await res.json();
    console.log('ok:', body.data);
  } catch (err) {
    console.log('err:', err.message);
  }
}

(async () => {
  await load(200);
  await load(404);
  await load(500);
})();
\`\`\`

Введите ровно три строки в порядке вывода — каждая на своей строке.`,
    code: `function mockFetch(status) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve({ data: 'payload' }),
  });
}

async function load(status) {
  try {
    const res = await mockFetch(status);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const body = await res.json();
    console.log('ok:', body.data);
  } catch (err) {
    console.log('err:', err.message);
  }
}

(async () => {
  await load(200);
  await load(404);
  await load(500);
})();`,
    expected: 'ok: payload\nerr: HTTP 404\nerr: HTTP 500',
    hints: [
      'fetch (и наш мок) НЕ реджектится на 4xx/5xx — промис резолвится с объектом Response.',
      'Из-за этого ветка `catch` срабатывает только потому, что мы сами бросаем `new Error(...)` после `if (!res.ok)`.',
      'При статусе 200 `res.ok === true`, поэтому исключение не бросается и печатается «ok: payload».',
    ],
    solutionCode: `// Контракт fetch:
//   - резолвится при любом ответе со статусом, ok = (status в 200-299)
//   - реджектится ТОЛЬКО на сетевую ошибку или AbortError
//
// Поэтому:
//   load(200) → res.ok = true → res.json() → console.log('ok: payload')
//   load(404) → res.ok = false → throw 'HTTP 404' → console.log('err: HTTP 404')
//   load(500) → res.ok = false → throw 'HTTP 500' → console.log('err: HTTP 500')`,
  },
  {
    id: 'jsn-p2',
    topicId: 'js-network',
    title: 'searchClient — race condition в поиске',
    difficulty: 'medium',
    isContextual: true,
    kind: 'find-bug',
    description: `Реализован клиент поиска: при каждом нажатии клавиши вызывается \`search(query)\`, который дёргает мок \`api(query)\` и кладёт результат в \`state.lastResult\`.

В коде есть **race condition**: если ответ для предыдущего запроса приходит **позже**, чем ответ для нового, состояние затирается устаревшими данными. Найдите и исправьте баг.

Контракт:
- При каждом вызове \`search(query)\` нужно отменять/игнорировать результат предыдущего вызова.
- В \`state.lastResult\` всегда лежит результат **последнего** вызова \`search\`.
- Тестовый раннер вызывает \`search('a')\` (медленный, 30 мс) и сразу \`search('ab')\` (быстрый, 5 мс), затем ждёт 60 мс и читает \`state.lastResult\`. Должно быть значение для 'ab', а не для 'a'.

\`\`\`js
const state = { lastResult: null };

function api(query) {
  // Мок: для 'a' имитирует медленный ответ.
  const delay = query === 'a' ? 30 : 5;
  return new Promise((resolve) => {
    setTimeout(() => resolve('result-' + query), delay);
  });
}

// 🐞 Баг здесь:
async function search(query) {
  const result = await api(query);
  state.lastResult = result; // затирает состояние, даже если уже не актуально
}
\`\`\`

Подсказка: используйте счётчик последнего запроса или храните ссылку на «активный» ID.`,
    buggyCode: `const state = { lastResult: null };

function api(query) {
  const delay = query === 'a' ? 30 : 5;
  return new Promise((resolve) => {
    setTimeout(() => resolve('result-' + query), delay);
  });
}

async function search(query) {
  const result = await api(query);
  state.lastResult = result;
}`,
    functionName: 'searchClient_test',
    bugSummary:
      'Без отслеживания «активного» запроса медленный ответ предыдущего вызова приходит позже и затирает свежий результат. Нужен счётчик/токен запроса или AbortController.',
    testCases: [
      {
        id: 'jsn-p2-t1',
        inputDisplay: 'search("a") + search("ab") → state = result-ab',
        inputArgs: ['race-fix'],
        expected: 'result-ab',
      },
      {
        id: 'jsn-p2-t2',
        inputDisplay: 'один вызов search("x") → state = result-x',
        inputArgs: ['single'],
        expected: 'result-x',
      },
      {
        id: 'jsn-p2-t3',
        inputDisplay: 'три быстрых подряд: state = последний',
        inputArgs: ['three'],
        expected: 'result-c',
      },
    ],
    hints: [
      'Заведите счётчик `let activeId = 0`. На входе: `const myId = ++activeId`.',
      'После `await api(query)` проверяйте `if (myId !== activeId) return;` — мы устарели.',
      'Альтернатива — AbortController, но для мока проще монотонный счётчик.',
    ],
    solutionCode: `const state = { lastResult: null };

function api(query) {
  const delay = query === 'a' ? 30 : 5;
  return new Promise((resolve) => {
    setTimeout(() => resolve('result-' + query), delay);
  });
}

let activeId = 0;

async function search(query) {
  const myId = ++activeId;
  const result = await api(query);
  if (myId !== activeId) return; // устаревший ответ — игнорируем
  state.lastResult = result;
}`,
    testHelperCode: `async function searchClient_test(arg) {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  if (arg === 'race-fix') {
    state.lastResult = null;
    activeId = 0;
    search('a');   // медленный — 30 мс
    search('ab');  // быстрый — 5 мс
    await wait(60);
    return state.lastResult;
  }
  if (arg === 'single') {
    state.lastResult = null;
    activeId = 0;
    search('x');
    await wait(20);
    return state.lastResult;
  }
  if (arg === 'three') {
    state.lastResult = null;
    activeId = 0;
    search('a');   // 30 мс
    search('b');   // 5 мс
    search('c');   // 5 мс — последний
    await wait(60);
    return state.lastResult;
  }
}`,
  },
  {
    id: 'jsn-p3',
    topicId: 'js-network',
    title: 'loadDashboard — параллельные запросы вместо последовательных',
    difficulty: 'medium',
    isContextual: true,
    kind: 'refactor',
    description: `\`loadDashboard\` загружает три независимых раздела дашборда — пользователя, посты и метрики. Сейчас каждый \`await\` идёт **последовательно**: ждём первый ответ, потом второй, потом третий. На реальной сети это втрое медленнее необходимого.

Каждый из трёх запросов **независим** друг от друга — переписывайте на параллельный вариант через \`Promise.all\`. Контракт результата сохраните: функция должна возвращать объект \`{ user, posts, metrics }\` в том же формате.

Мок \`api(name)\` возвращает Promise со строкой "data-\${name}".

\`\`\`js
async function loadDashboard() {
  const user = await api('user');
  const posts = await api('posts');
  const metrics = await api('metrics');
  return { user, posts, metrics };
}
\`\`\`

Тесты проверяют только корректность результата — производительность вы должны улучшить осмысленно сами.`,
    starterCode: `function api(name) {
  return Promise.resolve('data-' + name);
}

async function loadDashboard() {
  const user = await api('user');
  const posts = await api('posts');
  const metrics = await api('metrics');
  return { user, posts, metrics };
}`,
    functionName: 'loadDashboard',
    testCases: [
      {
        id: 'jsn-p3-t1',
        inputDisplay: 'возвращает объект с тремя ключами',
        inputArgs: [],
        expected: { user: 'data-user', posts: 'data-posts', metrics: 'data-metrics' },
      },
    ],
    hints: [
      'Замените три await подряд на одно ожидание Promise.all([api("user"), api("posts"), api("metrics")]).',
      'Деструктурируйте массив результатов: `const [user, posts, metrics] = await Promise.all([...])`.',
      'Это даёт время выполнения = max(t1, t2, t3) вместо t1 + t2 + t3.',
    ],
    solutionCode: `function api(name) {
  return Promise.resolve('data-' + name);
}

async function loadDashboard() {
  const [user, posts, metrics] = await Promise.all([
    api('user'),
    api('posts'),
    api('metrics'),
  ]);
  return { user, posts, metrics };
}`,
  },
  {
    id: 'jsnet-p5',
    topicId: 'js-network',
    title: 'Router — простой URL-роутер',
    difficulty: 'medium',
    isContextual: false,
    description: `Реализуйте класс \`Router\`:
- \`get(pattern, handler)\` — регистрирует обработчик GET для паттерна
- \`match(method, url)\` — возвращает \`{ handler, params }\` если паттерн совпал, иначе \`null\`

Паттерн может содержать именованные сегменты \`:name\`.

Примеры:
\`\`\`
const router = new Router();
router.get('/users/:id', (params) => params.id);
router.get('/posts/:postId/comments', (params) => params.postId);

router.match('GET', '/users/42');
// → { handler: fn, params: { id: '42' } }

router.match('GET', '/unknown');
// → null
\`\`\``,
    functionName: 'Router_test',
    starterCode: `class Router {
  constructor() {
    // ваш код
  }

  get(pattern, handler) {
    // ваш код
  }

  match(method, url) {
    // ваш код — вернуть { handler, params } или null
  }
}`,
    testCases: [
      {
        id: 'jsnet-p5-t1',
        inputDisplay: 'match("GET", "/users/42") → params.id = "42"',
        inputArgs: ['basic-param'],
        expected: '42',
      },
      {
        id: 'jsnet-p5-t2',
        inputDisplay: 'несовпадающий URL → null',
        inputArgs: ['no-match'],
        expected: null,
      },
      {
        id: 'jsnet-p5-t3',
        inputDisplay: 'несколько параметров',
        inputArgs: ['multi-params'],
        expected: { postId: '5', commentId: '10' },
      },
      {
        id: 'jsnet-p5-t4',
        inputDisplay: 'статический маршрут без параметров',
        inputArgs: ['static'],
        expected: {},
      },
      {
        id: 'jsnet-p5-t5',
        inputDisplay: 'неверный метод → null',
        inputArgs: ['wrong-method'],
        expected: null,
      },
    ],
    hints: [
      'Для каждого паттерна создайте regex: `/users/:id` → `/^\/users\/([^\/]+)$/`. Сохраните имена параметров в массив.',
      'В match: для каждого роута выполните regex.exec(url). Если совпало — создайте params из имён и захваченных групп.',
      'Для преобразования паттерна: замените `:name` на `([^/]+)` и оберните в `^...$`.',
    ],
    solutionCode: `class Router {
  constructor() {
    this.routes = [];
  }

  get(pattern, handler) {
    const paramNames = [];
    const regexStr = pattern
      .replace(/:([^/]+)/g, (_, name) => {
        paramNames.push(name);
        return '([^/]+)';
      });
    this.routes.push({
      method: 'GET',
      regex: new RegExp(\`^\${regexStr}$\`),
      paramNames,
      handler,
    });
  }

  match(method, url) {
    for (const route of this.routes) {
      if (route.method !== method.toUpperCase()) continue;
      const match = route.regex.exec(url);
      if (!match) continue;
      const params = {};
      route.paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });
      return { handler: route.handler, params };
    }
    return null;
  }
}`,
    testHelperCode: `function Router_test(arg) {
  const router = new Router();
  router.get('/users/:id', (params) => params);
  router.get('/posts/:postId/comments/:commentId', (params) => params);
  router.get('/about', () => ({}));
  if (arg === 'basic-param') return router.match('GET', '/users/42')?.params?.id ?? null;
  if (arg === 'no-match') return router.match('GET', '/unknown');
  if (arg === 'multi-params') return router.match('GET', '/posts/5/comments/10')?.params ?? null;
  if (arg === 'static') return router.match('GET', '/about')?.params ?? null;
  if (arg === 'wrong-method') return router.match('POST', '/users/42');
}`,
  },
  {
    id: 'jsnet-h1',
    topicId: 'js-network',
    kind: 'implement',
    title: 'Circuit Breaker — паттерн защиты сервиса',
    difficulty: 'hard',
    isContextual: false,
    description: `Реализуйте класс \`CircuitBreaker\`, который оборачивает ненадёжную функцию и предотвращает каскадные сбои.

Состояния:
- **CLOSED** (норма): запросы проходят. После \`failureThreshold\` ошибок подряд — переходит в OPEN.
- **OPEN** (разомкнут): запросы блокируются немедленно с ошибкой "Circuit is OPEN". Через \`resetTimeout\` мс — переходит в HALF_OPEN.
- **HALF_OPEN** (проверка): пропускает один запрос. Успех → CLOSED, провал → OPEN снова.

\`\`\`js
const cb = new CircuitBreaker(fn, { failureThreshold: 2, resetTimeout: 1000 });
await cb.call()  // вызывает fn
\`\`\``,
    functionName: 'CircuitBreaker_test',
    starterCode: `class CircuitBreaker {
  constructor(fn, { failureThreshold, resetTimeout }) {
    // ваш код
  }

  async call(...args) {
    // ваш код
  }
}`,
    testCases: [
      { id: 'jsnet-h1-t1', inputDisplay: 'CLOSED: успешные вызовы проходят', inputArgs: ['success-pass'], expected: 'ok' },
      { id: 'jsnet-h1-t2', inputDisplay: 'после N ошибок → OPEN', inputArgs: ['becomes-open'], expected: 'OPEN' },
      { id: 'jsnet-h1-t3', inputDisplay: 'OPEN: запросы блокируются без вызова fn', inputArgs: ['open-blocks'], expected: 'Circuit is OPEN' },
      { id: 'jsnet-h1-t4', inputDisplay: 'сброс счётчика после успеха', inputArgs: ['reset-on-success'], expected: 'CLOSED' },
    ],
    hints: [
      'Храните state ("CLOSED"/"OPEN"/"HALF_OPEN"), счётчик ошибок и timestamp перехода в OPEN.',
      'В call(): если OPEN — проверьте timestamp. Если прошло resetTimeout — перейдите в HALF_OPEN и пропустите вызов.',
      'При успехе в HALF_OPEN — перейдите в CLOSED, сбросьте счётчик. При ошибке — обратно в OPEN.',
    ],
    solutionCode: `class CircuitBreaker {
  constructor(fn, { failureThreshold, resetTimeout }) {
    this.fn = fn;
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
    this.state = 'CLOSED';
    this.failures = 0;
    this.openedAt = null;
  }

  async call(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.openedAt >= this.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit is OPEN');
      }
    }

    try {
      const result = await this.fn(...args);
      this.failures = 0;
      this.state = 'CLOSED';
      return result;
    } catch (err) {
      this.failures++;
      if (this.state === 'HALF_OPEN' || this.failures >= this.failureThreshold) {
        this.state = 'OPEN';
        this.openedAt = Date.now();
        this.failures = 0;
      }
      throw err;
    }
  }
}`,
    testHelperCode: `async function CircuitBreaker_test(scenario) {
  if (scenario === 'success-pass') {
    const cb = new CircuitBreaker(async () => 'ok', { failureThreshold: 3, resetTimeout: 5000 });
    return await cb.call();
  }
  if (scenario === 'becomes-open') {
    const fail = async () => { throw new Error('fail'); };
    const cb = new CircuitBreaker(fail, { failureThreshold: 2, resetTimeout: 5000 });
    try { await cb.call(); } catch(e) {}
    try { await cb.call(); } catch(e) {}
    return cb.state;
  }
  if (scenario === 'open-blocks') {
    const fail = async () => { throw new Error('fail'); };
    const cb = new CircuitBreaker(fail, { failureThreshold: 2, resetTimeout: 5000 });
    try { await cb.call(); } catch(e) {}
    try { await cb.call(); } catch(e) {}
    try { await cb.call(); return 'should not reach'; }
    catch(e) { return e.message; }
  }
  if (scenario === 'reset-on-success') {
    let calls = 0;
    const fn = async () => { calls++; if (calls <= 1) throw new Error('fail'); return 'ok'; };
    const cb = new CircuitBreaker(fn, { failureThreshold: 1, resetTimeout: 5000 });
    try { await cb.call(); } catch(e) {}
    return cb.state;
  }
}`,
  },
  {
    id: 'jsnet-h2',
    topicId: 'js-network',
    kind: 'implement',
    title: 'Request deduplication — дедупликация параллельных запросов',
    difficulty: 'hard',
    isContextual: false,
    description: `Реализуйте функцию \`dedupeRequest(fetchFn)\`, которая оборачивает \`fetchFn\` и **дедуплицирует** одновременные запросы с одним ключом.

Если в момент выполнения запроса приходит ещё один с тем же ключом — он получает **тот же промис** (а не запускает новый запрос). После завершения кеш очищается.

Примеры:
\`\`\`js
let callCount = 0;
const fetcher = dedupeRequest(async (key) => {
  callCount++;
  await delay(50);
  return key + '_data';
});

// Параллельно:
const [r1, r2] = await Promise.all([fetcher('user'), fetcher('user')]);
// callCount === 1 (один реальный запрос)
// r1 === r2 === 'user_data'
\`\`\``,
    functionName: 'dedupeRequest_test',
    starterCode: `function dedupeRequest(fetchFn) {
  // ваш код
}`,
    testCases: [
      { id: 'jsnet-h2-t1', inputDisplay: 'параллельные запросы с одним ключом → один реальный вызов', inputArgs: ['dedup'], expected: 1 },
      { id: 'jsnet-h2-t2', inputDisplay: 'разные ключи → раздельные запросы', inputArgs: ['diff-keys'], expected: 2 },
      { id: 'jsnet-h2-t3', inputDisplay: 'повторный запрос после завершения → новый вызов', inputArgs: ['after-complete'], expected: 2 },
      { id: 'jsnet-h2-t4', inputDisplay: 'все участники получают одинаковый результат', inputArgs: ['same-result'], expected: true },
    ],
    hints: [
      'Храните Map<key, Promise> — кеш активных запросов.',
      'При вызове: если ключ есть в Map — возвращайте тот же промис. Иначе — создайте новый.',
      'В .finally() запроса удаляйте ключ из Map — чтобы следующий вызов запустил новый запрос.',
    ],
    solutionCode: `function dedupeRequest(fetchFn) {
  const pending = new Map();

  return function(key, ...args) {
    if (pending.has(key)) return pending.get(key);

    const promise = fetchFn(key, ...args).finally(() => pending.delete(key));
    pending.set(key, promise);
    return promise;
  };
}`,
    testHelperCode: `async function dedupeRequest_test(scenario) {
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  if (scenario === 'dedup') {
    let calls = 0;
    const fetcher = dedupeRequest(async (key) => { calls++; await delay(20); return key; });
    await Promise.all([fetcher('a'), fetcher('a'), fetcher('a')]);
    return calls;
  }
  if (scenario === 'diff-keys') {
    let calls = 0;
    const fetcher = dedupeRequest(async (key) => { calls++; await delay(10); return key; });
    await Promise.all([fetcher('a'), fetcher('b')]);
    return calls;
  }
  if (scenario === 'after-complete') {
    let calls = 0;
    const fetcher = dedupeRequest(async (key) => { calls++; await delay(10); return key; });
    await fetcher('a');
    await fetcher('a');
    return calls;
  }
  if (scenario === 'same-result') {
    const fetcher = dedupeRequest(async (key) => { await delay(10); return key + '_val'; });
    const [r1, r2, r3] = await Promise.all([fetcher('x'), fetcher('x'), fetcher('x')]);
    return r1 === r2 && r2 === r3 && r1 === 'x_val';
  }
}`,
  },
];
