// =====================================================
// Скользящее окно — тренировка от простого к сложному
// =====================================================
// Запуск: node window.js
//
// Принцип: два указателя (left, right) образуют "окно" в массиве/строке.
// right всегда двигается вправо. left тоже двигается только вправо.
// Это гарантирует O(n) — каждый элемент посещается максимум дважды.

function assert(condition, message) {
  if (!condition) {
    console.error("❌ " + message);
  } else {
    console.log("✅ " + message);
  }
}

// ===== ЗАДАЧА 1: Среднее значение подмассива длины k (фиксированное окно) =====
// Дан массив чисел и число k. Верните массив средних значений
// всех подмассивов длины k.
//
// Пример:
// avgOfK([1, 3, 2, 6, -1, 4, 1, 8, 2], 5)
// → [2.2, 2.8, 2.4, 3.6, 2.8]
//   (1+3+2+6-1)/5=2.2, (3+2+6-1+4)/5=2.8, ...
//
// avgOfK([1, 2, 3], 2) → [1.5, 2.5]
//
// Подсказка: точно такой же паттерн как maxSumK — посчитай сумму первых k,
// потом двигай окно: прибавляй правый, вычитай левый, дели на k.

function avgOfK(arr, k) {
  // ваш код
}

// --- Тесты задача 1 ---
assert(
  JSON.stringify(avgOfK([1, 3, 2, 6, -1, 4, 1, 8, 2], 5)) === JSON.stringify([2.2, 2.8, 2.4, 3.6, 2.8]),
  "avgOfK: [1,3,2,6,-1,4,1,8,2] k=5"
);
assert(
  JSON.stringify(avgOfK([1, 2, 3], 2)) === JSON.stringify([1.5, 2.5]),
  "avgOfK: [1,2,3] k=2"
);
assert(
  JSON.stringify(avgOfK([5, 5, 5, 5], 3)) === JSON.stringify([5, 5]),
  "avgOfK: все одинаковые"
);
assert(
  JSON.stringify(avgOfK([10], 1)) === JSON.stringify([10]),
  "avgOfK: один элемент"
);


// ===== ЗАДАЧА 2: Максимальная сумма подмассива длины k (эталон) =====
// Для справки — решение задачи 4a из avito.js. Изучи если застрял на задаче 1.

// function maxSumK(arr, k) {
//   let sum = 0;
//   for (let i = 0; i < k; i++) {
//     sum += arr[i];
//   }
//   let max = sum;
//
//   for (let right = k; right < arr.length; right++) {
//     sum = sum + arr[right] - arr[right - k];
//     if (sum > max) max = sum;
//   }
//
//   return max;
// }


// ===== ЗАДАЧА 3: Минимальный подмассив с суммой >= target (динамическое окно) =====
// Дан массив положительных чисел и target. Найдите длину минимального
// подмассива, сумма которого >= target. Если такого нет — вернуть 0.
//
// Пример:
// minSubarrayLen([2, 3, 1, 2, 4, 3], 7) → 2  (подмассив [4,3])
// minSubarrayLen([1, 1, 1, 1], 100) → 0       (нет такого)
//
// Подсказка: right расширяет окно (прибавляет к сумме).
// Когда сумма >= target — пробуй сужать left (вычитай и запоминай минимум).

// function minSubarrayLen(arr, target) {
//   // ваш код
// }

// --- Тесты задача 3 ---
// assert(minSubarrayLen([2, 3, 1, 2, 4, 3], 7) === 2, "minSubarrayLen: [2,3,1,2,4,3] → 2");
// assert(minSubarrayLen([1, 4, 4], 4) === 1, "minSubarrayLen: [1,4,4] → 1");
// assert(minSubarrayLen([1, 1, 1, 1], 100) === 0, "minSubarrayLen: нет подмассива → 0");
// assert(minSubarrayLen([1, 2, 3, 4, 5], 11) === 3, "minSubarrayLen: [3,4,5] → 3");


// ===== ЗАДАЧА 4: Максимальная подстрока с не более чем k уникальными символами =====
// Дана строка и число k. Найдите длину самой длинной подстроки,
// содержащей не более k различных символов.
//
// Пример:
// longestWithK("eceba", 2) → 3      ("ece" — 2 уникальных)
// longestWithK("aabbcc", 2) → 4     ("aabb")
//
// Подсказка: используй объект-счётчик (как в анаграммах). right добавляет символ.
// Когда уникальных > k — двигай left, уменьшая счётчики, и удаляй из объекта если 0.

// function longestWithK(str, k) {
//   // ваш код
// }

// --- Тесты задача 4 ---
// assert(longestWithK("eceba", 2) === 3, "longestWithK: eceba k=2 → 3");
// assert(longestWithK("aabbcc", 2) === 4, "longestWithK: aabbcc k=2 → 4");
// assert(longestWithK("aabbcc", 1) === 2, "longestWithK: aabbcc k=1 → 2");
// assert(longestWithK("abcdef", 6) === 6, "longestWithK: все уникальные → 6");


// ===== ЗАДАЧА 5: Максимальная подстрока без повторов =====
// Используй Set: right добавляет. Если символ уже в Set — двигай left,
// удаляя из Set, пока повтор не уйдёт.
//
// Пример:
// longestUnique("abcabcbb") → 3  ("abc")
// longestUnique("bbbbb") → 1     ("b")
// longestUnique("pwwkew") → 3    ("wke")
// longestUnique("") → 0

// function longestUnique(str) {
//   // ваш код
// }

// --- Тесты задача 5 ---
// assert(longestUnique("abcabcbb") === 3, "longestUnique: abcabcbb → 3");
// assert(longestUnique("bbbbb") === 1, "longestUnique: bbbbb → 1");
// assert(longestUnique("pwwkew") === 3, "longestUnique: pwwkew → 3");
// assert(longestUnique("") === 0, "longestUnique: пустая → 0");
// assert(longestUnique("abcdef") === 6, "longestUnique: abcdef → 6");
// assert(longestUnique("aab") === 2, "longestUnique: aab → 2");
// assert(longestUnique("dvdf") === 3, "longestUnique: dvdf → 3");
