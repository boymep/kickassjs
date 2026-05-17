import type { Problem } from '../../types/problem';

export const hashMapProblems: Problem[] = [
  {
    id: 'hm-p1',
    topicId: 'hash-map',
    title: 'Two Sum',
    difficulty: 'easy',
    isContextual: false,
    description:
      'Дан массив целых чисел `nums` и целое число `target`. Верните индексы двух элементов, сумма которых равна `target`.\n\nМожно считать, что каждый вход имеет ровно одно решение, и нельзя использовать один и тот же элемент дважды.\n\nВерните массив из двух индексов `[i, j]`, где `i < j`.',
    functionName: 'twoSum',
    starterCode: `function twoSum(nums, target) {
  // ваш код
}`,
    testCases: [
      {
        id: 'hm-p1-t1',
        inputDisplay: 'twoSum([2, 7, 11, 15], 9)',
        inputArgs: [[2, 7, 11, 15], 9],
        expected: [0, 1],
      },
      {
        id: 'hm-p1-t2',
        inputDisplay: 'twoSum([3, 2, 4], 6)',
        inputArgs: [[3, 2, 4], 6],
        expected: [1, 2],
      },
      {
        id: 'hm-p1-t3',
        inputDisplay: 'twoSum([3, 3], 6)',
        inputArgs: [[3, 3], 6],
        expected: [0, 1],
      },
      {
        id: 'hm-p1-t4',
        inputDisplay: 'twoSum([1, 5, 3, 7, 2], 9)',
        inputArgs: [[1, 5, 3, 7, 2], 9],
        expected: [3, 4],
      },
      {
        id: 'hm-p1-t5',
        inputDisplay: 'twoSum([-1, -2, -3, -4, -5], -8)',
        inputArgs: [[-1, -2, -3, -4, -5], -8],
        expected: [2, 4],
      },
    ],
    hints: [
      'Наивный подход — два вложенных цикла O(n²). Можно ли лучше?',
      'Используйте Map для хранения уже просмотренных элементов и их индексов.',
      'Для текущего nums[i] вычислите complement = target - nums[i] и проверьте, есть ли complement в Map.',
    ],
    solutionCode: `function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement), i];
    }

    map.set(nums[i], i);
  }

  return [];
}`,
  },
  {
    id: 'hm-p2',
    topicId: 'hash-map',
    title: 'Проверка анаграммы',
    difficulty: 'easy',
    isContextual: false,
    description:
      'Даны две строки `s` и `t`. Определите, является ли `t` анаграммой `s`.\n\nАнаграмма — это слово, полученное перестановкой букв другого слова. Обе строки состоят только из строчных латинских букв.\n\nВерните `true`, если строки являются анаграммами, и `false` в противном случае.',
    functionName: 'isAnagram',
    starterCode: `function isAnagram(s, t) {
  // ваш код
}`,
    testCases: [
      {
        id: 'hm-p2-t1',
        inputDisplay: 'isAnagram("anagram", "nagaram")',
        inputArgs: ['anagram', 'nagaram'],
        expected: true,
      },
      {
        id: 'hm-p2-t2',
        inputDisplay: 'isAnagram("rat", "car")',
        inputArgs: ['rat', 'car'],
        expected: false,
      },
      {
        id: 'hm-p2-t3',
        inputDisplay: 'isAnagram("listen", "silent")',
        inputArgs: ['listen', 'silent'],
        expected: true,
      },
      {
        id: 'hm-p2-t4',
        inputDisplay: 'isAnagram("hello", "world")',
        inputArgs: ['hello', 'world'],
        expected: false,
      },
      {
        id: 'hm-p2-t5',
        inputDisplay: 'isAnagram("a", "a")',
        inputArgs: ['a', 'a'],
        expected: true,
      },
      {
        id: 'hm-p2-t6',
        inputDisplay: 'isAnagram("ab", "a")',
        inputArgs: ['ab', 'a'],
        expected: false,
      },
    ],
    hints: [
      'Если строки разной длины — они точно не анаграммы.',
      'Подсчитайте частоту каждого символа в первой строке с помощью Map.',
      'Пройдите по второй строке и уменьшайте счётчики. Если символа нет или счётчик стал отрицательным — не анаграмма.',
    ],
    solutionCode: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;

  const freq = new Map();

  for (const ch of s) {
    freq.set(ch, (freq.get(ch) || 0) + 1);
  }

  for (const ch of t) {
    if (!freq.has(ch) || freq.get(ch) === 0) return false;
    freq.set(ch, freq.get(ch) - 1);
  }

  return true;
}`,
  },
  {
    id: 'hm-p3',
    topicId: 'hash-map',
    title: 'Чемпионы шагов',
    difficulty: 'medium',
    isContextual: true,
    description:
      'В компании проходит корпоративный челлендж по шагам. Каждый день фиксируются результаты участников — количество пройденных шагов.\n\nДан массив `days`, где каждый элемент — это массив объектов `{ userId: number, steps: number }`, представляющий результаты за один день.\n\nНужно найти чемпионов — пользователей, которые:\n1. Участвовали **каждый** день (имеют запись в каждом дне).\n2. Среди таких пользователей набрали **максимальное** суммарное количество шагов за все дни.\n\nВерните объект `{ userIds: number[], steps: number }`, где `userIds` — отсортированный по возрастанию массив id чемпионов, а `steps` — их суммарное количество шагов. Если несколько пользователей набрали одинаковое максимальное количество, верните всех.',
    functionName: 'findChampions',
    starterCode: `function findChampions(days) {
  // ваш код
}`,
    testCases: [
      {
        id: 'hm-p3-t1',
        inputDisplay:
          'findChampions([[{userId:1,steps:1000},{userId:2,steps:1500}],[{userId:2,steps:1000}]])',
        inputArgs: [
          [
            [
              { userId: 1, steps: 1000 },
              { userId: 2, steps: 1500 },
            ],
            [{ userId: 2, steps: 1000 }],
          ],
        ],
        expected: { userIds: [2], steps: 2500 },
      },
      {
        id: 'hm-p3-t2',
        inputDisplay:
          'findChampions([[{userId:1,steps:2000},{userId:3,steps:1500}],[{userId:2,steps:4000},{userId:1,steps:3500}]])',
        inputArgs: [
          [
            [
              { userId: 1, steps: 2000 },
              { userId: 3, steps: 1500 },
            ],
            [
              { userId: 2, steps: 4000 },
              { userId: 1, steps: 3500 },
            ],
          ],
        ],
        expected: { userIds: [1], steps: 5500 },
      },
      {
        id: 'hm-p3-t3',
        inputDisplay:
          'findChampions([[{userId:1,steps:3000},{userId:2,steps:3000}],[{userId:1,steps:2000},{userId:2,steps:2000}]])',
        inputArgs: [
          [
            [
              { userId: 1, steps: 3000 },
              { userId: 2, steps: 3000 },
            ],
            [
              { userId: 1, steps: 2000 },
              { userId: 2, steps: 2000 },
            ],
          ],
        ],
        expected: { userIds: [1, 2], steps: 5000 },
      },
      {
        id: 'hm-p3-t4',
        inputDisplay: 'findChampions([[{userId:1,steps:5000}]])',
        inputArgs: [[[{ userId: 1, steps: 5000 }]]],
        expected: { userIds: [1], steps: 5000 },
      },
      {
        id: 'hm-p3-t5',
        inputDisplay:
          'findChampions([[{userId:1,steps:500},{userId:2,steps:1000}],[{userId:1,steps:500},{userId:3,steps:2000}],[{userId:1,steps:500},{userId:2,steps:800}]])',
        inputArgs: [
          [
            [
              { userId: 1, steps: 500 },
              { userId: 2, steps: 1000 },
            ],
            [
              { userId: 1, steps: 500 },
              { userId: 3, steps: 2000 },
            ],
            [
              { userId: 1, steps: 500 },
              { userId: 2, steps: 800 },
            ],
          ],
        ],
        expected: { userIds: [1], steps: 1500 },
      },
    ],
    hints: [
      'Используйте Map для подсчёта суммарных шагов (userId => totalSteps) и Map для подсчёта дней участия (userId => daysCount).',
      'Пройдите по каждому дню и каждому участнику — обновите обе Map.',
      'Отфильтруйте пользователей, у которых daysCount === days.length.',
      'Среди отфильтрованных найдите максимум шагов и соберите всех с таким результатом.',
    ],
    solutionCode: `function findChampions(days) {
  const totalSteps = new Map();
  const daysCount = new Map();
  const totalDays = days.length;

  for (const day of days) {
    for (const { userId, steps } of day) {
      totalSteps.set(userId, (totalSteps.get(userId) || 0) + steps);
      daysCount.set(userId, (daysCount.get(userId) || 0) + 1);
    }
  }

  let maxSteps = 0;
  let champions = [];

  for (const [userId, count] of daysCount) {
    if (count === totalDays) {
      const steps = totalSteps.get(userId);
      if (steps > maxSteps) {
        maxSteps = steps;
        champions = [userId];
      } else if (steps === maxSteps) {
        champions.push(userId);
      }
    }
  }

  return { userIds: champions.sort((a, b) => a - b), steps: maxSteps };
}`,
  },
  {
    id: 'hm-p4',
    topicId: 'hash-map',
    title: 'Подсчёт уникальных посетителей',
    difficulty: 'easy',
    isContextual: true,
    description:
      'Дан массив логов визитов — каждый элемент это userId (число). Один пользователь может посетить сайт несколько раз. Верните количество уникальных посетителей.',
    functionName: 'countUnique',
    starterCode: `function countUnique(visits) {
  // ваш код
}`,
    testCases: [
      {
        id: 'hm-p4-t1',
        inputDisplay: 'countUnique([1, 2, 3, 1, 2])',
        inputArgs: [[1, 2, 3, 1, 2]],
        expected: 3,
      },
      {
        id: 'hm-p4-t2',
        inputDisplay: 'countUnique([1, 1, 1])',
        inputArgs: [[1, 1, 1]],
        expected: 1,
      },
      {
        id: 'hm-p4-t3',
        inputDisplay: 'countUnique([])',
        inputArgs: [[]],
        expected: 0,
      },
      {
        id: 'hm-p4-t4',
        inputDisplay: 'countUnique([5])',
        inputArgs: [[5]],
        expected: 1,
      },
      {
        id: 'hm-p4-t5',
        inputDisplay: 'countUnique([1, 2, 3, 4, 5])',
        inputArgs: [[1, 2, 3, 4, 5]],
        expected: 5,
      },
    ],
    hints: [
      'Set хранит только уникальные значения',
      'Можно использовать Set или Map',
    ],
    solutionCode: `function countUnique(visits) {
  return new Set(visits).size;
}`,
  },
  {
    id: 'hm-p5',
    topicId: 'hash-map',
    title: 'Группировка объявлений по категориям',
    difficulty: 'medium',
    isContextual: true,
    description:
      'Дан массив объявлений, каждое — объект { id: number, category: string }. Сгруппируйте объявления по категориям. Верните объект, где ключ — категория, значение — массив id объявлений этой категории (в порядке появления).',
    functionName: 'groupByCategory',
    starterCode: `function groupByCategory(ads) {
  // ваш код
}`,
    testCases: [
      {
        id: 'hm-p5-t1',
        inputDisplay:
          'groupByCategory([{id:1,category:"авто"},{id:2,category:"недвижимость"},{id:3,category:"авто"}])',
        inputArgs: [
          [
            { id: 1, category: 'авто' },
            { id: 2, category: 'недвижимость' },
            { id: 3, category: 'авто' },
          ],
        ],
        expected: { 'авто': [1, 3], 'недвижимость': [2] },
      },
      {
        id: 'hm-p5-t2',
        inputDisplay: 'groupByCategory([])',
        inputArgs: [[]],
        expected: {},
      },
      {
        id: 'hm-p5-t3',
        inputDisplay:
          'groupByCategory([{id:10,category:"электроника"}])',
        inputArgs: [[{ id: 10, category: 'электроника' }]],
        expected: { 'электроника': [10] },
      },
      {
        id: 'hm-p5-t4',
        inputDisplay:
          'groupByCategory([{id:1,category:"а"},{id:2,category:"б"},{id:3,category:"в"},{id:4,category:"а"},{id:5,category:"б"}])',
        inputArgs: [
          [
            { id: 1, category: 'а' },
            { id: 2, category: 'б' },
            { id: 3, category: 'в' },
            { id: 4, category: 'а' },
            { id: 5, category: 'б' },
          ],
        ],
        expected: { 'а': [1, 4], 'б': [2, 5], 'в': [3] },
      },
      {
        id: 'hm-p5-t5',
        inputDisplay:
          'groupByCategory([{id:1,category:"x"},{id:2,category:"x"},{id:3,category:"x"}])',
        inputArgs: [
          [
            { id: 1, category: 'x' },
            { id: 2, category: 'x' },
            { id: 3, category: 'x' },
          ],
        ],
        expected: { x: [1, 2, 3] },
      },
    ],
    hints: [
      'Создайте Map или объект для группировки',
      'Для каждого объявления добавляйте id в массив соответствующей категории',
    ],
    solutionCode: `function groupByCategory(ads) {
  const groups = {};

  for (const ad of ads) {
    if (!groups[ad.category]) {
      groups[ad.category] = [];
    }
    groups[ad.category].push(ad.id);
  }

  return groups;
}`,
  },
  {
    id: 'hm-p6',
    topicId: 'hash-map',
    kind: 'predict-output',
    title: 'Что выведет код с Map и Set?',
    difficulty: 'medium',
    isContextual: false,
    description:
      'Перед вами фрагмент кода, использующий Map и Set с разными типами ключей. Что попадёт в stdout?\n\nПодсказка: вспомните, как Map сравнивает ключи (SameValueZero) и принимает ли Set значение `NaN`.',
    code: `const map = new Map();
map.set(1, 'number-one');
map.set('1', 'string-one');
map.set(NaN, 'not-a-number');
map.set(NaN, 'still-not-a-number');

const set = new Set([1, '1', NaN, NaN, +0, -0]);

console.log(map.size);
console.log(map.get(NaN));
console.log(set.size);`,
    expected: '3\nstill-not-a-number\n4',
    hints: [
      'Map различает ключи 1 и "1" — это разные типы.',
      'Map использует SameValueZero: NaN считается равным NaN, поэтому второй set перезаписывает первый.',
      'Set: +0 и -0 — один элемент по SameValueZero. NaN — единственный, остальные — 1, "1".',
    ],
    solutionCode: `// map: { 1 => 'number-one', '1' => 'string-one', NaN => 'still-not-a-number' }
// → size = 3, get(NaN) = 'still-not-a-number'
// set: { 1, '1', NaN, 0 } — +0 и -0 это один элемент
// → size = 4`,
  },
  {
    id: 'hm-p7',
    topicId: 'hash-map',
    kind: 'find-bug',
    title: 'Баг: Map с объектным ключом',
    difficulty: 'medium',
    isContextual: false,
    description:
      'Функция `findUserSession` должна вернуть `sessionId` пользователя по объекту-ключу. Но тесты падают: каждый раз возвращается `undefined`.\n\nНайдите баг и исправьте функцию так, чтобы поиск по совпадающему `userId` работал. Сигнатура и поведение должны остаться прежними: на вход — массив записей `{ user: { id }, sessionId }` и искомый объект `query`. На выход — найденный `sessionId` или `null`.\n\nПодсказка: подумайте, как Map сравнивает объектные ключи.',
    functionName: 'findUserSession',
    buggyCode: `function findUserSession(records, query) {
  const sessions = new Map();

  for (const { user, sessionId } of records) {
    sessions.set(user, sessionId);
  }

  return sessions.get(query) ?? null;
}`,
    bugSummary:
      'Map сравнивает объектные ключи по ссылке (SameValueZero). \`query\` и \`user\` из records — разные объекты, даже если у них одинаковый \`id\`. Чтобы сравнение шло по содержимому, нужно использовать \`user.id\` как ключ, а не сам объект.',
    testCases: [
      {
        id: 'hm-p7-t1',
        inputDisplay:
          "findUserSession([{user:{id:1},sessionId:'A'},{user:{id:2},sessionId:'B'}], {id:1})",
        inputArgs: [
          [
            { user: { id: 1 }, sessionId: 'A' },
            { user: { id: 2 }, sessionId: 'B' },
          ],
          { id: 1 },
        ],
        expected: 'A',
      },
      {
        id: 'hm-p7-t2',
        inputDisplay:
          "findUserSession([{user:{id:1},sessionId:'A'},{user:{id:2},sessionId:'B'}], {id:2})",
        inputArgs: [
          [
            { user: { id: 1 }, sessionId: 'A' },
            { user: { id: 2 }, sessionId: 'B' },
          ],
          { id: 2 },
        ],
        expected: 'B',
      },
      {
        id: 'hm-p7-t3',
        inputDisplay: 'findUserSession([], {id:1})',
        inputArgs: [[], { id: 1 }],
        expected: null,
      },
      {
        id: 'hm-p7-t4',
        inputDisplay:
          "findUserSession([{user:{id:42},sessionId:'X'}], {id:99})",
        inputArgs: [[{ user: { id: 42 }, sessionId: 'X' }], { id: 99 }],
        expected: null,
      },
      {
        id: 'hm-p7-t5',
        inputDisplay:
          "findUserSession([{user:{id:7},sessionId:'first'},{user:{id:7},sessionId:'second'}], {id:7})",
        inputArgs: [
          [
            { user: { id: 7 }, sessionId: 'first' },
            { user: { id: 7 }, sessionId: 'second' },
          ],
          { id: 7 },
        ],
        expected: 'second',
      },
    ],
    hints: [
      'Запустите код в голове: какой ключ записывает Map? Какой ключ ищется?',
      'Объект `{id:1}` из records и объект `{id:1}` из query — это две разных ссылки.',
      'Map сравнивает ключи через SameValueZero: для объектов это сравнение по ссылке.',
      'Решение — использовать примитивный ключ. Например, `user.id`.',
    ],
    solutionCode: `function findUserSession(records, query) {
  const sessions = new Map();

  for (const { user, sessionId } of records) {
    sessions.set(user.id, sessionId);
  }

  return sessions.get(query.id) ?? null;
}`,
  },
  {
    id: 'hm-p8',
    topicId: 'hash-map',
    kind: 'refactor',
    title: 'Refactor: пары с заданной разностью за O(n)',
    difficulty: 'medium',
    isContextual: false,
    description:
      'Функция `countPairsWithDiff(nums, k)` должна вернуть количество пар индексов `(i, j)` таких, что `i < j` и `|nums[i] - nums[j]| === k`. В массиве могут быть дубликаты.\n\nТекущая реализация работает за O(n²) — вложенный цикл. На входе из 100 000 элементов это уже не проходит по времени.\n\n**Задача:** перепишите функцию через Map (или Set) так, чтобы она работала за O(n). Подсказка: для каждого числа нас интересуют только два «соседа» — `num + k` и `num - k`. Если построить частотный Map за один проход и второй проход проверять наличие соседей, получится O(n).',
    functionName: 'countPairsWithDiff',
    starterCode: `function countPairsWithDiff(nums, k) {
  let count = 0;

  // O(n^2): вложенный цикл
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (Math.abs(nums[i] - nums[j]) === k) {
        count++;
      }
    }
  }

  return count;
}`,
    testCases: [
      {
        id: 'hm-p8-t1',
        inputDisplay: 'countPairsWithDiff([1, 5, 3, 4, 2], 2)',
        inputArgs: [[1, 5, 3, 4, 2], 2],
        expected: 3,
      },
      {
        id: 'hm-p8-t2',
        inputDisplay: 'countPairsWithDiff([1, 1, 1, 1], 0)',
        inputArgs: [[1, 1, 1, 1], 0],
        expected: 6,
      },
      {
        id: 'hm-p8-t3',
        inputDisplay: 'countPairsWithDiff([1, 2, 3], 5)',
        inputArgs: [[1, 2, 3], 5],
        expected: 0,
      },
      {
        id: 'hm-p8-t4',
        inputDisplay: 'countPairsWithDiff([3, 1, 4, 1, 5], 2)',
        inputArgs: [[3, 1, 4, 1, 5], 2],
        expected: 3,
      },
      {
        id: 'hm-p8-t5',
        inputDisplay: 'countPairsWithDiff([], 1)',
        inputArgs: [[], 1],
        expected: 0,
      },
    ],
    perfTest: {
      // 100k элементов, k=1 — вложенный цикл не уложится в 50ms.
      inputArgs: [
        Array.from({ length: 100_000 }, (_, i) => i % 1000),
        1,
      ],
      maxMs: 50,
    },
    hints: [
      'Для каждого num нас интересуют только num+k и num-k — кандидаты в пары.',
      'Сначала постройте частотный Map: значение → количество вхождений.',
      'Если k === 0, считайте пары внутри одной группы по формуле C(n, 2) = n*(n-1)/2.',
      'Если k > 0, для каждого ключа добавляйте `freq[key] * (freq[key + k] || 0)` — каждая пара считается ровно один раз.',
    ],
    solutionCode: `function countPairsWithDiff(nums, k) {
  const freq = new Map();
  for (const n of nums) {
    freq.set(n, (freq.get(n) || 0) + 1);
  }

  let count = 0;

  if (k === 0) {
    // Пары одинаковых: C(n, 2) = n*(n-1)/2 в каждой группе.
    for (const c of freq.values()) {
      count += (c * (c - 1)) / 2;
    }
    return count;
  }

  // k > 0: для каждого num считаем пары (num, num + k).
  for (const [num, c] of freq) {
    const partner = freq.get(num + k);
    if (partner) count += c * partner;
  }

  return count;
}`,
  },
  {
    id: 'hm-h1',
    topicId: 'hash-map',
    kind: 'implement',
    title: 'Длиннейшая последовательная цепочка — O(n)',
    difficulty: 'hard',
    isContextual: false,
    description: `Дан неотсортированный массив целых чисел \`nums\`. Найдите длину **длиннейшей последовательной цепочки** (consecutive sequence).

Например, в \`[100, 4, 200, 1, 3, 2]\` цепочка \`1, 2, 3, 4\` имеет длину **4**.

**Решение должно работать за O(n)** — без сортировки!

Примеры:
\`\`\`
longestConsecutive([100, 4, 200, 1, 3, 2])           // → 4
longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])  // → 9
longestConsecutive([1])                               // → 1
longestConsecutive([])                                // → 0
\`\`\``,
    functionName: 'longestConsecutive',
    starterCode: `function longestConsecutive(nums) {
  // ваш код — только O(n), без сортировки!
}`,
    testCases: [
      { id: 'hm-h1-t1', inputDisplay: 'longestConsecutive([100,4,200,1,3,2])', inputArgs: [[100, 4, 200, 1, 3, 2]], expected: 4 },
      { id: 'hm-h1-t2', inputDisplay: 'longestConsecutive([0,3,7,2,5,8,4,6,0,1])', inputArgs: [[0,3,7,2,5,8,4,6,0,1]], expected: 9 },
      { id: 'hm-h1-t3', inputDisplay: 'longestConsecutive([1])', inputArgs: [[1]], expected: 1 },
      { id: 'hm-h1-t4', inputDisplay: 'longestConsecutive([])', inputArgs: [[]], expected: 0 },
      { id: 'hm-h1-t5', inputDisplay: 'longestConsecutive([1,2,0,1])', inputArgs: [[1,2,0,1]], expected: 3 },
    ],
    hints: [
      'Поместите все числа в Set. Это позволит проверять наличие числа за O(1).',
      'Для каждого числа n: если n-1 НЕТ в Set — это начало цепочки. Начните считать длину, пока n+1 есть в Set.',
      'Каждый элемент входит ровно в одну цепочку, поэтому суммарная сложность O(n).',
    ],
    solutionCode: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let maxLen = 0;

  for (const n of set) {
    if (set.has(n - 1)) continue; // не начало цепочки

    let cur = n, len = 1;
    while (set.has(cur + 1)) { cur++; len++; }
    maxLen = Math.max(maxLen, len);
  }

  return maxLen;
}`,
  },
  {
    id: 'hm-h2',
    topicId: 'hash-map',
    kind: 'implement',
    title: 'Подмассивы с нулевой суммой — найти все',
    difficulty: 'hard',
    isContextual: false,
    description: `Дан массив целых чисел \`nums\` (могут быть отрицательные). Найдите **все подмассивы с нулевой суммой** и верните массив пар \`[start, end]\` (включительно, 0-based), упорядоченных по start, затем по end.

Если таких подмассивов нет — верните пустой массив.

Примеры:
\`\`\`
findZeroSumSubarrays([1, -1, 2, -2])   // → [[0,1], [0,3], [2,3]]
findZeroSumSubarrays([1, 2, 3])         // → []
findZeroSumSubarrays([0])               // → [[0,0]]
\`\`\``,
    functionName: 'findZeroSumSubarrays',
    starterCode: `function findZeroSumSubarrays(nums) {
  // ваш код
}`,
    testCases: [
      {
        id: 'hm-h2-t1',
        inputDisplay: 'findZeroSumSubarrays([1,-1,2,-2])',
        inputArgs: [[1, -1, 2, -2]],
        expected: [[0,1],[0,3],[2,3]],
      },
      {
        id: 'hm-h2-t2',
        inputDisplay: 'findZeroSumSubarrays([1,2,3]) → []',
        inputArgs: [[1, 2, 3]],
        expected: [],
      },
      {
        id: 'hm-h2-t3',
        inputDisplay: 'findZeroSumSubarrays([0])',
        inputArgs: [[0]],
        expected: [[0,0]],
      },
      {
        id: 'hm-h2-t4',
        inputDisplay: 'findZeroSumSubarrays([1,-1,1,-1])',
        inputArgs: [[1,-1,1,-1]],
        expected: [[0,1],[0,3],[2,3]],
      },
    ],
    hints: [
      'Ключевая идея: prefix sum. Если prefixSum[i] === prefixSum[j] (j > i), то подмассив [i+1..j] имеет нулевую сумму.',
      'Храните Map<sum, number[]> — все индексы, где встречалась данная префиксная сумма (включая индекс -1 для суммы 0).',
      'Для каждого нового prefixSum смотрите в Map: если уже встречалась — добавьте все пары.',
    ],
    solutionCode: `function findZeroSumSubarrays(nums) {
  const map = new Map([[0, [-1]]]);
  let sum = 0;
  const result = [];

  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    if (map.has(sum)) {
      for (const j of map.get(sum)) {
        result.push([j + 1, i]);
      }
    }
    if (!map.has(sum)) map.set(sum, []);
    map.get(sum).push(i);
  }

  result.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return result;
}`,
  },
];
