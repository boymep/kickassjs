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
    code: `function getCounterFns() {
  const fns = [];
  for (var i = 0; i < 5; i++) {
    fns.push(function () {
      return i;
    });
  }
  return fns;
}`,
    bugs: [
      {
        description: '`var` создаёт одну переменную на весь цикл — все функции замыкаются на одно и то же `i`',
        fix: 'Заменить `var i` на `let i`',
        explanation:
          'К моменту вызова функций цикл уже завершился и `i === 5`. Все пять функций видят одно и то же `i`. С `let` каждая итерация получает собственный binding переменной, поэтому замыкания изолированы. Альтернатива до ES6 — IIFE: `(function(j){ fns.push(() => j); })(i)`.',
      },
    ],
    functionName: 'bh01_test',
    testCases: [
      { id: 'bh-01-t1', inputDisplay: 'fns[0]()', inputArgs: [0], expected: 0 },
      { id: 'bh-01-t2', inputDisplay: 'fns[1]()', inputArgs: [1], expected: 1 },
      { id: 'bh-01-t3', inputDisplay: 'fns[2]()', inputArgs: [2], expected: 2 },
      { id: 'bh-01-t4', inputDisplay: 'fns[3]()', inputArgs: [3], expected: 3 },
      { id: 'bh-01-t5', inputDisplay: 'fns[4]()', inputArgs: [4], expected: 4 },
    ],
    solutionCode: `function getCounterFns() {
  const fns = [];
  for (let i = 0; i < 5; i++) {
    fns.push(function () {
      return i;
    });
  }
  return fns;
}`,
    testHelperCode: `function bh01_test(i) { return getCounterFns()[i](); }`,
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
    getAll() { return cache; },
  };
}`,
    bugs: [
      {
        description: '`getAll()` возвращает прямую ссылку на внутренний объект `cache` — любые изменения снаружи мутируют его',
        fix: 'Вернуть копию: `return { ...cache }` или `return Object.assign({}, cache)`',
        explanation:
          'Объекты передаются по ссылке. `getAll()` «пробивает» приватность замыкания: внешний код получает прямой доступ к cache и может изменить или прочитать любые внутренние данные. Решение: возвращать shallow copy (`{ ...cache }`) или deep copy (`structuredClone(cache)`) в зависимости от требований.',
      },
    ],
    functionName: 'bh02_test',
    testCases: [
      {
        id: 'bh-02-t1',
        inputDisplay: 'мутация результата getAll() не влияет на кеш',
        inputArgs: ['mutation-isolation'],
        expected: 'secret',
      },
      {
        id: 'bh-02-t2',
        inputDisplay: 'добавление ключа в getAll() не утекает в cache',
        inputArgs: ['add-key-isolation'],
        expected: undefined,
      },
      {
        id: 'bh-02-t3',
        inputDisplay: 'set/get продолжают работать',
        inputArgs: ['basic-set-get'],
        expected: 'value',
      },
      {
        id: 'bh-02-t4',
        inputDisplay: 'getAll() возвращает копию всех записей',
        inputArgs: ['snapshot-keys'],
        expected: 2,
      },
    ],
    solutionCode: `function createCache() {
  const cache = {};
  return {
    set(key, value) { cache[key] = value; },
    get(key) { return cache[key]; },
    getAll() { return { ...cache }; },
  };
}`,
    testHelperCode: `function bh02_test(arg) {
  const c = createCache();
  if (arg === 'mutation-isolation') {
    c.set('token', 'secret');
    const all = c.getAll();
    all.token = 'hacked';
    return c.get('token');
  }
  if (arg === 'add-key-isolation') {
    c.set('a', 1);
    const all = c.getAll();
    all.injected = 'x';
    return c.get('injected');
  }
  if (arg === 'basic-set-get') {
    c.set('k', 'value');
    return c.get('k');
  }
  if (arg === 'snapshot-keys') {
    c.set('a', 1);
    c.set('b', 2);
    const all = c.getAll();
    return Object.keys(all).length;
  }
}`,
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
  return function (...args) {
    timer = setTimeout(() => fn(...args), delay);
  };
}`,
    bugs: [
      {
        description: 'Отсутствует `clearTimeout(timer)` перед установкой нового — каждый вызов создаёт новый таймер, функция выполнится N раз',
        fix: 'Добавить `clearTimeout(timer);` в начало возвращаемой функции',
        explanation:
          'Смысл debounce — отменять предыдущий таймер при каждом новом вызове. Без `clearTimeout` за три вызова создаются три независимых `setTimeout`, и `fetchResults` вызовется три раза через 300ms. Правильно: сначала `clearTimeout(timer)`, затем `timer = setTimeout(...)`.',
      },
    ],
    functionName: 'bh03_test',
    testCases: [
      {
        id: 'bh-03-t1',
        inputDisplay: '3 быстрых вызова → fn вызвана 1 раз',
        inputArgs: ['three-rapid'],
        expected: 1,
      },
      {
        id: 'bh-03-t2',
        inputDisplay: 'fn получает аргументы последнего вызова',
        inputArgs: ['last-args'],
        expected: 'hel',
      },
      {
        id: 'bh-03-t3',
        inputDisplay: '5 быстрых вызовов → fn вызвана 1 раз',
        inputArgs: ['five-rapid'],
        expected: 1,
      },
      {
        id: 'bh-03-t4',
        inputDisplay: 'один одиночный вызов всё ещё проходит',
        inputArgs: ['single-call'],
        expected: 1,
      },
    ],
    solutionCode: `function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}`,
    testHelperCode: `function bh03_test(arg) {
  return new Promise((resolve) => {
    let calls = 0;
    let lastArg = null;
    const fn = (a) => { calls++; lastArg = a; };
    const d = debounce(fn, 20);
    if (arg === 'three-rapid') {
      d('a'); d('b'); d('c');
      setTimeout(() => resolve(calls), 80);
    } else if (arg === 'last-args') {
      d('h'); d('he'); d('hel');
      setTimeout(() => resolve(lastArg), 80);
    } else if (arg === 'five-rapid') {
      d(1); d(2); d(3); d(4); d(5);
      setTimeout(() => resolve(calls), 80);
    } else if (arg === 'single-call') {
      d('x');
      setTimeout(() => resolve(calls), 80);
    }
  });
}`,
  },
  {
    id: 'bh-04',
    title: 'Потеря контекста в setTimeout',
    topic: 'js-event-loop',
    topicLabel: 'Event Loop',
    difficulty: 'easy',
    language: 'javascript',
    code: `function makePoller() {
  const state = { count: 0 };
  state.tick = function () {
    setTimeout(function () {
      this.count++;
    }.bind(null), 0);
  };
  return state;
}`,
    bugs: [
      {
        description: 'Обычная функция в `setTimeout` теряет `this` — `bind(null)` фиксирует null/undefined, поэтому `this.count++` не находит count',
        fix: 'Заменить `function() { this.count++ }.bind(null)` на стрелочную `() => state.count++` (или `bind(state)`)',
        explanation:
          'setTimeout вызывает callback без контекста — default binding даёт `window` или `undefined` в strict mode. Стрелочная функция лексически захватывает state из окружающего scope, или `bind(state)` явно фиксирует контекст. Это классический паттерн: стрелочные функции идеальны как callback-и внутри методов.',
      },
    ],
    functionName: 'bh04_test',
    testCases: [
      {
        id: 'bh-04-t1',
        inputDisplay: 'один tick → count === 1',
        inputArgs: ['one-tick'],
        expected: 1,
      },
      {
        id: 'bh-04-t2',
        inputDisplay: 'три tick → count === 3',
        inputArgs: ['three-ticks'],
        expected: 3,
      },
      {
        id: 'bh-04-t3',
        inputDisplay: 'count начинается с 0',
        inputArgs: ['initial'],
        expected: 0,
      },
    ],
    solutionCode: `function makePoller() {
  const state = { count: 0 };
  state.tick = function () {
    setTimeout(() => { state.count++; }, 0);
  };
  return state;
}`,
    testHelperCode: `function bh04_test(arg) {
  return new Promise((resolve) => {
    const p = makePoller();
    if (arg === 'initial') return resolve(p.count);
    if (arg === 'one-tick') {
      p.tick();
      setTimeout(() => resolve(p.count), 30);
    } else if (arg === 'three-ticks') {
      p.tick(); p.tick(); p.tick();
      setTimeout(() => resolve(p.count), 30);
    }
  });
}`,
  },

  // ─── JS: this ────────────────────────────────────────────────────────────
  {
    id: 'bh-05',
    title: 'Стрелочный метод объекта',
    topic: 'js-this',
    topicLabel: 'this и контекст',
    difficulty: 'easy',
    language: 'javascript',
    code: `function makeUser(name) {
  return {
    name: name,
    greet: () => {
      return 'Hello, ' + this.name + '!';
    },
  };
}`,
    bugs: [
      {
        description: 'Стрелочная функция как метод объекта захватывает `this` из лексического окружения — глобального scope, а не из объекта',
        fix: 'Заменить стрелочную функцию на обычную: `greet() { ... }` или `greet: function() { ... }`',
        explanation:
          'Стрелочные функции не имеют собственного `this`. При определении в теле объектного литерала их `this` — это `this` внешнего scope (обычно `window` или `undefined` в strict). Для методов объекта и прототипа всегда используйте обычные функции. Стрелочные функции подходят как callback внутри уже привязанных методов.',
      },
    ],
    functionName: 'bh05_test',
    testCases: [
      {
        id: 'bh-05-t1',
        inputDisplay: 'makeUser("Alice").greet()',
        inputArgs: ['Alice'],
        expected: 'Hello, Alice!',
      },
      {
        id: 'bh-05-t2',
        inputDisplay: 'makeUser("Bob").greet()',
        inputArgs: ['Bob'],
        expected: 'Hello, Bob!',
      },
      {
        id: 'bh-05-t3',
        inputDisplay: 'makeUser("").greet() — пустое имя',
        inputArgs: [''],
        expected: 'Hello, !',
      },
    ],
    solutionCode: `function makeUser(name) {
  return {
    name: name,
    greet() {
      return 'Hello, ' + this.name + '!';
    },
  };
}`,
    testHelperCode: `function bh05_test(name) { return makeUser(name).greet(); }`,
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

function makeBoundForBob(target) {
  const alice = { name: 'Alice' };
  const getAliceName = getName.bind(alice);
  return getAliceName.bind(target);
}`,
    bugs: [
      {
        description: '`bind` создаёт «жёсткую» привязку — повторный `bind` на уже привязанную функцию не меняет `this`',
        fix: 'Вызвать `bind(target)` на оригинальную функцию: `getName.bind(target)`',
        explanation:
          'bind возвращает новую функцию с неизменяемым `this`. Под капотом она вызывает `call(originalThis, ...)` напрямую, игнорируя любые последующие попытки изменить контекст через bind, call или apply. Для создания новой привязки — bind только на оригинальную функцию.',
      },
    ],
    functionName: 'bh06_test',
    testCases: [
      {
        id: 'bh-06-t1',
        inputDisplay: 'переподвязка на Bob → "Bob"',
        inputArgs: ['Bob'],
        expected: 'Bob',
      },
      {
        id: 'bh-06-t2',
        inputDisplay: 'переподвязка на Charlie → "Charlie"',
        inputArgs: ['Charlie'],
        expected: 'Charlie',
      },
      {
        id: 'bh-06-t3',
        inputDisplay: 'переподвязка на Diana → "Diana"',
        inputArgs: ['Diana'],
        expected: 'Diana',
      },
    ],
    solutionCode: `function getName() {
  return this.name;
}

function makeBoundForBob(target) {
  return getName.bind(target);
}`,
    testHelperCode: `function bh06_test(name) {
  const target = { name };
  return makeBoundForBob(target)();
}`,
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
    const r = await new Promise((res) => setTimeout(() => res(item * 2), 10));
    results.push(r);
  });
  return results;
}`,
    bugs: [
      {
        description: '`forEach` не является async-aware и не ждёт Promise-ы из async callback — `results` будет пустым при return',
        fix: 'Использовать `await Promise.all(items.map(async item => ...))` или `for...of` с await',
        explanation:
          'forEach просто вызывает каждый callback и игнорирует возвращаемый Promise. processAll завершается и возвращает пустой `results[]` до того, как завершится хоть одна операция. Для параллельного выполнения с ожиданием всех: `await Promise.all(items.map(...))`. Для последовательного: `for (const item of items) { results.push(await ...); }`.',
      },
    ],
    functionName: 'processAll',
    testCases: [
      {
        id: 'bh-07-t1',
        inputDisplay: 'processAll([1,2,3])',
        inputArgs: [[1, 2, 3]],
        expected: [2, 4, 6],
      },
      {
        id: 'bh-07-t2',
        inputDisplay: 'processAll([])',
        inputArgs: [[]],
        expected: [],
      },
      {
        id: 'bh-07-t3',
        inputDisplay: 'processAll([10])',
        inputArgs: [[10]],
        expected: [20],
      },
      {
        id: 'bh-07-t4',
        inputDisplay: 'processAll([0,5,7])',
        inputArgs: [[0, 5, 7]],
        expected: [0, 10, 14],
      },
    ],
    solutionCode: `async function processAll(items) {
  return Promise.all(items.map(async (item) => {
    const r = await new Promise((res) => setTimeout(() => res(item * 2), 10));
    return r;
  }));
}`,
  },
  {
    id: 'bh-08',
    title: 'Проглоченный rejected Promise',
    topic: 'js-async',
    topicLabel: 'Async / Промисы',
    difficulty: 'easy',
    language: 'javascript',
    code: `async function safeLoad(loader) {
  const data = await loader();
  return { ok: true, data };
}`,
    bugs: [
      {
        description: 'Промис `loader()` может зареджектиться — без try/catch ошибка пробрасывается выше как UnhandledPromiseRejection',
        fix: 'Обернуть await в try/catch и вернуть `{ ok: false, error: ... }`',
        explanation:
          'Любой rejected Promise без обработки — ошибка. В браузере это `unhandledrejection` событие. В Node.js 15+ — завершение процесса с exit code 1. Правильные варианты: try/catch вокруг await, `.catch()` на промисе, или глобальный `unhandledRejection` как последний рубеж.',
      },
    ],
    functionName: 'bh08_test',
    testCases: [
      {
        id: 'bh-08-t1',
        inputDisplay: 'успех — возвращает { ok: true, data: 42 }',
        inputArgs: ['success'],
        expected: { ok: true, data: 42 },
      },
      {
        id: 'bh-08-t2',
        inputDisplay: 'reject не пробрасывается — { ok: false, error: "boom" }',
        inputArgs: ['reject'],
        expected: { ok: false, error: 'boom' },
      },
      {
        id: 'bh-08-t3',
        inputDisplay: 'sync throw тоже ловится',
        inputArgs: ['sync-throw'],
        expected: { ok: false, error: 'sync' },
      },
    ],
    solutionCode: `async function safeLoad(loader) {
  try {
    const data = await loader();
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e.message ?? String(e) };
  }
}`,
    testHelperCode: `function bh08_test(arg) {
  if (arg === 'success') return safeLoad(async () => 42);
  if (arg === 'reject') return safeLoad(async () => { throw new Error('boom'); });
  if (arg === 'sync-throw') return safeLoad(() => { throw new Error('sync'); });
}`,
  },
  {
    id: 'bh-09',
    title: 'Race condition в async',
    topic: 'js-async',
    topicLabel: 'Async / Промисы',
    difficulty: 'hard',
    language: 'javascript',
    code: `function makeSearch(api) {
  let lastResult = null;
  async function search(query) {
    const data = await api(query);
    lastResult = data;
    return lastResult;
  }
  return { search, getLast: () => lastResult };
}`,
    bugs: [
      {
        description: 'Устаревший ответ (от более медленного запроса) может перезаписать актуальный — отображается неверный результат',
        fix: 'Сохранять идентификатор последнего вызова и игнорировать ответ, если он уже не актуален',
        explanation:
          'Race condition: два асинхронных запроса выполняются параллельно, порядок завершения непредсказуем. Если первый запрос завершится позже второго, он перезапишет более свежий результат. Решение: счётчик `requestId`, проверять `if (myId !== currentId) return` после await. Альтернатива — AbortController.',
      },
    ],
    functionName: 'bh09_test',
    testCases: [
      {
        id: 'bh-09-t1',
        inputDisplay: 'медленный js (50ms) и быстрый javascript (10ms) → "javascript"',
        inputArgs: ['race'],
        expected: 'javascript',
      },
      {
        id: 'bh-09-t2',
        inputDisplay: 'один запрос отрабатывает как обычно',
        inputArgs: ['single'],
        expected: 'react',
      },
      {
        id: 'bh-09-t3',
        inputDisplay: 'три параллельных, последний — самый медленный',
        inputArgs: ['three'],
        expected: 'final',
      },
    ],
    solutionCode: `function makeSearch(api) {
  let lastResult = null;
  let currentId = 0;
  async function search(query) {
    const myId = ++currentId;
    const data = await api(query);
    if (myId !== currentId) return lastResult;
    lastResult = data;
    return lastResult;
  }
  return { search, getLast: () => lastResult };
}`,
    testHelperCode: `function bh09_test(arg) {
  return new Promise((resolve) => {
    if (arg === 'race') {
      const api = (q) => new Promise((res) => {
        const delay = q === 'js' ? 50 : 10;
        setTimeout(() => res(q), delay);
      });
      const { search, getLast } = makeSearch(api);
      search('js');
      search('javascript');
      setTimeout(() => resolve(getLast()), 100);
    } else if (arg === 'single') {
      const api = (q) => Promise.resolve(q);
      const { search, getLast } = makeSearch(api);
      search('react').then(() => resolve(getLast()));
    } else if (arg === 'three') {
      const api = (q) => new Promise((res) => {
        const map = { a: 5, b: 10, final: 30 };
        setTimeout(() => res(q), map[q]);
      });
      const { search, getLast } = makeSearch(api);
      search('a');
      search('b');
      search('final');
      setTimeout(() => resolve(getLast()), 80);
    }
  });
}`,
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
    if (source[key] && typeof source[key] === 'object') {
      target[key] = target[key] || {};
      merge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}`,
    bugs: [
      {
        description: 'Функция merge без проверки позволяет установить свойства через `__proto__`, заражая `Object.prototype` и все существующие объекты',
        fix: 'Добавить проверку: `if (key === "__proto__" || key === "constructor" || key === "prototype") continue;`',
        explanation:
          'Prototype Pollution — класс уязвимостей. При merge ключа `__proto__` изменяется Object.prototype, что влияет на все объекты в приложении. Злоумышленник может добавить `isAdmin: true` или перезаписать методы. Защита: проверять ключи, использовать `Object.hasOwn` вместо `in`, или `Object.create(null)` для «чистых» объектов без прототипа.',
      },
    ],
    functionName: 'bh10_test',
    testCases: [
      {
        id: 'bh-10-t1',
        inputDisplay: 'после merge с __proto__ — {}.isAdmin не должно быть true',
        inputArgs: ['pollution'],
        expected: false,
      },
      {
        id: 'bh-10-t2',
        inputDisplay: 'обычный merge {a:1} + {b:2} → {a:1, b:2}',
        inputArgs: ['basic'],
        expected: { a: 1, b: 2 },
      },
      {
        id: 'bh-10-t3',
        inputDisplay: 'вложенный merge сохраняет глубину',
        inputArgs: ['nested'],
        expected: { x: { y: 1, z: 2 } },
      },
    ],
    solutionCode: `function merge(target, source) {
  for (const key in source) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    if (source[key] && typeof source[key] === 'object') {
      target[key] = target[key] || {};
      merge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}`,
    testHelperCode: `function bh10_test(arg) {
  if (arg === 'pollution') {
    const payload = JSON.parse('{"__proto__": {"isAdmin": true}}');
    merge({}, payload);
    const polluted = ({}).isAdmin === true;
    // cleanup
    delete Object.prototype.isAdmin;
    return polluted;
  }
  if (arg === 'basic') {
    return merge({ a: 1 }, { b: 2 });
  }
  if (arg === 'nested') {
    return merge({ x: { y: 1 } }, { x: { z: 2 } });
  }
}`,
  },

  // ─── JS: DOM ─────────────────────────────────────────────────────────────
  {
    id: 'bh-11',
    title: 'XSS через innerHTML',
    topic: 'js-dom',
    topicLabel: 'DOM и события',
    difficulty: 'medium',
    language: 'javascript',
    code: `function renderComment(node, userInput) {
  node.innerHTML = userInput;
  return node;
}`,
    bugs: [
      {
        description: 'Вставка пользовательского контента через `innerHTML` позволяет выполнить произвольный JavaScript — XSS-уязвимость',
        fix: 'Использовать `textContent` для текста или DOMPurify для HTML-контента',
        explanation:
          'innerHTML интерпретирует строку как HTML. Злоумышленник вставляет `<script>` или атрибуты-обработчики (`onerror`, `onclick`) для выполнения кода в контексте страницы. Безопасные альтернативы: `element.textContent = userInput` (экранирует HTML-теги), `DOMPurify.sanitize(html)` если нужен HTML-форматирование, `document.createTextNode()`.',
      },
    ],
    functionName: 'bh11_test',
    testCases: [
      {
        id: 'bh-11-t1',
        inputDisplay: 'XSS-payload не должен попасть в innerHTML',
        inputArgs: ['xss'],
        expected: false,
      },
      {
        id: 'bh-11-t2',
        inputDisplay: 'обычный текст сохраняется как textContent',
        inputArgs: ['plain'],
        expected: 'hello',
      },
      {
        id: 'bh-11-t3',
        inputDisplay: 'HTML-теги в строке экранируются (как текст)',
        inputArgs: ['tag-as-text'],
        expected: '<b>x</b>',
      },
    ],
    solutionCode: `function renderComment(node, userInput) {
  node.textContent = userInput;
  return node;
}`,
    testHelperCode: `function makeNode() {
  let _innerHTML = '';
  let _textContent = '';
  return {
    set innerHTML(v) { _innerHTML = v; },
    get innerHTML() { return _innerHTML; },
    set textContent(v) { _textContent = v; },
    get textContent() { return _textContent; },
  };
}
function bh11_test(arg) {
  const node = makeNode();
  if (arg === 'xss') {
    const payload = '<img src=x onerror="hacked()">';
    renderComment(node, payload);
    // bug: innerHTML contains the dangerous markup; fix: textContent stores it as plain text.
    return node.innerHTML.includes('onerror');
  }
  if (arg === 'plain') {
    renderComment(node, 'hello');
    return node.textContent || node.innerHTML;
  }
  if (arg === 'tag-as-text') {
    renderComment(node, '<b>x</b>');
    return node.textContent || node.innerHTML;
  }
}`,
  },
  {
    id: 'bh-12',
    title: 'Layout Thrashing в анимации',
    topic: 'js-dom',
    topicLabel: 'DOM и события',
    difficulty: 'medium',
    language: 'javascript',
    code: `function animateBoxes(boxes) {
  for (const box of boxes) {
    const w = box.offsetWidth;
    box.style.width = (w + 10) + 'px';
  }
}`,
    bugs: [
      {
        description: 'Чередование чтения `offsetWidth` и записи `style.width` в цикле вызывает Layout Thrashing — N reflow вместо одного',
        fix: 'Разделить фазы: сначала все чтения в один массив, затем все записи',
        explanation:
          'Браузер откладывает reflow до конца JS-кода (batching). Но чтение геометрических свойств (`offsetWidth`, `getBoundingClientRect`, `scrollTop`) после записи требует актуальных данных — браузер принудительно делает reflow немедленно (Forced Synchronous Layout). В цикле это N reflow. Решение: сначала batch чтений, затем batch записей.',
      },
    ],
    functionName: 'bh12_test',
    testCases: [
      {
        id: 'bh-12-t1',
        inputDisplay: '3 box → 0 принудительных reflow (batched)',
        inputArgs: ['reflow-count-3'],
        expected: 0,
      },
      {
        id: 'bh-12-t2',
        inputDisplay: '5 box → ширины обновляются на +10',
        inputArgs: ['widths-5'],
        expected: [110, 120, 130, 140, 150],
      },
      {
        id: 'bh-12-t3',
        inputDisplay: '10 box → 0 принудительных reflow',
        inputArgs: ['reflow-count-10'],
        expected: 0,
      },
    ],
    solutionCode: `function animateBoxes(boxes) {
  const widths = boxes.map((b) => b.offsetWidth);
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].style.width = (widths[i] + 10) + 'px';
  }
}`,
    testHelperCode: `function makeBoxes(widths) {
  let pendingWrite = false;
  let reflows = 0;
  const boxes = widths.map((w) => {
    const box = {
      _w: w,
      style: {},
      get offsetWidth() {
        if (pendingWrite) { reflows++; pendingWrite = false; }
        return this._w;
      },
    };
    Object.defineProperty(box.style, 'width', {
      set(v) {
        box._w = parseInt(v, 10);
        pendingWrite = true;
      },
      get() { return box._w + 'px'; },
    });
    return box;
  });
  return { boxes, getReflows: () => reflows };
}
function bh12_test(arg) {
  if (arg === 'reflow-count-3') {
    const { boxes, getReflows } = makeBoxes([100, 110, 120]);
    animateBoxes(boxes);
    return getReflows();
  }
  if (arg === 'widths-5') {
    const { boxes } = makeBoxes([100, 110, 120, 130, 140]);
    animateBoxes(boxes);
    return boxes.map((b) => parseInt(b.style.width, 10));
  }
  if (arg === 'reflow-count-10') {
    const widths = Array.from({ length: 10 }, (_, i) => 100 + i * 10);
    const { boxes, getReflows } = makeBoxes(widths);
    animateBoxes(boxes);
    return getReflows();
  }
}`,
  },

  // ─── Node.js: Event Loop ─────────────────────────────────────────────────
  {
    id: 'bh-13',
    title: 'Блокирующий readFileSync',
    topic: 'node-event-loop',
    topicLabel: 'Node.js Event Loop',
    difficulty: 'easy',
    language: 'javascript',
    code: `function makeConfigHandler(fs) {
  return function handler(req) {
    const config = fs.readFileSync('./config.json', 'utf8');
    return JSON.parse(config);
  };
}`,
    bugs: [
      {
        description: '`fs.readFileSync` блокирует Event Loop на время чтения файла — все остальные запросы ждут',
        fix: 'Использовать `await fs.promises.readFile(...)` или читать config один раз при старте',
        explanation:
          'readFileSync — синхронная операция, которая держит весь Node.js процесс занятым до завершения I/O. При высокой нагрузке это убивает throughput. Правильно: читать config один раз при старте сервера, или использовать асинхронный `fs.promises.readFile` и await.',
      },
    ],
    functionName: 'bh13_test',
    testCases: [
      {
        id: 'bh-13-t1',
        inputDisplay: 'обработчик не использует sync API',
        inputArgs: ['no-sync-call'],
        expected: 0,
      },
      {
        id: 'bh-13-t2',
        inputDisplay: 'обработчик возвращает распарсенный config',
        inputArgs: ['parses-config'],
        expected: { port: 3000 },
      },
      {
        id: 'bh-13-t3',
        inputDisplay: 'два вызова — один и тот же объект (cached)',
        inputArgs: ['async-read-count'],
        expected: 1,
      },
    ],
    solutionCode: `function makeConfigHandler(fs) {
  const cachePromise = fs.promises.readFile('./config.json', 'utf8').then(JSON.parse);
  return async function handler(req) {
    return cachePromise;
  };
}`,
    testHelperCode: `function makeFs() {
  let syncCalls = 0;
  let asyncCalls = 0;
  return {
    readFileSync() { syncCalls++; return '{"port":3000}'; },
    promises: {
      readFile() { asyncCalls++; return Promise.resolve('{"port":3000}'); },
    },
    getSync: () => syncCalls,
    getAsync: () => asyncCalls,
  };
}
function bh13_test(arg) {
  const fs = makeFs();
  const h = makeConfigHandler(fs);
  if (arg === 'no-sync-call') {
    return Promise.resolve(h({})).then(() => Promise.resolve(h({}))).then(() => fs.getSync());
  }
  if (arg === 'parses-config') {
    return Promise.resolve(h({})).then((v) => v);
  }
  if (arg === 'async-read-count') {
    return Promise.resolve(h({})).then(() => Promise.resolve(h({}))).then(() => Promise.resolve(h({}))).then(() => fs.getAsync());
  }
}`,
  },
  {
    id: 'bh-14',
    title: 'EventEmitter утечка памяти',
    topic: 'node-event-loop',
    topicLabel: 'Node.js Event Loop',
    difficulty: 'medium',
    language: 'javascript',
    code: `function handleRequest(bus, req, refreshConfig, processRequest) {
  bus.on('config-update', () => {
    refreshConfig(req);
  });
  processRequest(req);
}`,
    bugs: [
      {
        description: 'Каждый вызов `handleRequest` добавляет нового подписчика на `config-update`, который никогда не удаляется — утечка памяти и неожиданное поведение',
        fix: 'Использовать `bus.once(...)` или явно вызывать `bus.off()` после использования',
        explanation:
          'EventEmitter не ограничивает количество подписчиков (предупреждение при > 10, но работа продолжается). Каждый обработчик держит ссылку на `req` — GC не может освободить объекты запроса. Решение: `bus.once("config-update", handler)` — автоматически снимается. Или сохранить handler в переменную и вызвать `bus.off("config-update", handler)` по завершении запроса.',
      },
    ],
    functionName: 'bh14_test',
    testCases: [
      {
        id: 'bh-14-t1',
        inputDisplay: '5 запросов → не более 5 живых подписчиков после single emit',
        inputArgs: ['leak-count'],
        expected: 0,
      },
      {
        id: 'bh-14-t2',
        inputDisplay: 'refreshConfig вызывается при emit',
        inputArgs: ['fires-once'],
        expected: 1,
      },
      {
        id: 'bh-14-t3',
        inputDisplay: 'processRequest вызывается синхронно',
        inputArgs: ['process-called'],
        expected: 3,
      },
    ],
    solutionCode: `function handleRequest(bus, req, refreshConfig, processRequest) {
  bus.once('config-update', () => {
    refreshConfig(req);
  });
  processRequest(req);
}`,
    testHelperCode: `function makeBus() {
  const handlers = new Map();
  return {
    on(type, fn) {
      if (!handlers.has(type)) handlers.set(type, []);
      handlers.get(type).push({ fn, once: false });
    },
    once(type, fn) {
      if (!handlers.has(type)) handlers.set(type, []);
      handlers.get(type).push({ fn, once: true });
    },
    emit(type, payload) {
      const list = handlers.get(type) || [];
      const remaining = [];
      for (const h of list) {
        h.fn(payload);
        if (!h.once) remaining.push(h);
      }
      handlers.set(type, remaining);
    },
    listenerCount(type) { return (handlers.get(type) || []).length; },
  };
}
function bh14_test(arg) {
  const bus = makeBus();
  let refreshes = 0;
  let processes = 0;
  const refresh = () => refreshes++;
  const proc = () => processes++;
  if (arg === 'leak-count') {
    for (let i = 0; i < 5; i++) handleRequest(bus, { i }, refresh, proc);
    bus.emit('config-update', null);
    return bus.listenerCount('config-update');
  }
  if (arg === 'fires-once') {
    handleRequest(bus, {}, refresh, proc);
    bus.emit('config-update', null);
    return refreshes;
  }
  if (arg === 'process-called') {
    handleRequest(bus, {}, refresh, proc);
    handleRequest(bus, {}, refresh, proc);
    handleRequest(bus, {}, refresh, proc);
    return processes;
  }
}`,
  },

  // ─── Node.js: Streams ────────────────────────────────────────────────────
  {
    id: 'bh-15',
    title: 'pipe без обработки ошибок',
    topic: 'node-streams',
    topicLabel: 'Стримы',
    difficulty: 'medium',
    language: 'javascript',
    code: `async function compress(source, transform, sink) {
  for await (const chunk of source) {
    const out = await transform(chunk);
    await sink.write(out);
  }
  await sink.end();
  return 'done';
}`,
    bugs: [
      {
        description: 'При ошибке в любом стриме (source/transform) sink остаётся открытым — нет cleanup в catch',
        fix: 'Обернуть в try/finally и вызвать `sink.destroy()` (или `sink.end()`) при ошибке',
        explanation:
          'В отличие от pipeline, ручной for-await-of не пропагирует ошибки вниз по цепочке. Если source упадёт — sink не узнает об ошибке и не закроется. Это утечка файловых дескрипторов. pipeline из `stream/promises` автоматически вызывает `destroy()` на все стримы при любой ошибке и возвращает rejected Promise.',
      },
    ],
    functionName: 'bh15_test',
    testCases: [
      {
        id: 'bh-15-t1',
        inputDisplay: 'успешный прогон → "done", sink закрыт',
        inputArgs: ['success'],
        expected: 'done-closed',
      },
      {
        id: 'bh-15-t2',
        inputDisplay: 'ошибка в source → sink всё равно закрыт',
        inputArgs: ['source-error'],
        expected: 'closed',
      },
      {
        id: 'bh-15-t3',
        inputDisplay: 'ошибка в transform → sink всё равно закрыт',
        inputArgs: ['transform-error'],
        expected: 'closed',
      },
    ],
    solutionCode: `async function compress(source, transform, sink) {
  try {
    for await (const chunk of source) {
      const out = await transform(chunk);
      await sink.write(out);
    }
    await sink.end();
    return 'done';
  } catch (e) {
    await sink.destroy();
    throw e;
  }
}`,
    testHelperCode: `function makeSink() {
  let closed = false;
  return {
    write() { return Promise.resolve(); },
    end() { closed = true; return Promise.resolve(); },
    destroy() { closed = true; return Promise.resolve(); },
    isClosed: () => closed,
  };
}
async function* okSource() { yield 1; yield 2; yield 3; }
async function* errSource() { yield 1; throw new Error('source-fail'); }
function bh15_test(arg) {
  const sink = makeSink();
  if (arg === 'success') {
    return compress(okSource(), (x) => x * 2, sink).then((r) => r + (sink.isClosed() ? '-closed' : '-open'));
  }
  if (arg === 'source-error') {
    return compress(errSource(), (x) => x, sink).catch(() => null).then(() => sink.isClosed() ? 'closed' : 'open');
  }
  if (arg === 'transform-error') {
    return compress(okSource(), () => { throw new Error('boom'); }, sink).catch(() => null).then(() => sink.isClosed() ? 'closed' : 'open');
  }
}`,
  },

  // ─── Node.js: Optimization ───────────────────────────────────────────────
  {
    id: 'bh-16',
    title: 'Глобальный кеш без ограничений',
    topic: 'node-optimization',
    topicLabel: 'Оптимизация',
    difficulty: 'medium',
    language: 'javascript',
    code: `function makeUserCache(maxSize) {
  const cache = new Map();
  return {
    get(id) { return cache.get(id); },
    set(id, user) { cache.set(id, user); },
    size() { return cache.size; },
  };
}`,
    bugs: [
      {
        description: 'Map растёт неограниченно — `maxSize` не используется, при большом числе уникальных ID heap заполнится',
        fix: 'Реализовать LRU: при превышении `maxSize` удалять самый старый ключ (`cache.keys().next().value`)',
        explanation:
          'Неограниченный глобальный кеш — классическая утечка памяти в Node.js серверах. При достаточно долгой работе или большом количестве уникальных ключей memory usage растёт до OOM. Решение: LRU с capacity, или кеш с TTL, или Redis для распределённого кеша с автоматическим expiration.',
      },
    ],
    functionName: 'bh16_test',
    testCases: [
      {
        id: 'bh-16-t1',
        inputDisplay: 'maxSize=3, добавили 5 → size === 3',
        inputArgs: [3, 5],
        expected: 3,
      },
      {
        id: 'bh-16-t2',
        inputDisplay: 'maxSize=2, добавили 10 → size === 2',
        inputArgs: [2, 10],
        expected: 2,
      },
      {
        id: 'bh-16-t3',
        inputDisplay: 'maxSize=5, добавили 3 → size === 3',
        inputArgs: [5, 3],
        expected: 3,
      },
    ],
    solutionCode: `function makeUserCache(maxSize) {
  const cache = new Map();
  return {
    get(id) { return cache.get(id); },
    set(id, user) {
      if (cache.has(id)) cache.delete(id);
      cache.set(id, user);
      while (cache.size > maxSize) {
        const oldest = cache.keys().next().value;
        cache.delete(oldest);
      }
    },
    size() { return cache.size; },
  };
}`,
    testHelperCode: `function bh16_test(maxSize, n) {
  const c = makeUserCache(maxSize);
  for (let i = 0; i < n; i++) c.set('user-' + i, { id: i });
  return c.size();
}`,
  },
  {
    id: 'bh-17',
    title: 'N+1 запросов к базе',
    topic: 'node-optimization',
    topicLabel: 'Оптимизация',
    difficulty: 'medium',
    language: 'javascript',
    code: `async function getPostsWithAuthors(db, postIds) {
  const posts = await db.findPosts(postIds);
  for (const post of posts) {
    post.author = await db.findUser(post.authorId);
  }
  return posts;
}`,
    bugs: [
      {
        description: 'N+1 проблема: один запрос на список постов + N запросов на каждого автора — линейная зависимость от количества постов',
        fix: 'Загрузить всех авторов одним запросом `db.findUsers(authorIds)` и распределить в памяти',
        explanation:
          'N+1 — одна из самых распространённых проблем производительности БД. При 100 постах делается 101 запрос. Решение 1: загрузить все уникальные authorId, один SELECT WHERE id IN (...), соединить в памяти. Решение 2: JOIN в SQL. Решение 3 (GraphQL): DataLoader батчирует запросы за один тик event loop.',
      },
    ],
    functionName: 'bh17_test',
    testCases: [
      {
        id: 'bh-17-t1',
        inputDisplay: '5 постов → 2 запроса к БД (1 posts + 1 users)',
        inputArgs: ['query-count-5'],
        expected: 2,
      },
      {
        id: 'bh-17-t2',
        inputDisplay: '10 постов → 2 запроса к БД',
        inputArgs: ['query-count-10'],
        expected: 2,
      },
      {
        id: 'bh-17-t3',
        inputDisplay: '3 поста → у каждого корректный автор',
        inputArgs: ['authors-correct-3'],
        expected: ['Bob', 'Alice', 'Bob'],
      },
    ],
    solutionCode: `async function getPostsWithAuthors(db, postIds) {
  const posts = await db.findPosts(postIds);
  const authorIds = [...new Set(posts.map((p) => p.authorId))];
  const users = await db.findUsers(authorIds);
  const byId = new Map(users.map((u) => [u.id, u]));
  for (const post of posts) {
    post.author = byId.get(post.authorId);
  }
  return posts;
}`,
    testHelperCode: `function makeDb() {
  let queries = 0;
  const users = {
    1: { id: 1, name: 'Alice' },
    2: { id: 2, name: 'Bob' },
  };
  return {
    findPosts(ids) {
      queries++;
      return Promise.resolve(ids.map((id) => ({ id, authorId: (id % 2) + 1 })));
    },
    findUser(id) {
      queries++;
      return Promise.resolve(users[id]);
    },
    findUsers(ids) {
      queries++;
      return Promise.resolve(ids.map((id) => users[id]));
    },
    getQueryCount: () => queries,
  };
}
function bh17_test(arg) {
  const db = makeDb();
  if (arg === 'query-count-5') {
    return getPostsWithAuthors(db, [1, 2, 3, 4, 5]).then(() => db.getQueryCount());
  }
  if (arg === 'query-count-10') {
    return getPostsWithAuthors(db, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).then(() => db.getQueryCount());
  }
  if (arg === 'authors-correct-3') {
    return getPostsWithAuthors(db, [1, 2, 3]).then((posts) => posts.map((p) => p.author.name));
  }
}`,
  },

  // ─── Node.js: Network ────────────────────────────────────────────────────
  {
    id: 'bh-18',
    title: 'Отсутствие rate limiting',
    topic: 'node-network',
    topicLabel: 'Сеть / HTTP',
    difficulty: 'medium',
    language: 'javascript',
    code: `function makeLoginHandler(verify) {
  return async function login(ip, email, password) {
    const ok = await verify(email, password);
    return ok ? { status: 200 } : { status: 401 };
  };
}`,
    bugs: [
      {
        description: 'Без rate limiting endpoint уязвим к brute-force атакам — атакующий может перебирать пароли с любой скоростью',
        fix: 'Считать неудачные попытки по IP и блокировать после N (например, 5)',
        explanation:
          'bcrypt.compare намеренно медленный (~100ms), но без rate limiting атакующий всё равно может делать 600+ попыток в минуту с нескольких IP. Защита: rate limiting по IP (express-rate-limit), экспоненциальный backoff после неудач, lockout аккаунта на X минут, CAPTCHA.',
      },
    ],
    functionName: 'bh18_test',
    testCases: [
      {
        id: 'bh-18-t1',
        inputDisplay: 'успешный логин — 200',
        inputArgs: ['success'],
        expected: 200,
      },
      {
        id: 'bh-18-t2',
        inputDisplay: 'после 5 неудач — статус 429 (rate limited)',
        inputArgs: ['lockout-after-5'],
        expected: 429,
      },
      {
        id: 'bh-18-t3',
        inputDisplay: 'разные IP не делят счётчик неудач',
        inputArgs: ['ip-isolation'],
        expected: 401,
      },
    ],
    solutionCode: `function makeLoginHandler(verify) {
  const failures = new Map();
  const LIMIT = 5;
  return async function login(ip, email, password) {
    if ((failures.get(ip) ?? 0) >= LIMIT) return { status: 429 };
    const ok = await verify(email, password);
    if (!ok) {
      failures.set(ip, (failures.get(ip) ?? 0) + 1);
      return { status: 401 };
    }
    failures.delete(ip);
    return { status: 200 };
  };
}`,
    testHelperCode: `async function bh18_test(arg) {
  const verify = (email, pw) => Promise.resolve(pw === 'correct');
  const handler = makeLoginHandler(verify);
  if (arg === 'success') {
    const r = await handler('1.1.1.1', 'a', 'correct');
    return r.status;
  }
  if (arg === 'lockout-after-5') {
    for (let i = 0; i < 5; i++) await handler('2.2.2.2', 'a', 'wrong');
    const r = await handler('2.2.2.2', 'a', 'wrong');
    return r.status;
  }
  if (arg === 'ip-isolation') {
    for (let i = 0; i < 5; i++) await handler('3.3.3.3', 'a', 'wrong');
    const r = await handler('4.4.4.4', 'a', 'wrong');
    return r.status;
  }
}`,
  },
  {
    id: 'bh-19',
    title: 'Credentials в CORS wildcard',
    topic: 'node-network',
    topicLabel: 'Сеть / HTTP',
    difficulty: 'medium',
    language: 'javascript',
    code: `function applyCors(req, res, allowedOrigins) {
  res.headers['Access-Control-Allow-Origin'] = '*';
  res.headers['Access-Control-Allow-Credentials'] = 'true';
  return res;
}`,
    bugs: [
      {
        description: '`Access-Control-Allow-Origin: *` несовместимо с `Access-Control-Allow-Credentials: true` — браузер отклонит ответ',
        fix: 'Указать конкретный origin из whitelist: `res.headers["Access-Control-Allow-Origin"] = req.headers.origin`',
        explanation:
          'Спецификация CORS запрещает wildcard origin при использовании credentials (cookies, HTTP auth, TLS сертификаты). Браузер выбросит ошибку. Решение: динамически устанавливать конкретный origin из whitelist. Это преднамеренная мера безопасности — credentials не должны отправляться на любой сайт.',
      },
    ],
    functionName: 'bh19_test',
    testCases: [
      {
        id: 'bh-19-t1',
        inputDisplay: 'origin в whitelist → конкретный origin',
        inputArgs: ['allowed-origin'],
        expected: 'https://app.example.com',
      },
      {
        id: 'bh-19-t2',
        inputDisplay: 'origin вне whitelist → нет ACAO заголовка',
        inputArgs: ['blocked-origin'],
        expected: undefined,
      },
      {
        id: 'bh-19-t3',
        inputDisplay: 'whitelist origin → wildcard не используется',
        inputArgs: ['no-wildcard'],
        expected: false,
      },
    ],
    solutionCode: `function applyCors(req, res, allowedOrigins) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.headers['Access-Control-Allow-Origin'] = origin;
    res.headers['Access-Control-Allow-Credentials'] = 'true';
  }
  return res;
}`,
    testHelperCode: `function bh19_test(arg) {
  const allowed = ['https://app.example.com'];
  if (arg === 'allowed-origin') {
    const req = { headers: { origin: 'https://app.example.com' } };
    const res = { headers: {} };
    applyCors(req, res, allowed);
    return res.headers['Access-Control-Allow-Origin'];
  }
  if (arg === 'blocked-origin') {
    const req = { headers: { origin: 'https://evil.com' } };
    const res = { headers: {} };
    applyCors(req, res, allowed);
    return res.headers['Access-Control-Allow-Origin'];
  }
  if (arg === 'no-wildcard') {
    const req = { headers: { origin: 'https://app.example.com' } };
    const res = { headers: {} };
    applyCors(req, res, allowed);
    return res.headers['Access-Control-Allow-Origin'] === '*';
  }
}`,
  },
  {
    id: 'bh-20',
    title: 'Синхронный JSON.parse без защиты',
    topic: 'js-async',
    topicLabel: 'Async / Промисы',
    difficulty: 'easy',
    language: 'javascript',
    code: `async function processWebhook(body, processPayment) {
  const payload = JSON.parse(body);
  if (payload.event === 'payment') {
    await processPayment(payload.data);
  }
  return { status: 200 };
}`,
    bugs: [
      {
        description: '`JSON.parse` бросает `SyntaxError` при невалидном JSON — необработанное исключение сломает async обработчик',
        fix: 'Обернуть в try/catch и вернуть 400 при невалидном теле',
        explanation:
          'JSON.parse синхронно бросает исключение для любых невалидных входных данных. В async функции необработанный throw приводит к rejected Promise, который без .catch() даёт UnhandledPromiseRejection. Правильно: try/catch с возвратом 400.',
      },
    ],
    functionName: 'bh20_test',
    testCases: [
      {
        id: 'bh-20-t1',
        inputDisplay: 'валидный payload → 200',
        inputArgs: ['valid'],
        expected: 200,
      },
      {
        id: 'bh-20-t2',
        inputDisplay: 'невалидный JSON → 400, не throw',
        inputArgs: ['invalid'],
        expected: 400,
      },
      {
        id: 'bh-20-t3',
        inputDisplay: 'другое событие → 200, payment не вызван',
        inputArgs: ['other-event'],
        expected: 200,
      },
    ],
    solutionCode: `async function processWebhook(body, processPayment) {
  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    return { status: 400 };
  }
  if (payload.event === 'payment') {
    await processPayment(payload.data);
  }
  return { status: 200 };
}`,
    testHelperCode: `async function bh20_test(arg) {
  const pay = async () => {};
  if (arg === 'valid') {
    const r = await processWebhook('{"event":"payment","data":{}}', pay);
    return r.status;
  }
  if (arg === 'invalid') {
    try {
      const r = await processWebhook('{not json', pay);
      return r.status;
    } catch {
      return 'threw';
    }
  }
  if (arg === 'other-event') {
    const r = await processWebhook('{"event":"other"}', pay);
    return r.status;
  }
}`,
  },
];
