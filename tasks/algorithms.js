// =====================================================
// Алгоритмы и структуры данных — подготовка к Avito
// =====================================================
// Запуск: node algorithms.js

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

// ===== ЗАДАЧА 1: Два указателя — Два числа с заданной суммой =====
// Дан отсортированный массив чисел и целое число target.
// Верните индексы двух элементов, сумма которых равна target.
// Решение должно работать за O(n) по времени и O(1) по памяти.
// Гарантируется, что решение существует и единственно.
//
// Пример:
// twoSum([1, 3, 5, 7, 11], 16) → [2, 4]   (5 + 11 = 16)
// twoSum([2, 4, 6, 10], 8) → [0, 2]        (2 + 6 = 8)
//
// Оцените сложность вашего решения по времени и памяти.

// function twoSum(nums, target) {
//   let left = 0;
//   let right = nums.length - 1;
//
//   while (left < right) {
//     const sum = nums[left] + nums[right];
//     if (sum === target) return [left, right];
//     if (sum < target) left++;
//     else right--;
//   }
// }

// --- Тесты задача 1 ---
// assertDeepEqual(twoSum([1, 3, 5, 7, 11], 16), [2, 4], "twoSum: [1,3,5,7,11] target=16");
// assertDeepEqual(twoSum([2, 4, 6, 10], 8), [0, 2], "twoSum: [2,4,6,10] target=8");
// assertDeepEqual(twoSum([1, 2, 3, 4, 5], 9), [3, 4], "twoSum: [1,2,3,4,5] target=9");
// assertDeepEqual(twoSum([0, 1], 1), [0, 1], "twoSum: [0,1] target=1");
// assertDeepEqual(twoSum([-3, -1, 0, 2, 5], 4), [1, 4], "twoSum: [-3,-1,0,2,5] target=4");


// ===== ЗАДАЧА 2: Анаграммы =====
// Напишите функцию, проверяющую, являются ли две строки анаграммами.
// Анаграмма — строка, составленная из тех же букв в другом порядке.
// Регистр не учитывать. Пробелы не учитывать.
// Нельзя использовать sort().
//
// Пример:
// isAnagram("listen", "silent") → true
// isAnagram("Hello", "Olelh") → true
// isAnagram("abc", "abd") → false
//
// Оцените сложность по времени и памяти.

// function isAnagram(a, b) {
//   const first = a.replaceAll(" ", "").toLowerCase().split("");
//   const second = b.replaceAll(" ", "").toLowerCase().split("");
//   const elementMap = {};
//
//   for (let i = 0; i < first.length; i++) {
//     const element = first[i];
//     if (elementMap[element]) elementMap[element]++;
//     else elementMap[element] = 1;
//   }
//
//   for (let i = 0; i < second.length; i++) {
//     const element = second[i];
//     if (elementMap[element]) elementMap[element]--;
//     else elementMap[element] = -1;
//   }
//
//   if (Object.values(elementMap).some((item) => item !== 0)) return false;
//   else return true;
// }

// --- Тесты задача 2 ---
// assert(isAnagram("listen", "silent") === true, "isAnagram: listen/silent → true");
// assert(isAnagram("Hello", "Olelh") === true, "isAnagram: Hello/Olelh → true");
// assert(isAnagram("abc", "abd") === false, "isAnagram: abc/abd → false");
// assert(isAnagram("", "") === true, "isAnagram: пустые строки → true");
// assert(isAnagram("a", "aa") === false, "isAnagram: a/aa → false");
// assert(isAnagram("Astronomer", "Moon starer") === true, "isAnagram: с пробелами → true");


// ===== ЗАДАЧА 3: Скобочная последовательность =====
// Дана строка, содержащая только символы '(', ')', '{', '}', '[', ']'.
// Определите, является ли строка валидной скобочной последовательностью.
// Каждая открывающая скобка должна быть закрыта соответствующей
// закрывающей скобкой в правильном порядке.
//
// Пример:
// isValidBrackets("()[]{}") → true
// isValidBrackets("([{}])") → true
// isValidBrackets("(]") → false
// isValidBrackets("([)]") → false
//
// Какую структуру данных вы используете и почему?

// function isValidBrackets(str) {
//   if (str.length % 2 !== 0) return false;
//   const stack = [];
//   const bracketMap = {
//     "(": ")",
//     "[": "]",
//     "{": "}",
//   };
//
//   for (const item of str) {
//     if (Object.keys(bracketMap).includes(item)) stack.push(item);
//     else if (Object.values(bracketMap).includes(item)) {
//       const last = stack.pop();
//       if (bracketMap[last] !== item) return false;
//     }
//   }
//
//   if (stack.length === 0) return true;
//   else return false;
// }

// --- Тесты задача 3 ---
// assert(isValidBrackets("()[]{}") === true, "brackets: ()[]{}");
// assert(isValidBrackets("([{}])") === true, "brackets: ([{}])");
// assert(isValidBrackets("(]") === false, "brackets: (]");
// assert(isValidBrackets("([)]") === false, "brackets: ([)]");
// assert(isValidBrackets("") === true, "brackets: пустая строка");
// assert(isValidBrackets("((()))") === true, "brackets: ((()))");
// assert(isValidBrackets("{[}]") === false, "brackets: {[}]");
// assert(isValidBrackets("(") === false, "brackets: незакрытая (");


// ===== ЗАДАЧА 4: Развернуть связный список =====
// Дан односвязный список. Разверните его in-place и верните новый head.
// Решение за O(n) по времени, O(1) по памяти.
//
// Пример:
// reverseList(1 → 2 → 3 → 4 → null) → 4 → 3 → 2 → 1 → null
//
// Узел списка: { val: число, next: узел | null }

// function reverseList(head) {
//   // ваш код
// }

// --- Тесты задача 4 ---
// function makeList(arr) {
//   let head = null;
//   for (let i = arr.length - 1; i >= 0; i--) {
//     head = { val: arr[i], next: head };
//   }
//   return head;
// }
// function listToArray(head) {
//   const res = [];
//   while (head) { res.push(head.val); head = head.next; }
//   return res;
// }
// assertDeepEqual(listToArray(reverseList(makeList([1,2,3,4]))), [4,3,2,1], "reverseList: [1,2,3,4]");
// assertDeepEqual(listToArray(reverseList(makeList([1]))), [1], "reverseList: [1]");
// assert(reverseList(null) === null, "reverseList: null");
// assertDeepEqual(listToArray(reverseList(makeList([1,2]))), [2,1], "reverseList: [1,2]");


// ===== ЗАДАЧА 5: Группировка анаграмм =====
// Дан массив строк. Сгруппируйте строки, являющиеся анаграммами друг друга.
// Нельзя использовать sort(). Придумайте ключ для группировки.
//
// Пример:
// groupAnagrams(["eat","tea","tan","ate","nat","bat"])
// → [["eat","tea","ate"], ["tan","nat"], ["bat"]]
// (порядок групп и элементов внутри группы не важен)
//
// Какую структуру данных вы выберете? Оцените сложность.

// function groupAnagrams(strs) {
//   // ваш код
// }

// --- Тесты задача 5 ---
// function sortGroups(groups) {
//   return groups.map(g => g.slice().sort()).sort((a, b) => a[0].localeCompare(b[0]));
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


// ===== ЗАДАЧА 6: BFS/DFS — Количество островов =====
// Дана матрица m×n из '1' (суша) и '0' (вода).
// Посчитайте количество островов. Остров окружён водой
// и образован соединением смежных (по горизонтали/вертикали) клеток суши.
//
// Пример:
// countIslands([
//   ["1","1","0","0","0"],
//   ["1","1","0","0","0"],
//   ["0","0","1","0","0"],
//   ["0","0","0","1","1"]
// ]) → 3
//
// Используйте DFS или BFS. Объясните выбор.

// function countIslands(grid) {
//   // ваш код
// }

// --- Тесты задача 6 ---
// assert(countIslands([
//   ["1","1","0","0","0"],
//   ["1","1","0","0","0"],
//   ["0","0","1","0","0"],
//   ["0","0","0","1","1"]
// ]) === 3, "countIslands: 3 острова");
// assert(countIslands([
//   ["1","1","1"],
//   ["1","1","1"]
// ]) === 1, "countIslands: 1 остров");
// assert(countIslands([
//   ["0","0","0"],
//   ["0","0","0"]
// ]) === 0, "countIslands: 0 островов");
// assert(countIslands([
//   ["1","0","1"],
//   ["0","1","0"],
//   ["1","0","1"]
// ]) === 5, "countIslands: 5 островов (шахматы)");
// assert(countIslands([["1"]]) === 1, "countIslands: 1x1 суша");
// assert(countIslands([["0"]]) === 0, "countIslands: 1x1 вода");
