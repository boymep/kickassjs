// =====================================================
// Хеш-таблицы и частотный анализ — подготовка к собеседованию
// =====================================================
// Запуск: node algorithms/04-hash-map.js

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
// КАК РАБОТАЮТ ХЕШ-ТАБЛИЦЫ В АЛГОРИТМАХ
// =====================================================
//
// Хеш-таблица (в JS — Object или Map) обеспечивает:
//   - Вставка: O(1) в среднем
//   - Поиск: O(1) в среднем
//   - Удаление: O(1) в среднем
//
// Основные паттерны:
//
// 1. Частотный подсчёт: пройти массив/строку, подсчитать
//    сколько раз встречается каждый элемент.
//    Применение: анаграммы, дубликаты, top-k элементов.
//
// 2. Lookup-таблица: сохранить значения для быстрого поиска.
//    Применение: two-sum (сохраняем complement), prefix sum.
//
// 3. Prefix sum + Map: для подмассивов с заданной суммой.
//    prefixSum[j] - prefixSum[i] = k  ⟹  ищем prefixSum[i] = prefixSum[j] - k.
//    Сохраняем все встреченные prefix sum в Map.
//
// 4. Группировка: объединить элементы по общему ключу.
//    Ключ может быть строкой, отсортированными символами и т.д.
//
// Map vs Object в JS:
//   - Map: любые ключи, гарантированный порядок, .size, итерируемый.
//   - Object: только строковые/символьные ключи, удобный синтаксис.
//   Для алгоритмов обычно лучше Map.
//
// Типичная сложность: O(n) по времени, O(n) по памяти.
// =====================================================


// ===== ЗАДАЧА 1: Два числа с заданной суммой — неотсортированный массив (Easy) =====
// Дан массив целых чисел и число target. Верните индексы двух
// элементов, сумма которых равна target.
// Гарантируется единственное решение. Нельзя использовать
// один элемент дважды.
//
// Пример:
// twoSum([2, 7, 11, 15], 9) → [0, 1]   (2 + 7 = 9)
// twoSum([3, 2, 4], 6) → [1, 2]         (2 + 4 = 6)
//
// Подсказка: для каждого числа проверьте, есть ли уже
// в Map его «дополнение» (target - num).
//
// Оцените сложность по времени и памяти.

// function twoSum(nums, target) {
//   // ваш код
// }

// --- Тесты задача 1 ---
// assertDeepEqual(twoSum([2, 7, 11, 15], 9), [0, 1], "twoSum: 2+7=9");
// assertDeepEqual(twoSum([3, 2, 4], 6), [1, 2], "twoSum: 2+4=6");
// assertDeepEqual(twoSum([3, 3], 6), [0, 1], "twoSum: 3+3=6");
// assertDeepEqual(twoSum([1, 5, 3, 7], 8), [1, 2], "twoSum: 5+3=8");
// assertDeepEqual(twoSum([-1, 0, 1, 2], 1), [0, 2], "twoSum: -1+2=1");


// ===== ЗАДАЧА 2: Проверка анаграмм (Easy) =====
// Две строки являются анаграммами, если одна получается из другой
// перестановкой букв. Проверьте, являются ли строки s и t анаграммами.
// Регистр учитывается. Нельзя использовать sort().
//
// Пример:
// isAnagram("anagram", "nagaram") → true
// isAnagram("rat", "car") → false
// isAnagram("listen", "silent") → true
//
// Оцените сложность по времени и памяти.

// function isAnagram(s, t) {
//   // ваш код
// }

// --- Тесты задача 2 ---
// assert(isAnagram("anagram", "nagaram") === true, "isAnagram: anagram/nagaram → true");
// assert(isAnagram("rat", "car") === false, "isAnagram: rat/car → false");
// assert(isAnagram("listen", "silent") === true, "isAnagram: listen/silent → true");
// assert(isAnagram("", "") === true, "isAnagram: пустые строки → true");
// assert(isAnagram("a", "ab") === false, "isAnagram: разная длина → false");
// assert(isAnagram("aabb", "abab") === true, "isAnagram: aabb/abab → true");


// ===== ЗАДАЧА 3: Группировка анаграмм (Medium) =====
// Дан массив строк. Сгруппируйте их так, чтобы анаграммы
// оказались в одной группе. Порядок групп и элементов внутри
// не важен.
//
// Пример:
// groupAnagrams(["eat","tea","tan","ate","nat","bat"])
// → [["eat","tea","ate"], ["tan","nat"], ["bat"]]
//
// Подсказка: нужен ключ, одинаковый для всех анаграмм.
// Варианты: отсортированная строка, или строка из частот букв.
//
// Оцените сложность по времени и памяти.

// function groupAnagrams(strs) {
//   // ваш код
// }

// --- Тесты задача 3 ---
// function sortGroups(groups) {
//   return groups.map(g => [...g].sort()).sort((a, b) => a[0].localeCompare(b[0]));
// }
// assertDeepEqual(
//   sortGroups(groupAnagrams(["eat","tea","tan","ate","nat","bat"])),
//   sortGroups([["eat","tea","ate"], ["tan","nat"], ["bat"]]),
//   "groupAnagrams: основной пример"
// );
// assertDeepEqual(sortGroups(groupAnagrams([""])), [[""]], "groupAnagrams: пустая строка");
// assertDeepEqual(sortGroups(groupAnagrams(["a"])), [["a"]], "groupAnagrams: одна строка");
// assertDeepEqual(
//   sortGroups(groupAnagrams(["abc","cba","bca","xyz","zyx"])),
//   sortGroups([["abc","cba","bca"], ["xyz","zyx"]]),
//   "groupAnagrams: две группы"
// );
// assertDeepEqual(
//   sortGroups(groupAnagrams(["ab","ba","cd","dc","ab"])),
//   sortGroups([["ab","ba","ab"], ["cd","dc"]]),
//   "groupAnagrams: с дубликатами"
// );


// ===== ЗАДАЧА 4: Количество подмассивов с суммой k (Medium) =====
// Дан массив целых чисел (могут быть отрицательные!) и число k.
// Подсчитайте количество непрерывных подмассивов с суммой, равной k.
//
// Пример:
// subarraySum([1, 1, 1], 2) → 2         ([1,1] начиная с 0 и с 1)
// subarraySum([1, 2, 3], 3) → 2         ([1,2] и [3])
// subarraySum([1, -1, 0], 0) → 3        ([1,-1], [-1,0], [1,-1,0])
//
// Подсказка: prefix sum + Map. Если текущая prefixSum = P, а раньше
// встречалась prefixSum = P - k, значит между ними подмассив с суммой k.
// Считайте, сколько раз каждая prefixSum встречалась.
//
// Оцените сложность по времени и памяти.

// function subarraySum(nums, k) {
//   // ваш код
// }

// --- Тесты задача 4 ---
// assert(subarraySum([1, 1, 1], 2) === 2, "subarraySum: [1,1,1] k=2 → 2");
// assert(subarraySum([1, 2, 3], 3) === 2, "subarraySum: [1,2,3] k=3 → 2");
// assert(subarraySum([1, -1, 0], 0) === 3, "subarraySum: [1,-1,0] k=0 → 3");
// assert(subarraySum([1], 1) === 1, "subarraySum: [1] k=1 → 1");
// assert(subarraySum([1], 0) === 0, "subarraySum: [1] k=0 → 0");
// assert(subarraySum([0, 0, 0], 0) === 6, "subarraySum: [0,0,0] k=0 → 6");
// assert(subarraySum([-1, -1, 1], 0) === 1, "subarraySum: [-1,-1,1] k=0 → 1");


// ===== ЗАДАЧА 5: Топ-K частых элементов (Medium) =====
// Дан массив целых чисел и число k. Верните k наиболее
// часто встречающихся элементов. Порядок в ответе не важен.
// Гарантируется, что ответ единственный.
//
// Решение должно быть лучше O(n log n).
//
// Пример:
// topKFrequent([1, 1, 1, 2, 2, 3], 2) → [1, 2]
// topKFrequent([1], 1) → [1]
// topKFrequent([4, 4, 4, 1, 1, 2, 2, 2, 3], 2) → [4, 2]
//
// Подсказка: постройте частотную карту за O(n), затем используйте
// bucket sort — создайте массив «корзин», где индекс = частота,
// значение = список элементов с такой частотой. Пройдите корзины
// с конца, собирая k элементов.
//
// Оцените сложность по времени и памяти.

// function topKFrequent(nums, k) {
//   // ваш код
// }

// --- Тесты задача 5 ---
// function sortArr(arr) { return [...arr].sort((a, b) => a - b); }
// assertDeepEqual(sortArr(topKFrequent([1, 1, 1, 2, 2, 3], 2)), [1, 2], "topK: [1,1,1,2,2,3] k=2");
// assertDeepEqual(topKFrequent([1], 1), [1], "topK: [1] k=1");
// assertDeepEqual(sortArr(topKFrequent([4, 4, 4, 1, 1, 2, 2, 2, 3], 2)), [2, 4], "topK: k=2");
// assertDeepEqual(sortArr(topKFrequent([1, 2, 3, 4], 4)), [1, 2, 3, 4], "topK: все с частотой 1");
// assertDeepEqual(sortArr(topKFrequent([5, 5, 5, 5, 3, 3, 1], 1)), [5], "topK: k=1 → самый частый");
