// ===== ЗАДАЧА 1: Flat =====
// Напишите функцию flatten(arr), которая принимает многомерный массив
// и возвращает одномерный массив со всеми элементами (рекурсивно).
// Пример:
// flatten([1, [2, [3, 4], 5], 6]) → [1, 2, 3, 4, 5, 6]
// flatten([[1, 2], [3, [4, [5]]]]) → [1, 2, 3, 4, 5]

// function flatten(arr) {
//   // ваш код
// }

// ===== ЗАДАЧА 2: Debounce =====
// Напишите функцию debounce(fn, delay), которая возвращает новую функцию,
// откладывающую вызов fn на delay мс. Если за это время функция вызвана снова,
// таймер сбрасывается.
// Пример:
// const log = debounce(console.log, 300);
// log("a"); log("b"); log("c"); // через 300мс выведет только "c"

// function debounce(fn, delay) {
//   // ваш код
// }

// ===== ЗАДАЧА 3: Throttle =====
// Напишите функцию throttle(fn, delay), которая гарантирует, что fn
// вызывается не чаще одного раза в delay мс.
// Пример:
// const log = throttle(console.log, 1000);
// log("a"); log("b"); log("c"); // сразу выведет "a", остальные проигнорирует

// function throttle(fn, delay) {
//   // ваш код
// }

// ===== ЗАДАЧА 4: deepEqual =====
// Напишите функцию deepEqual(a, b), которая глубоко сравнивает два значения.
// Должна работать с примитивами, объектами и массивами (вложенными).
// Пример:
// deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }) → true
// deepEqual([1, [2, 3]], [1, [2, 4]]) → false
// deepEqual(1, 1) → true

// function deepEqual(a, b) {
//   // ваш код
// }

// ===== ЗАДАЧА 5: myBind =====
// Реализуйте свою версию Function.prototype.bind.
// Пример:
// function greet(greeting) { return `${greeting}, ${this.name}!`; }
// const bound = greet.myBind({ name: "Alice" });
// bound("Hello") → "Hello, Alice!"
// const partial = greet.myBind({ name: "Bob" }, "Hi");
// partial() → "Hi, Bob!"

// Function.prototype.myBind = function(context, ...args) {
//   // ваш код
// }

// ===== ЗАДАЧА 6: Промисы — promiseAll =====
// Напишите функцию promiseAll(promises), которая работает как Promise.all:
// принимает массив промисов, возвращает промис с массивом результатов.
// При ошибке любого — реджектится с этой ошибкой.
// Пример:
// promiseAll([Promise.resolve(1), Promise.resolve(2)]) → Promise([1, 2])
// promiseAll([Promise.resolve(1), Promise.reject("err")]) → Promise.reject("err")

// function promiseAll(promises) {
//   // ваш код
// }

// ===== ЗАДАЧА 7: Каррирование =====
// Напишите функцию curry(fn), которая каррирует переданную функцию.
// Пример:
// function sum(a, b, c) { return a + b + c; }
// const curried = curry(sum);
// curried(1)(2)(3) → 6
// curried(1, 2)(3) → 6
// curried(1)(2, 3) → 6

// function curry(fn) {
//   // ваш код
// }

// ===== ЗАДАЧА 8: EventEmitter =====
// Реализуйте класс EventEmitter с методами:
// - on(event, fn) — подписка на событие
// - off(event, fn) — отписка
// - emit(event, ...args) — вызвать все обработчики события
// - once(event, fn) — подписка, которая срабатывает один раз
// Пример:
// const emitter = new EventEmitter();
// emitter.on("data", (x) => console.log(x));
// emitter.emit("data", 42); // выведет 42

// class EventEmitter {
//   // ваш код
// }

// ===== ЗАДАЧА 9: deepClone =====
// Напишите функцию deepClone(obj), которая создаёт глубокую копию объекта.
// Должна корректно копировать: объекты, массивы, Date, null.
// Пример:
// const original = { a: 1, b: { c: [1, 2] }, d: new Date() };
// const copy = deepClone(original);
// copy.b.c.push(3);
// original.b.c → [1, 2] (не изменился)

// function deepClone(obj) {
//   // ваш код
// }

// ===== ЗАДАЧА 10: Кэширование — memoize =====
// Напишите функцию memoize(fn), которая кэширует результаты вызовов fn.
// При повторном вызове с теми же аргументами — возвращает из кэша.
// Пример:
// const add = memoize((a, b) => a + b);
// add(1, 2) → 3 (вычислено)
// add(1, 2) → 3 (из кэша)

// function memoize(fn) {
//   // ваш код
// }

// ===== ЗАДАЧА 11: Последовательное выполнение промисов =====
// Напишите функцию sequential(tasks), которая принимает массив функций,
// каждая из которых возвращает промис. Выполняет их последовательно,
// возвращает промис с массивом результатов.
// Пример:
// sequential([
//   () => Promise.resolve(1),
//   () => Promise.resolve(2),
//   () => Promise.resolve(3),
// ]) → Promise([1, 2, 3])

// function sequential(tasks) {
//   // ваш код
// }

// ===== ЗАДАЧА 12: get по пути =====
// Напишите функцию get(obj, path, defaultValue), которая получает значение
// из объекта по строковому пути (через точку). Аналог lodash _.get.
// Пример:
// get({ a: { b: { c: 42 } } }, "a.b.c") → 42
// get({ a: { b: 1 } }, "a.c.d", "default") → "default"
// get({ a: [1, 2, 3] }, "a.1") → 2

// function get(obj, path, defaultValue) {
//   // ваш код
// }

// ===== ЗАДАЧА 13: Композиция функций =====
// Напишите функцию compose(...fns), которая возвращает композицию функций.
// Функции применяются справа налево.
// Пример:
// const add1 = x => x + 1;
// const mul2 = x => x * 2;
// const sub3 = x => x - 3;
// compose(sub3, mul2, add1)(4) → 7  // sub3(mul2(add1(4))) = (4+1)*2-3 = 7

// function compose(...fns) {
//   // ваш код
// }

// ===== ЗАДАЧА 14: Retry =====
// Напишите функцию retry(fn, retries, delay), которая вызывает async-функцию fn.
// Если она упала — повторяет до retries раз с задержкой delay мс.
// Пример:
// let attempts = 0;
// const unstable = async () => { if (++attempts < 3) throw "fail"; return "ok"; };
// await retry(unstable, 5, 100) → "ok" (на 3-й попытке)

// async function retry(fn, retries, delay) {
//   // ваш код
// }

// ===== ЗАДАЧА 15: Плоский объект → вложенный =====
// Напишите функцию unflatten(obj), которая превращает плоский объект
// с ключами через точку во вложенный.
// Пример:
// unflatten({ "a.b.c": 1, "a.b.d": 2, "e": 3 })
// → { a: { b: { c: 1, d: 2 } }, e: 3 }

// function unflatten(obj) {
//   // ваш код
// }

// ===== ЗАДАЧА 16: Светофор на промисах =====
// Напишите async-функцию trafficLight(), которая бесконечно циклически
// выводит в консоль цвета светофора с задержками:
// "green" (3 сек) → "yellow" (1 сек) → "red" (2 сек) → "green" ...
// Подсказка: используйте вспомогательную функцию sleep(ms).

// async function trafficLight() {
//   // ваш код
// }

// ===== ЗАДАЧА 17: Array.prototype.myReduce =====
// Реализуйте свою версию Array.prototype.reduce.
// Пример:
// [1, 2, 3].myReduce((acc, val) => acc + val, 0) → 6
// [1, 2, 3].myReduce((acc, val) => acc + val) → 6 (без начального значения)

// Array.prototype.myReduce = function(callback, initialValue) {
//   // ваш код
// }

// ===== ЗАДАЧА 18: Пересечение интервалов =====
// Напишите функцию mergeIntervals(intervals), которая сливает
// пересекающиеся интервалы.
// Пример:
// mergeIntervals([[1,3],[2,6],[8,10],[15,18]]) → [[1,6],[8,10],[15,18]]
// mergeIntervals([[1,4],[4,5]]) → [[1,5]]

// function mergeIntervals(intervals) {
//   // ваш код
// }
