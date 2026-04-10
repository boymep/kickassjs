// Реализуйте функцию _promiseAll

// function _promiseAll(arr) {
//   return new Promise((resolve, reject) => {
//     const result = [];
//     let step = 0;

//     for (let i = 0; i < arr.length; i++) {
//       arr[i]
//         .then((res) => {
//           result[i] = res;
//           step++;
//           if (step === arr.length) resolve(result);
//         })
//         .catch((error) => {
//           reject(error);
//         });
//     }
//   });
// }

// const promise1 = Promise.resolve(1);
// const promise2 = Promise.resolve(2);
// const promise3 = Promise.resolve(3);
// const promise4 = new Promise((resolve) => setTimeout(resolve, 100, 4));

// _promiseAll([promise1, promise2, promise3, promise4])
//   .then((results) => {
//     console.log(results); // Output: [1, 2, 3, 4]
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// const promise5 = Promise.reject("Error occurred");

// _promiseAll([promise1, promise2, promise5])
//   .then((results) => {
//     console.log(results);
//   })
//   .catch((error) => {
//     console.error(error); // Output: Error occurred
//   });

// ===== Задача 2 =====
// Реализуйте функцию _promiseRace(arr)
// Возвращает промис, который резолвится или реджектится
// как только ПЕРВЫЙ промис из массива завершится (неважно, успехом или ошибкой).

// function _promiseRace(arr) {
//   return new Promise((resolve, reject) => {
//     for (let i = 0; i < arr.length; i++) {
//       arr[i]
//         .then((res) => {
//           resolve(res);
//         })
//         .catch((error) => reject(error));
//     }
//   });
// }

// Тесты:
// const slow = new Promise((resolve) => setTimeout(resolve, 500, "slow"));
// const fast = new Promise((resolve) => setTimeout(resolve, 100, "fast"));
// const failing = new Promise((_, reject) => setTimeout(reject, 50, "error"));

// _promiseRace([slow, fast]).then(console.log); // "fast"
// _promiseRace([slow, failing]).catch(console.error); // "error"

// ===== Задача 3 =====
// Реализуйте функцию _promiseAllSettled(arr)
// Возвращает промис, который ВСЕГДА резолвится (никогда не реджектится).
// Результат — массив объектов с результатами каждого промиса:
// { status: "fulfilled", value: ... } или { status: "rejected", reason: ... }

// function _promiseAllSettled(arr) {
//   return new Promise((resolve, reject) => {
//     const result = [];
//     let step = 0;
//
//     for (let i = 0; i < arr.length; i++) {
//       arr[i]
//         .then((response) => {
//           result[i] = { status: "fulfilled", value: response };
//         })
//         .catch((error) => {
//           result[i] = { status: "rejected", reason: error };
//         })
//         .finally(() => {
//           step++;
//
//           if (step === arr.length) {
//             resolve(result);
//           }
//         });
//     }
//   });
// }

// Тесты:
// const p1 = Promise.resolve("ok");
// const p2 = Promise.reject("fail");
// const p3 = new Promise((resolve) => setTimeout(resolve, 100, "delayed"));

// _promiseAllSettled([p1, p2, p3]).then(console.log);
// Output: [
//   { status: "fulfilled", value: "ok" },
//   { status: "rejected", reason: "fail" },
//   { status: "fulfilled", value: "delayed" }
// ]

// ===== Задача 4 =====
// Реализуйте функцию _promiseAny(arr)
// Возвращает промис, который резолвится значением ПЕРВОГО успешного промиса.
// Если ВСЕ промисы упали — реджектится с массивом всех ошибок.

// function _promiseAny(arr) {
//   return new Promise((resolve, reject) => {
//     const result = [];
//     let failed = 0;
//
//     for (let i = 0; i < arr.length; i++) {
//       arr[i]
//         .then((res) => {
//           resolve(res);
//         })
//         .catch((err) => {
//           result[i] = err;
//           failed++;
//
//           if (failed === arr.length) {
//             reject(result);
//           }
//         });
//     }
//   });
// }

// Тесты:
// const fail1 = Promise.reject("error1");
// const fail2 = Promise.reject("error2");
// const success = new Promise((resolve) => setTimeout(resolve, 100, "success"));

// _promiseAny([fail1, success, fail2]).then(console.log); // "success"
// _promiseAny([fail1, fail2]).catch(console.error); // ["error1", "error2"]

// ===== Задача 5 =====
// Реализуйте функцию promiseMap(arr, asyncFn, limit)
// Принимает массив данных, асинхронную функцию и лимит одновременных выполнений.
// Выполняет asyncFn для каждого элемента, но не более limit штук параллельно.
// Возвращает массив результатов в том же порядке, что и входной массив.

// function promiseMap(arr, asyncFn, limit) {
//   return new Promise((resolve) => {
//     const result = [];
//     let next = 0;
//     let completed = 0;
//
//     function runNext() {
//       const current = next;
//       next++;
//
//       asyncFn(arr[current]).then((res) => {
//         result[current] = res;
//         completed++;
//
//         if (completed === arr.length) {
//           resolve(result);
//         } else if (next < arr.length) {
//           runNext();
//         }
//       });
//     }
//
//     for (let i = 0; i < Math.min(limit, arr.length); i++) {
//       runNext();
//     }
//   });
// }

// Тесты:
// const mockAsync = (val) =>
//   new Promise((resolve) => setTimeout(() => resolve(val * 2), 100));
//
// promiseMap([1, 2, 3, 4, 5], mockAsync, 2).then(console.log);
// Output: [2, 4, 6, 8, 10]  (но не более 2 задач одновременно)

// ===== Задача 6 =====
// Реализуйте функцию promiseChain(arr)
// Принимает массив асинхронных функций. Каждая функция принимает результат предыдущей.
// Выполняет их ПОСЛЕДОВАТЕЛЬНО (не параллельно), передавая результат по цепочке.
// Первая функция получает undefined.

// function promiseChain(fns) {
//   return fns.reduce((acc, fn) => acc.then(fn), Promise.resolve(undefined));
// }

// Тесты:
// const step1 = () => Promise.resolve(1);
// const step2 = (prev) => Promise.resolve(prev + 10);
// const step3 = (prev) => Promise.resolve(prev * 2);

// promiseChain([step1, step2, step3]).then(console.log); // 22  ((1 + 10) * 2)

// ===== Задача 7 =====
// Реализуйте функцию promiseTimeout(promise, ms)
// Оборачивает промис в таймаут. Если промис не завершился за ms миллисекунд —
// реджектится с ошибкой "Timeout". Если завершился вовремя — возвращает его результат.

// const timeout = (delay) => {
//   return new Promise((resolve) => setTimeout(resolve, delay));
// };

// function promiseTimeout(promise, ms) {
//   return new Promise((resolve, reject) => {
//     timeout(ms).then(() => {
//       reject("Timeout");
//     });
//     promise.then((res) => {
//       resolve(res);
//     });
//   });
// }

// Тесты:
// const fast = new Promise((resolve) => setTimeout(resolve, 50, "done"));
// const slow = new Promise((resolve) => setTimeout(resolve, 500, "done"));

// promiseTimeout(fast, 100).then(console.log); // "done"
// promiseTimeout(slow, 100).catch(console.error); // "Timeout"

// ===== Задача 8 (похожа на 6 — reduce + промисы) =====
// Реализуйте функцию asyncCompose(...fns)
// Принимает набор асинхронных функций и возвращает НОВУЮ функцию.
// Вызов этой функции с аргументом запускает цепочку справа налево (как математическая композиция).
// Каждая функция получает результат предыдущей.

// function asyncCompose(...fns) {
//   return function (count) {
//     return fns.reduceRight((acc, fn) => {
//       return acc.then(fn);
//     }, Promise.resolve(count));
//   };
// }

// Тесты:
// const double = async (x) => x * 2;
// const addTen = async (x) => x + 10;
// const square = async (x) => x * x;

// const composed = asyncCompose(square, addTen, double);
// composed(3).then(console.log); // 256  (3 → double → 6 → addTen → 16 → square → 256)

// ===== Задача 9 (похожа на 5 — лимит параллельности) =====
// Реализуйте функцию downloadQueue(urls, downloadFn, limit)
// Скачивает файлы по URL, но не более limit одновременно.
// Если загрузка одного URL упала — пропускаем его (записываем null), продолжаем остальные.
// Возвращает массив результатов в том же порядке.

// function downloadQueue(urls, downloadFn, limit) {
//   return new Promise((resolve) => {
//     const result = [];
//     let completed = 0;
//     let current = 0;
//
//     const next = () => {
//       const index = current;
//       current++;
//
//       downloadFn(urls[index])
//         .then((res) => {
//           result[index] = res;
//         })
//         .catch(() => {
//           result[index] = null;
//         })
//         .finally(() => {
//           completed++;
//           if (completed === urls.length) resolve(result);
//           if (current < urls.length) next();
//         });
//     };
//
//     for (let i = 0; i < Math.min(limit, urls.length); i++) {
//       next();
//     }
//   });
// }

// Тесты:
// const mockDownload = (url) =>
//   new Promise((resolve, reject) =>
//     setTimeout(() => {
//       if (url === "fail") reject("error");
//       else resolve(`data from ${url}`);
//     }, 100),
//   );
//
// downloadQueue(["a", "fail", "b", "c", "d"], mockDownload, 2).then(console.log);
// Output: ["data from a", null, "data from b", "data from c", "data from d"]
