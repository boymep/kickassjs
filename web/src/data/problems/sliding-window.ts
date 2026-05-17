import type { Problem } from "../../types/problem";

export const slidingWindowProblems: Problem[] = [
  {
    id: "sw-p1",
    topicId: "sliding-window",
    title: "Максимальная сумма подмассива длины k",
    difficulty: "easy",
    isContextual: false,
    description:
      "Дан массив целых чисел `arr` и число `k`. Найдите максимальную сумму среди всех подмассивов длины `k`.\n\nЕсли длина массива меньше `k`, верните 0.",
    functionName: "maxSumSubarray",
    starterCode: `function maxSumSubarray(arr, k) {
  // Ваш код здесь
}`,
    testCases: [
      {
        id: "sw-p1-t1",
        inputDisplay: "maxSumSubarray([2, 1, 5, 1, 3, 2], 3)",
        inputArgs: [[2, 1, 5, 1, 3, 2], 3],
        expected: 9,
      },
      {
        id: "sw-p1-t2",
        inputDisplay: "maxSumSubarray([1, 2, 3, 4, 5], 2)",
        inputArgs: [[1, 2, 3, 4, 5], 2],
        expected: 9,
      },
      {
        id: "sw-p1-t3",
        inputDisplay: "maxSumSubarray([5, 5, 5, 5], 1)",
        inputArgs: [[5, 5, 5, 5], 1],
        expected: 5,
      },
      {
        id: "sw-p1-t4",
        inputDisplay: "maxSumSubarray([1, 2], 3)",
        inputArgs: [[1, 2], 3],
        expected: 0,
      },
      {
        id: "sw-p1-t5",
        inputDisplay: "maxSumSubarray([10, -3, 4, 7, 2, -1], 4)",
        inputArgs: [[10, -3, 4, 7, 2, -1], 4],
        expected: 18,
      },
    ],
    hints: [
      "Сначала посчитайте сумму первых k элементов.",
      "Затем на каждом шаге добавляйте новый элемент и убирайте самый левый элемент предыдущего окна.",
      "Не забудьте обработать случай, когда arr.length < k.",
    ],
    solutionCode: `function maxSumSubarray(arr, k) {
  if (arr.length < k) return 0;

  let sum = 0;
  for (let i = 0; i < k; i++) {
    sum += arr[i];
  }

  let maxSum = sum;
  for (let i = k; i < arr.length; i++) {
    sum = sum + arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, sum);
  }

  return maxSum;
}`,
  },
  {
    id: "sw-p2",
    topicId: "sliding-window",
    title: "Наименьший подмассив с суммой >= target",
    difficulty: "medium",
    isContextual: false,
    description:
      "Дано положительное целое число `target` и массив положительных целых чисел `nums`. Найдите длину наименьшего подмассива, сумма элементов которого больше или равна `target`.\n\nЕсли такого подмассива не существует, верните 0.",
    functionName: "minSubarrayLen",
    starterCode: `function minSubarrayLen(target, nums) {
  // Ваш код здесь
}`,
    testCases: [
      {
        id: "sw-p2-t1",
        inputDisplay: "minSubarrayLen(7, [2, 3, 1, 2, 4, 3])",
        inputArgs: [7, [2, 3, 1, 2, 4, 3]],
        expected: 2,
      },
      {
        id: "sw-p2-t2",
        inputDisplay: "minSubarrayLen(4, [1, 4, 4])",
        inputArgs: [4, [1, 4, 4]],
        expected: 1,
      },
      {
        id: "sw-p2-t3",
        inputDisplay: "minSubarrayLen(11, [1, 1, 1, 1, 1])",
        inputArgs: [11, [1, 1, 1, 1, 1]],
        expected: 0,
      },
      {
        id: "sw-p2-t4",
        inputDisplay: "minSubarrayLen(15, [5, 1, 3, 5, 10, 7, 4, 9, 2, 8])",
        inputArgs: [15, [5, 1, 3, 5, 10, 7, 4, 9, 2, 8]],
        expected: 2,
      },
      {
        id: "sw-p2-t5",
        inputDisplay: "minSubarrayLen(3, [1, 1, 1, 1])",
        inputArgs: [3, [1, 1, 1, 1]],
        expected: 3,
      },
      {
        id: "sw-p2-t6",
        inputDisplay: "minSubarrayLen(100, [100])",
        inputArgs: [100, [100]],
        expected: 1,
      },
    ],
    hints: [
      "Используйте два указателя (left и right), которые определяют границы окна.",
      "Расширяйте окно вправо, пока сумма не станет >= target.",
      "Как только сумма >= target, пробуйте сужать окно слева, фиксируя минимальную длину.",
      "Каждый элемент добавляется и убирается максимум один раз — сложность O(n).",
    ],
    solutionCode: `function minSubarrayLen(target, nums) {
  let left = 0;
  let sum = 0;
  let minLen = Infinity;

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
  },
  {
    id: "sw-p3",
    topicId: "sliding-window",
    title: "Самый загруженный час в кофейне",
    difficulty: "medium",
    isContextual: true,
    description:
      "В кофейне у входа стоит датчик, который записывает минуту прихода каждого посетителя. За день получился отсортированный массив `arrivals` — например, `[10, 23, 24, 29, 31, 58, 59]` означает, что первый гость пришёл на 10-й минуте, второй — на 23-й, и т.д.\n\nМенеджер хочет узнать: **какое максимальное число гостей приходило в пределах любых `minutes` минут подряд?** Это поможет понять, сколько бариста ставить на смену.\n\nВажно: `minutes` — это не количество гостей, а **длительность отрезка времени**. Количество гостей внутри этого отрезка может быть любым. Два указателя двигаются не с фиксированным шагом, а в зависимости от значений в массиве.\n\nПример: `arrivals = [10, 23, 24, 29, 31, 58, 59]`, `minutes = 10`. Отрезок с 23-й по 31-ю минуту — это 4 гостя за менее чем 10 минут. Это максимум.\n\nМассив отсортирован. Время может повторяться (несколько гостей в одну минуту). Если массив пуст, верните 0.",
    functionName: "maxGuestsInPeriod",
    starterCode: `function maxGuestsInPeriod(arrivals, minutes) {
  // Ваш код здесь
}`,
    testCases: [
      {
        id: "sw-p3-t1",
        inputDisplay: "maxGuestsInPeriod([10, 23, 24, 29, 31, 58, 59], 10)",
        inputArgs: [[10, 23, 24, 29, 31, 58, 59], 10],
        expected: 4,
      },
      {
        id: "sw-p3-t2",
        inputDisplay: "maxGuestsInPeriod([1, 1, 1, 2, 2, 3], 2)",
        inputArgs: [[1, 1, 1, 2, 2, 3], 2],
        expected: 5,
      },
      {
        id: "sw-p3-t3",
        inputDisplay: "maxGuestsInPeriod([100, 200, 300, 400, 500], 50)",
        inputArgs: [[100, 200, 300, 400, 500], 50],
        expected: 1,
      },
      {
        id: "sw-p3-t4",
        inputDisplay: "maxGuestsInPeriod([], 10)",
        inputArgs: [[], 10],
        expected: 0,
      },
      {
        id: "sw-p3-t5",
        inputDisplay: "maxGuestsInPeriod([5, 5, 5, 5, 5], 1)",
        inputArgs: [[5, 5, 5, 5, 5], 1],
        expected: 5,
      },
    ],
    hints: [
      "Размер окна определяется не количеством элементов, а разницей значений: `arrivals[right] - arrivals[left] < minutes`.",
      "Используйте два указателя. Двигайте `right` вправо, а `left` подтягивайте, когда разница значений `>= minutes`.",
      "На каждом шаге количество гостей в текущем окне = `right - left + 1`.",
      "Не забудьте обработать пустой массив.",
    ],
    solutionCode: `function maxGuestsInPeriod(arrivals, minutes) {
  if (arrivals.length === 0) return 0;

  let left = 0;
  let maxCount = 0;

  for (let right = 0; right < arrivals.length; right++) {
    // Сужаем окно, пока разница >= minutes
    while (arrivals[right] - arrivals[left] >= minutes) {
      left++;
    }

    maxCount = Math.max(maxCount, right - left + 1);
  }

  return maxCount;
}`,
  },
  {
    id: "sw-p4",
    topicId: "sliding-window",
    title: "Средний рейтинг за последние K отзывов",
    difficulty: "easy",
    isContextual: true,
    description:
      'На маркетплейсе для каждого продавца ведётся массив оценок от покупателей (от 1 до 5). Для аналитики нужно вычислить средний рейтинг для каждого "окна" из последних `k` отзывов. Верните массив средних значений, округлённых до целого числа.',
    functionName: "averageRatings",
    starterCode: `function averageRatings(ratings, k) {
  // ваш код
}`,
    testCases: [
      {
        id: "sw-p4-t1",
        inputDisplay: "averageRatings([5, 4, 3, 5, 4, 3, 5], 3)",
        inputArgs: [[5, 4, 3, 5, 4, 3, 5], 3],
        expected: [4, 4, 4, 4, 4],
      },
      {
        id: "sw-p4-t2",
        inputDisplay: "averageRatings([1, 2, 3, 4, 5], 2)",
        inputArgs: [[1, 2, 3, 4, 5], 2],
        expected: [2, 3, 4, 5],
      },
      {
        id: "sw-p4-t3",
        inputDisplay: "averageRatings([5], 1)",
        inputArgs: [[5], 1],
        expected: [5],
      },
      {
        id: "sw-p4-t4",
        inputDisplay: "averageRatings([3, 3, 3, 3], 4)",
        inputArgs: [[3, 3, 3, 3], 4],
        expected: [3],
      },
      {
        id: "sw-p4-t5",
        inputDisplay: "averageRatings([1, 5, 1, 5, 1], 3)",
        inputArgs: [[1, 5, 1, 5, 1], 3],
        expected: [2, 4, 2],
      },
    ],
    hints: [
      "Фиксированное окно размера k",
      "Набрать сумму первых k элементов, затем скользить",
    ],
    solutionCode: `function averageRatings(ratings, k) {
  const result = [];
  let sum = 0;

  for (let i = 0; i < k; i++) {
    sum += ratings[i];
  }
  result.push(Math.round(sum / k));

  for (let i = k; i < ratings.length; i++) {
    sum = sum + ratings[i] - ratings[i - k];
    result.push(Math.round(sum / k));
  }

  return result;
}`,
  },
  {
    id: "sw-p6",
    topicId: "sliding-window",
    title: "Трассировка окна: длиннейшая подстрока без повторов",
    difficulty: "easy",
    isContextual: false,
    kind: "predict-output",
    description:
      'Перед вами реализация задачи «длиннейшая подстрока без повторов» через скользящее окно с \`Set\`. Что выведет код для строки `"pwwkew"`?\n\nВнимательно проследите, как окно сжимается при появлении дубликата и какова длина окна на каждом шаге. Введите ровно одно число — длину длиннейшей подстроки без повторов.',
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

console.log(lengthOfLongestSubstring("pwwkew"));`,
    expected: "3",
    hints: [
      "Окно расширяется, пока нет дубликата.",
      'Когда встречается второе `w`, окно сжимается слева до тех пор, пока первое `w` не выйдет.',
      'Длиннейшая подстрока без повторов в "pwwkew" — "wke" (или "kew"), длина 3.',
    ],
    solutionCode: `// Шаги:
// right=0 's=p' → окно "p", maxLen=1
// right=1 's=w' → окно "pw", maxLen=2
// right=2 's=w' → дубликат: удаляем "p", "w", left=2; окно "w", maxLen=2
// right=3 's=k' → окно "wk", maxLen=2
// right=4 's=e' → окно "wke", maxLen=3
// right=5 's=w' → дубликат: удаляем "w", left=3; окно "kew", maxLen=3
// Ответ: 3`,
  },
  {
    id: "sw-p7",
    topicId: "sliding-window",
    title: "Найдите баг: динамическое окно с забытым сжатием",
    difficulty: "medium",
    isContextual: false,
    kind: "find-bug",
    description:
      'Реализация «кратчайшего подмассива с суммой ≥ target» через скользящее окно работает неверно: для `minSubarrayLen(7, [2, 3, 1, 2, 4, 3])` вместо ожидаемого `2` функция возвращает что-то другое.\n\nНайдите ошибку и исправьте её. Подсказка: внимательно посмотрите на цикл сжатия окна — сдвигается ли левый указатель?',
    functionName: "minSubarrayLen",
    buggyCode: `function minSubarrayLen(target, nums) {
  let left = 0;
  let sum = 0;
  let minLen = Infinity;

  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];

    while (sum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      sum -= nums[left];
      // забыли сдвинуть left — окно не сжимается
    }
  }

  return minLen === Infinity ? 0 : minLen;
}`,
    bugSummary:
      "В цикле сжатия отсутствует `left++`. Без сдвига левого указателя окно не сжимается, а `sum` уходит в отрицательные значения, попадая в бесконечный цикл при некоторых входах или давая неверный результат.",
    testCases: [
      {
        id: "sw-p7-t1",
        inputDisplay: "minSubarrayLen(7, [2, 3, 1, 2, 4, 3])",
        inputArgs: [7, [2, 3, 1, 2, 4, 3]],
        expected: 2,
      },
      {
        id: "sw-p7-t2",
        inputDisplay: "minSubarrayLen(4, [1, 4, 4])",
        inputArgs: [4, [1, 4, 4]],
        expected: 1,
      },
      {
        id: "sw-p7-t3",
        inputDisplay: "minSubarrayLen(11, [1, 1, 1, 1, 1])",
        inputArgs: [11, [1, 1, 1, 1, 1]],
        expected: 0,
      },
      {
        id: "sw-p7-t4",
        inputDisplay: "minSubarrayLen(15, [5, 1, 3, 5, 10, 7, 4, 9, 2, 8])",
        inputArgs: [15, [5, 1, 3, 5, 10, 7, 4, 9, 2, 8]],
        expected: 2,
      },
    ],
    hints: [
      "Внутри `while (sum >= target)` должны выполняться ТРИ действия: запомнить минимальную длину, вычесть левый элемент и сдвинуть `left`.",
      "Без `left++` окно не сжимается — это классический баг при копировании шаблона на собеседовании.",
    ],
    solutionCode: `function minSubarrayLen(target, nums) {
  let left = 0;
  let sum = 0;
  let minLen = Infinity;

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
  },
  {
    id: "sw-p8",
    topicId: "sliding-window",
    title: "Рефакторинг: O(n²) → O(n) для максимальной суммы окна",
    difficulty: "medium",
    isContextual: false,
    kind: "refactor",
    description:
      "Перед вами рабочая, но медленная реализация задачи «максимальная сумма подмассива длины k». Для каждого положения окна она заново считает сумму — это O(n·k), и на массиве из 100 000 элементов с `k = 1000` тест не пройдёт по времени.\n\nПерепишите функцию через скользящее окно за O(n): набирайте сумму первого окна один раз, а затем сдвигайте за O(1) — `sum + arr[i] - arr[i - k]`.\n\nКорректность уже проверена на тест-кейсах. Производительный тест требует, чтобы вход размером 100 000 обрабатывался не более чем за 50 мс.",
    functionName: "maxSumSubarray",
    starterCode: `function maxSumSubarray(arr, k) {
  if (arr.length < k) return 0;

  let maxSum = -Infinity;

  // O(n*k): для каждого окна считаем сумму заново
  for (let i = 0; i <= arr.length - k; i++) {
    let sum = 0;
    for (let j = i; j < i + k; j++) {
      sum += arr[j];
    }
    if (sum > maxSum) maxSum = sum;
  }

  return maxSum;
}`,
    testCases: [
      {
        id: "sw-p8-t1",
        inputDisplay: "maxSumSubarray([2, 1, 5, 1, 3, 2], 3)",
        inputArgs: [[2, 1, 5, 1, 3, 2], 3],
        expected: 9,
      },
      {
        id: "sw-p8-t2",
        inputDisplay: "maxSumSubarray([1, 2, 3, 4, 5], 2)",
        inputArgs: [[1, 2, 3, 4, 5], 2],
        expected: 9,
      },
      {
        id: "sw-p8-t3",
        inputDisplay: "maxSumSubarray([10, -3, 4, 7, 2, -1], 4)",
        inputArgs: [[10, -3, 4, 7, 2, -1], 4],
        expected: 18,
      },
      {
        id: "sw-p8-t4",
        inputDisplay: "maxSumSubarray([5, 5, 5, 5], 1)",
        inputArgs: [[5, 5, 5, 5], 1],
        expected: 5,
      },
      {
        id: "sw-p8-t5",
        inputDisplay: "maxSumSubarray([1, 2], 3)",
        inputArgs: [[1, 2], 3],
        expected: 0,
      },
    ],
    perfTest: {
      inputArgs: [
        Array.from({ length: 100000 }, (_, i) => ((i * 1103515245 + 12345) >>> 0) % 1000),
        1000,
      ],
      maxMs: 50,
    },
    hints: [
      "Сначала наберите сумму первых k элементов в одном цикле.",
      "Затем для каждого `i` от `k` до `arr.length - 1` обновляйте сумму за O(1): `sum = sum + arr[i] - arr[i - k]`.",
      "Каждый элемент должен обрабатываться константное число раз — общая сложность O(n).",
    ],
    solutionCode: `function maxSumSubarray(arr, k) {
  if (arr.length < k) return 0;

  let sum = 0;
  for (let i = 0; i < k; i++) {
    sum += arr[i];
  }

  let maxSum = sum;
  for (let i = k; i < arr.length; i++) {
    sum = sum + arr[i] - arr[i - k];
    if (sum > maxSum) maxSum = sum;
  }

  return maxSum;
}`,
  },
  {
    id: "sw-h1",
    topicId: "sliding-window",
    kind: "implement",
    title: "Минимальная подстрока, содержащая все символы шаблона",
    difficulty: "hard",
    isContextual: false,
    description: `Даны строки \`s\` и \`t\`. Найдите **минимальную по длине подстроку** строки \`s\`, которая содержит **все символы** строки \`t\` (включая повторения).

Если такой подстроки нет — верните пустую строку \`""\`.

Примеры:
\`\`\`
minWindow("ADOBECODEBANC", "ABC")  // → "BANC"
minWindow("a", "a")                // → "a"
minWindow("a", "aa")               // → ""  (нет двух 'a')
minWindow("aa", "aa")              // → "aa"
\`\`\``,
    functionName: "minWindow",
    starterCode: `function minWindow(s, t) {
  // ваш код
}`,
    testCases: [
      { id: "sw-h1-t1", inputDisplay: 'minWindow("ADOBECODEBANC", "ABC")', inputArgs: ["ADOBECODEBANC", "ABC"], expected: "BANC" },
      { id: "sw-h1-t2", inputDisplay: 'minWindow("a", "a")', inputArgs: ["a", "a"], expected: "a" },
      { id: "sw-h1-t3", inputDisplay: 'minWindow("a", "aa") → ""', inputArgs: ["a", "aa"], expected: "" },
      { id: "sw-h1-t4", inputDisplay: 'minWindow("aa", "aa")', inputArgs: ["aa", "aa"], expected: "aa" },
      { id: "sw-h1-t5", inputDisplay: 'minWindow("AAABBBCC", "ABC")', inputArgs: ["AAABBBCC", "ABC"], expected: "ABBBC" },
    ],
    hints: [
      "Храните две Map: `need` — требуемые частоты символов из t, `window` — текущие частоты в окне.",
      "Расширяйте окно вправо. Когда все символы t покрыты (переменная `formed === required`), сужайте слева.",
      "При сужении обновляйте минимум. Строка покрыта, когда window.get(c) >= need.get(c) для всех c.",
    ],
    solutionCode: `function minWindow(s, t) {
  if (!t.length) return "";

  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);

  const window = new Map();
  let left = 0, formed = 0;
  const required = need.size;
  let best = [Infinity, 0, 0]; // [length, left, right]

  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    window.set(c, (window.get(c) ?? 0) + 1);
    if (need.has(c) && window.get(c) === need.get(c)) formed++;

    while (formed === required) {
      if (right - left + 1 < best[0]) best = [right - left + 1, left, right];
      const lc = s[left];
      window.set(lc, window.get(lc) - 1);
      if (need.has(lc) && window.get(lc) < need.get(lc)) formed--;
      left++;
    }
  }

  return best[0] === Infinity ? "" : s.slice(best[1], best[2] + 1);
}`,
  },
  {
    id: "sw-h2",
    topicId: "sliding-window",
    kind: "implement",
    title: "Длиннейшая подстрока с не более чем K различными символами",
    difficulty: "hard",
    isContextual: false,
    description: `Дана строка \`s\` и целое число \`k\`. Найдите длину **наидлиннейшей подстроки**, содержащей **не более k** различных символов.

Примеры:
\`\`\`
lengthOfLongestSubstringKDistinct("eceba", 2)   // → 3  ("ece")
lengthOfLongestSubstringKDistinct("aa", 1)      // → 2
lengthOfLongestSubstringKDistinct("aabbcc", 1)  // → 2
lengthOfLongestSubstringKDistinct("aabbcc", 2)  // → 4  ("aabb" или "bbcc")
\`\`\``,
    functionName: "lengthOfLongestSubstringKDistinct",
    starterCode: `function lengthOfLongestSubstringKDistinct(s, k) {
  // ваш код
}`,
    testCases: [
      { id: "sw-h2-t1", inputDisplay: 'lengthOf...("eceba", 2)', inputArgs: ["eceba", 2], expected: 3 },
      { id: "sw-h2-t2", inputDisplay: 'lengthOf...("aa", 1)', inputArgs: ["aa", 1], expected: 2 },
      { id: "sw-h2-t3", inputDisplay: 'lengthOf...("aabbcc", 1)', inputArgs: ["aabbcc", 1], expected: 2 },
      { id: "sw-h2-t4", inputDisplay: 'lengthOf...("aabbcc", 2)', inputArgs: ["aabbcc", 2], expected: 4 },
      { id: "sw-h2-t5", inputDisplay: 'lengthOf...("abcabcabc", 3)', inputArgs: ["abcabcabc", 3], expected: 9 },
      { id: "sw-h2-t6", inputDisplay: 'lengthOf...("aabc", 2)', inputArgs: ["aabc", 2], expected: 3 },
    ],
    hints: [
      "Используйте скользящее окно с Map для подсчёта частот символов в текущем окне.",
      "Расширяйте правую границу. Когда map.size > k — сужайте левую: уменьшайте частоту s[left], при нуле удаляйте из Map.",
      "Максимум длины окна обновляйте только при map.size <= k.",
    ],
    solutionCode: `function lengthOfLongestSubstringKDistinct(s, k) {
  if (k === 0) return 0;
  const freq = new Map();
  let left = 0, maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    freq.set(c, (freq.get(c) ?? 0) + 1);

    while (freq.size > k) {
      const lc = s[left];
      freq.set(lc, freq.get(lc) - 1);
      if (freq.get(lc) === 0) freq.delete(lc);
      left++;
    }

    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}`,
  },
  {
    id: "sw-p5",
    topicId: "sliding-window",
    title: "Максимальная выручка за период",
    difficulty: "medium",
    isContextual: true,
    description:
      "Дан массив ежедневной выручки магазина и число days — длина отчётного периода. Найдите максимальную суммарную выручку за любой непрерывный период в days дней. Верните объект { startDay: number, total: number }, где startDay — индекс первого дня лучшего периода (0-based).",
    functionName: "bestPeriod",
    starterCode: `function bestPeriod(revenue, days) {
  // ваш код
}`,
    testCases: [
      {
        id: "sw-p5-t1",
        inputDisplay: "bestPeriod([100, 200, 150, 300, 250, 100], 3)",
        inputArgs: [[100, 200, 150, 300, 250, 100], 3],
        expected: { startDay: 2, total: 700 },
      },
      {
        id: "sw-p5-t2",
        inputDisplay: "bestPeriod([500], 1)",
        inputArgs: [[500], 1],
        expected: { startDay: 0, total: 500 },
      },
      {
        id: "sw-p5-t3",
        inputDisplay: "bestPeriod([10, 20, 30, 40], 2)",
        inputArgs: [[10, 20, 30, 40], 2],
        expected: { startDay: 2, total: 70 },
      },
      {
        id: "sw-p5-t4",
        inputDisplay: "bestPeriod([1, 1, 1, 1, 1], 5)",
        inputArgs: [[1, 1, 1, 1, 1], 5],
        expected: { startDay: 0, total: 5 },
      },
      {
        id: "sw-p5-t5",
        inputDisplay: "bestPeriod([50, 100, 50, 100, 50, 100], 4)",
        inputArgs: [[50, 100, 50, 100, 50, 100], 4],
        expected: { startDay: 0, total: 300 },
      },
    ],
    hints: [
      "Фиксированное окно размера days",
      "Отслеживайте не только maxSum но и startDay лучшего окна",
    ],
    solutionCode: `function bestPeriod(revenue, days) {
  let sum = 0;
  for (let i = 0; i < days; i++) {
    sum += revenue[i];
  }

  let maxSum = sum;
  let startDay = 0;

  for (let i = days; i < revenue.length; i++) {
    sum = sum + revenue[i] - revenue[i - days];
    if (sum > maxSum) {
      maxSum = sum;
      startDay = i - days + 1;
    }
  }

  return { startDay, total: maxSum };
}`,
  },
];
