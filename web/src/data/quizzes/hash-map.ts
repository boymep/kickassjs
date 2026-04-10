import type { TopicQuiz } from '../../types/quiz';

export const hashMapQuiz: TopicQuiz = {
  topicId: 'hash-map',
  questions: [
    // ===== EASY (1-6) =====
    {
      type: 'fill-blank',
      id: 'hm-q1',
      description:
        'Заполните пропуск в функции twoSum. Нужно вычислить дополнение (complement) текущего числа до target.',
      codeWithBlanks: `function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = ___;

    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }

  return [];
}`,
      options: ['target + nums[i]', 'target - nums[i]', 'target * nums[i]', 'nums[i] - target'],
      correctIndex: 1,
      explanation:
        'Нам нужно найти пару nums[j] + nums[i] = target. Значит, для текущего nums[i] мы ищем complement = target - nums[i]. Если такое значение уже есть в Map, пара найдена.',
    },
    {
      type: 'output',
      id: 'hm-q2',
      description: 'Что вернёт вызов twoSum([2, 7, 11, 15], 9)?',
      code: `function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }

  return [];
}

console.log(twoSum([2, 7, 11, 15], 9));`,
      options: ['[0, 1]', '[1, 0]', '[0, 2]', '[1, 2]'],
      correctIndex: 0,
      explanation:
        'Итерация 0: complement = 9 - 2 = 7, Map пуст — добавляем {2 => 0}. Итерация 1: complement = 9 - 7 = 2, Map содержит 2 => 0 — возвращаем [0, 1].',
    },
    {
      type: 'fill-blank',
      id: 'hm-q3',
      description:
        'Заполните пропуск в функции проверки анаграммы. После построения частотной Map по первой строке, для второй строки уменьшаем счётчики. Какое условие проверяем в конце?',
      codeWithBlanks: `function isAnagram(s1, s2) {
  if (s1.length !== s2.length) return false;

  const map = new Map();
  for (const ch of s1) {
    map.set(ch, (map.get(ch) || 0) + 1);
  }

  for (const ch of s2) {
    if (___) return false;
    map.set(ch, map.get(ch) - 1);
  }

  return true;
}`,
      options: [
        'map.has(ch)',
        '!map.has(ch) || map.get(ch) === 0',
        'map.get(ch) === undefined',
        'map.get(ch) < 0',
      ],
      correctIndex: 1,
      explanation:
        'Если символа нет в Map (!map.has(ch)) или его счётчик уже 0 (map.get(ch) === 0), значит, во второй строке этот символ встречается чаще, чем в первой — строки не анаграммы.',
    },
    {
      type: 'tracing',
      id: 'hm-q4',
      description:
        'Проследите выполнение twoSum([3, 2, 4], 6). На какой итерации найдётся ответ?',
      code: `function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }

  return [];
}

console.log(twoSum([3, 2, 4], 6));`,
      steps: [
        { label: 'i=0, nums[i]=3', variables: { complement: 3, mapKeys: '(пусто)', result: 'нет' } },
        { label: 'i=0, добавляем', variables: { mapKeys: '3=>0', result: 'нет' } },
        { label: 'i=1, nums[i]=2', variables: { complement: 4, mapKeys: '3=>0', result: 'нет' } },
        { label: 'i=1, добавляем', variables: { mapKeys: '3=>0, 2=>1', result: 'нет' } },
        { label: 'i=2, nums[i]=4', variables: { complement: 2, mapKeys: '3=>0, 2=>1', result: '[1, 2]' } },
      ],
      question: 'На какой итерации (значение i) найдётся ответ?',
      options: ['0', '1', '2', 'Ответ не найдётся'],
      correctIndex: 2,
      explanation:
        'На итерации i=0: complement=3, Map пуст. На i=1: complement=4, Map={3=>0}, нет 4. На i=2: complement=2, Map={3=>0, 2=>1} — 2 найдено! Возвращаем [1, 2].',
    },
    {
      type: 'complexity',
      id: 'hm-q5',
      description:
        'Какова временная сложность подсчёта частот n элементов с помощью Map?',
      code: `function countFrequencies(arr) {
  const freq = new Map();

  for (const item of arr) {
    freq.set(item, (freq.get(item) || 0) + 1);
  }

  return freq;
}`,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
      correctIndex: 2,
      explanation:
        'Мы проходим по массиву один раз (n итераций). На каждой итерации выполняем Map.get и Map.set — обе операции O(1) в среднем. Итого: O(n).',
    },
    {
      type: 'output',
      id: 'hm-q6',
      description: 'Что вернёт выражение new Map([[1, "a"], [1, "b"]]).size?',
      code: `const map = new Map([[1, "a"], [1, "b"]]);
console.log(map.size);`,
      options: ['0', '1', '2', 'Error'],
      correctIndex: 1,
      explanation:
        'Map хранит уникальные ключи. При создании из массива пар с одинаковым ключом (1) второе значение ("b") перезаписывает первое ("a"). Результат: Map { 1 => "b" }, size = 1.',
    },

    // ===== INTERMEDIATE (7-11) =====
    {
      type: 'fill-blank',
      id: 'hm-q7',
      description:
        'Группировка анаграмм: для каждого слова нужно сгенерировать ключ, по которому анаграммы попадут в одну группу. Заполните пропуск — как создать ключ?',
      codeWithBlanks: `function groupAnagrams(strs) {
  const map = new Map();

  for (const s of strs) {
    const key = ___;

    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }

  return [...map.values()];
}`,
      options: [
        's.length.toString()',
        's.split("").sort().join("")',
        's.split("").reverse().join("")',
        's.toLowerCase()',
      ],
      correctIndex: 1,
      explanation:
        'Все анаграммы состоят из одних и тех же букв. Если отсортировать буквы каждого слова, анаграммы дадут одинаковую строку. Например, "eat" и "tea" оба дают "aet". Это и будет ключом группы.',
    },
    {
      type: 'tracing',
      id: 'hm-q8',
      description:
        'Проследите работу функции подсчёта количества подмассивов с суммой k, используя префиксные суммы и Map. Вход: nums = [1, 1, 1], k = 2.',
      code: `function subarraySum(nums, k) {
  const map = new Map([[0, 1]]);
  let sum = 0;
  let count = 0;

  for (const num of nums) {
    sum += num;
    if (map.has(sum - k)) {
      count += map.get(sum - k);
    }
    map.set(sum, (map.get(sum) || 0) + 1);
  }

  return count;
}

console.log(subarraySum([1, 1, 1], 2));`,
      steps: [
        { label: 'Начало', variables: { sum: 0, count: 0, map: '{0=>1}' } },
        { label: 'num=1', variables: { sum: 1, 'sum-k': -1, count: 0, map: '{0=>1, 1=>1}' } },
        { label: 'num=1', variables: { sum: 2, 'sum-k': 0, count: 1, map: '{0=>1, 1=>1, 2=>1}' } },
        { label: 'num=1', variables: { sum: 3, 'sum-k': 1, count: 2, map: '{0=>1, 1=>1, 2=>1, 3=>1}' } },
      ],
      question: 'Какое значение count вернёт функция?',
      options: ['0', '1', '2', '3'],
      correctIndex: 2,
      explanation:
        'Подмассивы с суммой 2: [1,1] (индексы 0-1) и [1,1] (индексы 1-2). На шаге sum=2 находим sum-k=0 в Map (count=1). На шаге sum=3 находим sum-k=1 в Map (count=2). Ответ: 2.',
    },
    {
      type: 'output',
      id: 'hm-q9',
      description:
        'Частотный подсчёт: что выведет код, если во входном массиве есть undefined и null?',
      code: `const arr = [1, null, undefined, null, 1, undefined];
const freq = new Map();

for (const item of arr) {
  freq.set(item, (freq.get(item) || 0) + 1);
}

console.log(freq.get(null), freq.get(undefined));`,
      options: ['2 2', 'NaN NaN', 'undefined undefined', 'Error'],
      correctIndex: 0,
      explanation:
        'Map в JavaScript может использовать любые значения в качестве ключей, включая null и undefined. null встречается 2 раза, undefined — тоже 2. Выведется "2 2".',
    },
    {
      type: 'output',
      id: 'hm-q10',
      description:
        'Map vs Set: что выведет этот код, использующий Set для удаления дубликатов и Map для подсчёта уникальных?',
      code: `const nums = [3, 1, 2, 3, 1, 4];
const unique = new Set(nums);
const freq = new Map();

for (const n of nums) {
  freq.set(n, (freq.get(n) || 0) + 1);
}

const onlyOnce = [...freq.entries()]
  .filter(([_, v]) => v === 1)
  .map(([k]) => k);

console.log(unique.size, onlyOnce);`,
      options: [
        '4 [2, 4]',
        '6 [2, 4]',
        '4 [3, 1, 2, 4]',
        '4 [1, 2]',
      ],
      correctIndex: 0,
      explanation:
        'Set хранит уникальные значения: {3, 1, 2, 4}, size = 4. В Map: 3=>2, 1=>2, 2=>1, 4=>1. Фильтруем те, что встречаются ровно 1 раз: [2, 4].',
    },
    {
      type: 'complexity',
      id: 'hm-q11',
      description:
        'Какова временная сложность группировки n строк-анаграмм, если максимальная длина строки — m?',
      code: `function groupAnagrams(strs) {
  const map = new Map();

  for (const s of strs) {
    const key = s.split("").sort().join("");

    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }

  return [...map.values()];
}`,
      options: ['O(n)', 'O(n * m)', 'O(n * m * log(m))', 'O(n^2)'],
      correctIndex: 2,
      explanation:
        'Для каждой из n строк мы выполняем сортировку символов за O(m * log(m)), где m — длина строки. Операции с Map — O(1) в среднем (ключ сравнивается за O(m), но хеширование строки тоже O(m)). Итого доминирует O(n * m * log(m)).',
    },

    // ===== HARDER MIDDLE (12-16) =====
    {
      type: 'tracing',
      id: 'hm-q12',
      description:
        'Проследите выполнение функции subarraySum для массива с отрицательными числами. Вход: nums = [1, -1, 1, 1], k = 2.',
      code: `function subarraySum(nums, k) {
  const map = new Map([[0, 1]]);
  let sum = 0;
  let count = 0;

  for (const num of nums) {
    sum += num;
    if (map.has(sum - k)) {
      count += map.get(sum - k);
    }
    map.set(sum, (map.get(sum) || 0) + 1);
  }

  return count;
}

console.log(subarraySum([1, -1, 1, 1], 2));`,
      steps: [
        { label: 'Начало', variables: { sum: 0, count: 0, map: '{0=>1}' } },
        { label: 'num=1', variables: { sum: 1, 'sum-k': -1, count: 0, map: '{0=>1, 1=>1}' } },
        { label: 'num=-1', variables: { sum: 0, 'sum-k': -2, count: 0, map: '{0=>2, 1=>1}' } },
        { label: 'num=1', variables: { sum: 1, 'sum-k': -1, count: 0, map: '{0=>2, 1=>2}' } },
        { label: 'num=1', variables: { sum: 2, 'sum-k': 0, count: 2, map: '{0=>2, 1=>2, 2=>1}' } },
      ],
      question: 'Какое значение count вернёт функция?',
      options: ['0', '1', '2', '3'],
      correctIndex: 2,
      explanation:
        'На последнем шаге sum=2, sum-k=0. В Map ключ 0 имеет значение 2 (префиксная сумма 0 встречалась дважды — в начале и после [1,-1]). Это значит, есть 2 подмассива с суммой 2: [1,-1,1,1] и [1,1]. Ответ: count = 2.',
    },
    {
      type: 'fill-blank',
      id: 'hm-q13',
      description:
        'Функция находит длину самой длинной последовательности подряд идущих чисел (Longest Consecutive Sequence). Заполните пропуск — с какого условия начинаем отсчёт новой последовательности?',
      codeWithBlanks: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let longest = 0;

  for (const num of set) {
    if (___) {
      let length = 1;
      let current = num;

      while (set.has(current + 1)) {
        current++;
        length++;
      }

      longest = Math.max(longest, length);
    }
  }

  return longest;
}`,
      options: [
        'set.has(num + 1)',
        '!set.has(num - 1)',
        'num === Math.min(...set)',
        'set.size > 1',
      ],
      correctIndex: 1,
      explanation:
        'Мы начинаем отсчёт новой последовательности только если num является её началом, т.е. num-1 отсутствует в Set. Это гарантирует, что каждая последовательность обрабатывается ровно один раз, давая O(n) общую сложность.',
    },
    {
      type: 'output',
      id: 'hm-q14',
      description:
        'twoSum с дубликатами: что вернёт функция для массива, где target — сумма двух одинаковых элементов?',
      code: `function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }

  return [];
}

console.log(twoSum([3, 3], 6));`,
      options: ['[0, 0]', '[0, 1]', '[1, 1]', '[]'],
      correctIndex: 1,
      explanation:
        'Итерация i=0: complement = 6 - 3 = 3, Map пуст — добавляем {3 => 0}. Итерация i=1: complement = 6 - 3 = 3, Map содержит 3 => 0 — возвращаем [0, 1]. Алгоритм корректно обрабатывает дубликаты, так как проверка идёт до записи текущего элемента.',
    },
    {
      type: 'output',
      id: 'hm-q15',
      description:
        'Map сохраняет порядок вставки. Что выведет этот код, демонстрирующий порядок итерации?',
      code: `const map = new Map();
map.set('b', 2);
map.set('a', 1);
map.set('c', 3);
map.delete('b');
map.set('b', 4);

const keys = [...map.keys()];
console.log(keys);`,
      options: [
        '["a", "b", "c"]',
        '["b", "a", "c"]',
        '["a", "c", "b"]',
        '["c", "b", "a"]',
      ],
      correctIndex: 2,
      explanation:
        'Map сохраняет порядок вставки. Добавляем b, a, c. Удаляем b — остаётся a, c. Добавляем b заново — он вставляется в конец. Итого порядок ключей: ["a", "c", "b"].',
    },
    {
      type: 'fill-blank',
      id: 'hm-q16',
      description:
        'Функция находит пересечение двух массивов с учётом количества повторений. Заполните пропуск — какое условие нужно проверить перед добавлением элемента в результат?',
      codeWithBlanks: `function intersect(nums1, nums2) {
  const map = new Map();

  for (const n of nums1) {
    map.set(n, (map.get(n) || 0) + 1);
  }

  const result = [];

  for (const n of nums2) {
    if (___) {
      result.push(n);
      map.set(n, map.get(n) - 1);
    }
  }

  return result;
}`,
      options: [
        'map.has(n)',
        'map.get(n) > 0',
        'map.get(n) >= 1 && result.length < nums1.length',
        'map.get(n) !== undefined',
      ],
      correctIndex: 1,
      explanation:
        'Проверяем map.get(n) > 0, а не просто map.has(n), потому что после каждого совпадения мы уменьшаем счётчик на 1. Если счётчик стал 0, значит все вхождения этого числа из nums1 уже использованы, и больше добавлять в результат не нужно.',
    },
  ],
};
