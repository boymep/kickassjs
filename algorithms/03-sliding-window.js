// =====================================================
// Скользящее окно — подготовка к собеседованию
// =====================================================
// Запуск: node algorithms/03-sliding-window.js

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

// =====================================================
// КАК РАБОТАЕТ СКОЛЬЗЯЩЕЕ ОКНО
// =====================================================
//
// Идея: вместо того чтобы заново считать свойство каждого
// подмассива/подстроки с нуля, мы «скользим» окном — добавляем
// новый элемент справа и убираем старый слева.
//
// Два типа окон:
//
// 1. Фиксированное окно (размер k известен заранее):
//    - Набираем первое окно размера k.
//    - Сдвигаем: добавляем arr[right], убираем arr[right - k].
//    - Применение: сумма/среднее подмассива длины k.
//
// 2. Динамическое окно (размер ищем):
//    - Расширяем правой границей (right++).
//    - Когда условие нарушается — сужаем левой (left++).
//    - Применение: минимальный подмассив с суммой ≥ X,
//      длиннейшая подстрока без повторов и т.д.
//
// Шаблон динамического окна:
//   let left = 0;
//   for (let right = 0; right < n; right++) {
//     // добавить arr[right] в окно
//     while (условие нарушено) {
//       // убрать arr[left] из окна
//       left++;
//     }
//     // обновить результат
//   }
//
// Сложность: O(n) по времени (каждый элемент добавляется
// и удаляется максимум один раз), O(1) или O(k) по памяти.
// =====================================================


// ===== ЗАДАЧА 1: Максимальная сумма подмассива длины k (Easy) =====
// Дан массив целых чисел и число k. Найдите максимальную сумму
// среди всех непрерывных подмассивов длины k.
//
// Пример:
// maxSumSubarray([2, 1, 5, 1, 3, 2], 3) → 9   (подмассив [5, 1, 3])
// maxSumSubarray([2, 3, 4, 1, 5], 2) → 7       (подмассив [3, 4])
//
// Оцените сложность по времени и памяти.

// function maxSumSubarray(arr, k) {
//   // ваш код
// }

// --- Тесты задача 1 ---
// assert(maxSumSubarray([2, 1, 5, 1, 3, 2], 3) === 9, "maxSum: [2,1,5,1,3,2] k=3 → 9");
// assert(maxSumSubarray([2, 3, 4, 1, 5], 2) === 7, "maxSum: [2,3,4,1,5] k=2 → 7");
// assert(maxSumSubarray([1, 1, 1, 1, 1], 3) === 3, "maxSum: все единицы k=3 → 3");
// assert(maxSumSubarray([5], 1) === 5, "maxSum: один элемент → 5");
// assert(maxSumSubarray([-1, -2, -3, -4], 2) === -3, "maxSum: отрицательные k=2 → -3");


// ===== ЗАДАЧА 2: Средние значения подмассивов длины k (Easy) =====
// Дан массив чисел и число k. Верните массив средних значений
// для каждого непрерывного подмассива длины k.
//
// Пример:
// avgSubarrays([1, 3, 2, 6, -1, 4, 1, 8, 2], 5) → [2.2, 2.8, 2.4, 3.6, 2.8]
//
// Оцените сложность по времени и памяти.

// function avgSubarrays(arr, k) {
//   // ваш код
// }

// --- Тесты задача 2 ---
// assertDeepEqual(avgSubarrays([1, 3, 2, 6, -1, 4, 1, 8, 2], 5), [2.2, 2.8, 2.4, 3.6, 2.8], "avg: основной пример");
// assertDeepEqual(avgSubarrays([1, 2, 3, 4], 2), [1.5, 2.5, 3.5], "avg: [1,2,3,4] k=2");
// assertDeepEqual(avgSubarrays([10], 1), [10], "avg: один элемент");
// assertDeepEqual(avgSubarrays([4, 4, 4, 4], 4), [4], "avg: все одинаковые");


// ===== ЗАДАЧА 3: Наименьший подмассив с суммой ≥ target (Medium) =====
// Дан массив положительных целых чисел и число target.
// Найдите длину наименьшего непрерывного подмассива,
// сумма которого ≥ target. Если такого подмассива нет — верните 0.
//
// Пример:
// minSubarrayLen(7, [2, 3, 1, 2, 4, 3]) → 2   (подмассив [4, 3])
// minSubarrayLen(4, [1, 4, 4]) → 1              (подмассив [4])
// minSubarrayLen(11, [1, 1, 1, 1]) → 0          (сумма всех < 11)
//
// Подсказка: используйте динамическое окно. Расширяйте правой
// границей, пока сумма < target. Когда сумма ≥ target — сужайте
// левой, обновляя минимальную длину.
//
// Оцените сложность по времени и памяти.

// function minSubarrayLen(target, nums) {
//   // ваш код
// }

// --- Тесты задача 3 ---
// assert(minSubarrayLen(7, [2, 3, 1, 2, 4, 3]) === 2, "minSubLen: target=7 → 2");
// assert(minSubarrayLen(4, [1, 4, 4]) === 1, "minSubLen: target=4 → 1");
// assert(minSubarrayLen(11, [1, 1, 1, 1]) === 0, "minSubLen: невозможно → 0");
// assert(minSubarrayLen(15, [1, 2, 3, 4, 5]) === 5, "minSubLen: весь массив → 5");
// assert(minSubarrayLen(5, [5]) === 1, "minSubLen: один элемент равен target → 1");
// assert(minSubarrayLen(3, [1, 1, 1, 1, 1]) === 3, "minSubLen: target=3 → 3");


// ===== ЗАДАЧА 4: Длиннейшая подстрока без повторов (Medium) =====
// Дана строка s. Найдите длину самой длинной подстроки
// без повторяющихся символов.
//
// Пример:
// lengthOfLongestSubstring("abcabcbb") → 3     ("abc")
// lengthOfLongestSubstring("bbbbb") → 1        ("b")
// lengthOfLongestSubstring("pwwkew") → 3       ("wke")
//
// Подсказка: динамическое окно + Set или Map для отслеживания
// символов в текущем окне.
//
// Оцените сложность по времени и памяти.

// function lengthOfLongestSubstring(s) {
//   // ваш код
// }

// --- Тесты задача 4 ---
// assert(lengthOfLongestSubstring("abcabcbb") === 3, "longest: abcabcbb → 3");
// assert(lengthOfLongestSubstring("bbbbb") === 1, "longest: bbbbb → 1");
// assert(lengthOfLongestSubstring("pwwkew") === 3, "longest: pwwkew → 3");
// assert(lengthOfLongestSubstring("") === 0, "longest: пустая строка → 0");
// assert(lengthOfLongestSubstring("abcdef") === 6, "longest: все уникальные → 6");
// assert(lengthOfLongestSubstring("aab") === 2, "longest: aab → 2");
// assert(lengthOfLongestSubstring("dvdf") === 3, "longest: dvdf → 3");


// ===== ЗАДАЧА 5: Длиннейшая подстрока с не более k уникальными символами (Medium) =====
// Дана строка s и число k. Найдите длину самой длинной подстроки,
// содержащей не более k различных символов.
//
// Пример:
// longestKDistinct("eceba", 2) → 3            ("ece")
// longestKDistinct("aa", 1) → 2               ("aa")
// longestKDistinct("aabbcc", 2) → 4           ("aabb")
//
// Подсказка: динамическое окно + частотная карта (Map).
// Сужайте окно, когда количество уникальных символов > k.
//
// Оцените сложность по времени и памяти.

// function longestKDistinct(s, k) {
//   // ваш код
// }

// --- Тесты задача 5 ---
// assert(longestKDistinct("eceba", 2) === 3, "longestK: eceba k=2 → 3");
// assert(longestKDistinct("aa", 1) === 2, "longestK: aa k=1 → 2");
// assert(longestKDistinct("aabbcc", 2) === 4, "longestK: aabbcc k=2 → 4");
// assert(longestKDistinct("", 2) === 0, "longestK: пустая строка → 0");
// assert(longestKDistinct("a", 0) === 0, "longestK: k=0 → 0");
// assert(longestKDistinct("abcdef", 6) === 6, "longestK: k=6 все уникальные → 6");
// assert(longestKDistinct("aaabbbccc", 2) === 6, "longestK: aaabbbccc k=2 → 6");


// ===== ЗАДАЧА 6: Наименьшее окно, содержащее все символы (Hard) =====
// Даны две строки s и t. Найдите минимальную подстроку s,
// которая содержит все символы строки t (включая дубликаты).
// Если такой подстроки нет — верните пустую строку.
//
// Пример:
// minWindow("ADOBECODEBANC", "ABC") → "BANC"
// minWindow("a", "a") → "a"
// minWindow("a", "aa") → ""
//
// Подсказка: заведите две частотные карты — для t (что нужно)
// и для текущего окна (что имеем). Расширяйте окно вправо,
// пока не соберёте все символы, затем сужайте слева,
// обновляя минимальную длину.
//
// Оцените сложность по времени и памяти.

// function minWindow(s, t) {
//   // ваш код
// }

// --- Тесты задача 6 ---
// assert(minWindow("ADOBECODEBANC", "ABC") === "BANC", "minWindow: ADOBECODEBANC/ABC → BANC");
// assert(minWindow("a", "a") === "a", "minWindow: a/a → a");
// assert(minWindow("a", "aa") === "", "minWindow: a/aa → пусто");
// assert(minWindow("aa", "aa") === "aa", "minWindow: aa/aa → aa");
// assert(minWindow("abc", "d") === "", "minWindow: abc/d → пусто");
// assert(minWindow("cabwefgewcwaefgcf", "cae") === "cwae", "minWindow: сложный случай → cwae");
