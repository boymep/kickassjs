import type { TopicQuiz } from '../../types/quiz';

export const slidingWindowQuiz: TopicQuiz = {
  topicId: 'sliding-window',
  questions: [
    // ── Easy (1–6) ──────────────────────────────────────────────
    {
      type: 'fill-blank',
      id: 'sw-q1',
      description: 'Заполните пропуск в коде сдвига фиксированного окна размера k.',
      codeWithBlanks: `// Сдвигаем окно на один элемент вправо
for (let i = k; i < arr.length; i++) {
  sum = sum + arr[i] - ___BLANK___;
  maxSum = Math.max(maxSum, sum);
}`,
      options: ['arr[i - 1]', 'arr[i - k]', 'arr[i + k]', 'arr[0]'],
      correctIndex: 1,
      explanation:
        'При сдвиге окна мы добавляем новый элемент arr[i] и убираем элемент, который вышел за левую границу окна — arr[i - k]. Окно размера k: текущий правый край — i, левый край — i - k + 1, а элемент, который только что вышел — i - k.',
    },
    {
      type: 'output',
      id: 'sw-q2',
      description: 'Что вернёт вызов maxSumSubarray([2, 1, 5, 1, 3, 2], 3)?',
      code: `function maxSumSubarray(arr, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += arr[i];
  let maxSum = sum;
  for (let i = k; i < arr.length; i++) {
    sum = sum + arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, sum);
  }
  return maxSum;
}

console.log(maxSumSubarray([2, 1, 5, 1, 3, 2], 3));`,
      options: ['7', '8', '9', '6'],
      correctIndex: 2,
      explanation:
        'Окна: [2,1,5]=8, [1,5,1]=7, [5,1,3]=9, [1,3,2]=6. Максимальная сумма — 9 (окно [5,1,3]).',
    },
    {
      type: 'fill-blank',
      id: 'sw-q3',
      description:
        'Заполните условие в цикле while для динамического окна. Ищем кратчайший подмассив с суммой >= target.',
      codeWithBlanks: `for (let right = 0; right < nums.length; right++) {
  sum += nums[right];

  while (___BLANK___) {
    minLen = Math.min(minLen, right - left + 1);
    sum -= nums[left];
    left++;
  }
}`,
      options: ['sum < target', 'sum >= target', 'right - left + 1 > k', 'left < right'],
      correctIndex: 1,
      explanation:
        'Пока сумма окна >= target, мы пытаемся сузить окно слева, чтобы найти минимальную длину. Условие while — sum >= target.',
    },
    {
      type: 'tracing',
      id: 'sw-q4',
      description:
        'Проследите выполнение minSubarrayLen(7, [2, 3, 1, 2, 4, 3]). Какой результат вернёт функция?',
      code: `function minSubarrayLen(target, nums) {
  let left = 0, sum = 0, minLen = Infinity;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      sum -= nums[left];
      left++;
    }
  }
  return minLen === Infinity ? 0 : minLen;
}`,
      steps: [
        { label: 'right=0', variables: { left: 0, sum: 2, minLen: 'Infinity' } },
        { label: 'right=1', variables: { left: 0, sum: 5, minLen: 'Infinity' } },
        { label: 'right=2', variables: { left: 0, sum: 6, minLen: 'Infinity' } },
        { label: 'right=3, sum>=7', variables: { left: 0, sum: 8, minLen: 4 } },
        { label: 'сужаем: left=1', variables: { left: 1, sum: 6, minLen: 4 } },
        { label: 'right=4, sum>=7', variables: { left: 1, sum: 10, minLen: 4 } },
        { label: 'сужаем: left=2', variables: { left: 2, sum: 7, minLen: 3 } },
        { label: 'сужаем: left=3', variables: { left: 3, sum: 6, minLen: 3 } },
        { label: 'right=5, sum>=7', variables: { left: 3, sum: 9, minLen: 3 } },
        { label: 'сужаем: left=4', variables: { left: 4, sum: 7, minLen: 2 } },
        { label: 'сужаем: left=5', variables: { left: 5, sum: 3, minLen: 2 } },
      ],
      question: 'Какой результат вернёт функция?',
      options: ['1', '2', '3', '4'],
      correctIndex: 1,
      explanation:
        'Минимальная длина подмассива с суммой >= 7 — это 2 (подмассив [4, 3] с суммой 7).',
    },
    {
      type: 'complexity',
      id: 'sw-q5',
      description: 'Какова временная сложность алгоритма скользящего окна фиксированного размера k?',
      code: `function maxSumSubarray(arr, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += arr[i];
  let maxSum = sum;
  for (let i = k; i < arr.length; i++) {
    sum = sum + arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, sum);
  }
  return maxSum;
}`,
      options: ['O(1)', 'O(k)', 'O(n)', 'O(n·k)'],
      correctIndex: 2,
      explanation:
        'Первый цикл выполняется k раз, второй — n - k раз. Итого k + (n - k) = n итераций, то есть O(n). Сдвиг окна за O(1) на каждом шаге — именно в этом суть оптимизации.',
    },
    {
      type: 'output',
      id: 'sw-q6',
      description:
        'Можно ли использовать динамическое скользящее окно (с сужением слева) для задач на сумму, если в массиве есть отрицательные числа?',
      code: `// Пример: найти кратчайший подмассив с суммой >= 5
// arr = [2, -1, 4, 3, -2]
//
// Динамическое окно пробует сужать слева,
// когда sum >= target. Но убирая отрицательный
// элемент, мы УВЕЛИЧИВАЕМ сумму — алгоритм
// может пропустить оптимальное решение.`,
      options: [
        'Да, всегда работает',
        'Нет, логика сужения окна ломается',
        'Только если окно фиксированное',
        'Только с абсолютными значениями',
      ],
      correctIndex: 1,
      explanation:
        'При отрицательных числах удаление элемента из левого края может увеличить сумму, а не уменьшить. Жадное сужение окна (while sum >= target) перестаёт корректно находить минимальное окно. Для таких случаев нужен другой подход (например, prefix sums + deque).',
    },

    // ── Intermediate (7–11) ─────────────────────────────────────
    {
      type: 'fill-blank',
      id: 'sw-q7',
      description:
        'Заполните пропуск: динамическое окно с Set для поиска длиннейшей подстроки без повторяющихся символов.',
      codeWithBlanks: `function lengthOfLongestSubstring(s) {
  const set = new Set();
  let left = 0, maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      ___BLANK___;
      left++;
    }
    set.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      options: ['set.clear()', 'set.delete(s[right])', 'set.delete(s[left])', 'set.add(s[left])'],
      correctIndex: 2,
      explanation:
        'Когда мы встречаем дубликат, нужно удалять символы с левого края окна (set.delete(s[left])), сдвигая left вправо, пока дубликат не будет убран. Нельзя удалять s[right] — его ещё нет в нужной позиции. Нельзя делать clear() — это уничтожит всё окно.',
    },
    {
      type: 'output',
      id: 'sw-q8',
      description: 'Что вернёт lengthOfLongestSubstring("abcabcbb")?',
      code: `function lengthOfLongestSubstring(s) {
  const set = new Set();
  let left = 0, maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}

console.log(lengthOfLongestSubstring("abcabcbb"));`,
      options: ['2', '3', '4', '8'],
      correctIndex: 1,
      explanation:
        'Длиннейшая подстрока без повторов — "abc" (длина 3). Как только right доходит до второго "a", окно сужается слева. Максимум достигается на подстроках "abc", "bca", "cab" — все длины 3.',
    },
    {
      type: 'tracing',
      id: 'sw-q9',
      description:
        'Проследите вычисление средних значений подмассивов размера k = 3 для массива [1, 3, 2, 6, -1, 4, 1, 8, 2]. Чему равно среднее последнего окна?',
      code: `function avgOfSubarrays(arr, k) {
  const result = [];
  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    if (i >= k - 1) {
      result.push(sum / k);
      sum -= arr[i - k + 1];
    }
  }
  return result;
}`,
      steps: [
        { label: 'i=0', variables: { sum: 1, result: '[]' } },
        { label: 'i=1', variables: { sum: 4, result: '[]' } },
        { label: 'i=2 (окно готово)', variables: { sum: 6, result: '[2.0]' } },
        { label: 'i=3', variables: { sum: 11, result: '[2.0, 3.67]' } },
        { label: 'i=4', variables: { sum: 7, result: '[2.0, 3.67, 2.33]' } },
        { label: 'i=5', variables: { sum: 9, result: '[..., 3.0]' } },
        { label: 'i=6', variables: { sum: 4, result: '[..., 1.33]' } },
        { label: 'i=7', variables: { sum: 13, result: '[..., 4.33]' } },
        { label: 'i=8', variables: { sum: 11, result: '[..., 3.67]' } },
      ],
      question: 'Чему равно среднее последнего окна [1, 8, 2]?',
      options: ['4.33', '3.67', '3.00', '5.50'],
      correctIndex: 1,
      explanation:
        'Последнее окно — [1, 8, 2]. Сумма = 11, среднее = 11 / 3 ≈ 3.67. Обратите внимание: формула sum -= arr[i - k + 1] убирает элемент, покидающий окно после записи среднего.',
    },
    {
      type: 'complexity',
      id: 'sw-q10',
      description:
        'Какова временная сложность алгоритма поиска длиннейшей подстроки без повторов с использованием Set?',
      code: `function lengthOfLongestSubstring(s) {
  const set = new Set();
  let left = 0, maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      options: ['O(n²)', 'O(n)', 'O(n log n)', 'O(n · m), где m — размер алфавита'],
      correctIndex: 1,
      explanation:
        'Хотя есть вложенный while, каждый элемент добавляется в Set ровно один раз и удаляется ровно один раз. Указатель left в сумме проходит не более n шагов за всё время работы. Итого: O(n) + O(n) = O(n). Это амортизированная линейная сложность.',
    },
    {
      type: 'fill-blank',
      id: 'sw-q11',
      description:
        'Заполните пропуск: оптимизация «длиннейшей подстроки без повторов» с Map, чтобы left прыгал сразу к нужной позиции.',
      codeWithBlanks: `function lengthOfLongestSubstring(s) {
  const map = new Map(); // символ -> последний индекс
  let left = 0, maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    if (map.has(s[right])) {
      left = Math.max(left, ___BLANK___);
    }
    map.set(s[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      options: [
        'map.get(s[right])',
        'map.get(s[right]) + 1',
        'right - left',
        'map.size',
      ],
      correctIndex: 1,
      explanation:
        'Когда мы видим повтор, left должен перескочить на позицию ПОСЛЕ предыдущего вхождения этого символа — map.get(s[right]) + 1. Math.max(left, ...) нужен, чтобы left не «откатился» назад, если старое вхождение уже за пределами текущего окна.',
    },

    // ── Harder middle (12–16) ───────────────────────────────────
    {
      type: 'output',
      id: 'sw-q12',
      description:
        'Что выведет код? Рассмотрите случай, когда окно скользит по массиву с повторяющимися элементами.',
      code: `function maxUniqueInWindow(arr, k) {
  const map = new Map();
  let maxUnique = 0;

  for (let i = 0; i < arr.length; i++) {
    map.set(arr[i], (map.get(arr[i]) || 0) + 1);

    if (i >= k) {
      const left = arr[i - k];
      map.set(left, map.get(left) - 1);
      if (map.get(left) === 0) map.delete(left);
    }

    if (i >= k - 1) {
      maxUnique = Math.max(maxUnique, map.size);
    }
  }
  return maxUnique;
}

console.log(maxUniqueInWindow([1, 2, 1, 3, 2, 3], 3));`,
      options: ['2', '3', '1', '4'],
      correctIndex: 1,
      explanation:
        'Окна размера 3: [1,2,1]→2 уникальных, [2,1,3]→3 уникальных, [1,3,2]→3 уникальных, [3,2,3]→2 уникальных. Максимум уникальных элементов в окне — 3.',
    },
    {
      type: 'tracing',
      id: 'sw-q13',
      description:
        'Проследите работу алгоритма «минимальное окно, содержащее все символы». Вход: s = "ADOBECODEBANC", t = "ABC". На каком шаге впервые найдено валидное окно?',
      code: `function minWindow(s, t) {
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);
  let have = 0, required = need.size;
  let left = 0, minLen = Infinity, result = "";

  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (need.has(c)) {
      need.set(c, need.get(c) - 1);
      if (need.get(c) === 0) have++;
    }
    while (have === required) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        result = s.slice(left, right + 1);
      }
      const leftChar = s[left];
      if (need.has(leftChar)) {
        need.set(leftChar, need.get(leftChar) + 1);
        if (need.get(leftChar) > 0) have--;
      }
      left++;
    }
  }
  return result;
}`,
      steps: [
        { label: 'right=0 "A"', variables: { have: 1, required: 3, left: 0 } },
        { label: 'right=3 "B"', variables: { have: 2, required: 3, left: 0 } },
        { label: 'right=5 "C" — первое окно!', variables: { have: 3, required: 3, left: 0 } },
        { label: 'сужаем, left=1', variables: { have: 2, required: 3, minLen: 6 } },
        { label: 'right=10 "A"', variables: { have: 3, required: 3, left: 5 } },
        { label: 'right=12 "C" — финальное', variables: { have: 3, required: 3, result: 'BANC' } },
      ],
      question: 'Какой результат вернёт функция?',
      options: ['"ADOBEC"', '"BANC"', '"CODEBA"', '"EBANC"'],
      correctIndex: 1,
      explanation:
        'Первое полное окно — "ADOBEC" (длина 6). Затем алгоритм продолжает искать меньшее окно и в итоге находит "BANC" (длина 4) — это минимальное окно, содержащее все символы "ABC".',
    },
    {
      type: 'output',
      id: 'sw-q14',
      description:
        'Что вернёт функция при пустом массиве? Рассмотрите краевой случай.',
      code: `function maxSumSubarray(arr, k) {
  if (arr.length < k) return null;

  let sum = 0;
  for (let i = 0; i < k; i++) sum += arr[i];
  let maxSum = sum;

  for (let i = k; i < arr.length; i++) {
    sum = sum + arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, sum);
  }
  return maxSum;
}

const a = maxSumSubarray([], 3);
const b = maxSumSubarray([5], 3);
const c = maxSumSubarray([1, 2, 3], 3);
console.log(a, b, c);`,
      options: [
        '0 5 6',
        'null null 6',
        'undefined undefined 6',
        'NaN NaN 6',
      ],
      correctIndex: 1,
      explanation:
        'Проверка arr.length < k возвращает null, если массив короче окна. [] (длина 0 < 3) → null. [5] (длина 1 < 3) → null. [1,2,3] (длина 3 === 3) — окно как раз помещается, сумма = 6.',
    },
    {
      type: 'complexity',
      id: 'sw-q15',
      description:
        'Какова временная сложность наивного подхода (перебор всех подстрок) для задачи «длиннейшая подстрока без повторов» по сравнению с подходом скользящего окна?',
      code: `// Наивный подход:
function naive(s) {
  let maxLen = 0;
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      const sub = s.slice(i, j + 1);
      if (new Set(sub).size === sub.length) {
        maxLen = Math.max(maxLen, sub.length);
      }
    }
  }
  return maxLen;
}

// Скользящее окно:
function optimal(s) {
  const set = new Set();
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left++]);
    }
    set.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      options: [
        'Наивный O(n²), окно O(n)',
        'Наивный O(n³), окно O(n)',
        'Наивный O(n²), окно O(n log n)',
        'Наивный O(2ⁿ), окно O(n²)',
      ],
      correctIndex: 1,
      explanation:
        'Наивный подход: два вложенных цикла дают O(n²) подстрок, для каждой проверка уникальности через Set — O(n). Итого O(n³). Скользящее окно с Set — O(n), так как каждый символ добавляется и удаляется из Set не более одного раза.',
    },
    {
      type: 'fill-blank',
      id: 'sw-q16',
      description:
        'Заполните пропуск: подсчёт подмассивов с произведением строго меньше k. Каждый новый right добавляет right - left + 1 новых подмассивов.',
      codeWithBlanks: `function numSubarrayProductLessThanK(nums, k) {
  if (k <= 1) return 0;
  let product = 1, left = 0, count = 0;

  for (let right = 0; right < nums.length; right++) {
    product *= nums[right];

    while (product >= k) {
      product /= nums[left];
      left++;
    }
    count += ___BLANK___;
  }
  return count;
}`,
      options: [
        'right - left',
        'right - left + 1',
        'nums.length - right',
        '1',
      ],
      correctIndex: 1,
      explanation:
        'Когда правый край зафиксирован на позиции right, все подмассивы, заканчивающиеся на right с началом от left до right включительно, имеют произведение < k. Количество таких подмассивов — right - left + 1. Например, при left=1, right=3 это подмассивы [1..3], [2..3], [3..3] — ровно 3 штуки.',
    },
  ],
};
