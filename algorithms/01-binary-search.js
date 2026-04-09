// =====================================================
// Бинарный поиск — подготовка к собеседованию
// =====================================================
// Запуск: node algorithms/01-binary-search.js

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

// =====================================================
// * КАК РАБОТАЕТ БИНАРНЫЙ ПОИСК
// =====================================================
//
// Идея: если пространство поиска упорядочено (или обладает
// монотонным свойством), можно каждый раз отбрасывать половину,
// сравнивая средний элемент с целевым.
//
// * Базовый шаблон:
//   let left = 0, right = arr.length - 1;
//   while (left <= right) {
//     const mid = Math.floor((left + right) / 2);
//     if (arr[mid] === target) return mid;
//     if (arr[mid] < target) left = mid + 1;
//     else right = mid - 1;
//   }
//
// * Два ключевых варианта:
//   1. Точный поиск — ищем конкретное значение.
//   2. Поиск границы — ищем первое/последнее вхождение
//      (не возвращаемся сразу при arr[mid] === target,
//       а продолжаем сужать одну из сторон).
//
// ? Бинарный поиск работает не только на массивах!
// ? Если есть монотонная функция f(x) и нужно найти точку перехода
// ? (например, "минимальное x, при котором f(x) = true"),
// ? можно искать по пространству ответов.
//
// ! Сложность: O(log n) по времени, O(1) по памяти.
// =====================================================

// ===== ЗАДАЧА 1: Классический бинарный поиск (Easy) =====
// Дан отсортированный по возрастанию массив уникальных целых чисел
// и целое число target. Верните индекс target или -1, если его нет.
//
// Пример:
// binarySearch([1, 3, 5, 7, 9, 11], 7) → 3
// binarySearch([1, 3, 5, 7, 9, 11], 4) → -1
//
// Оцените сложность по времени и памяти.

// function binarySearch(nums, target) {
//   let left = 0,
//     right = nums.length - 1;

//   while (left <= right) {
//     const midIndex = Math.floor((left + right) / 2);
//     const midElement = nums[midIndex];

//     if (target === midElement) return midIndex;
//     else if (midElement > target) {
//       right = midIndex - 1;
//     } else {
//       left = midIndex + 1;
//     }
//   }

//   return -1;
// }

// --- Тесты задача 1 ---
// assert(
//   binarySearch([1, 3, 5, 7, 9, 11], 7) === 3,
//   "binarySearch: найден 7 на позиции 3",
// );
// assert(
//   binarySearch([1, 3, 5, 7, 9, 11], 4) === -1,
//   "binarySearch: 4 не найден",
// );
// assert(
//   binarySearch([1, 3, 5, 7, 9, 11], 1) === 0,
//   "binarySearch: первый элемент",
// );
// assert(
//   binarySearch([1, 3, 5, 7, 9, 11], 11) === 5,
//   "binarySearch: последний элемент",
// );
// assert(binarySearch([], 5) === -1, "binarySearch: пустой массив");
// assert(binarySearch([42], 42) === 0, "binarySearch: один элемент — найден");
// assert(binarySearch([42], 10) === -1, "binarySearch: один элемент — не найден");

// ===== ЗАДАЧА 2: Первое и последнее вхождение (Easy-Medium) =====
// Дан отсортированный массив целых чисел (могут быть дубликаты)
// и целое число target. Верните массив [first, last] — индексы
// первого и последнего вхождения target. Если target нет — [-1, -1].
//
// Решение должно работать за O(log n).
//
// Пример:
// searchRange([5, 7, 7, 8, 8, 10], 8) → [3, 4]
// searchRange([5, 7, 7, 8, 8, 10], 6) → [-1, -1]
// searchRange([1], 1) → [0, 0]
//
// Подсказка: запустите бинарный поиск дважды — один раз ищите
// левую границу, другой раз — правую.
//
// Оцените сложность по времени и памяти.

// function searchRange(arr, target) {
//   let left = 0,
//     right = arr.length - 1;
//   const result = [-1, -1];

//   while (left <= right) {
//     const midIndex = Math.floor((left + right) / 2);
//     if (arr[midIndex] === target) {
//       result[0] = midIndex;
//       right = midIndex - 1;
//     } else if (arr[midIndex] < target) {
//       left = midIndex + 1;
//     } else {
//       right = midIndex - 1;
//     }
//   }

//   left = 0;
//   right = arr.length - 1;

//   while (left <= right) {
//     const midIndex = Math.floor((left + right) / 2);
//     if (arr[midIndex] === target) {
//       result[1] = midIndex;
//       left = midIndex + 1;
//     } else if (arr[midIndex] < target) {
//       left = midIndex + 1;
//     } else {
//       right = midIndex - 1;
//     }
//   }

//   return result;
// }

// --- Тесты задача 2 ---
// assertDeepEqual(
//   searchRange([5, 7, 7, 8, 8, 10], 8),
//   [3, 4],
//   "searchRange: 8 в [5,7,7,8,8,10]",
// );
// assertDeepEqual(
//   searchRange([5, 7, 7, 8, 8, 10], 6),
//   [-1, -1],
//   "searchRange: 6 не найден",
// );
// assertDeepEqual(searchRange([1], 1), [0, 0], "searchRange: один элемент");
// assertDeepEqual(searchRange([], 0), [-1, -1], "searchRange: пустой массив");
// assertDeepEqual(
//   searchRange([2, 2, 2, 2, 2], 2),
//   [0, 4],
//   "searchRange: все одинаковые",
// );
// assertDeepEqual(
//   searchRange([1, 2, 3, 4, 5], 3),
//   [2, 2],
//   "searchRange: единственное вхождение",
// );

// ===== ЗАДАЧА 2.5a: Вставка в отсортированный массив (Easy) =====
// Дан отсортированный массив уникальных целых чисел и target.
// Верните индекс target, если он есть. Если нет — верните индекс,
// куда его нужно вставить, чтобы массив остался отсортированным.
//
// Пример:
// searchInsert([1, 3, 5, 6], 5) → 2
// searchInsert([1, 3, 5, 6], 2) → 1
// searchInsert([1, 3, 5, 6], 7) → 4
// searchInsert([1, 3, 5, 6], 0) → 0

// function searchInsert(nums, target) {
//   let left = 0;
//   let right = nums.length - 1;

//   while (left <= right) {
//     const middle = Math.floor((left + right) / 2);
//     if (nums[middle] === target) return middle;
//     if (nums[middle] > target) right = middle - 1;
//     if (nums[middle] < target) left = middle + 1;
//   }

//   return left;
// }

// --- Тесты задача 2.5a ---
// assert(searchInsert([1, 3, 5, 6], 5) === 2, "searchInsert: найден 5");
// assert(searchInsert([1, 3, 5, 6], 2) === 1, "searchInsert: вставить 2");
// assert(searchInsert([1, 3, 5, 6], 7) === 4, "searchInsert: вставить в конец");
// assert(searchInsert([1, 3, 5, 6], 0) === 0, "searchInsert: вставить в начало");
// assert(searchInsert([1], 0) === 0, "searchInsert: один элемент, вставить до");
// assert(
//   searchInsert([1], 2) === 1,
//   "searchInsert: один элемент, вставить после",
// );
// assert(searchInsert([], 5) === 0, "searchInsert: пустой массив");

// ===== ЗАДАЧА 2.5b: Угадай число (Easy) =====
// Загадано число от 1 до n. Дана функция guess(num):
//   -1 → загаданное меньше num
//    1 → загаданное больше num
//    0 → угадал!
// Найдите загаданное число.
//
// Пример:
// n = 10, загадано 6 → guessNumber(10) → 6

// function guessNumber(n, guessFn) {
//   let left = 1;
//   let right = n;
//
//   while (left <= right) {
//     const mid = Math.floor((left + right) / 2);
//     if (guessFn(mid) === 0) return mid;
//     if (guessFn(mid) === -1) right = mid - 1;
//     if (guessFn(mid) === 1) left = mid + 1;
//   }
// }

// --- Тесты задача 2.5b ---
// assert(
//   guessNumber(10, (num) => (num === 6 ? 0 : num > 6 ? -1 : 1)) === 6,
//   "guessNumber: 6 из 10",
// );
// assert(guessNumber(1, (num) => 0) === 1, "guessNumber: единственное число");
// assert(
//   guessNumber(100, (num) => (num === 1 ? 0 : -1)) === 1,
//   "guessNumber: загадано 1",
// );
// assert(
//   guessNumber(100, (num) => (num === 100 ? 0 : 1)) === 100,
//   "guessNumber: загадано 100",
// );

// ===== ЗАДАЧА 2.5c: Плохая версия (Easy) =====
// Вы — менеджер продукта. Версии продукта нумеруются 1..n.
// Начиная с какой-то версии все стали «плохими» (и все после неё тоже).
// Дана функция isBad(version) → true/false.
// Найдите первую плохую версию.
//
// Пример:
// n = 5, первая плохая = 4 → firstBadVersion(5) → 4
// версии: [good, good, good, BAD, BAD]

// function firstBadVersion(n, isBadFn) {
//   let left = 1;
//   let right = n;
//   let badVersion = -1;
//
//   while (left <= right) {
//     const mid = Math.floor((left + right) / 2);
//     if (isBadFn(mid)) {
//       badVersion = mid;
//       right = mid - 1;
//     }
//     if (!isBadFn(mid)) left = mid + 1;
//   }
//
//   return badVersion;
// }

// --- Тесты задача 2.5c ---
// assert(firstBadVersion(5, (v) => v >= 4) === 4, "firstBad: 4 из 5");
// assert(
//   firstBadVersion(1, (v) => true) === 1,
//   "firstBad: единственная версия — плохая",
// );
// assert(firstBadVersion(10, (v) => v >= 1) === 1, "firstBad: все плохие");
// assert(
//   firstBadVersion(10, (v) => v >= 10) === 10,
//   "firstBad: только последняя плохая",
// );
// assert(
//   firstBadVersion(1000000, (v) => v >= 999999) === 999999,
//   "firstBad: большой диапазон",
// );

// ===== ЗАДАЧА 2.5d: Является ли число точным квадратом (Easy) =====
// Дано положительное целое число n. Верните true, если n — точный
// квадрат какого-то целого числа, иначе false.
// Нельзя использовать Math.sqrt, Math.pow или оператор **.
//
// Пример:
// isPerfectSquare(16) → true  (4 * 4 = 16)
// isPerfectSquare(14) → false
// isPerfectSquare(1)  → true

// function isPerfectSquare(n) {
//   let left = 0;
//   let right = n;
//
//   while (left <= right) {
//     const middle = Math.floor((left + right) / 2);
//     if (middle * middle === n) return true;
//     else if (middle * middle < n) left = middle + 1;
//     else right = middle - 1;
//   }
//
//   return false;
// }

// --- Тесты задача 2.5d ---
// assert(isPerfectSquare(16) === true, "isPerfectSquare(16) = true");
// assert(isPerfectSquare(14) === false, "isPerfectSquare(14) = false");
// assert(isPerfectSquare(1) === true, "isPerfectSquare(1) = true");
// assert(isPerfectSquare(25) === true, "isPerfectSquare(25) = true");
// assert(isPerfectSquare(26) === false, "isPerfectSquare(26) = false");
// assert(
//   isPerfectSquare(100000000) === true,
//   "isPerfectSquare(100000000) = true",
// );

// ===== ЗАДАЧА 2.5e: Ближайшее число (Easy) =====
// Дан отсортированный массив уникальных целых чисел и target.
// Верните элемент массива, ближайший к target.
// Если два элемента одинаково близки — верните меньший.
//
// Пример:
// findClosest([1, 3, 5, 8, 12], 6) → 5
// findClosest([1, 3, 5, 8, 12], 3) → 3
// findClosest([1, 3, 5, 8, 12], 0) → 1

// function findClosest(nums, target) {
//   let left = 0;
//   let right = nums.length - 1;
//
//   if (target > nums[right]) return nums[right];
//   if (target < nums[left]) return nums[left];
//
//   while (left <= right) {
//     const middle = Math.floor((left + right) / 2);
//     if (nums[middle] === target) return nums[middle];
//     if (nums[middle] < target) left = middle + 1;
//     else right = middle - 1;
//   }
//
//   if (target - nums[right] <= nums[left] - target) return nums[right];
//   return nums[left];
// }

// --- Тесты задача 2.5e ---
// assert(findClosest([1, 3, 5, 8, 12], 6) === 5, "findClosest: 6 → 5");
// assert(
//   findClosest([1, 3, 5, 8, 12], 3) === 3,
//   "findClosest: точное совпадение",
// );
// assert(findClosest([1, 3, 5, 8, 12], 0) === 1, "findClosest: левее всех");
// assert(findClosest([1, 3, 5, 8, 12], 20) === 12, "findClosest: правее всех");
// assert(
//   findClosest([1, 3, 5, 8, 12], 4) === 3,
//   "findClosest: одинаково близки → меньший",
// );
// assert(findClosest([10], 5) === 10, "findClosest: один элемент");

// ===== ЗАДАЧА 2.5f: Подсчёт отрицательных чисел (Easy) =====
// Дан массив целых чисел, отсортированный по убыванию.
// Верните количество отрицательных чисел.
//
// Пример:
// countNegatives([5, 3, 1, -2, -4]) → 2
// countNegatives([5, 3, 1]) → 0
// countNegatives([-1, -2, -3]) → 3

// function countNegatives(nums) {
//   let left = 0;
//   let right = nums.length - 1;
//
//   if (nums[right] >= 0) return 0;
//   if (nums[left] < 0) return nums.length;
//
//   while (left <= right) {
//     const mid = Math.floor((left + right) / 2);
//     if (nums[mid] < 0) {
//       if (nums[mid - 1] >= 0) return nums.length - mid;
//       else right = mid - 1;
//     } else left = mid + 1;
//   }
// }

// --- Тесты задача 2.5f ---
// assert(countNegatives([5, 3, 1, -2, -4]) === 2, "countNeg: [5,3,1,-2,-4] → 2");
// assert(countNegatives([5, 3, 1]) === 0, "countNeg: нет отрицательных");
// assert(countNegatives([-1, -2, -3]) === 3, "countNeg: все отрицательные");
// assert(countNegatives([0]) === 0, "countNeg: один ноль");
// assert(countNegatives([-1]) === 1, "countNeg: один отрицательный");
// assert(
//   countNegatives([3, 2, 1, 0, -1, -2, -3, -4]) === 4,
//   "countNeg: половина отрицательных",
// );

// ===== ЗАДАЧА 3: Пик в массиве (Medium) =====
// Дан массив целых чисел. Элемент является «пиком», если он
// строго больше своих соседей. Считается, что элементы за
// границами массива равны -∞. Найдите индекс любого пика.
// Гарантируется, что пик существует.
//
// Решение должно работать за O(log n).
//
// Пример:
// findPeakElement([1, 2, 3, 1]) → 2       (элемент 3)
// findPeakElement([1, 2, 1, 3, 5, 6, 4, 3, 2, 1]) → 5 (элемент 6) или 1 (элемент 2)
//
// Подсказка: подумайте, в какую сторону двигаться — туда,
// где сосед больше текущего mid.
//
// Оцените сложность по времени и памяти.

// function findPeakElement(nums) {
//   let left = 0,
//     right = nums.length - 1;
//
//   while (left < right) {
//     const mid = Math.floor((left + right) / 2);
//     if (nums[mid] < nums[mid + 1]) left = mid + 1;
//     else right = mid;
//   }
//
//   return left;
// }

// --- Тесты задача 3 ---
// (для пика проверяем, что элемент действительно больше соседей)
// function isPeak(nums, i) {
//   const left = i > 0 ? nums[i - 1] : -Infinity;
//   const right = i < nums.length - 1 ? nums[i + 1] : -Infinity;
//   return nums[i] > left && nums[i] > right;
// }
// assert(
//   isPeak([1, 2, 3, 1], findPeakElement([1, 2, 3, 1])),
//   "findPeak: [1,2,3,1]",
// );
// assert(
//   isPeak([1, 2, 1, 3, 5, 6, 4], findPeakElement([1, 2, 1, 3, 5, 6, 4])),
//   "findPeak: [1,2,1,3,5,6,4]",
// );
// assert(isPeak([1], findPeakElement([1])), "findPeak: [1] единственный элемент");
// assert(
//   isPeak([3, 2, 1], findPeakElement([3, 2, 1])),
//   "findPeak: убывающий массив",
// );
// assert(
//   isPeak([1, 2, 3], findPeakElement([1, 2, 3])),
//   "findPeak: возрастающий массив",
// );

// ===== ЗАДАЧА 4: Целочисленный корень числа (Medium) =====
// Вычислите целочисленный квадратный корень неотрицательного числа x.
// Вернуть нужно floor(sqrt(x)) — наибольшее целое, квадрат которого ≤ x.
// Нельзя использовать Math.sqrt, Math.pow или оператор **.
//
// Пример:
// mySqrt(4) → 2
// mySqrt(8) → 2   (sqrt(8) ≈ 2.83, floor = 2)
// mySqrt(0) → 0
//
// Подсказка: ищите ответ в диапазоне [0, x] с помощью бинарного поиска.
//
// Оцените сложность по времени и памяти.

// function mySqrt(x) {
//   let left = 0;
//   let right = x;
//
//   while (left <= right) {
//     const mid = Math.floor((left + right) / 2);
//     if (mid * mid === x) return mid;
//     else if (mid * mid > x) right = mid - 1;
//     else left = mid + 1;
//   }
//
//   return right;
// }

// --- Тесты задача 4 ---
// assert(mySqrt(0) === 0, "mySqrt(0) = 0");
// assert(mySqrt(1) === 1, "mySqrt(1) = 1");
// assert(mySqrt(4) === 2, "mySqrt(4) = 2");
// assert(mySqrt(8) === 2, "mySqrt(8) = 2");
// assert(mySqrt(9) === 3, "mySqrt(9) = 3");
// assert(mySqrt(15) === 3, "mySqrt(15) = 3");
// assert(mySqrt(100) === 10, "mySqrt(100) = 10");
// assert(mySqrt(2147483647) === 46340, "mySqrt(2147483647) = 46340");

// ===== ЗАДАЧА 5: Поиск в повёрнутом отсортированном массиве (Medium) =====
// Отсортированный массив уникальных чисел был «повёрнут» в некоторой
// точке (например, [0,1,2,4,5,6,7] → [4,5,6,7,0,1,2]).
// Найдите индекс target или верните -1.
//
// Решение должно работать за O(log n).
//
// Пример:
// searchRotated([4, 5, 6, 7, 0, 1, 2], 0) → 4
// searchRotated([4, 5, 6, 7, 0, 1, 2], 3) → -1
//
// Подсказка: на каждом шаге одна из половин (left..mid или mid..right)
// точно отсортирована. Определите какая, и проверьте, попадает ли target
// в отсортированную половину.
//
// Оцените сложность по времени и памяти.

// function searchRotated(nums, target) {
//   let left = 0;
//   let right = nums.length - 1;
//
//   while (left <= right) {
//     const middle = Math.floor((left + right) / 2);
//     if (nums[middle] === target) return middle;
//
//     // Левая половина [left..middle] отсортирована
//     if (nums[left] <= nums[middle]) {
//       // target попадает в диапазон левой половины?
//       if (target >= nums[left] && target < nums[middle]) {
//         right = middle - 1;
//       } else {
//         left = middle + 1;
//       }
//     }
//     // Правая половина [middle..right] отсортирована
//     else {
//       // target попадает в диапазон правой половины?
//       if (target > nums[middle] && target <= nums[right]) {
//         left = middle + 1;
//       } else {
//         right = middle - 1;
//       }
//     }
//   }
//
//   return -1;
// }

// --- Тесты задача 5 ---
// assert(
//   searchRotated([4, 5, 6, 7, 0, 1, 2], 0) === 4,
//   "searchRotated: найден 0",
// );
// assert(
//   searchRotated([4, 5, 6, 7, 0, 1, 2], 3) === -1,
//   "searchRotated: 3 не найден",
// );
// assert(
//   searchRotated([4, 5, 6, 7, 0, 1, 2], 4) === 0,
//   "searchRotated: первый элемент",
// );
// assert(
//   searchRotated([4, 5, 6, 7, 0, 1, 2], 2) === 6,
//   "searchRotated: последний элемент",
// );
// assert(searchRotated([1], 1) === 0, "searchRotated: один элемент — найден");
// assert(searchRotated([1], 0) === -1, "searchRotated: один элемент — не найден");
// assert(searchRotated([3, 1], 1) === 1, "searchRotated: два элемента");

// ===== ЗАДАЧА 6: Разделить массив на k частей с мин. макс. суммой (Hard) =====
// Дан массив неотрицательных целых чисел nums и число k.
// Нужно разделить массив на k непустых непрерывных подмассивов.
// Минимизируйте максимальную сумму среди этих k подмассивов.
// Верните эту минимальную возможную максимальную сумму.
//
// Пример:
// splitArray([7, 2, 5, 10, 8], 2) → 18
//   Лучшее разбиение: [7, 2, 5] и [10, 8], суммы = 14 и 18, макс = 18.
//
// splitArray([1, 2, 3, 4, 5], 2) → 9
//   Лучшее разбиение: [1, 2, 3, 4] и [5] → макс = 10, или [1, 2, 3] и [4, 5] → макс = 9.
//
// Подсказка: бинарный поиск по ответу. Диапазон ответа — от max(nums)
// до sum(nums). Для каждого кандидата проверяйте жадно: можно ли
// разбить массив на ≤ k частей, чтобы сумма каждой части ≤ кандидат.
//
// Оцените сложность по времени и памяти.

// function splitArray(nums, k) {
//   // ваш код
// }

// --- Тесты задача 6 ---
// assert(splitArray([7, 2, 5, 10, 8], 2) === 18, "splitArray: [7,2,5,10,8] k=2 → 18");
// assert(splitArray([1, 2, 3, 4, 5], 2) === 9, "splitArray: [1,2,3,4,5] k=2 → 9");
// assert(splitArray([1, 4, 4], 3) === 4, "splitArray: [1,4,4] k=3 → 4");
// assert(splitArray([10], 1) === 10, "splitArray: один элемент → 10");
// assert(splitArray([1, 1, 1, 1, 1], 5) === 1, "splitArray: k = длина массива → 1");
// assert(splitArray([2, 3, 1, 2, 4, 3], 3) === 6, "splitArray: [2,3,1,2,4,3] k=3 → 6");
