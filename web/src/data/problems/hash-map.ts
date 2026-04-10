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
        expected: [1, 3],
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
];
