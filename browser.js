// =====================================================
// DOM, сеть, оптимизация, паттерны — подготовка к Avito
// =====================================================
// Задачи 1-2 проверяйте в браузере, задачи 3-4 можно и в node.
// Запуск: node browser.js

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
    message + " | got: " + JSON.stringify(a) + ", expected: " + JSON.stringify(b),
  );
}

// ===== ЗАДАЧА 1: Реализуйте EventEmitter =====
// Напишите класс EventEmitter с методами:
// - on(event, callback) — подписаться на событие
// - off(event, callback) — отписаться от события
// - emit(event, ...args) — вызвать все обработчики события
// - once(event, callback) — подписаться на событие, сработает один раз
//
// Пример:
// const emitter = new EventEmitter();
// const handler = (x) => console.log(x);
// emitter.on("data", handler);
// emitter.emit("data", 42); // выведет 42
// emitter.off("data", handler);
// emitter.emit("data", 42); // ничего не выведет

// class EventEmitter {
//   // ваш код
// }

// --- Тесты задача 1 ---
// {
//   const emitter = new EventEmitter();
//   let result = [];
//
//   const handler1 = (x) => result.push("h1:" + x);
//   const handler2 = (x) => result.push("h2:" + x);
//
//   emitter.on("test", handler1);
//   emitter.on("test", handler2);
//   emitter.emit("test", "a");
//   assertDeepEqual(result, ["h1:a", "h2:a"], "EventEmitter: on + emit");
//
//   result = [];
//   emitter.off("test", handler1);
//   emitter.emit("test", "b");
//   assertDeepEqual(result, ["h2:b"], "EventEmitter: off убирает обработчик");
//
//   result = [];
//   const onceHandler = (x) => result.push("once:" + x);
//   emitter.once("fire", onceHandler);
//   emitter.emit("fire", 1);
//   emitter.emit("fire", 2);
//   assertDeepEqual(result, ["once:1"], "EventEmitter: once срабатывает один раз");
//
//   result = [];
//   emitter.emit("nonexistent", "x");
//   assertDeepEqual(result, [], "EventEmitter: emit несуществующего события");
// }


// ===== ЗАДАЧА 2: DOM — Делегирование событий =====
// У вас есть список <ul> с 10000 элементами <li>.
// Каждый <li> содержит текст и кнопку удаления.
// Напишите код, который:
// 1) Использует ОДНО событие (делегирование) на <ul>
// 2) При клике на кнопку удаляет соответствующий <li>
// 3) При клике на текст <li> — выводит его содержимое в консоль
// Объясните, почему делегирование лучше 10000 обработчиков.
//
// HTML структура:
// <ul id="list">
//   <li>Item 1 <button class="delete">×</button></li>
//   <li>Item 2 <button class="delete">×</button></li>
//   ...
// </ul>

// function setupListDelegation() {
//   // ваш код
// }

// --- Тест задача 2 ---
// Проверяйте в браузере: создайте HTML со структурой выше и вызовите setupListDelegation().


// ===== ЗАДАЧА 3: Сеть — CORS =====
// Ответьте на вопросы и напишите код:
//
// 1) Что такое CORS и зачем он нужен?
//
// 2) Что такое preflight-запрос? Когда он отправляется?
//
// 3) Вы делаете fetch('https://api.example.com/data', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
//    со страницы https://myapp.com.
//    Опишите, какие HTTP-запросы уйдут и какие заголовки будут.
//
// 4) Напишите middleware (pseudo-код), который правильно обрабатывает CORS:
//    - разрешает определённые origins
//    - обрабатывает preflight
//    - устанавливает нужные заголовки

// function corsMiddleware(allowedOrigins) {
//   // return (req, res, next) => { ... }
//   // ваш код
// }

// --- Тест задача 3 ---
// {
//   const middleware = corsMiddleware(["https://myapp.com"]);
//   const req = { method: "OPTIONS", headers: { origin: "https://myapp.com" } };
//   const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, end() { this.ended = true; } };
//   middleware(req, res, () => {});
//   assert(res.headers["Access-Control-Allow-Origin"] === "https://myapp.com", "CORS: preflight origin");
//   assert(res.ended === true, "CORS: preflight завершён");
// }


// ===== ЗАДАЧА 4: Оптимизация — Виртуальный скролл =====
// У вас есть список из 100 000 элементов. Рендерить все в DOM нельзя.
// Напишите функцию virtualScroll, которая:
// 1) Рендерит только видимые элементы (в зависимости от scrollTop)
// 2) Поддерживает фиксированную высоту элемента (itemHeight)
// 3) Корректно обрабатывает скролл
//
// Параметры: контейнер, общее количество элементов, высота элемента,
// функция рендера одного элемента.
//
// Объясните: какие CSS-свойства нужны? Что такое overscan и зачем он?

// function virtualScroll(container, totalItems, itemHeight, renderItem) {
//   // ваш код
// }

// --- Тест задача 4 ---
// Проверяйте в браузере: создайте div-контейнер с фиксированной высотой и вызовите virtualScroll().
