// =====================================================
// Event loop, замыкания, промисы — подготовка к Avito
// =====================================================
// Запуск: node async.js

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

// ===== ЗАДАЧА 1: Event Loop — предскажите вывод =====
// Напишите, в каком порядке выведутся сообщения, и объясните почему.
// Укажите, что является микрозадачей, а что макрозадачей.

// console.log("1");
//
// setTimeout(() => {
//   console.log("2");
//   Promise.resolve().then(() => console.log("3"));
// }, 0);
//
// Promise.resolve().then(() => {
//   console.log("4");
//   setTimeout(() => console.log("5"), 0);
// });
//
// setTimeout(() => console.log("6"), 0);
//
// Promise.resolve().then(() => console.log("7"));
//
// console.log("8");

// Ответ: ???
// Объяснение: ???
//
// --- Тест задача 1 ---
// Раскомментируйте код выше и запустите. Правильный порядок: 1, 8, 4, 7, 2, 3, 6, 5


// ===== ЗАДАЧА 2: Замыкания — классическая ловушка =====
// Что выведет этот код? Как исправить, чтобы вывелось 0, 1, 2, 3, 4?
// Предложите минимум 2 способа исправления.

// for (var i = 0; i < 5; i++) {
//   setTimeout(() => console.log(i), i * 100);
// }

// Ответ (что выведет): ???
// Способ 1: ???
// Способ 2: ???
// Способ 3 (если найдёте): ???
//
// --- Тест задача 2 ---
// Раскомментируйте ваш вариант исправления. Ожидаемый вывод: 0, 1, 2, 3, 4


// ===== ЗАДАЧА 3: Реализуйте Promise.allSettled =====
// Напишите функцию promiseAllSettled, которая принимает массив промисов
// и возвращает промис, который резолвится массивом результатов,
// когда ВСЕ промисы завершились (resolved или rejected).
// Каждый результат — объект { status: 'fulfilled', value } или { status: 'rejected', reason }.
// Нельзя использовать Promise.allSettled.
//
// Пример:
// promiseAllSettled([
//   Promise.resolve(1),
//   Promise.reject("err"),
//   Promise.resolve(3)
// ]).then(console.log)
// → [
//     { status: "fulfilled", value: 1 },
//     { status: "rejected", reason: "err" },
//     { status: "fulfilled", value: 3 }
//   ]

// function promiseAllSettled(promises) {
//   // ваш код
// }

// --- Тесты задача 3 ---
// (async () => {
//   const result1 = await promiseAllSettled([
//     Promise.resolve(1),
//     Promise.reject("err"),
//     Promise.resolve(3)
//   ]);
//   assertDeepEqual(result1, [
//     { status: "fulfilled", value: 1 },
//     { status: "rejected", reason: "err" },
//     { status: "fulfilled", value: 3 }
//   ], "promiseAllSettled: mix resolve/reject");
//
//   const result2 = await promiseAllSettled([
//     Promise.resolve("a"),
//     Promise.resolve("b")
//   ]);
//   assertDeepEqual(result2, [
//     { status: "fulfilled", value: "a" },
//     { status: "fulfilled", value: "b" }
//   ], "promiseAllSettled: все fulfilled");
//
//   const result3 = await promiseAllSettled([
//     Promise.reject(1),
//     Promise.reject(2)
//   ]);
//   assertDeepEqual(result3, [
//     { status: "rejected", reason: 1 },
//     { status: "rejected", reason: 2 }
//   ], "promiseAllSettled: все rejected");
//
//   const result4 = await promiseAllSettled([]);
//   assertDeepEqual(result4, [], "promiseAllSettled: пустой массив");
// })();


// ===== ЗАДАЧА 4: Напишите функцию retry =====
// Напишите функцию retry, которая:
// - принимает асинхронную функцию fn, количество попыток maxRetries и задержку delay
// - при ошибке повторяет вызов до maxRetries раз с задержкой delay между попытками
// - задержка увеличивается экспоненциально: delay, delay*2, delay*4, ...
// - если все попытки провалились — выбрасывает последнюю ошибку
//
// Пример:
// const fetchData = () => fetch("/api/data").then(r => r.json());
// const result = await retry(fetchData, 3, 1000);
// // попытка 1 → ошибка → ждём 1с
// // попытка 2 → ошибка → ждём 2с
// // попытка 3 → ошибка → throw последняя ошибка

// function retry(fn, maxRetries, delay) {
//   // ваш код
// }

// --- Тесты задача 4 ---
// (async () => {
//   let attempts = 0;
//   const failTwice = () => {
//     attempts++;
//     if (attempts <= 2) return Promise.reject("fail #" + attempts);
//     return Promise.resolve("success");
//   };
//
//   attempts = 0;
//   const result1 = await retry(failTwice, 3, 100);
//   assert(result1 === "success", "retry: успех на 3-й попытке");
//   assert(attempts === 3, "retry: 3 попытки");
//
//   attempts = 0;
//   try {
//     await retry(failTwice, 1, 100);
//     assert(false, "retry: должен был выбросить ошибку");
//   } catch (e) {
//     assert(e === "fail #1", "retry: выбрасывает последнюю ошибку");
//   }
//
//   const alwaysOk = () => Promise.resolve(42);
//   const result2 = await retry(alwaysOk, 3, 100);
//   assert(result2 === 42, "retry: успех с первой попытки");
// })();
