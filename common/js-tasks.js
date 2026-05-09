// =====================================================
// 10 популярных JS задач на собеседование React Frontend
// =====================================================
// Запуск: node js-tasks.js

function assert(condition, message) {
  if (!condition) {
    console.error("❌ " + message);
  } else {
    console.log("✅ " + message);
  }
}

function assertDeepEqual(a, b, message) {
  assert(
    JSON.stringify(a) === JSON.stringify(b),
    message +
      " | got: " +
      JSON.stringify(a) +
      ", expected: " +
      JSON.stringify(b),
  );
}

// Запускает блок тестов — если функция не реализована, не крашит остальные задачи
function task(name, fn) {
  try {
    fn();
  } catch (e) {
    console.error(`❌ ${name}: упал с ошибкой — ${e.message}`);
  }
}

// =====================================================
// ЗАДАЧА 1: Debounce
// =====================================================
// Реализуйте функцию debounce(fn, delay).
// Возвращаемая функция вызывает fn не раньше, чем через delay мс
// после последнего вызова. Предыдущий таймер сбрасывается.
//
// Зачем нужен: поиск по вводу, автосохранение, resize-обработчики.
//
// Пример:
//   const log = debounce((x) => console.log(x), 300);
//   log(1); log(2); log(3);  // → через 300мс выведет только 3
//
// Усложнение: добавьте метод .cancel() для отмены pending вызова.

function debounce(fn, delay) {
  let timer = null;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args); // было fn(args) — передавало массив вместо spread
    }, delay);
  };
}

// --- Тесты задача 1 ---
task("debounce", () => {
  // Подменяем setTimeout/clearTimeout на синхронные fake timers
  let pending = null;
  const origSet = global.setTimeout;
  const origClear = global.clearTimeout;
  global.setTimeout = (fn) => {
    pending = fn;
    return 1;
  };
  global.clearTimeout = () => {
    pending = null;
  };

  let calls = [];
  const fn = debounce((x) => calls.push(x), 100);

  fn(1);
  fn(2);
  fn(3);
  assert(calls.length === 0, "debounce: fn не вызвана до срабатывания таймера");

  pending?.(); // симулируем истечение таймера
  assertDeepEqual(
    calls,
    [3],
    "debounce: вызвана только с последним аргументом",
  );

  fn("a");
  fn("b");
  pending?.();
  assertDeepEqual(
    calls,
    [3, "b"],
    "debounce: второй цикл — только последний вызов",
  );

  global.setTimeout = origSet;
  global.clearTimeout = origClear;
});

// =====================================================
// ЗАДАЧА 2: Throttle
// =====================================================
// Реализуйте функцию throttle(fn, interval).
// fn вызывается не чаще одного раза за interval мс.
// Первый вызов должен выполниться немедленно.
//
// Зачем нужен: scroll-обработчики, mousemove, WebSocket.
//
// Пример:
//   const log = throttle((x) => console.log(x), 300);
//   log(1); // → выводит 1 сразу
//   log(2); // → игнорируется (< 300мс)

function throttle(fn, interval) {
  let timer = 0;

  return function (...args) {
    const now = new Date();
    if (now - timer > interval) {
      fn(...args);
      timer = now;
    }
  };
}

// --- Тесты задача 2 ---
task("throttle", () => {
  let throttleCount = 0;
  const throttled = throttle(() => throttleCount++, 100);
  throttled();
  throttled();
  throttled();
  assert(
    throttleCount === 1,
    "throttle: первый вызов выполнился, остальные проигнорированы",
  );
});

// =====================================================
// ЗАДАЧА 3: Глубокое клонирование объекта
// =====================================================
// Реализуйте deepClone(value) без использования JSON.
// Должна корректно работать с: объектами, массивами,
// примитивами, Date, вложенными структурами.
//
// Усложнение: обработайте циклические ссылки через WeakMap.
//
// Пример:
//   const a = { x: 1, arr: [2, { y: 3 }] };
//   const b = deepClone(a);
//   b.arr[1].y = 99;
//   a.arr[1].y === 3  // → true (независимые копии)

function deepClone(value) {
  if (value === null || typeof value !== "object") return value;
  if (value instanceof Date) return new Date(value);
  if (Array.isArray(value)) return value.map((item) => deepClone(item));

  const clone = {};
  for (const key of Object.keys(value)) {
    clone[key] = deepClone(value[key]);
  }
  return clone;
}

// --- Тесты задача 3 ---
task("deepClone", () => {
  const orig = { a: 1, b: [2, { c: 3 }] };
  const copy = deepClone(orig);
  copy.b[1].c = 99;
  assert(orig.b[1].c === 3, "deepClone: не изменяет оригинал");
  assertDeepEqual(
    copy,
    { a: 1, b: [2, { c: 99 }] },
    "deepClone: корректная копия",
  );
  const d = new Date("2024-01-01");
  const dc = deepClone(d);
  assert(dc instanceof Date && dc.getTime() === d.getTime(), "deepClone: Date");
});

// =====================================================
// ЗАДАЧА 4: Мемоизация (memoize)
// =====================================================
// Реализуйте функцию memoize(fn).
// При повторном вызове с теми же аргументами возвращает
// кэшированный результат, не вызывая fn снова.
//
// Вопрос на собесе: как формируете ключ кэша для нескольких аргументов?
//
// Пример:
//   let calls = 0;
//   const fn = memoize((n) => { calls++; return n * 2; });
//   fn(5); fn(5); // calls === 1

function memoize(fn) {
  // ваш код
}

// --- Тесты задача 4 ---
task("memoize", () => {
  let callCount = 0;
  const memoAdd = memoize((a, b) => {
    callCount++;
    return a + b;
  });
  assert(memoAdd(2, 3) === 5, "memoize: первый вызов");
  assert(memoAdd(2, 3) === 5, "memoize: кэш");
  assert(callCount === 1, "memoize: fn вызвана только 1 раз");
  assert(memoAdd(2, 4) === 6, "memoize: разные аргументы");
  assert(callCount === 2, "memoize: fn вызвана 2 раза для разных аргументов");
});

// =====================================================
// ЗАДАЧА 5: Каррирование (curry)
// =====================================================
// Реализуйте функцию curry(fn).
// Возвращает каррированную версию fn: можно передавать
// аргументы по одному или группами.
//
// Вопрос на собесе: в чём отличие curry от partial application?
//
// Пример:
//   const add = curry((a, b, c) => a + b + c);
//   add(1)(2)(3)    → 6
//   add(1, 2)(3)    → 6
//   add(1)(2, 3)    → 6
//   add(1, 2, 3)    → 6

function curry(fn) {
  // ваш код
}

// --- Тесты задача 5 ---
task("curry", () => {
  const add = curry((a, b, c) => a + b + c);
  assert(add(1)(2)(3) === 6, "curry: по одному");
  assert(add(1, 2)(3) === 6, "curry: 2+1");
  assert(add(1)(2, 3) === 6, "curry: 1+2");
  assert(add(1, 2, 3) === 6, "curry: все сразу");
  const addTo10 = add(10);
  assert(addTo10(5)(1) === 16, "curry: частичное применение");
});

// =====================================================
// ЗАДАЧА 6: EventEmitter (паттерн Publish/Subscribe)
// =====================================================
// Реализуйте класс EventEmitter с методами:
//   on(event, listener)   — подписаться
//   off(event, listener)  — отписаться
//   emit(event, ...args)  — вызвать всех подписчиков
//   once(event, listener) — подписаться один раз
//
// Зачем нужен: паттерн Observer, Redux, mitt, Node.js EventEmitter.

class EventEmitter {
  // ваш код
}

// --- Тесты задача 6 ---
task("EventEmitter", () => {
  const ee = new EventEmitter();
  let log = [];
  const handler = (x) => log.push(x);
  ee.on("test", handler);
  ee.emit("test", 1);
  ee.emit("test", 2);
  assertDeepEqual(log, [1, 2], "EventEmitter: on + emit");
  ee.off("test", handler);
  ee.emit("test", 3);
  assertDeepEqual(log, [1, 2], "EventEmitter: off");
  ee.once("click", (x) => log.push("once:" + x));
  ee.emit("click", "A");
  ee.emit("click", "B");
  assertDeepEqual(log, [1, 2, "once:A"], "EventEmitter: once");
});

// =====================================================
// ЗАДАЧА 7: Flatten — выравнивание вложенного массива
// =====================================================
// Реализуйте flattenDeep(arr) без Array.prototype.flat.
// Возвращает массив без вложенности любой глубины.
//
// Усложнение: flattenDepth(arr, depth) — выравнивание до depth уровней.
// Вопрос на собесе: рекурсия vs итеративный вариант — плюсы и минусы?
//
// Пример:
//   flattenDeep([1, [2, [3, [4]], 5]]) → [1, 2, 3, 4, 5]

function flattenDeep(arr) {
  // ваш код
}

function flattenDepth(arr, depth = 1) {
  // ваш код
}

// --- Тесты задача 7 ---
task("flatten", () => {
  assertDeepEqual(
    flattenDeep([1, [2, [3, [4]], 5]]),
    [1, 2, 3, 4, 5],
    "flattenDeep: вложенный",
  );
  assertDeepEqual(flattenDeep([]), [], "flattenDeep: пустой");
  assertDeepEqual(flattenDeep([1, 2, 3]), [1, 2, 3], "flattenDeep: плоский");
  assertDeepEqual(
    flattenDepth(
      [
        [1, [2]],
        [3, [4]],
      ],
      1,
    ),
    [1, [2], 3, [4]],
    "flattenDepth: depth=1",
  );
  assertDeepEqual(
    flattenDepth(
      [
        [1, [2]],
        [3, [4]],
      ],
      2,
    ),
    [1, 2, 3, 4],
    "flattenDepth: depth=2",
  );
});

// =====================================================
// ЗАДАЧА 8: Группировка массива (groupBy)
// =====================================================
// Реализуйте groupBy(arr, fn).
// Группирует элементы массива по ключу, возвращаемому fn(item).
//
// Вопрос на собесе: как работает Object.groupBy (ES2024)?
//
// Пример:
//   groupBy([6.1, 4.2, 6.3], Math.floor)
//   → { 4: [4.2], 6: [6.1, 6.3] }

function groupBy(arr, fn) {
  // ваш код
}

// --- Тесты задача 8 ---
task("groupBy", () => {
  assertDeepEqual(
    groupBy([6.1, 4.2, 6.3], Math.floor),
    { 4: [4.2], 6: [6.1, 6.3] },
    "groupBy: Math.floor",
  );
  assertDeepEqual(
    groupBy(["one", "two", "three"], (s) => s.length),
    { 3: ["one", "two"], 5: ["three"] },
    "groupBy: длина строки",
  );
  assertDeepEqual(
    groupBy([], (x) => x),
    {},
    "groupBy: пустой массив",
  );
});

// =====================================================
// ЗАДАЧА 9: Реализация Promise.all
// =====================================================
// Реализуйте myPromiseAll(promises).
// Возвращает Promise, который:
//   - resolves с массивом результатов когда все промисы resolved
//   - rejects с первой ошибкой, если хоть один rejected
// Порядок результатов должен совпадать с порядком входных промисов.
//
// Вопрос на собесе: чем отличается от Promise.allSettled?

function myPromiseAll(promises) {
  const results = [];

  return new Promise((res, rej) => {
    promises.forEach((item) => item.then((value) => results.push(value)));
  });
}

// --- Тесты задача 9 ---
task("myPromiseAll", () => {
  myPromiseAll([
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3),
  ]).then((res) =>
    assertDeepEqual(res, [1, 2, 3], "myPromiseAll: все resolve"),
  );
  myPromiseAll([]).then((res) =>
    assertDeepEqual(res, [], "myPromiseAll: пустой массив"),
  );
  myPromiseAll([Promise.resolve(1), Promise.reject("err")]).catch((e) =>
    assert(e === "err", "myPromiseAll: первый reject"),
  );
});

// =====================================================
// ЗАДАЧА 10: Получение значения по пути (get)
// =====================================================
// Реализуйте get(obj, path, defaultValue).
// path — строка вида 'a.b.c' или 'a[0].b'.
// Если значение не найдено — вернуть defaultValue (undefined по умолчанию).
//
// Аналог _.get из lodash — часто встречается на собесах.
//
// Пример:
//   const obj = { a: { b: { c: 42 } }, arr: [{ x: 1 }] };
//   get(obj, 'a.b.c')      → 42
//   get(obj, 'arr[0].x')   → 1
//   get(obj, 'a.b.d', 0)   → 0

function get(obj, path, defaultValue = undefined) {
  // ваш код
}

// --- Тесты задача 10 ---
task("get", () => {
  const obj = { a: { b: { c: 42 } }, arr: [{ x: 1 }, { x: 2 }] };
  assert(get(obj, "a.b.c") === 42, "get: вложенный объект");
  assert(get(obj, "arr[0].x") === 1, "get: массив нотация");
  assert(get(obj, "arr[1].x") === 2, "get: второй элемент массива");
  assert(get(obj, "a.b.d", 0) === 0, "get: defaultValue");
  assert(get(obj, "x.y.z") === undefined, "get: несуществующий путь");
});
